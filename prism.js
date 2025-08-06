// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file













































let prismState = {
  light: 0,
  redlight: 0,
  orangelight: 0,
  yellowlight: 0,
  greenlight: 0,
  bluelight: 0,
  lightparticle: 0,
  redlightparticle: 0,
  orangelightparticle: 0,
  yellowlightparticle: 0,
  greenlightparticle: 0,
  bluelightparticle: 0,
  activeTileIndex: null,
  activeTileColor: null,
};
window.prismState = prismState;
const lightGeneratorConfigs = {
  light:      { baseCost: 100,      baseRate: 1,   resource: 'light' },
  redlight:   { baseCost: 500,      baseRate: 1,   resource: 'redlight' },
  orangelight:{ baseCost: 1000,     baseRate: 1,   resource: 'orangelight' },
  yellowlight:{ baseCost: 2500,     baseRate: 1,   resource: 'yellowlight' },
  greenlight: { baseCost: 5000,     baseRate: 1,   resource: 'greenlight' },
  bluelight:  { baseCost: 10000,    baseRate: 1,   resource: 'bluelight' }
};
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
const prismShapeIndices = [
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
  for (let i = 0; i < 49; i++) {
    const tile = document.createElement("div");
    tile.classList.add("light-tile");
    if (prismShapeIndices.includes(i)) {
      tile.classList.add("active-prism");
      tile.dataset.index = i;
      tile.onclick = () => clickLightTile(i);
    }
    grid.appendChild(tile);
  }
  spawnNewLightTile();
  addPrismTileTokenChance();
}

