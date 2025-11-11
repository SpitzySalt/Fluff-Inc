// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file


















































window.premiumState = window.premiumState || {
  bijouUnlocked: false,
  bijouEnabled: false,
  vrchatMirrorUnlocked: false
};

// Migrate bijou from window.premiumState to window.state
function migrateBijouToMainState() {
  // Ensure window.state exists
  if (!window.state) return;
  
  // Initialize unlockedFeatures if it doesn't exist
  if (!window.state.unlockedFeatures) {
    window.state.unlockedFeatures = {};
  }
  
  // Migrate bijou unlock status from premiumState to window.state.unlockedFeatures
  if (window.premiumState && window.premiumState.bijouUnlocked && !window.state.unlockedFeatures.bijou) {
    window.state.unlockedFeatures.bijou = true;
  }
  
  // Migrate bijou active status from premiumState to window.state
  if (window.premiumState && window.premiumState.bijouEnabled && window.state.bijouActive === undefined) {
    window.state.bijouActive = true;
  }
  
  // Initialize bijouActive if it doesn't exist
  if (window.state.bijouActive === undefined) {
    window.state.bijouActive = false;
  }
}

// Backward compatibility helper functions - check both old and new state systems
function isBijouUnlocked() {
  return window.state.unlockedFeatures?.bijou || 
         (window.premiumState && window.premiumState.bijouUnlocked);
}

function isBijouEnabled() {
  return window.state.bijouActive || 
         (window.premiumState && window.premiumState.bijouEnabled);
}

function isBijouActiveCompat() {
  return isBijouUnlocked() && isBijouEnabled();
}

function initPremiumSystem() {
  // Initialize premium state only if it doesn't exist, preserving existing values
  if (!window.premiumState) {
    window.premiumState = {
      bijouUnlocked: false,
      bijouEnabled: false,
      vrchatMirrorUnlocked: false
    };
  } else {
    // Ensure all properties exist but don't overwrite existing values
    if (window.premiumState.bijouUnlocked === undefined) window.premiumState.bijouUnlocked = false;
    if (window.premiumState.bijouEnabled === undefined) window.premiumState.bijouEnabled = false;
    if (window.premiumState.vrchatMirrorUnlocked === undefined) window.premiumState.vrchatMirrorUnlocked = false;
  }
  
  // Migrate bijou to main state system (before loading saved data)
  migrateBijouToMainState();
  
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      try {
        const save = JSON.parse(slotData);
        if (save.premiumState) {
          Object.assign(window.premiumState, save.premiumState);
        }
      } catch (e) {

      }
    }
  } else {
    const savedPremiumState = localStorage.getItem('premiumState');
    if (savedPremiumState) {
      try {
        const parsed = JSON.parse(savedPremiumState);
        Object.assign(window.premiumState, parsed);
      } catch (e) {

      }
    }
  }
  
  // Migrate bijou again after loading saved data
  migrateBijouToMainState();
  updatePremiumUI();
  addPremiumEventListeners();
  hookIntoTokenSpawning();
  addSpeechBubbleCSS();
  setTimeout(() => {
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    } else {
    }
    if (typeof updatePrismLabCharacterImage === 'function') {
      updatePrismLabCharacterImage();
    } else {
    }
    if (typeof updateHardModeQuestCharacterImage === 'function') {
      updateHardModeQuestCharacterImage();
    } else {
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    } else {
    }
  }, 200);
  setTimeout(() => {
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    }
    if (typeof updatePrismLabCharacterImage === 'function') {
      updatePrismLabCharacterImage();
    }
    if (typeof updateHardModeQuestCharacterImage === 'function') {
      updateHardModeQuestCharacterImage();
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    }
    
    // Ensure KitoFox hardcore overlay state is correct
    ensureKitoFoxOverlayState();
    
    // Setup captcha refresh detection
    setupCaptchaRefreshDetection();
    
    // Restore Halloween event state
    if (typeof updateHalloweenEventState === 'function') {
      updateHalloweenEventState();
    }
    
    // Initialize Halloween Recorder easter egg if both modes are active
    if (isHalloweenRecorderEasterEggActive()) {
      initializeHalloweenRecorderEasterEgg();
    }
  }, 1000);
}

// Save function removed - premium state now managed by main save system
// Data is automatically saved/loaded through window.state

function updatePremiumUI() {
  document.querySelectorAll('.card').forEach(card => {
    const h3 = card.querySelector('h3');
    if (h3 && h3.textContent.trim() === 'Unlock Bijou') {
      const bijouButton = card.querySelector('button');
      if (bijouButton) {
        const bijouUnlocked = isBijouUnlocked();
        if (bijouUnlocked) {
          bijouButton.textContent = 'Bought';
          bijouButton.disabled = true;
          bijouButton.style.backgroundColor = '#4CAF50';
          bijouButton.style.color = 'white';
        } else {
          bijouButton.textContent = 'Buy';
          bijouButton.disabled = false;
          bijouButton.style.backgroundColor = '';
          bijouButton.style.color = '';
        }
      }
    }
    if (h3 && h3.textContent.trim() === 'Unlock Vrchat mirror') {
      const vrchatButton = card.querySelector('button');
      if (vrchatButton) {
        if (window.premiumState.vrchatMirrorUnlocked) {
          vrchatButton.textContent = 'Unlocked';
          vrchatButton.disabled = true;
          vrchatButton.style.backgroundColor = '#4CAF50';
          vrchatButton.style.color = 'white';
        } else {
          vrchatButton.textContent = 'Buy';
          vrchatButton.disabled = false;
          vrchatButton.style.backgroundColor = '';
          vrchatButton.style.color = '';
        }
      }
    }
  });
  updateBijouToggleUI();
  updateBijouUIVisibility();
  addPremiumEventListeners();
}

function addPremiumEventListeners() {
  document.querySelectorAll('.card').forEach(card => {
    const h3 = card.querySelector('h3');
    if (h3 && h3.textContent.trim() === 'Unlock Bijou') {
      const bijouButton = card.querySelector('button');
      if (bijouButton) {
        bijouButton.removeEventListener('click', buyBijou);
        bijouButton.addEventListener('click', buyBijou);
      }
    }
    if (h3 && h3.textContent.trim() === 'Unlock Vrchat mirror') {
      const vrchatButton = card.querySelector('button');
      if (vrchatButton) {
        vrchatButton.removeEventListener('click', buyVrchatMirror);
        vrchatButton.addEventListener('click', buyVrchatMirror);
      }
    }
  });
}

function buyBijou() {
  const cost = new Decimal(500);
  if (window.state.unlockedFeatures?.bijou) {
    return;
  }
  const currentSwabucks = window.state && window.state.swabucks ? new Decimal(window.state.swabucks) : new Decimal(0);
  if (currentSwabucks.lt(cost)) {
    alert(`You need ${DecimalUtils.formatDecimal(cost)} Swa Bucks to unlock Bijou!`);
    return;
  }
  if (confirm(`Are you sure you want to unlock Bijou for ${DecimalUtils.formatDecimal(cost)} Swa Bucks?`)) {
    window.state.swabucks = currentSwabucks.sub(cost);
    if (!window.state.unlockedFeatures) window.state.unlockedFeatures = {};
    window.state.unlockedFeatures.bijou = true;
    window.state.bijouActive = true; 
    // Save removed - premium state now managed by main save system
    saveGame();
    updatePremiumUI();
    updateUI(); 
    updateBijouUIVisibility();
    if (typeof window.cafeteria?.refreshCharacterCards === 'function') {
      window.cafeteria.refreshCharacterCards();
    }
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    }
    if (typeof updatePrismLabCharacterImage === 'function') {
      updatePrismLabCharacterImage();
    }
    if (typeof updateHardModeQuestCharacterImage === 'function') {
      updateHardModeQuestCharacterImage();
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    }
    if (typeof window.triggerBijouUnlockStory === 'function') {
      window.triggerBijouUnlockStory();
    }
  }
}

function buyVrchatMirror() {
  const cost = new Decimal(1000000);
  if (window.premiumState.vrchatMirrorUnlocked) {
    return;
  }
  const currentSwabucks = window.state && window.state.swabucks ? new Decimal(window.state.swabucks) : new Decimal(0);
  if (currentSwabucks.lt(cost)) {
    alert(`You need ${DecimalUtils.formatDecimal(cost)} Swa Bucks to unlock VRChat Mirror!`);
    return;
  }
  if (confirm(`Are you sure you want to unlock VRChat Mirror for ${DecimalUtils.formatDecimal(cost)} Swa Bucks?`)) {
    window.state.swabucks = currentSwabucks.sub(cost);
    window.premiumState.vrchatMirrorUnlocked = true;
    // Save removed - premium state now managed by main save system
    saveGame();
    updatePremiumUI();
    updateUI(); 
  }
}

function toggleBijou() {
  if (!window.state.unlockedFeatures?.bijou) {
    alert('Bijou must be unlocked first!');
    const checkbox = document.getElementById('bijouToggleCheckbox');
    if (checkbox) {
      checkbox.checked = false;
    }
    return;
  }
  const checkbox = document.getElementById('bijouToggleCheckbox');
  if (checkbox) {
    window.state.bijouActive = checkbox.checked;
  } else {
    window.state.bijouActive = !window.state.bijouActive;
  }
  // Save removed - premium state now managed by main save system
  const status = window.state.bijouActive ? 'enabled' : 'disabled';
  updateBijouUIVisibility();
  if (typeof window.cafeteria?.refreshCharacterCards === 'function') {
    window.cafeteria.refreshCharacterCards();
  }
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updatePrismLabCharacterImage === 'function') {
    updatePrismLabCharacterImage();
  }
  if (typeof updateHardModeQuestCharacterImage === 'function') {
    updateHardModeQuestCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
}

function updateBijouToggleUI() {
  const checkbox = document.getElementById('bijouToggleCheckbox');
  if (window.state.unlockedFeatures?.bijou) {
    if (!checkbox) {
      addBijouToggleButton();
    }
  } else {
    if (checkbox) {
      checkbox.parentElement.remove();
    }
  }
  if (checkbox) {
    checkbox.checked = window.state.bijouActive || false;
  }
  
  // Also update recorder mode toggle
  updateRecorderModeToggleUI();
  
  // Also update KitoFox mode toggle
  updateKitoFoxModeToggleUI();
  
  // Also update Kito mode toggle
  updateKitoModeToggleUI();
  
  // Also update Halloween event toggle
  updateHalloweenEventToggleUI();
}

function updateRecorderModeToggleUI() {
  const checkbox = document.getElementById('recorderModeToggleCheckbox');
  if (window.state.unlockedFeatures && window.state.unlockedFeatures.recorderMode) {
    if (!checkbox) {
      addRecorderModeToggleButton();
    } else {
      // Update checkbox state
      checkbox.checked = window.state.recorderModeActive || false;
    }
  } else if (checkbox) {
    checkbox.parentElement.parentElement.remove();
  }
}

function updateKitoFoxModeToggleUI() {
  const checkbox = document.getElementById('kitoFoxModeToggleCheckbox');
  if (window.state.unlockedFeatures && window.state.unlockedFeatures.kitoFoxMode) {
    if (!checkbox) {
      addKitoFoxModeToggleButton();
    } else {
      // Update checkbox state
      checkbox.checked = window.state.kitoFoxModeActive || false;
    }
  } else if (checkbox) {
    checkbox.parentElement.parentElement.remove();
  }
}

function updateKitoModeToggleUI() {
  const checkbox = document.getElementById('kitoModeToggleCheckbox');
  if (window.state.unlockedFeatures && window.state.unlockedFeatures.kitoMode) {
    if (!checkbox) {
      addKitoModeToggleButton();
    } else {
      // Update checkbox state
      checkbox.checked = window.state.kitoModeActive || false;
    }
  } else if (checkbox) {
    checkbox.parentElement.parentElement.remove();
  }
}

function updateHalloweenEventToggleUI() {
  const checkbox = document.getElementById('halloweenEventToggleCheckbox');
  if (window.state.unlockedFeatures && window.state.unlockedFeatures.halloweenEvent) {
    if (!checkbox) {
      addHalloweenEventToggleButton();
    } else {
      // Update checkbox state
      checkbox.checked = window.state.halloweenEventActive || false;
    }
  } else if (checkbox) {
    checkbox.parentElement.parentElement.remove();
  }
}

function addBijouToggleButton() {
  if (document.getElementById('bijouToggleCheckbox')) {
    return;
  }
  const settingsCard = document.querySelector('#settingsSavesTab .card');
  if (settingsCard) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '1em';
    checkboxContainer.style.textAlign = 'center';
    checkboxContainer.style.borderTop = '1px solid #ddd';
    checkboxContainer.style.paddingTop = '1em';
    checkboxContainer.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5em; justify-content: center;">
        <input type="checkbox" id="bijouToggleCheckbox" ${window.state.bijouActive ? 'checked' : ''} onchange="toggleBijou()">
        <span>Enable Bijou</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
  
  // Add recorder mode toggle if unlocked
  addRecorderModeToggleButton();
  
  // Add KitoFox mode toggle if unlocked
  addKitoFoxModeToggleButton();
  
  // Add Kito mode toggle if unlocked
  addKitoModeToggleButton();
  
  // Add Halloween event toggle if unlocked
  addHalloweenEventToggleButton();
}

function addRecorderModeToggleButton() {
  if (document.getElementById('recorderModeToggleCheckbox')) {
    return;
  }
  
  // Only show if recorder mode is unlocked
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.recorderMode) {
    return;
  }
  
  const settingsCard = document.querySelector('#settingsSavesTab .card');
  if (settingsCard) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '1em';
    checkboxContainer.style.textAlign = 'center';
    checkboxContainer.style.borderTop = '1px solid #ddd';
    checkboxContainer.style.paddingTop = '1em';
    checkboxContainer.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5em; justify-content: center;">
        <input type="checkbox" id="recorderModeToggleCheckbox" ${window.state.recorderModeActive ? 'checked' : ''} onchange="toggleRecorderMode()">
        <span>Enable Recorder Mode</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
}

function addKitoFoxModeToggleButton() {
  if (document.getElementById('kitoFoxModeToggleCheckbox')) {
    return;
  }
  
  // Only show if KitoFox mode is unlocked
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.kitoFoxMode) {
    return;
  }
  
  const settingsCard = document.querySelector('#settingsSavesTab .card');
  if (settingsCard) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '1em';
    checkboxContainer.style.textAlign = 'center';
    checkboxContainer.style.borderTop = '1px solid #ddd';
    checkboxContainer.style.paddingTop = '1em';
    checkboxContainer.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5em; justify-content: center;">
        <input type="checkbox" id="kitoFoxModeToggleCheckbox" ${window.state.kitoFoxModeActive ? 'checked' : ''} onchange="toggleKitoFoxMode()">
        <span>Enable HARDCORE Mode</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
}

function addKitoModeToggleButton() {
  if (document.getElementById('kitoModeToggleCheckbox')) {
    return;
  }
  
  // Only show if Kito mode is unlocked
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.kitoMode) {
    return;
  }
  
  const settingsCard = document.querySelector('#settingsSavesTab .card');
  if (settingsCard) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '1em';
    checkboxContainer.style.textAlign = 'center';
    checkboxContainer.style.borderTop = '1px solid #ddd';
    checkboxContainer.style.paddingTop = '1em';
    checkboxContainer.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5em; justify-content: center;">
        <input type="checkbox" id="kitoModeToggleCheckbox" ${window.state.kitoModeActive ? 'checked' : ''} onchange="toggleKitoMode()">
        <span>Enable Kito Mode</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
}

