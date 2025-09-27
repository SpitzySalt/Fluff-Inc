// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file
// terrarium2.js is a continuation of terrarium.js

// Terrarium2 system timeout tracking
if (typeof window.terrarium2Timeouts === 'undefined') {
  window.terrarium2Timeouts = [];
}

// Terrarium2 system initialization guard
if (typeof window._terrarium2Initialized === 'undefined') {
  window._terrarium2Initialized = false;
}















































const nectarizeMilestoneData = [
  {
    tier: 1,
    level: 30, 
    effect: "+100% pollen gain each nectarize tier",
    unlocked: false,
    reward: 'pollen'
  },
  {
    tier: 2,
    level: 50, 
    effect: "+100% flower gain each nectarize tier starting from tier 2",
    unlocked: false,
    reward: 'flowers'
  },
  {
    tier: 3,
    level: 70, 
    effect: "+100% terrarium XP gain each nectarize tier starting from tier 3",
    unlocked: false,
    reward: 'xp'
  },
  {
    tier: 4,
    level: 90, 
    effect: "+50% nectar gain each nectarize tier starting from tier 4",
    unlocked: false,
    reward: 'nectar'
  },
  {
    tier: 5,
    level: 110,
    effect: "+^0.05 to cargo currencies each nectarize tier starting at 5",
    unlocked: false,
    reward: 'cargo'
  },
  {
    tier: 6,
    level: 130,
    effect: "+^0.05 to lab currencies each nectarize tier starting at 6",
    unlocked: false,
    reward: 'lab'
  },
  {
    tier: 7,
    level: 150,
    effect: "+^0.1 to charge gain each nectarize tier starting at 7",
    unlocked: false,
    reward: 'charge'
  },
  {
    tier: 8,
    level: 170,
    effect: "+^0.1 to KP gain each nectarize tier starting at 8",
    unlocked: false,
    reward: 'kp'
  },
  {
    tier: 9,
    level: 190,
    effect: "+^0.2 infinity point gain each nectarize tier starting at 9",
    unlocked: false,
    reward: 'infinity'
  },
];

// Make terrarium2.js variables globally accessible
window.nectarizeMilestoneData = nectarizeMilestoneData;

// Terrarium2 system cleanup function
if (typeof window.cleanupTerrarium2 === 'undefined') {
  window.cleanupTerrarium2 = function() {
    // Clear all terrarium2 timeouts
    if (window.terrarium2Timeouts) {
      window.terrarium2Timeouts.forEach(function(timeoutId) {
        clearTimeout(timeoutId);
      });
      window.terrarium2Timeouts = [];
    }
    
    // Clean up any leftover modals
    if (typeof window.cleanupTerrarium2Modals === 'function') {
      window.cleanupTerrarium2Modals();
    }
    
    // Reset initialization flags
    window._terrarium2Initialized = false;
    window._terrarium2SwitchHomeSubTabOverridden = false;
  };
}

function checkNectarizeMilestones() {
  const currentTier = window.nectarizeTier || 0;
  nectarizeMilestoneData.forEach((milestone, index) => {
    milestone.unlocked = currentTier >= milestone.tier;
  });
  return nectarizeMilestoneData;
}

