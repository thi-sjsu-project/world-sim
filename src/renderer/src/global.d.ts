import { TimelineEntry } from "src/main/timelinemgr";

export {};

type TimelineApi = {
  onUpdate: (callback: (timeline: Array<TimelineEntry>) => void) => void;
  onElapsed: (callback: (elapsedMs: number) => void) => void;
  onWsUpdate: (callback: (wsConnected: boolean) => void) => void;
  requestUpdate: () => void;
};

declare global {
  interface Window {
    openDevTools: () => void;
    timelineApi: TimelineApi;
  }
}
