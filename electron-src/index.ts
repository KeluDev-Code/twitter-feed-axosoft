// Native
import { join } from "path";
import { format } from "url";

// Packages
import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import ElectronStore from "electron-store";
import { twitterHomeTimeline, twitterSearch } from "./repositories/twitter";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // set webSecurity to fasle to avoid problems with CORS
      webSecurity: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

const electronStore = new ElectronStore();

// listen channels and resend the received payload to the renderer process
ipcMain.on("useElectronStore", async (event, payload: { key: string; data?: any } | undefined) => {
  if (payload && payload.key) {
    if (payload.data) {
      electronStore.set(payload.key, payload.data);
    }
    event.returnValue = electronStore.get(payload.key);
  }
});

ipcMain.on("clearElectronStore", async (event) => {
  electronStore.clear();
  event.returnValue = true;
});

ipcMain.on("twitterSearch", async (event, query: string) => {
  event.returnValue = await twitterSearch(query);
});

ipcMain.on("twitterHomeTimeline", async (event) => {
  event.returnValue = await twitterHomeTimeline();
});
