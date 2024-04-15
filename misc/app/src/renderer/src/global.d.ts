export {};

declare global {
  interface Window {
    ipcRendererInvoke: (channel: string, ...args: any[]) => Promise<any>;
  }
}
