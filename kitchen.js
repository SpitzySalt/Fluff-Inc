// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file

// DecimalUtils is available globally from decimal_utils.js

// Performance optimization constants
const KITCHEN_UI_UPDATE_THROTTLE = 100; // 10 FPS for UI updates
const COOKING_PROGRESS_UPDATE_THROTTLE = 200; // 5 FPS for cooking progress

// Throttling helpers
let lastKitchenUIUpdate = 0;
let lastCookingProgressUpdate = 0;

// Token cleanup management
function cleanupExpiredIngredientTokens() {
  if (!window.activeIngredientTokens) return;
  
  const now = Date.now();
  window.activeIngredientTokens = window.activeIngredientTokens.filter(item => {
    if (!item.token.parentNode) {
      // Token was removed from DOM, clear its timeout and remove from array
      clearTimeout(item.fadeTimeout);
      return false;
    }
    return true;
  });
}

// Run token cleanup every 30 seconds
if (!window.kitchenTokenCleanupInterval) {
  window.kitchenTokenCleanupInterval = setInterval(cleanupExpiredIngredientTokens, 30000);
}











































const recipes = [
  {
    id: 'berryPlate',
    name: 'Berry Plate',
    image: 'assets/icons/berry plate token.png',
    cost: { berries: new Decimal(50), water: new Decimal(5) },
    timePer: new Decimal(5), 
    unit: 'plates',
    rewardProperty: 'berryPlate'
  },
  {
    id: 'mushroomSoup',
    name: 'Mushroom Soup',
    image: 'assets/icons/mushroom soup token.png', 
    cost: { mushroom: new Decimal(50), water: new Decimal(5) },
    timePer: new Decimal(5), 
    unit: 'soups',
    rewardProperty: 'mushroomSoup'
  },
  {
    id: 'batteries',
    name: 'Batteries',
    image: 'assets/icons/battery token.png',
    cost: { sparks: new Decimal(50), prisma: new Decimal(5) },
    timePer: new Decimal(5), 
    unit: 'batteries',
    rewardProperty: 'batteries'
  },
  {
    id: 'glitteringPetals',
    name: 'Glittering Petals',
    image: 'assets/icons/glittering petal token.png', 
    cost: { petals: new Decimal(50), stardust: new Decimal(5) },
    timePer: new Decimal(5), 
    unit: 'petals',
    rewardProperty: 'glitteringPetals'
  },
  {
    id: 'chargedPrisma',
    name: 'Charged Prisma',
    image: 'assets/icons/charged prism token.png', 
    cost: { prisma: new Decimal(50), sparks: new Decimal(10), stardust: new Decimal(3) },
    timePer: new Decimal(5), 
    unit: 'prismas',
    rewardProperty: 'chargedPrisma'
  }
];
const INGREDIENT_TYPES = [
  { name: 'mushroom', display: 'Mushroom' },
  { name: 'spark', display: 'Sparks' },
  { name: 'berry', display: 'Berries' },
  { name: 'petal', display: 'Petals' },
  { name: 'water', display: 'Water' }, 
  { name: 'prisma', display: 'Prisma Shard' },
  { name: 'stardust', display: 'Stardust' }, 
  { name: 'swabucks', display: 'Swa bucks' },
  { name: 'candy', display: 'Candy' },
  { name: 'honey', display: 'Honey' }
];
const INGREDIENT_TYPE_IMAGES = {
  mushroom: 'assets/icons/mushroom token.png',
  spark: 'assets/icons/spark token.png',
  berry: 'assets/icons/berry token.png',
  petal: 'assets/icons/petal token.png',
  water: 'assets/icons/water token.png', 
  prisma: 'assets/icons/prisma token.png',
  stardust: 'assets/icons/stardust token.png',
  swabucks: 'assets/icons/Swa Buck.png',
  candy: 'assets/icons/candy token.png',
  honey: 'assets/icons/honey token.png'
};

// Make kitchen.js variables globally accessible
window.recipes = recipes;
window.INGREDIENT_TYPES = INGREDIENT_TYPES;
window.INGREDIENT_TYPE_IMAGES = INGREDIENT_TYPE_IMAGES;

function getRandomIngredientType(context) {
  let weights;
  const isNight = window.daynight && typeof window.daynight.getTime === 'function' && 
    (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
    })();
  switch (context) {
    case 'cargo':
      weights = [4, 2, 6, 0.5, 1, 0.5, isNight ? 5 : 0, 0.2]; 
      break;
    case 'generator':
      weights = [2, 6, 4, 0.5, 0, 0.5, isNight ? 3 : 0, 0.1];
      break;
    case 'terrarium':
      weights = [4, 1, 5, 6, 4, 0.5, isNight ? 6 : 0, 0.2]; 
      break;
    case 'prism':
      weights = [1, 1, 2, 1, 3, 6, isNight ? 7 : 0, 0.3];
      break;
    case 'crusher':
      // Heavily favor candy tokens from the Swandy Crusher minigame
      // [mushroom, sparks, berries, petals, water, prisma, stardust, swabucks, candy]
      weights = [1, 1, 1, 1, 1, 1, isNight ? 0.3 : 0, 0.2, 10];
      break;
    default:
      weights = [1, 1, 1, 1, 1, 1, isNight ? 1 : 0, 1];
  }
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) {
      const selectedType = INGREDIENT_TYPES[i].name;
      return selectedType;
    }
    r -= weights[i];
  }
  const fallbackType = INGREDIENT_TYPES[0].name;
  return fallbackType;

// Make kitchen.js functions globally accessible
window.getRandomIngredientType = getRandomIngredientType;
}

window.activeIngredientTokens = window.activeIngredientTokens || [];
window.ingredientTokenCooldown = window.ingredientTokenCooldown || {
  cargo: 0,
  generator: 0,
  terrarium: 0,
  prism: 0,
  crusher: 0
};

function getNearbyPosition(element) {
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 120;
  const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * 80;
  return { x, y };
}

// Helper function to get Lepre token burst chance
function getLepreTokenBurstChance() {
  if (!window.friendship || !window.friendship.Boutique) return 0;
  
  const lepreLevel = window.friendship.Boutique.level || 0;
  if (lepreLevel < 4) return 0;
  
  // Base 10% at level 4, +2% per level after 4
  const chance = 10 + (2 * Math.max(0, lepreLevel - 4));
  return chance;
}

function spawnIngredientToken(context, sourceElement) {
  if (context === 'generator') {
    const genTab = document.getElementById('generatorMainTab');
    if (!genTab || genTab.style.display === 'none' || genTab.offsetParent === null) {
      return;
    }
  }
  const now = Date.now();
  if (window.ingredientTokenCooldown[context] && now < window.ingredientTokenCooldown[context]) {
    return;
  }
  let chance = (context === 'generator') ? 1/1000 : 
               (context === 'prism') ? 1/10 : 
               (context === 'terrarium') ? 1/1 : 
               (context === 'crusher') ? 1 : // Always pass for crusher (chance already checked)
               1/75;
  if (Math.random() > chance) {
    return;
  }
  
  // Check grade requirement (Grade 3+ needed for ingredient tokens)
  if (window.state && window.state.grade) {
    const grade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade : new Decimal(window.state.grade);
    if (grade.lt(3)) {
      return;
    }
  } else if (typeof window.currentGrade !== 'undefined' && window.currentGrade < 3) {
    return;
  }
  
  // Check for Lepre token burst
  const burstChance = getLepreTokenBurstChance();
  const shouldBurst = burstChance > 0 && Math.random() * 100 < burstChance;
  const tokenCount = shouldBurst ? 5 : 1;
  
  // Show burst message if burst occurs
  if (shouldBurst) {

    // Show visual notification
    showTokenBurstNotification(sourceElement);
  }
  
  // Spawn the tokens
  for (let i = 0; i < tokenCount; i++) {
    spawnSingleIngredientToken(context, sourceElement, i > 0);
  }
}