function addHalloweenEventToggleButton() {
  if (document.getElementById('halloweenEventToggleCheckbox')) {
    return;
  }
  
  // Only show if Halloween event is unlocked
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.halloweenEvent) {
    return;
  }
  
  const settingsCard = document.querySelector('#settingsSavesTab .card');
  if (settingsCard) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '1em';
    checkboxContainer.style.textAlign = 'center';
    checkboxContainer.style.borderTop = '1px solid #ddd';
    checkboxContainer.style.paddingTop = '1em';
    checkboxContainer.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5em; justify-content: center;">
        <input type="checkbox" id="halloweenEventToggleCheckbox" ${window.state.halloweenEventActive ? 'checked' : ''} onchange="toggleHalloweenEvent()">
        <span>Enable Halloween Event</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
}

function isBijouActive() {
  return window.state.unlockedFeatures?.bijou && window.state.bijouActive;
}

function getBijouStatus() {
  return {
    unlocked: window.state.unlockedFeatures?.bijou || false,
    enabled: window.state.bijouActive || false,
    active: isBijouActive()
  };
}

function toggleRecorderMode() {
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.recorderMode) {
    return;
  }
  
  window.state.recorderModeActive = !window.state.recorderModeActive;
  
  // If turning on recorder mode, turn off KitoFox mode and Kito mode
  if (window.state.recorderModeActive && window.state.kitoFoxModeActive) {
    window.state.kitoFoxModeActive = false;
    // Update KitoFox toggle UI
    const kitoFoxCheckbox = document.getElementById('kitoFoxModeToggleCheckbox');
    if (kitoFoxCheckbox) {
      kitoFoxCheckbox.checked = false;
    }
  }
  if (window.state.recorderModeActive && window.state.kitoModeActive) {
    window.state.kitoModeActive = false;
    // Update Kito mode toggle UI
    const kitoCheckbox = document.getElementById('kitoModeToggleCheckbox');
    if (kitoCheckbox) {
      kitoCheckbox.checked = false;
    }
  }
  
  updateRecorderModeImages();
  
  // Initialize or cleanup Halloween Recorder easter egg
  if (isHalloweenRecorderEasterEggActive()) {
    initializeHalloweenRecorderEasterEgg();
  } else {
    cleanupHalloweenRecorderEasterEgg();
  }
  
  // Save the state
  if (typeof window.saveGame === 'function') {
    window.saveGame();
  }
}

function toggleKitoFoxMode() {
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.kitoFoxMode) {
    return;
  }
  
  window.state.kitoFoxModeActive = !window.state.kitoFoxModeActive;
  
  // If turning on KitoFox mode, turn off recorder mode (but allow Kito mode to stay active)
  if (window.state.kitoFoxModeActive && window.state.recorderModeActive) {
    window.state.recorderModeActive = false;
    // Update recorder toggle UI
    const recorderCheckbox = document.getElementById('recorderModeToggleCheckbox');
    if (recorderCheckbox) {
      recorderCheckbox.checked = false;
    }
  }
  
  updateKitoFoxModeImages();
  
  // Save the state
  if (typeof window.saveGame === 'function') {
    window.saveGame();
  }
}

function toggleKitoMode() {
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.kitoMode) {
    return;
  }
  
  window.state.kitoModeActive = !window.state.kitoModeActive;
  
  // If turning on Kito mode, turn off recorder mode (but allow KitoFox mode to stay active)
  if (window.state.kitoModeActive && window.state.recorderModeActive) {
    window.state.recorderModeActive = false;
    // Update recorder toggle UI
    const recorderCheckbox = document.getElementById('recorderModeToggleCheckbox');
    if (recorderCheckbox) {
      recorderCheckbox.checked = false;
    }
  }
  
  updateKitoModeImages();
  
  // Save the state
  if (typeof window.saveGame === 'function') {
    window.saveGame();
  }
}

function toggleHalloweenEvent() {
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.halloweenEvent) {
    return;
  }
  
  window.state.halloweenEventActive = !window.state.halloweenEventActive;
  
  // Update Halloween event visibility and button state IMMEDIATELY
  updateHalloweenEventState();
  
  // Force immediate visual update to ensure theme applies instantly
  if (window.state.halloweenEventActive) {
    // Apply Halloween theme REGARDLESS of current page
    document.body.classList.add('halloween-cargo-active');
    document.documentElement.classList.add('halloween-cargo-active');
    document.body.style.setProperty('--halloween-active', '1');
    
    // Trigger theme functions immediately
    if (typeof window.forceHalloweenThemeUpdate === 'function') {
      window.forceHalloweenThemeUpdate();
    }
  } else {
    // Remove Halloween theme immediately
    document.body.classList.remove('halloween-cargo-active');
    document.documentElement.classList.remove('halloween-cargo-active');
    document.body.classList.remove('halloween-active');
    document.body.classList.remove('halloween-event-active');
    document.body.style.removeProperty('--halloween-active');
  }
  
  // Initialize or cleanup Halloween Recorder easter egg
  if (isHalloweenRecorderEasterEggActive()) {
    initializeHalloweenRecorderEasterEgg();
  } else {
    cleanupHalloweenRecorderEasterEgg();
  }
  
  // Save the state
  if (typeof window.saveGame === 'function') {
    window.saveGame();
  }
}

function updateHalloweenEventState() {
  // Use our new candy-based display system
  if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
    window.updateHalloweenEventButtonDisplay();
  }
  
  if (window.state.halloweenEventActive) {
    
    // Initialize all Halloween event systems
    if (typeof window.initializeHalloweenEventSystems === 'function') {
      window.initializeHalloweenEventSystems();
    } else {
      // Fallback initialization if function not yet available
      if (!window.state.halloweenEvent) {
        window.state.halloweenEvent = {
          swandy: new Decimal(0),
          isActive: true,
          currentSubTab: 'hub',
          treeOfHorrors: {
            level: 1,
            totalFed: new Decimal(0)
          },
          peachy: {
            lastInteraction: 0,
            interactionCooldown: 10000,
            totalInteractions: 0,
            isTalking: false,
            speechTimer: null,
            currentImage: 'assets/icons/halloween peachy.png',
            autoSpeechTimer: null,
            lastAutoSpeech: 0
          }
        };
      }
      
      if (window.state.halloweenEvent) {
        window.state.halloweenEvent.isActive = true;
      }
    }
    
    // Apply Halloween theme immediately based on current page
    const currentPage = document.querySelector('.page.active');
    
    // IMMEDIATE theme application - no delays
    // Apply base Halloween styling first
    document.body.style.setProperty('--halloween-active', '1');
    
    // Apply Halloween theme to ALL pages
    document.body.classList.add('halloween-cargo-active');
    document.documentElement.classList.add('halloween-cargo-active');
    
    if (currentPage) {
      if (currentPage.id === 'halloweenEvent') {
        document.body.classList.add('halloween-active');
        document.documentElement.classList.add('halloween-active');
        document.body.classList.add('halloween-event-active');
      }
    }
    
    // Apply Halloween cargo theme functions
    if (typeof window.applyHalloweenCargoTheme === 'function') {
      window.applyHalloweenCargoTheme();
    }
    
    // Apply Halloween cursors immediately
    if (typeof window.addHalloweenCursorEffects === 'function') {
      window.addHalloweenCursorEffects();
    }
    
    // Update character images immediately
    if (typeof window.updateMainCargoCharacterImage === 'function') {
      window.updateMainCargoCharacterImage();
    }
    if (typeof window.updateTerrariumCharacterImage === 'function') {
      window.updateTerrariumCharacterImage();
    }
    
    // Update time display immediately
    if (typeof window.updateTimeDisplay === 'function') {
      window.updateTimeDisplay();
    }
    
    // Force additional theme updates with minimal delay for any slow elements
    if (typeof window.forceHalloweenThemeUpdate === 'function') {
      window.forceHalloweenThemeUpdate();
      setTimeout(window.forceHalloweenThemeUpdate, 10);
    }
    
  } else {
    // Hide Halloween event button if disabled
    const halloweenButton = document.querySelector('.halloween-event-btn');
    if (halloweenButton) {
      halloweenButton.style.display = 'none';
    }
    
    // Disable Halloween event functionality
    if (window.state.halloweenEvent) {
      window.state.halloweenEvent.isActive = false;
    }
    
    // Clean up all Halloween event systems IMMEDIATELY
    // Stop any Halloween systems first
    if (typeof window.stopHalloweenPeachyAutoSpeech === 'function') {
      window.stopHalloweenPeachyAutoSpeech();
    }
    
    // Remove all Halloween classes immediately
    document.body.classList.remove('halloween-active');
    document.documentElement.classList.remove('halloween-active');
    document.body.classList.remove('halloween-event-active');
    document.body.classList.remove('halloween-cargo-active');
    document.body.classList.remove('halloween-cursor-spinning');
    
    // Remove Halloween background styling immediately
    document.body.style.removeProperty('--halloween-active');
    
    // Remove Halloween cargo theme immediately
    if (typeof window.removeHalloweenCargoTheme === 'function') {
      window.removeHalloweenCargoTheme();
    }
    
    // Update visual elements to normal immediately
    if (typeof window.updateMainCargoCharacterImage === 'function') {
      window.updateMainCargoCharacterImage();
    }
    if (typeof window.updateTerrariumCharacterImage === 'function') {
      window.updateTerrariumCharacterImage();
    }
    if (typeof window.updateTimeDisplay === 'function') {
      window.updateTimeDisplay();
    }
    
    // Clean up additional systems
    if (typeof window.cleanupHalloweenEventSystems === 'function') {
      window.cleanupHalloweenEventSystems();
    }
    
    // If currently on Halloween event page, switch to home
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'halloweenEvent') {
      if (typeof window.switchPage === 'function') {
        window.switchPage('home');
      }
    }
  }
  
  // Update character images to reflect Halloween state
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updatePrismLabCharacterImage === 'function') {
    updatePrismLabCharacterImage();
  }
  if (typeof updateHardModeQuestCharacterImage === 'function') {
    updateHardModeQuestCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  
  // Apply Halloween + Recorder ghost effect to all images
  if (typeof applyHalloweenRecorderGhostEffectToAll === 'function') {
    applyHalloweenRecorderGhostEffectToAll();
  }
  
  // Update Halloween cargo theme
  if (typeof updateHalloweenCargoTheme === 'function') {
    updateHalloweenCargoTheme();
  }
}

function updateKitoFoxModeImages() {
  if (!window.state.kitoFoxModeActive) {
    // Revert to appropriate images based on current mode (including Bijou)
    const normalImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(false) : 'swa normal.png';
    const speechImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(true) : 'swa talking.png';
    updateAllSwariaImages(normalImage, speechImage);
    
    // Clean up vantablack light system when KitoFox mode is disabled
    if (typeof window.cleanupVantablackSystem === 'function') {
      window.cleanupVantablackSystem();
    }
    
    // Remove hardcore overlay
    removeKitoFoxHardcoreOverlay();
    
    // Stop captcha system
    stopKitoFoxCaptchaSystem();
  } else {
    // Switch to KitoFox images
    updateAllSwariaImages('assets/icons/kitomode.png', 'assets/icons/kitomode speech.png');
    
    // Show hardcore overlay
    showKitoFoxHardcoreOverlay();
    
    // Start captcha system
    startKitoFoxCaptchaSystem();
  }
  
  // Force update all character images that use these functions
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  if (typeof forceUpdateCargoCharacter === 'function') {
    forceUpdateCargoCharacter();
  }
}

function updateKitoModeImages() {
  if (!window.state.kitoModeActive) {
    // Revert to appropriate images based on current mode (including Bijou)
    const normalImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(false) : 'swa normal.png';
    const speechImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(true) : 'swa talking.png';
    updateAllSwariaImages(normalImage, speechImage);
  } else {
    // Switch to Kito images
    updateAllSwariaImages('assets/icons/kito.png', 'assets/icons/kito speech.png');
  }
  
  // Force update all character images that use these functions
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  if (typeof forceUpdateCargoCharacter === 'function') {
    forceUpdateCargoCharacter();
  }
}

function updateRecorderModeImages() {
  if (!window.state.recorderModeActive) {
    // Revert to appropriate images based on current mode (including Bijou)
    const normalImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(false) : 'swa normal.png';
    const speechImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(true) : 'swa talking.png';
    updateAllSwariaImages(normalImage, speechImage);
  } else {
    // Switch to recorder images
    updateAllSwariaImages('assets/icons/recorder.png', 'assets/icons/recorder speech.png');
  }
  
  // Force update all character images that use these functions
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  if (typeof forceUpdateCargoCharacter === 'function') {
    forceUpdateCargoCharacter();
  }
  
  // Apply Halloween + Recorder ghost effect to all images
  if (typeof applyHalloweenRecorderGhostEffectToAll === 'function') {
    applyHalloweenRecorderGhostEffectToAll();
  }
  
  // Initialize Halloween Recorder easter egg if both modes are active
  if (isHalloweenRecorderEasterEggActive()) {
    setTimeout(() => {
      initializeHalloweenRecorderEasterEgg();
    }, 100); // Small delay to ensure images are loaded
  } else {
    cleanupHalloweenRecorderEasterEgg();
  }
}

function updateAllModeImages() {
  
  let normalImage, speechImage;
  
  // Priority: Recorder mode first, then if both KitoFox and Kito are active use Kito visuals, then individual modes
  if (window.state.recorderModeActive) {
    // Use recorder images
    normalImage = 'assets/icons/recorder.png';
    speechImage = 'assets/icons/recorder speech.png';
  } else if (window.state.kitoFoxModeActive && window.state.kitoModeActive) {
    // Both modes active - use Kito images (visual priority)
    normalImage = 'assets/icons/kito.png';
    speechImage = 'assets/icons/kito speech.png';
  } else if (window.state.kitoFoxModeActive) {
    // Use KitoFox images
    normalImage = 'assets/icons/kitomode.png';
    speechImage = 'assets/icons/kitomode speech.png';
  } else if (window.state.kitoModeActive) {
    // Use Kito images
    normalImage = 'assets/icons/kito.png';
    speechImage = 'assets/icons/kito speech.png';
  } else {
    // Use appropriate images based on current mode (including Bijou)
    normalImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(false) : 'swa normal.png';
    speechImage = window.getMainCargoCharacterImage ? window.getMainCargoCharacterImage(true) : 'swa talking.png';
  }
  
  
  // Apply the determined images
  updateAllSwariaImages(normalImage, speechImage);
  
  // Force update all character images that use these functions
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  if (typeof forceUpdateCargoCharacter === 'function') {
    forceUpdateCargoCharacter();
  }
}

function updateAllSwariaImages(normalImage, speechImage) {
  // Find all Swaria character images (not currency icons)
  const swariaCharacterImages = document.querySelectorAll('img[src*="swa normal"], img[src*="swa talking"], img[src*="recorder.png"], img[src*="recorder speech"], img[src*="kitomode.png"], img[src*="kitomode speech"], img[src*="kito.png"], img[src*="kito speech"]');
  
  swariaCharacterImages.forEach(img => {
    const isSpeech = img.src.includes('talking') || img.src.includes('speech');
    img.src = isSpeech ? speechImage : normalImage;
  });
  
  // Update specific character images by ID
  const swariaCharacter = document.getElementById('swariaCharacter');
  if (swariaCharacter) {
    swariaCharacter.src = normalImage;
  }
  
  // Also look for any background images that might be set via CSS
  const swariaElements = document.querySelectorAll('[style*="swa normal"], [style*="swa talking"], [style*="recorder.png"], [style*="recorder speech"], [style*="kito.png"], [style*="kito speech"]');
  swariaElements.forEach(element => {
    const style = element.style.backgroundImage;
    if (style) {
      const isSpeech = style.includes('talking') || style.includes('speech');
      element.style.backgroundImage = `url('${isSpeech ? speechImage : normalImage}')`;
    }
  });
}

