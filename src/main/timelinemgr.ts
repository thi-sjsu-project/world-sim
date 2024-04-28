import { WebContents, ipcMain } from "electron";
import { SimToCmMessage } from "../../submodules/message-schemas/schema-types";
import { DEFAULT_TIMELINE, MSG_VALIDATOR } from "./messages";
import { delayMs } from "./util";
import typia from "typia";

const DELAY_STEP_MS = 100;

export type TimelineEntry = {
  delay: number;
  msg: SimToCmMessage;
};

export class TimelineManager {
  private webContents: WebContents;
  private timeline: Array<TimelineEntry>;

  constructor(webContents: WebContents) {
    this.webContents = webContents;
    this.timeline = structuredClone(DEFAULT_TIMELINE);

    ipcMain.handle("timelineUpdateRequest", () => {
      this.sendTimelineToRenderer();
    });

    ipcMain.handle("timelineEditEntry", (_, i: number, data: TimelineEntry) => {
      const validationResult = MSG_VALIDATOR(data.msg);
      if (validationResult.success) {
        this.timeline[i] = data;
        this.sendTimelineToRenderer();
      } else {
        console.error("timelineEditEntry error"); // TODO
      }
    });

    ipcMain.handle("timelineAddEntry", (_, message: SimToCmMessage) => {
      const validationResult = MSG_VALIDATOR(message);
      if (validationResult.success) {
        const entry: TimelineEntry = {
          delay: this.timeline[this.timeline.length - 1].delay + 5000,
          msg: message,
        };
        this.timeline.push(entry);
        this.sendTimelineToRenderer();
      } else {
        console.error("timelineAddEntry error"); // TODO
      }
    });

    ipcMain.handle("timelineDeleteEntry", (_, idx: number) => {
      this.timeline.splice(idx, 1);
      this.sendTimelineToRenderer();
    });
  }

  start(): TimelinePlayer {
    return new TimelinePlayer(this.webContents, this.timeline);
  }

  private sendTimelineToRenderer() {
    this.webContents.send("timelineUpdate", this.timeline);
  }
}

export class TimelinePlayer {
  private webContents: WebContents;
  private timeline: Array<TimelineEntry>;
  private elapsedMs: number;
  private index: number;
  private paused: boolean;
  private shouldCancel: boolean;

  constructor(webContents: WebContents, timeline: Array<TimelineEntry>) {
    this.webContents = webContents;
    this.timeline = structuredClone(timeline);
    this.elapsedMs = 0;
    this.index = 0;
    this.paused = false;
    this.shouldCancel = false;

    ipcMain.handle("timelinePause", () => {
      this.paused = true;
    });

    ipcMain.handle("timelineResume", () => {
      this.paused = false;
    });

    ipcMain.handle("timelineReset", () => {
      this.index = 0;
      this.elapsedMs = 0;
      this.sendElapsedTimeToRenderer();
    });
  }

  stop() {
    this.shouldCancel = true;

    ipcMain.removeHandler("timelinePause");
    ipcMain.removeHandler("timelineResume");
  }

  async step() {
    let delay: number;
    while ((delay = this.calcDelayTime()) > 0 || this.paused) {
      while (this.paused) {
        if (this.shouldCancel) {
          return null;
        }
        await delayMs(DELAY_STEP_MS);
      }

      const iterDelay = Math.min(delay, DELAY_STEP_MS);
      await delayMs(iterDelay);
      this.elapsedMs += iterDelay;

      this.sendElapsedTimeToRenderer();
      if (this.shouldCancel) {
        return null;
      }
    }

    const msg = this.timeline[this.index].msg;
    this.index += 1;
    return msg;
  }

  calcDelayTime(): number {
    return Math.max(0, this.timeline[this.index].delay - this.elapsedMs);
  }

  hasRemainingEntries(): boolean {
    return this.index <= this.timeline.length - 1;
  }

  get currentIndex(): number {
    return this.index;
  }

  private sendElapsedTimeToRenderer() {
    this.webContents.send("timelineElapsed", this.elapsedMs);
  }
}
