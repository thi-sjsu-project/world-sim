import { contextBridge, ipcRenderer } from "electron";
import { domReady } from "./utils";
import { TimelineEntry } from "src/main/timelinemgr";

(async () => {
  await domReady();
  // put code here that should run after dom is ready
  ipcRenderer.invoke("domReady");
})();

function onUpdate(callback: (timeline: Array<TimelineEntry>) => void) {
  ipcRenderer.on("timelineUpdate", (_event, value) => callback(value));
}

contextBridge.exposeInMainWorld("timelineApi", {
  onUpdate,
  requestUpdate: () => ipcRenderer.invoke("timelineUpdateRequest"),
});