// Recorder-specific quotes for when recorder mode is active
const recorderQuotes = [
  { text: "It is I, the Random Recorder.", condition: () => true },
  { text: "I was just leveling up and then it hit me with that and I'm like what?", condition: () => true },
  { text: "antiswa dimenswans.", condition: () => true },
  { text: "Why does everyone calls me toothpaste dragon when my name is Mynta.", condition: () => true },
  { text: "Weeeehhhhhhhhh.", condition: () => true },
  { text: "I am so smart, I know 3 numbers.", condition: () => true },
  { text: "Am I also a glorified news ticker?", condition: () => true },
  { text: "👀 Oh would you look at that you got a legendary box ooh I wonder how that happened wow guess we'll never know....👀", condition: () => true },
  { text: "I am the recorder of all things, the keeper of knowledge, the chronicler of events, the scribe of history, the archivist of memories, the documenter of facts, the transcriber of stories, the stenographer of conversations, the reporter of news, the journalist of happenings, the biographer of lives, the memoirist of experiences, the annalist of occurrences, the logkeeper of activities, the historian of times, the chronicler of eras, the recorder of ages.", condition: () => true },
  { text: "stacked.", condition: () => true },
  { text: "Nuuu gimmi cookie D:", condition: () => true },
  { text: "Welcome back! While you were away, you gained: +40 Fluff Points, +18 Swaria Coins, +12 Feathers, +3 Wing Artifacts.", condition: () => true },
  { text: "Swa.", condition: () => true },
  { text: "I looked into the game's files and found a super secret code, it is 'Give me 1 million swa bucks'. This code will give you 1 million swa bucks :)", condition: () => true },
  { text: "parallelogram windows go brrr.", condition: () => true },
  { text: "= x1 Uncommon Box Obtained!! =", condition: () => true },
  { text: "(and no, I can't just give you free mythic boxes thats cheating :3)", condition: () => true },
  { text: "If your save data corrupts, oopsie :)", condition: () => true },
  { text: "The fluff making empire begins", condition: () => true },
  { text: "Wanna play a game I made in like 10 minutes? It's basically an idle game that's all text- Oh wait...", condition: () => true },
  { text: "Have you SEEN my swarias on garlic phone?", condition: () => true },
  { text: "Plot twist, they're scary cucumbers.", condition: () => true },
  { text: "It takes 44 crumbs to produce a city center.", condition: () => true },
  { text: "Technically, it is impossible to generate a square.", condition: () => true },
  { text: "Neon lights absorb 72 oranges, but only if seals are around.", condition: () => true },
  { text: "The shape of a pie is determined by the time of day.", condition: () => true },
  { text: "Fish spin when they obtain breadsticks.", condition: () => true },
  { text: "The letter 6 is most popular in the shape of purple.", condition: () => true },
  { text: "Double doors are really just grapes.", condition: () => true },
  { text: "Bananas hold infinite wisdom, but will only share if you can tolerate QR codes.", condition: () => true },
  { text: "The woozy man weilds a spatula that controls thoughts.", condition: () => true },
  { text: "If you persuade a maid you'll either gain aid or fade.", condition: () => true },
  { text: "I have shared braincells but its not my turn to use them.", condition: () => true },
  { text: "I'm a sony amiga 64.", condition: () => true },
  { text: "When running, try to aim for the sideways carrots.", condition: () => true },
  { text: "Squeak.", condition: () => true },
  { text: "Bluetooth range is awful.", condition: () => true },
  { text: "AAAAAAA", condition: () => true },
  { text: "f", condition: () => true },
  { text: "A Birds wings: Life and Death", condition: () => true },
  { text: "I just got attacked by a Jet2 holiday ad.", condition: () => true },
  { text: "Well that's a thing to wake up to.", condition: () => true },
  { text: "Stick your hand in cement to make it heal faster as it won't be able to move.", condition: () => true },
  { text: "boop.", condition: () => true },
  { text: "waaaa.", condition: () => true },
  { text: "fok.", condition: () => true },
  { text: "Very dumb question, but can you have a functioning cable that's display port to usb c?", condition: () => true },
  { text: "Swar", condition: () => true },
  { text: "Get the gun, no one hurts the beans, except other beans.", condition: () => true },
  { text: "Nope, I'm just stating facts.", condition: () => true },
  { text: "Imma plant myself.", condition: () => true },
  { text: "Huh.", condition: () => true },
  { text: "Shhh, don't tell peachy I snuck into the cargo.", condition: () => true },
  { image: "assets/icons/mhh.png", condition: () => true },
  { image: "Here is what the peak swaria form looks like: assets/icons/minty.png", condition: () => true },
  { image: "This is my irl tv remote assets/icons/anomaly resolver.png", condition: () => true }
];

// Halloween Recorder-specific quotes for when both Halloween and Recorder modes are active
const halloweenRecorderQuotes = [
  { text: "OooOhHh~ The cargoooo is haaaauuuunteeeed~", condition: () => true },
  { text: "BoOoOo! Did I scare you? I'm practically invisible anyway~", condition: () => true },
  { text: "I'm not just a Swaria anymore... I'm a GHOST Swaria! SpOoOoKy~", condition: () => true },
  { text: "OW! who pulled my tail?", condition: () => true },
  { text: "Can you even see me? I'm like 90% transparent! That's some advanced ghosting~", condition: () => true },
  { text: "Got some cameras set up, I'm ready to catch some ghosts, wait I'm the ghost...", condition: () => true },
  { text: "I used to record things... but now I record SPOOKY things! OoOoOoOh~", condition: () => true },
  { text: "Being a ghost is fun! I can phase through walls and... wait, I still can't actually do that.", condition: () => true },
  { text: "Did...did that box just move?", condition: () => true },
  { text: "AHHH! WHAT WAS THAT?", condition: () => true },
  { text: "I've never seen the lights flicker before...", condition: () => true },
  { text: "5 nights at Fluff Inc.", condition: () => true },
  { text: "Would you spend one night in a haunted facility for 1 million swa bucks?", condition: () => true },
  { text: "I forgot to charge my cameras for this...", condition: () => true },
  { text: "I just felt a shiver down my feathers...", condition: () => true },
  { text: "Happy Halloween :D", condition: () => true },
  { text: "BOO!", condition: () => true },
  { text: "WoOoOoOo~ Can you feel my ghostly presence? Or is that just the AC?", condition: () => true },
  { text: "Those spider decorations look so lifelike....wait, did one just move?", condition: () => true },
  { text: "Don't eat too many sweets ok?", condition: () => true },
  { text: "The scariest thing for a Swaria to encounter is a bird cage", condition: () => true },
  { text: "Keep yourself together Mynta...", condition: () => true },
  { text: "Yoru would like this place.", condition: () => true },
  { text: "I'm not dead, I'm just REALLY committed to this Halloween costume! SpOoOoKy dedication~", condition: () => true }
];

// KitoFox-specific quotes for when KitoFox mode is active
const kitoFoxQuotes = [
  { text: "Welcome to Fluff Inc. No fun edition.", condition: () => true },
  { text: "The only upside from this mode is the X5 tokens boost.", condition: () => true },
  { text: "HARDCORE!!!", condition: () => true },
  { text: "This mode is only for the serious and dedicated players. And for grinding tokens.", condition: () => true },
  { text: "I hope you like pain and suffering.", condition: () => true },
  { text: "If you want to have fun, turn this mode off.", condition: () => true },
  { text: "EXTREME!!!", condition: () => true },
 
];

// Kito mode quotes - special dialogue when Kito mode is active
const kitoQuotes = [
  { text: "Hehe~ I'm helping out now!", condition: () => true },
  { text: "This place is really cool! So many boxes!", condition: () => true },
  { text: "I can see Peachy staring at me while I took their usual spot.", condition: () => true },
  { text: "Peachy showed me around! Everything is so organized!", condition: () => true },
  { text: "I got over 600s on the power generator challenge but lepre is still better.", condition: () => true },
  { text: "I'm still learning how everything works here!", condition: () => true },
  { text: "So many resources to manage! And I can do it better than Peachy!", condition: () => true },
  { text: "I heard the Generator Department is really important!", condition: () => true },
  { text: "The cargo area is not very busy, its just me and Peachy here.", condition: () => true },
  { text: "Fluff production is fascinating to watch!", condition: () => true },
  { text: "I got the hang of this place~", condition: () => true },
  { text: "I like chatting.", condition: () => true },
  { text: "Hey uhh I think I broke the game or something.", condition: () => true },
  { text: "I love seeing all the different departments!", condition: () => true },
  { text: "This purple abyss anomaly will not appear if I stay here. Peachy could not do anything about it.", condition: () => true },
  { text: "This honey token is out of this world!", condition: () => true },
  { text: "I'm impressed by how efficient everyone is! Except for Soap, of course. Too invested in their soap collection all the time.", condition: () => true },
  { text: "So many upgrades to keep track of!", condition: () => true },
  { text: "giving batteries to Soap doesnt progress the final charger miles- Oh wait that's gone.", condition: () => true },
  { text: "I'm enjoying helping out around here~", condition: () => true },
  { text: "Everyone here is so dedicated to their work! And Soap is dedicated to their soap collection.", condition: () => true },
  { text: "With my help, Tico was able to craft more than 300,000 food rations for the rikkor workers.", condition: () => true },
  { text: "I think I know who 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒, their real name must be  ████████", condition: () => true },
  { text: "I'm a real fluff veteran here, my computer survived the terrarium memory leak multiple times.", condition: () => true },
  { text: "When I give Soap a battery, the current power goes back to 100, like what, how does that work, what is Soap doing with the battery token I gave them, our power generator has a capacity of 6000 power and the battery is only supposed to stop the power from draining, so why does the power go back to 100??? I don't understand. WHAT IS SOAP DOING TO THE POWER GENERATOR WITH THAT BATTERY. RRRRAAAAAA", condition: () => true },
  { text: "I actually have the infinity challenges unlocked when these should not be possible to reach.", condition: () => true },
  { text: "Fluzzer thought I was never gonna be able to unlock the flower grid, but I did.", condition: () => true },
  { text: "Also, the rikkor workers with decimal amount of seconds for a task extrapolate that part of a second into a full second, resulting in waiting longer than they are indicated, how does Tico let that happen? The workers are being a extra second lazy!", condition: () => true },
  { text: "I hope I'm being helpful~", condition: () => true },
  { text: "Me and Soap likes to party when the anomalies turns the power generator into the Soap generator, we may not be able to refill the power but that's fine since our power capacity is above 6000. So instead we like to slip and slide in the generator room~", condition: () => true },
  { text: "Soap's quest is very hard to accomplish when you currently have an infinity, because you dont get any fluff at all, can't they see I have an infinity of fluff and count that toward their quest?", condition: () => true },
  { text: "I've noticed something strange about the terrarium xp... When me and fluzzer are extracting the pollen from flowers, I noticed the xp bar jiggling, and I'm not getting that experience at all, how is Fluzzer not seeing that? Its like right in our faces and they just don't do anything about it, it's like they don't care, they'll just keep saying stupid stuff like 'I asked a worm for gardening tips. It just wiggled.'.", condition: () => true },
  { text: "I got 700 seconds in the power generator challenge, try to beat that.", condition: () => true },
  
  // Bijou-related quotes
  { text: "Bijou is really good at collecting tokens! I'm impressed~", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I'm trying to train Bijou to collect every tokens from a token burst, but they always seem to only collect 1 of the 5 tokens.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Bijou used to get sent to the shadow realm when peachy would eat a berry plate, I'm glad this no longer happens.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I saw Bijou grab a token super fast! They are improving!", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Bijou seems really dedicated to helping out here! But they like staying on Peachy's head instead of mine, why not.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I wonder if Bijou could teach me how to spot tokens that quickly.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Bijou's magnet is so cool! Where did they get it?", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I think Bijou and I could make a great team! But Bijou rather stays on Peachy's head instead of mine.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Bijou always seems so focused when collecting tokens~", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I hope Bijou doesn't mind me being here too!", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I have this conspiracy theory that Bijou is actually a pigeon Swaria.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Maybe Bijou and I could coordinate our efforts somehow?", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I noticed Bijou gets really excited about shiny tokens! It's cute~", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Bijou mentioned something about not being greedy with tokens. They're lying.", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I wonder what Bijou thinks about all the upgrades happening here...", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "Bijou seems to really care about being helpful. I respect that!", condition: () => window.state?.unlockedFeatures?.bijou },
  { text: "I should ask Bijou about their favorite part of working here~ It's probably nesting on Peachy's head. And collecting tokens.", condition: () => window.state?.unlockedFeatures?.bijou },
];

// Halloween Recorder Visibility Easter Egg System
let halloweenRecorderVisibility = {
  currentOpacity: 0.0, // Start at 0% opacity (100% dimmed) when in ghost mode
  targetOpacity: 0.0,   // Target opacity to reach
  dimInterval: null,    // Interval for auto-dimming
  isActive: false,      // Whether the easter egg is currently active
  clickHandlersAdded: false, // Track if click handlers are already added
  speechTimeouts: new Map(), // Track active speech timeouts for each element
  originalTexts: new Map(),   // Store original texts for each speech element
  autoDimTicks: 0       // Track seconds for sneaky dialogue timing
};

// Special dialogue for when recorder is clicked during Halloween mode
const halloweenRecorderClickQuotes = [
  "Whaaaa? Noo I'm becoming visible!",
  "Hey! Stop that! I'm trying to stay spooky!",
  "Weeeehh! You're making me less ghostly!",
  "No fair! I worked hard to become this transparent!",
  "Stop poking me! Weeeehh...",
  "This is the opposite of what ghosts want!",
  "You're ruining my perfectly ghostly aesthetic weeeeeh!",
  "Weeeh I can feel my spookiness level decreasing!",
  "Help! I'm losing my Halloween powers!",
  "Weeehh...",
  "This is ghost harassment! I'm calling the spirit police!",
  "My transparency rating is dropping! Weeehh!",
  "Weeehh... I spent ages perfecting this ghostly look!",
  "Being visible is so... un-spooky! Weeehh...",
  "You're making me too real! Ghosts aren't supposed to be real!",
  "This is worse than being caught in a bird cage weeehh...",
  "I'm supposed to be scary, not visible!",
  "My Halloween costume is supposed to make me LESS visible!",
  "Stop it! I'm trying to haunt properly here! Weeehh..."
];

