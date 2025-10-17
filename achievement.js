// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file


















































const achievements = {
  firstOfManyFluffs: {
    id: 'firstOfManyFluffs',
    name: 'The first of many fluffs',
    description: 'Collect 100 fluff',
    icon: 'assets/icons/fluff.png',
    type: 'fluff',
    requirement: new Decimal(100),
    unlocked: false,
    progress: new Decimal(0),
    category: 'normal',
    row: 1,
    position: 1,
    rewarded: false
  },
  realGlobalRikkorCurrency: {
    id: 'realGlobalRikkorCurrency',
    name: 'Real global Rikkor currency',
    description: 'Collect 500 Swaria coins',
    icon: 'assets/icons/swaria coin.png',
    type: 'swaria',
    requirement: new Decimal(500),
    unlocked: false,
    progress: new Decimal(0),
    category: 'normal',
    row: 1,
    position: 2,
    rewarded: false
  },
  deliverToSwaElites: {
    id: 'deliverToSwaElites',
    name: 'Deliver to the Swa elites',
    description: 'Do your first delivery reset',
    icon: 'assets/icons/common box.png',
    type: 'delivery',
    requirement: new Decimal(1),
    unlocked: false,
    progress: new Decimal(0),
    category: 'normal',
    row: 1,
    position: 3,
    rewarded: false
  },
  fluffierThanFluff: {
    id: 'fluffierThanFluff',
    name: 'Lighter than fluff itself',
    description: 'Collect 2,500 feathers',
    icon: 'assets/icons/feather.png',
    type: 'feathers',
    requirement: new Decimal(2500),
    unlocked: false,
    progress: new Decimal(0),
    category: 'normal',
    row: 1,
    position: 4,
    rewarded: false
  },
  ancientDiscovery: {
    id: 'ancientDiscovery',
    name: 'Ancient discovery',
    description: 'Collect 10,000 wing artifacts',
    icon: 'assets/icons/wing artifact.png',
    type: 'artifacts',
    requirement: new Decimal(10000),
    unlocked: false,
    progress: new Decimal(0),
    category: 'normal',
    row: 1,
    position: 5,
    rewarded: false
  },
  swalements: {
    id: 'swalements',
    name: 'The start of the swalements',
    description: 'Discover 4 swalements',
    icon: 'assets/icons/swaria grade.png',
    type: 'elements',
    requirement: 4,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 2,
    position: 1,
    rewarded: false
  },
  Gettingsmarter: {
    id: 'Gettingsmarter',
    name: 'Getting smarter',
    description: 'Collect 1000 KP',
    icon: 'assets/icons/kp.png',
    type: 'kp',
    requirement: new Decimal(1000),
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 2,
    position: 2,
    rewarded: false
  },
  Soap: {
    id: 'Soap',
    name: 'Taking an unusual soapy turn',
    description: 'Meet Soap',
    icon: 'assets/icons/power generator.png',
    type: 'element7',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 2,
    position: 3,
    rewarded: false
  },
  BoxGenerators: {
    id: 'BoxGenerators',
    name: 'Automation?',
    description: 'Get 3 box generators working',
    icon: 'assets/icons/gen-rare.png',
    type: 'generators',
    requirement: 3,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 2,
    position: 4,
    rewarded: false
  },
  Expand: {
    id: 'Expand',
    name: 'Swa expansions confirmed',
    description: 'Do your first expansion reset',
    icon: 'assets/icons/expansion.png',
    type: 'grade',
    requirement: 2,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 2,
    position: 5,
    rewarded: false
  },
  LightItUp: {
    id: 'LightItUp',
    name: 'Light it up',
    description: 'Start generating light particles',
    icon: 'assets/icons/light.png',
    type: 'lightparticle',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 3,
    position: 1,
    rewarded: false
  },
  Millionaire: {
    id: 'Millionaire',
    name: 'Millionaire',
    description: 'Collect 1e6 KP',
    icon: 'assets/icons/kp.png',
    type: 'kp',
    requirement: new Decimal("1000000"),
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 3,
    position: 2,
    rewarded: false
  },
  FiveStarMichelinMeal: {
    id: 'FiveStarMichelinMeal',
    name: 'Five Star Michelin Meal',
    description: 'Cook your first Dish',
    icon: 'assets/icons/berry plate token.png',
    type: 'food',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 3,
    position: 3,
    rewarded: false
  },
  Mythicalautomation: {
    id: 'Mythicalautomation',
    name: 'Mythical automation!',
    description: 'Own all 5 box generators',
    icon: 'assets/icons/gen-mythic.png',
    type: 'generators',
    requirement: 5,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 3,
    position: 4,
    rewarded: false
  },
  RedLightParticles: {
    id: 'RedLightParticles',
    name: 'Seeing red',
    description: 'Start producing red light particles',
    icon: 'assets/icons/red light.png',
    type: 'redlightparticles',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 3,
    position: 5,
    rewarded: false
  },
  SmartestBirdInTheWorld: {
    id: 'SmartestBirdInTheWorld',
    name: 'Smartest bird in the world',
    description: 'Discover 15 swalements',
    icon: 'assets/icons/swaria grade.png',
    type: 'elements',
    requirement: 15,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 4,
    position: 1,
    rewarded: false
  },
  ChargingUp: {
    id: 'ChargingUp',
    name: 'Charging up',
    description: 'Collect 20,000 charge',
    icon: 'assets/icons/charge.png',
    type: 'charge',
    requirement: new Decimal(20000),
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 4,
    position: 3,
    rewarded: false
  },
  FluffiestBirdInTheWorld: {
    id: 'FluffiestBirdInTheWorld',
    name: 'Fluffiest bird in the world',
    description: 'Collect 1e100 fluffs',
    icon: 'assets/icons/fluff.png',
    type: 'fluff',
    requirement: 1e100,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 4,
    position: 4,
    rewarded: false
  },
  FlowerModeUnlocked: {
    id: 'FlowerModeUnlocked',
    name: 'Litteraly bss and gci combined',
    description: 'Collect 1e6 flowers',
    icon: 'assets/icons/flower.png',
    type: 'flower',
    requirement: 1e6,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 4,
    position: 5,
    rewarded: false
  },
  OrangeLight: {
    id: 'OrangeLight',
    name: 'Seeing orange',
    description: 'Collect 1e10 Orange light',
    icon: 'assets/icons/orange light.png',
    type: 'orangelight',
    requirement: 1e10,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 5,
    position: 1,
    rewarded: false
  },
  NectarCollector: {
    id: 'NectarCollector',
    name: 'Cover yourself in nectar',
    description: 'Collect 100 nectar',
    icon: 'assets/icons/nectar.png',
    type: 'nectar',
    requirement: 100,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 5,
    position: 2,
    rewarded: false
  },
  No7thExpansion: {
    id: 'No7thExpansion',
    name: 'Expansion 7 here I come!!!',
    description: 'Collect 1e50 KP',
    icon: 'assets/icons/kp.png',
    type: 'kp',
    requirement: 1e50,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 5,
    position: 3,
    rewarded: false
  },
  ElectrifyingProgress: {
    id: 'ElectrifyingProgress',
    name: 'Electrifying progress',
    description: 'Collect 1e30 charge',
    icon: 'assets/icons/charge.png',
    type: 'charge',
    requirement: 1e30,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 5,
    position: 4,
    rewarded: false
  },
  InfiniteFluff: {
    id: 'InfiniteFluff',
    name: 'Infinite fluff!',
    description: 'Reach infinite fluff!',
    icon: 'assets/icons/fluff.png',
    type: 'infinity',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 5,
    position: 5,
    rewarded: false
  },
};

