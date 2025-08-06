// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file


















































window.premiumState = window.premiumState || {
  bijouUnlocked: false,
  bijouEnabled: false,
  vrchatMirrorUnlocked: false
};

function initPremiumSystem() {
  window.premiumState = {
    bijouUnlocked: false,
    bijouEnabled: false,
    vrchatMirrorUnlocked: false
  };
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      try {
        const save = JSON.parse(slotData);
        if (save.premiumState) {
          Object.assign(window.premiumState, save.premiumState);
        }
      } catch (e) {
        console.error('Error loading premium state from save slot:', e);
      }
    }
  } else {
    const savedPremiumState = localStorage.getItem('premiumState');
    if (savedPremiumState) {
      try {
        const parsed = JSON.parse(savedPremiumState);
        Object.assign(window.premiumState, parsed);
      } catch (e) {
        console.error('Error loading premium state:', e);
      }
    }
  }
  updatePremiumUI();
  addPremiumEventListeners();
  hookIntoTokenSpawning();
  addSpeechBubbleCSS();
  setTimeout(() => {
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    } else {
    }
    if (typeof updatePrismLabCharacterImage === 'function') {
      updatePrismLabCharacterImage();
    } else {
    }
    if (typeof updateHardModeQuestCharacterImage === 'function') {
      updateHardModeQuestCharacterImage();
    } else {
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    } else {
    }
  }, 200);
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
}

function savePremiumState() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      try {
        const save = JSON.parse(slotData);
        save.premiumState = window.premiumState;
        localStorage.setItem(`swariaSaveSlot${currentSaveSlot}`, JSON.stringify(save));
      } catch (e) {
        console.error('Error updating save slot with premium state:', e);
      }
    } else {
    }
  } else {
    localStorage.setItem('premiumState', JSON.stringify(window.premiumState));
  }
}

function updatePremiumUI() {
  document.querySelectorAll('.card').forEach(card => {
    const h3 = card.querySelector('h3');
    if (h3 && h3.textContent.trim() === 'Unlock Bijou') {
      const bijouButton = card.querySelector('button');
      if (bijouButton) {
        if (window.premiumState.bijouUnlocked) {
          bijouButton.textContent = 'Unlocked';
          bijouButton.disabled = true;
          bijouButton.style.backgroundColor = '#4CAF50';
          bijouButton.style.color = 'white';
        } else {
          bijouButton.textContent = 'Buy';
          bijouButton.disabled = false;
          bijouButton.style.backgroundColor = '';
          bijouButton.style.color = '';
        }
      }
    }
    if (h3 && h3.textContent.trim() === 'Unlock Vrchat mirror') {
      const vrchatButton = card.querySelector('button');
      if (vrchatButton) {
        if (window.premiumState.vrchatMirrorUnlocked) {
          vrchatButton.textContent = 'Unlocked';
          vrchatButton.disabled = true;
          vrchatButton.style.backgroundColor = '#4CAF50';
          vrchatButton.style.color = 'white';
        } else {
          vrchatButton.textContent = 'Buy';
          vrchatButton.disabled = false;
          vrchatButton.style.backgroundColor = '';
          vrchatButton.style.color = '';
        }
      }
    }
  });
  updateBijouToggleUI();
  updateBijouUIVisibility();
  addPremiumEventListeners();
}

function addPremiumEventListeners() {
  document.querySelectorAll('.card').forEach(card => {
    const h3 = card.querySelector('h3');
    if (h3 && h3.textContent.trim() === 'Unlock Bijou') {
      const bijouButton = card.querySelector('button');
      if (bijouButton) {
        bijouButton.removeEventListener('click', buyBijou);
        bijouButton.addEventListener('click', buyBijou);
      }
    }
    if (h3 && h3.textContent.trim() === 'Unlock Vrchat mirror') {
      const vrchatButton = card.querySelector('button');
      if (vrchatButton) {
        vrchatButton.removeEventListener('click', buyVrchatMirror);
        vrchatButton.addEventListener('click', buyVrchatMirror);
      }
    }
  });
}

