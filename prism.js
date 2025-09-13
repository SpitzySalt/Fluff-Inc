// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// DecimalUtils is available globally from decimal_utils.js

let prismGridInitialized = false;

// Make prismGridInitialized globally accessible
window.prismGridInitialized = prismGridInitialized;













































let prismState = {
  light: new Decimal(0),
  redlight: new Decimal(0),
  orangelight: new Decimal(0),
  yellowlight: new Decimal(0),
  greenlight: new Decimal(0),
  bluelight: new Decimal(0),
  lightparticle: new Decimal(0),
  redlightparticle: new Decimal(0),
  orangelightparticle: new Decimal(0),
  yellowlightparticle: new Decimal(0),
  greenlightparticle: new Decimal(0),
  bluelightparticle: new Decimal(0),
  activeTileIndex: null,
  activeTileColor: null,
};
window.prismState = prismState;
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
const tileColorMap = {
  3: 'light',
  9: 'redlight', 10: 'redlight', 11: 'redlight',
  15: 'orangelight', 16: 'orangelight', 17: 'orangelight', 18: 'orangelight', 19: 'orangelight',
  21: 'yellowlight', 22: 'yellowlight', 23: 'yellowlight', 24: 'yellowlight', 25: 'yellowlight', 26: 'yellowlight', 27: 'yellowlight',
  29: 'greenlight', 30: 'greenlight', 31: 'greenlight', 32: 'greenlight', 33: 'greenlight',
  37: 'bluelight', 38: 'bluelight', 39: 'bluelight',
  45: 'light'
};

function initPrismGrid() {
  const grid = document.getElementById("lightGrid");
  if (!grid) return;
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
    console.log('Debug - getVivienBonusLightCount: No friendship system or Lab department');
    return 0;
  }
  
  const labFriendship = window.friendship.Lab;
  const level = labFriendship.level || 0;
  
  console.log(`Debug - getVivienBonusLightCount: Lab level ${level}`);
  
  // Bonus lights unlock at level 4, +1 every 2 levels
  if (level < 4) {
    console.log('Debug - getVivienBonusLightCount: Level < 4, no bonus lights');
    return 0;
  }
  
  const bonusCount = 1 + Math.floor((level - 4) / 2);
  console.log(`Debug - getVivienBonusLightCount: Calculated ${bonusCount} bonus lights`);
  return bonusCount;
}

function spawnMultipleLightTiles() {
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
  
  console.log(`Debug - spawnMultipleLightTiles: Spawning ${totalTilesToSpawn} tiles (1 main + ${bonusCount} bonus)`);
  
  // Spawn all tiles without clearing between them
  for (let i = 0; i < totalTilesToSpawn; i++) {
    spawnSingleLightTile();
  }
  
  if (bonusCount > 0) {
    console.log(`Vivien's friendship bonus: spawned ${bonusCount} additional light tile${bonusCount === 1 ? '' : 's'}!`);
  }
}

