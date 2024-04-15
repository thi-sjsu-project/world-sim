import { Accessor, Setter, createSignal } from "solid-js";

export function Signal<T>(value: T): { get: Accessor<T>; set: Setter<T> } {
  const [get, set] = createSignal<T>(value);
  return { get, set };
}
