import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { formatPaymentMode, normalizePaymentMode } from "../utils/paymentUtils";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const isToday = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.toDateString() === new Date().toDateString();
};

const getItemsCount = (bill) =>
  (bill.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);

const SummaryCard = ({ title, value, helper, icon, color = "#1976d2" }) => (
  <Box
    sx={{
      p: 2,
      border: "1px solid #e5e7eb",
      borderRadius: 2,
      backgroundColor: "#fff",
      minHeight: 118,
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ color }}>{icon}</Box>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      {helper}
    </Typography>
  </Box>
);

const Dashboard = ({ products = [], bills = [] }) => {
  const navigate = useNavigate();

  const insights = useMemo(() => {
    const todayBills = bills.filter((bill) => isToday(bill.date));
    const todayRevenue = todayBills.reduce(
      (sum, bill) => sum + Number(bill.total || 0),
      0,
    );
    const todayProfit = todayBills.reduce(
      (sum, bill) => sum + Number(bill.profit || 0),
      0,
    );
    const todayItems = todayBills.reduce(
      (sum, bill) => sum + getItemsCount(bill),
      0,
    );

    const lowStock = products
      .filter((product) => {
        const quantity = Number(product.quantity || 0);
        const minStock = Number(product.minStock || 10);
        return quantity <= minStock;
      })
      .sort((a, b) => Number(a.quantity || 0) - Number(b.quantity || 0));

    const outOfStock = products.filter(
      (product) => Number(product.quantity || 0) <= 0,
    );

    const paymentTotals = todayBills.reduce((acc, bill) => {
      const mode = normalizePaymentMode(bill.paymentMode);
      acc[mode] = (acc[mode] || 0) + Number(bill.total || 0);
      return acc;
    }, {});

    const productSales = new Map();
    todayBills.forEach((bill) => {
      (bill.items || []).forEach((item) => {
        const current = productSales.get(item.name) || {
          name: item.name,
          qty: 0,
          total: 0,
        };
        current.qty += Number(item.qty || 0);
        current.total += Number(item.total || 0);
        productSales.set(item.name, current);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const pricedProducts = products.filter(
      (product) => Number(product.pricing?.single || 0) > 0,
    ).length;

    const inventoryValue = products.reduce(
      (sum, product) =>
        sum + Number(product.quantity || 0) * Number(product.price || 0),
      0,
    );

    return {
      todayBills,
      todayRevenue,
      todayProfit,
      todayItems,
      lowStock,
      outOfStock,
      paymentTotals,
      topProducts,
      pricedProducts,
      inventoryValue,
    };
  }, [bills, products]);

  const pricingCoverage =
    products.length === 0
      ? 0
      : Math.round((insights.pricedProducts / products.length) * 100);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Today&apos;s sales, stock health, and inventory readiness.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button variant="contained" onClick={() => navigate("/billing")}>
            New Bill
          </Button>
          <Button variant="outlined" onClick={() => navigate("/reports")}>
            Reports
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 2,
        }}
      >
        <SummaryCard
          title="Today Sales"
          value={insights.todayBills.length}
          helper={`${insights.todayItems} items sold today`}
          icon={<PointOfSaleIcon fontSize="large" />}
        />
        <SummaryCard
          title="Today Revenue"
          value={formatCurrency(insights.todayRevenue)}
          helper={`Profit ${formatCurrency(insights.todayProfit)}`}
          icon={<TrendingUpIcon fontSize="large" />}
          color="#2e7d32"
        />
        <SummaryCard
          title="Total Products"
          value={products.length}
          helper={`${pricingCoverage}% have selling price set`}
          icon={<InventoryIcon fontSize="large" />}
          color="#6a1b9a"
        />
        <SummaryCard
          title="Low Stock"
          value={insights.lowStock.length}
          helper={`${insights.outOfStock.length} out of stock`}
          icon={<WarningAmberIcon fontSize="large" />}
          color="#d32f2f"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
          gap: 2,
        }}
      >
        <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6">Today Sales Details</Typography>
            <Chip
              size="small"
              label={formatCurrency(insights.todayRevenue)}
              color="success"
              variant="outlined"
            />
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="center">Items</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {insights.todayBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No sales recorded today
                    </TableCell>
                  </TableRow>
                ) : (
                  insights.todayBills.slice(0, 6).map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        {new Date(bill.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{bill.customer?.name || "Walk-in"}</TableCell>
                      <TableCell>{formatPaymentMode(bill.paymentMode)}</TableCell>
                      <TableCell align="center">{getItemsCount(bill)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(bill.total)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
          <Typography variant="h6">Low Quantity Alerts</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Uses each product&apos;s min stock, or 10 when not set.
          </Typography>
          {insights.lowStock.length === 0 ? (
            <Typography color="success.main">All stock levels look good.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {insights.lowStock.slice(0, 6).map((product) => {
                const quantity = Number(product.quantity || 0);
                const minStock = Number(product.minStock || 10);
                const severity = quantity <= 0 ? "error" : "warning";

                return (
                  <Box
                    key={product.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }} noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Min stock: {minStock}
                      </Typography>
                    </Box>
                    <Chip
                      color={severity}
                      size="small"
                      label={`${quantity} left`}
                    />
                  </Box>
                );
              })}
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate("/products")}
              >
                Manage Stock
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
          <Typography variant="h6">Top Products Today</Typography>
          <Divider sx={{ my: 1 }} />
          {insights.topProducts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No product sales yet today.
            </Typography>
          ) : (
            insights.topProducts.map((item) => (
              <Box
                key={item.name}
                sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}
              >
                <Typography>{item.name}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{item.qty} sold</Typography>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
          <Typography variant="h6">Payment Split Today</Typography>
          <Divider sx={{ my: 1 }} />
          {Object.keys(insights.paymentTotals).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No payments recorded today.
            </Typography>
          ) : (
            Object.entries(insights.paymentTotals).map(([mode, amount]) => (
              <Box
                key={mode}
                sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}
              >
                <Typography>{formatPaymentMode(mode)}</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatCurrency(amount)}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
          <Typography variant="h6">Inventory Readiness</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Pricing coverage
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={pricingCoverage}
              sx={{ flex: 1, height: 8, borderRadius: 1 }}
            />
            <Typography sx={{ fontWeight: 600 }}>{pricingCoverage}%</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Stock purchase value
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>
            {formatCurrency(insights.inventoryValue)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
