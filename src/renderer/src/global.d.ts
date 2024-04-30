import { SimToCmMessage } from "@messages-schemas/schema-types";
import { TimelineEntry } from "src/main/timelinemgr";

export {};

type TimelineApi = {
  onUpdate: (callback: (timeline: Array<TimelineEntry>) => void) => void;
  onElapsed: (callback: (elapsedMs: number) => void) => void;
  onPause: (callback: (paused: boolean) => void) => void;
  onWsUpdate: (callback: (wsConnected: boolean) => void) => void;
  requestUpdate: () => void;
  requestWsUpdate: () => void;
  editEntry: (idx: number, data: TimelineEntry) => void;
  reset: () => void;
  pause: () => () => void;
  resume: () => void;
  addEntry: (message: SimToCmMessage) => void;
  deleteEntry: (idx: number) => void;
  readFile: () => void;
  saveFile: () => void;
};

declare global {
  interface Window {
    timelineApi: TimelineApi;
    onAlert: (callback: (text: string) => void) => void;
    sendMessageInstant: (message: SimToCmMessage) => void;
    openDevTools: () => void;
  }
}
