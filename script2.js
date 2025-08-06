// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file






















































const swariaImage = document.getElementById("swariaCharacter");
const swariaSpeech = document.getElementById("swariaSpeech");
const swariaQuotes = [
  { text: "Keep fluffing!", condition: () => true },
  { text: "Do NOT go to the bathroom at 3:33 AM!", condition: () => true },
  { text: "Click on a box type then hold down the enter key for Swagic!", condition: () => true },
  { text: "When are we seeing the sights?", condition: () => true },
  { text: "I'm full of feathers today!", condition: () => true },
  { text: "Did you know I go to Swa university©?", condition: () => true },
  { text: "Boxes, boxes, boxes!", condition: () => true },
  { text: "Don't forget to keep swa gaming!", condition: () => true },
  { text: "Knowledge is power!", condition: () => true },
  { text: "Feeling SWULTRA today!", condition: () => true },
  { text: "Fluff it up!", condition: () => true },
  { text: "I love Swagambling!", condition: () => true },
  { text: "Wing artifacts, the swa elites loves those!", condition: () => true },
  { text: "My name is Peachy btw.", condition: () => true },
  { text: "It would be so swawesome~", condition: () => true },
  { text: "Am I really a glorified news ticker?", condition: () => true },
  { text: "I feel like the title of this game is very misleading.", condition: () => true },
  { text: "Real ones beats the game with no autoclicker.", condition: () => true },
  { text: "The swa elites are so boring. But they do reward me with knowledge points.", condition: () => true },
  {
    text: "The swa council© makes us keep count of the amount of time we see the number 727 anywhere.",
    condition: () => true,
  },
  {
    text: "Skibidi toilet is Swactually banned here in the facility!",
    condition: () => true,
  },
  { text: "Huh, prisms? Vi told me to just gather the white light the prism makes while they are researching on discovering new lights.", condition: () => state.grade === 2,},
  { text: "The prism can only create white light at the moment.", condition: () => state.grade === 2,},
  { text: "I wonder how Soap is doing. They rarely come out of the generator room.", condition: () => state.grade >= 2,},
  { text: "The Swaboratory is where I go to experiment with prisms.", condition: () => state.grade >= 2,},
  { text: "I will never run out of boxes!", condition: () => state.grade >= 2,},
  { text: "I smell the scent of soap while standing in front of the generator room.", condition: () => state.grade >= 2,},
  { text: "So.. Why do I need to relearn every Swalements every time we expand? I wish I kept my knowledge points...", condition: () => state.grade >= 2,},
  { text: "I know there's a secret room in the facility's basement, but its Swalways locked... Only the boss can enter it.", condition: () => state.grade >= 2,},
  { text: "I don't really like going to the Swaboratory, its too flashy for me, and colorful.", condition: () => state.grade >= 2,},
  { text: "The boss of this facility is actually really nice, Swaltough I've never met them yet.", condition: () => state.grade >= 2,},
  { text: "There's Swactually someone else working in the prism lab named Vi, They seem shy, but nice.", condition: () => state.grade >= 2,},
  { text: "Is it just me or does it smell like chlorine inside the prism lab?", condition: () => state.grade >= 2,},
  { text: "OMG MY KP IS GONE!!! NOOOOO!!! THE SWA ELITES TOOK THEM SWALL!!!", condition: () => state.grade >= 2,},
  { text: "How come Vi can handle the prism lab? I'm so jealous.", condition: () => state.grade >= 2,},
  { text: "I don't know why but I feel a strange feeling when discovering new Swalements...", condition: () => state.grade >= 3,},
  { text: "Swanother factory expansion, there goes my kp again...", condition: () => state.grade >= 3,},
  { text: "So... The swa elites now wants feathers?", condition: () => state.grade >= 3,},
  { text: "Oh, the prism now creates red light!", condition: () => state.grade === 4,},
  { text: "It's so quiet at night... I can hear the boxes breathing.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "Sometimes I wonder if the boxes dream when it's dark.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "God dammit I need to use my flashlight now!", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "Real ones never sleeps.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "Do you ever get the feeling the boxes Sware watching you at night?", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); }  },
  { text: "Even during the night, the prism lab is still too flashy for my eyes, but its not as bad as day time.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); const isNight = (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); return isNight && state.grade >= 3;} },
];

function showSwariaSpeech() {
  if (!swariaSpeech || !swariaImage) return;
  const availableQuotes = swariaQuotes.filter(q => q.condition());
  const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  swariaSpeech.textContent = randomQuote ? randomQuote.text : "...";
  swariaSpeech.style.display = "block";
  swariaImage.src = getMainCargoCharacterImage(true); 
  setTimeout(() => {
    swariaSpeech.style.display = "none";
    swariaImage.src = getMainCargoCharacterImage(false); 
  }, 10000);
}

function showSwariaPrismSpeech() {
  const img = document.getElementById("swaPrismCharacter");
  const speech = document.getElementById("swaPrismSpeech");
  if (!img || !speech) return;
  const quotePool = swaPrismQuotes.filter(q => q.condition());
  const random = quotePool[Math.floor(Math.random() * quotePool.length)];
  speech.textContent = random.text;
  speech.style.display = "block";
  img.src = getPrismLabCharacterImage(true); 
  setTimeout(() => {
    speech.style.display = "none";
    img.src = getPrismLabCharacterImage(false); 
  }, 10000);
}

function showInventoryDescription(text) {
  let descriptionElement = document.getElementById('inventoryDescription');
  if (!descriptionElement) {
    descriptionElement = document.createElement('span');
    descriptionElement.id = 'inventoryDescription';
    descriptionElement.style.cssText = `
      font-size: 0.9em;
      color: #666;
      font-weight: normal;
      margin-left: 1em;
      font-style: italic;
    `;
    const inventoryTitle = document.querySelector('#inventoryModal div[style*="font-size:1.5em"]');
    if (inventoryTitle) {
      inventoryTitle.appendChild(descriptionElement);
    }
  }
  descriptionElement.textContent = text;
  descriptionElement.style.display = 'inline';
}

function hideInventoryDescription() {
  const descriptionElement = document.getElementById('inventoryDescription');
  if (descriptionElement) {
    descriptionElement.style.display = 'none';
  }
}

setInterval(() => {
  if (Math.random() < 0.5) showSwariaSpeech();
}, 20000);

function updateElementTileVisual(tile, index) {
    if (boughtElements[index]) {
        tile.classList.add("bought");
    } else {
        tile.classList.remove("bought");
    }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

setInterval(() => {
  const now = Date.now();
  if (!window.lastTick) window.lastTick = now;
  const diff = (now - window.lastTick) / 1000;
  window.lastTick = now;
  tickGenerators(diff);
  if (boughtElements[7]) {
    tickPowerGenerator(diff);
  }
  if (window.tickLightGenerators) {
    window.tickLightGenerators(diff);
  }
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
}, 100); 

function testRegalBackground() {
  document.body.classList.add('regal-bg');
  document.documentElement.classList.add('regal-bg');
}

function unlockGraduationForTesting() {
  document.getElementById("graduationSubTabBtn").style.display = "inline-block";
  document.getElementById("knowledgeSubTabNav").style.display = "flex";
  if (state.grade >= 7) {
    const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
    if (infinityResearchBtn) {
      infinityResearchBtn.style.display = "inline-block";
    }
  }
}

window.testRegalBackground = testRegalBackground;
window.unlockGraduationForTesting = unlockGraduationForTesting;

function testElement9() {
  swariaKnowledge.kp = 2000000;
  tryBuyElement(9);
  switchHomeSubTab('generatorSubTab');
}

window.testElement9 = testElement9;

function updateGeneratorUpgradesUI() {
  if (!boughtElements[9]) return;
  const boxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
  boxTypes.forEach(type => {
    const upgradeLevel = generatorUpgrades[type] || 0;
    const cost = getGeneratorUpgradeCost(type);
    const canAfford = (state.boxesProducedByType[type] || 0) >= cost;
    const btn = document.getElementById(`upgrade${capitalize(type)}Btn`);
    if (btn) {
      btn.disabled = !canAfford;
      const typeName = capitalize(type);
      btn.innerHTML = `
        <img src="assets/icons/gen-${type}.png" class="icon"> Double ${typeName} box generated
        <br><small>Cost: ${formatNumber(cost)} ${typeName} Boxes</small>
      `;
    }
    const tracker = document.getElementById(`boxesProducedCount-${type}`);
    if (tracker) {
      tracker.textContent = formatNumber(state.boxesProducedByType[type] || 0);
    }
  });
}

function getGeneratorUpgradeCost(type) {
  const baseCost = 25; 
  const level = generatorUpgrades[type] || 0;
  return Math.floor(baseCost * Math.pow(5, level));
}

function buyGeneratorUpgrade(type) {
  const cost = getGeneratorUpgradeCost(type);
  if (state.boxesProducedByType[type] < cost) return;
  state.boxesProducedByType[type] -= cost;
  generatorUpgrades[type] = (generatorUpgrades[type] || 0) + 1;
  updateUI();
  updateGeneratorUpgradesUI();
}

function calculatePowerGeneratorCap() {
  let baseCap = 100;
  if (state.grade >= 2) {
    baseCap += (state.grade - 1) * 20;
  }
  return baseCap;
}

function tickPowerGenerator(diff) {
  const hasBatteryProtection = window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0;
  if (window.isTabHidden && !hasBatteryProtection) return;
  const newMaxEnergy = calculatePowerGeneratorCap();
  if (state.powerMaxEnergy !== newMaxEnergy) {
    state.powerMaxEnergy = newMaxEnergy;
    if (state.powerEnergy > state.powerMaxEnergy) {
      state.powerEnergy = state.powerMaxEnergy;
    }
  }
  const oldPowerEnergy = state.powerEnergy; 
  if (state.powerStatus === 'online' && state.powerEnergy > 0) {
    if (!hasBatteryProtection) {
      state.powerEnergy = Math.max(0, state.powerEnergy - diff / 5); 
    } else {
    }
    if (state.powerEnergy <= 50 && !state.soapRefillUsed && oldPowerEnergy > 50) {
      state.soapRefillUsed = true; 
      let shouldRefill = false;
      let refillMessage = "";
      if (window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0) {
        shouldRefill = false;
        refillMessage = "Soap's battery boost is protecting the power generator!";
      } else {
        const soapLevel = (window.friendship && window.friendship.Generator && typeof window.friendship.Generator.level === 'number')
          ? window.friendship.Generator.level
          : 0;
        const refillChance = Math.min(0.25 + 0.05 * soapLevel, 0.75);
        shouldRefill = Math.random() < refillChance;
        refillMessage = shouldRefill ? "Soap refilled the power generator!" : "Soap was too interested in his soap collection to refill the power generator";
      }
      if (shouldRefill) {
        state.powerEnergy = state.powerMaxEnergy;
        state.justRefilledBySoap = true; 
        showSoapPowerRefillSpeech(refillMessage, true);
      } else {
        showSoapPowerRefillSpeech(refillMessage, false);
      }
    }
    if (state.powerEnergy > 50) {
      state.soapRefillUsed = false;
    }
    if (state.powerEnergy <= 0) {
      state.powerStatus = 'offline';
      showPowerOfflineMessage();
    }
  }
  updatePowerGeneratorUI();
}

function updatePowerGeneratorUI() {
  const powerBar = document.getElementById('powerEnergyBar');
  const powerStatus = document.getElementById('powerStatus');
  const powerEnergy = document.getElementById('powerEnergy');
  const rechargeBtn = document.getElementById('powerRechargeBtn');
  if (powerBar) {
    const percentage = (state.powerEnergy / state.powerMaxEnergy) * 100;
    powerBar.style.width = `${percentage}%`;
    if (percentage > 60) {
      powerBar.style.background = '#00cc00';
    } else if (percentage > 30) {
      powerBar.style.background = '#ffaa00';
    } else {
      powerBar.style.background = '#ff4444';
    }
  }
  if (powerStatus) {
    powerStatus.textContent = state.powerStatus.toUpperCase();
    powerStatus.className = `power-status ${state.powerStatus}`;
  }
  if (powerEnergy) {
    powerEnergy.textContent = `${Math.floor(state.powerEnergy)}/${state.powerMaxEnergy}`;
  }
  if (rechargeBtn) {
    rechargeBtn.disabled = state.powerStatus === 'recharging';
    if (state.powerStatus === 'recharging') {
      rechargeBtn.textContent = 'Recharging...';
    } else if (state.powerStatus === 'offline') {
      rechargeBtn.textContent = 'Recharge Generator';
    } else {
      rechargeBtn.textContent = 'Recharge Generator';
    }
  }
}

function showPowerOfflineMessage() {
  const message = document.createElement('div');
  message.className = 'power-offline-message';
  message.innerHTML = `
    <div class="power-offline-content">
      <h2>POWER OFFLINE</h2>
      <p>All generators have been shut down due to power failure!</p>
      <p>Complete the recharge minigame to restore power.</p>
    </div>
  `;
  document.body.appendChild(message);
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 5000);
}

function startPowerRechargeMinigame() {
  if (document.querySelector('.power-minigame-overlay')) return;
  updatePowerGeneratorUI();
  const minigameOverlay = document.createElement('div');
  minigameOverlay.className = 'power-minigame-overlay';
  minigameOverlay.innerHTML = `
    <div class="power-minigame">
      <h2>Generator Recharging</h2>
      <p>Click the red energy cells to fully recharge the generator, and avoid clicking the green energy cells!</p>
      <div class="minigame-grid" id="minigameGrid"></div>
      <div class="minigame-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="minigameProgress" style="width: 0%"></div>
        </div>
        <span id="minigameProgressText">0/20 cells charged</span>
      </div>
      <button onclick="closePowerMinigame()" class="cancel-btn">Cancel</button>
    </div>
  `;
  document.body.appendChild(minigameOverlay);
  initPowerMinigame();
}

function initPowerMinigame() {
  const grid = document.getElementById('minigameGrid');
  const progressFill = document.getElementById('minigameProgress');
  const progressText = document.getElementById('minigameProgressText');
  const totalCells = 25; 
  const gridSize = 5;
  let numRed = Math.floor(Math.random() * 11) + 10; 
  if (window._chargerRedTileReduction !== undefined) {
    numRed = Math.max(1, numRed - window._chargerRedTileReduction);
  }
  const redIndices = new Set();
  while (redIndices.size < numRed) {
    redIndices.add(Math.floor(Math.random() * totalCells));
  }
  let redTilesCleared = 0;
  grid.innerHTML = '';
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'minigame-cell';
    cell.dataset.index = i;
    if (redIndices.has(i)) {
      cell.classList.add('red');
    } else {
      cell.classList.add('green');
    }
    cell.addEventListener('click', () => {
      if (cell.classList.contains('red')) {
        cell.classList.remove('red');
        cell.classList.add('green');
        cell.classList.remove('cleared');
        redTilesCleared++;
        const progress = (redTilesCleared / numRed) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${redTilesCleared}/${numRed} red cells cleared`;
        if (redTilesCleared >= numRed) {
          setTimeout(() => {
            completePowerRecharge();
          }, 500);
        }
      } else if (cell.classList.contains('green')) {
        if (typeof window.trackPowerMinigameFailure === 'function') {
          window.trackPowerMinigameFailure();
        }
        showElectrocuteEffectNoMsg();
        setTimeout(() => {
          initPowerMinigame();
        }, 1200);
      }
    });
    grid.appendChild(cell);
  }
  progressFill.style.width = '0%';
  progressText.textContent = `0/${numRed} red cells cleared`;
}

function completePowerRecharge() {
  if (typeof window.trackHardModePowerRefill === 'function') {
    window.trackHardModePowerRefill();
  }
  if (typeof window.resetPowerMinigameFailures === 'function') {
    window.resetPowerMinigameFailures();
  }
  state.powerEnergy = state.powerMaxEnergy;
  state.powerStatus = 'online';
  updatePowerGeneratorUI();
  closePowerMinigame();
  const message = document.createElement('div');
  message.className = 'power-online-message';
  message.innerHTML = `
    <div class="power-online-content">
      <h2>POWER RESTORED</h2>
      <p>Generator fully recharged!</p>
    </div>
  `;
  document.body.appendChild(message);
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 1500);
}

function closePowerMinigame() {
  const overlay = document.querySelector('.power-minigame-overlay');
  if (overlay) {
    overlay.parentNode.removeChild(overlay);
  }
  updatePowerGeneratorUI();
}

function showElectrocuteEffectNoMsg() {
  const overlay = document.querySelector('.power-minigame-overlay');
  if (overlay) {
    overlay.classList.add('shake');
    setTimeout(() => overlay.classList.remove('shake'), 800);
  }
  const tiles = document.querySelectorAll('.minigame-cell');
  tiles.forEach(tile => {
    tile.style.transition = 'background 0.15s';
    tile.style.background = '#ffe066';
  });
  setTimeout(() => {
    tiles.forEach(tile => {
      tile.style.background = '';
      tile.style.transition = '';
    });
  }, 900);
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .power-minigame-overlay.shake {
      animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translateX(-2px); }
      20%, 80% { transform: translateX(4px); }
      30%, 50%, 70% { transform: translateX(-8px); }
      40%, 60% { transform: translateX(8px); }
      100% { transform: none; }
    }
  `;
  document.head.appendChild(style);
}

function renderPowerGenerator() {
  const fixed = document.getElementById("powerGeneratorFixed");
  if (!fixed) return;
  fixed.innerHTML = "";
  const powerGeneratorCard = document.createElement("div");
  powerGeneratorCard.className = "generator power-generator power-generator-fixed";
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
  fixed.appendChild(powerGeneratorCard);
  updatePowerGeneratorUI();
}

window.addEventListener("load", () => {
  renderPowerGenerator();
});

function initializeGeneratorTab() {
  if (boughtElements[7]) {
    const btn = document.getElementById("generatorSubTabBtn");
    if (btn) {
      btn.style.display = "inline-block";
    }
    const subTabNav = document.getElementById("subTabNav");
    if (subTabNav) {
      subTabNav.style.display = "flex";
    }
  }
  if (boughtElements[8]) {
    const btn = document.getElementById("graduationSubTabBtn");
    if (btn) {
      btn.style.display = "inline-block";
    }
    const knowledgeSubTabNav = document.getElementById("knowledgeSubTabNav");
    if (knowledgeSubTabNav) {
      knowledgeSubTabNav.style.display = "flex";
    }
  }
  if (currentHomeSubTab === 'generatorSubTab') {
    renderGenerators();
  }
}

function testGeneratorSystem() {
  swariaKnowledge.kp = 10000000;
  tryBuyElement(7);
  tryBuyElement(8);
  tryBuyElement(9);
  state.fluff = 1e7; 
  state.swaria = 1e9; 
  state.feathers = 1e11; 
  state.artifacts = 1e13; 
  swariaKnowledge.kp = 1e16; 
  switchHomeSubTab('generatorSubTab');
}

window.testGeneratorSystem = testGeneratorSystem;

function updatePowerEnergyStatusUI() {
  const el = document.getElementById('powerEnergyStatus');
  if (!el) return;
  if (boughtElements[7]) {
    el.style.display = 'block';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '0.7em';
    el.innerHTML = `<img src="assets/icons/power generator.png" alt="Power" style="height:2.2em;width:2.2em;display:block;">Power: <span class='energy'>${Math.floor(state.powerEnergy)}/${state.powerMaxEnergy}</span>`;
  } else {
    el.style.display = 'none';
  }
}

const _origUpdatePowerGeneratorUI = updatePowerGeneratorUI;

updatePowerGeneratorUI = function() {
  _origUpdatePowerGeneratorUI.apply(this, arguments);
  updatePowerEnergyStatusUI();
};

const _origTryBuyElement = tryBuyElement;

tryBuyElement = function(index) {
  _origTryBuyElement.apply(this, arguments);
  if (index === 7) updatePowerEnergyStatusUI();
};

window.addEventListener('load', updatePowerEnergyStatusUI);

function updateGeneratorDarknessOverlay() {
  const genTab = document.getElementById('generatorSubTab');
  if (!genTab || genTab.style.display === 'none') return;
  genTab.classList.remove('generator-dim', 'generator-blackout');
  genTab.style.removeProperty('--dim-opacity');
  let blackoutLight = genTab.querySelector('.blackout-cursor-light');
  if (blackoutLight) blackoutLight.remove();
  if (state.powerStatus === 'offline' || state.powerEnergy <= 0) {
    genTab.classList.add('generator-blackout');
    blackoutLight = document.createElement('div');
    blackoutLight.className = 'blackout-cursor-light active';
    genTab.appendChild(blackoutLight);

    function moveLight(e) {
      blackoutLight.style.left = e.clientX + 'px';
      blackoutLight.style.top = e.clientY + 'px';
    }

    window.addEventListener('mousemove', moveLight);
    blackoutLight._removeListener = () => window.removeEventListener('mousemove', moveLight);
    blackoutLight.style.left = (window.innerWidth/2) + 'px';
    blackoutLight.style.top = (window.innerHeight/2) + 'px';
  } else if (state.powerEnergy < 20) {
    genTab.classList.add('generator-dim');
    const opacity = 0.85 * (1 - state.powerEnergy / 20);
    genTab.style.setProperty('--dim-opacity', opacity.toFixed(2));
  }
}
const _origUpdatePowerGeneratorUI2 = updatePowerGeneratorUI;

updatePowerGeneratorUI = function() {
  _origUpdatePowerGeneratorUI2.apply(this, arguments);
  updatePowerEnergyStatusUI();
  updateGeneratorDarknessOverlay();
};

function clearGeneratorDarknessOverlay() {
  const genTab = document.getElementById('generatorSubTab');
  if (!genTab) return;
  genTab.classList.remove('generator-dim', 'generator-blackout');
  genTab.style.removeProperty('--dim-opacity');
  const blackoutLight = genTab.querySelector('.blackout-cursor-light');
  if (blackoutLight) {
    if (blackoutLight._removeListener) blackoutLight._removeListener();
    blackoutLight.remove();
  }
}

const _origSwitchHomeSubTab = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {
  _origSwitchHomeSubTab.apply(this, arguments);
  if (subTabId !== 'generatorSubTab') {
    clearGeneratorDarknessOverlay();
  } else {
    updateGeneratorDarknessOverlay();
  }
};

function updateGlobalBlackoutOverlay() {
  const blackout = document.getElementById('blackoutOverlay');
  if (!blackout) return;
  if (window._blackoutMoveListener) {
    window.removeEventListener('mousemove', window._blackoutMoveListener);
    window._blackoutMoveListener = null;
  }
  if (state.powerStatus === 'offline' || state.powerEnergy <= 0) {
    blackout.classList.add('active');
    blackout.style.pointerEvents = 'none'; 
    let lastX = window._blackoutLastX || window.innerWidth/2;
    let lastY = window._blackoutLastY || window.innerHeight/2;

    function setMask(x, y) {
      const mask = `radial-gradient(circle 160px at ${x}px ${y}px, transparent 0%, transparent 140px, black 160px, black 100vw)`;
      blackout.style.webkitMaskImage = mask;
      blackout.style.maskImage = mask;
      window._blackoutLastX = x;
      window._blackoutLastY = y;
    }

    function moveLight(e) {
      setMask(e.clientX, e.clientY);
    }

    window.addEventListener('mousemove', moveLight);
    window._blackoutMoveListener = moveLight;
    setMask(lastX, lastY);
  } else {
    blackout.classList.remove('active');
    blackout.style.webkitMaskImage = '';
    blackout.style.maskImage = '';
    blackout.style.pointerEvents = '';
    window._blackoutLastX = null;
    window._blackoutLastY = null;
  }
}
const _origUpdatePowerGeneratorUI3 = updatePowerGeneratorUI;

updatePowerGeneratorUI = function() {
  _origUpdatePowerGeneratorUI3.apply(this, arguments);
  updatePowerEnergyStatusUI();
  updateGeneratorDarknessOverlay();
  updateGlobalBlackoutOverlay();
};

const _origSwitchHomeSubTab2 = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {
  _origSwitchHomeSubTab2.apply(this, arguments);
  if (subTabId !== 'generatorSubTab') {
    clearGeneratorDarknessOverlay();
  } else {
    updateGeneratorDarknessOverlay();
  }
  updateGlobalBlackoutOverlay();
};

window.addEventListener('load', updateGlobalBlackoutOverlay);

function updateGlobalDimOverlay() {
  const dim = document.getElementById('dimOverlay');
  if (!dim) return;
  if (state.powerStatus === 'offline' || state.powerEnergy <= 0) {
    dim.classList.remove('active');
    dim.style.setProperty('--dim-opacity', '0');
    return;
  }
  if (state.powerEnergy < 20) {
    dim.classList.add('active');
    const opacity = 0.85 * (1 - state.powerEnergy / 20);
    dim.style.setProperty('--dim-opacity', opacity.toFixed(2));
  } else {
    dim.classList.remove('active');
    dim.style.setProperty('--dim-opacity', '0');
  }
}

const _origUpdatePowerGeneratorUI4 = updatePowerGeneratorUI;

updatePowerGeneratorUI = function() {
  _origUpdatePowerGeneratorUI4.apply(this, arguments);
  updatePowerEnergyStatusUI();
  updateGlobalBlackoutOverlay();
  updateGlobalDimOverlay();
};

const _origSwitchHomeSubTab3 = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {
  _origSwitchHomeSubTab3.apply(this, arguments);
  updateGlobalBlackoutOverlay();
  updateGlobalDimOverlay();
};

window.addEventListener('load', () => {
  updateGlobalBlackoutOverlay();
  updateGlobalDimOverlay();
});
const soapQuotes = [
  { text: "Stay bubbly!", condition: () => true },
  { text: "My name is Soap btw.", condition: () => true },
  { text: "Clean energy, clean conscience.", condition: () => true },
  { text: "Welcome back to the generator room Peachy.", condition: () => true },
  { text: "My job is to keep the generators running. But I like looking at my soap collections more.", condition: () => true },
  { text: "Soap never rests!", condition: () => true },
  { text: "I should stop forgetting about keeping the generators running.", condition: () => true },
  { text: "I Keep it squeaky clean in here!", condition: () => true },
  { text: "We should throw a foam party in this room some day.", condition: () => true },
  { text: "I'm not supposed to let you in here, but you're not that bad when you're not poking me.", condition: () => true },
  { text: "Keep those generators running!", condition: () => true },
  { text: "Its a good day to be soapy!", condition: () => true },
  { text: "Everyone says I smell like soap, I wonder why?", condition: () => true },
  { text: "I find it funny that this room powers the whole facility.", condition: () => true },
  { text: "I'm sure everyone freaks out when I intentionaly let the power run out.", condition: () => true },
  { text: "Peachy, you're opening all my generated boxes too quickly, I must upgrade the generators so we never run out of boxes.", condition: () => true },
  { text: "I wonder why the boss doesn't like me.", condition: () => true }, 
  { text: "I'm sure the boss is jealous of my soap collections.", condition: () => true },
  { text: "Are you jealous of my soap collections?", condition: () => true },
  { text: "Don't tell anyone I feed the generators with soap.", condition: () => true },
  { text: "I should probably stop letting the power run out... nahh I'm sure it's fine.", condition: () => true },
  { text: "So... why is the power running out so quickly?", condition: () => true },
  { text: "Generators will not work when the power is offline.", condition: () => true },
  { text: "Hello there Peachy!", condition: () => true },
  { text: "Have you met Vi yet? They are working in the prism lab.", condition: () => state.grade >= 2,},
  { text: "So are my doors permanently jammed now?", condition: () => state.grade >= 2,},
  { text: "Vi's the one who actually introduced me to this job.", condition: () => state.grade >= 2,},
  { text: "I wonder how Vi is doing, I'll go talk to them on our break time.", condition: () => state.grade >= 2,},
  { text: "It smells like chlorine inside the prism lab? Oh that's just Vi ahah.", condition: () => state.grade >= 2,},
  { text: "Vi told me you act very drunk while inside the prism lab.", condition: () => state.grade >= 2,},
  { text: "Each expansions, We're getting more and more materials from the Swa elites, I'm thinking of creating some sort of charger, but I'll need more ressources to do that.", condition: () => state.grade === 3,},
  { text: "The charger's progress is going great, but its not ready to use yet.", condition: () => state.grade === 4,},
  { text: "Thanks to the facilities fifth expansion, I received the ressources to build a charger, and it's finally working!", condition: () => state.grade === 5,},
];
const soapClickQuotes = [
  "Hey! Don't poke me while I'm working!",
  "What do you want? I'm busy admiring my soaps!",
  "Stop poking me, I'm trying to concentrate!",
  "Do you need something? I'm in the middle of something important! Which is organizing my soap collections!!!",
  "Hey! I'm not a poking thing, you know!",
  "What's so urgent that you need to interrupt me?",
  "I'm right here, you don't need to keep poking me!",
  "Is there something wrong with the generators?",
  "You're being very persistent today...",
  "Fine, fine, what do you want to know?",
  "Omg stop poking me!",
  "Are you testing my patience? Because it's working!",
  "Okay, you have my attention. What is it?",
  "I'll throw a soap bar at you if you don't stop poking me!",
  "You're really determined to get my attention, aren't you?",
  "Alright, you win. What's on your mind?",
  "I'm beginning to think you have nothing better to do...",
  "You're really determined to get my attention, aren't you?",
  "Alright, you win. What's on your mind?",
  "I'm beginning to think you have nothing better to do...",
  "You know I have work to do, right?",
  "Keep poking me and I'll do something drastic!",
  "Are you trying to drive me crazy? Because it's working!",
];
window.soapIsTalking = false;
window.soapClickCount = 0;
window.soapLastClickTime = 0;
window.soapClickResetTimer = null;
window.soapIsMad = false;

function showSoapSpeech() {
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  const soapSpeech = document.getElementById("swariaGeneratorSpeech");
  if (!soapImg || !soapSpeech) return;
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const mins = window.daynight.getTime();
    if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
      return; 
    }
  }
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
  if (window.soapCurrentSpeechTimeout) {
    clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = null;
  }
  window.soapIsTalking = true;
  const availableQuotes = soapQuotes.filter(q => q.condition());
  const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  soapSpeech.textContent = randomQuote ? randomQuote.text : "...";
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    window.soapIsTalking = false;
    window.soapCurrentSpeechTimeout = null;
    startSoapRandomSpeechTimer();
  }, 10000);
}

function showSoapFirstTimeMessage() {
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  const soapSpeech = document.getElementById("swariaGeneratorSpeech");
  if (!soapImg || !soapSpeech) return;
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
  if (window.soapCurrentSpeechTimeout) {
    clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = null;
  }
  window.soapIsTalking = true;
  soapSpeech.textContent = "Huh? Who are you? How did you open the door??? You're not supposed to be here... Actually, I'll let you stay";
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    window.soapIsTalking = false;
    window.soapCurrentSpeechTimeout = null;
    startSoapRandomSpeechTimer();
  }, 15000); 
}

