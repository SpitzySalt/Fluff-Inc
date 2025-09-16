// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// Story system timeout tracking
if (typeof window.storyTimeouts === 'undefined') {
  window.storyTimeouts = [];
}

// Global story modal checker
if (typeof window.checkForPendingStoryModals === 'undefined') {
  window.checkForPendingStoryModals = function() {
    if (!window.state) return;
    // Infinity reset story modal logic
    if (window.state.pendingInfinityResetStory && !window.state.seenInfinityResetStory) {
      window.state.pendingInfinityResetStory = false;
      window.state.seenInfinityResetStory = true;
      const timeoutId = setTimeout(function() {
        if (typeof window.showInfinityResetStoryModal === 'function') {
          window.showInfinityResetStoryModal();
        }
      }, 100);
      if (window.storyTimeouts) window.storyTimeouts.push(timeoutId);
      return;
    }
    // ...other modals can be checked here...
  };
}
















































if (typeof window.state === 'undefined') window.state = window.state || {};

// Story system initialization guard
if (typeof window._storyInitialized === 'undefined') {
  window._storyInitialized = false;
}

// Story system cleanup function
if (typeof window.cleanupStory === 'undefined') {
  window.cleanupStory = function() {
    // Clear all story timeouts
    if (window.storyTimeouts) {
      window.storyTimeouts.forEach(function(timeoutId) {
        clearTimeout(timeoutId);
      });
      window.storyTimeouts = [];
    }
    
    // Reset initialization flag
    window._storyInitialized = false;
  };
}

