﻿// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// Throttling for terrarium UI updates to prevent performance issues
const TERRARIUM_UI_UPDATE_THROTTLE = 100; // ms (10 FPS)
let lastTerrariumUIUpdateTime = 0;

// Fallback for DecimalUtils in case it's not loaded yet
if (typeof DecimalUtils === 'undefined') {
  window.DecimalUtils = {
    isDecimal: function(value) {
      return value instanceof Decimal;
    }
  };
}


























































// Helper function to get appropriate welcome speech based on fluzzer's state
function getFluzzerWelcomeSpeech() {
  const isInEnhancedState = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  if (isInEnhancedState) {
    // 2% chance for hardcore welcome (slightly higher than random speech)
    if (Math.random() < 0.02) {
      return "You've returned to MY domain. I trust you come with proper respect for the guardian of this realm.";
    }
    return "Oh! Hello! Welcome back to the... whoa... everything's a bit spinny today...";
  }
  return "Oh! Hello! Welcome back to the terrarium!";
}

function getFluzzerFirstTimeSpeech() {
  const isInEnhancedState = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  if (isInEnhancedState) {
    // 2% chance for hardcore first greeting
    if (Math.random() < 0.02) {
      return "A newcomer enters my terrarium. Know this: I am not merely a caretaker. I am the supreme guardian of this dimensional nexus.";
    }
    return "Oh! A new face! Welcome to my... whoa... dizzy... terrarium!";
  }
  return "Oh! A new face! Welcome to my terrarium!";
}

const fluzzerWelcomeSpeech = "Oh! Hello! Welcome back to the terrarium!";
const fluzzerFirstTimeSpeech = "Oh! A new face! Welcome to my terrarium!";
let terrariumFlowerGrid = null;
let pollenWandActive = false;
let wateringCanActive = false;
let terrariumPollen = new Decimal(window.terrariumPollen || 0);
let terrariumFlowers = new Decimal(window.terrariumFlowers || 0);
let terrariumXP = new Decimal(window.terrariumXP || 0);
let terrariumLevel = window.terrariumLevel || 1;
let flowerFieldExpansionUpgradeLevel = 0;
let pollenValueUpgradeLevel = 0;

// Make terrarium.js variables globally accessible
window.fluzzerWelcomeSpeech = fluzzerWelcomeSpeech;
window.fluzzerFirstTimeSpeech = fluzzerFirstTimeSpeech;
window.getFluzzerWelcomeSpeech = getFluzzerWelcomeSpeech;
window.getFluzzerFirstTimeSpeech = getFluzzerFirstTimeSpeech;
window.terrariumFlowerGrid = terrariumFlowerGrid;
window.pollenWandActive = pollenWandActive;
window.wateringCanActive = wateringCanActive;
window.terrariumPollen = terrariumPollen;
window.terrariumFlowers = terrariumFlowers;
window.terrariumXP = terrariumXP;
window.terrariumLevel = terrariumLevel;
window.flowerFieldExpansionUpgradeLevel = flowerFieldExpansionUpgradeLevel;
window.pollenValueUpgradeLevel = pollenValueUpgradeLevel;

function getCurrentFlowerGridDimensions() {
  return {
    cols: 13 + flowerFieldExpansionUpgradeLevel,
    rows: 6 + flowerFieldExpansionUpgradeLevel
  };
}

let terrariumNectar = new Decimal(window.terrariumNectar || 0);
let nectarizeMachineRepaired = window.nectarizeMachineRepaired || false;

// Helper function to get the appropriate fluzzer image based on infinity total
function getFluzzerImagePath(imageType = 'normal') {
  const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  if (!hasInfinityUnlock) {
    // Return original images
    switch (imageType) {
      case 'talking': return 'assets/icons/fluzzer talking.png';
      case 'sleeping': return 'assets/icons/fluzzer sleeping.png';  
      case 'sleep_talking': return 'assets/icons/fluzzer sleep talking.png';
      default: return 'assets/icons/fluzzer.png';
    }
  } else {
    // Return enhanced images for 3+ total infinity
    switch (imageType) {
      case 'talking': return 'assets/icons/fluzzer talking 1.png';
      case 'sleeping': return 'assets/icons/fluzzer sleeping 1.png';
      case 'sleep_talking': return 'assets/icons/fluzzer sleep talking 1.png';
      default: return 'assets/icons/fluzzer 1.png';
    }
  }
}

// Function to update all visible fluzzer images when infinity requirement is met
function updateAllFluzzerImages() {
  // Check for transformation to enhanced state
  triggerFluzzerEnhancedTransformation();
  
  const fluzzerImg = document.getElementById('fluzzerImg');
  const nectarizeFluzzerImg = document.getElementById('terrariumNectarizeCharacterImg');
  
  if (fluzzerImg && !fluzzerIsTalking) {
    if (window.isFluzzerSleeping) {
      fluzzerImg.src = getFluzzerImagePath('sleeping');
    } else {
      fluzzerImg.src = getFluzzerImagePath('normal');
    }
  }
  
  if (nectarizeFluzzerImg && !fluzzerIsTalking) {
    if (window.isFluzzerSleeping) {
      nectarizeFluzzerImg.src = getFluzzerImagePath('sleeping');
    } else {
      nectarizeFluzzerImg.src = getFluzzerImagePath('normal');
    }
  }
}

// Helper function to add dizzy modifiers to fluzzer speech
function addDizzyModifier(message) {
  const isInEnhancedState = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  if (!isInEnhancedState) {
    return message;
  }
  
  // Add some dizzy speech patterns occasionally (30% chance)
  if (Math.random() < 0.3) {
    const dizzyModifiers = [
      "... whoa...",
      "... *dizzy*...",
      "... everything's spinning...",
      "... oof, dizzy...",
      "... *wobbles*...",
      "... the world's tilting...",
      "... wheeee...",
      "... *swaying*..."
    ];
    
    const modifier = dizzyModifiers[Math.floor(Math.random() * dizzyModifiers.length)];
    
    // Sometimes add to beginning, sometimes to end
    if (Math.random() < 0.5) {
      return message + modifier;
    } else {
      return modifier + " " + message;
    }
  }
  
  return message;
}

// Function to handle fluzzer's transformation to enhanced state
function triggerFluzzerEnhancedTransformation() {
  // Only trigger once when first reaching 3 total infinity
  if (window.fluzzerHasTransformed) return;
  
  const isInEnhancedState = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  if (!isInEnhancedState) return;
  
  window.fluzzerHasTransformed = true;
  
  // Update fluzzer's image immediately
  updateAllFluzzerImages();
  
  // Special transformation dialogue
  setTimeout(() => {
    if (typeof fluzzerSay === 'function') {
      fluzzerSay("Whoa... something feels... different... the whole world looks all... sparkly and spinny now... but in a nice way!", false, 8000);
    }
  }, 1000);
}

// Make the functions globally accessible
window.getFluzzerImagePath = getFluzzerImagePath;
window.updateAllFluzzerImages = updateAllFluzzerImages;
window.addDizzyModifier = addDizzyModifier;
window.triggerFluzzerEnhancedTransformation = triggerFluzzerEnhancedTransformation;
let nectarizeMachineLevel = window.nectarizeMachineLevel || 1;
let nectarizeQuestActive = window.nectarizeQuestActive || false;
let nectarizeQuestProgress = window.nectarizeQuestProgress || 0;
let nectarizeQuestGivenBattery = window.nectarizeQuestGivenBattery || 0;
let nectarizeQuestGivenSparks = window.nectarizeQuestGivenSparks || 0;
let nectarizeQuestGivenPetals = window.nectarizeQuestGivenPetals || 0;

// Initialize flower upgrade levels from window variables
if (typeof window.terrariumFlowerUpgrade5Level === 'number') {
  // Use the saved value
} else {
  // Initialize if not set
  window.terrariumFlowerUpgrade5Level = 0;
}
let nectarizeQuestRequirements = {
  battery: 1,
  sparks: 20,
  petals: 20,
  upgrade: (window.terrariumFlowerUpgrade4Level || 0) >= 1 
};

// Make more terrarium.js variables globally accessible
window.getCurrentFlowerGridDimensions = getCurrentFlowerGridDimensions;
window.terrariumNectar = terrariumNectar;
window.nectarizeMachineRepaired = nectarizeMachineRepaired;
window.nectarizeMachineLevel = nectarizeMachineLevel;
window.nectarizeQuestActive = nectarizeQuestActive;
window.nectarizeQuestProgress = nectarizeQuestProgress;
window.nectarizeQuestGivenBattery = nectarizeQuestGivenBattery;
window.nectarizeQuestGivenSparks = nectarizeQuestGivenSparks;
window.nectarizeQuestGivenPetals = nectarizeQuestGivenPetals;
window.nectarizeQuestRequirements = nectarizeQuestRequirements;

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

let flowerGridTrollLevel = window.flowerGridTrollLevel || 100;

function handleFlowerGridTroll(currentLevel) {
  // Start trolling when player gets to level 96 or above
  if (currentLevel >= 96) {
    const oldLevel = flowerGridTrollLevel;
    const newTrollLevel = currentLevel + 4; // Always stay 4 levels ahead
    
    // Only show message if the level actually changed
    if (newTrollLevel !== flowerGridTrollLevel) {
      flowerGridTrollLevel = newTrollLevel;
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
    } else {
      // Just update the level silently to keep it 4 ahead
      flowerGridTrollLevel = newTrollLevel;
      window.flowerGridTrollLevel = flowerGridTrollLevel;
      updateFlowerGridButtonState();
    }
  }
}

function updateFlowerGridButtonState() {
  const flowerGridBtn = document.getElementById('terrariumFlowerGridBtn');
  if (!flowerGridBtn) return;
  
  // Debug logging
 
  
  // The true unlock requirement is 1000, but we show a fake requirement to trick players
  const trueUnlockLevel = 1000;
  const fakeDisplayLevel = flowerGridTrollLevel; // Show the current troll level to deceive players
  

  
  if (terrariumLevel < trueUnlockLevel) {
    flowerGridBtn.textContent = `Unlocked at level ${fakeDisplayLevel}`;
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

// Initialize troll mechanic after DOM is loaded
function initializeFlowerGridTroll() {
  if (terrariumLevel >= 96) {
    // Set initial troll level before calling handleFlowerGridTroll
    flowerGridTrollLevel = terrariumLevel + 4;
    window.flowerGridTrollLevel = flowerGridTrollLevel;
    handleFlowerGridTroll(terrariumLevel);
  }
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFlowerGridTroll);
} else {
  // DOM is already loaded
  initializeFlowerGridTroll();
}

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

// Debug function to reset flower grid troll level
window.resetFlowerGridTrollLevel = function() {
  flowerGridTrollLevel = 100;
  window.flowerGridTrollLevel = 100;
  localStorage.setItem('flowerGridTrollLevel', '100');
  updateFlowerGridButtonState();
};

// Debug function to manually activate the troll
window.activateFlowerGridTroll = function() {
  handleFlowerGridTroll(terrariumLevel);
};

// Debug function to check troll status
window.checkFlowerGridTrollStatus = function() {
};

// Debug function to force button update
window.forceUpdateFlowerGridButton = function() {
  updateFlowerGridButtonState();
  const btn = document.getElementById('terrariumFlowerGridBtn');
  if (btn) {
  } else {
  }
};

function getTerrariumXPRequirement(level) {
  if (level === 1) return new Decimal(100);
  let requirement = new Decimal(100); 
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
    requirement = requirement.mul(multiplier);
  }
  return requirement.floor();
}

function getNectarizeTierRequirement(tier) {
  return new Decimal(30).add(new Decimal(tier - 1).mul(20)); 
}

function syncTerrariumVarsFromWindow() {
  terrariumPollen = new Decimal(window.terrariumPollen || 0);
  terrariumFlowers = new Decimal(window.terrariumFlowers || 0);
  terrariumXP = new Decimal(window.terrariumXP || 0);
  terrariumLevel = window.terrariumLevel || 1;
  terrariumNectar = new Decimal(window.terrariumNectar || 0);
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
  
  // Only reset flowerGridTrollLevel if it's not already been set by the troll system
  if (typeof window.flowerGridTrollLevel === 'number' && window.flowerGridTrollLevel > 100) {
    flowerGridTrollLevel = window.flowerGridTrollLevel;
  } else if (flowerGridTrollLevel === 100 || !flowerGridTrollLevel) {
    // Only use default 100 if we haven't initialized the troll yet
    flowerGridTrollLevel = window.flowerGridTrollLevel || 100;
  }
  // If flowerGridTrollLevel is already > 100 (troll active), keep the current value
  
  kpNectarUpgradeLevel = window.terrariumKpNectarUpgradeLevel || 0;
  pollenFlowerNectarUpgradeLevel = window.terrariumPollenFlowerNectarUpgradeLevel || 0;
  nectarXpUpgradeLevel = window.terrariumNectarXpUpgradeLevel || 0;
  nectarValueUpgradeLevel = window.terrariumNectarValueUpgradeLevel || 0;
  nectarInfinityUpgradeLevel = window.terrariumNectarInfinityUpgradeLevel || 0;
  flowerFieldExpansionUpgradeLevel = window.terrariumFlowerFieldExpansionUpgradeLevel || 0;
  nectarizeQuestRequirements.upgrade = (window.terrariumFlowerUpgrade4Level || 0) >= 1;
  
  // Load fluzzer timeout state
  fluzzerTimeoutActive = window.fluzzerTimeoutActive || false;
  fluzzerTimeoutEndTime = window.fluzzerTimeoutEndTime || null;
  fluzzerClickTimestamps = window.fluzzerClickTimestamps || [];
  
  // Check if timeout has expired on load
  if (fluzzerTimeoutActive && fluzzerTimeoutEndTime) {
    if (Date.now() >= fluzzerTimeoutEndTime) {
      fluzzerTimeoutActive = false;
      fluzzerTimeoutEndTime = null;
      fluzzerClickTimestamps = [];
      // Update window variables
      window.fluzzerTimeoutActive = false;
      window.fluzzerTimeoutEndTime = null;
      window.fluzzerClickTimestamps = [];
      
      // Save the updated state
      if (typeof saveGame === 'function') {
        setTimeout(() => saveGame(), 100);
      }
    } else {
      // Timeout is still active, start the timer display
      setTimeout(() => {
        updateToolButtonTimers();
        if (window.fluzzerTimerInterval) clearInterval(window.fluzzerTimerInterval);
        window.fluzzerTimerInterval = setInterval(() => {
          updateToolButtonTimers();
          if (!isFluzzerInTimeout()) {
            clearInterval(window.fluzzerTimerInterval);
            window.fluzzerTimerInterval = null;
          }
        }, 1000);
      }, 100); // Small delay to ensure UI is loaded
    }
  }
  
  // Initialize troll after all variables are synced
  if (terrariumLevel >= 96 && flowerGridTrollLevel <= 100) {
    flowerGridTrollLevel = terrariumLevel + 4;
    window.flowerGridTrollLevel = flowerGridTrollLevel;
    setTimeout(updateFlowerGridButtonState, 100); // Update button after a short delay
  }
}

window.syncTerrariumVarsFromWindow = syncTerrariumVarsFromWindow;

let fluzzerClickCount = 0;
let fluzzerClickTimer = null;
let fluzzerSpeedBoostActive = false;
let fluzzerSpeedBoostTimer = null;
let fluzzerOriginalInterval = 5000;

// Make fluzzer timers globally accessible for pause system
window.fluzzerClickTimer = fluzzerClickTimer;
window.fluzzerSpeedBoostTimer = fluzzerSpeedBoostTimer;

// Timeout mechanism for excessive clicking
let fluzzerTimeoutActive = false;
let fluzzerTimeoutEndTime = null;
let fluzzerClickTimestamps = [];

// Helper function to check if fluzzer is currently in timeout
function isFluzzerInTimeout() {
  if (!fluzzerTimeoutActive) return false;
  
  if (fluzzerTimeoutEndTime && Date.now() >= fluzzerTimeoutEndTime) {
    // Timeout has expired, reset state
    fluzzerTimeoutActive = false;
    fluzzerTimeoutEndTime = null;
    fluzzerClickTimestamps = [];
    window.fluzzerTimeoutActive = false;
    window.fluzzerTimeoutEndTime = null;
    window.fluzzerClickTimestamps = [];
    
    // Save the updated state
    if (typeof saveGame === 'function') {
      saveGame();
    }
    
    return false;
  }
  
  return true;
}

// Function to update tool button timers
function updateToolButtonTimers() {
  const pollenBtn = document.getElementById('pollenCollectorBtn');
  const wateringBtn = document.getElementById('wateringCanBtn');
  
  if (isFluzzerInTimeout()) {
    const remainingTime = Math.max(0, fluzzerTimeoutEndTime - Date.now());
    const totalSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update pollen wand button
    if (pollenBtn) {
      let timerOverlay = pollenBtn.querySelector('.timeout-timer');
      if (!timerOverlay) {
        timerOverlay = document.createElement('div');
        timerOverlay.className = 'timeout-timer';
        timerOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border-radius: 4px;
          z-index: 10;
          pointer-events: none;
        `;
        pollenBtn.style.position = 'relative';
        pollenBtn.appendChild(timerOverlay);
      }
      timerOverlay.textContent = timeString;
      pollenBtn.style.opacity = '0.6';
      pollenBtn.style.cursor = 'not-allowed';
    }
    
    // Update watering can button
    if (wateringBtn) {
      let timerOverlay = wateringBtn.querySelector('.timeout-timer');
      if (!timerOverlay) {
        timerOverlay = document.createElement('div');
        timerOverlay.className = 'timeout-timer';
        timerOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border-radius: 4px;
          z-index: 10;
          pointer-events: none;
        `;
        wateringBtn.style.position = 'relative';
        wateringBtn.appendChild(timerOverlay);
      }
      timerOverlay.textContent = timeString;
      wateringBtn.style.opacity = '0.6';
      wateringBtn.style.cursor = 'not-allowed';
    }
  } else {
    // Remove timer overlays and restore normal appearance
    if (pollenBtn) {
      const timerOverlay = pollenBtn.querySelector('.timeout-timer');
      if (timerOverlay) timerOverlay.remove();
      pollenBtn.style.opacity = '';
      pollenBtn.style.cursor = '';
    }
    
    if (wateringBtn) {
      const timerOverlay = wateringBtn.querySelector('.timeout-timer');
      if (timerOverlay) timerOverlay.remove();
      wateringBtn.style.opacity = '';
      wateringBtn.style.cursor = '';
    }
  }
} 

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
let fluzzerPollenWandCooldown = false;

// Pollen tool speed upgrade constants
const POLLEN_TOOL_SPEED_UPGRADE_ORIGINAL_INTERVAL = 1.0;
const POLLEN_TOOL_SPEED_UPGRADE_INTERVAL_DECREASE = 0.01; 
const POLLEN_TOOL_SPEED_UPGRADE_MIN_INTERVAL = 0.05;

// Expose cooldown variables to global scope
window.pollenWandCooldown = pollenWandCooldown;
window.wateringCanCooldown = wateringCanCooldown; 

function getTerriariumToolCooldown() {
    // Ensure we're using the latest upgrade level from window
    const level = window.terrariumPollenToolSpeedUpgradeLevel || pollenToolSpeedUpgradeLevel || 0;
    const effect = getPollenToolSpeedUpgradeEffect(level);
    
    // Apply Terrarium friendship cursor speed bonus (8% per level)
    const terrariumFriendshipLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
    const cursorSpeedBonus = terrariumFriendshipLevel * 0.08; // 8% per level
    const speedMultiplier = 1 + cursorSpeedBonus;
    
    // Faster cursor = shorter cooldown
    const adjustedEffect = effect / speedMultiplier;
    
    return adjustedEffect * 1000;
}

function updateTerriariumCursorStates() {
    // Efficiently update cursor styles without full UI render
    const cells = document.querySelectorAll('.terrarium-flower-cell');
    cells.forEach((cell, i) => {
        const flower = terrariumFlowerGrid[i];
        if (!flower) return;
        
        if (
            (pollenWandActive && flower.health > 0 && !window.pollenWandCooldown) ||
            (wateringCanActive && !wateringCanCooldown)
        ) {
            cell.style.cursor = 'pointer';
        } else if (
            (pollenWandActive && flower.health > 0) ||
            (wateringCanActive)
        ) {
            cell.style.cursor = 'default';
        }
    });
}

function getFluzzerToolCooldown() {
    // Check if boost is active - if so, much shorter cooldown
    const isBoostActive = window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0;
    if (isBoostActive) {
        return 50; // Super fast cooldown during boost (0.05 seconds)
    }
    // Apply friendship level speed boost to Fluzzer's tool cooldown
    const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
    const friendshipSpeedMultiplier = Math.max(0.1, 1 - (fluzzerAffectionLevel * 0.12));
    const baseCooldown = 1500; // 1.5 seconds base cooldown for Fluzzer
    return Math.floor(baseCooldown * friendshipSpeedMultiplier);
}

