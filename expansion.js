// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file















































window.updateElementGrid = window.updateElementGrid || function () {};
if (!state.grade) state.grade = 1;
if (typeof state.viAutoLightQuestStarted === 'undefined') state.viAutoLightQuestStarted = false;
if (typeof state.viAutoLightQuestProgress === 'undefined') state.viAutoLightQuestProgress = 0;
if (typeof state.viAutoLightUnlocked === 'undefined') state.viAutoLightUnlocked = false;
if (typeof state.viAutoRedLightQuestStarted === 'undefined') state.viAutoRedLightQuestStarted = false;
if (typeof state.viAutoRedLightQuestProgress === 'undefined') state.viAutoRedLightQuestProgress = 0;
if (typeof state.viAutoRedLightUnlocked === 'undefined') state.viAutoRedLightUnlocked = false;

function calculatePowerGeneratorCap() {
  let baseCap = 100;
  if (state.grade >= 2) {
    baseCap += (state.grade - 1) * 20;
  }
  return baseCap;
}

function activateViAutoLightQuest() {
  if (!state) return;
  if (state.grade >= 5) {
    if (!state.quests) state.quests = {};
    if (typeof state.quests.viAutoLightGenerator === 'undefined' || state.quests.viAutoLightGenerator === 'not_started') {
      state.quests.viAutoLightGenerator = 'started';
      state.quests.viAutoLightGeneratorProgress = 0;
      if (typeof window.showViResponse === 'function') {
        setTimeout(() => {
          window.showViResponse("Peachy, your work is impressive. If you bring me 15 Prisma Shards, I can build you an automatic light collector.");
        }, 3000);
      }
    }
  }
}

function activateViAutoRedLightQuest() {
  if (!state) return;
  if (state.grade >= 7) {
    if (!state.quests) state.quests = {};
    if (typeof state.quests.viAutoRedLightGenerator === 'undefined' || state.quests.viAutoRedLightGenerator === 'not_started') {
      if (state.quests.viAutoLightGenerator === 'completed') {
        state.quests.viAutoRedLightGenerator = 'started';
        state.quests.viAutoRedLightGeneratorProgress = 0;
        state.quests.viAutoRedLightGeneratorChargedProgress = 0;
        if (typeof window.showViResponse === 'function') {
          setTimeout(() => {
            window.showViResponse("Impressive work with the light collector! I have another project. Bring me 1 Charged Prisma Token and 40 Prisma Shards, and I'll build you an automatic red light collector.");
          }, 3000);
        }
      }
    }
  }
}

function updateGradeUI() {
  activateViAutoLightQuest(); 
  activateViAutoRedLightQuest(); 
  const gradeDisplay = document.getElementById("currentGrade");
  const gradeUpBtn = document.getElementById("gradeUpBtn");
  const reqDisplay = document.getElementById("prestigeRequirement");
  if (gradeDisplay) gradeDisplay.textContent = state.grade;
  const nextCost = getGradeKPCost(state.grade + 1);
  if (swariaKnowledge.kp >= nextCost) {
    gradeUpBtn.disabled = false;
    gradeUpBtn.classList.add("glow");
  } else {
    gradeUpBtn.disabled = true;
    gradeUpBtn.classList.remove("glow");
  }
  if (reqDisplay) {
    reqDisplay.textContent = `Reach ${formatNumber(nextCost)} KP to unlock expansion ${state.grade + 1}.`;
  }
}

function getGradeKPCost(grade) {
  if (grade === 2) return 2e4; 
  if (grade >= 3 && grade <= 6) return Math.pow(10, 10 * (grade - 2)); 
  if (grade > 6) {
    let base = Math.pow(10, 40); 
    return base * Math.pow(1e20, grade - 6);
  }
}

const gradePrestigeMilestones = [
  { grade: 2, reward: 'Double Fluff gain for every new expansion starting at second expansion, Add 20 more power generator cap every new expansion, unlock the lab' },
    { grade: 3, reward: 'Double light gain and swaria coins gain for every new expansion starting at third expansion' },
    { grade: 4, reward: 'Double Feathers gain for every new expansion starting at fourth expansion, Unlock red light' },
    { grade: 5, reward: 'Double red light gain and Wing artifact gain for every new expansion starting at fourth expansion, unlock the charger' },
    { grade: 6, reward: 'Unlock orange light and unlock the second floor' },
    { grade: 7, reward: 'Double orange light gain and expand the control center' },
    { grade: 8, reward: 'Unlock yellow light and expand the prism lab' },
    { grade: 10, reward: 'Unlock the challenge tab' },
    { grade: 28, reward: 'Unlock ???' },
];

