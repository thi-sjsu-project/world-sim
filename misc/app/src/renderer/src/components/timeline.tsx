// prettier-ignore
import { Component, For, createMemo, onMount } from "solid-js";
import { TimelineEntry } from "../../../main/timelinemgr";
import { STATE } from "../app";

const Timeline: Component = () => {
  onMount(window.timelineApi.requestUpdate);

  return (
    <For each={STATE.timeline.get()}>
      {(item, index) => <Entry item={item} index={index()} />}
    </For>
  );
};

const Entry: Component<{
  item: TimelineEntry;
  index: number;
}> = (props) => {
  const dotClass = createMemo(() => {
    const wasPlayed = STATE.elapsed.get() >= props.item.delay;
    const dotBackground = wasPlayed ? "bg-green-400" : "bg-zinc-600";
    return `rounded-full w-3 h-3 mr-4 ml-1 inline-block ${dotBackground}`;
  });

  return (
    <div class="mb-2">
      <div class={dotClass()}></div>
      <div class="bg-zinc-800 px-2 py-1 rounded-lg inline-block w-[calc(100%-2rem)]">
        <span>
          Message {props.index}: {props.item.msg.message?.kind}
        </span>
        <span class="float-right text-zinc-500">
          {props.item.delay / 1000}s
        </span>
      </div>
    </div>
  );
};

export default Timeline;
