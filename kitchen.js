// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file











































const recipes = [
  {
    id: 'berryPlate',
    name: 'Berry Plate',
    image: 'assets/icons/berry plate token.png',
    cost: { berries: 50, water: 5 },
    timePer: 5, 
    unit: 'plates',
    rewardProperty: 'berryPlate'
  },
  {
    id: 'mushroomSoup',
    name: 'Mushroom Soup',
    image: 'assets/icons/mushroom soup token.png', 
    cost: { mushroom: 50, water: 5 },
    timePer: 5, 
    unit: 'soups',
    rewardProperty: 'mushroomSoup'
  },
  {
    id: 'batteries',
    name: 'Batteries',
    image: 'assets/icons/battery token.png',
    cost: { sparks: 50, prisma: 5 },
    timePer: 5, 
    unit: 'batteries',
    rewardProperty: 'batteries'
  },
  {
    id: 'glitteringPetals',
    name: 'Glittering Petals',
    image: 'assets/icons/glittering petal token.png', 
    cost: { petals: 50, stardust: 5 },
    timePer: 5, 
    unit: 'petals',
    rewardProperty: 'glitteringPetals'
  },
  {
    id: 'chargedPrisma',
    name: 'Charged Prisma',
    image: 'assets/icons/charged prism token.png', 
    cost: { prisma: 50, sparks: 10, stardust: 3 },
    timePer: 5, 
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

function spawnIngredientToken(context, sourceElement) {
  if (context === 'generator') {
    const genTab = document.getElementById('generatorSubTab');
    if (!genTab || genTab.style.display === 'none' || genTab.offsetParent === null) return;
  }
  const now = Date.now();
  if (window.ingredientTokenCooldown[context] && now < window.ingredientTokenCooldown[context]) return;
  let chance = (context === 'generator') ? 1/1000 : (context === 'prism') ? 1/30 :(context === 'terrarium') ? 1/1 : 1/75;
  if (Math.random() > chance) return;
  if (typeof window.currentGrade !== 'undefined' && window.currentGrade < 3) return;
  const type = getRandomIngredientType(context);
  const token = document.createElement('img');
  token.src = INGREDIENT_TYPE_IMAGES[type] || 'assets/icons/flower.png';
  token.className = 'ingredient-token';
  token.style.position = 'fixed';
  token.style.zIndex = 99999;
  token.style.width = '48px';
  token.style.height = '48px';
  token.style.transition = 'transform 0.7s cubic-bezier(.4,2,.6,1), opacity 0.5s';
  token.dataset.type = type;
  token.dataset.spawnTime = now;
  token.dataset.collected = 'false';
  const start = sourceElement.getBoundingClientRect();
  token.style.left = (start.left + start.width/2 - 24) + 'px';
  token.style.top = (start.top + start.height/2 - 24) + 'px';
  document.body.appendChild(token);
  setTimeout(() => {
    const { x, y } = getNearbyPosition(sourceElement);
    token.style.transform = `translate(${x - (start.left + start.width/2)}px, ${y - (start.top + start.height/2)}px)`;
  }, 10);
  token.style.opacity = '0.5';
  token.style.filter = 'grayscale(50%)';
  setTimeout(() => {
    if (token.dataset.collected !== 'true') {
      token.style.opacity = '1';
      token.style.filter = 'none';
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
  const fadeTimeout = setTimeout(() => {
    if (token.dataset.collected === 'true') return;
    token.style.opacity = '0';
    setTimeout(() => token.remove(), 600);
  }, 10000);
  window.activeIngredientTokens.push({ token, fadeTimeout });
  window.ingredientTokenCooldown[context] = now + 5000;
}

function collectIngredientToken(type, token) {
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

function updateKitchenUI() {
  if (!window.kitchenIngredients) window.kitchenIngredients = {};
  const types = ['berries', 'mushroom', 'sparks', 'petals', 'water', 'prisma', 'stardust', 'swabucks'];
  types.forEach(type => {
    if (typeof window.kitchenIngredients[type] !== 'number') window.kitchenIngredients[type] = 0;
    const el = document.getElementById('ingredientCount-' + type);
    if (el) {
      el.textContent = window.kitchenIngredients[type];
    }
  });
}

const mysticIdleSpeeches = [
  "Where's the seasoning? This dish is so bland, even Fluzzer wouldn't eat it!",
  "I cook for all 7 workers here in this facility, including myself.",
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
  "You excpect me to cook using prisma shards? Are you insane?"
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
  let pool = type === 'poke' ? mysticPokeSpeeches : mysticIdleSpeeches;
  const randomSpeech = pool[Math.floor(Math.random() * pool.length)];
  speechBubble.textContent = randomSpeech;
  speechBubble.style.display = 'block';
  mysticImg.src = 'assets/icons/chef mystic speech.png';
  if (window.mysticSpeechTimeout) clearTimeout(window.mysticSpeechTimeout);
  window.mysticSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    mysticImg.src = 'assets/icons/chef mystic.png';
  }, 7000);
}

window.addEventListener('DOMContentLoaded', function() {
  const mysticImg = document.getElementById('kitchenCharacterImg');
  if (mysticImg) {
    mysticImg.style.cursor = 'pointer';
    mysticImg.onclick = function() {
      showMysticSpeech('poke', true);
    };
  }
});
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
  let lastKitchenVisible = false;

  function checkKitchenVisibility() {
    const kitchenTab = document.getElementById('kitchenSubTab');
    const visible = kitchenTab && kitchenTab.style.display !== 'none' && kitchenTab.offsetParent !== null;
    if (visible && !lastKitchenVisible) {
      showMysticSpeech('idle', true);
      startMysticRandomSpeechTimer();
    } else if (!visible && lastKitchenVisible) {
      stopMysticRandomSpeechTimer();
    }
    lastKitchenVisible = visible;
  }

  setInterval(checkKitchenVisibility, 1000); 
  document.addEventListener('DOMContentLoaded', checkKitchenVisibility);
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
  document.addEventListener('DOMContentLoaded', tryPatch);
})();
window.spawnIngredientToken = spawnIngredientToken;
window.INGREDIENT_TYPE_IMAGES = INGREDIENT_TYPE_IMAGES;
window.showMysticSpeech = showMysticSpeech;

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
(function patchKitchenTabVisibility() {
  let lastKitchenVisible = false;

  function checkKitchenVisibility() {
    const kitchenTab = document.getElementById('kitchenSubTab');
    const visible = kitchenTab && kitchenTab.style.display !== 'none' && kitchenTab.offsetParent !== null;
    if (visible && !lastKitchenVisible) {
      updateMysticNightState();
    }
    lastKitchenVisible = visible;
  }

  setInterval(checkKitchenVisibility, 1000);
  document.addEventListener('DOMContentLoaded', checkKitchenVisibility);
})();

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
    };
    let cooking = window.kitchenCooking.cooking;
    let cookingEndTime = window.kitchenCooking.cookingEndTime;
    let cookingAmount = window.kitchenCooking.cookingAmount;
    let cookingRecipeId = window.kitchenCooking.cookingRecipeId;
    let cookingInterval = window.kitchenCooking.cookingInterval;
    let cookingTimeout = window.kitchenCooking.cookingTimeout;
    let pausedForNight = window.kitchenCooking.pausedForNight;
    let pausedRemainingMs = window.kitchenCooking.pausedRemainingMs;

    function updateGlobals() {
      window.kitchenCooking.cooking = cooking;
      window.kitchenCooking.pausedForNight = pausedForNight;
      window.kitchenCooking.pausedRemainingMs = pausedRemainingMs;
      window.kitchenCooking.cookingEndTime = cookingEndTime;
      window.kitchenCooking.cookingAmount = cookingAmount;
      window.kitchenCooking.cookingRecipeId = cookingRecipeId;
      window.kitchenCooking.cookingInterval = cookingInterval;
      window.kitchenCooking.cookingTimeout = cookingTimeout;
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
      cookingInterval = setInterval(updateProgress, 200);
      cookingTimeout = setTimeout(function() {
        clearInterval(cookingInterval);
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
      cookingInterval = setInterval(updateProgress, 200);
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
        costs[ingredient] = amount;
        totalCosts[ingredient] = amount * bulkAmount;
      }
      let time = recipe.timePer * bulkAmount;
      if (window.state && window.state.mysticCookingSpeedBoost && window.state.mysticCookingSpeedBoost > 0) {
        time = time / 1.5; 
      }
      if (mixCookTime) mixCookTime.textContent = `${time}`;
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
          div.appendChild(document.createTextNode(`x ${amount}`));
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
          if ((kitchenIngredients[ingredient] || 0) < amount) {
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
                if (typeof window.state[cookedRecipe.rewardProperty] !== 'number') {
                  window.state[cookedRecipe.rewardProperty] = 0;
                }
                window.state[cookedRecipe.rewardProperty] += cookingAmount;
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
              window.kitchenIngredients[ingredient] -= amount;
            }
            if (typeof updateKitchenUI === 'function') updateKitchenUI();
            startCooking(bulkAmount, time, recipe.id);
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
          cookingInterval = setInterval(updateProgress, 200);
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
            cookingInterval = setInterval(updateProgress, 200);
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
