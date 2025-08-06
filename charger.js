// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file














































function loadChargerState() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      const parsed = JSON.parse(slotData);
      if (parsed && parsed.chargerState) {
        const chargerData = parsed.chargerState;
        if (typeof chargerData.charge !== 'undefined') {
          charger.charge = chargerData.charge;
        }
        charger.milestoneQuests = {
          3: { required: 10, given: 0, completed: false }, 
          4: { required: 15, given: 0, completed: false }, 
          5: { required: 25, given: 0, completed: false }, 
          6: { required: 50, given: 0, completed: false }, 
          7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 }, 
          8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }  
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
              charger.milestoneQuests[index].given = quest.given || 0;
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
          3: { required: 10, given: 0, completed: false }, 
          4: { required: 15, given: 0, completed: false }, 
          5: { required: 25, given: 0, completed: false }, 
          6: { required: 50, given: 0, completed: false }, 
          7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 }, 
          8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }  
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
              charger.milestoneQuests[index].given = quest.given || 0;
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
      3: { required: 10, given: 0, completed: false },
      4: { required: 15, given: 0, completed: false },
      5: { required: 25, given: 0, completed: false }, 
      6: { required: 50, given: 0, completed: false }, 
      7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 }, 
      8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }  
    };
  }
  const stateToSave = {
    charge: charger.charge,
    milestones: charger.milestones.map(ms => ({ unlocked: ms.unlocked })),
    milestoneQuests: {
      3: { required: 10, given: (charger.milestoneQuests && charger.milestoneQuests[3]) ? charger.milestoneQuests[3].given || 0 : 0, completed: (charger.milestoneQuests && charger.milestoneQuests[3]) ? charger.milestoneQuests[3].completed || false : false },
      4: { required: 15, given: (charger.milestoneQuests && charger.milestoneQuests[4]) ? charger.milestoneQuests[4].given || 0 : 0, completed: (charger.milestoneQuests && charger.milestoneQuests[4]) ? charger.milestoneQuests[4].completed || false : false },
      5: { required: 25, given: (charger.milestoneQuests && charger.milestoneQuests[5]) ? charger.milestoneQuests[5].given || 0 : 0, completed: (charger.milestoneQuests && charger.milestoneQuests[5]) ? charger.milestoneQuests[5].completed || false : false },
      6: { required: 50, given: (charger.milestoneQuests && charger.milestoneQuests[6]) ? charger.milestoneQuests[6].given || 0 : 0, completed: (charger.milestoneQuests && charger.milestoneQuests[6]) ? charger.milestoneQuests[6].completed || false : false },
      7: { required: 30, given: (charger.milestoneQuests && charger.milestoneQuests[7]) ? charger.milestoneQuests[7].given || 0 : 0, completed: (charger.milestoneQuests && charger.milestoneQuests[7]) ? charger.milestoneQuests[7].completed || false : false, batteryRequired: 1, batteryGiven: (charger.milestoneQuests && charger.milestoneQuests[7]) ? charger.milestoneQuests[7].batteryGiven || 0 : 0 },
      8: { required: 75, given: (charger.milestoneQuests && charger.milestoneQuests[8]) ? charger.milestoneQuests[8].given || 0 : 0, completed: (charger.milestoneQuests && charger.milestoneQuests[8]) ? charger.milestoneQuests[8].completed || false : false, batteryRequired: 2, batteryGiven: (charger.milestoneQuests && charger.milestoneQuests[8]) ? charger.milestoneQuests[8].batteryGiven || 0 : 0 }
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
  charge: 0,
  questDialogueShown: false, 
  milestones: [
    { amount: 10, unlocked: false, effect: 'Boost your charge gain based on how much charge you have.' },
    { amount: 100, unlocked: false, effect: 'Boost the 4 main currency gain (fluff, swaria coins, feathers, artifacts) based on your charge.' },
    { amount: 2500, unlocked: false, effect: 'Boost every light gain based on your charge.' },
    { amount: 10000, unlocked: false, effect: 'Every OoM of charge after 10000, reduce the amount of red tiles by 1 in the generator minigame' },
    { amount: 25000, unlocked: false, effect: 'Boost the amount of box generated based on charge amount' },
    { amount: 1e6, unlocked: false, effect: 'Boost your charge gain based on how much charge you have but slower' },
    { amount: 1e10, unlocked: false, effect: 'Boost pollen and flower gain based on your charge' },
    { amount: 1e16, unlocked: false, effect: 'Boost terrarium xp gain based on your charge' },
    { amount: 1e30, unlocked: false, effect: 'Boost nectar gain based on your charge' },
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

function updateChargerUI() {
  checkChargerMilestones();
  ensureChargerBoostElements();
  if (typeof state !== 'undefined') {
    if (!state.soapChargeQuest || typeof state.soapChargeQuest === 'undefined') {
      state.soapChargeQuest = { stage: 0, initialized: false };
    }
    if (!charger.milestoneQuests || !state.soapChargeQuest.initialized) {
      charger.milestoneQuests = {
        3: { required: 10, given: 0, completed: false }, 
        4: { required: 15, given: 0, completed: false }, 
        5: { required: 25, given: 0, completed: false }, 
        6: { required: 50, given: 0, completed: false }, 
        7: { required: 30, given: 0, completed: false },
        8: { required: 75, given: 0, completed: false }, 
      };
      state.soapChargeQuest.initialized = true;
    }
    if (state.soapChargeQuest && state.soapChargeQuest.initialized) {
      if (charger.milestones[6] && charger.milestones[6].unlocked && state.soapChargeQuest.stage < 4) {
        state.soapChargeQuest.stage = 4;
      }
      if (charger.milestones[7] && charger.milestones[7].unlocked && state.soapChargeQuest.stage < 5) {
        state.soapChargeQuest.stage = 5;
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
  }
  if (chargerBtn) {
    chargerBtn.textContent = charger.isOn ? 'Turn OFF' : 'Turn ON';
    chargerBtn.disabled = (state.powerStatus !== 'online' || state.powerEnergy <= 0);
  }
  if (chargerChargeEl) {
    const gain = getChargerGain();
    chargerChargeEl.innerHTML = `
      <span style="font-size:1.3em;font-weight:bold;vertical-align:middle;">
        <img src='assets/icons/charge.png' style='width:2.2em;height:2.2em;vertical-align:middle;margin-right:0.2em;'>
        <span style='margin-right:0.3em;'>Charge:</span>
        ${formatNumber(charger.charge)}
      </span>
      <span style="color:#3cf;font-size:0.95em;margin-left:0.7em;">+${formatNumber(gain)}/s</span>
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
        status = `<span style=\"color:#888;\">Need ${ms.amount} charge</span>`;
      } else {
        if (idx === 0) {
          const boost = 1 + Math.pow(Math.max(0, charger.charge - 10), 0.5);
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} charge</span>`;
        } else if (idx === 1) {
          let boost = 1;
          if (charger.charge >= 100) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 100), 0.25);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} all main currencies</span>`;
        } else if (idx === 2) {
          let boost = 1;
          if (charger.charge >= 2500) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 2500), 0.3);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} all lights</span>`;
        } else if (idx === 3) {
          let reduction = 0;
          if (ms.unlocked && typeof charger.charge !== 'undefined' && charger.charge >= 10000) {
            reduction = 1 + Math.floor(Math.log10(charger.charge) - Math.log10(10000));
          }
          status = `<span style=\"color:#ffe066;font-weight:bold;\">-${reduction} red tile${reduction === 1 ? '' : 's'}</span>`;
        } else if (idx === 4) {
          let boost = 1;
          if (charger.charge >= 25000) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 25000), 0.2);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} box generation</span>`;
        } else if (idx === 5) {
          let boost = 1;
          if (charger.charge >= 1e6) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 1e6), 0.3);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} charge (slow)</span>`;
        } else if (idx === 6) {
          let boost = 1;
          if (charger.charge >= 1e10) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 1e10), 0.05);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} pollen & flowers</span>`;
        } else if (idx === 7) {
          let boost = 1;
          if (charger.charge >= 1e16) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 1e16), 0.05);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
          status = `<span style=\"color:#ffe066;font-weight:bold;\">×${boostText} terrarium XP</span>`;
        } else if (idx === 8) {
          let boost = 1;
          if (charger.charge >= 1e30) {
            boost = 1 + Math.pow(Math.max(0, charger.charge - 1e30), 0.05);
          }
          const boostText = boost >= 1e6 ? boost.toExponential(2) : boost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
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
                milestoneStatus = `<span style="color:#888;">Need ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge<br>${batteryProgress} battery and ${sparkProgress} sparks</span>`;
              } else {
                milestoneStatus = `<span style="color:#888;">Quest not initialized</span>`;
              }
            } else if (idx === 3 && state && state.soapChargeQuest && state.soapChargeQuest.stage === 0) {
              milestoneStatus = `<span style="color:#888;">Need ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge<br>${quest.given || 0}/${quest.required || 0} sparks</span>`;
            } else if (idx === 7) {
              const batteryProgress = `${quest.batteryGiven || 0}/${quest.batteryRequired || 1}`;
              const sparkProgress = `${quest.given || 0}/${quest.required || 0}`;
              milestoneStatus = `<span style="color:#888;">Need ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge<br>${batteryProgress} battery and ${sparkProgress} sparks</span>`;
            } else if (idx === 8) {
              const batteryProgress = `${quest.batteryGiven || 0}/${quest.batteryRequired || 2}`;
              const sparkProgress = `${quest.given || 0}/${quest.required || 0}`;
              milestoneStatus = `<span style="color:#888;">Need ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge<br>${batteryProgress} batteries and ${sparkProgress} sparks</span>`;
            } else {
              milestoneStatus = `<span style="color:#888;">Need ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge<br>${quest.given || 0}/${quest.required || 0} sparks</span>`;
            }
          } else {
            milestoneStatus = `<span style="color:#888;">Need ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge</span>`;
          }
        } else {
          milestoneStatus = status;
        }
      html += `<tr style="background:${!ms.unlocked ? '#f8f8f8' : '#eaffea'};">
        <td style="padding:4px 8px;">Reach ${ms.amount >= 1e6 ? ms.amount.toExponential(0) : formatNumber(ms.amount)} charge</td>
        <td style="padding:4px 8px;">${effectText}</td>
        <td style="padding:4px 8px;">${milestoneStatus}</td>
      </tr>`;
    });
    html += '</table>';
    milestoneTable.innerHTML = html;
  }
}

