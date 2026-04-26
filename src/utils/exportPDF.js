import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportSalesToPDF = (bills) => {
  if (!bills || bills.length === 0) return;

  const doc = new jsPDF();

  doc.text("Sales Report", 14, 10);

  autoTable(doc, {
    startY: 20,
    head: [["Date", "Customer", "Phone", "Payment", "Items", "Total"]],
    body: bills.map((b) => [
      new Date(b.date).toLocaleString(),
      b.customer?.name || "Walk-in",
      b.customer?.phone || "-",
      b.paymentMode,
      b.items.length,
      `₹${b.total}`,
    ]),
  });

  const fileName = `sales_report_${new Date().toISOString().slice(0,10)}`;
  doc.save(fileName + ".pdf");
};


export const downloadInvoice = (bill) => {
  const doc = new jsPDF();

  // 🧾 Header
  doc.setFontSize(14);
  doc.text("Kutty Couture", 14, 10);

  doc.setFontSize(10);
  doc.text("Chennai", 14, 16);
  doc.text("Mobile: 9XXXXXXXXX", 14, 22);

  // Invoice details
  doc.text(`Invoice No: ${bill.id}`, 140, 10);
  doc.text(`Date: ${new Date(bill.date).toLocaleString()}`, 140, 16);

  // Customer
  doc.text(`Customer: ${bill.customer?.name || "Walk-in"}`, 14, 32);
  doc.text(`Phone: ${bill.customer?.phone || "-"}`, 14, 38);
  doc.text(`Payment: ${bill.paymentMode}`, 14, 44);

  // 🧾 Table
  autoTable(doc, {
    startY: 50,
    head: [["Item", "Qty", "Price", "Total"]],
    body: bill.items.map((item) => [
      item.name,
      item.qty,
      Math.round(item.total / item.qty),
      item.total,
    ]),
  });

  // 🧾 Total
  const finalY = doc.lastAutoTable.finalY;

  doc.setFontSize(12);
  doc.text(`Total: ₹${bill.total}`, 14, finalY + 10);

  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 14, finalY + 20);

  doc.save(`invoice_${bill.id}.pdf`);
};