function showSoapClickMessage() {
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  const soapSpeech = document.getElementById("swariaGeneratorSpeech");
  if (!soapImg || !soapSpeech) return;
  if (window.soapIsMad) {
    return;
  }
  if (typeof window.trackHardModeSoapPoke === 'function') {
    window.trackHardModeSoapPoke();
  }
  const now = Date.now();
  if (now - window.soapLastClickTime < 2000) { 
    window.soapClickCount++;
  } else {
    window.soapClickCount = 1; 
  }
  window.soapLastClickTime = now;
  if (window.soapClickResetTimer) {
    clearTimeout(window.soapClickResetTimer);
  }
  window.soapClickResetTimer = setTimeout(() => {
    window.soapClickCount = 0;
  }, 3000);
  if (window.soapClickCount >= 50) {
    soapGetsMad();
    return;
  }
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
  if (window.soapCurrentSpeechTimeout) {
    clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = null;
  }
  window.soapIsTalking = true;
  const randomQuote = soapClickQuotes[Math.floor(Math.random() * soapClickQuotes.length)];
  soapSpeech.textContent = randomQuote;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    window.soapIsTalking = false;
    window.soapCurrentSpeechTimeout = null;
    startSoapRandomSpeechTimer();
  }, 8000);
}

let soapRandomSpeechTimer = null;

function startSoapRandomSpeechTimer() {
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
  }
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const mins = window.daynight.getTime();
    if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
      return; 
    }
  }
  const randomDelay = Math.random() * 15000 + 15000; 
  soapRandomSpeechTimer = setTimeout(() => {
    const genTab = document.getElementById("generatorSubTab");
    if (genTab && genTab.style.display !== "none") {
      if (window.daynight && typeof window.daynight.getTime === 'function') {
        const mins = window.daynight.getTime();
        if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
          startSoapRandomSpeechTimer();
          return;
        }
      }
      showSoapSpeech();
    }
    startSoapRandomSpeechTimer();
  }, randomDelay);
}

function stopSoapRandomSpeechTimer() {
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
}

function showSoapPowerRefillSpeech(message, success) {
  const powerCounter = document.getElementById('powerEnergyStatus');
  if (!powerCounter) return;
  let bubble = document.getElementById('soap-power-refill-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.id = 'soap-power-refill-bubble';
    bubble.style.position = 'absolute';
    bubble.style.left = '50%';
    bubble.style.top = '100%';
    bubble.style.transform = 'translateX(-50%)';
    bubble.style.marginTop = '10px';
    bubble.style.textAlign = 'center';
    bubble.style.fontWeight = 'bold';
    bubble.style.fontSize = '1.1em';
    bubble.style.borderRadius = '14px';
    bubble.style.padding = '0.7em 1.2em';
    bubble.style.maxWidth = '320px';
    bubble.style.boxShadow = '0 2px 8px rgba(44,19,84,0.10)';
    bubble.style.transition = 'opacity 0.3s';
    bubble.style.opacity = '0';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '10001';
    powerCounter.style.position = 'relative'; 
    powerCounter.appendChild(bubble);
  }
  bubble.textContent = message;
  bubble.style.background = success ? '#e8ffe8' : '#f7f7f7';
  bubble.style.color = success ? '#228822' : '#444';
  bubble.style.border = success ? '2px solid #66cc66' : '2px solid #bbb';
  bubble.style.opacity = '1';
  if (bubble._hideTimeout) clearTimeout(bubble._hideTimeout);
  bubble._hideTimeout = setTimeout(() => {
    bubble.style.opacity = '0';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  startSoapRandomSpeechTimer();
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
  }, 1000);
});
const _origSwitchHomeSubTabForSoap = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {
  _origSwitchHomeSubTabForSoap.apply(this, arguments);
  if (subTabId === 'generatorSubTab') {
    setTimeout(() => {
      startSoapRandomSpeechTimer();
    }, 1000); 
  } else {
    stopSoapRandomSpeechTimer();
  }
};

function applyKpSoftcap(kp) {
  const softcapStart = 1e20;
  const mildcapStart = 1e40;
  if (kp <= softcapStart) return kp;
  let softcapped = softcapStart * Math.pow(kp / softcapStart, 0.4);
  if (softcapped <= mildcapStart) return softcapped;
  return mildcapStart * Math.pow(softcapped / mildcapStart, 0.2);
}

function getCombinedInfinityCount() {
  return (state.fluffInfinityCount || 0) + 
         (state.swariaInfinityCount || 0) + 
         (state.feathersInfinityCount || 0) + 
         (state.artifactsInfinityCount || 0);
}

function getBoxGeneratorBoost() {
  if (!boughtElements[12]) return 1;
  let count = 0;
  if (typeof generators !== 'undefined') {
    count = generators.filter(g => g.unlocked).length;
  }
  return 1 + count * 0.1; 
}

function getBoxTypeBoost(type) {
  if (!boughtElements[11]) return 1;
  return 1 + (state.boxesProducedByType[type] || 0) * 0.01;
}

window.generators = generators;
setInterval(() => {
  if (settings.autosave && typeof saveGame === "function") saveGame();
}, 20000); 
window.addEventListener("beforeunload", () => {
  if (typeof saveGame === "function") saveGame();
});

function saveSettings() {
  localStorage.setItem("swariaSettings", JSON.stringify(settings));
  window.settings = settings;
}

const savedSettings = localStorage.getItem("swariaSettings");
if (savedSettings) {
  Object.assign(settings, JSON.parse(savedSettings));
  if (typeof settings.autosave === 'undefined') settings.autosave = true;
  if (typeof settings.confirmNectarizeReset === 'undefined') settings.confirmNectarizeReset = true;
}
window.settings = settings;
applySettings();

function getKpGainPreview() {
  const ps = (typeof window.prismState !== 'undefined' && window.prismState) ? window.prismState : {light:0};
  let baseResource;
  if (boughtElements[30]) {
    baseResource = state.fluff;
  } else if (boughtElements[20]) {
    baseResource = state.swaria;
  } else if (boughtElements[10]) {
    baseResource = state.feathers;
  } else {
    baseResource = state.artifacts;
  }
  let preview = Math.floor(Math.sqrt(baseResource * 10) * (1 + (ps.light || 0) * 0.01));
  if (swariaKnowledge.kp === 0) preview = 10;
  let kpMultiplier = 1 + (ps.light || 0) * 0.01;
  preview *= kpMultiplier;
  preview = applyKpSoftcap(preview);
  if (typeof getCombinedInfinityCount === 'function') {
    const combinedInfinity = getCombinedInfinityCount();
    if (combinedInfinity > 0) {
      preview *= Math.pow(1e8, combinedInfinity);
    }
  }
  if (typeof window.getKpNectarUpgradeEffect === 'function' && typeof window.terrariumKpNectarUpgradeLevel === 'number') {
    const nectarEffect = window.getKpNectarUpgradeEffect(window.terrariumKpNectarUpgradeLevel);
    preview = Math.floor(preview * nectarEffect);
  }
  return preview;
}