// Initialize state achievements if they don't exist
if (!window.state) window.state = {};
if (!window.state.achievements) window.state.achievements = {};
if (!window.state.achievementStats) window.state.achievementStats = {};

// Merge default achievements with state achievements
Object.keys(achievements).forEach(key => {
  if (!window.state.achievements[key]) {
    window.state.achievements[key] = {...achievements[key]};
  }
});

// Make achievements globally accessible (reference centralized state)
window.achievements = window.state.achievements;

// Initialize default achievement stats if not in state
const defaultAchievementStats = {
  totalClicks: 0,
  totalPlayTime: 0,
  totalUpgrades: 0,
  lastSaveTime: Date.now()
};

Object.keys(defaultAchievementStats).forEach(key => {
  if (window.state.achievementStats[key] === undefined) {
    window.state.achievementStats[key] = defaultAchievementStats[key];
  }
});

let achievementPopupQueue = [];
let isShowingPopup = false;

// Make achievement variables globally accessible
window.achievementStats = window.state.achievementStats;
window.achievementPopupQueue = achievementPopupQueue;
window.isShowingPopup = isShowingPopup;

// Initialize all achievements with proper Decimal values
function initializeAchievementDecimals() {
  Object.values(window.state.achievements).forEach(achievement => {
    if (typeof achievement.requirement === 'number') {
      achievement.requirement = new Decimal(achievement.requirement);
    }
    if (typeof achievement.progress === 'number') {
      achievement.progress = new Decimal(achievement.progress);
    }
    if (!achievement.progress) {
      achievement.progress = new Decimal(0);
    }
  });
}

function initAchievements() {
  initializeAchievementDecimals();
  loadAchievements();
  updateAchievementsDisplay(true);
  startAchievementTracking();
  setTimeout(() => {
    if (typeof checkRedLightAchievement === 'function') {
      checkRedLightAchievement();
    }
  }, 1000);
}

function loadAchievements() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  const saveKey = currentSaveSlot ? `fluffIncAchievementsSlot${currentSaveSlot}` : 'fluffIncAchievements';
  const saved = localStorage.getItem(saveKey);
  if (saved) {
    const savedData = JSON.parse(saved);
    Object.keys(savedData.achievements).forEach(id => {
      if (achievements[id]) {
        achievements[id].unlocked = savedData.achievements[id].unlocked;
        achievements[id].progress = new Decimal(savedData.achievements[id].progress || 0);
        achievements[id].rewarded = savedData.achievements[id].rewarded || false;
      }
    });
    achievementStats = savedData.stats || achievementStats;
  } else {
    Object.values(achievements).forEach(achievement => {
      achievement.unlocked = false;
      achievement.progress = new Decimal(0);
      achievement.rewarded = false;
    });
    achievementStats = {
      totalClicks: 0,
      totalPlayTime: 0,
      totalUpgrades: 0,
      lastSaveTime: Date.now()
    };
  }
}

function saveAchievements() {
  const saveData = {
    achievements: {},
    stats: achievementStats
  };
  Object.keys(achievements).forEach(id => {
    saveData.achievements[id] = {
      unlocked: achievements[id].unlocked,
      progress: (achievements[id].progress || new Decimal(0)).toString(),
      rewarded: achievements[id].rewarded
    };
  });
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  const saveKey = currentSaveSlot ? `fluffIncAchievementsSlot${currentSaveSlot}` : 'fluffIncAchievements';
  localStorage.setItem(saveKey, JSON.stringify(saveData));
  // Secret achievements save removed - now managed by main save system
}

function updateAchievementProgress(type, value) {
  Object.values(achievements).forEach(achievement => {
    if (achievement.type === type && !achievement.unlocked) {
      achievement.progress = Decimal.max(achievement.progress || new Decimal(0), new Decimal(value));
      if (achievement.progress.gte(achievement.requirement || new Decimal(0))) {
        unlockAchievement(achievement.id);
      }
    }
  });
}

function unlockAchievement(achievementId) {
  const achievement = achievements[achievementId];
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.progress = achievement.requirement || new Decimal(0);
    showAchievementNotification(achievement);
    saveAchievements();
    updateAchievementsDisplay();
  }
}

