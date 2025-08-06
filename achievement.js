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
    requirement: 100,
    unlocked: false,
    progress: 0,
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
    requirement: 500,
    unlocked: false,
    progress: 0,
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
    requirement: 1,
    unlocked: false,
    progress: 0,
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
    requirement: 2500,
    unlocked: false,
    progress: 0,
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
    requirement: 10000,
    unlocked: false,
    progress: 0,
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
    requirement: 1000,
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
    requirement: 1000000,
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
  LightAutomation: {
    id: 'LightAutomation',
    name: 'Light automation???',
    description: 'Start automaticaly generating light',
    icon: 'assets/icons/light.png',
    type: 'autolight',
    requirement: 1,
    unlocked: false,
    progress: 0,
    category: 'normal',
    row: 4,
    position: 2,
    rewarded: false
  },
  ChargingUp: {
    id: 'ChargingUp',
    name: 'Charging up',
    description: 'Collect 20,000 charge',
    icon: 'assets/icons/charge.png',
    type: 'charge',
    requirement: 20000,
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
    position: 3,
    rewarded: false
  },
  No7thExpansion: {
    id: 'No7thExpansion',
    name: 'What!? I can not expand???',
    description: 'Collect 1e50 KP',
    icon: 'assets/icons/kp.png',
    type: 'kp',
    requirement: 1e50,
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
let achievementStats = {
  totalClicks: 0,
  totalPlayTime: 0,
  totalUpgrades: 0,
  lastSaveTime: Date.now()
};
let achievementPopupQueue = [];
let isShowingPopup = false;

function initAchievements() {
  loadAchievements();
  updateAchievementsDisplay();
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
        achievements[id].progress = savedData.achievements[id].progress;
        achievements[id].rewarded = savedData.achievements[id].rewarded || false;
      }
    });
    achievementStats = savedData.stats || achievementStats;
  } else {
    Object.values(achievements).forEach(achievement => {
      achievement.unlocked = false;
      achievement.progress = 0;
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
      progress: achievements[id].progress,
      rewarded: achievements[id].rewarded
    };
  });
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  const saveKey = currentSaveSlot ? `fluffIncAchievementsSlot${currentSaveSlot}` : 'fluffIncAchievements';
  localStorage.setItem(saveKey, JSON.stringify(saveData));
  if (typeof window.saveSecretAchievements === 'function') {
    window.saveSecretAchievements();
  }
}

function updateAchievementProgress(type, value) {
  Object.values(achievements).forEach(achievement => {
    if (achievement.type === type && !achievement.unlocked) {
      achievement.progress = Math.max(achievement.progress, value);
      if (achievement.progress >= achievement.requirement) {
        unlockAchievement(achievement.id);
      }
    }
  });
}

function unlockAchievement(achievementId) {
  const achievement = achievements[achievementId];
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.progress = achievement.requirement;
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
      if (typeof window.state.swabucks !== 'number') window.state.swabucks = 0;
      window.state.swabucks += rewardAmount;
      const swabucksElement = document.getElementById('inventoryCount-swabucks');
      if (swabucksElement) {
        swabucksElement.textContent = window.state.swabucks;
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

function updateAchievementsDisplay() {
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
    const percent = total > 0 ? Math.round((unlocked / total) * 100 * 100) / 100 : 0;
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
  const mainSecretAchievements = Object.values(achievements).filter(a => a.category === 'secret');
  const additionalSecretAchievements = typeof window.secretAchievements !== 'undefined' ? Object.values(window.secretAchievements) : [];
  const allSecretAchievements = [...mainSecretAchievements, ...additionalSecretAchievements];
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
    const percent = total > 0 ? Math.round((unlocked / total) * 100 * 100) / 100 : 0;
    progressPercent.textContent = percent;
  }
}

function createAchievementCard(achievement) {
  const card = document.createElement('div');
  card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
  const progressPercent = Math.min((achievement.progress / achievement.requirement) * 100, 100);
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
    card.onclick = () => claimAchievementReward(achievement.id);
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
      card.onclick = () => window.handleSecretAchievementClick(achievement.id);
    }
  }
  return card;
}

function switchAchievementsSubTab(tabId) {
  document.getElementById('achievementsNormalTab').style.display = 'none';
  document.getElementById('achievementsSecretTab').style.display = 'none';
  document.getElementById('achievementsNormalTabBtn').classList.remove('active');
  document.getElementById('achievementsSecretTabBtn').classList.remove('active');
  if (tabId === 'achievementsNormalTab') {
    document.getElementById('achievementsNormalTab').style.display = 'block';
    document.getElementById('achievementsNormalTabBtn').classList.add('active');
  } else if (tabId === 'achievementsSecretTab') {
    document.getElementById('achievementsSecretTab').style.display = 'block';
    document.getElementById('achievementsSecretTabBtn').classList.add('active');
  }
}

function startAchievementTracking() {
  setInterval(() => {
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
  const discoveredCount = Object.keys(boughtElements).filter(key => boughtElements[key]).length;
  updateAchievementProgress('elements', discoveredCount);
  if (boughtElements[7]) {
    updateAchievementProgress('element7', 1);
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
    achievements.RedLightParticles.progress = 1;
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

function trackViAutoLightQuestCompletion() {
  updateAchievementProgress('autolight', 1);
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
    achievement.progress = 0;
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
window.trackViAutoLightQuestCompletion = trackViAutoLightQuestCompletion;
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
window.updateAchievementsDisplay = updateAchievementsDisplay;
window.switchAchievementsSubTab = switchAchievementsSubTab;
window.claimAchievementReward = claimAchievementReward;
window.showNextPopup = showNextPopup;
