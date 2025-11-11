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
    name: 'Tasty money',
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
    realDescription: 'Eat some swa bucks'
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
    name: 'This one is the hardest',
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
    realDescription: 'Complete KitoFox Challenge 2'
  },
  secret19: {
    id: 'secret19',
    name: 'Not so secret anymore',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 4,
    position: 4,
    rewarded: false,
    realDescription: 'redeem a code'
  },
  secret20: {
    id: 'secret20',
    name: 'There were many warnings...',
    description: '???',
    icon: 'assets/icons/light.png',
    type: 'secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'secret',
    row: 4,
    position: 5,
    rewarded: false,
    realDescription: 'Listen to the entire peachy dialogue'
  },
  halloween_secret1: {
    id: 'halloween_secret1',
    name: 'Rereshuffling',
    description: '???',
    icon: 'assets/icons/red swandy.png',
    type: 'halloween_secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'halloween_secret',
    row: 1,
    position: 1,
    rewarded: false,
    realDescription: 'Reshuffle the swandy crusher twice in a row'
  },
  halloween_secret2: {
    id: 'halloween_secret2',
    name: 'Return to sender',
    description: '???',
    icon: 'assets/icons/hex staff.png',
    type: 'halloween_secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'halloween_secret',
    row: 1,
    position: 2,
    rewarded: false,
    realDescription: 'Attempt to hex Jadeca (It did not work)'
  },
  halloween_secret3: {
    id: 'halloween_secret3',
    name: 'Why would you do that?',
    description: '???',
    icon: 'assets/icons/swandy orb.png',
    type: 'halloween_secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'halloween_secret',
    row: 1,
    position: 3,
    rewarded: false,
    realDescription: 'Break a swandy orb with the hex staff'
  },
  halloween_secret4: {
    id: 'halloween_secret4',
    name: 'Turning the grid purple',
    description: '???',
    icon: 'assets/icons/hex staff.png',
    type: 'halloween_secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'halloween_secret',
    row: 1,
    position: 4,
    rewarded: false,
    realDescription: 'Turn every tiles in the swandy crusher into hexed tiles'
  },
  halloween_secret5: {
    id: 'halloween_secret5',
    name: 'ORBED',
    description: '???',
    icon: 'assets/icons/swandy orb.png',
    type: 'halloween_secret',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'halloween_secret',
    row: 1,
    position: 5,
    rewarded: false,
    realDescription: 'Match 2 swandy orbs together'
  },
};

function updateSecretAchievementDescription(achievementId) {
  // Use the centralized state reference instead of local variable
  const achievement = window.secretAchievements[achievementId];
  if (achievement && achievement.unlocked) {
    achievement.description = achievement.realDescription;
  }
}

