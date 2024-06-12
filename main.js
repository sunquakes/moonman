const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV
console.log('NODE_ENV', NODE_ENV)

let win

function createWindow() {
  win = new BrowserWindow({
    autoHideMenuBar: true,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  NODE_ENV === 'development'
    ? win.loadURL('http://localhost:3232/')
    : win.loadFile('dist/index.html')

  if (NODE_ENV === 'development') {
    const toggleDevTools = () => {
      if (win.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools()
      }
    }
    globalShortcut.register('F12', toggleDevTools)
    toggleDevTools()
  }
  win.on('closed', function () {
    win = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  app.on('before-quit', () => {
    if (NODE_ENV === 'development') {
      globalShortcut.unregister('F12')
      console.log(666)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const handleTerminationSignals = () => {
  if (win) {
    win.close()
  }
  app.quit()
}

if (process.platform === 'win32') {
  require('readline')
    .createInterface({
      input: process.stdin,
      output: process.stdout
    })
    .on('SIGINT', () => {
      handleTerminationSignals()
    })
}

process.on('SIGINT', () => {
  handleTerminationSignals()
})

process.on('SIGTERM', () => {
  handleTerminationSignals()
})