// New function that spawns a single tile without clearing existing ones
function spawnSingleLightTile() {
  const eligible = Array.from(document.querySelectorAll(".light-tile.active-prism"));
  // Remove tiles that are already active from the eligible list
  const availableTiles = eligible.filter(tile => !tile.classList.contains("active-tile"));
  
  if (availableTiles.length === 0) {
    console.log('Debug - spawnSingleLightTile: No available tiles to spawn on');
    return;
  }
  
  const randomTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  const index = parseInt(randomTile.dataset.index);
  
  // Check if yellow light is unlocked - requires prism core level 2
  const yellowUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(2));
  // Check if green light is unlocked - requires prism core level 3
  const greenUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(3));
  // Check if blue light is unlocked - requires prism core level 4  
  const blueUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(4));
  
  // Check if prism core has been upgraded at least once (level > 1)
  const prismCoreUpgraded = window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gt(1);
  
  // Check for grey anomaly - if active, only spawn grey tiles
  if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.prismGreyAnomaly) {
    randomTile.classList.add("active-tile", "grey-tile");
    return;
  }
  
  if (prismCoreUpgraded) {
    // If prism core has been upgraded, make all light types available
    const roll = Math.random();
    if (blueUnlocked && roll < 0.08) {
      randomTile.classList.add("active-tile", "blue-tile");
    } else if (greenUnlocked && roll < 0.16) {
      randomTile.classList.add("active-tile", "green-tile");
    } else if (yellowUnlocked && roll < 0.24) {
      randomTile.classList.add("active-tile", "yellow-tile");
    } else if (roll < 0.44) {
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (roll < 0.72) {
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else {
    // If prism core hasn't been upgraded, only spawn white light
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
  
  console.log(`Debug - spawnNewLightTilesWithoutClearing: Target ${targetTotalTiles} tiles, currently have ${currentActiveTiles}, spawning ${tilesToSpawn}`);
  
  // Only spawn tiles if we're below the target
  for (let i = 0; i < tilesToSpawn; i++) {
    spawnSingleLightTile();
  }
  
  if (tilesToSpawn > 0 && bonusCount > 0) {
    console.log(`Vivien's friendship bonus: maintaining ${bonusCount} additional light tile${bonusCount === 1 ? '' : 's'}!`);
  }
}

// Function to collect all active light tiles (Vivien's level 7+ buff)
function collectAllActiveLightTiles(friendshipMultiplier) {
  const allActiveTiles = document.querySelectorAll('.light-tile.active-tile');
  let totalCollected = 0;
  
  console.log(`🌟 Multi-collection activated! Found ${allActiveTiles.length} active tiles to collect`);
  
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
    
    console.log(`  Collecting tile ${tileIndex + 1}: ${tileColor}`);
    
    // Calculate gain for this tile (simplified version of the main logic)
    let tileGain = calculateLightTileGain(tileColor, friendshipMultiplier);
    
    // Add to the appropriate currency
    const currencyName = tileColor === 'redlight' ? 'redLight' : 
                        tileColor === 'orangelight' ? 'orangeLight' :
                        tileColor === 'yellowlight' ? 'yellowLight' :
                        tileColor === 'greenlight' ? 'greenLight' :
                        tileColor === 'bluelight' ? 'blueLight' :
                        'light';
    
    if (typeof window.addCurrency === 'function') {
      window.addCurrency(currencyName, tileGain);
    } else {
      // Fallback direct addition
      if (currencyName === 'light') {
        window.prismState.light = window.prismState.light.add(tileGain);
      } else if (currencyName === 'redLight') {
        window.prismState.redlight = window.prismState.redlight.add(tileGain);
      }
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
        showPrismGainPopup(popupId, tileGain, popupText);
      }, tileIndex * 50); // 50ms delay between each popup
    }
    
    // Update tracker
    if (window.prismClickTracker) {
      if (DecimalUtils.isDecimal(tileGain)) {
        window.prismClickTracker[tileColor] = (window.prismClickTracker[tileColor] || new Decimal(0)).add(tileGain);
      } else {
        window.prismClickTracker[tileColor] = (window.prismClickTracker[tileColor] || new Decimal(0)).add(new Decimal(tileGain));
      }
    }
    
    // Remove the tile
    tile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
    totalCollected++;
  });
  
  console.log(`🎉 Multi-collection complete! Collected ${totalCollected} tiles`);
  
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
  console.log(`🧪 Testing Vivien's multi-collection buff at level ${level}...`);
  
  if (!window.friendship) {
    window.friendship = {};
  }
  if (!window.friendship.Lab) {
    window.friendship.Lab = { level: 0, points: new Decimal(0) };
  }
  
  // Set level for testing
  window.friendship.Lab.level = level;
  const expectedChance = 5 + Math.max(0, (level - 7) * 5);
  
  console.log(`📊 Lab friendship level set to: ${level}`);
  console.log(`📊 Multi-collection chance: ${expectedChance}%`);
  console.log(`📊 Current active tiles: ${document.querySelectorAll('.light-tile.active-tile').length}`);
  
  console.log('🎯 Click any light tile to test the multi-collection buff!');
  console.log(`💡 Expected behavior: ${expectedChance}% chance to collect ALL active tiles at once`);
  
  return {
    level: level,
    chance: expectedChance,
    activeTiles: document.querySelectorAll('.light-tile.active-tile').length
  };
};

