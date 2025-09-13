// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// DecimalUtils is available globally from decimal_utils.js















































window.updateElementGrid = window.updateElementGrid || function () {};
if (!state.grade) state.grade = 1;

function calculatePowerGeneratorCap() {
  let baseCap = new Decimal(100);
  if (state.grade.gte(2)) {
    baseCap = baseCap.add(state.grade.sub(1).mul(20));
  }
  return baseCap;
}

// Make expansion functions globally accessible
window.calculatePowerGeneratorCap = calculatePowerGeneratorCap;



// Make expansion functions globally accessible
window.calculatePowerGeneratorCap = calculatePowerGeneratorCap;

function updateGradeUI() {
  const gradeDisplay = document.getElementById("currentGrade");
  const gradeUpBtn = document.getElementById("gradeUpBtn");
  const reqDisplay = document.getElementById("prestigeRequirement");
  
  // Convert Decimal grade to number for display
  const currentGrade = DecimalUtils.isDecimal(state.grade) ? state.grade.toNumber() : (state.grade || 1);
  if (gradeDisplay) gradeDisplay.textContent = currentGrade;
  
  const nextGrade = currentGrade + 1;
  const nextCost = getGradeKPCost(nextGrade);
  const kpDecimal = DecimalUtils.isDecimal(swariaKnowledge.kp) ? swariaKnowledge.kp : new Decimal(swariaKnowledge.kp || 0);
  if (kpDecimal.gte(nextCost)) {
    gradeUpBtn.disabled = false;
    gradeUpBtn.classList.add("glow");
  } else {
    gradeUpBtn.disabled = true;
    gradeUpBtn.classList.remove("glow");
  }
  if (reqDisplay) {
    reqDisplay.textContent = `Reach ${formatNumber(nextCost)} KP to unlock expansion ${nextGrade}.`;
  }
  
  // Update boutique button visibility when grade changes
  if (typeof window.updateBoutiqueButtonVisibility === 'function') {
    window.updateBoutiqueButtonVisibility();
  }
}

function getGradeKPCost(grade) {
  if (grade === 2) return new Decimal("2e4"); // 20000 KP
  if (grade === 3) return new Decimal("1e10"); // 1e10 KP
  if (grade === 4) return new Decimal("1e20"); // 1e20 KP
  if (grade === 5) return new Decimal("1e30"); // 1e30 KP
  if (grade === 6) return new Decimal("1e40"); // 1e40 KP
  if (grade === 7) return new Decimal("1e50"); // 1e50 KP
  if (grade === 8) return new Decimal("1e727"); // 1e727 KP
  if (grade === 9) return new Decimal("1.8e308"); // 1.8e308 KP
  if (grade === 10) return new Decimal("1e1000"); // 1e1000 KP (final expansion)
  
  // Fallback for any grades beyond 10 (shouldn't happen with final expansion at 10)
  return new Decimal("1e1000");
}

const gradePrestigeMilestones = [
  { grade: 1, reward: 'Unlock the cargo and the generator.' },
  { grade: 2, reward: 'Double Fluff gain for every new expansion starting at second expansion, Add 20 more power generator cap every new expansion, unlock the lab and the permanently front desk' },
    { grade: 3, reward: 'Double light gain and swaria coins gain for every new expansion starting at third expansion' },
    { grade: 4, reward: 'Double Feathers gain for every new expansion starting at fourth expansion, Unlock red light, Unlock the merchant.' },
    { grade: 5, reward: 'Double red light gain and Wing artifact gain for every new expansion starting at fourth expansion, unlock the charger' },
    { grade: 6, reward: 'Unlock orange light and unlock the second floor' },
    { grade: 7, reward: 'Double orange light gain and expand the terrarium' },
    { grade: 8, reward: '(wip)' },
    { grade: 9, reward: '(wip)' },
    { grade: 10, reward: '(wip)' },
];