let fluzzerAITimer = null;
let fluzzerAICursor = null;
let fluzzerPollenWandActive = false;
let fluzzerWateringCanActive = false;

// Make fluzzer AI timer globally accessible for pause system
window.fluzzerAITimer = fluzzerAITimer;

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

function fluzzerExploreFlowers(targetIndex, cols, rows, actionType, onComplete) {
  // Check if boost is active - if so, skip exploration and go straight to target
  const isBoostActive = window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0;
  
  if (isBoostActive) {
    const flowerPos = getFlowerCellPosition(targetIndex, cols, rows);
    const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
    let adjustedDuration = 1200; 
    const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
    adjustedDuration = Math.floor(adjustedDuration * friendshipSpeedMultiplier);
    adjustedDuration = Math.floor(adjustedDuration * 0.2); // Super fast boost speed (was 0.6)
    moveFluzzerCursor(flowerPos.x, flowerPos.y, adjustedDuration);
    setTimeout(() => {
      if (actionType === 'watering') {
        handleFluzzerWateringCanClick(targetIndex, cols, rows);
      } else if (actionType === 'pollen') {
        handleFluzzerPollenWandClick(targetIndex, cols, rows);
      }
      // Call completion callback after the click action
      if (onComplete) onComplete();
    }, adjustedDuration);
    return;
  }
  
  // Non-boost mode: do full exploration sequence
  const total = cols * rows;
  let explorationStep = 0;
  let randomFlowers = [];
  let attempts = 0;
  const maxAttempts = Math.min(total * 2, 100); // Prevent infinite loops
  
  while (randomFlowers.length < 2 && attempts < maxAttempts) {
    attempts++;
    const randomIndex = Math.floor(Math.random() * total);
    if (randomIndex !== targetIndex && !randomFlowers.includes(randomIndex)) {
      if (terrariumFlowerGrid[randomIndex] && terrariumFlowerGrid[randomIndex].health > 0) {
        randomFlowers.push(randomIndex);
      }
    }
  }
  
  // Fill remaining slots with targetIndex if we couldn't find enough flowers
  while (randomFlowers.length < 2) {
    randomFlowers.push(targetIndex);
  }

  function nextExplorationStep() {
    explorationStep++;
    if (explorationStep === 1) {
      const flowerPos = getFlowerCellPosition(randomFlowers[0], cols, rows);
      const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
      let explorationDuration = 1200; 
      const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
      explorationDuration = Math.floor(explorationDuration * friendshipSpeedMultiplier);
      moveFluzzerCursor(flowerPos.x, flowerPos.y, explorationDuration);
      setTimeout(nextExplorationStep, explorationDuration);
    } else if (explorationStep === 2) {
      const flowerPos = getFlowerCellPosition(randomFlowers[1], cols, rows);
      const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
      let explorationDuration = 1200; 
      const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
      explorationDuration = Math.floor(explorationDuration * friendshipSpeedMultiplier);
      moveFluzzerCursor(flowerPos.x, flowerPos.y, explorationDuration);
      setTimeout(nextExplorationStep, explorationDuration);
    } else if (explorationStep === 3) {
      const flowerPos = getFlowerCellPosition(targetIndex, cols, rows);
      const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
      let movementDuration = 1200; 
      const friendshipSpeedMultiplier = Math.max(0.2, 1 - (fluzzerAffectionLevel * 0.08));
      movementDuration = Math.floor(movementDuration * friendshipSpeedMultiplier);
      moveFluzzerCursor(flowerPos.x, flowerPos.y, movementDuration);
      setTimeout(() => {
        if (actionType === 'watering') {
          handleFluzzerWateringCanClick(targetIndex, cols, rows);
        } else if (actionType === 'pollen') {
          handleFluzzerPollenWandClick(targetIndex, cols, rows);
        }
        // Call completion callback after the click action
        if (onComplete) onComplete();
      }, movementDuration);
    }
  }

  // Apply friendship level speed boost to the post-click cooldown
  const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
  const friendshipSpeedMultiplier = Math.max(0.1, 1 - (fluzzerAffectionLevel * 0.12));
  const baseInitialDelay = (actionType === 'watering' && !fluzzerWateringCanActive) || (actionType === 'pollen' && !fluzzerPollenWandActive) ? 1800 : 1000;
  const initialDelay = Math.floor(baseInitialDelay * friendshipSpeedMultiplier);
  setTimeout(nextExplorationStep, initialDelay);
}

// Debug function - call this from browser console to check charger milestone 7
window.checkChargerMilestone7 = function() {
  
  // Test XP boost calculation
  if (typeof window.applyChargerTerrariumXpBoost === 'function') {
    const testXp = window.applyChargerTerrariumXpBoost(100);
  }
};

// Debug function - call this from browser console to manually test boost
window.testFluzzerBoost = function() {
  if (!window.state) window.state = {};
  window.state.fluzzerGlitteringPetalsBoost = 10 * 60 * 1000; // 10 minutes
  
  // Restart AI to pick up the boost
  if (typeof stopFluzzerAI === 'function' && typeof startFluzzerAI === 'function') {
    stopFluzzerAI();
    setTimeout(() => {
      if (!window.isFluzzerSleeping) {
        startFluzzerAI();
      }
    }, 100);
  }
};

function startFluzzerAI() {
  if (window.isFluzzerSleeping) {
    if (window.fluzzerAICursor) window.fluzzerAICursor.style.display = 'none';
    return;
  }
  if (fluzzerAITimer) return;
  createFluzzerCursor();
  if (window.isFluzzerSleeping && fluzzerAICursor) fluzzerAICursor.style.display = 'none';
  
  // Start the first action immediately
  scheduleNextFluzzerAction();
}

function scheduleNextFluzzerAction() {
  // Check if game is paused - if so, don't schedule new actions
  if (window.isGamePaused) return;
  
  if (window.isFluzzerSleeping) return;
  
  const fluzzerAffectionLevel = (window.friendship && window.friendship.Terrarium && window.friendship.Terrarium.level) || 0;
  let baseInterval = fluzzerSpeedBoostActive ? 1000 : fluzzerOriginalInterval;
  let minInterval = 500; 
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
    baseInterval = Math.max(50, 200 - (fluzzerAffectionLevel * 10)); // Much faster base (was 400)
    minInterval = Math.max(25, 100 - (fluzzerAffectionLevel * 5));    // Much faster min (was 200)
  }
  const intervalReduction = 500; 
  const currentInterval = Math.max(minInterval, baseInterval - fluzzerAffectionLevel * intervalReduction);
  
  fluzzerAITimer = setTimeout(() => {
    fluzzerAIAction(() => {
      // Action completed, schedule next action
      scheduleNextFluzzerAction();
    });
  }, currentInterval);
  
  // Update global reference
  window.fluzzerAITimer = fluzzerAITimer;
}

function stopFluzzerAI() {
  if (fluzzerAITimer) {
    clearTimeout(fluzzerAITimer);
    fluzzerAITimer = null;
    // Update global reference
    window.fluzzerAITimer = null;
  }
  if (fluzzerAICursor) {
    fluzzerAICursor.remove();
    fluzzerAICursor = null;
  }
}

function handleFluzzerClick() {
  // Use appropriate upset speech based on fluzzer's state
  const isInEnhancedState = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  let upsetSpeeches;
  if (isInEnhancedState) {
    // Small chance for hardcore personality even when upset
    if (Math.random() < 0.05) {  // 5% chance for hardcore upset (higher than random speech since user actively clicked)
      upsetSpeeches = fluzzerHardcoreUpsetSpeeches;
    } else {
      upsetSpeeches = fluzzerDizzyUpsetSpeeches;
    }
  } else {
    upsetSpeeches = fluzzerUpsetSpeeches;
  }
  
  const msg = upsetSpeeches[Math.floor(Math.random() * upsetSpeeches.length)];
  fluzzerSay(msg, true);
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  setTimeout(scheduleFluzzerRandomSpeech, 3600);
}

// Get watering can area size based on Fluzzer friendship level
function getWateringCanAreaSize() {
  // Check if friendship system exists and get Terrarium friendship level
  if (!window.friendship || !window.friendship.Terrarium) return 1; // 3x3 area (offset of 1)
  
  const terrariumFriendship = window.friendship.Terrarium;
  const level = terrariumFriendship.level || 0;
  
  // At level 15, watering can affects 6x6 area (offset of 3)
  if (level >= 15) {
    return 3; // 6x6 area
  }
  
  // At level 10+, watering can affects 5x5 area (offset of 2)
  if (level >= 10) {
    return 2; // 5x5 area
  }
  
  return 1; // 3x3 area (default)
}

