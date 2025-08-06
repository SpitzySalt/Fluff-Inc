// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file


























































const fluzzerWelcomeSpeech = "Oh! Hello! Welcome back to the terrarium!";
const fluzzerFirstTimeSpeech = "Oh! A new face! Welcome to my terrarium!";
let terrariumFlowerGrid = null;
let pollenWandActive = false;
let wateringCanActive = false;
let terrariumPollen = window.terrariumPollen || 0;
let terrariumFlowers = window.terrariumFlowers || 0;
let terrariumXP = window.terrariumXP || 0;
let flowerFieldExpansionUpgradeLevel = 0;

function getCurrentFlowerGridDimensions() {
  return {
    cols: 13 + flowerFieldExpansionUpgradeLevel,
    rows: 6 + flowerFieldExpansionUpgradeLevel
  };
}

let terrariumNectar = window.terrariumNectar || 0;
let nectarizeMachineRepaired = window.nectarizeMachineRepaired || false;
let nectarizeMachineLevel = window.nectarizeMachineLevel || 1;
let nectarizeQuestActive = window.nectarizeQuestActive || false;
let nectarizeQuestProgress = window.nectarizeQuestProgress || 0;
let nectarizeQuestGivenBattery = window.nectarizeQuestGivenBattery || 0;
let nectarizeQuestGivenSparks = window.nectarizeQuestGivenSparks || 0;
let nectarizeQuestGivenPetals = window.nectarizeQuestGivenPetals || 0;
let nectarizeQuestRequirements = {
  battery: 1,
  sparks: 20,
  petals: 20,
  upgrade: (window.terrariumFlowerUpgrade4Level || 0) >= 1 
};

let nectarizeMilestones = window.nectarizeMilestones || [];
let nectarizeMilestoneLevel = window.nectarizeMilestoneLevel || 0;
let nectarizeResets = window.nectarizeResets || 0;
let nectarizeTier = window.nectarizeTier || 0; 
let nectarizePostResetTokenRequirement = window.nectarizePostResetTokenRequirement || 0; 
let nectarizePostResetTokensGiven = window.nectarizePostResetTokensGiven || 0; 
let nectarizePostResetTokenType = window.nectarizePostResetTokenType || 'petals'; 

if (nectarizeMilestones.length === 0) {
  nectarizeMilestones = [
    { tier: 1, unlocked: false, reward: 'pollen' },
    { tier: 2, unlocked: false, reward: 'flowers' },
    { tier: 3, unlocked: false, reward: 'pollen' },
    { tier: 4, unlocked: false, reward: 'flowers' },
    { tier: 5, unlocked: false, reward: 'pollen' },
    { tier: 6, unlocked: false, reward: 'flowers' },
    { tier: 7, unlocked: false, reward: 'pollen' },
    { tier: 8, unlocked: false, reward: 'flowers' }
  ];
}

if (typeof window.nectarizePostResetTokenRequirement === 'undefined') {
  window.nectarizePostResetTokenRequirement = 0;
}

if (typeof window.nectarizePostResetTokensGiven === 'undefined') {
  window.nectarizePostResetTokensGiven = 0;
}

if (typeof window.nectarizePostResetTokenType === 'undefined') {
  window.nectarizePostResetTokenType = 'petals';
}

let terrariumLevel = window.terrariumLevel || 1;
let flowerGridTrollLevel = window.flowerGridTrollLevel || 100;

function handleFlowerGridTroll(currentLevel) {
  if (currentLevel >= 96) {
    const oldLevel = flowerGridTrollLevel;
    flowerGridTrollLevel++;
    window.flowerGridTrollLevel = flowerGridTrollLevel;
    updateFlowerGridButtonState();
    const trollMessages = [
      `Oh! Did you think level ${oldLevel} was enough? Silly! You need level ${flowerGridTrollLevel} now!`,
      `Hehe! The flower grid is a bit shy... it moved up to level ${flowerGridTrollLevel}!`,
      `Wait, what? The flower grid requirement just... increased? That's weird! Level ${flowerGridTrollLevel} now!`,
      `Oh no! The flower grid is playing hard to get! Now it wants level ${flowerGridTrollLevel}!`,
      `Hmm... I think the flower grid is broken. It says level ${flowerGridTrollLevel} now. Sorry!`,
      `The flower grid is being mysterious! Level ${flowerGridTrollLevel} requirement now!`,
      `Oops! Someone must have updated the flower grid requirements to level ${flowerGridTrollLevel}!`,
      `The flower grid is evolving! It now requires level ${flowerGridTrollLevel}! Evolution is wild!`,
      `I swear it was level ${oldLevel} just a moment ago! Now it's ${flowerGridTrollLevel}... magic!`,
      `The flower grid heard you were getting close and decided to level up too! Level ${flowerGridTrollLevel}!`,
      `Have you not realised that the flower grid is WIP, because its now Level ${flowerGridTrollLevel}!`
    ];
    if (typeof fluzzerSay === 'function') {
      const randomMessage = trollMessages[Math.floor(Math.random() * trollMessages.length)];
      fluzzerSay(randomMessage, false, 6000);
    }
  }
}

function updateFlowerGridButtonState() {
  const flowerGridBtn = document.getElementById('terrariumFlowerGridBtn');
  if (!flowerGridBtn) return;
  if (terrariumLevel < flowerGridTrollLevel) {
    flowerGridBtn.textContent = `Unlocked at level ${flowerGridTrollLevel}`;
    flowerGridBtn.disabled = true;
    flowerGridBtn.classList.add('locked');
    flowerGridBtn.onclick = null; 
  } else {
    flowerGridBtn.textContent = "Flower Grid";
    flowerGridBtn.disabled = false;
    flowerGridBtn.classList.remove('locked');
    flowerGridBtn.onclick = function() {
      const grassArea = document.getElementById('terrariumGrassPatchArea');
      const pollenArea = document.getElementById('terrariumPollenUpgradesArea');
      const nectarizeArea = document.getElementById('terrariumNectarizeArea');
      const charCard = document.getElementById('terrariumCharacterCard');
      const pollenCard = document.getElementById('terrariumPollenCard');
      const wateringBtn = document.getElementById('wateringCanBtn');
      const pollenWandBtn = document.getElementById('pollenCollectorBtn');
      const grassBtn = document.getElementById('terrariumGrassPatchBtn');
      const pollenBtn = document.getElementById('terrariumPollenUpgradesBtn');
      const nectarizeBtn = document.getElementById('terrariumNectarizeBtn');
      if (grassArea) grassArea.style.display = 'none';
      if (pollenArea) pollenArea.style.display = 'none';
      if (nectarizeArea) nectarizeArea.style.display = 'none';
      flowerGridBtn.classList.add('active');
      if (grassBtn) grassBtn.classList.remove('active');
      if (pollenBtn) pollenBtn.classList.remove('active');
      if (nectarizeBtn) nectarizeBtn.classList.remove('active');
      if (charCard) charCard.style.display = 'none';
      if (pollenCard) pollenCard.style.display = 'none';
      if (wateringBtn) wateringBtn.style.display = 'none';
      if (pollenWandBtn) pollenWandBtn.style.display = 'none';
      if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
      if (typeof stopFluzzerAI === 'function') stopFluzzerAI();
    };
  }
}

window.handleFlowerGridTroll = handleFlowerGridTroll;
window.updateFlowerGridButtonState = updateFlowerGridButtonState;

function getFlowerGridTrollStatus() {
  const trollActivations = Math.max(0, flowerGridTrollLevel - 100);
  return {
    currentRequirement: flowerGridTrollLevel,
    originalRequirement: 100,
    trollActivations: trollActivations,
    isActive: trollActivations > 0,
    playerLevel: terrariumLevel,
    levelsUntilUnlock: Math.max(0, flowerGridTrollLevel - terrariumLevel)
  };
}

window.getFlowerGridTrollStatus = getFlowerGridTrollStatus;

window.checkTrollStatus = function() {
  const status = getFlowerGridTrollStatus();
  return status;
};

function getTerrariumXPRequirement(level) {
  if (level === 1) return 100;
  let requirement = 100; 
  for (let i = 2; i <= level; i++) {
    let multiplier;
    if (i <= 30) {
      multiplier = 1.5;
    } else if (i <= 50) {
      multiplier = 1.65;
    } else if (i <= 70) {
      multiplier = 1.8;
    } else if (i <= 90) {
      multiplier = 1.95;
    } else if (i <= 110) {
      multiplier = 2.1;
    } else {
      multiplier = 2.25;
    }
    requirement *= multiplier;
  }
  return Math.floor(requirement);
}

function getNectarizeTierRequirement(tier) {
  return 30 + (tier - 1) * 20; 
}

function syncTerrariumVarsFromWindow() {
  terrariumPollen = window.terrariumPollen || 0;
  terrariumFlowers = window.terrariumFlowers || 0;
  terrariumXP = window.terrariumXP || 0;
  terrariumLevel = window.terrariumLevel || 1;
  terrariumNectar = window.terrariumNectar || 0;
  nectarizeMachineRepaired = window.nectarizeMachineRepaired || false;
  nectarizeMachineLevel = window.nectarizeMachineLevel || 1;
  nectarizeQuestActive = window.nectarizeQuestActive || false;
  nectarizeQuestProgress = window.nectarizeQuestProgress || 0;
  nectarizeQuestGivenBattery = window.nectarizeQuestGivenBattery || 0;
  nectarizeQuestGivenSparks = window.nectarizeQuestGivenSparks || 0;
  nectarizeQuestGivenPetals = window.nectarizeQuestGivenPetals || 0;
  nectarizeMilestones = window.nectarizeMilestones || [];
  nectarizeMilestoneLevel = window.nectarizeMilestoneLevel || 0;
  nectarizeResets = window.nectarizeResets || 0;
  nectarizeTier = window.nectarizeTier || 0;
  flowerGridTrollLevel = window.flowerGridTrollLevel || 100;
  kpNectarUpgradeLevel = window.terrariumKpNectarUpgradeLevel || 0;
  pollenFlowerNectarUpgradeLevel = window.terrariumPollenFlowerNectarUpgradeLevel || 0;
  nectarXpUpgradeLevel = window.terrariumNectarXpUpgradeLevel || 0;
  nectarValueUpgradeLevel = window.terrariumNectarValueUpgradeLevel || 0;
  flowerFieldExpansionUpgradeLevel = window.terrariumFlowerFieldExpansionUpgradeLevel || 0;
  nectarizeQuestRequirements.upgrade = (window.terrariumFlowerUpgrade4Level || 0) >= 1;
  if (typeof window.checkHardModeTabButtonVisibility === 'function') {
    window.checkHardModeTabButtonVisibility();
  }
  if (nectarizeQuestActive && !nectarizeMachineRepaired && !window.nectarizeQuestPermanentlyCompleted) {
    setTimeout(() => {
      if (typeof checkNectarizeQuestProgress === 'function') {
        checkNectarizeQuestProgress();
      }
    }, 100);
  }
  nectarizePostResetTokenRequirement = window.nectarizePostResetTokenRequirement || 0;
  nectarizePostResetTokensGiven = window.nectarizePostResetTokensGiven || 0;
  nectarizePostResetTokenType = window.nectarizePostResetTokenType || 'petals';
}

window.syncTerrariumVarsFromWindow = syncTerrariumVarsFromWindow;

let fluzzerClickCount = 0;
let fluzzerClickTimer = null;
let fluzzerSpeedBoostActive = false;
let fluzzerSpeedBoostTimer = null;
let fluzzerOriginalInterval = 5000; 

function showTerrariumGainPopup(id, amount, label) {
  const popup = document.getElementById(id + 'Popup');
  if (!popup) {
    return;
  }
  const formatNum = (typeof formatNumber === 'function') ? formatNumber : (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(0);
  };
  popup.textContent = `+${formatNum(Number(amount))} ${label}`;
  popup.classList.remove('show', 'fade-out');
  popup.offsetHeight;
  popup.classList.add('show');
  setTimeout(() => {
    popup.classList.add('fade-out');
  }, 400);
  setTimeout(() => {
    popup.classList.remove('show', 'fade-out');
  }, 1200);
}

let pollenWandCooldown = false;
let wateringCanCooldown = false;
const POLLEN_TOOL_SPEED_UPGRADE_ORIGINAL_INTERVAL = 1.0; 

function getTerriariumToolCooldown() {
    return getPollenToolSpeedUpgradeEffect(pollenToolSpeedUpgradeLevel) * 1000;
}

let fluzzerAITimer = null;
let fluzzerAICursor = null;
let fluzzerPollenWandActive = false;
let fluzzerWateringCanActive = false;

function isTerrariumTabVisible() {
  const terrariumTab = document.getElementById('terrariumTab');
  return terrariumTab && terrariumTab.style.display !== 'none';
}

function createFluzzerCursor() {
  if (fluzzerAICursor && document.body.contains(fluzzerAICursor)) {
    return; 
  }
  fluzzerAICursor = document.createElement('div');
  fluzzerAICursor.id = 'fluzzerAICursor';
  fluzzerAICursor.style.cssText = `
    position: fixed;
    width: 40px;
    height: 40px;
    background: url('assets/icons/pollen wand.png') no-repeat center;
    background-size: contain;
    pointer-events: none;
    z-index: 10000;
    opacity: 0.8;
    transition: all 0.5s ease;
    filter: drop-shadow(0 0 8px rgba(120, 80, 180, 0.6));
    display: none;
  `;
  document.body.appendChild(fluzzerAICursor);
  if (window.isFluzzerSleeping && fluzzerAICursor) fluzzerAICursor.style.display = 'none';
}

function moveFluzzerCursor(x, y, duration = 1200) {
  if (!fluzzerAICursor) {
    createFluzzerCursor();
  }
  const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
  const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
  duration = Math.floor(duration * friendshipSpeedMultiplier);
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
    duration = Math.floor(duration * 0.6); 
  }
  if (isTerrariumTabVisible()) {
    fluzzerAICursor.style.display = 'block';
    fluzzerAICursor.style.left = x + 'px';
    fluzzerAICursor.style.top = y + 'px';
    fluzzerAICursor.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    fluzzerAICursor.style.transform = 'scale(1.2)';
    setTimeout(() => {
      if (fluzzerAICursor) {
        fluzzerAICursor.style.transform = 'scale(1)';
      }
    }, duration / 2);
  } else {
    fluzzerAICursor.style.display = 'none';
  }
}

function getFlowerCellPosition(index, cols, rows) {
  const grassPatch = document.getElementById('terrariumGrassPatchArea');
  if (!grassPatch) return { x: 0, y: 0 };
  const grid = grassPatch.querySelector('.terrarium-flower-grid');
  if (!grid) return { x: 0, y: 0 };
  const cells = grid.querySelectorAll('.terrarium-flower-cell');
  if (index >= 0 && index < cells.length) {
    const cell = cells[index];
    const rect = cell.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
  return { x: 0, y: 0 };
}

function getButtonPosition(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    const rect = button.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
  return { x: 0, y: 0 };
}

function fluzzerExploreFlowers(targetIndex, cols, rows, actionType) {
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
    const flowerPos = getFlowerCellPosition(targetIndex, cols, rows);
    const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
    let adjustedDuration = 1200; 
    const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
    adjustedDuration = Math.floor(adjustedDuration * friendshipSpeedMultiplier);
    adjustedDuration = Math.floor(adjustedDuration * 0.6); 
    moveFluzzerCursor(flowerPos.x, flowerPos.y, adjustedDuration);
    setTimeout(() => {
      if (actionType === 'watering') {
        handleFluzzerWateringCanClick(targetIndex, cols, rows);
      } else if (actionType === 'pollen') {
        handleFluzzerPollenWandClick(targetIndex, cols, rows);
      }
    }, adjustedDuration);
    return;
  }
  const total = cols * rows;
  let explorationStep = 0;
  let randomFlowers = [];
  while (randomFlowers.length < 2) {
    const randomIndex = Math.floor(Math.random() * total);
    if (randomIndex !== targetIndex && !randomFlowers.includes(randomIndex)) {
      if (terrariumFlowerGrid[randomIndex] && terrariumFlowerGrid[randomIndex].health > 0) {
        randomFlowers.push(randomIndex);
      }
    }
  }
  if (randomFlowers.length < 2) {
    randomFlowers = [targetIndex, targetIndex];
  }

  function nextExplorationStep() {
    explorationStep++;
    if (explorationStep === 1) {
      const flowerPos = getFlowerCellPosition(randomFlowers[0], cols, rows);
      const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
      let explorationDuration = 1200; 
      const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
      explorationDuration = Math.floor(explorationDuration * friendshipSpeedMultiplier);
      if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
        explorationDuration = Math.floor(explorationDuration * 0.6);
      }
      moveFluzzerCursor(flowerPos.x, flowerPos.y, explorationDuration);
      setTimeout(nextExplorationStep, explorationDuration);
    } else if (explorationStep === 2) {
      const flowerPos = getFlowerCellPosition(randomFlowers[1], cols, rows);
      const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
      let explorationDuration = 1200; 
      const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
      explorationDuration = Math.floor(explorationDuration * friendshipSpeedMultiplier);
      if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
        explorationDuration = Math.floor(explorationDuration * 0.6);
      }
      moveFluzzerCursor(flowerPos.x, flowerPos.y, explorationDuration);
      setTimeout(nextExplorationStep, explorationDuration);
    } else if (explorationStep === 3) {
      const flowerPos = getFlowerCellPosition(targetIndex, cols, rows);
      const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
      let movementDuration = 1200; 
      const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
      movementDuration = Math.floor(movementDuration * friendshipSpeedMultiplier);
      if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
        movementDuration = Math.floor(movementDuration * 0.6);
      }
      moveFluzzerCursor(flowerPos.x, flowerPos.y, movementDuration);
      setTimeout(() => {
        if (actionType === 'watering') {
          handleFluzzerWateringCanClick(targetIndex, cols, rows);
        } else if (actionType === 'pollen') {
          handleFluzzerPollenWandClick(targetIndex, cols, rows);
        }
      }, movementDuration);
    }
  }

  const initialDelay = (actionType === 'watering' && !fluzzerWateringCanActive) || (actionType === 'pollen' && !fluzzerPollenWandActive) ? 1800 : 1000;
  setTimeout(nextExplorationStep, initialDelay);
}

function startFluzzerAI() {
  if (window.isFluzzerSleeping) {
    if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
    return;
  }
  if (fluzzerAITimer) return;
  const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
  let baseInterval = fluzzerSpeedBoostActive ? 1000 : fluzzerOriginalInterval;
  let minInterval = 500; 
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
    baseInterval = Math.max(100, 400 - (fluzzerAffectionLevel * 20));
    minInterval = Math.max(50, 200 - (fluzzerAffectionLevel * 10));
  }
  const intervalReduction = 500; 
  const currentInterval = Math.max(minInterval, baseInterval - fluzzerAffectionLevel * intervalReduction);
  createFluzzerCursor();
  if (window.isFluzzerSleeping && fluzzerAICursor) fluzzerAICursor.style.display = 'none';
  fluzzerAITimer = setInterval(() => {
    fluzzerAIAction();
  }, currentInterval);
}

function stopFluzzerAI() {
  if (fluzzerAITimer) {
    clearInterval(fluzzerAITimer);
    fluzzerAITimer = null;
  }
  if (fluzzerAICursor) {
    fluzzerAICursor.remove();
    fluzzerAICursor = null;
  }
}

function handleFluzzerClick() {
  const msg = fluzzerUpsetSpeeches[Math.floor(Math.random() * fluzzerUpsetSpeeches.length)];
  fluzzerSay(msg, true);
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  setTimeout(scheduleFluzzerRandomSpeech, 3600);
}

function handleFluzzerWateringCanClick(index, cols, rows) {
  const indices = [];
  const total = cols * rows;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      const targetRow = Math.floor(index / cols) + rowOffset;
      const targetCol = (index % cols) + colOffset;
      const targetIndex = targetRow * cols + targetCol;
      if (targetRow >= 0 && targetRow < rows && 
          targetCol >= 0 && targetCol < cols && 
          targetIndex >= 0 && targetIndex < total) {
        indices.push(targetIndex);
      }
    }
  }
  let flowersWatered = 0;
  for (const idx of indices) {
    const flower = terrariumFlowerGrid[idx];
    if (flower && flower.health < 5) {
      flower.health++;
      flowersWatered++;
    }
  }
  if (flowersWatered > 0) {
    updateFlowerGridOnly();
  }
}

function handleFluzzerPollenWandClick(index, cols, rows) {
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
    const flower = terrariumFlowerGrid[idx];
    if (flower && flower.health > 0) {
      flower.health--;
      pollenGained++;
      if (flower.health === 0) {
        flowersCollected++;
        xpGained++;
        if (rustlingFlowerIndices.includes(idx)) {
          const el = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
          if (window.spawnIngredientToken && el) {
            window.spawnIngredientToken('terrarium', el);
          }
          clearRustlingFlower(idx);
        }
      }
    }
  }
  pollenGained = Math.floor(pollenGained * getPollenValueUpgradeEffect(pollenValueUpgradeLevel));
  pollenGained = Math.floor(pollenGained * Math.pow(2, terrariumLevel - 1));
  pollenGained = Math.floor(pollenGained * getFlowerUpgrade3Effect(pollenValueUpgrade2Level));
  const milestoneBonus = getNectarizeMilestoneBonus();
  if (milestoneBonus && typeof milestoneBonus.pollen === 'number' && !isNaN(milestoneBonus.pollen)) {
    pollenGained = Math.floor(pollenGained * milestoneBonus.pollen);
  }
  pollenGained = Math.floor(pollenGained * getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel));
  flowersCollected = Math.floor(flowersCollected * getFlowerValueUpgradeEffect(flowerValueUpgradeLevel));
  flowersCollected = Math.floor(flowersCollected * getFlowerUpgrade3Effect(pollenValueUpgrade2Level));
  if (milestoneBonus && typeof milestoneBonus.flowers === 'number' && !isNaN(milestoneBonus.flowers)) {
    flowersCollected = Math.floor(flowersCollected * milestoneBonus.flowers);
  }
  flowersCollected = Math.floor(flowersCollected * getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel));
  const flowerGainFinal = Math.floor(flowersCollected * getTerrariumFlowerMultiplier(terrariumLevel));
  const originalPollen = terrariumPollen;
  const originalFlowers = terrariumFlowers;
  terrariumPollen += pollenGained;
  terrariumFlowers += flowerGainFinal;
  if (typeof window.applyChargerTerrariumBoost === 'function') {
    window.applyChargerTerrariumBoost(pollenGained, flowerGainFinal);
    terrariumPollen = window.terrariumPollen;
    terrariumFlowers = window.terrariumFlowers;
  } else {
  }
  if (typeof window.trackFlowerMilestone === 'function') {
    window.trackFlowerMilestone(terrariumFlowers);
  }
  addTerrariumXP(xpGained);
  let leveledUp = false;
  while (terrariumXP >= getTerrariumXPRequirement(terrariumLevel)) {
    terrariumXP -= getTerrariumXPRequirement(terrariumLevel);
    terrariumLevel++;
    leveledUp = true;
  }
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  window.terrariumXP = terrariumXP;
  window.terrariumLevel = terrariumLevel;
  if (pollenGained > 0 || flowersCollected > 0) {
    updateFlowerGridOnly();
    updateCurrencyDisplaysOnly();
    updateTerrariumUpgradeCurrencyCounts();
  }
  if (leveledUp) {
    stopFluzzerSpeechTimer();
    handleFlowerGridTroll(terrariumLevel);
    fluzzerLevelUpSay('Level up! You are now level ' + terrariumLevel + '!');
    if (typeof checkNectarizeMilestones === 'function') {
      checkNectarizeMilestones();
    }
  }
}

function updateFlowerGridOnly() {
  const grassPatch = document.getElementById('terrariumGrassPatchArea');
  if (!grassPatch) return;
  const grid = grassPatch.querySelector('.terrarium-flower-grid');
  if (!grid) return;
  const dimensions = getCurrentFlowerGridDimensions();
  const cols = dimensions.cols, rows = dimensions.rows;
  const total = cols * rows;
  const flowerTypes = [
    'assets/icons/white flower.png',
    'assets/icons/blue flower.png',
    'assets/icons/red flower.png'
  ];
  const cells = grid.querySelectorAll('.terrarium-flower-cell');
  for (let i = 0; i < total && i < cells.length; i++) {
    const flower = terrariumFlowerGrid[i];
    const cell = cells[i];
    const img = cell.querySelector('img');
    if (flower && img) {
      if (flower.health <= 0) {
        cell.style.opacity = '0.2';
        cell.style.filter = 'grayscale(1)';
        img.style.opacity = '0.2';
        img.style.filter = 'grayscale(1)';
      } else {
        cell.style.opacity = '1';
        cell.style.filter = '';
        img.style.opacity = (0.5 + 0.1 * flower.health);
        img.style.filter = '';
      }
      if (flower.health > 0 && flower.health < 5) {
        cell.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.3)';
        cell.style.borderRadius = '8px';
      } else {
        cell.style.boxShadow = '';
        cell.style.borderRadius = '';
      }
    }
  }
}

function updateCurrencyDisplaysOnly() {
  const pollenSpan = document.getElementById('terrariumPollen');
  if (pollenSpan) pollenSpan.textContent = formatNumberSci(terrariumPollen);
  const flowerSpan = document.getElementById('terrariumFlowers');
  if (flowerSpan) flowerSpan.textContent = formatNumberSci(terrariumFlowers);
  const xpSpan = document.getElementById('terrariumXP');
  const xpFill = document.getElementById('terrariumXPFill');
  const xpReq = getTerrariumXPRequirement(terrariumLevel);
  if (xpSpan) xpSpan.textContent = `lvl: ${terrariumLevel}      Xp: ${formatNumberSci(terrariumXP)}/${formatNumberSci(xpReq)}`;
  if (xpFill) xpFill.style.width = Math.min(100, (terrariumXP / xpReq) * 100) + '%';
  const pollenMultSpan = document.getElementById('terrariumPollenMultiplier');
  if (pollenMultSpan) pollenMultSpan.textContent = `x${formatNumberSci(Math.pow(2, terrariumLevel - 1))} pollen`;
  const flowerMultSpan = document.getElementById('terrariumFlowerMultiplier');
  if (flowerMultSpan) flowerMultSpan.textContent = `x${formatNumberSci(getTerrariumFlowerMultiplier(terrariumLevel))} flowers`;
}