function updateMilestoneTable() {
  const milestoneBody = document.getElementById('milestoneBody');
  if (!milestoneBody) return;
  const milestones = [
    { grade: 1, reward: 'Unlock the cargo and the generator.' },
    { grade: 2, reward: 'Double Fluff gain for every new expansion starting at second expansion, Add 20 more power generator cap every new expansion, unlock the lab and permanently unlock the front desk' },
    { grade: 3, reward: 'Double light gain and swaria coins gain for every new expansion starting at third expansion, Unlock the kitchen.' },
    { grade: 4, reward: 'Double Feathers gain for every new expansion starting at fourth expansion, Unlock red light, Unlock the merchant.' },
    { grade: 5, reward: 'Double red light and Wing artifact for every new expansion starting at fifth expansion, unlock the charger' },
    { grade: 6, reward: 'Unlock orange light and unlock the second floor' },
    { grade: 7, reward: 'Double orange light gain and expand the terrarium' },
    { grade: 8, reward: '(wip)' },
    { grade: 9, reward: '(wip)' },
    { grade: 10, reward: '(wip)' },
  ];
  milestoneBody.innerHTML = '';
  milestones.forEach(m => {
    const tr = document.createElement('tr');
    const gradeTd = document.createElement('td');
    gradeTd.textContent = m.grade;
    const rewardTd = document.createElement('td');
    rewardTd.textContent = m.reward ? m.reward : '\u00A0';
    rewardTd.className = ((state.grade || 1) >= m.grade) ? 'milestone-reward-complete' : 'milestone-reward-incomplete';
    tr.appendChild(gradeTd);
    tr.appendChild(rewardTd);
    milestoneBody.appendChild(tr);
  });
}

function showGraduationSwariaSpeech(grade) {
  const speechBox = document.getElementById('graduationSwariaSpeech');
  const swariaImg = document.getElementById('graduationSwariaImage');
  const swariaCard = document.getElementById('graduationSwariaCard');
  if (!speechBox || !swariaImg || !swariaCard) return;
  let pool;
  if (grade >= 6) {
    pool = graduationSwariaSpeechesByGrade[6];
  } else {
    pool = graduationSwariaSpeechesByGrade[grade] || graduationSwariaSpeechesByGrade[6];
  }
  const random = pool[Math.floor(Math.random() * pool.length)];
  speechBox.textContent = random;
  swariaCard.style.position = 'relative';
  speechBox.className = 'swaria-speech';
  speechBox.style.display = 'block';
  speechBox.style.background = 'white';
  speechBox.style.color = 'black';
  speechBox.style.position = 'absolute';
  speechBox.style.left = '100%';
  speechBox.style.top = '50%';
  speechBox.style.transform = 'translateY(-50%) translateX(18px)';
  speechBox.style.zIndex = '10';
  swariaImg.src = 'assets/icons/swaria speach grade.png';
  setTimeout(() => {
    speechBox.style.display = 'none';
    swariaImg.src = 'assets/icons/swaria grade.png';
  }, 5000);
}

function showGradeUpAnimation(oldGrade, newGrade) {
  const overlay = document.getElementById('gradeUpAnimation');
  const oldSpan = overlay.querySelector('.grade-old');
  const newSpan = overlay.querySelector('.grade-new');
  overlay.style.display = 'flex';
  oldSpan.textContent = oldGrade;
  newSpan.textContent = newGrade;
  oldSpan.style.opacity = '1';
  newSpan.style.opacity = '0';
  oldSpan.style.animation = 'none';
  newSpan.style.animation = 'none';
  void oldSpan.offsetWidth;
  void newSpan.offsetWidth;
  oldSpan.style.animation = 'gradeOldBounceOut 1s cubic-bezier(.68,-0.55,.27,1.55) forwards';
  newSpan.style.animation = 'gradeNewBounceIn 1s 0.5s cubic-bezier(.68,-0.55,.27,1.55) forwards';
  setTimeout(() => {
    overlay.style.display = 'none';
    oldSpan.textContent = '';
    newSpan.textContent = '';
    showGraduationSwariaSpeech(newGrade);
    updateGradeUI();
    renderElementGrid();
    updatePrismSubTabVisibility();
    updateMilestoneTable();
    updateKnowledgeUI();
    saveGame();
  }, 1800);
}

