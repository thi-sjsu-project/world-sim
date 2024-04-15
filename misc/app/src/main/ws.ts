import * as WebSocketType from "ws";
import { TIMELINE } from "./messages";
import { logInfo, logError } from "./util";

function delayMs(msec: number): Promise<null> {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

export function startWebSocketServer() {
  // typeof magic required because typescript stoopid
  const WebSocket: typeof WebSocketType = require("ws");
  const PORT = 6969;
  const wss = new WebSocket.Server({ port: PORT });

  logInfo(`(ws) running on port ${PORT}`);

  wss.on("connection", async (ws) => {
    logInfo("(ws) connection opened");

    ws.on("error", (error) => {
      logError(`(ws) error: ${error}`);
    });

    let last = 0;
    for (const idx in TIMELINE) {
      await delayMs(TIMELINE[idx].delay - last);
      logInfo(`(ws) sending timeline msg ${idx}`);
      ws.send(JSON.stringify(TIMELINE[idx].msg));
      last = TIMELINE[idx].delay;
    }

    ws.close();
    logInfo("(ws) connection closed");
  });
}
