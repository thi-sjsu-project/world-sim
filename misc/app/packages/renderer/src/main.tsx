/* @refresh reload */
import "tailwindcss/tailwind.css";
import { render } from "solid-js/web";
import App from "./app";

const root = document.getElementById("root") as HTMLElement;
render(() => <App />, root);

console.log("ipcRenderer", window.ipcRenderer);

// Usage of ipcRenderer.on
// window.ipcRenderer.on("main-process-message", (_event, ...args) => {
//   console.log("[Receive Main-process message]:", ...args);
// });
