/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "world-sim",
  productName: "world-sim",
  asar: true,
  directories: {
    output: "release/${version}",
    buildResources: "build",
  },
  files: ["dist"],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    artifactName: "${productName}-${version}-setup.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    artifactName: "${productName}-${version}-installer.${ext}",
  },
  linux: {
    target: ["AppImage"],
    artifactName: "${productName}-${version}.${ext}",
  },
};