// Debug function to test Vivien's bonus light spawning
window.testVivienBonusLights = function() {
  console.log('🧪 Testing Vivien\'s bonus light spawning...');
  
  if (!window.friendship || !window.friendship.Lab) {
    console.log('❌ Friendship system or Lab department not found');
    return false;
  }
  
  const level = window.friendship.Lab.level;
  const expectedBonus = getVivienBonusLightCount();
  
  console.log(`📊 Current Lab friendship level: ${level}`);
  console.log(`📊 Expected bonus lights: ${expectedBonus}`);
  console.log(`📊 Total lights per spawn: ${1 + expectedBonus} (1 main + ${expectedBonus} bonus)`);
  
  if (level < 4) {
    console.log('⚠️ Level 4+ required for bonus lights');
    return false;
  }
  
  // Count current light tiles
  const currentLights = document.querySelectorAll('.light-tile').length;
  console.log(`📊 Current light tiles on grid: ${currentLights}`);
  
  // Test spawning
  console.log('🚀 Spawning lights...');
  spawnMultipleLightTiles();
  
  // Count after spawning
  setTimeout(() => {
    const newLights = document.querySelectorAll('.light-tile').length;
    const spawned = newLights - currentLights;
    console.log(`📊 Light tiles after spawn: ${newLights}`);
    console.log(`📊 Actually spawned: ${spawned} lights`);
    
    if (spawned === 1 + expectedBonus) {
      console.log('✅ Bonus light spawning working correctly!');
    } else {
      console.log(`❌ Expected ${1 + expectedBonus} lights, but spawned ${spawned}`);
    }
  }, 100);
  
  return true;
};

function spawnNewLightTile() {
  // Prism lab operates independently of power status
  
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
  
  // Check if yellow light is unlocked - requires prism core level 2
  const yellowUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(2));
  // Check if green light is unlocked - requires prism core level 3
  const greenUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(3));
  // Check if blue light is unlocked - requires prism core level 4  
  const blueUnlocked = (window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gte(4));
  
  // Check if prism core has been upgraded at least once (level > 1)
  const prismCoreUpgraded = window.prismState.prismcore && window.prismState.prismcore.level && window.prismState.prismcore.level.gt(1);
  
  // Check for grey anomaly - if active, only spawn grey tiles
  if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.prismGreyAnomaly) {
    window.prismState.activeTileColor = 'greylight';
    randomTile.classList.add("active-tile", "grey-tile");
    return;
  }
  
  if (prismCoreUpgraded) {
    // If prism core has been upgraded, make all light types available
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
    } else if (roll < 0.44) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade) && state.grade.gte(8)) {
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
    } else if (roll < 0.5) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (roll < 0.75) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade) && state.grade.gte(7)) {
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
    } else if (roll < 0.44) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade) && state.grade.gte(6)) {
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
    } else if (roll < 0.44) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (roll < 0.72) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof state !== 'undefined' && DecimalUtils.isDecimal(state.grade) && state.grade.gte(4)) {
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
    } else if (roll < 0.65) {
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
    } else if (roll < 0.68) {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  }
}