document.addEventListener('DOMContentLoaded', function() {
  const openBtn = document.getElementById('openSaveSlotModalBtn');
  if (openBtn) {
    openBtn.onclick = function() {
      const modal = document.getElementById('saveSlotModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };
  }
  const closeBtn = document.getElementById('closeSaveSlotModalBtn');
  if (closeBtn) {
    closeBtn.onclick = function() {
      const modal = document.getElementById('saveSlotModal');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    };
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const openBtn = document.getElementById('openSaveSlotModalBtn');
  const closeBtn = document.getElementById('closeSaveSlotModalBtn');
  const modal = document.getElementById('saveSlotModal');
  if (openBtn) {
    openBtn.onclick = function() {
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSaveSlotModal();
      }
    };
  }
  if (closeBtn) {
    closeBtn.onclick = function() {
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    };
  }
  if (modal) {
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    };
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

function updateSaveSlotModal() {
  const modalCard = document.getElementById('saveSlotModalCard');
  if (!modalCard) return;
  const closeBtn = modalCard.querySelector('#closeSaveSlotModalBtn');
  modalCard.innerHTML = '';
  if (closeBtn) modalCard.appendChild(closeBtn);
  for (let i = 1; i <= 5; i++) {
    const slotData = localStorage.getItem(`swariaSaveSlot${i}`);
    const slotDiv = document.createElement('div');
    slotDiv.className = 'save-slot-card';
    slotDiv.id = `saveSlot${i}`;
    const slotLabel = document.createElement('div');
    slotLabel.className = 'slot-label';
    slotLabel.textContent = `File Slot ${i}`;
    const slotContent = document.createElement('div');
    slotContent.className = 'save-slot-content';
    if (slotData) {
      try {
        const data = JSON.parse(slotData);
        const summary = document.createElement('div');
        summary.className = 'save-slot-summary';
        summary.innerHTML = `
          <div>Expansion: ${data.state?.grade || 1}</div>
          <div>KP: ${formatNumber(data.swariaKnowledge?.kp || 0)}</div>
        `;
        slotContent.appendChild(summary);
        const buttonRow = document.createElement('div');
        buttonRow.className = 'save-slot-buttons';
        const loadBtn = document.createElement('button');
        loadBtn.textContent = 'Select';
        loadBtn.onclick = () => loadFromSlot(i);
        buttonRow.appendChild(loadBtn);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'save-slot-delete';
        deleteBtn.onclick = () => deleteSlot(i);
        buttonRow.appendChild(deleteBtn);
        slotContent.appendChild(buttonRow);
      } catch (e) {
        slotContent.innerHTML = '<div style="color: #ff4444;">Corrupted Save</div>';
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'save-slot-delete';
        deleteBtn.onclick = () => deleteSlot(i);
        slotContent.appendChild(deleteBtn);
      }
    } else {
      const emptyText = document.createElement('div');
      emptyText.style.color = '#666';
      emptyText.style.fontStyle = 'italic';
      emptyText.textContent = 'Empty Slot';
      slotContent.appendChild(emptyText);
      const createBtn = document.createElement('button');
      createBtn.textContent = 'Create Slot';
      createBtn.style.marginTop = '0.7em';
      createBtn.onclick = () => {
        const emptySave = {
          state: {
            fluff: 0,
            swaria: 0,
            feathers: 0,
            artifacts: 0,
            hasUnlockedSwariaKnowledge: true,
            grade: 1,
            boxesProduced: 0,
            fluffInfinityCount: 0,
            swariaInfinityCount: 0,
            feathersInfinityCount: 0,
            artifactsInfinityCount: 0,
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
            quests: {
                viAutoLightGenerator: 'not_started',
                viAutoLightGeneratorProgress: 0,
                viAutoRedLightGenerator: 'not_started',
                viAutoRedLightGeneratorProgress: 0,
                viAutoRedLightGeneratorChargedProgress: 0
            },
            seenFirstDeliveryStory: false,
            seenGeneratorUnlockStory: false,
            seenKpSoftcapStory: false,
            seenKpMildcapStory: false,
            seenNectarizeResetStory: false,
            seenInfinityFluffStory: false
          },
          settings: {
            theme: "light",
            colour: "green",
            style: "rounded",
            confirmReset: true
          },
          swariaKnowledge: { kp: 0 },
          boughtElements: {},
          generatorUpgrades: {
            common: 0,
            uncommon: 0,
            rare: 0,
            legendary: 0,
            mythic: 0
          },
          chargerState: {
            charge: 0,
            milestones: [
              { unlocked: false }, 
              { unlocked: false }, 
              { unlocked: false }, 
              { unlocked: false }, 
              { unlocked: false }, 
              { unlocked: false }, 
              { unlocked: false }  
            ],
            milestoneQuests: {
              3: { required: 10, given: 0, completed: false },
              4: { required: 15, given: 0, completed: false },
              5: { required: 25, given: 0, completed: false },
              6: { required: 50, given: 0, completed: false },
              7: { required: 30, given: 0, completed: false, batteryRequired: 1 },
              8: { required: 75, given: 0, completed: false, batteryRequired: 2 }
            },
            questStage: 0
          },
          soapChargeQuest: {
            stage: 0,
            initialized: true
          },
          hardModeQuestActive: false,
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
          },
          prismState: {
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
            generatorUpgrades: {
              light: 0,
              redlight: 0,
              orangelight: 0,
              yellowlight: 0,
              greenlight: 0,
              bluelight: 0
            },
            generatorUnlocked: {
              light: false,
              redlight: false,
              orangelight: false,
              yellowlight: false,
              greenlight: false,
              bluelight: false
            }
          },
          generatorsUnlocked: [false, false, false, false, false],
          generatorSpeedUpgrades: {
            common: 0,
            uncommon: 0,
            rare: 0,
            legendary: 0,
            mythic: 0
          },
          generatorSpeedMultipliers: {
            common: 1,
            uncommon: 1,
            rare: 1,
            legendary: 1,
            mythic: 1
          },
          generatorUpgradeLevels: {
            common: 0,
            uncommon: 0,
            rare: 0,
            legendary: 0,
            mythic: 0
          },
          nectarizeQuestActive: false,
          nectarizeQuestProgress: 0,
          nectarizeQuestGivenBattery: 0,
          nectarizeQuestGivenSparks: 0,
          nectarizeQuestGivenPetals: 0,
          nectarizeMachineRepaired: false, 
          nectarizeMachineLevel: 1,
          terrariumNectar: 0,
          nectarizeMilestones: [
            { tier: 1, unlocked: false, reward: 'pollen' },
            { tier: 2, unlocked: false, reward: 'flowers' },
            { tier: 3, unlocked: false, reward: 'pollen' },
            { tier: 4, unlocked: false, reward: 'flowers' },
            { tier: 5, unlocked: false, reward: 'pollen' },
            { tier: 6, unlocked: false, reward: 'flowers' },
            { tier: 7, unlocked: false, reward: 'pollen' },
            { tier: 8, unlocked: false, reward: 'flowers' }
          ],
          nectarizeMilestoneLevel: 0,
          nectarizeResets: 0,
          nectarizeResetBonus: 0,
          nectarizeTier: 0, 
          terrariumPollen: 0,
          terrariumFlowers: 0,
          terrariumXP: 0,
          terrariumLevel: 1,
          terrariumPollenValueUpgradeLevel: 0,
          terrariumPollenValueUpgrade2Level: 0,
          terrariumFlowerValueUpgradeLevel: 0,
          terrariumPollenToolSpeedUpgradeLevel: 0,
          terrariumFlowerXPUpgradeLevel: 0,
          terrariumExtraChargeUpgradeLevel: 0,
          terrariumXpMultiplierUpgradeLevel: 0,
          terrariumFlowerUpgrade4Level: 0,
          timestamp: Date.now()
        };
        localStorage.setItem(`swariaSaveSlot${i}`, JSON.stringify(emptySave));
        localStorage.setItem('swariaGameMinutes', 12 * 60); 
        if (typeof window.resetAchievementsForNewSlot === 'function') {
          window.resetAchievementsForNewSlot(i);
        }
        const currentSaveSlot = localStorage.getItem('currentSaveSlot');
        if (currentSaveSlot && currentSaveSlot !== i.toString() && typeof window.reloadAchievementsForSlot === 'function') {
          window.reloadAchievementsForSlot();
        }
        updateSaveSlotModal();
      };
      slotContent.appendChild(createBtn);
    }
    slotDiv.appendChild(slotLabel);
    if (slotDiv.classList.contains('active')) {
      const selectedText = document.createElement('div');
      selectedText.textContent = 'Selected';
      selectedText.style.color = '#3cf';
      selectedText.style.fontWeight = 'bold';
      selectedText.style.textAlign = 'center';
      selectedText.style.marginBottom = '0.5em';
      slotDiv.appendChild(selectedText);
    }
    slotDiv.appendChild(slotContent);
    modalCard.appendChild(slotDiv);
  }
  const slots = modalCard.querySelectorAll('.save-slot-card');
  slots.forEach(slot => {
    slot.onclick = function(e) {
      if (e.target.tagName === 'BUTTON') return; 
      slots.forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    };
  });
}

function saveToSlot(slotNumber) {
    const stateCopy = { ...state };
    delete stateCopy.hardModeQuestProgress;
    delete stateCopy.hardModeQuestActive;
    delete stateCopy.soapChargeQuest;
    if (typeof window.saveAchievements === 'function') {
      window.saveAchievements();
    }
  const saveData = {
    state: stateCopy,
    settings,
    swariaKnowledge,
    boughtElements,
    generatorUpgrades,
    prismState: window.prismState || {},
    generatorsUnlocked: generators.map(g => g.unlocked || false),
    generatorSpeedUpgrades: generators.reduce((acc, gen) => {
      acc[gen.reward] = gen.speedUpgrades || 0;
      return acc;
    }, {}),
    generatorSpeedMultipliers: generators.reduce((acc, gen) => {
      acc[gen.reward] = gen.speedMultiplier || 1;
      return acc;
    }, {}),
    generatorUpgradeLevels: generators.reduce((acc, gen) => {
      acc[gen.reward] = gen.upgrades || 0;
      return acc;
    }, {}),
    chargerCharge: (window.charger && typeof window.charger.charge !== 'undefined') ? window.charger.charge : 0,
    chargerMilestones: window.charger ? window.charger.milestones.map(ms => ({ unlocked: ms.unlocked })) : [],
    chargerMilestoneQuests: window.charger ? window.charger.milestoneQuests : null,
    soapChargeQuestStage: window.state && window.state.soapChargeQuest ? window.state.soapChargeQuest.stage : 0,
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
    batteryTokens: (typeof state !== 'undefined' && state.batteryTokens) ? state.batteryTokens : 0,
    nectarizeQuestGivenPetals: window.nectarizeQuestGivenPetals || 0,
    nectarizeMilestones: window.nectarizeMilestones || [],
    nectarizeMilestoneLevel: window.nectarizeMilestoneLevel || 0,
    nectarizeResets: window.nectarizeResets || 0,
    nectarizeResetBonus: window.nectarizeResetBonus || 0,
    nectarizeTier: window.nectarizeTier || 0,
    timestamp: Date.now(),
    berryCookingState: localStorage.getItem('berryCookingState') || null,
    friendship: window.friendship || {},
    kitchenIngredients: window.kitchenIngredients || {},
    berryPlate: (window.state && typeof window.state.berryPlate === 'number') ? window.state.berryPlate : 0,
    mushroomSoup: (window.state && typeof window.state.mushroomSoup === 'number') ? window.state.mushroomSoup : 0,
    batteries: (window.state && typeof window.state.batteries === 'number') ? window.state.batteries : 0,
    glitteringPetals: (window.state && typeof window.state.glitteringPetals === 'number') ? window.state.glitteringPetals : 0,
    chargedPrisma: (window.state && typeof window.state.chargedPrisma === 'number') ? window.state.chargedPrisma : 0,
    swabucks: (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0,
    mysticCookingSpeedBoost: (window.state && typeof window.state.mysticCookingSpeedBoost === 'number') ? window.state.mysticCookingSpeedBoost : 0,
    soapBatteryBoost: (window.state && typeof window.state.soapBatteryBoost === 'number') ? window.state.soapBatteryBoost : 0,
    fluzzerGlitteringPetalsBoost: (window.state && typeof window.state.fluzzerGlitteringPetalsBoost === 'number') ? window.state.fluzzerGlitteringPetalsBoost : 0,
    peachyHungerBoost: (window.state && typeof window.state.peachyHungerBoost === 'number') ? window.state.peachyHungerBoost : 0,
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
    chargerState: {
      charge: window.charger ? window.charger.charge : 0,
      milestones: window.charger ? window.charger.milestones.map(ms => ({ unlocked: ms.unlocked })) : [],
      milestoneQuests: window.charger ? window.charger.milestoneQuests : null,
      questStage: window.state && window.state.soapChargeQuest ? window.state.soapChargeQuest.stage : 0
    },
    nectarizePostResetTokenRequirement: window.nectarizePostResetTokenRequirement || 0,
    nectarizePostResetTokensGiven: window.nectarizePostResetTokensGiven || 0,
    nectarizePostResetTokenType: window.nectarizePostResetTokenType || 'petals',
    intercomState: {
      intercomEventTriggered: (window.intercomEventTriggered !== undefined) ? window.intercomEventTriggered : false,
      intercomEvent20Triggered: (window.intercomEvent20Triggered !== undefined) ? window.intercomEvent20Triggered : false
    }
  };
  localStorage.setItem(`swariaSaveSlot${slotNumber}`, JSON.stringify(saveData));
  updateSaveSlotModal();
  if (typeof window.saveChargerState === 'function') {
    window.saveChargerState();
  }
  const slot = document.getElementById(`saveSlot${slotNumber}`);
  if (slot) {
    slot.style.background = 'rgba(0,255,0,0.1)';
    setTimeout(() => {
      slot.style.background = '';
    }, 1000);
  }
}

function loadFromSlot(slotNumber) {
  const slotData = localStorage.getItem(`swariaSaveSlot${slotNumber}`);
  if (!slotData) return;
  try {
    currentSaveSlot = slotNumber; 
    localStorage.setItem('currentSaveSlot', slotNumber); 
    const data = JSON.parse(slotData);
    var save = data; 
    if (data.state) {
      Object.assign(state, data.state);
      if (!state.fluffInfinityCount) state.fluffInfinityCount = 0;
      if (!state.swariaInfinityCount) state.swariaInfinityCount = 0;
      if (!state.feathersInfinityCount) state.feathersInfinityCount = 0;
      if (!state.artifactsInfinityCount) state.artifactsInfinityCount = 0;
      if (!state.fluffRateInfinityCount) state.fluffRateInfinityCount = 0;
      if (!state.quests) {
        state.quests = {};
      }
      if (typeof state.quests.viAutoLightGenerator === 'undefined') {
        if (state.grade >= 5) {
          state.quests.viAutoLightGenerator = 'started';
        } else {
          state.quests.viAutoLightGenerator = 'not_started';
        }
      }
      if (typeof state.swabucks === 'undefined') {
        state.swabucks = 0;
      }
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
    if (typeof data.terrariumNectar !== 'undefined') window.terrariumNectar = data.terrariumNectar;
    window.terrariumKpNectarUpgradeLevel = (typeof data.terrariumKpNectarUpgradeLevel !== 'undefined') ? data.terrariumKpNectarUpgradeLevel : 0;
    window.terrariumPollenFlowerNectarUpgradeLevel = (typeof data.terrariumPollenFlowerNectarUpgradeLevel !== 'undefined') ? data.terrariumPollenFlowerNectarUpgradeLevel : 0;
    window.terrariumNectarXpUpgradeLevel = (typeof data.terrariumNectarXpUpgradeLevel !== 'undefined') ? data.terrariumNectarXpUpgradeLevel : 0;
    window.terrariumNectarValueUpgradeLevel = (typeof data.terrariumNectarValueUpgradeLevel !== 'undefined') ? data.terrariumNectarValueUpgradeLevel : 0;
    if (typeof data.nectarUpgradeLevel !== 'undefined') window.nectarUpgradeLevel = data.nectarUpgradeLevel;
    if (typeof data.nectarUpgradeCost !== 'undefined') window.nectarUpgradeCost = data.nectarUpgradeCost;
if (typeof data.nectarizeMachineRepaired !== 'undefined') window.nectarizeMachineRepaired = data.nectarizeMachineRepaired;
if (typeof data.nectarizeMachineLevel !== 'undefined') window.nectarizeMachineLevel = data.nectarizeMachineLevel;
if (typeof data.nectarizeQuestActive !== 'undefined') window.nectarizeQuestActive = data.nectarizeQuestActive;
if (typeof data.nectarizeQuestProgress !== 'undefined') window.nectarizeQuestProgress = data.nectarizeQuestProgress;
if (typeof data.nectarizeQuestPermanentlyCompleted !== 'undefined') window.nectarizeQuestPermanentlyCompleted = data.nectarizeQuestPermanentlyCompleted;
if (typeof data.hardModePermanentlyUnlocked !== 'undefined') window.hardModePermanentlyUnlocked = data.hardModePermanentlyUnlocked;
if (typeof data.nectarizeQuestGivenBattery !== 'undefined') window.nectarizeQuestGivenBattery = data.nectarizeQuestGivenBattery;
if (typeof data.nectarizeQuestGivenSparks !== 'undefined') window.nectarizeQuestGivenSparks = data.nectarizeQuestGivenSparks;
if (typeof data.batteryTokens !== 'undefined') {
  if (!state) state = {};
  state.batteryTokens = data.batteryTokens;
}
if (typeof data.nectarizeQuestGivenPetals !== 'undefined') window.nectarizeQuestGivenPetals = data.nectarizeQuestGivenPetals;
if (typeof data.nectarizeMilestones !== 'undefined') window.nectarizeMilestones = data.nectarizeMilestones;
if (typeof data.nectarizeMilestoneLevel !== 'undefined') window.nectarizeMilestoneLevel = data.nectarizeMilestoneLevel;
if (typeof data.nectarizeResets !== 'undefined') window.nectarizeResets = data.nectarizeResets;
if (typeof data.nectarizeResetBonus !== 'undefined') window.nectarizeResetBonus = data.nectarizeResetBonus;
if (typeof data.nectarizeTier !== 'undefined') window.nectarizeTier = data.nectarizeTier;
if (typeof data.nectarizePostResetTokenRequirement !== 'undefined') window.nectarizePostResetTokenRequirement = data.nectarizePostResetTokenRequirement;
if (typeof data.nectarizePostResetTokensGiven !== 'undefined') window.nectarizePostResetTokensGiven = data.nectarizePostResetTokensGiven;
if (typeof data.nectarizePostResetTokenType !== 'undefined') window.nectarizePostResetTokenType = data.nectarizePostResetTokenType;
    if (data.intercomState) {
      window.intercomEventTriggered = data.intercomState.intercomEventTriggered || false;
      window.intercomEvent20Triggered = data.intercomState.intercomEvent20Triggered || false;
    }
    if (typeof data.berryPlate === 'number') window.state.berryPlate = data.berryPlate;
    else window.state.berryPlate = 0;
    if (typeof data.mushroomSoup === 'number') window.state.mushroomSoup = data.mushroomSoup;
    else window.state.mushroomSoup = 0;
    if (typeof data.batteries === 'number') window.state.batteries = data.batteries;
    else window.state.batteries = 0;
    if (typeof data.glitteringPetals === 'number') window.state.glitteringPetals = data.glitteringPetals;
    else window.state.glitteringPetals = 0;
    if (typeof data.chargedPrisma === 'number') window.state.chargedPrisma = data.chargedPrisma;
    else window.state.chargedPrisma = 0;
    if (typeof data.swabucks === 'number') window.state.swabucks = data.swabucks;
    else window.state.swabucks = 0;
    if (typeof data.mysticCookingSpeedBoost === 'number') window.state.mysticCookingSpeedBoost = data.mysticCookingSpeedBoost;
    else window.state.mysticCookingSpeedBoost = 0;
    if (typeof data.soapBatteryBoost === 'number') window.state.soapBatteryBoost = data.soapBatteryBoost;
    else window.state.soapBatteryBoost = 0;
    if (typeof data.fluzzerGlitteringPetalsBoost === 'number') window.state.fluzzerGlitteringPetalsBoost = data.fluzzerGlitteringPetalsBoost;
    else window.state.fluzzerGlitteringPetalsBoost = 0;
    if (typeof data.peachyHungerBoost === 'number') window.state.peachyHungerBoost = data.peachyHungerBoost;
    else window.state.peachyHungerBoost = 0;
    if (data.characterFullStatus) {
      state.characterFullStatus = data.characterFullStatus;
    }
    if (data.settings) Object.assign(settings, data.settings);
    if (data.swariaKnowledge) Object.assign(swariaKnowledge, data.swariaKnowledge);
    boughtElements = data.boughtElements ? JSON.parse(JSON.stringify(data.boughtElements)) : {};
    generatorUpgrades = data.generatorUpgrades ? JSON.parse(JSON.stringify(data.generatorUpgrades)) : { common: 0, uncommon: 0, rare: 0, legendary: 0, mythic: 0 };
    if (window.prismState && data.prismState) {
      Object.keys(window.prismState).forEach(k => delete window.prismState[k]);
      Object.assign(window.prismState, JSON.parse(JSON.stringify(data.prismState)));
    }
    if (data.generatorSpeedUpgrades || data.generatorSpeedMultipliers || data.generatorUpgradeLevels) {
      generators.forEach(gen => {
        gen.speedUpgrades = (data.generatorSpeedUpgrades && data.generatorSpeedUpgrades[gen.reward]) || 0;
        gen.speedMultiplier = (data.generatorSpeedMultipliers && data.generatorSpeedMultipliers[gen.reward]) || 1;
        gen.upgrades = (data.generatorUpgradeLevels && data.generatorUpgradeLevels[gen.reward]) || 0;
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
    if (data.generatorsUnlocked && Array.isArray(data.generatorsUnlocked)) {
      data.generatorsUnlocked.forEach((unlocked, idx) => {
        if (generators[idx]) generators[idx].unlocked = unlocked;
      });
    }
    if (window.charger) {
      if (typeof data.chargerCharge !== 'undefined') {
        window.charger.charge = data.chargerCharge;
      } else {
        window.charger.charge = 0;
      }
      if (Array.isArray(data.chargerMilestones)) {
        data.chargerMilestones.forEach((ms, idx) => {
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
      if (data.chargerMilestoneQuests) {
        Object.entries(data.chargerMilestoneQuests).forEach(([index, quest]) => {
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
      if (typeof data.soapChargeQuestStage !== 'undefined' && window.state) {
        if (!window.state.soapChargeQuest) {
          window.state.soapChargeQuest = { stage: data.soapChargeQuestStage, initialized: true };
        } else {
          window.state.soapChargeQuest.stage = data.soapChargeQuestStage;
          window.state.soapChargeQuest.initialized = true;
        }
      }
    }
    if (typeof data.hardModeQuestActive !== 'undefined') {
      state.hardModeQuestActive = data.hardModeQuestActive;
    } else {
      state.hardModeQuestActive = false;
    }
    if (data.hardModeQuestProgress) {
      state.hardModeQuestProgress = {
        berryTokens: data.hardModeQuestProgress.berryTokens || 0,
        stardustTokens: data.hardModeQuestProgress.stardustTokens || 0,
        berryPlateTokens: data.hardModeQuestProgress.berryPlateTokens || 0,
        mushroomSoupTokens: data.hardModeQuestProgress.mushroomSoupTokens || 0,
        prismClicks: data.hardModeQuestProgress.prismClicks || 0,
        commonBoxes: data.hardModeQuestProgress.commonBoxes || 0,
        flowersWatered: data.hardModeQuestProgress.flowersWatered || 0,
        powerRefills: data.hardModeQuestProgress.powerRefills || 0,
        soapPokes: data.hardModeQuestProgress.soapPokes || 0,
        ingredientsCooked: data.hardModeQuestProgress.ingredientsCooked || 0
      };
    }
    if (data.soapChargeQuest && window.state) {
      window.state.soapChargeQuest = {
        stage: data.soapChargeQuest.stage || 0,
        initialized: data.soapChargeQuest.initialized || true
      };
    }
    if (data.chargerState && window.charger) {
      window.charger.charge = data.chargerState.charge || 0;
      if (Array.isArray(data.chargerState.milestones)) {
        data.chargerState.milestones.forEach((ms, idx) => {
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
          7: { required: 30, given: 0, completed: false, batteryRequired: 1 },
          8: { required: 75, given: 0, completed: false, batteryRequired: 2 }
        };
      }
      if (typeof data.chargerState.questStage !== 'undefined' && window.state) {
        if (!window.state.soapChargeQuest) {
          window.state.soapChargeQuest = { stage: data.chargerState.questStage, initialized: true };
        } else {
          window.state.soapChargeQuest.stage = data.chargerState.questStage;
          window.state.soapChargeQuest.initialized = true;
        }
      }
    }
    applySettings();
    updateUI();
    updateKnowledgeUI();
    if (typeof window.loadChargerState === 'function') {
      window.loadChargerState();
    }
    if (typeof window.saveChargerState === 'function') {
      window.saveChargerState();
    }
    if (typeof updateGradeUI === 'function') updateGradeUI();
    if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
    if (window.initPrism) window.initPrism();
    if (typeof updatePowerEnergyStatusUI === 'function') updatePowerEnergyStatusUI();
    if (typeof updateGlobalBlackoutOverlay === 'function') updateGlobalBlackoutOverlay();
    if (typeof updateGlobalDimOverlay === 'function') updateGlobalDimOverlay();
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
    }
    if (state.grade >= 7) {
      const infinityResearchBtn = document.getElementById("infinityResearchSubTabBtn");
      if (infinityResearchBtn) {
        infinityResearchBtn.style.display = "inline-block";
      }
    }
    const modal = document.getElementById('saveSlotModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (typeof initializeGeneratorTab === 'function') initializeGeneratorTab();
    if (typeof renderPowerGenerator === 'function') renderPowerGenerator();
    currentHomeSubTab = 'gamblingMain';
    currentKnowledgeSubTab = 'elementsMain';
    if (data.berryCookingState) {
      localStorage.setItem('berryCookingState', data.berryCookingState);
    } else {
      localStorage.removeItem('berryCookingState');
    }
    if (typeof data.terrariumPollen !== 'undefined') window.terrariumPollen = data.terrariumPollen;
    if (typeof data.terrariumFlowers !== 'undefined') window.terrariumFlowers = data.terrariumFlowers;
    if (typeof data.terrariumXP !== 'undefined') window.terrariumXP = data.terrariumXP;
    if (typeof data.terrariumLevel !== 'undefined') window.terrariumLevel = data.terrariumLevel;
    if (typeof data.terrariumPollenValueUpgradeLevel !== 'undefined') {
      window.terrariumPollenValueUpgradeLevel = data.terrariumPollenValueUpgradeLevel;
    }
    if (typeof data.terrariumPollenValueUpgrade2Level !== 'undefined') {
      window.terrariumPollenValueUpgrade2Level = data.terrariumPollenValueUpgrade2Level;
    }
    if (typeof data.terrariumXpMultiplierUpgradeLevel !== 'undefined') {
      window.terrariumXpMultiplierUpgradeLevel = data.terrariumXpMultiplierUpgradeLevel;
    }
      if (typeof data.terrariumFlowerUpgrade4Level !== 'undefined') {
    window.terrariumFlowerUpgrade4Level = data.terrariumFlowerUpgrade4Level; 
  }
    if (typeof data.terrariumFlowerValueUpgradeLevel !== 'undefined') {
      window.terrariumFlowerValueUpgradeLevel = data.terrariumFlowerValueUpgradeLevel;
    }
    if (typeof data.terrariumPollenToolSpeedUpgradeLevel !== 'undefined') {
      window.terrariumPollenToolSpeedUpgradeLevel = data.terrariumPollenToolSpeedUpgradeLevel;
    }
    if (typeof data.terrariumFlowerXPUpgradeLevel !== 'undefined') {
      window.terrariumFlowerXPUpgradeLevel = data.terrariumFlowerXPUpgradeLevel;
    }
    if (typeof data.terrariumExtraChargeUpgradeLevel !== 'undefined') {
      window.terrariumExtraChargeUpgradeLevel = data.terrariumExtraChargeUpgradeLevel;
    }
    window.kitchenIngredients = data.kitchenIngredients || {};
    if (typeof updateKitchenUI === 'function') updateKitchenUI();
    if (data.friendship) {
      window.friendship = data.friendship;
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
    if (data.berryCookingState) {
      localStorage.setItem('berryCookingState', data.berryCookingState);
    } else {
      localStorage.removeItem('berryCookingState');
    }
    if (typeof checkHardModeTabButtonVisibility === 'function') {
      checkHardModeTabButtonVisibility();
    }
    if (typeof window.reloadAchievementsForSlot === 'function') {
      window.reloadAchievementsForSlot();
    }
    setTimeout(() => {
      if (typeof window.premiumSystem?.refreshPremiumState === 'function') {
        window.premiumSystem.refreshPremiumState();
      }
      if (typeof updateUI === 'function') {
        updateUI();
      }
      if (typeof updatePremiumUI === 'function') {
        updatePremiumUI();
      }
      if (typeof window.updateChargerUI === 'function') {
        window.updateChargerUI();
      }
      const refreshMsg = document.createElement('div');
      refreshMsg.style.position = 'fixed';
      refreshMsg.style.top = '10px';
      refreshMsg.style.right = '10px';
      refreshMsg.style.background = 'rgba(0,0,0,0.8)';
      refreshMsg.style.color = 'white';
      refreshMsg.style.padding = '10px 15px';
      refreshMsg.style.borderRadius = '5px';
      refreshMsg.style.zIndex = '9999';
      refreshMsg.style.fontSize = '14px';
      refreshMsg.textContent = 'Loading save slot...';
      document.body.appendChild(refreshMsg);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }, 500);
    if (typeof window.syncTerrariumUpgradeVarsFromWindow === 'function') {
      window.syncTerrariumUpgradeVarsFromWindow();
    }
    if (typeof window.renderTerrariumUI === 'function') {
      setTimeout(() => {
        window.renderTerrariumUI();
      }, 100);
    }
  } catch (e) {
    alert('Error loading save file!');
  }
}

function deleteSlot(slotNumber) {
  if (confirm(`Are you sure you want to delete save slot ${slotNumber}?`)) {
    localStorage.removeItem(`swariaSaveSlot${slotNumber}`);
    updateSaveSlotModal();
  }
}

setInterval(() => {
  if (settings.autosave && currentSaveSlot) {
    saveToSlot(currentSaveSlot);
    showAutosaveIndicator();
  }
}, 30000); 
document.addEventListener('DOMContentLoaded', function() {
  const manualSaveBtn = document.getElementById('manualSaveBtn');
  if (manualSaveBtn) {
    manualSaveBtn.onclick = function() {
      if (currentSaveSlot) {
        saveToSlot(currentSaveSlot);
        const indicator = document.getElementById('autosaveIndicator');
        if (indicator) {
          indicator.style.display = 'block';
          indicator.style.opacity = '1';
          clearTimeout(window._autosaveTimeout);
          window._autosaveTimeout = setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => { indicator.style.display = 'none'; }, 400);
          }, 1000);
        }
      } else {
        alert('No save slot selected! Please select a slot first.');
      }
    };
  }
});

function showAutosaveIndicator() {
  const indicator = document.getElementById('autosaveIndicator');
  if (indicator) {
    let theme = settings.theme || 'light';
    let colour = settings.colour || 'green';
    let bg = '', fg = '';
    if (colour === 'green') {
      bg = theme === 'dark' ? 'rgba(0,80,40,0.85)' : 'rgba(0,255,120,0.13)';
      fg = theme === 'dark' ? '#aaffcc' : '#008c4a';
    } else if (colour === 'blue') {
      bg = theme === 'dark' ? 'rgba(30,40,80,0.85)' : 'rgba(0,180,255,0.13)';
      fg = theme === 'dark' ? '#aee6ff' : '#0077b6';
    } else if (colour === 'pink') {
      bg = theme === 'dark' ? 'rgba(80,30,60,0.85)' : 'rgba(255,0,120,0.10)';
      fg = theme === 'dark' ? '#ffb3e6' : '#c2185b';
    } else {
      bg = theme === 'dark' ? 'rgba(30,40,80,0.85)' : 'rgba(0,180,255,0.13)';
      fg = theme === 'dark' ? '#aee6ff' : '#0077b6';
    }
    indicator.style.background = bg;
    indicator.style.color = fg;
    indicator.style.display = 'block';
    indicator.style.opacity = '1';
    clearTimeout(window._autosaveTimeout);
    window._autosaveTimeout = setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => { indicator.style.display = 'none'; }, 400);
    }, 1000);
  }
}

setInterval(() => {
  if (settings.autosave && currentSaveSlot) {
    saveToSlot(currentSaveSlot);
    showAutosaveIndicator();
  }
}, 30000); 
document.addEventListener('DOMContentLoaded', function() {
  const manualSaveBtn = document.getElementById('manualSaveBtn');
  if (manualSaveBtn) {
    manualSaveBtn.onclick = function() {
      if (currentSaveSlot) {
        saveToSlot(currentSaveSlot);
        showAutosaveIndicator();
      } else {
        alert('No save slot selected! Please select a slot first.');
      }
    };
  }
});

function updateGeneratorDarknessEffect() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.body.classList.add('global-darkness');
    if (!window._darkModeCursorHandler) {

      function updateCursorLight(e) {
        const x = e.clientX;
        const y = e.clientY;
        document.documentElement.style.setProperty('--cursor-x', x + 'px');
        document.documentElement.style.setProperty('--cursor-y', y + 'px');
      }

      window._darkModeCursorHandler = updateCursorLight;
      window.addEventListener('mousemove', updateCursorLight);
      document.documentElement.style.setProperty('--cursor-x', window.innerWidth/2 + 'px');
      document.documentElement.style.setProperty('--cursor-y', window.innerHeight/2 + 'px');
    }
  } else {
    document.body.classList.remove('global-darkness');
    document.documentElement.style.removeProperty('--cursor-x');
    document.documentElement.style.removeProperty('--cursor-y');
    if (window._darkModeCursorHandler) {
      window.removeEventListener('mousemove', window._darkModeCursorHandler);
      window._darkModeCursorHandler = null;
    }
  }
}
const originalApplySettings = applySettings;

applySettings = function() {
  originalApplySettings.apply(this, arguments);
  setTimeout(updateGeneratorDarknessEffect, 10);
};

const originalSwitchHomeSubTab = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {
  originalSwitchHomeSubTab.apply(this, arguments);
  setTimeout(updateGeneratorDarknessEffect, 10);
};

document.addEventListener('DOMContentLoaded', function() {
  updateGeneratorDarknessEffect();
});
document.addEventListener('DOMContentLoaded', function() {
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      setTimeout(updateGeneratorDarknessEffect, 10);
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const generatorTabBtn = document.getElementById('generatorSubTabBtn');
  if (generatorTabBtn) {
    generatorTabBtn.addEventListener('click', function() {
      setTimeout(updateGeneratorDarknessEffect, 10);
    });
  }
});
window.addEventListener('focus', function() {
  setTimeout(updateGeneratorDarknessEffect, 10);
});
setInterval(updateGeneratorDarknessEffect, 1000);

function testDarkModeDarkness() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  settings.theme = newTheme;
  applySettings();
  saveSettings();
  setTimeout(updateGeneratorDarknessEffect, 10);
}

window.testDarkModeDarkness = testDarkModeDarkness;

function soapGetsMad() {
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  const soapSpeech = document.getElementById("swariaGeneratorSpeech");
  if (!soapImg || !soapSpeech) return;
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
  if (window.soapCurrentSpeechTimeout) {
    clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = null;
  }
  window.soapIsTalking = true;
  soapSpeech.textContent = "THAT'S IT! I'VE HAD ENOUGH OF YOU POKING ME! *shuts down power generator*";
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap mad.png";
  state.powerEnergy = 0;
  state.powerStatus = 'offline';
  updatePowerGeneratorUI();
  setTimeout(() => {
    showPowerOfflineMessage();
  }, 1000);
  window.soapClickCount = 0;
  window.soapIsMad = true;
  if (typeof window.updateSecretAchievementProgress === 'function') {
    window.updateSecretAchievementProgress('secret4', 1);
  }
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    window.soapIsTalking = false;
    window.soapCurrentSpeechTimeout = null;
    startSoapRandomSpeechTimer();
  }, 6000);
  setTimeout(() => {
    window.soapIsMad = false;
  }, 10000);
}

(function() {
  let kpSoftcapModal = null;
  let kpSoftcapModalContent = null;
  let pausedIntervals = [];
  let wasTabHidden = false;
  let canCloseKpSoftcapModal = false;
  let openTimer = null;

  function showKpSoftcapModal() {
    kpSoftcapModal = document.getElementById('kpSoftcapModal');
    kpSoftcapModalContent = document.getElementById('kpSoftcapModalContent');
    if (!kpSoftcapModal) return;
    kpSoftcapModal.classList.add('active');
    canCloseKpSoftcapModal = false;
    kpSoftcapModal.style.cursor = 'default';
    pausedIntervals = [];
    if (tickInterval) {
      clearInterval(tickInterval);
      pausedIntervals.push('tickInterval');
    }
    if (window._mainGameTickInterval) {
      clearInterval(window._mainGameTickInterval);
      pausedIntervals.push('_mainGameTickInterval');
    }
    if (window._autosaveInterval) {
      clearInterval(window._autosaveInterval);
      pausedIntervals.push('_autosaveInterval');
    }
    wasTabHidden = window.isTabHidden;
    window.isTabHidden = true;
    document.body.style.overflow = 'hidden';
    if (openTimer) clearTimeout(openTimer);
    openTimer = setTimeout(() => {
      canCloseKpSoftcapModal = true;
      if (kpSoftcapModal) kpSoftcapModal.style.cursor = 'pointer';
    }, 5000);
  }

  function hideKpSoftcapModal() {
    if (!kpSoftcapModal) kpSoftcapModal = document.getElementById('kpSoftcapModal');
    if (!kpSoftcapModal) return;
    kpSoftcapModal.classList.remove('active');
    if (openTimer) clearTimeout(openTimer);
    if (pausedIntervals.includes('tickInterval')) {
      tickInterval = setInterval(gameTick, 1000 / (tickSpeedMultiplier || 1));
    }
    if (pausedIntervals.includes('_mainGameTickInterval')) {
      window._mainGameTickInterval = setInterval(mainGameTick, 100);
    }
    if (pausedIntervals.includes('_autosaveInterval')) {
      window._autosaveInterval = setInterval(() => {
        if (currentSaveSlot) {
          saveToSlot(currentSaveSlot);
          showAutosaveIndicator();
        }
      }, 30000);
    }
    window.isTabHidden = wasTabHidden;
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    kpSoftcapModal = document.getElementById('kpSoftcapModal');
    kpSoftcapModalContent = document.getElementById('kpSoftcapModalContent');
    if (kpSoftcapModal) {
      kpSoftcapModal.onclick = function(e) {
        if (canCloseKpSoftcapModal && e.target === kpSoftcapModal) {
          hideKpSoftcapModal();
        }
      };
    }
  });
  window.showKpSoftcapModal = showKpSoftcapModal;
})();

function mainGameTick() {
  const now = Date.now();
  if (!window.lastTick) window.lastTick = now;
  const diff = (now - window.lastTick) / 1000;
  window.lastTick = now;
  tickGenerators(diff);
  if (boughtElements[7]) {
    tickPowerGenerator(diff);
  }
  if (window.tickLightGenerators) {
    window.tickLightGenerators(diff);
  }
  if (typeof getAutoLightGainPerSecond === 'function' && state.grade >= 5) {
    const autoGain = getAutoLightGainPerSecond();
    if (autoGain > 0 && window.prismState) {
      window.prismState.light += autoGain * diff;
      if (typeof updateAllLightCounters === 'function') updateAllLightCounters();
    }
  }
  if (window.state && window.state.mysticCookingSpeedBoost && window.state.mysticCookingSpeedBoost > 0) {
    if (window.kitchenCooking && window.kitchenCooking.cooking) {
      window.state.mysticCookingSpeedBoost -= diff * 1000; 
      if (window.state.mysticCookingSpeedBoost <= 0) {
        window.state.mysticCookingSpeedBoost = 0;
        if (typeof window.updateBoostDisplay === 'function') {
          window.updateBoostDisplay();
        }
      }
    }
  }
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
    window.state.fluzzerGlitteringPetalsBoost -= diff * 1000; 
      if (window.state.fluzzerGlitteringPetalsBoost <= 0) {
        window.state.fluzzerGlitteringPetalsBoost = 0;
        if (typeof window.updateBoostDisplay === 'function') {
          window.updateBoostDisplay();
        }
        if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
          window.checkAndUpdateFluzzerSleepState();
        }
        if (typeof window.stopFluzzerAI === 'function' && typeof window.startFluzzerAI === 'function') {
          window.stopFluzzerAI();
          setTimeout(() => {
            if (!window.isFluzzerSleeping) {
              window.startFluzzerAI();
            }
          }, 100);
        }
      }
  }
  if (window.state && window.state.peachyHungerBoost && window.state.peachyHungerBoost > 0) {
    if (!document.hidden) {
      window.state.peachyHungerBoost -= diff * 1000; 
      if (window.state.peachyHungerBoost <= 0) {
        window.state.peachyHungerBoost = 0;
        if (typeof window.updateBoostDisplay === 'function') {
          window.updateBoostDisplay();
        }
      }
    }
  }
  if (window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0) {
    const isNight = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
      const mins = window.daynight.getTime();
      return (mins >= 22 * 60 && mins < 24 * 60) || (mins >= 0 && mins < 6 * 60);
    })();
    if (!isNight) {
      window.state.soapBatteryBoost -= diff * 1000; 
      if (window.state.soapBatteryBoost <= 0) {
        window.state.soapBatteryBoost = 0;
        if (typeof window.updateBoostDisplay === 'function') {
          window.updateBoostDisplay();
        }
      }
    }
  }
}

