import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// API functions
import { fetchTransactionById, updateTransaction, fetchCategories } from '../../api';
// Styles
import './EditTransactionPage.css';

const EditTransactionPage = () => {
  const { id } = useParams();              // Get transaction ID from route parameters
  const navigate = useNavigate();          // Used for navigation after update

  // Component state
  const [transaction, setTransaction] = useState(null); // Holds transaction details
  const [categories, setCategories] = useState([]);     // Holds available category options
  const [loading, setLoading] = useState(false);        // Controls loading state
  const [error, setError] = useState('');               // Error message to display
  const [successMessage, setSuccessMessage] = useState(''); // Success message

  // Load data on mount and when ID changes
  useEffect(() => {
    loadTransaction();
    loadCategories();
  }, [id]);

  // Fetch transaction details by ID
  const loadTransaction = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactionById(id);
      setTransaction(data);
    } catch (err) {
      setError('Error fetching transaction details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available categories
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError('Error fetching categories.');
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value,
    });
  };

  // Handle form submission to update the transaction
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();           // Prevent form default reload behavior
    setLoading(true);
    setSuccessMessage('');
    try {
      await updateTransaction(id, transaction);
      setSuccessMessage('Transaction updated successfully!');
      navigate('/transactions'); // Redirect to transactions list after update
    } catch (err) {
      setError('Error updating transaction.');
    } finally {
      setLoading(false);
    }
  };

  // Display loading state
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Transaction</h1>

      {/* Error and Success Messages */}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      {/* Transaction Edit Form */}
      <form onSubmit={handleUpdateTransaction}>
        {/* Amount Field */}
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={transaction?.amount || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={transaction?.category || ''}
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
            value={transaction?.description || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Date Picker */}
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={transaction?.date || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Transaction'}
        </button>
      </form>
    </div>
  );
};

export default EditTransactionPage;
