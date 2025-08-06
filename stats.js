// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file













































const MAX_FRIENDSHIP_LEVEL = 15;

function getFriendshipPointsForLevel(level) {
  return Math.floor(100 * Math.pow(4, level));
}

const charToDept = {
  'swaria': 'Cargo',
  'soap': 'Generator',
  'mystic': 'Kitchen',
  'fluzzer': 'Terrarium',
  'vi': 'Lab'
};

function initFriendshipFunctions() {
  window.friendship = window.friendship || {
    Cargo: { level: 0, points: 0 },
    Generator: { level: 0, points: 0 },
    Lab: { level: 0, points: 0 },
    Kitchen: { level: 0, points: 0 },
    Terrarium: { level: 0, points: 0 }
  };
  window.friendship.getPoints = function(character) {
    const dept = charToDept[character.toLowerCase()];
    if (!dept || !window.friendship[dept]) return 0;
    const f = window.friendship[dept];
    let totalPoints = 0;
    for (let i = 0; i < f.level; i++) {
      totalPoints += getFriendshipPointsForLevel(i);
    }
    totalPoints += f.points;
    return totalPoints;
  };
  window.friendship.addPoints = function(character, points) {
    const dept = charToDept[character.toLowerCase()];
    if (!dept || !window.friendship[dept]) return;
    window.friendship[dept] = window.friendship[dept] || { level: 0, points: 0 };
    window.friendship[dept].points += points;
    let lvl = window.friendship[dept].level;
    let needed = getFriendshipPointsForLevel(lvl);
    while (window.friendship[dept].points >= needed && lvl < MAX_FRIENDSHIP_LEVEL) {
      window.friendship[dept].points -= needed;
      lvl++;
      needed = getFriendshipPointsForLevel(lvl);
    }
    window.friendship[dept].level = lvl;
    if (typeof window.renderDepartmentStatsButtons === 'function') {
      window.renderDepartmentStatsButtons();
      const statsModal = document.getElementById('departmentStatsModal');
      if (statsModal && statsModal.style.display === 'flex') {
        showDepartmentStatsModal(dept);
      }
    }
  };
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initFriendshipFunctions, 0);
} else {
  document.addEventListener('DOMContentLoaded', initFriendshipFunctions);
}
const origLoadGame = window.loadGame;
window.loadGame = function() {
  if (origLoadGame) origLoadGame.apply(this, arguments);
  initFriendshipFunctions();
};

function getFriendshipBuffs(department, level) {
  const buffs = {
    'Generator': [
      "No bonus.",
      ...Array.from({length: 15}, (_, i) => `Increase the chance soap refills the power by ${5 * (i + 1)}%`),
    ],
    'Lab': [
      "No bonus.",
      "wip",
    ],
    'Kitchen': [
      "No bonus.",
      "wip",
    ],
    'Terrarium': [
      "No bonus.",
      ...Array.from({length: 15}, (_, i) => `Decreases Fluzzer's action interval by ${500 * (i + 1)}ms and improves cursor speed by ${8 * (i + 1)}%`),
    ]
  };
  if (department === 'Cargo') return [];
  const buffsArr = buffs[department] || [];
  return buffsArr.slice(1, Math.min(level + 1, buffsArr.length));
}

function showDepartmentStatsModal(department) {
  const friendship = window.friendship || {
    'Cargo': { level: 0, points: 0 },
    'Generator': { level: 0, points: 0 },
    'Lab': { level: 0, points: 0 },
    'Kitchen': { level: 0, points: 0 },
    'Terrarium': { level: 0, points: 0 },
  };
  const characterNames = {
    'Cargo': '',
    'Generator': 'Soap',
    'Lab': 'Vi',
    'Kitchen': 'Mystic',
    'Terrarium': 'Fluzzer',
  };
  const modal = document.getElementById('departmentStatsModal');
  const title = document.getElementById('departmentStatsModalTitle');
  const content = document.getElementById('departmentStatsModalContent');
  const bar = document.getElementById('departmentFriendshipBar');
  const text = document.getElementById('departmentFriendshipText');
  title.textContent = department + ' Stats';
  content.innerHTML = `<div style='font-size:1.2em;'>More stats for <b>${department}</b> coming soon!</div>`;
  if (department === 'Cargo') {
    bar.parentElement.parentElement.style.display = 'none';
  } else {
    const f = friendship[department] || { level: 0, points: 0 };
    let level = Math.min(f.level, MAX_FRIENDSHIP_LEVEL);
    let points = f.points;
    let pointsNeeded = getFriendshipPointsForLevel(level);
    let percent = Math.min(100, Math.round((points / pointsNeeded) * 100));
    let isMax = (level >= MAX_FRIENDSHIP_LEVEL);
    bar.style.width = isMax ? '100%' : percent + '%';
    text.textContent = isMax
      ? `Level ${level} (MAX)`
      : `Level ${level} (${points} / ${pointsNeeded})`;
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
      buffsDiv.style.marginTop = '1.2em';
      buffsDiv.innerHTML = '<b>Current Buffs:</b><ul style="margin:0.5em 0 0 1.2em;padding:0;">' +
        buffsList.map(buff => `<li style="margin-bottom:0.2em;">${buff}</li>`).join('') +
        '</ul>';
      bar.parentElement.parentElement.appendChild(buffsDiv);
    }
  }
  modal.style.display = 'flex';
}

if (typeof window._departmentStatsModalInit === 'undefined') {
  window._departmentStatsModalInit = true;
  document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('departmentStatsModalCloseBtn');
    if (closeBtn) closeBtn.onclick = function() {
      document.getElementById('departmentStatsModal').style.display = 'none';
    };
    const modal = document.getElementById('departmentStatsModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  });
}

function renderDepartmentStatsButtons() {
  const container = document.getElementById('departmentStatsButtons');
  if (!container) return;
  const grade = Number(state && state.grade) || 1;
  container.innerHTML = `<h2>Departments</h2><div style="margin-bottom:1em;font-size:1.1em;color:#222;">Current Expansion: <b>${grade}</b></div>`;
  const departments = [
    { name: 'Cargo', unlocked: true },
    { name: 'Generator', unlocked: grade >= 2 },
    { name: 'Lab', unlocked: grade >= 2 },
    { name: 'Kitchen', unlocked: grade >= 3 },
    { name: 'Terrarium', unlocked: grade >= 6 },
  ];
  let any = false;
  departments.forEach(dep => {
    if (dep.unlocked) {
      const btn = document.createElement('button');
      btn.textContent = dep.name;
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

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(renderDepartmentStatsButtons, 0);
} else {
  document.addEventListener('DOMContentLoaded', renderDepartmentStatsButtons);
}
const origShowPageStats = window.showPage || (typeof showPage === 'function' && showPage);
window.showPage = function(pageId) {
  if (origShowPageStats) origShowPageStats.apply(this, arguments);
  if (pageId === 'settings') {
    renderDepartmentStatsButtons();
  }
};
