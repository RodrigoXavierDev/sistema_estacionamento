const { app, BrowserWindow, nativeTheme } = require('electron/main')
const path = require('node:path')

function createWindow () {
  nativeTheme.themeSource = 'dark'
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize()
  win.loadURL('http://localhost:3000')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})