function showFirstDeliveryStoryModal() {
  document.getElementById('firstDeliveryStoryModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeFirstDeliveryStoryModal() {
  document.getElementById('firstDeliveryStoryModal').style.display = 'none';
  document.body.style.overflow = '';
  if (window._reloadAfterStoryModal) {
    window._reloadAfterStoryModal = false;
  }
}

(function() {
  const firstDeliveryModalHandler = function() {
    const modal = document.getElementById('firstDeliveryStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeFirstDeliveryStoryModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', firstDeliveryModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', firstDeliveryModalHandler);
  }
})();

function showGeneratorUnlockStoryModal() {
  document.getElementById('generatorUnlockStoryModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeGeneratorUnlockStoryModal() {
  document.getElementById('generatorUnlockStoryModal').style.display = 'none';
  document.body.style.overflow = '';
}

(function() {
  const generatorUnlockModalHandler = function() {
    const modal = document.getElementById('generatorUnlockStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeGeneratorUnlockStoryModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', generatorUnlockModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', generatorUnlockModalHandler);
  }
})();

function showKpSoftcapModal() {
  const kpSoftcapModal = document.getElementById('kpSoftcapModal');
  if (kpSoftcapModal) {
    kpSoftcapModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeKpSoftcapModal() {
  const kpSoftcapModal = document.getElementById('kpSoftcapModal');
  if (kpSoftcapModal) {
    kpSoftcapModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

(function() {
  const kpSoftcapModalHandler = function() {
    const kpSoftcapModal = document.getElementById('kpSoftcapModal');
    if (kpSoftcapModal) {
      const btn = kpSoftcapModal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeKpSoftcapModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', kpSoftcapModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', kpSoftcapModalHandler);
  }
})();

function showKpMildcapModal() {
  const kpMildcapModal = document.getElementById('kpMildcapModal');
  if (kpMildcapModal) {
    kpMildcapModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeKpMildcapModal() {
  const kpMildcapModal = document.getElementById('kpMildcapModal');
  if (kpMildcapModal) {
    kpMildcapModal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function showNectarizeResetStoryModal() {
  const nectarizeResetStoryModal = document.getElementById('nectarizeResetStoryModal');
  if (nectarizeResetStoryModal) {
    nectarizeResetStoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeNectarizeResetStoryModal() {
  const nectarizeResetStoryModal = document.getElementById('nectarizeResetStoryModal');
  if (nectarizeResetStoryModal) {
    nectarizeResetStoryModal.style.display = 'none';
    document.body.style.overflow = '';
    const hardModeTabBtn = document.getElementById('settingsHardModeTabBtn');
    if (hardModeTabBtn) {
      hardModeTabBtn.style.display = 'inline-block';
    }
    window.hardModePermanentlyUnlocked = true;
    if (typeof window.autoStartHardModeQuest === 'function') {
      window.autoStartHardModeQuest();
    }
  }
}

(function() {
  const nectarizeResetModalHandler = function() {
    const modal = document.getElementById('nectarizeResetStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeNectarizeResetStoryModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', nectarizeResetModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', nectarizeResetModalHandler);
  }
})();

function showInfinityFluffStoryModal() {
  const infinityFluffStoryModal = document.getElementById('infinityFluffStoryModal');
  if (infinityFluffStoryModal) {
    infinityFluffStoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeInfinityFluffStoryModal() {
  const infinityFluffStoryModal = document.getElementById('infinityFluffStoryModal');
  if (infinityFluffStoryModal) {
    infinityFluffStoryModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  // Set the flag to mark that the infinity fluff story modal has been seen
  if (!window.state) {
    window.state = {};
  }
  window.state.seenInfinityFluffStory = true;
  
  // Save the game to persist the flag
  if (typeof saveGame === 'function') {
    saveGame();
  }
}

(function() {
  const infinityFluffModalHandler = function() {
    const modal = document.getElementById('infinityFluffStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeInfinityFluffStoryModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', infinityFluffModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', infinityFluffModalHandler);
  }
})();

function showElement25StoryModal() {
  const element25StoryModal = document.getElementById('element25StoryModal');
  if (element25StoryModal) {
    element25StoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Set the flag to mark that the element 25 story modal has been seen
    if (!window.state) {
      window.state = {};
    }
    window.state.seenElement25StoryModal = true;
    
    // Save the game to persist the flag
    if (typeof saveGame === 'function') {
      saveGame();
    }
    
    // Check for advanced prism unlock
    if (typeof window.checkAdvancedPrismUnlock === 'function') {
      window.checkAdvancedPrismUnlock();
    }
  }
}

function closeElement25StoryModal() {
  const element25StoryModal = document.getElementById('element25StoryModal');
  if (element25StoryModal) {
    element25StoryModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  // Set the flag to mark that the element 25 story modal has been seen
  if (!window.state) {
    window.state = {};
  }
  window.state.seenElement25StoryModal = true;
  
  // Save the game to persist the flag
  if (typeof saveGame === 'function') {
    saveGame();
  }
  
  // Check for advanced prism unlock
  if (typeof window.checkAdvancedPrismUnlock === 'function') {
    window.checkAdvancedPrismUnlock();
  }
}

function showInfinityResetStoryModal() {
  const infinityResetStoryModal = document.getElementById('infinityResetStoryModal');
  if (infinityResetStoryModal) {
    infinityResetStoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeInfinityResetStoryModal() {
  const infinityResetStoryModal = document.getElementById('infinityResetStoryModal');
  if (infinityResetStoryModal) {
    infinityResetStoryModal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Update anomaly detector visibility after infinity reset story
    if (typeof window.anomalySystem !== 'undefined' && window.anomalySystem.updateDetectorVisibility) {
      window.anomalySystem.updateDetectorVisibility();
    }
    
    if (window._reloadAfterStoryModal) {
      window._reloadAfterStoryModal = false;
    }
  }
  
  // Set the flag to mark that the infinity reset story modal has been seen
  if (!window.state) {
    window.state = {};
  }
  window.state.seenInfinityResetStory = true;
  
  // Save the game to persist the flag
  if (typeof saveGame === 'function') {
    saveGame();
  }
}

(function() {
  const infinityResetModalHandler = function() {
    const modal = document.getElementById('infinityResetStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeInfinityResetStoryModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', infinityResetModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', infinityResetModalHandler);
  }
})();

(function() {
  const element25ModalHandler = function() {
    const modal = document.getElementById('element25StoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn && !btn._storyClickHandler) {
        btn._storyClickHandler = function() {
          closeElement25StoryModal();
        };
        btn.onclick = btn._storyClickHandler;
      }
    }
    document.removeEventListener('DOMContentLoaded', element25ModalHandler);
  };
  
  if (!window._storyInitialized) {
    document.addEventListener('DOMContentLoaded', element25ModalHandler);
    window._storyInitialized = true;
  }
})();
window.showFirstDeliveryStoryModal = showFirstDeliveryStoryModal;
window.closeFirstDeliveryStoryModal = closeFirstDeliveryStoryModal;
window.showGeneratorUnlockStoryModal = showGeneratorUnlockStoryModal;
window.closeGeneratorUnlockStoryModal = closeGeneratorUnlockStoryModal;
window.showKpSoftcapModal = showKpSoftcapModal;
window.closeKpSoftcapModal = closeKpSoftcapModal;
window.showKpMildcapModal = showKpMildcapModal;
window.closeKpMildcapModal = closeKpMildcapModal;
window.showNectarizeResetStoryModal = showNectarizeResetStoryModal;
window.closeNectarizeResetStoryModal = closeNectarizeResetStoryModal;
window.showInfinityFluffStoryModal = showInfinityFluffStoryModal;
window.closeInfinityFluffStoryModal = closeInfinityFluffStoryModal;
window.showElement25StoryModal = showElement25StoryModal;
window.closeElement25StoryModal = closeElement25StoryModal;
window.showInfinityResetStoryModal = showInfinityResetStoryModal;
window.closeInfinityResetStoryModal = closeInfinityResetStoryModal;



// Test function to check lab unlock status
window.testLabUnlock = function() {
  const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
  const gradeUnlock = window.state && window.state.grade >= 2;
  const labBtn = document.getElementById('prismSubTabBtn');
  
  return {
    totalInfinityEarned: window.infinitySystem ? window.infinitySystem.totalInfinityEarned : 0,
    hasInfinityUnlock: hasInfinityUnlock,
    currentGrade: window.state ? window.state.grade : 'undefined',
    gradeUnlock: gradeUnlock,
    shouldShowLab: hasInfinityUnlock || gradeUnlock,
    labBtnExists: !!labBtn,
    labBtnVisible: labBtn ? labBtn.style.display !== 'none' : false,
    currentFloor: window.currentFloor
  };
};
