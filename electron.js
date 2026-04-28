const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();
let mainWindow;

console.log("Electron app starting...");

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
});

app.on("ready", () => {
  console.log("Electron ready event fired");
});

console.log("Preload path:", path.join(__dirname, "preload.js"));

app.setName("Kutty Couture Inventory");

// 🔁 Auto reload only in dev
// if (isDev) {
//   require("electron-reload")(__dirname, {
//     electron: require("electron"),
//   });
// }

function createWindow() {
  const isDev = !app.isPackaged;
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "appIcon.png"),
    title: "Kutty Couture Inventory",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow
      .loadURL("http://localhost:3000")
      .catch((err) => console.error("LOAD ERROR:", err));
  } else {
    mainWindow.loadFile(path.join(__dirname, "build/index.html"));
  }
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app
  .whenReady()
  .then(() => {
    console.log("App is ready");
    createWindow();
  })
  .catch((err) => {
    console.error("APP READY ERROR:", err);
  });

// ✅ Storage IPC
ipcMain.handle("get-data", (event, key) => {
  return store.get(key);
});

ipcMain.handle("set-data", (event, key, value) => {
  if (!key) return;
  store.set(key, value);
});

// ✅ Print
ipcMain.handle("print-invoice", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;

  win.webContents.print({
    silent: false,
    printBackground: true,
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
