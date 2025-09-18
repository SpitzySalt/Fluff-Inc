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
  { name: 'sparks', display: 'Sparks' },
  { name: 'berries', display: 'Berries' },
  { name: 'petals', display: 'Petals' },
  { name: 'water', display: 'Water' }, 
  { name: 'prisma', display: 'Prisma Shard' },
  { name: 'stardust', display: 'Stardust' }, 
  { name: 'swabucks', display: 'Swa bucks' } 
];
const INGREDIENT_TYPE_IMAGES = {
  mushroom: 'assets/icons/mushroom token.png',
  sparks: 'assets/icons/spark token.png',
  berries: 'assets/icons/berry token.png',
  petals: 'assets/icons/petal token.png',
  water: 'assets/icons/water token.png', 
  prisma: 'assets/icons/prisma token.png',
  stardust: 'assets/icons/stardust token.png',
  swabucks: 'assets/icons/Swa Buck.png'
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
  prism: 0
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
  let chance = (context === 'generator') ? 1/1000 : (context === 'prism') ? 1/30 :(context === 'terrarium') ? 1/1 : 1/75;
  if (Math.random() > chance) {
    return;
  }
  if (typeof window.currentGrade !== 'undefined' && window.currentGrade < 3) {
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
  const type = getRandomIngredientType(context);
  const token = document.createElement('img');
  token.src = INGREDIENT_TYPE_IMAGES[type] || 'assets/icons/flower.png';
  token.className = 'ingredient-token';
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
  // Clean up token from active tokens array
  if (window.activeIngredientTokens) {
    const index = window.activeIngredientTokens.findIndex(item => item.token === token);
    if (index !== -1) {
      clearTimeout(window.activeIngredientTokens[index].fadeTimeout);
      window.activeIngredientTokens.splice(index, 1);
    }
  }

  token.style.transform += ' scale(0.2)';
  token.style.opacity = '0';
  setTimeout(() => token.remove(), 400);
  if (!window.kitchenIngredients) window.kitchenIngredients = {};

  // Calculate token gain amount with green stable light buff
  let tokenGainAmount = new Decimal(1);
  if (typeof window.applyGreenStableLightBuff === 'function') {
    tokenGainAmount = window.applyGreenStableLightBuff(tokenGainAmount);
  }
  
  if (type === 'swabucks') {
    if (!window.state) window.state = {};
    if (!DecimalUtils.isDecimal(window.state.swabucks)) window.state.swabucks = new Decimal(0);
    window.state.swabucks = window.state.swabucks.add(tokenGainAmount);

    // Track token collection for front desk automator unlock progress
    if (window.frontDesk && typeof window.frontDesk.onTokenCollected === 'function') {
      window.frontDesk.onTokenCollected();
    }
    
    if (typeof saveGame === 'function') saveGame();
    if (typeof window.updateInventoryModal === 'function') window.updateInventoryModal(true); // Force update after token collection
    return;
  }
  if (!DecimalUtils.isDecimal(window.kitchenIngredients[type])) {
    window.kitchenIngredients[type] = new Decimal(0);

  }
  window.kitchenIngredients[type] = window.kitchenIngredients[type].add(tokenGainAmount);

  showIngredientGainPopup(token, tokenGainAmount);
  
  // Track token collection for front desk automator unlock progress
  if (window.frontDesk && typeof window.frontDesk.onTokenCollected === 'function') {
    window.frontDesk.onTokenCollected();
  }
  
  if (typeof updateKitchenUI === 'function') updateKitchenUI(true);
  if (typeof saveGame === 'function') saveGame();
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

function updateKitchenUI(forceUpdate = false) {
  const now = Date.now();
  if (!forceUpdate && (now - lastKitchenUIUpdate) < KITCHEN_UI_UPDATE_THROTTLE) {
    return;
  }
  lastKitchenUIUpdate = now;

  if (!window.kitchenIngredients) window.kitchenIngredients = {};
  const types = ['berries', 'mushroom', 'sparks', 'petals', 'water', 'prisma', 'stardust', 'swabucks'];
  types.forEach(type => {
    if (!DecimalUtils.isDecimal(window.kitchenIngredients[type])) {
      window.kitchenIngredients[type] = new Decimal(0);
    }
    const el = document.getElementById('ingredientCount-' + type);
    if (el) {
      el.textContent = formatNumber(window.kitchenIngredients[type]);
    }
  });
}

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
  "I once made a dish so good, even the Swa elites asked for seconds.",
  "If you can't pronounce the ingredient, you probably shouldn't eat it.",
  "A real chef never blames the oven. Unless it's actually the oven's fault.",
  "If you want to impress me, try not to spill anything for a whole day.",
  "I don't do fast food. I do fantastic food.",
  { text: "You should tell that swaria nestled on your head to help me chop vegetables!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "If Bijou ever gets hungry, tell them that everything I cook is free.", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "I offered Bijou a chef's hat, but the hat was too big for Bijou.", condition: () => window.premiumState && window.premiumState.bijouEnabled },
  { text: "Bijou's energy is impressive. Maybe I should add more sugar to my recipes to make them move more.", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  { text: "If I could bottle Bijou's speed, I'd have dinner ready in weeks!", condition: () => window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled },
  
  // Anomaly-related quotes (only appear after doing an infinity reset at least once)
  { text: "Strange... everyone's talking about anomalies everywhere, but my kitchen stays perfectly normal. Professional chef privilege!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The anomalies know better than to mess with a master chef's domain. Even cosmic chaos respects good cooking!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "What are you saying? You used the anomaly resolver on me and you're saying I'm 60% anomalous??? How fake!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "I hear Tico's dealing with reality tears at the front desk, but here? Not a single dimensional hiccup in my kitchen!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "My kitchen is an anomaly-free sanctuary. The heat from my cooking keeps those dimensional disturbances away!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
  { text: "The Swa elites warned about reality fluctuations, but clearly they didn't account for culinary expertise!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
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
  let pool = type === 'poke' ? mysticPokeSpeeches : mysticIdleSpeeches;
  
  // Filter speeches by their conditions
  const availableSpeeches = pool.filter(speech => {
    if (typeof speech === 'string') return true;
    return speech.condition ? speech.condition() : true;
  });
  
  if (availableSpeeches.length === 0) return;
  
  const randomSpeech = availableSpeeches[Math.floor(Math.random() * availableSpeeches.length)];
  const speechText = typeof randomSpeech === 'string' ? randomSpeech : randomSpeech.text;
  
  speechBubble.textContent = speechText;
  speechBubble.style.display = 'block';
  mysticImg.src = 'assets/icons/chef mystic speech.png';
  if (window.mysticSpeechTimeout) clearTimeout(window.mysticSpeechTimeout);
  window.mysticSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    mysticImg.src = 'assets/icons/chef mystic.png';
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
    } else if (!visible && lastKitchenVisible) {
      stopMysticRandomSpeechTimer();
    }
    lastKitchenVisible = visible;
  }

  window.kitchenVisibilityInterval = setInterval(checkKitchenVisibility, 1000); 
  
  // Use single DOMContentLoaded listener (already handled above)
  if (!window.kitchenVisibilityDOMListenerAttached) {
    window.kitchenVisibilityDOMListenerAttached = true;
    document.addEventListener('DOMContentLoaded', checkKitchenVisibility);
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

if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
  window.daynight.onTimeChange(function(mins) {
    updateMysticNightState();
  });
}
// Remove duplicate kitchen visibility interval - functionality merged with first interval
// (The first interval now handles both speech management AND night state updates)

function saveCookingState() {
  if (!window.kitchenCooking || (!window.kitchenCooking.cooking && !window.kitchenCooking.pausedForNight)) return;
  localStorage.setItem('berryCookingState', JSON.stringify({
    endTime: window.kitchenCooking.cookingEndTime,
    amount: window.kitchenCooking.cookingAmount,
    recipeId: window.kitchenCooking.cookingRecipeId,
    startTime: Date.now(),
    duration: window.kitchenCooking.cookingEndTime ? (window.kitchenCooking.cookingEndTime - Date.now()) : 0,
    pausedForNight: window.kitchenCooking.pausedForNight,
    pausedRemainingMs: window.kitchenCooking.pausedRemainingMs
  }));
}

function clearCookingState() {
  localStorage.removeItem('berryCookingState');
}

function loadCookingState() {
  const data = localStorage.getItem('berryCookingState');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) { return null; }
}

window.addEventListener('beforeunload', function() {
  saveCookingState();
});
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
      const totalMs = time * 60 * 1000;
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
            mixModalTimer.textContent = `Cooking ${recipeName}... ${Math.ceil((cookingEndTime - now)/1000)}s left`;
          } else {
            mixModalTimer.textContent = 'Done!';
          }
        }
      }

      updateProgress();
      cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
      cookingTimeout = setTimeout(function() {
        clearInterval(cookingInterval);
        const recipe = recipes.find(r => r.id === cookingRecipeId);
        if (recipe) {
          if (!window.state) window.state = {};
          if (!DecimalUtils.isDecimal(window.state[recipe.rewardProperty])) {
            window.state[recipe.rewardProperty] = new Decimal(0);
          }
          window.state[recipe.rewardProperty] = window.state[recipe.rewardProperty].add(cookingAmount);
          if (typeof trackHardModeIngredientsCooked === 'function') {
            trackHardModeIngredientsCooked();
          }
          if (typeof window.trackFoodAchievement === 'function') {
            window.trackFoodAchievement();
          }
        }
        if (typeof saveGame === 'function') saveGame();
        if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
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
                      mixModalTimer.textContent = `Cooking ${recipeName}... ${Math.ceil((cookingEndTime - now)/1000)}s left`;
                    } else {
                      mixModalTimer.textContent = 'Done!';
                    }
                  }
                }
                updateProgress();
                cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
                cookingTimeout = setTimeout(function() {
                  clearInterval(cookingInterval);
                  const recipe = recipes.find(r => r.id === cookingRecipeId);
                  if (recipe) {
                    if (!window.state) window.state = {};
                    if (!DecimalUtils.isDecimal(window.state[recipe.rewardProperty])) {
                      window.state[recipe.rewardProperty] = new Decimal(0);
                    }
                    window.state[recipe.rewardProperty] = window.state[recipe.rewardProperty].add(cookingAmount);
                    if (typeof trackHardModeIngredientsCooked === 'function') {
                      trackHardModeIngredientsCooked();
                    }
                    if (typeof window.trackFoodAchievement === 'function') {
                      window.trackFoodAchievement();
                    }
                  }
                  if (typeof saveGame === 'function') saveGame();
                  if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
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
            mixModalTimer.textContent = `Cooking ${recipeName}... ${Math.ceil((cookingEndTime - now)/1000)}s left`;
          } else {
            mixModalTimer.textContent = 'Done!';
          }
        }
      }

      updateProgress();
      cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
      cookingTimeout = setTimeout(function() {
        clearInterval(cookingInterval);
        cooking = false;
        if (mixBulkInput) mixBulkInput.disabled = false;
        if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
        if (mixModalTimer) mixModalTimer.textContent = 'Done!';
        const recipe = recipes.find(r => r.id === cookingRecipeId);
        if (recipe) {
          if (!window.state) window.state = {};
          if (typeof window.state[recipe.rewardProperty] !== 'number') {
            window.state[recipe.rewardProperty] = 0;
          }
          window.state[recipe.rewardProperty] += cookingAmount;
          if (typeof trackHardModeIngredientsCooked === 'function') {
            trackHardModeIngredientsCooked();
          }
        }
        if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
        setTimeout(() => {
          if (mixModalProgress) mixModalProgress.style.display = 'none';
          if (mixModalTimer) mixModalTimer.style.display = 'none';
          updateMixModalUI();
        }, 1200);
        updateGlobals();
        saveCookingState(); 
        clearCookingState();
      }, pausedRemainingMs);
      updateGlobals();
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
              mixModalTimer.textContent = `Cooking ${recipeName}... ${Math.ceil((cookingEndTime - now)/1000)}s left`;
            } else {
              mixModalTimer.textContent = 'Done!';
            }
          }
        }
        updateProgress();
        cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
        cookingTimeout = setTimeout(function() {
          clearInterval(cookingInterval);
          const recipe = recipes.find(r => r.id === cookingRecipeId);
          if (recipe) {
            if (!window.state) window.state = {};
            if (!DecimalUtils.isDecimal(window.state[recipe.rewardProperty])) {
              window.state[recipe.rewardProperty] = new Decimal(0);
            }
            window.state[recipe.rewardProperty] = window.state[recipe.rewardProperty].add(cookingAmount);
            if (typeof trackHardModeIngredientsCooked === 'function') {
              trackHardModeIngredientsCooked();
            }
            if (typeof window.trackFoodAchievement === 'function') {
              window.trackFoodAchievement();
            }
          }
          if (typeof saveGame === 'function') saveGame();
          if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
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
      };
    window.addEventListener('beforeunload', function() {
      saveCookingState();
    });

    function clearCookingState() {
      localStorage.removeItem('berryCookingState');
    }

    function loadCookingState() {
      const data = localStorage.getItem('berryCookingState');
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch (e) { return null; }
    }

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
        const kitchenIngredients = window.kitchenIngredients || {};
        let hasAllIngredients = true;
        for (const [ingredient, amount] of Object.entries(totalCosts)) {
          const available = kitchenIngredients[ingredient] || new Decimal(0);
          if (DecimalUtils.isDecimal(available) ? available.lt(amount) : new Decimal(available).lt(amount)) {
            hasAllIngredients = false;
            break;
          }
        }
        if (night) {
          cookBtn.textContent = 'Cooking unavailable at night';
          cookBtn.classList.add('not-enough');
          cookBtn.disabled = true;
        } else if (cooking) {
          const now = Date.now();
          if (cookingEndTime && now >= cookingEndTime) {
            cookBtn.textContent = 'Finish Cooking';
            cookBtn.classList.remove('not-enough');
            cookBtn.disabled = false;
            cookBtn.onclick = function() {
              const cookedRecipe = recipes.find(r => r.id === cookingRecipeId);
              if (cookedRecipe) {
                if (!window.state) window.state = {};
                if (!DecimalUtils.isDecimal(window.state[cookedRecipe.rewardProperty])) {
                  window.state[cookedRecipe.rewardProperty] = new Decimal(0);
                }
                window.state[cookedRecipe.rewardProperty] = window.state[cookedRecipe.rewardProperty].add(cookingAmount);
                if (typeof trackHardModeIngredientsCooked === 'function') {
                  trackHardModeIngredientsCooked();
                }
              }
              if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
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
            cookBtn.textContent = `Cooking ${recipeName}...`;
            cookBtn.classList.add('not-enough');
            cookBtn.disabled = true;
          }
        } else {
          cookBtn.textContent = `Cook ${bulkAmount} ${recipe.unit}`;
          if (!hasAllIngredients) {
            cookBtn.classList.add('not-enough');
            cookBtn.disabled = true;
          }
          cookBtn.onclick = function() {
            if (night) return;
            if (cooking) return;
            if (!hasAllIngredients) return;
            for (const [ingredient, amount] of Object.entries(totalCosts)) {
              if (!DecimalUtils.isDecimal(window.kitchenIngredients[ingredient])) {
                window.kitchenIngredients[ingredient] = new Decimal(0);
              }
              window.kitchenIngredients[ingredient] = window.kitchenIngredients[ingredient].sub(amount);
            }
            if (typeof updateKitchenUI === 'function') updateKitchenUI();
            startCooking(bulkAmount, time.toNumber(), recipe.id);
          };
        }
        mixModalActions.appendChild(cookBtn);
      }
      if (mixBulkInput) mixBulkInput.disabled = cooking || night;
    }

    function patchCookingButtonLiveUpdate() {
      if (!mixModalActions) return;
      setInterval(() => {
        const night = isNightTime();
        if (night) {
          const btn = mixModalActions.querySelector('button');
          if (btn) {
            btn.textContent = 'Cooking unavailable at night';
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
          btn.textContent = 'Finish Cooking';
          btn.classList.remove('not-enough');
          btn.disabled = false;
        } else {
          const cookingRecipe = recipes.find(r => r.id === cookingRecipeId);
          const recipeName = cookingRecipe ? cookingRecipe.name : 'item';
          btn.textContent = `Cooking ${recipeName}...`;
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
    window.addEventListener('DOMContentLoaded', function() {
      const saved = loadCookingState();
      if (saved && saved.amount) {
        const now = Date.now();
        if (saved.pausedForNight) {
          cooking = true;
          pausedForNight = true;
          pausedRemainingMs = saved.pausedRemainingMs;
          cookingAmount = saved.amount;
          cookingRecipeId = saved.recipeId;
          cookingEndTime = now + pausedRemainingMs;
          updateGlobals();
          if (mixBulkInput) mixBulkInput.disabled = true;
          if (mixModalProgress) mixModalProgress.style.display = '';
          if (mixModalTimer) mixModalTimer.style.display = '';
          if (mixModalProgressBar) mixModalProgressBar.style.width = '0%';
          if (mixModalTimer) mixModalTimer.textContent = 'Paused for night';
        } else if (saved.endTime && now >= saved.endTime) {
          const recipe = recipes.find(r => r.id === saved.recipeId);
          if (recipe) {
            if (!window.state) window.state = {};
            if (typeof window.state[recipe.rewardProperty] !== 'number') {
              window.state[recipe.rewardProperty] = 0;
            }
            window.state[recipe.rewardProperty] += saved.amount;
            if (typeof trackHardModeIngredientsCooked === 'function') {
              trackHardModeIngredientsCooked();
            }
          }
          if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
          clearCookingState();
          updateGlobals();
        } else if (saved.endTime && saved.amount) {
          cooking = true;
          cookingAmount = saved.amount;
          cookingRecipeId = saved.recipeId;
          cookingEndTime = saved.endTime;
          updateGlobals();
          if (mixBulkInput) mixBulkInput.disabled = true;
          if (mixModalProgress) mixModalProgress.style.display = '';
          if (mixModalTimer) mixModalTimer.style.display = '';
          const totalMs = saved.endTime - now;

          function updateProgress() {
            const updateNow = Date.now();
            if ((updateNow - lastCookingProgressUpdate) < COOKING_PROGRESS_UPDATE_THROTTLE) {
              return;
            }
            lastCookingProgressUpdate = updateNow;

            const now2 = Date.now();
            const elapsed = Math.max(0, saved.endTime - now2);
            const percent = 100 - Math.min(100, (elapsed / (saved.endTime - (saved.endTime - saved.duration))) * 100);
            if (mixModalProgressBar) mixModalProgressBar.style.width = percent + '%';
            if (mixModalTimer) {
              if (now2 < saved.endTime) {
                mixModalTimer.textContent = `Cooking... ${Math.ceil((saved.endTime - now2)/1000)}s left`;
              } else {
                mixModalTimer.textContent = 'Done!';
              }
            }
          }

          updateProgress();
          cookingInterval = setInterval(updateProgress, COOKING_PROGRESS_UPDATE_THROTTLE);
          cookingTimeout = setTimeout(function() {
            clearInterval(cookingInterval);
            cooking = false;
            if (mixBulkInput) mixBulkInput.disabled = false;
            if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
            if (mixModalTimer) mixModalTimer.textContent = 'Done!';
            const recipe = recipes.find(r => r.id === cookingRecipeId);
            if (recipe) {
              if (!window.state) window.state = {};
              if (typeof window.state[recipe.rewardProperty] !== 'number') {
                window.state[recipe.rewardProperty] = 0;
              }
              window.state[recipe.rewardProperty] += cookingAmount;
              if (typeof trackHardModeIngredientsCooked === 'function') {
                trackHardModeIngredientsCooked();
              }
            }
            if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
            setTimeout(() => {
              if (mixModalProgress) mixModalProgress.style.display = 'none';
              if (mixModalTimer) mixModalTimer.style.display = 'none';
              updateMixModalUI();
            }, 1200);
            updateGlobals();
            saveCookingState();
          }, totalMs);
        }
        updateMixModalUI();
        if (mixModal && mixModal.style.display !== 'none') {
          updateMixModalUI();
        }
      }
    });
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
          const saved = loadCookingState();
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
                  mixModalTimer.textContent = `Cooking ${recipeName}... ${Math.ceil((saved.endTime - now2)/1000)}s left`;
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
              cooking = false;
              if (mixBulkInput) mixBulkInput.disabled = false;
              if (mixModalProgressBar) mixModalProgressBar.style.width = '100%';
              if (mixModalTimer) mixModalTimer.textContent = 'Done!';
              const recipe = recipes.find(r => r.id === cookingRecipeId);
              if (recipe) {
                if (!window.state) window.state = {};
                if (typeof window.state[recipe.rewardProperty] !== 'number') {
                  window.state[recipe.rewardProperty] = 0;
                }
                window.state[recipe.rewardProperty] += cookingAmount;
                if (typeof trackHardModeIngredientsCooked === 'function') {
                  trackHardModeIngredientsCooked();
                }
              }
              if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
              setTimeout(() => {
                if (mixModalProgress) mixModalProgress.style.display = 'none';
                if (mixModalTimer) mixModalTimer.style.display = 'none';
                updateMixModalUI();
              }, 1200);
              updateGlobals();
              saveCookingState();
              clearCookingState();
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
});
(function() {
  let cooking = false;
  let pausedForNight = false;
  let pausedRemainingMs = 0;
  let cookingEndTime = 0;
  let cookingAmount = 0;
  let cookingInterval = null;
  let cookingTimeout = null;

  function loadCookingState() {
    const data = localStorage.getItem('berryCookingState');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) { return null; }
  }

  function clearCookingState() {
    localStorage.removeItem('berryCookingState');
  }

  function isNightTime() {
    if (!window.daynight || typeof window.daynight.getTime !== 'function') return false;
    const mins = window.daynight.getTime();
    return (mins >= 1320 && mins < 1440) || (mins >= 0 && mins < 360);
  }

  window.addEventListener('DOMContentLoaded', function() {
    const saved = loadCookingState();
    if (saved && saved.amount) {
      const now = Date.now();
      if (saved.pausedForNight) {
        cooking = true;
        pausedForNight = true;
        pausedRemainingMs = saved.pausedRemainingMs;
        cookingAmount = saved.amount;
        cookingRecipeId = saved.recipeId;
        cookingEndTime = now + pausedRemainingMs;
      } else if (saved.endTime && now >= saved.endTime) {
        const recipe = recipes.find(r => r.id === saved.recipeId);
        if (recipe) {
          if (!window.state) window.state = {};
          if (typeof window.state[recipe.rewardProperty] !== 'number') {
            window.state[recipe.rewardProperty] = 0;
          }
          window.state[recipe.rewardProperty] += saved.amount;
          if (typeof trackHardModeIngredientsCooked === 'function') {
            trackHardModeIngredientsCooked();
          }
        }
        if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
        clearCookingState();
      } else if (saved.endTime && saved.amount) {
        cooking = true;
        cookingAmount = saved.amount;
        cookingRecipeId = saved.recipeId;
        cookingEndTime = saved.endTime;
      }
    }
  });
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