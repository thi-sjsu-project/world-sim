import { Accessor, Component, Setter, createMemo } from "solid-js";

const Header: Component<{
  timer: Accessor<number>;
  setTimer: Setter<number>;
}> = (props) => {
  const formattedTime = createMemo(() =>
    Math.floor(props.timer() / 1000 + Number.EPSILON)
  );

  return (
    <div class="pb-2 border-b border-b-zinc-700">
      <span>{formattedTime()}s</span>
      <button
        class="ml-3 text-zinc-500 hover:underline"
        onclick={() => props.setTimer(0)}
      >
        reset
      </button>
    </div>
  );
};

export default Header;
