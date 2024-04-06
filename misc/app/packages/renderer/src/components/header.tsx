import { Accessor, Component, Setter, createMemo } from "solid-js";
import { Icon } from "solid-heroicons";
import { backward, wrenchScrewdriver } from "solid-heroicons/solid-mini";

const Header: Component<{
  timer: Accessor<number>;
  setTimer: Setter<number>;
}> = (props) => {
  const formattedTime = createMemo(() =>
    Math.floor(props.timer() / 1000 + Number.EPSILON)
  );

  return (
    <div class="pb-2 border-b border-b-zinc-700">
      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={() => props.setTimer(0)}
      >
        <Icon path={backward} class="w-5 h-5" />
      </button>

      <span class="align-[.25rem]">{formattedTime()}s</span>

      <button
        class="ml-3 text-zinc-600 hover:text-zinc-500 float-right"
        onclick={() => window.ipcRendererInvoke("openDevTools")}
      >
        <Icon path={wrenchScrewdriver} class="w-5 h-5" />
      </button>
    </div>
  );
};

export default Header;