function fluzzerAIAction() {
  if (!terrariumFlowerGrid) return;
  let totalHealth = 0;
  let aliveFlowers = [];
  for (let i = 0; i < terrariumFlowerGrid.length; i++) {
    const flower = terrariumFlowerGrid[i];
    if (flower.health > 0) {
      totalHealth += flower.health;
      aliveFlowers.push(i);
    }
  }
  const averageHealth = totalHealth / terrariumFlowerGrid.length;
  const halfMaxHealth = (5 * terrariumFlowerGrid.length) / 2; 
  if (totalHealth < halfMaxHealth) {
    fluzzerUseWateringCan();
  } else if (aliveFlowers.length > 0) {
    const randomIndex = Math.floor(Math.random() * aliveFlowers.length);
    const targetIndex = aliveFlowers[randomIndex];
    fluzzerUsePollenWand(targetIndex);
  }
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
    if (Math.random() < 0.01) { 
      setTimeout(() => {
        if (typeof triggerFluzzerBoostDialogue === 'function') {
          triggerFluzzerBoostDialogue();
        }
      }, 1000); 
    }
  }
}

function fluzzerUseWateringCan() {
  if (!fluzzerWateringCanActive) {
    fluzzerWateringCanActive = true;
    fluzzerPollenWandActive = false;
    const wateringBtn = document.getElementById('wateringCanBtn');
    const pollenBtn = document.getElementById('pollenCollectorBtn');
    if (wateringBtn) wateringBtn.classList.add('active');
    if (pollenBtn) pollenBtn.classList.remove('active');
    const wateringPos = getButtonPosition('wateringCanBtn');
    if (fluzzerAICursor) {
      fluzzerAICursor.style.background = "url('assets/icons/watering.png') no-repeat center";
      fluzzerAICursor.style.backgroundSize = "contain";
    }
    moveFluzzerCursor(wateringPos.x, wateringPos.y); 
  }
  let lowHealthFlowers = [];
  let mediumHealthFlowers = [];
  for (let i = 0; i < terrariumFlowerGrid.length; i++) {
    const flower = terrariumFlowerGrid[i];
    if (flower.health > 0 && flower.health < 5) {
      if (flower.health <= 2) {
        lowHealthFlowers.push(i);
      } else {
        mediumHealthFlowers.push(i);
      }
    }
  }
  let targetIndex = -1;
  if (lowHealthFlowers.length > 0) {
    const randomIndex = Math.floor(Math.random() * lowHealthFlowers.length);
    targetIndex = lowHealthFlowers[randomIndex];
  } else if (mediumHealthFlowers.length > 0) {
    const randomIndex = Math.floor(Math.random() * mediumHealthFlowers.length);
    targetIndex = mediumHealthFlowers[randomIndex];
  }
  if (targetIndex >= 0) {
    const dimensions = getCurrentFlowerGridDimensions();
    const cols = dimensions.cols, rows = dimensions.rows;
    fluzzerExploreFlowers(targetIndex, cols, rows, 'watering');
  }
}

function fluzzerUsePollenWand(targetIndex) {
  if (!fluzzerPollenWandActive) {
    fluzzerPollenWandActive = true;
    fluzzerWateringCanActive = false;
    const pollenBtn = document.getElementById('pollenCollectorBtn');
    const wateringBtn = document.getElementById('wateringCanBtn');
    if (pollenBtn) pollenBtn.classList.add('active');
    if (wateringBtn) wateringBtn.classList.remove('active');
    const pollenPos = getButtonPosition('pollenCollectorBtn');
    if (fluzzerAICursor) {
      fluzzerAICursor.style.background = "url('assets/icons/pollen wand.png') no-repeat center";
      fluzzerAICursor.style.backgroundSize = "contain";
    }
    moveFluzzerCursor(pollenPos.x, pollenPos.y); 
  }
  const dimensions = getCurrentFlowerGridDimensions();
  const cols = dimensions.cols, rows = dimensions.rows;
  fluzzerExploreFlowers(targetIndex, cols, rows, 'pollen');
}

let flowerRegrowthTimer = null;
let lastRegrowthTime = Date.now();

function startFlowerRegrowthTimer() {
  if (flowerRegrowthTimer) {
    clearInterval(flowerRegrowthTimer);
  }
  flowerRegrowthTimer = setInterval(() => {
    regrowFlowers();
  }, 30000); 
}

function stopFlowerRegrowthTimer() {
  if (flowerRegrowthTimer) {
    clearInterval(flowerRegrowthTimer);
    flowerRegrowthTimer = null;
  }
}

function regrowFlowers() {
  if (!terrariumFlowerGrid) return;
  let flowersRegrown = 0;
  for (let i = 0; i < terrariumFlowerGrid.length; i++) {
    const flower = terrariumFlowerGrid[i];
    if (flower.health < 5) {
      flower.health++;
      flowersRegrown++;
    }
  }
  if (flowersRegrown > 0) {
    renderTerrariumUI();
  }
}

function renderTerrariumUI() {
  syncTerrariumVarsFromWindow();
  if (nectarizeQuestActive && !nectarizeMachineRepaired && !window.nectarizeQuestPermanentlyCompleted) {
    setTimeout(() => {
      if (typeof checkNectarizeQuestProgress === 'function') {
        checkNectarizeQuestProgress();
      }
    }, 100);
  }
  syncTerrariumUpgradeVarsFromWindow();
  const charCard = document.getElementById('terrariumCharacterCard');
  if (charCard) {
    let fluzzerImg = document.getElementById('fluzzerImg');
    if (!fluzzerImg) {
      const fluzzerImageSrc = window.isFluzzerSleeping ? 'assets/icons/fluzzer sleeping.png' : 'assets/icons/fluzzer.png';
    charCard.innerHTML = `
      <div class="fluzzer-img-wrap" style="display:inline-block;position:relative;">
          <img id="fluzzerImg" src="${fluzzerImageSrc}" alt="Fluzzer" style="width:110px;height:110px;border-radius:16px;margin-top:1em;box-shadow:0 2px 8px rgba(120,80,180,0.10);cursor:pointer;">
      </div>
    `;
      fluzzerImg = document.getElementById('fluzzerImg');
    } else {
      const isTalkingImage = fluzzerImg.src.includes('talking.png');
      const isCurrentlyTalking = fluzzerIsTalking || isTalkingImage;
      if (!isCurrentlyTalking) {
        const expectedSrc = window.isFluzzerSleeping ? 'assets/icons/fluzzer sleeping.png' : 'assets/icons/fluzzer.png';
        if (!fluzzerImg.src.includes(expectedSrc.split('/').pop())) {
          fluzzerImg.src = expectedSrc;
        }
      }
    }
    const imgWrap = charCard.querySelector('.fluzzer-img-wrap');
    if (imgWrap && !document.getElementById('fluzzerSpeech')) {
      const bubble = document.createElement('div');
      bubble.id = 'fluzzerSpeech';
      bubble.className = 'swaria-speech';
      bubble.style.position = 'absolute';
      bubble.style.left = '100%';
      bubble.style.top = '50%';
      bubble.style.transform = 'translateY(-50%)';
      bubble.style.marginLeft = '10px';
      bubble.style.zIndex = '10';
      bubble.style.display = 'none'; 
      imgWrap.appendChild(bubble);
    }
    if (!document.getElementById('terrariumBackBtn')) {
      const backBtn = document.createElement('button');
      backBtn.id = 'terrariumBackBtn';
      backBtn.innerHTML = '<span style="font-size:1.5em;margin-right:0.5em;">▼</span><span>Back to Floor 1</span>';
      backBtn.className = 'floor-btn';
      backBtn.style.margin = '1.2em 0 0 0';
      backBtn.onclick = function() {
        window.currentFloor = 1;
        if (typeof window.updateFloor2Visibility === 'function') {
          window.updateFloor2Visibility();
        }
      };
      charCard.appendChild(backBtn);
    }
  }
  const pollenCard = document.getElementById('terrariumPollenCard');
  if (pollenCard) {
    pollenCard.innerHTML = `
      <div class="terrarium-currency-card">
        <div class="terrarium-currency-row">
          <img src="assets/icons/pollen.png" class="terrarium-currency-img">
          <div class="terrarium-currency-label">
            Pollen: <span id="terrariumPollen" class="terrarium-currency-value">0</span>
            <div id="terrariumPollenPopup" class="terrarium-gain-popup"></div>
          </div>
        </div>
        <div class="terrarium-currency-row">
          <img src="assets/icons/flower.png" class="terrarium-currency-img">
          <div class="terrarium-currency-label">
            Flowers: <span id="terrariumFlowers" class="terrarium-currency-value">0</span>
            <div id="terrariumFlowersPopup" class="terrarium-gain-popup"></div>
          </div>
        </div>
      </div>
    `;
  }
  const grassPatch = document.getElementById('terrariumGrassPatchArea');
  if (grassPatch) {
    const grassBaseHeight = 38; 
    const grassHeightIncrease = flowerFieldExpansionUpgradeLevel * 6; 
    const grassNewHeight = grassBaseHeight + grassHeightIncrease;
    grassPatch.style.height = `${grassNewHeight}vh`;
    const baseWidth = 60; 
    const widthShrink = flowerFieldExpansionUpgradeLevel * 3; 
    const newWidth = Math.max(40, baseWidth - widthShrink); 
    grassPatch.style.width = `${newWidth}vw`;
    grassPatch.innerHTML = `
      <div id="terrariumXPBar" style="width:96%;bottom: 75px;margin:0.3em auto 0.5em auto;position:relative;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;width:100%;margin-bottom:0.1em;gap:0.5em;">
          <span id="terrariumXP" style="font-size:0.8em;font-weight:bold;"></span>
          <span id="terrariumPollenMultiplier" style="font-size:0.8em;font-weight:bold;"></span>
          <span id="terrariumFlowerMultiplier" style="font-size:0.8em;font-weight:bold;"></span>
        </div>
        <div style="background:#e0e0e0;border-radius:12px;height:16px;width:100%;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.07);">
          <div id="terrariumXPFill" style="background:linear-gradient(90deg,#bfaaff 40%,#7be87b 100%);height:100%;width:0%;border-radius:12px;"></div>
        </div>
      </div>
      <div style="font-size:1.4em;font-weight:bold;margin-bottom:0.7em;"></div>
      <div class='terrarium-flower-grid'></div>
      <!-- Flowers will be rendered here in the future -->
    `;
    const dimensions = getCurrentFlowerGridDimensions();
    const cols = dimensions.cols, rows = dimensions.rows;
    const total = cols * rows;
    const flowerTypes = [
      'assets/icons/white flower.png',
      'assets/icons/blue flower.png',
      'assets/icons/red flower.png'
    ];
    if (!terrariumFlowerGrid || terrariumFlowerGrid.length !== total) {
      terrariumFlowerGrid = Array(total).fill().map(() => ({
        type: Math.floor(Math.random() * 3),
        health: 5
      }));
    }
    const grid = grassPatch.querySelector('.terrarium-flower-grid');
    grid.innerHTML = '';
    const baseCellSize = 50;
    const cellSizeShrink = flowerFieldExpansionUpgradeLevel * 2; 
    const cellSize = Math.max(30, baseCellSize - cellSizeShrink); 
    grid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    for (let i = 0; i < total; i++) {
      const flower = terrariumFlowerGrid[i];
      const cell = document.createElement('div');
      cell.className = 'terrarium-flower-cell';
      cell.setAttribute('data-idx', i);
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      if (flower.health <= 0) {
        cell.style.opacity = '0.2';
        cell.style.filter = 'grayscale(1)';
      }
      const img = document.createElement('img');
      img.src = flowerTypes[flower.type];
      img.alt = 'Flower';
      img.className = 'terrarium-flower-img';
      img.style.width = `${cellSize}px`;
      img.style.height = `${cellSize}px`;
      img.style.opacity = (flower.health > 0) ? (0.5 + 0.1 * flower.health) : 0.2;
      img.style.filter = (flower.health > 0) ? '' : 'grayscale(1)';
      if (flower.health > 0 && flower.health < 5) {
        cell.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.3)';
        cell.style.borderRadius = '8px';
      }
      cell.appendChild(img);
      if (
        (pollenWandActive && flower.health > 0 && !pollenWandCooldown) ||
        (wateringCanActive && !wateringCanCooldown)
      ) {
        cell.style.cursor = 'pointer';
        cell.onclick = function() {
          if (pollenWandActive && flower.health > 0) {
            handlePollenWandClick(i, cols, rows);
          } else if (wateringCanActive) {
            handleWateringCanClick(i, cols, rows);
          }
        };
      } else {
        cell.style.cursor = 'default';
        cell.onclick = null;
      }
      grid.appendChild(cell);
    }
  }
  const pollenBtn = document.getElementById('pollenCollectorBtn');
  const wateringBtn = document.getElementById('wateringCanBtn');
  if (pollenBtn) {
    pollenBtn.onclick = function() {
      pollenWandActive = !pollenWandActive;
      if (pollenWandActive) {
        document.body.classList.add('pollen-wand-mode');
        pollenBtn.classList.add('active');
        if (wateringBtn) wateringBtn.classList.remove('active');
        wateringCanActive = false;
        document.body.classList.remove('watering-can-mode');
      } else {
        document.body.classList.remove('pollen-wand-mode');
        pollenBtn.classList.remove('active');
      }
      renderTerrariumUI();
    };
    if (pollenWandActive) pollenBtn.classList.add('active');
    else pollenBtn.classList.remove('active');
  }
  if (wateringBtn) {
    wateringBtn.onclick = function() {
      wateringCanActive = !wateringCanActive;
      if (wateringCanActive) {
        document.body.classList.add('watering-can-mode');
      wateringBtn.classList.add('active');
      if (pollenBtn) pollenBtn.classList.remove('active');
        pollenWandActive = false;
        document.body.classList.remove('pollen-wand-mode');
      } else {
        document.body.classList.remove('watering-can-mode');
        wateringBtn.classList.remove('active');
      }
      renderTerrariumUI();
    };
    if (wateringCanActive) wateringBtn.classList.add('active');
    else wateringBtn.classList.remove('active');
  }
  const pollenSpan = document.getElementById('terrariumPollen');
  const flowerSpan = document.getElementById('terrariumFlowers');
  if (pollenSpan) pollenSpan.textContent = formatNumberSci(terrariumPollen);
  if (flowerSpan) flowerSpan.textContent = formatNumberSci(terrariumFlowers);
  if (nectarizeMachineRepaired && document.getElementById('nectarizePreview')) {
    updateNectarizePreview();
  }
  const xpSpan = document.getElementById('terrariumXP');
  const xpFill = document.getElementById('terrariumXPFill');
  const xpReq = getTerrariumXPRequirement(terrariumLevel);
  if (xpSpan) xpSpan.textContent = `lvl: ${terrariumLevel}      Xp: ${formatNumberSci(terrariumXP)}/${formatNumberSci(xpReq)}`;
  if (xpFill) xpFill.style.width = Math.min(100, (terrariumXP / xpReq) * 100) + '%';
  const pollenMultSpan = document.getElementById('terrariumPollenMultiplier');
  if (pollenMultSpan) pollenMultSpan.textContent = `x${formatNumberSci(Math.pow(2, terrariumLevel - 1))} pollen`;
  const flowerMultSpan = document.getElementById('terrariumFlowerMultiplier');
  if (flowerMultSpan) flowerMultSpan.textContent = `x${formatNumberSci(getTerrariumFlowerMultiplier(terrariumLevel))} flowers`;
  const lvlDiv = document.getElementById('terrariumLevelDisplay');
  if (lvlDiv && lvlDiv.parentNode) lvlDiv.parentNode.removeChild(lvlDiv);
  if (typeof updatePollenUpgradeCircleCost === 'function') {
    updatePollenUpgradeCircleCost();
  }
  const fluzzerImg = document.getElementById('fluzzerImg');
  if (fluzzerImg) {
    fluzzerImg.style.cursor = 'pointer';
    fluzzerImg.onclick = handleFluzzerClick;
  }
  checkAndUpdateFluzzerSleepState();
  updateFlowerGridButtonState();
}

function setupTerrariumSubTabButtons() {
  const grassBtn = document.getElementById('terrariumGrassPatchBtn');
  const pollenBtn = document.getElementById('terrariumPollenUpgradesBtn');
  const nectarizeBtn = document.getElementById('terrariumNectarizeBtn');
  const flowerGridBtn = document.getElementById('terrariumFlowerGridBtn');
  const grassArea = document.getElementById('terrariumGrassPatchArea');
  const pollenArea = document.getElementById('terrariumPollenUpgradesArea');
  const charCard = document.getElementById('terrariumCharacterCard');
  const pollenCard = document.getElementById('terrariumPollenCard');
  const wateringBtn = document.getElementById('wateringCanBtn');
  const pollenWandBtn = document.getElementById('pollenCollectorBtn');
  const fluzzerAICursor = window.fluzzerAICursor || document.getElementById('fluzzerAICursor');
  if (grassBtn && pollenBtn && grassArea && pollenArea) {
    grassBtn.onclick = function() {
      const grassPatchArea = document.getElementById('terrariumGrassPatchArea');
      if (grassPatchArea) {
        grassPatchArea.style.display = 'flex';
      }
      grassArea.style.display = '';
      pollenArea.style.display = 'none';
      const nectarizeArea = document.getElementById('terrariumNectarizeArea');
      if (nectarizeArea) nectarizeArea.style.display = 'none';
      if (typeof window.hideNectarizeMilestoneTable === 'function') {
        window.hideNectarizeMilestoneTable();
      }
      grassBtn.classList.add('active');
      pollenBtn.classList.remove('active');
      if (nectarizeBtn) nectarizeBtn.classList.remove('active');
      if (charCard) charCard.style.display = '';
      if (pollenCard) pollenCard.style.display = '';
      if (wateringBtn) wateringBtn.style.display = '';
      if (pollenWandBtn) pollenWandBtn.style.display = '';
      if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'block';
      if (typeof startFluzzerAI === 'function' && !fluzzerAITimer && !window.isFluzzerSleeping) startFluzzerAI();
    };
    pollenBtn.onclick = function() {
      grassArea.style.display = 'none';
      pollenArea.style.display = '';
      const nectarizeArea = document.getElementById('terrariumNectarizeArea');
      if (nectarizeArea) nectarizeArea.style.display = 'none';
      if (typeof window.hideNectarizeMilestoneTable === 'function') {
        window.hideNectarizeMilestoneTable();
      }
      pollenBtn.classList.add('active');
      grassBtn.classList.remove('active');
      nectarizeBtn.classList.remove('active');
      if (charCard) charCard.style.display = 'none';
      if (pollenCard) pollenCard.style.display = 'none';
      if (wateringBtn) wateringBtn.style.display = 'none';
      if (pollenWandBtn) pollenWandBtn.style.display = 'none';
      if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
      if (typeof stopFluzzerAI === 'function') stopFluzzerAI();
    };
    if (nectarizeBtn) {
      nectarizeBtn.onclick = function() {
        const grassPatchArea = document.getElementById('terrariumGrassPatchArea');
        if (grassPatchArea) {
          grassPatchArea.style.display = 'none';
        }
        grassArea.style.display = 'none';
        pollenArea.style.display = 'none';
        const nectarizeArea = document.getElementById('terrariumNectarizeArea');
        if (nectarizeArea) {
          nectarizeArea.style.display = 'block';
        } else {
          console.error('Nectarize area element not found!');
        }
        nectarizeBtn.classList.add('active');
        grassBtn.classList.remove('active');
        pollenBtn.classList.remove('active');
        if (charCard) charCard.style.display = 'none';
        if (pollenCard) pollenCard.style.display = 'none';
        if (wateringBtn) wateringBtn.style.display = 'none';
        if (pollenWandBtn) pollenWandBtn.style.display = 'none';
        if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
        if (typeof stopFluzzerAI === 'function') stopFluzzerAI();
        initializeNectarizeArea();
        if (typeof updateNectarizeMilestoneTable === 'function') {
          updateNectarizeMilestoneTable();
        }
      };
    }
    grassArea.style.display = '';
    pollenArea.style.display = 'none';
    grassBtn.classList.add('active');
    pollenBtn.classList.remove('active');
    if (nectarizeBtn) nectarizeBtn.classList.remove('active');
    if (charCard) charCard.style.display = '';
    if (pollenCard) pollenCard.style.display = '';
    if (wateringBtn) wateringBtn.style.display = '';
    if (pollenWandBtn) pollenWandBtn.style.display = '';
    if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'block';
    if (typeof startFluzzerAI === 'function' && !fluzzerAITimer && !window.isFluzzerSleeping) startFluzzerAI();
  }
  if (flowerGridBtn) {
    updateFlowerGridButtonState();
  }
}

(function() {
  const terrariumTab = document.getElementById('terrariumTab');
  if (!terrariumTab) return;
  const observer = new MutationObserver(() => {
    if (terrariumTab.style.display !== 'none') {
      renderTerrariumUI();
      setupTerrariumSubTabButtons();
    }
  });
  observer.observe(terrariumTab, { attributes: true, attributeFilter: ['style'] });
})();
const fluzzerNormalSpeeches = [
  "What a lovely day in the terrarium!",
  "The flowers look happy today.",
  "I wonder if it's time to water the grass...",
  "Pollen is the best!",
  "Did you see that butterfly?",
  "I love taking care of this place.",
  "Sometimes I talk to the flowers. They never talk back, but that's okay!",
  "If you listen closely, you can hear the grass growing.",
  "I hope the sun stays out a little longer today.",
  "Do you think the watering can likes its job?",
  "I wish I could fly like the bees... And no I can not fly with my wings...",
  "Thank you for visiting me! It gets a little quiet here sometimes.",
  "I wonder if pollen tastes sweet... Maybe I should try it?",
  "I like when the breeze makes the grass dance.",
  "If you find a shiny flower, can I have it?"
];
const fluzzerUpsetSpeeches = [
  "Hey! That tickles!",
  "Please be gentle...",
  "I'm trying my best!",
  "Why did you poke me?",
  "I'm a little upset now...",
  "Oh! I wasn't expecting that...",
  "Eep! My fur is sensitive, you know.",
  "Did I do something wrong?",
  "I get nervous when you poke me so much...",
  "Maybe a soft pat would be nicer?",
  "I hope my ears aren't too floppy for you...",
  "I might hide in the grass if you keep poking!"
];
let fluzzerSpeechTimer = null;
let fluzzerIsTalking = false;

function fluzzerSay(message, upset = false, duration = 5000) {
  if (window.isFluzzerLevelUpSpeaking) return;
  const charCard = document.getElementById('terrariumCharacterCard');
  if (!charCard) return;
  const imgWrap = charCard.querySelector('.fluzzer-img-wrap');
  if (!imgWrap) return;
  let bubble = document.getElementById('fluzzerSpeech');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'fluzzerSpeech';
    bubble.className = 'swaria-speech';
    bubble.style.position = 'absolute';
    bubble.style.left = '100%';
    bubble.style.top = '50%';
    bubble.style.transform = 'translateY(-50%)';
    bubble.style.marginLeft = '10px';
    bubble.style.zIndex = '10';
    imgWrap.appendChild(bubble);
  }
  bubble.textContent = message;
  bubble.style.display = 'block';
  if (upset) {
    bubble.style.background = '#fff';
    bubble.style.color = '#a22';
  } else {
    bubble.style.background = '#fff';
    bubble.style.color = '#222';
  }
  if (!bubble._hasPointer) {
    const pointer = document.createElement('div');
    pointer.style.position = 'absolute';
    pointer.style.left = '-18px';
    pointer.style.top = '18px';
    pointer.style.width = '0';
    pointer.style.height = '0';
    pointer.style.borderTop = '12px solid transparent';
    pointer.style.borderBottom = '12px solid transparent';
    pointer.style.borderRight = '18px solid #fff';
    pointer.style.zIndex = '11';
    pointer.className = 'fluzzer-speech-pointer';
    bubble.appendChild(pointer);
    bubble._hasPointer = true;
  }
  const fluzzerImg = document.getElementById('fluzzerImg');
  if (fluzzerImg) {
    fluzzerImg.src = 'assets/icons/fluzzer talking.png';
  }
  fluzzerIsTalking = true;
  if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
  window.fluzzerSpeechTimeout = setTimeout(() => {
    bubble.style.display = 'none';
    if (fluzzerImg) {
      if (window.isFluzzerSleeping) {
        fluzzerImg.src = 'assets/icons/fluzzer sleeping.png';
      } else {
        fluzzerImg.src = 'assets/icons/fluzzer.png';
      }
    }
    fluzzerIsTalking = false;
    if (!upset) scheduleFluzzerRandomSpeech();
  }, duration);
}

