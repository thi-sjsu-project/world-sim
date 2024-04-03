import { AcaDefect, AcaFuelLow, AcaHeadingToBase, Message, MissileToOwnshipDetected, RequestApprovalToAttack } from "./schema-types";
import typia from "typia";


/* sample messages ********************************************************************************/

const SAMPLES: Array<Message> = [
  // example convo 1: high priority, low threat, no collateral
  {
    id: 0,
    priority: 8,
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
    id: 1,
    priority: 2,
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
    id: 2,
    priority: 5,
    kind: "AcaFuelLow",
    data: {
      acaId: 5,
      fuelLevel: 0.1,
    },
  } satisfies AcaFuelLow,

  // example convo 3: low priority, low threat, no collateral
  {
    id: 3,
    priority: 3,
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
    id: 4,
    priority: 5,
    kind: "AcaHeadingToBase",
    data: {
      acaId: 5,
      reason: "fuelLow",
    },
  } satisfies AcaHeadingToBase,

  // example convo 4: low priority, high threat, no collateral
  {
    id: 5,
    priority: 3,
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
    id: 6,
    priority: 10,
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
    id: 7,
    priority: 7,
    kind: "AcaDefect",
    data: {
      acaId: 1,
      message: "A screw came loose mid-flight.",
    },
  } satisfies AcaDefect,

  // example convo 6: high priority, low threat, possible collateral
  {
    id: 8,
    priority: 8,
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
    id: 9,
    priority: 7,
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

const VALIDATORS = {
  "AcaDefect": typia.createValidateEquals<AcaDefect>(),
  "AcaFuelLow": typia.createValidateEquals<AcaFuelLow>(),
  "AcaHeadingToBase": typia.createValidateEquals<AcaHeadingToBase>(),
  "MissileToOwnshipDetected": typia.createValidateEquals<MissileToOwnshipDetected>(),
  "RequestApprovalToAttack": typia.createValidateEquals<RequestApprovalToAttack>(),
};

for (const msg of SAMPLES) {
  const validator = VALIDATORS[msg.kind];
  const validationResult = validator(msg);

  if (validationResult.success) {
    console.log(`msg ${msg.id}: \x1b[32mOK\x1b[0m`);
  } else {
    console.log(`msg ${msg.id}: \x1b[31mERROR\x1b[0m`);
    for (const error of validationResult.errors) {
      console.log(` - ${error.path}, expected ${error.expected}, found value ${error.value}`);
    }
  }
}
