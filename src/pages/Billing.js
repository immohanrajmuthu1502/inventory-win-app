import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import { getBestPriceWithBreakdown } from "../utils/pricingUtils";

const Billing = ({ products }) => {
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedId);

  // 🔥 calculate price
  const pricing = selectedProduct?.pricing;

  const preview = pricing
    ? getBestPriceWithBreakdown(qty, pricing)
    : { total: 0, breakdown: "" };

  const costPerUnit = Number(selectedProduct?.price || 0);
  const totalCost = costPerUnit * qty;

  const profit = preview.total - totalCost;

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
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const product = products.find((p) => p.id === item.productId);
        if (!product) return item;

        return {
          ...item,
          ...recalcItem(product, Math.max(1, newQty)),
        };
      }),
    );
  };

  const clearCart = () => setCart([]);

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
  };

  // 🧮 totals
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalProfit = cart.reduce((sum, item) => sum + item.profit, 0);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Billing
      </Typography>

      {/* Product Select */}
      <TextField
        select
        label="Select Product"
        fullWidth
        margin="normal"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Quantity */}
      <TextField
        label="Quantity"
        type="number"
        fullWidth
        margin="normal"
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
      />

      {/* Preview */}
      <Typography sx={{ mt: 2 }}>
        <b>Total Price:</b> ₹{preview.total}
      </Typography>

      <Typography>
        <b>Breakdown:</b> {preview.breakdown || "-"}
      </Typography>

      <Typography>
        <b>Profit:</b>{" "}
        <span style={{ color: profit >= 0 ? "green" : "red" }}>₹{profit}</span>
      </Typography>

      {/* Add */}
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={addToCart}>
        Add to Cart
      </Button>

      {/* Cart */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Cart
      </Typography>

      {cart.map((item) => (
        <Box key={item.id} sx={{ border: "1px solid #ddd", p: 2, mt: 1 }}>
          <Typography>
            <b>{item.name}</b>
          </Typography>

          {/* Editable Qty */}
          <TextField
            type="number"
            size="small"
            value={item.qty}
            onChange={(e) => updateQty(item.id, Number(e.target.value || 1))}
            sx={{ width: 80, mt: 1 }}
          />

          <Typography>₹{item.total}</Typography>

          <Typography sx={{ fontSize: 12 }}>{item.breakdown}</Typography>

          {/* <Typography>
            Profit:{" "}
            <span style={{ color: item.profit >= 0 ? "green" : "red" }}>
              ₹{item.profit}
            </span>
          </Typography> */}

          {/* Remove */}
          <Button
            color="error"
            size="small"
            onClick={() => removeItem(item.id)}
          >
            Remove
          </Button>
        </Box>
      ))}

      {/* Summary */}
      <Box sx={{ mt: 3 }}>
        <Typography>
          <b>Grand Total:</b> ₹{grandTotal}
        </Typography>

        <Typography>
          <b>Total Profit:</b>{" "}
          <span style={{ color: totalProfit >= 0 ? "green" : "red" }}>
            ₹{totalProfit}
          </span>
        </Typography>
      </Box>
      <Button
        variant="outlined"
        color="error"
        fullWidth
        sx={{ mt: 2 }}
        onClick={clearCart}
      >
        Clear Cart
      </Button>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setShowInvoice(true)}
      >
        Generate Invoice
      </Button>
      {showInvoice && (
  <Box sx={{ mt: 4, p: 2, border: "2px solid black" }}>
    <Typography variant="h6">Invoice</Typography>

    {cart.map((item) => (
      <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>{item.name} × {item.qty}</span>
        <span>₹{item.total}</span>
      </Box>
    ))}

    <hr />

    <Typography>
      <b>Total:</b> ₹{grandTotal}
    </Typography>

    <Typography>
      <b>Profit:</b> ₹{totalProfit}
    </Typography>

    <Button
      variant="outlined"
      sx={{ mt: 2 }}
      onClick={() => window.print()}
    >
      Print
    </Button>
  </Box>
)}
    </Box>
  );
};

export default Billing;
