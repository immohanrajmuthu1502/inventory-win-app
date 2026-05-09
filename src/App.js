import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { normalizeAppSettings } from "./utils/appSettings";

// Lazy load all page components for better startup performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Billing = lazy(() => import("./pages/Billing"));
const StockAlert = lazy(() => import("./pages/StockAlert"));
const Settings = lazy(() => import("./pages/Settings"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Reports = lazy(() => import("./pages/Reports"));
const Invoice = lazy(() => import("./pages/Invoice"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "16px",
    color: "#666"
  }}>
    Loading...
  </div>
);

function App() {
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [settings, setSettings] = useState(normalizeAppSettings());
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
      setSettings(normalizeAppSettings(data.settings));
    } else {
      setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
      setBills(JSON.parse(localStorage.getItem("bills") || "[]"));
      setSettings(
        normalizeAppSettings(
          JSON.parse(localStorage.getItem("settings") || "{}"),
        ),
      );
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

useEffect(() => {
  if (!isLoaded) return;

  if (window.electronAPI?.setData) {
    window.electronAPI.setData("settings", settings);
  } else {
    localStorage.setItem("settings", JSON.stringify(settings));
  }
}, [settings, isLoaded]);

  return (
    <Router>
      <Header settings={settings} />

      <div style={{ padding: "20px" }}>
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard products={products} bills={bills} />} />
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
              <Billing
                products={products}
                setProducts={setProducts}
                bills={bills}
                setBills={setBills}
                settings={settings}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <Reports
                bills={bills}
                setBills={setBills}
                settings={settings}
              />
            }
          />
          <Route path="/alerts" element={<StockAlert products={products} />} />
          <Route
            path="/settings"
            element={
              <Settings
                products={products}
                bills={bills}
                settings={settings}
                setSettings={setSettings}
              />
            }
          />
          <Route path="/invoice" element={<Invoice settings={settings} />} />
        </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
export default App;
