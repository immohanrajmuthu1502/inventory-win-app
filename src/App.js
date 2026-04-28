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
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem("bills");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState("online");
  const [showPack, setShowPack] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const data = window.electronAPI
        ? await window.electronAPI.getData("products")
        : JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const loadBills = async () => {
      const data = window.electronAPI
        ? await window.electronAPI.getData("bills")
        : JSON.parse(localStorage.getItem("bills") || "[]");
      setBills(data || []);
    };
    loadBills();
  }, []);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setData("products", products);
    } else {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setData("bills", bills);
    } else {
      localStorage.setItem("bills", JSON.stringify(bills));
    }
  }, [bills]);

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0,
  );

  const totalProfit = products.reduce(
    (sum, p) => sum + Number(p.profit || 0),
    0,
  );

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
