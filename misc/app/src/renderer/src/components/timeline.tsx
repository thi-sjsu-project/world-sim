// prettier-ignore
import { Accessor, Component, For, createMemo, createSignal, onMount } from "solid-js";
import { TimelineEntry } from "../../../main/timelinemgr";

let [timeline, setTimeline] = createSignal<Array<TimelineEntry>>([]);

window.timelineApi.onUpdate((newTimeline: Array<TimelineEntry>) => {
  setTimeline(newTimeline);
});

const Timeline: Component<{
  timer: Accessor<number>;
}> = (props) => {
  onMount(window.timelineApi.requestUpdate);

  return (
    <For each={timeline()}>
      {(_, index) => <Entry index={index()} timer={props.timer} />}
    </For>
  );
};

const Entry: Component<{
  timer: Accessor<number>;
  index: number;
}> = (props) => {
  const item = createMemo(() => timeline()[props.index]);
  const dotClass = createMemo(() => {
    const wasPlayed = props.timer() >= item().delay;
    const dotBackground = wasPlayed ? "bg-green-400" : "bg-zinc-600";
    return `rounded-full w-3 h-3 mr-4 ml-1 inline-block ${dotBackground}`;
  });

  return (
    <div class="mb-2">
      <div class={dotClass()}></div>
      <div class="bg-zinc-800 px-2 py-1 rounded-lg inline-block w-[calc(100%-2rem)]">
        <span>
          Message {props.index}: {item().msg.message?.kind}
        </span>
        <span class="float-right text-zinc-500">{item().delay / 1000}s</span>
      </div>
    </div>
  );
};

export default Timeline;