if (window._mainGameTickInterval) clearInterval(window._mainGameTickInterval);
window._mainGameTickInterval = setInterval(mainGameTick, 100);


window.mainGameTick = mainGameTick;

function checkKpSoftcapStory() {
  if (!state.seenKpSoftcapStory && typeof getKpGainPreview === 'function' && getKpGainPreview() >= 1e20) {
    state.seenKpSoftcapStory = true;
    if (typeof saveGame === 'function') saveGame();
    if (typeof showKpSoftcapModal === 'function') showKpSoftcapModal();
  } else if (state.seenKpSoftcapStory) {
  }
}

const _origUpdateKnowledgeUI = updateKnowledgeUI;

updateKnowledgeUI = function() {
  _origUpdateKnowledgeUI.apply(this, arguments);
  checkKpSoftcapStory();
};

const _origResetGame = resetGame;

resetGame = function() {
  _origResetGame.apply(this, arguments);
  checkKpSoftcapStory();
};

function gradeUp() {
  const nextCost = getGradeKPCost(state.grade + 1);
  if (swariaKnowledge.kp < nextCost) return;
  const oldGrade = state.grade;
  const newGrade = (state.grade || 1) + 1;
  showGradeUpAnimation(oldGrade, newGrade);
  swariaKnowledge.kp = 1;
  state.grade = newGrade;
  if (newGrade === 5 && (!state.quests || state.quests.viAutoLightGenerator === 'not_started')) {
    if (!state.quests) state.quests = {};
    state.quests.viAutoLightGenerator = 'started';
    if (typeof window.showViResponse === 'function') {
        setTimeout(() => {
            window.showViResponse("Peachy, your work is impressive. If you bring me 15 Prisma Shards, I can build you an automatic light collector.");
        }, 3000);
    }
  }
  state.powerMaxEnergy = calculatePowerGeneratorCap();
  state.powerEnergy = state.powerMaxEnergy; 
  generatorUpgrades = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
    mythic: 0
  };
  if (window.generators) {
    window.generators.forEach(gen => {
      gen.speedUpgrades = 0;
      gen.speed = gen.baseSpeed;
      gen.upgrades = 0; 
    });
  }
  state.boxesProduced = 0;
  state.boxesProducedByType = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
    mythic: 0
  };
  const keep = [7, 8];
  for (let key in boughtElements) {
    if (!keep.includes(parseInt(key))) {
      delete boughtElements[key];
    }
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
  resetChargerWhenAvailable();
  if (typeof saveGame === "function") saveGame();
  if (typeof currentSaveSlot !== 'undefined' && currentSaveSlot && typeof saveToSlot === 'function') saveToSlot(currentSaveSlot);
  if (window.prismState) {
    [
      'light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight',
      'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'
    ].forEach(key => prismState[key] = 0);
    prismState.generatorUpgrades = {
      light: 0,
      redlight: 0,
      orangelight: 0,
      yellowlight: 0,
      greenlight: 0,
      bluelight: 0
    };
    prismState.generatorUnlocked = {
      light: false,
      redlight: false,
      orangelight: false,
      yellowlight: false,
      greenlight: false,
      bluelight: false
    };
  }
  if (state.powerEnergy > state.powerMaxEnergy) {
    state.powerEnergy = state.powerMaxEnergy;
  }
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
    window.location.reload();
  }
}

