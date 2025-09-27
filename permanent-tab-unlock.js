// Permanent Tab Unlock System
// Keeps department tab buttons visible permanently after first unlock

// Initialize state permanent tab unlocks if they don't exist
if (!window.state) window.state = {};
if (!window.state.permanentTabUnlocks) {
  window.state.permanentTabUnlocks = {
    prism: false,           // Lab - unlocks at grade 2
    kitchen: false,         // Kitchen - unlocks at grade 3  
    frontDesk: false,       // Front Desk - unlocks at grade 2
    boutique: false,        // Boutique - unlocks at grade 4
    terrarium: false,       // Terrarium - unlocks at grade 6
    controlCenter: false,   // Control Center - unlocks after first delivery reset
    infinityResearch: false // Infinity Research - unlocks after first infinity
  };
}

// Make permanent tab unlocks globally accessible (reference centralized state)
window.permanentTabUnlocks = window.state.permanentTabUnlocks;

// Save/load functions removed - permanent tab unlocks now managed by main save system
// Data is automatically saved/loaded through window.state

// Load permanent tab unlocks from saved state and apply tab visibility
function loadPermanentTabUnlocks() {
  // Ensure state exists and has permanent tab unlocks
  if (!window.state) window.state = {};
  if (!window.state.permanentTabUnlocks) {
    window.state.permanentTabUnlocks = {
      prism: false,
      kitchen: false,
      frontDesk: false,
      boutique: false,
      terrarium: false,
      controlCenter: false,
      infinityResearch: false
    };
  }
  
  // Update global reference to point to loaded state
  window.permanentTabUnlocks = window.state.permanentTabUnlocks;
  
  // Apply tab visibility based on loaded permanent unlocks
  if (typeof updateAllTabVisibility === 'function') {
    updateAllTabVisibility();
  }
}
window.loadPermanentTabUnlocks = loadPermanentTabUnlocks;

function resetPermanentTabUnlocks() {
  window.state.permanentTabUnlocks = {
    prism: false,
    kitchen: false,
    frontDesk: false,
    boutique: false,
    terrarium: false,
    controlCenter: false,
    infinityResearch: false
  };
  // Update the global reference
  window.permanentTabUnlocks = window.state.permanentTabUnlocks;
}

// Check if a tab should be permanently unlocked based on current grade
function checkPermanentTabUnlocks() {
  if (!window.state || !window.state.grade) return;
  
  const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? 
    window.state.grade.toNumber() : window.state.grade;
  
  let hasNewUnlock = false;
  
  // Check each department tab unlock requirement
  // Lab can be unlocked by grade 2 OR having at least 1 total infinity earned
  const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
  if ((currentGrade >= 2 || hasInfinityUnlock) && !window.permanentTabUnlocks.prism) {
    window.permanentTabUnlocks.prism = true;
    hasNewUnlock = true;

  }
  
  if (currentGrade >= 2 && !window.permanentTabUnlocks.frontDesk) {
    window.permanentTabUnlocks.frontDesk = true;
    hasNewUnlock = true;

  }
  
  if (currentGrade >= 3 && !window.permanentTabUnlocks.kitchen) {
    window.permanentTabUnlocks.kitchen = true;
    hasNewUnlock = true;

  }
  
  if (currentGrade >= 4 && !window.permanentTabUnlocks.boutique) {
    window.permanentTabUnlocks.boutique = true;
    hasNewUnlock = true;

  }
  
  if (currentGrade >= 6 && !window.permanentTabUnlocks.terrarium) {
    window.permanentTabUnlocks.terrarium = true;
    hasNewUnlock = true;

  }
  
  // Control Center unlocks after first delivery reset (when seenFirstDeliveryStory is true)
  if (window.state && window.state.seenFirstDeliveryStory && !window.permanentTabUnlocks.controlCenter) {
    window.permanentTabUnlocks.controlCenter = true;
    hasNewUnlock = true;

  }
  
  // Infinity Research unlocks when player has 1+ total infinity
  const hasTotalInfinity = window.infinitySystem && 
    ((typeof window.infinitySystem.getTotalInfinityCurrency === 'function' && window.infinitySystem.getTotalInfinityCurrency() >= 1) ||
     window.infinitySystem.totalInfinityEarned >= 1);
  if (hasTotalInfinity && !window.permanentTabUnlocks.infinityResearch) {
    window.permanentTabUnlocks.infinityResearch = true;
    hasNewUnlock = true;

  }
  
  if (hasNewUnlock) {
    // Save removed - permanent tab unlocks now managed by main save system
    updateAllTabVisibility();
  }
}

