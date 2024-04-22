import { WebContents, ipcMain } from "electron";
import { SimToCmMessage } from "../../submodules/message-schemas/schema-types";
import { DEFAULT_TIMELINE } from "./messages";
import { delayMs } from "./util";

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

    ipcMain.handle(
      "timelineEditEntry",
      (_event, idx: number, data: TimelineEntry) => {
        this.timeline[idx] = data;
        this.sendTimelineToRenderer();
      }
    );
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

    ipcMain.handle("pause", () => {
      this.paused = true;
    });

    ipcMain.handle("resume", () => {
      this.paused = false;
    });
  }

  stop() {
    this.shouldCancel = true;

    ipcMain.removeHandler("pause");
    ipcMain.removeHandler("resume");
  }

  async step() {
    const lastDelay = this.index == 0 ? 0 : this.timeline[this.index - 1].delay;
    const entry = this.timeline[this.index];
    let delay = entry.delay - lastDelay;

    while (delay > 0) {
      while (this.paused) {
        if (this.shouldCancel) {
          return null;
        }
        await delayMs(DELAY_STEP_MS);
      }

      const iterDelay = Math.min(delay, DELAY_STEP_MS);
      await delayMs(iterDelay);
      this.elapsedMs += iterDelay;
      delay -= DELAY_STEP_MS;

      this.sendElapsedTimeToRenderer();
      if (this.shouldCancel) {
        return null;
      }
    }

    this.index += 1;
    return entry.msg;
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