function renderNectarizeMilestoneTable(force = false) {
  // Throttle updates to prevent performance issues (shared constant from terrarium.js)
  const NECTARIZE_MILESTONE_UPDATE_THROTTLE = 100; // ms (10 FPS)
  if (typeof lastNectarizeMilestoneUpdateTime === 'undefined') {
    window.lastNectarizeMilestoneUpdateTime = 0;
  }
  const now = Date.now();
  if (!force && now - window.lastNectarizeMilestoneUpdateTime < NECTARIZE_MILESTONE_UPDATE_THROTTLE) {
    return;
  }
  window.lastNectarizeMilestoneUpdateTime = now;
  
  const milestoneTable = document.getElementById('nectarizeMilestoneTable');
  const milestoneContent = document.getElementById('nectarizeMilestoneTableContent');
  if (!milestoneTable || !milestoneContent) {
    return;
  }
  if (!window.nectarizeMachineRepaired) {
    milestoneTable.style.display = 'none';
    return;
  }

// Make terrarium2.js functions globally accessible
window.checkNectarizeMilestones = checkNectarizeMilestones;
window.renderNectarizeMilestoneTable = renderNectarizeMilestoneTable;
  checkNectarizeMilestones();
  let visibleMilestones = 1; 
  const currentTier = window.nectarizeTier || 0;
  visibleMilestones = currentTier + 1;
  if (visibleMilestones > nectarizeMilestoneData.length) {
    visibleMilestones = nectarizeMilestoneData.length;
  }
  let html = '<div style="font-size: 0.9em;">';
  html += '<table style="width:100%; border-collapse: collapse; margin-top: 10px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden;">';
  html += '<tr style="background: linear-gradient(135deg, #f7b900, #ffcc33); border-bottom: 2px solid #e6a800;">';
  html += '<th style="text-align: left; padding: 10px; color: #2c3e50; font-weight: bold; font-size: 0.95em;">Milestone</th>';
  html += '<th style="text-align: left; padding: 10px; color: #2c3e50; font-weight: bold; font-size: 0.95em;">Effect</th>';
  html += '<th style="text-align: left; padding: 10px; color: #2c3e50; font-weight: bold; font-size: 0.95em;">Status</th>';
  html += '</tr>';
  nectarizeMilestoneData.forEach((ms, idx) => {
    if (idx >= visibleMilestones && !ms.unlocked) return;
    let status = '';
    let rowStyle = '';
    if (!ms.unlocked) {
      status = `<span style="color: #dc3545; font-weight: bold; padding: 3px 8px; border-radius: 4px;">Locked</span>`;
      rowStyle = 'background: #ffffff; border-bottom: 1px solid #e9ecef;';
    } else {
      let currentBonus = 0;
      if (ms.reward === 'pollen') {
        currentBonus = currentTier * 100;
      } else if (ms.reward === 'flowers') {
        const effectiveTiers = Math.max(0, currentTier - 1);
        currentBonus = effectiveTiers * 100;
      } else if (ms.reward === 'xp') {
        const effectiveTiers = Math.max(0, currentTier - 2);
        currentBonus = effectiveTiers * 100;
      } else if (ms.reward === 'nectar') {
        const effectiveTiers = Math.max(0, currentTier - 3);
        currentBonus = effectiveTiers * 50;
      }
      
      let bonusText;
      if (ms.reward === 'cargo' || ms.reward === 'lab') {
        // For cargo (tier 5) and lab (tier 6), show ^0.05 per tier
        const effectiveTiers = Math.max(0, currentTier - (ms.tier - 1));
        const exponentBonus = effectiveTiers * 0.05;
        bonusText = `+ ^${exponentBonus.toFixed(2)} ${ms.reward === 'cargo' ? 'cargo' : 'lab'} gain`;
      } else if (ms.reward === 'charge') {
        // For charge (tier 7), show ^0.1 per tier
        const effectiveTiers = Math.max(0, currentTier - 6);
        const exponentBonus = effectiveTiers * 0.1;
        bonusText = `+ ^${exponentBonus.toFixed(1)} charge gain`;
      } else if (ms.reward === 'kp') {
        // For KP (tier 8), show ^0.1 per tier
        const effectiveTiers = Math.max(0, currentTier - 7);
        const exponentBonus = effectiveTiers * 0.1;
        bonusText = `+ ^${exponentBonus.toFixed(1)} KP gain`;
      } else if (ms.reward === 'infinity') {
        // For infinity (tier 9), show ^0.2 per tier
        const effectiveTiers = Math.max(0, currentTier - 8);
        const exponentBonus = effectiveTiers * 0.2;
        bonusText = `+ ^${exponentBonus.toFixed(1)} infinity point gain`;
      } else {
        // For percentage-based rewards (pollen, flowers, xp, nectar)
        bonusText = `+${currentBonus}% ${ms.reward === 'xp' ? 'XP' : ms.reward} gain`;
      }
      
      status = `<span style="color: #155724; font-weight: bold; padding: 3px 8px; border-radius: 4px;">${bonusText}</span>`;
      rowStyle = 'background: #f8f9fa; border-bottom: 1px solid #e9ecef;';
    }
    html += `<tr style="${rowStyle}">`;
    html += `<td style="padding: 10px; font-weight: ${!ms.unlocked ? 'normal' : 'bold'}; color: ${!ms.unlocked ? '#6c757d' : '#2c3e50'};">
      <span style="color: #f7b900; font-weight: bold;">Tier ${ms.tier}</span>
    </td>`;
    html += `<td style="padding: 10px; color: ${!ms.unlocked ? '#6c757d' : '#2c3e50'}; font-style: ${!ms.unlocked ? 'italic' : 'normal'};">
      ${ms.effect}
    </td>`;
    html += `<td style="padding: 10px;">${status}</td>`;
    html += '</tr>';
  });
  html += '</table>';
  html += '</div>'; 
  milestoneContent.innerHTML = html;
  milestoneTable.style.display = 'block';
}

