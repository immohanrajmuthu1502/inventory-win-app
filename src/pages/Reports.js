import React, { useState } from "react";
import { exportSalesToExcel } from "../utils/exportExcel";
import { downloadInvoice, exportSalesToPDF } from "../utils/exportPDF";
import { sendInvoiceToWhatsApp } from "../utils/whatsappInvoice";
import { formatPaymentMode } from "../utils/paymentUtils";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const Reports = ({ bills, setBills, settings }) => {
  const [filter, setFilter] = useState("today");
  const [appliedFilter, setAppliedFilter] = useState("today");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerDraft, setCustomerDraft] = useState({
    name: "",
    phone: "",
  });
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const parseDate = (dateStr) => {
    // Handle both ISO format and locale string format
    let date = new Date(dateStr);
    
    // If the date is valid, return it
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Fallback: return null if invalid
    return null;
  };

  const getDateString = (date) => {
    // Get date in local timezone as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getFilteredBills = (type) => {
    const now = new Date();
    const todayDateStr = getDateString(now);

    return bills.filter((bill) => {
      const billDate = parseDate(bill.date);
      
      if (!billDate) {
        return false;
      }

      const billDateStr = getDateString(billDate);

      if (type === "today") {
        return billDateStr === todayDateStr;
      }

      if (type === "week") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = getDateString(sevenDaysAgo);
        
        return billDateStr >= sevenDaysAgoStr && billDateStr <= todayDateStr;
      }

      if (type === "month") {
        const billYear = billDate.getFullYear();
        const billMonth = billDate.getMonth();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth();
        
        return billYear === nowYear && billMonth === nowMonth;
      }

      return true; // "all"
    });
  };

  let filteredBills = getFilteredBills(appliedFilter);
  
  // Filter by invoice number if search is provided
  if (invoiceSearch.trim()) {
    filteredBills = filteredBills.filter((bill) =>
      String(bill.id).includes(invoiceSearch.trim())
    );
  }
  
  const totalSales = filteredBills.length;

  const totalRevenue = filteredBills.reduce((sum, b) => sum + b.total, 0);

  const totalItems = filteredBills.reduce(
    (sum, b) => sum + b.items.reduce((i, item) => i + item.qty, 0),
    0,
  );

  const handleViewInvoice = (bill) => {
    setSelectedInvoice(bill);
    setCustomerDraft({
      name: bill.customer?.name || "",
      phone: bill.customer?.phone || "",
    });
    setIsEditingCustomer(false);
    setOpenInvoice(true);
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
    setIsEditingCustomer(false);
  };

  const handleSaveCustomer = () => {
    if (!selectedInvoice) return;

    const updatedInvoice = {
      ...selectedInvoice,
      customer: {
        ...selectedInvoice.customer,
        name: customerDraft.name,
        phone: customerDraft.phone,
      },
    };

    setBills((prev) =>
      prev.map((bill) =>
        bill.id === selectedInvoice.id ? updatedInvoice : bill,
      ),
    );
    setSelectedInvoice(updatedInvoice);
    setIsEditingCustomer(false);
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

        <TextField
          size="small"
          placeholder="Search by invoice number..."
          value={invoiceSearch}
          onChange={(e) => setInvoiceSearch(e.target.value)}
          sx={{ flex: 1, maxWidth: 300 }}
        />
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
                <TableCell sx={{ fontWeight: "bold" }}>Invoice No.</TableCell>
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
                  <TableCell sx={{ fontWeight: 600 }}>{bill.id}</TableCell>

                  <TableCell>{bill.date}</TableCell>

                  <TableCell>{bill.customer?.name || "Walk-in"}</TableCell>

                  <TableCell>{bill.customer?.phone || "-"}</TableCell>

                  <TableCell>{formatPaymentMode(bill.paymentMode)}</TableCell>

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
          onClick={() => exportSalesToExcel(filteredBills, settings)}
        >
          EXPORT EXCEL
        </Button>

        <Button
          variant="outlined"
          onClick={() => exportSalesToPDF(filteredBills, settings)}
        >
          EXPORT PDF
        </Button>
      </Box>
      <Dialog
        open={openInvoice}
        onClose={handleCloseInvoice}
        maxWidth="sm"
        fullWidth
      >
        {/* Header */}
        <DialogTitle>
          Invoice
          <IconButton
            onClick={handleCloseInvoice}
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
              <Typography variant="h6">{settings?.shopName}</Typography>
              <Typography variant="body2">{settings?.shopAddress}</Typography>

              <Typography sx={{ mt: 1 }}>
                Invoice No.: {selectedInvoice.id}
              </Typography>

              <Typography>
                Date: {new Date(selectedInvoice.date).toLocaleString()}
              </Typography>

              {isEditingCustomer ? (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer Name"
                    value={customerDraft.name}
                    onChange={(e) =>
                      setCustomerDraft((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone / WhatsApp"
                    value={customerDraft.phone}
                    onChange={(e) =>
                      setCustomerDraft((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </Box>
              ) : (
                <>
                  <Typography>
                    Customer: {selectedInvoice.customer?.name || "Walk-in"}
                  </Typography>

                  <Typography>
                    Phone: {selectedInvoice.customer?.phone || "-"}
                  </Typography>
                </>
              )}

              <Typography>
                Payment: {formatPaymentMode(selectedInvoice.paymentMode)}
              </Typography>

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
                  onClick={() => downloadInvoice(selectedInvoice, settings)}
                >
                  Download PDF
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={() => sendInvoiceToWhatsApp(selectedInvoice, settings)}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditingCustomer(true)}
                >
                  Edit Customer
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        {selectedInvoice && isEditingCustomer && (
          <DialogActions>
            <Button onClick={() => setIsEditingCustomer(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveCustomer}>
              Save Customer
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default Reports;
