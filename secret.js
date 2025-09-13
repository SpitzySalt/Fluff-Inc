// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file







































let prismLabClickCount = 0;
let isInPrismLab = false;
let powerMinigameConsecutiveFailures = 0;
let collectPlateNoPlateClicks = 0;
const secretAchievements = {
  secret1: {
    id: 'secret1',
    name: 'The first one is always free',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 1,
    position: 1,
    rewarded: false,
    realDescription: 'Click this achievement'
  },
  secret2: {
    id: 'secret2',
    name: 'Watch for the corners',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 1,
    position: 2,
    rewarded: false,
    realDescription: 'Change the style to square'
  },
  secret3: {
    id: 'secret3',
    name: 'Just in case',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 1,
    position: 3,
    rewarded: false,
    realDescription: 'Export a code immediatly after exporting a code'
  },
  secret4: {
    id: 'secret4',
    name: 'Be a nuissance',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 1,
    position: 4,
    rewarded: false,
    realDescription: 'Make Soap mad'
  },
  secret5: {
    id: 'secret5',
    name: 'Only for the luckiest of the lucky',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 1,
    position: 5,
    rewarded: false,
    realDescription: 'Get the 1% chance of the nectarize machine to require a glittering petal'
  },
  secret6: {
    id: 'secret6',
    name: 'Seeing the light',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 2,
    position: 1,
    rewarded: false,
    realDescription: 'Click 1000 tiles in the prism lab without leaving the lab'
  },
  secret7: {
    id: 'secret7',
    name: 'The struggle',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 2,
    position: 2,
    rewarded: false,
    realDescription: 'Fail the power recharge minigame 20 times in a row'
  },
  secret8: {
    id: 'secret8',
    name: 'Impatient',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 2,
    position: 3,
    rewarded: false,
    realDescription: 'Click the collect plate button 10 times when there is no plate available'
  },
  secret9: {
    id: 'secret9',
    name: 'Remarkable gift',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 2,
    position: 4,
    rewarded: false,
    realDescription: 'Give 0 tokens to any character'
  },
  secret10: {
    id: 'secret10',
    name: 'Overflowing power',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 2,
    position: 5,
    rewarded: false,
    realDescription: 'Attempt to buy an already maxed out upgrade'
  },
  secret11: {
    id: 'secret11',
    name: 'Sleeping is for the weak',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 3,
    position: 1,
    rewarded: false,
    realDescription: 'Make fluzzer not sleep for the entire night'
  },
  secret12: {
    id: 'secret12',
    name: 'That will not help you',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 3,
    position: 2,
    rewarded: false,
    realDescription: 'manually buy an uncommon box when your fluff is over 1e250'
  },
  secret13: {
    id: 'secret13',
    name: 'overconsumption',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 3,
    position: 3,
    rewarded: false,
    realDescription: 'make soap eat a total of 1e25 charge'
  },
  secret14: {
    id: 'secret14',
    name: "That's a button?",
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 3,
    position: 4,
    rewarded: false,
    realDescription: 'Click the expansion icon'
  },
  secret16: {
    id: 'secret16',
    name: 'Omega Scammed',
    description: '???',
    icon: 'assets/icons/Lepre speech.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 3,
    position: 5,
    rewarded: false,
    realDescription: 'Buy any item from the boutique while Lepre is very mad'
  },
  secret17: {
    id: 'secret17',
    name: 'Just keep waiting',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 4,
    position: 1,
    rewarded: false,
    realDescription: 'Obtain the 1/10000000 chance on a game tick'
  },
  secret18: {
    id: 'secret18',
    name: 'Kicked out',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 4,
    position: 2,
    rewarded: false,
    realDescription: 'Touch lepre\'s chest zipper'
  },
  secret15: {
    id: 'secret15',
    name: 'The last one is always the hardest',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 4,
    position: 3,
    rewarded: false,
    realDescription: 'Complete the impossible quest'
  },
};

function updateSecretAchievementDescription(achievementId) {
  const achievement = secretAchievements[achievementId];
  if (achievement && achievement.unlocked) {
    achievement.description = achievement.realDescription;
  }
}