function formatLargeInt(num) {
  if (!isFinite(num)) return 'Infinity';
  if (num === 0) return '0';
  num = Math.floor(Number(num));
  if (!isFinite(num)) return 'Infinity';
  if (num >= 1e6) {
    return num.toExponential(2); 
  }
  return num.toLocaleString();
}

if (swariaKnowledge.kp > 0) {
  document.getElementById("kpLine").style.display = "block";
  document.getElementById("kp").textContent = formatLargeInt(swariaKnowledge.kp);
}
document.querySelectorAll('#kp').forEach(kpEl => {
  kpEl.textContent = formatLargeInt(swariaKnowledge.kp);
});
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

function diagnoseGeneratorSpeed() {
  generators.forEach((gen, i) => {
  });
  generators.forEach((gen, i) => {
    const calculatedSpeed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades || 0) * (gen.speedMultiplier || 1);
  });
  const now = Date.now();
  if (!window.lastTick) window.lastTick = now;
  const actualDiff = (now - window.lastTick) / 1000;
  const runningGenerators = generators.filter(gen => gen.unlocked && state.powerStatus === 'online' && state.powerEnergy > 0);
}

window.diagnoseGeneratorSpeed = diagnoseGeneratorSpeed;

function fixGeneratorSpeed() {
  if (state.powerStatus !== 'online' || state.powerEnergy <= 0) {
    state.powerStatus = 'online';
    state.powerEnergy = state.powerMaxEnergy || 100;
  }
  generators.forEach((gen, i) => {
    const oldSpeed = gen.speed;
    gen.speed = gen.baseSpeed * Math.pow(1.3, gen.speedUpgrades || 0) * (gen.speedMultiplier || 1);
  });
  window.lastTick = Date.now();
  updateUI();
  updatePowerGeneratorUI();
  if (typeof updateGeneratorsUI === 'function') {
    updateGeneratorsUI();
  }
}

window.fixGeneratorSpeed = fixGeneratorSpeed;
document.addEventListener('DOMContentLoaded', function() {
  const backBtn = document.getElementById('backToGeneratorBtn');
  if (backBtn) {
    backBtn.onclick = function() {
      switchHomeSubTab('generatorSubTab');
    };
  }
});
if (!window.prismState) {
  window.prismState = {
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
    generatorUpgrades: {
      light: 0,
      redlight: 0,
      orangelight: 0,
      yellowlight: 0,
      greenlight: 0,
      bluelight: 0
    },
    generatorUnlocked: {
      light: false,
      redlight: false,
      orangelight: false,
      yellowlight: false,
      greenlight: false,
      bluelight: false
    }
  };
}
const soapChargerQuotes = [
  "While charging, we will lose power, so watch out!",
  "Did you know? I invented the charger. Totally.",
  "Keep an eye on the power while the charger is active.",
  "Soap's tip: Keep refilling the power while the charger is active.",
  "Well the charger is now ready to use, this will help us greatly.",
  "Do not let the power run out while charging! We'll lose some charge if that happens!",
  "Also don't even try poking me repeatedly here, I'll do something even worst than shutting the power off!"
];
let soapChargerSpeechTimeout;

function showSoapChargerSpeech() {
  const soapImg = document.getElementById("soapChargerCharacter");
  const soapSpeech = document.getElementById("soapChargerSpeech");
  if (!soapImg || !soapSpeech) return;
  const randomQuote = soapChargerQuotes[Math.floor(Math.random() * soapChargerQuotes.length)];
  soapSpeech.textContent = randomQuote;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  if (soapChargerSpeechTimeout) clearTimeout(soapChargerSpeechTimeout);
  soapChargerSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
  }, 10000); 
}

const _origSwitchHomeSubTab_SoapCharger = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {
  _origSwitchHomeSubTab_SoapCharger.apply(this, arguments);
  if (subTabId === 'chargerSubTab') {
    setTimeout(() => {
      showSoapChargerSpeech();
      const soapImg = document.getElementById("soapChargerCharacter");
      if (soapImg) {
        soapImg.onclick = showSoapChargerClickMessage;
        soapImg.style.cursor = "pointer";
      }
    }, 300);
  }
};

window.boughtElements = boughtElements;

function resetChargerWhenAvailable() {
  if (window.charger) {
    window.charger.charge = 0;
    if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
  } else {
    setTimeout(resetChargerWhenAvailable, 100);
  }
}

function updateStairsCardVisibility() {
  const stairsCard = document.getElementById('stairsCard');
  const stairsCardFloor1 = document.getElementById('stairsCardFloor1');
  const show = (state.grade || 1) >= 6;
  if (stairsCard) stairsCard.style.display = show ? 'flex' : 'none';
  if (stairsCardFloor1) stairsCardFloor1.style.display = show ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  updateStairsCardVisibility();
  const stairsCard = document.getElementById('stairsCard');
  if (stairsCard) {
    stairsCard.onclick = function() {
      window.currentFloor = 2;
      if (typeof window.updateFloor2Visibility === 'function') {
        window.updateFloor2Visibility();
      }
      if (window.currentFloor === 2 && typeof window.renderTerrariumUI === 'function') {
        window.renderTerrariumUI();
      }
      if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
        window.checkAndUpdateFluzzerSleepState();
      }
    };
  }
  const stairsCardFloor1 = document.getElementById('stairsCardFloor1');
  if (stairsCardFloor1) {
    stairsCardFloor1.onclick = function() {
      window.currentFloor = 1;
      if (typeof window.updateFloor2Visibility === 'function') {
        window.updateFloor2Visibility();
      }
      if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
        window.checkAndUpdateFluzzerSleepState();
      }
    };
  }
  const terrariumTabBtn = document.querySelector('#subTabNav button');
  if (terrariumTabBtn) {
    terrariumTabBtn.addEventListener('click', function() {
      setTimeout(function() {
        if (window.currentFloor === 2 && typeof window.renderTerrariumUI === 'function') {
          window.renderTerrariumUI();
        }
      }, 0);
    });
  }
});
const _origUpdateUI_Stairs = updateUI;

updateUI = function() {
  _origUpdateUI_Stairs.apply(this, arguments);
  updateStairsCardVisibility();
};

function unlockAllTabs() {
  swariaKnowledge.kp = 1000000;
  if (!boughtElements[7]) {
    tryBuyElement(7);
  }
  if (state.grade < 2) {
    state.grade = 2;
  }
  updateUI();
  updateKnowledgeUI();
  if (typeof updatePrismSubTabVisibility === 'function') {
    updatePrismSubTabVisibility();
  }
  if (typeof initializeGeneratorTab === 'function') {
    initializeGeneratorTab();
  }
}

window.unlockAllTabs = unlockAllTabs;

function debugSubTabRendering() {
  const generatorContainer = document.getElementById('generatorContainer');
  const lightGrid = document.getElementById('lightGrid');
  const generatorSubTab = document.getElementById('generatorSubTab');
  const prismSubTab = document.getElementById('prismSubTab');
  if (generatorSubTab) {
  }
  if (prismSubTab) {
  }
  if (typeof renderGenerators === 'function') {
    try {
      renderGenerators();
    } catch (error) {
    }
  }
  if (typeof window.initPrism === 'function') {
    try {
      window.initPrism();
    } catch (error) {
    }
  }
}

window.debugSubTabRendering = debugSubTabRendering;

function updateFloor2Visibility() {
  const terrariumTab = document.getElementById('terrariumTab');
  const homeSubTabs = document.getElementById('homeSubTabs');
  if (window.currentFloor === 2) {
    if (terrariumTab) terrariumTab.style.display = 'block';
    if (homeSubTabs) homeSubTabs.style.display = 'none';
    document.body.classList.add('terrarium-bg');
    if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
      window.checkAndUpdateFluzzerSleepState();
    }
  } else {
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (homeSubTabs) homeSubTabs.style.display = 'block';
    document.body.classList.remove('terrarium-bg');
  }
  updateFloor2NavLabels();
}

function updateFloor2NavLabels() {
  const cargoBtn = document.querySelector("#subTabNav button[onclick*='gamblingMain']");
  const genBtn = document.getElementById('generatorSubTabBtn');
  const labBtn = document.getElementById('prismSubTabBtn');
  if (window.currentFloor === 2) {
    if (cargoBtn) cargoBtn.textContent = 'Terrarium';
    if (genBtn) genBtn.textContent = 'Water filter';
    if (labBtn) labBtn.textContent = 'Observatory';
    setTimeout(() => {
      if (genBtn) genBtn.style.setProperty('display', 'none', 'important');
      if (labBtn) labBtn.style.setProperty('display', 'none', 'important');
      document.body.classList.add('terrarium-active');
    }, 0);
  } else {
    if (cargoBtn) cargoBtn.textContent = 'Cargo';
    if (genBtn) {
      genBtn.textContent = 'Generators';
      genBtn.style.setProperty('display', 'inline-block', 'important');
    }
    if (labBtn) {
      labBtn.textContent = 'Lab';
      labBtn.style.setProperty('display', 'inline-block', 'important');
    }
    document.body.classList.remove('terrarium-active');
  }
}

function showSoapPowerRefillSpeech(message, success) {
  let card = document.querySelector('.power-generator');
  if (!card) {
    card = document.getElementById('powerGeneratorFixed');
    if (card) card = card.querySelector('.power-generator');
  }
  if (!card) return;
  let bubble = card.querySelector('.soap-power-speech');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'soap-power-speech';
    bubble.style.position = 'relative';
    bubble.style.margin = '18px auto 0 auto';
    bubble.style.textAlign = 'center';
    bubble.style.fontWeight = 'bold';
    bubble.style.fontSize = '1.1em';
    bubble.style.borderRadius = '14px';
    bubble.style.padding = '0.7em 1.2em';
    bubble.style.maxWidth = '320px';
    bubble.style.boxShadow = '0 2px 8px rgba(44,19,84,0.10)';
    bubble.style.transition = 'opacity 0.3s';
    bubble.style.opacity = '0';
    bubble.style.pointerEvents = 'none';
    card.appendChild(bubble);
  }
  bubble.textContent = message;
  bubble.style.background = success ? '#e8ffe8' : '#f7f7f7';
  bubble.style.color = success ? '#228822' : '#444';
  bubble.style.border = success ? '2px solid #66cc66' : '2px solid #bbb';
  bubble.style.opacity = '1';
  if (bubble._hideTimeout) clearTimeout(bubble._hideTimeout);
  bubble._hideTimeout = setTimeout(() => {
    bubble.style.opacity = '0';
  }, 3000);
}

const _origTickPowerGenerator = tickPowerGenerator;

tickPowerGenerator = function(diff) {
  let soapRefillResult = null;
  let soapRefillMessage = '';
  const oldSoapRefillUsed = state.soapRefillUsed;
  const oldPowerEnergy = state.powerEnergy;
  _origTickPowerGenerator.apply(this, arguments);
  if (oldPowerEnergy === 50 && !oldSoapRefillUsed && state.soapRefillUsed) {
    if (state.powerEnergy > 50) {
      soapRefillResult = true;
      soapRefillMessage = "Soap refilled the power generator!";
    } else {
      soapRefillResult = false;
      soapRefillMessage = "Soap was too interested in his soap collection to refill the power generator.";
    }
    showSoapPowerRefillSpeech(soapRefillMessage, soapRefillResult);
  }
};

(function() {

  function updateDigitalClock() {
    if (window.daynight && typeof window.daynight.getTimeString === 'function') {
      const clock = document.getElementById('digitalClock');
      if (clock) {
        clock.textContent = window.daynight.getTimeString();
      }
    }
  }

  setInterval(updateDigitalClock, 1000);

  function tryRegisterDaynightCallback() {
    if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
      window.daynight.onTimeChange(updateDigitalClock);
      return true;
    }
    return false;
  }

  if (!tryRegisterDaynightCallback()) {
    const poll = setInterval(() => {
      if (tryRegisterDaynightCallback()) clearInterval(poll);
    }, 50);
  }
})();
const originalUpdateGeneratorDarknessEffect = updateGeneratorDarknessEffect;

updateGeneratorDarknessEffect = function() {
  originalUpdateGeneratorDarknessEffect.apply(this, arguments);
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const mins = window.daynight.getTime();
    if (mins >= 350 && mins < 360 && document.body.classList.contains('global-darkness')) {
      const progress = (mins - 350) / 10; 
      const opacity = 1 - progress;
      document.body.style.setProperty('--darkness-opacity', opacity.toFixed(2));
    } else {
      document.body.style.removeProperty('--darkness-opacity');
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const mixBtn = document.getElementById('mixButton');
  const mixModal = document.getElementById('mixModal');
  if (mixBtn && mixModal) {
    mixBtn.onclick = function() {
      mixModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
    mixModal.onclick = function(e) {
      if (e.target === mixModal) {
        mixModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    };
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mixModal.style.display === 'flex') {
        mixModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
});
window.isSoapSleeping = false;
window.isFluzzerSleeping = false;

function updateSoapSleepState() {
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  if (!soapImg) return;
  if (window.isSoapSleeping) {
    soapImg.src = "assets/icons/soap sleeping.png";
  } else {
    soapImg.src = "assets/icons/soap.png";
  }
}

if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    if ((mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360)) {
      if (!window.isSoapSleeping) {
        window.isSoapSleeping = true;
        updateSoapSleepState();
        if (typeof stopSoapRandomSpeechTimer === 'function') stopSoapRandomSpeechTimer();
      }
    } else {
      if (window.isSoapSleeping) {
        window.isSoapSleeping = false;
        updateSoapSleepState();
        if (typeof startSoapRandomSpeechTimer === 'function') startSoapRandomSpeechTimer();
      }
    }
  });
}
const origShowSoapClickMessage = showSoapClickMessage;

showSoapClickMessage = function() {
  if (window.isSoapSleeping) {
    const soapImg = document.getElementById("swariaGeneratorCharacter");
    const soapSpeech = document.getElementById("swariaGeneratorSpeech");
    if (!soapImg || !soapSpeech) return;
    soapSpeech.textContent = "Zzz...";
    soapSpeech.style.display = "block";
    soapImg.src = "assets/icons/soap sleep talking.png";
    if (window.soapCurrentSpeechTimeout) clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = setTimeout(() => {
      soapSpeech.style.display = "none";
      soapImg.src = "assets/icons/soap sleeping.png";
      window.soapIsTalking = false;
      window.soapCurrentSpeechTimeout = null;
    }, 3000);
    return;
  }
  origShowSoapClickMessage.apply(this, arguments);
};

