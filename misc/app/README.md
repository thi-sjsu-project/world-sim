# world-sim

## Setup

```sh
# install dependencies
yarn install

# start development application
yarn run dev

# build release application
yarn run build
```

## Directory Structure

- Main source code:
  - `/packages/main`: Main process (Electron, WebSocket server, Native APIs)
  - `/packages/renderer`: Renderer process (SolidJS)
  - `/packages/preload`: "Glue" between electron and SolidJS
- Miscellaneous:
  - `/scripts`: Scripts for release build / development
  - `/build`: Resources (e.g. icons) for release build
- Build artifacts:
  - `/dist`: Generated JavaScript code
  - `/release/<version>`: Release build binaries
