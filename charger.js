// Ensure quest functions are available globally
window.giveSparksToSoap = giveSparksToSoap;
window.giveBatteriesToSoap = giveBatteriesToSoap;
// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// DecimalUtils is available globally from decimal_utils.js

// Performance optimization constants
const CHARGER_UI_UPDATE_THROTTLE = 100; // 10 FPS for UI updates
const CHARGER_MILESTONE_CHECK_THROTTLE = 500; // 2 FPS for milestone checks

// Throttling helpers
let lastChargerUIUpdate = 0;
let lastChargerMilestoneCheck = 0;














































function loadChargerState() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      const parsed = JSON.parse(slotData);
      if (parsed && parsed.chargerState) {
        const chargerData = parsed.chargerState;
        if (typeof chargerData.charge !== 'undefined') {
          charger.charge = DecimalUtils.isDecimal(chargerData.charge) ? chargerData.charge : new Decimal(chargerData.charge || 0);
        }
        charger.milestoneQuests = {
          3: { required: 10, given: new Decimal(0), completed: false }, 
          4: { required: 15, given: new Decimal(0), completed: false }, 
          5: { required: 25, given: new Decimal(0), completed: false }, 
          6: { required: 50, given: new Decimal(0), completed: false }, 
          7: { required: 30, given: new Decimal(0), completed: false, batteryRequired: 1, batteryGiven: 0 }, 
          8: { required: 75, given: new Decimal(0), completed: false, batteryRequired: 2, batteryGiven: 0 }  
        };
        if (Array.isArray(chargerData.milestones)) {
          chargerData.milestones.forEach((ms, idx) => {
            if (idx < charger.milestones.length) {
              charger.milestones[idx].unlocked = ms.unlocked || false;
            }
          });
        }
        if (chargerData.milestoneQuests) {
          Object.entries(chargerData.milestoneQuests).forEach(([index, quest]) => {
            if (charger.milestoneQuests[index]) {
              // Always load as Decimal
              charger.milestoneQuests[index].given = DecimalUtils.isDecimal(quest.given) ? quest.given : new Decimal(quest.given || 0);
              charger.milestoneQuests[index].completed = quest.completed || false;
              if ((index === '7' || index === '8') && typeof quest.batteryGiven !== 'undefined') {
                charger.milestoneQuests[index].batteryGiven = quest.batteryGiven;
              }
            }
          });
        }
        if (chargerData.questStage !== undefined && state) {
          if (!state.soapChargeQuest) {
            state.soapChargeQuest = { stage: chargerData.questStage, initialized: true };
          } else {
            state.soapChargeQuest.stage = chargerData.questStage;
            state.soapChargeQuest.initialized = true;
          }
        }
      }
    }
  } else {
    const savedState = localStorage.getItem('chargerState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed) {
        if (typeof parsed.charge !== 'undefined') {
          charger.charge = parsed.charge;
        }
        charger.milestoneQuests = {
          3: { required: 10, given: new Decimal(0), completed: false }, 
          4: { required: 15, given: new Decimal(0), completed: false }, 
          5: { required: 25, given: new Decimal(0), completed: false }, 
          6: { required: 50, given: new Decimal(0), completed: false }, 
          7: { required: 30, given: new Decimal(0), completed: false, batteryRequired: 1, batteryGiven: 0 }, 
          8: { required: 75, given: new Decimal(0), completed: false, batteryRequired: 2, batteryGiven: 0 }  
        };
        if (Array.isArray(parsed.milestones)) {
          parsed.milestones.forEach((ms, idx) => {
            if (idx < charger.milestones.length) {
              charger.milestones[idx].unlocked = ms.unlocked || false;
            }
          });
        }
        if (parsed.milestoneQuests) {
          Object.entries(parsed.milestoneQuests).forEach(([index, quest]) => {
            if (charger.milestoneQuests[index]) {
              // Always load as Decimal
              charger.milestoneQuests[index].given = DecimalUtils.isDecimal(quest.given) ? quest.given : new Decimal(quest.given || 0);
              charger.milestoneQuests[index].completed = quest.completed || false;
            }
          });
        }
        if (parsed.questStage !== undefined && state) {
          if (!state.soapChargeQuest) {
            state.soapChargeQuest = { stage: parsed.questStage, initialized: true };
          } else {
            state.soapChargeQuest.stage = parsed.questStage;
            state.soapChargeQuest.initialized = true;
          }
        }
      }
    }
  }
}

function saveChargerState() {
  if (!charger.milestoneQuests) {
    charger.milestoneQuests = {
      3: { required: 10, given: new Decimal(0), completed: false },
      4: { required: 15, given: new Decimal(0), completed: false },
      5: { required: 25, given: new Decimal(0), completed: false }, 
      6: { required: 50, given: new Decimal(0), completed: false }, 
      7: { required: 30, given: new Decimal(0), completed: false, batteryRequired: 1, batteryGiven: 0 }, 
      8: { required: 75, given: new Decimal(0), completed: false, batteryRequired: 2, batteryGiven: 0 }  
    };
  }
  const stateToSave = {
    charge: DecimalUtils.isDecimal(charger.charge) ? charger.charge.toString() : charger.charge,
    milestones: charger.milestones.map(ms => ({ unlocked: ms.unlocked })),
    milestoneQuests: {
  3: { required: 10, given: (charger.milestoneQuests && charger.milestoneQuests[3]) ? (DecimalUtils.isDecimal(charger.milestoneQuests[3].given) ? charger.milestoneQuests[3].given.toString() : new Decimal(charger.milestoneQuests[3].given || 0).toString()) : "0", completed: (charger.milestoneQuests && charger.milestoneQuests[3]) ? charger.milestoneQuests[3].completed || false : false },
  4: { required: 15, given: (charger.milestoneQuests && charger.milestoneQuests[4]) ? (DecimalUtils.isDecimal(charger.milestoneQuests[4].given) ? charger.milestoneQuests[4].given.toString() : new Decimal(charger.milestoneQuests[4].given || 0).toString()) : "0", completed: (charger.milestoneQuests && charger.milestoneQuests[4]) ? charger.milestoneQuests[4].completed || false : false },
  5: { required: 25, given: (charger.milestoneQuests && charger.milestoneQuests[5]) ? (DecimalUtils.isDecimal(charger.milestoneQuests[5].given) ? charger.milestoneQuests[5].given.toString() : new Decimal(charger.milestoneQuests[5].given || 0).toString()) : "0", completed: (charger.milestoneQuests && charger.milestoneQuests[5]) ? charger.milestoneQuests[5].completed || false : false },
  6: { required: 50, given: (charger.milestoneQuests && charger.milestoneQuests[6]) ? (DecimalUtils.isDecimal(charger.milestoneQuests[6].given) ? charger.milestoneQuests[6].given.toString() : new Decimal(charger.milestoneQuests[6].given || 0).toString()) : "0", completed: (charger.milestoneQuests && charger.milestoneQuests[6]) ? charger.milestoneQuests[6].completed || false : false },
  7: { required: 30, given: (charger.milestoneQuests && charger.milestoneQuests[7]) ? (DecimalUtils.isDecimal(charger.milestoneQuests[7].given) ? charger.milestoneQuests[7].given.toString() : new Decimal(charger.milestoneQuests[7].given || 0).toString()) : "0", completed: (charger.milestoneQuests && charger.milestoneQuests[7]) ? charger.milestoneQuests[7].completed || false : false, batteryRequired: 1, batteryGiven: (charger.milestoneQuests && charger.milestoneQuests[7]) ? charger.milestoneQuests[7].batteryGiven || 0 : 0 },
  8: { required: 75, given: (charger.milestoneQuests && charger.milestoneQuests[8]) ? (DecimalUtils.isDecimal(charger.milestoneQuests[8].given) ? charger.milestoneQuests[8].given.toString() : new Decimal(charger.milestoneQuests[8].given || 0).toString()) : "0", completed: (charger.milestoneQuests && charger.milestoneQuests[8]) ? charger.milestoneQuests[8].completed || false : false, batteryRequired: 2, batteryGiven: (charger.milestoneQuests && charger.milestoneQuests[8]) ? charger.milestoneQuests[8].batteryGiven || 0 : 0 }
    },
    questStage: state?.soapChargeQuest?.stage || 0
  };
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      const parsed = JSON.parse(slotData);
      parsed.chargerState = stateToSave;
      localStorage.setItem(`swariaSaveSlot${currentSaveSlot}`, JSON.stringify(parsed));
    }
  } else {
    localStorage.setItem('chargerState', JSON.stringify(stateToSave));
  }
}