function claimAchievementReward(achievementId) {
  let achievement = achievements[achievementId];
  if (!achievement && typeof window.secretAchievements !== 'undefined') {
    achievement = window.secretAchievements[achievementId];
  }
  if (achievement && achievement.unlocked && !achievement.rewarded) {
    let rewardAmount;
    if (achievement.category === 'secret') {
      if (achievementId === 'secret1') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret2') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret3') {
        rewardAmount = 25; 
      } else if (achievementId === 'secret4') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret5') {
        rewardAmount = 50; 
      } else if (achievementId === 'secret6') {
        rewardAmount = 30; 
      } else if (achievementId === 'secret7') {
        rewardAmount = 25; 
      } else if (achievementId === 'secret8') {
        rewardAmount = 30; 
      } else if (achievementId === 'secret9') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret10') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret11') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret12') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret13') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret14') {
        rewardAmount = 20; 
      } else if (achievementId === 'secret15') {
        rewardAmount = 10000; 
      } else if (achievementId === 'secret16') {
        rewardAmount = 1100; 
      } else if (achievementId === 'secret17') {
        rewardAmount = 50; // 50 Swa Bucks for the ultra-rare achievement
      } else if (achievementId === 'secret18') {
        rewardAmount = 20; // 20 Swa Bucks for touching Lepre's chest zipper
      } else {
        const isLastInRow = achievement.position === 5;
        rewardAmount = isLastInRow ? 25 : 15;
      }
    } else {
      const isLastInRow = achievement.position === 5;
      if (achievement.row === 2) {
        rewardAmount = isLastInRow ? 30 : 15;
      } else if (achievement.row === 3) {
        rewardAmount = isLastInRow ? 35 : 20;
      } else if (achievement.row === 4) {
        rewardAmount = isLastInRow ? 40 : 25;
      } else if (achievement.row === 5) {
        rewardAmount = isLastInRow ? 45 : 30;
      } else {
        rewardAmount = isLastInRow ? 25 : 10;
      }
    }
    if (typeof window.addSwaBucks === 'function') {
      window.addSwaBucks(rewardAmount);
    } else {
      if (!window.state) window.state = {};
      if (!window.state.swabucks) window.state.swabucks = new Decimal(0);
      window.state.swabucks = new Decimal(window.state.swabucks).add(rewardAmount);
      const swabucksElement = document.getElementById('inventoryCount-swabucks');
      if (swabucksElement) {
        swabucksElement.textContent = DecimalUtils.formatDecimal(window.state.swabucks);
      }
      if (typeof window.saveGame === 'function') {
        window.saveGame();
      }
      if (typeof window.updateUI === 'function') {
        window.updateUI();
      }
    }
    achievement.rewarded = true;
    showRewardNotification(achievement, rewardAmount);
    saveAchievements();
    updateAchievementsDisplay();
  }
}

function showGenericRewardNotification(tokenType, amount, title = "Reward Earned!", subtitle = null) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #44ff44, #22cc22);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 300px;
    animation: slideInRight 0.5s ease-out;
  `;
  
  // Get appropriate icon and display name for token type
  let iconSrc = 'assets/icons/fluff.png';
  let displayName = tokenType;
  
  switch(tokenType) {
    case 'swabucks':
      iconSrc = 'assets/icons/Swa Buck.png';
      displayName = 'Swa Bucks';
      break;
    case 'berry':
      iconSrc = 'assets/icons/berry token.png';
      displayName = 'Berry';
      break;
    case 'mushroom':
      iconSrc = 'assets/icons/mushroom token.png';
      displayName = 'Mushroom';
      break;
    case 'spark':
      iconSrc = 'assets/icons/spark token.png';
      displayName = 'Spark';
      break;
    case 'prismashard':
      iconSrc = 'assets/icons/prisma shard token.png';
      displayName = 'Prisma Shard';
      break;
    case 'water':
      iconSrc = 'assets/icons/water token.png';
      displayName = 'Water';
      break;
    case 'petal':
      iconSrc = 'assets/icons/glittering petal token.png';
      displayName = 'Petal';
      break;
    default:
      displayName = tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
  }
  
  const subtitleText = subtitle || `+${amount} ${displayName}`;
  
  notification.innerHTML = `
    <img src="${iconSrc}" alt="${displayName}" style="width: 32px; height: 32px;">
    <div>
      <div style="font-weight: bold; font-size: 1.1em;">${title}</div>
      <div style="font-size: 0.9em; opacity: 0.9;">${subtitleText}</div>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

function showRewardNotification(achievement, amount) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 300px;
    animation: slideInRight 0.5s ease-out;
  `;
  notification.innerHTML = `
    <img src="assets/icons/Swa Buck.png" alt="Swa Bucks" style="width: 32px; height: 32px;">
    <div>
      <div style="font-weight: bold; font-size: 1.1em;">Reward Claimed!</div>
      <div style="font-size: 0.9em; opacity: 0.9;">+${amount} Swa Bucks from ${achievement.name}</div>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

function showAchievementNotification(achievement) {
  achievementPopupQueue.push(achievement);
  if (!isShowingPopup) {
    showNextPopup();
  }
}

function showNextPopup() {
  if (achievementPopupQueue.length === 0) {
    isShowingPopup = false;
    return;
  }
  isShowingPopup = true;
  const achievement = achievementPopupQueue.shift();
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: -350px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 15px;
    width: 320px;
    max-width: 90vw;
    transform: translateX(0);
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `;
  const iconHtml = achievement.category === 'secret' ? '' : `
    <div class="achievement-popup-icon">
      <img src="${achievement.icon}" alt="${achievement.name}" style="width: 48px; height: 48px; border-radius: 8px;">
    </div>
  `;
  popup.innerHTML = `
    ${iconHtml}
    <div class="achievement-popup-content">
      <div class="achievement-popup-title">Achievement Unlocked!</div>
      <div class="achievement-popup-name">${achievement.name}</div>
      <div class="achievement-popup-description">${achievement.description}</div>
    </div>
    <div class="achievement-popup-close" onclick="this.parentElement.remove(); showNextPopup();" style="
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    ">×</div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.transform = 'translateX(-370px)';
  }, 100);
  setTimeout(() => {
    popup.style.transform = 'translateX(0)';
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
      showNextPopup();
    }, 500);
  }, 5000);
}

const ACHIEVEMENT_UI_THROTTLE = 250;
let lastAchievementUpdate = 0;
let achievementUpdatePending = false;

function updateAchievementsDisplay(force = false) {
  const now = Date.now();
  
  if (!force && (now - lastAchievementUpdate < ACHIEVEMENT_UI_THROTTLE)) {
    if (!achievementUpdatePending) {
      achievementUpdatePending = true;
      setTimeout(() => {
        achievementUpdatePending = false;
        updateAchievementsDisplayImmediate();
      }, ACHIEVEMENT_UI_THROTTLE - (now - lastAchievementUpdate));
    }
    return;
  }
  
  updateAchievementsDisplayImmediate();
}

function updateAchievementsDisplayImmediate() {
  lastAchievementUpdate = Date.now();
  updateNormalAchievements();
  updateSecretAchievements();
}

