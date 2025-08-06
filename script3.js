// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file
















































let boostDisplayCard = null;
let boostDisplayInterval = null;
let intercomSpeechBubble = null;
let intercomEventTriggered = false;
let intercomEvent20Triggered = false;

function initializeBoostDisplay() {
    createBoostDisplayCard();
    startBoostDisplayUpdate();
    registerDayNightCallback();
    initializeIntercomSystem();
}

function initializeIntercomSystem() {
    createIntercomSpeechBubble();
    loadIntercomState();
}

function createIntercomSpeechBubble() {
    if (intercomSpeechBubble) {
        intercomSpeechBubble.remove();
    }
    intercomSpeechBubble = document.createElement('div');
    intercomSpeechBubble.id = 'intercomSpeechBubble';
    intercomSpeechBubble.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        background: white;
        color: black;
        font-family: 'Arial', sans-serif;
        font-size: 1.1em;
        font-weight: bold;
        padding: 1em 1.5em;
        max-width: 600px;
        text-align: center;
        display: none;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        border: 3px solid black;
        clip-path: polygon(
            0% 15px, 15px 0%, calc(100% - 15px) 0%, 100% 15px,
            100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0% calc(100% - 15px)
        );
    `;
    const arrow = document.createElement('div');
    arrow.setAttribute('data-arrow', 'true');
    arrow.style.cssText = `
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid white;
        z-index: 10001;
    `;
    const arrowBorder = document.createElement('div');
    arrowBorder.setAttribute('data-arrow-border', 'true');
    arrowBorder.style.cssText = `
        position: absolute;
        top: -18px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-bottom: 18px solid black;
        z-index: 10000;
    `;
    intercomSpeechBubble.appendChild(arrowBorder);
    intercomSpeechBubble.appendChild(arrow);
    document.body.appendChild(intercomSpeechBubble);
}

function formatIntercomMessage(text) {
    const broadcastEffects = ['BZZT', 'CRRRK', '*static*'];
    const fragment = document.createDocumentFragment();
    const allMatches = [];
    broadcastEffects.forEach(effect => {
        const regex = new RegExp(`(${effect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const matches = [...text.matchAll(regex)];
        matches.forEach(match => {
            allMatches.push({
                text: match[0],
                index: match.index,
                length: match[0].length
            });
        });
    });
    allMatches.sort((a, b) => a.index - b.index);
    let lastIndex = 0;
    allMatches.forEach(match => {
        if (match.index > lastIndex) {
            const beforeText = text.substring(lastIndex, match.index);
            fragment.appendChild(document.createTextNode(beforeText));
        }
        const effectSpan = document.createElement('span');
        effectSpan.style.fontStyle = 'italic';
        effectSpan.textContent = match.text;
        fragment.appendChild(effectSpan);
        lastIndex = match.index + match.length;
    });
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
    if (fragment.childNodes.length === 0) {
        const textNode = document.createTextNode(text);
        fragment.appendChild(textNode);
    }
    return fragment;
}

function showIntercomSpeechBubble(text, duration = 10000) {
    if (!intercomSpeechBubble) {
        createIntercomSpeechBubble();
    }
    const arrowBorder = intercomSpeechBubble.querySelector('[data-arrow-border]');
    const arrow = intercomSpeechBubble.querySelector('[data-arrow]');
    intercomSpeechBubble.innerHTML = '';
    const formattedText = formatIntercomMessage(text);
    intercomSpeechBubble.appendChild(formattedText);
    if (arrowBorder) {
        intercomSpeechBubble.appendChild(arrowBorder);
    } else {
        const newArrowBorder = document.createElement('div');
        newArrowBorder.setAttribute('data-arrow-border', 'true');
        newArrowBorder.style.cssText = `
            position: absolute;
            top: -18px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 18px solid transparent;
            border-right: 18px solid transparent;
            border-bottom: 18px solid black;
            z-index: 10000;
        `;
        intercomSpeechBubble.appendChild(newArrowBorder);
    }
    if (arrow) {
        intercomSpeechBubble.appendChild(arrow);
    } else {
        const newArrow = document.createElement('div');
        newArrow.setAttribute('data-arrow', 'true');
        newArrow.style.cssText = `
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 15px solid white;
            z-index: 10001;
        `;
        intercomSpeechBubble.appendChild(newArrow);
    }
    intercomSpeechBubble.style.display = 'block';
    setTimeout(() => {
        intercomSpeechBubble.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        intercomSpeechBubble.style.opacity = '0';
        setTimeout(() => {
            intercomSpeechBubble.style.display = 'none';
        }, 500);
    }, duration);
}

