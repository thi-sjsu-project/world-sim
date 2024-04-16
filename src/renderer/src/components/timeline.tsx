// prettier-ignore
import { Component, For, createMemo, onMount } from "solid-js";
import { TimelineEntry } from "../../../main/timelinemgr";
import { STATE } from "../app";

const Timeline: Component = () => {
  onMount(() => {
    window.timelineApi.requestUpdate();
    window.timelineApi.requestWsUpdate();
  });

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
    const wasPlayed =
      STATE.wsConnected.get() && STATE.elapsed.get() >= props.item.delay;
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
          <input
            value={props.item.delay / 1000}
            class="bg-transparent w-6 inline text-right focus:outline-none border-b border-b-transparent focus:border-b-blue-400 focus:text-zinc-400 hover:border-b-zinc-400 hover:text-zinc-400 disabled:hover:border-b-zinc-500 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-not-allowed"
            disabled={STATE.wsConnected.get()}
            onChange={(e) => {
              const value = Number(e.currentTarget.value);
              if (!value) return;
              const msec = ~~(value * 1000);
              props.item.delay = msec;
              window.timelineApi.editEntry(props.index, props.item);
            }}
          ></input>
          s
        </span>
      </div>
    </div>
  );
};

export default Timeline;