function updateNormalAchievements() {
  const grid = document.getElementById('normalAchievementsGrid');
  const unlockedCount = document.getElementById('normalUnlockedCount');
  const totalCount = document.getElementById('normalTotalCount');
  const progressPercent = document.getElementById('normalProgressPercent');
  if (!grid) return;
  const normalAchievements = Object.values(achievements).filter(a => a.category === 'normal');
  let unlocked = 0;
  let total = normalAchievements.length;
  grid.innerHTML = '';
  const achievementsByRow = {};
  normalAchievements.forEach(achievement => {
    if (!achievementsByRow[achievement.row]) {
      achievementsByRow[achievement.row] = [];
    }
    achievementsByRow[achievement.row].push(achievement);
  });
  const visibleRows = getVisibleRows(achievementsByRow);
  Object.keys(achievementsByRow).sort((a, b) => parseInt(a) - parseInt(b)).forEach(rowNum => {
    const rowAchievements = achievementsByRow[rowNum];
    const isVisible = visibleRows.includes(parseInt(rowNum));
    const rowContainer = document.createElement('div');
    rowContainer.className = `achievement-row ${isVisible ? 'visible' : 'hidden'}`;
    rowContainer.dataset.row = rowNum;
    rowAchievements.forEach(achievement => {
      if (achievement.unlocked) unlocked++;
      const card = createAchievementCard(achievement);
      rowContainer.appendChild(card);
    });
    grid.appendChild(rowContainer);
  });
  if (unlockedCount) unlockedCount.textContent = unlocked;
  if (totalCount) totalCount.textContent = total;
  if (progressPercent) {
    const percent = total > 0 ? new Decimal(unlocked).div(total).mul(100).mul(100).round().div(100).toNumber() : 0;
    progressPercent.textContent = percent;
  }
}

function getVisibleRows(achievementsByRow) {
  const visibleRows = [];
  const rowNumbers = Object.keys(achievementsByRow).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < rowNumbers.length; i++) {
    const rowNum = rowNumbers[i];
    const rowAchievements = achievementsByRow[rowNum];
    const unlockedInRow = rowAchievements.filter(a => a.unlocked).length;
    if (i === 0) {
      visibleRows.push(rowNum);
      continue;
    }
    const previousRow = rowNumbers[i - 1];
    const previousRowAchievements = achievementsByRow[previousRow];
    const unlockedInPreviousRow = previousRowAchievements.filter(a => a.unlocked).length;
    if (unlockedInPreviousRow >= 4) {
      visibleRows.push(rowNum);
    } else {
      break; 
    }
  }
  return visibleRows;
}

function updateSecretAchievements() {
  const grid = document.getElementById('secretAchievementsGrid');
  const unlockedCount = document.getElementById('secretUnlockedCount');
  const totalCount = document.getElementById('secretTotalCount');
  const progressPercent = document.getElementById('secretProgressPercent');
  if (!grid) return;
  // Use only window.secretAchievements since all secret achievements are now managed there
  const allSecretAchievements = typeof window.secretAchievements !== 'undefined' ? Object.values(window.secretAchievements) : [];
  let unlocked = 0;
  let total = allSecretAchievements.length;
  grid.innerHTML = '';
  const achievementsByRow = {};
  allSecretAchievements.forEach(achievement => {
    if (!achievementsByRow[achievement.row]) {
      achievementsByRow[achievement.row] = [];
    }
    achievementsByRow[achievement.row].push(achievement);
  });
  Object.keys(achievementsByRow).sort((a, b) => parseInt(a) - parseInt(b)).forEach(rowNum => {
    const rowAchievements = achievementsByRow[rowNum];
    const rowContainer = document.createElement('div');
    rowContainer.className = 'achievement-row visible';
    rowContainer.dataset.row = rowNum;
    rowAchievements.forEach(achievement => {
      if (achievement.unlocked) unlocked++;
      const card = createAchievementCard(achievement);
      rowContainer.appendChild(card);
    });
    grid.appendChild(rowContainer);
  });
  if (unlockedCount) unlockedCount.textContent = unlocked;
  if (totalCount) totalCount.textContent = total;
  if (progressPercent) {
    const percent = total > 0 ? new Decimal(unlocked).div(total).mul(100).mul(100).round().div(100).toNumber() : 0;
    progressPercent.textContent = percent;
  }
}

function createAchievementCard(achievement) {
  const card = document.createElement('div');
  card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
  
  if (card.dataset.achievementListenerAdded) {
    return card;
  }
  
  const progressPercent = Decimal.min(
    new Decimal(achievement.progress || 0).div(achievement.requirement || 1).mul(100), 
    100
  ).toNumber();
  const isLastInRow = achievement.position === 5;
  let rewardAmount;
  if (achievement.category === 'secret') {
      if (achievement.id === 'secret1') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret2') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret3') {
        rewardAmount = 25; 
      } else if (achievement.id === 'secret4') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret5') {
        rewardAmount = 50; 
      } else if (achievement.id === 'secret6') {
        rewardAmount = 30; 
      } else if (achievement.id === 'secret7') {
        rewardAmount = 25; 
      } else if (achievement.id === 'secret8') {
        rewardAmount = 30; 
      } else if (achievement.id === 'secret9') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret10') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret11') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret12') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret13') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret14') {
        rewardAmount = 20; 
      } else if (achievement.id === 'secret15') {
        rewardAmount = 10000; 
      } else {
        rewardAmount = isLastInRow ? 25 : 15;
      }
    } else {
    if (achievement.row === 2) {
      rewardAmount = isLastInRow ? 30 : 15;
    } else if (achievement.row === 3) {
      rewardAmount = isLastInRow ? 35 : 20;
    } else if (achievement.row === 4) {
      rewardAmount = isLastInRow ? 40 : 25;
    } else if (achievement.row === 5) {
      rewardAmount = isLastInRow ? 45 : 30;
    } else {
      rewardAmount = isLastInRow ? 25 : 10;
    }
  }
  if (achievement.unlocked && !achievement.rewarded) {
    card.className = `achievement-card unlocked claimable`;
    if (!card.dataset.achievementListenerAdded) {
      card.onclick = () => claimAchievementReward(achievement.id);
      card.dataset.achievementListenerAdded = 'true';
    }
    const iconHtml = achievement.category === 'secret' ? '' : `<img src="${achievement.icon}" alt="${achievement.name}" class="achievement-icon">`;
    card.innerHTML = `
      ${iconHtml}
      <div class="achievement-title">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
      <div class="achievement-reward">
        <img src="assets/icons/Swa Buck.png" alt="Swa Bucks" class="reward-icon">
        <span class="reward-text">Click to claim ${rewardAmount} Swa Bucks!</span>
      </div>
    `;
    }
  else if (achievement.unlocked && achievement.rewarded) {
    card.className = `achievement-card unlocked claimed`;
    const iconHtml = achievement.category === 'secret' ? '' : `<img src="${achievement.icon}" alt="${achievement.name}" class="achievement-icon">`;
    card.innerHTML = `
      ${iconHtml}
      <div class="achievement-title">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
      <div class="achievement-reward">
        <img src="assets/icons/Swa Buck.png" alt="Swa Bucks" class="reward-icon">
        <span class="reward-text">Claimed ${rewardAmount} Swa Bucks</span>
      </div>
    `;
    }
   else {
    const iconHtml = achievement.category === 'secret' ? '' : `<img src="${achievement.icon}" alt="${achievement.name}" class="achievement-icon">`;
    card.innerHTML = `
      ${iconHtml}
      <div class="achievement-title">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
    `;
    if (achievement.category === 'secret' && typeof window.handleSecretAchievementClick === 'function') {
      card.style.cursor = 'pointer';
      if (!card.dataset.achievementListenerAdded) {
        card.onclick = () => window.handleSecretAchievementClick(achievement.id);
        card.dataset.achievementListenerAdded = 'true';
      }
    }
  }
  return card;
}

