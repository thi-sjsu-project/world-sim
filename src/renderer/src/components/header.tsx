import { Component, Show, createMemo } from "solid-js";
import {
  IconMessageCirclePlus,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlugConnected,
  IconPlugConnectedX,
  IconRestore,
  IconZoomCode,
} from "@tabler/icons-solidjs";
import { STATE } from "../app";
import { SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";

const Header: Component = () => {
  const formattedTime = createMemo(() =>
    Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)
  );

  const handleCreateClick = () => {
    const message: SimToCmMessage = {
      message: {
        id: "ABB27046-14A8-449C-960C-79BE303E71D4",
        priority: 2,
        kind: "RequestApprovalToAttack",
        data: {
          target: {
            location: { lat: 48.600045, lng: 11.607559 },
            threatLevel: 0.2,
            type: "RS-12",
          },
          collateralDamage: "none",
          detectedByAca: 4,
          attackWeapon: {
            type: "ewSuppression",
            load: 0.6,
          },
          choiceWeight: 0.5,
        },
      },

      stressLevel: 0.5,
    };
    window.timelineApi.addEntry(message);
  };

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
        onclick={window.timelineApi.reset}
        title="Restart timeline"
      >
        <IconRestore />
      </button>
      <span class="align-[.375rem] mr-3">{formattedTime()}s</span>

      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={window.timelineApi.pause}
        title="Pause timeline"
      >
        <IconPlayerPause />
      </button>

      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={window.timelineApi.resume}
        title="Resume timeline"
      >
        <IconPlayerPlay />
      </button>

      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={handleCreateClick}
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
