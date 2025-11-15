// Halloween Event System for Fluff Inc.

// Initialize Halloween event state
if (!window.state.halloweenEvent) {
  window.state.halloweenEvent = {
    swandy: new Decimal(0),
    swandyCap: new Decimal(1000000), // Hard cap for Swandy storage
    isActive: window.state.halloweenEventActive || false,
    currentSubTab: 'hub',
    candyTokensGiven: new Decimal(0), // Track candy tokens given to unlock the event
    treeOfHorrors: {
      level: 1,
      totalFed: new Decimal(0)
    },
    treeUpgrades: {
      purchased: {},
      swandyGeneration: new Decimal(0)
    },
    peachy: {
      lastInteraction: 0,
      interactionCooldown: 10000, // 10 seconds cooldown
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween peachy.png'
    },
    treeCanvas: {
      position: { x: 0, y: 0 },
      zoom: 1,
      layoutVersion: 1
    },
    swandyCrusherUnlocked: false
  };
}

// Ensure swandyCap exists
if (!window.state.halloweenEvent.swandyCap) {
  window.state.halloweenEvent.swandyCap = new Decimal(1000000);
}

// Ensure candyTokensGiven exists even if halloweenEvent was already initialized
if (!window.state.halloweenEvent.candyTokensGiven) {
  window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
}

// Ensure swandy is a Decimal
if (!DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)) {
  window.state.halloweenEvent.swandy = new Decimal(window.state.halloweenEvent.swandy || 0);
}

// Halloween Music System
let halloweenAudio = null;
let halloweenMusicRolled = false;

function initializeHalloweenMusic() {
  if (!halloweenAudio) {
    halloweenAudio = new Audio('assets/music/spooky.mp3');
    halloweenAudio.loop = true;
    halloweenAudio.volume = 0.5;
  }
}

function playHalloweenMusic() {
  if (!halloweenMusicRolled) {
    return;
  }
  initializeHalloweenMusic();
  if (halloweenAudio && halloweenAudio.paused) {
    halloweenAudio.play().catch(err => {
      console.error('Failed to play Halloween music:', err);
    });
  }
}

function stopHalloweenMusic() {
  if (halloweenAudio && !halloweenAudio.paused) {
    halloweenAudio.pause();
    halloweenAudio.currentTime = 0;
  }
}

function rollHalloweenMusic() {
  halloweenMusicRolled = Math.random() < 0.001;
  return halloweenMusicRolled;
}

// Ensure hex currency exists
if (!window.state.halloweenEvent.hex) {
  window.state.halloweenEvent.hex = new Decimal(0);
}

// Ensure hex is a Decimal
if (!DecimalUtils.isDecimal(window.state.halloweenEvent.hex)) {
  window.state.halloweenEvent.hex = new Decimal(window.state.halloweenEvent.hex || 0);
}

// Ensure hexed swandy shards currency exists
if (!window.state.halloweenEvent.hexedSwandyShards) {
  window.state.halloweenEvent.hexedSwandyShards = new Decimal(0);
}

// Ensure hexed swandy shards is a Decimal
if (!DecimalUtils.isDecimal(window.state.halloweenEvent.hexedSwandyShards)) {
  window.state.halloweenEvent.hexedSwandyShards = new Decimal(window.state.halloweenEvent.hexedSwandyShards || 0);
}

// Ensure treeUpgrades exists
if (!window.state.halloweenEvent.treeUpgrades) {
  window.state.halloweenEvent.treeUpgrades = {
    purchased: {},
    hexProgress: {},
    hexData: {}
  };
}

// Ensure hex tracking exists even if treeUpgrades was already initialized
if (!window.state.halloweenEvent.treeUpgrades.hexProgress) {
  window.state.halloweenEvent.treeUpgrades.hexProgress = {};
}
if (!window.state.halloweenEvent.treeUpgrades.hexData) {
  window.state.halloweenEvent.treeUpgrades.hexData = {};
}

// Ensure Tree Age exists
if (window.state.halloweenEvent.treeAge === undefined) {
  window.state.halloweenEvent.treeAge = 0;
}

// Initialize Swandy generation tracking timestamp if not present
if (!window.state.halloweenEvent.lastSwandyTick) {
  window.state.halloweenEvent.lastSwandyTick = Date.now();
}

// Ensure peachy object exists even if halloweenEvent was already initialized
if (!window.state.halloweenEvent.peachy) {
  window.state.halloweenEvent.peachy = {
    lastInteraction: 0,
    interactionCooldown: 10000,
    totalInteractions: 0,
    isTalking: false,
    speechTimer: null,
    currentImage: 'assets/icons/halloween peachy.png',
    autoSpeechTimer: null,
    lastAutoSpeech: 0
  };
}

// Ensure treeCanvas state exists even if halloweenEvent was already initialized
if (!window.state.halloweenEvent.treeCanvas) {
  window.state.halloweenEvent.treeCanvas = {
    position: { x: 0, y: 0 },
    zoom: 1,
    layoutVersion: 1
  };
}

// Ensure Bijou restoration state exists
if (!window.state.halloweenEvent.bijouWasEnabledBeforeEntering) {
  window.state.halloweenEvent.bijouWasEnabledBeforeEntering = false;
}

// Auto speech system for Halloween Peachy
function startHalloweenPeachyAutoSpeech() {
  // Only start if on Halloween event page and peachy exists
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.peachy) return;
  
  const peachy = window.state.halloweenEvent.peachy;
  
  // Clear any existing timer
  if (peachy.autoSpeechTimer) {
    clearTimeout(peachy.autoSpeechTimer);
  }
  
  // Schedule next auto speech in 20-30 seconds
  const delay = Math.random() * 10000 + 20000; // 20000-30000ms (20-30 seconds)
  
  peachy.autoSpeechTimer = setTimeout(() => {
    // Only speak if currently on Halloween event page and not already talking
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'halloweenEvent' && !peachy.isTalking) {
      showHalloweenPeachySpeech();
      
      // Change to talking image (check for hex)
      const peachyImage = document.getElementById('halloweenPeachyCharacter');
      if (peachyImage) {
        const isHexed = window.state && 
                        window.state.halloweenEvent && 
                        window.state.halloweenEvent.jadeca && 
                        window.state.halloweenEvent.jadeca.peachyIsHexed;
        
        if (isHexed) {
          peachyImage.src = 'assets/icons/halloween hexed swa speech.png';
          peachy.currentImage = 'assets/icons/halloween hexed swa speech.png';
        } else {
          peachyImage.src = 'assets/icons/halloween peachy speech.png';
          peachy.currentImage = 'assets/icons/halloween peachy speech.png';
        }
      }
    }
    
    // Schedule next auto speech
    startHalloweenPeachyAutoSpeech();
  }, delay);
}

function stopHalloweenPeachyAutoSpeech() {
  if (window.state.halloweenEvent && window.state.halloweenEvent.peachy) {
    const peachy = window.state.halloweenEvent.peachy;
    if (peachy.autoSpeechTimer) {
      clearTimeout(peachy.autoSpeechTimer);
      peachy.autoSpeechTimer = null;
    }
  }
}

// Function to switch to Halloween event page
function switchToHalloweenEvent() {
  // Check if Halloween event is unlocked and active
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.halloweenEvent) {
    return;
  }
  
  if (!window.state.halloweenEventActive) {
    return;
  }
  
  // Save Bijou state before entering Halloween event and disable it
  if (window.state && window.state.bijouActive) {
    window.state.halloweenEvent.bijouWasEnabledBeforeEntering = true;
    // Manually disable Bijou mode
    window.state.bijouActive = false;
    // Update Bijou UI to remove it
    if (typeof updateBijouUIVisibility === 'function') {
      updateBijouUIVisibility();
    }
    // Update the checkbox if it exists
    const checkbox = document.getElementById('bijouToggleCheckbox');
    if (checkbox) {
      checkbox.checked = false;
    }
  } else {
    window.state.halloweenEvent.bijouWasEnabledBeforeEntering = false;
  }
  
  // Easter egg: 1% chance to change "The Haunted Grove" to "The Haunted Grode"
  const hauntedGroveBtn = document.getElementById('halloweenHubNavBtn');
  if (hauntedGroveBtn && Math.random() < 0.01) {
    hauntedGroveBtn.textContent = 'The Haunted Grode';
  } else if (hauntedGroveBtn) {
    hauntedGroveBtn.textContent = 'The Haunted Grove';
  }
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  
  // Show Halloween event page
  const halloweenEventPage = document.getElementById('halloweenEvent');
  if (halloweenEventPage) {
    halloweenEventPage.classList.add('active');
    halloweenEventPage.style.display = 'block';
  }
  
  // Update navigation buttons
  document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
  
  // Add Halloween event cursor class
  document.body.classList.add('halloween-event-active');
  
  // Roll for Halloween music (0.1% chance)
  if (rollHalloweenMusic()) {
    playHalloweenMusic();
  }
  
  // Remove darkness effect when entering Halloween event
  if (typeof updateGeneratorDarknessEffect === 'function') {
    updateGeneratorDarknessEffect();
  }
  
  // Handle navigation visibility
  const subTab = document.getElementById('subTabNavBar');
  const regularBottomNav = document.getElementById('bottomNav');
  const halloweenBottomNav = document.getElementById('halloweenBottomNav');
  
  if (subTab) subTab.style.display = 'none';
  if (regularBottomNav) regularBottomNav.style.display = 'none';
  if (halloweenBottomNav) halloweenBottomNav.style.display = 'flex';
  
  // Update Halloween Peachy image to hexed version if needed
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  if (peachyImage) {
    const isHexed = window.state && 
                    window.state.halloweenEvent && 
                    window.state.halloweenEvent.jadeca && 
                    window.state.halloweenEvent.jadeca.peachyIsHexed;
    
    if (isHexed) {
      peachyImage.src = 'assets/icons/halloween hexed swa.png';
      if (window.state.halloweenEvent.peachy) {
        window.state.halloweenEvent.peachy.currentImage = 'assets/icons/halloween hexed swa.png';
      }
    }
  }
  
  if (window.boutique && typeof window.boutique.updateHalloweenShopButtonVisibility === 'function') {
    window.boutique.updateHalloweenShopButtonVisibility();
  }
}

// Define switchPage function if it doesn't exist
if (typeof window.switchPage !== 'function') {
  window.switchPage = function(pageId) {
    // Restore Bijou state when leaving Halloween event to return to facility
    if (pageId === 'home' && window.state && window.state.halloweenEvent && window.state.halloweenEvent.bijouWasEnabledBeforeEntering) {
      // Re-enable Bijou if it was enabled before entering
      if (!window.state.bijouActive) {
        window.state.bijouActive = true;
        // Update Bijou UI to show it
        if (typeof updateBijouUIVisibility === 'function') {
          updateBijouUIVisibility();
        }
        // Update the checkbox if it exists
        const checkbox = document.getElementById('bijouToggleCheckbox');
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      // Reset the flag
      window.state.halloweenEvent.bijouWasEnabledBeforeEntering = false;
    }
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.style.display = 'block';
    }
    
    // Update navigation buttons
    document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector(`[data-target="${pageId}"]`);
    if (navBtn) {
      navBtn.classList.add('active');
    }
    
    // Add/remove Halloween event active class for cursor system
    if (pageId === 'halloweenEvent' && window.state && window.state.halloweenEventActive) {
      document.body.classList.add('halloween-event-active');
    } else {
      document.body.classList.remove('halloween-event-active');
    }
    
    // Update darkness effect when switching pages
    if (typeof updateGeneratorDarknessEffect === 'function') {
      updateGeneratorDarknessEffect();
    }
    
    // Handle sub-tab and bottom navigation visibility
    const subTab = document.getElementById('subTabNavBar');
    const regularBottomNav = document.getElementById('bottomNav');
    const halloweenBottomNav = document.getElementById('halloweenBottomNav');
    
    if (pageId === 'home') {
      if (subTab) subTab.style.display = 'flex';
      if (regularBottomNav) regularBottomNav.style.display = 'flex';
      if (halloweenBottomNav) halloweenBottomNav.style.display = 'none';
      // Remove Halloween background classes
      document.body.classList.remove('halloween-active');
      document.documentElement.classList.remove('halloween-active');
    } else if (pageId === 'halloweenEvent') {
      if (subTab) subTab.style.display = 'none';
      if (regularBottomNav) regularBottomNav.style.display = 'none';
      if (halloweenBottomNav) halloweenBottomNav.style.display = 'flex';
      // Add Halloween background classes
      document.body.classList.add('halloween-active');
      document.documentElement.classList.add('halloween-active');
    } else {
      if (subTab) subTab.style.display = 'none';
      if (regularBottomNav) regularBottomNav.style.display = 'flex';
      if (halloweenBottomNav) halloweenBottomNav.style.display = 'none';
      // Remove Halloween background classes
      document.body.classList.remove('halloween-active');
      document.documentElement.classList.remove('halloween-active');
    }
  };
}

// Make function globally accessible
window.switchToHalloweenEvent = switchToHalloweenEvent;
window.playHalloweenMusic = playHalloweenMusic;
window.stopHalloweenMusic = stopHalloweenMusic;
window.initializeHalloweenMusic = initializeHalloweenMusic;
window.rollHalloweenMusic = rollHalloweenMusic;

// Comprehensive Halloween Event Initialization
function initializeHalloweenEventSystems() {
  
  // Initialize Halloween event state if it doesn't exist
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {
      swandy: new Decimal(0),
      isActive: window.state.halloweenEventActive || false,
      currentSubTab: 'hub',
      candyTokensGiven: new Decimal(0), // Track candy tokens given to unlock the event
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
  
  // Ensure all sub-objects exist
  if (!window.state.halloweenEvent.candyTokensGiven) {
    window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  }
  
  if (!window.state.halloweenEvent.peachy) {
    window.state.halloweenEvent.peachy = {
      lastInteraction: 0,
      interactionCooldown: 10000,
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween peachy.png',
      autoSpeechTimer: null,
      lastAutoSpeech: 0
    };
  }
  
  if (!window.state.halloweenEvent.treeOfHorrors) {
    window.state.halloweenEvent.treeOfHorrors = {
      level: 1,
      totalFed: new Decimal(0)
    };
  }
  
  // Initialize Jadeca state
  if (!window.state.halloweenEvent.jadeca) {
    window.state.halloweenEvent.jadeca = {
      currentSubTab: 'hexing',
      hexflux: new Decimal(0),
      hex: new Decimal(0),
      hexionCount: 0,
      hexomancyMilestones: {},
      character: {
        lastInteraction: 0,
        interactionCooldown: 10000,
        totalInteractions: 0,
        isTalking: false,
        speechTimer: null,
        currentImage: 'assets/icons/halloween jadeca.png'
      }
    };
  }
  
  // Ensure Jadeca character object exists
  if (!window.state.halloweenEvent.jadeca.character) {
    window.state.halloweenEvent.jadeca.character = {
      lastInteraction: 0,
      interactionCooldown: 10000,
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween jadeca.png'
    };
  }
  
  // Ensure Jadeca hexflux is a Decimal
  if (window.state.halloweenEvent.jadeca.hexflux && !DecimalUtils.isDecimal(window.state.halloweenEvent.jadeca.hexflux)) {
    window.state.halloweenEvent.jadeca.hexflux = new Decimal(window.state.halloweenEvent.jadeca.hexflux);
  }
  
  // Ensure Jadeca hex is a Decimal
  if (!window.state.halloweenEvent.jadeca.hex) {
    window.state.halloweenEvent.jadeca.hex = new Decimal(0);
  } else if (!DecimalUtils.isDecimal(window.state.halloweenEvent.jadeca.hex)) {
    window.state.halloweenEvent.jadeca.hex = new Decimal(window.state.halloweenEvent.jadeca.hex);
  }
  
  // Initialize cursor monitoring
  if (typeof initializeHalloweenCursorMonitor === 'function') {
    initializeHalloweenCursorMonitor();
  }
  
  // Start Peachy auto speech
  if (typeof startHalloweenPeachyAutoSpeech === 'function') {
    startHalloweenPeachyAutoSpeech();
  }
  
  // Apply Halloween visual theming
  if (typeof updateHalloweenCargoTheme === 'function') {
    setTimeout(updateHalloweenCargoTheme, 100);
  }
  
  // Apply Halloween cargo theme immediately if on home page
  if (typeof applyHalloweenCargoTheme === 'function') {
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'home') {
      applyHalloweenCargoTheme();
    }
  }
  
  // Initialize Halloween cursors for current page (respects cursor setting)
  if (typeof updateHalloweenCursorEffects === 'function') {
    updateHalloweenCursorEffects();
  }
  
  // Apply Halloween theming to current page if it's the Halloween event page
  const currentPage = document.querySelector('.page.active');
  if (currentPage && currentPage.id === 'halloweenEvent') {
    document.body.classList.add('halloween-event-active');
    document.documentElement.classList.add('halloween-event-active');
  }
  
  // Trigger Halloween theming for any currently visible elements
  setTimeout(() => {
    // Update any visible character images
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    }
    if (typeof updateHalloweenSoapImages === 'function') {
      updateHalloweenSoapImages();
    }
    if (typeof updateHalloweenMysticImages === 'function') {
      updateHalloweenMysticImages();
    }
    if (typeof updateHalloweenTicoImages === 'function') {
      updateHalloweenTicoImages();
    }
    if (typeof updateHalloweenLepreImages === 'function') {
      updateHalloweenLepreImages();
    }
    if (typeof updateHalloweenFluzzerImages === 'function') {
      updateHalloweenFluzzerImages();
    }
    if (typeof updateHalloweenPeachyImages === 'function') {
      updateHalloweenPeachyImages();
    }
    
    // Initialize Halloween Vi system
    if (typeof initializeHalloweenViSystem === 'function') {
      initializeHalloweenViSystem();
    }
    
    // Apply Halloween background styling
    document.body.style.setProperty('--halloween-active', '1');
    
    // Check if we need to apply Halloween time display
    if (typeof updateTimeDisplay === 'function') {
      updateTimeDisplay();
    }
    
    // Initialize Swandy Crusher tab visibility
    if (window.state.halloweenEvent.swandyCrusherUnlocked) {
      const crusherTab = document.getElementById('swandyCrusherTab');
      if (crusherTab) {
        crusherTab.style.display = 'inline-block';
      }
    }
    
    // Start Tree Age ticker
    startTreeAgeTicker();
    updateTreeAgeUI();
    
    // Initialize Jadeca's Hut tab visibility
    // Show if either both S20 and SH13 are purchased, OR milestone1 has been reached (permanent unlock)
    const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
    const hasHexomancyMilestone = window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1 === true;
    const jadecaUnlocked = (treeUpgrades.break_in && treeUpgrades.second_half_key) || hasHexomancyMilestone;
    
    if (jadecaUnlocked) {
      const jadecasHutTab = document.getElementById('jadecasHutTab');
      if (jadecasHutTab) {
        jadecasHutTab.style.display = 'inline-block';
      }
    }
  }, 200);
  
}

// Force immediate Halloween theme application
function forceHalloweenThemeUpdate() {
  if (!window.state || !window.state.halloweenEventActive) {
    return;
  }
  
  
  // Clear any existing cleanup timers
  if (window._halloweenCleanupTimer) {
    clearTimeout(window._halloweenCleanupTimer);
    window._halloweenCleanupTimer = null;
  }
  
  const currentPage = document.querySelector('.page.active');
  if (currentPage) {
    if (currentPage.id === 'home') {
      document.body.classList.add('halloween-cargo-active');
      if (typeof applyHalloweenCargoTheme === 'function') {
        applyHalloweenCargoTheme();
      }
    } else if (currentPage.id === 'halloweenEvent') {
      document.body.classList.add('halloween-event-active');
    }
  }
  
  // Initialize Halloween cursors (respects cursor setting)
  if (typeof updateHalloweenCursorEffects === 'function') {
    updateHalloweenCursorEffects();
  }
  
  // Apply Halloween background styling
  document.body.style.setProperty('--halloween-active', '1');
  
  // Force immediate visual updates
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  if (typeof updateHalloweenSoapImages === 'function') {
    updateHalloweenSoapImages();
  }
  if (typeof updateHalloweenMysticImages === 'function') {
    updateHalloweenMysticImages();
  }
  if (typeof updateHalloweenTicoImages === 'function') {
    updateHalloweenTicoImages();
  }
  if (typeof updateHalloweenLepreImages === 'function') {
    updateHalloweenLepreImages();
  }
  if (typeof updateHalloweenFluzzerImages === 'function') {
    updateHalloweenFluzzerImages();
  }
  if (typeof updateHalloweenPeachyImages === 'function') {
    updateHalloweenPeachyImages();
  }
  
  // Initialize Halloween Vi system
  if (typeof ensureHalloweenViHook === 'function') {
    ensureHalloweenViHook();
  }
  
  if (typeof updateTimeDisplay === 'function') {
    updateTimeDisplay();
  }
  
  // Additional delayed updates for any slow-loading elements
  setTimeout(() => {
    if (window.state && window.state.halloweenEventActive) {
      if (typeof updateHalloweenCargoTheme === 'function') {
        updateHalloweenCargoTheme();
      }
    }
  }, 100);
  
}

// Halloween Event Cleanup
function cleanupHalloweenEventSystems() {
  // Re-enable page scrolling when leaving Halloween event completely
  document.body.classList.remove('tree-horrors-active');
  document.documentElement.classList.remove('tree-horrors-active');
  
  // Remove scroll prevention event listeners
  if (window.treeScrollPreventFunction) {
    document.removeEventListener('wheel', window.treeScrollPreventFunction);
    document.removeEventListener('touchmove', window.treeScrollPreventFunction);
    window.treeScrollPreventFunction = null;
  }
  
  // Restore scroll position if it was stored
  if (window.treeScrollPosition) {
    setTimeout(() => {
      window.scrollTo(window.treeScrollPosition.x, window.treeScrollPosition.y);
      window.treeScrollPosition = null;
    }, 50);
  }
  
  // Set cleanup timer to prevent conflicts
  window._halloweenCleanupTimer = setTimeout(() => {
    // Stop Halloween music and reset roll
    stopHalloweenMusic();
    halloweenMusicRolled = false;
    
    // Stop auto speech
    if (typeof stopHalloweenPeachyAutoSpeech === 'function') {
      stopHalloweenPeachyAutoSpeech();
    }
    
    // Remove all Halloween classes
    document.body.classList.remove('halloween-active');
    document.documentElement.classList.remove('halloween-active');
    document.body.classList.remove('halloween-event-active');
    document.body.classList.remove('halloween-cargo-active');
    document.body.classList.remove('halloween-cursor-spinning');
    
    // Remove Halloween cargo theme
    if (typeof removeHalloweenCargoTheme === 'function') {
      removeHalloweenCargoTheme();
    }
    
    // Remove Halloween background styling
    document.body.style.removeProperty('--halloween-active');
    
    // Remove all Halloween cursor styles
    const halloweenCursorStyles = document.getElementById('halloweenCursorStyles');
    if (halloweenCursorStyles) {
      halloweenCursorStyles.remove();
    }
    
    // Restore normal character images
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    }
    
    // Restore normal time display
    if (typeof updateTimeDisplay === 'function') {
      updateTimeDisplay();
    }
    
    if (window.boutique && typeof window.boutique.updateHalloweenShopButtonVisibility === 'function') {
      window.boutique.updateHalloweenShopButtonVisibility();
    }
    
  }, 10);
}

// Trick or Treat functionality
function trickOrTreat() {
  const now = Date.now();
  const halloweenState = window.state.halloweenEvent;
  
  if (now - halloweenState.lastTrickOrTreat < halloweenState.trickOrTreatCooldown) {
    const remainingTime = Math.ceil((halloweenState.trickOrTreatCooldown - (now - halloweenState.lastTrickOrTreat)) / 1000);
    showToast(`Wait ${remainingTime} more seconds!`, 'warning');
    return;
  }
  
  // Generate random treats (1-5)
  const treatsEarned = Math.floor(Math.random() * 5) + 1;
  
  // Ensure treats is a Decimal before adding
  if (!DecimalUtils.isDecimal(halloweenState.treats)) {
    halloweenState.treats = new Decimal(halloweenState.treats || 0);
  }
  
  halloweenState.treats = halloweenState.treats.add(treatsEarned);
  halloweenState.lastTrickOrTreat = now;
  
  // Update cooldown button
  const btn = document.getElementById('trickOrTreatBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '🎃 Wait...';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '🎃 Trick or Treat!';
    }, halloweenState.trickOrTreatCooldown);
  }
  
  updateHalloweenUI();
  showToast(`Got ${treatsEarned} Halloween treats! 🍬`, 'success');
}

// Buy Halloween upgrades
function buyHalloweenUpgrade(upgradeType) {
  const halloweenState = window.state.halloweenEvent;
  let cost, maxLevel;
  
  switch (upgradeType) {
    case 'sweetMultiplier':
      cost = new Decimal(50).mul(new Decimal(2).pow(halloweenState.upgrades.sweetMultiplier));
      maxLevel = 10;
      break;
    case 'ghostlyBoost':
      cost = new Decimal(100).mul(new Decimal(3).pow(halloweenState.upgrades.ghostlyBoost));
      maxLevel = 5;
      break;
    default:
      return;
  }
  
  if (halloweenState.upgrades[upgradeType] >= maxLevel) {
    showToast('Upgrade maxed out!', 'info');
    return;
  }
  
  // Ensure treats is a Decimal before comparison and subtraction
  if (!DecimalUtils.isDecimal(halloweenState.treats)) {
    halloweenState.treats = new Decimal(halloweenState.treats || 0);
  }
  
  if (halloweenState.treats.gte(cost)) {
    halloweenState.treats = halloweenState.treats.sub(cost);
    halloweenState.upgrades[upgradeType]++;
    updateHalloweenUI();
    showToast(`Purchased ${upgradeType}!`, 'success');
  } else {
    showToast('Not enough treats!', 'warning');
  }
}

