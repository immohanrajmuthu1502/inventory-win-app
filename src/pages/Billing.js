import React, { useState, useEffect, useMemo } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { getBestPriceWithBreakdown } from "../utils/pricingUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Billing = ({ products,bills, setBills }) => {
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState(1);
  const [showInvoice, setShowInvoice] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const selectedProduct = products.find((p) => p.id === selectedId);
  const isPriced = Number(selectedProduct?.pricing?.single || 0) > 0;

  // 🔥 calculate price
  const pricing = selectedProduct?.pricing;

  const preview = useMemo(() => {
    if (!pricing) return { total: 0, breakdown: "" };
    return getBestPriceWithBreakdown(qty, pricing);
  }, [qty, pricing]);

  const costPerUnit = Number(selectedProduct?.price || 0);
  const totalCost = costPerUnit * qty;

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalProfit = cart.reduce((sum, item) => sum + item.profit, 0);

  const profit = preview.total - totalCost;
  const taxAmount = (grandTotal * taxPercent) / 100;
  const discountAmount = (grandTotal * discountPercent) / 100;

  const finalTotal = grandTotal + taxAmount - discountAmount;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return [];

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.barcode?.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [debouncedSearch, products]);

  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);
  const recalcItem = (product, qty) => {
    const preview = getBestPriceWithBreakdown(qty, product.pricing);
    const cost = Number(product.price || 0) * qty;
    const profit = preview.total - cost;

    return {
      qty,
      total: preview.total,
      cost,
      profit,
      breakdown: preview.breakdown,
    };
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, newQty) => {
    const safeQty = Math.max(1, newQty);

    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const product = products.find((p) => p.id === item.productId);
        if (!product) return item;

        return {
          ...item,
          ...recalcItem(product, safeQty),
        };
      }),
    );
  };

  const handleClearCart = () => {
    if (window.confirm("Clear all items?")) {
      setCart([]);
      localStorage.removeItem("cart"); // 🔥 important
    }
  };
  const saveBill = () => {
    if (cart.length === 0) return;

    const newBill = {
      id: Date.now(),
      items: cart,
      total: finalTotal,
      profit: totalProfit,
      date: new Date().toLocaleString(),

      // ✅ NEW FIELDS
      customer: {
        name: customerName,
        phone: phone,
        email: email,
      },

      paymentMode: paymentMode,
    };

    setBills((prev) => [newBill, ...prev]);

    handleClearCart();

    // reset customer fields (optional)
    setCustomerName("");
    setPhone("");
    setEmail("");
  };

  const handleSaveAndPrint = () => {
    saveBill();

    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleSaveOnly = () => {
    saveBill();
    alert("Bill saved!");
  };

  // ➕ Add to cart
  const addToCart = () => {
    if (!selectedProduct || qty <= 0) return;

    setCart((prev) => [
      ...prev,
      {
        id: Date.now(),
        productId: selectedProduct.id,
        name: selectedProduct.name,
        qty,
        total: preview.total,
        cost: totalCost,
        profit,
        breakdown: preview.breakdown,
      },
    ]);
    setQty(1);
    setSearchText("");
    setSelectedId("");
  };

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      {/* LEFT SIDE */}
      <Box sx={{ flex: 2 }}>
        {/* Product Search */}
        <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6">🔍 Product Search</Typography>
          {selectedProduct && !isPriced && (
            <Typography color="error" sx={{ mt: 1 }}>
              ⚠ Please set price before adding to cart
            </Typography>
          )}
          {/* FLEX ROW */}
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            {/* LEFT SIDE (search + dropdown) */}
            <Box sx={{ flex: 1, position: "relative" }}>
              {/* Search Input */}
              <TextField
                fullWidth
                placeholder="Search by product name, barcode..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {/* 🔽 DROPDOWN BELOW INPUT */}
              {debouncedSearch && filteredProducts.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    mt: 0.5,
                    maxHeight: 200,
                    overflowY: "auto",
                    backgroundColor: "#fff",
                    zIndex: 10,
                  }}
                >
                  {filteredProducts.map((p) => (
                    <Box
                      key={p.id}
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onClick={() => {
                        setSelectedId(p.id);
                        setSearchText(p.name);
                        setDebouncedSearch(""); 
                      }}
                    >
                      {p.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* RIGHT SIDE BUTTON */}
            <Button
              variant="contained"
              onClick={addToCart}
              disabled={!selectedProduct || !isPriced}
            >
              ➕ Add to Cart
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6">🛍 Shopping Cart ({cart.length})</Typography>
          <TableContainer
            sx={{ mt: 2, border: "1px solid #ddd", borderRadius: 2 }}
          >
            <Table size="small">
              {/* HEADER */}
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="center">Unit Price</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Profit</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              {/* BODY */}
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No items in cart
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <b>{item.name}</b>
                        <div style={{ fontSize: 11, color: "#777" }}>
                          {item.breakdown}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(item.id, Number(e.target.value || 1))
                          }
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        ₹{Math.round(item.total / item.qty)}
                      </TableCell>
                      <TableCell align="center">₹{item.total}</TableCell>
                      <TableCell align="center">₹{item.profit}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>{" "}
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography>Subtotal: ₹{grandTotal}</Typography>

          {/* Tax */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography>Tax:</Typography>
            <TextField
              size="small"
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value || 0))}
              sx={{ mx: 1, width: 80 }}
            />
          </Box>

          <Typography>Tax Amount: ₹{taxAmount}</Typography>

          {/* Discount */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography>Discount:</Typography>
            <TextField
              size="small"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value || 0))}
              sx={{ mx: 1, width: 80 }}
            />
          </Box>

          <Typography color="red">Discount: ₹{discountAmount}</Typography>

          <hr />

          <Typography variant="h5" color="green">
            Total: ₹{finalTotal}
          </Typography>
        </Box>
        <Box sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6">💳 Payment Details</Typography>

          {/* Payment Method */}
          <Box sx={{ mt: 1 }}>
            <label>
              <input
                type="radio"
                name="payment"
                checked={paymentMode === "cash"}
                onChange={() => setPaymentMode("cash")}
              />{" "}
              Cash
            </label>

            <label style={{ marginLeft: 20 }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMode === "card"}
                onChange={() => setPaymentMode("card")}
              />{" "}
              UPI
            </label>
          </Box>

          {/* Customer Info */}
          <TextField
            fullWidth
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 1 }}
          />

          {/* Actions */}
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={handleSaveAndPrint}
          >
            💾 Save & Print
          </Button>

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button fullWidth variant="outlined" onClick={handleSaveOnly}>
              Save Only
            </Button>

            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Billing;