// Update visibility of all department tabs based on permanent unlocks
function updateAllTabVisibility() {
  // Prism Lab tab
  const prismBtn = document.getElementById('prismSubTabBtn');
  if (prismBtn) {
    // Check if player has at least 1 total infinity earned (bypass grade requirement)
    const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    
    // Hide Observatory on floor 2 (per user request)
    if (window.currentFloor === 2) {
      prismBtn.style.setProperty('display', 'none', 'important');
      prismBtn.textContent = 'Observatory';

    } else if (window.permanentTabUnlocks.prism || hasInfinityUnlock || (window.state && window.state.grade >= 2)) {
      prismBtn.style.display = 'inline-block';
    }
  }
  
  // Kitchen tab (handled in expansion.js)
  if (window.permanentTabUnlocks.kitchen) {
    const kitchenBtn = document.getElementById('kitchenBtn');
    if (kitchenBtn) {
      kitchenBtn.style.display = 'inline-block';
    }
  }
  
  // Front Desk tab
  if (window.permanentTabUnlocks.frontDesk && window.frontDesk) {
    const frontDeskTab = document.getElementById('frontDeskTab');
    if (frontDeskTab) {
      frontDeskTab.style.display = 'inline-block';
    }
  }
  
  // Boutique tab (call existing function)
  if (window.permanentTabUnlocks.boutique) {
    const boutiqueBtn = document.getElementById('boutiqueSubTabBtn');
    if (boutiqueBtn) {
      // Check if we're not on floor 2 and respect night/day cycle
      if (window.currentFloor !== 2) {
        boutiqueBtn.style.setProperty('display', 'inline-block', 'important');
        
        // Still apply night-time restrictions
        const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
          const mins = window.daynight.getTime();
          return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
        })();
        
        if (isNightTime) {
          boutiqueBtn.style.setProperty('opacity', '0.5', 'important');
          boutiqueBtn.style.setProperty('filter', 'grayscale(100%)', 'important');
          boutiqueBtn.style.setProperty('cursor', 'not-allowed', 'important');
          boutiqueBtn.disabled = true;
        } else {
          boutiqueBtn.style.removeProperty('opacity');
          boutiqueBtn.style.removeProperty('filter');
          boutiqueBtn.style.removeProperty('cursor');
          boutiqueBtn.disabled = false;
        }
      }
    }
  }
  
  // Terrarium tab
  if (window.permanentTabUnlocks.terrarium) {
    // Terrarium shows stairs card at grade 6
    const stairsCard = document.getElementById('stairsCard');
    const stairsCardFloor1 = document.getElementById('stairsCardFloor1');
    if (stairsCard) stairsCard.style.display = 'flex';
    if (stairsCardFloor1) stairsCardFloor1.style.display = 'flex';
  }
  
  // Control Center tab (Knowledge tab)
  if (window.permanentTabUnlocks.controlCenter) {
    const knowledgeTab = document.getElementById('knowledgeTab');
    if (knowledgeTab) {
      knowledgeTab.style.display = 'inline-block';
    }
  }
  
  // Infinity Research tab (within Knowledge tab)
  if (window.permanentTabUnlocks.infinityResearch) {
    const infinityResearchBtn = document.getElementById('infinityResearchSubTabBtn');
    if (infinityResearchBtn) {
      infinityResearchBtn.style.display = 'inline-block';
    }
    
    // Also update the sub-tab visibility
    if (typeof window.updateInfinitySubTabVisibility === 'function') {
      window.updateInfinitySubTabVisibility();
    }
  }
}

