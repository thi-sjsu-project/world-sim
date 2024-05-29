// prettier-ignore
import { AcaDefect, AcaFuelLow, AcaHeadingToBase, Message, MissileToOwnshipDetected, RequestApprovalToAttack } from "../../submodules/message-schemas/schema-types";
import { TimelineEntry } from "./timelinemgr";

/* sample messages ********************************************************************************/

const MESSAGES: Array<Message> = [
  // example convo 1: high priority, low threat, no collateral
  {
    id: "AAA27046-14A8-449C-960C-79BE303E71D4",
    conversationId: "2CEC4322-3B9A-439A-9782-876C226A04B6",
    priority: 2,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 900, y: 700 },
        threatLevel: 0.2,
        type: "airDefense",
      },
      collateralDamage: "none",
      detectedByAca: 4,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.6,
      },
      choiceWeight: 0.5,
    },
    tags: ["message", "aca", "aca-4", "map-warning", "map-warning-2"],
  } satisfies RequestApprovalToAttack,

  // example convo 2: low priority, low threat, no collateral, weapons low
  {
    id: "5EC92D78-4B9E-4879-BB2E-F226BD34151D",
    conversationId: "BCB1F75E-E7AE-41E1-A8FE-4B4535694493",
    priority: 8,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 300, y: 350 },
        threatLevel: 0.25,
        type: "radar",
      },
      collateralDamage: "none",
      detectedByAca: 2,
      attackWeapon: {
        type: "kinetic",
        load: 0.1,
      },
      choiceWeight: -0.2,
    },
    tags: ["message", "aca", "aca-2", "map-warning", "map-warning-3"],
  } satisfies RequestApprovalToAttack,

  // 2nd message in conversation
  // first detected by aca 4, then by aca 3
  {
    id: "AAA27046-14A8-449C-960C-79BE303E7CCC",
    conversationId: "2CEC4322-3B9A-439A-9782-876C226A04B6",
    priority: 2,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 900, y: 700 },
        threatLevel: 0.2,
        type: "airDefense",
      },
      collateralDamage: "none",
      detectedByAca: 3,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.6,
      },
      choiceWeight: 0.5,
    },
    tags: ["message", "aca", "aca-3", "map-warning", "map-warning-2"],
  } satisfies RequestApprovalToAttack,

  // fuel low on aca
  {
    id: "EB207A99-D2DB-4C44-A211-293B0321C727",
    conversationId: "11C63EF4-8C0E-4A27-9BE6-1F427F8D8876",
    priority: 5,
    kind: "AcaFuelLow",
    data: {
      acaId: 5,
      fuelLevel: 0.1,
    },
    tags: ["message", "aca", "aca-5"],
  } satisfies AcaFuelLow,

  // example convo 3: low priority, low threat, no collateral
  {
    id: "301E5FB4-5D93-4233-9E52-4D87B95733D0",
    conversationId: "3D917527-1A29-4F79-9157-555AC8A26F76",
    priority: 7,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 500, y: 550 },
        threatLevel: 0.15,
        type: "artillery",
      },
      collateralDamage: "none",
      detectedByAca: 1,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.8,
      },
      choiceWeight: 0.3,
    },
    tags: ["message", "aca", "aca-1", "map-warning", "map-warning-4"],
  } satisfies RequestApprovalToAttack,

  // aca that previously send low fuel is now heading to base
  {
    id: "C7216187-5E0D-442A-9432-5D342A9F1362",
    conversationId: "11C63EF4-8C0E-4A27-9BE6-1F427F8D8876",
    priority: 5,
    kind: "AcaHeadingToBase",
    data: {
      acaId: 5,
      reason: "fuelLow",
    },
    tags: ["message", "aca", "aca-5"],
  } satisfies AcaHeadingToBase,

  // example convo 4: low priority, high threat, no collateral
  {
    id: "34F70C3A-A592-4028-AC8E-9792A84AC1C5",
    conversationId: "2F583080-2B2B-41E3-AD68-1E3DCC6EE1FE",
    priority: 7,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 950, y: 400 },
        threatLevel: 0.9,
        type: "radar",
      },
      collateralDamage: "none",
      detectedByAca: 2,
      attackWeapon: {
        type: "ewSuppression",
        load: 0.7,
      },
      choiceWeight: 0,
    },
    tags: ["message", "aca", "aca-2", "map-warning", "map-warning-5"],
  } satisfies RequestApprovalToAttack,

  // defect on aca
  {
    id: "C654FB26-2BD0-4128-88D2-D5CC7435B92F",
    conversationId: "2995C162-0295-44E8-9D60-E60C13747B61",
    priority: 3,
    kind: "AcaDefect",
    data: {
      acaId: 1,
      message: "A screw came loose mid-flight.",
    },
    tags: ["message", "aca", "aca-1"],
  } satisfies AcaDefect,

  // example convo 5: missile heading towards ownship, weapons low on aca
  {
    id: "CD99F764-45E6-4A46-9636-F62243313177",
    conversationId: "485C42FC-5E95-4614-91CE-3BFD2F4BE6B5",
    priority: 0,
    kind: "MissileToOwnshipDetected",
    data: {
      missileLocation: { x: 750, y: 200 },
      survivability: 0.8,
      detectedByAca: 1,
      acaAttackWeapon: {
        type: "veryIntimidatingWeaponName",
        load: 0.2,
      },
      choiceWeight: 1,
    },
    tags: ["missile", "aca", "aca-1", "map-warning", "map-warning-1"],
  } satisfies MissileToOwnshipDetected,

  // example convo 6: high priority, low threat, possible collateral
  {
    id: "156E8248-583C-4C44-A80A-7282D131A5C9",
    conversationId: "CC97C92A-79F1-412C-BF66-108A7D8BF864",
    priority: 2,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 850, y: 700 },
        threatLevel: 0.1,
        type: "airDefense",
      },
      collateralDamage: "complex",
      detectedByAca: 3,
      attackWeapon: {
        type: "kinetic",
        load: 0.5,
      },
      choiceWeight: -0.6,
    },
    tags: ["message", "aca", "aca-3", "map-warning", "map-warning-6"],
  } satisfies RequestApprovalToAttack,

  // example convo 7: high priority, low threat, no collateral, detected by ownship
  {
    id: "5442478F-50A5-4160-A9E7-C9218A776EC0",
    conversationId: "65F99985-5314-4EAA-8B57-4D99F3850EE7",
    priority: 3,
    kind: "RequestApprovalToAttack",
    data: {
      target: {
        location: { x: 1300, y: 400 },
        threatLevel: 0.15,
        type: "artillery",
      },
      collateralDamage: "none",
      detectedByAca: 3,
      attackWeapon: {
        type: "kinetic",
        load: 0.5,
      },
      choiceWeight: 0.4,
    },
    tags: ["message", "aca", "aca-3", "map-warning", "map-warning-7"],
  } satisfies RequestApprovalToAttack,
];

