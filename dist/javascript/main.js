////                                                                                                         ////
//Code within this file establishes requried perameters and functions for electron to work and create a window.//
////                                                                                                         ////

const {app, BrowserWindow} = require('electron')
var path = require('path')
  
  let win
  
  function createWindow () {
    //var viewport = require('electron-viewport')(950, 1025, {resizable:false})
    //var win = viewport.getWindow()

    win = new BrowserWindow({width: 970, height: 1025, minWidth: 970, icon: path.join(__dirname, 'dist/icon/64.ico')})
    
    win.loadFile('dist/views/index.html')

    win.webContents.openDevTools()
  
    win.on('closed', () => {
      win = null
    })
  }
  
  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }

  })
  