function switchAchievementsSubTab(tabId) {
  document.getElementById('achievementsNormalTab').style.display = 'none';
  document.getElementById('achievementsSecretTab').style.display = 'none';
  document.getElementById('achievementsTrophyTab').style.display = 'none';
  document.getElementById('achievementsNormalTabBtn').classList.remove('active');
  document.getElementById('achievementsSecretTabBtn').classList.remove('active');
  document.getElementById('achievementsTrophyTabBtn').classList.remove('active');
  
  if (tabId === 'achievementsNormalTab') {
    document.getElementById('achievementsNormalTab').style.display = 'block';
    document.getElementById('achievementsNormalTabBtn').classList.add('active');
  } else if (tabId === 'achievementsSecretTab') {
    document.getElementById('achievementsSecretTab').style.display = 'block';
    document.getElementById('achievementsSecretTabBtn').classList.add('active');
  } else if (tabId === 'achievementsTrophyTab') {
    document.getElementById('achievementsTrophyTab').style.display = 'block';
    document.getElementById('achievementsTrophyTabBtn').classList.add('active');
    // Render trophies when tab is opened
    if (typeof window.renderTrophies === 'function') {
      window.renderTrophies();
    }
  }
}

let achievementTrackingInterval = null;

function startAchievementTracking() {
  if (achievementTrackingInterval) {
    clearInterval(achievementTrackingInterval);
  }
  
  achievementTrackingInterval = setInterval(() => {
    const now = Date.now();
    const delta = (now - achievementStats.lastSaveTime) / 1000;
    achievementStats.totalPlayTime += delta;
    achievementStats.lastSaveTime = now;
    updateAchievementProgress('time', achievementStats.totalPlayTime);
    saveAchievements();
  }, 1000);
}

function trackClick() {
  achievementStats.totalClicks++;
  updateAchievementProgress('clicks', achievementStats.totalClicks);
}

function trackResourceCollection(resourceType, amount) {
  if (resourceType === 'berries') {
    updateAchievementProgress('resource', amount);
  }
  if (resourceType === 'stardust') {
    updateAchievementProgress('resource', amount);
  }
  if (resourceType === 'swabucks') {
    updateAchievementProgress('special', amount);
  }
  if (resourceType === 'fluff') {
    updateAchievementProgress('fluff', amount);
  }
  if (resourceType === 'kp') {
    updateAchievementProgress('kp', amount);
  }
}

function trackUpgrade() {
  achievementStats.totalUpgrades++;
  updateAchievementProgress('upgrades', achievementStats.totalUpgrades);
}

function trackMilestones(totalResources) {
  updateAchievementProgress('milestone', totalResources);
}

function trackFluffMilestone(currentFluff) {
  updateAchievementProgress('fluff', currentFluff);
}

function trackDeliveryReset() {
  updateAchievementProgress('delivery', 1);
}

function trackSwariaMilestone(currentSwaria) {
  updateAchievementProgress('swaria', currentSwaria);
}

function trackFeatherMilestone(currentFeathers) {
  updateAchievementProgress('feathers', currentFeathers);
}

function trackArtifactMilestone(currentArtifacts) {
  updateAchievementProgress('artifacts', currentArtifacts);
}

function trackKPMilestone(currentKP) {
  updateAchievementProgress('kp', currentKP);
}

function trackGradeMilestone(currentGrade) {
  updateAchievementProgress('grade', currentGrade);
}

function trackElementDiscovery(boughtElements) {
  try {
    // Safety check for undefined or null boughtElements
    if (!boughtElements || typeof boughtElements !== 'object') {

      return;
    }
    
    const discoveredCount = Object.keys(boughtElements).filter(key => boughtElements[key]).length;
    updateAchievementProgress('elements', discoveredCount);
    if (boughtElements[7]) {
      updateAchievementProgress('element7', 1);
    }
  } catch (error) {


  }
}

function trackGeneratorUnlocks() {
  if (typeof window.generators !== 'undefined') {
    const unlockedCount = window.generators.filter(gen => gen.unlocked).length;
    updateAchievementProgress('generators', unlockedCount);
  }
}

function trackLightParticleGeneration() {
  if (typeof window.prismState !== 'undefined' && window.prismState.lightparticle) {
    updateAchievementProgress('lightparticle', window.prismState.lightparticle);
  }
}

function trackFoodAchievement() {
  updateAchievementProgress('food', 1);
}

function trackRedLightParticleGeneration() {
  if (typeof window.prismState !== 'undefined' && window.prismState.redlightparticle) {
    updateAchievementProgress('redlightparticles', window.prismState.redlightparticle);
  }
}

function forceUnlockRedLightAchievement() {
  if (achievements.RedLightParticles && !achievements.RedLightParticles.unlocked) {
    achievements.RedLightParticles.progress = new Decimal(1);
    unlockAchievement('RedLight');
  } else {
  }
}

function checkRedLightAchievement() {
  if (window.prismState && window.prismState.generatorUnlocked && window.prismState.generatorUnlocked.redlight) {
    if (achievements.RedLightParticles && !achievements.RedLightParticles.unlocked) {
      updateAchievementProgress('redlight', 1);
    } else {
    }
  } else {
  }
}

function trackChargeMilestone(currentCharge) {
  updateAchievementProgress('charge', currentCharge);
}

function trackFlowerMilestone(currentFlowers) {
  updateAchievementProgress('flower', currentFlowers);
}

function trackNectarMilestone(currentNectar) {
  updateAchievementProgress('nectar', currentNectar);
}

function trackOrangeLightMilestone(currentOrangeLight) {
  updateAchievementProgress('orangelight', currentOrangeLight);
}

function trackInfinityMilestone(infinityCount) {
  updateAchievementProgress('infinity', infinityCount);
}

