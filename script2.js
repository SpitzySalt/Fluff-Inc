// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file
// Script2 is a continuation of script.js

// Save system mutex to prevent simultaneous save operations
let saveMutex = false;

// Critical operation flags to prevent saving during sensitive moments
let criticalOperationInProgress = false;
let gameTickInProgress = false;

// Enhanced validation function to check game state integrity
function validateGameState() {
  // Allow saves even if some validation fails to prevent infinity data loss
  // Only fail validation for critical corruption that would break the game
  if (!window.state) {
    return false;
  }
  
  // Don't fail validation for missing non-critical objects - just log warnings
  if (!window.kitchenIngredients || !window.friendship) {
    console.warn('Missing non-critical game objects during validation');
  }
  
  // Validate major Decimal currencies but fix corruption instead of failing
  const currencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
  for (const currency of currencies) {
    if (window.state[currency] && DecimalUtils.isDecimal(window.state[currency])) {
      if (window.state[currency].lt(0) || !window.state[currency].isFinite()) {
        // Fix corrupted currency values instead of failing validation
        console.warn(`Fixing corrupted ${currency} value during validation`);
        window.state[currency] = new Decimal(0);
      }
    }
  }
  
  // Validate generators array but fix corruption instead of failing
  if (window.state.generators && Array.isArray(window.state.generators)) {
    for (const gen of window.state.generators) {
      if (gen && gen.baseCost && DecimalUtils.isDecimal(gen.baseCost)) {
        if (gen.baseCost.lt(0) || !gen.baseCost.isFinite()) {
          // Fix corrupted generator cost instead of failing validation
          console.warn('Fixing corrupted generator baseCost during validation');
          gen.baseCost = new Decimal(gen.baseCost.toString().replace(/[^0-9.]/g, '') || '10');
        }
      }
    }
  }
  
  return true;
}

// Functions to manage critical operation states
function setCriticalOperation(inProgress) {
  criticalOperationInProgress = inProgress;
}

function setGameTickInProgress(inProgress) {
  gameTickInProgress = inProgress;
}

function isSafeToPersist() {
  return !criticalOperationInProgress && 
         !gameTickInProgress && 
         !saveMutex &&
         !document.hidden && 
         document.hasFocus();
}

// Make functions globally accessible
window.setCriticalOperation = setCriticalOperation;
window.setGameTickInProgress = setGameTickInProgress;
window.isSafeToPersist = isSafeToPersist;

// Force tab visibility update - fix for missing tabs bug
function forceTabVisibilityUpdate() {
  try {
    // Debug logging
    const currentGrade = window.state && window.state.grade ? 
      (DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : window.state.grade) : 0;
    
    // Ensure boughtElements references are consistent
    if (window.state && window.state.boughtElements && !window.boughtElements) {
      window.boughtElements = window.state.boughtElements;
    }
    
    // Force generator tab visibility if power generator is unlocked
    if ((window.state && window.state.boughtElements && window.state.boughtElements[7]) || 
        (window.boughtElements && window.boughtElements[7])) {
      const genBtn = document.getElementById("generatorSubTabBtn");
      if (genBtn) {
        if (window.currentFloor === 2) {
          genBtn.style.display = "none";
        } else {
          genBtn.style.display = "inline-block";
        }
        const subTabNav = document.getElementById("subTabNav");
        if (subTabNav) {
          subTabNav.style.display = "flex";
        }
      }
    }
    
    // Force kitchen tab visibility if grade >= 3 or permanently unlocked
    if (currentGrade >= 3 || (window.permanentTabUnlocks && window.permanentTabUnlocks.kitchen)) {
      const kitchenBtn = document.getElementById('kitchenTabBtn');  // Correct ID
      if (kitchenBtn) {
        kitchenBtn.style.display = 'inline-block';
      }
    }
    
    // Force lab tab visibility if grade >= 2 or infinity unlock or permanently unlocked
    const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (currentGrade >= 2 || hasInfinityUnlock || (window.permanentTabUnlocks && window.permanentTabUnlocks.prism)) {
      const labBtn = document.getElementById("prismSubTabBtn");
      if (labBtn) {
        if (window.currentFloor === 2) {
          labBtn.style.display = "none";
          labBtn.textContent = "Observatory";
        } else {
          labBtn.style.display = "inline-block";
          labBtn.textContent = "Lab";
        }
      }
    }
    
    // Force boutique tab visibility if grade >= 4 or permanently unlocked
    if (currentGrade >= 4 || (window.permanentTabUnlocks && window.permanentTabUnlocks.boutique)) {
      const boutiqueBtn = document.getElementById('boutiqueSubTabBtn');
      if (boutiqueBtn) {
        if (window.currentFloor === 2) {
          boutiqueBtn.style.setProperty('display', 'none', 'important');
        } else {
          boutiqueBtn.style.setProperty('display', 'inline-block', 'important');
          
          // Apply night-time restrictions if applicable
          const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && (() => {
            const mins = window.daynight.getTime();
            return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); // 22:00 - 6:00
          })();
          
          if (isNightTime) {
            boutiqueBtn.style.setProperty('opacity', '0.5', 'important');
            boutiqueBtn.style.setProperty('filter', 'grayscale(100%)', 'important');
            boutiqueBtn.disabled = true;
          } else {
            boutiqueBtn.style.removeProperty('opacity');
            boutiqueBtn.style.removeProperty('filter');
            boutiqueBtn.disabled = false;
          }
        }
      }
    }
    
    // Force graduation tab visibility if element 8 is unlocked
    if ((window.state && window.state.boughtElements && window.state.boughtElements[8]) || 
        (window.boughtElements && window.boughtElements[8])) {
      const gradBtn = document.getElementById("graduationSubTabBtn");
      if (gradBtn) {
        gradBtn.style.display = "inline-block";
      }
      const knowledgeSubTabNav = document.getElementById("knowledgeSubTabNav");
      if (knowledgeSubTabNav) {
        knowledgeSubTabNav.style.display = "flex";
      }
    }
    
  } catch (error) {
    // Silently handle any errors to prevent breaking the game
    console.warn('Tab visibility update error:', error);
  }
}

// Make function globally available
window.forceTabVisibilityUpdate = forceTabVisibilityUpdate;

// Unified game tick system to reduce memory overhead from multiple intervals
function unifiedGameTick() {
  // Check if game is paused - if so, don't execute
  if (window.isGamePaused) {
    return;
  }
  
  // Set critical operation flag during game tick to prevent save corruption
  setGameTickInProgress(true);
  
  try {
    const now = Date.now();
    if (!window.lastUnifiedTick) window.lastUnifiedTick = now;
    const diff = (now - window.lastUnifiedTick) / 100;
    window.lastUnifiedTick = now;
    
    // Sanity check currencies (from gameTick)
    if (typeof sanityCheckCurrencies === 'function') {
      sanityCheckCurrencies();
    }
    
    // Calculate and add fluff gain (from gameTick)
    if (typeof getFluffRate === 'function') {
      let fluffGain = DecimalUtils.floor(getFluffRate());
      if (typeof addCurrency === 'function') {
        addCurrency('fluff', fluffGain);
      }
      if (typeof window.trackFluffMilestone === 'function') {
        window.trackFluffMilestone(state.fluff);
      }
    }
    
    // Tick generators (shared by both functions)
    if (typeof tickGenerators === 'function') {
      tickGenerators(diff);
    }
    
    // Power generator tick (from both functions)
    if (state.boughtElements && state.boughtElements[7] && !(window.isTabHidden || document.hidden)) {
      if (typeof tickPowerGenerator === 'function') {
        tickPowerGenerator(diff);
      }
    }
    
    // Light generators tick (from mainGameTick)
    if (window.tickLightGenerators) {
      window.tickLightGenerators(diff);
    }
    
    // Charger system is handled by charger.js - removed duplicate implementation
    
    // Charger milestone effects (from gameTick)
    if (window.charger && typeof window.applyChargerMilestoneEffects === 'function') {
      window.applyChargerMilestoneEffects();
    }
    
    // Force tab visibility check - fix missing tabs bug
    forceTabVisibilityUpdate();
    
    // Mystic cooking speed boost (from mainGameTick)
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
    
    // Peachy hunger boost (from mainGameTick)
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
    
    // Soap battery boost (from mainGameTick)
    if (window.state && window.state.soapBatteryBoost && window.state.soapBatteryBoost > 0) {
      const isNight = window.daynight && typeof window.daynight.getTime === 'function';
      if (isNight) {
        window.state.soapBatteryBoost -= diff * 1000;
        if (window.state.soapBatteryBoost <= 0) {
          window.state.soapBatteryBoost = 0;
          if (typeof window.updateBoostDisplay === 'function') {
            window.updateBoostDisplay();
          }
        }
      }
    }
    
    // Fluzzer AI management (from mainGameTick)
    if (window.state && window.state.fluzzerSleepBoost && window.state.fluzzerSleepBoost > 0) {
      if (!document.hidden) {
        window.state.fluzzerSleepBoost -= diff * 1000;
        if (window.state.fluzzerSleepBoost <= 0) {
          window.state.fluzzerSleepBoost = 0;
          if (typeof window.updateBoostDisplay === 'function') {
            window.updateBoostDisplay();
          }
          if (!window.isFluzzerSleeping) {
            window.startFluzzerAI();
          }
        }
      }
    }
    
    // Calibration nerfs decay (from gameTick)
    if (typeof window.decayCalibrationNerfs === 'function') {
      window.decayCalibrationNerfs(diff);
    }
    
    // Infinity system updates (from gameTick)
    if (typeof updateInfinityDisplay === 'function') {
      updateInfinityDisplay();
    }
    
    if (typeof checkChallengeCompletion === 'function') {
      checkChallengeCompletion();
    }
    
    // Check for infinity conditions (from mainGameTick)
    if (typeof infinitySystem !== 'undefined' && infinitySystem.checkAllCurrencies) {
      infinitySystem.checkAllCurrencies();
    }
    
    // Update UI (from gameTick)
    if (typeof updateUI === 'function') {
      updateUI();
    }
    
  } finally {
    // Always clear the game tick flag, whether tick succeeded or failed
    setGameTickInProgress(false);
  }
}

// Direct fluff display update function (bypasses UI throttling)
function updateFluffDisplayDirect() {
  // Only update fluff display and fluff rate display, nothing else
  const fluffEl = document.getElementById("fluff");
  if (fluffEl && window.state && window.state.fluff) {
    if (typeof formatNumber === 'function') {
      fluffEl.textContent = formatNumber(window.state.fluff);
    } else {
      fluffEl.textContent = window.state.fluff.toString();
    }
  }
  
  // Update fluff rate display
  const fluffRateEl = document.getElementById("fluffRate");
  if (fluffRateEl && typeof getFluffRate === 'function') {
    let rawFluffGain = getFluffRate().floor();
    let finalFluffGain = rawFluffGain;
    
    // Apply the EXACT same order of operations as addCurrency for accurate display
    // This ensures the displayed rate matches what's actually gained per tick
    
    // Apply infinity upgrade boosts BEFORE penalties (same as addCurrency)
    if (typeof applyCargoBoost === 'function') {
      finalFluffGain = applyCargoBoost(finalFluffGain, 'fluff');
    }
    if (typeof applyLabBoost === 'function') {
      finalFluffGain = applyLabBoost(finalFluffGain, 'fluff');
    }
    
    // Apply total infinity reached boost to pre-infinity currencies
    if (typeof window.applyTotalInfinityReachedBoost === 'function') {
      finalFluffGain = window.applyTotalInfinityReachedBoost(finalFluffGain);
    }
    
    // Apply fluff infinity penalty to all cargo currencies
    if (typeof window.applyFluffInfinityPenalty === 'function') {
      finalFluffGain = window.applyFluffInfinityPenalty(finalFluffGain, 'fluff');
    }
    
    // Apply infinity nerfs to main currencies
    if (typeof window.infinitySystem !== 'undefined' && window.infinitySystem.applyInfinityNerfs) {
      finalFluffGain = window.infinitySystem.applyInfinityNerfs(finalFluffGain, 'fluff');
    }
    
    // Apply infinity challenge nerfs (square root for IC:1)
    if (typeof window.applyChallengeNerfs === 'function') {
      finalFluffGain = window.applyChallengeNerfs(finalFluffGain, 'fluff');
    }
    
    // Apply anomaly debuff to main currencies
    if (typeof window.getAnomalyDebuff === 'function') {
      const anomalyDebuff = window.getAnomalyDebuff();
      finalFluffGain = finalFluffGain.mul(anomalyDebuff);
    }
    
    // Floor the final result
    finalFluffGain = finalFluffGain.floor();
    
    if (typeof formatNumber === 'function') {
      fluffRateEl.textContent = formatNumber(finalFluffGain);
    } else {
      fluffRateEl.textContent = finalFluffGain.toString();
    }
  }
}

// Make unified tick globally accessible
window.unifiedGameTick = unifiedGameTick;
window.updateFluffDisplayDirect = updateFluffDisplayDirect;

// Memory optimization helper functions for generator operations
const GeneratorUtils = {
  // Iterate over unlocked generators without creating temporary arrays
  forEachUnlocked: function(generators, callback) {
    if (!generators || !Array.isArray(generators)) return;
    
    for (let i = 0; i < generators.length; i++) {
      const gen = generators[i];
      if (gen && gen.unlocked) {
        callback(gen, i);
      }
    }
  },
  
  // Count unlocked generators without filtering
  countUnlocked: function(generators) {
    if (!generators || !Array.isArray(generators)) return 0;
    
    let count = 0;
    for (let i = 0; i < generators.length; i++) {
      if (generators[i] && generators[i].unlocked) {
        count++;
      }
    }
    return count;
  },
  
  // Find first generator matching condition without creating arrays
  findFirst: function(generators, predicate) {
    if (!generators || !Array.isArray(generators)) return null;
    
    for (let i = 0; i < generators.length; i++) {
      const gen = generators[i];
      if (gen && predicate(gen, i)) {
        return gen;
      }
    }
    return null;
  },
  
  // Check if any generator matches condition without creating arrays
  hasAny: function(generators, predicate) {
    if (!generators || !Array.isArray(generators)) return false;
    
    for (let i = 0; i < generators.length; i++) {
      const gen = generators[i];
      if (gen && predicate(gen, i)) {
        return true;
      }
    }
    return false;
  }
};

// Make generator utils globally accessible
window.GeneratorUtils = GeneratorUtils;

// Event listener management system to prevent memory leaks
const EventListenerManager = {
  // Registry of active listeners for cleanup
  listeners: new Map(),
  
  // Add event listener with automatic cleanup tracking
  addEventListener: function(element, event, handler, options = {}) {
    if (!element || typeof handler !== 'function') return;
    
    // Generate unique ID for this listener
    const listenerId = `${event}_${Date.now()}_${Math.random()}`;
    
    // Store the listener info
    this.listeners.set(listenerId, {
      element: element,
      event: event,
      handler: handler,
      options: options
    });
    
    element.addEventListener(event, handler, options);
    return listenerId;
  },
  
  // Remove specific listener
  removeEventListener: function(listenerId) {
    const listenerInfo = this.listeners.get(listenerId);
    if (listenerInfo) {
      listenerInfo.element.removeEventListener(listenerInfo.event, listenerInfo.handler, listenerInfo.options);
      this.listeners.delete(listenerId);
    }
  },
  
  // Clean up all listeners for a specific element
  cleanupElement: function(element) {
    for (const [listenerId, listenerInfo] of this.listeners.entries()) {
      if (listenerInfo.element === element) {
        this.removeEventListener(listenerId);
      }
    }
  },
  
  // Clean up all event listeners (for memory optimization)
  cleanupAll: function() {
    for (const [listenerId] of this.listeners.entries()) {
      this.removeEventListener(listenerId);
    }
  },
  
  // Get count of active listeners (for debugging)
  getListenerCount: function() {
    return this.listeners.size;
  }
};

// Make event listener manager globally accessible
window.EventListenerManager = EventListenerManager;

// Token cleanup system for comprehensive token management
const TokenCleanupSystem = {
  // Clean up a token element and its associated resources
  cleanupToken: function(tokenElement, tokenData = {}) {
    if (!tokenElement) return;
    
    try {
      // Clear any timeout associated with this token
      if (tokenData.timeoutId) {
        clearTimeout(tokenData.timeoutId);
        tokenData.timeoutId = null;
      }
      
      // Clear any interval associated with this token
      if (tokenData.intervalId) {
        clearInterval(tokenData.intervalId);
        tokenData.intervalId = null;
      }
      
      // Clean up event listeners
      EventListenerManager.cleanupElement(tokenElement);
      
      // Remove from DOM
      if (tokenElement.parentNode) {
        tokenElement.parentNode.removeChild(tokenElement);
      }
      
      // Clean up any references in token tracking arrays
      this.removeFromTokenArrays(tokenElement, tokenData);
      
    } catch (error) {
      console.warn('Error cleaning up token:', error);
    }
  },
  
  // Clean up expired token with additional logging
  cleanupExpiredToken: function(tokenElement, tokenData = {}, reason = 'expired') {
    try {
      // Log cleanup reason for debugging
      if (tokenData.type) {
      }
      
      // Use standard cleanup
      this.cleanupToken(tokenElement, tokenData);
      
    } catch (error) {
      console.warn('Error cleaning up expired token:', error);
    }
  },
  
  // Remove token from known tracking arrays
  removeFromTokenArrays: function(tokenElement, tokenData = {}) {
    // Kitchen ingredient tokens
    if (window.activeIngredientTokens) {
      const index = window.activeIngredientTokens.findIndex(token => 
        token.element === tokenElement || token === tokenElement
      );
      if (index !== -1) {
        window.activeIngredientTokens.splice(index, 1);
      }
    }
    
    // Bijou collection queue
    if (window.bijouCollectionQueue) {
      const bijouIndex = window.bijouCollectionQueue.findIndex(item => 
        item.element === tokenElement
      );
      if (bijouIndex !== -1) {
        window.bijouCollectionQueue.splice(bijouIndex, 1);
      }
    }
    
    // Premium blown tokens
    if (window.activeBlownTokens) {
      const blownIndex = window.activeBlownTokens.findIndex(token => 
        token.element === tokenElement
      );
      if (blownIndex !== -1) {
        window.activeBlownTokens.splice(blownIndex, 1);
      }
    }
  },
  
  // Enhanced cleanup for collection with resource rewards
  cleanupCollectedToken: function(tokenElement, tokenData = {}, collectedResources = {}) {
    try {
      // Log collection for debugging
      if (tokenData.type && Object.keys(collectedResources).length > 0) {
      }
      
      // Standard cleanup
      this.cleanupToken(tokenElement, tokenData);
      
      // Update UI if resources were gained
      if (Object.keys(collectedResources).length > 0) {
        if (typeof window.updateUI === 'function') {
          window.updateUI();
        }
      }
      
    } catch (error) {
      console.warn('Error cleaning up collected token:', error);
    }
  },
  
  // Clean up all tokens of a specific type
  cleanupTokensByType: function(tokenType) {
    try {
      // Kitchen ingredient tokens
      if (tokenType === 'ingredient' && window.activeIngredientTokens) {
        const tokens = [...window.activeIngredientTokens];
        tokens.forEach(token => {
          if (token.element) {
            this.cleanupToken(token.element, token);
          }
        });
      }
      
      // Bijou tokens
      if (tokenType === 'bijou' && window.bijouCollectionQueue) {
        const tokens = [...window.bijouCollectionQueue];
        tokens.forEach(token => {
          if (token.element) {
            this.cleanupToken(token.element, token);
          }
        });
      }
      
      // Blown anomaly tokens
      if (tokenType === 'blown' && window.activeBlownTokens) {
        const tokens = [...window.activeBlownTokens];
        tokens.forEach(token => {
          if (token.element) {
            this.cleanupToken(token.element, token);
          }
        });
      }
      
    } catch (error) {
      console.warn(`Error cleaning up ${tokenType} tokens:`, error);
    }
  }
};

// Make token cleanup system globally accessible
window.TokenCleanupSystem = TokenCleanupSystem;

// Prism cleanup system for memory leak prevention
const PrismCleanupSystem = {
  // Track active MutationObservers for cleanup
  mutationObservers: [],
  
  // Clean up all prism-related memory leaks
  cleanupPrismSystem: function() {
    try {
      // Disconnect all MutationObservers
      this.mutationObservers.forEach(observer => {
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      });
      this.mutationObservers = [];
      
      // Clean up prism tile event listeners
      this.cleanupPrismTileListeners();
      
      // Clear prism-related intervals and timeouts
      this.clearPrismTimers();
      
    } catch (error) {
      console.warn('Error cleaning up prism system:', error);
    }
  },
  
  // Clean up event listeners on prism tiles
  cleanupPrismTileListeners: function() {
    const grid = document.getElementById('lightGrid');
    if (!grid) return;
    
    // Clean up all tile listeners using EventListenerManager
    grid.querySelectorAll('.light-tile').forEach(tile => {
      // Use EventListenerManager for comprehensive cleanup
      if (window.EventListenerManager) {
        window.EventListenerManager.cleanupElement(tile);
      }
      
      // Clear onclick handlers
      tile.onclick = null;
      
      // Clear token patching flag for re-initialization
      delete tile._tokenPatched;
    });
  },
  
  // Clear all prism-related timers
  clearPrismTimers: function() {
    // Clear prism timeouts array
    if (window.prismTimeouts && Array.isArray(window.prismTimeouts)) {
      window.prismTimeouts.forEach(timeoutId => {
        if (timeoutId) clearTimeout(timeoutId);
      });
      window.prismTimeouts = [];
    }
    
    // Clear specific prism intervals
    const prismIntervals = [
      'prismNerfDisplayInterval',
      'prismSpeechInterval',
      'prismUpdateInterval'
    ];
    
    prismIntervals.forEach(intervalName => {
      if (window[intervalName]) {
        clearInterval(window[intervalName]);
        window[intervalName] = null;
      }
    });
    
    // Clear specific prism timeouts
    const prismTimeouts = [
      'viSpeechTimeout',
      'prismViTimeout',
      'prismInitTimeout'
    ];
    
    prismTimeouts.forEach(timeoutName => {
      if (window[timeoutName]) {
        clearTimeout(window[timeoutName]);
        window[timeoutName] = null;
      }
    });
  },
  
  // Setup safe MutationObserver with tracking
  createSafeMutationObserver: function(callback, target, options) {
    try {
      const observer = new MutationObserver(callback);
      observer.observe(target, options);
      
      // Track for cleanup
      this.mutationObservers.push(observer);
      
      return observer;
    } catch (error) {
      console.warn('Error creating MutationObserver:', error);
      return null;
    }
  },
  
  // Safe tile event listener setup with proper cleanup tracking
  setupTileEventListeners: function(tiles, clickHandler, tokenHandler) {
    if (!window.EventListenerManager) return;
    
    tiles.forEach((tile) => {
      // Clean up existing listeners first
      window.EventListenerManager.cleanupElement(tile);
      tile.onclick = null;
      delete tile._tokenPatched;
      
      // Get the tile's actual index from data-index attribute
      const tileIndex = parseInt(tile.dataset.index);
      if (isNaN(tileIndex)) return; // Skip tiles without valid index
      
      // Set up click handler
      if (clickHandler && typeof clickHandler === 'function') {
        const listenerId = window.EventListenerManager.addEventListener(tile, 'click', () => {
          clickHandler(tileIndex); // Use tile's data-index, not array index
        });
        
        // Store listener ID on element for reference
        tile._prismClickListener = listenerId;
      }
      
      // Set up token handler if provided
      if (tokenHandler && typeof tokenHandler === 'function' && !tile._tokenPatched) {
        const tokenListenerId = window.EventListenerManager.addEventListener(tile, 'click', (e) => {
          tokenHandler(tile, e);
        });
        
        tile._tokenPatched = true;
        tile._prismTokenListener = tokenListenerId;
      }
    });
  },
  
  // Initialize prism system with proper cleanup
  initializePrismWithCleanup: function() {
    try {
      // Clean up existing system first
      this.cleanupPrismSystem();
      
      // Wait a frame to ensure cleanup is complete
      requestAnimationFrame(() => {
        // Re-initialize prism components
        if (typeof window.initPrismGrid === 'function') {
          window.initPrismGrid();
        }
        
        if (typeof window.initPrism === 'function') {
          window.initPrism();
        }
      });
      
    } catch (error) {
      console.warn('Error initializing prism with cleanup:', error);
    }
  }
};

// Make prism cleanup system globally accessible
window.PrismCleanupSystem = PrismCleanupSystem;

// DOM cleanup utilities to prevent memory leaks
const DOMUtils = {
  // Safely replace innerHTML after cleaning up event listeners
  setInnerHTML: function(element, html) {
    if (!element) return;
    
    // Clean up existing event listeners
    EventListenerManager.cleanupElement(element);
    
    // Also clean up any child elements
    const children = element.querySelectorAll('*');
    children.forEach(child => {
      EventListenerManager.cleanupElement(child);
    });
    
    // Now safely set innerHTML
    element.innerHTML = html;
  },
  
  // Remove element with proper cleanup
  removeElement: function(element) {
    if (!element) return;
    
    // Clean up event listeners for element and children
    EventListenerManager.cleanupElement(element);
    const children = element.querySelectorAll('*');
    children.forEach(child => {
      EventListenerManager.cleanupElement(child);
    });
    
    // Remove from DOM
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },
  
  // Create element with event listener tracking
  createElement: function(tagName, attributes = {}, innerHTML = '') {
    const element = document.createElement(tagName);
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'onclick' && typeof value === 'function') {
        // Use tracked event listener instead of onclick
        EventListenerManager.addEventListener(element, 'click', value);
      } else {
        element.setAttribute(key, value);
      }
    }
    
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    
    return element;
  }
};

