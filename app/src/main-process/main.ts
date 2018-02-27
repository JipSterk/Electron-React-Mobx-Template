import { app, BrowserWindow } from 'electron';

let mainWindow: Electron.BrowserWindow | null = null;

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Electron & react & webpack'
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    if (process.env.NODE_ENV === 'development') {
        const installer = require('electron-devtools-installer');
        require('electron-debug')({ showDevTools: true });
        const extensions = ['REACT_DEVELOPER_TOOLS', 'REACT_PERF'];

        for (const extension of extensions) {
            try {
                installer.default(installer[extension]);
            } catch (error) {
            }
        }

        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.on('closed', (): void => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', (): void => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', (): void => {
    if (!mainWindow) {
        createWindow();
    }
});