function clickLightTile(index) {
  // Check if the clicked tile is any active tile
  const clickedTile = document.querySelector(`.light-tile[data-index="${index}"]`);
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
    
    console.log(`Debug - clickLightTile: Clicked tile ${index}, detected color: ${color}`);
    
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
      console.log(`Debug - Multi-collection buff: ${multiCollectionChance}% chance, rolled ${multiRandom.toFixed(2)}%`);
      if (multiRandom < multiCollectionChance) {
        shouldCollectAllTiles = true;
        console.log(`🌟 Vivien's multi-collection buff activated! Collecting all light tiles!`);
      }
    }
    
    if (color === 'light') {
      let particleBoost = getParticleBoost();
      totalGain = totalGain.add(particleBoost);
      if (boughtElements["13"]) totalGain = totalGain.mul(5);
      totalGain = window.getLightGain(totalGain);
      
      // Ensure charger light boost is applied (in case patching didn't work)
      if (window._chargerLightBoost && window._chargerLightBoost.gt(1)) {
        totalGain = totalGain.mul(window._chargerLightBoost);
      }
      
      totalGain = totalGain.floor(); 
    } else if (color === 'redlight') {
      let redParticleBoost = DecimalUtils.multiply(window.prismState.redlightparticle.floor(), 0.1);
      totalGain = totalGain.add(redParticleBoost);
      if (boughtElements["13"]) totalGain = totalGain.mul(5);
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
      if (boughtElements["13"]) totalGain = totalGain.mul(5);
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
      if (boughtElements["13"]) totalGain = totalGain.mul(5);
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
      if (boughtElements["13"]) totalGain = totalGain.mul(5);
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
      if (boughtElements["13"]) totalGain = totalGain.mul(5);
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
      
      if (shouldCollectAllTiles) {
        // Multi-collection buff: collect ALL active light tiles
        collectAllActiveLightTiles(friendshipMultiplier);
        // After collecting all, spawn full set of new tiles
        spawnMultipleLightTiles();
      } else {
        // Normal behavior: remove only the clicked tile
        clickedTile.classList.remove("active-tile", "red-tile", "orange-tile", "white-tile", "yellow-tile", "green-tile", "blue-tile", "grey-tile");
        console.log(`Debug - clickLightTile: Removed clicked tile ${index}`);
        
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
      
      // Grant friendship points with Vi for using the prism lab
      if (window.friendship && typeof window.friendship.addPoints === 'function') {
        window.friendship.addPoints('vi', new Decimal(1));
      }
    }
    
    // Track prism tile click for front desk automator unlocks
    if (window.frontDesk && typeof window.frontDesk.onPrismTileClicked === 'function') {
      window.frontDesk.onPrismTileClicked();
    }
  }
}

function ensureClickHandlers() {
  const tiles = document.querySelectorAll(".light-tile.active-prism");
  tiles.forEach(tile => {
    const index = parseInt(tile.dataset.index);
    if (index !== undefined) {
      tile.onclick = null;
      tile.onclick = () => clickLightTile(index);
    }
  });
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
      if (window.saveGame) window.saveGame();
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
    if (window.saveGame) window.saveGame();
  }
}