// Make DOM utils globally accessible
window.DOMUtils = DOMUtils;

// UI update throttling system to reduce memory pressure
const UIUpdateManager = {
  throttleDelay: 50, // 50ms throttle (20 FPS max)
  lastUpdateTime: 0,
  pendingUpdate: false,
  
  // Throttled updateUI that batches updates
  requestUpdate: function() {
    if (this.pendingUpdate) return;
    
    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastUpdateTime;
    
    if (timeSinceLastUpdate >= this.throttleDelay) {
      // Execute immediately if enough time has passed
      this.executeUpdate();
    } else {
      // Schedule update for later
      this.pendingUpdate = true;
      setTimeout(() => {
        if (this.pendingUpdate) {
          this.executeUpdate();
        }
      }, this.throttleDelay - timeSinceLastUpdate);
    }
  },
  
  executeUpdate: function() {
    this.pendingUpdate = false;
    this.lastUpdateTime = Date.now();
    
    // Call the original updateUI function
    if (typeof window._originalUpdateUI === 'function') {
      window._originalUpdateUI();
    } else if (typeof updateUI === 'function') {
      updateUI();
    }
  },
  
  // Force immediate update (for critical situations)
  forceUpdate: function() {
    this.pendingUpdate = false;
    this.executeUpdate();
  }
};

// Make UI update manager globally accessible
window.UIUpdateManager = UIUpdateManager;

// Decimal constants cache to reduce object creation
const DecimalConstants = {
  // Pre-created commonly used Decimal instances
  ZERO: new Decimal(0),
  ONE: new Decimal(1),
  TWO: new Decimal(2),
  TEN: new Decimal(10),
  HUNDRED: new Decimal(100),
  THOUSAND: new Decimal(1000),
  
  // Get cached constant or create new one
  get: function(value) {
    switch(value) {
      case 0: return this.ZERO;
      case 1: return this.ONE;
      case 2: return this.TWO;
      case 10: return this.TEN;
      case 100: return this.HUNDRED;
      case 1000: return this.THOUSAND;
      default: return new Decimal(value);
    }
  },
  
  // Safe comparison - handles both Decimal and number
  equal: function(a, b) {
    if (DecimalUtils.isDecimal(a) && DecimalUtils.isDecimal(b)) {
      return a.eq(b);
    } else if (DecimalUtils.isDecimal(a)) {
      return a.eq(new Decimal(b));
    } else if (DecimalUtils.isDecimal(b)) {
      return new Decimal(a).eq(b);
    } else {
      return a === b;
    }
  },
  
  // Create Decimal only if needed (returns number if small enough)
  create: function(value) {
    if (typeof value === 'number' && Number.isFinite(value) && Math.abs(value) < 1e15) {
      return value; // Keep as number for small values
    }
    return new Decimal(value);
  }
};