function updateMilestoneTable() {
  const milestoneBody = document.getElementById('milestoneBody');
  if (!milestoneBody) return;
  const milestones = [
    { grade: 2, reward: 'Double Fluff gain for every new expansion starting at second expansion, Add 20 more power generator cap every new expansion, unlock the lab' },
    { grade: 3, reward: 'Double light gain and swaria coins gain for every new expansion starting at third expansion, Unlock the kitchen.' },
    { grade: 4, reward: 'Double Feathers gain for every new expansion starting at fourth expansion, Unlock red light' },
    { grade: 5, reward: 'Double red light and Wing artifact for every new expansion starting at fifth expansion, unlock the charger' },
    { grade: 6, reward: 'Unlock orange light and unlock the second floor' },
    { grade: 7, reward: 'Double orange light gain and expand the control center' },
    { grade: 8, reward: 'Unlock yellow light and expand the prism lab (wip)' },
    { grade: 10, reward: 'Unlock the challenge tab (wip)' },
    { grade: 28, reward: 'Unlock ???' },
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

function resetTerrariumContent() {
  window.terrariumPollen = 0;
  window.terrariumFlowers = 0;
  window.terrariumXP = 0;
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
  const nextCost = getGradeKPCost(state.grade + 1);
  if (swariaKnowledge.kp < nextCost) return;
  const oldGrade = state.grade;
  const newGrade = (state.grade || 1) + 1;
  showGradeUpAnimation(oldGrade, newGrade);
  swariaKnowledge.kp = 1;
  state.grade = newGrade;
  if (typeof window.trackGradeMilestone === 'function') {
    window.trackGradeMilestone(newGrade);
  }
  activateViAutoLightQuest(); 
  activateViAutoRedLightQuest(); 
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
  resetTerrariumContent();
  resetChargerWhenAvailable();
  if (state.grade >= 5) {
    const chargerBtn = document.getElementById("chargerSubTabBtn");
    if (chargerBtn) {
      chargerBtn.style.display = "inline-block";
    }
  }
  const calculatedCap = calculatePowerGeneratorCap();
  if (state.powerEnergy > calculatedCap) {
    state.powerEnergy = calculatedCap;
  }
  if (typeof window.trackExpansionReset === 'function') {
    window.trackExpansionReset();
  }
  window.location.reload();
}

function updatePrismSubTabVisibility() {
  if (state.grade >= 2) {
    document.getElementById("prismSubTabBtn").style.display = "inline-block";
  }
}

window.gradeUp = gradeUp;

function getLightGain(baseLight) {
  let grade = state.grade || 1;
  if (grade >= 3) {
    return baseLight * Math.pow(2, grade - 2); 
  }
  return baseLight;
}

function getSwariaCoinGain(baseSwaria) {
  let grade = state.grade || 1;
  if (grade >= 3) {
    return baseSwaria * Math.pow(2, grade - 2); 
  }
  return baseSwaria;
}

function getFeatherGain(baseFeather) {
  let grade = state.grade || 1;
  if (grade >= 4) {
    return baseFeather * Math.pow(2, grade - 2); 
  }
  return baseFeather;
}

function getRedlightGain(baseRedlight) {
  let grade = state.grade || 1;
  if (grade >= 5) {
    return baseRedlight * Math.pow(2, grade - 4); 
  }
  return baseRedlight;
}

window.getRedlightGain = getRedlightGain;

function getOrangelightGain(baseOrangelight) {
  let grade = state.grade || 1;
  if (grade >= 7) {
    return baseOrangelight * Math.pow(2, grade - 6); 
  }
  return baseOrangelight;
}

window.getOrangelightGain = getOrangelightGain;

function getWingArtifactGainMultiplier() {
  let grade = state.grade || 1;
  if (grade >= 5) {
    return Math.pow(2, grade - 4); 
  }
  return 1;
}

function getAutoLightGainPerSecond() {
  if (!state.quests || state.quests.viAutoLightGenerator !== 'completed') {
    return 0;
  }
  let grade = state.grade || 1;
  if (grade >= 5) {
    let baseGain = 1;
    let particleBoost = 0;
    if (window.prismState) {
      const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
      particleTypes.forEach(particleType => {
        const count = Math.floor(window.prismState[particleType] || 0);
        particleBoost += count * 0.1;
      });
    }
    if (window.boughtElements && window.boughtElements[13]) {
      baseGain *= 5;
      particleBoost *= 5;
    }
    let totalClickGain = baseGain + particleBoost;
    if (grade >= 3) {
      totalClickGain = window.getLightGain(totalClickGain);
    }
    return totalClickGain * 0.1;
  }
  return 0;
}

function getAutoRedLightGainPerSecond() {
  if (!state.quests || state.quests.viAutoRedLightGenerator !== 'completed') {
    return 0;
  }
  let grade = state.grade || 1;
  if (grade >= 7) {
    let baseGain = 1;
    let particleBoost = 0;
    if (window.prismState) {
      const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
      particleTypes.forEach(particleType => {
        const count = Math.floor(window.prismState[particleType] || 0);
        particleBoost += count * 0.1;
      });
    }
    if (window.boughtElements && window.boughtElements[13]) {
      baseGain *= 5;
      particleBoost *= 5;
    }
    let totalClickGain = baseGain + particleBoost;
    if (grade >= 5 && typeof window.getRedlightGain === 'function') {
      totalClickGain = window.getRedlightGain(totalClickGain);
    }
    return totalClickGain * 0.1;
  }
  return 0;
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
    activateViAutoLightQuest(); 
    activateViAutoRedLightQuest(); 
  };
  const origLoadGame = window.loadGame;
  window.loadGame = function() {
    origLoadGame.apply(this, arguments);
    updateKitchenUnlock();
    activateViAutoLightQuest(); 
    activateViAutoRedLightQuest(); 
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
  activateViAutoLightQuest();
  activateViAutoRedLightQuest();
  const expansionIcon = document.getElementById('graduationSwariaImage');
  if (expansionIcon) {
    expansionIcon.addEventListener('click', function() {
      if (typeof window.trackExpansionIconClick === 'function') {
        window.trackExpansionIconClick();
      }
    });
  }
});
window.activateViAutoRedLightQuest = activateViAutoRedLightQuest;
window.getAutoRedLightGainPerSecond = getAutoRedLightGainPerSecond;
