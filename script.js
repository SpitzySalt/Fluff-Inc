// --- Generator Tab FPS Optimization ---
let lastGeneratorUIUpdate = 0;
const GENERATOR_UI_THROTTLE = 50; // ms (20 FPS)
// --- Overlay FPS Optimization ---
let lastBlackoutState = null;
let lastDimState = null;
let lastOverlayUpdate = 0;
const OVERLAY_UPDATE_THROTTLE = 100; // ms (10 FPS)
// --- Infinity Shop FPS Optimization ---
let lastInfinityShopUpdate = 0;
const INFINITY_SHOP_UPDATE_THROTTLE = 100; // ms (10 FPS)

// Make optimization variables globally accessible
window.lastGeneratorUIUpdate = lastGeneratorUIUpdate;
window.GENERATOR_UI_THROTTLE = GENERATOR_UI_THROTTLE;
window.lastBlackoutState = lastBlackoutState;
window.lastDimState = lastDimState;
window.lastOverlayUpdate = lastOverlayUpdate;
window.OVERLAY_UPDATE_THROTTLE = OVERLAY_UPDATE_THROTTLE;
window.lastInfinityShopUpdate = lastInfinityShopUpdate;
window.INFINITY_SHOP_UPDATE_THROTTLE = INFINITY_SHOP_UPDATE_THROTTLE;

function updateGlobalBlackoutOverlay(force) {
  const now = Date.now();
  if (!force && now - lastOverlayUpdate < OVERLAY_UPDATE_THROTTLE) return;
  lastOverlayUpdate = now;
  const blackout = document.getElementById('blackoutOverlay');
  // Determine if blackout should be active (replace with your actual logic)
  const blackoutActive = (window.state && window.state.powerStatus === 'offline');
  if (lastBlackoutState !== blackoutActive) {
    if (blackout) blackout.classList.toggle('active', blackoutActive);
    lastBlackoutState = blackoutActive;
  }
}

function updateGlobalDimOverlay(force) {
  const now = Date.now();
  if (!force && now - lastOverlayUpdate < OVERLAY_UPDATE_THROTTLE) return;
  lastOverlayUpdate = now;
  const dim = document.getElementById('dimOverlay');
  // Determine if dim should be active (replace with your actual logic)
  const isNight = (window.daynight && typeof window.daynight.isNight === 'function' && window.daynight.isNight());
  const dimActive = isNight && (!window.state || window.state.powerStatus !== 'offline');
  if (lastDimState !== dimActive) {
    if (dim) dim.classList.toggle('active', dimActive);
    lastDimState = dimActive;
  }
}

// Make overlay functions globally accessible
window.updateGlobalBlackoutOverlay = updateGlobalBlackoutOverlay;
window.updateGlobalDimOverlay = updateGlobalDimOverlay;
// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file





































let state = {
  fluff: new Decimal(0),
  swaria: new Decimal(0),
  feathers: new Decimal(0),
  artifacts: new Decimal(0),
  hasUnlockedSwariaKnowledge: true, 
  grade: new Decimal(1),
  boxesProduced: new Decimal(0), 
  boxesProducedByType: {
    common: new Decimal(0),
    uncommon: new Decimal(0),
    rare: new Decimal(0),
    legendary: new Decimal(0),
    mythic: new Decimal(0)
  },
  powerEnergy: new Decimal(100),
  powerMaxEnergy: new Decimal(100),
  powerStatus: 'online', 
  powerLastTick: Date.now(),
  // Soap's auto recharge system (level 4+ friendship buff)
  soapAutoRecharge: {
    timer: 600000, // 10 minutes in milliseconds (600 seconds * 1000)
    storage: 0,     // Current auto recharge count
    lastTick: Date.now()
  },
  seenKpSoftcapStory: false, 
  seenKpMildcapStory: false, 
  seenFirstDeliveryStory: false, 
  seenGeneratorUnlockStory: false, 
  seenGeneratorTabFirstTime: false,
  seenInfinityResetStory: false,
  pendingInfinityResetStory: false, 
  lastBerryPlateTime: Date.now(),
  berryPlate: new Decimal(0),
  mushroomSoup: new Decimal(0),
  batteries: new Decimal(0),
  glitteringPetals: new Decimal(0),
  chargedPrisma: new Decimal(0),
  swabucks: new Decimal(0),
  mysticCookingSpeedBoost: new Decimal(0), 
  soapBatteryBoost: new Decimal(0), 
  fluzzerGlitteringPetalsBoost: new Decimal(0), 
  peachyHungerBoost: new Decimal(0), 
  characterHunger: {
    swaria: new Decimal(100),
    soap: new Decimal(100),
    fluzzer: new Decimal(100),
    mystic: new Decimal(100),
    vi: new Decimal(100)
  },
  lastHungerTick: Date.now(),
  characterFullStatus: {
    swaria: new Decimal(0), 
    soap: new Decimal(0),
    fluzzer: new Decimal(0),
    mystic: new Decimal(0),
    vi: new Decimal(0)
  },
  hardModeQuestActive: true,
  hardModeQuestProgress: {
    berryTokens: new Decimal(0),
    stardustTokens: new Decimal(0),
    berryPlateTokens: new Decimal(0),
    mushroomSoupTokens: new Decimal(0),
    prismClicks: new Decimal(0),
    commonBoxes: new Decimal(0),
    flowersWatered: new Decimal(0),
    powerRefills: new Decimal(0),
    soapPokes: new Decimal(0),
    ingredientsCooked: new Decimal(0)
  }
};
let settings = {
  theme: "light",
  colour: "green",
  style: "rounded",
  notation: "numeral",
  disableOfflineProgress: false,
  confirmReset: true,
  confirmNectarizeReset: true,
  autosave: true,
};
window.settings = settings;
window.applySettings = applySettings;
// Make state available globally for other scripts
window.state = state;
// Initialize kitchen ingredients if not already set
if (!window.kitchenIngredients) {
  window.kitchenIngredients = {};
}
let swariaKnowledge = {
  kp: new Decimal(0)
};
let boughtElements = {};
// Make boughtElements available globally
window.boughtElements = boughtElements;
// Make swariaKnowledge globally accessible
window.swariaKnowledge = swariaKnowledge;
// Initialize permanent prism advanced lab unlock flag
window.prismAdvancedLabUnlocked = false;
let currentKnowledgeSubTab = 'elementsMain'; 
let tickSpeedMultiplier = 1;
let tickInterval = setInterval(gameTick, 1000);

// Make knowledge and tick variables globally accessible
window.currentKnowledgeSubTab = currentKnowledgeSubTab;
window.tickSpeedMultiplier = tickSpeedMultiplier;
window.tickInterval = tickInterval;
let generatorUpgrades = {
  common: new Decimal(0),
  uncommon: new Decimal(0),
  rare: new Decimal(0),
  legendary: new Decimal(0),
  mythic: new Decimal(0)
};

// Expose to window so other files can access it
window.generatorUpgrades = generatorUpgrades;

// Box generators array
const generators = [
  { id: 0, name: "Common Box Generator", currency: "fluff", progress: 0, speed: 5, baseSpeed: 5, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "common", baseCost: new Decimal(1e6), costMultiplier: 10 },
  { id: 1, name: "Uncommon Box Generator", currency: "swaria coins", progress: 0, speed: 4, baseSpeed: 4, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "uncommon", baseCost: new Decimal(1e8), costMultiplier: 100 },
  { id: 2, name: "Rare Box Generator", currency: "feathers", progress: 0, speed: 3, baseSpeed: 3, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "rare", baseCost: new Decimal(1e10), costMultiplier: 1000 },
  { id: 3, name: "Legendary Box Generator", currency: "artifacts", progress: 0, speed: 2, baseSpeed: 2, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "legendary", baseCost: new Decimal(1e12), costMultiplier: 10000 },
  { id: 4, name: "Mythic Box Generator", currency: "kp", progress: 0, speed: 1, baseSpeed: 1, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "mythic", baseCost: new Decimal(1e15), costMultiplier: 100000 }
];

let currentHomeSubTab = 'gamblingMain';
let currentGeneratorSubTab = 'boxGen'; // Track which generator sub-area is active
let lastPrismPowerOnline = true; // Track prism power state for optimization - prism lab is always online
window.isTabHidden = false;
document.addEventListener('visibilitychange', function() {
  window.isTabHidden = document.hidden;
});
let currentSaveSlot = null;
if (localStorage.getItem('currentSaveSlot')) {
  currentSaveSlot = parseInt(localStorage.getItem('currentSaveSlot'), 10);
}
let debugFluffGain = false;

// Make generators and navigation variables globally accessible
window.generators = generators;
window.currentHomeSubTab = currentHomeSubTab;
window.currentGeneratorSubTab = currentGeneratorSubTab;
window.lastPrismPowerOnline = lastPrismPowerOnline;
window.currentSaveSlot = currentSaveSlot;
window.debugFluffGain = debugFluffGain;

function toggleFluffGainLogging() {
  debugFluffGain = !debugFluffGain;
  return debugFluffGain;
}

function sanityCheckCurrencies() {
  // Convert any non-Decimal values to Decimals
  if (!DecimalUtils.isDecimal(state.fluff)) state.fluff = new Decimal(state.fluff || 0);
  if (!DecimalUtils.isDecimal(state.swaria)) state.swaria = new Decimal(state.swaria || 0);
  
  // Ensure swariaKnowledge.kp is always a Decimal
  if (!DecimalUtils.isDecimal(swariaKnowledge.kp)) {
    swariaKnowledge.kp = new Decimal(swariaKnowledge.kp || 0);
  }
  
  // Ensure swabucks is always a Decimal
  if (!DecimalUtils.isDecimal(state.swabucks)) {
    state.swabucks = new Decimal(state.swabucks || 0);
  }
  
  ['fluff', 'swaria', 'feathers', 'artifacts'].forEach(currency => {
    if (!DecimalUtils.isDecimal(state[currency])) {
      state[currency] = new Decimal(state[currency] || 0);
    }
    
    if (!state[currency].isFinite()) {
      state[currency] = new Decimal(0);
    }
  });
}

// Make these functions globally accessible
window.toggleFluffGainLogging = toggleFluffGainLogging;
window.sanityCheckCurrencies = sanityCheckCurrencies;

function addCurrency(currencyName, amount) {
  // Check if game is paused - if so, don't add any currency
  if (window.isGamePaused) {
    return new Decimal(0);
  }
  
  amount = new Decimal(amount);
  if (amount.lte(0)) return new Decimal(0);
  
  // Apply blue stable light buff to cargo currencies
  const cargoCurrencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
  if (cargoCurrencies.includes(currencyName) && typeof window.applyBlueStableLightBuff === 'function') {
    amount = window.applyBlueStableLightBuff(amount);
  }
  
  // Apply infinity upgrade boosts BEFORE penalties
  if (typeof applyCargoBoost === 'function') {
    amount = applyCargoBoost(amount, currencyName);
  }
  if (typeof applyLabBoost === 'function') {
    amount = applyLabBoost(amount, currencyName);
  }
  
  // Apply fluff infinity penalty to all cargo currencies
  if (typeof window.applyFluffInfinityPenalty === 'function') {
    amount = window.applyFluffInfinityPenalty(amount, currencyName);
  }
  
  // Apply infinity nerfs to main currencies (excludes premium currencies like swabucks)
  if (typeof window.infinitySystem !== 'undefined' && window.infinitySystem.applyInfinityNerfs) {
    const mainCurrencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
    const premiumCurrencies = ['swabucks']; // Premium currencies are never affected by nerfs
    
    if (mainCurrencies.includes(currencyName) && !premiumCurrencies.includes(currencyName)) {
      amount = window.infinitySystem.applyInfinityNerfs(amount, currencyName);
    }
  }
  
  // Apply infinity challenge nerfs (square root for IC:1)
  if (typeof window.applyChallengeNerfs === 'function') {
    amount = window.applyChallengeNerfs(amount, currencyName);
  }
  
  // Apply anomaly debuff to main currencies and light currencies
  if (typeof window.getAnomalyDebuff === 'function') {
    const mainCurrencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
    const lightCurrencies = ['light', 'redLight', 'orangeLight', 'yellowLight', 'greenLight', 'blueLight'];
    if (mainCurrencies.includes(currencyName) || lightCurrencies.includes(currencyName)) {
      const anomalyDebuff = window.getAnomalyDebuff();
      amount = amount.mul(anomalyDebuff);
    }
  }
  
  // Handle light currencies (stored in prismState)
  const lightCurrencies = ['light', 'redLight', 'orangeLight', 'yellowLight', 'greenLight', 'blueLight'];
  if (lightCurrencies.includes(currencyName)) {
    if (typeof window.prismState !== 'undefined') {
      // Map currency names to prismState property names
      const prismStateName = currencyName === 'redLight' ? 'redlight' : 
                            currencyName === 'orangeLight' ? 'orangelight' :
                            currencyName === 'yellowLight' ? 'yellowlight' :
                            currencyName === 'greenLight' ? 'greenlight' :
                            currencyName === 'blueLight' ? 'bluelight' : 
                            currencyName; // 'light' stays as 'light'
      
      if (!DecimalUtils.isDecimal(window.prismState[prismStateName])) {
        window.prismState[prismStateName] = new Decimal(0);
      }
      
      // Initialize fractional accumulator for any light currency
      const fractionalKey = prismStateName + 'Fractional';
      if (typeof window.prismState[fractionalKey] === 'undefined') {
        window.prismState[fractionalKey] = new Decimal(0);
      }
      
      // Add to fractional accumulator
      window.prismState[fractionalKey] = window.prismState[fractionalKey].add(amount);
      
      // If we have accumulated at least 1 full unit, add it to the main counter
      if (window.prismState[fractionalKey].gte(1)) {
        const wholeAmount = window.prismState[fractionalKey].floor();
        window.prismState[prismStateName] = window.prismState[prismStateName].add(wholeAmount);
        window.prismState[fractionalKey] = window.prismState[fractionalKey].sub(wholeAmount);
      }
    }
    return amount; // Return the final amount that was added
  }
  
  // Handle normal currencies (stored in state)
  const currentValue = state[currencyName];
  const newValue = currentValue.add(amount);
  
  if (newValue.isFinite()) {
    state[currencyName] = newValue;
  } else {
    state[currencyName] = currentValue;
  }
  
  return amount; // Return the final amount that was added
}

// Expose addCurrency to window for use in other files
window.addCurrency = addCurrency;

function addSwaBucks(amount) {
  amount = new Decimal(amount);
  if (amount.lte(0)) return;


  // SwaBucks are premium tokens and are NOT affected by infinity nerfs
  
  if (!DecimalUtils.isDecimal(state.swabucks)) {
    state.swabucks = new Decimal(0);

  }
  
  state.swabucks = state.swabucks.add(amount);

  // Update inventory display if it exists and is visible
  const swabucksElement = document.getElementById('inventoryCount-swabucks');
  if (swabucksElement) {
    swabucksElement.textContent = DecimalUtils.formatDecimal(state.swabucks);

  } else {

  }
  // Note: Element may not exist if inventory modal is closed, but it will be updated when modal opens
  
  // Save the game
  if (typeof window.saveGame === 'function') {
    window.saveGame();
  }
}

// Make addSwaBucks available globally
window.addSwaBucks = addSwaBucks;

// Debug function to test Swa Bucks
window.testSwaBucks = function() {



  // Check if element exists
  const element = document.getElementById('inventoryCount-swabucks');

  if (!element) {

    // Try to open inventory
    const inventoryBtn = document.getElementById('inventoryBtn');
    if (inventoryBtn) {

      inventoryBtn.click();
      setTimeout(() => {
        const elementAfterOpen = document.getElementById('inventoryCount-swabucks');

      }, 100);
    }
  } else {

  }

  addSwaBucks(100);

  // Check again after adding
  setTimeout(() => {
    const elementAfter = document.getElementById('inventoryCount-swabucks');
    if (elementAfter) {

    } else {

    }
  }, 200);
};

// Debug function to manually update the display
window.updateSwaBucksDisplay = function() {
  const element = document.getElementById('inventoryCount-swabucks');
  if (element && window.state.swabucks) {
    element.textContent = DecimalUtils.formatDecimal(window.state.swabucks);

  } else {

  }
};

// Debug function to test Element 1 effect
window.testElement1 = function() {


  const baseRate = new Decimal(1);
  const currentRate = getFluffRate();




  // Force UI update
  updateUI();

};

// Debug function to check artifact multipliers
window.checkArtifactMultiplier = function() {

  const grade = DecimalUtils.toDecimal(state.grade || 1);
  if (grade.gte(5)) {
    const gradeMultiplier = new Decimal(2).pow(grade.sub(4));

  } else {

  }
  
  if (boughtElements[6]) {
    const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
    const kpBonus = kpDecimal.mul(0.1).floor();

  } else {

  }


  // Calculate what you'd get from a mythic box
  const baseArtifacts = 4; // Average of 3-5
  let totalArtifacts = baseArtifacts;
  
  if (boughtElements[6]) {
    const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
    totalArtifacts += kpDecimal.mul(0.1).floor().toNumber();
  }
  
  const grade2 = DecimalUtils.toDecimal(state.grade || 1);
  if (grade2.gte(5)) {
    const gradeMultiplier = new Decimal(2).pow(grade2.sub(4));
    totalArtifacts *= gradeMultiplier.toNumber();
  }

};

// Debug function to check kitchen ingredients
window.checkKitchenIngredients = function() {


  if (window.kitchenIngredients) {

    for (let key in window.kitchenIngredients) {
      const value = window.kitchenIngredients[key];

    }
  } else {

  }
};

// Function to recalculate all element effects (should be called on load)
function recalculateAllElementEffects() {
  // Reset tick speed multiplier
  tickSpeedMultiplier = 1;
  
  // Apply tick speed effects
  if (boughtElements[1]) tickSpeedMultiplier *= 1.25;
  if (boughtElements[5]) tickSpeedMultiplier *= 1.25;
  
  // Update the game tick interval
  clearInterval(window.tickInterval);
  window.tickInterval = setInterval(gameTick, 1000 / tickSpeedMultiplier);
  
  // Apply other element effects that aren't tick-speed related
  for (let index in boughtElements) {
    if (boughtElements[index] && index != 1 && index != 5) {
      applyElementEffect(parseInt(index));
    }
  }
}

let lastGameTick = Date.now();

function gameTick() {
  // Check if game is paused - if so, don't execute
  if (window.isGamePaused) {
    return;
  }
  
  const now = Date.now();
  const diff = (now - lastGameTick) / 1000;
  lastGameTick = now;
  sanityCheckCurrencies();
  let fluffGain = DecimalUtils.floor(getFluffRate());
  if (fluffGain.gt(1000) || state.fluff.gt(1e10)) {
  }
  if (debugFluffGain) {
  }
  addCurrency('fluff', fluffGain);
  if (typeof window.trackFluffMilestone === 'function') {
    window.trackFluffMilestone(state.fluff);
  }
  tickGenerators(diff);
  if (boughtElements[7] && !(window.isTabHidden || document.hidden)) tickPowerGenerator(diff);
  // Removed duplicate call to window.chargerTick(diff) to prevent double power drain.
  if (window.charger && typeof window.applyChargerMilestoneEffects === 'function') {
    window.applyChargerMilestoneEffects();
  }
  if (window.tickLightGenerators) window.tickLightGenerators(diff);
  
  // Ultra-rare secret achievement check - 1 in 10 million chance per tick
  if (Math.random() < 1 / 10000000) {
    if (typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('secret17');

    }
  }
  
  // Update infinity tree currencies
  if (window.infinitySystem && typeof window.infinitySystem.updateInfinityTree === 'function') {
    window.infinitySystem.updateInfinityTree(diff);
  }
  
  // Decay calibration nerfs
  if (typeof window.decayCalibrationNerfs === 'function') {
    window.decayCalibrationNerfs(diff);
  }
  
  // Update infinity display every tick
  if (typeof updateInfinityDisplay === 'function') {
    updateInfinityDisplay();
  }
  
  // Check infinity challenge completion
  if (typeof checkChallengeCompletion === 'function') {
    checkChallengeCompletion();
  }

// Make key functions globally accessible
window.recalculateAllElementEffects = recalculateAllElementEffects;
window.lastGameTick = lastGameTick;
window.gameTick = gameTick;
  
  updateUI();
}

if (window._mainGameTickInterval) clearInterval(window._mainGameTickInterval);
window._mainGameTickInterval = null;
if (window._gameTickInterval) clearInterval(window._gameTickInterval);
window._gameTickInterval = setInterval(gameTick, 100); 

function formatNumber(num) {
  // Use DecimalUtils for formatting
  return DecimalUtils.formatDecimal(num);
}

function getCombinedInfinityCount() {
  return new Decimal(0);
}

// Make these functions globally accessible
window.formatNumber = formatNumber;
window.getCombinedInfinityCount = getCombinedInfinityCount;

const elementData = {
  "1": {
    "symbol": "FL",
    "name": "Fluffium"
  },
  "2": {
    "symbol": "CN",
    "name": "Coinium"
  },
  "3": {
    "symbol": "FO",
    "name": "Feathore"
  },
  "4": {
    "symbol": "AN",
    "name": "Artifen"
  },
  "5": {
    "symbol": "FF",
    "name": "Fluffers"
  },
  "6": {
    "symbol": "KL",
    "name": "Knowlium"
  },
  "7": {
    "symbol": "HK",
    "name": "Hackium"
  },
  "8": {
    "symbol": "ED",
    "name": "Expandium"
  },
  "9": {
    "symbol": "BX",
    "name": "Boxium"
  },
  "10": {
    "symbol": "FT",
    "name": "Featherite",
  },
  "11": {
    "symbol": "GB",
    "name": "Geneboxium",
  },
  "12": {
    "symbol": "SW",
    "name": "Swawesium",
  },
  "13": {
    "symbol": "LR",
    "name": "Luminore",
  },
  "14": {
    "symbol": "GF",
    "name": "Generifice"
  },
  "15": {
    "symbol": "PL",
    "name": "Partiluminite"
  },
  "16": {
    "symbol": "PW",
    "name": "Powerite",
  },
  "17": {
    "symbol": "CR",
    "name": "Chargerino",
  },
  "18": {
    "symbol": "CI",
    "name": "Chargerite",
  },
  "19": {
    "symbol": "CU",
    "name": "Chargerium",
  },
  "20": {
    "symbol": "SI",
    "name": "Swarite",
  },
  "21": {
    "symbol": "PI",
    "name": "Pollenite",
  },
  "22": {
    "symbol": "FI",
    "name": "Flowerite"
  },
  "23": {
    "symbol": "XI",
    "name": "Expirite"
  },
  "24": { 
    "symbol": "NU", 
    "name": "Nectarium" 
  }, //elements 25-117 names are placeholders
  "25": { 
    "symbol": "OT", 
    "name": "Oblitarium"
  },
  "26": { 
    "symbol": "Fe", 
    "name": "Iron"
  },
  "27": { 
    "symbol": "Co", 
    "name": "Cobalt"
  },
  "28": { 
    "symbol": "Ni", 
    "name": "Nickel"
  },
  "29": { 
    "symbol": "Cu", 
    "name": "Copper"
  },
  "30": { 
    "symbol": "Zn", 
    "name": "Zinc"
  },
  "31": { 
    "symbol": "Ga", 
    "name": "Gallium"
  },
  "32": { 
    "symbol": "Ge", 
    "name": "Germanium" 
  },
  "33": { 
    "symbol": "As", 
    "name": "Arsenic"
  },
  "34": { 
    "symbol": "Se", 
    "name": "Selenium"
  },
  "35": { 
    "symbol": "Br", 
    "name": "Bromine"
  },
  "36": { 
    "symbol": "Kr", 
    "name": "Krypton"
  },
  "37": { 
    "symbol": "Rb", 
    "name": "Rubidium"
  },
  "38": { 
    "symbol": "Sr", 
    "name": "Strontium"
  },
  "39": { 
    "symbol": "Y", 
    "name": "Yttrium"
  },
  "40": { 
    "symbol": "Zr", 
    "name": "Zirconium"
  },
  "41": { 
    "symbol": "Nb", 
    "name": "Niobium"
  },
  "42": { 
    "symbol": "Mo", 
    "name": "Molybdenum"
  },
  "43": { 
    "symbol": "Tc", 
    "name": "Technetium"
  },
  "44": { 
    "symbol": "Ru", 
    "name": "Ruthenium"
  },
  "45": { 
    "symbol": "Rh", 
    "name": "Rhodium"
  },
  "46": { 
    "symbol": "Pd", 
    "name": "Palladium"
  },
  "47": { 
    "symbol": "Ag", 
    "name": "Silver"
  },
  "48": { 
    "symbol": "Cd", 
    "name": "Cadmium"
  },
  "49": { 
    "symbol": "In", 
    "name": "Indium"
  },
  "50": { 
    "symbol": "Sn", 
    "name": "Tin"
  },
  "51": {
    "symbol": "Sb",
    "name": "Antimony"
  },
  "52": {
    "symbol": "Te",
    "name": "Tellurium"
  },
"53": {
  "symbol": "I",
  "name": "Iodine"
},
"54": {
  "symbol": "Xe",
  "name": "Xenon"
},
"55": {
  "symbol": "Cs",
  "name": "Cesium"
},
"56": {
  "symbol": "Ba",
  "name": "Barium"
},
"57": {
  "symbol": "La",
  "name": "Lanthanum"
},
"58": {
  "symbol": "Ce",
  "name": "Cerium"
},
"59": {
  "symbol": "Pr",
  "name": "Praseodymium"
},
"60": {
  "symbol": "Nd",
  "name": "Neodymium"
},
 "61": {
  "symbol": "Pm",
  "name": "Promethium"
},
"62": {
  "symbol": "Sm",
  "name": "Samarium"
},
"63": {
  "symbol": "Eu",
  "name": "Europium"
},
"64": {
  "symbol": "Gd",
  "name": "Gadolinium"
},
"65": {
  "symbol": "Tb",
  "name": "Terbium"
},
"66": {
  "symbol": "Dy",
  "name": "Dysprosium"
},
"67": {
  "symbol": "Ho",
  "name": "Holmium"
},
"68": {
  "symbol": "Er",
  "name": "Erbium"
},
"69": {
  "symbol": "Tm",
  "name": "Thulium"
},
"70": {
  "symbol": "Yb",
  "name": "Ytterbium"
},
  "71": {
    "symbol": "Lu",
    "name": "Lutetium"
  },
  "72": {
    "symbol": "Hf",
    "name": "Hafnium"
  },
  "73": {
    "symbol": "Ta",
    "name": "Tantalum"
  },
  "74": {
    "symbol": "W",
    "name": "Tungsten"
  },
  "75": {
    "symbol": "Re",
    "name": "Rhenium"
  },
  "76": {
    "symbol": "Os",
    "name": "Osmium"
  },
  "77": {
    "symbol": "Ir",
    "name": "Iridium"
  },
  "78": {
    "symbol": "Pt",
    "name": "Platinum"
  },
  "79": {
    "symbol": "Au",
    "name": "Gold"
  },
  "80": {
    "symbol": "Hg",
    "name": "Mercury",
  },
  "81": {
  "symbol": "Tl",
  "name": "Thallium",
},
"82": {
  "symbol": "Pb",
  "name": "Lead",
},
"83": {
  "symbol": "Bi",
  "name": "Bismuth",
},
"84": {
  "symbol": "Po",
  "name": "Polonium",
},
"85": {
  "symbol": "At",
  "name": "Astatine",
},
"86": {
  "symbol": "Rn",
  "name": "Radon",
},
"87": {
  "symbol": "Fr",
  "name": "Francium",
},
"88": {
  "symbol": "Ra",
  "name": "Radium",
},
"89": {
  "symbol": "Ac",
  "name": "Actinium",
},
"90": {
  "symbol": "Th",
  "name": "Thorium",
},
 "91": {
  "symbol": "Pa",
  "name": "Protactinium",
},
"92": {
  "symbol": "U",
  "name": "Uranium",
},
"93": {
  "symbol": "Np",
  "name": "Neptunium",
},
"94": {
  "symbol": "Pu",
  "name": "Plutonium",
},
"95": {
  "symbol": "Am",
  "name": "Americium",
},
"96": {
  "symbol": "Cm",
  "name": "Curium",
},
"97": {
  "symbol": "Bk",
  "name": "Berkelium",
},
"98": {
  "symbol": "Cf",
  "name": "Californium",
},
"99": {
  "symbol": "Es",
  "name": "Einsteinium",
},
"100": {
  "symbol": "Fm",
  "name": "Fermium",
},
 "101": {
  "symbol": "Md",
  "name": "Mendelevium",
},
"102": {
  "symbol": "No",
  "name": "Nobelium",
},
"103": {
  "symbol": "Lr",
  "name": "Lawrencium",
},
"104": {
  "symbol": "Rf",
  "name": "Rutherfordium",
},
"105": {
  "symbol": "Db",
  "name": "Dubnium",
},
"106": {
  "symbol": "Sg",
  "name": "Seaborgium",
},
"107": {
  "symbol": "Bh",
  "name": "Bohrium",
},
"108": {
  "symbol": "Hs",
  "name": "Hassium",
},
"109": {
  "symbol": "Mt",
  "name": "Meitnerium",
},
"110": {
  "symbol": "Ds",
  "name": "Darmstadtium",
},
 "111": {
  "symbol": "Rg",
  "name": "Roentgenium",
},
"112": {
  "symbol": "Cn",
  "name": "Copernicium",
},
"113": {
  "symbol": "Nh",
  "name": "Nihonium",
},
"114": {
  "symbol": "Fl",
  "name": "Flerovium",
},
"115": {
  "symbol": "Mc",
  "name": "Moscovium",
},
"116": {
  "symbol": "Lv",
  "name": "Livermorium",
},
"117": {
  "symbol": "Ts",
  "name": "Tennessine",
},
"118": {
  "symbol": "OG",
  "name": "Oganesson",
}
};

// Make elementData globally accessible
window.elementData = elementData;

function renderElementGrid() {
  const grid = document.getElementById("elementGrid");
  grid.innerHTML = "";
  
  // Get maximum available elements based on current expansion level
  const maxAvailableElements = (typeof getPermanentlyAvailableElements === 'function') 
    ? getPermanentlyAvailableElements() 
    : 8; // fallback to default
  
  for (let i = 1; i <= 118; i++) {
    const data = elementData[i] || {};
    const pos = elementPositions[i];
    if (!pos) continue;
    
    // Only render elements that should be visible based on expansion level
    if (i > maxAvailableElements) continue;
    const tile = document.createElement("div");
    tile.classList.add("element-tile", data.category || "unknown");
    
    // Add special class for element 25
    if (i === 25) {
      tile.classList.add("element-25");
    }
    
    tile.style.gridColumn = pos.col;
    tile.style.gridRow = pos.row;
    tile.innerHTML = `
  <div class="element-content">
    <div class="number">${i}</div>
    <div class="symbol">${data.symbol || "?"}</div>
    <div class="name">${data.name || "Unknown"}</div>
  </div>
`;
    tile.title = `${data.name || "Unknown"} (Tier: ${data.category || "?"})`;
    tile.dataset.index = i;
    if (boughtElements[i]) {
      tile.classList.add("bought");
    }
    tile.onmouseenter = (() => {
      const thisTile = tile;
      return () => {
        let costText = "";
        let effectText = getElementEffectText(i);
        
        if (elementCostsInfinityPoints(i)) {
          const infinityCost = getElementInfinityPointCost(i);
          costText = `<span style="color:#87CEEB;">${formatLargeInt(infinityCost)} IP</span>`;
        } else {
          const kpCost = getElementKPCost(i);
          costText = `<span style="color:#FFD700;">${formatLargeInt(kpCost)} KP</span>`;
        }
        
        document.getElementById("elementTooltip").innerHTML = `${costText} - ${effectText}`;
        document.getElementById("elementTooltip").style.display = "block";
      };
    })();
    tile.onclick = (() => {
      const thisTile = tile;
      return () => tryBuyElement(i);
    })();
    tile.onmouseleave = (() => {
      const thisTile = tile;
      return () => {
        document.getElementById("elementTooltip").style.display = "none";
      };
    })();
    grid.appendChild(tile);
  }
}

// Make renderElementGrid globally accessible
window.renderElementGrid = renderElementGrid;

const boxTiers = {
  common: { cost: 100, swaria: [1, 3], feather: [0, 0], artifact: [0, 0] },
  uncommon: { cost: 300, swaria: [2, 6], feather: [0, 0], artifact: [0, 0] },
  rare: { cost: 1000, swaria: [5, 12], feather: [0, 1], artifact: [0, 0] },
  legendary: { cost: 5000, swaria: [10, 25], feather: [2, 4], artifact: [0, 1] },
  mythic: { cost: 20000, swaria: [20, 50], feather: [5, 10], artifact: [3, 5] }
};

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buyBox(type) {
  const box = boxTiers[type];
  
  // Check if player has fluff infinity - if so, boxes cost no fluff
  const hasFluffInfinity = window.infinitySystem && (window.infinitySystem.counts.fluff || 0) > 0;
  
  if (!hasFluffInfinity) {
    // Normal fluff cost check and deduction for players without fluff infinity
    if (state.fluff.lt(box.cost)) {
      return;
    } else {
      state.fluff = state.fluff.sub(box.cost);
    }
  }
  // If player has fluff infinity, skip the fluff cost entirely
  
  // Track box opening for front desk autobuyer system
  if (typeof window.frontDesk?.onBoxOpened === 'function') {
    window.frontDesk.onBoxOpened(type);
  }
  
  if (type === 'common' && typeof window.trackHardModeCommonBox === 'function') {
    window.trackHardModeCommonBox();
  }
  if (type === 'uncommon' && typeof window.trackUncommonBoxPurchaseWithHighFluff === 'function') {
    window.trackUncommonBoxPurchaseWithHighFluff();
  }
  let swariaGain = 0;
  if (["common", "uncommon", "rare", "legendary", "mythic"].includes(type)) {
    swariaGain = rng(...box.swaria);
    if (boughtElements[2]) swariaGain += 3;
    if (boughtElements[3]) swariaGain += state.feathers.mul(0.1).floor().toNumber();
    swariaGain = getSwariaCoinGain(swariaGain);
  }
  let featherGain = new Decimal(0);
  if (["rare", "legendary", "mythic"].includes(type)) {
    featherGain = new Decimal(rng(...box.feather));
    if (boughtElements[4]) {
      featherGain = featherGain.add(state.artifacts.mul(0.1).floor());
    }
    if (typeof state !== 'undefined' && typeof prismState !== 'undefined' && DecimalUtils.toDecimal(state.grade || 1).gte(4)) {
      featherGain = featherGain.add(prismState.redlight || 0);
    }
    // Apply expansion multiplier using the proper function
    if (typeof getFeatherGain === 'function') {
      featherGain = getFeatherGain(featherGain);
    }
  }
  let artifactGain = 0;
  if (["legendary", "mythic"].includes(type)) {
    artifactGain = rng(...box.artifact);
    if (boughtElements[6]) {
      const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
      artifactGain += kpDecimal.mul(0.1).floor().toNumber();
    }
    if (typeof state !== 'undefined' && DecimalUtils.toDecimal(state.grade || 1).gte(5)) {
      const grade = DecimalUtils.toDecimal(state.grade || 1);
      artifactGain *= new Decimal(2).pow(grade.sub(4)).toNumber();
    }
    if (typeof prismState !== 'undefined' && prismState.orangelight) {
      artifactGain *= (1 + prismState.orangelight);
    }
  }
  if (boughtElements[11]) {
    if (type === "uncommon") {
      // Ensure uncommon boxes produced is a Decimal
      if (!DecimalUtils.isDecimal(state.boxesProducedByType.uncommon)) {
        state.boxesProducedByType.uncommon = new Decimal(state.boxesProducedByType.uncommon || 0);
      }
      const boost = new Decimal(1).add(state.boxesProducedByType.uncommon.mul(0.01));
      swariaGain = Math.floor(swariaGain * boost.toNumber());
      showGainPopup("swariaGain", `× ${boost.floor().toNumber()} Swaria Coins`, "Swaria Coins");
    }
    if (type === "rare") {
      // Ensure rare boxes produced is a Decimal
      if (!DecimalUtils.isDecimal(state.boxesProducedByType.rare)) {
        state.boxesProducedByType.rare = new Decimal(state.boxesProducedByType.rare || 0);
      }
      const boost = new Decimal(1).add(state.boxesProducedByType.rare.mul(0.01));
      featherGain = featherGain.mul(boost);
      showGainPopup("featherGain", `× ${formatNumber(boost)} Feathers`, "Feathers");
    }
    if (type === "legendary") {
      // Ensure legendary boxes produced is a Decimal
      if (!DecimalUtils.isDecimal(state.boxesProducedByType.legendary)) {
        state.boxesProducedByType.legendary = new Decimal(state.boxesProducedByType.legendary || 0);
      }
      const boost = new Decimal(1).add(state.boxesProducedByType.legendary.mul(0.01));
      artifactGain = Math.floor(artifactGain * boost.toNumber());
      showGainPopup("artifactGain", `× ${boost.floor().toNumber()} Artifacts`, "Artifacts");
    }
  }
  swariaGain = Math.floor(swariaGain);
  featherGain = featherGain.floor();
  artifactGain = Math.floor(artifactGain);
  
  // Calculate popup amounts - apply same nerfs as addCurrency to show correct values
  let popupSwariaGain = swariaGain;
  let popupFeatherGain = featherGain.toNumber();
  let popupArtifactGain = artifactGain;
  
  // Apply cargo boost first (same order as addCurrency)
  if (typeof applyCargoBoost === 'function') {
    popupSwariaGain = applyCargoBoost(new Decimal(popupSwariaGain), 'swaria').floor().toNumber();
    popupFeatherGain = applyCargoBoost(new Decimal(popupFeatherGain), 'feathers').floor().toNumber();
    popupArtifactGain = applyCargoBoost(new Decimal(popupArtifactGain), 'artifacts').floor().toNumber();
  }
  
  // Apply fluff infinity penalty first (same order as addCurrency)
  if (typeof window.applyFluffInfinityPenalty === 'function') {
    popupSwariaGain = window.applyFluffInfinityPenalty(new Decimal(popupSwariaGain), 'swaria').floor().toNumber();
    popupFeatherGain = window.applyFluffInfinityPenalty(new Decimal(popupFeatherGain), 'feathers').floor().toNumber();
    popupArtifactGain = window.applyFluffInfinityPenalty(new Decimal(popupArtifactGain), 'artifacts').floor().toNumber();
  }
  
  // Apply same nerfs that addCurrency applies to show accurate popup amounts
  if (typeof window.infinitySystem !== 'undefined' && window.infinitySystem.applyInfinityNerfs) {
    popupSwariaGain = window.infinitySystem.applyInfinityNerfs(new Decimal(popupSwariaGain), 'swaria').floor().toNumber();
    popupFeatherGain = window.infinitySystem.applyInfinityNerfs(new Decimal(popupFeatherGain), 'feathers').floor().toNumber();
    popupArtifactGain = window.infinitySystem.applyInfinityNerfs(new Decimal(popupArtifactGain), 'artifacts').floor().toNumber();
  }
  
  // Apply challenge nerfs if active
  if (typeof window.applyChallengeNerfs === 'function') {
    popupSwariaGain = window.applyChallengeNerfs(new Decimal(popupSwariaGain), 'swaria').floor().toNumber();
    popupFeatherGain = window.applyChallengeNerfs(new Decimal(popupFeatherGain), 'feathers').floor().toNumber();
    popupArtifactGain = window.applyChallengeNerfs(new Decimal(popupArtifactGain), 'artifacts').floor().toNumber();
  }
  
  // Apply anomaly debuff to popup amounts (same as addCurrency)
  if (typeof window.getAnomalyDebuff === 'function') {
    const anomalyDebuff = window.getAnomalyDebuff();
    popupSwariaGain = new Decimal(popupSwariaGain).mul(anomalyDebuff).floor().toNumber();
    popupFeatherGain = new Decimal(popupFeatherGain).mul(anomalyDebuff).floor().toNumber();
    popupArtifactGain = new Decimal(popupArtifactGain).mul(anomalyDebuff).floor().toNumber();
  }
  
  addCurrency('swaria', swariaGain);
  addCurrency('feathers', featherGain);
  addCurrency('artifacts', artifactGain);
  if (typeof window.trackSwariaMilestone === 'function') {
    window.trackSwariaMilestone(state.swaria);
  }
   if (typeof window.trackFeatherMilestone === 'function') {
    window.trackFeatherMilestone(state.feathers);
  }
  if (typeof window.trackArtifactMilestone === 'function') {
    window.trackArtifactMilestone(state.artifacts);
  }
  if (popupSwariaGain > 0) showGainPopup("swariaGain", popupSwariaGain, "Swaria Coins");
  if (popupFeatherGain > 0) showGainPopup("featherGain", popupFeatherGain, "Feathers");
  if (popupArtifactGain > 0) showGainPopup("artifactGain", popupArtifactGain, "Artifacts");
  updateUI();
  if (window.spawnIngredientToken) {
    let btn = null;
    if (window.event && window.event.target && window.event.target.tagName === 'BUTTON') {
      btn = window.event.target;
    } else {
      btn = document.querySelector(`button[onclick*="buyBox('${type}')"]`);
    }
    if (btn) {
      window.spawnIngredientToken('cargo', btn);
    }
  }
}

function resetGame() {
  if (state.artifacts.gte(50)) {
    let kpGain = getKpGainPreview();
    if (settings.confirmReset) {
      if (!confirm(`Reset and gain ${formatNumber(kpGain)} Knowledge Points?`)) return;
    }
    
    // Track delivery click for front desk automator
    if (window.frontDesk && typeof window.frontDesk.onDeliveryClicked === 'function') {
      window.frontDesk.onDeliveryClicked();
    }
    
    const isFirstTimeKP = swariaKnowledge.kp.eq(0);
    swariaKnowledge.kp = swariaKnowledge.kp.add(kpGain);
    if (typeof window.trackKPMilestone === 'function') {
      window.trackKPMilestone(swariaKnowledge.kp);
    }
    state.fluff = new Decimal(0);
    state.swaria = new Decimal(0);
    state.feathers = new Decimal(0);
    state.artifacts = new Decimal(0);
    state.boxesProduced = new Decimal(0);
    
    // Reset infinity counts for all currencies
    if (window.infinitySystem && window.infinitySystem.counts) {
      window.infinitySystem.counts.fluff = 0;
      window.infinitySystem.counts.swaria = 0;
      window.infinitySystem.counts.feathers = 0;
      window.infinitySystem.counts.artifacts = 0;
    }
    state.boxesProducedByType = {
      common: new Decimal(0),
      uncommon: new Decimal(0),
      rare: new Decimal(0),
      legendary: new Decimal(0),
      mythic: new Decimal(0)
    };
    if (!state.hardModeQuestActive) {
      state.hardModeQuestActive = true;
    }
    if (window.state && !window.state.soapChargeQuest) {
      window.state.soapChargeQuest = { stage: 0, initialized: true };
    }
    if (window.charger) {
      if (!window.charger.milestoneQuests) {
        window.charger.milestoneQuests = {
          3: { required: 10, given: 0, completed: false },
          4: { required: 15, given: 0, completed: false },
          5: { required: 25, given: 0, completed: false },
          6: { required: 50, given: 0, completed: false },
          7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 },
          8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }
        };
      }
    }
    if (isFirstTimeKP && !state.seenFirstDeliveryStory) {
      state.seenFirstDeliveryStory = true;
      if (typeof saveGame === 'function') saveGame();
      
      // Permanently unlock control center after first delivery reset
      const unlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
      localStorage.setItem(unlockKey, 'true');

      if (typeof showFirstDeliveryStoryModal === 'function') {
        showFirstDeliveryStoryModal();
        window._reloadAfterStoryModal = true;
        return; 
      }
    }
    const gradTab = document.getElementById("graduationSubTab");
    if (gradTab && currentKnowledgeSubTab !== 'graduationSubTab') {
      gradTab.style.display = "none";
    }
    if (typeof window.trackDeliveryReset === 'function') {
      window.trackDeliveryReset();
    }
  }
}

function getFluffRate() {
  let base = new Decimal(1);
  if (boughtElements["1"]) base = base.mul(1.25);
  if (boughtElements["5"]) base = base.mul(1.25);
  const grade = DecimalUtils.toDecimal(state.grade || 1);
  if (grade.gte(2)) {
    const gradeBoost = new Decimal(2).pow(grade.sub(1));
    base = base.mul(gradeBoost);
  }
  
  // Apply Swaria boost additively
  let swariaBoost = new Decimal(0);
  if (state.swaria.gt(0)) {
    if (boughtElements[12]) {
      swariaBoost = state.swaria.mul(100);
    } else {
      swariaBoost = state.swaria.mul(3);
    }
  }
  
  // Apply Feather boost additively  
  let featherBoost = new Decimal(0);
  if (state.feathers.gt(0)) {
    featherBoost = state.feathers.mul(10);
  }
  
  // Apply Artifact boost additively
  let artifactBoost = new Decimal(0);
  if (state.artifacts.gt(0)) {
    artifactBoost = state.artifacts.mul(25);
  }
  
  // Add all boosts together
  base = base.add(swariaBoost).add(featherBoost).add(artifactBoost);
  
  // Apply blue light boost to fluff gain
  if (window.prismState && window.prismState.bluelight && window.prismState.bluelight.gt(0)) {
    base = base.mul(window.prismState.bluelight);
  }
  
  // Apply common box boost multiplicatively
  let commonBoxBoost = new Decimal(1);
  if (boughtElements[11]) {
    // Ensure common boxes produced is a Decimal
    if (!DecimalUtils.isDecimal(state.boxesProducedByType.common)) {
      state.boxesProducedByType.common = new Decimal(state.boxesProducedByType.common || 0);
    }
    commonBoxBoost = new Decimal(1).add(state.boxesProducedByType.common.mul(0.01));
  }
  base = base.mul(commonBoxBoost);
  
  // Apply cargo boost from infinity upgrades
  if (typeof applyCargoBoost === 'function') {
    base = applyCargoBoost(base, 'fluff');
  }

  // Return with 2 decimal precision for display, but don't floor small boosts
  if (base.lt(10)) {
    return base;  // Keep decimals for small values
  } else {
    return base.floor();  // Floor only for larger values
  }
}

function getElementCost(index) {
  if (index === 1) return new Decimal(9); 
  if (index === 2) return new Decimal(50);
  if (index === 3) return new Decimal(125);
  if (index === 4) return new Decimal(200);
  if (index === 5) return new Decimal(500);
  if (index === 6) return new Decimal(600);
  if (index === 7) return new Decimal(3500);
  if (index === 8) return new Decimal(8000);
  if (index === 9) return new Decimal("1e6");
  if (index === 10) return new Decimal("1e8");
  if (index === 11) return new Decimal("1e12");
  if (index === 12) return new Decimal("1e13");
  if (index === 13) return new Decimal("1e15");
  if (index === 14) return new Decimal("1e17");
  if (index === 15) return new Decimal("1e25");
  if (index === 16) return new Decimal("1e28");
  if (index === 17) return new Decimal("1e32");
  if (index === 18) return new Decimal("1e35");
  if (index === 19) return new Decimal("1e38");
  if (index === 20) return new Decimal("1e43");
  if (index === 21) return new Decimal("1e45");
  if (index === 22) return new Decimal("1e46");
  if (index === 23) return new Decimal("1e48");
  if (index === 24) return new Decimal("1e50");
  // Element 25 costs infinity points instead of KP
  if (index === 25) return new Decimal(2000); // 2000 infinity points
  return new Decimal(9e999999);
}

// Get infinity point cost for specific elements
function getElementInfinityPointCost(index) {
  if (index === 25) return new Decimal(2000); // 2000 infinity points for element 25
  return new Decimal(0); // Other elements don't cost infinity points
}

// Check if an element costs infinity points instead of KP
function elementCostsInfinityPoints(index) {
  return index === 25;
}

function getElementKPCost(index) {
    if (index === 1) return new Decimal(9);
    if (index === 2) return new Decimal(50);
    if (index === 3) return new Decimal(125);
    if (index === 4) return new Decimal(200);
    if (index === 5) return new Decimal(500);
    if (index === 6) return new Decimal(600);
    if (index === 7) return new Decimal(3500);
    if (index === 8) return new Decimal(8000);
    if (index === 9) return new Decimal("1e6");
    if (index === 10) return new Decimal("1e8");
    if (index === 11) return new Decimal("1e12");
    if (index === 12) return new Decimal("1e13");
    if (index === 13) return new Decimal("1e15");
    if (index === 14) return new Decimal("1e17");
    if (index === 15) return new Decimal("1e25");
    if (index === 16) return new Decimal("1e28");
    if (index === 17) return new Decimal("1e32");
    if (index === 18) return new Decimal("1e35");
    if (index === 19) return new Decimal("1e38");
    if (index === 20) return new Decimal("1e43");
    if (index === 21) return new Decimal("1e45");
    if (index === 22) return new Decimal("1e46");
    if (index === 23) return new Decimal("1e48");
    if (index === 24) return new Decimal("1e50");
  return new Decimal("1ee727"); 
}

if (!state.elementDiscoveryProgress) {
  state.elementDiscoveryProgress = new Decimal(0);
}

function getHighestElementDiscovery() {
  return state.elementDiscoveryProgress || new Decimal(0);
}

function getHighestBoughtElement() {
  let highest = new Decimal(0);
  for (let key in boughtElements) {
    if (boughtElements[key] && new Decimal(key).gt(highest)) {
      highest = new Decimal(key);
    }
  }
  return highest;
}

function shouldShowElementDescription(index) {
  const highestBought = getHighestBoughtElement();
  const highestDiscovery = getHighestElementDiscovery();
  if (boughtElements[index]) return true;
  const effectiveHighest = Math.max(highestBought, highestDiscovery);
  return index <= effectiveHighest + 3;
}

function updateElementDiscoveryProgress(index) {
  if (index > state.elementDiscoveryProgress) {
    state.elementDiscoveryProgress = index;
  }
}

function getElementEffectText(index) {
  if (!shouldShowElementDescription(index)) {
    return "???";
  }
  
  // Special case for element 25 - different description based on whether it's bought
  if (index === 25) {
    if (boughtElements[25]) {
      return "<del>Gain ^999 more fluff</del> Used to blow up a door instead";
    } else {
      return "Gain ^999 more fluff";
    }
  }
  
  const effects = {
    1: "Increases Fluff generation by 1.25",
    2: "Gain +3 extra Swaria Coins per box purchase",
    3: "Total feathers increase Swaria coins gain (10%)",
    4: "Total Wing artifacts increase feather gain (10%)",
    5: "Increases Fluff generation by 1.25 again",
    6: "Total Knowledge points boost wing artifacts (10%)",
    7: "Hack the generator room's door",
    8: "Unlock expansion",
    9: "Unlock a new row of upgrades in the generator tab",
    10: "Change the KP formula to now count feathers instead of artifacts",
    11: "Each box generated increases box rewards by 1%",
    12: "Swaria coins boost fluff gain even more",
    13: "Gain 5 times more light",
    14: "Gain a 1.1^ boost to all currency gain",
    15: "Gain 5 times more light particles",
    16: "Gain more light particles based on your power generator amount",
    17: "Gain 2 times more charge",
    18: "Gain 2 times more charge (yep)",
    19: "Gain 2 times more charge (that's right, again)",
    20: "Change the KP formula to now count Swaria Coins instead of feathers",
    21: "Gain X10 pollen",
    22: "Gain X5 flowers",
    23: "Gain X3 terrarium XP",
    24: "Gain X2 nectar",
    25: "Gain ^999 more fluff",
    30: "Change the KP formula to now count Fluff instead of Swaria coins",
  };
  return effects[index] || "Not yet implemented";
}

function applyElementEffect(index) {
  // Calculate proper tick speed multiplier based on owned elements
  let newTickSpeedMultiplier = 1;
  if (boughtElements[1]) newTickSpeedMultiplier *= 1.25;
  if (boughtElements[5]) newTickSpeedMultiplier *= 1.25;
  
  if (index === 1 || index === 5) {
    // Update tick speed only if it changed
    if (tickSpeedMultiplier !== newTickSpeedMultiplier) {
      tickSpeedMultiplier = newTickSpeedMultiplier;
      clearInterval(window.tickInterval);
      window.tickInterval = setInterval(gameTick, 1000 / tickSpeedMultiplier);
    }
  }
  if (index === 17) {
    if (window.charger && window.charger.milestones && window.charger.milestones[3]) {
      window.charger.milestones[3].elementUnlocked = true;
      if (window.charger.charge >= window.charger.milestones[3].amount) {
        window.charger.milestones[3].unlocked = true;
      }
    }
  }
  if (index === 18) {
    if (window.charger && window.charger.milestones && window.charger.milestones[4]) {
      window.charger.milestones[4].elementUnlocked = true;
      if (window.charger.charge >= window.charger.milestones[4].amount) {
        window.charger.milestones[4].unlocked = true;
      }
    }
  }
  if (index === 19) {
    if (window.charger && window.charger.milestones && window.charger.milestones[5]) {
      window.charger.milestones[5].elementUnlocked = true;
      if (window.charger.charge >= window.charger.milestones[5].amount) {
        window.charger.milestones[5].unlocked = true;
      }
    }
  }
  if (index === 20) {
    updateUI();
    updateKnowledgeUI();
  }
  if (index === 21) {
    if (typeof updateTerrariumUI === 'function') updateTerrariumUI();
  }
  if (index === 22) {
    if (typeof updateTerrariumUI === 'function') updateTerrariumUI();
  }
  if (index === 23) {
    if (typeof updateTerrariumUI === 'function') updateTerrariumUI();
  }
  if (index === 24) {
    if (typeof updateTerrariumUI === 'function') updateTerrariumUI();
  }
}

function tryBuyElement(index) {
  if (boughtElements[index]) return;
  
  // Check if element costs infinity points
  if (elementCostsInfinityPoints(index)) {
    const infinityCost = getElementInfinityPointCost(index);
    if (!window.infinitySystem || window.infinitySystem.infinityPoints.lt(infinityCost)) return;
    
    // Deduct infinity points
    window.infinitySystem.infinityPoints = window.infinitySystem.infinityPoints.sub(infinityCost);
  } else {
    // Normal KP cost
    const cost = getElementCost(index);
    // Ensure KP is a Decimal and use proper Decimal comparison
    const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
    if (kpDecimal.lt(cost)) return;
    swariaKnowledge.kp = kpDecimal.sub(cost);
  }
  if (index === 7) {
    const genBtn = document.getElementById("generatorSubTabBtn");
    if (window.currentFloor === 2) {
      genBtn.style.display = "none";
    } else {
      genBtn.style.display = "inline-block";
    }
    document.getElementById("subTabNav").style.display = "flex";
    initializeGeneratorTab();
    if (!state.seenGeneratorUnlockStory) {
      state.seenGeneratorUnlockStory = true;
      if (typeof saveGame === 'function') saveGame();
      setTimeout(() => {
        if (typeof showGeneratorUnlockStoryModal === 'function') {
          showGeneratorUnlockStoryModal();
        }
      }, 100);
    }
  }
  if (index === 8) {
    document.getElementById("graduationSubTabBtn").style.display = "inline-block";
    document.getElementById("knowledgeSubTabNav").style.display = "flex";
  }
  
  // Check for infinity research unlock
  checkInfinityResearchUnlock();
  if (index === 9) {
    const genMainTab = document.getElementById("generatorMainTab");
    if (genMainTab && genMainTab.style.display !== "none") {
      renderGenerators();
    }
  }
  if (index === 10) {
    const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
    const flagKey = `element10SpeechShown_${currentSaveSlot}`;
    if (!localStorage.getItem(flagKey) && typeof window.triggerElement10IntercomEvent === 'function') {
      setTimeout(() => {
        window.triggerElement10IntercomEvent();
        localStorage.setItem(flagKey, '1');
      }, 500);
    }
  }
  if (index === 20) {
    const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
    const flagKey = `element20SpeechShown_${currentSaveSlot}`;
    if (!localStorage.getItem(flagKey) && typeof window.triggerElement20IntercomEvent === 'function') {
      setTimeout(() => {
        window.triggerElement20IntercomEvent();
        localStorage.setItem(flagKey, '1');
      }, 500);
    }
  }
  if (index === 25) {
    const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
    const flagKey = `element25StoryShown_${currentSaveSlot}`;
    if (!localStorage.getItem(flagKey) && typeof window.showElement25StoryModal === 'function') {
      setTimeout(() => {
        window.showElement25StoryModal();
        localStorage.setItem(flagKey, '1');
      }, 500);
    }
  }
  
  boughtElements[index] = true;
  window.boughtElements = boughtElements; 
  applyElementEffect(index);
  updateElementDiscoveryProgress(index);
  if (typeof window.trackElementDiscovery === 'function' && boughtElements) {
    window.trackElementDiscovery(boughtElements);
  }
  updateUI();
  updateKnowledgeUI();
  applySettings();
  renderElementGrid(); 
  updatePrismAdvancedButtonVisibility(); // Update prism navigation based on unlocked elements
}

function updateUI() {
  let rawFluffGain = getFluffRate().floor();
  let finalFluffGain = rawFluffGain;
  
  // Apply challenge nerfs to display rate when in IC:1
  if (typeof window.activeChallenge !== 'undefined' && window.activeChallenge === 1 && typeof window.applyChallengeNerfs === 'function') {
    finalFluffGain = window.applyChallengeNerfs(new Decimal(rawFluffGain), 'fluff').floor();
  }
  
  const fluffEl = document.getElementById("fluff");
  if (fluffEl) {
    fluffEl.style.display = "";
    fluffEl.textContent = formatNumber(state.fluff);
  }
  
  // Update fluff infinity display
  const fluffInfinityEl = document.getElementById("fluffInfinity");
  if (fluffInfinityEl) {
    const fluffInfinityCount = window.infinitySystem ? (window.infinitySystem.counts.fluff || 0) : 0;
    if (fluffInfinityCount > 0) {
      fluffInfinityEl.textContent = `∞X${fluffInfinityCount}`;
      fluffInfinityEl.style.display = "inline";
    } else {
      fluffInfinityEl.textContent = "";
      fluffInfinityEl.style.display = "none";
    }
  }
  
  // Update swaria infinity display
  const swariaInfinityEl = document.getElementById("swariaInfinity");
  if (swariaInfinityEl) {
    const swariaInfinityCount = window.infinitySystem ? (window.infinitySystem.counts.swaria || 0) : 0;
    if (swariaInfinityCount > 0) {
      swariaInfinityEl.textContent = `∞X${swariaInfinityCount}`;
      swariaInfinityEl.style.display = "inline";
    } else {
      swariaInfinityEl.textContent = "";
      swariaInfinityEl.style.display = "none";
    }
  }
  
  // Update feathers infinity display
  const feathersInfinityEl = document.getElementById("feathersInfinity");
  if (feathersInfinityEl) {
    const feathersInfinityCount = window.infinitySystem ? (window.infinitySystem.counts.feathers || 0) : 0;
    if (feathersInfinityCount > 0) {
      feathersInfinityEl.textContent = `∞X${feathersInfinityCount}`;
      feathersInfinityEl.style.display = "inline";
    } else {
      feathersInfinityEl.textContent = "";
      feathersInfinityEl.style.display = "none";
    }
  }
  
  // Update artifacts infinity display
  const artifactsInfinityEl = document.getElementById("artifactsInfinity");
  if (artifactsInfinityEl) {
    const artifactsInfinityCount = window.infinitySystem ? (window.infinitySystem.counts.artifacts || 0) : 0;
    if (artifactsInfinityCount > 0) {
      artifactsInfinityEl.textContent = `∞X${artifactsInfinityCount}`;
      artifactsInfinityEl.style.display = "inline";
    } else {
      artifactsInfinityEl.textContent = "";
      artifactsInfinityEl.style.display = "none";
    }
  }
  
  const fluffRateEl = document.getElementById("fluffRate");
  if (fluffRateEl) {
    fluffRateEl.parentElement.style.display = "";
    fluffRateEl.textContent = formatNumber(finalFluffGain);
  }
  const swariaEl = document.getElementById("swaria");
  if (swariaEl) {
    swariaEl.style.display = "";
    swariaEl.textContent = formatNumber(state.swaria);
  }
  const feathersEl = document.getElementById("feathers");
  if (feathersEl) {
    feathersEl.style.display = "";
    feathersEl.textContent = formatNumber(state.feathers);
  }
  const artifactsEl = document.getElementById("artifacts");
  if (artifactsEl) {
    artifactsEl.style.display = "";
    artifactsEl.textContent = formatNumber(state.artifacts);
  }
  if (typeof updateSwariaHungerUI === 'function') {
    updateSwariaHungerUI();
  }
  {
  const kpPreview = document.getElementById("kpPreview");
  if (kpPreview) {
    let preview = getKpGainPreview();
    let isSoftcapped = preview.gte(new Decimal("1e20")) && preview.lt(new Decimal("1e40"));
    let isMildcapped = preview.gte(new Decimal("1e40"));
    let capLabel = isMildcapped ? ' (mildcap)' : (isSoftcapped ? ' (softcap)' : '');
    kpPreview.textContent = `Gain ${formatNumber(preview)} KP on reset` + capLabel;
    kpPreview.style.display = (boughtElements[10] ? state.feathers.gte(50) : state.artifacts.gte(50)) ? "block" : "none";
    if (isSoftcapped && !state.seenKpSoftcapStory) {
      state.seenKpSoftcapStory = true;
      if (typeof saveGame === 'function') saveGame();
      if (typeof showKpSoftcapModal === 'function') showKpSoftcapModal();
    }
    if (isMildcapped && !state.seenKpMildcapStory) {
      state.seenKpMildcapStory = true;
      if (typeof saveGame === 'function') saveGame();
      if (typeof showKpMildcapModal === 'function') showKpMildcapModal();
    }
  }
 }
  // Debug artifacts value for delivery reset button
  
  const artifactsDecimal = DecimalUtils.isDecimal(state.artifacts) ? state.artifacts : new Decimal(state.artifacts || 0);
  
  document.getElementById("resetBtn").style.display = artifactsDecimal.gte(50) ? "block" : "none";
  const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
  if (kpDecimal.gt(0)) {
    document.getElementById("kpLine").style.display = "block";
    document.getElementById("kp").textContent = formatLargeInt(kpDecimal);
  }
  const boxesProducedEl = document.getElementById("boxesProduced");
  if (boxesProducedEl) {
    boxesProducedEl.textContent = formatNumber(Math.floor(state.boxesProduced || 0));
  }
  const boxesCountEl = document.getElementById("boxesProducedCount");
  if (boxesCountEl) {
    boxesCountEl.textContent = formatNumber(Math.floor(state.boxesProduced || 0));
  }
  
  // Update Swa Bucks display
  const swabucksElement = document.getElementById('inventoryCount-swabucks');
  if (swabucksElement) {
    if (!state.swabucks) {
      state.swabucks = new Decimal(0);
    }
    swabucksElement.textContent = DecimalUtils.formatDecimal(state.swabucks);
  }
  
  // Update inventory modal if it exists and is open
  if (typeof window.updateInventoryModal === 'function') {
    window.updateInventoryModal();
  }
  
  updateGeneratorsUI();
  updateGeneratorUpgradesUI();
  updateWingArtifactUI();
  updatePrismSubTabVisibility();
  updateStairsCardVisibility();
  
  // Check if infinity research should be unlocked
  checkInfinityResearchUnlock();
  
  // Check if control center should be unlocked
  checkControlCenterUnlock();
  
  // Update infinity reset button if infinity research is visible
  const infinityResetTab = document.getElementById('infinityReset');
  if (infinityResetTab && infinityResetTab.classList.contains('active')) {
    updateInfinityResetInfo();
  }
  
  // Update infinity tree if infinity tree tab is visible (throttled to prevent performance issues)
  const infinityTreeTab = document.getElementById('infinityShop');
  if (infinityTreeTab && infinityTreeTab.classList.contains('active')) {
    updateInfinityShopInfo();
  }
  
  // Update infinity research displays
  if (typeof window.updateInfinityResearchDisplay === 'function') {
    window.updateInfinityResearchDisplay();
  }
  
  // Update expansion/grade UI to reflect current KP
  if (typeof updateGradeUI === 'function') {
    updateGradeUI();
  }
}

function getSaveSlotSpecificKey(baseKey) {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
  return `${baseKey}_${currentSaveSlot}`;
}

// Function to clear unlock states for fresh saves ONLY
function clearUnlockStatesForFreshSave() {
  const infinityUnlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  const controlCenterUnlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
  
  // Only clear unlock states if this is truly a fresh save with no progress at all
  const hasKp = swariaKnowledge && DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp.gt(0) : (swariaKnowledge && swariaKnowledge.kp > 0);
  const hasElements = boughtElements && Object.keys(boughtElements).length > 0;
  const hasSeenStory = state.seenFirstDeliveryStory;
  const hasAnyFluff = state && state.fluff && (DecimalUtils.isDecimal(state.fluff) ? state.fluff.gt(0) : state.fluff > 0);
  const hasAnySwaria = state && state.swaria && (DecimalUtils.isDecimal(state.swaria) ? state.swaria.gt(0) : state.swaria > 0);
  
  let totalInfinityCount = 0;
  if (window.infinitySystem && typeof window.infinitySystem.getTotalInfinityCurrency === 'function') {
    totalInfinityCount = window.infinitySystem.getTotalInfinityCurrency();
  }
  
  // Only clear if this is a completely fresh save with no progress whatsoever
  const isFreshSave = !hasKp && !hasElements && !hasSeenStory && !hasAnyFluff && !hasAnySwaria && totalInfinityCount < 1;
  
  if (isFreshSave) {
    // This appears to be a truly fresh save - clear unlock states
    localStorage.removeItem(infinityUnlockKey);
    localStorage.removeItem(controlCenterUnlockKey);

  }
}

// Make the function available globally
window.clearUnlockStatesForFreshSave = clearUnlockStatesForFreshSave;

// Debug function to test unlock state clearing
window.debugUnlockStates = function() {
  const currentSlot = localStorage.getItem('currentSaveSlot') || 'default';
  const infinityKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  const controlKey = getSaveSlotSpecificKey('controlCenterUnlocked');










  // Check infinity system in detail
  let totalInfinityCount = 0;
  let individualInfinities = {};
  let everReachedInfinities = {};
  
  if (window.infinitySystem) {
    if (typeof window.infinitySystem.getTotalInfinityCurrency === 'function') {
      totalInfinityCount = window.infinitySystem.getTotalInfinityCurrency();
    }
    
    if (window.infinitySystem.counts) {
      individualInfinities = {...window.infinitySystem.counts};
    }
    
    if (window.infinitySystem.everReached) {
      everReachedInfinities = {...window.infinitySystem.everReached};
    }
  }




  // Check if any currency has infinity
  let hasAnyIndividualInfinity = false;
  let hasAnyEverReached = false;
  
  for (const [currency, count] of Object.entries(individualInfinities)) {
    if (count && count > 0) {
      hasAnyIndividualInfinity = true;

    }
  }
  
  for (const [currency, reached] of Object.entries(everReachedInfinities)) {
    if (reached) {
      hasAnyEverReached = true;

    }
  }



  const knowledgeTab = document.getElementById('knowledgeTab');
  const infinityBtn = document.getElementById('infinityResearchSubTabBtn');


  return {
    currentSlot,
    infinityUnlocked: localStorage.getItem(infinityKey),
    controlUnlocked: localStorage.getItem(controlKey),
    totalInfinityCount,
    hasAnyIndividualInfinity,
    hasAnyEverReached,
    individualInfinities,
    everReachedInfinities,
    knowledgeTabVisible: knowledgeTab ? knowledgeTab.style.display : 'not found',
    infinityBtnVisible: infinityBtn ? infinityBtn.style.display : 'not found'
  };
};

// Debug function to manually clear unlock states and recheck
window.forceUnlockCheck = function() {

  clearUnlockStatesForFreshSave();
  checkControlCenterUnlock();
  checkInfinityResearchUnlock();
  
  // Update infinity sub-tab visibility
  if (typeof updateInfinitySubTabVisibility === 'function') {
    updateInfinitySubTabVisibility();
  }
  
  // Also update infinity reset info
  if (typeof updateInfinityResetInfo === 'function') {
    updateInfinityResetInfo();
  }

  return debugUnlockStates();
};

// Debug function to manually reset unlock states (for testing only)
window.debugClearUnlockStates = function() {
  const infinityKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  const controlKey = getSaveSlotSpecificKey('controlCenterUnlocked');

  localStorage.removeItem(infinityKey);
  localStorage.removeItem(controlKey);
  
  // Hide the tabs
  const knowledgeTab = document.getElementById('knowledgeTab');
  const infinityBtn = document.getElementById('infinityResearchSubTabBtn');
  if (knowledgeTab) knowledgeTab.style.display = 'none';
  if (infinityBtn) infinityBtn.style.display = 'none';

  return debugUnlockStates();
};

// Debug function to check infinity reset availability
window.debugInfinityReset = function() {
  if (!window.infinitySystem) {

    return { error: 'Infinity system not found' };
  }
  
  const currenciesWithInfinity = window.infinitySystem.getCurrenciesWithInfinity();
  const canReset = window.infinitySystem.canInfinityReset();
  const infinityGain = window.infinitySystem.calculateInfinityGain();
  const totalEarned = window.infinitySystem.totalInfinityEarned;
  const totalFromFunction = window.infinitySystem.getTotalInfinityCurrency();







  // Check reset button state
  const resetButton = document.getElementById('performInfinityReset');


  return {
    currenciesWithInfinity,
    canReset,
    infinityGain,
    totalEarned,
    totalFromFunction,
    resetButtonDisabled: resetButton ? resetButton.disabled : 'not found',
    resetButtonText: resetButton ? resetButton.textContent : 'not found'
  };
};

// Test function to check current infinity state
window.testInfinityState = function() {




  if (window.infinitySystem) {
    const currenciesWithInfinity = window.infinitySystem.getCurrenciesWithInfinity();
    const canReset = window.infinitySystem.canInfinityReset();


  }
  
  // Check current currency values


  // Force an update of the infinity reset info
  updateInfinityResetInfo();
  
  return 'Check console for details';
};

// Test function to set fluff to infinity for testing
window.setFluffToInfinity = function() {
  if (window.infinitySystem && window.state) {

    window.infinitySystem.counts.fluff = 1;
    window.infinitySystem.everReached.fluff = true;
    window.state.fluff = new Decimal('1.79e308'); // Just under infinity threshold
    
    // Update displays
    if (typeof updateDisplay === 'function') updateDisplay();
    if (typeof updateInfinityDisplay === 'function') updateInfinityDisplay();
    updateInfinityResetInfo();
    updateInfinitySubTabVisibility();

    return 'Fluff set to infinity';
  }
  return 'Failed to set fluff to infinity';
};

// Debug function to perform infinity reset without confirmation (for testing only)
window.forceInfinityReset = function() {
  if (window.infinitySystem && window.infinitySystem.canInfinityReset()) {

    window.infinitySystem.performInfinityReset();
    
    // Update displays
    setTimeout(() => {
      updateInfinityResetInfo();
      updateInfinitySubTabVisibility();
      if (typeof updateUI === 'function') updateUI();
      if (typeof updateInfinityBenefits === 'function') updateInfinityBenefits();
    }, 100);
    
    return 'Infinity reset performed (no confirmation)';
  }
  return 'Cannot perform infinity reset - no currencies at infinity';
};

// Test function to simulate having performed infinity resets
window.simulateInfinityResets = function(totalResets = 4) {
  if (window.infinitySystem) {

    window.infinitySystem.totalInfinityEarned = totalResets;
    
    // Update displays and tab visibility
    updateInfinitySubTabVisibility();
    if (typeof updateInfinityBenefits === 'function') updateInfinityBenefits();

    return `Simulated ${totalResets} total infinity`;
  }
  return 'Failed to simulate infinity resets';
};

// Debug function to check sub-tab visibility state
window.debugSubTabVisibility = function() {
  if (!window.infinitySystem) {

    return { error: 'Infinity system not found' };
  }
  
  const totalInfinity = window.infinitySystem.getTotalInfinityCurrency();
  const hasPerformedReset = window.infinitySystem.totalInfinityEarned > 0;
  
  const resetBtn = document.getElementById('infinityResetBtn');
  const researchBtn = document.getElementById('infinityResearchMainBtn');
  const treeBtn = document.getElementById('infinityShopBtn');
  const challengeBtn = document.getElementById('infinityChallengeBtn');
  
  const visibility = {
    totalInfinity,
    hasPerformedReset,
    resetBtnVisible: resetBtn ? resetBtn.style.display !== 'none' : 'not found',
    researchBtnVisible: researchBtn ? researchBtn.style.display !== 'none' : 'not found',
    treeBtnVisible: treeBtn ? treeBtn.style.display !== 'none' : 'not found',
    challengeBtnVisible: challengeBtn ? challengeBtn.style.display !== 'none' : 'not found'
  };







  return visibility;
};

// Debug function to test save slot isolation for infinity data
window.debugInfinitySaveSlots = function() {
  if (!window.infinitySystem) {

    return { error: 'Infinity system not found' };
  }
  
  const currentSlot = localStorage.getItem('currentSaveSlot') || 'unknown';
  const saveKey = getSaveSlotSpecificKey('infinitySystemData');
  const savedData = localStorage.getItem(saveKey);





  // Check all save slots for infinity data
  for (let i = 1; i <= 5; i++) {
    const tempKey = `saveSlot${i}_infinitySystemData`;
    const tempData = localStorage.getItem(tempKey);

  }
  
  return {
    currentSlot,
    saveKey,
    currentTotalInfinity: window.infinitySystem.totalInfinityEarned,
    savedData: savedData ? JSON.parse(savedData) : null
  };
};

// Debug function to manually clear infinity data for current save slot
window.debugClearInfinityData = function() {
  if (window.infinitySystem && typeof window.infinitySystem.clearInfinityData === 'function') {
    window.infinitySystem.clearInfinityData();
    // Update displays
    if (typeof updateInfinityBenefits === 'function') updateInfinityBenefits();
    if (typeof updateInfinitySubTabVisibility === 'function') updateInfinitySubTabVisibility();

    return 'Infinity data cleared';
  }
  return 'Failed to clear infinity data';
};

// Comprehensive test function for save slot isolation
window.testSaveSlotIsolation = function() {
  if (!window.infinitySystem) {

    return { error: 'Infinity system not found' };
  }

  // Test 1: Check current state
  const currentSlot = localStorage.getItem('currentSaveSlot') || 'unknown';
  const currentInfinity = window.infinitySystem.totalInfinityEarned;

  // Test 2: Set some infinity (no saving needed)
  const oldInfinity = window.infinitySystem.totalInfinityEarned;
  window.infinitySystem.totalInfinityEarned = 10;

  // Test 3: Values persist through unified save system

  // Test 4: Check if other slots are isolated

  for (let i = 1; i <= 5; i++) {
    const slotKey = `saveSlot${i}_infinitySystemData`;
    const slotData = localStorage.getItem(slotKey);

  }
  
  // Restore original value
  window.infinitySystem.totalInfinityEarned = oldInfinity;
  
  return {
    test: 'completed',
    currentSlot,
    originalInfinity: oldInfinity,
    testWorked: 'Check console for details'
  };
};

// Debug function to check infinity reset completeness
window.debugInfinityResetState = function() {

  // Check infinity counts
  if (window.infinitySystem && window.infinitySystem.counts) {

    const hasAnyCounts = Object.values(window.infinitySystem.counts).some(count => count > 0);

  }
  
  // Check box generators
  if (window.generators) {

    window.generators.forEach((gen, index) => {

    });
  }
  
  // Check generator upgrades
  if (window.generatorUpgrades) {

  }
  
  // Check elements
  if (window.boughtElements || typeof boughtElements !== 'undefined') {
    const elements = window.boughtElements || boughtElements;

    const elementCount = Object.keys(elements).length;

  }
  
  // Check prism state
  if (window.prismState) {


  }
  
  return {
    infinityCounts: window.infinitySystem?.counts,
    generatorsUnlocked: window.generators?.map(g => g.unlocked),
    elementsCount: Object.keys(window.boughtElements || boughtElements || {}).length,
    prismUpgrades: window.prismState?.generatorUpgrades
  };
};

// Debug function to test infinity total calculation logic
window.testInfinityTotalLogic = function() {
  if (!window.infinitySystem) {

    return { error: 'Infinity system not found' };
  }

  // Save current state
  const originalTotal = window.infinitySystem.totalInfinityEarned;
  const originalCounts = { ...window.infinitySystem.counts };


  // Test scenario 1: 1 total, reset with 1 current -> should stay 1

  window.infinitySystem.totalInfinityEarned = 1;
  window.infinitySystem.counts.fluff = 1;
  const gain1 = window.infinitySystem.calculateInfinityGain();
  const newTotal1 = Math.max(window.infinitySystem.totalInfinityEarned, gain1);

  // Test scenario 2: 1 total, reset with 2 current -> should become 2  

  window.infinitySystem.totalInfinityEarned = 1;
  window.infinitySystem.counts.fluff = 2;
  const gain2 = window.infinitySystem.calculateInfinityGain();
  const newTotal2 = Math.max(window.infinitySystem.totalInfinityEarned, gain2);

  // Test scenario 3: 7 total, reset with 3 current -> should stay 7

  window.infinitySystem.totalInfinityEarned = 7;
  window.infinitySystem.counts.fluff = 3;
  const gain3 = window.infinitySystem.calculateInfinityGain();
  const newTotal3 = Math.max(window.infinitySystem.totalInfinityEarned, gain3);

  // Restore original state
  window.infinitySystem.totalInfinityEarned = originalTotal;
  window.infinitySystem.counts = originalCounts;

  return {
    test1: { total: 1, gain: gain1, newTotal: newTotal1, expected: 1 },
    test2: { total: 1, gain: gain2, newTotal: newTotal2, expected: 2 },
    test3: { total: 7, gain: gain3, newTotal: newTotal3, expected: 7 }
  };
};

// Initialize infinity counts for current save slot
function initializeInfinityCountsForSlot() {
  if (!window.infinitySystem || !window.infinitySystem.counts) {
    return;
  }
  
  // Infinity counts are now persistent and loaded from save data
  // Only initialize with defaults if no saved data exists
  if (Object.keys(window.infinitySystem.counts).length === 0) {
    const defaultCounts = {
      fluff: 0,
      swariaCoins: 0,
      feathers: 0,
      artifacts: 0,
      light: 0,
      redLight: 0,
      orangeLight: 0,
      yellowLight: 0,
      greenLight: 0,
      blueLight: 0,
      terrariumPollen: 0,
      terrariumFlowers: 0,
      terrariumNectar: 0,
      charge: 0
    };
    window.infinitySystem.counts = { ...defaultCounts };

  } else {

  }
}

// Clear infinity counts for current save slot (used for fresh starts)
function clearInfinityCountsForSlot() {
  if (!window.infinitySystem || !window.infinitySystem.counts) {
    return;
  }
  
  // Reset all counts to 0
  const defaultCounts = {
    fluff: 0,
    swariaCoins: 0,
    feathers: 0,
    artifacts: 0,
    light: 0,
    redLight: 0,
    orangeLight: 0,
    yellowLight: 0,
    greenLight: 0,
    blueLight: 0,
    terrariumPollen: 0,
    terrariumFlowers: 0,
    terrariumNectar: 0,
    charge: 0
  };
  
  window.infinitySystem.counts = { ...defaultCounts };
  
  // No saving - counts are always reset to 0

}

// Debug function to force reset infinity counts (for testing)
window.debugResetInfinityCounts = function() {
  if (!window.infinitySystem) {

    return;
  }
  
  const defaultCounts = {
    fluff: 0,
    swariaCoins: 0,
    feathers: 0,
    artifacts: 0,
    light: 0,
    redLight: 0,
    orangeLight: 0,
    yellowLight: 0,
    greenLight: 0,
    blueLight: 0,
    terrariumPollen: 0,
    terrariumFlowers: 0,
    terrariumNectar: 0,
    charge: 0
  };

  window.infinitySystem.counts = { ...defaultCounts };

  // No saving - counts are always reset

};

// Debug function to clean up any existing infinity count localStorage keys
window.cleanupInfinityCountsStorage = function() {
  let keysRemoved = 0;
  const keysToRemove = [];
  
  // Find all localStorage keys that contain 'infinityCounts'
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('infinityCounts')) {
      keysToRemove.push(key);
    }
  }
  
  // Remove the keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    keysRemoved++;

  });

};

function checkInfinityResearchUnlock() {
  // Check if any currency has reached infinity for the first time
  // IMPORTANT: Once unlocked, this tab stays unlocked PERMANENTLY for this save slot
  const unlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  
  // Check if already permanently unlocked for this save slot
  if (localStorage.getItem(unlockKey)) {
    // Already unlocked permanently - just ensure tab is visible
    const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
    if (infinityResearchBtn) {
      infinityResearchBtn.style.display = "inline-block";
    }
    
    // Update sub-tab visibility
    updateInfinitySubTabVisibility();
    return;
  }
  
  try {
    // Check if any individual currency has reached infinity
    let hasAnyInfinity = false;
    
    if (window.infinitySystem && window.infinitySystem.counts) {
      // Check individual currency infinity counts
      for (const [currency, count] of Object.entries(window.infinitySystem.counts)) {
        if (count && count > 0) {
          hasAnyInfinity = true;
          break;
        }
      }
    }
    
    // Also check if any currency has ever reached infinity (discovery)
    if (!hasAnyInfinity && window.infinitySystem && window.infinitySystem.everReached) {
      for (const [currency, reached] of Object.entries(window.infinitySystem.everReached)) {
        if (reached) {
          hasAnyInfinity = true;
          break;
        }
      }
    }
    
    // Fallback: check the total infinity currency method
    if (!hasAnyInfinity && window.infinitySystem && typeof window.infinitySystem.getTotalInfinityCurrency === 'function') {
      const totalInfinityCount = window.infinitySystem.getTotalInfinityCurrency();
      hasAnyInfinity = totalInfinityCount >= 1;
    }
    
    // If conditions are met, unlock permanently
    if (hasAnyInfinity) {
      localStorage.setItem(unlockKey, 'true');

      // Show notification
      if (typeof showNotification === 'function') {
        showNotification('Infinity Research Unlocked!', 'You can now access the Infinity Research tab in Knowledge.', 'success');
      }
      
      // Show the tab
      const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
      if (infinityResearchBtn) {
        infinityResearchBtn.style.display = "inline-block";
      }
      
      // Update sub-tab visibility when main tab is unlocked
      updateInfinitySubTabVisibility();
    } else {
      // Not unlocked yet - hide the tab
      const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
      if (infinityResearchBtn) {
        infinityResearchBtn.style.display = "none";
      }
    }
  } catch (error) {

  }
}

function checkControlCenterUnlock() {
  // Check if control center should be unlocked after first delivery reset
  // IMPORTANT: Once unlocked, this tab stays unlocked PERMANENTLY for this save slot
  const unlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
  
  // Check if already permanently unlocked for this save slot
  if (localStorage.getItem(unlockKey)) {
    // Already unlocked permanently - just ensure tab is visible
    const knowledgeTab = document.getElementById("knowledgeTab");
    if (knowledgeTab) {
      knowledgeTab.style.display = "inline-block";
    }
    return;
  }
  
  try {
    // Check if any of the unlock conditions are met for THIS save slot
    const hasKp = swariaKnowledge && DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp.gt(0) : (swariaKnowledge && swariaKnowledge.kp > 0);
    const hasElements = boughtElements && Object.keys(boughtElements).length > 0;
    const hasSeenStory = state.seenFirstDeliveryStory;
    
    const shouldBeUnlocked = hasSeenStory || hasKp || hasElements;
    
    // If conditions are met, unlock permanently
    if (shouldBeUnlocked) {
      localStorage.setItem(unlockKey, 'true');

      // Show the tab
      const knowledgeTab = document.getElementById("knowledgeTab");
      if (knowledgeTab) {
        knowledgeTab.style.display = "inline-block";
      }
    } else {
      // Not unlocked yet - hide the tab
      const knowledgeTab = document.getElementById("knowledgeTab");
      if (knowledgeTab) {
        knowledgeTab.style.display = "none";
      }
    }
  } catch (error) {

  }
}

function updateKnowledgeUI() {
  document.querySelectorAll('#kp').forEach(kpEl => {
    kpEl.textContent = formatLargeInt(swariaKnowledge.kp);
  });
}

function applySettings() {
  const root = document.getElementById("root");
  root.dataset.colour = settings.colour;
  root.dataset.style = settings.style;
  document.getElementById("themeSelect").value = settings.theme;
  document.getElementById("colorSelect").value = settings.colour;
  document.getElementById("styleSelect").value = settings.style;
  document.getElementById("notationSelect").value = settings.notation;
  document.getElementById("disableOfflineProgressToggle").checked = settings.disableOfflineProgress;
  document.getElementById("confirmResetToggle").checked = settings.confirmReset;
  const nectarizeResetLabel = document.getElementById("confirmNectarizeResetLabel");
  const nectarizeResetToggle = document.getElementById("confirmNectarizeResetToggle");
  if (window.nectarizeQuestPermanentlyCompleted || window.nectarizeMachineRepaired) {
    nectarizeResetLabel.style.display = "block";
    nectarizeResetToggle.checked = settings.confirmNectarizeReset;
  } else {
    nectarizeResetLabel.style.display = "none";
  }
  document.getElementById("autosaveToggle").checked = settings.autosave;
}

document.getElementById("themeSelect").onchange = e => {
  settings.theme = e.target.value;
  applySettings(); saveSettings();
};
document.getElementById("colorSelect").onchange = e => {
  settings.colour = e.target.value;
  applySettings(); saveSettings();
};
document.getElementById("styleSelect").onchange = e => {
  settings.style = e.target.value;
  applySettings(); saveSettings();
  if (e.target.value === 'square' && typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret2', 1);
  }
};
document.getElementById("notationSelect").onchange = e => {
  settings.notation = e.target.value;
  localStorage.setItem('notationPreference', e.target.value);
  saveSettings();
  // Trigger a UI update to refresh all number displays
  updateUI();
};
document.getElementById("disableOfflineProgressToggle").onchange = e => {
  settings.disableOfflineProgress = e.target.checked;
  saveSettings();
  
  // Setup or remove window focus/blur listeners based on the setting
  if (settings.disableOfflineProgress) {
    setupOfflineProgressPrevention();
  } else {
    removeOfflineProgressPrevention();
  }
};
document.getElementById("confirmResetToggle").onchange = e => {
  settings.confirmReset = e.target.checked;
  saveSettings();
};
document.getElementById("autosaveToggle").onchange = e => {
  settings.autosave = e.target.checked;
  saveSettings();
};
document.getElementById("confirmNectarizeResetToggle").onchange = e => {
  settings.confirmNectarizeReset = e.target.checked;
  saveSettings();
};

function saveGame() {
  if (window.kitchenIngredients) {
    ['mushroom', 'sparks', 'berries', 'petals', 'water', 'prisma', 'stardust', 'swabucks', 'berryPlate',].forEach(type => {
      if (!DecimalUtils.isDecimal(window.kitchenIngredients[type])) {
        window.kitchenIngredients[type] = new Decimal(window.kitchenIngredients[type] || 0);
      }
    });
  }
  if (typeof window.savePremiumState === 'function') {
    window.savePremiumState();
  }
  if (typeof window.saveAchievements === 'function') {
    window.saveAchievements();
  }
  if (window.kitchenCooking && typeof window.kitchenCooking.updateGlobals === 'function') {
    window.kitchenCooking.updateGlobals();
  }
  if (typeof saveCookingState === 'function') saveCookingState();
  const berryCookingState = localStorage.getItem('berryCookingState') || null;
  const generatorSpeedUpgrades = {};
  const generatorSpeedMultipliers = {};
  const generatorUpgradeLevels = {};
  generators.forEach(gen => {
    generatorSpeedUpgrades[gen.reward] = gen.speedUpgrades || 0;
    generatorSpeedMultipliers[gen.reward] = gen.speedMultiplier || 1;
    generatorUpgradeLevels[gen.reward] = gen.upgrades || 0;
  });
  const save = {
    state,
    settings,
    swariaKnowledge,
    boughtElements,
    prismAdvancedLabUnlocked: window.prismAdvancedLabUnlocked || false,
    elementDiscoveryProgress: state.elementDiscoveryProgress || 0,
    permanentElementDiscovery: state.permanentElementDiscovery ? {
      highestGradeAchieved: state.permanentElementDiscovery.highestGradeAchieved || 1,
      permanentlyDiscoveredElements: Array.from(state.permanentElementDiscovery.permanentlyDiscoveredElements || [1, 2, 3, 4, 5, 6, 7, 8])
    } : {
      highestGradeAchieved: 1,
      permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    generatorUpgrades,
    prismState: window.prismState || {},
    generatorsUnlocked: generators.map(g => g.unlocked || false),
    generatorSpeedUpgrades,
    generatorSpeedMultipliers,
    generatorUpgradeLevels,
    chargerCharge: (window.charger && typeof window.charger.charge !== 'undefined') ? window.charger.charge : 0,
    chargerSoapState: (window.charger) ? {
      soapClickCount: window.charger.soapClickCount || 0,
      soapLastClickTime: window.charger.soapLastClickTime || 0,
      soapIsMad: window.charger.soapIsMad || false,
      soapIsTalking: window.charger.soapIsTalking || false,
      soapChargeEaten: window.charger.soapChargeEaten || 0,
      soapWillEatCharge: window.charger.soapWillEatCharge || false
    } : {},
    chargerMilestones: (window.charger && window.charger.milestones) ? window.charger.milestones.map(ms => ({
      unlocked: ms.unlocked || false,
      elementUnlocked: ms.elementUnlocked || false
    })) : [],
    terrariumPollen: window.terrariumPollen || 0,
    terrariumFlowers: window.terrariumFlowers || 0,
    terrariumXP: window.terrariumXP || 0,
    terrariumLevel: window.terrariumLevel || 1,
    terrariumPollenValueUpgradeLevel: window.terrariumPollenValueUpgradeLevel || 0,
    terrariumPollenValueUpgrade2Level: window.terrariumPollenValueUpgrade2Level || 0,
    terrariumFlowerValueUpgradeLevel: window.terrariumFlowerValueUpgradeLevel || 0,
    terrariumPollenToolSpeedUpgradeLevel: window.terrariumPollenToolSpeedUpgradeLevel || 0,
    terrariumFlowerXPUpgradeLevel: window.terrariumFlowerXPUpgradeLevel || 0,
    terrariumExtraChargeUpgradeLevel: window.terrariumExtraChargeUpgradeLevel || 0,
    terrariumXpMultiplierUpgradeLevel: window.terrariumXpMultiplierUpgradeLevel || 0,
    terrariumFlowerFieldExpansionUpgradeLevel: window.terrariumFlowerFieldExpansionUpgradeLevel || 0, 
    terrariumFlowerUpgrade4Level: window.terrariumFlowerUpgrade4Level || 0, 
    terrariumFlowerUpgrade5Level: window.terrariumFlowerUpgrade5Level || 0,
    terrariumNectar: window.terrariumNectar || 0,
    terrariumKpNectarUpgradeLevel: window.terrariumKpNectarUpgradeLevel || 0,
    terrariumPollenFlowerNectarUpgradeLevel: window.terrariumPollenFlowerNectarUpgradeLevel || 0,
    terrariumNectarXpUpgradeLevel: window.terrariumNectarXpUpgradeLevel || 0,
    terrariumNectarValueUpgradeLevel: window.terrariumNectarValueUpgradeLevel || 0,
    terrariumNectarInfinityUpgradeLevel: window.terrariumNectarInfinityUpgradeLevel || 0,
    nectarUpgradeLevel: window.nectarUpgradeLevel || 0,
    nectarUpgradeCost: window.nectarUpgradeCost || 100,
        nectarizeMachineRepaired: window.nectarizeMachineRepaired || false,
        nectarizeMachineLevel: window.nectarizeMachineLevel || 1,
        nectarizeQuestActive: window.nectarizeQuestActive || false,
        nectarizeQuestProgress: window.nectarizeQuestProgress || 0,
        nectarizeQuestPermanentlyCompleted: window.nectarizeQuestPermanentlyCompleted || false,
        hardModePermanentlyUnlocked: window.hardModePermanentlyUnlocked || false,
        nectarizeQuestGivenBattery: window.nectarizeQuestGivenBattery || 0,
        nectarizeQuestGivenSparks: window.nectarizeQuestGivenSparks || 0,
        nectarizeQuestGivenPetals: window.nectarizeQuestGivenPetals || 0,
        nectarizeMilestones: window.nectarizeMilestones || [],
        nectarizeMilestoneLevel: window.nectarizeMilestoneLevel || 0,
        nectarizeResets: window.nectarizeResets || 0,
        nectarizeResetBonus: window.nectarizeResetBonus || 0,
        nectarizeTier: window.nectarizeTier || 0,
        nectarizePostResetTokenRequirement: window.nectarizePostResetTokenRequirement || 0,
        nectarizePostResetTokensGiven: window.nectarizePostResetTokensGiven || 0,
        nectarizePostResetTokenType: window.nectarizePostResetTokenType || 'petals',
        fluzzerTimeoutActive: window.fluzzerTimeoutActive || false,
        fluzzerTimeoutEndTime: window.fluzzerTimeoutEndTime || null,
        fluzzerClickTimestamps: window.fluzzerClickTimestamps || [],
        kitchenIngredients: (() => {
          const serialized = {};
          for (const [key, value] of Object.entries(window.kitchenIngredients || {})) {
            if (DecimalUtils.isDecimal(value)) {
              serialized[key] = value.toString();
            } else {
              serialized[key] = value;
            }
          }
          return serialized;
        })(),
    friendship: window.friendship || {},
    berryCookingState: berryCookingState,
    swabucks: (window.state && window.state.swabucks) ? window.state.swabucks.toString() : "0",
    berryPlate: (window.state && typeof window.state.berryPlate === 'number') ? window.state.berryPlate : 0,
    mushroomSoup: (window.state && typeof window.state.mushroomSoup === 'number') ? window.state.mushroomSoup : 0,
    batteries: (window.state && typeof window.state.batteries === 'number') ? window.state.batteries : 0,
    glitteringPetals: (window.state && typeof window.state.glitteringPetals === 'number') ? window.state.glitteringPetals : 0,
    chargedPrisma: (window.state && typeof window.state.chargedPrisma === 'number') ? window.state.chargedPrisma : 0,
    mysticCookingSpeedBoost: (window.state && typeof window.state.mysticCookingSpeedBoost === 'number') ? window.state.mysticCookingSpeedBoost : 0,
    soapBatteryBoost: (window.state && typeof window.state.soapBatteryBoost === 'number') ? window.state.soapBatteryBoost : 0,
    fluzzerGlitteringPetalsBoost: (window.state && typeof window.state.fluzzerGlitteringPetalsBoost === 'number') ? window.state.fluzzerGlitteringPetalsBoost : 0,
    peachyHungerBoost: (window.state && typeof window.state.peachyHungerBoost === 'number') ? window.state.peachyHungerBoost : 0,
    chargerState: {
      charge: window.charger ? window.charger.charge : 0,
      milestones: window.charger ? window.charger.milestones.map(ms => ({ unlocked: ms.unlocked })) : [],
      milestoneQuests: window.charger ? window.charger.milestoneQuests : null,
      questStage: window.state && window.state.soapChargeQuest ? window.state.soapChargeQuest.stage : 0
    },
    characterFullStatus: (window.state && window.state.characterFullStatus) ? window.state.characterFullStatus : {
      swaria: 0,
      soap: 0,
      fluzzer: 0,
      mystic: 0,
      vi: 0
    },
    hardModeQuestActive: state.hardModeQuestActive || false,
    hardModeQuestProgress: state.hardModeQuestProgress || {
      berryTokens: 0,
      stardustTokens: 0,
      berryPlateTokens: 0,
      mushroomSoupTokens: 0,
      prismClicks: 0,
      commonBoxes: 0,
      flowersWatered: 0,
      powerRefills: 0,
      soapPokes: 0,
      ingredientsCooked: 0
    },
    hardModeEnabled: window.hardModeEnabled || false,
    premiumState: window.premiumState || {
      bijouUnlocked: false,
      bijouEnabled: false,
      vrchatMirrorUnlocked: false
    },
    intercomState: {
      intercomEventTriggered: (window.intercomEventTriggered !== undefined) ? window.intercomEventTriggered : false,
      intercomEvent20Triggered: (window.intercomEvent20Triggered !== undefined) ? window.intercomEvent20Triggered : false
    },
    boutiqueData: window.boutique ? window.boutique.saveData() : { purchaseHistory: {} },
    frontDeskState: window.frontDeskState ? {
      employees: window.frontDeskState.employees,
      totalHired: window.frontDeskState.totalHired,
      // Add our new front desk system data
      availableWorkers: window.frontDeskState.availableWorkers,
      assignedWorkers: window.frontDeskState.assignedWorkers,
      unlockedSlots: window.frontDeskState.unlockedSlots,
      nextArrivalTime: window.frontDeskState.nextArrivalTime,
      isUnlocked: window.frontDeskState.isUnlocked
    } : { employees: {}, totalHired: 0 }
  };
  
  // Add infinity system data to main save
  save.infinityData = window.infinitySystem ? {
    counts: window.infinitySystem.counts || {},
    everReached: window.infinitySystem.everReached || {},
    infinityPoints: window.infinitySystem.infinityPoints ? window.infinitySystem.infinityPoints.toString() : "0",
    infinityTheorems: window.infinitySystem.infinityTheorems || 0,
    totalInfinityTheorems: window.infinitySystem.totalInfinityTheorems || 0,
    theoremProgress: window.infinitySystem.theoremProgress ? window.infinitySystem.theoremProgress.toString() : "0",
    totalInfinityEarned: window.infinitySystem.totalInfinityEarned || 0,
    lastInfinityPointsUpdate: window.infinitySystem.lastInfinityPointsUpdate || Date.now()
  } : {
    counts: {},
    everReached: {},
    infinityPoints: "0",
    infinityTheorems: 0,
    totalInfinityTheorems: 0,
    theoremProgress: "0",
    totalInfinityEarned: 0,
    lastInfinityPointsUpdate: Date.now()
  };
  
  // Add infinity upgrades data
  save.infinityUpgrades = window.infinityUpgrades || {};
  
  // Add infinity caps data
  save.infinityCaps = window.infinityCaps || {};
  
  // Add advanced prism calibration state - only if advanced prism is unlocked
  save.advancedPrismCalibration = (window.advancedPrismState && window.advancedPrismState.unlocked) ? {
    stable: {
      light: window.advancedPrismState.calibration.stable.light ? window.advancedPrismState.calibration.stable.light.toString() : "0",
      redlight: window.advancedPrismState.calibration.stable.redlight ? window.advancedPrismState.calibration.stable.redlight.toString() : "0",
      orangelight: window.advancedPrismState.calibration.stable.orangelight ? window.advancedPrismState.calibration.stable.orangelight.toString() : "0",
      yellowlight: window.advancedPrismState.calibration.stable.yellowlight ? window.advancedPrismState.calibration.stable.yellowlight.toString() : "0",
      greenlight: window.advancedPrismState.calibration.stable.greenlight ? window.advancedPrismState.calibration.stable.greenlight.toString() : "0",
      bluelight: window.advancedPrismState.calibration.stable.bluelight ? window.advancedPrismState.calibration.stable.bluelight.toString() : "0"
    },
    nerfs: {
      light: window.advancedPrismState.calibration.nerfs.light ? window.advancedPrismState.calibration.nerfs.light.toString() : "1",
      redlight: window.advancedPrismState.calibration.nerfs.redlight ? window.advancedPrismState.calibration.nerfs.redlight.toString() : "1",
      orangelight: window.advancedPrismState.calibration.nerfs.orangelight ? window.advancedPrismState.calibration.nerfs.orangelight.toString() : "1",
      yellowlight: window.advancedPrismState.calibration.nerfs.yellowlight ? window.advancedPrismState.calibration.nerfs.yellowlight.toString() : "1",
      greenlight: window.advancedPrismState.calibration.nerfs.greenlight ? window.advancedPrismState.calibration.nerfs.greenlight.toString() : "1",
      bluelight: window.advancedPrismState.calibration.nerfs.bluelight ? window.advancedPrismState.calibration.nerfs.bluelight.toString() : "1"
    },
    totalTimeAccumulated: window.advancedPrismState.calibration.totalTimeAccumulated || {
      light: 0,
      redlight: 0,
      orangelight: 0,
      yellowlight: 0,
      greenlight: 0,
      bluelight: 0
    }
  } : null;
  
  // Add advanced prism lab clicks and image swap state - only if advanced prism is unlocked
  save.advancedPrismState = (window.advancedPrismState && window.advancedPrismState.unlocked) ? {
    labTabClicks: window.advancedPrismState.labTabClicks || 0,
    hasCompletedLabClicks: window.advancedPrismState.hasCompletedLabClicks || false,
    imagesSwapped: window.advancedPrismState.imagesSwapped || false,
    hasShownLabDialogue: window.advancedPrismState.hasShownLabDialogue || false
  } : null;
  
  save.infinityChallengeData = (typeof window.infinityChallenges !== 'undefined' && typeof window.activeChallenge !== 'undefined' && typeof window.activeDifficulty !== 'undefined') ? {
      challenges: window.infinityChallenges,
      activeChallenge: window.activeChallenge,
      activeDifficulty: window.activeDifficulty
    } : {
      challenges: {},
      activeChallenge: 0,
      activeDifficulty: 0
    };
  
  // Use DecimalUtils to serialize the state for saving
  const serializedSave = DecimalUtils.serializeGameState(save);
  
  const saveSlotNumber = localStorage.getItem('currentSaveSlot');
  if (saveSlotNumber) {
    localStorage.setItem(`swariaSaveSlot${saveSlotNumber}`, JSON.stringify(serializedSave));
  } else {
    localStorage.setItem("swariaSave", JSON.stringify(serializedSave));
  }
  
  // Infinity data is now saved as part of the main save system
  
  if (typeof window.saveChargerState === 'function') {
    window.saveChargerState();
  }
}

function loadGame() {
  const loadGameSaveSlot = localStorage.getItem('currentSaveSlot');
  let save;
  
  try {
    if (loadGameSaveSlot) {
      const slotData = localStorage.getItem(`swariaSaveSlot${loadGameSaveSlot}`);
      if (slotData) {
        save = DecimalUtils.deserializeGameState(JSON.parse(slotData));
        
        // Validate the loaded save has essential data
        if (!save.kitchenIngredients || !save.friendship || !save.state) {
          throw new Error('Save data appears incomplete');
        }
      } else {
        save = {};
      }
    } else {
      const saveData = localStorage.getItem("swariaSave") || "{}";
      save = DecimalUtils.deserializeGameState(JSON.parse(saveData));
    }
  } catch (error) {

    // Try backup if current slot failed
    if (loadGameSaveSlot) {
      const backupKey = `swariaSaveSlot${loadGameSaveSlot}_backup`;
      const backupData = localStorage.getItem(backupKey);
      if (backupData) {

        try {
          save = DecimalUtils.deserializeGameState(JSON.parse(backupData));
        } catch (backupError) {

          save = {};
        }
      } else {
        save = {};
      }
    } else {
      save = {};
    }
  }
  
  if (save.state) Object.assign(state, save.state);
  
  // Ensure state.grade is a Decimal
  if (typeof state.grade !== 'undefined' && !DecimalUtils.isDecimal(state.grade)) {
    state.grade = new Decimal(state.grade);
  }
  
  if (!state.characterHunger) state.characterHunger = {};
  if (typeof state.characterHunger.swaria !== 'number') state.characterHunger.swaria = 100;
  if (typeof state.characterHunger.soap !== 'number') state.characterHunger.soap = 100;
  if (typeof state.characterHunger.fluzzer !== 'number') state.characterHunger.fluzzer = 100;
  if (typeof state.characterHunger.mystic !== 'number') state.characterHunger.mystic = 100;
  if (typeof state.characterHunger.vi !== 'number') state.characterHunger.vi = 100;
    if (!state.characterFullStatus) state.characterFullStatus = {};
    if (typeof state.characterFullStatus.swaria !== 'number') state.characterFullStatus.swaria = 0;
    if (typeof state.characterFullStatus.soap !== 'number') state.characterFullStatus.soap = 0;
    if (typeof state.characterFullStatus.fluzzer !== 'number') state.characterFullStatus.fluzzer = 0;
    if (typeof state.characterFullStatus.mystic !== 'number') state.characterFullStatus.mystic = 0;
    if (typeof state.characterFullStatus.vi !== 'number') state.characterFullStatus.vi = 0;
    if (save.characterFullStatus) {
      state.characterFullStatus = save.characterFullStatus;
    }
    if (typeof updateSwariaHungerUI === 'function') {
      updateSwariaHungerUI();
    }
  if (save.settings) Object.assign(settings, save.settings);
  window.settings = settings;
  if (save.swariaKnowledge) Object.assign(swariaKnowledge, save.swariaKnowledge);
  boughtElements = save.boughtElements || {};
  
  // Load permanent prism advanced lab unlock status
  window.prismAdvancedLabUnlocked = save.prismAdvancedLabUnlocked || false;
  
  // Re-apply all purchased element effects properly
  recalculateAllElementEffects();
  
  // Update prism navigation immediately after loading elements
  updatePrismAdvancedButtonVisibility();
  
  generatorUpgrades = save.generatorUpgrades || {};
  
  // Convert to Decimal objects for consistency
  Object.keys(generatorUpgrades).forEach(key => {
    if (!DecimalUtils.isDecimal(generatorUpgrades[key])) {
      generatorUpgrades[key] = new Decimal(generatorUpgrades[key] || 0);
    }
  });
  
  // Keep window reference synced
  window.generatorUpgrades = generatorUpgrades;
  if (save.elementDiscoveryProgress !== undefined) {
    state.elementDiscoveryProgress = save.elementDiscoveryProgress;
  }
  
  // Load permanent element discovery data
  if (save.permanentElementDiscovery !== undefined) {
    state.permanentElementDiscovery = {
      highestGradeAchieved: save.permanentElementDiscovery.highestGradeAchieved || 1,
      permanentlyDiscoveredElements: new Set(save.permanentElementDiscovery.permanentlyDiscoveredElements || [1, 2, 3, 4, 5, 6, 7, 8])
    };
  } else if (!state.permanentElementDiscovery) {
    // Initialize if not present
    state.permanentElementDiscovery = {
      highestGradeAchieved: 1,
      permanentlyDiscoveredElements: new Set([1, 2, 3, 4, 5, 6, 7, 8])
    };
  }
  
  if (typeof window.trackElementDiscovery === 'function' && boughtElements) {
    window.trackElementDiscovery(boughtElements);
  }
  if (typeof window.trackGeneratorUnlocks === 'function') {
    window.trackGeneratorUnlocks();
  }
  if (typeof window.trackGradeMilestone === 'function') {
    window.trackGradeMilestone(state.grade);
  }
  if (typeof window.trackLightParticleGeneration === 'function') {
    window.trackLightParticleGeneration();
  }
  if (typeof window.trackRedLightParticleGeneration === 'function' && window.prismState && window.prismState.generatorUnlocked && window.prismState.generatorUnlocked.redlight) {
    window.trackRedLightParticleGeneration();
  }
  if (typeof window.trackChargeMilestone === 'function' && window.charger && window.charger.charge > 0) {
    window.trackChargeMilestone(window.charger.charge);
  }
  if (typeof window.trackFluffMilestone === 'function' && state.fluff > 0) {
    window.trackFluffMilestone(state.fluff);
  }
      if (typeof window.trackFlowerMilestone === 'function' && window.terrariumFlowers > 0) {
      window.trackFlowerMilestone(window.terrariumFlowers);
    }
    if (typeof window.trackNectarMilestone === 'function' && window.terrariumNectar > 0) {
      window.trackNectarMilestone(window.terrariumNectar);
    }
    if (typeof window.trackOrangeLightMilestone === 'function' && window.prismState && window.prismState.orangelight > 0) {
      window.trackOrangeLightMilestone(window.prismState.orangelight);
    }
  if (typeof window.trackNectarMilestone === 'function' && window.terrariumNectar > 0) {
    window.trackNectarMilestone(window.terrariumNectar);
  }
  if (typeof window.trackOrangeLightMilestone === 'function' && window.prismState && window.prismState.orangelight > 0) {
    window.trackOrangeLightMilestone(window.prismState.orangelight);
  }
  if (typeof window.updateSecretAchievementProgress === 'function' && settings.style === 'square') {
    window.updateSecretAchievementProgress('secret2', 1);
  }
  if (save.generatorSpeedUpgrades || save.generatorSpeedMultipliers || save.generatorUpgradeLevels) {
    generators.forEach(gen => {
      gen.speedUpgrades = (save.generatorSpeedUpgrades && save.generatorSpeedUpgrades[gen.reward]) || 0;
      gen.speedMultiplier = (save.generatorSpeedMultipliers && save.generatorSpeedMultipliers[gen.reward]) || 1;
      gen.upgrades = (save.generatorUpgradeLevels && save.generatorUpgradeLevels[gen.reward]) || 0;
      gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades) * (gen.speedMultiplier || 1);
    });
  } else {
    generators.forEach(gen => {
      gen.speedUpgrades = 0;
      gen.speedMultiplier = 1;
      gen.upgrades = 0;
      gen.speed = gen.baseSpeed;
    });
  }
  if (save.prismState && window.prismState) {
    // Convert saved values to Decimals to maintain precision
    const decimalProps = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight', 
                         'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                         'greenlightparticle', 'bluelightparticle'];
    
    for (const prop in save.prismState) {
      if (decimalProps.includes(prop)) {
        window.prismState[prop] = new Decimal(save.prismState[prop] || 0);
      } else {
        window.prismState[prop] = save.prismState[prop];
      }
    }
  }
  if (save.chargerState && window.charger) {
    window.charger.charge = new Decimal(save.chargerState.charge || 0);
    if (Array.isArray(save.chargerState.milestones)) {
      save.chargerState.milestones.forEach((ms, idx) => {
        if (idx < window.charger.milestones.length) {
          window.charger.milestones[idx].unlocked = ms.unlocked || false;
        }
      });
    }
    if (!window.charger.milestoneQuests) {
      window.charger.milestoneQuests = {
        3: { required: 10, given: 0, completed: false },
        4: { required: 15, given: 0, completed: false },
        5: { required: 25, given: 0, completed: false },
        6: { required: 50, given: 0, completed: false },
        7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 },
        8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }
      };
    }
    if (save.chargerState.milestoneQuests) {
      Object.entries(save.chargerState.milestoneQuests).forEach(([index, quest]) => {
        if (window.charger.milestoneQuests[index]) {
          window.charger.milestoneQuests[index].given = quest.given || 0;
          window.charger.milestoneQuests[index].completed = quest.completed || false;
          if ((index === '7' || index === '8')) {
            if (typeof quest.batteryRequired !== 'undefined') {
              window.charger.milestoneQuests[index].batteryRequired = quest.batteryRequired;
            }
            if (typeof quest.batteryGiven !== 'undefined') {
              window.charger.milestoneQuests[index].batteryGiven = quest.batteryGiven;
            }
          }
        }
      });
    }
    if (typeof save.chargerState.questStage !== 'undefined' && window.state) {
      if (!window.state.soapChargeQuest) {
        window.state.soapChargeQuest = { stage: save.chargerState.questStage, initialized: true };
      } else {
        window.state.soapChargeQuest.stage = save.chargerState.questStage;
        window.state.soapChargeQuest.initialized = true;
      }
    }
  }
  if (window.state && !window.state.soapChargeQuest) {
    window.state.soapChargeQuest = { stage: 0, initialized: true };
  }
  if (save.characterFullStatus) {
    state.characterFullStatus = save.characterFullStatus;
  }
  if (save.berryCookingState) {
    localStorage.setItem('berryCookingState', save.berryCookingState);
  } else {
    localStorage.removeItem('berryCookingState');
  }
  if (typeof window.loadChargerState === 'function') {
    window.loadChargerState();
  }
  if (typeof window.saveChargerState === 'function') {
    window.saveChargerState();
  }
  if (window.charger && save.chargerState && save.chargerState.milestoneQuests) {
    window.charger.milestoneQuests = save.chargerState.milestoneQuests;
  }
  if (!state.powerEnergy) state.powerEnergy = new Decimal(100);
  if (!state.powerMaxEnergy) state.powerMaxEnergy = calculatePowerGeneratorCap();
  if (!state.powerStatus) state.powerStatus = 'online';
  if (!state.powerLastTick) state.powerLastTick = Date.now();
  if (!state.boxesProduced) state.boxesProduced = 0;
  if (!state.boxesProducedByType) {
    state.boxesProducedByType = {
      common: new Decimal(0),
      uncommon: new Decimal(0),
      rare: new Decimal(0),
      legendary: new Decimal(0),
      mythic: new Decimal(0)
    };
  }
  if (typeof state.soapTotalChargeEaten !== 'number') state.soapTotalChargeEaten = 0;
  if (window.charger && save.chargerState && typeof save.chargerState.charge !== 'undefined') {
    window.charger.charge = new Decimal(save.chargerState.charge);
  }
  else if (window.charger && typeof save.chargerCharge !== 'undefined') {
    window.charger.charge = new Decimal(save.chargerCharge);
  }
  if (window.charger && save.chargerSoapState) {
    window.charger.soapClickCount = save.chargerSoapState.soapClickCount || 0;
    window.charger.soapLastClickTime = save.chargerSoapState.soapLastClickTime || 0;
    window.charger.soapIsMad = save.chargerSoapState.soapIsMad || false;
    window.charger.soapIsTalking = save.chargerSoapState.soapIsTalking || false;
    window.charger.soapChargeEaten = save.chargerSoapState.soapChargeEaten || 0;
    window.charger.soapWillEatCharge = save.chargerSoapState.soapWillEatCharge || false;
  }
  if (window.charger && save.chargerState && save.chargerState.milestones && Array.isArray(save.chargerState.milestones)) {
    save.chargerState.milestones.forEach((ms, idx) => {
      if (window.charger.milestones[idx]) {
        window.charger.milestones[idx].unlocked = ms.unlocked || false;
        window.charger.milestones[idx].elementUnlocked = ms.elementUnlocked || false;
      }
    });
  }
  else if (window.charger && save.chargerMilestones && Array.isArray(save.chargerMilestones)) {
    save.chargerMilestones.forEach((ms, idx) => {
      if (window.charger.milestones[idx]) {
        window.charger.milestones[idx].unlocked = ms.unlocked || false;
        window.charger.milestones[idx].elementUnlocked = ms.elementUnlocked || false;
      }
    });
  }
  if (typeof save.terrariumPollen !== 'undefined') window.terrariumPollen = new Decimal(save.terrariumPollen || 0);
  if (typeof save.terrariumFlowers !== 'undefined') window.terrariumFlowers = new Decimal(save.terrariumFlowers || 0);
  if (typeof save.terrariumXP !== 'undefined') window.terrariumXP = new Decimal(save.terrariumXP || 0);
  if (typeof save.terrariumLevel !== 'undefined') window.terrariumLevel = save.terrariumLevel;
  if (typeof save.terrariumPollenValueUpgradeLevel !== 'undefined') {
    window.terrariumPollenValueUpgradeLevel = save.terrariumPollenValueUpgradeLevel;
  }
  if (typeof save.terrariumPollenValueUpgrade2Level !== 'undefined') {
    window.terrariumPollenValueUpgrade2Level = save.terrariumPollenValueUpgrade2Level;
  }
  if (typeof save.terrariumFlowerValueUpgradeLevel !== 'undefined') {
    window.terrariumFlowerValueUpgradeLevel = save.terrariumFlowerValueUpgradeLevel;
  }
  if (typeof save.terrariumPollenToolSpeedUpgradeLevel !== 'undefined') {
    window.terrariumPollenToolSpeedUpgradeLevel = save.terrariumPollenToolSpeedUpgradeLevel;
  }
  if (typeof save.terrariumFlowerXPUpgradeLevel !== 'undefined') {
    window.terrariumFlowerXPUpgradeLevel = save.terrariumFlowerXPUpgradeLevel;
  }
  if (typeof save.terrariumExtraChargeUpgradeLevel !== 'undefined') {
    window.terrariumExtraChargeUpgradeLevel = save.terrariumExtraChargeUpgradeLevel;
  }
  if (typeof save.terrariumXpMultiplierUpgradeLevel !== 'undefined') {
    window.terrariumXpMultiplierUpgradeLevel = save.terrariumXpMultiplierUpgradeLevel;
  }
  if (typeof save.terrariumFlowerFieldExpansionUpgradeLevel !== 'undefined') {
    window.terrariumFlowerFieldExpansionUpgradeLevel = save.terrariumFlowerFieldExpansionUpgradeLevel; 
  }
  if (typeof save.terrariumFlowerUpgrade4Level !== 'undefined') {
    window.terrariumFlowerUpgrade4Level = save.terrariumFlowerUpgrade4Level; 
  }
  if (typeof save.terrariumFlowerUpgrade5Level !== 'undefined') {
    window.terrariumFlowerUpgrade5Level = save.terrariumFlowerUpgrade5Level; 
  }
  if (typeof save.terrariumNectar !== 'undefined') window.terrariumNectar = save.terrariumNectar;
        if (typeof save.nectarUpgradeLevel !== 'undefined') window.nectarUpgradeLevel = save.nectarUpgradeLevel;
        if (typeof save.nectarUpgradeCost !== 'undefined') window.nectarUpgradeCost = save.nectarUpgradeCost;
        if (typeof save.nectarizeMachineRepaired !== 'undefined') window.nectarizeMachineRepaired = save.nectarizeMachineRepaired;
        if (typeof save.nectarizeMachineLevel !== 'undefined') window.nectarizeMachineLevel = save.nectarizeMachineLevel;
        if (typeof save.nectarizeQuestActive !== 'undefined') window.nectarizeQuestActive = save.nectarizeQuestActive;
        if (typeof save.nectarizeQuestProgress !== 'undefined') window.nectarizeQuestProgress = save.nectarizeQuestProgress;
        if (typeof save.nectarizeQuestPermanentlyCompleted !== 'undefined') window.nectarizeQuestPermanentlyCompleted = save.nectarizeQuestPermanentlyCompleted;
        if (typeof save.hardModePermanentlyUnlocked !== 'undefined') window.hardModePermanentlyUnlocked = save.hardModePermanentlyUnlocked;
        if (typeof save.nectarizeQuestGivenBattery !== 'undefined') window.nectarizeQuestGivenBattery = save.nectarizeQuestGivenBattery;
        if (typeof save.nectarizeQuestGivenSparks !== 'undefined') window.nectarizeQuestGivenSparks = save.nectarizeQuestGivenSparks;
        if (typeof save.nectarizeQuestGivenPetals !== 'undefined') window.nectarizeQuestGivenPetals = save.nectarizeQuestGivenPetals;
        if (typeof save.nectarizeMilestones !== 'undefined') window.nectarizeMilestones = save.nectarizeMilestones;
        if (typeof save.nectarizeMilestoneLevel !== 'undefined') window.nectarizeMilestoneLevel = save.nectarizeMilestoneLevel;
        if (typeof save.nectarizeResets !== 'undefined') window.nectarizeResets = save.nectarizeResets;
        if (typeof save.nectarizeResetBonus !== 'undefined') window.nectarizeResetBonus = save.nectarizeResetBonus;
        if (typeof save.nectarizeTier !== 'undefined') window.nectarizeTier = save.nectarizeTier;
        if (typeof save.nectarizePostResetTokenRequirement !== 'undefined') window.nectarizePostResetTokenRequirement = save.nectarizePostResetTokenRequirement;
        if (typeof save.nectarizePostResetTokensGiven !== 'undefined') window.nectarizePostResetTokensGiven = save.nectarizePostResetTokensGiven;
        if (typeof save.nectarizePostResetTokenType !== 'undefined') window.nectarizePostResetTokenType = save.nectarizePostResetTokenType;
        if (typeof save.fluzzerTimeoutActive !== 'undefined') window.fluzzerTimeoutActive = save.fluzzerTimeoutActive;
        if (typeof save.fluzzerTimeoutEndTime !== 'undefined') window.fluzzerTimeoutEndTime = save.fluzzerTimeoutEndTime;
        if (typeof save.fluzzerClickTimestamps !== 'undefined') window.fluzzerClickTimestamps = save.fluzzerClickTimestamps;
        window.terrariumKpNectarUpgradeLevel = (typeof save.terrariumKpNectarUpgradeLevel !== 'undefined') ? save.terrariumKpNectarUpgradeLevel : 0;
        window.terrariumPollenFlowerNectarUpgradeLevel = (typeof save.terrariumPollenFlowerNectarUpgradeLevel !== 'undefined') ? save.terrariumPollenFlowerNectarUpgradeLevel : 0;
        window.terrariumNectarXpUpgradeLevel = (typeof save.terrariumNectarXpUpgradeLevel !== 'undefined') ? save.terrariumNectarXpUpgradeLevel : 0;
        window.terrariumNectarValueUpgradeLevel = (typeof save.terrariumNectarValueUpgradeLevel !== 'undefined') ? save.terrariumNectarValueUpgradeLevel : 0;
        window.terrariumNectarInfinityUpgradeLevel = (typeof save.terrariumNectarInfinityUpgradeLevel !== 'undefined') ? save.terrariumNectarInfinityUpgradeLevel : 0;
  if (typeof syncTerrariumUpgradeVarsFromWindow === 'function') {
    syncTerrariumUpgradeVarsFromWindow();
  }
  if (typeof window.syncTerrariumVarsFromWindow === 'function') {
    window.syncTerrariumVarsFromWindow();
  }
  applySettings();
  updateUI();
  updateKnowledgeUI();
  if (typeof updateGradeUI === 'function') updateGradeUI();
  if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
  if (typeof updateSwariaHungerUI === 'function') updateSwariaHungerUI();
  if (window.initPrism) {
    window.initPrism();
  }
  // Check for control center unlock
  checkControlCenterUnlock();
  if (boughtElements[7]) {
    const genBtn = document.getElementById("generatorSubTabBtn");
    if (window.currentFloor === 2) {
      genBtn.style.display = "none";
    } else {
      genBtn.style.display = "inline-block";
    }
    document.getElementById("subTabNav").style.display = "flex";
    if (currentHomeSubTab === 'generatorMainTab') {
      renderGenerators();
    }
  }
  if (boughtElements[8]) {
    document.getElementById("graduationSubTabBtn").style.display = "inline-block";
    document.getElementById("knowledgeSubTabNav").style.display = "flex";
    const gradTab = document.getElementById("graduationSubTab");
    if (gradTab) {
      if (typeof currentKnowledgeSubTab !== 'undefined' && currentKnowledgeSubTab === 'graduationSubTab') {
        gradTab.style.display = "block";
        switchKnowledgeSubTab('graduationSubTab');
      } else {
        gradTab.style.display = "none";
      }
    }
  }
  
  // Check for infinity research unlock
  checkInfinityResearchUnlock();
  if (save.generatorsUnlocked && Array.isArray(save.generatorsUnlocked)) {
    save.generatorsUnlocked.forEach((unlocked, idx) => {
      if (generators[idx]) generators[idx].unlocked = unlocked;
    });
    if (typeof window.trackGeneratorUnlocks === 'function') {
      window.trackGeneratorUnlocks();
    }
  }
  if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
  if (typeof window.initializeChargerElementUnlocking === 'function') {
    window.initializeChargerElementUnlocking();
  }
  applySettings();
  updateUI();
  updateKnowledgeUI();
  if (typeof updateGradeUI === 'function') updateGradeUI();
  if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
  if (window.initPrism) {
    window.initPrism();
  }
  window.kitchenIngredients = save.kitchenIngredients || {};
  // Convert kitchen ingredients back to Decimal objects
  for (const [key, value] of Object.entries(window.kitchenIngredients)) {
    if (typeof value === 'string' && value !== '') {
      window.kitchenIngredients[key] = new Decimal(value);
    } else if (typeof value === 'number') {
      window.kitchenIngredients[key] = new Decimal(value);
    }
  }
  ['mushroom', 'sparks', 'berries', 'petals', 'water', 'prisma', 'stardust', 'swabucks', 'berryPlate', 'batteries', 'glitteringPetals', 'chargedPrisma', 'mushroomSoup'].forEach(type => {
    if (!DecimalUtils.isDecimal(window.kitchenIngredients[type])) {
      window.kitchenIngredients[type] = new Decimal(0);
    }
  });
  if (typeof updateKitchenUI === 'function') updateKitchenUI();
  if (!state.characterHunger) {
    state.characterHunger = {
      swaria: 100,
      soap: 100,
      fluzzer: 100,
      mystic: 100,
      vi: 100
    };
  }
  if (typeof save.berryPlate === 'number') window.state.berryPlate = save.berryPlate;
else window.state.berryPlate = 0;
if (typeof save.swabucks !== 'undefined') window.state.swabucks = new Decimal(save.swabucks || 0);
else window.state.swabucks = new Decimal(0);
  if (typeof save.mushroomSoup === 'number') window.state.mushroomSoup = save.mushroomSoup;
  else window.state.mushroomSoup = 0;
  if (typeof save.batteries === 'number') window.state.batteries = save.batteries;
  else window.state.batteries = 0;
  if (typeof save.glitteringPetals === 'number') window.state.glitteringPetals = save.glitteringPetals;
  else window.state.glitteringPetals = 0;
  if (typeof save.chargedPrisma === 'number') window.state.chargedPrisma = save.chargedPrisma;
  else window.state.chargedPrisma = 0;
  if (typeof save.mysticCookingSpeedBoost === 'number') window.state.mysticCookingSpeedBoost = save.mysticCookingSpeedBoost;
  else window.state.mysticCookingSpeedBoost = 0;
  if (typeof save.soapBatteryBoost === 'number') window.state.soapBatteryBoost = save.soapBatteryBoost;
  else window.state.soapBatteryBoost = 0;
  if (typeof save.fluzzerGlitteringPetalsBoost === 'number') window.state.fluzzerGlitteringPetalsBoost = save.fluzzerGlitteringPetalsBoost;
  else window.state.fluzzerGlitteringPetalsBoost = 0;
  if (typeof save.peachyHungerBoost === 'number') window.state.peachyHungerBoost = save.peachyHungerBoost;
  else window.state.peachyHungerBoost = 0;
  if (!state.lastBerryPlateTime) state.lastBerryPlateTime = Date.now();
  if (!state.lastHungerTick) state.lastHungerTick = Date.now();
  if (!state.berryPlateCookingProgress) state.berryPlateCookingProgress = 0;
  if (!state.swariaDesperateEatingTriggered) state.swariaDesperateEatingTriggered = false;
  if (!state.swariaSafetyRefillTriggered) state.swariaSafetyRefillTriggered = false;
  if (save.friendship) {
    window.friendship = save.friendship;
  } else if (!window.friendship) {
    window.friendship = {
      Cargo: { level: 0, points: 0 },
      Generator: { level: 0, points: 0 },
      Lab: { level: 0, points: 0 },
      Kitchen: { level: 0, points: 0 },
      Terrarium: { level: 0, points: 0 }
    };
  }
      if (save.berryCookingState) {
      localStorage.setItem('berryCookingState', save.berryCookingState);
    } else {
      localStorage.removeItem('berryCookingState');
    }
    if (typeof window.loadChargerState === 'function') {
      window.loadChargerState();
    }
    if (typeof window.saveChargerState === 'function') {
      window.saveChargerState();
    }
  if (typeof updateSwariaHungerUI === 'function') {
    updateSwariaHungerUI();
  }
  if (typeof save.hardModeQuestActive !== 'undefined') {
    state.hardModeQuestActive = save.hardModeQuestActive;
  }
  if (save.hardModeQuestProgress) {
    state.hardModeQuestProgress = {
      berryTokens: save.hardModeQuestProgress.berryTokens || 0,
      stardustTokens: save.hardModeQuestProgress.stardustTokens || 0,
      berryPlateTokens: save.hardModeQuestProgress.berryPlateTokens || 0,
      mushroomSoupTokens: save.hardModeQuestProgress.mushroomSoupTokens || 0,
      prismClicks: save.hardModeQuestProgress.prismClicks || 0,
      commonBoxes: save.hardModeQuestProgress.commonBoxes || 0,
      flowersWatered: save.hardModeQuestProgress.flowersWatered || 0,
      powerRefills: save.hardModeQuestProgress.powerRefills || 0,
      soapPokes: save.hardModeQuestProgress.soapPokes || 0,
      ingredientsCooked: save.hardModeQuestProgress.ingredientsCooked || 0
    };
  }
  if (typeof save.hardModeEnabled !== 'undefined') {
    window.hardModeEnabled = save.hardModeEnabled;
  } else {
    window.hardModeEnabled = true;
  }
  if (state.hardModeQuestActive && typeof updateHardModeQuestProgress === 'function') {
    updateHardModeQuestProgress();
  }
  if (typeof window.hardModeQuestActive !== 'undefined') {
    window.hardModeQuestActive = state.hardModeQuestActive;
  }
  if (typeof window.hardModeQuestProgress !== 'undefined') {
    window.hardModeQuestProgress = state.hardModeQuestProgress;
  }
  if (state.hardModeQuestActive && typeof window.updateHardModeQuestProgress === 'function') {
    setTimeout(() => {
      window.updateHardModeQuestProgress();
    }, 100);
  }
  if (typeof window.renderTerrariumUI === 'function') {
    if (typeof window.forceSyncFlowerUpgrade4 === 'function') {
      window.forceSyncFlowerUpgrade4();
    }
    if (typeof window.syncTerrariumUpgradeVarsFromWindow === 'function') {
      window.syncTerrariumUpgradeVarsFromWindow();
    }
    setTimeout(() => {
      window.renderTerrariumUI();
    }, 100);
  }
  if (typeof window.trackKPMilestone === 'function' && swariaKnowledge.kp > 0) {
    window.trackKPMilestone(swariaKnowledge.kp);
  }
  if (save.premiumState) {
    window.premiumState = save.premiumState;
    if (typeof window.savePremiumState === 'function') {
      window.savePremiumState(); 
    }
    if (typeof window.updatePremiumUI === 'function') {
      window.updatePremiumUI();
    }
  }
  if (save.intercomState) {
    window.intercomEventTriggered = save.intercomState.intercomEventTriggered || false;
  }
  if (save.boutiqueData && window.boutique) {
    window.boutique.loadData(save.boutiqueData);
  }
  if (save.frontDeskState) {
    if (!window.frontDeskState) window.frontDeskState = { employees: {}, totalHired: 0, initialized: false };
    window.frontDeskState.employees = save.frontDeskState.employees || {};
    window.frontDeskState.totalHired = save.frontDeskState.totalHired || 0;
    
    // Load our new front desk system data
    window.frontDeskState.availableWorkers = save.frontDeskState.availableWorkers || [];
    window.frontDeskState.assignedWorkers = save.frontDeskState.assignedWorkers || {};
    window.frontDeskState.unlockedSlots = save.frontDeskState.unlockedSlots || 1;
    window.frontDeskState.nextArrivalTime = save.frontDeskState.nextArrivalTime || 0;
    window.frontDeskState.isUnlocked = save.frontDeskState.isUnlocked || false;

    // Ensure all employees have state entries
    if (window.frontDeskEmployees) {
      window.frontDeskEmployees.forEach(employee => {
        if (!window.frontDeskState.employees[employee.id]) {
          window.frontDeskState.employees[employee.id] = {
            hired: false,
            hiredDate: null
          };
        }
      });
    }
  }
  
  // Trigger front desk to reload data after main save system loads
  if (window.frontDesk && typeof window.frontDesk.loadData === 'function') {
    window.frontDesk.loadData();

  }
  
  // Backwards compatibility: Grant infinity research unlock to players who already have infinity count >= 1
  try {
    const infinityUnlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
    if (!localStorage.getItem(infinityUnlockKey)) {
      let totalInfinityCount = 0;
      if (window.infinitySystem && typeof window.infinitySystem.getTotalInfinityCurrency === 'function') {
        totalInfinityCount = window.infinitySystem.getTotalInfinityCurrency();
      }
      
      if (totalInfinityCount >= 1) {
        localStorage.setItem(infinityUnlockKey, 'true');

      }
    }
  } catch (error) {

  }
  
  // Backwards compatibility: Grant control center unlock to players who already have KP or elements
  try {
    const controlCenterUnlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
    if (!localStorage.getItem(controlCenterUnlockKey) && 
        (state.seenFirstDeliveryStory || 
         (swariaKnowledge && swariaKnowledge.kp > 0) || 
         (boughtElements && Object.keys(boughtElements).length > 0))) {
      localStorage.setItem(controlCenterUnlockKey, 'true');

    }
  } catch (error) {

  }
  
  // Load infinity system data from main save
  if (save.infinityData && window.infinitySystem) {
    try {
      // Restore infinity counts
      if (save.infinityData.counts) {
        window.infinitySystem.counts = { ...window.infinitySystem.counts, ...save.infinityData.counts };
      }
      
      // Restore ever reached tracking
      if (save.infinityData.everReached) {
        window.infinitySystem.everReached = { ...window.infinitySystem.everReached, ...save.infinityData.everReached };
      }
      
      // Restore infinity points and theorems
      if (save.infinityData.infinityPoints) {
        window.infinitySystem.infinityPoints = new Decimal(save.infinityData.infinityPoints);
      }
      
      if (typeof save.infinityData.infinityTheorems === 'number') {
        window.infinitySystem.infinityTheorems = save.infinityData.infinityTheorems;
      }
      
      if (typeof save.infinityData.totalInfinityTheorems === 'number') {
        window.infinitySystem.totalInfinityTheorems = save.infinityData.totalInfinityTheorems;
      }
      
      if (save.infinityData.theoremProgress) {
        window.infinitySystem.theoremProgress = new Decimal(save.infinityData.theoremProgress);
      }
      
      if (typeof save.infinityData.totalInfinityEarned === 'number') {
        window.infinitySystem.totalInfinityEarned = save.infinityData.totalInfinityEarned;
      }
      
      if (typeof save.infinityData.lastInfinityPointsUpdate === 'number') {
        window.infinitySystem.lastInfinityPointsUpdate = save.infinityData.lastInfinityPointsUpdate;
      }

    } catch (error) {

    }
  }
  
  // Load infinity upgrades from main save
  if (save.infinityUpgrades) {
    window.infinityUpgrades = { ...window.infinityUpgrades, ...save.infinityUpgrades };

  }
  
  // Load infinity caps from main save
  if (save.infinityCaps) {
    window.infinityCaps = { ...window.infinityCaps, ...save.infinityCaps };

  }
  
  // Load infinity caps from save slot specific key (for backward compatibility)
  if (window.infinityCaps) {
    try {
      const infinityCapsKey = getSaveSlotSpecificKey('infinityCaps');
      const savedCaps = localStorage.getItem(infinityCapsKey);
      if (savedCaps) {
        const parsedCaps = JSON.parse(savedCaps);
        window.infinityCaps = { ...window.infinityCaps, ...parsedCaps };

      }
    } catch (error) {

    }
  }
  
  // Load advanced prism calibration state - only if the system is unlocked
  if (save.advancedPrismCalibration && window.advancedPrismState && window.advancedPrismState.unlocked) {
    try {
      // Load stable light values
      if (save.advancedPrismCalibration.stable) {
        const stableData = save.advancedPrismCalibration.stable;
        const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
        
        lightTypes.forEach(lightType => {
          if (stableData[lightType] !== undefined) {
            window.advancedPrismState.calibration.stable[lightType] = new Decimal(stableData[lightType]);
          }
        });
      }
      
      // Load nerf values
      if (save.advancedPrismCalibration.nerfs) {
        const nerfData = save.advancedPrismCalibration.nerfs;
        const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
        
        lightTypes.forEach(lightType => {
          if (nerfData[lightType] !== undefined) {
            window.advancedPrismState.calibration.nerfs[lightType] = new Decimal(nerfData[lightType]);
          }
        });
      }
      
      // Load total time accumulated
      if (save.advancedPrismCalibration.totalTimeAccumulated) {
        const timeData = save.advancedPrismCalibration.totalTimeAccumulated;
        const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
        
        lightTypes.forEach(lightType => {
          if (timeData[lightType] !== undefined) {
            window.advancedPrismState.calibration.totalTimeAccumulated[lightType] = timeData[lightType];
          }
        });
      }

    } catch (error) {

    }
  }
  
  // Load advanced prism lab clicks and image swap state - only if the system is unlocked
  if (save.advancedPrismState && window.advancedPrismState && window.advancedPrismState.unlocked) {
    try {
      if (save.advancedPrismState.labTabClicks !== undefined) {
        window.advancedPrismState.labTabClicks = save.advancedPrismState.labTabClicks;
      }
      
      if (save.advancedPrismState.hasCompletedLabClicks !== undefined) {
        window.advancedPrismState.hasCompletedLabClicks = save.advancedPrismState.hasCompletedLabClicks;
      }
      
      if (save.advancedPrismState.imagesSwapped !== undefined) {
        window.advancedPrismState.imagesSwapped = save.advancedPrismState.imagesSwapped;
      }
      
      if (save.advancedPrismState.hasShownLabDialogue !== undefined) {
        window.advancedPrismState.hasShownLabDialogue = save.advancedPrismState.hasShownLabDialogue;
      }

    } catch (error) {

    }
  }
  
  // Load infinity counts from save slot specific key
  if (window.infinitySystem && window.infinitySystem.counts) {
    initializeInfinityCountsForSlot();
  }
  
  // Clear unlock states for fresh saves first
  clearUnlockStatesForFreshSave();
  
  // Final check for infinity research unlock after loading
  checkInfinityResearchUnlock();
  
  // Final check for control center unlock after loading
  checkControlCenterUnlock();
  
  // Initialize infinity counts for current save slot
  if (typeof initializeInfinityCountsForSlot === 'function') {
    initializeInfinityCountsForSlot();
  }
  
  // Initialize advanced prism to restore prism core state after load
  if (typeof window.initAdvancedPrism === 'function') {
    window.initAdvancedPrism();
  }
  
  // Check for advanced prism unlock after loading state
  if (typeof window.checkAdvancedPrismUnlock === 'function') {
    window.checkAdvancedPrismUnlock();
  }
  
  // Check for pending story modals after loading (including infinity reset story)
  setTimeout(() => {
    if (typeof window.checkForPendingStoryModals === 'function') {
      window.checkForPendingStoryModals();
    }
  }, 1500);
}

let lastExportClickTime = 0;

function exportSave() {
  const currentTime = Date.now();
  if (currentTime - lastExportClickTime < 2000 && typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret3', 1);
  }
  lastExportClickTime = currentTime;
  const generatorSpeedUpgrades = {};
  const generatorSpeedMultipliers = {};
  const generatorUpgradeLevels = {};
  generators.forEach(gen => {
    generatorSpeedUpgrades[gen.reward] = gen.speedUpgrades || 0;
    generatorSpeedMultipliers[gen.reward] = gen.speedMultiplier || 1;
    generatorUpgradeLevels[gen.reward] = gen.upgrades || 0;
  });
  const stateCopy = { ...state };
  delete stateCopy.hardModeQuestProgress;
  delete stateCopy.hardModeQuestActive;
  delete stateCopy.soapChargeQuest;
  const save = {
    state: stateCopy,
    settings,
    swariaKnowledge,
    boughtElements,
    elementDiscoveryProgress: state.elementDiscoveryProgress || 0,
    permanentElementDiscovery: state.permanentElementDiscovery ? {
      highestGradeAchieved: state.permanentElementDiscovery.highestGradeAchieved || 1,
      permanentlyDiscoveredElements: Array.from(state.permanentElementDiscovery.permanentlyDiscoveredElements || [1, 2, 3, 4, 5, 6, 7, 8])
    } : {
      highestGradeAchieved: 1,
      permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    generatorUpgrades,
    prismState: window.prismState || {},
    generatorsUnlocked: generators.map(g => g.unlocked || false),
    generatorSpeedUpgrades,
    generatorSpeedMultipliers,
    generatorUpgradeLevels,
    chargerCharge: (window.charger && typeof window.charger.charge !== 'undefined') ? window.charger.charge : 0,
    chargerSoapState: (window.charger) ? {
      soapClickCount: window.charger.soapClickCount || 0,
      soapLastClickTime: window.charger.soapLastClickTime || 0,
      soapIsMad: window.charger.soapIsMad || false,
      soapIsTalking: window.charger.soapIsTalking || false,
      soapChargeEaten: window.charger.soapChargeEaten || 0,
      soapWillEatCharge: window.charger.soapWillEatCharge || false
    } : {},
    terrariumPollen: window.terrariumPollen || 0,
    terrariumFlowers: window.terrariumFlowers || 0,
    terrariumXP: window.terrariumXP || 0,
    terrariumLevel: window.terrariumLevel || 1,
    terrariumPollenValueUpgradeLevel: window.terrariumPollenValueUpgradeLevel || 0,
    terrariumPollenValueUpgrade2Level: window.terrariumPollenValueUpgrade2Level || 0,
    terrariumXpMultiplierUpgradeLevel: window.terrariumXpMultiplierUpgradeLevel || 0,
    terrariumFlowerFieldExpansionUpgradeLevel: window.terrariumFlowerFieldExpansionUpgradeLevel || 0,
    terrariumFlowerUpgrade4Level: window.terrariumFlowerUpgrade4Level || 0,
    terrariumFlowerValueUpgradeLevel: window.terrariumFlowerValueUpgradeLevel || 0,
    terrariumPollenToolSpeedUpgradeLevel: window.terrariumPollenToolSpeedUpgradeLevel || 0,
    terrariumFlowerXPUpgradeLevel: window.terrariumFlowerXPUpgradeLevel || 0,
    terrariumExtraChargeUpgradeLevel: window.terrariumExtraChargeUpgradeLevel || 0,
    terrariumNectar: window.terrariumNectar || 0,
    terrariumKpNectarUpgradeLevel: window.terrariumKpNectarUpgradeLevel || 0,
    terrariumPollenFlowerNectarUpgradeLevel: window.terrariumPollenFlowerNectarUpgradeLevel || 0,
    terrariumNectarXpUpgradeLevel: window.terrariumNectarXpUpgradeLevel || 0,
    terrariumNectarValueUpgradeLevel: window.terrariumNectarValueUpgradeLevel || 0,
    terrariumNectarInfinityUpgradeLevel: window.terrariumNectarInfinityUpgradeLevel || 0,
    nectarUpgradeLevel: window.nectarUpgradeLevel || 0,
    nectarUpgradeCost: window.nectarUpgradeCost || 100,
    nectarizeMachineRepaired: window.nectarizeMachineRepaired || false,
    nectarizeMachineLevel: window.nectarizeMachineLevel || 1,
    nectarizeQuestActive: window.nectarizeQuestActive || false,
    nectarizeQuestProgress: window.nectarizeQuestProgress || 0,
    nectarizeQuestPermanentlyCompleted: window.nectarizeQuestPermanentlyCompleted || false,
    hardModePermanentlyUnlocked: window.hardModePermanentlyUnlocked || false,
    nectarizeQuestGivenBattery: window.nectarizeQuestGivenBattery || 0,
    nectarizeQuestGivenSparks: window.nectarizeQuestGivenSparks || 0,
    nectarizeQuestGivenPetals: window.nectarizeQuestGivenPetals || 0,
    nectarizeMilestones: window.nectarizeMilestones || [],
    nectarizeMilestoneLevel: window.nectarizeMilestoneLevel || 0,
    nectarizeResets: window.nectarizeResets || 0,
    nectarizeResetBonus: window.nectarizeResetBonus || 0,
    nectarizeTier: window.nectarizeTier || 0,
    nectarizePostResetTokenRequirement: window.nectarizePostResetTokenRequirement || 0,
    nectarizePostResetTokensGiven: window.nectarizePostResetTokensGiven || 0,
    nectarizePostResetTokenType: window.nectarizePostResetTokenType || 'petals',
    kitchenIngredients: (() => {
      const serialized = {};
      for (const [key, value] of Object.entries(window.kitchenIngredients || {})) {
        if (DecimalUtils.isDecimal(value)) {
          serialized[key] = value.toString();
        } else {
          serialized[key] = value;
        }
      }
      return serialized;
    })(),
    friendship: window.friendship || {},
    berryCookingState: localStorage.getItem('berryCookingState') || null,
    swabucks: (window.state && window.state.swabucks) ? window.state.swabucks.toString() : "0",
    berryPlate: (window.state && typeof window.state.berryPlate === 'number') ? window.state.berryPlate : 0,
    mushroomSoup: (window.state && typeof window.state.mushroomSoup === 'number') ? window.state.mushroomSoup : 0,
    batteries: (window.state && typeof window.state.batteries === 'number') ? window.state.batteries : 0,
    glitteringPetals: (window.state && typeof window.state.glitteringPetals === 'number') ? window.state.glitteringPetals : 0,
    chargedPrisma: (window.state && typeof window.state.chargedPrisma === 'number') ? window.state.chargedPrisma : 0,
    mysticCookingSpeedBoost: (window.state && typeof window.state.mysticCookingSpeedBoost === 'number') ? window.state.mysticCookingSpeedBoost : 0,
    soapBatteryBoost: (window.state && typeof window.state.soapBatteryBoost === 'number') ? window.state.soapBatteryBoost : 0,
    fluzzerGlitteringPetalsBoost: (window.state && typeof window.state.fluzzerGlitteringPetalsBoost === 'number') ? window.state.fluzzerGlitteringPetalsBoost : 0,
    peachyHungerBoost: (window.state && typeof window.state.peachyHungerBoost === 'number') ? window.state.peachyHungerBoost : 0,
    chargerState: {
      charge: window.charger ? window.charger.charge : 0,
      milestones: window.charger ? window.charger.milestones.map(ms => ({ unlocked: ms.unlocked })) : [],
      milestoneQuests: window.charger ? window.charger.milestoneQuests : null,
      questStage: window.state && window.state.soapChargeQuest ? window.state.soapChargeQuest.stage : 0
    },
    hardModeQuestActive: state.hardModeQuestActive || false,
    hardModeQuestProgress: state.hardModeQuestProgress || {
      berryTokens: 0,
      stardustTokens: 0,
      berryPlateTokens: 0,
      mushroomSoupTokens: 0,
      prismClicks: 0,
      commonBoxes: 0,
      flowersWatered: 0,
      powerRefills: 0,
      soapPokes: 0,
      ingredientsCooked: 0
    },
    soapChargeQuest: state.soapChargeQuest || { stage: 0, initialized: true },
    hardModeEnabled: window.hardModeEnabled || false,
    intercomState: {
      intercomEventTriggered: (window.intercomEventTriggered !== undefined) ? window.intercomEventTriggered : false
    },
    achievementData: (() => {
      const currentSaveSlot = localStorage.getItem('currentSaveSlot');
      const saveKey = currentSaveSlot ? `fluffIncAchievementsSlot${currentSaveSlot}` : 'fluffIncAchievements';
      const saved = localStorage.getItem(saveKey);
      return saved ? JSON.parse(saved) : null;
    })(),
    secretAchievementData: (() => {
      const currentSaveSlot = localStorage.getItem('currentSaveSlot');
      const saveKey = currentSaveSlot ? `fluffIncSecretAchievementsSlot${currentSaveSlot}` : 'fluffIncSecretAchievements';
      const saved = localStorage.getItem(saveKey);
      return saved ? JSON.parse(saved) : null;
    })(),
    infinityTreeData: window.infinitySystem ? {
      infinityPoints: window.infinitySystem.infinityPoints.toString(),
      infinityTheorems: window.infinitySystem.infinityTheorems,
      totalInfinityTheorems: window.infinitySystem.totalInfinityTheorems,
      theoremProgress: window.infinitySystem.theoremProgress.toString(),
      totalInfinityEarned: window.infinitySystem.totalInfinityEarned,
      upgrades: window.infinityUpgrades ? window.infinityUpgrades : {},
      everReached: window.infinitySystem.everReached || {},
      caps: window.infinityCaps || {}
    } : {
      infinityPoints: "0",
      infinityTheorems: 0,
      totalInfinityTheorems: 0,
      theoremProgress: "0",
      totalInfinityEarned: 0,
      upgrades: {},
      everReached: {},
      caps: {}
    },
    infinityChallengeData: (typeof window.infinityChallenges !== 'undefined' && typeof window.activeChallenge !== 'undefined' && typeof window.activeDifficulty !== 'undefined') ? {
      challenges: window.infinityChallenges,
      activeChallenge: window.activeChallenge,
      activeDifficulty: window.activeDifficulty
    } : {
      challenges: {},
      activeChallenge: 0,
      activeDifficulty: 0
    },
    frontDeskState: window.frontDeskState ? {
      employees: window.frontDeskState.employees || {},
      totalHired: window.frontDeskState.totalHired || 0
    } : { employees: {}, totalHired: 0 }
  };
  
  // Use DecimalUtils to serialize the save data for export
  const serializedSave = DecimalUtils.serializeGameState(save);
  const saveData = btoa(unescape(encodeURIComponent(JSON.stringify(serializedSave))));
  navigator.clipboard.writeText(saveData).then(() => alert("Copied to clipboard"));
  if (typeof window.saveChargerState === 'function') {
    window.saveChargerState();
  }
}

function importSave() {
  const input = prompt("Paste your save data here:");
  if (!input) return;
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    const rawSave = JSON.parse(decoded);
    
    // Use DecimalUtils to deserialize the imported save data
    const save = DecimalUtils.deserializeGameState(rawSave);
    
    if (save.state) Object.assign(state, save.state);
    
    // Ensure state.grade is a Decimal
    if (typeof state.grade !== 'undefined' && !DecimalUtils.isDecimal(state.grade)) {
      state.grade = new Decimal(state.grade);
    }
    
    if (!state.characterHunger) state.characterHunger = {};
    if (typeof state.characterHunger.swaria !== 'number') state.characterHunger.swaria = 100;
    if (typeof state.characterHunger.soap !== 'number') state.characterHunger.soap = 100;
    if (typeof state.characterHunger.fluzzer !== 'number') state.characterHunger.fluzzer = 100;
    if (typeof state.characterHunger.mystic !== 'number') state.characterHunger.mystic = 100;
    if (typeof state.characterHunger.vi !== 'number') state.characterHunger.vi = 100;
    if (save.settings) Object.assign(settings, save.settings);
    if (save.swariaKnowledge) Object.assign(swariaKnowledge, save.swariaKnowledge);
    boughtElements = save.boughtElements || {};
    
    // Re-apply all purchased element effects properly
    recalculateAllElementEffects();
    
    // Update prism navigation immediately after loading elements
    updatePrismAdvancedButtonVisibility();
    
    generatorUpgrades = save.generatorUpgrades || {};
    
    // Convert to Decimal objects for consistency
    Object.keys(generatorUpgrades).forEach(key => {
      if (!DecimalUtils.isDecimal(generatorUpgrades[key])) {
        generatorUpgrades[key] = new Decimal(generatorUpgrades[key] || 0);
      }
    });
    
    // Keep window reference synced
    window.generatorUpgrades = generatorUpgrades;
    if (save.elementDiscoveryProgress !== undefined) {
      state.elementDiscoveryProgress = save.elementDiscoveryProgress;
    }
    
    // Load permanent element discovery data
    if (save.permanentElementDiscovery !== undefined) {
      state.permanentElementDiscovery = {
        highestGradeAchieved: save.permanentElementDiscovery.highestGradeAchieved || 1,
        permanentlyDiscoveredElements: new Set(save.permanentElementDiscovery.permanentlyDiscoveredElements || [1, 2, 3, 4, 5, 6, 7, 8])
      };
    } else if (!state.permanentElementDiscovery) {
      // Initialize if not present
      state.permanentElementDiscovery = {
        highestGradeAchieved: 1,
        permanentlyDiscoveredElements: new Set([1, 2, 3, 4, 5, 6, 7, 8])
      };
    }
    
    if (typeof window.trackElementDiscovery === 'function' && boughtElements) {
      window.trackElementDiscovery(boughtElements);
    }
    if (typeof window.trackChargeMilestone === 'function' && window.charger && window.charger.charge > 0) {
      window.trackChargeMilestone(window.charger.charge);
    }
    if (typeof window.trackFluffMilestone === 'function' && state.fluff > 0) {
      window.trackFluffMilestone(state.fluff);
    }
    if (typeof window.trackFlowerMilestone === 'function' && window.terrariumFlowers > 0) {
      window.trackFlowerMilestone(window.terrariumFlowers);
    }
    if (typeof window.trackKPMilestone === 'function' && swariaKnowledge.kp > 0) {
      window.trackKPMilestone(swariaKnowledge.kp);
    }
    
    // Check for infinity research unlock
    checkInfinityResearchUnlock();
    if (save.generatorsUnlocked && Array.isArray(save.generatorsUnlocked)) {
      save.generatorsUnlocked.forEach((unlocked, idx) => {
        if (generators[idx]) generators[idx].unlocked = unlocked;
      });
      if (typeof window.trackGeneratorUnlocks === 'function') {
        window.trackGeneratorUnlocks();
      }
    }
    if (save.generatorSpeedUpgrades || save.generatorSpeedMultipliers || save.generatorUpgradeLevels) {
      generators.forEach(gen => {
        gen.speedUpgrades = (save.generatorSpeedUpgrades && save.generatorSpeedUpgrades[gen.reward]) || 0;
        gen.speedMultiplier = (save.generatorSpeedMultipliers && save.generatorSpeedMultipliers[gen.reward]) || 1;
        gen.upgrades = (save.generatorUpgradeLevels && save.generatorUpgradeLevels[gen.reward]) || 0;
        gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades) * (gen.speedMultiplier || 1);
      });
    } else {
      generators.forEach(gen => {
        gen.speedUpgrades = 0;
        gen.speedMultiplier = 1;
        gen.upgrades = 0;
        gen.speed = gen.baseSpeed;
      });
    }
    generators.forEach(gen => {
      gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades || 0) * (gen.speedMultiplier || 1);
    });
    if (save.prismState && window.prismState) {
      // Convert saved values to Decimals to maintain precision
      const decimalProps = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight', 
                           'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                           'greenlightparticle', 'bluelightparticle'];
      
      for (const prop in save.prismState) {
        if (decimalProps.includes(prop)) {
          window.prismState[prop] = new Decimal(save.prismState[prop] || 0);
        } else {
          window.prismState[prop] = save.prismState[prop];
        }
      }
      
      if (typeof window.trackRedLightParticleGeneration === 'function' && window.prismState.generatorUnlocked && window.prismState.generatorUnlocked.redlight) {
        window.trackRedLightParticleGeneration();
      }
    }
    if (!state.boxesProduced) state.boxesProduced = 0;
    if (!state.boxesProducedByType) {
      state.boxesProducedByType = {
        common: new Decimal(0),
        uncommon: new Decimal(0),
        rare: new Decimal(0),
        legendary: new Decimal(0),
        mythic: new Decimal(0)
      };
    }
    if (!state.powerEnergy) state.powerEnergy = new Decimal(100);
    if (!state.powerMaxEnergy) state.powerMaxEnergy = calculatePowerGeneratorCap();
    if (!state.powerStatus) state.powerStatus = 'online';
    if (!state.powerLastTick) state.powerLastTick = Date.now();
    applySettings();
    updateUI();
    updateKnowledgeUI();
    updatePrismAdvancedButtonVisibility(); // Update prism navigation after loading
    if (typeof updateGradeUI === 'function') updateGradeUI();
    if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
    if (window.initPrism) window.initPrism();
    // Update prism navigation after prism initialization
    updatePrismAdvancedButtonVisibility();
    // Check for control center unlock
    checkControlCenterUnlock();
    if (boughtElements[7]) {
      const genBtn = document.getElementById("generatorSubTabBtn");
      if (window.currentFloor === 2) {
        genBtn.style.display = "none";
      } else {
        genBtn.style.display = "inline-block";
      }
      document.getElementById("subTabNav").style.display = "flex";
    }
    if (boughtElements[8]) {
      document.getElementById("graduationSubTabBtn").style.display = "inline-block";
      document.getElementById("knowledgeSubTabNav").style.display = "flex";
      const gradTab = document.getElementById("graduationSubTab");
      if (gradTab) {
        if (typeof currentKnowledgeSubTab !== 'undefined' && currentKnowledgeSubTab === 'graduationSubTab') {
          gradTab.style.display = "block";
          switchKnowledgeSubTab('graduationSubTab');
        } else {
          gradTab.style.display = "none";
        }
      }
    }
    if (typeof updatePowerEnergyStatusUI === 'function') updatePowerEnergyStatusUI();
    if (typeof updateGlobalBlackoutOverlay === 'function') updateGlobalBlackoutOverlay();
    if (typeof updateGlobalDimOverlay === 'function') updateGlobalDimOverlay();
    if (save.achievementData) {
      const currentSaveSlot = localStorage.getItem('currentSaveSlot');
      const saveKey = currentSaveSlot ? `fluffIncAchievementsSlot${currentSaveSlot}` : 'fluffIncAchievements';
      localStorage.setItem(saveKey, JSON.stringify(save.achievementData));
    }
    if (save.secretAchievementData) {
      const currentSaveSlot = localStorage.getItem('currentSaveSlot');
      const saveKey = currentSaveSlot ? `fluffIncSecretAchievementsSlot${currentSaveSlot}` : 'fluffIncSecretAchievements';
      localStorage.setItem(saveKey, JSON.stringify(save.secretAchievementData));
    }
    if (typeof window.reloadAchievementsForSlot === 'function') {
      window.reloadAchievementsForSlot();
    }
    if (currentHomeSubTab === 'generatorMainTab' && typeof renderGenerators === 'function') {
      renderGenerators();
    }
    if (typeof updateGeneratorsUI === 'function') updateGeneratorsUI();
    if (window.charger && typeof save.chargerCharge !== 'undefined') {
      window.charger.charge = new Decimal(save.chargerCharge);
    }
    if (window.charger && save.chargerSoapState) {
      window.charger.soapClickCount = save.chargerSoapState.soapClickCount || 0;
      window.charger.soapLastClickTime = save.chargerSoapState.soapLastClickTime || 0;
      window.charger.soapIsMad = save.chargerSoapState.soapIsMad || false;
      window.charger.soapIsTalking = save.chargerSoapState.soapIsTalking || false;
      window.charger.soapChargeEaten = save.chargerSoapState.soapChargeEaten || 0;
      window.charger.soapWillEatCharge = save.chargerSoapState.soapWillEatCharge || false;
    }
    if (save.chargerState && window.charger) {
      window.charger.charge = new Decimal(save.chargerState.charge || 0);
      if (Array.isArray(save.chargerState.milestones)) {
        save.chargerState.milestones.forEach((ms, idx) => {
          if (idx < window.charger.milestones.length) {
            window.charger.milestones[idx].unlocked = ms.unlocked || false;
          }
        });
      }
      if (!window.charger.milestoneQuests) {
        window.charger.milestoneQuests = {
          3: { required: 10, given: 0, completed: false },
          4: { required: 15, given: 0, completed: false },
          5: { required: 25, given: 0, completed: false },
          6: { required: 50, given: 0, completed: false },
          7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 },
          8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }
        };
      }
      if (save.chargerState.milestoneQuests) {
        Object.entries(save.chargerState.milestoneQuests).forEach(([index, quest]) => {
          if (window.charger.milestoneQuests[index]) {
            window.charger.milestoneQuests[index].given = quest.given || 0;
            window.charger.milestoneQuests[index].completed = quest.completed || false;
            if ((index === '7' || index === '8') && typeof quest.batteryRequired !== 'undefined') {
              window.charger.milestoneQuests[index].batteryRequired = quest.batteryRequired;
            }
          }
        });
      }
      if (typeof save.chargerState.questStage !== 'undefined' && window.state) {
        if (!window.state.soapChargeQuest) {
          window.state.soapChargeQuest = { stage: save.chargerState.questStage, initialized: true };
        } else {
          window.state.soapChargeQuest.stage = save.chargerState.questStage;
          window.state.soapChargeQuest.initialized = true;
        }
      }
    }
    if (typeof save.terrariumPollen !== 'undefined') window.terrariumPollen = new Decimal(save.terrariumPollen || 0);
    if (typeof save.terrariumFlowers !== 'undefined') window.terrariumFlowers = new Decimal(save.terrariumFlowers || 0);
    if (typeof save.terrariumXP !== 'undefined') window.terrariumXP = new Decimal(save.terrariumXP || 0);
    if (typeof save.terrariumLevel !== 'undefined') window.terrariumLevel = save.terrariumLevel;
    if (typeof save.terrariumPollenValueUpgradeLevel !== 'undefined') {
      window.terrariumPollenValueUpgradeLevel = save.terrariumPollenValueUpgradeLevel;
    }
    if (typeof save.terrariumPollenValueUpgrade2Level !== 'undefined') {
      window.terrariumPollenValueUpgrade2Level = save.terrariumPollenValueUpgrade2Level;
    }
    if (typeof save.terrariumFlowerValueUpgradeLevel !== 'undefined') {
      window.terrariumFlowerValueUpgradeLevel = save.terrariumFlowerValueUpgradeLevel;
    }
    if (typeof save.terrariumPollenToolSpeedUpgradeLevel !== 'undefined') {
      window.terrariumPollenToolSpeedUpgradeLevel = save.terrariumPollenToolSpeedUpgradeLevel;
    }
    if (typeof save.terrariumFlowerXPUpgradeLevel !== 'undefined') {
      window.terrariumFlowerXPUpgradeLevel = save.terrariumFlowerXPUpgradeLevel;
    }
    if (typeof save.terrariumExtraChargeUpgradeLevel !== 'undefined') {
      window.terrariumExtraChargeUpgradeLevel = save.terrariumExtraChargeUpgradeLevel;
    }
    if (typeof save.terrariumXpMultiplierUpgradeLevel !== 'undefined') {
      window.terrariumXpMultiplierUpgradeLevel = save.terrariumXpMultiplierUpgradeLevel;
    }
    if (typeof save.terrariumFlowerFieldExpansionUpgradeLevel !== 'undefined') {
      window.terrariumFlowerFieldExpansionUpgradeLevel = save.terrariumFlowerFieldExpansionUpgradeLevel; 
    }
    if (typeof save.terrariumFlowerUpgrade4Level !== 'undefined') {
      window.terrariumFlowerUpgrade4Level = save.terrariumFlowerUpgrade4Level; 
    }
    if (typeof save.terrariumFlowerUpgrade5Level !== 'undefined') {
      window.terrariumFlowerUpgrade5Level = save.terrariumFlowerUpgrade5Level; 
    }
    if (typeof save.terrariumNectar !== 'undefined') window.terrariumNectar = save.terrariumNectar;
          if (typeof save.nectarUpgradeLevel !== 'undefined') window.nectarUpgradeLevel = save.nectarUpgradeLevel;
          if (typeof save.nectarUpgradeCost !== 'undefined') window.nectarUpgradeCost = save.nectarUpgradeCost;
          if (typeof save.nectarizeMachineRepaired !== 'undefined') window.nectarizeMachineRepaired = save.nectarizeMachineRepaired;
          if (typeof save.nectarizeMachineLevel !== 'undefined') window.nectarizeMachineLevel = save.nectarizeMachineLevel;
          if (typeof save.nectarizeQuestActive !== 'undefined') window.nectarizeQuestActive = save.nectarizeQuestActive;
          if (typeof save.nectarizeQuestProgress !== 'undefined') window.nectarizeQuestProgress = save.nectarizeQuestProgress;
          if (typeof save.nectarizeQuestPermanentlyCompleted !== 'undefined') window.nectarizeQuestPermanentlyCompleted = save.nectarizeQuestPermanentlyCompleted;
          if (typeof save.hardModePermanentlyUnlocked !== 'undefined') window.hardModePermanentlyUnlocked = save.hardModePermanentlyUnlocked;
          if (typeof save.nectarizeQuestGivenBattery !== 'undefined') window.nectarizeQuestGivenBattery = save.nectarizeQuestGivenBattery;
          if (typeof save.nectarizeQuestGivenSparks !== 'undefined') window.nectarizeQuestGivenSparks = save.nectarizeQuestGivenSparks;
          if (typeof save.nectarizeQuestGivenPetals !== 'undefined') window.nectarizeQuestGivenPetals = save.nectarizeQuestGivenPetals;
          if (typeof save.nectarizeMilestones !== 'undefined') window.nectarizeMilestones = save.nectarizeMilestones;
          if (typeof save.nectarizeMilestoneLevel !== 'undefined') window.nectarizeMilestoneLevel = save.nectarizeMilestoneLevel;
          if (typeof save.nectarizeResets !== 'undefined') window.nectarizeResets = save.nectarizeResets;
          if (typeof save.nectarizeResetBonus !== 'undefined') window.nectarizeResetBonus = save.nectarizeResetBonus;
          if (typeof save.nectarizeTier !== 'undefined') window.nectarizeTier = save.nectarizeTier;
          if (typeof save.fluzzerTimeoutActive !== 'undefined') window.fluzzerTimeoutActive = save.fluzzerTimeoutActive;
          if (typeof save.fluzzerTimeoutEndTime !== 'undefined') window.fluzzerTimeoutEndTime = save.fluzzerTimeoutEndTime;
          if (typeof save.fluzzerClickTimestamps !== 'undefined') window.fluzzerClickTimestamps = save.fluzzerClickTimestamps;
        window.terrariumKpNectarUpgradeLevel = (typeof save.terrariumKpNectarUpgradeLevel !== 'undefined') ? save.terrariumKpNectarUpgradeLevel : 0;
        window.terrariumPollenFlowerNectarUpgradeLevel = (typeof save.terrariumPollenFlowerNectarUpgradeLevel !== 'undefined') ? save.terrariumPollenFlowerNectarUpgradeLevel : 0;
        window.terrariumNectarXpUpgradeLevel = (typeof save.terrariumNectarXpUpgradeLevel !== 'undefined') ? save.terrariumNectarXpUpgradeLevel : 0;
        window.terrariumNectarValueUpgradeLevel = (typeof save.terrariumNectarValueUpgradeLevel !== 'undefined') ? save.terrariumNectarValueUpgradeLevel : 0;
        window.terrariumNectarInfinityUpgradeLevel = (typeof save.terrariumNectarInfinityUpgradeLevel !== 'undefined') ? save.terrariumNectarInfinityUpgradeLevel : 0;
    if (typeof syncTerrariumUpgradeVarsFromWindow === 'function') {
      syncTerrariumUpgradeVarsFromWindow();
    }
    applySettings();
    updateUI();
    updateKnowledgeUI();
    if (typeof updateGradeUI === 'function') updateGradeUI();
    if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
    if (window.initPrism) {
      window.initPrism();
    }
    // Check for control center unlock
    checkControlCenterUnlock();
    if (boughtElements[7]) {
      const genBtn = document.getElementById("generatorSubTabBtn");
      if (window.currentFloor === 2) {
        genBtn.style.display = "none";
      } else {
        genBtn.style.display = "inline-block";
      }
      document.getElementById("subTabNav").style.display = "flex";
    }
    if (boughtElements[8]) {
      document.getElementById("graduationSubTabBtn").style.display = "inline-block";
      document.getElementById("knowledgeSubTabNav").style.display = "flex";
      const gradTab = document.getElementById("graduationSubTab");
      if (gradTab) {
        if (typeof currentKnowledgeSubTab !== 'undefined' && currentKnowledgeSubTab === 'graduationSubTab') {
          gradTab.style.display = "block";
          switchKnowledgeSubTab('graduationSubTab');
        } else {
          gradTab.style.display = "none";
        }
      }
    }
    if (typeof updatePowerEnergyStatusUI === 'function') updatePowerEnergyStatusUI();
    if (typeof updateGlobalBlackoutOverlay === 'function') updateGlobalBlackoutOverlay();
    if (typeof updateGlobalDimOverlay === 'function') updateGlobalDimOverlay();
    if (currentHomeSubTab === 'generatorMainTab' && typeof renderGenerators === 'function') {
      renderGenerators();
    }
    if (typeof updateGeneratorsUI === 'function') updateGeneratorsUI();
    if (window.charger && typeof save.chargerCharge !== 'undefined') {
      window.charger.charge = new Decimal(save.chargerCharge);
    }
    if (window.charger && save.chargerSoapState) {
      window.charger.soapClickCount = save.chargerSoapState.soapClickCount || 0;
      window.charger.soapLastClickTime = save.chargerSoapState.soapLastClickTime || 0;
      window.charger.soapIsMad = save.chargerSoapState.soapIsMad || false;
      window.charger.soapIsTalking = save.chargerSoapState.soapIsTalking || false;
      window.charger.soapChargeEaten = save.chargerSoapState.soapChargeEaten || 0;
      window.charger.soapWillEatCharge = save.chargerSoapState.soapWillEatCharge || false;
    }
    if (save.chargerState && window.charger) {
      window.charger.charge = new Decimal(save.chargerState.charge || 0);
      if (Array.isArray(save.chargerState.milestones)) {
        save.chargerState.milestones.forEach((ms, idx) => {
          if (idx < window.charger.milestones.length) {
            window.charger.milestones[idx].unlocked = ms.unlocked || false;
          }
        });
      }
      if (!window.charger.milestoneQuests) {
        window.charger.milestoneQuests = {
          3: { required: 10, given: 0, completed: false },
          4: { required: 15, given: 0, completed: false },
          5: { required: 25, given: 0, completed: false },
          6: { required: 50, given: 0, completed: false },
          7: { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 },
          8: { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 }
        };
      }
      if (save.chargerState.milestoneQuests) {
        Object.entries(save.chargerState.milestoneQuests).forEach(([index, quest]) => {
          if (window.charger.milestoneQuests[index]) {
            window.charger.milestoneQuests[index].given = quest.given || 0;
            window.charger.milestoneQuests[index].completed = quest.completed || false;
            if ((index === '7' || index === '8') && typeof quest.batteryRequired !== 'undefined') {
              window.charger.milestoneQuests[index].batteryRequired = quest.batteryRequired;
            }
          }
        });
      }
      if (typeof save.chargerState.questStage !== 'undefined' && window.state) {
        if (!window.state.soapChargeQuest) {
          window.state.soapChargeQuest = { stage: save.chargerState.questStage, initialized: true };
        } else {
          window.state.soapChargeQuest.stage = save.chargerState.questStage;
          window.state.soapChargeQuest.initialized = true;
        }
      }
    }
    if (typeof save.terrariumPollen !== 'undefined') window.terrariumPollen = new Decimal(save.terrariumPollen || 0);
    if (typeof save.terrariumFlowers !== 'undefined') window.terrariumFlowers = new Decimal(save.terrariumFlowers || 0);
    if (typeof save.terrariumXP !== 'undefined') window.terrariumXP = new Decimal(save.terrariumXP || 0);
    if (typeof save.terrariumLevel !== 'undefined') window.terrariumLevel = save.terrariumLevel;
    if (typeof save.terrariumPollenValueUpgradeLevel !== 'undefined') {
      window.terrariumPollenValueUpgradeLevel = save.terrariumPollenValueUpgradeLevel;
    }
    if (typeof save.terrariumXpMultiplierUpgradeLevel !== 'undefined') {
      window.terrariumXpMultiplierUpgradeLevel = save.terrariumXpMultiplierUpgradeLevel;
    }
    if (typeof save.terrariumFlowerUpgrade4Level !== 'undefined') {
      window.terrariumFlowerUpgrade4Level = save.terrariumFlowerUpgrade4Level;
    }
    if (typeof save.terrariumFlowerValueUpgradeLevel !== 'undefined') {
      window.terrariumFlowerValueUpgradeLevel = save.terrariumFlowerValueUpgradeLevel;
    }
    if (typeof save.terrariumPollenToolSpeedUpgradeLevel !== 'undefined') {
      window.terrariumPollenToolSpeedUpgradeLevel = save.terrariumPollenToolSpeedUpgradeLevel;
    }
    if (typeof save.terrariumFlowerXPUpgradeLevel !== 'undefined') {
      window.terrariumFlowerXPUpgradeLevel = save.terrariumFlowerXPUpgradeLevel;
    }
    if (typeof save.hardModeQuestActive !== 'undefined') {
      state.hardModeQuestActive = save.hardModeQuestActive;
    }
    if (save.hardModeQuestProgress) {
      state.hardModeQuestProgress = {
        berryTokens: save.hardModeQuestProgress.berryTokens || 0,
        stardustTokens: save.hardModeQuestProgress.stardustTokens || 0,
        berryPlateTokens: save.hardModeQuestProgress.berryPlateTokens || 0,
        mushroomSoupTokens: save.hardModeQuestProgress.mushroomSoupTokens || 0,
        prismClicks: save.hardModeQuestProgress.prismClicks || 0,
        commonBoxes: save.hardModeQuestProgress.commonBoxes || 0,
        flowersWatered: save.hardModeQuestProgress.flowersWatered || 0,
        powerRefills: save.hardModeQuestProgress.powerRefills || 0,
        soapPokes: save.hardModeQuestProgress.soapPokes || 0,
        ingredientsCooked: save.hardModeQuestProgress.ingredientsCooked || 0
      };
    }
    if (typeof save.hardModeEnabled !== 'undefined') {
      window.hardModeEnabled = save.hardModeEnabled;
    } else {
      window.hardModeEnabled = true;
    }
    if (save.soapChargeQuest && window.state) {
      window.state.soapChargeQuest = {
        stage: save.soapChargeQuest.stage || 0,
        initialized: save.soapChargeQuest.initialized || true
      };
    }
    window.kitchenIngredients = save.kitchenIngredients || {};
    if (typeof updateKitchenUI === 'function') updateKitchenUI();
    if (typeof save.berryPlate === 'number') window.state.berryPlate = save.berryPlate;
    else window.state.berryPlate = 0;
    if (typeof save.mushroomSoup === 'number') window.state.mushroomSoup = save.mushroomSoup;
    else window.state.mushroomSoup = 0;
    if (typeof save.batteries === 'number') window.state.batteries = save.batteries;
    else window.state.batteries = 0;
    if (typeof save.glitteringPetals === 'number') window.state.glitteringPetals = save.glitteringPetals;
    else window.state.glitteringPetals = 0;
    if (typeof save.chargedPrisma === 'number') window.state.chargedPrisma = save.chargedPrisma;
    else window.state.chargedPrisma = 0;
    if (typeof save.swabucks !== 'undefined') window.state.swabucks = new Decimal(save.swabucks || 0);
    else window.state.swabucks = new Decimal(0);
    if (typeof save.mysticCookingSpeedBoost === 'number') window.state.mysticCookingSpeedBoost = save.mysticCookingSpeedBoost;
    else window.state.mysticCookingSpeedBoost = 0;
    if (typeof save.soapBatteryBoost === 'number') window.state.soapBatteryBoost = save.soapBatteryBoost;
    else window.state.soapBatteryBoost = 0;
    if (typeof save.fluzzerGlitteringPetalsBoost === 'number') window.state.fluzzerGlitteringPetalsBoost = save.fluzzerGlitteringPetalsBoost;
    else window.state.fluzzerGlitteringPetalsBoost = 0;
    if (typeof save.peachyHungerBoost === 'number') window.state.peachyHungerBoost = save.peachyHungerBoost;
    else window.state.peachyHungerBoost = 0;
    if (save.friendship) {
      window.friendship = save.friendship;
    } else if (!window.friendship) {
      window.friendship = {
        Cargo: { level: 0, points: 0 },
        Generator: { level: 0, points: 0 },
        Lab: { level: 0, points: 0 },
        Kitchen: { level: 0, points: 0 },
        Terrarium: { level: 0, points: 0 }
      };
    }
    if (save.berryCookingState) {
      localStorage.setItem('berryCookingState', save.berryCookingState);
    } else {
      localStorage.removeItem('berryCookingState');
    }
    if (typeof updateKitchenUI === 'function') updateKitchenUI();
    if (typeof renderTerrariumUI === 'function') renderTerrariumUI();
    if (typeof updateGradeUI === 'function') updateGradeUI();
    if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
    if (typeof syncTerrariumUpgradeVarsFromWindow === 'function') {
      syncTerrariumUpgradeVarsFromWindow();
    }
  if (typeof checkHardModeTabButtonVisibility === 'function') {
    checkHardModeTabButtonVisibility();
  }
  if (typeof window.syncTerrariumVarsFromWindow === 'function') {
    window.syncTerrariumVarsFromWindow();
  }
  if (save.intercomState) {
    window.intercomEventTriggered = save.intercomState.intercomEventTriggered || false;
    window.intercomEvent20Triggered = save.intercomState.intercomEvent20Triggered || false;
  }
  
  // Infinity data is now handled by the unified save slot system
  
  if (save.frontDeskState) {
    if (!window.frontDeskState) window.frontDeskState = { employees: {}, totalHired: 0, initialized: false };
    window.frontDeskState.employees = save.frontDeskState.employees || {};
    window.frontDeskState.totalHired = save.frontDeskState.totalHired || 0;
    
    // Load our new front desk system data
    window.frontDeskState.availableWorkers = save.frontDeskState.availableWorkers || [];
    window.frontDeskState.assignedWorkers = save.frontDeskState.assignedWorkers || {};
    window.frontDeskState.unlockedSlots = save.frontDeskState.unlockedSlots || 1;
    window.frontDeskState.nextArrivalTime = save.frontDeskState.nextArrivalTime || 0;
    window.frontDeskState.isUnlocked = save.frontDeskState.isUnlocked || false;

    // Ensure all employees have state entries
    if (window.frontDeskEmployees) {
      window.frontDeskEmployees.forEach(employee => {
        if (!window.frontDeskState.employees[employee.id]) {
          window.frontDeskState.employees[employee.id] = {
            hired: false,
            hiredDate: null
          };
        }
      });
    }
  }
  
  // Load infinity system data from imported save
  if (save.infinityData && window.infinitySystem) {
    try {
      // Restore infinity counts
      if (save.infinityData.counts) {
        window.infinitySystem.counts = { ...window.infinitySystem.counts, ...save.infinityData.counts };
      }
      
      // Restore ever reached tracking
      if (save.infinityData.everReached) {
        window.infinitySystem.everReached = { ...window.infinitySystem.everReached, ...save.infinityData.everReached };
      }
      
      // Restore infinity points and theorems
      if (save.infinityData.infinityPoints) {
        window.infinitySystem.infinityPoints = new Decimal(save.infinityData.infinityPoints);
      }
      
      if (typeof save.infinityData.infinityTheorems === 'number') {
        window.infinitySystem.infinityTheorems = save.infinityData.infinityTheorems;
      }
      
      if (typeof save.infinityData.totalInfinityTheorems === 'number') {
        window.infinitySystem.totalInfinityTheorems = save.infinityData.totalInfinityTheorems;
      }
      
      if (save.infinityData.theoremProgress) {
        window.infinitySystem.theoremProgress = new Decimal(save.infinityData.theoremProgress);
      }
      
      if (typeof save.infinityData.totalInfinityEarned === 'number') {
        window.infinitySystem.totalInfinityEarned = save.infinityData.totalInfinityEarned;
      }
      
      if (typeof save.infinityData.lastInfinityPointsUpdate === 'number') {
        window.infinitySystem.lastInfinityPointsUpdate = save.infinityData.lastInfinityPointsUpdate;
      }

    } catch (error) {

    }
  }
  
  // Load infinity upgrades from imported save
  if (save.infinityUpgrades) {
    window.infinityUpgrades = { ...window.infinityUpgrades, ...save.infinityUpgrades };

  }
  
  // Load infinity caps from imported save
  if (save.infinityCaps) {
    window.infinityCaps = { ...window.infinityCaps, ...save.infinityCaps };

  }
  
  // Load advanced prism calibration state from imported save - only if the system is unlocked
  if (save.advancedPrismCalibration && window.advancedPrismState && window.advancedPrismState.unlocked) {
    try {
      // Load stable light values
      if (save.advancedPrismCalibration.stable) {
        const stableData = save.advancedPrismCalibration.stable;
        const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
        
        lightTypes.forEach(lightType => {
          if (stableData[lightType] !== undefined) {
            window.advancedPrismState.calibration.stable[lightType] = new Decimal(stableData[lightType]);
          }
        });
      }
      
      // Load nerf values
      if (save.advancedPrismCalibration.nerfs) {
        const nerfData = save.advancedPrismCalibration.nerfs;
        const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
        
        lightTypes.forEach(lightType => {
          if (nerfData[lightType] !== undefined) {
            window.advancedPrismState.calibration.nerfs[lightType] = new Decimal(nerfData[lightType]);
          }
        });
      }
      
      // Load total time accumulated
      if (save.advancedPrismCalibration.totalTimeAccumulated) {
        const timeData = save.advancedPrismCalibration.totalTimeAccumulated;
        const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
        
        lightTypes.forEach(lightType => {
          if (timeData[lightType] !== undefined) {
            window.advancedPrismState.calibration.totalTimeAccumulated[lightType] = timeData[lightType];
          }
        });
      }

    } catch (error) {

    }
  }
  
  // Load advanced prism lab clicks and image swap state from imported save - only if the system is unlocked
  if (save.advancedPrismState && window.advancedPrismState && window.advancedPrismState.unlocked) {
    try {
      if (save.advancedPrismState.labTabClicks !== undefined) {
        window.advancedPrismState.labTabClicks = save.advancedPrismState.labTabClicks;
      }
      
      if (save.advancedPrismState.hasCompletedLabClicks !== undefined) {
        window.advancedPrismState.hasCompletedLabClicks = save.advancedPrismState.hasCompletedLabClicks;
      }
      
      if (save.advancedPrismState.imagesSwapped !== undefined) {
        window.advancedPrismState.imagesSwapped = save.advancedPrismState.imagesSwapped;
      }
      
      if (save.advancedPrismState.hasShownLabDialogue !== undefined) {
        window.advancedPrismState.hasShownLabDialogue = save.advancedPrismState.hasShownLabDialogue;
      }

    } catch (error) {

    }
  }
  
  // Check infinity research unlock after importing data
  if (typeof checkInfinityResearchUnlock === 'function') {
    checkInfinityResearchUnlock();
  }
  } catch (e) {
    alert("Invalid format.");
  }
}

document.querySelectorAll('.navBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const subTab = document.getElementById('subTabNavBar');
    if (targetId === 'home') {
      subTab.style.display = 'flex';
    } else {
      subTab.style.display = 'none';
    }
    
    // Always switch to elements sub-tab when Control Center is clicked
    if (targetId === 'knowledge') {
      switchKnowledgeSubTab('elementsMain');
    }
    
    // Initialize front desk when first opened
    if (targetId === 'frontdesk' && window.frontDesk) {
      window.frontDesk.renderUI();
    }
  });
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
    page.classList.remove('active');
  });
  const infinityTab = document.getElementById('infinityResearchSubTab');
  if (infinityTab && pageId !== 'knowledge') {
    infinityTab.style.display = 'none';
    infinityTab.classList.remove('active');
  }
  const pageToShow = document.getElementById(pageId);
  if (pageToShow) {
    pageToShow.style.display = 'block';
    pageToShow.classList.add('active');
  }
  document.body.classList.remove('generator-bg');
  document.documentElement.classList.remove('generator-bg');
  if (pageId === 'home') {
    const genMainTab = document.getElementById('generatorMainTab');
    if (genMainTab && genMainTab.style.display !== 'none') {
      document.body.classList.add('generator-bg');
      document.documentElement.classList.add('generator-bg');
    }
  }
  const homeSubTabBar = document.getElementById('subTabNavBar');
  const knowledgeSubTabBar = document.getElementById('knowledgeSubTabBar');
  const cafeteriaSubTabBar = document.getElementById('cafeteriaSubTabBar');
  const achievementsSubTabBar = document.getElementById('achievementsSubTabBar');
  if (pageId === 'home') {
    homeSubTabBar.style.display = 'flex';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    if (currentHomeSubTab === 'generatorMainTab') {
      setTimeout(() => {
        document.body.classList.add('generator-bg');
        document.documentElement.classList.add('generator-bg');
      }, 0);
    }
    if (currentHomeSubTab === 'prismSubTab') {
      document.body.classList.add('prism-bg-active');
      setupPrismShineEffect();
    }
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
  } else if (pageId === 'knowledge') {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'flex';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    if (currentKnowledgeSubTab === 'graduationSubTab') {
      document.body.classList.add('regal-bg');
      document.documentElement.classList.add('regal-bg');
    } else {
      document.body.classList.remove('regal-bg');
      document.documentElement.classList.remove('regal-bg');
    }
  } else if (pageId === 'settings') {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
  } else if (pageId === 'graduation') {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    document.body.classList.add('regal-bg');
    document.documentElement.classList.add('regal-bg');
  } else if (pageId === 'cafeteria') {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'flex';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
    if (window.cafeteria && window.cafeteria.isLunchTime()) {
      setTimeout(() => {
        if (typeof switchCafeteriaSubTab === 'function') {
          switchCafeteriaSubTab('cafeteriaMainSubTab');
        }
      }, 100);
    }
  } else if (pageId === 'frontdesk') {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
    
    // Initialize and render front desk UI when page is shown
    if (typeof window.frontDesk !== 'undefined' && window.frontDesk.renderUI) {
      setTimeout(() => {
        window.frontDesk.renderUI();
      }, 100);
    }
  } else if (pageId === 'achievements') {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'flex';
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
  } else {
    homeSubTabBar.style.display = 'none';
    knowledgeSubTabBar.style.display = 'none';
    if (cafeteriaSubTabBar) cafeteriaSubTabBar.style.display = 'none';
    if (achievementsSubTabBar) achievementsSubTabBar.style.display = 'none';
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
  }
  if (pageId !== 'home') {
    document.body.classList.remove('prism-bg-active');
  }
  document.querySelectorAll('#bottomNav .navBtn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.target === pageId) {
      btn.classList.add('active');
    }
  });
  if (pageId !== 'cafeteria' && window.cafeteria && window.cafeteria.onTabLeave) {
    window.cafeteria.onTabLeave();
  }
}

function switchHomeSubTab(subTabId) {
  currentHomeSubTab = subTabId;
  showPage('home');
  document.querySelectorAll('#homeSubTabs .sub-tab').forEach(tab => {
    tab.style.display = 'none';
  });
  const subTab = document.getElementById(subTabId);
  if (subTab) {
    subTab.style.display = 'block';
  }
  
  // Remove all background classes first
  document.body.classList.remove('generator-bg');
  document.documentElement.classList.remove('generator-bg');
  document.body.classList.remove('prism-bg-active');
  
  if (subTabId === 'generatorMainTab') {
    setTimeout(() => {
      document.body.classList.add('generator-bg');
      document.documentElement.classList.add('generator-bg');
      renderGenerators();
      if (typeof updateGeneratorsUI === 'function') {
        updateGeneratorsUI();
      }
      if (!state.seenGeneratorTabFirstTime) {
        state.seenGeneratorTabFirstTime = true;
        if (typeof saveGame === 'function') saveGame();
        showSoapFirstTimeMessage();
        if (window.daynight && typeof window.daynight.getTime === 'function') {
          const mins = window.daynight.getTime();
          const soapImg = document.getElementById("swariaGeneratorCharacter");
          if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
            window.isSoapSleeping = true;
            if (soapImg) soapImg.src = "assets/icons/soap sleeping.png";
            var soapSpeech = document.getElementById("swariaGeneratorSpeech");
            if (soapSpeech) soapSpeech.style.display = "none";
            if (typeof stopSoapRandomSpeechTimer === 'function') stopSoapRandomSpeechTimer();
          }
        }
      } else {
        if (window.daynight && typeof window.daynight.getTime === 'function') {
          const mins = window.daynight.getTime();
          if (!((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360))) {
            showSoapSpeech();
          }
        } else {
          showSoapSpeech();
        }
        if (window.daynight && typeof window.daynight.getTime === 'function') {
          const mins = window.daynight.getTime();
          const soapImg = document.getElementById("swariaGeneratorCharacter");
          if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
            window.isSoapSleeping = true;
            if (soapImg) soapImg.src = "assets/icons/soap sleeping.png";
            var soapSpeech = document.getElementById("swariaGeneratorSpeech");
            if (soapSpeech) soapSpeech.style.display = "none";
            if (typeof stopSoapRandomSpeechTimer === 'function') stopSoapRandomSpeechTimer();
          }
        }
      }
    }, 0);
  } else {
    const fixed = document.getElementById('powerGeneratorFixed');
    if (fixed) fixed.style.display = 'none';
  }
  const genMainTab = document.getElementById('generatorMainTab');
  if (subTabId === 'generatorMainTab') {
    if (genMainTab) {
      genMainTab.classList.add('generator-darkness');

      function updateCursorLight(e) {
        const x = e.clientX;
        const y = e.clientY;
        genMainTab.style.setProperty('--cursor-x', x + 'px');
        genMainTab.style.setProperty('--cursor-y', y + 'px');
      }

      window._genCursorLightHandler = updateCursorLight;
      window.addEventListener('mousemove', updateCursorLight);
      genMainTab.style.setProperty('--cursor-x', window.innerWidth/2 + 'px');
      genMainTab.style.setProperty('--cursor-y', window.innerHeight/2 + 'px');
    }
    
    // Set up generator sub-navigation
    setupGeneratorSubTabButtons();
  } else {
    if (genMainTab) {
      genMainTab.classList.remove('generator-darkness');
      genMainTab.style.removeProperty('--cursor-x');
      genMainTab.style.removeProperty('--cursor-y');
    }
    if (window._genCursorLightHandler) {
      window.removeEventListener('mousemove', window._genCursorLightHandler);
      window._genCursorLightHandler = null;
    }
  }
  document.querySelectorAll('#subTabNav button').forEach(btn => {
    btn.classList.remove('active');
  });
  const btn = document.querySelector(`#subTabNav button[onclick*="${subTabId}"]`);
  if (btn) {
    btn.classList.add('active');
  }
  if (subTabId === "prismSubTab" && window.initPrism) {
    // Add prism background
    document.body.classList.add('prism-bg-active');
    
    // Set up shine effect
    setupPrismShineEffect();
    
    // Check power and enable/disable prism grid accordingly
    if (typeof window.checkPrismGridPowerState === 'function') {
      window.checkPrismGridPowerState();
    }
    
    // Set up prism sub-navigation
    setupPrismSubTabButtons();
    window.initPrism();
    if (typeof window.updateAllLightCounters === 'function') {
      window.updateAllLightCounters();
    }
    if (typeof window.updateLightGeneratorButtons === 'function') {
      window.updateLightGeneratorButtons();
    }
    if (typeof window.enterPrismLab === 'function') {
      window.enterPrismLab();
    }
  } else if (subTabId !== "prismSubTab") {
    if (typeof window.leavePrismLab === 'function') {
      window.leavePrismLab();
    }
  }
  if (subTabId === "boutiqueSubTab" && window.boutique) {
    // Check if it's night time (22:00 - 6:00) - boutique should be closed
    const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
    })();
    
    if (isNightTime) {
      // Show a message that the boutique is closed during night hours
      if (window.state && window.state.swabucks) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px; z-index: 10000; text-align: center; font-size: 16px;';
        messageDiv.innerHTML = 'The boutique is closed during night hours (22:00 - 6:00).<br>Please come back during the day!';
        document.body.appendChild(messageDiv);
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
          }
        }, 3000);
      }
      return; // Don't open the boutique
    }
    
    // Initialize boutique when tab is opened
    window.boutique.renderBoutiqueUI();
    
    // Update currency display
    const swabucksDisplay = document.getElementById('boutique-swabucks-display');
    if (swabucksDisplay && window.state && window.state.swabucks) {
      const swabucks = window.state.swabucks;
      if (typeof swabucks.toString === 'function') {
        swabucksDisplay.textContent = swabucks.toString();
      } else {
        swabucksDisplay.textContent = swabucks.toString();
      }
    }
  }
}

// Set up generator sub-tab navigation buttons  
function setupGeneratorSubTabButtons() {
  const boxGenBtn = document.getElementById('generatorBoxGenBtn');
  const chargerBtn = document.getElementById('generatorChargerBtn');
  const boxGenArea = document.getElementById('generatorBoxGenArea');
  const chargerArea = document.getElementById('generatorChargerArea');
  
  // Check if player is in expansion 5 or above to show charger button
  const currentGrade = new Decimal(state && state.grade || 1).toNumber();
  const isChargerUnlocked = currentGrade >= 5;
  
  // Show/hide charger button based on expansion level
  if (chargerBtn) {
    chargerBtn.style.display = isChargerUnlocked ? 'inline-block' : 'none';
  }
  
  if (boxGenBtn && chargerBtn && boxGenArea && chargerArea) {
    boxGenBtn.onclick = function() {
      boxGenArea.style.display = 'block';
      chargerArea.style.display = 'none';
      boxGenBtn.classList.add('active');
      chargerBtn.classList.remove('active');
      currentGeneratorSubTab = 'boxGen';
      
      // Initialize generator rendering when switching to box gen
      if (typeof renderGenerators === 'function') {
        renderGenerators();
      }
      if (typeof updateGeneratorsUI === 'function') {
        updateGeneratorsUI();
      }
    };
    
    chargerBtn.onclick = function() {
      boxGenArea.style.display = 'none';
      chargerArea.style.display = 'block';
      chargerBtn.classList.add('active');
      boxGenBtn.classList.remove('active');
      currentGeneratorSubTab = 'charger';
      
      // Initialize charger when switching to charger area
      if (typeof updateChargerUI === 'function') {
        updateChargerUI();
      }
      
      // Initialize soap interactions for the charger area
      setTimeout(() => {
        if (typeof showSoapChargerSpeech === 'function') {
          showSoapChargerSpeech();
        }
        const soapImg = document.getElementById("soapChargerCharacter");
        if (soapImg && typeof showSoapChargerClickMessage === 'function') {
          soapImg.onclick = showSoapChargerClickMessage;
          soapImg.style.cursor = "pointer";
        }
      }, 100);
    };
    
    // Set default active state (box generators always visible)
    boxGenBtn.classList.add('active');
    if (isChargerUnlocked) {
      chargerBtn.classList.remove('active');
    }
    
    // Ensure box generators area is visible by default
    boxGenArea.style.display = 'block';
    chargerArea.style.display = 'none';
  }
}

// Helper function to switch to the charger area specifically
function switchToChargerArea() {
  switchHomeSubTab('generatorMainTab');
  setTimeout(() => {
    const chargerBtn = document.getElementById('generatorChargerBtn');
    if (chargerBtn) {
      chargerBtn.click();
    }
  }, 50);
}

// Helper function to switch to the box generator area specifically  
function switchToBoxGeneratorArea() {
  switchHomeSubTab('generatorMainTab');
  setTimeout(() => {
    const boxGenBtn = document.getElementById('generatorBoxGenBtn');
    if (boxGenBtn) {
      boxGenBtn.click();
    }
  }, 50);
}

// Make them available globally
window.switchToChargerArea = switchToChargerArea;
window.switchToBoxGeneratorArea = switchToBoxGeneratorArea;

// Setup prism sub-navigation
let currentPrismSubTab = 'main'; // Track which prism sub-area is active
window.currentPrismSubTab = currentPrismSubTab; // Make it globally accessible

function setupPrismSubTabButtons() {
  const mainBtn = document.getElementById('prismMainBtn');
  const advancedBtn = document.getElementById('prismAdvancedBtn');
  const mainArea = document.getElementById('prismMainArea');
  const advancedArea = document.getElementById('prismAdvancedArea');
  
  if (mainBtn && advancedBtn && mainArea && advancedArea) {
    mainBtn.onclick = function() {
      mainArea.style.display = 'block';
      advancedArea.style.display = 'none';
      mainBtn.classList.add('active');
      advancedBtn.classList.remove('active');
      currentPrismSubTab = 'main';
      window.currentPrismSubTab = 'main';
      
      // Stop Vi's random speech timer when leaving advanced prism tab
      if (typeof window.stopViRandomSpeechTimer === 'function') {
        window.stopViRandomSpeechTimer();
      }
    };
    
    advancedBtn.onclick = function() {
      mainArea.style.display = 'none';
      advancedArea.style.display = 'block';
      advancedBtn.classList.add('active');
      mainBtn.classList.remove('active');
      currentPrismSubTab = 'advanced';
      window.currentPrismSubTab = 'advanced';
      
      // Hide Vi's speech bubble if it's currently visible
      const viSpeechBubble = document.getElementById('viSpeechBubble');
      if (viSpeechBubble) {
        viSpeechBubble.style.display = 'none';
      }
      // Also clear any pending timeout
      if (window.viSpeechTimeout) {
        clearTimeout(window.viSpeechTimeout);
      }
    };
    
    // Set default active state (main prism area)
    mainBtn.classList.add('active');
    advancedBtn.classList.remove('active');
    
    // Ensure window property is set to default state
    currentPrismSubTab = 'main';
    window.currentPrismSubTab = 'main';
    
    // Check if element 25 is bought and show/hide advanced button accordingly
    updatePrismAdvancedButtonVisibility();
  }
}

// Function to set up prism shine effect
function setupPrismShineEffect() {
  const prismSubTab = document.getElementById('prismSubTab');
  if (!prismSubTab) return;
  
  // Clean up existing listeners first
  if (prismSubTab._shineHandler) {
    prismSubTab.removeEventListener('mousemove', prismSubTab._shineHandler);
    prismSubTab._shineHandler = null;
  }
  
  function updateShine(e) {
    const rect = prismSubTab.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Calculate normalized position across the entire prism area (0 to 1)
    const normalizedX = Math.max(0, Math.min(1, mouseX / rect.width));
    
    // Get all cards in the prism area
    const cards = document.querySelectorAll('.prism-top-row .card');
    
    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      
      // Calculate shine position based on normalized mouse position
      // Map the 0-1 range to the card's shine movement range
      const maxShineX = cardRect.width * 0.4; // Allow 40% of card width movement
      const shineX = (normalizedX - 0.5) * 2 * maxShineX; // Convert 0-1 to -maxShineX to +maxShineX
      
      // Set CSS custom properties - only X movement, Y stays at 0
      card.style.setProperty('--shine-x', `${shineX}px`);
      card.style.setProperty('--shine-y', '0px');
    });
  }
  
  // Remove the resetShine function call on mouse leave
  // The shine will stay in its last position
  
  // Add event listeners
  prismSubTab._shineHandler = updateShine;
  prismSubTab.addEventListener('mousemove', updateShine);
  // Removed mouseleave event listener to prevent resetting
}

// Function to update the visibility of the Advanced Lab button based on element 25
function updatePrismAdvancedButtonVisibility() {
  const advancedBtn = document.getElementById('prismAdvancedBtn');






  if (advancedBtn) {
    // Advanced prism requires seeing the element 25 story modal first
    const element25Bought = window.boughtElements && (window.boughtElements[25] || window.boughtElements["25"]);
    const storyModalSeen = window.state && window.state.seenElement25StoryModal;
    const shouldShow = (window.prismAdvancedLabUnlocked || element25Bought) && storyModalSeen;



    if (shouldShow) {

      advancedBtn.style.display = 'inline-block';
      
      // If element 25 was bought, story modal seen, and permanent flag isn't set, set it now
      if (element25Bought && storyModalSeen && !window.prismAdvancedLabUnlocked) {

        window.prismAdvancedLabUnlocked = true;
        // Auto-save to preserve the permanent unlock
        if (typeof saveGame === 'function') {
          saveGame();
        }
      }
    } else {

      advancedBtn.style.display = 'none';
      // If advanced tab was active and it's not unlocked, switch to main
      if (currentPrismSubTab === 'advanced') {
        const mainBtn = document.getElementById('prismMainBtn');
        if (mainBtn) {
          mainBtn.click();
        }
      }
    }
  } else {

  }
}

// Helper functions to switch to specific prism areas
function switchToPrismMain() {
  switchHomeSubTab('prismSubTab');
  setTimeout(() => {
    const mainBtn = document.getElementById('prismMainBtn');
    if (mainBtn) {
      mainBtn.click();
    }
  }, 50);
}

function switchToPrismAdvanced() {
  switchHomeSubTab('prismSubTab');
  setTimeout(() => {
    const advancedBtn = document.getElementById('prismAdvancedBtn');
    if (advancedBtn && advancedBtn.style.display !== 'none') {
      advancedBtn.click();
    }
  }, 50);
}

// Make them available globally
window.switchToPrismMain = switchToPrismMain;
window.switchToPrismAdvanced = switchToPrismAdvanced;
window.setupPrismSubTabButtons = setupPrismSubTabButtons;
window.updatePrismAdvancedButtonVisibility = updatePrismAdvancedButtonVisibility;

// Debug function to check the current prism tab state
window.debugPrismTabState = function() {


  const advancedBtn = document.getElementById('prismAdvancedBtn');
  const mainBtn = document.getElementById('prismMainBtn');


};

// Debug function to manually test prism button
window.debugPrismButton = function() {




  updatePrismAdvancedButtonVisibility();

};

// Force show function for testing
window.forceShowPrismAdvanced = function() {
  const btn = document.getElementById('prismAdvancedBtn');
  if (btn) {
    btn.style.display = 'inline-block';

  } else {

  }
};

// Debug function to manually set element 25 as bought
window.forceElement25Bought = function() {

  if (!window.boughtElements) {
    window.boughtElements = {};
    boughtElements = window.boughtElements;
  }
  window.boughtElements[25] = true;
  boughtElements[25] = true;


  updatePrismAdvancedButtonVisibility();
  // Also save the game to persist this change
  if (typeof saveGame === 'function') {
    saveGame();

  }
};

// Force unlock advanced lab permanently
window.forceAdvancedLabUnlock = function() {

  window.prismAdvancedLabUnlocked = true;
  updatePrismAdvancedButtonVisibility();
  if (typeof saveGame === 'function') {
    saveGame();

  }
};

// Reset element 25 to not bought state
window.resetElement25 = function() {

  if (window.boughtElements) {
    delete window.boughtElements[25];
    delete window.boughtElements["25"];
  }
  if (typeof boughtElements !== 'undefined') {
    delete boughtElements[25];
    delete boughtElements["25"];
  }
  
  // Also reset the permanent unlock flag if you want to test the full unlock process
  // window.prismAdvancedLabUnlocked = false;
  
  updatePrismAdvancedButtonVisibility();
  if (typeof saveGame === 'function') {
    saveGame();

  }

};

// Debug function to check IP and element 25 status
window.checkElement25Status = function() {









};

// Debug function to check save data
window.checkSaveData = function() {

  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  let saveKey = 'swariaSave';
  if (currentSaveSlot) {
    saveKey = `swariaSaveSlot${currentSaveSlot}`;
  }
  const saveData = localStorage.getItem(saveKey);
  if (saveData) {
    const parsed = JSON.parse(saveData);





  } else {

  }

};

// Add a function to check power and enable/disable the prism grid
window.checkPrismGridPowerState = function() {
  const grid = document.getElementById("lightGrid");
  if (!grid) return;
  // Prism lab operates independently of power status - always enabled
  const powerOnline = true; // Prism lab is always online
  // Remove all active-prism classes and click handlers first
  Array.from(grid.children).forEach((tile, i) => {
    tile.classList.remove("active-prism");
    tile.onclick = null;
    // Always set data-index for safety
    tile.dataset.index = i;
  });
  if (powerOnline) {
    // Enable the prism grid
    for (let i = 0; i < grid.children.length; i++) {
      if (window.prismShapeIndices && window.prismShapeIndices.includes(i)) {
        grid.children[i].classList.add("active-prism");
        grid.children[i].onclick = () => window.clickLightTile(i);
      }
    }
  }
};

function switchKnowledgeSubTab(tabId) {
  const subTabs = document.querySelectorAll("#knowledgeSubTabs .sub-tab");
  subTabs.forEach(tab => {
    tab.style.display = "none";
    tab.classList.remove("active");
  });
  const infinityTab = document.getElementById('infinityResearchSubTab');
  if (infinityTab) {
    infinityTab.style.display = "none";
    infinityTab.classList.remove("active");
  }
  const buttons = document.querySelectorAll("#knowledgeSubTabNav button");
  buttons.forEach(btn => btn.classList.remove("active"));
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    if (tabId === 'infinityResearchSubTab') {
      targetTab.style.display = "flex";
    } else {
      targetTab.style.display = "block";
    }
    targetTab.classList.add("active");
  } else {
  }
  const targetButton = document.querySelector(`#knowledgeSubTabNav button[onclick="switchKnowledgeSubTab('${tabId}')"]`);
  if (targetButton) {
    targetButton.classList.add("active");
  }
  currentKnowledgeSubTab = tabId;
  if (tabId === 'infinityResearchSubTab') {
    const tab = document.getElementById('infinityResearchSubTab');
    if (tab) {
      tab.style.display = 'block !important';
      tab.style.visibility = 'visible';
      tab.style.opacity = '1';
    }
  }
  if (tabId === 'graduationSubTab') {
    document.body.classList.add('regal-bg');
    document.documentElement.classList.add('regal-bg');
  } else {
    document.body.classList.remove('regal-bg');
    document.documentElement.classList.remove('regal-bg');
  }
}

// Infinity Research Sub-Tab Switching
function switchInfinityResearchSubTab(tabId) {
  // Hide all infinity sub-tabs
  const subTabs = document.querySelectorAll("#infinityResearchSubTabs .infinity-sub-tab");
  subTabs.forEach(tab => {
    tab.classList.remove("active");
  });

  // Remove active class from all infinity sub-tab buttons
  const buttons = document.querySelectorAll("#infinityResearchSubTabNav .infinity-sub-tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Show the selected tab
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // Add active class to the clicked button
  const targetButton = document.querySelector(`#infinityResearchSubTabNav button[onclick="switchInfinityResearchSubTab('${tabId}')"]`);
  if (targetButton) {
    targetButton.classList.add("active");
  }

  // Update infinity benefits if switching to main tab
  if (tabId === 'infinityResearchMain') {
    updateInfinityBenefits();
  }

  // Update reset info if switching to reset tab
  if (tabId === 'infinityReset') {
    updateInfinityResetInfo();
  }

  // Update tree info if switching to tree tab
  if (tabId === 'infinityShop') {
    updateInfinityShopInfo();
  }

}

// Enhanced confirmation dialog for infinity reset
function showInfinityResetConfirmation(infinityGain, currenciesWithInfinity, callback) {
  // Create detailed confirmation message
  let confirmMessage = `⚠️ INFINITY RESET CONFIRMATION ⚠️\n\n`;
  confirmMessage += `You will gain: ${infinityGain} ∞ infinity currency\n\n`;
  confirmMessage += `🔄 THIS WILL RESET:\n`;
  confirmMessage += `• All currencies to their starting values\n`;
  confirmMessage += `• All expansion levels and content\n`;
  confirmMessage += `• All elements and terrarium progress\n`;
  confirmMessage += `• All generator upgrades and purchases\n\n`;
  
  if (currenciesWithInfinity.length > 0) {
    confirmMessage += `📊 CURRENCIES READY FOR RESET:\n`;
    currenciesWithInfinity.forEach(currency => {
      const displayName = currency.name.charAt(0).toUpperCase() + currency.name.slice(1);
      confirmMessage += `• ${displayName}: ${currency.count} ∞\n`;
    });
    confirmMessage += `\n`;
  }
  
  confirmMessage += `💡 Your infinity currency will allow you to:\n`;
  confirmMessage += `• Purchase powerful infinity upgrades\n`;
  confirmMessage += `• Unlock new infinity research\n`;
  confirmMessage += `• Access infinity challenges\n\n`;
  
  confirmMessage += `Are you absolutely sure you want to proceed?`;
  
  // Show confirmation dialog
  const userConfirmed = confirm(confirmMessage);
  
  if (userConfirmed) {
    // Double confirmation for safety
    const doubleCheck = confirm(`⚠️ FINAL CONFIRMATION ⚠️\n\nThis action cannot be undone!\n\nClick OK to perform the Infinity Reset.`);
    if (doubleCheck && callback) {
      callback();
    }
  }
}

// Check and update infinity sub-tab visibility based on progression
function updateInfinitySubTabVisibility() {
  if (!window.infinitySystem) {
    return;
  }
  
  const totalInfinity = window.infinitySystem.getTotalInfinityCurrency();
  const hasPerformedReset = window.infinitySystem.totalInfinityEarned > 0;
  
  // Get tab buttons
  const infinityResetBtn = document.getElementById('infinityResetBtn');
  const infinityResearchMainBtn = document.getElementById('infinityResearchMainBtn');
  const infinityShopBtn = document.getElementById('infinityShopBtn');
  const infinityChallengeBtn = document.getElementById('infinityChallengeBtn');
  
  // Infinity Reset tab - always visible (this is the default starting tab)
  if (infinityResetBtn) {
    infinityResetBtn.style.display = 'block';
  }
  
  // Infinity Research and Tree tabs - visible after first infinity reset
  if (infinityResearchMainBtn) {
    infinityResearchMainBtn.style.display = hasPerformedReset ? 'block' : 'none';
  }
  if (infinityShopBtn) {
    infinityShopBtn.style.display = hasPerformedReset ? 'block' : 'none';
  }
  
  // Infinity Challenge tab - visible when player has 4+ total infinity
  if (infinityChallengeBtn) {
    infinityChallengeBtn.style.display = totalInfinity >= 4 ? 'block' : 'none';
  }
  
  // If current active tab becomes hidden, switch to infinity reset tab
  const activeTab = document.querySelector('#infinityResearchSubTabs .infinity-sub-tab.active');
  const activeBtn = document.querySelector('#infinityResearchSubTabNav .infinity-sub-tab-btn.active');
  
  if (activeBtn && activeBtn.style.display === 'none') {
    switchInfinityResearchSubTab('infinityReset');
  }
  
}

// Update infinity benefits display
function updateInfinityBenefits() {
  if (typeof window.infinitySystem === 'undefined') return;
  
  // Get total infinity count
  const totalInfinity = window.infinitySystem.getTotalInfinityCurrency();
  
  // Update total infinity display
  const totalCountElement = document.getElementById('totalInfinityCount');
  if (totalCountElement) {
    totalCountElement.textContent = totalInfinity;
  }
  
  // Update progress bar based on milestone positions
  const progressFill = document.getElementById('infinityProgressFill');
  if (progressFill) {
    // Define milestone values in order from bottom to top
    const milestones = [0, 1, 2, 4, 8, 15, 50];
    
    // Find which segment we're in
    let progressPercent = 0;
    
    if (totalInfinity >= milestones[milestones.length - 1]) {
      // At or beyond the highest milestone
      progressPercent = 100;
    } else {
      // Find the segment between milestones
      for (let i = 0; i < milestones.length - 1; i++) {
        if (totalInfinity >= milestones[i] && totalInfinity < milestones[i + 1]) {
          // Calculate position within this segment
          const segmentStart = milestones[i];
          const segmentEnd = milestones[i + 1];
          const segmentProgress = (totalInfinity - segmentStart) / (segmentEnd - segmentStart);
          
          // Each segment represents 1/(milestones.length-1) of the total height
          const segmentHeight = 100 / (milestones.length - 1);
          progressPercent = (i * segmentHeight) + (segmentProgress * segmentHeight);
          break;
        }
      }
    }
    
    progressFill.style.height = `${progressPercent}%`;
  }
  
  // Update progress milestones
  const milestones = document.querySelectorAll('.progress-milestone');
  milestones.forEach(milestone => {
    const requirement = parseInt(milestone.dataset.milestone);
    if (totalInfinity >= requirement) {
      milestone.classList.add('reached');
    } else {
      milestone.classList.remove('reached');
    }
  });
  
  // Update buff items
  const buffItems = document.querySelectorAll('.buff-item');
  buffItems.forEach(buffItem => {
    const requirement = parseInt(buffItem.dataset.requirement);
    const description = buffItem.querySelector('.buff-description');
    
    if (totalInfinity >= requirement) {
      buffItem.classList.remove('locked');
      buffItem.classList.add('unlocked');
      const status = buffItem.querySelector('.buff-status');
      if (status) status.textContent = '✓';
      
      // Show the hidden text when unlocked
      if (description && description.dataset.hiddenText) {
        description.textContent = description.dataset.hiddenText;
      }
    } else {
      buffItem.classList.remove('unlocked');
      buffItem.classList.add('locked');
      const status = buffItem.querySelector('.buff-status');
      if (status) status.textContent = '✗';
      
      // Clear text when locked (CSS will show "???")
      if (description) {
        description.textContent = '';
      }
    }
  });
}

// Update infinity reset info display
function updateInfinityResetInfo() {
  if (typeof window.infinitySystem === 'undefined') return;
  
  // Get currencies with infinity
  const currenciesWithInfinity = window.infinitySystem.getCurrenciesWithInfinity();
  const canReset = window.infinitySystem.canInfinityReset();
  const infinityGain = window.infinitySystem.calculateInfinityGain();
  
  // Update currencies with infinity count
  const countElement = document.getElementById('currenciesWithInfinityCount');
  if (countElement) {
    countElement.textContent = currenciesWithInfinity.length;
  }
  
  // Update infinity to gain
  const infinityToGainElement = document.getElementById('infinityToGain');
  if (infinityToGainElement) {
    infinityToGainElement.textContent = infinityGain;
  }
  
  // Update total infinity earned
  const totalEarnedElement = document.getElementById('totalInfinityEarned');
  if (totalEarnedElement) {
    totalEarnedElement.textContent = window.infinitySystem.totalInfinityEarned || 0;
  }
  
  // Update currencies with infinity list
  const currenciesListElement = document.getElementById('currenciesInfinityList');
  if (currenciesListElement) {
    if (currenciesWithInfinity.length === 0) {
      currenciesListElement.innerHTML = '<div class="no-infinity-message">No currencies have reached infinity yet</div>';
    } else {
      let listHtml = '';
      currenciesWithInfinity.forEach(currency => {
        const displayName = currency.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        listHtml += `<div class="infinity-currency-item">
          <span class="currency-name">${displayName}:</span>
          <span class="currency-infinity-count">${currency.count}∞</span>
        </div>`;
      });
      currenciesListElement.innerHTML = listHtml;
    }
  }
  
  // Update reset button state
  const resetButton = document.getElementById('performInfinityReset');
  if (resetButton) {
    // Button should be enabled when any currency has reached infinity
    resetButton.disabled = !canReset;
    
    if (canReset) {
      resetButton.textContent = `Reset for ${infinityGain} ∞`;
    } else {
      resetButton.textContent = 'Need at least 1 ∞ to reset';
    }
    
    // Add click handler if not already added
    if (!resetButton.hasAttribute('data-handler-added')) {
      resetButton.addEventListener('click', function() {
        if (window.infinitySystem.canInfinityReset()) {
          // Get infinity gain for confirmation message
          const infinityGain = window.infinitySystem.calculateInfinityGain();
          const currenciesWithInfinity = window.infinitySystem.getCurrenciesWithInfinity();
          
          // Create simple confirmation message
          let confirmMessage = `Are you sure you want to perform an Infinity Reset?\n\n`;
          confirmMessage += `You will gain: ${infinityGain} ∞ infinity currency`;
          
          // Show confirmation dialog
          if (confirm(confirmMessage)) {
            window.infinitySystem.performInfinityReset();
            // Update the display after reset
            setTimeout(() => {
              updateInfinityResetInfo();
              updateInfinitySubTabVisibility(); // Update tab visibility after reset
              // Update other displays that might be affected
              if (typeof updateUI === 'function') updateUI();
              if (typeof updateInfinityBenefits === 'function') updateInfinityBenefits();
            }, 100);
          }
        }
      });
      resetButton.setAttribute('data-handler-added', 'true');
    }
  }
  
}

// Update infinity tree info display
function updateInfinityShopInfo(force = false) {
  if (typeof window.infinitySystem === 'undefined') return;
  
  // Throttle updates to prevent performance issues
  const now = Date.now();
  if (!force && now - window.lastInfinityShopUpdate < window.INFINITY_SHOP_UPDATE_THROTTLE) {
    return;
  }
  window.lastInfinityShopUpdate = now;
  
  // Update infinity points display
  const infinityPointsElement = document.getElementById('infinityPointsDisplay');
  if (infinityPointsElement) {
    // Custom formatting for infinity points - use scientific notation at 1e6
    const points = window.infinitySystem.infinityPoints;
    let formattedPoints;
    if (!points || !(points instanceof Decimal)) {
      formattedPoints = '0';
    } else if (points.eq(0)) {
      formattedPoints = '0';
    } else {
      formattedPoints = DecimalUtils.formatDecimal(points);
    }
    infinityPointsElement.textContent = formattedPoints;
  }
  
  // Update infinity points rate display
  const infinityPointsRateElement = document.getElementById('infinityPointsRate');
  if (infinityPointsRateElement) {
    const rate = window.infinitySystem.getEffectiveInfinityPointsPerSecond();
    
    // Format the rate appropriately
    let formattedRate;
    if (!rate || !(rate instanceof Decimal)) {
      formattedRate = '0';
    } else if (rate.eq(0)) {
      formattedRate = '0';
    } else {
      formattedRate = DecimalUtils.formatDecimal(rate);
    }
    
    infinityPointsRateElement.textContent = `(+${formattedRate}/s)`;
  }
  
  // Update infinity theorems display
  const infinityTheoremsElement = document.getElementById('infinityTheoremsDisplay');
  if (infinityTheoremsElement) {
    const current = window.infinitySystem.infinityTheorems;
    const total = window.infinitySystem.totalInfinityTheorems;
    infinityTheoremsElement.textContent = `${current} (total: ${total})`;
  }
  
  // Update theorem progress
  const theoremProgressElement = document.getElementById('theoremProgress');
  const theoremCostElement = document.getElementById('theoremCost');
  const theoremProgressBar = document.getElementById('theoremProgressBar');
  
  if (theoremProgressElement && theoremCostElement && theoremProgressBar) {
    const progress = window.infinitySystem.theoremProgress;
    const cost = window.infinitySystem.getCurrentTheoremCost();
    
    // Custom formatting for theorem progress - use scientific notation at 1e6
    let formattedProgress;
    if (!progress || !(progress instanceof Decimal)) {
      formattedProgress = '0';
    } else if (progress.eq(0)) {
      formattedProgress = '0';
    } else {
      formattedProgress = DecimalUtils.formatDecimal(progress);
    }
    theoremProgressElement.textContent = formattedProgress;
    
    // Custom formatting for theorem cost - use scientific notation at 1e6
    let formattedCost;
    if (cost === 0) {
      formattedCost = '0';
    } else {
      formattedCost = DecimalUtils.formatDecimal(new Decimal(cost));
    }
    theoremCostElement.textContent = formattedCost;
    
    const progressPercent = Math.min(100, progress.div(cost).mul(100).toNumber());
    theoremProgressBar.style.width = `${progressPercent}%`;
  }
  
  // Update infinity upgrade tree
  if (typeof window.updateInfinityUpgradeTree === 'function') {
    window.updateInfinityUpgradeTree();
  }
}

// Make updateInfinityShopInfo available as updateInfinityDisplay
window.updateInfinityDisplay = updateInfinityShopInfo;

// Hook into existing update functions to refresh infinity benefits
if (typeof window._originalUpdateUI === 'undefined' && typeof updateUI !== 'undefined') {
  window._originalUpdateUI = updateUI;
  window.updateUI = function() {
    window._originalUpdateUI();
    // Update infinity benefits if the main tab is active
    const mainTab = document.getElementById('infinityResearchMain');
    if (mainTab && mainTab.classList.contains('active')) {
      updateInfinityBenefits();
    }
  };
}

document.querySelectorAll('#bottomNav .navBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    showPage(target);
  });
});
window.testInfinityResearch = function() {
  const btn = document.getElementById('infinityResearchSubTabBtn');
  if (btn) {
    btn.style.display = 'inline-block';
  }
  const nav = document.getElementById('knowledgeSubTabNav');
  if (nav) {
    nav.style.display = 'flex';
  }
  const navBar = document.getElementById('knowledgeSubTabBar');
  if (navBar) {
    navBar.style.display = 'block';
  }
  showPage('knowledge');
  switchKnowledgeSubTab('infinityResearchSubTab');
};

// Debug function to test infinity research unlock
window.testInfinityUnlock = function() {
  const unlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  localStorage.setItem(unlockKey, 'true');

  checkInfinityResearchUnlock();
  return 'Infinity Research tab should now be visible!';
};

// Debug function to simulate infinity count for testing
window.simulateInfinityCount = function(count = 1) {
  if (!window.infinitySystem) {
    window.infinitySystem = {
      counts: { fluff: 0, swariaCoins: 0, feathers: 0, artifacts: 0 },
      getTotalInfinityCurrency: function() {
        let total = 0;
        for (const key in this.counts) {
          total += this.counts[key] || 0;
        }
        return total;
      }
    };
  }
  
  // Set fluff infinity count to desired value
  window.infinitySystem.counts.fluff = count;

  // Trigger infinity research unlock check
  checkInfinityResearchUnlock();
  
  return `Infinity count set to ∞X${count}. Infinity Research should ${count >= 1 ? 'now be unlocked' : 'remain locked'}.`;
};

// Debug function to reset infinity research unlock
window.resetInfinityUnlock = function() {
  const unlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  localStorage.removeItem(unlockKey);
  const btn = document.getElementById('infinityResearchSubTabBtn');
  if (btn) {
    btn.style.display = 'none';
  }

  return 'Infinity Research tab should now be hidden until currency reaches infinity again!';
};

// Debug function to test control center unlock
window.testControlCenterUnlock = function() {
  const unlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
  localStorage.setItem(unlockKey, 'true');

  checkControlCenterUnlock();
  return 'Control Center tab should now be visible!';
};

// Debug function to reset control center unlock
window.resetControlCenterUnlock = function() {
  const unlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
  localStorage.removeItem(unlockKey);
  const tab = document.getElementById('knowledgeTab');
  if (tab) {
    tab.style.display = 'none';
  }

  return 'Control Center tab should now be hidden until first delivery reset again!';
};

// Debug function to force show control center (bypass all checks)
window.forceShowControlCenter = function() {
  const tab = document.getElementById('knowledgeTab');
  if (tab) {
    tab.style.display = 'inline-block';

    return 'Control Center tab is now visible!';
  } else {

    return 'Error: knowledgeTab element not found!';
  }
};

// Debug function to check unlock status
window.checkUnlockStatus = function() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
  const infinityUnlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  const controlCenterUnlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
  const nectarizeUnlockKey = `highestGradeReached_${currentSaveSlot}`;
  
  const infinityUnlocked = localStorage.getItem(infinityUnlockKey);
  const controlCenterUnlocked = localStorage.getItem(controlCenterUnlockKey);
  const highestGradeReached = localStorage.getItem(nectarizeUnlockKey) || '1';
  const nectarizeUnlocked = parseInt(highestGradeReached) >= 7;













  // Check infinity count
  let totalInfinityCount = 0;
  if (window.infinitySystem && typeof window.infinitySystem.getTotalInfinityCurrency === 'function') {
    totalInfinityCount = window.infinitySystem.getTotalInfinityCurrency();
  }


  const knowledgeTab = document.getElementById('knowledgeTab');
  const infinityBtn = document.getElementById('infinityResearchSubTabBtn');
  const nectarizeBtn = document.getElementById('terrariumNectarizeBtn');



  return {
    infinityUnlocked: !!infinityUnlocked,
    controlCenterUnlocked: !!controlCenterUnlocked,
    nectarizeUnlocked: nectarizeUnlocked,
    totalInfinityCount: totalInfinityCount,
    highestGradeReached: parseInt(highestGradeReached),
    knowledgeTabVisible: knowledgeTab?.style.display === 'inline-block',
    infinityBtnVisible: infinityBtn?.style.display === 'inline-block',
    nectarizeBtnVisible: nectarizeBtn?.style.display === 'inline-block'
  };
};

// Debug function to clean up old global unlock keys
window.cleanupOldUnlockKeys = function() {
  const oldKeys = ['infinityResearchUnlocked', 'controlCenterUnlocked', 'highestGradeReached'];
  let cleaned = 0;
  
  oldKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      cleaned++;

    }
  });

  return `Removed ${cleaned} old global keys. All unlocks are now save-slot-specific.`;
};

// Debug function to test nectarize unlock
window.testNectarizeUnlock = function() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
  const highestGradeKey = `highestGradeReached_${currentSaveSlot}`;
  localStorage.setItem(highestGradeKey, '7');

  if (typeof window.updateNectarizeButtonVisibility === 'function') {
    window.updateNectarizeButtonVisibility();
  }
  
  return 'Nectarize should now be unlocked for current save slot!';
};

// Debug function to reset nectarize unlock
window.resetNectarizeUnlock = function() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot') || 'default';
  const highestGradeKey = `highestGradeReached_${currentSaveSlot}`;
  localStorage.setItem(highestGradeKey, '1');

  if (typeof window.updateNectarizeButtonVisibility === 'function') {
    window.updateNectarizeButtonVisibility();
  }
  
  return 'Nectarize unlock reset for current save slot!';
};

// Debug function to force show control center
window.forceShowControlCenter = function() {
  const tab = document.getElementById('knowledgeTab');
  if (tab) {
    tab.style.display = 'inline-block';

    return 'Control Center tab is now visible!';
  } else {

    return 'Error: Control Center tab element not found!';
  }
};

// Debug function to check control center status
window.checkControlCenterStatus = function() {
  const tab = document.getElementById('knowledgeTab');
  const unlocked = localStorage.getItem('controlCenterUnlocked');
  const hasKP = swariaKnowledge && swariaKnowledge.kp > 0;
  const hasElements = Object.keys(boughtElements).length > 0;
  const seenStory = state && state.seenFirstDeliveryStory;







  return {
    tabExists: !!tab,
    displayStyle: tab ? tab.style.display : null,
    unlocked: unlocked,
    hasKP: hasKP,
    hasElements: hasElements,
    seenStory: seenStory
  };
};

function checkGeneratorUnlock() {
  const btn = document.getElementById('generatorSubTabBtn');
  if ( true) {
    btn.style.display = 'inline-block';
  }
}

function checkGraduationUnlock() {
  const btn = document.getElementById('graduationSubTabBtn');
  if ( true) {
    btn.style.display = 'inline-block';
  }
}

document.querySelectorAll('#bottomNav .navBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.target;
    showPage(page);
  });
});
document.querySelectorAll(".navBtn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".navBtn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target).classList.add("active");
    if (btn.dataset.target === "knowledge") {
      renderElementGrid();
    }
  };
});
window.addEventListener("load", () => {
  if (typeof loadGame === "function") loadGame();
  if (typeof window.reloadAchievementsForSlot === "function") {
    window.reloadAchievementsForSlot();
  }
  if (typeof updateGradeUI === "function") updateGradeUI();
  if (typeof updateMilestoneTable === "function") updateMilestoneTable();
  if (typeof updatePrismSubTabVisibility === "function") updatePrismSubTabVisibility();
  renderPowerGenerator();
  initializeGeneratorTab();
});
window.addEventListener('load', () => {
  const current = document.querySelector('.page.active')?.id;
  const subTab = document.getElementById('subTabNavBar');
  if (current === 'home') {
    subTab.style.display = 'flex';
  } else {
    subTab.style.display = 'none';
  }
});

function updateWingArtifactUI() {
  const wing = DecimalUtils.isDecimal(state.artifacts) ? state.artifacts : new Decimal(state.artifacts || 0);
  const wingLine = document.getElementById("wingProgress");
  const wingValue = document.getElementById("artifactsResetCheck");
  if (wing.gte(50)) {
    wingLine.style.display = "none";
  } else {
    wingLine.style.display = "block";
    wingValue.textContent = formatNumber(wing);
  }
}

const elementPositions = {
  1: { row: 1, col: 1 },  2: { row: 1, col: 18 },
  3: { row: 2, col: 1 },  4: { row: 2, col: 2 },
  5: { row: 2, col: 13 }, 6: { row: 2, col: 14 },
  7: { row: 2, col: 15 }, 8: { row: 2, col: 16 },
  9: { row: 2, col: 17 },10: { row: 2, col: 18 },
  11:{ row: 3, col: 1 }, 12:{ row: 3, col: 2 },
  13:{ row: 3, col:13 }, 14:{ row: 3, col:14 },
  15:{ row: 3, col:15 }, 16:{ row: 3, col:16 },
  17:{ row: 3, col:17 }, 18:{ row: 3, col:18 },
  19:{ row: 4, col: 1 }, 20:{ row: 4, col: 2 }, 21:{ row: 4, col: 3 },
  22:{ row: 4, col: 4 }, 23:{ row: 4, col: 5 }, 24:{ row: 4, col: 6 },
  25:{ row: 4, col: 7 }, 26:{ row: 4, col: 8 }, 27:{ row: 4, col: 9 },
  28:{ row: 4, col:10 }, 29:{ row: 4, col:11 }, 30:{ row: 4, col:12 },
  31:{ row: 4, col:13 }, 32:{ row: 4, col:14 }, 33:{ row: 4, col:15 },
  34:{ row: 4, col:16 }, 35:{ row: 4, col:17 }, 36:{ row: 4, col:18 },
  37:{ row: 5, col: 1 }, 38:{ row: 5, col: 2 }, 39:{ row: 5, col: 3 },
  40:{ row: 5, col: 4 }, 41:{ row: 5, col: 5 }, 42:{ row: 5, col: 6 },
  43:{ row: 5, col: 7 }, 44:{ row: 5, col: 8 }, 45:{ row: 5, col: 9 },
  46:{ row: 5, col:10 }, 47:{ row: 5, col:11 }, 48:{ row: 5, col:12 },
  49:{ row: 5, col:13 }, 50:{ row: 5, col:14 }, 51:{ row: 5, col:15 },
  52:{ row: 5, col:16 }, 53:{ row: 5, col:17 }, 54:{ row: 5, col:18 },
  55:{ row: 6, col: 1 }, 56:{ row: 6, col: 2 }, 
  72:{ row: 6, col: 4 }, 73:{ row: 6, col: 5 }, 74:{ row: 6, col: 6 },
  75:{ row: 6, col: 7 }, 76:{ row: 6, col: 8 }, 77:{ row: 6, col: 9 },
  78:{ row: 6, col:10 }, 79:{ row: 6, col:11 }, 80:{ row: 6, col:12 },
  81:{ row: 6, col:13 }, 82:{ row: 6, col:14 }, 83:{ row: 6, col:15 },
  84:{ row: 6, col:16 }, 85:{ row: 6, col:17 }, 86:{ row: 6, col:18 },
  87:{ row: 7, col: 1 }, 88:{ row: 7, col: 2 }, 
  104:{ row: 7, col: 4 },105:{ row: 7, col: 5 },106:{ row: 7, col: 6 },
  107:{ row: 7, col: 7 },108:{ row: 7, col: 8 },109:{ row: 7, col: 9 },
  110:{ row: 7, col:10 },111:{ row: 7, col:11 },112:{ row: 7, col:12 },
  113:{ row: 7, col:13 },114:{ row: 7, col:14 },115:{ row: 7, col:15 },
  116:{ row: 7, col:16 },117:{ row: 7, col:17 },118:{ row: 7, col:18 },
  57:{ row: 8, col: 4 }, 58:{ row: 8, col: 5 }, 59:{ row: 8, col: 6 },
  60:{ row: 8, col: 7 }, 61:{ row: 8, col: 8 }, 62:{ row: 8, col: 9 },
  63:{ row: 8, col:10 }, 64:{ row: 8, col:11 }, 65:{ row: 8, col:12 },
  66:{ row: 8, col:13 }, 67:{ row: 8, col:14 }, 68:{ row: 8, col:15 },
  69:{ row: 8, col:16 }, 70:{ row: 8, col:17 }, 71:{ row: 8, col:18 },
  89:{ row: 9, col: 4 }, 90:{ row: 9, col: 5 }, 91:{ row: 9, col: 6 },
  92:{ row: 9, col: 7 }, 93:{ row: 9, col: 8 }, 94:{ row: 9, col: 9 },
  95:{ row: 9, col:10 }, 96:{ row: 9, col:11 }, 97:{ row: 9, col:12 },
  98:{ row: 9, col:13 }, 99:{ row: 9, col:14 },100:{ row: 9, col:15 },
  101:{ row: 9, col:16 },102:{ row: 9, col:17 },103:{ row: 9, col:18 }
};

function earnBox(type, rewardMultiplier = 1, suppressPopup = false, count = 1) {
  const box = boxTiers[type];
  if (!box) return { swariaGain: new Decimal(0), featherGain: new Decimal(0), artifactGain: new Decimal(0) };
  
  // Convert inputs to Decimals - handle both Decimal and number inputs
  const rewardMultiplierDecimal = DecimalUtils.isDecimal(rewardMultiplier) ? rewardMultiplier : new Decimal(rewardMultiplier);
  const countDecimal = DecimalUtils.isDecimal(count) ? count : new Decimal(count);
  
  if (countDecimal.lte(0)) return { swariaGain: new Decimal(0), featherGain: new Decimal(0), artifactGain: new Decimal(0) };
  
  state.boxesProduced = (state.boxesProduced || 0) + countDecimal.toNumber();
  if (state.boxesProducedByType && state.boxesProducedByType[type] !== undefined) {
    // Ensure it's a Decimal before adding
    if (!DecimalUtils.isDecimal(state.boxesProducedByType[type])) {
      state.boxesProducedByType[type] = new Decimal(state.boxesProducedByType[type] || 0);
    }
    state.boxesProducedByType[type] = state.boxesProducedByType[type].add(countDecimal);
  }
  let swariaGain = new Decimal(0);
  let featherGain = new Decimal(0);
  let artifactGain = new Decimal(0);
  if (["common", "uncommon", "rare", "legendary", "mythic"].includes(type)) {
    const avgSwaria = new Decimal((box.swaria[0] + box.swaria[1]) / 2).mul(rewardMultiplierDecimal);
    swariaGain = avgSwaria.mul(countDecimal);
    if (boughtElements[2]) swariaGain = swariaGain.add(new Decimal(3).mul(rewardMultiplierDecimal).mul(countDecimal));
    if (boughtElements[3]) swariaGain = swariaGain.add(state.feathers.mul(0.1).floor().mul(rewardMultiplierDecimal).mul(countDecimal));
    swariaGain = getSwariaCoinGain(swariaGain);
  }
  if (["rare", "legendary", "mythic"].includes(type)) {
    const avgFeather = new Decimal((box.feather[0] + box.feather[1]) / 2).mul(rewardMultiplierDecimal);
    featherGain = avgFeather.mul(countDecimal);
    if (boughtElements[4]) featherGain = featherGain.add(state.artifacts.mul(0.1).floor().mul(rewardMultiplierDecimal).mul(countDecimal));
    if (typeof state !== 'undefined' && typeof prismState !== 'undefined' && DecimalUtils.toDecimal(state.grade || 1).gte(4)) {
      featherGain = featherGain.add(new Decimal(prismState.redlight || 0).mul(countDecimal));
    }
  }
  if (["legendary", "mythic"].includes(type)) {
    const avgArtifact = new Decimal((box.artifact[0] + box.artifact[1]) / 2).mul(rewardMultiplierDecimal);
    artifactGain = avgArtifact.mul(countDecimal);
    if (boughtElements[6]) {
      const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
      artifactGain = artifactGain.add(kpDecimal.mul(0.1).floor().mul(rewardMultiplierDecimal).mul(countDecimal));
    }
    if (typeof state !== 'undefined' && DecimalUtils.toDecimal(state.grade || 1).gte(5)) {
      const grade = DecimalUtils.toDecimal(state.grade || 1);
      artifactGain = artifactGain.mul(new Decimal(2).pow(grade.sub(4)));
    }
    if (typeof prismState !== 'undefined' && prismState.orangelight) {
      artifactGain = artifactGain.mul(new Decimal(1).add(prismState.orangelight));
    }
  }
  const boost = getBoxTypeBoost(type);
  swariaGain = swariaGain.mul(boost);
  featherGain = featherGain.mul(boost);
  artifactGain = artifactGain.mul(boost);
  if (window._chargerCurrencyBoost && window._chargerCurrencyBoost > 1) {
    const chargerBoost = new Decimal(window._chargerCurrencyBoost);
    swariaGain = swariaGain.mul(chargerBoost);
    featherGain = featherGain.mul(chargerBoost);
    artifactGain = artifactGain.mul(chargerBoost);
  }
  if (boughtElements[14]) {
    if (swariaGain.gt(0)) swariaGain = swariaGain.pow(1.1);
    if (featherGain.gt(0)) featherGain = featherGain.pow(1.1);
    if (artifactGain.gt(0)) artifactGain = artifactGain.pow(1.1);
  }
  swariaGain = swariaGain.floor();
  featherGain = featherGain.floor();
  artifactGain = artifactGain.floor();
  
  // Store original amounts for popup display (before infinity nerfs)
  const originalSwariaGain = swariaGain;
  const originalFeatherGain = featherGain;
  const originalArtifactGain = artifactGain;
  
  // Apply fluff infinity penalty first (same order as addCurrency)
  if (typeof window.applyFluffInfinityPenalty === 'function') {
    swariaGain = window.applyFluffInfinityPenalty(swariaGain, 'swaria').floor();
    featherGain = window.applyFluffInfinityPenalty(featherGain, 'feathers').floor();
    artifactGain = window.applyFluffInfinityPenalty(artifactGain, 'artifacts').floor();
  }
  
  // Apply infinity nerfs to main currency gains
  // NOTE: This includes individual infinity nerfs for currencies that went to infinity
  if (typeof window.infinitySystem !== 'undefined' && window.infinitySystem.applyInfinityNerfs) {
    swariaGain = window.infinitySystem.applyInfinityNerfs(swariaGain, 'swaria').floor();
    featherGain = window.infinitySystem.applyInfinityNerfs(featherGain, 'feathers').floor();
    artifactGain = window.infinitySystem.applyInfinityNerfs(artifactGain, 'artifacts').floor();
  }
  
  // Apply infinity challenge nerfs (square root for IC:1)
  if (typeof window.applyChallengeNerfs === 'function') {
    swariaGain = window.applyChallengeNerfs(swariaGain, 'swaria').floor();
    featherGain = window.applyChallengeNerfs(featherGain, 'feathers').floor();
    artifactGain = window.applyChallengeNerfs(artifactGain, 'artifacts').floor();
  }
  
  // Apply anomaly debuff (same as addCurrency)
  if (typeof window.getAnomalyDebuff === 'function') {
    const anomalyDebuff = window.getAnomalyDebuff();
    swariaGain = swariaGain.mul(anomalyDebuff).floor();
    featherGain = featherGain.mul(anomalyDebuff).floor();
    artifactGain = artifactGain.mul(anomalyDebuff).floor();
  }
  
  // Use the final nerfed amounts for both state and popups
  let popupSwariaGain = swariaGain;
  let popupFeatherGain = featherGain;
  let popupArtifactGain = artifactGain;
  
  // Show popups with the amounts players actually receive (fully nerfed amounts)
  if (!suppressPopup) {
    if (popupSwariaGain.gt(0)) showGainPopup("swariaGain", popupSwariaGain, "Swaria Coins");
    if (popupFeatherGain.gt(0)) showGainPopup("featherGain", popupFeatherGain, "Feathers");
    if (popupArtifactGain.gt(0)) showGainPopup("artifactGain", popupArtifactGain, "Artifacts");
  }
  
  state.swaria = state.swaria.add(swariaGain);
  state.feathers = state.feathers.add(featherGain);
  state.artifacts = state.artifacts.add(artifactGain);
  if (typeof window.trackSwariaMilestone === 'function') {
    window.trackSwariaMilestone(state.swaria);
  }
  if (typeof window.trackFeatherMilestone === 'function') {
    window.trackFeatherMilestone(state.feathers);
  }
  if (typeof window.trackArtifactMilestone === 'function') {
    window.trackArtifactMilestone(state.artifacts);
  }
  updateUI();
  
  // Return the popup amounts for use by generators
  return { 
    swariaGain: popupSwariaGain, 
    featherGain: popupFeatherGain, 
    artifactGain: popupArtifactGain 
  };
}

function renderGenerators() {
  const container = document.getElementById("generatorContainer");
  if (!container) return;
  container.innerHTML = "";
  const flexRow = document.createElement("div");
  flexRow.className = "generator-flex-row";
  const leftCol = document.createElement("div");
  leftCol.className = "generator-left-col";
  const powerGeneratorCard = document.createElement("div");
  powerGeneratorCard.className = "card generator power-generator";
  
  // Check if auto recharge system is unlocked (Soap level 4+ friendship)
  let autoRechargeHTML = '';
  if (typeof getSoapAutoRechargeConfig === 'function') {
    const config = getSoapAutoRechargeConfig();
    if (config) {
      let level = 0;
      if (window.friendship && window.friendship.Generator) {
        level = window.friendship.Generator.level || 0;
      } else if (typeof friendship !== 'undefined' && friendship.Generator) {
        level = friendship.Generator.level || 0;
      }
      
      const timerMinutes = Math.max(1, 10 - (level - 4));
      const maxStorage = 3 + Math.floor((level - 4) / 2);
      
      autoRechargeHTML = `
        <div class="auto-recharge-system" style="margin-top: 15px; padding: 10px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border: 1px solid rgba(76, 175, 80, 0.3);">
          <h4 style="margin: 0 0 8px 0; color: #4CAF50; font-size: 0.9em;">Soap's Auto Recharge</h4>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <small style="color: #666; margin-bottom: 2px;">Next Charge</small>
              <span id="autoRechargeTimer" style="font-family: monospace; font-weight: bold; color: #4CAF50;">${timerMinutes}:00</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <small style="color: #666; margin-bottom: 2px;">Storage</small>
              <span id="autoRechargeStorage" style="font-family: monospace; font-weight: bold; color: #4CAF50;">0/${maxStorage}</span>
            </div>
          </div>
          <div style="margin-top: 8px;">
            <small style="color: #666; font-size: 0.8em;">Auto recharges power to max when below 20</small>
          </div>
        </div>
      `;
    }
  }
  
  // Check friendship level for Mk.2 upgrade
  let isMk2 = false;
  let soapFriendshipLevel = 0;
  if (window.friendship && window.friendship.Generator) {
    soapFriendshipLevel = window.friendship.Generator.level || 0;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    soapFriendshipLevel = friendship.Generator.level || 0;
  }
  isMk2 = soapFriendshipLevel >= 4;
  
  // Choose title and styling based on upgrade status
  const generatorTitle = isMk2 ? 'Power Generator Mk.2' : 'Power Generator';
  const mk2Styling = '';
  
  // Apply Mk.2 styling to the entire card
  const cardClass = isMk2 ? 'card generator power-generator mk2-generator' : 'card generator power-generator';
  powerGeneratorCard.className = cardClass;
  
  // Add Mk.2 specific styles to the card itself
  if (isMk2) {
    powerGeneratorCard.style.cssText = `
      background: #181D36 !important;
      border: 3px solid rgba(33, 150, 243, 0.6) !important;
      box-shadow: 0 0 20px rgba(33, 150, 243, 0.3) !important;
    `;
  }
  
  powerGeneratorCard.innerHTML = `
    <h3>${generatorTitle}</h3>
    ${mk2Styling}
    <div class="power-status-display">
      <div class="power-status" id="powerStatus">ONLINE</div>
      <div class="power-energy" id="powerEnergy">100/100</div>
    </div>
    <div class="power-progress-container">
      <div class="power-progress-bar">
        <div class="power-progress-fill" id="powerEnergyBar" style="width: 100%"></div>
      </div>
    </div>
    <button id="powerRechargeBtn" onclick="startPowerRechargeMinigame()">
      Recharge Generator
    </button>
    <div class="power-info">
      <small>Energy depletes at 1 per 5 seconds</small><br>
      <small>Click recharge anytime to restore energy</small>
    </div>
    ${autoRechargeHTML}
  `;
  leftCol.appendChild(powerGeneratorCard);
  const swariaCard = document.createElement("div");
  swariaCard.className = "card swaria-box";
  let soapImageSrc = "assets/icons/soap.png";
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const mins = window.daynight.getTime();
    if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
      soapImageSrc = "assets/icons/soap sleeping.png";
    }
  }
  swariaCard.innerHTML = `
    <div class="swaria-container">
      <img id="swariaGeneratorCharacter" src="${soapImageSrc}" alt="Swaria Character">
      <div id="swariaGeneratorSpeech" class="swaria-speech" style="display:none;"></div>
    </div>
  `;
  leftCol.appendChild(swariaCard);
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const mins = window.daynight.getTime();
    const soapImg = document.getElementById("swariaGeneratorCharacter");
    if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
      window.isSoapSleeping = true;
      if (soapImg) soapImg.src = "assets/icons/soap sleeping.png";
      var soapSpeech = document.getElementById("swariaGeneratorSpeech");
      if (soapSpeech) soapSpeech.style.display = "none";
      if (typeof stopSoapRandomSpeechTimer === 'function') stopSoapRandomSpeechTimer();
    } else {
      window.isSoapSleeping = false;
      if (soapImg) soapImg.src = "assets/icons/soap.png";
      if (typeof startSoapRandomSpeechTimer === 'function') startSoapRandomSpeechTimer();
    }
  }

  const rightCol = document.createElement("div");
  rightCol.className = "generator-right-col";
  
  // Check if Box Generator Mk.2 is unlocked (Soap friendship level 10+)
  let isBoxGeneratorMk2 = false;
  if (window.friendship && window.friendship.Generator) {
    isBoxGeneratorMk2 = window.friendship.Generator.level >= 10;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    isBoxGeneratorMk2 = friendship.Generator.level >= 10;
  }
  
  if (isBoxGeneratorMk2) {
    // Reset all individual generator upgrades when switching to Mk.2 mode (one-time transition)
    // This ensures clean transition from individual upgrades to unified system
    if (!state.mk2UpgradesReset) {
      const unlockedGenerators = generators.filter(gen => gen.unlocked);
      let hasAnyUpgrades = false;
      unlockedGenerators.forEach(gen => {
        if (generatorUpgrades[gen.reward] && !generatorUpgrades[gen.reward].eq(0)) {
          hasAnyUpgrades = true;

          generatorUpgrades[gen.reward] = new Decimal(0);
        }
      });
      if (hasAnyUpgrades) {

      }
      state.mk2UpgradesReset = true;
    }
    
    // Render Box Generator Mk.2 - compact size matching Soap's character card
    const row = document.createElement("div");
    row.className = "generator-row mk2-row";
    row.style.display = "flex";
    row.style.gap = "18px";
    row.style.alignItems = "stretch";
    row.style.marginBottom = "18px";
    
    const wrapper = document.createElement("div");
    wrapper.className = "generator mk2-box-generator";
    
    // Apply Mk.2 styling - compact height to match Soap's card
    wrapper.style.cssText = `
      background: #181D36 !important;
      border: 3px solid rgba(33, 150, 243, 0.6) !important;
      box-shadow: 0 0 20px rgba(33, 150, 243, 0.3) !important;
      border-radius: 8px;
      padding: 15px;
      color: white;
      min-width: 350px;
      max-height: 400px;
      overflow-y: auto;
    `;
    
    let iconPath = `assets/icons/gen-common.png`;
    let content = `<h3 style="margin: 0 0 15px 0; text-align: center;">
      <img src="${iconPath}" class="icon rainbow-icon" style="width: 32px; height: 32px; margin-right: 10px;">Box Generator Mk.2
    </h3>`;
    
    // Mk.2 mode always works independently - no need to check for unlocked generators
    
    // Use a base speed for Mk.2 system independent of individual generators
    const mk2BaseSpeed = 10; // Base speed for Mk.2 system
    const mk2SpeedUpgrades = state.mk2SpeedUpgrades || 0;
    const mk2Speed = mk2BaseSpeed * Math.pow(1.3, mk2SpeedUpgrades);
    
    // Create a virtual generator object for Mk.2 progress tracking
    const mk2Generator = {
      speed: mk2Speed,
      progress: state.mk2Progress || 0,
      reward: 'mk2-unified'
    };
    
    // Always show Mk.2 interface
    {
      // Create a virtual generator for Mk.2 with independent speed
      const slowestGen = {
        speed: mk2Speed,
        progress: state.mk2Progress || 0,
        reward: 'mk2-unified',
        baseSpeed: 10,
        speedUpgrades: state.mk2SpeedUpgrades || 0,
        speedMultiplier: 1
      };
      
      // Single unified tick speed upgrade button using scaling cost system
      const speedCost = getMk2SpeedUpgradeCost();
      const combinedBoxes = getCombinedBoxCount();
      const canUpgrade = combinedBoxes.gte(speedCost);
      const allMaxed = (state.mk2SpeedUpgrades || 0) >= 50; // Mk.2 speed upgrade cap
      
      if (allMaxed) {
        content += `<button id="upgradeMk2Speed" disabled>Maxed</button>`;
      } else {
        const upgradeCount = state.mk2SpeedUpgrades || 0;
        content += `<button id="upgradeMk2Speed" onclick="upgradeMk2Speed()" ${!canUpgrade ? 'disabled' : ''}>
          Upgrade Mk.2 Speed (${formatNumber(speedCost)} combined boxes)
        </button>`;
      }
      
      content += `
        <div class="progress-container" style="margin: 15px 0;">
          <div class="progress-bar" id="progress-mk2" style="width: ${slowestGen.progress}%;"></div>
        </div>
        <div style="margin: 10px 0; color: #00ff88; font-size: 0.9em; text-align: center;">
          Produces all unlocked box types simultaneously!
        </div>
      `;
      
      // Single unified "Double all box type" upgrade button if Element 9 is unlocked
      if (boughtElements[9]) {
        // Use scaling cost system based on combined boxes
        const boxUpgradeCost = getDoubleAllBoxCost();
        const combinedBoxes = getCombinedBoxCount();
        const canAffordBoxUpgrade = combinedBoxes.gte(boxUpgradeCost);
        const upgradeCount = state.doubleAllBoxUpgrades || 0;
        
        content += `<button class="upgrade-btn" id="doubleAllBoxTypes" onclick="buyAllGeneratorUpgrades()" ${!canAffordBoxUpgrade ? 'disabled' : ''}>
          <img src="assets/icons/gen-common.png" class="icon rainbow-icon"> Double All Box Types
          <br><small>Cost: ${formatNumber(boxUpgradeCost)} Combined Boxes</small>
        </button>`;
      }
      
    }
    
    wrapper.innerHTML = content;
    
    // Add the Box Generator Mk.2 to the row first
    row.appendChild(wrapper);
    rightCol.appendChild(row);
    
    // Create a separate row for the compact combined box tracker
    const trackerRow = document.createElement("div");
    trackerRow.className = "generator-row";
    trackerRow.style.display = "flex";
    trackerRow.style.gap = "18px";
    trackerRow.style.alignItems = "stretch";
    trackerRow.style.marginBottom = "18px";
    
    const tracker = document.createElement("div");
    tracker.className = "box-tracker-card mk2-tracker";
    tracker.style.cssText = `
      background: #181D36 !important;
      border: 3px solid rgba(33, 150, 243, 0.8) !important;
      box-shadow: 0 0 20px rgba(33, 150, 243, 0.4) !important;
      border-radius: 8px;
      color: white;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 15px;
      font-size: 1em;
      max-height: 300px;
      overflow-y: auto;
    `;
    
    let totalBoxes = new Decimal(0);
    let boxBreakdown = '';
    generators.forEach(gen => {
      // Show all box types that have been produced, regardless of generator unlock status
      // This is important for Mk.2 Box Generator which produces all types
      if (state.boxesProducedByType && state.boxesProducedByType[gen.reward]) {
        const boxCount = DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward]) 
          ? state.boxesProducedByType[gen.reward] 
          : new Decimal(state.boxesProducedByType[gen.reward] || 0);
        
        // Only show if count is greater than 0
        if (boxCount.gt(0)) {
          totalBoxes = totalBoxes.add(boxCount);
          boxBreakdown += `<div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 1.1em;">
            <span style="color: #${gen.reward === 'common' ? '87ceeb' : gen.reward === 'uncommon' ? '00ff00' : gen.reward === 'rare' ? 'ff0000' : gen.reward === 'legendary' ? 'ff8000' : '800080'};">
              ${gen.reward.charAt(0).toUpperCase() + gen.reward.slice(1)}:
            </span>
            <span>${formatNumber(boxCount)}</span>
          </div>`;
        }
      }
    });
    
    // Calculate combined boxes for display
    const combinedBoxes = getCombinedBoxCount();
    
    tracker.innerHTML = `
      <div class="box-tracker-title" style="font-size: 1.1em; margin-bottom: 15px; text-align: center;">Total Boxes Produced</div>
      <div style="width: 100%; padding-top: 5px;">
        ${boxBreakdown}
      </div>
      <div class="combined-boxes-display" style="font-size: 1.1em; margin-top: 15px; text-align: center; padding-top: 10px; border-top: 1px solid rgba(33, 150, 243, 0.3); color: #87ceeb;">
        Combined Boxes: ${formatNumber(combinedBoxes)}
      </div>
    `;
    
    trackerRow.appendChild(tracker);
    rightCol.appendChild(trackerRow);
  } else {
    // Render individual generators normally
    generators.forEach((gen, i) => {
      gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades || 0) * (gen.speedMultiplier || 1);
      const row = document.createElement("div");
      row.className = "generator-row";
      row.style.display = "flex";
      row.style.gap = "18px";
      row.style.alignItems = "stretch";
      row.style.marginBottom = "18px";
      const wrapper = document.createElement("div");
      wrapper.className = "generator";
      let iconPath = `assets/icons/gen-${gen.reward}.png`;
      let content = `<h3><img src="${iconPath}" class="icon">${gen.name}</h3>`;
    if (!gen.unlocked) {
      const unlockCost = gen.baseCost;
      let canUnlock = false;
      if (gen.currency === 'kp') {
        canUnlock = DecimalUtils.isDecimal(swariaKnowledge.kp) && swariaKnowledge.kp.gte(unlockCost);
      } else if (gen.currency === 'swaria coins') {
        canUnlock = DecimalUtils.isDecimal(state.swaria) && state.swaria.gte(unlockCost);
      } else {
        canUnlock = DecimalUtils.isDecimal(state[gen.currency]) && state[gen.currency].gte(unlockCost);
      }
      content += `<button id="buyGen${i}" onclick="unlockGenerator(${i})" ${!canUnlock ? "disabled" : ""}>
        Unlock (${formatNumber(unlockCost)} ${gen.currency})
      </button>`;
    } else {
      const cost = DecimalUtils.multiply(gen.baseCost, new Decimal(gen.costMultiplier).pow(gen.upgrades));
      let canUpgrade = false;
      if (gen.currency === 'kp') {
        canUpgrade = DecimalUtils.isDecimal(swariaKnowledge.kp) && swariaKnowledge.kp.gte(cost);
      } else if (gen.currency === 'swaria coins') {
        canUpgrade = DecimalUtils.isDecimal(state.swaria) && state.swaria.gte(cost);
      } else {
        canUpgrade = DecimalUtils.isDecimal(state[gen.currency]) && state[gen.currency].gte(cost);
      }
      const instantFill = gen.speed * 0.1 >= 100; 
      if (instantFill) {
        content += `<button id="upgradeGen${i}" disabled>Maxed</button>`;
      } else {
        content += `<button id="upgradeGen${i}" onclick="upgradeGenerator(${i})" ${!canUpgrade ? 'disabled' : ''}>
          Upgrade (${formatNumber(cost)} ${gen.currency})
        </button>`;
      }
      content += `
        <div class="progress-container">
          <div class="progress-bar" id="progress${i}" style="width: ${gen.progress}%"></div>
        </div>
      `;
    }
    if (gen.unlocked && boughtElements[9]) {
      const upgradeLevel = generatorUpgrades[gen.reward] || new Decimal(0);
      const upgradeLevelDecimal = DecimalUtils.isDecimal(upgradeLevel) ? upgradeLevel : new Decimal(upgradeLevel);
      const upgradeCost = getGeneratorUpgradeCost(gen.reward);
      // Ensure boxesProducedByType value is a Decimal
      if (!DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward])) {
        state.boxesProducedByType[gen.reward] = new Decimal(state.boxesProducedByType[gen.reward] || 0);
      }
      const canAfford = state.boxesProducedByType[gen.reward].gte(upgradeCost);
      const typeName = gen.reward.charAt(0).toUpperCase() + gen.reward.slice(1);
      content += `<button class="upgrade-btn" id="upgrade${capitalize(gen.reward)}Btn" onclick="buyGeneratorUpgrade('${gen.reward}')" ${!canAfford ? 'disabled' : ''}>
        <img src="assets/icons/gen-${gen.reward}.png" class="icon"> Double ${typeName} box generated
        <br><small>Cost: ${formatNumber(upgradeCost)} ${typeName} Boxes</small>
      </button>`;
    }
    wrapper.innerHTML = content;
    // Ensure boxesProducedByType value is a Decimal
    if (state.boxesProducedByType && state.boxesProducedByType[gen.reward] !== undefined) {
      if (!DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward])) {
        state.boxesProducedByType[gen.reward] = new Decimal(state.boxesProducedByType[gen.reward] || 0);
      }
    }
    const boxCount = state.boxesProducedByType && state.boxesProducedByType[gen.reward] !== undefined ? state.boxesProducedByType[gen.reward] : new Decimal(0);
    const tracker = document.createElement("div");
    tracker.className = "box-tracker-card";
    tracker.innerHTML = `<div class="box-tracker-title">${gen.name.split(' ')[0]} Boxes Produced</div>
      <div class="box-tracker-count" id="boxesProducedCount-${gen.reward}">${formatNumber(boxCount)}</div>`;
    if (boughtElements[11]) {
      const boost = 1 + (boxCount * 0.01);
      let boostDisplay = formatNumber(boost);
      tracker.innerHTML += `<div class="box-tracker-boost" id="boxBoost-${gen.reward}" style="margin-top:4px;font-size:1.1em;color:#aaffff;">Current Boost: ×${boostDisplay} reward</div>`;
    }
    tracker.style.display = "flex";
    tracker.style.flexDirection = "column";
    tracker.style.justifyContent = "center";
    tracker.style.alignItems = "center";
    tracker.style.minWidth = "140px";
    tracker.style.maxWidth = "180px";
    row.appendChild(wrapper);
    row.appendChild(tracker);
    rightCol.appendChild(row);
    });
  }
  flexRow.appendChild(leftCol);
  flexRow.appendChild(rightCol);
  container.appendChild(flexRow);
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  if (soapImg) {
    soapImg.style.cursor = "pointer";
    soapImg.onclick = showSoapClickMessage;
  }
  updatePowerGeneratorUI();
}

function unlockGenerator(i) {
  const gen = generators[i];
  const unlockCost = gen.baseCost;
  let currentAmount = new Decimal(0);
  if (gen.currency === 'kp') {
    currentAmount = swariaKnowledge.kp;
  } else if (gen.currency === 'swaria coins') {
    currentAmount = state.swaria;
  } else {
    currentAmount = state[gen.currency];
  }
  
  // Ensure currentAmount is a Decimal
  if (!DecimalUtils.isDecimal(currentAmount)) {
    currentAmount = new Decimal(currentAmount || 0);
  }
  
  if (currentAmount.lt(unlockCost)) return;
  if (gen.currency === 'kp') {
    swariaKnowledge.kp = swariaKnowledge.kp.sub(unlockCost);
  } else if (gen.currency === 'swaria coins') {
    state.swaria = state.swaria.sub(unlockCost);
  } else {
    state[gen.currency] = state[gen.currency].sub(unlockCost);
  }
  gen.unlocked = true;
  if (typeof window.trackGeneratorUnlocks === 'function') {
    window.trackGeneratorUnlocks();
  }
  updateUI();
  updateKnowledgeUI();
  renderGenerators();
}

function upgradeGenerator(i) {
  const gen = generators[i];
  const instantFill = gen.baseSpeed * Math.pow(1.3, (gen.speedUpgrades || 0)) * 0.1 >= 100;
  if (instantFill) return;
  const cost = DecimalUtils.multiply(gen.baseCost, new Decimal(gen.costMultiplier).pow(gen.upgrades));
  let canUpgrade = false;
  if (gen.currency === 'kp') {
    canUpgrade = DecimalUtils.isDecimal(swariaKnowledge.kp) && swariaKnowledge.kp.gte(cost);
  } else if (gen.currency === 'swaria coins') {
    canUpgrade = DecimalUtils.isDecimal(state.swaria) && state.swaria.gte(cost);
  } else {
    canUpgrade = DecimalUtils.isDecimal(state[gen.currency]) && state[gen.currency].gte(cost);
  }
  if (!canUpgrade) return;
  if (gen.currency === 'kp') {
    swariaKnowledge.kp = swariaKnowledge.kp.sub(cost);
  } else if (gen.currency === 'swaria coins') {
    state.swaria = state.swaria.sub(cost);
  } else {
    state[gen.currency] = state[gen.currency].sub(cost);
  }
  gen.speedUpgrades = (gen.speedUpgrades || 0) + 1;
  gen.upgrades++;
  gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades);
  updateUI();
  updateKnowledgeUI();
  renderGenerators();
}

// Helper function to calculate combined box count for upgrade costs
function getCombinedBoxCount() {
  // Check if Box Generator Mk.2 is active (Soap friendship level 10+)
  let isBoxGeneratorMk2 = false;
  if (window.friendship && window.friendship.Generator) {
    isBoxGeneratorMk2 = window.friendship.Generator.level >= 10;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    isBoxGeneratorMk2 = friendship.Generator.level >= 10;
  }
  
  let totalBoxes = new Decimal(1); // Start with 1 for multiplication
  
  if (isBoxGeneratorMk2) {
    // Mk.2 mode: multiply ALL box types (common × uncommon × rare × legendary × mythic)
    const allBoxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
    allBoxTypes.forEach(boxType => {
      const boxCount = state.boxesProducedByType[boxType] || new Decimal(0);
      const boxCountDecimal = DecimalUtils.isDecimal(boxCount) ? boxCount : new Decimal(boxCount);
      totalBoxes = totalBoxes.mul(boxCountDecimal);
    });
  } else {
    // Individual generator mode: only multiply unlocked generators
    const unlockedGenerators = generators.filter(gen => gen.unlocked);
    unlockedGenerators.forEach(gen => {
      const boxCount = state.boxesProducedByType[gen.reward] || new Decimal(0);
      const boxCountDecimal = DecimalUtils.isDecimal(boxCount) ? boxCount : new Decimal(boxCount);
      totalBoxes = totalBoxes.mul(boxCountDecimal);
    });
  }
  
  return totalBoxes;
}

// Helper function to calculate Mk.2 speed upgrade cost
function getMk2SpeedUpgradeCost() {
  // Initialize upgrade counter if it doesn't exist
  if (!state.mk2SpeedUpgrades) {
    state.mk2SpeedUpgrades = 0;
  }
  
  // Base cost: 1e20, scaling: x1e20 per upgrade
  const baseCost = new Decimal("1e20");
  const scalingFactor = new Decimal("1e20");
  const upgrades = new Decimal(state.mk2SpeedUpgrades);
  
  return baseCost.mul(scalingFactor.pow(upgrades));
}

// Helper function to calculate Double All Box Types upgrade cost
function getDoubleAllBoxCost() {
  // Initialize upgrade counter if it doesn't exist
  if (!state.doubleAllBoxUpgrades) {
    state.doubleAllBoxUpgrades = 0;
  }
  
  // Base cost: 50, scaling: x64 per upgrade
  const baseCost = new Decimal(50);
  const scalingFactor = new Decimal(300);
  const upgrades = new Decimal(state.doubleAllBoxUpgrades);
  
  return baseCost.mul(scalingFactor.pow(upgrades));
}

// Unified Mk.2 speed upgrade function
function upgradeMk2Speed() {
  // Mk.2 system works independently - no need to check for unlocked generators
  
  // Calculate cost based on combined box count and upgrade scaling
  const cost = getMk2SpeedUpgradeCost();
  const combinedBoxes = getCombinedBoxCount();
  
  // Check if we have enough combined boxes
  const canUpgrade = combinedBoxes.gte(cost);
  
  if (!canUpgrade) return;
  
  // Deduct the cost from combined box counts proportionally
  let remainingCost = cost;
  unlockedGenerators.forEach(gen => {
    if (remainingCost.lte(0)) return;
    
    const boxCount = state.boxesProducedByType[gen.reward] || new Decimal(0);
    const boxCountDecimal = DecimalUtils.isDecimal(boxCount) ? boxCount : new Decimal(boxCount);
    
    if (boxCountDecimal.gt(0)) {
      const deduction = DecimalUtils.min(boxCountDecimal, remainingCost);
      state.boxesProducedByType[gen.reward] = boxCountDecimal.sub(deduction);
      remainingCost = remainingCost.sub(deduction);
    }
  });
  
  // Increment upgrade counter
  if (!state.mk2SpeedUpgrades) {
    state.mk2SpeedUpgrades = 0;
  }
  state.mk2SpeedUpgrades++;
  
  // Upgrade all unlocked generators
  unlockedGenerators.forEach(gen => {
    const instantFill = gen.baseSpeed * Math.pow(1.3, (gen.speedUpgrades || 0)) * 0.1 >= 100;
    if (!instantFill) {
      gen.speedUpgrades = (gen.speedUpgrades || 0) + 1;
      gen.upgrades++;
      gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades);
    }
  });
  
  updateUI();
  updateKnowledgeUI();
  renderGenerators();
}

// Unified "Double all box type" upgrade function
function buyAllGeneratorUpgrades() {
  // Mk.2 system works independently - no need to check for unlocked generators
  
  // Calculate cost based on combined box count and upgrade scaling
  const cost = getDoubleAllBoxCost();
  const combinedBoxes = getCombinedBoxCount();
  
  // Check if we have enough combined boxes
  const canAfford = combinedBoxes.gte(cost);
  
  if (!canAfford) return;
  
  // Check if Box Generator Mk.2 is active for cost deduction
  let isBoxGeneratorMk2 = false;
  if (window.friendship && window.friendship.Generator) {
    isBoxGeneratorMk2 = window.friendship.Generator.level >= 10;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    isBoxGeneratorMk2 = friendship.Generator.level >= 10;
  }
  
  // Deduct the cost from combined box counts proportionally
  let remainingCost = cost;
  
  if (isBoxGeneratorMk2) {
    // Mk.2 mode: deduct proportionally from ALL box types
    const allBoxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
    const totalCombined = getCombinedBoxCount();
    
    allBoxTypes.forEach(boxType => {
      if (remainingCost.lte(0)) return;
      
      const boxCount = state.boxesProducedByType[boxType] || new Decimal(0);
      const boxCountDecimal = DecimalUtils.isDecimal(boxCount) ? boxCount : new Decimal(boxCount);
      
      if (boxCountDecimal.gt(0) && totalCombined.gt(0)) {
        // Deduct a small fraction proportional to the cost, not the full proportion
        const costFraction = cost.div(totalCombined).mul(0.01); // Only deduct 1% of the proportion
        const deduction = boxCountDecimal.mul(costFraction).floor();
        const finalDeduction = DecimalUtils.min(boxCountDecimal.sub(1), deduction); // Always leave at least 1 box
        
        if (finalDeduction.gt(0)) {
          state.boxesProducedByType[boxType] = boxCountDecimal.sub(finalDeduction);
          remainingCost = remainingCost.sub(finalDeduction);
        }
      }
    });
  } else {
    // Individual generator mode: only deduct from unlocked generators
    unlockedGenerators.forEach(gen => {
      if (remainingCost.lte(0)) return;
      
      const boxCount = state.boxesProducedByType[gen.reward] || new Decimal(0);
      const boxCountDecimal = DecimalUtils.isDecimal(boxCount) ? boxCount : new Decimal(boxCount);
      
      if (boxCountDecimal.gt(0)) {
        const deduction = DecimalUtils.min(boxCountDecimal, remainingCost);
        state.boxesProducedByType[gen.reward] = boxCountDecimal.sub(deduction);
        remainingCost = remainingCost.sub(deduction);
      }
    });
  }
  
  // Increment upgrade counter
  if (!state.doubleAllBoxUpgrades) {
    state.doubleAllBoxUpgrades = 0;
  }
  state.doubleAllBoxUpgrades++;
  
  // Apply the upgrade to all unlocked generators
  unlockedGenerators.forEach(gen => {
    if (!generatorUpgrades[gen.reward]) {
      generatorUpgrades[gen.reward] = new Decimal(0);
    }
    generatorUpgrades[gen.reward] = generatorUpgrades[gen.reward].add(1);
  });
  
  updateUI();
  renderGenerators();
}

// Function to update Mk.2 combined boxes display without re-rendering the entire interface
function updateMk2CombinedBoxesDisplay() {
  // Only update if we're in Mk.2 mode
  let isBoxGeneratorMk2 = false;
  if (window.friendship && window.friendship.Generator) {
    isBoxGeneratorMk2 = window.friendship.Generator.level >= 10;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    isBoxGeneratorMk2 = friendship.Generator.level >= 10;
  }
  
  if (!isBoxGeneratorMk2) return;
  
  // Update the entire tracker content with current box counts
  const tracker = document.querySelector('.mk2-tracker');
  if (tracker) {
    let boxBreakdown = '';
    generators.forEach(gen => {
      // Show all box types that have been produced, regardless of generator unlock status
      // This is important for Mk.2 Box Generator which produces all types
      if (state.boxesProducedByType && state.boxesProducedByType[gen.reward]) {
        const boxCount = DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward]) 
          ? state.boxesProducedByType[gen.reward] 
          : new Decimal(state.boxesProducedByType[gen.reward] || 0);
        
        // Only show if count is greater than 0
        if (boxCount.gt(0)) {
          boxBreakdown += `<div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 1.1em;">
            <span style="color: #${gen.reward === 'common' ? '87ceeb' : gen.reward === 'uncommon' ? '00ff00' : gen.reward === 'rare' ? 'ff0000' : gen.reward === 'legendary' ? 'ff8000' : '800080'};">
              ${gen.reward.charAt(0).toUpperCase() + gen.reward.slice(1)}:
            </span>
            <span>${formatNumber(boxCount)}</span>
          </div>`;
        }
      }
    });
    
    // Calculate combined boxes for display
    const combinedBoxes = getCombinedBoxCount();
    
    // Update the tracker content while preserving the structure
    tracker.innerHTML = `
      <div class="box-tracker-title" style="font-size: 1.1em; margin-bottom: 15px; text-align: center;">Total Boxes Produced</div>
      <div style="width: 100%; padding-top: 5px;">
        ${boxBreakdown}
      </div>
      <div class="combined-boxes-display" style="font-size: 1.1em; margin-top: 15px; text-align: center; padding-top: 10px; border-top: 1px solid rgba(33, 150, 243, 0.3); color: #87ceeb;">
        Combined Boxes: ${formatNumber(combinedBoxes)}
      </div>
    `;
  }
  
  // Update upgrade button costs and states
  const speedUpgradeBtn = document.getElementById('upgradeMk2Speed');
  if (speedUpgradeBtn) {
    const cost = getMk2SpeedUpgradeCost();
    const combinedBoxes = getCombinedBoxCount();
    const canAfford = combinedBoxes.gte(cost);
    
    speedUpgradeBtn.disabled = !canAfford;
    const costElement = speedUpgradeBtn.querySelector('small');
    if (costElement) {
      costElement.textContent = `Cost: ${formatNumber(cost)} combined boxes`;
    }
  }
  
  const doubleAllBtn = document.getElementById('doubleAllBoxTypes');
  if (doubleAllBtn) {
    const cost = getDoubleAllBoxCost();
    const combinedBoxes = getCombinedBoxCount();
    const canAfford = combinedBoxes.gte(cost);
    
    doubleAllBtn.disabled = !canAfford;
    const costElement = doubleAllBtn.querySelector('small');
    if (costElement) {
      costElement.textContent = `Cost: ${formatNumber(cost)} Combined Boxes`;
    }
  }
}

// Make Mk.2 functions globally accessible
window.upgradeMk2Speed = upgradeMk2Speed;
window.buyAllGeneratorUpgrades = buyAllGeneratorUpgrades;
window.updateMk2CombinedBoxesDisplay = updateMk2CombinedBoxesDisplay;

function updateGeneratorsUI(force) {
  const now = Date.now();
  if (!force && now - lastGeneratorUIUpdate < GENERATOR_UI_THROTTLE) return;
  lastGeneratorUIUpdate = now;
  generators.forEach((gen, i) => {
    const buyBtn = document.getElementById("buyGen" + i);
    const upgradeBtn = document.getElementById("upgradeGen" + i);
    if (buyBtn) {
      const buyCost = gen.baseCost;
      if (!gen.unlocked) {
        buyBtn.innerText = `Unlock (${formatNumber(gen.baseCost)} ${gen.currency})`;
        if (gen.currency === 'kp') {
          buyBtn.disabled = !DecimalUtils.isDecimal(swariaKnowledge.kp) || swariaKnowledge.kp.lt(buyCost);
        } else if (gen.currency === 'swaria coins') {
          buyBtn.disabled = !DecimalUtils.isDecimal(state.swaria) || state.swaria.lt(buyCost);
        } else {
          buyBtn.disabled = !DecimalUtils.isDecimal(state[gen.currency]) || state[gen.currency].lt(buyCost);
        }
      } else {
        buyBtn.innerText = "Unlocked";
        buyBtn.disabled = true;
      }
    }
    if (upgradeBtn) {
      if (!gen.unlocked) {
        upgradeBtn.disabled = true;
      } else {
        const instantFill = gen.speed * 0.1 >= 100;
        if (instantFill) {
          upgradeBtn.innerText = "Maxed";
          upgradeBtn.disabled = true;
        } else {
          const cost = DecimalUtils.multiply(gen.baseCost, new Decimal(gen.costMultiplier).pow(gen.upgrades));
          upgradeBtn.innerText = `Upgrade (${formatNumber(cost)} ${gen.currency})`;
          if (gen.currency === 'kp') {
            upgradeBtn.disabled = !DecimalUtils.isDecimal(swariaKnowledge.kp) || swariaKnowledge.kp.lt(cost);
          } else if (gen.currency === 'swaria coins') {
            upgradeBtn.disabled = !DecimalUtils.isDecimal(state.swaria) || state.swaria.lt(cost);
          } else {
            upgradeBtn.disabled = !DecimalUtils.isDecimal(state[gen.currency]) || state[gen.currency].lt(cost);
          }
        }
      }
    }
    const tracker = document.getElementById(`boxesProducedCount-${gen.reward}`);
    if (tracker) {
      // Ensure boxesProducedByType value is a Decimal
      if (!DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward])) {
        state.boxesProducedByType[gen.reward] = new Decimal(state.boxesProducedByType[gen.reward] || 0);
      }
      tracker.textContent = formatNumber(state.boxesProducedByType[gen.reward].floor());
    }
    if (boughtElements[11]) {
      const boostEl = document.getElementById(`boxBoost-${gen.reward}`);
      if (boostEl) {
        // Ensure boxesProducedByType value is a Decimal
        if (!DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward])) {
          state.boxesProducedByType[gen.reward] = new Decimal(state.boxesProducedByType[gen.reward] || 0);
        }
        const boxCount = state.boxesProducedByType[gen.reward].floor();
        const boost = new Decimal(1).add(boxCount.mul(0.01));
        let boostDisplay = formatNumber(boost);
        boostEl.textContent = `Current Boost: ×${boostDisplay} reward`;
      }
    }
  });
}

function tickGenerators(diff) {
  // Check if game is paused - if so, don't execute
  if (window.isGamePaused) {
    return;
  }
  
  // Prism lab operates independently of power status - always initialize when needed
  if (typeof window.initPrism === 'function') {
    const prismPowerOnline = true; // Prism lab is always considered online
    if (prismPowerOnline && !lastPrismPowerOnline) {
      window.initPrism();
    }
    lastPrismPowerOnline = prismPowerOnline;
  }
  if (state.powerStatus !== 'online' || state.powerEnergy.lte(0)) {
    generators.forEach((gen, i) => {
      let bar = document.getElementById("progress" + i);
      if (bar) {
        bar.style.width = "0%";
        bar.style.background = "#666";
        bar.classList.remove("fast");
      }
    });
    return;
  }
  // Check if Box Generator Mk.2 is active (Soap friendship level 10+)
  let isBoxGeneratorMk2 = false;
  if (window.friendship && window.friendship.Generator) {
    isBoxGeneratorMk2 = window.friendship.Generator.level >= 10;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    isBoxGeneratorMk2 = friendship.Generator.level >= 10;
  }
  
  if (isBoxGeneratorMk2) {
    // Reset all individual generator upgrades when in Mk.2 mode (one-time transition)
    // This ensures clean transition from individual upgrades to unified system
    if (!state.mk2UpgradesReset) {
      const unlockedGenerators = generators.filter(gen => gen.unlocked);
      let hasAnyUpgrades = false;
      unlockedGenerators.forEach(gen => {
        if (generatorUpgrades[gen.reward] && !generatorUpgrades[gen.reward].eq(0)) {
          hasAnyUpgrades = true;
          generatorUpgrades[gen.reward] = new Decimal(0);
        }
      });
      if (hasAnyUpgrades) {

      }
      state.mk2UpgradesReset = true;
    }
    
    // Box Generator Mk.2 mode: Use independent speed system
    // Always run Mk.2 logic when unlocked, regardless of individual generator status
    {
      // Create independent Mk.2 generator with its own speed system
      const mk2BaseSpeed = 10;
      const mk2SpeedUpgrades = state.mk2SpeedUpgrades || 0;
      const mk2Speed = mk2BaseSpeed * Math.pow(1.3, mk2SpeedUpgrades);
      
      // Initialize Mk.2 progress if not exists
      if (typeof state.mk2Progress === 'undefined') {
        state.mk2Progress = 0;
      }
      
      // Create virtual Mk.2 generator object
      const slowestGen = {
        speed: mk2Speed,
        progress: state.mk2Progress,
        reward: 'mk2-unified',
        baseSpeed: mk2BaseSpeed,
        speedUpgrades: mk2SpeedUpgrades,
        speedMultiplier: 1
      };
      
      // Mk.2 is never frozen by anomalies - it's independent
      const isFrozen = false;
      
      if (!isFrozen) {
        slowestGen.progress += slowestGen.speed * diff;
      }
      
      // Update Mk.2 progress bar
      let mk2Bar = document.getElementById("progress-mk2");
      let instantFill = slowestGen.speed * diff >= 100;
      
      if (slowestGen.progress >= 100) {
        slowestGen.progress = 0;
        
        // Generate all box types from unlocked generators using Mk.2 unified upgrade system

        // Use the unified "Double All Box Types" upgrade level for Mk.2
        const doubleAllUpgradeLevel = state.doubleAllBoxUpgrades || 0;
        const doubleAllUpgradeDecimal = new Decimal(doubleAllUpgradeLevel);
        const boxCountFromUpgrades = new Decimal(2).pow(doubleAllUpgradeDecimal);
        const rewardMultiplier = new Decimal(2).pow(doubleAllUpgradeDecimal);

        // Box Generator Mk.2 produces ALL box types, regardless of individual generator unlock status
        const allBoxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
        
        allBoxTypes.forEach(boxType => {
          let actualBoxCount = DecimalUtils.max(new Decimal(1), boxCountFromUpgrades);
          
          // Apply various box count boosts
          if (window._chargerBoxBoost && window._chargerBoxBoost > 1) {
            actualBoxCount = actualBoxCount.mul(window._chargerBoxBoost).floor();
          }
          
          // Apply yellow stable light buff to box generation
          if (typeof window.applyYellowStableLightBuff === 'function') {
            actualBoxCount = window.applyYellowStableLightBuff(actualBoxCount);
          }
          
          // Apply swaria infinity penalty to box generation count
          if (typeof window.applySwariaInfinityPenalty === 'function') {
            actualBoxCount = window.applySwariaInfinityPenalty(actualBoxCount).floor();
            // Ensure we always generate at least 1 box
            actualBoxCount = DecimalUtils.max(new Decimal(1), actualBoxCount);
          }
          
          const actualRewardMultiplier = DecimalUtils.max(new Decimal(1), rewardMultiplier);

          // Use earnBox to properly apply all boosts and penalties
          const gains = earnBox(boxType, actualRewardMultiplier, true, actualBoxCount) || { swariaGain: new Decimal(0), featherGain: new Decimal(0), artifactGain: new Decimal(0) };
          
          if (gains.swariaGain.gt(0)) showGainPopup("swariaGain", gains.swariaGain, "Swaria Coins");
          if (gains.featherGain.gt(0)) showGainPopup("featherGain", gains.featherGain, "Feathers");
          if (gains.artifactGain.gt(0)) showGainPopup("artifactGain", gains.artifactGain, "Artifacts");
        });
        
        // Track generator completion for front desk automator system
        // In Mk.2 mode, notify for all box types produced
        allBoxTypes.forEach(boxType => {
          if (typeof window.onGeneratorCompleted === 'function') {
            window.onGeneratorCompleted(boxType);
          }
        });
        
        // Update UI to refresh the Total Boxes Produced counts
        updateUI();
        
        // Update only the Mk.2 combined boxes display without re-rendering the entire interface
        updateMk2CombinedBoxesDisplay();
        
        // Spawn ingredient tokens from the Mk.2 tracker area
        if (window.spawnIngredientToken) {
          const genMainTab = document.getElementById('generatorMainTab');
          const genBoxArea = document.getElementById('generatorBoxGenArea');
          if (genMainTab && genMainTab.style.display !== 'none' && 
              genBoxArea && genBoxArea.style.display !== 'none') {
            // Try to spawn from the Mk.2 tracker area with enhanced spawn rates
            let trackerEl = document.querySelector('.mk2-tracker');
            if (trackerEl) {
              // Mk.2 gets 5x spawn chance and spawns 2 tokens
              window.spawnIngredientToken('generator', trackerEl, 5, 2);
            }
          }
        }
      }
      
      if (mk2Bar) {
        if (instantFill) {
          mk2Bar.style.width = "100%";
          mk2Bar.classList.add("fast");
          mk2Bar.style.background = "linear-gradient(90deg, #00cc00 40%, #eaffcc 60%, #00cc00 100%)";
        } else {
          mk2Bar.style.width = `${slowestGen.progress}%`;
          mk2Bar.classList.remove("fast");
          mk2Bar.style.background = "#00cc00";
        }
      }
      
      // Save Mk.2 progress back to state
      state.mk2Progress = slowestGen.progress;
    }
  } else {
    // Individual generator mode (original behavior)
    generators.forEach((gen, i) => {
      gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades || 0) * (gen.speedMultiplier || 1);
      if (gen.unlocked) {
        // Check if this generator is frozen by anomaly
        const isFrozen = window.anomalySystem && window.anomalySystem.isGeneratorFrozen && window.anomalySystem.isGeneratorFrozen(i);
        
        if (!isFrozen) {
          gen.progress += gen.speed * diff;
        }
        
        let bar = document.getElementById("progress" + i);
        let instantFill = gen.speed * diff >= 100;
        if (gen.progress >= 100) {
          gen.progress = 0;
          const upgradeLevel = generatorUpgrades[gen.reward] || new Decimal(0);
          const upgradeLevelDecimal = DecimalUtils.isDecimal(upgradeLevel) ? upgradeLevel : new Decimal(upgradeLevel);
          const boxCount = new Decimal(2).pow(upgradeLevelDecimal);
          const rewardMultiplier = new Decimal(2).pow(upgradeLevelDecimal);
          let actualBoxCount = DecimalUtils.max(new Decimal(1), boxCount);
          if (window._chargerBoxBoost && window._chargerBoxBoost > 1) {
            actualBoxCount = actualBoxCount.mul(window._chargerBoxBoost).floor();
          }
          
          // Apply yellow stable light buff to box generation
          if (typeof window.applyYellowStableLightBuff === 'function') {
            actualBoxCount = window.applyYellowStableLightBuff(actualBoxCount);
          }
          
          // Apply swaria infinity penalty to box generation count
          if (typeof window.applySwariaInfinityPenalty === 'function') {
            actualBoxCount = window.applySwariaInfinityPenalty(actualBoxCount).floor();
            // Ensure we always generate at least 1 box
            actualBoxCount = DecimalUtils.max(new Decimal(1), actualBoxCount);
          }
          const actualRewardMultiplier = DecimalUtils.max(new Decimal(1), rewardMultiplier);
          if (!boxTiers[gen.reward]) {
          }
          const gains = earnBox(gen.reward, actualRewardMultiplier, true, actualBoxCount) || { swariaGain: new Decimal(0), featherGain: new Decimal(0), artifactGain: new Decimal(0) };
          if (gains.swariaGain.gt(0)) showGainPopup("swariaGain", gains.swariaGain, "Swaria Coins");
          if (gains.featherGain.gt(0)) showGainPopup("featherGain", gains.featherGain, "Feathers");
          if (gains.artifactGain.gt(0)) showGainPopup("artifactGain", gains.artifactGain, "Artifacts");
          
          // Track generator completion for front desk automator system
          if (typeof window.onGeneratorCompleted === 'function') {
            window.onGeneratorCompleted(gen.reward);
          }
          
          updateUI(); 
          if (window.spawnIngredientToken) {
            const genMainTab = document.getElementById('generatorMainTab');
            const genBoxArea = document.getElementById('generatorBoxGenArea');
            if (genMainTab && genMainTab.style.display !== 'none' && 
                genBoxArea && genBoxArea.style.display !== 'none') {
              let barEl = document.getElementById("progress" + i);
              if (barEl) {
                window.spawnIngredientToken('generator', barEl);
              }
            }
          }
        }
        if (bar) {
          if (instantFill) {
            bar.style.width = "100%";
            bar.classList.add("fast");
            bar.style.background = "linear-gradient(90deg, #00cc00 40%, #eaffcc 60%, #00cc00 100%)";
          } else {
            bar.style.width = `${gen.progress}%`;
            bar.classList.remove("fast");
            bar.style.background = "#00cc00";
          }
        }
      }
    });
  }
  updateUI(); 
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generatorSubTabBtn");
  if (btn) {
    btn.style.display = boughtElements[7] ? "inline-block" : "none";
  }
  if (typeof window.trackElementDiscovery === 'function' && boughtElements) {
    window.trackElementDiscovery(boughtElements);
  }
  // Update prism navigation on page load
  updatePrismAdvancedButtonVisibility();
  
  // Also ensure it's called after a short delay in case elements aren't fully loaded yet
  setTimeout(() => {
    updatePrismAdvancedButtonVisibility();
  }, 100);
});

function showGainPopup(id, amount, label) {
  const el = document.getElementById(id);
  if (!el) return;
  let formattedAmount;
  if (typeof amount === 'string') {
    formattedAmount = amount;
  } else if (DecimalUtils.isDecimal(amount)) {
    formattedAmount = formatNumber(amount);
  } else {
    formattedAmount = formatNumber(new Decimal(amount));
  }
  el.textContent = `+${formattedAmount} ${label}`;
  el.classList.add("show");
  setTimeout(() => {
    el.classList.remove("show");
  }, 600); 
}



function switchSettingsSubTab(tabId) {
  document.getElementById('settingsSavesTab').style.display = 'none';
  document.getElementById('settingsStatsTab').style.display = 'none';
  document.getElementById('settingsCreditsTab').style.display = 'none';
  document.getElementById('settingsRecoveryTab').style.display = 'none';
  document.getElementById('settingsHardModeTab').style.display = 'none';
  document.getElementById('settingsSavesTabBtn').classList.remove('active');
  document.getElementById('settingsStatsTabBtn').classList.remove('active');
  document.getElementById('settingsCreditsTabBtn').classList.remove('active');
  document.getElementById('settingsRecoveryTabBtn').classList.remove('active');
  document.getElementById('settingsHardModeTabBtn').classList.remove('active');
  document.getElementById(tabId).style.display = 'block';
  if (tabId === 'settingsSavesTab') {
    document.getElementById('settingsSavesTabBtn').classList.add('active');
  } else if (tabId === 'settingsStatsTab') {
    document.getElementById('settingsStatsTabBtn').classList.add('active');
  } else if (tabId === 'settingsCreditsTab') {
    document.getElementById('settingsCreditsTabBtn').classList.add('active');
  } else if (tabId === 'settingsRecoveryTab') {
    document.getElementById('settingsRecoveryTabBtn').classList.add('active');
  } else if (tabId === 'settingsHardModeTab') {
    document.getElementById('settingsHardModeTabBtn').classList.add('active');
  }
}
const origShowPage = window.showPage || (typeof showPage === 'function' && showPage);
window.showPage = function(pageId) {
  if (origShowPage) origShowPage.apply(this, arguments);
  document.getElementById('settingsSubTabBar').style.display = (pageId === 'settings') ? 'flex' : 'none';
};
let hardModeQuestActive = false; 
let hardModeQuestProgress = {
  berryTokens: 0,
  stardustTokens: 0,
  berryPlateTokens: 0,
  mushroomSoupTokens: 0,
  prismClicks: 0,
  commonBoxes: 0,
  flowersWatered: 0,
  powerRefills: 0,
  soapPokes: 0,
  ingredientsCooked: 0
};
const hardModeQuestRequirements = {
  berryTokens: 10000,
  stardustTokens: 3000,
  berryPlateTokens: 500,
  mushroomSoupTokens: 500,
  prismClicks: 72700,
  commonBoxes: 690000,
  flowersWatered: 69420,
  powerRefills: 1500,
  soapPokes: 10000,
  ingredientsCooked: 1500
};
const hardModeSwariaMessages = [
  "Don't do this, it's impossible!",
  "Stop! You'll never complete this!",
  "This is madness!",
  "You're wasting your time!",
  "Give up already!",
  "This quest is designed to be impossible!",
  "Why are you even trying?",
  "You'll regret starting this!",
  "This will take forever!",
  "Are you really that determined?",
  "This is only for the most stubborn of people. Kito.",
  "You'll be here until the heat death of the universe!",
  "I've seen glaciers move faster than your progress!",
  "Even a snail would give up on this!",
  "You're more stubborn than a mule!",
  "This is the definition of insanity!",
  "You could have learned quantum physics by now!",
  "A rock has more sense than you!",
  "You're like a broken record player!",
  "Oh look, you're still here...",
  "Surprise, surprise, still grinding away!",
  "Wow, you haven't given up yet?",
  "Color me impressed... not!",
  "You must really love suffering!",
  "This is your idea of fun?",
  "Someone needs a hobby!",
  "You could be doing literally anything else!",
  "I bet your friends are worried about you!",
  "This is only quest 1 out of 5.",
  "At this rate, you'll finish in 47 years!",
  "You've completed 0.001% of the quest!",
  "Your progress is statistically insignificant!",
  "The numbers don't lie, you're doomed!",
  "You're moving at negative velocity!",
  "Your efficiency is below zero!",
  "Even a calculator would give up!",
  "The math says you should quit!",
  "Your progress curve is flatlining!",
  "You could have written a novel by now!",
  "Time is money, and you're wasting both!",
  "Your ancestors will be proud... of your persistence!",
  "Future generations will study your dedication!",
  "You'll be old and gray before you finish!",
  "This quest spans multiple lifetimes!",
  "You're aging faster than you're progressing!",
  "Time flies when you're doing nothing useful!",
  "Your youth is slipping away!",
  "You could have built a time machine by now!",
  "What is the meaning of life? Certainly not this!",
  "This is an existential crisis waiting to happen!",
  "You're like Sisyphus pushing his boulder!",
  "The universe is laughing at you!",
  "You're fighting against entropy itself!",
  "This is a metaphor for futility!",
  "You're the definition of perseverance!",
  "The gods are testing your patience!",
  "You're challenging the very fabric of space-time!",
  "I've seen paint dry faster than this!",
  "This is the most pointless quest in the game!",
  "This is the quest that will break Kito.",
  "Nothing will be earned from this quest.",
  "You need therapy after this quest.",
  "Plz stop.",
];
function startHardModeQuest() {
  if (state.hardModeQuestActive) return;
  state.hardModeQuestActive = true;
  showHardModeSwariaMessage();
  updateHardModeQuestProgress();
}
function autoStartHardModeQuest() {
  if (!state.hardModeQuestActive && state.seenNectarizeResetStory) {
    startHardModeQuest();
    if (typeof saveGame === 'function') {
      saveGame();
    }
    if (typeof updateHardModeQuestProgress === 'function') {
      updateHardModeQuestProgress();
    }
  }
}
function showHardModeSwariaMessage() {
  const swariaImg = document.getElementById('hardModeSwariaImg');
  const speechBubble = document.getElementById('hardModeSwariaSpeech');
  if (!swariaImg || !speechBubble) return;
  if (window.hardModeSpeechTimer) {
    clearTimeout(window.hardModeSpeechTimer);
  }
        swariaImg.querySelector('img').src = getHardModeQuestCharacterImage(true); 
  const randomMessage = hardModeSwariaMessages[Math.floor(Math.random() * hardModeSwariaMessages.length)];
  speechBubble.textContent = randomMessage;
  speechBubble.style.display = 'block';
  window.hardModeSpeechTimer = setTimeout(() => {
    speechBubble.style.display = 'none';
          swariaImg.querySelector('img').src = getHardModeQuestCharacterImage(false); 
    window.hardModeSpeechTimer = null;
  }, 5000);
}
function updateHardModeQuestProgress() {
  if (!state.hardModeQuestActive) return;
  hardModeQuestActive = state.hardModeQuestActive;
  hardModeQuestProgress = state.hardModeQuestProgress;
  document.getElementById('hardModeBerryProgress').textContent = `${state.hardModeQuestProgress.berryTokens.toLocaleString()} / ${hardModeQuestRequirements.berryTokens.toLocaleString()}`;
  document.getElementById('hardModeStardustProgress').textContent = `${state.hardModeQuestProgress.stardustTokens.toLocaleString()} / ${hardModeQuestRequirements.stardustTokens.toLocaleString()}`;
  document.getElementById('hardModeBerryPlateProgress').textContent = `${state.hardModeQuestProgress.berryPlateTokens.toLocaleString()} / ${hardModeQuestRequirements.berryPlateTokens.toLocaleString()}`;
  document.getElementById('hardModeMushroomSoupProgress').textContent = `${state.hardModeQuestProgress.mushroomSoupTokens.toLocaleString()} / ${hardModeQuestRequirements.mushroomSoupTokens.toLocaleString()}`;
  document.getElementById('hardModePrismClicksProgress').textContent = `${state.hardModeQuestProgress.prismClicks.toLocaleString()} / ${hardModeQuestRequirements.prismClicks.toLocaleString()}`;
  document.getElementById('hardModeCommonBoxesProgress').textContent = `${state.hardModeQuestProgress.commonBoxes.toLocaleString()} / ${hardModeQuestRequirements.commonBoxes.toLocaleString()}`;
  document.getElementById('hardModeFlowersWateredProgress').textContent = `${state.hardModeQuestProgress.flowersWatered.toLocaleString()} / ${hardModeQuestRequirements.flowersWatered.toLocaleString()}`;
  document.getElementById('hardModePowerRefillsProgress').textContent = `${state.hardModeQuestProgress.powerRefills.toLocaleString()} / ${hardModeQuestRequirements.powerRefills.toLocaleString()}`;
  document.getElementById('hardModeSoapPokesProgress').textContent = `${state.hardModeQuestProgress.soapPokes.toLocaleString()} / ${hardModeQuestRequirements.soapPokes.toLocaleString()}`;
  document.getElementById('hardModeIngredientsCookedProgress').textContent = `${state.hardModeQuestProgress.ingredientsCooked.toLocaleString()} / ${hardModeQuestRequirements.ingredientsCooked.toLocaleString()}`;
  updateQuestItemCompletion('hardModeBerryProgress', state.hardModeQuestProgress.berryTokens >= hardModeQuestRequirements.berryTokens);
  updateQuestItemCompletion('hardModeStardustProgress', state.hardModeQuestProgress.stardustTokens >= hardModeQuestRequirements.stardustTokens);
  updateQuestItemCompletion('hardModeBerryPlateProgress', state.hardModeQuestProgress.berryPlateTokens >= hardModeQuestRequirements.berryPlateTokens);
  updateQuestItemCompletion('hardModeMushroomSoupProgress', state.hardModeQuestProgress.mushroomSoupTokens >= hardModeQuestRequirements.mushroomSoupTokens);
  updateQuestItemCompletion('hardModePrismClicksProgress', state.hardModeQuestProgress.prismClicks >= hardModeQuestRequirements.prismClicks);
  updateQuestItemCompletion('hardModeCommonBoxesProgress', state.hardModeQuestProgress.commonBoxes >= hardModeQuestRequirements.commonBoxes);
  updateQuestItemCompletion('hardModeFlowersWateredProgress', state.hardModeQuestProgress.flowersWatered >= hardModeQuestRequirements.flowersWatered);
  updateQuestItemCompletion('hardModePowerRefillsProgress', state.hardModeQuestProgress.powerRefills >= hardModeQuestRequirements.powerRefills);
  updateQuestItemCompletion('hardModeSoapPokesProgress', state.hardModeQuestProgress.soapPokes >= hardModeQuestRequirements.soapPokes);
  updateQuestItemCompletion('hardModeIngredientsCookedProgress', state.hardModeQuestProgress.ingredientsCooked >= hardModeQuestRequirements.ingredientsCooked);
  checkHardModeQuestCompletion();
}
function updateQuestItemCompletion(progressId, isCompleted) {
  const progressElement = document.getElementById(progressId);
  if (!progressElement) return;
  const questItem = progressElement.closest('.quest-item');
  if (questItem) {
    if (isCompleted) {
      questItem.classList.add('completed');
    } else {
      questItem.classList.remove('completed');
    }
  }
}
function checkHardModeQuestCompletion() {
  const allComplete = 
    state.hardModeQuestProgress.berryTokens >= hardModeQuestRequirements.berryTokens &&
    state.hardModeQuestProgress.stardustTokens >= hardModeQuestRequirements.stardustTokens &&
    state.hardModeQuestProgress.berryPlateTokens >= hardModeQuestRequirements.berryPlateTokens &&
    state.hardModeQuestProgress.mushroomSoupTokens >= hardModeQuestRequirements.mushroomSoupTokens &&
    state.hardModeQuestProgress.prismClicks >= hardModeQuestRequirements.prismClicks &&
    state.hardModeQuestProgress.commonBoxes >= hardModeQuestRequirements.commonBoxes &&
    state.hardModeQuestProgress.flowersWatered >= hardModeQuestRequirements.flowersWatered &&
    state.hardModeQuestProgress.powerRefills >= hardModeQuestRequirements.powerRefills &&
    state.hardModeQuestProgress.soapPokes >= hardModeQuestRequirements.soapPokes &&
    state.hardModeQuestProgress.ingredientsCooked >= hardModeQuestRequirements.ingredientsCooked;
  if (allComplete) {
    completeHardModeQuest();
  }
}
function completeHardModeQuest() {
  const questStatus = document.getElementById('hardModeQuestStatus');
  if (questStatus) {
    questStatus.textContent = 'Quest Cheated!';
    questStatus.style.background = '#17a2b8';
  }
  const speechBubble = document.getElementById('hardModeSwariaSpeech');
  if (speechBubble) {
    speechBubble.textContent = "I... You cheated!";
    speechBubble.style.display = 'block';
  }
  if (typeof window.trackHardModeQuestCompletion === 'function') {
    window.trackHardModeQuestCompletion();
  }
}
function trackHardModePrismClick() {
  if (state.hardModeQuestActive) {
    state.hardModeQuestProgress.prismClicks++;
    updateHardModeQuestProgress();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
  if (typeof window.trackPrismLabClick === 'function') {
    window.trackPrismLabClick();
  }
}
function trackHardModeFlowerWatered() {
  if (state.hardModeQuestActive) {
    state.hardModeQuestProgress.flowersWatered++;
    updateHardModeQuestProgress();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}
function trackHardModePowerRefill() {
  if (state.hardModeQuestActive) {
    state.hardModeQuestProgress.powerRefills++;
    updateHardModeQuestProgress();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}
function trackHardModeCommonBox() {
  if (state.hardModeQuestActive) {
    state.hardModeQuestProgress.commonBoxes++;
    updateHardModeQuestProgress();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}
function trackHardModeSoapPoke() {
  if (state.hardModeQuestActive) {
    state.hardModeQuestProgress.soapPokes++;
    updateHardModeQuestProgress();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}
function trackHardModeIngredientsCooked() {
  if (state.hardModeQuestActive) {
    state.hardModeQuestProgress.ingredientsCooked++;
    updateHardModeQuestProgress();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}
function checkHardModeTabButtonVisibility() {
  if (window.hardModePermanentlyUnlocked || 
      state.seenNectarizeResetStory || 
      (window.nectarizeResets && window.nectarizeResets >= 1)) {
    const hardModeTabBtn = document.getElementById('settingsHardModeTabBtn');
    if (hardModeTabBtn) {
      hardModeTabBtn.style.display = 'inline-block';
    }
    if (!window.hardModePermanentlyUnlocked) {
      window.hardModePermanentlyUnlocked = true;
    }
  }
}
window.trackHardModePrismClick = trackHardModePrismClick;
window.trackHardModeFlowerWatered = trackHardModeFlowerWatered;
window.trackHardModePowerRefill = trackHardModePowerRefill;
window.trackHardModeCommonBox = trackHardModeCommonBox;
window.trackHardModeSoapPoke = trackHardModeSoapPoke;
window.trackHardModeIngredientsCooked = trackHardModeIngredientsCooked;
window.updateHardModeQuestProgress = updateHardModeQuestProgress;
window.autoStartHardModeQuest = autoStartHardModeQuest;
window.checkHardModeTabButtonVisibility = checkHardModeTabButtonVisibility;
document.addEventListener('DOMContentLoaded', function() {
  const swariaImg = document.getElementById('hardModeSwariaImg');
  if (swariaImg) {
    swariaImg.addEventListener('click', showHardModeSwariaMessage);
  }
  checkHardModeTabButtonVisibility();
  autoStartHardModeQuest();
  if (state.hardModeQuestActive) {
    updateHardModeQuestProgress();
  }
  
  // Initialize infinity sub-tab visibility
  setTimeout(() => {
    updateInfinitySubTabVisibility();
    
    // Infinity data is now handled by unified save slot system
    if (typeof updateInfinityBenefits === 'function') {
      updateInfinityBenefits();
    }
    
    // Check for pending story modals after page load/reload
    checkForPendingStoryModals();
  }, 100);
  
  setTimeout(() => {
    if (typeof window.syncTerrariumVarsFromWindow === 'function') {
      window.syncTerrariumVarsFromWindow();
    }
    // Initialize infinity challenges system
    if (typeof window.initializeInfinityChallenges === 'function') {
      window.initializeInfinityChallenges();
    }
  }, 500);
});

// Debug function to test wing artifact boost
window.testWingArtifactBoost = function() {



  // Test with no artifacts
  const originalArtifacts = state.artifacts;
  state.artifacts = new Decimal(0);
  const baseRate = getFluffRate();

  // Test with 1 artifact
  state.artifacts = new Decimal(1);
  const rateWith1 = getFluffRate();



  // Test with 2 artifacts
  state.artifacts = new Decimal(2);
  const rateWith2 = getFluffRate();



  // Test with 10 artifacts
  state.artifacts = new Decimal(10);
  const rateWith10 = getFluffRate();



  // Restore original value
  state.artifacts = originalArtifacts;


};

// Test functions for Elements 21, 22, 23
window.testElement21 = function() {


  const basePollen = 100;
  let actualPollen = basePollen;
  
  if (boughtElements[21]) {
    actualPollen = basePollen * 10;

  } else {

  }


  // Test actual terrarium pollen gain if terrarium is available
  if (typeof window.terrariumPollen !== 'undefined') {

  }
};

window.testElement22 = function() {


  const baseFlowers = 50;
  let actualFlowers = baseFlowers;
  
  if (boughtElements[22]) {
    actualFlowers = baseFlowers * 5;

  } else {

  }


  // Test actual terrarium flowers if available
  if (typeof window.terrariumFlowers !== 'undefined') {

  }
};

window.testElement23 = function() {


  const baseXP = 10;
  let actualXP = baseXP;
  
  if (boughtElements[23]) {
    actualXP = baseXP * 3;

  } else {

  }


  // Test actual terrarium XP if available
  if (typeof window.terrariumXP !== 'undefined') {

  }
};

window.testAllTerrariumElements = function() {

  window.testElement21();

  window.testElement22();

  window.testElement23();

};

// Grant elements for testing (WARNING: Cheating function!)
window.grantElement = function(index) {
  if (!boughtElements[index]) {
    boughtElements[index] = true;
    window.boughtElements = boughtElements;
    if (typeof applyElementEffect === 'function') {
      applyElementEffect(index);
    }
    if (typeof renderElementGrid === 'function') {
      renderElementGrid();
    }
    if (typeof updateTerrariumUI === 'function') {
      updateTerrariumUI();
    }

  } else {

  }
};

// Grant multiple elements
window.grantElements = function(...indices) {
  indices.forEach(index => window.grantElement(index));
};

// Grant all terrarium elements for testing
window.grantTerrariumElements = function() {

  window.grantElements(21, 22, 23);

};

// Test function specifically for Fluzzer pollen/flower gain
window.testFluzzerGain = function() {

  // Check elements
  const elementsRef = (typeof boughtElements !== 'undefined') ? boughtElements : window.boughtElements;




  // Check terrarium state
  if (typeof window.terrariumPollen !== 'undefined') {

  } else {

  }
  
  if (typeof window.terrariumFlowers !== 'undefined') {

  } else {

  }
  
  if (typeof window.terrariumXP !== 'undefined') {

  } else {

  }
  
  // Check charger terrarium boost

  // Check if charger boost function exists


};

// Test charger boost application directly
window.testChargerBoost = function() {


  if (typeof window.applyChargerTerrariumBoost === 'function') {
    const testPollen = 100;
    const testFlowers = 50;

    const result = window.applyChargerTerrariumBoost(testPollen, testFlowers);



  } else {

  }
};

// Debug function to check boughtElements state
window.debugBoughtElements = function() {










};

// Testing functions for infinity export/import
function testInfinityExportImport() {

    // Store original values
    const originalInfinityPoints = window.infinitySystem ? window.infinitySystem.infinityPoints.toString() : "0";
    const originalTheorems = window.infinitySystem ? window.infinitySystem.infinityTheorems : 0;
    const originalTotalEarned = window.infinitySystem ? window.infinitySystem.totalInfinityEarned : 0;
    const originalUpgrades = window.infinityUpgrades ? {...window.infinityUpgrades} : {};
    const originalEverReached = window.infinitySystem ? {...window.infinitySystem.everReached} : {};
    const originalCaps = window.infinityCaps ? {...window.infinityCaps} : {};
    const originalActiveChallenge = window.activeChallenge || 0;
    const originalActiveDifficulty = window.activeDifficulty || 0;






    // Test if infinity data is included in export
    if (typeof exportSave === 'function') {

        // Simulate the export process
        const save = {
            infinityTreeData: window.infinitySystem ? {
                infinityPoints: window.infinitySystem.infinityPoints.toString(),
                infinityTheorems: window.infinitySystem.infinityTheorems,
                theoremProgress: window.infinitySystem.theoremProgress.toString(),
                totalInfinityEarned: window.infinitySystem.totalInfinityEarned,
                upgrades: window.infinityUpgrades ? window.infinityUpgrades : {},
                everReached: window.infinitySystem.everReached || {},
                caps: window.infinityCaps || {}
            } : null,
            infinityChallengeData: (typeof window.infinityChallenges !== 'undefined' && typeof window.activeChallenge !== 'undefined' && typeof window.activeDifficulty !== 'undefined') ? {
                challenges: window.infinityChallenges,
                activeChallenge: window.activeChallenge,
                activeDifficulty: window.activeDifficulty
            } : null
        };
        
        if (save.infinityTreeData) {




        } else {

        }
        
        if (save.infinityChallengeData) {



        } else {

        }
    } else {

    }
    
    if (typeof importSave === 'function') {

    } else {

    }

}

// Test function to verify save slot isolation for infinity data
function testInfinitySaveSlotIsolation() {

    // Check current save slot
    const currentSlot = localStorage.getItem('currentSaveSlot');

    // Check if infinity system exists
    if (!window.infinitySystem) {

        return;
    }




    // Check what's in the main save vs slot-specific save
    const mainSave = localStorage.getItem('swariaSave');
    const slotSave = currentSlot ? localStorage.getItem(`swariaSaveSlot${currentSlot}`) : null;
    const infinitySlotData = currentSlot ? localStorage.getItem(`infinitySystemData_${currentSlot}`) : localStorage.getItem('infinitySystemData_default');

    if (mainSave) {
        try {
            const mainData = JSON.parse(mainSave);

            if (mainData.infinityTreeData) {


            }
        } catch (e) {

        }
    } else {

    }
    
    if (slotSave) {
        try {
            const slotData = JSON.parse(slotSave);

            if (slotData.infinityTreeData) {


            }
        } catch (e) {

        }
    } else {

    }
    
    if (infinitySlotData) {
        try {
            const infinityData = JSON.parse(infinitySlotData);



        } catch (e) {

        }
    } else {

    }
    
    // Recommendations

    if (currentSlot) {




    } else {



    }

}

// Function to check for pending story modals that should be shown after page reload
function checkForPendingStoryModals() {
    if (!window.state) return;
    
    // Initialize flag if it doesn't exist
    if (typeof window.state.seenInfinityResetStory === 'undefined') {
        window.state.seenInfinityResetStory = false;
    }
    
    // Check if we need to show the infinity reset story modal from actual reset
    if (window.state.pendingInfinityResetStory && !window.state.seenInfinityResetStory) {
        // Clear the pending flag and mark story as seen
        window.state.pendingInfinityResetStory = false;
        window.state.seenInfinityResetStory = true;
        if (typeof saveGame === 'function') saveGame();
        
        // Show the modal after a short delay to ensure page is fully loaded
        setTimeout(() => {
            if (typeof window.showInfinityResetStoryModal === 'function') {
                window.showInfinityResetStoryModal();
            }
        }, 1000);
        return;
    }
    
    // Automatic trigger - show modal when player has totalInfinityEarned >= 1 (only once)
    var infinityEarned = window.infinitySystem && window.infinitySystem.totalInfinityEarned ? window.infinitySystem.totalInfinityEarned : 0;
    if (infinityEarned >= 1 && !window.state.seenInfinityResetStory) {
        window.state.seenInfinityResetStory = true;
        if (typeof saveGame === 'function') saveGame();
        
        setTimeout(() => {
            if (typeof window.showInfinityResetStoryModal === 'function') {
                window.showInfinityResetStoryModal();
            }
        }, 100);
        return;
    }
}

window.testInfinitySaveSlotIsolation = testInfinitySaveSlotIsolation;

// Test function for infinity reset story modal
function testInfinityResetStoryModal() {
    // Check current state
    if (!window.state) window.state = {};
    if (!window.infinitySystem) return;
    
    // Ensure player has at least 1 infinity for testing
    if (window.infinitySystem.totalInfinityEarned < 1) {
        window.infinitySystem.totalInfinityEarned = 1;
    }
    
    // Test the automatic trigger
    setTimeout(() => {
        checkForPendingStoryModals();
    }, 100);
}

window.testInfinityResetStoryModal = testInfinityResetStoryModal;

// ===== COMPREHENSIVE GLOBAL ACCESSIBILITY ASSIGNMENTS =====
// Ensure all critical functions and variables are available through window

// Make all remaining functions globally accessible
window.checkForPendingStoryModals = checkForPendingStoryModals;
window.testInfinitySaveSlotIsolation = testInfinitySaveSlotIsolation;

// ===== GLOBAL ACCESSIBILITY VERIFICATION =====
// Function to verify all critical variables and functions are globally accessible
window.verifyGlobalAccessibility = function() {

    const criticalItems = [
        // Core game state
        'state', 'settings', 'swariaKnowledge', 'boughtElements', 'elementData',
        'generators', 'generatorUpgrades', 'achievements',
        
        // Key functions from script.js
        'gameTick', 'formatNumber', 'addCurrency', 'sanityCheckCurrencies',
        'recalculateAllElementEffects', 'getCombinedInfinityCount',
        
        // Swaria system from script2.js
        'swariaQuotes', 'showSwariaSpeech', 'updateElementTileVisual',
        
        // Optimization and utility systems
        'gameOptimization', 'DecimalUtils', 'infinitySystem', 'anomalySystem',
        
        // Prism system
        'prismState', 'lightGeneratorConfigs',
        
        // Boost and UI systems from script3.js
        'deliverButtonCooldown', 'boostDisplayCard',
        
        // Stats and friendship system
        'MAX_FRIENDSHIP_LEVEL', 'getFriendshipPointsForLevel', 'charToDept',
        
        // Kitchen system
        'recipes', 'INGREDIENT_TYPES', 'INGREDIENT_TYPE_IMAGES', 'getRandomIngredientType',
        
        // Terrarium systems
        'fluzzerWelcomeSpeech', 'terrariumPollen', 'terrariumFlowers', 'terrariumNectar',
        'getCurrentFlowerGridDimensions', 'nectarizeMilestoneData', 'checkNectarizeMilestones',
        
        // Front desk system
        'FrontDesk', 'frontDesk',
        
        // Charger system
        'charger', 'chargerBtn',
        
        // Merchant/Boutique system
        'Boutique', 'boutique'
    ];
    
    const missing = [];
    const available = [];
    
    criticalItems.forEach(item => {
        if (typeof window[item] !== 'undefined') {
            available.push(item);
        } else {
            missing.push(item);
        }
    });

    if (missing.length > 0) {

    } else {

    }
    
    return { available, missing, total: criticalItems.length };
};

window.testInfinityExportImport = testInfinityExportImport;

// === OFFLINE PROGRESS PREVENTION ===
let isGamePaused = false;
window.isGamePaused = false; // Make globally accessible
let originalIntervals = {
  tickInterval: null,
  gameTickInterval: null,
  autosaveInterval: null,
  swariaSpeechInterval: null,
  secondaryTickInterval: null,
  deliverButtonStateInterval: null,
  deliverButtonCooldownInterval: null,
  boostDisplayInterval: null,
  fluzzerTimerInterval: null,
  flowerRegrowthTimer: null,
  createSleepButtonInterval: null,
  mainGameTickInterval: null,
  autosaveInterval2: null,
  advancedPrismCalibrationInterval: null,
  swariaSpeechInterval: null,
  digitalClockInterval: null,
  daynightMainInterval: null,
  cafeteriaMealInterval1: null,
  cafeteriaMealInterval2: null,
  kitchenVisibilityInterval: null,
  kitchenVisibilityInterval2: null,
  kitchenCookingInterval: null,
  prismNerfDisplayInterval: null,
  generatorDarknessInterval: null,
  fluzzerAITimer: null,
  fluzzerSpeechTimer: null,
  fluzzerClickTimer: null,
  fluzzerSpeedBoostTimer: null,
  rustlingFlowerTimer: null,
  anomalyDarkVoidProgressTimer: null,
  anomalyViPanicInterval: null,
  anomalyCursorAnimationInterval: null,
  anomalyClockAnomalyInterval: null,
  anomalyBackwardClockAnomalyInterval: null
};

// Store the terrarium RAF state
let terrariumRAFPaused = false;
let originalRequestAnimationFrame = null;

function setupOfflineProgressPrevention() {

  // Add window focus/blur event listeners
  window.addEventListener('focus', handleWindowFocus);
  window.addEventListener('blur', handleWindowBlur);
  
  // Also listen for visibility change events (more reliable)
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Check if window is already not focused and pause if needed
  if (document.hidden) {

    pauseGame();
  } else if (!document.hasFocus()) {

    pauseGame();
  }
}

function removeOfflineProgressPrevention() {

  // Remove event listeners
  window.removeEventListener('focus', handleWindowFocus);
  window.removeEventListener('blur', handleWindowBlur);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  
  // Remove click/keyboard resume listeners
  removeResumeClickListener();
  
  // Resume game if paused
  if (isGamePaused) {
    resumeGame();
  }
}

function handleWindowFocus() {
  if (settings.disableOfflineProgress && isGamePaused) {

    // Don't auto-resume on focus, wait for user to click or press key
    showPauseIndicator();
  }
}

function handleWindowBlur() {
  if (settings.disableOfflineProgress && !isGamePaused) {

    pauseGame();
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    // Page is hidden - pause the game
    if (settings.disableOfflineProgress && !isGamePaused) {

      pauseGame();
    }
  } else {
    // Page is visible again - but don't auto-resume!
    // Let the user manually resume by clicking or pressing a key
    if (settings.disableOfflineProgress && isGamePaused) {

      // Just ensure the pause indicator is showing, but don't auto-resume
      showPauseIndicator();
    }
  }
}

function pauseGame() {
  if (isGamePaused) return;
  
  isGamePaused = true;
  window.isGamePaused = true; // Update global variable





  // Store current intervals before clearing them
  originalIntervals.tickInterval = window.tickInterval;
  originalIntervals.gameTickInterval = window._gameTickInterval;
  
  // Clear main game intervals - this is the most critical part!
  if (window.tickInterval) {

    clearInterval(window.tickInterval);
    window.tickInterval = null;
  }
  if (window._gameTickInterval) {

    clearInterval(window._gameTickInterval);
    window._gameTickInterval = null;
  }
  
  // Pause secondary tick interval (script2.js) - this is crucial!
  if (window.secondaryTickInterval) {

    originalIntervals.secondaryTickInterval = window.secondaryTickInterval;
    clearInterval(window.secondaryTickInterval);
    window.secondaryTickInterval = null;
  }
  
  // Pause additional main game tick intervals from script2.js
  if (window._mainGameTickInterval) {

    originalIntervals.mainGameTickInterval = window._mainGameTickInterval;
    clearInterval(window._mainGameTickInterval);
    window._mainGameTickInterval = null;
  }
  if (window._autosaveInterval) {
    originalIntervals.autosaveInterval2 = window._autosaveInterval;
    clearInterval(window._autosaveInterval);
    window._autosaveInterval = null;
  }
  
  // Pause delivery button intervals (script3.js)
  if (window.deliverButtonStateInterval) {
    originalIntervals.deliverButtonStateInterval = window.deliverButtonStateInterval;
    clearInterval(window.deliverButtonStateInterval);
    window.deliverButtonStateInterval = null;
  }
  if (window.deliverButtonCooldown && window.deliverButtonCooldown.interval) {
    originalIntervals.deliverButtonCooldownInterval = window.deliverButtonCooldown.interval;
    clearInterval(window.deliverButtonCooldown.interval);
    window.deliverButtonCooldown.interval = null;
  }
  
  // Pause boost display interval (script3.js)
  if (window.boostDisplayInterval) {
    originalIntervals.boostDisplayInterval = window.boostDisplayInterval;
    clearInterval(window.boostDisplayInterval);
    window.boostDisplayInterval = null;
  }
  
  // Pause terrarium intervals
  if (window.fluzzerTimerInterval) {
    originalIntervals.fluzzerTimerInterval = window.fluzzerTimerInterval;
    clearInterval(window.fluzzerTimerInterval);
    window.fluzzerTimerInterval = null;
  }
  
  // Pause fluzzer AI and speech timers
  if (window.fluzzerAITimer) {
    originalIntervals.fluzzerAITimer = window.fluzzerAITimer;
    clearTimeout(window.fluzzerAITimer);
    window.fluzzerAITimer = null;
  }
  if (window.fluzzerSpeechTimer) {
    originalIntervals.fluzzerSpeechTimer = window.fluzzerSpeechTimer;
    clearTimeout(window.fluzzerSpeechTimer);
    window.fluzzerSpeechTimer = null;
  }
  if (window.fluzzerClickTimer) {
    originalIntervals.fluzzerClickTimer = window.fluzzerClickTimer;
    clearTimeout(window.fluzzerClickTimer);
    window.fluzzerClickTimer = null;
  }
  if (window.fluzzerSpeedBoostTimer) {
    originalIntervals.fluzzerSpeedBoostTimer = window.fluzzerSpeedBoostTimer;
    clearTimeout(window.fluzzerSpeedBoostTimer);
    window.fluzzerSpeedBoostTimer = null;
  }
  if (window.flowerRegrowthTimer) {
    originalIntervals.flowerRegrowthTimer = window.flowerRegrowthTimer;
    clearInterval(window.flowerRegrowthTimer);
    window.flowerRegrowthTimer = null;
  }
  
  // Pause speech and clock intervals
  if (window.swariaSpeechInterval) {
    originalIntervals.swariaSpeechInterval = window.swariaSpeechInterval;
    clearInterval(window.swariaSpeechInterval);
    window.swariaSpeechInterval = null;
  }
  if (window.digitalClockInterval) {
    originalIntervals.digitalClockInterval = window.digitalClockInterval;
    clearInterval(window.digitalClockInterval);
    window.digitalClockInterval = null;
  }
  
  // Pause the main daynight system interval (this is what actually advances time!)
  if (window.daynightMainInterval) {
    originalIntervals.daynightMainInterval = window.daynightMainInterval;
    clearInterval(window.daynightMainInterval);
    window.daynightMainInterval = null;
  }
  
  // Pause rustling flower timer
  if (window.rustlingFlowerTimer) {
    originalIntervals.rustlingFlowerTimer = window.rustlingFlowerTimer;
    clearInterval(window.rustlingFlowerTimer);
    window.rustlingFlowerTimer = null;
  }
  
  // Pause anomaly system timers
  if (window.anomalySystem) {
    if (window.anomalySystem.darkVoidProgressTimer) {
      originalIntervals.anomalyDarkVoidProgressTimer = window.anomalySystem.darkVoidProgressTimer;
      clearInterval(window.anomalySystem.darkVoidProgressTimer);
      window.anomalySystem.darkVoidProgressTimer = null;
    }
    if (window.anomalySystem.viPanicInterval) {
      originalIntervals.anomalyViPanicInterval = window.anomalySystem.viPanicInterval;
      clearInterval(window.anomalySystem.viPanicInterval);
      window.anomalySystem.viPanicInterval = null;
    }
    if (window.anomalySystem.cursorAnimationInterval) {
      originalIntervals.anomalyCursorAnimationInterval = window.anomalySystem.cursorAnimationInterval;
      clearInterval(window.anomalySystem.cursorAnimationInterval);
      window.anomalySystem.cursorAnimationInterval = null;
    }
    if (window.anomalySystem.clockAnomalyInterval) {
      originalIntervals.anomalyClockAnomalyInterval = window.anomalySystem.clockAnomalyInterval;
      clearInterval(window.anomalySystem.clockAnomalyInterval);
      window.anomalySystem.clockAnomalyInterval = null;
    }
    if (window.anomalySystem.backwardClockAnomalyInterval) {
      originalIntervals.anomalyBackwardClockAnomalyInterval = window.anomalySystem.backwardClockAnomalyInterval;
      clearInterval(window.anomalySystem.backwardClockAnomalyInterval);
      window.anomalySystem.backwardClockAnomalyInterval = null;
    }
  }
  
  // Override updateDigitalClock function to prevent daynight callback updates
  if (typeof window.updateDigitalClock === 'function' && !window.originalUpdateDigitalClock) {
    window.originalUpdateDigitalClock = window.updateDigitalClock;
    window.updateDigitalClock = function() {
      // Do nothing while game is paused - clock should remain frozen
      return;
    };
  }
  
  // Pause cafeteria intervals
  if (window.cafeteriaMealInterval1) {
    originalIntervals.cafeteriaMealInterval1 = window.cafeteriaMealInterval1;
    clearInterval(window.cafeteriaMealInterval1);
    window.cafeteriaMealInterval1 = null;
  }
  if (window.cafeteriaMealInterval2) {
    originalIntervals.cafeteriaMealInterval2 = window.cafeteriaMealInterval2;
    clearInterval(window.cafeteriaMealInterval2);
    window.cafeteriaMealInterval2 = null;
  }
  
  // Pause kitchen intervals
  if (window.kitchenVisibilityInterval) {
    originalIntervals.kitchenVisibilityInterval = window.kitchenVisibilityInterval;
    clearInterval(window.kitchenVisibilityInterval);
    window.kitchenVisibilityInterval = null;
  }
  if (window.kitchenVisibilityInterval2) {
    originalIntervals.kitchenVisibilityInterval2 = window.kitchenVisibilityInterval2;
    clearInterval(window.kitchenVisibilityInterval2);
    window.kitchenVisibilityInterval2 = null;
  }
  if (window.kitchenCooking && window.kitchenCooking.cookingInterval) {
    originalIntervals.kitchenCookingInterval = window.kitchenCooking.cookingInterval;
    clearInterval(window.kitchenCooking.cookingInterval);
    window.kitchenCooking.cookingInterval = null;
  }
  
  // Pause prism and UI intervals
  if (window.prismNerfDisplayInterval) {
    originalIntervals.prismNerfDisplayInterval = window.prismNerfDisplayInterval;
    clearInterval(window.prismNerfDisplayInterval);
    window.prismNerfDisplayInterval = null;
  }
  if (window.generatorDarknessInterval) {
    originalIntervals.generatorDarknessInterval = window.generatorDarknessInterval;
    clearInterval(window.generatorDarknessInterval);
    window.generatorDarknessInterval = null;
  }
  
  // Pause advanced prism calibration interval
  if (window.advancedPrismState && window.advancedPrismState.calibration && window.advancedPrismState.calibration.minigameInterval) {
    originalIntervals.advancedPrismCalibrationInterval = window.advancedPrismState.calibration.minigameInterval;
    clearInterval(window.advancedPrismState.calibration.minigameInterval);
    window.advancedPrismState.calibration.minigameInterval = null;
  }
  
  // Pause sleep button creation interval (script3.js)
  if (window.createSleepButtonInterval) {
    originalIntervals.createSleepButtonInterval = window.createSleepButtonInterval;
    clearInterval(window.createSleepButtonInterval);
    window.createSleepButtonInterval = null;
  }
  
  // Pause requestAnimationFrame by overriding it temporarily
  if (!terrariumRAFPaused) {
    originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
      // Return a dummy ID but don't actually schedule the animation
      return -1;
    };
    terrariumRAFPaused = true;
  }


  // Show pause indicator
  showPauseIndicator();
  
  // Add global click blocker to prevent all interactions except resume
  document.addEventListener('click', globalClickBlocker, true);
  document.addEventListener('keydown', globalKeyBlocker, true);

}

function resumeGame() {
  if (!isGamePaused) return;
  
  isGamePaused = false;
  window.isGamePaused = false; // Update global variable
  
  // Remove global click and key blockers
  document.removeEventListener('click', globalClickBlocker, true);
  document.removeEventListener('keydown', globalKeyBlocker, true);
  
  // Show resume animation before hiding indicator
  showResumeAnimation();
  
  // Restart main game intervals
  if (originalIntervals.tickInterval) {
    window.tickInterval = setInterval(gameTick, 1000);
  }
  if (originalIntervals.gameTickInterval) {
    window._gameTickInterval = setInterval(gameTick, 100);
  }
  
  // Restart secondary tick interval (script2.js) - this is crucial!
  if (originalIntervals.secondaryTickInterval) {
    window.secondaryTickInterval = setInterval(() => {
      const now = Date.now();
      if (!window.lastTick) window.lastTick = now;
      const diff = (now - window.lastTick) / 1000;
      window.lastTick = now;
      if (typeof tickGenerators === 'function') tickGenerators(diff);
      if (boughtElements && boughtElements[7] && typeof tickPowerGenerator === 'function') {
        tickPowerGenerator(diff);
      }
      if (window.tickLightGenerators) {
        window.tickLightGenerators(diff);
      }
    }, 100);
  }
  
  // Restart additional main game tick intervals from script2.js
  if (originalIntervals.mainGameTickInterval && typeof mainGameTick === 'function') {
    window._mainGameTickInterval = setInterval(mainGameTick, 100);
  }
  if (originalIntervals.autosaveInterval2) {
    window._autosaveInterval = setInterval(() => {
      if (settings.autosave && typeof saveGame === "function") saveGame();
    }, 20000);
  }
  
  // Restart delivery button intervals
  if (originalIntervals.deliverButtonStateInterval) {
    window.deliverButtonStateInterval = setInterval(updateDeliverButtonState, 100);
  }
  if (originalIntervals.deliverButtonCooldownInterval && window.deliverButtonCooldown) {
    // Only restart if cooldown is still active
    if (window.deliverButtonCooldown.isActive) {
      window.deliverButtonCooldown.interval = setInterval(() => {
        window.deliverButtonCooldown.remainingTime--;
        if (window.deliverButtonCooldown.remainingTime <= 0) {
          if (typeof endDeliverCooldown === 'function') endDeliverCooldown();
        } else {
          if (typeof updateDeliverButtonAppearance === 'function') updateDeliverButtonAppearance();
        }
      }, 1000);
    }
  }
  
  // Restart boost display interval
  if (originalIntervals.boostDisplayInterval && typeof updateBoostDisplay === 'function') {
    window.boostDisplayInterval = setInterval(updateBoostDisplay, 1000);
  }
  
  // Restart terrarium intervals
  if (originalIntervals.fluzzerTimerInterval && typeof updateToolButtonTimers === 'function') {
    window.fluzzerTimerInterval = setInterval(() => {
      updateToolButtonTimers();
      if (typeof isFluzzerInTimeout === 'function' && !isFluzzerInTimeout()) {
        clearInterval(window.fluzzerTimerInterval);
        window.fluzzerTimerInterval = null;
      }
    }, 1000);
  }
  
  // Restart fluzzer AI if it was running (it will restart itself naturally)
  // Note: We don't manually restart fluzzerAITimer because the AI system 
  // will restart itself when needed through normal game flow
  
  // Restart fluzzer speech timer if it was running
  if (originalIntervals.fluzzerSpeechTimer && typeof scheduleFluzzerRandomSpeech === 'function') {
    scheduleFluzzerRandomSpeech();
  }
  
  // Note: fluzzerClickTimer and fluzzerSpeedBoostTimer are temporary timers
  // that will restart naturally when needed, so we don't need to restore them
  if (originalIntervals.flowerRegrowthTimer && typeof regrowFlowers === 'function') {
    window.flowerRegrowthTimer = setInterval(() => {
      regrowFlowers();
    }, 30000);
  }
  
  // Restart advanced prism calibration interval if it was running
  if (originalIntervals.advancedPrismCalibrationInterval && window.advancedPrismState && window.advancedPrismState.calibration) {
    // Only restart if calibration is still active
    if (window.advancedPrismState.calibration.isActive) {
      window.advancedPrismState.calibration.minigameInterval = setInterval(() => {
        const currentTime = Date.now();
        const lightType = window.advancedPrismState.calibration.currentLightType;
        
        // Drain light every 100ms (similar to original logic)
        if (typeof drainLightCurrency === 'function') {
          drainLightCurrency(lightType);
        }
        
        // Update minigame state
        if (typeof updateCalibrationMinigame === 'function') {
          updateCalibrationMinigame(lightType);
        }
      }, 50);
    }
  }
  
  // Restart sleep button creation interval
  if (originalIntervals.createSleepButtonInterval && typeof createSleepButtonIfNeeded === 'function') {
    window.createSleepButtonInterval = setInterval(createSleepButtonIfNeeded, 2000);
  }
  
  // Restore requestAnimationFrame
  if (terrariumRAFPaused && originalRequestAnimationFrame) {
    window.requestAnimationFrame = originalRequestAnimationFrame;
    terrariumRAFPaused = false;
  }
  
  // Hide pause indicator after a short delay
  setTimeout(() => {
    hidePauseIndicator();
  }, 800);
  
  // Restart speech and clock intervals
  if (originalIntervals.swariaSpeechInterval) {
    window.swariaSpeechInterval = setInterval(() => {
      if (Math.random() < 0.5) showSwariaSpeech();
    }, 20000);
  }
  
  // Restore original updateDigitalClock function
  if (window.originalUpdateDigitalClock) {
    window.updateDigitalClock = window.originalUpdateDigitalClock;
    window.originalUpdateDigitalClock = null;
  }
  
  if (originalIntervals.digitalClockInterval && typeof updateDigitalClock === 'function') {
    window.digitalClockInterval = setInterval(updateDigitalClock, 1000);
  }
  
  // Restart the main daynight system interval
  if (originalIntervals.daynightMainInterval) {
    window.daynightMainInterval = setInterval(() => {
      if (window.daynight && typeof window.daynight.setTime === 'function') {
        const currentTime = window.daynight.getTime();
        window.daynight.setTime(currentTime + 1);
      }
    }, 1000);
  }
  
  // Restart cafeteria intervals
  if (originalIntervals.cafeteriaMealInterval1 && typeof checkMealTime === 'function') {
    window.cafeteriaMealInterval1 = setInterval(checkMealTime, 60000);
  }
  if (originalIntervals.cafeteriaMealInterval2 && typeof checkMealTime === 'function') {
    window.cafeteriaMealInterval2 = setInterval(checkMealTime, 10000);
  }
  
  // Restart kitchen intervals
  if (originalIntervals.kitchenVisibilityInterval && typeof checkKitchenVisibility === 'function') {
    window.kitchenVisibilityInterval = setInterval(checkKitchenVisibility, 1000);
  }
  if (originalIntervals.kitchenVisibilityInterval2 && typeof checkKitchenVisibility === 'function') {
    window.kitchenVisibilityInterval2 = setInterval(checkKitchenVisibility, 1000);
  }
  // Note: kitchen cooking interval will restart when cooking resumes naturally
  
  // Restart prism and UI intervals
  if (originalIntervals.prismNerfDisplayInterval && typeof updateNerfDisplay === 'function') {
    window.prismNerfDisplayInterval = setInterval(updateNerfDisplay, 1000);
  }
  if (originalIntervals.generatorDarknessInterval && typeof updateGeneratorDarknessEffect === 'function') {
    window.generatorDarknessInterval = setInterval(updateGeneratorDarknessEffect, 1000);
  }
  
  // Restart rustling flower timer
  if (originalIntervals.rustlingFlowerTimer && typeof startRustlingFlowerTimer === 'function') {
    startRustlingFlowerTimer();
  }
  
  // Restart anomaly system timers
  if (window.anomalySystem) {
    if (originalIntervals.anomalyDarkVoidProgressTimer) {
      // Restore dark void timer if anomaly is still active
      if (window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.darkVoidAnomaly) {
        window.anomalySystem.startDarkVoidProgression();
      }
    }
    if (originalIntervals.anomalyViPanicInterval) {
      // Restore Vi panic timer if anomaly is still active
      if (window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.labDarknessAnomaly) {
        window.anomalySystem.startViPanicDialogue();
      }
    }
    if (originalIntervals.anomalyCursorAnimationInterval) {
      // Restore cursor animation if it was active
      window.anomalySystem.startCursorAnimation();
    }
    if (originalIntervals.anomalyClockAnomalyInterval) {
      // Restore clock anomaly interval if anomaly is still active
      if (window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.clockAnomaly) {
        window.anomalySystem.clockAnomalyInterval = setInterval(() => {
          window.anomalySystem.wildClockUpdate();
        }, 50);
      }
    }
    if (originalIntervals.anomalyBackwardClockAnomalyInterval) {
      // Restore backward clock anomaly interval if anomaly is still active
      if (window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.backwardClockAnomaly) {
        window.anomalySystem.backwardClockAnomalyInterval = setInterval(() => {
          window.anomalySystem.backwardClockUpdate();
        }, 50);
      }
    }
  }

}

function showResumeAnimation() {
  const indicator = document.getElementById('gamePausedIndicator');
  if (indicator) {
    indicator.innerHTML = `
      ▶️ Game Resumed!<br>
      <small style="font-size:0.8em; opacity:0.9; margin-top:0.5em; display:block;">
        Welcome back!
      </small>
    `;
    indicator.style.background = 'rgba(52, 199, 89, 0.95)';
    indicator.style.transform = 'translate(-50%, -50%) scale(1.2)';
    indicator.style.animation = 'none';
  }
}

function globalClickBlocker(event) {
  if (!window.isGamePaused) return;
  
  // Allow clicks on the pause indicator itself (for resume)
  const pauseIndicator = document.getElementById('gamePausedIndicator');
  if (pauseIndicator && (event.target === pauseIndicator || pauseIndicator.contains(event.target))) {
    return; // Allow this click
  }
  
  // Block all other clicks
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
}

function globalKeyBlocker(event) {
  if (!window.isGamePaused) return;
  
  // Allow resume keys (Space, Enter, Escape)
  if (event.code === 'Space' || event.code === 'Enter' || event.code === 'Escape') {
    return; // Allow these keys for resume
  }
  
  // Block all other keys
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
}

function showPauseIndicator() {
  let indicator = document.getElementById('gamePausedIndicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'gamePausedIndicator';
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 69, 58, 0.95);
      color: white;
      padding: 1.5em 2.5em;
      border-radius: 16px;
      font-size: 1.3em;
      font-weight: bold;
      z-index: 999999;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      pointer-events: auto;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s ease;
      border: 3px solid rgba(255,255,255,0.3);
      animation: pausePulse 2s infinite ease-in-out;
    `;
    indicator.innerHTML = `
      ⏸ Game Paused<br>
      <small style="font-size:0.8em; opacity:0.9; margin-top:0.5em; display:block;">
        Click anywhere to resume
      </small>
    `;
    
    // Add CSS animation
    if (!document.getElementById('pauseIndicatorCSS')) {
      const style = document.createElement('style');
      style.id = 'pauseIndicatorCSS';
      style.textContent = `
        @keyframes pausePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        #gamePausedIndicator:hover {
          background: rgba(255, 69, 58, 1) !important;
          transform: translate(-50%, -50%) scale(1.1) !important;
          box-shadow: 0 12px 48px rgba(0,0,0,0.6) !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(indicator);
  }
  
  // Reset the indicator to paused state (in case it was showing resumed state)
  indicator.innerHTML = `
    ⏸️ Game Paused<br>
    <small style="font-size:0.8em; opacity:0.9; margin-top:0.5em; display:block;">
      Click anywhere to resume
    </small>
  `;
  indicator.style.background = 'rgba(255, 69, 58, 0.95)';
  indicator.style.transform = 'translate(-50%, -50%)';
  indicator.style.animation = 'pausePulse 2s infinite ease-in-out';
  indicator.style.display = 'block';
  
  // Add click listener to resume game when clicking anywhere
  addResumeClickListener();
}

function hidePauseIndicator() {
  const indicator = document.getElementById('gamePausedIndicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
  
  // Remove click listener when game is not paused
  removeResumeClickListener();
}

function addResumeClickListener() {
  // Remove existing listener first to avoid duplicates
  removeResumeClickListener();
  
  // Add click listener to document, but with more specific handling
  document.addEventListener('click', handleResumeClick, true);
  document.addEventListener('keydown', handleResumeKeydown, true);
  
  // Add click listener directly to the pause indicator
  const indicator = document.getElementById('gamePausedIndicator');
  if (indicator) {
    indicator.addEventListener('click', handlePauseIndicatorClick, true);
  }
}

function removeResumeClickListener() {
  document.removeEventListener('click', handleResumeClick, true);
  document.removeEventListener('keydown', handleResumeKeydown, true);
  
  // Remove click listener from pause indicator
  const indicator = document.getElementById('gamePausedIndicator');
  if (indicator) {
    indicator.removeEventListener('click', handlePauseIndicatorClick, true);
  }
}

function handleResumeClick(event) {
  if (isGamePaused && settings.disableOfflineProgress) {
    const target = event.target;
    
    // Check if click is on the pause indicator (always resume)
    const indicator = document.getElementById('gamePausedIndicator');
    if (indicator && (target === indicator || indicator.contains(target))) {

      event.preventDefault();
      event.stopPropagation();
      resumeGame();
      return;
    }
    
    // Check if click is on game UI elements (don't resume)
    const gameUIElements = [
      'button', 'input', 'select', 'textarea', 'a',
      '.card', '.navBtn', '.generator-card', '.element-tile',
      '#bottomNav', '#gameContainer', '#pages',
      '.modal', '.settings-subtab', '.sub-tab'
    ];
    
    let shouldNotResume = false;
    for (const selector of gameUIElements) {
      if (selector.startsWith('.') || selector.startsWith('#')) {
        const element = document.querySelector(selector);
        if (element && (target === element || element.contains(target))) {
          shouldNotResume = true;
          break;
        }
      } else {
        if (target.tagName && target.tagName.toLowerCase() === selector) {
          shouldNotResume = true;
          break;
        }
      }
    }
    
    // If clicking on game UI elements, don't resume
    if (shouldNotResume) {

      return;
    }
    
    // If clicking on empty space/background, resume

    event.preventDefault();
    event.stopPropagation();
    resumeGame();
  }
}

function handlePauseIndicatorClick(event) {
  if (isGamePaused && settings.disableOfflineProgress) {

    event.preventDefault();
    event.stopPropagation();
    resumeGame();
  }
}

function handleResumeKeydown(event) {
  if (isGamePaused && settings.disableOfflineProgress) {
    // Resume on any key press (space, enter, escape, etc.)

    event.preventDefault();
    event.stopPropagation();
    resumeGame();
  }
}

// Initialize offline progress prevention if setting is enabled
document.addEventListener('DOMContentLoaded', function() {
  // This will be handled in script2.js after settings are loaded
});

// Make functions globally accessible for debugging
window.setupOfflineProgressPrevention = setupOfflineProgressPrevention;
window.removeOfflineProgressPrevention = removeOfflineProgressPrevention;
window.pauseGame = pauseGame;
window.resumeGame = resumeGame;
window.showPauseIndicator = showPauseIndicator;
window.hidePauseIndicator = hidePauseIndicator;
window.addResumeClickListener = addResumeClickListener;
window.removeResumeClickListener = removeResumeClickListener;
window.showResumeAnimation = showResumeAnimation;
window.handlePauseIndicatorClick = handlePauseIndicatorClick;