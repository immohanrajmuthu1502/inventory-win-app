import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STORE = {
  name: "Kutty Couture",
  address: "Chennai",
  phone: "9XXXXXXXXX",
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const exportSalesToPDF = (bills) => {
  if (!bills || bills.length === 0) return;

  const doc = new jsPDF();

  doc.text("Sales Report", 14, 10);

  autoTable(doc, {
    startY: 20,
    head: [["Date", "Customer", "Phone", "Payment", "Items", "Total"]],
    body: bills.map((b) => [
      formatDate(b.date),
      b.customer?.name || "Walk-in",
      b.customer?.phone || "-",
      b.paymentMode,
      b.items.length,
      formatCurrency(b.total),
    ]),
  });

  const fileName = `sales_report_${new Date().toISOString().slice(0, 10)}`;
  doc.save(fileName + ".pdf");
};

export const downloadInvoice = (bill) => {
  if (!bill) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const invoiceNo = String(bill.id || Date.now());
  const subtotal =
    typeof bill.subtotal === "number"
      ? bill.subtotal
      : bill.items?.reduce((sum, item) => sum + Number(item.total || 0), 0) ||
        0;
  const taxAmount = Number(bill.taxAmount || 0);
  const discountAmount = Number(bill.discountAmount || 0);
  const total = Number(bill.total || 0);
  const adjustment = total - subtotal - taxAmount + discountAmount;

  doc.setDrawColor(35, 35, 35);
  doc.setFillColor(35, 35, 35);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(STORE.name, margin, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${STORE.address} | Mobile: ${STORE.phone}`, margin, 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INVOICE", pageWidth - margin, 14, { align: "right" });
  doc.setFontSize(10);
  doc.text(`#${invoiceNo}`, pageWidth - margin, 22, { align: "right" });

  doc.setTextColor(35, 35, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Bill To", margin, 42);
  doc.text("Invoice Details", 128, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(bill.customer?.name || "Walk-in Customer", margin, 49);
  doc.text(`Phone: ${bill.customer?.phone || "-"}`, margin, 55);
  if (bill.customer?.email) {
    doc.text(`Email: ${bill.customer.email}`, margin, 61);
  }

  doc.text(`Date: ${formatDate(bill.date)}`, 128, 49);
  doc.text(`Payment: ${bill.paymentMode || "-"}`, 128, 55);

  autoTable(doc, {
    startY: 72,
    head: [["#", "Item", "Qty", "Unit Price", "Amount"]],
    body: (bill.items || []).map((item, index) => [
      index + 1,
      item.name,
      item.qty,
      formatCurrency(Number(item.total || 0) / Number(item.qty || 1)),
      formatCurrency(item.total),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [35, 35, 35],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [35, 35, 35],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      2: { halign: "center", cellWidth: 18 },
      3: { halign: "right", cellWidth: 32 },
      4: { halign: "right", cellWidth: 34 },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 8;
  const totalsX = 126;
  const valuesX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", totalsX, finalY);
  doc.text(formatCurrency(subtotal), valuesX, finalY, { align: "right" });

  let rowY = finalY + 7;
  if (taxAmount) {
    doc.text(
      `Tax${bill.taxPercent ? ` (${bill.taxPercent}%)` : ""}`,
      totalsX,
      rowY,
    );
    doc.text(formatCurrency(taxAmount), valuesX, rowY, { align: "right" });
    rowY += 7;
  }

  if (discountAmount) {
    doc.text(
      `Discount${bill.discountPercent ? ` (${bill.discountPercent}%)` : ""}`,
      totalsX,
      rowY,
    );
    doc.text(`- ${formatCurrency(discountAmount)}`, valuesX, rowY, {
      align: "right",
    });
    rowY += 7;
  }

  if (Math.abs(adjustment) > 0.009) {
    doc.text("Adjustment", totalsX, rowY);
    doc.text(formatCurrency(adjustment), valuesX, rowY, { align: "right" });
    rowY += 7;
  }

  doc.setDrawColor(35, 35, 35);
  doc.line(totalsX, rowY - 2, valuesX, rowY - 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total", totalsX, rowY + 5);
  doc.text(formatCurrency(total), valuesX, rowY + 5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for shopping with Kutty Couture.", margin, 276);
  doc.text("This invoice is computer generated.", margin, 282);

  doc.save(`invoice_${invoiceNo}.pdf`);
};