// Make Decimal constants globally accessible
window.DecimalConstants = DecimalConstants;

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
  { text: "You should try playing the game fundamental! Its great!", condition: () => true },
  { text: "Do NOT go to the bathroom at 3:33 AM!", condition: () => true },
  { text: "Click on a box type then hold down the enter key for Swagic!", condition: () => true },
  { text: "DO NOT INPUT THE CODE 'Give me 1 million swa bucks' I REPEAT DO NOT!!!", condition: () => true },
  { text: "When are we seeing the sights?", condition: () => true },
  { text: "I'm full of feathers today!", condition: () => true },
  { text: "Did you know I go to Swa university©?", condition: () => true },
  { text: "Boxes, boxes, boxes!", condition: () => true },
  { text: "Don't forget to keep swa gaming!", condition: () => true },
  { text: "Knowledge is power!", condition: () => true },
  { text: "Feeling SWULTRA today!", condition: () => true },
  { text: "Fluff it up!", condition: () => true },
  { text: "I love Swagambling!", condition: () => true },
  { text: "Wing artifacts, 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 loves those!", condition: () => true },
  { text: "My name is Peachy btw.", condition: () => true },
  { text: "It would be so swawesome~", condition: () => true },
  { text: "Am I really a glorified news ticker?", condition: () => true },
  { text: "Real ones beats the game with no autoclicker.", condition: () => true },
  { text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 are so boring. But they do reward me with knowledge points.", condition: () => true },
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
  { text: "OMG MY KP IS GONE!!! NOOOOO!!! 𝒯𝐻𝐸 𝒮𝒲𝒜 𝐸𝐿𝐼𝒯𝐸 TOOK THEM SWALL!!!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "How come Vi can handle the prism lab? I'm so jealous.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(2),},
  { text: "I don't know why but I feel a strange feeling when discovering new Swalements...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
  { text: "Swanother factory expansion, there goes my kp again...", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
  { text: "So... 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 now wants feathers?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(3),},
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
  { text: "The anomaly resolver that 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 gave us is really swhelpful to get rid of swanomalies.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Sometimes I see boxes flickering in and out of existence. Swat's up with that?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The fabric of reality seems a bit torn lately. Is it just me?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I swaw something moving in the corner of my eye, but when I looked, nothing was there...", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Ever since we broke through swinfinity, weird things have been happening. Coincidence? I think not!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I found a box that wasn't there a minute ago. Swanomalies are real!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 warned us about these 'fluctations in reality'. I thought they were just being dramatic.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I tried to use the anomaly resolver on myself. Turns out I'm 1% swanomalous. Is that bad?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Reality is swacting up again. Time to get the swanomaly resolver!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I swear the facility layout changed when I wasn't looking. These swanomalies are getting out of hand!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The swanomaly resolver is my new favorite gadget. It's like a tv remote, to get rid of swanomalies.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Reaching swinfinity apparently broke reality too. Whoops!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I found an swanomaly that looked exactly like a box, but when I touched it, my wing went right through. Spooky!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 said swanomalies affect production. I must be on the lookout for any swanomalies in the factory.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  
  // Halloween-exclusive quotes (50% chance to appear instead of normal dialogue when Halloween is active)
  { text: "BOO! Did I scare you? Hehe, I love Halloween!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "This spooky peach outfit is so swawesome!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I've been practicing my spooky laugh: Mwahahaha! How was that?", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The facility looks so much spookier with all these Halloween decorations!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I tried to scare Soap earlier, but they just blew bubbles at me. Not very spooky!", condition: () => window.state && window.state.halloweenEventActive && DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "Trick or treat! I'm hoping for some candy, but I'll settle for more boxes to open.", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The boxes look extra mysterious tonight. I wonder if they're hiding candies.", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I keep hearing spooky sounds, but it might just be the facility's old pipes. Or ghosts!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I wonder if 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 celebrate Halloween? If they would I know their costume would be a sorceror.", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The prism lab looks even more magical with this spooky lighting!", condition: () => window.state && window.state.halloweenEventActive && DecimalUtils.isDecimal(state.grade) && state.grade.gte(2) },
  { text: "I tried to teach the boxes how to say 'BOO!' but they just sit there. Rude!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "This Halloween costume makes me feel extra mischievious, I wonder why >:3", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Swooky! That's spooky but with extra swa-ness. I'm making it a thing!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Halloween night shifts are the best! Everything feels more swadventurous.", condition: () => { if (!window.state || !window.state.halloweenEventActive) return false; if (!window.daynight || typeof window.daynight.getTime !== 'function') return false; const mins = window.daynight.getTime(); return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360); } },
  { text: "I wonder if Fluzzer created their own Halloween costume using their flowers...", condition: () => window.state && window.state.halloweenEventActive && DecimalUtils.isDecimal(state.grade) && state.grade.gte(6) },
  { text: "This spooky music in the background would really set the Halloween mood! If the speakers were working.", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I tried to make a jack-o'-lantern out of a box, but it just fell apart. Boxes aren't very pumpkin-like!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Halloween makes me want to explore all the dark corners of the facility. Swooky adventures await!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Even the swanomalies seem more festive during Halloween!", condition: () => window.state && window.state.halloweenEventActive && window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I keep expecting to see ghosts floating around, but it's probably just that other mint swaria wearing their halloween costume.", condition: () => window.state && window.state.halloweenEventActive },
  { text: "This Halloween outfit makes me feel like I could haunt the facility! In a friendly way, of course.", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The whole facility has such a mysterious Halloween atmosphere now. I love it!", condition: () => window.state && window.state.halloweenEventActive },
];

// Make swaria-related variables globally accessible
window.swariaImage = swariaImage;
window.swariaSpeech = swariaSpeech;
window.swariaQuotes = swariaQuotes;

// Timeout tracking for script2.js
window.script2Timeouts = window.script2Timeouts || [];

function showSwariaSpeech() {
  if (!swariaSpeech || !swariaImage) return;
  
  // Get appropriate quotes based on recorder mode
  const quotesToUse = (typeof window.getAppropriateQuotes === 'function') ? 
    window.getAppropriateQuotes() : swariaQuotes;
  
  let availableQuotes;
  
  // Halloween dialogue system: 50% chance for Halloween quotes when Halloween is active
  if (window.state && window.state.halloweenEventActive) {
    const halloweenQuotes = quotesToUse.filter(q => q.condition() && q.condition.toString().includes('halloweenEventActive'));
    const normalQuotes = quotesToUse.filter(q => q.condition() && !q.condition.toString().includes('halloweenEventActive'));
    
    // 50% chance to use Halloween quotes, 50% for normal quotes
    if (Math.random() < 0.5 && halloweenQuotes.length > 0) {
      availableQuotes = halloweenQuotes;
    } else {
      availableQuotes = normalQuotes.length > 0 ? normalQuotes : quotesToUse.filter(q => q.condition());
    }
  } else {
    // When Halloween is not active, filter out Halloween-only quotes
    availableQuotes = quotesToUse.filter(q => q.condition() && !q.condition.toString().includes('halloweenEventActive'));
  }
  
  const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  
  
  // Clear previous content
  swariaSpeech.innerHTML = "";
  
  if (randomQuote && randomQuote.image) {
    // Check if image field contains both text and image path
    const imageContent = randomQuote.image;
    const imagePath = imageContent.match(/assets\/icons\/[^"']+\.png/);
    
    if (imagePath) {
      // Extract text part (everything before the image path)
      const textPart = imageContent.replace(imagePath[0], '').trim();
      
      // Create container for text + image
      const container = document.createElement('div');
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      `;
      
      // Add text if it exists
      if (textPart) {
        const textSpan = document.createElement('span');
        textSpan.textContent = textPart;
        textSpan.style.cssText = `
          text-align: center;
          margin-bottom: 5px;
        `;
        container.appendChild(textSpan);
      }
      
      // Add image
      const img = document.createElement('img');
      img.src = imagePath[0];
      img.style.cssText = `
        max-width: 100%;
        max-height: 50px;
        object-fit: contain;
      `;
      container.appendChild(img);
      
      swariaSpeech.appendChild(container);
    } else {
      // Old format - just display as image
      const img = document.createElement('img');
      img.src = randomQuote.image;
      img.style.cssText = `
        max-width: 100%;
        max-height: 60px;
        object-fit: contain;
        display: block;
        margin: 0 auto;
      `;
      swariaSpeech.appendChild(img);
    }
  } else {
    // Display text as usual
    swariaSpeech.textContent = randomQuote ? randomQuote.text : "...";
  }
  
  swariaSpeech.style.display = "block";
  swariaImage.src = getMainCargoCharacterImage(true); 
  window.script2TrackedSetTimeout(() => {
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
  if (state.boughtElements[7]) {
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
  // Save system disabled - unlock functionality disabled
  
  // Then run the proper unlock check
  if (typeof checkInfinityResearchUnlock === 'function') {
    checkInfinityResearchUnlock();
  }
  
  document.getElementById("knowledgeSubTabNav").style.display = "flex";

}

window.testRegalBackground = testRegalBackground;
window.unlockGraduationForTesting = unlockGraduationForTesting;

function testElement9() {
  state.kp = new Decimal(2000000);
  tryBuyElement(9);
  switchHomeSubTab('generatorMainTab');
}

window.testElement9 = testElement9;

function updateGeneratorUpgradesUI() {
  if (!state.boughtElements[9]) return;
  const boxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
  boxTypes.forEach(type => {
    const upgradeLevel = state.generatorUpgrades[type] || new Decimal(0);
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
  let level = state.generatorUpgrades[type] || new Decimal(0);
  
  // Ensure level is a Decimal object
  if (!DecimalUtils.isDecimal(level)) {
    level = new Decimal(level);
    state.generatorUpgrades[type] = level; // Update state with proper Decimal
  }
  
  return baseCost.mul(new Decimal(5).pow(level)).floor();
}

function buyGeneratorUpgrade(type) {
  const cost = getGeneratorUpgradeCost(type);
  
  // Ensure boxesProducedByType[type] is a Decimal
  if (!DecimalUtils.isDecimal(state.boxesProducedByType[type])) {
    state.boxesProducedByType[type] = new Decimal(state.boxesProducedByType[type] || 0);
  }
  
  if (state.boxesProducedByType[type].lt(cost)) return;
  
  state.boxesProducedByType[type] = state.boxesProducedByType[type].sub(cost);
  
  // Ensure generatorUpgrades[type] is a Decimal
  if (!DecimalUtils.isDecimal(state.generatorUpgrades[type])) {
    state.generatorUpgrades[type] = new Decimal(state.generatorUpgrades[type] || 0);
  }
  
  state.generatorUpgrades[type] = state.generatorUpgrades[type].add(1);
  
  // Keep window reference synced
  if (window.generatorUpgrades) {
    window.generatorUpgrades[type] = state.generatorUpgrades[type];
  }
  
  updateUI();
  updateGeneratorUpgradesUI();
}

function calculatePowerGeneratorCap() {
  let baseCap = new Decimal(100);
  console.log('calculatePowerGeneratorCap - Starting with base cap:', baseCap.toString());
  
  if (state.grade.gte(2)) {
    const gradeBonus = state.grade.sub(1).mul(20);
    baseCap = baseCap.add(gradeBonus);
    console.log('calculatePowerGeneratorCap - After grade bonus (+' + gradeBonus.toString() + '):', baseCap.toString());
  }
  
  // Add battery upgrade bonuses
  if (window.state.powerGeneratorBatteryUpgrades) {
    const batteryBonus = DecimalUtils.toDecimal(window.state.powerGeneratorBatteryUpgrades).mul(5);
    baseCap = baseCap.add(batteryBonus);
    console.log('calculatePowerGeneratorCap - After battery bonus (+' + batteryBonus.toString() + '):', baseCap.toString());
  }
  
  // Add quest bonuses from completed Soap quests
  if (window.state.power && window.state.power.questBonuses) {
    let questBonus = 0;
    Object.values(window.state.power.questBonuses).forEach(bonus => {
      questBonus += bonus;
    });
    baseCap = baseCap.add(questBonus);
    console.log('calculatePowerGeneratorCap - After quest bonus (+' + questBonus + '):', baseCap.toString());
  }
  
  // Apply trophy power cap multipliers
  if (window.state.trophies && window.state.trophies.powerGeneratorChallenge && window.state.trophies.powerGeneratorChallenge.unlockedTier) {
    const tier = window.state.trophies.powerGeneratorChallenge.unlockedTier;
    let multiplier = 1;
    
    console.log('calculatePowerGeneratorCap - Found power generator challenge trophy, tier:', tier);
    
    if (tier === 'bronze') {
      multiplier = 1.1;
    } else if (tier === 'silver') {
      multiplier = 1.25;
    } else if (tier === 'gold') {
      multiplier = 1.5;
    }
    
    console.log('calculatePowerGeneratorCap - Trophy multiplier:', multiplier);
    
    if (multiplier > 1) {
      const beforeMultiplier = baseCap.toString();
      baseCap = baseCap.mul(multiplier);
      console.log('calculatePowerGeneratorCap - Before trophy multiplier:', beforeMultiplier);
      console.log('calculatePowerGeneratorCap - After trophy multiplier (x' + multiplier + '):', baseCap.toString());
    }
  } else {
    console.log('calculatePowerGeneratorCap - No trophy found or trophy not unlocked');
    console.log('calculatePowerGeneratorCap - Trophy state:', window.state.trophies?.powerGeneratorChallenge);
  }
  
  console.log('calculatePowerGeneratorCap - Final result:', baseCap.toString());
  return baseCap;
}

// Debug function to check trophy state and force power cap update
function debugTrophyPowerCap() {
  console.log('=== TROPHY POWER CAP DEBUG ===');
  console.log('Trophy state:', window.state.trophies);
  console.log('Power generator challenge trophy:', window.state.trophies?.powerGeneratorChallenge);
  console.log('Current power max energy:', window.state.powerMaxEnergy?.toString());
  
  // Force recalculate power cap
  const newCap = calculatePowerGeneratorCap();
  console.log('Calculated power cap:', newCap.toString());
  
  // Apply the new cap
  window.state.powerMaxEnergy = newCap;
  console.log('Updated power max energy to:', window.state.powerMaxEnergy.toString());
  
  // Update UI
  if (typeof updatePowerGeneratorUI === 'function') {
    updatePowerGeneratorUI();
  }
  
  console.log('=== DEBUG COMPLETE ===');
}
window.debugTrophyPowerCap = debugTrophyPowerCap;

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
      // Calculate power drain rate - 3x faster when kitomode is active
      const drainMultiplier = (window.state && window.state.kitoFoxModeActive) ? 3 : 1;
      const drainRate = new Decimal(diff).div(5).mul(drainMultiplier);
      state.powerEnergy = DecimalUtils.max(0, state.powerEnergy.sub(drainRate)); 
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
  
  // Update battery upgrade display if it exists
  updateBatteryUpgradeDisplay();
  
  // Update minigame challenge button visibility
  if (typeof updateMinigameChallengeButton === 'function') {
    updateMinigameChallengeButton();
  }
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
    
    // Increment power refill counter for quest tracking
    window.state.powerRefillCount = (window.state.powerRefillCount || 0) + 1;
    
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
  
  // KitoFox mode setup and minimum red tiles enforcement
  const isKitoFoxMode = window.state && window.state.kitoFoxModeActive;
  
  // Ensure minimum 10 red tiles when KitoFox/hardcore mode is active
  if (isKitoFoxMode && numRed < 10) {
    numRed = 10;
  }
  
  const redIndices = new Set();
  while (redIndices.size < numRed) {
    redIndices.add(Math.floor(Math.random() * totalCells));
  }
  let redTilesCleared = 0;
  grid.innerHTML = '';
  
  // KitoFox mode flickering setup
  let flickerInterval = null;
  
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'minigame-cell';
    if (isKitoFoxMode) {
      cell.classList.add('kitofox-flicker');
    }
    cell.dataset.index = i;
    if (redIndices.has(i)) {
      cell.classList.add('red');
      cell.dataset.originalColor = 'red';
    } else {
      cell.classList.add('green');
      cell.dataset.originalColor = 'green';
    }
    cell.addEventListener('click', () => {
      // Use original color for logic, not current flickering color
      const originalColor = cell.dataset.originalColor;
      
      if (originalColor === 'red') {
        cell.classList.remove('red', 'green');
        cell.classList.add('cleared');
        redTilesCleared++;
        const progress = (redTilesCleared / numRed) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${redTilesCleared}/${numRed} red cells cleared`;
        if (redTilesCleared >= numRed) {
          setTimeout(() => {
            completePowerRecharge();
          }, 500);
        }
      } else if (originalColor === 'green') {
        if (typeof window.trackPowerMinigameFailure === 'function') {
          window.trackPowerMinigameFailure();
        }
        // Clean up flicker interval before restarting
        if (window.powerMinigameFlickerInterval) {
          clearInterval(window.powerMinigameFlickerInterval);
          window.powerMinigameFlickerInterval = null;
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
  
  // Start KitoFox mode flickering animation
  if (isKitoFoxMode) {
    let flickerState = false;
    
    // Function to perform flicker
    const performFlicker = () => {
      const cells = grid.querySelectorAll('.minigame-cell');
      cells.forEach(cell => {
        if (cell.classList.contains('cleared')) return; // Don't flicker cleared cells
        
        const originalColor = cell.dataset.originalColor;
        if (originalColor === 'red') {
          // Red cells flicker: red -> green -> red -> green
          if (flickerState) {
            cell.classList.remove('red');
            cell.classList.add('green');
          } else {
            cell.classList.remove('green');
            cell.classList.add('red');
          }
        } else if (originalColor === 'green') {
          // Green cells flicker: green -> red -> green -> red
          if (flickerState) {
            cell.classList.remove('green');
            cell.classList.add('red');
          } else {
            cell.classList.remove('red');
            cell.classList.add('green');
          }
        }
      });
      flickerState = !flickerState;
    };
    
    // Start flickering immediately with no delay
    setTimeout(() => {
      performFlicker();
      flickerInterval = setInterval(performFlicker, 800); // Gentle flicker every 800ms
      window.powerMinigameFlickerInterval = flickerInterval;
    }, 0);
  }
}

function completePowerRecharge() {
  if (typeof window.trackHardModePowerRefill === 'function') {
    window.trackHardModePowerRefill();
  }
  if (typeof window.trackKitoFox2PowerRefill === 'function') {
    window.trackKitoFox2PowerRefill();
  }
  if (typeof window.resetPowerMinigameFailures === 'function') {
    window.resetPowerMinigameFailures();
  }
  
  // Increment power refill counter for quest tracking
  if (!window.state) window.state = {};
  window.state.powerRefillCount = (window.state.powerRefillCount || 0) + 1;
  
  // Ensure power values are Decimals
  if (!DecimalUtils.isDecimal(state.powerEnergy)) {
    state.powerEnergy = new Decimal(state.powerEnergy || 0);
  }
  if (!DecimalUtils.isDecimal(state.powerMaxEnergy)) {
    state.powerMaxEnergy = new Decimal(state.powerMaxEnergy || 100);
  }
  
  // Check if power was below 80 before recharge for Soap friendship reward
  const powerBeforeRecharge = state.powerEnergy;
  const shouldAwardSoapFriendship = powerBeforeRecharge.lt(80);
  
  state.powerEnergy = state.powerMaxEnergy;
  state.powerStatus = 'online';
  
  // Award Soap friendship points if conditions are met
  if (shouldAwardSoapFriendship) {
    awardSoapFriendshipForPowerRecharge();
  }
  
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

function awardSoapFriendshipForPowerRecharge() {
  // Award Soap friendship points when power recharge minigame is completed with <80 power
  if (window.friendship && typeof window.friendship.addPoints === 'function') {
    // Award a fixed amount of friendship points (3 points) for completing the power recharge minigame
    const friendshipGain = new Decimal(3);
    
    // Add the friendship points using Soap's character name - let the friendship system handle initialization
    window.friendship.addPoints('soap', friendshipGain);
  }
}

function closePowerMinigame() {
  // Clean up KitoFox mode flicker interval
  if (window.powerMinigameFlickerInterval) {
    clearInterval(window.powerMinigameFlickerInterval);
    window.powerMinigameFlickerInterval = null;
  }
  
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


  // Instead of creating a duplicate, just call the main renderGenerators function
  // which now handles both the base generator and the Mk.2 upgrade
  if (typeof renderGenerators === 'function') {
    renderGenerators();
    return;
  }

  // The main renderGenerators function now handles all power generator rendering
  // including the Mk.2 upgrade when Soap's friendship level reaches 4+
  updatePowerGeneratorUI();
}

// Debug functions for Soap's auto recharge system
window.testSoapAutoRecharge = function() {


  const config = getSoapAutoRechargeConfig();
  if (!config) {

    return;
  }



  // Simulate low power to test auto recharge
  if (state.soapAutoRecharge.storage > 0) {

    state.powerEnergy = new Decimal(15);

  } else {

    state.soapAutoRecharge.storage = 1;

  }

};

// Test function for Power Generator Mk.2 upgrade system
window.testPowerGeneratorMk2 = function() {

  // Check current friendship level
  let soapLevel = 0;
  if (window.friendship && window.friendship.Generator) {
    soapLevel = window.friendship.Generator.level || 0;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    soapLevel = friendship.Generator.level || 0;
  }

  const isMk2 = soapLevel >= 4;

  // Check if there are duplicate power generators
  const powerGenerators = document.querySelectorAll('.power-generator');

  if (powerGenerators.length > 1) {

    powerGenerators.forEach((gen, index) => {

    });
  } else if (powerGenerators.length === 1) {

    const generator = powerGenerators[0];
    const title = generator.querySelector('h3')?.textContent;

    // Check for Mk.2 styling (background color and border)
    const hasMk2Background = generator.style.cssText.includes('#181D36');
    const hasBlueBorder = generator.style.cssText.includes('rgba(33, 150, 243');
    const hasMk2Styling = hasMk2Background && hasBlueBorder;



    if (isMk2 && !hasMk2Styling) {

    } else if (!isMk2 && hasMk2Styling) {

    } else {

    }
    
    // Check that auto recharge is green (not blue)
    const autoRechargeSection = generator.querySelector('.auto-recharge-system');
    if (autoRechargeSection) {
      const isGreenAutoRecharge = autoRechargeSection.style.background.includes('76, 175, 80');

      if (!isGreenAutoRecharge) {

      } else {

      }
    }
  } else {

  }
  
  // Test buff description
  if (typeof getFriendshipBuffs === 'function') {
    const buffs = getFriendshipBuffs('Generator', soapLevel);

    Object.keys(buffs).forEach(level => {

    });
  }

};

// Force set Soap friendship level for testing Mk.2 upgrade
window.forceSoapLevelForMk2Test = function(targetLevel) {
  if (!window.friendship) {

    return;
  }
  
  const oldLevel = window.friendship.Generator.level || 0;
  window.friendship.Generator.level = targetLevel;

  // Re-render generators to see the change
  if (typeof renderGenerators === 'function') {
    renderGenerators();

  }
  
  // Run the test
  window.testPowerGeneratorMk2();
};

window.debugSoapAutoRecharge = function() {






};

// Test function for ENHANCED Box Generator Mk.2 system
window.testBoxGeneratorMk2 = function() {

  // Check friendship level
  let soapLevel = 0;
  if (window.friendship && window.friendship.Generator) {
    soapLevel = window.friendship.Generator.level || 0;
  } else if (typeof friendship !== 'undefined' && friendship.Generator) {
    soapLevel = friendship.Generator.level || 0;
  }


  // Check generators state

  generators.forEach((gen, i) => {

  });
  
  // Check if Mk.2 elements exist in DOM
  const mk2Generator = document.querySelector('.mk2-box-generator');
  const mk2Tracker = document.querySelector('.mk2-tracker');
  const mk2ProgressBar = document.getElementById('progress-mk2');
  const rainbowIcon = document.querySelector('.rainbow-effect');
  const megaRow = document.querySelector('.mk2-mega-row');
  const upgradeButtons = document.querySelectorAll('.mk2-box-generator button');







  // Check total boxes produced
  let totalBoxes = new Decimal(0);
  generators.forEach(gen => {
    if (gen.unlocked && state.boxesProducedByType && state.boxesProducedByType[gen.reward]) {
      const boxCount = DecimalUtils.isDecimal(state.boxesProducedByType[gen.reward]) 
        ? state.boxesProducedByType[gen.reward] 
        : new Decimal(state.boxesProducedByType[gen.reward] || 0);
      totalBoxes = totalBoxes.add(boxCount);

    }
  });

  // Test buff description
  if (typeof getFriendshipBuffs === 'function') {
    const buffs = getFriendshipBuffs('Generator', soapLevel);

    buffs.forEach(buff => {

    });
  }
  
  // Check enhanced features
  if (soapLevel >= 10) {






    // Check CSS animations
    if (rainbowIcon) {
      const computedStyle = window.getComputedStyle(rainbowIcon);


    }
  }

};

// Test Enhanced Mk.2 Visual Features
window.testMk2VisualFeatures = function() {

  const rainbowElements = document.querySelectorAll('.rainbow-effect');
  const megaRow = document.querySelector('.mk2-mega-row');
  const mk2Generator = document.querySelector('.mk2-box-generator');




  rainbowElements.forEach((el, i) => {
    const style = window.getComputedStyle(el);

  });
  
  if (mk2Generator) {
    const style = window.getComputedStyle(mk2Generator);

  }

};

// Force set Soap friendship level for testing Box Generator Mk.2
window.forceSoapLevelForBoxMk2Test = function(targetLevel) {
  if (!window.friendship) {

    return;
  }
  
  const oldLevel = window.friendship.Generator.level || 0;
  window.friendship.Generator.level = targetLevel;

  // Re-render generators to see the change
  if (typeof renderGenerators === 'function') {
    renderGenerators();

  }
  
  // Run the test
  window.testBoxGeneratorMk2();
};

// Quick function to unlock Soap level 10 for testing
window.unlockBoxGeneratorMk2ForTesting = function() {

  window.forceSoapLevelForBoxMk2Test(10);
  
  // Also unlock a few generators for better testing
  generators.forEach((gen, i) => {
    if (i < 3) { // Unlock first 3 generators
      gen.unlocked = true;

    }
  });
  
  // Re-render to show changes
  if (typeof renderGenerators === 'function') {
    renderGenerators();
  }

};

window.forceSoapAutoRecharge = function() {
  const config = getSoapAutoRechargeConfig();
  if (!config) {

    return;
  }
  
  if (!state.soapAutoRecharge) {
    state.soapAutoRecharge = { timer: config.timerMs, storage: 0, lastTick: Date.now() };
  }
  
  state.soapAutoRecharge.storage = Math.min(state.soapAutoRecharge.storage + 1, config.maxStorage);

  updatePowerGeneratorUI();
};

window.refreshPowerGeneratorUI = function() {





  if (typeof friendship !== 'undefined') {

  }

  renderPowerGenerator();

};

window.debugFriendshipAccess = function() {






};

window.forceAutoRechargeUI = function() {

  const powerCard = document.querySelector('.power-generator');
  if (!powerCard) {

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

  } else {
    powerCard.appendChild(autoRechargeDiv);

  }
};

window.addEventListener("load", () => {
  renderPowerGenerator();
  // Update recovery card visibility on page load
  updateRecoveryCardVisibility();
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
  state.kp = new Decimal(10000000);
  tryBuyElement(7);
  tryBuyElement(8);
  tryBuyElement(9);
  state.fluff = new Decimal("1e7"); 
  state.swaria = new Decimal("1e9"); 
  state.feathers = new Decimal("1e11"); 
  state.artifacts = new Decimal("1e13"); 
  state.kp = new Decimal("1e16"); 
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
  const beforeKP = state ? new Decimal(state.kp) : new Decimal(0);
  
  // Call original function
  _origTryBuyElement.apply(this, arguments);
  
  // Special handling for element 7
  if (index === 7) updatePowerEnergyStatusUI();
  
  // Validation for element 21 (and other high-value elements)
  if (index >= 21 && index <= 24) {
    // Verify the purchase was successful
    const afterPurchase = boughtElements[index];
    const afterKP = state ? new Decimal(state.kp) : new Decimal(0);
    const kpChanged = beforeKP.gt(afterKP);
    
    // If KP was deducted but element wasn't purchased, fix it
    if (kpChanged && !afterPurchase && !beforePurchase) {

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

}

switchHomeSubTab = function(subTabId) {
  // Debug current floor state

  // Check multiple indicators to determine if we're on Floor 2
  const isFloor2 = (window.currentFloor === 2) || 
                   (document.body.classList.contains('floor-2')) ||
                   (document.querySelector('.floor-2-indicator')) ||
                   (document.getElementById('terrariumTab') && document.getElementById('terrariumTab').style.display === 'block' && window.currentFloor !== 1);
  
  // Handle Floor 2 special cases to prevent flicker
  if (isFloor2) {

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

          window.waterFiltration.renderWaterFiltrationUI();
        }
        generatorMainTab.style.display = 'block'; // Show after content is ready

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

          window.observatory.renderObservatoryUI();
        }
        prismSubTab.style.display = 'block'; // Show after content is ready

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

    // Remove all Floor 2 department backgrounds and time-of-day classes when on Floor 1
    document.body.classList.remove('water-filtration-bg', 'observatory-bg', 'terrarium-bg');
    document.documentElement.classList.remove('water-filtration-bg', 'observatory-bg', 'terrarium-bg');
    document.body.classList.remove('day-time', 'dusk-time', 'night-time');
    document.documentElement.classList.remove('day-time', 'dusk-time', 'night-time');
    
    // Call original function first
    _origSwitchHomeSubTab4.apply(this, arguments);
    
    // Add verification and only restore if actually broken
    setTimeout(() => {

      if (subTabId === 'generatorMainTab') {
        const genTab = document.getElementById('generatorMainTab');
        const hasFloor2Content = genTab && genTab.innerHTML.includes('water-filtration-container');
        const hasBoxGenBtn = document.getElementById('generatorBoxGenBtn');
        const hasChargerBtn = document.getElementById('generatorChargerBtn');

        // Only restore if we have Floor 2 content or missing buttons
        if (hasFloor2Content || !hasBoxGenBtn || !hasChargerBtn) {

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

            }
            
            // Set up generator sub-tab buttons
            if (typeof setupGeneratorSubTabButtons === 'function') {
              setupGeneratorSubTabButtons();

            }
            
            // Ensure charger object exists with proper structure BEFORE loading state
            if (typeof window.charger === 'undefined') {

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

            }
            
            // Initialize charger milestone table
            if (typeof initializeChargerMilestoneTable === 'function') {
              initializeChargerMilestoneTable();

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

            }
            
            // Charger toggle button is handled by charger.js - don't duplicate the handler
            const chargerToggleBtn = document.getElementById('chargerToggleBtn');
            if (chargerToggleBtn && typeof window.charger !== 'undefined') {
              // Only update button text, don't add conflicting event handler
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

            }
            
            // Force a final UI update
            setTimeout(() => {
              if (typeof updateChargerUI === 'function') {
                updateChargerUI();

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

            }, 200);
          }, 100);
        } else {

        }
      }
      
      if (subTabId === 'prismSubTab') {
        const prismTab = document.getElementById('prismSubTab');
        const hasFloor2Content = prismTab && prismTab.innerHTML.includes('observatory-container');
        const hasLightGrid = document.getElementById('lightGrid');
        const hasPrismButtons = document.getElementById('prismTopButtons');

        // Only restore if we have Floor 2 content or missing elements
        if (hasFloor2Content || !hasLightGrid || !hasPrismButtons) {

          // Clear the tab completely
          prismTab.innerHTML = '';
          
          // Ensure prismState exists - now handled by state migration
          if (typeof window.prismState === 'undefined') {
            // Reference the state object instead of creating a new one
            window.prismState = state.prismState;
          }
          
          // Load prism state from save if it exists
          if (typeof loadGame === 'function') {

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

            } catch (error) {

            }
          }
          
          // Wait for initialization, then set up everything else
          setTimeout(() => {
            // Add prism background
            document.body.classList.add('prism-bg-active');
            
            // Set up all prism functions
            if (typeof setupPrismShineEffect === 'function') {
              setupPrismShineEffect();

            }
            
            if (typeof setupPrismSubTabButtons === 'function') {
              setupPrismSubTabButtons();

            }
            
            if (typeof updateAllLightCounters === 'function') {
              updateAllLightCounters();

            }
            
            if (typeof updateLightGeneratorButtons === 'function') {
              updateLightGeneratorButtons();

            }
            
            // Force multiple light counter updates
            if (typeof updateAllLightCounters === 'function') {
              updateAllLightCounters();

            }
            
            if (typeof forceUpdateAllLightCounters === 'function') {
              forceUpdateAllLightCounters();

            }
            
            // Ensure light generators card is visible and updated
            const lightUpgradesCard = document.getElementById('lightUpgradesCard');
            if (lightUpgradesCard) {
              // Make sure the card is visible
              lightUpgradesCard.style.display = 'block';
              lightUpgradesCard.style.visibility = 'visible';
              lightUpgradesCard.style.opacity = '1';

              // Ensure all generator buttons are visible
              const generatorButtons = ['lightGenBtn', 'redlightGenBtn', 'orangelightGenBtn', 'yellowlightGenBtn', 'greenlightGenBtn', 'bluelightGenBtn'];
              generatorButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                  btn.style.display = 'block';
                  btn.style.visibility = 'visible';

                } else {

                }
              });
              
              // Initialize prism system properly
              if (typeof window.initPrism === 'function') {

                window.initPrism();
              }
              
              // Update light generator buttons using the original function
              if (typeof window.updateLightGeneratorButtons === 'function') {

                window.updateLightGeneratorButtons();
              } else {

                // Set up a retry mechanism
                let retryCount = 0;
                const retryUpdate = () => {
                  if (typeof window.updateLightGeneratorButtons === 'function') {

                    window.updateLightGeneratorButtons();
                    
                    // Also ensure light counters are updated
                    if (typeof window.updateAllLightCounters === 'function') {
                      window.updateAllLightCounters();

                    }
                  } else if (retryCount < 10) {
                    retryCount++;
                    setTimeout(retryUpdate, 500);
                  }
                };
                setTimeout(retryUpdate, 500);
              }
            } else {

            }

            
            // Load advanced prism content if available
            const advancedPrismContent = document.getElementById('advancedPrismContent');
            if (advancedPrismContent && (!advancedPrismContent.innerHTML || advancedPrismContent.innerHTML.trim() === '' || advancedPrismContent.innerHTML.includes('coming soon'))) {

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

                  // First, ensure advanced prism state is unlocked
                  if (window.advancedPrismState) {
                    window.advancedPrismState.unlocked = true;

                  }
                  
                  initAdvancedPrism();

                  // Also try calling renderAdvancedPrismUI directly if available
                  setTimeout(() => {
                    if (typeof renderAdvancedPrismUI === 'function') {
                      try {
                        renderAdvancedPrismUI();

                      } catch (error) {

                      }
                    }
                    
                    // Ensure prism core state exists
                    if (window.prismCoreState) {

                    }
                  }, 100);
                  
                } catch (error) {

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

            }
            
            // Update all light generator displays after restoration
            if (typeof window.updateLightGeneratorDisplay === 'function') {
              const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
              lightTypes.forEach(type => {
                window.updateLightGeneratorDisplay(type);
              });

            }

            // Check if prism was properly created, if not create manually
            const lightGrid = document.getElementById('lightGrid');
            if (!lightGrid || lightGrid.children.length === 0) {

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

                    } else {
                      prismMainArea.appendChild(originalLightUpgradesCard);

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

                } else {

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

                  // Try to initialize the grid properly with prism functions
                  if (typeof initPrismGrid === 'function') {
                    initPrismGrid();

                  }
                  
                  // Use setupPrismGrid if available, otherwise fall back to manual setup
                  if (typeof window.setupPrismGrid === 'function') {
                    window.setupPrismGrid();

                  } else if (typeof setupPrismGrid === 'function') {
                    setupPrismGrid();

                  } else if (typeof clickLightTile === 'function' && lightGrid) {
                    // Manually setup grid clicks if setupPrismGrid doesn't exist
                    const tiles = lightGrid.querySelectorAll('.light-tile');
                    tiles.forEach((tile, index) => {
                      tile.onclick = () => {

                        clickLightTile(index);
                        
                        // Force comprehensive updates after click
                        setTimeout(() => {

                          // Update light counters
                          if (typeof window.updateAllLightCounters === 'function') {
                            window.updateAllLightCounters();

                          } else if (typeof window.forceUpdateAllLightCounters === 'function') {
                            window.forceUpdateAllLightCounters();

                          }
                          
                          // Update generator buttons
                          if (typeof window.updateLightGeneratorButtons === 'function') {
                            window.updateLightGeneratorButtons();

                          }
                          
                          // Force update boost text spans
                          if (typeof window.updateBoostDisplays === 'function') {
                            window.updateBoostDisplays();

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

                            }
                          });
                        }, 50);
                      
                      };
                    });

                  } else {

                  }
                  
                  // Update light counters again after grid setup
                  if (typeof updateAllLightCounters === 'function') {
                    updateAllLightCounters();

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

                          } catch (error) {

                          }
                        }
                      }, 50);
                    });

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

                        } else {

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

                        window.initPrism();
                      }
                      
                      // Update light generator buttons using the original function
                      if (typeof window.updateLightGeneratorButtons === 'function') {
                        window.updateLightGeneratorButtons();

                      } else {

                      }
                      
                      // Ensure light counters are properly updated
                      if (typeof window.updateAllLightCounters === 'function') {
                        window.updateAllLightCounters();

                      } else if (typeof window.forceUpdateAllLightCounters === 'function') {
                        window.forceUpdateAllLightCounters();

                      }
                      
                      // Force a full prism system restart to ensure everything works
                      setTimeout(() => {
                        // First, re-initialize the prism system completely


                        if (typeof window.initPrism === 'function') {
                          window.initPrism();

                        }
                        
                        if (typeof window.initializeDOMCache === 'function') {
                          window.initializeDOMCache();

                        }
                        
                        // Set up the prism grid properly
                        if (typeof window.setupPrismGrid === 'function') {
                          window.setupPrismGrid();

                        }
                        
                        if (typeof window.updateAllLightCounters === 'function') {
                          window.updateAllLightCounters();

                        }
                        
                        if (typeof window.updateLightGeneratorButtons === 'function') {
                          window.updateLightGeneratorButtons();

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

                          }
                        }
                        
                        // Final check for advanced prism rendering
                        if (typeof window.renderAdvancedPrismUI === 'function') {
                          try {
                            window.renderAdvancedPrismUI();

                          } catch (error) {

                          }
                        }
                        
                        // Check if prismState exists and has values


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

                  }, 200);
                }
              }, 50);
            }
          }, 100);
        } else {

        }
      }
    }, 50);

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

      } else if (subTabId === 'generatorMainTab' || subTabId === 'prismSubTab') {
        // Hide terrarium when switching to departments
        if (terrariumTab) terrariumTab.style.display = 'none';
        if (gamblingMainTab) gamblingMainTab.style.display = 'none';
        
        if (subTabId === 'generatorMainTab') {
          // Water Filtration Department
          if (window.waterFiltration && typeof window.waterFiltration.renderWaterFiltrationUI === 'function') {

            window.waterFiltration.renderWaterFiltrationUI();
          }
        } else if (subTabId === 'prismSubTab') {
          // Observatory Department
          if (window.observatory && typeof window.observatory.renderObservatoryUI === 'function') {

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

  } else {
    // Fallback to night-time for maximum mystical effect
    document.body.classList.add('night-time');
    document.documentElement.classList.add('night-time');

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

  } else {
    // Fallback to night-time for darker industrial effect
    document.body.classList.add('night-time');
    document.documentElement.classList.add('night-time');

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

  } else {
    // Fallback to day-time for natural effect
    document.body.classList.add('day-time');
    document.documentElement.classList.add('day-time');

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
  { text: "I bet even 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 can't out-clean me!", condition: () => true },
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
  { text: "Each expansions, We're getting more and more materials from 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒, I'm thinking of creating some sort of charger, but I'll need more ressources to do that.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.eq(3),},
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
  { text: "Between you and me, I think my auto recharge system is better than anything 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 could make.", condition: () => {
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
  
  // Search Mode Enhancement Dialogue - Only when friendship level 7+ AND at least 1 total infinity earned
  { text: "Hey! I just upgraded your anomaly resolver tool with a search function! Pretty cool, right?", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "I added a right-click search mode to your anomaly resolver. Now you can scan for nearby anomalies!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "The search function uses advanced soap bubble resonance to detect dimensional disturbances!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "I installed the search upgrade myself! Just right-click while in find mode to use it.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "My search mode enhancement can detect up to 3 anomalies at once! It's soap-powered, naturally.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "The anomaly search works by creating micro-bubbles that resonate with dimensional tears!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "I'm so proud of my search mode upgrade! No more guessing where anomalies might be hiding.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "The search function was tricky to build, but I managed to integrate it with your resolver perfectly!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "Thanks for trusting me enough to let me upgrade your equipment! The search mode is my masterpiece.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "Who knew soap chemistry could enhance anomaly detection? Science is amazing!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "Your anomaly resolver is now 150% more efficient thanks to my soap-based search algorithm!", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
  }},
  { text: "I hope you like the search mode! It should make finding anomalies much easier for you.", condition: () => {
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    return level >= 7 && hasInfinity;
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
  { text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 warned us about reality fluctuations. Do you know what they mean by that?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I wanna see an anomaly that creates infinite soap bubbles!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Sometimes I wonder if I'M the anomaly. I mean, who else loves soap this much? The anomaly resolver is saying I'm only 2% anomalous? I don't believe it.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "These anomalies are making the facility more interesting! Finally, something as unpredictable as my soap experiments. Hopefully these anomalies don't become dangerous.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Reaching through infinity apparently made reality as slippery as a wet soap bar. How fitting!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomalies seem to avoid my soap collection area. Maybe they're afraid of getting too clean?", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The other day, an anomaly turned my wrench into a bottle of ranch!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "These dimensional disturbances are like soap bubbles - beautiful, unpredictable, and they pop at random!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The facility's reality fabric is getting as slippery as my generator room floor.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  
  // Halloween-exclusive quotes (Soap Bubble Overlord theme)
  { text: "BEHOLD! I am the Soap Bubble Overlord! Bow before my sudsy magnificence!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My Halloween costume is perfect! I'm the supreme ruler of all soap bubbles!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Trick or treat? How about BUBBLES OR BUBBLES! Mwahahaha!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "As the Soap Bubble Overlord, I command you to appreciate the beauty of bubbles!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My soap bubble army is ready for Halloween! They're floating everywhere!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "This spooky outfit makes my soap collection look even more intimidating!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The generators are producing extra spooky bubbles tonight! Perfect for Halloween!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My Soap Bubble Overlord powers are at maximum strength during Halloween!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The facility looks so much more dramatic with all these Halloween bubbles floating around!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My overlord costume came with a bubble wand scepter! It's my new favorite tool!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Even Mystic is impressed by my Soap Bubble Overlord cooking skills! Bubble cuisine!", condition: () => window.state && window.state.halloweenEventActive && DecimalUtils.isDecimal(state.grade) && state.grade.gte(3) },
  { text: "Lepre tried to dodge my Halloween bubble attack, but my overlord powers are too strong!", condition: () => window.state && window.state.halloweenEventActive && DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "I wonder if Fluzzer would make a good bubble overlord minion? They're energetic enough at night!", condition: () => window.state && window.state.halloweenEventActive && DecimalUtils.isDecimal(state.grade) && state.grade.gte(6) },
  { text: "The spooky atmosphere makes my soap experiments feel more mystical and overlord-y!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I commanded my bubble army to decorate the generator room for Halloween!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Being a Soap Bubble Overlord is exhausting work, but someone has to rule the suds!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My overlord bubble shield can protect against any Halloween scares!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I'm thinking of expanding my overlord domain to include the entire facility!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Even 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 should fear the power of the Soap Bubble Overlord!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My Halloween bubble magic is making the generators extra bubbly tonight!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The other workers don't understand my overlord greatness yet, but they will!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I've been working on my overlord throne made entirely of soap bubbles!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "Halloween gives me the perfect excuse to embrace my true soap overlord nature!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My bubble overlord costume makes me feel invincible! Nothing can stop the suds!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "I tried to turn the power outages into dramatic overlord entrances, but nobody appreciated it!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "The spooky lighting makes my soap collection look like a proper overlord's treasure hoard!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "As the Soap Bubble Overlord, I declare this the most bubble-tastic Halloween ever!", condition: () => window.state && window.state.halloweenEventActive },
  { text: "My overlord auto-recharge system uses the power of Halloween magic and bubbles!", condition: () => window.state && window.state.halloweenEventActive && (() => { const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0; return level >= 4; })() },
  { text: "Even the anomalies bow before the mighty Soap Bubble Overlord! Well, maybe not, but they should!", condition: () => window.state && window.state.halloweenEventActive && window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
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

// Challenge speech quotes - Soap comparing their PB with player's PB
const soapChallengeQuotes = [
  // When player doesn't have a PB but Soap does
  { text: () => `My challenge time is ${(window.state.characterChallengePBs?.soap || 0)} seconds. Think you can beat that?`, condition: () => window.state.characterChallengePBs?.soap && !window.state.powerChallengePersonalBest },
  { text: () => `I got ${(window.state.characterChallengePBs?.soap || 0)} seconds on my first try! The soap made my fingers extra slippery!`, condition: () => window.state.characterChallengePBs?.soap && !window.state.powerChallengePersonalBest },
  { text: () => `${(window.state.characterChallengePBs?.soap || 0)} seconds, not bad for someone who spends all day with soap bars, right?`, condition: () => window.state.characterChallengePBs?.soap && !window.state.powerChallengePersonalBest },
  
  // When Soap's PB is better than player's (higher time = better in survival challenge)
  { text: () => `Hehe, my ${(window.state.characterChallengePBs?.soap || 0)} seconds beats your ${window.state.powerChallengePersonalBest || 0} seconds! Soap power!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.soap) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `My record is ${(window.state.characterChallengePBs?.soap || 0)} seconds, yours is ${window.state.powerChallengePersonalBest || 0}. I'm winning! Expected since I created this challenge!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.soap) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `I survived ${(parseFloat(window.state.characterChallengePBs?.soap || 0) - parseFloat(window.state.powerChallengePersonalBest || 0)).toFixed(2)} seconds longer than you! The soap makes me slippery AND speedy!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.soap) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `Your ${window.state.powerChallengePersonalBest || 0} seconds is pretty good, but my ${(window.state.characterChallengePBs?.soap || 0)} seconds is soap-erb!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.soap) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `I used my bubble-popping reflexes to survive ${(window.state.characterChallengePBs?.soap || 0)} seconds. Can you do better than ${window.state.powerChallengePersonalBest || 0}?`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.soap) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  
  // When player's PB is better than Soap's (player survived longer)
  { text: () => `Wow! Your ${window.state.powerChallengePersonalBest || 0} seconds destroys my ${(window.state.characterChallengePBs?.soap || 0)} seconds! How did you survive so long?`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.soap);
  }},
  { text: () => `Your ${window.state.powerChallengePersonalBest || 0} seconds beats my ${(window.state.characterChallengePBs?.soap || 0)}. I need to practice more bubble reflexes!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.soap);
  }},
  { text: () => `You survived ${(parseFloat(window.state.powerChallengePersonalBest || 0) - parseFloat(window.state.characterChallengePBs?.soap || 0)).toFixed(2)} seconds longer than me! Maybe I need soap-free fingers...`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.soap);
  }},
  { text: () => `I'm impressed! ${window.state.powerChallengePersonalBest || 0} seconds is way better than my ${(window.state.characterChallengePBs?.soap || 0)}. You've got skills!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.soap);
  }},
  { text: () => `My ${(window.state.characterChallengePBs?.soap || 0)} seconds can't compete with your ${window.state.powerChallengePersonalBest || 0}! I should've used less soap on my fingers!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.soap);
  }},
  
  // When PBs are very close (within 1 second)
  { text: () => `Our times are so close! Your ${window.state.powerChallengePersonalBest || 0} vs my ${(window.state.characterChallengePBs?.soap || 0)}. This is getting competitive!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.soap)) <= 1.0;
  }},
  { text: () => `We're practically tied! ${window.state.powerChallengePersonalBest || 0} seconds vs ${(window.state.characterChallengePBs?.soap || 0)} seconds. Want a rematch?`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.soap)) <= 1.0;
  }},
  { text: `Less than a second difference between us! This challenge is bringing out our competitive sides!`, condition: () => {
    return window.state.characterChallengePBs?.soap && window.state.powerChallengePersonalBest && 
           Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.soap)) <= 1.0;
  }},
  
  // General competitive banter
  { text: "I've been practicing the challenge during my breaks! My soap reflexes are getting faster!", condition: () => window.state.characterChallengePBs?.soap },
  { text: "The challenge is actually helping me react faster to power outages! Win-win!", condition: () => window.state.characterChallengePBs?.soap },
  { text: "I wonder if the other workers have challenge times too? We should compare everyone's records!", condition: () => window.state.characterChallengePBs?.soap || window.state.powerChallengePersonalBest },
  { text: "This challenge competition is almost as fun as my soap collection hobby!", condition: () => window.state.characterChallengePBs?.soap || window.state.powerChallengePersonalBest },
  { text: "Every time I see those red tiles, I think about our challenge rivalry! It's motivating!", condition: () => window.state.characterChallengePBs?.soap || window.state.powerChallengePersonalBest },
];

