export function logInfo(message: any) {
  console.log(` \x1b[1;34m[info]\x1b[0m ${message}`);
}

export function logError(message: any) {
  console.log(` \x1b[1;31m[err]\x1b[0m ${message}`);
}