function buyBijou() {
  const cost = 500;
  if (window.premiumState.bijouUnlocked) {
    return;
  }
  const currentSwabucks = (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0;
  if (currentSwabucks < cost) {
    alert(`You need ${cost} Swa Bucks to unlock Bijou!`);
    return;
  }
  if (confirm(`Are you sure you want to unlock Bijou for ${cost} Swa Bucks?`)) {
    window.state.swabucks = currentSwabucks - cost;
    window.premiumState.bijouUnlocked = true;
    window.premiumState.bijouEnabled = true; 
    savePremiumState();
    saveGame();
    updatePremiumUI();
    updateUI(); 
    updateBijouUIVisibility();
    if (typeof window.cafeteria?.refreshCharacterCards === 'function') {
      window.cafeteria.refreshCharacterCards();
    }
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
    if (typeof window.triggerBijouUnlockStory === 'function') {
      window.triggerBijouUnlockStory();
    }
  }
}

function buyVrchatMirror() {
  const cost = 5000;
  if (window.premiumState.vrchatMirrorUnlocked) {
    return;
  }
  const currentSwabucks = (window.state && typeof window.state.swabucks === 'number') ? window.state.swabucks : 0;
  if (currentSwabucks < cost) {
    alert(`You need ${cost} Swa Bucks to unlock VRChat Mirror!`);
    return;
  }
  if (confirm(`Are you sure you want to unlock VRChat Mirror for ${cost} Swa Bucks?`)) {
    window.state.swabucks = currentSwabucks - cost;
    window.premiumState.vrchatMirrorUnlocked = true;
    savePremiumState();
    saveGame();
    updatePremiumUI();
    updateUI(); 
  }
}

function toggleBijou() {
  if (!window.premiumState.bijouUnlocked) {
    alert('Bijou must be unlocked first!');
    const checkbox = document.getElementById('bijouToggleCheckbox');
    if (checkbox) {
      checkbox.checked = false;
    }
    return;
  }
  const checkbox = document.getElementById('bijouToggleCheckbox');
  if (checkbox) {
    window.premiumState.bijouEnabled = checkbox.checked;
  } else {
    window.premiumState.bijouEnabled = !window.premiumState.bijouEnabled;
  }
  savePremiumState();
  const status = window.premiumState.bijouEnabled ? 'enabled' : 'disabled';
  updateBijouUIVisibility();
  if (typeof window.cafeteria?.refreshCharacterCards === 'function') {
    window.cafeteria.refreshCharacterCards();
  }
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
}

function updateBijouToggleUI() {
  const checkbox = document.getElementById('bijouToggleCheckbox');
  if (window.premiumState.bijouUnlocked) {
    if (!checkbox) {
      addBijouToggleButton();
    }
  } else {
    if (checkbox) {
      checkbox.parentElement.remove();
    }
  }
  if (checkbox) {
    checkbox.checked = window.premiumState.bijouEnabled;
  }
}

function addBijouToggleButton() {
  if (document.getElementById('bijouToggleCheckbox')) {
    return;
  }
  const settingsCard = document.querySelector('#settingsSavesTab .card');
  if (settingsCard) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.marginTop = '1em';
    checkboxContainer.style.textAlign = 'center';
    checkboxContainer.style.borderTop = '1px solid #ddd';
    checkboxContainer.style.paddingTop = '1em';
    checkboxContainer.innerHTML = `
      <label style="display: flex; align-items: center; gap: 0.5em; justify-content: center;">
        <input type="checkbox" id="bijouToggleCheckbox" ${window.premiumState.bijouEnabled ? 'checked' : ''} onchange="toggleBijou()">
        <span>Enable Bijou</span>
      </label>
    `;
    settingsCard.appendChild(checkboxContainer);
  }
}

function isBijouActive() {
  return window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled;
}

function getBijouStatus() {
  return {
    unlocked: window.premiumState.bijouUnlocked,
    enabled: window.premiumState.bijouEnabled,
    active: isBijouActive()
  };
}

function resetPremiumState() {
  window.premiumState = {
    bijouUnlocked: false,
    bijouEnabled: false,
    vrchatMirrorUnlocked: false
  };
  updatePremiumUI();
}