// Override the original kitchen unlock function to respect permanent unlocks
function enhanceKitchenUnlockFunction() {
  // Hook into the expansion.js kitchen unlock
  const waitForKitchenFunction = () => {
    if (typeof window.updateKitchenUnlock === 'function') {
      const originalUpdateKitchenUnlock = window.updateKitchenUnlock;
      
      window.updateKitchenUnlock = function() {
        const kitchenBtn = document.getElementById('kitchenBtn');
        if (!kitchenBtn) {
          // Call original if button doesn't exist yet
          originalUpdateKitchenUnlock.apply(this, arguments);
          return;
        }
        
        // Check if permanently unlocked first
        if (window.permanentTabUnlocks && window.permanentTabUnlocks.kitchen) {
          kitchenBtn.style.display = 'inline-block';
          return;
        }
        
        // Otherwise use original logic
        originalUpdateKitchenUnlock.apply(this, arguments);
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForKitchenFunction, 500);
    }
  };
  
  waitForKitchenFunction();
}

// Override the boutique visibility function to respect permanent unlocks
function enhanceBoutiqueVisibilityFunction() {
  const waitForBoutiqueFunction = () => {
    if (typeof window.updateBoutiqueButtonVisibility === 'function') {
      const originalUpdateBoutiqueButtonVisibility = window.updateBoutiqueButtonVisibility;
      
      window.updateBoutiqueButtonVisibility = function() {
        const boutiqueBtn = document.getElementById('boutiqueSubTabBtn');
        if (!boutiqueBtn) {
          // Call original if button doesn't exist yet
          originalUpdateBoutiqueButtonVisibility.apply(this, arguments);
          return;
        }
        
        // Hide if on floor 2
        if (window.currentFloor === 2) {
          boutiqueBtn.style.setProperty('display', 'none', 'important');
          return;
        }
        
        // Check if permanently unlocked first
        if (window.permanentTabUnlocks && window.permanentTabUnlocks.boutique) {
          boutiqueBtn.style.setProperty('display', 'inline-block', 'important');
          
          // Still apply night-time restrictions
          const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
            const mins = window.daynight.getTime();
            return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
          })();
          
          if (isNightTime) {
            boutiqueBtn.style.setProperty('opacity', '0.5', 'important');
            boutiqueBtn.style.setProperty('filter', 'grayscale(100%)', 'important');
            boutiqueBtn.style.setProperty('cursor', 'not-allowed', 'important');
            boutiqueBtn.disabled = true;
          } else {
            boutiqueBtn.style.removeProperty('opacity');
            boutiqueBtn.style.removeProperty('filter');
            boutiqueBtn.style.removeProperty('cursor');
            boutiqueBtn.disabled = false;
          }
          return;
        }
        
        // Otherwise use original logic
        originalUpdateBoutiqueButtonVisibility.apply(this, arguments);
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForBoutiqueFunction, 500);
    }
  };
  
  waitForBoutiqueFunction();
}

// Override the front desk unlock check to respect permanent unlocks
function enhanceFrontDeskUnlockFunction() {
  const waitForFrontDeskFunction = () => {
    if (window.frontDesk && typeof window.frontDesk.updateUIVisibility === 'function') {
      const originalUpdateUIVisibility = window.frontDesk.updateUIVisibility;
      
      window.frontDesk.updateUIVisibility = function() {
        const frontDeskTab = document.getElementById('frontDeskTab');
        if (frontDeskTab) {
          // Check if permanently unlocked first
          if (window.permanentTabUnlocks && window.permanentTabUnlocks.frontDesk) {
            frontDeskTab.style.display = 'inline-block';
            return;
          }
        }
        
        // Otherwise use original logic
        originalUpdateUIVisibility.apply(this, arguments);
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForFrontDeskFunction, 500);
    }
  };
  
  waitForFrontDeskFunction();
}

// Override the stairs card visibility function to respect permanent unlocks
function enhanceStairsCardVisibility() {
  const waitForStairsFunction = () => {
    if (typeof window.updateStairsCardVisibility === 'function') {
      const originalUpdateStairsCardVisibility = window.updateStairsCardVisibility;
      
      window.updateStairsCardVisibility = function() {
        // Check if permanently unlocked first
        if (window.permanentTabUnlocks && window.permanentTabUnlocks.terrarium) {
          const stairsCard = document.getElementById('stairsCard');
          const stairsCardFloor1 = document.getElementById('stairsCardFloor1');
          if (stairsCard) stairsCard.style.display = 'flex';
          if (stairsCardFloor1) stairsCardFloor1.style.display = 'flex';
          return;
        }
        
        // Otherwise use original logic
        originalUpdateStairsCardVisibility.apply(this, arguments);
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForStairsFunction, 500);
    }
  };
  
  waitForStairsFunction();
}