function hideNectarizeMilestoneTable() {
  const milestoneTable = document.getElementById('nectarizeMilestoneTable');
  if (milestoneTable) {
    milestoneTable.style.display = 'none';
  }
}

function getNectarizeMilestoneBonus() {
  checkNectarizeMilestones();
  const currentTier = window.nectarizeTier || 0;
  let pollenBonus = new Decimal(0);
  let flowerBonus = new Decimal(0);
  let xpBonus = new Decimal(0);
  let nectarBonus = new Decimal(0);
  let cargoExponent = new Decimal(0);
  let labExponent = new Decimal(0);
  let chargeExponent = new Decimal(0);
  let kpExponent = new Decimal(0);
  let infinityExponent = new Decimal(0);
  
  nectarizeMilestoneData.forEach(milestone => {
    if (milestone.unlocked) {
      if (milestone.reward === 'pollen') {
        pollenBonus = pollenBonus.add(new Decimal(currentTier).mul(100));
      } else if (milestone.reward === 'flowers') {
        const effectiveTiers = Math.max(0, currentTier - 1);
        flowerBonus = flowerBonus.add(new Decimal(effectiveTiers).mul(100));
      } else if (milestone.reward === 'xp') {
        const effectiveTiers = Math.max(0, currentTier - 2);
        xpBonus = xpBonus.add(new Decimal(effectiveTiers).mul(100));
      } else if (milestone.reward === 'nectar') {
        const effectiveTiers = Math.max(0, currentTier - 3);
        nectarBonus = nectarBonus.add(new Decimal(effectiveTiers).mul(50));
      } else if (milestone.reward === 'cargo') {
        const effectiveTiers = Math.max(0, currentTier - 4);
        cargoExponent = cargoExponent.add(new Decimal(effectiveTiers).mul(0.05));
      } else if (milestone.reward === 'lab') {
        const effectiveTiers = Math.max(0, currentTier - 5);
        labExponent = labExponent.add(new Decimal(effectiveTiers).mul(0.05));
      } else if (milestone.reward === 'charge') {
        const effectiveTiers = Math.max(0, currentTier - 6);
        chargeExponent = chargeExponent.add(new Decimal(effectiveTiers).mul(0.1));
      } else if (milestone.reward === 'kp') {
        const effectiveTiers = Math.max(0, currentTier - 7);
        kpExponent = kpExponent.add(new Decimal(effectiveTiers).mul(0.1));
      } else if (milestone.reward === 'infinity') {
        const effectiveTiers = Math.max(0, currentTier - 8);
        infinityExponent = infinityExponent.add(new Decimal(effectiveTiers).mul(0.2));
      }
    }
  });
  
  return {
    pollen: new Decimal(1).add(pollenBonus.div(100)), 
    flowers: new Decimal(1).add(flowerBonus.div(100)), 
    xp: new Decimal(1).add(xpBonus.div(100)), 
    nectar: new Decimal(1).add(nectarBonus.div(100)),
    cargoExponent: cargoExponent,
    labExponent: labExponent,
    chargeExponent: chargeExponent,
    kpExponent: kpExponent,
    infinityExponent: infinityExponent
  };
}

window.renderNectarizeMilestoneTable = renderNectarizeMilestoneTable;
window.hideNectarizeMilestoneTable = hideNectarizeMilestoneTable;
window.checkNectarizeMilestones = checkNectarizeMilestones;
window.getNectarizeMilestoneBonus = getNectarizeMilestoneBonus;
window.nectarizeMilestoneData = nectarizeMilestoneData;
(function initializeMilestones() {
  const currentTier = window.nectarizeTier || 0;
  nectarizeMilestoneData.forEach(milestone => {
    milestone.unlocked = currentTier >= milestone.tier;
  });
  if (!window.nectarizeMilestoneData) {
    window.nectarizeMilestoneData = nectarizeMilestoneData;
  }
})();

