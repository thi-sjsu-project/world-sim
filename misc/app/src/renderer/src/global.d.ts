import { TimelineEntry } from "src/main/timelinemgr";

export {};

type TimelineApi = {
  onUpdate: (callback: (timeline: Array<TimelineEntry>) => void) => void;
  requestUpdate: () => void;
};

declare global {
  interface Window {
    ipcRendererInvoke: (channel: string, ...args: any[]) => Promise<any>;
    timelineApi: TimelineApi;
  }
}
