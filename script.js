// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file





































let state = {
  fluff: 0,
  swaria: 0,
  feathers: 0,
  artifacts: 0,
  hasUnlockedSwariaKnowledge: true, 
  grade: 1,
  boxesProduced: 0, 
  boxesProducedByType: {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
    mythic: 0
  },
  powerEnergy: 100,
  powerMaxEnergy: 100,
  powerStatus: 'online', 
  powerLastTick: Date.now(),
  seenKpSoftcapStory: false, 
  seenKpMildcapStory: false, 
  seenFirstDeliveryStory: false, 
  seenGeneratorUnlockStory: false, 
  seenGeneratorTabFirstTime: false, 
  fluffInfinityCount: 0,
  swariaInfinityCount: 0,
  feathersInfinityCount: 0,
  artifactsInfinityCount: 0,
  berryPlates: 0,
  berryPlatesMax: 10,
  lastBerryPlateTime: Date.now(),
  berryPlate: 0,
  mushroomSoup: 0,
  batteries: 0,
  glitteringPetals: 0,
  chargedPrisma: 0,
  mysticCookingSpeedBoost: 0, 
  soapBatteryBoost: 0, 
  fluzzerGlitteringPetalsBoost: 0, 
  peachyHungerBoost: 0, 
  characterHunger: {
    swaria: 100,
    soap: 100,
    fluzzer: 100,
    mystic: 100,
    vi: 100
  },
  lastHungerTick: Date.now(),
  characterFullStatus: {
    swaria: 0, 
    soap: 0,
    fluzzer: 0,
    mystic: 0,
    vi: 0
  },
  hardModeQuestActive: true,
  hardModeQuestProgress: {
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
  }
};
let settings = {
  theme: "light",
  colour: "green",
  style: "rounded",
  confirmReset: true,
  confirmNectarizeReset: true,
  autosave: true,
};
window.settings = settings;
window.applySettings = applySettings;
let prismGridInitialized = false; 
let swariaKnowledge = {
  kp: 0
};
let boughtElements = {};
let currentKnowledgeSubTab = 'elementsMain'; 
let tickSpeedMultiplier = 1;
let tickInterval = setInterval(gameTick, 1000);
let generatorUpgrades = {
  common: 0,
  uncommon: 0,
  rare: 0,
  legendary: 0,
  mythic: 0
};
let currentHomeSubTab = 'gamblingMain';
window.isTabHidden = false;
document.addEventListener('visibilitychange', function() {
  window.isTabHidden = document.hidden;
});
let currentSaveSlot = null;
if (localStorage.getItem('currentSaveSlot')) {
  currentSaveSlot = parseInt(localStorage.getItem('currentSaveSlot'), 10);
}
let debugFluffGain = false;

function toggleFluffGainLogging() {
  debugFluffGain = !debugFluffGain;
  return debugFluffGain;
}

function sanityCheckCurrencies() {
  if (isNaN(state.fluff)) state.fluff = 0;
  if (isNaN(state.swaria)) state.swaria = 0;
  ['fluff', 'swaria', 'feathers', 'artifacts'].forEach(currency => {
    const infinityCountName = currency + 'InfinityCount';
    const hasInfinityCount = (state[infinityCountName] || 0) > 0;
    if (!isFinite(state[currency])) {
      if (hasInfinityCount) {
        state[currency] = 1;
      } else {
        state[currency] = 1e306;
      }
    } else if (state[currency] > 1e306) {
      state[currency] = 1e306;
    }
  });
}

function addCurrency(currencyName, amount) {
  if (amount <= 0) return;
  const currentValue = state[currencyName];
  const infinityCountName = currencyName + 'InfinityCount';
  const hasReachedInfinity = state[infinityCountName] && state[infinityCountName] > 0;
  if (hasReachedInfinity && currentValue >= 1e306) {
    state[currencyName] = 1;
    return;
  }
  const newValue = currentValue + amount;
  if (!isFinite(newValue) || newValue >= 1e306) {
    state[currencyName] = 1e306;
  } else {
    state[currencyName] = newValue;
  }
  checkCurrencyInfinity(currencyName);
}

let lastGameTick = Date.now();

function gameTick() {
  const now = Date.now();
  const diff = (now - lastGameTick) / 1000;
  lastGameTick = now;
  sanityCheckCurrencies();
  let fluffGain = Math.floor(getFluffRate());
  fluffGain = applyInfinitySoftcap(fluffGain, 'fluff');
  if (fluffGain > 1000 || state.fluff > 1e10) {
  }
  if (debugFluffGain) {
  }
  addCurrency('fluff', fluffGain);
  if (typeof window.trackFluffMilestone === 'function') {
    window.trackFluffMilestone(state.fluff);
  }
  tickGenerators(diff);
  if (boughtElements[7] && !(window.isTabHidden || document.hidden)) tickPowerGenerator(diff);
  if (window.charger && typeof window.chargerTick === 'function') {
    window.chargerTick(diff);
    if (typeof window.applyChargerMilestoneEffects === 'function') {
      window.applyChargerMilestoneEffects();
    }
  }
  if (window.tickLightGenerators) window.tickLightGenerators(diff);
  if (typeof getAutoLightGainPerSecond === 'function' && state.grade >= 5) {
    const autoGain = getAutoLightGainPerSecond();
    if (autoGain > 0 && window.prismState) {
      window.prismState.light += autoGain * diff;
      if (typeof updateAllLightCounters === 'function') updateAllLightCounters();
    }
  }
  if (typeof getAutoRedLightGainPerSecond === 'function' && state.grade >= 7) {
    const autoRedGain = getAutoRedLightGainPerSecond();
    if (autoRedGain > 0 && window.prismState) {
      window.prismState.redlight += autoRedGain * diff;
      if (typeof updateAllLightCounters === 'function') updateAllLightCounters();
    }
  }
  tickCafeteria(diff);
  updateUI();
}

if (window._mainGameTickInterval) clearInterval(window._mainGameTickInterval);
window._mainGameTickInterval = null;
if (window._gameTickInterval) clearInterval(window._gameTickInterval);
window._gameTickInterval = setInterval(gameTick, 100); 

function formatNumber(num) {
  if (!isFinite(num)) return 'Infinity';
  if (num === 0) return '0';
  num = Math.floor(Number(num));
  if (!isFinite(num)) return 'Infinity';
  if (num >= 1e6) {
    const exp = num.toExponential(2); 
    return exp;
  }
  return num.toLocaleString();
}

function checkCurrencyInfinity(currencyName) {
  const currencyValue = state[currencyName];
  const infinityCountName = currencyName + 'InfinityCount';
  if (currencyValue >= 1e306) {
    if (!state[infinityCountName] || state[infinityCountName] === 0) {
      state[infinityCountName] = 1;
      state[currencyName] = 1; 
      if (currencyName === 'fluff' && typeof window.trackInfinityMilestone === 'function') {
        window.trackInfinityMilestone(state.fluffInfinityCount);
      }
      if (currencyName === 'fluff' && state.fluffInfinityCount === 1 && !state.seenInfinityFluffStory) {
        state.seenInfinityFluffStory = true;
        if (typeof saveGame === 'function') saveGame();
        if (typeof showInfinityFluffStoryModal === 'function') {
          showInfinityFluffStoryModal();
        }
      }
      return true; 
    } else if (state[infinityCountName] > 0 && currencyValue >= 1e306) {
      if (state[infinityCountName] < 1) {
        state[infinityCountName]++;
      }
      state[currencyName] = 1;
      if (currencyName === 'fluff' && typeof window.trackInfinityMilestone === 'function') {
        window.trackInfinityMilestone(state.fluffInfinityCount);
      }
      return true; 
    } else {
      return false; 
    }
  }
  return false; 
}

