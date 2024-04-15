import * as WebSocketType from "ws";
import { logInfo, logError } from "./util";
import { TimelineManager } from "./timelinemgr";

// typeof magic required because typescript stoopid
const WebSocket: typeof WebSocketType = require("ws");

const PORT = 6969;

export function startWebSocketServer() {
  const wss = new WebSocket.Server({ port: PORT });
  logInfo(`(ws) running on port ${PORT}`);

  const timelineManager = new TimelineManager();
  let connectionActive = false;

  wss.on("connection", async (ws) => {
    if (connectionActive) {
      logError("(ws) rejected duplicate connection");
      ws.close();
      return;
    }

    logInfo("(ws) connection opened");
    connectionActive = true;
    timelineManager.reset();

    ws.on("error", (error) => {
      logError(`(ws) error: ${error}`);
      ws.close();
      connectionActive = false;
      return;
    });

    while (timelineManager.hasRemainingEntries()) {
      const idx = timelineManager.currentIndex;
      const msg = await timelineManager.step();
      logInfo(`(ws) sending message ${idx}`);
      ws.send(JSON.stringify(msg));
    }

    ws.close();
    connectionActive = false;
    logInfo("(ws) connection closed");
  });
}
