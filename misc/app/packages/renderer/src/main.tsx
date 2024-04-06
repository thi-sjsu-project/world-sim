/* @refresh reload */
import "tailwindcss/tailwind.css";
import { render } from "solid-js/web";
import App from "./app";

const root = document.getElementById("root") as HTMLElement;
render(() => <App />, root);

window.ipcRendererInvoke("hello", "Hello, World!");