let charger = {
  isOn: false,
  charge: new Decimal(0),
  questDialogueShown: false, 
  milestones: [
    { amount: new Decimal(10), unlocked: false, effect: 'Boost your charge gain based on how much charge you have.' },
    { amount: new Decimal(100), unlocked: false, effect: 'Boost the 4 main currency gain (fluff, swaria coins, feathers, artifacts) based on your charge.' },
    { amount: new Decimal(2500), unlocked: false, effect: 'Boost every light gain based on your charge.' },
    { amount: new Decimal(10000), unlocked: false, effect: 'Every OoM of charge after 10000, reduce the amount of red tiles by 1 in the generator minigame' },
    { amount: new Decimal(25000), unlocked: false, effect: 'Boost the amount of box generated based on charge amount' },
    { amount: new Decimal("1e6"), unlocked: false, effect: 'Boost your charge gain based on how much charge you have but slower' },
    { amount: new Decimal("1e10"), unlocked: false, effect: 'Boost pollen and flower gain based on your charge' },
    { amount: new Decimal("1e20"), unlocked: false, effect: 'Boost terrarium xp gain based on your charge' },
    { amount: new Decimal("1e30"), unlocked: false, effect: 'Boost nectar gain based on your charge' },
  ],
  chargePerSecond: 1,
  lastTick: Date.now(),
  soapClickCount: 0,
  soapLastClickTime: 0,
  soapClickResetTimer: null,
  soapIsMad: false,
  soapIsTalking: false,
  soapCurrentSpeechTimeout: null,
  soapChargeEaten: 0, 
  soapWillEatCharge: false, 
};
window.charger = charger;
const chargerBtn = document.getElementById('chargerToggleBtn');
const chargerChargeEl = document.getElementById('chargerCharge');
let chargerBoostEl = document.getElementById('chargerBoost');
let chargerCurrencyBoostEl = document.getElementById('chargerCurrencyBoost');

// Make charger UI elements globally accessible
window.chargerBtn = chargerBtn;
window.chargerChargeEl = chargerChargeEl;
window.chargerBoostEl = chargerBoostEl;
window.chargerCurrencyBoostEl = chargerCurrencyBoostEl;

function ensureChargerBoostElements() {
  if (!chargerBoostEl) {
    chargerBoostEl = document.createElement('div');
    chargerBoostEl.id = 'chargerBoost';
    chargerBoostEl.style.marginTop = '0.5em';
    if (chargerChargeEl && chargerChargeEl.parentNode) {
      chargerChargeEl.parentNode.insertBefore(chargerBoostEl, chargerChargeEl.nextSibling);
    }
  }
  if (!chargerCurrencyBoostEl) {
    chargerCurrencyBoostEl = document.createElement('div');
    chargerCurrencyBoostEl.id = 'chargerCurrencyBoost';
    chargerCurrencyBoostEl.style.marginTop = '0.2em';
    if (chargerBoostEl && chargerBoostEl.parentNode) {
      chargerBoostEl.parentNode.insertBefore(chargerCurrencyBoostEl, chargerBoostEl.nextSibling);
    }
  }
}

