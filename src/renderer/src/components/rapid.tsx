import { Signal } from "@/util";
import { IconX } from "@tabler/icons-solidjs";
import { Component, Show } from "solid-js";
import { AcaDefect, AcaFuelLow, AcaHeadingToBase, Message, MissileToOwnshipDetected, RequestApprovalToAttack, SimToCmMessage } from "../../../../submodules/message-schemas/schema-types";
import { v4 as uuid } from "uuid";

const MESSAGES: Array<Message> = [
    // example convo 1: high priority, low threat, no collateral
    {
      id: uuid(),
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
      id: uuid(),
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
      id: uuid(),
      priority: 5,
      kind: "AcaFuelLow",
      data: {
        acaId: 5,
        fuelLevel: 0.1,
      },
    } satisfies AcaFuelLow,
  
    // example convo 3: low priority, low threat, no collateral
    {
      id: uuid(),
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
      id: uuid(),
      priority: 5,
      kind: "AcaHeadingToBase",
      data: {
        acaId: 5,
        reason: "fuelLow",
      },
    } satisfies AcaHeadingToBase,
  
    // example convo 4: low priority, high threat, no collateral
    {
      id: uuid(),
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
      id: uuid(),
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
      id: uuid(),
      priority: 3,
      kind: "AcaDefect",
      data: {
        acaId: 1,
        message: "A screw came loose mid-flight.",
      },
    } satisfies AcaDefect,
  
    // example convo 6: high priority, low threat, possible collateral
    {
      id: uuid(),
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
      id: uuid(),
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


const generateUUID = () => {
    return uuid();
    }

export const RapidWidget: Component = () => {
  const visible = Signal(false);


  window.onRapidCreateAlert = () => {
    visible.set(true);
  }

const handleCreateClick = (message: Message) => {
    const newMessage = { ...message, id: generateUUID() };
    const simToCmMessage: SimToCmMessage = {
        message: newMessage,
        stressLevel: 0.5,
    };
    console.log(simToCmMessage.message.id)
    window.addRapidEntry(simToCmMessage);
}


  // make it so that there is objects in this window that creates messages
  //style these buttons

  return (
    <Show when={visible.get()}>
    <div class="absolute w-full h-full bg-[rgba(0,0,0,0.5)] left-0 top-0">
      <div class="w-[calc(100%-2rem)] mx-auto my-4 bg-zinc-800 px-4 py-3 max-w-96 rounded-xl">
        <button class="float-right text-zinc-500 -mr-1" onclick={() => visible.set(false)}>
          <IconX />
        </button>
        <h1 class="text-lg font-semibold text-zinc-100 text-center mb-4" >Choose a Message To Create:</h1>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[0])}>High Prio | Low Threat {MESSAGES[0].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[1])}>Low Prio | Low Threat {MESSAGES[1].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[2])}>{MESSAGES[2].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[3])}>Low Priority | Low Threat  {MESSAGES[3].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[4])}>New {MESSAGES[4].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[5])}>Low Priority | High Threat {MESSAGES[5].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[6])}>{MESSAGES[6].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[7])}>{MESSAGES[7].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[8])}>High Priority | Low Threat {MESSAGES[8].kind}</button>
        <button class="bg-zinc-700 px-2 py-1 rounded-lg inline-block w-[calc(100%-1.75rem)] mb-4 ml-4"onClick={() => handleCreateClick(MESSAGES[9])}>High Priority | Low Threat {MESSAGES[9].kind}</button>
        
        

      </div>
    </div>
  </Show>
  );
};
