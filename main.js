// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
//const script = require('./script')
//let clickExitButton = document.getElementById("click-exit");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  let windowWidth;
  let windowHeight;
  if(process.platform === 'linux'){
    windowHeight = 800;
    windowWidth = 600;
  }else if(process.platform === "win32"){
    windowHeight = 839;
    windowWidth = 616;
  }else{
    windowHeight = 800;
    windowWidth = 600;
  }
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    icon: path.join(__dirname, './img/dance.png'),
    webPreferences: {
      nodeIntegration: true // ipc通訊必要
    }
  })

  // remove top menu bar
  mainWindow.setMenuBarVisibility(false) 

  mainWindow.setResizable(false)

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () =>{
  createWindow()
  console.log('start.');
  console.log(process.platform);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    console.log('quit window');
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('quit-main', function(){
  console.log('quit main')
  app.quit()
})


