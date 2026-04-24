const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/../node_modules/electron`)
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