// Halloween Peachy dialogue - dynamically assembled based on upgrade progression
function getHalloweenPeachyQuotes() {
  // Part 1: Generic Halloween atmosphere and fun (always available)
  const part1Quotes = [
    "Boo! Did I scare you? Just kidding, I'm too cute to be scary!",
    "Halloween is my favorite time of year! So many treats to collect!",
    "This Halloween outfit makes me feel extra mischievous!",
    "I've been practicing my spooky laugh... Mwahahaha! How was that?",
    "The best part about Halloween? All the orange decorations match my colors!",
    "I tried to carve a pumpkin, but it looked more like a box. Old habits!",
    "Being spooky is hard work, but someone's gotta do it!",
    "I've been practicing my ghost impression... WooOOOooo!",
    "Did you hear that creaking? Oh wait, that was just me stepping on a leaf!",
    "I love how the moonlight makes everything look extra spooky tonight!",
    "The spirits told me you're doing great! Keep up the good work!",
    "I found some cobwebs earlier, but they were just decoration... I think.",
    "This foggy weather is perfect for a mysterious Halloween atmosphere!",
    "Halloween night is when all the best magical things happen!",
    "Every shadow looks like it might be hiding more Halloween surprises!",
    "The jack-o'-lanterns are grinning at me, they must approve of my work!",
    "The crisp autumn air makes me want to dance with joy!"
  ];
  
  // Part 2: Haunted Grove and Tree of Horrors
  const part2Quotes = [
    "Welcome to the Haunted Grove! This place has been abandoned for centuries...",
    "The Tree of Horrors wasn't always called that. It's actually a corrupted tree of life!",
    "A tree of life used to reside here, it has decayed completely now.",
    "I'm growing the Tree of Horrors because it feeds on Swandy and produces magical energy!",
    "Legend says this grove was once a peaceful sanctuary before a curse took hold.",
    "The Tree of Horrors grows stronger with each Swandy it consumes. Fascinating, right?",
    "They say a powerful witch cursed this entire grove long ago.",
    "I found ancient writings here that says 'Leave'... spooky!",
    "Every Halloween, the barrier between worlds grows thin here in the grove.",
    "The witch they speak of? Her name was Zaiko... or so the legends say.",
    "I came here to study the magical properties of cursed candy. I call them swandies!",
    "The grove's curse transforms ordinary candy into magical Swandy. Useful!",
    "Ancient scrolls mention this place was once called the 'Grove of Eternal Autumn'.",
    "The Tree of Horrors feeds on treats because it's trying to remember sweetness.",
    "The mist here never fully clears. It's part of the curse that binds this place.",
    "They say the hex witch still wanders these woods on the darkest nights.",
    "The Tree of Horrors whispers secrets to those who feed it enough Swandy.",
    "The curse here is old, but not permanent. The tree is key to breaking it!",
    "Local spirits avoid this grove. Only the brave or foolish enter... like me!",
    "The witch's hut is still standing somewhere deeper in these woods...",
    "I'm collecting Swandy to power the tree. It might lift the curse someday.",
    "The Tree of Horrors grows twisted branches because it absorbed so much dark magic.",
    "Every Swandy fed to the tree weakens the curse just a tiny bit!",
    "The grove remembers everyone who enters. It's like the land itself is alive.",
    "I found the witch's old journal buried near the tree. The entries are... disturbing.",
    "This place used to be beautiful before the witch's final spell went wrong.",
    "The Tree of Horrors isn't evil, just corrupted. I believe it can be saved!"
  ];
  
  // Part 3: Swandy Crusher and advanced mechanics (only if S11 purchased)
  const part3Quotes = [
    "The Swandy Crusher I built can break Swandy down into pure crystalline shards!",
    "Swandy Shards are incredibly potent! They're like concentrated Halloween magic!",
    "I discovered that crushing Swandy releases magical energies trapped inside the candy.",
    "The Swandy Shattery multiplies shards at different rates depending on crushing power!",
    "Each shard contains fragments of the original curse. Useful for experiments!",
    "The Tree of Horrors has a hidden branch that only responds to Swandy Shards!",
    "I call it the 'Crystalline Branch', it grows differently from the normal tree's branches!",
    "Crushing Swandy was controversial, but the results speak for themselves!",
    "Shards are more efficient than whole Swandy for certain magical applications!",
    "I'm growing an alternate branch of the Tree of Horrors using only shards!",
    "The Shattery operates on principles I barely understand. It's magical engineering!",
    "Each crushed Swandy releases a tiny pulse of purifying energy into the grove.",
    "The Crystalline Branch glows with an inner light. It's beautiful!",
    "I theorize that shards can eventually reverse the curse entirely!",
    "The Swandy Crusher makes this satisfying crunching sound. Very satisfying!",
    "Shards stack differently than Swandy. They're denser, more concentrated magic.",
    "The alternate branch grows faster with shards than the main tree does with Swandy!",
    "I'm documenting every aspect of the crushing process for future researchers.",
    "Swandy crush swaga, fluff inc edition!",
    "The Shattery might be my greatest invention! Well, Halloween-wise anyway."
  ];
  
  // Combine quotes based on progression
  let availableQuotes = [...part1Quotes, ...part2Quotes];
  
  // Add Part 3 quotes only if S11 (swandy_crusher_unlock) is purchased
  const treeUpgrades = window.state?.halloweenEvent?.treeUpgrades?.purchased || {};
  if (treeUpgrades.swandy_crusher_unlock) {
    availableQuotes = [...availableQuotes, ...part3Quotes];
  }
  
  return availableQuotes;
}

// Legacy array for backwards compatibility - now dynamically generated
const halloweenPeachyQuotes = getHalloweenPeachyQuotes();

// Hexed Peachy dialogue - only appears when Peachy is hexed
const hexedPeachyQuotes = [
  "This cursed mark burns with an eerie purple flame... ugh.",
  "I can't remember when this hex started. Days? Weeks? Time feels strange now...",
  "The Halloween decorations used to make me happy, now they just remind me I'm cursed.",
  "Every time I try to collect Swandy, the hex pulses stronger. It feeds on my work!",
  "I thought Halloween was supposed to be fun, not terrifying like this!",
  "The hex whispers dark prophecies in my ear. I don't want to hear them anymore!",
  "Sometimes I forget I'm hexed, then the burning sensation reminds me cruelly.",
  "The Tree of Horrors seems to resonate with my hex mark. Are they connected?",
  "I've tried everything to remove this curse: soap, light, even swandy! Nothing works!",
  "This isn't the Halloween adventure I signed up for! I want my normal life back!",
  "The hex makes me see shadowy figures in the corners. Is Jadeca trying to scare me?",
  "I can feel the dark magic coursing through my veins like ice water.",
  "Every Swandy I collect feels tainted by the curse now. Corrupted candy...",
  "The jack-o'-lanterns' grins look sinister now, like they're mocking my suffering.",
  "My Halloween costume used to be fun. Now it's a reminder of when I got hexed...",
  "The hex mark glows brighter when I'm near magical objects. It's attracted to power!",
  "I dream of being free from this curse, back to just enjoying Halloween treats.",
  "This hex has stolen my joy. I used to love every moment here in the grove.",
  "I can feel the curse trying to change me into something else. I must resist!",
  "The autumn leaves taste like ash now. The hex ruins everything beautiful.",
  "I don't know if I can go back to the facility, not while this hex is on me.",
  "I saw my reflection in the water and didn't recognize myself. The hex changed me.",
  "What will the other workers think when they see me like this? I can't face them!",
  "I'm fighting the hex every second. It wants control but I won't give in!",
  "The witch who hexed me must be laughing at me. This isn't fair!",
  "My wings feel heavy with cursed energy. Although I was never able to fly anyway...",
  "The hex feeds on my fear. I'm trying to be brave but it's so hard!",
  "I keep dropping Swandy because my cursed wings shake uncontrollably.",
  "The moonlight used to be comforting. Now it just illuminates my curse.",
  "The Tree of Horrors whispered something about 'chosen vessels'. Am I one?",
  "I tried writing a letter for help but the hex burned the paper to ash!",
  "The curse makes me forget happy memories. I'm losing pieces of myself!",
  "Every heartbeat pulses with cursed energy. Will my heart turn purple too?",
  "The hex seems stronger during the witching hour. Midnight is agony for me.",
  "Has... time stopped? It feels like it's always the witching hour for me now.",
  "My favorite candy tastes like dirt now. The curse ruins simple pleasures!",
  "The curse whispers promises of power if I surrender. I refuse to listen!",
  "My shadow moves wrong sometimes. The hex is corrupting even that.",
  "I don't wanna go back to the facility with this hex. I would just make every worker uncomfortable and afraid.",
  "The hex mark itches constantly. Scratching only makes it spread further!",
  "I saw visions of the witch's lair through the curse. She's watching me!",
];

// Character interaction with Halloween Peachy
function interactWithHalloweenPeachy() {
  // Ensure Halloween event state exists
  if (!window.state.halloweenEvent) {
    return;
  }
  
  const halloweenState = window.state.halloweenEvent;
  
  // Ensure peachy object exists
  if (!halloweenState.peachy) {
    halloweenState.peachy = {
      lastInteraction: 0,
      interactionCooldown: 10000,
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween peachy.png',
      autoSpeechTimer: null,
      lastAutoSpeech: 0
    };
  }
  
  // Ensure auto speech properties exist
  if (!halloweenState.peachy.hasOwnProperty('autoSpeechTimer')) {
    halloweenState.peachy.autoSpeechTimer = null;
  }
  if (!halloweenState.peachy.hasOwnProperty('lastAutoSpeech')) {
    halloweenState.peachy.lastAutoSpeech = 0;
  }
  
  const peachy = halloweenState.peachy;
  
  // No rewards, just speech interaction
  peachy.totalInteractions++;
  
  // Show Halloween Peachy speech
  showHalloweenPeachySpeech();
  
  // Change to talking image (check for hex)
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  if (peachyImage) {
    const isHexed = window.state && 
                    window.state.halloweenEvent && 
                    window.state.halloweenEvent.jadeca && 
                    window.state.halloweenEvent.jadeca.peachyIsHexed;
    
    if (isHexed) {
      peachyImage.src = 'assets/icons/halloween hexed swa speech.png';
      peachy.currentImage = 'assets/icons/halloween hexed swa speech.png';
    } else {
      peachyImage.src = 'assets/icons/halloween peachy speech.png';
      peachy.currentImage = 'assets/icons/halloween peachy speech.png';
    }
  }
  
  if (typeof updateHalloweenUI === 'function') {
    updateHalloweenUI();
  }
}

// Legacy function for backwards compatibility
function interactWithPeachy() {
  interactWithHalloweenPeachy();
}

// Show Halloween Peachy speech bubble
function showHalloweenPeachySpeech() {
  // Ensure Halloween event state exists
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.peachy) {
    return;
  }
  
  const halloweenState = window.state.halloweenEvent;
  const peachy = halloweenState.peachy;
  
  const speechBubble = document.getElementById('halloweenPeachySpeech');
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  
  if (!speechBubble || !peachyImage) {
    return;
  }
  
  // Clear any existing speech timer
  if (peachy.speechTimer) {
    clearTimeout(peachy.speechTimer);
    peachy.speechTimer = null;
  }
  
  // Check if Peachy is hexed
  const isHexed = window.state && 
                  window.state.halloweenEvent && 
                  window.state.halloweenEvent.jadeca && 
                  window.state.halloweenEvent.jadeca.peachyIsHexed;
  
  // Get random quote - if hexed, 50% chance for hexed dialogue, 50% for normal dialogue
  let quoteArray;
  if (isHexed && Math.random() < 0.5) {
    quoteArray = hexedPeachyQuotes;
  } else {
    quoteArray = getHalloweenPeachyQuotes();
  }
  const randomQuote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
  speechBubble.textContent = randomQuote;
  
  // Show speech bubble with multiple display methods for reliability
  speechBubble.style.display = 'block';
  speechBubble.style.visibility = 'visible';
  speechBubble.style.opacity = '1';
  speechBubble.classList.add('show');
  peachy.isTalking = true;
  
  // Hide speech bubble after 4 seconds and change back to normal image
  peachy.speechTimer = setTimeout(() => {
    speechBubble.style.display = 'none';
    speechBubble.style.visibility = 'hidden';
    speechBubble.style.opacity = '0';
    speechBubble.classList.remove('show');
    peachy.isTalking = false;
    
    // Change back to normal Halloween image (check for hex)
    if (peachyImage) {
      const isHexed = window.state && 
                      window.state.halloweenEvent && 
                      window.state.halloweenEvent.jadeca && 
                      window.state.halloweenEvent.jadeca.peachyIsHexed;
      
      if (isHexed) {
        peachyImage.src = 'assets/icons/halloween hexed swa.png';
        peachy.currentImage = 'assets/icons/halloween hexed swa.png';
      } else {
        peachyImage.src = 'assets/icons/halloween peachy.png';
        peachy.currentImage = 'assets/icons/halloween peachy.png';
      }
    }
    
    peachy.speechTimer = null;
  }, 4000);
}

// Update Halloween UI
function updateHalloweenUI() {
  const halloweenState = window.state.halloweenEvent;
  
  // Ensure Halloween state is properly initialized
  if (!halloweenState || !halloweenState.treeUpgrades) {
    initializeHalloweenEvent(); // Re-initialize if needed
    return; // Skip this update cycle
  }
  
  // Update treat count (if element exists, for backward compatibility)
  const treatCountElement = document.getElementById('treatCount');
  if (treatCountElement) {
    treatCountElement.textContent = DecimalUtils.formatDecimal(halloweenState.treats);
  }
  
  // Update Swandy count
  const swandyCountElement = document.getElementById('swandyCount');
  if (swandyCountElement) {
    // Use helper function to get effective swandy (respects soft-cap)
    const effectiveSwandy = getEffectiveSwandy();
    const currentSwandy = DecimalUtils.formatDecimal(effectiveSwandy);
    
    // Get the cap using helper function
    const effectiveCap = getSwandyCap();
    const capSwandy = DecimalUtils.formatDecimal(effectiveCap);
    
    // Check if soft-capped
    const isSoftCapped = isSwandySoftCapped();
    const softCapText = isSoftCapped ? ' (softcapped)' : '';
    
    swandyCountElement.textContent = `${currentSwandy} / ${capSwandy}${softCapText}`;
    
    // Update swandy icon based on whether we've exceeded the current cap
    const swandyIconElement = document.getElementById('swandyIcon');
    if (swandyIconElement) {
      const currentSwandyDecimal = DecimalUtils.isDecimal(halloweenState.swandy) 
        ? halloweenState.swandy 
        : new Decimal(halloweenState.swandy || 0);
      
      if (currentSwandyDecimal.gt(effectiveCap)) {
        // Swandy exceeds current cap - show hexed swandy icon (hex permitting break through hardcap)
        swandyIconElement.src = 'assets/icons/hexed swandy.png';
      } else {
        // Normal swandy - show regular icon
        swandyIconElement.src = 'assets/icons/swandy.png';
      }
    }
  }
  // Update Swandy per second
  const swandyPerSecondElement = document.getElementById('swandyPerSecond');
  if (swandyPerSecondElement) {
    // Calculate generationRate from purchased upgrades (flag-based)
    let generationRate = new Decimal(0);
    const treeUpgrades = halloweenState.treeUpgrades.purchased || {};
    
    if (treeUpgrades.swandy_start) {
      generationRate = new Decimal(1); // S1 base
      if (treeUpgrades.swandy_multiply) {
        const s2Multiplier = getS2HexMultiplier();
        generationRate = generationRate.mul(s2Multiplier);
      }
      if (treeUpgrades.need_more_swandies) {
        const s3Multiplier = getS3HexMultiplier();
        generationRate = generationRate.mul(s3Multiplier);
      }
      if (treeUpgrades.tree_game_upgrade) {
        const s4Multiplier = getUpgradeHexMultiplier('tree_game_upgrade');
        generationRate = generationRate.mul(s4Multiplier);
      }
      if (treeUpgrades.devilish_swandy) {
        const s6Multiplier = getUpgradeHexMultiplier('devilish_swandy');
        generationRate = generationRate.mul(s6Multiplier);
      }
      if (treeUpgrades.less_devilish_swandy) {
        const s7Multiplier = getUpgradeHexMultiplier('less_devilish_swandy');
        generationRate = generationRate.mul(s7Multiplier);
      }
      if (treeUpgrades.worst_upgrades) {
        const s8Multiplier = getUpgradeHexMultiplier('worst_upgrades');
        generationRate = generationRate.mul(s8Multiplier);
      }
      if (treeUpgrades.revolution_upcoming) {
        const s9Multiplier = getUpgradeHexMultiplier('revolution_upcoming');
        generationRate = generationRate.mul(s9Multiplier);
      }
      if (treeUpgrades.just_out_of_reach) generationRate = generationRate.mul(2.5); // S14
      if (treeUpgrades.witch_hut) generationRate = generationRate.mul(2); // S18
      if (treeUpgrades.someone_inside) generationRate = generationRate.mul(1.5); // S19
      
      // Apply tree age multiplier if S4 is fully hexed
      const treeAgeMultiplier = getTreeAgeSwandyMultiplier();
      if (treeAgeMultiplier > 1) {
        generationRate = generationRate.mul(treeAgeMultiplier);
      }
    }
    
    // Apply KP boost to displayed rate if upgrade is purchased
    if (treeUpgrades.kp_boost_upgrade && typeof getKpSwandyMultiplier === 'function') {
      const kpMultiplier = getKpSwandyMultiplier();
      // Ensure kpMultiplier is a Decimal
      const multiplier = DecimalUtils.isDecimal(kpMultiplier) ? kpMultiplier : new Decimal(kpMultiplier || 1);
      generationRate = generationRate.mul(multiplier);
    }
    
    // Apply Swandy Crusher production multiplier
    if (halloweenState.swandyCrusher && halloweenState.swandyCrusher.multipliers) {
      const crusherMult = halloweenState.swandyCrusher.multipliers.swandyProduction;
      if (crusherMult) {
        const crusherMultiplier = DecimalUtils.isDecimal(crusherMult) ? crusherMult : new Decimal(crusherMult || 1);
        generationRate = generationRate.mul(crusherMultiplier);
      }
    }
    
    // Apply Resety production multiplier
    if (halloweenState.swandyCrusher && halloweenState.swandyCrusher.resety) {
      const resetyProdMult = DecimalUtils.isDecimal(halloweenState.swandyCrusher.resety.productionMultiplier)
        ? halloweenState.swandyCrusher.resety.productionMultiplier
        : new Decimal(halloweenState.swandyCrusher.resety.productionMultiplier || 1);
      generationRate = generationRate.mul(resetyProdMult);
    }
    
    // Apply Hexomancy Milestone production multiplier (2x per milestone)
    if (halloweenState.jadeca && halloweenState.jadeca.hexomancyMilestones) {
      let milestoneCount = 0;
      const milestones = halloweenState.jadeca.hexomancyMilestones;
      if (milestones.milestone1) milestoneCount++;
      if (milestones.milestone2) milestoneCount++;
      if (milestones.milestone3) milestoneCount++;
      
      if (milestoneCount > 0) {
        const milestoneMult = new Decimal(2).pow(milestoneCount);
        generationRate = generationRate.mul(milestoneMult);
      }
    }
    
    // Apply Halloween shop swandy boost
    if (window.boutique && typeof window.boutique.getHalloweenSwandyBoostMultiplier === 'function') {
      const swandyBoost = window.boutique.getHalloweenSwandyBoostMultiplier();
      generationRate = generationRate.mul(swandyBoost);
    }
    
    // Apply soft-cap reduction to displayed generation rate if softcapped
    if (isSwandySoftCapped()) {
      const k = 50; // Curse strength parameter (higher = stronger reduction)
      const S = halloweenState.swandy;
      const H = getSwandyCap();
      const ratio = S.div(H);
      
      // Calculate p = 1 / (1 + k * log10(S/H))
      const log10Ratio = ratio.log10();
      const denominator = new Decimal(1).add(new Decimal(k).mul(log10Ratio));
      const p = new Decimal(1).div(denominator);
      
      // The effective generation rate is reduced by factor of p
      generationRate = generationRate.mul(p);
    }
    
    swandyPerSecondElement.textContent = DecimalUtils.formatDecimal(generationRate);
  }
  
  // Update Hex currency display and visibility
  const hexCurrencyDisplay = document.getElementById('hexCurrencyDisplay');
  const hexCountElement = document.getElementById('hexCount');
  const hexPerSecondElement = document.getElementById('hexPerSecond');
  
  // Check if hex is unlocked: either both S20 and SH13 are purchased, OR milestone1 has been reached (permanent unlock)
  const treeUpgrades = halloweenState.treeUpgrades.purchased || {};
  const hasHexomancyMilestone = halloweenState.jadeca?.hexomancyMilestones?.milestone1 === true;
  const hexUnlocked = (treeUpgrades.break_in && treeUpgrades.second_half_key) || hasHexomancyMilestone;
  
  if (hexCurrencyDisplay) {
    hexCurrencyDisplay.style.display = hexUnlocked ? 'block' : 'none';
  }
  
  if (hexUnlocked && hexCountElement) {
    const hexAmount = DecimalUtils.isDecimal(halloweenState.hex) 
      ? halloweenState.hex 
      : new Decimal(halloweenState.hex || 0);
    hexCountElement.textContent = DecimalUtils.formatDecimal(hexAmount);
  }
  
  if (hexUnlocked && hexPerSecondElement) {
    // Calculate Hex generation rate from Hexflux
    if (typeof calculateHexGenerationRate === 'function') {
      const hexGenRate = calculateHexGenerationRate();
      hexPerSecondElement.textContent = DecimalUtils.formatDecimal(hexGenRate);
    } else {
      hexPerSecondElement.textContent = '0';
    }
  }
  
  // Update shop buttons
  updateHalloweenShopButtons();
  // Update tree upgrade buttons if we're on the tree tab
  if (typeof window.updateTreeUpgradeButtons === 'function') {
    window.updateTreeUpgradeButtons();
  }
}

// Update Halloween shop button states and costs
function updateHalloweenShopButtons() {
  const halloweenState = window.state.halloweenEvent;
  
  // Update Sweet Multiplier button
  const sweetBtn = document.querySelector('[onclick="buyHalloweenUpgrade(\'sweetMultiplier\')"]');
  if (sweetBtn) {
    const level = halloweenState.upgrades.sweetMultiplier;
    const cost = new Decimal(50).mul(new Decimal(2).pow(level));
    const maxLevel = 10;
    
    if (level >= maxLevel) {
      sweetBtn.textContent = 'Maxed Out!';
      sweetBtn.disabled = true;
    } else {
      sweetBtn.textContent = `Buy for ${DecimalUtils.formatDecimal(cost)} treats (Lv.${level})`;
      sweetBtn.disabled = halloweenState.treats.lt(cost);
    }
  }
  
  // Update Ghostly Boost button
  const ghostBtn = document.querySelector('[onclick="buyHalloweenUpgrade(\'ghostlyBoost\')"]');
  if (ghostBtn) {
    const level = halloweenState.upgrades.ghostlyBoost;
    const cost = new Decimal(100).mul(new Decimal(3).pow(level));
    const maxLevel = 5;
    
    if (level >= maxLevel) {
      ghostBtn.textContent = 'Maxed Out!';
      ghostBtn.disabled = true;
    } else {
      ghostBtn.textContent = `Buy for ${DecimalUtils.formatDecimal(cost)} treats (Lv.${level})`;
      ghostBtn.disabled = halloweenState.treats.lt(cost);
    }
  }
}

// Get Halloween Soap character image based on state
function getHalloweenSoapImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Soap images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/soap speech.png';
      case 'sleep': return 'assets/icons/soap sleeping.png';
      case 'sleep_talk': return 'assets/icons/soap sleep talking.png';
      case 'mad': return 'assets/icons/soap mad.png';
      default: return 'assets/icons/soap.png';
    }
  }
  
  // Return Halloween Soap images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween soap speech.png';
    case 'sleep': return 'assets/icons/halloween soap sleep.png';
    case 'sleep_talk': return 'assets/icons/halloween soap sleep talk.png';
    case 'mad': return 'assets/icons/halloween soap.png'; // Use normal Halloween soap for mad state
    default: return 'assets/icons/halloween soap.png';
  }
}

// Get Halloween Mystic character image based on state
function getHalloweenMysticImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Mystic images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/chef mystic speech.png';
      default: return 'assets/icons/chef mystic.png';
    }
  }
  
  // Return Halloween Mystic images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween mystic speech.png';
    default: return 'assets/icons/halloween mystic.png';
  }
}

// Update all Soap character images to use Halloween versions when active
function updateHalloweenSoapImages() {
  // Update generator tab Soap image
  const generatorSoapImg = document.getElementById('swariaGeneratorCharacter');
  if (generatorSoapImg) {
    // Determine current state
    let imageType = 'normal';
    if (window.isSoapSleeping) {
      imageType = generatorSoapImg.src.includes('sleep talking') ? 'sleep_talk' : 'sleep';
    } else if (generatorSoapImg.src.includes('speech')) {
      imageType = 'speech';
    } else if (generatorSoapImg.src.includes('mad')) {
      imageType = 'mad';
    }
    generatorSoapImg.src = getHalloweenSoapImage(imageType);
  }
  
  // Update charger tab Soap image
  const chargerSoapImg = document.getElementById('soapChargerCharacter');
  if (chargerSoapImg) {
    let imageType = 'normal';
    if (chargerSoapImg.src.includes('speech')) {
      imageType = 'speech';
    }
    chargerSoapImg.src = getHalloweenSoapImage(imageType);
  }
}

// Update all Mystic character images to use Halloween versions when active
function updateHalloweenMysticImages() {
  // Update kitchen tab Mystic image
  const kitchenMysticImg = document.getElementById('kitchenCharacterImg');
  if (kitchenMysticImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (kitchenMysticImg.src.includes('speech')) {
      imageType = 'speech';
    }
    kitchenMysticImg.src = getHalloweenMysticImage(imageType);
  }
}

// Get Halloween Tico character image based on state
function getHalloweenTicoImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Tico images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/tico speech.png';
      case 'sleep': return 'assets/icons/tico sleep.png';
      case 'sleep_talk': return 'assets/icons/tico sleep talk.png';
      default: return 'assets/icons/tico.png';
    }
  }
  
  // Return Halloween Tico images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween tico speech.png';
    case 'sleep': return 'assets/icons/halloween tico sleep.png';
    case 'sleep_talk': return 'assets/icons/halloween tico sleep talk.png';
    default: return 'assets/icons/halloween tico.png';
  }
}

// Update all Tico character images to use Halloween versions when active
function updateHalloweenTicoImages() {
  // Update front desk tab Tico image
  const frontDeskTicoImg = document.getElementById('ticoCharacterImg');
  if (frontDeskTicoImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (frontDeskTicoImg.src.includes('speech')) {
      imageType = 'speech';
    } else if (frontDeskTicoImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    } else if (frontDeskTicoImg.src.includes('sleeping')) {
      imageType = 'sleep';
    }
    frontDeskTicoImg.src = getHalloweenTicoImage(imageType);
  }
}

// Get Halloween Lepre character image based on state
function getHalloweenLepreImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Lepre images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/lepre speech.png';
      case 'mad': return 'assets/icons/lepre mad.png';
      case 'mad_speech': return 'assets/icons/lepre mad speech.png';
      case 'angry': return 'assets/icons/lepre angry.png';
      case 'angry_speech': return 'assets/icons/lepre angry speech.png';
      default: return 'assets/icons/lepre.png';
    }
  }
  
  // Return Halloween Lepre images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween lepre speech.png';
    case 'mad': return 'assets/icons/halloween lepre mad.png';
    case 'mad_speech': return 'assets/icons/halloween lepre mad speech.png';
    case 'angry': return 'assets/icons/halloween lepre angry.png';
    case 'angry_speech': return 'assets/icons/halloween lepre angry speech.png';
    default: return 'assets/icons/halloween lepre.png';
  }
}

