import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow | null = null;

const createWindow = async (): Promise<void> => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Electron & react & webpack",
    webPreferences: {
      disableBlinkFeatures: "Auxclick",
      experimentalFeatures: true,
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (process.env.NODE_ENV === "development") {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      MOBX_DEVTOOLS,
      REACT_PERF,
    } = await import("electron-devtools-installer");
    const { default: debug } = await import("electron-debug");
    debug({ showDevTools: true });

    for (const extension of [
      REACT_DEVELOPER_TOOLS,
      MOBX_DEVTOOLS,
      REACT_PERF,
    ]) {
      try {
        installExtension(extension);
      } catch (error) {}
    }

    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", (): void => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", (): void => {
  if (!mainWindow) {
    createWindow();
  }
});
