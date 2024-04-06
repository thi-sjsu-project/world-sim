import { Accessor, Component, For, createMemo } from "solid-js";

const TIMELINE = [
  { delay: 0, msg: "Message 0" },
  { delay: 10_000, msg: "Message 1" },
  { delay: 12_000, msg: "Message 2" },
  { delay: 24_000, msg: "Message 3" },
  { delay: 25_000, msg: "Message 4" },
  { delay: 28_000, msg: "Message 5" },
  { delay: 45_000, msg: "Message 6" },
  { delay: 50_000, msg: "Message 7" },
  { delay: 55_000, msg: "Message 8" },
  { delay: 60_000, msg: "Message 9" },
];

const Timeline: Component<{
  timer: Accessor<number>;
}> = (props) => {
  return (
    <For each={TIMELINE}>
      {(_, index) => <Entry index={index()} timer={props.timer} />}
    </For>
  );
};

const Entry: Component<{
  timer: Accessor<number>;
  index: number;
}> = (props) => {
  const item = TIMELINE[props.index];
  const dotClass = createMemo(() => {
    const wasPlayed = props.timer() >= item.delay;
    const dotBackground = wasPlayed ? "bg-green-400" : "bg-zinc-600";
    return `rounded-full w-3 h-3 mr-4 ml-1 inline-block ${dotBackground}`;
  });

  return (
    <div class="mb-2">
      <div class={dotClass()}></div>
      <div class="bg-zinc-800 px-2 py-1 rounded-lg inline-block w-[calc(100%-2rem)]">
        <span>{item.msg}</span>
        <span class="float-right text-zinc-500">{item.delay / 1000}s</span>
      </div>
    </div>
  );
};

export default Timeline;
