import React, { useEffect, useState } from 'react';
import {
  fetchTransactions,
  createTransaction,
  fetchCategories,
  deleteTransaction
} from '../../api';
import { useNavigate } from 'react-router-dom';
import SweetAlert from 'sweetalert2';
import './Transactions.css';

// TransactionsPage component to manage listing, creating, and deleting transactions
const TransactionsPage = () => {
  const navigate = useNavigate();

  // State hooks
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);         // Tracks loading state for API calls
  const [showList, setShowList] = useState(false);       // Toggles between transaction form and list

  // Load transactions and categories on component mount
  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  // Fetch all transactions from the server
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching transactions.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available categories from the server
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching categories.',
      });
    }
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  // Handle submission of new transaction
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransaction(newTransaction);
      SweetAlert.fire({
        icon: 'success',
        title: 'Success',
        text: 'Transaction created and budget updated!',
      });
      // Reset form after success
      setNewTransaction({ amount: '', category: '', description: '', date: '' });
      loadTransactions(); // Refresh list
      setShowList(true);  // Switch to list view
    } catch (err) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error creating transaction.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of a transaction
  const handleDeleteTransaction = async (id) => {
    const result = await SweetAlert.fire({
      title: 'Are you sure?',
      text: 'This transaction will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteTransaction(id);
        SweetAlert.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Transaction deleted successfully.',
        });
        loadTransactions(); // Refresh list
      } catch (err) {
        SweetAlert.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error deleting transaction.',
        });
      }
    }
  };

  // Navigate to the edit transaction page
  const handleEditTransaction = (id) => {
    navigate(`/transactions/${id}/edit`);
  };

  // Render the TransactionsPage UI
  return (
    <div className="transactions-container">
      <h1>Transactions</h1>

      {/* Toggle button to switch between form and list */}
      <button onClick={() => setShowList(!showList)} className="toggle-button">
        {showList ? 'Add New Transaction' : 'Transactions List'}
      </button>

      {/* Show transaction list */}
      {showList ? (
        <>
          <h2>Transaction List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.amount}</td>
                      <td>{transaction.category_display}</td>
                      <td>{transaction.description}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        {/* Edit Button */}
                        <button
                          className="icon-button edit"
                          onClick={() => handleEditTransaction(transaction.id)}
                          title="Edit"
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="icon-button delete"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          title="Delete"
                        >
                          <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      ) : (
        // Show transaction creation form
        <>
          <h2>Create New Transaction</h2>
          <form onSubmit={handleCreateTransaction}>
            {/* Amount Field */}
            <div>
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Date Field */}
            <div>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Transaction'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
