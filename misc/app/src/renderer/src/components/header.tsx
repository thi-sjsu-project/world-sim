import { Accessor, Component, Setter, createMemo } from "solid-js";
import { IconRestore, IconZoomCode } from "@tabler/icons-solidjs";
import { STATE } from "../app";

const Header: Component = (props) => {
  const formattedTime = createMemo(() =>
    Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)
  );

  return (
    <div class="pb-2 border-b border-b-zinc-700">
      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={() => null /*props.setTimer(0)*/}
        title="Restart timeline"
      >
        <IconRestore />
      </button>

      <span class="align-[.375rem]">{formattedTime()}s</span>

      <button
        class="ml-3 text-zinc-600 hover:text-zinc-500 float-right"
        onclick={() => window.ipcRendererInvoke("openDevTools")}
      >
        <IconZoomCode />
      </button>
    </div>
  );
};

export default Header;
