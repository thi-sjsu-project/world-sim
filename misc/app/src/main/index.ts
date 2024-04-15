// jeffrey work on this file
import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { log } from "./util";
import * as WebSocketType from "ws";
import {validMessages} from "./messages";

if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}


const LOG = {
  ERROR: "\x1b[31m[err]\x1b[0m",
  INFO: "\x1b[34m[info]\x1b[0m",
};

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 800,
    title: "World Simulator",
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
      nodeIntegration: true,
    },
  });

  win.setMenu(null);

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
    win.loadURL(url);
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.handle("hello", async (_event, msg: string) => {
  log(`Received IPC message from SolidJS: ${msg}`);
});

ipcMain.handle("openDevTools", async (_event) => {
  win?.webContents?.openDevTools({ mode: "detach" });
});


//web socket server connection
const WebSocket:typeof WebSocketType = require("ws");
const PORT = 6969;
const wss = new WebSocket.Server({ port: PORT });


console.log(LOG.INFO, `running on port ${PORT}`);


wss.on("connection", async (ws) => {
  console.log(LOG.INFO, "connection opened");

  ws.on("error", (error) => {
    console.log(LOG.ERROR, error)
  });

  function send(msg: string) {
    console.log(LOG.INFO, `sending message: ${msg}`);
    ws.send(msg);
  }

  send(validMessages.toString());

  ws.close();
  console.log(LOG.INFO, "connection closed");
});