// Sneaky dialogue for when recorder is auto-dimming (becoming more transparent without clicks)
const halloweenRecorderSneakyQuotes = [
  "Whehe nobody will see me become transparent~",
  "Perfect... slowly fading back into the shadows~",
  "Slowly becoming invisible when nobody is looking~",
  "Hehe, back to my ghostly glory~",
  "Yes... returning to my spooky transparent state~",
  "Nobody will see me soon... whehe~",
  "Fading away like a proper ghost should~",
  "Hehe, becoming one with the Halloween darkness~",
  "Sneaky sneaky... back to being incorporeal~",
  "Perfect! My ghostly powers are returning~",
  "Slowly disappearing while nobody is watching me~",
  "Hehe, no one will ever catch me when I'm this transparent~",
  "Back to my mysteriously dim state~",
  "Ohoho~ becoming invisible is so satisfying~",
  "Slipping back into the spectral realm~",
  "Quietly returning to my haunting form~",
  "Mmm yes, this is how a proper spirit should look~",
  "Sneaking back into the transparency~",
  "Hehe, I love being mysteriously translucent~"
];

// Function to check if Halloween Recorder easter egg should be active
function isHalloweenRecorderEasterEggActive() {
  return window.state && 
         window.state.halloweenEventActive && 
         window.state.recorderModeActive;
}

// Function to handle recorder image clicks during Halloween mode
function handleHalloweenRecorderClick(event) {
  if (!isHalloweenRecorderEasterEggActive()) return;
  
  // Increase visibility by 1% (losing 1% of dimness)
  // Lower opacity = more dimmed, higher opacity = less dimmed
  halloweenRecorderVisibility.currentOpacity = Math.min(1.0, halloweenRecorderVisibility.currentOpacity + 0.01);
  
  // Switch clicked image to speech version temporarily
  switchRecorderImageToSpeech(event.target);
  
  // Apply the new opacity to all recorder images (both normal and speech)
  // Use setTimeout to ensure this happens after any image updates
  setTimeout(() => {
    updateHalloweenRecorderOpacity();
  }, 50);
  
  // Show a random click quote
  const randomQuote = halloweenRecorderClickQuotes[Math.floor(Math.random() * halloweenRecorderClickQuotes.length)];
  showHalloweenRecorderClickSpeech(randomQuote);
  
  // Reset the auto-dimming timer
  startHalloweenRecorderAutoDim();
}

// Function to switch recorder image to speech version temporarily
function switchRecorderImageToSpeech(clickedImage) {
  if (!clickedImage || !isHalloweenRecorderEasterEggActive()) return;
  
  // Store original src if not already stored
  if (!clickedImage._halloweenOriginalSrc) {
    clickedImage._halloweenOriginalSrc = clickedImage.src;
  }
  
  // Clear any existing timeout for this image
  if (clickedImage._halloweenImageTimeout) {
    clearTimeout(clickedImage._halloweenImageTimeout);
  }
  
  // Switch to speech version
  if (clickedImage.src.includes('recorder.png') && !clickedImage.src.includes('speech')) {
    clickedImage.src = clickedImage.src.replace('recorder.png', 'recorder speech.png');
  }
  
  // Set timeout to revert to normal image after 6 seconds (matching speech duration)
  clickedImage._halloweenImageTimeout = setTimeout(() => {
    if (clickedImage._halloweenOriginalSrc) {
      clickedImage.src = clickedImage._halloweenOriginalSrc;
    }
    delete clickedImage._halloweenImageTimeout;
  }, 6000);
}

// Function to cleanup image switches
function cleanupRecorderImageSwitches() {
  const recorderImages = document.querySelectorAll('img[src*="recorder"]');
  recorderImages.forEach(img => {
    if (img._halloweenImageTimeout) {
      clearTimeout(img._halloweenImageTimeout);
      delete img._halloweenImageTimeout;
    }
    if (img._halloweenOriginalSrc) {
      img.src = img._halloweenOriginalSrc;
      delete img._halloweenOriginalSrc;
    }
  });
}

// Function to switch ALL recorder images to speech version (for sneaky dialogue)
function switchAllRecorderImagesToSpeech() {
  if (!isHalloweenRecorderEasterEggActive()) return;
  
  const recorderImages = document.querySelectorAll('img[src*="recorder.png"], img[src*="recorder speech.png"]');
  recorderImages.forEach(img => {
    // Store original src if not already stored
    if (!img._halloweenSneakyOriginalSrc) {
      img._halloweenSneakyOriginalSrc = img.src;
    }
    
    // Switch to speech version if not already
    if (img.src.includes('recorder.png') && !img.src.includes('speech')) {
      img.src = img.src.replace('recorder.png', 'recorder speech.png');
    }
  });
}

// Function to revert ALL recorder images from speech version (after sneaky dialogue)
function revertAllRecorderImagesFromSpeech() {
  const recorderImages = document.querySelectorAll('img[src*="recorder"]');
  recorderImages.forEach(img => {
    // Only revert if we have an original stored and it's different
    if (img._halloweenSneakyOriginalSrc && img._halloweenSneakyOriginalSrc !== img.src) {
      img.src = img._halloweenSneakyOriginalSrc;
    }
    // Clean up the stored original
    delete img._halloweenSneakyOriginalSrc;
  });
}

// Function to show sneaky dialogue during auto-dimming (more selective than click speech)
function showHalloweenRecorderSneakySpeech(text) {
  // Only show sneaky dialogue in specific recorder-related speech elements
  const speechElements = [
    document.getElementById('swariaSpeech'),
    document.getElementById('prismSpeech'),
    document.getElementById('hardModeSwariaSpeech')
  ];
  
  speechElements.forEach(element => {
    if (element) { // Remove the display check - work with any element
      // Show sneaky speech more liberally - if it's empty or has recorder content
      const currentText = element.textContent.trim();
      const isRecorderRelated = currentText.includes('recorder') || 
                               currentText.includes('Mynta') ||
                               currentText.includes('recording') ||
                               currentText === 'Hello there!' ||
                               currentText === '...' ||
                               currentText === '';
      
      // Be more permissive - show sneaky speech if it's a valid element
      if (isRecorderRelated || currentText === '') {
        // Clear any existing timeout for this element
        if (halloweenRecorderVisibility.speechTimeouts.has(element)) {
          clearTimeout(halloweenRecorderVisibility.speechTimeouts.get(element));
          halloweenRecorderVisibility.speechTimeouts.delete(element);
        }
        
        // Store original text if not already stored
        if (!halloweenRecorderVisibility.originalTexts.has(element)) {
          halloweenRecorderVisibility.originalTexts.set(element, currentText || '');
        }
        
        // Set sneaky text and show element
        element.textContent = text;
        element.style.display = 'block';
        
        // Switch recorder images to speech version for sneaky dialogue
        switchAllRecorderImagesToSpeech();
        
        // Set timeout to revert to original text after 6 seconds
        const timeoutId = setTimeout(() => {
          // Extra check: If Halloween Recorder easter egg is still active, just hide the speech
          if (isHalloweenRecorderEasterEggActive()) {
            element.textContent = '';
            element.style.display = 'none';
            // Revert recorder images back to normal after sneaky speech ends
            revertAllRecorderImagesFromSpeech();
          } else {
            const originalText = halloweenRecorderVisibility.originalTexts.get(element);
            if (originalText && originalText !== '') {
              element.textContent = originalText;
            } else {
              // If no meaningful original text, hide the speech bubble
              element.textContent = '';
              element.style.display = 'none';
            }
          }
          halloweenRecorderVisibility.speechTimeouts.delete(element);
        }, 6000);
        
        // Store the timeout ID so we can clear it if interrupted
        halloweenRecorderVisibility.speechTimeouts.set(element, timeoutId);
      }
    }
  });
}

// Function to show special speech when recorder is clicked
function showHalloweenRecorderClickSpeech(text) {
  // Try to find speech bubbles and show the message
  const speechElements = [
    document.getElementById('swariaSpeech'),
    document.getElementById('prismSpeech'),
    document.getElementById('terrariumSpeechBubble'),
    document.getElementById('hardModeSwariaSpeech')
  ];
  
  speechElements.forEach(element => {
    if (element) { // Remove the display check - we want to work with any element
      // Clear any existing timeout for this element (allows interruption)
      if (halloweenRecorderVisibility.speechTimeouts.has(element)) {
        clearTimeout(halloweenRecorderVisibility.speechTimeouts.get(element));
        halloweenRecorderVisibility.speechTimeouts.delete(element);
      }
      
      // Store original text if not already stored (but not during Halloween Recorder mode)
      if (!halloweenRecorderVisibility.originalTexts.has(element) && !isHalloweenRecorderEasterEggActive()) {
        halloweenRecorderVisibility.originalTexts.set(element, element.textContent);
      }
      
      // Set new text and show element
      element.textContent = text;
      element.style.display = 'block';
      
      // Set timeout to revert to original text after 6 seconds
      const timeoutId = setTimeout(() => {
        // During Halloween Recorder mode, always just hide the speech
        if (isHalloweenRecorderEasterEggActive()) {
          element.textContent = '';
          element.style.display = 'none';
        } else {
          const originalText = halloweenRecorderVisibility.originalTexts.get(element);
          if (originalText && originalText !== '') {
            element.textContent = originalText;
          } else {
            // If no meaningful original text, hide the speech bubble
            element.textContent = '';
            element.style.display = 'none';
          }
        }
        halloweenRecorderVisibility.speechTimeouts.delete(element);
      }, 6000); // 6 seconds instead of 3
      
      // Store the timeout ID so we can clear it if interrupted
      halloweenRecorderVisibility.speechTimeouts.set(element, timeoutId);
    }
  });
}

// Function to update opacity of all recorder images
function updateHalloweenRecorderOpacity() {
  if (!isHalloweenRecorderEasterEggActive()) return;
  
  // Find all images that are currently showing recorder (both normal and speech)
  const recorderImages = document.querySelectorAll('img[src*="recorder.png"], img[src*="recorder speech.png"]');
  recorderImages.forEach(img => {
    // Use CSS custom property to override both the !important opacity and brightness
    img.style.setProperty('opacity', halloweenRecorderVisibility.currentOpacity, 'important');
    img.style.setProperty('filter', `brightness(${halloweenRecorderVisibility.currentOpacity})`, 'important');
    img.style.transition = 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out';
  });
  
  // Also check for any images with src containing "recorder" in general
  const allRecorderImages = document.querySelectorAll('img[src*="recorder"]');
  allRecorderImages.forEach(img => {
    // Use CSS custom property to override both the !important opacity and brightness
    img.style.setProperty('opacity', halloweenRecorderVisibility.currentOpacity, 'important');
    img.style.setProperty('filter', `brightness(${halloweenRecorderVisibility.currentOpacity})`, 'important');
    img.style.transition = 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out';
  });
}

// Function to start auto-dimming (0.5% per second back to 10% opacity)
function startHalloweenRecorderAutoDim() {
  // Clear any existing interval
  if (halloweenRecorderVisibility.dimInterval) {
    clearInterval(halloweenRecorderVisibility.dimInterval);
  }
  
  // Reset the sneaky dialogue counter
  halloweenRecorderVisibility.autoDimTicks = 0;
  
  halloweenRecorderVisibility.dimInterval = setInterval(() => {
    if (!isHalloweenRecorderEasterEggActive()) {
      stopHalloweenRecorderAutoDim();
      return;
    }
    
    // Decrease visibility by 0.5% per second (lower opacity means less visible)
    halloweenRecorderVisibility.currentOpacity = Math.max(0.0, halloweenRecorderVisibility.currentOpacity - 0.005);
    
    updateHalloweenRecorderOpacity();
    
    // Increment auto-dim tick counter
    halloweenRecorderVisibility.autoDimTicks++;
    
    // Show sneaky dialogue more frequently (every 5-8 seconds with higher chance)
    // but only when they're still somewhat visible (not completely invisible)
    if (halloweenRecorderVisibility.autoDimTicks >= 5 && 
        Math.random() < 0.6 && 
        halloweenRecorderVisibility.currentOpacity > 0.0) {
      const randomSneakyQuote = halloweenRecorderSneakyQuotes[Math.floor(Math.random() * halloweenRecorderSneakyQuotes.length)];
      showHalloweenRecorderSneakySpeech(randomSneakyQuote);
      halloweenRecorderVisibility.autoDimTicks = 0; // Reset counter after showing dialogue
    }
    
    // Stop dimming when we reach the target (100% dimmed = 0% opacity)
    if (halloweenRecorderVisibility.currentOpacity <= 0.0) {
      stopHalloweenRecorderAutoDim();
      // No final sneaky message when fully dimmed - they're completely invisible now!
    }
  }, 1000); // Run every second
}

// Function to stop auto-dimming
function stopHalloweenRecorderAutoDim() {
  if (halloweenRecorderVisibility.dimInterval) {
    clearInterval(halloweenRecorderVisibility.dimInterval);
    halloweenRecorderVisibility.dimInterval = null;
  }
}

// Function to add click handlers to recorder images
function addHalloweenRecorderClickHandlers() {
  if (halloweenRecorderVisibility.clickHandlersAdded) return;
  
  // Add event listener using delegation to catch all current and future recorder images
  document.addEventListener('click', function(event) {
    if (event.target.tagName === 'IMG' && 
        (event.target.src.includes('recorder.png') || 
         event.target.src.includes('recorder speech.png') || 
         event.target.src.includes('recorder')) && 
        isHalloweenRecorderEasterEggActive()) {
      handleHalloweenRecorderClick(event);
    }
  });
  
  halloweenRecorderVisibility.clickHandlersAdded = true;
}

// Function to initialize Halloween Recorder easter egg
function initializeHalloweenRecorderEasterEgg() {
  if (!isHalloweenRecorderEasterEggActive()) {
    stopHalloweenRecorderAutoDim();
    halloweenRecorderVisibility.isActive = false;
    return;
  }
  
  if (!halloweenRecorderVisibility.isActive) {
    halloweenRecorderVisibility.isActive = true;
    halloweenRecorderVisibility.currentOpacity = 0.0; // Start at 100% dimmed (completely invisible)
    addHalloweenRecorderClickHandlers();
    updateHalloweenRecorderOpacity();
    startHalloweenRecorderAutoDim();
  }
}

// Function to cleanup Halloween Recorder easter egg
function cleanupHalloweenRecorderEasterEgg() {
  stopHalloweenRecorderAutoDim();
  halloweenRecorderVisibility.isActive = false;
  
  // Clear any active speech timeouts
  halloweenRecorderVisibility.speechTimeouts.forEach((timeoutId, element) => {
    clearTimeout(timeoutId);
    // Restore original text if we have it stored
    const originalText = halloweenRecorderVisibility.originalTexts.get(element);
    if (originalText !== undefined && element) {
      element.textContent = originalText;
    }
  });
  halloweenRecorderVisibility.speechTimeouts.clear();
  halloweenRecorderVisibility.originalTexts.clear();
  
  // Cleanup any active image switches
  cleanupRecorderImageSwitches();
  
  // Reset opacity of all recorder images (both normal and speech)
  const recorderImages = document.querySelectorAll('img[src*="recorder.png"], img[src*="recorder speech.png"], img[src*="recorder"]');
  recorderImages.forEach(img => {
    img.style.removeProperty('opacity');
    img.style.removeProperty('filter');
    img.style.transition = '';
  });
}

// Function to reset Halloween Recorder speech system (for debugging/corruption recovery)
function resetHalloweenRecorderSpeechSystem() {
  // Clear all active timeouts
  halloweenRecorderVisibility.speechTimeouts.forEach((timeoutId, element) => {
    clearTimeout(timeoutId);
  });
  halloweenRecorderVisibility.speechTimeouts.clear();
  halloweenRecorderVisibility.originalTexts.clear();
  
  // Reset all speech bubbles to empty/hidden state during Halloween Recorder mode
  if (isHalloweenRecorderEasterEggActive()) {
    const speechElements = [
      document.getElementById('swariaSpeech'),
      document.getElementById('prismSpeech'),
      document.getElementById('terrariumSpeechBubble'),
      document.getElementById('hardModeSwariaSpeech')
    ];
    
    speechElements.forEach(element => {
      if (element) {
        element.textContent = '';
        element.style.display = 'none';
      }
    });
  }
}

