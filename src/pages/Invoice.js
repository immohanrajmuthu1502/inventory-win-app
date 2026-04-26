import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { downloadInvoice } from "../utils/exportPDF";

const Invoice = () => {
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("selectedInvoice");
    if (data) setBill(JSON.parse(data));
  }, []);

  if (!bill) return <p>No invoice found</p>;

  return (
    <Box sx={{ p: 3, maxWidth: 700, margin: "auto" }}>
      <Typography variant="h6">Kutty Couture</Typography>
      <Typography>Chennai</Typography>
      <Typography>Mobile: 9XXXXXXXXX</Typography>
      <hr />
      <Typography variant="h5">Invoice</Typography>
      <Typography>Invoice No: {bill.id}</Typography>
      <Typography>Date: {new Date(bill.date).toLocaleString()}</Typography>

      <Typography>Customer: {bill.customer?.name || "Walk-in"}</Typography>

      <Typography>Phone: {bill.customer?.phone || "-"}</Typography>

      <Typography>Payment: {bill.paymentMode}</Typography>

      <hr />

      {/* Items */}
      {bill.items.map((item, i) => (
        <Box key={i} sx={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {item.name} × {item.qty}
          </span>
          <span>₹{item.total}</span>
        </Box>
      ))}

      <hr />

      <Typography variant="h6">Total: ₹{bill.total}</Typography>

      {/* Actions */}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="contained" onClick={() => downloadInvoice(bill)} sx={{ ml: 2 }}>
          Download PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Invoice;
