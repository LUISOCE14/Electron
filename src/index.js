const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');

let mainWindow;
let newProductWindow;


if(process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  });
}


app.on('ready', () => {

 
  mainWindow = new BrowserWindow({
    width: 720, 
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
  }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true
  }))


  const mainMenu = Menu.buildFromTemplate(templateMenu);
 
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', () => {
    app.quit();
  });

});


function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    parent: mainWindow,
    width: 400,
    height: 330,
    title: 'Agregar Producto',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
  }
  });
  newProductWindow.setMenu(null);

  newProductWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/AgregarProductos.html'),
    protocol: 'file',
    slashes: true,
  }));
  newProductWindow.on('closed', () => {
    newProductWindow = null;
  });
}


ipcMain.on('product:new', (e, newProduct) => {
  
  mainWindow.webContents.send('product:new', newProduct);
  newProductWindow.close();
});



const templateMenu = [
  {
    label: 'Productos',
    submenu: [
      {
        label: 'Nuevo Producto',
        accelerator: 'Ctrl+N',
        click() {
          createNewProductWindow();
        }
      },
      {
        label: 'Eliminar Todo',
        click() {
          mainWindow.webContents.send('products:remove-all');
        }
      },
      {
        label: 'Salir',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

