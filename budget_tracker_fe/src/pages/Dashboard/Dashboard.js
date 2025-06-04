import React, { useEffect, useState } from 'react';
// API calls to fetch various dashboard data
import { fetchBudgetSummary, fetchSpendingByCategory, fetchTotalExpensesOverTime } from '../../api';
// D3 components for visualizations
import D3PieChart from '../../components/D3PieChart';
// import D3LineChart from '../../components/D3LineChart'; // Uncomment if needed in future
import D3BarChart from '../../components/D3BarChart';
// Styles
import './Dashboard.css';

const Dashboard = () => {
  // State for budget summary (budget, spent, remaining)
  const [summary, setSummary] = useState(null);
  // State for spending data grouped by category for pie chart
  const [categoryData, setCategoryData] = useState([]);
  // State for total expenses over time for bar chart
  const [expensesData, setExpensesData] = useState([]);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch overall budget summary (budget, spent, remaining)
        const summaryData = await fetchBudgetSummary();
        setSummary(summaryData);

        // Fetch category-wise spending data
        const spendingData = await fetchSpendingByCategory();
        if (Array.isArray(spendingData)) {
          // Format data for D3 pie chart
          const formattedData = spendingData.map((category) => ({
            name: category.category || 'Unknown', // Default to 'Unknown' if category is missing
            value: category.amount || 0,          // Default to 0 if amount is missing
          }));
          setCategoryData(formattedData);
        }

        // Fetch expenses over time (monthly)
        const totalExpensesData = await fetchTotalExpensesOverTime();
        if (Array.isArray(totalExpensesData)) {
          // Format data for D3 bar chart
          const formattedExpensesData = totalExpensesData.map((expense) => ({
            date: expense.month,            // Used as x-axis value
            value: expense.total_spent,     // Used as y-axis value
          }));
          setExpensesData(formattedExpensesData);
        }
      } catch (err) {
        // Log and alert on failure
        console.error('Error loading dashboard data', err);
        alert('An error occurred while loading data. Please try again later.');
      }
    };

    loadData(); // Call the data loading function
  }, []);

  return (
    <div className="dashboard">
      {/* Summary Box */}
      <div className="budget-summary-box">
        <h3>Budget Summary</h3>
        {summary ? (
          <ul>
            <li><strong>Budget:</strong> ₹{summary.budget_amount}</li>
            <li><strong>Spent:</strong> ₹{summary.spent_amount}</li>
            <li><strong>Remaining:</strong> ₹{summary.remaining_amount}</li>
          </ul>
        ) : (
          <p>Loading summary...</p>
        )}
      </div>

      <h1>Dashboard</h1>

      {/* Chart Section */}
      <div className="chart-container">
        {/* Pie Chart: Spending by Category */}
        <div className="pie-chart-box">
          <h3>Spending by Category</h3>
          {categoryData.length ? (
            <D3PieChart data={categoryData} width={400} height={400} />
          ) : (
            <p>No spending data available</p>
          )}
        </div>

        {/* Bar Chart: Total Expenses Over Time */}
        <div className="line-chart-box">
          <h3>Total Expenses Over Time</h3>
          {expensesData.length ? (
            <D3BarChart data={expensesData} width={600} height={400} />
          ) : (
            <p>No expense data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
