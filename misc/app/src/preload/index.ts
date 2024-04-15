import { contextBridge, ipcRenderer } from "electron";
import { domReady } from "./utils";

(async () => {
  await domReady();
  // put code here that should run after dom is ready
})();

contextBridge.exposeInMainWorld("ipcRendererInvoke", ipcRenderer.invoke);
