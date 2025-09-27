// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file
// Script3 is a continuation of script2.js

// --- DELIVER BUTTON COOLDOWN SYSTEM ---
let deliverButtonCooldown = {
    isActive: false,
    remainingTime: 0,
    interval: null
};

// Make deliverButtonCooldown globally accessible
window.deliverButtonCooldown = deliverButtonCooldown;

function initializeDeliverButtonCooldown() {
    // Check for existing cooldown from localStorage
    checkExistingCooldown();
    
    // Override the resetGame function to add cooldown
    if (typeof window.resetGame === 'function') {
        const originalResetGame = window.resetGame;
        
        window.resetGame = function() {
            // Check if cooldown is active
            if (deliverButtonCooldown.isActive) {

                return;
            }
            
            // Check if requirements are met (50 artifacts)
            if (state.artifacts.lt(50)) {
                return;
            }
            
            // Store cooldown start time in localStorage before page reload
            const cooldownEndTime = Date.now() + 10000; // 10 seconds from now
            localStorage.setItem('deliverCooldownEnd', cooldownEndTime.toString());

            // Execute original reset game function (this will reload the page)
            originalResetGame.apply(this, arguments);
        };
    }
    
    // Initialize cooldown styling
    injectDeliverCooldownCSS();
    
    // Start monitoring the deliver button
    window.deliverButtonStateInterval = setInterval(updateDeliverButtonState, 100);
}

function checkExistingCooldown() {
    const cooldownEndTime = localStorage.getItem('deliverCooldownEnd');
    if (cooldownEndTime) {
        const endTime = parseInt(cooldownEndTime);
        const currentTime = Date.now();
        const remainingTime = Math.ceil((endTime - currentTime) / 1000);

        if (remainingTime > 0) {
            // Cooldown is still active
            deliverButtonCooldown.isActive = true;
            deliverButtonCooldown.remainingTime = remainingTime;
            startCooldownTimer();

        } else {
            // Cooldown has expired, clear it
            localStorage.removeItem('deliverCooldownEnd');

        }
    }
}

function startCooldownTimer() {
    // Clear any existing interval
    if (deliverButtonCooldown.interval) {
        clearInterval(deliverButtonCooldown.interval);
    }
    
    // Update button appearance immediately
    updateDeliverButtonAppearance();
    
    // Start countdown interval
    deliverButtonCooldown.interval = setInterval(() => {
        deliverButtonCooldown.remainingTime--;
        
        if (deliverButtonCooldown.remainingTime <= 0) {
            endDeliverCooldown();
        } else {
            updateDeliverButtonAppearance();
        }
    }, 1000);
}

function endDeliverCooldown() {
    deliverButtonCooldown.isActive = false;
    deliverButtonCooldown.remainingTime = 0;
    
    if (deliverButtonCooldown.interval) {
        clearInterval(deliverButtonCooldown.interval);
        deliverButtonCooldown.interval = null;
    }
    
    // Clear from localStorage
    localStorage.removeItem('deliverCooldownEnd');

    updateDeliverButtonAppearance();
}

function updateDeliverButtonState() {
    const resetBtn = document.getElementById('resetBtn');
    if (!resetBtn) return;
    
    updateDeliverButtonAppearance();
}

function updateDeliverButtonAppearance() {
    const resetBtn = document.getElementById('resetBtn');
    if (!resetBtn) return;
    
    if (deliverButtonCooldown.isActive) {
        // Apply cooldown styling
        resetBtn.classList.add('deliver-cooldown');
        resetBtn.textContent = `Deliver your cargo to the Swa elites (${deliverButtonCooldown.remainingTime}s)`;
        resetBtn.style.cursor = 'not-allowed';
    } else {
        // Remove cooldown styling
        resetBtn.classList.remove('deliver-cooldown');
        resetBtn.textContent = 'Deliver your cargo to the Swa elites';
        resetBtn.style.cursor = 'pointer';
    }
}