function resetAchievements() {
  Object.values(achievements).forEach(achievement => {
    achievement.unlocked = false;
    achievement.progress = new Decimal(0);
    achievement.rewarded = false;
  });
  achievementStats = {
    totalClicks: 0,
    totalPlayTime: 0,
    totalUpgrades: 0,
    lastSaveTime: Date.now()
  };
  saveAchievements();
  updateAchievementsDisplay();
}

function resetAchievementsForNewSlot(slotNumber) {
  const freshAchievements = {};
  Object.keys(achievements).forEach(id => {
    freshAchievements[id] = {
      unlocked: false,
      progress: 0,
      rewarded: false
    };
  });
  const freshStats = {
    totalClicks: 0,
    totalPlayTime: 0,
    totalUpgrades: 0,
    lastSaveTime: Date.now()
  };
  const saveData = {
    achievements: freshAchievements,
    stats: freshStats
  };
  localStorage.setItem(`fluffIncAchievementsSlot${slotNumber}`, JSON.stringify(saveData));
  if (typeof window.resetSecretAchievementsForNewSlot === 'function') {
    window.resetSecretAchievementsForNewSlot(slotNumber);
  }
}

function reloadAchievementsForSlot() {
  loadAchievements();
  if (typeof window.loadSecretAchievements === 'function') {
    window.loadSecretAchievements();
  }
  updateAchievementsDisplay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAchievements);
} else {
  initAchievements();
}
setTimeout(() => {
  if (typeof window.reloadAchievementsForSlot === 'function') {
    window.reloadAchievementsForSlot();
  }
}, 100);
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .trophy-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    z-index: 10000;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    border: 3px solid #f39c12;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 400px;
    width: 90%;
  }

  .trophy-notification.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .trophy-notification-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .trophy-notification-icon {
    flex-shrink: 0;
  }

  .trophy-notification-icon .trophy-3d {
    width: 60px;
    height: 60px;
    animation: trophyShine 2s ease-in-out infinite;
  }

  .trophy-notification-text {
    color: white;
    text-align: left;
  }

  .trophy-notification-text h3 {
    margin: 0 0 10px 0;
    color: #f39c12;
    font-size: 1.4em;
    font-weight: bold;
  }

  .trophy-notification-text h4 {
    margin: 0 0 8px 0;
    color: #ecf0f1;
    font-size: 1.1em;
  }

  .trophy-notification-text p {
    margin: 0;
    color: #bdc3c7;
    font-size: 0.9em;
    line-height: 1.4;
  }