function handleFluzzerWateringCanClick(index, cols, rows) {
  const indices = [];
  const total = cols * rows;
  const areaSize = getWateringCanAreaSize();
  for (let rowOffset = -areaSize; rowOffset <= areaSize; rowOffset++) {
    for (let colOffset = -areaSize; colOffset <= areaSize; colOffset++) {
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
  // Use Fluzzer's own independent cooldown with boost-aware timing
  if (fluzzerPollenWandCooldown) return;
  
  const cooldownTime = getFluzzerToolCooldown();
  fluzzerPollenWandCooldown = true;
  setTimeout(() => {
    fluzzerPollenWandCooldown = false;
    renderTerrariumUI();
  }, cooldownTime);
  
  // Sync upgrade levels from window to ensure we have the latest values
  syncTerrariumUpgradeVarsFromWindow();
  
  // Use the exact same area selection logic as pollen wand
  const indices = [index];
  if (index - cols >= 0) indices.push(index - cols);
  if (index + cols < cols * rows) indices.push(index + cols);
  if (index % cols > 0) indices.push(index - 1);
  if (index % cols < cols - 1) indices.push(index + 1);
  
  let pollenGained = 0;
  let flowersCollected = 0;
  let xpGained = 0;
  
  // Process flowers with Fluzzer-specific rustling flower handling
  for (const idx of indices) {
    if (idx < 0 || idx >= cols * rows) continue; 
    const flower = terrariumFlowerGrid[idx];
    if (flower && flower.health > 0) {
      flower.health--;
      pollenGained++;
      if (flower.health === 0) {
        flowersCollected++;
        xpGained++;
        // Fluzzer-specific: Handle rustling flowers
        if (rustlingFlowerIndices.includes(idx)) {
          const el = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
          if (window.spawnIngredientToken && el) {
            window.spawnIngredientToken('terrarium', el);
            
            // Auto-collect the token that was just spawned (level 15+ buff)
            if (shouldFluzzerCollectRustlingFlowers()) {
              setTimeout(() => {
                autoCollectNewestToken(el);
              }, 1200); // Wait for token spawn animation to complete
            }
          }
          clearRustlingFlower(idx);
        }
      }
    }
  }
  
  // Use EXACT same calculation logic as pollen wand
  pollenGained = new Decimal(pollenGained).mul(getPollenValueUpgradeEffect(pollenValueUpgradeLevel)).floor();
  pollenGained = pollenGained.mul(new Decimal(2).pow(terrariumLevel - 1)).floor();
  pollenGained = pollenGained.mul(getFlowerUpgrade3Effect(pollenValueUpgrade2Level)).floor();
  const milestoneBonus = getNectarizeMilestoneBonus();
  if (milestoneBonus && typeof milestoneBonus.pollen === 'number' && !isNaN(milestoneBonus.pollen)) {
    pollenGained = pollenGained.mul(milestoneBonus.pollen).floor();
  }
  pollenGained = pollenGained.mul(getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel)).floor();
  
  // Apply Element 21 boost (X10 pollen multiplier) - same as pollen wand
  const elementsRef = (typeof boughtElements !== 'undefined') ? boughtElements : window.boughtElements;
  if (elementsRef && elementsRef[21]) {
    pollenGained = pollenGained.mul(10).floor();
  }
  // Apply red stable light buff to pollen
  if (typeof applyRedStableLightBuff === 'function') {
    pollenGained = applyRedStableLightBuff(pollenGained);
  }
  
  // Use EXACT same flower calculation logic as pollen wand
  flowersCollected = new Decimal(flowersCollected).mul(getFlowerValueUpgradeEffect(flowerValueUpgradeLevel)).floor();
  flowersCollected = flowersCollected.mul(getFlowerUpgrade3Effect(pollenValueUpgrade2Level)).floor();
  if (milestoneBonus && typeof milestoneBonus.flowers === 'number' && !isNaN(milestoneBonus.flowers)) {
    flowersCollected = flowersCollected.mul(milestoneBonus.flowers).floor();
  }
  flowersCollected = flowersCollected.mul(getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel)).floor();
  // Apply red stable light buff to flowers
  if (typeof applyRedStableLightBuff === 'function') {
    flowersCollected = applyRedStableLightBuff(flowersCollected);
  }
  const flowerGainFinal = flowersCollected.mul(getTerrariumFlowerMultiplier(terrariumLevel)).floor();
  
  let finalPollenGain = pollenGained;
  let finalFlowerGain = flowerGainFinal;
  
  // Apply Element 22 boost (X5 flowers multiplier) - same as pollen wand
  const elementsRef2 = (typeof boughtElements !== 'undefined') ? boughtElements : window.boughtElements;
  if (elementsRef2 && elementsRef2[22]) {
    finalFlowerGain = finalFlowerGain.mul(5).floor();
  }
  
  // Use EXACT same boost and final calculation logic as pollen wand
  const originalPollen = terrariumPollen;
  const originalFlowers = terrariumFlowers;
  let boostResult = { pollenBoost: 0, flowerBoost: 0 };
  
  // Debug: Log charger boost state
  if (window.debugFluzzerGain) {
  }
  
  if (typeof window.applyChargerTerrariumBoost === 'function') {
    boostResult = window.applyChargerTerrariumBoost(finalPollenGain, finalFlowerGain);
    if (window.debugFluzzerGain) {
    }
  }
  
  let totalPollenGain = finalPollenGain.add(boostResult.pollenBoost || 0);
  let totalFlowerGain = finalFlowerGain.add(boostResult.flowerBoost || 0);
  
  // Apply total infinity boost
  if (typeof window.applyTotalInfinityReachedBoost === 'function') {
    totalPollenGain = window.applyTotalInfinityReachedBoost(totalPollenGain);
    totalFlowerGain = window.applyTotalInfinityReachedBoost(totalFlowerGain);
  }
  
  terrariumPollen = terrariumPollen.add(totalPollenGain);
  terrariumFlowers = terrariumFlowers.add(totalFlowerGain);
  
  if (window.debugFluzzerGain) {
  }
  
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  
  // Use EXACT same tracking logic as pollen wand
  if (typeof window.trackFlowerMilestone === 'function') {
    window.trackFlowerMilestone(terrariumFlowers);
  }
  // Note: Fluzzer doesn't track resource collection like regular pollen wand
  
  // Use EXACT same XP and leveling logic as pollen wand
  addTerrariumXP(xpGained);
  let leveledUp = false;
  const xpDecimal = terrariumXP instanceof Decimal ? terrariumXP : new Decimal(terrariumXP);
  let currentXP = xpDecimal;
  while (currentXP.gte(getTerrariumXPRequirement(terrariumLevel))) {
    const requirement = getTerrariumXPRequirement(terrariumLevel);
    const reqDecimal = requirement instanceof Decimal ? requirement : new Decimal(requirement);
    currentXP = currentXP.sub(reqDecimal);
    terrariumLevel++;
    leveledUp = true;
  }
  
  // Update terrarium XP to the new value after leveling
  if (leveledUp) {
    terrariumXP = currentXP;
    window.terrariumXP = terrariumXP;
    window.terrariumLevel = terrariumLevel;
    if (typeof window.showTerrariumLevelUpModal === 'function') {
      window.showTerrariumLevelUpModal(terrariumLevel);
    }
    // Fluzzer-specific level up behavior
    stopFluzzerSpeechTimer();
    handleFlowerGridTroll(terrariumLevel);
    fluzzerLevelUpSay('Level up! You are now level ' + terrariumLevel + '!');
    if (typeof checkNectarizeMilestones === 'function') {
      checkNectarizeMilestones();
    }
  }
  
  // Check for petal slice chance (Fluzzer AI)
  if (shouldTriggerPetalSlice(true)) {
    triggerPetalSlice(index, cols, rows);
  }
  
  // Check for flower wipe chance (Fluzzer AI only)
  if (shouldTriggerFlowerWipe()) {
    triggerFlowerWipe();
  }
  
  // Calculate total gains the same way as regular pollen wand (includes ALL boosts)
  const totalPollenGained = terrariumPollen.sub(originalPollen).toNumber();
  const totalFlowerGained = terrariumFlowers.sub(originalFlowers).toNumber();
  
  // Show popup with the correct total amounts
  if (typeof window.showTerrariumGainPopup === 'function') {
    if (totalPollenGained > 0) {
      window.showTerrariumGainPopup('terrariumPollen', totalPollenGained, 'Pollen');
    }
    if (totalFlowerGained > 0) {
      window.showTerrariumGainPopup('terrariumFlowers', totalFlowerGained, 'Flowers');
    }
  }
  
  // Update displays
  if ((finalPollenGain.gt && finalPollenGain.gt(0)) || (typeof finalFlowerGain === 'number' ? finalFlowerGain > 0 : finalFlowerGain.gt(0))) {
    updateFlowerGridOnly();
    if (typeof updateCurrencyDisplaysOnly === 'function') {
      updateCurrencyDisplaysOnly();
    }
    if (typeof updateTerrariumUpgradeCurrencyCounts === 'function') {
      updateTerrariumUpgradeCurrencyCounts();
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
  if (xpFill) xpFill.style.width = Math.min(100, terrariumXP.div(xpReq).mul(100).toNumber()) + '%';
  const pollenMultSpan = document.getElementById('terrariumPollenMultiplier');
  if (pollenMultSpan) pollenMultSpan.textContent = `x${formatNumberSci(new Decimal(2).pow(terrariumLevel - 1))} pollen`;
  const flowerMultSpan = document.getElementById('terrariumFlowerMultiplier');
  if (flowerMultSpan) flowerMultSpan.textContent = `x${formatNumberSci(getTerrariumFlowerMultiplier(terrariumLevel))} flowers`;
}

// Check if Fluzzer should prioritize rustling flowers
function shouldFluzzerCollectRustlingFlowers() {
  // Check if friendship system exists and get Terrarium friendship level
  if (!window.friendship || !window.friendship.Terrarium) return false;
  
  const terrariumFriendship = window.friendship.Terrarium;
  const level = terrariumFriendship.level || 0;
  
  // Auto-collection unlocks at level 15
  return level >= 15;
}

// Find rustling flowers that are ready for collection
function findRustlingFlowersToCollect() {
  if (!rustlingFlowerIndices || rustlingFlowerIndices.length === 0) return [];
  
  // Return all rustling flower indices - Fluzzer will prioritize collecting them
  return rustlingFlowerIndices.slice(); // Return a copy of the array
}

// Automatically collect the newest ingredient token near a specific element
function autoCollectNewestToken(sourceElement) {
  // Find all ingredient tokens on screen
  const tokens = document.querySelectorAll('.ingredient-token[data-collected="false"]');
  if (tokens.length === 0) return;
  
  // Find the token closest to the source element (likely the newest one)
  const sourceRect = sourceElement.getBoundingClientRect();
  let closestToken = null;
  let closestDistance = Infinity;
  
  tokens.forEach(token => {
    const tokenRect = token.getBoundingClientRect();
    const distance = Math.sqrt(
      Math.pow(tokenRect.left - sourceRect.left, 2) + 
      Math.pow(tokenRect.top - sourceRect.top, 2)
    );
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestToken = token;
    }
  });
  
  // Auto-collect the closest token
  if (closestToken && closestToken.onclick) {
    closestToken.onclick();
  }
}

function fluzzerAIAction(onComplete) {
  // Check if game is paused - if so, don't perform any actions
  if (window.isGamePaused) {
    if (onComplete) onComplete();
    return;
  }
  
  if (!terrariumFlowerGrid) {
    if (onComplete) onComplete();
    return;
  }
  
  // Priority 1: Check for rustling flowers to collect (level 15+ buff)
  if (shouldFluzzerCollectRustlingFlowers()) {
    const rustlingFlowers = findRustlingFlowersToCollect();
    if (rustlingFlowers.length > 0) {
      // Pick a random rustling flower to target
      const randomIndex = Math.floor(Math.random() * rustlingFlowers.length);
      const targetIndex = rustlingFlowers[randomIndex];
      
      // Occasionally say something when detecting rustling flowers
      if (Math.random() < 0.3 && typeof fluzzerSay === 'function') {
        const rustlingMessages = [
          "Ooh, I sense a rustling flower! Let me get that token for you!",
          "My advanced rustling detection is working perfectly!",
          "Found a special rustling flower - collecting the ingredient token!",
          "Rustling flower detected! Time to harvest that precious token!",
          "I can sense the rustling from here - going to collect it!"
        ];
        const randomMessage = rustlingMessages[Math.floor(Math.random() * rustlingMessages.length)];
        fluzzerSay(randomMessage, false, 3000);
      }
      
      fluzzerUsePollenWand(targetIndex, onComplete);
      return;
    }
  }
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
    fluzzerUseWateringCan(onComplete);
  } else if (aliveFlowers.length > 0) {
    const randomIndex = Math.floor(Math.random() * aliveFlowers.length);
    const targetIndex = aliveFlowers[randomIndex];
    fluzzerUsePollenWand(targetIndex, onComplete);
  } else {
    if (onComplete) onComplete();
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

function fluzzerUseWateringCan(onComplete) {
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
    fluzzerExploreFlowers(targetIndex, cols, rows, 'watering', onComplete);
  } else {
    if (onComplete) onComplete();
  }
}

function fluzzerUsePollenWand(targetIndex, onComplete) {
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
  fluzzerExploreFlowers(targetIndex, cols, rows, 'pollen', onComplete);
}

let flowerRegrowthTimer = null;
window.flowerRegrowthTimer = flowerRegrowthTimer;
let lastRegrowthTime = Date.now();

function startFlowerRegrowthTimer() {
  if (flowerRegrowthTimer) {
    clearInterval(flowerRegrowthTimer);
  }
  flowerRegrowthTimer = setInterval(() => {
    regrowFlowers();
  }, 30000); 
  window.flowerRegrowthTimer = flowerRegrowthTimer;
}

function stopFlowerRegrowthTimer() {
  if (flowerRegrowthTimer) {
    clearInterval(flowerRegrowthTimer);
    flowerRegrowthTimer = null;
    window.flowerRegrowthTimer = null;
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
    // Only force immediate update if terrarium tab is visible
    const terrariumTab = document.getElementById('terrariumTab');
    const isTabVisible = terrariumTab && terrariumTab.classList.contains('active');
    renderTerrariumUI(isTabVisible);
  }
}

function renderTerrariumUI(force = false) {
  // Throttle updates to prevent performance issues
  const now = Date.now();
  if (!force && now - lastTerrariumUIUpdateTime < TERRARIUM_UI_UPDATE_THROTTLE) {
    return;
  }
  lastTerrariumUIUpdateTime = now;
  
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
      const fluzzerImageSrc = window.isFluzzerSleeping ? getFluzzerImagePath('sleeping') : getFluzzerImagePath('normal');
    charCard.innerHTML = `
      <div class="fluzzer-img-wrap" style="display:inline-block;position:relative;">
          <img id="fluzzerImg" src="${fluzzerImageSrc}" alt="Fluzzer" style="width:110px;height:110px;border-radius:16px;margin-top:1em;box-shadow:0 2px 8px rgba(120,80,180,0.10);cursor:pointer;">
      </div>
    `;
      fluzzerImg = document.getElementById('fluzzerImg');
    } else {
      const isTalkingImage = fluzzerImg.src.includes('talking.png');
      const hasActiveSpeechTimeout = window.fluzzerSpeechTimeout !== null && window.fluzzerSpeechTimeout !== undefined;
      const speechBubble = document.getElementById('fluzzerSpeech');
      const hasVisibleSpeech = speechBubble && speechBubble.style.display !== 'none' && speechBubble.textContent.trim() !== '';
      const isCurrentlyTalking = fluzzerIsTalking || isTalkingImage || hasActiveSpeechTimeout || hasVisibleSpeech;
      if (!isCurrentlyTalking) {
        const expectedSrc = window.isFluzzerSleeping ? getFluzzerImagePath('sleeping') : getFluzzerImagePath('normal');
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
      // Always attach click handler, let the individual functions handle cooldown checks
      if (
        (pollenWandActive && flower.health > 0) ||
        (wateringCanActive)
      ) {
        // Show pointer cursor only when not on cooldown
        cell.style.cursor = (
          (pollenWandActive && flower.health > 0 && !window.pollenWandCooldown) ||
          (wateringCanActive && !wateringCanCooldown)
        ) ? 'pointer' : 'default';
        
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
      // Check if fluzzer is in timeout
      if (isFluzzerInTimeout()) {
        // Show timeout message
        const remainingTime = Math.max(0, fluzzerTimeoutEndTime - Date.now());
        const totalSeconds = Math.ceil(remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const msg = `Fluzzer is taking a break! Tools unavailable for ${timeString} more.`;
        if (typeof showNotification === 'function') {
          showNotification(msg, 'warning');
        } else {
         
        }
        return;
      }
      
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
      // Check if fluzzer is in timeout
      if (isFluzzerInTimeout()) {
        // Show timeout message
        const remainingTime = Math.max(0, fluzzerTimeoutEndTime - Date.now());
        const totalSeconds = Math.ceil(remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const msg = `Fluzzer is taking a break! Tools unavailable for ${timeString} more.`;
        if (typeof showNotification === 'function') {
          showNotification(msg, 'warning');
        } else {
         
        }
        return;
      }
      
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
  if (xpFill) xpFill.style.width = Math.min(100, terrariumXP.div(xpReq).mul(100).toNumber()) + '%';
  const pollenMultSpan = document.getElementById('terrariumPollenMultiplier');
  if (pollenMultSpan) pollenMultSpan.textContent = `x${formatNumberSci(new Decimal(2).pow(terrariumLevel - 1))} pollen`;
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

// Function to control nectarize button visibility based on expansion grade
function updateNectarizeButtonVisibility() {
  const nectarizeBtn = document.getElementById('terrariumNectarizeBtn');
  if (!nectarizeBtn) return;
  
  // Get current expansion grade and track highest grade reached
  const currentGrade = (typeof state !== 'undefined' && state.grade) 
    ? (DecimalUtils.isDecimal(state.grade) ? state.grade.toNumber() : state.grade)
    : 1;
  
  // Get save-slot-specific key for highest grade reached
  const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
  const highestGradeKey = `highestGradeReached_${currentSaveSlot}`;
  
  // Track highest grade reached in both localStorage and game state for persistence
  let highestGradeReached = parseInt(localStorage.getItem(highestGradeKey) || '1');
  
  // Also check game state if available
  if (typeof state !== 'undefined' && state.highestGradeReached) {
    const stateHighest = DecimalUtils.isDecimal(state.highestGradeReached) 
      ? state.highestGradeReached.toNumber() 
      : state.highestGradeReached;
    highestGradeReached = Math.max(highestGradeReached, stateHighest);
  }
  
  // Update highest grade if current is higher
  if (currentGrade > highestGradeReached) {
    highestGradeReached = currentGrade;
    localStorage.setItem(highestGradeKey, highestGradeReached.toString());
    // Also store in game state
    if (typeof state !== 'undefined') {
      state.highestGradeReached = highestGradeReached;
    }
  }
  
  // Nectarize button is permanently unlocked after reaching grade 7
  if (highestGradeReached >= 7) {
    nectarizeBtn.style.display = 'inline-block';
  } else {
    nectarizeBtn.style.display = 'none';
  }
}

// Make the function available globally so it can be called from other systems
window.updateNectarizeButtonVisibility = updateNectarizeButtonVisibility;

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
  
  // Check if nectarize button should be visible
  updateNectarizeButtonVisibility();
  
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
  "If you find a shiny flower, can I have it?",
  "Sometimes I nap in the sun. It's the best feeling!",
  "Have you ever counted all the petals in here? I lost track!",
  "I tried to make a flower crown once. It fell apart, but it was fun!",
  "Do you think the clouds ever get jealous of the flowers?",
  "I like to imagine what it's like outside the terrarium. Maybe one day I'll see it!",
  "If you ever feel sad, just look at a flower. It always helps me.",
  "I wonder if the flowers dream when they sleep.",
  "Sometimes I hum to the plants. I think they like it.",
  "I hope you have a wonderful day!",
  "If you find a lost petal, it's probably mine. I drop things a lot!",
  "The best part of my day is when someone visits.",
  "I once tried to race a bee. I lost, but it was close!",
  "Do you think grass has secrets? I bet it does.",
  "I like to watch the dew sparkle in the morning.",
  "If you ever need a friend, I'm always here!",
  "I once tried to juggle pollen. Now everything is sticky.",
  "I asked a worm for gardening tips. It just wiggled.",
  "I once challenged a snail to a race. Still waiting for the results.",
  "Do you think flowers have favorite jokes? I told one a pun, but it just wilted.",
  "I tried to make a daisy chain. Now there are daisies everywhere!",
  "I tried to teach a bee to dance. It was un-bee-lievable!",
  "I once mistook a pebble for a seed. It still hasn’t grown.",
  "I tried to whistle with a blade of grass. Now the grass is in love with me.",
  "I heard Vi is really smart! I wonder if they like flowers too.",
  "Mystic makes the best dishes I've ever tasted!",
  "I'm concerned about Lepre, they get so nervous when visiting the terrarium. They especially stay the furthest away from the nectarize machine.",
  "Soap is so bubbly! But also annoying when they let the power go out.",
  "Chef Mystic said I could help in the kitchen but I'm afraid of accidently causing a fire.",
  "I asked Soap for cleaning tips. Now everything is too clean!",
  {
    text: "Bijou is so fast at collecting tokens! All because of that magnet they carry.",
    condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled
  },
  {
    text: "OMG PEACHY IS THAT A SWA ELITE ON YOUR HEAD!? It's not? Oof thank the fluffs.",
    condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled
  },
  {
    text: "Bijou's magnet is amazing! I tried to use one, but it stuck to my watering can.",
    condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled
  },
  {
    text: "I asked Bijou for collecting tips. they said, 'Just be yourself!' That's good advice.",
    condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled
  },
  {
    text: "Do you think Bijou ever gets tired? They always look so chill being on your head!",
    condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled
  },
  
  // Anomaly-related speeches (only appear after doing an infinity reset at least once)
  {
    text: "I've noticed some strange ripples in the air lately... They don't hurt the flowers though, so I guess they're okay!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "I saw a dimensional tear yesterday and tried to water it. It just... disappeared. Oops!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "Sometimes reality gets all wibbly-wobbly here, but the flowers don't seem to mind!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "So uhh... Don't tell anyone, but I noticed one of the flowers turned into a Thanthora... I carefully removed it and threw it into the incinerator without being infected by it, I hope this never happens again!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "Reality tears look like they need a good watering. But I don't think my watering can works on them!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "Everyone else seems worried about the anomalies, but they've been nothing but gentle visitors to me!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "The reality fluctuations remind me of how flowers sway in the breeze. Very peaceful and natural!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "I tried to make friends with a dimensional tear. It closed up before I could introduce myself!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "You say your anomaly resolver says I'm 10% anomalous? Is that bad?",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "After getting that fluff to infinity, I had a strange dream about a certain flower growing on my head. Hopefully its just a silly dream ahaha.",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "The cosmic chaos doesn't feel chaotic to me. It feels like nature doing something new and beautiful!",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
  {
    text: "Sometimes I catch anomalies watching me tend the garden. Isn't that sweet?",
    condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0
  },
];

// New dizzy dialogue for when fluzzer is in the enhanced state (3+ total infinity)
const fluzzerDizzySpeeches = [
  "Whoa... everything's kinda... spinny today...",
  "Is it just me or are the flowers... wobbling?",
  "I feel all... tingly and... whoa... what was I saying?",
  "The world keeps... swirling... but in a pretty way!",
  "My head feels all... fluffy... cloudier than usual...",
  "Everything looks so... bright and... spinny... it's nice though!",
  "I think I'm... floating? No wait... that's just dizziness...",
  "The colors are all... swirly today... like a flower kaleidoscope!",
  "Is it normal to feel like the ground is... moving? Whee!",
  "I keep getting distracted by... shiny... sparkly... what were we talking about?",
  "My wings feel all... tingly... and I can't quite focus on...",
  "The flowers are singing... wait, no... that's just the ringing in my ears...",
  "Everything's so... dreamy and... floaty... I love it but...",
  "I tried to water a flower but I... got dizzy and watered my foot instead...",
  "The whole terrarium feels like it's... gently spinning... weeeee!",
  "I feel like I'm in a... flower dream... everything's so... wavy...",
  "My thoughts keep... drifting away like... floating petals...",
  "Is it bedtime? I feel all... woozy and... sleepy but... energetic?",
  "The garden keeps... tilting... but the flowers don't seem to mind...",
  "I think I'm seeing... extra colors... that's normal, right?"
];

// Hardcore personality dialogue for rare 1% chance when in enhanced state
const fluzzerHardcoreSpeeches = [
  "I don't feel quite right today. Something about these f̴l̷o̸w̶e̵r̷s̴ is... different.",
  "Why are you bothering me? Can't you see I'm trying to c̷o̶n̸c̵e̶n̵t̷r̸a̴t̶e̷ on something important?",
  "The plants have been w̶h̵i̶s̷p̸e̶r̵i̶n̸g̴ strange things lately. I don't think I like what they're saying.",
  "Stop looking at me like that. I know there's something g̵r̷o̶w̸i̶n̵g̴ on my head, okay?",
  "I used to enjoy talking to everyone, but lately... I just want to be l̶e̷f̸t̴ ̵a̶l̷o̸n̴e̵ with my thoughts.",
  "These flowers seem more d̸e̶m̵a̷n̸d̴i̶n̵g̷ than usual. Always wanting more water, more attention...",
  "Sometimes I catch myself staring at the anomalies and thinking... ų̶̈n̶̽p̸̊l̴̇e̵̊a̶̾s̷̈a̸̽n̶̈t̸̎ ̷̀t̴̂h̵̑i̸̽n̶̂g̴̈s̵̓.",
  "I don't know why, but I keep having these strange urges to make the terrarium more... w̷i̸l̶d̴.",
  "You wouldn't understand. Ever since that weird dream about flowers, I've felt... c̵h̴a̷n̸g̶e̸d̷.",
  "The other characters keep asking if I'm okay. I wish they'd just m̶i̷n̸d̴ ̵t̶h̷e̸i̶r̴ ̷o̶w̸n̵ ̸b̶u̷s̸i̶n̷e̸s̶s̴.",
  "There's this little sprout on my head and it keeps... t̷̨̛̺̱̝̪̰̭̘̰̓̈́̋̂̀̍̅́̽ạ̸̧̛̭̲̞̮̪̈̔̎̐̉̚l̶̢̦̦̯̺̠̱̟̄̍k̸͇̘̙̗̈́̏i̴̟̱̰̦̘̤̲̓̅̂̅̇̆n̸̰̝̪̪̆̔́́̈̔͋g̸̫̫̮̠̤̦̉̒̀̌̏̚ to me. Telling me things.",
  "I'm fine, alright? Just because I'm a bit more i̸r̴r̷i̶t̵a̸b̶l̷e̴ doesn't mean anything's wrong.",
  "Sometimes I wonder what would happen if I just... s̷t̸o̶p̵p̴e̶d̷ taking care of things properly.",
  "The flowers grow better when I'm angry. Have you noticed that? It's... i̵n̴t̶e̵r̷e̸s̶t̷i̵n̴g̷.",
  "I d̵o̶n̸'̵t̷ ̸w̶a̵n̸t̴ ̷t̸o̴ ̶c̶h̵a̴t̵ today. This little plant on my head is giving me a headache.",
  "Why does everyone expect me to be cheerful all the time? Maybe I d̵o̶n̶'̵t̸ ̷w̶a̸n̵t̴ ̶t̵o̷ ̸b̴e̸ ̶n̷i̸c̵e̷ anymore.",
  "The terrarium feels different now. More... a̶̭̚l̴̰̊i̵̦̋v̸̤̌e̷̱͋. Like it's w̷̝̄ă̴͇t̸̰̆c̷̱̎h̶̰̿i̸̱̊n̵̰̂g̸̱̈ everything I do.",
  "I keep having these thoughts that d̶o̸n̶'̵t̴ ̷f̸e̶e̶l̷ ̸l̴i̷k̶e̵ ̸m̴i̷n̸e̶. It's probably nothing, but...",
  "Something's c̵̠̈h̷̰̾ä̴́n̸̽g̵̈ī̶n̸̾g̴̈ in me, and I'm not sure I want to f̷i̴g̸h̶t̵ ̷i̶t̸ anymore.",
  "Leave me be. I have some very important... g̸̛̩̱̬̖̦̈́́̓̇̚a̶̧̨̛̱̰̬̭̗̓̍̓̆̈́ȓ̸̢̨̛̖̭̮̯̤̌̌̋̂d̵̨̰̱̖̰̲̈́̋̓̇̚ę̷̛̱̖̩̰̌̇̓̈́n̸̢̨̛̰̱̖̦̈́̇̓̆i̶̧̨̛̱̰̖̦̓̇̈́̆n̸̢̨̛̰̱̖̦̈́̇̓̆g̸̛̩̱̬̖̦̈́́̓̇̚ to attend to."
];

// Normalize speeches to support both strings and objects with conditions
const fluzzerNormalSpeechesNormalized = fluzzerNormalSpeeches.map(s => typeof s === 'string' ? s : s);

// Nectar-related speeches (only after first nectarize reset)
const fluzzerNectarSpeeches = [
  "Have you tried nectar? It's very sticky but sweet!",
  "Nectar makes everything feel a little more sweet.",
  "I never knew life could be so sweet until I tasted nectar!",
  "Sometimes I dream about swimming in a pool of nectar. But that would be the worst idea ever.",
  "Nectar is my new favorite thing. Sorry, pollen!",
  "If you spill nectar, the ants will throw a party.",
  "I wonder if flowers get jealous when we drink nectar?",
  "I tried to make nectar pancakes. It was a sticky situation!",
  "Do you think there's a secret nectar recipe? If you find it, let me know!",
  "Nectarize resets are the best! More nectar for everyone and more machine fixing for us!",
  "I tried to use nectar as shampoo. Now my hair is... very, very bouncy.",
  "If you ever see a bee doing a happy dance, it probably found some nectar.",
  "I once tried to freeze nectar for a popsicle. It just turned into a sticky mess!",
  "If you mix nectar and pollen, you get a snack called 'pollar'. Not recommended.",
  "I asked the flowers for more nectar. They told me to be patient. I think.",
  "Sometimes I pretend my cup of nectar is a fancy potion.",
  "If you spill nectar, don't worry! The ants will clean it up (and invite their friends).",
  "Step 1- Cover yourself in nectar. Step 2- ???. Step 3- Fly.",
  "Now that the nectarize machine is working, our next goal is to build the flower grid. But we will need a lot more of everything!"
];

// Helper to get a random Fluzzer speech, including nectar ones if unlocked
function getRandomFluzzerSpeech() {
  // Check if fluzzer is in enhanced/dizzy state (3+ total infinity)
  const isInEnhancedState = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  // If in enhanced state, check for special dialogue types
  if (isInEnhancedState) {
    const rand = Math.random();
    
    // 1% chance for hardcore personality dialogue
    if (rand < 0.01) {
      return fluzzerHardcoreSpeeches[Math.floor(Math.random() * fluzzerHardcoreSpeeches.length)];
    }
    // 20% chance for dizzy dialogue (keeping existing modification)
    else if (rand < 0.21) {  // 0.01 + 0.20 = combined 21% for special dialogue
      return fluzzerDizzySpeeches[Math.floor(Math.random() * fluzzerDizzySpeeches.length)];
    }
    // Remaining 79% falls through to normal dialogue
  }
  
  let availableSpeeches = [];
  
  if (typeof window.nectarizeResets !== 'undefined' && window.nectarizeResets > 0) {
    // Mix normal and nectar speeches
    availableSpeeches = fluzzerNormalSpeeches.concat(fluzzerNectarSpeeches);
  } else {
    availableSpeeches = fluzzerNormalSpeeches;
  }
  
  // Filter and extract text from speech objects
  const validSpeeches = [];
  for (const speech of availableSpeeches) {
    if (typeof speech === 'string') {
      validSpeeches.push(speech);
    } else if (typeof speech === 'object' && speech.text) {
      // Check condition if it exists
      if (!speech.condition || (typeof speech.condition === 'function' && speech.condition())) {
        validSpeeches.push(speech.text);
      }
    }
  }
  
  // Fallback to prevent empty array
  if (validSpeeches.length === 0) {
    return "What a lovely day in the terrarium!";
  }
  
  return validSpeeches[Math.floor(Math.random() * validSpeeches.length)];
}
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

// Enhanced upset speeches for when fluzzer is in dizzy state
const fluzzerDizzyUpsetSpeeches = [
  "Whoa! That made me even... more dizzy... oof...",
  "Please... gentle... everything's already spinning...",
  "I'm trying my best but... whoa... the world won't stop moving...",
  "Why did you poke me? Now I'm... spinning in circles...",
  "I'm a little upset and... very dizzy now...",
  "Oh! I wasn't expecting... whoa... that made it worse...",
  "Eep! My fur is sensitive and... everything's all swirly...",
  "Did I do something wrong? The room won't... stop tilting...",
  "I get nervous when you poke me and... now I'm seeing double...",
  "Maybe a soft pat would... whoa... be nicer when I'm this dizzy...",
  "I hope my ears aren't too floppy... wait, how many ears do I have?",
  "I might hide in the grass... if I can find it through all this spinning..."
];

// Hardcore upset speeches for when fluzzer is in hardcore mode and gets clicked
const fluzzerHardcoreUpsetSpeeches = [
  "D̵o̶n̸'̷t̴ ̵t̶o̷u̸c̸h̴ me. I'm not in the mood for your games right now.",
  "That little sprout on my head doesn't like being d̶i̸s̶t̵u̸r̴b̷e̶d̸. Neither do I.",
  "Why can't you just l̷e̸a̶v̷e̴ ̸m̶e̵ ̷a̶l̸o̴n̷e̸? I have important things to think about.",
  "S̷t̸o̶p̵ ̷p̸o̶k̴i̵n̷g̸ me! Can't you see I'm trying to l̶i̸s̷t̸e̶n̴ to something?",
  "I used to find that cute, but now it just... i̸r̴r̷i̶t̵a̸t̶e̷s̴ me. Please stop.",
  "The flowers are telling me you're being annoying. I'm starting to a̴g̵r̶e̷e̸ with them.",
  "I don't want to be touched today. Or tomorrow. Maybe just... ḏ̸̊o̶̰̔ṉ̵̂'̷̰̾ṯ̸̎.",
  "You're making this little plant on my head very u̶n̸h̵a̴p̷p̶y̸. And when it's unhappy, I'm unhappy.",
  "I'm trying to concentrate on some very important ẅ̷̨̛̰̱̖̦́̇̓̆ḧ̸̢̨̛̰̱̖̦́̇̓̆i̶̧̨̛̱̰̖̦̓̇̈́̆s̸̛̩̱̬̖̦̈́́̓̇̚p̷̨̛̰̱̖̦̈́̇̓̆ȩ̶̨̛̱̰̖̦̓̇̈́̆r̸̢̨̛̰̱̖̦̈́̇̓̆s̸̛̩̱̬̖̦̈́́̓̇̚. You're interrupting.",
  "Back off. I'm not the s̶a̸m̷e̴ ̵f̸l̴u̷z̶z̸e̶r̵ you used to poke around with.",
  "That actually h̶u̸r̷t̴ more than usual. Something about me is definitely c̵h̴a̷n̸g̶i̸n̶g̷.",
  "The sprout s̶a̸y̷s̴ you should stop doing that. I think I a̴g̵r̶e̷e̸ with it."
];
let fluzzerSpeechTimer = null;
let fluzzerIsTalking = false;

// Make fluzzer speech timer globally accessible for pause system
window.fluzzerSpeechTimer = fluzzerSpeechTimer;

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
  
  // Apply dizzy modifier to non-upset speech when fluzzer is in enhanced state
  const finalMessage = upset ? message : addDizzyModifier(message);
  bubble.textContent = finalMessage;
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
    fluzzerImg.src = getFluzzerImagePath('talking');
  }
  fluzzerIsTalking = true;
  if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
  window.fluzzerSpeechTimeout = setTimeout(() => {
    bubble.style.display = 'none';
    if (fluzzerImg) {
      if (window.isFluzzerSleeping) {
        fluzzerImg.src = getFluzzerImagePath('sleeping');
      } else {
        fluzzerImg.src = getFluzzerImagePath('normal');
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
      fluzzerImg.src = getFluzzerImagePath('talking');
    }
  } else if (isNightTime) {
    finalMessage = message + ' zzz...';
    bubble.textContent = finalMessage;
    bubble.style.display = 'block';
    bubble.style.background = '#fff';
    bubble.style.color = '#222';
    if (fluzzerImg) {
      fluzzerImg.src = getFluzzerImagePath('sleep_talking');
    }
  } else {
    bubble.textContent = finalMessage;
    bubble.style.display = 'block';
    bubble.style.background = '#fff';
    bubble.style.color = '#222';
    if (fluzzerImg) {
      fluzzerImg.src = getFluzzerImagePath('talking');
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
        fluzzerImg.src = getFluzzerImagePath('talking');
      } else if (isNightTime) {
        fluzzerImg.src = getFluzzerImagePath('sleeping');
      } else {
        fluzzerImg.src = getFluzzerImagePath('normal');
      }
    }
    fluzzerIsTalking = false;
    if (!isNightTime || hasAnyFluzzerBoost) scheduleFluzzerRandomSpeech();
  }, speechDuration);
}

function fluzzerRandomSpeech() {
  if (fluzzerIsTalking) return;
  
  // Don't speak randomly during nighttime unless boosted
  const isNight = isNightTime();
  const hasAnyFluzzerBoost = isFluzzerBoostActive();
  if (isNight && !hasAnyFluzzerBoost) return;
  
  const msg = getRandomFluzzerSpeech();
  fluzzerSay(msg, false);
}

function scheduleFluzzerRandomSpeech() {
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  
  // Don't schedule random speech during nighttime unless boosted
  const isNight = isNightTime();
  const hasAnyFluzzerBoost = isFluzzerBoostActive();
  if (isNight && !hasAnyFluzzerBoost) return;
  
  const delay = 10000 + Math.random() * 8000;
  fluzzerSpeechTimer = setTimeout(() => {
    fluzzerRandomSpeech();
  }, delay);
  
  // Update global reference
  window.fluzzerSpeechTimer = fluzzerSpeechTimer;
}

function stopFluzzerSpeechTimer() {
  if (window.isFluzzerLevelUpSpeaking) return;
  if (fluzzerSpeechTimer) clearTimeout(fluzzerSpeechTimer);
  fluzzerSpeechTimer = null;
  
  // Update global reference
  window.fluzzerSpeechTimer = null;
}

function handleWateringCanClick(index, cols, rows) {
  if (wateringCanCooldown) {
    return;
  }
  wateringCanCooldown = true;
  setTimeout(() => {
    wateringCanCooldown = false;
    updateTerriariumCursorStates();
  }, getTerriariumToolCooldown());
  if (typeof window.trackClick === 'function') {
    window.trackClick();
  }
  if (typeof window.trackHardModeFlowerWatered === 'function') {
    window.trackHardModeFlowerWatered();
  }
  const indices = [];
  const total = cols * rows;
  const areaSize = getWateringCanAreaSize();
  for (let rowOffset = -areaSize; rowOffset <= areaSize; rowOffset++) {
    for (let colOffset = -areaSize; colOffset <= areaSize; colOffset++) {
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
  renderTerrariumUI(true); // Force immediate update for player interaction
}

function handlePollenWandClick(index, cols, rows) {
  if (window.pollenWandCooldown) return;
  window.pollenWandCooldown = true;
  pollenWandCooldown = window.pollenWandCooldown;
  const cooldownTime = getTerriariumToolCooldown();
  setTimeout(() => {
    window.pollenWandCooldown = false;
    pollenWandCooldown = window.pollenWandCooldown;
    // Update cursor styles without full UI render
    updateTerriariumCursorStates();
  }, cooldownTime);
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
  pollenGained = new Decimal(pollenGained).mul(getPollenValueUpgradeEffect(pollenValueUpgradeLevel)).floor();
  pollenGained = pollenGained.mul(new Decimal(2).pow(terrariumLevel - 1)).floor();
  pollenGained = pollenGained.mul(getFlowerUpgrade3Effect(pollenValueUpgrade2Level)).floor();
  const milestoneBonus = getNectarizeMilestoneBonus();
  if (milestoneBonus && typeof milestoneBonus.pollen === 'number' && !isNaN(milestoneBonus.pollen)) {
    pollenGained = pollenGained.mul(milestoneBonus.pollen).floor();
  }
  pollenGained = pollenGained.mul(getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel)).floor();
  // Apply Element 21 boost (X10 pollen multiplier)
  const elementsRef3 = (typeof boughtElements !== 'undefined') ? boughtElements : window.boughtElements;
  if (elementsRef3 && elementsRef3[21]) {
    pollenGained = pollenGained.mul(10).floor();
  }
  // Apply red stable light buff to pollen
  if (typeof applyRedStableLightBuff === 'function') {
    pollenGained = applyRedStableLightBuff(pollenGained);
  }
  flowersCollected = new Decimal(flowersCollected).mul(getFlowerValueUpgradeEffect(flowerValueUpgradeLevel)).floor();
  flowersCollected = flowersCollected.mul(getFlowerUpgrade3Effect(pollenValueUpgrade2Level)).floor();
  if (milestoneBonus && typeof milestoneBonus.flowers === 'number' && !isNaN(milestoneBonus.flowers)) {
    flowersCollected = flowersCollected.mul(milestoneBonus.flowers).floor();
  }
  flowersCollected = flowersCollected.mul(getPollenFlowerNectarUpgradeEffect(pollenFlowerNectarUpgradeLevel)).floor();
  // Apply red stable light buff to flowers
  if (typeof applyRedStableLightBuff === 'function') {
    flowersCollected = applyRedStableLightBuff(flowersCollected);
  }
  const flowerGainFinal = flowersCollected.mul(getTerrariumFlowerMultiplier(terrariumLevel)).floor();
  let finalPollenGain = pollenGained;
  let finalFlowerGain = flowerGainFinal;
  // Apply Element 22 boost (X5 flowers multiplier)
  const elementsRef4 = (typeof boughtElements !== 'undefined') ? boughtElements : window.boughtElements;
  if (elementsRef4 && elementsRef4[22]) {
    finalFlowerGain = finalFlowerGain.mul(5).floor();
  }
  const originalPollen = terrariumPollen;
  const originalFlowers = terrariumFlowers;
  let boostResult = { pollenBoost: 0, flowerBoost: 0 };
  if (typeof window.applyChargerTerrariumBoost === 'function') {
    boostResult = window.applyChargerTerrariumBoost(finalPollenGain, finalFlowerGain);
  }
  
  let totalPollenGain = finalPollenGain.add(boostResult.pollenBoost || 0);
  let totalFlowerGain = finalFlowerGain.add(boostResult.flowerBoost || 0);
  
  // Apply total infinity boost
  if (typeof window.applyTotalInfinityReachedBoost === 'function') {
    totalPollenGain = window.applyTotalInfinityReachedBoost(totalPollenGain);
    totalFlowerGain = window.applyTotalInfinityReachedBoost(totalFlowerGain);
  }
  
  terrariumPollen = terrariumPollen.add(totalPollenGain);
  terrariumFlowers = terrariumFlowers.add(totalFlowerGain);
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
  const xpDecimal = terrariumXP instanceof Decimal ? terrariumXP : new Decimal(terrariumXP);
  let currentXP = xpDecimal;
  while (currentXP.gte(getTerrariumXPRequirement(terrariumLevel))) {
    const requirement = getTerrariumXPRequirement(terrariumLevel);
    const reqDecimal = requirement instanceof Decimal ? requirement : new Decimal(requirement);
    currentXP = currentXP.sub(reqDecimal);
    terrariumLevel++;
    leveledUp = true;
  }
  terrariumXP = currentXP;
  window.terrariumPollen = terrariumPollen;
  window.terrariumFlowers = terrariumFlowers;
  window.terrariumXP = terrariumXP;
  window.terrariumLevel = terrariumLevel;
  // Award friendship to Fluzzer for using pollen wand on flowers
  awardFluzzerFriendshipForPollenWandClick();
  
  renderTerrariumUI(true); // Force immediate update for player interaction
  checkAndUpdateFluzzerSleepState();
  updateFluzzerSleepState();
  if (leveledUp) {
    stopFluzzerSpeechTimer();
    handleFlowerGridTroll(terrariumLevel);
    fluzzerLevelUpSay('Level up! You are now level ' + terrariumLevel + '!');
  }
  
  // Check for petal slice chance (player click)
  if (shouldTriggerPetalSlice(false)) {
    triggerPetalSlice(index, cols, rows);
  }

  const totalPollenGained = terrariumPollen - originalPollen;
  const totalFlowerGained = terrariumFlowers - originalFlowers;
  if (totalPollenGained > 0) showTerrariumGainPopup('terrariumPollen', totalPollenGained, 'Pollen');
  if (totalFlowerGained > 0) showTerrariumGainPopup('terrariumFlowers', totalFlowerGained, 'Flowers');
}

// Petal Slice System
function shouldTriggerPetalSlice(isFluzzer = false) {
  // Check if friendship system exists and get Terrarium friendship level
  if (!window.friendship || !window.friendship.Terrarium) return false;
  
  const terrariumFriendship = window.friendship.Terrarium;
  const level = terrariumFriendship.level || 0;
  
  // Petal slice unlocks at level 4
  if (level < 4) return false;
  
  let petalSliceChance;
  
  if (isFluzzer) {
    // Fluzzer: Base 10% chance at level 4, +2% per level after that
    petalSliceChance = 10 + Math.max(0, (level - 4) * 2);
  } else {
    // Player: Fixed 5% chance regardless of friendship level
    petalSliceChance = 5;
  }
  
  return Math.random() * 100 < petalSliceChance;
}

// Flower Wipe System
function shouldTriggerFlowerWipe() {
  // Check if friendship system exists and get Terrarium friendship level
  if (!window.friendship || !window.friendship.Terrarium) return false;
  
  const terrariumFriendship = window.friendship.Terrarium;
  const level = terrariumFriendship.level || 0;
  
  // Flower wipe unlocks at level 7
  if (level < 7) return false;
  
  // Base 1% chance at level 7, +0.5% per level after that
  const flowerWipeChance = 1 + Math.max(0, (level - 7) * 0.5);
  
  return Math.random() * 100 < flowerWipeChance;
}

function triggerPetalSlice(clickIndex, cols, rows) {
  // Get the position of the clicked cell
  const clickRow = Math.floor(clickIndex / cols);
  const clickCol = clickIndex % cols;
  
  // Choose a random direction (8 cardinal directions)
  const directions = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: -1 }, // Northeast  
    { dx: 1, dy: 0 },  // East
    { dx: 1, dy: 1 },  // Southeast
    { dx: 0, dy: 1 },  // South
    { dx: -1, dy: 1 }, // Southwest
    { dx: -1, dy: 0 }, // West
    { dx: -1, dy: -1 } // Northwest
  ];
  
  const direction = directions[Math.floor(Math.random() * directions.length)];
  
  // Create the petal slice visual element
  createPetalSliceVisual(clickIndex, direction, cols, rows);
  
  // Calculate damage path
  let currentRow = clickRow;
  let currentCol = clickCol;
  
  // Move in the chosen direction and damage flowers
  while (true) {
    currentRow += direction.dy;
    currentCol += direction.dx;
    
    // Check if we're still within grid bounds
    if (currentRow < 0 || currentRow >= rows || currentCol < 0 || currentCol >= cols) {
      break;
    }
    
    const currentIndex = currentRow * cols + currentCol;
    
    // Damage flower at this position (petal slice affects a 2x2 area)
    damagePetalSliceArea(currentIndex, cols, rows);
  }
}

function triggerFlowerWipe() {
  
  // Create a dramatic visual effect that covers the entire grid
  createFlowerWipeVisual();
  
  // Damage every flower in the grid
  for (let i = 0; i < terrariumFlowerGrid.length; i++) {
    if (terrariumFlowerGrid[i] && terrariumFlowerGrid[i].health > 0) {
      terrariumFlowerGrid[i].health = Math.max(0, terrariumFlowerGrid[i].health - 1);
    }
  }
}

function damagePetalSliceArea(centerIndex, cols, rows) {
  // Get center position
  const centerRow = Math.floor(centerIndex / cols);
  const centerCol = centerIndex % cols;
  
  // Damage 2x2 area around the center position
  for (let rowOffset = -1; rowOffset <= 0; rowOffset++) {
    for (let colOffset = -1; colOffset <= 0; colOffset++) {
      const targetRow = centerRow + rowOffset;
      const targetCol = centerCol + colOffset;
      
      // Check bounds
      if (targetRow >= 0 && targetRow < rows && targetCol >= 0 && targetCol < cols) {
        const targetIndex = targetRow * cols + targetCol;
        
        // Damage flower if it exists and has health
        if (terrariumFlowerGrid[targetIndex] && terrariumFlowerGrid[targetIndex].health > 0) {
          terrariumFlowerGrid[targetIndex].health = Math.max(0, terrariumFlowerGrid[targetIndex].health - 1);
        }
      }
    }
  }
}

// Track active petal slices to prevent UI updates from removing them
let activePetalSlices = [];

function createPetalSliceVisual(startIndex, direction, cols, rows) {
  // Find the terrarium flower grid container
  const grassPatch = document.getElementById('terrariumGrassPatchArea');
  if (!grassPatch) return;
  
  const flowerGrid = grassPatch.querySelector('.terrarium-flower-grid');
  if (!flowerGrid) return;
  
  const startRow = Math.floor(startIndex / cols);
  const startCol = startIndex % cols;
  
  // Create petal slice element
  const petalSlice = document.createElement('img');
  petalSlice.src = 'assets/icons/petal slice.png';
  petalSlice.style.position = 'absolute';
  petalSlice.style.width = '64px'; // 2x2 flower size
  petalSlice.style.height = '64px';
  petalSlice.style.zIndex = '1000';
  petalSlice.style.pointerEvents = 'none';
  petalSlice.style.transition = 'none';
  petalSlice.style.imageRendering = 'pixelated'; // For crisp pixel art
  
  // Get actual cell size from the grid
  const firstCell = flowerGrid.querySelector('.terrarium-flower-cell');
  const cellSize = firstCell ? firstCell.offsetWidth : 32;
  
  // Calculate starting position (center of clicked cell)
  const startX = startCol * cellSize + cellSize / 2 - 32; // Center minus half petal size
  const startY = startRow * cellSize + cellSize / 2 - 32;
  
  petalSlice.style.left = startX + 'px';
  petalSlice.style.top = startY + 'px';
  
  // Ensure the flower grid container is positioned relatively
  flowerGrid.style.position = 'relative';
  flowerGrid.appendChild(petalSlice);
  
  // Add to active petal slices tracking
  const petalSliceData = {
    element: petalSlice,
    container: flowerGrid,
    currentRow: startRow,
    currentCol: startCol,
    direction: direction,
    cols: cols,
    rows: rows,
    cellSize: cellSize,
    stepCount: 0,
    isActive: true
  };
  activePetalSlices.push(petalSliceData);
  
  // Use the tracked petal slice data for animation
  const teleportSlice = () => {
    petalSliceData.stepCount++;
    
    // Move to next cell BEFORE checking bounds
    petalSliceData.currentRow += direction.dy;
    petalSliceData.currentCol += direction.dx;
    
    
    // Check if we're still within bounds
    if (petalSliceData.currentRow < 0 || petalSliceData.currentRow >= rows || petalSliceData.currentCol < 0 || petalSliceData.currentCol >= cols) {
      // Clean up properly
      cleanupPetalSlice(petalSliceData);
      return;
    }
    
    // Ensure petal slice is still in DOM (reattach if removed by UI update)
    if (!petalSlice.parentNode) {
      flowerGrid.appendChild(petalSlice);
    }
    
    // Teleport to new position
    const newX = petalSliceData.currentCol * cellSize + cellSize / 2 - 32;
    const newY = petalSliceData.currentRow * cellSize + cellSize / 2 - 32;
    
    
    petalSlice.style.left = newX + 'px';
    petalSlice.style.top = newY + 'px';
    petalSlice.style.display = 'block'; // Ensure visibility
    
    // Limit maximum steps to prevent infinite loops
    if (petalSliceData.stepCount < 20) {
      // Continue teleporting after a very short delay
      setTimeout(teleportSlice, 10); // Very fast 10ms teleport speed
    } else {
      cleanupPetalSlice(petalSliceData);
    }
  };
  
  // Start teleporting immediately after creation
  setTimeout(teleportSlice, 50); // Quick initial delay
}

// Clean up petal slice and remove from tracking
function cleanupPetalSlice(petalSliceData) {
  if (petalSliceData.element && petalSliceData.element.parentNode) {
    petalSliceData.element.remove();
  }
  petalSliceData.isActive = false;
  
  // Remove from active tracking array
  const index = activePetalSlices.indexOf(petalSliceData);
  if (index > -1) {
    activePetalSlices.splice(index, 1);
  }
  
  // Update the grid display after petal slice finishes
  setTimeout(() => {
    if (typeof renderTerrariumUI === 'function') {
      renderTerrariumUI();
    }
  }, 50);
}

// Restore any petal slices that were removed by UI updates
function restorePetalSlices() {
  activePetalSlices.forEach(petalData => {
    if (petalData.isActive && petalData.element && !petalData.element.parentNode) {
      // Find the current flower grid container
      const grassPatch = document.getElementById('terrariumGrassPatchArea');
      if (grassPatch) {
        const flowerGrid = grassPatch.querySelector('.terrarium-flower-grid');
        if (flowerGrid) {
          flowerGrid.style.position = 'relative';
          flowerGrid.appendChild(petalData.element);
        }
      }
    }
  });
}

// Override renderTerrariumUI to restore petal slices after UI updates
const originalRenderTerrariumUI = window.renderTerrariumUI;
if (originalRenderTerrariumUI) {
  window.renderTerrariumUI = function() {
    const result = originalRenderTerrariumUI.apply(this, arguments);
    // Restore petal slices after UI update
    setTimeout(restorePetalSlices, 10);
    return result;
  };
}

// Flower Wipe Visual System
function createFlowerWipeVisual() {
  // Find the terrarium flower grid container
  const grassPatch = document.getElementById('terrariumGrassPatchArea');
  if (!grassPatch) return;
  
  const flowerGrid = grassPatch.querySelector('.terrarium-flower-grid');
  if (!flowerGrid) return;
  
  // Create a dramatic full-screen flash effect
  const wipeEffect = document.createElement('div');
  wipeEffect.style.position = 'absolute';
  wipeEffect.style.top = '0';
  wipeEffect.style.left = '0';
  wipeEffect.style.width = '100%';
  wipeEffect.style.height = '100%';
  wipeEffect.style.background = 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,215,0,0.3) 50%, rgba(255,69,0,0.2) 100%)';
  wipeEffect.style.zIndex = '1000';
  wipeEffect.style.pointerEvents = 'none';
  wipeEffect.style.opacity = '0';
  wipeEffect.style.transition = 'opacity 0.1s ease-in-out';
  wipeEffect.style.borderRadius = '8px';
  
  // Ensure the flower grid has relative positioning
  flowerGrid.style.position = 'relative';
  flowerGrid.appendChild(wipeEffect);
  
  // Animate the flash effect
  setTimeout(() => {
    wipeEffect.style.opacity = '1';
  }, 10);
  
  // Remove the effect after a short duration
  setTimeout(() => {
    wipeEffect.style.opacity = '0';
    setTimeout(() => {
      if (wipeEffect.parentNode) {
        wipeEffect.parentNode.removeChild(wipeEffect);
      }
    }, 100);
  }, 200);
  
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
  try {
    const pollenCount = typeof terrariumPollen !== 'undefined' ? terrariumPollen : 0;
    const flowerCount = typeof terrariumFlowers !== 'undefined' ? terrariumFlowers : 0;
    const pollenSpan = document.getElementById('terrariumPollenUpgradesCount');
    const flowerSpan = document.getElementById('terrariumFlowerUpgradesCount');
    
    if (pollenSpan) {
      pollenSpan.textContent = formatNumberSci(pollenCount);
    }
    if (flowerSpan) {
      flowerSpan.textContent = formatNumberSci(flowerCount);
    }
  } catch (error) {
    console.warn('Error updating terrarium upgrade currency counts:', error);
  }
}

const origSetupTerrariumSubTabButtons = setupTerrariumSubTabButtons;

setupTerrariumSubTabButtons = function() {
  origSetupTerrariumSubTabButtons();
  updateTerrariumUpgradeCurrencyCounts();
  // Clean up any unwanted styles on initial load
  cleanupUpgradeCardStyles();
  // Force a comprehensive refresh after setup
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
};

const origRenderTerrariumUI = renderTerrariumUI;

renderTerrariumUI = function() {
  origRenderTerrariumUI();
  updateTerrariumUpgradeCurrencyCounts();
  // Clean up any unwanted styles on render
  cleanupUpgradeCardStyles();
  // Force a comprehensive refresh after render
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
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

// Add periodic UI refresh for the terrarium upgrade tab
(function() {
  let lastRefreshTime = 0;
  const REFRESH_INTERVAL = 2000; // 2 seconds - less aggressive to prevent flickering
  
  function periodicRefresh() {
    const now = Date.now();
    if (now - lastRefreshTime >= REFRESH_INTERVAL) {
      const terrariumTab = document.getElementById('terrariumTab');
      const upgradeArea = document.getElementById('terrariumPollenUpgradesArea');
      
      // Only refresh if the terrarium tab is visible and upgrade area is active
      if (terrariumTab && terrariumTab.style.display !== 'none' && 
          upgradeArea && upgradeArea.style.display !== 'none') {
        // Only update currency counts periodically, not full refresh
        updateTerrariumUpgradeCurrencyCounts();
        lastRefreshTime = now;
      }
    }
    
    requestAnimationFrame(periodicRefresh);
  }
  
  // Start the periodic refresh
  setTimeout(() => {
    periodicRefresh();
  }, 3000);
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
      // Always ensure event listeners are properly attached (more robust approach)
      attachUpgradeListenersIfNeeded(existingPollen3, 'pollen3');
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
      // Always ensure event listeners are properly attached (more robust approach)
      attachUpgradeListenersIfNeeded(existingPollen4, 'pollen4');
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
      if (nextUnlock) nextUnlock.textContent = 'All upgrades unlocked';
      // Always ensure event listeners are properly attached (more robust approach)
      attachUpgradeListenersIfNeeded(existingPollen5, 'pollen5');
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
  const existingFlower5 = flowerRow.querySelector('[data-upgrade="flower5"]');
  if (existingFlower2) existingFlower2.remove();
  if (existingFlower3) existingFlower3.remove();
  if (existingFlower4) existingFlower4.remove();
  if (existingFlower5) existingFlower5.remove();
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
    // Add event listeners only if not already added
    if (!div.hasAttribute('data-listeners-added')) {
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
      div.setAttribute('data-listeners-added', 'true');
    }
    updateFlowerXPUpgradeCircleCost();
  }
  if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 10) || window.terrariumUpgradesUnlocked.flower3 || (window.terrariumFlowerValueUpgradeLevel && window.terrariumFlowerValueUpgradeLevel > 0)) {
    if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 10) || (window.terrariumFlowerValueUpgradeLevel && window.terrariumFlowerValueUpgradeLevel > 0)) {
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
    // Add event listeners only if not already added
    if (!div.hasAttribute('data-listeners-added')) {
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
      div.setAttribute('data-listeners-added', 'true');
    }
    updateFlowerUpgrade3CircleCost();
  }
  if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 30) || window.terrariumUpgradesUnlocked.flower4 || (window.terrariumFlowerUpgrade4Level && window.terrariumFlowerUpgrade4Level > 0)) {
    if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 30) || (window.terrariumFlowerUpgrade4Level && window.terrariumFlowerUpgrade4Level > 0)) {
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
    // Add click handler only if not already added
    if (!flowerUpgrade4Card.hasAttribute('data-click-handler-added')) {
      flowerUpgrade4Card.onclick = function(e) {
        updateFlowerUpgrade4Modal();
        const modal = document.getElementById('flowerUpgrade4Modal');
        if (modal) modal.style.display = 'flex';
        e.stopPropagation();
      };
      flowerUpgrade4Card.setAttribute('data-click-handler-added', 'true');
    }
    flowerUpgrade4Card.oncontextmenu = function(e) {
      if (canBuyFlowerUpgrade4()) {
        buyFlowerUpgrade4(1); 
      }
      e.preventDefault();
      e.stopPropagation();
    };
    updateFlowerUpgrade4CircleCost();
  }
  if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 75) || window.terrariumUpgradesUnlocked.flower5 || (window.terrariumFlowerUpgrade5Level && window.terrariumFlowerUpgrade5Level > 0)) {
    if ((typeof terrariumLevel !== 'undefined' && terrariumLevel >= 75) || (window.terrariumFlowerUpgrade5Level && window.terrariumFlowerUpgrade5Level > 0)) {
      window.terrariumUpgradesUnlocked.flower5 = true;
    }
    let flowerUpgrade5Card = document.getElementById('flower-upgrade-5');
    if (!flowerUpgrade5Card) {
      const div = document.createElement('div');
      div.className = 'terrarium-upgrade-card';
      div.id = 'flower-upgrade-5';
      div.setAttribute('data-upgrade', 'flower5');
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
        <img src="assets/icons/flower upgrade 5.png" style="width:54px; height:54px; margin-bottom:0.2em;">
        <div class="terrarium-upgrade-level" style="font-size:1.1em; color:#333; font-weight:bold;">0</div>
        <div style="position:absolute; bottom:-2.2em; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:0.2em;">
          <img src="assets/icons/flower.png" style="width:20px; height:20px;">
          <span style="color:#e33; font-weight:bold; font-size:1.1em;">1e38</span>
        </div>
      `;
      flowerRow.appendChild(div);
      flowerUpgrade5Card = div;
    }
    flowerUpgrade5Card.style.display = 'flex';
    // Add click handler only if not already added
    if (!flowerUpgrade5Card.hasAttribute('data-click-handler-added')) {
      flowerUpgrade5Card.onclick = function(e) {
        updateFlowerUpgrade5Modal();
        const modal = document.getElementById('flowerUpgrade5Modal');
        if (modal) modal.style.display = 'flex';
        e.stopPropagation();
      };
      flowerUpgrade5Card.setAttribute('data-click-handler-added', 'true');
      // Add context menu handler only if not already added
      if (!flowerUpgrade5Card.hasAttribute('data-context-handler-added')) {
        flowerUpgrade5Card.oncontextmenu = function(e) {
          if (canBuyFlowerUpgrade5()) {
            buyMaxFlowerUpgrade5(); 
          }
          e.preventDefault();
          e.stopPropagation();
        };
        flowerUpgrade5Card.setAttribute('data-context-handler-added', 'true');
      }
    }
    updateFlowerUpgrade5CircleCost();
  }
  const nextUnlock = document.getElementById('terrariumFlowerNextUnlock');
  if (nextUnlock) {
    if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 75) {
      nextUnlock.textContent = 'All upgrades unlocked';
    } else if (typeof terrariumLevel !== 'undefined' && terrariumLevel >= 30) {
      nextUnlock.textContent = 'Next upgrade unlocks at level 75';
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
  updateFlowerUpgrade5CircleCost();
  // Force a comprehensive refresh after all setup is complete
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
  const kpNectarCard = document.getElementById('nectar-upgrade-1');
  if (kpNectarCard) {
    // Add click handler only if not already added
    if (!kpNectarCard.hasAttribute('data-click-handler-added')) {
      kpNectarCard.onclick = function() {
        updateKpNectarUpgradeModal();
        const modal = document.getElementById('kpNectarUpgradeModal');
        if (modal) {
          modal.style.display = 'flex';
        } else {
        }
      };
      kpNectarCard.setAttribute('data-click-handler-added', 'true');
    // Add context menu handler only if not already added
    if (!kpNectarCard.hasAttribute('data-context-handler-added')) {
      kpNectarCard.oncontextmenu = function(e) {
        handlePollenUpgradeRightClick('nectar1', e);
      };
      kpNectarCard.setAttribute('data-context-handler-added', 'true');
    }
  }
  }
  const pollenFlowerNectarCard = document.getElementById('nectar-upgrade-2');
  if (pollenFlowerNectarCard) {
    // Add click handler only if not already added
    if (!pollenFlowerNectarCard.hasAttribute('data-click-handler-added')) {
      pollenFlowerNectarCard.onclick = function() {
        updatePollenFlowerNectarUpgradeModal();
        const modal = document.getElementById('pollenFlowerNectarUpgradeModal');
        if (modal) {
          modal.style.display = 'flex';
        } else {
        }
      };
      pollenFlowerNectarCard.setAttribute('data-click-handler-added', 'true');
    }
    // Add context menu handler only if not already added
    if (!pollenFlowerNectarCard.hasAttribute('data-context-handler-added')) {
      pollenFlowerNectarCard.oncontextmenu = function(e) {
        handlePollenUpgradeRightClick('nectar2', e);
      };
      pollenFlowerNectarCard.setAttribute('data-context-handler-added', 'true');
    }
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
  const nectarInfinityCard = document.getElementById('nectar-upgrade-5');
  if (nectarInfinityCard) {
    nectarInfinityCard.onclick = function() {
      updateNectarInfinityUpgradeModal();
      const modal = document.getElementById('nectarInfinityUpgradeModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
      }
    };
    nectarInfinityCard.oncontextmenu = function(e) {
      handlePollenUpgradeRightClick('nectar5', e);
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

let pollenValueUpgrade2Level = 0;
const POLLEN_VALUE_UPGRADE_CAP = 1000;
const POLLEN_VALUE_UPGRADE2_CAP = 1000;

function getPollenValueUpgradeCost(level) {
  return new Decimal(15).mul(new Decimal(1.3).pow(level)).ceil();
}

function getPollenValueUpgradeEffect(level) {
  let base = new Decimal(0.5).mul(level);
  const doubleCount = Math.floor((level - 1) / 25);
  base = base.mul(new Decimal(2).pow(doubleCount));
  return new Decimal(1).add(base); 
}

function getFlowerUpgrade3Cost(level) {
  return new Decimal(1000).mul(new Decimal(1.5).pow(level)).ceil();
}

function getFlowerUpgrade3Effect(level) {
  return new Decimal(1.2).pow(level);
}

function getFlowerUpgrade3CostToNext25(level) {
  const nextTarget = Math.min(POLLEN_VALUE_UPGRADE2_CAP, level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    total = total.add(getFlowerUpgrade3Cost(l));
  }
  return total;
}

function getPollenValueUpgradeCostToNext25(level) {
  const nextTarget = Math.min(POLLEN_VALUE_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    total = total.add(getPollenValueUpgradeCost(l));
  }
  return total;
}

function updatePollenUpgradeModal() {
  const lvl = pollenValueUpgradeLevel;
  const cap = POLLEN_VALUE_UPGRADE_CAP;
  document.getElementById('pollenUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('pollenUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getPollenValueUpgradeEffect(lvl))}</span>`;
  const cost = getPollenValueUpgradeCost(lvl);
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
  const costSpan = document.getElementById('pollenUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('pollenUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getPollenValueUpgradeCostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = pollenDecimal.gte(next25Decimal);
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
  document.getElementById('pollenUpgrade2Effect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getFlowerUpgrade3Effect(lvl))}</span> pollen & flowers`;
  const cost = getFlowerUpgrade3Cost(lvl);
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
  const costSpan = document.getElementById('pollenUpgrade2CostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('pollenUpgrade2Cost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getFlowerUpgrade3CostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = flowersDecimal.gte(next25Decimal);
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
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
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
  // Ensure terrariumPollen is a Decimal
  if (!DecimalUtils.isDecimal(terrariumPollen)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  return typeof terrariumPollen !== 'undefined' && terrariumPollen.gte(getPollenValueUpgradeCost(pollenValueUpgradeLevel)) && pollenValueUpgradeLevel < POLLEN_VALUE_UPGRADE_CAP;
}

function buyPollenValueUpgrade(count) {
  // Ensure terrariumPollen is a Decimal
  if (!DecimalUtils.isDecimal(terrariumPollen)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  if (pollenValueUpgradeLevel >= POLLEN_VALUE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && pollenValueUpgradeLevel < POLLEN_VALUE_UPGRADE_CAP) {
    const cost = getPollenValueUpgradeCost(pollenValueUpgradeLevel);
    if (terrariumPollen.gte(cost)) {
      terrariumPollen = terrariumPollen.sub(cost);
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
  let pollen = new Decimal(terrariumPollen);
  while (lvl < POLLEN_VALUE_UPGRADE_CAP) {
    const cost = getPollenValueUpgradeCost(lvl);
    if (pollen.gte(cost)) {
      pollen = pollen.sub(cost);
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
  return typeof terrariumFlowers !== 'undefined' && terrariumFlowers.gte(getFlowerUpgrade3Cost(pollenValueUpgrade2Level)) && pollenValueUpgrade2Level < POLLEN_VALUE_UPGRADE2_CAP;
}

function buyFlowerUpgrade3(count) {
  if (pollenValueUpgrade2Level >= POLLEN_VALUE_UPGRADE2_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && pollenValueUpgrade2Level < POLLEN_VALUE_UPGRADE2_CAP) {
    const cost = getFlowerUpgrade3Cost(pollenValueUpgrade2Level);
    if (terrariumFlowers.gte(cost)) {
      terrariumFlowers = terrariumFlowers.sub(cost);
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
  let flowers = new Decimal(terrariumFlowers);
  while (lvl < POLLEN_VALUE_UPGRADE2_CAP) {
    const cost = getFlowerUpgrade3Cost(lvl);
    if (flowers.gte(cost)) {
      flowers = flowers.sub(cost);
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
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
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

// Add comprehensive UI refresh function
function refreshTerrariumUI() {
  try {
    // Check if we're in the terrarium tab and upgrade area is visible
    const terrariumTab = document.getElementById('terrariumTab');
    if (!terrariumTab || terrariumTab.style.display === 'none') {
      return; // Don't update if not visible
    }
    
    // Clean up any unwanted styles that might have been applied to upgrade cards
    cleanupUpgradeCardStyles();
    
    // Ensure all upgrade event listeners are properly attached (but only for dynamic cards)
    ensureDynamicUpgradeEventListeners();
    
    // Special handling for pollen2 which gets frequently updated
    ensurePollen2EventListeners();
    
    // Update currency displays using existing functions
    if (typeof updateCurrencyDisplaysOnly === 'function') {
      updateCurrencyDisplaysOnly();
    }
    
    // Update upgrade currency counts
    updateTerrariumUpgradeCurrencyCounts();
    
    // Call the existing upgrade circle update functions
    if (typeof updatePollenUpgradeCircleCost === 'function') {
      updatePollenUpgradeCircleCost();
    }
    if (typeof updateFlowerUpgradeCircleCost === 'function') {
      updateFlowerUpgradeCircleCost();
    }
    if (typeof updateFlowerUpgrade4CircleCost === 'function') {
      updateFlowerUpgrade4CircleCost();
    }
    
    // Update modal contents if they're open
    const openModals = [
      { id: 'pollenUpgradeModal', update: 'updatePollenUpgradeModal' },
      { id: 'flowerUpgradeModal', update: 'updateFlowerUpgradeModal' },
      { id: 'extraChargeUpgradeModal', update: 'updateExtraChargeUpgradeModal' },
      { id: 'xpMultiplierUpgradeModal', update: 'updateXpMultiplierUpgradeModal' },
      { id: 'flowerFieldExpansionUpgradeModal', update: 'updateFlowerFieldExpansionUpgradeModal' }
    ];
    
    openModals.forEach(modal => {
      const modalElement = document.getElementById(modal.id);
      if (modalElement && modalElement.style.display === 'flex') {
        if (typeof window[modal.update] === 'function') {
          try {
            window[modal.update]();
          } catch (modalError) {
            console.warn(`Error updating modal ${modal.id}:`, modalError);
          }
        }
      }
    });
  } catch (error) {
    console.warn('Error in comprehensive terrarium UI refresh:', error);
  }
}

// Clean up any unwanted styles on upgrade cards
function cleanupUpgradeCardStyles() {
  try {
    const upgradeCards = document.querySelectorAll('.terrarium-upgrade-card');
    upgradeCards.forEach(card => {
      // Remove any filter or opacity overrides that might have been applied
      if (card.style.filter && card.style.filter.includes('brightness')) {
        card.style.filter = '';
      }
      if (card.style.opacity && card.style.opacity !== '1') {
        card.style.opacity = '';
      }
    });
  } catch (error) {
    console.warn('Error cleaning up upgrade card styles:', error);
  }
}

// Attach event listeners only if they haven't been attached yet
function attachUpgradeListenersIfNeeded(element, upgradeType) {
  if (!element) return;
  
  try {
    // Use a more reliable flag that doesn't get lost
    const flagName = `_eventListeners_${upgradeType}`;
    
    if (!element[flagName]) {
      element.addEventListener('click', function(e) {
        e.stopPropagation();
        handleUpgradeClick(upgradeType);
      });
      
      element.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        handlePollenUpgradeRightClick(upgradeType, e);
      });
      
      // Mark as having listeners attached
      element[flagName] = true;
    }
  } catch (error) {
    console.warn('Error attaching upgrade listeners for', upgradeType, ':', error);
  }
}

// Robust event listener management for upgrade cards
function ensureUpgradeEventListeners(element, upgradeType) {
  if (!element) return;
  
  try {
    // Remove existing listeners to prevent duplicates
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    
    // Attach fresh event listeners
    newElement.addEventListener('click', function(e) {
      e.stopPropagation();
      handleUpgradeClick(upgradeType);
    });
    
    newElement.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handlePollenUpgradeRightClick(upgradeType, e);
    });
    
  } catch (error) {
    console.warn('Error ensuring upgrade event listeners for', upgradeType, ':', error);
  }
}

// Targeted function to ensure only dynamic upgrade cards have proper event listeners
function ensureDynamicUpgradeEventListeners() {
  try {
    // Only handle the dynamic upgrade cards that are created/modified by updatePollenUpgradeRow
    // Exclude static cards (pollen1, pollen2, flower1) that use DOMContentLoaded listeners
    const dynamicUpgrades = ['pollen3', 'pollen4', 'pollen5'];
    
    dynamicUpgrades.forEach(upgradeType => {
      const card = document.querySelector(`.terrarium-upgrade-card[data-upgrade="${upgradeType}"]`);
      if (card && card.style.display !== 'none') {
        // Check if the card already has proper event listeners by checking for our custom flag
        if (!card.hasEventListenersAttached) {
          attachUpgradeListeners(card, upgradeType);
          card.hasEventListenersAttached = true;
        }
      }
    });
    
    // Separately handle static cards that might have lost their listeners
    ensureStaticUpgradeEventListeners();
  } catch (error) {
    console.warn('Error ensuring dynamic upgrade event listeners:', error);
  }
}

// Ensure static upgrade cards have their event listeners without replacing the elements
function ensureStaticUpgradeEventListeners() {
  try {
    const staticUpgrades = ['pollen1', 'pollen2', 'flower1'];
    
    staticUpgrades.forEach(upgradeType => {
      const card = document.querySelector(`.terrarium-upgrade-card[data-upgrade="${upgradeType}"]`);
      if (card && !card.hasStaticEventListenersAttached) {
        // Re-attach event listeners without replacing the element
        attachUpgradeListeners(card, upgradeType);
        card.hasStaticEventListenersAttached = true;
      }
    });
    
    // Special handling for pollen2 which has frequent DOM updates
    ensurePollen2EventListeners();
  } catch (error) {
    console.warn('Error ensuring static upgrade event listeners:', error);
  }
}

// Comprehensive function to ensure all upgrade cards have proper event listeners
function ensureAllUpgradeEventListeners() {
  try {
    // Don't replace static upgrade cards that use DOMContentLoaded listeners
    const staticUpgrades = ['pollen1', 'pollen2', 'flower1'];
    
    // Handle all upgrade cards
    const upgradeCards = document.querySelectorAll('.terrarium-upgrade-card');
    upgradeCards.forEach(card => {
      const upgradeType = card.getAttribute('data-upgrade');
      if (upgradeType && !staticUpgrades.includes(upgradeType)) {
        // Only replace dynamic upgrade cards
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Attach fresh event listeners based on upgrade type
        attachUpgradeListeners(newCard, upgradeType);
      } else if (upgradeType && staticUpgrades.includes(upgradeType)) {
        // For static cards, just ensure they have backup listeners without replacing
        if (!card.hasBackupEventListenersAttached) {
          attachUpgradeListeners(card, upgradeType);
          card.hasBackupEventListenersAttached = true;
        }
      }
    });
  } catch (error) {
    console.warn('Error ensuring all upgrade event listeners:', error);
  }
}

// Attach appropriate event listeners for each upgrade type
function attachUpgradeListeners(element, upgradeType) {
  try {
    element.addEventListener('click', function(e) {
      e.stopPropagation();
      handleUpgradeClick(upgradeType);
    });
    
    element.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      handlePollenUpgradeRightClick(upgradeType, e);
    });
  } catch (error) {
    console.warn('Error attaching upgrade listeners for', upgradeType, ':', error);
  }
}

// Handle upgrade click events
function handleUpgradeClick(upgradeType) {
  try {
    switch(upgradeType) {
      case 'pollen1':
        showPollenUpgradeModal();
        break;
      case 'pollen2':
        showPollenToolSpeedUpgradeModal();
        break;
      case 'pollen3':
        updateExtraChargeUpgradeModal();
        const modal3 = document.getElementById('extraChargeUpgradeModal');
        if (modal3) modal3.style.display = 'flex';
        break;
      case 'pollen4':
        updateXpMultiplierUpgradeModal();
        const modal4 = document.getElementById('xpMultiplierUpgradeModal');
        if (modal4) modal4.style.display = 'flex';
        break;
      case 'pollen5':
        updateFlowerFieldExpansionUpgradeModal();
        const modal5 = document.getElementById('flowerFieldExpansionUpgradeModal');
        if (modal5) modal5.style.display = 'flex';
        break;
      case 'flower1':
        updateFlowerUpgradeModal();
        const flowerModal1 = document.getElementById('flowerUpgradeModal');
        if (flowerModal1) flowerModal1.style.display = 'flex';
        break;
      case 'flower2':
        updateFlowerXPUpgradeModal();
        const flowerModal2 = document.getElementById('flowerXPUpgradeModal');
        if (flowerModal2) flowerModal2.style.display = 'flex';
        break;
      case 'flower3':
        updateFlowerUpgrade3Modal();
        const flowerModal3 = document.getElementById('pollenUpgrade2Modal');
        if (flowerModal3) flowerModal3.style.display = 'flex';
        break;
      case 'flower4':
        updateFlowerUpgrade4Modal();
        const flowerModal4 = document.getElementById('flowerUpgrade4Modal');
        if (flowerModal4) flowerModal4.style.display = 'flex';
        break;
      // Add nectar upgrade types
      case 'nectar1':
        updateKpNectarUpgradeModal();
        const nectarModal1 = document.getElementById('kpNectarUpgradeModal');
        if (nectarModal1) nectarModal1.style.display = 'flex';
        break;
      // Add other upgrade types as needed
    }
  } catch (error) {
    console.warn('Error handling upgrade click for', upgradeType, ':', error);
  }
}

// Override various purchase functions to ensure UI updates
const origBuyPollenValueUpgrade = buyPollenValueUpgrade;

buyPollenValueUpgrade = function(count) {
  origBuyPollenValueUpgrade(count);
  window.terrariumPollenValueUpgradeLevel = pollenValueUpgradeLevel;
  // Force comprehensive UI refresh after purchase with slight delay
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
};

const origBuyMaxPollenValueUpgrade = buyMaxPollenValueUpgrade;

buyMaxPollenValueUpgrade = function() {
  origBuyMaxPollenValueUpgrade();
  window.terrariumPollenValueUpgradeLevel = pollenValueUpgradeLevel;
  // Force comprehensive UI refresh after purchase with slight delay
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
};

// Removed redundant function override - will be handled in the consolidated function below

let flowerValueUpgradeLevel = 0;
const FLOWER_VALUE_UPGRADE_CAP = 1000;

function getFlowerValueUpgradeCost(level) {
  return new Decimal(20).mul(new Decimal(1.35).pow(level)).ceil();
}

function getFlowerValueUpgradeEffect(level) {
  let base = new Decimal(0.25).mul(level);
  const doubleCount = Math.floor((level - 1) / 25);
  base = base.mul(new Decimal(2).pow(doubleCount));
  return new Decimal(1).add(base); 
}

function getFlowerValueUpgradeCostToNext25(level) {
  const nextTarget = Math.min(FLOWER_VALUE_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    total = total.add(getFlowerValueUpgradeCost(l));
  }
  return total;
}

function updateFlowerUpgradeModal() {
  const lvl = flowerValueUpgradeLevel;
  const cap = FLOWER_VALUE_UPGRADE_CAP;
  document.getElementById('flowerUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerUpgradeEffect').innerHTML = `Effect: <span style=\"color:#f0f;\">x${formatNumberSci(getFlowerValueUpgradeEffect(lvl))}</span>`;
  const cost = getFlowerValueUpgradeCost(lvl);
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
  const costSpan = document.getElementById('flowerUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getFlowerValueUpgradeCostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = flowersDecimal.gte(next25Decimal);
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
  return typeof terrariumFlowers !== 'undefined' && terrariumFlowers.gte(getFlowerValueUpgradeCost(flowerValueUpgradeLevel)) && flowerValueUpgradeLevel < FLOWER_VALUE_UPGRADE_CAP;
}

function buyFlowerValueUpgrade(count) {
  if (flowerValueUpgradeLevel >= FLOWER_VALUE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && flowerValueUpgradeLevel < FLOWER_VALUE_UPGRADE_CAP) {
    const cost = getFlowerValueUpgradeCost(flowerValueUpgradeLevel);
    if (terrariumFlowers.gte(cost)) {
      terrariumFlowers = terrariumFlowers.sub(cost);
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
  let flowers = new Decimal(terrariumFlowers);
  while (lvl < FLOWER_VALUE_UPGRADE_CAP) {
    const cost = getFlowerValueUpgradeCost(lvl);
    if (flowers.gte(cost)) {
      flowers = flowers.sub(cost);
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
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
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
  // Force comprehensive UI refresh after purchase with slight delay
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
};

const origBuyMaxFlowerValueUpgrade = buyMaxFlowerValueUpgrade;

buyMaxFlowerValueUpgrade = function() {
  origBuyMaxFlowerValueUpgrade();
  window.terrariumFlowerValueUpgradeLevel = flowerValueUpgradeLevel;
  // Force comprehensive UI refresh after purchase with slight delay
  setTimeout(() => {
    refreshTerrariumUI();
  }, 100);
};

const origUpdateTerrariumUpgradeCurrencyCounts = updateTerrariumUpgradeCurrencyCounts;

updateTerrariumUpgradeCurrencyCounts = function() {
  try {
    origUpdateTerrariumUpgradeCurrencyCounts();
    // Update all upgrade UI elements in one place
    if (typeof updatePollenUpgradeCircleCost === 'function') {
      updatePollenUpgradeCircleCost();
    }
    if (typeof updateFlowerUpgradeCircleCost === 'function') {
      updateFlowerUpgradeCircleCost();
    }
    if (typeof updateFlowerUpgrade4CircleCost === 'function') {
      updateFlowerUpgrade4CircleCost();
    }
    
    // Also update the upgrade rows to ensure proper visibility
    if (typeof updatePollenUpgradeRow === 'function') {
      updatePollenUpgradeRow();
    }
    if (typeof updateFlowerUpgradeRow === 'function') {
      updateFlowerUpgradeRow();
    }
  } catch (error) {
    console.warn('Error in comprehensive UI update:', error);
    // Fall back to original function if there's an error
    try {
      origUpdateTerrariumUpgradeCurrencyCounts();
    } catch (fallbackError) {
      console.error('Critical error in terrarium UI update:', fallbackError);
    }
  }
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
  // Check cooldown before doing anything
  if (window.pollenWandCooldown) return;
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
  return new Decimal(EXTRA_CHARGE_UPGRADE_BASE_COST).mul(new Decimal(EXTRA_CHARGE_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getExtraChargeUpgradeEffect(level) {
  let base = 0.2 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= new Decimal(2).pow(doubleCount).toNumber();
  return 1 + base; 
}

// Expose to global window object for charger.js
window.getExtraChargeUpgradeEffect = getExtraChargeUpgradeEffect;

function getExtraChargeUpgradeCostToNext25(level) {
  const nextTarget = Math.min(EXTRA_CHARGE_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    const cost = getExtraChargeUpgradeCost(l);
    total = total.add(cost);
  }
  return total;
}

function updateExtraChargeUpgradeModal() {
  const lvl = extraChargeUpgradeLevel;
  const cap = EXTRA_CHARGE_UPGRADE_CAP;
  document.getElementById('extraChargeUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('extraChargeUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getExtraChargeUpgradeEffect(lvl))}</span>`;
  const cost = getExtraChargeUpgradeCost(lvl);
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
  const costSpan = document.getElementById('extraChargeUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('extraChargeUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getExtraChargeUpgradeCostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = pollenDecimal.gte(next25Decimal);
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
  // Ensure terrariumPollen is a Decimal
  if (!DecimalUtils.isDecimal(terrariumPollen)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  return typeof terrariumPollen !== 'undefined' && terrariumPollen.gte(getExtraChargeUpgradeCost(extraChargeUpgradeLevel)) && extraChargeUpgradeLevel < EXTRA_CHARGE_UPGRADE_CAP;
}

function buyExtraChargeUpgrade(count) {
  // Ensure terrariumPollen is a Decimal
  if (!DecimalUtils.isDecimal(terrariumPollen)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  if (extraChargeUpgradeLevel >= EXTRA_CHARGE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && extraChargeUpgradeLevel < EXTRA_CHARGE_UPGRADE_CAP) {
    const cost = getExtraChargeUpgradeCost(extraChargeUpgradeLevel);
    if (terrariumPollen.gte(cost)) {
      terrariumPollen = terrariumPollen.sub(cost);
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
  let pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  
  while (lvl < EXTRA_CHARGE_UPGRADE_CAP) {
    const cost = getExtraChargeUpgradeCost(lvl);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    
    if (pollenDecimal.gte(costDecimal)) {
      pollenDecimal = pollenDecimal.sub(costDecimal);
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
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
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
  return new Decimal(XP_MULTIPLIER_UPGRADE_BASE_COST).mul(new Decimal(XP_MULTIPLIER_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getXpMultiplierUpgradeEffect(level) {
  return new Decimal(1.1).pow(level);
}

function getXpMultiplierUpgradeCostToNext25(level) {
  const nextTarget = Math.min(XP_MULTIPLIER_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    total = total.add(getXpMultiplierUpgradeCost(l));
  }
  return total;
}

function updateXpMultiplierUpgradeModal() {
  const lvl = xpMultiplierUpgradeLevel;
  const cap = XP_MULTIPLIER_UPGRADE_CAP;
  document.getElementById('xpMultiplierUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('xpMultiplierUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getXpMultiplierUpgradeEffect(lvl))}</span>`;
  const cost = getXpMultiplierUpgradeCost(lvl);
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
  const costSpan = document.getElementById('xpMultiplierUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('xpMultiplierUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getXpMultiplierUpgradeCostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = pollenDecimal.gte(next25Decimal);
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
  // Ensure terrariumPollen is a Decimal
  if (!DecimalUtils.isDecimal(terrariumPollen)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  return typeof terrariumPollen !== 'undefined' && terrariumPollen.gte(getXpMultiplierUpgradeCost(xpMultiplierUpgradeLevel)) && xpMultiplierUpgradeLevel < XP_MULTIPLIER_UPGRADE_CAP;
}

function buyXpMultiplierUpgrade(count) {
  // Ensure terrariumPollen is a Decimal
  if (!DecimalUtils.isDecimal(terrariumPollen)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  if (xpMultiplierUpgradeLevel >= XP_MULTIPLIER_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && xpMultiplierUpgradeLevel < XP_MULTIPLIER_UPGRADE_CAP) {
    const cost = getXpMultiplierUpgradeCost(xpMultiplierUpgradeLevel);
    if (terrariumPollen.gte(cost)) {
      terrariumPollen = terrariumPollen.sub(cost);
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
  let pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  
  while (lvl < XP_MULTIPLIER_UPGRADE_CAP) {
    const cost = getXpMultiplierUpgradeCost(lvl);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    
    if (pollenDecimal.gte(costDecimal)) {
      pollenDecimal = pollenDecimal.sub(costDecimal);
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
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
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
  return new Decimal(FLOWER_FIELD_EXPANSION_UPGRADE_BASE_COST).mul(new Decimal(FLOWER_FIELD_EXPANSION_UPGRADE_COST_MULT).pow(level));
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
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = getFlowerFieldExpansionUpgradeCost(flowerFieldExpansionUpgradeLevel);
  const cost = costDecimal instanceof Decimal ? costDecimal : new Decimal(costDecimal);
  return pollenDecimal.gte(cost) && flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP;
}

function buyFlowerFieldExpansionUpgrade(count = 1) {
  if (flowerFieldExpansionUpgradeLevel >= FLOWER_FIELD_EXPANSION_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP) {
    const cost = getFlowerFieldExpansionUpgradeCost(flowerFieldExpansionUpgradeLevel);
    const pollenDecimal = terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    if (pollenDecimal.gte(costDecimal)) {
      terrariumPollen = pollenDecimal.sub(costDecimal);
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

function buyMaxFlowerFieldExpansionUpgrade() {
  if (flowerFieldExpansionUpgradeLevel >= FLOWER_FIELD_EXPANSION_UPGRADE_CAP) {
    if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
      window.trackMaxedOutUpgradeAttempt();
    }
    return;
  }
  
  let bought = 0;
  const maxIterations = 1000; // Prevent infinite loops
  let iterations = 0;
  
  while (canBuyFlowerFieldExpansionUpgrade() && iterations < maxIterations) {
    const cost = getFlowerFieldExpansionUpgradeCost(flowerFieldExpansionUpgradeLevel);
    const pollenDecimal = terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    
    if (pollenDecimal.gte(costDecimal) && flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP) {
      terrariumPollen = pollenDecimal.sub(costDecimal);
      flowerFieldExpansionUpgradeLevel++;
      bought++;
      iterations++;
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
  
  // Use proper Decimal arithmetic for the comparison
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal) && flowerFieldExpansionUpgradeLevel < FLOWER_FIELD_EXPANSION_UPGRADE_CAP;
  
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

function getPollenToolSpeedUpgradeCap() {
  return 95;
}

function getPollenToolSpeedUpgradeCost(level) {
  return new Decimal(POLLEN_TOOL_SPEED_UPGRADE_BASE_COST).mul(new Decimal(POLLEN_TOOL_SPEED_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getPollenToolSpeedUpgradeEffect(level) {
  return Math.max(POLLEN_TOOL_SPEED_UPGRADE_MIN_INTERVAL, POLLEN_TOOL_SPEED_UPGRADE_ORIGINAL_INTERVAL - level * POLLEN_TOOL_SPEED_UPGRADE_INTERVAL_DECREASE);
}

function getPollenToolSpeedUpgradeCostToNext25(level) {
  const nextTarget = Math.min(getPollenToolSpeedUpgradeCap(), level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    const cost = getPollenToolSpeedUpgradeCost(l);
    total = total.add(cost);
  }
  return total;
}

function updatePollenToolSpeedUpgradeModal() {
  const lvl = pollenToolSpeedUpgradeLevel;
  const cap = getPollenToolSpeedUpgradeCap();
  document.getElementById('pollenToolSpeedUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('pollenToolSpeedUpgradeEffect').innerHTML = `Tool cooldown: <span style=\"color:#0ff;\">${getPollenToolSpeedUpgradeEffect(lvl).toFixed(3)}s</span>`;
  const cost = getPollenToolSpeedUpgradeCost(lvl);
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
  const costSpan = document.getElementById('pollenToolSpeedUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('pollenToolSpeedUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getPollenToolSpeedUpgradeCostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = pollenDecimal.gte(next25Decimal);
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
  
  // Ensure pollen2 event listeners are properly attached after modal updates
  ensurePollen2EventListeners();
}

function canBuyPollenToolSpeedUpgrade() {
  // Ensure terrariumPollen is a Decimal - use simple instanceof check
  if (!(terrariumPollen instanceof Decimal)) {
    terrariumPollen = new Decimal(terrariumPollen || 0);
  }
  return typeof terrariumPollen !== 'undefined' && terrariumPollen.gte(getPollenToolSpeedUpgradeCost(pollenToolSpeedUpgradeLevel)) && pollenToolSpeedUpgradeLevel < getPollenToolSpeedUpgradeCap();
}

function buyPollenToolSpeedUpgrade(count) {
  if (pollenToolSpeedUpgradeLevel >= getPollenToolSpeedUpgradeCap() && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && pollenToolSpeedUpgradeLevel < getPollenToolSpeedUpgradeCap()) {
    const cost = getPollenToolSpeedUpgradeCost(pollenToolSpeedUpgradeLevel);
    const pollenDecimal = terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    if (pollenDecimal.gte(costDecimal)) {
      terrariumPollen = pollenDecimal.sub(costDecimal);
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
  let pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  
  while (lvl < getPollenToolSpeedUpgradeCap()) {
    const cost = getPollenToolSpeedUpgradeCost(lvl);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    
    if (pollenDecimal.gte(costDecimal)) {
      pollenDecimal = pollenDecimal.sub(costDecimal);
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
  
  // Make showPollenToolSpeedUpgradeModal globally accessible
  window.showPollenToolSpeedUpgradeModal = showPollenToolSpeedUpgradeModal;
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
  const pollenDecimal = typeof terrariumPollen !== 'undefined' ? (terrariumPollen instanceof Decimal ? terrariumPollen : new Decimal(terrariumPollen)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = pollenDecimal.gte(costDecimal);
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = pollenToolSpeedUpgradeLevel >= getPollenToolSpeedUpgradeCap() ? 'maxed' : pollenToolSpeedUpgradeLevel;
  }
  
  // Ensure event listeners are still attached after DOM manipulation
  ensurePollen2EventListeners();
}

// Debug function to check pollen2 event listener state
function debugPollen2EventListeners() {
  const pollen2Card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"]');
  if (!pollen2Card) {
    return;
  }
  
  if (typeof canBuyPollenToolSpeedUpgrade === 'function') {
  }
  
  const cost = getPollenToolSpeedUpgradeCost(pollenToolSpeedUpgradeLevel);
  
  // Test click simulation
  try {
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    pollen2Card.dispatchEvent(clickEvent);
  } catch (error) {
  }
  
  // Test right-click simulation
  try {
    const rightClickEvent = new MouseEvent('contextmenu', { 
      bubbles: true, 
      cancelable: true,
      button: 2,
      buttons: 2
    });
    pollen2Card.dispatchEvent(rightClickEvent);
  } catch (error) {
  }
}

// Make debug function globally available for testing
window.debugPollen2 = debugPollen2EventListeners;

// Make pollen2 fix function globally available for testing
window.fixPollen2 = function() {
  ensurePollen2EventListeners();
};

// Test function to verify all pollen2 functions are working
window.testPollen2Functions = function() {
  
  const pollen2Card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"]');
  
  if (typeof canBuyPollenToolSpeedUpgrade === 'function') {
    try {
      const canBuy = canBuyPollenToolSpeedUpgrade();
    } catch (error) {
    }
  }
  
  // Test modal function
  if (typeof window.showPollenToolSpeedUpgradeModal === 'function') {
  } else {
  }
  
};

// Specific function to ensure pollen2 event listeners are maintained
function ensurePollen2EventListeners() {
  try {
    const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="pollen2"]');
    if (!card) return;
    
    // Remove any existing event listeners by cloning the element
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    
    // Add fresh event listeners using the global showPollenToolSpeedUpgradeModal function
    newCard.addEventListener('click', function(e) {
      e.stopPropagation();
      if (typeof window.showPollenToolSpeedUpgradeModal === 'function') {
        window.showPollenToolSpeedUpgradeModal();
      } else {
        // Fallback to handleUpgradeClick
        handleUpgradeClick('pollen2');
      }
    });
    
    newCard.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        if (typeof canBuyPollenToolSpeedUpgrade === 'function' && canBuyPollenToolSpeedUpgrade()) {
          if (typeof buyMaxPollenToolSpeedUpgrade === 'function') {
            buyMaxPollenToolSpeedUpgrade();
          } else {
            console.error('buyMaxPollenToolSpeedUpgrade function not available');
          }
        } else {
        }
      } catch (error) {
        console.error('Error in pollen2 right-click handler:', error);
      }
    });
    
    newCard.hasPollen2ListenersFixed = true;
  } catch (error) {
    console.warn('Error ensuring pollen2 event listeners:', error);
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
  return new Decimal(1.5).pow(level - 1);
}

let flowerXPUpgradeLevel = 0;
const FLOWER_XP_UPGRADE_CAP = 1000;
let flowerUpgrade4Level = 0;
const FLOWER_UPGRADE_4_CAP = 1; 
// Flower upgrade 5 level is now managed via window.terrariumFlowerUpgrade5Level
const FLOWER_UPGRADE_5_CAP = 1000;
const FLOWER_UPGRADE_5_BASE_COST = 1e38;
const FLOWER_UPGRADE_5_COST_MULT = 1.4;
const FLOWER_XP_UPGRADE_BASE_COST = 100;
const FLOWER_XP_UPGRADE_COST_MULT = 1.3;

function getFlowerXPUpgradeCost(level) {
  return new Decimal(FLOWER_XP_UPGRADE_BASE_COST).mul(new Decimal(FLOWER_XP_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getFlowerXPUpgradeEffect(level) {
  let base = 0.5 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base;
}

function getFlowerXPUpgradeCostToNext25(level) {
  const nextTarget = Math.min(FLOWER_XP_UPGRADE_CAP, level + (25 - (level % 25 || 25)));
  let total = new Decimal(0);
  for (let l = level; l < nextTarget; l++) {
    const cost = getFlowerXPUpgradeCost(l);
    total = total.add(cost);
  }
  return total;
}

function updateFlowerXPUpgradeModal() {
  const lvl = flowerXPUpgradeLevel;
  const cap = FLOWER_XP_UPGRADE_CAP;
  document.getElementById('flowerXPUpgradeLevel').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerXPUpgradeEffect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getFlowerXPUpgradeEffect(lvl))}</span>`;
  const cost = getFlowerXPUpgradeCost(lvl);
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
  const costSpan = document.getElementById('flowerXPUpgradeCostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerXPUpgradeCost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  let next25 = getFlowerXPUpgradeCostToNext25(lvl);
  const next25Decimal = next25 instanceof Decimal ? next25 : new Decimal(next25);
  let canAfford25 = flowersDecimal.gte(next25Decimal);
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
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = getFlowerXPUpgradeCost(flowerXPUpgradeLevel);
  const cost = costDecimal instanceof Decimal ? costDecimal : new Decimal(costDecimal);
  return flowersDecimal.gte(cost) && flowerXPUpgradeLevel < FLOWER_XP_UPGRADE_CAP;
}

function buyFlowerXPUpgrade(count) {
  if (flowerXPUpgradeLevel >= FLOWER_XP_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && flowerXPUpgradeLevel < FLOWER_XP_UPGRADE_CAP) {
    const cost = getFlowerXPUpgradeCost(flowerXPUpgradeLevel);
    const flowersDecimal = terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    if (flowersDecimal.gte(costDecimal)) {
      terrariumFlowers = flowersDecimal.sub(costDecimal);
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
  let flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  
  while (lvl < FLOWER_XP_UPGRADE_CAP) {
    const cost = getFlowerXPUpgradeCost(lvl);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    
    if (flowersDecimal.gte(costDecimal)) {
      flowersDecimal = flowersDecimal.sub(costDecimal);
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
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
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

function getFlowerUpgrade5Cost(level) {
  return new Decimal(FLOWER_UPGRADE_5_BASE_COST).mul(new Decimal(FLOWER_UPGRADE_5_COST_MULT).pow(level)).ceil();
}

function getFlowerUpgrade5Effect(level) {
  return new Decimal(1.1).pow(level);
}

// Make flower upgrade 5 effect globally accessible
window.getFlowerUpgrade5Effect = getFlowerUpgrade5Effect;

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
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = getFlowerUpgrade4Cost(flowerUpgrade4Level);
  const cost = costDecimal instanceof Decimal ? costDecimal : new Decimal(costDecimal);
  return flowersDecimal.gte(cost) && flowerUpgrade4Level < FLOWER_UPGRADE_4_CAP;
}

function buyFlowerUpgrade4(count) {
  let bought = 0;
  while (count > 0 && flowerUpgrade4Level < FLOWER_UPGRADE_4_CAP) {
    const cost = getFlowerUpgrade4Cost(flowerUpgrade4Level);
    const flowersDecimal = terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    if (flowersDecimal.gte(costDecimal)) {
      terrariumFlowers = flowersDecimal.sub(costDecimal);
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

function updateFlowerUpgrade5Modal() {
  // Ensure the global variable is initialized
  if (typeof window.terrariumFlowerUpgrade5Level !== 'number') {
    window.terrariumFlowerUpgrade5Level = 0;
  }
  
  const lvl = window.terrariumFlowerUpgrade5Level;
  const cap = FLOWER_UPGRADE_5_CAP;
  document.getElementById('flowerUpgrade5Level').textContent = `Level ${lvl} / ${cap}`;
  document.getElementById('flowerUpgrade5Effect').innerHTML = `Effect: <span style=\"color:#0ff;\">x${formatNumberSci(getFlowerUpgrade5Effect(lvl))}</span>`;
  const cost = getFlowerUpgrade5Cost(lvl);
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
  const costSpan = document.getElementById('flowerUpgrade5CostValue');
  costSpan.textContent = formatNumberSci(cost);
  costSpan.style.color = canAfford ? '#0f0' : '#f33';
  const costLabel = document.getElementById('flowerUpgrade5Cost');
  if (costLabel) costLabel.style.color = canAfford ? '#0f0' : '#f33';
  const circle = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower5"] .terrarium-upgrade-level');
  if (circle) circle.textContent = lvl >= cap ? 'maxed' : lvl;
  updateFlowerUpgrade5CircleCost();
}

function canBuyFlowerUpgrade5() {
  // Ensure the global variable is initialized
  if (typeof window.terrariumFlowerUpgrade5Level !== 'number') {
    window.terrariumFlowerUpgrade5Level = 0;
  }
  
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = getFlowerUpgrade5Cost(window.terrariumFlowerUpgrade5Level);
  const cost = costDecimal instanceof Decimal ? costDecimal : new Decimal(costDecimal);
  return flowersDecimal.gte(cost) && window.terrariumFlowerUpgrade5Level < FLOWER_UPGRADE_5_CAP;
}

function buyFlowerUpgrade5(count) {
  // Ensure the global variable is initialized
  if (typeof window.terrariumFlowerUpgrade5Level !== 'number') {
    window.terrariumFlowerUpgrade5Level = 0;
  }
  
  if (window.terrariumFlowerUpgrade5Level >= FLOWER_UPGRADE_5_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  let bought = 0;
  while (count > 0 && window.terrariumFlowerUpgrade5Level < FLOWER_UPGRADE_5_CAP) {
    const cost = getFlowerUpgrade5Cost(window.terrariumFlowerUpgrade5Level);
    const flowersDecimal = terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    if (flowersDecimal.gte(costDecimal)) {
      terrariumFlowers = flowersDecimal.sub(costDecimal);
      window.terrariumFlowerUpgrade5Level++;
      bought++;
      count--;
    } else {
      break;
    }
  }
  window.terrariumFlowers = terrariumFlowers;
  // No need to reassign since we're already using window.terrariumFlowerUpgrade5Level directly
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      const save = JSON.parse(slotData);
      save.terrariumFlowerUpgrade5Level = window.terrariumFlowerUpgrade5Level;
      localStorage.setItem(`swariaSaveSlot${currentSaveSlot}`, JSON.stringify(save));
    }
  }
  updateFlowerUpgrade5Modal();
  updateFlowerUpgrade5CircleCost();
  updateTerrariumUpgradeCurrencyCounts();
  if (typeof saveGame === 'function') saveGame();
}

function buyMaxFlowerUpgrade5() {
  // Ensure the global variable is initialized
  if (typeof window.terrariumFlowerUpgrade5Level !== 'number') {
    window.terrariumFlowerUpgrade5Level = 0;
  }
  
  let count = 0;
  let lvl = window.terrariumFlowerUpgrade5Level;
  let flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  
  while (lvl < FLOWER_UPGRADE_5_CAP) {
    const cost = getFlowerUpgrade5Cost(lvl);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    
    if (flowersDecimal.gte(costDecimal)) {
      flowersDecimal = flowersDecimal.sub(costDecimal);
      lvl++;
      count++;
    } else {
      break;
    }
  }
  
  if (count > 0) {
    buyFlowerUpgrade5(count);
  }
}

function updateFlowerUpgrade5CircleCost() {
  // Ensure the global variable is initialized
  if (typeof window.terrariumFlowerUpgrade5Level !== 'number') {
    window.terrariumFlowerUpgrade5Level = 0;
  }
  
  const card = document.querySelector('.terrarium-upgrade-card[data-upgrade="flower5"]');
  if (!card) return;
  const cost = getFlowerUpgrade5Cost(window.terrariumFlowerUpgrade5Level);
  const flowersDecimal = typeof terrariumFlowers !== 'undefined' ? (terrariumFlowers instanceof Decimal ? terrariumFlowers : new Decimal(terrariumFlowers)) : new Decimal(0);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  const canAfford = flowersDecimal.gte(costDecimal);
  const costSpan = card.querySelector('div[style*="position:absolute"] span');
  if (costSpan) {
    costSpan.textContent = formatNumberSci(cost);
    costSpan.style.color = canAfford ? '#0f0' : '#f33';
  }
  const levelDiv = card.querySelector('.terrarium-upgrade-level');
  if (levelDiv) {
    levelDiv.textContent = window.terrariumFlowerUpgrade5Level >= FLOWER_UPGRADE_5_CAP ? 'maxed' : window.terrariumFlowerUpgrade5Level;
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

// Flower Upgrade 5 Modal Event Listeners
(function() {
  function showFlowerUpgrade5Modal() {
    updateFlowerUpgrade5Modal();
    const modal = document.getElementById('flowerUpgrade5Modal');
    if (modal) modal.style.display = 'flex';
  }

  function hideFlowerUpgrade5Modal() {
    const modal = document.getElementById('flowerUpgrade5Modal');
    if (modal) modal.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.getElementById('flowerUpgrade5CancelBtn');
    if (cancelBtn) cancelBtn.onclick = hideFlowerUpgrade5Modal;
    
    const buyOneBtn = document.getElementById('flowerUpgrade5BuyOneBtn');
    if (buyOneBtn) buyOneBtn.onclick = function() {
      if (canBuyFlowerUpgrade5()) {
        buyFlowerUpgrade5(1);
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    
    const buyMaxBtn = document.getElementById('flowerUpgrade5BuyMaxBtn');
    if (buyMaxBtn) buyMaxBtn.onclick = function() {
      if (canBuyFlowerUpgrade5()) {
        buyMaxFlowerUpgrade5();
      } else {
        if (typeof window.trackMaxedOutUpgradeAttempt === 'function') {
          window.trackMaxedOutUpgradeAttempt();
        }
      }
    };
    
    const modal = document.getElementById('flowerUpgrade5Modal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) hideFlowerUpgrade5Modal();
      });
    }
  });
})();

function addTerrariumXP(amount) {
  const flowerEffect = getFlowerXPUpgradeEffect(flowerXPUpgradeLevel);
  const xpMultiplierEffect = getXpMultiplierUpgradeEffect(xpMultiplierUpgradeLevel);
  const nectarXpEffect = getNectarXpUpgradeEffect(nectarXpUpgradeLevel);
  let total = Math.floor(amount * flowerEffect * xpMultiplierEffect * nectarXpEffect);
  // Apply Element 23 boost (X3 terrarium XP multiplier)
  const elementsRef5 = (typeof boughtElements !== 'undefined') ? boughtElements : window.boughtElements;
  if (elementsRef5 && elementsRef5[23]) {
    total = Math.floor(total * 3);
  }
  let finalTotal = total;
  if (typeof window.applyChargerTerrariumXpBoost === 'function') {
    const xpBoost = window.applyChargerTerrariumXpBoost(total);
    
    finalTotal += xpBoost;
  }
  
  // Apply 2∞ benefit boost to terrarium XP (3x per total infinity if 2+ total infinity)
  if (typeof window.applyTwoInfinityBenefitBoost === 'function') {
    finalTotal = window.applyTwoInfinityBenefitBoost(finalTotal);
  }
  
  // Ensure terrariumXP is a Decimal
  if (!DecimalUtils.isDecimal(terrariumXP)) {
    terrariumXP = new Decimal(terrariumXP || 0);
  }
  terrariumXP = terrariumXP.add(finalTotal);
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
  // Use DecimalUtils with current notation preference
  return DecimalUtils.formatDecimal(num);
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
      fluzzerImg.src = getFluzzerImagePath('sleeping');
    } else {
      fluzzerImg.src = getFluzzerImagePath('normal');
    }
  }
  if (nectarizeFluzzerImg) {
    if (window.isFluzzerSleeping) {
      nectarizeFluzzerImg.src = getFluzzerImagePath('sleeping');
    } else {
      nectarizeFluzzerImg.src = getFluzzerImagePath('normal');
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
  // Check if timeout is active
  if (fluzzerTimeoutActive) {
    const remainingTime = Math.max(0, fluzzerTimeoutEndTime - Date.now());
    if (remainingTime > 0) {
      const totalSeconds = Math.ceil(remainingTime / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        bubble.textContent = `I need a break! Come back in ${timeString}...`;
        bubble.style.display = 'block';
      }
      if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
      window.fluzzerSpeechTimeout = setTimeout(() => {
        if (bubble) bubble.style.display = 'none';
      }, 3000);
      return;
    } else {
      // Timeout has expired
      fluzzerTimeoutActive = false;
      fluzzerTimeoutEndTime = null;
      fluzzerClickTimestamps = [];
      // Update window variables
      window.fluzzerTimeoutActive = false;
      window.fluzzerTimeoutEndTime = null;
      window.fluzzerClickTimestamps = [];
      
      // Save the updated state
      if (typeof saveGame === 'function') {
        saveGame();
      }
    }
  }

  // Track click timestamps for timeout detection
  const now = Date.now();
  fluzzerClickTimestamps.push(now);
  
  // Remove timestamps older than 60 seconds (we check for 30 clicks in quick succession)
  fluzzerClickTimestamps = fluzzerClickTimestamps.filter(timestamp => 
    now - timestamp < 60000
  );
  
  // Update window variable
  window.fluzzerClickTimestamps = fluzzerClickTimestamps;
  
  // Check if player has clicked too many times too quickly
  if (fluzzerClickTimestamps.length >= 30) {
    fluzzerTimeoutActive = true;
    fluzzerTimeoutEndTime = now + (7 * 60 * 1000) + (27 * 1000); // 7 minutes and 27 seconds from now
    fluzzerClickTimestamps = []; // Reset the counter
    
    // Update window variables
    window.fluzzerTimeoutActive = true;
    window.fluzzerTimeoutEndTime = fluzzerTimeoutEndTime;
    window.fluzzerClickTimestamps = [];
    
    // Save the timeout state
    if (typeof saveGame === 'function') {
      saveGame();
    }
    
    // Deactivate any active tools when timeout begins
    if (pollenWandActive || wateringCanActive) {
      pollenWandActive = false;
      wateringCanActive = false;
      document.body.classList.remove('pollen-wand-mode', 'watering-can-mode');
      
      const pollenBtn = document.getElementById('pollenCollectorBtn');
      const wateringBtn = document.getElementById('wateringCanBtn');
      if (pollenBtn) pollenBtn.classList.remove('active');
      if (wateringBtn) wateringBtn.classList.remove('active');
      
      // Re-render UI to update button states
      if (typeof renderTerrariumUI === 'function') {
        renderTerrariumUI();
      }
    }
    
    // Start timer display and update interval
    updateToolButtonTimers();
    if (window.fluzzerTimerInterval) clearInterval(window.fluzzerTimerInterval);
    window.fluzzerTimerInterval = setInterval(() => {
      updateToolButtonTimers();
      if (!isFluzzerInTimeout()) {
        clearInterval(window.fluzzerTimerInterval);
        window.fluzzerTimerInterval = null;
      }
    }, 1000);
    
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
      bubble.textContent = "Whoa! That's too much poking! I need a 7-minute break!";
      bubble.style.display = 'block';
    }
    if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
    window.fluzzerSpeechTimeout = setTimeout(() => {
      if (bubble) bubble.style.display = 'none';
    }, 4000);
    return;
  }

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
    if (fluzzerImg) fluzzerImg.src = getFluzzerImagePath('sleep_talking');
    if (window.fluzzerSpeechTimeout) clearTimeout(window.fluzzerSpeechTimeout);
    window.fluzzerSpeechTimeout = setTimeout(() => {
      if (bubble) bubble.style.display = 'none';
      if (fluzzerImg) fluzzerImg.src = getFluzzerImagePath('sleeping');
    }, 3000);
    return;
  }
  origHandleFluzzerClick.apply(this, arguments);
};

let rustlingFlowerIndices = [];
let rustlingFlowerTimer = null;
window.rustlingFlowerTimer = rustlingFlowerTimer;

function startRustlingFlowerTimer() {
  if (rustlingFlowerTimer) {
    clearInterval(rustlingFlowerTimer);
  }
  rustlingFlowerTimer = setInterval(() => {
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
  window.rustlingFlowerTimer = rustlingFlowerTimer;
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
    // Check cooldown before doing anything
    if (window.pollenWandCooldown) return;
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
    const areaSize = getWateringCanAreaSize();
    for (let rowOffset = -areaSize; rowOffset <= areaSize; rowOffset++) {
      for (let colOffset = -areaSize; colOffset <= areaSize; colOffset++) {
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
  if (terrariumFlowers.gte(new Decimal("1e15"))) {
    flowerOoM = Math.floor(terrariumFlowers.div(new Decimal("1e15")).log10()) + 1;
    flowerMultiplier = new Decimal(1.1).pow(flowerOoM).toNumber();
    flowerOoMText = `${flowerOoM} (${formatNumberSci(new Decimal(10).pow(flowerOoM - 1).mul(new Decimal("1e15")))}+ flowers)`;
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
  
  // Apply orange stable light buff to nectar gain
  if (typeof window.applyOrangeStableLightBuff === 'function') {
    baseGain = window.applyOrangeStableLightBuff(new Decimal(baseGain)).floor().toNumber();
  }
  
  return Math.max(1, baseGain); 
}

function calculateNectarGain() {
  let baseNectar = 0;
  const milestoneBonus = getNectarizeMilestoneBonus();
  const pollenBonusMultiplier = (milestoneBonus && typeof milestoneBonus.pollen === 'number' && !isNaN(milestoneBonus.pollen)) ? milestoneBonus.pollen : 1;
  const flowerBonusMultiplier = (milestoneBonus && typeof milestoneBonus.flowers === 'number' && !isNaN(milestoneBonus.flowers)) ? milestoneBonus.flowers : 1;
  let pollenOoM = 0;
  if (terrariumPollen.gte(new Decimal("1e20"))) {
    pollenOoM = Math.floor(terrariumPollen.div(new Decimal("1e20")).log10()) + 1;
    pollenOoM = (pollenOoM * (pollenOoM + 1)) / 2;
  }
  const pollenNectar = pollenOoM * pollenBonusMultiplier;
  baseNectar += pollenNectar;
  let flowerMultiplier = 1;
  if (terrariumFlowers.gte(new Decimal("1e15"))) {
    const flowerOoM = Math.floor(terrariumFlowers.div(new Decimal("1e15")).log10()) + 1;
    flowerMultiplier = new Decimal(1.1).pow(flowerOoM).toNumber();
  }
  baseNectar = baseNectar * flowerMultiplier;
  if (terrariumLevel >= 30) {
    const levelBonus = terrariumLevel - 30;
    const multiplier = new Decimal(1.5).pow(levelBonus);
    baseNectar = new Decimal(baseNectar).mul(multiplier).floor().toNumber();
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
  if (new Decimal(nectarGained).lt(10)) {
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
  terrariumPollen = new Decimal(0);
  terrariumFlowers = new Decimal(0);
  terrariumXP = new Decimal(0);
  terrariumLevel = 1;
  pollenValueUpgradeLevel = 0;
  pollenValueUpgrade2Level = 0;
  flowerValueUpgradeLevel = 0;
  pollenToolSpeedUpgradeLevel = 0;
  flowerXPUpgradeLevel = 0;
  extraChargeUpgradeLevel = 0;
  xpMultiplierUpgradeLevel = 0;
  
  // Reset flower upgrades 4 and 5
  window.terrariumFlowerUpgrade4Level = 0;
  window.terrariumFlowerUpgrade5Level = 0; 
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
  let finalNectarGained = new Decimal(nectarGained);
  if (typeof window.boughtElements !== 'undefined' && window.boughtElements[24]) {
    finalNectarGained = finalNectarGained.mul(2).floor();
  }
  
  // Apply total infinity boost
  if (typeof window.applyTotalInfinityReachedBoost === 'function') {
    finalNectarGained = window.applyTotalInfinityReachedBoost(finalNectarGained);
  }
  
  terrariumNectar = terrariumNectar.add(finalNectarGained);
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
        characterImg.src = getFluzzerImagePath('sleeping');
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
    characterImg.src = getFluzzerImagePath('talking');
  }
  speechBubble.textContent = message;
  speechBubble.classList.add('show');
  setTimeout(() => {
    speechBubble.classList.remove('show');
    if (characterImg) {
      if (window.isFluzzerSleeping) {
        characterImg.src = getFluzzerImagePath('sleeping');
      } else {
      characterImg.src = getFluzzerImagePath('normal');
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
    // Accept both singular and plural forms for petal and glittering petal tokens
    const normalizedTokenType = (tokenType || '').toLowerCase().replace(/\s/g, '');
    const isPetal = [
      'petal', 'petals'
    ].includes(normalizedTokenType);
    const isGlitteringPetal = [
      'glitteringpetal', 'glitteringpetals'
    ].includes(normalizedTokenType);
    let matchesResetType = false;
    if (nectarizePostResetTokenType === 'petals' && isPetal) matchesResetType = true;
    if (nectarizePostResetTokenType === 'glitteringPetals' && isGlitteringPetal) matchesResetType = true;
    if (matchesResetType && nectarizePostResetTokensGiven < nectarizePostResetTokenRequirement) {
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
    case 'battery':
      nectarizeQuestGivenBattery += amount;
      window.nectarizeQuestGivenBattery = nectarizeQuestGivenBattery;
      break;
    case 'sparks':
    case 'spark':
      nectarizeQuestGivenSparks += amount;
      window.nectarizeQuestGivenSparks = nectarizeQuestGivenSparks;
      break;
    case 'petals':
    case 'petal':
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
  
  try {
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
      case 'pollen5':
        // For field expansion, buy max available
        if (canBuyFlowerFieldExpansionUpgrade()) {
          buyMaxFlowerFieldExpansionUpgrade();
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
      case 'nectar5':
        if (canBuyNectarInfinityUpgrade()) {
          buyMaxNectarInfinityUpgrade();
        }
        break;
    }
  } catch (error) {
    console.warn('Error in right-click handler for', upgradeType, ':', error);
  }
}

let kpNectarUpgradeLevel = 0;
const KP_NECTAR_UPGRADE_CAP = 1000;
const KP_NECTAR_UPGRADE_BASE_COST = 10;
const KP_NECTAR_UPGRADE_COST_MULT = 1.75;
kpNectarUpgradeLevel = (typeof window.terrariumKpNectarUpgradeLevel === 'number') ? window.terrariumKpNectarUpgradeLevel : 0;

function getKpNectarUpgradeCost(level) {
  return new Decimal(KP_NECTAR_UPGRADE_BASE_COST).mul(new Decimal(KP_NECTAR_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getKpNectarUpgradeEffect(level) {
  return Math.pow(1.1, level);
}

window.getKpNectarUpgradeEffect = getKpNectarUpgradeEffect;

function canBuyKpNectarUpgrade() {
  const cost = getKpNectarUpgradeCost(kpNectarUpgradeLevel);
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  return kpNectarUpgradeLevel < KP_NECTAR_UPGRADE_CAP && nectarDecimal.gte(costDecimal);
}

function buyKpNectarUpgrade(count = 1) {
  if (kpNectarUpgradeLevel >= KP_NECTAR_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyKpNectarUpgrade()) break;
    const cost = getKpNectarUpgradeCost(kpNectarUpgradeLevel);
    const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    terrariumNectar = nectarDecimal.sub(costDecimal);
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
  let totalCost = new Decimal(0);
  const targetLevel = Math.min(KP_NECTAR_UPGRADE_CAP, kpNectarUpgradeLevel + 25);
  for (let i = kpNectarUpgradeLevel; i < targetLevel; i++) {
    const cost = getKpNectarUpgradeCost(i);
    totalCost = totalCost.add(cost);
  }
  return totalCost;
}

let pollenFlowerNectarUpgradeLevel = 0;
const POLLEN_FLOWER_NECTAR_UPGRADE_CAP = 1000;
const POLLEN_FLOWER_NECTAR_UPGRADE_BASE_COST = 10;
const POLLEN_FLOWER_NECTAR_UPGRADE_COST_MULT = 1.5;
pollenFlowerNectarUpgradeLevel = (typeof window.terrariumPollenFlowerNectarUpgradeLevel === 'number') ? window.terrariumPollenFlowerNectarUpgradeLevel : 0;

function getPollenFlowerNectarUpgradeCost(level) {
  return new Decimal(POLLEN_FLOWER_NECTAR_UPGRADE_BASE_COST).mul(new Decimal(POLLEN_FLOWER_NECTAR_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getPollenFlowerNectarUpgradeEffect(level) {
  let base = 0.5 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function canBuyPollenFlowerNectarUpgrade() {
  const cost = getPollenFlowerNectarUpgradeCost(pollenFlowerNectarUpgradeLevel);
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  return pollenFlowerNectarUpgradeLevel < POLLEN_FLOWER_NECTAR_UPGRADE_CAP && nectarDecimal.gte(costDecimal);
}

function buyPollenFlowerNectarUpgrade(count = 1) {
  if (pollenFlowerNectarUpgradeLevel >= POLLEN_FLOWER_NECTAR_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyPollenFlowerNectarUpgrade()) break;
    const cost = getPollenFlowerNectarUpgradeCost(pollenFlowerNectarUpgradeLevel);
    const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    terrariumNectar = nectarDecimal.sub(costDecimal);
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
  let totalCost = new Decimal(0);
  const targetLevel = Math.min(POLLEN_FLOWER_NECTAR_UPGRADE_CAP, pollenFlowerNectarUpgradeLevel + 25);
  for (let i = pollenFlowerNectarUpgradeLevel; i < targetLevel; i++) {
    const cost = getPollenFlowerNectarUpgradeCost(i);
    totalCost = totalCost.add(cost);
  }
  return totalCost;
}

let nectarXpUpgradeLevel = 0;
const NECTAR_XP_UPGRADE_CAP = 1000;
const NECTAR_XP_UPGRADE_BASE_COST = 1e10;
const NECTAR_XP_UPGRADE_COST_MULT = 1.3;
nectarXpUpgradeLevel = (typeof window.terrariumNectarXpUpgradeLevel === 'number') ? window.terrariumNectarXpUpgradeLevel : 0;

function getNectarXpUpgradeCost(level) {
  return new Decimal(NECTAR_XP_UPGRADE_BASE_COST).mul(new Decimal(NECTAR_XP_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getNectarXpUpgradeEffect(level) {
  let base = 0.25 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function canBuyNectarXpUpgrade() {
  const cost = getNectarXpUpgradeCost(nectarXpUpgradeLevel);
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  return nectarXpUpgradeLevel < NECTAR_XP_UPGRADE_CAP && nectarDecimal.gte(costDecimal);
}

function buyNectarXpUpgrade(count = 1) {
  if (nectarXpUpgradeLevel >= NECTAR_XP_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyNectarXpUpgrade()) break;
    const cost = getNectarXpUpgradeCost(nectarXpUpgradeLevel);
    const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    terrariumNectar = nectarDecimal.sub(costDecimal);
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
  let totalCost = new Decimal(0);
  const targetLevel = Math.min(NECTAR_XP_UPGRADE_CAP, nectarXpUpgradeLevel + 25);
  for (let i = nectarXpUpgradeLevel; i < targetLevel; i++) {
    const cost = getNectarXpUpgradeCost(i);
    totalCost = totalCost.add(cost);
  }
  return totalCost;
}

let nectarValueUpgradeLevel = 0;
const NECTAR_VALUE_UPGRADE_CAP = 1000;
const NECTAR_VALUE_UPGRADE_BASE_COST = 1e15;
const NECTAR_VALUE_UPGRADE_COST_MULT = 1.3;
nectarValueUpgradeLevel = (typeof window.terrariumNectarValueUpgradeLevel === 'number') ? window.terrariumNectarValueUpgradeLevel : 0;

function getNectarValueUpgradeCost(level) {
  return new Decimal(NECTAR_VALUE_UPGRADE_BASE_COST).mul(new Decimal(NECTAR_VALUE_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getNectarValueUpgradeEffect(level) {
  let base = 0.25 * level;
  const doubleCount = Math.floor((level - 1) / 25);
  base *= Math.pow(2, doubleCount);
  return 1 + base; 
}

function canBuyNectarValueUpgrade() {
  const cost = getNectarValueUpgradeCost(nectarValueUpgradeLevel);
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  return nectarValueUpgradeLevel < NECTAR_VALUE_UPGRADE_CAP && nectarDecimal.gte(costDecimal);
}

function buyNectarValueUpgrade(count = 1) {
  if (nectarValueUpgradeLevel >= NECTAR_VALUE_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyNectarValueUpgrade()) break;
    const cost = getNectarValueUpgradeCost(nectarValueUpgradeLevel);
    const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    terrariumNectar = nectarDecimal.sub(costDecimal);
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
  let totalCost = new Decimal(0);
  const targetLevel = Math.min(NECTAR_VALUE_UPGRADE_CAP, nectarValueUpgradeLevel + 25);
  for (let i = nectarValueUpgradeLevel; i < targetLevel; i++) {
    const cost = getNectarValueUpgradeCost(i);
    totalCost = totalCost.add(cost);
  }
  return totalCost;
}

// Nectar Upgrade 5: Nectar Infinity Points
let nectarInfinityUpgradeLevel = 0;
const NECTAR_INFINITY_UPGRADE_CAP = 1000;
const NECTAR_INFINITY_UPGRADE_BASE_COST = 1e30;
const NECTAR_INFINITY_UPGRADE_COST_MULT = 1.5;
nectarInfinityUpgradeLevel = (typeof window.terrariumNectarInfinityUpgradeLevel === 'number') ? window.terrariumNectarInfinityUpgradeLevel : 0;

function getNectarInfinityUpgradeCost(level) {
  return new Decimal(NECTAR_INFINITY_UPGRADE_BASE_COST).mul(new Decimal(NECTAR_INFINITY_UPGRADE_COST_MULT).pow(level)).ceil();
}

function getNectarInfinityUpgradeEffect(level) {
  return new Decimal(1.1).pow(level);
}

function canBuyNectarInfinityUpgrade() {
  const cost = getNectarInfinityUpgradeCost(nectarInfinityUpgradeLevel);
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
  return nectarInfinityUpgradeLevel < NECTAR_INFINITY_UPGRADE_CAP && nectarDecimal.gte(costDecimal);
}

function buyNectarInfinityUpgrade(count = 1) {
  if (nectarInfinityUpgradeLevel >= NECTAR_INFINITY_UPGRADE_CAP && typeof window.trackMaxedOutUpgradeAttempt === 'function') {
    window.trackMaxedOutUpgradeAttempt();
  }
  for (let i = 0; i < count; i++) {
    if (!canBuyNectarInfinityUpgrade()) break;
    const cost = getNectarInfinityUpgradeCost(nectarInfinityUpgradeLevel);
    const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
    const costDecimal = cost instanceof Decimal ? cost : new Decimal(cost);
    terrariumNectar = nectarDecimal.sub(costDecimal);
    nectarInfinityUpgradeLevel++;
    window.terrariumNectar = terrariumNectar;
    window.terrariumNectarInfinityUpgradeLevel = nectarInfinityUpgradeLevel;
  }
  updateNectarUpgradeSection();
  updateTerrariumUpgradeCurrencyCounts();
  updateNectarInfinityUpgradeModal();
}

function buyMaxNectarInfinityUpgrade() {
  let count = 0;
  while (canBuyNectarInfinityUpgrade()) {
    buyNectarInfinityUpgrade(1);
    count++;
  }
}

function buyNext25NectarInfinityUpgrade() {
  const currentLevel = nectarInfinityUpgradeLevel;
  const nextTarget = Math.ceil((currentLevel + 1) / 25) * 25; 
  const targetLevel = Math.min(NECTAR_INFINITY_UPGRADE_CAP, nextTarget);
  while (nectarInfinityUpgradeLevel < targetLevel && canBuyNectarInfinityUpgrade()) {
    buyNectarInfinityUpgrade(1);
  }
}

function getNectarInfinityUpgradeCostToNext25() {
  let totalCost = new Decimal(0);
  const targetLevel = Math.min(NECTAR_INFINITY_UPGRADE_CAP, nectarInfinityUpgradeLevel + 25);
  for (let i = nectarInfinityUpgradeLevel; i < targetLevel; i++) {
    const cost = getNectarInfinityUpgradeCost(i);
    totalCost = totalCost.add(cost);
  }
  return totalCost;
}

// Make functions globally accessible
window.getNectarInfinityUpgradeEffect = getNectarInfinityUpgradeEffect;
window.canBuyNectarInfinityUpgrade = canBuyNectarInfinityUpgrade;
window.buyNectarInfinityUpgrade = buyNectarInfinityUpgrade;
window.buyMaxNectarInfinityUpgrade = buyMaxNectarInfinityUpgrade;
window.buyNext25NectarInfinityUpgrade = buyNext25NectarInfinityUpgrade;

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
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costToNext25Decimal = costToNext25 instanceof Decimal ? costToNext25 : new Decimal(costToNext25);
  let canAfford25 = nectarDecimal.gte(costToNext25Decimal);
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
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${formatNumberSci(currentEffect)}</span>`;
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
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costToNext25Decimal = costToNext25 instanceof Decimal ? costToNext25 : new Decimal(costToNext25);
  let canAfford25 = nectarDecimal.gte(costToNext25Decimal);
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
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${formatNumberSci(currentEffect)}</span>`;
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
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costToNext25Decimal = costToNext25 instanceof Decimal ? costToNext25 : new Decimal(costToNext25);
  let canAfford25 = nectarDecimal.gte(costToNext25Decimal);
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
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${formatNumberSci(currentEffect)}</span>`;
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
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costToNext25Decimal = costToNext25 instanceof Decimal ? costToNext25 : new Decimal(costToNext25);
  let canAfford25 = nectarDecimal.gte(costToNext25Decimal);
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
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${formatNumberSci(currentEffect)}</span>`;
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

function updateNectarInfinityUpgradeModal() {
  nectarInfinityUpgradeLevel = (typeof window.terrariumNectarInfinityUpgradeLevel === 'number') ? window.terrariumNectarInfinityUpgradeLevel : 0;
  terrariumNectar = window.terrariumNectar || 0;
  const modal = document.getElementById('nectarInfinityUpgradeModal');
  if (!modal) {
    return;
  }
  const currentCost = getNectarInfinityUpgradeCost(nectarInfinityUpgradeLevel);
  const currentEffect = getNectarInfinityUpgradeEffect(nectarInfinityUpgradeLevel);
  const costToNext25 = getNectarInfinityUpgradeCostToNext25();
  const levelText = document.getElementById('nectarInfinityUpgradeLevel');
  const costText = document.getElementById('nectarInfinityUpgradeCostValue');
  const costNext25Text = document.getElementById('nectarInfinityUpgradeCostNext25Value');
  const effectText = document.getElementById('nectarInfinityUpgradeEffect');
  if (levelText) levelText.textContent = `Level ${nectarInfinityUpgradeLevel} / ${NECTAR_INFINITY_UPGRADE_CAP}`;
  if (costText) {
    costText.textContent = formatNumberSci(currentCost);
    costText.style.color = canBuyNectarInfinityUpgrade() ? '#0f0' : '#f33';
  }
  const costLabel = document.getElementById('nectarInfinityUpgradeCost');
  if (costLabel) costLabel.style.color = canBuyNectarInfinityUpgrade() ? '#0f0' : '#f33';
  const nectarDecimal = terrariumNectar instanceof Decimal ? terrariumNectar : new Decimal(terrariumNectar);
  const costToNext25Decimal = costToNext25 instanceof Decimal ? costToNext25 : new Decimal(costToNext25);
  let canAfford25 = nectarDecimal.gte(costToNext25Decimal);
  let next25Div = document.getElementById('nectarInfinityUpgradeCostNext25');
  if (!next25Div) {
    next25Div = document.createElement('div');
    next25Div.id = 'nectarInfinityUpgradeCostNext25';
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
  if (effectText) effectText.innerHTML = `Effect: <span style="color:#0ff;">x${formatNumberSci(currentEffect)} infinity point gain</span>`;
  const buyOneBtn = document.getElementById('nectarInfinityUpgradeBuyOneBtn');
  const buyNext25Btn = document.getElementById('nectarInfinityUpgradeBuyNext25Btn');
  const buyMaxBtn = document.getElementById('nectarInfinityUpgradeBuyMaxBtn');
  const cancelBtn = document.getElementById('nectarInfinityUpgradeCancelBtn');
  if (buyOneBtn) {
    buyOneBtn.disabled = !canBuyNectarInfinityUpgrade();
    buyOneBtn.onclick = function() {
      if (canBuyNectarInfinityUpgrade()) {
        buyNectarInfinityUpgrade(1);
      }
    };
  }
  if (buyNext25Btn) {
    buyNext25Btn.disabled = !canBuyNectarInfinityUpgrade();
    buyNext25Btn.onclick = function() {
      buyNext25NectarInfinityUpgrade();
    };
  }
  if (buyMaxBtn) {
    buyMaxBtn.disabled = !canBuyNectarInfinityUpgrade();
    buyMaxBtn.onclick = function() {
      buyMaxNectarInfinityUpgrade();
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
    flower5: false,
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
      if (nectarizeTier >= 6) {
        nextUnlockElement.textContent = 'All upgrades unlocked';
      } else if (nectarizeTier >= 4) {
        nextUnlockElement.textContent = 'Next upgrade unlocks at nectarize tier 6';
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
    const nectarInfinityCard = document.getElementById('nectar-upgrade-5');
    if (nectarInfinityCard) {
      if (nectarizeTier >= 6) {
        nectarInfinityCard.style.display = 'block';
        const levelElement = nectarInfinityCard.querySelector('.terrarium-upgrade-level');
        const costElement = nectarInfinityCard.querySelector('span');
        if (levelElement) {
          levelElement.textContent = nectarInfinityUpgradeLevel >= NECTAR_INFINITY_UPGRADE_CAP ? 'maxed' : nectarInfinityUpgradeLevel;
        }
        if (costElement) {
          const cost = getNectarInfinityUpgradeCost(nectarInfinityUpgradeLevel);
          costElement.textContent = formatNumberSci(cost);
          costElement.style.color = canBuyNectarInfinityUpgrade() ? '#0f0' : '#f33';
        }
      } else {
        nectarInfinityCard.style.display = 'none';
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

// Initialize nectarize button visibility on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (typeof window.updateNectarizeButtonVisibility === 'function') {
      window.updateNectarizeButtonVisibility();
    }
  }, 1000); // Small delay to ensure all systems are loaded
});

function awardFluzzerFriendshipForPollenWandClick() {
  if (!window.friendship || typeof window.friendship.addPoints !== 'function') {
    return;
  }

  const currentFriendship = window.friendship.getFriendshipLevel('fluzzer');
  if (!currentFriendship || !DecimalUtils.isDecimal(currentFriendship.points)) {
    return;
  }

  const friendshipIncrease = currentFriendship.points.mul(0.001);
  const minIncrease = new Decimal(0.1);
  const finalIncrease = Decimal.max(friendshipIncrease, minIncrease);

  window.friendship.addPoints('fluzzer', finalIncrease);
}

window.awardFluzzerFriendshipForPollenWandClick = awardFluzzerFriendshipForPollenWandClick;
window.getTerriariumToolCooldown = getTerriariumToolCooldown; 