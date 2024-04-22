import * as WebSocketType from "ws";
import { logInfo, logError } from "./util";
import { TimelineManager } from "./timelinemgr";
import { WebContents, ipcMain } from "electron";
import { SimToCmMessage } from "../../submodules/message-schemas/schema-types";

// typeof magic required because typescript stoopid
const WebSocket: typeof WebSocketType = require("ws");

const PORT = 6969;

export function startWebSocketServer(webContents: WebContents) {
  const wss = new WebSocket.Server({ host: "0.0.0.0", port: PORT });
  logInfo(`(ws) running on port ${PORT}`);

  const timelineManager = new TimelineManager(webContents);
  let connectionActive = false;

  ipcMain.handle("timelineWsUpdateRequest", () => {
    webContents.send("timelineWsUpdate", connectionActive);
  });

  wss.on("connection", async (ws) => {
    if (connectionActive) {
      logError("(ws) rejected duplicate connection");
      ws.close();
      return;
    }

    const player = timelineManager.start();

    function setActive(active: boolean) {
      connectionActive = active;
      webContents.send("timelineWsUpdate", active);
    }

    function closeHandler() {
      setActive(false);
      player.stop();
      logInfo("(ws) connection closed");
      ipcMain.removeHandler("reset");
      player.stop();
    }

    ipcMain.handle("reset", () => {
      ws.close();
    });

    ws.on("close", closeHandler);

    logInfo("(ws) connection opened");
    setActive(true);

    while (connectionActive && player.hasRemainingEntries()) {
      const idx = player.currentIndex;
      const msgPromise = player.step();
      const closePromise = new Promise((resolve) => ws.once("close", resolve));

      const msg = (await Promise.race([msgPromise, closePromise])) as
        | SimToCmMessage // returned by msgPromise on success
        | null // returned by msgPromise on error (if socket has been closed)
        | number; // returned by closePromise

      if (msg && msg instanceof Object) {
        logInfo(`(ws) sending message ${idx}`);
        ws.send(JSON.stringify(msg));
      } else {
        break;
      }
    }

    player.stop();
  });
}
