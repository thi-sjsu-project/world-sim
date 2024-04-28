// prettier-ignore
import { AcaDefect, AcaFuelLow, AcaHeadingToBase, Message, MissileToOwnshipDetected, RequestApprovalToAttack, SimToCmMessage } from "../../submodules/message-schemas/schema-types";
import typia from "typia";
import { logError, logInfo } from "./util";
import { TimelineEntry } from "./timelinemgr";
import { ipcMain } from "electron";

/* sample messages ********************************************************************************/

const MESSAGES: Array<Message> = [
  // example convo 1: high priority, low threat, no collateral
  {
    id: "AAA27046-14A8-449C-960C-79BE303E71D4",
    priority: 2,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { lat: 48.600045, lng: 11.607559 },
        threatLevel: 0.2,
        type: "RS-12",
      },
      collateralDamage: "none",
      detectedByAca: 4,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.6,
      },
      choiceWeight: 0.5,
    },
  } satisfies RequestApprovalToAttack,

  // example convo 2: low priority, low threat, no collateral, weapons low
  {
    id: "5EC92D78-4B9E-4879-BB2E-F226BD34151D",
    priority: 8,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { lat: 48.648044, lng: 11.594554 },
        threatLevel: 0.25,
        type: "RS-10",
      },
      collateralDamage: "none",
      detectedByAca: 2,
      attackWeapon: {
        type: "kinetic",
        load: 0.1,
      },
      choiceWeight: -0.2,
    },
  } satisfies RequestApprovalToAttack,

  // fuel low on aca
  {
    id: "EB207A99-D2DB-4C44-A211-293B0321C727",
    priority: 5,
    kind: "AcaFuelLow",
    data: {
      acaId: 5,
      fuelLevel: 0.1,
    },
  } satisfies AcaFuelLow,

  // example convo 3: low priority, low threat, no collateral
  {
    id: "301E5FB4-5D93-4233-9E52-4D87B95733D0",
    priority: 7,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { lat: 48.630549, lng: 11.583752 },
        threatLevel: 0.15,
        type: "AR-5",
      },
      collateralDamage: "none",
      detectedByAca: 1,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.8,
      },
      choiceWeight: 0.3,
    },
  } satisfies RequestApprovalToAttack,

  // aca that previously send low fuel is now heading to base
  {
    id: "C7216187-5E0D-442A-9432-5D342A9F1362",
    priority: 5,
    kind: "AcaHeadingToBase",
    data: {
      acaId: 5,
      reason: "fuelLow",
    },
  } satisfies AcaHeadingToBase,

  // example convo 4: low priority, high threat, no collateral
  {
    id: "34F70C3A-A592-4028-AC8E-9792A84AC1C5",
    priority: 7,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { lat: 48.607569, lng: 11.582834 },
        threatLevel: 0.9,
        type: "RS-12",
      },
      collateralDamage: "none",
      detectedByAca: 2,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.7,
      },
      choiceWeight: 0,
    },
  } satisfies RequestApprovalToAttack,

  // example convo 5: missile heading towards ownship, weapons low on aca
  {
    id: "CD99F764-45E6-4A46-9636-F62243313177",
    priority: 0,
    kind: "MissileToOwnshipDetected",
    data: {
      missileLocation: { lat: 48.603579, lng: 11.592345 },
      survivability: 0.8,
      detectedByAca: 1,
      acaAttackWeapon: {
        type: "veryIntimidatingWeaponName",
        load: 0.2,
      },
      choiceWeight: 1,
    },
  } satisfies MissileToOwnshipDetected,

  // defect on aca
  {
    id: "C654FB26-2BD0-4128-88D2-D5CC7435B92F",
    priority: 3,
    kind: "AcaDefect",
    data: {
      acaId: 1,
      message: "A screw came loose mid-flight.",
    },
  } satisfies AcaDefect,

  // example convo 6: high priority, low threat, possible collateral
  {
    id: "156E8248-583C-4C44-A80A-7282D131A5C9",
    priority: 2,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { lat: 48.599382, lng: 11.593753 },
        threatLevel: 0.1,
        type: "DRDX-1",
      },
      collateralDamage: "complex",
      detectedByAca: 3,
      attackWeapon: {
        type: "kinetic",
        load: 0.5,
      },
      choiceWeight: -0.6,
    },
  } satisfies RequestApprovalToAttack,

  // example convo 7: high priority, low threat, no collateral, detected by ownship
  {
    id: "5442478F-50A5-4160-A9E7-C9218A776EC0",
    priority: 3,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { lat: 48.599382, lng: 11.593753 },
        threatLevel: 0.15,
        type: "DRDX-1",
      },
      collateralDamage: "none",
      attackWeapon: {
        type: "kinetic",
        load: 0.5,
      },
      choiceWeight: 0.4,
    },
  } satisfies RequestApprovalToAttack,
];

/* validation *************************************************************************************/

export const MSG_VALIDATOR = typia.createValidateEquals<SimToCmMessage>();

function validateTimelineEntry(entry: TimelineEntry, idx: number): entry is TimelineEntry {
  const validationResult = MSG_VALIDATOR(entry.msg);

  if (entry.delay < 0 || validationResult.success) {
    return true;
  } else {
    logError(`entry ${idx} invalid:`);
    for (const error of validationResult.errors) {
      logError(` - ${error.path}, expected ${error.expected}, found value ${error.value}`);
    }
  }

  return false;
}

// prettier-ignore
const UNVALIDATED_TIMELINE: Array<TimelineEntry> = [
  { delay: 0,      msg: { message: MESSAGES[0], stressLevel: 0.1 } },
  { delay: 10_000, msg: { message: MESSAGES[1], stressLevel: 0.3 } },
  { delay: 12_000, msg: { message: MESSAGES[2], stressLevel: 0.7 } },
  { delay: 24_000, msg: { message: MESSAGES[3], stressLevel: 0.5 } },
  { delay: 25_000, msg: { message: MESSAGES[4], stressLevel: 0.6 } },
  { delay: 28_000, msg: { message: MESSAGES[5], stressLevel: 0.9 } },
  { delay: 45_000, msg: { message: MESSAGES[6], stressLevel: 0.2 } },
  { delay: 50_000, msg: { message: MESSAGES[7], stressLevel: 0.5 } },
  { delay: 55_000, msg: { message: MESSAGES[8], stressLevel: 0.7 } },
  { delay: 60_000, msg: { message: MESSAGES[9], stressLevel: 0.6 } },
];

export const DEFAULT_TIMELINE = UNVALIDATED_TIMELINE.filter(validateTimelineEntry);
