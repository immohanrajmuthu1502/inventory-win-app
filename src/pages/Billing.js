import React, { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import { getBestPriceWithBreakdown } from "../utils/pricingUtils";

const Billing = ({ products }) => {
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);

  const selectedProduct = products.find((p) => p.id === selectedId);

  // 🔥 calculate price
  const pricing = selectedProduct?.pricing;

  const preview = pricing
    ? getBestPriceWithBreakdown(qty, pricing)
    : { total: 0, breakdown: "" };

  const costPerUnit = Number(selectedProduct?.price || 0);
  const totalCost = costPerUnit * qty;

  const profit = preview.total - totalCost;

  // ➕ Add to cart
  const addToCart = () => {
    if (!selectedProduct || qty <= 0) return;

    setCart((prev) => [
      ...prev,
      {
        id: Date.now(),
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
        onChange={(e) =>
          setQty(Math.max(1, Number(e.target.value || 1)))
        }
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
        <span style={{ color: profit >= 0 ? "green" : "red" }}>
          ₹{profit}
        </span>
      </Typography>

      {/* Add */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={addToCart}
      >
        Add to Cart
      </Button>

      {/* Cart */}
      <Typography variant="h6" sx={{ mt: 4 }}>
        Cart
      </Typography>

      {cart.map((item) => (
        <Box
          key={item.id}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            mt: 1,
          }}
        >
          <Typography>
            <b>{item.name}</b> × {item.qty}
          </Typography>

          <Typography>₹{item.total}</Typography>

          <Typography sx={{ fontSize: 12 }}>
            {item.breakdown}
          </Typography>

          <Typography>
            Profit:{" "}
            <span
              style={{
                color: item.profit >= 0 ? "green" : "red",
              }}
            >
              ₹{item.profit}
            </span>
          </Typography>
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
    </Box>
  );
};

export default Billing;