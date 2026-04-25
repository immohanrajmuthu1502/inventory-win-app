const StockAlert = ({ products }) => {
  const lowStock = products.filter(p => p.quantity < 10);

  return (
    <div>
      <h2>Low Stock Items</h2>
      {lowStock.map(p => (
        <p key={p.id}>{p.name} - {p.quantity}</p>
      ))}
    </div>
  );
};

export default StockAlert;