function spawnSingleIngredientToken(context, sourceElement, isBurstToken = false) {
  let type = getRandomIngredientType(context);
  
  // Halloween candy replacement logic - 25% chance to replace with candy
  const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                           (window.premiumState && window.premiumState.halloweenEventActive) ||
                           document.body.classList.contains('halloween-cargo-active') ||
                           document.body.classList.contains('halloween-event-active');
  
  if (isHalloweenActive && Math.random() < 0.25) {
    type = 'candy';
  }
  
  const token = document.createElement('img');
  token.src = INGREDIENT_TYPE_IMAGES[type] || 'assets/icons/flower.png';
  token.className = 'ingredient-token';
  token.dataset.context = context; // Store the source context for tracking
  token.style.position = 'fixed';
  token.style.zIndex = 99999;
  token.style.width = '48px';
  token.style.height = '48px';
  token.style.transition = 'transform 0.7s cubic-bezier(.4,2,.6,1), opacity 0.5s';
  token.style.cursor = 'pointer';
  token.dataset.type = type;
  token.dataset.spawnTime = Date.now();
  token.dataset.collected = 'false';
  
  // Add special styling for burst tokens
  if (isBurstToken) {
    token.style.filter = 'drop-shadow(0 0 8px gold)';
    token.style.animation = 'tokenBurstGlow 2s ease-in-out infinite alternate';
    token.dataset.burstToken = 'true';
    
    // Add CSS animation if it doesn't exist
    if (!document.getElementById('tokenBurstStyles')) {
      const style = document.createElement('style');
      style.id = 'tokenBurstStyles';
      style.textContent = `
        @keyframes tokenBurstGlow {
          0% { filter: drop-shadow(0 0 8px gold) brightness(1.2) scale(1); }
          100% { filter: drop-shadow(0 0 12px gold) brightness(1.4) scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  const start = sourceElement.getBoundingClientRect();
  token.style.left = (start.left + start.width/2 - 24) + 'px';
  token.style.top = (start.top + start.height/2 - 24) + 'px';
  document.body.appendChild(token);
  setTimeout(() => {
    const { x, y } = getNearbyPosition(sourceElement);
    token.style.transform = `translate(${x - (start.left + start.width/2)}px, ${y - (start.top + start.height/2)}px)`;
  }, 10);
  token.style.opacity = '0.5';
  
  // Handle filter for burst tokens vs normal tokens
  if (isBurstToken) {
    token.style.filter = 'drop-shadow(0 0 8px gold) grayscale(50%)';
    // Temporarily disable animation during spawn
    token.style.animation = 'none';
  } else {
    token.style.filter = 'grayscale(50%)';
  }
  
  setTimeout(() => {
    if (token.dataset.collected !== 'true') {
      token.style.opacity = '1';
      if (isBurstToken) {
        token.style.filter = 'drop-shadow(0 0 8px gold)';
        token.style.animation = 'tokenBurstGlow 2s ease-in-out infinite alternate';
      } else {
        token.style.filter = 'none';
      }
    }
  }, 1000);
  
  // Add drag functionality for tokens
  let dragStartTime = 0;
  let isDragging = false;
  
  token.onmousedown = function(e) {
    if (token.dataset.collected === 'true') return;
    const spawnTime = parseInt(token.dataset.spawnTime);
    const now = Date.now();
    if (now - spawnTime < 1000) return;
    
    dragStartTime = now;
    isDragging = false;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const onMouseMove = function(moveEvent) {
      const distance = Math.sqrt(
        Math.pow(moveEvent.clientX - startX, 2) + 
        Math.pow(moveEvent.clientY - startY, 2)
      );
      
      if (distance > 5 && !isDragging) {
        isDragging = true;
        window._draggingToken = true;
        window._draggingTokenType = type;
        token.style.zIndex = 100000;
        token.style.cursor = 'grabbing';
        token.style.filter = 'brightness(1.2)';
      }
      
      if (isDragging) {
        token.style.left = (moveEvent.clientX - 24) + 'px';
        token.style.top = (moveEvent.clientY - 24) + 'px';
        token.style.transform = 'none';
        token.style.transition = 'none';
      }
    };
    
    const onMouseUp = function(upEvent) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (isDragging) {
        // Check if mouse is over Jadeca's character image
        const elementsUnderMouse = document.elementsFromPoint(upEvent.clientX, upEvent.clientY);
        const jadecaImg = document.getElementById('jadecaCharacter');
        const isOverJadeca = jadecaImg && elementsUnderMouse.includes(jadecaImg);
        
        
        if (isOverJadeca && typeof handleTokenGivenToJadeca === 'function') {
          // Give token to Jadeca
          handleTokenGivenToJadeca(type, token);
          
          // Reset dragging state after handling
          window._draggingToken = false;
          window._draggingTokenType = null;
          isDragging = false;
        } else {
          // Not over Jadeca, reset token position
          window._draggingToken = false;
          window._draggingTokenType = null;
          isDragging = false;
          
          token.style.cursor = 'pointer';
          token.style.zIndex = 99999;
          if (isBurstToken) {
            token.style.filter = 'drop-shadow(0 0 8px gold)';
          } else {
            token.style.filter = 'none';
          }
        }
      } else {
        const clickDuration = Date.now() - dragStartTime;
        if (clickDuration < 200) {
          token.onclick();
        }
      }
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  token.onclick = function() {

    if (token.dataset.collected === 'true') return;
    const spawnTime = parseInt(token.dataset.spawnTime);
    const now = Date.now();
    if (now - spawnTime < 1000) {

      return;
    }
    token.dataset.collected = 'true';

    collectIngredientToken(type, token);
  };
  
  // Remove hover handlers to prevent JS/CSS conflicts - use CSS-only hover
  // token.onmouseenter and token.onmouseleave removed
  const fadeTimeout = setTimeout(() => {
    if (token.dataset.collected === 'true') return;
    
    // Clean up from active tokens array before removal
    if (window.activeIngredientTokens) {
      const index = window.activeIngredientTokens.findIndex(item => item.token === token);
      if (index !== -1) {
        window.activeIngredientTokens.splice(index, 1);
      }
    }
    
    token.style.opacity = '0';
    setTimeout(() => token.remove(), 600);
  }, 10000);
  window.activeIngredientTokens.push({ token, fadeTimeout });
  
  // Only apply cooldown for the first token in a burst
  if (!isBurstToken) {
    window.ingredientTokenCooldown[context] = Date.now() + 5000;
  }
}

function collectIngredientToken(type, token) {
  // Find token data for proper cleanup
  let tokenData = {};
  if (window.activeIngredientTokens) {
    const tokenIndex = window.activeIngredientTokens.findIndex(item => item.token === token);
    if (tokenIndex !== -1) {
      tokenData = window.activeIngredientTokens[tokenIndex];
    }
  }

  // Calculate token gain amount with green stable light buff
  let tokenGainAmount = new Decimal(1);
  if (typeof window.applyGreenStableLightBuff === 'function') {
    tokenGainAmount = window.applyGreenStableLightBuff(tokenGainAmount);
  }
  
  // Apply KitoFox mode 5x multiplier (except for candy tokens)
  if (window.state && window.state.kitoFoxModeActive && type !== 'candy') {
    tokenGainAmount = tokenGainAmount.mul(5);
  }
  
  // Initialize state if needed
  if (!window.state) window.state = {};
  if (!window.state.tokens) {
    window.state.tokens = {
      berry: new Decimal(0),
      spark: new Decimal(0),
      petal: new Decimal(0),
      mushroom: new Decimal(0),
      water: new Decimal(0),
      prisma: new Decimal(0),
      stardust: new Decimal(0),
      candy: new Decimal(0),
      honey: new Decimal(0)
    };
  }

  let collectedResources = {};
  
  if (type === 'swabucks') {
    if (!DecimalUtils.isDecimal(window.state.swabucks)) window.state.swabucks = new Decimal(0);
    window.state.swabucks = window.state.swabucks.add(tokenGainAmount);
    collectedResources.swabucks = tokenGainAmount;
  } else {
    // Store basic ingredient tokens in window.state.tokens
    if (!DecimalUtils.isDecimal(window.state.tokens[type])) {
      window.state.tokens[type] = new Decimal(0);
    }
    window.state.tokens[type] = window.state.tokens[type].add(tokenGainAmount);
    collectedResources[type] = tokenGainAmount;
    
    // Track token collection for KitoFox Challenge
    if (type === 'berry' && typeof window.trackHardModeBerryTokenCollection === 'function') {
      window.trackHardModeBerryTokenCollection(tokenGainAmount);
    }
    if (type === 'stardust' && typeof window.trackHardModeStardustTokenCollection === 'function') {
      window.trackHardModeStardustTokenCollection(tokenGainAmount);
    }
    
    // Track water token collection during night hours for KitoFox Challenge 2
    if (type === 'water' && typeof window.trackKitoFox2WaterTokenNightCollection === 'function') {
      window.trackKitoFox2WaterTokenNightCollection(tokenGainAmount);
    }
    
    // Track petal token collection for KitoFox Challenge 2
    if (type === 'petal' && typeof window.trackKitoFox2PetalTokenCollection === 'function') {
      window.trackKitoFox2PetalTokenCollection(tokenGainAmount);
    }
    
    // Update Halloween event button display when candy is collected
    if (type === 'candy' && typeof window.updateHalloweenEventButtonDisplay === 'function') {
      window.updateHalloweenEventButtonDisplay();
    }
    
    showIngredientGainPopup(token, tokenGainAmount);
    
    // Force inventory update
    if (typeof window.renderInventoryTokens === 'function') {
      window.renderInventoryTokens(true);
    }
    if (typeof window.updateInventoryModal === 'function') {
      window.updateInventoryModal(true);
    }
  }

  // Use TokenCleanupSystem for proper cleanup
  if (window.TokenCleanupSystem) {
    window.TokenCleanupSystem.cleanupCollectedToken(token, {...tokenData, type: 'ingredient'}, collectedResources);
  } else {
    // Fallback cleanup for compatibility
    token.style.transform += ' scale(0.2)';
    token.style.opacity = '0';
    setTimeout(() => token.remove(), 400);
    
    if (window.activeIngredientTokens) {
      const index = window.activeIngredientTokens.findIndex(item => item.token === token);
      if (index !== -1) {
        clearTimeout(window.activeIngredientTokens[index].fadeTimeout);
        window.activeIngredientTokens.splice(index, 1);
      }
    }
  }
  
  // Track token collection for front desk automator unlock progress
  if (window.frontDesk && typeof window.frontDesk.onTokenCollected === 'function') {
    window.frontDesk.onTokenCollected();
  }
  
  // Track token collection for quest progress
  if (typeof window.trackTokenCollection === 'function') {
    window.trackTokenCollection(tokenGainAmount);
  }
  
  // Track specific token type for quest progress
  if (typeof window.trackSpecificTokenCollection === 'function') {
    window.trackSpecificTokenCollection(type, tokenGainAmount);
  }
  
  // Track tokens from specific sources for quest progress
  if (typeof window.trackTokensFromSource === 'function' && token.dataset && token.dataset.context) {
    const context = token.dataset.context;
    
    if (context === 'generator') {
      window.trackTokensFromSource('boxes', tokenGainAmount);
    } else if (context === 'cargo') {
      window.trackTokensFromSource('cargoBoxes', tokenGainAmount);
    } else if (context === 'prism') {
      window.trackTokensFromSource('prism', tokenGainAmount);
      // Also track prism clicks for quests that require clicking prism tiles
      if (typeof window.trackPrismClick === 'function') {
        window.trackPrismClick(1);
      }
    } else if (context === 'terrarium') {
      window.trackTokensFromSource('terrarium', tokenGainAmount);
      
      // Special Fluzzer reaction to petal tokens collected in terrarium
      if (type === 'petals' && typeof window.isTerrariumTabVisible === 'function' && window.isTerrariumTabVisible()) {
        if (typeof window.triggerFluzzerPetalReaction === 'function') {
          window.triggerFluzzerPetalReaction();
        }
      }
    }
  }
  
  // Track nighttime token collection for quest progress
  if (typeof window.trackTokensFromSource === 'function') {
    // Check if it's currently nighttime using the same logic as quest system
    const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && 
                       (() => {
                         const gameMinutes = window.daynight.getTime();
                         const NIGHT_START = 22 * 60; // 22:00 = 1320 minutes
                         const DAY_START = 6 * 60;    // 6:00 = 360 minutes
                         return gameMinutes >= NIGHT_START || gameMinutes < DAY_START;
                       })();
    
    if (isNightTime) {
      window.trackTokensFromSource('night', tokenGainAmount);
    }
  }
  
  // Check for Token Challenge Trophy boost (chance for free Swa Bucks)
  if (window.state && window.state.trophies && window.state.trophies.tokenChallenge && window.state.trophies.tokenChallenge.unlockedTier) {
    let bonusChance = 0;
    const trophyTier = window.state.trophies.tokenChallenge.unlockedTier;
    
    if (trophyTier === 'bronze') {
      bonusChance = 0.02; // 2%
    } else if (trophyTier === 'silver') {
      bonusChance = 0.06; // 6%
    } else if (trophyTier === 'gold') {
      bonusChance = 0.15; // 15%
    }
    
    if (bonusChance > 0 && Math.random() < bonusChance) {
      // Award 1 free Swa Buck
      if (!window.state.swabucks) {
        window.state.swabucks = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.swabucks)) {
        window.state.swabucks = new Decimal(window.state.swabucks);
      }
      window.state.swabucks = window.state.swabucks.add(1);
      
      // Show bonus notification
      if (typeof window.showGenericRewardNotification === 'function') {
        window.showGenericRewardNotification('swabucks', 1, 'Token Challenge Bonus!', 'Free Swa Buck from token collection');
      }
    }
  }
  
  if (typeof updateKitchenUI === 'function') updateKitchenUI(true);
  // Note: Save will be handled by regular save system, not on every token collection
  if (typeof window.updateInventoryModal === 'function') window.updateInventoryModal(true); // Force update after token collection
}

function showIngredientGainPopup(token, amount) {
  const popup = document.createElement('div');
  // Format the amount - if it's exactly 1, show +1, otherwise show the decimal value
  const amountText = amount && amount.eq && amount.eq(1) ? '+1' : `+${amount.toFixed(1)}`;
  popup.textContent = amountText;
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

  // Award friendship to Mystic for collecting ingredient
  awardMysticFriendshipForIngredientCollection();
}

function showTokenBurstNotification(sourceElement) {
  const burstChance = getLepreTokenBurstChance();
  const notification = document.createElement('div');
  notification.textContent = `TOKEN BURST!`;
  notification.style.position = 'fixed';
  notification.style.zIndex = 100001;
  notification.style.fontWeight = 'bold';
  notification.style.fontSize = '1.5em';
  notification.style.color = '#ffd700';
  notification.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
  notification.style.pointerEvents = 'none';
  notification.style.opacity = '0';
  notification.style.transform = 'scale(0.5)';
  notification.style.transition = 'all 0.5s cubic-bezier(.4,2,.6,1)';
  
  const rect = sourceElement.getBoundingClientRect();
  notification.style.left = (rect.left + rect.width/2 - 100) + 'px';
  notification.style.top = (rect.top - 40) + 'px';
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'scale(1) translateY(-20px)';
  }, 10);
  
  // Fade out and remove
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'scale(1.2) translateY(-40px)';
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

// Centralized cooking completion handler to prevent duplicate tracking
function completeCooking(recipeId, amount) {
  // Find the recipe to get reward property
  const recipe = recipes.find(r => r.id === recipeId);
  if (recipe) {
    // Initialize state if needed
    if (!window.state) window.state = {};
    
    // Ensure the reward property exists and is properly initialized
    if (!DecimalUtils.isDecimal(window.state[recipe.rewardProperty])) {
      window.state[recipe.rewardProperty] = new Decimal(window.state[recipe.rewardProperty] || 0);
    }
    
    // Add the cooked amount to the player's inventory
    window.state[recipe.rewardProperty] = window.state[recipe.rewardProperty].add(amount);
    
    // Update UI to reflect the new inventory
    if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
    if (typeof updateKitchenUI === 'function') updateKitchenUI(true);
    if (typeof window.updateInventoryModal === 'function') window.updateInventoryModal(true);
  }
  
  // Track quest progress
  if (typeof trackHardModeIngredientsCooked === 'function') {
    trackHardModeIngredientsCooked(amount);
  }
  if (typeof window.trackKitoFox2IngredientsCooked === 'function') {
    window.trackKitoFox2IngredientsCooked(amount);
  }
  if (typeof window.trackHardModeCookingAction === 'function') {
    window.trackHardModeCookingAction(recipeId, amount);
  }
  if (typeof window.trackCookingAction === 'function') {
    window.trackCookingAction(recipeId, amount);
  }
}

function updateKitchenUI(forceUpdate = false) {
  const now = Date.now();
  if (!forceUpdate && (now - lastKitchenUIUpdate) < KITCHEN_UI_UPDATE_THROTTLE) {
    return;
  }
  lastKitchenUIUpdate = now;

  // Initialize state.tokens if needed - ensure object exists first
  if (!window.state) window.state = {};
  if (!window.state.tokens) {
    window.state.tokens = {};
  }
  
  // Map display element IDs (plural) to state keys (singular)
  const tokenDisplayMap = [
    { stateKey: 'berry', elementId: 'berries' },
    { stateKey: 'mushroom', elementId: 'mushroom' },
    { stateKey: 'spark', elementId: 'sparks' },
    { stateKey: 'petal', elementId: 'petals' },
    { stateKey: 'water', elementId: 'water' },
    { stateKey: 'prisma', elementId: 'prisma' },
    { stateKey: 'stardust', elementId: 'stardust' },
    { stateKey: 'candy', elementId: 'candy' },
    { stateKey: 'honey', elementId: 'honey' }
  ];
  
  tokenDisplayMap.forEach(token => {
    // Only initialize to 0 if the key doesn't exist at all, preserve existing values
    if (window.state.tokens[token.stateKey] === undefined || window.state.tokens[token.stateKey] === null) {
      window.state.tokens[token.stateKey] = new Decimal(0);
    } else if (!DecimalUtils.isDecimal(window.state.tokens[token.stateKey])) {
      // Convert existing value to Decimal without losing the value
      window.state.tokens[token.stateKey] = new Decimal(window.state.tokens[token.stateKey]);
    }
    const el = document.getElementById('ingredientCount-' + token.elementId);
    if (el) {
      el.textContent = formatNumber(window.state.tokens[token.stateKey]);
    }
  });
  
  // Handle swabucks separately since it's stored directly in window.state
  if (!DecimalUtils.isDecimal(window.state.swabucks)) {
    window.state.swabucks = new Decimal(0);
  }
  const swabucksEl = document.getElementById('ingredientCount-swabucks');
  if (swabucksEl) {
    swabucksEl.textContent = formatNumber(window.state.swabucks);
  }
  
  // Update cooking speed boost display
  updateCookingSpeedBoostDisplay();
}

// Make updateKitchenUI globally accessible
window.updateKitchenUI = updateKitchenUI;

// Function to update cooking speed boost display in mixing card
function updateCookingSpeedBoostDisplay() {
  const boostDisplay = document.getElementById('cookingSpeedBoostDisplay');
  const boostText = document.getElementById('cookingSpeedBoostText');
  
  if (!boostDisplay || !boostText) return;
  
  // Check if Halloween mode is active for text selection
  const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                           (window.premiumState && window.premiumState.halloweenEventActive) ||
                           document.body.classList.contains('halloween-cargo-active') ||
                           document.body.classList.contains('halloween-event-active');
  
  let displayContent = '';
  let shouldDisplay = false;
  
  // Check if mixing system exists and has mushroom soup
  if (window.state && window.state.mixingSystem && window.state.mixingSystem.totalMushroomSoupGiven) {
    // Ensure totalMushroomSoupGiven is a Decimal
    if (!DecimalUtils.isDecimal(window.state.mixingSystem.totalMushroomSoupGiven)) {
      window.state.mixingSystem.totalMushroomSoupGiven = new Decimal(window.state.mixingSystem.totalMushroomSoupGiven || 0);
    }
    
    if (window.state.mixingSystem.totalMushroomSoupGiven.gt(0)) {
      const boostValue = new Decimal(1).add(window.state.mixingSystem.totalMushroomSoupGiven.mul(0.01));
      const speedText = isHalloweenActive ? 'brewing speed' : 'cooking speed';
      displayContent += `<img src="assets/icons/mushroom soup token.png" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;">x${boostValue.toFixed(2)} <span id="cookingSpeedLabel">${speedText}</span>`;
      shouldDisplay = true;
    }
  }
  
  // Check if Mystic quest premium token buff is active
  if (typeof window.getMysticPremiumTokenBuffMultiplier === 'function') {
    const mysticMultiplier = window.getMysticPremiumTokenBuffMultiplier();
    if (mysticMultiplier > 1) {
      if (shouldDisplay) {
        displayContent += '<br>';
      }
      const bonusPercent = Math.round((mysticMultiplier - 1) * 100);
      displayContent += `<span style="color: #9c27b0; font-weight: bold;">Premium token duration +${bonusPercent}%</span>`;
      shouldDisplay = true;
    }
  }
  
  if (shouldDisplay) {
    boostText.innerHTML = displayContent;
    boostDisplay.style.display = 'block';
  } else {
    boostDisplay.style.display = 'none';
  }
}