// Update all Lepre character images to use Halloween versions when active
function updateHalloweenLepreImages() {
  // Update merchant tab Lepre image (normal image)
  const merchantLepreImg = document.getElementById('lepreCharacterImage');
  if (merchantLepreImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (merchantLepreImg.src.includes('angry speech')) {
      imageType = 'angry_speech';
    } else if (merchantLepreImg.src.includes('angry')) {
      imageType = 'angry';
    } else if (merchantLepreImg.src.includes('mad speech')) {
      imageType = 'mad_speech';
    } else if (merchantLepreImg.src.includes('mad')) {
      imageType = 'mad';
    } else if (merchantLepreImg.src.includes('speech')) {
      imageType = 'speech';
    }
    merchantLepreImg.src = getHalloweenLepreImage(imageType);
  }
  
  // Update merchant tab Lepre speaking image
  const merchantLepreSpeakingImg = document.getElementById('lepreCharacterSpeaking');
  if (merchantLepreSpeakingImg) {
    // Determine current state based on current image
    let imageType = 'speech';
    if (merchantLepreSpeakingImg.src.includes('angry speech')) {
      imageType = 'angry_speech';
    } else if (merchantLepreSpeakingImg.src.includes('mad speech')) {
      imageType = 'mad_speech';
    }
    merchantLepreSpeakingImg.src = getHalloweenLepreImage(imageType);
  }
  
  // Update merchant tab Lepre mad image
  const merchantLepreMadImg = document.getElementById('lepreCharacterMad');
  if (merchantLepreMadImg) {
    merchantLepreMadImg.src = getHalloweenLepreImage('mad');
  }
  
  // Update merchant tab Lepre mad speaking image
  const merchantLepreMadSpeakingImg = document.getElementById('lepreCharacterMadSpeaking');
  if (merchantLepreMadSpeakingImg) {
    merchantLepreMadSpeakingImg.src = getHalloweenLepreImage('mad_speech');
  }
  
  // Update merchant tab Lepre angry image
  const merchantLepreAngryImg = document.getElementById('lepreCharacterAngry');
  if (merchantLepreAngryImg) {
    merchantLepreAngryImg.src = getHalloweenLepreImage('angry');
  }
  
  // Update merchant tab Lepre angry speaking image
  const merchantLepreAngrySpeakingImg = document.getElementById('lepreCharacterAngrySpeaking');
  if (merchantLepreAngrySpeakingImg) {
    merchantLepreAngrySpeakingImg.src = getHalloweenLepreImage('angry_speech');
  }
}

// Get Halloween multipliers for game mechanics
function getHalloweenFluffMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const sweetLevel = window.state.halloweenEvent.upgrades.sweetMultiplier;
  return new Decimal(1).add(new Decimal(0.1).mul(sweetLevel));
}

function getHalloweenGeneratorSpeedMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const ghostLevel = window.state.halloweenEvent.upgrades.ghostlyBoost;
  return new Decimal(1).add(new Decimal(0.05).mul(ghostLevel));
}

// Halloween Sub-Tab Navigation
function switchHalloweenSubTab(tabId) {
  const halloweenState = window.state.halloweenEvent;
  halloweenState.currentSubTab = tabId;
  
  // Hide all sub-content
  document.querySelectorAll('.halloween-sub-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  
  // Show target sub-content based on tab ID
  let targetContent;
  if (tabId === 'hub') {
    targetContent = document.getElementById('halloweenHubContent');
  } else if (tabId === 'treeOfHorrors') {
    targetContent = document.getElementById('halloweenTreeContent');
  } else if (tabId === 'swandyCrusher') {
    targetContent = document.getElementById('halloweenCrusherContent');
  } else if (tabId === 'jadecasHut') {
    targetContent = document.getElementById('halloweenJadecasHutContent');
  }
  
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.style.display = 'block';
  }
  
  // Update bottom navigation buttons
  document.querySelectorAll('.halloween-nav-btn').forEach(btn => btn.classList.remove('active'));
  
  let targetBtn;
  if (tabId === 'hub') {
    targetBtn = document.getElementById('halloweenHubNavBtn');
  } else if (tabId === 'treeOfHorrors') {
    targetBtn = document.getElementById('halloweenTreeNavBtn');
  } else if (tabId === 'swandyCrusher') {
    targetBtn = document.getElementById('swandyCrusherTab');
  } else if (tabId === 'jadecasHut') {
    targetBtn = document.getElementById('jadecasHutTab');
  }
  
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
  
  // Show/hide header card based on tab
  const headerCard = document.querySelector('#halloweenEvent .header-card');
  if (headerCard) {
    if (tabId === 'treeOfHorrors' || tabId === 'swandyCrusher' || tabId === 'jadecasHut') {
      headerCard.style.display = 'none';
    } else {
      headerCard.style.display = 'block';
    }
  }
  
  // Update UI for specific tabs
  if (tabId === 'treeOfHorrors') {
    updateTreeOfHorrorsUI();
  } else if (tabId === 'swandyCrusher') {
    if (typeof initializeSwandyCrusher === 'function') {
      initializeSwandyCrusher();
    }
    if (typeof updateSwandyCrusherUI === 'function') {
      updateSwandyCrusherUI();
    }
  } else if (tabId === 'jadecasHut') {
    // Initialize Jadeca's Hut
    if (typeof switchJadecaSubTab === 'function') {
      switchJadecaSubTab('hexing');
    }
    if (typeof updateHexingUI === 'function') {
      updateHexingUI();
    }
    if (typeof startJadecaAutoSpeech === 'function') {
      startJadecaAutoSpeech();
    }
    // Trigger intro dialogue if not seen yet
    if (typeof startJadecaIntroDialogue === 'function') {
      startJadecaIntroDialogue();
    }
    // Make Jadeca speak when entering her hut
    if (typeof showJadecaSpeech === 'function') {
      showJadecaSpeech();
    }
    // Initialize token drop zone for Jadeca
    if (typeof initializeJadecaTokenDropZone === 'function') {
      initializeJadecaTokenDropZone();
    }
  } else {
    // Stop Jadeca auto speech when leaving the hut
    if (typeof stopJadecaAutoSpeech === 'function') {
      stopJadecaAutoSpeech();
    }
  }
}

// Tree of Horrors functionality
function upgradeTree() {
  const halloweenState = window.state.halloweenEvent;
  const tree = halloweenState.treeOfHorrors;
  const cost = getTreeUpgradeCost(tree.level);
  
  if (halloweenState.treats.gte(cost)) {
    halloweenState.treats = halloweenState.treats.sub(cost);
    tree.totalFed = tree.totalFed.add(cost);
    tree.level++;
    
    updateTreeOfHorrorsUI();
    updateHalloweenUI(); // Update treat count
    showToast(`Tree upgraded to level ${tree.level}! 🌲`, 'success');
  } else {
    showToast('Not enough treats to feed the tree!', 'warning');
  }
}

function getTreeUpgradeCost(level) {
  return new Decimal(100).mul(new Decimal(2).pow(level - 1));
}

function updateTreeOfHorrorsUI() {
  const halloweenState = window.state.halloweenEvent;
  const tree = halloweenState.treeOfHorrors;
  
  // Update tree level display
  const treeLevelElement = document.getElementById('treeLevel');
  if (treeLevelElement) {
    treeLevelElement.textContent = tree.level;
  }
  
  // Update next cost display
  const treeNextCostElement = document.getElementById('treeNextCost');
  if (treeNextCostElement) {
    if (tree.level >= 5) {
      treeNextCostElement.textContent = 'MAX';
    } else {
      const nextCost = getTreeUpgradeCost(tree.level);
      treeNextCostElement.textContent = DecimalUtils.formatDecimal(nextCost);
    }
  }
  
  // Update upgrade button
  const upgradeBtn = document.getElementById('upgradeTreeBtn');
  if (upgradeBtn) {
    if (tree.level >= 5) {
      upgradeBtn.textContent = '🌲 Tree Maxed!';
      upgradeBtn.disabled = true;
    } else {
      const cost = getTreeUpgradeCost(tree.level);
      upgradeBtn.textContent = `🎃 Feed the Tree (${DecimalUtils.formatDecimal(cost)} treats)`;
      upgradeBtn.disabled = halloweenState.treats.lt(cost);
    }
  }
}

// Get tree bonuses for game mechanics
function getTreeTreatMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const level = window.state.halloweenEvent.treeOfHorrors.level;
  if (level >= 2) return new Decimal(1.25);
  return new Decimal(1);
}

function getTreeHalloweenBonusMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const level = window.state.halloweenEvent.treeOfHorrors.level;
  if (level >= 4) return new Decimal(1.5);
  return new Decimal(1);
}

// Tree Age System - Time-based notation formatter
function formatTreeAge(totalSeconds) {
  // Convert to Decimal if not already
  let seconds = DecimalUtils.isDecimal(totalSeconds) ? totalSeconds : new Decimal(totalSeconds || 0);
  
  if (seconds.lt(0)) seconds = new Decimal(0);
  
  // Eons (1 billion years)
  const eonSeconds = new Decimal(31536000000000000);
  if (seconds.gte(eonSeconds)) {
    const eons = seconds.div(eonSeconds).floor().toNumber();
    return `${eons} ${eons === 1 ? 'eon' : 'eons'}`;
  }
  
  // Millennia
  const millenniumSeconds = new Decimal(31536000000);
  if (seconds.gte(millenniumSeconds)) {
    const millennia = seconds.div(millenniumSeconds).floor().toNumber();
    const remainingAfterMillennia = seconds.sub(new Decimal(millennia).mul(millenniumSeconds));
    const centurySeconds = new Decimal(3153600000);
    const centuries = remainingAfterMillennia.div(centurySeconds).floor().toNumber();
    const remainingAfterCenturies = remainingAfterMillennia.sub(new Decimal(centuries).mul(centurySeconds));
    const decadeSeconds = new Decimal(315360000);
    const decades = remainingAfterCenturies.div(decadeSeconds).floor().toNumber();
    return `${millennia}M ${centuries}C ${decades}D`;
  }
  
  // Centuries
  const centurySeconds = new Decimal(3153600000);
  if (seconds.gte(centurySeconds)) {
    const centuries = seconds.div(centurySeconds).floor().toNumber();
    const remainingAfterCenturies = seconds.sub(new Decimal(centuries).mul(centurySeconds));
    const decadeSeconds = new Decimal(315360000);
    const decades = remainingAfterCenturies.div(decadeSeconds).floor().toNumber();
    const remainingAfterDecades = remainingAfterCenturies.sub(new Decimal(decades).mul(decadeSeconds));
    const yearSeconds = new Decimal(31536000);
    const years = remainingAfterDecades.div(yearSeconds).floor().toNumber();
    return `${centuries}C ${decades}D ${years}Y`;
  }
  
  // Decades
  const decadeSeconds = new Decimal(315360000);
  if (seconds.gte(decadeSeconds)) {
    const decades = seconds.div(decadeSeconds).floor().toNumber();
    const remainingAfterDecades = seconds.sub(new Decimal(decades).mul(decadeSeconds));
    const yearSeconds = new Decimal(31536000);
    const years = remainingAfterDecades.div(yearSeconds).floor().toNumber();
    return `${decades}D ${years}Y`;
  }
  
  // Years
  const yearSeconds = new Decimal(31536000);
  if (seconds.gte(yearSeconds)) {
    const years = seconds.div(yearSeconds).floor().toNumber();
    return `${years}Y`;
  }
  
  // Months
  const monthSeconds = new Decimal(2592000);
  if (seconds.gte(monthSeconds)) {
    const months = seconds.div(monthSeconds).floor().toNumber();
    const remainingAfterMonths = seconds.sub(new Decimal(months).mul(monthSeconds));
    const weekSeconds = new Decimal(604800);
    const weeks = remainingAfterMonths.div(weekSeconds).floor().toNumber();
    const remainingAfterWeeks = remainingAfterMonths.sub(new Decimal(weeks).mul(weekSeconds));
    const daySeconds = new Decimal(86400);
    const days = remainingAfterWeeks.div(daySeconds).floor().toNumber();
    return `${months}M ${weeks}W ${days}D`;
  }
  
  // Weeks
  const weekSeconds = new Decimal(604800);
  if (seconds.gte(weekSeconds)) {
    const weeks = seconds.div(weekSeconds).floor().toNumber();
    const remainingAfterWeeks = seconds.sub(new Decimal(weeks).mul(weekSeconds));
    const daySeconds = new Decimal(86400);
    const days = remainingAfterWeeks.div(daySeconds).floor().toNumber();
    return `${weeks}W ${days}D`;
  }
  
  // Days
  const daySeconds = new Decimal(86400);
  if (seconds.gte(daySeconds)) {
    const days = seconds.div(daySeconds).floor().toNumber();
    const remainingAfterDays = seconds.sub(new Decimal(days).mul(daySeconds));
    const hourSeconds = new Decimal(3600);
    const hours = remainingAfterDays.div(hourSeconds).floor().toNumber();
    return `${days}D ${hours}H`;
  }
  
  // Hours, Minutes, Seconds
  const hourSeconds = new Decimal(3600);
  const hours = seconds.div(hourSeconds).floor().toNumber();
  const remainingAfterHours = seconds.sub(new Decimal(hours).mul(hourSeconds));
  const minuteSeconds = new Decimal(60);
  const minutes = remainingAfterHours.div(minuteSeconds).floor().toNumber();
  const secs = remainingAfterHours.sub(new Decimal(minutes).mul(minuteSeconds)).floor().toNumber();
  
  // Under 1 minute: show only seconds
  if (hours === 0 && minutes === 0) {
    return `${secs}S`;
  }
  
  // Under 1 hour: show only minutes and seconds
  if (hours === 0) {
    return `${minutes}M ${secs}S`;
  }
  
  // 1 hour or more (but under 1 day): show hours, minutes, and seconds
  return `${hours}H ${minutes}M ${secs}S`;
}

// Update Tree Age display
function updateTreeAgeUI() {
  const treeAgeDisplay = document.getElementById('treeAgeDisplay');
  const treeAgeValue = document.getElementById('treeAgeValue');
  const treeAgePerTick = document.getElementById('treeAgePerTick');
  
  if (!treeAgeDisplay || !treeAgeValue) return;
  if (!window.state?.halloweenEvent?.treeUpgrades?.hexData) return;
  
  // Check if in Halloween area
  const halloweenSection = document.getElementById('halloweenEvent');
  const isInHalloweenArea = halloweenSection && halloweenSection.style.display !== 'none';
  
  // Check if S1 is fully hexed
  const s1FullyHexed = window.state.halloweenEvent.treeUpgrades.hexData['swandy_start']?.isFullyHexed || false;
  
  if (s1FullyHexed && isInHalloweenArea) {
    treeAgeDisplay.style.display = 'block';
    treeAgeValue.textContent = formatTreeAge(window.state.halloweenEvent.treeAge || 0);
    
    // Update tree age per tick display (1 second per tick, or 2 if S23 is purchased)
    if (treeAgePerTick) {
      const s23Purchased = window.state.halloweenEvent.treeUpgrades.purchased['tree_age_dilation'] || false;
      const tickAmount = s23Purchased ? 2 : 1;
      const timePerTick = formatTreeAge(tickAmount);
      treeAgePerTick.textContent = `Tree age per tick: ${timePerTick}`;
    }
  } else {
    treeAgeDisplay.style.display = 'none';
  }
  
  // Adjust other UI positions based on Tree Age visibility
  adjustTopRightUIPositions(s1FullyHexed && isInHalloweenArea);
}

// Adjust power and anomaly UI positions based on Tree Age visibility
function adjustTopRightUIPositions(treeAgeVisible) {
  const powerUI = document.getElementById('powerEnergyStatus');
  const anomalyUI = document.getElementById('anomalyDetectorContainer');
  
  if (treeAgeVisible) {
    // Tree Age is showing, shift power and anomaly down
    if (powerUI) powerUI.style.top = '88px';
    if (anomalyUI) anomalyUI.style.top = '158px';
  } else {
    // Tree Age is hidden, move power and anomaly back to original positions
    if (powerUI) powerUI.style.top = '18px';
    if (anomalyUI) anomalyUI.style.top = '88px';
  }
}

// Tick Tree Age (called every second when S1 is fully hexed)
function tickTreeAge() {
  if (!window.state?.halloweenEvent?.treeUpgrades?.hexData) return;
  
  const s1FullyHexed = window.state.halloweenEvent.treeUpgrades.hexData['swandy_start']?.isFullyHexed || false;
  
  if (s1FullyHexed) {
    const s23Purchased = window.state.halloweenEvent.treeUpgrades.purchased['tree_age_dilation'] || false;
    const ageMultiplier = s23Purchased ? 2 : 1;
    
    window.state.halloweenEvent.treeAge = (window.state.halloweenEvent.treeAge || 0) + ageMultiplier;
    updateTreeAgeUI();
  }
}

// Start Tree Age ticker
let treeAgeInterval = null;
function startTreeAgeTicker() {
  if (treeAgeInterval) return;
  treeAgeInterval = setInterval(tickTreeAge, 1000);
}

function stopTreeAgeTicker() {
  if (treeAgeInterval) {
    clearInterval(treeAgeInterval);
    treeAgeInterval = null;
  }
}

// Hex Upgrade System - Click and Hold Mechanics
let hexDepositInterval = null;
let hexDepositData = {
  upgradeId: null,
  startTime: 0,
  totalDeposited: 0
};

// Initialize hex data for an upgrade if it doesn't exist
function initializeUpgradeHexData(upgradeId) {
  if (!window.state?.halloweenEvent?.treeUpgrades?.hexData) {
    if (!window.state) window.state = {};
    if (!window.state.halloweenEvent) window.state.halloweenEvent = {};
    if (!window.state.halloweenEvent.treeUpgrades) window.state.halloweenEvent.treeUpgrades = {};
    if (!window.state.halloweenEvent.treeUpgrades.hexData) {
      window.state.halloweenEvent.treeUpgrades.hexData = {};
    }
  }
  
  if (!window.state.halloweenEvent.treeUpgrades.hexData[upgradeId]) {
    // Get hex requirement from config
    const config = window.upgradeHexMultiplierConfig?.[upgradeId];
    let hexRequired;
    
    if (config && config.hexRequired !== undefined) {
      hexRequired = new Decimal(config.hexRequired);
    } else {
      // Default to 1e30000 for unconfigured upgrades
      hexRequired = new Decimal("1e30000");
    }
    
    window.state.halloweenEvent.treeUpgrades.hexData[upgradeId] = {
      hexDeposited: new Decimal(0),
      hexRequired: hexRequired,
      isFullyHexed: false
    };
  }
  
  // Ensure hexDeposited and hexRequired are Decimals
  const hexData = window.state.halloweenEvent.treeUpgrades.hexData[upgradeId];
  if (!DecimalUtils.isDecimal(hexData.hexDeposited)) {
    hexData.hexDeposited = new Decimal(hexData.hexDeposited || 0);
  }
  if (!DecimalUtils.isDecimal(hexData.hexRequired)) {
    hexData.hexRequired = new Decimal(hexData.hexRequired || "1e30000");
  }
  
  // Force correct hex requirements from config
  const config = window.upgradeHexMultiplierConfig?.[upgradeId];
  if (config && config.hexRequired !== undefined) {
    hexData.hexRequired = new Decimal(config.hexRequired);
  } else {
    // If no config exists, set to impossibly high value
    hexData.hexRequired = new Decimal("1e30000");
  }
  
  return hexData;
}

// Start depositing hex into an upgrade (called on mousedown/touchstart)
function startHexDeposit(upgradeId) {
  // Check if milestone 1 is unlocked
  if (!window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1) {
    return;
  }
  
  // Check if upgrade is purchased
  if (!window.state.halloweenEvent.treeUpgrades.purchased[upgradeId]) {
    return;
  }
  
  // Check if already fully hexed
  const hexData = initializeUpgradeHexData(upgradeId);
  if (hexData.isFullyHexed) {
    return;
  }
  
  // Check if have any hex
  if (!window.state.halloweenEvent.hex || window.state.halloweenEvent.hex.lte(0)) {
    return;
  }
  
  hexDepositData.upgradeId = upgradeId;
  hexDepositData.startTime = Date.now();
  hexDepositData.totalDeposited = 0;
  
  // Start deposit interval (update every 100ms for smooth progress)
  hexDepositInterval = setInterval(() => {
    depositHexTick(upgradeId);
  }, 100);
}

// Stop depositing hex (called on mouseup/touchend)
function stopHexDeposit() {
  if (hexDepositInterval) {
    clearInterval(hexDepositInterval);
    hexDepositInterval = null;
  }
  
  // Update UI one final time
  if (hexDepositData.upgradeId) {
    updateHexProgressUI(hexDepositData.upgradeId);
  }
  
  hexDepositData = {
    upgradeId: null,
    startTime: 0,
    totalDeposited: 0
  };
}

// Deposit hex tick (called every 100ms during hold)
function depositHexTick(upgradeId) {
  const hexData = initializeUpgradeHexData(upgradeId);
  
  // Check if already fully hexed
  if (hexData.isFullyHexed) {
    stopHexDeposit();
    return;
  }
  
  // Calculate amount to deposit based on upgrade's hex requirement
  // 10% of total hex requirement per second = 1% per 100ms
  const hexRequired = DecimalUtils.isDecimal(hexData.hexRequired) 
    ? hexData.hexRequired 
    : new Decimal(hexData.hexRequired || 1);
  
  const depositAmount = hexRequired.mul(0.01); // 1% of requirement per 100ms = 10% per second
  
  // Check if player has enough hex
  const currentHex = window.state.halloweenEvent.hex;
  if (!DecimalUtils.isDecimal(currentHex)) {
    window.state.halloweenEvent.hex = new Decimal(currentHex || 0);
  }
  
  if (window.state.halloweenEvent.hex.lt(depositAmount)) {
    // Not enough hex, stop depositing
    stopHexDeposit();
    return;
  }
  
  // Calculate remaining hex needed
  const remaining = hexData.hexRequired.sub(hexData.hexDeposited);
  const actualDeposit = Decimal.min(depositAmount, remaining);
  
  // Deduct from hex currency
  window.state.halloweenEvent.hex = window.state.halloweenEvent.hex.sub(actualDeposit);
  
  // Add to upgrade hex
  hexData.hexDeposited = hexData.hexDeposited.add(actualDeposit);
  hexDepositData.totalDeposited = (hexDepositData.totalDeposited || 0) + actualDeposit.toNumber();
  
  // Check if fully hexed
  if (hexData.hexDeposited.gte(hexData.hexRequired)) {
    hexData.hexDeposited = hexData.hexRequired;
    hexData.isFullyHexed = true;
    
    // Apply hex effect for this upgrade
    applyUpgradeHexEffect(upgradeId);
    
    stopHexDeposit();
    if (typeof showToast === 'function') {
      showToast(`Upgrade fully hexed!`, 'success');
    }
  }
  
  // Update UI
  updateHexProgressUI(upgradeId);
  updateHalloweenUI();
}

// Update hex progress UI for a specific upgrade
function updateHexProgressUI(upgradeId) {
  const progressBar = document.getElementById(`hex-progress-${upgradeId}`);
  if (!progressBar) return;
  
  if (!window.state?.halloweenEvent?.treeUpgrades?.hexData) return;
  
  const hexData = window.state.halloweenEvent.treeUpgrades.hexData[upgradeId];
  if (!hexData) return;
  
  // Ensure Decimals
  if (!DecimalUtils.isDecimal(hexData.hexDeposited)) {
    hexData.hexDeposited = new Decimal(hexData.hexDeposited || 0);
  }
  if (!DecimalUtils.isDecimal(hexData.hexRequired)) {
    hexData.hexRequired = new Decimal(hexData.hexRequired || 1);
  }
  
  const progress = hexData.hexDeposited.div(hexData.hexRequired).mul(100).toNumber();
  progressBar.style.width = `${progress}%`;
  
  // Update hexagon opacity
  updateHexagonOverlay(upgradeId, progress / 100);
  
  // Update dynamic descriptions for upgrades with hex multipliers
  // Only update if the config has baseMultiplier and maxMultiplier (not just hexRequired)
  const config = window.upgradeHexMultiplierConfig?.[upgradeId];
  if (config && config.baseMultiplier !== undefined && config.maxMultiplier !== undefined) {
    const descriptionElement = document.querySelector(`#upgrade_${upgradeId} .upgrade-description`);
    if (descriptionElement) {
      const multiplier = getUpgradeHexMultiplier(upgradeId);
      // Determine what the upgrade boosts based on boostType
      const boostText = config.boostType === 'shards' ? 'Swandy shard gain' : 'Swandy production';
      descriptionElement.textContent = `×${multiplier.toFixed(1)} to ${boostText}`;
    }
  }
  
  // Force re-render tree upgrades to update all dynamic content
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
}

// Apply special effects when an upgrade is fully hexed
function applyUpgradeHexEffect(upgradeId) {
  // S1: Start aging the tree
  if (upgradeId === 'swandy_start') {
    updateTreeAgeUI();
  }
  
  // S2: Increase swandy cap by 1.5x
  if (upgradeId === 'swandy_multiply') {
    if (typeof showToast === 'function') {
      showToast('S2 fully hexed! Swandy cap increased by 1.5x', 'success');
    }
  }
  
  // S3: Another 1.5x to swandy cap
  if (upgradeId === 'need_more_swandies') {
    if (typeof showToast === 'function') {
      showToast('S3 fully hexed! Swandy cap increased by another 1.5x', 'success');
    }
  }
  
  // Re-render tree to show hex effects
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
}

// ========================================
// CENTRALIZED HEX MULTIPLIER SYSTEM
// ========================================
// This system makes it easy to add new upgrades with hex-based scaling multipliers
// To add a new upgrade with hex scaling:
// 1. Add an entry to upgradeHexMultiplierConfig below
// 2. The system automatically handles description updates and multiplier calculations

// Configuration for upgrades with hex-based multiplier scaling
window.upgradeHexMultiplierConfig = {
  'swandy_start': {
    hexRequired: 1        // S1: Start aging the tree (no multiplier effect)
  },
  'swandy_multiply': {
    baseMultiplier: 3,    // Multiplier at 0% hex
    maxMultiplier: 4,     // Multiplier at 100% hex
    hexRequired: 5,       // Total hex needed to fully hex this upgrade
    boostType: 'production' // What this upgrade boosts: 'production' or 'shards'
  },
  'need_more_swandies': {
    baseMultiplier: 2,    // Multiplier at 0% hex
    maxMultiplier: 3,     // Multiplier at 100% hex
    hexRequired: 15,      // Total hex needed to fully hex this upgrade
    boostType: 'production'
  },
  'tree_game_upgrade': {
    baseMultiplier: 2.5,  // Multiplier at 0% hex
    maxMultiplier: 3.5,     // Multiplier at 100% hex
    hexRequired: 40,      // Total hex needed to fully hex this upgrade
    boostType: 'production'
  },
  'kp_boost_upgrade': {
    hexRequired: 100      // S5: Tree age cap boost (no multiplier effect)
  },
  'devilish_swandy': {
    baseMultiplier: 1.666, // Multiplier at 0% hex
    maxMultiplier: 2.666,  // Multiplier at 100% hex
    hexRequired: 666,      // Total hex needed to fully hex this upgrade
    boostType: 'production'
  },
  'less_devilish_swandy': {
    baseMultiplier: 1.333, // Multiplier at 0% hex
    maxMultiplier: 2.333,  // Multiplier at 100% hex
    hexRequired: 3333,     // Total hex needed to fully hex this upgrade
    boostType: 'production'
  },
  'shards_multi': {
    baseMultiplier: 1.5,   // Multiplier at 0% hex
    maxMultiplier: 3.0,    // Multiplier at 100% hex
    hexRequired: 1000,     // Total hex needed to fully hex this upgrade
    boostType: 'shards'    // This upgrade boosts shard gain, not production
  },
  'shards_multi_2': {
    baseMultiplier: 1.25,  // Multiplier at 0% hex
    maxMultiplier: 2.5,    // Multiplier at 100% hex
    hexRequired: 100000,   // Total hex needed to fully hex this upgrade
    boostType: 'shards'    // This upgrade boosts shard gain, not production
  },
  'worst_upgrades': {
    baseMultiplier: 1.222, // Multiplier at 0% hex
    maxMultiplier: 2.444,  // Multiplier at 100% hex
    hexRequired: 6666,     // Total hex needed to fully hex this upgrade
    boostType: 'production'
  },
  'revolution_upcoming': {
    baseMultiplier: 1.111, // Multiplier at 0% hex
    maxMultiplier: 2.222,  // Multiplier at 100% hex
    hexRequired: 15000,    // Total hex needed to fully hex this upgrade
    boostType: 'production'
  },
  'crush_swandies': {
    hexRequired: 50000     // S10: Unlock hexed tiles (no multiplier effect)
  },
  'swandy_resety': {
    hexRequired: 1000000   // S11: Swandy shattery effect (no multiplier effect)
  }
  // Add more upgrades here:
  // 'upgrade_id': { baseMultiplier: X, maxMultiplier: Y, hexRequired: Z, boostType: 'production' or 'shards' }
};