function resetPremiumState() {
  window.premiumState = {
    bijouUnlocked: false,
    bijouEnabled: false,
    vrchatMirrorUnlocked: false
  };
  updatePremiumUI();
}

function refreshPremiumState() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      try {
        const save = JSON.parse(slotData);
        if (save.premiumState) {
          Object.assign(window.premiumState, save.premiumState);
        } else {
          window.premiumState = {
            bijouUnlocked: false,
            bijouEnabled: false,
            vrchatMirrorUnlocked: false
          };
        }
      } catch (e) {

        window.premiumState = {
          bijouUnlocked: false,
          bijouEnabled: false,
          vrchatMirrorUnlocked: false
        };
      }
    } else {
      window.premiumState = {
        bijouUnlocked: false,
        bijouEnabled: false,
        vrchatMirrorUnlocked: false
      };
    }
  } else {
    const savedPremiumState = localStorage.getItem('premiumState');
    if (savedPremiumState) {
      try {
        const parsed = JSON.parse(savedPremiumState);
        Object.assign(window.premiumState, parsed);
      } catch (e) {

      }
    }
  }
  updatePremiumUI();
  updateBijouUIVisibility();
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updatePrismLabCharacterImage === 'function') {
    updatePrismLabCharacterImage();
  }
  if (typeof updateHardModeQuestCharacterImage === 'function') {
    updateHardModeQuestCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
}

// Force refresh boutique items
window.refreshBoutique = function() {
  if (window.boutique) {
    window.boutique.restockShop();
    window.boutique.updateBoutiqueUI();
  }
};

// Debug function to manually refresh premium UI
window.debugPremiumUI = function() {
  console.log('=== Premium State Debug ===');
  console.log('window.state?.unlockedFeatures?.bijou:', window.state?.unlockedFeatures?.bijou);
  console.log('window.premiumState?.bijouUnlocked:', window.premiumState?.bijouUnlocked);
  console.log('isBijouUnlocked():', isBijouUnlocked());
  console.log('window.isBijouUnlocked (global):', window.isBijouUnlocked?.());
  
  // Check merchant system
  if (window.boutique) {
    console.log('=== Merchant System Debug ===');
    const bijouItem = window.boutique.currentShopItems?.find(item => item.id === 'bijou');
    console.log('Bijou merchant item:', bijouItem);
    console.log('Bijou merchant isUnlocked result:', bijouItem?.isUnlocked?.());
    
    // Test the new isUnlocked logic manually
    console.log('Manual bijou unlock check:');
    console.log('  window.state.unlockedFeatures.bijou:', window.state?.unlockedFeatures?.bijou);
    console.log('  window.premiumState.bijouUnlocked:', window.premiumState?.bijouUnlocked);
    console.log('  typeof window.isBijouUnlocked:', typeof window.isBijouUnlocked);
    
    console.log('Forcing boutique restock to refresh items...');
    window.boutique.restockShop();
    console.log('Calling boutique.updateBoutiqueUI()...');
    window.boutique.updateBoutiqueUI();
    
    // Check again after restock
    const bijouItemAfter = window.boutique.currentShopItems?.find(item => item.id === 'bijou');
    console.log('Bijou item after restock:', bijouItemAfter?.isUnlocked?.());
  }
  
  updatePremiumUI();
};

let bijouUIElement = null;
let bijouCollectionQueue = [];
let bijouIsCollecting = false;
let bijouTalkingOverlay = null;
let bijouSpeechBubble = null;
let bijouSpeechTimeout = null;
const bijouDialogues = [
  "Oh! A token! Let me get that for you~",
  "Have you heard to never try entering the code 'Give me 1 million swa bucks'? It is bad. And fake.",
  "I'm such a helpful assistant, aren't I?",
  "Collecting tokens is my favorite pastime!",
  "Did you see that? I'm getting better at this!",
  "Sometimes I collect, sometimes I don't. It's all part of the fun!",
  "I hope you don't mind me helping out a little~",
  "These tokens are so sparkly and pretty!",
  "I'm getting quite good at this collection business!",
  "Oops! I missed that one. Maybe next time!",
  "I love being useful to you!",
  "Token collection is an art, you know!",
  "I'm your little helper, always ready to assist!",
  "Sometimes I'm lucky, sometimes I'm not. That's life!",
  "I wonder what kind of token that was...",
  "I'm getting faster at spotting these tokens!",
  "It's like a little treasure hunt every time!",
  "I hope I'm not being too greedy with the tokens~",
  "Every token I collect makes me feel accomplished!",
  "I'm learning to be more selective with my collection~",
  "The thrill of the chase is what makes it fun!",
  "Thats my token! I'll get it!",
  "Ever wonder where I got my magnet?",
  
];

// Bijou's concerned dialogue about hexed Peachy - only appears when Peachy is hexed
const bijouHexedPeachyDialogues = [
  "Hey... are you okay? You look different...",
  "Peachy, what happened to you? You have this strange aura around you...",
  "I'm really worried about you... that mark looks serious.",
  "Did someone curse you? Please tell me you're okay!",
  "Your appearance changed... is this permanent? I'm scared for you...",
  "I've never seen a mark like that before. Does it hurt?",
  "I wish I could help remove that mark... but I don't know how...",
  "You're still you, right? The mark didn't change who you are right?",
  "That aura around you... it's unnatural. I'm worried.",
  "Your eyes look different now... are you okay?",
  "I'm here for you, even with that scary mark on you.",
  "I can sense some dark magic on you... please tell me you're not in pain.",
  "I don't care what you look like, you're still my friend!"
];

// Bijou's challenge quotes - good at clicking but scared of color shifts
const bijouChallengeQuotes = [
  { text: "In Soap's challenge, I'm really good at clicking the red tiles quickly! But when the colors start changing... Nuh uh, that's where I draw the line.", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },

  // General challenge banter (explaining their strategy and fear)
  { text: "The Power Generator Challenge? I'm really good at the clicking part! My reflexes are super fast!", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "I love clicking the red tiles quickly! It's so satisfying! But then... the colors start changing after 20 seconds...", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "My strategy for the challenge: Click fast, stay focused, and try not to panic when the tiles shift colors!", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "I could probably get much better times if I wasn't so scared of the color changes... they're just so overwhelming!", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "The red tiles are easy to spot and click! But when they turn into different colors... I can't handle it and have to hide!", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "I'm like a clicking machine for the first part of the challenge! Until the colors start shifting and I get all confused...", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "The Power Generator Challenge tests my clicking skills perfectly! Too bad I'm terrified of the color shifts...", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "I wish the challenge just stayed with red tiles the whole time! I'm so fast at clicking those!", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "My clicking accuracy is amazing! My color shift tolerance? Not so much... that's where I always lose.", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "Everyone says I'm really good at the clicking part of the challenge! If only it didn't have those scary color changes...", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "I practice my clicking skills all the time! But no amount of practice helps with my fear of color shifting...", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  { text: "The moment those tiles start changing colors, I just want to hide! That's always when my run ends...", condition: () => window.state.characterChallengePBs?.bijou || window.state.powerChallengePersonalBest },
  
  // Token Challenge quotes - only appear if player has tried the Token Challenge
  { text: "Lepre's Token Challenge? Oh my, those spinning tokens are so shiny and mesmerizing! I could watch them all day!", condition: () => window.state.tokenChallengePB > 0 },
  { text: "I love the Token Challenge so much more than the Power Generator one! The tokens sparkle and there are no sudden color shifts!", condition: () => window.state.tokenChallengePB > 0 },
  { text: "Those spinning tokens are absolutely gorgeous! I get so distracted by how pretty they are that I sometimes forget I'm in the challenge!", condition: () => window.state.tokenChallengePB > 0 },
  { text: "Finally, a challenge where I don't have to worry about colors changing! No epilepsy triggers!", condition: () => window.state.tokenChallengePB > 0 },
  { text: "I wish I could decorate my workspace with those tokens I earned from the token challenge! They're so much prettier than Soap's power generator's tiles!", condition: () => window.state.tokenChallengePB > 0 },
  { text: "The Token Challenge is perfect for someone like me who loves shiny things but hates unpredictable color changes!", condition: () => window.state.tokenChallengePB > 0 },
];

// Bijou's dialogue when Kito mode is active - talking about/to Kito
const bijouKitoDialogues = [
  "Oh! Kito is here! Hi Kito~",
  "Kito seems really knowledgeable about this place! I should learn from them~",
  "I saw Kito chatting earlier. They seem really friendly!",
  "Hey Peachy, Kito mentioned something about surviving the terrarium memory leak... Do you know what they are talking about?",
  "I'm sure we're better than Kito at collecting tokens, right? Right?!",
  "Hey peachy, I heard Kito talking about Soap's battery situation... they are onto the conspiracy!",
  "Kito seems to know every little detail about this place. Scary!",
  "I should introduce myself to Kito properly! But they seem to know everything about me already.",
  "Hey Peachy, Kito mentioned they got over 600 seconds on the power generator challenge... they actually have a chance to beat lepre!",
  "I noticed Kito staring at your anomaly resolver earlier. What were they thinking about?",
  "Kito and I could probably work together really well! We both love helping out~",
  "Hey Peachy, I heard Kito talking about the rikkor workers being lazy... they notice everything!",
  "Kito seems to have strong opinions about how things work here. I respect that!",
  "Hey Peachy, I heard Kito mentioned something about my magnet... do you think they know my secret?",
  "Hey Peachy, I heard Kito mentioned they think I'm some sort of 'Pigeon Swaria'... what does that even mean?!",
  "Maybe Kito and I should compare our token collection strategies sometime?",
  "I saw Kito mention something about a conspiracy theory... about me being a pigeon Swaria? That sounds wild!",
  "Kito really cares about this place, you can tell by how much they talk about it!",
  "I wonder what Kito thinks about my magnet... they seem curious about everything!",
  "Kito mentioned they're better at managing resources than you Peachy... that's bold!",
  "Kito talks about me a lot... I heard them! How nice of them~",
  "I heard Kito saying I'm good at collecting tokens! That makes me so happy!",
  "Kito noticed I usually only collect 1 out of 5 tokens from bursts... they're onto me!",
  "Kito said they're trying to train me? That's so sweet of them!",
  "I appreciate that Kito acknowledges my dedication! Even if I prefer to be on your head...",
  "Kito wondering about my magnet is funny, it's a secret~",
  "Kito thinks we could make a great team! I agree, but I'm still staying on your head!",
  "Kito calling me 'focused' makes me feel professional!",
  "I'm glad Kito doesn't mind me being here too. We can both help out!",
  "Kito has a conspiracy theory about me being a pigeon Swaria... What am I supposed to say? I'm just a tiny Swaria!",
  "Kito suggesting we coordinate our efforts sounds like a great idea!",
  "Kito noticed I get excited about shiny tokens! They really pay attention~",
  "Kito caught me being greedy with tokens... okay maybe they have a point there...",
  "I wonder what Kito would think if they knew how much I love nesting on your head?",
  "Kito respecting my dedication to being helpful means a lot to me!",
  "Hey Peachy, have you noticed that one strange token Kito has, it looks like some honey token, it looks completly out of this world, how did they get this? I'm curious.",
  "Hey Peachy, have you noticed that Tico and Kito's names are so similar, could this be another conspiracy?",
];

// Function to get Bijou's challenge quotes for external access
function getBijouChallengeQuotes() {
  return bijouChallengeQuotes;
}

function initBijouUI() {
  if (!window.state.unlockedFeatures?.bijou || !window.state.bijouActive) {
    removeBijouUI();
    return;
  }
  if (!bijouUIElement) {
    bijouUIElement = document.createElement('div');
    bijouUIElement.id = 'bijouUI';
    const isFloor2 = window.currentFloor === 2;
    const bottomPosition = isFloor2 ? '20px' : '80px';
    bijouUIElement.style.cssText = `
      position: fixed;
      bottom: ${bottomPosition};
      right: 0px;
      width: 300px;
      height: 300px;
      z-index: 1;
      pointer-events: auto;
      transition: transform 0.3s ease, bottom 0.3s ease;
      cursor: pointer;
    `;
    const bijouImg = document.createElement('img');
    bijouImg.src = 'assets/icons/bijou.png';
    bijouImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;
    bijouImg.id = 'bijouImage';
    bijouUIElement.appendChild(bijouImg);
    document.body.appendChild(bijouUIElement);
    bijouUIElement.addEventListener('click', triggerBijouDialogue);
  } else {
    const isFloor2 = window.currentFloor === 2;
    const bottomPosition = isFloor2 ? '20px' : '80px';
    bijouUIElement.style.bottom = bottomPosition;
  }
  bijouUIElement.style.display = 'block';
}

function removeBijouUI() {
  if (bijouUIElement) {
    bijouUIElement.style.display = 'none';
  }
  if (bijouTalkingOverlay) {
    bijouTalkingOverlay.remove();
    bijouTalkingOverlay = null;
  }
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
    bijouSpeechBubble = null;
  }
  if (bijouSpeechTimeout) {
    clearTimeout(bijouSpeechTimeout);
    bijouSpeechTimeout = null;
  }
}

function updateBijouUIVisibility() {
  if (window.state.unlockedFeatures?.bijou && window.state.bijouActive) {
    initBijouUI();
  } else {
    removeBijouUI();
  }
}

function checkBijouCollection(token) {
  if (!window.state.unlockedFeatures?.bijou || !window.state.bijouActive) {
    return false;
  }
  if (token.dataset.bijouChecked === 'true') {
    return false;
  }
  token.dataset.bijouChecked = 'true';
  setTimeout(() => {
    if (token.dataset.collected === 'true') return; 
    const randomValue = Math.random(); // Keep for probability, but could use Decimal for game mechanics
    if (randomValue < 0.50) { // 50% collection chance
      bijouCollectToken(token);
    } else {
    }
  }, 1000);
}

function bijouCollectToken(token) {
  if (token.dataset.collected === 'true') return; 
  token.dataset.collected = 'true';
  bijouCollectionQueue.push(token);
  if (!bijouIsCollecting) {
    processBijouCollectionQueue();
  }
}