// Helper function for future character challenge speech systems
function getCharacterChallengeQuotes(characterKey) {
  switch(characterKey) {
    case 'soap':
      return soapChallengeQuotes;
    case 'tico':
      // Access Tico's challenge quotes from the front desk instance
      return window.frontDesk ? window.frontDesk.ticochallengeQuotes : [];
    case 'mystic':
      // Access Mystic's challenge quotes from the kitchen system
      return typeof mysticChallengeQuotes !== 'undefined' ? mysticChallengeQuotes : [];
    case 'lepre':
      // Access Lepre's challenge quotes from the boutique system
      return window.boutique ? window.boutique.getLepreChallengeQuotes() : [];
    case 'vi':
      // Access Vi's challenge quotes from the advanced prism system
      return (window.viSpeechPatterns && window.viSpeechPatterns.challengeQuotes) ? window.viSpeechPatterns.challengeQuotes : [];
    case 'fluzzer':
      // Access Fluzzer's challenge quotes from the terrarium system
      return (typeof getFluzzerChallengeQuotes !== 'undefined') ? getFluzzerChallengeQuotes() : [];
    case 'bijou':
      // Access Bijou's challenge quotes from the premium system
      return (typeof getBijouChallengeQuotes !== 'undefined') ? getBijouChallengeQuotes() : [];
    // Future characters can be added here
    // etc.
    default:
      return [];
  }
}

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
  
  // 15% chance for challenge speech (only if quest 5 is completed to unlock the challenge)
  const questCompleted = window.state?.questSystem?.completedQuests?.includes('soap_quest_5') || false;
  const shouldUseChallengeQuotes = questCompleted && Math.random() < 0.15;
  
  // Ensure character PBs exist if we're going to use challenge quotes
  if (shouldUseChallengeQuotes && typeof window.ensureCharacterPBsExist === 'function') {
    window.ensureCharacterPBsExist();
  }
  
  // Check if soap generator anomaly is active - if so, only show anomaly dialogue
  let availableQuotes;
  if (shouldUseChallengeQuotes) {
    // Use challenge quotes - filter for conditions that are currently true
    availableQuotes = soapChallengeQuotes.filter(q => q.condition());
  } else if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly) {
    // Filter for only anomaly-specific dialogue
    availableQuotes = soapQuotes.filter(q => {
      return q.condition() && q.text.includes('generator') || q.text.includes('soap') || q.text.includes('bubble') || q.text.includes('anomaly');
    });
    // If no specific anomaly quotes available, use all anomaly quotes
    if (availableQuotes.length === 0) {
      availableQuotes = soapQuotes.filter(q => q.condition() && q.condition.toString().includes('soapGeneratorAnomaly'));
    }
  } else {
    // Halloween dialogue system: 50% chance for Halloween quotes when Halloween is active
    if (window.state && window.state.halloweenEventActive) {
      const halloweenQuotes = soapQuotes.filter(q => q.condition() && q.condition.toString().includes('halloweenEventActive'));
      const normalQuotes = soapQuotes.filter(q => q.condition() && !q.condition.toString().includes('halloweenEventActive') && !q.condition.toString().includes('soapGeneratorAnomaly'));
      
      // 50% chance to use Halloween quotes, 50% for normal quotes
      if (Math.random() < 0.5 && halloweenQuotes.length > 0) {
        availableQuotes = halloweenQuotes;
      } else {
        availableQuotes = normalQuotes.length > 0 ? normalQuotes : soapQuotes.filter(q => q.condition() && !q.condition.toString().includes('soapGeneratorAnomaly'));
      }
    } else {
      // When Halloween is not active, filter out Halloween-only quotes and anomaly quotes
      availableQuotes = soapQuotes.filter(q => {
        return q.condition() && !q.condition.toString().includes('soapGeneratorAnomaly') && !q.condition.toString().includes('halloweenEventActive');
      });
    }
  }
  
  const randomQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  const quoteText = randomQuote ? (typeof randomQuote.text === 'function' ? randomQuote.text() : randomQuote.text) : "...";
  soapSpeech.textContent = quoteText;
  soapSpeech.style.display = "block";
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  
  // Show disappointed speech for longer (12 seconds)
  window.soapCurrentSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
  if (!state.boughtElements[12]) return new Decimal(1);
  let count = 0;
  if (typeof generators !== 'undefined') {
    count = GeneratorUtils.countUnlocked(generators);
  }
  return new Decimal(1).add(new Decimal(count).mul(0.1)); 
}

function getBoxTypeBoost(type) {
  if (!state.boughtElements[11]) return new Decimal(1);
  return new Decimal(1).add(new Decimal(state.boxesProducedByType[type] || 0).mul(0.01));
}

window.generators = generators;
// Legacy autosave disabled - using SaveSystem autosave instead
// window.autosaveInterval = setInterval(() => {
//   if (settings.autosave && typeof saveGame === "function") saveGame();
// }, (window.settings && window.settings.autosaveInterval ? window.settings.autosaveInterval : 30) * 1000); 

// Function to restart legacy autosave with new interval - DISABLED
window.restartLegacyAutosave = function() {
  // Legacy autosave disabled - main SaveSystem handles autosaving
};

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
  const ps = (typeof state.prismState !== 'undefined' && state.prismState) ? state.prismState : {light:0};
  let baseResource;
  if (state.boughtElements[30]) {
    baseResource = state.fluff;
  } else if (state.boughtElements[20]) {
    baseResource = state.swaria;
  } else if (state.boughtElements[10]) {
    baseResource = state.feathers;
  } else {
    baseResource = state.artifacts;
  }
  let preview = new Decimal(baseResource).mul(10).sqrt().mul(new Decimal(1).add(new Decimal(ps.light || 0).mul(0.01))).floor();
  const kpDecimal = DecimalUtils.isDecimal(state.kp) ? state.kp : new Decimal(state.kp || 0);
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
  
  // Apply total infinity reached boost to KP gain preview
  if (typeof window.applyTotalInfinityReachedBoost === 'function') {
    preview = window.applyTotalInfinityReachedBoost(preview);
  }
  
  // Apply permanent berry plate boost to KP gain preview
  if (window.state && window.state.deliverySystem && window.state.deliverySystem.kpBoostFromBerryPlates) {
    const berryPlateBoost = DecimalUtils.toDecimal(window.state.deliverySystem.kpBoostFromBerryPlates);
    if (berryPlateBoost.gt(1)) {
      preview = preview.mul(berryPlateBoost);
    }
  }
  
  return preview;
}

// Make getKpGainPreview globally accessible
window.getKpGainPreview = getKpGainPreview;

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
  // OLD UI FUNCTION - DISABLED - NEW SAVE SYSTEM HAS ITS OWN UI
  console.warn('updateSaveSlotModal() is deprecated. New save system manages its own UI.');
  return; // Disabled - new save system handles this
  
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
          <div>KP: ${formatNumber(data.state?.kp || 0)}</div>
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
        
        // Reset infinity system for new slot
        if (typeof window.infinitySystem !== 'undefined' && window.infinitySystem) {
          // Reset infinity counts
          window.infinitySystem.counts = {
            fluff: 0,
            swaria: 0,
            feathers: 0,
            artifacts: 0,
            light: 0,
            redLight: 0,
            orangeLight: 0,
            yellowLight: 0,
            greenLight: 0,
            blueLight: 0,
            terrariumPollen: 0,
            terrariumFlowers: 0,
            terrariumNectar: 0,
            charge: 0
          };
          
          // Reset infinity discovery flags
          window.infinitySystem.everReached = {
            fluff: false,
            swaria: false,
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
          
          // Reset currency images
          if (typeof window.infinitySystem.resetAllCurrencyImages === 'function') {
            window.infinitySystem.resetAllCurrencyImages();
          }
          
          // Reset infinity points and theorems
          window.infinitySystem.infinityPoints = new Decimal(0);
          window.infinitySystem.infinityTheorems = 0;
          window.infinitySystem.totalInfinityTheorems = 0;
          window.infinitySystem.theoremProgress = new Decimal(0);
          window.infinitySystem.totalInfinityEarned = 0;
          window.infinitySystem.lastInfinityPointsUpdate = Date.now();
        }
        
        // Automatically load the newly created slot
        loadFromSlot(i);
        
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
  // OLD SAVE FUNCTION - DISABLED - USE NEW SAVE SYSTEM INSTEAD
  console.warn('saveToSlot() is deprecated. Use window.SaveSystem.saveGame() instead.');
  return false; // Disabled
  
  // Check if save is already in progress
  if (saveMutex) {
    return false;
  }
  
  // Set mutex to prevent simultaneous saves
  saveMutex = true;
  
  try {
    // Create infinity data backup before any save operation
    if (window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0) {
      const infinityBackup = {
        counts: window.infinitySystem.counts || {},
        everReached: window.infinitySystem.everReached || {},
        infinityPoints: window.infinitySystem.infinityPoints ? window.infinitySystem.infinityPoints.toString() : "0",
        infinityTheorems: window.infinitySystem.infinityTheorems || 0,
        totalInfinityTheorems: window.infinitySystem.totalInfinityTheorems || 0,
        theoremProgress: window.infinitySystem.theoremProgress ? window.infinitySystem.theoremProgress.toString() : "0",
        totalInfinityEarned: window.infinitySystem.totalInfinityEarned || 0,
        lastInfinityPointsUpdate: window.infinitySystem.lastInfinityPointsUpdate || Date.now(),
        backupTimestamp: Date.now()
      };
      localStorage.setItem(`infinityBackup_slot${slotNumber}`, JSON.stringify(infinityBackup));
    }
    
    // Enhanced validation to prevent corrupted saves
    // Always validate but don't fail save completely to preserve infinity data
    const validationResult = validateGameState();
    if (!validationResult) {
      console.warn('Save validation had issues but continuing to preserve infinity data');
    }
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
    // Infinity data is now saved as part of window.state,
    
    // Add infinity upgrades and caps
    infinityUpgrades: window.infinityUpgrades || {},
    infinityCaps: window.infinityCaps || {}
  };
  
  // Use DecimalUtils to serialize the save data for slot storage
  const serializedSaveData = DecimalUtils.serializeGameState(saveData);
  
  // Atomic save operation - write to temporary location first
  const tempKey = `swariaSaveSlot${slotNumber}_temp`;
  const finalKey = `swariaSaveSlot${slotNumber}`;
  const backupKey = `swariaSaveSlot${slotNumber}_backup`;
  
  // Create backup before saving
  const currentSave = localStorage.getItem(finalKey);
  if (currentSave) {
    localStorage.setItem(backupKey, currentSave);
  }
  
  // Write to temporary location first
  const saveDataString = JSON.stringify(serializedSaveData);
  localStorage.setItem(tempKey, saveDataString);
  
  // Verify the temporary save was written correctly
  const tempData = localStorage.getItem(tempKey);
  if (tempData && tempData === saveDataString) {
    // Only overwrite real save if temp write succeeded and matches
    localStorage.setItem(finalKey, tempData);
    localStorage.removeItem(tempKey);
  } else {
    // If temp save failed, clean up and throw error
    localStorage.removeItem(tempKey);
    throw new Error('Atomic save verification failed');
  }
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
    alert('Save failed! Your progress was not saved to prevent corruption.');
    return false;
  } finally {
    // Always release the mutex, whether save succeeded or failed
    saveMutex = false;
  }
}