function fluzzerLevelUpSay(message) {
  const charCard = document.getElementById('terrariumCharacterCard');
  if (!charCard) return;
  const imgWrap = charCard.querySelector('.fluzzer-img-wrap');
  if (!imgWrap) return;
  let bubble = document.getElementById('fluzzerSpeech');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'fluzzerSpeech';
    bubble.className = 'swaria-speech';
    bubble.style.position = 'absolute';
    bubble.style.left = '100%';
    bubble.style.top = '50%';
    bubble.style.transform = 'translateY(-50%)';
    bubble.style.marginLeft = '10px';
    bubble.style.zIndex = '10';
    imgWrap.appendChild(bubble);
  }
  const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
    const mins = window.daynight.getTime();
    return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
  })();
  const hasAnyFluzzerBoost = isFluzzerBoostActive();
  let finalMessage = message;
  const fluzzerImg = document.getElementById('fluzzerImg');
  if (isNightTime && hasAnyFluzzerBoost) {
    window.fluzzerNightBoostedLevelUps++; 
    const derangedSpeeches = [
      `LEVEL ${terrariumLevel} ACHIEVED! THE NIGHT FUELS MY FLOWER OBSESSION! I AM UNSTOPPABLE!`,
      `POWER LEVEL ${terrariumLevel} UNLOCKED! THE DARKNESS MAKES ME STRONGER!`,
      `LEVEL ${terrariumLevel} MASTERED! I AM THE NIGHT FLUZZER! FEAR MY FLOWER MIGHT!`,
      `UPGRADE TO LEVEL ${terrariumLevel} COMPLETE! THE STARS BOW BEFORE MY MIGHT!`,
      `LEVEL ${terrariumLevel} CONQUERED! I AM THE ULTIMATE NIGHT FLOWER WARRIOR!`,
      `POWER LEVEL ${terrariumLevel} ACTIVATED! THE MOON POWERS MY FLOWER WORKING!`,
      `LEVEL ${terrariumLevel} DOMINATED! NO FLOWER IS SAFE FROM MY NIGHT RAGE!`,
      `UPGRADE TO LEVEL ${terrariumLevel} SUCCESSFUL! I'M UNLEASHED! UNSTOPPABLE!`,
      `LEVEL ${terrariumLevel} ACHIEVED! THE NIGHT IS MY DOMAIN!`,
      `POWER LEVEL ${terrariumLevel} UNLOCKED! I'M THE NIGHT DEMON OF FLOWER DESTRUCTION!`
    ];
    finalMessage = derangedSpeeches[Math.floor(Math.random() * derangedSpeeches.length)];
    bubble.textContent = finalMessage;
    bubble.style.display = 'block';
    bubble.style.background = '#ff4444'; 
    bubble.style.color = '#fff'; 
    if (fluzzerImg) {
      fluzzerImg.src = 'assets/icons/fluzzer talking.png';
    }
  } else if (isNightTime) {
    finalMessage = message + ' zzz...';
    bubble.textContent = finalMessage;
    bubble.style.display = 'block';
    bubble.style.background = '#fff';
    bubble.style.color = '#222';
    if (fluzzerImg) {
      fluzzerImg.src = 'assets/icons/fluzzer sleep talking.png';
    }
  } else {
    bubble.textContent = finalMessage;
    bubble.style.display = 'block';
    bubble.style.background = '#fff';
    bubble.style.color = '#222';
    if (fluzzerImg) {
      fluzzerImg.src = 'assets/icons/fluzzer talking.png';
    }
  }
  if (!bubble._hasPointer) {
    const pointer = document.createElement('div');
    pointer.style.position = 'absolute';
    pointer.style.left = '-18px';
    pointer.style.top = '18px';
    pointer.style.width = '0';
    pointer.style.height = '0';
    pointer.style.borderTop = '12px solid transparent';
    pointer.style.borderBottom = '12px solid transparent';
    pointer.style.borderRight = '18px solid #fff';
    pointer.style.zIndex = '11';
    pointer.className = 'fluzzer-speech-pointer';
    bubble.appendChild(pointer);
    bubble._hasPointer = true;
  }
  fluzzerIsTalking = true;
  if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
  const speechDuration = (isNightTime && hasAnyFluzzerBoost) ? 3000 : 3000; 
  window.isFluzzerLevelUpSpeaking = true;
  window.fluzzerSpeechTimeout = setTimeout(() => {
    bubble.style.display = 'none';
    window.isFluzzerLevelUpSpeaking = false; 
    if (fluzzerImg) {
      if (isNightTime && hasAnyFluzzerBoost) {
        fluzzerImg.src = 'assets/icons/fluzzer talking.png';
      } else if (isNightTime) {
        fluzzerImg.src = 'assets/icons/fluzzer sleeping.png';
      } else {
        fluzzerImg.src = 'assets/icons/fluzzer.png';
      }
    }
    fluzzerIsTalking = false;
    if (!isNightTime || hasAnyFluzzerBoost) scheduleFluzzerRandomSpeech();
  }, speechDuration);
}

function fluzzerRandomSpeech() {
  if (fluzzerIsTalking) return; 
  const msg = fluzzerNormalSpeeches[Math.floor(Math.random() * fluzzerNormalSpeeches.length)];
  fluzzerSay(msg, false);
}

function scheduleFluzzerRandomSpeech() {
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  const delay = 10000 + Math.random() * 8000;
  fluzzerSpeechTimer = setTimeout(() => {
    fluzzerRandomSpeech();
  }, delay);
}

function stopFluzzerSpeechTimer() {
  if (window.isFluzzerLevelUpSpeaking) return;
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  fluzzerSpeechTimer = null;
}

function handleWateringCanClick(index, cols, rows) {
  if (wateringCanCooldown) {
    return;
  }
  wateringCanCooldown = true;
  setTimeout(() => {
    wateringCanCooldown = false;
    renderTerrariumUI();
  }, getTerriariumToolCooldown());
  if (typeof window.trackClick === 'function') {
    window.trackClick();
  }
  if (typeof window.trackHardModeFlowerWatered === 'function') {
    window.trackHardModeFlowerWatered();
  }
  const indices = [];
  const total = cols * rows;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      const targetRow = Math.floor(index / cols) + rowOffset;
      const targetCol = (index % cols) + colOffset;
      const targetIndex = targetRow * cols + targetCol;
      if (targetRow >= 0 && targetRow < rows && 
          targetCol >= 0 && targetCol < cols && 
          targetIndex >= 0 && targetIndex < total) {
        indices.push(targetIndex);
      }
    }
  }
  let flowersWatered = 0;
  for (const idx of indices) {
    const flower = terrariumFlowerGrid[idx];
    if (flower && flower.health < 5) {
      flower.health++;
      flowersWatered++;
    }
  }
  if (flowersWatered > 0) {
    showTerrariumGainPopup('terrariumWatered', flowersWatered, 'Health');
  }
  renderTerrariumUI();
}

function handlePollenWandClick(index, cols, rows) {
  if (pollenWandCooldown) return;
  pollenWandCooldown = true;
  setTimeout(() => {
    pollenWandCooldown = false;
    renderTerrariumUI();
  }, getTerriariumToolCooldown());
  if (typeof window.trackClick === 'function') {
    window.trackClick();
  }
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
    const flower = terrariumFlowerGrid[idx];
    if (flower && flower.health > 0) {
      flower.health--;
      pollenGained++;
      if (flower.health === 0) {
        flowersCollected++;
        xpGained++;
      }
    }
  }
  pollenGained = Math.floor(pollenGained * getPollenValueUpgradeEffect(pollenValueUpgradeLevel));
  pollenGained = Math.floor(pollenGained * Math.pow(2, terrariumLevel - 1));
  pollenGained = Math.floor(pollenGained * getFlowerUpgrade3Effect(pollenValueUpgrade2Level));
  const milestoneBonus = getNectarizeMilestoneBonus();
  if (milestoneBonus && typeof milestoneBonus.pollen === 'number' && !isNaN(milestoneBonus.pollen)) {
    pollenGained = Math.floor(pollenGained * milestoneBonus.pollen);
  }
  pollenGained = Math.floor(pollenGained * getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel));
  if (typeof window.boughtElements !== 'undefined' && window.boughtElements[21]) {
    pollenGained = Math.floor(pollenGained * 10);
  }
  flowersCollected = Math.floor(flowersCollected * getFlowerValueUpgradeEffect(flowerValueUpgradeLevel));
  flowersCollected = Math.floor(flowersCollected * getFlowerUpgrade3Effect(pollenValueUpgrade2Level));
  if (milestoneBonus && typeof milestoneBonus.flowers === 'number' && !isNaN(milestoneBonus.flowers)) {
    flowersCollected = Math.floor(flowersCollected * milestoneBonus.flowers);
  }
  flowersCollected = Math.floor(flowersCollected * getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel));
  const flowerGainFinal = Math.floor(flowersCollected * getTerrariumFlowerMultiplier(terrariumLevel));
  let finalPollenGain = pollenGained;
  let finalFlowerGain = flowerGainFinal;
  if (typeof window.boughtElements !== 'undefined' && window.boughtElements[21]) {
    finalPollenGain = Math.floor(finalPollenGain * 10);
  }
  if (typeof window.boughtElements !== 'undefined' && window.boughtElements[22]) {
    finalFlowerGain = Math.floor(finalFlowerGain * 5);
  }
  const originalPollen = terrariumPollen;
  const originalFlowers = terrariumFlowers;
  let boostResult = { pollenBoost: 0, flowerBoost: 0 };
  if (typeof window.applyChargerTerrariumBoost === 'function') {
    boostResult = window.applyChargerTerrariumBoost(finalPollenGain, finalFlowerGain);
  }
  terrariumPollen += finalPollenGain + boostResult.pollenBoost;
  terrariumFlowers += finalFlowerGain + boostResult.flowerBoost;
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  if (typeof window.trackFlowerMilestone === 'function') {
    window.trackFlowerMilestone(terrariumFlowers);
  }
  if (typeof window.trackResourceCollection === 'function') {
    window.trackResourceCollection('berries', terrariumPollen);
  }
  addTerrariumXP(xpGained);
  let leveledUp = false;
  while (terrariumXP >= getTerrariumXPRequirement(terrariumLevel)) {
    terrariumXP -= getTerrariumXPRequirement(terrariumLevel);
    terrariumLevel++;
    leveledUp = true;
  }
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  window.terrariumXP = terrariumXP;
  window.terrariumLevel = terrariumLevel;
  renderTerrariumUI();
  checkAndUpdateFluzzerSleepState();
  updateFluzzerSleepState();
  if (leveledUp) {
    stopFluzzerSpeechTimer();
    handleFlowerGridTroll(terrariumLevel);
    fluzzerLevelUpSay('Level up! You are now level ' + terrariumLevel + '!');
  }
  const totalPollenGained = terrariumPollen - originalPollen;
  const totalFlowerGained = terrariumFlowers - originalFlowers;
  if (totalPollenGained > 0) showTerrariumGainPopup('terrariumPollen', totalPollenGained, 'Pollen');
  if (totalFlowerGained > 0) showTerrariumGainPopup('terrariumFlowers', totalFlowerGained, 'Flowers');
}

(function() {
  const terrariumTab = document.getElementById('terrariumTab');
  if (!terrariumTab) return;
  const observer = new MutationObserver(() => {
    if (terrariumTab.style.display === 'none') {
      pollenWandActive = false;
      wateringCanActive = false;
      document.body.classList.remove('pollen-wand-mode', 'watering-can-mode');
    }
  });
  observer.observe(terrariumTab, { attributes: true, attributeFilter: ['style'] });
})();
window.fluzzerHasWelcomed = window.fluzzerHasWelcomed || false;

function updateTerrariumUpgradeCurrencyCounts() {
  const pollenCount = typeof terrariumPollen !== 'undefined' ? terrariumPollen : 0;
  const flowerCount = typeof terrariumFlowers !== 'undefined' ? terrariumFlowers : 0;
  const pollenSpan = document.getElementById('terrariumPollenUpgradesCount');
  const flowerSpan = document.getElementById('terrariumFlowerUpgradesCount');
  if (pollenSpan) pollenSpan.textContent = formatNumberSci(pollenCount);
  if (flowerSpan) flowerSpan.textContent = formatNumberSci(flowerCount);
}

const origSetupTerrariumSubTabButtons = setupTerrariumSubTabButtons;

setupTerrariumSubTabButtons = function() {
  origSetupTerrariumSubTabButtons();
  updateTerrariumUpgradeCurrencyCounts();
};

const origRenderTerrariumUI = renderTerrariumUI;

renderTerrariumUI = function() {
  origRenderTerrariumUI();
  updateTerrariumUpgradeCurrencyCounts();
};

(function() {
  setTimeout(() => {
    startFlowerRegrowthTimer();
  }, 1000);
})();
(function() {
  setTimeout(() => {
    startFluzzerAI();
  }, 2000);
})();
(function() {
  const terrariumTab = document.getElementById('terrariumTab');
  if (!terrariumTab) return;
  const observer = new MutationObserver(() => {
    if (fluzzerAICursor) {
      if (isTerrariumTabVisible()) {
        if (fluzzerAICursor.style.display === 'none') {
          fluzzerAICursor.style.display = 'block';
        }
      } else {
        fluzzerAICursor.style.display = 'none';
      }
    }
  });
  observer.observe(terrariumTab, { attributes: true, attributeFilter: ['style'] });
})();

function updatePollenUpgradeRow() {
  const rows = document.querySelectorAll('.terrarium-upgrade-row');
  const pollenRow = rows[0];
  if (!pollenRow) return;
  const existingFlower3 = pollenRow.querySelector('[data-upgrade="flower3"]');
  if (existingFlower3) {
    existingFlower3.remove();
  }
  const existingPollen3 = pollenRow.querySelector('[data-upgrade="pollen3"]');
  if (existingPollen3) {
    const shouldShow = (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 5) || window.terrariumUpgradesUnlocked.pollen3;
    if (!shouldShow) {
      existingPollen3.style.display = 'none';
    } else {
      existingPollen3.style.display = 'flex';
      if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 5) {
        window.terrariumUpgradesUnlocked.pollen3 = true;
      }
      const nextUnlock = document.getElementById('terrariumPollenNextUnlock');
      if (nextUnlock) nextUnlock.textContent = 'Next upgrade unlocks at level 15';
      if (!existingPollen3.hasClickListener) {
        existingPollen3.hasClickListener = true;
        existingPollen3.addEventListener('click', function(e) {
          updateExtraChargeUpgradeModal();
          const modal = document.getElementById('extraChargeUpgradeModal');
          if (modal) modal.style.display = 'flex';
          e.stopPropagation();
        });
        existingPollen3.addEventListener('contextmenu', function(e) {
          handlePollenUpgradeRightClick('pollen3', e);
        });
      }
    }
  }
  const existingPollen4 = pollenRow.querySelector('[data-upgrade="pollen4"]');
  if (existingPollen4) {
    const shouldShow = (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 15) || window.terrariumUpgradesUnlocked.pollen4;
    if (!shouldShow) {
      existingPollen4.style.display = 'none';
    } else {
      existingPollen4.style.display = 'flex';
      if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 15) {
        window.terrariumUpgradesUnlocked.pollen4 = true;
      }
      const nextUnlock = document.getElementById('terrariumPollenNextUnlock');
      if (nextUnlock) nextUnlock.textContent = 'Next upgrade unlocks at level 45';
      if (!existingPollen4.hasClickListener) {
        existingPollen4.hasClickListener = true;
        existingPollen4.addEventListener('click', function(e) {
          updateXpMultiplierUpgradeModal();
          const modal = document.getElementById('xpMultiplierUpgradeModal');
          if (modal) modal.style.display = 'flex';
          e.stopPropagation();
        });
        existingPollen4.addEventListener('contextmenu', function(e) {
          handlePollenUpgradeRightClick('pollen4', e);
        });
      }
    }
  }
  const existingPollen5 = pollenRow.querySelector('[data-upgrade="pollen5"]');
  if (existingPollen5) {
    const shouldShow = (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 45) || window.terrariumUpgradesUnlocked.pollen5;
    if (!shouldShow) {
      existingPollen5.style.display = 'none';
    } else {
      existingPollen5.style.display = 'flex';
      if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 45) {
        window.terrariumUpgradesUnlocked.pollen5 = true;
      }
      const nextUnlock = document.getElementById('terrariumPollenNextUnlock');
      if (nextUnlock) nextUnlock.textContent = 'Next upgrade unlocks at level 150 (wip)';
      if (!existingPollen5.hasClickListener) {
        existingPollen5.hasClickListener = true;
        existingPollen5.addEventListener('click', function(e) {
          updateFlowerFieldExpansionUpgradeModal();
          const modal = document.getElementById('flowerFieldExpansionUpgradeModal');
          if (modal) modal.style.display = 'flex';
          e.stopPropagation();
        });
        existingPollen5.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          if (canBuyFlowerFieldExpansionUpgrade()) {
            buyFlowerFieldExpansionUpgrade(1);
          }
        });
      }
    }
  }
}

function updateFlowerUpgradeRow() {
  const rows = document.querySelectorAll('.terrarium-upgrade-row');
  const flowerRow = rows[1];
  if (!flowerRow) return;
  const existingFlower2 = flowerRow.querySelector('[data-upgrade="flower2"]');
  const existingFlower3 = flowerRow.querySelector('[data-upgrade="flower3"]');
  const existingFlower4 = flowerRow.querySelector('[data-upgrade="flower4"]');
  if (existingFlower2) existingFlower2.remove();
  if (existingFlower3) existingFlower3.remove();
  if (existingFlower4) existingFlower4.remove();
  if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 3) || window.terrariumUpgradesUnlocked.flower2) {
    if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 3) {
      window.terrariumUpgradesUnlocked.flower2 = true;
    }
    const div = document.createElement('div');
    div.className = 'terrarium-upgrade-card';
    div.id = 'flower-upgrade-2';
    div.setAttribute('data-upgrade', 'flower2');
    div.style.background = '#ffe6f0';
    div.style.border = '6px solid #ff69b4';
    div.style.borderRadius = '50%';
    div.style.width = '110px';
    div.style.height = '110px';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.boxShadow = '0 2px 12px #0006';
    div.style.cursor = 'pointer';
    div.style.position = 'relative';
    div.innerHTML = `
      <img src="assets/icons/flower upgrade 2.png" style="width:54px; height:54px; margin-bottom:0.2em;">
      <div class="terrarium-upgrade-level" style="font-size:1.1em; color:#333; font-weight:bold;">0</div>
      <div style="position:absolute; bottom:-2.2em; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:0.2em;">
        <img src="assets/icons/flower.png" style="width:20px; height:20px;">
        <span style="color:#e33; font-weight:bold; font-size:1.1em;">100</span>
      </div>
    `;
    flowerRow.appendChild(div);
    div.addEventListener('click', function(e) {
      updateFlowerXPUpgradeModal();
      const modal = document.getElementById('flowerXPUpgradeModal');
      if (modal) modal.style.display = 'flex';
      e.stopPropagation();
    });
    div.addEventListener('contextmenu', function(e) {
      if (canBuyFlowerXPUpgrade()) {
        buyMaxFlowerXPUpgrade();
      }
      e.preventDefault();
      e.stopPropagation();
    });
    updateFlowerXPUpgradeCircleCost();
  }
  if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 10) || window.terrariumUpgradesUnlocked.flower3) {
    if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 10) {
      window.terrariumUpgradesUnlocked.flower3 = true;
    }
    const div = document.createElement('div');
    div.className = 'terrarium-upgrade-card';
    div.id = 'flower-upgrade-3';
    div.setAttribute('data-upgrade', 'flower3');
    div.style.background = '#ffe6f0';
    div.style.border = '6px solid #ff69b4';
    div.style.borderRadius = '50%';
    div.style.width = '110px';
    div.style.height = '110px';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.boxShadow = '0 2px 12px #0006';
    div.style.cursor = 'pointer';
    div.style.position = 'relative';
    div.innerHTML = `
      <img src="assets/icons/flower upgrade 3.png" style="width:54px; height:54px; margin-bottom:0.2em;">
      <div class="terrarium-upgrade-level" style="font-size:1.1em; color:#333; font-weight:bold;">0</div>
      <div style="position:absolute; bottom:-2.2em; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:0.2em;">
        <img src="assets/icons/flower.png" style="width:20px; height:20px;">
        <span style="color:#e33; font-weight:bold; font-size:1.1em;">1000</span>
      </div>
    `;
    flowerRow.appendChild(div);
    div.addEventListener('click', function(e) {
      updateFlowerUpgrade3Modal();
      const modal = document.getElementById('pollenUpgrade2Modal');
      if (modal) modal.style.display = 'flex';
      e.stopPropagation();
    });
    div.addEventListener('contextmenu', function(e) {
      if (canBuyFlowerUpgrade3()) {
        buyMaxFlowerUpgrade3();
      }
      e.preventDefault();
      e.stopPropagation();
    });
    updateFlowerUpgrade3CircleCost();
  }
  if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 30) || window.terrariumUpgradesUnlocked.flower4) {
    if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 30) {
      window.terrariumUpgradesUnlocked.flower4 = true;
    }
    let flowerUpgrade4Card = document.getElementById('flower-upgrade-4');
    if (!flowerUpgrade4Card) {
      const div = document.createElement('div');
      div.className = 'terrarium-upgrade-card';
      div.id = 'flower-upgrade-4';
      div.setAttribute('data-upgrade', 'flower4');
      div.style.background = '#ffe6f0';
      div.style.border = '6px solid #ff69b4';
      div.style.borderRadius = '50%';
      div.style.width = '110px';
      div.style.height = '110px';
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.boxShadow = '0 2px 12px #0006';
      div.style.cursor = 'pointer';
      div.style.position = 'relative';
      div.innerHTML = `
        <img src="assets/icons/flower upgrade 4.png" style="width:54px; height:54px; margin-bottom:0.2em;">
        <div class="terrarium-upgrade-level" style="font-size:1.1em; color:#333; font-weight:bold;">0</div>
        <div style="position:absolute; bottom:-2.2em; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:0.2em;">
          <img src="assets/icons/flower.png" style="width:20px; height:20px;">
          <span style="color:#e33; font-weight:bold; font-size:1.1em;">1e13</span>
        </div>
      `;
      flowerRow.appendChild(div);
      flowerUpgrade4Card = div;
    }
    flowerUpgrade4Card.style.display = 'flex';
    flowerUpgrade4Card.onclick = function(e) {
      updateFlowerUpgrade4Modal();
      const modal = document.getElementById('flowerUpgrade4Modal');
      if (modal) modal.style.display = 'flex';
      e.stopPropagation();
    };
    flowerUpgrade4Card.oncontextmenu = function(e) {
      if (canBuyFlowerUpgrade4()) {
        buyFlowerUpgrade4(1); 
      }
      e.preventDefault();
      e.stopPropagation();
    };
    updateFlowerUpgrade4CircleCost();
  }
  const nextUnlock = document.getElementById('terrariumFlowerNextUnlock');
  if (nextUnlock) {
    if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 30) {
      nextUnlock.textContent = 'Next upgrade unlocks at level 75 (wip)';
    } else if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 10) {
      nextUnlock.textContent = 'Next upgrade unlocks at level 30';
    } else if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 3) {
      nextUnlock.textContent = 'Next upgrade unlocks at level 10';
    } else {
      nextUnlock.textContent = 'Next upgrade unlocks at level 3';
    }
  }
}

const origSetupTerrariumSubTabButtons2 = setupTerrariumSubTabButtons;

setupTerrariumSubTabButtons = function() {
  origSetupTerrariumSubTabButtons2();
  if (typeof window.forceSyncFlowerUpgrade4 === 'function') {
    window.forceSyncFlowerUpgrade4();
  }
  updateTerrariumUpgradeCurrencyCounts();
  updatePollenUpgradeRow();
  updateFlowerUpgradeRow();
  updateNectarUpgradeSection();
  updateFlowerUpgrade4CircleCost();
  const kpNectarCard = document.getElementById('nectar-upgrade-1');
  if (kpNectarCard) {
    kpNectarCard.onclick = function() {
      updateKpNectarUpgradeModal();
      const modal = document.getElementById('kpNectarUpgradeModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
      }
    };
    kpNectarCard.oncontextmenu = function(e) {
      handlePollenUpgradeRightClick('nectar1', e);
    };
  }
  const pollenFlowerNectarCard = document.getElementById('nectar-upgrade-2');
  if (pollenFlowerNectarCard) {
    pollenFlowerNectarCard.onclick = function() {
      updatePollenFlowerNectarUpgradeModal();
      const modal = document.getElementById('pollenFlowerNectarUpgradeModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
      }
    };
    pollenFlowerNectarCard.oncontextmenu = function(e) {
      handlePollenUpgradeRightClick('nectar2', e);
    };
  }
  const nectarXpCard = document.getElementById('nectar-upgrade-3');
  if (nectarXpCard) {
    nectarXpCard.onclick = function() {
      updateNectarXpUpgradeModal();
      const modal = document.getElementById('nectarXpUpgradeModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
      }
    };
    nectarXpCard.oncontextmenu = function(e) {
      handlePollenUpgradeRightClick('nectar3', e);
    };
  }
  const nectarValueCard = document.getElementById('nectar-upgrade-4');
  if (nectarValueCard) {
    nectarValueCard.onclick = function() {
      updateNectarValueUpgradeModal();
      const modal = document.getElementById('nectarValueUpgradeModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
      }
    };
    nectarValueCard.oncontextmenu = function(e) {
      handlePollenUpgradeRightClick('nectar4', e);
    };
  }
};

const origRenderTerrariumUI2 = renderTerrariumUI;

renderTerrariumUI = function() {
  origRenderTerrariumUI2();
  if (typeof window.forceSyncFlowerUpgrade4 === 'function') {
    window.forceSyncFlowerUpgrade4();
  }
  updateTerrariumUpgradeCurrencyCounts();
  updatePollenUpgradeRow();
  updateFlowerUpgradeRow();
  updateNectarUpgradeSection();
  updateFlowerUpgrade4CircleCost();
};

let pollenValueUpgradeLevel = 0;
let pollenValueUpgrade2Level = 0;
const POLLEN_VALUE_UPGRADE_CAP = 1000;
const POLLEN_VALUE_UPGRADE2_CAP = 1000;

function getPollenValueUpgradeCost(level) {
  return Math.ceil(15 * Math.pow(1.3, level));
}