function processBijouCollectionQueue() {
  if (bijouCollectionQueue.length === 0) {
    bijouIsCollecting = false;
    return;
  }
  bijouIsCollecting = true;
  const token = bijouCollectionQueue.shift();
  if (!token || token.dataset.collected !== 'true') {
    processBijouCollectionQueue();
    return;
  }
  const bijouImg = document.getElementById('bijouImage');
  if (bijouImg) {
    bijouImg.src = 'assets/icons/bijou action.png';
  }
  const bijouRect = bijouUIElement ? bijouUIElement.getBoundingClientRect() : null;
  if (!bijouRect) {
    processBijouCollectionQueue();
    return;
  }
  const tokenRect = token.getBoundingClientRect();
  const startX = tokenRect.left + tokenRect.width / 2;
  const startY = tokenRect.top + tokenRect.height / 2;
  const endX = bijouRect.left + bijouRect.width / 2;
  const endY = bijouRect.top + bijouRect.height / 2;
  const distance = new Decimal(endX - startX).pow(2).add(new Decimal(endY - startY).pow(2)).sqrt();
  const duration = Decimal.max(500, Decimal.min(1500, distance.mul(2))).toNumber(); 
  token.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  token.style.zIndex = '1001'; 
  requestAnimationFrame(() => {
    token.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.3)`;
    token.style.opacity = '0.7';
  });
  setTimeout(() => {
    const tokenType = token.dataset.type;
    if (tokenType) {
      if (typeof window.collectIngredientToken === 'function') {
        window.collectIngredientToken(tokenType, token);
      } else if (typeof collectIngredientToken === 'function') {
        collectIngredientToken(tokenType, token);
      } else {
        collectTokenManually(tokenType, token);
      }
    } else {
      token.remove();
    }
    const bijouImg = document.getElementById('bijouImage');
    if (bijouImg) {
      bijouImg.src = 'assets/icons/bijou.png';
    }
    setTimeout(() => {
      processBijouCollectionQueue();
    }, 200); 
  }, duration);
}

function collectTokenManually(type, token) {
  if (!window.kitchenIngredients) window.kitchenIngredients = {};
  
  // Calculate token gain amount with green stable light buff
  let tokenGainAmount = new Decimal(1);
  if (typeof applyGreenStableLightBuff === 'function') {
    tokenGainAmount = applyGreenStableLightBuff(tokenGainAmount);
  }
  
  let collectedResources = {};
  
  if (type === 'swabucks') {
    if (!window.state) window.state = {};
    if (!window.state.swabucks) window.state.swabucks = new Decimal(0);
    window.state.swabucks = new Decimal(window.state.swabucks).add(tokenGainAmount);
    collectedResources.swabucks = tokenGainAmount;
    // Note: Save will be handled by regular save system, not on every token collection
  } else {
    // Add to window.state.tokens instead of kitchenIngredients
    if (!window.state) window.state = {};
    if (!window.state.tokens) window.state.tokens = {};
    if (!window.state.tokens[type]) {
      window.state.tokens[type] = new Decimal(0);
    }
    window.state.tokens[type] = new Decimal(window.state.tokens[type]).add(tokenGainAmount);
    
    // Also update legacy kitchenIngredients for backward compatibility
    window.kitchenIngredients[type] = new Decimal(window.kitchenIngredients[type] || 0).add(tokenGainAmount);
    
    collectedResources[type] = tokenGainAmount;
    if (typeof updateKitchenUI === 'function') updateKitchenUI();
  }
  
  showIngredientGainPopup(token, tokenGainAmount);
  
  // Use TokenCleanupSystem for proper cleanup
  if (window.TokenCleanupSystem) {
    // Find bijou queue data for this token
    const queueData = window.bijouCollectionQueue ? 
      window.bijouCollectionQueue.find(item => item.element === token || item === token) : {};
    
    window.TokenCleanupSystem.cleanupCollectedToken(token, {type: 'bijou', ...queueData}, collectedResources);
  } else {
    // Fallback cleanup for compatibility
    token.style.transform += ' scale(0.2)';
    token.style.opacity = '0';
    setTimeout(() => token.remove(), 400);
  }
}

function showIngredientGainPopup(token, amount) {
  const popup = document.createElement('div');
  // Format the amount - if it's exactly 1, show +1, otherwise show the decimal value
  const amountText = amount && amount.eq && amount.eq(1) ? '+1' : `+${amount.toFixed(1)}`;
  popup.textContent = amountText;
  popup.className = 'ingredient-gain-popup';
  popup.style.position = 'fixed';
  popup.style.left = token.style.left;
  popup.style.top = token.style.top;
  popup.style.zIndex = 100000;
  popup.style.fontWeight = 'bold';
  popup.style.fontSize = '1.3em';
  popup.style.color = '#3cf';
  popup.style.pointerEvents = 'none';
  popup.style.transition = 'transform 0.7s cubic-bezier(.4,2,.6,1), opacity 0.7s';
  popup.style.transform = 'translateY(0)';
  popup.style.opacity = '1';
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.transform = 'translateY(-40px)';
    popup.style.opacity = '0';
  }, 10);
  setTimeout(() => popup.remove(), 800);
}

function hookIntoTokenSpawning() {
  const originalSpawnIngredientToken = window.spawnIngredientToken;
  if (originalSpawnIngredientToken) {
    window.spawnIngredientToken = function(context, sourceElement) {
      const result = originalSpawnIngredientToken.call(this, context, sourceElement);
      setTimeout(() => {
        const tokens = document.querySelectorAll('.ingredient-token');
        const latestToken = tokens[tokens.length - 1];
        if (latestToken && !latestToken.dataset.bijouChecked) {
          if (!latestToken.dataset.spawnTime) {
            latestToken.dataset.spawnTime = Date.now().toString();
          }
          checkBijouCollection(latestToken);
        }
      }, 100); 
      return result;
    };
  }
  if (typeof window.collectIngredientToken === 'undefined') {
    if (typeof collectIngredientToken === 'function') {
      window.collectIngredientToken = collectIngredientToken;
    }
  }
}

function triggerBijouDialogue() {
  if (bijouSpeechTimeout) {
    clearTimeout(bijouSpeechTimeout);
  }
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
    bijouSpeechBubble = null;
  }
  showBijouTalkingOverlay();
  
  let randomDialogue;
  
  // Check if Kito mode is active - 50% chance for Kito-specific dialogue
  const isKitoModeActive = window.state && window.state.kitoModeActive;
  
  // Check if Peachy is hexed - 40% chance for hex concern dialogue if hexed
  const isPeachyHexed = window.state && 
                        window.state.halloweenEvent && 
                        window.state.halloweenEvent.jadeca && 
                        window.state.halloweenEvent.jadeca.peachyIsHexed;
  
  if (isKitoModeActive && Math.random() < 0.50) {
    // Show Kito-specific dialogue
    randomDialogue = bijouKitoDialogues[Math.floor(Math.random() * bijouKitoDialogues.length)];
  } else if (isPeachyHexed && Math.random() < 0.40) {
    // Show concerned dialogue about hexed Peachy
    randomDialogue = bijouHexedPeachyDialogues[Math.floor(Math.random() * bijouHexedPeachyDialogues.length)];
  }
  // 15% chance for challenge quotes (only if quest 5 is completed to unlock the challenge)
  else {
    const questCompleted = window.state?.questSystem?.completedQuests?.includes('soap_quest_5') || false;
    if (questCompleted && Math.random() < 0.15) {
      // Ensure character PBs exist
      if (typeof window.ensureCharacterPBsExist === 'function') {
        window.ensureCharacterPBsExist();
      }
      
      // Filter challenge speeches by their conditions
      const availableChallengeSpeeches = bijouChallengeQuotes.filter(speech => {
        return speech.condition ? speech.condition() : true;
      });
      
      if (availableChallengeSpeeches.length > 0) {
        const randomChallengeSpeech = availableChallengeSpeeches[Math.floor(Math.random() * availableChallengeSpeeches.length)];
        randomDialogue = typeof randomChallengeSpeech.text === 'function' ? randomChallengeSpeech.text() : randomChallengeSpeech.text;
      } else {
        // Fallback to regular dialogue if no challenge speeches are available
        randomDialogue = bijouDialogues[Math.floor(Math.random() * bijouDialogues.length)];
      }
    } else {
      // Use regular dialogue
      randomDialogue = bijouDialogues[Math.floor(Math.random() * bijouDialogues.length)];
    }
  }
  
  createBijouSpeechBubble(randomDialogue);
  bijouSpeechTimeout = setTimeout(() => {
    hideBijouTalkingOverlay();
    if (bijouSpeechBubble) {
      bijouSpeechBubble.remove();
      bijouSpeechBubble = null;
    }
  }, 5000);
}

function showBijouTalkingOverlay() {
  if (!bijouUIElement) return;
  if (bijouTalkingOverlay) {
    bijouTalkingOverlay.remove();
  }
  bijouTalkingOverlay = document.createElement('img');
  bijouTalkingOverlay.src = 'assets/icons/bijou talking.png';
  bijouTalkingOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  `;
  bijouUIElement.appendChild(bijouTalkingOverlay);
}

function hideBijouTalkingOverlay() {
  if (bijouTalkingOverlay) {
    bijouTalkingOverlay.remove();
    bijouTalkingOverlay = null;
  }
}

// Special function to show custom Bijou message with automatic cleanup
function showBijouCustomMessage(message, duration = 5000) {
  // Clear any existing timeout and speech
  if (bijouSpeechTimeout) {
    clearTimeout(bijouSpeechTimeout);
    bijouSpeechTimeout = null;
  }
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
    bijouSpeechBubble = null;
  }
  
  // Show talking overlay
  showBijouTalkingOverlay();
  
  // Create speech bubble
  createBijouSpeechBubble(message);
  
  // Auto cleanup after duration
  bijouSpeechTimeout = setTimeout(() => {
    hideBijouTalkingOverlay();
    if (bijouSpeechBubble) {
      bijouSpeechBubble.remove();
      bijouSpeechBubble = null;
    }
    bijouSpeechTimeout = null;
  }, duration);
}

function createBijouSpeechBubble(text) {
  if (!bijouUIElement) return;
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
  }
  bijouSpeechBubble = document.createElement('div');
  const isFloor2 = window.currentFloor === 2;
  const bottomPosition = isFloor2 ? '260px' : '320px';
  bijouSpeechBubble.style.cssText = `
    position: fixed;
    bottom: ${bottomPosition};
    right: 160px;
    max-width: 250px;
    background: white;
    border-radius: 15px;
    padding: 10px 15px;
    font-size: 14px;
    line-height: 1.4;
    color: #333;
    z-index: 1001;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    word-wrap: break-word;
    animation: speechBubbleAppear 0.3s ease-out;
  `;
  const arrow = document.createElement('div');
  arrow.style.cssText = `
    position: absolute;
    bottom: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid white;
  `;
  const arrowBorder = document.createElement('div');
  arrowBorder.style.cssText = `
    position: absolute;
    bottom: -12px;
    right: 18px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid #333;
    z-index: -1;
  `;
  bijouSpeechBubble.appendChild(arrowBorder);
  bijouSpeechBubble.appendChild(arrow);
  bijouSpeechBubble.appendChild(document.createTextNode(text));
  document.body.appendChild(bijouSpeechBubble);
}