// Reset terrarium content - now only used for infinity reset, not expansion reset
function resetTerrariumContent() {
  window.terrariumPollen = new Decimal(0);
  window.terrariumFlowers = new Decimal(0);
  window.terrariumXP = new Decimal(0);
  window.terrariumLevel = 1;
  window.terrariumPollenValueUpgradeLevel = 0;
  window.terrariumPollenValueUpgrade2Level = 0;
  window.terrariumFlowerValueUpgradeLevel = 0;
  window.terrariumPollenToolSpeedUpgradeLevel = 0;
  window.terrariumFlowerXPUpgradeLevel = 0;
  window.terrariumExtraChargeUpgradeLevel = 0;
  window.terrariumXpMultiplierUpgradeLevel = 0;
  window.terrariumFlowerFieldExpansionUpgradeLevel = 0; 
  window.terrariumKpNectarUpgradeLevel = 0;
  window.terrariumPollenFlowerNectarUpgradeLevel = 0;
  window.terrariumNectarXpUpgradeLevel = 0;
  window.terrariumNectarValueUpgradeLevel = 0;
  if (window.terrariumFlowerGrid) {
    window.terrariumFlowerGrid.forEach(flower => {
      flower.health = 5;
    });
  }
  if (typeof window.stopFluzzerAI === 'function') {
    window.stopFluzzerAI();
  }
  if (typeof window.stopFluzzerRandomSpeechTimer === 'function') {
    window.stopFluzzerRandomSpeechTimer();
  }
  if (typeof window.pollenWandActive !== 'undefined') window.pollenWandActive = false;
  if (typeof window.wateringCanActive !== 'undefined') window.wateringCanActive = false;
  document.body.classList.remove('pollen-wand-mode', 'watering-can-mode');
  if (typeof window.pollenWandCooldown !== 'undefined') window.pollenWandCooldown = false;
  if (typeof window.wateringCanCooldown !== 'undefined') window.wateringCanCooldown = false;
  if (typeof window.fluzzerClickCount !== 'undefined') window.fluzzerClickCount = 0;
  if (typeof window.stopFlowerRegrowthTimer === 'function') {
    window.stopFlowerRegrowthTimer();
  }
  if (typeof window.rustlingFlowerIndices !== 'undefined') {
    window.rustlingFlowerIndices = [];
  }
  if (typeof window.fluzzerHasWelcomed !== 'undefined') {
    window.fluzzerHasWelcomed = false;
  }
  window.nectarizeResets = 0;
  window.nectarizeResetBonus = 0;
  window.nectarizeMachineLevel = 1;
  window.terrariumNectar = 0;
  window.nectarizePostResetTokenRequirement = 0;
  window.nectarizePostResetTokensGiven = 0;
  window.nectarizePostResetTokenType = 'petals';
  if (typeof window.renderTerrariumUI === 'function') {
    window.renderTerrariumUI();
  }
}

