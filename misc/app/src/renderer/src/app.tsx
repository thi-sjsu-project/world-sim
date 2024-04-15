import { Component } from "solid-js";
import Timeline from "./components/timeline";
import Header from "./components/header";
import { TimelineEntry } from "src/main/timelinemgr";
import { Signal } from "./util";

export const STATE = {
  elapsed: Signal(0),
  timeline: Signal<Array<TimelineEntry>>([]),
};

window.timelineApi.onUpdate((newTimeline: Array<TimelineEntry>) => {
  STATE.timeline.set(newTimeline);
});

window.timelineApi.onElapsed((elapsedMs: number) => {
  STATE.elapsed.set(elapsedMs);
});

const App: Component = () => {
  return (
    <div class="w-screen h-screen bg-zinc-900 text-zinc-300 p-4">
      <Header />
      <div class="mt-4">
        <Timeline />
      </div>
    </div>
  );
};

export default App;