function unlockSecretAchievement(achievementId) {
  const achievement = secretAchievements[achievementId];
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.progress = achievement.requirement;
    updateSecretAchievementDescription(achievementId);
    if (typeof window.showAchievementNotification === 'function') {
      window.showAchievementNotification(achievement);
    }
    if (typeof window.saveAchievements === 'function') {
      window.saveAchievements();
    }
    if (typeof window.updateAchievementsDisplay === 'function') {
      window.updateAchievementsDisplay();
    }
  }
}

function handleSecretAchievementClick(achievementId) {
  const achievement = secretAchievements[achievementId];
  if (achievement && !achievement.unlocked) {
    if (achievementId === 'secret1') {
      unlockSecretAchievement(achievementId);
    }
  }
}

function updateSecretAchievementProgress(achievementId, value) {
  const achievement = secretAchievements[achievementId];
  if (achievement && !achievement.unlocked) {
    achievement.progress = Decimal.max(achievement.progress || new Decimal(0), new Decimal(value));
    if (achievement.progress.gte(achievement.requirement || new Decimal(0))) {
      unlockSecretAchievement(achievementId);
    }
  }
}

function loadSecretAchievements() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  const saveKey = currentSaveSlot ? `fluffIncSecretAchievementsSlot${currentSaveSlot}` : 'fluffIncSecretAchievements';
  const saved = localStorage.getItem(saveKey);
  if (saved) {
    const savedData = JSON.parse(saved);
    Object.keys(savedData.achievements).forEach(id => {
      if (secretAchievements[id]) {
        secretAchievements[id].unlocked = savedData.achievements[id].unlocked;
        secretAchievements[id].progress = new Decimal(savedData.achievements[id].progress || 0);
        secretAchievements[id].rewarded = savedData.achievements[id].rewarded || false;
        if (secretAchievements[id].unlocked) {
          updateSecretAchievementDescription(id);
        }
      }
    });
  } else {
    Object.values(secretAchievements).forEach(achievement => {
      achievement.unlocked = false;
      achievement.progress = new Decimal(0);
      achievement.rewarded = false;
      achievement.description = '???';
    });
  }
}

function saveSecretAchievements() {
  const saveData = {
    achievements: {}
  };
  Object.keys(secretAchievements).forEach(id => {
    saveData.achievements[id] = {
      unlocked: secretAchievements[id].unlocked,
      progress: (secretAchievements[id].progress || new Decimal(0)).toString(),
      rewarded: secretAchievements[id].rewarded
    };
  });
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  const saveKey = currentSaveSlot ? `fluffIncSecretAchievementsSlot${currentSaveSlot}` : 'fluffIncSecretAchievements';
  localStorage.setItem(saveKey, JSON.stringify(saveData));
}

function initSecretAchievements() {
  // Initialize all secret achievements with proper Decimal values
  Object.values(secretAchievements).forEach(achievement => {
    if (typeof achievement.requirement === 'number') {
      achievement.requirement = new Decimal(achievement.requirement);
    }
    if (typeof achievement.progress === 'number') {
      achievement.progress = new Decimal(achievement.progress);
    }
    if (!achievement.progress) {
      achievement.progress = new Decimal(0);
    }
  });
  loadSecretAchievements();
}

function resetSecretAchievementsForNewSlot(slotNumber) {
  const freshSecretAchievements = {};
  Object.keys(secretAchievements).forEach(id => {
    freshSecretAchievements[id] = {
      unlocked: false,
      progress: 0,
      rewarded: false
    };
  });
  const saveData = {
    achievements: freshSecretAchievements
  };
  localStorage.setItem(`fluffIncSecretAchievementsSlot${slotNumber}`, JSON.stringify(saveData));
}