function applyInfinitySoftcap(amount, currencyName) {
  const infinityCountName = currencyName + 'InfinityCount';
  const infinityCount = state[infinityCountName] || 0;
  if (infinityCount > 0) {
    if (currencyName === 'fluff') {
      return amount;
    }
    return amount / Math.pow(1e306, infinityCount);
  }
  return amount;
}

function getCombinedInfinityCount() {
  return (state.fluffInfinityCount || 0) + 
         (state.swariaInfinityCount || 0) + 
         (state.feathersInfinityCount || 0) + 
         (state.artifactsInfinityCount || 0);
}

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
    "symbol": "Mn", 
    "name": "Manganese"
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

function renderElementGrid() {
  const grid = document.getElementById("elementGrid");
  grid.innerHTML = "";
  for (let i = 1; i <= 118; i++) {
    const data = elementData[i] || {};
    const pos = elementPositions[i];
    if (!pos) continue;
    const tile = document.createElement("div");
    tile.classList.add("element-tile", data.category || "unknown");
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
        const kpCost = getElementKPCost(i);
        const effectText = getElementEffectText(i);
        const kpCostDisplay = formatNumber(kpCost);
        document.getElementById("elementTooltip").innerHTML = 
          `<span style="color:#FFD700;">${formatLargeInt(kpCost)} KP</span> - ${effectText}`;
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
  const hasFluffInfinity = state.fluffInfinityCount && state.fluffInfinityCount > 0;
  if (hasFluffInfinity) {
  } else if (state.fluff < box.cost) {
    return;
  } else {
    state.fluff -= box.cost;
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
    if (boughtElements[3]) swariaGain += Math.floor(state.feathers * 0.1);
    swariaGain = getSwariaCoinGain(swariaGain);
  }
  let featherGain = 0;
  if (["rare", "legendary", "mythic"].includes(type)) {
    featherGain = rng(...box.feather);
    if (boughtElements[4]) {
      featherGain += Math.floor(state.artifacts * 0.1);
    }
    if (typeof state !== 'undefined' && typeof prismState !== 'undefined' && state.grade >= 4) {
      featherGain += (prismState.redlight || 0);
    }
  }
  let artifactGain = 0;
  if (["legendary", "mythic"].includes(type)) {
    artifactGain = rng(...box.artifact);
    if (boughtElements[6]) {
      artifactGain += Math.floor(swariaKnowledge.kp * 0.1);
    }
    if (typeof state !== 'undefined' && state.grade >= 5) {
      artifactGain *= Math.pow(2, state.grade - 4);
    }
    if (typeof prismState !== 'undefined' && prismState.orangelight) {
      artifactGain *= (1 + prismState.orangelight);
    }
  }
  if (boughtElements[11]) {
    if (type === "uncommon") {
      const boost = 1 + (state.boxesProducedByType.uncommon * 0.01);
      swariaGain = Math.floor(swariaGain * boost);
      showGainPopup("swariaGain", `× ${Math.floor(boost)} Swaria Coins`, "Swaria Coins");
    }
    if (type === "rare") {
      const boost = 1 + (state.boxesProducedByType.rare * 0.01);
      featherGain = Math.floor(featherGain * boost);
      showGainPopup("featherGain", `× ${Math.floor(boost)} Feathers`, "Feathers");
    }
    if (type === "legendary") {
      const boost = 1 + (state.boxesProducedByType.legendary * 0.01);
      artifactGain = Math.floor(artifactGain * boost);
      showGainPopup("artifactGain", `× ${Math.floor(boost)} Artifacts`, "Artifacts");
    }
  }
  swariaGain = Math.floor(swariaGain);
  featherGain = Math.floor(featherGain);
  artifactGain = Math.floor(artifactGain);
  swariaGain = applyInfinitySoftcap(swariaGain, 'swaria');
  featherGain = applyInfinitySoftcap(featherGain, 'feathers');
  artifactGain = applyInfinitySoftcap(artifactGain, 'artifacts');
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
  if (swariaGain > 0) showGainPopup("swariaGain", swariaGain, "Swaria Coins");
  if (featherGain > 0) showGainPopup("featherGain", featherGain, "Feathers");
  if (artifactGain > 0) showGainPopup("artifactGain", artifactGain, "Artifacts");
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
  if (state.artifacts >= 50) {
    let kpGain = getKpGainPreview();
    if (settings.confirmReset) {
      if (!confirm(`Reset and gain ${formatNumber(kpGain)} Knowledge Points?`)) return;
    }
    const isFirstTimeKP = swariaKnowledge.kp === 0;
    swariaKnowledge.kp += kpGain;
    if (typeof window.trackKPMilestone === 'function') {
      window.trackKPMilestone(swariaKnowledge.kp);
    }
    state.fluff = 0;
    state.swaria = 0;
    state.feathers = 0;
    state.artifacts = 0;
    state.fluffInfinityCount = 0;
    state.swariaInfinityCount = 0;
    state.feathersInfinityCount = 0;
    state.artifactsInfinityCount = 0;
    state.fluffRateInfinityCount = 0;
    state.boxesProduced = 0;
    state.boxesProducedByType = {
      common: 0,
      uncommon: 0,
      rare: 0,
      legendary: 0,
      mythic: 0
    };
    if (!state.hardModeQuestActive) {
      state.hardModeQuestActive = true;
    }
    if (!state.quests) {
      state.quests = {
        viAutoLightGenerator: 'not_started',
        viAutoLightGeneratorProgress: 0
      };
    }
    if (state.quests.viAutoLightGenerator === 'completed') {
    } else if (state.grade >= 5 && state.quests.viAutoLightGenerator === 'not_started') {
      state.quests.viAutoLightGenerator = 'started';
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
    window.location.reload();
  }
}

function getFluffRate() {
  let base = 1;
  if (boughtElements["1"]) base *= 1.25;
  if (boughtElements["5"]) base *= 1.25;
  const grade = state.grade || 1;
  if (grade >= 2) {
    const gradeBoost = Math.pow(2, grade - 1);
    base *= gradeBoost;
  }
  let swariaBoost = 0;
  if (boughtElements[12]) {
    swariaBoost = applyInfinitySoftcap(state.swaria, 'swaria') * 100;
  } else {
    swariaBoost = applyInfinitySoftcap(state.swaria, 'swaria') * 3;
  }
  const featherBoost = applyInfinitySoftcap(state.feathers, 'feathers') * 10;
  const artifactBoost = applyInfinitySoftcap(state.artifacts, 'artifacts') * 25;
  let commonBoxBoost = 1;
  if (boughtElements[11]) {
    commonBoxBoost = 1 + (state.boxesProducedByType.common * 0.01);
  }
  let total = (base + swariaBoost + featherBoost + artifactBoost) * commonBoxBoost;
  return Math.floor(total);
}

function getElementCost(index) {
  if (index === 1) return 9; 
  if (index === 2) return 50;
  if (index === 3) return 125;
  if (index === 4) return 200;
  if (index === 5) return 500;
  if (index === 6) return 600;
  if (index === 7) return 3500;
  if (index === 8) return 8000;
  if (index === 9) return 1e6;
  if (index === 10) return 1e8;
  if (index === 11) return 1e12;
  if (index === 12) return 1e13;
  if (index === 13) return 1e15;
  if (index === 14) return 1e17;
  if (index === 15) return 1e25;
  if (index === 16) return 1e28;
  if (index === 17) return 1e32;
  if (index === 18) return 1e35;
  if (index === 19) return 1e38;
  if (index === 20) return 1e43;
  if (index === 21) return 1e45;
  if (index === 22) return 1e46;
  if (index === 23) return 1e48;
  if (index === 24) return 1e50;
  return 9999;
}

function getElementKPCost(index) {
    if (index === 1) return 9;
    if (index === 2) return 50;
    if (index === 3) return 125;
    if (index === 4) return 200;
    if (index === 5) return 500;
    if (index === 6) return 600;
    if (index === 7) return 3500;
    if (index === 8) return 8000;
    if (index === 9) return 1e6;
    if (index === 10) return 1e8;
    if (index === 11) return 1e12;
    if (index === 12) return 1e13;
    if (index === 13) return 1e15;
    if (index === 14) return 1e17;
    if (index === 15) return 1e25;
    if (index === 16) return 1e28;
    if (index === 17) return 1e32;
    if (index === 18) return 1e35;
    if (index === 19) return 1e38;
    if (index === 20) return 1e43;
    if (index === 21) return 1e45;
    if (index === 22) return 1e46;
    if (index === 23) return 1e48;
    if (index === 24) return 1e50;
  return 1e300; 
}

if (!state.elementDiscoveryProgress) {
  state.elementDiscoveryProgress = 0;
}

function getHighestElementDiscovery() {
  return state.elementDiscoveryProgress || 0;
}

function getHighestBoughtElement() {
  let highest = 0;
  for (let key in boughtElements) {
    if (boughtElements[key] && parseInt(key) > highest) {
      highest = parseInt(key);
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
    30: "Change the KP formula to now count Fluff instead of Swaria coins",
  };
  return effects[index] || "Not yet implemented";
}

function applyElementEffect(index) {
  if (index === 1) {
    tickSpeedMultiplier = 1.25;
    clearInterval(tickInterval);
    tickInterval = setInterval(gameTick, 1000 / tickSpeedMultiplier);
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
  const cost = getElementCost(index);
  if (boughtElements[index]) return;
  if (swariaKnowledge.kp < cost) return;
  if (index === 7) {
    document.getElementById("generatorSubTabBtn").style.display = "inline-block";
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
  if (state.grade >= 7) {
    const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
    if (infinityResearchBtn) {
      infinityResearchBtn.style.display = "inline-block";
    }
  }
  if (index === 9) {
    const genTab = document.getElementById("generatorSubTab");
    if (genTab && genTab.style.display !== "none") {
      renderGenerators();
    }
  }
  if (index === 10) {
    if (typeof window.triggerElement10IntercomEvent === 'function') {
      setTimeout(() => {
        window.triggerElement10IntercomEvent();
      }, 500);
    }
  }
  if (index === 20) {
    if (typeof window.triggerElement20IntercomEvent === 'function') {
      setTimeout(() => {
        window.triggerElement20IntercomEvent();
      }, 500);
    }
  }
  swariaKnowledge.kp -= cost;
  boughtElements[index] = true;
  window.boughtElements = boughtElements; 
  applyElementEffect(index);
  updateElementDiscoveryProgress(index);
  if (typeof window.trackElementDiscovery === 'function') {
    window.trackElementDiscovery(boughtElements);
  }
  updateUI();
  updateKnowledgeUI();
  applySettings();
  renderElementGrid(); 
}

function updateUI() {
  let rawFluffGain = Math.floor(getFluffRate());
  let softcappedFluffGain = applyInfinitySoftcap(rawFluffGain, 'fluff');
  const maxGain = Math.max(0, 1e306 - state.fluff);
  let finalFluffGain = Math.min(softcappedFluffGain, maxGain);
  const fluffEl = document.getElementById("fluff");
  if (fluffEl) {
    if (state.fluffInfinityCount > 0) {
      fluffEl.style.display = "none";
    } else {
      fluffEl.style.display = "";
      fluffEl.textContent = formatNumber(state.fluff);
    }
  }
  const fluffRateEl = document.getElementById("fluffRate");
  if (fluffRateEl) {
    if (state.fluffInfinityCount > 0) {
      fluffRateEl.parentElement.style.display = "none";
    } else {
      fluffRateEl.parentElement.style.display = "";
      fluffRateEl.textContent = formatNumber(finalFluffGain);
    }
  }
  const swariaEl = document.getElementById("swaria");
  if (swariaEl) {
    if (state.swariaInfinityCount > 0) {
      swariaEl.style.display = "none";
    } else {
      swariaEl.style.display = "";
      swariaEl.textContent = formatNumber(state.swaria);
    }
  }
  const feathersEl = document.getElementById("feathers");
  if (feathersEl) {
    if (state.feathersInfinityCount > 0) {
      feathersEl.style.display = "none";
    } else {
      feathersEl.style.display = "";
      feathersEl.textContent = formatNumber(state.feathers);
    }
  }
  const artifactsEl = document.getElementById("artifacts");
  if (artifactsEl) {
    if (state.artifactsInfinityCount > 0) {
      artifactsEl.style.display = "none";
    } else {
      artifactsEl.style.display = "";
      artifactsEl.textContent = formatNumber(state.artifacts);
    }
  }
  updateCafeteriaUI();
  updateSwariaHungerUI();
  const fluffInfinityEl = document.getElementById("fluffInfinity");
  const swariaInfinityEl = document.getElementById("swariaInfinity");
  const feathersInfinityEl = document.getElementById("feathersInfinity");
  const artifactsInfinityEl = document.getElementById("artifactsInfinity");
  if (fluffInfinityEl && state.fluffInfinityCount > 0) {
    fluffInfinityEl.textContent = `∞`;
  } else if (fluffInfinityEl) {
    fluffInfinityEl.textContent = "";
  }
  if (swariaInfinityEl && state.swariaInfinityCount > 0) {
    swariaInfinityEl.textContent = `∞`;
  } else if (swariaInfinityEl) {
    swariaInfinityEl.textContent = "";
  }
  if (feathersInfinityEl && state.feathersInfinityCount > 0) {
    feathersInfinityEl.textContent = `∞`;
  } else if (feathersInfinityEl) {
    feathersInfinityEl.textContent = "";
  }
  if (artifactsInfinityEl && state.artifactsInfinityCount > 0) {
    artifactsInfinityEl.textContent = `∞`;
  } else if (artifactsInfinityEl) {
    artifactsInfinityEl.textContent = "";
  }
  {
  const kpPreview = document.getElementById("kpPreview");
  if (kpPreview) {
    let preview = getKpGainPreview();
    let isSoftcapped = preview >= 1e20 && preview < 1e40;
    let isMildcapped = preview >= 1e40;
    let capLabel = isMildcapped ? ' (mildcap)' : (isSoftcapped ? ' (softcap)' : '');
    kpPreview.textContent = `Gain ${formatNumber(preview)} KP on reset` + capLabel;
    kpPreview.style.display = (boughtElements[10] ? state.feathers : state.artifacts) >= 50 ? "block" : "none";
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
  document.getElementById("resetBtn").style.display = state.artifacts >= 50 ? "block" : "none";
  if (swariaKnowledge.kp > 0) {
    document.getElementById("kpLine").style.display = "block";
    document.getElementById("kp").textContent = formatLargeInt(swariaKnowledge.kp);
  }
  const boxesProducedEl = document.getElementById("boxesProduced");
  if (boxesProducedEl) {
    boxesProducedEl.textContent = formatNumber(Math.floor(state.boxesProduced || 0));
  }
  const boxesCountEl = document.getElementById("boxesProducedCount");
  if (boxesCountEl) {
    boxesCountEl.textContent = formatNumber(Math.floor(state.boxesProduced || 0));
  }
  updateGeneratorsUI();
  updateGeneratorUpgradesUI();
  updateWingArtifactUI();
  updatePrismSubTabVisibility();
  updateStairsCardVisibility();
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
      if (typeof window.kitchenIngredients[type] !== 'number') window.kitchenIngredients[type] = 0;
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
    elementDiscoveryProgress: state.elementDiscoveryProgress || 0,
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
    terrariumNectar: window.terrariumNectar || 0,
    terrariumKpNectarUpgradeLevel: window.terrariumKpNectarUpgradeLevel || 0,
    terrariumPollenFlowerNectarUpgradeLevel: window.terrariumPollenFlowerNectarUpgradeLevel || 0,
    terrariumNectarXpUpgradeLevel: window.terrariumNectarXpUpgradeLevel || 0,
    terrariumNectarValueUpgradeLevel: window.terrariumNectarValueUpgradeLevel || 0,
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
        kitchenIngredients: window.kitchenIngredients || {},
    friendship: window.friendship || {},
    berryCookingState: berryCookingState,
    swabucks: (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0,
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
    }
  };
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    localStorage.setItem(`swariaSaveSlot${currentSaveSlot}`, JSON.stringify(save));
  } else {
    localStorage.setItem("swariaSave", JSON.stringify(save));
  }
  if (typeof window.saveChargerState === 'function') {
    window.saveChargerState();
  }
}

function loadGame() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  let save;
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    save = slotData ? JSON.parse(slotData) : {};
  } else {
    save = JSON.parse(localStorage.getItem("swariaSave") || "{}" );
  }
  if (save.state) Object.assign(state, save.state);
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
  generatorUpgrades = save.generatorUpgrades || {};
  if (save.elementDiscoveryProgress !== undefined) {
    state.elementDiscoveryProgress = save.elementDiscoveryProgress;
  }
  if (typeof window.trackElementDiscovery === 'function') {
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
  if (typeof window.trackViAutoLightQuestCompletion === 'function' && state.quests && state.quests.viAutoLightGenerator === 'completed') {
    window.trackViAutoLightQuestCompletion();
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
  if (typeof window.trackInfinityMilestone === 'function' && state.fluffInfinityCount > 0) {
    window.trackInfinityMilestone(state.fluffInfinityCount);
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
    Object.assign(window.prismState, save.prismState);
  }
  if (save.chargerState && window.charger) {
    window.charger.charge = save.chargerState.charge || 0;
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
  if (!state.powerEnergy) state.powerEnergy = 100;
  if (!state.powerMaxEnergy) state.powerMaxEnergy = calculatePowerGeneratorCap();
  if (!state.powerStatus) state.powerStatus = 'online';
  if (!state.powerLastTick) state.powerLastTick = Date.now();
  if (!state.boxesProduced) state.boxesProduced = 0;
  if (!state.boxesProducedByType) {
    state.boxesProducedByType = {
      common: 0,
      uncommon: 0,
      rare: 0,
      legendary: 0,
      mythic: 0
    };
  }
  if (!state.fluffInfinityCount) state.fluffInfinityCount = 0;
  if (!state.swariaInfinityCount) state.swariaInfinityCount = 0;
  if (!state.feathersInfinityCount) state.feathersInfinityCount = 0;
  if (!state.artifactsInfinityCount) state.artifactsInfinityCount = 0;
  if (!state.fluffRateInfinityCount) state.fluffRateInfinityCount = 0;
  if (typeof state.soapTotalChargeEaten !== 'number') state.soapTotalChargeEaten = 0;
  if (window.charger && save.chargerState && typeof save.chargerState.charge !== 'undefined') {
    window.charger.charge = save.chargerState.charge;
  }
  else if (window.charger && typeof save.chargerCharge !== 'undefined') {
    window.charger.charge = save.chargerCharge;
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
  if (typeof save.terrariumPollen !== 'undefined') window.terrariumPollen = save.terrariumPollen;
  if (typeof save.terrariumFlowers !== 'undefined') window.terrariumFlowers = save.terrariumFlowers;
  if (typeof save.terrariumXP !== 'undefined') window.terrariumXP = save.terrariumXP;
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
        window.terrariumKpNectarUpgradeLevel = (typeof save.terrariumKpNectarUpgradeLevel !== 'undefined') ? save.terrariumKpNectarUpgradeLevel : 0;
        window.terrariumPollenFlowerNectarUpgradeLevel = (typeof save.terrariumPollenFlowerNectarUpgradeLevel !== 'undefined') ? save.terrariumPollenFlowerNectarUpgradeLevel : 0;
        window.terrariumNectarXpUpgradeLevel = (typeof save.terrariumNectarXpUpgradeLevel !== 'undefined') ? save.terrariumNectarXpUpgradeLevel : 0;
        window.terrariumNectarValueUpgradeLevel = (typeof save.terrariumNectarValueUpgradeLevel !== 'undefined') ? save.terrariumNectarValueUpgradeLevel : 0;
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
  if (swariaKnowledge.kp > 0 || Object.keys(boughtElements).length > 0) {
    document.getElementById("knowledgeTab").style.display = "inline-block";
  }
  if (boughtElements[7]) {
    document.getElementById("generatorSubTabBtn").style.display = "inline-block";
    document.getElementById("subTabNav").style.display = "flex";
    if (currentHomeSubTab === 'generatorSubTab') {
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
  if (state.grade >= 7) {
    const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
    if (infinityResearchBtn) {
      infinityResearchBtn.style.display = "inline-block";
    }
  }
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
  ['mushroom', 'sparks', 'berries', 'petals', 'water', 'prisma', 'stardust', 'swabucks', 'berryPlate',].forEach(type => {
    if (typeof window.kitchenIngredients[type] !== 'number') window.kitchenIngredients[type] = 0;
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
if (typeof save.swabucks === 'number') window.state.swabucks = save.swabucks;
else window.state.swabucks = 0;
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
  if (!state.berryPlates) state.berryPlates = 0;
  if (!state.berryPlatesMax) state.berryPlatesMax = 10;
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
  if (typeof window.activateViAutoRedLightQuest === 'function') {
    window.activateViAutoRedLightQuest();
  }
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
    kitchenIngredients: window.kitchenIngredients || {},
    friendship: window.friendship || {},
    berryCookingState: localStorage.getItem('berryCookingState') || null,
    swabucks: (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0,
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
    })()
  };
  const saveData = btoa(unescape(encodeURIComponent(JSON.stringify(save))));
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
    const save = JSON.parse(decoded);
    if (save.state) Object.assign(state, save.state);
    if (!state.characterHunger) state.characterHunger = {};
    if (typeof state.characterHunger.swaria !== 'number') state.characterHunger.swaria = 100;
    if (typeof state.characterHunger.soap !== 'number') state.characterHunger.soap = 100;
    if (typeof state.characterHunger.fluzzer !== 'number') state.characterHunger.fluzzer = 100;
    if (typeof state.characterHunger.mystic !== 'number') state.characterHunger.mystic = 100;
    if (typeof state.characterHunger.vi !== 'number') state.characterHunger.vi = 100;
    if (save.settings) Object.assign(settings, save.settings);
    if (save.swariaKnowledge) Object.assign(swariaKnowledge, save.swariaKnowledge);
    boughtElements = save.boughtElements || {};
    generatorUpgrades = save.generatorUpgrades || {};
    if (save.elementDiscoveryProgress !== undefined) {
      state.elementDiscoveryProgress = save.elementDiscoveryProgress;
    }
    if (typeof window.trackElementDiscovery === 'function') {
      window.trackElementDiscovery(boughtElements);
    }
    if (typeof window.trackViAutoLightQuestCompletion === 'function' && state.quests && state.quests.viAutoLightGenerator === 'completed') {
      window.trackViAutoLightQuestCompletion();
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
    if (typeof window.trackInfinityMilestone === 'function' && state.fluffInfinityCount > 0) {
      window.trackInfinityMilestone(state.fluffInfinityCount);
    }
    if (state.grade >= 7) {
      const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
      if (infinityResearchBtn) {
        infinityResearchBtn.style.display = "inline-block";
      }
    }
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
      Object.assign(window.prismState, save.prismState);
    if (typeof window.trackRedLightParticleGeneration === 'function' && window.prismState.generatorUnlocked && window.prismState.generatorUnlocked.redlight) {
      window.trackRedLightParticleGeneration();
    }
    }
    if (!state.boxesProduced) state.boxesProduced = 0;
    if (!state.boxesProducedByType) {
      state.boxesProducedByType = {
        common: 0,
        uncommon: 0,
        rare: 0,
        legendary: 0,
        mythic: 0
      };
    }
    if (!state.powerEnergy) state.powerEnergy = 100;
    if (!state.powerMaxEnergy) state.powerMaxEnergy = calculatePowerGeneratorCap();
    if (!state.powerStatus) state.powerStatus = 'online';
    if (!state.powerLastTick) state.powerLastTick = Date.now();
    if (!state.fluffInfinityCount) state.fluffInfinityCount = 0;
    if (!state.swariaInfinityCount) state.swariaInfinityCount = 0;
    if (!state.feathersInfinityCount) state.feathersInfinityCount = 0;
    if (!state.artifactsInfinityCount) state.artifactsInfinityCount = 0;
    if (!state.fluffRateInfinityCount) state.fluffRateInfinityCount = 0;
    applySettings();
    updateUI();
    updateKnowledgeUI();
    if (typeof updateGradeUI === 'function') updateGradeUI();
    if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
    if (window.initPrism) window.initPrism();
    if (swariaKnowledge.kp > 0 || Object.keys(boughtElements).length > 0) {
      document.getElementById("knowledgeTab").style.display = "inline-block";
    }
    if (boughtElements[7]) {
      document.getElementById("generatorSubTabBtn").style.display = "inline-block";
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
    if (currentHomeSubTab === 'generatorSubTab' && typeof renderGenerators === 'function') {
      renderGenerators();
    }
    if (typeof updateGeneratorsUI === 'function') updateGeneratorsUI();
    if (window.charger && typeof save.chargerCharge !== 'undefined') {
      window.charger.charge = save.chargerCharge;
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
      window.charger.charge = save.chargerState.charge || 0;
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
    if (typeof save.terrariumPollen !== 'undefined') window.terrariumPollen = save.terrariumPollen;
    if (typeof save.terrariumFlowers !== 'undefined') window.terrariumFlowers = save.terrariumFlowers;
    if (typeof save.terrariumXP !== 'undefined') window.terrariumXP = save.terrariumXP;
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
        window.terrariumKpNectarUpgradeLevel = (typeof save.terrariumKpNectarUpgradeLevel !== 'undefined') ? save.terrariumKpNectarUpgradeLevel : 0;
        window.terrariumPollenFlowerNectarUpgradeLevel = (typeof save.terrariumPollenFlowerNectarUpgradeLevel !== 'undefined') ? save.terrariumPollenFlowerNectarUpgradeLevel : 0;
        window.terrariumNectarXpUpgradeLevel = (typeof save.terrariumNectarXpUpgradeLevel !== 'undefined') ? save.terrariumNectarXpUpgradeLevel : 0;
        window.terrariumNectarValueUpgradeLevel = (typeof save.terrariumNectarValueUpgradeLevel !== 'undefined') ? save.terrariumNectarValueUpgradeLevel : 0;
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
    if (swariaKnowledge.kp > 0 || Object.keys(boughtElements).length > 0) {
      document.getElementById("knowledgeTab").style.display = "inline-block";
    }
    if (boughtElements[7]) {
      document.getElementById("generatorSubTabBtn").style.display = "inline-block";
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
    if (currentHomeSubTab === 'generatorSubTab' && typeof renderGenerators === 'function') {
      renderGenerators();
    }
    if (typeof updateGeneratorsUI === 'function') updateGeneratorsUI();
    if (window.charger && typeof save.chargerCharge !== 'undefined') {
      window.charger.charge = save.chargerCharge;
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
      window.charger.charge = save.chargerState.charge || 0;
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
    if (typeof save.terrariumPollen !== 'undefined') window.terrariumPollen = save.terrariumPollen;
    if (typeof save.terrariumFlowers !== 'undefined') window.terrariumFlowers = save.terrariumFlowers;
    if (typeof save.terrariumXP !== 'undefined') window.terrariumXP = save.terrariumXP;
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
    if (typeof save.swabucks === 'number') window.state.swabucks = save.swabucks;
    else window.state.swabucks = 0;
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
  if (typeof window.activateViAutoRedLightQuest === 'function') {
    window.activateViAutoRedLightQuest();
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
    const genTab = document.getElementById('generatorSubTab');
    const chargerTab = document.getElementById('chargerSubTab');
    if ((genTab && genTab.style.display !== 'none') || (chargerTab && chargerTab.style.display !== 'none')) {
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
    if (currentHomeSubTab === 'generatorSubTab') {
      setTimeout(() => {
        document.body.classList.add('generator-bg');
        document.documentElement.classList.add('generator-bg');
      }, 0);
    }
    const prismSubTab = document.getElementById('prismSubTab');
    if (prismSubTab && prismSubTab.style.display !== 'none') {
      document.body.classList.add('prism-bg-active');
      setTimeout(() => {
        const cards = document.querySelectorAll('.prism-top-row .card');

        function updateShine(e) {
          const tabRect = prismSubTab.getBoundingClientRect();
          let x = e.clientX - tabRect.left;
          x = ((x % tabRect.width) + tabRect.width) % tabRect.width;
          cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            let cardX = x / tabRect.width * rect.width;
            card.style.setProperty('--shine-x', `${cardX - rect.width/2}px`);
            card.style.setProperty('--shine-y', '0px');
          });
        }

        function resetShine() {
          cards.forEach(card => {
            card.style.setProperty('--shine-x', '0px');
            card.style.setProperty('--shine-y', '0px');
          });
        }

        prismSubTab.addEventListener('mousemove', updateShine);
        window.addEventListener('mouseout', function(e) {
          if (!e.relatedTarget && document.body.classList.contains('prism-bg-active')) {
            resetShine();
          }
        });
      }, 0);
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
  document.body.classList.remove('generator-bg');
  document.documentElement.classList.remove('generator-bg');
  if (subTabId === 'generatorSubTab' || subTabId === 'chargerSubTab') {
    setTimeout(() => {
      document.body.classList.add('generator-bg');
      document.documentElement.classList.add('generator-bg');
      if (subTabId === 'generatorSubTab') {
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
      }
    }, 0);
  } else {
    const fixed = document.getElementById('powerGeneratorFixed');
    if (fixed) fixed.style.display = 'none';
  }
  const genTab = document.getElementById('generatorSubTab');
  if (subTabId === 'generatorSubTab') {
    if (genTab) {
      genTab.classList.add('generator-darkness');

      function updateCursorLight(e) {
        const x = e.clientX;
        const y = e.clientY;
        genTab.style.setProperty('--cursor-x', x + 'px');
        genTab.style.setProperty('--cursor-y', y + 'px');
      }

      window._genCursorLightHandler = updateCursorLight;
      window.addEventListener('mousemove', updateCursorLight);
      genTab.style.setProperty('--cursor-x', window.innerWidth/2 + 'px');
      genTab.style.setProperty('--cursor-y', window.innerHeight/2 + 'px');
    }
  } else {
    if (genTab) {
      genTab.classList.remove('generator-darkness');
      genTab.style.removeProperty('--cursor-x');
      genTab.style.removeProperty('--cursor-y');
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
    window.initPrism();
    if (typeof window.updateAllLightCounters === 'function') {
      window.updateAllLightCounters();
    }
    if (typeof window.updateLightGeneratorButtons === 'function') {
      window.updateLightGeneratorButtons();
    }
    if (
      typeof state !== 'undefined' &&
      state.grade >= 5 &&
      state.quests &&
      state.quests.viAutoLightGenerator !== 'completed' &&
      typeof window.showViResponse === 'function'
    ) {
      window.showViResponse("Peachy, your work is impressive. If you bring me 15 Prisma Shards, I can build you an automatic light collector.");
    }
    if (typeof window.enterPrismLab === 'function') {
      window.enterPrismLab();
    }
  } else if (subTabId !== "prismSubTab") {
    if (typeof window.leavePrismLab === 'function') {
      window.leavePrismLab();
    }
  }
  if (subTabId === "generatorSubTab") {
    setTimeout(() => {
      updatePowerGeneratorUI();
    }, 100);
  }
  if (subTabId === 'prismSubTab') {
    document.body.classList.add('prism-bg-active');
    setTimeout(() => {
      const prismTab = document.getElementById('prismSubTab');
      const cards = document.querySelectorAll('.prism-top-row .card');

      function updateShine(e) {
        const tabRect = prismTab.getBoundingClientRect();
        let x = e.clientX - tabRect.left;
        x = ((x % tabRect.width) + tabRect.width) % tabRect.width;
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          let cardX = x / tabRect.width * rect.width;
          card.style.setProperty('--shine-x', `${cardX - rect.width/2}px`);
          card.style.setProperty('--shine-y', '0px');
        });
      }

      function resetShine() {
        cards.forEach(card => {
          card.style.setProperty('--shine-x', '0px');
          card.style.setProperty('--shine-y', '0px');
        });
      }

      prismTab.addEventListener('mousemove', updateShine);
      window.addEventListener('mouseout', function(e) {
        if (!e.relatedTarget && document.body.classList.contains('prism-bg-active')) {
          resetShine();
        }
      });
      if (typeof showPrismSpeech === 'function') {
        showPrismSpeech();
      } else {
      }
    }, 0);
  } else {
    document.body.classList.remove('prism-bg-active');
  }
  if (subTabId !== 'generatorSubTab') {
    clearGeneratorDarknessOverlay();
  } else {
    updateGeneratorDarknessOverlay();
  }
  if (subTabId === 'prismSubTab') {
    if (typeof window.checkAndShowViQuestReminder === 'function') {
      window.checkAndShowViQuestReminder();
    }
  } else {
    if (typeof window.resetViQuestReminder === 'function') {
      window.resetViQuestReminder();
    }
  }
  if (subTabId !== 'prismSubTab') {
    const viSpeechBubble = document.getElementById('viSpeechBubble');
    if (viSpeechBubble) {
      viSpeechBubble.style.display = 'none';
    }
  }
}

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
}

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
  const wing = state.artifacts;
  const wingLine = document.getElementById("wingProgress");
  const wingValue = document.getElementById("artifactsResetCheck");
  if (wing >= 50) {
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
  if (!box) return { swariaGain: 0, featherGain: 0, artifactGain: 0 };
  if (!count || count < 1) return { swariaGain: 0, featherGain: 0, artifactGain: 0 };
  state.boxesProduced = (state.boxesProduced || 0) + count;
  if (state.boxesProducedByType && state.boxesProducedByType[type] !== undefined) {
    state.boxesProducedByType[type] += count;
  }
  let swariaGain = 0;
  let featherGain = 0;
  let artifactGain = 0;
  if (["common", "uncommon", "rare", "legendary", "mythic"].includes(type)) {
    const avgSwaria = ((box.swaria[0] + box.swaria[1]) / 2) * rewardMultiplier;
    swariaGain = avgSwaria * count;
    if (boughtElements[2]) swariaGain += 3 * rewardMultiplier * count;
    if (boughtElements[3]) swariaGain += Math.floor(state.feathers * 0.1) * rewardMultiplier * count;
    swariaGain = getSwariaCoinGain(swariaGain);
  }
  if (["rare", "legendary", "mythic"].includes(type)) {
    const avgFeather = ((box.feather[0] + box.feather[1]) / 2) * rewardMultiplier;
    featherGain = avgFeather * count;
    if (boughtElements[4]) featherGain += Math.floor(state.artifacts * 0.1) * rewardMultiplier * count;
    if (typeof state !== 'undefined' && typeof prismState !== 'undefined' && state.grade >= 4) {
      featherGain += (prismState.redlight || 0) * count;
    }
  }
  if (["legendary", "mythic"].includes(type)) {
    const avgArtifact = ((box.artifact[0] + box.artifact[1]) / 2) * rewardMultiplier;
    artifactGain = avgArtifact * count;
    if (boughtElements[6]) artifactGain += Math.floor(swariaKnowledge.kp * 0.1) * rewardMultiplier * count;
    if (typeof state !== 'undefined' && state.grade >= 5) {
      artifactGain *= Math.pow(2, state.grade - 4);
    }
    if (typeof prismState !== 'undefined' && prismState.orangelight) {
      artifactGain *= (1 + prismState.orangelight);
    }
  }
  const boost = getBoxTypeBoost(type);
  swariaGain *= boost;
  featherGain *= boost;
  artifactGain *= boost;
  if (window._chargerCurrencyBoost && window._chargerCurrencyBoost > 1) {
    swariaGain *= window._chargerCurrencyBoost;
    featherGain *= window._chargerCurrencyBoost;
    artifactGain *= window._chargerCurrencyBoost;
  }
  if (!suppressPopup) {
    if (swariaGain > 0) showGainPopup("swariaGain", Math.floor(swariaGain), "Swaria Coins");
    if (featherGain > 0) showGainPopup("featherGain", Math.floor(featherGain), "Feathers");
    if (artifactGain > 0) showGainPopup("artifactGain", Math.floor(artifactGain), "Artifacts");
  }
  if (boughtElements[14]) {
    if (swariaGain > 0) swariaGain = Math.pow(swariaGain, 1.1);
    if (featherGain > 0) featherGain = Math.pow(featherGain, 1.1);
    if (artifactGain > 0) artifactGain = Math.pow(artifactGain, 1.1);
  }
  swariaGain = Math.floor(swariaGain);
  featherGain = Math.floor(featherGain);
  artifactGain = Math.floor(artifactGain);
  swariaGain = applyInfinitySoftcap(swariaGain, 'swaria');
  featherGain = applyInfinitySoftcap(featherGain, 'feathers');
  artifactGain = applyInfinitySoftcap(artifactGain, 'artifacts');
  const maxSwariaGain = Math.max(0, 1e306 - state.swaria);
  const maxFeatherGain = Math.max(0, 1e306 - state.feathers);
  const maxArtifactGain = Math.max(0, 1e306 - state.artifacts);
  swariaGain = Math.min(swariaGain, maxSwariaGain);
  featherGain = Math.min(featherGain, maxFeatherGain);
  artifactGain = Math.min(artifactGain, maxArtifactGain);
  state.swaria += swariaGain;
  state.feathers += featherGain;
  state.artifacts += artifactGain;
  if (typeof window.trackSwariaMilestone === 'function') {
    window.trackSwariaMilestone(state.swaria);
  }
  if (typeof window.trackFeatherMilestone === 'function') {
    window.trackFeatherMilestone(state.feathers);
  }
  if (typeof window.trackArtifactMilestone === 'function') {
    window.trackArtifactMilestone(state.artifacts);
  }
  checkCurrencyInfinity('swaria');
  checkCurrencyInfinity('feathers');
  checkCurrencyInfinity('artifacts');
  if (swariaGain > 0) showGainPopup("swariaGain", swariaGain, "Swaria Coins");
  if (featherGain > 0) showGainPopup("featherGain", featherGain, "Feathers");
  if (artifactGain > 0) showGainPopup("artifactGain", artifactGain, "Artifacts");
  updateUI();
}

const generators = [
  { id: 0, name: "Common Box Generator", currency: "fluff", progress: 0, speed: 5, baseSpeed: 5, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "common", baseCost: 1e6, costMultiplier: 10 },
  { id: 1, name: "Uncommon Box Generator", currency: "swaria coins", progress: 0, speed: 4, baseSpeed: 4, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "uncommon", baseCost: 1e8, costMultiplier: 100 },
  { id: 2, name: "Rare Box Generator", currency: "feathers", progress: 0, speed: 3, baseSpeed: 3, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "rare", baseCost: 1e10, costMultiplier: 1000 },
  { id: 3, name: "Legendary Box Generator", currency: "artifacts", progress: 0, speed: 2, baseSpeed: 2, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "legendary", baseCost: 1e12, costMultiplier: 10000 },
  { id: 4, name: "Mythic Box Generator", currency: "kp", progress: 0, speed: 1, baseSpeed: 1, speedUpgrades: 0, speedMultiplier: 1, unlocked: false, upgrades: 0, reward: "mythic", baseCost: 1e15, costMultiplier: 100000 }
];

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
  powerGeneratorCard.innerHTML = `
    <h3>Power Generator</h3>
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
  if (state.grade >= 5) {
    const chargerBtn = document.createElement('button');
    chargerBtn.textContent = 'Go to Charger';
    chargerBtn.className = 'go-to-charger-btn';
    chargerBtn.style.margin = '1.5em auto 0 auto';
    chargerBtn.style.display = 'block';
    chargerBtn.style.padding = '1em 2em';
    chargerBtn.style.fontSize = '1.2em';
    chargerBtn.style.background = '';
    chargerBtn.style.color = '';
    chargerBtn.style.border = '';
    chargerBtn.style.borderRadius = '';
    chargerBtn.style.cursor = 'pointer';
    chargerBtn.onclick = function() {
      switchHomeSubTab('chargerSubTab');
    };
    leftCol.appendChild(chargerBtn);
  }
  const rightCol = document.createElement("div");
  rightCol.className = "generator-right-col";
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
        canUnlock = swariaKnowledge.kp >= unlockCost;
      } else if (gen.currency === 'swaria coins') {
        canUnlock = state.swaria >= unlockCost;
      } else {
        canUnlock = state[gen.currency] >= unlockCost;
      }
      content += `<button id="buyGen${i}" onclick="unlockGenerator(${i})" ${!canUnlock ? "disabled" : ""}>
        Unlock (${formatNumber(unlockCost)} ${gen.currency})
      </button>`;
    } else {
      const cost = gen.baseCost * Math.pow(gen.costMultiplier, gen.upgrades);
      let canUpgrade = false;
      if (gen.currency === 'kp') {
        canUpgrade = swariaKnowledge.kp >= cost;
      } else if (gen.currency === 'swaria coins') {
        canUpgrade = state.swaria >= cost;
      } else {
        canUpgrade = state[gen.currency] >= cost;
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
      const upgradeLevel = generatorUpgrades[gen.reward] || 0;
      const upgradeCost = getGeneratorUpgradeCost(gen.reward);
      const canAfford = (state.boxesProducedByType[gen.reward] || 0) >= upgradeCost;
      const typeName = gen.reward.charAt(0).toUpperCase() + gen.reward.slice(1);
      content += `<button class="upgrade-btn" id="upgrade${capitalize(gen.reward)}Btn" onclick="buyGeneratorUpgrade('${gen.reward}')" ${!canAfford ? 'disabled' : ''}>
        <img src="assets/icons/gen-${gen.reward}.png" class="icon"> Double ${typeName} box generated
        <br><small>Cost: ${formatNumber(upgradeCost)} ${typeName} Boxes</small>
      </button>`;
    }
    wrapper.innerHTML = content;
    const boxCount = state.boxesProducedByType && state.boxesProducedByType[gen.reward] !== undefined ? state.boxesProducedByType[gen.reward] : 0;
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
  let currentAmount = 0;
  if (gen.currency === 'kp') {
    currentAmount = swariaKnowledge.kp;
  } else if (gen.currency === 'swaria coins') {
    currentAmount = state.swaria;
  } else {
    currentAmount = state[gen.currency];
  }
  if (currentAmount < unlockCost) return;
  if (gen.currency === 'kp') {
    swariaKnowledge.kp -= unlockCost;
  } else if (gen.currency === 'swaria coins') {
    state.swaria -= unlockCost;
  } else {
    state[gen.currency] -= unlockCost;
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
  const cost = gen.baseCost * Math.pow(gen.costMultiplier, gen.upgrades);
  let canUpgrade = false;
  if (gen.currency === 'kp') {
    canUpgrade = swariaKnowledge.kp >= cost;
  } else if (gen.currency === 'swaria coins') {
    canUpgrade = state.swaria >= cost;
  } else {
    canUpgrade = state[gen.currency] >= cost;
  }
  if (!canUpgrade) return;
  if (gen.currency === 'kp') {
    swariaKnowledge.kp -= cost;
  } else if (gen.currency === 'swaria coins') {
    state.swaria -= cost;
  } else {
    state[gen.currency] -= cost;
  }
  gen.speedUpgrades = (gen.speedUpgrades || 0) + 1;
  gen.upgrades++;
  gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades);
  updateUI();
  updateKnowledgeUI();
  renderGenerators();
}

function updateGeneratorsUI() {
  generators.forEach((gen, i) => {
    const buyBtn = document.getElementById("buyGen" + i);
    const upgradeBtn = document.getElementById("upgradeGen" + i);
    if (buyBtn) {
      const buyCost = gen.baseCost;
      if (!gen.unlocked) {
        buyBtn.innerText = `Unlock (${formatNumber(gen.baseCost)} ${gen.currency})`;
        if (gen.currency === 'kp') {
          buyBtn.disabled = swariaKnowledge.kp < buyCost;
        } else if (gen.currency === 'swaria coins') {
          buyBtn.disabled = state.swaria < buyCost;
        } else {
          buyBtn.disabled = state[gen.currency] < buyCost;
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
          const cost = gen.baseCost * Math.pow(gen.costMultiplier, gen.upgrades);
          upgradeBtn.innerText = `Upgrade (${formatNumber(cost)} ${gen.currency})`;
          if (gen.currency === 'kp') {
            upgradeBtn.disabled = swariaKnowledge.kp < cost;
          } else if (gen.currency === 'swaria coins') {
            upgradeBtn.disabled = state.swaria < cost;
          } else {
            upgradeBtn.disabled = state[gen.currency] < cost;
          }
        }
      }
    }
    const tracker = document.getElementById(`boxesProducedCount-${gen.reward}`);
    if (tracker) {
      tracker.textContent = formatNumber(Math.floor(state.boxesProducedByType[gen.reward] || 0));
    }
    if (boughtElements[11]) {
      const boostEl = document.getElementById(`boxBoost-${gen.reward}`);
      if (boostEl) {
        const boxCount = Math.floor(state.boxesProducedByType[gen.reward] || 0);
        const boost = 1 + (boxCount * 0.01);
        let boostDisplay = formatNumber(boost);
        boostEl.textContent = `Current Boost: ×${boostDisplay} reward`;
      }
    }
  });
}

function tickGenerators(diff) {
  if (state.powerStatus !== 'online' || state.powerEnergy <= 0) {
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
  generators.forEach((gen, i) => {
    gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades || 0) * (gen.speedMultiplier || 1);
    if (gen.unlocked) {
      gen.progress += gen.speed * diff;
      let bar = document.getElementById("progress" + i);
      let instantFill = gen.speed * diff >= 100;
      if (gen.progress >= 100) {
        gen.progress = 0;
        const upgradeLevel = generatorUpgrades[gen.reward] || 0;
        const boxCount = Math.pow(2, upgradeLevel);
        const rewardMultiplier = Math.pow(2, upgradeLevel);
        let actualBoxCount = Math.max(1, boxCount);
        if (window._chargerBoxBoost && window._chargerBoxBoost > 1) {
          actualBoxCount = Math.floor(actualBoxCount * window._chargerBoxBoost);
        }
        const actualRewardMultiplier = Math.max(1, rewardMultiplier);
        if (!boxTiers[gen.reward]) {
        }
        const gains = earnBox(gen.reward, actualRewardMultiplier, true, actualBoxCount) || { swariaGain: 0, featherGain: 0, artifactGain: 0 };
        if (gains.swariaGain > 0) showGainPopup("swariaGain", gains.swariaGain, "Swaria Coins");
        if (gains.featherGain > 0) showGainPopup("featherGain", gains.featherGain, "Feathers");
        if (gains.artifactGain > 0) showGainPopup("artifactGain", gains.artifactGain, "Artifacts");
        updateUI(); 
        if (window.spawnIngredientToken) {
          const genTab = document.getElementById('generatorSubTab');
          if (genTab && genTab.style.display !== 'none') {
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
  updateUI(); 
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generatorSubTabBtn");
  if (btn) {
    btn.style.display = boughtElements[7] ? "inline-block" : "none";
  }
  if (typeof window.trackElementDiscovery === 'function') {
    window.trackElementDiscovery(boughtElements);
  }
});

function showGainPopup(id, amount, label) {
  const el = document.getElementById(id);
  if (!el) return;
  let formattedAmount;
  if (typeof amount === 'string') {
    formattedAmount = amount;
  } else {
    formattedAmount = formatNumber(Number(amount));
  }
  el.textContent = `+${formattedAmount} ${label}`;
  el.classList.add("show");
  setTimeout(() => {
    el.classList.remove("show");
  }, 600); 
}

function getAutoLightGainPerSecond() {
  if (!state.quests || state.quests.viAutoLightGenerator !== 'completed') {
    return 0;
  }
  let base = 0.1;
  if (window.prismState && window.prismState.generatorUnlocked) {
    const unlockedCount = Object.values(window.prismState.generatorUnlocked).filter(u => u).length;
    base += unlockedCount * 0.1;
  }
  return base;
}

function switchSettingsSubTab(tabId) {
  document.getElementById('settingsSavesTab').style.display = 'none';
  document.getElementById('settingsStatsTab').style.display = 'none';
  document.getElementById('settingsCreditsTab').style.display = 'none';
  document.getElementById('settingsPremiumTab').style.display = 'none';
  document.getElementById('settingsHardModeTab').style.display = 'none';
  document.getElementById('settingsSavesTabBtn').classList.remove('active');
  document.getElementById('settingsStatsTabBtn').classList.remove('active');
  document.getElementById('settingsCreditsTabBtn').classList.remove('active');
  document.getElementById('settingsPremiumTabBtn').classList.remove('active');
  document.getElementById('settingsHardModeTabBtn').classList.remove('active');
  document.getElementById(tabId).style.display = 'block';
  if (tabId === 'settingsSavesTab') {
    document.getElementById('settingsSavesTabBtn').classList.add('active');
  } else if (tabId === 'settingsStatsTab') {
    document.getElementById('settingsStatsTabBtn').classList.add('active');
  } else if (tabId === 'settingsCreditsTab') {
    document.getElementById('settingsCreditsTabBtn').classList.add('active');
  } else if (tabId === 'settingsPremiumTab') {
    document.getElementById('settingsPremiumTabBtn').classList.add('active');
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
  setTimeout(() => {
    if (typeof window.syncTerrariumVarsFromWindow === 'function') {
      window.syncTerrariumVarsFromWindow();
    }
  }, 500);
});