function refreshPremiumState() {
  const currentSaveSlot = localStorage.getItem('currentSaveSlot');
  if (currentSaveSlot) {
    const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
    if (slotData) {
      try {
        const save = JSON.parse(slotData);
        if (save.premiumState) {
          Object.assign(window.premiumState, save.premiumState);
        } else {
          window.premiumState = {
            bijouUnlocked: false,
            bijouEnabled: false,
            vrchatMirrorUnlocked: false
          };
        }
      } catch (e) {
        console.error('Error loading premium state from save slot:', e);
        window.premiumState = {
          bijouUnlocked: false,
          bijouEnabled: false,
          vrchatMirrorUnlocked: false
        };
      }
    } else {
      window.premiumState = {
        bijouUnlocked: false,
        bijouEnabled: false,
        vrchatMirrorUnlocked: false
      };
    }
  } else {
    const savedPremiumState = localStorage.getItem('premiumState');
    if (savedPremiumState) {
      try {
        const parsed = JSON.parse(savedPremiumState);
        Object.assign(window.premiumState, parsed);
      } catch (e) {
        console.error('Error loading premium state from global localStorage:', e);
      }
    }
  }
  updatePremiumUI();
  updateBijouUIVisibility();
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
}

let bijouUIElement = null;
let bijouCollectionQueue = [];
let bijouIsCollecting = false;
let bijouTalkingOverlay = null;
let bijouSpeechBubble = null;
let bijouSpeechTimeout = null;
const bijouDialogues = [
  "Oh! A token! Let me get that for you~",
  "I'm such a helpful assistant, aren't I?",
  "Collecting tokens is my favorite pastime!",
  "Did you see that? I'm getting better at this!",
  "Sometimes I collect, sometimes I don't. It's all part of the fun!",
  "I hope you don't mind me helping out a little~",
  "These tokens are so sparkly and pretty!",
  "I'm getting quite good at this collection business!",
  "Oops! I missed that one. Maybe next time!",
  "I love being useful to you!",
  "Token collection is an art, you know!",
  "I'm your little helper, always ready to assist!",
  "Sometimes I'm lucky, sometimes I'm not. That's life!",
  "I wonder what kind of token that was...",
  "I'm getting faster at spotting these tokens!",
  "It's like a little treasure hunt every time!",
  "I hope I'm not being too greedy with the tokens~",
  "Every token I collect makes me feel accomplished!",
  "I'm learning to be more selective with my collection~",
  "The thrill of the chase is what makes it fun!",
  "Thats my token! I'll get it!",
  "Ever wonder where I got my magnet?",
];

function initBijouUI() {
  if (!window.premiumState.bijouUnlocked || !window.premiumState.bijouEnabled) {
    removeBijouUI();
    return;
  }
  if (!bijouUIElement) {
    bijouUIElement = document.createElement('div');
    bijouUIElement.id = 'bijouUI';
    bijouUIElement.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 0px;
      width: 300px;
      height: 300px;
      z-index: 1;
      pointer-events: auto;
      transition: transform 0.3s ease;
      cursor: pointer;
    `;
    const bijouImg = document.createElement('img');
    bijouImg.src = 'assets/icons/bijou.png';
    bijouImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
    `;
    bijouImg.id = 'bijouImage';
    bijouUIElement.appendChild(bijouImg);
    document.body.appendChild(bijouUIElement);
    bijouUIElement.addEventListener('click', triggerBijouDialogue);
  }
  bijouUIElement.style.display = 'block';
}

function removeBijouUI() {
  if (bijouUIElement) {
    bijouUIElement.style.display = 'none';
  }
  if (bijouTalkingOverlay) {
    bijouTalkingOverlay.remove();
    bijouTalkingOverlay = null;
  }
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
    bijouSpeechBubble = null;
  }
  if (bijouSpeechTimeout) {
    clearTimeout(bijouSpeechTimeout);
    bijouSpeechTimeout = null;
  }
}

function updateBijouUIVisibility() {
  if (window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled) {
    initBijouUI();
  } else {
    removeBijouUI();
  }
}

