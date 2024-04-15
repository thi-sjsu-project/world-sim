import { SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";
import { DEFAULT_TIMELINE } from "./messages";
import { delayMs } from "./util";

export type TimelineEntry = {
  delay: number;
  msg: SimToCmMessage;
};

export class TimelineManager {
  private timeline: Array<TimelineEntry>;
  private index: number;

  constructor() {
    this.timeline = structuredClone(DEFAULT_TIMELINE);
    this.index = 0;
  }

  reset() {
    this.index = 0;
  }

  async step(): Promise<SimToCmMessage> {
    const lastDelay = this.index == 0 ? 0 : this.timeline[this.index - 1].delay;
    const entry = this.timeline[this.index];
    const delay = entry.delay - lastDelay;
    await delayMs(delay);
    this.index += 1;
    return entry.msg;
  }

  hasRemainingEntries(): boolean {
    return this.index < this.timeline.length - 1;
  }

  get currentIndex(): number {
    return this.index;
  }
}
