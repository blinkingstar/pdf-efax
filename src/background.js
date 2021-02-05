'use strict'

import { app, protocol, ipcMain, BrowserWindow ,Menu, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

if (typeof snapshotResult !== 'undefined') {
  console.log('snapshotResult available!', snapshotResult)
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true // process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  const template = [
    {
      label: 'PDF eFax',
      submenu: [
        {
          label: 'about'
        },
        { type: "separator" },
        {role:'quit', label:`Quit ${app.name}`}
      ]
    }, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    }
    // {
    //   label: 'File',
    //   submenu: [
    //     {
    //       label: 'Open...',
    //       accelerator: 'CmdOrCtrl+O', // ショートカットキーを設定
    //       click: () => { openFile() } // 実行される関数
    //     }
    //   ]
    // }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  // function openFile() {
  //   console.log('opening');
  //   const filePath = dialog.showOpenDialogSync({ 
  //     filters: [{name: 'PDF', extensions: ['pdf']}],
  //     properties: ['openFile'] });
  //   win.webContents.send('open_file', filePath);
  // }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  const Store = require('electron-store');
  Store.initRenderer();
  ipcMain.on('argget', (event) => {
    let argv = process.argv;
    for (let i = 0; i < 2; i++){
      if(argv.length > 0) {
        if(argv[0].endsWith('lectron') || argv[0].endsWith('.exe') || argv[0] == '.' ){
            argv.shift();
        }
      }
    }
    event.returnValue = argv;
  });

  ipcMain.handle('deleteaddressbook', async (event) => {
    const delete_confirm = await dialog.showMessageBox({
      type: 'warning',  // none/info/error/question/warning
      title: '',
      message: 'Confirmation',
      detail: 'Really delete?',
      buttons: ['OK', 'Cancel'],
      cancelId: 1  // Esc で閉じられたときの戻り値
    });
    return delete_confirm;
  });
  ipcMain.handle('resetaddressbook', async (event) => {
    const reset_confirm = await dialog.showMessageBox({
      type: 'warning',  // none/info/error/question/warning
      title: '',
      message: 'Confirmation',
      detail: 'Really reset address book?',
      buttons: ['OK', 'Cancel'],
      cancelId: 1  // Esc で閉じられたときの戻り値
    });
    return reset_confirm;
  });
  ipcMain.handle('openfile', async (event,arg) => {
    console.log('opening');
    const filePath = await dialog.showOpenDialog({
      defaultPath: arg,
      filters: [{name: 'PDF', extensions: ['pdf']}],
      properties: ['openFile'] }
    );
    return filePath;
  });
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
