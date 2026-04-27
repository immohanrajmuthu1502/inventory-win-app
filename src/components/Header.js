import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "Products", path: "/products", icon: <InventoryIcon /> },
    // { label: "Add Product", path: "/add-product", icon: <AddBoxIcon /> },
    // { label: "Pricing", path: "/pricing", icon: <PriceCheckIcon /> },
    { label: "Billing", path: "/billing", icon: <PointOfSaleIcon /> },
    { label: "Reports", path: "/reports", icon: <AssessmentIcon /> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        {/* Logo / Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/appLogo.png"
            alt="logo"
            style={{
              height: 64,
              width: 64,
              objectFit: "contain",
            }}
          />

          {/* Optional text next to logo */}
          {/* <span style={{ marginLeft: 8, fontWeight: 600 }}>Kutty Couture</span> */}
        </Box>

        {/* Menu */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            gap: 1,
            backgroundColor: "#fafafa",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          }}
        >
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: isActive ? "#1976d2" : "#555",
                  backgroundColor: isActive ? "#e3f2fd" : "transparent",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