/* default timeline *******************************************************************************/

// prettier-ignore
export const UNVALIDATED_TIMELINE: Array<TimelineEntry> = [
  { delay: 0,      msg: { message: MESSAGES[0], stressLevel: 0.1 } },
  { delay: 10_000, msg: { message: MESSAGES[1], stressLevel: 0.3 } },
  { delay: 12_000, msg: { message: MESSAGES[2], stressLevel: 0.7 } },
  { delay: 24_000, msg: { message: MESSAGES[3], stressLevel: 0.5 } },
  { delay: 25_000, msg: { message: MESSAGES[4], stressLevel: 0.6 } },
  { delay: 28_000, msg: { message: MESSAGES[5], stressLevel: 0.8 } },
  { delay: 45_000, msg: { message: MESSAGES[6], stressLevel: 0.2 } },
  { delay: 50_000, msg: { message: MESSAGES[7], stressLevel: 0.9 } },
  { delay: 55_000, msg: { message: MESSAGES[8], stressLevel: 0.7 } },
  { delay: 60_000, msg: { message: MESSAGES[9], stressLevel: 0.6 } },
];

/* predefined messages for selection **************************************************************/

// prettier-ignore
export const SELECTION_MESSAGES = [
  { label: "RequestApproval - low prio", msg: MESSAGES[5] },
  { label: "RequestApproval - high prio", msg: MESSAGES[9] },
  { label: "RequestApproval - collateral", msg: MESSAGES[8] },
  { label: "MissileToOwnship", msg: MESSAGES[6] },
  { label: "AcaFuelLow", msg: MESSAGES[2] },
  { label: "AcaHeadingToBase", msg: MESSAGES[4] },
  { label: "AcaDefect", msg: MESSAGES[7] },
];
