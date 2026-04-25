import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuStyle = (path) => ({
    marginRight: "20px",
    textDecoration: "none",
    fontWeight: "500",
    color: location.pathname === path ? "#710be7" : "#555",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Logo / App Name */}
      <h2 style={{ marginRight: "40px" }}>Kutty Couture</h2>

      {/* Menu */}
      <Link to="/" style={menuStyle("/")}>Dashboard</Link>
      <Link to="/products" style={menuStyle("/products")}>Products</Link>
      <Link to="/billing" style={menuStyle("/billing")}>Billing</Link>
      <Link to="/reports" style={menuStyle("/reports")}>Reports</Link>
      <Link to="/alerts" style={menuStyle("/alerts")}>Stock Alert</Link>
      <Link to="/settings" style={menuStyle("/settings")}>Settings</Link>
      <Link to="/pricing" style={menuStyle("/pricing")}>Pricing</Link>
      <div style={{ marginLeft: "auto" }}>
            <button onClick={() => navigate("/add-product")} style={{ padding: "8px 16px", cursor: "pointer" }}>+ Add Product</button>
       </div>
    </div>
  );
};

export default Header;