if (chargerBtn) {
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
  updateChargerUI();
}

function turnChargerOff() {
  charger.isOn = false;
  updateChargerUI();
}

function chargerTick(diff) {
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
  if (charger.isOn) {
    if (typeof state !== 'undefined' && typeof state.powerEnergy !== 'undefined') {
      state.powerEnergy -= 10 * diff;
      if (state.powerEnergy < 0) state.powerEnergy = 0;
      if (state.powerEnergy === 0) {
        charger.isOn = false;
        if (typeof updatePowerGeneratorUI === 'function') updatePowerGeneratorUI();
        return;
      }
      if (typeof updatePowerGeneratorUI === 'function') updatePowerGeneratorUI();
    }
    let gain = getChargerGain();
    charger.charge += gain * diff;
    if (typeof window.trackChargeMilestone === 'function') {
      window.trackChargeMilestone(charger.charge);
    }
  }
}

function getChargerGain() {
  let gain = charger.chargePerSecond;
  if (window.terrariumExtraChargeUpgradeLevel > 0) {
    gain *= window.getExtraChargeUpgradeEffect(window.terrariumExtraChargeUpgradeLevel);
  }
  if (boughtElements && boughtElements[17]) gain *= 2;
  if (boughtElements && boughtElements[18]) gain *= 2;
  if (boughtElements && boughtElements[19]) gain *= 2;
  if (charger.milestones[0].unlocked) {
    gain *= 1 + Math.pow(Math.max(0, charger.charge - 10), 0.5);
  }
  if (window._chargerChargeBoost && window._chargerChargeBoost > 1) {
    gain *= window._chargerChargeBoost;
  }
  return gain;
}