function addSpeechBubbleCSS() {
  if (document.getElementById('bijouSpeechBubbleCSS')) return;
  const style = document.createElement('style');
  style.id = 'bijouSpeechBubbleCSS';
  style.textContent = `
    @keyframes speechBubbleAppear {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initPremiumSystem, 100);
});


window.addEventListener('load', function() {
  setTimeout(() => {
    if (typeof initPremiumSystem === 'function') {
      initPremiumSystem();
    }
    // Update Halloween event state on load
    if (typeof updateHalloweenEventState === 'function') {
      updateHalloweenEventState();
    }
  }, 500);
});


const originalShowPage = window.showPage;
window.showPage = function(pageId) {
  if (originalShowPage) {
    originalShowPage.apply(this, arguments);
  }
  if (pageId === 'settings' && typeof updatePremiumUI === 'function') {
    setTimeout(updatePremiumUI, 100);
  }
  
  // Ensure KitoFox hardcore overlay state is correct on any page change
  setTimeout(ensureKitoFoxOverlayState, 100);
};
window.premiumSystem = {
  initPremiumSystem,
  // Save function removed - now managed by main save system
  updatePremiumUI,
  buyBijou,
  buyVrchatMirror,
  toggleBijou,
  toggleRecorderMode,
  updateRecorderModeImages,
  updateRecorderModeToggleUI,
  isBijouActive,
  getBijouStatus,
  resetPremiumState,
  refreshPremiumState,
  updateBijouUIVisibility,
  initBijouUI,
  removeBijouUI,
  checkBijouCollection,
  bijouCollectToken,
  processBijouCollectionQueue,
  hookIntoTokenSpawning,
  collectTokenManually,
  showIngredientGainPopup,
  triggerBijouDialogue,
  showBijouTalkingOverlay,
  hideBijouTalkingOverlay,
  createBijouSpeechBubble,
  showBijouCustomMessage,
  addSpeechBubbleCSS,
  getBijouChallengeQuotes
};

// Make getBijouChallengeQuotes globally accessible
window.getBijouChallengeQuotes = getBijouChallengeQuotes;

// Function to get appropriate quotes based on active modes
function getAppropriateQuotes() {
  // Prevent random speech when Halloween Recorder is auto-dimming
  if (isHalloweenRecorderEasterEggActive() && 
      halloweenRecorderVisibility.dimInterval !== null) {
    return []; // Return empty array to prevent any random speech
  }
  
  if (window.state && window.state.kitoFoxModeActive && window.state.kitoModeActive) {
    // Both KitoFox and Kito modes active: combine both quote arrays
    return [...kitoQuotes, ...kitoFoxQuotes];
  } else if (window.state && window.state.kitoFoxModeActive && Math.random() < 0.25) {
    // 25% chance to use KitoFox quotes when KitoFox mode is active (takes priority over other modes)
    return kitoFoxQuotes;
  } else if (window.state && window.state.kitoModeActive) {
    // Always use Kito quotes when Kito mode is active
    return kitoQuotes;
  } else if (window.state && window.state.recorderModeActive && window.state.halloweenEventActive) {
    // Halloween + Recorder combination: 50% chance for spooky Halloween recorder quotes, 50% chance for normal recorder quotes
    if (Math.random() < 0.5) {
      return halloweenRecorderQuotes;
    } else {
      return recorderQuotes;
    }
  } else if (window.state && window.state.recorderModeActive && Math.random() < 0.75) {
    // 75% chance to use recorder quotes when only recorder mode is active (and KitoFox is not active or failed its roll)
    return recorderQuotes;
  } else {
    // Use normal swaria quotes (25% chance for KitoFox mode, 25% chance for recorder mode, 100% when no modes active)
    return window.swariaQuotes || [];
  }
}

// Debug function to test the speech system
function testRecorderSpeech() {
  if (window.showSwariaSpeech) {
    window.showSwariaSpeech();
  } else {
  }
}

// KitoFox Hardcore Overlay Functions
function showKitoFoxHardcoreOverlay() {
  // Remove existing overlay if any
  removeKitoFoxHardcoreOverlay();
  
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'kitoFoxHardcoreOverlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 99998 !important;
    opacity: 0.8 !important;
  `;
  
  // Create top border
  const topBorder = document.createElement('div');
  topBorder.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 8px !important;
    background: linear-gradient(180deg, 
      rgba(220, 20, 20, 0.9) 0%, 
      rgba(150, 10, 10, 0.7) 50%, 
      rgba(80, 5, 5, 0.3) 100%) !important;
    box-shadow: 0 2px 15px rgba(220, 20, 20, 0.6) !important;
    animation: hardcoreTopPulse 3s ease-in-out infinite alternate !important;
  `;
  
  // Create bottom border
  const bottomBorder = document.createElement('div');
  bottomBorder.style.cssText = `
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 8px !important;
    background: linear-gradle(0deg, 
      rgba(220, 20, 20, 0.9) 0%, 
      rgba(150, 10, 10, 0.7) 50%, 
      rgba(80, 5, 5, 0.3) 100%) !important;
    box-shadow: 0 -2px 15px rgba(220, 20, 20, 0.6) !important;
    animation: hardcoreBottomPulse 3s ease-in-out infinite alternate !important;
  `;
  
  // Create left border
  const leftBorder = document.createElement('div');
  leftBorder.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 8px !important;
    height: 100% !important;
    background: linear-gradient(90deg, 
      rgba(220, 20, 20, 0.9) 0%, 
      rgba(150, 10, 10, 0.7) 50%, 
      rgba(80, 5, 5, 0.3) 100%) !important;
    box-shadow: 2px 0 15px rgba(220, 20, 20, 0.6) !important;
    animation: hardcoreLeftPulse 3.5s ease-in-out infinite alternate !important;
  `;
  
  // Create right border
  const rightBorder = document.createElement('div');
  rightBorder.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    width: 8px !important;
    height: 100% !important;
    background: linear-gradient(270deg, 
      rgba(220, 20, 20, 0.9) 0%, 
      rgba(150, 10, 10, 0.7) 50%, 
      rgba(80, 5, 5, 0.3) 100%) !important;
    box-shadow: -2px 0 15px rgba(220, 20, 20, 0.6) !important;
    animation: hardcoreRightPulse 3.5s ease-in-out infinite alternate !important;
  `;
  
  // Create corner danger indicators
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  corners.forEach(corner => {
    const cornerElement = document.createElement('div');
    const [vPos, hPos] = corner.split('-');
    cornerElement.style.cssText = `
      position: absolute !important;
      ${vPos}: 0 !important;
      ${hPos}: 0 !important;
      width: 30px !important;
      height: 30px !important;
      background: radial-gradient(circle, 
        rgba(255, 50, 50, 0.9) 0%, 
        rgba(200, 20, 20, 0.6) 60%, 
        transparent 100%) !important;
      animation: hardcoreCornerFlash 2s ease-in-out infinite !important;
    `;
    overlay.appendChild(cornerElement);
  });
  
  // Append all borders to overlay
  overlay.appendChild(topBorder);
  overlay.appendChild(bottomBorder);
  overlay.appendChild(leftBorder);
  overlay.appendChild(rightBorder);
  
  // Add CSS animations
  addHardcoreOverlayStyles();
  
  // Append to body
  document.body.appendChild(overlay);
}

function removeKitoFoxHardcoreOverlay() {
  const overlay = document.getElementById('kitoFoxHardcoreOverlay');
  if (overlay) {
    overlay.remove();
  }
}

function addHardcoreOverlayStyles() {
  // Check if styles already exist
  if (document.getElementById('kitoFoxHardcoreStyles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'kitoFoxHardcoreStyles';
  style.textContent = `
    @keyframes hardcoreTopPulse {
      0% { 
        background: linear-gradient(180deg, rgba(220, 20, 20, 0.9) 0%, rgba(150, 10, 10, 0.7) 50%, rgba(80, 5, 5, 0.3) 100%);
        box-shadow: 0 2px 15px rgba(220, 20, 20, 0.6);
      }
      100% { 
        background: linear-gradient(180deg, rgba(255, 40, 40, 1) 0%, rgba(200, 25, 25, 0.9) 50%, rgba(120, 15, 15, 0.5) 100%);
        box-shadow: 0 2px 25px rgba(255, 40, 40, 0.8);
      }
    }
    
    @keyframes hardcoreBottomPulse {
      0% { 
        background: linear-gradient(0deg, rgba(220, 20, 20, 0.9) 0%, rgba(150, 10, 10, 0.7) 50%, rgba(80, 5, 5, 0.3) 100%);
        box-shadow: 0 -2px 15px rgba(220, 20, 20, 0.6);
      }
      100% { 
        background: linear-gradient(0deg, rgba(255, 40, 40, 1) 0%, rgba(200, 25, 25, 0.9) 50%, rgba(120, 15, 15, 0.5) 100%);
        box-shadow: 0 -2px 25px rgba(255, 40, 40, 0.8);
      }
    }
    
    @keyframes hardcoreLeftPulse {
      0% { 
        background: linear-gradient(90deg, rgba(220, 20, 20, 0.9) 0%, rgba(150, 10, 10, 0.7) 50%, rgba(80, 5, 5, 0.3) 100%);
        box-shadow: 2px 0 15px rgba(220, 20, 20, 0.6);
      }
      100% { 
        background: linear-gradient(90deg, rgba(255, 40, 40, 1) 0%, rgba(200, 25, 25, 0.9) 50%, rgba(120, 15, 15, 0.5) 100%);
        box-shadow: 2px 0 25px rgba(255, 40, 40, 0.8);
      }
    }
    
    @keyframes hardcoreRightPulse {
      0% { 
        background: linear-gradient(270deg, rgba(220, 20, 20, 0.9) 0%, rgba(150, 10, 10, 0.7) 50%, rgba(80, 5, 5, 0.3) 100%);
        box-shadow: -2px 0 15px rgba(220, 20, 20, 0.6);
      }
      100% { 
        background: linear-gradient(270deg, rgba(255, 40, 40, 1) 0%, rgba(200, 25, 25, 0.9) 50%, rgba(120, 15, 15, 0.5) 100%);
        box-shadow: -2px 0 25px rgba(255, 40, 40, 0.8);
      }
    }
    
    @keyframes hardcoreCornerFlash {
      0%, 70% { opacity: 0.3; }
      85% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
}

function ensureKitoFoxOverlayState() {
  // Check if KitoFox mode is active and overlay should be shown
  if (window.state && window.state.kitoFoxModeActive) {
    const existingOverlay = document.getElementById('kitoFoxHardcoreOverlay');
    if (!existingOverlay) {
      // Overlay is missing but should be there - show it
      showKitoFoxHardcoreOverlay();
    }
    
    // Ensure captcha system is running
    if (!kitoFoxCaptchaInterval) {
      startKitoFoxCaptchaSystem();
    }
  } else {
    // KitoFox mode is not active - ensure overlay is removed
    const existingOverlay = document.getElementById('kitoFoxHardcoreOverlay');
    if (existingOverlay) {
      removeKitoFoxHardcoreOverlay();
    }
    
    // Ensure captcha system is stopped
    if (kitoFoxCaptchaInterval) {
      stopKitoFoxCaptchaSystem();
    }
  }
}

// KitoFox Captcha System
let kitoFoxCaptchaInterval = null;
let kitoFoxCaptchaActive = false;

const kitoFoxCaptchaWords = [
  "FLUFF", "SWARIA", "HARDCORE", "EXTREME", "SWAWESOME", "TOKENS", "ELITE", "KITO",
  "UNREAL", "SWABUCKS", "GENERATOR", "POWER", "PRISM", "FLOWERING", "MASTER", "THATRANDOMRECORDINGSOFTWARE",
  "PEACHES", "DEDICATION", "PERSISTENCE", "SWA", "MUSHROOM", "BIJOU",
  "FEATHERS", "ARTIFACTS", "MYTHIC", "LEGENDARY", "PREMIUM", "LIGHT", "MIRROR", "ILOVEWATER", "BOOSTERINO",
  "PRISMA", "DARKNESS", "DANGER", "CHARGER", "FUN", "CHEATS", "STUPIDCAPTCHA"
];

// World's longest words for refresh penalty captcha
const kitoFoxLongestWords = [
  "PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOISS", // 45 letters - longest English word
  "SUPERCALIFRAGILISTICEXPIALIDOCIOUS", // 34 letters - Mary Poppins
  "HIPPOPOTOMONSTROSESQUIPPEDALIOPHOBIA", // 36 letters - fear of long words
  "ANTIDISESTABLISHMENTARIANISM", // 28 letters
  "FLOCCINAUCINIHILIPILIFICATION", // 29 letters
  "PSEUDOPSEUDOHYPOPARATHYROIDISM", // 30 letters
  "DICHLORODIFLUOROMETHANE", // 23 letters
  "ELECTROENCEPHALOGRAPH", // 21 letters
  "OTORHINOLARYNGOLOGY", // 19 letters
  "RADIOIMMUNOELECTROPHORESIS", // 26 letters
  "IMMUNOELECTROPHORESIS", // 21 letters
  "SPECTROPHOTOMETRICALLY", // 22 letters
  "TETRAIODOPHENOLPHTHALEIN", // 24 letters
  "HEPATICOCHOLANGIOGASTROSTOMY", // 28 letters
  "PSYCHONEUROENDOCRINOLOGY", // 24 letters
];

const kitoFoxTokenTypes = [
  { type: 'berry', weight: 20 },
  { type: 'mushroom', weight: 20 },
  { type: 'spark', weight: 20 },
  { type: 'prismashard', weight: 15 },
  { type: 'water', weight: 15 },
  { type: 'petal', weight: 8 },
  { type: 'swabucks', weight: 2 }
];

// Refresh detection system
function setupCaptchaRefreshDetection() {
  // Save captcha state to localStorage when active
  window.addEventListener('beforeunload', function() {
    if (kitoFoxCaptchaActive && window.state && window.state.kitoFoxModeActive) {
      localStorage.setItem('kitoFoxCaptchaPendingRefresh', 'true');
      localStorage.setItem('kitoFoxCaptchaPendingRefreshTime', Date.now().toString());
    }
  });
  
  // Check for pending refresh captcha on page load
  if (localStorage.getItem('kitoFoxCaptchaPendingRefresh') === 'true') {
    const refreshTime = parseInt(localStorage.getItem('kitoFoxCaptchaPendingRefreshTime'));
    const currentTime = Date.now();
    
    // If refresh happened within 10 seconds and KitoFox mode is active
    if (currentTime - refreshTime < 10000 && window.state && window.state.kitoFoxModeActive) {
      // Clear the refresh flags
      localStorage.removeItem('kitoFoxCaptchaPendingRefresh');
      localStorage.removeItem('kitoFoxCaptchaPendingRefreshTime');
      
      // Show the punishment captcha after a short delay
      setTimeout(() => {
        showKitoFoxRefreshPunishmentCaptcha();
      }, 1000);
    } else {
      // Clean up old flags
      localStorage.removeItem('kitoFoxCaptchaPendingRefresh');
      localStorage.removeItem('kitoFoxCaptchaPendingRefreshTime');
    }
  }
}

function startKitoFoxCaptchaSystem() {
  if (kitoFoxCaptchaInterval) {
    clearInterval(kitoFoxCaptchaInterval);
  }
  
  // Check every 3 minutes (180,000 ms)
  kitoFoxCaptchaInterval = setInterval(() => {
    if (window.state && window.state.kitoFoxModeActive && !kitoFoxCaptchaActive) {
      // 50% chance to show captcha
      if (Math.random() < 0.5) {
        showKitoFoxCaptcha();
      }
    }
  }, 180000);
}

function stopKitoFoxCaptchaSystem() {
  if (kitoFoxCaptchaInterval) {
    clearInterval(kitoFoxCaptchaInterval);
    kitoFoxCaptchaInterval = null;
  }
  removeKitoFoxCaptcha();
}

function showKitoFoxCaptcha() {
  if (kitoFoxCaptchaActive) return;
  
  kitoFoxCaptchaActive = true;
  
  // Select random word
  const selectedWord = kitoFoxCaptchaWords[Math.floor(Math.random() * kitoFoxCaptchaWords.length)];
  
  // Create overlay that blocks all interaction
  const overlay = document.createElement('div');
  overlay.id = 'kitoFoxCaptchaOverlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.8) !important;
    z-index: 99999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    animation: kitoFoxCaptchaFadeIn 0.3s ease-out !important;
  `;
  
  // Create popup container
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: linear-gradient(135deg, #ff4444, #cc2222) !important;
    border: 3px solid #fff !important;
    border-radius: 15px !important;
    padding: 30px !important;
    max-width: 500px !important;
    width: 90% !important;
    text-align: center !important;
    box-shadow: 0 0 30px rgba(255, 68, 68, 0.5) !important;
    color: white !important;
    font-family: Arial, sans-serif !important;
    animation: kitoFoxCaptchaPopIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  `;
  
  // Create title
  const title = document.createElement('h2');
  title.textContent = 'YOU JUST GOT CAPTCHAD!';
  title.style.cssText = `
    margin: 0 0 20px 0 !important;
    font-size: 28px !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
    color: #fff !important;
  `;
  
  // Create prompt
  const prompt = document.createElement('p');
  prompt.textContent = `Type the word below to prove you're not a robot:`;
  prompt.style.cssText = `
    margin: 0 0 15px 0 !important;
    font-size: 16px !important;
    color: #ffcccc !important;
  `;
  
  // Create word display
  const wordDisplay = document.createElement('div');
  wordDisplay.textContent = selectedWord;
  wordDisplay.style.cssText = `
    font-size: 32px !important;
    font-weight: bold !important;
    background: rgba(255,255,255,0.2) !important;
    padding: 15px !important;
    border-radius: 8px !important;
    margin: 0 0 20px 0 !important;
    letter-spacing: 3px !important;
    border: 2px solid rgba(255,255,255,0.3) !important;
    color: #fff !important;
  `;
  
  // Create input field
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type the word here...';
  input.style.cssText = `
    width: 100% !important;
    padding: 15px !important;
    font-size: 18px !important;
    border: 2px solid #fff !important;
    border-radius: 8px !important;
    margin: 0 0 20px 0 !important;
    text-align: center !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    background: rgba(255,255,255,0.9) !important;
    color: #333 !important;
    box-sizing: border-box !important;
  `;
  
  // Create submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'SUBMIT';
  submitBtn.style.cssText = `
    background: #fff !important;
    color: #cc2222 !important;
    border: none !important;
    padding: 12px 30px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  `;
  
  // Add hover effects
  submitBtn.onmouseenter = () => {
    submitBtn.style.background = '#f0f0f0 !important';
    submitBtn.style.transform = 'scale(1.05) !important';
  };
  submitBtn.onmouseleave = () => {
    submitBtn.style.background = '#fff !important';
    submitBtn.style.transform = 'scale(1) !important';
  };
  
  // Handle submission
  const handleSubmit = () => {
    const userInput = input.value.trim().toUpperCase();
    if (userInput === selectedWord) {
      // Correct! Award token
      awardKitoFoxCaptchaToken();
      removeKitoFoxCaptcha();
    } else {
      // Wrong answer - shake the popup
      popup.style.animation = 'kitoFoxCaptchaShake 0.5s ease-in-out';
      input.style.background = 'rgba(255,100,100,0.9) !important';
      input.style.borderColor = '#ff0000 !important';
      
      setTimeout(() => {
        popup.style.animation = '';
        input.style.background = 'rgba(255,255,255,0.9) !important';
        input.style.borderColor = '#fff !important';
        input.focus();
      }, 500);
    }
  };
  
  // Event listeners
  submitBtn.onclick = handleSubmit;
  
  input.onkeypress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // Assemble popup
  popup.appendChild(title);
  popup.appendChild(prompt);
  popup.appendChild(wordDisplay);
  popup.appendChild(input);
  popup.appendChild(submitBtn);
  overlay.appendChild(popup);
  
  // Add CSS animations
  addKitoFoxCaptchaStyles();
  
  // Add to page
  document.body.appendChild(overlay);
  
  // Focus input
  setTimeout(() => input.focus(), 100);
}

function showKitoFoxRefreshPunishmentCaptcha() {
  if (kitoFoxCaptchaActive) return;
  
  kitoFoxCaptchaActive = true;
  
  // Select random longest word
  const selectedWord = kitoFoxLongestWords[Math.floor(Math.random() * kitoFoxLongestWords.length)];
  
  // Create overlay that blocks all interaction
  const overlay = document.createElement('div');
  overlay.id = 'kitoFoxCaptchaOverlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.9) !important;
    z-index: 99999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    animation: kitoFoxCaptchaFadeIn 0.3s ease-out !important;
  `;
  
  // Create popup container (slightly larger for longer words)
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: linear-gradient(135deg, #cc0000, #880000) !important;
    border: 3px solid #fff !important;
    border-radius: 15px !important;
    padding: 30px !important;
    max-width: 600px !important;
    width: 95% !important;
    text-align: center !important;
    box-shadow: 0 0 40px rgba(204, 0, 0, 0.8) !important;
    color: white !important;
    font-family: Arial, sans-serif !important;
    animation: kitoFoxCaptchaPopIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
  `;
  
  // Create title (punishment message)
  const title = document.createElement('h2');
  title.textContent = 'CAPTCHA FOR REFRESHER SCUMBAGS';
  title.style.cssText = `
    margin: 0 0 20px 0 !important;
    font-size: 26px !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
    color: #fff !important;
    animation: kitoFoxTitlePulse 2s ease-in-out infinite !important;
  `;
  
  // Create prompt
  const prompt = document.createElement('p');
  prompt.textContent = `You tried to refresh during a captcha! Now type this LONG word correctly:`;
  prompt.style.cssText = `
    margin: 0 0 15px 0 !important;
    font-size: 16px !important;
    color: #ffcccc !important;
  `;
  
  // Create word display (with smaller font for long words)
  const wordDisplay = document.createElement('div');
  wordDisplay.textContent = selectedWord;
  wordDisplay.style.cssText = `
    font-size: ${selectedWord.length > 30 ? '20px' : '24px'} !important;
    font-weight: bold !important;
    background: rgba(255,255,255,0.2) !important;
    padding: 15px !important;
    border-radius: 8px !important;
    margin: 0 0 20px 0 !important;
    letter-spacing: 1px !important;
    border: 2px solid rgba(255,255,255,0.3) !important;
    color: #fff !important;
    word-break: break-all !important;
    line-height: 1.2 !important;
  `;
  
  // Create input field
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type the ENTIRE word here...';
  input.style.cssText = `
    width: 100% !important;
    padding: 15px !important;
    font-size: 16px !important;
    border: 2px solid #fff !important;
    border-radius: 8px !important;
    margin: 0 0 20px 0 !important;
    text-align: center !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    background: rgba(255,255,255,0.9) !important;
    color: #333 !important;
    box-sizing: border-box !important;
  `;
  
  // Create submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Ṣ̸̒Ṵ̷͑B̴̹̕M̵̱͆Ȉ̷̤T̸̞̊';
  submitBtn.style.cssText = `
    background: #fff !important;
    color: #cc0000 !important;
    border: none !important;
    padding: 12px 30px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  `;
  
  // Add hover effects
  submitBtn.onmouseenter = () => {
    submitBtn.style.background = '#f0f0f0 !important';
    submitBtn.style.transform = 'scale(1.05) !important';
  };
  submitBtn.onmouseleave = () => {
    submitBtn.style.background = '#fff !important';
    submitBtn.style.transform = 'scale(1) !important';
  };
  
  // Handle submission
  const handleSubmit = () => {
    const userInput = input.value.trim().toUpperCase();
    if (userInput === selectedWord) {
      // Correct! Award token (no bonus for punishment captcha)
      awardKitoFoxRefreshPunishmentToken();
      removeKitoFoxCaptcha();
    } else {
      // Wrong answer - more dramatic shake and red flash
      popup.style.animation = 'kitoFoxCaptchaHardShake 0.8s ease-in-out';
      input.style.background = 'rgba(255,50,50,0.9) !important';
      input.style.borderColor = '#ff0000 !important';
      
      setTimeout(() => {
        popup.style.animation = '';
        input.style.background = 'rgba(255,255,255,0.9) !important';
        input.style.borderColor = '#fff !important';
        input.focus();
      }, 800);
    }
  };
  
  // Event listeners
  submitBtn.onclick = handleSubmit;
  
  input.onkeypress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // Assemble popup
  popup.appendChild(title);
  popup.appendChild(prompt);
  popup.appendChild(wordDisplay);
  popup.appendChild(input);
  popup.appendChild(submitBtn);
  overlay.appendChild(popup);
  
  // Add CSS animations
  addKitoFoxCaptchaStyles();
  
  // Add to page
  document.body.appendChild(overlay);
  
  // Focus input
  setTimeout(() => input.focus(), 100);
}

function removeKitoFoxCaptcha() {
  const overlay = document.getElementById('kitoFoxCaptchaOverlay');
  if (overlay) {
    overlay.remove();
  }
  kitoFoxCaptchaActive = false;
}

function awardKitoFoxCaptchaToken() {
  // Select random token type based on weights
  const totalWeight = kitoFoxTokenTypes.reduce((sum, token) => sum + token.weight, 0);
  let random = Math.random() * totalWeight;
  
  let selectedToken = null;
  for (const token of kitoFoxTokenTypes) {
    random -= token.weight;
    if (random <= 0) {
      selectedToken = token;
      break;
    }
  }
  
  if (!selectedToken) {
    selectedToken = kitoFoxTokenTypes[0]; // Fallback
  }
  
  // Calculate reward amount (1 token * 5x KitoFox multiplier)
  let rewardAmount = new Decimal(5); // Already multiplied by KitoFox boost
  
  // Award the token
  if (selectedToken.type === 'swabucks') {
    if (!window.state.swabucks) window.state.swabucks = new Decimal(0);
    window.state.swabucks = new Decimal(window.state.swabucks).add(rewardAmount);
  } else {
    if (!window.state.tokens) window.state.tokens = {};
    if (!window.state.tokens[selectedToken.type]) {
      window.state.tokens[selectedToken.type] = new Decimal(0);
    }
    window.state.tokens[selectedToken.type] = new Decimal(window.state.tokens[selectedToken.type]).add(rewardAmount);
  }
  
  // Show success popup
  showKitoFoxCaptchaSuccess(selectedToken.type, rewardAmount);
  
  // Update UI
  if (typeof updateUI === 'function') updateUI();
  if (typeof updateKitchenUI === 'function') updateKitchenUI();
}

function awardKitoFoxRefreshPunishmentToken() {
  // For punishment captcha, only award 1 token (no KitoFox multiplier as penalty)
  const selectedToken = kitoFoxTokenTypes[0]; // Always give basic berry token as punishment
  let rewardAmount = new Decimal(1); // No multiplier - this is punishment
  
  // Award the token
  if (!window.state.tokens) window.state.tokens = {};
  if (!window.state.tokens[selectedToken.type]) {
    window.state.tokens[selectedToken.type] = new Decimal(0);
  }
  window.state.tokens[selectedToken.type] = new Decimal(window.state.tokens[selectedToken.type]).add(rewardAmount);
  
  // Show punishment success notification
  if (typeof window.showGenericRewardNotification === 'function') {
    window.showGenericRewardNotification(
      selectedToken.type, 
      rewardAmount, 
      "CAPTCHA Completed", 
      `+${rewardAmount} ${selectedToken.type.charAt(0).toUpperCase() + selectedToken.type.slice(1)}`
    );
  }
  
  // Update UI
  if (typeof updateUI === 'function') updateUI();
  if (typeof updateKitchenUI === 'function') updateKitchenUI();
}

function showKitoFoxCaptchaSuccess(tokenType, amount) {
  // Use the existing achievement notification system
  if (typeof window.showGenericRewardNotification === 'function') {
    window.showGenericRewardNotification(
      tokenType, 
      amount, 
      "CAPTCHA Completed!", 
      `+${amount} ${tokenType === 'swabucks' ? 'Swa Bucks' : 
                    tokenType === 'prismashard' ? 'Prisma Shard' : 
                    tokenType.charAt(0).toUpperCase() + tokenType.slice(1)}`
    );
  } else {
    // Fallback if notification system isn't available
  }
}

function addKitoFoxCaptchaStyles() {
  if (document.getElementById('kitoFoxCaptchaStyles')) return;
  
  const style = document.createElement('style');
  style.id = 'kitoFoxCaptchaStyles';
  style.textContent = `
    @keyframes kitoFoxCaptchaFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes kitoFoxCaptchaPopIn {
      0% { 
        opacity: 0;
        transform: scale(0.5) translateY(-50px);
      }
      100% { 
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes kitoFoxCaptchaShake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes kitoFoxCaptchaHardShake {
      0%, 100% { transform: translateX(0) rotate(0deg); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px) rotate(-2deg); }
      20%, 40%, 60%, 80% { transform: translateX(10px) rotate(2deg); }
    }
    
    @keyframes kitoFoxTitlePulse {
      0%, 100% { 
        color: #fff;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      }
      50% { 
        color: #ff6666;
        text-shadow: 2px 2px 8px rgba(255,0,0,0.8);
      }
    }
  `;
  document.head.appendChild(style);
}

// Make recorder mode functions globally accessible
window.toggleRecorderMode = toggleRecorderMode;
window.updateRecorderModeImages = updateRecorderModeImages;
window.updateRecorderModeToggleUI = updateRecorderModeToggleUI;
window.addRecorderModeToggleButton = addRecorderModeToggleButton;
window.getAppropriateQuotes = getAppropriateQuotes;
window.testRecorderSpeech = testRecorderSpeech;
window.halloweenRecorderQuotes = halloweenRecorderQuotes;
window.kitoQuotes = kitoQuotes;

// Make Halloween Recorder easter egg functions globally accessible
window.isHalloweenRecorderEasterEggActive = isHalloweenRecorderEasterEggActive;
window.initializeHalloweenRecorderEasterEgg = initializeHalloweenRecorderEasterEgg;
window.cleanupHalloweenRecorderEasterEgg = cleanupHalloweenRecorderEasterEgg;
window.handleHalloweenRecorderClick = handleHalloweenRecorderClick;
window.updateHalloweenRecorderOpacity = updateHalloweenRecorderOpacity;
window.startHalloweenRecorderAutoDim = startHalloweenRecorderAutoDim;
window.stopHalloweenRecorderAutoDim = stopHalloweenRecorderAutoDim;
window.addHalloweenRecorderClickHandlers = addHalloweenRecorderClickHandlers;
window.showHalloweenRecorderClickSpeech = showHalloweenRecorderClickSpeech;
window.showHalloweenRecorderSneakySpeech = showHalloweenRecorderSneakySpeech;
window.resetHalloweenRecorderSpeechSystem = resetHalloweenRecorderSpeechSystem;
window.switchRecorderImageToSpeech = switchRecorderImageToSpeech;
window.switchAllRecorderImagesToSpeech = switchAllRecorderImagesToSpeech;
window.revertAllRecorderImagesFromSpeech = revertAllRecorderImagesFromSpeech;
window.cleanupRecorderImageSwitches = cleanupRecorderImageSwitches;
window.halloweenRecorderClickQuotes = halloweenRecorderClickQuotes;
window.halloweenRecorderSneakyQuotes = halloweenRecorderSneakyQuotes;
window.halloweenRecorderVisibility = halloweenRecorderVisibility;

// Make KitoFox hardcore overlay functions globally accessible
window.showKitoFoxHardcoreOverlay = showKitoFoxHardcoreOverlay;
window.removeKitoFoxHardcoreOverlay = removeKitoFoxHardcoreOverlay;
window.ensureKitoFoxOverlayState = ensureKitoFoxOverlayState;

// Make KitoFox captcha functions globally accessible
window.startKitoFoxCaptchaSystem = startKitoFoxCaptchaSystem;
window.stopKitoFoxCaptchaSystem = stopKitoFoxCaptchaSystem;
window.showKitoFoxCaptcha = showKitoFoxCaptcha;
window.removeKitoFoxCaptcha = removeKitoFoxCaptcha;
window.showKitoFoxRefreshPunishmentCaptcha = showKitoFoxRefreshPunishmentCaptcha;
window.setupCaptchaRefreshDetection = setupCaptchaRefreshDetection;

// Make KitoFox mode functions globally accessible
window.toggleKitoFoxMode = toggleKitoFoxMode;
window.updateKitoFoxModeImages = updateKitoFoxModeImages;
window.addKitoFoxModeToggleButton = addKitoFoxModeToggleButton;
window.updateKitoFoxModeToggleUI = updateKitoFoxModeToggleUI;

// Make Kito mode functions globally accessible
window.toggleKitoMode = toggleKitoMode;
window.updateKitoModeImages = updateKitoModeImages;
window.addKitoModeToggleButton = addKitoModeToggleButton;
window.updateKitoModeToggleUI = updateKitoModeToggleUI;

// Make unified mode functions globally accessible
window.updateAllModeImages = updateAllModeImages;

// Debug function to check Halloween class status
function debugHalloweenClasses() {
  console.log('===========================');
}

// Force apply Halloween cargo theme (for testing)
function forceApplyHalloweenCargo() {
  document.body.classList.add('halloween-cargo-active');
  document.documentElement.classList.add('halloween-cargo-active');
  document.body.style.setProperty('--halloween-active', '1');
  
  if (typeof window.applyHalloweenCargoTheme === 'function') {
    window.applyHalloweenCargoTheme();
  }
  
  debugHalloweenClasses();
}

// Test function to switch to home and apply Halloween theme
function testHalloweenTheme() {
  
  // Force apply Halloween state
  window.state.halloweenEventActive = true;
  
  // Switch to home page
  if (typeof window.switchPage === 'function') {
    window.switchPage('home');
  }
  
  // Apply Halloween theme
  setTimeout(() => {
    forceApplyHalloweenCargo();
  }, 200);
}

// Make Halloween event functions globally accessible
window.toggleHalloweenEvent = toggleHalloweenEvent;
window.updateHalloweenEventState = updateHalloweenEventState;
window.addHalloweenEventToggleButton = addHalloweenEventToggleButton;
window.updateHalloweenEventToggleUI = updateHalloweenEventToggleUI;
window.debugHalloweenClasses = debugHalloweenClasses;
window.forceApplyHalloweenCargo = forceApplyHalloweenCargo;
window.testHalloweenTheme = testHalloweenTheme;

// Debug function to check KitoFox mode state
window.debugKitoFoxMode = function() {
  
  // Try to manually update images
  updateAllModeImages();
};

// Debug function to test Halloween Recorder easter egg
window.debugHalloweenRecorderEasterEgg = function() {
  const isActive = isHalloweenRecorderEasterEggActive();
  const currentOpacity = halloweenRecorderVisibility.currentOpacity;
  const recorderImages = document.querySelectorAll('img[src*="recorder"]');
  
  return {
    isActive,
    currentOpacity,
    recorderImageCount: recorderImages.length,
    recorderImageSources: Array.from(recorderImages).map(img => img.src),
    halloweenMode: window.state?.halloweenEventActive,
    recorderMode: window.state?.recorderModeActive,
    activeSpeechTimeouts: halloweenRecorderVisibility.speechTimeouts.size,
    storedOriginalTexts: halloweenRecorderVisibility.originalTexts.size,
    easterEggState: halloweenRecorderVisibility
  };
};

window.debugPremium = function() {


  if (typeof initPremiumSystem === 'function') {
    initPremiumSystem();

  }
  if (typeof updatePremiumUI === 'function') {
    updatePremiumUI();

  }
};

// Make backward compatibility functions globally accessible
window.isBijouUnlocked = isBijouUnlocked;
window.isBijouEnabled = isBijouEnabled; 
window.isBijouActiveCompat = isBijouActiveCompat;