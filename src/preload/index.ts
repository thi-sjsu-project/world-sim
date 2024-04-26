import { contextBridge, ipcRenderer } from "electron";
import {SimToCmMessage } from "@messages-schemas/schema-types";
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

function requestUpdate() {
  ipcRenderer.invoke("timelineUpdateRequest");
}

function requestWsUpdate() {
  ipcRenderer.invoke("timelineWsUpdateRequest");
}

function editEntry(idx: number, data: TimelineEntry) {
  ipcRenderer.invoke("timelineEditEntry", idx, data);
}

function reset(){
  ipcRenderer.invoke("reset");
}

function pause(){
  ipcRenderer.invoke("pause");
}

function resume(){
  ipcRenderer.invoke("resume");
}
function create(message: SimToCmMessage){
  ipcRenderer.invoke("create", message);
}

function deleteEntry(idx : number){
  ipcRenderer.invoke("deleteEntry", idx);
}

contextBridge.exposeInMainWorld("timelineApi", {
  onElapsed,
  onUpdate,
  onWsUpdate,
  requestUpdate,
  requestWsUpdate,
  editEntry,
  reset,
  pause,
  resume,
  create,
  deleteEntry,
});

contextBridge.exposeInMainWorld("openDevTools", () => {
  ipcRenderer.invoke("openDevTools");
});
