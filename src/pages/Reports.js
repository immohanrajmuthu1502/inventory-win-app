import React, { useState, useEffect } from "react";
import { exportSalesToExcel } from "../utils/exportExcel";
import { exportSalesToPDF } from "../utils/exportPDF";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

const Reports = ({bills}) => {
  const [filter, setFilter] = useState("today");
  const [appliedFilter, setAppliedFilter] = useState("today");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openInvoice, setOpenInvoice] = useState(false);

  const getFilteredBills = (type) => {
    const now = new Date();

    return bills.filter((bill) => {
      const billDate = new Date(bill.date);

      if (type === "today") {
        return billDate.toDateString() === now.toDateString();
      }

      if (type === "week") {
        const diff = (now - billDate) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }

      if (type === "month") {
        return (
          billDate.getMonth() === now.getMonth() &&
          billDate.getFullYear() === now.getFullYear()
        );
      }

      return true; // "all"
    });
  };

  const filteredBills = getFilteredBills(appliedFilter);
  const totalSales = filteredBills.length;

  const totalRevenue = filteredBills.reduce((sum, b) => sum + b.total, 0);

  const totalItems = filteredBills.reduce(
    (sum, b) => sum + b.items.reduce((i, item) => i + item.qty, 0),
    0,
  );

  const handleViewInvoice = (bill) => {
    setSelectedInvoice(bill);
    setOpenInvoice(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ FILTER SECTION (OUTSIDE TABLE) */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </TextField>

        <Button variant="contained" onClick={() => setAppliedFilter(filter)}>
          APPLY FILTER
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Total Sales */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid #eee",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total Sales
          </Typography>

          <Typography variant="h6">{totalSales}</Typography>
        </Box>

        {/* Items Sold */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid #eee",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Items Sold
          </Typography>

          <Typography variant="h6">{totalItems}</Typography>
        </Box>

        {/* Revenue */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            border: "1px solid #eee",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Revenue
          </Typography>

          <Typography variant="h6">₹{totalRevenue.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
        }}
      >
        {/* ✅ TABLE CONTAINER ONLY */}
        <TableContainer>
          <Table size="small">
            {/* Header */}
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Items</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {filteredBills.map((bill, index) => (
                <TableRow
                  key={bill.id}
                  onClick={() => handleViewInvoice(bill)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f1f7ff" },
                  }}
                >
                  <TableCell>{bill.date}</TableCell>

                  <TableCell>{bill.customer?.name || "Walk-in"}</TableCell>

                  <TableCell>{bill.customer?.phone || "-"}</TableCell>

                  <TableCell>{bill.paymentMode}</TableCell>

                  <TableCell>{bill.items.length}</TableCell>

                  <TableCell>₹{bill.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ✅ EXPORT BUTTONS (OUTSIDE TABLE) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => exportSalesToExcel(filteredBills)}
        >
          EXPORT EXCEL
        </Button>

        <Button
          variant="outlined"
          onClick={() => exportSalesToPDF(filteredBills)}
        >
          EXPORT PDF
        </Button>
      </Box>
      <Dialog
        open={openInvoice}
        onClose={() => setOpenInvoice(false)}
        maxWidth="sm"
        fullWidth
      >
        {/* Header */}
        <DialogTitle>
          Invoice
          <IconButton
            onClick={() => setOpenInvoice(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ p: 1 }}>
              {/* Business */}
              <Typography variant="h6">Kutty Couture</Typography>
              <Typography variant="body2">Chennai</Typography>

              <Typography sx={{ mt: 1 }}>
                Date: {new Date(selectedInvoice.date).toLocaleString()}
              </Typography>

              <Typography>
                Customer: {selectedInvoice.customer?.name || "Walk-in"}
              </Typography>

              <Typography>
                Phone: {selectedInvoice.customer?.phone || "-"}
              </Typography>

              <Typography>Payment: {selectedInvoice.paymentMode}</Typography>

              <hr />

              {/* Items */}
              {selectedInvoice.items.map((item, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {item.name} × {item.qty} 
                  </span>
                  <span>₹{item.total}</span>
                </Box>
              ))}

              <hr />

              <Typography variant="h6">
                Total: ₹{selectedInvoice.total}
              </Typography>

              {/* Actions */}
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => exportSalesToPDF([selectedInvoice])}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Reports;
