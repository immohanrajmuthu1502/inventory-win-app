import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box } from "@mui/material";

const SimpleProductForm = ({ onSave, editingProduct }) => {
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState({
    name: "",
    barcode: "",
    quantity: 0,
    price: 0,
    category: "No Category",
    minStock: 0,
  });

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        name: editingProduct.name || "",
        barcode: editingProduct.barcode || "",
        quantity: editingProduct.quantity || 0,
        price: editingProduct.price || 0,
        category: editingProduct.category || "No Category",
        minStock: editingProduct.minStock || 0,
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (product.quantity !== "" && product.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    if (product.price !== "" && product.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    if (product.minStock !== "" && product.minStock < 0) {
      newErrors.minStock = "Minimum stock cannot be negative";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSave({
      ...product,
      quantity: Number(product.quantity || 0),
      price: Number(product.price || 0),
      minStock: Number(product.minStock || 0),
    });

    setProduct({
      name: "",
      barcode: "",
      quantity: "",
      price: "",
      category: "No Category",
      minStock: "",
      pricing: {
        single: 0,
        packs: { 2: 0, 3: 0, 5: 0, 10: 0 },
      },
    });

    setErrors({});
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <TextField
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Barcode"
        name="barcode"
        value={product.barcode}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={product.quantity || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Price"
        name="price"
        type="number"
        value={product.price || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Category"
        name="category"
        value={product.category}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="No Category">No Category</MenuItem>
        <MenuItem value="Jabla">Jabla</MenuItem>
        <MenuItem value="Frock">Frock</MenuItem>
        <MenuItem value="Set">Set</MenuItem>
      </TextField>

      <TextField
        label="Minimum Stock"
        name="minStock"
        type="number"
        value={product.minStock || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Save Product
      </Button>
    </Box>
  );
};

export default SimpleProductForm;