// Generic function to get hex multiplier for any configured upgrade
function getUpgradeHexMultiplier(upgradeId) {
  const config = window.upgradeHexMultiplierConfig?.[upgradeId];
  if (!config) {
    console.warn(`No hex multiplier config found for upgrade: ${upgradeId}`);
    return 1;
  }
  
  // If config doesn't have multipliers, return 1 (no scaling)
  if (config.baseMultiplier === undefined || config.maxMultiplier === undefined) {
    return 1;
  }
  
  // Initialize hex data if it doesn't exist
  if (typeof initializeUpgradeHexData === 'function') {
    initializeUpgradeHexData(upgradeId);
  }
  
  const hexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.[upgradeId];
  if (!hexData) return config.baseMultiplier;
  
  const deposited = DecimalUtils.isDecimal(hexData.hexDeposited) 
    ? hexData.hexDeposited 
    : new Decimal(hexData.hexDeposited || 0);
  const required = DecimalUtils.isDecimal(hexData.hexRequired) 
    ? hexData.hexRequired 
    : new Decimal(hexData.hexRequired || config.hexRequired);
  
  if (required.lte(0)) return config.baseMultiplier;
  
  const progress = deposited.div(required).toNumber();
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  const multiplierRange = config.maxMultiplier - config.baseMultiplier;
  return config.baseMultiplier + (clampedProgress * multiplierRange);
}

// Legacy wrapper functions for backwards compatibility
// Get S2 multiplier based on hex progress (base: 3x, fully hexed: 6x)
function getS2HexMultiplier() {
  return getUpgradeHexMultiplier('swandy_multiply');
}

// Get S3 multiplier based on hex progress (base: 2x, fully hexed: 4x)
function getS3HexMultiplier() {
  return getUpgradeHexMultiplier('need_more_swandies');
}

// Get tree age multiplier for swandy production (S4 hex effect)
// Formula: mult(t) = 1 + A × ln(1 + t/B)
// Where: A = 1.2, B = 300, t = tree age in seconds
function getTreeAgeSwandyMultiplier() {
  // Check if S4 is fully hexed
  const s4HexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.['tree_game_upgrade'];
  if (!s4HexData || !s4HexData.isFullyHexed) {
    return 1; // No bonus if S4 not fully hexed
  }
  
  // Get tree age in seconds
  const treeAge = window.state?.halloweenEvent?.treeAge || 0;
  
  // Constants for the formula
  const A = 1.2;
  const B = 300;
  
  // Calculate: mult(t) = 1 + A × ln(1 + t/B)
  const multiplier = 1 + A * Math.log(1 + treeAge / B);
  
  return multiplier;
}

// Get tree age cap multiplier for swandy cap (S5 hex effect)
// Formula: capMult(t) = 1 + 0.455 × ln(1 + t/900)
// Where: t = tree age in seconds
// Cap doubles at ~2 hours and grows very gently after that
function getTreeAgeSwandyCapMultiplier() {
  // Check if S5 is fully hexed
  const s5HexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.['kp_boost_upgrade'];
  if (!s5HexData || !s5HexData.isFullyHexed) {
    return 1; // No bonus if S5 not fully hexed
  }
  
  // Get tree age in seconds
  const treeAge = window.state?.halloweenEvent?.treeAge || 0;
  
  // Calculate: capMult(t) = 1 + 0.455 × ln(1 + t/900)
  const multiplier = 1 + 0.455 * Math.log(1 + treeAge / 900);
  
  return multiplier;
}


// Get hex cost for an upgrade (displayed in UI)
function getUpgradeHexCost(upgradeId) {
  if (!window.state?.halloweenEvent?.treeUpgrades?.hexData) return new Decimal(1);
  const hexData = window.state.halloweenEvent.treeUpgrades.hexData[upgradeId];
  if (!hexData?.hexRequired) return new Decimal(1);
  
  // Ensure it's a Decimal
  return DecimalUtils.isDecimal(hexData.hexRequired) 
    ? hexData.hexRequired 
    : new Decimal(hexData.hexRequired || 1);
}

// Update hexagon overlay for a hexed upgrade
function updateHexagonOverlay(upgradeId, progress) {
  const hexagon = document.getElementById(`hex-overlay-${upgradeId}`);
  if (!hexagon) return;
  
  // Opacity ranges from 0.1 (10% hexed) to 1.0 (100% hexed)
  const opacity = Math.max(0.1, Math.min(1.0, progress));
  hexagon.style.opacity = opacity;
  hexagon.style.display = progress > 0 ? 'block' : 'none';
}

// Create hexagon SVG overlay for an upgrade node
function createHexagonOverlay(upgradeId, containerElement) {
  if (!window.state?.halloweenEvent?.treeUpgrades?.hexData) return null;
  
  const hexData = window.state.halloweenEvent.treeUpgrades.hexData[upgradeId];
  if (!hexData) return null;
  
  // Ensure Decimals
  const hexDeposited = DecimalUtils.isDecimal(hexData.hexDeposited) 
    ? hexData.hexDeposited 
    : new Decimal(hexData.hexDeposited || 0);
  const hexRequired = DecimalUtils.isDecimal(hexData.hexRequired) 
    ? hexData.hexRequired 
    : new Decimal(hexData.hexRequired || 1);
  
  if (hexDeposited.eq(0)) return null;
  
  const progress = hexDeposited.div(hexRequired).toNumber();
  const opacity = Math.max(0.1, Math.min(1.0, progress));
  
  // Create SVG hexagon (MUCH larger to fully surround the upgrade button)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', `hex-overlay-${upgradeId}`);
  svg.setAttribute('width', '700');
  svg.setAttribute('height', '400');
  svg.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 10;
    opacity: ${opacity};
  `;
  
  // Create hexagon path (regular hexagon)
  const hexPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const size = 185; // Even larger size to fully encompass the button
  const centerX = 350;
  const centerY = 200;
  
  // Calculate hexagon points
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = centerX + size * Math.cos(angle);
    const y = centerY + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  
  hexPath.setAttribute('d', `M ${points.join(' L ')} Z`);
  hexPath.setAttribute('fill', 'rgba(255, 255, 255, 0.3)');
  hexPath.setAttribute('stroke', 'rgba(138, 43, 226, 1)');
  hexPath.setAttribute('stroke-width', '5');
  hexPath.style.filter = 'drop-shadow(0 0 12px rgba(138, 43, 226, 0.8))';
  
  svg.appendChild(hexPath);
  
  return svg;
}



// Make functions globally accessible
window.switchHalloweenSubTab = switchHalloweenSubTab;
window.upgradeTree = upgradeTree;
window.updateTreeOfHorrorsUI = updateTreeOfHorrorsUI;
window.getTreeTreatMultiplier = getTreeTreatMultiplier;
window.getTreeHalloweenBonusMultiplier = getTreeHalloweenBonusMultiplier;
window.formatTreeAge = formatTreeAge;
window.updateTreeAgeUI = updateTreeAgeUI;
window.adjustTopRightUIPositions = adjustTopRightUIPositions;
window.tickTreeAge = tickTreeAge;
window.startTreeAgeTicker = startTreeAgeTicker;
window.stopTreeAgeTicker = stopTreeAgeTicker;
window.initializeUpgradeHexData = initializeUpgradeHexData;
window.startHexDeposit = startHexDeposit;
window.stopHexDeposit = stopHexDeposit;
window.depositHexTick = depositHexTick;
window.updateHexProgressUI = updateHexProgressUI;
window.applyUpgradeHexEffect = applyUpgradeHexEffect;
window.getUpgradeHexCost = getUpgradeHexCost;
window.getUpgradeHexMultiplier = getUpgradeHexMultiplier;
window.getS2HexMultiplier = getS2HexMultiplier;
window.getS3HexMultiplier = getS3HexMultiplier;
window.getTreeAgeSwandyMultiplier = getTreeAgeSwandyMultiplier;
window.getTreeAgeSwandyCapMultiplier = getTreeAgeSwandyCapMultiplier;
window.updateHexagonOverlay = updateHexagonOverlay;
window.createHexagonOverlay = createHexagonOverlay;
window.interactWithHalloweenPeachy = interactWithHalloweenPeachy;
window.interactWithPeachy = interactWithPeachy;
window.showHalloweenPeachySpeech = showHalloweenPeachySpeech;
window.startHalloweenPeachyAutoSpeech = startHalloweenPeachyAutoSpeech;
window.stopHalloweenPeachyAutoSpeech = stopHalloweenPeachyAutoSpeech;
window.getHalloweenPeachyQuotes = getHalloweenPeachyQuotes;
window.halloweenPeachyQuotes = halloweenPeachyQuotes;
window.hexedPeachyQuotes = hexedPeachyQuotes;
window.trickOrTreat = trickOrTreat;
window.buyHalloweenUpgrade = buyHalloweenUpgrade;
window.updateHalloweenUI = updateHalloweenUI;
window.getHalloweenSoapImage = getHalloweenSoapImage;
window.updateHalloweenSoapImages = updateHalloweenSoapImages;
window.getHalloweenMysticImage = getHalloweenMysticImage;
window.updateHalloweenMysticImages = updateHalloweenMysticImages;
window.getHalloweenTicoImage = getHalloweenTicoImage;
window.updateHalloweenTicoImages = updateHalloweenTicoImages;
window.getHalloweenLepreImage = getHalloweenLepreImage;
window.updateHalloweenLepreImages = updateHalloweenLepreImages;

// Debug function to reset Halloween event unlock status
function resetHalloweenEventUnlock() {
  if (!window.state.unlockedFeatures) {
    window.state.unlockedFeatures = {};
  }
  
  // Keep Halloween event unlocked but reset the candy tokens given counter
  // This allows you to keep the toggle while testing the unlock mechanism
  window.state.unlockedFeatures.halloweenEvent = true;
  
  // Reset candy tokens given counter only
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  
  // Update button display
  if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
    window.updateHalloweenEventButtonDisplay();
  }
  
  // Ensure Halloween event toggle is available in settings
  if (typeof window.addHalloweenEventToggleButton === 'function') {
    setTimeout(() => {
      window.addHalloweenEventToggleButton();
    }, 100);
  }
  
  
  if (typeof window.showNotification === 'function') {
    window.showNotification('🎃 Candy token counter reset for testing! Halloween toggle preserved.', 'info');
  }
}

// Alternative function to completely reset Halloween event (if needed)
function completelyResetHalloweenEvent() {
  if (!window.state.unlockedFeatures) {
    window.state.unlockedFeatures = {};
  }
  
  // Completely reset Halloween event unlock
  window.state.unlockedFeatures.halloweenEvent = false;
  
  // Reset Halloween event state
  window.state.halloweenEventActive = false;
  
  // Reset candy tokens given counter
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  
  // Update button display
  if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
    window.updateHalloweenEventButtonDisplay();
  }
  
  // Remove Halloween event toggle from settings if present
  const existingToggle = document.getElementById('halloweenEventToggleCheckbox');
  if (existingToggle && existingToggle.parentNode && existingToggle.parentNode.parentNode) {
    existingToggle.parentNode.parentNode.remove();
  }
  
  
  if (typeof window.showNotification === 'function') {
    window.showNotification('🎃 Halloween event completely reset! Redeem code to unlock again.', 'warning');
  }
}

window.resetHalloweenEventUnlock = resetHalloweenEventUnlock;
window.completelyResetHalloweenEvent = completelyResetHalloweenEvent;

// Get Halloween Fluzzer character image based on state and phase
function getHalloweenFluzzerImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Fluzzer images when Halloween is not active
    // Check if enhanced state (3+ total infinity)
    const totalInfinity = window.infinitySystem?.totalInfinityEarned || 0;
    const isEnhanced = totalInfinity >= 3;
    
    switch (imageType) {
      case 'speech': return isEnhanced ? 'assets/icons/fluzzer talking 1.png' : 'assets/icons/fluzzer talking.png';
      case 'sleep': return isEnhanced ? 'assets/icons/fluzzer sleeping 1.png' : 'assets/icons/fluzzer sleeping.png';
      case 'sleep_talk': return isEnhanced ? 'assets/icons/fluzzer sleep talking 1.png' : 'assets/icons/fluzzer sleep talking.png';
      default: return isEnhanced ? 'assets/icons/fluzzer 1.png' : 'assets/icons/fluzzer.png';
    }
  }
  
  // Return Halloween Fluzzer images when Halloween is active
  // Check if enhanced state (3+ total infinity)
  const totalInfinity = window.infinitySystem?.totalInfinityEarned || 0;
  const isEnhanced = totalInfinity >= 3;
  
  switch (imageType) {
    case 'speech': return isEnhanced ? 'assets/icons/halloween fluzzer speech1.png' : 'assets/icons/halloween fluzzer speech.png';
    case 'sleep': return isEnhanced ? 'assets/icons/halloween fluzzer sleep1.png' : 'assets/icons/halloween fluzzer sleep.png';
    case 'sleep_talk': return isEnhanced ? 'assets/icons/halloween fluzzer sleep talk1.png' : 'assets/icons/halloween fluzzer sleep talk.png';
    default: return isEnhanced ? 'assets/icons/halloween fluzzer1.png' : 'assets/icons/halloween fluzzer.png';
  }
}

// Update all Fluzzer character images to use Halloween versions when active
function updateHalloweenFluzzerImages() {
  // Update terrarium tab Fluzzer image
  const terrariumFluzzerImg = document.getElementById('fluzzerCharacterImage');
  if (terrariumFluzzerImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (terrariumFluzzerImg.src.includes('talking')) {
      imageType = 'speech';
    } else if (terrariumFluzzerImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    } else if (terrariumFluzzerImg.src.includes('sleeping')) {
      imageType = 'sleep';
    }
    terrariumFluzzerImg.src = getHalloweenFluzzerImage(imageType);
  }
  
  // Update terrarium tab Fluzzer speaking image
  const terrariumFluzzerSpeakingImg = document.getElementById('fluzzerCharacterSpeaking');
  if (terrariumFluzzerSpeakingImg) {
    // Determine current state based on current image
    let imageType = 'speech';
    if (terrariumFluzzerSpeakingImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    }
    terrariumFluzzerSpeakingImg.src = getHalloweenFluzzerImage(imageType);
  }
  
  // Update nectarize tab Fluzzer image
  const nectarizeFluzzerImg = document.getElementById('nectarizeFluzzerImage');
  if (nectarizeFluzzerImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (nectarizeFluzzerImg.src.includes('talking')) {
      imageType = 'speech';
    } else if (nectarizeFluzzerImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    } else if (nectarizeFluzzerImg.src.includes('sleeping')) {
      imageType = 'sleep';
    }
    nectarizeFluzzerImg.src = getHalloweenFluzzerImage(imageType);
  }
  
  // Update nectarize tab Fluzzer speaking image
  const nectarizeFluzzerSpeakingImg = document.getElementById('nectarizeFluzzerSpeaking');
  if (nectarizeFluzzerSpeakingImg) {
    // Determine current state based on current image
    let imageType = 'speech';
    if (nectarizeFluzzerSpeakingImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    }
    nectarizeFluzzerSpeakingImg.src = getHalloweenFluzzerImage(imageType);
  }
}

window.getHalloweenFluzzerImage = getHalloweenFluzzerImage;
window.updateHalloweenFluzzerImages = updateHalloweenFluzzerImages;

// Halloween Peachy/Swaria Image Functions
function getHalloweenPeachyImage(imageType = 'normal') {
  // Check if Peachy is hexed
  const isHexed = window.state && 
                  window.state.halloweenEvent && 
                  window.state.halloweenEvent.jadeca && 
                  window.state.halloweenEvent.jadeca.peachyIsHexed;
  
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Swaria images when Halloween is not active
    if (isHexed) {
      switch (imageType) {
        case 'speech':
        case 'talking':
          return 'assets/icons/hexed swa speech.png';
        default:
          return 'assets/icons/hexed swa.png';
      }
    }
    
    switch (imageType) {
      case 'speech':
      case 'talking':
        return 'swa talking.png';
      default:
        return 'swa normal.png';
    }
  }
  
  // Return Halloween Peachy images when Halloween is active
  if (isHexed) {
    switch (imageType) {
      case 'speech':
      case 'talking':
        return 'assets/icons/halloween hexed swa speech.png';
      default:
        return 'assets/icons/halloween hexed swa.png';
    }
  }
  
  switch (imageType) {
    case 'speech':
    case 'talking':
      return 'assets/icons/halloween peachy speech.png';
    default:
      return 'assets/icons/halloween peachy.png';
  }
}

function updateHalloweenPeachyImages() {
  // Update cafeteria dialogue Peachy images
  const cafeteriaPeachyImages = document.querySelectorAll('.character-image');
  cafeteriaPeachyImages.forEach(img => {
    if (img.src && (img.src.includes('swa') || img.src.includes('peachy'))) {
      const isHalloweenActive = window.state && window.state.halloweenEventActive;
      if (img.classList.contains('speaking') || img.src.includes('talking') || img.src.includes('speech')) {
        img.src = getHalloweenPeachyImage('speech');
      } else {
        img.src = getHalloweenPeachyImage('normal');
      }
    }
  });
}

window.getHalloweenPeachyImage = getHalloweenPeachyImage;
window.updateHalloweenPeachyImages = updateHalloweenPeachyImages;

// Helper function to update all Halloween character images at once
function updateAllHalloweenCharacterImages() {
  if (typeof updateHalloweenSoapImages === 'function') {
    updateHalloweenSoapImages();
  }
  if (typeof updateHalloweenMysticImages === 'function') {
    updateHalloweenMysticImages();
  }
  if (typeof updateHalloweenTicoImages === 'function') {
    updateHalloweenTicoImages();
  }
  if (typeof updateHalloweenLepreImages === 'function') {
    updateHalloweenLepreImages();
  }
  if (typeof updateHalloweenFluzzerImages === 'function') {
    updateHalloweenFluzzerImages();
  }
  if (typeof updateHalloweenPeachyImages === 'function') {
    updateHalloweenPeachyImages();
  }
}

window.updateAllHalloweenCharacterImages = updateAllHalloweenCharacterImages;
window.getHalloweenFluffMultiplier = getHalloweenFluffMultiplier;
window.getHalloweenGeneratorSpeedMultiplier = getHalloweenGeneratorSpeedMultiplier;

// Update Halloween UI when page becomes visible
function onHalloweenPageVisible() {
  updateHalloweenUI();
  
  // Restore the current sub-tab
  const halloweenState = window.state.halloweenEvent;
  if (halloweenState.currentSubTab) {
    switchHalloweenSubTab(halloweenState.currentSubTab);
  }
  
  // Restore Halloween Peachy image state
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  if (peachyImage && halloweenState.peachy) {
    // Check if hexed and use appropriate image
    const isHexed = window.state && 
                    window.state.halloweenEvent && 
                    window.state.halloweenEvent.jadeca && 
                    window.state.halloweenEvent.jadeca.peachyIsHexed;
    
    if (isHexed) {
      // Use hexed image instead of stored currentImage
      const isTalking = halloweenState.peachy.currentImage && halloweenState.peachy.currentImage.includes('speech');
      peachyImage.src = isTalking ? 'assets/icons/halloween hexed swa speech.png' : 'assets/icons/halloween hexed swa.png';
    } else {
      peachyImage.src = halloweenState.peachy.currentImage || 'assets/icons/halloween peachy.png';
    }
  }
  
  // Show Halloween bottom navigation
  const regularBottomNav = document.getElementById('bottomNav');
  const halloweenBottomNav = document.getElementById('halloweenBottomNav');
  if (regularBottomNav) regularBottomNav.style.display = 'none';
  if (halloweenBottomNav) halloweenBottomNav.style.display = 'flex';
  
  // Ensure Halloween background classes are applied
  document.body.classList.add('halloween-active');
  document.documentElement.classList.add('halloween-active');
  
  // Start auto speech system for Halloween Peachy
  startHalloweenPeachyAutoSpeech();
  
  // Resume Halloween music
  playHalloweenMusic();
  
  // Update Halloween character images
  if (typeof updateHalloweenSoapImages === 'function') {
    updateHalloweenSoapImages();
  }
  if (typeof updateHalloweenMysticImages === 'function') {
    updateHalloweenMysticImages();
  }
  if (typeof updateHalloweenTicoImages === 'function') {
    updateHalloweenTicoImages();
  }
  if (typeof updateHalloweenLepreImages === 'function') {
    updateHalloweenLepreImages();
  }
  if (typeof updateHalloweenFluzzerImages === 'function') {
    updateHalloweenFluzzerImages();
  }
  if (typeof updateHalloweenPeachyImages === 'function') {
    updateHalloweenPeachyImages();
  }
  
  // Force update digital clock to show Halloween time
  if (typeof window.updateDigitalClock === 'function') {
    window.updateDigitalClock();
  }
}

// Hook into page switch system to update UI when Halloween page becomes visible
const originalSwitchPage = window.switchPage;
window.switchPage = function(pageId) {
  // Stop auto speech and music when leaving Halloween page
  if (pageId !== 'halloweenEvent') {
    stopHalloweenPeachyAutoSpeech();
    stopHalloweenMusic();
    halloweenMusicRolled = false;
    
    // Force update digital clock when leaving Halloween to restore normal time
    if (typeof window.updateDigitalClock === 'function') {
      window.updateDigitalClock();
    }
  }
  
  originalSwitchPage(pageId);
  
  if (pageId === 'halloweenEvent') {
    onHalloweenPageVisible();
  }
  
  // Update Tree Age UI visibility based on current page
  if (typeof updateTreeAgeUI === 'function') {
    updateTreeAgeUI();
  }
  
  // Update Halloween cargo theme when switching pages
  if (typeof updateHalloweenCargoTheme === 'function') {
    updateHalloweenCargoTheme();
  }
};

// Simple toast notification system for Halloween events
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `halloween-toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Add CSS animations for toasts
const toastStyles = document.createElement('style');
toastStyles.textContent = `
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(toastStyles);

// Halloween Cargo Theme Functions
function applyHalloweenCargoTheme() {
  // Apply Halloween theme to both html and body for full coverage
  document.documentElement.classList.add('halloween-cargo-active');
  document.body.classList.add('halloween-cargo-active');
  
  // Add Halloween decoration elements
  addHalloweenDecorations();
  
  // Apply theme to specific time backgrounds
  applyHalloweenTimeBackgrounds();
}

function removeHalloweenCargoTheme() {
  // Remove Halloween theme from both html and body
  document.documentElement.classList.remove('halloween-cargo-active');
  document.body.classList.remove('halloween-cargo-active');
  
  // Remove Halloween decorations
  removeHalloweenDecorations();
  
  // Restore normal time backgrounds
  restoreNormalTimeBackgrounds();
}

function addHalloweenDecorations() {
  // Only add Halloween themed cursor effects (respects cursor setting)
  if (typeof updateHalloweenCursorEffects === 'function') {
    updateHalloweenCursorEffects();
  }
}

function removeHalloweenDecorations() {
  // Remove Halloween sparkles
  const sparkles = document.querySelectorAll('.halloween-sparkles');
  sparkles.forEach(sparkle => sparkle.remove());
  
  // Remove cursor effects
  removeHalloweenCursorEffects();
}

function addHalloweenCursorEffects() {
  // Only add Halloween cursors if user has cursor setting set to "special"
  if (window.settings && window.settings.cursor !== "special") {
    return; // Don't apply Halloween cursors if cursor setting is not "special"
  }
  
  // Add Halloween cursors for full page
  if (!document.querySelector('#halloween-cursor-trail')) {
    const trailStyle = document.createElement('style');
    trailStyle.id = 'halloween-cursor-trail';
    trailStyle.textContent = `
      /* Halloween cursor for entire page including edges - only when cursor setting is "special" */
      body.halloween-cargo-active,
      body.halloween-cargo-active *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      html.halloween-cargo-active,
      html.halloween-cargo-active *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active,
      body.halloween-event-active *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      html.halloween-event-active,
      html.halloween-event-active *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *) {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='%23ff9500' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
      }
      
      /* Ensure normal cursor for Halloween Peachy character */
      .halloween-peachy-container,
      .halloween-peachy-container *,
      #halloweenPeachyCharacter,
      #halloweenPeachy,
      #halloweenPeachy * {
        cursor: none !important;
      }
      
      /* Ensure full viewport coverage - only when cursor setting is "special" */
      body.halloween-cargo-active::before,
      body.halloween-event-active::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='%23ff9500' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
        pointer-events: none;
        z-index: -1;
      }
      
      /* Force normal cursor for Halloween Peachy with highest specificity */
      body.halloween-cargo-active .halloween-peachy-container,
      body.halloween-cargo-active .halloween-peachy-container *,
      body.halloween-cargo-active #halloweenPeachyCharacter,
      body.halloween-cargo-active #halloweenPeachy,
      body.halloween-cargo-active #halloweenPeachy *,
      body.halloween-event-active .halloween-peachy-container,
      body.halloween-event-active .halloween-peachy-container *,
      body.halloween-event-active #halloweenPeachyCharacter,
      body.halloween-event-active #halloweenPeachy,
      body.halloween-event-active #halloweenPeachy *,
      html.halloween-cargo-active .halloween-peachy-container,
      html.halloween-cargo-active .halloween-peachy-container *,
      html.halloween-cargo-active #halloweenPeachyCharacter,
      html.halloween-cargo-active #halloweenPeachy,
      html.halloween-cargo-active #halloweenPeachy *,
      html.halloween-event-active .halloween-peachy-container,
      html.halloween-event-active .halloween-peachy-container *,
      html.halloween-event-active #halloweenPeachyCharacter,
      html.halloween-event-active #halloweenPeachy,
      html.halloween-event-active #halloweenPeachy * {
        cursor: pointer !important;
      }
      
      /* Special cursor for character interactions */
      body.halloween-cargo-active #swariaCharacter,
      body.halloween-cargo-active .character-image:not(#halloweenPeachyCharacter),
      body.halloween-event-active #swariaCharacter,
      body.halloween-event-active .character-image:not(#halloweenPeachyCharacter) {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z' fill='%23ff9500' opacity='1'/%3E%3Cpath d='M12 3 L14 9 L20 12 L14 15 L12 21 L10 15 L4 12 L10 9 Z' fill='%23ffcc66' opacity='0.8'/%3E%3Ccircle cx='12' cy='12' r='2' fill='%23fff' opacity='0.9'/%3E%3C/svg%3E") 12 12, pointer !important;
      }
      
      /* Override for Halloween Peachy - always use normal pointer */
      body.halloween-cargo-active #halloweenPeachyCharacter,
      body.halloween-cargo-active .halloween-peachy-container,
      body.halloween-cargo-active .halloween-peachy-container *,
      body.halloween-event-active #halloweenPeachyCharacter,
      body.halloween-event-active .halloween-peachy-container,
      body.halloween-event-active .halloween-peachy-container *,
      html.halloween-cargo-active #halloweenPeachyCharacter,
      html.halloween-cargo-active .halloween-peachy-container,
      html.halloween-cargo-active .halloween-peachy-container *,
      html.halloween-event-active #halloweenPeachyCharacter,
      html.halloween-event-active .halloween-peachy-container,
      html.halloween-event-active .halloween-peachy-container * {
        cursor: none !important;
        pointer-events: auto !important;
        z-index: 1000 !important;
      }
      
      /* Text input cursor */
      body.halloween-cargo-active input[type="text"],
      body.halloween-cargo-active input[type="number"],
      body.halloween-cargo-active textarea,
      body.halloween-event-active input[type="text"],
      body.halloween-event-active input[type="number"],
      body.halloween-event-active textarea {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='%23ff9500' opacity='0.6'/%3E%3Cline x1='10' y1='4' x2='10' y2='16' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 10 10, text !important;
      }
    `;
    document.head.appendChild(trailStyle);
  }
}

function removeHalloweenCursorEffects() {
  const trailStyle = document.querySelector('#halloween-cursor-trail');
  if (trailStyle) {
    trailStyle.remove();
  }
}

function applyHalloweenTimeBackgrounds() {
  // Halloween backgrounds are now handled by CSS only
}

function getCurrentThemeTime() {
  // Try to get current time theme from existing system
  if (window.state && window.state.theme) {
    return window.state.theme;
  }
  
  // Fallback to checking HTML data attributes or CSS classes
  const html = document.documentElement;
  if (html.dataset.theme === 'dusk') return 'dusk';
  if (html.dataset.theme === 'night') return 'night';
  return 'day';
}

function addHalloweenBackgroundOverlay() {
  // Remove existing overlay
  const existingOverlay = document.querySelector('#halloween-bg-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create Halloween atmosphere overlay
  const overlay = document.createElement('div');
  overlay.id = 'halloween-bg-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(255, 149, 0, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(139, 69, 19, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: halloweenAtmosphere 15s ease-in-out infinite;
  `;
  
  const homeSection = document.getElementById('home');
  if (homeSection) {
    homeSection.style.position = 'relative';
    homeSection.insertBefore(overlay, homeSection.firstChild);
  }
}

