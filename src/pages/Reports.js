const Reports = ({ products }) => {
  const totalProfit = products.reduce(
    (sum, p) => sum + Number(p.profit?.online || 0),
    0
  );

  return (
    <div>
      <h2>Reports</h2>
      <p>Total Profit: ₹{totalProfit}</p>
    </div>
  );
};

export default Reports;