// Override the control center unlock check to respect permanent unlocks
function enhanceControlCenterUnlockFunction() {
  const waitForControlCenterFunction = () => {
    if (typeof window.checkControlCenterUnlock === 'function') {
      const originalCheckControlCenterUnlock = window.checkControlCenterUnlock;
      
      window.checkControlCenterUnlock = function() {
        // Check if permanently unlocked first
        if (window.permanentTabUnlocks && window.permanentTabUnlocks.controlCenter) {
          const knowledgeTab = document.getElementById('knowledgeTab');
          if (knowledgeTab) {
            knowledgeTab.style.display = 'inline-block';
          }
          return;
        }
        
        // Otherwise use original logic
        originalCheckControlCenterUnlock.apply(this, arguments);
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForControlCenterFunction, 500);
    }
  };
  
  waitForControlCenterFunction();
}

// Override the infinity research unlock check to respect permanent unlocks
function enhanceInfinityResearchUnlockFunction() {
  const waitForInfinityResearchFunction = () => {
    if (typeof window.checkInfinityResearchUnlock === 'function') {
      const originalCheckInfinityResearchUnlock = window.checkInfinityResearchUnlock;
      
      window.checkInfinityResearchUnlock = function() {
        // Check if permanently unlocked first
        if (window.permanentTabUnlocks && window.permanentTabUnlocks.infinityResearch) {
          const infinityResearchBtn = document.getElementById('infinityResearchSubTabBtn');
          if (infinityResearchBtn) {
            infinityResearchBtn.style.display = 'inline-block';
          }
          
          // Also update the sub-tab visibility
          if (typeof window.updateInfinitySubTabVisibility === 'function') {
            window.updateInfinitySubTabVisibility();
          }
          return;
        }
        
        // Otherwise use original logic
        originalCheckInfinityResearchUnlock.apply(this, arguments);
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForInfinityResearchFunction, 500);
    }
  };
  
  waitForInfinityResearchFunction();
}

// Hook into the grade up function to check for new permanent unlocks
function hookIntoGradeUp() {
  if (typeof window.gradeUp === 'function') {
    const originalGradeUp = window.gradeUp;
    
    window.gradeUp = function() {
      originalGradeUp.apply(this, arguments);
      
      // Check for new permanent unlocks after grade up
      checkPermanentTabUnlocks();
    };
  }
}

// Hook into the load game function to apply permanent unlocks
function hookIntoLoadGame() {
  if (typeof window.loadGame === 'function') {
    const originalLoadGame = window.loadGame;
    
    window.loadGame = function() {
      originalLoadGame.apply(this, arguments);
      
      // Load and apply permanent tab unlocks
      loadPermanentTabUnlocks();
      checkPermanentTabUnlocks();
      updateAllTabVisibility();
    };
  }
}

// Hook into save slot loading to load permanent unlocks
function hookIntoSaveSlotLoading() {
  if (typeof window.loadFromSlot === 'function') {
    const originalLoadFromSlot = window.loadFromSlot;
    
    window.loadFromSlot = function() {
      originalLoadFromSlot.apply(this, arguments);
      
      // Small delay to ensure save slot is fully loaded
      setTimeout(() => {
        // Load and apply permanent tab unlocks for this save slot
        loadPermanentTabUnlocks();
        checkPermanentTabUnlocks();
        updateAllTabVisibility();
      }, 100);
    };
  }
  
  if (typeof window.saveToSlot === 'function') {
    const originalSaveToSlot = window.saveToSlot;
    
    window.saveToSlot = function() {
      // Save removed - permanent tab unlocks now managed by main save system
      return originalSaveToSlot.apply(this, arguments);
    };
  }
}

// Hook into the reset game function to check for control center unlock after delivery reset
function hookIntoResetGame() {
  if (typeof window.resetGame === 'function') {
    const originalResetGame = window.resetGame;
    
    window.resetGame = function() {
      const result = originalResetGame.apply(this, arguments);
      
      // Small delay to let state changes settle, then check for control center unlock
      setTimeout(() => {
        checkPermanentTabUnlocks();
        updateAllTabVisibility();
      }, 100);
      
      return result;
    };
  }
}

