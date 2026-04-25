import React, { useState, useEffect } from "react";
import SimpleProductForm from "../components/SimpleProductForm";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const AddProduct = ({
  products,
  setProducts,
  editingProduct,
  setEditingProduct,
}) => {
  const handleSave = (product) => {
    const editing = !!editingProduct; // capture BEFORE reset

    if (editing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...product, id: p.id } : p,
        ),
      );
      setEditingProduct(null);
    } else {
      setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
    }

    setIsEditMode(editing); // ✅ store mode
    setOpenSnackbar(true);
  };
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    if (!editingProduct && openSnackbar) {
      const timer = setTimeout(() => {
        navigate("/products");
      }, 1500); // wait for message

      return () => clearTimeout(timer);
    }
  }, [editingProduct, openSnackbar, navigate]);
  return (
    <div>
      {editingProduct && (
        <h3 style={{ color: "#2e7d32" }}>✏ Editing: {editingProduct.name}</h3>
      )}

      <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>

      <SimpleProductForm onSave={handleSave} editingProduct={editingProduct} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" variant="filled">
          {isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProduct;
