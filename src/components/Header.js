import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { normalizeAppSettings } from "../utils/appSettings";

const Header = ({ settings }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const appSettings = normalizeAppSettings(settings);
  const logoSrc = appSettings.billLogo || `${process.env.PUBLIC_URL}/appLogo.png`;
  const [openAbout, setOpenAbout] = useState(false);

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
    <>
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
              src={logoSrc}
              alt={appSettings.shopName || "App logo"}
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

          {/* About Button */}
          <IconButton
            onClick={() => setOpenAbout(true)}
            sx={{
              color: "#555",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            title="About"
          >
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* About Dialog */}
      <Dialog open={openAbout} onClose={() => setOpenAbout(false)} maxWidth="sm">
        <DialogTitle>About Kutty Couture Inventory</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>Application Name:</strong> Kutty Couture Inventory Manager
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Version:</strong> 1.0.0
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Purpose:</strong> Complete inventory, billing, and reporting
              solution for retail businesses
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Developer:</strong> Kutty Couture Team
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Features:</strong> Product management, billing, inventory
              tracking, daily reports, and data backup & restore
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 3, color: "#999" }}
            >
              © 2026 Kutty Couture. All rights reserved.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAbout(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
