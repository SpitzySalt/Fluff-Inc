// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file


















































window.premiumState = window.premiumState || {
  bijouUnlocked: false,
  bijouEnabled: false,
  vrchatMirrorUnlocked: false
};

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
        if (window.premiumState.bijouUnlocked) {
          bijouButton.textContent = 'Unlocked';
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
  if (window.premiumState.bijouUnlocked) {
    return;
  }
  const currentSwabucks = window.state && window.state.swabucks ? new Decimal(window.state.swabucks) : new Decimal(0);
  if (currentSwabucks.lt(cost)) {
    alert(`You need ${DecimalUtils.formatDecimal(cost)} Swa Bucks to unlock Bijou!`);
    return;
  }
  if (confirm(`Are you sure you want to unlock Bijou for ${DecimalUtils.formatDecimal(cost)} Swa Bucks?`)) {
    window.state.swabucks = currentSwabucks.sub(cost);
    window.premiumState.bijouUnlocked = true;
    window.premiumState.bijouEnabled = true; 
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
  const cost = new Decimal(5000);
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
  if (!window.premiumState.bijouUnlocked) {
    alert('Bijou must be unlocked first!');
    const checkbox = document.getElementById('bijouToggleCheckbox');
    if (checkbox) {
      checkbox.checked = false;
    }
    return;
  }
  const checkbox = document.getElementById('bijouToggleCheckbox');
  if (checkbox) {
    window.premiumState.bijouEnabled = checkbox.checked;
  } else {
    window.premiumState.bijouEnabled = !window.premiumState.bijouEnabled;
  }
  // Save removed - premium state now managed by main save system
  const status = window.premiumState.bijouEnabled ? 'enabled' : 'disabled';
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
  if (window.premiumState.bijouUnlocked) {
    if (!checkbox) {
      addBijouToggleButton();
    }
  } else {
    if (checkbox) {
      checkbox.parentElement.remove();
    }
  }
  if (checkbox) {
    checkbox.checked = window.premiumState.bijouEnabled;
  }
  
  // Also update recorder mode toggle
  updateRecorderModeToggleUI();
  
  // Also update KitoFox mode toggle
  updateKitoFoxModeToggleUI();
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
        <input type="checkbox" id="bijouToggleCheckbox" ${window.premiumState.bijouEnabled ? 'checked' : ''} onchange="toggleBijou()">
        <span>Enable Bijou</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
  
  // Add recorder mode toggle if unlocked
  addRecorderModeToggleButton();
  
  // Add KitoFox mode toggle if unlocked
  addKitoFoxModeToggleButton();
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

function isBijouActive() {
  return window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled;
}

function getBijouStatus() {
  return {
    unlocked: window.premiumState.bijouUnlocked,
    enabled: window.premiumState.bijouEnabled,
    active: isBijouActive()
  };
}

function toggleRecorderMode() {
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.recorderMode) {
    return;
  }
  
  window.state.recorderModeActive = !window.state.recorderModeActive;
  
  // If turning on recorder mode, turn off KitoFox mode
  if (window.state.recorderModeActive && window.state.kitoFoxModeActive) {
    window.state.kitoFoxModeActive = false;
    // Update KitoFox toggle UI
    const kitoFoxCheckbox = document.getElementById('kitoFoxModeToggleCheckbox');
    if (kitoFoxCheckbox) {
      kitoFoxCheckbox.checked = false;
    }
  }
  
  updateRecorderModeImages();
  
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
  
  // If turning on KitoFox mode, turn off recorder mode
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

function updateKitoFoxModeImages() {
  if (!window.state.kitoFoxModeActive) {
    // Revert to normal swaria images
    updateAllSwariaImages('swa normal.png', 'swa talking.png');
    
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

function updateRecorderModeImages() {
  if (!window.state.recorderModeActive) {
    // Revert to normal swaria images
    updateAllSwariaImages('swa normal.png', 'swa talking.png');
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
}

function updateAllModeImages() {
  
  let normalImage = 'swa normal.png';
  let speechImage = 'swa talking.png';
  
  // Priority: KitoFox mode takes precedence over recorder mode
  if (window.state.kitoFoxModeActive) {
    // Use recorder images for KitoFox mode (can be changed to specific KitoFox images later)
    normalImage = 'assets/icons/kitomode.png';
    speechImage = 'assets/icons/kitomode speech.png';
  } else if (window.state.recorderModeActive) {
    // Use recorder images
    normalImage = 'assets/icons/recorder.png';
    speechImage = 'assets/icons/recorder speech.png';
  } else {
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
  const swariaCharacterImages = document.querySelectorAll('img[src*="swa normal"], img[src*="swa talking"], img[src*="recorder.png"], img[src*="recorder speech"], img[src*="kitomode.png"], img[src*="kitomode speech"]');
  
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
  const swariaElements = document.querySelectorAll('[style*="swa normal"], [style*="swa talking"], [style*="recorder.png"], [style*="recorder speech"]');
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

function initBijouUI() {
  if (!window.premiumState.bijouUnlocked || !window.premiumState.bijouEnabled) {
    removeBijouUI();
    return;
  }
  if (!bijouUIElement) {
    bijouUIElement = document.createElement('div');
    bijouUIElement.id = 'bijouUI';
    bijouUIElement.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 0px;
      width: 300px;
      height: 300px;
      z-index: 1;
      pointer-events: auto;
      transition: transform 0.3s ease;
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
  if (window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled) {
    initBijouUI();
  } else {
    removeBijouUI();
  }
}

function checkBijouCollection(token) {
  if (!window.premiumState.bijouUnlocked || !window.premiumState.bijouEnabled) {
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
  const randomDialogue = bijouDialogues[Math.floor(Math.random() * bijouDialogues.length)];
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

function createBijouSpeechBubble(text) {
  if (!bijouUIElement) return;
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
  }
  bijouSpeechBubble = document.createElement('div');
  bijouSpeechBubble.style.cssText = `
    position: fixed;
    bottom: 320px;
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
  addSpeechBubbleCSS
};

// Function to get appropriate quotes based on active modes
function getAppropriateQuotes() {
  if (window.state && window.state.kitoFoxModeActive && Math.random() < 0.25) {
    // 25% chance to use KitoFox quotes when KitoFox mode is active (takes priority over recorder mode)
    return kitoFoxQuotes;
  } else if (window.state && window.state.recorderModeActive && Math.random() < 0.75) {
    // 75% chance to use recorder quotes when recorder mode is active (and KitoFox is not active or failed its roll)
    return recorderQuotes;
  } else {
    // Use normal swaria quotes (75% chance for KitoFox mode, 25% chance for recorder mode, 100% when no modes active)
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

// Make unified mode functions globally accessible
window.updateAllModeImages = updateAllModeImages;

// Debug function to check KitoFox mode state
window.debugKitoFoxMode = function() {
  
  // Try to manually update images
  updateAllModeImages();
};

window.debugPremium = function() {


  if (typeof initPremiumSystem === 'function') {
    initPremiumSystem();

  }
  if (typeof updatePremiumUI === 'function') {
    updatePremiumUI();

  }
};