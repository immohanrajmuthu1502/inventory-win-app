// src/pages/Dashboard.js
import React from "react";

const Dashboard = ({ products }) => {
  const totalProducts = products.length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Products: {totalProducts}</p>
    </div>
  );
};

export default Dashboard;