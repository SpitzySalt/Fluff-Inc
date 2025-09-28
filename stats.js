// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file








































const MAX_FRIENDSHIP_LEVEL = 15;

// Make MAX_FRIENDSHIP_LEVEL globally accessible
window.MAX_FRIENDSHIP_LEVEL = MAX_FRIENDSHIP_LEVEL;

function getFriendshipPointsForLevel(level) {
  return new Decimal(100).mul(new Decimal(4).pow(level)).floor();
}

const charToDept = {
  'swaria': 'Cargo',
  'soap': 'Generator',
  'mystic': 'Kitchen',
  'fluzzer': 'Terrarium',
  'vi': 'Lab',
  'vivien': 'Lab',
  'lepre': 'Boutique',
  'tico': 'FrontDesk'
};

// Make stats.js variables and functions globally accessible
window.getFriendshipPointsForLevel = getFriendshipPointsForLevel;
window.charToDept = charToDept;

function initFriendshipFunctions() {
  // Ensure window.state.friendship exists with proper initialization
  if (!window.state) window.state = {};
  window.state.friendship = window.state.friendship || {
    Cargo: { level: 0, points: new Decimal(0) },
    Generator: { level: 0, points: new Decimal(0) },
    Lab: { level: 0, points: new Decimal(0) },
    Kitchen: { level: 0, points: new Decimal(0) },
    Terrarium: { level: 0, points: new Decimal(0) },
    Boutique: { level: 0, points: new Decimal(0) },
    FrontDesk: { level: 0, points: new Decimal(0) }
  };
  
  // Convert existing numeric points to Decimals for backwards compatibility
  Object.keys(window.state.friendship).forEach(dept => {
    if (window.state.friendship[dept] && typeof window.state.friendship[dept] === 'object') {
      if (typeof window.state.friendship[dept].points === 'number') {
        window.state.friendship[dept].points = new Decimal(window.state.friendship[dept].points);
      } else if (typeof window.state.friendship[dept].points === 'string') {
        window.state.friendship[dept].points = new Decimal(window.state.friendship[dept].points);
      } else if (!window.state.friendship[dept].points) {
        window.state.friendship[dept].points = new Decimal(0);
      }
    }
  });
  window.state.friendship.getPoints = function(character) {
    const dept = charToDept[character.toLowerCase()];
    if (!dept || !window.state.friendship[dept]) return new Decimal(0);
    const f = window.state.friendship[dept];
    let totalPoints = new Decimal(0);
    for (let i = 0; i < f.level; i++) {
      totalPoints = totalPoints.add(getFriendshipPointsForLevel(i));
    }
    // Ensure points is a Decimal before adding
    const currentPoints = DecimalUtils.isDecimal(f.points) ? f.points : new Decimal(f.points || 0);
    totalPoints = totalPoints.add(currentPoints);
    return totalPoints;
  };
  window.state.friendship.addPoints = function(character, points) {
  const dept = charToDept[character.toLowerCase()];
  if (!dept) return;
  
  try {
    // Always initialize department if missing
    window.state.friendship[dept] = window.state.friendship[dept] || { level: 0, points: new Decimal(0) };
    
    // Ensure existing points is a Decimal
    if (!DecimalUtils.isDecimal(window.state.friendship[dept].points)) {
      window.state.friendship[dept].points = new Decimal(window.state.friendship[dept].points || 0);
    }
    
    // Ensure level is properly initialized as a number
    if (typeof window.state.friendship[dept].level !== 'number' || isNaN(window.state.friendship[dept].level)) {
      window.state.friendship[dept].level = 0;
    }
    
    // Ensure points parameter is a Decimal
    const pointsToAdd = DecimalUtils.isDecimal(points) ? points : new Decimal(points || 0);
    
    // Add the points to the current total
    window.state.friendship[dept].points = window.state.friendship[dept].points.add(pointsToAdd);
    
    // Calculate the correct level based on total accumulated points
    // getFriendshipPointsForLevel(n) returns the TOTAL points needed to BE AT level n
    let newLevel = 0;
    const totalPoints = window.state.friendship[dept].points;
    
    // Find the highest level where total points >= required points for that level
    for (let level = 0; level <= MAX_FRIENDSHIP_LEVEL; level++) {
      const requiredForThisLevel = getFriendshipPointsForLevel(level);
      if (totalPoints.gte(requiredForThisLevel)) {
        newLevel = level;
      } else {
        break; // Stop when we find the first level we can't reach
      }
    }
    
    window.state.friendship[dept].level = newLevel;
  } catch (error) {
    console.warn(`Error in friendship.addPoints for ${character}:`, error);
    // Try to recover by ensuring decimal conversion
    if (typeof window.validateAndFixDecimals === 'function') {
      window.validateAndFixDecimals();
    }
  }

    if (typeof window.renderDepartmentStatsButtons === 'function') {
      window.renderDepartmentStatsButtons();
      const statsModal = document.getElementById('departmentStatsModal');
      if (statsModal && statsModal.style.display === 'flex') {

        showDepartmentStatsModal(dept);
      } else {

      }
    } else {

    }
  };
  
  // Serialization functions for friendship system
  window.state.friendship.serialize = function() {
    const serialized = {};
    Object.keys(window.state.friendship).forEach(dept => {
      if (dept !== 'getPoints' && dept !== 'addPoints' && dept !== 'serialize' && dept !== 'deserialize' && dept !== 'getFriendshipLevel') {
        const f = window.state.friendship[dept];
        serialized[dept] = {
          level: f.level,
          points: f.points ? f.points.toString() : "0"
        };
      }
    });
    return serialized;
  };
  
  window.state.friendship.deserialize = function(data) {
    if (!data) return;
    Object.keys(data).forEach(dept => {
      window.state.friendship[dept] = window.state.friendship[dept] || { level: 0, points: new Decimal(0) };
      window.state.friendship[dept].level = data[dept].level || 0;
      window.state.friendship[dept].points = new Decimal(data[dept].points || 0);
    });
  };

  // Add getFriendshipLevel function that returns the department friendship data
  window.state.friendship.getFriendshipLevel = function(character) {
    const dept = charToDept[character.toLowerCase()];
    if (!dept || !window.state.friendship[dept]) {
      return { level: 0, points: new Decimal(0) };
    }
    return {
      level: window.state.friendship[dept].level || 0,
      points: window.state.friendship[dept].points || new Decimal(0)
    };
  };
  
  // Create backward compatibility alias for existing code that uses window.friendship
  window.friendship = window.state.friendship;
}

