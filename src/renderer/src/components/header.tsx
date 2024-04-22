import { Accessor, Component, Setter, Show, createMemo } from "solid-js";
import {
  IconPlugConnected,
  IconPlugConnectedX,
  IconPower,
  IconZoomCode,
  IconPlayerPause,
  IconPlayerPlay,
  IconMessageCirclePlus
} from "@tabler/icons-solidjs";
import { STATE } from "../app";

const Header: Component = () => {
  const formattedTime = createMemo(() =>
    Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)
  );


const handleResetClick = () => {
  window.timelineApi.reset();
}

const handlePauseClick = () => {
  window.timelineApi.pause();
  
}

const handleResumeClick = () => {
  window.timelineApi.resume();

}

const handleCreateClick = () => {
  window.timelineApi.create();

}
  
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
        onclick={ handleResetClick}
        title="Restart timeline"
      >
        <IconPower />
      </button>
      <span class="align-[.375rem] mr-3">{formattedTime()}s</span>

      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={ handlePauseClick}
        title="Pause timeline"
      >
        <IconPlayerPause />
      </button>

      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={ handleResumeClick}
        title="Resume timeline"
      >
        <IconPlayerPlay />
      </button>

      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={ handleCreateClick}
        title="Create Message"
      >
        <IconMessageCirclePlus />
      </button>

      <button
        class="ml-3 text-zinc-600 hover:text-zinc-500 float-right"
        onclick={() => window.openDevTools()}
      >
        <IconZoomCode />
      </button>
    </div>
  );
};

export default Header;
