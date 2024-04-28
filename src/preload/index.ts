import { contextBridge, ipcRenderer } from "electron";
import { SimToCmMessage } from "@messages-schemas/schema-types";
import { TimelineEntry } from "src/main/timelinemgr";

function onUpdate(callback: (timeline: Array<TimelineEntry>) => void) {
  ipcRenderer.on("timelineUpdate", (_, value) => callback(value));
}

function onElapsed(callback: (elapsedMs: number) => void) {
  ipcRenderer.on("timelineElapsed", (_, elapsed) => callback(elapsed));
}

function onPause(callback: (paused: boolean) => void) {
  ipcRenderer.on("timelinePause", (_, paused) => callback(paused));
}

function onWsUpdate(callback: (wsConnected: boolean) => void) {
  ipcRenderer.on("timelineWsUpdate", (_, value) => callback(value));
}

function requestUpdate() {
  ipcRenderer.invoke("timelineUpdateRequest");
}

function requestWsUpdate() {
  ipcRenderer.invoke("timelineWsUpdateRequest");
}

function editEntry(idx: number, data: TimelineEntry) {
  ipcRenderer.invoke("timelineEditEntry", idx, data);
}

function reset() {
  ipcRenderer.invoke("timelineReset");
}

function pause() {
  ipcRenderer.invoke("timelinePause");
}

function resume() {
  ipcRenderer.invoke("timelineResume");
}

function addEntry(message: SimToCmMessage) {
  ipcRenderer.invoke("timelineAddEntry", message);
}

function deleteEntry(idx: number) {
  ipcRenderer.invoke("timelineDeleteEntry", idx);
}

function readFile() {
  ipcRenderer.invoke("timelineReadFile");
}

function saveFile() {
  ipcRenderer.invoke("timelineSaveFile");
}

contextBridge.exposeInMainWorld("timelineApi", {
  onElapsed,
  onUpdate,
  onPause,
  onWsUpdate,
  requestUpdate,
  requestWsUpdate,
  editEntry,
  reset,
  pause,
  resume,
  addEntry,
  deleteEntry,
  readFile,
  saveFile,
});

contextBridge.exposeInMainWorld("openDevTools", () => {
  ipcRenderer.invoke("openDevTools");
});

contextBridge.exposeInMainWorld("onAlert", (callback: (t: string) => void) => {
  ipcRenderer.on("alert", (_, value) => callback(value));
});