// Make the function globally accessible
window.updateCookingSpeedBoostDisplay = updateCookingSpeedBoostDisplay;

// Helper function to get cooking/brewing terminology based on Halloween mode
function getCookingTerminology(baseWord = 'cook') {
  const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                           (window.premiumState && window.premiumState.halloweenEventActive) ||
                           document.body.classList.contains('halloween-cargo-active') ||
                           document.body.classList.contains('halloween-event-active');
  
  const terminologyMap = {
    'cook': isHalloweenActive ? 'brew' : 'cook',
    'cooking': isHalloweenActive ? 'brewing' : 'cooking',
    'Cook': isHalloweenActive ? 'Brew' : 'Cook',
    'Cooking': isHalloweenActive ? 'Brewing' : 'Cooking'
  };
  
  return terminologyMap[baseWord] || baseWord;
}

// Make the helper function globally accessible
window.getCookingTerminology = getCookingTerminology;

// Challenge speech quotes - Mystic comparing their PB with player's PB (non-caring about poor performance)
const mysticChallengeQuotes = [
  // When player doesn't have a PB but Mystic does
  { text: () => `I got ${(window.state.characterChallengePBs?.mystic || 0)} seconds in the Power Generator Challenge. Whatever, it's not cooking.`, condition: () => window.state.characterChallengePBs?.mystic && !window.state.powerChallengePersonalBest },
  { text: () => `Power Generator Challenge? ${(window.state.characterChallengePBs?.mystic || 0)} seconds. Don't care much about it, honestly.`, condition: () => window.state.characterChallengePBs?.mystic && !window.state.powerChallengePersonalBest },
  { text: () => `${(window.state.characterChallengePBs?.mystic || 0)} seconds on that generator thing. Meh, I'd rather focus on cooking.`, condition: () => window.state.characterChallengePBs?.mystic && !window.state.powerChallengePersonalBest },
  { text: () => `I managed ${(window.state.characterChallengePBs?.mystic || 0)} seconds in the Power Generator Challenge, but who cares? Food is more important.`, condition: () => window.state.characterChallengePBs?.mystic && !window.state.powerChallengePersonalBest },
  
  // When Mystic's PB is better than player's (Mystic survived longer)
  { text: () => `My Power Generator Challenge time: ${(window.state.characterChallengePBs?.mystic || 0)} seconds. Yours: ${window.state.powerChallengePersonalBest || 0} seconds. Whatever, it's just a silly game.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.mystic) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `I beat you by ${(parseFloat(window.state.characterChallengePBs?.mystic || 0) - parseFloat(window.state.powerChallengePersonalBest || 0)).toFixed(2)} seconds in the Power Generator Challenge. Not that I care or anything.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.mystic) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `${(window.state.characterChallengePBs?.mystic || 0)} seconds versus your ${window.state.powerChallengePersonalBest || 0} seconds. I won, but it's not like it matters. Can we talk about food instead?`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.mystic) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `Power Generator Challenge results: Me ${(window.state.characterChallengePBs?.mystic || 0)} seconds, you ${window.state.powerChallengePersonalBest || 0} seconds. Cool, I guess. Now back to cooking.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.mystic) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  { text: () => `Your ${window.state.powerChallengePersonalBest || 0} seconds isn't bad, but my ${(window.state.characterChallengePBs?.mystic || 0)} seconds is better. Anyway, want some berry plate?`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.characterChallengePBs.mystic) > parseFloat(window.state.powerChallengePersonalBest);
  }},
  
  // When player's PB is better than Mystic's (player survived longer) - Mystic doesn't care
  { text: () => `Your Power Generator Challenge time of ${window.state.powerChallengePersonalBest || 0} seconds beats my ${(window.state.characterChallengePBs?.mystic || 0)} seconds. Good for you, I suppose.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.mystic);
  }},
  { text: () => `You got ${window.state.powerChallengePersonalBest || 0} seconds, I got ${(window.state.characterChallengePBs?.mystic || 0)} seconds. You win. Congratulations or whatever.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.mystic);
  }},
  { text: () => `${(parseFloat(window.state.powerChallengePersonalBest || 0) - parseFloat(window.state.characterChallengePBs?.mystic || 0)).toFixed(2)} seconds better than me in the Power Generator Challenge. Big whoop. My mushroom soup is still better.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.mystic);
  }},
  { text: () => `Your ${window.state.powerChallengePersonalBest || 0} seconds is way better than my ${(window.state.characterChallengePBs?.mystic || 0)} seconds. Neat. Now can we get back to what actually matters?`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.mystic);
  }},
  { text: () => `Power Generator Challenge: You ${window.state.powerChallengePersonalBest || 0} seconds, me ${(window.state.characterChallengePBs?.mystic || 0)} seconds. You're better. There, happy? Now leave me alone to cook.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.mystic);
  }},
  
  // When PBs are very close (within 3 seconds) - Mystic still doesn't care
  { text: () => `Power Generator Challenge: Your ${window.state.powerChallengePersonalBest || 0} seconds versus my ${(window.state.characterChallengePBs?.mystic || 0)} seconds. So close it's basically a tie. Whatever.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.mystic)) <= 3.0;
  }},
  { text: () => `Less than 3 seconds difference between our Power Generator Challenge times. Thrilling. Really. I'm on the edge of my seat here.`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.mystic)) <= 3.0;
  }},
  { text: () => `Our Power Generator Challenge times are practically identical. Cool story. Want to hear about my new recipe instead?`, condition: () => {
    return window.state.characterChallengePBs?.mystic && window.state.powerChallengePersonalBest && 
           Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.mystic)) <= 3.0;
  }},
  
  // General non-caring banter about the challenge
  { text: "The Power Generator Challenge? Yeah, I tried it once. Not as exciting as perfecting a new recipe.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "People keep talking about this Power Generator Challenge thing. I mean, sure, it exists. Moving on.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "The Power Generator Challenge is fine, I guess. But have you tried my glittering petals? Now THAT'S worth your time.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "Everyone's obsessed with Power Generator Challenge scores. I'm obsessed with making the perfect berry plate. Priorities, people.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "Power Generator Challenge survival times? Meh. Cooking survival times? Now we're talking about something important.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "I could probably get a better Power Generator Challenge time if I cared. But I don't. So there's that.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "The Power Generator Challenge is like burnt toast - it exists, it's not great, but people still talk about it for some reason.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  { text: "Power Generator Challenge times are temporary. Good cooking is eternal. Choose wisely.", condition: () => window.state.characterChallengePBs?.mystic || window.state.powerChallengePersonalBest },
  
  // Token Challenge specific quotes (only appear if player has done token challenge at least once) - Mystic is #1 best player
  { text: () => `You scored ${window.state.tokenChallengePersonalBest || 0} points in Lepre's Token Challenge? That's... decent, I guess. I got 100+ points without even trying. I'm just naturally talented from all the ingredients I sort every day.`, condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
  { text: () => `Token Challenge personal best of ${window.state.tokenChallengePersonalBest || 0}? Not bad. I'm still the undisputed champion though. Organizing tokens is like organizing spices, natural talent.`, condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
  { text: "I tried Lepre's Token Challenge once. Got the highest score ever. Organizing things is just part of being a chef. Whatever.", condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
  { text: () => `Your ${window.state.tokenChallengePersonalBest || 0} points in the Token Challenge isn't terrible. I mean, I'm still way better at it, but you're... trying.`, condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
  { text: "Everyone keeps asking how I'm so good at the Token Challenge. It's simple, precision, organization, and years of ingredient management.", condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
  { text: "The Token Challenge is basically just sorting ingredients, which I do all day anyway. No wonder I'm the best at it. Now can we talk about something important?", condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
];

const mysticIdleSpeeches = [
  { text: "Where's the seasoning? This dish is so bland, even Fluzzer wouldn't eat it!", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(6) },
  "Welcome to the kitchen Peachy.",
  "If you can't stand the heat, get out of my kitchen!",
  "Lets not overcook our ingredients, or else it will turn into a legendary artifact!",
  "My name's Mystic, so don't call me 'mythic'.",
  "The only sparks I want are from creativity, not from burning the petals!",
  "This is a kitchen, not a fun zone.",
  "If you drop another mushroom, you'll be on dish duty for a week!",
  "Prisma shards in the blender? Are you trying to poison someone!? ...Or is it for Vi?",
  "A real chef puts their heart into every dish!",
  "Inputting the code 'Give me 1 million swa bucks' won't get you anything good. Avoid it at all costs.",
  "If you waste food in my kitchen, you're doing the dishes!",
  "Don't waste the food I cook, that's ungreatfull.",
  "Only the best for my friends! Mediocrity isn't allowed here!",
  "I will never serve slop!",
  "Don't you dare insult the ingredients! Treat them with respect!",
  "A meal can bring people together, so make it unforgettable!",
  "No, I will not let you cook, I know you will burn the entire kitchen! But you're welcomed to stay.",
  "Bring me ingredients and I will deliver with greatness.",
  "You excpect me to cook using prisma shards? Are you insane?",
  "If you want a magic meal, bring me magic ingredients!",
  "Soap keeps trying to clean my pans. I need those stains for flavor!",
  "If Vi asks for a light salad, tell them I don't serve photons.",
  { text: "Lepre once tried to add fabric into the blender, are they trying to make me cook a sweater?", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(4) },
  { text: "Fluzzer keeps sneaking berries into my recipes. At least they're fresh.", condition: () => DecimalUtils.isDecimal(state.grade) && state.grade.gte(6) },
  "If you see a floating spoon, it's not haunted—it's just me multitasking.",
  "No, you can't have dessert until you finish your berry plate.",
  "If you want to help, start by not touching anything.",
  "I once made a dish so good, even 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 asked for seconds.",
  "If you can't pronounce the ingredient, you probably shouldn't eat it.",
  "A real chef never blames the oven. Unless it's actually the oven's fault.",
  "If you want to impress me, try not to spill anything for a whole day.",
  "I don't do fast food. I do fantastic food.",
  { text: "You should tell that swaria nestled on your head to help me chop vegetables!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "If Bijou ever gets hungry, tell them that everything I cook is free.", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "I offered Bijou a chef's hat, but the hat was too big for Bijou.", condition: () => window.premiumState && window.premiumState.bijouEnabled },
  { text: "Bijou's energy is impressive. Maybe I should add more sugar to my recipes to make them move more.", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "If I could bottle Bijou's speed, I'd have dinner ready in weeks!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  
  // Hexed Peachy concern dialogues - only appear when Peachy is hexed
  { text: "Peachy... what's that strange mark on you? Did you spill something purple?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Is it just me, or do you look... different? There's something odd about your appearance.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "That glow around you... is it a new fashion statement or did something happen?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "You've got this weird energy around you. Did you eat something bad? I swear it wasn't my cooking!", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "What happened to you? You look like you've been... I don't know, cursed or something?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "That mark on you looks magical. Did you accidentally touch something in the Halloween area?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "I'm not an expert on magic, but that doesn't look normal. Are you feeling okay?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Your appearance changed and I have no idea why. Should I be worried about you?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "That aura around you is making me uneasy. What did you get yourself into?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "I've seen magical ingredients before, but whatever's on you is beyond my expertise.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Did something happen when you visited the Halloween area? You look... affected.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "That mark doesn't look like food coloring. Seriously, what is that?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "I deal with ingredients, not curses. Whatever's on you, I can't cook it away.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Your energy feels different. Like something magical happened to you recently.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Is that some kind of spell mark? I have no idea how to help with that!", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "You've got this mystical thing going on now. It's... concerning, to be honest.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "I'm a chef, not a wizard. Whatever that mark is, it's out of my skill range.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "That purple shimmer around you isn't from any ingredient I know. What happened?", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Maybe you should find someone who knows about magic? This looks serious.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  { text: "Whatever that is, I hope it's temporary. You're starting to worry me, Peachy.", condition: () => window.state?.halloweenEvent?.jadeca?.peachyIsHexed },
  
  // Anomaly-related quotes (only appear after doing an infinity reset at least once)
  { text: "Strange... everyone's talking about anomalies everywhere, but my kitchen stays perfectly normal. Professional chef privilege!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomalies know better than to mess with a master chef's domain. Even cosmic chaos respects good cooking!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "What are you saying? You used the anomaly resolver on me and you're saying I'm 60% anomalous??? How fake!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I hear Tico's dealing with reality tears at the front desk, but here? Not a single dimensional hiccup in my kitchen!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "My kitchen is an anomaly-free sanctuary. The heat from my cooking keeps those dimensional disturbances away!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 warned about reality fluctuations, but clearly they didn't account for culinary expertise!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I think the anomalies are scared of my kitchen knives. Smart choice - these blades cut through more than just ingredients!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "While reality tears apart elsewhere, my kitchen remains a bastion of stability. That's the power of proper organization!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I've noticed the anomalies won't even peek through my kitchen window. Professional intimidation at its finest!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The cosmic forces bend to my will here. In this kitchen, I decide what's normal and what's not!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "Anomalies simply don't dare enter my kitchen!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The secret to keeping anomalies away? Maintain kitchen discipline! Even reality respects a well-run culinary operation!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I put up a 'Chef at Work' sign and somehow it doubles as anomaly repellent. Coincidence? I think not!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The dimensional chaos avoids my cooking schedule. Even cosmic disturbances know not to interrupt dinner prep!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I maintain such high culinary standards that even reality itself behaves properly in my kitchen!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomalies seem to respect territorial boundaries. This kitchen is MY domain, and they know it!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "My sheer chef's aura naturally repels dimensional instability. Years of kitchen experience have their perks!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "While others struggle with reality tears, I've created a pocket of normalcy through sheer culinary willpower!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomalies take one look at my organized spice rack and decide they don't belong here. Smart choice!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 }
].map(s => typeof s === 'string' ? { text: s, condition: () => true } : s);

// Halloween-specific dialogue for Mystic (only appears when Halloween mode is active)
const mysticHalloweenIdleSpeeches = [
  "This witch costume feels surprisingly natural on me. Maybe I was meant for this!",
  "I replaced the mixer with my cauldron for Halloween - the recipes taste more magical now!",
  "The pointed hat keeps getting in the way, but it's worth it for the authentic witch look!",
  "My cauldron bubbles so perfectly, even real witches would be jealous of my technique!",
  "Don't tell Jadeca I've borrowed their hat, and their cauldron.",
  "The witch costume makes me feel more mystical than usual... and that's saying something!",
  "I've been practicing my cackle while cooking. Listen: 'Hehehe!' Too scary or not scary enough?",
  "This cauldron is actually more efficient than the mixer. I might keep it after Halloween!",
  "The witch robes flow dramatically when I cook. Very professional, very spooky!",
  "I brewed a perfect potion earlier... I mean, mushroom soup. Definitely just soup.",
  "My broomstick keeps trying to help with the cooking, but it's better at sweeping!",
  "Everyone says I make a convincing witch, but I think they're just impressed by my cauldron skills!",
  "The spell book I got with this costume has some interesting 'recipes' in it...",
  "This witch hat gives me extra confidence while stirring my cauldron. Fashion is power!",
  "I love how the cauldron smoke adds atmosphere to my cooking - very Halloween kitchen vibes!"
];

const mysticHalloweenPokeSpeeches = [
  "Oi! Don't poke the Halloween chef! I might accidentally cast a cooking spell on you!",
  "Careful! You almost made me drop my special Halloween brew!",
  "Halloween rule #1: Don't disturb a chef working on spooky recipes!",
  "Stop poking or I'll serve you my 'trick' instead of 'treat' special!",
  "These Halloween cooking experiments require concentration! No poking!",
  "If you want Halloween treats, wait for me to finish cooking them properly!",
  "You're interrupting my Halloween culinary magic! Show some respect!",
  "One more poke and you'll be getting the burned Halloween leftovers!",
  "I'm channeling Halloween cooking spirits here! Don't break my concentration!",
  "The Halloween ingredients are watching - don't make me look unprofessional!",
  "Save the poking for the pumpkins, not the chef!"
];

const mysticPokeSpeeches = [
  "Oi! Hands off the chef!",
  "If you poke me again, I'll send you into the event horizon! If I had my staff with me...",
  "Careful! You almost made me drop the pan!",
  "Do you want to help, or just to cause trouble?",
  "My job is for cooking, not for poking!",
  "If you want to help, wash your hands first!",
  "You poke like Soap looking for Soap bars!",
  "The only thing you should poke is the food, not the chef!",
  "If you keep poking, I'll give you intentionally burned food!",
  "My name's not mythic you doofus! It's Mystic!",
  "Respect the chef's space, or you'll be on dish duty!"
];

function showMysticSpeech(type = 'idle', forceSpeech) {
  const speechBubble = document.getElementById('kitchenSpeechBubble');
  const mysticImg = document.getElementById('kitchenCharacterImg');
  if (!speechBubble || !mysticImg) return;
  if (speechBubble.style.display === 'block' && !forceSpeech) return;
  
  // Check if Halloween mode is active
  const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                           (window.premiumState && window.premiumState.halloweenEventActive) ||
                           document.body.classList.contains('halloween-cargo-active') ||
                           document.body.classList.contains('halloween-event-active');
  
  let pool;
  let speechText;
  
  // 15% chance for challenge speech (only for idle type)
  if (type === 'idle' && Math.random() < 0.15) {
    // Ensure character PBs exist
    if (typeof window.ensureCharacterPBsExist === 'function') {
      window.ensureCharacterPBsExist();
    }
    
    // Filter challenge speeches by their conditions
    const availableChallengeSpeeches = mysticChallengeQuotes.filter(speech => {
      return speech.condition ? speech.condition() : true;
    });
    
    if (availableChallengeSpeeches.length > 0) {
      const randomChallengeSpeech = availableChallengeSpeeches[Math.floor(Math.random() * availableChallengeSpeeches.length)];
      speechText = typeof randomChallengeSpeech.text === 'function' ? randomChallengeSpeech.text() : randomChallengeSpeech.text;
    }
  }
  
  // If no challenge speech was selected, use regular speech
  if (!speechText) {
    // If Halloween is active, 50% chance to use Halloween dialogue
    if (isHalloweenActive && Math.random() < 0.5) {
      pool = type === 'poke' ? mysticHalloweenPokeSpeeches : mysticHalloweenIdleSpeeches;
    } else {
      pool = type === 'poke' ? mysticPokeSpeeches : mysticIdleSpeeches;
    }
    
    // Filter speeches by their conditions (only for regular speeches that have conditions)
    const availableSpeeches = pool.filter(speech => {
      if (typeof speech === 'string') return true;
      return speech.condition ? speech.condition() : true;
    });
    
    if (availableSpeeches.length === 0) return;
    
    const randomSpeech = availableSpeeches[Math.floor(Math.random() * availableSpeeches.length)];
    speechText = typeof randomSpeech === 'string' ? randomSpeech : randomSpeech.text;
  }
  
  speechBubble.textContent = speechText;
  speechBubble.style.display = 'block';
  mysticImg.src = window.getHalloweenMysticImage ? window.getHalloweenMysticImage('speech') : 'assets/icons/chef mystic speech.png';
  if (window.mysticSpeechTimeout) clearTimeout(window.mysticSpeechTimeout);
  window.mysticSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    mysticImg.src = window.getHalloweenMysticImage ? window.getHalloweenMysticImage('normal') : 'assets/icons/chef mystic.png';
  }, 7000);
}

// Use single DOMContentLoaded listener with deduplication
if (!window.kitchenDOMListenerAttached) {
  window.kitchenDOMListenerAttached = true;
  window.addEventListener('DOMContentLoaded', function() {
    const mysticImg = document.getElementById('kitchenCharacterImg');
    if (mysticImg && !mysticImg.dataset.kitchenClickHandlerAttached) {
      mysticImg.dataset.kitchenClickHandlerAttached = 'true';
      mysticImg.style.cursor = 'pointer';
      mysticImg.onclick = function() {
        showMysticSpeech('poke', true);
      };
    }
  });
}
let mysticRandomSpeechTimer = null;

function startMysticRandomSpeechTimer() {
  if (mysticRandomSpeechTimer) clearTimeout(mysticRandomSpeechTimer);
  const randomDelay = Math.random() * 15000 + 15000; 
  mysticRandomSpeechTimer = setTimeout(() => {
    const kitchenTab = document.getElementById('kitchenSubTab');
    if (kitchenTab && kitchenTab.style.display !== 'none') {
      showMysticSpeech('idle', true);
    }
    startMysticRandomSpeechTimer();
  }, randomDelay);
}

function stopMysticRandomSpeechTimer() {
  if (mysticRandomSpeechTimer) {
    clearTimeout(mysticRandomSpeechTimer);
    mysticRandomSpeechTimer = null;
  }
}

(function ensureMysticRandomSpeechAlwaysWorks() {
  // Prevent duplicate intervals
  if (window.kitchenVisibilityInterval) {
    clearInterval(window.kitchenVisibilityInterval);
  }

  let lastKitchenVisible = false;

  function checkKitchenVisibility() {
    const kitchenTab = document.getElementById('kitchenSubTab');
    const visible = kitchenTab && kitchenTab.style.display !== 'none' && kitchenTab.offsetParent !== null;
    if (visible && !lastKitchenVisible) {
      showMysticSpeech('idle', true);
      startMysticRandomSpeechTimer();
      updateMysticNightState(); // Merged functionality from second interval
      updateMixingTitles(); // Update mixing titles when kitchen becomes visible
    } else if (!visible && lastKitchenVisible) {
      stopMysticRandomSpeechTimer();
    }
    lastKitchenVisible = visible;
  }

  window.kitchenVisibilityInterval = setInterval(checkKitchenVisibility, 1000); 
  
  // Use single DOMContentLoaded listener (already handled above)
  if (!window.kitchenVisibilityDOMListenerAttached) {
    window.kitchenVisibilityDOMListenerAttached = true;
    document.addEventListener('DOMContentLoaded', function() {
      checkKitchenVisibility();
      updateMixingTitles(); // Update titles on page load
    });
  }
})();
(function patchCafeteriaSubTabSwitcher() {

  function tryPatch() {
    const fn = window.switchCafeteriaSubTab || (typeof switchCafeteriaSubTab === 'function' && switchCafeteriaSubTab);
    if (!fn || fn._mysticPatched) {
      return;
    }
    const orig = fn;

    const patched = function(subTabId) {
      orig.apply(this, arguments);
      if (subTabId === 'kitchenSubTab') {
        setTimeout(() => {
          showMysticSpeech('idle');
          startMysticRandomSpeechTimer();
          updateMixingTitles(); // Update titles when switching to kitchen
        }, 400);
      } else {
        stopMysticRandomSpeechTimer();
      }
    };

    patched._mysticPatched = true;
    if (window.switchCafeteriaSubTab) {
      window.switchCafeteriaSubTab = patched;
    } else {
      window.switchCafeteriaSubTab = patched;
    }
  }
  tryPatch();
  
  // Use single DOMContentLoaded listener with deduplication
  if (!window.cafeteriaSubTabPatchDOMListenerAttached) {
    window.cafeteriaSubTabPatchDOMListenerAttached = true;
    document.addEventListener('DOMContentLoaded', tryPatch);
  }
})();
window.spawnIngredientToken = spawnIngredientToken;
window.completeCooking = completeCooking;
window.INGREDIENT_TYPE_IMAGES = INGREDIENT_TYPE_IMAGES;
window.showMysticSpeech = showMysticSpeech;
window.getLepreTokenBurstChance = getLepreTokenBurstChance;

function updateMysticNightState() {
  const mysticImg = document.getElementById('kitchenCharacterImg');
  const speechBubble = document.getElementById('kitchenSpeechBubble');
  const kitchenTab = document.getElementById('kitchenSubTab');
  if (!mysticImg || !kitchenTab) return;
  const isNight = window.daynight && typeof window.daynight.getTime === 'function' && 
    (() => {
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
    })();
  if (isNight) {
    mysticImg.style.display = 'none';
    if (speechBubble) speechBubble.style.display = 'none';
    stopMysticRandomSpeechTimer();
  } else {
    mysticImg.style.display = '';
    if (kitchenTab.style.display !== 'none') {
      startMysticRandomSpeechTimer();
    }
  }
}

// Function to update mixing/cauldron titles based on Halloween mode
function updateMixingTitles() {
  // Check if Halloween mode is active
  const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                           (window.premiumState && window.premiumState.halloweenEventActive) ||
                           document.body.classList.contains('halloween-cargo-active') ||
                           document.body.classList.contains('halloween-event-active');
  
  const mixingCardTitle = document.getElementById('mixingCardTitle');
  const mixModalTitle = document.querySelector('#mixModal .mix-modal-main h1, #mixModal .mix-modal-main h2:first-child');
  
  // Update mixing card title
  if (mixingCardTitle) {
    mixingCardTitle.textContent = isHalloweenActive ? 'The Cauldron' : 'Mixing';
  }
  
  // Update the description text in mixing card
  const mixingCardDescription = document.querySelector('#mixingCard p');
  if (mixingCardDescription) {
    mixingCardDescription.textContent = isHalloweenActive ? 'Brew your ingredients here!' : 'Combine your ingredients here!';
  }
  
  // Update button text
  const mixButton = document.getElementById('mixButton');
  if (mixButton) {
    mixButton.textContent = isHalloweenActive ? 'Brew Ingredients' : 'Mix Ingredients';
  }
  
  // Update cooking time label
  const cookingTimeLabel = document.getElementById('mixCookingTimeLabel');
  if (cookingTimeLabel) {
    cookingTimeLabel.textContent = isHalloweenActive ? 'Brewing time:' : 'Cooking time:';
  }
  
  // Update currently cooking/brewing label
  const currentlyCookingLabel = document.getElementById('currentlyCookingLabel');
  if (currentlyCookingLabel) {
    currentlyCookingLabel.textContent = isHalloweenActive ? 'Currently brewing' : 'Currently cooking';
  }
  
  // Update cooking speed label
  const cookingSpeedLabel = document.getElementById('cookingSpeedLabel');
  if (cookingSpeedLabel) {
    cookingSpeedLabel.textContent = isHalloweenActive ? 'brewing speed' : 'cooking speed';
  }
  
  // Apply Halloween styling to mix modal
  const mixModal = document.getElementById('mixModal');
  const mixModalMain = mixModal ? mixModal.querySelector('.mix-modal-main') : null;
  
  if (mixModalMain) {
    if (isHalloweenActive) {
      // Apply Halloween cauldron styling
      mixModalMain.style.background = 'linear-gradient(135deg, #2a1810, #4a2c20, #1a0f08)';
      mixModalMain.style.border = '3px solid #8b4513';
      mixModalMain.style.boxShadow = '0 8px 32px rgba(139, 69, 19, 0.4), inset 0 2px 8px rgba(255, 140, 0, 0.3)';
      mixModalMain.style.color = '#ffcc80';
      
      // Add cauldron-like glow effect
      const glowOverlay = mixModalMain.querySelector('.halloween-glow') || document.createElement('div');
      if (!mixModalMain.querySelector('.halloween-glow')) {
        glowOverlay.className = 'halloween-glow';
        glowOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 32px;
          background: radial-gradient(circle at center, rgba(255, 140, 0, 0.1) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        `;
        mixModalMain.appendChild(glowOverlay);
      }
      
      // Style the recipe title for Halloween
      const mixRecipeTitle = document.getElementById('mixRecipeTitle');
      if (mixRecipeTitle) {
        mixRecipeTitle.style.color = '#ffcc80';
        mixRecipeTitle.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
      }
      
      // Style cooking time label
      if (cookingTimeLabel) {
        cookingTimeLabel.style.color = '#ff8f00';
        cookingTimeLabel.style.fontWeight = 'bold';
      }
      
    } else {
      // Remove Halloween styling
      mixModalMain.style.background = '#fff';
      mixModalMain.style.border = '';
      mixModalMain.style.boxShadow = '0 8px 32px #000a';
      mixModalMain.style.color = '';
      
      // Remove glow overlay
      const glowOverlay = mixModalMain.querySelector('.halloween-glow');
      if (glowOverlay) {
        glowOverlay.remove();
      }
      
      // Reset recipe title styling
      const mixRecipeTitle = document.getElementById('mixRecipeTitle');
      if (mixRecipeTitle) {
        mixRecipeTitle.style.color = '';
        mixRecipeTitle.style.textShadow = '';
      }
      
      // Reset cooking time label
      if (cookingTimeLabel) {
        cookingTimeLabel.style.color = '';
        cookingTimeLabel.style.fontWeight = '';
      }
    }
  }
}

// Make the function globally accessible
window.updateMixingTitles = updateMixingTitles;

if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    updateMysticNightState();
  });
}

// Update mixing titles when page becomes visible
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    updateMixingTitles();
  }
});

// Update mixing titles when switching tabs
if (typeof window.switchPage === 'function' && !window._mixingTitlesSwitchPageOverridden) {
  const originalSwitchPage = window.switchPage;
  window.switchPage = function(pageId) {
    const result = originalSwitchPage.apply(this, arguments);
    updateMixingTitles();
    return result;
  };
  window._mixingTitlesSwitchPageOverridden = true;
}
// Remove duplicate kitchen visibility interval - functionality merged with first interval
// (The first interval now handles both speech management AND night state updates)

// Save/load functions removed - cooking state now managed by main save system
// Data is automatically saved/loaded through window.state

// Save on unload removed - cooking state now managed by main save system
window.addEventListener('load', function() {
  (function() {
    const mixModal = document.getElementById('mixModal');
    if (!mixModal) return;
    const mixCostBerries = document.getElementById('mixCostBerries');
    const mixCostWater = document.getElementById('mixCostWater');
    const mixCookTime = document.getElementById('mixCookTime');
    const mixBulkInput = document.getElementById('mixBulkInput');
    const mixModalActions = document.getElementById('mixModalActions');
    const mixModalProgress = document.getElementById('mixModalProgress');
    const mixModalProgressBar = document.getElementById('mixModalProgressBar');
    const mixModalTimer = document.getElementById('mixModalTimer');
    let currentRecipeIndex = 0;

    function getCurrentRecipe() {
      return recipes[currentRecipeIndex];
    }

    function goToPreviousRecipe() {
      currentRecipeIndex = (currentRecipeIndex - 1 + recipes.length) % recipes.length;
      updateMixModalUI();
    }

    function goToNextRecipe() {
      currentRecipeIndex = (currentRecipeIndex + 1) % recipes.length;
      updateMixModalUI();
    }

    window.kitchenCooking = window.kitchenCooking || {
      cooking: false,
      pausedForNight: false,
      pausedRemainingMs: 0,
      cookingEndTime: 0,
      cookingAmount: 0,
      cookingRecipeId: null,
      cookingInterval: null,
      cookingTimeout: null
    ,pausedForHidden: false
    ,pausedHiddenRemainingMs: 0
    };
    let cooking = window.kitchenCooking.cooking;
    let cookingEndTime = window.kitchenCooking.cookingEndTime;
    let cookingAmount = window.kitchenCooking.cookingAmount;
    let cookingRecipeId = window.kitchenCooking.cookingRecipeId;
    let cookingInterval = window.kitchenCooking.cookingInterval;
    let cookingTimeout = window.kitchenCooking.cookingTimeout;
    let pausedForNight = window.kitchenCooking.pausedForNight;
    let pausedRemainingMs = window.kitchenCooking.pausedRemainingMs;
    let pausedForHidden = window.kitchenCooking.pausedForHidden;
    let pausedHiddenRemainingMs = window.kitchenCooking.pausedHiddenRemainingMs;

    function updateGlobals() {
      window.kitchenCooking.cooking = cooking;
      window.kitchenCooking.pausedForNight = pausedForNight;
      window.kitchenCooking.pausedRemainingMs = pausedRemainingMs;
      window.kitchenCooking.cookingEndTime = cookingEndTime;
      window.kitchenCooking.cookingAmount = cookingAmount;
      window.kitchenCooking.cookingRecipeId = cookingRecipeId;
      window.kitchenCooking.cookingInterval = cookingInterval;
      window.kitchenCooking.cookingTimeout = cookingTimeout;
    window.kitchenCooking.pausedForHidden = pausedForHidden;
    window.kitchenCooking.pausedHiddenRemainingMs = pausedHiddenRemainingMs;
    }

    window.kitchenCooking.updateGlobals = updateGlobals;

    function isCookingInProgress() {
      return cooking;
    }

    function startCooking(bulkAmount, time, recipeId) {
      cooking = true;
      cookingAmount = bulkAmount;
      cookingRecipeId = recipeId; 
      
      // Apply cooking speed boost from mushroom soup
      let adjustedTime = time;
      if (window.state && window.state.mixingSystem && window.state.mixingSystem.cookingSpeedBoost && window.state.mixingSystem.cookingSpeedBoost.gt(1)) {
        adjustedTime = time / window.state.mixingSystem.cookingSpeedBoost.toNumber();
      }
      
      const totalMs = adjustedTime * 60 * 1000;
      cookingEndTime = Date.now() + totalMs;
      if (mixBulkInput) mixBulkInput.disabled = true;
      if (mixModalProgress) mixModalProgress.style.display = '';
      if (mixModalTimer) mixModalTimer.style.display = '';
      updateGlobals();
      saveCookingState(); 

      function updateProgress() {
        const updateNow = Date.now();
        if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
          return;
        }
        lastCookingProgressUpdate = updateNow;

        const now = Date.now();
        const elapsed = Math.max(0, totalMs - (cookingEndTime - now));
        const percent = Math.min(100, (elapsed / totalMs) * 100);
        if (mixModalProgressBar) mixModalProgressBar.style.width = percent + '%';
        if (mixModalTimer) {
          if (now < cookingEndTime) {
            const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
            const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
            mixModalTimer.textContent = `${getCookingTerminology('Cooking')} ${recipeName}... ${formatTimeRemaining(cookingEndTime - now)}`;
          } else {
            mixModalTimer.textContent = 'Done!';
          }
        }
        
        // Update cooking status in mixing card
        if (typeof updateCookingStatusDisplay === 'function') {
          updateCookingStatusDisplay();
        }
      }

      updateProgress();
      cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
      cookingTimeout = setTimeout(function() {
        clearInterval(cookingInterval);
        completeCooking(cookingRecipeId, cookingAmount);
        cooking = false;
        cookingRecipeId = null;
        updateGlobals();
        saveCookingState();
        clearCookingState();
        if (mixBulkInput) mixBulkInput.disabled = false;
        if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
        if (mixModalTimer) mixModalTimer.textContent = 'Done!';
        setTimeout(() => {
          if (mixModalProgress) mixModalProgress.style.display = 'none';
          if (mixModalTimer) mixModalTimer.style.display = 'none';
          updateMixModalUI();
        }, 1200);
      }, totalMs);
      updateGlobals();
        // Attach visibility event listeners for pausing/resuming (with proper deduplication)
        if (!window._kitchenVisibilityHandlerAttached) {
          window._kitchenVisibilityHandlerAttached = true;
          document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
              if (cooking && !pausedForNight && !pausedForHidden) {
                pausedForHidden = true;
                pausedHiddenRemainingMs = cookingEndTime - Date.now();
                clearInterval(cookingInterval);
                clearTimeout(cookingTimeout);
                updateGlobals();
                saveCookingState();
              }
            } else if (document.visibilityState === 'visible') {
              if (cooking && pausedForHidden) {
                pausedForHidden = false;
                cookingEndTime = Date.now() + pausedHiddenRemainingMs;
                updateGlobals();
                saveCookingState();
                // Resume timer
                function updateProgress() {
                  const updateNow = Date.now();
                  if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
                    return;
                  }
                  lastCookingProgressUpdate = updateNow;

                  const now = Date.now();
                  const elapsed = Math.max(0, (cookingEndTime - now));
                  const percent = 100 - Math.min(100, (elapsed / pausedHiddenRemainingMs) * 100);
                  if (mixModalProgressBar) mixModalProgressBar.style.width = percent + '%';
                  if (mixModalTimer) {
                    if (now < cookingEndTime) {
                      const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
                      const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
                      mixModalTimer.textContent = `${getCookingTerminology('Cooking')} ${recipeName}... ${formatTimeRemaining(cookingEndTime - now)}`;
                    } else {
                      mixModalTimer.textContent = 'Done!';
                    }
                  }
                }
                updateProgress();
                cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
                cookingTimeout = setTimeout(function() {
                  clearInterval(cookingInterval);
                  completeCooking(cookingRecipeId, cookingAmount);
                  cooking = false;
                  cookingRecipeId = null;
                  updateGlobals();
                  saveCookingState();
                  clearCookingState();
                  if (mixBulkInput) mixBulkInput.disabled = false;
                  if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
                  if (mixModalTimer) mixModalTimer.textContent = 'Done!';
                  setTimeout(() => {
                    if (mixModalProgress) mixModalProgress.style.display = 'none';
                    if (mixModalTimer) mixModalTimer.style.display = 'none';
                    updateMixModalUI();
                  }, 1200);
                }, pausedHiddenRemainingMs);
                updateGlobals();
              }
            }
          });
          window._kitchenVisibilityHandlerAttached = true;
        }
    }
    window.kitchenStartCooking = startCooking;

    function isNightTime() {
      if (!window.daynight || typeof window.daynight.getTime !== 'function') return false;
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
    }

    function pauseCookingForNight() {
      if (!cooking || pausedForNight) return;
      pausedForNight = true;
      pausedRemainingMs = cookingEndTime - Date.now();
      clearInterval(cookingInterval);
      clearTimeout(cookingTimeout);
      updateGlobals();
      saveCookingState();
      
      // Update cooking status display
      if (typeof updateCookingStatusDisplay === 'function') {
        updateCookingStatusDisplay();
      }
    }

    function resumeCookingFromNight() {
      if (!cooking || !pausedForNight) return;
      pausedForNight = false;
      cookingEndTime = Date.now() + pausedRemainingMs;
      updateGlobals();
      saveCookingState();

      function updateProgress() {
        const updateNow = Date.now();
        if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
          return;
        }
        lastCookingProgressUpdate = updateNow;

        const now = Date.now();
        const elapsed = Math.max(0, (cookingEndTime - now));
        const percent = 100 - Math.min(100, (elapsed / pausedRemainingMs) * 100);
        if (mixModalProgressBar) mixModalProgressBar.style.width = percent + '%';
        if (mixModalTimer) {
          if (now < cookingEndTime) {
            const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
            const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
            mixModalTimer.textContent = `${getCookingTerminology('Cooking')} ${recipeName}... ${formatTimeRemaining(cookingEndTime - now)}`;
          } else {
            mixModalTimer.textContent = 'Done!';
          }
        }
        
        // Update cooking status in mixing card
        if (typeof updateCookingStatusDisplay === 'function') {
          updateCookingStatusDisplay();
        }
      }

      updateProgress();
      cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
      cookingTimeout = setTimeout(function() {
        clearInterval(cookingInterval);
        completeCooking(cookingRecipeId, cookingAmount);
        cooking = false;
        cookingRecipeId = null;
        updateGlobals();
        saveCookingState();
        clearCookingState();
        if (mixBulkInput) mixBulkInput.disabled = false;
        if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
        if (mixModalTimer) mixModalTimer.textContent = 'Done!';
        setTimeout(() => {
          if (mixModalProgress) mixModalProgress.style.display = 'none';
          if (mixModalTimer) mixModalTimer.style.display = 'none';
          updateMixModalUI();
        }, 1200);
      }, pausedRemainingMs);
      updateGlobals();
      
      // Update cooking status display
      if (typeof updateCookingStatusDisplay === 'function') {
        updateCookingStatusDisplay();
      }
    }
    window.kitchenPauseCookingForNight = pauseCookingForNight;
    window.kitchenResumeCookingFromNight = resumeCookingFromNight;
      // Expose for visibility pause/resume
      window.kitchenPauseCookingForHidden = function() {
        if (!cooking || pausedForNight || pausedForHidden) return;
        pausedForHidden = true;
        pausedHiddenRemainingMs = cookingEndTime - Date.now();
        clearInterval(cookingInterval);
        clearTimeout(cookingTimeout);
        updateGlobals();
        saveCookingState();
        
        // Update cooking status display
        if (typeof updateCookingStatusDisplay === 'function') {
          updateCookingStatusDisplay();
        }
      };
      window.kitchenResumeCookingFromHidden = function() {
        if (!cooking || !pausedForHidden) return;
        pausedForHidden = false;
        cookingEndTime = Date.now() + pausedHiddenRemainingMs;
        updateGlobals();
        saveCookingState();
        function updateProgress() {
          const updateNow = Date.now();
          if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
            return;
          }
          lastCookingProgressUpdate = updateNow;

          const now = Date.now();
          const elapsed = Math.max(0, (cookingEndTime - now));
          const percent = 100 - Math.min(100, (elapsed / pausedHiddenRemainingMs) * 100);
          if (mixModalProgressBar) mixModalProgressBar.style.width = percent + '%';
          if (mixModalTimer) {
            if (now < cookingEndTime) {
              const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
              const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
              mixModalTimer.textContent = `${getCookingTerminology('Cooking')} ${recipeName}... ${formatTimeRemaining(cookingEndTime - now)}`;
            } else {
              mixModalTimer.textContent = 'Done!';
            }
          }
          
          // Update cooking status in mixing card
          if (typeof updateCookingStatusDisplay === 'function') {
            updateCookingStatusDisplay();
          }
        }
        updateProgress();
        cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
        cookingTimeout = setTimeout(function() {
          clearInterval(cookingInterval);
          completeCooking(cookingRecipeId, cookingAmount);
          if (typeof saveGame === 'function') saveGame();
          cooking = false;
          cookingRecipeId = null;
          updateGlobals();
          saveCookingState();
          clearCookingState();
          if (mixBulkInput) mixBulkInput.disabled = false;
          if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
          if (mixModalTimer) mixModalTimer.textContent = 'Done!';
          setTimeout(() => {
            if (mixModalProgress) mixModalProgress.style.display = 'none';
            if (mixModalTimer) mixModalTimer.style.display = 'none';
            updateMixModalUI();
          }, 1200);
        }, pausedHiddenRemainingMs);
        updateGlobals();
        
        // Update cooking status display
        if (typeof updateCookingStatusDisplay === 'function') {
          updateCookingStatusDisplay();
        }
      };
    // Save state handled by centralized save system
    // window.addEventListener('beforeunload', function() {
    //   saveCookingState();
    // });

    function clearCookingState() {
      if (window.state && window.state.kitchenCooking) {
        delete window.state.kitchenCooking;
      }
      
      // Update display after clearing state
      if (typeof updateCookingStatusDisplay === 'function') {
        updateCookingStatusDisplay();
      }
    }

    // Save cooking state to window.state for persistence
    function saveCookingState() {
      if (!window.state) window.state = {};
      if (!window.state.kitchenCooking) window.state.kitchenCooking = {};
      
      window.state.kitchenCooking = {
        cooking: cooking,
        pausedForNight: pausedForNight,
        pausedRemainingMs: pausedRemainingMs,
        cookingEndTime: cookingEndTime,
        cookingAmount: cookingAmount,
        cookingRecipeId: cookingRecipeId,
        pausedForHidden: pausedForHidden,
        pausedHiddenRemainingMs: pausedHiddenRemainingMs,
        savedAt: Date.now()
      };
    }

    // Load function removed - cooking state now managed by main save system

    function isNightTime() {
      if (!window.daynight || typeof window.daynight.getTime !== 'function') return false;
      const mins = window.daynight.getTime();
      return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
    }

    function updateMixModalUI() {
      const recipe = getCurrentRecipe();
      let bulkAmount = Math.max(1, parseInt(mixBulkInput.value) || 1);
      mixBulkInput.value = bulkAmount;
      const mixRecipeTitle = document.getElementById('mixRecipeTitle');
      const mixRecipeImage = document.getElementById('mixRecipeImage');
      const mixRecipeIngredients = document.getElementById('mixRecipeIngredients');
      const mixBulkUnit = document.getElementById('mixBulkUnit');
      const mixCookTime = document.getElementById('mixCookTime');
      if (mixRecipeTitle) mixRecipeTitle.textContent = recipe.name;
      if (mixRecipeImage) {
        mixRecipeImage.src = recipe.image;
        mixRecipeImage.alt = recipe.name;
      }
      if (mixBulkUnit) mixBulkUnit.textContent = recipe.unit;
      const costs = {};
      const totalCosts = {};
      for (const [ingredient, amount] of Object.entries(recipe.cost)) {
        let adjustedAmount = amount;
        
        // Apply Mystic's friendship buff for main ingredients (level 4+)
        if (window.friendship && window.friendship.Kitchen && window.friendship.Kitchen.level >= 4) {
          // Check if this is a main ingredient (costs 50)
          if (amount.eq && amount.eq(50)) {
            const reduction = (window.friendship.Kitchen.level - 3) * 2; // Level 4 = -2, Level 5 = -4, etc.
            adjustedAmount = amount.sub(reduction);
            // Ensure we don't go below 1
            if (adjustedAmount.lt(1)) {
              adjustedAmount = new Decimal(1);
            }

          }
        }
        
        costs[ingredient] = adjustedAmount;
        totalCosts[ingredient] = DecimalUtils.multiply(adjustedAmount, bulkAmount);
      }
      let time = DecimalUtils.multiply(recipe.timePer, bulkAmount);
      
      // Apply temporary Mystic cooking speed boost (if active)
      if (window.state && window.state.mysticCookingSpeedBoost && window.state.mysticCookingSpeedBoost > 0) {
        time = time.div(1.5); 
      }
      
      // Apply Mystic's friendship cooking speed buff (level 1+)
      if (window.friendship && window.friendship.Kitchen && window.friendship.Kitchen.level >= 1) {
        const speedBoostPercent = window.friendship.Kitchen.level * 2; // 2% per level
        const speedMultiplier = 1 + (speedBoostPercent / 100); // Convert to multiplier
        time = time.div(speedMultiplier);
      }
      
      // Apply mushroom soup cooking speed boost from mixing system
      if (window.state && window.state.mixingSystem && window.state.mixingSystem.cookingSpeedBoost) {
        // Ensure cookingSpeedBoost is a Decimal
        if (!DecimalUtils.isDecimal(window.state.mixingSystem.cookingSpeedBoost)) {
          window.state.mixingSystem.cookingSpeedBoost = new Decimal(window.state.mixingSystem.cookingSpeedBoost || 1);
        }
        
        if (window.state.mixingSystem.cookingSpeedBoost.gt(1)) {
          time = time.div(window.state.mixingSystem.cookingSpeedBoost);
        }
      }
      if (mixCookTime) mixCookTime.textContent = DecimalUtils.formatDecimal(time, 2);
      if (mixRecipeIngredients) {
        mixRecipeIngredients.innerHTML = '';
        for (const [ingredient, amount] of Object.entries(totalCosts)) {
          const div = document.createElement('div');
          const img = document.createElement('img');
          img.src = INGREDIENT_TYPE_IMAGES[ingredient] || 'assets/icons/flower.png';
          img.style.width = '28px';
          img.style.height = '28px';
          img.style.verticalAlign = 'middle';
          img.style.marginRight = '0.3em';
          div.appendChild(img);
          div.appendChild(document.createTextNode(`x ${formatNumber(amount)}`));
          mixRecipeIngredients.appendChild(div);
        }
      }
      const night = isNightTime();
      if (mixModalActions) {
        mixModalActions.innerHTML = '';
        const cookBtn = document.createElement('button');
        // Check availability from window.state.tokens
        let hasAllIngredients = true;
        for (const [ingredient, amount] of Object.entries(totalCosts)) {
          const available = (window.state && window.state.tokens && window.state.tokens[ingredient]) || new Decimal(0);
          if (DecimalUtils.isDecimal(available) ? available.lt(amount) : new Decimal(available).lt(amount)) {
            hasAllIngredients = false;
            break;
          }
        }
        if (night) {
          cookBtn.textContent = `${getCookingTerminology('Cooking')} unavailable at night`;
          cookBtn.classList.add('not-enough');
          cookBtn.disabled = true;
        } else if (cooking) {
          const now = Date.now();
          if (cookingEndTime && now >= cookingEndTime) {
            cookBtn.textContent = `Finish ${getCookingTerminology('Cooking')}`;
            cookBtn.classList.remove('not-enough');
            cookBtn.disabled = false;
            cookBtn.onclick = function() {
              completeCooking(cookingRecipeId, cookingAmount);
              cooking = false;
              cookingRecipeId = null;
              updateGlobals();
              saveCookingState();
              clearCookingState();
              if (mixBulkInput) mixBulkInput.disabled = false;
              if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
              if (mixModalTimer) mixModalTimer.textContent = 'Done!';
              setTimeout(() => {
                if (mixModalProgress) mixModalProgress.style.display = 'none';
                if (mixModalTimer) mixModalTimer.style.display = 'none';
                updateMixModalUI();
              }, 1200);
            };
          } else {
            const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
            const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
            cookBtn.textContent = `${getCookingTerminology('Cooking')} ${recipeName}...`;
            cookBtn.classList.add('not-enough');
            cookBtn.disabled = true;
          }
        } else {
          cookBtn.textContent = `${getCookingTerminology('Cook')} ${bulkAmount} ${recipe.unit}`;
          if (!hasAllIngredients) {
            cookBtn.classList.add('not-enough');
            cookBtn.disabled = true;
          }
          cookBtn.onclick = function() {
            if (night) return;
            if (cooking) return;
            if (!hasAllIngredients) return;
            // Deduct ingredients from window.state.tokens
            for (const [ingredient, amount] of Object.entries(totalCosts)) {
              if (!DecimalUtils.isDecimal(window.state.tokens[ingredient])) {
                window.state.tokens[ingredient] = new Decimal(0);
              }
              window.state.tokens[ingredient] = window.state.tokens[ingredient].sub(amount);
            }
            if (typeof updateKitchenUI === 'function') updateKitchenUI();
            startCooking(bulkAmount, time.toNumber(), recipe.id);
          };
        }
        mixModalActions.appendChild(cookBtn);
      }
      if (mixBulkInput) mixBulkInput.disabled = cooking || night;
      
      // Update cooking status section
      updateCookingStatusDisplay();
      
      // Update mixing titles for Halloween mode
      updateMixingTitles();
    }
    
    function updateCookingStatusDisplay() {
      const statusSection = document.getElementById('cookingStatusSection');
      if (!statusSection) return;
      
      try {
        if (cooking && cookingRecipeId && cookingAmount) {
          const recipe = recipes.find(r => r.id === cookingRecipeId);
          if (!recipe) {
            statusSection.style.display = 'none';
            return;
          }
          
          const recipeElement = document.getElementById('cookingStatusRecipe');
          const timeElement = document.getElementById('cookingStatusTimeText');
          
          if (recipeElement && timeElement) {
            // Update recipe info
            recipeElement.textContent = `${recipe.name} × ${cookingAmount}`;
            
            // Update time remaining with current state
            let timeText = '';
            if (pausedForNight) {
              timeText = 'Paused for night';
            } else if (pausedForHidden) {
              timeText = 'Resuming...';
            } else if (cookingEndTime) {
              const remaining = Math.max(0, cookingEndTime - Date.now());
              if (remaining > 0) {
                timeText = formatTimeRemaining(remaining);
              } else {
                timeText = 'Completing...';
              }
            } else {
              timeText = 'Starting...';
            }
            
            timeElement.textContent = timeText;
          }
          
          statusSection.style.display = '';
        } else {
          statusSection.style.display = 'none';
        }
      } catch (error) {
        console.error('Error updating cooking status display:', error);
        statusSection.style.display = 'none';
      }
    }
    
    function formatTimeRemaining(milliseconds) {
      const seconds = Math.ceil(milliseconds / 1000);
      if (seconds < 60) {
        return `${seconds}s`;
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
      } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
      }
    }

    function patchCookingButtonLiveUpdate() {
      if (!mixModalActions) return;
      setInterval(() => {
        const night = isNightTime();
        if (night) {
          const btn = mixModalActions.querySelector('button');
          if (btn) {
            btn.textContent = `${getCookingTerminology('Cooking')} unavailable at night`;
            btn.classList.add('not-enough');
            btn.disabled = true;
          }
          return;
        }
        if (!isCookingInProgress()) return;
        const now = Date.now();
        const btn = mixModalActions.querySelector('button');
        if (!btn) return;
        if (cookingEndTime && now >= cookingEndTime) {
          btn.textContent = `Finish ${getCookingTerminology('Cooking')}`;
          btn.classList.remove('not-enough');
          btn.disabled = false;
        } else {
          const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
          const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
          btn.textContent = `${getCookingTerminology('Cooking')} ${recipeName}...`;
          btn.classList.add('not-enough');
          btn.disabled = true;
        }
      }, 300);
    }

    patchCookingButtonLiveUpdate();
    if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
      window.daynight.onTimeChange(function() {
        if (isNightTime()) {
          pauseCookingForNight();
        } else {
          resumeCookingFromNight();
        }
        updateMixModalUI();
      });
    }
    // Function to initialize/restore cooking state
    function initializeCookingState() {
      const saved = window.state?.kitchenCooking || null;
      if (saved && saved.cookingAmount) {
        const now = Date.now();
        if (saved.pausedForNight) {
          cooking = true;
          pausedForNight = true;
          pausedRemainingMs = saved.pausedRemainingMs;
          cookingAmount = saved.cookingAmount;
          cookingRecipeId = saved.cookingRecipeId;
          cookingEndTime = now + pausedRemainingMs;
          updateGlobals();
          if (mixBulkInput) mixBulkInput.disabled = true;
          if (mixModalProgress) mixModalProgress.style.display = '';
          if (mixModalTimer) mixModalTimer.style.display = '';
          if (mixModalProgressBar) mixModalProgressBar.style.width = '0%';
          if (mixModalTimer) mixModalTimer.textContent = 'Paused for night';
        } else if (saved.cookingEndTime && now >= saved.cookingEndTime) {
          // Cooking was completed while the game was closed, give rewards
          completeCooking(saved.cookingRecipeId, saved.cookingAmount);
          clearCookingState();
          updateGlobals();
        } else if (saved.pausedForHidden) {
          cooking = true;
          pausedForHidden = true;
          pausedHiddenRemainingMs = saved.pausedHiddenRemainingMs;
          cookingAmount = saved.cookingAmount;
          cookingRecipeId = saved.cookingRecipeId;
          cookingEndTime = now + pausedHiddenRemainingMs;
          updateGlobals();
          if (mixBulkInput) mixBulkInput.disabled = true;
          if (mixModalProgress) mixModalProgress.style.display = '';
          if (mixModalTimer) mixModalTimer.style.display = '';
          if (mixModalProgressBar) mixModalProgressBar.style.width = '0%';
          if (mixModalTimer) mixModalTimer.textContent = 'Resuming...';
          // Resume cooking from hidden state
          if (typeof window.kitchenResumeCookingFromHidden === 'function') {
            window.kitchenResumeCookingFromHidden();
          }
        } else if (saved.cookingEndTime && saved.cookingAmount) {
          cooking = true;
          cookingAmount = saved.cookingAmount;
          cookingRecipeId = saved.cookingRecipeId;
          cookingEndTime = saved.cookingEndTime;
          updateGlobals();
          if (mixBulkInput) mixBulkInput.disabled = true;
          if (mixModalProgress) mixModalProgress.style.display = '';
          if (mixModalTimer) mixModalTimer.style.display = '';

          function updateProgress() {
            const updateNow = Date.now();
            if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
              return;
            }
            lastCookingProgressUpdate = updateNow;

            const now2 = Date.now();
            const remaining = Math.max(0, cookingEndTime - now2);
            if (mixModalProgressBar) {
              // Calculate progress based on remaining time
              const recipe = recipes.find(r => r.id === cookingRecipeId);
              if (recipe) {
                const totalDuration = DecimalUtils.toDecimal(recipe.timePer).mul(cookingAmount).mul(1000).toNumber();
                const elapsed = totalDuration - remaining;
                const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                mixModalProgressBar.style.width = percent + '%';
              }
            }
            if (mixModalTimer) {
              if (remaining > 0) {
                mixModalTimer.textContent = `Cooking... ${formatTimeRemaining(remaining)}`;
              } else {
                mixModalTimer.textContent = 'Done!';
              }
            }
            
            // Update cooking status display in mixing card
            updateCookingStatusDisplay();
          }

          updateProgress();
          cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
          
          const remaining = Math.max(0, cookingEndTime - now);
          if (remaining > 0) {
            cookingTimeout = setTimeout(function() {
              clearInterval(cookingInterval);
              completeCooking(cookingRecipeId, cookingAmount);
              cooking = false;
              cookingRecipeId = null;
              updateGlobals();
              saveCookingState();
              clearCookingState();
              if (mixBulkInput) mixBulkInput.disabled = false;
              if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
              if (mixModalTimer) mixModalTimer.textContent = 'Done!';
              updateCookingStatusDisplay();
              setTimeout(() => {
                if (mixModalProgress) mixModalProgress.style.display = 'none';
                if (mixModalTimer) mixModalTimer.style.display = 'none';
                updateMixModalUI();
              }, 1200);
            }, remaining);
          }
        }
        updateMixModalUI();
        if (mixModal && mixModal.style.display !== 'none') {
          updateMixModalUI();
        }
      }
      
      // Update cooking status display after restoration
      updateCookingStatusDisplay();
    }
    
    // Make initialization function globally accessible
    window.initializeCookingState = initializeCookingState;
    window.updateCookingStatusDisplay = updateCookingStatusDisplay;
    
    // Initialize on DOM load
    window.addEventListener('DOMContentLoaded', initializeCookingState);
    if (mixBulkInput) {
      mixBulkInput.addEventListener('input', updateMixModalUI);
      mixBulkInput.addEventListener('change', updateMixModalUI);
    }
    const leftArrow = document.getElementById('mixModalLeftArrow');
    const rightArrow = document.getElementById('mixModalRightArrow');
    if (leftArrow) {
      leftArrow.addEventListener('click', goToPreviousRecipe);
    }
    if (rightArrow) {
      rightArrow.addEventListener('click', goToNextRecipe);
    }
    if (mixModal) {

      const showHandler = function() {
        if (mixModal.style.display !== 'none') {
          const saved = null; // Cooking state now managed by main save system
          if (saved && saved.amount && saved.endTime && Date.now() < saved.endTime) {
            cooking = true;
            cookingAmount = saved.amount;
            cookingRecipeId = saved.recipeId;
            cookingEndTime = saved.endTime;
            pausedForNight = !!saved.pausedForNight;
            pausedRemainingMs = saved.pausedRemainingMs || 0;
            updateGlobals();
            if (mixBulkInput) mixBulkInput.disabled = true;
            if (mixModalProgress) mixModalProgress.style.display = '';
            if (mixModalTimer) mixModalTimer.style.display = '';
            const totalMs = saved.endTime - (saved.startTime || (Date.now() - saved.duration));

            function updateProgress() {
              const updateNow = Date.now();
              if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
                return;
              }
              lastCookingProgressUpdate = updateNow;

              const now2 = Date.now();
              const elapsed = Math.max(0, saved.endTime - now2);
              const percent = 100 - Math.min(100, (elapsed / totalMs) * 100);
              if (mixModalProgressBar) mixModalProgressBar.style.width = percent + '%';
              if (mixModalTimer) {
                if (now2 < saved.endTime) {
                  const cookingRecipe = recipes.find(r => r.id === saved.recipeId);
                  const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
                  mixModalTimer.textContent = `${getCookingTerminology('Cooking')} ${recipeName}... ${formatTimeRemaining(saved.endTime - now2)}`;
                } else {
                  mixModalTimer.textContent = 'Done!';
                }
              }
            }

            updateProgress();
            if (cookingInterval) clearInterval(cookingInterval);
            if (cookingTimeout) clearTimeout(cookingTimeout);
            cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
            cookingTimeout = setTimeout(function() {
              clearInterval(cookingInterval);
              completeCooking(cookingRecipeId, cookingAmount);
              cooking = false;
              cookingRecipeId = null;
              updateGlobals();
              saveCookingState();
              clearCookingState();
              if (mixBulkInput) mixBulkInput.disabled = false;
              if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
              if (mixModalTimer) mixModalTimer.textContent = 'Done!';
              setTimeout(() => {
                if (mixModalProgress) mixModalProgress.style.display = 'none';
                if (mixModalTimer) mixModalTimer.style.display = 'none';
                updateMixModalUI();
              }, 1200);
            }, saved.endTime - Date.now());
            updateGlobals();
          }
        }
      };
      const modalObserver = new MutationObserver(() => {
        if (mixModal.style.display !== 'none') {
          showHandler();
        }
      });
      modalObserver.observe(mixModal, { attributes: true, attributeFilter: ['style'] });
      document.addEventListener('DOMContentLoaded', showHandler);
    }
  })();
  
  // Initialize kitchen UI and cooking speed boost display on page load
  setTimeout(() => {
    if (typeof updateKitchenUI === 'function') {
      updateKitchenUI(true); // Force update to refresh all ingredient counts
    }
    if (typeof updateCookingSpeedBoostDisplay === 'function') {
      updateCookingSpeedBoostDisplay();
    }
    // Update mixing titles for Halloween mode on page load
    updateMixingTitles();
    // Ensure cooking state is restored (fallback)
    if (typeof window.initializeCookingState === 'function') {
      window.initializeCookingState();
    }
  }, 100);
  
  // Backup initialization to catch any timing issues
  setTimeout(() => {
    if (typeof updateKitchenUI === 'function') {
      updateKitchenUI(true); // Second attempt to ensure ingredient counts are loaded
    }
  }, 500);
});

// Additional DOMContentLoaded listener specifically for kitchen ingredient loading
document.addEventListener('DOMContentLoaded', function() {
  // Wait a moment for state to be fully loaded, then update kitchen UI
  setTimeout(() => {
    if (typeof updateKitchenUI === 'function') {
      updateKitchenUI(true);
    }
  }, 200);
});
(function() {
  let cooking = false;
  let pausedForNight = false;
  let pausedRemainingMs = 0;
  let cookingEndTime = 0;
  let cookingAmount = 0;
  let cookingInterval = null;
  let cookingTimeout = null;

  // Load/clear functions removed - cooking state now managed by main save system

  function isNightTime() {
    if (!window.daynight || typeof window.daynight.getTime !== 'function') return false;
    const mins = window.daynight.getTime();
    return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
  }

  // Duplicate DOMContentLoaded handler removed - cooking state handled by main system above
})();

// Debug function to test Lepre token burst
window.testLepreTokenBurst = function() {

  // Check current friendship level
  const lepreLevel = window.friendship?.Boutique?.level || 0;
  const burstChance = getLepreTokenBurstChance();


  if (lepreLevel < 4) {


    return;
  }
  
  // Test burst probability by simulating 100 spawns
  let burstCount = 0;
  for (let i = 0; i < 100; i++) {
    if (Math.random() * 100 < burstChance) {
      burstCount++;
    }
  }


  // Show burst chance progression

  for (let level = 4; level <= 15; level++) {
    const chance = 10 + (2 * Math.max(0, level - 4));

  }
  
  // Test actual token spawn (if in kitchen area)





  return {
    lepreLevel,
    burstChance,
    simulatedBursts: burstCount
  };
};

// Debug function to force a token burst for testing
window.forceTokenBurst = function() {

  // Find a suitable source element for spawning
  const cargoSection = document.querySelector('#pages') || document.body;
  const rect = cargoSection.getBoundingClientRect();
  
  // Create a mock source element at the center of the screen
  const mockSource = {
    getBoundingClientRect: () => ({
      left: rect.width / 2,
      top: rect.height / 2,
      width: 50,
      height: 50
    })
  };

  // Show burst notification
  showTokenBurstNotification(mockSource);
  
  // Spawn tokens with slight delays for visual effect
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      spawnSingleIngredientToken('cargo', mockSource, i > 0);
    }, i * 100);
  }

};

// Debug function to test Mystic's friendship buff for recipe costs
window.testMysticRecipeBuff = function(friendshipLevel = 4) {

  // Set Mystic's friendship level
  if (!window.friendship) {

    window.friendship = {
      Kitchen: { level: 0, points: new Decimal(0) }
    };
  }
  if (!window.friendship.Kitchen) {
    window.friendship.Kitchen = { level: 0, points: new Decimal(0) };
  }
  
  window.friendship.Kitchen.level = friendshipLevel;

  // Calculate expected reduction
  const expectedReduction = Math.max(0, (friendshipLevel - 3) * 2);


  // Analyze each recipe
  window.recipes.forEach(recipe => {

    Object.entries(recipe.cost).forEach(([ingredient, amount]) => {
      let adjustedAmount = amount;
      let wasMainIngredient = false;
      
      // Apply the same logic as in the actual code
      if (window.friendship && window.friendship.Kitchen && window.friendship.Kitchen.level >= 4) {
        if (amount.eq && amount.eq(50)) {
          wasMainIngredient = true;
          const reduction = (window.friendship.Kitchen.level - 3) * 2;
          adjustedAmount = amount.sub(reduction);
          if (adjustedAmount.lt(1)) {
            adjustedAmount = new Decimal(1);
          }
        }
      }
      
      const status = wasMainIngredient ? '🔥' : '🔹';
      const changeText = wasMainIngredient ? ` → ${adjustedAmount.toString()}` : '';

    });
  });




  return {
    friendshipLevel,
    expectedReduction,
    recipes: window.recipes.map(recipe => ({
      name: recipe.name,
      originalCosts: recipe.cost,
      hasMainIngredient: Object.values(recipe.cost).some(amount => amount.eq && amount.eq(50))
    }))
  };
};

// Debug function to test multiple friendship levels
window.testAllMysticRecipeBuffs = function() {

  const testLevels = [1, 3, 4, 5, 6, 8, 10, 15];
  const results = [];
  
  testLevels.forEach(level => {

    const result = window.testMysticRecipeBuff(level);
    results.push(result);
  });

  results.forEach(result => {
    const hasReduction = result.expectedReduction > 0;
    const status = hasReduction ? '✅' : '⭕';

  });
  
  return results;
};

// Debug function to show current recipe costs with friendship buff applied
window.showCurrentRecipeCosts = function() {

  const mysticLevel = window.friendship?.Kitchen?.level || 0;
  const reduction = Math.max(0, (mysticLevel - 3) * 2);


  window.recipes.forEach(recipe => {

    Object.entries(recipe.cost).forEach(([ingredient, amount]) => {
      let finalAmount = amount;
      let isMainIngredient = false;
      
      if (mysticLevel >= 4 && amount.eq && amount.eq(50)) {
        isMainIngredient = true;
        finalAmount = amount.sub(reduction);
        if (finalAmount.lt(1)) {
          finalAmount = new Decimal(1);
        }
      }
      
      const prefix = isMainIngredient ? '🔥' : '  ';
      const suffix = isMainIngredient ? ` (reduced from ${amount.toString()})` : '';

    });
    
    // Empty line for spacing
  });
};

// Debug function to force update a recipe modal to see the buff in action
window.testMysticBuffInModal = function(recipeId = 'mushroomSoup', friendshipLevel = 5) {

  // Set friendship level
  if (!window.friendship) window.friendship = {};
  if (!window.friendship.Kitchen) window.friendship.Kitchen = { level: 0, points: new Decimal(0) };
  window.friendship.Kitchen.level = friendshipLevel;
  
  // Find the recipe
  const recipe = window.recipes.find(r => r.id === recipeId);
  if (!recipe) {

    return;
  }


  // Calculate what the costs should be with the buff
  const expectedReduction = Math.max(0, (friendshipLevel - 3) * 2);

  // Show expected costs

  Object.entries(recipe.cost).forEach(([ingredient, amount]) => {
    let expectedAmount = amount;
    if (friendshipLevel >= 4 && amount.eq && amount.eq(50)) {
      expectedAmount = amount.sub(expectedReduction);
      if (expectedAmount.lt(1)) expectedAmount = new Decimal(1);

    } else {

    }
  });




  return {
    recipeId,
    recipeName: recipe.name,
    friendshipLevel,
    expectedReduction,
    originalCosts: recipe.cost
  };
};

// Debug function to test Mystic's cooking speed friendship buff
window.testMysticCookingSpeed = function(friendshipLevel = 3) {

  // Set Mystic's friendship level
  if (!window.friendship) {

    if (typeof window.initFriendshipFunctions === 'function') {
      window.initFriendshipFunctions();
    }
  }
  
  if (!window.friendship.Kitchen) {
    window.friendship.Kitchen = { level: 0, points: new Decimal(0) };
  }
  
  window.friendship.Kitchen.level = friendshipLevel;

  // Calculate expected speed boost
  if (friendshipLevel >= 1) {
    const speedBoostPercent = friendshipLevel * 2;
    const speedMultiplier = 1 + (speedBoostPercent / 100);
    const originalTime = 5; // All recipes take 5 minutes base time
    const newTime = originalTime / speedMultiplier;





    // Test formatting with DecimalUtils
    const timeDecimal = new Decimal(newTime);
    const formattedTime = DecimalUtils.formatDecimal(timeDecimal, 2);

  } else {

  }





  return {
    friendshipLevel,
    speedBoostPercent: friendshipLevel >= 1 ? friendshipLevel * 2 : 0,
    expectedCookingTime: friendshipLevel >= 1 ? 5 / (1 + (friendshipLevel * 2 / 100)) : 5
  };
};

// Debug function to test cooking time formatting
window.testCookingTimeFormatting = function() {

  // Test various time values
  const testTimes = [5, 3.8461538461538461, 2.5, 1.23456789, 0.666666666];

  testTimes.forEach(time => {
    const timeDecimal = new Decimal(time);
    const formatted = DecimalUtils.formatDecimal(timeDecimal, 2);

  });

  return testTimes.map(time => ({
    original: time,
    formatted: DecimalUtils.formatDecimal(new Decimal(time), 2)
  }));
};

function awardMysticFriendshipForIngredientCollection() {
  if (!window.friendship || typeof window.friendship.addPoints !== 'function') {
    return;
  }

  const currentFriendship = window.friendship.getFriendshipLevel('mystic');
  if (!currentFriendship || !DecimalUtils.isDecimal(currentFriendship.points)) {
    return;
  }

  const friendshipIncrease = currentFriendship.points.mul(0.05);
  const minIncrease = new Decimal(1);
  const finalIncrease = Decimal.max(friendshipIncrease, minIncrease);

  window.friendship.addPoints('mystic', finalIncrease);
}

window.awardMysticFriendshipForIngredientCollection = awardMysticFriendshipForIngredientCollection;

// Halloween Event Candy Token Unlock System
function checkCandyTokenUnlock() {
  // Initialize state if needed
  if (!window.state) window.state = {};
  if (!window.state.unlockedFeatures) window.state.unlockedFeatures = {};
  
  // Auto-initialize Halloween event state if it doesn't exist
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {
      candyTokensGiven: new Decimal(0)
    };
  }
  if (!window.state.halloweenEvent.candyTokensGiven) {
    window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  }
  
  // Check if Halloween event is already permanently unlocked
  if (window.state.unlockedFeatures.halloweenEvent) {
    return true;
  }
  
  // Get current candy tokens given (not total candy tokens owned)
  const candyTokensGiven = DecimalUtils.toDecimal(window.state.halloweenEvent.candyTokensGiven);
  
  // Check if player has given 10 or more candy tokens to the Halloween event button
  if (candyTokensGiven.gte(10)) {
    // Permanently unlock Halloween event
    window.state.unlockedFeatures.halloweenEvent = true;
    
    // Show unlock notification
    if (typeof window.showNotification === 'function') {
      window.showNotification('🍬 Halloween Event Unlocked! You can now access the Halloween Event tab!', 'success');
    }
    
    // Initialize Halloween event state if not already present
    if (!window.state.halloweenEventActive) {
      window.state.halloweenEventActive = false;
    }
    
    // Update Halloween event button visibility
    updateHalloweenEventButtonDisplay();
    
    // Refresh settings UI to show the new toggle if available
    if (typeof window.addHalloweenEventToggleButton === 'function') {
      setTimeout(() => {
        window.addHalloweenEventToggleButton();
      }, 100);
    }
    
    return true;
  }
  
  return false;
}

function updateHalloweenEventButtonDisplay() {
  const worldMapButton = document.querySelector('.world-map-btn');
  if (!worldMapButton) return;
  
  // World Map button is always visible - no longer requires Halloween mode
  worldMapButton.style.display = 'block';
  worldMapButton.innerHTML = `
    <span style="font-size:1.5em;margin-right:0.5em;"></span>
    <span>World Map</span>
  `;
  // Don't override onclick - let HTML handle navigation
  worldMapButton.style.cursor = 'pointer';
  worldMapButton.style.opacity = '1';
  
  // Update Halloween shop button visibility
  if (window.boutique && typeof window.boutique.updateHalloweenShopButtonVisibility === 'function') {
    window.boutique.updateHalloweenShopButtonVisibility();
  }
}

// Function to set up drag and drop for the Halloween event button (deprecated - now handled in world map modal)
function setupHalloweenButtonDragAndDrop(button) {
  // This function is kept for backwards compatibility but is no longer used
}

// Make functions globally accessible
window.checkCandyTokenUnlock = checkCandyTokenUnlock;
window.updateHalloweenEventButtonDisplay = updateHalloweenEventButtonDisplay;
window.setupHalloweenButtonDragAndDrop = setupHalloweenButtonDragAndDrop;

// Initialize Halloween event button display on page load
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure all other systems are loaded
  setTimeout(function() {
    if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
      window.updateHalloweenEventButtonDisplay();
    }
  }, 500);
});

// Also update button display when the page becomes visible
document.addEventListener('visibilitychange', function() {
  if (!document.hidden && typeof window.updateHalloweenEventButtonDisplay === 'function') {
    setTimeout(function() {
      window.updateHalloweenEventButtonDisplay();
    }, 100);
  }
});