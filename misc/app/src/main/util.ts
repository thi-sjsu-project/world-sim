export function logInfo(message: any) {
  console.log(` \x1b[1;32m[info]\x1b[0m ${message}`);
}

export function logError(message: any) {
  console.log(` \x1b[1;31m[err]\x1b[0m ${message}`);
}

export function delayMs(msec: number): Promise<null> {
  return new Promise((resolve) => setTimeout(resolve, msec));
}