function updateChargerUI(forceUpdate = false) {
  const now = Date.now();
  if (!forceUpdate && (now - lastChargerUIUpdate) < CHARGER_UI_UPDATE_THROTTLE) {
    return;
  }
  lastChargerUIUpdate = now;

  // Ensure charger.charge is a Decimal
  if (!DecimalUtils.isDecimal(charger.charge)) {
    charger.charge = new Decimal(charger.charge || 0);
  }
  
  checkChargerMilestones(forceUpdate);
  ensureChargerBoostElements();
  if (typeof state !== 'undefined') {
    if (!state.soapChargeQuest || typeof state.soapChargeQuest === 'undefined') {
      state.soapChargeQuest = { stage: 0, initialized: false };
    }
    if (!charger.milestoneQuests || !state.soapChargeQuest.initialized) {
      charger.milestoneQuests = {
        3: { required: 10, given: new Decimal(0), completed: false }, 
        4: { required: 15, given: new Decimal(0), completed: false }, 
        5: { required: 25, given: new Decimal(0), completed: false }, 
        6: { required: 50, given: new Decimal(0), completed: false }, 
        7: { required: 30, given: new Decimal(0), completed: false },
        8: { required: 75, given: new Decimal(0), completed: false }, 
      };
      state.soapChargeQuest.initialized = true;
    }
    if (state.soapChargeQuest && state.soapChargeQuest.initialized) {
      // Automatically advance quest stage for all soap charger quests if the corresponding milestone is unlocked
      const questMilestoneStages = [
        { milestone: 3, stage: 1 },
        { milestone: 4, stage: 2 },
        { milestone: 5, stage: 3 },
        { milestone: 6, stage: 4 },
        { milestone: 7, stage: 5 },
        { milestone: 8, stage: 6 }
      ];
      for (const { milestone, stage } of questMilestoneStages) {
        if (charger.milestones[milestone] && charger.milestones[milestone].unlocked && state.soapChargeQuest.stage < stage) {
          state.soapChargeQuest.stage = stage;
        }
      }
    }
  }
  const chargerCard = document.getElementById('chargerCard');
  if (chargerCard) {
    if (charger.isOn) {
      chargerCard.classList.add('on');
    } else {
      chargerCard.classList.remove('on');
    }
    
    // Update title and styling for Mk.2
    const titleElement = chargerCard.querySelector('h2');
    if (titleElement) {
      if (isChargerMk2()) {
        titleElement.textContent = 'The Charger Mk.2';
        titleElement.style.color = 'rgba(33, 150, 243, 0.9)';
        chargerCard.style.setProperty('background', 'linear-gradient(135deg, #181D36 0%, #1a1f38 100%)', 'important');
        chargerCard.style.setProperty('border', '2px solid rgba(33, 150, 243, 0.6)', 'important');
        chargerCard.style.setProperty('box-shadow', '0 4px 20px rgba(33, 150, 243, 0.3)', 'important');
      } else {
        titleElement.textContent = 'The Charger';
        titleElement.style.color = '';
        chargerCard.style.removeProperty('background');
        chargerCard.style.removeProperty('border');
        chargerCard.style.removeProperty('box-shadow');
      }
    }
  }
  if (chargerBtn) {
    chargerBtn.textContent = charger.isOn ? 'Turn OFF' : 'Turn ON';
    chargerBtn.disabled = (state.powerStatus !== 'online' || state.powerEnergy <= 0);
  }
  if (chargerChargeEl) {
    const gain = getChargerGain();
    let gainText = `+${formatNumber(gain)}/s`;
    
    // Show auto-generation info for Mk.2
    if (isChargerMk2()) {
      const autoGain = gain.mul(0.01);
      gainText += `<br><span style="color:#2196F3;font-size:0.85em;">+${formatNumber(autoGain)}/s auto (Mk.2)</span>`;
    }
    
    chargerChargeEl.innerHTML = `
      <span style="font-size:1.3em;font-weight:bold;vertical-align:middle;">
        <img src='assets/icons/charge.png' style='width:2.2em;height:2.2em;vertical-align:middle;margin-right:0.2em;'>
        <span style='margin-right:0.3em;'>Charge:</span>
        ${formatNumber(charger.charge)}
      </span>
      <span style="color:#3cf;font-size:0.95em;margin-left:0.7em;">${gainText}</span>
    `;
  }
  const chargeEatenText = document.getElementById('soapChargeEatenText');
  if (chargeEatenText) {
    if (charger.soapChargeEaten > 0) {
      chargeEatenText.style.display = '';
      chargeEatenText.textContent = `Soap has eaten ${formatNumber(charger.soapChargeEaten)} charge!`;
    } else {
      chargeEatenText.style.display = 'none';
    }
  }
  if (chargerBoostEl) chargerBoostEl.textContent = '';
  if (chargerCurrencyBoostEl) chargerCurrencyBoostEl.textContent = '';
  const milestoneTable = document.getElementById('chargerMilestoneTable');
  if (milestoneTable) {
    // Apply Mk.2 styling to the milestone table container
    const milestoneCard = milestoneTable.closest('.card');
    if (milestoneCard) {
      if (isChargerMk2()) {
        milestoneCard.style.setProperty('background', 'linear-gradient(135deg, #181D36 0%, #1a1f38 100%)', 'important');
        milestoneCard.style.setProperty('border', '2px solid rgba(33, 150, 243, 0.6)', 'important');
        milestoneCard.style.setProperty('box-shadow', '0 4px 20px rgba(33, 150, 243, 0.3)', 'important');
        const milestoneTitle = milestoneCard.querySelector('h2');
        if (milestoneTitle) {
          milestoneTitle.style.color = 'rgba(33, 150, 243, 0.9)';
        }
      } else {
        milestoneCard.style.removeProperty('background');
        milestoneCard.style.removeProperty('border');
        milestoneCard.style.removeProperty('box-shadow');
        const milestoneTitle = milestoneCard.querySelector('h2');
        if (milestoneTitle) {
          milestoneTitle.style.color = '';
        }
      }
    }
    
    let html = '<table style="width:100%;border-collapse:collapse;">';
    html += '<tr><th style="text-align:left;padding:4px 8px;">Milestone</th><th style="text-align:left;padding:4px 8px;">Effect</th><th style="text-align:left;padding:4px 8px;">Status</th></tr>';
    let visibleMilestones = 4; 
    if (state && state.soapChargeQuest) {
      if (state.soapChargeQuest.stage >= 1) visibleMilestones = 5;
      if (state.soapChargeQuest.stage >= 2) visibleMilestones = 6;
      if (state.soapChargeQuest.stage >= 3) visibleMilestones = 7;
      if (state.soapChargeQuest.stage >= 4) visibleMilestones = 8;
      if (state.soapChargeQuest.stage >= 5) visibleMilestones = 9;
      if (state.soapChargeQuest.stage >= 6) visibleMilestones = 10;
    }
    charger.milestones.forEach((ms, idx) => {
      if (idx >= visibleMilestones && !ms.unlocked) return;
      let status = '';
      if (!ms.unlocked) {
        status = `<span style=\"color:#888;\">Need ${formatNumber(ms.amount)} charge</span>`;
      } else {
        if (idx === 0) {
          const boost = new Decimal(1).add(DecimalUtils.pow(Decimal.max(0, charger.charge.sub(10)), 0.5));
          const boostText = formatNumber(boost);
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} charge</span>`;
        } else if (idx === 1) {
          let boost = new Decimal(1);
          let isSoftcapped = false;
          if (charger.charge.gte(100)) {
            let effectiveCharge = charger.charge.sub(100);
            let softcapThreshold = new Decimal("1e30").sub(100); // 1e30 - 100
            
            if (effectiveCharge.lte(softcapThreshold)) {
              // Below softcap: normal formula
              boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.5));
            } else {
              // Above softcap: calculate pre-softcap value + softcapped portion
              let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.5));
              let excessCharge = effectiveCharge.sub(softcapThreshold);
              let softcappedPortion = DecimalUtils.pow(excessCharge, 0.25); // Reduced from 0.5 to 0.25
              boost = preSoftcapBoost.add(softcappedPortion);
              isSoftcapped = true;
            }
          }
          const boostText = formatNumber(boost);
          const softcapText = isSoftcapped ? '<br><span style="color:#ff4444;font-size:0.8em;">(softcapped)</span>' : '';
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} all main currencies</span>${softcapText}`;
        } else if (idx === 2) {
          let boost = new Decimal(1);
          let isSoftcapped = false;
          if (charger.charge.gte(2500)) {
            let effectiveCharge = charger.charge.sub(2500);
            let softcapThreshold = new Decimal("1e30").sub(2500); // 1e30 - 2500
            
            if (effectiveCharge.lte(softcapThreshold)) {
              // Below softcap: normal formula
              boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.3));
            } else {
              // Above softcap: calculate pre-softcap value + softcapped portion
              let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.3));
              let excessCharge = effectiveCharge.sub(softcapThreshold);
              let softcappedPortion = DecimalUtils.pow(excessCharge, 0.15); // Reduced from 0.3 to 0.15
              boost = preSoftcapBoost.add(softcappedPortion);
              isSoftcapped = true;
            }
          }
          const boostText = formatNumber(boost);
          const softcapText = isSoftcapped ? '<br><span style="color:#ff4444;font-size:0.8em;">(softcapped)</span>' : '';
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} all lights</span>${softcapText}`;
        } else if (idx === 3) {
          let reduction = 0;
          if (ms.unlocked && typeof charger.charge !== 'undefined' && charger.charge.gte(10000)) {
            reduction = 1 + Math.floor(charger.charge.log10().toNumber() - new Decimal(10000).log10().toNumber());
          }
          status = `<span style=\"color:#ffe066;font-weight:bold;\">-${reduction} red tile${reduction === 1 ? '' : 's'}</span>`;
        } else if (idx === 4) {
          let boost = new Decimal(1);
          let isSoftcapped = false;
          if (charger.charge.gte(25000)) {
            let effectiveCharge = charger.charge.sub(25000);
            let softcapThreshold = new Decimal("1e30").sub(25000); // 1e30 - 25000
            
            if (effectiveCharge.lte(softcapThreshold)) {
              // Below softcap: normal formula
              boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.2));
            } else {
              // Above softcap: calculate pre-softcap value + softcapped portion
              let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.2));
              let excessCharge = effectiveCharge.sub(softcapThreshold);
              let softcappedPortion = DecimalUtils.pow(excessCharge, 0.1); // Reduced from 0.2 to 0.1
              boost = preSoftcapBoost.add(softcappedPortion);
              isSoftcapped = true;
            }
          }
          const boostText = formatNumber(boost);
          const softcapText = isSoftcapped ? '<br><span style="color:#ff4444;font-size:0.8em;">(softcapped)</span>' : '';
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} box generation</span>${softcapText}`;
        } else if (idx === 5) {
          let boost = new Decimal(1);
          if (charger.charge.gte("1e6")) {
            boost = new Decimal(1).add(DecimalUtils.pow(Decimal.max(0, charger.charge.sub("1e6")), 0.3));
          }
          const boostText = formatNumber(boost);
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} charge (slow)</span>`;
        } else if (idx === 6) {
          let boost = 1;
          if (charger.charge.gte(new Decimal("1e10"))) {
            boost = 1 + charger.charge.sub(new Decimal("1e10")).max(0).pow(0.05).toNumber();
          }
          const boostText = formatNumber(new Decimal(boost));
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} pollen & flowers</span>`;
        } else if (idx === 7) {
          let boost = 1;
          if (charger.charge.gte(new Decimal("1e20"))) {
            boost = 1 + charger.charge.sub(new Decimal("1e20")).max(0).pow(0.05).toNumber();
          }
          const boostText = formatNumber(new Decimal(boost));
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} terrarium XP</span>`;
        } else if (idx === 8) {
          let boost = 1;
          if (charger.charge.gte(new Decimal("1e30"))) {
            boost = 1 + charger.charge.sub(new Decimal("1e30")).max(0).pow(0.05).toNumber();
          }
          const boostText = formatNumber(new Decimal(boost));
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} nectar</span>`;
        } else {
          status = '<span style="color:#2ecc40;font-weight:bold;">Unlocked</span>';
        }
      }
      let effectText = ms.effect;
      let milestoneStatus = '';
              if (!ms.unlocked) {
          if (idx >= 3) {
            const quest = charger.milestoneQuests[idx];
            if (!quest) {
              if (idx === 7) {
                const batteryTokens = (typeof state !== 'undefined' && state.batteryTokens) ? state.batteryTokens : 0;
                const sparks = (typeof state !== 'undefined' && state.sparks) ? state.sparks : 0;
                const batteryProgress = "0/1";
                const sparkProgress = `${Math.min(sparks, 30)}/30`;
                milestoneStatus = `<span style="color:#888;">Need ${formatNumber(ms.amount)} charge<br>${batteryProgress} battery and ${sparkProgress} sparks</span>`;
              } else {
                milestoneStatus = `<span style="color:#888;">Quest not initialized</span>`;
              }
            } else {
              // Always display quest.given and quest.required as numbers (handle Decimal)
              const given = (quest.given && typeof quest.given.toNumber === 'function') ? quest.given.toNumber() : (Number(quest.given) || 0);
              const required = (quest.required && typeof quest.required.toNumber === 'function') ? quest.required.toNumber() : (Number(quest.required) || 0);
              if (idx === 3 && state && state.soapChargeQuest && state.soapChargeQuest.stage === 0) {
                milestoneStatus = `<span style="color:#888;">Need ${formatNumber(ms.amount)} charge<br>${given}/${required} sparks</span>`;
              } else if (idx === 7) {
                const batteryProgress = `${quest.batteryGiven || 0}/${quest.batteryRequired || 1}`;
                const sparkProgress = `${given}/${required}`;
                milestoneStatus = `<span style="color:#888;">Need ${formatNumber(ms.amount)} charge<br>${batteryProgress} battery and ${sparkProgress} sparks</span>`;
              } else if (idx === 8) {
                const batteryProgress = `${quest.batteryGiven || 0}/${quest.batteryRequired || 2}`;
                const sparkProgress = `${given}/${required}`;
                milestoneStatus = `<span style="color:#888;">Need ${formatNumber(ms.amount)} charge<br>${batteryProgress} batteries and ${sparkProgress} sparks</span>`;
              } else {
                milestoneStatus = `<span style="color:#888;">Need ${formatNumber(ms.amount)} charge<br>${given}/${required} sparks</span>`;
              }
            }
          } else {
            milestoneStatus = `<span style="color:#888;">Need ${formatNumber(ms.amount)} charge</span>`;
          }
        } else {
          milestoneStatus = status;
        }
      html += `<tr style="background:${!ms.unlocked ? '#f8f8f8' : '#eaffea'};">
        <td style="padding:4px 8px;">Reach ${formatNumber(ms.amount)} charge</td>
        <td style="padding:4px 8px;">${effectText}</td>
        <td style="padding:4px 8px;">${milestoneStatus}</td>
      </tr>`;
    });
    html += '</table>';
    milestoneTable.innerHTML = html;
  }
}

// Prevent duplicate event handler attachment
if (chargerBtn && !chargerBtn.dataset.chargerHandlerAttached) {
  chargerBtn.dataset.chargerHandlerAttached = 'true';
  chargerBtn.onclick = function() {
    if (charger.isOn) {
      turnChargerOff();
    } else {
      turnChargerOn();
    }
  };
}

function turnChargerOn() {
  if (state.powerStatus !== 'online' || state.powerEnergy <= 0) return;
  charger.isOn = true;
  charger.lastTick = Date.now();
  updateChargerUI(true); // Force immediate update for user interaction
}

function turnChargerOff() {
  charger.isOn = false;
  updateChargerUI(true); // Force immediate update for user interaction
}

// Helper function to check if Charger Mk.2 is active (Soap friendship level 15+)
function isChargerMk2() {
  if (window.friendship && window.friendship.Generator) {
    return window.friendship.Generator.level >= 15;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    return friendship.Generator.level >= 15;
  }
  return false;
}

function chargerTick(diff) {
  // Use throttled versions for performance - these were running at 60 FPS!
  checkChargerMilestones();
  updateChargerUI();
  if (typeof state !== 'undefined' && state.justRefilledBySoap) {
    state.justRefilledBySoap = false;
    return;
  }
  if (typeof state !== 'undefined' && state.soapChargeQuest && !charger.soapIsMad && !charger.soapIsTalking && !charger.questDialogueShown) {
    const soapChargerCharacter = document.getElementById('soapChargerCharacter');
    const soapSpeech = document.getElementById('soapChargerSpeech');
    if (soapChargerCharacter && soapSpeech) {
      charger.questDialogueShown = true; 
      if (state.soapChargeQuest.stage === 0 && !charger.milestones[3].unlocked) {
        soapSpeech.textContent = "Right now we have 3 effects working, but I will need 10 sparks to get the fourth effect working!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 1 && !charger.milestones[4].unlocked) {
        soapSpeech.textContent = "Great! The fourth effect is working now. Give me 15 more sparks to unlock the fifth effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 2 && !charger.milestones[5].unlocked) {
        soapSpeech.textContent = "Excellent! The fifth effect is working! Give me 25 sparks to unlock the final effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 3 && !charger.milestones[6].unlocked) {
        soapSpeech.textContent = "Excellent! The Sixth effect is working! Give me 50 sparks to unlock the Next effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 4 && !charger.milestones[7].unlocked) {
        soapSpeech.textContent = "Amazing! The Seventh effect is working! Give me 1 battery and 30 sparks to unlock the final effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 5 && !charger.milestones[8].unlocked) {
        soapSpeech.textContent = "Fantastic! The eighth effect is working! Give me 2 batteries and 75 sparks to unlock the ultimate effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      }
    }
  }
  // Regular charge generation when charger is on
  if (charger.isOn) {
    if (typeof state !== 'undefined' && typeof state.powerEnergy !== 'undefined') {
      state.powerEnergy = state.powerEnergy.sub(new Decimal(10).mul(diff));
      if (state.powerEnergy.lt(0)) state.powerEnergy = new Decimal(0);
      if (state.powerEnergy.eq(0)) {
        charger.isOn = false;
        if (typeof updatePowerGeneratorUI === 'function') updatePowerGeneratorUI();
        return;
      }
      if (typeof updatePowerGeneratorUI === 'function') updatePowerGeneratorUI();
    }
    let gain = getChargerGain();
    
    // Show yellow light boost popup (throttled)
    if (window.prismState && window.prismState.yellowlight && window.prismState.yellowlight.gte("1e30") && 
        typeof window.showPrismGainPopup === 'function') {
      
      // Throttle popup to show only every 3 seconds
      if (!charger.lastYellowLightPopupTime) charger.lastYellowLightPopupTime = 0;
      const now = Date.now();
      if (now - charger.lastYellowLightPopupTime > 3000) {
        // Formula: 2^(log10(yellowlight) - 30) where each order of magnitude doubles the boost
        const logYellow = window.prismState.yellowlight.log10();
        const exponent = logYellow - 30; // Orders of magnitude above 1e30
        const yellowBoostMultiplier = new Decimal(2).pow(exponent);
        const totalGainPerSecond = gain;
        const baseGainPerSecond = totalGainPerSecond.div(yellowBoostMultiplier);
        const yellowLightContribution = totalGainPerSecond.sub(baseGainPerSecond);
        
        if (yellowLightContribution.gt(0.1)) {
          window.showPrismGainPopup('chargerCharge', yellowLightContribution, 'charge/s from yellow light');
          charger.lastYellowLightPopupTime = now;
        }
      }
    }
    
    charger.charge = charger.charge.add(gain.mul(diff));
    if (typeof window.trackChargeMilestone === 'function') {
      window.trackChargeMilestone(charger.charge);
    }
  }
  
  // Charger Mk.2 automatic charge generation (1% of charge gain even when off)
  if (isChargerMk2()) {
    let autoGain = getChargerGain().mul(0.01); // 1% of normal charge gain
    charger.charge = charger.charge.add(autoGain.mul(diff));
    if (typeof window.trackChargeMilestone === 'function') {
      window.trackChargeMilestone(charger.charge);
    }
  }
}

function getChargerGain() {
  let gain = new Decimal(charger.chargePerSecond);
  if (window.terrariumExtraChargeUpgradeLevel > 0 && typeof window.getExtraChargeUpgradeEffect === 'function') {
    gain = gain.mul(window.getExtraChargeUpgradeEffect(window.terrariumExtraChargeUpgradeLevel));
  }
  if (boughtElements && boughtElements[17]) gain = gain.mul(2);
  if (boughtElements && boughtElements[18]) gain = gain.mul(2);
  if (boughtElements && boughtElements[19]) gain = gain.mul(2);
  if (charger.milestones[0].unlocked) {
    gain = gain.mul(new Decimal(1).add(DecimalUtils.pow(Decimal.max(0, charger.charge.sub(10)), 0.5)));
  }
  if (window._chargerChargeBoost && window._chargerChargeBoost > 1) {
    gain = gain.mul(window._chargerChargeBoost);
  }
  
  // Apply yellow light boost to charge gain
  if (window.prismState && window.prismState.yellowlight && window.prismState.yellowlight.gte("1e30")) {
    // Formula: 2^(log10(yellowlight) - 30) where each order of magnitude doubles the boost
    const logYellow = window.prismState.yellowlight.log10();
    const exponent = logYellow - 30; // Orders of magnitude above 1e30
    const yellowBoost = new Decimal(2).pow(exponent);
    gain = gain.mul(yellowBoost);
  }
  
  // Apply nectarize milestone charge exponent boost
  if (typeof window.getNectarizeMilestoneBonus === 'function') {
    const milestoneBonus = window.getNectarizeMilestoneBonus();
    if (milestoneBonus.chargeExponent && milestoneBonus.chargeExponent.gt(0)) {
      gain = gain.pow(new Decimal(1).add(milestoneBonus.chargeExponent));
    }
  }
  
  return gain;
}

function checkChargerMilestones(forceUpdate = false) {
  const now = Date.now();
  if (!forceUpdate && (now - lastChargerMilestoneCheck) < CHARGER_MILESTONE_CHECK_THROTTLE) {
    return;
  }
  lastChargerMilestoneCheck = now;

  // Ensure charger.charge is a Decimal
  if (!DecimalUtils.isDecimal(charger.charge)) {
    charger.charge = new Decimal(charger.charge || 0);
  }
  
  if (!charger.milestoneQuests) {
    charger.milestoneQuests = {
      3: { required: 10, given: new Decimal(0), completed: false }, 
      4: { required: 15, given: new Decimal(0), completed: false }, 
      5: { required: 25, given: new Decimal(0), completed: false }, 
      6: { required: 50, given: new Decimal(0), completed: false }, 
      7: { required: 30, given: new Decimal(0), completed: false, batteryRequired: 1, batteryGiven: 0 }, 
      8: { required: 75, given: new Decimal(0), completed: false, batteryRequired: 2, batteryGiven: 0 }  
    };
  }
  
  // Auto-unlock milestones if a later milestone quest is completed
  // This fixes cases where milestones get stuck due to quest order issues
  if (typeof state !== 'undefined' && state.soapChargeQuest && state.soapChargeQuest.initialized) {
    for (let idx = 3; idx < charger.milestones.length; idx++) {
      if (!charger.milestones[idx].unlocked && charger.charge.gte(charger.milestones[idx].amount)) {
        // Check if any later milestone quest is completed
        for (let laterIdx = idx + 1; laterIdx < Math.min(charger.milestones.length, 9); laterIdx++) {
          const laterQuest = charger.milestoneQuests[laterIdx];
          if (laterQuest && laterQuest.completed) {
            // A later milestone is complete, so auto-unlock this one
            charger.milestones[idx].unlocked = true;
            const currentQuest = charger.milestoneQuests[idx];
            if (currentQuest) {
              currentQuest.completed = true;
            }

            break; // Only need to find one later completed milestone
          }
        }
      }
    }
  }
  if (typeof state !== 'undefined' && state.soapChargeQuest && state.soapChargeQuest.initialized) {
    charger.milestones.forEach((ms, idx) => {
      if (!ms.unlocked) {
        if (idx < 3) {
          if (charger.charge.gte(ms.amount)) {
            ms.unlocked = true;
          }
        } else {
          const quest = charger.milestoneQuests[idx];
          // Ensure quest.given is a Decimal
          if (quest && !DecimalUtils.isDecimal(quest.given)) {
            quest.given = new Decimal(quest.given || 0);
          }
          const batteryRequirementMet = (idx === 7 || idx === 8) ? 
            (quest.batteryGiven >= quest.batteryRequired) : true;
          if (quest && !quest.completed && DecimalUtils.gte(quest.given, quest.required) && batteryRequirementMet && charger.charge.gte(ms.amount)) {
            ms.unlocked = true;
            quest.completed = true;
            if (typeof state !== 'undefined' && state.soapChargeQuest) {
              if (idx === 3 && state.soapChargeQuest.stage === 0) {
                state.soapChargeQuest.stage = 1;
              } else if (idx === 4 && state.soapChargeQuest.stage === 1) {
                state.soapChargeQuest.stage = 2;
              } else if (idx === 5 && state.soapChargeQuest.stage === 2) {
                state.soapChargeQuest.stage = 3;
              } else if (idx === 6 && state.soapChargeQuest.stage === 3) {
                state.soapChargeQuest.stage = 4; 
              } else if (idx === 7 && state.soapChargeQuest.stage === 4) {
                state.soapChargeQuest.stage = 5; 
              } else if (idx === 8 && state.soapChargeQuest.stage === 5) {
                state.soapChargeQuest.stage = 6; 
              }
            }
            if (idx === 6 && state && state.soapChargeQuest && state.soapChargeQuest.stage === 3) {
              state.soapChargeQuest.stage = 4;
            }
            if (idx === 7 && state && state.soapChargeQuest && state.soapChargeQuest.stage === 4) {
              state.soapChargeQuest.stage = 5;
            }
          }
        }
      }
    });
  }
}

function applyChargerMilestoneEffects() {
  // Ensure charger.charge is a Decimal
  if (!DecimalUtils.isDecimal(charger.charge)) {
    charger.charge = new Decimal(charger.charge || 0);
  }
  
  const milestoneElementMap = [null, null, null, 17, 18, 19];
  if (charger.milestones[1].unlocked) {
    let boost = new Decimal(1);
    if (charger.charge.gte(100)) {
      let effectiveCharge = charger.charge.sub(100);
      let softcapThreshold = new Decimal("1e30").sub(100); // 1e30 - 100
      
      if (effectiveCharge.lte(softcapThreshold)) {
        // Below softcap: normal formula
        boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.5));
      } else {
        // Above softcap: calculate pre-softcap value + softcapped portion
        let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.5));
        let excessCharge = effectiveCharge.sub(softcapThreshold);
        let softcappedPortion = DecimalUtils.pow(excessCharge, 0.25); // Reduced from 0.5 to 0.25
        boost = preSoftcapBoost.add(softcappedPortion);
      }
    }
    window._chargerCurrencyBoost = boost;
  } else {
    window._chargerCurrencyBoost = new Decimal(1);
  }
  if (charger.milestones[2] && charger.milestones[2].unlocked) {
    let lightBoost = new Decimal(1);
    if (charger.charge.gte(2500)) {
      let effectiveCharge = charger.charge.sub(2500);
      let softcapThreshold = new Decimal("1e30").sub(2500); // 1e30 - 2500
      
      if (effectiveCharge.lte(softcapThreshold)) {
        // Below softcap: normal formula
        lightBoost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.3));
      } else {
        // Above softcap: calculate pre-softcap value + softcapped portion
        let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.3));
        let excessCharge = effectiveCharge.sub(softcapThreshold);
        let softcappedPortion = DecimalUtils.pow(excessCharge, 0.15); // Reduced from 0.3 to 0.15
        lightBoost = preSoftcapBoost.add(softcappedPortion);
      }
    }
    window._chargerLightBoost = lightBoost;
  } else {
    window._chargerLightBoost = new Decimal(1);
  }
  if (charger.milestones[3] && charger.milestones[3].unlocked) {
    let redTileReduction = 0;
    if (charger.charge.gte(10000)) {
      redTileReduction = 1 + Math.floor(charger.charge.log10().toNumber() - new Decimal(10000).log10().toNumber());
    }
    window._chargerRedTileReduction = redTileReduction;
  } else {
    window._chargerRedTileReduction = 0;
  }
  if (charger.milestones[4] && charger.milestones[4].unlocked && charger.charge.gte(25000)) {
    let effectiveCharge = charger.charge.sub(25000);
    let softcapThreshold = new Decimal("1e30").sub(25000); // 1e30 - 25000
    let boxBoost;
    
    if (effectiveCharge.lte(softcapThreshold)) {
      // Below softcap: normal formula
      boxBoost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.2));
    } else {
      // Above softcap: calculate pre-softcap value + softcapped portion
      let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.2));
      let excessCharge = effectiveCharge.sub(softcapThreshold);
      let softcappedPortion = DecimalUtils.pow(excessCharge, 0.1); // Reduced from 0.2 to 0.1
      boxBoost = preSoftcapBoost.add(softcappedPortion);
    }
    window._chargerBoxBoost = boxBoost;
  } else {
    window._chargerBoxBoost = new Decimal(1);
  }
  if (charger.milestones[5] && charger.milestones[5].unlocked && charger.charge.gte("1e6")) {
    let chargeBoost = new Decimal(1).add(DecimalUtils.pow(Decimal.max(0, charger.charge.sub("1e6")), 0.1)); 
    window._chargerChargeBoost = chargeBoost;
  } else {
    window._chargerChargeBoost = 1;
  }
  if (charger.milestones[6] && charger.milestones[6].unlocked && charger.charge.gte(new Decimal("1e10"))) {
    let terrariumBoost = 1 + charger.charge.sub(new Decimal("1e10")).max(0).pow(0.05).toNumber();
    window._chargerTerrariumBoost = terrariumBoost;
  } else {
    window._chargerTerrariumBoost = 1;
  }
  if (charger.milestones[7] && charger.milestones[7].unlocked && charger.charge.gte(new Decimal("1e20"))) {
    let terrariumXpBoost = 1 + charger.charge.sub(new Decimal("1e20")).max(0).pow(0.05).toNumber();
    window._chargerTerrariumXpBoost = terrariumXpBoost;
  } else {
    window._chargerTerrariumXpBoost = 1;
  }
  if (charger.milestones[8] && charger.milestones[8].unlocked && charger.charge.gte(new Decimal("1e30"))) {
    let nectarBoost = 1 + charger.charge.sub(new Decimal("1e30")).max(0).pow(0.05).toNumber();
    window._chargerNectarBoost = nectarBoost;
  } else {
    window._chargerNectarBoost = 1;
  }
}

if (!window._chargerGameTickPatched) {
  const origGameTick = window.gameTick;
  window.gameTick = function() {
    const now = Date.now();
    if (!charger.lastTick) charger.lastTick = now;
    const diff = (now - charger.lastTick) / 1000;
    charger.lastTick = now;
    chargerTick(diff);
    if (typeof origGameTick === 'function') origGameTick();
    applyChargerMilestoneEffects();
    saveChargerState();
  };
  window._chargerGameTickPatched = true;
}
if (!window._chargerGainPatched) {
  if (typeof window.getFluffRate === 'function') {
    const origGetFluffRate = window.getFluffRate;
    window.getFluffRate = function() {
      let base = origGetFluffRate();
      if (window._chargerCurrencyBoost) base = DecimalUtils.multiply(base, window._chargerCurrencyBoost);
      return base;
    };
  }
  if (typeof window.getSwariaCoinGain === 'function') {
    const origGetSwariaCoinGain = window.getSwariaCoinGain;
    window.getSwariaCoinGain = function(val) {
      let base = origGetSwariaCoinGain(val);
      if (window._chargerCurrencyBoost) base = DecimalUtils.multiply(base, window._chargerCurrencyBoost);
      return base;
    };
  }
  window._chargerGainPatched = true;
}

function logChargeGainRate() {
  let multiplier = new Decimal(1);
  if (window.terrariumExtraChargeUpgradeLevel > 0 && typeof window.getExtraChargeUpgradeEffect === 'function') {
    const extraChargeBonus = window.getExtraChargeUpgradeEffect(window.terrariumExtraChargeUpgradeLevel);
    multiplier = multiplier.mul(extraChargeBonus);
  }
  if (boughtElements) {
    if (boughtElements[17]) {
      multiplier = multiplier.mul(2);
    }
    if (boughtElements[18]) {
      multiplier = multiplier.mul(2);
    }
    if (boughtElements[19]) {
      multiplier = multiplier.mul(2);
    }
  }
  if (charger.milestones[0].unlocked) {
    const milestone1Boost = new Decimal(1).add(DecimalUtils.pow(Decimal.max(0, charger.charge.sub(10)), 0.5));
    multiplier = multiplier.mul(milestone1Boost);
  }
  if (window._chargerChargeBoost > 1) {
    multiplier *= window._chargerChargeBoost;
  }
  const expectedGain = charger.chargePerSecond * multiplier;
  const actualGain = getChargerGain();
  if (Math.abs(expectedGain - actualGain) > 0.01) {
  }
}

window.checkChargeGain = function() {
  logChargeGainRate();
};
window.checkTerrariumBoost = function() {
};
window.checkSoapQuest = function() {
};
window.testBatteryRequirement = function() {
};
window.testInventoryTokenSaveLoad = function() {
  const testValues = {
    swabucks: 100,
    berryPlate: 5,
    mushroomSoup: 3,
    batteries: 2,
    glitteringPetals: 7,
    chargedPrisma: 1,
  };
  Object.entries(testValues).forEach(([key, value]) => {
    if (window.state) {
      window.state[key] = value;
    }
  });
  if (typeof saveGame === 'function') {
    saveGame();
  }
  Object.keys(testValues).forEach(key => {
    if (window.state) {
      window.state[key] = 0;
    }
  });
  if (typeof loadGame === 'function') {
    loadGame();
  }
  Object.entries(testValues).forEach(([key, expectedValue]) => {
    const actualValue = window.state ? window.state[key] : 0;
    const match = actualValue === expectedValue;
  });
};
if (!window._chargerLightGainPatched) {
  const lightTypes = ["getLightGain", "getRedlightGain", "getOrangelightGain", "getYellowlightGain", "getGreenlightGain", "getBluelightGain"];
  lightTypes.forEach(fnName => {
    if (typeof window[fnName] === "function") {
      const origFn = window[fnName];
      window[fnName] = function(...args) {
        let base = origFn.apply(this, args);
  if (window._chargerLightBoost && window._chargerLightBoost > 1) base = new Decimal(base).mul(window._chargerLightBoost);
  return base;
      };
    }
  });
  window._chargerLightGainPatched = true;
}
if (!window._chargerTerrariumPatched) {
  window.applyChargerTerrariumBoost = function(basePollenGain, baseFlowerGain) {
    if (window._chargerTerrariumBoost && window._chargerTerrariumBoost > 1) {
      const pollenBoost = Math.floor(basePollenGain * (window._chargerTerrariumBoost - 1));
      const flowerBoost = Math.floor(baseFlowerGain * (window._chargerTerrariumBoost - 1));
      if (pollenBoost > 0) {
        window.terrariumPollen += pollenBoost;
        if (typeof window.showTerrariumGainPopup === 'function') {
          window.showTerrariumGainPopup('terrariumPollen', pollenBoost, 'Pollen');
        }
        if (typeof window.updateCurrencyDisplaysOnly === 'function') {
          window.updateCurrencyDisplaysOnly();
        }
      }
      if (flowerBoost > 0) {
        window.terrariumFlowers += flowerBoost;
        if (typeof window.showTerrariumGainPopup === 'function') {
          window.showTerrariumGainPopup('terrariumFlowers', flowerBoost, 'Flowers');
        }
        if (typeof window.updateCurrencyDisplaysOnly === 'function') {
          window.updateCurrencyDisplaysOnly();
        }
      }
      return { pollenBoost, flowerBoost };
    } else {
    }
    return { pollenBoost: 0, flowerBoost: 0 };
  };
  window._chargerTerrariumPatched = true;
}
if (!window._chargerTerrariumXpPatched) {
  window.applyChargerTerrariumXpBoost = function(baseXpGain) {
    if (window._chargerTerrariumXpBoost && window._chargerTerrariumXpBoost > 1) {
      // Calculate the total boosted XP and subtract the original to get the bonus
      const boostedTotal = Math.floor(baseXpGain * window._chargerTerrariumXpBoost);
      const xpBoost = boostedTotal - baseXpGain;
      if (xpBoost > 0) {
        return xpBoost;
      }
    }
    return 0;
  };
  window._chargerTerrariumXpPatched = true;
}
if (!window._chargerBoxGainPatched) {
  const boxGenerationFunctions = ["tickGenerators", "earnBox"];
  boxGenerationFunctions.forEach(fnName => {
    if (typeof window[fnName] === "function") {
      const origFn = window[fnName];
      window[fnName] = function(...args) {
        let result = origFn.apply(this, args);
        if (window._chargerBoxBoost && window._chargerBoxBoost > 1) {
        }
        return result;
      };
    }
  });
  if (typeof window.getGeneratorSpeed === 'function') {
    const origGetGeneratorSpeed = window.getGeneratorSpeed;
    window.getGeneratorSpeed = function(gen) {
      let speed = origGetGeneratorSpeed(gen);
      if (window._chargerBoxBoost && window._chargerBoxBoost > 1) {
        speed *= window._chargerBoxBoost;
      }
      return speed;
    };
  }
  window._chargerBoxGainPatched = true;
}

function initializeChargerElementUnlocking() {
  const milestoneElementMap = [null, null, null, 17, 18, 19];
  charger.milestones.forEach((ms, idx) => {
    let elementRequired = milestoneElementMap[idx];
    if (elementRequired && boughtElements && boughtElements[elementRequired+""]) {
      ms.elementUnlocked = true;
      if (charger.charge >= ms.amount) {
        ms.unlocked = true;
      }
    }
  });
}

function giveSparksToSoap(amount) {
  if (typeof state === 'undefined' || !state.soapChargeQuest || !state.soapChargeQuest.initialized) {
    return;
  }
  amount = Math.max(0, parseInt(amount) || 0);
  if (amount === 0) return;
  
  if (!charger.milestoneQuests) {
    charger.milestoneQuests = {
      3: { required: 10, given: new Decimal(0), completed: false },
      4: { required: 15, given: new Decimal(0), completed: false },
      5: { required: 25, given: new Decimal(0), completed: false },
      6: { required: 50, given: new Decimal(0), completed: false },
      7: { required: 30, given: new Decimal(0), completed: false, batteryRequired: 1, batteryGiven: 0 },
      8: { required: 75, given: new Decimal(0), completed: false, batteryRequired: 2, batteryGiven: 0 }
    };
  }
  
  let currentMilestoneIndex;
  let questStage = state.soapChargeQuest.stage;
  if (questStage === 0 && !charger.milestones[3].unlocked) {
    currentMilestoneIndex = 3; 
  } else if (questStage === 1 && !charger.milestones[4].unlocked) {
    currentMilestoneIndex = 4; 
  } else if (questStage === 2 && !charger.milestones[5].unlocked) {
    currentMilestoneIndex = 5; 
  } else if (questStage === 3 && !charger.milestones[6].unlocked) {
    currentMilestoneIndex = 6; 
  } else if (questStage === 4 && !charger.milestones[7].unlocked) {
    currentMilestoneIndex = 7; 
  } else if (questStage === 5 && !charger.milestones[8].unlocked) {
    currentMilestoneIndex = 8; 
  }
  
  if (currentMilestoneIndex !== undefined) {
    const quest = charger.milestoneQuests[currentMilestoneIndex];
    if (!quest) return;
    if (quest.completed) {
      showSoapQuestMessage("This effect is already unlocked!");
      return;
    }
    // DEBUG LOGGING

    // Ensure quest.given is a Decimal and add the amount
    if (!DecimalUtils.isDecimal(quest.given)) {
      quest.given = new Decimal(quest.given || 0);
    }
    quest.given = quest.given.plus(amount);

    saveChargerState();
    // Check if quest requirement is met (convert to numbers for simple comparison)
    const givenAmount = quest.given.toNumber();
    if (givenAmount >= quest.required) {
      const neededCharge = charger.milestones[currentMilestoneIndex].amount;
      const currentCharge = DecimalUtils.isDecimal(charger.charge) ? charger.charge.toNumber() : charger.charge;
      if (currentCharge >= neededCharge) {
        quest.completed = true;
        charger.milestones[currentMilestoneIndex].unlocked = true;
        // Update quest stage and show completion message
        if (currentMilestoneIndex === 3) {
          state.soapChargeQuest.stage = 1;
          showSoapQuestCompletionMessage("Perfect! Now the fourth effect is working. Each OoM of charge over 10,000 will reduce red tiles by 1 in the generator minigame! Let's get 15 more sparks for the next effect!");
        } else if (currentMilestoneIndex === 4) {
          state.soapChargeQuest.stage = 2;
          showSoapQuestCompletionMessage("Excellent! The fifth effect is now active. Your charge will boost box generation! Just 25 more sparks for the final effect!");
        } else if (currentMilestoneIndex === 5) {
          state.soapChargeQuest.stage = 3;
          showSoapQuestCompletionMessage("Amazing! The sixth effect is now working. Your charge will give an additional boost to charge generation! Now, let's get 50 more sparks for the ultimate boost!");
        } else if (currentMilestoneIndex === 6) {
          state.soapChargeQuest.stage = 4;
          showSoapQuestCompletionMessage("INCREDIBLE! You've unlocked the seventh charge effect - your charge will now boost your terrarium production! For the next effect, I need 1 battery and 30 sparks!");
        } else if (currentMilestoneIndex === 7) {
          state.soapChargeQuest.stage = 5;
          showSoapQuestCompletionMessage("LEGENDARY! You've unlocked the almost final charge effect - your charge will now boost your terrarium XP gain! For the ultimate effect, I need 2 batteries and 75 sparks!");
        } else if (currentMilestoneIndex === 8) {
          state.soapChargeQuest.stage = 6;
          showSoapQuestCompletionMessage("TRANSCENDENT! You've unlocked the ultimate charge effect - your charge will now boost your nectar gain! All charge effects are now truly complete!");
        }
        saveChargerState();
        if (typeof updateChargerUI === 'function') updateChargerUI(true); // Force immediate update for quest completion
      } else {
        const neededCharge = charger.milestones[currentMilestoneIndex].amount;
        showSoapQuestMessage(`You have enough sparks, but you need ${formatNumber(neededCharge)} charge to unlock this effect!`);
      }
    } else {
      const remaining = quest.required - givenAmount;
      showSoapQuestMessage(`Thanks! I still need ${remaining} more sparks to get this effect working.`);
    }
    updateChargerUI();
  }
}

function resetChargerTabState() {
  charger.questDialogueShown = false; 
}

function showSoapQuestMessage(message, duration = 8000) {
  const soapImg = document.getElementById("soapChargerCharacter");
  const soapSpeech = document.getElementById("soapChargerSpeech");
  if (!soapImg || !soapSpeech) return;
  if (charger.soapCurrentSpeechTimeout) {
    clearTimeout(charger.soapCurrentSpeechTimeout);
    charger.soapCurrentSpeechTimeout = null;
  }
  charger.soapIsTalking = true;
  soapSpeech.textContent = message;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    charger.soapIsTalking = false;
    charger.soapCurrentSpeechTimeout = null;
  }, duration);
}

function showSoapQuestCompletionMessage(message) {
  showSoapQuestMessage(message, 12000); 
}

function giveBatteriesToSoap(amount) {
  if (typeof state === 'undefined' || !state.soapChargeQuest || !state.soapChargeQuest.initialized) {
    return;
  }
  amount = Math.max(0, parseInt(amount) || 0);
  if (amount === 0) return;
  
  if (!charger.milestoneQuests) {
    charger.milestoneQuests = {
      7: { required: 30, given: new Decimal(0), completed: false, batteryRequired: 1, batteryGiven: 0 },
      8: { required: 75, given: new Decimal(0), completed: false, batteryRequired: 2, batteryGiven: 0 }
    };
  }
  
  let currentMilestoneIndex;
  let questStage = state.soapChargeQuest.stage;
  if (questStage === 4 && !charger.milestones[7].unlocked) {
    currentMilestoneIndex = 7;
  } else if (questStage === 5 && !charger.milestones[8].unlocked) {
    currentMilestoneIndex = 8;
  }
  
  if (currentMilestoneIndex !== undefined) {
    const quest = charger.milestoneQuests[currentMilestoneIndex];
    if (!quest) return;
    if (quest.completed) {
      showSoapQuestMessage("This effect is already unlocked!");
      return;
    }
    
    if (typeof quest.batteryGiven !== 'number') quest.batteryGiven = 0;
    const batteryNeeded = quest.batteryRequired - quest.batteryGiven;
    const batteryContribution = Math.min(amount, batteryNeeded);
    
    if (batteryContribution > 0) {
      quest.batteryGiven += batteryContribution;
      saveChargerState();
    }
    
    // Check quest completion (convert Decimal to number for comparison)
    const givenSparks = DecimalUtils.isDecimal(quest.given) ? quest.given.toNumber() : quest.given;
    if (quest.batteryGiven >= quest.batteryRequired && givenSparks >= quest.required) {
      const neededCharge = charger.milestones[currentMilestoneIndex].amount;
      const currentCharge = DecimalUtils.isDecimal(charger.charge) ? charger.charge.toNumber() : charger.charge;
      
      if (currentCharge >= neededCharge) {
        quest.completed = true;
        charger.milestones[currentMilestoneIndex].unlocked = true;
        if (currentMilestoneIndex === 7) {
          state.soapChargeQuest.stage = 5;
          showSoapQuestCompletionMessage("LEGENDARY! Now I have everything I need! The final effect is now working! For the ultimate effect, I need 2 batteries and 75 sparks!");
        } else if (currentMilestoneIndex === 8) {
          state.soapChargeQuest.stage = 6;
          showSoapQuestCompletionMessage("TRANSCENDENT! Now I have everything I need! The ultimate effect is now working! All charge effects are truly complete!");
        }
        saveChargerState();
        updateChargerUI(true); // Force immediate update for milestone unlock
      } else {
        showSoapQuestMessage(`You have enough batteries and sparks, but you need ${formatNumber(neededCharge)} charge to unlock this effect!`);
      }
    } else if (quest.batteryGiven >= quest.batteryRequired) {
      showSoapQuestMessage(`Perfect! I have the ${quest.batteryRequired === 1 ? 'battery' : 'batteries'} I need! I still need ${quest.required - givenSparks} more sparks for this effect.`);
    } else {
      showSoapQuestMessage(`Thanks! I still need ${quest.batteryRequired - quest.batteryGiven} more ${quest.batteryRequired - quest.batteryGiven === 1 ? 'battery' : 'batteries'} for this effect.`);
    }
    updateChargerUI(true); // Force immediate update for user interaction
  }
}

window.updateChargerUI = updateChargerUI;
window.showSoapChargerClickMessage = showSoapChargerClickMessage;
window.soapChargerGetsMad = soapChargerGetsMad;
window.soapEatCharge = soapEatCharge;
window.initializeChargerElementUnlocking = initializeChargerElementUnlocking;
window.resetChargerTabState = resetChargerTabState; 
window.giveSparksToSoap = giveSparksToSoap; 
window.giveBatteriesToSoap = giveBatteriesToSoap;

function showSoapChargerClickMessage() {
  const soapImg = document.getElementById("soapChargerCharacter");
  const soapSpeech = document.getElementById("soapChargerSpeech");
  if (!soapImg || !soapSpeech) return;
  if (window.isSoapSleeping) {
    soapSpeech.textContent = "Zzz...";
    soapSpeech.style.display = "block";
    soapImg.src = "assets/icons/soap sleep talking.png";
    if (charger.soapCurrentSpeechTimeout) clearTimeout(charger.soapCurrentSpeechTimeout);
    charger.soapCurrentSpeechTimeout = setTimeout(() => {
      soapSpeech.style.display = "none";
      soapImg.src = "assets/icons/soap sleeping.png";
      charger.soapIsTalking = false;
      charger.soapCurrentSpeechTimeout = null;
    }, 3000);
    return;
  }
  if (charger.soapIsMad) {
    return;
  }
  if (typeof window.trackHardModeSoapPoke === 'function') {
    window.trackHardModeSoapPoke();
  }
  const now = Date.now();
  if (now - charger.soapLastClickTime < 2000) { 
    charger.soapClickCount++;
  } else {
    charger.soapClickCount = 1; 
  }
  charger.soapLastClickTime = now;
  if (charger.soapClickResetTimer) {
    clearTimeout(charger.soapClickResetTimer);
  }
  charger.soapClickResetTimer = setTimeout(() => {
    charger.soapClickCount = 0;
  }, 3000);
  if (charger.soapClickCount >= 50) {
    soapChargerGetsMad();
    return;
  }
  if (charger.soapWillEatCharge) {
    soapEatCharge();
    return;
  }
  if (charger.soapCurrentSpeechTimeout) {
    clearTimeout(charger.soapCurrentSpeechTimeout);
    charger.soapCurrentSpeechTimeout = null;
  }
  charger.soapIsTalking = true;
  const randomQuote = soapChargerQuotes[Math.floor(Math.random() * soapChargerQuotes.length)];
  soapSpeech.textContent = randomQuote;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    charger.soapIsTalking = false;
    charger.soapCurrentSpeechTimeout = null;
  }, 8000);
}

function soapChargerGetsMad() {
  const soapImg = document.getElementById("soapChargerCharacter");
  const soapSpeech = document.getElementById("soapChargerSpeech");
  if (!soapImg || !soapSpeech) return;
  if (charger.soapCurrentSpeechTimeout) {
    clearTimeout(charger.soapCurrentSpeechTimeout);
    charger.soapCurrentSpeechTimeout = null;
  }
  charger.soapIsTalking = true;
  soapSpeech.textContent = "IF YOU POKE ME ONE MORE TIME!!! I WILL EAT 1% OF OUR CHARGE EVERYTIME YOU POKE ME!!!";
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap mad.png";
  charger.soapClickCount = 0;
  charger.soapIsMad = true;
  charger.soapWillEatCharge = true;
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    charger.soapIsTalking = false;
    charger.soapCurrentSpeechTimeout = null;
    charger.soapIsMad = false;
  }, 15000);
}

const soapEatingQuotes = [
  "nom nom nom... You're still gonna poke me, aren't you?",
  "Well, I'll just eat more charge then, nom nom nom...",
  "nom nom nom... Charge tastes weird you know",
  "nom nom nom... Feeling energized now",
  "nom nom nom... You really need to stop poking me",
  "nom nom nom... I'm not sure if I like this",
  "nom nom nom... Huh, so this is what charge tastes like",
  "nom no... *Gets shocked* AAAAAAAA",
  "nom nom nom... Why are you still poking me?",
  "nom nom nom... How about you stop poking me?",
  "nom nom nom... You want some charge?",
  "nom nom nom... Now that's a good charge",
  "nom nom nom... Maybe I should turn the power off to teach you a lesson to not poke me",
  "nom nom nom... I'll shove a soap bar in your mouth if you continue poking me",
  "nom nom nom... OMG PEACHY STOP POKING ME",
  "nom nom nom... Mlemmers"
];

function soapEatCharge() {
  const soapImg = document.getElementById("soapChargerCharacter");
  const soapSpeech = document.getElementById("soapChargerSpeech");
  if (!soapImg || !soapSpeech) return;
  const isBigNom = Math.random() < 0.1; 
  let chargeToEat;
  let message;
  let messageDuration;
  if (isBigNom) {
    chargeToEat = charger.charge.mul(0.5).floor();
    message = "Big nom, I just eated half your charge";
    messageDuration = 10000; 
    charger.soapIsMad = true; 
  } else {
    chargeToEat = charger.charge.mul(0.01).floor();
    message = soapEatingQuotes[Math.floor(Math.random() * soapEatingQuotes.length)];
    messageDuration = 5000; 
  }
  charger.charge = charger.charge.sub(chargeToEat);
  charger.soapChargeEaten = charger.soapChargeEaten.add(chargeToEat);
  if (window.state) {
    window.state.soapTotalChargeEaten = (window.state.soapTotalChargeEaten || 0) + chargeToEat;
  }
  if (typeof window.trackSoapChargeConsumption === 'function') {
    window.trackSoapChargeConsumption();
  }
  if (charger.soapCurrentSpeechTimeout) {
    clearTimeout(charger.soapCurrentSpeechTimeout);
    charger.soapCurrentSpeechTimeout = null;
  }
  charger.soapIsTalking = true;
  soapSpeech.textContent = message;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png"; 
  updateChargerUI(true); // Force immediate update for user interaction
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    charger.soapIsTalking = false;
    charger.soapCurrentSpeechTimeout = null;
    if (isBigNom) {
      charger.soapIsMad = false;
    }
  }, messageDuration);
}

function showSoapChargerSpeech() {
  const soapImg = document.getElementById("soapChargerCharacter");
  const soapSpeech = document.getElementById("soapChargerSpeech");
  if (!soapImg || !soapSpeech) return;
  if (window.isSoapSleeping) return;
  if (charger.soapIsMad || charger.soapIsTalking) return;
  const randomQuote = soapChargerQuotes[Math.floor(Math.random() * soapChargerQuotes.length)];
  soapSpeech.textContent = randomQuote;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  if (soapChargerSpeechTimeout) clearTimeout(soapChargerSpeechTimeout);
  soapChargerSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
  }, 10000); 
}

function resetCharger() {
  window.charger.charge = new Decimal(0);
  updateChargerUI(true); // Force immediate update for reset action
}

window.resetCharger = resetCharger;

function updateChargerSoapSleepState() {
  const soapImg = document.getElementById("soapChargerCharacter");
  if (!soapImg) return;
  if (window.isSoapSleeping) {
    soapImg.src = "assets/icons/soap sleeping.png";
  } else {
    soapImg.src = "assets/icons/soap.png";
  }
}

if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
      if (!window.isSoapSleeping) {
        window.isSoapSleeping = true;
        updateChargerSoapSleepState();
      }
    } else {
      if (window.isSoapSleeping) {
        window.isSoapSleeping = false;
        updateChargerSoapSleepState();
      }
    }
  });
}
loadChargerState();
window.saveChargerState = saveChargerState;
window.loadChargerState = loadChargerState;
window.checkChargerMilestones = checkChargerMilestones;