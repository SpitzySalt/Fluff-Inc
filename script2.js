// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file
// Script2 is a continuation of script.js

// Helper function to get the appropriate fluzzer image based on infinity total
function getFluzzerImagePath(imageType = 'normal') {
  const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 3;
  
  if (!hasInfinityUnlock) {
    // Return original images
    switch (imageType) {
      case 'talking': return 'assets/icons/fluzzer talking.png';
      case 'sleeping': return 'assets/icons/fluzzer sleeping.png';  
      case 'sleep_talking': return 'assets/icons/fluzzer sleep talking.png';  
      default: return 'assets/icons/fluzzer.png';
    }
  } else {
    // Return enhanced images for 3+ total infinity
    switch (imageType) {
      case 'talking': return 'assets/icons/fluzzer talking 1.png';
      case 'sleeping': return 'assets/icons/fluzzer sleeping 1.png';
      case 'sleep_talking': return 'assets/icons/fluzzer sleep talking 1.png';
      default: return 'assets/icons/fluzzer 1.png';
    }
  }
}

// Hides the Boutique tab button if the player is on floor 2























































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
  { text: "Huh, prisms? Vi told me to just gather the white light the prism makes while they are researching on discovering new lights.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(2),},
  { text: "The prism can only create white light at the moment.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(2),},
  { text: "I wonder how Soap is doing. They rarely come out of the generator room.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "The Swaboratory is where I go to experiment with prisms.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I will never run out of boxes!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I smell the scent of soap while standing in front of the generator room.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "So.. Why do I need to relearn every Swalements every time we expand? I wish I kept my knowledge points...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I know there's a secret room in the facility's basement, but its Swalways locked... Only the boss can enter it.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I don't really like going to the Swaboratory, its too flashy for me, and colorful.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "The boss of this facility is actually really nice, Swaltough I've never met them yet.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "There's Swactually someone else working in the prism lab named Vi, They seem shy, but nice.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "Is it just me or does it smell like chlorine inside the prism lab?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "OMG MY KP IS GONE!!! NOOOOO!!! THE SWA ELITES TOOK THEM SWALL!!!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "How come Vi can handle the prism lab? I'm so jealous.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I don't know why but I feel a strange feeling when discovering new Swalements...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
  { text: "Swanother factory expansion, there goes my kp again...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
  { text: "So... The swa elites now wants feathers?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
  { text: "Oh, the prism now creates red light!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(4),},
  { text: "It's so quiet at night... I can hear the boxes breathing.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "Sometimes I wonder if the boxes dream when it's dark.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "God dammit I need to use my flashlight now!", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "Real ones never sleeps.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "Do you ever get the feeling the boxes Sware watching you at night?", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); }  },
  { text: "I once saw a box open itself. Swunbelievable!", condition: () => true },
  { text: "Swadventure awaits those who swenter the Swaboratory!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2), },
  { text: "Swimagine if all the boxes started swarguing about who gets opened first.", condition: () => true },
  { text: "Swunexpected things happen when you swactivate too many prisms at once.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2), },
  { text: "Swawesome! I just found a box full of swartifacts!", condition: () => true },
  { text: "I like to swobserve the boxes in their natural habitat.", condition: () => true },
  { text: "Swultimate box opening technique: hold down the swenter key!", condition: () => true },
  { text: "Never ignore a token.", condition: () => true },
  { text: "Swexperimenting is my favorite part of the job!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7),},
  { text: "Swoccasionally, I get lost in the swendless rows of boxes.", condition: () => true },
  { text: "Swalways remember to swappreciate the little things!", condition: () => true },
  { text: "Don't swunderestimate the power of friendship!", condition: () => true },
  { text: "I am swimply better than the swelites!", condition: () => true },
  { text: "This facility is getting more poppulated with friends.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(6), },
  { text: "Even during the night, the prism lab is still too flashy for my eyes, but its not as bad as day time.", condition: () => { if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); const isNight = (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); return isNight && DecimalUtils.isDecimal(state.grade) && state.grade.gte(3);} },
  { text: "I looked into the swinfinity fluff... and the swinfinity fluff looked back.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Swimply put, swinfinity fluff is not for the faint of fluff.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Swadmit it, you’ve heard the whispers from the swinfinity fluff too, right? That thing is terrifying.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Never try to count swinfinity fluff. I lost track... and maybe my mind.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Day I forgot. We discovered swinfinity fluff. Send help.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "If you see a box labeled ‘∞’, just walk away. Trust me.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Don’t try to sweep swinfinity fluff under the rug. It never ends.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Swadmit it, you’re a little scared of swinfinity fluff too.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(7) },
  { text: "Swadly, I can't eat boxes, but I can swatch them all day!", condition: () => true },
  { text: "Swimply put, my favorite number is 727. Swat's yours?", condition: () => true },
  { text: "Swoccasionally, I try to teach the boxes how to dance. Results: swonderful!", condition: () => true },
  { text: "Never trust a box with sunglasses.", condition: () => true },
  { text: "I've tried to stack boxes higher than the ceiling. It did not go swell", condition: () => true },
  { text: "If you see a box moving on its own, just wave and say hi!", condition: () => true },
  { text: "Don’t let Vi catch me eating snacks in the prism lab.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2), },
  { text: "If you hear giggling from the terrarium, it’s probably Fluzzer destroying the flower field.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(6), },
  { text: "Always bring a flashlight. Swust in case.", condition: () => true },
  { text: "If you see a prism spinning, don’t touch it. Swrisky!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2), },
  { text: "I've named at least one box. Its name is Boxy. I like Boxy.", condition: () => true },
  { text: "One day, I’ll find the legendary golden box.", condition: () => true },
  { text: "Don’t try to outsmart Soap. He’s got bubbles for brains!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2), },
  
  // Anomaly-related quotes (only appear after doing an infinity reset at least once)
  { text: "Ever since the swinfinity reset, things have been... swardly different around here.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I keep hearing strange noises coming from the walls. Is that normal?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomaly resolver that the Swa elites gave us is really swhelpful to get rid of swanomalies.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Sometimes I see boxes flickering in and out of existence. Swat's up with that?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The fabric of reality seems a bit torn lately. Is it just me?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I swaw something moving in the corner of my eye, but when I looked, nothing was there...", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Ever since we broke through swinfinity, weird things have been happening. Coincidence? I think not!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I found a box that wasn't there a minute ago. Swanomalies are real!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The Swa elites warned us about these 'fluctations in reality'. I thought they were just being dramatic.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I tried to use the anomaly resolver on myself. Turns out I'm 1% swanomalous. Is that bad?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Reality is swacting up again. Time to get the swanomaly resolver!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I swear the facility layout changed when I wasn't looking. These swanomalies are getting out of hand!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The swanomaly resolver is my new favorite gadget. It's like a tv remote, to get rid of swanomalies.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Reaching swinfinity apparently broke reality too. Whoops!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I found an swanomaly that looked exactly like a box, but when I touched it, my wing went right through. Spooky!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The Swa elites said swanomalies affect production. I must be on the lookout for any swanomalies in the factory.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
];

// Make swaria-related variables globally accessible
window.swariaImage = swariaImage;
window.swariaSpeech = swariaSpeech;
window.swariaQuotes = swariaQuotes;

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

// Make key script2 functions globally accessible
window.showSwariaSpeech = showSwariaSpeech;
window.showSwariaPrismSpeech = showSwariaPrismSpeech;
window.showInventoryDescription = showInventoryDescription;
window.hideInventoryDescription = hideInventoryDescription;
window.updateElementTileVisual = updateElementTileVisual;
window.capitalize = capitalize;

window.swariaSpeechInterval = setInterval(() => {
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

window.secondaryTickInterval = setInterval(() => {
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
}, 100); 

function testRegalBackground() {
  document.body.classList.add('regal-bg');
  document.documentElement.classList.add('regal-bg');
}

function unlockGraduationForTesting() {
  document.getElementById("graduationSubTabBtn").style.display = "inline-block";
  document.getElementById("knowledgeSubTabNav").style.display = "flex";
  
  // Use proper unlock logic instead of bypassing it
  if (typeof checkInfinityResearchUnlock === 'function') {
    checkInfinityResearchUnlock();
  }
}

// Development function to test infinity research
function unlockInfinityResearchForTesting() {
  // Set the proper unlock flag instead of bypassing the system
  const unlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
  localStorage.setItem(unlockKey, 'true');
  
  // Then run the proper unlock check
  if (typeof checkInfinityResearchUnlock === 'function') {
    checkInfinityResearchUnlock();
  }
  
  document.getElementById("knowledgeSubTabNav").style.display = "flex";
  console.log('[INFINITY] Infinity Research tab unlocked for testing');
}

window.testRegalBackground = testRegalBackground;
window.unlockGraduationForTesting = unlockGraduationForTesting;

function testElement9() {
  swariaKnowledge.kp = 2000000;
  tryBuyElement(9);
  switchHomeSubTab('generatorMainTab');
}

window.testElement9 = testElement9;

function updateGeneratorUpgradesUI() {
  if (!boughtElements[9]) return;
  const boxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
  boxTypes.forEach(type => {
    const upgradeLevel = generatorUpgrades[type] || new Decimal(0);
    const upgradeLevelDecimal = DecimalUtils.isDecimal(upgradeLevel) ? upgradeLevel : new Decimal(upgradeLevel);
    const cost = getGeneratorUpgradeCost(type);
    // Ensure boxesProducedByType value is a Decimal
    if (!DecimalUtils.isDecimal(state.boxesProducedByType[type])) {
      state.boxesProducedByType[type] = new Decimal(state.boxesProducedByType[type] || 0);
    }
    const canAfford = state.boxesProducedByType[type].gte(cost);
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
  const baseCost = new Decimal(25); 
  const level = generatorUpgrades[type] || new Decimal(0);
  return baseCost.mul(new Decimal(5).pow(level)).floor();
}

function buyGeneratorUpgrade(type) {
  const cost = getGeneratorUpgradeCost(type);
  if (state.boxesProducedByType[type].lt(cost)) return;
  state.boxesProducedByType[type] = state.boxesProducedByType[type].sub(cost);
  generatorUpgrades[type] = (generatorUpgrades[type] || new Decimal(0)).add(1);
  
  // Keep window reference synced
  if (window.generatorUpgrades) {
    window.generatorUpgrades[type] = generatorUpgrades[type];
  }
  
  updateUI();
  updateGeneratorUpgradesUI();
}

function calculatePowerGeneratorCap() {
  let baseCap = new Decimal(100);
  if (state.grade.gte(2)) {
    baseCap = baseCap.add(state.grade.sub(1).mul(20));
  }
  return baseCap;
}

function tickPowerGenerator(diff) {
  // Tick Soap's auto recharge system
  tickAutoRechargeSystem(diff);
  
  const hasBatteryProtection = window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0;
  if (window.isTabHidden && !hasBatteryProtection) return;
  const newMaxEnergy = calculatePowerGeneratorCap();
  if (!state.powerMaxEnergy.eq(newMaxEnergy)) {
    state.powerMaxEnergy = newMaxEnergy;
    if (state.powerEnergy.gt(state.powerMaxEnergy)) {
      state.powerEnergy = state.powerMaxEnergy;
    }
  }
  const oldPowerEnergy = state.powerEnergy; 
  if (state.powerStatus === 'online' && state.powerEnergy.gt(0)) {
    if (!hasBatteryProtection) {
      state.powerEnergy = DecimalUtils.max(0, state.powerEnergy.sub(new Decimal(diff).div(5))); 
    } else {
    }
    if (state.powerEnergy.lte(50) && !state.soapRefillUsed && oldPowerEnergy.gt(50)) {
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
    if (state.powerEnergy.gt(50)) {
      state.soapRefillUsed = false;
    }
    if (state.powerEnergy.lte(0)) {
      state.powerStatus = 'offline';
      showPowerOfflineMessage();
    }
  }
  updatePowerGeneratorUI();
}

function updatePowerGeneratorUI() {
  // Ensure powerEnergy is a Decimal
  if (!DecimalUtils.isDecimal(state.powerEnergy)) {
    state.powerEnergy = new Decimal(state.powerEnergy || 0);
  }
  if (!DecimalUtils.isDecimal(state.powerMaxEnergy)) {
    state.powerMaxEnergy = new Decimal(state.powerMaxEnergy || 100);
  }
  
  // Check if we need to render the auto recharge UI (if it doesn't exist yet)
  const existingAutoRecharge = document.querySelector('.auto-recharge-system');
  const config = getSoapAutoRechargeConfig();
  const shouldHaveAutoRecharge = !!config;
  
 
  
  if (shouldHaveAutoRecharge && !existingAutoRecharge) {
    console.log('🔄 Auto recharge UI missing, re-rendering power generator...');
    renderPowerGenerator();
    return; // renderPowerGenerator calls updatePowerGeneratorUI at the end
  }
  
  const powerBar = document.getElementById('powerEnergyBar');
  const powerStatus = document.getElementById('powerStatus');
  const powerEnergy = document.getElementById('powerEnergy');
  const rechargeBtn = document.getElementById('powerRechargeBtn');
  if (powerBar) {
    const percentage = state.powerEnergy.div(state.powerMaxEnergy).mul(100).toNumber();
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
    powerEnergy.textContent = `${state.powerEnergy.floor()}/${state.powerMaxEnergy}`;
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
  
  // Update auto recharge display if enabled
  updateAutoRechargeDisplay();
}

// Soap's auto recharge system functions

function getSoapAutoRechargeConfig() {
  // Check if Soap has level 4+ friendship - try multiple access methods
  let level = 0;
  
  if (window.friendship && window.friendship.Generator) {
    level = window.friendship.Generator.level || 0;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    level = friendship.Generator.level || 0;
  }
  
  if (level < 4) {
    return null;
  }
  
  const timerMinutes = Math.max(1, 10 - (level - 4)); // Decreases by 1 minute per level above 4, minimum 1 minute
  const maxStorage = 3 + Math.floor((level - 4) / 2); // +1 every 2 levels above 4
  
  return {
    timerMs: timerMinutes * 60 * 1000, // Convert minutes to milliseconds
    maxStorage: maxStorage,
    active: true
  };
}

function tickAutoRechargeSystem(deltaTime) {
  const config = getSoapAutoRechargeConfig();
  if (!config) return; // System not unlocked
  
  // Initialize auto recharge state if needed
  if (!state.soapAutoRecharge) {
    state.soapAutoRecharge = {
      timer: config.timerMs,
      storage: 0,
      lastTick: Date.now()
    };
    return;
  }
  
  // Update timer
  state.soapAutoRecharge.timer -= deltaTime * 1000; // deltaTime is in seconds, convert to ms
  
  // If timer reaches 0, generate auto recharge
  if (state.soapAutoRecharge.timer <= 0) {
    if (state.soapAutoRecharge.storage < config.maxStorage) {
      state.soapAutoRecharge.storage++;
      console.log(`🔋 Soap generated auto recharge! Storage: ${state.soapAutoRecharge.storage}/${config.maxStorage}`);
    }
    // Reset timer
    state.soapAutoRecharge.timer = config.timerMs;
  }
  
  // Check if auto recharge should trigger
  if (state.soapAutoRecharge.storage > 0 && state.powerEnergy.lt(20)) {
    // Use one auto recharge
    state.soapAutoRecharge.storage--;
    state.powerEnergy = state.powerMaxEnergy;
    state.powerStatus = 'online';
    
    
    // Show notification
    showAutoRechargeNotification();
  }
}

function showAutoRechargeNotification() {
  const notification = document.createElement('div');
  notification.className = 'auto-recharge-notification';
  notification.innerHTML = `
    <div class="auto-recharge-content">
      <h3>Auto Recharge Activated!</h3>
      <p>Soap's auto recharge system restored power to maximum!</p>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideInRight 0.5s ease-out;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.5s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }
  }, 3000);
}

function updateAutoRechargeDisplay() {
  const config = getSoapAutoRechargeConfig();
  const timerElement = document.getElementById('autoRechargeTimer');
  const storageElement = document.getElementById('autoRechargeStorage');
  
  if (!config || !timerElement || !storageElement) return;
  
  // Initialize auto recharge state if needed
  if (!state.soapAutoRecharge) {
    state.soapAutoRecharge = {
      timer: config.timerMs,
      storage: 0,
      lastTick: Date.now()
    };
  }
  
  // Update timer display
  const minutes = Math.floor(state.soapAutoRecharge.timer / 60000);
  const seconds = Math.floor((state.soapAutoRecharge.timer % 60000) / 1000);
  timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Update storage display
  storageElement.textContent = `${state.soapAutoRecharge.storage}/${config.maxStorage}`;
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
  // Show prism grid after power is restored
  if (typeof window.initPrism === 'function') {
    window.initPrism();
  }
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
  }, 2000);
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
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function renderPowerGenerator() {
  console.log('🎯 RENDER DEBUG: Starting renderPowerGenerator...');
  console.log('🎯 RENDER DEBUG: Function is deprecated - delegating to main renderGenerators...');
  
  // Instead of creating a duplicate, just call the main renderGenerators function
  // which now handles both the base generator and the Mk.2 upgrade
  if (typeof renderGenerators === 'function') {
    renderGenerators();
    return;
  }
  
  console.log('🎯 RENDER DEBUG: Main renderGenerators not available, skipping duplicate creation...');
  
  // The main renderGenerators function now handles all power generator rendering
  // including the Mk.2 upgrade when Soap's friendship level reaches 4+
  updatePowerGeneratorUI();
}

// Debug functions for Soap's auto recharge system
window.testSoapAutoRecharge = function() {
  console.log('=== SOAP AUTO RECHARGE SYSTEM TEST ===');
  console.log('Friendship Generator Level:', window.friendship?.Generator?.level || 'Not found');
  
  const config = getSoapAutoRechargeConfig();
  if (!config) {
    console.log('❌ Auto recharge system not unlocked (requires Soap friendship level 4+)');
    return;
  }
  
  console.log('✅ Auto recharge system config:', config);
  console.log('Current state:', state.soapAutoRecharge);
  console.log('Current power energy:', state.powerEnergy.toString());
  
  // Simulate low power to test auto recharge
  if (state.soapAutoRecharge.storage > 0) {
    console.log('🔋 Simulating low power (setting to 15)...');
    state.powerEnergy = new Decimal(15);
    console.log('Auto recharge should trigger automatically!');
  } else {
    console.log('📦 No auto recharge stored. Adding one for testing...');
    state.soapAutoRecharge.storage = 1;
    console.log('Now run the test again to see auto recharge in action!');
  }
  console.log('=== END TEST ===');
};

// Test function for Power Generator Mk.2 upgrade system
window.testPowerGeneratorMk2 = function() {
  console.log('=== POWER GENERATOR MK.2 UPGRADE TEST ===');
  
  // Check current friendship level
  let soapLevel = 0;
  if (window.friendship && window.friendship.Generator) {
    soapLevel = window.friendship.Generator.level || 0;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    soapLevel = friendship.Generator.level || 0;
  }
  
  console.log(`Current Soap friendship level: ${soapLevel}`);
  
  const isMk2 = soapLevel >= 4;
  console.log(`Mk.2 upgrade ${isMk2 ? 'ACTIVE' : 'INACTIVE'} (requires level 4+)`);
  
  // Check if there are duplicate power generators
  const powerGenerators = document.querySelectorAll('.power-generator');
  console.log(`Number of power generator elements: ${powerGenerators.length}`);
  
  if (powerGenerators.length > 1) {
    console.log('⚠️ WARNING: Multiple power generators detected!');
    powerGenerators.forEach((gen, index) => {
      console.log(`Generator ${index + 1}:`, gen.className, gen.parentElement?.className);
    });
  } else if (powerGenerators.length === 1) {
    console.log('✅ Only one power generator found - good!');
    const generator = powerGenerators[0];
    const title = generator.querySelector('h3')?.textContent;
    console.log(`Generator title: "${title}"`);
    // Check for Mk.2 styling (background color and border)
    const hasMk2Background = generator.style.cssText.includes('#181D36');
    const hasBlueBorder = generator.style.cssText.includes('rgba(33, 150, 243');
    const hasMk2Styling = hasMk2Background && hasBlueBorder;
    console.log(`Has Mk.2 background (#181D36): ${hasMk2Background}`);
    console.log(`Has blue border: ${hasBlueBorder}`);
    console.log(`Has complete Mk.2 styling: ${hasMk2Styling}`);
    
    if (isMk2 && !hasMk2Styling) {
      console.log('❌ Expected Mk.2 styling but not found');
    } else if (!isMk2 && hasMk2Styling) {
      console.log('❌ Found Mk.2 styling but level too low');
    } else {
      console.log('✅ Generator styling matches friendship level');
    }
    
    // Check that auto recharge is green (not blue)
    const autoRechargeSection = generator.querySelector('.auto-recharge-system');
    if (autoRechargeSection) {
      const isGreenAutoRecharge = autoRechargeSection.style.background.includes('76, 175, 80');
      console.log(`Auto recharge section is green: ${isGreenAutoRecharge}`);
      if (!isGreenAutoRecharge) {
        console.log('❌ Auto recharge should be green');
      } else {
        console.log('✅ Auto recharge correctly uses green theme');
      }
    }
  } else {
    console.log('❌ No power generator found');
  }
  
  // Test buff description
  if (typeof getFriendshipBuffs === 'function') {
    const buffs = getFriendshipBuffs('Generator', soapLevel);
    console.log('Current Generator buffs:');
    Object.keys(buffs).forEach(level => {
      console.log(`  Level ${level}: ${buffs[level]}`);
    });
  }
  
  console.log('=== END TEST ===');
};

// Force set Soap friendship level for testing Mk.2 upgrade
window.forceSoapLevelForMk2Test = function(targetLevel) {
  if (!window.friendship) {
    console.log('Friendship system not initialized');
    return;
  }
  
  const oldLevel = window.friendship.Generator.level || 0;
  window.friendship.Generator.level = targetLevel;
  console.log(`Soap friendship level changed from ${oldLevel} to ${targetLevel}`);
  
  // Re-render generators to see the change
  if (typeof renderGenerators === 'function') {
    renderGenerators();
    console.log('Generators re-rendered');
  }
  
  // Run the test
  window.testPowerGeneratorMk2();
};

window.debugSoapAutoRecharge = function() {
  console.log('=== SOAP AUTO RECHARGE DEBUG ===');
  console.log('System state:', state.soapAutoRecharge);
  console.log('Config:', getSoapAutoRechargeConfig());
  console.log('Timer remaining (minutes):', (state.soapAutoRecharge?.timer || 0) / 60000);
  console.log('Current power:', state.powerEnergy.toString());
  console.log('=== END DEBUG ===');
};

// Test function for ENHANCED Box Generator Mk.2 system
window.testBoxGeneratorMk2 = function() {
  console.log('=== ENHANCED BOX GENERATOR MK.2 TEST ===');
  
  // Check friendship level
  let soapLevel = 0;
  if (window.friendship && window.friendship.Generator) {
    soapLevel = window.friendship.Generator.level || 0;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    soapLevel = friendship.Generator.level || 0;
  }
  
  console.log('Current Soap friendship level:', soapLevel);
  console.log('Box Generator Mk.2 active:', soapLevel >= 10);
  
  // Check generators state
  console.log('Box generators state:');
  generators.forEach((gen, i) => {
    console.log(`  ${gen.name}: unlocked=${gen.unlocked}, progress=${gen.progress.toFixed(2)}%, speed=${gen.speed.toFixed(2)}, upgrades=${gen.upgrades}`);
  });
  
  // Check if Mk.2 elements exist in DOM
  const mk2Generator = document.querySelector('.mk2-box-generator');
  const mk2Tracker = document.querySelector('.mk2-tracker');
  const mk2ProgressBar = document.getElementById('progress-mk2');
  const rainbowIcon = document.querySelector('.rainbow-effect');
  const megaRow = document.querySelector('.mk2-mega-row');
  const upgradeButtons = document.querySelectorAll('.mk2-box-generator button');
  
  console.log('DOM elements:');
  console.log('  Mk.2 generator wrapper:', mk2Generator ? 'Found' : 'Not found');
  console.log('  Mk.2 mega row:', megaRow ? 'Found' : 'Not found');
  console.log('  Upgrade buttons count:', upgradeButtons.length);
  console.log('  Mk.2 tracker:', mk2Tracker ? 'Found' : 'Not found');
  console.log('  Mk.2 progress bar:', mk2ProgressBar ? 'Found' : 'Not found');
  console.log('  Rainbow effect icon:', rainbowIcon ? 'Found' : 'Not found');
  
  // Check total boxes produced
  let totalBoxes = new Decimal(0);
  generators.forEach(gen => {
    if (gen.unlocked && state.boxesProducedByType && state.boxesProducedByType[gen.reward]) {
      const boxCount = DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward]) 
        ? state.boxesProducedByType[gen.reward] 
        : new Decimal(state.boxesProducedByType[gen.reward] || 0);
      totalBoxes = totalBoxes.add(boxCount);
      console.log(`  ${gen.reward} boxes:`, boxCount.toString());
    }
  });
  console.log('Total boxes produced:', totalBoxes.toString());
  
  // Test buff description
  if (typeof getFriendshipBuffs === 'function') {
    const buffs = getFriendshipBuffs('Generator', soapLevel);
    console.log('Current Generator buffs:');
    buffs.forEach(buff => {
      console.log(`  Level ${buff.unlockLevel}: ${buff.text} (${buff.unlocked ? 'unlocked' : 'locked'})`);
    });
  }
  
  // Check enhanced features
  if (soapLevel >= 10) {
    console.log('Enhanced Mk.2 features:');
    console.log('  Rainbow effect active:', !!rainbowIcon);
    console.log('  Generator wrapper size:', mk2Generator ? `${mk2Generator.style.minWidth}` : 'N/A');
    console.log('  Upgrade buttons working:', upgradeButtons.length > 0);
    console.log('  Element 9 unlocked (double upgrades):', !!boughtElements[9]);
    console.log('  Element 11 unlocked (boost display):', !!boughtElements[11]);
    
    // Check CSS animations
    if (rainbowIcon) {
      const computedStyle = window.getComputedStyle(rainbowIcon);
      console.log('  Rainbow animation duration:', computedStyle.animationDuration);
      console.log('  Rainbow filter effect:', computedStyle.filter);
    }
  }
  
  console.log('=== END ENHANCED TEST ===');
};

// Test Enhanced Mk.2 Visual Features
window.testMk2VisualFeatures = function() {
  console.log('=== MK.2 VISUAL FEATURES TEST ===');
  
  const rainbowElements = document.querySelectorAll('.rainbow-effect');
  const megaRow = document.querySelector('.mk2-mega-row');
  const mk2Generator = document.querySelector('.mk2-box-generator');
  
  console.log('Visual elements found:');
  console.log('  Rainbow effect elements:', rainbowElements.length);
  console.log('  Mega row container:', !!megaRow);
  console.log('  Enhanced generator:', !!mk2Generator);
  
  rainbowElements.forEach((el, i) => {
    const style = window.getComputedStyle(el);
    console.log(`  Rainbow element ${i + 1}:`, {
      animation: style.animation,
      backgroundSize: style.backgroundSize,
      filter: style.filter
    });
  });
  
  if (mk2Generator) {
    const style = window.getComputedStyle(mk2Generator);
    console.log('Generator styling:', {
      minWidth: style.minWidth,
      background: style.background,
      border: style.border,
      boxShadow: style.boxShadow
    });
  }
  
  console.log('=== END VISUAL TEST ===');
};

// Force set Soap friendship level for testing Box Generator Mk.2
window.forceSoapLevelForBoxMk2Test = function(targetLevel) {
  if (!window.friendship) {
    console.log('Friendship system not initialized');
    return;
  }
  
  const oldLevel = window.friendship.Generator.level || 0;
  window.friendship.Generator.level = targetLevel;
  console.log(`Soap friendship level changed from ${oldLevel} to ${targetLevel}`);
  
  // Re-render generators to see the change
  if (typeof renderGenerators === 'function') {
    renderGenerators();
    console.log('Generators re-rendered');
  }
  
  // Run the test
  window.testBoxGeneratorMk2();
};

// Quick function to unlock Soap level 10 for testing
window.unlockBoxGeneratorMk2ForTesting = function() {
  console.log('Unlocking Box Generator Mk.2 for testing...');
  window.forceSoapLevelForBoxMk2Test(10);
  
  // Also unlock a few generators for better testing
  generators.forEach((gen, i) => {
    if (i < 3) { // Unlock first 3 generators
      gen.unlocked = true;
      console.log(`Unlocked ${gen.name}`);
    }
  });
  
  // Re-render to show changes
  if (typeof renderGenerators === 'function') {
    renderGenerators();
  }
  
  console.log('Box Generator Mk.2 testing setup complete!');
};

window.forceSoapAutoRecharge = function() {
  const config = getSoapAutoRechargeConfig();
  if (!config) {
    console.log('Auto recharge system not unlocked');
    return;
  }
  
  if (!state.soapAutoRecharge) {
    state.soapAutoRecharge = { timer: config.timerMs, storage: 0, lastTick: Date.now() };
  }
  
  state.soapAutoRecharge.storage = Math.min(state.soapAutoRecharge.storage + 1, config.maxStorage);
  console.log(`Added 1 auto recharge. Storage: ${state.soapAutoRecharge.storage}/${config.maxStorage}`);
  updatePowerGeneratorUI();
};

window.refreshPowerGeneratorUI = function() {
  console.log('🔄 Refreshing power generator UI...');
  console.log('window.friendship exists:', !!window.friendship);
  console.log('window.friendship.Generator exists:', !!(window.friendship && window.friendship.Generator));
  console.log('Friendship Generator Level:', window.friendship?.Generator?.level || 'Not found');
  console.log('Global friendship exists:', typeof friendship !== 'undefined');
  if (typeof friendship !== 'undefined') {
    console.log('Global friendship.Generator level:', friendship.Generator?.level || 'Not found');
  }
  console.log('Auto recharge config:', getSoapAutoRechargeConfig());
  renderPowerGenerator();
  console.log('✅ Power generator UI refreshed!');
};

window.debugFriendshipAccess = function() {
  console.log('=== FRIENDSHIP SYSTEM DEBUG ===');
  console.log('window.friendship:', window.friendship);
  console.log('global friendship:', typeof friendship !== 'undefined' ? friendship : 'undefined');
  console.log('Generator department in window.friendship:', window.friendship?.Generator);
  console.log('Generator department in global friendship:', typeof friendship !== 'undefined' ? friendship.Generator : 'undefined');
  console.log('=== END DEBUG ===');
};

window.forceAutoRechargeUI = function() {
  console.log('🔨 Force adding auto recharge UI...');
  const powerCard = document.querySelector('.power-generator');
  if (!powerCard) {
    console.log('❌ Power generator card not found');
    return;
  }
  
  // Remove existing auto recharge if present
  const existing = powerCard.querySelector('.auto-recharge-system');
  if (existing) existing.remove();
  
  // Create and insert auto recharge UI
  const autoRechargeDiv = document.createElement('div');
  autoRechargeDiv.className = 'auto-recharge-system';
  autoRechargeDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border: 1px solid rgba(76, 175, 80, 0.3);';
  autoRechargeDiv.innerHTML = `
    <h4 style="margin: 0 0 8px 0; color: #4CAF50; font-size: 0.9em;">Soap's Auto Recharge (FORCED)</h4>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <small style="color: #666; margin-bottom: 2px;">Next Charge</small>
        <span id="autoRechargeTimer" style="font-family: monospace; font-weight: bold; color: #4CAF50;">1:00</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <small style="color: #666; margin-bottom: 2px;">Storage</small>
        <span id="autoRechargeStorage" style="font-family: monospace; font-weight: bold; color: #4CAF50;">0/8</span>
      </div>
    </div>
    <div style="margin-top: 8px;">
      <small style="color: #666; font-size: 0.8em;">Auto recharges power to max when below 20</small>
    </div>
  `;
  
  // Insert before the power-info div
  const powerInfo = powerCard.querySelector('.power-info');
  if (powerInfo) {
    powerCard.insertBefore(autoRechargeDiv, powerInfo);
    console.log('✅ Auto recharge UI force-added successfully!');
  } else {
    powerCard.appendChild(autoRechargeDiv);
    console.log('✅ Auto recharge UI force-added at end!');
  }
};

window.addEventListener("load", () => {
  renderPowerGenerator();
});

function initializeGeneratorTab() {
  if (boughtElements[7]) {
    const btn = document.getElementById("generatorSubTabBtn");
    if (btn) {
      if (window.currentFloor === 2) {
        btn.style.display = "none";
      } else {
        btn.style.display = "inline-block";
      }
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
  if (currentHomeSubTab === 'generatorMainTab') {
    renderGenerators();
  }
}

function testGeneratorSystem() {
  swariaKnowledge.kp = new Decimal(10000000);
  tryBuyElement(7);
  tryBuyElement(8);
  tryBuyElement(9);
  state.fluff = new Decimal("1e7"); 
  state.swaria = new Decimal("1e9"); 
  state.feathers = new Decimal("1e11"); 
  state.artifacts = new Decimal("1e13"); 
  swariaKnowledge.kp = new Decimal("1e16"); 
  switchHomeSubTab('generatorMainTab');
}

window.testGeneratorSystem = testGeneratorSystem;

function updatePowerEnergyStatusUI() {
  const el = document.getElementById('powerEnergyStatus');
  if (!el) return;
  if (boughtElements[7]) {
    // Check if Power Generator Mk.2 is active (Soap friendship level 4+)
    let isPowerGeneratorMk2 = false;
    let soapFriendshipLevel = 0;
    if (window.friendship && window.friendship.Generator) {
      soapFriendshipLevel = window.friendship.Generator.level || 0;
    } else if (typeof friendship !== 'undefined' && friendship.Generator) {
      soapFriendshipLevel = friendship.Generator.level || 0;
    }
    isPowerGeneratorMk2 = soapFriendshipLevel >= 4;
    
    el.style.display = 'block';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '0.7em';
    
    // Apply Mk.2 styling if unlocked
    if (isPowerGeneratorMk2) {
      el.style.background = '#181D36';
      el.style.border = '3px solid rgba(33, 150, 243, 0.6)';
      el.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.3)';
      el.style.borderRadius = '12px';
      el.style.padding = '8px 12px';
      el.style.color = 'rgba(33, 150, 243, 0.9)';
      el.innerHTML = `<img src="assets/icons/power generator.png" alt="Power" style="height:2.2em;width:2.2em;display:block;">Power Mk.2: <span class='energy' style="color: rgba(33, 150, 243, 0.9);">${state.powerEnergy.floor()}/${state.powerMaxEnergy}</span>`;
    } else {
      // Reset to default styling
      el.style.background = '';
      el.style.border = '';
      el.style.boxShadow = '';
      el.style.borderRadius = '';
      el.style.padding = '';
      el.style.color = '';
      el.innerHTML = `<img src="assets/icons/power generator.png" alt="Power" style="height:2.2em;width:2.2em;display:block;">Power: <span class='energy'>${state.powerEnergy.floor()}/${state.powerMaxEnergy}</span>`;
    }
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
  // Store state before purchase for debugging
  const beforePurchase = boughtElements[index];
  const beforeKP = swariaKnowledge ? new Decimal(swariaKnowledge.kp) : new Decimal(0);
  
  // Call original function
  _origTryBuyElement.apply(this, arguments);
  
  // Special handling for element 7
  if (index === 7) updatePowerEnergyStatusUI();
  
  // Validation for element 21 (and other high-value elements)
  if (index >= 21 && index <= 24) {
    // Verify the purchase was successful
    const afterPurchase = boughtElements[index];
    const afterKP = swariaKnowledge ? new Decimal(swariaKnowledge.kp) : new Decimal(0);
    const kpChanged = beforeKP.gt(afterKP);
    
    // If KP was deducted but element wasn't purchased, fix it
    if (kpChanged && !afterPurchase && !beforePurchase) {
      console.warn(`Element ${index} purchase bug detected - applying fix`);
      boughtElements[index] = true;
      window.boughtElements = boughtElements;
      
      // Apply element effect if it exists
      if (typeof applyElementEffect === 'function') {
        applyElementEffect(index);
      }
      
      // Update UIs
      if (typeof renderElementGrid === 'function') {
        renderElementGrid();
      }
      if (typeof updateTerrariumUI === 'function' && index >= 21) {
        updateTerrariumUI();
      }
    }
  }
};

window.addEventListener('load', updatePowerEnergyStatusUI);

function updateGeneratorDarknessOverlay() {
  const genTab = document.getElementById('generatorMainTab');
  if (!genTab || genTab.style.display === 'none') return;
  genTab.classList.remove('generator-dim', 'generator-blackout');
  genTab.style.removeProperty('--dim-opacity');
  let blackoutLight = genTab.querySelector('.blackout-cursor-light');
  if (blackoutLight) blackoutLight.remove();
  if (state.powerStatus === 'offline' || state.powerEnergy.lte(0)) {
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
  } else if (state.powerEnergy.lt(20)) {
    genTab.classList.add('generator-dim');
    const opacity = 0.85 * (1 - state.powerEnergy.toNumber() / 20);
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
  const genTab = document.getElementById('generatorMainTab');
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
  if (subTabId !== 'generatorMainTab') {
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
  if (state.powerStatus === 'offline' || state.powerEnergy.lte(0)) {
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
  if (subTabId !== 'generatorMainTab') {
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
  if (state.powerStatus === 'offline' || state.powerEnergy.lte(0)) {
    dim.classList.remove('active');
    dim.style.setProperty('--dim-opacity', '0');
    return;
  }
  if (state.powerEnergy.lt(20)) {
    dim.classList.add('active');
    const opacity = 0.85 * (1 - state.powerEnergy.toNumber() / 20);
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

// Floor 2 Department Tab Switching Handler
const _origSwitchHomeSubTab4 = switchHomeSubTab;

// Initialize currentFloor if not set
if (typeof window.currentFloor === 'undefined') {
  window.currentFloor = 1; // Default to Floor 1
  console.log('Initialized currentFloor to 1');
}

switchHomeSubTab = function(subTabId) {
  // Debug current floor state
  console.log('switchHomeSubTab called with:', subTabId, 'currentFloor:', window.currentFloor);
  
  // Check multiple indicators to determine if we're on Floor 2
  const isFloor2 = (window.currentFloor === 2) || 
                   (document.body.classList.contains('floor-2')) ||
                   (document.querySelector('.floor-2-indicator')) ||
                   (document.getElementById('terrariumTab') && document.getElementById('terrariumTab').style.display === 'block' && window.currentFloor !== 1);
  
  // Handle Floor 2 special cases to prevent flicker
  if (isFloor2) {
    console.log('Detected Floor 2 - applying special tab switching');
    // On Floor 2, handle all tab switches specially to prevent flicker
    window.currentHomeSubTab = subTabId;
    showPage('home');
    
    // Hide all tabs first
    document.querySelectorAll('#homeSubTabs .sub-tab').forEach(tab => {
      tab.style.display = 'none';
    });
    
    // Handle button highlighting
    document.querySelectorAll('#subTabNav button').forEach(btn => {
      btn.classList.remove('active');
    });
    const btn = document.querySelector(`#subTabNav button[onclick*="${subTabId}"]`);
    if (btn) {
      btn.classList.add('active');
    }
    
    // Remove background classes
    document.body.classList.remove('generator-bg');
    document.documentElement.classList.remove('generator-bg');
    document.body.classList.remove('prism-bg-active');
    
    if (subTabId === 'gamblingMain') {
      // Show terrarium instead of cargo on Floor 2
      const terrariumTab = document.getElementById('terrariumTab');
      const gamblingMainTab = document.getElementById('gamblingMain');
      if (terrariumTab) terrariumTab.style.display = 'block';
      if (gamblingMainTab) gamblingMainTab.style.display = 'none';
      console.log('Floor 2: Showing terrarium instead of cargo');
      
      // Apply terrarium background with time-of-day awareness
      document.body.classList.add('terrarium-bg');
      document.documentElement.classList.add('terrarium-bg');
      document.body.classList.remove('water-filtration-bg', 'observatory-bg');
      document.documentElement.classList.remove('water-filtration-bg', 'observatory-bg');
      
      // Add time-of-day specific classes for enhanced natural atmosphere
      applyTerrariumTimeOfDay();
    } else if (subTabId === 'generatorMainTab') {
      // Hide terrarium and show Water Filtration Department
      const terrariumTab = document.getElementById('terrariumTab');
      const gamblingMainTab = document.getElementById('gamblingMain');
      const generatorMainTab = document.getElementById('generatorMainTab');
      
      if (terrariumTab) terrariumTab.style.display = 'none';
      if (gamblingMainTab) gamblingMainTab.style.display = 'none';
      if (generatorMainTab) {
        // Immediately render Water Filtration content to prevent any flicker
        if (window.waterFiltration && typeof window.waterFiltration.renderWaterFiltrationUI === 'function') {
          console.log('Floor 2: Immediately rendering Water Filtration UI');
          window.waterFiltration.renderWaterFiltrationUI();
        }
        generatorMainTab.style.display = 'block'; // Show after content is ready
        console.log('Floor 2: generatorMainTab container is now visible with Water Filtration content');
      }
      
      // Apply water filtration background with time-of-day awareness
      document.body.classList.add('water-filtration-bg');
      document.documentElement.classList.add('water-filtration-bg');
      document.body.classList.remove('terrarium-bg', 'observatory-bg');
      document.documentElement.classList.remove('terrarium-bg', 'observatory-bg');
      
      // Add time-of-day specific classes for enhanced industrial atmosphere
      applyWaterFiltrationTimeOfDay();
    } else if (subTabId === 'prismSubTab') {
      // Hide terrarium and show Observatory Department
      const terrariumTab = document.getElementById('terrariumTab');
      const gamblingMainTab = document.getElementById('gamblingMain');
      const prismSubTab = document.getElementById('prismSubTab');
      
      if (terrariumTab) terrariumTab.style.display = 'none';
      if (gamblingMainTab) gamblingMainTab.style.display = 'none';
      if (prismSubTab) {
        // Immediately render Observatory content to prevent any flicker
        if (window.observatory && typeof window.observatory.renderObservatoryUI === 'function') {
          console.log('Floor 2: Immediately rendering Observatory UI');
          window.observatory.renderObservatoryUI();
        }
        prismSubTab.style.display = 'block'; // Show after content is ready
        console.log('Floor 2: prismSubTab container is now visible with Observatory content');
      }
      
      // Apply observatory background with time-of-day awareness
      document.body.classList.add('observatory-bg');
      document.documentElement.classList.add('observatory-bg');
      document.body.classList.remove('terrarium-bg', 'water-filtration-bg');
      document.documentElement.classList.remove('terrarium-bg', 'water-filtration-bg');
      
      // Add time-of-day specific classes for enhanced mystical atmosphere
      applyObservatoryTimeOfDay();
    }
    
    return; // Don't call original function on Floor 2
  } else {
    // For Floor 1, use original function and clean up Floor 2 backgrounds
    console.log('Detected Floor 1 - cleaning up Floor 2 backgrounds and using original tab switching');
    
    // Remove all Floor 2 department backgrounds and time-of-day classes when on Floor 1
    document.body.classList.remove('water-filtration-bg', 'observatory-bg', 'terrarium-bg');
    document.documentElement.classList.remove('water-filtration-bg', 'observatory-bg', 'terrarium-bg');
    document.body.classList.remove('day-time', 'dusk-time', 'night-time');
    document.documentElement.classList.remove('day-time', 'dusk-time', 'night-time');
    
    // Call original function first
    _origSwitchHomeSubTab4.apply(this, arguments);
    
    // Add verification and only restore if actually broken
    setTimeout(() => {
      console.log('Verifying Floor 1 tab functionality for:', subTabId);
      
      if (subTabId === 'generatorMainTab') {
        const genTab = document.getElementById('generatorMainTab');
        const hasFloor2Content = genTab && genTab.innerHTML.includes('water-filtration-container');
        const hasBoxGenBtn = document.getElementById('generatorBoxGenBtn');
        const hasChargerBtn = document.getElementById('generatorChargerBtn');
        
        console.log('Generator tab status:', {
          hasFloor2Content,
          hasBoxGenBtn: !!hasBoxGenBtn,
          hasChargerBtn: !!hasChargerBtn
        });
        
        // Only restore if we have Floor 2 content or missing buttons
        if (hasFloor2Content || !hasBoxGenBtn || !hasChargerBtn) {
          console.log('Generator tab needs restoration');
          
          // Completely rebuild the generator tab structure
          genTab.innerHTML = `
            <div id="generatorTopButtons" style="display:flex; justify-content:center; gap:1.5em; margin-top:2em;">
              <button id="generatorBoxGenBtn" class="generator-feature-btn">Box Generators</button>
              <button id="generatorChargerBtn" class="generator-feature-btn">Charger</button>
            </div>
            
            <div id="generatorBoxGenArea" class="generator-subtab" style="display:block;">
              <div class="card fullwidth">
                <div class="ceiling-light"></div>
                <div id="generatorContainer" style="padding: 0.5rem;"></div>
              </div>
            </div>
            
            <div id="generatorChargerArea" class="generator-subtab" style="display:none;">
              <div id="chargerSubTab" class="charger-container">
                <div class="generator-flex-row" style="justify-content:center;align-items:flex-start;gap:2.5em;">
                  <div class="generator-right-col" style="margin:0;display:flex;flex-direction:column;gap:1.5em;">
                    <div class="card" id="chargerCard" style="position: relative;">
                      <h2>The Charger</h2>
                      <p>While charging, this will take your power energy and convert it into charge, charge is used to boost various stuff</p>
                      <div style="margin: 1.5em 0; position: relative; z-index: 2;">
                        <button id="chargerToggleBtn" class="go-to-charger-btn">Turn ON</button>
                      </div>
                      <div style="margin-top: 1em; position: relative; z-index: 2; text-align: center;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; font-size: 1.4em; font-weight: bold;">
                          <img src="assets/icons/charge.png" alt="Charge" style="width: 40px; height: 40px;">
                          <span>Charge: <span id="chargerCharge">0</span></span>
                          <span id="chargerGainRate" style="color: #3cf;"></span>
                        </div>
                        <div id="chargerBoost" style="margin-top:0.5em;"></div>
                        <div id="chargerCurrencyBoost" style="margin-top:0.2em;"></div>
                      </div>
                    </div>
                    <div id="soapChargerBox" class="card soap-charger-box" style="position: relative; display: flex; align-items: center; justify-content: center;">
                      <img id="soapChargerCharacter" class="soap-large" src="assets/icons/soap.png" alt="Soap Character">
                      <div id="soapChargerSpeech" class="soap-charger-speech"></div>
                    </div>
                  </div>
                  <div class="generator-right-col" style="margin:auto;">
                    <div class="card" style="position: relative; min-width:600px; max-width:900px; padding:2.5em 2.5em;">
                      <h2>Charger Milestones</h2>
                      <div id="chargerMilestoneTable" style="margin-top:1.5em;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          
          // Wait a bit for DOM to settle, then initialize everything
          setTimeout(() => {
            // Initialize generators first
            if (typeof renderGenerators === 'function') {
              renderGenerators();
              console.log('Restored: renderGenerators()');
            }
            
            // Set up generator sub-tab buttons
            if (typeof setupGeneratorSubTabButtons === 'function') {
              setupGeneratorSubTabButtons();
              console.log('Restored: setupGeneratorSubTabButtons()');
            }
            
            // Ensure charger object exists with proper structure BEFORE loading state
            if (typeof window.charger === 'undefined') {
              console.log('Creating charger object...');
              window.charger = {
                isOn: false,
                charge: new Decimal(0),
                questDialogueShown: false,
                milestones: [
                  { amount: new Decimal(10), unlocked: false, effect: 'Boost your charge gain based on how much charge you have.' },
                  { amount: new Decimal(100), unlocked: false, effect: 'Boost the 4 main currency gain (fluff, swaria coins, feathers, artifacts) based on your charge.' },
                  { amount: new Decimal(2500), unlocked: false, effect: 'Boost every light gain based on your charge.' },
                  { amount: new Decimal(10000), unlocked: false, effect: 'Every OoM of charge after 10000, reduce the amount of red tiles by 1 in the generator minigame' },
                  { amount: new Decimal(25000), unlocked: false, effect: 'Boost the amount of box generated based on charge amount' },
                  { amount: new Decimal("1e6"), unlocked: false, effect: 'Boost your charge gain based on how much charge you have but slower' },
                  { amount: new Decimal("1e10"), unlocked: false, effect: 'Boost pollen and flower gain based on your charge' },
                  { amount: new Decimal("1e20"), unlocked: false, effect: 'Boost terrarium xp gain based on your charge' },
                  { amount: new Decimal("1e30"), unlocked: false, effect: 'Boost nectar gain based on your charge' },
                ],
                chargePerSecond: 1,
              };
            }
            
            // Load charger state first
            if (typeof window.loadChargerState === 'function') {
              window.loadChargerState();
              console.log('Restored: loadChargerState()');
            }
            
            // Ensure charge is a Decimal
            if (window.charger && !window.charger.charge) {
              window.charger.charge = new Decimal(0);
            } else if (window.charger && typeof window.charger.charge.toNumber !== 'function') {
              window.charger.charge = new Decimal(window.charger.charge || 0);
            }
            
            // Initialize charger UI
            if (typeof updateChargerUI === 'function') {
              updateChargerUI();
              console.log('Restored: updateChargerUI()');
            }
            
            // Initialize charger milestone table
            if (typeof initializeChargerMilestoneTable === 'function') {
              initializeChargerMilestoneTable();
              console.log('Restored: initializeChargerMilestoneTable()');
            }
            
            // Manually update charger display if updateChargerUI didn't work
            const chargerChargeEl = document.getElementById('chargerCharge');
            if (chargerChargeEl && window.charger && window.charger.charge) {
              // Use DecimalUtils for proper formatting
              if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                chargerChargeEl.textContent = DecimalUtils.formatDecimal(window.charger.charge);
              } else if (typeof window.charger.charge.toNumber === 'function') {
                chargerChargeEl.textContent = window.charger.charge.toNumber().toLocaleString();
              } else {
                chargerChargeEl.textContent = window.charger.charge.toString();
              }
              console.log('Restored: Manual charger charge display update with proper formatting');
            }
            
            // Setup initial gain rate display
            const chargerGainRateEl = document.getElementById('chargerGainRate');
            if (chargerGainRateEl && window.charger) {
              // Calculate actual gain rate
              let gainRate = 1;
              if (typeof getChargerGain === 'function') {
                try {
                  gainRate = getChargerGain();
                } catch (error) {
                  gainRate = new Decimal(1);
                }
              } else {
                gainRate = new Decimal(1);
              }
              
              // Always show gain rate, but with different formatting based on state
              if (window.charger.isOn) {
                if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                  chargerGainRateEl.textContent = '+' + DecimalUtils.formatDecimal(gainRate) + '/s';
                } else {
                  chargerGainRateEl.textContent = '+' + gainRate.toString() + '/s';
                }
              } else {
                // Show potential gain rate when off
                if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                  chargerGainRateEl.textContent = '+' + DecimalUtils.formatDecimal(gainRate) + '/s';
                } else {
                  chargerGainRateEl.textContent = '+' + gainRate.toString() + '/s';
                }
                chargerGainRateEl.style.opacity = '0.6'; // Make it dimmer when off
              }
              console.log('Restored: Initial gain rate display setup');
            }
            
            // Set up charger toggle button
            const chargerToggleBtn = document.getElementById('chargerToggleBtn');
            if (chargerToggleBtn && typeof window.charger !== 'undefined') {
              chargerToggleBtn.onclick = function() {
                window.charger.isOn = !window.charger.isOn;
                
                // Update button text
                chargerToggleBtn.textContent = window.charger.isOn ? 'Turn OFF' : 'Turn ON';
                
                // Update gain rate display - always show but with different styling
                const chargerGainRateEl = document.getElementById('chargerGainRate');
                if (chargerGainRateEl) {
                  // Calculate actual gain rate
                  let gainRate = 1;
                  if (typeof getChargerGain === 'function') {
                    try {
                      gainRate = getChargerGain();
                    } catch (error) {
                      gainRate = new Decimal(1);
                    }
                  } else {
                    gainRate = new Decimal(1);
                  }
                  
                  if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                    chargerGainRateEl.textContent = '+' + DecimalUtils.formatDecimal(gainRate) + '/s';
                  } else {
                    chargerGainRateEl.textContent = '+' + gainRate.toString() + '/s';
                  }
                  
                  // Change opacity based on state
                  chargerGainRateEl.style.opacity = window.charger.isOn ? '1' : '0.6';
                }
                
                if (typeof updateChargerUI === 'function') {
                  updateChargerUI();
                }
                console.log('Charger toggled via restoration:', window.charger.isOn ? 'ON' : 'OFF');
              };
              console.log('Restored: charger toggle button functionality');
              
              // Update button text immediately
              chargerToggleBtn.textContent = window.charger.isOn ? 'Turn OFF' : 'Turn ON';
            }
            
            // Set up real-time charger updates
            if (!window.chargerUpdateInterval) {
              window.chargerUpdateInterval = setInterval(function() {
                // Calculate actual gain using getChargerGain if available
                let gainPerSecond = 1;
                if (typeof getChargerGain === 'function') {
                  try {
                    gainPerSecond = getChargerGain();
                  } catch (error) {
                    gainPerSecond = new Decimal(1);
                  }
                } else {
                  gainPerSecond = new Decimal(1);
                }
                
                // Update gain rate display (always visible)
                const chargerGainRateEl = document.getElementById('chargerGainRate');
                if (chargerGainRateEl) {
                  if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                    chargerGainRateEl.textContent = '+' + DecimalUtils.formatDecimal(gainPerSecond) + '/s';
                  } else {
                    chargerGainRateEl.textContent = '+' + gainPerSecond.toString() + '/s';
                  }
                  
                  // Set opacity based on charger state
                  if (window.charger && window.charger.isOn) {
                    chargerGainRateEl.style.opacity = '1';
                  } else {
                    chargerGainRateEl.style.opacity = '0.6';
                  }
                }
                
                if (window.charger && window.charger.isOn && window.charger.charge) {
                  // Add charge over time (gain per second / 10 since we update every 100ms)
                  const gainPerUpdate = gainPerSecond.div(10);
                  window.charger.charge = window.charger.charge.add(gainPerUpdate);
                  
                  // Update charge display
                  const chargerChargeEl = document.getElementById('chargerCharge');
                  if (chargerChargeEl) {
                    if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                      chargerChargeEl.textContent = DecimalUtils.formatDecimal(window.charger.charge);
                    } else {
                      chargerChargeEl.textContent = window.charger.charge.toString();
                    }
                  }
                  
                  // Update charger UI if function exists
                  if (typeof updateChargerUI === 'function') {
                    updateChargerUI();
                  }
                }
              }, 100); // Update every 100ms for smooth display
              console.log('Restored: Real-time charger update interval started');
            }
            
            // Force a final UI update
            setTimeout(() => {
              if (typeof updateChargerUI === 'function') {
                updateChargerUI();
                console.log('Restored: Final charger UI update');
              }
              
              // Force update charger display one more time
              const chargerChargeEl = document.getElementById('chargerCharge');
              const chargerToggleBtn = document.getElementById('chargerToggleBtn');
              if (chargerChargeEl && window.charger) {
                if (window.charger.charge && typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                  chargerChargeEl.textContent = DecimalUtils.formatDecimal(window.charger.charge);
                } else if (window.charger.charge && typeof window.charger.charge.toNumber === 'function') {
                  chargerChargeEl.textContent = window.charger.charge.toNumber().toLocaleString();
                } else {
                  chargerChargeEl.textContent = '0';
                }
              }
              if (chargerToggleBtn && window.charger) {
                chargerToggleBtn.textContent = window.charger.isOn ? 'Turn OFF' : 'Turn ON';
              }
              console.log('Restored: Final manual charger updates');
            }, 200);
          }, 100);
        } else {
          console.log('Generator tab appears to be working correctly');
        }
      }
      
      if (subTabId === 'prismSubTab') {
        const prismTab = document.getElementById('prismSubTab');
        const hasFloor2Content = prismTab && prismTab.innerHTML.includes('observatory-container');
        const hasLightGrid = document.getElementById('lightGrid');
        const hasPrismButtons = document.getElementById('prismTopButtons');
        
        console.log('Prism tab status:', {
          hasFloor2Content,
          hasLightGrid: !!hasLightGrid,
          hasPrismButtons: !!hasPrismButtons
        });
        
        // Only restore if we have Floor 2 content or missing elements
        if (hasFloor2Content || !hasLightGrid || !hasPrismButtons) {
          console.log('Prism tab needs restoration');
          
          // Clear the tab completely
          prismTab.innerHTML = '';
          
          // Ensure prismState exists
          if (typeof window.prismState === 'undefined') {
            console.log('Creating prismState...');
            window.prismState = {
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
          }
          
          // Load prism state from save if it exists
          if (typeof loadGame === 'function') {
            console.log('Attempting to load prism state from save...');
            // This will restore prism state from localStorage
          }
          
          // Ensure all light values are Decimals
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
          
          // Try to initialize prism
          if (typeof window.initPrism === 'function') {
            try {
              window.initPrism();
              console.log('Restored: initPrism()');
            } catch (error) {
              console.error('Error calling initPrism:', error);
            }
          }
          
          // Wait for initialization, then set up everything else
          setTimeout(() => {
            // Add prism background
            document.body.classList.add('prism-bg-active');
            
            // Set up all prism functions
            if (typeof setupPrismShineEffect === 'function') {
              setupPrismShineEffect();
              console.log('Restored: setupPrismShineEffect()');
            }
            
            if (typeof setupPrismSubTabButtons === 'function') {
              setupPrismSubTabButtons();
              console.log('Restored: setupPrismSubTabButtons()');
            }
            
            if (typeof updateAllLightCounters === 'function') {
              updateAllLightCounters();
              console.log('Restored: updateAllLightCounters()');
            }
            
            if (typeof updateLightGeneratorButtons === 'function') {
              updateLightGeneratorButtons();
              console.log('Restored: updateLightGeneratorButtons()');
            }
            
            // Force multiple light counter updates
            if (typeof updateAllLightCounters === 'function') {
              updateAllLightCounters();
              console.log('Restored: updateAllLightCounters() - first call');
            }
            
            if (typeof forceUpdateAllLightCounters === 'function') {
              forceUpdateAllLightCounters();
              console.log('Restored: forceUpdateAllLightCounters()');
            }
            
            // Ensure light generators card is visible and updated
            const lightUpgradesCard = document.getElementById('lightUpgradesCard');
            if (lightUpgradesCard) {
              // Make sure the card is visible
              lightUpgradesCard.style.display = 'block';
              lightUpgradesCard.style.visibility = 'visible';
              lightUpgradesCard.style.opacity = '1';
              console.log('Restored: Made lightUpgradesCard visible');
              
              // Ensure all generator buttons are visible
              const generatorButtons = ['lightGenBtn', 'redlightGenBtn', 'orangelightGenBtn', 'yellowlightGenBtn', 'greenlightGenBtn', 'bluelightGenBtn'];
              generatorButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                  btn.style.display = 'block';
                  btn.style.visibility = 'visible';
                  console.log(`Restored: Made ${btnId} visible`);
                } else {
                  console.log(`Restored: ${btnId} not found in DOM`);
                }
              });
              
              // Initialize prism system properly
              if (typeof window.initPrism === 'function') {
                console.log('Restored: Initializing prism system');
                window.initPrism();
              }
              
              // Update light generator buttons using the original function
              if (typeof window.updateLightGeneratorButtons === 'function') {
                console.log('Restored: Updating original light generator buttons');
                window.updateLightGeneratorButtons();
              } else {
                console.log('Restored: updateLightGeneratorButtons not available yet, will be called later');
                // Set up a retry mechanism
                let retryCount = 0;
                const retryUpdate = () => {
                  if (typeof window.updateLightGeneratorButtons === 'function') {
                    console.log('Restored: updateLightGeneratorButtons now available, updating');
                    window.updateLightGeneratorButtons();
                    
                    // Also ensure light counters are updated
                    if (typeof window.updateAllLightCounters === 'function') {
                      window.updateAllLightCounters();
                      console.log('Restored: Updated all light counters');
                    }
                  } else if (retryCount < 10) {
                    retryCount++;
                    setTimeout(retryUpdate, 500);
                  }
                };
                setTimeout(retryUpdate, 500);
              }
            } else {
              console.log('Restored: lightUpgradesCard not found in DOM');
            }

            
            // Load advanced prism content if available
            const advancedPrismContent = document.getElementById('advancedPrismContent');
            if (advancedPrismContent && (!advancedPrismContent.innerHTML || advancedPrismContent.innerHTML.trim() === '' || advancedPrismContent.innerHTML.includes('coming soon'))) {
              console.log('Restored: Loading advanced prism content');
              
              // Create a temporary element with ID 'prismAdvancedArea' that the advanced prism system expects
              const prismAdvancedAreaWrapper = document.getElementById('prismAdvancedArea');
              if (prismAdvancedAreaWrapper) {
                // Clear existing content and set up for advanced prism
                prismAdvancedAreaWrapper.innerHTML = '';
                prismAdvancedAreaWrapper.style.padding = '0'; // Remove card padding since advanced prism has its own layout
              }
              
              // Try to initialize advanced prism system from advanced prism.js
              if (typeof initAdvancedPrism === 'function') {
                try {
                  console.log('Restored: Attempting to call initAdvancedPrism()');
                  
                  // First, ensure advanced prism state is unlocked
                  if (window.advancedPrismState) {
                    window.advancedPrismState.unlocked = true;
                    console.log('Restored: Set advanced prism as unlocked');
                  }
                  
                  initAdvancedPrism();
                  console.log('Restored: initAdvancedPrism() called successfully');
                  
                  // Also try calling renderAdvancedPrismUI directly if available
                  setTimeout(() => {
                    if (typeof renderAdvancedPrismUI === 'function') {
                      try {
                        renderAdvancedPrismUI();
                        console.log('Restored: renderAdvancedPrismUI() called successfully');
                      } catch (error) {
                        console.log('Restored: renderAdvancedPrismUI() error:', error);
                      }
                    }
                    
                    // Ensure prism core state exists
                    if (window.prismCoreState) {
                      console.log('Restored: Prism core state available:', window.prismCoreState);
                    }
                  }, 100);
                  
                } catch (error) {
                  console.log('Restored: initAdvancedPrism() error:', error);
                  // Fallback to basic content
                  if (prismAdvancedAreaWrapper) {
                    prismAdvancedAreaWrapper.innerHTML = `
                      <div class="card">
                        <h2>Advanced Prism Laboratory</h2>
                        <p>Vi's advanced research station encountered an error: ${error.message}</p>
                        <p>Please check the console for more details.</p>
                      </div>
                    `;
                  }
                }
              } else {
                console.log('Restored: initAdvancedPrism function not found, loading basic content');
                if (prismAdvancedAreaWrapper) {
                  prismAdvancedAreaWrapper.innerHTML = `
                    <div class="card">
                      <h2>Advanced Prism Laboratory</h2>
                      <div class="vi-section">
                        <h4>Research Station</h4>
                        <div id="viDialogue" style="background: #1a1a1a; border: 1px solid #444; padding: 15px; border-radius: 5px; margin: 10px 0;">
                          <span style="color: #ff6b9d; font-weight: bold;">Vi:</span> 
                          <span id="viSpeech">The advanced prism systems are complex calibration tools. I'll help you optimize your light generation efficiency.</span>
                        </div>
                        <div class="research-controls">
                          <button id="researchBtn" class="calibration-btn" onclick="startPrismResearch()">
                            Begin Research
                          </button>
                          <div id="researchProgress" style="display: none;">
                            <div class="progress-bar">
                              <div id="researchBar" style="width: 0%; background: #ff6b9d; height: 20px; border-radius: 10px;"></div>
                            </div>
                            <p id="researchStatus">Research in progress...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                }
              }
            }
            
            // Update individual light counters with proper formatting
            const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
            lightTypes.forEach(type => {
              const countEl = document.getElementById(type + 'Count');
              if (countEl && window.prismState && window.prismState[type]) {
                // Use DecimalUtils for proper formatting instead of toString()
                if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                  countEl.textContent = DecimalUtils.formatDecimal(window.prismState[type]);
                } else {
                  countEl.textContent = window.prismState[type].toString();
                }
              }
            });
            
            // Update particle boost
            const particleBoostEl = document.getElementById('particleBoost');
            if (particleBoostEl) {
              particleBoostEl.textContent = '+0.0 per click';
            }
            
            // The original light generator system will handle all functionality
            if (false) {
              window.buyLightGenerator = function(type) {
                if (!window.prismState) {
                  window.prismState = {};
                }
                if (!window.prismState.generatorUpgrades) {
                  window.prismState.generatorUpgrades = {};
                }
                
                // Initialize generator level if not set
                if (!window.prismState.generatorUpgrades[type]) {
                  window.prismState.generatorUpgrades[type] = new Decimal(0);
                }
                
                // Initialize light currency if not set
                if (!window.prismState[type]) {
                  window.prismState[type] = new Decimal(0);
                }
                
                // Calculate cost based on level
                const baseCosts = {
                  'light': 100,
                  'redlight': 500,
                  'orangelight': 1000,
                  'yellowlight': 2500,
                  'greenlight': 5000,
                  'bluelight': 10000
                };
                
                const currentLevel = window.prismState.generatorUpgrades[type] ? 
                  (typeof window.prismState.generatorUpgrades[type].toNumber === 'function' ?
                    window.prismState.generatorUpgrades[type].toNumber() :
                    window.prismState.generatorUpgrades[type]) : 0;
                    
                const baseCost = new Decimal(baseCosts[type] || 100);
                const cost = baseCost.mul(Decimal.pow(1.15, currentLevel));
                
                // Check if player can afford
                if (window.prismState[type].gte(cost)) {
                  // Deduct cost
                  window.prismState[type] = window.prismState[type].sub(cost);
                  
                  // Increase generator level
                  window.prismState.generatorUpgrades[type] = new Decimal(currentLevel + 1);
                  
                  // Update UI
                  updateLightGeneratorDisplay(type);
                  updateLightCounter(type);
                  
                  console.log(`Bought ${type} generator, now level ${window.prismState.generatorUpgrades[type].toNumber()}`);
                } else {
                  // Use proper formatting for error message
                  let costDisplay, haveDisplay;
                  if (typeof window.formatNumber === 'function') {
                    costDisplay = window.formatNumber(cost);
                    haveDisplay = window.formatNumber(window.prismState[type]);
                  } else if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                    costDisplay = DecimalUtils.formatDecimal(cost);
                    haveDisplay = DecimalUtils.formatDecimal(window.prismState[type]);
                  } else {
                    costDisplay = cost.toString();
                    haveDisplay = window.prismState[type].toString();
                  }
                  console.log(`Cannot afford ${type} generator. Need ${costDisplay}, have ${haveDisplay}`);
                }
              };
              
              // Helper function to update generator display
              window.updateLightGeneratorDisplay = function(type) {
                const btn = document.getElementById(type + 'GeneratorBtn');
                if (btn) {
                  const currentLevel = window.prismState.generatorUpgrades && window.prismState.generatorUpgrades[type] ? 
                    (typeof window.prismState.generatorUpgrades[type].toNumber === 'function' ?
                      window.prismState.generatorUpgrades[type].toNumber() :
                      window.prismState.generatorUpgrades[type]) : 0;
                  const baseCosts = {
                    'light': 100,
                    'redlight': 500,
                    'orangelight': 1000,
                    'yellowlight': 2500,
                    'greenlight': 5000,
                    'bluelight': 10000
                  };
                  const typeNames = {
                    'light': 'Light',
                    'redlight': 'Red Light',
                    'orangelight': 'Orange Light',
                    'yellowlight': 'Yellow Light',
                    'greenlight': 'Green Light',
                    'bluelight': 'Blue Light'
                  };
                  
                  const baseCost = new Decimal(baseCosts[type] || 100);
                  const nextCost = baseCost.mul(Decimal.pow(1.15, currentLevel));
                  
                  // Use proper formatting function
                  let costDisplay;
                  if (typeof window.formatNumber === 'function') {
                    costDisplay = window.formatNumber(nextCost);
                  } else if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                    costDisplay = DecimalUtils.formatDecimal(nextCost);
                  } else {
                    costDisplay = nextCost.toString();
                  }
                  
                  const typeName = typeNames[type] || type;
                  
                  // Update button content
                  const infoDiv = btn.querySelector('.generator-info');
                  if (infoDiv) {
                    const titleDiv = infoDiv.querySelector('.generator-title');
                    const costDiv = infoDiv.querySelector('.generator-cost');
                    if (titleDiv) titleDiv.textContent = `${typeName} Generator (Level ${currentLevel})`;
                    if (costDiv) costDiv.textContent = `Cost: ${costDisplay} ${typeName}`;
                  }
                  
                  // Update button state based on affordability
                  const canAfford = window.prismState[type] && window.prismState[type].gte(nextCost);
                  btn.disabled = !canAfford;
                }
              };
              
              // Helper function to update light counter display
              window.updateLightCounter = function(type) {
                const countEl = document.getElementById(type + 'Count');
                if (countEl && window.prismState && window.prismState[type]) {
                  countEl.textContent = DecimalUtils.formatDecimal(window.prismState[type]);
                }
              };
              
              console.log('Restored: buyLightGenerator function and helpers added');
            }
            
            // Update all light generator displays after restoration
            if (typeof window.updateLightGeneratorDisplay === 'function') {
              const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
              lightTypes.forEach(type => {
                window.updateLightGeneratorDisplay(type);
              });
              console.log('Restored: All light generator displays updated');
            }
            
            console.log('Restored: Manual light counter updates');
            
            // Check if prism was properly created, if not create manually
            const lightGrid = document.getElementById('lightGrid');
            if (!lightGrid || lightGrid.children.length === 0) {
              console.log('Prism not fully initialized, creating manual structure...');
              
              prismTab.innerHTML = `
                <div id="prismTopButtons" style="display:flex; justify-content:center; gap:1.5em; margin-top:0.5em;">
                  <button id="prismMainBtn" class="prism-feature-btn active">The Prism</button>
                  <button id="prismAdvancedBtn" class="prism-feature-btn">Advanced Prism</button>
                </div>
                
                <div id="prismMainArea" class="prism-subtab" style="display:block;">
                  <div class="prism-top-row triple">
                    <div>
                      <div class="card">
                        <h2>The Prism</h2>
                        <div id="lightGrid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;"></div>
                      </div>
                      <div id="prismCharacterContainer" class="card swaria-character-box">
                        <img id="prismCharacter" src="assets/icons/swaria prism.png" alt="Swaria Character" />
                        <div id="prismSpeech" class="swaria-speech">Welcome to the Prism!</div>
                      </div>
                    </div>
                    <div class="card">
                      <h3>Light Energy</h3>
                      <div class="light-row" style="position: relative;">
                        <img src="assets/icons/light.png" class="light-icon"><span>Pure Light: <span class="currency-value-wrapper"><span id="lightCount" style="position: relative;">0</span></span><span id="lightKPMult" style="margin-left: 6px; color: #aaffff; font-weight: bold;"></span></span>
                      </div>
                      <div class="light-row" style="position: relative;">
                        <img src="assets/icons/red light.png" class="light-icon"><span>Red Light: <span class="currency-value-wrapper"><span id="redlightCount">0</span></span><span id="redlightFeatherBoost" style="color: #ff4444; font-weight: bold;"></span></span>
                      </div>
                      <div class="light-row" style="position: relative;">
                        <img src="assets/icons/orange light.png" class="light-icon"><span>Orange Light: <span class="currency-value-wrapper"><span id="orangelightCount">0</span></span><span id="orangelightArtifactBoost" style="color: #ffaa44; font-weight: bold;"></span></span>
                      </div>
                      <div class="light-row" style="position: relative;">
                        <img src="assets/icons/yellow light.png" class="light-icon"><span>Yellow Light: <span class="currency-value-wrapper"><span id="yellowlightCount">0</span></span><span id="yellowlightChargeBoost" style="color: #ffff66; font-weight: bold;"></span></span>
                      </div>
                      <div class="light-row" style="position: relative;">
                        <img src="assets/icons/green light.png" class="light-icon"><span>Green Light: <span class="currency-value-wrapper"><span id="greenlightCount">0</span></span><span id="greenlightSwariaCoinBoost" style="color: #66ff66; font-weight: bold;"></span></span>
                      </div>
                      <div class="light-row" style="position: relative;">
                        <img src="assets/icons/blue light.png" class="light-icon"><span>Blue Light: <span class="currency-value-wrapper"><span id="bluelightCount">0</span></span><span id="bluelightFluffBoost" style="color: #6666ff; font-weight: bold;"></span></span>
                      </div>
                      <div class="light-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ccc;"><span style="color: #aaffff; font-weight: bold;">Particle Boost: <span id="particleBoost">+0.0 per click</span></span></div>
                    </div>
                    <div class="card" id="lightUpgradesCard">
                      <h2>Light Generators</h2>
                      <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">Generators produce particles that boost light gain from clicking prism tiles</p>
                      <div class="generator-card light">
                        <button id="lightGenBtn" onclick="handleLightGenClick('light')">Light Generator</button>
                        <div>Light Particles: <span id="lightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card redlight">
                        <button id="redlightGenBtn" onclick="handleLightGenClick('redlight')">Redlight Generator</button>
                        <div>Red Particles: <span id="redlightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card orangelight">
                        <button id="orangelightGenBtn" onclick="handleLightGenClick('orangelight')">Orangelight Generator</button>
                        <div>Orange Particles: <span id="orangelightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card yellowlight">
                        <button id="yellowlightGenBtn" onclick="handleLightGenClick('yellowlight')">Yellowlight Generator</button>
                        <div>Yellow Particles: <span id="yellowlightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card greenlight">
                        <button id="greenlightGenBtn" onclick="handleLightGenClick('greenlight')">Greenlight Generator</button>
                        <div>Green Particles: <span id="greenlightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card bluelight">
                        <button id="bluelightGenBtn" onclick="handleLightGenClick('bluelight')">Bluelight Generator</button>
                        <div>Blue Particles: <span id="bluelightparticleCount">0</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div id="prismAdvancedArea" class="prism-subtab" style="display:none;">
                  <div class="card">
                    <h2>Advanced Prism</h2>
                    <div id="advancedPrismContent">
                      <!-- Advanced prism content will be loaded here -->
                    </div>
                  </div>
                </div>
              `;
              
              // After creating manual HTML, ensure original generators are visible
              setTimeout(() => {
                // First, find the original lightUpgradesCard before we might lose it
                let originalLightUpgradesCard = document.getElementById('lightUpgradesCard');
                
                // If it doesn't exist yet, check if it's in the original DOM structure
                if (!originalLightUpgradesCard) {
                  // Try to find it in different possible locations
                  const allCards = document.querySelectorAll('.card');
                  allCards.forEach(card => {
                    if (card.id === 'lightUpgradesCard' || card.querySelector('h2')?.textContent === 'Light Generators') {
                      originalLightUpgradesCard = card;
                      if (!card.id) card.id = 'lightUpgradesCard';
                    }
                  });
                }
                
                if (originalLightUpgradesCard) {
                  // Force show the generator card with all necessary styles
                  originalLightUpgradesCard.style.display = 'block';
                  originalLightUpgradesCard.style.visibility = 'visible';
                  originalLightUpgradesCard.style.opacity = '1';
                  originalLightUpgradesCard.style.position = 'static';
                  originalLightUpgradesCard.style.zIndex = 'auto';
                  
                  // Make sure it's positioned in our prism content
                  const prismMainArea = document.getElementById('prismMainArea');
                  if (prismMainArea && !prismMainArea.contains(originalLightUpgradesCard)) {
                    // Insert it into the prism-top-row structure
                    const prismTopRow = prismMainArea.querySelector('.prism-top-row.triple');
                    if (prismTopRow) {
                      prismTopRow.appendChild(originalLightUpgradesCard);
                      console.log('Restored: Moved original lightUpgradesCard to prism top row');
                    } else {
                      prismMainArea.appendChild(originalLightUpgradesCard);
                      console.log('Restored: Moved original lightUpgradesCard to prism main area');
                    }
                  }
                  
                  // Ensure all generator cards and buttons are properly visible
                  const generatorCards = originalLightUpgradesCard.querySelectorAll('.generator-card');
                  generatorCards.forEach(card => {
                    card.style.display = 'block';
                    card.style.visibility = 'visible';
                    card.style.opacity = '1';
                  });
                  
                  // Ensure all generator buttons are properly visible
                  const generatorButtons = originalLightUpgradesCard.querySelectorAll('button[id$="GenBtn"]');
                  generatorButtons.forEach(button => {
                    button.style.display = 'inline-block';
                    button.style.visibility = 'visible';
                    button.style.opacity = '1';
                  });
                  
                  console.log('Restored: Made lightUpgradesCard fully visible with all generators');
                } else {
                  console.log('Restored: Could not find original lightUpgradesCard, creating fallback generators');
                  // Create fallback generator structure if original is missing
                  const prismMainArea = document.getElementById('prismMainArea');
                  if (prismMainArea) {
                    const generatorCard = document.createElement('div');
                    generatorCard.className = 'card';
                    generatorCard.id = 'lightUpgradesCard';
                    generatorCard.innerHTML = `
                      <h2>Light Generators</h2>
                      <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #666;">Generators produce particles that boost light gain from clicking prism tiles</p>
                      <div class="generator-card light">
                        <button id="lightGenBtn" onclick="handleLightGenClick('light')">Light Generator</button>
                        <div>Light Particles: <span id="lightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card redlight">
                        <button id="redlightGenBtn" onclick="handleLightGenClick('redlight')">Redlight Generator</button>
                        <div>Red Particles: <span id="redlightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card orangelight">
                        <button id="orangelightGenBtn" onclick="handleLightGenClick('orangelight')">Orangelight Generator</button>
                        <div>Orange Particles: <span id="orangelightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card yellowlight">
                        <button id="yellowlightGenBtn" onclick="handleLightGenClick('yellowlight')">Yellowlight Generator</button>
                        <div>Yellow Particles: <span id="yellowlightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card greenlight">
                        <button id="greenlightGenBtn" onclick="handleLightGenClick('greenlight')">Greenlight Generator</button>
                        <div>Green Particles: <span id="greenlightparticleCount">0</span></div>
                      </div>
                      <div class="generator-card bluelight">
                        <button id="bluelightGenBtn" onclick="handleLightGenClick('bluelight')">Bluelight Generator</button>
                        <div>Blue Particles: <span id="bluelightparticleCount">0</span></div>
                      </div>
                    `;
                    prismMainArea.appendChild(generatorCard);
                  }
                }
              }, 100);
              
              // Create light grid tiles
              setTimeout(() => {
                const newLightGrid = document.getElementById('lightGrid');
                if (newLightGrid) {
                  for (let i = 0; i < 49; i++) {
                    const tile = document.createElement('div');
                    tile.className = 'light-tile';
                    tile.style.cssText = 'width: 40px; height: 40px; border: 1px solid #ccc; background: #f9f9f9; cursor: pointer;';
                    tile.addEventListener('click', function() {
                      if (typeof clickLightTile === 'function') {
                        clickLightTile(i);
                      }
                    });
                    newLightGrid.appendChild(tile);
                  }
                  console.log('Restored: manual light grid with 49 tiles');
                  
                  // Try to initialize the grid properly with prism functions
                  if (typeof initPrismGrid === 'function') {
                    initPrismGrid();
                    console.log('Restored: initPrismGrid() after manual creation');
                  }
                  
                  // Use setupPrismGrid if available, otherwise fall back to manual setup
                  if (typeof window.setupPrismGrid === 'function') {
                    window.setupPrismGrid();
                    console.log('Restored: setupPrismGrid() after manual creation');
                  } else if (typeof setupPrismGrid === 'function') {
                    setupPrismGrid();
                    console.log('Restored: setupPrismGrid() after manual creation');
                  } else if (typeof clickLightTile === 'function' && lightGrid) {
                    // Manually setup grid clicks if setupPrismGrid doesn't exist
                    const tiles = lightGrid.querySelectorAll('.light-tile');
                    tiles.forEach((tile, index) => {
                      tile.onclick = () => {
                        console.log('Light tile clicked:', index);
                        clickLightTile(index);
                        
                        // Force comprehensive updates after click
                        setTimeout(() => {
                          console.log('Restored: Starting post-click updates, prismState:', window.prismState);
                          
                          // Update light counters
                          if (typeof window.updateAllLightCounters === 'function') {
                            window.updateAllLightCounters();
                            console.log('Restored: Called updateAllLightCounters()');
                          } else if (typeof window.forceUpdateAllLightCounters === 'function') {
                            window.forceUpdateAllLightCounters();
                            console.log('Restored: Called forceUpdateAllLightCounters()');
                          }
                          
                          // Update generator buttons
                          if (typeof window.updateLightGeneratorButtons === 'function') {
                            window.updateLightGeneratorButtons();
                            console.log('Restored: Called updateLightGeneratorButtons()');
                          }
                          
                          // Force update boost text spans
                          if (typeof window.updateBoostDisplays === 'function') {
                            window.updateBoostDisplays();
                            console.log('Restored: Called updateBoostDisplays()');
                          }
                          
                          // Manual update of light currency displays with proper values
                          const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
                          lightTypes.forEach(type => {
                            const countEl = document.getElementById(type + 'Count');
                            if (countEl && window.prismState && window.prismState[type]) {
                              const oldValue = countEl.textContent;
                              if (typeof window.formatNumber === 'function') {
                                countEl.textContent = window.formatNumber(window.prismState[type]);
                              } else if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                                countEl.textContent = DecimalUtils.formatDecimal(window.prismState[type]);
                              }
                              console.log(`Restored: Updated ${type}Count from ${oldValue} to ${countEl.textContent}`);
                            }
                          });
                        }, 50);
                      
                      };
                    });
                    console.log('Restored: Manual grid click setup with updateAllLightCounters');
                  } else {
                    console.log('Restored: No grid setup functions found');
                  }
                  
                  // Update light counters again after grid setup
                  if (typeof updateAllLightCounters === 'function') {
                    updateAllLightCounters();
                    console.log('Restored: Updated light counters after grid setup');
                  }
                  
                  // Setup prism tab buttons
                  const prismMainBtn = document.getElementById('prismMainBtn');
                  const prismAdvancedBtn = document.getElementById('prismAdvancedBtn');
                  const prismMainArea = document.getElementById('prismMainArea');
                  const prismAdvancedArea = document.getElementById('prismAdvancedArea');
                  
                  if (prismMainBtn && prismAdvancedBtn && prismMainArea && prismAdvancedArea) {
                    prismMainBtn.addEventListener('click', function() {
                      prismMainBtn.classList.add('active');
                      prismAdvancedBtn.classList.remove('active');
                      prismMainArea.style.display = 'block';
                      prismAdvancedArea.style.display = 'none';
                    });
                    
                    prismAdvancedBtn.addEventListener('click', function() {
                      prismAdvancedBtn.classList.add('active');
                      prismMainBtn.classList.remove('active');
                      prismAdvancedArea.style.display = 'block';
                      prismMainArea.style.display = 'none';
                      
                      // Ensure advanced prism UI is rendered when tab is clicked
                      setTimeout(() => {
                        if (typeof window.renderAdvancedPrismUI === 'function') {
                          try {
                            window.renderAdvancedPrismUI();
                            console.log('Restored: Advanced prism UI rendered on tab click');
                          } catch (error) {
                            console.log('Restored: Error rendering advanced prism UI on tab click:', error);
                          }
                        }
                      }, 50);
                    });
                    
                    console.log('Restored: Prism tab button functionality');
                  }
                  
                  // Final comprehensive update to ensure everything is working
                  setTimeout(function() {
                    // Ensure the original light generators card is visible and functional
                    const lightUpgradesCard = document.getElementById('lightUpgradesCard');
                    if (lightUpgradesCard) {
                      lightUpgradesCard.style.display = 'block';
                      lightUpgradesCard.style.visibility = 'visible';
                      lightUpgradesCard.style.opacity = '1';
                      
                      // Ensure all generator buttons and their parent cards are visible
                      const generatorButtons = ['lightGenBtn', 'redlightGenBtn', 'orangelightGenBtn', 'yellowlightGenBtn', 'greenlightGenBtn', 'bluelightGenBtn'];
                      generatorButtons.forEach(btnId => {
                        const btn = document.getElementById(btnId);
                        if (btn) {
                          btn.style.display = 'block';
                          btn.style.visibility = 'visible';
                          // Also ensure the parent generator-card is visible
                          const parentCard = btn.closest('.generator-card');
                          if (parentCard) {
                            parentCard.style.display = 'flex';
                            parentCard.style.visibility = 'visible';
                            parentCard.style.opacity = '1';
                          }
                          console.log(`Restored: ${btnId} and its parent card made visible`);
                        } else {
                          console.log(`Restored: ${btnId} not found in final update`);
                        }
                      });
                      
                      // Also ensure particle count elements are visible
                      const particleCounts = ['lightparticleCount', 'redlightparticleCount', 'orangelightparticleCount', 'yellowlightparticleCount', 'greenlightparticleCount', 'bluelightparticleCount'];
                      particleCounts.forEach(countId => {
                        const countEl = document.getElementById(countId);
                        if (countEl) {
                          countEl.style.display = 'inline';
                          countEl.style.visibility = 'visible';
                        }
                      });
                      
                      // Initialize the full prism system
                      if (typeof window.initPrism === 'function') {
                        console.log('Restored: Re-initializing prism system in final update');
                        window.initPrism();
                      }
                      
                      // Update light generator buttons using the original function
                      if (typeof window.updateLightGeneratorButtons === 'function') {
                        window.updateLightGeneratorButtons();
                        console.log('Restored: Updated original light generator buttons in final update');
                      } else {
                        console.log('Restored: updateLightGeneratorButtons still not available in final update');
                      }
                      
                      // Ensure light counters are properly updated
                      if (typeof window.updateAllLightCounters === 'function') {
                        window.updateAllLightCounters();
                        console.log('Restored: Force updated all light counters in final update');
                      } else if (typeof window.forceUpdateAllLightCounters === 'function') {
                        window.forceUpdateAllLightCounters();
                        console.log('Restored: Force updated all light counters (alternative) in final update');
                      }
                      
                      // Force a full prism system restart to ensure everything works
                      setTimeout(() => {
                        // First, re-initialize the prism system completely
                        console.log('Restored: Starting full prism system initialization');
                        console.log('Restored: Available window functions:', {
                          initPrism: typeof window.initPrism,
                          initializeDOMCache: typeof window.initializeDOMCache,
                          setupPrismGrid: typeof window.setupPrismGrid,
                          updateAllLightCounters: typeof window.updateAllLightCounters,
                          updateLightGeneratorButtons: typeof window.updateLightGeneratorButtons,
                          clickLightTile: typeof window.clickLightTile || typeof clickLightTile
                        });
                        
                        if (typeof window.initPrism === 'function') {
                          window.initPrism();
                          console.log('Restored: Re-initialized prism system');
                        }
                        
                        if (typeof window.initializeDOMCache === 'function') {
                          window.initializeDOMCache();
                          console.log('Restored: Re-initialized DOM cache');
                        }
                        
                        // Set up the prism grid properly
                        if (typeof window.setupPrismGrid === 'function') {
                          window.setupPrismGrid();
                          console.log('Restored: Set up prism grid');
                        }
                        
                        if (typeof window.updateAllLightCounters === 'function') {
                          window.updateAllLightCounters();
                          console.log('Restored: Final light counter update');
                        }
                        
                        if (typeof window.updateLightGeneratorButtons === 'function') {
                          window.updateLightGeneratorButtons();
                          console.log('Restored: Final generator button update');
                        }
                        
                        // Final check to ensure lightUpgradesCard is visible
                        const finalLightUpgradesCard = document.getElementById('lightUpgradesCard');
                        if (finalLightUpgradesCard) {
                          finalLightUpgradesCard.style.display = 'block';
                          finalLightUpgradesCard.style.visibility = 'visible';
                          finalLightUpgradesCard.style.opacity = '1';
                          
                          // Ensure it's in the prism area
                          const prismMainArea = document.getElementById('prismMainArea');
                          if (prismMainArea && !prismMainArea.contains(finalLightUpgradesCard)) {
                            prismMainArea.appendChild(finalLightUpgradesCard);
                            console.log('Restored: Final move of lightUpgradesCard to prism area');
                          }
                        }
                        
                        // Final check for advanced prism rendering
                        if (typeof window.renderAdvancedPrismUI === 'function') {
                          try {
                            window.renderAdvancedPrismUI();
                            console.log('Restored: Final advanced prism UI render successful');
                          } catch (error) {
                            console.log('Restored: Final advanced prism UI render error:', error);
                          }
                        }
                        
                        // Check if prismState exists and has values
                        console.log('Restored: Current prismState:', window.prismState);
                        
                        console.log('Restored: Prism system fully restored!');
                      }, 500);
                    }
                    
                    // Update all light counters with proper formatting
                    const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
                    lightTypes.forEach(type => {
                      const countEl = document.getElementById(type + 'Count');
                      if (countEl && window.prismState && window.prismState[type]) {
                        if (typeof DecimalUtils !== 'undefined' && typeof DecimalUtils.formatDecimal === 'function') {
                          countEl.textContent = DecimalUtils.formatDecimal(window.prismState[type]);
                        } else {
                          countEl.textContent = window.prismState[type].toString();
                        }
                      }
                      
                      // Update generator display if it exists
                      if (typeof window.updateLightGeneratorDisplay === 'function') {
                        window.updateLightGeneratorDisplay(type);
                      }
                    });
                    
                    console.log('Restored: Final comprehensive prism update completed');
                  }, 200);
                }
              }, 50);
            }
          }, 100);
        } else {
          console.log('Prism tab appears to be working correctly');
        }
      }
    }, 50);
    
    console.log('Floor 1: Cleaned up Floor 2 department backgrounds, using original tab switching');
  }
};

function handleFloor2DepartmentTabs(subTabId) {
  // Add a small delay to ensure the tab has been switched first
  setTimeout(() => {
    if (window.currentFloor === 2) {
      const terrariumTab = document.getElementById('terrariumTab');
      const gamblingMainTab = document.getElementById('gamblingMain');
      
      if (subTabId === 'gamblingMain') {
        // On Floor 2, show terrarium instead of cargo
        if (terrariumTab) terrariumTab.style.display = 'block';
        if (gamblingMainTab) gamblingMainTab.style.display = 'none';
        console.log('Showing Terrarium on Floor 2');
      } else if (subTabId === 'generatorMainTab' || subTabId === 'prismSubTab') {
        // Hide terrarium when switching to departments
        if (terrariumTab) terrariumTab.style.display = 'none';
        if (gamblingMainTab) gamblingMainTab.style.display = 'none';
        
        if (subTabId === 'generatorMainTab') {
          // Water Filtration Department
          if (window.waterFiltration && typeof window.waterFiltration.renderWaterFiltrationUI === 'function') {
            console.log('Rendering Water Filtration UI for Floor 2');
            window.waterFiltration.renderWaterFiltrationUI();
          }
        } else if (subTabId === 'prismSubTab') {
          // Observatory Department
          if (window.observatory && typeof window.observatory.renderObservatoryUI === 'function') {
            console.log('Rendering Observatory UI for Floor 2');
            window.observatory.renderObservatoryUI();
          }
        }
      }
    }
  }, 100);
}

window.addEventListener('load', () => {
  updateGlobalBlackoutOverlay();
  updateGlobalDimOverlay();
  
  // Check if we need to render Floor 2 departments on page load
  setTimeout(() => {
    if (window.currentFloor === 2) {
      renderFloor2Departments();
    }
  }, 200);
});

// Enhanced Observatory Time-of-Day Background System
function applyObservatoryTimeOfDay() {
  // Remove all existing time-of-day classes
  document.body.classList.remove('day-time', 'dusk-time', 'night-time');
  document.documentElement.classList.remove('day-time', 'dusk-time', 'night-time');
  
  // Get current time if day/night system is available
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const minutes = window.daynight.getTime();
    const hours = Math.floor(minutes / 60) % 24;
    
    let timeClass = 'night-time'; // Default to most mystical
    
    if (hours >= 6 && hours < 18) {
      // Day time: 6:00 AM - 6:00 PM
      timeClass = 'day-time';
    } else if (hours >= 18 && hours < 22) {
      // Dusk time: 6:00 PM - 10:00 PM
      timeClass = 'dusk-time';
    } else {
      // Night time: 10:00 PM - 6:00 AM (most mystical)
      timeClass = 'night-time';
    }
    
    // Apply the time-specific class for enhanced mystical atmosphere
    document.body.classList.add(timeClass);
    document.documentElement.classList.add(timeClass);
    
    console.log(`Observatory: Applied ${timeClass} mystical atmosphere (${hours}:${(minutes % 60).toString().padStart(2, '0')})`);
  } else {
    // Fallback to night-time for maximum mystical effect
    document.body.classList.add('night-time');
    document.documentElement.classList.add('night-time');
    console.log('Observatory: Applied default night-time mystical atmosphere');
  }
}

// Enhanced Water Filtration Time-of-Day Background System
function applyWaterFiltrationTimeOfDay() {
  // Remove all existing time-of-day classes
  document.body.classList.remove('day-time', 'dusk-time', 'night-time');
  document.documentElement.classList.remove('day-time', 'dusk-time', 'night-time');
  
  // Get current time if day/night system is available
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const minutes = window.daynight.getTime();
    const hours = Math.floor(minutes / 60) % 24;
    
    let timeClass = 'night-time'; // Default to darkest industrial
    
    if (hours >= 6 && hours < 18) {
      // Day time: 6:00 AM - 6:00 PM
      timeClass = 'day-time';
    } else if (hours >= 18 && hours < 22) {
      // Dusk time: 6:00 PM - 10:00 PM
      timeClass = 'dusk-time';
    } else {
      // Night time: 10:00 PM - 6:00 AM (darkest industrial)
      timeClass = 'night-time';
    }
    
    // Apply the time-specific class for enhanced industrial atmosphere
    document.body.classList.add(timeClass);
    document.documentElement.classList.add(timeClass);
    
    console.log(`Water Filtration: Applied ${timeClass} industrial atmosphere (${hours}:${(minutes % 60).toString().padStart(2, '0')})`);
  } else {
    // Fallback to night-time for darker industrial effect
    document.body.classList.add('night-time');
    document.documentElement.classList.add('night-time');
    console.log('Water Filtration: Applied default night-time industrial atmosphere');
  }
}

// Enhanced Terrarium Time-of-Day Background System
function applyTerrariumTimeOfDay() {
  // Remove all existing time-of-day classes
  document.body.classList.remove('day-time', 'dusk-time', 'night-time');
  document.documentElement.classList.remove('day-time', 'dusk-time', 'night-time');
  
  // Get current time if day/night system is available
  if (window.daynight && typeof window.daynight.getTime === 'function') {
    const minutes = window.daynight.getTime();
    const hours = Math.floor(minutes / 60) % 24;
    
    let timeClass = 'night-time'; // Default to night
    
    if (hours >= 6 && hours < 18) {
      // Day time: 6:00 AM - 6:00 PM
      timeClass = 'day-time';
    } else if (hours >= 18 && hours < 22) {
      // Dusk time: 6:00 PM - 10:00 PM
      timeClass = 'dusk-time';
    } else {
      // Night time: 10:00 PM - 6:00 AM
      timeClass = 'night-time';
    }
    
    // Apply the time-specific class for enhanced natural atmosphere
    document.body.classList.add(timeClass);
    document.documentElement.classList.add(timeClass);
    
    console.log(`Terrarium: Applied ${timeClass} natural atmosphere (${hours}:${(minutes % 60).toString().padStart(2, '0')})`);
  } else {
    // Fallback to day-time for natural effect
    document.body.classList.add('day-time');
    document.documentElement.classList.add('day-time');
    console.log('Terrarium: Applied default day-time natural atmosphere');
  }
}

// Update water filtration atmosphere when time changes
if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(() => {
    // Update atmosphere based on current department
    if (document.body.classList.contains('water-filtration-bg')) {
      applyWaterFiltrationTimeOfDay();
    } else if (document.body.classList.contains('observatory-bg')) {
      applyObservatoryTimeOfDay();
    } else if (document.body.classList.contains('terrarium-bg')) {
      applyTerrariumTimeOfDay();
    }
  });
}

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
  { text: "If you drop soap in the generator, it gets extra clean!", condition: () => true },
  { text: "Sometimes I dream of a world made entirely of bubbles.", condition: () => true },
  { text: "I once tried to wash a dirty generated box. It just got soggy.", condition: () => true },
  { text: "I have never lost a bubble-blowing contest.", condition: () => true },
  { text: "If you see a soap bar missing from your room, it wasn't me. Probably.", condition: () => true },
  { text: "I keep a secret stash of ultra-rare soaps. Don't tell anyone!", condition: () => true },
  { text: "The generator hums a different tune when it's extra clean.", condition: () => true },
  { text: "I once tried to invent soap-powered boxes. It didn't work, but it was fun!", condition: () => true },
  { text: "If you ever need advice on soap, you know who to ask.", condition: () => true },
  { text: "I bet even the Swa elites can't out-clean me!", condition: () => true },
  { text: "Sometimes I wonder if the bubbles are watching us back.", condition: () => true },
  { text: "Soap never panics. I just get extra foamy.", condition: () => true },
  { text: "If you see a bubble floating by, make a wish!", condition: () => true },
  { text: "I wonder why the boss doesn't like me.", condition: () => true }, 
  { text: "I'm sure the boss is jealous of my soap collections.", condition: () => true },
  { text: "Are you jealous of my soap collections?", condition: () => true },
  { text: "Don't tell anyone I feed the generators with soap.", condition: () => true },
  { text: "I should probably stop letting the power run out... nahh I'm sure it's fine.", condition: () => true },
  { text: "So... why is the power running out so quickly?", condition: () => true },
  { text: "Generators will not work when the power is offline.", condition: () => true },
  { text: "Hello there Peachy!", condition: () => true },
  { text: "Have you met Vi yet? They are working in the prism lab.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "Vi's full name is actually Vivien, but Vi sounds better.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "Vi always keeps the prism lab spotless. I respect that!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Sometimes I catch Vi talking to the prisms. I talk to my soap bars, so I get it.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Mystic is the one bothered the most by the power going out. Trust me.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "Mystic reminds me alot of Gordon Ramsey.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "If you wanna experience true hell, try cooking with Mystic.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "I tried asking Mystic to cook me a soap dish, they refused.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "Lepre showed me their agility skills. I was impressed!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "I tried buying a battery token from Lepre but I did not have enough swa bucks, and they said 'I'm sorry Soap, I can't give credit, come back when you're a little bit, mhhh, richer!'", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "I once tried using my bubble gun against Lepre, AND THEY DODGED EVERY SINGLE BUBBLES!!!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "Fluzzer is a whirlwind in the terrarium. I wish I had that much energy! All I have is slipperyness.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(6) },
  { text: "I once tried to make soap out of fluff. It was a fluffy disaster.", condition: () => true },
  { text: "If you ever see a square bubble, run away from it, these got square rooted.", condition: () => true },
  { text: "I keep a soap bar in my pocket for emergencies.", condition: () => true },
  { text: "If you hear squeaking, it's just me polishing the generator.", condition: () => true },
  { text: "If you ever need a bubble shield, just ask! I've got plenty.", condition: () => true },
  { text: "I tried to make a soap sculpture. It melted in the shower.", condition: () => true },
  { text: "Soap never gets tired, just a little slippery.", condition: () => true },
  { text: "If you see a rainbow bubble, make a wish for extra fluff!", condition: () => true },
  { text: "I once made a soap bar shaped like a box. It was too realistic!", condition: () => true },
  { text: "So are my doors permanently jammed now?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "Vi's the one who actually introduced me to this job.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I wonder how Vi is doing, I'll go talk to them on our break time.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "It smells like chlorine inside the prism lab? Oh that's just Vi ahah.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "Vi told me you act very drunk while inside the prism lab.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "Each expansions, We're getting more and more materials from the Swa elites, I'm thinking of creating some sort of charger, but I'll need more ressources to do that.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(3),},
  { text: "The charger's progress is going great, but its not ready to use yet.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(4),},
  { text: "Thanks to the facilities fifth expansion, I received the ressources to build a charger, and it's finally working!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(5),},
  { text: "I tried to race Bijou once. They won just because you helped them! I call cheats on that!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "If Bijou ever gets dirty, I've got the soap ready!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "Bijou collects tokens, I collect soaps. We both have our hobbies.", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "I offered Bijou a bubble bath, but they said they're too busy collecting tokens!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  
  // Special Auto Recharge Dialogue - Only when friendship level 4+
  { text: "Hey Peachy! I've been working on something special for the power generator. An auto recharge system!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "My auto recharge system uses soap-powered micro batteries! Clean energy at its finest!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "You know what's better than manual power recharging? AUTO power recharging! I'm a genius!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "The auto recharge charges are stored in little soap bubble containers. Isn't that neat?", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "I programmed the auto recharge to kick in when power drops below 20. Smart, right?", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "The best part about my auto recharge system? It's completely soap-powered and eco-friendly!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "I spent weeks perfecting the auto recharge timer. Now it generates charges automatically!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "Between you and me, I think my auto recharge system is better than anything the Swa elites could make.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "Thanks for helping me get better at my job! The auto recharge system is my gift to the facility.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "No more power outages on my watch! My auto recharge system has got us covered.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "I wonder if I can make an auto recharge system for soap dispensers next... hmm.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  { text: "The auto recharge storage scales with our friendship level. The more we trust each other, the better it works!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 4;
  }},
  
  // Special Soap Generator Anomaly Dialogue - Only when anomaly is active
  { text: "Wait... something's wrong. The power generators are acting strange!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "Did you see that? The generators just turned into soap dispensers! This is amazing!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "I can't believe it! My soap magic is spreading to the generators!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "This is the best day ever! Finally, the generators understand the power of soap!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "Look at all those bubbles floating around! It's like my dream come true!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "The generators are so much cleaner now! They've been upgraded to soap dispensers!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "I wonder if this soap generator anomaly was caused by my excessive soap enthusiasm?", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "Maybe if I concentrate really hard, I can make MORE things turn into soap dispensers!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "The whole facility is becoming more bubbly and clean! This is perfect!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "I should probably tell someone about this... but then again, why ruin a good thing?", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "The soap bubbles are floating everywhere! It's like living inside a giant bubble factory!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  { text: "I bet the other workers are wondering where all these bubbles are coming from. Hehe!", condition: () => window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly },
  
  // Search Mode Enhancement Dialogue - Only when friendship level 7+
  { text: "Hey! I just upgraded your anomaly resolver tool with a search function! Pretty cool, right?", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "I added a right-click search mode to your anomaly resolver. Now you can scan for nearby anomalies!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "The search function uses advanced soap bubble resonance to detect dimensional disturbances!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "I installed the search upgrade myself! Just right-click while in find mode to use it.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "My search mode enhancement can detect up to 3 anomalies at once! It's soap-powered, naturally.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "The anomaly search works by creating micro-bubbles that resonate with dimensional tears!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "I'm so proud of my search mode upgrade! No more guessing where anomalies might be hiding.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "The search function was tricky to build, but I managed to integrate it with your resolver perfectly!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "Thanks for trusting me enough to let me upgrade your equipment! The search mode is my masterpiece.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "Who knew soap chemistry could enhance anomaly detection? Science is amazing!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "Your anomaly resolver is now 150% more efficient thanks to my soap-based search algorithm!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "I hope you like the search mode! It should make finding anomalies much easier for you.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  
  // Anomaly-related quotes (only appear after doing an infinity reset at least once)
  { text: "Peachy, something weird is happening, the generators have been acting... bubbly weird.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I keep finding soap bubbles in places where there shouldn't be any. Is this the consequences of feeding soap to the generators?!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "That anomaly resolver of yours could use for an upgrade, but I don't trust you being able to use it correctly...", condition: () => {
    if (!window.infinitySystem || window.infinitySystem.totalInfinityEarned === 0) return false;
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level < 7;
  }},
  { text: "Hey Peachy, while you were sleeping I upgraded your anomaly resolver, by right clicking it will now detect if there's any anomaly in the facility, just a gift I wanted to give you for being such a good friend!", condition: () => {
    if (!window.infinitySystem || window.infinitySystem.totalInfinityEarned === 0) return false;
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    return level >= 7;
  }},
  { text: "I caught an anomaly trying to shut down the power, but I stopped it just in time!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The Swa elites warned us about reality fluctuations. Do you know what they mean by that?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I wanna see an anomaly that creates infinite soap bubbles!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Sometimes I wonder if I'M the anomaly. I mean, who else loves soap this much? The anomaly resolver is saying I'm only 2% anomalous? I don't believe it.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "These anomalies are making the facility more interesting! Finally, something as unpredictable as my soap experiments. Hopefully these anomalies don't become dangerous.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Reaching through infinity apparently made reality as slippery as a wet soap bar. How fitting!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomalies seem to avoid my soap collection area. Maybe they're afraid of getting too clean?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The other day, an anomaly turned my wrench into a bottle of ranch!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "These dimensional disturbances are like soap bubbles - beautiful, unpredictable, and they pop at random!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The facility's reality fabric is getting as slippery as my generator room floor.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
];

// Special disappointed quotes for when soap generator anomaly gets fixed
const soapDisappointedQuotes = [
  "Aww... the generators are back to normal. That was the best thing ever!",
  "No! The soap generators are gone! Why did you have to fix that?",
  "I can't believe you fixed the most amazing anomaly ever. I'm heartbroken.",
  "The bubbles stopped floating... This is the saddest day of my life.",
  "Why would you want to get rid of soap generators? They were perfect!",
  "I guess it's back to boring old power generators. *sigh*",
  "I'll never forget the day the generators turned into soap dispensers. Best. Day. Ever.",
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

// Special click quotes for when soap generator anomaly is active
const soapAnomalyClickQuotes = [
  "Did you see the generators?! They're all soap dispensers now!",
  "Stop poking me! I'm busy enjoying this soap generator anomaly!",
  "This is amazing! The whole facility is turning into a soap paradise!",
  "Look at all these bubbles! Isn't this the best thing ever?",
  "I don't know how this happened, but I LOVE IT!",
  "The generators are finally speaking my language - soap!",
  "Do you think this anomaly is permanent? I hope so!",
  "I'm trying to figure out how to make this happen to more things!",
  "This is way better than regular boring power generators!",
  "Hey! I'm admiring the soap bubbles floating around!",
  "Stop interrupting me! I'm studying this beautiful anomaly!",
  "Maybe I caused this with my soap enthusiasm? Worth it!",
  "The bubbles are so pretty! Don't distract me from watching them!",
  "This is the most soap-tastic day of my life!",
  "I wonder if I can teach the other workers about the beauty of soap generators?"
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
  
  // Check if soap generator anomaly is active - if so, only show anomaly dialogue
  let availableQuotes;
  if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly) {
    // Filter for only anomaly-specific dialogue
    availableQuotes = soapQuotes.filter(q => {
      return q.condition() && q.text.includes('generator') || q.text.includes('soap') || q.text.includes('bubble') || q.text.includes('anomaly');
    });
    // If no specific anomaly quotes available, use all anomaly quotes
    if (availableQuotes.length === 0) {
      availableQuotes = soapQuotes.filter(q => q.condition() && q.condition.toString().includes('soapGeneratorAnomaly'));
    }
  } else {
    // Normal behavior - exclude anomaly dialogue when anomaly is not active
    availableQuotes = soapQuotes.filter(q => {
      return q.condition() && !q.condition.toString().includes('soapGeneratorAnomaly');
    });
  }
  
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
  
  // Choose quotes based on whether soap generator anomaly is active
  let quoteArray;
  if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly) {
    quoteArray = soapAnomalyClickQuotes;
  } else {
    quoteArray = soapClickQuotes;
  }
  
  const randomQuote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
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

// Show special disappointed speech when soap generator anomaly is fixed
function showSoapDisappointedSpeech() {
  const soapImg = document.getElementById("swariaGeneratorCharacter");
  const soapSpeech = document.getElementById("swariaGeneratorSpeech");
  if (!soapImg || !soapSpeech) return;
  
  // Stop any existing speech timers
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
  if (window.soapCurrentSpeechTimeout) {
    clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = null;
  }
  
  window.soapIsTalking = true;
  const randomDisappointedQuote = soapDisappointedQuotes[Math.floor(Math.random() * soapDisappointedQuotes.length)];
  soapSpeech.textContent = randomDisappointedQuote;
  soapSpeech.style.display = "block";
  soapImg.src = "assets/icons/soap speech.png";
  
  // Show disappointed speech for longer (12 seconds)
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = "assets/icons/soap.png";
    window.soapIsTalking = false;
    window.soapCurrentSpeechTimeout = null;
    startSoapRandomSpeechTimer();
  }, 12000);
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
    const genTab = document.getElementById("generatorMainTab");
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
  if (subTabId === 'generatorMainTab') {
    setTimeout(() => {
      startSoapRandomSpeechTimer();
    }, 1000); 
  } else {
    stopSoapRandomSpeechTimer();
  }
};

function applyKpSoftcap(kp) {
  const softcapStart = new Decimal("1e20");
  const mildcapStart = new Decimal("1e40");
  kp = new Decimal(kp);
  if (kp.lte(softcapStart)) return kp;
  let softcapped = softcapStart.mul(kp.div(softcapStart).pow(0.4));
  if (softcapped.lte(mildcapStart)) return softcapped;
  return mildcapStart.mul(softcapped.div(mildcapStart).pow(0.2));
}

function getBoxGeneratorBoost() {
  if (!boughtElements[12]) return new Decimal(1);
  let count = 0;
  if (typeof generators !== 'undefined') {
    count = generators.filter(g => g.unlocked).length;
  }
  return new Decimal(1).add(new Decimal(count).mul(0.1)); 
}

function getBoxTypeBoost(type) {
  if (!boughtElements[11]) return new Decimal(1);
  return new Decimal(1).add(new Decimal(state.boxesProducedByType[type] || 0).mul(0.01));
}

window.generators = generators;
window.autosaveInterval = setInterval(() => {
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
  if (typeof settings.notation === 'undefined') settings.notation = 'numeral';
  if (typeof settings.disableOfflineProgress === 'undefined') settings.disableOfflineProgress = false;
}
// Initialize notation preference for decimal utils
localStorage.setItem('notationPreference', settings.notation);
window.settings = settings;
applySettings();

// Initialize offline progress prevention if setting is enabled
if (settings.disableOfflineProgress && typeof window.setupOfflineProgressPrevention === 'function') {
  window.setupOfflineProgressPrevention();
}

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
  let preview = new Decimal(baseResource).mul(10).sqrt().mul(new Decimal(1).add(new Decimal(ps.light || 0).mul(0.01))).floor();
  const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
  if (kpDecimal.eq(0)) preview = new Decimal(10);
  let kpMultiplier = new Decimal(1).add(new Decimal(ps.light || 0).mul(0.01));
  preview = preview.mul(kpMultiplier);
  preview = applyKpSoftcap(preview);
  
  // Apply infinity multiplier using the infinity system
  if (typeof window.infinitySystem !== 'undefined' && infinitySystem.getKpInfinityMultiplier) {
    const infinityMultiplier = infinitySystem.getKpInfinityMultiplier();
    preview = preview.mul(infinityMultiplier);
  }
  
  if (typeof window.getKpNectarUpgradeEffect === 'function' && typeof window.terrariumKpNectarUpgradeLevel === 'number') {
    const nectarEffect = window.getKpNectarUpgradeEffect(window.terrariumKpNectarUpgradeLevel);
    preview = preview.mul(nectarEffect).floor();
  }
  
  // Apply nectarize milestone KP exponent boost
  if (typeof window.getNectarizeMilestoneBonus === 'function') {
    const milestoneBonus = window.getNectarizeMilestoneBonus();
    if (milestoneBonus.kpExponent && milestoneBonus.kpExponent.gt(0)) {
      preview = preview.pow(new Decimal(1).add(milestoneBonus.kpExponent));
    }
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
        
        // Check if save has infinity data
        const infinityData = data.infinityTreeData;
        const hasInfinityResets = infinityData && (infinityData.totalInfinityEarned > 0);
        
        let displayText;
        if (hasInfinityResets) {
          // Use the correct total infinity earned from resets
          const totalInfinity = infinityData.totalInfinityEarned || 0;
          displayText = `Total infinity: ${totalInfinity}`;
        } else {
          displayText = `Expansion: ${data.state?.grade || 1}`;
        }
        
        summary.innerHTML = `
          <div>${displayText}</div>
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
            // Don't include old infinity counts in new saves - slot-specific system handles this
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
  // Safety checks to prevent corrupted saves
  if (!window.state || !window.kitchenIngredients || !window.friendship) {
    console.error('Save aborted: Essential game objects missing');
    return false;
  }
  
  // Additional safety: Don't save if values seem corrupted
  if (!window.state.fluff || window.state.fluff.lt && window.state.fluff.lt(0)) {
    console.error('Save aborted: Game state appears corrupted');
    return false;
  }
  
  try {
    const stateCopy = { ...state };
    delete stateCopy.hardModeQuestProgress;
    delete stateCopy.hardModeQuestActive;
    delete stateCopy.soapChargeQuest;
    // Don't save old infinity counts - use slot-specific system instead
    delete stateCopy.fluffInfinityCount;
    delete stateCopy.swariaInfinityCount;
    delete stateCopy.feathersInfinityCount;
    delete stateCopy.artifactsInfinityCount;
    delete stateCopy.fluffRateInfinityCount;
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
    },
    // Add infinity data directly to slot save
    infinityData: window.infinitySystem ? {
      counts: window.infinitySystem.counts || {},
      everReached: window.infinitySystem.everReached || {},
      infinityPoints: window.infinitySystem.infinityPoints.toString(),
      infinityTheorems: window.infinitySystem.infinityTheorems,
      totalInfinityTheorems: window.infinitySystem.totalInfinityTheorems,
      theoremProgress: window.infinitySystem.theoremProgress.toString(),
      totalInfinityEarned: window.infinitySystem.totalInfinityEarned,
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
    },
    
    // Add infinity upgrades and caps
    infinityUpgrades: window.infinityUpgrades || {},
    infinityCaps: window.infinityCaps || {}
  };
  
  // Use DecimalUtils to serialize the save data for slot storage
  const serializedSaveData = DecimalUtils.serializeGameState(saveData);
  
  // Create backup before saving
  const backupKey = `swariaSaveSlot${slotNumber}_backup`;
  const currentSave = localStorage.getItem(`swariaSaveSlot${slotNumber}`);
  if (currentSave) {
    localStorage.setItem(backupKey, currentSave);
  }
  
  localStorage.setItem(`swariaSaveSlot${slotNumber}`, JSON.stringify(serializedSaveData));
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
  return true;
  } catch (error) {
    console.error('Error in saveToSlot:', error);
    alert('Save failed! Your progress was not saved to prevent corruption.');
    return false;
  }
}

function loadFromSlot(slotNumber) {
  const slotData = localStorage.getItem(`swariaSaveSlot${slotNumber}`);
  if (!slotData) return;
  try {
    currentSaveSlot = slotNumber; 
    localStorage.setItem('currentSaveSlot', slotNumber); 
    const rawData = JSON.parse(slotData);
    
    // Use DecimalUtils to deserialize the slot data
    const data = DecimalUtils.deserializeGameState(rawData);
    
    // Remove infinity data from main save structure - use slot-specific system instead
    delete data.infinityTreeData;
    delete data.infinityChallengeData;
    
    var save = data; 
    if (data.state) {
      Object.assign(state, data.state);
      // Don't load old infinity counts from save - use slot-specific system instead
      delete state.fluffInfinityCount;
      delete state.swariaInfinityCount;
      delete state.feathersInfinityCount;
      delete state.artifactsInfinityCount;
      delete state.fluffRateInfinityCount;
      if (typeof state.swabucks === 'undefined') {
        state.swabucks = 0;
      }
      
      // Restore element discovery progress for persistent element visibility
      if (typeof data.elementDiscoveryProgress !== 'undefined') {
        state.elementDiscoveryProgress = data.elementDiscoveryProgress;
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
    generatorUpgrades = data.generatorUpgrades ? JSON.parse(JSON.stringify(data.generatorUpgrades)) : { 
        common: 0, 
        uncommon: 0, 
        rare: 0, 
        legendary: 0, 
        mythic: 0 
    };
    
    // Convert to Decimal objects for consistency
    Object.keys(generatorUpgrades).forEach(key => {
        if (!DecimalUtils.isDecimal(generatorUpgrades[key])) {
            generatorUpgrades[key] = new Decimal(generatorUpgrades[key] || 0);
        }
    });
    
    // Keep window reference synced
    window.generatorUpgrades = generatorUpgrades;
    if (window.prismState && data.prismState) {
      Object.keys(window.prismState).forEach(k => delete window.prismState[k]);
      Object.assign(window.prismState, JSON.parse(JSON.stringify(data.prismState)));
    }
    if (data.generatorSpeedUpgrades || data.generatorSpeedMultipliers || data.generatorUpgradeLevels) {
      generators.forEach(gen => {
        gen.speedUpgrades = (data.generatorSpeedUpgrades && data.generatorSpeedUpgrades[gen.reward]) || 0;
        gen.speedMultiplier = (data.generatorSpeedMultipliers && data.generatorSpeedMultipliers[gen.reward]) || 1;
        gen.upgrades = (data.generatorUpgradeLevels && data.generatorUpgradeLevels[gen.reward]) || 0;
        gen.speed = gen.baseSpeed * new Decimal(1.3).pow(gen.speedUpgrades).toNumber() * (gen.speedMultiplier || 1);
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
      gen.speed = gen.baseSpeed * new Decimal(1.3).pow(gen.speedUpgrades || 0).toNumber() * (gen.speedMultiplier || 1);
    });
    if (data.generatorsUnlocked && Array.isArray(data.generatorsUnlocked)) {
      data.generatorsUnlocked.forEach((unlocked, idx) => {
        if (generators[idx]) generators[idx].unlocked = unlocked;
      });
    }
    if (window.charger) {
      if (typeof data.chargerCharge !== 'undefined') {
        window.charger.charge = new Decimal(data.chargerCharge);
      } else {
        window.charger.charge = new Decimal(0);
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
      window.charger.charge = new Decimal(data.chargerState.charge || 0);
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
    
    // Clear unlock states for fresh saves first
    if (typeof clearUnlockStatesForFreshSave === 'function') {
      clearUnlockStatesForFreshSave();
    }
    
    // Reset infinity system to defaults before loading slot-specific data
    if (window.infinitySystem) {
      window.infinitySystem.infinityPoints = new Decimal(0);
      window.infinitySystem.infinityTheorems = 0;
      window.infinitySystem.theoremProgress = new Decimal(0);
      window.infinitySystem.totalInfinityEarned = 0;
      window.infinitySystem.everReached = {
        fluff: false,
        swariaCoins: false,
        feathers: false,
        artifacts: false,
        light: false,
        redLight: false,
        orangeLight: false,
        yellowLight: false,
        greenLight: false,
        blueLight: false,
        terrariumPollen: false,
        terrariumFlowers: false,
        terrariumNectar: false,
        charge: false
      };
    }
    if (window.infinityUpgrades) {
      // Reset all upgrades to 0
      Object.keys(window.infinityUpgrades).forEach(key => {
        window.infinityUpgrades[key] = 0;
      });
    }
    if (window.infinityCaps) {
      window.infinityCaps = {};
    }
    if (typeof window.infinityChallenges !== 'undefined') {
      // Reset challenge states
      Object.keys(window.infinityChallenges).forEach(challengeId => {
        const challenge = window.infinityChallenges[challengeId];
        if (challenge && challenge.difficulties) {
          Object.keys(challenge.difficulties).forEach(diffId => {
            challenge.difficulties[diffId].unlocked = false;
            challenge.difficulties[diffId].completed = false;
          });
        }
        if (challenge) {
          challenge.visible = false;
          challenge.currentDifficulty = 0;
        }
      });
    }
    window.activeChallenge = 0;
    window.activeDifficulty = 0;
    
    // Load infinity data directly from slot save data
    if (data.infinityData && window.infinitySystem) {
      // Restore infinity counts
      if (data.infinityData.counts) {
        window.infinitySystem.counts = { ...window.infinitySystem.counts, ...data.infinityData.counts };
      }
      
      // Restore ever reached tracking
      if (data.infinityData.everReached) {
        window.infinitySystem.everReached = { ...window.infinitySystem.everReached, ...data.infinityData.everReached };
      }
      
      // Restore infinity points and theorems
      window.infinitySystem.infinityPoints = data.infinityData.infinityPoints ? new Decimal(data.infinityData.infinityPoints) : new Decimal(0);
      window.infinitySystem.infinityTheorems = data.infinityData.infinityTheorems || 0;
      window.infinitySystem.totalInfinityTheorems = data.infinityData.totalInfinityTheorems || 0;
      window.infinitySystem.theoremProgress = data.infinityData.theoremProgress ? new Decimal(data.infinityData.theoremProgress) : new Decimal(0);
      window.infinitySystem.totalInfinityEarned = data.infinityData.totalInfinityEarned || 0;
      
      if (typeof data.infinityData.lastInfinityPointsUpdate === 'number') {
        window.infinitySystem.lastInfinityPointsUpdate = data.infinityData.lastInfinityPointsUpdate;
      }
      
      // Update infinity displays after loading
      if (typeof updateInfinityBenefits === 'function') {
        updateInfinityBenefits();
      }
      if (typeof updateInfinitySubTabVisibility === 'function') {
        updateInfinitySubTabVisibility();
      }
    }
    
    // Load infinity upgrades from slot save data
    if (data.infinityUpgrades) {
      window.infinityUpgrades = { ...window.infinityUpgrades, ...data.infinityUpgrades };
    }
    
    // Load infinity caps from slot save data
    if (data.infinityCaps) {
      window.infinityCaps = { ...window.infinityCaps, ...data.infinityCaps };
    }
    
    // Use proper unlock check functions AFTER loading slot-specific data
    if (typeof checkControlCenterUnlock === 'function') {
      checkControlCenterUnlock();
    }
    if (typeof checkInfinityResearchUnlock === 'function') {
      checkInfinityResearchUnlock();
    }
    if (boughtElements[7]) {
      const genBtn = document.getElementById("generatorSubTabBtn");
      if (window.currentFloor === 2) {
        genBtn.style.display = "none";
      } else {
        genBtn.style.display = "inline-block";
      }
      document.getElementById("subTabNav").style.display = "flex";
    }
    // Check boutique button visibility based on expansion level
    updateBoutiqueButtonVisibility();
    // Show Lab (prismSubTabBtn) at grade >= 2, but hide on floor 2
    if (typeof state.grade !== 'undefined' && DecimalUtils.isDecimal(state.grade) && state.grade.gte(2)) {
      const labBtn = document.getElementById("prismSubTabBtn");
      if (labBtn) {
        if (window.currentFloor === 2) {
          labBtn.style.display = "none";
        } else {
          labBtn.style.display = "inline-block";
        }
      }
    }
    if (boughtElements[8]) {
      document.getElementById("graduationSubTabBtn").style.display = "inline-block";
      document.getElementById("knowledgeSubTabNav").style.display = "flex";
    }
    // Infinity research unlock is handled by checkInfinityResearchUnlock function above
    
    // Also run the unlock check to ensure proper state
    if (typeof checkInfinityResearchUnlock === 'function') {
      checkInfinityResearchUnlock();
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
    if (typeof data.terrariumPollen !== 'undefined') window.terrariumPollen = new Decimal(data.terrariumPollen || 0);
    if (typeof data.terrariumFlowers !== 'undefined') window.terrariumFlowers = new Decimal(data.terrariumFlowers || 0);
    if (typeof data.terrariumXP !== 'undefined') window.terrariumXP = new Decimal(data.terrariumXP || 0);
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
        Terrarium: { level: 0, points: 0 },
        Boutique: { level: 0, points: 0 }
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
    
    // Initialize slot-specific infinity counts after loading save data
    if (typeof window.initializeInfinityCountsForSlot === 'function') {
      window.initializeInfinityCountsForSlot();
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
    console.error('Error loading save file:', e);
    
    // Try to recover from backup
    const backupKey = `swariaSaveSlot${slotNumber}_backup`;
    const backupData = localStorage.getItem(backupKey);
    if (backupData && confirm('Main save file appears corrupted. Would you like to restore from backup?')) {
      try {
        localStorage.setItem(`swariaSaveSlot${slotNumber}`, backupData);
        loadFromSlot(slotNumber); // Try loading again
        return;
      } catch (backupError) {
        console.error('Backup recovery also failed:', backupError);
      }
    }
    
    alert('Error loading save file! If this persists, your save may be corrupted.');
  }
}

// Recovery function for corrupted saves
function recoverFromBackup(slotNumber) {
  const backupKey = `swariaSaveSlot${slotNumber}_backup`;
  const backupData = localStorage.getItem(backupKey);
  
  if (!backupData) {
    alert('No backup found for this slot.');
    return false;
  }
  
  if (confirm('This will restore your save from the last backup. Continue?')) {
    try {
      localStorage.setItem(`swariaSaveSlot${slotNumber}`, backupData);
      loadFromSlot(slotNumber);
      alert('Save restored from backup successfully!');
      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      alert('Failed to restore from backup.');
      return false;
    }
  }
  return false;
}

function deleteSlot(slotNumber) {
  if (confirm(`Are you sure you want to delete save slot ${slotNumber}?`)) {
    // Remove main save slot data
    localStorage.removeItem(`swariaSaveSlot${slotNumber}`);
    
    // Clean up all slot-specific data
    if (typeof getSaveSlotSpecificKey === 'function') {
      // Temporarily set the current save slot to the one being deleted
      const originalSlot = localStorage.getItem('currentSaveSlot');
      localStorage.setItem('currentSaveSlot', slotNumber.toString());
      
      // Remove infinity system data for this slot
      const infinityKey = getSaveSlotSpecificKey('infinitySystemData');
      localStorage.removeItem(infinityKey);
      
      // Remove infinity research unlock status for this slot
      const infinityUnlockKey = getSaveSlotSpecificKey('infinityResearchUnlocked');
      localStorage.removeItem(infinityUnlockKey);
      
      // Remove control center unlock status for this slot
      const controlUnlockKey = getSaveSlotSpecificKey('controlCenterUnlocked');
      localStorage.removeItem(controlUnlockKey);
      
      // Remove infinity caps data for this slot
      const infinityCapsKey = getSaveSlotSpecificKey('infinityCaps');
      localStorage.removeItem(infinityCapsKey);
      
      // Restore original save slot
      if (originalSlot) {
        localStorage.setItem('currentSaveSlot', originalSlot);
      } else {
        localStorage.removeItem('currentSaveSlot');
      }
    }
    
    // Remove achievement data for this slot
    localStorage.removeItem(`fluffIncAchievementsSlot${slotNumber}`);
    localStorage.removeItem(`fluffIncSecretAchievementsSlot${slotNumber}`);
    
    console.log(`[SAVE SLOT DELETE] Cleaned up all slot-specific data for slot ${slotNumber}`);
    updateSaveSlotModal();
  }
}

setInterval(() => {
  if (settings.autosave && currentSaveSlot) {
    // Safety check: Don't autosave if the game is in an invalid state
    try {
      // Check if essential game objects exist before saving
      if (window.state && 
          window.kitchenIngredients !== undefined && 
          window.friendship !== undefined &&
          !document.hidden && // Don't save when tab is hidden/frozen
          document.hasFocus()) { // Only save when window has focus
        saveToSlot(currentSaveSlot);
        showAutosaveIndicator();
      } else {
        console.warn('Autosave skipped: Game state appears incomplete or window not focused');
      }
    } catch (error) {
      console.error('Autosave error prevented save corruption:', error);
    }
  }
}, 30000);

// Emergency backup system - saves every 5 minutes to a separate key
setInterval(() => {
  if (currentSaveSlot && checkGameIntegrity()) {
    try {
      const currentSave = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
      if (currentSave) {
        localStorage.setItem(`swariaSaveSlot${currentSaveSlot}_emergency`, currentSave);
        console.log('Emergency backup created');
      }
    } catch (error) {
      console.error('Emergency backup failed:', error);
    }
  }
}, 300000); // 5 minutes 
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
  console.log('switchHomeSubTab called with:', subTabId);
  originalSwitchHomeSubTab.apply(this, arguments);
  setTimeout(updateGeneratorDarknessEffect, 10);
  
  // Check if boutique is being opened and handle very mad Lepre
  if (subTabId === 'boutiqueSubTab' && window.boutique) {
    // Check if it's night time (22:00 - 6:00) - boutique should be closed
    const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
    })();
    
    if (!isNightTime) {
      console.log('Boutique tab opened - calling onBoutiqueOpened()');
      window.boutique.onBoutiqueOpened();
    }
  }
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
window.generatorDarknessInterval = setInterval(updateGeneratorDarknessEffect, 1000);

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
  state.powerEnergy = new Decimal(0);
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
      window.tickInterval = setInterval(gameTick, 1000 / (tickSpeedMultiplier || 1));
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
  // Check if game is paused - if so, don't execute
  if (window.isGamePaused) {
    return;
  }
  
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
  
  // Check for infinity conditions
  if (typeof infinitySystem !== 'undefined' && infinitySystem.checkInfinity) {
    infinitySystem.checkInfinity();
  }
}

if (window._mainGameTickInterval) clearInterval(window._mainGameTickInterval);
window._mainGameTickInterval = setInterval(mainGameTick, 100);


window.mainGameTick = mainGameTick;

function checkKpSoftcapStory() {
  if (!state.seenKpSoftcapStory && typeof getKpGainPreview === 'function' && getKpGainPreview().gte(new Decimal("1e20"))) {
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
  // Save complete game state before delivery reset
  saveDeliveryResetBackup();
  
  _origResetGame.apply(this, arguments);
  checkKpSoftcapStory();
};

function gradeUp() {
  const currentGrade = DecimalUtils.isDecimal(state.grade) ? state.grade.toNumber() : (state.grade || 1);
  const nextGrade = currentGrade + 1;
  const nextCost = getGradeKPCost(nextGrade);
  const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
  if (kpDecimal.lt(nextCost)) return;
  const oldGrade = currentGrade;
  showGradeUpAnimation(oldGrade, nextGrade);
  swariaKnowledge.kp = new Decimal(1);
  state.grade = new Decimal(nextGrade);
  state.powerMaxEnergy = calculatePowerGeneratorCap();
  state.powerEnergy = state.powerMaxEnergy; 
  generatorUpgrades = {
    common: new Decimal(0),
    uncommon: new Decimal(0),
    rare: new Decimal(0),
    legendary: new Decimal(0),
    mythic: new Decimal(0)
  };
  // Keep window reference synced
  window.generatorUpgrades = generatorUpgrades;
  if (window.generators) {
    window.generators.forEach(gen => {
      gen.speedUpgrades = 0;
      gen.speed = gen.baseSpeed;
      gen.upgrades = 0; 
    });
  }
  state.boxesProduced = 0;
  state.boxesProducedByType = {
    common: new Decimal(0),
    uncommon: new Decimal(0),
    rare: new Decimal(0),
    legendary: new Decimal(0),
    mythic: new Decimal(0)
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
  // Use DecimalUtils with current notation preference
  return DecimalUtils.formatDecimal(num);
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
  if (state.powerStatus !== 'online' || state.powerEnergy.lte(0)) {
    state.powerStatus = 'online';
    state.powerEnergy = state.powerMaxEnergy || new Decimal(100);
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
      switchHomeSubTab('generatorMainTab');
    };
  }
});
if (!window.prismState) {
  window.prismState = {
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
  console.log('switchHomeSubTab called with:', subTabId);
  _origSwitchHomeSubTab_SoapCharger.apply(this, arguments);
  
  // Handle charger area in the generator main tab
  if (subTabId === 'generatorMainTab') {
    setTimeout(() => {
      // Check if charger area is active
      const chargerArea = document.getElementById('generatorChargerArea');
      if (chargerArea && chargerArea.style.display !== 'none') {
        showSoapChargerSpeech();
        const soapImg = document.getElementById("soapChargerCharacter");
        if (soapImg) {
          soapImg.onclick = showSoapChargerClickMessage;
          soapImg.style.cursor = "pointer";
        }
      }
    }, 300);
  }
  
  // Handle boutique sub-tab for very mad Lepre
  if (subTabId === 'boutiqueSubTab' && window.boutique) {
    // Check if it's night time (22:00 - 6:00) - boutique should be closed
    const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
    })();
    
    if (!isNightTime) {
      console.log('Boutique tab opened - calling onBoutiqueOpened()');
      setTimeout(() => {
        window.boutique.onBoutiqueOpened();
      }, 100); // Small delay to ensure tab is fully loaded
    }
  }
};

window.boughtElements = boughtElements;

function resetChargerWhenAvailable() {
  if (window.charger) {
    window.charger.charge = new Decimal(0);
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
      
      // Set the active tab to terrarium (gamblingMain) when going to Floor 2
      window.currentHomeSubTab = 'gamblingMain';
      
      if (typeof window.updateFloor2Visibility === 'function') {
        window.updateFloor2Visibility();
      }
      if (window.currentFloor === 2 && typeof window.renderTerrariumUI === 'function') {
        window.renderTerrariumUI();
      }
      if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
        window.checkAndUpdateFluzzerSleepState();
      }
      
      // Ensure the terrarium is visible immediately without flickering
      setTimeout(() => {
        const terrariumTab = document.getElementById('terrariumTab');
        const gamblingMainTab = document.getElementById('gamblingMain');
        if (terrariumTab) terrariumTab.style.display = 'block';
        if (gamblingMainTab) gamblingMainTab.style.display = 'none';
        
        // Update button active states without calling switchHomeSubTab to avoid flicker
        document.querySelectorAll('#subTabNav button').forEach(btn => {
          btn.classList.remove('active');
        });
        const btn = document.querySelector(`#subTabNav button[onclick*="gamblingMain"]`);
        if (btn) {
          btn.classList.add('active');
        }
      }, 50);
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
  const generatorMainTab = document.getElementById('generatorMainTab');
  const prismSubTab = document.getElementById('prismSubTab');
  if (generatorMainTab) {
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
  const gamblingMainTab = document.getElementById('gamblingMain');
  
  if (window.currentFloor === 2) {
    // IMMEDIATELY hide Observatory and Water Filtration buttons to prevent flicker
    const labBtn = document.getElementById('prismSubTabBtn');
    const genBtn = document.getElementById('generatorSubTabBtn');
    if (labBtn) labBtn.style.setProperty('display', 'none', 'important');
    if (genBtn) genBtn.style.setProperty('display', 'none', 'important');
    // Immediately set the correct visibility to avoid flicker
    if (terrariumTab) terrariumTab.style.display = 'block';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none'; // Hide cargo on Floor 2
    // Keep homeSubTabs visible on Floor 2 so tab switching works
    if (homeSubTabs) homeSubTabs.style.display = 'block';
    document.body.classList.add('terrarium-bg');
    if (typeof window.checkAndUpdateFluzzerSleepState === 'function') {
      window.checkAndUpdateFluzzerSleepState();
    }
  } else {
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (gamblingMainTab) gamblingMainTab.style.display = 'block'; // Show cargo on Floor 1
    if (homeSubTabs) homeSubTabs.style.display = 'block';
    document.body.classList.remove('terrarium-bg');
  }
  updateFloor2NavLabels();
  updateBoutiqueButtonVisibility();
  
  // Force update all tab visibility but keep Observatory hidden on floor 2
  if (typeof window.updateAllTabVisibility === 'function') {
    setTimeout(() => window.updateAllTabVisibility(), 100);
  }
  
  // Add multiple delayed checks to keep Observatory tab HIDDEN on floor 2
  if (window.currentFloor === 2) {
    // Hide immediately to prevent flicker
    forceObservatoryVisibleOnFloor2();
    // Check after 50ms
    setTimeout(() => forceObservatoryVisibleOnFloor2(), 50);
    // Check after 200ms
    setTimeout(() => forceObservatoryVisibleOnFloor2(), 200);
    // Check after 500ms
    setTimeout(() => forceObservatoryVisibleOnFloor2(), 500);
    
    // Render Floor 2 departments based on current tab
    setTimeout(() => {
      renderFloor2Departments();
    }, 150);
  }
}

// Helper function to force Observatory visibility on floor 2
function forceObservatoryVisibleOnFloor2() {
  if (window.currentFloor === 2) {
    const labBtn = document.getElementById('prismSubTabBtn');
    if (labBtn) {
      labBtn.style.setProperty('display', 'none', 'important');
      labBtn.textContent = 'Observatory';
      console.log('Observatory tab forced HIDDEN on floor 2 - timestamp:', Date.now());
    }
  }
}

// Function to render Floor 2 departments based on current tab
function renderFloor2Departments() {
  if (window.currentFloor !== 2) return;
  
  const currentTab = window.currentHomeSubTab;
  console.log('Rendering Floor 2 departments for current tab:', currentTab);
  
  const terrariumTab = document.getElementById('terrariumTab');
  const gamblingMainTab = document.getElementById('gamblingMain');
  
  if (currentTab === 'gamblingMain' || !currentTab) {
    // Show terrarium instead of cargo on Floor 2
    if (terrariumTab) terrariumTab.style.display = 'block';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none';
    console.log('Rendering Terrarium UI on Floor 2');
    // Set the default tab if not set
    if (!currentTab) {
      window.currentHomeSubTab = 'gamblingMain';
    }
  } else if (currentTab === 'generatorMainTab') {
    // Hide terrarium and cargo, render Water Filtration Department
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none';
    if (window.waterFiltration && typeof window.waterFiltration.renderWaterFiltrationUI === 'function') {
      console.log('Rendering Water Filtration UI on Floor 2');
      window.waterFiltration.renderWaterFiltrationUI();
    }
  } else if (currentTab === 'prismSubTab') {
    // Hide terrarium and cargo, render Observatory Department
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none';
    if (window.observatory && typeof window.observatory.renderObservatoryUI === 'function') {
      console.log('Rendering Observatory UI on Floor 2');
      window.observatory.renderObservatoryUI();
    }
  }
}

function updateFloor2NavLabels() {
  const cargoBtn = document.querySelector("#subTabNav button[onclick*='gamblingMain']");
  const genBtn = document.getElementById('generatorSubTabBtn');
  const labBtn = document.getElementById('prismSubTabBtn');
  const boutiqueBtn = document.getElementById('boutiqueSubTabBtn');
  
  if (window.currentFloor === 2) {
    if (cargoBtn) cargoBtn.textContent = 'Terrarium';
    if (genBtn) genBtn.textContent = 'Water Filtration';
    if (labBtn) labBtn.textContent = 'Observatory';
    if (boutiqueBtn) boutiqueBtn.textContent = 'Boutique';
    
    setTimeout(() => {
      // Hide Water Filtration (genBtn) and Observatory (labBtn) tab buttons on floor 2
      if (genBtn) genBtn.style.setProperty('display', 'none', 'important');
      if (labBtn) {
        labBtn.style.setProperty('display', 'none', 'important');
        console.log('Observatory tab hidden on floor 2');
      }
      if (boutiqueBtn) boutiqueBtn.style.setProperty('display', 'none', 'important');
      
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
      // Respect original visibility rules when not on floor 2
      if (state.grade >= 2) {
        labBtn.style.setProperty('display', 'inline-block', 'important');
      } else {
        labBtn.style.setProperty('display', 'none', 'important');
      }
    }
    if (boutiqueBtn) {
      boutiqueBtn.textContent = 'Boutique';
      // Check expansion level requirement (using grade as expansion level)
      const hasExpansion4 = window.state && window.state.grade && 
        (typeof window.state.grade === 'number' ? 
          window.state.grade >= 4 : 
          (window.state.grade.gte && window.state.grade.gte(4)));
      
      if (hasExpansion4) {
        boutiqueBtn.style.setProperty('display', 'inline-block', 'important');
      } else {
        boutiqueBtn.style.setProperty('display', 'none', 'important');
      }
    }
    
    document.body.classList.remove('terrarium-active');
  }
}

// Debug function to force Observatory tab HIDDEN (per user request)
window.forceObservatoryVisible = function() {
  const labBtn = document.getElementById('prismSubTabBtn');
  if (labBtn) {
    labBtn.style.setProperty('display', 'none', 'important');
    labBtn.textContent = 'Observatory';
    console.log('Observatory tab manually forced HIDDEN (per user request)');
  } else {
    console.log('Observatory tab button not found');
  }
};

// Watchdog function to keep Observatory tab HIDDEN on floor 2
function observatoryTabWatchdog() {
  if (window.currentFloor === 2) {
    const labBtn = document.getElementById('prismSubTabBtn');
    if (labBtn) {
      const isVisible = window.getComputedStyle(labBtn).display !== 'none';
      if (isVisible) {
        labBtn.style.setProperty('display', 'none', 'important');
        labBtn.textContent = 'Observatory';
        console.log('Observatory tab watchdog: enforced hidden state');
      }
    }
  }
}

// Start the watchdog interval to check every 500ms
window.observatoryWatchdogInterval = setInterval(observatoryTabWatchdog, 500);

function updateBoutiqueButtonVisibility() {
  const boutiqueBtn = document.getElementById('boutiqueSubTabBtn');
  if (!boutiqueBtn) return;
  
  // Hide if on floor 2
  if (window.currentFloor === 2) {
    boutiqueBtn.style.setProperty('display', 'none', 'important');
    return;
  }
  
  // Check expansion level requirement (using grade as expansion level)
  const hasExpansion4 = window.state && window.state.grade && 
    (typeof window.state.grade === 'number' ? 
      window.state.grade >= 4 : 
      (window.state.grade.gte && window.state.grade.gte(4)));
  
  if (hasExpansion4) {
    boutiqueBtn.style.setProperty('display', 'inline-block', 'important');
    
    // Check if it's night time (22:00 - 6:00) to gray out the button
    const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
    })();
    
    if (isNightTime) {
      boutiqueBtn.style.setProperty('opacity', '0.5', 'important');
      boutiqueBtn.style.setProperty('filter', 'grayscale(100%)', 'important');
      boutiqueBtn.style.setProperty('cursor', 'not-allowed', 'important');
      boutiqueBtn.disabled = true;
    } else {
      boutiqueBtn.style.removeProperty('opacity');
      boutiqueBtn.style.removeProperty('filter');
      boutiqueBtn.style.removeProperty('cursor');
      boutiqueBtn.disabled = false;
    }
  } else {
    boutiqueBtn.style.setProperty('display', 'none', 'important');
  }
}

// Make function globally accessible
window.updateBoutiqueButtonVisibility = updateBoutiqueButtonVisibility;

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

  window.digitalClockInterval = setInterval(updateDigitalClock, 1000);

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
    if (state.powerStatus === 'online' && state.powerEnergy.gt(0)) {
      state.powerEnergy = DecimalUtils.max(0, state.powerEnergy.sub(new Decimal(diff).div(5)));
      if (state.powerEnergy.gt(50)) {
        state.soapRefillUsed = false;
      }
      if (state.powerEnergy.lte(0)) {
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
    // Auto-feeding logic removed - berry plates mechanic disabled
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
      window.charger.charge = new Decimal(0);
    }
    for (let i = 0; i < 118; i++) {
      if (i !== 6 && i !== 7 && boughtElements[i] > 0) { 
        consumedResources.push(`${formatNumber(boughtElements[i])} Element ${i + 1}`);
        boughtElements[i] = 0;
      }
    }
    if (window.terrariumPollen > 0) {
      consumedResources.push(`${formatNumber(window.terrariumPollen)} Pollen`);
      window.terrariumPollen = new Decimal(0);
    }
    if (window.terrariumFlowers > 0) {
      consumedResources.push(`${formatNumber(window.terrariumFlowers)} Flowers`);
      window.terrariumFlowers = new Decimal(0);
    }
    if (generators) {
      generators.forEach((gen, index) => {
        if (gen.amount > 0) {
          consumedResources.push(`${formatNumber(gen.amount)} ${gen.name}`);
          gen.amount = 0;
        }
      });
    }
    // Berry plates consumption removed - mechanic disabled
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

// Stub function for updateCafeteriaUI - berry plate mechanic was removed
function updateCafeteriaUI() {
  // Do nothing - berry plates were removed
}
window.updateCafeteriaUI = updateCafeteriaUI;

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
  // Cafeteria initialization - berry plates removed
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
    'lepreCharacterImage',
    'lepreCharacterCard',
    'ticoCharacterImage',
    'ticoCharacterSpeaking',
    // Advanced Prism Vi characters
    'viCharacterNormal',
    'viCharacterTalking',
    'viCharacterSleeping',
    'viCharacterSleepTalking'
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
      case 'lepreCharacterImage': return 'Lepre';
      case 'lepreCharacterCard': return 'Lepre';
      case 'ticoCharacterImage': return 'Tico';
      case 'ticoCharacterSpeaking': return 'Tico';
      // Advanced Prism Vi characters - use distinct name
      case 'viCharacterNormal': return 'Vivien';
      case 'viCharacterTalking': return 'Vivien';
      case 'viCharacterSleeping': return 'Vivien';
      case 'viCharacterSleepTalking': return 'Vivien';
      default: return 'Unknown';
    }
  }  function setupCharacterDropTargets() {
    characterDropTargets.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      
      // Clean up any existing listeners
      el.onmouseenter = null;
      el.onmouseleave = null;
      el.ondragover = null;
      el.ondrop = null;
      el._tokenDropActive = false;
      
      // Add mouseenter handler for visual feedback
      el.addEventListener('mouseenter', function() {
        if (window._draggingToken) {
          // Use orange outline for Vi characters, yellow for others
          const isViCharacter = id.startsWith('viCharacter') || id === 'viSpeechBubble';
          el.style.outline = isViCharacter ? '3px solid #ff9500' : '3px solid #ffe066';
          el._tokenDropActive = true;
        }
      });
      
      // Add mouseleave handler to remove visual feedback
      el.addEventListener('mouseleave', function() {
        el.style.outline = '';
        el._tokenDropActive = false;
      });
      
      // Add mouseup handler for drop detection
      el.addEventListener('mouseup', function(e) {
        if (window._draggingToken && el._tokenDropActive) {
          // Check if character is sleeping
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
          
          // Handle hard mode special case
          if (id === 'hardModeSwariaImg') {
            showGiveTokenModal(tokenType, characterName);
            el.style.outline = '';
            el._tokenDropActive = false;
            return;
          }
          
          // Token-specific restrictions
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
          
          // Special case for Swaria rejecting certain tokens
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
          
          // Show give token modal for valid drops
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
    Vivien: { 
      likes: ['prisma', 'water'],
      dislikes: ['sparks'],
      neutral: ['berries', 'petals', 'mushroom', 'stardust']
    },
    Swaria: { 
      likes: ['berries', 'berryPlate'],
      dislikes: ['sparks', 'petals', 'prisma', 'stardust'],
      neutral: ['mushroom', 'water']
    },
    Tico: {
      likes: ['berries', 'mushroom', 'water'],
      dislikes: [],
      neutral: ['sparks', 'prisma', 'petals', 'stardust', 'berryPlate', 'mushroomSoup', 'batteries', 'glitteringPetals', 'chargedPrisma']
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
  },
  Lepre: {
    berries: ["Berries! My absolute favorite!", "These berries look delicious! Perfect for my shop!", "Berry good choice! Ha ha!", "I'll pay top price for quality berries like these!"],
    stardust: ["Stardust! So magical and valuable!", "This stardust will fetch a fine price!", "Sparkles like my personality! I love it!", "Such rare stardust! You have excellent taste!"],
    sparks: ["Sparks? Not bad, I can work with these.", "These sparks might be useful for something.", "Sparks are decent trading material.", "I'll find a buyer for these sparks."],
    prisma: ["Prisma shards? Sure, they have their market.", "Prisma can be useful for the right customer.", "Not my favorite, but I'll take them.", "These prisma shards will do nicely."],
    mushroom: ["Mushrooms? Well, everyone needs food tokens.", "These mushrooms look fresh enough.", "I suppose mushrooms have their place.", "Mushrooms - basic but necessary."],
    petals: ["Petals? They're pretty, I'll give you that.", "These petals might interest some customers.", "Flower petals - charming in their own way.", "I can find someone who appreciates petals."],
    water: ["Water? Ugh, really? That's the best you've got?", "Water... how disappointingly common.", "You're giving me WATER? Come on now!", "I was hoping for something more... valuable.", "Water? I suppose even merchants need to stay hydrated..."]
  },
  Tico: {
    berries: ["Berries! My favorite! Thank you so much!", "These berries look delicious! I really appreciate this!", "You know exactly what I like! Berries are the best!"],
    mushroom: ["Mushrooms! I love these! Thank you!", "Perfect! Mushrooms are so tasty and nutritious!", "You're so thoughtful! I really enjoy mushrooms!"],
    water: ["Water! Just what I needed! Thank you!", "Fresh water is so refreshing! I appreciate this!", "Perfect timing! I was getting thirsty!"],
    sparks: ["Sparks? Well, I can use these. Thank you!", "Not my favorite, but I appreciate the gesture!", "Sparks are okay, I suppose. Thanks!"],
    prisma: ["Prisma shards? Interesting! Thank you!", "I'm not sure what to do with these, but thanks!", "Prisma? That's... different. But thank you!"],
    petals: ["Petals! They're so pretty! Thank you!", "These petals are lovely! I appreciate them!", "Beautiful petals! Thank you for thinking of me!"],
    stardust: ["Stardust! How magical! Thank you!", "This stardust sparkles beautifully! Thanks!", "Stardust is always appreciated! Thank you!"],
    berryPlate: ["A berry plate! How generous! Thank you!", "This looks delicious! I really appreciate it!"],
    mushroomSoup: ["Mushroom soup! My second favorite! Thank you!", "This soup smells amazing! I love it!"],
    batteries: ["Batteries? I'll find a use for these! Thanks!", "Not something I usually get, but thank you!"],
    glitteringPetals: ["Glittering petals! So beautiful! Thank you!", "These sparkle wonderfully! I appreciate them!"],
    chargedPrisma: ["Charged prisma! Very interesting! Thank you!", "This has such powerful energy! Thanks!"]
  },
  Tico: {
    berries: ["Berries! These will help me stay focused on worker management!", "Thank you! These berries are perfect for long work days.", "Berries are my favorite! They help me think clearly about worker assignments."],
    petals: ["Flower petals! How lovely. They remind me of the gardens some workers tend.", "These petals are beautiful! I'll keep them on my desk for inspiration.", "Petals! They make the front desk feel more welcoming."],
    sparks: ["Sparks? Interesting! I wonder if any of our electrical workers would appreciate these.", "These sparks are quite energizing! Perfect for keeping me alert.", "Sparks! They remind me of the energy our best workers bring."],
    mushroom: ["Mushrooms! These will make a nice snack during long worker management sessions.", "Thank you for the mushrooms! I can share these with the workers.", "Mushrooms are practical, just like good worker management!"],
    water: ["Water! Essential for staying hydrated during busy front desk hours.", "Thank you! Clean water helps me think clearly about worker placements.", "Water is so refreshing! Perfect for long days managing arrivals."],
    prisma: ["Prisma shards! These sparkle like the potential I see in every worker!", "How fascinating! These prisma pieces remind me of diverse worker talents.", "Prisma! Each shard is unique, just like our workers."],
    stardust: ["Stardust! So magical! This reminds me why I love helping workers reach their potential.", "Incredible! This stardust makes me feel inspired about worker development!", "Stardust! As rare and special as finding the perfect worker for a job!"]
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
  } else if (characterName === 'Vivien') {
    // Advanced Prism Vi uses different speech system - handled in advanced prism.js
    if (typeof window.showAdvancedPrismViSpeech === 'function') {
      window.showAdvancedPrismViSpeech(tokenType);
      return; // Exit early, don't use the standard speech bubble system
    }
  } else if (characterName === 'Swaria') {
    const hardModeTab = document.getElementById('settingsHardModeTab');
    if (hardModeTab && hardModeTab.style.display !== 'none') {
      el = document.getElementById('hardModeSwariaSpeech');
      img = document.getElementById('hardModeSwariaImg');
    } else {
      el = document.getElementById('swariaSpeech');
      img = document.getElementById('swariaCharacter');
    }
  } else if (characterName === 'Lepre') {
    // Handle Lepre's speech using the boutique speech system
    const lines = characterTokenSpeech[characterName] && characterTokenSpeech[characterName][tokenType];
    if (lines && lines.length > 0) {
      speech = lines[Math.floor(Math.random() * lines.length)];
    } else {
      speech = 'Thank you for the token!';
    }
    
    // Use boutique's speech system if available
    if (window.boutique && typeof window.boutique.showLepreSpeechBubble === 'function') {
      // Show Lepre speaking image
      const normalImg = document.getElementById('lepreCharacterImage');
      const speakingImg = document.getElementById('lepreCharacterSpeaking');
      
      if (normalImg && speakingImg) {
        normalImg.style.display = 'none';
        speakingImg.style.display = 'block';
      }
      
      window.boutique.showLepreSpeechBubble(speech);
      
      // Reset after 3.5 seconds to match other characters
      setTimeout(() => {
        if (normalImg && speakingImg) {
          speakingImg.style.display = 'none';
          normalImg.style.display = 'block';
        }
        if (window.boutique && typeof window.boutique.hideLepreSpeechBubble === 'function') {
          window.boutique.hideLepreSpeechBubble();
        }
      }, 3500);
    }
    return; // Exit early for Lepre since we handled it specially
  } else if (characterName === 'Tico') {
    // Handle Tico's speech using the front desk speech system
    const lines = characterTokenSpeech[characterName] && characterTokenSpeech[characterName][tokenType];
    if (lines && lines.length > 0) {
      speech = lines[Math.floor(Math.random() * lines.length)];
    } else {
      speech = 'Thank you for the token!';
    }
    
    // Use front desk's speech system if available
    if (window.frontDesk && typeof window.frontDesk.showTicoSpeech === 'function') {
      window.frontDesk.showTicoSpeech(speech, 3500);
    }
    
    return; // Exit early for Tico since we handled it specially
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
          img.src = getFluzzerImagePath('talking');
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
    console.log(`Debug - showGiveTokenModal called with tokenType: ${tokenType}, characterName: ${characterName}`);
    
    if (tokenType === 'swabucks') {
      alert('Swa bucks cannot be given to characters!');
      return;
    }
    if (tokenType === 'berryPlate' && characterName !== 'Swaria' && characterName !== 'Tico') {
      alert('Berry Plates can only be given to Swaria!');
      return;
    }
    if (tokenType === 'batteries' && characterName !== 'Soap' && characterName !== 'Fluzzer' && characterName !== 'Tico') {
      alert('Batteries can only be given to Soap or Fluzzer!');
      return;
    }
    if (tokenType === 'glitteringPetals' && characterName !== 'Fluzzer' && characterName !== 'Tico') {
      alert('Glittering Petals can only be given to Fluzzer!');
      return;
    }
    if (tokenType === 'chargedPrisma' && characterName !== 'Vi' && characterName !== 'Tico') {
      alert('Charged Prisma can only be given to Vi!');
      return;
    }
    if (tokenType === 'mushroomSoup' && characterName !== 'Mystic' && characterName !== 'Swaria' && characterName !== 'Tico') {
      alert('Mushroom Soup can only be given to Mystic or Swaria!');
      return;
    }
    
    const modal = document.getElementById('giveTokenModal');
    if (!modal) {
      console.error('Give token modal not found!');
      return;
    }
    
    const title = document.getElementById('giveTokenModalTitle');
    const img = document.getElementById('giveTokenModalImg');
    
    if (!title || !img) {
      console.error('Modal elements not found!', { title: !!title, img: !!img });
      return;
    }
    
    const tokenImages = {
      swabucks: 'assets/icons/kp.png',
      mushroom: 'assets/icons/mushroom token.png',
      sparks: 'assets/icons/spark token.png',
      spark: 'assets/icons/spark token.png',
      berries: 'assets/icons/berry token.png',
      berry: 'assets/icons/berry token.png',
      prisma: 'assets/icons/prisma token.png',
      petals: 'assets/icons/petal token.png',
      petal: 'assets/icons/petal token.png',
      water: 'assets/icons/water token.png',
      stardust: 'assets/icons/stardust token.png',
      berryPlate: 'assets/icons/berry plate token.png',
      mushroomSoup: 'assets/icons/mushroom soup token.png',
      batteries: 'assets/icons/battery token.png',
      battery: 'assets/icons/battery token.png',
      glitteringPetals: 'assets/icons/glittering petal token.png',
      glitteringPetal: 'assets/icons/glittering petal token.png',
      chargedPrisma: 'assets/icons/charged prism token.png'
    };

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
      glitteringPetal: 'Glittering Petals',
      chargedPrisma: 'Charged Prisma'
    };
    
    if (characterName === 'Swaria') {
      if (tokenType === 'berryPlate') {
        title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to consume?`;
        img.src = tokenImages[tokenType] || tokenImages.berryPlate;
      } else {
        title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to consume?`;
        img.src = tokenImages[tokenType] || '';
      }
    } else {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to give to ${characterName}?`;
      img.src = tokenImages[tokenType] || '';
    }
    
    img.alt = displayNames[tokenType] || tokenType;
    
    console.log(`Debug - Setting image src to: ${tokenImages[tokenType] || ''}`);
    console.log(`Debug - Token type: ${tokenType}`);
    console.log(`Debug - Available token images:`, Object.keys(tokenImages));
    console.log(`Debug - Image element:`, img);
    console.log(`Debug - Image src after setting:`, img.src);
    
    // Force image to be visible and check if it loads
    img.style.display = 'block';
    img.style.visibility = 'visible';
    img.onerror = function() {
      console.error(`Debug - Failed to load image: ${img.src}`);
    };
    img.onload = function() {
      console.log(`Debug - Successfully loaded image: ${img.src}`);
    };
    
    console.log(`Debug - Setting modal display to flex`);
    modal.style.display = 'flex';
    
    // Store current token info for the modal buttons
    modal._currentTokenType = tokenType;
    modal._currentCharacterName = characterName;
    
    const btn1 = document.getElementById('giveTokenBtn1');
    const btn10 = document.getElementById('giveTokenBtn10');
    const btn100 = document.getElementById('giveTokenBtn100');
    const cancelBtn = document.getElementById('giveTokenCancelBtn');
    
    const counts = window.kitchenIngredients || {};
    let available = 0;
    
    console.log(`Debug - Checking availability for ${tokenType}`);
    console.log(`Debug - window.kitchenIngredients:`, window.kitchenIngredients);
    console.log(`Debug - counts:`, counts);
    
    // Map token names to storage keys (some tokens have different names for display vs storage)
    const tokenToStorageKey = {
      'berry': 'berries',
      'petal': 'petals',
      'spark': 'sparks',
      'mushroom': 'mushroom',
      'water': 'water',
      'stardust': 'stardust',
      'prisma': 'prisma',
      'glitteringPetal': 'glitteringPetals'
    };
    
    let storageKey = tokenToStorageKey[tokenType] || tokenType;
    console.log(`Debug - Mapped ${tokenType} to storage key: ${storageKey}`);
    console.log(`Debug - counts[${storageKey}]:`, counts[storageKey]);
    console.log(`Debug - window.state:`, window.state);
    
    if (tokenType === 'swabucks') {
      available = (window.state && window.state.swabucks) ? 
        (typeof window.state.swabucks.toNumber === 'function' ? window.state.swabucks.toNumber() : Number(window.state.swabucks)) : 0;
    } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'battery' || tokenType === 'glitteringPetals' || tokenType === 'glitteringPetal' || tokenType === 'chargedPrisma') {
      // For batteries, always check window.state.batteries regardless of whether tokenType is 'battery' or 'batteries'
      // For glittering petals, always check window.state.glitteringPetals regardless of singular/plural form
      let stateKey = tokenType;
      if (tokenType === 'battery') stateKey = 'batteries';
      if (tokenType === 'glitteringPetal') stateKey = 'glitteringPetals';
      available = (window.state && window.state[stateKey]) ? 
        (typeof window.state[stateKey].toNumber === 'function' ? window.state[stateKey].toNumber() : Number(window.state[stateKey])) : 0;
    } else {
      available = counts[storageKey] ? 
        (typeof counts[storageKey].toNumber === 'function' ? counts[storageKey].toNumber() : Number(counts[storageKey])) : 0;
    }
    
    console.log(`Debug - Available ${tokenType}: ${available}`);
    
    // Update button visibility based on available amounts
    if (btn1) btn1.style.display = available >= 1 ? 'inline-block' : 'none';
    if (btn10) btn10.style.display = available >= 10 ? 'inline-block' : 'none';
    if (btn100) btn100.style.display = available >= 100 ? 'inline-block' : 'none';
    
    // Set up button click handlers
    if (btn1) btn1.onclick = () => give(1);
    if (btn10) btn10.onclick = () => give(10);
    if (btn100) btn100.onclick = () => give(100);
    if (cancelBtn) cancelBtn.onclick = () => { modal.style.display = 'none'; };

    // Set up custom amount input and button
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

    function give(amount) {
      console.log('[DEBUG] give() called with:', { characterName, tokenType, amount });
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
      // Use dedicated quest functions for Soap's sparks and batteries (accept both singular and plural)
      if (characterName === 'Soap' && (tokenType === 'spark' || tokenType === 'sparks') && typeof window.giveSparksToSoap === 'function') {
        console.log('[DEBUG] Calling window.giveSparksToSoap from give function');
        // Deduct sparks from inventory (always use Decimal)
        if (window.state) {
          console.log('[DEBUG] sparks before deduction:', window.state.sparks);
          if (typeof Decimal !== 'undefined') {
            window.state.sparks = DecimalUtils.toDecimal(window.state.sparks).minus(amount);
            if (window.state.sparks.lt(0)) window.state.sparks = new Decimal(0);
          } else {
            window.state.sparks = Math.max(0, Number(window.state.sparks) - amount);
          }
          console.log('[DEBUG] sparks after deduction:', window.state.sparks);
        }
        if (window.kitchenIngredients && window.kitchenIngredients.sparks !== undefined) {
          console.log('[DEBUG] kitchenIngredients.sparks before deduction:', window.kitchenIngredients.sparks);
          if (typeof Decimal !== 'undefined') {
            window.kitchenIngredients.sparks = DecimalUtils.toDecimal(window.kitchenIngredients.sparks).minus(amount);
            if (window.kitchenIngredients.sparks.lt(0)) window.kitchenIngredients.sparks = new Decimal(0);
          } else {
            window.kitchenIngredients.sparks = Math.max(0, Number(window.kitchenIngredients.sparks) - amount);
          }
          console.log('[DEBUG] kitchenIngredients.sparks after deduction:', window.kitchenIngredients.sparks);
        }
        window.giveSparksToSoap(amount);
        if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
        // Close the modal if present
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      if (characterName === 'Soap' && (tokenType === 'battery' || tokenType === 'batteries') && typeof window.giveBatteriesToSoap === 'function') {
        console.log('[DEBUG] Calling window.giveBatteriesToSoap from give function');
        // Deduct batteries from inventory
        if (window.state && window.state.batteries) {
          if (typeof window.state.batteries.minus === 'function') {
            window.state.batteries = window.state.batteries.minus(amount);
            if (window.state.batteries.lt(0)) window.state.batteries = window.state.batteries.constructor(0);
          } else {
            window.state.batteries = Math.max(0, Number(window.state.batteries) - amount);
          }
        }
        
        // Activate soap battery boost
        const tenMinutesMs = 10 * 60 * 1000; 
        if (!window.state) window.state = {};
        window.state.soapBatteryBoost = tenMinutesMs;
        if (window.state.powerEnergy !== undefined) {
          window.state.powerEnergy = new Decimal(100);
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
        
        window.giveBatteriesToSoap(amount);
        if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
        // Close the modal if present
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      if (tokenType === 'swabucks') {
        window.state.swabucks = available - amount;
      } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'battery' || tokenType === 'glitteringPetals' || tokenType === 'glitteringPetal' || tokenType === 'chargedPrisma') {
        // For batteries, always deduct from window.state.batteries regardless of whether tokenType is 'battery' or 'batteries'
        // For glittering petals, always use 'glitteringPetals' in state regardless of singular/plural form
        let stateKey = tokenType;
        if (tokenType === 'battery') stateKey = 'batteries';
        if (tokenType === 'glitteringPetal') stateKey = 'glitteringPetals';
        window.state[stateKey] = available - amount;
      } else {
        window.kitchenIngredients[storageKey] = available - amount;
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
        if (tokenType === 'batteries' || tokenType === 'battery') {
          const tenMinutesMs = 10 * 60 * 1000; 
          if (!window.state) window.state = {};
          window.state.soapBatteryBoost = tenMinutesMs;
          if (window.state.powerEnergy !== undefined) {
            window.state.powerEnergy = new Decimal(100);
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
        console.log(`Debug - In Fluzzer block, tokenType: ${tokenType}`);
        if (tokenType === 'glitteringPetals' || tokenType === 'glitteringPetal') {
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
              fluzzerImg.src = getFluzzerImagePath('talking');
            }
            setTimeout(() => {
              if (!window.isFluzzerLevelUpSpeaking) {
                fluzzerSpeech.style.display = "none";
                if (fluzzerImg) {
                  fluzzerImg.src = getFluzzerImagePath('normal');
                }
              }
            }, 5000);
          }
        }
        // Always call handleNectarizeTokenGiven for Fluzzer, regardless of UI visibility
        console.log(`Debug - About to call handleNectarizeTokenGiven`);
        if (typeof handleNectarizeTokenGiven === 'function') {
          handleNectarizeTokenGiven(tokenType, amount);
        } else {
          console.log(`Debug - handleNectarizeTokenGiven is not a function`);
        }
        console.log(`Debug - Finished Fluzzer block`);
      }

      console.log(`Debug - Finished character-specific handling, about to reach friendship section`);
      console.log(`Debug - Reached friendship section. friendshipAmount: ${friendshipAmount}, characterName: ${characterName}`);
      
      // Process friendship points for all characters (except Swaria who has hunger instead)
      if (friendshipAmount > 0 && characterName !== 'Swaria') {
        console.log(`Debug - Processing friendship for ${characterName}, amount: ${friendshipAmount}`);
        const charToDept = {
          'Swaria': 'Cargo',
          'Soap': 'Generator',
          'Mystic': 'Kitchen',
          'Fluzzer': 'Terrarium',
          'Vi': 'Lab',
          'Vivien': 'Lab',
          'Lepre': 'Boutique',
          'Tico': 'FrontDesk'
        };
        const dept = charToDept[characterName];
        console.log(`Debug - Department: ${dept}`);
        let pointsPerToken = 5;
        if (storageKey === 'stardust') {
          pointsPerToken = characterName === 'Mystic' ? 200 : 50;
        } else if (characterTokenPreferences && characterTokenPreferences[characterName]) {
          console.log(`Debug - Checking preferences for ${characterName}, storageKey: ${storageKey}`);
          console.log(`Debug - Likes:`, characterTokenPreferences[characterName].likes);
          console.log(`Debug - Dislikes:`, characterTokenPreferences[characterName].dislikes);
          if (characterTokenPreferences[characterName].likes.includes(storageKey)) {
            pointsPerToken = 20;
            console.log(`Debug - ${characterName} likes ${storageKey}, giving 20 points per token`);
          } else if (characterTokenPreferences[characterName].dislikes.includes(storageKey)) {
            pointsPerToken = 1;
            console.log(`Debug - ${characterName} dislikes ${storageKey}, giving 1 point per token`);
          } else {
            console.log(`Debug - ${characterName} is neutral about ${storageKey}, giving 5 points per token`);
          }
        }
        console.log(`Debug - Final pointsPerToken: ${pointsPerToken}`);
        if (dept && window.friendship && typeof window.friendship.addPoints === 'function') {
          const totalPoints = new Decimal(pointsPerToken).mul(friendshipAmount);
          console.log(`Debug - Adding ${totalPoints} friendship points to ${characterName}`);
          window.friendship.addPoints(characterName, totalPoints);
          
          const statsModal = document.getElementById('departmentStatsModal');
          if (statsModal && statsModal.style.display !== 'none') {
            const title = document.getElementById('departmentStatsModalTitle');
            if (title && title.textContent && title.textContent.toLowerCase().includes(dept.toLowerCase())) {
              if (typeof window.showDepartmentStatsModal === 'function') window.showDepartmentStatsModal(dept);
            }
          }
        } else {
          console.log(`Debug - Friendship system not available: dept=${dept}, friendship=${!!window.friendship}, addPoints=${typeof window.friendship?.addPoints}`);
        }
      }

      if (questSpeech && characterName === 'Vivien' && typeof window.showAdvancedPrismViResponse === 'function') {
        setTimeout(() => window.showAdvancedPrismViResponse(questSpeech), 200);
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
        showCharacterSpeech(characterName, storageKey);
      }
      if (characterName === 'Swaria' && typeof state !== 'undefined' && state.hardModeQuestActive) {
        if (typeof state.hardModeQuestProgress !== 'undefined') {
          if (storageKey === 'berries') {
            state.hardModeQuestProgress.berryTokens += amount;
          } else if (storageKey === 'stardust') {
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
      
      // Add friendship points for all characters (except Swaria who has hunger instead)
      if (friendshipAmount > 0 && characterName !== 'Swaria') {
        console.log(`Debug - OLD GIVE: Processing friendship for ${characterName}, amount: ${friendshipAmount}`);
        const charToDept = {
          'Swaria': 'Cargo',
          'Soap': 'Generator',
          'Mystic': 'Kitchen',
          'Fluzzer': 'Terrarium',
          'Vi': 'Lab',
          'Vivien': 'Lab',
          'Lepre': 'Boutique',
          'Tico': 'FrontDesk'
        };
        const dept = charToDept[characterName];
        console.log(`Debug - OLD GIVE: Department: ${dept}`);
        
        // Define character token preferences (using storage keys)
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
          Vivien: { 
            likes: ['prisma', 'water'],
            dislikes: ['sparks'],
            neutral: ['berries', 'petals', 'mushroom', 'stardust']
          },
          Swaria: { 
            likes: ['berries', 'berryPlate'],
            dislikes: ['sparks', 'petals', 'prisma', 'stardust'],
            neutral: ['mushroom', 'water']
          },
          Lepre: {
            likes: ['berries', 'stardust'],
            dislikes: ['water'],
            neutral: ['sparks', 'prisma', 'mushroom', 'petals']
          },
          Tico: {
            likes: ['berries', 'mushroom', 'water'],
            dislikes: [],
            neutral: ['sparks', 'prisma', 'petals', 'stardust']
          }
        };
        
        // Map token names to storage keys for friendship preferences
        const tokenToStorageKey = {
          'berry': 'berries',
          'petal': 'petals', 
          'spark': 'sparks',
          'mushroom': 'mushroom',
          'water': 'water',
          'stardust': 'stardust',
          'prisma': 'prisma'
        };
        
        let storageKey = tokenToStorageKey[tokenType] || tokenType;
        console.log(`Debug - OLD GIVE: Mapped ${tokenType} to storage key: ${storageKey}`);
        let pointsPerToken = 5; // Default neutral
        
        if (storageKey === 'stardust') {
          pointsPerToken = characterName === 'Mystic' ? 200 : 50;
        } else if (characterTokenPreferences && characterTokenPreferences[characterName]) {
          if (characterTokenPreferences[characterName].likes.includes(storageKey)) {
            pointsPerToken = 20;
            console.log(`Debug - OLD GIVE: ${characterName} likes ${storageKey}, giving 20 points per token`);
          } else if (characterTokenPreferences[characterName].dislikes.includes(storageKey)) {
            pointsPerToken = 1;
            console.log(`Debug - OLD GIVE: ${characterName} dislikes ${storageKey}, giving 1 point per token`);
          } else {
            pointsPerToken = 5;
            console.log(`Debug - OLD GIVE: ${characterName} is neutral about ${storageKey}, giving 5 points per token`);
          }
        }
        
        if (dept && window.friendship && typeof window.friendship.addPoints === 'function') {
          const totalPoints = new Decimal(pointsPerToken).mul(friendshipAmount);
          console.log(`Debug - OLD GIVE: Adding ${totalPoints} friendship points to ${characterName}`);
          window.friendship.addPoints(characterName, totalPoints);
          
          // Update stats modal if it's open for this department
          const statsModal = document.getElementById('departmentStatsModal');
          if (statsModal && statsModal.style.display !== 'none') {
            const title = document.getElementById('departmentStatsModalTitle');
            if (title && title.textContent && title.textContent.toLowerCase().includes(dept.toLowerCase())) {
              if (typeof window.showDepartmentStatsModal === 'function') window.showDepartmentStatsModal(dept);
            }
          }
        } else {
          console.log(`Debug - OLD GIVE: Friendship system not available: dept=${dept}, friendship=${!!window.friendship}, addPoints=${typeof window.friendship?.addPoints}`);
        }
      } else {
        console.log(`Debug - OLD GIVE: Not processing friendship - friendshipAmount: ${friendshipAmount}, characterName: ${characterName}`);
      }

      // Handle Tico tokens for front desk hunger system (OLD GIVE function)
      if (characterName === 'Tico') {
        console.log(`Debug - OLD GIVE: In Tico block, handling token for hunger system`);
        console.log(`Debug - OLD GIVE: window.frontDesk exists: ${!!window.frontDesk}`);
        console.log(`Debug - OLD GIVE: handleTokenDrop function exists: ${typeof window.frontDesk?.handleTokenDrop}`);
        if (window.frontDesk && typeof window.frontDesk.handleTokenDrop === 'function') {
          window.frontDesk.handleTokenDrop(tokenType, amount);
          console.log(`Debug - OLD GIVE: Called frontDesk.handleTokenDrop with ${amount} ${tokenType}`);
        } else {
          console.log(`Debug - OLD GIVE: Front desk system not available`);
          console.log(`Debug - OLD GIVE: window.frontDesk:`, window.frontDesk);
          console.log(`Debug - OLD GIVE: handleTokenDrop type:`, typeof window.frontDesk?.handleTokenDrop);
        }
      }

      // Handle character speech for non-quest tokens
      console.log(`Debug - OLD GIVE: About to handle speech - questSpeech: ${!!questSpeech}`);
      if (!questSpeech && typeof showCharacterSpeech === 'function') {
        const tokenToStorageKey = {
          'berry': 'berries',
          'petal': 'petals',
          'spark': 'sparks', 
          'mushroom': 'mushroom',
          'water': 'water',
          'stardust': 'stardust',
          'prisma': 'prisma'
        };
        let storageKey = tokenToStorageKey[tokenType] || tokenType;
        console.log(`Debug - OLD GIVE: Calling showCharacterSpeech(${characterName}, ${storageKey})`);
        showCharacterSpeech(characterName, storageKey);
      } else {
        console.log(`Debug - OLD GIVE: Not calling showCharacterSpeech - questSpeech exists: ${!!questSpeech}, function exists: ${typeof showCharacterSpeech === 'function'}`);
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
  }

  function renderInventoryTokens() {
    const container = document.getElementById('inventoryTokens');
    if (!container) return;
    container.innerHTML = '';
    
    // Ensure kitchenIngredients is initialized
    if (!window.kitchenIngredients) {
      window.kitchenIngredients = {};
    }
    
    // Debug: Log what's actually in kitchenIngredients

    
    const allTokens = [];
    
    // Add swabucks from state
    if (window.state && window.state.swabucks) {
      let swabucksValue;
      if (typeof window.state.swabucks === 'object' && window.state.swabucks.toString) {
        swabucksValue = window.state.swabucks.toString();
      } else {
        swabucksValue = window.state.swabucks.toString();
      }
      allTokens.push({
        name: 'swabucks',
        display: 'Swa Bucks',
        count: swabucksValue,
        icon: 'Swa Buck.png'
      });
    }
    
    // Add regular kitchen ingredients (the main token system)
    const ingredientTokens = [
      { key: 'berries', name: 'berry', display: 'Berries', icon: 'berry token.png' },
      { key: 'petals', name: 'petal', display: 'Petals', icon: 'petal token.png' },
      { key: 'stardust', name: 'stardust', display: 'Stardust', icon: 'stardust token.png' },
      { key: 'prisma', name: 'prisma', display: 'Prisma Shard', icon: 'prisma token.png' },
      { key: 'sparks', name: 'spark', display: 'Sparks', icon: 'spark token.png' },
      { key: 'water', name: 'water', display: 'Water', icon: 'water token.png' },
      { key: 'mushroom', name: 'mushroom', display: 'Mushroom', icon: 'mushroom token.png' }
    ];
    
    ingredientTokens.forEach(token => {
      
      const value = window.kitchenIngredients[token.key];
      if (value !== undefined && value !== null) {
        let count = 0;
        if (typeof value === 'object' && value.toString) {
          count = parseFloat(value.toString());
        } else if (typeof value === 'number') {
          count = value;
        }
        
       
        if (count > 0) {
          allTokens.push({
            name: token.name,
            display: token.display,
            count: count,
            icon: token.icon
          });
        }
      }
    });
    
    // Add other special tokens stored in window.state (not kitchenIngredients)
    const specialIngredients = [
      { key: 'glitteringPetals', name: 'glitteringPetal', display: 'Glittering Petals', icon: 'glittering petal token.png' },
      { key: 'chargedPrisma', name: 'chargedPrisma', display: 'Charged Prisma', icon: 'charged prism token.png' },
      { key: 'batteries', name: 'battery', display: 'Batteries', icon: 'battery token.png' },
      { key: 'mushroomSoup', name: 'mushroomSoup', display: 'Mushroom Soup', icon: 'mushroom soup token.png' },
      { key: 'berryPlate', name: 'berryPlate', display: 'Berry Plate', icon: 'berry plate token.png' }
    ];
    
    specialIngredients.forEach(token => {
      // Check window.state instead of kitchenIngredients for these special tokens
      const value = window.state && window.state[token.key];
      if (value !== undefined && value !== null) {
        let count = 0;
        if (typeof value === 'object' && value.toString) {
          count = parseFloat(value.toString());
        } else if (typeof value === 'number') {
          count = value;
        }
        
        if (count > 0) {
          allTokens.push({
            name: token.name,
            display: token.display,
            count: count,
            icon: token.icon
          });
        }
      }
    });
    
    
    // Quest progress tokens removed from inventory display
    
    // Add kitchen ingredient berry plates
    if (window.kitchenIngredients) {
      const berryPlateNames = ['berriesAndCream', 'chocolateBerries', 'frozenBerries'];
      berryPlateNames.forEach(key => {
        if (window.kitchenIngredients[key]) {
          let count = 0;
          const value = window.kitchenIngredients[key];
          if (typeof value === 'object' && value.toString) {
            count = parseFloat(value.toString());
          } else if (typeof value === 'number') {
            count = value;
          }
          
          if (count > 0) {
            allTokens.push({
              name: key,
              display: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
              count: count,
              icon: 'berry plate token.png',
              isBerryPlate: true
            });
          }
        }
      });
    }
    
    // Render tokens
    allTokens.forEach(type => {
      const div = document.createElement('div');
      div.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 70px;
        margin: 1px;
        padding: 1px;
      `;
      
      const img = document.createElement('img');
      img.src = `assets/icons/${type.icon}`;
      img.style.cssText = `
        width: 48px;
        height: 48px;
        object-fit: contain;
        margin-bottom: 5px;
        cursor: pointer;
        user-select: none;
        pointer-events: auto;
        display: block;
      `;
      img.alt = type.display;
      img.draggable = true; // Enable HTML5 drag and drop
      
      // Add HTML5 drag and drop events for token dropping on Tico
      img.addEventListener('dragstart', function(e) {
        const tokenData = {
          type: 'token',
          tokenType: type.isBerryPlate ? 'berryPlate' : type.name,
          displayName: type.display
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(tokenData));
        e.dataTransfer.effectAllowed = 'copy';
      });
      
      // Add drag functionality (only for non-swabucks)
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
          
          // Get the original position IMMEDIATELY, before any changes
          origRect = img.getBoundingClientRect();
          console.log('Initial origRect at mousedown:', origRect.left, origRect.top);
          
          window._draggingToken = false;
          window._draggingTokenType = null;
          
          holdTimeout = setTimeout(() => {
            dragReady = true;
            isDragging = true;
            window._draggingToken = true;
            window._draggingTokenType = type.isBerryPlate ? 'berryPlate' : type.name;
            img.classList.add('dragging-token');
            img.style.cursor = 'grabbing';
            
            // Don't get getBoundingClientRect again here, use the one from mousedown
            offsetX = startX - origRect.left;
            offsetY = startY - origRect.top;
            
            console.log('Drag start debug:');
            console.log('origRect:', origRect.left, origRect.top);
            console.log('modalRect:', modalRect.left, modalRect.top);
            console.log('startX/Y:', startX, startY);
            console.log('offsetX/Y:', offsetX, offsetY);
            
            origParent = img.parentNode;
            origNext = img.nextSibling;
            
            // Position relative to modal
            const modalRelativeLeft = origRect.left - modalRect.left;
            const modalRelativeTop = origRect.top - modalRect.top;
            
            console.log('Modal relative position:', modalRelativeLeft, modalRelativeTop);
            
            img.style.position = 'absolute';
            img.style.left = modalRelativeLeft + 'px';
            img.style.top = modalRelativeTop + 'px';
            img.style.zIndex = 999999;
            img.style.transition = 'none';
            img.style.pointerEvents = 'none';
            
            modal.appendChild(img);
            
            placeholder = document.createElement('div');
            placeholder.style.width = '48px';
            placeholder.style.height = '48px';
            placeholder.style.backgroundColor = 'rgba(255,255,255,0.1)';
            placeholder.style.border = '1px dashed #ccc';
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
            
            const newLeft = ev.clientX - modalRect.left - offsetX;
            const newTop = ev.clientY - modalRect.top - offsetY;
            
            console.log('Mouse move - clientX/Y:', ev.clientX, ev.clientY);
            console.log('Calculated position:', newLeft, newTop);
            
            img.style.left = newLeft + 'px';
            img.style.top = newTop + 'px';
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
      
      // Count display
      const countSpan = document.createElement('span');
      countSpan.style.cssText = `
        font-size: 1.1em;
        font-weight: bold;
        color: #222;
        text-align: center;
        margin-bottom: 3px;
        pointer-events: none;
      `;
      
      if (type.name === 'swabucks') {
        countSpan.id = 'inventoryCount-swabucks';
      }
      
      // Format the count using the user's selected notation
      try {
        if (typeof window.formatNumber === 'function') {
          countSpan.textContent = window.formatNumber(type.count);
        } else {
          countSpan.textContent = type.count;
        }
      } catch (error) {
        console.warn('Error formatting inventory count:', error);
        countSpan.textContent = type.count;
      }
      div.appendChild(countSpan);
      
      // Label display
      const labelSpan = document.createElement('span');
      labelSpan.style.cssText = `
        font-size: 0.95em;
        color: #666;
        text-align: center;
        line-height: 1.2;
        pointer-events: none;
      `;
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
    // Don't re-render inventory while dragging to prevent breaking drag functionality
    if (window._draggingToken) {
      return;
    }
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
  // Initialize give token modal event handlers
  function initializeGiveTokenModal() {
    const modal = document.getElementById('giveTokenModal');
    
    if (!modal) {
      console.error('Give token modal not found during initialization!');
      return;
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeGiveTokenModal();
      }
    });
  }
  
  function closeGiveTokenModal() {
    const modal = document.getElementById('giveTokenModal');
    if (modal) {
      modal.style.display = 'none';
      modal._currentTokenType = null;
      modal._currentCharacterName = null;
    }
  }
  
  function giveTokenAmount(amount) {
    const modal = document.getElementById('giveTokenModal');
    if (!modal || !modal._currentTokenType || !modal._currentCharacterName) {
      console.error('Modal state not found for giving tokens');
      return;
    }

    const tokenType = modal._currentTokenType;
    const characterName = modal._currentCharacterName;

    console.log(`Debug - Attempting to give ${amount} ${tokenType} to ${characterName}`);

    // Define display names for tokens
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
      glitteringPetal: 'Glittering Petals',
      chargedPrisma: 'Charged Prisma'
    };

    // Define character token preferences (using storage keys)
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
      Vivien: { 
        likes: ['prisma', 'water'],
        dislikes: ['sparks'],
        neutral: ['berries', 'petals', 'mushroom', 'stardust']
      },
      Swaria: { 
        likes: ['berries', 'berryPlate'],
        dislikes: ['sparks', 'petals', 'prisma', 'stardust'],
        neutral: ['mushroom', 'water']
      },
      Lepre: {
        likes: ['berries', 'stardust'],
        dislikes: ['water'],
        neutral: ['sparks', 'prisma', 'mushroom', 'petals']
      },
      Tico: {
        likes: ['berries', 'mushroom', 'water'],
        dislikes: [],
        neutral: ['sparks', 'prisma', 'petals', 'stardust']
      }
    };

    // Get available amount using decimal arithmetic where needed
    const counts = window.kitchenIngredients || {};
    let available = 0;

    // Map token names to storage keys (some tokens have different names for display vs storage)
    const tokenToStorageKey = {
      'berry': 'berries',
      'petal': 'petals',
      'spark': 'sparks',
      'mushroom': 'mushroom',
      'water': 'water',
      'stardust': 'stardust',
      'prisma': 'prisma'
    };
    
    let storageKey = tokenToStorageKey[tokenType] || tokenType;

    if (tokenType === 'swabucks') {
      available = (window.state && window.state.swabucks) ? 
        (typeof window.state.swabucks.toNumber === 'function' ? window.state.swabucks.toNumber() : Number(window.state.swabucks)) : 0;
    } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'glitteringPetals' || tokenType === 'chargedPrisma') {
      available = (window.state && window.state[tokenType]) ? 
        (typeof window.state[tokenType].toNumber === 'function' ? window.state[tokenType].toNumber() : Number(window.state[tokenType])) : 0;
    } else {
      available = counts[storageKey] ? 
        (typeof counts[storageKey].toNumber === 'function' ? counts[storageKey].toNumber() : Number(counts[storageKey])) : 0;
    }

    if (amount > available) amount = available;
    if (amount === 0) {
      console.log('Debug - No tokens available to give');
      if (typeof window.updateSecretAchievementProgress === 'function') {
        window.updateSecretAchievementProgress('secret9', 1);
      }
      closeGiveTokenModal();
      return;
    }
    if (amount < 0) {
      closeGiveTokenModal();
      return;
    }

    console.log(`Debug - About to deduct ${amount} ${tokenType} (available: ${available})`);
    console.log(`Debug - friendshipAmount will be: ${amount}`);

    // Close modal first
    closeGiveTokenModal();

    // Process the token giving with all the quest logic from the old system
    let questSpeech = null;
    let friendshipAmount = amount;
    
    console.log(`Debug - Starting character-specific processing for ${characterName}`);
    console.log(`Debug - Initial friendshipAmount: ${friendshipAmount}`);

    // Always use quest logic for Soap's spark and battery tokens
    if (characterName === 'Soap' && tokenType === 'sparks' && typeof window.giveSparksToSoap === 'function') {
      console.log('[DEBUG] Calling window.giveSparksToSoap from giveTokenAmount');
      window.giveSparksToSoap(amount);
      if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
      return;
    }
    if (characterName === 'Soap' && tokenType === 'batteries' && typeof window.giveBatteriesToSoap === 'function') {
      console.log('[DEBUG] Calling window.giveBatteriesToSoap from giveTokenAmount');
      window.giveBatteriesToSoap(amount);
      if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
      return;
    }

    // Deduct tokens using decimal arithmetic
    console.log(`Debug - Deducting tokens: ${tokenType}, amount: ${amount}`);
    if (tokenType === 'swabucks') {
      if (window.state && window.state.swabucks) {
        const oldAmount = window.state.swabucks;
        if (typeof window.state.swabucks.minus === 'function') {
          window.state.swabucks = window.state.swabucks.minus(amount);
        } else {
          window.state.swabucks = new Decimal(window.state.swabucks).minus(amount);
        }
        console.log(`Debug - Swabucks: ${oldAmount} -> ${window.state.swabucks}`);
      }
    } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'glitteringPetals' || tokenType === 'chargedPrisma') {
      if (window.state && window.state[tokenType]) {
        const oldAmount = window.state[tokenType];
        if (typeof window.state[tokenType].minus === 'function') {
          window.state[tokenType] = window.state[tokenType].minus(amount);
        } else {
          window.state[tokenType] = new Decimal(window.state[tokenType]).minus(amount);
        }
        console.log(`Debug - ${tokenType}: ${oldAmount} -> ${window.state[tokenType]}`);
      }
    } else {
      if (window.kitchenIngredients[storageKey]) {
        const oldAmount = window.kitchenIngredients[storageKey];
        if (typeof window.kitchenIngredients[storageKey].minus === 'function') {
          window.kitchenIngredients[storageKey] = window.kitchenIngredients[storageKey].minus(amount);
        } else {
          window.kitchenIngredients[storageKey] = new Decimal(window.kitchenIngredients[storageKey]).minus(amount);
        }
        console.log(`Debug - ${tokenType}(${storageKey}): ${oldAmount} -> ${window.kitchenIngredients[storageKey]}`);
      }
    }

    console.log(`Debug - Token deduction completed. Now starting character-specific handling.`);
    console.log(`Debug - About to start character-specific blocks, characterName: ${characterName}`);
    
    // Handle Swaria consumption
    if (characterName === 'Swaria') {
      console.log(`Debug - In Swaria block`);
      if (tokenType === 'berryPlate') {
        if (window.state.characterHunger && window.state.characterHunger.swaria !== undefined) {
          window.state.characterHunger.swaria = 100;
        }
        // 10 minute boost
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
          if (swariaImg && typeof getMainCargoCharacterImage === 'function') {
            swariaImg.src = getMainCargoCharacterImage(true);
          }
          setTimeout(() => {
            swariaSpeech.style.display = "none";
            if (swariaImg && typeof getMainCargoCharacterImage === 'function') {
              swariaImg.src = getMainCargoCharacterImage(false);
            }
          }, 5000);
        }
      } else {
        // Regular food consumption
        if (window.state.characterHunger && window.state.characterHunger.swaria !== undefined) {
          const hungerGain = amount * 2;
          const newHunger = Math.min(100, window.state.characterHunger.swaria + hungerGain);
          const actualGain = newHunger - window.state.characterHunger.swaria;
          window.state.characterHunger.swaria = newHunger;
          
          if (typeof showGainPopup === 'function') {
            showGainPopup("hungerGain", `+${actualGain} Hunger`, "Swaria");
          }
          
          const swariaSpeech = document.getElementById('swariaSpeech');
          const swariaImg = document.getElementById('swariaCharacter');
          if (swariaSpeech) {
            const tokenDisplayName = displayNames[tokenType] || tokenType;
            swariaSpeech.textContent = `Nom nom nom! That ${tokenDisplayName} was delicious!`;
            swariaSpeech.style.display = "block";
            if (swariaImg && typeof getMainCargoCharacterImage === 'function') {
              swariaImg.src = getMainCargoCharacterImage(true);
            }
            setTimeout(() => {
              swariaSpeech.style.display = "none";
              if (swariaImg && typeof getMainCargoCharacterImage === 'function') {
                swariaImg.src = getMainCargoCharacterImage(false);
              }
            }, 5000);
          }
        }
      }
    }

    console.log(`Debug - About to check Tico handling. characterName: "${characterName}"`);
    console.log(`Debug - characterName === 'Tico': ${characterName === 'Tico'}`);
    console.log(`Debug - window.frontDesk exists: ${!!window.frontDesk}`);
    console.log(`Debug - handleTokenDrop function exists: ${typeof window.frontDesk?.handleTokenDrop}`);

    // Handle Tico tokens for front desk hunger system
    if (characterName === 'Tico') {
      console.log(`Debug - In Tico block, handling token for hunger system`);
      if (window.frontDesk && typeof window.frontDesk.handleTokenDrop === 'function') {
        window.frontDesk.handleTokenDrop(tokenType, amount);
        console.log(`Debug - Called frontDesk.handleTokenDrop with ${amount} ${tokenType}`);
      } else {
        console.log(`Debug - Front desk system not available`);
        console.log(`Debug - window.frontDesk:`, window.frontDesk);
        console.log(`Debug - handleTokenDrop type:`, typeof window.frontDesk?.handleTokenDrop);
      }
    }

    // Show quest speech if there is any
    if (questSpeech) {
      const characterIds = {
        'Soap': 'soapSpeech',
        'Vi': 'viSpeech',
        'Mystic': 'mysticSpeech',
        'Fluzzer': 'fluzzerSpeech'
      };
      
      const speechId = characterIds[characterName];
      if (speechId) {
        const speechElement = document.getElementById(speechId);
        if (speechElement) {
          speechElement.textContent = questSpeech;
          speechElement.style.display = "block";
          setTimeout(() => {
            speechElement.style.display = "none";
          }, 5000);
        }
      }
    }

    // Process character-specific interactions and friendship
    if (characterName !== 'Swaria') {
      // Call the main character processing function
      showCharacterSpeech(characterName, tokenType);
      
      // Add friendship points
      const charToDept = {
        'Swaria': 'Cargo',
        'Soap': 'Generator',
        'Mystic': 'Kitchen',
        'Fluzzer': 'Terrarium',
        'Vi': 'Lab',
        'Vivien': 'Lab',
        'Lepre': 'Boutique',
        'Tico': 'FrontDesk'
      };
      
      const dept = charToDept[characterName];
      if (dept && window.friendship && typeof window.friendship.addPoints === 'function') {
        // Map token names to storage keys for preferences
        const tokenToStorageKey = {
          'berry': 'berries',
          'petal': 'petals',
          'spark': 'sparks',
          'mushroom': 'mushroom',
          'water': 'water',
          'stardust': 'stardust',
          'prisma': 'prisma'
        };
        
        let storageKey = tokenToStorageKey[tokenType] || tokenType;
        let pointsPerToken = 5; // Default neutral
        
        // Check character preferences
        if (characterTokenPreferences && characterTokenPreferences[characterName]) {
          if (characterTokenPreferences[characterName].likes.includes(storageKey)) {
            pointsPerToken = 20;
          } else if (characterTokenPreferences[characterName].dislikes.includes(storageKey)) {
            pointsPerToken = 1;
          }
        }
        
        const totalPoints = new Decimal(pointsPerToken).mul(amount);
        window.friendship.addPoints(characterName, totalPoints);
        console.log(`Debug - Added ${totalPoints} friendship points to ${characterName}`);
      }
    }

    // Update all relevant UIs
    if (typeof window.updateInventoryDisplay === 'function') {
      window.updateInventoryDisplay();
    }
    if (typeof window.updateKitchenUI === 'function') {
      window.updateKitchenUI();
    }
    if (typeof window.updateCafeteriaUI === 'function') {
      window.updateCafeteriaUI();
    }
    if (typeof renderInventoryTokens === 'function') {
      renderInventoryTokens();
    }

    // Save the game to persist changes
    if (typeof window.saveGame === 'function') {
      window.saveGame();
    }

    console.log(`Debug - Successfully gave ${amount} ${tokenType} to ${characterName}`);
  }  setupCharacterDropTargets();
  initializeGiveTokenModal();
  
  // Setup character drop targets on tab switches
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
});

// Register time change callback to update boutique button
if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    updateBoutiqueButtonVisibility();
  });
} else {
  // If daynight system isn't loaded yet, try to register later
  setTimeout(() => {
    if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
      window.daynight.onTimeChange(function(mins) {
        updateBoutiqueButtonVisibility();
      });
    }
  }, 1000);
}

// Initial call to set proper state
setTimeout(() => {
  updateBoutiqueButtonVisibility();
}, 100);

// Recovery Export Function
function generateRecoveryExport(targetGrade) {
  // Create a minimal recovery save state for the specified expansion level
  const recoveryState = {
    state: {
      // Minimal resources - just enough to get started
      fluff: new Decimal("1000").toString(),
      kp: new Decimal("10").toString(), // Reset KP back to 10
      swariacoins: new Decimal("100").toString(),
      grade: targetGrade, // The main thing we want - correct expansion level
      feathers: targetGrade >= 4 ? new Decimal("100").toString() : "0",
      light: targetGrade >= 2 ? new Decimal("100").toString() : "0",
      redLight: targetGrade >= 4 ? new Decimal("100").toString() : "0",
      orangeLight: targetGrade >= 6 ? new Decimal("100").toString() : "0",
      yellowLight: targetGrade >= 8 ? new Decimal("100").toString() : "0",
      wingArtifacts: 0, // Start fresh
      // Power system - set to full
      powerEnergy: new Decimal("200").toString(),
      powerMaxEnergy: new Decimal("200").toString(),
      powerStatus: 'online',
      soapRefillUsed: false,
      elementDiscoveryProgress: 0, // Start fresh
      // Special/cooked tokens (stored in state) - only for expansion 4-7
      glitteringPetals: targetGrade >= 4 ? 1 : 0,
      chargedPrisma: targetGrade >= 4 ? 1 : 0,
      batteries: targetGrade >= 4 ? 1 : 0,
      mushroomSoup: targetGrade >= 4 ? 1 : 0,
      berryPlate: targetGrade >= 4 ? 1 : 0,
      swabucks: new Decimal("50").toString() // 50 swabucks tokens
    },
    settings: {
      autosave: true,
      confirmNectarizeReset: true,
      colour: "green",
      style: "rounded"
    },
    swariaKnowledge: {}, // Start fresh with no knowledge
    boughtElements: getBoughtElementsForGrade(targetGrade), // Elements 7&8 + basics
    elementDiscoveryProgress: 0,
    generatorUpgrades: {}, // Start fresh
    prismState: targetGrade >= 2 ? {
      discovered: ["white"],
      unlocked: targetGrade >= 4 ? ["white", "red"] : ["white"],
      orangeUnlocked: targetGrade >= 6,
      yellowUnlocked: targetGrade >= 8
    } : {},
    generatorsUnlocked: getGeneratorsUnlockedForGrade(targetGrade),
    chargerCharge: 0, // Start fresh
    chargerSoapState: {},
    // Terrarium - start fresh
    terrariumPollen: "0",
    terrariumFlowers: 0,
    terrariumXP: 0,
    terrariumLevel: 1,
    terrariumPollenValueUpgradeLevel: 0,
    terrariumNectar: 0,
    nectarizeMachineRepaired: targetGrade >= 6,
    hardModePermanentlyUnlocked: false,
    // Kitchen ingredients (basic tokens) - 50 of each
    kitchenIngredients: getKitchenIngredientsForGrade(targetGrade),
    friendship: {}, // Start fresh with no friendship
    chargerState: {
      charge: 0,
      milestones: [],
      milestoneQuests: null,
      questStage: 0
    },
    // Hard mode quest progress - start fresh  
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
    // Quest tokens - start fresh
    nectarizeQuestGivenBattery: 0,
    nectarizeQuestGivenSparks: 0,
    nectarizeQuestGivenPetals: 0,
    achievementData: null,
    secretAchievementData: null
  };

  // Serialize and export
  const serializedSave = DecimalUtils.serializeGameState(recoveryState);
  const saveData = btoa(unescape(encodeURIComponent(JSON.stringify(serializedSave))));
  navigator.clipboard.writeText(saveData).then(() => {
    alert(`Recovery export code for Expansion ${targetGrade} copied to clipboard!`);
  }).catch(() => {
    // Fallback for browsers without clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = saveData;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(`Recovery export code for Expansion ${targetGrade} copied to clipboard!`);
  });
}

// Helper functions for recovery export
function getKPForGrade(grade) {
  // Based on the expansion costs in expansion.js
  const baseCosts = {
    2: new Decimal("2e4"),
    3: new Decimal("1e10"), 
    4: new Decimal("1e20"),
    5: new Decimal("1e30"),
    6: new Decimal("1e40"),
    7: new Decimal("1e60")
  };
  
  // Provide just enough to reach this expansion (modest surplus)
  const baseCost = baseCosts[grade] || new Decimal("1e80");
  return baseCost.mul(2); // Give 2x the required amount for some buffer
}

function getBoughtElementsForGrade(grade) {
  const elements = {};
  
  // Only include elements 7 and 8 for all recovery exports
  elements[7] = true;  // Nitrogen
  elements[8] = true;  // Oxygen
  
  // No other elements - fresh start approach
  return elements;
}

function getGeneratorsUnlockedForGrade(grade) {
  const unlocked = [true, true, true]; // fluff, kp, swariacoins always unlocked
  
  if (grade >= 2) unlocked.push(true); // light
  else unlocked.push(false);
  
  if (grade >= 4) {
    unlocked.push(true); // feathers
    unlocked.push(true); // redLight
  } else {
    unlocked.push(false);
    unlocked.push(false);
  }
  
  if (grade >= 6) unlocked.push(true); // orangeLight
  else unlocked.push(false);
  
  if (grade >= 8) unlocked.push(true); // yellowLight
  else unlocked.push(false);
  
  return unlocked;
}

function getKitchenIngredientsForGrade(grade) {
  if (grade < 2) return {}; // No tokens before expansion 2
  
  // Return tokens using the correct keys that match the inventory system
  return {
    berries: 50, // Berry tokens (key: 'berries', not 'berry')
    mushroom: 50, // Mushroom tokens  
    petals: 50, // Petal tokens
    sparks: 50, // Spark tokens
    water: 50, // Water tokens
    stardust: 50, // Stardust tokens  
    prisma: 50 // Prisma shard tokens
    // Removed honey - not an official token
    // Cooked items like berryPlate, batteries, etc. are stored in state, not kitchenIngredients
  };
}

// Game integrity checker to prevent corrupted saves
function checkGameIntegrity() {
  try {
    // Check if essential objects exist
    if (!window.state || !window.kitchenIngredients || !window.friendship) {
      return false;
    }
    
    // Check if core values are reasonable
    if (window.state.fluff && window.state.fluff.lt && window.state.fluff.lt(0)) {
      return false;
    }
    
    // Check if friendship system is intact
    if (typeof window.friendship.addPoints !== 'function') {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Integrity check failed:', error);
    return false;
  }
}

// Initialize integrity monitoring
if (typeof window !== 'undefined') {
  window.checkGameIntegrity = checkGameIntegrity;
  
  // Add console command for emergency recovery
  window.emergencyRecovery = function(slotNumber) {
    if (!slotNumber) slotNumber = localStorage.getItem('currentSaveSlot');
    if (!slotNumber) {
      console.log('No slot number specified and no current slot found.');
      return false;
    }
    
    console.log(`Attempting emergency recovery for slot ${slotNumber}...`);
    
    // Try regular backup first
    if (recoverFromBackup(slotNumber)) {
      return true;
    }
    
    // Try emergency backup if regular backup failed
    const emergencyKey = `swariaSaveSlot${slotNumber}_emergency`;
    const emergencyData = localStorage.getItem(emergencyKey);
    if (emergencyData && confirm('Regular backup failed. Try emergency backup? (This is older data)')) {
      try {
        localStorage.setItem(`swariaSaveSlot${slotNumber}`, emergencyData);
        loadFromSlot(slotNumber);
        alert('Emergency recovery successful! Some recent progress may be lost.');
        return true;
      } catch (error) {
        console.error('Emergency recovery failed:', error);
        alert('Emergency recovery failed.');
      }
    }
    
    return false;
  };
  
  // Add console command to check save integrity
  window.checkSaveIntegrity = function() {
    const isIntact = checkGameIntegrity();
    console.log('Game integrity check:', isIntact ? 'PASSED' : 'FAILED');
    
    if (!isIntact) {
      console.log('Issues found:');
      if (!window.state) console.log('- Missing window.state');
      if (!window.kitchenIngredients) console.log('- Missing window.kitchenIngredients');
      if (!window.friendship) console.log('- Missing window.friendship');
      if (window.state && window.state.fluff && window.state.fluff.lt && window.state.fluff.lt(0)) {
        console.log('- Negative fluff value detected');
      }
    }
    
    return isIntact;
  };
}

// UI function for emergency recovery button
function performEmergencyRecovery() {
  const statusDiv = document.getElementById('recoveryStatus');
  const currentSlot = localStorage.getItem('currentSaveSlot');
  
  if (!currentSlot) {
    showRecoveryStatus('No save slot selected. Please select a save slot first.', 'error');
    return;
  }
  
  // Show initial status
  showRecoveryStatus('Attempting recovery...', 'warning');
  
  // Check if backup exists
  const backupKey = `swariaSaveSlot${currentSlot}_backup`;
  const emergencyKey = `swariaSaveSlot${currentSlot}_emergency`;
  const hasBackup = localStorage.getItem(backupKey);
  const hasEmergency = localStorage.getItem(emergencyKey);
  
  if (!hasBackup && !hasEmergency) {
    showRecoveryStatus('No backup saves found for this slot.', 'error');
    return;
  }
  
  // Ask user which recovery method to use
  let recoveryMethod = 'backup';
  if (hasBackup && hasEmergency) {
    recoveryMethod = confirm(
      'Two recovery options available:\n\n' +
      'OK - Use recent backup (recommended)\n' +
      'Cancel - Use emergency backup (older but more stable)'
    ) ? 'backup' : 'emergency';
  } else if (hasEmergency && !hasBackup) {
    recoveryMethod = 'emergency';
  }
  
  // Perform recovery
  try {
    const recoveryKey = recoveryMethod === 'backup' ? backupKey : emergencyKey;
    const recoveryData = localStorage.getItem(recoveryKey);
    
    if (!recoveryData) {
      throw new Error('Recovery data not found');
    }
    
    // Validate recovery data
    const testData = JSON.parse(recoveryData);
    if (!testData || !testData.kitchenIngredients || !testData.friendship) {
      throw new Error('Recovery data appears incomplete');
    }
    
    // Create backup of current corrupted save before recovery
    const currentSave = localStorage.getItem(`swariaSaveSlot${currentSlot}`);
    if (currentSave) {
      localStorage.setItem(`swariaSaveSlot${currentSlot}_corrupted_backup`, currentSave);
    }
    
    // Restore the backup
    localStorage.setItem(`swariaSaveSlot${currentSlot}`, recoveryData);
    
    // Reload the game
    setTimeout(() => {
      showRecoveryStatus(
        `Recovery successful! Restored from ${recoveryMethod} save. Reloading game...`, 
        'success'
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 500);
    
  } catch (error) {
    console.error('Recovery failed:', error);
    showRecoveryStatus(
      'Recovery failed: ' + error.message + '. You may need to use an export code instead.', 
      'error'
    );
  }
}

// Helper function to show recovery status messages
function showRecoveryStatus(message, type) {
  const statusDiv = document.getElementById('recoveryStatus');
  if (!statusDiv) return;
  
  statusDiv.style.display = 'block';
  statusDiv.textContent = message;
  statusDiv.className = 'recovery-status-' + type;
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}

// Function to update recovery tab with backup status
function updateRecoveryTabStatus() {
  const currentSlot = localStorage.getItem('currentSaveSlot');
  const recoveryBtn = document.getElementById('emergencyRecoveryBtn');
  
  if (!recoveryBtn) return;
  
  if (!currentSlot) {
    recoveryBtn.disabled = true;
    recoveryBtn.textContent = 'Emergency Recovery (No slot selected)';
    recoveryBtn.style.opacity = '0.6';
    return;
  }
  
  const backupKey = `swariaSaveSlot${currentSlot}_backup`;
  const emergencyKey = `swariaSaveSlot${currentSlot}_emergency`;
  const hasBackup = localStorage.getItem(backupKey);
  const hasEmergency = localStorage.getItem(emergencyKey);
  
  if (hasBackup || hasEmergency) {
    recoveryBtn.disabled = false;
    recoveryBtn.style.opacity = '1';
    let backupInfo = [];
    if (hasBackup) backupInfo.push('Recent');
    if (hasEmergency) backupInfo.push('Emergency');
    recoveryBtn.textContent = `Emergency Recovery (${backupInfo.join(' + ')} available)`;
  } else {
    recoveryBtn.disabled = true;
    recoveryBtn.style.opacity = '0.6';
    recoveryBtn.textContent = 'Emergency Recovery (No backups found)';
  }
}

// Add event listener to update recovery status when Recovery tab is shown
document.addEventListener('DOMContentLoaded', function() {
  const recoveryTabBtn = document.getElementById('settingsRecoveryTabBtn');
  if (recoveryTabBtn) {
    recoveryTabBtn.addEventListener('click', function() {
      setTimeout(updateRecoveryTabStatus, 100);
    });
  }
  
  // Also update when settings page is opened
  const settingsNavBtn = document.querySelector('[data-target="settings"]');
  if (settingsNavBtn) {
    settingsNavBtn.addEventListener('click', function() {
      setTimeout(updateRecoveryTabStatus, 200);
    });
  }
});

// --- DELIVERY RESET BACKUP SYSTEM ---

// Function to save complete game state before delivery reset
function saveDeliveryResetBackup() {
  try {
    console.log('[DELIVERY BACKUP] Saving complete game state before delivery reset...');
    
    // Get current complete game state using the same logic as saveGame()
    const completeGameState = createCompleteGameState();
    
    // Add metadata about the backup
    const backupData = {
      gameState: completeGameState,
      timestamp: Date.now(),
      grade: state.grade ? state.grade.toString() : "1",
      artifacts: state.artifacts ? state.artifacts.toString() : "0",
      kp: swariaKnowledge.kp ? swariaKnowledge.kp.toString() : "0"
    };
    
    // Use save slot specific key if using save slots
    const saveSlotNumber = localStorage.getItem('currentSaveSlot');
    const backupKey = saveSlotNumber ? 
      `deliveryResetBackup_slot${saveSlotNumber}` : 
      'deliveryResetBackup';
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    
    console.log('[DELIVERY BACKUP] Backup saved successfully:', backupKey);
    updateLastDeliveryInfo(backupData);
    
  } catch (error) {
    console.error('[DELIVERY BACKUP] Failed to save backup:', error);
  }
}

// Function to create complete game state (similar to saveGame but returns the data)
function createCompleteGameState() {
  // Ensure kitchen ingredients are Decimals
  if (window.kitchenIngredients) {
    ['mushroom', 'sparks', 'berries', 'petals', 'water', 'prisma', 'stardust', 'swabucks', 'berryPlate',].forEach(type => {
      if (!DecimalUtils.isDecimal(window.kitchenIngredients[type])) {
        window.kitchenIngredients[type] = new Decimal(window.kitchenIngredients[type] || 0);
      }
    });
  }

  const berryCookingState = localStorage.getItem('berryCookingState') || null;
  
  const generatorSpeedUpgrades = {};
  const generatorSpeedMultipliers = {};
  const generatorUpgradeLevels = {};
  generators.forEach(gen => {
    generatorSpeedUpgrades[gen.reward] = gen.speedUpgrades || 0;
    generatorSpeedMultipliers[gen.reward] = gen.speedMultiplier || 1;
    generatorUpgradeLevels[gen.reward] = gen.upgrades || 0;
  });

  const gameState = {
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
      availableWorkers: window.frontDeskState.availableWorkers,
      assignedWorkers: window.frontDeskState.assignedWorkers,
      unlockedSlots: window.frontDeskState.unlockedSlots,
      nextArrivalTime: window.frontDeskState.nextArrivalTime,
      isUnlocked: window.frontDeskState.isUnlocked
    } : { employees: {}, totalHired: 0 },
    
    // Add advanced prism calibration state
    advancedPrismCalibration: window.advancedPrismState ? {
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
    } : {
      stable: {
        light: "0", redlight: "0", orangelight: "0", yellowlight: "0", greenlight: "0", bluelight: "0"
      },
      nerfs: {
        light: "1", redlight: "1", orangelight: "1", yellowlight: "1", greenlight: "1", bluelight: "1"
      },
      totalTimeAccumulated: {
        light: 0, redlight: 0, orangelight: 0, yellowlight: 0, greenlight: 0, bluelight: 0
      }
    }
  };

  // Include infinity data if not using save slots or handle appropriately
  const saveSlotForInfinity = localStorage.getItem('currentSaveSlot');
  if (!saveSlotForInfinity) {
    gameState.infinityTreeData = window.infinitySystem ? {
      infinityPoints: window.infinitySystem.infinityPoints.toString(),
      infinityTheorems: window.infinitySystem.infinityTheorems,
      theoremProgress: window.infinitySystem.theoremProgress.toString(),
      totalInfinityEarned: window.infinitySystem.totalInfinityEarned,
      upgrades: window.infinityUpgrades ? window.infinityUpgrades : {},
      everReached: window.infinitySystem.everReached || {},
      caps: window.infinityCaps || {}
    } : {
      infinityPoints: "0",
      infinityTheorems: 0,
      theoremProgress: "0",
      totalInfinityEarned: 0,
      upgrades: {},
      everReached: {},
      caps: {}
    };
    gameState.infinityChallengeData = (typeof window.infinityChallenges !== 'undefined' && typeof window.activeChallenge !== 'undefined' && typeof window.activeDifficulty !== 'undefined') ? {
      challenges: window.infinityChallenges,
      activeChallenge: window.activeChallenge,
      activeDifficulty: window.activeDifficulty
    } : {
      challenges: {},
      activeChallenge: 0,
      activeDifficulty: 0
    };
  }

  return gameState;
}

// Function to export the last delivery reset backup as a code
function exportLastDeliveryReset() {
  try {
    const saveSlotNumber = localStorage.getItem('currentSaveSlot');
    const backupKey = saveSlotNumber ? 
      `deliveryResetBackup_slot${saveSlotNumber}` : 
      'deliveryResetBackup';
    
    const backupDataString = localStorage.getItem(backupKey);
    
    if (!backupDataString) {
      showRecoveryExportStatus('No delivery reset backup found. You need to perform at least one delivery reset first.', 'error');
      return;
    }
    
    const backupData = JSON.parse(backupDataString);
    
    // Serialize the game state for export
    const serializedGameState = DecimalUtils.serializeGameState(backupData.gameState);
    const exportCode = btoa(JSON.stringify(serializedGameState));
    
    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(exportCode).then(() => {
        showRecoveryExportStatus('Export code copied to clipboard! This code contains your complete game state from your last delivery reset.', 'success');
      }).catch(() => {
        fallbackCopyToClipboard(exportCode);
      });
    } else {
      fallbackCopyToClipboard(exportCode);
    }
    
    // Show backup info
    updateLastDeliveryInfo(backupData);
    
  } catch (error) {
    console.error('[DELIVERY BACKUP] Failed to export backup:', error);
    showRecoveryExportStatus('Failed to export backup. Please try again.', 'error');
  }
}

// Fallback copy to clipboard function
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showRecoveryExportStatus('Export code copied to clipboard! This code contains your complete game state from your last delivery reset.', 'success');
  } catch (err) {
    showRecoveryExportStatus('Failed to copy to clipboard. Please copy the code manually from the console.', 'error');
    console.log('Export code:', text);
  }
  
  document.body.removeChild(textArea);
}

// Function to show export status
function showRecoveryExportStatus(message, type) {
  const statusDiv = document.getElementById('recoveryExportStatus');
  if (!statusDiv) return;
  
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  
  // Set colors based on type
  if (type === 'success') {
    statusDiv.style.background = '#d4edda';
    statusDiv.style.color = '#155724';
    statusDiv.style.border = '1px solid #c3e6cb';
  } else if (type === 'error') {
    statusDiv.style.background = '#f8d7da';
    statusDiv.style.color = '#721c24';
    statusDiv.style.border = '1px solid #f5c6cb';
  } else {
    statusDiv.style.background = '#e2e3e5';
    statusDiv.style.color = '#383d41';
    statusDiv.style.border = '1px solid #d6d8db';
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}

// Function to update last delivery info display
function updateLastDeliveryInfo(backupData) {
  const infoDiv = document.getElementById('lastDeliveryInfo');
  const timestampDiv = document.getElementById('lastDeliveryTimestamp');
  const gradeDiv = document.getElementById('lastDeliveryGrade');
  
  if (!infoDiv || !timestampDiv || !gradeDiv) return;
  
  const date = new Date(backupData.timestamp);
  const formattedDate = date.toLocaleString();
  
  timestampDiv.textContent = `Last delivery reset: ${formattedDate}`;
  
  // Get total infinity count if available
  let gradeText = `Expansion: ${backupData.grade} | KP: ${formatNumber(new Decimal(backupData.kp))}`;
  
  // Check if infinity system exists and player has infinities
  if (typeof getTotalInfinities === 'function') {
    const totalInfinities = getTotalInfinities();
    if (totalInfinities >= 1) {
      gradeText += ` | Total ∞: ${formatNumber(new Decimal(totalInfinities))}`;
    }
  }
  
  gradeDiv.textContent = gradeText;
  
  infoDiv.style.display = 'block';
}

// Function to check and display last delivery info on page load
function checkLastDeliveryInfo() {
  const saveSlotNumber = localStorage.getItem('currentSaveSlot');
  const backupKey = saveSlotNumber ? 
    `deliveryResetBackup_slot${saveSlotNumber}` : 
    'deliveryResetBackup';
  
  const backupDataString = localStorage.getItem(backupKey);
  
  if (backupDataString) {
    try {
      const backupData = JSON.parse(backupDataString);
      updateLastDeliveryInfo(backupData);
    } catch (error) {
      console.error('[DELIVERY BACKUP] Failed to parse backup data:', error);
    }
  }
}

// Make functions available globally
window.saveDeliveryResetBackup = saveDeliveryResetBackup;
window.exportLastDeliveryReset = exportLastDeliveryReset;
window.checkLastDeliveryInfo = checkLastDeliveryInfo;
window.showSoapDisappointedSpeech = showSoapDisappointedSpeech;

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkLastDeliveryInfo, 1000);
  });
} else {
  setTimeout(checkLastDeliveryInfo, 1000);
}
    

