import React, { useEffect, useState } from 'react';
import { fetchBudgetSummary, fetchSpendingByCategory, fetchTotalExpensesOverTime } from '../../api';
import D3PieChart from '../../components/D3PieChart';
// import D3LineChart from '../../components/D3LineChart';
import D3BarChart from '../../components/D3BarChart';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const summaryData = await fetchBudgetSummary();
        setSummary(summaryData);

        const spendingData = await fetchSpendingByCategory();
        if (Array.isArray(spendingData)) {
          const formattedData = spendingData.map((category) => ({
            name: category.category || 'Unknown',
            value: category.amount || 0,
          }));
          setCategoryData(formattedData);
        }

        const totalExpensesData = await fetchTotalExpensesOverTime();
        if (Array.isArray(totalExpensesData)) {
          const formattedExpensesData = totalExpensesData.map((expense) => ({
            date: expense.month, // D3LineChart will use this as x-axis
            value: expense.total_spent,
          }));
          setExpensesData(formattedExpensesData);
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
        alert('An error occurred while loading data. Please try again later.');
      }
    };

    loadData();
  }, []);

  return (
    <div className="dashboard">
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

<div className="chart-container">
  <div className="pie-chart-box">
    <h3>Spending by Category</h3>
    {categoryData.length ? (
      <D3PieChart data={categoryData} width={400} height={400} />
    ) : (
      <p>No spending data available</p>
    )}
  </div>

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