`;
document.head.appendChild(style);
window.trackClick = trackClick;
window.trackResourceCollection = trackResourceCollection;
window.trackUpgrade = trackUpgrade;
window.trackMilestones = trackMilestones;
window.trackFluffMilestone = trackFluffMilestone;
window.trackDeliveryReset = trackDeliveryReset;
window.trackSwariaMilestone = trackSwariaMilestone;
window.trackFeatherMilestone = trackFeatherMilestone;
window.trackArtifactMilestone = trackArtifactMilestone;
window.trackKPMilestone = trackKPMilestone;
window.trackGradeMilestone = trackGradeMilestone;
window.trackElementDiscovery = trackElementDiscovery;
window.trackGeneratorUnlocks = trackGeneratorUnlocks;
window.trackLightParticleGeneration = trackLightParticleGeneration;
window.trackRedLightParticleGeneration = trackRedLightParticleGeneration;
window.trackChargeMilestone = trackChargeMilestone;
window.trackFlowerMilestone = trackFlowerMilestone;
window.trackNectarMilestone = trackNectarMilestone;
window.trackOrangeLightMilestone = trackOrangeLightMilestone;
window.trackInfinityMilestone = trackInfinityMilestone;
window.trackFoodAchievement = trackFoodAchievement;
window.forceUnlockRedLightAchievement = forceUnlockRedLightAchievement;
window.checkRedLightAchievement = checkRedLightAchievement;
window.saveAchievements = saveAchievements;
window.loadAchievements = loadAchievements;
window.resetAchievements = resetAchievements;
window.resetAchievementsForNewSlot = resetAchievementsForNewSlot;
window.reloadAchievementsForSlot = reloadAchievementsForSlot;
function stopAchievementTracking() {
  if (achievementTrackingInterval) {
    clearInterval(achievementTrackingInterval);
    achievementTrackingInterval = null;
  }
}

// Trophy System - For Minigame Challenges
const trophies = {
  powerGeneratorChallenge: {
    id: 'powerGeneratorChallenge',
    name: 'Power Generator Challenge',
    description: 'Survive the Power Generator Challenge',
    icon: 'assets/icons/bronze power challenge.png',
    type: 'challenge',
    category: 'trophy',
    tiers: {
      bronze: {
        requirement: 60,
        unlocked: false,
        name: 'Bronze Power Survivor',
        description: 'Survive the Power Generator Challenge for 60+ seconds',
        icon: 'assets/icons/bronze power challenge.png'
      },
      silver: {
        requirement: 80,
        unlocked: false,
        name: 'Silver Power Survivor', 
        description: 'Survive the Power Generator Challenge for 80+ seconds',
        icon: 'assets/icons/silver power challenge.png'
      },
      gold: {
        requirement: 100,
        unlocked: false,
        name: 'Gold Power Survivor',
        description: 'Survive the Power Generator Challenge for 100+ seconds',
        icon: 'assets/icons/gold power challenge.png'
      }
    },
    slot: '1-1',
    unlockedTier: null
  }
};

function renderTrophies() {
  const trophyGrid = document.getElementById('trophyAchievementsGrid');
  if (!trophyGrid) return;
  
  trophyGrid.innerHTML = '';
  
  // Create two 3D wood plank trophy shelves
  const shelf1 = document.createElement('div');
  shelf1.className = 'trophy-shelf';
  shelf1.innerHTML = `
    <div class="shelf-background">
      <div class="shelf-slots">
        <div class="trophy-slot empty" data-slot="1-1"></div>
        <div class="trophy-slot empty" data-slot="1-2"></div>
        <div class="trophy-slot empty" data-slot="1-3"></div>
        <div class="trophy-slot empty" data-slot="1-4"></div>
        <div class="trophy-slot empty" data-slot="1-5"></div>
      </div>
      <div class="shelf-surface"></div>
    </div>
  `;
  
  const shelf2 = document.createElement('div');
  shelf2.className = 'trophy-shelf';
  shelf2.innerHTML = `
    <div class="shelf-background">
      <div class="shelf-slots">
        <div class="trophy-slot empty" data-slot="2-1"></div>
        <div class="trophy-slot empty" data-slot="2-2"></div>
        <div class="trophy-slot empty" data-slot="2-3"></div>
        <div class="trophy-slot empty" data-slot="2-4"></div>
        <div class="trophy-slot empty" data-slot="2-5"></div>
      </div>
      <div class="shelf-surface"></div>
    </div>
  `;
  
  trophyGrid.appendChild(shelf1);
  trophyGrid.appendChild(shelf2);
  
  // Load existing trophies from state with a delay to ensure DOM is ready
  setTimeout(() => {
    if (window.state && window.state.trophies) {
      Object.keys(window.state.trophies).forEach(trophyId => {
        const trophyState = window.state.trophies[trophyId];
        const trophy = trophies[trophyId];
        if (trophy && trophyState.unlockedTier) {
          addTrophyToSlot(trophy.slot, trophyState.unlockedTier, trophyId);
        }
      });
    }
  }, 100);
  
  // Update trophy progress display
  updateTrophyProgressDisplay();
  
  // Add observer to ensure trophies stay visible
  observeTrophyVisibility();
}

function updateTrophyProgressDisplay() {
  const unlockedCountEl = document.getElementById('trophyUnlockedCount');
  const totalCountEl = document.getElementById('trophyTotalCount');
  const progressPercentEl = document.getElementById('trophyProgressPercent');
  
  if (!unlockedCountEl || !totalCountEl || !progressPercentEl) return;
  
  const totalTrophies = Object.keys(trophies).length;
  let unlockedTrophies = 0;
  
  if (window.state && window.state.trophies) {
    Object.keys(window.state.trophies).forEach(trophyId => {
      const trophyState = window.state.trophies[trophyId];
      if (trophyState.unlockedTier) {
        unlockedTrophies++;
      }
    });
  }
  
  const progressPercent = totalTrophies > 0 ? Math.floor((unlockedTrophies / totalTrophies) * 100) : 0;
  
  unlockedCountEl.textContent = unlockedTrophies;
  totalCountEl.textContent = totalTrophies;
  progressPercentEl.textContent = progressPercent;
}

// Function to add a 3D trophy to a specific slot (for future use)
function addTrophyToSlot(slotId, trophyType = 'gold', trophyId = null) {
  const slot = document.querySelector(`[data-slot="${slotId}"]`);
  if (slot && slot.classList.contains('empty')) {
    slot.classList.remove('empty');
    slot.classList.add('filled');
    
    const trophy3D = document.createElement('div');
    trophy3D.className = 'trophy-3d';
    
    // Check if this is the power generator challenge trophy
    if (trophyId === 'powerGeneratorChallenge') {
      const trophy = trophies[trophyId];
      const tierIcon = trophy?.tiers?.[trophyType]?.icon;
      
      if (tierIcon) {
        // Create tooltip content for power generator challenge
        let buffText = '';
        let multiplier = 1;
        if (trophyType === 'bronze') {
          multiplier = 1.1;
          buffText = '+10% Power Cap Boost';
        } else if (trophyType === 'silver') {
          multiplier = 1.25;
          buffText = '+25% Power Cap Boost';
        } else if (trophyType === 'gold') {
          multiplier = 1.5;
          buffText = '+50% Power Cap Boost';
        }
        
        const tierInfo = trophy.tiers[trophyType];
        const tooltipContent = `
          <div class="trophy-tooltip-title">${tierInfo.name}</div>
          <div class="trophy-tooltip-description">${tierInfo.description}</div>
          <div class="trophy-tooltip-buff">${buffText}</div>
        `;
        
        // Create image element first and ensure it loads
        const img = document.createElement('img');
        img.src = tierIcon;
        img.alt = `${trophyType} power challenge trophy`;
        img.className = 'trophy-png';
        img.loading = 'eager';
        img.style.cssText = `
          width: 75px !important;
          height: 75px !important;
          object-fit: contain;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          position: relative;
          z-index: 3;
        `;
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'trophy-tooltip';
        tooltip.innerHTML = tooltipContent;
        
        // Create container
        const container = document.createElement('div');
        container.className = 'trophy-image-container';
        container.appendChild(img);
        container.appendChild(tooltip);
        
        // Use PNG image for power generator challenge
        trophy3D.innerHTML = `<div class="trophy-base"></div>`;
        trophy3D.appendChild(container);
        
        // Force image to stay visible
        img.onload = () => {
          img.style.opacity = '1';
          img.style.visibility = 'visible';
          img.style.display = 'block';
        };
        
        // Ensure image stays loaded even if src changes
        img.onerror = () => {
          console.error('Failed to load trophy image:', img.src);
          // Try reloading the image
          setTimeout(() => {
            img.src = tierIcon;
          }, 100);
        };
      } else {
        // Fallback to original design
        trophy3D.innerHTML = `
          <div class="trophy-base"></div>
          <div class="trophy-cup ${trophyType}"></div>
        `;
      }
    } else {
      // Use original design for other trophies
      trophy3D.innerHTML = `
        <div class="trophy-base"></div>
        <div class="trophy-cup ${trophyType}"></div>
      `;
    }
    
    slot.innerHTML = '';
    slot.appendChild(trophy3D);
    
    // Add trophy shine effect with a longer delay to ensure everything is loaded
    setTimeout(() => {
      trophy3D.style.animation = 'trophyShine 2s ease-in-out';
    }, 300);
  }
}

function checkTrophyProgress() {
  // Check all trophy progress
  Object.keys(trophies).forEach(trophyId => {
    const trophy = trophies[trophyId];
    if (trophy.type === 'challenge') {
      checkChallengeTrophy(trophyId);
    }
  });
}

function checkChallengeTrophy(trophyId) {
  const trophy = trophies[trophyId];
  if (!trophy || !window.state.trophies) return;
  
  if (trophyId === 'powerGeneratorChallenge') {
    const bestTime = window.state.powerChallengePersonalBest || 0;
    
    // Check each tier from highest to lowest
    let newTier = null;
    if (bestTime >= trophy.tiers.gold.requirement) {
      newTier = 'gold';
    } else if (bestTime >= trophy.tiers.silver.requirement) {
      newTier = 'silver';
    } else if (bestTime >= trophy.tiers.bronze.requirement) {
      newTier = 'bronze';
    }
    
    // Only unlock if we have a new tier or no tier unlocked yet
    const currentTier = window.state.trophies[trophyId]?.unlockedTier;
    if (newTier && newTier !== currentTier) {
      unlockTrophy(trophyId, newTier);
    }
  }
}

function unlockTrophy(trophyId, tier = 'gold') {
  const trophy = trophies[trophyId];
  if (!trophy) return;
  
  // Initialize trophy state if not exists
  if (!window.state.trophies) window.state.trophies = {};
  if (!window.state.trophies[trophyId]) {
    window.state.trophies[trophyId] = { unlockedTier: null };
  }
  
  // Update trophy state
  window.state.trophies[trophyId].unlockedTier = tier;
  trophy.unlockedTier = tier;
  
  // Add trophy to the display
  addTrophyToSlot(trophy.slot, tier, trophyId);
  
  // Show trophy notification
  showTrophyNotification(trophy, tier);
  
  // Update trophy display counts
  updateTrophyProgressDisplay();
  
  // If this is a power generator challenge trophy, update power UI to reflect new cap
  if (trophyId === 'powerGeneratorChallenge') {
    // Force immediate power cap recalculation
    if (typeof window.calculatePowerGeneratorCap === 'function') {
      const newCap = window.calculatePowerGeneratorCap();
      window.state.powerMaxEnergy = newCap;
      console.log('Trophy unlocked! New power cap:', newCap.toString());
    }
    
    // Update UI
    if (typeof window.updatePowerGeneratorUI === 'function') {
      setTimeout(() => {
        window.updatePowerGeneratorUI();
      }, 100);
    }
  }
}

function showTrophyNotification(trophy, tier) {
  const tierInfo = trophy.tiers[tier];
  if (!tierInfo) return;
  
  // Create trophy notification
  const notification = document.createElement('div');
  notification.className = 'trophy-notification';
  
  // Check if this is the power generator challenge trophy
  let trophyIconHTML;
  if (trophy.id === 'powerGeneratorChallenge' && tierInfo.icon) {
    // Add power buff information to notification
    let buffText = '';
    if (tier === 'bronze') {
      buffText = '<div style="color: #4caf50; font-weight: bold; margin-top: 6px;">+10% Power Cap Boost!</div>';
    } else if (tier === 'silver') {
      buffText = '<div style="color: #4caf50; font-weight: bold; margin-top: 6px;">+25% Power Cap Boost!</div>';
    } else if (tier === 'gold') {
      buffText = '<div style="color: #4caf50; font-weight: bold; margin-top: 6px;">+50% Power Cap Boost!</div>';
    }
    
    // Use PNG image for power generator challenge
    trophyIconHTML = `
      <div class="trophy-notification-icon">
        <img src="${tierInfo.icon}" alt="${tier} power challenge trophy" style="width: 85px; height: 85px; object-fit: contain; display: block; opacity: 1;" loading="eager" />
      </div>
    `;
    
    // Modify the description to include the buff
    tierInfo.description = tierInfo.description + buffText;
  } else {
    // Use original 3D design for other trophies
    trophyIconHTML = `
      <div class="trophy-notification-icon">
        <div class="trophy-3d">
          <div class="trophy-base"></div>
          <div class="trophy-cup ${tier}"></div>
        </div>
      </div>
    `;
  }
  
  notification.innerHTML = `
    <div class="trophy-notification-content">
      ${trophyIconHTML}
      <div class="trophy-notification-text">
        <h3>Trophy Unlocked!</h3>
        <h4>${tierInfo.name}</h4>
        <p>${tierInfo.description}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Observer to ensure trophy images stay visible
