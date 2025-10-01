// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// DecimalUtils is available globally from decimal_utils.js

let prismGridInitialized = false;

// Make prismGridInitialized globally accessible
window.prismGridInitialized = prismGridInitialized;

// Timeout tracking for cleanup
window.prismTimeouts = window.prismTimeouts || [];













































// Use centralized prism state from window.state
function initializePrismState() {
  // Wait for window.state to be properly set up by script.js
  if (!window.state || !window.state.prismState) {
    // If state isn't ready yet, we'll sync later when the page loads
    return;
  }
  
  // Ensure all prism state values are Decimals
  const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  const fractionalTypes = ['lightFractional', 'redlightFractional', 'orangelightFractional', 'yellowlightFractional', 'greenlightFractional', 'bluelightFractional'];
  
  [...lightTypes, ...particleTypes, ...fractionalTypes].forEach(type => {
    if (!DecimalUtils.isDecimal(window.state.prismState[type])) {
      window.state.prismState[type] = new Decimal(window.state.prismState[type] || 0);
    }
  });
  
  // Ensure generator objects exist
  if (!window.state.prismState.generatorUpgrades) {
    window.state.prismState.generatorUpgrades = {};
  }
  if (!window.state.prismState.generatorUnlocked) {
    window.state.prismState.generatorUnlocked = {};
  }
  
  // Initialize permanent unlock flags for light tiles
  if (!window.state.prismState.permanentUnlocks) {
    window.state.prismState.permanentUnlocks = {};
  }
  if (typeof window.state.prismState.permanentUnlocks.redLightUnlocked === 'undefined') {
    window.state.prismState.permanentUnlocks.redLightUnlocked = false;
  }
  if (typeof window.state.prismState.permanentUnlocks.orangeLightUnlocked === 'undefined') {
    window.state.prismState.permanentUnlocks.orangeLightUnlocked = false;
  }
  
  // Create global reference for backward compatibility
  window.prismState = window.state.prismState;
}

// Make function globally accessible for sync purposes
window.initializePrismState = initializePrismState;

// Debug function to check prism state persistence
window.debugPrismState = function() {
  return {
    prismState: window.state?.prismState,
    prismStateRef: window.prismState,
    referencesMatch: window.prismState === window.state?.prismState,
    lightValues: window.prismState ? {
      light: window.prismState.light?.toString() || 'undefined',
      redlight: window.prismState.redlight?.toString() || 'undefined',
      orangelight: window.prismState.orangelight?.toString() || 'undefined',
      yellowlight: window.prismState.yellowlight?.toString() || 'undefined',
      greenlight: window.prismState.greenlight?.toString() || 'undefined',
      bluelight: window.prismState.bluelight?.toString() || 'undefined'
    } : null
  };
};

// Debug function to add test light values
window.grantTestLight = function() {
  if (!window.prismState) {
    return false;
  }
  
  window.prismState.light = new Decimal(100);
  window.prismState.redlight = new Decimal(50);
  window.prismState.orangelight = new Decimal(25);
  window.prismState.yellowlight = new Decimal(10);
  window.prismState.greenlight = new Decimal(5);
  window.prismState.bluelight = new Decimal(1);
  
  // Update UI
  if (typeof window.forceUpdateAllLightCounters === 'function') {
    window.forceUpdateAllLightCounters();
  }
  
  return true;
};

// Initialize prism state when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePrismState);
} else {
  initializePrismState();
}
const lightGeneratorConfigs = {
  light:      { baseCost: new Decimal(100),      baseRate: new Decimal(1),   resource: 'light' },
  redlight:   { baseCost: new Decimal(500),      baseRate: new Decimal(1),   resource: 'redlight' },
  orangelight:{ baseCost: new Decimal(1000),     baseRate: new Decimal(1),   resource: 'orangelight' },
  yellowlight:{ baseCost: new Decimal(2500),     baseRate: new Decimal(1),   resource: 'yellowlight' },
  greenlight: { baseCost: new Decimal(5000),     baseRate: new Decimal(1),   resource: 'greenlight' },
  bluelight:  { baseCost: new Decimal(10000),    baseRate: new Decimal(1),   resource: 'bluelight' }
};

// Make lightGeneratorConfigs globally accessible
window.lightGeneratorConfigs = lightGeneratorConfigs;
if (!window.prismState.generatorUpgrades) {
  window.prismState.generatorUpgrades = {
    light: 0,
    redlight: 0,
    orangelight: 0,
    yellowlight: 0,
    greenlight: 0,
    bluelight: 0
  };
}
if (!window.prismState.generatorUnlocked) {
  window.prismState.generatorUnlocked = {
    light: false,
    redlight: false,
    orangelight: false,
    yellowlight: false,
    greenlight: false,
    bluelight: false
  };
}
window.prismShapeIndices = [
   3,
   9, 10, 11,
 15, 16, 17, 18, 19,
 21, 22, 23, 24, 25, 26, 27,
 29, 30, 31, 32, 33,
 37, 38, 39,
  45
];

// KitoFox mode vantablack light system
window.vantablackLightSystem = {
  currentVantablackTile: null,
  lightSpawnLocked: false,
  lockoutEndTime: null,
  lockoutDuration: 60000, // 1 minute in milliseconds
  hasShownWarningDialogue: false, // Track if we've shown Vi's warning this session
  forceOverloadOnNextClick: false // Debug flag to force overload on next click
};
const tileColorMap = {
  3: 'light',
  9: 'redlight', 10: 'redlight', 11: 'redlight',
  15: 'orangelight', 16: 'orangelight', 17: 'orangelight', 18: 'orangelight', 19: 'orangelight',
  21: 'yellowlight', 22: 'yellowlight', 23: 'yellowlight', 24: 'yellowlight', 25: 'yellowlight', 26: 'yellowlight', 27: 'yellowlight',
  29: 'greenlight', 30: 'greenlight', 31: 'greenlight', 32: 'greenlight', 33: 'greenlight',
  37: 'bluelight', 38: 'bluelight', 39: 'bluelight',
  45: 'light'
};

// Helper function to check if KitoFox mode is active
function isKitoFoxModeActive() {
  return window.state && window.state.kitoFoxModeActive;
}

// Helper function to check if light spawning is locked due to vantablack click
function isLightSpawnLocked() {
  if (!window.vantablackLightSystem.lightSpawnLocked) return false;
  
  const currentTime = Date.now();
  if (currentTime >= window.vantablackLightSystem.lockoutEndTime) {
    // Lockout expired, clear it
    window.vantablackLightSystem.lightSpawnLocked = false;
    window.vantablackLightSystem.lockoutEndTime = null;
    return false;
  }
  
  return true;
}

// Function to spawn vantablack light tile in KitoFox mode
function spawnVantablackLight(excludeIndex = null) {
  if (!isKitoFoxModeActive()) return;
  
  // Remove existing vantablack light
  if (window.vantablackLightSystem.currentVantablackTile) {
    window.vantablackLightSystem.currentVantablackTile.classList.remove("vantablack-tile");
    window.vantablackLightSystem.currentVantablackTile = null;
  }
  
  // Get eligible tiles (exclude the one with normal light and the previously excluded one)
  const eligible = Array.from(document.querySelectorAll(".light-tile.active-prism")).filter(tile => {
    const index = parseInt(tile.dataset.index);
    return !tile.classList.contains("active-tile") && 
           (excludeIndex === null || index !== excludeIndex);
  });
  
  if (eligible.length === 0) return;
  
  // Select random tile for vantablack
  const randomTile = eligible[Math.floor(Math.random() * eligible.length)];
  randomTile.classList.add("vantablack-tile");
  window.vantablackLightSystem.currentVantablackTile = randomTile;
}

// Function to handle vantablack light click (dangerous!)
function handleVantablackClick() {
  // Activate 1-minute lockout
  window.vantablackLightSystem.lightSpawnLocked = true;
  window.vantablackLightSystem.lockoutEndTime = Date.now() + window.vantablackLightSystem.lockoutDuration;
  
  // Remove all active lights
  document.querySelectorAll(".light-tile.active-tile").forEach(tile => {
    tile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
  });
  
  // Remove vantablack light
  if (window.vantablackLightSystem.currentVantablackTile) {
    window.vantablackLightSystem.currentVantablackTile.classList.remove("vantablack-tile");
    window.vantablackLightSystem.currentVantablackTile = null;
  }
  
  // Clear active tile references
  currentActiveTile = null;
  window.prismState.activeTileIndex = null;
  window.prismState.activeTileColor = null;
  
  // DANGER: Drain all power to 0 (vantablack absorbs energy!)
  if (window.state && window.state.power !== undefined) {
    if (DecimalUtils.isDecimal(window.state.power)) {
      window.state.power = new Decimal(0);
    } else {
      window.state.power = 0;
    }
    
    // Update power display if available
    if (typeof window.updatePowerDisplay === 'function') {
      window.updatePowerDisplay();
    }
    if (typeof window.updateUI === 'function') {
      window.updateUI();
    }
  }
  
  // DANGER: Remove 25% of all light types (vantablack absorbs light energy!)
  if (window.prismState) {
    const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
    
    lightTypes.forEach(lightType => {
      if (window.prismState[lightType] && DecimalUtils.isDecimal(window.prismState[lightType])) {
        // Only reduce if the light amount is greater than 0
        if (window.prismState[lightType].gt(0)) {
          // Remove 25% (multiply by 0.75 to keep 75%)
          window.prismState[lightType] = window.prismState[lightType].mul(0.75).floor();
        }
      } else if (window.prismState[lightType] && window.prismState[lightType] > 0) {
        // Handle non-Decimal values
        window.prismState[lightType] = Math.floor(window.prismState[lightType] * 0.75);
      }
    });
    
    // Update light displays
    if (typeof window.forceUpdateAllLightCounters === 'function') {
      window.forceUpdateAllLightCounters();
    }
  }
  
  // Show warning message to user
  if (typeof showPrismSpeech === 'function') {
    showPrismSpeech("The vantablack light has consumed 25% of all light, drained all power, and locked light spawning for 1 minute!", 5000);
  }
}

// Function to clean up vantablack system when KitoFox mode is disabled
function cleanupVantablackSystem() {
  // End any active overload event
  if (window.vantablackOverloadSystem.isActive) {
    endVantablackOverloadEvent(false);
  }
  
  // Remove any existing vantablack tiles
  document.querySelectorAll(".light-tile.vantablack-tile").forEach(tile => {
    tile.classList.remove("vantablack-tile");
  });
  
  // Hide Vi's dialogue if it's currently showing
  const viSpeechBubble = document.getElementById('viSpeechBubble');
  if (viSpeechBubble) {
    viSpeechBubble.style.display = 'none';
  }
  
  // Clear Vi's speech timeout
  if (window.viSpeechTimeout) {
    clearTimeout(window.viSpeechTimeout);
    window.viSpeechTimeout = null;
  }
  
  // Clear KitoFox warning timeout
  if (window.kitoFoxWarningTimeout) {
    clearTimeout(window.kitoFoxWarningTimeout);
    window.kitoFoxWarningTimeout = null;
  }
  
  // Clear Vi "Fixed!" timeout
  if (window.viFixedTimeout) {
    clearTimeout(window.viFixedTimeout);
    window.viFixedTimeout = null;
  }
  
  // Clear system state
  window.vantablackLightSystem.currentVantablackTile = null;
  window.vantablackLightSystem.lightSpawnLocked = false;
  window.vantablackLightSystem.lockoutEndTime = null;
  window.vantablackLightSystem.hasShownWarningDialogue = false;
  window.vantablackLightSystem.forceOverloadOnNextClick = false;
}

// Function to get remaining lockout time in seconds
function getVantablackLockoutTimeRemaining() {
  if (!window.vantablackLightSystem.lightSpawnLocked) return 0;
  
  const currentTime = Date.now();
  const remainingMs = window.vantablackLightSystem.lockoutEndTime - currentTime;
  
  if (remainingMs <= 0) {
    // Lockout expired, clean it up
    window.vantablackLightSystem.lightSpawnLocked = false;
    window.vantablackLightSystem.lockoutEndTime = null;
    return 0;
  }
  
  return Math.ceil(remainingMs / 1000); // Return seconds
}

// Function to update lockout display (if needed)
function updateVantablackLockoutDisplay() {
  const remainingSeconds = getVantablackLockoutTimeRemaining();
  
  if (remainingSeconds > 0) {
    // Show lockout message with countdown
    if (typeof showPrismSpeech === 'function' && remainingSeconds % 10 === 0) {
      // Update message every 10 seconds to avoid spam
      showPrismSpeech(`Vantablack lockout: ${remainingSeconds} seconds remaining...`, 2000);
    }
  }
}

// Vantablack overload event system
window.vantablackOverloadSystem = {
  isActive: false,
  startTime: null,
  duration: 10000, // 10 seconds
  timeoutId: null,
  overlayElement: null
};

// Function to trigger vantablack overload event
function triggerVantablackOverload() {
  if (!isKitoFoxModeActive() || window.vantablackOverloadSystem.isActive) return;
  
  // Mark event as active
  window.vantablackOverloadSystem.isActive = true;
  window.vantablackOverloadSystem.startTime = Date.now();
  
  // Fill entire grid with vantablack tiles - target ALL prism tiles, not just active ones
  document.querySelectorAll('.light-tile').forEach(tile => {
    // Only affect tiles that are part of the prism shape
    if (tile.classList.contains('active-prism')) {
      tile.classList.add('vantablack-tile');
      tile.classList.remove('active-tile', 'red-tile', 'orange-tile', 'white-tile', 'yellow-tile', 'green-tile', 'blue-tile', 'grey-tile');
    }
  });
  
  // Clear any existing active tiles
  currentActiveTile = null;
  window.prismState.activeTileIndex = null;
  window.prismState.activeTileColor = null;
  
  // Create dark overlay
  createVantablackOverloadOverlay();
  
  // Set 10-second timer for Vi's intervention
  window.vantablackOverloadSystem.timeoutId = setTimeout(() => {
    endVantablackOverloadEvent(true); // true = Vi intervention
  }, window.vantablackOverloadSystem.duration);
}

