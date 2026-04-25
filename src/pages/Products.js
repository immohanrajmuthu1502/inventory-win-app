import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

const Products = ({ products, setProducts, setEditingProduct }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [updatedRowId, setUpdatedRowId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category || "No Category")),
  ];
  const filteredProducts = products.filter((p) => {
    const searchMatch =
      p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchText.toLowerCase());

    const categoryMatch =
      selectedCategory === "All" || p.category === selectedCategory;

    return searchMatch && categoryMatch;
  });
  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: Math.max(0, Number(value)) } : p,
      ),
    );

    // ✅ highlight row
    setUpdatedRowId(id);

    // ✅ show toast
    setOpenSnackbar(true);

    // remove highlight after 1.5 sec
    setTimeout(() => {
      setUpdatedRowId(null);
    }, 1500);
  };
  const navigate = useNavigate();

  const columns = [
    { field: "name", headerName: "Product", flex: 1 },
    { field: "barcode", headerName: "Barcode", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },

    {
      field: "quantity",
      headerName: "Stock",
      width: 100,
      editable: true,
    },

    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => {
        const price = Number(params.row?.price ?? 0);
        return `₹${price}`;
      },
    },
    {
      field: "minStock",
      headerName: "Min Stock",
      width: 120,
      editable: true,
      renderCell: (params) => {
        const minStock = Number(params.row?.minStock ?? 0);
        const quantity = Number(params.row?.quantity ?? 0);
        if (quantity < minStock) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              ⚠ {minStock}
            </span>
          );
        }
        return minStock;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => {
        const row = params?.row;
        if (!row) return null;

        return (
          <>
            <Button
              size="small"
              onClick={() => {
                setEditingProduct(row);
                navigate("/add-product");
              }}
            >
              Edit
            </Button>

            <Button
              size="small"
              color="error"
              onClick={() => deleteProduct(row.id)}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  const rows = filteredProducts.map((p) => ({
    id: p.id,
    ...p,
  }));

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Inventory List
      </Typography>
      {rows.length === 0 && <p>No products found</p>}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "8px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Box>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          sx={{
            "& .highlight-row": {
              backgroundColor: "#fff3cd !important",
            },
          }}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          processRowUpdate={(newRow) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === newRow.id ? newRow : p)),
            );

            setUpdatedRowId(newRow.id);
            setOpenSnackbar(true);

            setTimeout(() => {
              setUpdatedRowId(null);
            }, 1500);

            return newRow;
          }}
          getRowClassName={(params) =>
            params.id === updatedRowId ? "highlight-row" : ""
          }
        />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="success" variant="filled">
            Stock updated successfully!
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default Products;
<style>
  {`
  .highlight-row {
    background-color: #fff3cd !important;
  }
`}
</style>;
