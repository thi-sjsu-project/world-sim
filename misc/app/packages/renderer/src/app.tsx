import { Component, createSignal, onCleanup } from "solid-js";
import Timeline from "./components/timeline";
import Header from "./components/header";

const UPDATE_INTERVAL_MS = 100;

const App: Component = () => {
  const [timer, setTimer] = createSignal(0);
  const interval = setInterval(
    () => setTimer(timer() + UPDATE_INTERVAL_MS),
    UPDATE_INTERVAL_MS
  );
  onCleanup(() => clearInterval(interval));

  return (
    <div class="w-screen h-screen bg-zinc-900 text-zinc-300 px-3 py-2">
      <Header timer={timer} setTimer={setTimer} />
      <div class="mt-4">
        <Timeline timer={timer} />
      </div>
    </div>
  );
};

export default App;