function triggerElement10IntercomEvent() {
    if (intercomEventTriggered) return;
    intercomEventTriggered = true;
    saveIntercomState();
    const message = "BZZT... These elements you're discovering... CRRRK... I've never heard or seen any of these elements, but their effects are... interesting. Keep it up Peachy. *static*";
    showIntercomSpeechBubble(message, 10000);
}

function triggerElement20IntercomEvent() {
    if (intercomEvent20Triggered) return;
    intercomEvent20Triggered = true;
    saveIntercomState();
    const message = "CRRRK... These 'elements' you're discovering are not normal... BZZT... I'm seeing increasing effects to the core with every new 'elements' discovered, but for now, continue on with your research. *static*";
    showIntercomSpeechBubble(message, 10000);
}

function saveIntercomState() {
    const intercomState = {
        intercomEventTriggered: intercomEventTriggered,
        intercomEvent20Triggered: intercomEvent20Triggered
    };
    const currentSaveSlot = localStorage.getItem('currentSaveSlot');
    if (currentSaveSlot) {
        const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
        const save = slotData ? JSON.parse(slotData) : {};
        save.intercomState = intercomState;
        localStorage.setItem(`swariaSaveSlot${currentSaveSlot}`, JSON.stringify(save));
    } else {
        const mainSave = localStorage.getItem('swariaSave');
        const save = mainSave ? JSON.parse(mainSave) : {};
        save.intercomState = intercomState;
        localStorage.setItem('swariaSave', JSON.stringify(save));
    }
}

function loadIntercomState() {
    const currentSaveSlot = localStorage.getItem('currentSaveSlot');
    let save;
    if (currentSaveSlot) {
        const slotData = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
        save = slotData ? JSON.parse(slotData) : {};
    } else {
        const mainSave = localStorage.getItem('swariaSave');
        save = mainSave ? JSON.parse(mainSave) : {};
    }
    if (save.intercomState) {
        intercomEventTriggered = save.intercomState.intercomEventTriggered || false;
        intercomEvent20Triggered = save.intercomState.intercomEvent20Triggered || false;
    }
}

window.triggerElement10IntercomEvent = triggerElement10IntercomEvent;
window.triggerElement20IntercomEvent = triggerElement20IntercomEvent;
window.saveIntercomState = saveIntercomState;
window.loadIntercomState = loadIntercomState;
window.showIntercomSpeechBubble = showIntercomSpeechBubble;
window.testIntercomEvent = function() {
    showIntercomSpeechBubble("BZZT... These elements you're discovering... CRRRK... I've never heard or seen any of these elements, but their effects are... interesting. Keep it up Peachy. *static*", 10000);
};
window.testIntercomEvent20 = function() {
    showIntercomSpeechBubble("CRRRK... These 'elements' you're discovering are not normal... BZZT... I'm seeing increasing effects to the core with every new 'elements' discovered, but for now, continue on with your research. *static*", 10000);
};

function createBoostDisplayCard() {
    if (boostDisplayCard) {
        boostDisplayCard.remove();
    }
    boostDisplayCard = document.createElement('div');
    boostDisplayCard.id = 'boostDisplayCard';
    boostDisplayCard.style.cssText = `
        position: fixed;
        top: 90px;
        right: 24px;
        left: auto;
        z-index: 2001;
        background: linear-gradient(135deg, #2a2a2a, #444);
        color: #ffe066;
        font-family: 'Orbitron', monospace;
        font-size: 0.9em;
        padding: 0.8em 1em;
        border-radius: 8px 8px 14px 14px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        border: 2px solid #ffe066;
        min-width: 120px;
        max-width: 200px;
        display: none;
        flex-direction: column;
        gap: 0.3em;
    `;
    const powerContainer = document.getElementById('powerEnergyStatus');
    if (powerContainer && powerContainer.parentNode) {
        powerContainer.parentNode.insertBefore(boostDisplayCard, powerContainer.nextSibling);
    }
}

let lastBoostDisplayContent = '';
let boostElementsCache = new Map();

