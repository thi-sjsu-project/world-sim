import typia from "typia";
import { UNVALIDATED_TIMELINE } from "./messages";
import { SimToCmMessage } from "@messages-schemas/schema-types";
import { TimelineEntry } from "./timelinemgr";
import { logError } from "./util";

export const msgValidator = typia.createValidateEquals<SimToCmMessage>();
export const timelineEntryValidator = typia.createValidateEquals<TimelineEntry>();
export const timelineValidator = typia.createValidateEquals<Array<TimelineEntry>>();

export function getDefaultTimeline(): Array<TimelineEntry> {
  const validationResult = timelineValidator(UNVALIDATED_TIMELINE);
  if (!validationResult.success) {
    logError(`default timeline invalid:`);
    for (const error of validationResult.errors) {
      logError(` - ${error.path}, expected ${error.expected}, found value ${error.value}`);
    }
    throw new Error("default timeline invalid");
  }
  return UNVALIDATED_TIMELINE;
}
