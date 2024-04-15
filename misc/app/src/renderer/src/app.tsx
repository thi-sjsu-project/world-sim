import { Component, createSignal, onCleanup } from "solid-js";
import Timeline from "./components/timeline";
import Header from "./components/header";
import { TimelineEntry } from "src/main/timelinemgr";

const [elapsed, setElapsed] = createSignal(0);
const [timeline, setTimeline] = createSignal<Array<TimelineEntry>>([]);

window.timelineApi.onUpdate((newTimeline: Array<TimelineEntry>) => {
  setTimeline(newTimeline);
});

window.timelineApi.onElapsed((elapsedMs: number) => {
  setElapsed(elapsedMs);
});

const App: Component = () => {
  return (
    <div class="w-screen h-screen bg-zinc-900 text-zinc-300 p-4">
      <Header elapsed={elapsed} />
      <div class="mt-4">
        <Timeline elapsed={elapsed} timeline={timeline} />
      </div>
    </div>
  );
};

export default App;