const origTickPowerGeneratorSleep = tickPowerGenerator;

tickPowerGenerator = function(diff) {
  if (window.isSoapSleeping) {
    let oldPowerEnergy = state.powerEnergy;
    if (state.powerStatus === 'online' && state.powerEnergy > 0) {
      state.powerEnergy = Math.max(0, state.powerEnergy - diff / 5);
      if (state.powerEnergy > 50) {
        state.soapRefillUsed = false;
      }
      if (state.powerEnergy <= 0) {
        state.powerStatus = 'offline';
        showPowerOfflineMessage();
      }
    }
    updatePowerGeneratorUI();
    return;
  }
  origTickPowerGeneratorSleep.apply(this, arguments);
};

function tickCafeteria(diff) {
  const isNight = window.daynight && typeof window.daynight.getTime === 'function' && 
    (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
    })();
  if (!isNight && state.berryPlates < state.berryPlatesMax) {
    const now = Date.now();
    const timeSinceLastPlate = now - state.lastBerryPlateTime;
    if (timeSinceLastPlate >= 60000) { 
      state.berryPlates++;
      state.lastBerryPlateTime = now;
    }
    const cookingProgress = Math.min(100, (timeSinceLastPlate / 60000) * 100);
    state.berryPlateCookingProgress = cookingProgress;
  } else {
    state.berryPlateCookingProgress = 0;
  }
  if (!state.characterHunger) {
    state.characterHunger = {
      swaria: 100,
      soap: 100,
      fluzzer: 100,
      mystic: 100,
      vi: 100
    };
  }
  const now = Date.now();
  if (now - state.lastHungerTick >= 120000) { 
    if (!document.hidden) {
      Object.keys(state.characterHunger).forEach(character => {
        const hasHungerBoost = character === 'swaria' && 
                              window.state && 
                              window.state.peachyHungerBoost && 
                              window.state.peachyHungerBoost > 0;
        if (hasHungerBoost) {
        } else {
          if (state.characterHunger[character] > 0) {
            state.characterHunger[character] = Math.max(0, state.characterHunger[character] - 1);
          }
        }
      });
    }
    state.lastHungerTick = now;
  }
  if (state.characterHunger) {
    Object.keys(state.characterHunger).forEach(character => {
      if (character !== 'swaria' && state.characterHunger[character] <= 30 && state.berryPlates > 0) {
        state.berryPlates--;
        state.characterHunger[character] = Math.min(100, state.characterHunger[character] + 40);
        showGainPopup("autoHungerGain", "+40 Hunger", character);
      }
    });
  }
  const isTabbedOut = document.hidden;
  const shouldTriggerDesperateEating = state.characterHunger && state.characterHunger.swaria === 0;
  const shouldTriggerSafetyRefill = isTabbedOut && state.characterHunger && state.characterHunger.swaria <= 20 && !state.swariaSafetyRefillTriggered;
  if (shouldTriggerSafetyRefill) {
    state.swariaSafetyRefillTriggered = true;
    const swariaSpeech = document.getElementById('swariaSpeech');
    if (swariaSpeech) {
      swariaSpeech.textContent = "Thanks for coming back! I was getting really hungry...";
      swariaSpeech.style.display = "block";
      setTimeout(() => {
        swariaSpeech.style.display = "none";
      }, 5000);
    }
    state.characterHunger.swaria = 100;
    setTimeout(() => {
      state.swariaSafetyRefillTriggered = false;
    }, 60000); 
  }
  if (shouldTriggerDesperateEating && !state.swariaDesperateEatingTriggered) {
    state.swariaDesperateEatingTriggered = true;
    const consumedResources = [];
    if (state.fluff > 0) {
      consumedResources.push(`${formatNumber(state.fluff)} Fluff`);
      state.fluff = 0;
    }
    if (state.swaria > 0) {
      consumedResources.push(`${formatNumber(state.swaria)} Swaria Coins`);
      state.swaria = 0;
    }
    if (state.feathers > 0) {
      consumedResources.push(`${formatNumber(state.feathers)} Feathers`);
      state.feathers = 0;
    }
    if (state.artifacts > 0) {
      consumedResources.push(`${formatNumber(state.artifacts)} Wing Artifacts`);
      state.artifacts = 0;
    }
    if (swariaKnowledge.kp > 0) {
      consumedResources.push(`${formatLargeInt(swariaKnowledge.kp)} Knowledge Points`);
      swariaKnowledge.kp = 0;
    }
    if (window.prismState) {
      const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
      lightTypes.forEach(lightType => {
        if (window.prismState[lightType] > 0) {
          consumedResources.push(`${formatNumber(window.prismState[lightType])} ${lightType.replace('light', ' Light')}`);
          window.prismState[lightType] = 0;
        }
      });
    }
    if (window.charger && window.charger.charge > 0) {
      consumedResources.push(`${formatNumber(window.charger.charge)} Charge`);
      window.charger.charge = 0;
    }
    for (let i = 0; i < 118; i++) {
      if (i !== 6 && i !== 7 && boughtElements[i] > 0) { 
        consumedResources.push(`${formatNumber(boughtElements[i])} Element ${i + 1}`);
        boughtElements[i] = 0;
      }
    }
    if (window.terrariumPollen > 0) {
      consumedResources.push(`${formatNumber(window.terrariumPollen)} Pollen`);
      window.terrariumPollen = 0;
    }
    if (window.terrariumFlowers > 0) {
      consumedResources.push(`${formatNumber(window.terrariumFlowers)} Flowers`);
      window.terrariumFlowers = 0;
    }
    if (generators) {
      generators.forEach((gen, index) => {
        if (gen.amount > 0) {
          consumedResources.push(`${formatNumber(gen.amount)} ${gen.name}`);
          gen.amount = 0;
        }
      });
    }
    if (state.berryPlates > 0) {
      consumedResources.push(`${state.berryPlates} Berry Plates`);
      state.berryPlates = 0;
    }
    if (consumedResources.length > 0) {
      const swariaSpeech = document.getElementById('swariaSpeech');
      if (swariaSpeech) {
        swariaSpeech.textContent = "I was so hungry I ate everything! *burp*";
        swariaSpeech.style.display = "block";
        setTimeout(() => {
          swariaSpeech.style.display = "none";
        }, 5000);
      }
    }
    state.characterHunger.swaria = 100;
    setTimeout(() => {
      state.swariaDesperateEatingTriggered = false;
    }, 60000); 
  }
}

function updateCafeteriaUI() {
  const berryPlatesCount = document.getElementById('berryPlatesCount');
  const berryPlatesMax = document.getElementById('berryPlatesMax');
  const collectPlateBtn = document.getElementById('collectPlateBtn');
  const progressBar = document.getElementById('berryPlateProgressBar');
  if (berryPlatesCount) berryPlatesCount.textContent = state.berryPlates;
  if (berryPlatesMax) berryPlatesMax.textContent = state.berryPlatesMax;
  if (collectPlateBtn) {
    collectPlateBtn.style.opacity = state.berryPlates <= 0 ? '0.5' : '1';
  }
  if (progressBar) {
    const progress = state.berryPlateCookingProgress || 0;
    progressBar.style.width = `${progress}%`;
    if (progress > 0) {
      progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
    } else {
      progressBar.style.background = '#666'; 
    }
  }
  updateSwariaHungerUI();
}

function collectBerryPlate() {
  if (state.berryPlates > 0) {
    if (typeof window.resetCollectPlateNoPlateClicks === 'function') {
      window.resetCollectPlateNoPlateClicks();
    }
    state.berryPlates--;
    if (state.characterHunger.swaria !== undefined) {
      state.characterHunger.swaria = Math.min(100, state.characterHunger.swaria + 10);
      showGainPopup("hungerGain", "+10 Hunger", "Swaria");
    }
    updateCafeteriaUI();
  } else {
    if (typeof window.trackCollectPlateNoPlateClick === 'function') {
      window.trackCollectPlateNoPlateClick();
    }
  }
}

