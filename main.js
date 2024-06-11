const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV
console.log('NODE_ENV', NODE_ENV)

function createWindow() {
  const win = new BrowserWindow({
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
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
