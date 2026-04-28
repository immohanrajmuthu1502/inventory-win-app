// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getData: (key) => ipcRenderer.invoke("get-data", key),
  setData: (key, value) => ipcRenderer.invoke("set-data", key, value),
});