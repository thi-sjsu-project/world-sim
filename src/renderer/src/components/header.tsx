// prettier-ignore
import { IconDeviceFloppy, IconFolder, IconMessageCirclePlus, IconPlayerPause, IconPlayerPlay, IconPlugConnected, IconPlugConnectedX, IconRestore, IconZoomCode, IconBolt, IconBrain, IconSend } from "@tabler/icons-solidjs";
import { Component, Show, createMemo, createUniqueId, onMount } from "solid-js";
import { Message, SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";
import { v4 as uuid } from "uuid";
import { STATE } from "../app";
import { showMessageCreationDialog } from "./create";
import { Signal } from "@/util";

// TODO: componentize header buttons

const Header: Component = () => {
  return (
    <div class="pb-2 border-b border-b-zinc-700">
      <WsConnectionIndicator />
      <Divider />
      <ResetButton />
      <PauseButton />
      <FormattedTime />
      <Divider />
      <ReadFileButton />
      <SaveFileButton />
      <AddMessageButton />
      <Divider />
      <InstantSendButton />
      <InstantStressButton />
      <Divider />
      <DevToolsButton />
    </div>
  );
};

const Divider: Component = () => {
  return <div class="h-6 w-px bg-zinc-700 inline-block mr-3"></div>;
};

const WsConnectionIndicator: Component = () => {
  const Disconnected: Component = () => {
    return (
      <span title="WebSocket not connected" class="inline-block pr-3">
        <IconPlugConnectedX class="text-red-400" />
      </span>
    );
  };

  const Connected: Component = () => {
    return (
      <span title="WebSocket connected" class="inline-block pr-3">
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
    <span class="align-[.375rem] mr-3 w-8 inline-block text-right">
      {Math.floor(STATE.elapsed.get() / 1000 + Number.EPSILON)}s
    </span>
  );
};

const ReadFileButton: Component = () => {
  return (
    <button
      class="mr-3 text-zinc-600 hover:text-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
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
        message.conversationId = uuid();
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
        message.conversationId = uuid();
        const simToCmMessage: SimToCmMessage = { message };
        window.sendMessageInstant(simToCmMessage);
      });
    }
  };

  return (
    <button
      class="mr-2 -ml-1 text-zinc-600 hover:text-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
      onclick={handleClick}
      title="Send message instantly"
      disabled={!STATE.wsConnected.get()}
    >
      <IconBolt />
    </button>
  );
};

const InstantStressButton: Component = () => {
  const visible = Signal(false);
  const value = Signal(0.4);

  const accent = createMemo(() => {
    const v = value.get();
    if (v < 0.1) return "accent-emerald-400";
    if (v < 0.3) return "accent-green-400";
    if (v < 0.5) return "accent-lime-400";
    if (v < 0.7) return "accent-yellow-400";
    if (v < 0.9) return "accent-orange-400";
    else return "accent-red-400";
  });

  const handleClick = () => {
    visible.set(false);
    if (STATE.wsConnected.get()) {
      const simToCmMessage: SimToCmMessage = { stressLevel: value.get() };
      window.sendMessageInstant(simToCmMessage);
    }
  };

  return (
    <div class="inline-block">
      <button
        class="mr-3 text-zinc-600 hover:text-zinc-500 disabled:cursor-not-allowed disabled:text-zinc-800 disabled:hover:text-zinc-800"
        onclick={() => visible.set(!visible.get())}
        title="Send stress level instantly"
        disabled={!STATE.wsConnected.get()}
      >
        <IconBrain />
      </button>
      <Show when={visible.get()}>
        <div class="absolute w-3 h-3 bg-zinc-700 rotate-45 ml-1.5 -mt-0.5" />
        <div class="absolute bg-zinc-700 p-3 pb-2 -ml-2 mt-1 rounded-lg">
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={value.get()}
            onInput={(e) => value.set(Number(e.currentTarget.value))}
            class={`w-4 h-20 cursor-ns-resize] ${accent()}`}
            style="appearance: slider-vertical;"
          ></input>
          <button class="block" onClick={handleClick}>
            <IconSend class="-ml-1 -mr-1 mt-1 text-zinc-400 hover:text-zinc-300" />
          </button>
        </div>
      </Show>
    </div>
  );
};

const DevToolsButton: Component = () => {
  return (
    <button class="text-zinc-600 hover:text-zinc-500" onclick={() => window.openDevTools()}>
      <IconZoomCode />
    </button>
  );
};

export default Header;