function loadFromSlot(slotNumber) {
  // OLD LOAD FUNCTION - DISABLED - USE NEW SAVE SYSTEM INSTEAD
  console.warn('loadFromSlot() is deprecated. Use window.SaveSystem.setCurrentSlot() and window.SaveSystem.loadGame() instead.');
  return false; // Disabled
  
  const slotData = localStorage.getItem(`swariaSaveSlot${slotNumber}`);
  
  // Reset permanent tab unlocks when switching save slots
  if (typeof window.resetPermanentTabUnlocks === 'function') {
    window.resetPermanentTabUnlocks();
  }
  
  // Reset permanent element discovery to default state when switching slots
  if (window.state) {
    window.state.permanentElementDiscovery = {
      highestGradeAchieved: 1,
      permanentlyDiscoveredElements: new Set([1, 2, 3, 4, 5, 6, 7, 8])
    };
  }
  
  if (!slotData) {
    // If slot is empty, reset to clean state
    window.boughtElements = {};
    
    // Also reset other permanent flags for empty slots
    window.hardModePermanentlyUnlocked = false;
    
    if (typeof window.prismAdvancedLabUnlocked !== 'undefined') {
      window.prismAdvancedLabUnlocked = false;
    }
    
    if (typeof window.controlCenterUnlocked !== 'undefined') {
      window.controlCenterUnlocked = false;
    }
    
    if (typeof window.advancedPrismState !== 'undefined' && window.advancedPrismState) {
      window.advancedPrismState.unlocked = false;
    }
    
    if (typeof window.terrariumUpgradesUnlocked !== 'undefined') {
      window.terrariumUpgradesUnlocked = {
        pollen3: false,
        pollen4: false,
        pollen5: false,
        flower2: false,
        flower3: false,
        flower4: false,
        flower5: false,
        nectarSection: false
      };
    }
    
    // Reset anomaly system for empty slots (if it exists)
    if (typeof window.anomalySystem !== 'undefined' && window.anomalySystem) {
      // Clear all visual anomalies
      if (typeof window.clearAllAnomalies === 'function') {
        window.clearAllAnomalies();
      }
      
      // Reset all active anomaly flags
      window.anomalySystem.activeAnomalies = {
        clockAnomaly: false,
        backwardClockAnomaly: false,
        boxOrderAnomaly: false,
        soapGeneratorAnomaly: false,
        shopPriceAnomaly: false,
        darkVoidAnomaly: false,
        prismMirrorAnomaly: false,
        cargoOmegaBoxAnomaly: false,
        blurpleLightAnomaly: false,
        boxGeneratorFreezeAnomaly: false,
        labDarknessAnomaly: false,
        prismGreyAnomaly: false,
        notationScrambleAnomaly: false,
        crabBucksAnomaly: false,
        fluzzerFlipAnomaly: false,
        rustlingFlowersAnomaly: false,
        dramaticWindAnomaly: false
      };
      
      // Clear anomaly-related timers and intervals
      if (window.anomalySystem.darkVoidProgressTimer) {
        clearInterval(window.anomalySystem.darkVoidProgressTimer);
        window.anomalySystem.darkVoidProgressTimer = null;
      }
      if (window.anomalySystem.viPanicInterval) {
        clearInterval(window.anomalySystem.viPanicInterval);
        window.anomalySystem.viPanicInterval = null;
      }
      if (window.anomalySystem.cursorAnimationInterval) {
        clearInterval(window.anomalySystem.cursorAnimationInterval);
        window.anomalySystem.cursorAnimationInterval = null;
      }
      if (window.anomalySystem.clockAnomalyInterval) {
        clearInterval(window.anomalySystem.clockAnomalyInterval);
        window.anomalySystem.clockAnomalyInterval = null;
      }
      if (window.anomalySystem.backwardClockAnomalyInterval) {
        clearInterval(window.anomalySystem.backwardClockAnomalyInterval);
        window.anomalySystem.backwardClockAnomalyInterval = null;
      }
      
      // Reset other anomaly state variables
      window.anomalySystem.frozenGeneratorId = null;
      window.anomalySystem.anomalyAffectedItem = null;
      window.anomalySystem.analyzing = false;
      window.anomalySystem.searching = false;
      window.anomalySystem.findModeActive = false;
      
      // Clear anomaly localStorage
      if (typeof window.anomalySystem.clearAnomalyState === 'function') {
        window.anomalySystem.clearAnomalyState();
      }
    }
    
    // Reset advanced prism state (if it exists)
    if (typeof window.advancedPrismState !== 'undefined' && window.advancedPrismState) {
      window.advancedPrismState = {
        unlocked: false,
        viSpeechActive: false,
        viSpeechTimeout: null,
        swariaSpechTimeout: null,
        viCurrentState: 'normal',
        viLastInteractionTime: 0,
        imagesSwapped: false,
        advancedTabClicks: 0,
        labTabClicks: 0,
        hasCompletedLabClicks: false,
        hasShownLabDialogue: false,
        resetLayer: {
          points: new Decimal(0),
          timesReset: new Decimal(0),
          canReset: false
        },
        calibration: {
          stable: {
            light: new Decimal(0),
            redlight: new Decimal(0),
            orangelight: new Decimal(0),
            yellowlight: new Decimal(0),
            greenlight: new Decimal(0),
            bluelight: new Decimal(0)
          },
          nerfs: {
            light: new Decimal(1),
            redlight: new Decimal(1),
            orangelight: new Decimal(1),
            yellowlight: new Decimal(1),
            greenlight: new Decimal(1),
            bluelight: new Decimal(1)
          },
          activeMinigame: null,
          minigameStartTime: 0,
          lastSaveTime: 0,
          lastSessionEfficiency: 1.0,
          sessionPenalty: {
            light: new Decimal(1.0),
            redlight: new Decimal(1.0),
            orangelight: new Decimal(1.0),
            yellowlight: new Decimal(1.0),
            greenlight: new Decimal(1.0),
            bluelight: new Decimal(1.0)
          },
          totalTimeAccumulated: {
            light: 0,
            redlight: 0,
            orangelight: 0,
            yellowlight: 0,
            greenlight: 0,
            bluelight: 0
          },
          waveFrequency: 1,
          optimalFrequency: 1,
          wavePhase: 0,
          lastAnimationTime: 0,
          minigameInterval: null,
          drainInterval: null
        }
      };
    }
    
    // Create a clean save object without advanced prism data to prevent it from being loaded
    const emptySaveData = {
      state: {
        fluff: 0,
        swaria: 0,
        feathers: 0,
        artifacts: 0,
        kp: 0,
        grade: 1,
        swabucks: 0,
        characterHunger: {},
        characterFullStatus: {},
        hardModeQuestActive: false,
        hardModeQuestProgress: {},
        permanentElementDiscovery: {
          highestGradeAchieved: 1,
          permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      },
      generators: [],
      friendship: {},
      boughtElements: {},
      generatorUpgrades: { common: 0, uncommon: 0, rare: 0, legendary: 0, mythic: 0 },
      prismState: { light: 0, redlight: 0, orangelight: 0, yellowlight: 0, greenlight: 0, bluelight: 0 },
      settings: { theme: 'light', colour: 'green', style: 'rounded', autosave: true },
      swariaKnowledge: {},
      intercomState: { intercomEventTriggered: false, intercomEvent20Triggered: false },
      prismAdvancedLabUnlocked: false
    };
    
    // Save the clean state to the slot
    const serializedData = DecimalUtils.serializeGameState(emptySaveData);
    localStorage.setItem(`swariaSaveSlot${slotNumber}`, JSON.stringify(serializedData));
    
    // Reset infinity system (if it exists)
    if (typeof window.infinitySystem !== 'undefined' && window.infinitySystem) {
      // Reset infinity counts
      window.infinitySystem.counts = {
        fluff: 0,
        swaria: 0,
        feathers: 0,
        artifacts: 0,
        light: 0,
        redLight: 0,
        orangeLight: 0,
        yellowLight: 0,
        greenLight: 0,
        blueLight: 0,
        terrariumPollen: 0,
        terrariumFlowers: 0,
        terrariumNectar: 0,
        charge: 0
      };
      
      // Reset infinity discovery flags
      window.infinitySystem.everReached = {
        fluff: false,
        swaria: false,
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
      
      // Reset infinity points and other infinity state
      window.infinitySystem.infinityPoints = new Decimal(0);
      window.infinitySystem.totalInfinityEarned = 0;
      window.infinitySystem.lastInfinityPointsUpdate = Date.now();
      
      // Reset infinity upgrades
      if (typeof window.infinityUpgrades !== 'undefined' && window.infinityUpgrades) {
        Object.keys(window.infinityUpgrades).forEach(key => {
          window.infinityUpgrades[key] = 0;
        });
      }
    }
    
      // Reset story modal flags
      if (window.state) {
        window.state.seenFirstDeliveryStory = false;
        window.state.seenGeneratorUnlockStory = false;
        window.state.seenKpSoftcapStory = false;
        window.state.seenKpMildcapStory = false;
        window.state.seenNectarizeResetStory = false;
        window.state.seenInfinityFluffStory = false;
        window.state.seenInfinityResetStory = false;
        window.state.seenElement25StoryModal = false;
      }
      
      // Reset intercom event flags (element 10 and 20 dialogues)
      if (typeof window.intercomEventTriggered !== 'undefined') {
        window.intercomEventTriggered = false;
      }
      if (typeof window.intercomEvent20Triggered !== 'undefined') {
        window.intercomEvent20Triggered = false;
      }
      
      // Reset intercom event flags for empty slots (element 10 and 20 dialogues)
      if (typeof window.intercomEventTriggered !== 'undefined') {
        window.intercomEventTriggered = false;
      }
      if (typeof window.intercomEvent20Triggered !== 'undefined') {
        window.intercomEvent20Triggered = false;
      }
      
      // Clear element 25 story flag for empty slots
      localStorage.removeItem(`element25StoryShown_${slotNumber}`);
      
    return;
  }
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
      
      // Restore permanent element discovery data
      if (typeof data.permanentElementDiscovery !== 'undefined') {
        state.permanentElementDiscovery = {
          highestGradeAchieved: data.permanentElementDiscovery.highestGradeAchieved || 1,
          permanentlyDiscoveredElements: new Set(data.permanentElementDiscovery.permanentlyDiscoveredElements || [1, 2, 3, 4, 5, 6, 7, 8])
        };
      } else if (!state.permanentElementDiscovery) {
        // Initialize if not present
        state.permanentElementDiscovery = {
          highestGradeAchieved: 1,
          permanentlyDiscoveredElements: new Set([1, 2, 3, 4, 5, 6, 7, 8])
        };
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
    
    // Infinity data is now loaded as part of window.state
    
    // Update infinity displays after loading
    if (typeof updateInfinityBenefits === 'function') {
      updateInfinityBenefits();
    }
    if (typeof updateInfinitySubTabVisibility === 'function') {
      updateInfinitySubTabVisibility();
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
    // Show Lab (prismSubTabBtn) at grade >= 2 OR if player has at least 1 total infinity earned, but hide on floor 2
    const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    const gradeUnlock = typeof state.grade !== 'undefined' && DecimalUtils.isDecimal(state.grade) && state.grade.gte(2);
    if (hasInfinityUnlock || gradeUnlock) {
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
    state.currentKnowledgeSubTab = 'elementsMain';
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
    // Migrate old kitchenIngredients to window.state.tokens if present
    if (data.kitchenIngredients) {
      // Initialize tokens section if it doesn't exist
      if (!window.state.tokens) {
        window.state.tokens = {
          berries: new Decimal(0),
          sparks: new Decimal(0),
          petals: new Decimal(0),
          mushroom: new Decimal(0),
          water: new Decimal(0),
          prisma: new Decimal(0),
          stardust: new Decimal(0)
        };
      }
      
      // Migrate basic ingredient tokens from kitchenIngredients to state.tokens
      const basicTokenTypes = ['mushroom', 'sparks', 'berries', 'petals', 'water', 'prisma', 'stardust'];
      for (const type of basicTokenTypes) {
        if (data.kitchenIngredients[type] !== undefined) {
          const value = data.kitchenIngredients[type];
          window.state.tokens[type] = DecimalUtils.isDecimal(value) ? value : new Decimal(value || 0);
        }
      }
    }
    
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

    // Try to recover from backup
    const backupKey = `swariaSaveSlot${slotNumber}_backup`;
    const backupData = localStorage.getItem(backupKey);
    if (backupData && confirm('Main save file appears corrupted. Would you like to restore from backup?')) {
      try {
        localStorage.setItem(`swariaSaveSlot${slotNumber}`, backupData);
        loadFromSlot(slotNumber); // Try loading again
        return;
      } catch (backupError) {

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

      alert('Failed to restore from backup.');
      return false;
    }
  }
  return false;
}

function deleteSlot(slotNumber) {
  if (confirm(`Are you sure you want to delete save slot ${slotNumber}?`)) {
    const currentSlot = localStorage.getItem('currentSaveSlot');
    const isCurrentSlot = currentSlot && currentSlot === slotNumber.toString();
    
    // Remove main save slot data
    localStorage.removeItem(`swariaSaveSlot${slotNumber}`);
    
    // Clean up all slot-specific data
    // Save system disabled - slot-specific data removal disabled
    
    // Remove achievement data for this slot
    localStorage.removeItem(`fluffIncAchievementsSlot${slotNumber}`);
    localStorage.removeItem(`fluffIncSecretAchievementsSlot${slotNumber}`);
    
    // Remove element 25 story flag for this slot
    localStorage.removeItem(`element25StoryShown_${slotNumber}`);
    
    // Remove permanent tab unlock data for this slot
    // Save system disabled - permanent tab unlock data removal disabled

    // If we deleted the currently active slot, reset the session to default state
    if (isCurrentSlot) {
      // Reset to default state
      window.boughtElements = {};
      
      // Reset infinity system to default state
      if (typeof window.infinitySystem !== 'undefined') {
        // Reset all infinity counts to 0
        for (const currencyName in window.infinitySystem.counts) {
          window.infinitySystem.counts[currencyName] = 0;
        }
        
        // Reset all "ever reached" flags to false
        for (const currencyName in window.infinitySystem.everReached) {
          window.infinitySystem.everReached[currencyName] = false;
        }
        
        // Reset currency images back to normal (remove infinity symbols)
        if (typeof window.infinitySystem.resetAllCurrencyImages === 'function') {
          window.infinitySystem.resetAllCurrencyImages();
        }
        
        // Reset other infinity system properties
        window.infinitySystem.infinityPoints = new Decimal(0);
        window.infinitySystem.infinityTheorems = 0;
        window.infinitySystem.totalInfinityTheorems = 0;
        window.infinitySystem.theoremProgress = new Decimal(0);
        window.infinitySystem.totalInfinityEarned = 0;
      }
      
      // Reset all permanent unlock flags
      if (typeof window.resetPermanentTabUnlocks === 'function') {
        window.resetPermanentTabUnlocks();
      }
      
      // Reset other permanent flags
      window.hardModePermanentlyUnlocked = false;
      
      // Reset prism advanced lab unlock (if it exists)
      if (typeof window.prismAdvancedLabUnlocked !== 'undefined') {
        window.prismAdvancedLabUnlocked = false;
      }
      
      // Reset control center unlock (if it exists)
      if (typeof window.controlCenterUnlocked !== 'undefined') {
        window.controlCenterUnlocked = false;
      }
      
      // Reset advanced prism state (if it exists)
      if (typeof window.advancedPrismState !== 'undefined' && window.advancedPrismState) {
        window.advancedPrismState = {
          unlocked: false,
          viSpeechActive: false,
          viSpeechTimeout: null,
          swariaSpechTimeout: null,
          viCurrentState: 'normal',
          viLastInteractionTime: 0,
          imagesSwapped: false,
          advancedTabClicks: 0,
          labTabClicks: 0,
          hasCompletedLabClicks: false,
          hasShownLabDialogue: false,
          resetLayer: {
            points: new Decimal(0),
            timesReset: new Decimal(0),
            canReset: false
          },
          calibration: {
            stable: {
              light: new Decimal(0),
              redlight: new Decimal(0),
              orangelight: new Decimal(0),
              yellowlight: new Decimal(0),
              greenlight: new Decimal(0),
              bluelight: new Decimal(0)
            },
            nerfs: {
              light: new Decimal(1),
              redlight: new Decimal(1),
              orangelight: new Decimal(1),
              yellowlight: new Decimal(1),
              greenlight: new Decimal(1),
              bluelight: new Decimal(1)
            },
            activeMinigame: null,
            minigameStartTime: 0,
            lastSaveTime: 0,
            lastSessionEfficiency: 1.0,
            sessionPenalty: {
              light: new Decimal(1.0),
              redlight: new Decimal(1.0),
              orangelight: new Decimal(1.0),
              yellowlight: new Decimal(1.0),
              greenlight: new Decimal(1.0),
              bluelight: new Decimal(1.0)
            },
            totalTimeAccumulated: {
              light: 0,
              redlight: 0,
              orangelight: 0,
              yellowlight: 0,
              greenlight: 0,
              bluelight: 0
            },
            waveFrequency: 1,
            optimalFrequency: 1,
            wavePhase: 0,
            lastAnimationTime: 0,
            minigameInterval: null,
            drainInterval: null
          }
        };
      }
      
      // Reset terrarium upgrades unlocked (if it exists)
      if (typeof window.terrariumUpgradesUnlocked !== 'undefined') {
        window.terrariumUpgradesUnlocked = {
          pollen3: false,
          pollen4: false,
          pollen5: false,
          flower2: false,
          flower3: false,
          flower4: false,
          flower5: false,
          nectarSection: false
        };
      }
      
      // Reset anomaly system (if it exists)
      if (typeof window.anomalySystem !== 'undefined' && window.anomalySystem) {
        // Clear all visual anomalies
        if (typeof window.clearAllAnomalies === 'function') {
          window.clearAllAnomalies();
        }
        
        // Reset all active anomaly flags
        window.anomalySystem.activeAnomalies = {
          clockAnomaly: false,
          backwardClockAnomaly: false,
          boxOrderAnomaly: false,
          soapGeneratorAnomaly: false,
          shopPriceAnomaly: false,
          darkVoidAnomaly: false,
          prismMirrorAnomaly: false,
          cargoOmegaBoxAnomaly: false,
          blurpleLightAnomaly: false,
          boxGeneratorFreezeAnomaly: false,
          labDarknessAnomaly: false,
          prismGreyAnomaly: false,
          notationScrambleAnomaly: false,
          crabBucksAnomaly: false,
          fluzzerFlipAnomaly: false,
          rustlingFlowersAnomaly: false,
          dramaticWindAnomaly: false
        };
        
        // Clear anomaly-related timers and intervals
        if (window.anomalySystem.darkVoidProgressTimer) {
          clearInterval(window.anomalySystem.darkVoidProgressTimer);
          window.anomalySystem.darkVoidProgressTimer = null;
        }
        if (window.anomalySystem.viPanicInterval) {
          clearInterval(window.anomalySystem.viPanicInterval);
          window.anomalySystem.viPanicInterval = null;
        }
        if (window.anomalySystem.cursorAnimationInterval) {
          clearInterval(window.anomalySystem.cursorAnimationInterval);
          window.anomalySystem.cursorAnimationInterval = null;
        }
        if (window.anomalySystem.clockAnomalyInterval) {
          clearInterval(window.anomalySystem.clockAnomalyInterval);
          window.anomalySystem.clockAnomalyInterval = null;
        }
        if (window.anomalySystem.backwardClockAnomalyInterval) {
          clearInterval(window.anomalySystem.backwardClockAnomalyInterval);
          window.anomalySystem.backwardClockAnomalyInterval = null;
        }
        
        // Reset other anomaly state variables
        window.anomalySystem.frozenGeneratorId = null;
        window.anomalySystem.anomalyAffectedItem = null;
        window.anomalySystem.analyzing = false;
        window.anomalySystem.searching = false;
        window.anomalySystem.findModeActive = false;
        
        // Clear anomaly localStorage
        if (typeof window.anomalySystem.clearAnomalyState === 'function') {
          window.anomalySystem.clearAnomalyState();
        }
      }
      
      // Create a clean save object without advanced prism data to prevent it from being loaded
      const emptySaveData = {
        state: {
          fluff: 0,
          swaria: 0,
          feathers: 0,
          artifacts: 0,
          kp: 0,
          grade: 1,
          swabucks: 0,
          characterHunger: {},
          characterFullStatus: {},
          hardModeQuestActive: false,
          hardModeQuestProgress: {},
          permanentElementDiscovery: {
            highestGradeAchieved: 1,
            permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8]
          }
        },
        generators: [],
        friendship: {},
        boughtElements: {},
        generatorUpgrades: { common: 0, uncommon: 0, rare: 0, legendary: 0, mythic: 0 },
        prismState: { light: 0, redlight: 0, orangelight: 0, yellowlight: 0, greenlight: 0, bluelight: 0 },
        settings: { theme: 'light', colour: 'green', style: 'rounded', autosave: true },
        swariaKnowledge: {},
        intercomState: { intercomEventTriggered: false, intercomEvent20Triggered: false },
        prismAdvancedLabUnlocked: false
      };
      
      // Clear current save slot selection
      localStorage.removeItem('currentSaveSlot');
      
      // Refresh the UI to reflect empty state
      if (typeof updateUI === 'function') {
        updateUI();
      }
    }

    updateSaveSlotModal();
  }
}

// Slot autosave disabled - using main SaveSystem autosave instead to prevent redundant saves
// window.slotAutosaveInterval = setInterval(() => {
//   if (settings.autosave && window.SaveSystem) {
//     // Enhanced safety check using the new critical operation tracking
//     try {
//       if (isSafeToPersist() && 
//           window.state && 
//           window.kitchenIngredients !== undefined && 
//           window.friendship !== undefined) {
//         window.SaveSystem.saveGame(); // Use new save system
//         showAutosaveIndicator();
//       } else {
//         // Skip save due to critical operation or unsafe conditions
//       }
//     } catch (error) {
//       console.warn('Autosave failed safely:', error);
//     }
//   }
// }, (window.settings && window.settings.autosaveInterval ? window.settings.autosaveInterval : 30) * 1000);

// Function to restart slot autosave with new interval - DISABLED
window.restartSlotAutosave = function() {
  // Slot autosave disabled - main SaveSystem handles autosaving
};

// Emergency backup system - saves every 5 minutes to a separate key
window.emergencyBackupInterval = setInterval(() => {
  if (currentSaveSlot && checkGameIntegrity()) {
    try {
      const currentSave = localStorage.getItem(`swariaSaveSlot${currentSaveSlot}`);
      if (currentSave) {
        localStorage.setItem(`swariaSaveSlot${currentSaveSlot}_emergency`, currentSave);

      }
    } catch (error) {

    }
  }
}, 300000); // 5 minutes 

// Add page visibility change listeners to prevent saving during critical moments
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    setCriticalOperation(true);
    // Give a brief window for the page to fully hide before allowing saves again
    setTimeout(() => setCriticalOperation(false), 1000);
  }
});

// Add beforeunload listener to prevent saves during page transitions
window.addEventListener('beforeunload', function() {
  setCriticalOperation(true);
});

// Add focus/blur listeners for additional safety
window.addEventListener('blur', function() {
  setCriticalOperation(true);
  setTimeout(() => setCriticalOperation(false), 500);
});

window.addEventListener('focus', function() {
  // Brief delay before allowing saves after regaining focus
  setCriticalOperation(true);
  setTimeout(() => setCriticalOperation(false), 200);
});

document.addEventListener('DOMContentLoaded', function() {
  const manualSaveBtn = document.getElementById('manualSaveBtn');
  if (manualSaveBtn) {
    manualSaveBtn.onclick = function() {
      if (window.SaveSystem) {
        window.SaveSystem.saveGame(); // Use new save system
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

// Duplicate autosave interval removed - using slotAutosaveInterval instead
document.addEventListener('DOMContentLoaded', function() {
  const manualSaveBtn = document.getElementById('manualSaveBtn');
  if (manualSaveBtn) {
    manualSaveBtn.onclick = function() {
      if (window.SaveSystem) {
        window.SaveSystem.saveGame(); // Use new save system
        showAutosaveIndicator();
      } else {
        alert('Save system not available!');
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('mad') : "assets/icons/soap mad.png";
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
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
    // Pause unified game tick interval
    if (window._unifiedGameTickInterval) {
      clearInterval(window._unifiedGameTickInterval);
      pausedIntervals.push('_unifiedGameTickInterval');
    }
    // Also pause fluff display interval
    if (window._fluffDisplayInterval) {
      clearInterval(window._fluffDisplayInterval);
      pausedIntervals.push('_fluffDisplayInterval');
    }
    // Legacy interval handling for compatibility
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
    // Resume unified game tick interval
    if (pausedIntervals.includes('_unifiedGameTickInterval')) {
      window._unifiedGameTickInterval = setInterval(unifiedGameTick, 100);
      // Also resume fluff display interval
      if (window._fluffDisplayInterval) clearInterval(window._fluffDisplayInterval);
      window._fluffDisplayInterval = setInterval(updateFluffDisplayDirect, 200);
    }
    // Legacy interval handling for compatibility
    if (pausedIntervals.includes('tickInterval')) {
      window.tickInterval = setInterval(gameTick, 1000 / (tickSpeedMultiplier || 1));
    }
    if (pausedIntervals.includes('_mainGameTickInterval')) {
      window._mainGameTickInterval = setInterval(mainGameTick, 100);
    }
    // Redundant autosave interval removed - SaveSystem handles autosaving
    // if (pausedIntervals.includes('_autosaveInterval')) {
    //   window._autosaveInterval = setInterval(() => {
    //     if (window.SaveSystem) {
    //       window.SaveSystem.saveGame(); // Use new save system
    //       showAutosaveIndicator();
    //     }
    //   }, 30000);
    // }
    // Resume fluff display interval independently if needed
    if (pausedIntervals.includes('_fluffDisplayInterval')) {
      if (window._fluffDisplayInterval) clearInterval(window._fluffDisplayInterval);
      window._fluffDisplayInterval = setInterval(updateFluffDisplayDirect, 200);
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
  
  // Set critical operation flag during game tick to prevent save corruption
  setGameTickInProgress(true);
  
  try {
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
  if (window.state && window.state.fluzzerGlitteringPetalsBoost && (
      (DecimalUtils.isDecimal(window.state.fluzzerGlitteringPetalsBoost) && window.state.fluzzerGlitteringPetalsBoost.gt(0)) ||
      (!DecimalUtils.isDecimal(window.state.fluzzerGlitteringPetalsBoost) && window.state.fluzzerGlitteringPetalsBoost > 0)
  )) {
    // Handle both Decimal and number types for the timer
    if (DecimalUtils.isDecimal(window.state.fluzzerGlitteringPetalsBoost)) {
      window.state.fluzzerGlitteringPetalsBoost = window.state.fluzzerGlitteringPetalsBoost.sub(diff * 1000);
    } else {
      window.state.fluzzerGlitteringPetalsBoost -= diff * 1000;
    }
    
    // Check if timer expired (handle both types)
    const timerValue = DecimalUtils.isDecimal(window.state.fluzzerGlitteringPetalsBoost) 
      ? window.state.fluzzerGlitteringPetalsBoost.toNumber() 
      : window.state.fluzzerGlitteringPetalsBoost;
      
    if (timerValue <= 0) {
        // Use the dedicated reset function to ensure complete boost clearing
        if (typeof window.resetFluzzerGlitteringPetalsBoost === 'function') {
          window.resetFluzzerGlitteringPetalsBoost();
        } else {
          // Fallback to original logic if reset function not available
          window.state.fluzzerGlitteringPetalsBoost = new Decimal(0);
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
    if (typeof infinitySystem !== 'undefined' && infinitySystem.checkAllCurrencies) {
      infinitySystem.checkAllCurrencies();
    }
  } finally {
    // Always clear the game tick flag, whether tick succeeded or failed
    setGameTickInProgress(false);
  }
}

// Clear old intervals and replace with unified system
if (window._mainGameTickInterval) clearInterval(window._mainGameTickInterval);
if (window._gameTickInterval) clearInterval(window._gameTickInterval);

// Use unified tick system to reduce memory overhead
window._unifiedGameTickInterval = setInterval(unifiedGameTick, 100);

// Separate interval for fluff display updates (200ms = 5 FPS)
if (window._fluffDisplayInterval) clearInterval(window._fluffDisplayInterval);
window._fluffDisplayInterval = setInterval(updateFluffDisplayDirect, 200);

// Periodic tab visibility check to ensure tabs don't disappear (every 5 seconds)
setInterval(() => {
  if (typeof forceTabVisibilityUpdate === 'function') {
    forceTabVisibilityUpdate();
  }
}, 5000);

// Keep references for compatibility
window.mainGameTick = mainGameTick;
window.gameTick = gameTick;

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

// Legacy gradeUp function - DISABLED to prevent friendship reset bug
// The comprehensive gradeUp function in expansion.js should be used instead
/*
function gradeUp() {
  const currentGrade = DecimalUtils.isDecimal(state.grade) ? state.grade.toNumber() : (state.grade || 1);
  const nextGrade = currentGrade + 1;
  const nextCost = getGradeKPCost(nextGrade);
  const kpDecimal = DecimalUtils.isDecimal(state.kp) ? state.kp : new Decimal(state.kp || 0);
  if (kpDecimal.lt(nextCost)) return;
  const oldGrade = currentGrade;
  showGradeUpAnimation(oldGrade, nextGrade);
  state.kp = new Decimal(1);
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
  // Save using new save system if available
  if (window.SaveSystem) {
    window.SaveSystem.saveGame();
  }
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
*/

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

if (state.kp > 0) {
  document.getElementById("kpLine").style.display = "block";
  document.getElementById("kp").textContent = formatLargeInt(state.kp);
}
document.querySelectorAll('#kp').forEach(kpEl => {
  kpEl.textContent = formatLargeInt(state.kp);
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
// Fallback prism state initialization - now references the state object
if (!window.prismState) {
  window.prismState = state.prismState;
}

// Ensure generatorUnlocked exists in prism state
if (!state.prismState.generatorUnlocked) {
  state.prismState.generatorUnlocked = {
    light: false,
    redlight: false,
    orangelight: false,
    yellowlight: false,
    greenlight: false,
    bluelight: false
  };
  window.prismState.generatorUnlocked = state.prismState.generatorUnlocked;
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
  soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
  if (soapChargerSpeechTimeout) clearTimeout(soapChargerSpeechTimeout);
  soapChargerSpeechTimeout = setTimeout(() => {
    soapSpeech.style.display = "none";
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
  }, 10000); 
}

const _origSwitchHomeSubTab_SoapCharger = switchHomeSubTab;

switchHomeSubTab = function(subTabId) {

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
      
      // Add floor-2 class to body for navigation adjustments
      document.body.classList.add('floor-2');
      
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
  
  // Force tab visibility update to fix missing tabs
  if (typeof forceTabVisibilityUpdate === 'function') {
    forceTabVisibilityUpdate();
  }
};

function unlockAllTabs() {
  state.kp = new Decimal(1000000);
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
    // Update Halloween vines when entering terrarium (floor 2)
    if (typeof window.updatePageHalloweenVines === 'function') {
      window.updatePageHalloweenVines();
    }
  } else {
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (gamblingMainTab) gamblingMainTab.style.display = 'block'; // Show cargo on Floor 1
    if (homeSubTabs) homeSubTabs.style.display = 'block';
    document.body.classList.remove('terrarium-bg');
    // Remove Halloween vines when leaving terrarium (floor 2)
    if (typeof window.removePageHalloweenVines === 'function') {
      window.removePageHalloweenVines();
    }
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

    }
  }
}

// Function to render Floor 2 departments based on current tab
function renderFloor2Departments() {
  if (window.currentFloor !== 2) return;
  
  const currentTab = window.currentHomeSubTab;

  const terrariumTab = document.getElementById('terrariumTab');
  const gamblingMainTab = document.getElementById('gamblingMain');
  
  if (currentTab === 'gamblingMain' || !currentTab) {
    // Show terrarium instead of cargo on Floor 2
    if (terrariumTab) terrariumTab.style.display = 'block';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none';

    // Set the default tab if not set
    if (!currentTab) {
      window.currentHomeSubTab = 'gamblingMain';
    }
  } else if (currentTab === 'generatorMainTab') {
    // Hide terrarium and cargo, render Water Filtration Department
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none';
    if (window.waterFiltration && typeof window.waterFiltration.renderWaterFiltrationUI === 'function') {

      window.waterFiltration.renderWaterFiltrationUI();
    }
  } else if (currentTab === 'prismSubTab') {
    // Hide terrarium and cargo, render Observatory Department
    if (terrariumTab) terrariumTab.style.display = 'none';
    if (gamblingMainTab) gamblingMainTab.style.display = 'none';
    if (window.observatory && typeof window.observatory.renderObservatoryUI === 'function') {

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
      const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
      if (hasInfinityUnlock || state.grade >= 2) {
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

  } else {

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

  // Make function globally accessible
  window.updateDigitalClock = updateDigitalClock;

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
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('sleep') : "assets/icons/soap sleeping.png";
  } else {
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
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
    soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('sleep_talk') : "assets/icons/soap sleep talking.png";
    if (window.soapCurrentSpeechTimeout) clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = setTimeout(() => {
      soapSpeech.style.display = "none";
      soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('sleep') : "assets/icons/soap sleeping.png";
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
      // Calculate power drain rate - 3x faster when kitomode is active
      const drainMultiplier = (window.state && window.state.kitoFoxModeActive) ? 3 : 1;
      const drainRate = new Decimal(diff).div(5).mul(drainMultiplier);
      state.powerEnergy = DecimalUtils.max(0, state.powerEnergy.sub(drainRate));
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
    if (state.kp > 0) {
      consumedResources.push(`${formatLargeInt(state.kp)} Knowledge Points`);
      state.kp = new Decimal(0);
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
    'viCharacterSleepTalking',
    // Power generator card for battery feeding
    'powerGeneratorCard',
    // Delivery card for berry plate feeding
    'deliveryCard',
    // Nectarize machine for glittering petal feeding
    'terrariumNectarizeMachine',
    // Light grid for charged prisma feeding
    'lightGrid',
    // Pyramid for charged prisma feeding (Advanced Prism tab)
    'pyramid',
    // Prism Core card for charged prisma feeding (Advanced Prism tab)
    'prismCoreCard',
    // Mixing card for mushroom soup feeding (Kitchen tab)
    'mixingCard'
  ];

// Move restoreSwariaImage to global scope to fix ReferenceError
function restoreSwariaImage() {
  const swariaImg = document.getElementById('swariaCharacter');
  if (swariaImg && swariaImg._originalSrc) {
    swariaImg.src = swariaImg._originalSrc;
    delete swariaImg._originalSrc;
  }
}

// Make it globally accessible immediately
window.restoreSwariaImage = restoreSwariaImage;

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
      case 'powerGeneratorCard': return 'PowerGenerator';
      case 'deliveryCard': return 'DeliverySystem';
      case 'terrariumNectarizeMachine': return 'NectarizeSystem';
      case 'lightGrid': return 'PrismCore';
      case 'pyramid': return 'PrismCore';
      case 'prismCoreCard': return 'PrismCore';
      case 'mixingCard': return 'MixingSystem';
      default: 
        // Check for data-character-name attribute for dynamically added elements
        const element = document.getElementById(id);
        if (element && element.getAttribute('data-character-name')) {
          return element.getAttribute('data-character-name');
        }
        return 'Unknown';
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
          // Use green outline for power generator with battery tokens, orange for Vi characters, yellow for others
          const isPowerGenerator = id === 'powerGeneratorCard';
          const isBatteryToken = window._draggingTokenType === 'batteries' || window._draggingTokenType === 'battery';
          const isViCharacter = id.startsWith('viCharacter') || id === 'viSpeechBubble';
          const isDeliveryButton = id === 'deliveryCard';
          const isBerryPlateToken = window._draggingTokenType === 'berryPlate';
          
          if (isPowerGenerator && isBatteryToken) {
            el.style.outline = '3px solid #4CAF50'; // Green for power generator with batteries
          } else if (isPowerGenerator && !isBatteryToken) {
            el.style.outline = '3px solid #ff4444'; // Red for power generator with non-battery tokens
          } else if (isDeliveryButton && isBerryPlateToken) {
            el.style.outline = '3px solid #4CAF50'; // Green for delivery button with berry plates
          } else if (isDeliveryButton && !isBerryPlateToken) {
            el.style.outline = '3px solid #ff4444'; // Red for delivery button with non-berry plate tokens
          } else if (isViCharacter) {
            el.style.outline = '3px solid #ff9500'; // Orange for Vi characters
          } else {
            el.style.outline = '3px solid #ffe066'; // Yellow for other characters
          }
          el._tokenDropActive = true;
          
          // Change Swaria image to talking when token is dragged over
          if (id === 'swariaCharacter') {
            const swariaImg = document.getElementById('swariaCharacter');
            if (swariaImg) {
              swariaImg._originalSrc = swariaImg.src; // Store original source
              // Use proper function to get speaking image for current mode (recorder, KitoFox, etc.)
              swariaImg.src = getMainCargoCharacterImage(true);
            }
          }
        }
      });
      
      // Add mouseleave handler to remove visual feedback
      el.addEventListener('mouseleave', function() {
        el.style.outline = '';
        el._tokenDropActive = false;
        
        // Restore original Swaria image when token leaves
        if (id === 'swariaCharacter') {
          if (typeof restoreSwariaImage === 'function') {
            restoreSwariaImage();
          }
        }
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
          if (tokenType === 'berryPlate' && characterName !== 'Swaria' && characterName !== 'DeliverySystem') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Berry Plates can only be given to Swaria or the Delivery System!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          
          if (tokenType === 'batteries' && characterName !== 'Soap' && characterName !== 'Fluzzer' && characterName !== 'PowerGenerator') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Batteries can only be given to Soap, Fluzzer, or the Power Generator!';
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
          
          if (tokenType === 'chargedPrisma' && characterName !== 'Vi' && characterName !== 'PrismCore') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Charged Prisma can only be given to Vi or the Prism Core!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          
          if (tokenType === 'mushroomSoup' && characterName !== 'Mystic' && characterName !== 'MixingSystem') {
            el.style.outline = '3px solid #ff4444';
            el.title = 'Mushroom Soup can only be given to Mystic or the Mixing Card!';
            setTimeout(() => {
              el.style.outline = '';
              el.title = '';
            }, 1200);
            return;
          }
          
          // Special case for Halloween Event Button - only accepts candy tokens
          if (characterName === 'HalloweenEventButton') {
            if (tokenType !== 'candy') {
              el.style.outline = '3px solid #ff4444';
              el.title = 'The Halloween Event Button only accepts candy tokens!';
              setTimeout(() => {
                el.style.outline = '';
                el.title = '';
              }, 1200);
              return;
            }
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
          
          // Special case for Power Generator battery feeding
          if (characterName === 'PowerGenerator') {
            if (tokenType === 'batteries' || tokenType === 'battery') {
              // Check if player has batteries
              const availableBatteries = DecimalUtils.toDecimal(window.state.batteries || 0);
              if (availableBatteries.lte(0)) {
                el.style.outline = '3px solid #ff4444';
                el.title = 'You don\'t have any batteries!';
                setTimeout(() => {
                  el.style.outline = '';
                  el.title = '';
                }, 1500);
                return;
              }
              
              // Use the existing showGiveTokenModal for consistency
              showGiveTokenModal(tokenType, characterName);
              el.style.outline = '';
              el._tokenDropActive = false;
              return;
            } else {
              // Reject non-battery tokens
              el.style.outline = '3px solid #ff4444';
              el.title = 'Power Generator only accepts batteries!';
              setTimeout(() => {
                el.style.outline = '';
                el.title = '';
              }, 1500);
              return;
            }
          }
          
          // Special case for Delivery System berry plate feeding
          if (characterName === 'DeliverySystem') {
            if (tokenType === 'berryPlate') {
              // Check if player has berry plates
              const availableBerryPlates = DecimalUtils.toDecimal(window.state.berryPlate || 0);
              if (availableBerryPlates.lte(0)) {
                el.style.outline = '3px solid #ff4444';
                el.title = 'You don\'t have any berry plates!';
                setTimeout(() => {
                  el.style.outline = '';
                  el.title = '';
                }, 1500);
                return;
              }
              
              // Use the existing showGiveTokenModal for consistency
              showGiveTokenModal(tokenType, characterName);
              el.style.outline = '';
              el._tokenDropActive = false;
              return;
            } else {
              // Reject non-berry plate tokens
              el.style.outline = '3px solid #ff4444';
              el.title = 'Delivery System only accepts berry plates!';
              setTimeout(() => {
                el.style.outline = '';
                el.title = '';
              }, 1500);
              return;
            }
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
      likes: ['sparks', 'candy'],
      dislikes: ['mushroom', 'water'],
      neutral: ['berries', 'prisma', 'petals', 'stardust']
    },
    Mystic: {
      likes: ['mushroom', 'berries', 'stardust', 'candy'],
      dislikes: ['sparks', 'prisma'],
      neutral: ['petals', 'water']
    },
    Fluzzer: {
      likes: ['berries', 'petals', 'candy'],
      dislikes: ['prisma'],
      neutral: ['mushroom', 'sparks', 'water', 'stardust']
    },
    Vi: { 
      likes: ['prisma', 'water', 'candy'],
      dislikes: ['sparks'],
      neutral: ['berries', 'petals', 'mushroom', 'stardust']
    },
    Vivien: { 
      likes: ['prisma', 'water', 'candy'],
      dislikes: ['sparks'],
      neutral: ['berries', 'petals', 'mushroom', 'stardust']
    },
    Swaria: { 
      likes: ['berries', 'berryPlate', 'candy'],
      dislikes: ['sparks', 'petals', 'prisma', 'stardust'],
      neutral: ['mushroom', 'water']
    },
    Tico: {
      likes: ['berries', 'mushroom', 'water', 'candy'],
      dislikes: [],
      neutral: ['sparks', 'prisma', 'petals', 'stardust', 'berryPlate', 'mushroomSoup', 'batteries', 'glitteringPetals', 'chargedPrisma']
    },
    Lepre: {
      likes: ['berries', 'stardust', 'candy'],
      dislikes: ['water'],
      neutral: ['sparks', 'prisma', 'mushroom', 'petals', 'berryPlate', 'mushroomSoup', 'batteries', 'glitteringPetals', 'chargedPrisma']
    }
  };

  // Make characterTokenPreferences globally accessible
  window.characterTokenPreferences = characterTokenPreferences;

  // Create global character to department mapping
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

  // Make charToDept globally accessible
  window.charToDept = charToDept;

  function updateMainCargoCharacterImage() {
  const swariaImg = document.getElementById('swariaCharacter');
  if (swariaImg) {
    swariaImg.src = getMainCargoCharacterImage(false); 
    applyHalloweenRecorderGhostEffect(swariaImg);
  } else {
  }
}

function updatePrismLabCharacterImage() {
  const prismImg = document.getElementById('prismCharacter');
  if (prismImg) {
    prismImg.src = getPrismLabCharacterImage(false); 
    applyHalloweenRecorderGhostEffect(prismImg);
  } else {
  }
}

function updateHardModeQuestCharacterImage() {
  const hardModeImg = document.querySelector('#hardModeSwariaImg img');
  if (hardModeImg) {
    hardModeImg.src = getHardModeQuestCharacterImage(false); 
    applyHalloweenRecorderGhostEffect(hardModeImg);
  } else {
  }
}

function updateTerrariumCharacterImage() {
  const terrariumImg = document.getElementById('terrariumCharacterImg');
  if (terrariumImg) {
    terrariumImg.src = getTerrariumCharacterImage(false); 
    applyHalloweenRecorderGhostEffect(terrariumImg);
  } else {
  }
}

function applyHalloweenRecorderGhostEffect(imgElement) {
  if (!imgElement) return;
  
  // Check if both Halloween and Recorder modes are active AND the image is a recorder image
  const isHalloweenRecorderGhost = window.state && 
    window.state.halloweenEventActive && 
    window.state.recorderModeActive &&
    (imgElement.src.includes('recorder.png') || imgElement.src.includes('recorder speech.png'));
  
  if (isHalloweenRecorderGhost) {
    imgElement.classList.add('halloween-recorder-ghost');
  } else {
    imgElement.classList.remove('halloween-recorder-ghost');
  }
}

function applyHalloweenRecorderGhostEffectToAll() {
  // Apply ghost effect to all Swaria character images
  const allSwariaImages = document.querySelectorAll('img[src*="recorder"], img[src*="swa"], img[id*="swaria"], img[id*="prism"]');
  allSwariaImages.forEach(img => {
    applyHalloweenRecorderGhostEffect(img);
  });
}

function getMainCargoCharacterImage(isTalking = false) {
  // Check for recorder mode first (takes priority over Halloween for ghost effect)
  if (window.state && window.state.recorderModeActive) {
    return isTalking ? "assets/icons/recorder speech.png" : "assets/icons/recorder.png";
  }
  // Check for Halloween event
  else if (window.state && window.state.halloweenEventActive) {
    return isTalking ? "assets/icons/halloween peachy speech.png" : "assets/icons/halloween peachy.png";
  } else if (window.premiumState && window.premiumState.bijouEnabled) {
    return isTalking ? "assets/icons/peachy and bijou talking.png" : "assets/icons/peachy and bijou.png";
  } else if (window.state && window.state.kitoFoxModeActive) {
    return isTalking ? "assets/icons/kitomode speech.png" : "assets/icons/kitomode.png";
  } else {
    return isTalking ? "swa talking.png" : "swa normal.png";
  }
}

function getPrismLabCharacterImage(isTalking = false) {
  // Note: Recorder mode doesn't apply to prism lab, check Halloween first
  if (window.state && window.state.halloweenEventActive) {
    return isTalking ? "assets/icons/halloween peachy speech.png" : "assets/icons/halloween peachy.png";
  } else if (window.premiumState && window.premiumState.bijouEnabled) {
    return "assets/icons/peachy and bijou prism.png"; 
  } else {
    return isTalking ? "assets/icons/swaria speach prism.png" : "assets/icons/swaria prism.png";
  }
}

function getHardModeQuestCharacterImage(isTalking = false) {
  // Check for recorder mode first (takes priority over Halloween for ghost effect)
  if (window.state && window.state.recorderModeActive) {
    return isTalking ? "assets/icons/recorder speech.png" : "assets/icons/recorder.png";
  }
  // Check for Halloween event
  else if (window.state && window.state.halloweenEventActive) {
    return isTalking ? "assets/icons/halloween peachy speech.png" : "assets/icons/halloween peachy.png";
  } else if (window.premiumState && window.premiumState.bijouEnabled) {
    return isTalking ? "assets/icons/peachy and bijou talking.png" : "assets/icons/peachy and bijou.png";
  } else {
    return isTalking ? "assets/icons/kitomode speech.png" : "assets/icons/kitomode.png";
  }
}

function getTerrariumCharacterImage(isTalking = false) {
  // Check for recorder mode first (takes priority over Halloween for ghost effect)
  if (window.state && window.state.recorderModeActive) {
    return isTalking ? "assets/icons/recorder speech.png" : "assets/icons/recorder.png";
  }
  // Check for Halloween event
  else if (window.state && window.state.halloweenEventActive) {
    return isTalking ? "assets/icons/halloween peachy speech.png" : "assets/icons/halloween peachy.png";
  } else if (window.premiumState && window.premiumState.bijouEnabled) {
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
window.applyHalloweenRecorderGhostEffect = applyHalloweenRecorderGhostEffect;
window.applyHalloweenRecorderGhostEffectToAll = applyHalloweenRecorderGhostEffectToAll;
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
    water: ["WATER?! No no no! Keep that away from me!", "GAH! My plush fur will get all soggy! *bzzt*", "Are you trying to ruin my plush?!", "Water and me don't mix! I'd hate to get my plush all soggy!"]
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

// Make characterTokenSpeech globally accessible
window.characterTokenSpeech = characterTokenSpeech;

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
    if (window.boutique && typeof window.boutique.showLepreSpeechWithToken === 'function') {
      window.boutique.showLepreSpeechWithToken(speech, 3500, tokenType);
    } else if (window.boutique && typeof window.boutique.showLepreSpeech === 'function') {
      window.boutique.showLepreSpeech(speech, 3500);
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
    speech = 'Nom!';
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
          img.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : 'assets/icons/soap speech.png';
        } else if (characterName === 'Mystic') {
          img.src = window.getHalloweenMysticImage ? window.getHalloweenMysticImage('speech') : 'assets/icons/chef mystic speech.png';
        } else if (characterName === 'Fluzzer') {
          img.src = getFluzzerImagePath('talking');
        }
      }
      if (stopTimer) stopTimer();
      setTimeout(() => {
        el.style.display = 'none';
        if (img) {
          if (characterName === 'Soap') {
            img.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : 'assets/icons/soap.png';
          } else if (characterName === 'Mystic') {
            img.src = window.getHalloweenMysticImage ? window.getHalloweenMysticImage('normal') : 'assets/icons/chef mystic.png';
          } else if (characterName === 'Fluzzer') {
            img.src = getFluzzerImagePath('normal');
          }
        }
        if (startTimer) startTimer();
      }, 3500);
    }
  }
}

  function showGiveTokenModal(tokenType, characterName) {

    if (tokenType === 'swabucks') {
      alert('Swa bucks cannot be given to characters!');
      return;
    }
    if (tokenType === 'berryPlate' && characterName !== 'Swaria' && characterName !== 'Tico' && characterName !== 'DeliverySystem') {
      alert('Berry Plates can only be given to Swaria or the Delivery System!');
      return;
    }
    if (tokenType === 'batteries' && characterName !== 'Soap' && characterName !== 'Fluzzer' && characterName !== 'Tico' && characterName !== 'PowerGenerator') {
      alert('Batteries can only be given to Soap, Fluzzer, or the Power Generator!');
      return;
    }
    if ((tokenType === 'glitteringPetals' || tokenType === 'glitteringPetal') && characterName !== 'Fluzzer' && characterName !== 'Tico' && characterName !== 'NectarizeSystem') {
      alert('Glittering Petals can only be given to Fluzzer or the Nectarize Machine!');
      return;
    }
    if (tokenType === 'chargedPrisma' && characterName !== 'Vi' && characterName !== 'Tico' && characterName !== 'PrismCore') {
      alert('Charged Prisma can only be given to Vi or the Prism Core!');
      return;
    }
    if (tokenType === 'mushroomSoup' && characterName !== 'Mystic' && characterName !== 'Tico' && characterName !== 'MixingSystem') {
      alert('Mushroom Soup can only be given to Mystic or the Mixing Card!');
      return;
    }
    if (tokenType === 'mushroomSoup' && characterName !== 'Mystic' && characterName !== 'Tico' && characterName !== 'MixingSystem') {
      alert('Mushroom Soup can only be given to Mystic or the Mixing Card!');
      return;
    }
    
    const modal = document.getElementById('giveTokenModal');
    if (!modal) {

      return;
    }
    
    const title = document.getElementById('giveTokenModalTitle');
    const img = document.getElementById('giveTokenModalImg');
    
    if (!title || !img) {

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
      candy: 'assets/icons/candy token.png',
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
      candy: 'Candy',
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
    } else if (characterName === 'PowerGenerator') {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to add to the Power Generator?`;
      img.src = tokenImages[tokenType] || '';
    } else if (characterName === 'DeliverySystem') {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you wanna add to the next delivery load?`;
      img.src = tokenImages[tokenType] || '';
    } else if (characterName === 'NectarizeSystem') {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you wanna add to the nectarizer?`;
      img.src = tokenImages[tokenType] || '';
    } else if (characterName === 'PrismCore') {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you wanna add to the prism core?`;
      img.src = tokenImages[tokenType] || '';
    } else if (characterName === 'MixingSystem') {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you wanna add to the mixer?`;
      img.src = tokenImages[tokenType] || '';
    } else if (characterName === 'HalloweenEventButton') {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to give to unlock the Halloween Event?`;
      img.src = tokenImages[tokenType] || '';
    } else {
      title.textContent = `How many ${displayNames[tokenType] || tokenType} do you want to give to ${characterName}?`;
      img.src = tokenImages[tokenType] || '';
    }
    
    img.alt = displayNames[tokenType] || tokenType;





    // Force image to be visible and check if it loads
    img.style.display = 'block';
    img.style.visibility = 'visible';
    img.onerror = function() {

    };
    img.onload = function() {

    };

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
      // Regular tokens are now stored in window.state.tokens, not window.kitchenIngredients
      const tokenValue = window.state && window.state.tokens && window.state.tokens[storageKey];
      
      if (tokenValue !== undefined && tokenValue !== null) {
        if (typeof tokenValue === 'object' && tokenValue.toNumber) {
          available = tokenValue.toNumber();
        } else if (typeof tokenValue === 'object' && tokenValue.toString) {
          available = parseFloat(tokenValue.toString());
        } else {
          available = Number(tokenValue);
        }
      } else {
        // Fallback to kitchenIngredients for backward compatibility
        available = counts[storageKey] ? 
          (typeof counts[storageKey].toNumber === 'function' ? counts[storageKey].toNumber() : Number(counts[storageKey])) : 0;
      }
    }

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
      
      // Handle Halloween Event Button candy token giving
      if (characterName === 'HalloweenEventButton' && tokenType === 'candy') {
        // Initialize Halloween event state if it doesn't exist
        if (!window.state.halloweenEvent) {
          window.state.halloweenEvent = { candyTokensGiven: new Decimal(0) };
        }
        if (!window.state.halloweenEvent.candyTokensGiven) {
          window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
        }
        
        // Deduct candy tokens from inventory
        if (window.state && window.state.tokens && window.state.tokens.candy) {
          window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(amount);
          if (window.state.tokens.candy.lt(0)) window.state.tokens.candy = new Decimal(0);
        }
        
        // Add to Halloween event candy tokens given
        window.state.halloweenEvent.candyTokensGiven = DecimalUtils.toDecimal(window.state.halloweenEvent.candyTokensGiven).add(amount);
        
        // Check if Halloween event should be unlocked
        if (window.state.halloweenEvent.candyTokensGiven.gte(10)) {
          if (!window.state.unlockedFeatures) window.state.unlockedFeatures = {};
          window.state.unlockedFeatures.halloweenEvent = true;
          
          // Show unlock notification
          if (typeof window.showNotification === 'function') {
            window.showNotification('🍬 Halloween Event Unlocked! You can now access the Halloween Event tab!', 'success');
          }
        } else {
          // Show progress notification
          const remaining = new Decimal(10).sub(window.state.halloweenEvent.candyTokensGiven);
          if (typeof window.showNotification === 'function') {
            window.showNotification(`🍬 ${amount} candy tokens given! ${remaining.toFixed(0)} more needed to unlock the Halloween Event.`, 'info');
          }
        }
        
        // Update Halloween event button display
        if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
          window.updateHalloweenEventButtonDisplay();
        }
        
        // Update inventory display immediately with multiple methods
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        if (typeof renderInventoryTokens === 'function') {
          renderInventoryTokens(); // Specifically re-render token display
        }
        if (typeof window.updateKitchenUI === 'function') {
          window.updateKitchenUI(); // Update kitchen UI where tokens are often displayed
        }
        
        // Force additional update after a tiny delay to ensure DOM is updated
        setTimeout(() => {
          if (typeof window.updateInventoryModal === 'function') {
            window.updateInventoryModal(true);
          }
          if (typeof renderInventoryTokens === 'function') {
            renderInventoryTokens();
          }
        }, 10);
        
        // Close the modal
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      
      // Use dedicated quest functions for Soap's sparks and batteries (accept both singular and plural)
      if (characterName === 'Soap' && (tokenType === 'spark' || tokenType === 'sparks') && typeof window.giveSparksToSoap === 'function') {

        // Deduct sparks from inventory (check both new and old locations)
        if (window.state && window.state.tokens && window.state.tokens.sparks) {
          // New location: window.state.tokens.sparks
          if (typeof Decimal !== 'undefined') {
            window.state.tokens.sparks = DecimalUtils.toDecimal(window.state.tokens.sparks).minus(amount);
            if (window.state.tokens.sparks.lt(0)) window.state.tokens.sparks = new Decimal(0);
          } else {
            window.state.tokens.sparks = Math.max(0, Number(window.state.tokens.sparks) - amount);
          }
        } else if (window.state && window.state.sparks) {
          // Legacy location: window.state.sparks
          if (typeof Decimal !== 'undefined') {
            window.state.sparks = DecimalUtils.toDecimal(window.state.sparks).minus(amount);
            if (window.state.sparks.lt(0)) window.state.sparks = new Decimal(0);
          } else {
            window.state.sparks = Math.max(0, Number(window.state.sparks) - amount);
          }
        } else if (window.kitchenIngredients && window.kitchenIngredients.sparks !== undefined) {
          // Fallback location: window.kitchenIngredients.sparks
          if (typeof Decimal !== 'undefined') {
            window.kitchenIngredients.sparks = DecimalUtils.toDecimal(window.kitchenIngredients.sparks).minus(amount);
            if (window.kitchenIngredients.sparks.lt(0)) window.kitchenIngredients.sparks = new Decimal(0);
          } else {
            window.kitchenIngredients.sparks = Math.max(0, Number(window.kitchenIngredients.sparks) - amount);
          }
        }
        window.giveSparksToSoap(amount);
        if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
        
        // Update inventory display immediately
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Close the modal if present
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      if (characterName === 'Soap' && (tokenType === 'battery' || tokenType === 'batteries') && typeof window.giveBatteriesToSoap === 'function') {

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
          // Increment power refill counter for quest tracking
          window.state.powerRefillCount = (window.state.powerRefillCount || 0) + 1;
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
            soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
          }
          setTimeout(() => {
            soapSpeech.style.display = "none";
            if (soapImg) {
              soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
            }
          }, 5000);
        }
        
        window.giveBatteriesToSoap(amount);
        if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
        
        // Update inventory display immediately
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Close the modal if present
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      
      // Handle PowerGenerator battery feeding
      if (characterName === 'PowerGenerator' && (tokenType === 'battery' || tokenType === 'batteries')) {
        // Deduct batteries from inventory
        if (window.state && window.state.batteries) {
          if (typeof window.state.batteries.minus === 'function') {
            window.state.batteries = window.state.batteries.minus(amount);
            if (window.state.batteries.lt(0)) window.state.batteries = window.state.batteries.constructor(0);
          } else {
            window.state.batteries = Math.max(0, Number(window.state.batteries) - amount);
          }
        }
        
        // Ensure battery upgrades state exists
        if (!DecimalUtils.isDecimal(window.state.powerGeneratorBatteryUpgrades)) {
          window.state.powerGeneratorBatteryUpgrades = new Decimal(0);
        }
        
        // Add battery upgrades
        window.state.powerGeneratorBatteryUpgrades = window.state.powerGeneratorBatteryUpgrades.add(amount);
        
        // Update power max energy
        if (typeof window.calculatePowerGeneratorCap === 'function') {
          window.state.powerMaxEnergy = window.calculatePowerGeneratorCap();
          // Ensure current power doesn't exceed new max
          if (window.state.powerEnergy.gt(window.state.powerMaxEnergy)) {
            window.state.powerEnergy = window.state.powerMaxEnergy;
          }
        }
        
        // Update inventory display
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Update power generator UI
        if (typeof updatePowerGeneratorUI === 'function') {
          updatePowerGeneratorUI();
        }
        
        // Show success message
        const powerBonus = amount * 5;
        showBatteryFeedSuccessMessage(amount, powerBonus);
        
        // Close the modal
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      
      // Handle DeliverySystem berry plate loading
      if (characterName === 'DeliverySystem' && tokenType === 'berryPlate') {
        // Deduct berry plates from inventory
        if (window.state && window.state.berryPlate) {
          if (typeof window.state.berryPlate.minus === 'function') {
            window.state.berryPlate = window.state.berryPlate.minus(amount);
            if (window.state.berryPlate.lt(0)) window.state.berryPlate = new Decimal(0);
          } else {
            window.state.berryPlate = Math.max(0, Number(window.state.berryPlate) - amount);
          }
        }
        
        // Add berry plates to delivery load
        if (!window.state.deliverySystem) {
          window.state.deliverySystem = {
            berryPlatesInLoad: new Decimal(0),
            totalBerryPlatesGiven: new Decimal(0),
            kpBoostFromBerryPlates: new Decimal(1)
          };
        }
        
        if (!DecimalUtils.isDecimal(window.state.deliverySystem.berryPlatesInLoad)) {
          window.state.deliverySystem.berryPlatesInLoad = new Decimal(window.state.deliverySystem.berryPlatesInLoad || 0);
        }
        
        window.state.deliverySystem.berryPlatesInLoad = window.state.deliverySystem.berryPlatesInLoad.add(amount);
        
        // Update inventory display
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Update delivery system UI
        if (typeof updateDeliverySystemUI === 'function') {
          updateDeliverySystemUI();
        }
        
        // Update inventory display immediately
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Success message removed - berry plate info shown in delivery card instead
        // showBerryPlateLoadSuccessMessage(amount);
        
        // Close the modal
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      
      // Handle NectarizeSystem glittering petal loading
      if (characterName === 'NectarizeSystem' && (tokenType === 'glitteringPetals' || tokenType === 'glitteringPetal')) {
        // Deduct glittering petals from inventory
        if (window.state && window.state.glitteringPetals) {
          if (typeof window.state.glitteringPetals.minus === 'function') {
            window.state.glitteringPetals = window.state.glitteringPetals.minus(amount);
            if (window.state.glitteringPetals.lt(0)) window.state.glitteringPetals = new Decimal(0);
          } else {
            window.state.glitteringPetals = Math.max(0, Number(window.state.glitteringPetals) - amount);
          }
        }
        
        // Add glittering petals to nectarizer
        if (!window.state.deliverySystem) {
          window.state.deliverySystem = {
            berryPlatesInLoad: new Decimal(0),
            totalBerryPlatesGiven: new Decimal(0),
            kpBoostFromBerryPlates: new Decimal(1),
            glitteringPetalsInNectarizer: new Decimal(0),
            totalGlitteringPetalsGiven: new Decimal(0),
            nectarBoostFromGlitteringPetals: new Decimal(1)
          };
        }
        
        if (!DecimalUtils.isDecimal(window.state.deliverySystem.glitteringPetalsInNectarizer)) {
          window.state.deliverySystem.glitteringPetalsInNectarizer = new Decimal(window.state.deliverySystem.glitteringPetalsInNectarizer || 0);
        }
        if (!DecimalUtils.isDecimal(window.state.deliverySystem.totalGlitteringPetalsGiven)) {
          window.state.deliverySystem.totalGlitteringPetalsGiven = new Decimal(window.state.deliverySystem.totalGlitteringPetalsGiven || 0);
        }
        if (!DecimalUtils.isDecimal(window.state.deliverySystem.nectarBoostFromGlitteringPetals)) {
          window.state.deliverySystem.nectarBoostFromGlitteringPetals = new Decimal(window.state.deliverySystem.nectarBoostFromGlitteringPetals || 1);
        }
        
        // Apply boost immediately - no pending reset needed
        window.state.deliverySystem.glitteringPetalsInNectarizer = window.state.deliverySystem.glitteringPetalsInNectarizer.add(amount);
        window.state.deliverySystem.totalGlitteringPetalsGiven = window.state.deliverySystem.totalGlitteringPetalsGiven.add(amount);
        window.state.deliverySystem.nectarBoostFromGlitteringPetals = new Decimal(1).add(window.state.deliverySystem.totalGlitteringPetalsGiven.mul(0.05));
        
        // Sync to terrarium state if needed
        if (typeof syncTerrariumToState === 'function') {
          syncTerrariumToState();
        }
        
        // Update inventory display
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Update nectarize machine UI
        if (typeof updateNectarizeMachineDisplay === 'function') {
          updateNectarizeMachineDisplay();
        }
        if (typeof updateNectarizePreview === 'function') {
          updateNectarizePreview();
        }
        
        // Update inventory display immediately
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Close the modal
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      
      // Handle PrismCore charged prisma loading
      if (characterName === 'PrismCore' && tokenType === 'chargedPrisma') {
        // Deduct charged prisma from inventory
        if (window.state && window.state.chargedPrisma) {
          if (typeof window.state.chargedPrisma.minus === 'function') {
            window.state.chargedPrisma = window.state.chargedPrisma.minus(amount);
            if (window.state.chargedPrisma.lt(0)) window.state.chargedPrisma = new Decimal(0);
          } else {
            window.state.chargedPrisma = Math.max(0, Number(window.state.chargedPrisma) - amount);
          }
        }
        
        // Add charged prisma to prism core
        if (!window.state.prismCoreSystem) {
          window.state.prismCoreSystem = {
            chargedPrismaInCore: new Decimal(0),
            totalChargedPrismaGiven: new Decimal(0),
            lightBoostFromChargedPrisma: new Decimal(1)
          };
        }
        
        if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.chargedPrismaInCore)) {
          window.state.prismCoreSystem.chargedPrismaInCore = new Decimal(window.state.prismCoreSystem.chargedPrismaInCore || 0);
        }
        if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.totalChargedPrismaGiven)) {
          window.state.prismCoreSystem.totalChargedPrismaGiven = new Decimal(window.state.prismCoreSystem.totalChargedPrismaGiven || 0);
        }
        if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.lightBoostFromChargedPrisma)) {
          window.state.prismCoreSystem.lightBoostFromChargedPrisma = new Decimal(window.state.prismCoreSystem.lightBoostFromChargedPrisma || 1);
        }
        
        // Apply boost immediately - 0.1x per charged prisma
        window.state.prismCoreSystem.chargedPrismaInCore = window.state.prismCoreSystem.chargedPrismaInCore.add(amount);
        window.state.prismCoreSystem.totalChargedPrismaGiven = window.state.prismCoreSystem.totalChargedPrismaGiven.add(amount);
        window.state.prismCoreSystem.lightBoostFromChargedPrisma = new Decimal(1).add(window.state.prismCoreSystem.totalChargedPrismaGiven.mul(0.1));
        
        // Update inventory display
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Update prism UI
        if (typeof updatePrismUI === 'function') {
          updatePrismUI();
        }
        
        // Update core boost card display
        if (typeof updateCoreBoostCard === 'function') {
          updateCoreBoostCard();
        }
        
        // Update inventory display immediately
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Close the modal
        const modal = document.getElementById('giveTokenModal');
        if (modal) modal.style.display = 'none';
        return;
      }
      
      // Handle MixingSystem mushroom soup feeding
      if (characterName === 'MixingSystem' && tokenType === 'mushroomSoup') {
        // Deduct mushroom soup from inventory
        if (window.state && window.state.mushroomSoup) {
          if (typeof window.state.mushroomSoup.minus === 'function') {
            window.state.mushroomSoup = window.state.mushroomSoup.minus(amount);
            if (window.state.mushroomSoup.lt(0)) window.state.mushroomSoup = new Decimal(0);
          } else {
            window.state.mushroomSoup = Math.max(0, Number(window.state.mushroomSoup) - amount);
          }
        }
        
        // Add mushroom soup to mixing system for cooking speed boost
        if (!window.state.mixingSystem) {
          window.state.mixingSystem = {
            mushroomSoupInMixer: new Decimal(0),
            totalMushroomSoupGiven: new Decimal(0),
            cookingSpeedBoost: new Decimal(1)
          };
        }
        
        if (!DecimalUtils.isDecimal(window.state.mixingSystem.mushroomSoupInMixer)) {
          window.state.mixingSystem.mushroomSoupInMixer = new Decimal(window.state.mixingSystem.mushroomSoupInMixer || 0);
        }
        if (!DecimalUtils.isDecimal(window.state.mixingSystem.totalMushroomSoupGiven)) {
          window.state.mixingSystem.totalMushroomSoupGiven = new Decimal(window.state.mixingSystem.totalMushroomSoupGiven || 0);
        }
        if (!DecimalUtils.isDecimal(window.state.mixingSystem.cookingSpeedBoost)) {
          window.state.mixingSystem.cookingSpeedBoost = new Decimal(window.state.mixingSystem.cookingSpeedBoost || 1);
        }
        
        // Apply cooking speed boost immediately - 0.01x per mushroom soup
        window.state.mixingSystem.mushroomSoupInMixer = window.state.mixingSystem.mushroomSoupInMixer.add(amount);
        window.state.mixingSystem.totalMushroomSoupGiven = window.state.mixingSystem.totalMushroomSoupGiven.add(amount);
        window.state.mixingSystem.cookingSpeedBoost = new Decimal(1).add(window.state.mixingSystem.totalMushroomSoupGiven.mul(0.01));
        
        // Update inventory display immediately
        if (typeof window.updateInventoryModal === 'function') {
          window.updateInventoryModal(true); // Force immediate update
        }
        if (typeof updateInventoryDisplay === 'function') {
          updateInventoryDisplay();
        }
        
        // Update kitchen UI
        if (typeof updateKitchenUI === 'function') {
          updateKitchenUI(true);
        }
        
        // Close the modal
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
        // Regular tokens stored in window.state.tokens, not kitchenIngredients
        // Ensure window.state.tokens exists and is properly initialized
        if (!window.state) window.state = {};
        if (!window.state.tokens) {
          window.state.tokens = {
            berries: new Decimal(0),
            sparks: new Decimal(0),
            petals: new Decimal(0),
            mushroom: new Decimal(0),
            water: new Decimal(0),
            prisma: new Decimal(0),
            stardust: new Decimal(0)
          };
        }

        // Deduct from window.state.tokens[storageKey] instead of kitchenIngredients
        if (window.state.tokens[storageKey] !== undefined) {
          // Ensure the token value is a Decimal
          if (!DecimalUtils.isDecimal(window.state.tokens[storageKey])) {
            window.state.tokens[storageKey] = new Decimal(window.state.tokens[storageKey] || 0);
          }
          
          // Perform deduction
          window.state.tokens[storageKey] = window.state.tokens[storageKey].minus(amount);
          
          // Ensure no negative values
          if (window.state.tokens[storageKey].lt(0)) {
            window.state.tokens[storageKey] = new Decimal(0);
          }
        } else {
          // Fallback to kitchenIngredients for backward compatibility
          if (!window.kitchenIngredients[storageKey]) {
            window.kitchenIngredients[storageKey] = new Decimal(0);
          } else if (!DecimalUtils.isDecimal(window.kitchenIngredients[storageKey])) {
            window.kitchenIngredients[storageKey] = new Decimal(window.kitchenIngredients[storageKey] || 0);
          }
          
          window.kitchenIngredients[storageKey] = window.kitchenIngredients[storageKey].minus(amount);
          
          if (window.kitchenIngredients[storageKey].lt(0)) {
            window.kitchenIngredients[storageKey] = new Decimal(0);
          }
        }
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
              mysticImg.src = window.getHalloweenMysticImage ? window.getHalloweenMysticImage('speech') : "assets/icons/chef mystic speech.png";
            }
            setTimeout(() => {
              mysticSpeech.style.display = "none";
              if (mysticImg) {
                mysticImg.src = window.getHalloweenMysticImage ? window.getHalloweenMysticImage('normal') : "assets/icons/chef mystic.png";
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
            // Increment power refill counter for quest tracking
            window.state.powerRefillCount = (window.state.powerRefillCount || 0) + 1;
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
              soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
            }
            setTimeout(() => {
              soapSpeech.style.display = "none";
              if (soapImg) {
                soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
              }
            }, 5000);
          }
        }
      }
      if (characterName === 'Fluzzer') {

        if (tokenType === 'glitteringPetals' || tokenType === 'glitteringPetal') {
          const tenMinutesMs = 10 * 60 * 1000; 
          if (!window.state) window.state = {};
          window.state.fluzzerGlitteringPetalsBoost = new Decimal(tenMinutesMs);
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

        if (typeof handleNectarizeTokenGiven === 'function') {
          handleNectarizeTokenGiven(tokenType, amount);
        } else {

        }

      }


      // Process friendship points for candy tokens only (to avoid level calculation bugs with other tokens)
      if (friendshipAmount > 0 && characterName !== 'Swaria' && storageKey === 'candy') {
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

        // Candy is universally loved - gives 30 friendship points per candy
        let pointsPerToken = 30;

        if (dept && window.friendship && typeof window.friendship.addPoints === 'function') {
          const totalPoints = new Decimal(pointsPerToken).mul(friendshipAmount);
          window.friendship.addPoints(characterName, totalPoints);
          
          const statsModal = document.getElementById('departmentStatsModal');
          if (statsModal && statsModal.style.display !== 'none') {
            const title = document.getElementById('departmentStatsModalTitle');
            if (title && title.textContent && title.textContent.toLowerCase().includes(dept.toLowerCase())) {
              if (typeof window.showDepartmentStatsModal === 'function') window.showDepartmentStatsModal(dept);
            }
          }
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
          soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : "assets/icons/soap speech.png";
          setTimeout(() => {
            soapSpeech.style.display = "none";
            soapImg.src = window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : "assets/icons/soap.png";
          }, 8000);
        }
      } else if (typeof showCharacterSpeech === 'function') {
        showCharacterSpeech(characterName, storageKey);
      }
      if (characterName === 'Swaria' && typeof state !== 'undefined' && state.hardModeQuestActive) {
        if (typeof state.hardModeQuestProgress !== 'undefined') {
          if (storageKey === 'berries') {
            if (!DecimalUtils.isDecimal(state.hardModeQuestProgress.berryTokens)) {
              state.hardModeQuestProgress.berryTokens = new Decimal(state.hardModeQuestProgress.berryTokens || 0);
            }
            state.hardModeQuestProgress.berryTokens = state.hardModeQuestProgress.berryTokens.add(amount);
          } else if (storageKey === 'stardust') {
            if (!DecimalUtils.isDecimal(state.hardModeQuestProgress.stardustTokens)) {
              state.hardModeQuestProgress.stardustTokens = new Decimal(state.hardModeQuestProgress.stardustTokens || 0);
            }
            state.hardModeQuestProgress.stardustTokens = state.hardModeQuestProgress.stardustTokens.add(amount);
          } else if (tokenType === 'berryPlate') {
            if (!DecimalUtils.isDecimal(state.hardModeQuestProgress.berryPlateTokens)) {
              state.hardModeQuestProgress.berryPlateTokens = new Decimal(state.hardModeQuestProgress.berryPlateTokens || 0);
            }
            state.hardModeQuestProgress.berryPlateTokens = state.hardModeQuestProgress.berryPlateTokens.add(amount);
          } else if (tokenType === 'mushroomSoup') {
            if (!DecimalUtils.isDecimal(state.hardModeQuestProgress.mushroomSoupTokens)) {
              state.hardModeQuestProgress.mushroomSoupTokens = new Decimal(state.hardModeQuestProgress.mushroomSoupTokens || 0);
            }
            state.hardModeQuestProgress.mushroomSoupTokens = state.hardModeQuestProgress.mushroomSoupTokens.add(amount);
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

        let pointsPerToken = 5; // Default neutral
        
        if (storageKey === 'stardust') {
          pointsPerToken = characterName === 'Mystic' ? 200 : 50;
        } else if (characterTokenPreferences && characterTokenPreferences[characterName]) {
          if (characterTokenPreferences[characterName].likes.includes(storageKey)) {
            pointsPerToken = 20;

          } else if (characterTokenPreferences[characterName].dislikes.includes(storageKey)) {
            pointsPerToken = 1;

          } else {
            pointsPerToken = 5;

          }
        }
        
        if (dept) {
          // Ensure friendship system is initialized
          if (typeof window.ensureFriendshipSystemInitialized === 'function') {
            window.ensureFriendshipSystemInitialized();
          }
          
          if (window.friendship && typeof window.friendship.addPoints === 'function') {
            const totalPoints = new Decimal(pointsPerToken).mul(friendshipAmount);
            
            // Use the proper friendship system from stats.js
            window.friendship.addPoints(characterName, totalPoints);
          } else {
            console.warn('Friendship system not available for token gifting');
          }
        } else {

        }
      } else {

      }

      // Handle Tico tokens for front desk hunger system (OLD GIVE function)
      if (characterName === 'Tico') {



        if (window.frontDesk && typeof window.frontDesk.handleTokenDrop === 'function') {
          window.frontDesk.handleTokenDrop(tokenType, amount);

        } else {



        }
      }

      // Handle character speech for non-quest tokens

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

        showCharacterSpeech(characterName, storageKey);
      } else {

      }
      
      // Update all relevant UIs after token deduction
      if (typeof window.updateInventoryModal === 'function') window.updateInventoryModal(true); // Force update after token usage
      if (typeof window.updateInventoryDisplay === 'function') window.updateInventoryDisplay();
      if (typeof window.updateKitchenUI === 'function') window.updateKitchenUI();
      if (typeof renderInventoryTokens === 'function') renderInventoryTokens();
      
      if (characterName === 'Swaria' && typeof updateSwariaHungerUI === 'function') {
        updateSwariaHungerUI();
      }
      if (characterName === 'Soap' && (tokenType === 'sparks' || tokenType === 'batteries') && typeof window.updateChargerUI === 'function') {
        window.updateChargerUI();
      }
      
      // Note: Save will be handled by regular save system, not on every token giving
      
      modal.style.display = 'none';
    }
  }
  
  // Make showGiveTokenModal globally available immediately after definition
  window.showGiveTokenModal = showGiveTokenModal;

  // Cache for smart inventory updates
  let lastInventorySnapshot = null;

  function getInventorySnapshot() {
    const snapshot = {};
    
    // Add swabucks
    if (window.state && window.state.swabucks) {
      snapshot.swabucks = window.state.swabucks.toString();
    }
    
    // Add basic ingredient tokens from window.state.tokens
    if (window.state && window.state.tokens) {
      const ingredientKeys = ['berries', 'petals', 'stardust', 'prisma', 'sparks', 'water', 'mushroom'];
      ingredientKeys.forEach(key => {
        const value = window.state.tokens[key];
        if (value !== undefined && value !== null) {
          snapshot[key] = typeof value === 'object' ? value.toString() : value.toString();
        }
      });
    }
    
    // Add special ingredients from state
    if (window.state) {
      const specialKeys = ['glitteringPetals', 'chargedPrisma', 'batteries', 'mushroomSoup', 'berryPlate'];
      specialKeys.forEach(key => {
        const value = window.state[key];
        if (value !== undefined && value !== null) {
          snapshot[key] = typeof value === 'object' ? value.toString() : value.toString();
        }
      });
    }
    
    return snapshot;
  }

  function inventorySnapshotsEqual(snap1, snap2) {
    if (!snap1 || !snap2) return false;
    
    const keys1 = Object.keys(snap1);
    const keys2 = Object.keys(snap2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (snap1[key] !== snap2[key]) return false;
    }
    
    return true;
  }

  function renderInventoryTokens(forceRender = false) {
    const container = document.getElementById('inventoryTokens');
    if (!container) return;
    
    // Smart update - only re-render if token counts changed
    const currentSnapshot = getInventorySnapshot();
    if (!forceRender && inventorySnapshotsEqual(currentSnapshot, lastInventorySnapshot)) {
      return; // No changes, skip expensive DOM manipulation
    }
    lastInventorySnapshot = currentSnapshot;
    
    container.innerHTML = '';
    
    // Ensure kitchenIngredients is initialized
    if (!window.kitchenIngredients) {
      window.kitchenIngredients = {};
    }
    
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
      { key: 'mushroom', name: 'mushroom', display: 'Mushroom', icon: 'mushroom token.png' },
      { key: 'candy', name: 'candy', display: 'Candy', icon: 'candy token.png' }
    ];
    
    ingredientTokens.forEach(token => {
      // Read from window.state.tokens instead of window.kitchenIngredients
      const value = window.state && window.state.tokens && window.state.tokens[token.key];
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
        max-width: 70px;
        margin: 1px;
        padding: 1px;
        flex-shrink: 0;
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





            origParent = img.parentNode;
            origNext = img.nextSibling;
            
            // Position relative to modal
            const modalRelativeLeft = origRect.left - modalRect.left;
            const modalRelativeTop = origRect.top - modalRect.top;

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
            
            // Restore Swaria image when drag ends
            if (typeof restoreSwariaImage === 'function') {
              restoreSwariaImage();
            }
            
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
            if (typeof restoreSwariaImage === 'function') {
              restoreSwariaImage(); // Restore Swaria image if drag was cancelled
            }
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
  // Prevent duplicate event handler attachment for inventory button
  if (inventoryBtn && inventoryModal && !inventoryBtn.dataset.inventoryHandlerAttached) {
    inventoryBtn.dataset.inventoryHandlerAttached = 'true';
    inventoryBtn.addEventListener('click', function(e) {
      inventoryOpen = !inventoryOpen;
      if (inventoryOpen) {
        renderInventoryTokens(true); // Force immediate render when opening
        inventoryModal.style.display = 'flex';
        lastInventoryUpdate = Date.now(); // Reset throttle timer for immediate update
      } else {
        inventoryModal.style.display = 'none';
        if (typeof restoreSwariaImage === 'function') {
          restoreSwariaImage(); // Restore Swaria image when inventory closes
        }
      }
    });
  }
  // Performance optimization constants
  const INVENTORY_MODAL_UPDATE_THROTTLE = 250; // 4 FPS for inventory updates
  let lastInventoryUpdate = 0;

  window.updateInventoryModal = function(forceUpdate = false) {
    // Don't re-render inventory while dragging to prevent breaking drag functionality
    if (window._draggingToken) {
      return;
    }
    
    // Throttle inventory updates to prevent 10 FPS re-rendering madness
    const now = Date.now();
    if (!forceUpdate && (now - lastInventoryUpdate) < INVENTORY_MODAL_UPDATE_THROTTLE) {
      return;
    }
    lastInventoryUpdate = now;
    
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
  
  // Make closeGiveTokenModal globally available immediately after definition
  window.closeGiveTokenModal = closeGiveTokenModal;
  
  function giveTokenAmount(amount) {
    const modal = document.getElementById('giveTokenModal');
    if (!modal || !modal._currentTokenType || !modal._currentCharacterName) {
      return;
    }

    const tokenType = modal._currentTokenType;
    const characterName = modal._currentCharacterName;

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
      'prisma': 'prisma',
      // Also handle cases where tokens are already plural
      'berries': 'berries',
      'petals': 'petals',
      'sparks': 'sparks'
    };
    
    let storageKey = tokenToStorageKey[tokenType] || tokenType;

    if (tokenType === 'swabucks') {
      available = (window.state && window.state.swabucks) ? 
        (typeof window.state.swabucks.toNumber === 'function' ? window.state.swabucks.toNumber() : Number(window.state.swabucks)) : 0;
    } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'glitteringPetals' || tokenType === 'chargedPrisma') {
      available = (window.state && window.state[tokenType]) ? 
        (typeof window.state[tokenType].toNumber === 'function' ? window.state[tokenType].toNumber() : Number(window.state[tokenType])) : 0;
    } else {
      // Regular tokens are now stored in window.state.tokens, not window.kitchenIngredients
      const tokenValue = window.state && window.state.tokens && window.state.tokens[storageKey];
      
      if (tokenValue !== undefined && tokenValue !== null) {
        if (typeof tokenValue === 'object' && tokenValue.toNumber) {
          available = tokenValue.toNumber();
        } else if (typeof tokenValue === 'object' && tokenValue.toString) {
          available = parseFloat(tokenValue.toString());
        } else {
          available = Number(tokenValue);
        }
      } else {
        // Fallback to kitchenIngredients for backward compatibility
        available = counts[storageKey] ? 
          (typeof counts[storageKey].toNumber === 'function' ? counts[storageKey].toNumber() : Number(counts[storageKey])) : 0;
      }
    }

    if (amount > available) amount = available;
    if (amount === 0) {

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


    // Close modal first
    closeGiveTokenModal();

    // Process the token giving with all the quest logic from the old system
    let questSpeech = null;
    let friendshipAmount = amount;


    // Always use quest logic for Soap's spark and battery tokens
    if (characterName === 'Soap' && tokenType === 'sparks' && typeof window.giveSparksToSoap === 'function') {
      // Deduct sparks from tokens before calling quest function
      if (window.state && window.state.tokens && window.state.tokens.sparks) {
        if (typeof window.state.tokens.sparks.minus === 'function') {
          window.state.tokens.sparks = window.state.tokens.sparks.minus(amount);
        } else {
          window.state.tokens.sparks = new Decimal(window.state.tokens.sparks).minus(amount);
        }
        if (window.state.tokens.sparks.lt(0)) window.state.tokens.sparks = new Decimal(0);
      }
      window.giveSparksToSoap(amount);
      if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
      return;
    }
    if (characterName === 'Soap' && tokenType === 'batteries' && typeof window.giveBatteriesToSoap === 'function') {
      // Deduct batteries from state before calling quest function
      if (window.state && window.state.batteries) {
        if (typeof window.state.batteries.minus === 'function') {
          window.state.batteries = window.state.batteries.minus(amount);
        } else {
          window.state.batteries = new Decimal(window.state.batteries).minus(amount);
        }
        if (window.state.batteries.lt(0)) window.state.batteries = new Decimal(0);
      }
      window.giveBatteriesToSoap(amount);
      if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
      return;
    }

    // Deduct tokens using decimal arithmetic

    if (tokenType === 'swabucks') {
      if (window.state && window.state.swabucks) {
        const oldAmount = window.state.swabucks;
        if (typeof window.state.swabucks.minus === 'function') {
          window.state.swabucks = window.state.swabucks.minus(amount);
        } else {
          window.state.swabucks = new Decimal(window.state.swabucks).minus(amount);
        }

      }
    } else if (tokenType === 'berryPlate' || tokenType === 'mushroomSoup' || tokenType === 'batteries' || tokenType === 'glitteringPetals' || tokenType === 'chargedPrisma') {
      if (window.state && window.state[tokenType]) {
        const oldAmount = window.state[tokenType];
        if (typeof window.state[tokenType].minus === 'function') {
          window.state[tokenType] = window.state[tokenType].minus(amount);
        } else {
          window.state[tokenType] = new Decimal(window.state[tokenType]).minus(amount);
        }

      }
    } else {
      // Regular tokens are stored in window.state.tokens (primary) with fallback to kitchenIngredients
      // Ensure window.state.tokens is initialized
      if (!window.state) window.state = {};
      if (!window.state.tokens) {
        window.state.tokens = {
          berries: new Decimal(0),
          sparks: new Decimal(0),
          petals: new Decimal(0),
          mushroom: new Decimal(0),
          water: new Decimal(0),
          prisma: new Decimal(0),
          stardust: new Decimal(0)
        };
      }

      if (window.state.tokens[storageKey] !== undefined) {
        const oldAmount = window.state.tokens[storageKey];
        
        // Ensure the token value is a Decimal
        if (!DecimalUtils.isDecimal(window.state.tokens[storageKey])) {
          window.state.tokens[storageKey] = new Decimal(window.state.tokens[storageKey] || 0);
        }
        
        // Perform deduction
        window.state.tokens[storageKey] = window.state.tokens[storageKey].minus(amount);
        
        // Ensure no negative values
        if (window.state.tokens[storageKey].lt(0)) {
          window.state.tokens[storageKey] = new Decimal(0);
        }
      } else if (window.kitchenIngredients && window.kitchenIngredients[storageKey] !== undefined) {
        // Fallback to kitchenIngredients for backward compatibility
        const oldAmount = window.kitchenIngredients[storageKey];
        
        // Ensure the token value is a Decimal
        if (!DecimalUtils.isDecimal(window.kitchenIngredients[storageKey])) {
          window.kitchenIngredients[storageKey] = new Decimal(window.kitchenIngredients[storageKey] || 0);
        }
        
        // Perform deduction
        window.kitchenIngredients[storageKey] = window.kitchenIngredients[storageKey].minus(amount);
        
        // Ensure no negative values
        if (window.kitchenIngredients[storageKey].lt(0)) {
          window.kitchenIngredients[storageKey] = new Decimal(0);
        }
      } else {
        // No tokens found - fail silently
      }
    }


    // Handle Swaria consumption
    if (characterName === 'Swaria') {

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




    // Handle Tico tokens for front desk hunger system
    if (characterName === 'Tico') {

      if (window.frontDesk && typeof window.frontDesk.handleTokenDrop === 'function') {
        window.frontDesk.handleTokenDrop(tokenType, amount);

      } else {



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
      // Call the main character processing function (wrapped in try-catch to prevent speech errors from breaking friendship)
      try {
        showCharacterSpeech(characterName, tokenType);
      } catch (error) {
        console.warn(`Character speech error for ${characterName}:`, error);
      }
      
      // Note: Friendship points are already added in the earlier block above
      // No need to add them again here to avoid double-counting
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
    if (typeof window.updateInventoryModal === 'function') {
      window.updateInventoryModal(true); // Force update
    }

    // Note: Save will be handled by regular save system, not on every token transaction

  }
  
  // Make giveTokenAmount globally available immediately after definition
  window.giveTokenAmount = giveTokenAmount;
  
  setupCharacterDropTargets();
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
      light: (targetGrade >= 2 || (window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1)) ? new Decimal("100").toString() : "0",
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
      permanentElementDiscovery: {
        highestGradeAchieved: 1,
        permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8] // Start with only basic elements
      },
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
    permanentElementDiscovery: {
      highestGradeAchieved: 1,
      permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8] // Start with only basic elements
    },
    generatorUpgrades: {}, // Start fresh
    prismState: (targetGrade >= 2 || (window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1)) ? {
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
  
  // Light generator can be unlocked by grade 2 OR having at least 1 total infinity earned
  const hasInfinityUnlock = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
  if (hasInfinityUnlock || grade >= 2) unlocked.push(true); // light
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

      return false;
    }

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

        alert('Emergency recovery failed.');
      }
    }
    
    return false;
  };
  
  // Add console command to check save integrity
  window.checkSaveIntegrity = function() {
    const isIntact = checkGameIntegrity();

    if (!isIntact) {

      if (!window.state) if (!window.kitchenIngredients) if (!window.friendship) if (window.state && window.state.fluff && window.state.fluff.lt && window.state.fluff.lt(0)) {

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
    // Get current complete game state using the same logic as saveGame()
    const completeGameState = createCompleteGameState();
    
    // Add metadata about the backup
    const backupData = {
      gameState: completeGameState,
      timestamp: Date.now(),
      grade: state.grade ? state.grade.toString() : "1",
      artifacts: state.artifacts ? state.artifacts.toString() : "0",
      kp: state.kp ? state.kp.toString() : "0"
    };
    
    // Use save slot specific key if using save slots
    const saveSlotNumber = (window.SaveSystem && window.SaveSystem.currentSlot) || localStorage.getItem('currentSaveSlot');
    const backupKey = saveSlotNumber ? 
      `deliveryResetBackup_slot${saveSlotNumber}` : 
      'deliveryResetBackup';
    
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));

    updateLastDeliveryInfo(backupData);
    
  } catch (error) {
    console.error('saveDeliveryResetBackup error:', error);
  }
}

// Save expansion reset backup before gradeUp
function saveExpansionResetBackup() {
  if (!window.SaveSystem || typeof window.SaveSystem.serializeState !== 'function') return;
  
  try {
    const saveData = window.SaveSystem.serializeState();
    
    const backupData = {
      version: window.SaveSystem.version,
      timestamp: Date.now(),
      resetType: 'expansion',
      preResetData: saveData,
      expansionInfo: {
        currentGrade: DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1),
        nextGrade: (DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1)) + 1,
        kp: DecimalUtils.formatDecimal(window.state.kp || 0)
      }
    };
    
    const saveSlotNumber = window.SaveSystem ? window.SaveSystem.currentSlot : 
      (localStorage.getItem('currentSaveSlot') ? parseInt(localStorage.getItem('currentSaveSlot')) : null);
    
    const backupKey = saveSlotNumber ? 
      `expansionResetBackup_slot${saveSlotNumber}` : 
      'expansionResetBackup';
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    
    // Track that expansion reset has occurred
    if (!window.state.recoveryTracking) {
      window.state.recoveryTracking = {};
    }
    window.state.recoveryTracking.hasExpansionReset = true;
    
    // Update recovery card visibility
    updateRecoveryCardVisibility();

    updateLastExpansionInfo(backupData);
    
  } catch (error) {
    console.error('saveExpansionResetBackup error:', error);
  }
}

// Save infinity reset backup before infinity reset
function saveInfinityResetBackup() {
  if (!window.SaveSystem || typeof window.SaveSystem.serializeState !== 'function') return;
  
  try {
    const saveData = window.SaveSystem.serializeState();
    
    const backupData = {
      version: window.SaveSystem.version,
      timestamp: Date.now(),
      resetType: 'infinity',
      preResetData: saveData,
      infinityInfo: {
        infinityPoints: DecimalUtils.formatDecimal(window.state.infinitySystem?.infinityPoints || 0),
        totalInfinities: window.infinitySystem?.getTotalInfinities() || 0,
        currenciesWithInfinity: window.infinitySystem?.getCurrenciesWithInfinity() || []
      }
    };
    
    const saveSlotNumber = window.SaveSystem ? window.SaveSystem.currentSlot : 
      (localStorage.getItem('currentSaveSlot') ? parseInt(localStorage.getItem('currentSaveSlot')) : null);
    
    const backupKey = saveSlotNumber ? 
      `infinityResetBackup_slot${saveSlotNumber}` : 
      'infinityResetBackup';
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    
    // Track that infinity reset has occurred
    if (!window.state.recoveryTracking) {
      window.state.recoveryTracking = {};
    }
    window.state.recoveryTracking.hasInfinityReset = true;
    
    // Update recovery card visibility
    updateRecoveryCardVisibility();

    updateLastInfinityInfo(backupData);
    
  } catch (error) {
    console.error('saveInfinityResetBackup error:', error);
  }
}

// Function to update recovery card visibility and info
function updateRecoveryCardVisibility() {
  // Show expansion reset recovery card if player has done at least one expansion reset
  const expansionCard = document.getElementById('expansionResetRecoveryCard');
  if (expansionCard) {
    const hasExpansionReset = window.state && window.state.recoveryTracking && window.state.recoveryTracking.hasExpansionReset;
    expansionCard.style.display = hasExpansionReset ? 'block' : 'none';
    
    // Update expansion reset info if card is visible
    if (hasExpansionReset && typeof window.getExpansionResetBackupInfo === 'function') {
      const info = window.getExpansionResetBackupInfo();
      const infoElement = expansionCard.querySelector('.recovery-info');
      if (infoElement) {
        if (info) {
          const timeString = new Date(info.timestamp).toLocaleString();
          infoElement.innerHTML = `
            <strong>Last Expansion Reset Backup:</strong><br>
            Expansion ${info.grade}<br>
            KP: ${info.kp}<br>
            Saved: ${timeString}
          `;
        } else {
          infoElement.innerHTML = `
            <strong>No backup found</strong><br>
            <em>Perform an expansion reset to create a backup</em>
          `;
        }
      }
    }
  }
  
  // Show infinity reset recovery card if player has done at least one infinity reset
  const infinityCard = document.getElementById('infinityResetRecoveryCard');
  if (infinityCard) {
    const hasInfinityReset = window.state && window.state.recoveryTracking && window.state.recoveryTracking.hasInfinityReset;
    infinityCard.style.display = hasInfinityReset ? 'block' : 'none';
    
    // Update infinity reset info if card is visible
    if (hasInfinityReset && typeof window.getInfinityResetBackupInfo === 'function') {
      const info = window.getInfinityResetBackupInfo();
      const infoElement = infinityCard.querySelector('.recovery-info');
      if (infoElement) {
        if (info) {
          const timeString = new Date(info.timestamp).toLocaleString();
          infoElement.innerHTML = `
            <strong>Last Infinity Reset Backup:</strong><br>
            Infinity Points: ${info.infinityPoints}<br>
            Total Infinity Earned: ${info.totalInfinityEarned}<br>
            Saved: ${timeString}
          `;
        } else {
          infoElement.innerHTML = `
            <strong>No backup found</strong><br>
            <em>Perform an infinity reset to create a backup</em>
          `;
        }
      }
    }
  }
}

// Make function globally accessible
window.updateRecoveryCardVisibility = updateRecoveryCardVisibility;

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
    // swariaKnowledge is no longer used - KP is now in state.kp
    swariaKnowledge: {}, // Keep empty for backwards compatibility
    boughtElements,
    elementDiscoveryProgress: state.elementDiscoveryProgress || 0,
    permanentElementDiscovery: state.permanentElementDiscovery ? {
      highestGradeAchieved: state.permanentElementDiscovery.highestGradeAchieved || 1,
      permanentlyDiscoveredElements: Array.from(state.permanentElementDiscovery.permanentlyDiscoveredElements || [1, 2, 3, 4, 5, 6, 7, 8])
    } : {
      highestGradeAchieved: 1,
      permanentlyDiscoveredElements: [1, 2, 3, 4, 5, 6, 7, 8]
    },
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
    advancedPrismCalibration: (window.advancedPrismState && window.advancedPrismState.calibration) ? {
      stable: {
        light: (window.advancedPrismState.calibration.stable && window.advancedPrismState.calibration.stable.light) ? window.advancedPrismState.calibration.stable.light.toString() : "0",
        redlight: (window.advancedPrismState.calibration.stable && window.advancedPrismState.calibration.stable.redlight) ? window.advancedPrismState.calibration.stable.redlight.toString() : "0",
        orangelight: (window.advancedPrismState.calibration.stable && window.advancedPrismState.calibration.stable.orangelight) ? window.advancedPrismState.calibration.stable.orangelight.toString() : "0",
        yellowlight: (window.advancedPrismState.calibration.stable && window.advancedPrismState.calibration.stable.yellowlight) ? window.advancedPrismState.calibration.stable.yellowlight.toString() : "0",
        greenlight: (window.advancedPrismState.calibration.stable && window.advancedPrismState.calibration.stable.greenlight) ? window.advancedPrismState.calibration.stable.greenlight.toString() : "0",
        bluelight: (window.advancedPrismState.calibration.stable && window.advancedPrismState.calibration.stable.bluelight) ? window.advancedPrismState.calibration.stable.bluelight.toString() : "0"
      },
      nerfs: {
        light: (window.advancedPrismState.calibration.nerfs && window.advancedPrismState.calibration.nerfs.light) ? window.advancedPrismState.calibration.nerfs.light.toString() : "1",
        redlight: (window.advancedPrismState.calibration.nerfs && window.advancedPrismState.calibration.nerfs.redlight) ? window.advancedPrismState.calibration.nerfs.redlight.toString() : "1",
        orangelight: (window.advancedPrismState.calibration.nerfs && window.advancedPrismState.calibration.nerfs.orangelight) ? window.advancedPrismState.calibration.nerfs.orangelight.toString() : "1",
        yellowlight: (window.advancedPrismState.calibration.nerfs && window.advancedPrismState.calibration.nerfs.yellowlight) ? window.advancedPrismState.calibration.nerfs.yellowlight.toString() : "1",
        greenlight: (window.advancedPrismState.calibration.nerfs && window.advancedPrismState.calibration.nerfs.greenlight) ? window.advancedPrismState.calibration.nerfs.greenlight.toString() : "1",
        bluelight: (window.advancedPrismState.calibration.nerfs && window.advancedPrismState.calibration.nerfs.bluelight) ? window.advancedPrismState.calibration.nerfs.bluelight.toString() : "1"
      },
      totalTimeAccumulated: (window.advancedPrismState.calibration && window.advancedPrismState.calibration.totalTimeAccumulated) ? window.advancedPrismState.calibration.totalTimeAccumulated : {
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
  // Use the new SaveSystem export functionality
  if (window.SaveSystem && typeof window.SaveSystem.exportDeliveryResetBackup === 'function') {
    return window.SaveSystem.exportDeliveryResetBackup();
  } else {
    // Fallback to old system if SaveSystem not available
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
      showRecoveryExportStatus('Failed to export backup. Please try again.', 'error');
    }
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
    showRecoveryExportStatus('Failed to copy to clipboard. Please copy the code manually from the text area.', 'error');
  }
  
  document.body.removeChild(textArea);
}

// Function to show export status
function showRecoveryExportStatus(message, type) {
  // If SaveSystem is available, use its notification system first
  if (window.SaveSystem && typeof window.SaveSystem.showSaveNotification === 'function') {
    const isError = (type === 'error');
    window.SaveSystem.showSaveNotification(message, isError);
  }
  
  // Also show in the recovery tab status div for consistency
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

function updateLastExpansionInfo(backupData) {
  const infoDiv = document.getElementById('lastExpansionInfo');
  const timestampDiv = document.getElementById('lastExpansionTimestamp');
  const gradeDiv = document.getElementById('lastExpansionGrade');
  
  if (!infoDiv || !timestampDiv || !gradeDiv) return;
  
  const date = new Date(backupData.timestamp);
  const formattedDate = date.toLocaleString();
  
  timestampDiv.textContent = `Last expansion reset: ${formattedDate}`;
  gradeDiv.textContent = `Expansion: ${backupData.expansionInfo.currentGrade} | KP: ${backupData.expansionInfo.kp}`;
  
  infoDiv.style.display = 'block';
}

function updateLastInfinityInfo(backupData) {
  const infoDiv = document.getElementById('lastInfinityInfo');
  const timestampDiv = document.getElementById('lastInfinityTimestamp');
  const gradeDiv = document.getElementById('lastInfinityGrade');
  
  if (!infoDiv || !timestampDiv || !gradeDiv) return;
  
  const date = new Date(backupData.timestamp);
  const formattedDate = date.toLocaleString();
  
  timestampDiv.textContent = `Last infinity reset: ${formattedDate}`;
  gradeDiv.textContent = `∞ Points: ${backupData.infinityInfo.infinityPoints} | Total ∞: ${backupData.infinityInfo.totalInfinities}`;
  
  infoDiv.style.display = 'block';
}

// Function to check and display last delivery info on page load
function checkLastDeliveryInfo() {
  const saveSlotNumber = (window.SaveSystem && window.SaveSystem.currentSlot) || localStorage.getItem('currentSaveSlot');
  const backupKey = saveSlotNumber ? 
    `deliveryResetBackup_slot${saveSlotNumber}` : 
    'deliveryResetBackup';
  
  const backupDataString = localStorage.getItem(backupKey);
  
  if (backupDataString) {
    try {
      const backupData = JSON.parse(backupDataString);
      updateLastDeliveryInfo(backupData);
    } catch (error) {

    }
  }
}

// Make functions available globally
window.saveDeliveryResetBackup = saveDeliveryResetBackup;
window.saveExpansionResetBackup = saveExpansionResetBackup;
window.saveInfinityResetBackup = saveInfinityResetBackup;
window.updateLastExpansionInfo = updateLastExpansionInfo;
window.updateLastInfinityInfo = updateLastInfinityInfo;
window.exportLastDeliveryReset = exportLastDeliveryReset;
window.checkLastDeliveryInfo = checkLastDeliveryInfo;
window.showSoapDisappointedSpeech = showSoapDisappointedSpeech;
// restoreSwariaImage is already assigned to window earlier at line 6733
// showGiveTokenModal is exported immediately after its definition
// closeGiveTokenModal is exported immediately after its definition  
// giveTokenAmount is exported immediately after its definition

// Debug function to test the give token modal
window.debugGiveTokenModal = function(tokenType = 'berries', characterName = 'Mystic') {
  if (typeof window.showGiveTokenModal === 'function') {
    window.showGiveTokenModal(tokenType, characterName);
  } else {
    console.error('showGiveTokenModal function not found!');
  }
};

// Debug function to test both token types
window.testBothModals = function() {
  window.debugGiveTokenModal('berry', 'Soap');
  
  setTimeout(() => {
    const modal = document.getElementById('giveTokenModal');
    if (modal) modal.style.display = 'none';
    
    window.debugGiveTokenModal('battery', 'Soap');
  }, 2000);
};

// Debug function to check token storage locations
window.debugTokenStorage = function() {
  if (window.state?.tokens) {
  }
};

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    window.script2TrackedSetTimeout(checkLastDeliveryInfo, 1000);
  });
} else {
  window.script2TrackedSetTimeout(checkLastDeliveryInfo, 1000);
}

// Comprehensive cleanup function for script2.js
window.cleanupScript2 = function() {
  // Clear all major intervals
  if (window.swariaSpeechInterval) {
    clearInterval(window.swariaSpeechInterval);
    window.swariaSpeechInterval = null;
  }
  
  if (window.secondaryTickInterval) {
    clearInterval(window.secondaryTickInterval);
    window.secondaryTickInterval = null;
  }
  
  if (window.autosaveInterval) {
    clearInterval(window.autosaveInterval);
    window.autosaveInterval = null;
  }
  
  if (window.slotAutosaveInterval) {
    clearInterval(window.slotAutosaveInterval);
    window.slotAutosaveInterval = null;
  }
  
  if (window.emergencyBackupInterval) {
    clearInterval(window.emergencyBackupInterval);
    window.emergencyBackupInterval = null;
  }
  
  if (window.generatorDarknessInterval) {
    clearInterval(window.generatorDarknessInterval);
    window.generatorDarknessInterval = null;
  }
  
  if (window._mainGameTickInterval) {
    clearInterval(window._mainGameTickInterval);
    window._mainGameTickInterval = null;
  }
  
  if (window._fluffDisplayInterval) {
    clearInterval(window._fluffDisplayInterval);
    window._fluffDisplayInterval = null;
  }
  
  if (window.observatoryWatchdogInterval) {
    clearInterval(window.observatoryWatchdogInterval);
    window.observatoryWatchdogInterval = null;
  }
  
  if (window.chargerUpdateInterval) {
    clearInterval(window.chargerUpdateInterval);
    window.chargerUpdateInterval = null;
  }
  
  // Clear soap timers
  if (soapRandomSpeechTimer) {
    clearTimeout(soapRandomSpeechTimer);
    soapRandomSpeechTimer = null;
  }
  
  if (window.soapCurrentSpeechTimeout) {
    clearTimeout(window.soapCurrentSpeechTimeout);
    window.soapCurrentSpeechTimeout = null;
  }
  
  if (window.soapClickResetTimer) {
    clearTimeout(window.soapClickResetTimer);
    window.soapClickResetTimer = null;
  }
  
  // Stop soap speech timer
  if (typeof stopSoapRandomSpeechTimer === 'function') {
    stopSoapRandomSpeechTimer();
  }
  
  // Clean up event listeners that don't have proper cleanup
  if (window._blackoutMoveListener) {
    window.removeEventListener('mousemove', window._blackoutMoveListener);
    window._blackoutMoveListener = null;
  }
  
  // Clear all tracked timeouts
  if (window.script2Timeouts) {
    window.script2Timeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    window.script2Timeouts = [];
  }
  
  // Reset state flags
  window.soapIsTalking = false;
  window.soapClickCount = 0;
  window.soapLastClickTime = 0;
  window.soapIsMad = false;
};

// Helper function to track timeouts for script2
window.script2TrackedSetTimeout = function(callback, delay) {
  const timeoutId = setTimeout(callback, delay);
  window.script2Timeouts.push(timeoutId);
  return timeoutId;
};

// Battery feeding system support functions

function updateBatteryCounter(batteryUpgrades) {
  // This function now only handles cleanup of any existing battery counters at the top
  const powerGeneratorCard = document.getElementById('powerGeneratorCard');
  if (!powerGeneratorCard) return;
  
  // Remove any existing battery counter from the top
  let batteryCounter = powerGeneratorCard.querySelector('.battery-counter');
  if (batteryCounter && batteryCounter.parentNode) {
    batteryCounter.parentNode.removeChild(batteryCounter);
  }
}

function showBatteryFeedSuccessMessage(batteriesUsed, powerBonus) {
  // Create a temporary success message
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #4CAF50;
    color: white;
    padding: 1em 2em;
    border-radius: 12px;
    font-size: 1.1em;
    font-weight: bold;
    z-index: 999999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: fadeInOut 3s ease-in-out;
  `;
  
  message.textContent = `Gave ${batteriesUsed} ${batteriesUsed === 1 ? 'battery' : 'batteries'} to power generator! Max power increased by +${powerBonus}`;
  
  // Add animation CSS if not already added
  if (!document.getElementById('batteryFeedAnimationCSS')) {
    const style = document.createElement('style');
    style.id = 'batteryFeedAnimationCSS';
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
}

function showBerryPlateLoadSuccessMessage(berryPlatesUsed) {
  // Create a temporary success message
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #4CAF50;
    color: white;
    padding: 1em 2em;
    border-radius: 12px;
    font-size: 1.1em;
    font-weight: bold;
    z-index: 999999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: fadeInOut 3s ease-in-out;
  `;
  
  message.textContent = `Loaded ${berryPlatesUsed} ${berryPlatesUsed === 1 ? 'berry plate' : 'berry plates'} into the delivery truck!`;
  
  // Add animation CSS if not already added
  if (!document.getElementById('berryPlateLoadAnimationCSS')) {
    const style = document.createElement('style');
    style.id = 'berryPlateLoadAnimationCSS';
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
}

function updateDeliverySystemUI() {
  // Update the delivery card with berry plate information
  // This will be called from the main UI update cycle
  updateUI(); // For now, just trigger a full UI update
}

// Make functions globally accessible
window.showBerryPlateLoadSuccessMessage = showBerryPlateLoadSuccessMessage;
window.updateDeliverySystemUI = updateDeliverySystemUI;

function updateBatteryUpgradeDisplay() {
  const batteryUpgradeDisplay = document.querySelector('.battery-upgrade-display');
  const batteryUpgradeHint = document.querySelector('.battery-upgrade-hint');
  
  // Ensure battery upgrades state exists
  if (!DecimalUtils.isDecimal(window.state.powerGeneratorBatteryUpgrades)) {
    window.state.powerGeneratorBatteryUpgrades = new Decimal(0);
  }
  
  const batteryUpgrades = DecimalUtils.toDecimal(window.state.powerGeneratorBatteryUpgrades);
  const batteryBonus = batteryUpgrades.mul(5);
  
  // Update battery counter in the title area
  updateBatteryCounter(batteryUpgrades);
  
  // If we have upgrades, show the upgrade display, otherwise remove any display
  if (batteryUpgrades.gt(0)) {
    if (batteryUpgradeHint) {
      // Replace hint with upgrade display
      const newDisplay = document.createElement('div');
      newDisplay.className = 'battery-upgrade-display';
      newDisplay.style.cssText = 'margin-top: 10px; padding: 8px; background: rgba(255, 193, 7, 0.1); border-radius: 6px; border: 1px solid rgba(255, 193, 7, 0.3);';
      newDisplay.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <img src="assets/icons/battery token.png" alt="Battery" style="width: 16px; height: 16px;">
            <small style="color: #f57f17; font-weight: bold;">Battery Upgrades: ${batteryUpgrades}</small>
          </div>
          <small style="color: #f57f17; font-weight: bold;">+${batteryBonus} Max Power</small>
        </div>
        <div style="margin-top: 4px;">
          <small style="color: #666; font-size: 0.75em;">Drag battery tokens here to permanently increase max power</small>
        </div>
      `;
      batteryUpgradeHint.parentNode.replaceChild(newDisplay, batteryUpgradeHint);
    } else if (batteryUpgradeDisplay) {
      // Update existing display
      const countElement = batteryUpgradeDisplay.querySelector('small[style*="color: #f57f17"]');
      const bonusElement = batteryUpgradeDisplay.querySelectorAll('small[style*="color: #f57f17"]')[1];
      if (countElement) countElement.textContent = `Batteries Given: ${batteryUpgrades}`;
      if (bonusElement) bonusElement.textContent = `+${batteryBonus} Max Power`;
    }
  } else {
    // Remove any existing display or hint when no upgrades
    if (batteryUpgradeDisplay && batteryUpgradeDisplay.parentNode) {
      batteryUpgradeDisplay.parentNode.removeChild(batteryUpgradeDisplay);
    }
    if (batteryUpgradeHint && batteryUpgradeHint.parentNode) {
      batteryUpgradeHint.parentNode.removeChild(batteryUpgradeHint);
    }
  }
}

// Make functions globally accessible
window.updateBatteryCounter = updateBatteryCounter;
window.updateBatteryUpgradeDisplay = updateBatteryUpgradeDisplay;
window.getCharacterChallengeQuotes = getCharacterChallengeQuotes;
window.showSoapSpeech = showSoapSpeech;