function checkChargerMilestones() {
  if (!charger.milestoneQuests) {
    charger.milestoneQuests = {
      3: { required: 10, given: 0, completed: false }, 
      4: { required: 15, given: 0, completed: false }, 
      5: { required: 25, given: 0, completed: false }, 
      6: { required: 50, given: 0, completed: false }, 
      7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 }, 
      8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }  
    };
  }
  if (typeof state !== 'undefined' && state.soapChargeQuest && state.soapChargeQuest.initialized) {
    charger.milestones.forEach((ms, idx) => {
      if (!ms.unlocked) {
        if (idx < 3) {
          if (charger.charge >= ms.amount) {
            ms.unlocked = true;
          }
        } else {
          const quest = charger.milestoneQuests[idx];
          const batteryRequirementMet = (idx === 7 || idx === 8) ? 
            (quest.batteryGiven >= quest.batteryRequired) : true;
          if (quest && !quest.completed && quest.given >= quest.required && batteryRequirementMet && charger.charge >= ms.amount) {
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
  const milestoneElementMap = [null, null, null, 17, 18, 19];
  if (charger.milestones[1].unlocked) {
    let boost = 1;
    if (charger.charge >= 100) {
      boost = 1 + Math.pow(Math.max(0, charger.charge - 100), 0.5);
    }
    window._chargerCurrencyBoost = boost;
  } else {
    window._chargerCurrencyBoost = 1;
  }
  if (charger.milestones[2] && charger.milestones[2].unlocked) {
    let lightBoost = 1;
    if (charger.charge >= 2500) {
      lightBoost = 1 + Math.pow(Math.max(0, charger.charge - 2500), 0.3);
    }
    window._chargerLightBoost = lightBoost;
  } else {
    window._chargerLightBoost = 1;
  }
  if (charger.milestones[3] && charger.milestones[3].unlocked) {
    let redTileReduction = 0;
    if (charger.charge >= 10000) {
      redTileReduction = 1 + Math.floor(Math.log10(charger.charge) - Math.log10(10000));
    }
    window._chargerRedTileReduction = redTileReduction;
  } else {
    window._chargerRedTileReduction = 0;
  }
  if (charger.milestones[4] && charger.milestones[4].unlocked && charger.charge >= 25000) {
    let boxBoost = 1 + Math.pow(Math.max(0, charger.charge - 25000), 0.2); 
    window._chargerBoxBoost = boxBoost;
  } else {
    window._chargerBoxBoost = 1;
  }
  if (charger.milestones[5] && charger.milestones[5].unlocked && charger.charge >= 1e6) {
    let chargeBoost = 1 + Math.pow(Math.max(0, charger.charge - 1e6), 0.1); 
    window._chargerChargeBoost = chargeBoost;
  } else {
    window._chargerChargeBoost = 1;
  }
  if (charger.milestones[6] && charger.milestones[6].unlocked && charger.charge >= 1e10) {
    let terrariumBoost = 1 + Math.pow(Math.max(0, charger.charge - 1e10), 0.05);
    window._chargerTerrariumBoost = terrariumBoost;
  } else {
    window._chargerTerrariumBoost = 1;
  }
  if (charger.milestones[7] && charger.milestones[7].unlocked && charger.charge >= 1e16) {
    let terrariumXpBoost = 1 + Math.pow(Math.max(0, charger.charge - 1e16), 0.05);
    window._chargerTerrariumXpBoost = terrariumXpBoost;
  } else {
    window._chargerTerrariumXpBoost = 1;
  }
  if (charger.milestones[8] && charger.milestones[8].unlocked && charger.charge >= 1e30) {
    let nectarBoost = 1 + Math.pow(Math.max(0, charger.charge - 1e30), 0.05);
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
      if (window._chargerCurrencyBoost) base *= window._chargerCurrencyBoost;
      return base;
    };
  }
  if (typeof window.getSwariaCoinGain === 'function') {
    const origGetSwariaCoinGain = window.getSwariaCoinGain;
    window.getSwariaCoinGain = function(val) {
      let base = origGetSwariaCoinGain(val);
      if (window._chargerCurrencyBoost) base *= window._chargerCurrencyBoost;
      return base;
    };
  }
  window._chargerGainPatched = true;
}

function logChargeGainRate() {
  let multiplier = 1;
  if (window.terrariumExtraChargeUpgradeLevel > 0) {
    const extraChargeBonus = window.getExtraChargeUpgradeEffect(window.terrariumExtraChargeUpgradeLevel);
    multiplier *= extraChargeBonus;
  }
  if (boughtElements) {
    if (boughtElements[17]) {
      multiplier *= 2;
    }
    if (boughtElements[18]) {
      multiplier *= 2;
    }
    if (boughtElements[19]) {
      multiplier *= 2;
    }
  }
  if (charger.milestones[0].unlocked) {
    const milestone1Boost = 1 + Math.pow(Math.max(0, charger.charge - 10), 0.5);
    multiplier *= milestone1Boost;
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
        if (window._chargerLightBoost && window._chargerLightBoost > 1) base *= window._chargerLightBoost;
        return base;
      };
    }
  });
  if (typeof window.getAutoLightGainPerSecond === "function") {
    const origAutoLight = window.getAutoLightGainPerSecond;
    window.getAutoLightGainPerSecond = function(...args) {
      let base = origAutoLight.apply(this, args);
      if (window._chargerLightBoost && window._chargerLightBoost > 1) base *= window._chargerLightBoost;
      return base;
    };
  }
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
      const xpBoost = Math.floor(baseXpGain * (window._chargerTerrariumXpBoost - 1));
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
      3: { required: 10, given: 0, completed: false },
      4: { required: 15, given: 0, completed: false },
      5: { required: 25, given: 0, completed: false },
      6: { required: 50, given: 0, completed: false },
      7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 },
      8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }
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
    quest.given += amount;
    saveChargerState();
    if (quest.given >= quest.required) {
      const neededCharge = charger.milestones[currentMilestoneIndex].amount;
      if (charger.charge >= neededCharge) {
        quest.completed = true;
        charger.milestones[currentMilestoneIndex].unlocked = true;
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
      } else {
        const neededCharge = charger.milestones[currentMilestoneIndex].amount;
        showSoapQuestMessage(`You have enough sparks, but you need ${formatNumber(neededCharge)} charge to unlock this effect!`);
      }
    } else {
      const remaining = quest.required - quest.given;
      showSoapQuestMessage(`Thanks! Just ${remaining} more sparks needed for this effect!`);
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

window.updateChargerUI = updateChargerUI;
window.showSoapChargerClickMessage = showSoapChargerClickMessage;
window.soapChargerGetsMad = soapChargerGetsMad;
window.soapEatCharge = soapEatCharge;
window.initializeChargerElementUnlocking = initializeChargerElementUnlocking;
window.resetChargerTabState = resetChargerTabState; 
window.giveSparksToSoap = giveSparksToSoap; 

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
    chargeToEat = Math.floor(charger.charge * 0.5);
    message = "Big nom, I just eated half your charge";
    messageDuration = 10000; 
    charger.soapIsMad = true; 
  } else {
    chargeToEat = Math.floor(charger.charge * 0.01);
    message = soapEatingQuotes[Math.floor(Math.random() * soapEatingQuotes.length)];
    messageDuration = 5000; 
  }
  charger.charge -= chargeToEat;
  charger.soapChargeEaten += chargeToEat;
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
  updateChargerUI();
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
  window.charger.charge = 0;
  updateChargerUI();
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
