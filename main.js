const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const {ipcMain} = electron;

const {exec} = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

var stoptime = Date.now();
var interface = 'en1';


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 230,
    height: 400,
    resizable: true,
    frame: false,
  });

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  setInterval(function() {
    if (Date.now() >= stoptime) {
      // off
      ensureOff();
    } else {
      // on
      ensureOn();
    }
  }, 5000);
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('add-time', function(ev, seconds) {
  var now = Date.now();
  stoptime = (now > stoptime ? now : stoptime) + (seconds * 1000);
});

ipcMain.on('stoptime?', function(ev) {
  ev.returnValue = stoptime;
});

function ensureOff() {
  // Ensure that network connectivity is off
  exec(`networksetup -setairportpower ${interface} off`);
}
function ensureOn() {
  // Ensure that network connectivity is on
  exec(`networksetup -setairportpower ${interface} on`);
}
