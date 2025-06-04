import React, { useEffect, useState } from 'react';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../../api';
import DatePicker from 'react-datepicker';
import SweetAlert from 'sweetalert2';
import 'react-datepicker/dist/react-datepicker.css';
import './Budget.css';

const Budgets = () => {
  // State variables
  const [budgets, setBudgets] = useState([]); // Stores fetched budget data
  const [amount, setAmount] = useState(''); // Input state for budget amount
  const [date, setDate] = useState(null); // Input state for selected month/year
  const [showList, setShowList] = useState(false); // Toggles between add form and list view

  // Function to load budgets from API
  const loadBudgets = async () => {
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      // Show error alert if fetching fails
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error fetching budgets.',
      });
    }
  };

  // Handles budget creation form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!amount || !date) {
      SweetAlert.fire({
        icon: 'warning',
        title: 'Input Error',
        text: 'Please fill out all fields!',
      });
      return;
    }

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    try {
      await createBudget({ amount, month, year }); // API call to create budget
      setAmount('');
      setDate(null);

      SweetAlert.fire({
        icon: 'success',
        title: 'Budget Created',
        text: 'Your budget has been successfully created.',
      });

      loadBudgets(); // Reload the updated budget list
    } catch (err) {
      // Show error if creation fails
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error creating the budget.',
      });
    }
  };

  // Handles updating a budget
  const handleUpdate = async (budgetId) => {
    const { value: newAmount } = await SweetAlert.fire({
      title: 'Update Budget Amount',
      input: 'number',
      inputLabel: 'Enter the new amount',
      inputPlaceholder: 'New amount',
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) return 'Amount is required!';
        if (isNaN(value) || value <= 0) return 'Please enter a valid positive number!';
        return null;
      },
    });

    if (!newAmount) return;

    try {
      await updateBudget(budgetId, { amount: newAmount }); // API call to update budget
      SweetAlert.fire({
        icon: 'success',
        title: 'Budget Updated',
        text: 'Your budget has been updated successfully.',
      });

      loadBudgets(); // Reload updated list
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error updating the budget.',
      });
    }
  };

  // Handles deleting a budget
  const handleDelete = async (budgetId) => {
    const result = await SweetAlert.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this budget!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteBudget(budgetId); // API call to delete budget
        SweetAlert.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The budget has been deleted.',
        });

        loadBudgets(); // Reload updated list
      } catch (err) {
        SweetAlert.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error deleting the budget.',
        });
      }
    }
  };

  // Load budgets on component mount
  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <div className="budgets-container">
      <h2 className="budgets-title">Budgets</h2>

      {/* Toggle between form and list view */}
      <button className="toggle-button" onClick={() => setShowList(!showList)}>
        {showList ? 'Add Budget' : 'Budget List'}
      </button>

      {/* Budget creation form */}
      {!showList && (
        <form className="budget-form" onSubmit={handleSubmit}>
          <input
            className="budget-input"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <label>Date:</label>
          <DatePicker
            className="budget-input"
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            required
          />
          <button type="submit" className="budget-button">Add Budget</button>
        </form>
      )}

      {/* Budget list table */}
      {showList && (
        <div className="budget-table-wrapper">
          <table className="budget-table">
            <thead>
              <tr>
                <th>Budget</th>
                <th>Month/Year</th>
                <th className="action-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>{budget.amount}</td>
                  <td>{budget.month}/{budget.year}</td>
                  <td className="action-buttons">
                    {/* Edit Button */}
                    <button
                      className="icon-button edit"
                      onClick={() => handleUpdate(budget.id)}
                      title="Edit"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    {/* Delete Button */}
                    <button
                      className="icon-button delete"
                      onClick={() => handleDelete(budget.id)}
                      title="Delete"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Budgets;