// Function to create the dark overlay effect
function createVantablackOverloadOverlay() {
  // Remove existing overlay if any
  if (window.vantablackOverloadSystem.overlayElement) {
    window.vantablackOverloadSystem.overlayElement.remove();
  }
  
  // Find the actual light grid element (the grid with the tiles)
  const lightGrid = document.getElementById('lightGrid');
  
  let cutoutRadius = 180; // Smaller default radius
  let cutoutX = '50%';
  let cutoutY = '50%';
  
  if (lightGrid) {
    const rect = lightGrid.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    cutoutX = `${centerX}px`;
    cutoutY = `${centerY}px`;
    // Make radius just slightly larger than the grid itself
    cutoutRadius = Math.max(rect.width, rect.height) / 2 + 20;
  }
  
  // Create full-screen dark overlay with gradual darkness
  const overlay = document.createElement('div');
  overlay.id = 'vantablackOverloadOverlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: radial-gradient(
      circle at ${cutoutX} ${cutoutY}, 
      transparent ${cutoutRadius}px,
      rgba(5, 0, 3, 0.3) ${cutoutRadius + 50}px,
      rgba(10, 0, 5, 0.6) ${cutoutRadius + 150}px,
      rgba(15, 0, 8, 0.8) ${cutoutRadius + 300}px,
      rgba(20, 0, 10, 0.95) ${cutoutRadius + 500}px
    ) !important;
    z-index: 9999 !important;
    pointer-events: none !important;
    animation: vantablackDreadPulse 2.5s ease-in-out infinite !important;
  `;
  
  // Store cutout info for animation
  overlay.style.setProperty('--cutout-x', cutoutX);
  overlay.style.setProperty('--cutout-y', cutoutY);
  overlay.style.setProperty('--cutout-radius', `${cutoutRadius}px`);
  
  document.body.appendChild(overlay);
  window.vantablackOverloadSystem.overlayElement = overlay;
}

// Function to end the vantablack overload event
function endVantablackOverloadEvent(viIntervention = false) {
  if (!window.vantablackOverloadSystem.isActive) return;
  
  // Clear timeout if still active
  if (window.vantablackOverloadSystem.timeoutId) {
    clearTimeout(window.vantablackOverloadSystem.timeoutId);
    window.vantablackOverloadSystem.timeoutId = null;
  }
  
  // Remove all vantablack tiles
  document.querySelectorAll('.light-tile.vantablack-tile').forEach(tile => {
    tile.classList.remove('vantablack-tile');
  });
  
  // Remove overlays
  if (window.vantablackOverloadSystem.overlayElement) {
    window.vantablackOverloadSystem.overlayElement.remove();
    window.vantablackOverloadSystem.overlayElement = null;
  }
  
  // Show Vi's intervention message if timer ran out
  if (viIntervention) {
    const viSpeechBubble = document.getElementById('viSpeechBubble');
    if (viSpeechBubble) {
      const viText = document.getElementById('viSpeechText');
      if (viText) {
        viText.textContent = "Fixed!";
      }
      viSpeechBubble.style.display = 'block';
      
      // Set a 5-second timeout for the "Fixed!" message
      if (window.viFixedTimeout) {
        clearTimeout(window.viFixedTimeout);
      }
      window.viFixedTimeout = setTimeout(() => {
        if (viSpeechBubble) {
          viSpeechBubble.style.display = 'none';
        }
        window.viFixedTimeout = null;
      }, 5000);
    }
  }
  
  // Reset system state
  window.vantablackOverloadSystem.isActive = false;
  window.vantablackOverloadSystem.startTime = null;
  
  // Spawn new normal light tiles
  spawnNewLightTile();
}

// Modified vantablack click handler for overload event
function handleVantablackClickOverload() {
  if (window.vantablackOverloadSystem.isActive) {
    // Clicking any vantablack during overload ends the event
    endVantablackOverloadEvent(false);
    return;
  }
  
  // Original vantablack click behavior
  handleVantablackClick();
}

// Function to show KitoFox vantablack warning with guaranteed timeout
function showKitoFoxWarning() {
  const prismTab = document.getElementById('prismSubTab');
  if (!prismTab || prismTab.style.display === 'none') {
    return;
  }
  
  let viSpeechBubble = document.getElementById('viSpeechBubble');
  if (!viSpeechBubble) {
    return;
  }
  
  const viText = document.getElementById('viSpeechText');
  if (viText) {
    viText.textContent = "Mhh, it seems like there's a new light type that manifested itself in my prism grid, that's a vantablack, avoid it at all cost.";
  }
  
  viSpeechBubble.style.display = 'block';
  
  // Clear any existing timeout
  if (window.kitoFoxWarningTimeout) {
    clearTimeout(window.kitoFoxWarningTimeout);
  }
  
  // Set a dedicated timeout for KitoFox warning
  window.kitoFoxWarningTimeout = setTimeout(() => {
    if (viSpeechBubble) {
      viSpeechBubble.style.display = 'none';
    }
    window.kitoFoxWarningTimeout = null;
  }, 8000);
}

// Debug function to force vantablack overload on next light tile click
window.forceVantablackOverloadOnNextClick = function() {
  if (!isKitoFoxModeActive()) {
    console.log("KitoFox mode must be active to trigger vantablack overload!");
    return false;
  }
  
  if (window.vantablackOverloadSystem.isActive) {
    console.log("Vantablack overload is already active!");
    return false;
  }
  
  // Set a flag to force overload on next click
  window.vantablackLightSystem.forceOverloadOnNextClick = true;
  console.log("Next light tile click will trigger vantablack overload!");
  return true;
};

// Make functions globally accessible
window.cleanupVantablackSystem = cleanupVantablackSystem;
window.handleVantablackClick = handleVantablackClick;
window.handleVantablackClickOverload = handleVantablackClickOverload;
window.triggerVantablackOverload = triggerVantablackOverload;
window.endVantablackOverloadEvent = endVantablackOverloadEvent;
window.spawnVantablackLight = spawnVantablackLight;
window.getVantablackLockoutTimeRemaining = getVantablackLockoutTimeRemaining;
window.updateVantablackLockoutDisplay = updateVantablackLockoutDisplay;
window.showKitoFoxWarning = showKitoFoxWarning;

function initPrismGrid() {
  const grid = document.getElementById("lightGrid");
  if (!grid) return;
  
  // Clean up existing tiles before reinitializing
  if (window.PrismCleanupSystem) {
    window.PrismCleanupSystem.cleanupPrismTileListeners();
  }
  
  grid.innerHTML = "";
  // Prism lab operates independently of power status
  for (let i = 0; i < 49; i++) {
    const tile = document.createElement("div");
    tile.classList.add("light-tile");
    tile.dataset.index = i;
    grid.appendChild(tile);
  }
  // Always call the check function to set up the grid state
  if (typeof window.checkPrismGridPowerState === 'function') {
    window.checkPrismGridPowerState();
  }
  // Always spawn tiles and add token chance since prism lab operates independently
  spawnNewLightTile();
  addPrismTileTokenChance();
}

// Cache for active tile to avoid unnecessary DOM queries
let currentActiveTile = null;

// Get additional light tiles count based on Vivien's (Lab) friendship level
function getVivienBonusLightCount() {
  // Check if friendship system exists and get Lab friendship level
  if (!window.friendship || !window.friendship.Lab) {

    return 0;
  }
  
  const labFriendship = window.friendship.Lab;
  const level = labFriendship.level || 0;

  // Bonus lights unlock at level 4, +1 every 2 levels
  if (level < 4) {

    return 0;
  }
  
  const bonusCount = 1 + Math.floor((level - 4) / 2);

  return bonusCount;
}

function spawnMultipleLightTiles() {
  // Check if light spawning is locked due to vantablack click
  if (isLightSpawnLocked()) {
    return; // No lights spawn during lockout
  }
  
  // Clear any existing active tiles first
  if (currentActiveTile) {
    currentActiveTile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
    currentActiveTile = null;
  }
  
  // Clear all other active tiles
  document.querySelectorAll(".light-tile.active-tile").forEach(tile => {
    tile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
  });
  
  // Calculate total tiles to spawn (1 main + bonus)
  const bonusCount = getVivienBonusLightCount();
  const totalTilesToSpawn = 1 + bonusCount;

  // Only spawn if Vi's friendship level is 4+ (otherwise just spawn the main tile)
  if (bonusCount > 0) {
    // Spawn all tiles without clearing between them
    for (let i = 0; i < totalTilesToSpawn; i++) {
      spawnSingleLightTile();
    }
  } else {
    // Vi's level is below 4, only spawn the main tile using the regular spawning function
    spawnNewLightTile();
  }
}

// Function to check and update permanent light unlock flags based on grade
function checkPermanentLightUnlocks() {
  // Find where grade is stored
  let currentGrade = null;
  
  // Check multiple possible locations for grade
  if (window.state && DecimalUtils.isDecimal(window.state.grade)) {
    currentGrade = window.state.grade;
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade)) {
    currentGrade = state.grade;
  } else if (typeof window.grade !== 'undefined' && DecimalUtils.isDecimal(window.grade)) {
    currentGrade = window.grade;
  } else if (window.state && typeof window.state.grade !== 'undefined') {
    // Try to convert to Decimal if it's a number
    currentGrade = new Decimal(window.state.grade || 0);
  } else if (typeof state !== 'undefined' && typeof state.grade !== 'undefined') {
    currentGrade = new Decimal(state.grade || 0);
  }
  
  // Only proceed if we have valid state and grade
  if (!window.state || !window.state.prismState || !window.state.prismState.permanentUnlocks ||
      !currentGrade || !DecimalUtils.isDecimal(currentGrade)) {
    return;
  }
  
  // Check if red light should be permanently unlocked (grade 4+)
  if (!window.state.prismState.permanentUnlocks.redLightUnlocked && 
      currentGrade.gte(4)) {
    window.state.prismState.permanentUnlocks.redLightUnlocked = true;
  }
  
  // Check if orange light should be permanently unlocked (grade 6+)
  if (!window.state.prismState.permanentUnlocks.orangeLightUnlocked && 
      currentGrade.gte(6)) {
    window.state.prismState.permanentUnlocks.orangeLightUnlocked = true;
  }
}

// New function that spawns a single tile without clearing existing ones
function spawnSingleLightTile() {
  // Check if light spawning is locked due to vantablack click
  if (isLightSpawnLocked()) {
    return; // No lights spawn during lockout
  }
  
  const eligible = Array.from(document.querySelectorAll(".light-tile.active-prism"));
  
  // Remove tiles that are already active from the eligible list
  const availableTiles = eligible.filter(tile => !tile.classList.contains("active-tile"));
  
  if (availableTiles.length === 0) {
    return;
  }
  
  const randomTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  const index = parseInt(randomTile.dataset.index);
  
  // Check for permanent unlock flags first
  checkPermanentLightUnlocks();
  
  // Find the correct grade reference
  let currentGrade = null;
  if (window.state && DecimalUtils.isDecimal(window.state.grade)) {
    currentGrade = window.state.grade;
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade)) {
    currentGrade = state.grade;
  } else if (typeof window.grade !== 'undefined' && DecimalUtils.isDecimal(window.grade)) {
    currentGrade = window.grade;
  } else if (window.state && typeof window.state.grade !== 'undefined') {
    currentGrade = new Decimal(window.state.grade || 0);
  } else if (typeof state !== 'undefined' && typeof state.grade !== 'undefined') {
    currentGrade = new Decimal(state.grade || 0);
  }
  
  // Check if yellow light is unlocked - prism core level 2 OR grade 8+ fallback
  const yellowUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(2)) || 
                         (currentGrade && currentGrade.gte(8));
  // Check if green light is unlocked - prism core level 3 OR grade 10+ fallback
  const greenUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(3)) || 
                        (currentGrade && currentGrade.gte(10));
  // Check if blue light is unlocked - prism core level 4 OR grade 12+ fallback
  const blueUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(4)) || 
                       (currentGrade && currentGrade.gte(12));
  
  // Check unlock conditions for red and orange light - now includes permanent unlocks
  const redUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(1)) || 
                     (currentGrade && currentGrade.gte(4)) ||
                     (window.state && window.state.prismState && window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.redLightUnlocked);
  const orangeUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(1)) || 
                         (currentGrade && currentGrade.gte(6)) ||
                         (window.state && window.state.prismState && window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.orangeLightUnlocked);
  
  // Check if prism core has been upgraded at least once (level > 1)
  const prismCoreUpgraded = window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gt(1);
  
  // Check for grey anomaly - if active, only spawn grey tiles
  if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.prismGreyAnomaly) {
    randomTile.classList.add("active-tile", "grey-tile");
    return;
  }
  
  if (prismCoreUpgraded) {
    // If prism core has been upgraded, make all light types available based on unlock conditions
    const roll = Math.random();
    
    if (blueUnlocked && roll < 0.08) {
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.16) {
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.24) {
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.44) {
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.72) {
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (currentGrade && currentGrade.gte(6)) {
    const roll = Math.random();
    
    if (blueUnlocked && roll < 0.08) {
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.16) {
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.24) {
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.44) {
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.72) {
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (currentGrade && currentGrade.gte(4)) {
    const roll = Math.random();
    
    if (blueUnlocked && roll < 0.1) {
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.2) {
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.3) {
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.5) {
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.65) {
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else {
    // If prism core hasn't been upgraded and grade is too low, only spawn white light
    randomTile.classList.add("active-tile", "white-tile");
  }
}

// Function to spawn new tiles without clearing existing active tiles (used after clicking)
function spawnNewLightTilesWithoutClearing() {
  // Calculate target total tiles (1 main + bonus)
  const bonusCount = getVivienBonusLightCount();
  const targetTotalTiles = 1 + bonusCount;
  
  // Count current active tiles
  const currentActiveTiles = document.querySelectorAll(".light-tile.active-tile").length;
  const tilesToSpawn = Math.max(0, targetTotalTiles - currentActiveTiles);

  // Only spawn tiles if we're below the target
  for (let i = 0; i < tilesToSpawn; i++) {
    spawnSingleLightTile();
  }
  
  if (tilesToSpawn > 0 && bonusCount > 0) {

  }
}

// Function to collect all active light tiles (Vivien's level 7+ buff)
function collectAllActiveLightTiles(friendshipMultiplier) {
  const allActiveTiles = document.querySelectorAll('.light-tile.active-tile');
  let totalCollected = 0;

  allActiveTiles.forEach((tile, tileIndex) => {
    // Determine color from tile's CSS classes
    let tileColor = 'light';
    if (tile.classList.contains('grey-tile')) {
      tileColor = 'greylight';
    } else if (tile.classList.contains('blue-tile')) {
      tileColor = 'bluelight';
    } else if (tile.classList.contains('green-tile')) {
      tileColor = 'greenlight';
    } else if (tile.classList.contains('yellow-tile')) {
      tileColor = 'yellowlight';
    } else if (tile.classList.contains('orange-tile')) {
      tileColor = 'orangelight';
    } else if (tile.classList.contains('red-tile')) {
      tileColor = 'redlight';
    } else if (tile.classList.contains('white-tile')) {
      tileColor = 'light';
    }

    // Calculate gain for this tile (simplified version of the main logic)
    let tileGain = calculateLightTileGain(tileColor, friendshipMultiplier);
    
    // Add to the appropriate currency and capture the actual amount added
    const currencyName = tileColor === 'redlight' ? 'redLight' : 
                        tileColor === 'orangelight' ? 'orangeLight' :
                        tileColor === 'yellowlight' ? 'yellowLight' :
                        tileColor === 'greenlight' ? 'greenLight' :
                        tileColor === 'bluelight' ? 'blueLight' :
                        'light';
    
    let actualGainAmount;
    if (typeof window.addCurrency === 'function') {
      actualGainAmount = window.addCurrency(currencyName, tileGain);
    } else {
      // Fallback direct addition - apply challenge nerfs manually
      let processedGain = tileGain;
      if (typeof window.applyChallengeNerfs === 'function') {
        processedGain = window.applyChallengeNerfs(processedGain, tileColor);
      }
      
      // Fallback direct addition
      if (currencyName === 'light') {
        window.prismState.light = window.prismState.light.add(processedGain);
      } else if (currencyName === 'redLight') {
        window.prismState.redlight = window.prismState.redlight.add(processedGain);
      }
      actualGainAmount = processedGain;
      // Add other colors as needed
    }
    
    // Show popup for this tile collection
    const popupText = friendshipMultiplier.gt(1) ? 
      (tileColor === 'light' ? 'light (X5!)' :
       tileColor === 'redlight' ? 'red light (X5!)' :
       tileColor === 'orangelight' ? 'orange light (X5!)' :
       tileColor === 'yellowlight' ? 'yellow light (X5!)' :
       tileColor === 'greenlight' ? 'green light (X5!)' :
       tileColor === 'bluelight' ? 'blue light (X5!)' :
       `${tileColor} (X5!)`) :
      (tileColor === 'light' ? 'light' :
       tileColor === 'redlight' ? 'red light' :
       tileColor === 'orangelight' ? 'orange light' :
       tileColor === 'yellowlight' ? 'yellow light' :
       tileColor === 'greenlight' ? 'green light' :
       tileColor === 'bluelight' ? 'blue light' :
       tileColor);
    
    const popupId = tileColor === 'redlight' ? 'redlightCount' :
                   tileColor === 'orangelight' ? 'orangelightCount' :
                   tileColor === 'yellowlight' ? 'yellowlightCount' :
                   tileColor === 'greenlight' ? 'greenlightCount' :
                   tileColor === 'bluelight' ? 'bluelightCount' :
                   'lightCount';
    
    if (typeof showPrismGainPopup === 'function') {
      // Add a small delay for each popup so they don't all appear at exactly the same time
      setTimeout(() => {
        showPrismGainPopup(popupId, actualGainAmount, popupText);
      }, tileIndex * 50); // 50ms delay between each popup
    }
    
    // Update tracker
    if (window.prismClickTracker) {
      if (DecimalUtils.isDecimal(actualGainAmount)) {
        window.prismClickTracker[tileColor] = (window.prismClickTracker[tileColor] || new Decimal(0)).add(actualGainAmount);
      } else {
        window.prismClickTracker[tileColor] = (window.prismClickTracker[tileColor] || new Decimal(0)).add(new Decimal(actualGainAmount));
      }
    }
    
    // Remove the tile
    tile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
    totalCollected++;
  });

  // Update counters after collecting all
  if (typeof forceUpdateAllLightCounters === 'function') {
    forceUpdateAllLightCounters();
  }
}

// Helper function to calculate gain for a light tile
function calculateLightTileGain(color, friendshipMultiplier) {
  let baseGain = new Decimal(1);
  let totalGain = baseGain;
  
  // Apply basic light calculations (simplified)
  if (color === 'light') {
    let particleBoost = typeof getParticleBoost === 'function' ? getParticleBoost() : new Decimal(0);
    totalGain = totalGain.add(particleBoost);
    if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
    if (typeof window.getLightGain === 'function') {
      totalGain = window.getLightGain(totalGain);
    }
  } else if (color === 'redlight') {
    let redParticleBoost = DecimalUtils.multiply((window.prismState.redlightparticle || new Decimal(0)).floor(), 0.1);
    totalGain = totalGain.add(redParticleBoost);
    if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
    if (typeof window.getRedlightGain === 'function') {
      totalGain = window.getRedlightGain(totalGain);
    }
  }
  // Add other color calculations as needed
  
  // Apply friendship multiplier
  totalGain = totalGain.mul(friendshipMultiplier);
  
  // Apply charger boost if available
  if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
    totalGain = totalGain.mul(window._chargerLightBoost);
  }
  
  return totalGain.floor();
}

// Debug function to test Vivien's multi-collection buff
window.testVivienMultiCollection = function(level = 7) {

  if (!window.friendship) {
    window.friendship = {};
  }
  if (!window.friendship.Lab) {
    window.friendship.Lab = { level: 0, points: new Decimal(0) };
  }
  
  // Set level for testing
  window.friendship.Lab.level = level;
  const expectedChance = 5 + Math.max(0, (level - 7) * 5);





  return {
    level: level,
    chance: expectedChance,
    activeTiles: document.querySelectorAll('.light-tile.active-tile').length
  };
};

// Debug function to test Vivien's bonus light spawning
window.testVivienBonusLights = function() {

  if (!window.friendship || !window.friendship.Lab) {

    return false;
  }
  
  const level = window.friendship.Lab.level;
  const expectedBonus = getVivienBonusLightCount();



  if (level < 4) {

    return false;
  }
  
  // Count current light tiles
  const currentLights = document.querySelectorAll('.light-tile').length;

  // Test spawning

  spawnMultipleLightTiles();
  
  // Count after spawning
  setTimeout(() => {
    const newLights = document.querySelectorAll('.light-tile').length;
    const spawned = newLights - currentLights;


    if (spawned === 1 + expectedBonus) {

    } else {

    }
  }, 100);
  
  return true;
};

function spawnNewLightTile() {
  // Prism lab operates independently of power status
  
  // Check if light spawning is locked due to vantablack click
  if (isLightSpawnLocked()) {
    return; // No lights spawn during lockout
  }
  
  // Only clear previous tile if it exists, avoid querying all tiles
  if (currentActiveTile) {
    currentActiveTile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
    currentActiveTile = null;
  }
  
  const eligible = Array.from(document.querySelectorAll(".light-tile.active-prism"));
  if (eligible.length === 0) return;
  const randomTile = eligible[Math.floor(Math.random() * eligible.length)];
  const index = parseInt(randomTile.dataset.index);
  window.prismState.activeTileIndex = index;
  currentActiveTile = randomTile; // Cache the active tile
  
  // Check for permanent unlock flags first
  checkPermanentLightUnlocks();
  
  // Find the correct grade reference
  let currentGrade = null;
  if (window.state && DecimalUtils.isDecimal(window.state.grade)) {
    currentGrade = window.state.grade;
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade)) {
    currentGrade = state.grade;
  } else if (typeof window.grade !== 'undefined' && DecimalUtils.isDecimal(window.grade)) {
    currentGrade = window.grade;
  } else if (window.state && typeof window.state.grade !== 'undefined') {
    currentGrade = new Decimal(window.state.grade || 0);
  } else if (typeof state !== 'undefined' && typeof state.grade !== 'undefined') {
    currentGrade = new Decimal(state.grade || 0);
  }
  
  // Check unlock conditions for different light types
  // Red light: unlocked via prism core level 1+ OR high grade (fallback at grade 4+) OR permanent unlock
  const redUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(1)) || 
                     (currentGrade && currentGrade.gte(4)) ||
                     (window.state && window.state.prismState && window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.redLightUnlocked);
  // Orange light: unlocked via prism core level 1+ OR high grade (fallback at grade 6+) OR permanent unlock
  const orangeUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(1)) || 
                         (currentGrade && currentGrade.gte(6)) ||
                         (window.state && window.state.prismState && window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.orangeLightUnlocked);
  // Yellow light: unlocked via prism core level 2 OR high grade (fallback at grade 8+)
  const yellowUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(2)) || 
                        (currentGrade && currentGrade.gte(8));
  // Green light: unlocked via prism core level 3 OR high grade (fallback at grade 10+)
  const greenUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(3)) || 
                       (currentGrade && currentGrade.gte(10));
  // Blue light: unlocked via prism core level 4 OR high grade (fallback at grade 12+)
  const blueUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(4)) || 
                      (currentGrade && currentGrade.gte(12));
  
  // Check if prism core has been upgraded at least once (level > 1)
  const prismCoreUpgraded = window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gt(1);
  
  // Check for grey anomaly - if active, only spawn grey tiles
  if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.prismGreyAnomaly) {
    window.prismState.activeTileColor = 'greylight';
    randomTile.classList.add("active-tile", "grey-tile");
    return;
  }
  
  const roll = Math.random();
  
  if (prismCoreUpgraded) {
    // If prism core has been upgraded, make all light types available
    if (blueUnlocked && roll < 0.08) {
      window.prismState.activeTileColor = 'bluelight';
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.16) {
      window.prismState.activeTileColor = 'greenlight';
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.24) {
      window.prismState.activeTileColor = 'yellowlight';
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.44) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof window.state !== 'undefined' && DecimalUtils.isDecimal(window.state.grade) && window.state.grade.gte(8)) {
    const roll = Math.random();
    if (blueUnlocked && roll < 0.1) {
      window.prismState.activeTileColor = 'bluelight';
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.2) {
      window.prismState.activeTileColor = 'greenlight';
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.3) {
      window.prismState.activeTileColor = 'yellowlight';
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.5) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.75) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof window.state !== 'undefined' && DecimalUtils.isDecimal(window.state.grade) && window.state.grade.gte(7)) {
    const roll = Math.random();
    if (blueUnlocked && roll < 0.08) {
      window.prismState.activeTileColor = 'bluelight';
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.16) {
      window.prismState.activeTileColor = 'greenlight';
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.24) {
      window.prismState.activeTileColor = 'yellowlight';
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.44) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (currentGrade && currentGrade.gte(6)) {
    const roll = Math.random();
    
    if (blueUnlocked && roll < 0.08) {
      window.prismState.activeTileColor = 'bluelight';
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.16) {
      window.prismState.activeTileColor = 'greenlight';
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.24) {
      window.prismState.activeTileColor = 'yellowlight';
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.44) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof window.state !== 'undefined' && DecimalUtils.isDecimal(window.state.grade) && window.state.grade.gte(4)) {
    const roll = Math.random();
    if (blueUnlocked && roll < 0.1) {
      window.prismState.activeTileColor = 'bluelight';
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.2) {
      window.prismState.activeTileColor = 'greenlight';
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.3) {
      window.prismState.activeTileColor = 'yellowlight';
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (redUnlocked && roll < 0.65) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else {
    const roll = Math.random();
    if (blueUnlocked && roll < 0.12) {
      window.prismState.activeTileColor = 'bluelight';
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.24) {
      window.prismState.activeTileColor = 'greenlight';
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.36) {
      window.prismState.activeTileColor = 'yellowlight';
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (orangeUnlocked && roll < 0.54) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (redUnlocked && roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  }
  
  // In KitoFox mode, always spawn a vantablack light alongside normal light
  if (isKitoFoxModeActive()) {
    const currentTileIndex = parseInt(randomTile.dataset.index);
    spawnVantablackLight(currentTileIndex);
  }
}

function clickLightTile(index) {
  // Check if the clicked tile is any active tile
  const clickedTile = document.querySelector(`.light-tile[data-index="${index}"]`);
  
  // Check if this is a vantablack tile click (dangerous!)
  if (clickedTile && clickedTile.classList.contains('vantablack-tile')) {
    handleVantablackClickOverload();
    return; // Don't process as normal light
  }
  
  if (clickedTile && clickedTile.classList.contains('active-tile')) {
    if (typeof window.trackHardModePrismClick === 'function') {
      window.trackHardModePrismClick();
    }
    
    // Determine color from the clicked tile's CSS classes
    let color = 'light';
    if (clickedTile.classList.contains('grey-tile')) {
      color = 'greylight';
    } else if (clickedTile.classList.contains('blue-tile')) {
      color = 'bluelight';
    } else if (clickedTile.classList.contains('green-tile')) {
      color = 'greenlight';
    } else if (clickedTile.classList.contains('yellow-tile')) {
      color = 'yellowlight';
    } else if (clickedTile.classList.contains('orange-tile')) {
      color = 'orangelight';
    } else if (clickedTile.classList.contains('red-tile')) {
      color = 'redlight';
    } else if (clickedTile.classList.contains('white-tile')) {
      color = 'light';
    }

    // Ensure prismState properties are Decimals
    if (!DecimalUtils.isDecimal(window.prismState[color])) {
      window.prismState[color] = new Decimal(window.prismState[color] || 0);
    }
    if (!DecimalUtils.isDecimal(window.prismState.redlightparticle)) {
      window.prismState.redlightparticle = new Decimal(window.prismState.redlightparticle || 0);
    }
    if (!DecimalUtils.isDecimal(window.prismState.orangelightparticle)) {
      window.prismState.orangelightparticle = new Decimal(window.prismState.orangelightparticle || 0);
    }
    
    let baseGain = new Decimal(1);
    let totalGain = baseGain;
    
    // Check for Vi's friendship buff (25% + 5% per level chance for X5 light gain)
    let friendshipMultiplier = new Decimal(1);
    if (window.friendship && window.friendship.Lab && window.friendship.Lab.level >= 1) {
      const viLevel = window.friendship.Lab.level;
      const buffChance = new Decimal(25).add(new Decimal(5).mul(Math.max(0, viLevel - 1))).toNumber();
      const random = Math.random() * 100;
      if (random < buffChance) {
        friendshipMultiplier = new Decimal(5);
      }
    }
    
    // Check for Vi's level 7+ friendship buff (multi-collection)
    let shouldCollectAllTiles = false;
    if (window.friendship && window.friendship.Lab && window.friendship.Lab.level >= 7) {
      const viLevel = window.friendship.Lab.level;
      const multiCollectionChance = 5 + Math.max(0, (viLevel - 7) * 5);
      const multiRandom = Math.random() * 100;

      if (multiRandom < multiCollectionChance) {
        shouldCollectAllTiles = true;

      }
    }
    
    if (color === 'light') {
      let particleBoost = getParticleBoost();
      totalGain = totalGain.add(particleBoost);
      if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
      totalGain = window.getLightGain(totalGain);
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      
      totalGain = totalGain.floor(); 
    } else if (color === 'redlight') {
      let redParticleBoost = DecimalUtils.multiply(window.prismState.redlightparticle.floor(), 0.1);
      totalGain = totalGain.add(redParticleBoost);
      if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
      if (typeof window.getRedlightGain === 'function') {
        totalGain = window.getRedlightGain(totalGain);
      }
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      totalGain = totalGain.floor();
    } else if (color === 'orangelight') {
      let orangeParticleBoost = DecimalUtils.multiply(window.prismState.orangelightparticle.floor(), 0.1);
      totalGain = totalGain.add(orangeParticleBoost);
      if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
      if (typeof window.getOrangelightGain === 'function') {
        totalGain = window.getOrangelightGain(totalGain);
      }
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      
      totalGain = totalGain.floor();
    } else if (color === 'yellowlight') {
      let yellowParticleBoost = DecimalUtils.multiply(window.prismState.yellowlightparticle.floor(), 0.1);
      totalGain = totalGain.add(yellowParticleBoost);
      if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
      if (typeof window.getYellowlightGain === 'function') {
        totalGain = window.getYellowlightGain(totalGain);
      }
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      
      totalGain = totalGain.floor();
    } else if (color === 'greenlight') {
      let greenParticleBoost = DecimalUtils.multiply(window.prismState.greenlightparticle.floor(), 0.1);
      totalGain = totalGain.add(greenParticleBoost);
      if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
      if (typeof window.getGreenlightGain === 'function') {
        totalGain = window.getGreenlightGain(totalGain);
      }
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      totalGain = totalGain.floor();
    } else if (color === 'bluelight') {
      let blueParticleBoost = DecimalUtils.multiply(window.prismState.bluelightparticle.floor(), 0.1);
      totalGain = totalGain.add(blueParticleBoost);
      if (window.boughtElements && window.boughtElements["13"]) totalGain = totalGain.mul(5);
      if (typeof window.getBluelightGain === 'function') {
        totalGain = window.getBluelightGain(totalGain);
      }
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      
      totalGain = totalGain.floor();
    } else if (color === 'greylight') {
      // Grey light does nothing - anomaly effect
      spawnMultipleLightTiles();
      return; // Exit early, don't process further
    }
    if (color === 'light' || color === 'redlight' || color === 'orangelight' || color === 'yellowlight' || color === 'greenlight' || color === 'bluelight') {
      // Apply Vi's friendship buff multiplier
      totalGain = totalGain.mul(friendshipMultiplier);
      totalGain = totalGain.floor(); 
      
      // Use addCurrency to apply lab boost and anomaly debuff
      const currencyName = color === 'redlight' ? 'redLight' : 
                          color === 'orangelight' ? 'orangeLight' :
                          color === 'yellowlight' ? 'yellowLight' :
                          color === 'greenlight' ? 'greenLight' :
                          color === 'bluelight' ? 'blueLight' : 
                          color; // 'light' stays as 'light'
      
      let actualGain;
      if (typeof window.addCurrency === 'function') {
        actualGain = window.addCurrency(currencyName, totalGain);
      } else {
        // Fallback to direct assignment if addCurrency not available
        window.prismState[color] = window.prismState[color].add(totalGain);
        actualGain = totalGain; // Assume no debuffs applied
      }
      
      // Track actual click gains for statistics
      if (!window.prismClickTracker) {
        window.prismClickTracker = {
          light: new Decimal(0),
          redlight: new Decimal(0),
          orangelight: new Decimal(0),
          yellowlight: new Decimal(0),
          greenlight: new Decimal(0),
          bluelight: new Decimal(0),
          lastClickTime: Date.now(),
          clickCount: 0
        };
      }
      
      // Update the tracker with the actual gain
      if (DecimalUtils.isDecimal(actualGain)) {
        window.prismClickTracker[color] = actualGain;
      } else {
        window.prismClickTracker[color] = new Decimal(actualGain);
      }
      window.prismClickTracker.lastClickTime = Date.now();
      window.prismClickTracker.clickCount++;
      
      if (color === 'orangelight' && typeof window.trackOrangeLightMilestone === 'function') {
        window.trackOrangeLightMilestone(window.prismState.orangelight);
      }
      forceUpdateAllLightCounters();
      
      // KitoFox mode: Check for forced overload or 1% chance of vantablack overload event
      if (isKitoFoxModeActive()) {
        const shouldTriggerOverload = window.vantablackLightSystem.forceOverloadOnNextClick || Math.random() < 0.01;
        
        if (shouldTriggerOverload) {
          // Clear the force flag if it was set
          if (window.vantablackLightSystem.forceOverloadOnNextClick) {
            window.vantablackLightSystem.forceOverloadOnNextClick = false;
            console.log("Forced vantablack overload triggered!");
          }
          
          triggerVantablackOverload();
          return; // Exit early, overload handles everything
        }
      }
      
      if (shouldCollectAllTiles) {
        // Multi-collection buff: collect ALL active light tiles
        collectAllActiveLightTiles(friendshipMultiplier);
        // After collecting all, spawn full set of new tiles
        spawnMultipleLightTiles();
      } else {
        // Normal behavior: remove only the clicked tile
        clickedTile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");

        // Spawn new tiles without clearing remaining active tiles
        spawnNewLightTilesWithoutClearing();
      }
      if (color === 'light') {
        const popupText = friendshipMultiplier.gt(1) ? 'light (X5!)' : 'light';
        showPrismGainPopup('lightCount', actualGain, popupText);
      } else if (color === 'redlight') {
        const popupText = friendshipMultiplier.gt(1) ? 'red light (X5!)' : 'red light';
        showPrismGainPopup('redlightCount', actualGain, popupText);
      } else if (color === 'orangelight') {
        const popupText = friendshipMultiplier.gt(1) ? 'orange light (X5!)' : 'orange light';
        showPrismGainPopup('orangelightCount', actualGain, popupText);
      } else if (color === 'yellowlight') {
        const popupText = friendshipMultiplier.gt(1) ? 'yellow light (X5!)' : 'yellow light';
        showPrismGainPopup('yellowlightCount', actualGain, popupText);
      } else if (color === 'greenlight') {
        const popupText = friendshipMultiplier.gt(1) ? 'green light (X5!)' : 'green light';
        showPrismGainPopup('greenlightCount', actualGain, popupText);
      } else if (color === 'bluelight') {
        const popupText = friendshipMultiplier.gt(1) ? 'blue light (X5!)' : 'blue light';
        showPrismGainPopup('bluelightCount', actualGain, popupText);
      }
      
      // Award friendship to Vivien for clicking light tiles
      awardVivienFriendshipForLightTileClick();
      
      // In KitoFox mode, clicking normal light respawns vantablack on different tile
      if (isKitoFoxModeActive() && !shouldCollectAllTiles) {
        // Get the index of the clicked tile to exclude it from vantablack spawning
        const clickedTileIndex = parseInt(clickedTile.dataset.index);
        spawnVantablackLight(clickedTileIndex);
      }
    }
    
    // Track prism tile click for front desk automator unlocks
    if (window.frontDesk && typeof window.frontDesk.onPrismTileClicked === 'function') {
      window.frontDesk.onPrismTileClicked();
    }
  }
}

function ensureClickHandlers() {
  // Since checkPrismGridPowerState already sets up onclick handlers,
  // just make sure it's called to refresh the handlers
  if (typeof window.checkPrismGridPowerState === 'function') {
    window.checkPrismGridPowerState();
  }
}

function updateLightCounter() {
  if (!window.prismState || !DecimalUtils.isDecimal(window.prismState.light)) {
    window.prismState.light = new Decimal(window.prismState.light || 0);
  }
  const light = window.prismState.light.floor(); 
  const multiplier = new Decimal(1).add(light.mul(0.01));
  
  // Use cached elements if available
  const countEl = cachedDOMElements ? cachedDOMElements.lightCount : document.getElementById("lightCount");
  const multEl = cachedDOMElements ? cachedDOMElements.lightKPMult : document.getElementById("lightKPMult");

  function formatLargeInt(num) {
    // Use DecimalUtils with current notation preference
    return DecimalUtils.formatDecimal(num);
  }

  if (countEl) countEl.textContent = formatNumber(light);
  if (multEl) {
    multEl.textContent = `× ${formatNumber(multiplier)} KP`;
  }
  
  // Always add nerf display for calibration system
  let nerfEl = document.getElementById('lightEnergyNerfDisplay');
  
  if (!nerfEl && countEl) {
    // Create nerf display element
    nerfEl = document.createElement('div');
    nerfEl.id = 'lightEnergyNerfDisplay';
    nerfEl.style.color = '#ff6666';
    nerfEl.style.fontSize = '0.8em';
    nerfEl.style.fontWeight = 'bold';
    nerfEl.style.marginBottom = '2px';
    
    // Insert above the light count
    countEl.parentNode.insertBefore(nerfEl, countEl);
  }
  
  // Note: Nerf display is now handled by the updateNerfDisplay function
  // which runs on its own interval for better performance and formatting
}

function getParticleBoost() {
  let particleBoost = new Decimal(0);
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  
  // Optimize by doing fewer Decimal operations
  for (const particleType of particleTypes) {
    if (window.prismState[particleType] && window.prismState[particleType].gt(0)) {
      const count = window.prismState[particleType].floor();
      particleBoost = particleBoost.add(count.mul(0.1));
    }
  }
  return particleBoost;
}

// Throttle prism UI updates to improve performance - increased FPS
let lastPrismUpdateTime = 0;
const PRISM_UPDATE_THROTTLE = 100; // Update UI at most every 100ms (10 FPS) for better responsiveness

// Cache DOM elements for better performance
let cachedDOMElements = null;

function initializeDOMCache() {
  const lightTypes = ['redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  
  cachedDOMElements = {
    lightCount: document.getElementById("lightCount"),
    lightKPMult: document.getElementById("lightKPMult"),
    particleBoost: document.getElementById('particleBoost'),
    redlightParticleBoost: document.getElementById('redlightParticleBoost'),
    orangelightParticleBoost: document.getElementById('orangelightParticleBoost'),
    yellowlightParticleBoost: document.getElementById('yellowlightParticleBoost'),
    greenlightParticleBoost: document.getElementById('greenlightParticleBoost'),
    bluelightParticleBoost: document.getElementById('bluelightParticleBoost'),
    redlightCount: document.getElementById('redlightCount'),
    redlightFeatherBoost: document.getElementById('redlightFeatherBoost'),
    orangelightCount: document.getElementById('orangelightCount'),
    orangelightArtifactBoost: document.getElementById('orangelightArtifactBoost'),
    yellowlightCount: document.getElementById('yellowlightCount'),
    yellowlightChargeBoost: document.getElementById('yellowlightChargeBoost'),
    greenlightCount: document.getElementById('greenlightCount'),
    greenlightSwariaCoinBoost: document.getElementById('greenlightSwariaCoinBoost'),
    bluelightCount: document.getElementById('bluelightCount'),
    bluelightFluffBoost: document.getElementById('bluelightFluffBoost'),
    lightElements: {},
    particleElements: {}
  };
  
  // Cache light type elements
  lightTypes.forEach(type => {
    cachedDOMElements.lightElements[type] = document.getElementById(`${type}Count`);
  });
  
  // Cache particle type elements
  particleTypes.forEach(type => {
    cachedDOMElements.particleElements[type] = document.getElementById(`${type}Count`);
  });
}

function updateAllLightCounters() {
  const now = Date.now();
  if (now - lastPrismUpdateTime < PRISM_UPDATE_THROTTLE) {
    return; // Skip update if not enough time has passed
  }
  lastPrismUpdateTime = now;
  
  // Initialize cache if not done yet
  if (!cachedDOMElements) {
    initializeDOMCache();
  }
  
  updateLightCounter();
  
  // Use cached elements instead of repeated DOM queries
  const lightTypes = ['redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
  lightTypes.forEach(type => {
    const countEl = cachedDOMElements.lightElements[type];
    if (countEl) {
      countEl.textContent = formatNumber(window.prismState[type]);
    }
  });
  
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  particleTypes.forEach(type => {
    const countEl = cachedDOMElements.particleElements[type];
    if (countEl) {
      countEl.textContent = formatNumber(window.prismState[type]);
    }
  });
  
  const boost = getParticleBoost();
  const boostEl = cachedDOMElements.particleBoost;

  function formatLargeInt(num) {
    num = DecimalUtils.isDecimal(num) ? num.floor() : new Decimal(num).floor();
    if (num.gte("1e6")) {
      return num.toExponential(0);
    }
    return num.toNumber().toLocaleString();
  }

  if (boostEl) {
    boostEl.textContent = `+${formatNumber(boost)} per click`;
    let redParticleBoostSpan = cachedDOMElements.redlightParticleBoost;
    let redParticleBoost = DecimalUtils.multiply(window.prismState.redlightparticle || new Decimal(0), 0.1);
    let redParticleBoostText = '';
    if (redParticleBoost.gt(0)) {
      redParticleBoostText = `+${formatNumber(redParticleBoost)} per click`;
    }
    if (!redParticleBoostSpan) {
      redParticleBoostSpan = document.createElement('span');
      redParticleBoostSpan.id = 'redlightParticleBoost';
      boostEl.parentNode.insertBefore(redParticleBoostSpan, boostEl.nextSibling);
      cachedDOMElements.redlightParticleBoost = redParticleBoostSpan; // Update cache
    }
    redParticleBoostSpan.textContent = redParticleBoostText;
    redParticleBoostSpan.style.color = '#ff4444'; 
    redParticleBoostSpan.style.fontWeight = 'bold';
    redParticleBoostSpan.style.display = 'block';
    redParticleBoostSpan.style.marginLeft = '0';
    redParticleBoostSpan.style.marginTop = '2px';
    let orangeParticleBoostSpan = cachedDOMElements.orangelightParticleBoost;
    let orangeParticleBoost = DecimalUtils.multiply(window.prismState.orangelightparticle || new Decimal(0), 0.1);
    let orangeParticleBoostText = '';
    if (orangeParticleBoost.gt(0)) {
      orangeParticleBoostText = `+${formatNumber(orangeParticleBoost)} per click`;
    }
    if (!orangeParticleBoostSpan) {
      orangeParticleBoostSpan = document.createElement('span');
      orangeParticleBoostSpan.id = 'orangelightParticleBoost';
      if (redParticleBoostSpan.nextSibling) {
        redParticleBoostSpan.parentNode.insertBefore(orangeParticleBoostSpan, redParticleBoostSpan.nextSibling);
      } else {
        redParticleBoostSpan.parentNode.appendChild(orangeParticleBoostSpan);
      }
      cachedDOMElements.orangelightParticleBoost = orangeParticleBoostSpan; // Update cache
    }
    orangeParticleBoostSpan.textContent = orangeParticleBoostText;
    orangeParticleBoostSpan.style.color = '#ff9900'; 
    orangeParticleBoostSpan.style.fontWeight = 'bold';
    orangeParticleBoostSpan.style.display = 'block';
    orangeParticleBoostSpan.style.marginLeft = '0';
    orangeParticleBoostSpan.style.marginTop = '2px';
    
    // Yellow light particle boost
    let yellowParticleBoostSpan = cachedDOMElements.yellowlightParticleBoost;
    let yellowParticleBoost = DecimalUtils.multiply(window.prismState.yellowlightparticle || new Decimal(0), 0.1);
    let yellowParticleBoostText = '';
    if (yellowParticleBoost.gt(0)) {
      yellowParticleBoostText = `+${formatNumber(yellowParticleBoost)} per click`;
    }
    if (!yellowParticleBoostSpan) {
      yellowParticleBoostSpan = document.createElement('span');
      yellowParticleBoostSpan.id = 'yellowlightParticleBoost';
      if (orangeParticleBoostSpan.nextSibling) {
        orangeParticleBoostSpan.parentNode.insertBefore(yellowParticleBoostSpan, orangeParticleBoostSpan.nextSibling);
      } else {
        orangeParticleBoostSpan.parentNode.appendChild(yellowParticleBoostSpan);
      }
      cachedDOMElements.yellowlightParticleBoost = yellowParticleBoostSpan; // Update cache
    }
    yellowParticleBoostSpan.textContent = yellowParticleBoostText;
    yellowParticleBoostSpan.style.color = '#ffff00'; 
    yellowParticleBoostSpan.style.fontWeight = 'bold';
    yellowParticleBoostSpan.style.display = 'block';
    yellowParticleBoostSpan.style.marginLeft = '0';
    yellowParticleBoostSpan.style.marginTop = '2px';
    
    // Green light particle boost
    let greenParticleBoostSpan = cachedDOMElements.greenlightParticleBoost;
    let greenParticleBoost = DecimalUtils.multiply(window.prismState.greenlightparticle || new Decimal(0), 0.1);
    let greenParticleBoostText = '';
    if (greenParticleBoost.gt(0)) {
      greenParticleBoostText = `+${formatNumber(greenParticleBoost)} per click`;
    }
    if (!greenParticleBoostSpan) {
      greenParticleBoostSpan = document.createElement('span');
      greenParticleBoostSpan.id = 'greenlightParticleBoost';
      if (yellowParticleBoostSpan.nextSibling) {
        yellowParticleBoostSpan.parentNode.insertBefore(greenParticleBoostSpan, yellowParticleBoostSpan.nextSibling);
      } else {
        yellowParticleBoostSpan.parentNode.appendChild(greenParticleBoostSpan);
      }
      cachedDOMElements.greenlightParticleBoost = greenParticleBoostSpan; // Update cache
    }
    greenParticleBoostSpan.textContent = greenParticleBoostText;
    greenParticleBoostSpan.style.color = '#00ff00'; 
    greenParticleBoostSpan.style.fontWeight = 'bold';
    greenParticleBoostSpan.style.display = 'block';
    greenParticleBoostSpan.style.marginLeft = '0';
    greenParticleBoostSpan.style.marginTop = '2px';
    
    // Blue light particle boost
    let blueParticleBoostSpan = cachedDOMElements.bluelightParticleBoost;
    let blueParticleBoost = DecimalUtils.multiply(window.prismState.bluelightparticle || new Decimal(0), 0.1);
    let blueParticleBoostText = '';
    if (blueParticleBoost.gt(0)) {
      blueParticleBoostText = `+${formatNumber(blueParticleBoost)} per click`;
    }
    if (!blueParticleBoostSpan) {
      blueParticleBoostSpan = document.createElement('span');
      blueParticleBoostSpan.id = 'bluelightParticleBoost';
      if (greenParticleBoostSpan.nextSibling) {
        greenParticleBoostSpan.parentNode.insertBefore(blueParticleBoostSpan, greenParticleBoostSpan.nextSibling);
      } else {
        greenParticleBoostSpan.parentNode.appendChild(blueParticleBoostSpan);
      }
      cachedDOMElements.bluelightParticleBoost = blueParticleBoostSpan; // Update cache
    }
    blueParticleBoostSpan.textContent = blueParticleBoostText;
    blueParticleBoostSpan.style.color = '#0066ff'; 
    blueParticleBoostSpan.style.fontWeight = 'bold';
    blueParticleBoostSpan.style.display = 'block';
    blueParticleBoostSpan.style.marginLeft = '0';
    blueParticleBoostSpan.style.marginTop = '2px';
  }
  const redlightCountEl = cachedDOMElements.redlightCount;
  if (redlightCountEl) {
    redlightCountEl.textContent = formatNumber(window.prismState.redlight);
    let boostText = '';
    if (DecimalUtils.isDecimal(window.prismState.redlight) && window.prismState.redlight.gt(0)) {
      boostText = ` × ${formatNumber(window.prismState.redlight)} Feathers`;
    }
    let boostSpan = cachedDOMElements.redlightFeatherBoost;
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'redlightFeatherBoost';
      redlightCountEl.parentNode.appendChild(boostSpan);
      cachedDOMElements.redlightFeatherBoost = boostSpan; // Update cache
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#ff4444';
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
  const orangelightCountEl = cachedDOMElements.orangelightCount;
  if (orangelightCountEl) {
    orangelightCountEl.textContent = formatNumber(window.prismState.orangelight);
    let boostText = '';
    if (DecimalUtils.isDecimal(window.prismState.orangelight) && window.prismState.orangelight.gt(0)) {
      boostText = ` × ${formatNumber(window.prismState.orangelight)} Wing artifact`;
    }
    let boostSpan = cachedDOMElements.orangelightArtifactBoost;
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'orangelightArtifactBoost';
      orangelightCountEl.parentNode.appendChild(boostSpan);
      cachedDOMElements.orangelightArtifactBoost = boostSpan; // Update cache
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#ff9900'; 
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
  
  // Yellow light charge boost display
  const yellowlightCountEl = cachedDOMElements.yellowlightCount;
  if (yellowlightCountEl) {
    yellowlightCountEl.textContent = formatNumber(window.prismState.yellowlight);
    let boostText = '';
    if (DecimalUtils.isDecimal(window.prismState.yellowlight) && window.prismState.yellowlight.gt(0)) {
      if (window.prismState.yellowlight.gte("1e30")) {
        // Formula: 2^(log10(yellowlight) - 30) where each order of magnitude doubles the boost
        const logYellow = window.prismState.yellowlight.log10();
        const exponent = logYellow - 30; // Orders of magnitude above 1e30
        const yellowBoost = new Decimal(2).pow(exponent);
        boostText = ` × ${DecimalUtils.formatDecimal(yellowBoost, 1)} Charge`;
      } else {
        boostText = ` × 1 Charge`;
      }
    }
    let boostSpan = cachedDOMElements.yellowlightChargeBoost;
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'yellowlightChargeBoost';
      yellowlightCountEl.parentNode.appendChild(boostSpan);
      cachedDOMElements.yellowlightChargeBoost = boostSpan; // Update cache
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#ffff00'; 
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
  
  // Green light swaria coin boost display
  const greenlightCountEl = cachedDOMElements.greenlightCount;
  if (greenlightCountEl) {
    greenlightCountEl.textContent = formatNumber(window.prismState.greenlight);
    let boostText = '';
    if (DecimalUtils.isDecimal(window.prismState.greenlight) && window.prismState.greenlight.gt(0)) {
      boostText = ` × ${formatNumber(window.prismState.greenlight)} Swaria coins`;
    }
    let boostSpan = cachedDOMElements.greenlightSwariaCoinBoost;
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'greenlightSwariaCoinBoost';
      greenlightCountEl.parentNode.appendChild(boostSpan);
      cachedDOMElements.greenlightSwariaCoinBoost = boostSpan; // Update cache
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#00ff00'; 
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
  
  // Blue light fluff boost display
  const bluelightCountEl = cachedDOMElements.bluelightCount;
  if (bluelightCountEl) {
    bluelightCountEl.textContent = formatNumber(window.prismState.bluelight);
    let boostText = '';
    if (DecimalUtils.isDecimal(window.prismState.bluelight) && window.prismState.bluelight.gt(0)) {
      boostText = ` × ${formatNumber(window.prismState.bluelight)} Fluff`;
    }
    let boostSpan = cachedDOMElements.bluelightFluffBoost;
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'bluelightFluffBoost';
      bluelightCountEl.parentNode.appendChild(boostSpan);
      cachedDOMElements.bluelightFluffBoost = boostSpan; // Update cache
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#0066ff'; 
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
}

function handleLightGenClick(type) {
  const config = lightGeneratorConfigs[type];
  if (!config) return;
  
  // Ensure generator upgrades is properly initialized and get numeric value
  if (!DecimalUtils.isDecimal(window.prismState.generatorUpgrades[type])) {
    window.prismState.generatorUpgrades[type] = new Decimal(window.prismState.generatorUpgrades[type] || 0);
  }
  const upgrades = window.prismState.generatorUpgrades[type].toNumber();
  
  const unlocked = window.prismState.generatorUnlocked[type];
  const resource = config.resource;
  
  // Ensure the resource is a Decimal
  if (!DecimalUtils.isDecimal(window.prismState[resource])) {
    window.prismState[resource] = new Decimal(window.prismState[resource] || 0);
  }
  
  if (!unlocked) {
    if (window.prismState[resource].gte(config.baseCost)) {
      window.prismState[resource] = window.prismState[resource].sub(config.baseCost);
      window.prismState.generatorUnlocked[type] = true;
      if (type === 'redlightparticles' && typeof window.trackRedLightParticleGeneration === 'function') {
        window.trackRedLightParticleGeneration();
      }
      forceUpdateAllLightCounters();
      updateLightGeneratorButtons();
      showGainPopup(`${type}particleCount`, 1, `${type} unlocked`);
      // Note: Save will be handled by regular save system, not on every upgrade
    }
    return;
  }
  const cost = DecimalUtils.multiply(config.baseCost, new Decimal(10).pow(upgrades));
  if (window.prismState[resource].gte(cost)) {
    window.prismState[resource] = window.prismState[resource].sub(cost);
    window.prismState.generatorUpgrades[type] = new Decimal(upgrades + 1);
    forceUpdateAllLightCounters();
    updateLightGeneratorButtons();
    showGainPopup(`${type}particleCount`, 1, `${type} upgrade`);
    // Note: Save will be handled by regular save system, not on every upgrade
  }
}

function tickLightGenerators(diff) {
  // Prism lab operates independently of power status
  
  // Check for permanent unlocks periodically
  checkPermanentLightUnlocks();
  
  Object.keys(lightGeneratorConfigs).forEach(type => {
    if (!window.prismState.generatorUnlocked[type]) return;
    const config = lightGeneratorConfigs[type];
    
    // Ensure generator upgrades is properly initialized and get numeric value
    if (!DecimalUtils.isDecimal(window.prismState.generatorUpgrades[type])) {
      window.prismState.generatorUpgrades[type] = new Decimal(window.prismState.generatorUpgrades[type] || 0);
    }
    const upgrades = window.prismState.generatorUpgrades[type].toNumber();
    
    let rate = DecimalUtils.multiply(config.baseRate, new Decimal(2).pow(upgrades));
    if (typeof window.boughtElements !== 'undefined' && window.boughtElements[15]) {
      rate = rate.mul(5);
    }
    if (typeof window.boughtElements !== 'undefined' && window.boughtElements[16] && typeof window.state !== 'undefined') {
      // Ensure window.state.powerEnergy is a Decimal
      if (!DecimalUtils.isDecimal(window.state.powerEnergy)) {
        window.state.powerEnergy = new Decimal(window.state.powerEnergy || 0);
      }
      rate = rate.mul(window.state.powerEnergy.div(10));
    }
    const accKey = `_accum_${type}`;
    if (!window.prismState[accKey] || !DecimalUtils.isDecimal(window.prismState[accKey])) {
      window.prismState[accKey] = new Decimal(0);
    }
    // Ensure particle type is also a Decimal
    if (!DecimalUtils.isDecimal(window.prismState[`${type}particle`])) {
      window.prismState[`${type}particle`] = new Decimal(window.prismState[`${type}particle`] || 0);
    }
    window.prismState[accKey] = window.prismState[accKey].add(rate.mul(diff));
    const whole = window.prismState[accKey].floor();
    if (whole.gt(0)) {
      window.prismState[`${type}particle`] = window.prismState[`${type}particle`].add(whole);
      window.prismState[accKey] = window.prismState[accKey].sub(whole);
      
      // Track light generator ticks for automator unlocks
      if (typeof window.frontDesk !== 'undefined' && typeof window.frontDesk.onLightGeneratorTick === 'function') {
        window.frontDesk.onLightGeneratorTick(type, whole);
      }
      
      // Legacy tracking functions
      if (type === 'light' && typeof window.trackLightParticleGeneration === 'function') {
        window.trackLightParticleGeneration();
      }
      if (type === 'redlight' && typeof window.trackRedLightParticleGeneration === 'function') {
        window.trackRedLightParticleGeneration();
      }
    }
  });
  updateAllLightCounters();
  updateLightGeneratorButtons();
}

function updateLightGeneratorButtons() {
  // Initialize cache if not done yet
  if (!cachedDOMElements) {
    initializeDOMCache();
  }
  
  // Cache generator buttons if not already cached
  if (!cachedDOMElements.generatorButtons) {
    cachedDOMElements.generatorButtons = {};
    Object.keys(lightGeneratorConfigs).forEach(type => {
      cachedDOMElements.generatorButtons[type] = document.getElementById(`${type}GenBtn`);
    });
  }
  
  Object.keys(lightGeneratorConfigs).forEach(type => {
    const config = lightGeneratorConfigs[type];
    
    // Ensure generator upgrades is properly initialized and get numeric value
    if (!DecimalUtils.isDecimal(window.prismState.generatorUpgrades[type])) {
      window.prismState.generatorUpgrades[type] = new Decimal(window.prismState.generatorUpgrades[type] || 0);
    }
    const upgrades = window.prismState.generatorUpgrades[type].toNumber();
    
    const unlocked = window.prismState.generatorUnlocked[type];
    const resource = config.resource;
    
    // Ensure the resource is a Decimal
    if (!DecimalUtils.isDecimal(window.prismState[resource])) {
      window.prismState[resource] = new Decimal(window.prismState[resource] || 0);
    }
    
    const btn = cachedDOMElements.generatorButtons[type];
    if (btn) {
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      if (!unlocked) {
        btn.textContent = `Buy (${formatNumber(config.baseCost)} ${resource})`;
        btn.disabled = window.prismState[resource].lt(config.baseCost);
      } else {
        const cost = DecimalUtils.multiply(config.baseCost, new Decimal(10).pow(upgrades));
        btn.textContent = `Upgrade (${formatNumber(cost)} ${resource}) [Level ${upgrades}]`;
        btn.disabled = window.prismState[resource].lt(cost);
      }
    }
  });
}

function initPrism() {
  // Clean up any existing prism system state to prevent memory leaks
  if (typeof window.cleanupPrismSystem === 'function') {
    window.cleanupPrismSystem();
  }
  
  if (typeof window.prismState.activeTileIndex === 'undefined') {
    window.prismState.activeTileIndex = null;
  }
  const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
  lightTypes.forEach(type => {
    if (!DecimalUtils.isDecimal(window.prismState[type])) {
      window.prismState[type] = new Decimal(window.prismState[type] || 0);
    }
  });
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  particleTypes.forEach(type => {
    if (!DecimalUtils.isDecimal(window.prismState[type])) {
      window.prismState[type] = new Decimal(window.prismState[type] || 0);
    }
  });
  
  // Initialize accumulator keys for light generators
  Object.keys(lightGeneratorConfigs).forEach(type => {
    const accKey = `_accum_${type}`;
    if (!window.prismState[accKey] || !DecimalUtils.isDecimal(window.prismState[accKey])) {
      window.prismState[accKey] = new Decimal(0);
    }
  });
  if (!window.prismState.generatorUpgrades) {
    window.prismState.generatorUpgrades = {
      light: 0,
      redlight: 0,
      orangelight: 0,
      yellowlight: 0,
      greenlight: 0,
      bluelight: 0
    };
  }
  if (!window.prismState.generatorUnlocked) {
    window.prismState.generatorUnlocked = {
      light: false,
      redlight: false,
      orangelight: false,
      yellowlight: false,
      greenlight: false,
      bluelight: false
    };
  }
  if (!prismGridInitialized) {
    initPrismGrid();
    prismGridInitialized = true;
  }
  
  // Check and update permanent unlocks on initialization
  checkPermanentLightUnlocks();
  
  spawnNewLightTile();
  ensureClickHandlers();
  forceUpdateAllLightCounters();
  updateLightGeneratorButtons();
}

window.handleLightGenClick = handleLightGenClick;
window.tickLightGenerators = tickLightGenerators;
window.initPrism = initPrism;
window.checkPermanentLightUnlocks = checkPermanentLightUnlocks;
window.clickLightTile = clickLightTile;

// Force immediate update function for user interactions
function forceUpdateAllLightCounters() {
  lastPrismUpdateTime = 0; // Reset throttle
  updateAllLightCounters();
}

window.updateAllLightCounters = updateAllLightCounters;
window.forceUpdateAllLightCounters = forceUpdateAllLightCounters;
window.updateLightGeneratorButtons = updateLightGeneratorButtons;

// Function to clear DOM cache when needed
function clearPrismDOMCache() {
  cachedDOMElements = null;
}

window.clearPrismDOMCache = clearPrismDOMCache;
window.ensureClickHandlers = ensureClickHandlers;

// Create and manage nerf display
let lastNerfValues = {};
let lastNerfTexts = {};
let lastVisibilities = {};

function updateNerfDisplay() {
  // Define all light types and their corresponding display element IDs
  const lightTypes = [
    { type: 'light', elementId: 'lightEnergyNerfDisplay' },
    { type: 'redlight', elementId: 'redLightEnergyNerfDisplay' },
    { type: 'orangelight', elementId: 'orangeLightEnergyNerfDisplay' },
    { type: 'yellowlight', elementId: 'yellowLightEnergyNerfDisplay' },
    { type: 'greenlight', elementId: 'greenLightEnergyNerfDisplay' },
    { type: 'bluelight', elementId: 'blueLightEnergyNerfDisplay' }
  ];

  // Check if calibration system is available
  if (!window.advancedPrismState || !window.advancedPrismState.calibration || !window.getCalibrationNerf) {
    // Hide all displays if calibration system not ready
    lightTypes.forEach(({ elementId }) => {
      const nerfEl = document.getElementById(elementId);
      if (nerfEl && lastVisibilities[elementId]) {
        nerfEl.style.display = 'none';
        nerfEl.style.visibility = 'hidden';
        nerfEl.textContent = '';
        lastVisibilities[elementId] = false;
        lastNerfTexts[elementId] = '';
        lastNerfValues[elementId] = null;
      }
    });
    return;
  }

  // Update each light type
  lightTypes.forEach(({ type, elementId }) => {
    const nerfEl = document.getElementById(elementId);
    if (!nerfEl) return;
    
    const lightNerf = window.getCalibrationNerf(type);
    const nerfValue = lightNerf.toNumber();
    
    // Only show if there's a meaningful nerf (more than 1% penalty)
    const shouldShow = nerfValue > 1.01;
    
    if (shouldShow) {
      // Format nerf with clean notation using the selected notation
      const nerfText = `÷${formatNumber(new Decimal(nerfValue))}`;
      
      // Only update text if it changed
      if (nerfText !== lastNerfTexts[elementId]) {
        nerfEl.textContent = nerfText;
        lastNerfTexts[elementId] = nerfText;
      }
      
      // Only update visibility if it changed
      if (!lastVisibilities[elementId]) {
        nerfEl.style.display = 'block';
        nerfEl.style.visibility = 'visible';
        lastVisibilities[elementId] = true;
      }
      
      // Only update color if nerf value changed significantly
      if (lastNerfValues[elementId] === null || Math.abs(nerfValue - lastNerfValues[elementId]) > 0.1) {
        if (nerfValue > 1000) {
          nerfEl.style.color = '#ff0000'; // Bright red for severe nerfs
        } else if (nerfValue > 10) {
          nerfEl.style.color = '#ff6666'; // Medium red for moderate nerfs
        } else {
          nerfEl.style.color = '#ff9999'; // Light red for small nerfs
        }
        lastNerfValues[elementId] = nerfValue;
      }
    } else {
      // Only hide if currently visible
      if (lastVisibilities[elementId]) {
        nerfEl.style.display = 'none';
        nerfEl.style.visibility = 'hidden';
        nerfEl.textContent = '';
        lastVisibilities[elementId] = false;
        lastNerfTexts[elementId] = '';
        lastNerfValues[elementId] = null;
      }
    }
  });
}

// Auto-update nerf display every second
window.prismNerfDisplayInterval = setInterval(updateNerfDisplay, 1000);

// Initialize nerf display when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateNerfDisplay);
} else {
  updateNerfDisplay();
}

window.updateNerfDisplay = updateNerfDisplay;
window.showPrismSpeech = showPrismSpeech;
window.showViResponse = showViResponse;
window.checkViResponse = checkViResponse;
window.testPrismSpeech = function() {
  showPrismSpeech();
};
const prismQuotes = [
  { text: "If A put the prism on my head, will A get brighhhter?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A tried to use the prism as a pillow. Now A dream in colorrrs!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "If A whisper to the prism, will it tell me a secret?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A think the prism is plotting something with the rainbow...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "A tried to juggle three prisms. Now A have three headaches.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "If A hide behind the prism, can A turn invisible?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A asked the prism for advice. It just shined at me.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A think the prism is secretly a disco ball.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "If A sneeze rainbows, is that a problem?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A tried to eat a rainbow. It tasted like skittles.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Hey Viii, whyy are youu so colorful?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Hey Viii, yuu should come to thhe cafeteria shometimes.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) && !window.prismAdvancedLabUnlocked },
  { text: "Soo thhhish ish the Prishm labbb.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Eech culler huolds a speshul powwuh...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Soo mmanyy cullers... A'm dizzzyyy!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Liit enerrgii feeels fluffy!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Shhhe Prishm... Ittttt's cawwlin' to meee!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "tawkin' likh thish is diffi-cult! A'm tryin'!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Mmmm hmmm, gotta hhhhhold the prrrrism, noooooo drropppy!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Whaaaat iff... A eat the prishm? ...no?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Nyyoooom! Rainbows go BRRRTTT!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Isssh tha' red lighhht starin' at meee...?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "Don't sniffff the yelloww lighht... trusht meee.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Dooon't thhhellll Viiii... A borrorwed theirr prishm.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Heyyyyy Viiii, thuu gottthh thaa rockkk atthhachhed thooo thaaa thailll. ", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
  { text: "Woahhh... therrre's rrrred lightttttthhh nowwww.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4),},
  { text: "Woahhh... We'rrrrre gettthhingg whitttthhhe lighttthhh authomathhhicalyy.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(5),},
  { text: "Woahhh... therrre's orrrangge lightttttthhh nowwww.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(6),},
  { text: "If A spin fast enough, will A make a rainboooow?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A tried to lick the prism. It tastessss like... light?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Whyyy does the prism make my fur all static-y?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "If A stare at the prism long enough, will A see the futurrre?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "A dropped the prism once. Now it hums when A walk by...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A bet the prism would win in a staring contest.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "If A put the prism in the fridge, will it make rainbow ice?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "A tried to teach the prism to sing. It just glowed brighter.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "A think the prism is secretly ticklish.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "If A sneeze near the prism, will it scatter the light?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
];
const viResponseQuotes = [
  { 
    trigger: "If A put the prism on my head, will A get brighhhter?", 
    response: "Yes, and you might get a headache.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  {
    trigger: "Hey Viii, whyy are youu so colorful?",
    response: "My fur is blue, you're just in a colorful room.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  {
    trigger: "Hey Viii, yuu should come to thhe cafeteria shometimes.",
    response: "I wish I could, but I'm stuck here in this other room next to yours, all thx to the Swa elites for installing the smallest door that I can't pass through.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) && !window.prismAdvancedLabUnlocked
  },
  { 
    trigger: "A tried to use the prism as a pillow. Now A dream in colorrrs!", 
    response: "That's... not how it works.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "If A whisper to the prism, will it tell me a secret?", 
    response: "If it does, let me know.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A think the prism is plotting something with the rainbow...", 
    response: "You're delusional...",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) 
  },
  { 
    trigger: "A tried to juggle three prisms. Now A have three headaches.", 
    response: "That's what you get.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) 
  },
  { 
    trigger: "If A hide behind the prism, can A turn invisible?", 
    response: "No, but you will look silly.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A asked the prism for advice. It just shined at me.", 
    response: "That's more advice than most get.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A think the prism is secretly a disco ball.", 
    response: "Don't give it any ideas.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "If A sneeze rainbows, is that a problem?", 
    response: "Only if you start coughing glitter.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A tried to eat a rainbow. It tasted like skittles.", 
    response: "Correct.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Whaaaat iff... A eat the prishm? ...no?", 
    response: "Don't",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "If A spin fast enough, will A make a rainboooow?", 
    response: "No, but I'd pay to see you try.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A tried to lick the prism. It tastessss like... light?", 
    response: "Stop licking the equipment.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Whyyy does the prism make my fur all static-y?", 
    response: "That's just science.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "If A stare at the prism long enough, will A see the futurrre?", 
    response: "You'll see a headache.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) 
  },
  { 
    trigger: "A dropped the prism once. Now it hums when A walk by...", 
    response: "How dare you drop my prisms!",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A bet the prism would win in a staring contest.", 
    response: "It would.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "If A put the prism in the fridge, will it make rainbow ice?", 
    response: "No, and don't put it in the fridge.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) 
  },
  { 
    trigger: "A tried to teach the prism to sing. It just glowed brighter.", 
    response: "That's... actually impressive. I'll take notes of that.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "A think the prism is secretly ticklish.", 
    response: "Don't tickle the prism.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "If A sneeze near the prism, will it scatter the light?", 
    response: "Bless you. And maybe.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Dooon't thhhellll Viiii... A borrorwed theirr prishm.", 
    response: "I know.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Heyyyyy Viiii, thuu gottthh thaa rockkk atthhachhed thooo thaaa thailll.", 
    response: "It's not a rock, it's a prism.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) 
  },
  { 
    trigger: "Soo thhhish ish the Prishm labbb.", 
    response: "Yes, and you're acting drunk.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Soo mmanyy cullers... A'm dizzzyyy!", 
    response: "...",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Liit enerrgii feeels fluffy!", 
    response: "Shush.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Shhhe Prishm... Ittttt's cawwlin' to meee!", 
    response: "Shush.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "tawkin' likh thish is diffi-cult! A'm tryin'!", 
    response: "Shush.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Mmmm hmmm, gotta hhhhhold the prrrrism, noooooo drropppy!", 
    response: "Please do drop it.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  },
  { 
    trigger: "Isssh tha' red lighhht starin' at meee...?", 
    response: "I am.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) 
  },
  { 
    trigger: "Don't sniffff the yelloww lighht... trusht meee.", 
    response: "Shush.",
    condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) 
  }
];

function showPrismSpeech() {
  // Don't show Vi's speech on advanced prism tab
  // Check both the global variable and the DOM state for reliability
  const advancedBtn = document.getElementById('prismAdvancedBtn');
  const isOnAdvancedTab = window.currentPrismSubTab === 'advanced' || 
                         (advancedBtn && advancedBtn.classList.contains('active'));
  
  if (isOnAdvancedTab) {
    return;
  }
  const swariaprismImage = document.getElementById("prismCharacter");
  const swariaprismSpeech = document.getElementById("prismSpeech");
  if (!swariaprismImage || !swariaprismSpeech) {
    return;
  }
  const eligibleQuotes = prismQuotes.filter(q => q.condition());
  if (eligibleQuotes.length === 0) {
    return;
  }
  const quote = eligibleQuotes[Math.floor(Math.random() * eligibleQuotes.length)];
  swariaprismSpeech.textContent = quote.text;
  swariaprismSpeech.classList.add('show');
  swariaprismImage.src = getPrismLabCharacterImage(true); 
  
  // Track timeouts for cleanup
  const viResponseTimeout = setTimeout(() => {
    checkViResponse(quote.text);
  }, 2000);
  window.prismTimeouts.push(viResponseTimeout);
  
  const speechHideTimeout = setTimeout(() => {
    swariaprismSpeech.classList.remove('show');
    swariaprismImage.src = getPrismLabCharacterImage(false); 
  }, 10000);
  window.prismTimeouts.push(speechHideTimeout); 
}

window.isViSleeping = false;
if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    const isNight = (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
    window.isViSleeping = isNight;
  });
}

function initViSpeechBubble() {
    let viSpeechBubble = document.getElementById('viSpeechBubble');
    if (!viSpeechBubble) {
        viSpeechBubble = document.createElement('div');
        viSpeechBubble.id = 'viSpeechBubble';
        viSpeechBubble.className = 'swaria-speech';
        viSpeechBubble.style.cssText = `
            position: fixed !important;
            right: 20px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            left: auto !important;
            margin-left: 0 !important;
            margin-right: 18px !important;
            z-index: 2000 !important;
            background: #fffbe8 !important;
            border: 2px solid #333 !important;
            border-radius: 10px !important;
            padding: 10px 15px !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            display: none;
            pointer-events: auto;
        `;
        const viText = document.createElement('div');
        viText.id = 'viSpeechText';
        viText.style.cssText = `
            color: #333 !important;
            font-weight: bold !important;
            font-size: 14px !important;
        `;
        viSpeechBubble.appendChild(viText);
        document.body.appendChild(viSpeechBubble);
    }
}

document.addEventListener('DOMContentLoaded', initViSpeechBubble);
let viQuestDialogueActive = false;

function showViResponse(responseText, isQuestDialogue = false) {
  const prismTab = document.getElementById('prismSubTab');
  if (!prismTab || prismTab.style.display === 'none') {
    return;
  }
  // Don't show Vi's bubble speech on advanced prism tab unless it's quest dialogue
  // Check both the global variable and the DOM state for reliability
  const advancedBtn = document.getElementById('prismAdvancedBtn');
  const isOnAdvancedTab = window.currentPrismSubTab === 'advanced' || 
                         (advancedBtn && advancedBtn.classList.contains('active'));
  
  if (isOnAdvancedTab && !isQuestDialogue) {
    return;
  }
  if (viQuestDialogueActive && !isQuestDialogue) {
    return;
  }
  const isNightTime = window.isViSleeping === true;
  if (isNightTime) {
    responseText = "Zzz...";
  }
  let viSpeechBubble = document.getElementById('viSpeechBubble');
  if (!viSpeechBubble) {

    return;
  }
  if (isQuestDialogue) {
    viQuestDialogueActive = true;
  }
  const viText = document.getElementById('viSpeechText');
  if (viText) {
    viText.textContent = responseText;
  }
  viSpeechBubble.style.display = 'block';
  if (window.viSpeechTimeout) {
    clearTimeout(window.viSpeechTimeout);
  }
  const duration = isQuestDialogue ? 10000 : 8000;
  window.viSpeechTimeout = setTimeout(() => {
    viSpeechBubble.style.display = 'none';
    if (isQuestDialogue) {
      viQuestDialogueActive = false;
    }
  }, duration);
}

function checkViResponse(swariaText) {
  const matchingResponse = viResponseQuotes.find(q => 
    q.trigger === swariaText && q.condition()
  );
  if (matchingResponse) {
    if (Math.random() < 0.7) {
      showViResponse(matchingResponse.response);
    }
  }
}

// Store speech interval for cleanup
window.prismSpeechInterval = setInterval(() => {
  const prismSubTab = document.getElementById("prismSubTab");
  // Check if prism tab is visible AND player is not on advanced prism tab
  // Use both global variable and DOM state for reliability
  const advancedBtn = document.getElementById('prismAdvancedBtn');
  const isOnAdvancedTab = window.currentPrismSubTab === 'advanced' || 
                         (advancedBtn && advancedBtn.classList.contains('active'));
  
  // Check if images are swapped (don't show Swaria speech if she's not in main prism)
  const imagesSwapped = window.advancedPrismState && window.advancedPrismState.imagesSwapped;
  
  if (prismSubTab && prismSubTab.style.display !== "none" && 
      !isOnAdvancedTab && !imagesSwapped && Math.random() < 0.4) {
    showPrismSpeech();
  }
}, 10000 + Math.floor(Math.random() * 10000)); 
if (!window.getLightGain) {
  window.getLightGain = function(baseLight) { 
    let gain = baseLight;
    
    // Apply grade-based boost (from expansion.js) - this was missing!
    let grade = (typeof state !== 'undefined' && state.grade) ? state.grade : 1;
    if (grade >= 3) {
      gain = gain.mul(new Decimal(2).pow(grade - 2));
    }
    
    // Apply prism core multiplier
    if (typeof window.getPrismCoreMultiplier === 'function') {
      gain = gain.mul(window.getPrismCoreMultiplier());
    }
    // Apply flower upgrade 5 effect
    if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
      gain = gain.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
    }
    return gain;
  } 
}
if (!window.getRedlightGain) {
  window.getRedlightGain = function(baseRedlight) { 
    let gain = baseRedlight;
    // Apply prism core multiplier
    if (typeof window.getPrismCoreMultiplier === 'function') {
      gain = gain.mul(window.getPrismCoreMultiplier());
    }
    // Apply flower upgrade 5 effect
    if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
      gain = gain.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
    }
    return gain;
  } 
}
if (!window.getOrangelightGain) {
  window.getOrangelightGain = function(baseOrangelight) { 
    let gain = baseOrangelight;
    
    // Apply grade-based boost (from expansion.js) - this was missing!
    let grade = (typeof state !== 'undefined' && state.grade) ? state.grade : 1;
    if (grade >= 7) {
      gain = gain.mul(new Decimal(2).pow(grade - 6));
    }
    
    // Apply prism core multiplier
    if (typeof window.getPrismCoreMultiplier === 'function') {
      gain = gain.mul(window.getPrismCoreMultiplier());
    }
    // Apply flower upgrade 5 effect
    if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
      gain = gain.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
    }
    return gain;
  } 
}
if (!window.getYellowlightGain) {
  window.getYellowlightGain = function(baseYellowlight) { 
    let gain = baseYellowlight;
    // Apply prism core multiplier
    if (typeof window.getPrismCoreMultiplier === 'function') {
      gain = gain.mul(window.getPrismCoreMultiplier());
    }
    // Apply flower upgrade 5 effect
    if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
      gain = gain.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
    }
    return gain;
  } 
}
if (!window.getGreenlightGain) {
  window.getGreenlightGain = function(baseGreenlight) { 
    let gain = baseGreenlight;
    // Apply prism core multiplier
    if (typeof window.getPrismCoreMultiplier === 'function') {
      gain = gain.mul(window.getPrismCoreMultiplier());
    }
    // Apply flower upgrade 5 effect
    if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
      gain = gain.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
    }
    return gain;
  } 
}
if (!window.getBluelightGain) {
  window.getBluelightGain = function(baseBluelight) { 
    let gain = baseBluelight;
    // Apply prism core multiplier
    if (typeof window.getPrismCoreMultiplier === 'function') {
      gain = gain.mul(window.getPrismCoreMultiplier());
    }
    // Apply flower upgrade 5 effect
    if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
      gain = gain.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
    }
    return gain;
  } 
}
window.checkParticleRates = function() {
  Object.keys(lightGeneratorConfigs).forEach(type => {
    const config = lightGeneratorConfigs[type];
    
    // Ensure generator upgrades is properly initialized and get numeric value
    if (!DecimalUtils.isDecimal(window.prismState.generatorUpgrades[type])) {
      window.prismState.generatorUpgrades[type] = new Decimal(window.prismState.generatorUpgrades[type] || 0);
    }
    const upgrades = window.prismState.generatorUpgrades[type].toNumber();
    
    let rate = DecimalUtils.multiply(config.baseRate, new Decimal(2).pow(upgrades));
    if (typeof window.boughtElements !== 'undefined' && window.boughtElements[15]) {
      rate = rate.mul(5);
    }
    if (typeof window.boughtElements !== 'undefined' && window.boughtElements[16] && typeof window.state !== 'undefined') {
      // Ensure window.state.powerEnergy is a Decimal
      if (!DecimalUtils.isDecimal(window.state.powerEnergy)) {
        window.state.powerEnergy = new Decimal(window.state.powerEnergy || 0);
      }
      rate = rate.mul(window.state.powerEnergy.div(10));
    }
  });
};

function showPrismGainPopup(id, amount, label) {
  const el = document.getElementById(id);
  if (!el) return;
  let popup = el.parentNode.querySelector('.gain-popup');
  if (popup) popup.remove();
  let displayAmount = formatNumber(DecimalUtils.isDecimal(amount) ? amount : new Decimal(amount));
  popup = document.createElement('span');
  popup.className = 'gain-popup';
  popup.textContent = `+${displayAmount} ${label}`;
  el.parentNode.appendChild(popup);
  void popup.offsetWidth;
  popup.classList.add('show');
  popup.addEventListener('transitionend', function handler(e) {
    if (e.propertyName === 'opacity') {
      popup.removeEventListener('transitionend', handler);
      if (popup.parentNode) popup.parentNode.removeChild(popup);
    }
  });
  setTimeout(() => {
    popup.classList.remove('show');
  }, 600); 
}

function ensurePrismOverlay() {
  updatePrismOverlayForTheme();
}

function updatePrismOverlayForTheme() {
  const prismTab = document.getElementById('prismSubTab');
  if (!prismTab) return;
  ['prism-bg-overlay', 'prism-bg-dusk-overlay', 'prism-bg-night-overlay'].forEach(cls => {
    const old = prismTab.querySelector('.' + cls);
    if (old) old.remove();
  });
  let theme = document.documentElement.dataset.theme || document.body.dataset.theme;
  const root = document.getElementById('root');
  if ((!theme || theme === 'day') && root && root.dataset.theme) theme = root.dataset.theme;
  if (!theme) theme = 'day';
  let overlayClass = '';
  if (theme === 'dusk' || theme === 'transition-day-dusk' || theme === 'transition-dusk-night') {
    overlayClass = 'prism-bg-dusk-overlay';
  } else if (theme === 'night' || theme === 'transition-night-day') {
    overlayClass = 'prism-bg-night-overlay';
  } else {
    overlayClass = 'prism-bg-overlay';
  }
  const overlay = document.createElement('div');
  overlay.className = overlayClass;
  prismTab.insertBefore(overlay, prismTab.firstChild);
}

document.addEventListener('DOMContentLoaded', ensurePrismOverlay);
const origInitPrism = typeof initPrism === 'function' ? initPrism : null;

initPrism = function() {
  if (origInitPrism) origInitPrism.apply(this, arguments);
  ensurePrismOverlay();
};

if (window.daynight && typeof window.daynight.onThemeChange === 'function') {
  window.daynight.onThemeChange(() => {
    updatePrismOverlayForTheme();
  });
}

function observeThemeChanges() {
  // Use PrismCleanupSystem for safe MutationObserver setup
  if (window.PrismCleanupSystem) {
    const targets = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean);
    targets.forEach(target => {
      window.PrismCleanupSystem.createSafeMutationObserver(() => {
        updatePrismOverlayForTheme();
      }, target, { attributes: true, attributeFilter: ['data-theme'] });
    });
  } else {
    // Fallback to original method if PrismCleanupSystem not available
    const targets = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean);
    targets.forEach(target => {
      new MutationObserver(() => {
        updatePrismOverlayForTheme();
      }).observe(target, { attributes: true, attributeFilter: ['data-theme'] });
    });
  }
}

observeThemeChanges();
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .light-tile.red-tile {
      background: #ff4444 !important;
      box-shadow: 0 0 10px 2px #ff4444 !important;
      border: 2px solid #b20000 !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.red-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.red-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 68, 68, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(255, 68, 68, 0.8) !important;
    }
    .light-tile.orange-tile {
      background: #ff9900 !important;
      box-shadow: 0 0 10px 2px #ff9900 !important;
      border: 2px solid #b36b00 !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.orange-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.orange-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 153, 0, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(255, 153, 0, 0.8) !important;
    }
    .light-tile.yellow-tile {
      background: #ffff00 !important;
      box-shadow: 0 0 10px 2px #ffff00 !important;
      border: 2px solid #cccc00 !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.yellow-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.yellow-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 0, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(255, 255, 0, 0.8) !important;
    }
    .light-tile.green-tile {
      background: #00ff00 !important;
      box-shadow: 0 0 10px 2px #00ff00 !important;
      border: 2px solid #00cc00 !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.green-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.green-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(0, 255, 0, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.8) !important;
    }
    .light-tile.blue-tile {
      background: #0066ff !important;
      box-shadow: 0 0 10px 2px #0066ff !important;
      border: 2px solid #0044cc !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.blue-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.blue-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(0, 102, 255, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(0, 102, 255, 0.8) !important;
    }
    .light-tile.white-tile {
      background: #fff !important;
      box-shadow: 0 0 10px 2px #fff !important;
      border: 2px solid #aaa !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.white-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.white-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8) !important;
    }
    .light-tile.grey-tile {
      background: #808080 !important;
      box-shadow: 0 0 10px 2px #808080 !important;
      border: 2px solid #606060 !important;
      position: relative !important;
      overflow: visible !important;
    }
    .light-tile.grey-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 0 !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    }
    .light-tile.grey-tile::after {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 20px !important;
      width: 500px !important;
      height: 3px !important;
      background: rgba(128, 128, 128, 1) !important;
      transform: rotate(-45deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 1 !important;
      box-shadow: 0 0 10px rgba(128, 128, 128, 0.8) !important;
    }
    @keyframes lightRay {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }
    @keyframes lightRayHorizontal {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes lightRayDiagonal {
      0% { transform: translateX(-100%) translateY(100%); }
      100% { transform: translateX(100%) translateY(-100%); }
    }
    #viSpeechBubble.swaria-speech {
      position: fixed !important;
      left: auto !important;
      right: 20px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      margin-left: 0 !important;
      margin-right: 18px !important;
      background: #fffbe8 !important;
      border: 2px solid #333 !important;
      border-radius: 10px !important;
      padding: 10px 15px !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
    }
    #viSpeechBubble.swaria-speech::after {
      content: '' !important;
      position: absolute !important;
      left: auto !important;
      right: -18px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      border-left: 18px solid #fffbe8 !important;
      border-right: none !important;
      border-top: 10px solid transparent !important;
      border-bottom: 10px solid transparent !important;
    }
    #viSpeechBubble.swaria-speech::before {
      content: '' !important;
      position: absolute !important;
      left: auto !important;
      right: -20px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      border-left: 18px solid #333 !important;
      border-right: none !important;
      border-top: 10px solid transparent !important;
      border-bottom: 10px solid transparent !important;
    }
    .light-tile.vantablack-tile::before {
      content: '' !important;
      position: absolute !important;
      top: 20px !important;
      left: 0px !important;
      width: 500px !important;
      height: 4px !important;
      background: linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.7) 60%, rgba(200, 100, 100, 0.8) 75%, rgba(100, 50, 50, 0.95) 90%, rgba(30, 10, 10, 1) 100%) !important;
      transform: rotate(-170deg) !important;
      transform-origin: left center !important;
      pointer-events: none !important;
      z-index: 10 !important;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 80, 80, 0.6) !important;
      animation: vantablackRayPulse 2s ease-in-out infinite !important;
    }
    @keyframes vantablackRayPulse {
      0%, 100% { 
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 80, 80, 0.6) !important;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.7) 60%, rgba(200, 100, 100, 0.8) 75%, rgba(100, 50, 50, 0.95) 90%, rgba(30, 10, 10, 1) 100%) !important;
      }
      50% { 
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 40, 40, 0.9) !important;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 60%, rgba(255, 120, 120, 0.9) 75%, rgba(150, 70, 70, 1) 90%, rgba(50, 20, 20, 1) 100%) !important;
      }
    }
    @keyframes vantablackDreadPulse {
      0%, 100% { 
        background: radial-gradient(
          circle at var(--cutout-x, 50%) var(--cutout-y, 50%), 
          transparent var(--cutout-radius, 180px),
          rgba(5, 0, 3, 0.3) calc(var(--cutout-radius, 180px) + 30px),
          rgba(10, 0, 5, 0.6) calc(var(--cutout-radius, 180px) + 100px),
          rgba(15, 0, 8, 0.8) calc(var(--cutout-radius, 180px) + 200px),
          rgba(20, 0, 10, 0.95) calc(var(--cutout-radius, 180px) + 350px)
        ) !important;
      }
      50% { 
        background: radial-gradient(
          circle at var(--cutout-x, 50%) var(--cutout-y, 50%), 
          transparent var(--cutout-radius, 180px),
          rgba(8, 2, 5, 0.4) calc(var(--cutout-radius, 180px) + 30px),
          rgba(15, 3, 8, 0.7) calc(var(--cutout-radius, 180px) + 100px),
          rgba(25, 5, 15, 0.9) calc(var(--cutout-radius, 180px) + 200px),
          rgba(35, 8, 20, 1) calc(var(--cutout-radius, 180px) + 350px)
        ) !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Test function to manually trigger light spawning
window.testPrismSpawning = function() {
  spawnNewLightTile();
};

function addPrismTileTokenChance() {
  const grid = document.getElementById('lightGrid');
  if (!grid) return;
  
  // Use PrismCleanupSystem for safe event listener setup
  if (window.PrismCleanupSystem) {
    const tiles = Array.from(grid.querySelectorAll('.light-tile'));
    window.PrismCleanupSystem.setupTileEventListeners(tiles, null, (tile, e) => {
      if (window.spawnIngredientToken && Math.random() < 1/1) {
        window.spawnIngredientToken('prism', tile);
      }
    });
  } else {
    // Fallback to original method with improved cleanup
    grid.querySelectorAll('.light-tile').forEach(tile => {
      if (!tile._tokenPatched) {
        // Clean up any existing listeners first
        if (tile._prismTokenHandler) {
          tile.removeEventListener('click', tile._prismTokenHandler);
        }
        
        // Create new handler and store reference for cleanup
        tile._prismTokenHandler = function(e) {
          if (window.spawnIngredientToken && Math.random() < 1/1) {
            window.spawnIngredientToken('prism', tile);
          }
        };
        
        tile.addEventListener('click', tile._prismTokenHandler);
        tile._tokenPatched = true;
      }
    });
  }
}

window.testViDialogueUpdate = function() {
    if (typeof window.updateViQuestDialogue === 'function') {
        window.updateViQuestDialogue();
    } else {
    }
};

// Test function to verify Vi's friendship light gain buff
window.testViFriendshipBuff = function(level = 1) {
    if (!window.friendship) {

        return;
    }
    
    // Set Vi's friendship level for testing
    window.friendship.Lab = window.friendship.Lab || { level: 0, points: new Decimal(0) };
    window.friendship.Lab.level = level;
    window.friendship.Lab.points = new Decimal(0);
    
    const buffChance = new Decimal(25).add(new Decimal(5).mul(Math.max(0, level - 1))).toNumber();



    // Update the stats modal if it's open
    if (typeof window.renderDepartmentStatsButtons === 'function') {
        window.renderDepartmentStatsButtons();
    }
};

// Prism system cleanup function
window.cleanupPrismSystem = function() {
    // Use PrismCleanupSystem for comprehensive cleanup if available
    if (window.PrismCleanupSystem) {
        window.PrismCleanupSystem.cleanupPrismSystem();
        return;
    }
    
    // Fallback cleanup for compatibility
    // Clear main nerf display interval
    if (window.prismNerfDisplayInterval) {
        clearInterval(window.prismNerfDisplayInterval);
        window.prismNerfDisplayInterval = null;
    }
    
    // Clear speech interval
    if (window.prismSpeechInterval) {
        clearInterval(window.prismSpeechInterval);
        window.prismSpeechInterval = null;
    }
    
    // Clear speech timeout
    if (window.viSpeechTimeout) {
        clearTimeout(window.viSpeechTimeout);
        window.viSpeechTimeout = null;
    }
    
    // Clear all tracked timeouts
    if (window.prismTimeouts) {
        window.prismTimeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        window.prismTimeouts = [];
    }
    
    // Clean up tile event listeners
    const grid = document.getElementById('lightGrid');
    if (grid) {
        grid.querySelectorAll('.light-tile').forEach(tile => {
            if (tile._tokenPatched) {
                // Clone and replace to remove all event listeners
                const newTile = tile.cloneNode(true);
                tile.parentNode.replaceChild(newTile, tile);
            }
        });
    }
    
    // Reset prism state tracking
    window.prismGridInitialized = false;
};

function awardVivienFriendshipForLightTileClick() {
  if (!window.friendship || typeof window.friendship.addPoints !== 'function') {
    return;
  }

  const currentFriendship = window.friendship.getFriendshipLevel('vi');
  if (!currentFriendship || !DecimalUtils.isDecimal(currentFriendship.points)) {
    return;
  }

  const friendshipIncrease = currentFriendship.points.mul(0.005);
  const minIncrease = new Decimal(0.1);
  const finalIncrease = Decimal.max(friendshipIncrease, minIncrease);

  window.friendship.addPoints('vi', finalIncrease);
}

window.awardVivienFriendshipForLightTileClick = awardVivienFriendshipForLightTileClick;

// Test function to verify permanent unlock system
window.testPermanentLightUnlocks = function(testGrade) {
  if (!window.state || !window.state.prismState) {
    return { error: 'Prism state not initialized' };
  }
  
  // Store original grade
  const originalGrade = window.state.grade;
  
  // Test with specified grade
  if (testGrade) {
    window.state.grade = new Decimal(testGrade);
  }
  
  // Check current unlock status before
  const beforeRed = window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.redLightUnlocked;
  const beforeOrange = window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.orangeLightUnlocked;
  
  // Run the permanent unlock check
  checkPermanentLightUnlocks();
  
  // Check status after
  const afterRed = window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.redLightUnlocked;
  const afterOrange = window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.orangeLightUnlocked;
  
  // Restore original grade
  if (originalGrade !== undefined) {
    window.state.grade = originalGrade;
  }
  
  return {
    testGrade: testGrade,
    before: { red: beforeRed, orange: beforeOrange },
    after: { red: afterRed, orange: afterOrange },
    changedRed: beforeRed !== afterRed,
    changedOrange: beforeOrange !== afterOrange
  };
};

// Debug function to show current permanent unlock status
window.showPermanentUnlockStatus = function() {
  if (!window.state || !window.state.prismState || !window.state.prismState.permanentUnlocks) {
    return { error: 'Permanent unlocks not initialized' };
  }
  
  // Find the correct grade reference
  let currentGrade = null;
  let gradeSource = 'none';
  
  if (window.state && DecimalUtils.isDecimal(window.state.grade)) {
    currentGrade = window.state.grade;
    gradeSource = 'window.state.grade';
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade)) {
    currentGrade = state.grade;
    gradeSource = 'state.grade';
  } else if (typeof window.grade !== 'undefined' && DecimalUtils.isDecimal(window.grade)) {
    currentGrade = window.grade;
    gradeSource = 'window.grade';
  } else if (window.state && typeof window.state.grade !== 'undefined') {
    currentGrade = new Decimal(window.state.grade || 0);
    gradeSource = 'window.state.grade (converted)';
  } else if (typeof state !== 'undefined' && typeof state.grade !== 'undefined') {
    currentGrade = new Decimal(state.grade || 0);
    gradeSource = 'state.grade (converted)';
  }
  
  const grade = currentGrade ? currentGrade.toString() : 'unknown';
  const redUnlocked = window.state.prismState.permanentUnlocks.redLightUnlocked;
  const orangeUnlocked = window.state.prismState.permanentUnlocks.orangeLightUnlocked;
  
  // Also check the actual unlock conditions used in spawning
  const prismCoreUpgraded = window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gt(1);
  const redCondition = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(1)) || 
                     (currentGrade && currentGrade.gte(4)) ||
                     (window.state && window.state.prismState && window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.redLightUnlocked);
  const orangeCondition = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(1)) || 
                         (currentGrade && currentGrade.gte(6)) ||
                         (window.state && window.state.prismState && window.state.prismState.permanentUnlocks && window.state.prismState.permanentUnlocks.orangeLightUnlocked);
  
  return {
    grade: { value: grade, source: gradeSource },
    permanentUnlocks: { red: redUnlocked, orange: orangeUnlocked },
    prismCoreUpgraded,
    spawnConditions: { red: redCondition, orange: orangeCondition }
  };
};

// Quick fix function to force unlock and test
window.fixPrismLightSpawning = function() {
  checkPermanentLightUnlocks();
  const status = window.showPermanentUnlockStatus();
  spawnNewLightTile();
  return { status, message: 'Check the prism - you should see colored tiles now!' };
};

// Manual tile spawning for testing
window.forceSpawnColoredTile = function(color = 'random') {
  // Get eligible tiles
  const eligible = Array.from(document.querySelectorAll(".light-tile.active-prism"));
  if (eligible.length === 0) {
    return { success: false, error: 'No eligible tiles found' };
  }
  
  // Clear current tile if exists
  if (currentActiveTile) {
    currentActiveTile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
    currentActiveTile = null;
  }
  
  // Select random tile
  const randomTile = eligible[Math.floor(Math.random() * eligible.length)];
  const index = parseInt(randomTile.dataset.index);
  window.prismState.activeTileIndex = index;
  currentActiveTile = randomTile;
  
  // Apply specific color or random
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'white'];
  const actualColor = color === 'random' ? colors[Math.floor(Math.random() * colors.length)] : color;
  
  // Clear all color classes first
  randomTile.classList.remove("red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
  
  // Apply new color
  randomTile.classList.add("active-tile", `${actualColor}-tile`);
  
  // Set the state color
  const colorMap = {
    'red': 'redlight',
    'orange': 'orangelight', 
    'yellow': 'yellowlight',
    'green': 'greenlight',
    'blue': 'bluelight',
    'white': 'light'
  };
  
  window.prismState.activeTileColor = colorMap[actualColor];
  
  return { 
    success: true, 
    color: actualColor, 
    index: index,
    message: `Spawned ${actualColor} tile at index ${index}` 
  };
};
