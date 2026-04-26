const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  printInvoice: () => ipcRenderer.invoke("print-invoice"),
});