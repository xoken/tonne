const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

var widthHeight;
function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: Math.ceil(widthHeight.width * 0.7),
    height: Math.ceil(widthHeight.height * 0.7),
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  // win.maximize();
  win.show();
  // and load the index.html of the app.
  // win.loadFile('src/index.html');
  //const url = "http://localhost:3000/wallet";
  const url = `file://${path.join(__dirname, '/../build/index.html')}`;
  // console.log(url);
  win.loadURL(url);
  //win.webContents.send("dirpath", indexPath);
  // Open the DevTools.
  //  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)
app.on('ready', () => {
  widthHeight = screen.getPrimaryDisplay().workAreaSize;
  createWindow();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
