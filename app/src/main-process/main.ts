import { app, BrowserWindow } from 'electron';

let mainWindow: Electron.BrowserWindow | null = null;

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Electron & react & webpack'
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

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