// Hook into the story modal close functions to check for control center unlock
function hookIntoStoryModals() {
  const waitForStoryFunctions = () => {
    if (typeof window.closeFirstDeliveryStoryModal === 'function') {
      const originalCloseFirstDeliveryStoryModal = window.closeFirstDeliveryStoryModal;
      
      window.closeFirstDeliveryStoryModal = function() {
        const result = originalCloseFirstDeliveryStoryModal.apply(this, arguments);
        
        // Check for control center unlock after closing first delivery story modal
        setTimeout(() => {
          checkPermanentTabUnlocks();
          updateAllTabVisibility();
        }, 100);
        
        return result;
      };

    } else {
      // Wait longer if function not ready yet
      setTimeout(waitForStoryFunctions, 500);
    }
  };
  
  waitForStoryFunctions();
}

// Hook into infinity reset to check for infinity research unlock
function hookIntoInfinityReset() {
  // Hook into the infinity system's reset method
  const waitForInfinitySystem = () => {
    if (window.infinitySystem && typeof window.infinitySystem.performInfinityReset === 'function') {
      const originalPerformInfinityReset = window.infinitySystem.performInfinityReset;
      
      window.infinitySystem.performInfinityReset = function() {
        const result = originalPerformInfinityReset.apply(this, arguments);
        
        // Small delay to let state changes settle, then check for infinity research unlock
        setTimeout(() => {
          checkPermanentTabUnlocks();
          updateAllTabVisibility();
        }, 100);
        
        return result;
      };

    } else {
      // Wait longer if infinity system not ready yet
      setTimeout(waitForInfinitySystem, 500);
    }
  };
  
  waitForInfinitySystem();
}

// Initialize the permanent tab unlock system
function initializePermanentTabUnlocks() {
  // Permanent tab unlocks are now loaded by main save system - no separate loading needed
  
  // Check current state for any unlocks
  checkPermanentTabUnlocks();
  
  // Apply current unlocks to UI
  updateAllTabVisibility();
  
  // Hook into various functions
  enhanceKitchenUnlockFunction();
  enhanceBoutiqueVisibilityFunction();
  enhanceFrontDeskUnlockFunction();
  enhanceStairsCardVisibility();
  enhanceControlCenterUnlockFunction();
  enhanceInfinityResearchUnlockFunction();
  hookIntoGradeUp();
  hookIntoLoadGame();
  hookIntoSaveSlotLoading();
  hookIntoResetGame();
  hookIntoStoryModals();
  hookIntoInfinityReset();


}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for other systems to load
  setTimeout(initializePermanentTabUnlocks, 1500);
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, event listener will handle it
} else {
  // DOM is already loaded
  setTimeout(initializePermanentTabUnlocks, 1500);
}

// Periodic check to ensure tabs remain visible (every 5 seconds)
setInterval(() => {
  if (window.permanentTabUnlocks) {
    updateAllTabVisibility();
  }
}, 5000);

// Expose functions globally for debugging
window.checkPermanentTabUnlocks = checkPermanentTabUnlocks;
window.updateAllTabVisibility = updateAllTabVisibility;
// Save/load functions removed - now managed by main save system

// Debug function to manually unlock all tabs
window.debugUnlockAllTabsPermanently = function() {
  window.permanentTabUnlocks = {
    prism: true,
    kitchen: true,
    frontDesk: true,
    boutique: true,
    terrarium: true,
    controlCenter: true,
    infinityResearch: true
  };
  // Save removed - permanent tab unlocks now managed by main save system
  updateAllTabVisibility();

};

// Debug function to reset all permanent unlocks
window.debugResetPermanentTabUnlocks = function() {
  window.permanentTabUnlocks = {
    prism: false,
    kitchen: false,
    frontDesk: false,
    boutique: false,
    terrarium: false,
    controlCenter: false,
    infinityResearch: false
  };
  // Save removed - permanent tab unlocks now managed by main save system

};

// Make reset function globally accessible
window.resetPermanentTabUnlocks = resetPermanentTabUnlocks;