window.resetTerrariumContent = resetTerrariumContent;

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
  
  // Update front desk unlock status
  if (typeof window.frontDesk !== 'undefined' && window.frontDesk.updateHighestGrade) {
    window.frontDesk.updateHighestGrade();
  }
  
  // Update nectarize button visibility based on new grade
  if (typeof window.updateNectarizeButtonVisibility === 'function') {
    window.updateNectarizeButtonVisibility();
  }
  
  if (typeof window.trackGradeMilestone === 'function') {
    window.trackGradeMilestone(nextGrade);
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
  state.boxesProduced = new Decimal(0);
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
  state.fluff = new Decimal(0);
  state.swaria = new Decimal(0);
  state.feathers = new Decimal(0);
  state.artifacts = new Decimal(0);
  state.fluffInfinityCount = new Decimal(0);
  state.swariaInfinityCount = new Decimal(0);
  state.feathersInfinityCount = new Decimal(0);
  state.artifactsInfinityCount = new Decimal(0);
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
  // Terrarium content is now preserved during expansion resets
  // resetTerrariumContent(); // Commented out to preserve terrarium progress

  resetChargerWhenAvailable();
  // Charger is now part of the generator main tab, no separate button needed
  const calculatedCap = calculatePowerGeneratorCap();
  if (state.powerEnergy.gt(calculatedCap)) {
    state.powerEnergy = calculatedCap;
  }
  if (typeof window.trackExpansionReset === 'function') {
    window.trackExpansionReset();
  }
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}

function updatePrismSubTabVisibility() {
  const labBtn = document.getElementById("prismSubTabBtn");
  if (!labBtn) return;
  
  // Hide Observatory button on floor 2 (per user request)
  if (window.currentFloor === 2) {
    labBtn.style.setProperty('display', 'none', 'important');
    labBtn.textContent = 'Observatory';
  } else if (state.grade >= 2) {
    labBtn.style.display = "inline-block";
  } else {
    labBtn.style.display = "none";
  }
}

window.gradeUp = gradeUp;

function getLightGain(baseLight) {
  let grade = state.grade || 1;
  if (grade >= 3) {
    baseLight = DecimalUtils.multiply(baseLight, new Decimal(2).pow(grade - 2)); 
  }
  
  // Apply flower upgrade 5 effect
  if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
    baseLight = baseLight.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
  }
  
  // Lab boost is now handled in addCurrency, not here
  return baseLight;
}

function getSwariaCoinGain(baseSwaria) {
  let grade = state.grade || 1;
  if (grade >= 3) {
    baseSwaria = DecimalUtils.multiply(baseSwaria, new Decimal(2).pow(grade - 2)); 
  }
  
  // Apply green light boost to swaria coins
  if (window.prismState && window.prismState.greenlight && window.prismState.greenlight.gt(0)) {
    baseSwaria = baseSwaria.mul(window.prismState.greenlight);
  }
  
  return baseSwaria;
}

function getFeatherGain(baseFeather) {
  let grade = state.grade || 1;
  if (grade >= 4) {
    return DecimalUtils.multiply(baseFeather, new Decimal(2).pow(grade - 2)); 
  }
  return baseFeather;
}

function getRedlightGain(baseRedlight) {
  let grade = state.grade || 1;
  if (grade >= 5) {
    baseRedlight = DecimalUtils.multiply(baseRedlight, new Decimal(2).pow(grade - 4)); 
  }
  
  // Apply flower upgrade 5 effect
  if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
    baseRedlight = baseRedlight.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
  }
  
  // Lab boost is now handled in addCurrency, not here
  return baseRedlight;
}

window.getRedlightGain = getRedlightGain;

function getOrangelightGain(baseOrangelight) {
  let grade = state.grade || 1;
  if (grade >= 7) {
    baseOrangelight = DecimalUtils.multiply(baseOrangelight, new Decimal(2).pow(grade - 6)); 
  }
  
  // Apply flower upgrade 5 effect
  if (typeof window.getFlowerUpgrade5Effect === 'function' && typeof window.terrariumFlowerUpgrade5Level === 'number') {
    baseOrangelight = baseOrangelight.mul(window.getFlowerUpgrade5Effect(window.terrariumFlowerUpgrade5Level));
  }
  
  // Lab boost is now handled in addCurrency, not here
  return baseOrangelight;
}

window.getOrangelightGain = getOrangelightGain;

function getWingArtifactGainMultiplier() {
  let grade = state.grade || 1;
  if (grade >= 5) {
    return new Decimal(2).pow(grade - 4); 
  }
  return new Decimal(1);
}





