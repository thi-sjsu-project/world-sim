import { WebContents, ipcMain } from "electron";
import { SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";
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
  private index: number;
  private elapsedMs: number;

  constructor(webContents: WebContents) {
    this.webContents = webContents;
    this.timeline = structuredClone(DEFAULT_TIMELINE);
    this.index = 0;
    this.elapsedMs = 0;

    ipcMain.handle("timelineUpdateRequest", () => {
      this.sendTimelineToRenderer();
      this.sendElapsedTimeToRenderer();
    });
  }

  reset() {
    this.index = 0;
    this.elapsedMs = 0;
  }

  async step(): Promise<SimToCmMessage> {
    const lastDelay = this.index == 0 ? 0 : this.timeline[this.index - 1].delay;
    const entry = this.timeline[this.index];
    let delay = entry.delay - lastDelay;
    while (delay > 0) {
      const iterDelay = Math.min(delay, DELAY_STEP_MS);
      await delayMs(iterDelay);
      this.elapsedMs += iterDelay;
      delay -= DELAY_STEP_MS;
      this.sendElapsedTimeToRenderer();
    }
    this.index += 1;
    return entry.msg;
  }

  hasRemainingEntries(): boolean {
    return this.index < this.timeline.length - 1;
  }

  get currentIndex(): number {
    return this.index;
  }

  private sendTimelineToRenderer() {
    this.webContents.send("timelineUpdate", this.timeline);
  }

  private sendElapsedTimeToRenderer() {
    this.webContents.send("timelineElapsed", this.elapsedMs);
  }
}