function removeHalloweenBackgroundOverlay() {
  const overlay = document.querySelector('#halloween-bg-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function restoreNormalTimeBackgrounds() {
  // Remove Halloween background overlay
  removeHalloweenBackgroundOverlay();
}

// Update Halloween cargo theme based on toggle state
function updateHalloweenCargoTheme() {
  const isActive = window.state && window.state.halloweenEventActive;
  
  if (isActive) {
    applyHalloweenCargoTheme();
  } else {
    removeHalloweenCargoTheme();
  }
  
  // Update mixing/cauldron interface when Halloween mode changes
  if (typeof window.updateMixingTitles === 'function') {
    window.updateMixingTitles();
  }
}

// Hook into sub-tab switching to update Halloween theme
if (typeof window.switchHomeSubTab !== 'undefined' && !window._halloweenSwitchHomeSubTabOverridden) {
  const originalSwitchHomeSubTab = window.switchHomeSubTab;
  window.switchHomeSubTab = function(subTabId) {
    originalSwitchHomeSubTab.call(this, subTabId);
    
    // Update Halloween cargo theme when switching to cargo sub-tab
    if (typeof updateHalloweenCargoTheme === 'function') {
      // Small delay to ensure tab switch completes
      setTimeout(updateHalloweenCargoTheme, 50);
    }
  };
  window._halloweenSwitchHomeSubTabOverridden = true;
}

// Initialize Halloween cargo theme on page load
document.addEventListener('DOMContentLoaded', function() {
  if (typeof updateHalloweenCargoTheme === 'function') {
    updateHalloweenCargoTheme();
  }
});

// Hook into Halloween toggle function to ensure immediate theme updates
function hookHalloweenToggle() {
  // Hook updateHalloweenEventState if it exists
  if (typeof window.updateHalloweenEventState === 'function' && !window._halloweenUpdateStateHooked) {
    const originalUpdateHalloweenEventState = window.updateHalloweenEventState;
    window.updateHalloweenEventState = function() {
      
      // Call original function first
      originalUpdateHalloweenEventState.call(this);
      
      // Force immediate visual updates when Halloween state changes
      setTimeout(() => {
        if (window.state && window.state.halloweenEventActive) {
          // Halloween is being enabled
          if (typeof forceHalloweenThemeUpdate === 'function') {
            forceHalloweenThemeUpdate();
          } else {
            // Fallback direct application
            const currentPage = document.querySelector('.page.active');
            if (currentPage && currentPage.id === 'home') {
              document.body.classList.add('halloween-cargo-active');
              if (typeof applyHalloweenCargoTheme === 'function') {
                applyHalloweenCargoTheme();
              }
            } else if (currentPage && currentPage.id === 'halloweenEvent') {
              document.body.classList.add('halloween-event-active');
            }
            
            // Initialize Halloween cursors (respects cursor setting)
            if (typeof updateHalloweenCursorEffects === 'function') {
              updateHalloweenCursorEffects();
            }
            
            // Apply Halloween background styling
            document.body.style.setProperty('--halloween-active', '1');
          }
        } else {
          // Halloween is being disabled
          if (typeof cleanupHalloweenEventSystems === 'function') {
            cleanupHalloweenEventSystems();
          }
        }
        
        if (typeof updateHalloweenCargoTheme === 'function') {
          updateHalloweenCargoTheme();
        }
      }, 10); // Reduced delay for immediate response
    };
    window._halloweenUpdateStateHooked = true;
  }
  
  // Also hook toggleHalloweenEvent directly if it exists
  if (typeof window.toggleHalloweenEvent === 'function' && !window._halloweenToggleHooked) {
    const originalToggleHalloweenEvent = window.toggleHalloweenEvent;
    window.toggleHalloweenEvent = function() {
      
      // Call original function
      originalToggleHalloweenEvent.call(this);
      
      // Additional immediate updates
      setTimeout(() => {
        if (window.state && window.state.halloweenEventActive) {
          if (typeof forceHalloweenThemeUpdate === 'function') {
            forceHalloweenThemeUpdate();
          }
        }
      }, 20);
    };
    window._halloweenToggleHooked = true;
  }
}

// Direct checkbox event listener as additional backup
function addHalloweenCheckboxListener() {
  const checkbox = document.getElementById('halloweenEventToggleCheckbox');
  if (checkbox && !checkbox._halloweenListenerAdded) {
    checkbox.addEventListener('change', function(e) {
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        if (window.state && window.state.halloweenEventActive) {
          if (typeof forceHalloweenThemeUpdate === 'function') {
            forceHalloweenThemeUpdate();
          }
        } else {
          if (typeof cleanupHalloweenEventSystems === 'function') {
            cleanupHalloweenEventSystems();
          }
        }
      }, 50);
    });
    checkbox._halloweenListenerAdded = true;
  }
}

// Try to hook immediately, then retry periodically until successful
hookHalloweenToggle();
addHalloweenCheckboxListener();

// Retry hooks periodically until successful
const hookRetryInterval = setInterval(() => {
  hookHalloweenToggle();
  addHalloweenCheckboxListener();
  
  // Stop retrying after both hooks are established and checkbox listener is added
  if (window._halloweenUpdateStateHooked && window._halloweenToggleHooked) {
    const checkbox = document.getElementById('halloweenEventToggleCheckbox');
    if (!checkbox || checkbox._halloweenListenerAdded) {
      clearInterval(hookRetryInterval);
    }
  }
}, 1000);

// Hook into existing switchPage function to add Halloween cursor support
if (typeof window.switchPage === 'function' && !window._halloweenSwitchPageOverridden) {
  const originalSwitchPage = window.switchPage;
  window.switchPage = function(pageId) {
    // Call original function
    originalSwitchPage.call(this, pageId);
    
    // Add/remove Halloween event active class for cursor system
    if (pageId === 'halloweenEvent' && window.state && window.state.halloweenEventActive) {
      document.body.classList.add('halloween-event-active');
    } else {
      document.body.classList.remove('halloween-event-active');
    }
  };
  window._halloweenSwitchPageOverridden = true;
}

// Monitor for Halloween event page becoming active using MutationObserver
function initializeHalloweenCursorMonitor() {
  // Check immediately on load
  function checkHalloweenEventPage() {
    const halloweenEventPage = document.getElementById('halloweenEvent');
    if (halloweenEventPage && 
        halloweenEventPage.classList.contains('active') && 
        window.state && 
        window.state.halloweenEventActive) {
      document.body.classList.add('halloween-event-active');
    } else {
      document.body.classList.remove('halloween-event-active');
    }
  }

  // Set up observer to watch for page changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
        checkHalloweenEventPage();
      }
    });
  });

  // Observe all page elements for class/style changes
  document.querySelectorAll('.page').forEach(page => {
    observer.observe(page, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });
  });

  // Hook into the main navigation system from script.js
  function hookMainNavigation() {
    document.querySelectorAll('.navBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Small delay to let the main navigation complete
        setTimeout(checkHalloweenEventPage, 100);
      });
    });
  }

  // Also check periodically as a backup
  setInterval(checkHalloweenEventPage, 1000);
  
  // Check immediately
  checkHalloweenEventPage();
  
  // Hook into navigation after a small delay to ensure main script loads first
  setTimeout(hookMainNavigation, 2000);
}

// Initialize the monitor when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHalloweenCursorMonitor);
} else {
  initializeHalloweenCursorMonitor();
}

// Helper function to check if any special cursors are active
function isAnySpecialCursorActive() {
  // Check for anomaly resolver
  if (window.anomalySystem && window.anomalySystem.findModeActive) {
    return true;
  }
  
  // Check for terrarium tools
  if (window.pollenWandActive || window.wateringCanActive) {
    return true;
  }
  
  // Check for any CSS classes that indicate special cursors
  if (document.body.classList.contains('anomaly-resolver-cursor') ||
      document.body.classList.contains('pollen-wand-cursor') ||
      document.body.classList.contains('watering-can-cursor') ||
      document.body.classList.contains('pollen-wand-mode') ||
      document.body.classList.contains('watering-can-mode') ||
      document.body.classList.contains('special-cursor-active')) {
    return true;
  }
  
  return false;
}

// Function to hide all spinning cursors when special cursors become active
function hideAllSpinningCursors() {
  // Remove spinning cursor classes (kept for compatibility)
  document.body.classList.remove('halloween-cursor-spinning');
  document.documentElement.classList.remove('halloween-cursor-spinning');
  document.body.classList.remove('base-cursor-spinning');
  document.documentElement.classList.remove('base-cursor-spinning');
}

// Base Game Cursor System (using dynamic color based on settings)
function getColorPalette(colorSetting) {
  switch(colorSetting) {
    case 'green':
      return {
        primary: '%2327ae60',    // #27ae60
        secondary: '%2316a085',  // #16a085
        accent: '%235dde85'      // #5dde85
      };
    case 'blue':
      return {
        primary: '%233498db',    // #3498db
        secondary: '%232980b9',  // #2980b9
        accent: '%235dade2'      // #5dade2
      };
    case 'pink':
      return {
        primary: '%23e91e63',    // #e91e63
        secondary: '%23c2185b',  // #c2185b
        accent: '%23f48fb1'      // #f48fb1
      };
    default:
      return {
        primary: '%2327ae60',    // Default to green
        secondary: '%2316a085',
        accent: '%235dde85'
      };
  }
}

function addBaseGameCursorEffects() {
  // Remove any existing base game cursor styles
  const existingBaseStyles = document.getElementById('baseGameCursorStyles');
  if (existingBaseStyles) {
    existingBaseStyles.remove();
  }

  // Get current color setting
  const currentColor = (window.settings && window.settings.colour) || 'green';
  const colors = getColorPalette(currentColor);

  // Create style element for base game cursors
  const baseStyle = document.createElement('style');
  baseStyle.id = 'baseGameCursorStyles';
  baseStyle.textContent = `
    /* Base game cursor for entire page - only when no special cursors are active */
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active),
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) *:not([style*="cursor"]):not(.custom-cursor),
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active),
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) *:not([style*="cursor"]):not(.custom-cursor) {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto;
    }
    
    /* Base game cursor - using body element directly when no darkness effect */
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active):not(.global-darkness),
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active):not(.global-darkness) * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
    }
    
    /* Base game cursor during darkness effect - apply to html to avoid interfering with darkness overlay */
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) body.global-darkness,
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) body.global-darkness * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
    }
    
    /* Special cursor for character interactions (base game) */
    body:not(.halloween-cargo-active):not(.halloween-event-active) #swariaCharacter,
    body:not(.halloween-cargo-active):not(.halloween-event-active) .character-image {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z' fill='${colors.primary}' opacity='1'/%3E%3Cpath d='M12 3 L14 9 L20 12 L14 15 L12 21 L10 15 L4 12 L10 9 Z' fill='${colors.accent}' opacity='0.8'/%3E%3Ccircle cx='12' cy='12' r='2' fill='%23fff' opacity='0.9'/%3E%3C/svg%3E") 12 12, pointer !important;
    }
    
    /* Text input cursor (base game) */
    body:not(.halloween-cargo-active):not(.halloween-event-active) input[type="text"],
    body:not(.halloween-cargo-active):not(.halloween-event-active) input[type="number"],
    body:not(.halloween-cargo-active):not(.halloween-event-active) textarea {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.6'/%3E%3Cline x1='10' y1='4' x2='10' y2='16' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 10 10, text !important;
    }
  `;
  document.head.appendChild(baseStyle);
}

// Initialize base game cursor system
function initializeBaseGameCursors() {
  // Only add cursor effects if cursor setting is "special"
  if (window.settings && window.settings.cursor === "special") {
    addBaseGameCursorEffects();
  }
}

// Update cursor colors when settings change
function updateBaseGameCursorColors() {
  // Only regenerate cursor effects if cursor setting is "special"
  if (window.settings && window.settings.cursor === "special") {
    addBaseGameCursorEffects();
  }
}

// Update Halloween cursor effects when cursor setting changes
function updateHalloweenCursorEffects() {
  // Remove existing Halloween cursor styles first
  const existingHalloweenStyles = document.getElementById('halloween-cursor-trail');
  if (existingHalloweenStyles) {
    existingHalloweenStyles.remove();
  }
  
  // Only re-add if Halloween is active and cursor setting is "special"
  if (window.state && window.state.halloweenEventActive && 
      window.settings && window.settings.cursor === "special") {
    addHalloweenCursorEffects();
  }
}

// Remove all cursor effects (for normal cursor mode)
function removeAllCursorEffects() {
  // Remove ALL cursor style elements
  const styleIds = ['baseCursorEffectsStyle', 'halloweenCursorStyles', 'halloween-cursor-trail', 'baseGameCursorStyles'];
  styleIds.forEach(id => {
    const style = document.getElementById(id);
    if (style) {
      style.remove();
    }
  });
  
  // Remove Halloween cursor effects
  if (typeof removeHalloweenCursorEffects === 'function') {
    removeHalloweenCursorEffects();
  }
  
  // Remove ALL cursor-related CSS classes from body and document element
  const classesToRemove = [
    'cursor-special', 
    'base-cursor-spinning',
    'halloween-cursor-spinning',
    'special-cursor-active',
    'halloween-cargo-active',
    'halloween-event-active',
    'anomaly-resolver-cursor',
    'pollen-wand-cursor',
    'watering-can-cursor'
  ];
  
  classesToRemove.forEach(className => {
    document.body.classList.remove(className);
    document.documentElement.classList.remove(className);
  });
  
  // Reset cursor styles on body and document element
  document.body.style.cursor = '';
  document.documentElement.style.cursor = '';
  
  // Remove inline cursor styles from all elements that might have them
  const elementsWithCursor = document.querySelectorAll('[style*="cursor"]');
  elementsWithCursor.forEach(element => {
    // Only remove cursor style, keep other inline styles
    const currentStyle = element.getAttribute('style') || '';
    const newStyle = currentStyle.replace(/cursor\s*:[^;]*;?/gi, '').trim();
    if (newStyle) {
      element.setAttribute('style', newStyle);
    } else {
      element.removeAttribute('style');
    }
  });
}

// Hook into color setting changes
function hookColorSettingChanges() {
  const colorSelect = document.getElementById('colorSelect');
  if (colorSelect) {
    // Store original onchange handler
    const originalOnChange = colorSelect.onchange;
    
    // Create new handler that includes cursor update
    colorSelect.onchange = function(e) {
      // Call original handler first
      if (originalOnChange) {
        originalOnChange.call(this, e);
      }
      
      // Update cursor colors with new setting
      setTimeout(updateBaseGameCursorColors, 100);
    };
  }
}

// Initialize base game cursors when page loads - but only if settings allow it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for settings to be loaded before initializing cursors
    setTimeout(() => {
      if (window.settings && window.settings.cursor === "special") {
        initializeBaseGameCursors();
      }
    }, 100);
    // Delay hooking to ensure main script loads first
    setTimeout(hookColorSettingChanges, 2000);
  });
} else {
  // Wait for settings to be loaded before initializing cursors
  setTimeout(() => {
    if (window.settings && window.settings.cursor === "special") {
      initializeBaseGameCursors();
    }
  }, 100);
  setTimeout(hookColorSettingChanges, 2000);
}

// Global functions
window.applyHalloweenCargoTheme = applyHalloweenCargoTheme;
window.removeHalloweenCargoTheme = removeHalloweenCargoTheme;
window.updateHalloweenCargoTheme = updateHalloweenCargoTheme;
window.initializeBaseGameCursors = initializeBaseGameCursors;
window.updateBaseGameCursorColors = updateBaseGameCursorColors;
window.updateHalloweenCursorEffects = updateHalloweenCursorEffects;
window.removeAllCursorEffects = removeAllCursorEffects;
window.initializeHalloweenCursorMonitor = initializeHalloweenCursorMonitor;
window.startHalloweenPeachyAutoSpeech = startHalloweenPeachyAutoSpeech;
window.stopHalloweenPeachyAutoSpeech = stopHalloweenPeachyAutoSpeech;
window.interactWithHalloweenPeachy = interactWithHalloweenPeachy;
window.switchToHalloweenEvent = switchToHalloweenEvent;
window.initializeHalloweenEventSystems = initializeHalloweenEventSystems;
window.cleanupHalloweenEventSystems = cleanupHalloweenEventSystems;
window.addHalloweenCursorEffects = addHalloweenCursorEffects;
window.forceHalloweenThemeUpdate = forceHalloweenThemeUpdate;
window.isAnySpecialCursorActive = isAnySpecialCursorActive;
window.hideAllSpinningCursors = hideAllSpinningCursors;

// World Map System
function openWorldMap() {
  console.log('[DEBUG] openWorldMap called');
  const modal = document.getElementById('worldMapModal');
  console.log('[DEBUG] modal element:', modal);
  if (modal) {
    console.log('[DEBUG] Setting modal display to flex');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    
    // Force the modal content to be visible too
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.display = 'block';
      modalContent.style.visibility = 'visible';
      modalContent.style.opacity = '1';
      console.log('[DEBUG] Modal content found and made visible');
    }
    
    console.log('[DEBUG] After setting - modal.style.display:', modal.style.display);
    console.log('[DEBUG] Modal computed display:', window.getComputedStyle(modal).display);
    
    // Check again after a tiny delay to see if something is changing it
    setTimeout(() => {
      console.log('[DEBUG] After 100ms - modal.style.display:', modal.style.display);
      console.log('[DEBUG] After 100ms - computed display:', window.getComputedStyle(modal).display);
      console.log('[DEBUG] Modal parent:', modal.parentElement);
      console.log('[DEBUG] Modal offsetWidth:', modal.offsetWidth);
      console.log('[DEBUG] Modal offsetHeight:', modal.offsetHeight);
      console.log('[DEBUG] Modal getBoundingClientRect:', modal.getBoundingClientRect());
    }, 100);
    
    updateWorldMapLocations();
  } else {
    console.error('[DEBUG] worldMapModal element not found!');
  }
}

function closeWorldMap() {
  console.log('[DEBUG] closeWorldMap called');
  const modal = document.getElementById('worldMapModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function updateWorldMapLocations() {
  console.log('[DEBUG] updateWorldMapLocations called');
  const hauntedGroveLocation = document.getElementById('hauntedGroveLocation');
  const hauntedGroveStatus = document.getElementById('hauntedGroveStatus');
  const hauntedGroveCandyCount = document.getElementById('hauntedGroveCandyCount');
  
  console.log('[DEBUG] hauntedGroveLocation element:', hauntedGroveLocation);
  
  // Check if Halloween event was activated (via code redemption)
  const halloweenEventActivated = window.state?.halloweenEventActive || false;
  console.log('[DEBUG] halloweenEventActivated:', halloweenEventActivated);
  console.log('[DEBUG] window.state:', window.state);
  
  if (!hauntedGroveLocation) {
    console.error('[DEBUG] hauntedGroveLocation element not found!');
    return;
  }
  
  // If Halloween event not activated, hide the location entirely
  if (!halloweenEventActivated) {
    console.log('[DEBUG] Halloween not activated, hiding location');
    hauntedGroveLocation.style.display = 'none';
    return;
  }
  
  console.log('[DEBUG] Halloween activated, showing location');
  // Halloween event is activated, show the location
  hauntedGroveLocation.style.display = 'block';
  
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = { candyTokensGiven: new Decimal(0) };
  }
  if (!window.state.halloweenEvent.candyTokensGiven) {
    window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  }
  
  const candyTokensGiven = DecimalUtils.toDecimal(window.state.halloweenEvent.candyTokensGiven);
  
  if (hauntedGroveLocation) {
    hauntedGroveLocation.setAttribute('data-unlocked', 'true');
    hauntedGroveLocation.classList.remove('locked');
    hauntedGroveLocation.classList.add('unlocked');
    hauntedGroveLocation.onclick = travelToHauntedGrove;
    if (hauntedGroveStatus) {
      hauntedGroveStatus.className = 'location-status unlocked';
      hauntedGroveStatus.innerHTML = 'Unlocked';
    }
  }
}

function travelToFluffInc() {
  closeWorldMap();
  if (typeof window.switchPage === 'function') {
    window.switchPage('home');
  }
}

function travelToHauntedGrove() {
  closeWorldMap();
  window.state.halloweenEventActive = true;
  if (typeof switchToHalloweenEvent === 'function') {
    switchToHalloweenEvent();
  }
}

window.openWorldMap = openWorldMap;
window.closeWorldMap = closeWorldMap;
window.updateWorldMapLocations = updateWorldMapLocations;
window.travelToFluffInc = travelToFluffInc;
window.travelToHauntedGrove = travelToHauntedGrove;

// Halloween Vi Costume System
// Initialize Halloween Vi state
if (!window.state.halloweenEvent) {
  window.state.halloweenEvent = {};
}

if (!window.state.halloweenEvent.vi) {
  window.state.halloweenEvent.vi = {
    pokeCount: 0,
    isWearingCostume: false,
    costumeStartTime: 0,
    costumeDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    lastPokeTime: 0,
    speechTimer: null
  };
}

// Halloween Vi costume denial dialogue (progressive stages)
const halloweenViCostumeDialogue = {
  // 0-10 pokes: Denial and scientist costume claims
  denial: [
    "Costume? What costume? I'm already wearing my scientist costume.",
    "This lab coat IS my costume. I'm dressed as a brilliant researcher.",
    "I don't need a costume. My natural scientific aura is costume enough.",
    "These safety goggles are part of my sophisticated scientist ensemble.",
    "My prism tail IS the costume. Very avant-garde, wouldn't you say?",
    "I'm going as 'overworked researcher' this Halloween. Very authentic.",
    "This is my costume - professional, practical, and perfectly scientific.",
    "Why would I need another costume when I already look this academic?",
    "My light stick is a costume prop. I'm obviously a wizard... of science.",
    "The lab equipment around me completes my 'mad scientist' look perfectly."
  ],
  
  // 11-25 pokes: Getting slightly defensive
  defensive: [
    "Fine, maybe my 'costume' could use some work, but I'm busy with research.",
    "I suppose a real costume might be... scientifically interesting to analyze.",
    "Stop poking me about costumes. I have important calculations to finish.",
    "Maybe I could modify my lab coat with some... decorative elements.",
    "A costume would just interfere with my precision optical measurements.",
    "I don't have time to think about costumes when I'm solving light equations.",
    "Perhaps a themed lab coat would be... marginally acceptable.",
    "The other researchers might appreciate a more... festive appearance.",
    "I guess Halloween costumes do have some cultural significance to study.",
    "Fine, I'll consider it, but it has to be scientifically accurate."
  ],
  
  // 26-40 pokes: Warming up to the idea
  warming: [
    "Alright, maybe a proper Halloween costume would be... interesting to try.",
    "I've been researching costume optics. Some designs are surprisingly complex.",
    "A well-designed costume could actually enhance my professional image.",
    "I suppose dressing up is just another form of experimental methodology.",
    "The prismatic effects of costume materials might be worth investigating.",
    "Maybe something that complements my prism tail's natural beauty?",
    "I've seen some costumes with fascinating light-refracting properties.",
    "A costume could be a good way to test public reaction variables.",
    "I'm starting to see the scientific merit in Halloween fashion research.",
    "Perhaps I could design a costume that enhances my research capabilities."
  ],
  
  // 41-49 pokes: Almost convinced
  almostConvinced: [
    "You know what? A costume might actually be a good idea.",
    "I've been thinking about it, and Halloween attire could be... fun.",
    "Maybe I should embrace the seasonal traditions for once.",
    "A proper costume would show I can be social when I want to be.",
    "I could design something that's both festive and scientifically sound.",
    "The other department workers would probably appreciate the effort.",
    "Fine, fine! I'll consider getting a real Halloween costume.",
    "Maybe something that makes my prism tail look even more impressive?",
    "You've almost convinced me. A costume could be... acceptable."
  ],
  
  // 50th poke: Gives in
  convinced: [
    "FINE! You win! I'll put on a proper Halloween costume right now!",
    "Alright, alright! You've worn me down. One Halloween costume, coming up!",
    "You're incredibly persistent. Fine, I'll embrace the Halloween spirit!",
    "I can't believe I'm saying this, but... let me go get my costume.",
    "Your dedication to this costume campaign is actually impressive. You win!"
  ],
  
  // While wearing costume
  costumeActive: [
    "There, happy now? I'm wearing a proper Halloween costume.",
    "I have to admit, this costume is more comfortable than I expected.",
    "The Halloween spirit is... surprisingly enjoyable once you embrace it.",
    "I feel oddly festive in this outfit. Is this what fun feels like?",
    "My prism tail looks even more spectacular with this costume design.",
    "I might actually keep this costume for future Halloween celebrations.",
    "You know, dressing up isn't as unscientific as I thought it would be.",
    "Do you like my costume?",
    "The costume's material has interesting light-scattering properties.",
    "What do you mean painting my fur is not wearing a costume? Look at me! I'm more blue!",
    "I feel more social wearing this. Halloween psychology is fascinating.",
    "You probably won't get my costume, but for those who do, :3",
    "This costume makes me want to participate in more facility festivities.",
    "I should probably thank you for encouraging me to try this.",
    "You wanna know what this costume is supposed to be? It's Vivien Denmark edition.",
    "You wanna know what this costume is supposed to be? Yes.",
    "I should be drinking beer in this costume, But I don't like beer, nor do I have any.",
    "The other researchers seem more approachable when we're all in costume."
  ],
  
  // Costume expired
  costumeExpired: [
    "Well, that was... actually quite enjoyable. But back to work now.",
    "Costume time is over. Back to serious scientific business.",
    "That was a nice break from research, but I have work to finish.",
    "I might consider wearing costumes more often... for scientific purposes.",
    "Halloween is over for now, but I'll remember this experience."
  ]
};