// Initialize friendship functions with cleanup tracking
if (!window._statsInitialized) {
  window._statsInitialized = true;
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initFriendshipFunctions, 0);
  } else {
    const initHandler = function() {
      initFriendshipFunctions();
      document.removeEventListener('DOMContentLoaded', initHandler);
    };
    document.addEventListener('DOMContentLoaded', initHandler);
  }
}
const origLoadGame = window.loadGame;
window.loadGame = function() {
  if (origLoadGame) origLoadGame.apply(this, arguments);
  initFriendshipFunctions();
};

function getFriendshipBuffs(department, level) {
  const buffTemplates = {
    'Generator': {
      1: (lvl) => `Increase the chance soap refills the power by ${new Decimal(2.5).mul(lvl).toNumber()}%`,
      4: (lvl) => {
        const timeMins = Math.max(1, 10 - (lvl - 4)); // Decreases by 1 minute per level above 4, minimum 1 minute
        const capAmount = 3 + Math.floor((lvl - 4) / 2); // +1 every 2 levels above 4
        return `Soap upgraded the power generator to Mk.2! Generates 1 auto recharge every ${timeMins} minute${timeMins === 1 ? '' : 's'} (cap: ${capAmount}). Auto recharges power to max when it drops below 20`;
      },
      7: (lvl) => {
        const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
        if (hasInfinity) {
          return `Soap added a search function into your anomaly resolver tool, right click with the tool equipped to activate search mode`;
        } else {
          return `Reach a certain point in the game to see the effect`;
        }
      },
      10: (lvl) => `Soap combined the box generators to create the ultimate box generator! This new box generator produce all 5 type of box`,
      15: (lvl) => `Soap upgraded the charger to Mk.2! This will produce 1% of charge amount automatically without affecting power rate`
    },
    'Lab': {
      1: (lvl) => `+${new Decimal(25).add(new Decimal(5).mul(Math.max(0, lvl - 1))).toNumber()}% chances to earn X5 light gain per tile click`,
      4: (lvl) => `An additional ${1 + Math.floor((lvl - 4) / 2)} light tile${1 + Math.floor((lvl - 4) / 2) === 1 ? '' : 's'} will spawn${1 + Math.floor((lvl - 4) / 2) === 1 ? 's' : ''} inside the prism grid (+${1 + Math.floor((lvl - 4) / 2)})`,
      7: (lvl) => `Clicking a light tile has a ${5 + Math.max(0, (lvl - 7) * 5)}% chance to collect every light tile on the grid at once`,
      10: (lvl) => `The light nerf decay rate increases to ${1 + Math.max(0, (lvl - 9))}% per second`,
      15: (lvl) => `Double the tick speed of the light nerf decay (updates every 500ms instead of 1000ms)`
    },
    'Kitchen': {
      1: (lvl) => `Cooking speed increased by ${new Decimal(10).mul(lvl).toNumber()}%`,
      4: (lvl) => `The mixing recipes will require ${Math.max(0, (lvl - 3) * 2)} less main ingredient per lvl (-${Math.max(0, lvl - 3) * 2})`,
      7: (lvl) => `WIP`,
      10: (lvl) => `WIP`,
      15: (lvl) => `WIP`
    },
    'Terrarium': {
      1: (lvl) => `Decreases Fluzzer's action interval by ${new Decimal(500).mul(lvl).toNumber()}ms and improves cursor speed by ${new Decimal(8).mul(lvl).toNumber()}%`,
      4: (lvl) => `The pollen collector has a ${10 + Math.max(0, (lvl - 4) * 2)}% chance to perform a petal slice that damages flowers in its path`,
      7: (lvl) => `The pollen collector has a ${1 + Math.max(0, (lvl - 7) * 0.5)}% chance to perform a flower wipe that damages every flower`,
      10: (lvl) => `The watering can tool will now affect an area of 5X5`,
      15: (lvl) => `Fluzzer will detect any rustling flowers and go click on it and collect the token + The watering can tool will now affect an area of 6X6`
    },
    'FrontDesk': {
      1: (lvl) => `Increases chances for higher star Rikkor workers by ${new Decimal(10).mul(lvl).toNumber()}%`,
      4: (lvl) => `Tico will produce an extra food ration per lvl (+${Math.max(0, lvl - 3)})`,
      7: (lvl) => `WIP`,
      10: (lvl) => `WIP`,
      15: (lvl) => `WIP`
    },
    'Boutique': {
      1: (lvl) => `Daily free Swa Bucks increased to ${new Decimal(1).add(lvl).toNumber()} (base 1 + friendship level)`,
      4: (lvl) => `Every regular token will have an extra ${Math.max(0, (lvl - 3) * 2)} stock per lvl (+${Math.max(0, lvl - 3) * 2})`,
      7: (lvl) => `Token spawns have a ${10 + Math.max(0, (lvl - 7) * 2)}% chance to trigger a token burst, spawning 5 tokens at once with golden effects`,
      10: (lvl) => `You will earn 2 times more tokens when buying any tokens from Lepre's shop`,
      15: (lvl) => `Every premium token will be half priced and also have an extra 4 stock`
    }
  };
  
  if (department === 'Cargo') return [];
  
  const deptBuffs = buffTemplates[department] || {};
  const buffLevels = [1, 4, 7, 10, 15];
  const result = [];
  
  buffLevels.forEach(unlockLevel => {
    if (deptBuffs[unlockLevel]) {
      if (level >= unlockLevel) {
        // Show the actual buff text with current level
        result.push({
          unlockLevel: unlockLevel,
          text: deptBuffs[unlockLevel](level),
          unlocked: true
        });
      } else {
        // Show "Buff unlocks at lvl X"
        result.push({
          unlockLevel: unlockLevel,
          text: `Buff unlocks at lvl ${unlockLevel}`,
          unlocked: false
        });
      }
    }
  });
  
  return result;
}

