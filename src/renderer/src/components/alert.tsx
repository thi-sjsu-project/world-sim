import { Signal } from "@/util";
import { IconX } from "@tabler/icons-solidjs";
import { Component, Show } from "solid-js";

export const AlertWidget: Component = () => {
  const visible = Signal(false);
  const message = Signal("");

  window.onAlert((text: string) => {
    message.set(text);
    visible.set(true);
  });

  return (
    <Show when={visible.get()}>
      <div class="absolute w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0">
        <div class="w-[calc(100%-2rem)] mx-auto my-4 bg-zinc-800 px-4 py-3 max-w-96 rounded-xl">
          <button class="float-right text-zinc-500 -mr-1" onclick={() => visible.set(false)}>
            <IconX />
          </button>
          <p innerHTML={message.get()}></p>
        </div>
      </div>
    </Show>
  );
};