function injectDeliverCooldownCSS() {
    if (document.getElementById('deliverCooldownCSS')) return;
    
    const style = document.createElement('style');
    style.id = 'deliverCooldownCSS';
    style.textContent = `
        #resetBtn.deliver-cooldown {
            background: #666 !important;
            color: #999 !important;
            border-color: #555 !important;
            opacity: 0.6;
            cursor: not-allowed !important;
            pointer-events: none;
            box-shadow: none !important;
            transform: none !important;
        }
        
        #resetBtn.deliver-cooldown:hover {
            background: #666 !important;
            color: #999 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

// --- END DELIVER BUTTON COOLDOWN SYSTEM ---











































let boostDisplayCard = null;
let boostDisplayInterval = null;
let intercomSpeechBubble = null;
let intercomEventTriggered = false;
let intercomEvent20Triggered = false;

// Make boost and intercom variables globally accessible
window.boostDisplayCard = boostDisplayCard;
window.boostDisplayInterval = boostDisplayInterval;
window.intercomSpeechBubble = intercomSpeechBubble;
window.intercomEventTriggered = intercomEventTriggered;
window.intercomEvent20Triggered = intercomEvent20Triggered;

// Timeout tracking for script3.js
window.script3Timeouts = window.script3Timeouts || [];
window.script3SpeedUpIntervals = window.script3SpeedUpIntervals || [];

// Helper function to track timeouts for script3
window.script3TrackedSetTimeout = function(callback, delay) {
    const timeoutId = setTimeout(callback, delay);
    window.script3Timeouts.push(timeoutId);
    return timeoutId;
};

function initializeBoostDisplay() {
    createBoostDisplayCard();
    startBoostDisplayUpdate();
    registerDayNightCallback();
    initializeIntercomSystem();
}

function initializeIntercomSystem() {
    createIntercomSpeechBubble();
    // Intercom state is now managed by main save system - no separate loading needed
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
    window.script3TrackedSetTimeout(() => {
        intercomSpeechBubble.style.opacity = '1';
    }, 100);
    window.script3TrackedSetTimeout(() => {
        intercomSpeechBubble.style.opacity = '0';
        window.script3TrackedSetTimeout(() => {
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

// Save/load functions removed - intercom state now managed by main save system
// Data is automatically saved/loaded through window.state

window.triggerElement10IntercomEvent = triggerElement10IntercomEvent;
window.triggerElement20IntercomEvent = triggerElement20IntercomEvent;
// Save/load functions removed - now managed by main save system
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
    
    // Wait for anomaly detector button to be properly sized before creating boost display
    const waitForAnomalyDetector = () => {
        const anomalyDetectorBtn = document.getElementById('anomalyDetectorBtn');
        if (anomalyDetectorBtn && anomalyDetectorBtn.offsetWidth > 0) {
            // Create with the correct width immediately
            const buttonWidth = anomalyDetectorBtn.offsetWidth;
            
            boostDisplayCard = document.createElement('div');
            boostDisplayCard.id = 'boostDisplayCard';
            boostDisplayCard.style.cssText = `
                position: fixed;
                top: 143px;
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
                width: ${buttonWidth}px;
                max-width: ${buttonWidth}px;
                min-width: 200px;
                display: none;
                flex-direction: column;
                gap: 0.3em;
                box-sizing: border-box;
            `;
            
            const powerContainer = document.getElementById('powerEnergyStatus');
            if (powerContainer && powerContainer.parentNode) {
                powerContainer.parentNode.insertBefore(boostDisplayCard, powerContainer.nextSibling);
            }
        } else {
            // If anomaly detector isn't ready, try again soon
            setTimeout(waitForAnomalyDetector, 50);
        }
    };
    
    waitForAnomalyDetector();
}

function matchAnomalyDetectorWidth() {
    if (!boostDisplayCard) return;
    
    const anomalyDetectorBtn = document.getElementById('anomalyDetectorBtn');
    if (anomalyDetectorBtn && anomalyDetectorBtn.offsetWidth > 0) {
        const buttonWidth = anomalyDetectorBtn.offsetWidth;
        const currentWidth = parseInt(boostDisplayCard.style.width) || 0;
        
        // Only update if there's a meaningful difference
        if (Math.abs(currentWidth - buttonWidth) > 2) {
            boostDisplayCard.style.width = buttonWidth + 'px';
            boostDisplayCard.style.maxWidth = buttonWidth + 'px';
        }
    }
}

// Make it globally available
window.matchAnomalyDetectorWidth = matchAnomalyDetectorWidth;

let lastBoostDisplayContent = '';
let boostElementsCache = new Map();

function updateBoostDisplay() {
    if (!boostDisplayCard) {
        createBoostDisplayCard();
        return; // Exit early to let the creation process complete
    }
    
    const activeBoosts = getActiveBoosts();
    if (activeBoosts.length === 0) {
        if (boostDisplayCard.style.display !== 'none') {
            boostDisplayCard.style.display = 'none';
            lastBoostDisplayContent = '';
        }
        return;
    }
    
    // Only match width occasionally, not every update
    if (!lastBoostDisplayContent) {
        matchAnomalyDetectorWidth();
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

// --- SLEEP BUTTON AND NIGHT SKIP ANIMATION ---
function createSleepButtonIfNeeded() {
    let sleepBtn = document.getElementById('sleepBtn');
    const digitalClock = document.getElementById('digitalClock');
    if (!digitalClock) return;
    const inventoryBtn = document.getElementById('inventoryBtn');
    if (!inventoryBtn) return;
    const mins = window.daynight && typeof window.daynight.getTime === 'function' ? window.daynight.getTime() : 0;
    
    // Sleep button should only appear between 22:00 and 6:00
    const isValidSleepTime = (mins >= 22 * 60 && mins < 24 * 60) || (mins >= 0 && mins < 6 * 60);
    
    // Check if any clock anomalies are active
    const hasClockAnomaly = window.anomalySystem && 
        (window.anomalySystem.activeAnomalies.clockAnomaly || 
         window.anomalySystem.activeAnomalies.backwardClockAnomaly);
    
    if (isValidSleepTime) {
        if (!sleepBtn) {
            sleepBtn = document.createElement('button');
            sleepBtn.id = 'sleepBtn';
            sleepBtn.textContent = 'Sleep';
            sleepBtn.style.marginTop = '8px';
            sleepBtn.style.padding = '0.5em 1.2em';
            sleepBtn.style.fontSize = '1.1em';
            sleepBtn.style.background = 'linear-gradient(90deg,#222,#444)';
            sleepBtn.style.color = '#ffe066';
            sleepBtn.style.border = '2px solid #ffe066';
            sleepBtn.style.borderRadius = '8px 8px 14px 14px';
            sleepBtn.style.boxShadow = '0 2px 8px #0004';
            sleepBtn.style.cursor = 'pointer';
            sleepBtn.style.fontFamily = "'Orbitron',monospace";
            sleepBtn.style.fontWeight = 'bold';
            sleepBtn.onclick = startSleepSequence;
            inventoryBtn.parentNode.insertBefore(sleepBtn, inventoryBtn.nextSibling);
        }
        
        // Update sleep button state based on clock anomalies
        if (hasClockAnomaly) {
            sleepBtn.classList.add('sleep-disabled');
            sleepBtn.title = 'Cannot sleep while time anomalies are active';
        } else {
            sleepBtn.classList.remove('sleep-disabled');
            sleepBtn.title = '';
        }
        
        sleepBtn.style.display = '';
    } else {
        if (sleepBtn) sleepBtn.style.display = 'none';
    }
}

function startSleepSequence() {

    // Check if any clock anomalies are active
    const hasClockAnomaly = window.anomalySystem && 
        (window.anomalySystem.activeAnomalies.clockAnomaly || 
         window.anomalySystem.activeAnomalies.backwardClockAnomaly);
    
    if (hasClockAnomaly) {

        showBoostNotification('Cannot sleep while time anomalies are active!', '#ff6b6b');
        return;
    }
    
    const blackout = document.getElementById('blackoutOverlay');
    const digitalClock = document.getElementById('digitalClock');
    if (!blackout || !digitalClock) {

        return;
    }
    
    // Check if we're in valid sleep time (22:00 - 6:00)
    const mins = window.daynight && typeof window.daynight.getTime === 'function' ? window.daynight.getTime() : 0;
    const isValidSleepTime = (mins >= 22 * 60 && mins < 24 * 60) || (mins >= 0 && mins < 6 * 60);
    
    if (!isValidSleepTime) {

        return;
    }

    // Store original clock position
    const originalParent = digitalClock.parentNode;
    const nextSibling = digitalClock.nextSibling;
    
    // Start fade to black
    blackout.style.transition = 'opacity 0.7s';
    blackout.style.opacity = '0';
    blackout.style.display = 'block';
    
    // Move digitalClock into blackoutOverlay for proper z-index stacking
    blackout.appendChild(digitalClock);
    
    setTimeout(() => {

        blackout.style.opacity = '1';
        
        // After fade to black, move clock to center and start animation
        setTimeout(() => {

            digitalClock.classList.add('sleep-center');
            
            // Start the time speed up animation
            speedUpTimeToMorning(() => {

                // After time skip, pause briefly then move clock back and fade out
                setTimeout(() => {

                    digitalClock.classList.remove('sleep-center');
                    
                    setTimeout(() => {
                        blackout.style.opacity = '0';
                        
                        setTimeout(() => {

                            // Move digitalClock back to original parent
                            if (nextSibling && nextSibling.parentNode === originalParent) {
                                originalParent.insertBefore(digitalClock, nextSibling);
                            } else {
                                originalParent.appendChild(digitalClock);
                            }
                            blackout.style.display = 'none';
                        }, 700);
                    }, 500); // Brief pause after removing center class
                }, 800); // Pause to show final time
            });
        }, 800);
    }, 50);
}

function speedUpTimeToMorning(onDone) {
    // Speed up time from current time until 6:00 AM or later
    if (!window.daynight || typeof window.daynight.getTime !== 'function' || typeof window.daynight.setTime !== 'function') {

        if (onDone) onDone();
        return;
    }
    
    let mins = window.daynight.getTime();
    const startTime = mins;

    // Only allow speed up between 22:00 and 6:00
    const isValidTimeForSleep = (mins >= 22 * 60 && mins < 24 * 60) || (mins >= 0 && mins < 6 * 60);
    if (!isValidTimeForSleep) {

        if (onDone) onDone();
        return;
    }
    
    // If already at or past 6:00 during day, just finish
    if (mins >= 6 * 60 && mins < 22 * 60) {

        if (onDone) onDone();
        return;
    }
    
    const interval = setInterval(() => {
        const oldMins = mins;
        mins = (mins + 10) % (24 * 60);
        
        window.daynight.setTime(mins);
        
        // Force update the digital clock display
        if (typeof updateDigitalClock === 'function') {
            updateDigitalClock();
        } else if (window.daynight && typeof window.daynight.getTimeString === 'function') {
            const clock = document.getElementById('digitalClock');
            if (clock) {
                clock.textContent = window.daynight.getTimeString();
            }
        }

        // Stop when we reach 6:00 or later (but before 22:00)
        if (mins >= 6 * 60 && mins < 22 * 60) {

            clearInterval(interval);
            // Remove from tracking array
            const index = window.script3SpeedUpIntervals.indexOf(interval);
            if (index > -1) {
                window.script3SpeedUpIntervals.splice(index, 1);
            }
            if (onDone) onDone();
            return;
        }

    }, 50); // Slightly slower animation for better visibility
    
    // Track the interval for cleanup
    window.script3SpeedUpIntervals.push(interval);
}

// Add CSS for sleep-center and button animation
function injectSleepCSS() {
    if (document.getElementById('sleepCSS')) return;
    const style = document.createElement('style');
    style.id = 'sleepCSS';
        style.textContent = `
            #digitalClock.sleep-center {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                right: auto !important;
                transform: translate(-50%, -50%) scale(2) !important;
                z-index: 2147483648 !important; /* higher than blackoutOverlay */
                box-shadow: 0 0 32px #000a, 0 0 0 8px #ffe06699;
                transition: top 0.8s ease-in-out, left 0.8s ease-in-out, transform 0.8s ease-in-out, box-shadow 0.8s ease-in-out;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(5px);
                border-radius: 12px;
                padding: 20px 30px;
            }
            #sleepBtn {
                animation: sleepBtnPulse 1.5s infinite alternate;
                transition: all 0.3s ease;
            }
            #sleepBtn.sleep-disabled {
                background: #444 !important;
                color: #888 !important;
                border-color: #666 !important;
                cursor: not-allowed !important;
                opacity: 0.6;
                animation: none !important;
                box-shadow: none !important;
                pointer-events: none;
            }
            #sleepBtn.sleep-disabled:hover {
                background: #444 !important;
                color: #888 !important;
                transform: none !important;
            }
            @keyframes sleepBtnPulse {
                0% { box-shadow: 0 0 0 0 #ffe06644; }
                100% { box-shadow: 0 0 12px 4px #ffe06699; }
            }
        `;
    document.head.appendChild(style);
}

// Observe time and update sleep button
function observeSleepButton() {
    if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
        window.daynight.onTimeChange(createSleepButtonIfNeeded);
    }
    window.createSleepButtonInterval = setInterval(createSleepButtonIfNeeded, 2000);
}

if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeBoostDisplay();
            injectSleepCSS();
            observeSleepButton();
            initializeDeliverButtonCooldown();
            window.script3TrackedSetTimeout(createSleepButtonIfNeeded, 1200);
            initializeElementUnlockSystem();
        });
} else {
        initializeBoostDisplay();
        injectSleepCSS();
        observeSleepButton();
        initializeDeliverButtonCooldown();
        window.script3TrackedSetTimeout(createSleepButtonIfNeeded, 1200);
        initializeElementUnlockSystem();
}
window.script3TrackedSetTimeout(initializeBoostDisplay, 1000);
window.script3TrackedSetTimeout(initializeDeliverButtonCooldown, 1500);
window.script3TrackedSetTimeout(initializeFreeGiftModal, 2000);
window.testBoostDisplay = function() {
    if (!window.state) window.state = {};
    window.state.mysticCookingSpeedBoost = 60000; 
    window.state.fluzzerGlitteringPetalsBoost = 120000; 
    window.state.peachyHungerBoost = 180000; 
    updateBoostDisplay();
};

// --- PROGRESSIVE ELEMENT UNLOCKING SYSTEM ---
// This system unlocks elements progressively based on expansion level
const ELEMENT_UNLOCK_CONFIG = {
    1: { maxElements: 8, description: "Starting elements (1-8)" },        // Start: 8 elements
    2: { maxElements: 10, description: "Expansion 2: +2 elements (9-10)" }, // +2 = 10 total
    3: { maxElements: 14, description: "Expansion 3: +4 elements (11-14)" }, // +4 = 14 total
    4: { maxElements: 16, description: "Expansion 4: +2 elements (15-16)" }, // +2 = 16 total
    5: { maxElements: 19, description: "Expansion 5: +3 elements (17-19)" }, // +3 = 19 total
    6: { maxElements: 23, description: "Expansion 6: +4 elements (20-23)" }, // +4 = 23 total
    7: { maxElements: 24, description: "Expansion 7: +1 element (24)" },    // +1 = 24 total
    // Future expansions can be added here
    8: { maxElements: 118, description: "Expansion 8+: All elements unlocked" }
};

// Track element discovery for persistent visibility across infinity resets
function trackElementDiscovery() {
    // Safety check - make sure window.state exists
    if (!window || !window.state) {

        return;
    }
    
    try {
        // Get base max unlocked elements (WITHOUT infinity bonuses to avoid inflating discovery)
        let baseMaxUnlocked;
        try {
            baseMaxUnlocked = getMaxUnlockedElements();
        } catch (error) {

            baseMaxUnlocked = 8; // Safe fallback
        }
        
        // Ensure we have a valid number
        if (typeof baseMaxUnlocked !== 'number' || isNaN(baseMaxUnlocked)) {

            baseMaxUnlocked = 8; // Safe fallback
        }
        
        // Update persistent discovery if we've reached a higher level through base expansion only
        if (typeof window.updateElementDiscoveryProgress === 'function') {
            try {
                window.updateElementDiscoveryProgress(baseMaxUnlocked);
            } catch (error) {

            }
        } else if (window.state && typeof window.state.elementDiscoveryProgress !== 'undefined') {
            // Fallback: update directly if the main function isn't available
            const currentProgress = window.state.elementDiscoveryProgress || 0;
            if (baseMaxUnlocked > currentProgress) {
                window.state.elementDiscoveryProgress = baseMaxUnlocked;

            }
        } else if (window.state) {
            // Initialize if it doesn't exist
            window.state.elementDiscoveryProgress = baseMaxUnlocked;

        }
    } catch (error) {

        // Don't throw the error, just log it and continue
    }
}

function initializeElementUnlockSystem() {
    // Don't override the original function, just add visibility filtering
    
    // Aggressive fix: Reset inflated discovery progress
    if (window.state) {
        const baseMaxElements = getMaxUnlockedElements();
        
        // If discovery progress is way higher than what base expansion allows, reset it
        if (window.state.elementDiscoveryProgress > baseMaxElements + 5) {

            window.state.elementDiscoveryProgress = baseMaxElements;
        }
        
        // Also cap it at 30 max for safety (since the user mentions only 25 elements should be unlocked)
        if (window.state.elementDiscoveryProgress > 30) {

            window.state.elementDiscoveryProgress = 25;
        }
    }
    
    // Hook into the original render function to apply visibility after it runs
    if (typeof window.renderElementGrid === 'function') {
        window.originalRenderElementGrid = window.renderElementGrid;
        window.renderElementGrid = function() {
            // Call original function first
            window.originalRenderElementGrid();
            // Track discovery progress before applying visibility
            trackElementDiscovery();
            // Then apply our visibility filtering
            applyElementVisibilityFilter();
        };
    }

}

function getMaxUnlockedElements() {
    try {
        if (!window || !window.state || window.state.grade === null || window.state.grade === undefined) {

            return ELEMENT_UNLOCK_CONFIG[1].maxElements; // Default to starting elements
        }
        
        let expansionLevel;
        
        // Extra defensive check before calling any methods on grade
        if (window.state.grade === null || window.state.grade === undefined) {

            return ELEMENT_UNLOCK_CONFIG[1].maxElements;
        }
        
        // Check if it's a Decimal object safely
        try {
            if (DecimalUtils && typeof DecimalUtils.isDecimal === 'function' && DecimalUtils.isDecimal(window.state.grade)) {
                // Make sure the Decimal object has the toNumber method before calling it
                if (typeof window.state.grade.toNumber === 'function') {
                    expansionLevel = window.state.grade.toNumber();
                } else {

                    expansionLevel = parseFloat(window.state.grade.toString()) || 1;
                }
            } else {
                expansionLevel = window.state.grade;
            }
        } catch (decimalError) {

            // Try to extract numeric value as fallback
            expansionLevel = parseFloat(String(window.state.grade)) || 1;
        }
        
        // Ensure we have a valid number
        if (typeof expansionLevel !== 'number' || isNaN(expansionLevel)) {

            return ELEMENT_UNLOCK_CONFIG[1].maxElements;
        }
        
        // Ensure expansion level is at least 1
        expansionLevel = Math.max(1, Math.floor(expansionLevel));
        
        // Find the appropriate config for current expansion level
        let maxElements = ELEMENT_UNLOCK_CONFIG[1].maxElements;
        for (let level = 1; level <= expansionLevel; level++) {
            if (ELEMENT_UNLOCK_CONFIG[level]) {
                maxElements = ELEMENT_UNLOCK_CONFIG[level].maxElements;
            }
        }

        return maxElements;
    } catch (error) {



        return ELEMENT_UNLOCK_CONFIG[1].maxElements; // Safe fallback
    }
}

function applyElementVisibilityFilter() {
    try {
        // Use infinity upgrade bonus if available for current access
        let currentMaxUnlocked;
        try {
            currentMaxUnlocked = (typeof window.getMaxElementsWithInfinityBonus === 'function') 
                ? window.getMaxElementsWithInfinityBonus() 
                : getMaxUnlockedElements();
        } catch (error) {

            currentMaxUnlocked = getMaxUnlockedElements(); // Fallback to base function
        }
        
        const baseMaxUnlocked = getMaxUnlockedElements();
        
        // Temporary fix: Cap infinity bonuses to prevent showing too many elements
        // If infinity bonuses are giving way more than base progression, limit it
        if (currentMaxUnlocked > baseMaxUnlocked + 10) {

            currentMaxUnlocked = baseMaxUnlocked + 10;
        }
        
        // For new saves, only use current unlock level (which comes from permanent discovery system)
        // Don't use elementDiscoveryProgress as it can get inflated incorrectly
        const maxUnlockedElements = currentMaxUnlocked;

        const grid = document.getElementById("elementGrid");
        
        if (!grid) return;
    
    // Find all element tiles and apply visibility filtering
    const tiles = grid.querySelectorAll('.element-tile[data-index]');
    
    tiles.forEach(tile => {
        const elementIndex = parseInt(tile.dataset.index);
        const isUnlocked = elementIndex <= maxUnlockedElements;
        
        if (!isUnlocked) {
            // Make locked elements completely invisible
            tile.style.display = "none";
            
        } else {
            // Ensure unlocked elements are fully visible
            tile.style.display = "";
            tile.style.opacity = "";
            tile.style.filter = "";
            tile.style.cursor = "";
            tile.style.pointerEvents = "";
            
            // Remove lock icon if present (cleanup from previous version)
            const lockIcon = tile.querySelector('.lock-icon');
            if (lockIcon) {
                lockIcon.remove();
            }
        }
    });
    } catch (error) {

    }
}

// Manual reset function for debugging - can be called from console
window.resetElementDiscovery = function() {
    if (window.state) {
        const baseMaxElements = getMaxUnlockedElements();

        window.state.elementDiscoveryProgress = baseMaxElements;
        
        // Force re-render the element grid
        if (typeof window.renderElementGrid === 'function') {
            window.renderElementGrid();
        }

    }
};

// Hook into expansion level changes to update element availability
if (typeof window.trackGradeMilestone === 'function') {
    const originalTrackGradeMilestone = window.trackGradeMilestone;
    window.trackGradeMilestone = function(grade) {
        // Call original function
        const result = originalTrackGradeMilestone.apply(this, arguments);
        
        // Update element grid when expansion changes
        setTimeout(() => {
            if (typeof window.renderElementGrid === 'function') {
                window.renderElementGrid();
            }
        }, 100);
        
        return result;
    };
}

// Add CSS styles for the status display only
function injectElementUnlockCSS() {
    if (document.getElementById('elementUnlockCSS')) return;
    
    const style = document.createElement('style');
    style.id = 'elementUnlockCSS';
    style.textContent = `
        #elementUnlockStatus {
            transition: all 0.3s ease;
        }
        
        #elementUnlockStatus:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize CSS when script loads
injectElementUnlockCSS();

// --- FREE GIFT MODAL SYSTEM ---
let freeGiftModalShown = false;

function showFreeGiftModal() {
    if (freeGiftModalShown) return;
    
    const modal = document.getElementById('freeGiftModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    freeGiftModalShown = true;
    
    // Add click-outside-to-claim functionality (only if not already added)
    if (!modal._freeGiftClickHandler) {
        modal._freeGiftClickHandler = function(event) {
            if (event.target === modal) {
                claimFreeGift();
            }
        };
        modal.addEventListener('click', modal._freeGiftClickHandler);
    }
}

function claimFreeGift() {
    const modal = document.getElementById('freeGiftModal');
    if (!modal) return;
    
    // Award all the specified rewards
    awardFreeGiftRewards();
    
    // Hide the modal
    modal.style.display = 'none';
    
    // Mark as claimed to prevent showing again
    localStorage.setItem('freeGiftClaimed', 'true');
}

function awardFreeGiftRewards() {
    // Award kitchen ingredient tokens using proper system
    if (!window.state.tokens) {
        window.state.tokens = {};
    }
    
    // Award ingredient tokens by adding to existing amounts
    const ingredientRewards = {
        berries: 500,
        mushroom: 300,
        sparks: 300,
        prisma: 300,
        water: 300,
        petals: 300,
        stardust: 100
    };
    
    for (const [type, amount] of Object.entries(ingredientRewards)) {
        // Ensure the ingredient exists and is a Decimal in window.state.tokens
        if (!DecimalUtils.isDecimal(window.state.tokens[type])) {
            window.state.tokens[type] = new Decimal(0);
        }
        // Add the reward amount to existing inventory
        window.state.tokens[type] = window.state.tokens[type].add(amount);
        
        // Also update legacy kitchenIngredients for backward compatibility
        if (!window.kitchenIngredients) {
            window.kitchenIngredients = {};
        }
        if (!DecimalUtils.isDecimal(window.kitchenIngredients[type])) {
            window.kitchenIngredients[type] = new Decimal(0);
        }
        window.kitchenIngredients[type] = window.kitchenIngredients[type].add(amount);
    }
    
    // Award special tokens stored in window.state (including swabucks)
    if (window.state) {
        const specialTokenRewards = {
            swabucks: 250,
            berryPlate: 5,
            mushroomSoup: 5,
            batteries: 5,
            chargedPrisma: 5,
            glitteringPetals: 5
        };
        
        for (const [token, amount] of Object.entries(specialTokenRewards)) {
            if (token === 'swabucks') {
                // Handle swabucks as Decimal (it's saved as Decimal string)
                if (!DecimalUtils.isDecimal(window.state[token])) {
                    window.state[token] = new Decimal(0);
                }
                window.state[token] = window.state[token].add(amount);
            } else {
                // Handle other special tokens as numbers (save system expects numbers)
                if (typeof window.state[token] !== 'number') {
                    window.state[token] = 0;
                }
                window.state[token] += amount;
            }
        }
        
        // Save immediately after awarding special tokens to persist changes
        if (typeof saveGame === 'function') {
            saveGame();
        }
    }
    
    // Track token collection for front desk automator unlock progress (same as kitchen system)
    if (window.frontDesk && typeof window.frontDesk.onTokenCollected === 'function') {
        // Call for each ingredient type collected (7 ingredients + 5 special tokens = 12 total)
        for (let i = 0; i < 12; i++) {
            window.frontDesk.onTokenCollected();
        }
    }
    
    // Update UI and save game (same as kitchen system)
    if (typeof window.updateKitchenUI === 'function') {
        window.updateKitchenUI();
    }
    if (typeof window.updateUI === 'function') {
        window.updateUI();
    }
    if (typeof window.updateInventoryModal === 'function') {
        window.updateInventoryModal(true); // Force update after token collection
    }
    if (typeof saveGame === 'function') {
        saveGame();
    }
}

function initializeFreeGiftModal() {
    // Check if the gift has already been claimed
    if (localStorage.getItem('freeGiftClaimed') === 'true') {
        return;
    }
    
    // Show the modal after a short delay to ensure the page is loaded
    setTimeout(() => {
        showFreeGiftModal();
    }, 1500);
}

// Make functions globally accessible
window.showFreeGiftModal = showFreeGiftModal;
window.claimFreeGift = claimFreeGift;
window.awardFreeGiftRewards = awardFreeGiftRewards;
window.initializeFreeGiftModal = initializeFreeGiftModal;

// Debug function to test the free gift modal
window.testFreeGiftModal = function() {
    localStorage.removeItem('freeGiftClaimed');
    freeGiftModalShown = false;
    showFreeGiftModal();
};

// Debug function to test reward addition without modal
window.testFreeGiftRewards = function() {
    awardFreeGiftRewards();
};

// Comprehensive cleanup function for script3.js
window.cleanupScript3 = function() {
    // Clear deliver button intervals
    if (window.deliverButtonStateInterval) {
        clearInterval(window.deliverButtonStateInterval);
        window.deliverButtonStateInterval = null;
    }
    
    if (deliverButtonCooldown && deliverButtonCooldown.interval) {
        clearInterval(deliverButtonCooldown.interval);
        deliverButtonCooldown.interval = null;
        deliverButtonCooldown.isActive = false;
        deliverButtonCooldown.remainingTime = 0;
    }
    
    // Clear boost display interval
    if (boostDisplayInterval) {
        clearInterval(boostDisplayInterval);
        boostDisplayInterval = null;
    }
    
    // Clear sleep button interval
    if (window.createSleepButtonInterval) {
        clearInterval(window.createSleepButtonInterval);
        window.createSleepButtonInterval = null;
    }
    
    // Clear all speed-up intervals
    if (window.script3SpeedUpIntervals) {
        window.script3SpeedUpIntervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        window.script3SpeedUpIntervals = [];
    }
    
    // Clear all tracked timeouts
    if (window.script3Timeouts) {
        window.script3Timeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        window.script3Timeouts = [];
    }
    
    // Clean up free gift modal event listener
    const modal = document.getElementById('freeGiftModal');
    if (modal && modal._freeGiftClickHandler) {
        modal.removeEventListener('click', modal._freeGiftClickHandler);
        modal._freeGiftClickHandler = null;
    }
    
    // Reset state flags
    freeGiftModalShown = false;
    intercomEventTriggered = false;
    intercomEvent20Triggered = false;
    
    // Clear display caches
    lastBoostDisplayContent = '';
    if (boostElementsCache) {
        boostElementsCache.clear();
    }
};