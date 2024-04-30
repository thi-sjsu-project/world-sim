import { Signal } from "@/util";
import { IconX } from "@tabler/icons-solidjs";
import { Component, For, Show, onMount } from "solid-js";
import { Message } from "../../../../submodules/message-schemas/schema-types";
import { SELECTION_MESSAGES } from "../../../main/messages";

type Callback = (message: Message) => void;
export let showMessageCreationDialog: (callback: Callback) => void;

export const CreateWidget: Component = () => {
  const visible = Signal(false);
  let callback: Callback | undefined;

  onMount(() => {
    showMessageCreationDialog = (newCallback: Callback) => {
      callback = newCallback;
      visible.set(true);
    };
  });

  return (
    <Show when={visible.get()}>
      <div class="absolute w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0">
        <div class="w-[calc(100%-2rem)] mx-auto my-4 bg-zinc-800 px-4 py-3 max-w-96 rounded-xl">
          <button class="float-right text-zinc-500 -mr-1" onclick={() => visible.set(false)}>
            <IconX />
          </button>
          <h1 class="text-lg font-semibold text-zinc-100 text-center mb-4">
            Choose a Message To Create:
          </h1>
          <For each={SELECTION_MESSAGES}>
            {(item) => (
              <button
                class="bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"
                onClick={() => {
                  if (callback) callback(item.msg);
                  visible.set(false);
                }}
              >
                {item.label}
              </button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};