function updateSwariaHungerUI() {
  const swariaHungerValue = document.getElementById('swariaHungerValue');
  const swariaHungerBar = document.getElementById('swariaHungerBar');
  if (swariaHungerValue && swariaHungerBar) {
    const hunger = state.characterHunger.swaria || 100;
    const hungerBoostTime = (window.state && window.state.peachyHungerBoost) || 0;
    const hasHungerBoost = hungerBoostTime > 0;
    swariaHungerValue.textContent = hunger;
    let color = '#4CAF50';
    if (hasHungerBoost) {
      color = '#FFD700'; 
    } else if (hunger < 30) {
      color = '#f44336';
    } else if (hunger < 60) {
      color = '#ff9800';
    }
    swariaHungerBar.style.background = `linear-gradient(90deg, ${color}, ${color}dd)`;
    swariaHungerBar.style.width = `${hunger}%`;
    let timerElement = document.getElementById('swariaHungerBoostTimer');
    if (hasHungerBoost) {
      if (!timerElement) {
        timerElement = document.createElement('div');
        timerElement.id = 'swariaHungerBoostTimer';
        timerElement.style.cssText = `
          text-align: center;
          font-size: 0.9em;
          color: #FFD700;
          font-weight: bold;
          margin-top: 0.3em;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        `;
        const hungerBarContainer = swariaHungerBar.parentElement;
        if (hungerBarContainer) {
          hungerBarContainer.appendChild(timerElement);
        }
      }
      const minutesLeft = Math.ceil(hungerBoostTime / (60 * 1000));
      const secondsLeft = Math.ceil((hungerBoostTime % (60 * 1000)) / 1000);
      timerElement.textContent = `HUNGER BOOST: ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
      timerElement.style.display = 'block';
    } else {
      if (timerElement) {
        timerElement.style.display = 'none';
      }
    }
  }
}

function initializeCafeteria() {
  updateCafeteriaUI();
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeCafeteria, 1000);
  setInterval(() => {
    if (typeof updateSwariaHungerUI === 'function') {
      updateSwariaHungerUI();
    }
  }, 1000); 
});
window.addEventListener('DOMContentLoaded', function() {
  const inventoryBtn = document.getElementById('inventoryBtn');
  const inventoryModal = document.getElementById('inventoryModal');
  let inventoryOpen = false;
  const characterDropTargets = [
    'swariaCharacter', 
    'swariaGeneratorCharacter', 
    'kitchenCharacterImg', 
    'fluzzerImg', 
    'terrariumNectarizeCharacterImg', 
    'viSpeechBubble', 
    'soapChargerCharacter', 
    'hardModeSwariaImg', 
  ];

  function getCharacterNameFromId(id) {
    switch (id) {
      case 'swariaCharacter': return 'Swaria';
      case 'swariaGeneratorCharacter': return 'Soap';
      case 'soapChargerCharacter': return 'Soap';
      case 'kitchenCharacterImg': return 'Mystic';
      case 'fluzzerImg': return 'Fluzzer';
      case 'terrariumNectarizeCharacterImg': return 'Fluzzer';
      case 'viSpeechBubble': return 'Vi'; 
      case 'hardModeSwariaImg': return 'Swaria'; 
      default: return 'Unknown';
    }
  }

  function setupCharacterDropTargets() {
    characterDropTargets.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.onmouseenter = null;
      el.onmouseleave = null;
      el.ondragover = null;
      el.ondrop = null;
      el._tokenDropActive = false;
      el.addEventListener('mouseenter', function() {
        if (window._draggingToken) {
          el.style.outline = '3px solid #ffe066';
          el._tokenDropActive = true;
        }
      });
      el.addEventListener('mouseleave', function() {
        el.style.outline = '';
        el._tokenDropActive = false;
      });
      el.addEventListener('mouseup', function(e) {
        if (window._draggingToken && el._tokenDropActive) {
          let isSleeping = false;
          if (id === 'swariaGeneratorCharacter' && window.isSoapSleeping) isSleeping = true;
          if (id === 'fluzzerImg' && window.isFluzzerSleeping) isSleeping = true;
          if (id === 'terrariumNectarizeCharacterImg' && window.isFluzzerSleeping) isSleeping = true;
          if (id === 'kitchenCharacterImg' && window.isMysticSleeping) isSleeping = true;
          if (id === 'viSpeechBubble' && window.isViSleeping) isSleeping = true;
          if (isSleeping) {
            el.style.outline = '3px solid #888';
            el.title = 'This character is sleeping!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          const characterName = getCharacterNameFromId(id);
          const tokenType = window._draggingTokenType;
          if (id === 'hardModeSwariaImg') {
            showGiveTokenModal(tokenType, characterName);
            el.style.outline = '';
            el._tokenDropActive = false;
            return;
          }
          if (tokenType === 'berryPlate' && characterName !== 'Swaria') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Berry Plates can only be given to Swaria!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          if (tokenType === 'batteries' && characterName !== 'Soap' && characterName !== 'Fluzzer') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Batteries can only be given to Soap or Fluzzer!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          if (tokenType === 'glitteringPetals' && characterName !== 'Fluzzer') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Glittering Petals can only be given to Fluzzer!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          if (tokenType === 'chargedPrisma' && characterName !== 'Vi') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Charged Prisma can only be given to Vi!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          if (characterName === 'Swaria' && ['sparks', 'petals', 'prisma', 'stardust'].includes(tokenType)) {
            const swariaSpeech = document.getElementById('swariaSpeech');
            const swariaImg = document.getElementById('swariaCharacter');
            if (swariaSpeech) {
              swariaSpeech.textContent = "I'm not eating that";
              swariaSpeech.style.display = "block";
              if (swariaImg) {
                swariaImg.src = getMainCargoCharacterImage(true); 
              }
              setTimeout(() => {
                swariaSpeech.style.display = "none";
                if (swariaImg) {
                  swariaImg.src = getMainCargoCharacterImage(false); 
                }
              }, 3000);
            }
            return; 
          }
          showGiveTokenModal(tokenType, characterName);
          el.style.outline = '';
          el._tokenDropActive = false;
        }
      });
    });
  }

const characterTokenPreferences = {
  Soap: {
    likes: ['sparks'],
    dislikes: ['mushroom', 'water'],
    neutral: ['berries', 'prisma', 'petals', 'stardust']
  },
  Mystic: {
    likes: ['mushroom', 'berries', 'stardust'],
    dislikes: ['sparks', 'prisma'],
    neutral: ['petals', 'water']
  },
  Fluzzer: {
    likes: ['berries', 'petals'],
    dislikes: ['prisma'],
    neutral: ['mushroom', 'sparks', 'water', 'stardust']
  },
  Vi: { 
    likes: ['prisma', 'water'],
    dislikes: ['sparks'],
    neutral: ['berries', 'petals', 'mushroom', 'stardust']
  },
  Swaria: { 
    likes: ['berries', 'berryPlate'],
    dislikes: ['sparks', 'petals', 'prisma', 'stardust'],
    neutral: ['mushroom', 'water']
  }
};

function updateMainCargoCharacterImage() {
  const swariaImg = document.getElementById('swariaCharacter');
  if (swariaImg) {
    swariaImg.src = getMainCargoCharacterImage(false); 
  } else {
  }
}

function updatePrismLabCharacterImage() {
  const prismImg = document.getElementById('prismCharacter');
  if (prismImg) {
    prismImg.src = getPrismLabCharacterImage(false); 
  } else {
  }
}

function updateHardModeQuestCharacterImage() {
  const hardModeImg = document.querySelector('#hardModeSwariaImg img');
  if (hardModeImg) {
    hardModeImg.src = getHardModeQuestCharacterImage(false); 
  } else {
  }
}

function updateTerrariumCharacterImage() {
  const terrariumImg = document.getElementById('terrariumCharacterImg');
  if (terrariumImg) {
    terrariumImg.src = getTerrariumCharacterImage(false); 
  } else {
  }
}

function getMainCargoCharacterImage(isTalking = false) {
  if (window.premiumState && window.premiumState.bijouEnabled) {
    return isTalking ? "assets/icons/peachy and bijou talking.png" : "assets/icons/peachy and bijou.png";
  } else {
    return isTalking ? "swa talking.png" : "swa normal.png";
  }
}

function getPrismLabCharacterImage(isTalking = false) {
  if (window.premiumState && window.premiumState.bijouEnabled) {
    return "assets/icons/peachy and bijou prism.png"; 
  } else {
    return isTalking ? "assets/icons/swaria speach prism.png" : "assets/icons/swaria prism.png";
  }
}

function getHardModeQuestCharacterImage(isTalking = false) {
  if (window.premiumState && window.premiumState.bijouEnabled) {
    return isTalking ? "assets/icons/peachy and bijou talking.png" : "assets/icons/peachy and bijou.png";
  } else {
    return isTalking ? "swa talking.png" : "swa normal.png";
  }
}

function getTerrariumCharacterImage(isTalking = false) {
  if (window.premiumState && window.premiumState.bijouEnabled) {
    return isTalking ? "assets/icons/peachy and bijou talking.png" : "assets/icons/peachy and bijou.png";
  } else {
    return isTalking ? "assets/icons/swaria talking.png" : "assets/icons/swaria normal.png";
  }
}

function forceUpdateCargoCharacter() {
  updateMainCargoCharacterImage();
}

function forceUpdatePrismLabCharacter() {
  updatePrismLabCharacterImage();
}

function forceUpdateHardModeQuestCharacter() {
  updateHardModeQuestCharacterImage();
}

function forceUpdateTerrariumCharacter() {
  updateTerrariumCharacterImage();
}

window.updateMainCargoCharacterImage = updateMainCargoCharacterImage;
window.updatePrismLabCharacterImage = updatePrismLabCharacterImage;
window.updateHardModeQuestCharacterImage = updateHardModeQuestCharacterImage;
window.updateTerrariumCharacterImage = updateTerrariumCharacterImage;
window.forceUpdateCargoCharacter = forceUpdateCargoCharacter;
window.forceUpdatePrismLabCharacter = forceUpdatePrismLabCharacter;
window.forceUpdateHardModeQuestCharacter = forceUpdateHardModeQuestCharacter;
window.forceUpdateTerrariumCharacter = forceUpdateTerrariumCharacter;
window.getMainCargoCharacterImage = getMainCargoCharacterImage;
window.getPrismLabCharacterImage = getPrismLabCharacterImage;
window.getHardModeQuestCharacterImage = getHardModeQuestCharacterImage;
window.getTerrariumCharacterImage = getTerrariumCharacterImage;
const characterTokenSpeech = {
  Soap: {
    mushroom: ["Ew, mushrooms? Not a fan..."],
    sparks: ["Sparks! My favorite!", "Zzzap! Thank you!"],
    berries: ["Berries? I guess that's fine."],
    prisma: ["Prisma shard? What am I supposed to do with this?"],
    petals: ["Petals? Hm, okay."],
    water: ["Water? I'm not a fan of getting wet...", "Please keep that away from the generators!"],
    stardust: ["Stardust? Thanks, I guess."],
    batteries: ["Batteries! Perfect for my generators!", "These will keep everything running smoothly!", "Zzzap! These are exactly what I needed!"]
  },
  Mystic: {
    mushroom: ["Ah, mushrooms! Perfect for my next dish!"],
    sparks: ["Sparks? Please don't set the kitchen on fire..."],
    berries: ["Berries are always useful."],
    prisma: ["Prisma shard? I'll try to make something with it."],
    petals: ["Petals! These will make a beautiful garnish."],
    water: ["Water? That will come handy.", "Thanks, this will help with the cooking."],
    stardust: ["Stardust! Perfect for my special night-time recipes!", "Ah, the essence of night itself! Thank you!"]
  },
  Fluzzer: {
    mushroom: ["Mushrooms? I guess they're okay."],
    sparks: ["Sparks? I don't really need those..."],
    berries: ["Berries! Yum! Thank you!"],
    prisma: ["Prisma shard? I don't like these much..."],
    petals: ["Petals! I love these!"],
    water: ["Water? Thx, that will be good for filling my watering can.", "Yay, water! Thank you!"],
    stardust: ["Stardust? Thanks, I guess it's pretty."],
    glitteringPetals: ["Glittering petals! So beautiful!", "These sparkle just like my flowers!", "Thank you for these magical petals!"]
  },
  Vi: {
    mushroom: ["Mushrooms? I guess I can study these..."],
    sparks: ["Sparks? Please keep those away from my experiments!"],
    berries: ["Berries? Thank you, I suppose."],
    prisma: ["Prisma shard! This will help my research!"],
    petals: ["Petals? They're pretty."],
    water: ["Water? That's useful for my experiments, thanks!"],
    stardust: ["Stardust? Interesting, I'll analyze it."],
    chargedPrisma: ["Charged Prisma! This is exactly what I needed for my experiments!", "The energy signature is perfect!", "This will revolutionize my research!"]
  },
  Swaria: {
    mushroom: ["Mushrooms? I guess they're okay..."],
    sparks: ["Sparks? I'm not eating that!"],
    berries: ["Berries! Yum, thank you!"],
    prisma: ["Prisma shard? What am I supposed to do with this?"],
    petals: ["Petals? I'm not eating that!"],
    water: ["Water? Thanks, I guess."],
    stardust: ["Stardust? I'm not eating that!"],
    berryPlate: ["Mmm, that berry plate was delicious! I feel completely full now!"],
    mushroomSoup: ["Mushroom soup? Thanks, I suppose."]
  }
};

function showCharacterSpeech(characterName, tokenType) {
  let el = null;
  let img = null;
  let stopTimer = null;
  let startTimer = null;
  let speech = '';
  if (characterName === 'Soap') {
    el = document.getElementById('swariaGeneratorSpeech');
    img = document.getElementById('swariaGeneratorCharacter');
    stopTimer = typeof stopSoapRandomSpeechTimer === 'function' ? stopSoapRandomSpeechTimer : null;
    startTimer = typeof startSoapRandomSpeechTimer === 'function' ? startSoapRandomSpeechTimer : null;
  } else if (characterName === 'Mystic') {
    el = document.getElementById('kitchenSpeechBubble');
    img = document.getElementById('kitchenCharacterImg');
    stopTimer = typeof stopMysticRandomSpeechTimer === 'function' ? stopMysticRandomSpeechTimer : null;
    startTimer = typeof startMysticRandomSpeechTimer === 'function' ? startMysticRandomSpeechTimer : null;
  } else if (characterName === 'Fluzzer') {
    const nectarizeArea = document.getElementById('terrariumNectarizeArea');
    if (nectarizeArea && nectarizeArea.style.display !== 'none') {
      el = document.getElementById('terrariumNectarizeSpeechBubble');
      img = document.getElementById('terrariumNectarizeCharacterImg');
    } else {
      const charCard = document.getElementById('terrariumCharacterCard');
      if (charCard) {
        const imgWrap = charCard.querySelector('.fluzzer-img-wrap');
        if (imgWrap) el = imgWrap.querySelector('#fluzzerSpeech');
      }
      img = document.getElementById('fluzzerImg');
    }
    stopTimer = typeof stopFluzzerRandomSpeechTimer === 'function' ? stopFluzzerRandomSpeechTimer : null;
    startTimer = typeof startFluzzerRandomSpeechTimer === 'function' ? startFluzzerRandomSpeechTimer : null;
  } else if (characterName === 'Vi') {
    el = document.getElementById('viSpeechBubble');
  } else if (characterName === 'Swaria') {
    const hardModeTab = document.getElementById('settingsHardModeTab');
    if (hardModeTab && hardModeTab.style.display !== 'none') {
      el = document.getElementById('hardModeSwariaSpeech');
      img = document.getElementById('hardModeSwariaImg');
    } else {
      el = document.getElementById('swariaSpeech');
      img = document.getElementById('swariaCharacter');
    }
  }
  const lines = characterTokenSpeech[characterName] && characterTokenSpeech[characterName][tokenType];
  if (lines && lines.length > 0) {
    speech = lines[Math.floor(Math.random() * lines.length)];
  } else {
    speech = 'Thank you!';
  }
  if (el) {
    if (characterName === 'Vi') {
      let viText = el.querySelector('#viSpeechText');
      if (!viText) {
        viText = document.createElement('div');
        viText.id = 'viSpeechText';
        el.appendChild(viText);
      }
      viText.textContent = speech;
      el.style.display = 'block';
      setTimeout(() => {
        el.style.display = 'none';
      }, 3500);
    } else {
      el.textContent = speech;
      el.style.display = 'block';
      if (img) {
        if (characterName === 'Soap') {
          img.src = 'assets/icons/soap speech.png';
        } else if (characterName === 'Mystic') {
          img.src = 'assets/icons/chef mystic speech.png';
        } else if (characterName === 'Fluzzer') {
          img.src = 'assets/icons/fluzzer talking.png';
        }
      }
      if (stopTimer) stopTimer();
      setTimeout(() => {
        el.style.display = 'none';
        if (img) {
          if (characterName === 'Soap') {
            img.src = 'assets/icons/soap.png';
          } else if (characterName === 'Mystic') {
            img.src = 'assets/icons/chef mystic.png';
          } else if (characterName === 'Fluzzer') {
            img.src = 'assets/icons/fluzzer.png';
          }
        }
        if (startTimer) startTimer();
      }, 3500);
    }
  }
}

  function showGiveTokenModal(tokenType, characterName) {
    if (tokenType === 'swabucks') {
      alert('Swa bucks cannot be given to characters!');
      return;
    }
    if (tokenType === 'berryPlate' && characterName !== 'Swaria') {
      alert('Berry Plates can only be given to Swaria!');
      return;
    }
    if (tokenType === 'batteries' && characterName !== 'Soap' && characterName !== 'Fluzzer') {
      alert('Batteries can only be given to Soap or Fluzzer!');
      return;
    }
    if (tokenType === 'glitteringPetals' && characterName !== 'Fluzzer') {
      alert('Glittering Petals can only be given to Fluzzer!');
      return;
    }
    if (tokenType === 'chargedPrisma' && characterName !== 'Vi') {
      alert('Charged Prisma can only be given to Vi!');
      return;
    }
    if (tokenType === 'mushroomSoup' && characterName !== 'Mystic' && characterName !== 'Swaria') {
      alert('Mushroom Soup can only be given to Mystic or Swaria!');
      return;
    }
    const modal = document.getElementById('giveTokenModal');
    if (!modal) return;
    const title = document.getElementById('giveTokenModalTitle');
    const img = document.getElementById('giveTokenModalImg');
    const images = window.INGREDIENT_TYPE_IMAGES || {};
    const displayNames = {
      swabucks: 'Swa bucks',
      mushroom: 'Mushroom',
      sparks: 'Sparks',
      berries: 'Berries',
      prisma: 'Prisma Shards',
      petals: 'Petals',
      water: 'Water',
      stardust: 'Stardust',
      berryPlate: 'Berry Plate',
      mushroomSoup: 'Mushroom Soup',
      batteries: 'Batteries',
      glitteringPetals: 'Glittering Petals',
      chargedPrisma: 'Charged Prisma'
    };
    if (characterName === 'Swaria') {
      if (tokenType === 'berryPlate') {
        title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to consume?`;
        img.src = 'assets/icons/berry plate token.png';
      } else {
        title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to consume?`;
        img.src = images[tokenType] || '';
      }
    } else {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to give to ${characterName}?`;
      img.src = images[tokenType] || '';
    }
    img.alt = displayNames[tokenType] || tokenType;
    modal.style.display = 'flex';
    const btn1 = document.getElementById('giveTokenBtn1');
    const btn10 = document.getElementById('giveTokenBtn10');
    const btn100 = document.getElementById('giveTokenBtn100');
    const cancelBtn = document.getElementById('giveTokenCancelBtn');
    const counts = window.kitchenIngredients || {};
    let available = 0;
    if (tokenType === 'swabucks') {
      available = (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0;
    } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'glitteringPetals' || tokenType === 'chargedPrisma') {
      available = (window.state && typeof window.state[tokenType] === 'number') ? window.state[tokenType] : 0;
    } else {
      available = counts[tokenType] || 0;
    }

    function give(amount) {
      if (amount > available) amount = available;
      if (amount === 0) {
        if (typeof window.updateSecretAchievementProgress === 'function') {
          window.updateSecretAchievementProgress('secret9', 1);
        }
        return;
      }
      if (amount < 0) return;
      let questSpeech = null;
      let friendshipAmount = amount;
      if (characterName === 'Soap' && tokenType === 'sparks' && charger && charger.milestones) {
        if (!charger.milestoneQuests) {
          charger.milestoneQuests = {};
        }
        if (!charger.milestoneQuests[3]) {
          charger.milestoneQuests[3] = { required: 10, given: 0, completed: false };
        }
        if (!charger.milestoneQuests[4]) {
          charger.milestoneQuests[4] = { required: 15, given: 0, completed: false };
        }
        if (!charger.milestoneQuests[5]) {
          charger.milestoneQuests[5] = { required: 25, given: 0, completed: false };
        }
        if (!charger.milestoneQuests[6]) {
          charger.milestoneQuests[6] = { required: 50, given: 0, completed: false };
        }
        if (!charger.milestoneQuests[7]) {
          charger.milestoneQuests[7] = { required: 30, given: 0, completed: false };
        }
        if (!charger.milestoneQuests[8]) {
          charger.milestoneQuests[8] = { required: 75, given: 0, completed: false };
        }
        if (typeof state !== 'undefined') {
          if (state.soapChargeQuest.stage === 0 && !charger.milestones[3].unlocked) {
            const quest = charger.milestoneQuests[3];
            if (!quest) {
              return;
            }
            quest.given += amount;
            checkChargerMilestones();
            saveChargerState(); 
            if (charger.milestones[3].unlocked) {
              questSpeech = "Perfect! The fourth effect is now working! If you want to unlock the fifth effect, bring me 15 more sparks!";
            } else {
              questSpeech = `Thanks! I still need ${quest.required - quest.given} more sparks to get the fourth effect working.`;
            }
          } else if (state.soapChargeQuest.stage === 1 && !charger.milestones[4].unlocked) {
            const quest = charger.milestoneQuests[4];
            if (!quest) {
              return;
            }
            quest.given += amount;
            checkChargerMilestones();
            saveChargerState(); 
            if (charger.milestones[4].unlocked) {
              questSpeech = "Excellent! The fifth effect is now working! For the next effect, I'll need 25 more sparks!";
            } else {
              questSpeech = `Thanks! I still need ${quest.required - quest.given} more sparks to get the fifth effect working.`;
            }
          } else if (state.soapChargeQuest.stage === 2 && !charger.milestones[5].unlocked) {
            const quest = charger.milestoneQuests[5];
            if (!quest) {
              return;
            }
            quest.given += amount;
            checkChargerMilestones();
            saveChargerState(); 
            if (charger.milestones[5].unlocked) {
              questSpeech = "Amazing! The sixth effect is now working! For the next effect, I need 50 more sparks!";
            } else {
              questSpeech = `Thanks! I still need ${quest.required - quest.given} more sparks for the sixth effect.`;
            }
          } else if (state.soapChargeQuest.stage === 3 && !charger.milestones[6].unlocked) {
            const quest = charger.milestoneQuests[6];
            if (!quest) {
              return;
            }
            quest.given += amount;
            checkChargerMilestones();
            saveChargerState(); 
            if (charger.milestones[6].unlocked) {
              questSpeech = "Incredible! The seventh effect is now working! For the final effect, I need 1 battery and 30 sparks!";
            } else {
              questSpeech = `Thanks! I still need ${quest.required - quest.given} more sparks for the seventh effect.`;
            }
          } else if (state.soapChargeQuest.stage === 4 && !charger.milestones[7].unlocked) {
            const quest = charger.milestoneQuests[7];
            if (!quest) {
              return;
            }
            quest.given += amount;
            checkChargerMilestones();
            saveChargerState(); 
            if (charger.milestones[7].unlocked) {
              questSpeech = "LEGENDARY! The final effect is now working! For the ultimate effect, I need 75 sparks!";
            } else {
              questSpeech = `Thanks! I still need ${quest.required - quest.given} more sparks for the final effect.`;
            }
          } else if (state.soapChargeQuest.stage === 5 && !charger.milestones[8].unlocked) {
            const quest = charger.milestoneQuests[8];
            if (!quest) {
              return;
            }
            quest.given += amount;
            checkChargerMilestones();
            saveChargerState(); 
            if (charger.milestones[8].unlocked) {
              questSpeech = "TRANSCENDENT! The ultimate effect is now working! All charge effects are truly complete!";
            } else {
              questSpeech = `Thanks! I still need ${quest.required - quest.given} more sparks for the ultimate effect.`;
            }
          } else if (state.soapChargeQuest.stage >= 6) {
            questSpeech = "All charge effects are already unlocked! Thank you for the sparks though!";
          }
        }
      }
      if (characterName === 'Soap' && tokenType === 'batteries' && charger && charger.milestones) {
        if (!charger.milestoneQuests) {
          charger.milestoneQuests = {};
        }
        if (!charger.milestoneQuests[7]) {
          charger.milestoneQuests[7] = { required: 30, given: 0, completed: false, batteryRequired: 1, batteryGiven: 0 };
        }
        if (!charger.milestoneQuests[8]) {
          charger.milestoneQuests[8] = { required: 75, given: 0, completed: false, batteryRequired: 2, batteryGiven: 0 };
        }
        if (typeof state !== 'undefined') {
          if (state.soapChargeQuest.stage === 4 && !charger.milestones[7].unlocked) {
            const quest = charger.milestoneQuests[7];
            if (!quest) {
              return;
            }
            if (quest.batteryGiven < quest.batteryRequired) {
              const batteryContribution = Math.min(amount, quest.batteryRequired - quest.batteryGiven);
              quest.batteryGiven += batteryContribution;
              friendshipAmount -= batteryContribution; 
              checkChargerMilestones();
              saveChargerState(); 
              if (quest.batteryGiven >= quest.batteryRequired && quest.given >= quest.required) {
                questSpeech = "LEGENDARY! Now I have everything I need! The final effect is now working! For the ultimate effect, I need 2 batteries and 75 sparks!";
              } else if (quest.batteryGiven >= quest.batteryRequired) {
                questSpeech = `Perfect! I have the battery I need! I still need ${quest.required - quest.given} more sparks for the final effect.`;
              } else {
                questSpeech = `Thanks! I still need ${quest.batteryRequired - quest.batteryGiven} more ${quest.batteryRequired - quest.batteryGiven === 1 ? 'battery' : 'batteries'} for the final effect.`;
              }
            } else {
              questSpeech = "I already have the battery I need for this effect. Thanks though!";
            }
          } else if (state.soapChargeQuest.stage === 5 && !charger.milestones[8].unlocked) {
            const quest = charger.milestoneQuests[8];
            if (!quest) {
              return;
            }
            if (quest.batteryGiven < quest.batteryRequired) {
              const batteryContribution = Math.min(amount, quest.batteryRequired - quest.batteryGiven);
              quest.batteryGiven += batteryContribution;
              friendshipAmount -= batteryContribution; 
              checkChargerMilestones();
              saveChargerState(); 
              if (quest.batteryGiven >= quest.batteryRequired && quest.given >= quest.required) {
                questSpeech = "TRANSCENDENT! Now I have everything I need! The ultimate effect is now working! All charge effects are truly complete!";
              } else if (quest.batteryGiven >= quest.batteryRequired) {
                questSpeech = `Perfect! I have all the batteries I need! I still need ${quest.required - quest.given} more sparks for the ultimate effect.`;
              } else {
                questSpeech = `Thanks! I still need ${quest.batteryRequired - quest.batteryGiven} more ${quest.batteryRequired - quest.batteryGiven === 1 ? 'battery' : 'batteries'} for the ultimate effect.`;
              }
            } else {
              questSpeech = "I already have all the batteries I need for this effect. Thanks though!";
            }
          } else {
            questSpeech = "Thanks for the batteries! I'll use these to keep the power systems running smoothly!";
          }
        }
      }
      if (characterName === 'Vi' && tokenType === 'prisma' && state.quests && state.quests.viAutoLightGenerator === 'started') {
        if (typeof state.quests.viAutoLightGeneratorProgress !== 'number') {
            state.quests.viAutoLightGeneratorProgress = 0;
        }
        const neededBefore = 15 - state.quests.viAutoLightGeneratorProgress;
        const questContribution = Math.min(amount, neededBefore);
        state.quests.viAutoLightGeneratorProgress += questContribution;
        friendshipAmount -= questContribution;
        if (state.quests.viAutoLightGeneratorProgress >= 15) {
            state.quests.viAutoLightGenerator = 'completed';
            questSpeech = "Thank you, Peachy. I have everything I need. The automatic light collector is now active.";
            if (typeof window.trackViAutoLightQuestCompletion === 'function') {
                window.trackViAutoLightQuestCompletion();
            }
            if (typeof window.activateViAutoRedLightQuest === 'function') {
                window.activateViAutoRedLightQuest();
            }
        } else {
            const neededAfter = 15 - state.quests.viAutoLightGeneratorProgress;
            questSpeech = `Thank you. I still need ${neededAfter} more Prisma Shards${neededAfter > 1 ? 's' : ''}.`;
        }
      }
      if (characterName === 'Vi' && state.quests && state.quests.viAutoRedLightGenerator === 'started') {
        if (!state.quests.viAutoRedLightGeneratorProgress) {
            state.quests.viAutoRedLightGeneratorProgress = 0;
        }
        if (!state.quests.viAutoRedLightGeneratorChargedProgress) {
            state.quests.viAutoRedLightGeneratorChargedProgress = 0;
        }
        if (tokenType === 'prisma') {
            const neededBefore = 40 - state.quests.viAutoRedLightGeneratorProgress;
            const questContribution = Math.min(amount, neededBefore);
            state.quests.viAutoRedLightGeneratorProgress += questContribution;
            friendshipAmount -= questContribution;
        } else if (tokenType === 'chargedPrisma') {
            const neededBefore = 1 - state.quests.viAutoRedLightGeneratorChargedProgress;
            const questContribution = Math.min(amount, neededBefore);
            state.quests.viAutoRedLightGeneratorChargedProgress += questContribution;
            friendshipAmount -= questContribution;
        }
        if (typeof window.updateViQuestDialogue === 'function') {
            setTimeout(() => {
                window.updateViQuestDialogue();
            }, 1000); 
        }
        if (state.quests.viAutoRedLightGeneratorProgress >= 40 && state.quests.viAutoRedLightGeneratorChargedProgress >= 1) {
            state.quests.viAutoRedLightGenerator = 'completed';
            questSpeech = "Excellent work, Peachy! The automatic red light collector is now operational.";
        } else {
            const neededPrisma = 40 - state.quests.viAutoRedLightGeneratorProgress;
            const neededCharged = 1 - state.quests.viAutoRedLightGeneratorChargedProgress;
            let remaining = [];
            if (neededPrisma > 0) remaining.push(`${neededPrisma} more Prisma Shards Token${neededPrisma > 1 ? 's' : ''}`);
            if (neededCharged > 0) remaining.push(`${neededCharged} more Charged Prisma Token`);
            questSpeech = `Thank you. I still need ${remaining.join(' and ')}.`;
        }
      }
      if (tokenType === 'swabucks') {
        window.state.swabucks = available - amount;
      } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'glitteringPetals' || tokenType === 'chargedPrisma') {
        window.state[tokenType] = available - amount;
      } else {
        window.kitchenIngredients[tokenType] = available - amount;
      }
      if (characterName === 'Swaria') {
        if (tokenType === 'berryPlate') {
          if (state.characterHunger && state.characterHunger.swaria !== undefined) {
            state.characterHunger.swaria = 100;
          }
          const tenMinutesMs = 10 * 60 * 1000; 
          if (!window.state) window.state = {};
          window.state.peachyHungerBoost = tenMinutesMs;
          if (typeof window.updateBoostDisplay === 'function') {
            window.updateBoostDisplay();
          }
          const swariaSpeech = document.getElementById('swariaSpeech');
          const swariaImg = document.getElementById('swariaCharacter');
          if (swariaSpeech) {
            swariaSpeech.textContent = "Mmm, that berry plate was delicious! I feel completely full now!";
            swariaSpeech.style.display = "block";
            if (swariaImg) {
              swariaImg.src = getMainCargoCharacterImage(true); 
            }
            setTimeout(() => {
              swariaSpeech.style.display = "none";
              if (swariaImg) {
                swariaImg.src = getMainCargoCharacterImage(false); 
              }
            }, 5000);
          }
        } else {
          if (state.characterHunger && state.characterHunger.swaria !== undefined) {
            const hungerGain = amount * 2;
            const newHunger = Math.min(100, state.characterHunger.swaria + hungerGain);
            const actualGain = newHunger - state.characterHunger.swaria;
            state.characterHunger.swaria = newHunger;
            if (typeof showGainPopup === 'function') {
              showGainPopup("hungerGain", `+${actualGain} Hunger`, "Swaria");
            }
            const swariaSpeech = document.getElementById('swariaSpeech');
            const swariaImg = document.getElementById('swariaCharacter');
            if (swariaSpeech) {
              const tokenName = displayNames[tokenType] || tokenType;
              swariaSpeech.textContent = `Nom nom nom! That ${tokenName} was delicious!`;
              swariaSpeech.style.display = "block";
              if (swariaImg) {
                swariaImg.src = getMainCargoCharacterImage(true); 
              }
              setTimeout(() => {
                swariaSpeech.style.display = "none";
                if (swariaImg) {
                  swariaImg.src = getMainCargoCharacterImage(false); 
                }
              }, 5000);
            }
          }
        }
      }
      if (characterName === 'Mystic') {
        if (tokenType === 'mushroomSoup') {
          const tenMinutesMs = 10 * 60 * 1000; 
          if (!window.state) window.state = {};
          window.state.mysticCookingSpeedBoost = tenMinutesMs;
          if (typeof window.updateBoostDisplay === 'function') {
            window.updateBoostDisplay();
          }
          const mysticSpeech = document.getElementById('mysticSpeech');
          const mysticImg = document.getElementById('mysticCharacter');
          if (mysticSpeech) {
            mysticSpeech.textContent = "This soup is amazing! I feel so energized and ready to cook faster!";
            mysticSpeech.style.display = "block";
            if (mysticImg) {
              mysticImg.src = "assets/icons/chef mystic speech.png";
            }
            setTimeout(() => {
              mysticSpeech.style.display = "none";
              if (mysticImg) {
                mysticImg.src = "assets/icons/chef mystic.png";
              }
            }, 5000);
          }
        }
      }
      if (characterName === 'Soap') {
        if (tokenType === 'batteries') {
          const tenMinutesMs = 10 * 60 * 1000; 
          if (!window.state) window.state = {};
          window.state.soapBatteryBoost = tenMinutesMs;
          if (window.state.powerEnergy !== undefined) {
            window.state.powerEnergy = 100;
          }
          if (typeof window.updateBoostDisplay === 'function') {
            window.updateBoostDisplay();
          }
          const soapSpeech = document.getElementById('soapSpeech');
          const soapImg = document.getElementById('soapCharacter');
          if (soapSpeech) {
            soapSpeech.textContent = "These batteries are perfect! I'll use them to keep the power generator running smoothly!";
            soapSpeech.style.display = "block";
            if (soapImg) {
              soapImg.src = "assets/icons/soap speech.png";
            }
            setTimeout(() => {
              soapSpeech.style.display = "none";
              if (soapImg) {
                soapImg.src = "assets/icons/soap.png";
              }
            }, 5000);
          }
        }
      }
      if (characterName === 'Fluzzer') {
        if (tokenType === 'glitteringPetals') {
          const tenMinutesMs = 10 * 60 * 1000; 
          if (!window.state) window.state = {};
          window.state.fluzzerGlitteringPetalsBoost = tenMinutesMs;
          if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
            window.checkAndUpdateFluzzerSleepState();
          }
          if (typeof window.stopFluzzerAI === 'function' && typeof window.startFluzzerAI === 'function') {
            window.stopFluzzerAI();
            setTimeout(() => {
              if (!window.isFluzzerSleeping) {
                window.startFluzzerAI();
              }
            }, 100);
          }
          if (typeof window.updateBoostDisplay === 'function') {
            window.updateBoostDisplay();
          }
          const fluzzerSpeech = document.getElementById('fluzzerSpeech');
          const fluzzerImg = document.getElementById('fluzzerCharacter');
          if (fluzzerSpeech) {
            fluzzerSpeech.textContent = "These petals are so sparkly! I feel so energized and focused!";
            fluzzerSpeech.style.display = "block";
            if (fluzzerImg) {
              fluzzerImg.src = "assets/icons/fluzzer talking.png";
            }
            setTimeout(() => {
              if (!window.isFluzzerLevelUpSpeaking) {
                fluzzerSpeech.style.display = "none";
                if (fluzzerImg) {
                  fluzzerImg.src = "assets/icons/fluzzer.png";
                }
              }
            }, 5000);
          }
        }
        const nectarizeArea = document.getElementById('terrariumNectarizeArea');
        if (nectarizeArea && nectarizeArea.style.display !== 'none') {
          if (typeof handleNectarizeTokenGiven === 'function') {
            handleNectarizeTokenGiven(tokenType, amount);
          }
        }
      }
      if (friendshipAmount > 0 && characterName !== 'Swaria') {
          const charToDept = {
            'Swaria': 'Cargo',
            'Soap': 'Generator',
            'Mystic': 'Kitchen',
            'Fluzzer': 'Terrarium',
            'Vi': 'Lab'
          };
          const dept = charToDept[characterName];
          let pointsPerToken = 5;
          if (tokenType === 'stardust') {
            pointsPerToken = characterName === 'Mystic' ? 200 : 50;
          } else if (characterTokenPreferences && characterTokenPreferences[characterName]) {
            if (characterTokenPreferences[characterName].likes.includes(tokenType)) {
              pointsPerToken = 20;
            } else if (characterTokenPreferences[characterName].dislikes.includes(tokenType)) {
              pointsPerToken = 1;
            }
          }
          if (dept && window.friendship) {
            window.friendship[dept] = window.friendship[dept] || { level: 0, points: 0 };
            window.friendship[dept].points += pointsPerToken * friendshipAmount;
            if (typeof window.getFriendshipPointsForLevel === 'function') {
              let lvl = window.friendship[dept].level;
              let needed = window.getFriendshipPointsForLevel(lvl);
              while (window.friendship[dept].points >= needed && lvl < (window.MAX_FRIENDSHIP_LEVEL || 15)) {
                window.friendship[dept].points -= needed;
                lvl++;
                needed = window.getFriendshipPointsForLevel(lvl);
              }
              window.friendship[dept].level = lvl;
            }
            if (typeof window.renderDepartmentStatsButtons === 'function') window.renderDepartmentStatsButtons();
            const statsModal = document.getElementById('departmentStatsModal');
            if (statsModal && statsModal.style.display !== 'none') {
              const title = document.getElementById('departmentStatsModalTitle');
              if (title && title.textContent && title.textContent.toLowerCase().includes(dept.toLowerCase())) {
                if (typeof window.showDepartmentStatsModal === 'function') window.showDepartmentStatsModal(dept);
              }
            }
          }
      }
      if (questSpeech && characterName === 'Vi' && typeof window.showViResponse === 'function') {
        setTimeout(() => window.showViResponse(questSpeech), 200);
      } else if (questSpeech && characterName === 'Soap') {
        const soapSpeech = document.getElementById('soapChargerSpeech');
        const soapImg = document.getElementById('soapChargerCharacter');
        if (soapSpeech && soapImg) {
          soapSpeech.textContent = questSpeech;
          soapSpeech.style.display = "block";
          soapImg.src = "assets/icons/soap speech.png";
          setTimeout(() => {
            soapSpeech.style.display = "none";
            soapImg.src = "assets/icons/soap.png";
          }, 8000);
        }
      } else if (typeof showCharacterSpeech === 'function') {
        showCharacterSpeech(characterName, tokenType);
      }
      if (characterName === 'Swaria' && typeof state !== 'undefined' && state.hardModeQuestActive) {
        if (typeof state.hardModeQuestProgress !== 'undefined') {
          if (tokenType === 'berries') {
            state.hardModeQuestProgress.berryTokens += amount;
          } else if (tokenType === 'stardust') {
            state.hardModeQuestProgress.stardustTokens += amount;
          } else if (tokenType === 'berryPlate') {
            state.hardModeQuestProgress.berryPlateTokens += amount;
          } else if (tokenType === 'mushroomSoup') {
            state.hardModeQuestProgress.mushroomSoupTokens += amount;
          }
          if (typeof window.updateHardModeQuestProgress === 'function') {
            window.updateHardModeQuestProgress();
          }
          if (typeof window.saveGame === 'function') {
            window.saveGame();
          }
        }
      }
      if (typeof window.updateInventoryModal === 'function') window.updateInventoryModal();
      if (characterName === 'Swaria' && typeof updateSwariaHungerUI === 'function') {
        updateSwariaHungerUI();
      }
      if (characterName === 'Soap' && (tokenType === 'sparks' || tokenType === 'batteries') && typeof window.updateChargerUI === 'function') {
        window.updateChargerUI();
      }
      modal.style.display = 'none';
    }

    btn1.onclick = () => give(1);
    btn10.onclick = () => give(10);
    btn100.onclick = () => give(100);