// Halloween Vi poke function that replaces the normal one during Halloween
function pokeHalloweenVi() {
  if (!window.state || !window.state.halloweenEventActive) {
    // Fall back to normal poke function if Halloween isn't active
    if (typeof window.pokeAdvancedPrismCharacter === 'function') {
      window.pokeAdvancedPrismCharacter();
    }
    return;
  }

  const now = Date.now();
  const vi = window.state.halloweenEvent.vi;
  
  // Clear any existing speech timer
  if (vi.speechTimer) {
    clearTimeout(vi.speechTimer);
    vi.speechTimer = null;
  }
  
  // Check if costume is active and if it should expire
  if (vi.isWearingCostume && (now - vi.costumeStartTime) > vi.costumeDuration) {
    // Costume expired
    vi.isWearingCostume = false;
    vi.pokeCount = 0; // Reset poke count after costume expires
    updateHalloweenViImages();
    
    // Show costume expired message
    const expiredMessage = halloweenViCostumeDialogue.costumeExpired[Math.floor(Math.random() * halloweenViCostumeDialogue.costumeExpired.length)];
    showHalloweenViSpeech(expiredMessage);
    return;
  }
  
  // If already wearing costume, show costume dialogue
  if (vi.isWearingCostume) {
    // Check if Vi is sleeping
    const isSleepTime = typeof window.isViSleepTime === 'function' ? window.isViSleepTime() : false;
    
    if (isSleepTime) {
      // Use sleep dialogue from the existing system
      if (typeof window.viSpeechPatterns !== 'undefined' && window.viSpeechPatterns.sleeping) {
        const sleepMessage = window.viSpeechPatterns.sleeping[Math.floor(Math.random() * window.viSpeechPatterns.sleeping.length)];
        showHalloweenViSpeech(sleepMessage);
      } else {
        // Fallback sleep message
        showHalloweenViSpeech("zzz... Halloween dreams... zzz...");
      }
    } else {
      const costumeMessage = halloweenViCostumeDialogue.costumeActive[Math.floor(Math.random() * halloweenViCostumeDialogue.costumeActive.length)];
      showHalloweenViSpeech(costumeMessage);
    }
    return;
  }
  
  // Increment poke count
  vi.pokeCount++;
  vi.lastPokeTime = now;
  
  let message;
  
  if (vi.pokeCount >= 50) {
    // 50th poke - Vi gives in and puts on costume
    message = halloweenViCostumeDialogue.convinced[Math.floor(Math.random() * halloweenViCostumeDialogue.convinced.length)];
    
    // Activate costume
    vi.isWearingCostume = true;
    vi.costumeStartTime = now;
    
    // Update Vi's images to Halloween versions
    updateHalloweenViImages();
    
  } else if (vi.pokeCount >= 41) {
    // 41-49 pokes: Almost convinced
    message = halloweenViCostumeDialogue.almostConvinced[Math.floor(Math.random() * halloweenViCostumeDialogue.almostConvinced.length)];
  } else if (vi.pokeCount >= 26) {
    // 26-40 pokes: Warming up
    message = halloweenViCostumeDialogue.warming[Math.floor(Math.random() * halloweenViCostumeDialogue.warming.length)];
  } else if (vi.pokeCount >= 11) {
    // 11-25 pokes: Defensive
    message = halloweenViCostumeDialogue.defensive[Math.floor(Math.random() * halloweenViCostumeDialogue.defensive.length)];
  } else {
    // 0-10 pokes: Denial
    message = halloweenViCostumeDialogue.denial[Math.floor(Math.random() * halloweenViCostumeDialogue.denial.length)];
  }
  
  showHalloweenViSpeech(message);
}

// Function to show Vi's Halloween speech bubble
function showHalloweenViSpeech(message, duration = 8000) {
  const speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
  const speechText = document.getElementById('viAdvancedPrismSpeechText');
  
  if (!speechBubble || !speechText) {
    return;
  }
  
  // Clear any existing timer
  const vi = window.state.halloweenEvent.vi;
  if (vi.speechTimer) {
    clearTimeout(vi.speechTimer);
  }
  
  // Update to speaking image
  updateHalloweenViSpeechImage(true);
  
  // Show speech
  speechText.textContent = message;
  speechBubble.style.display = 'block';
  
  // Hide speech after duration
  vi.speechTimer = setTimeout(() => {
    speechBubble.style.display = 'none';
    updateHalloweenViSpeechImage(false);
    vi.speechTimer = null;
  }, duration);
}

// Function to update Vi's images for Halloween mode
function updateHalloweenViImages() {
  const vi = window.state.halloweenEvent.vi;
  
  // Get all Vi image elements in Advanced Prism tab
  const viNormal = document.getElementById('viCharacterNormal');
  const viTalking = document.getElementById('viCharacterTalking');
  const viSleeping = document.getElementById('viCharacterSleeping');
  const viSleepTalking = document.getElementById('viCharacterSleepTalking');
  
  if (vi.isWearingCostume) {
    // Use Halloween costume images
    if (viNormal) {
      viNormal.src = 'assets/icons/halloween vivien.png';
    }
    if (viTalking) {
      viTalking.src = 'assets/icons/halloween vivien speech.png';
    }
    if (viSleeping) {
      viSleeping.src = 'assets/icons/halloween vivien sleep.png';
    }
    if (viSleepTalking) {
      viSleepTalking.src = 'assets/icons/halloween vivien sleep talk.png';
    }
    
    // Handle sleep state display when wearing costume
    updateHalloweenViSleepDisplay();
  } else {
    // Use normal Vi images (handled by existing functions)
    if (typeof window.updateViCharacterImage === 'function') {
      window.updateViCharacterImage();
    }
  }
}

// Function to handle Vi's sleep display when wearing Halloween costume
function updateHalloweenViSleepDisplay() {
  const viNormal = document.getElementById('viCharacterNormal');
  const viTalking = document.getElementById('viCharacterTalking');
  const viSleeping = document.getElementById('viCharacterSleeping');
  const viSleepTalking = document.getElementById('viCharacterSleepTalking');
  
  // Check if it's sleep time using existing function
  const isSleepTime = typeof window.isViSleepTime === 'function' ? window.isViSleepTime() : false;
  
  if (isSleepTime) {
    // Show sleeping image, hide others
    if (viNormal) viNormal.style.display = 'none';
    if (viTalking) viTalking.style.display = 'none';
    if (viSleeping) viSleeping.style.display = 'block';
    if (viSleepTalking) viSleepTalking.style.display = 'none';
  } else {
    // Show normal image, hide others
    if (viNormal) viNormal.style.display = 'block';
    if (viTalking) viTalking.style.display = 'none';
    if (viSleeping) viSleeping.style.display = 'none';
    if (viSleepTalking) viSleepTalking.style.display = 'none';
  }
}

// Function to update Vi's speech image state
function updateHalloweenViSpeechImage(isSpeaking) {
  const vi = window.state.halloweenEvent.vi;
  
  // Get Vi image elements
  const viNormal = document.getElementById('viCharacterNormal');
  const viTalking = document.getElementById('viCharacterTalking');
  const viSleeping = document.getElementById('viCharacterSleeping');
  const viSleepTalking = document.getElementById('viCharacterSleepTalking');
  
  if (!viNormal || !viTalking) {
    return;
  }
  
  // Check if it's sleep time
  const isSleepTime = typeof window.isViSleepTime === 'function' ? window.isViSleepTime() : false;
  
  if (vi.isWearingCostume) {
    // Use Halloween images and show/hide appropriately
    if (isSleepTime) {
      // Handle sleep speech
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        viSleeping.style.display = 'none';
        if (viSleepTalking) {
          viSleepTalking.style.display = 'block';
          viSleepTalking.src = 'assets/icons/halloween vivien sleep talk.png';
        }
      } else {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        if (viSleeping) {
          viSleeping.style.display = 'block';
          viSleeping.src = 'assets/icons/halloween vivien sleep.png';
        }
      }
    } else {
      // Handle normal speech
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viTalking.src = 'assets/icons/halloween vivien speech.png';
      } else {
        viTalking.style.display = 'none';
        viNormal.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viNormal.src = 'assets/icons/halloween vivien.png';
      }
    }
  } else {
    // Use normal images and show/hide appropriately
    if (isSleepTime) {
      // Handle sleep speech with normal images
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        viSleeping.style.display = 'none';
        if (viSleepTalking) {
          viSleepTalking.style.display = 'block';
          viSleepTalking.src = 'assets/icons/vivien sleep talking.png';
        }
      } else {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        if (viSleeping) {
          viSleeping.style.display = 'block';
          viSleeping.src = 'assets/icons/vivien sleeping.png';
        }
      }
    } else {
      // Handle normal speech with normal images
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viTalking.src = 'assets/icons/vivien talking.png';
      } else {
        viTalking.style.display = 'none';
        viNormal.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viNormal.src = 'assets/icons/vivien.png';
      }
    }
  }
}

// Function to check if Vi should use Halloween images for sleeping
function getHalloweenViSleepImage() {
  const vi = window.state.halloweenEvent.vi;
  if (vi && vi.isWearingCostume) {
    return {
      normal: 'assets/icons/halloween vivien sleep.png',
      talking: 'assets/icons/halloween vivien sleep talk.png'
    };
  }
  return null;
}

// Function to determine which character is currently displayed in Advanced Prism area
function getCurrentAdvancedPrismCharacter() {
  // Check if characters are swapped
  if (window.advancedPrismState && window.advancedPrismState.imagesSwapped) {
    // When swapped, Swaria (Peachy) is in the Advanced Prism area
    return 'peachy';
  } else {
    // When not swapped, Vi is in the Advanced Prism area
    return 'vivien';
  }
}

// Function to handle Halloween poke for any character in Advanced Prism
function pokeHalloweenAdvancedPrismCharacter() {
  const currentCharacter = getCurrentAdvancedPrismCharacter();
  
  if (currentCharacter === 'vivien') {
    // Use Vi's Halloween costume system
    pokeHalloweenVi();
  } else if (currentCharacter === 'peachy') {
    // Use Peachy's regular Halloween dialogue
    pokeHalloweenPeachy();
  }
}

// Function to handle Halloween poke for Peachy when she's in Advanced Prism
function pokeHalloweenPeachy() {
  const currentTime = Date.now();
  const peachy = window.state.halloweenEvent.peachy;
  
  // Check cooldown (reuse Peachy's existing cooldown system)
  if (currentTime - peachy.lastInteraction < peachy.interactionCooldown) {
    return;
  }
  
  // Update interaction tracking
  peachy.lastInteraction = currentTime;
  peachy.totalInteractions++;
  
  // Get random Halloween Peachy dialogue
  const randomQuote = halloweenPeachyQuotes[Math.floor(Math.random() * halloweenPeachyQuotes.length)];
  
  // Switch to speaking image when in Advanced Prism area
  updateHalloweenPeachySpeechImage();
  
  // Show speech bubble in Advanced Prism area (using Vi's speech bubble elements)
  showHalloweenViSpeech(randomQuote);
  
  // Add friendship points if system exists
  if (window.friendship && window.friendship.addPoints) {
    window.friendship.addPoints('swaria', new Decimal(0.5));
  }
}

// Function to update Peachy's image to speaking version when in Advanced Prism
function updateHalloweenPeachySpeechImage() {
  // When characters are swapped, Peachy is in the 'swariaInAdvanced' element
  const swariaInAdvanced = document.getElementById('swariaInAdvanced');
  
  if (swariaInAdvanced) {
    // Switch to speaking image
    swariaInAdvanced.src = 'assets/icons/halloween peachy speech.png';
  }
}

// Function to update Peachy's image back to normal version
function updateHalloweenPeachyNormalImage() {
  // When characters are swapped, Peachy is in the 'swariaInAdvanced' element
  const swariaInAdvanced = document.getElementById('swariaInAdvanced');
  
  if (swariaInAdvanced) {
    // Switch back to normal Halloween image
    swariaInAdvanced.src = 'assets/icons/halloween peachy.png';
  }
}

// Function to show Peachy's Halloween speech in Advanced Prism area
function showHalloweenViSpeech(message) {
  const speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
  const speechText = document.getElementById('viAdvancedPrismSpeechText');
  
  if (speechBubble && speechText) {
    speechText.textContent = message;
    speechBubble.style.display = 'block';
    
    // Hide speech bubble and switch back to normal image after 8 seconds
    setTimeout(() => {
      if (speechBubble) {
        speechBubble.style.display = 'none';
      }
      // Switch back to normal image
      updateHalloweenPeachyNormalImage();
    }, 8000);
  }
}

// Hook into the existing poke function to override during Halloween
function hookHalloweenViPoke() {
  // Store original poke functions
  if (typeof window.pokeAdvancedPrismCharacter === 'function' && !window._originalPokeAdvancedPrismCharacter) {
    window._originalPokeAdvancedPrismCharacter = window.pokeAdvancedPrismCharacter;
  }
  
  if (typeof window.pokeVi === 'function' && !window._originalPokeVi) {
    window._originalPokeVi = window.pokeVi;
  }
  
  // Override pokeAdvancedPrismCharacter with Halloween version
  window.pokeAdvancedPrismCharacter = function() {
    if (window.state && window.state.halloweenEventActive) {
      pokeHalloweenAdvancedPrismCharacter();
    } else {
      // Call original function if Halloween isn't active
      if (window._originalPokeAdvancedPrismCharacter) {
        window._originalPokeAdvancedPrismCharacter();
      }
    }
  };
  
  // Also override pokeVi directly for safety
  window.pokeVi = function() {
    if (window.state && window.state.halloweenEventActive) {
      pokeHalloweenAdvancedPrismCharacter();
    } else {
      // Call original function if Halloween isn't active
      if (window._originalPokeVi) {
        window._originalPokeVi();
      } else if (window._originalPokeAdvancedPrismCharacter) {
        window._originalPokeAdvancedPrismCharacter();
      }
    }
  };
}

// Hook into Vi image update system to preserve Halloween costume
function hookHalloweenViImageUpdates() {
  // Store original updateViCharacterImage function
  if (typeof window.updateViCharacterImage === 'function' && !window._originalUpdateViCharacterImage) {
    window._originalUpdateViCharacterImage = window.updateViCharacterImage;
  }
  
  // Override updateViCharacterImage to check for Halloween costume
  window.updateViCharacterImage = function() {
    const currentCharacter = getCurrentAdvancedPrismCharacter();
    
    // Only apply Halloween Vi costume system if Vi is actually displayed
    if (currentCharacter === 'vivien' && 
        window.state && window.state.halloweenEventActive && 
        window.state.halloweenEvent && window.state.halloweenEvent.vi && 
        window.state.halloweenEvent.vi.isWearingCostume) {
      
      // Check if costume should expire
      const now = Date.now();
      const vi = window.state.halloweenEvent.vi;
      if ((now - vi.costumeStartTime) > vi.costumeDuration) {
        // Costume expired, remove it
        vi.isWearingCostume = false;
        vi.pokeCount = 0;
        // Fall through to normal update
      } else {
        // Costume is still active, maintain Halloween images
        updateHalloweenViImages();
        return;
      }
    }
    
    // For Peachy or when Vi isn't wearing costume, use normal behavior
    // Call original function for normal behavior
    if (window._originalUpdateViCharacterImage) {
      window._originalUpdateViCharacterImage();
    }
  };
}

// Initialize Halloween Vi system
function initializeHalloweenViSystem() {
  // Ensure base state exists
  if (!window.state) {
    window.state = {};
  }
  
  // Ensure prismCoreSystem is properly initialized with Decimal objects
  if (!window.state.prismCoreSystem) {
    window.state.prismCoreSystem = {
      chargedPrismaInCore: new Decimal(0),
      totalChargedPrismaGiven: new Decimal(0),
      lightBoostFromChargedPrisma: new Decimal(1)
    };
  }
  
  // Ensure all prismCoreSystem properties are Decimal objects
  if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.totalChargedPrismaGiven)) {
    window.state.prismCoreSystem.totalChargedPrismaGiven = new Decimal(window.state.prismCoreSystem.totalChargedPrismaGiven || 0);
  }
  
  if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.chargedPrismaInCore)) {
    window.state.prismCoreSystem.chargedPrismaInCore = new Decimal(window.state.prismCoreSystem.chargedPrismaInCore || 0);
  }
  
  if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.lightBoostFromChargedPrisma)) {
    window.state.prismCoreSystem.lightBoostFromChargedPrisma = new Decimal(window.state.prismCoreSystem.lightBoostFromChargedPrisma || 1);
  }
  
  // Ensure Vi state exists
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  
  if (!window.state.halloweenEvent.vi) {
    window.state.halloweenEvent.vi = {
      pokeCount: 0,
      isWearingCostume: false,
      costumeStartTime: 0,
      costumeDuration: 30 * 60 * 1000,
      lastPokeTime: 0,
      speechTimer: null
    };
  }
  
  // Hook the poke function
  hookHalloweenViPoke();
  
  // Hook into the Vi image update system
  hookHalloweenViImageUpdates();
  
  // Try hooking again after a delay to ensure advanced prism functions are loaded
  setTimeout(() => {
    hookHalloweenViPoke();
    hookHalloweenViImageUpdates();
  }, 2000);
  
  // Update images if needed
  updateHalloweenViImages();
}

// Aggressive hook function that tries multiple times
function ensureHalloweenViHook() {
  let attempts = 0;
  const maxAttempts = 10;
  
  const tryHook = () => {
    attempts++;
    
    if (typeof window.pokeVi === 'function' || typeof window.pokeAdvancedPrismCharacter === 'function') {
      hookHalloweenViPoke();
    }
    
    if (typeof window.updateViCharacterImage === 'function') {
      hookHalloweenViImageUpdates();
    }
    
    if (attempts < maxAttempts && 
        (typeof window.pokeVi !== 'function' || typeof window.updateViCharacterImage !== 'function')) {
      setTimeout(tryHook, 1000);
    }
  };
  
  tryHook();
}

// Cleanup function for when Halloween mode is disabled
function cleanupHalloweenViSystem() {
  // Restore original poke functions
  if (window._originalPokeAdvancedPrismCharacter) {
    window.pokeAdvancedPrismCharacter = window._originalPokeAdvancedPrismCharacter;
  }
  
  if (window._originalPokeVi) {
    window.pokeVi = window._originalPokeVi;
  }
  
  // Restore original image update function
  if (window._originalUpdateViCharacterImage) {
    window.updateViCharacterImage = window._originalUpdateViCharacterImage;
  }
  
  // Clear any active timers
  const vi = window.state.halloweenEvent?.vi;
  if (vi && vi.speechTimer) {
    clearTimeout(vi.speechTimer);
    vi.speechTimer = null;
  }
  
  // Reset costume state
  if (vi) {
    vi.isWearingCostume = false;
  }
  
  // Update images back to normal
  if (typeof window.updateViCharacterImage === 'function') {
    window.updateViCharacterImage();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeHalloweenViSystem, 1000);
  setTimeout(ensureHalloweenViHook, 2000);
});

// Also initialize if DOM is already ready
if (document.readyState !== 'loading') {
  setTimeout(initializeHalloweenViSystem, 1000);
  setTimeout(ensureHalloweenViHook, 2000);
}

// Make functions globally accessible
window.pokeHalloweenVi = pokeHalloweenVi;
window.showHalloweenViSpeech = showHalloweenViSpeech;
window.updateHalloweenViImages = updateHalloweenViImages;
window.getHalloweenViSleepImage = getHalloweenViSleepImage;
window.initializeHalloweenViSystem = initializeHalloweenViSystem;
window.cleanupHalloweenViSystem = cleanupHalloweenViSystem;
window.hookHalloweenViPoke = hookHalloweenViPoke;
window.hookHalloweenViImageUpdates = hookHalloweenViImageUpdates;
window.ensureHalloweenViHook = ensureHalloweenViHook;
// Tree of Horrors Upgrade System - Additional initialization if needed
if (!window.state.halloweenEvent.treeUpgrades) {
  window.state.halloweenEvent.treeUpgrades = {
    purchased: {}
  };
}

