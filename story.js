// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file


















































if (typeof window.state === 'undefined') window.state = window.state || {};

function showFirstDeliveryStoryModal() {
  document.getElementById('firstDeliveryStoryModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeFirstDeliveryStoryModal() {
  document.getElementById('firstDeliveryStoryModal').style.display = 'none';
  document.body.style.overflow = '';
  if (window._reloadAfterStoryModal) {
    window._reloadAfterStoryModal = false;
    window.location.reload();
  }
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('firstDeliveryStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeFirstDeliveryStoryModal();
        };
      }
    }
  });
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
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('generatorUnlockStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeGeneratorUnlockStoryModal();
        };
      }
    }
  });
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
  document.addEventListener('DOMContentLoaded', function() {
    const kpSoftcapModal = document.getElementById('kpSoftcapModal');
    if (kpSoftcapModal) {
      const btn = kpSoftcapModal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeKpSoftcapModal();
        };
      }
    }
  });
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
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('nectarizeResetStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeNectarizeResetStoryModal();
        };
      }
    }
  });
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
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('infinityFluffStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeInfinityFluffStoryModal();
        };
      }
    }
  });
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
      window.location.reload();
    }
  }
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('infinityResetStoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeInfinityResetStoryModal();
        };
      }
    }
  });
})();

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('element25StoryModal');
    if (modal) {
      const btn = modal.querySelector('button');
      if (btn) {
        btn.onclick = function() {
          closeElement25StoryModal();
        };
      }
    }
  });
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
