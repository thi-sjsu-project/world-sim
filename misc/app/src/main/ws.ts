import * as WebSocketType from "ws";
import { logInfo, logError } from "./util";
import { TimelineManager } from "./timelinemgr";
import { WebContents } from "electron";
import { SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";

// typeof magic required because typescript stoopid
const WebSocket: typeof WebSocketType = require("ws");

const PORT = 6969;

export function startWebSocketServer(webContents: WebContents) {
  const wss = new WebSocket.Server({ port: PORT });
  logInfo(`(ws) running on port ${PORT}`);

  const timelineManager = new TimelineManager(webContents);
  let connectionActive = false;

  wss.on("connection", async (ws) => {
    if (connectionActive) {
      logError("(ws) rejected duplicate connection");
      ws.close();
      return;
    }

    function close() {
      ws.close();
      connectionActive = false;
      timelineManager.reset();
      logInfo("(ws) connection closed");
    }

    logInfo("(ws) connection opened");
    connectionActive = true;
    timelineManager.reset();

    ws.on("error", (error) => {
      logError(`(ws) error: ${error}`);
      close();
    });

    ws.on("close", close);

    while (connectionActive && timelineManager.hasRemainingEntries()) {
      const idx = timelineManager.currentIndex;
      const msgPromise = timelineManager.step();
      const closePromise = new Promise((resolve) => ws.once("close", resolve));

      const msg = (await Promise.race([msgPromise, closePromise])) as
        | SimToCmMessage // returned by msgPromise on success
        | null // returned by msgPromise on error (if socket has been closed)
        | number; // returned by closePromise

      if (msg && msg instanceof Object) {
        console.log(msg);
        logInfo(`(ws) sending message ${idx}`);
        ws.send(JSON.stringify(msg));
      } else {
        timelineManager.queueCancel();
        break;
      }
    }

    if (connectionActive) {
      close();
    }
  });
}