function showDepartmentStatsModal(department) {
  // Ensure friendship object has all departments
  const fallback = {
    'Cargo': { level: 0, points: new Decimal(0) },
    'Generator': { level: 0, points: new Decimal(0) },
    'Lab': { level: 0, points: new Decimal(0) },
    'Kitchen': { level: 0, points: new Decimal(0) },
    'Terrarium': { level: 0, points: new Decimal(0) },
    'Boutique': { level: 0, points: new Decimal(0) },
    'FrontDesk': { level: 0, points: new Decimal(0) },
  };
  
  const friendship = window.friendship || fallback;
  
  // Ensure the specific department exists in friendship
  if (!friendship[department]) {
    friendship[department] = fallback[department];
  }
  
  const characterNames = {
    'Cargo': 'Peachy',
    'Generator': 'Soap',
    'Lab': 'Vivien',
    'Kitchen': 'Mystic',
    'Terrarium': 'Fluzzer',
    'Boutique': 'Lepre',
    'FrontDesk': 'Tico',
  };
  const modal = document.getElementById('departmentStatsModal');
  const title = document.getElementById('departmentStatsModalTitle');
  const content = document.getElementById('departmentStatsModalContent');
  const bar = document.getElementById('departmentFriendshipBar');
  const text = document.getElementById('departmentFriendshipText');
  
  // Display "Front Desk" instead of "FrontDesk" in title
  const displayName = department === 'FrontDesk' ? 'Front Desk' : department;
  title.textContent = displayName + ' Stats';
  
  // Keep it simple - just show basic coming soon message for all departments
  content.innerHTML = `<div style='font-size:1.2em;'>More stats for <b>${displayName}</b> coming soon!</div>`;
  
  if (department === 'Cargo') {
    bar.parentElement.parentElement.style.display = 'none';
  } else {
    const f = friendship[department] || { level: 0, points: new Decimal(0) };


    let level = new Decimal(f.level).min(MAX_FRIENDSHIP_LEVEL).toNumber();
    let points = f.points || new Decimal(0);
    let pointsNeeded = getFriendshipPointsForLevel(level);
    let percent = new Decimal(100).min(points.div(pointsNeeded).mul(100).round()).toNumber();

    let isMax = (level >= MAX_FRIENDSHIP_LEVEL);
    bar.style.width = isMax ? '100%' : percent + '%';
    text.textContent = isMax
      ? `Level ${level} (MAX)`
      : `Level ${level} (${DecimalUtils.formatDecimal(points)} / ${DecimalUtils.formatDecimal(pointsNeeded)})`;

    const labelDiv = bar.parentElement.parentElement.querySelector('.friendship-label');
    if (labelDiv) {
      labelDiv.innerHTML = `<span style='font-weight:bold;'>Friendship Level</span> <span style='color:#888;font-size:0.98em;margin-left:0.7em;'>${characterNames[department]}</span>`;
    } else {
      const newLabel = document.createElement('div');
      newLabel.className = 'friendship-label';
      newLabel.style.fontWeight = 'bold';
      newLabel.style.marginBottom = '0.3em';
      newLabel.innerHTML = `Friendship Level <span style='color:#888;font-size:0.98em;margin-left:0.7em;'>${characterNames[department]}</span>`;
      bar.parentElement.parentElement.insertBefore(newLabel, bar.parentElement.parentElement.firstChild);
      const oldLabel = bar.parentElement.parentElement.querySelector('div[style*="font-weight:bold"]:not(.friendship-label)');
      if (oldLabel) oldLabel.remove();
    }
    bar.parentElement.parentElement.style.display = '';
    const oldBuffs = bar.parentElement.parentElement.querySelector('.friendship-buffs');
    if (oldBuffs) oldBuffs.remove();
    const buffsList = getFriendshipBuffs(department, level);
    if (buffsList.length > 0) {
      const buffsDiv = document.createElement('div');
      buffsDiv.className = 'friendship-buffs';
      
      let buffsHTML = '<b>Current Buffs:</b><div style="margin-top: 0.8em;">';
      
      buffsList.forEach((buff, index) => {
        const buffClass = buff.unlocked ? 'buff-unlocked' : 'buff-locked';
        
        buffsHTML += `<div class="buff-item ${buffClass}">
          ${buff.text}
        </div>`;
      });
      
      buffsHTML += '</div>';
      buffsDiv.innerHTML = buffsHTML;
      bar.parentElement.parentElement.appendChild(buffsDiv);
    }
  }
  modal.style.display = 'flex';
}

