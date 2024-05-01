// prettier-ignore
import { getDefaultTimeline, msgValidator, timelineEntryValidator, timelineValidator } from "./validation";
import { WebContents, dialog, ipcMain } from "electron";
import { SimToCmMessage } from "../../submodules/message-schemas/schema-types";
import { readFileSync, writeFileSync } from "fs";
import { delayMs } from "./util";
import typia from "typia";

const DELAY_STEP_MS = 100;

export type TimelineEntry = {
  delay: number & typia.tags.Type<"uint64">;
  msg: SimToCmMessage;
};

export class TimelineManager {
  private webContents: WebContents;
  private timeline: Array<TimelineEntry>;
  private allowConnections: boolean;

  constructor(webContents: WebContents) {
    this.webContents = webContents;
    this.timeline = structuredClone(getDefaultTimeline());
    this.allowConnections = true;

    ipcMain.handle("timelineUpdateRequest", (_) => this.sendTimelineToRenderer());
    ipcMain.handle("timelineEditEntry", (_, i: number, d: TimelineEntry) => this.editEntry(i, d));
    ipcMain.handle("timelineAddEntry", (_, message: SimToCmMessage) => this.addEntry(message));
    ipcMain.handle("timelineDeleteEntry", (_, idx: number) => this.deleteEntry(idx));
    ipcMain.handle("timelineReadFile", (_) => this.readFromFile());
    ipcMain.handle("timelineSaveFile", (_) => this.saveToFile());
  }

  start(): TimelinePlayer {
    return new TimelinePlayer(this.webContents, this.timeline);
  }

  isConnectionAllowed() {
    return this.allowConnections;
  }

  private addEntry(message: SimToCmMessage) {
    const validationResult = msgValidator(message);
    if (validationResult.success) {
      const prevEntry = this.timeline[this.timeline.length - 1];
      message.stressLevel = prevEntry.msg.stressLevel ?? 0.5;
      const entry: TimelineEntry = {
        delay: prevEntry.delay + 5000,
        msg: message,
      };
      this.timeline.push(entry);
    } else {
      this.alertValidationErrors(validationResult.errors);
    }
    this.sendTimelineToRenderer();
  }

  private editEntry(i: number, data: TimelineEntry) {
    const validationResult = timelineEntryValidator(data);
    if (validationResult.success) {
      this.timeline[i] = data;
      this.timeline.sort((a, b) => a.delay - b.delay);
    } else {
      this.alertValidationErrors(validationResult.errors);
    }
    this.sendTimelineToRenderer();
  }

  private deleteEntry(idx: number) {
    this.timeline.splice(idx, 1);
    this.sendTimelineToRenderer();
  }

  private readFromFile() {
    this.allowConnections = false;
    try {
      const file = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [{ name: "JSON Files", extensions: ["json"] }],
      });
      if (!file) return;
      const json = readFileSync(file[0], "utf-8");
      const parsed = JSON.parse(json);
      const validationResult = timelineValidator(parsed);
      if (validationResult.success) {
        this.timeline = validationResult.data;
        this.sendTimelineToRenderer();
      } else {
        return this.alertValidationErrors(validationResult.errors);
      }
    } catch (e) {
      this.alert(`Error while reading from JSON file:<br><br>${e}`);
    } finally {
      this.allowConnections = true;
    }
  }

  private saveToFile() {
    try {
      const file = dialog.showSaveDialogSync({
        defaultPath: "timeline.json",
        filters: [{ name: "JSON Files", extensions: ["json"] }],
      });
      if (!file) return;
      const json = JSON.stringify(this.timeline);
      writeFileSync(file, json);
    } catch (e) {
      this.alert(`Error while writing to JSON file:<br><br>${e}`);
    } finally {
      this.allowConnections = true;
    }
  }

  private sendTimelineToRenderer() {
    this.webContents.send("timelineUpdate", this.timeline);
  }

  private alertValidationErrors(errors: Array<typia.IValidation.IError>) {
    const errorStrs = errors.map((e) => {
      return `<li><b>${e.path}</b>:<br>expected: <code>${e.expected}</code><br>got: <code>${e.value}</code></li>`;
    });
    this.alert(`Data constraint violation: <ul>${errorStrs.join("")}</ul>`);
  }

  private alert(message: string) {
    this.webContents.send("alert", message);
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

    ipcMain.handle("timelinePause", (_) => this.setPaused(true));
    ipcMain.handle("timelineResume", (_) => this.setPaused(false));
    ipcMain.handle("timelineReset", (_) => this.reset());

    this.sendElapsedTimeToRenderer();
    this.sendPauseStatusToRenderer();
  }

  stop() {
    this.shouldCancel = true;

    ipcMain.removeHandler("timelinePause");
    ipcMain.removeHandler("timelineResume");
    ipcMain.removeHandler("timelineReset");
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

  private setPaused(paused: boolean) {
    this.paused = paused;
    this.sendPauseStatusToRenderer();
  }

  private reset() {
    this.index = 0;
    this.elapsedMs = 0;
    this.sendElapsedTimeToRenderer();
  }

  private sendElapsedTimeToRenderer() {
    this.webContents.send("timelineElapsed", this.elapsedMs);
  }

  private sendPauseStatusToRenderer() {
    this.webContents.send("timelinePause", this.paused);
  }
}
