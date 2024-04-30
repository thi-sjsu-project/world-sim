import { Component } from "solid-js";
import Timeline from "./components/timeline";
import Header from "./components/header";
import { TimelineEntry } from "src/main/timelinemgr";
import { Signal } from "./util";
import { AlertWidget } from "./components/alert";
import { CreateWidget } from "./components/create";

export const STATE = {
  elapsed: Signal(0),
  timeline: Signal<Array<TimelineEntry>>([]),
  wsConnected: Signal(false),
  paused: Signal(false),
};

window.timelineApi.onUpdate((newTimeline: Array<TimelineEntry>) => {
  STATE.timeline.set(newTimeline);
});

window.timelineApi.onElapsed((elapsedMs: number) => {
  STATE.elapsed.set(elapsedMs);
});

window.timelineApi.onPause((paused: boolean) => {
  STATE.paused.set(paused);
});

window.timelineApi.onWsUpdate((wsConnected: boolean) => {
  STATE.wsConnected.set(wsConnected);
});

const App: Component = () => {
  return (
    <>
      <AlertWidget />
      <CreateWidget />
      <Header />
      <Timeline />
    </>
  );
};

export default App;