// Tree upgrades database
const treeUpgrades = {
  'swandy_start': {
    title: 'The start of the swandy invasion (S1)',
    description: 'Start generating Swandy',
    cost: new Decimal(0),
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['swandy_multiply'] // This upgrade unlocks the next one
  },
  'swandy_multiply': {
    title: 'Multiply them Swandies (S2)',
    description: 'X3 to Swandy production',
    cost: new Decimal(60),
    prerequisite: 'swandy_start', // Requires this upgrade to be visible
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['need_more_swandies'] // This upgrade unlocks the next one
  },
  'need_more_swandies': {
    title: 'Need more swandies (S3)',
    description: 'X2 to Swandy production',
    cost: new Decimal(222),
    prerequisite: 'swandy_multiply', // Requires this upgrade to be visible
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['tree_game_upgrade', 'kp_boost_upgrade', 'crush_swandies'] // This upgrade unlocks upgrades 4, 5, and 10
  },
  'tree_game_upgrade': {
    title: 'Wait is this one of those upgrade tree games? (S4)',
    description: 'Yes, here\'s a X2.5 to swandy production',
    cost: new Decimal(1333),
    prerequisite: 'need_more_swandies', // Requires this upgrade to be purchasable
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['devilish_swandy', 'worst_upgrades'] // This upgrade unlocks upgrades 6 and 8
  },
  'kp_boost_upgrade': {
    title: 'Lets get that KP to use (S5)',
    description: 'KP boost swandy production by ×(1 + log₁₀(KP + 1) × 0.2)',
    cost: new Decimal(7777),
    prerequisite: 'need_more_swandies', // Requires this upgrade to be purchasable
    effect: function() {
      // Enable KP boost for swandy generation
      if (!window.state.halloweenEvent.treeUpgrades.kpBoostEnabled) {
        window.state.halloweenEvent.treeUpgrades.kpBoostEnabled = true;
      }
    },
    unlocks: ['less_devilish_swandy', 'revolution_upcoming'] // This upgrade unlocks upgrades 7 and 9
  },
  'devilish_swandy': {
    title: 'A devilish little bit more swandy (S6)',
    description: '1.666X to Swandy production',
    cost: new Decimal(20000),
    prerequisite: 'tree_game_upgrade', // Requires this upgrade to be purchasable
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'less_devilish_swandy': {
    title: 'An even less devilish bit of swandy (S7)',
    description: '1.333X to swandy production',
    cost: new Decimal(30000),
    prerequisite: 'kp_boost_upgrade', // Requires this upgrade to be purchasable
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'worst_upgrades': {
    title: 'These upgrades keeps getting worst (S8)',
    description: '1.222X to Swandy production',
    cost: new Decimal(45000),
    prerequisite: 'tree_game_upgrade',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['need_more_shards']
  },
  'need_more_shards': {
    title: 'Need more shards? Of course! (S13)',
    description: '1.49X to shard gain',
    cost: new Decimal(2222222),
    prerequisite: 'worst_upgrades',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['excuse_me_price_increase']
  },
  'excuse_me_price_increase': {
    title: 'Excuse me? Sudden price increase (S21)',
    description: 'X2.5 to Swandy Shards',
    cost: new Decimal(12345678999),
    costCurrency: 'swandies',
    prerequisite: 'need_more_shards',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['recovering_from_hexion']
  },
  'recovering_from_hexion': {
    title: 'Recovering from the hexion... (S22)',
    description: 'Here\'s another X2.5 to Swandy Shards',
    cost: new Decimal(55555555555),
    costCurrency: 'swandies',
    prerequisite: 'excuse_me_price_increase',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['tree_age_dilation']
  },
  'tree_age_dilation': {
    title: 'Tree age dilation? (S23)',
    description: 'You\'re making the tree age faster, X2 to tree age',
    cost: new Decimal(20000000000000),
    costCurrency: 'swandies',
    prerequisite: 'recovering_from_hexion',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'revolution_upcoming': {
    title: 'A revolution to swandy production is upcoming (S9)',
    description: '1.111X to swandy production',
    cost: new Decimal(60000),
    prerequisite: 'kp_boost_upgrade',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['just_out_of_reach']
  },
  'just_out_of_reach': {
    title: 'Just out of reach (S14)',
    description: '2.5X to swandy production and 1.5X to Shards gain',
    cost: new Decimal(5100000),
    prerequisite: 'revolution_upcoming',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'crush_swandies': {
    title: 'Lets crush them swandies (S10)',
    description: 'Unlock the swandy crusher',
    cost: new Decimal(150000),
    prerequisite: 'need_more_swandies', // Requires this upgrade to be purchasable
    effect: function() {
      // Unlock the Swandy Crusher sub-tab
      window.state.halloweenEvent.swandyCrusherUnlocked = true;
      
      // Show the Swandy Crusher tab button
      const crusherTab = document.getElementById('swandyCrusherTab');
      if (crusherTab) {
        crusherTab.style.display = 'inline-block';
      }
    },
    unlocks: ['swandy_resety', 'hexed_shard_multi_1'] // This upgrade unlocks upgrade 11 and HSS1
  },
  'hexed_shard_multi_1': {
    title: 'The last hexed swandy shard multiplier (HSS1)',
    description: 'X2 to hexed swandy shard gain',
    cost: new Decimal(5000),
    costCurrency: 'hexedSwandyShards',
    prerequisite: 'crush_swandies',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['hexed_shard_multi_2', 'hexed_shard_multi_3']
  },
  'hexed_shard_multi_2': {
    title: 'Everything is getting expensive, well this too (HSS2)',
    description: 'Tree age boost swandy shard gain',
    cost: new Decimal(300000),
    costCurrency: 'hexedSwandyShards',
    prerequisite: 'hexed_shard_multi_1',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'hexed_shard_multi_3': {
    title: 'Better multipliers (HSS3)',
    description: 'The multiplier scaling for swandy production and shard multiplier is improved',
    cost: new Decimal(25000000),
    costCurrency: 'hexedSwandyShards',
    prerequisite: 'hexed_shard_multi_2',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'swandy_resety': {
    title: 'Already reached the cap? (S11)',
    description: 'Unlock the swandy shattery',
    cost: new Decimal(999999),
    prerequisite: 'crush_swandies',
    effect: function() {
      // Unlock the Swandy Resety feature
      window.state.halloweenEvent.swandyResetyUnlocked = true;
      
      // Show the Swandy Resety button
      const resetyButton = document.getElementById('swandyResetyButton');
      if (resetyButton) {
        resetyButton.style.display = 'block';
      }
    },
    unlocks: ['swandies_boost_shards']
  },
  'shards_multi': {
    title: 'The first swandy shard multiplier (SS1)',
    description: '1.5X to swandy shards gain',
    cost: new Decimal(30000),
    costCurrency: 'swandyShards',
    prerequisite: 'crush_swandies',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['shards_multi_2']
  },
  'shards_multi_2': {
    title: 'Need more swandy shards? (SS2)',
    description: '1.25X to swandy shards gain',
    cost: new Decimal(50000),
    costCurrency: 'swandyShards',
    prerequisite: 'shards_multi',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['super_shard_multi']
  },
  'super_shard_multi': {
    title: 'Super shard multi (SS3)',
    description: 'Earn more shards based on the amount of swandies crushed in a single match',
    cost: new Decimal(100000),
    costCurrency: 'swandyShards',
    prerequisite: 'shards_multi_2',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['combo_breaker', 'stronger_shattery_prod', 'swandy_blaster']
  },
  'combo_breaker': {
    title: 'Combo breaker (SS4)',
    description: 'Combos will now scale by ×1.75',
    cost: new Decimal(555555),
    costCurrency: 'swandyShards',
    prerequisite: 'super_shard_multi',
    unlocks: ['shattery_shards'],
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'stronger_shattery_prod': {
    title: 'Stronger Shattery Swandy Swoduction (SS5)',
    description: 'The shattery swandy production buff now scales by 1.22X',
    cost: new Decimal(1500000),
    costCurrency: 'swandyShards',
    prerequisite: 'super_shard_multi',
    unlocks: ['expansion_shard_boost'],
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
      // Update production multiplier if shattery already active
      const crusherState = window.state.halloweenEvent.swandyCrusher;
      if (crusherState.resety && crusherState.resety.count > 0) {
        const nextProdMult = Math.pow(1.22, crusherState.resety.count);
        crusherState.resety.productionMultiplier = new Decimal(nextProdMult);
      }
    }
  },
  'expansion_shard_boost': {
    title: 'Expanding the swandy shards (SS9)',
    description: 'Expansion grade boosts shards by +0.25X per grade',
    cost: new Decimal(777666555),
    costCurrency: 'swandyShards',
    prerequisite: 'stronger_shattery_prod',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    getCurrentBonus: function() {
      const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1);
      return 1 + (currentGrade - 1) * 0.25;
    },
    unlocks: ['little_bit_more_shards']
  },
  'little_bit_more_shards': {
    title: 'Just a little bit more shards (SS12)',
    description: 'X5 to swandy shard gain',
    cost: new Decimal(200000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'expansion_shard_boost',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['second_half_key']
  },
  'second_half_key': {
    title: 'The second half of the key (SS13)',
    description: 'Craft the second half of the key to break into the hut',
    cost: new Decimal(1000000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'little_bit_more_shards',
    effect: function() {
      // Set flag for second half of key
      if (!window.state.halloweenEvent.secondHalfKey) {
        window.state.halloweenEvent.secondHalfKey = true;
      }
      
      // Check if both halves are acquired
      const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
      if (treeUpgrades.break_in) {
        // Unlock Jadeca's Hut
        const jadecasHutTab = document.getElementById('jadecasHutTab');
        if (jadecasHutTab) {
          jadecasHutTab.style.display = 'inline-block';
        }
        
        if (typeof showToast === 'function') {
          showToast("The key is crafted, time to break in!", 'success');
        }
      } else {
        if (typeof showToast === 'function') {
          showToast("You've crafted the second half of the key! One more half to go...", 'info');
        }
      }
    },
    unlocks: ['tree_age_shard_boost']
  },
  'tree_age_shard_boost': {
    title: 'A tree age upgrade? (SS14)',
    description: 'Tree age will boost swandy shards gain',
    cost: new Decimal(50000000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'second_half_key',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    },
    unlocks: ['extending_softcap']
  },
  'extending_softcap': {
    title: 'Extending the softcap (SS15)',
    description: 'Starting at crusher lvl 25, the swandy shattery swandy cap will now go up by 1.75X for each lvls',
    cost: new Decimal(1000000000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'tree_age_shard_boost',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'shattery_insane': {
    title: 'Shattery is getting insane (SS16)',
    description: 'Starting at lvl 30, the shard shattery buff will go up by 1.4X',
    cost: new Decimal(100000000000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'second_half_key',
    effect: function() {
      // Recalculate the shard multiplier with the new 1.4x boost for levels 30+
      if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.treeUpgrades.purchased.shattery_shards) {
        const crusherState = window.state.halloweenEvent.swandyCrusher;
        const currentLevel = crusherState.level || 1;
        
        // Shard multiplier starts at level 10
        // Level 10-29: use 1.25x, Level 30+: use 1.4x
        const levelsBelow30 = Math.max(0, Math.min(currentLevel, 29) - 9); // Levels 10-29
        const levelsFrom30Plus = Math.max(0, currentLevel - 29); // Levels 30+
        
        const nextShardsMult = Math.pow(1.25, levelsBelow30) * Math.pow(1.4, levelsFrom30Plus);
        crusherState.resety.shardsMultiplier = new Decimal(nextShardsMult);
      }
    },
    unlocks: ['final_shard_upgrade']
  },
  'final_shard_upgrade': {
    title: 'Go get that second hexomancy milestone (SS17)',
    description: 'The final shard multiplier upgrade, X5 to shard gain',
    cost: new Decimal(5000000000000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'shattery_insane',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'swandy_blaster': {
    title: 'Swandy blaster (SS6)',
    description: 'Unlock the swandy blaster (Match 6+ swandy)',
    cost: new Decimal(5000000),
    costCurrency: 'swandyShards',
    prerequisite: 'super_shard_multi',
    effect: function() {
      if (!window.state.halloweenEvent.swandyCrusher) {
        window.state.halloweenEvent.swandyCrusher = {};
      }
      window.state.halloweenEvent.swandyCrusher.swandyBlasterUnlocked = true;
    },
    unlocks: ['blaster_requirement_5']
  },
  'blaster_requirement_5': {
    title: 'Nuh uh, not 6 (SS7)',
    description: 'IMMEDIATLY lowers the requirement to create a swandy blaster to 5',
    cost: new Decimal(20000000),
    costCurrency: 'swandyShards',
    prerequisite: 'swandy_blaster',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'shattery_shards': {
    title: 'Shattery them shards (SS8)',
    description: 'Shattery will multiply shards gain by 1.25X each lvl starting at crusher lvl 10',
    cost: new Decimal(200000000),
    costCurrency: 'swandyShards',
    prerequisite: 'combo_breaker',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
      // Update shards multiplier if crusher level is already 10+
      const crusherState = window.state.halloweenEvent.swandyCrusher;
      if (crusherState.resety && crusherState.resety.highestLevelReached >= 10) {
        const levelsAbove10 = Math.max(0, crusherState.resety.highestLevelReached - 9);
        const nextShardsMult = Math.pow(1.25, levelsAbove10);
        crusherState.resety.shardsMultiplier = new Decimal(nextShardsMult);
      }
    },
    unlocks: ['ultimate_swandy_orb']
  },
  'ultimate_swandy_orb': {
    title: 'The ultimate swandy orb (SS10)',
    description: 'Unlock the Swandy Orb (match 8+ swandy)',
    cost: new Decimal(2500000000),
    costCurrency: 'swandyShards',
    prerequisite: 'shattery_shards',
    effect: function() {
      if (!window.state.halloweenEvent.swandyCrusher) {
        window.state.halloweenEvent.swandyCrusher = {};
      }
      window.state.halloweenEvent.swandyCrusher.swandyOrbUnlocked = true;
    },
    unlocks: ['orb_requirement_8']
  },
  'orb_requirement_8': {
    title: 'Nuh uh, not 8 (SS11)',
    description: 'You\'ve seen it coming, IMMEDIATLY lowers the requirement of creating a swandy orbs to 7',
    cost: new Decimal(10000000000),
    costCurrency: 'swandyShards',
    prerequisite: 'ultimate_swandy_orb',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'swandies_boost_shards': {
    title: 'Swandies can boost shards? (S12)',
    description: 'Swandies boost shard gain by 1.1^(log₁₀(swandies))',
    cost: new Decimal(1500000),
    prerequisite: 'swandy_resety',
    effect: function() {
      if (!window.state.halloweenEvent.swandyCrusher.swandiesBoostShardsEnabled) {
        window.state.halloweenEvent.swandyCrusher.swandiesBoostShardsEnabled = true;
      }
    },
    unlocks: ['remote_power_recharge']
  },
  'remote_power_recharge': {
    title: 'Your very own personal power recharger (S15)',
    description: 'Unlock a device to charge the facility\'s power at a distance',
    cost: new Decimal(17000000),
    costCurrency: 'swandies',
    prerequisite: 'swandies_boost_shards',
    effect: function() {
      if (!window.state.halloweenEvent.swandyCrusher.remotePowerRechargeUnlocked) {
        window.state.halloweenEvent.swandyCrusher.remotePowerRechargeUnlocked = true;
      }
    },
    unlocks: ['something_in_distance']
  },
  'something_in_distance': {
    title: 'There\'s something in the distance (S16)',
    description: 'Here\'s another 1.5X more swandy shards',
    cost: new Decimal(66666666),
    costCurrency: 'swandies',
    prerequisite: 'remote_power_recharge',
    unlocks: ['wooden_building'],
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'wooden_building': {
    title: 'A wooden building... (S17)',
    description: 'Here\'s a huge 1.75X more swandy shards before the next real reset',
    cost: new Decimal(120120120),
    costCurrency: 'swandies',
    prerequisite: 'something_in_distance',
    unlocks: ['break_in', 'witch_hut', 'someone_inside'],
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'witch_hut': {
    title: 'The witch hut (S18)',
    description: 'Here\'s a 2X to swandy production, you\'ll need it.',
    cost: new Decimal(333333333),
    costCurrency: 'swandies',
    prerequisite: 'wooden_building',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'someone_inside': {
    title: 'There\'s someone inside... (S19)',
    description: 'Here\'s 1.5X swandy shards AND swandy production...',
    cost: new Decimal(666666666),
    costCurrency: 'swandies',
    prerequisite: 'wooden_building',
    effect: function() {
      // Flag is automatically set by purchase system in treeUpgrades.purchased
    }
  },
  'break_in': {
    title: 'The first half of the key (S20)',
    description: 'Craft the first half of the key to break into the hut',
    cost: new Decimal(1000000000),
    costCurrency: 'swandies',
    prerequisite: 'wooden_building',
    effect: function() {
      window.state.halloweenEvent.firstHalfKey = true;
      
      // Check if both halves are acquired
      const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
      if (treeUpgrades.second_half_key) {
        // Unlock Jadeca's Hut
        const jadecasHutTab = document.getElementById('jadecasHutTab');
        if (jadecasHutTab) {
          jadecasHutTab.style.display = 'inline-block';
        }
        
        if (typeof showToast === 'function') {
          showToast("Jadeca's Hut has been unlocked!", 'success');
        }
      } else {
        if (typeof showToast === 'function') {
          showToast("You've crafted the first half of the key! One more half to go...", 'info');
        }
      }
    }
  }
};

// Export tree upgrades definitions for cross-file access
window.treeUpgrades = treeUpgrades;

// Tree canvas drag and zoom variables
let treeCanvasState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  scale: 1,
  minScale: 0.1,
  maxScale: 2.0,
  keys: {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false
  },
  keyboardSpeed: 5, // pixels per frame
  keyboardMovementActive: false
};

// Initialize Tree of Horrors canvas interactions
// QOL Features:
// - Scroll wheel zooming: Mouse wheel up/down to zoom in/out
// - Keyboard navigation: WASD or Arrow keys to move canvas around
function initializeTreeCanvas() {
  const container = document.getElementById('treeCanvasContainer');
  const canvas = document.getElementById('treeCanvas');
  
  if (!container || !canvas) return;
  
  // Mouse events for dragging
  container.addEventListener('mousedown', startTreeDrag);
  document.addEventListener('mousemove', dragTreeCanvas);
  document.addEventListener('mouseup', endTreeDrag);
  
  // Touch events for mobile
  container.addEventListener('touchstart', startTreeDrag);
  document.addEventListener('touchmove', dragTreeCanvas);
  document.addEventListener('touchend', endTreeDrag);
  
  // Scroll wheel zoom
  container.addEventListener('wheel', handleTreeCanvasWheel);
  
  // Keyboard navigation
  document.addEventListener('keydown', handleTreeCanvasKeydown);
  document.addEventListener('keyup', handleTreeCanvasKeyup);
  
  // Render tree upgrades if renderTreeUpgrades function exists
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
  
  // Update upgrade button states
  updateTreeUpgradeButtons();
}

function startTreeDrag(e) {
  e.preventDefault();
  treeCanvasState.isDragging = true;
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
  
  treeCanvasState.startX = clientX - treeCanvasState.currentX;
  treeCanvasState.startY = clientY - treeCanvasState.currentY;
  
  document.getElementById('treeCanvasContainer').style.cursor = 'grabbing';
}

function dragTreeCanvas(e) {
  if (!treeCanvasState.isDragging) return;
  
  e.preventDefault();
  
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
  
  treeCanvasState.currentX = clientX - treeCanvasState.startX;
  treeCanvasState.currentY = clientY - treeCanvasState.startY;
  
  updateTreeCanvasTransform();
}

function endTreeDrag(e) {
  treeCanvasState.isDragging = false;
  document.getElementById('treeCanvasContainer').style.cursor = 'grab';
}

function updateTreeCanvasTransform() {
  const canvas = document.getElementById('treeCanvas');
  if (canvas) {
    // Apply translate BEFORE scale so translation is not affected by scale
    canvas.style.transform = `translate(${treeCanvasState.currentX}px, ${treeCanvasState.currentY}px) scale(${treeCanvasState.scale})`;
  }
  
  // Update debug display
  updateTreeCanvasDebugInfo();
}

// Update debug info display
function updateTreeCanvasDebugInfo() {
  const debugZoom = document.getElementById('debugZoom');
  const debugPosX = document.getElementById('debugPosX');
  const debugPosY = document.getElementById('debugPosY');
  
  if (debugZoom) {
    debugZoom.textContent = treeCanvasState.scale.toFixed(2);
  }
  if (debugPosX) {
    debugPosX.textContent = Math.round(treeCanvasState.currentX);
  }
  if (debugPosY) {
    debugPosY.textContent = Math.round(treeCanvasState.currentY);
  }
}

// Zoom functions
function zoomTreeCanvas(deltaScale, mouseX = null, mouseY = null) {
  const container = document.getElementById('treeCanvasContainer');
  if (!container) return;
  
  const oldScale = treeCanvasState.scale;
  const newScale = Math.max(treeCanvasState.minScale, Math.min(treeCanvasState.maxScale, oldScale + deltaScale));
  
  // If scale didn't change (hit min or max), don't do anything
  if (oldScale === newScale) return;
  
  // If no mouse position provided (button clicks), just change scale without adjusting position
  if (mouseX === null || mouseY === null) {
    treeCanvasState.scale = newScale;
  } else {
    // Zoom towards mouse cursor for wheel events
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    
    // Calculate the point in canvas space before zoom
    const canvasX = (mouseX - treeCanvasState.currentX) / oldScale;
    const canvasY = (mouseY - treeCanvasState.currentY) / oldScale;
    
    // Apply new scale
    treeCanvasState.scale = newScale;
    
    // Calculate new translation to keep the zoom point fixed
    treeCanvasState.currentX = mouseX - (canvasX * newScale);
    treeCanvasState.currentY = mouseY - (canvasY * newScale);
  }
  
  updateTreeCanvasTransform();
}

function resetTreeZoom() {
  treeCanvasState.scale = 1;
  treeCanvasState.currentX = 0;
  treeCanvasState.currentY = 0;
  updateTreeCanvasTransform();
}

// Scroll wheel zoom handler
function handleTreeCanvasWheel(e) {
  // Only handle wheel events when Tree of Horrors tab is active
  const treeContent = document.getElementById('halloweenTreeContent');
  if (!treeContent || treeContent.style.display === 'none') return;
  
  e.preventDefault();
  
  // Determine zoom direction and amount
  const zoomFactor = 0.1;
  const deltaScale = e.deltaY > 0 ? -zoomFactor : zoomFactor;
  
  // Pass mouse position to zoom towards cursor
  const container = document.getElementById('treeCanvasContainer');
  if (container) {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    zoomTreeCanvas(deltaScale, mouseX, mouseY);
  } else {
    zoomTreeCanvas(deltaScale);
  }
}

// Keyboard navigation handlers
function handleTreeCanvasKeydown(e) {
  // Only handle keyboard when Tree of Horrors tab is active
  const treeContent = document.getElementById('halloweenTreeContent');
  if (!treeContent || treeContent.style.display === 'none') return;
  
  // Check if user is typing in an input field
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  const key = e.key.toLowerCase();
  
  // Track key state for WASD and arrow keys
  if (key === 'w' || key === 'arrowup') {
    treeCanvasState.keys.w = true;
    treeCanvasState.keys.ArrowUp = true;
    e.preventDefault();
  }
  if (key === 'a' || key === 'arrowleft') {
    treeCanvasState.keys.a = true;
    treeCanvasState.keys.ArrowLeft = true;
    e.preventDefault();
  }
  if (key === 's' || key === 'arrowdown') {
    treeCanvasState.keys.s = true;
    treeCanvasState.keys.ArrowDown = true;
    e.preventDefault();
  }
  if (key === 'd' || key === 'arrowright') {
    treeCanvasState.keys.d = true;
    treeCanvasState.keys.ArrowRight = true;
    e.preventDefault();
  }
  
  // Start movement if not already running
  if (!treeCanvasState.keyboardMovementActive) {
    treeCanvasState.keyboardMovementActive = true;
    requestAnimationFrame(updateKeyboardMovement);
  }
}

function handleTreeCanvasKeyup(e) {
  // Only handle keyboard when Tree of Horrors tab is active
  const treeContent = document.getElementById('halloweenTreeContent');
  if (!treeContent || treeContent.style.display === 'none') return;
  
  const key = e.key.toLowerCase();
  
  // Release key state for WASD and arrow keys
  if (key === 'w' || key === 'arrowup') {
    treeCanvasState.keys.w = false;
    treeCanvasState.keys.ArrowUp = false;
  }
  if (key === 'a' || key === 'arrowleft') {
    treeCanvasState.keys.a = false;
    treeCanvasState.keys.ArrowLeft = false;
  }
  if (key === 's' || key === 'arrowdown') {
    treeCanvasState.keys.s = false;
    treeCanvasState.keys.ArrowDown = false;
  }
  if (key === 'd' || key === 'arrowright') {
    treeCanvasState.keys.d = false;
    treeCanvasState.keys.ArrowRight = false;
  }
}

// Update keyboard movement
function updateKeyboardMovement() {
  const isAnyKeyPressed = treeCanvasState.keys.w || treeCanvasState.keys.a || 
                         treeCanvasState.keys.s || treeCanvasState.keys.d ||
                         treeCanvasState.keys.ArrowUp || treeCanvasState.keys.ArrowLeft ||
                         treeCanvasState.keys.ArrowDown || treeCanvasState.keys.ArrowRight;
  
  if (isAnyKeyPressed) {
    // Calculate movement
    let deltaX = 0;
    let deltaY = 0;
    
    if (treeCanvasState.keys.w || treeCanvasState.keys.ArrowUp) {
      deltaY += treeCanvasState.keyboardSpeed;
    }
    if (treeCanvasState.keys.s || treeCanvasState.keys.ArrowDown) {
      deltaY -= treeCanvasState.keyboardSpeed;
    }
    if (treeCanvasState.keys.a || treeCanvasState.keys.ArrowLeft) {
      deltaX += treeCanvasState.keyboardSpeed;
    }
    if (treeCanvasState.keys.d || treeCanvasState.keys.ArrowRight) {
      deltaX -= treeCanvasState.keyboardSpeed;
    }
    
    // Apply movement
    treeCanvasState.currentX += deltaX;
    treeCanvasState.currentY += deltaY;
    updateTreeCanvasTransform();
    
    // Continue animation
    requestAnimationFrame(updateKeyboardMovement);
  } else {
    // Stop movement animation
    treeCanvasState.keyboardMovementActive = false;
  }
}

// Purchase tree upgrade
function purchaseTreeUpgrade(upgradeId) {
  const upgrade = treeUpgrades[upgradeId];
  if (!upgrade) return;
  
  // Determine which currency to use
  const currencyType = upgrade.costCurrency || 'swandy';
  let currentCurrency;
  
  if (currencyType === 'swandyShards') {
    // Get swandy shards from crusher score
    if (!window.state.halloweenEvent.swandyCrusher || !window.state.halloweenEvent.swandyCrusher.score) {
      showToast('Swandy Crusher not unlocked!', 'warning');
      return;
    }
    currentCurrency = window.state.halloweenEvent.swandyCrusher.score;
    if (!DecimalUtils.isDecimal(currentCurrency)) {
      currentCurrency = new Decimal(currentCurrency || 0);
      window.state.halloweenEvent.swandyCrusher.score = currentCurrency;
    }
  } else if (currencyType === 'hexedSwandyShards') {
    // Get hexed swandy shards
    if (!window.state.halloweenEvent.hexedSwandyShards) {
      showToast('No hexed swandy shards available!', 'warning');
      return;
    }
    currentCurrency = window.state.halloweenEvent.hexedSwandyShards;
    if (!DecimalUtils.isDecimal(currentCurrency)) {
      currentCurrency = new Decimal(currentCurrency || 0);
      window.state.halloweenEvent.hexedSwandyShards = currentCurrency;
    }
  } else {
    // Default to swandy
    if (!DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)) {
      window.state.halloweenEvent.swandy = new Decimal(window.state.halloweenEvent.swandy || 0);
    }
    currentCurrency = window.state.halloweenEvent.swandy;
  }
  
  // Ensure upgrade cost is a Decimal
  const upgradeCost = DecimalUtils.isDecimal(upgrade.cost) ? upgrade.cost : new Decimal(upgrade.cost || 0);
  
  // Check if already purchased
  if (window.state.halloweenEvent.treeUpgrades.purchased[upgradeId]) {
    showToast('Upgrade already bought!', 'warning');
    return;
  }
  
  // Check if prerequisite is met
  if (upgrade.prerequisite && !window.state.halloweenEvent.treeUpgrades.purchased[upgrade.prerequisite]) {
    showToast('Previous upgrade required!', 'warning');
    return;
  }
  
  // Check if can afford
  if (currentCurrency.lt(upgradeCost)) {
    let currencyName = 'Swandy';
    if (currencyType === 'swandyShards') {
      currencyName = 'Swandy Shards';
    } else if (currencyType === 'hexedSwandyShards') {
      currencyName = 'Hexed Swandy Shards';
    }
    showToast(`Not enough ${currencyName}!`, 'warning');
    return;
  }
  
  // Purchase upgrade
  if (currencyType === 'swandyShards') {
    window.state.halloweenEvent.swandyCrusher.score = currentCurrency.sub(upgradeCost);
  } else if (currencyType === 'hexedSwandyShards') {
    window.state.halloweenEvent.hexedSwandyShards = currentCurrency.sub(upgradeCost);
  } else {
    window.state.halloweenEvent.swandy = currentCurrency.sub(upgradeCost);
  }
  
  window.state.halloweenEvent.treeUpgrades.purchased[upgradeId] = true;
  
  // Apply upgrade effect
  if (upgrade.effect) {
    upgrade.effect();
  }
  
  // Re-render tree to show hex UI if milestone 1 is unlocked
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
  
  updateTreeUpgradeButtons();
  updateHalloweenUI();
  if (typeof updateSwandyCrusherUI === 'function') {
    updateSwandyCrusherUI();
  }
  showToast(`Purchased: ${upgrade.title}`, 'success');
}

// Update upgrade button states
function updateTreeUpgradeButtons() {
  // Ensure swandy is a Decimal before checking affordability
  if (!DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)) {
    window.state.halloweenEvent.swandy = new Decimal(window.state.halloweenEvent.swandy || 0);
  }
  
  for (const upgradeId in treeUpgrades) {
    const node = document.querySelector(`[data-upgrade-id="${upgradeId}"]`);
    const button = document.querySelector(`[data-upgrade-id="${upgradeId}"] .upgrade-button`);
    if (!button || !node) continue;
    
    const upgrade = treeUpgrades[upgradeId];
    const layout = treeUpgradeLayout[upgradeId];
    const isPurchased = window.state.halloweenEvent.treeUpgrades.purchased[upgradeId];
    
    // Ensure upgrade cost is a Decimal for comparison
    const upgradeCost = DecimalUtils.isDecimal(upgrade.cost) ? upgrade.cost : new Decimal(upgrade.cost || 0);
    
    // Determine which currency to check
    const currencyType = upgrade.costCurrency || 'swandy';
    let currentCurrency;
    
    if (currencyType === 'swandyShards') {
      if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.swandyCrusher.score) {
        currentCurrency = DecimalUtils.isDecimal(window.state.halloweenEvent.swandyCrusher.score) 
          ? window.state.halloweenEvent.swandyCrusher.score 
          : new Decimal(window.state.halloweenEvent.swandyCrusher.score || 0);
      } else {
        currentCurrency = new Decimal(0);
      }
    } else if (currencyType === 'hexedSwandyShards') {
      if (window.state.halloweenEvent.hexedSwandyShards) {
        currentCurrency = DecimalUtils.isDecimal(window.state.halloweenEvent.hexedSwandyShards) 
          ? window.state.halloweenEvent.hexedSwandyShards 
          : new Decimal(window.state.halloweenEvent.hexedSwandyShards || 0);
      } else {
        currentCurrency = new Decimal(0);
      }
    } else {
      currentCurrency = window.state.halloweenEvent.swandy;
    }
    
    const canAfford = currentCurrency.gte(upgradeCost);
    let currencyName = 'Swandy';
    if (currencyType === 'swandyShards') {
      currencyName = 'Swandy Shards';
    } else if (currencyType === 'hexedSwandyShards') {
      currencyName = 'Hexed Swandy Shards';
    }
    
    // Check visibility prerequisite (when upgrade becomes visible but transparent)
    let isVisible = true;
    if (layout && layout.visibilityPrerequisite) {
      isVisible = window.state.halloweenEvent.treeUpgrades.purchased[layout.visibilityPrerequisite];
    } else if (upgrade.prerequisite) {
      isVisible = true; // Standard prerequisite upgrades are always visible once unlocked
    }
    
    // Check unlock prerequisite (when upgrade becomes fully opaque and purchasable)
    let isUnlocked = true;
    if (layout && layout.unlockPrerequisite) {
      isUnlocked = window.state.halloweenEvent.treeUpgrades.purchased[layout.unlockPrerequisite];
    } else if (upgrade.prerequisite) {
      isUnlocked = window.state.halloweenEvent.treeUpgrades.purchased[upgrade.prerequisite];
    }
    
    // Remove existing classes
    button.classList.remove('can-afford', 'purchased', 'locked', 'semi-locked', 'can-hex', 'fully-hexed');
    node.classList.remove('locked', 'unlocked', 'semi-locked');
    
    if (!isVisible) {
      // Not visible - keep as locked with ??? content
      node.classList.add('locked');
      button.classList.add('locked');
      
      // Update button content to show ??? information
      const titleElement = button.querySelector('.upgrade-title');
      const descElement = button.querySelector('.upgrade-description');
      const costElement = button.querySelector('.upgrade-cost');
      
      if (titleElement) titleElement.textContent = '???';
      if (descElement) descElement.textContent = '???';
      if (costElement) costElement.textContent = 'Cost: ???';
    } else if (isVisible && !isUnlocked) {
      // Visible but not unlocked - semi-transparent with real content
      node.classList.add('semi-locked');
      button.classList.add('semi-locked');
      
      // Update button content to show real information
      const titleElement = button.querySelector('.upgrade-title');
      const descElement = button.querySelector('.upgrade-description');
      const costElement = button.querySelector('.upgrade-cost');
      
      if (titleElement) titleElement.textContent = upgrade.title;
      if (descElement) {
        // Dynamic description for upgrades with hex multipliers
        const config = window.upgradeHexMultiplierConfig?.[upgradeId];
        if (config && config.baseMultiplier !== undefined && config.maxMultiplier !== undefined && window.state?.halloweenEvent?.treeUpgrades?.purchased?.[upgradeId]) {
          const multiplier = typeof getUpgradeHexMultiplier === 'function' 
            ? getUpgradeHexMultiplier(upgradeId) 
            : (config.baseMultiplier || 1);
          // Determine what the upgrade boosts based on boostType
          const boostText = config.boostType === 'shards' ? 'Swandy shard gain' : 'Swandy production';
          descElement.textContent = `×${multiplier.toFixed(1)} to ${boostText}`;
        } else {
          descElement.textContent = upgrade.description;
        }
      }
      if (costElement) costElement.textContent = `Cost: ${DecimalUtils.formatDecimal(upgradeCost)} ${currencyName}`;
    } else if (isVisible && isUnlocked) {
      // Fully visible and unlocked
      node.classList.add('unlocked');
      
      // Update button content to show real information
      const titleElement = button.querySelector('.upgrade-title');
      const descElement = button.querySelector('.upgrade-description');
      const costElement = button.querySelector('.upgrade-cost');
      const effectElement = button.querySelector('.upgrade-effect');
      
      if (titleElement) titleElement.textContent = upgrade.title;
      if (descElement) {
        // Dynamic description for upgrades with hex multipliers
        const config = window.upgradeHexMultiplierConfig?.[upgradeId];
        if (config && config.baseMultiplier !== undefined && config.maxMultiplier !== undefined && window.state?.halloweenEvent?.treeUpgrades?.purchased?.[upgradeId]) {
          const multiplier = typeof getUpgradeHexMultiplier === 'function' 
            ? getUpgradeHexMultiplier(upgradeId) 
            : (config.baseMultiplier || 1);
          // Determine what the upgrade boosts based on boostType
          const boostText = config.boostType === 'shards' ? 'Swandy shard gain' : 'Swandy production';
          descElement.textContent = `×${multiplier.toFixed(1)} to ${boostText}`;
        } else {
          descElement.textContent = upgrade.description;
        }
      }
      
      // Check if purchased and milestone 1 is unlocked - show hex cost instead
      const milestone1Unlocked = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1;
      if (isPurchased && milestone1Unlocked && costElement) {
        const hexCost = typeof getUpgradeHexCost === 'function' ? getUpgradeHexCost(upgradeId) : 1;
        const hexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.[upgradeId];
        
        let hexDepositedFormatted = '0';
        if (hexData?.hexDeposited) {
          const hexDeposited = DecimalUtils.isDecimal(hexData.hexDeposited) 
            ? hexData.hexDeposited 
            : new Decimal(hexData.hexDeposited || 0);
          hexDepositedFormatted = DecimalUtils.formatDecimal(hexDeposited);
        }
        
        const hexCostFormatted = DecimalUtils.isDecimal(hexCost) 
          ? DecimalUtils.formatDecimal(hexCost) 
          : hexCost;
        
        costElement.textContent = `Hex: ${hexDepositedFormatted}/${hexCostFormatted}`;
        // Set color based on whether upgrade is fully hexed
        const isFullyHexed = hexData?.isFullyHexed || false;
        costElement.style.setProperty('color', isFullyHexed ? '#ffffff' : '#b967ff', 'important');
        costElement.style.fontWeight = 'bold';
      } else if (costElement) {
        costElement.textContent = `Cost: ${DecimalUtils.formatDecimal(upgradeCost)} ${currencyName}`;
        costElement.style.color = '';
        costElement.style.fontWeight = '';
      }
      
      // Show effect text for specific upgrades
      if (effectElement && upgradeId === 'kp_boost_upgrade') {
        if (isPurchased) {
          const kpMultiplier = getKpSwandyMultiplier();
          const multiplierValue = DecimalUtils.isDecimal(kpMultiplier) 
            ? kpMultiplier.toNumber() 
            : kpMultiplier;
          effectElement.textContent = `Current: ×${multiplierValue.toFixed(2)}`;
          effectElement.style.display = 'block';
          effectElement.style.color = '#4CAF50';
          effectElement.style.fontWeight = 'bold';
          effectElement.style.marginTop = '5px';
          effectElement.style.padding = '4px 8px';
          effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
          effectElement.style.borderRadius = '4px';
        } else {
          effectElement.style.display = 'none';
        }
      } else if (effectElement && upgradeId === 'swandy_multiply') {
        // Show S2 secondary effect when fully hexed
        const milestone1Unlocked = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1;
        const hexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.['swandy_multiply'];
        
        if (isPurchased && milestone1Unlocked && hexData?.isFullyHexed) {
          effectElement.textContent = 'Swandy cap increased by 1.5x';
          effectElement.style.display = 'block';
          effectElement.style.color = '#ffffff';
          effectElement.style.fontWeight = 'bold';
          effectElement.style.marginTop = '10px';
          effectElement.style.padding = '4px 8px';
          effectElement.style.backgroundColor = 'rgba(185, 103, 255, 0.15)';
          effectElement.style.borderRadius = '4px';
          effectElement.style.fontSize = '12px';
        } else {
          effectElement.style.display = 'none';
        }
      } else if (effectElement && upgradeId === 'swandies_boost_shards') {
        if (isPurchased) {
          const swandyBoostMultiplier = typeof getSwandyShardBoostMultiplier === 'function' 
            ? getSwandyShardBoostMultiplier() 
            : 1;
          effectElement.textContent = `Current: ×${swandyBoostMultiplier.toFixed(2)}`;
          effectElement.style.display = 'block';
          effectElement.style.color = '#4CAF50';
          effectElement.style.fontWeight = 'bold';
          effectElement.style.marginTop = '5px';
          effectElement.style.padding = '4px 8px';
          effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
          effectElement.style.borderRadius = '4px';
        } else {
          effectElement.style.display = 'none';
        }
      } else if (effectElement && upgradeId === 'expansion_shard_boost') {
        if (isPurchased) {
          const currentGrade = DecimalUtils.isDecimal(window.state.grade) 
            ? window.state.grade.toNumber() 
            : (window.state.grade || 1);
          const currentMultiplier = (1 + (currentGrade - 1) * 0.25).toFixed(2);
          effectElement.textContent = `Current: ×${currentMultiplier}`;
          effectElement.style.display = 'block';
          effectElement.style.color = '#4CAF50';
          effectElement.style.fontWeight = 'bold';
          effectElement.style.marginTop = '5px';
          effectElement.style.padding = '4px 8px';
          effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
          effectElement.style.borderRadius = '4px';
        } else {
          effectElement.style.display = 'none';
        }
      } else if (effectElement && upgradeId === 'tree_age_shard_boost') {
        if (isPurchased) {
          const treeAge = window.state.halloweenEvent.treeAge || 0;
          const currentMultiplier = (1 + 0.9 * Math.log(1 + treeAge / 600)).toFixed(2);
          effectElement.textContent = `Current: ×${currentMultiplier}`;
          effectElement.style.display = 'block';
          effectElement.style.color = '#4CAF50';
          effectElement.style.fontWeight = 'bold';
          effectElement.style.marginTop = '5px';
          effectElement.style.padding = '4px 8px';
          effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
          effectElement.style.borderRadius = '4px';
        } else {
          effectElement.style.display = 'none';
        }
      } else if (effectElement) {
        effectElement.style.display = 'none';
      }
      
      if (isPurchased) {
        button.classList.add('purchased');
        
        // Check if milestone 1 is unlocked and upgrade can be hexed
        const milestone1Unlocked = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1;
        if (milestone1Unlocked) {
          const hexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.[upgradeId];
          if (hexData?.isFullyHexed) {
            button.classList.add('fully-hexed');
            button.classList.remove('can-hex');
          } else {
            button.classList.add('can-hex');
            button.classList.remove('fully-hexed');
          }
        }
      } else if (canAfford) {
        button.classList.add('can-afford');
      }
    }
  }
  
  // Update connection lines
  updateConnectionLines();
}

// Update connection line visibility
function updateConnectionLines() {
  // S1 to S2 connection
  const s1Purchased = window.state.halloweenEvent.treeUpgrades.purchased['swandy_start'];
  const s1s2Connection = document.getElementById('connection_s1_s2');
  
  if (s1s2Connection) {
    if (s1Purchased) {
      s1s2Connection.classList.add('active');
    } else {
      s1s2Connection.classList.remove('active');
    }
  }
}

// Swandy generation tick
function tickSwandyGeneration(deltaTime) {
  // Ensure swandy is a Decimal
  if (!DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)) {
    window.state.halloweenEvent.swandy = new Decimal(window.state.halloweenEvent.swandy || 0);
  }
  
  // Calculate generationRate from purchased upgrades (flag-based)
  let generationRate = new Decimal(0);
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  
  if (treeUpgrades.swandy_start) {
    generationRate = new Decimal(1); // S1 base
    if (treeUpgrades.swandy_multiply) {
      const s2Multiplier = getS2HexMultiplier();
      generationRate = generationRate.mul(s2Multiplier);
    }
    if (treeUpgrades.need_more_swandies) {
      const s3Multiplier = getS3HexMultiplier();
      generationRate = generationRate.mul(s3Multiplier);
    }
    if (treeUpgrades.tree_game_upgrade) {
      const s4Multiplier = getUpgradeHexMultiplier('tree_game_upgrade');
      generationRate = generationRate.mul(s4Multiplier);
    }
    if (treeUpgrades.devilish_swandy) {
      const s6Multiplier = getUpgradeHexMultiplier('devilish_swandy');
      generationRate = generationRate.mul(s6Multiplier);
    }
    if (treeUpgrades.less_devilish_swandy) {
      const s7Multiplier = getUpgradeHexMultiplier('less_devilish_swandy');
      generationRate = generationRate.mul(s7Multiplier);
    }
    if (treeUpgrades.worst_upgrades) {
      const s8Multiplier = getUpgradeHexMultiplier('worst_upgrades');
      generationRate = generationRate.mul(s8Multiplier);
    }
    if (treeUpgrades.revolution_upcoming) {
      const s9Multiplier = getUpgradeHexMultiplier('revolution_upcoming');
      generationRate = generationRate.mul(s9Multiplier);
    }
    if (treeUpgrades.just_out_of_reach) generationRate = generationRate.mul(2.5); // S14
    if (treeUpgrades.witch_hut) generationRate = generationRate.mul(2); // S18
    if (treeUpgrades.someone_inside) generationRate = generationRate.mul(1.5); // S19
    
    // Apply tree age multiplier if S4 is fully hexed
    const treeAgeMultiplier = getTreeAgeSwandyMultiplier();
    if (treeAgeMultiplier > 1) {
      generationRate = generationRate.mul(treeAgeMultiplier);
    }
  }
  
  if (generationRate.gt(0)) {
    // Apply KP boost if the upgrade is purchased
    if (treeUpgrades.kp_boost_upgrade) {
      const kpMultiplier = getKpSwandyMultiplier();
      generationRate = generationRate.mul(kpMultiplier);
    }
    
    // Apply Swandy Crusher production multiplier
    if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.swandyCrusher.multipliers) {
      const crusherMult = window.state.halloweenEvent.swandyCrusher.multipliers.swandyProduction;
      if (crusherMult) {
        const crusherMultiplier = DecimalUtils.isDecimal(crusherMult) ? crusherMult : new Decimal(crusherMult || 1);
        generationRate = generationRate.mul(crusherMultiplier);
      }
    }
    
    // Apply Resety production multiplier
    if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.swandyCrusher.resety) {
      const resetyProdMult = DecimalUtils.isDecimal(window.state.halloweenEvent.swandyCrusher.resety.productionMultiplier)
        ? window.state.halloweenEvent.swandyCrusher.resety.productionMultiplier
        : new Decimal(window.state.halloweenEvent.swandyCrusher.resety.productionMultiplier || 1);
      generationRate = generationRate.mul(resetyProdMult);
    }
    
    // Apply Hexomancy Milestone production multiplier (2x per milestone)
    if (window.state.halloweenEvent.jadeca && window.state.halloweenEvent.jadeca.hexomancyMilestones) {
      let milestoneCount = 0;
      const milestones = window.state.halloweenEvent.jadeca.hexomancyMilestones;
      if (milestones.milestone1) milestoneCount++;
      if (milestones.milestone2) milestoneCount++;
      if (milestones.milestone3) milestoneCount++;
      
      if (milestoneCount > 0) {
        const milestoneMult = new Decimal(2).pow(milestoneCount);
        generationRate = generationRate.mul(milestoneMult);
      }
    }
    
    const deltaTimeDecimal = new Decimal(deltaTime);
    let generated = generationRate.mul(deltaTimeDecimal.div(1000));
    
    // Check if soft-cap should reduce production rate
    const isSoftCapActive = window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1 === true;
    if (isSoftCapActive) {
      // Get the cap value
      let cap = window.state.halloweenEvent.swandyCap || new Decimal(1000000);
      if (!DecimalUtils.isDecimal(cap)) {
        cap = new Decimal(cap);
      }
      
      // Apply Resety cap multiplier
      if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.swandyCrusher.resety) {
        const resetyCapMult = DecimalUtils.isDecimal(window.state.halloweenEvent.swandyCrusher.resety.capMultiplier)
          ? window.state.halloweenEvent.swandyCrusher.resety.capMultiplier
          : new Decimal(window.state.halloweenEvent.swandyCrusher.resety.capMultiplier || 1);
        cap = cap.mul(resetyCapMult);
      }
      
      // Apply Hexomancy Milestone cap multiplier (2x per milestone)
      if (window.state.halloweenEvent.jadeca && window.state.halloweenEvent.jadeca.hexomancyMilestones) {
        let milestoneCount = 0;
        const milestones = window.state.halloweenEvent.jadeca.hexomancyMilestones;
        if (milestones.milestone1) milestoneCount++;
        if (milestones.milestone2) milestoneCount++;
        if (milestones.milestone3) milestoneCount++;
        
        if (milestoneCount > 0) {
          const milestoneMult = new Decimal(2).pow(milestoneCount);
          cap = cap.mul(milestoneMult);
        }
      }
      
      // Apply S2 fully hexed cap multiplier (1.5x)
      const s2HexData = window.state.halloweenEvent.treeUpgrades?.hexData?.['swandy_multiply'];
      if (s2HexData && s2HexData.isFullyHexed) {
        cap = cap.mul(1.5);
      }
      
      // Apply S3 fully hexed cap multiplier (another 1.5x)
      const s3HexData = window.state.halloweenEvent.treeUpgrades?.hexData?.['need_more_swandies'];
      if (s3HexData && s3HexData.isFullyHexed) {
        cap = cap.mul(1.5);
      }
      
      // Apply S5 tree age cap multiplier if fully hexed
      const treeAgeCapMultiplier = getTreeAgeSwandyCapMultiplier();
      if (treeAgeCapMultiplier > 1) {
        cap = cap.mul(treeAgeCapMultiplier);
      }
      
      // If currently above cap, reduce production rate
      if (window.state.halloweenEvent.swandy.gt(cap)) {
        const k = 50.0; // Curse strength parameter (higher = stronger reduction)
        const S = window.state.halloweenEvent.swandy;
        const H = cap;
        const ratio = S.div(H);
        
        // Calculate p = 1 / (1 + k * log10(S/H))
        const log10Ratio = ratio.log10();
        const denominator = new Decimal(1).add(new Decimal(k).mul(log10Ratio));
        const p = new Decimal(1).div(denominator);
        
        // Reduce production by factor p
        generated = generated.mul(p);
      }
    }
    
    // Add generated Swandy
    window.state.halloweenEvent.swandy = window.state.halloweenEvent.swandy.add(generated);
    
    // Enforce hard cap only if soft-cap is NOT active
    const isSoftCapActiveForCap = window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1 === true;
    if (!isSoftCapActiveForCap) {
      // Calculate hard cap
      let cap = window.state.halloweenEvent.swandyCap || new Decimal(1000000);
      
      if (!DecimalUtils.isDecimal(cap)) {
        cap = new Decimal(cap);
      }
      
      if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.swandyCrusher.resety) {
        const resetyCapMult = DecimalUtils.isDecimal(window.state.halloweenEvent.swandyCrusher.resety.capMultiplier)
          ? window.state.halloweenEvent.swandyCrusher.resety.capMultiplier
          : new Decimal(window.state.halloweenEvent.swandyCrusher.resety.capMultiplier || 1);
        cap = cap.mul(resetyCapMult);
      }
      
      // Apply Hexomancy Milestone cap multiplier (2x per milestone)
      if (window.state.halloweenEvent.jadeca && window.state.halloweenEvent.jadeca.hexomancyMilestones) {
        let milestoneCount = 0;
        const milestones = window.state.halloweenEvent.jadeca.hexomancyMilestones;
        if (milestones.milestone1) milestoneCount++;
        if (milestones.milestone2) milestoneCount++;
        if (milestones.milestone3) milestoneCount++;
        
        if (milestoneCount > 0) {
          const milestoneMult = new Decimal(2).pow(milestoneCount);
          cap = cap.mul(milestoneMult);
        }
      }
      
      // Apply S2 fully hexed cap multiplier (1.5x)
      const s2HexData = window.state.halloweenEvent.treeUpgrades?.hexData?.['swandy_multiply'];
      if (s2HexData && s2HexData.isFullyHexed) {
        cap = cap.mul(1.5);
      }
      
      // Apply S3 fully hexed cap multiplier (another 1.5x)
      const s3HexData = window.state.halloweenEvent.treeUpgrades?.hexData?.['need_more_swandies'];
      if (s3HexData && s3HexData.isFullyHexed) {
        cap = cap.mul(1.5);
      }
      
      // Apply S5 tree age cap multiplier if fully hexed
      const treeAgeCapMultiplier = getTreeAgeSwandyCapMultiplier();
      if (treeAgeCapMultiplier > 1) {
        cap = cap.mul(treeAgeCapMultiplier);
      }
      
      // Hard cap enforcement (when milestone 1 is not unlocked)
      if (window.state.halloweenEvent.swandy.gt(cap)) {
        window.state.halloweenEvent.swandy = cap;
      }
    }
  }
  
  // Generate Hex from Hexflux
  if (typeof generateHex === 'function') {
    generateHex(deltaTime / 1000); // Convert to seconds
  }
}

// Check if Swandy is currently soft-capped
function isSwandySoftCapped() {
  const isSoftCapActive = window.state.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1 === true;
  if (!isSoftCapActive) return false;
  
  const cap = getSwandyCap();
  const swandy = window.state.halloweenEvent.swandy;
  
  return swandy.gt(cap);
}

// Get the current Swandy cap (considering all multipliers)
function getSwandyCap() {
  let cap = window.state.halloweenEvent.swandyCap || new Decimal(1000000);
  
  if (!DecimalUtils.isDecimal(cap)) {
    cap = new Decimal(cap);
  }
  
  if (window.state.halloweenEvent.swandyCrusher && window.state.halloweenEvent.swandyCrusher.resety) {
    const resetyCapMult = DecimalUtils.isDecimal(window.state.halloweenEvent.swandyCrusher.resety.capMultiplier)
      ? window.state.halloweenEvent.swandyCrusher.resety.capMultiplier
      : new Decimal(window.state.halloweenEvent.swandyCrusher.resety.capMultiplier || 1);
    cap = cap.mul(resetyCapMult);
  }
  
  // Apply Hexomancy Milestone cap multiplier (2x per milestone)
  if (window.state.halloweenEvent.jadeca && window.state.halloweenEvent.jadeca.hexomancyMilestones) {
    let milestoneCount = 0;
    const milestones = window.state.halloweenEvent.jadeca.hexomancyMilestones;
    if (milestones.milestone1) milestoneCount++;
    if (milestones.milestone2) milestoneCount++;
    if (milestones.milestone3) milestoneCount++;
    
    if (milestoneCount > 0) {
      const milestoneMult = new Decimal(2).pow(milestoneCount);
      cap = cap.mul(milestoneMult);
    }
  }
  
  // Apply S2 fully hexed cap multiplier (1.5x)
  const s2HexData = window.state.halloweenEvent.treeUpgrades?.hexData?.['swandy_multiply'];
  if (s2HexData && s2HexData.isFullyHexed) {
    cap = cap.mul(1.5);
  }
  
  // Apply S3 fully hexed cap multiplier (another 1.5x)
  const s3HexData = window.state.halloweenEvent.treeUpgrades?.hexData?.['need_more_swandies'];
  if (s3HexData && s3HexData.isFullyHexed) {
    cap = cap.mul(1.5);
  }
  
  // Apply S5 tree age cap multiplier if fully hexed
  const treeAgeCapMultiplier = getTreeAgeSwandyCapMultiplier();
  if (treeAgeCapMultiplier > 1) {
    cap = cap.mul(treeAgeCapMultiplier);
  }
  
  // Apply Halloween shop swandy boost
  if (window.boutique && typeof window.boutique.getHalloweenSwandyBoostMultiplier === 'function') {
    const swandyBoost = window.boutique.getHalloweenSwandyBoostMultiplier();
    cap = cap.mul(swandyBoost);
  }
  
  return cap;
}

// Get Swandy for display (no compression, just the actual value)
function getEffectiveSwandy() {
  return window.state.halloweenEvent.swandy;
}

// Calculate KP-based swandy multiplier with diminishing returns
function getKpSwandyMultiplier() {
  if (!window.state.halloweenEvent.treeUpgrades.kpBoostEnabled) {
    return new Decimal(1);
  }
  
  // Get current KP amount
  const currentKp = DecimalUtils.isDecimal(window.state.kp) ? window.state.kp : new Decimal(window.state.kp || 0);
  
  // Logarithmic formula with diminishing returns: 1 + log₁₀(KP + 1) × 0.2
  // This gives:
  // - 0 KP: 1.0x (no boost)
  // - 10 KP: 1.2x 
  // - 100 KP: 1.4x
  // - 1,000 KP: 1.6x
  // - 10,000 KP: 1.8x
  // - 100,000 KP: 2.0x
  const kpPlusOne = currentKp.add(1);
  const logValue = kpPlusOne.log10();
  const multiplier = new Decimal(1).add(logValue.mul(0.2));
  
  return multiplier;
}

// Initialize when switching to tree tab
const originalSwitchHalloweenSubTab = window.switchHalloweenSubTab;
window.switchHalloweenSubTab = function(tabId) {
  if (originalSwitchHalloweenSubTab) {
    originalSwitchHalloweenSubTab(tabId);
  }
  
  // Handle scrolling for Tree of Horrors tab
  if (tabId === 'treeOfHorrors') {
    // Disable page scrolling for tree tab - multiple methods for reliability
    document.body.classList.add('tree-horrors-active');
    document.documentElement.classList.add('tree-horrors-active');
    
    // Store current scroll position to restore later
    if (!window.treeScrollPosition) {
      window.treeScrollPosition = {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
      };
    }
    
    // Prevent wheel events for extra scroll prevention
    const preventScroll = (e) => e.preventDefault();
    window.treeScrollPreventFunction = preventScroll;
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    // Ensure tree upgrades state is properly initialized
    if (!window.state.halloweenEvent.treeUpgrades) {
      window.state.halloweenEvent.treeUpgrades = {
        purchased: {},
        swandyGeneration: new Decimal(0)
      };
    }
    setTimeout(() => {
      initializeTreeCanvas();
      updateTreeUpgradeButtons();
      // Hide any base game cursor effects in Tree of Horrors
      if (typeof hideAllSpinningCursors === 'function') {
        hideAllSpinningCursors();
      }
    }, 100);
  } else {
    // Re-enable page scrolling for other tabs
    document.body.classList.remove('tree-horrors-active');
    document.documentElement.classList.remove('tree-horrors-active');
    
    // Remove scroll prevention event listeners
    if (window.treeScrollPreventFunction) {
      document.removeEventListener('wheel', window.treeScrollPreventFunction);
      document.removeEventListener('touchmove', window.treeScrollPreventFunction);
      window.treeScrollPreventFunction = null;
    }
    
    // Restore scroll position if it was stored
    if (window.treeScrollPosition) {
      setTimeout(() => {
        window.scrollTo(window.treeScrollPosition.x, window.treeScrollPosition.y);
        window.treeScrollPosition = null;
      }, 50);
    }
  }
};

// Make functions globally accessible
window.initializeTreeCanvas = initializeTreeCanvas;
window.zoomTreeCanvas = zoomTreeCanvas;
window.resetTreeZoom = resetTreeZoom;
window.updateTreeCanvasDebugInfo = updateTreeCanvasDebugInfo;
window.purchaseTreeUpgrade = purchaseTreeUpgrade;
window.updateTreeUpgradeButtons = updateTreeUpgradeButtons;
window.updateConnectionLines = updateConnectionLines;
window.tickSwandyGeneration = tickSwandyGeneration;
window.getKpSwandyMultiplier = getKpSwandyMultiplier;
window.isSwandySoftCapped = isSwandySoftCapped;
window.getSwandyCap = getSwandyCap;
window.getEffectiveSwandy = getEffectiveSwandy;
