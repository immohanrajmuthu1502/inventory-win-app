import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";

function App() {
  const [products, setProducts] = useState(() => {
  const saved = localStorage.getItem("products");
  return saved ? JSON.parse(saved) : [];
});
const [search, setSearch] = useState("");
const [editingProduct, setEditingProduct] = useState(null);
const [selectedChannel, setSelectedChannel] = useState("online");
const [showPack, setShowPack] = useState(false);

  // ✅ Save data whenever products change
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

const addOrUpdateProduct = (product) => {
  if (editingProduct) {
    // 🔁 Update existing product
    setProducts(products.map(p =>
      p.id === editingProduct.id
        ? { ...product, id: p.id }
        : p
    ));

    // ✅ RESET editing state AFTER update
    setEditingProduct(null);

  } else {
    // ➕ Add new product
    setProducts([...products, { ...product, id: Date.now() }]);
  }
};

const totalProducts = products.length;

const totalStock = products.reduce(
  (sum, p) => sum + Number(p.quantity || 0),
  0
);

const totalProfit = products.reduce(
  (sum, p) => sum + Number(p.profit || 0),
  0
);

  return (
    <div>
      <h1>Kutty Couture Inventory</h1>
      <h2>Dashboard</h2>
      <p>Total Products: {totalProducts}</p>
      <p>Total Stock: {totalStock}</p>
      <p>Total Profit: ₹{totalProfit}</p>
      <ProductForm onAdd={addOrUpdateProduct} editingProduct={editingProduct} />

      <input
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Product List</h2>
      <h2>Total Products: {products.length}</h2>
      <div style={{ marginBottom: "10px" }}>
        <button  style={{ marginRight: "5px", background: selectedChannel === "online" ? "#b6efb2" : "" }} onClick={() => setSelectedChannel("online")}>Online</button>
        <button  style={{ marginRight: "5px", background: selectedChannel === "offline" ? "#b6efb2" : "" }}  onClick={() => setSelectedChannel("offline")}>Offline</button>
        <button  style={{ marginRight: "5px", background: selectedChannel === "local" ? "#b6efb2" : "" }} onClick={() => setSelectedChannel("local")}>Local</button>

        <button  style={{ marginRight: "5px" }} onClick={() => setShowPack(!showPack)}>
          {showPack ? "Hide Packs" : "Show Packs"}
        </button>
      </div>
        
      {products
         .filter(p =>
       p.name.toLowerCase().includes(search.toLowerCase())
       ).map((p) => (
     <div
  key={p.id}
  style={{
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    margin: "10px",
    width: "260px",
    display: "inline-block",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}
>
  <h3>{p.name}</h3>
  <p><b>Qty:</b> {p.quantity}</p>

{/* 🎯 Show selected channel only */}

  <p>
    <b>Price:</b> ₹{
        selectedChannel === "online"
        ? (p.customPrice || p.pricing?.online)
        : p.pricing?.[selectedChannel]
      }
  </p>
  {selectedChannel === "online" && p.customPrice && (
  <p style={{ color: "green" }}>
    ✏ Custom Price Applied
  </p>
)}

  <p>
    <b>Profit:</b> ₹{p.profit?.[selectedChannel]}
  </p>

  {showPack && (
  <div style={{ marginTop: "10px" }}>
    {/* <p>Pack 2: ₹{p.packPricing?.pack2} | Profit ₹{p.packProfit?.pack2}</p>
    <p>Pack 3: ₹{p.packPricing?.pack3} | Profit ₹{p.packProfit?.pack3}</p>
    <p>Pack 5: ₹{p.packPricing?.pack5} | Profit ₹{p.packProfit?.pack5}</p> */}
    <p>
      Pack 2: ₹{p.packPricing?.[selectedChannel]?.pack2} |
      Profit ₹{p.packProfit?.[selectedChannel]?.pack2}
    </p>

    <p>
      Pack 3: ₹{p.packPricing?.[selectedChannel]?.pack3} |
      Profit ₹{p.packProfit?.[selectedChannel]?.pack3}
    </p>
    
    <p>
      Pack 5: ₹{p.packPricing?.[selectedChannel]?.pack5} |
      Profit ₹{p.packProfit?.[selectedChannel]?.pack5}
    </p>


  </div>
)}

  {/* ⚠ Low stock */}
  {p.quantity < 15 && (
    <p style={{ color: "red" }}>⚠ Low Stock</p>
  )}


  <button  style={{ marginRight: "5px" }} onClick={() => setEditingProduct(p)}>Edit</button>
  <button onClick={() => deleteProduct(p.id)}>Delete</button>
</div>
))}
    </div>
  );
}

export default App;