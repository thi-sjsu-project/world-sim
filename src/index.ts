import { WebSocketServer } from "ws";

const LOG = {
  ERROR: "\x1b[31m[err]\x1b[0m",
  INFO: "\x1b[34m[info]\x1b[0m",
};

const PORT = 6969;
const wss = new WebSocketServer({ port: PORT });
console.log(LOG.INFO, `running on port ${PORT}`)

wss.on("connection", (ws) => {
  console.log(LOG.INFO, "connection opened");

  ws.on("error", (error) => {
    console.log(LOG.ERROR, error)
  });

  function send(msg: string) {
    console.log(LOG.INFO, `sending message: ${msg}`);
    ws.send(msg);
  }

  send("Hello, World!");

  ws.close();
  console.log(LOG.INFO, "connection closed");
});