function unlockSecretAchievement(achievementId) {
  // Use the centralized state reference instead of local variable
  const achievement = window.secretAchievements[achievementId];
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.progress = achievement.requirement;
    updateSecretAchievementDescription(achievementId);
    
    // Handle rewards for specific achievements
    if (achievementId === 'secret19') {
      // Secret 19: Give 20 swa bucks for redeeming a code
      if (window.state && typeof window.state.swaria !== 'undefined') {
        if (!window.DecimalUtils.isDecimal(window.state.swaria)) {
          window.state.swaria = new Decimal(window.state.swaria || 0);
        }
        window.state.swaria = window.state.swaria.add(20);
        
        // Show notification for the reward
        if (typeof window.showNotification === 'function') {
          window.showNotification('Secret Achievement Reward: +20 Swa Bucks!', 'success');
        }
      }
    } else if (achievementId === 'secret20') {
      // Secret 20: Give 50 swa bucks for listening to entire peachy dialogue
      if (window.state && typeof window.state.swaria !== 'undefined') {
        if (!window.DecimalUtils.isDecimal(window.state.swaria)) {
          window.state.swaria = new Decimal(window.state.swaria || 0);
        }
        window.state.swaria = window.state.swaria.add(50);
        
        // Show notification for the reward
        if (typeof window.showNotification === 'function') {
          window.showNotification('Secret Achievement Reward: +50 Swa Bucks!', 'success');
        }
      }
    } else if (achievementId === 'halloween_secret2') {
      // Halloween Secret 2: Give 20 swa bucks for attempting to hex Jadeca
      if (window.state && typeof window.state.swaria !== 'undefined') {
        if (!window.DecimalUtils.isDecimal(window.state.swaria)) {
          window.state.swaria = new Decimal(window.state.swaria || 0);
        }
        window.state.swaria = window.state.swaria.add(20);
        
        // Show notification for the reward
        if (typeof window.showNotification === 'function') {
          window.showNotification('Secret Achievement Reward: +20 Swa Bucks!', 'success');
        }
      }
    } else if (achievementId === 'halloween_secret4') {
      // Halloween Secret 4: Give 100 swa bucks for turning every tile hexed
      if (window.state && typeof window.state.swaria !== 'undefined') {
        if (!window.DecimalUtils.isDecimal(window.state.swaria)) {
          window.state.swaria = new Decimal(window.state.swaria || 0);
        }
        window.state.swaria = window.state.swaria.add(100);
        
        // Show notification for the reward
        if (typeof window.showNotification === 'function') {
          window.showNotification('Secret Achievement Reward: +100 Swa Bucks!', 'success');
        }
      }
    } else if (achievementId === 'halloween_secret5') {
      // Halloween Secret 5: Give 100 swa bucks for matching 2 orbs together
      if (window.state && typeof window.state.swaria !== 'undefined') {
        if (!window.DecimalUtils.isDecimal(window.state.swaria)) {
          window.state.swaria = new Decimal(window.state.swaria || 0);
        }
        window.state.swaria = window.state.swaria.add(100);
        
        // Show notification for the reward
        if (typeof window.showNotification === 'function') {
          window.showNotification('Secret Achievement Reward: +100 Swa Bucks!', 'success');
        }
      }
    }
    
    if (typeof window.showAchievementNotification === 'function') {
      window.showAchievementNotification(achievement);
    }
    // Use main save system instead of saveAchievements() since secret achievements are in window.state
    if (typeof window.SaveSystem !== 'undefined' && window.SaveSystem.saveGame) {
      window.SaveSystem.saveGame();
    } else if (typeof saveGame === 'function') {
      saveGame();
    }
    if (typeof window.updateAchievementsDisplay === 'function') {
      window.updateAchievementsDisplay();
    }
  }
}

function handleSecretAchievementClick(achievementId) {
  // Use the centralized state reference instead of local variable
  const achievement = window.secretAchievements[achievementId];
  if (achievement && !achievement.unlocked) {
    if (achievementId === 'secret1') {
      unlockSecretAchievement(achievementId);
    }
  }
}

function updateSecretAchievementProgress(achievementId, value) {
  // Use the centralized state reference instead of local variable
  const achievement = window.secretAchievements[achievementId];
  if (achievement && !achievement.unlocked) {
    achievement.progress = Decimal.max(achievement.progress || new Decimal(0), new Decimal(value));
    if (achievement.progress.gte(achievement.requirement || new Decimal(0))) {
      unlockSecretAchievement(achievementId);
    }
  }
}

// Save/load functions removed - secret achievements now managed by main save system
// Data is automatically saved/loaded through window.state