function tickLightGenerators(diff) {
  // Prism lab operates independently of power status
  Object.keys(lightGeneratorConfigs).forEach(type => {
    if (!window.prismState.generatorUnlocked[type]) return;
    const config = lightGeneratorConfigs[type];
    
    // Ensure generator upgrades is properly initialized and get numeric value
    if (!DecimalUtils.isDecimal(window.prismState.generatorUpgrades[type])) {
      window.prismState.generatorUpgrades[type] = new Decimal(window.prismState.generatorUpgrades[type] || 0);
    }
    const upgrades = window.prismState.generatorUpgrades[type].toNumber();
    
    let rate = DecimalUtils.multiply(config.baseRate, new Decimal(2).pow(upgrades));
    if (typeof boughtElements !== 'undefined' && boughtElements[15]) {
      rate = rate.mul(5);
    }
    if (typeof boughtElements !== 'undefined' && boughtElements[16] && typeof state !== 'undefined') {
      // Ensure state.powerEnergy is a Decimal
      if (!DecimalUtils.isDecimal(state.powerEnergy)) {
        state.powerEnergy = new Decimal(state.powerEnergy || 0);
      }
      rate = rate.mul(state.powerEnergy.div(10));
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
  spawnNewLightTile();
  ensureClickHandlers();
  forceUpdateAllLightCounters();
  updateLightGeneratorButtons();
}

window.handleLightGenClick = handleLightGenClick;
window.tickLightGenerators = tickLightGenerators;
window.initPrism = initPrism;

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
  setTimeout(() => {
    checkViResponse(quote.text);
  }, 2000); 
  setTimeout(() => {
    swariaprismSpeech.classList.remove('show');
    swariaprismImage.src = getPrismLabCharacterImage(false); 
  }, 10000); 
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
    console.error("Vi speech bubble not found!");
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

setInterval(() => {
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
    if (typeof boughtElements !== 'undefined' && boughtElements[15]) {
      rate = rate.mul(5);
    }
    if (typeof boughtElements !== 'undefined' && boughtElements[16] && typeof state !== 'undefined') {
      // Ensure state.powerEnergy is a Decimal
      if (!DecimalUtils.isDecimal(state.powerEnergy)) {
        state.powerEnergy = new Decimal(state.powerEnergy || 0);
      }
      rate = rate.mul(state.powerEnergy.div(10));
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
  const targets = [document.documentElement, document.body, document.getElementById('root')].filter(Boolean);
  targets.forEach(target => {
    new MutationObserver(() => {
      updatePrismOverlayForTheme();
    }).observe(target, { attributes: true, attributeFilter: ['data-theme'] });
  });
}

observeThemeChanges();
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .red-tile {
      background: #ff4444 !important;
      box-shadow: 0 0 10px 2px #ff4444;
      border: 2px solid #b20000;
      position: relative;
      overflow: visible;
    }
    .red-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .red-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(255, 68, 68, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
    }
    .orange-tile {
      background: #ff9900 !important;
      box-shadow: 0 0 10px 2px #ff9900;
      border: 2px solid #b36b00;
      position: relative;
      overflow: visible;
    }
    .orange-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .orange-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(255, 153, 0, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(255, 153, 0, 0.8);
    }
    .yellow-tile {
      background: #ffff00 !important;
      box-shadow: 0 0 10px 2px #ffff00;
      border: 2px solid #cccc00;
      position: relative;
      overflow: visible;
    }
    .yellow-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .yellow-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 0, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(255, 255, 0, 0.8);
    }
    .green-tile {
      background: #00ff00 !important;
      box-shadow: 0 0 10px 2px #00ff00;
      border: 2px solid #00cc00;
      position: relative;
      overflow: visible;
    }
    .green-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .green-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(0, 255, 0, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
    }
    .blue-tile {
      background: #0066ff !important;
      box-shadow: 0 0 10px 2px #0066ff;
      border: 2px solid #0044cc;
      position: relative;
      overflow: visible;
    }
    .blue-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .blue-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(0, 102, 255, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0, 102, 255, 0.8);
    }
    .white-tile {
      background: #fff !important;
      box-shadow: 0 0 10px 2px #fff;
      border: 2px solid #aaa;
      position: relative;
      overflow: visible;
    }
    .white-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .white-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
    .grey-tile {
      background: #808080 !important;
      box-shadow: 0 0 10px 2px #808080;
      border: 2px solid #606060;
      position: relative;
      overflow: visible;
    }
    .grey-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .grey-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(128, 128, 128, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(128, 128, 128, 0.8);
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
    .green-tile {
      background: #00ff00 !important;
      box-shadow: 0 0 10px 2px #00ff00;
      border: 2px solid #00cc00;
      position: relative;
      overflow: visible;
    }
    .green-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .green-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(0, 255, 0, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
    }
    .blue-tile {
      background: #0066ff !important;
      box-shadow: 0 0 10px 2px #0066ff;
      border: 2px solid #0044cc;
      position: relative;
      overflow: visible;
    }
    .blue-tile::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0px;
      width: 500px;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(-170deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 0.5;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    .blue-tile::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 500px;
      height: 3px;
      background: rgba(0, 102, 255, 1);
      transform: rotate(-45deg);
      transform-origin: left center;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0, 102, 255, 0.8);
    }
  `;
  document.head.appendChild(style);
}

function addPrismTileTokenChance() {
  const grid = document.getElementById('lightGrid');
  if (!grid) return;
  grid.querySelectorAll('.light-tile').forEach(tile => {
    if (!tile._tokenPatched) {
      tile.addEventListener('click', function(e) {
        if (window.spawnIngredientToken && Math.random() < 1/1) {
          window.spawnIngredientToken('prism', tile);
        }
      });
      tile._tokenPatched = true;
    }
  });
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
        console.log("Friendship system not initialized");
        return;
    }
    
    // Set Vi's friendship level for testing
    window.friendship.Lab = window.friendship.Lab || { level: 0, points: new Decimal(0) };
    window.friendship.Lab.level = level;
    window.friendship.Lab.points = new Decimal(0);
    
    const buffChance = new Decimal(25).add(new Decimal(5).mul(Math.max(0, level - 1))).toNumber();
    console.log(`Vi friendship level set to: ${level}`);
    console.log(`Light gain X5 buff chance: ${buffChance}%`);
    console.log("Click a light tile to test the buff!");
    
    // Update the stats modal if it's open
    if (typeof window.renderDepartmentStatsButtons === 'function') {
        window.renderDepartmentStatsButtons();
    }
};
