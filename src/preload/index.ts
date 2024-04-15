import { contextBridge, ipcRenderer } from "electron";
import { TimelineEntry } from "src/main/timelinemgr";

function onUpdate(callback: (timeline: Array<TimelineEntry>) => void) {
  ipcRenderer.on("timelineUpdate", (_event, value) => callback(value));
}

function onElapsed(callback: (elapsedMs: number) => void) {
  ipcRenderer.on("timelineElapsed", (_event, value) => callback(value));
}

function onWsUpdate(callback: (wsConnected: boolean) => void) {
  ipcRenderer.on("timelineWsUpdate", (_event, value) => callback(value));
}

contextBridge.exposeInMainWorld("timelineApi", {
  onElapsed,
  onUpdate,
  onWsUpdate,
  requestUpdate: () => ipcRenderer.invoke("timelineUpdateRequest"),
});