let customInput = document.getElementById('giveTokenCustomInput');
let customBtn = document.getElementById('giveTokenCustomBtn');
if (!customInput) {
  customInput = document.createElement('input');
  customInput.type = 'number';
  customInput.min = '0';
  customInput.max = available;
  customInput.value = '1';
  customInput.id = 'giveTokenCustomInput';
  customInput.style.margin = '0.5em 0.5em 0.5em 0';
  customInput.style.width = '60px';
  customBtn = document.createElement('button');
  customBtn.textContent = 'Give Custom Amount';
  customBtn.id = 'giveTokenCustomBtn';
  customBtn.style.margin = '0.5em 0';
  cancelBtn.parentNode.insertBefore(customInput, cancelBtn);
  cancelBtn.parentNode.insertBefore(customBtn, cancelBtn);
}
customInput.max = available;
customInput.value = '1';
customInput.style.display = '';
customBtn.style.display = '';
customBtn.onclick = function() {
  let val = parseInt(customInput.value, 10);
  if (isNaN(val)) val = 1;
  if (val < 0) val = 0;
  if (val > available) val = available;
  give(val);
};
    cancelBtn.onclick = () => { modal.style.display = 'none'; };
  }

  function renderInventoryTokens() {
    const container = document.getElementById('inventoryTokens');
    if (!container) return;
    container.innerHTML = '';
    const types = [
      { name: 'swabucks', display: 'Swa bucks' }, 
      { name: 'berries', display: 'Berries' },
      { name: 'mushroom', display: 'Mushroom' },
      { name: 'sparks', display: 'Sparks' },
      { name: 'petals', display: 'Petals' },
      { name: 'water', display: 'Water' },
      { name: 'prisma', display: 'Prisma Shard' },
      { name: 'stardust', display: 'Stardust' }, 
      { name: 'berryPlate', display: 'Berry Plate', icon: 'assets/icons/berry plate token.png', isBerryPlate: true },
      { name: 'mushroomSoup', display: 'Mushroom Soup', icon: 'assets/icons/mushroom soup token.png', isCookingItem: true },
      { name: 'batteries', display: 'Batteries', icon: 'assets/icons/battery token.png', isCookingItem: true },
      { name: 'glitteringPetals', display: 'Glittering Petals', icon: 'assets/icons/glittering petal token.png', isCookingItem: true },
      { name: 'chargedPrisma', display: 'Charged Prisma', icon: 'assets/icons/charged prism token.png', isCookingItem: true }
    ];
    const images = window.INGREDIENT_TYPE_IMAGES || {};
    const counts = window.kitchenIngredients || {};
    types.forEach(function(type) {
      let tokenCount = 0;
      if (type.isBerryPlate) {
        tokenCount = (window.state && typeof window.state.berryPlate === 'number') ? window.state.berryPlate : 0;
      } else if (type.isCookingItem) {
        tokenCount = (window.state && typeof window.state[type.name] === 'number') ? window.state[type.name] : 0;
      } else if (type.name === 'swabucks') {
        tokenCount = (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0;
      } else {
        tokenCount = counts[type.name] || 0;
      }
      if (!tokenCount) return;
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.minWidth = '70px';
      const img = document.createElement('img');
      if (type.isBerryPlate || type.isCookingItem) {
        img.src = type.icon;
      } else {
        img.src = images[type.name] || '';
      }
      img.alt = type.display;
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.marginBottom = '0.5em';
      img.style.cursor = type.name === 'swabucks' ? 'not-allowed' : 'grab';
      img.draggable = false;
      if (type.name === 'berryPlate') {
        img.addEventListener('mouseenter', function() {
          showInventoryDescription('Fully restores hunger and grants 10 minutes of full status');
        });
        img.addEventListener('mouseleave', function() {
          hideInventoryDescription();
        });
      }
      if (type.name === 'mushroomSoup') {
        img.addEventListener('mouseenter', function() {
          showInventoryDescription('Given to Mystic will make cooking 1.5X faster for 10 minutes');
        });
        img.addEventListener('mouseleave', function() {
          hideInventoryDescription();
        });
      }
      if (type.name === 'batteries') {
        img.addEventListener('mouseenter', function() {
          showInventoryDescription('Given to Soap will make the power generator run for 10 minutes without losing power (paused during the night)');
        });
        img.addEventListener('mouseleave', function() {
          hideInventoryDescription();
        });
      }
      if (type.name === 'glitteringPetals') {
        img.addEventListener('mouseenter', function() {
          showInventoryDescription('Given to Fluzzer will make Fluzzer work faster for 10 minutes');
        });
        img.addEventListener('mouseleave', function() {
          hideInventoryDescription();
        });
      }
      if (type.name === 'chargedPrisma') {
        img.addEventListener('mouseenter', function() {
          showInventoryDescription('Given to Vi will (WIP)');
        });
        img.addEventListener('mouseleave', function() {
          hideInventoryDescription();
        });
      }
      if (type.name !== 'swabucks') {
        let isDragging = false;
        let dragReady = false;
        let startX, startY, origRect, offsetX, offsetY;
        let placeholder = null;
        let origParent = null;
        let origNext = null;
        let holdTimeout = null;
        let mouseMoved = false;
        let modal = null;
        let modalRect = null;
        img.addEventListener('mousedown', function(e) {
          e.preventDefault();
          dragReady = false;
          mouseMoved = false;
          startX = e.clientX;
          startY = e.clientY;
          modal = document.getElementById('inventoryModal');
          modalRect = modal.getBoundingClientRect();
          window._draggingToken = false;
          window._draggingTokenType = null;
          holdTimeout = setTimeout(() => {
            dragReady = true;
            isDragging = true;
            window._draggingToken = true;
            window._draggingTokenType = type.isBerryPlate ? 'berryPlate' : type.name;
            img.classList.add('dragging-token');
            img.style.cursor = 'grabbing';
            origRect = img.getBoundingClientRect();
            offsetX = startX - origRect.left;
            offsetY = startY - origRect.top;
            origParent = img.parentNode;
            origNext = img.nextSibling;
            img.style.position = 'absolute';
            img.style.left = (origRect.left - modalRect.left) + 'px';
            img.style.top = (origRect.top - modalRect.top) + 'px';
            img.style.zIndex = 999999;
            img.style.transition = 'none';
            modal.appendChild(img);
            placeholder = document.createElement('div');
            placeholder.style.width = '48px';
            placeholder.style.height = '48px';
            div.insertBefore(placeholder, div.firstChild);
            document.body.classList.add('no-select');
            setupCharacterDropTargets();
          }, 200);

          function onMove(ev) {
            if (!dragReady) {
              if (Math.abs(ev.clientX - startX) > 6 || Math.abs(ev.clientY - startY) > 6) {
                mouseMoved = true;
                clearTimeout(holdTimeout);
                cleanup();
              }
              return;
            }
            if (!isDragging) return;
            img.style.left = (ev.clientX - modalRect.left - offsetX) + 'px';
            img.style.top = (ev.clientY - modalRect.top - offsetY) + 'px';
          }

          function onUp(ev) {
            clearTimeout(holdTimeout);
            if (!dragReady) {
              cleanup();
              return;
            }
            isDragging = false;
            window._draggingToken = false;
            window._draggingTokenType = null;
            img.classList.remove('dragging-token');
            img.style.cursor = 'grab';
            img.style.transition = 'left 0.3s, top 0.3s';
            img.style.left = (origRect.left - modalRect.left) + 'px';
            img.style.top = (origRect.top - modalRect.top) + 'px';
            setTimeout(() => {
              img.style.position = '';
              img.style.left = '';
              img.style.top = '';
              img.style.zIndex = '';
              img.style.transition = '';
              if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
              }
              if (origNext && origNext.parentNode === div) {
                div.insertBefore(img, origNext);
              } else {
                div.insertBefore(img, div.firstChild);
              }
            }, 300);
            document.body.classList.remove('no-select');
            cleanup();
          }

          function cleanup() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          }

          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }
      div.appendChild(img);
      const countSpan = document.createElement('span');
      countSpan.style.fontSize = '1.1em';
      countSpan.style.fontWeight = 'bold';
      countSpan.style.color = '#222';
      countSpan.textContent = tokenCount;
      div.appendChild(countSpan);
      const labelSpan = document.createElement('span');
      labelSpan.style.fontSize = '0.95em';
      labelSpan.style.color = '#666';
      labelSpan.textContent = type.display;
      div.appendChild(labelSpan);
      container.appendChild(div);
    });
  }
  if (inventoryBtn && inventoryModal) {
    inventoryBtn.addEventListener('click', function(e) {
      inventoryOpen = !inventoryOpen;
      if (inventoryOpen) {
        renderInventoryTokens();
        inventoryModal.style.display = 'flex';
      } else {
        inventoryModal.style.display = 'none';
      }
    });
  }
  window.updateInventoryModal = function() {
    if (inventoryOpen) renderInventoryTokens();
  };
  [
    'home',
    'generatorSubTabBtn',
    'kitchenSubTabBtn',
    'terrariumTab',
    'prismSubTabBtn',
    'settingsHardModeTabBtn'
  ].forEach(tabId => {
    const tab = document.getElementById(tabId);
    if (tab) {
      tab.addEventListener('click', () => setTimeout(setupCharacterDropTargets, 100));
    }
  });
  setupCharacterDropTargets();
});
if (typeof activateViAutoLightQuest === 'function') {
  activateViAutoLightQuest();
}