function spawnNewLightTile() {
  if (typeof state !== 'undefined' && (state.powerStatus !== 'online' || state.powerEnergy <= 0)) return;
  document.querySelectorAll(".light-tile").forEach(tile => {
    tile.classList.remove("active-tile");
    tile.classList.remove("red-tile");
    tile.classList.remove("orange-tile");
    tile.classList.remove("white-tile");
  });
  const eligible = Array.from(document.querySelectorAll(".light-tile.active-prism"));
  if (eligible.length === 0) return;
  const randomTile = eligible[Math.floor(Math.random() * eligible.length)];
  const index = parseInt(randomTile.dataset.index);
  window.prismState.activeTileIndex = index;
  if (typeof state !== 'undefined' && state.grade >= 6) {
    const roll = Math.random();
    if (roll < 0.3) {
      window.prismState.activeTileColor = 'orangelight';
      randomTile.classList.add("active-tile", "orange-tile");
    } else if (roll < 0.6) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else if (typeof state !== 'undefined' && state.grade >= 4) {
    if (Math.random() < 0.4) {
      window.prismState.activeTileColor = 'redlight';
      randomTile.classList.add("active-tile", "red-tile");
    } else {
      window.prismState.activeTileColor = 'light';
      randomTile.classList.add("active-tile", "white-tile");
    }
  } else {
    window.prismState.activeTileColor = 'light';
    randomTile.classList.add("active-tile", "white-tile");
  }
}

function clickLightTile(index) {
  if (index === window.prismState.activeTileIndex) {
    if (typeof window.trackHardModePrismClick === 'function') {
      window.trackHardModePrismClick();
    }
    let color = 'light';
    if (typeof window.prismState.activeTileColor !== 'undefined') {
      color = window.prismState.activeTileColor;
    }
    let baseGain = 1;
    let totalGain = baseGain;
    if (color === 'light') {
      let particleBoost = getParticleBoost();
      totalGain += particleBoost;
      if (boughtElements["13"]) totalGain *= 5;
      totalGain = window.getLightGain(totalGain);
      totalGain = Math.floor(totalGain); 
    } else if (color === 'redlight') {
      let redParticleBoost = Math.floor(window.prismState.redlightparticle) * 0.1;
      totalGain += redParticleBoost;
      if (boughtElements["13"]) totalGain *= 5;
      if (typeof window.getRedlightGain === 'function') {
        totalGain = window.getRedlightGain(totalGain);
      }
      totalGain = Math.floor(totalGain);
    } else if (color === 'orangelight') {
      let orangeParticleBoost = Math.floor(window.prismState.orangelightparticle) * 0.1;
      totalGain += orangeParticleBoost;
      if (boughtElements["13"]) totalGain *= 5;
      if (typeof window.getOrangelightGain === 'function') {
        totalGain = window.getOrangelightGain(totalGain);
      }
      totalGain = Math.floor(totalGain);
    }
    if (color === 'light' || color === 'redlight' || color === 'orangelight') {
      totalGain = Math.floor(totalGain); 
      window.prismState[color] += totalGain;
      if (color === 'light') window.prismState.light = Math.floor(window.prismState.light); 
      if (color === 'orangelight' && typeof window.trackOrangeLightMilestone === 'function') {
        window.trackOrangeLightMilestone(window.prismState.orangelight);
      }
      updateAllLightCounters();
      spawnNewLightTile();
      if (color === 'light') {
        showPrismGainPopup('lightCount', totalGain, 'light');
      } else if (color === 'redlight') {
        showPrismGainPopup('redlightCount', totalGain, 'red light');
      } else if (color === 'orangelight') {
        showPrismGainPopup('orangelightCount', totalGain, 'orange light');
      }
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
  const light = Math.floor(window.prismState.light); 
  const multiplier = 1 + light * 0.01;
  const countEl = document.getElementById("lightCount");
  const multEl = document.getElementById("lightKPMult");

  function formatLargeInt(num) {
    num = Math.floor(num);
    if (num >= 1e6) {
      return num.toExponential(2).replace(/\..*e/, 'e');
    }
    return num.toLocaleString();
  }

  if (countEl) countEl.textContent = formatNumber(light);
  if (multEl) {
    multEl.textContent = `× ${formatNumber(multiplier)} KP`;
  }
}

function getParticleBoost() {
  let particleBoost = 0;
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  particleTypes.forEach(particleType => {
    const count = Math.floor(window.prismState[particleType]);
    particleBoost += count * 0.1;
  });
  return particleBoost;
}

function updateAllLightCounters() {
  updateLightCounter();
  const lightTypes = ['redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
  lightTypes.forEach(type => {
    const countEl = document.getElementById(`${type}Count`);
    if (countEl) {
      countEl.textContent = formatNumber(window.prismState[type]);
    }
  });
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  particleTypes.forEach(type => {
    const countEl = document.getElementById(`${type}Count`);
    if (countEl) {
      countEl.textContent = formatNumber(window.prismState[type]);
    }
  });
  const boost = getParticleBoost();
  const boostEl = document.getElementById('particleBoost');

  function formatLargeInt(num) {
    num = Math.floor(num);
    if (num >= 1e6) {
      return num.toExponential(0);
    }
    return num.toLocaleString();
  }

  if (boostEl) {
    boostEl.textContent = `+${formatNumber(boost)} per click`;
    let redParticleBoostSpan = document.getElementById('redlightParticleBoost');
    let redParticleBoost = (window.prismState.redlightparticle || 0) * 0.1;
    let redParticleBoostText = '';
    if (redParticleBoost > 0) {
      redParticleBoostText = `+${formatNumber(redParticleBoost)} per click`;
    }
    if (!redParticleBoostSpan) {
      redParticleBoostSpan = document.createElement('span');
      redParticleBoostSpan.id = 'redlightParticleBoost';
      boostEl.parentNode.insertBefore(redParticleBoostSpan, boostEl.nextSibling);
    }
    redParticleBoostSpan.textContent = redParticleBoostText;
    redParticleBoostSpan.style.color = '#ff4444'; 
    redParticleBoostSpan.style.fontWeight = 'bold';
    redParticleBoostSpan.style.display = 'block';
    redParticleBoostSpan.style.marginLeft = '0';
    redParticleBoostSpan.style.marginTop = '2px';
    let orangeParticleBoostSpan = document.getElementById('orangelightParticleBoost');
    let orangeParticleBoost = (window.prismState.orangelightparticle || 0) * 0.1;
    let orangeParticleBoostText = '';
    if (orangeParticleBoost > 0) {
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
    }
    orangeParticleBoostSpan.textContent = orangeParticleBoostText;
    orangeParticleBoostSpan.style.color = '#ff9900'; 
    orangeParticleBoostSpan.style.fontWeight = 'bold';
    orangeParticleBoostSpan.style.display = 'block';
    orangeParticleBoostSpan.style.marginLeft = '0';
    orangeParticleBoostSpan.style.marginTop = '2px';
  }
  const redlightCountEl = document.getElementById('redlightCount');
  if (redlightCountEl) {
    redlightCountEl.textContent = formatNumber(window.prismState.redlight);
    let boostText = '';
    if (window.prismState.redlight > 0) {
      boostText = ` × ${formatNumber(window.prismState.redlight)} Feathers`;
    }
    let boostSpan = document.getElementById('redlightFeatherBoost');
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'redlightFeatherBoost';
      redlightCountEl.parentNode.appendChild(boostSpan);
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#ff4444';
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
  const orangelightCountEl = document.getElementById('orangelightCount');
  if (orangelightCountEl) {
    orangelightCountEl.textContent = formatNumber(window.prismState.orangelight);
    let boostText = '';
    if (window.prismState.orangelight > 0) {
      boostText = ` × ${formatNumber(window.prismState.orangelight)} Wing artifact`;
    }
    let boostSpan = document.getElementById('orangelightArtifactBoost');
    if (!boostSpan) {
      boostSpan = document.createElement('span');
      boostSpan.id = 'orangelightArtifactBoost';
      orangelightCountEl.parentNode.appendChild(boostSpan);
    }
    boostSpan.textContent = boostText;
    boostSpan.style.color = '#ff9900'; 
    boostSpan.style.fontWeight = 'bold';
    boostSpan.style.marginLeft = '6px';
  }
}

function handleLightGenClick(type) {
  const config = lightGeneratorConfigs[type];
  if (!config) return;
  const upgrades = window.prismState.generatorUpgrades[type] || 0;
  const unlocked = window.prismState.generatorUnlocked[type];
  const resource = config.resource;
  if (!unlocked) {
    if (window.prismState[resource] >= config.baseCost) {
      window.prismState[resource] -= config.baseCost;
      window.prismState.generatorUnlocked[type] = true;
      if (type === 'redlightparticles' && typeof window.trackRedLightParticleGeneration === 'function') {
        window.trackRedLightParticleGeneration();
      }
      updateAllLightCounters();
      updateLightGeneratorButtons();
      showGainPopup(`${type}particleCount`, 1, `${type} unlocked`);
      if (window.saveGame) window.saveGame();
    }
    return;
  }
  const cost = config.baseCost * Math.pow(10, upgrades);
  if (window.prismState[resource] >= cost) {
    window.prismState[resource] -= cost;
    window.prismState.generatorUpgrades[type] = upgrades + 1;
    updateAllLightCounters();
    updateLightGeneratorButtons();
    showGainPopup(`${type}particleCount`, 1, `${type} upgrade`);
    if (window.saveGame) window.saveGame();
  }
}

function tickLightGenerators(diff) {
  if (typeof state !== 'undefined' && (state.powerStatus !== 'online' || state.powerEnergy <= 0)) return;
  Object.keys(lightGeneratorConfigs).forEach(type => {
    if (!window.prismState.generatorUnlocked[type]) return;
    const config = lightGeneratorConfigs[type];
    const upgrades = window.prismState.generatorUpgrades[type] || 0;
    let rate = config.baseRate * Math.pow(2, upgrades);
    if (typeof boughtElements !== 'undefined' && boughtElements[15]) {
      rate *= 5;
    }
    if (typeof boughtElements !== 'undefined' && boughtElements[16] && typeof state !== 'undefined') {
      rate *= (state.powerEnergy / 10);
    }
    const accKey = `_accum_${type}`;
    if (!window.prismState[accKey]) window.prismState[accKey] = 0;
    window.prismState[accKey] += rate * diff;
    const whole = Math.floor(window.prismState[accKey]);
    if (whole > 0) {
      window.prismState[`${type}particle`] += whole;
      window.prismState[accKey] -= whole;
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
  Object.keys(lightGeneratorConfigs).forEach(type => {
    const config = lightGeneratorConfigs[type];
    const upgrades = window.prismState.generatorUpgrades[type] || 0;
    const unlocked = window.prismState.generatorUnlocked[type];
    const resource = config.resource;
    const btn = document.getElementById(`${type}GenBtn`);
    if (btn) {
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      if (!unlocked) {
        btn.textContent = `Buy (${formatNumber(config.baseCost)} ${resource})`;
        btn.disabled = window.prismState[resource] < config.baseCost;
      } else {
        const cost = config.baseCost * Math.pow(10, upgrades);
        btn.textContent = `Upgrade (${formatNumber(cost)} ${resource}) [Level ${upgrades}]`;
        btn.disabled = window.prismState[resource] < cost;
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
    if (typeof window.prismState[type] === 'undefined') {
      window.prismState[type] = 0;
    }
  });
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  particleTypes.forEach(type => {
    if (typeof window.prismState[type] === 'undefined') {
      window.prismState[type] = 0;
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
  updateAllLightCounters();
  updateLightGeneratorButtons();
}

window.handleLightGenClick = handleLightGenClick;
window.tickLightGenerators = tickLightGenerators;
window.initPrism = initPrism;
window.updateAllLightCounters = updateAllLightCounters;
window.updateLightGeneratorButtons = updateLightGeneratorButtons;
window.ensureClickHandlers = ensureClickHandlers;
window.showPrismSpeech = showPrismSpeech;
window.showViResponse = showViResponse;
window.checkViResponse = checkViResponse;
window.testPrismSpeech = function() {
  showPrismSpeech();
};
const prismQuotes = [
  { text: "Soo thhhish ish the Prishm labbb.", condition: () => state.grade >= 2 },
  { text: "Eech culler huolds a speshul powwuh...", condition: () => state.grade >= 2 },
  { text: "Soo mmanyy cullers... A'm dizzzyyy!", condition: () => state.grade >= 2 },
  { text: "Liit enerrgii feeels fluffy!", condition: () => state.grade >= 2 },
  { text: "Shhhe Prishm... Ittttt's cawwlin' to meee!", condition: () => state.grade >= 2 },
  { text: "tawkin' likh thish is diffi-cult! A'm tryin'!", condition: () => state.grade >= 2 },
  { text: "Mmmm hmmm, gotta hhhhhold the prrrrism, noooooo drropppy!", condition: () => state.grade >= 2 },
  { text: "Whaaaat iff... A eat the prishm? ...no?", condition: () => state.grade >= 2 },
  { text: "Nyyoooom! Rainbows go BRRRTTT!", condition: () => state.grade >= 2 },
  { text: "Isssh tha' red lighhht starin' at meee...?", condition: () => state.grade >= 4 },
  { text: "Don't sniffff the yelloww lighht... trusht meee.", condition: () => state.grade >= 2 },
  { text: "Dooon't thhhellll Viiii... A borrorwed theirr prishm.", condition: () => state.grade >= 2 },
  { text: "Heyyyyy Viiii, thuu gottthh thaa rockkk atthhachhed thooo thaaa thailll. ", condition: () => state.grade >= 3,},
  { text: "Woahhh... therrre's rrrred lightttttthhh nowwww.", condition: () => state.grade >= 4,},
  { text: "Woahhh... We'rrrrre gettthhingg whitttthhhe lighttthhh authomathhhicalyy.", condition: () => state.grade >= 5,},
  { text: "Woahhh... therrre's orrrangge lightttttthhh nowwww.", condition: () => state.grade >= 6,},
];
const viResponseQuotes = [
  { 
    trigger: "Whaaaat iff... A eat the prishm? ...no?", 
    response: "Don't",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Dooon't thhhellll Viiii... A borrorwed theirr prishm.", 
    response: "I know.",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Heyyyyy Viiii, thuu gottthh thaa rockkk atthhachhed thooo thaaa thailll.", 
    response: "It's not a rock, it's a prism.",
    condition: () => state.grade >= 3 
  },
  { 
    trigger: "Soo thhhish ish the Prishm labbb.", 
    response: "Yes, and you're acting drunk.",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Soo mmanyy cullers... A'm dizzzyyy!", 
    response: "...",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Liit enerrgii feeels fluffy!", 
    response: "Shush.",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Shhhe Prishm... Ittttt's cawwlin' to meee!", 
    response: "Shush.",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "tawkin' likh thish is diffi-cult! A'm tryin'!", 
    response: "Shush.",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Mmmm hmmm, gotta hhhhhold the prrrrism, noooooo drropppy!", 
    response: "Please do drop it.",
    condition: () => state.grade >= 2 
  },
  { 
    trigger: "Isssh tha' red lighhht starin' at meee...?", 
    response: "I am.",
    condition: () => state.grade >= 4 
  },
  { 
    trigger: "Don't sniffff the yelloww lighht... trusht meee.", 
    response: "Shush.",
    condition: () => state.grade >= 2 
  }
];

function showPrismSpeech() {
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
  if (prismSubTab && prismSubTab.style.display !== "none" && Math.random() < 0.4) {
    showPrismSpeech();
  }
}, 10000 + Math.floor(Math.random() * 10000)); 
if (!window.getLightGain) {
  window.getLightGain = function(baseLight) { return baseLight; } 
}
if (!window.getRedlightGain) {
  window.getRedlightGain = function(baseRedlight) { return baseRedlight; } 
}
if (!window.getOrangelightGain) {
  window.getOrangelightGain = function(baseOrangelight) { return baseOrangelight; } 
}
window.checkParticleRates = function() {
  Object.keys(lightGeneratorConfigs).forEach(type => {
    const config = lightGeneratorConfigs[type];
    const upgrades = window.prismState.generatorUpgrades[type] || 0;
    let rate = config.baseRate * Math.pow(2, upgrades);
    if (typeof boughtElements !== 'undefined' && boughtElements[15]) {
      rate *= 5;
    }
    if (typeof boughtElements !== 'undefined' && boughtElements[16] && typeof state !== 'undefined') {
      rate *= (state.powerEnergy / 10);
    }
  });
};

function showPrismGainPopup(id, amount, label) {
  const el = document.getElementById(id);
  if (!el) return;
  let popup = el.parentNode.querySelector('.gain-popup');
  if (popup) popup.remove();
  let displayAmount = formatNumber(Number(amount));
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

let viQuestReminderShown = false;
let viRedLightQuestReminderShown = false;

function checkAndShowViQuestReminder() {
    if (typeof state !== 'undefined' && state.quests && state.quests.viAutoLightGenerator === 'started' && !viQuestReminderShown) {
        const message = "Hey, I've made a new discovery but I'll need 15 Prisma shards to achieve it, this will make us automaticaly generate light";
        setTimeout(() => {
            if (typeof window.showViResponse === 'function') {
                window.showViResponse(message, true); 
            }
        }, 200);
        viQuestReminderShown = true;
    }
    if (typeof state !== 'undefined' && state.quests && state.quests.viAutoRedLightGenerator === 'started' && !viRedLightQuestReminderShown) {
        const prismaProgress = state.quests.viAutoRedLightGeneratorProgress || 0;
        const chargedProgress = state.quests.viAutoRedLightGeneratorChargedProgress || 0;
        const remainingPrisma = Math.max(0, 40 - prismaProgress);
        const remainingCharged = Math.max(0, 1 - chargedProgress);
        let message;
        if (remainingCharged === 0 && remainingPrisma === 0) {
            message = "Perfect! You've brought everything I need. The automatic red light collector is ready!";
        } else if (remainingCharged === 0) {
            message = `Great! You've given me the Charged Prisma Token. Now I just need ${remainingPrisma} more Prisma Shards to complete the automatic red light collector.`;
        } else if (remainingPrisma === 0) {
            message = `Excellent! You've provided all ${prismaProgress} Prisma Shards. Now I just need 1 Charged Prisma Token to finish the automatic red light collector.`;
        } else if (prismaProgress > 0 || chargedProgress > 0) {
            message = `Good progress! I still need ${remainingCharged > 0 ? `${remainingCharged} Charged Prisma Token${remainingCharged !== 1 ? 's' : ''}` : ''}${remainingCharged > 0 && remainingPrisma > 0 ? ' and ' : ''}${remainingPrisma > 0 ? `${remainingPrisma} more Prisma Shards` : ''} for the automatic red light collector.`;
        } else {
            message = "Impressive work with the light collector! I have another project. Bring me 1 Charged Prisma Token and 40 Prisma Shards, and I'll build you an automatic red light collector.";
        }
        setTimeout(() => {
            if (typeof window.showViResponse === 'function') {
                window.showViResponse(message, true); 
            }
        }, 200);
        viRedLightQuestReminderShown = true;
    }
}

function resetViQuestReminder() {
    viQuestReminderShown = false;
    viRedLightQuestReminderShown = false;
}

function updateViQuestDialogue() {
    if (typeof state !== 'undefined' && state.quests && state.quests.viAutoRedLightGenerator === 'started') {
        viRedLightQuestReminderShown = false;
        checkAndShowViQuestReminder();
    }
}

window.checkAndShowViQuestReminder = checkAndShowViQuestReminder;
window.resetViQuestReminder = resetViQuestReminder;
window.updateViQuestDialogue = updateViQuestDialogue;
window.debugQuestStates = function() {
    if (typeof state !== 'undefined' && state.quests) {
    }
    if (typeof window.activateViAutoLightQuest === 'function') {
        window.activateViAutoLightQuest();
    }
    if (typeof window.activateViAutoRedLightQuest === 'function') {
        window.activateViAutoRedLightQuest();
    }
};
window.testQuestCompletion = function() {
    if (typeof state !== 'undefined' && state.quests && state.quests.viAutoRedLightGenerator === 'started') {
        const neededPrisma = 40 - (state.quests.viAutoRedLightGeneratorProgress || 0);
        const neededCharged = 1 - (state.quests.viAutoRedLightGeneratorChargedProgress || 0);
    } else {
        if (typeof state !== 'undefined' && state.quests) {
        }
    }
};
window.testViDialogueUpdate = function() {
    if (typeof window.updateViQuestDialogue === 'function') {
        window.updateViQuestDialogue();
    } else {
    }
};
