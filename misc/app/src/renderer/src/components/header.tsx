import { Accessor, Component, Setter, Show, createMemo } from "solid-js";
import {
  IconPlugConnected,
  IconPlugConnectedX,
  IconRestore,
  IconZoomCode,
} from "@tabler/icons-solidjs";
import { STATE } from "../app";

const Header: Component = () => {
  const formattedTime = createMemo(() =>
    Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)
  );

  return (
    <div class="pb-2 border-b border-b-zinc-700">
      <Show
        when={STATE.wsConnected.get()}
        fallback={
          <span
            title="WebSocket not connected"
            class="inline-block pr-3 mr-3 border-r border-r-zinc-700"
          >
            <IconPlugConnectedX class="text-red-400" />
          </span>
        }
      >
        <span
          title="WebSocket connected"
          class="inline-block pr-3 mr-3 border-r border-r-zinc-700"
        >
          <IconPlugConnected class="text-green-400" />
        </span>
      </Show>

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