window.secretAchievements = secretAchievements;
window.unlockSecretAchievement = unlockSecretAchievement;
window.handleSecretAchievementClick = handleSecretAchievementClick;
window.updateSecretAchievementProgress = updateSecretAchievementProgress;
window.loadSecretAchievements = loadSecretAchievements;
window.saveSecretAchievements = saveSecretAchievements;
window.resetSecretAchievementsForNewSlot = resetSecretAchievementsForNewSlot;
window.initSecretAchievements = initSecretAchievements;
window.trackPrismLabClick = trackPrismLabClick;
window.enterPrismLab = enterPrismLab;
window.leavePrismLab = leavePrismLab;
window.trackPowerMinigameFailure = trackPowerMinigameFailure;
window.resetPowerMinigameFailures = resetPowerMinigameFailures;
window.trackCollectPlateNoPlateClick = trackCollectPlateNoPlateClick;
window.resetCollectPlateNoPlateClicks = resetCollectPlateNoPlateClicks;
window.trackMaxedOutUpgradeAttempt = trackMaxedOutUpgradeAttempt;
window.checkFluzzerNightOwlAchievement = checkFluzzerNightOwlAchievement;
window.initFluzzerNightOwlTracking = initFluzzerNightOwlTracking;
window.trackUncommonBoxPurchaseWithHighFluff = trackUncommonBoxPurchaseWithHighFluff;
window.trackSoapChargeConsumption = trackSoapChargeConsumption;
window.trackExpansionIconClick = trackExpansionIconClick;
window.trackHardModeQuestCompletion = trackHardModeQuestCompletion;

function trackPrismLabClick() {
  if (isInPrismLab) {
    prismLabClickCount++;
    if (prismLabClickCount >= 1000 && typeof window.updateSecretAchievementProgress === 'function') {
      window.updateSecretAchievementProgress('secret6', 1);
    }
  }
}

function enterPrismLab() {
  isInPrismLab = true;
  prismLabClickCount = 0; 
}

function leavePrismLab() {
  isInPrismLab = false;
  prismLabClickCount = 0; 
}

function trackPowerMinigameFailure() {
  powerMinigameConsecutiveFailures++;
  if (powerMinigameConsecutiveFailures >= 20 && typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret7', 1);
  }
}

function resetPowerMinigameFailures() {
  powerMinigameConsecutiveFailures = 0;
}

function trackCollectPlateNoPlateClick() {
  collectPlateNoPlateClicks++;
  if (collectPlateNoPlateClicks >= 10 && typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret8', 1);
  }
}

function resetCollectPlateNoPlateClicks() {
  collectPlateNoPlateClicks = 0;
}

function trackMaxedOutUpgradeAttempt() {
  if (typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret10', 1);
  }
}

function checkFluzzerNightOwlAchievement(gameMinutes) {
  if (gameMinutes === 360) {
    let hasActiveBoosts = false;
    if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
      hasActiveBoosts = true;
    }
    if (typeof window.isFluzzerBoostActive === 'function' && window.isFluzzerBoostActive()) {
      hasActiveBoosts = true;
    }
    if (hasActiveBoosts && typeof window.updateSecretAchievementProgress === 'function') {
      window.updateSecretAchievementProgress('secret11', 1);
    }
  }
}

function trackUncommonBoxPurchaseWithHighFluff() {
  if (typeof state !== 'undefined') {
    const hasHighFluff = state.fluff >= 1e250;
    const hasFluffInfinity = (state.fluffInfinityCount || 0) > 0;
    if (hasHighFluff || hasFluffInfinity) {
      if (typeof window.updateSecretAchievementProgress === 'function') {
        window.updateSecretAchievementProgress('secret12', 1);
      }
    }
  }
}

function trackSoapChargeConsumption() {
  if (window.state && window.state.soapTotalChargeEaten && window.state.soapTotalChargeEaten >= 1e25) {
    if (typeof window.updateSecretAchievementProgress === 'function') {
      window.updateSecretAchievementProgress('secret13', 1);
    }
  }
}

function trackExpansionIconClick() {
  if (typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret14', 1);
  }
}

function trackHardModeQuestCompletion() {
  if (typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret15', 1);
  }
}

function initFluzzerNightOwlTracking() {
  if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
    window.daynight.onTimeChange(checkFluzzerNightOwlAchievement);
  } else {
    setTimeout(initFluzzerNightOwlTracking, 1000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initSecretAchievements();
    initFluzzerNightOwlTracking();
  });
} else {
  initSecretAchievements();
  initFluzzerNightOwlTracking();
}