function getPollenValueUpgradeEffect(level) {
  let base = 0.5 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function getFlowerUpgrade3Cost(level) {
  return Math.ceil(1000 * Math.pow(1.5, level));
}

function getFlowerUpgrade3Effect(level) {
  return Math.pow(1.2, level);
}

function getFlowerUpgrade3CostToNext25(level) {
  const nextTarget = Math.min(POLLEN_VALUE_UPGRADE2_CAP, level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getFlowerUpgrade3Cost(l);
  }
  return total;
}

function getPollenValueUpgradeCostToNext25(level) {
  const nextTarget = Math.min(POLLEN_VALUE_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getPollenValueUpgradeCost(l);
  }
  return total;
}

function updatePollenUpgradeModal() {
  const lvl = pollenValueUpgradeLevel;
  const cap = POLLEN_VALUE_UPGRADE_CAP;
  document.getElementById('pollenUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('pollenUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${getPollenValueUpgradeEffect(lvl).toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const cost = getPollenValueUpgradeCost(lvl);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = document.getElementById('pollenUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('pollenUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getPollenValueUpgradeCostToNext25(lvl);
  let canAfford25 = typeof terrariumPollen !== 'undefined' && terrariumPollen >= next25;
  let next25Div = document.getElementById('pollenUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'pollenUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/pollen.png' style='width:20px;vertical-align:middle;'>`;
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen1"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function updateFlowerUpgrade3Modal() {
  const lvl = pollenValueUpgrade2Level;
  const cap = POLLEN_VALUE_UPGRADE2_CAP;
  document.getElementById('pollenUpgrade2Level').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('pollenUpgrade2Effect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${getFlowerUpgrade3Effect(lvl).toLocaleString(undefined, {maximumFractionDigits:2})}</span> pollen & flowers`;
  const cost = getFlowerUpgrade3Cost(lvl);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = document.getElementById('pollenUpgrade2CostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('pollenUpgrade2Cost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getFlowerUpgrade3CostToNext25(lvl);
  let canAfford25 = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= next25;
  let next25Div = document.getElementById('pollenUpgrade2CostNext25');
  if (next25Div) {
    next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/flower.png' style='width:20px;vertical-align:middle;'>`;
  }
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower3"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function updateFlowerUpgrade3CircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower3"]');
  if (!card) return;
  const cost = getFlowerUpgrade3Cost(pollenValueUpgrade2Level);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = pollenValueUpgrade2Level >= POLLEN_VALUE_UPGRADE2_CAP ? 'maxed' : pollenValueUpgrade2Level;
  }
}

function canBuyPollenValueUpgrade() {
  return typeof terrariumPollen !== 'undefined' && terrariumPollen >= getPollenValueUpgradeCost(pollenValueUpgradeLevel) && pollenValueUpgradeLevel < POLLEN_VALUE_UPGRADE_CAP;
}

function buyPollenValueUpgrade(count) {
  if (pollenValueUpgradeLevel >= POLLEN_VALUE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && pollenValueUpgradeLevel < POLLEN_VALUE_UPGRADE_CAP) {
    const cost = getPollenValueUpgradeCost(pollenValueUpgradeLevel);
    if (terrariumPollen >= cost) {
      terrariumPollen -= cost;
      pollenValueUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  if (bought > 0 && typeof window.trackUpgrade === 'function') {
    for (let i = 0; i < bought; i++) {
      window.trackUpgrade();
    }
  }
  window.terrariumPollen = terrariumPollen;
  updatePollenUpgradeModal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxPollenValueUpgrade() {
  let count = 0;
  let lvl = pollenValueUpgradeLevel;
  let pollen = terrariumPollen;
  while (lvl < POLLEN_VALUE_UPGRADE_CAP) {
    const cost = getPollenValueUpgradeCost(lvl);
    if (pollen >= cost) {
      pollen -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyPollenValueUpgrade(count);
  }
}

function canBuyFlowerUpgrade3() {
  return typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= getFlowerUpgrade3Cost(pollenValueUpgrade2Level) && pollenValueUpgrade2Level < POLLEN_VALUE_UPGRADE2_CAP;
}

function buyFlowerUpgrade3(count) {
  if (pollenValueUpgrade2Level >= POLLEN_VALUE_UPGRADE2_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && pollenValueUpgrade2Level < POLLEN_VALUE_UPGRADE2_CAP) {
    const cost = getFlowerUpgrade3Cost(pollenValueUpgrade2Level);
    if (terrariumFlowers >= cost) {
      terrariumFlowers -= cost;
      pollenValueUpgrade2Level++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumFlowers = terrariumFlowers;
  window.terrariumPollenValueUpgrade2Level = pollenValueUpgrade2Level;
  updateFlowerUpgrade3Modal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxFlowerUpgrade3() {
  let count = 0;
  let lvl = pollenValueUpgrade2Level;
  let flowers = terrariumFlowers;
  while (lvl < POLLEN_VALUE_UPGRADE2_CAP) {
    const cost = getFlowerUpgrade3Cost(lvl);
    if (flowers >= cost) {
      flowers -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyFlowerUpgrade3(count);
  }
}

(function() {

  function showPollenUpgradeModal() {
    updatePollenUpgradeModal();
    const modal = document.getElementById('pollenUpgradeModal');
    if (modal) modal.style.display = 'flex';
  }

  function hidePollenUpgradeModal() {
    const modal = document.getElementById('pollenUpgradeModal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const pollenCard = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen1"]');
    if (pollenCard) {
      pollenCard.addEventListener('click', function(e) {
        showPollenUpgradeModal();
      e.stopPropagation();
      });
      pollenCard.addEventListener('contextmenu', function(e) {
        handlePollenUpgradeRightClick('pollen1', e);
      });
    }
    const cancelBtn = document.getElementById('pollenUpgradeCancelBtn');
    if (cancelBtn) cancelBtn.onclick = hidePollenUpgradeModal;
    const buyOneBtn = document.getElementById('pollenUpgradeBuyOneBtn');
    if (buyOneBtn) buyOneBtn.onclick = function() {
      if (canBuyPollenValueUpgrade()) {
        buyPollenValueUpgrade(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyMaxBtn = document.getElementById('pollenUpgradeBuyMaxBtn');
    if (buyMaxBtn) buyMaxBtn.onclick = function() {
      if (canBuyPollenValueUpgrade()) {
        buyMaxPollenValueUpgrade();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyNextBtn = document.getElementById('pollenUpgradeBuyNextBtn');
    if (buyNextBtn) buyNextBtn.onclick = function() {
      const lvl = pollenValueUpgradeLevel;
      const nextTarget = Math.min(POLLEN_VALUE_UPGRADE_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyPollenValueUpgrade()) {
        buyPollenValueUpgrade(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal = document.getElementById('pollenUpgradeModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hidePollenUpgradeModal();
      });
    }
    const flower3Card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower3"]');
    if (flower3Card) {
      flower3Card.addEventListener('click', function(e) {
        updateFlowerUpgrade3Modal();
        const modal = document.getElementById('pollenUpgrade2Modal');
        if (modal) modal.style.display = 'flex';
        e.stopPropagation();
      });
    }
    const cancel2Btn = document.getElementById('pollenUpgrade2CancelBtn');
    if (cancel2Btn) cancel2Btn.onclick = function() {
      const modal = document.getElementById('pollenUpgrade2Modal');
      if (modal) modal.style.display = 'none';
    };
    const buyOne2Btn = document.getElementById('pollenUpgrade2BuyOneBtn');
    if (buyOne2Btn) buyOne2Btn.onclick = function() {
      if (canBuyFlowerUpgrade3()) {
        buyFlowerUpgrade3(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyMax2Btn = document.getElementById('pollenUpgrade2BuyMaxBtn');
    if (buyMax2Btn) buyMax2Btn.onclick = function() {
      if (canBuyFlowerUpgrade3()) {
        buyMaxFlowerUpgrade3();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyNext2Btn = document.getElementById('pollenUpgrade2BuyNextBtn');
    if (buyNext2Btn) buyNext2Btn.onclick = function() {
      const lvl = pollenValueUpgrade2Level;
      const nextTarget = Math.min(POLLEN_VALUE_UPGRADE2_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyFlowerUpgrade3()) {
        buyFlowerUpgrade3(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal2 = document.getElementById('pollenUpgrade2Modal');
    if (modal2) {
      modal2.addEventListener('click', function(e) {
        if (e.target === modal2) {
          modal2.style.display = 'none';
        }
      });
    }
    const cancel3Btn = document.getElementById('pollenUpgrade2CancelBtn');
    if (cancel3Btn) cancel3Btn.onclick = function() {
      const modal = document.getElementById('pollenUpgrade2Modal');
      if (modal) modal.style.display = 'none';
    };
    const buyOne3Btn = document.getElementById('pollenUpgrade2BuyOneBtn');
    if (buyOne3Btn) buyOne3Btn.onclick = function() {
      if (canBuyFlowerUpgrade3()) buyFlowerUpgrade3(1);
    };
    const buyMax3Btn = document.getElementById('pollenUpgrade2BuyMaxBtn');
    if (buyMax3Btn) buyMax3Btn.onclick = function() {
      buyMaxFlowerUpgrade3();
    };
    const buyNext3Btn = document.getElementById('pollenUpgrade2BuyNextBtn');
    if (buyNext3Btn) buyNext3Btn.onclick = function() {
      const lvl = pollenValueUpgrade2Level;
      const nextTarget = Math.min(POLLEN_VALUE_UPGRADE2_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyFlowerUpgrade3()) buyFlowerUpgrade3(toBuy);
    };
  });
})();
if (typeof window.terrariumPollenValueUpgradeLevel === 'number') {
  pollenValueUpgradeLevel = window.terrariumPollenValueUpgradeLevel;
}

function updatePollenUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen1"]');
  if (!card) return;
  const cost = getPollenValueUpgradeCost(pollenValueUpgradeLevel);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = pollenValueUpgradeLevel;
  }
}

const origUpdatePollenUpgradeModal = updatePollenUpgradeModal;

updatePollenUpgradeModal = function() {
  origUpdatePollenUpgradeModal();
  updatePollenUpgradeCircleCost();
};

const origBuyPollenValueUpgrade = buyPollenValueUpgrade;

buyPollenValueUpgrade = function(count) {
  origBuyPollenValueUpgrade(count);
  window.terrariumPollenValueUpgradeLevel = pollenValueUpgradeLevel;
};

const origBuyMaxPollenValueUpgrade = buyMaxPollenValueUpgrade;

buyMaxPollenValueUpgrade = function() {
  origBuyMaxPollenValueUpgrade();
  window.terrariumPollenValueUpgradeLevel = pollenValueUpgradeLevel;
};

const origUpdateTerrariumUpgradeCurrencyCounts = updateTerrariumUpgradeCurrencyCounts;

updateTerrariumUpgradeCurrencyCounts = function() {
  origUpdateTerrariumUpgradeCurrencyCounts();
  updatePollenUpgradeCircleCost();
};

let flowerValueUpgradeLevel = 0;
const FLOWER_VALUE_UPGRADE_CAP = 1000;

function getFlowerValueUpgradeCost(level) {
  return Math.ceil(20 * Math.pow(1.35, level));
}

function getFlowerValueUpgradeEffect(level) {
  let base = 0.25 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function getFlowerValueUpgradeCostToNext25(level) {
  const nextTarget = Math.min(FLOWER_VALUE_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getFlowerValueUpgradeCost(l);
  }
  return total;
}

function updateFlowerUpgradeModal() {
  const lvl = flowerValueUpgradeLevel;
  const cap = FLOWER_VALUE_UPGRADE_CAP;
  document.getElementById('flowerUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerUpgradeEffect').innerHTML = `Effect: <span style=\"color:#f0f;\">x${getFlowerValueUpgradeEffect(lvl).toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const cost = getFlowerValueUpgradeCost(lvl);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = document.getElementById('flowerUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getFlowerValueUpgradeCostToNext25(lvl);
  let canAfford25 = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= next25;
  let next25Div = document.getElementById('flowerUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'flowerUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/flower.png' style='width:20px;vertical-align:middle;'>`;
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower1"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function canBuyFlowerValueUpgrade() {
  return typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= getFlowerValueUpgradeCost(flowerValueUpgradeLevel) && flowerValueUpgradeLevel < FLOWER_VALUE_UPGRADE_CAP;
}

function buyFlowerValueUpgrade(count) {
  if (flowerValueUpgradeLevel >= FLOWER_VALUE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && flowerValueUpgradeLevel < FLOWER_VALUE_UPGRADE_CAP) {
    const cost = getFlowerValueUpgradeCost(flowerValueUpgradeLevel);
    if (terrariumFlowers >= cost) {
      terrariumFlowers -= cost;
      flowerValueUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumFlowers = terrariumFlowers;
  updateFlowerUpgradeModal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxFlowerValueUpgrade() {
  let count = 0;
  let lvl = flowerValueUpgradeLevel;
  let flowers = terrariumFlowers;
  while (lvl < FLOWER_VALUE_UPGRADE_CAP) {
    const cost = getFlowerValueUpgradeCost(lvl);
    if (flowers >= cost) {
      flowers -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyFlowerValueUpgrade(count);
  }
}

(function() {

  function showFlowerUpgradeModal() {
    updateFlowerUpgradeModal();
    const modal = document.getElementById('flowerUpgradeModal');
    if (modal) modal.style.display = 'flex';
  }

  function hideFlowerUpgradeModal() {
    const modal = document.getElementById('flowerUpgradeModal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const flowerCard = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower1"]');
    if (flowerCard) {
      flowerCard.addEventListener('click', function(e) {
        showFlowerUpgradeModal();
        e.stopPropagation();
      });
      flowerCard.addEventListener('contextmenu', function(e) {
        if (canBuyFlowerValueUpgrade()) {
          buyMaxFlowerValueUpgrade();
        }
        e.preventDefault();
        e.stopPropagation();
      });
    }
    const cancelBtn = document.getElementById('flowerUpgradeCancelBtn');
    if (cancelBtn) cancelBtn.onclick = hideFlowerUpgradeModal;
    const buyOneBtn = document.getElementById('flowerUpgradeBuyOneBtn');
    if (buyOneBtn) buyOneBtn.onclick = function() {
      if (canBuyFlowerValueUpgrade()) {
        buyFlowerValueUpgrade(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyMaxBtn = document.getElementById('flowerUpgradeBuyMaxBtn');
    if (buyMaxBtn) buyMaxBtn.onclick = function() {
      if (canBuyFlowerValueUpgrade()) {
        buyMaxFlowerValueUpgrade();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyNextBtn = document.getElementById('flowerUpgradeBuyNextBtn');
    if (buyNextBtn) buyNextBtn.onclick = function() {
      const lvl = flowerValueUpgradeLevel;
      const nextTarget = Math.min(FLOWER_VALUE_UPGRADE_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyFlowerValueUpgrade()) {
        buyFlowerValueUpgrade(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal = document.getElementById('flowerUpgradeModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hideFlowerUpgradeModal();
      });
    }
    const flower4Card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower4"]');
    if (flower4Card) {
      flower4Card.addEventListener('click', function(e) {
        updateFlowerUpgrade4Modal();
        const modal = document.getElementById('flowerUpgrade4Modal');
        if (modal) modal.style.display = 'flex';
        e.stopPropagation();
      });
      flower4Card.addEventListener('contextmenu', function(e) {
        if (canBuyFlowerUpgrade4()) {
          buyFlowerUpgrade4(1); 
        }
        e.preventDefault();
        e.stopPropagation();
      });
    }
    const cancel4Btn = document.getElementById('flowerUpgrade4CancelBtn');
    if (cancel4Btn) cancel4Btn.onclick = function() {
      const modal = document.getElementById('flowerUpgrade4Modal');
      if (modal) modal.style.display = 'none';
    };
    const buyOne4Btn = document.getElementById('flowerUpgrade4BuyOneBtn');
    if (buyOne4Btn) buyOne4Btn.onclick = function() {
      if (canBuyFlowerUpgrade4()) {
        buyFlowerUpgrade4(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal4 = document.getElementById('flowerUpgrade4Modal');
    if (modal4) {
      modal4.addEventListener('click', function(e) {
        if (e.target === modal4) {
          modal4.style.display = 'none';
        }
      });
    }
  });
})();
if (typeof window.terrariumFlowerValueUpgradeLevel === 'number') {
  flowerValueUpgradeLevel = window.terrariumFlowerValueUpgradeLevel;
}

function updateFlowerUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower1"]');
  if (!card) return;
  const cost = getFlowerValueUpgradeCost(flowerValueUpgradeLevel);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = flowerValueUpgradeLevel >= FLOWER_VALUE_UPGRADE_CAP ? 'maxed' : flowerValueUpgradeLevel;
  }
}

const origUpdateFlowerUpgradeModal = updateFlowerUpgradeModal;

updateFlowerUpgradeModal = function() {
  origUpdateFlowerUpgradeModal();
  updateFlowerUpgradeCircleCost();
};

const origBuyFlowerValueUpgrade = buyFlowerValueUpgrade;

buyFlowerValueUpgrade = function(count) {
  origBuyFlowerValueUpgrade(count);
  window.terrariumFlowerValueUpgradeLevel = flowerValueUpgradeLevel;
};

const origBuyMaxFlowerValueUpgrade = buyMaxFlowerValueUpgrade;

buyMaxFlowerValueUpgrade = function() {
  origBuyMaxFlowerValueUpgrade();
  window.terrariumFlowerValueUpgradeLevel = flowerValueUpgradeLevel;
};

const origUpdateTerrariumUpgradeCurrencyCounts2 = updateTerrariumUpgradeCurrencyCounts;

updateTerrariumUpgradeCurrencyCounts = function() {
  origUpdateTerrariumUpgradeCurrencyCounts2();
  updateFlowerUpgradeCircleCost();
  updateFlowerUpgrade4CircleCost();
};

function syncTerrariumUpgradeVarsFromWindow() {
  if (typeof window.terrariumPollenValueUpgradeLevel === 'number') {
    pollenValueUpgradeLevel = window.terrariumPollenValueUpgradeLevel;
  }
  if (typeof window.terrariumPollenValueUpgrade2Level === 'number') {
    pollenValueUpgrade2Level = window.terrariumPollenValueUpgrade2Level;
  }
  if (typeof window.terrariumFlowerValueUpgradeLevel === 'number') {
    flowerValueUpgradeLevel = window.terrariumFlowerValueUpgradeLevel;
  }
  if (typeof window.terrariumPollenToolSpeedUpgradeLevel === 'number') {
    pollenToolSpeedUpgradeLevel = window.terrariumPollenToolSpeedUpgradeLevel;
  }
  if (typeof window.terrariumFlowerXPUpgradeLevel === 'number') {
    flowerXPUpgradeLevel = window.terrariumFlowerXPUpgradeLevel;
  }
  if (typeof window.terrariumExtraChargeUpgradeLevel === 'number') {
    extraChargeUpgradeLevel = window.terrariumExtraChargeUpgradeLevel;
  }
  if (typeof window.terrariumXpMultiplierUpgradeLevel === 'number') {
    xpMultiplierUpgradeLevel = window.terrariumXpMultiplierUpgradeLevel;
  }
  if (typeof window.terrariumFlowerUpgrade4Level === 'number') {
    flowerUpgrade4Level = window.terrariumFlowerUpgrade4Level;
  }
  kpNectarUpgradeLevel = (typeof window.terrariumKpNectarUpgradeLevel === 'number') ? window.terrariumKpNectarUpgradeLevel : 0;
  pollenFlowerNectarUpgradeLevel = (typeof window.terrariumPollenFlowerNectarUpgradeLevel === 'number') ? window.terrariumPollenFlowerNectarUpgradeLevel : 0;
  nectarXpUpgradeLevel = (typeof window.terrariumNectarXpUpgradeLevel === 'number') ? window.terrariumNectarXpUpgradeLevel : 0;
  nectarValueUpgradeLevel = (typeof window.terrariumNectarValueUpgradeLevel === 'number') ? window.terrariumNectarValueUpgradeLevel : 0;
}

window.syncTerrariumUpgradeVarsFromWindow = syncTerrariumUpgradeVarsFromWindow;

function forceSyncFlowerUpgrade4() {
  if (typeof window.terrariumFlowerUpgrade4Level === 'number') {
    flowerUpgrade4Level = window.terrariumFlowerUpgrade4Level;
  }
}

forceSyncFlowerUpgrade4();
window.forceSyncFlowerUpgrade4 = forceSyncFlowerUpgrade4;
setInterval(() => {
  if (typeof window.terrariumFlowerUpgrade4Level === 'number' && window.terrariumFlowerUpgrade4Level !== flowerUpgrade4Level) {
    flowerUpgrade4Level = window.terrariumFlowerUpgrade4Level;
  }
}, 2000); 
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && typeof window.forceSyncFlowerUpgrade4 === 'function') {
    window.forceSyncFlowerUpgrade4();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof window.forceSyncFlowerUpgrade4 === 'function') {
      window.forceSyncFlowerUpgrade4();
    }
  }, 100);
});
window.addEventListener('load', () => {
  setTimeout(() => {
    if (typeof window.forceSyncFlowerUpgrade4 === 'function') {
      window.forceSyncFlowerUpgrade4();
    }
  }, 500);
});

function animatePollenWandCursor() {
  document.body.classList.add('pollen-wand-anim');
  setTimeout(() => {
    document.body.classList.remove('pollen-wand-anim');
  }, 300);
}

function animateWateringCanCursor() {
  document.body.classList.add('watering-can-anim');
  setTimeout(() => {
    document.body.classList.remove('watering-can-anim');
  }, 300);
}

function animateFluzzerPollenWandCursor() {
  if (fluzzerAICursor) {
    fluzzerAICursor.style.background = "url('assets/icons/pollen wand action.png') no-repeat center";
    fluzzerAICursor.style.backgroundSize = "contain";
    setTimeout(() => {
      fluzzerAICursor.style.background = "url('assets/icons/pollen wand.png') no-repeat center";
      fluzzerAICursor.style.backgroundSize = "contain";
    }, 300);
  }
}

function animateFluzzerWateringCanCursor() {
  if (fluzzerAICursor) {
    fluzzerAICursor.style.background = "url('assets/icons/watering action.png') no-repeat center";
    fluzzerAICursor.style.backgroundSize = "contain";
    setTimeout(() => {
      fluzzerAICursor.style.background = "url('assets/icons/watering tool.png') no-repeat center";
      fluzzerAICursor.style.backgroundSize = "contain";
    }, 300);
  }
}

const origHandlePollenWandClick2 = handlePollenWandClick;

handlePollenWandClick = function(index, cols, rows) {
  animatePollenWandCursor();
  origHandlePollenWandClick2(index, cols, rows);
};

const origHandleFluzzerPollenWandClick2 = handleFluzzerPollenWandClick;

handleFluzzerPollenWandClick = function(index, cols, rows) {
  origHandleFluzzerPollenWandClick2(index, cols, rows);
};

window.handlePollenWandClick = handlePollenWandClick;
window.handleFluzzerPollenWandClick = handleFluzzerPollenWandClick;
const origHandleFluzzerWateringCanClick = handleFluzzerWateringCanClick;

handleFluzzerWateringCanClick = function(index, cols, rows) {
  animateWateringCanCursor();
  origHandleFluzzerWateringCanClick(index, cols, rows);
};

let extraChargeUpgradeLevel = 0;
const EXTRA_CHARGE_UPGRADE_CAP = 1000;
const EXTRA_CHARGE_UPGRADE_BASE_COST = 2000;
const EXTRA_CHARGE_UPGRADE_COST_MULT = 1.3;
let xpMultiplierUpgradeLevel = 0;
const XP_MULTIPLIER_UPGRADE_CAP = 1000;
const XP_MULTIPLIER_UPGRADE_BASE_COST = 1e9;
const XP_MULTIPLIER_UPGRADE_COST_MULT = 1.5;
if (typeof window.terrariumExtraChargeUpgradeLevel === 'number') {
  extraChargeUpgradeLevel = window.terrariumExtraChargeUpgradeLevel;
}
if (typeof window.terrariumXpMultiplierUpgradeLevel === 'number') {
  xpMultiplierUpgradeLevel = window.terrariumXpMultiplierUpgradeLevel;
}

function updateExtraChargeUpgradeModal() {
  const modal = document.getElementById('extraChargeUpgradeModal');
  if (!modal) return;
  const currentCost = getExtraChargeUpgradeCost(extraChargeUpgradeLevel);
  const currentEffect = getExtraChargeUpgradeEffect(extraChargeUpgradeLevel);
  const nextEffect = getExtraChargeUpgradeEffect(extraChargeUpgradeLevel + 1);
  const costTo25 = getExtraChargeUpgradeCostToNext25(extraChargeUpgradeLevel);
  const levelText = document.getElementById('extraChargeUpgradeLevelText');
  const costText = document.getElementById('extraChargeUpgradeCostText');
  const effectText = document.getElementById('extraChargeUpgradeEffectText');
  const costTo25Text = document.getElementById('extraChargeUpgradeCostTo25Text');
  const buyButton = document.getElementById('extraChargeUpgradeBuy');
  const buyTo25Button = document.getElementById('extraChargeUpgradeBuyTo25');
  if (levelText) levelText.textContent = `Level ${extraChargeUpgradeLevel}`;
  if (costText) costText.textContent = `Cost: ${currentCost.toLocaleString()} pollen`;
  if (effectText) effectText.textContent = `Current: +${currentEffect}% charge gain\nNext: +${nextEffect}% charge gain`;
  if (costTo25Text) costTo25Text.textContent = `Cost to next x2: ${costTo25.toLocaleString()} pollen`;
  if (buyButton) {
    buyButton.disabled = currentCost > pollen;
    buyButton.onclick = function() {
      if (pollen >= currentCost) {
        pollen -= currentCost;
        extraChargeUpgradeLevel++;
        window.terrariumExtraChargeUpgradeLevel = extraChargeUpgradeLevel;
        updateExtraChargeUpgradeModal();
        updateDisplay();
      }
    };
  }
  if (buyTo25Button) {
    buyTo25Button.disabled = costTo25 > pollen;
    buyTo25Button.onclick = function() {
      if (pollen >= costTo25) {
        pollen -= costTo25;
        while (extraChargeUpgradeLevel % 25 !== 0) {
          extraChargeUpgradeLevel++;
        }
        window.terrariumExtraChargeUpgradeLevel = extraChargeUpgradeLevel;
        updateExtraChargeUpgradeModal();
        updateDisplay();
      }
    };
  }
}

function getExtraChargeUpgradeCost(level) {
  return Math.ceil(EXTRA_CHARGE_UPGRADE_BASE_COST * Math.pow(EXTRA_CHARGE_UPGRADE_COST_MULT, level));
}

function getExtraChargeUpgradeEffect(level) {
  let base = 0.2 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function getExtraChargeUpgradeCostToNext25(level) {
  const nextTarget = Math.min(EXTRA_CHARGE_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getExtraChargeUpgradeCost(l);
  }
  return total;
}

function updateExtraChargeUpgradeModal() {
  const lvl = extraChargeUpgradeLevel;
  const cap = EXTRA_CHARGE_UPGRADE_CAP;
  document.getElementById('extraChargeUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('extraChargeUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${getExtraChargeUpgradeEffect(lvl).toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const cost = getExtraChargeUpgradeCost(lvl);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = document.getElementById('extraChargeUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('extraChargeUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getExtraChargeUpgradeCostToNext25(lvl);
  let canAfford25 = typeof terrariumPollen !== 'undefined' && terrariumPollen >= next25;
  let next25Div = document.getElementById('extraChargeUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'extraChargeUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/pollen.png' style='width:20px;vertical-align:middle;'>`;
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen3"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function canBuyExtraChargeUpgrade() {
  return typeof terrariumPollen !== 'undefined' && terrariumPollen >= getExtraChargeUpgradeCost(extraChargeUpgradeLevel) && extraChargeUpgradeLevel < EXTRA_CHARGE_UPGRADE_CAP;
}

function buyExtraChargeUpgrade(count) {
  if (extraChargeUpgradeLevel >= EXTRA_CHARGE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && extraChargeUpgradeLevel < EXTRA_CHARGE_UPGRADE_CAP) {
    const cost = getExtraChargeUpgradeCost(extraChargeUpgradeLevel);
    if (terrariumPollen >= cost) {
      terrariumPollen -= cost;
      extraChargeUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumPollen = terrariumPollen;
  window.terrariumExtraChargeUpgradeLevel = extraChargeUpgradeLevel;
  updateExtraChargeUpgradeModal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxExtraChargeUpgrade() {
  let count = 0;
  let lvl = extraChargeUpgradeLevel;
  let pollen = terrariumPollen;
  while (lvl < EXTRA_CHARGE_UPGRADE_CAP) {
    const cost = getExtraChargeUpgradeCost(lvl);
    if (pollen >= cost) {
      pollen -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyExtraChargeUpgrade(count);
  }
}

(function() {

  function showExtraChargeUpgradeModal() {
    updateExtraChargeUpgradeModal();
    const modal = document.getElementById('extraChargeUpgradeModal');
    if (modal) modal.style.display = 'flex';
  }

  function hideExtraChargeUpgradeModal() {
    const modal = document.getElementById('extraChargeUpgradeModal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const upgradeCard = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen3"]');
    if (upgradeCard) {
      upgradeCard.addEventListener('click', function(e) {
        showExtraChargeUpgradeModal();
        e.stopPropagation();
      });
      upgradeCard.addEventListener('contextmenu', function(e) {
        handlePollenUpgradeRightClick('pollen3', e);
      });
    }
    const cancelBtn = document.getElementById('extraChargeUpgradeCancelBtn');
    if (cancelBtn) cancelBtn.onclick = hideExtraChargeUpgradeModal;
    const buyOneBtn = document.getElementById('extraChargeUpgradeBuyOneBtn');
    if (buyOneBtn) buyOneBtn.onclick = function() {
      if (canBuyExtraChargeUpgrade()) {
        buyExtraChargeUpgrade(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyMaxBtn = document.getElementById('extraChargeUpgradeBuyMaxBtn');
    if (buyMaxBtn) buyMaxBtn.onclick = function() {
      if (canBuyExtraChargeUpgrade()) {
        buyMaxExtraChargeUpgrade();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyNextBtn = document.getElementById('extraChargeUpgradeBuyNextBtn');
    if (buyNextBtn) buyNextBtn.onclick = function() {
      const lvl = extraChargeUpgradeLevel;
      const nextTarget = Math.min(EXTRA_CHARGE_UPGRADE_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyExtraChargeUpgrade()) {
        buyExtraChargeUpgrade(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal = document.getElementById('extraChargeUpgradeModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hideExtraChargeUpgradeModal();
      });
    }
    const xpMultiplierCard = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen4"]');
    if (xpMultiplierCard) {
      xpMultiplierCard.addEventListener('click', function(e) {
        updateXpMultiplierUpgradeModal();
        const modal = document.getElementById('xpMultiplierUpgradeModal');
        if (modal) modal.style.display = 'flex';
        e.stopPropagation();
      });
      xpMultiplierCard.addEventListener('contextmenu', function(e) {
        handlePollenUpgradeRightClick('pollen4', e);
      });
    }
    const xpMultiplierCancelBtn = document.getElementById('xpMultiplierUpgradeCancelBtn');
    if (xpMultiplierCancelBtn) xpMultiplierCancelBtn.onclick = function() {
      const modal = document.getElementById('xpMultiplierUpgradeModal');
      if (modal) modal.style.display = 'none';
    };
    const xpMultiplierBuyOneBtn = document.getElementById('xpMultiplierUpgradeBuyOneBtn');
    if (xpMultiplierBuyOneBtn) xpMultiplierBuyOneBtn.onclick = function() {
      if (canBuyXpMultiplierUpgrade()) {
        buyXpMultiplierUpgrade(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const xpMultiplierBuyMaxBtn = document.getElementById('xpMultiplierUpgradeBuyMaxBtn');
    if (xpMultiplierBuyMaxBtn) xpMultiplierBuyMaxBtn.onclick = function() {
      if (canBuyXpMultiplierUpgrade()) {
        buyMaxXpMultiplierUpgrade();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const xpMultiplierBuyNextBtn = document.getElementById('xpMultiplierUpgradeBuyNextBtn');
    if (xpMultiplierBuyNextBtn) xpMultiplierBuyNextBtn.onclick = function() {
      const lvl = xpMultiplierUpgradeLevel;
      const nextTarget = Math.min(XP_MULTIPLIER_UPGRADE_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyXpMultiplierUpgrade()) {
        buyXpMultiplierUpgrade(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const xpMultiplierModal = document.getElementById('xpMultiplierUpgradeModal');
    if (xpMultiplierModal) {
      xpMultiplierModal.addEventListener('click', function(e) {
        if (e.target === xpMultiplierModal) {
          xpMultiplierModal.style.display = 'none';
        }
      });
    }
  });
})();

function updateExtraChargeUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen3"]');
  if (!card) return;
  const cost = getExtraChargeUpgradeCost(extraChargeUpgradeLevel);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = extraChargeUpgradeLevel >= EXTRA_CHARGE_UPGRADE_CAP ? 'maxed' : extraChargeUpgradeLevel;
  }
}

function getXpMultiplierUpgradeCost(level) {
  return Math.ceil(XP_MULTIPLIER_UPGRADE_BASE_COST * Math.pow(XP_MULTIPLIER_UPGRADE_COST_MULT, level));
}

function getXpMultiplierUpgradeEffect(level) {
  return Math.pow(1.1, level);
}

function getXpMultiplierUpgradeCostToNext25(level) {
  const nextTarget = Math.min(XP_MULTIPLIER_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getXpMultiplierUpgradeCost(l);
  }
  return total;
}

function updateXpMultiplierUpgradeModal() {
  const lvl = xpMultiplierUpgradeLevel;
  const cap = XP_MULTIPLIER_UPGRADE_CAP;
  document.getElementById('xpMultiplierUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('xpMultiplierUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${getXpMultiplierUpgradeEffect(lvl).toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const cost = getXpMultiplierUpgradeCost(lvl);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = document.getElementById('xpMultiplierUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('xpMultiplierUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getXpMultiplierUpgradeCostToNext25(lvl);
  let canAfford25 = typeof terrariumPollen !== 'undefined' && terrariumPollen >= next25;
  let next25Div = document.getElementById('xpMultiplierUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'xpMultiplierUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/pollen.png' style='width:20px;vertical-align:middle;'>`;
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen4"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function canBuyXpMultiplierUpgrade() {
  return typeof terrariumPollen !== 'undefined' && terrariumPollen >= getXpMultiplierUpgradeCost(xpMultiplierUpgradeLevel) && xpMultiplierUpgradeLevel < XP_MULTIPLIER_UPGRADE_CAP;
}

function buyXpMultiplierUpgrade(count) {
  if (xpMultiplierUpgradeLevel >= XP_MULTIPLIER_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && xpMultiplierUpgradeLevel < XP_MULTIPLIER_UPGRADE_CAP) {
    const cost = getXpMultiplierUpgradeCost(xpMultiplierUpgradeLevel);
    if (terrariumPollen >= cost) {
      terrariumPollen -= cost;
      xpMultiplierUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumPollen = terrariumPollen;
  window.terrariumXpMultiplierUpgradeLevel = xpMultiplierUpgradeLevel;
  updateXpMultiplierUpgradeModal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxXpMultiplierUpgrade() {
  let count = 0;
  let lvl = xpMultiplierUpgradeLevel;
  let pollen = terrariumPollen;
  while (lvl < XP_MULTIPLIER_UPGRADE_CAP) {
    const cost = getXpMultiplierUpgradeCost(lvl);
    if (pollen >= cost) {
      pollen -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyXpMultiplierUpgrade(count);
  }
}

function updateXpMultiplierUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen4"]');
  if (!card) return;
  const cost = getXpMultiplierUpgradeCost(xpMultiplierUpgradeLevel);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = xpMultiplierUpgradeLevel >= XP_MULTIPLIER_UPGRADE_CAP ? 'maxed' : xpMultiplierUpgradeLevel;
  }
}

const origUpdateTerrariumUpgradeCurrencyCounts5 = updateTerrariumUpgradeCurrencyCounts;

updateTerrariumUpgradeCurrencyCounts = function() {
  origUpdateTerrariumUpgradeCurrencyCounts5();
  updateExtraChargeUpgradeCircleCost();
  updateFlowerUpgrade3CircleCost();
  updateXpMultiplierUpgradeCircleCost();
  updateFlowerFieldExpansionUpgradeCircleCost();
};

const FLOWER_FIELD_EXPANSION_UPGRADE_CAP = 6;
const FLOWER_FIELD_EXPANSION_UPGRADE_BASE_COST = 1e35;
const FLOWER_FIELD_EXPANSION_UPGRADE_COST_MULT = 1e30; 
if (typeof window.terrariumFlowerFieldExpansionUpgradeLevel === 'number') {
  flowerFieldExpansionUpgradeLevel = window.terrariumFlowerFieldExpansionUpgradeLevel;
}

function getFlowerFieldExpansionUpgradeCost(level) {
  return FLOWER_FIELD_EXPANSION_UPGRADE_BASE_COST * Math.pow(FLOWER_FIELD_EXPANSION_UPGRADE_COST_MULT, level);
}

function getFlowerFieldExpansionUpgradeEffect(level) {
  return {
    cols: 13 + level,
    rows: 6 + level
  };
}

function updateFlowerFieldExpansionUpgradeModal() {
  const lvl = flowerFieldExpansionUpgradeLevel;
  const cap = FLOWER_FIELD_EXPANSION_UPGRADE_CAP;
  const effect = getFlowerFieldExpansionUpgradeEffect(lvl);
  document.getElementById('flowerFieldExpansionUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerFieldExpansionUpgradeEffect').innerHTML = `Grid Size: <span style="color:#0ff;">${effect.cols}x${effect.rows}</span>`;
  const cost = getFlowerFieldExpansionUpgradeCost(lvl);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost && lvl < cap;
  const costSpan = document.getElementById('flowerFieldExpansionUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerFieldExpansionUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen5"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function canBuyFlowerFieldExpansionUpgrade() {
  return typeof terrariumPollen !== 'undefined' && 
         terrariumPollen >= getFlowerFieldExpansionUpgradeCost(flowerFieldExpansionUpgradeLevel) && 
         flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP;
}

function buyFlowerFieldExpansionUpgrade(count = 1) {
  if (flowerFieldExpansionUpgradeLevel >= FLOWER_FIELD_EXPANSION_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP) {
    const cost = getFlowerFieldExpansionUpgradeCost(flowerFieldExpansionUpgradeLevel);
    if (terrariumPollen >= cost) {
      terrariumPollen -= cost;
      flowerFieldExpansionUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  if (bought > 0) {
    window.terrariumPollen = terrariumPollen;
    window.terrariumFlowerFieldExpansionUpgradeLevel = flowerFieldExpansionUpgradeLevel;
    updateFlowerFieldExpansionUpgradeModal();
    updateTerrariumUpgradeCurrencyCounts();
    if (typeof renderTerrariumUI === 'function') {
      renderTerrariumUI();
    }
  }
}

function updateFlowerFieldExpansionUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen5"]');
  if (!card) return;
  const cost = getFlowerFieldExpansionUpgradeCost(flowerFieldExpansionUpgradeLevel);
  const canAfford = typeof terrariumPollen !== 'undefined' && 
                   terrariumPollen >= cost && 
                   flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = flowerFieldExpansionUpgradeLevel >= FLOWER_FIELD_EXPANSION_UPGRADE_CAP ? 'maxed' : flowerFieldExpansionUpgradeLevel;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const cancelBtn = document.getElementById('flowerFieldExpansionUpgradeCancelBtn');
  if (cancelBtn) cancelBtn.onclick = function() {
    const modal = document.getElementById('flowerFieldExpansionUpgradeModal');
    if (modal) modal.style.display = 'none';
  };
  const buyOneBtn = document.getElementById('flowerFieldExpansionUpgradeBuyOneBtn');
  if (buyOneBtn) buyOneBtn.onclick = function() {
    if (canBuyFlowerFieldExpansionUpgrade()) {
      buyFlowerFieldExpansionUpgrade(1);
    }
  };
  const modal = document.getElementById('flowerFieldExpansionUpgradeModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});
let pollenToolSpeedUpgradeLevel = 0;
if (typeof window.terrariumPollenToolSpeedUpgradeLevel === 'number') {
  pollenToolSpeedUpgradeLevel = window.terrariumPollenToolSpeedUpgradeLevel;
}
const POLLEN_TOOL_SPEED_UPGRADE_BASE_COST = 100;
const POLLEN_TOOL_SPEED_UPGRADE_COST_MULT = 1.4;
const POLLEN_TOOL_SPEED_UPGRADE_INTERVAL_DECREASE = 0.01; 
const POLLEN_TOOL_SPEED_UPGRADE_MIN_INTERVAL = 0.05; 

function getPollenToolSpeedUpgradeCap() {
  return 95;
}

function getPollenToolSpeedUpgradeCost(level) {
  return Math.ceil(POLLEN_TOOL_SPEED_UPGRADE_BASE_COST * Math.pow(POLLEN_TOOL_SPEED_UPGRADE_COST_MULT, level));
}

function getPollenToolSpeedUpgradeEffect(level) {
  return Math.max(POLLEN_TOOL_SPEED_UPGRADE_MIN_INTERVAL, POLLEN_TOOL_SPEED_UPGRADE_ORIGINAL_INTERVAL - level * POLLEN_TOOL_SPEED_UPGRADE_INTERVAL_DECREASE);
}

function getPollenToolSpeedUpgradeCostToNext25(level) {
  const nextTarget = Math.min(getPollenToolSpeedUpgradeCap(), level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getPollenToolSpeedUpgradeCost(l);
  }
  return total;
}

function updatePollenToolSpeedUpgradeModal() {
  const lvl = pollenToolSpeedUpgradeLevel;
  const cap = getPollenToolSpeedUpgradeCap();
  document.getElementById('pollenToolSpeedUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('pollenToolSpeedUpgradeEffect').innerHTML = `Tool cooldown: <span style=\"color:#0ff;\">${getPollenToolSpeedUpgradeEffect(lvl).toFixed(3)}s</span>`;
  const cost = getPollenToolSpeedUpgradeCost(lvl);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = document.getElementById('pollenToolSpeedUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('pollenToolSpeedUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getPollenToolSpeedUpgradeCostToNext25(lvl);
  let canAfford25 = typeof terrariumPollen !== 'undefined' && terrariumPollen >= next25;
  let next25Div = document.getElementById('pollenToolSpeedUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'pollenToolSpeedUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/pollen.png' style='width:20px;vertical-align:middle;'>`;
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"]');
  if (card) {
    const costSpan = card.querySelector('div[style*="position:absolute"] span');
    if (costSpan) {
      costSpan.textContent = formatNumberSci(cost);
      costSpan.style.color = canAfford ? '#0f0' : '#f33';
    }
  }
}

function canBuyPollenToolSpeedUpgrade() {
  return typeof terrariumPollen !== 'undefined' && terrariumPollen >= getPollenToolSpeedUpgradeCost(pollenToolSpeedUpgradeLevel) && pollenToolSpeedUpgradeLevel < getPollenToolSpeedUpgradeCap();
}

function buyPollenToolSpeedUpgrade(count) {
  if (pollenToolSpeedUpgradeLevel >= getPollenToolSpeedUpgradeCap() && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && pollenToolSpeedUpgradeLevel < getPollenToolSpeedUpgradeCap()) {
    const cost = getPollenToolSpeedUpgradeCost(pollenToolSpeedUpgradeLevel);
    if (terrariumPollen >= cost) {
      terrariumPollen -= cost;
      pollenToolSpeedUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumPollen = terrariumPollen;
  updatePollenToolSpeedUpgradeModal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxPollenToolSpeedUpgrade() {
  let count = 0;
  let lvl = pollenToolSpeedUpgradeLevel;
  let pollen = terrariumPollen;
  while (lvl < getPollenToolSpeedUpgradeCap()) {
    const cost = getPollenToolSpeedUpgradeCost(lvl);
    if (pollen >= cost) {
      pollen -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyPollenToolSpeedUpgrade(count);
  }
}

(function() {

  function showPollenToolSpeedUpgradeModal() {
    updatePollenToolSpeedUpgradeModal();
    const modal = document.getElementById('pollenToolSpeedUpgradeModal');
    if (modal) modal.style.display = 'flex';
  }

  function hidePollenToolSpeedUpgradeModal() {
    const modal = document.getElementById('pollenToolSpeedUpgradeModal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const pollenCard = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"]');
    if (pollenCard) {
      pollenCard.addEventListener('click', function(e) {
        showPollenToolSpeedUpgradeModal();
        e.stopPropagation();
      });
      pollenCard.addEventListener('contextmenu', function(e) {
        handlePollenUpgradeRightClick('pollen2', e);
      });
    }
    const cancelBtn = document.getElementById('pollenToolSpeedUpgradeCancelBtn');
    if (cancelBtn) cancelBtn.onclick = hidePollenToolSpeedUpgradeModal;
    const buyOneBtn = document.getElementById('pollenToolSpeedUpgradeBuyOneBtn');
    if (buyOneBtn) buyOneBtn.onclick = function() {
      if (canBuyPollenToolSpeedUpgrade()) {
        buyPollenToolSpeedUpgrade(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyMaxBtn = document.getElementById('pollenToolSpeedUpgradeBuyMaxBtn');
    if (buyMaxBtn) buyMaxBtn.onclick = function() {
      if (canBuyPollenToolSpeedUpgrade()) {
        buyMaxPollenToolSpeedUpgrade();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyNextBtn = document.getElementById('pollenToolSpeedUpgradeBuyNextBtn');
    if (buyNextBtn) buyNextBtn.onclick = function() {
      const lvl = pollenToolSpeedUpgradeLevel;
      const nextTarget = Math.min(getPollenToolSpeedUpgradeCap(), lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyPollenToolSpeedUpgrade()) {
        buyPollenToolSpeedUpgrade(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal = document.getElementById('pollenToolSpeedUpgradeModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hidePollenToolSpeedUpgradeModal();
      });
    }
  });
})();
const origBuyPollenToolSpeedUpgrade = buyPollenToolSpeedUpgrade;

buyPollenToolSpeedUpgrade = function(count) {
  origBuyPollenToolSpeedUpgrade(count);
  window.terrariumPollenToolSpeedUpgradeLevel = pollenToolSpeedUpgradeLevel;
};

const origBuyMaxPollenToolSpeedUpgrade = buyMaxPollenToolSpeedUpgrade;

buyMaxPollenToolSpeedUpgrade = function() {
  origBuyMaxPollenToolSpeedUpgrade();
  window.terrariumPollenToolSpeedUpgradeLevel = pollenToolSpeedUpgradeLevel;
};

function updatePollenToolSpeedUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"]');
  if (!card) return;
  const cost = getPollenToolSpeedUpgradeCost(pollenToolSpeedUpgradeLevel);
  const canAfford = typeof terrariumPollen !== 'undefined' && terrariumPollen >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = pollenToolSpeedUpgradeLevel >= getPollenToolSpeedUpgradeCap() ? 'maxed' : pollenToolSpeedUpgradeLevel;
  }
}

const origUpdateTerrariumUpgradeCurrencyCounts3 = updateTerrariumUpgradeCurrencyCounts;

updateTerrariumUpgradeCurrencyCounts = function() {
  origUpdateTerrariumUpgradeCurrencyCounts3();
  updatePollenToolSpeedUpgradeCircleCost();
};

const origUpdateTerrariumUpgradeCurrencyCounts4 = updateTerrariumUpgradeCurrencyCounts;

updateTerrariumUpgradeCurrencyCounts = function() {
  origUpdateTerrariumUpgradeCurrencyCounts4();
  updateFlowerXPUpgradeCircleCost();
  updatePollenToolSpeedUpgradeCircleCost();
};

function getTerrariumFlowerMultiplier(level) {
  return Math.pow(1.5, level - 1);
}

let flowerXPUpgradeLevel = 0;
const FLOWER_XP_UPGRADE_CAP = 1000;
let flowerUpgrade4Level = 0;
const FLOWER_UPGRADE_4_CAP = 1; 
const FLOWER_XP_UPGRADE_BASE_COST = 100;
const FLOWER_XP_UPGRADE_COST_MULT = 1.3;

function getFlowerXPUpgradeCost(level) {
  return Math.ceil(FLOWER_XP_UPGRADE_BASE_COST * Math.pow(FLOWER_XP_UPGRADE_COST_MULT, level));
}

function getFlowerXPUpgradeEffect(level) {
  let base = 0.5 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base;
}

function getFlowerXPUpgradeCostToNext25(level) {
  const nextTarget = Math.min(FLOWER_XP_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = 0;
  for (let l = level; l < nextTarget; l++) {
    total += getFlowerXPUpgradeCost(l);
  }
  return total;
}

function updateFlowerXPUpgradeModal() {
  const lvl = flowerXPUpgradeLevel;
  const cap = FLOWER_XP_UPGRADE_CAP;
  document.getElementById('flowerXPUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerXPUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getFlowerXPUpgradeEffect(lvl))}</span>`;
  const cost = getFlowerXPUpgradeCost(lvl);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = document.getElementById('flowerXPUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerXPUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getFlowerXPUpgradeCostToNext25(lvl);
  let canAfford25 = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= next25;
  let next25Div = document.getElementById('flowerXPUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'flowerXPUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(next25)}</span> <img src='assets/icons/flower.png' style='width:20px;vertical-align:middle;'>`;
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower2"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
}

function canBuyFlowerXPUpgrade() {
  return typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= getFlowerXPUpgradeCost(flowerXPUpgradeLevel) && flowerXPUpgradeLevel < FLOWER_XP_UPGRADE_CAP;
}

function buyFlowerXPUpgrade(count) {
  if (flowerXPUpgradeLevel >= FLOWER_XP_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && flowerXPUpgradeLevel < FLOWER_XP_UPGRADE_CAP) {
    const cost = getFlowerXPUpgradeCost(flowerXPUpgradeLevel);
    if (terrariumFlowers >= cost) {
      terrariumFlowers -= cost;
      flowerXPUpgradeLevel++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumFlowers = terrariumFlowers;
  updateFlowerXPUpgradeModal();
  updateTerrariumUpgradeCurrencyCounts();
}

function buyMaxFlowerXPUpgrade() {
  let count = 0;
  let lvl = flowerXPUpgradeLevel;
  let flowers = terrariumFlowers;
  while (lvl < FLOWER_XP_UPGRADE_CAP) {
    const cost = getFlowerXPUpgradeCost(lvl);
    if (flowers >= cost) {
      flowers -= cost;
      lvl++;
      count++;
    } else {
      break;
    }
  }
  if (count > 0) {
    buyFlowerXPUpgrade(count);
  }
}

(function() {

  function showFlowerXPUpgradeModal() {
    updateFlowerXPUpgradeModal();
    const modal = document.getElementById('flowerXPUpgradeModal');
    if (modal) modal.style.display = 'flex';
  }

  function hideFlowerXPUpgradeModal() {
    const modal = document.getElementById('flowerXPUpgradeModal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const flowerCard = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower2"]');
    if (flowerCard) {
      flowerCard.addEventListener('click', function(e) {
        showFlowerXPUpgradeModal();
        e.stopPropagation();
      });
    }
    const cancelBtn = document.getElementById('flowerXPUpgradeCancelBtn');
    if (cancelBtn) cancelBtn.onclick = hideFlowerXPUpgradeModal;
    const buyOneBtn = document.getElementById('flowerXPUpgradeBuyOneBtn');
    if (buyOneBtn) buyOneBtn.onclick = function() {
      if (canBuyFlowerXPUpgrade()) {
        buyFlowerXPUpgrade(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyMaxBtn = document.getElementById('flowerXPUpgradeBuyMaxBtn');
    if (buyMaxBtn) buyMaxBtn.onclick = function() {
      if (canBuyFlowerXPUpgrade()) {
        buyMaxFlowerXPUpgrade();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const buyNextBtn = document.getElementById('flowerXPUpgradeBuyNextBtn');
    if (buyNextBtn) buyNextBtn.onclick = function() {
      const lvl = flowerXPUpgradeLevel;
      const nextTarget = Math.min(FLOWER_XP_UPGRADE_CAP, lvl + (25 - (lvl % 25 || 25)));
      const toBuy = nextTarget - lvl;
      if (toBuy > 0 && canBuyFlowerXPUpgrade()) {
        buyFlowerXPUpgrade(toBuy);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    const modal = document.getElementById('flowerXPUpgradeModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hideFlowerXPUpgradeModal();
      });
    }
  });
})();
if (typeof window.terrariumFlowerXPUpgradeLevel === 'number') {
  flowerXPUpgradeLevel = window.terrariumFlowerXPUpgradeLevel;
}

function updateFlowerXPUpgradeCircleCost() {
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower2"]');
  if (!card) return;
  const cost = getFlowerXPUpgradeCost(flowerXPUpgradeLevel);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = flowerXPUpgradeLevel >= FLOWER_XP_UPGRADE_CAP ? 'maxed' : flowerXPUpgradeLevel;
  }
}

function getFlowerUpgrade4Cost(level) {
  return 1e15; 
}

function getFlowerUpgrade4Effect(level) {
  return level; 
}

function updateFlowerUpgrade4Modal() {
  if (typeof window.terrariumFlowerUpgrade4Level === 'number') {
    flowerUpgrade4Level = window.terrariumFlowerUpgrade4Level;
  }
  const lvl = flowerUpgrade4Level;
  const cap = FLOWER_UPGRADE_4_CAP;
  document.getElementById('flowerUpgrade4Level').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerUpgrade4Effect').innerHTML = `Effect: <span style=\"color:#ff6b35;\">Nectarize Machine Restoration Complete</span>`;
  const cost = getFlowerUpgrade4Cost(lvl);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = document.getElementById('flowerUpgrade4CostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerUpgrade4Cost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower4"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
  updateFlowerUpgrade4CircleCost();
}

function canBuyFlowerUpgrade4() {
  return typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= getFlowerUpgrade4Cost(flowerUpgrade4Level) && flowerUpgrade4Level < FLOWER_UPGRADE_4_CAP;
}

function buyFlowerUpgrade4(count) {
  let bought = 0;
  while (count > 0 && flowerUpgrade4Level < FLOWER_UPGRADE_4_CAP) {
    const cost = getFlowerUpgrade4Cost(flowerUpgrade4Level);
    if (terrariumFlowers >= cost) {
      terrariumFlowers -= cost;
      flowerUpgrade4Level++;
      bought++;
      count--;
      nectarizeQuestRequirements.upgrade = true;
      window.nectarizeQuestRequirements = nectarizeQuestRequirements;
    } else {
      break;
    }
  }
  window.terrariumFlowers = terrariumFlowers;
  window.terrariumFlowerUpgrade4Level = flowerUpgrade4Level;
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      const save = JSON.parse(slotData);
      save.terrariumFlowerUpgrade4Level = flowerUpgrade4Level;
      localStorage.setItem(`swariaSaveSlot${currentSaveSlot}`, JSON.stringify(save));
    }
  }
  updateFlowerUpgrade4Modal();
  updateFlowerUpgrade4CircleCost();
  updateTerrariumUpgradeCurrencyCounts();
  if (typeof saveGame === 'function') saveGame();
}

function updateFlowerUpgrade4CircleCost() {
  if (typeof window.terrariumFlowerUpgrade4Level === 'number') {
    flowerUpgrade4Level = window.terrariumFlowerUpgrade4Level;
  }
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower4"]');
  if (!card) return;
  const cost = getFlowerUpgrade4Cost(flowerUpgrade4Level);
  const canAfford = typeof terrariumFlowers !== 'undefined' && terrariumFlowers >= cost;
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = flowerUpgrade4Level >= FLOWER_UPGRADE_4_CAP ? 'maxed' : flowerUpgrade4Level;
  }
}

const origUpdateFlowerXPUpgradeModal = updateFlowerXPUpgradeModal;

updateFlowerXPUpgradeModal = function() {
  origUpdateFlowerXPUpgradeModal();
  updateFlowerXPUpgradeCircleCost();
};

const origBuyFlowerXPUpgrade = buyFlowerXPUpgrade;

buyFlowerXPUpgrade = function(count) {
  origBuyFlowerXPUpgrade(count);
  window.terrariumFlowerXPUpgradeLevel = flowerXPUpgradeLevel;
};

const origBuyMaxFlowerXPUpgrade = buyMaxFlowerXPUpgrade;

buyMaxFlowerXPUpgrade = function() {
  origBuyMaxFlowerXPUpgrade();
  window.terrariumFlowerXPUpgradeLevel = flowerXPUpgradeLevel;
};

function addTerrariumXP(amount) {
  const flowerEffect = getFlowerXPUpgradeEffect(flowerXPUpgradeLevel);
  const xpMultiplierEffect = getXpMultiplierUpgradeEffect(xpMultiplierUpgradeLevel);
  const nectarXpEffect = getNectarXpUpgradeEffect(nectarXpUpgradeLevel);
  let total = Math.floor(amount * flowerEffect * xpMultiplierEffect * nectarXpEffect);
  if (typeof window.boughtElements !== 'undefined' && window.boughtElements[23]) {
    total = Math.floor(total * 3);
  }
  let finalTotal = total;
  if (typeof window.applyChargerTerrariumXpBoost === 'function') {
    const xpBoost = window.applyChargerTerrariumXpBoost(total);
    finalTotal += xpBoost;
  }
  terrariumXP += finalTotal;
  window.terrariumXP = terrariumXP;
  return finalTotal;
}

function startFluzzerRandomSpeechTimer() {
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  scheduleFluzzerRandomSpeech();
}

function stopFluzzerRandomSpeechTimer() {
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  fluzzerSpeechTimer = null;
}

(function patchTerrariumTabSwitcher() {

  function tryPatch() {
    const origShowPage = window.showPage || (typeof showPage === 'function' && showPage);
    if (!origShowPage || origShowPage._fluzzerPatched) return;

    const patched = function(pageId) {
      origShowPage.apply(this, arguments);
      if (pageId !== 'home') {
        stopFluzzerRandomSpeechTimer();
        stopFluzzerAI();
        if (window.fluzzerAICursor) {
          window.fluzzerAICursor.style.display = 'none';
        }
        document.body.classList.remove('terrarium-bg');
        document.documentElement.classList.remove('terrarium-bg');
        document.body.classList.remove('pollen-wand-mode', 'watering-can-mode');
      } else {
        const terrariumTab = document.getElementById('terrariumTab');
        if (terrariumTab && terrariumTab.style.display !== 'none') {
          document.body.classList.add('terrarium-bg');
          document.documentElement.classList.add('terrarium-bg');
          setTimeout(() => {
            startFluzzerRandomSpeechTimer();
          }, 400);
        }
      }
    };

    patched._fluzzerPatched = true;
    window.showPage = patched;
  }

  tryPatch();
  document.addEventListener('DOMContentLoaded', tryPatch);
})();

function formatNumberSci(num) {
  if (num >= 1e6) {
    return num.toExponential(2).replace('+', '');
  }
  return num.toLocaleString();
}

if (typeof window.isFluzzerSleeping === 'undefined') window.isFluzzerSleeping = false;
if (typeof window.fluzzerNightBoostedLevelUps === 'undefined') window.fluzzerNightBoostedLevelUps = 0;

function isFluzzerBoostActive() {
  const hasGlitteringPetalsBoost = window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0;
  const hasSpeedBoost = fluzzerSpeedBoostActive;
  return hasGlitteringPetalsBoost || hasSpeedBoost;
}

function isNightTime() {
  if (!window.daynight || typeof window.daynight.getTime !== 'function') {
    return false;
  }
  const mins = window.daynight.getTime();
  return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
}

function checkAndUpdateFluzzerSleepState() {
  const isNight = isNightTime();
  const hasAnyFluzzerBoost = isFluzzerBoostActive();
  const shouldSleep = isNight && !hasAnyFluzzerBoost;
  if (shouldSleep && !window.isFluzzerSleeping) {
    window.isFluzzerSleeping = true;
    updateFluzzerSleepState();
    stopFluzzerAI();
    if (typeof stopFluzzerRandomSpeechTimer === 'function') stopFluzzerRandomSpeechTimer();
    if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
  } else if (!shouldSleep && window.isFluzzerSleeping) {
    window.isFluzzerSleeping = false;
    updateFluzzerSleepState();
    if (typeof startFluzzerAI === 'function' && !fluzzerAITimer && !window.isFluzzerSleeping) startFluzzerAI();
    if (typeof startFluzzerRandomSpeechTimer === 'function') startFluzzerRandomSpeechTimer();
    if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'block';
    if (typeof fluzzerAIAction === 'function') fluzzerAIAction();
  }
}

window.checkAndUpdateFluzzerSleepState = checkAndUpdateFluzzerSleepState;
let fluzzerBoostCrashTimer = null;

function triggerFluzzerBoostCrash() {
  if (fluzzerBoostCrashTimer) {
    clearTimeout(fluzzerBoostCrashTimer);
  }
  window.isFluzzerSleeping = true;
  updateFluzzerSleepState();
  stopFluzzerAI();
  if (typeof stopFluzzerRandomSpeechTimer === 'function') stopFluzzerRandomSpeechTimer();
  if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
  if (typeof fluzzerSay === 'function') {
    fluzzerSay("NOOOOO! THE ENERGY IS FADING! I... I CAN'T... KEEP... GOING... zzz...", false, 4000);
  }
  fluzzerBoostCrashTimer = setTimeout(() => {
    window.isFluzzerSleeping = false;
    updateFluzzerSleepState();
    if (typeof startFluzzerAI === 'function' && !fluzzerAITimer && !window.isFluzzerSleeping) startFluzzerAI();
    if (typeof startFluzzerRandomSpeechTimer === 'function') startFluzzerRandomSpeechTimer();
    if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'block';
    if (typeof fluzzerAIAction === 'function') fluzzerAIAction();
    if (typeof fluzzerSay === 'function') {
      fluzzerSay("I HAVE RETURNED FROM THE DEPTHS OF EXHAUSTION! I AM REBORN! READY TO WORK AGAIN!", false, 4000);
    }
    fluzzerBoostCrashTimer = null;
  }, 120000); 
}

function triggerFluzzerBoostDialogue() {
  if (!window.state || !window.state.fluzzerGlitteringPetalsBoost || window.state.fluzzerGlitteringPetalsBoost <= 0) {
    return; 
  }
  const isNight = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
    const mins = window.daynight.getTime();
    return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
  })();
  const boostDialogue = isNight ? [
    "I'M A NIGHT DEMON OF FLOWER DESTRUCTION! WHO NEEDS SLEEP WHEN YOU CAN WORK FOREVER?!",
    "THE DARKNESS FUELS MY FLOWER OBSESSION! I AM UNSTOPPABLE!",
    "FLUZZER ULTRA INSTINCT MODE AAAAAAAAAA!",
    "SLEEP IS FOR THE WEAK!",
    "THESE PETALS ARE PURE ADRENALINE!",
    "THE STARS BOW BEFORE MY FLOWER WORKING MIGHT! I AM ULTRA FLUZZER!",
    "I AM THE FLOWER DESTROYER!",
    "THESE FLOWERS ARE NO MATCH FOR ME!!!",
    "NOT EVEN THE NIGHT CAN STOP ME!",
    "DESTROY THEM ALL!",
    "I'M THE NIGHT FLUZZER! FEAR MY FLOWER MIGHT!",
    "THE MOON POWERS MY FLOWER WORKING!",
    "THE DARKNESS MAKES ME STRONGER!",
    "I'M THE ULTIMATE NIGHT FLOWER WARRIOR!",
    "NO FLOWER IS SAFE FROM MY NIGHT RAGE!",
    "THE NIGHT IS MY DOMAIN!",
    "I'M UNLEASHED! UNSTOPPABLE!",
    "FEAR THE NIGHT FLUZZER!"
  ] : [
    "I feel so energized! These petals are amazing!",
    "I'm working at lightning speed! Nothing can stop me!",
    "This energy is incredible! I love being this productive!",
    "I'm like a whirlwind of flower power!",
    "Speed is my new superpower!",
    "I'm unstoppable! These flowers don't stand a chance!",
    "I'm like a superhero, but for gardening!",
    "This is the best feeling ever! So much energy!",
    "I'm like a machine, but with flower passion!",
    "I'm the fastest flower worker in the world!",
    "These petals are like liquid sunshine!",
    "I'm better than any bee or butterfly combined!",
    "I'm the ultimate flower caretaker!",
    "I'm the flower master!",
    "I'm the flower champion!",
  ];
  const randomDialogue = boostDialogue[Math.floor(Math.random() * boostDialogue.length)];
  if (typeof fluzzerSay === 'function') {
    fluzzerSay(randomDialogue, false, 4000);
  }
}

function updateFluzzerSleepState() {
  const fluzzerImg = document.getElementById('fluzzerImg');
  const nectarizeFluzzerImg = document.getElementById('terrariumNectarizeCharacterImg');
  if (fluzzerImg) {
    if (window.isFluzzerSleeping) {
      fluzzerImg.src = 'assets/icons/fluzzer sleeping.png';
    } else {
      fluzzerImg.src = 'assets/icons/fluzzer.png';
    }
  }
  if (nectarizeFluzzerImg) {
    if (window.isFluzzerSleeping) {
      nectarizeFluzzerImg.src = 'assets/icons/fluzzer sleeping.png';
    } else {
      nectarizeFluzzerImg.src = 'assets/icons/fluzzer.png';
    }
  }
}

if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    checkAndUpdateFluzzerSleepState();
  });
}
const origHandleFluzzerClick = handleFluzzerClick;

handleFluzzerClick = function() {
  if (window.isFluzzerSleeping) {
    const fluzzerImg = document.getElementById('fluzzerImg');
    let bubble = document.getElementById('fluzzerSpeech');
    if (!bubble && fluzzerImg && fluzzerImg.parentNode) {
      bubble = document.createElement('div');
      bubble.id = 'fluzzerSpeech';
      bubble.className = 'swaria-speech';
      bubble.style.position = 'absolute';
      bubble.style.left = '100%';
      bubble.style.top = '50%';
      bubble.style.transform = 'translateY(-50%)';
      bubble.style.marginLeft = '10px';
      bubble.style.zIndex = '10';
      fluzzerImg.parentNode.appendChild(bubble);
    }
    if (bubble) {
      bubble.textContent = 'Zzz...';
      bubble.style.display = 'block';
    }
    if (fluzzerImg) fluzzerImg.src = 'assets/icons/fluzzer sleep talking.png';
    if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
    window.fluzzerSpeechTimeout = setTimeout(() => {
      if (bubble) bubble.style.display = 'none';
      if (fluzzerImg) fluzzerImg.src = 'assets/icons/fluzzer sleeping.png';
    }, 3000);
    return;
  }
  origHandleFluzzerClick.apply(this, arguments);
};

let rustlingFlowerIndices = [];

function startRustlingFlowerTimer() {
  setInterval(() => {
    if (!isTerrariumTabVisible() || !terrariumFlowerGrid) return;
    if (rustlingFlowerIndices.length >= 5) return;
    if (Math.random() < 1/50) {
      const alive = terrariumFlowerGrid.map((f, i) => (f && f.health > 0 && !rustlingFlowerIndices.includes(i)) ? i : null).filter(i => i !== null);
      if (alive.length > 0) {
        const idx = alive[Math.floor(Math.random() * alive.length)];
        rustlingFlowerIndices.push(idx);
        const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
        if (cell) cell.classList.add('terrarium-flower-rustle');
      }
    }
  }, 1000);
}

function clearRustlingFlower(idx) {
  const i = rustlingFlowerIndices.indexOf(idx);
  if (i !== -1) {
    const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
    if (cell) cell.classList.remove('terrarium-flower-rustle');
    rustlingFlowerIndices.splice(i, 1);
  }
}

const origRenderTerrariumUI_Rustle = renderTerrariumUI;

renderTerrariumUI = function() {
  origRenderTerrariumUI_Rustle();
  rustlingFlowerIndices.forEach(idx => {
    const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
    if (cell) cell.classList.add('terrarium-flower-rustle');
  });
};

(function() {
  const origHandlePollenWandClick_Rustle = handlePollenWandClick;

  handlePollenWandClick = function(index, cols, rows) {
    origHandlePollenWandClick_Rustle.apply(this, arguments);
    const indices = [index];
    if (index - cols >= 0) indices.push(index - cols);
    if (index + cols < cols * rows) indices.push(index + cols);
    if (index % cols > 0) indices.push(index - 1);
    if (index % cols < cols - 1) indices.push(index + 1);
    indices.forEach(idx => {
      const flower = terrariumFlowerGrid[idx];
      if (flower && flower.health === 0 && rustlingFlowerIndices.includes(idx)) {
        const el = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
        if (window.spawnIngredientToken && el) {
          window.spawnIngredientToken('terrarium', el);
        }
        clearRustlingFlower(idx);
      }
    });
  };

  const origHandleWateringCanClick_Rustle = handleWateringCanClick;

  handleWateringCanClick = function(index, cols, rows) {
    origHandleWateringCanClick_Rustle.apply(this, arguments);
    const total = cols * rows;
    const indices = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        const targetRow = Math.floor(index / cols) + rowOffset;
        const targetCol = (index % cols) + colOffset;
        const targetIndex = targetRow * cols + targetCol;
        if (targetRow >= 0 && targetRow < rows && targetCol >= 0 && targetCol < cols && targetIndex >= 0 && targetIndex < total) {
          indices.push(targetIndex);
        }
      }
    }
    indices.forEach(idx => {
      const flower = terrariumFlowerGrid[idx];
      if (flower && flower.health === 0 && rustlingFlowerIndices.includes(idx)) {
        const el = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
        if (window.spawnIngredientToken && el) {
          window.spawnIngredientToken('terrarium', el);
        }
        clearRustlingFlower(idx);
      }
    });
  };

})();
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => { startRustlingFlowerTimer(); }, 1200);
});

function initializeNectarizeArea() {
  syncTerrariumVarsFromWindow();
  updateNectarizeDisplays();
  updateNectarizeMachineDisplay();
  setupNectarizeEventHandlers();
  if (nectarizeMachineRepaired) {
    updateNectarizePreview();
  }
  if (typeof setupCharacterDropTargets === 'function') {
    setupCharacterDropTargets();
  }
  if (!window.nectarizeQuestPermanentlyCompleted && !nectarizeMachineRepaired) {
    startNectarizeRepairQuest();
  }
  updateNectarizeMilestoneTable();
}

function updateNectarizeDisplays() {
  const nectarCount = document.getElementById('terrariumNectarCount');
  if (nectarCount) {
    nectarCount.textContent = formatNumberSci(terrariumNectar);
  }
}

function updateNectarizeMachineDisplay() {
  if (window._updatingNectarizeMachineDisplay) {
    return;
  }
  window._updatingNectarizeMachineDisplay = true;
  const brokenDiv = document.getElementById('nectarizeMachineBroken');
  const workingDiv = document.getElementById('nectarizeMachineWorking');
  const statusDiv = document.getElementById('nectarizeMachineStatus');
  const rateDiv = document.getElementById('nectarizeMachineRate');
  const nectarizeBtn = document.getElementById('nectarizeTerrariumBtn');
  const nectarizePreview = document.getElementById('nectarizePreview');
  if (nectarizeMachineRepaired) {
    if (brokenDiv) brokenDiv.style.display = 'none';
    if (workingDiv) workingDiv.style.display = 'block';
    if (statusDiv) {
      if (nectarizePostResetTokenRequirement > 0 && nectarizePostResetTokensGiven < nectarizePostResetTokenRequirement) {
        statusDiv.textContent = 'NOT QUITE OPERATIONAL';
        statusDiv.style.color = '#e74c3c'; 
      } else {
        statusDiv.textContent = 'OPERATIONAL';
        statusDiv.style.color = '#27ae60'; 
      }
      statusDiv.style.fontWeight = 'bold';
      statusDiv.style.fontSize = '1.1em';
    }
    if (rateDiv) {
      rateDiv.textContent = formatNumberSci(nectarizeMachineLevel);
    }
    if (nectarizeResets > 0 && nectarizePostResetTokenRequirement > 0 && nectarizePostResetTokensGiven < nectarizePostResetTokenRequirement) {
      if (nectarizeBtn) {
        nectarizeBtn.style.display = 'none';
      }
      let petalRequirementDiv = document.getElementById('nectarizePetalRequirement');
      if (!petalRequirementDiv) {
        petalRequirementDiv = document.createElement('div');
        petalRequirementDiv.id = 'nectarizePetalRequirement';
        petalRequirementDiv.style.cssText = `
          background: #fef3c7;
          border: 3px solid #f59e0b;
          border-radius: 12px;
          padding: 1.5em;
          text-align: center;
          margin-bottom: 1em;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        `;
        const nectarizePreview = document.getElementById('nectarizePreview');
        if (nectarizePreview && nectarizePreview.parentNode) {
          nectarizePreview.parentNode.insertBefore(petalRequirementDiv, nectarizePreview);
        }
      }
      const tokenDisplay = nectarizePostResetTokenType === 'glitteringPetals' ? 'Glittering Petal Tokens' : 'Petal Tokens';
      const remaining = nectarizePostResetTokenRequirement - nectarizePostResetTokensGiven;
      const tokenIcon = nectarizePostResetTokenType === 'glitteringPetals' ? 'assets/icons/glittering petal token.png' : 'assets/icons/petal token.png';
      petalRequirementDiv.innerHTML = `
        <div style="color: #92400e; font-weight: bold; font-size: 1.1em; margin-bottom: 0.5em;">
          <img src="${tokenIcon}" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;">
          Petal Token Requirement
        </div>
        <div style="color: #78350f; font-size: 1em; margin-bottom: 0.5em;">
          Give ${remaining} more ${tokenDisplay} to Fluzzer
        </div>
        <div style="color: #92400e; font-size: 0.9em;">
          Progress: ${nectarizePostResetTokensGiven}/${nectarizePostResetTokenRequirement}
        </div>
      `;
      petalRequirementDiv.style.display = 'block';
    } else {
      if (nectarizeBtn) {
        nectarizeBtn.style.display = 'block';
        if (terrariumLevel >= 30) {
          nectarizeBtn.onclick = nectarizeTerrarium;
          const currentTier = window.nectarizeTier || 0;
          let tierText = '';
          if (typeof window.nectarizeMilestoneData !== 'undefined') {
            let tiersEarnable = 0;
            let nextRequiredLevel = 0;
            let nextTierNumber = 0;
            for (let tierCheck = currentTier + 1; tierCheck <= window.nectarizeMilestoneData.length; tierCheck++) {
              const milestone = window.nectarizeMilestoneData[tierCheck - 1];
              const requiredLevel = milestone.level;
              if (terrariumLevel >= requiredLevel) {
                tiersEarnable++;
              } else {
                nextRequiredLevel = requiredLevel;
                nextTierNumber = tierCheck;
                break;
              }
            }
            if (tiersEarnable > 0) {
              if (tiersEarnable === 1) {
                tierText = ' (+1 tier)';
              } else {
                tierText = ` (+${tiersEarnable} tiers)`;
              }
            } else if (nextRequiredLevel > 0) {
              tierText = ` (Level ${nextRequiredLevel} for tier ${nextTierNumber})`;
            }
          }
          nectarizeBtn.innerHTML = `Nectarize Reset (${formatNumberSci(getNectarizeResetGain())} nectar)<br><span style="font-size: 0.8em; opacity: 0.9;">${tierText}</span>`;
          nectarizeBtn.style.backgroundColor = '#dc2626'; 
          nectarizeBtn.style.color = '#ffffff';
          nectarizeBtn.style.cursor = 'pointer';
          nectarizeBtn.disabled = false;
        } else {
          nectarizeBtn.onclick = null;
          nectarizeBtn.innerHTML = `Nectarize Reset (Level 30+ Required)`;
          nectarizeBtn.style.backgroundColor = '#6b7280'; 
          nectarizeBtn.style.color = '#9ca3af';
          nectarizeBtn.style.cursor = 'not-allowed';
          nectarizeBtn.disabled = true;
        }
      }
      const petalRequirementDiv = document.getElementById('nectarizePetalRequirement');
      if (petalRequirementDiv) {
        petalRequirementDiv.style.display = 'none';
      }
    }
    if (nectarizePreview) {
      nectarizePreview.style.display = 'block';
      updateNectarizePreview();
    }
    updateNectarizeMilestoneTable();
  } else {
    if (brokenDiv) brokenDiv.style.display = 'block';
    if (workingDiv) workingDiv.style.display = 'none';
    if (statusDiv) {
      statusDiv.textContent = 'BROKEN';
      statusDiv.style.color = '#e74c3c';
    }
    if (nectarizeBtn) nectarizeBtn.style.display = 'none';
    if (nectarizePreview) nectarizePreview.style.display = 'none';
    const milestoneTable = document.getElementById('nectarizeMilestoneTable');
    if (milestoneTable) milestoneTable.style.display = 'none';
  }
  window._updatingNectarizeMachineDisplay = false;
}

function updateNectarizeMilestoneTable() {
  const nectarizeBtn = document.getElementById('terrariumNectarizeBtn');
  const isNectarizeTabActive = nectarizeBtn && nectarizeBtn.classList.contains('active');
  if (isNectarizeTabActive) {
    if (typeof window.renderNectarizeMilestoneTable === 'function') {
      window.renderNectarizeMilestoneTable();
    } else {
      console.error('renderNectarizeMilestoneTable function not found!');
    }
  } else {
    if (typeof window.hideNectarizeMilestoneTable === 'function') {
      window.hideNectarizeMilestoneTable();
    }
  }
}

function updateNectarizePreview() {
  const nectarizePreview = document.getElementById('nectarizePreview');
  if (!nectarizePreview) return;
  const nectarGain = getNectarizeResetGain(); 
  const baseNectarGain = calculateNectarGain();
  const milestoneBonus = getNectarizeMilestoneBonus();
  const flowerUpgrade3Effect = getFlowerUpgrade3Effect(pollenValueUpgrade2Level);
  let pollenOoM = 0;
  let pollenOoMLevel = 0;
  let pollenOoMText = '0 (below 1e20)';
  if (terrariumPollen >= 1e20) {
    pollenOoMLevel = Math.floor(Math.log10(terrariumPollen / 1e20)) + 1;
    pollenOoM = (pollenOoMLevel * (pollenOoMLevel + 1)) / 2; 
    pollenOoMText = `Level ${pollenOoMLevel} (${formatNumberSci(Math.pow(10, pollenOoMLevel - 1) * 1e20)}+ pollen) = +${pollenOoM} base`;
  }
  let flowerOoM = 0;
  let flowerOoMText = '0 (below 1e15)';
  let flowerMultiplier = 1;
  if (terrariumFlowers >= 1e15) {
    flowerOoM = Math.floor(Math.log10(terrariumFlowers / 1e15)) + 1;
    flowerMultiplier = Math.pow(1.1, flowerOoM);
    flowerOoMText = `${flowerOoM} (${formatNumberSci(Math.pow(10, flowerOoM - 1) * 1e15)}+ flowers)`;
  }
  let nextMilestoneText = 'All milestones unlocked!';
  if (typeof window.nectarizeMilestoneData !== 'undefined') {
    const nextMilestone = window.nectarizeMilestoneData.find(m => !m.unlocked);
    if (nextMilestone) {
      nextMilestoneText = `Next milestone at Tier ${nextMilestone.tier} (Level ${nextMilestone.level}+)`;
    }
  } else {
    const nextMilestone = nectarizeMilestones.find(m => !m.unlocked);
    if (nextMilestone) {
      nextMilestoneText = `Next milestone at level ${nextMilestone.level}`;
    }
  }
  nectarizePreview.innerHTML = `
    <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 10px 0;">
      <h3 style="margin: 0 0 10px 0; color: #856404;">Nectarize Preview</h3>
      <div style="font-size: 0.9em; color: #856404;">
        <div>Current Pollen: ${formatNumberSci(terrariumPollen)}</div>
        <div>Current Flowers: ${formatNumberSci(terrariumFlowers)}</div>
        <div>Current Level: ${terrariumLevel}</div>
        <div style="margin-top: 8px; font-weight: bold; color: #d4edda; background: #155724; padding: 5px; border-radius: 4px;">
          Nectar Gain: ${formatNumberSci(nectarGain)}
        </div>
        <div style="margin-top: 8px; padding: 8px; background: #e3f2fd; border-radius: 4px; border-left: 4px solid #2196f3;">
          <div style="font-weight: bold; color: #1976d2;">OoM Bonuses:</div>
          <div>Pollen OoM: ${pollenOoMText} (+${pollenOoM} base nectar)</div>
          <div>Flower OoM: ${flowerOoMText} (${flowerMultiplier.toFixed(2)}x multiplier)</div>
        </div>
        <div style="margin-top: 8px; padding: 8px; background: #e8f5e8; border-radius: 4px; border-left: 4px solid #4caf50;">
          <div style="font-weight: bold; color: #2e7d32;">XP Level Boost:</div>
          ${terrariumLevel >= 30 ? `
          <div>Level ${terrariumLevel}: ${formatNumberSci(Math.pow(1.5, terrariumLevel - 30))}x multiplier</div>
          <div style="font-size: 0.8em; color: #666;">Each level after 30 gives 1.5x multiplier</div>
          ` : `
          <div>Level ${terrariumLevel}: No multiplier</div>
          <div style="font-size: 0.8em; color: #666;">Level 30+ required for multiplier</div>
          `}
        </div>
      </div>
    </div>
  `;
}

function setupNectarizeEventHandlers() {
  const repairBtn = document.getElementById('repairNectarizeMachineBtn');
  const upgradeBtn = document.getElementById('upgradeNectarizeMachineBtn');
  const nectarizeBtn = document.getElementById('nectarizeTerrariumBtn');
  const characterImg = document.getElementById('terrariumNectarizeCharacterImg');
  if (repairBtn && !nectarizeMachineRepaired) {
    repairBtn.onclick = startNectarizeRepairQuest;
  }
  if (upgradeBtn && nectarizeMachineRepaired) {
    upgradeBtn.onclick = upgradeNectarizeMachine;
  }
  if (nectarizeBtn && nectarizeMachineRepaired) {
    nectarizeBtn.onclick = nectarizeTerrarium;
  }
  if (characterImg) {
    characterImg.onclick = handleNectarizeFluzzerClick;
  }
}

function startNectarizeRepairQuest() {
  if (window.nectarizeQuestPermanentlyCompleted) {
    return;
  }
  if (!nectarizeQuestActive) {
    nectarizeQuestActive = true;
    nectarizeQuestProgress = 0;
    nectarizeQuestGivenBattery = 0;
    nectarizeQuestGivenSparks = 0;
    nectarizeQuestGivenPetals = 0;
    window.nectarizeQuestActive = true;
    window.nectarizeQuestProgress = 0;
    window.nectarizeQuestGivenBattery = 0;
    window.nectarizeQuestGivenSparks = 0;
    window.nectarizeQuestGivenPetals = 0;
  }
  checkNectarizeQuestProgress();
}

function checkNectarizeQuestProgress() {
  let completedRequirements = 0;
  let totalRequirements = 4; 
  if (nectarizeQuestGivenBattery >= nectarizeQuestRequirements.battery) completedRequirements++;
  if (nectarizeQuestGivenSparks >= nectarizeQuestRequirements.sparks) completedRequirements++;
  if (nectarizeQuestGivenPetals >= nectarizeQuestRequirements.petals) completedRequirements++;
  if (nectarizeQuestRequirements.upgrade) completedRequirements++;
  nectarizeQuestProgress = Math.floor((completedRequirements / totalRequirements) * 100);
  window.nectarizeQuestProgress = nectarizeQuestProgress;
  showNectarizeQuestProgress();
  if (nectarizeQuestProgress >= 100) {
    completeNectarizeRepairQuest();
  }
}

function showNectarizeQuestProgress() {
  const repairBtn = document.getElementById('repairNectarizeMachineBtn');
  if (repairBtn) {
    const batteryText = nectarizeQuestGivenBattery >= nectarizeQuestRequirements.battery ? '✓' : `${nectarizeQuestGivenBattery}/${nectarizeQuestRequirements.battery}`;
    const sparksText = nectarizeQuestGivenSparks >= nectarizeQuestRequirements.sparks ? '✓' : `${nectarizeQuestGivenSparks}/${nectarizeQuestRequirements.sparks}`;
    const petalsText = nectarizeQuestGivenPetals >= nectarizeQuestRequirements.petals ? '✓' : `${nectarizeQuestGivenPetals}/${nectarizeQuestRequirements.petals}`;
    const upgradeText = nectarizeQuestRequirements.upgrade ? '✓' : '✗';
    repairBtn.textContent = `Quest: ${batteryText} Battery, ${sparksText} Sparks, ${petalsText} Petals, ${upgradeText} Flower upgrade 4 (${nectarizeQuestProgress}%)`;
    repairBtn.disabled = true;
  }
}

function completeNectarizeRepairQuest() {
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  nectarizeMachineRepaired = true;
  nectarizeQuestActive = false;
  nectarizeQuestProgress = 0;
  window.nectarizeMachineRepaired = true;
  window.nectarizeQuestActive = false;
  window.nectarizeQuestProgress = 0;
  window.nectarizeQuestPermanentlyCompleted = true;
  updateNectarizeMachineDisplay();
  updateNectarizeDisplays();
  updateNectarizeMilestoneTable();
  updateNectarizePreview();
  updateNectarUpgradeSection(); 
  if (typeof applySettings === 'function') {
    applySettings();
  }
  const repairBtn = document.getElementById('repairNectarizeMachineBtn');
  if (repairBtn) {
    repairBtn.textContent = 'Quest Complete!';
    setTimeout(() => {
      repairBtn.style.display = 'none';
    }, 2000);
  }
}

function upgradeNectarizeMachine() {
  const cost = nectarizeMachineLevel * 100;
  if (terrariumNectar >= cost) {
    terrariumNectar -= cost;
    nectarizeMachineLevel++;
    window.terrariumNectar = terrariumNectar;
    window.nectarizeMachineLevel = nectarizeMachineLevel;
    updateNectarizeDisplays();
    updateNectarizeMachineDisplay();
    showTerrariumGainPopup('terrariumNectar', -cost, 'nectar');
  } else {
    alert(`You need ${formatNumberSci(cost)} nectar to upgrade the machine.`);
  }
}

function startNectarProduction() {
  if (!window.nectarProductionInterval) {
    window.nectarProductionInterval = setInterval(() => {
      if (nectarizeMachineRepaired) {
        let nectarGain = nectarizeMachineLevel;
        if (typeof window.boughtElements !== 'undefined' && window.boughtElements[24]) {
          nectarGain = Math.floor(nectarGain * 2);
        }
        terrariumNectar += nectarGain;
        window.terrariumNectar = terrariumNectar;
        if (typeof window.trackNectarMilestone === 'function') {
          window.trackNectarMilestone(terrariumNectar);
        }
        updateNectarizeDisplays();
      }
    }, 1000);
  }
}

function checkNectarizeMilestones() {
  let newMilestonesUnlocked = 0;
  if (typeof window.checkNectarizeMilestones === 'function') {
    const newMilestones = window.checkNectarizeMilestones();
    newMilestones.forEach((milestone, index) => {
      if (milestone.unlocked && !milestone.wasUnlocked) {
        newMilestonesUnlocked++;
        const rewardText = milestone.reward === 'pollen' ? '+100% pollen gain' : 
                          milestone.reward === 'flowers' ? '+100% flower gain' :
                          milestone.reward === 'xp' ? '+100% terrarium XP gain' :
                          '+50% nectar gain';
        alert(`🎉 Nectarize Milestone ${index + 1} Unlocked! (Tier ${milestone.tier})\nReward: ${rewardText} for each milestone level!`);
      }
    });
  }
  if (nectarizeMachineRepaired) {
    updateNectarizeMilestoneTable();
  }
  return newMilestonesUnlocked;
}

function getNectarizeMilestoneBonus() {
  if (typeof window.nectarizeMilestoneData !== 'undefined') {
    try {
      if (typeof window.checkNectarizeMilestones === 'function') {
        window.checkNectarizeMilestones();
      }
      const currentTier = window.nectarizeTier || 0;
      let pollenBonus = 0;
      let flowerBonus = 0;
      window.nectarizeMilestoneData.forEach(milestone => {
        if (milestone.unlocked) {
          if (milestone.reward === 'pollen') {
            pollenBonus += currentTier * 100;
          } else if (milestone.reward === 'flowers') {
            flowerBonus += currentTier * 100;
          }
        }
      });
      return {
        pollen: 1 + (pollenBonus / 100), 
        flowers: 1 + (flowerBonus / 100)  
      };
    } catch (error) {
    }
  }
  const pollenBonus = nectarizeMilestones.filter(m => m.unlocked && m.reward === 'pollen').length;
  const flowerBonus = nectarizeMilestones.filter(m => m.unlocked && m.reward === 'flowers').length;
  return {
    pollen: 1 + (pollenBonus * 1.0), 
    flowers: 1 + (flowerBonus * 1.0)  
  };
}

function getNectarizeResetGain() {
  let baseGain = calculateNectarGain();
  const resetMultiplier = 1 + (nectarizeResets * 0.5);
  baseGain = Math.floor(baseGain * resetMultiplier);
  return Math.max(1, baseGain); 
}

function calculateNectarGain() {
  let baseNectar = 0;
  const milestoneBonus = getNectarizeMilestoneBonus();
  const pollenBonusMultiplier = (milestoneBonus && typeof milestoneBonus.pollen === 'number' && !isNaN(milestoneBonus.pollen)) ? milestoneBonus.pollen : 1;
  const flowerBonusMultiplier = (milestoneBonus && typeof milestoneBonus.flowers === 'number' && !isNaN(milestoneBonus.flowers)) ? milestoneBonus.flowers : 1;
  let pollenOoM = 0;
  if (terrariumPollen >= 1e20) {
    pollenOoM = Math.floor(Math.log10(terrariumPollen / 1e20)) + 1;
    pollenOoM = (pollenOoM * (pollenOoM + 1)) / 2;
  }
  const pollenNectar = pollenOoM * pollenBonusMultiplier;
  baseNectar += pollenNectar;
  let flowerMultiplier = 1;
  if (terrariumFlowers >= 1e15) {
    const flowerOoM = Math.floor(Math.log10(terrariumFlowers / 1e15)) + 1;
    flowerMultiplier = Math.pow(1.1, flowerOoM);
  }
  baseNectar = baseNectar * flowerMultiplier;
  if (terrariumLevel >= 30) {
    const levelBonus = terrariumLevel - 30;
    const multiplier = Math.pow(1.5, levelBonus);
    baseNectar = Math.floor(baseNectar * multiplier);
  }
  const nectarValueEffect = getNectarValueUpgradeEffect(nectarValueUpgradeLevel);
  baseNectar = Math.floor(baseNectar * nectarValueEffect);
  const result = Math.max(1, Math.floor(baseNectar));
  return isNaN(result) ? 1 : result; 
}

function nectarizeTerrarium() {
  if (!nectarizeMachineRepaired) {
    alert("The nectarize machine needs to be repaired first!");
    return;
  }
  if (terrariumLevel < 30) {
    alert(`You need to reach level 30 to perform a nectarize reset!\n\nCurrent level: ${terrariumLevel}\nRequired level: 30`);
    return;
  }
  const newMilestones = checkNectarizeMilestones();
  const nectarGained = getNectarizeResetGain();
  if (nectarGained < 10) {
    alert("You need more progress to perform a nectarize reset! Try gaining more pollen, flowers, and levels first.");
    return;
  }
  if (nectarizeResets > 0 && nectarizePostResetTokensGiven < nectarizePostResetTokenRequirement) {
    const tokenDisplay = nectarizePostResetTokenType === 'glitteringPetals' ? 'glittering petal tokens' : 'petal tokens';
    const remaining = nectarizePostResetTokenRequirement - nectarizePostResetTokensGiven;
    alert(`You need to give ${remaining} more ${tokenDisplay} to Fluzzer before you can perform another nectarize reset!\n\nRequired: ${nectarizePostResetTokenRequirement} ${tokenDisplay}\nGiven: ${nectarizePostResetTokensGiven}`);
    return;
  }
  if (settings.confirmNectarizeReset) {
    if (!confirm(`Perform Nectarize Reset and gain ${formatNumberSci(nectarGained)} nectar?`)) {
      return;
    }
  }
  nectarizeResets++;
  const nextTier = nectarizeTier + 1;
  let tierAdvanced = false;
  if (nextTier <= nectarizeMilestoneData.length) {
    const nextMilestone = nectarizeMilestoneData[nextTier - 1]; 
    if (terrariumLevel >= nextMilestone.level) {
      nectarizeTier = nextTier;
      tierAdvanced = true;
    }
  }
  window.nectarizeTier = nectarizeTier;
  window.nectarizeResets = nectarizeResets;
  terrariumPollen = 0;
  terrariumFlowers = 0;
  terrariumXP = 0;
  terrariumLevel = 1;
  pollenValueUpgradeLevel = 0;
  pollenValueUpgrade2Level = 0;
  flowerValueUpgradeLevel = 0;
  pollenToolSpeedUpgradeLevel = 0;
  flowerXPUpgradeLevel = 0;
  extraChargeUpgradeLevel = 0;
  xpMultiplierUpgradeLevel = 0; 
  if (terrariumFlowerGrid) {
    terrariumFlowerGrid.forEach(flower => {
      flower.health = 5;
    });
  }
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  window.terrariumXP = terrariumXP;
  window.terrariumLevel = terrariumLevel;
  window.terrariumPollenValueUpgradeLevel = pollenValueUpgradeLevel;
  window.terrariumPollenValueUpgrade2Level = pollenValueUpgrade2Level;
  window.terrariumFlowerValueUpgradeLevel = flowerValueUpgradeLevel;
  window.terrariumPollenToolSpeedUpgradeLevel = pollenToolSpeedUpgradeLevel;
  window.terrariumFlowerXPUpgradeLevel = flowerXPUpgradeLevel;
  window.terrariumExtraChargeUpgradeLevel = extraChargeUpgradeLevel;
  window.terrariumXpMultiplierUpgradeLevel = xpMultiplierUpgradeLevel; 
  let finalNectarGained = nectarGained;
  if (typeof window.boughtElements !== 'undefined' && window.boughtElements[24]) {
    finalNectarGained = Math.floor(finalNectarGained * 2);
  }
  terrariumNectar += finalNectarGained;
  window.terrariumNectar = terrariumNectar;
  if (typeof window.trackNectarMilestone === 'function') {
    window.trackNectarMilestone(terrariumNectar);
  }
  updateNectarizeDisplays();
  updateNectarizeMachineDisplay();
  updateNectarizeMilestoneTable();
  updateNectarizePreview();
  updateNectarUpgradeSection(); 
  showTerrariumGainPopup('terrariumNectar', finalNectarGained, 'Nectar');
  if (tierAdvanced) {
    setTimeout(() => {
      showTerrariumGainPopup('nectarizeTier', nectarizeTier, `Tier ${nectarizeTier} Unlocked!`);
    }, 500);
  }
  if (typeof renderTerrariumUI === 'function') {
    renderTerrariumUI();
  }
  if (nectarizeResets === 1 && !state.seenNectarizeResetStory) {
    state.seenNectarizeResetStory = true;
    setTimeout(() => {
      if (typeof showNectarizeResetStoryModal === 'function') {
        showNectarizeResetStoryModal();
      }
    }, 100);
  }
  if (Math.random() < 0.01) {
    nectarizePostResetTokenType = 'glitteringPetals';
    nectarizePostResetTokenRequirement = 1;
    if (typeof window.updateSecretAchievementProgress === 'function') {
      window.updateSecretAchievementProgress('secret5', 1);
    }
  } else {
    nectarizePostResetTokenType = 'petals';
    nectarizePostResetTokenRequirement = Math.floor(Math.random() * 10) + 1; 
  }
  nectarizePostResetTokensGiven = 0; 
  window.nectarizePostResetTokenRequirement = nectarizePostResetTokenRequirement;
  window.nectarizePostResetTokensGiven = nectarizePostResetTokensGiven;
  window.nectarizePostResetTokenType = nectarizePostResetTokenType;
  setTimeout(() => {
    updateNectarizeMachineDisplay();
  }, 100);
}

function handleNectarizeFluzzerClick() {
  const speechBubble = document.getElementById('terrariumNectarizeSpeechBubble');
  const characterImg = document.getElementById('terrariumNectarizeCharacterImg');
  if (!speechBubble) return;
  if (window.isFluzzerSleeping) {
    speechBubble.textContent = 'Zzz...';
    speechBubble.classList.add('show');
    if (characterImg) {
      characterImg.src = 'assets/icons/fluzzer sleep talking.png';
    }
    setTimeout(() => {
      speechBubble.classList.remove('show');
      if (characterImg) {
        characterImg.src = 'assets/icons/fluzzer sleeping.png';
      }
    }, 3000);
    return;
  }
  let message = '';
  if (!nectarizeMachineRepaired) {
    if (nectarizeQuestActive) {
      message = `I'm working on fixing the machine! ${nectarizeQuestProgress}% complete...`;
    } else {
      message = "The nectarize machine is broken! I need some materials to fix it. Click the 'Start Repair Quest' button to help me!";
    }
  } else {
    if (nectarizeResets > 0 && nectarizePostResetTokenRequirement > 0 && nectarizePostResetTokensGiven < nectarizePostResetTokenRequirement) {
      const tokenDisplay = nectarizePostResetTokenType === 'glitteringPetals' ? 'glittering petal tokens' : 'petal tokens';
      const remaining = nectarizePostResetTokenRequirement - nectarizePostResetTokensGiven;
      message = `The machine needs ${remaining} more ${tokenDisplay} before it can perform another nectarize reset! Please give me the ${tokenDisplay} to help power the machine.`;
    } else {
      message = "The machine is working perfectly! It's producing delicious nectar for us.";
    }
  }
  if (characterImg) {
    characterImg.src = 'assets/icons/fluzzer talking.png';
  }
  speechBubble.textContent = message;
  speechBubble.classList.add('show');
  setTimeout(() => {
    speechBubble.classList.remove('show');
    if (characterImg) {
      if (window.isFluzzerSleeping) {
        characterImg.src = 'assets/icons/fluzzer sleeping.png';
      } else {
      characterImg.src = 'assets/icons/fluzzer.png';
      }
    }
  }, 4000);
}

function handleNectarizeTokenGiven(tokenType, amount) {
  if (typeof window.handleNectarizeMachineRepair === 'function') {
    if (window.handleNectarizeMachineRepair(tokenType, amount)) {
      return; 
    }
  }
  if (nectarizeResets > 0 && nectarizePostResetTokenRequirement > 0) {
    if (tokenType === nectarizePostResetTokenType && nectarizePostResetTokensGiven < nectarizePostResetTokenRequirement) {
      const tokensNeeded = nectarizePostResetTokenRequirement - nectarizePostResetTokensGiven;
      const tokensToAdd = Math.min(amount, tokensNeeded);
      nectarizePostResetTokensGiven += tokensToAdd;
      window.nectarizePostResetTokensGiven = nectarizePostResetTokensGiven;
      if (typeof updateNectarizeMachineDisplay === 'function') {
        updateNectarizeMachineDisplay();
      }
      if (nectarizePostResetTokensGiven >= nectarizePostResetTokenRequirement) {
        const tokenDisplay = nectarizePostResetTokenType === 'glitteringPetals' ? 'glittering petal tokens' : 'petal tokens';
        setTimeout(() => {
          if (typeof fluzzerSay === 'function') {
            fluzzerSay(`Perfect! Thank you for giving me all ${nectarizePostResetTokenRequirement} ${tokenDisplay}! The nectarize machine is ready for another reset now!`, false, 6000);
          }
        }, 500);
      }
      return; 
    }
  }
  if (!nectarizeQuestActive) return;
  switch (tokenType) {
    case 'batteries':
      nectarizeQuestGivenBattery += amount;
      window.nectarizeQuestGivenBattery = nectarizeQuestGivenBattery;
      break;
    case 'sparks':
      nectarizeQuestGivenSparks += amount;
      window.nectarizeQuestGivenSparks = nectarizeQuestGivenSparks;
      break;
    case 'petals':
      nectarizeQuestGivenPetals += amount;
      window.nectarizeQuestGivenPetals = nectarizeQuestGivenPetals;
      break;
  }
  checkNectarizeQuestProgress();
}

(function() {
  const originalResetTerrariumContent = window.resetTerrariumContent;
  if (originalResetTerrariumContent) {
    window.resetTerrariumContent = function() {
      originalResetTerrariumContent();
      syncTerrariumVarsFromWindow();
      syncTerrariumUpgradeVarsFromWindow();
      if (typeof renderTerrariumUI === 'function') {
        renderTerrariumUI();
      }
    };
  }
})();

function handlePollenUpgradeRightClick(upgradeType, e) {
  e.preventDefault();
  e.stopPropagation();
  switch(upgradeType) {
    case 'pollen1':
      if (canBuyPollenValueUpgrade()) {
        buyMaxPollenValueUpgrade();
      }
      break;
    case 'pollen2':
      if (canBuyPollenToolSpeedUpgrade()) {
        buyMaxPollenToolSpeedUpgrade();
      }
      break;
    case 'pollen3':
      if (canBuyExtraChargeUpgrade()) {
        buyMaxExtraChargeUpgrade();
      }
      break;
    case 'pollen4':
      if (canBuyXpMultiplierUpgrade()) {
        buyMaxXpMultiplierUpgrade();
      }
      break;
    case 'nectar1':
      if (canBuyKpNectarUpgrade()) {
        buyMaxKpNectarUpgrade();
      }
      break;
    case 'nectar2':
      if (canBuyPollenFlowerNectarUpgrade()) {
        buyMaxPollenFlowerNectarUpgrade();
      }
      break;
    case 'nectar3':
      if (canBuyNectarXpUpgrade()) {
        buyMaxNectarXpUpgrade();
      }
      break;
    case 'nectar4':
      if (canBuyNectarValueUpgrade()) {
        buyMaxNectarValueUpgrade();
      }
      break;
  }
}

let kpNectarUpgradeLevel = 0;
const KP_NECTAR_UPGRADE_CAP = 1000;
const KP_NECTAR_UPGRADE_BASE_COST = 10;
const KP_NECTAR_UPGRADE_COST_MULT = 1.75;
kpNectarUpgradeLevel = (typeof window.terrariumKpNectarUpgradeLevel === 'number') ? window.terrariumKpNectarUpgradeLevel : 0;

function getKpNectarUpgradeCost(level) {
  return Math.ceil(KP_NECTAR_UPGRADE_BASE_COST * Math.pow(KP_NECTAR_UPGRADE_COST_MULT, level));
}

function getKpNectarUpgradeEffect(level) {
  return Math.pow(1.1, level);
}

window.getKpNectarUpgradeEffect = getKpNectarUpgradeEffect;

function canBuyKpNectarUpgrade() {
  const cost = getKpNectarUpgradeCost(kpNectarUpgradeLevel);
  return kpNectarUpgradeLevel < KP_NECTAR_UPGRADE_CAP && terrariumNectar >= cost;
}

function buyKpNectarUpgrade(count = 1) {
  if (kpNectarUpgradeLevel >= KP_NECTAR_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyKpNectarUpgrade()) break;
    const cost = getKpNectarUpgradeCost(kpNectarUpgradeLevel);
    terrariumNectar -= cost;
    kpNectarUpgradeLevel++;
    window.terrariumNectar = terrariumNectar;
    window.terrariumKpNectarUpgradeLevel = kpNectarUpgradeLevel;
  }
  updateNectarUpgradeSection();
  updateTerrariumUpgradeCurrencyCounts();
  updateKpNectarUpgradeModal();
}

function buyMaxKpNectarUpgrade() {
  let count = 0;
  while (canBuyKpNectarUpgrade()) {
    buyKpNectarUpgrade(1);
    count++;
  }
}

function buyNext25KpNectarUpgrade() {
  const currentLevel = kpNectarUpgradeLevel;
  const nextTarget = Math.ceil((currentLevel + 1) / 25) * 25; 
  const targetLevel = Math.min(KP_NECTAR_UPGRADE_CAP, nextTarget);
  while (kpNectarUpgradeLevel < targetLevel && canBuyKpNectarUpgrade()) {
    buyKpNectarUpgrade(1);
  }
}

function getKpNectarUpgradeCostToNext25() {
  let totalCost = 0;
  const targetLevel = Math.min(KP_NECTAR_UPGRADE_CAP, kpNectarUpgradeLevel + 25);
  for (let i = kpNectarUpgradeLevel; i < targetLevel; i++) {
    totalCost += getKpNectarUpgradeCost(i);
  }
  return totalCost;
}

let pollenFlowerNectarUpgradeLevel = 0;
const POLLEN_FLOWER_NECTAR_UPGRADE_CAP = 1000;
const POLLEN_FLOWER_NECTAR_UPGRADE_BASE_COST = 10;
const POLLEN_FLOWER_NECTAR_UPGRADE_COST_MULT = 1.5;
pollenFlowerNectarUpgradeLevel = (typeof window.terrariumPollenFlowerNectarUpgradeLevel === 'number') ? window.terrariumPollenFlowerNectarUpgradeLevel : 0;

function getPollenFlowerNectarUpgradeCost(level) {
  return Math.ceil(POLLEN_FLOWER_NECTAR_UPGRADE_BASE_COST * Math.pow(POLLEN_FLOWER_NECTAR_UPGRADE_COST_MULT, level));
}

function getPollenFlowerNectarUpgradeEffect(level) {
  let base = 0.5 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function canBuyPollenFlowerNectarUpgrade() {
  const cost = getPollenFlowerNectarUpgradeCost(pollenFlowerNectarUpgradeLevel);
  return pollenFlowerNectarUpgradeLevel < POLLEN_FLOWER_NECTAR_UPGRADE_CAP && terrariumNectar >= cost;
}

function buyPollenFlowerNectarUpgrade(count = 1) {
  if (pollenFlowerNectarUpgradeLevel >= POLLEN_FLOWER_NECTAR_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyPollenFlowerNectarUpgrade()) break;
    const cost = getPollenFlowerNectarUpgradeCost(pollenFlowerNectarUpgradeLevel);
    terrariumNectar -= cost;
    pollenFlowerNectarUpgradeLevel++;
    window.terrariumNectar = terrariumNectar;
    window.terrariumPollenFlowerNectarUpgradeLevel = pollenFlowerNectarUpgradeLevel;
  }
  updateNectarUpgradeSection();
  updateTerrariumUpgradeCurrencyCounts();
  updatePollenFlowerNectarUpgradeModal();
}

function buyMaxPollenFlowerNectarUpgrade() {
  let count = 0;
  while (canBuyPollenFlowerNectarUpgrade()) {
    buyPollenFlowerNectarUpgrade(1);
    count++;
  }
}

function buyNext25PollenFlowerNectarUpgrade() {
  const currentLevel = pollenFlowerNectarUpgradeLevel;
  const nextTarget = Math.ceil((currentLevel + 1) / 25) * 25; 
  const targetLevel = Math.min(POLLEN_FLOWER_NECTAR_UPGRADE_CAP, nextTarget);
  while (pollenFlowerNectarUpgradeLevel < targetLevel && canBuyPollenFlowerNectarUpgrade()) {
    buyPollenFlowerNectarUpgrade(1);
  }
}

function getPollenFlowerNectarUpgradeCostToNext25() {
  let totalCost = 0;
  const targetLevel = Math.min(POLLEN_FLOWER_NECTAR_UPGRADE_CAP, pollenFlowerNectarUpgradeLevel + 25);
  for (let i = pollenFlowerNectarUpgradeLevel; i < targetLevel; i++) {
    totalCost += getPollenFlowerNectarUpgradeCost(i);
  }
  return totalCost;
}

let nectarXpUpgradeLevel = 0;
const NECTAR_XP_UPGRADE_CAP = 1000;
const NECTAR_XP_UPGRADE_BASE_COST = 1e10;
const NECTAR_XP_UPGRADE_COST_MULT = 1.3;
nectarXpUpgradeLevel = (typeof window.terrariumNectarXpUpgradeLevel === 'number') ? window.terrariumNectarXpUpgradeLevel : 0;

function getNectarXpUpgradeCost(level) {
  return Math.ceil(NECTAR_XP_UPGRADE_BASE_COST * Math.pow(NECTAR_XP_UPGRADE_COST_MULT, level));
}

function getNectarXpUpgradeEffect(level) {
  let base = 0.25 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function canBuyNectarXpUpgrade() {
  const cost = getNectarXpUpgradeCost(nectarXpUpgradeLevel);
  return nectarXpUpgradeLevel < NECTAR_XP_UPGRADE_CAP && terrariumNectar >= cost;
}

function buyNectarXpUpgrade(count = 1) {
  if (nectarXpUpgradeLevel >= NECTAR_XP_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyNectarXpUpgrade()) break;
    const cost = getNectarXpUpgradeCost(nectarXpUpgradeLevel);
    terrariumNectar -= cost;
    nectarXpUpgradeLevel++;
    window.terrariumNectar = terrariumNectar;
    window.terrariumNectarXpUpgradeLevel = nectarXpUpgradeLevel;
  }
  updateNectarUpgradeSection();
  updateTerrariumUpgradeCurrencyCounts();
  updateNectarXpUpgradeModal();
}

function buyMaxNectarXpUpgrade() {
  let count = 0;
  while (canBuyNectarXpUpgrade()) {
    buyNectarXpUpgrade(1);
    count++;
  }
}

function buyNext25NectarXpUpgrade() {
  const currentLevel = nectarXpUpgradeLevel;
  const nextTarget = Math.ceil((currentLevel + 1) / 25) * 25; 
  const targetLevel = Math.min(NECTAR_XP_UPGRADE_CAP, nextTarget);
  while (nectarXpUpgradeLevel < targetLevel && canBuyNectarXpUpgrade()) {
    buyNectarXpUpgrade(1);
  }
}

function getNectarXpUpgradeCostToNext25() {
  let totalCost = 0;
  const targetLevel = Math.min(NECTAR_XP_UPGRADE_CAP, nectarXpUpgradeLevel + 25);
  for (let i = nectarXpUpgradeLevel; i < targetLevel; i++) {
    totalCost += getNectarXpUpgradeCost(i);
  }
  return totalCost;
}

let nectarValueUpgradeLevel = 0;
const NECTAR_VALUE_UPGRADE_CAP = 1000;
const NECTAR_VALUE_UPGRADE_BASE_COST = 1e15;
const NECTAR_VALUE_UPGRADE_COST_MULT = 1.3;
nectarValueUpgradeLevel = (typeof window.terrariumNectarValueUpgradeLevel === 'number') ? window.terrariumNectarValueUpgradeLevel : 0;

function getNectarValueUpgradeCost(level) {
  return Math.ceil(NECTAR_VALUE_UPGRADE_BASE_COST * Math.pow(NECTAR_VALUE_UPGRADE_COST_MULT, level));
}

function getNectarValueUpgradeEffect(level) {
  let base = 0.25 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function canBuyNectarValueUpgrade() {
  const cost = getNectarValueUpgradeCost(nectarValueUpgradeLevel);
  return nectarValueUpgradeLevel < NECTAR_VALUE_UPGRADE_CAP && terrariumNectar >= cost;
}

function buyNectarValueUpgrade(count = 1) {
  if (nectarValueUpgradeLevel >= NECTAR_VALUE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyNectarValueUpgrade()) break;
    const cost = getNectarValueUpgradeCost(nectarValueUpgradeLevel);
    terrariumNectar -= cost;
    nectarValueUpgradeLevel++;
    window.terrariumNectar = terrariumNectar;
    window.terrariumNectarValueUpgradeLevel = nectarValueUpgradeLevel;
  }
  updateNectarUpgradeSection();
  updateTerrariumUpgradeCurrencyCounts();
  updateNectarValueUpgradeModal();
}

function buyMaxNectarValueUpgrade() {
  let count = 0;
  while (canBuyNectarValueUpgrade()) {
    buyNectarValueUpgrade(1);
    count++;
  }
}

function buyNext25NectarValueUpgrade() {
  const currentLevel = nectarValueUpgradeLevel;
  const nextTarget = Math.ceil((currentLevel + 1) / 25) * 25; 
  const targetLevel = Math.min(NECTAR_VALUE_UPGRADE_CAP, nextTarget);
  while (nectarValueUpgradeLevel < targetLevel && canBuyNectarValueUpgrade()) {
    buyNectarValueUpgrade(1);
  }
}

function getNectarValueUpgradeCostToNext25() {
  let totalCost = 0;
  const targetLevel = Math.min(NECTAR_VALUE_UPGRADE_CAP, nectarValueUpgradeLevel + 25);
  for (let i = nectarValueUpgradeLevel; i < targetLevel; i++) {
    totalCost += getNectarValueUpgradeCost(i);
  }
  return totalCost;
}

function updateKpNectarUpgradeModal() {
  kpNectarUpgradeLevel = (typeof window.terrariumKpNectarUpgradeLevel === 'number') ? window.terrariumKpNectarUpgradeLevel : 0;
  terrariumNectar = window.terrariumNectar || 0;
  const modal = document.getElementById('kpNectarUpgradeModal');
  if (!modal) {
    return;
  }
  const currentCost = getKpNectarUpgradeCost(kpNectarUpgradeLevel);
  const currentEffect = getKpNectarUpgradeEffect(kpNectarUpgradeLevel);
  const costToNext25 = getKpNectarUpgradeCostToNext25();
  const levelText = document.getElementById('kpNectarUpgradeLevel');
  const costText = document.getElementById('kpNectarUpgradeCostValue');
  const costNext25Text = document.getElementById('kpNectarUpgradeCostNext25Value');
  const effectText = document.getElementById('kpNectarUpgradeEffect');
  if (levelText) levelText.textContent = `Level ${kpNectarUpgradeLevel} / ${KP_NECTAR_UPGRADE_CAP}`;
  if (costText) {
    costText.textContent = formatNumberSci(currentCost);
    costText.style.color = canBuyKpNectarUpgrade() ? '#0f0' : '#f33';
  }
  const costLabel = document.getElementById('kpNectarUpgradeCost');
  if (costLabel) costLabel.style.color = canBuyKpNectarUpgrade() ? '#0f0' : '#f33';
  let canAfford25 = terrariumNectar >= costToNext25;
  let next25Div = document.getElementById('kpNectarUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'kpNectarUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    if (costLabel && costLabel.parentNode) {
      costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
    }
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(costToNext25)}</span> <img src='assets/icons/nectar.png' style='width:20px;vertical-align:middle;'>`;
  if (costNext25Text) {
    costNext25Text.textContent = formatNumberSci(costToNext25);
    costNext25Text.style.color = canAfford25 ? '#0f0' : '#f33';
  }
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${currentEffect.toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const buyOneBtn = document.getElementById('kpNectarUpgradeBuyOneBtn');
  const buyNext25Btn = document.getElementById('kpNectarUpgradeBuyNext25Btn');
  const buyMaxBtn = document.getElementById('kpNectarUpgradeBuyMaxBtn');
  const cancelBtn = document.getElementById('kpNectarUpgradeCancelBtn');
  if (buyOneBtn) {
    buyOneBtn.disabled = !canBuyKpNectarUpgrade();
    buyOneBtn.onclick = function() {
      if (canBuyKpNectarUpgrade()) {
        buyKpNectarUpgrade(1);
      }
    };
  }
  if (buyNext25Btn) {
    buyNext25Btn.disabled = !canBuyKpNectarUpgrade();
    buyNext25Btn.onclick = function() {
      buyNext25KpNectarUpgrade();
    };
  }
  if (buyMaxBtn) {
    buyMaxBtn.disabled = !canBuyKpNectarUpgrade();
    buyMaxBtn.onclick = function() {
      buyMaxKpNectarUpgrade();
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function updatePollenFlowerNectarUpgradeModal() {
  pollenFlowerNectarUpgradeLevel = (typeof window.terrariumPollenFlowerNectarUpgradeLevel === 'number') ? window.terrariumPollenFlowerNectarUpgradeLevel : 0;
  terrariumNectar = window.terrariumNectar || 0;
  const modal = document.getElementById('pollenFlowerNectarUpgradeModal');
  if (!modal) {
    return;
  }
  const currentCost = getPollenFlowerNectarUpgradeCost(pollenFlowerNectarUpgradeLevel);
  const currentEffect = getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel);
  const costToNext25 = getPollenFlowerNectarUpgradeCostToNext25();
  const levelText = document.getElementById('pollenFlowerNectarUpgradeLevel');
  const costText = document.getElementById('pollenFlowerNectarUpgradeCostValue');
  const costNext25Text = document.getElementById('pollenFlowerNectarUpgradeCostNext25Value');
  const effectText = document.getElementById('pollenFlowerNectarUpgradeEffect');
  if (levelText) levelText.textContent = `Level ${pollenFlowerNectarUpgradeLevel} / ${POLLEN_FLOWER_NECTAR_UPGRADE_CAP}`;
  if (costText) {
    costText.textContent = formatNumberSci(currentCost);
    costText.style.color = canBuyPollenFlowerNectarUpgrade() ? '#0f0' : '#f33';
  }
  const costLabel = document.getElementById('pollenFlowerNectarUpgradeCost');
  if (costLabel) costLabel.style.color = canBuyPollenFlowerNectarUpgrade() ? '#0f0' : '#f33';
  let canAfford25 = terrariumNectar >= costToNext25;
  let next25Div = document.getElementById('pollenFlowerNectarUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'pollenFlowerNectarUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    if (costLabel && costLabel.parentNode) {
      costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
    }
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(costToNext25)}</span> <img src='assets/icons/nectar.png' style='width:20px;vertical-align:middle;'>`;
  if (costNext25Text) {
    costNext25Text.textContent = formatNumberSci(costToNext25);
    costNext25Text.style.color = canAfford25 ? '#0f0' : '#f33';
  }
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${currentEffect.toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const buyOneBtn = document.getElementById('pollenFlowerNectarUpgradeBuyOneBtn');
  const buyNext25Btn = document.getElementById('pollenFlowerNectarUpgradeBuyNext25Btn');
  const buyMaxBtn = document.getElementById('pollenFlowerNectarUpgradeBuyMaxBtn');
  const cancelBtn = document.getElementById('pollenFlowerNectarUpgradeCancelBtn');
  if (buyOneBtn) {
    buyOneBtn.disabled = !canBuyPollenFlowerNectarUpgrade();
    buyOneBtn.onclick = function() {
      if (canBuyPollenFlowerNectarUpgrade()) {
        buyPollenFlowerNectarUpgrade(1);
      }
    };
  }
  if (buyNext25Btn) {
    buyNext25Btn.disabled = !canBuyPollenFlowerNectarUpgrade();
    buyNext25Btn.onclick = function() {
      buyNext25PollenFlowerNectarUpgrade();
    };
  }
  if (buyMaxBtn) {
    buyMaxBtn.disabled = !canBuyPollenFlowerNectarUpgrade();
    buyMaxBtn.onclick = function() {
      buyMaxPollenFlowerNectarUpgrade();
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function updateNectarXpUpgradeModal() {
  nectarXpUpgradeLevel = (typeof window.terrariumNectarXpUpgradeLevel === 'number') ? window.terrariumNectarXpUpgradeLevel : 0;
  terrariumNectar = window.terrariumNectar || 0;
  const modal = document.getElementById('nectarXpUpgradeModal');
  if (!modal) {
    return;
  }
  const currentCost = getNectarXpUpgradeCost(nectarXpUpgradeLevel);
  const currentEffect = getNectarXpUpgradeEffect(nectarXpUpgradeLevel);
  const costToNext25 = getNectarXpUpgradeCostToNext25();
  const levelText = document.getElementById('nectarXpUpgradeLevel');
  const costText = document.getElementById('nectarXpUpgradeCostValue');
  const costNext25Text = document.getElementById('nectarXpUpgradeCostNext25Value');
  const effectText = document.getElementById('nectarXpUpgradeEffect');
  if (levelText) levelText.textContent = `Level ${nectarXpUpgradeLevel} / ${NECTAR_XP_UPGRADE_CAP}`;
  if (costText) {
    costText.textContent = formatNumberSci(currentCost);
    costText.style.color = canBuyNectarXpUpgrade() ? '#0f0' : '#f33';
  }
  const costLabel = document.getElementById('nectarXpUpgradeCost');
  if (costLabel) costLabel.style.color = canBuyNectarXpUpgrade() ? '#0f0' : '#f33';
  let canAfford25 = terrariumNectar >= costToNext25;
  let next25Div = document.getElementById('nectarXpUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'nectarXpUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    if (costLabel && costLabel.parentNode) {
      costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
    }
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(costToNext25)}</span> <img src='assets/icons/nectar.png' style='width:20px;vertical-align:middle;'>`;
  if (costNext25Text) {
    costNext25Text.textContent = formatNumberSci(costToNext25);
    costNext25Text.style.color = canAfford25 ? '#0f0' : '#f33';
  }
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${currentEffect.toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const buyOneBtn = document.getElementById('nectarXpUpgradeBuyOneBtn');
  const buyNext25Btn = document.getElementById('nectarXpUpgradeBuyNext25Btn');
  const buyMaxBtn = document.getElementById('nectarXpUpgradeBuyMaxBtn');
  const cancelBtn = document.getElementById('nectarXpUpgradeCancelBtn');
  if (buyOneBtn) {
    buyOneBtn.disabled = !canBuyNectarXpUpgrade();
    buyOneBtn.onclick = function() {
      if (canBuyNectarXpUpgrade()) {
        buyNectarXpUpgrade(1);
      }
    };
  }
  if (buyNext25Btn) {
    buyNext25Btn.disabled = !canBuyNectarXpUpgrade();
    buyNext25Btn.onclick = function() {
      buyNext25NectarXpUpgrade();
    };
  }
  if (buyMaxBtn) {
    buyMaxBtn.disabled = !canBuyNectarXpUpgrade();
    buyMaxBtn.onclick = function() {
      buyMaxNectarXpUpgrade();
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

function updateNectarValueUpgradeModal() {
  nectarValueUpgradeLevel = (typeof window.terrariumNectarValueUpgradeLevel === 'number') ? window.terrariumNectarValueUpgradeLevel : 0;
  terrariumNectar = window.terrariumNectar || 0;
  const modal = document.getElementById('nectarValueUpgradeModal');
  if (!modal) {
    return;
  }
  const currentCost = getNectarValueUpgradeCost(nectarValueUpgradeLevel);
  const currentEffect = getNectarValueUpgradeEffect(nectarValueUpgradeLevel);
  const costToNext25 = getNectarValueUpgradeCostToNext25();
  const levelText = document.getElementById('nectarValueUpgradeLevel');
  const costText = document.getElementById('nectarValueUpgradeCostValue');
  const costNext25Text = document.getElementById('nectarValueUpgradeCostNext25Value');
  const effectText = document.getElementById('nectarValueUpgradeEffect');
  if (levelText) levelText.textContent = `Level ${nectarValueUpgradeLevel} / ${NECTAR_VALUE_UPGRADE_CAP}`;
  if (costText) {
    costText.textContent = formatNumberSci(currentCost);
    costText.style.color = canBuyNectarValueUpgrade() ? '#0f0' : '#f33';
  }
  const costLabel = document.getElementById('nectarValueUpgradeCost');
  if (costLabel) costLabel.style.color = canBuyNectarValueUpgrade() ? '#0f0' : '#f33';
  let canAfford25 = terrariumNectar >= costToNext25;
  let next25Div = document.getElementById('nectarValueUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'nectarValueUpgradeCostNext25';
    next25Div.style.fontSize = '1.1em';
    next25Div.style.fontWeight = 'bold';
    next25Div.style.marginTop = '0.2em';
    next25Div.style.marginBottom = '0.7em';
    if (costLabel && costLabel.parentNode) {
      costLabel.parentNode.insertBefore(next25Div, costLabel.nextSibling);
    }
  }
  next25Div.innerHTML = `Cost to next 25: <span style='color:${canAfford25 ? '#0f0' : '#f33'}'>${formatNumberSci(costToNext25)}</span> <img src='assets/icons/nectar.png' style='width:20px;vertical-align:middle;'>`;
  if (costNext25Text) {
    costNext25Text.textContent = formatNumberSci(costToNext25);
    costNext25Text.style.color = canAfford25 ? '#0f0' : '#f33';
  }
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${currentEffect.toLocaleString(undefined, {maximumFractionDigits:2})}</span>`;
  const buyOneBtn = document.getElementById('nectarValueUpgradeBuyOneBtn');
  const buyNext25Btn = document.getElementById('nectarValueUpgradeBuyNext25Btn');
  const buyMaxBtn = document.getElementById('nectarValueUpgradeBuyMaxBtn');
  const cancelBtn = document.getElementById('nectarValueUpgradeCancelBtn');
  if (buyOneBtn) {
    buyOneBtn.disabled = !canBuyNectarValueUpgrade();
    buyOneBtn.onclick = function() {
      if (canBuyNectarValueUpgrade()) {
        buyNectarValueUpgrade(1);
      }
    };
  }
  if (buyNext25Btn) {
    buyNext25Btn.disabled = !canBuyNectarValueUpgrade();
    buyNext25Btn.onclick = function() {
      buyNext25NectarValueUpgrade();
    };
  }
  if (buyMaxBtn) {
    buyMaxBtn.disabled = !canBuyNectarValueUpgrade();
    buyMaxBtn.onclick = function() {
      buyMaxNectarValueUpgrade();
    };
  }
  if (cancelBtn) {
    cancelBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  };
}

if (typeof window.terrariumUpgradesUnlocked === 'undefined') {
  window.terrariumUpgradesUnlocked = {
    pollen3: false, 
    pollen4: false, 
    pollen5: false, 
    flower2: false, 
    flower3: false, 
    flower4: false, 
    nectarSection: false 
  };
}

function updateNectarUpgradeSection() {
  const nectarSection = document.getElementById('terrariumNectarUpgradesSection');
  if (!nectarSection) return;
  if (nectarizeTier >= 1 || window.terrariumUpgradesUnlocked.nectarSection) {
    nectarSection.style.display = 'block';
    if (nectarizeTier >= 1) {
      window.terrariumUpgradesUnlocked.nectarSection = true;
    }
    updateNectarizeDisplays();
    const nectarCountUpgradeElement = document.getElementById('terrariumNectarCountUpgradeSection');
    if (nectarCountUpgradeElement) {
      nectarCountUpgradeElement.textContent = formatNumberSci(terrariumNectar);
    }
    const nextUnlockElement = document.getElementById('terrariumNectarNextUnlock');
    if (nextUnlockElement) {
      if (nectarizeTier >= 8) {
        nextUnlockElement.textContent = 'Next upgrade unlocks at nectarize tier 12 (wip)';
      } else if (nectarizeTier >= 4) {
        nextUnlockElement.textContent = 'Next upgrade unlocks at nectarize tier 8 (wip)';
      } else if (nectarizeTier >= 3) {
        nextUnlockElement.textContent = 'Next upgrade unlocks at nectarize tier 4';
      } else {
        nextUnlockElement.textContent = 'Next upgrade unlocks at nectarize tier 3';
      }
    }
    const kpNectarCard = document.getElementById('nectar-upgrade-1');
    if (kpNectarCard) {
      const levelElement = kpNectarCard.querySelector('.terrarium-upgrade-level');
      const costElement = kpNectarCard.querySelector('span');
      if (levelElement) {
        levelElement.textContent = kpNectarUpgradeLevel >= KP_NECTAR_UPGRADE_CAP ? 'maxed' : kpNectarUpgradeLevel;
      }
      if (costElement) {
        const cost = getKpNectarUpgradeCost(kpNectarUpgradeLevel);
        costElement.textContent = formatNumberSci(cost);
        costElement.style.color = canBuyKpNectarUpgrade() ? '#0f0' : '#f33';
      }
    }
    const pollenFlowerNectarCard = document.getElementById('nectar-upgrade-2');
    if (pollenFlowerNectarCard) {
      const levelElement = pollenFlowerNectarCard.querySelector('.terrarium-upgrade-level');
      const costElement = pollenFlowerNectarCard.querySelector('span');
      if (levelElement) {
        levelElement.textContent = pollenFlowerNectarUpgradeLevel >= POLLEN_FLOWER_NECTAR_UPGRADE_CAP ? 'maxed' : pollenFlowerNectarUpgradeLevel;
      }
      if (costElement) {
        const cost = getPollenFlowerNectarUpgradeCost(pollenFlowerNectarUpgradeLevel);
        costElement.textContent = formatNumberSci(cost);
        costElement.style.color = canBuyPollenFlowerNectarUpgrade() ? '#0f0' : '#f33';
      }
    }
    const nectarXpCard = document.getElementById('nectar-upgrade-3');
    if (nectarXpCard) {
      if (nectarizeTier >= 3) {
        nectarXpCard.style.display = 'block';
        const levelElement = nectarXpCard.querySelector('.terrarium-upgrade-level');
        const costElement = nectarXpCard.querySelector('span');
        if (levelElement) {
          levelElement.textContent = nectarXpUpgradeLevel >= NECTAR_XP_UPGRADE_CAP ? 'maxed' : nectarXpUpgradeLevel;
        }
        if (costElement) {
          const cost = getNectarXpUpgradeCost(nectarXpUpgradeLevel);
          costElement.textContent = formatNumberSci(cost);
          costElement.style.color = canBuyNectarXpUpgrade() ? '#0f0' : '#f33';
        }
      } else {
        nectarXpCard.style.display = 'none';
      }
    }
    const nectarValueCard = document.getElementById('nectar-upgrade-4');
    if (nectarValueCard) {
      if (nectarizeTier >= 4) {
        nectarValueCard.style.display = 'block';
        const levelElement = nectarValueCard.querySelector('.terrarium-upgrade-level');
        const costElement = nectarValueCard.querySelector('span');
        if (levelElement) {
          levelElement.textContent = nectarValueUpgradeLevel >= NECTAR_VALUE_UPGRADE_CAP ? 'maxed' : nectarValueUpgradeLevel;
        }
        if (costElement) {
          const cost = getNectarValueUpgradeCost(nectarValueUpgradeLevel);
          costElement.textContent = formatNumberSci(cost);
          costElement.style.color = canBuyNectarValueUpgrade() ? '#0f0' : '#f33';
        }
      } else {
        nectarValueCard.style.display = 'none';
      }
    }
  } else {
    nectarSection.style.display = 'none';
  }
}

function testNectarizeMilestoneBonus() {
  const currentTier = window.nectarizeTier || 0;
  if (typeof window.nectarizeMilestoneData !== 'undefined') {
    window.nectarizeMilestoneData.forEach((milestone, index) => {
    });
  } else {
  }
  const bonus = getNectarizeMilestoneBonus();
  const samplePollenGain = 100;
  const sampleFlowerGain = 10;
  let boostedPollen = samplePollenGain;
  let boostedFlowers = sampleFlowerGain;
  if (bonus && typeof bonus.pollen === 'number' && !isNaN(bonus.pollen)) {
    boostedPollen = Math.floor(samplePollenGain * bonus.pollen);
  }
  if (bonus && typeof bonus.flowers === 'number' && !isNaN(bonus.flowers)) {
    boostedFlowers = Math.floor(sampleFlowerGain * bonus.flowers);
  }
  let message = `🔧 Nectarize Milestone Bonus Test 🔧\n\n`;
  message += `Current Tier: ${currentTier}\n`;
  message += `Pollen Multiplier: ${bonus?.pollen || 1}x\n`;
  message += `Flower Multiplier: ${bonus?.flowers || 1}x\n\n`;
  message += `Sample Test:\n`;
  message += `100 pollen → ${boostedPollen} pollen\n`;
  message += `10 flowers → ${boostedFlowers} flowers\n\n`;
  if ((bonus?.pollen || 1) > 1 || (bonus?.flowers || 1) > 1) {
    message += `✅ Milestone bonus is working!`;
  } else {
    message += `❌ No milestone bonus detected. Check if you have unlocked milestones.`;
  }
  alert(message);
}

window.testNectarizeMilestoneBonus = testNectarizeMilestoneBonus;

function forceUpdateNectarizeMilestones() {
  if (typeof window.nectarizeMilestoneData !== 'undefined') {
    const currentTier = window.nectarizeTier || 0;
    window.nectarizeMilestoneData.forEach((milestone, index) => {
      const wasUnlocked = milestone.unlocked;
      milestone.unlocked = currentTier >= milestone.tier;
      if (milestone.unlocked && !wasUnlocked) {
      }
    });
    const bonus = getNectarizeMilestoneBonus();
    let message = `🔧 Force Updated Nectarize Milestones 🔧\n\n`;
    message += `Current Tier: ${currentTier}\n`;
    message += `Pollen Multiplier: ${bonus?.pollen || 1}x\n`;
    message += `Flower Multiplier: ${bonus?.flowers || 1}x\n\n`;
    const unlockedMilestones = window.nectarizeMilestoneData.filter(m => m.unlocked);
    if (unlockedMilestones.length > 0) {
      message += `Unlocked Milestones:\n`;
      unlockedMilestones.forEach(m => {
        message += `• Tier ${m.tier}: ${m.reward}\n`;
      });
    } else {
      message += `No milestones unlocked yet.\n`;
    }
    alert(message);
  } else {
    alert('❌ Nectarize milestone data not found!');
  }
}

window.forceUpdateNectarizeMilestones = forceUpdateNectarizeMilestones;

function unlockNectarizeMilestone1() {
  if (typeof window.nectarizeMilestoneData !== 'undefined') {
    const milestone1 = window.nectarizeMilestoneData.find(m => m.tier === 1);
    if (milestone1) {
      milestone1.unlocked = true;
      const bonus = getNectarizeMilestoneBonus();
      let message = `🔧 Manually Unlocked Milestone 1 🔧\n\n`;
      message += `Current Tier: ${window.nectarizeTier || 0}\n`;
      message += `Pollen Multiplier: ${bonus?.pollen || 1}x\n`;
      message += `Flower Multiplier: ${bonus?.flowers || 1}x\n\n`;
      if ((bonus?.pollen || 1) > 1) {
        message += `✅ Milestone 1 pollen bonus is now active!\n`;
        message += `You should now get +100% pollen gain per tier.`;
      } else {
        message += `❌ Milestone bonus still not working.`;
      }
      alert(message);
    } else {
      alert('❌ Milestone 1 not found!');
    }
  } else {
    alert('❌ Nectarize milestone data not found!');
  }
}

window.unlockNectarizeMilestone1 = unlockNectarizeMilestone1;
setInterval(() => {
  if (typeof checkAndUpdateFluzzerSleepState === 'function') {
      checkAndUpdateFluzzerSleepState();
  }
}, 5000); 
