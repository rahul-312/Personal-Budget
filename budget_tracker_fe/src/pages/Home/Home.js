// ./pages/Home/Home.js
import React from 'react';
import './Home.css';  // Importing the CSS for the page styling

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Your Expense Tracker</h1>
        <p className="home-description">
          Effortlessly manage your finances. Track your expenses, set budgets, and stay on top of your spending.
        </p>
        <p className="home-note">
          Start by adding your first expense or setting a monthly budget goal to keep your finances under control.
        </p>
      </div>
    </div>
  );
};

export default Home;
