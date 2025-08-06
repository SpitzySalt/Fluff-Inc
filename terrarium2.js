// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file















































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
];

function checkNectarizeMilestones() {
  const currentTier = window.nectarizeTier || 0;
  nectarizeMilestoneData.forEach((milestone, index) => {
    milestone.unlocked = currentTier >= milestone.tier;
  });
  return nectarizeMilestoneData;
}

function renderNectarizeMilestoneTable() {
  const milestoneTable = document.getElementById('nectarizeMilestoneTable');
  const milestoneContent = document.getElementById('nectarizeMilestoneTableContent');
  if (!milestoneTable || !milestoneContent) {
    return;
  }
  if (!window.nectarizeMachineRepaired) {
    milestoneTable.style.display = 'none';
    return;
  }
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
      const bonusText = `+${currentBonus}% ${ms.reward === 'xp' ? 'XP' : ms.reward} gain`;
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
  let pollenBonus = 0;
  let flowerBonus = 0;
  let xpBonus = 0;
  let nectarBonus = 0;
  nectarizeMilestoneData.forEach(milestone => {
    if (milestone.unlocked) {
      if (milestone.reward === 'pollen') {
        pollenBonus += currentTier * 100;
      } else if (milestone.reward === 'flowers') {
        const effectiveTiers = Math.max(0, currentTier - 1);
        flowerBonus += effectiveTiers * 100;
      } else if (milestone.reward === 'xp') {
        const effectiveTiers = Math.max(0, currentTier - 2);
        xpBonus += effectiveTiers * 100;
      } else if (milestone.reward === 'nectar') {
        const effectiveTiers = Math.max(0, currentTier - 3);
        nectarBonus += effectiveTiers * 50;
      }
    }
  });
  return {
    pollen: 1 + (pollenBonus / 100), 
    flowers: 1 + (flowerBonus / 100), 
    xp: 1 + (xpBonus / 100), 
    nectar: 1 + (nectarBonus / 100) 
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
  const tier = window.nectarizeTier || 0;
  const resets = window.nectarizeResets || 0;
  const modal = document.createElement('div');
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
  setTimeout(() => {
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
  pollenGained = Math.floor(pollenGained * window.getPollenValueUpgradeEffect?.(window.pollenValueUpgradeLevel || 0));
  pollenGained = Math.floor(pollenGained * Math.pow(2, (window.terrariumLevel || 1) - 1));
  pollenGained = Math.floor(pollenGained * window.getFlowerUpgrade3Effect?.(window.pollenValueUpgrade2Level || 0));
  const milestoneBonus = window.getNectarizeMilestoneBonus?.();
  if (milestoneBonus?.pollen) {
    pollenGained = Math.floor(pollenGained * milestoneBonus.pollen);
  }
  flowersCollected = Math.floor(flowersCollected * window.getFlowerValueUpgradeEffect?.(window.flowerValueUpgradeLevel || 0));
  flowersCollected = Math.floor(flowersCollected * window.getFlowerUpgrade3Effect?.(window.pollenValueUpgrade2Level || 0));
  if (milestoneBonus?.flowers) {
    flowersCollected = Math.floor(flowersCollected * milestoneBonus.flowers);
  }
  const flowerGainFinal = Math.floor(flowersCollected * window.getTerrariumFlowerMultiplier?.(window.terrariumLevel || 1));
  return {
    pollen: pollenGained,
    flowers: flowerGainFinal,
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

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(ensureFlowerUpgrade4Persistence, 1000);
});
if (typeof window !== 'undefined' && window.switchHomeSubTab) {
  const originalSwitchHomeSubTab = window.switchHomeSubTab;
  window.switchHomeSubTab = function(tabId) {
    originalSwitchHomeSubTab.call(this, tabId);
    if (tabId === 'terrariumTab') {
      setTimeout(ensureFlowerUpgrade4Persistence, 500);
    }
  };
}
window.ensureFlowerUpgrade4Persistence = ensureFlowerUpgrade4Persistence;
