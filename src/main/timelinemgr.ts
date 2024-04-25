import { WebContents, ipcMain } from "electron";
import { SimToCmMessage } from "../../submodules/message-schemas/schema-types";
import { DEFAULT_TIMELINE } from "./messages";
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
  private index: number;
  private elapsedMs: number;
  private shouldCancel: boolean;
  private paused: boolean;

  constructor(webContents: WebContents) {
    this.webContents = webContents;
    this.timeline = structuredClone(DEFAULT_TIMELINE);
    this.index = 0;
    this.elapsedMs = 0;
    this.shouldCancel = false;
    this.paused = false;

    ipcMain.handle("timelineUpdateRequest", () => {
      this.sendTimelineToRenderer();
      this.sendElapsedTimeToRenderer();
    });

    ipcMain.handle("pause", () => {
      this.paused = true;
    });

    ipcMain.handle("resume", () => {
      this.paused = false;
    });

    ipcMain.handle(
      "timelineEditEntry",
      (_event, idx: number, data: TimelineEntry) => {
        this.timeline[idx] = data;
        this.sendTimelineToRenderer();
      }
    );

    ipcMain.handle("create", (_, message: SimToCmMessage) => {
  
      const validator = typia.createValidateEquals<SimToCmMessage>();
      const validationResult = validator(message);
    
    
      console.log(message);
    
      if (validationResult.success) {
        const entry: TimelineEntry = {
          delay: this.timeline[this.timeline.length - 1].delay + 5000,
          msg: message,
        };
        this.timeline.push(entry);
      
        this.sendTimelineToRenderer();
        return true;
  
      }
    
    });
  }

  reset() {
    this.index = 0;
    this.elapsedMs = 0;
    this.shouldCancel = false;
    this.paused = false;
    this.sendElapsedTimeToRenderer();
  }

  async step(): Promise<SimToCmMessage | null> {
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

  queueCancel() {
    this.shouldCancel = true;
  }

  get currentIndex(): number {
    return this.index;
  }

  private sendTimelineToRenderer() {
    console.log(this.timeline);
    this.webContents.send("timelineUpdate", this.timeline);
  }

  private sendElapsedTimeToRenderer() {
    this.webContents.send("timelineElapsed", this.elapsedMs);
  }
}