function checkBijouCollection(token) {
  if (!window.premiumState.bijouUnlocked || !window.premiumState.bijouEnabled) {
    return false;
  }
  if (token.dataset.bijouChecked === 'true') {
    return false;
  }
  token.dataset.bijouChecked = 'true';
  setTimeout(() => {
    if (token.dataset.collected === 'true') return; 
    const randomValue = Math.random();
    if (randomValue < 0.50) {
      bijouCollectToken(token);
    } else {
    }
  }, 1000);
}

function bijouCollectToken(token) {
  if (token.dataset.collected === 'true') return; 
  token.dataset.collected = 'true';
  bijouCollectionQueue.push(token);
  if (!bijouIsCollecting) {
    processBijouCollectionQueue();
  }
}

function processBijouCollectionQueue() {
  if (bijouCollectionQueue.length === 0) {
    bijouIsCollecting = false;
    return;
  }
  bijouIsCollecting = true;
  const token = bijouCollectionQueue.shift();
  if (!token || token.dataset.collected !== 'true') {
    processBijouCollectionQueue();
    return;
  }
  const bijouImg = document.getElementById('bijouImage');
  if (bijouImg) {
    bijouImg.src = 'assets/icons/bijou action.png';
  }
  const bijouRect = bijouUIElement ? bijouUIElement.getBoundingClientRect() : null;
  if (!bijouRect) {
    processBijouCollectionQueue();
    return;
  }
  const tokenRect = token.getBoundingClientRect();
  const startX = tokenRect.left + tokenRect.width / 2;
  const startY = tokenRect.top + tokenRect.height / 2;
  const endX = bijouRect.left + bijouRect.width / 2;
  const endY = bijouRect.top + bijouRect.height / 2;
  const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const duration = Math.max(500, Math.min(1500, distance * 2)); 
  token.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  token.style.zIndex = '1001'; 
  requestAnimationFrame(() => {
    token.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.3)`;
    token.style.opacity = '0.7';
  });
  setTimeout(() => {
    const tokenType = token.dataset.type;
    if (tokenType) {
      if (typeof window.collectIngredientToken === 'function') {
        window.collectIngredientToken(tokenType, token);
      } else if (typeof collectIngredientToken === 'function') {
        collectIngredientToken(tokenType, token);
      } else {
        collectTokenManually(tokenType, token);
      }
    } else {
      token.remove();
    }
    const bijouImg = document.getElementById('bijouImage');
    if (bijouImg) {
      bijouImg.src = 'assets/icons/bijou.png';
    }
    setTimeout(() => {
      processBijouCollectionQueue();
    }, 200); 
  }, duration);
}

function collectTokenManually(type, token) {
  token.style.transform += ' scale(0.2)';
  token.style.opacity = '0';
  setTimeout(() => token.remove(), 400);
  if (!window.kitchenIngredients) window.kitchenIngredients = {};
  if (type === 'swabucks') {
    if (!window.state) window.state = {};
    if (typeof window.state.swabucks !== 'number') window.state.swabucks = 0;
    window.state.swabucks += 1;
    if (typeof saveGame === 'function') saveGame();
    return;
  }
  window.kitchenIngredients[type] = (window.kitchenIngredients[type] || 0) + 1;
  showIngredientGainPopup(token);
  if (typeof updateKitchenUI === 'function') updateKitchenUI();
}

function showIngredientGainPopup(token) {
  const popup = document.createElement('div');
  popup.textContent = '+1';
  popup.className = 'ingredient-gain-popup';
  popup.style.position = 'fixed';
  popup.style.left = token.style.left;
  popup.style.top = token.style.top;
  popup.style.zIndex = 100000;
  popup.style.fontWeight = 'bold';
  popup.style.fontSize = '1.3em';
  popup.style.color = '#3cf';
  popup.style.pointerEvents = 'none';
  popup.style.transition = 'transform 0.7s cubic-bezier(.4,2,.6,1), opacity 0.7s';
  popup.style.transform = 'translateY(0)';
  popup.style.opacity = '1';
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.transform = 'translateY(-40px)';
    popup.style.opacity = '0';
  }, 10);
  setTimeout(() => popup.remove(), 800);
}

function hookIntoTokenSpawning() {
  const originalSpawnIngredientToken = window.spawnIngredientToken;
  if (originalSpawnIngredientToken) {
    window.spawnIngredientToken = function(context, sourceElement) {
      const result = originalSpawnIngredientToken.call(this, context, sourceElement);
      setTimeout(() => {
        const tokens = document.querySelectorAll('.ingredient-token');
        const latestToken = tokens[tokens.length - 1];
        if (latestToken && !latestToken.dataset.bijouChecked) {
          if (!latestToken.dataset.spawnTime) {
            latestToken.dataset.spawnTime = Date.now().toString();
          }
          checkBijouCollection(latestToken);
        }
      }, 100); 
      return result;
    };
  }
  if (typeof window.collectIngredientToken === 'undefined') {
    if (typeof collectIngredientToken === 'function') {
      window.collectIngredientToken = collectIngredientToken;
    }
  }
}

function triggerBijouDialogue() {
  if (bijouSpeechTimeout) {
    clearTimeout(bijouSpeechTimeout);
  }
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
    bijouSpeechBubble = null;
  }
  showBijouTalkingOverlay();
  const randomDialogue = bijouDialogues[Math.floor(Math.random() * bijouDialogues.length)];
  createBijouSpeechBubble(randomDialogue);
  bijouSpeechTimeout = setTimeout(() => {
    hideBijouTalkingOverlay();
    if (bijouSpeechBubble) {
      bijouSpeechBubble.remove();
      bijouSpeechBubble = null;
    }
  }, 5000);
}

function showBijouTalkingOverlay() {
  if (!bijouUIElement) return;
  if (bijouTalkingOverlay) {
    bijouTalkingOverlay.remove();
  }
  bijouTalkingOverlay = document.createElement('img');
  bijouTalkingOverlay.src = 'assets/icons/bijou talking.png';
  bijouTalkingOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  `;
  bijouUIElement.appendChild(bijouTalkingOverlay);
}

function hideBijouTalkingOverlay() {
  if (bijouTalkingOverlay) {
    bijouTalkingOverlay.remove();
    bijouTalkingOverlay = null;
  }
}

function createBijouSpeechBubble(text) {
  if (!bijouUIElement) return;
  if (bijouSpeechBubble) {
    bijouSpeechBubble.remove();
  }
  bijouSpeechBubble = document.createElement('div');
  bijouSpeechBubble.style.cssText = `
    position: fixed;
    bottom: 320px;
    right: 160px;
    max-width: 250px;
    background: white;
    border-radius: 15px;
    padding: 10px 15px;
    font-size: 14px;
    line-height: 1.4;
    color: #333;
    z-index: 1001;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    word-wrap: break-word;
    animation: speechBubbleAppear 0.3s ease-out;
  `;
  const arrow = document.createElement('div');
  arrow.style.cssText = `
    position: absolute;
    bottom: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid white;
  `;
  const arrowBorder = document.createElement('div');
  arrowBorder.style.cssText = `
    position: absolute;
    bottom: -12px;
    right: 18px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid #333;
    z-index: -1;
  `;
  bijouSpeechBubble.appendChild(arrowBorder);
  bijouSpeechBubble.appendChild(arrow);
  bijouSpeechBubble.appendChild(document.createTextNode(text));
  document.body.appendChild(bijouSpeechBubble);
}

function addSpeechBubbleCSS() {
  if (document.getElementById('bijouSpeechBubbleCSS')) return;
  const style = document.createElement('style');
  style.id = 'bijouSpeechBubbleCSS';
  style.textContent = `
    @keyframes speechBubbleAppear {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initPremiumSystem, 100);
});
window.premiumSystem = {
  initPremiumSystem,
  savePremiumState,
  updatePremiumUI,
  buyBijou,
  buyVrchatMirror,
  toggleBijou,
  isBijouActive,
  getBijouStatus,
  resetPremiumState,
  refreshPremiumState,
  updateBijouUIVisibility,
  initBijouUI,
  removeBijouUI,
  checkBijouCollection,
  bijouCollectToken,
  processBijouCollectionQueue,
  hookIntoTokenSpawning,
  collectTokenManually,
  showIngredientGainPopup,
  triggerBijouDialogue,
  showBijouTalkingOverlay,
  hideBijouTalkingOverlay,
  createBijouSpeechBubble,
  addSpeechBubbleCSS
};
