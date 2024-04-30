// prettier-ignore
import { IconDeviceFloppy, IconFolder, IconMessageCirclePlus, IconPlayerPause, IconPlayerPlay, IconPlugConnected, IconPlugConnectedX, IconRestore, IconZoomCode, IconBolt } from "@tabler/icons-solidjs";
import { Component, Show } from "solid-js";
import { Message, SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";
import { v4 as uuid } from "uuid";
import { STATE } from "../app";
import { showMessageCreationDialog } from "./create";

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
      <InstantSendButton />
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

const PauseButton: Component = () => {
  const Pause: Component = () => {
    return (
      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500"
        onclick={() => {
          if (STATE.wsConnected.get()) window.timelineApi.pause();
        }}
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
        onclick={() => {
          if (STATE.wsConnected.get()) window.timelineApi.resume();
        }}
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

const FormattedTime: Component = () => {
  return (
    <span class="align-[.375rem] mr-3">
      {Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)}s
    </span>
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
  const handleClick = () => {
    if (!STATE.wsConnected.get()) {
      showMessageCreationDialog((message: Message) => {
        message.id = uuid();
        const simToCmMessage: SimToCmMessage = { message };
        window.timelineApi.addEntry(simToCmMessage);
      });
    }
  };

  return (
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
      onclick={handleClick}
      title="Create Message"
      disabled={STATE.wsConnected.get()}
    >
      <IconMessageCirclePlus />
    </button>
  );
};

const InstantSendButton: Component = () => {
  const handleClick = () => {
    if (STATE.wsConnected.get()) {
      showMessageCreationDialog((message: Message) => {
        message.id = uuid();
        const simToCmMessage: SimToCmMessage = { message };
        window.sendMessageInstant(simToCmMessage);
      });
    }
  };

  return (
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500 pl-2 border-l border-l-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
      onclick={handleClick}
      title="Send message instantly"
      disabled={!STATE.wsConnected.get()}
    >
      <IconBolt />
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
