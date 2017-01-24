const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var desktop = null;

app.on('window-all-closed', () => app.quit());

app.on('ready', () => {
  const size = electron.screen.getPrimaryDisplay().size;

  desktop = new BrowserWindow({
    x: 0, y: 0,
    minWidth: size.width, maxWidth: size.width, width: size.width,
    minHeight: size.height, maxHeight: size.height, height: size.height,
    type: 'desktop',
    frame: false,
    transparent: true
  });

  desktop.webContents.openDevTools();

  desktop.loadURL(`file://${__dirname}/index.html`);

  desktop.on('closed', () => desktop = null);
});