function showNectarizeTierInfo() {
  // Remove any existing tier info modals first
  const existingModals = document.querySelectorAll('[data-terrarium2-modal="tier-info"]');
  existingModals.forEach(modal => modal.remove());
  
  const tier = window.nectarizeTier || 0;
  const resets = window.nectarizeResets || 0;
  const modal = document.createElement('div');
  modal.setAttribute('data-terrarium2-modal', 'tier-info');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  const content = document.createElement('div');
  content.style.cssText = `
    background: #2c3e50;
    color: white;
    padding: 24px;
    border-radius: 12px;
    font-family: 'Courier New', monospace;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  `;
  content.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: #f1c40f;">Nectarize Tier Info</h3>
    <p><strong>Current Tier:</strong> ${tier}</p>
    <p><strong>Total Resets:</strong> ${resets}</p>
    <p style="font-size: 12px; color: #bdc3c7; margin-top: 16px;">
      Higher tiers provide better nectar gains and unlock new milestones.
    </p>
    <button onclick="this.parentElement.parentElement.remove()" 
            style="margin-top: 16px; padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Close
    </button>
  `;
  modal.appendChild(content);
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

window.showNectarizeTierInfo = showNectarizeTierInfo;

function completeNectarizeQuest() {
  window.nectarizeQuestActive = false;
  window.nectarizeQuestProgress = 3; 
  window.nectarizeQuestGivenBattery = 1;
  window.nectarizeQuestGivenSparks = 1;
  window.nectarizeQuestGivenPetals = 1;
  window.nectarizeMachineRepaired = true;
  window.nectarizeMachineLevel = 1;
  window.nectarizeQuestPermanentlyCompleted = true;
  const timeoutId = setTimeout(() => {
    if (typeof window.updateNectarizeMachineDisplay === 'function') {
      window.updateNectarizeMachineDisplay();
    }
    if (typeof window.updateNectarizeMilestoneTable === 'function') {
      window.updateNectarizeMilestoneTable();
    }
    if (typeof window.updateNectarizeDisplays === 'function') {
      window.updateNectarizeDisplays();
    }
    if (typeof window.renderTerrariumUI === 'function') {
      window.renderTerrariumUI();
    }
    if (typeof window.initializeNectarizeArea === 'function') {
      window.initializeNectarizeArea();
    }
    if (typeof window.applySettings === 'function') {
      window.applySettings();
    }
     if (typeof window.saveGame === 'function') {
       window.saveGame();
     }
   }, 100);
   if (window.terrarium2Timeouts) window.terrarium2Timeouts.push(timeoutId);
}

window.completeNectarizeQuest = completeNectarizeQuest;

function checkNectarizeQuestStatus() {
  const isPermanentlyCompleted = window.nectarizeQuestPermanentlyCompleted || false;
  const isMachineRepaired = window.nectarizeMachineRepaired || false;
  const isQuestActive = window.nectarizeQuestActive || false;
}

window.checkNectarizeQuestStatus = checkNectarizeQuestStatus;

function permanentlyUnlockHardMode() {
  window.hardModePermanentlyUnlocked = true;
  window.nectarizeResets = Math.max(window.nectarizeResets || 0, 1);
  if (typeof window.state !== 'undefined') {
    window.state.seenNectarizeResetStory = true;
  }
  if (typeof window.checkHardModeTabButtonVisibility === 'function') {
    window.checkHardModeTabButtonVisibility();
  }
  if (typeof window.saveGame === 'function') {
    window.saveGame();
  }
}

function simulatePlayerClick(index, cols, rows) {
  const indices = [index];
  if (index - cols >= 0) indices.push(index - cols);
  if (index + cols < cols * rows) indices.push(index + cols);
  if (index % cols > 0) indices.push(index - 1);
  if (index % cols < cols - 1) indices.push(index + 1);
  let pollenGained = 0;
  let flowersCollected = 0;
  let xpGained = 0;
  for (const idx of indices) {
    if (idx < 0 || idx >= cols * rows) continue;
    const flower = window.terrariumFlowerGrid?.[idx];
    if (flower && flower.health > 0) {
      pollenGained++;
      if (flower.health === 1) { 
        flowersCollected++;
        xpGained++;
      }
    }
  }
  pollenGained = new Decimal(pollenGained).mul(window.getPollenValueUpgradeEffect?.(window.pollenValueUpgradeLevel || 0) || 1).floor();
  pollenGained = pollenGained.mul(new Decimal(2).pow((window.terrariumLevel || 1) - 1)).floor();
  pollenGained = pollenGained.mul(window.getFlowerUpgrade3Effect?.(window.pollenValueUpgrade2Level || 0) || 1).floor();
  const milestoneBonus = window.getNectarizeMilestoneBonus?.();
  if (milestoneBonus?.pollen) {
    pollenGained = pollenGained.mul(milestoneBonus.pollen).floor();
  }
  // Apply missing multipliers that Fluzzer was not getting
  pollenGained = pollenGained.mul(window.getPollenFlowerNectarUpgradeEffect?.(window.pollenFlowerNectarUpgradeLevel || 0) || 1).floor();
  // Apply Element 21 boost (X10 pollen multiplier) if owned
  const elementsRef = window.state.boughtElements || {};
  if (elementsRef && elementsRef[21]) {
    pollenGained = pollenGained.mul(10).floor();
  }
  flowersCollected = new Decimal(flowersCollected).mul(window.getFlowerValueUpgradeEffect?.(window.flowerValueUpgradeLevel || 0) || 1).floor();
  flowersCollected = flowersCollected.mul(window.getFlowerUpgrade3Effect?.(window.pollenValueUpgrade2Level || 0) || 1).floor();
  if (milestoneBonus?.flowers) {
    flowersCollected = flowersCollected.mul(milestoneBonus.flowers).floor();
  }
  // Apply missing multipliers that Fluzzer was not getting for flowers
  flowersCollected = flowersCollected.mul(window.getPollenFlowerNectarUpgradeEffect?.(window.pollenFlowerNectarUpgradeLevel || 0) || 1).floor();
  const flowerGainFinal = flowersCollected.mul(window.getTerrariumFlowerMultiplier?.(window.terrariumLevel || 1) || 1).floor();
  
  // Apply Element 22 boost to final flower gain (X5 flowers multiplier) if owned
  let finalFlowerGain = flowerGainFinal;
  const elementsRef2 = window.state.boughtElements || {};
  if (elementsRef2 && elementsRef2[22]) {
    finalFlowerGain = finalFlowerGain.mul(5).floor();
  }
  return {
    pollen: pollenGained,
    flowers: finalFlowerGain,
    xp: xpGained
  };
}

function simulateFluzzerClick(index, cols, rows) {
  return simulatePlayerClick(index, cols, rows); 
}

function ensureFlowerUpgrade4Persistence() {
  const flowerUpgrade4Card = document.getElementById('flower-upgrade-4');
  if (flowerUpgrade4Card) {
    const levelElement = flowerUpgrade4Card.querySelector('.terrarium-upgrade-level');
    if (levelElement) {
      const currentLevel = window.terrariumFlowerUpgrade4Level || 0;
      levelElement.textContent = currentLevel;
    }
  }
}

if (!window._terrarium2Initialized) {
  const terrarium2DOMHandler = function() {
    const timeoutId = setTimeout(ensureFlowerUpgrade4Persistence, 1000);
    if (window.terrarium2Timeouts) window.terrarium2Timeouts.push(timeoutId);
    document.removeEventListener('DOMContentLoaded', terrarium2DOMHandler);
  };
  document.addEventListener('DOMContentLoaded', terrarium2DOMHandler);
}
if (typeof window !== 'undefined' && window.switchHomeSubTab && !window._terrarium2SwitchHomeSubTabOverridden) {
  const originalSwitchHomeSubTab = window.switchHomeSubTab;
  window.switchHomeSubTab = function(tabId) {
    originalSwitchHomeSubTab.call(this, tabId);
    if (tabId === 'terrariumTab') {
      const timeoutId = setTimeout(ensureFlowerUpgrade4Persistence, 500);
      if (window.terrarium2Timeouts) window.terrarium2Timeouts.push(timeoutId);
    }
  };
  window._terrarium2SwitchHomeSubTabOverridden = true;
  window._terrarium2Initialized = true;
}
window.ensureFlowerUpgrade4Persistence = ensureFlowerUpgrade4Persistence;

// Function to clean up any leftover terrarium2 modals
if (typeof window.cleanupTerrarium2Modals === 'undefined') {
  window.cleanupTerrarium2Modals = function() {
    const modals = document.querySelectorAll('[data-terrarium2-modal]');
    modals.forEach(modal => modal.remove());
  };
}