if (typeof window._departmentStatsModalInit === 'undefined') {
  window._departmentStatsModalInit = true;
  const modalInitHandler = function() {
    const closeBtn = document.getElementById('departmentStatsModalCloseBtn');
    if (closeBtn && !closeBtn._statsClickHandler) {
      closeBtn._statsClickHandler = function() {
        document.getElementById('departmentStatsModal').style.display = 'none';
      };
      closeBtn.onclick = closeBtn._statsClickHandler;
    }
    const modal = document.getElementById('departmentStatsModal');
    if (modal && !modal._statsClickHandler) {
      modal._statsClickHandler = function(e) {
        if (e.target === modal) modal.style.display = 'none';
      };
      modal.addEventListener('click', modal._statsClickHandler);
    }
    document.removeEventListener('DOMContentLoaded', modalInitHandler);
  };
  document.addEventListener('DOMContentLoaded', modalInitHandler);
}

// Debug function to test friendship levels (remove in production)
window.testFriendshipLevel = function(department, level) {
  if (!window.friendship) return;
  if (!window.friendship[department]) {
    window.friendship[department] = { level: 0, points: new Decimal(0) };
  }
  window.friendship[department].level = level;
  window.friendship[department].points = new Decimal(0);

  if (typeof window.renderDepartmentStatsButtons === 'function') {
    window.renderDepartmentStatsButtons();
  }
  showDepartmentStatsModal(department);
};

