const ws = require("ws");

const socket = new ws.WebSocket("ws://localhost:6969");

socket.addEventListener("open", (_event) => {
  console.log("\x1b[32mconnection opened\x1b[0m");
});

socket.addEventListener("message", (event) => {
  console.log("\x1b[34mmessage received:\x1b[0m", event.data);
})

socket.addEventListener("close", (_event) => {
  console.log("\x1b[31mconnection closed\x1b[0m");
});

socket.addEventListener("error", (event) => {
  console.log("\x1b[31merror:\x1b[0m", event.error.code);
});
