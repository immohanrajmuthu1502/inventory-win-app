import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportSalesToExcel = (bills) => {
  if (!bills || bills.length === 0) return;

  const data = bills.map((b) => ({
    Date: new Date(b.date).toLocaleString(),
    Customer: b.customer?.name || "Walk-in",
    Phone: b.customer?.phone || "-",
    Payment: b.paymentMode,
    Items: b.items.length,
    Total: b.total,
    Profit: b.profit,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  const fileName = `sales_report_${new Date().toISOString().slice(0,10)}`;

  saveAs(file, fileName + ".xlsx");
};