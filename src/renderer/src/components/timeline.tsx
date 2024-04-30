import { Component, For, Show, createMemo, createUniqueId, onMount } from "solid-js";
import { TimelineEntry } from "../../../main/timelinemgr";
import { STATE } from "../app";
import { IconAlertTriangle, IconBrain, IconPencil, IconTrash } from "@tabler/icons-solidjs";
import { Signal } from "@/util";
import { showAlert } from "./alert";
import { Message } from "@messages-schemas/schema-types";

const Timeline: Component = () => {
  onMount(() => {
    window.timelineApi.requestUpdate();
    window.timelineApi.requestWsUpdate();
  });

  const openedEditWidget = Signal<null | number>(null);
  createMemo(() => {
    // when timeline is updated, close all opened widgets
    openedEditWidget.set(STATE.timeline.get() && null);
  });

  function openEditWidget(index: number) {
    openedEditWidget.set(openedEditWidget.get() === index ? null : index);
  }

  return (
    <div class="mt-4 h-[calc(100vh-5.5rem)] overflow-auto">
      <For each={STATE.timeline.get()}>
        {(item, index) => (
          <Entry
            item={item}
            index={index()}
            editWidgetOpened={openedEditWidget.get() === index()}
            openEditWidget={() => openEditWidget(index())}
          />
        )}
      </For>
    </div>
  );
};

const Entry: Component<{
  item: TimelineEntry;
  index: number;
  editWidgetOpened: boolean;
  openEditWidget: () => void;
}> = (props) => {
  const dotClass = createMemo(() => {
    const wasPlayed = STATE.wsConnected.get() && STATE.elapsed.get() >= props.item.delay;
    const dotBackground = wasPlayed ? "bg-green-400" : "bg-zinc-600";
    return `rounded-full w-3 h-3 mr-3 ml-1 mt-2.5 inline-block ${dotBackground} align-top`;
  });

  return (
    <div class="mb-2">
      <div class={dotClass()}></div>

      <div class="bg-zinc-800 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)]">
        <span>
          <Show when={props.item.msg.message} fallback={"(no message)"}>
            {props.item.msg.message?.kind}
          </Show>
        </span>

        <div class="float-right text-zinc-500">
          <button
            class="hover:text-zinc-400 disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:text-zinc-700"
            onClick={props.openEditWidget}
            disabled={STATE.wsConnected.get()}
          >
            <IconPencil size={16} />
          </button>
          <br />
          <button
            class="hover:text-red-400 disabled:cursor-not-allowed disabled:text-zinc-700 disabled:hover:text-zinc-700"
            onClick={() => window.timelineApi.deleteEntry(props.index)}
            disabled={STATE.wsConnected.get()}
          >
            <IconTrash size={16} />
          </button>
        </div>

        <div class="text-sm text-zinc-500">
          <Show when={props.item.msg.message}>
            <span class="mr-6">
              <IconAlertTriangle size={16} class="inline-block mr-2" />
              <EditInput
                value={props.item.msg.message!.priority}
                onChange={(value) => {
                  props.item.msg.message!.priority = ~~value;
                  window.timelineApi.editEntry(props.index, props.item);
                }}
              />
            </span>
          </Show>

          <Show when={props.item.msg.stressLevel}>
            <span>
              <IconBrain size={16} class="inline-block mr-2" />
              <EditInput
                value={props.item.msg.stressLevel}
                onChange={(value) => {
                  props.item.msg.stressLevel = ~~value;
                  window.timelineApi.editEntry(props.index, props.item);
                }}
              />
            </span>
          </Show>

          <span class="float-right mr-4">
            <EditInput
              value={props.item.delay / 1000}
              onChange={(value) => {
                props.item.delay = ~~(value * 1000);
                window.timelineApi.editEntry(props.index, props.item);
              }}
            />
            s
          </span>
        </div>

        <Show when={props.editWidgetOpened}>
          <EditWidget item={props.item} index={props.index} />
        </Show>
      </div>
    </div>
  );
};

const EditInput: Component<{
  value: any;
  onChange: (value: number) => void;
}> = (props) => {
  return (
    <input
      value={props.value}
      class="bg-transparent w-8 inline text-right focus:outline-none border-b border-b-zinc-700 focus:border-b-blue-400 focus:text-zinc-400 hover:border-b-zinc-400 hover:text-zinc-400 disabled:hover:border-b-zinc-500 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-not-allowed disabled:border-b-transparent"
      disabled={STATE.wsConnected.get()}
      onChange={(e) => {
        const value = Number(e.currentTarget.value);
        if (value) props.onChange(value);
      }}
    ></input>
  );
};

const EditWidget: Component<{
  item: TimelineEntry;
  index: number;
}> = (props) => {
  const id = createUniqueId();

  onMount(() => {
    const elem = document.getElementById(id);
    elem?.setAttribute("style", `height: ${elem.scrollHeight}px; overflow-y: hidden;`);
    elem?.addEventListener("input", () => {
      elem.style.height = "auto";
      elem.style.height = `${elem.scrollHeight}px`;
    });
  });

  return (
    <textarea
      id={id}
      class="rounded-lg border border-zinc-700 bg-transparent mt-2 w-full resize-none outline-none focus:border-zinc-500 p-2 font-mono text-xs"
      spellcheck={false}
      onChange={(e) => {
        try {
          const msgFromJson: Message = JSON.parse(e.currentTarget.value);
          props.item.msg.message = msgFromJson;
          window.timelineApi.editEntry(props.index, props.item);
        } catch (e) {
          showAlert(`Invalid JSON string: ${e}`);
        }
      }}
    >
      {JSON.stringify(props.item.msg.message, undefined, 2)}
    </textarea>
  );
};

export default Timeline;
