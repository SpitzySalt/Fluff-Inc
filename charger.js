// Ensure quest functions are available globally
window.giveSparksToSoap = giveSparksToSoap;
window.giveBatteriesToSoap = giveBatteriesToSoap;
// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// DecimalUtils is available globally from decimal_utils.js

// Performance optimization constants
const CHARGER_UI_UPDATE_THROTTLE = 50; // 20 FPS for UI updates (more responsive)
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
        if (Array.isArray(chargerData.milestones)) {
          chargerData.milestones.forEach((ms, idx) => {
            if (idx < charger.milestones.length) {
              charger.milestones[idx].unlocked = ms.unlocked || false;
            }
          });
        }
      }
    }
  } else {
    const savedState = localStorage.getItem('chargerState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed) {
        if (typeof parsed.charge !== 'undefined') {
          charger.charge = new Decimal(parsed.charge || 0);
        }
        if (Array.isArray(parsed.milestones)) {
          parsed.milestones.forEach((ms, idx) => {
            if (idx < charger.milestones.length) {
              charger.milestones[idx].unlocked = ms.unlocked || false;
            }
          });
        }
      }
    }
  }
}

function saveChargerState() {
  const stateToSave = {
    charge: DecimalUtils.isDecimal(charger.charge) ? charger.charge.toString() : charger.charge,
    milestones: charger.milestones.map(ms => ({ unlocked: ms.unlocked }))
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
  soapChargeEaten: new Decimal(0), 
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

// Fast charger display update - only updates the charge number for real-time feedback
function fastUpdateChargerDisplay() {
  if (!chargerChargeEl || !charger) return;
  
  // Only update if charger exists and has charge
  if (!DecimalUtils.isDecimal(charger.charge)) {
    charger.charge = new Decimal(charger.charge || 0);
  }
  
  const gain = getChargerGain();
  let gainText = `+${formatNumber(gain)}/s`;
  
  // Show auto-generation info for Mk.2
  if (isChargerMk2()) {
    const autoGain = gain.mul(0.01);
    gainText += `<br><span style="color:#2196F3;font-size:0.85em;">+${formatNumber(autoGain)}/s auto (Mk.2)</span>`;
  }
  
  // Direct DOM update without any throttling
  const currentHTML = `
    <span style="font-size:1.3em;font-weight:bold;vertical-align:middle;">
      <img src='assets/icons/charge.png' style='width:2.2em;height:2.2em;vertical-align:middle;margin-right:0.2em;'>
      <span style='margin-right:0.3em;'>Charge:</span>
      ${formatNumber(charger.charge)}
    </span>
    <span style="color:#3cf;font-size:0.95em;margin-left:0.7em;">${gainText}</span>
  `;
  
  // Only update if content actually changed to avoid unnecessary DOM manipulation
  if (chargerChargeEl.innerHTML !== currentHTML) {
    chargerChargeEl.innerHTML = currentHTML;
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
    
    charger.milestones.forEach((ms, idx) => {
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
            let softcapThreshold = new Decimal("1e30").sub(100);
            
            if (effectiveCharge.lte(softcapThreshold)) {
              boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.5));
            } else {
              let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.5));
              let excessCharge = effectiveCharge.sub(softcapThreshold);
              let softcappedPortion = DecimalUtils.pow(excessCharge, 0.25);
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
            let softcapThreshold = new Decimal("1e30").sub(2500);
            
            if (effectiveCharge.lte(softcapThreshold)) {
              boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.3));
            } else {
              let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.3));
              let excessCharge = effectiveCharge.sub(softcapThreshold);
              let softcappedPortion = DecimalUtils.pow(excessCharge, 0.15);
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
            let softcapThreshold = new Decimal("1e30").sub(25000);
            
            if (effectiveCharge.lte(softcapThreshold)) {
              boost = new Decimal(1).add(DecimalUtils.pow(effectiveCharge, 0.2));
            } else {
              let preSoftcapBoost = new Decimal(1).add(DecimalUtils.pow(softcapThreshold, 0.2));
              let excessCharge = effectiveCharge.sub(softcapThreshold);
              let softcappedPortion = DecimalUtils.pow(excessCharge, 0.1);
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
      
      html += `<tr style="background:${!ms.unlocked ? '#f8f8f8' : '#eaffea'};">
        <td style="padding:4px 8px;">Reach ${formatNumber(ms.amount)} charge</td>
        <td style="padding:4px 8px;">${effectText}</td>
        <td style="padding:4px 8px;">${status}</td>
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
  if (state.powerStatus !== 'online' || state.powerEnergy <= 0) {
    return;
  }
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
        soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 1 && !charger.milestones[4].unlocked) {
        soapSpeech.textContent = "Great! The fourth effect is working now. Give me 15 more sparks to unlock the fifth effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 2 && !charger.milestones[5].unlocked) {
        soapSpeech.textContent = "Excellent! The fifth effect is working! Give me 25 sparks to unlock the final effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 3 && !charger.milestones[6].unlocked) {
        soapSpeech.textContent = "Excellent! The Sixth effect is working! Give me 50 sparks to unlock the Next effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 4 && !charger.milestones[7].unlocked) {
        soapSpeech.textContent = "Amazing! The Seventh effect is working! Give me 1 battery and 30 sparks to unlock the final effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      } else if (state.soapChargeQuest.stage === 5 && !charger.milestones[8].unlocked) {
        soapSpeech.textContent = "Fantastic! The eighth effect is working! Give me 2 batteries and 75 sparks to unlock the ultimate effect!";
        soapSpeech.style.display = "block";
        soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
        charger.soapIsTalking = true;
        setTimeout(() => {
          soapSpeech.style.display = "none";
          soapChargerCharacter.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          charger.soapIsTalking = false;
        }, 8000);
      }
    }
  }
  // Regular charge generation when charger is on
  if (charger.isOn) {
    if (typeof state !== 'undefined' && typeof state.powerEnergy !== 'undefined') {
      const powerBeforeDrain = state.powerEnergy;
      // Calculate power drain rate - 3x faster when kitomode is active
      const drainMultiplier = (window.state && window.state.kitoFoxModeActive) ? 3 : 1;
      const powerDrain = new Decimal(10).mul(diff).mul(drainMultiplier);
      state.powerEnergy = state.powerEnergy.sub(powerDrain);
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
    
    let finalGain = gain.mul(diff);
    if (typeof window.applyTotalInfinityReachedBoost === 'function') {
      finalGain = window.applyTotalInfinityReachedBoost(finalGain);
    }
    const chargeBeforeGain = charger.charge;
    charger.charge = charger.charge.add(finalGain);
    if (typeof window.trackChargeMilestone === 'function') {
      window.trackChargeMilestone(charger.charge);
    }
  }
  
  // Charger Mk.2 automatic charge generation (1% of charge gain even when off)
  if (isChargerMk2()) {
    let autoGain = getChargerGain().mul(0.01); // 1% of normal charge gain
    let finalAutoGain = autoGain.mul(diff);
    if (typeof window.applyTotalInfinityReachedBoost === 'function') {
      finalAutoGain = window.applyTotalInfinityReachedBoost(finalAutoGain);
    }
    const chargeBeforeAutoGain = charger.charge;
    charger.charge = charger.charge.add(finalAutoGain);
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
  
  // Simple charge-based milestone unlocking - no quests required
  charger.milestones.forEach((ms, idx) => {
    if (!ms.unlocked && charger.charge.gte(ms.amount)) {
      ms.unlocked = true;
    }
  });
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
  // Quest system removed - sparks now only give friendship points to Soap
  if (typeof state === 'undefined') {
    return;
  }
  amount = Math.max(0, parseInt(amount) || 0);
  if (amount === 0) return;
  
  // Add friendship points for giving sparks to Soap
  if (amount > 0) {
    const dept = 'Generator';
    const pointsPerToken = 20;
    const totalPoints = new Decimal(pointsPerToken).mul(amount);

    window.state.friendship[dept] = window.state.friendship[dept] || { level: 0, points: new Decimal(0) };
    
    if (!DecimalUtils.isDecimal(window.state.friendship[dept].points)) {
      window.state.friendship[dept].points = new Decimal(window.state.friendship[dept].points || 0);
    }
    
    if (typeof window.state.friendship[dept].level !== 'number' || isNaN(window.state.friendship[dept].level)) {
      window.state.friendship[dept].level = 0;
    }
    
    window.state.friendship[dept].points = window.state.friendship[dept].points.add(totalPoints);
    
    const currentLevel = window.state.friendship[dept].level;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel <= window.MAX_FRIENDSHIP_LEVEL && typeof window.getFriendshipPointsForLevel === 'function') {
      const pointsNeededForCurrentLevel = window.getFriendshipPointsForLevel(currentLevel);
      
      if (window.state.friendship[dept].points.gte(pointsNeededForCurrentLevel)) {
        window.state.friendship[dept].level = nextLevel;
        window.state.friendship[dept].points = new Decimal(0);
      }
    }
    
    if (typeof window.renderDepartmentStatsButtons === 'function') {
      window.renderDepartmentStatsButtons();
    }
    
    const statsModal = document.getElementById('departmentStatsModal');
    if (statsModal && statsModal.style.display !== 'none') {
      const title = document.getElementById('departmentStatsModalTitle');
      if (title && title.textContent && title.textContent.toLowerCase().includes(dept.toLowerCase())) {
        if (typeof window.showDepartmentStatsModal === 'function') window.showDepartmentStatsModal(dept);
      }
    }
    
    showSoapQuestMessage(`Thanks for the ${amount} spark${amount > 1 ? 's' : ''}! Milestones now unlock automatically when you reach the required charge amount.`);
  }
}

function resetChargerTabState() {
  // No longer needed without quest system, kept for compatibility
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
    charger.soapIsTalking = false;
    charger.soapCurrentSpeechTimeout = null;
  }, duration);
}

function showSoapQuestCompletionMessage(message) {
  showSoapQuestMessage(message, 12000); 
}

function giveBatteriesToSoap(amount) {
  // Quest system removed - batteries now only give friendship points to Soap
  if (typeof state === 'undefined') {
    return;
  }
  amount = Math.max(0, parseInt(amount) || 0);
  if (amount === 0) return;
  
  // Add friendship points for giving batteries to Soap
  if (amount > 0) {
    const dept = 'Generator';
    const pointsPerToken = 50;
    const totalPoints = new Decimal(pointsPerToken).mul(amount);

    window.state.friendship[dept] = window.state.friendship[dept] || { level: 0, points: new Decimal(0) };
    
    if (!DecimalUtils.isDecimal(window.state.friendship[dept].points)) {
      window.state.friendship[dept].points = new Decimal(window.state.friendship[dept].points || 0);
    }
    
    if (typeof window.state.friendship[dept].level !== 'number' || isNaN(window.state.friendship[dept].level)) {
      window.state.friendship[dept].level = 0;
    }
    
    window.state.friendship[dept].points = window.state.friendship[dept].points.add(totalPoints);
    
    const currentLevel = window.state.friendship[dept].level;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel <= window.MAX_FRIENDSHIP_LEVEL && typeof window.getFriendshipPointsForLevel === 'function') {
      const pointsNeededForCurrentLevel = window.getFriendshipPointsForLevel(currentLevel);
      
      if (window.state.friendship[dept].points.gte(pointsNeededForCurrentLevel)) {
        window.state.friendship[dept].level = nextLevel;
        window.state.friendship[dept].points = new Decimal(0);
      }
    }
    
    if (typeof window.renderDepartmentStatsButtons === 'function') {
      window.renderDepartmentStatsButtons();
    }
    
    const statsModal = document.getElementById('departmentStatsModal');
    if (statsModal && statsModal.style.display !== 'none') {
      const title = document.getElementById('departmentStatsModalTitle');
      if (title && title.textContent && title.textContent.toLowerCase().includes(dept.toLowerCase())) {
        if (typeof window.showDepartmentStatsModal === 'function') window.showDepartmentStatsModal(dept);
      }
    }
    
    showSoapQuestMessage(`Thanks for the ${amount} batter${amount > 1 ? 'ies' : 'y'}! Milestones now unlock automatically when you reach the required charge amount.`);
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
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('sleep_talk') : "assets/icons/soap sleep talking.png";
    if (charger.soapCurrentSpeechTimeout) clearTimeout(charger.soapCurrentSpeechTimeout);
    charger.soapCurrentSpeechTimeout = setTimeout(() => {
      soapSpeech.style.display = "none";
      soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('sleep') : "assets/icons/soap sleeping.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('mad') : "assets/icons/soap mad.png";
  charger.soapClickCount = 0;
  charger.soapIsMad = true;
  charger.soapWillEatCharge = true;
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png"; 
  updateChargerUI(true); // Force immediate update for user interaction
  charger.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  if (soapChargerSpeechTimeout) clearTimeout(soapChargerSpeechTimeout);
  soapChargerSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('sleep') : "assets/icons/soap sleeping.png";
  } else {
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
window.chargerTick = chargerTick;
window.fastUpdateChargerDisplay = fastUpdateChargerDisplay;