function observeTrophyVisibility() {
  if (typeof window.trophyObserver !== 'undefined') {
    window.trophyObserver.disconnect();
  }
  
  window.trophyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // Check if any trophy images have become invisible
        const trophyImages = document.querySelectorAll('.trophy-png');
        trophyImages.forEach((img) => {
          if (img.style.display === 'none' || img.style.opacity === '0' || img.style.visibility === 'hidden') {
            // Force the image to be visible
            img.style.display = 'block';
            img.style.opacity = '1';
            img.style.visibility = 'visible';
          }
        });
        
        // Check if any trophy tooltips have become invisible
        const trophyTooltips = document.querySelectorAll('.trophy-tooltip');
        trophyTooltips.forEach((tooltip) => {
          if (tooltip.style.display === 'none') {
            tooltip.style.display = 'block';
          }
        });
      }
    });
  });
  
  // Start observing
  const trophyGrid = document.getElementById('trophyAchievementsGrid');
  if (trophyGrid) {
    window.trophyObserver.observe(trophyGrid, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
}

// Function to get the current power cap multiplier from trophies
function getTrophyPowerCapMultiplier() {
  if (window.state.trophies && window.state.trophies.powerGeneratorChallenge && window.state.trophies.powerGeneratorChallenge.unlockedTier) {
    const tier = window.state.trophies.powerGeneratorChallenge.unlockedTier;
    
    if (tier === 'bronze') {
      return 1.1;
    } else if (tier === 'silver') {
      return 1.25;
    } else if (tier === 'gold') {
      return 1.5;
    }
  }
  
  return 1; // No trophy = no multiplier
}

// Function to manually refresh power cap (for testing)
function refreshPowerCapForTrophies() {
  if (typeof window.calculatePowerGeneratorCap === 'function') {
    const newCap = window.calculatePowerGeneratorCap();
    window.state.powerMaxEnergy = newCap;
    
    // Update UI
    if (typeof window.updatePowerGeneratorUI === 'function') {
      window.updatePowerGeneratorUI();
    }
    
    console.log('Power cap refreshed to:', newCap.toString());
    return newCap;
  }
  return null;
}

// Expose trophy functions globally
window.trophies = trophies;
window.renderTrophies = renderTrophies;
window.addTrophyToSlot = addTrophyToSlot;
window.checkTrophyProgress = checkTrophyProgress;
window.checkChallengeTrophy = checkChallengeTrophy;
window.observeTrophyVisibility = observeTrophyVisibility;
window.getTrophyPowerCapMultiplier = getTrophyPowerCapMultiplier;
window.refreshPowerCapForTrophies = refreshPowerCapForTrophies;
window.unlockTrophy = unlockTrophy;
window.showTrophyNotification = showTrophyNotification;
window.updateTrophyProgressDisplay = updateTrophyProgressDisplay;

window.updateAchievementsDisplay = updateAchievementsDisplay;
window.stopAchievementTracking = stopAchievementTracking;
window.switchAchievementsSubTab = switchAchievementsSubTab;
window.claimAchievementReward = claimAchievementReward;
window.showNextPopup = showNextPopup;
window.showRewardNotification = showRewardNotification;
window.showAchievementNotification = showAchievementNotification;
window.showGenericRewardNotification = showGenericRewardNotification;