function renderDepartmentStatsButtons() {
  const container = document.getElementById('departmentStatsButtons');
  if (!container) return;
  const grade = new Decimal(state && state.grade || 1).toNumber();
  container.innerHTML = `<h2>Departments</h2><div style="margin-bottom:1em;font-size:1.1em;color:#222;">Current Expansion: <b>${grade}</b></div>`;
  const departments = [
    { name: 'Cargo', unlocked: true },
    { name: 'FrontDesk', unlocked: new Decimal(grade).gte(2) },
    { name: 'Generator', unlocked: new Decimal(grade).gte(2) },
    { name: 'Lab', unlocked: new Decimal(grade).gte(2) },
    { name: 'Kitchen', unlocked: new Decimal(grade).gte(3) },
    { name: 'Boutique', unlocked: new Decimal(grade).gte(4) },
    { name: 'Terrarium', unlocked: new Decimal(grade).gte(6) },
  ];
  let any = false;
  departments.forEach(dep => {
    if (dep.unlocked) {
      const btn = document.createElement('button');
      // Display "Front Desk" instead of "FrontDesk"
      btn.textContent = dep.name === 'FrontDesk' ? 'Front Desk' : dep.name;
      btn.className = 'department-stats-btn';
      btn.onclick = function() {
        showDepartmentStatsModal(dep.name);
      };
      container.appendChild(btn);
      any = true;
    }
  });
  if (!any) {
    const msg = document.createElement('div');
    msg.style.marginTop = '1em';
    msg.style.color = '#888';
    msg.textContent = 'No departments unlocked yet.';
    container.appendChild(msg);
  }
}

// Initialize department stats with cleanup tracking
if (!window._departmentStatsInitialized) {
  window._departmentStatsInitialized = true;
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(renderDepartmentStatsButtons, 0);
  } else {
    const renderHandler = function() {
      renderDepartmentStatsButtons();
      document.removeEventListener('DOMContentLoaded', renderHandler);
    };
    document.addEventListener('DOMContentLoaded', renderHandler);
  }
}
const origShowPageStats = window.showPage || (typeof showPage === 'function' && showPage);
window.showPage = function(pageId) {
  if (origShowPageStats) origShowPageStats.apply(this, arguments);
  if (pageId === 'settings') {
    renderDepartmentStatsButtons();
  }
};

// Cleanup function for stats.js (minimal cleanup needed)
window.cleanupStats = function() {
  // Reset initialization flags to allow re-initialization if needed
  window._statsInitialized = false;
  window._departmentStatsInitialized = false;
  window._departmentStatsModalInit = false;
  
  // Remove modal event listeners if they exist
  const modal = document.getElementById('departmentStatsModal');
  if (modal && modal._statsClickHandler) {
    modal.removeEventListener('click', modal._statsClickHandler);
    modal._statsClickHandler = null;
  }
  
  const closeBtn = document.getElementById('departmentStatsModalCloseBtn');
  if (closeBtn && closeBtn._statsClickHandler) {
    closeBtn.removeEventListener('click', closeBtn._statsClickHandler);
    closeBtn._statsClickHandler = null;
  }
};