function updateBoostDisplay() {
    if (!boostDisplayCard) {
        createBoostDisplayCard();
    }
    const activeBoosts = getActiveBoosts();
    if (activeBoosts.length === 0) {
        if (boostDisplayCard.style.display !== 'none') {
            boostDisplayCard.style.display = 'none';
            lastBoostDisplayContent = '';
        }
        return;
    }
    const currentContent = JSON.stringify(activeBoosts);
    if (currentContent === lastBoostDisplayContent) {
        return; 
    }
    lastBoostDisplayContent = currentContent;
    const fragment = document.createDocumentFragment();
    let titleElement = boostElementsCache.get('title');
    if (!titleElement) {
        titleElement = document.createElement('div');
        titleElement.style.cssText = `
            font-weight: bold;
            font-size: 0.95em;
            margin-bottom: 0.2em;
            text-align: center;
            border-bottom: 1px solid #ffe066;
            padding-bottom: 0.2em;
        `;
        titleElement.textContent = 'Active Boosts';
        boostElementsCache.set('title', titleElement);
    }
    fragment.appendChild(titleElement.cloneNode(true));
    activeBoosts.forEach((boost, index) => {
        let boostLine = boostElementsCache.get(`boost-${index}`);
        if (!boostLine) {
            boostLine = document.createElement('div');
            boostLine.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.85em;
                padding: 0.1em 0;
            `;
            const nameSpan = document.createElement('span');
            const timerSpan = document.createElement('span');
            timerSpan.style.fontWeight = 'bold';
            boostLine.appendChild(nameSpan);
            boostLine.appendChild(timerSpan);
            boostElementsCache.set(`boost-${index}`, boostLine);
        }
        const clonedLine = boostLine.cloneNode(true);
        const nameSpan = clonedLine.children[0];
        const timerSpan = clonedLine.children[1];
        nameSpan.textContent = boost.name;
        nameSpan.style.color = boost.color || '#ffe066';
        timerSpan.textContent = boost.timer;
        fragment.appendChild(clonedLine);
    });
    boostDisplayCard.innerHTML = '';
    boostDisplayCard.appendChild(fragment);
    boostDisplayCard.style.display = 'flex';
}

function getActiveBoosts() {
    const boosts = [];
    if (window.state && window.state.peachyHungerBoost && window.state.peachyHungerBoost > 0) {
        const secondsRemaining = Math.ceil(window.state.peachyHungerBoost / 1000);
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        boosts.push({
            name: 'Peachy',
            timer: timerText,
            color: '#ffb347' 
        });
    }
           if (window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0) {
               const secondsRemaining = Math.ceil(window.state.soapBatteryBoost / 1000);
               const minutes = Math.floor(secondsRemaining / 60);
               const seconds = secondsRemaining % 60;
               const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
               const isNight = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
                   const mins = window.daynight.getTime();
                   return (mins >= 22 * 60 && mins < 24 * 60) || (mins >= 0 && mins < 6 * 60);
               })();
                               boosts.push({
                    name: 'Soap',
                    timer: isNight ? 'Paused' : timerText,
                    color: isNight ? '#95a5a6' : '#f1c40f' 
                });
           }
    if (window.state && window.state.mysticCookingSpeedBoost && window.state.mysticCookingSpeedBoost > 0) {
        const secondsRemaining = Math.ceil(window.state.mysticCookingSpeedBoost / 1000);
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        boosts.push({
            name: 'Mystic',
            timer: timerText,
            color: '#9b59b6' 
        });
    }
    if (window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0) {
        const secondsRemaining = Math.ceil(window.state.fluzzerGlitteringPetalsBoost / 1000);
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        boosts.push({
            name: 'Fluzzer',
            timer: timerText,
            color: '#e91e63' 
        });
    }
    return boosts;
}

function startBoostDisplayUpdate() {
    if (boostDisplayInterval) {
        clearInterval(boostDisplayInterval);
    }
    updateBoostDisplay();
    if (window.gameOptimization && window.gameOptimization.isOptimized) {
        return;
    }
    boostDisplayInterval = setInterval(updateBoostDisplay, 1000);
}

function stopBoostDisplayUpdate() {
    if (boostDisplayInterval) {
        clearInterval(boostDisplayInterval);
        boostDisplayInterval = null;
    }
}

function showBoostNotification(message, color = "#3498db") {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

function registerDayNightCallback() {
  if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
    let lastNightState = null;
    window.daynight.onTimeChange(function(mins) {
      const isNight = (mins >= 22 * 60 && mins < 24 * 60) || (mins >= 0 && mins < 6 * 60);
      if (lastNightState !== null && lastNightState !== isNight && 
          window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0) {
        if (isNight) {
        } else {
        }
      }
      lastNightState = isNight;
    });
  }
}

window.updateBoostDisplay = updateBoostDisplay;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBoostDisplay);
} else {
    initializeBoostDisplay();
}
setTimeout(initializeBoostDisplay, 1000);
window.testBoostDisplay = function() {
  if (!window.state) window.state = {};
  window.state.mysticCookingSpeedBoost = 60000; 
  window.state.fluzzerGlitteringPetalsBoost = 120000; 
  window.state.peachyHungerBoost = 180000; 
  updateBoostDisplay();
};