function switchCafeteriaSubTab(subTabId) {
  document.querySelectorAll('.cafeteria-subtab').forEach(tab => tab.style.display = 'none');
  document.querySelectorAll('#cafeteriaSubTabNav .subTabBtn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(subTabId).style.display = 'block';
  if (subTabId === 'cafeteriaMainSubTab') {
    document.getElementById('cafeteriaMainTabBtn').classList.add('active');
    if (window.cafeteria && window.cafeteria.isLunchTime()) {
      setTimeout(() => window.cafeteria.showDialogue(), 100);
    }
  } else if (subTabId === 'kitchenSubTab') {
    document.getElementById('kitchenTabBtn').classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const mainBtn = document.getElementById('cafeteriaMainTabBtn');
  const kitchenBtn = document.getElementById('kitchenTabBtn');
  const mainSubTab = document.getElementById('cafeteriaMainSubTab');
  const kitchenSubTab = document.getElementById('kitchenSubTab');
  if (mainBtn && kitchenBtn && mainSubTab && kitchenSubTab) {
    mainBtn.onclick = function() {
      mainBtn.classList.add('active');
      kitchenBtn.classList.remove('active');
      mainSubTab.style.display = 'block';
      kitchenSubTab.style.display = 'none';
    };
    kitchenBtn.onclick = function() {
      kitchenBtn.classList.add('active');
      mainBtn.classList.remove('active');
      mainSubTab.style.display = 'none';
      kitchenSubTab.style.display = 'block';
    };
  }

  function updateKitchenUnlock() {
    if (typeof state !== 'undefined' && state.grade >= 3) {
      kitchenBtn.style.display = 'inline-block';
    } else {
      kitchenBtn.style.display = 'none';
      mainBtn.classList.add('active');
      kitchenBtn.classList.remove('active');
      mainSubTab.style.display = 'block';
      kitchenSubTab.style.display = 'none';
    }
  }

  updateKitchenUnlock();
  const origGradeUp = window.gradeUp;
  window.gradeUp = function() {
    origGradeUp.apply(this, arguments);
    updateKitchenUnlock();
    
    // Check front desk unlock after grade up
    if (typeof window.frontDesk !== 'undefined' && window.frontDesk.checkUnlock) {
      window.frontDesk.checkUnlock();
    }
  };
  const origLoadGame = window.loadGame;
  window.loadGame = function() {
    origLoadGame.apply(this, arguments);
    updateKitchenUnlock();
    
    // Check front desk unlock after loading
    if (typeof window.frontDesk !== 'undefined' && window.frontDesk.checkUnlock) {
      window.frontDesk.checkUnlock();
    }
    if (typeof window.frontDesk !== 'undefined' && window.frontDesk.loadState) {
      window.frontDesk.loadState();
    }
  };
  document.querySelectorAll('#bottomNav .navBtn[data-target]').forEach(btn => {
    btn.addEventListener('click', function() {
    });
  });
  const mainHallNavBtn = document.getElementById('mainHallNavBtn');
  const kitchenNavBtn = document.getElementById('kitchenNavBtn');
  if (mainHallNavBtn && kitchenNavBtn) {
    mainHallNavBtn.onclick = function() {
      switchCafeteriaSubTab('cafeteriaMainSubTab');
      mainHallNavBtn.classList.add('active');
      kitchenNavBtn.classList.remove('active');
    };
    kitchenNavBtn.onclick = function() {
      switchCafeteriaSubTab('kitchenSubTab');
      mainHallNavBtn.classList.remove('active');
      kitchenNavBtn.classList.add('active');
    };
  }
  const expansionIcon = document.getElementById('graduationSwariaImage');
  if (expansionIcon) {
    expansionIcon.addEventListener('click', function() {
      if (typeof window.trackExpansionIconClick === 'function') {
        window.trackExpansionIconClick();
      }
    });
  }
});
