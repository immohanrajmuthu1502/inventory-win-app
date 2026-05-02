import React, { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import { Link } from "react-router-dom";
import Header from "./components/Header";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import StockAlert from "./pages/StockAlert";
import Settings from "./pages/Settings";
import AddProduct from "./pages/AddProduct";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import Invoice from "./pages/Invoice";

function App() {
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  //   const [products, setProducts] = useState(() => {
  //   const saved = localStorage.getItem("products");
  //   return saved ? JSON.parse(saved) : [];
  // });

  // const [bills, setBills] = useState(() => {
  //   const saved = localStorage.getItem("bills");
  //   return saved ? JSON.parse(saved) : [];
  // });

  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState("online");
  const [showPack, setShowPack] = useState(false);

  useEffect(() => {
 const loadData = async () => {
  try {
    if (window.electronAPI?.getData) {
      const data = await window.electronAPI.getData();
      setProducts(data.products || []);
      setBills(data.bills || []);
    } else {
      setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
      setBills(JSON.parse(localStorage.getItem("bills") || "[]"));
    }

    setIsLoaded(true);

  } catch (err) {
    console.error("Load error:", err);
  }
};

  loadData();
}, []);

 useEffect(() => {
  if (!isLoaded) return;

  if (window.electronAPI?.setData) {
    window.electronAPI.setData("products", products);
  } else {
    localStorage.setItem("products", JSON.stringify(products));
  }
}, [products, isLoaded]);

useEffect(() => {
  if (!isLoaded) return;

  if (window.electronAPI?.setData) {
    window.electronAPI.setData("bills", bills);
  } else {
    localStorage.setItem("bills", JSON.stringify(bills));
  }
}, [bills, isLoaded]);

  return (
    <Router>
      <Header />

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard products={products} />} />
          <Route
            path="/add-product"
            element={
              <AddProduct
                products={products}
                setProducts={setProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
              />
            }
          />
          <Route
            path="/products"
            element={
              <Products
                products={products}
                setProducts={setProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
              />
            }
          />
          <Route
            path="/pricing"
            element={<Pricing products={products} setProducts={setProducts} />}
          />
          <Route
            path="/billing"
            element={
              <Billing products={products} bills={bills} setBills={setBills} />
            }
          />
          <Route path="/reports" element={<Reports bills={bills} />} />
          <Route path="/alerts" element={<StockAlert products={products} />} />
          <Route
            path="/settings"
            element={<Settings products={products} bills={bills} />}
          />
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
