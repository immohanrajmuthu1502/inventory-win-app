const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`)
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

ipcMain.handle("print-invoice", () => {
  const win = BrowserWindow.getFocusedWindow();

  if (!win) return;

  win.webContents.print({
    silent: false,
    printBackground: true,
  });
});