function initSecretAchievements() {
  // Initialize all secret achievements with proper Decimal values
  // Work with the centralized state, not the local object
  if (window.state && window.state.secretAchievements) {
    Object.values(window.state.secretAchievements).forEach(achievement => {
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
  }
  // Secret achievements are now loaded by main save system - no separate loading needed
}

function resetSecretAchievementsForNewSlot(slotNumber) {
  // Reset logic only - save removed as achievements are now managed by main save system
  // Use the centralized state reference
  if (window.secretAchievements) {
    Object.keys(window.secretAchievements).forEach(id => {
      window.secretAchievements[id] = {
        unlocked: false,
        progress: new Decimal(0),
        rewarded: false,
        description: '???'
      };
    });
  }
}

// Initialize state secret achievements if they don't exist
if (!window.state) window.state = {};
if (!window.state.secretAchievements) window.state.secretAchievements = {};

// Merge default secret achievements with state secret achievements
Object.keys(secretAchievements).forEach(key => {
  if (!window.state.secretAchievements[key]) {
    window.state.secretAchievements[key] = {...secretAchievements[key]};
    // Ensure proper Decimal initialization for new achievements
    if (typeof window.state.secretAchievements[key].requirement === 'number') {
      window.state.secretAchievements[key].requirement = new Decimal(window.state.secretAchievements[key].requirement);
    }
    if (typeof window.state.secretAchievements[key].progress === 'number') {
      window.state.secretAchievements[key].progress = new Decimal(window.state.secretAchievements[key].progress);
    }
    if (!window.state.secretAchievements[key].progress) {
      window.state.secretAchievements[key].progress = new Decimal(0);
    }
  } else {
    window.state.secretAchievements[key].name = secretAchievements[key].name;
    window.state.secretAchievements[key].icon = secretAchievements[key].icon;
    window.state.secretAchievements[key].type = secretAchievements[key].type;
    window.state.secretAchievements[key].category = secretAchievements[key].category;
    window.state.secretAchievements[key].row = secretAchievements[key].row;
    window.state.secretAchievements[key].position = secretAchievements[key].position;
    window.state.secretAchievements[key].realDescription = secretAchievements[key].realDescription;
    if (!window.state.secretAchievements[key].unlocked) {
      window.state.secretAchievements[key].description = secretAchievements[key].description;
    }
  }
});

// Make secret achievements globally accessible (reference centralized state)
window.secretAchievements = window.state.secretAchievements;
window.unlockSecretAchievement = unlockSecretAchievement;

// Debug function to check secret achievements
window.debugSecretAchievements = function() {
  return window.secretAchievements;
};

// Force update achievements display manually
window.forceUpdateAchievements = function() {
  if (typeof window.updateAchievementsDisplay === 'function') {
    window.updateAchievementsDisplay();
  }
  if (typeof window.updateSecretAchievements === 'function') {
    window.updateSecretAchievements();
  }
  // Also try the immediate version
  if (typeof window.updateAchievementsDisplayImmediate === 'function') {
    window.updateAchievementsDisplayImmediate();
  }
};
window.handleSecretAchievementClick = handleSecretAchievementClick;
window.updateSecretAchievementProgress = updateSecretAchievementProgress;
// Save/load functions removed - now managed by main save system
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
window.trackHardModeQuestCompletion = trackKitoFoxChallenge2Completion;

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

function trackKitoFoxChallenge2Completion() {
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
    setTimeout(() => {
      Object.keys(secretAchievements).forEach(key => {
        if (window.state.secretAchievements[key]) {
          window.state.secretAchievements[key].name = secretAchievements[key].name;
          window.state.secretAchievements[key].icon = secretAchievements[key].icon;
          window.state.secretAchievements[key].realDescription = secretAchievements[key].realDescription;
          if (!window.state.secretAchievements[key].unlocked) {
            window.state.secretAchievements[key].description = secretAchievements[key].description;
          }
        }
      });
      if (typeof window.updateAchievementsDisplay === 'function') {
        window.updateAchievementsDisplay();
      }
      if (typeof window.updateSecretAchievements === 'function') {
        window.updateSecretAchievements();
      }
    }, 1000);
  });
} else {
  initSecretAchievements();
  initFluzzerNightOwlTracking();
  setTimeout(() => {
    Object.keys(secretAchievements).forEach(key => {
      if (window.state.secretAchievements[key]) {
        window.state.secretAchievements[key].name = secretAchievements[key].name;
        window.state.secretAchievements[key].icon = secretAchievements[key].icon;
        window.state.secretAchievements[key].realDescription = secretAchievements[key].realDescription;
        if (!window.state.secretAchievements[key].unlocked) {
          window.state.secretAchievements[key].description = secretAchievements[key].description;
        }
      }
    });
    if (typeof window.updateAchievementsDisplay === 'function') {
      window.updateAchievementsDisplay();
    }
    // Also try direct update of secret achievements
    if (typeof window.updateSecretAchievements === 'function') {
      window.updateSecretAchievements();
    }
  }, 1000);
}