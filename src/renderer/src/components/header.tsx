// prettier-ignore
import { IconDeviceFloppy, IconFolder, IconMessageCirclePlus, IconPlayerPause, IconPlayerPlay, IconPlugConnected, IconPlugConnectedX, IconRestore, IconZoomCode } from "@tabler/icons-solidjs";
import { Component, Show } from "solid-js";
import { SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";
import { v4 as uuid } from "uuid";
import { STATE } from "../app";

// TODO: componentize header buttons

const Header: Component = () => {
  return (
    <div class="pb-2 border-b border-b-zinc-700">
      <WsConnectionIndicator />
      <ResetButton />
      <PauseButton />
      <FormattedTime />
      <ReadFileButton />
      <SaveFileButton />
      <AddMessageButton />
      <DevToolsButton />
    </div>
  );
};

const WsConnectionIndicator: Component = () => {
  const Disconnected: Component = () => {
    return (
      <span
        title="WebSocket not connected"
        class="inline-block pr-3 mr-3 border-r border-r-zinc-700"
      >
        <IconPlugConnectedX class="text-red-400" />
      </span>
    );
  };

  const Connected: Component = () => {
    return (
      <span title="WebSocket connected" class="inline-block pr-3 mr-3 border-r border-r-zinc-700">
        <IconPlugConnected class="text-green-400" />
      </span>
    );
  };

  return (
    <Show when={STATE.wsConnected.get()} fallback={<Disconnected />}>
      <Connected />
    </Show>
  );
};

const ResetButton: Component = () => {
  return (
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500"
      onclick={() => {
        if (STATE.wsConnected.get()) window.timelineApi.reset();
      }}
      title="Restart timeline"
    >
      <IconRestore />
    </button>
  );
};

const FormattedTime: Component = () => {
  return (
    <span class="align-[.375rem] mr-3">
      {Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)}s
    </span>
  );
};

const PauseButton: Component = () => {
  const Pause: Component = () => {
    return (
      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={window.timelineApi.pause}
        title="Pause timeline"
      >
        <IconPlayerPause />
      </button>
    );
  };

  const Resume: Component = () => {
    return (
      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={window.timelineApi.resume}
        title="Resume timeline"
      >
        <IconPlayerPlay />
      </button>
    );
  };

  return (
    <Show when={STATE.paused.get()} fallback={<Pause />}>
      <Resume />
    </Show>
  );
};

const ReadFileButton: Component = () => {
  return (
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500 pl-3 border-l border-l-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
      onclick={window.timelineApi.readFile}
      title="Read timeline from JSON file"
      disabled={STATE.wsConnected.get()}
    >
      <IconFolder />
    </button>
  );
};

const SaveFileButton: Component = () => {
  return (
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500"
      onclick={window.timelineApi.saveFile}
      title="Save timeline to JSON file"
    >
      <IconDeviceFloppy />
    </button>
  );
};

const AddMessageButton: Component = () => {
  const handleCreateClick = () => {
    const message: SimToCmMessage = {
      message: {
        id: uuid(),
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
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
      onclick={handleCreateClick}
      title="Create Message"
      disabled={STATE.wsConnected.get()}
    >
      <IconMessageCirclePlus />
    </button>
  );
};

const DevToolsButton: Component = () => {
  return (
    <button
      class="ml-3 text-zinc-600 hover:text-zinc-500 float-right"
      onclick={() => window.openDevTools()}
    >
      <IconZoomCode />
    </button>
  );
};

export default Header;
