// Fluff Inc. Quest System
// This file manages the quest system functionality

// Initialize quest system in window.state
function initializeQuestState() {
  if (!window.state) {
    window.state = {};
  }
  
  if (!window.state.questSystem) {
    window.state.questSystem = {
      initialized: false,
      activeQuests: [],
      completedQuests: [],
      availableQuests: [],
      claimableQuests: [], // Quests ready to be claimed by clicking character
      currentDialogue: null,
      dialogueInProgress: false,
      pinnedQuests: [] // Array of pinned quest IDs
    };
  }
  
  // Initialize pinnedQuests if it doesn't exist (for backward compatibility)
  if (!window.state.questSystem.pinnedQuests) {
    window.state.questSystem.pinnedQuests = [];
  }
  
  // Recovery: Reset dialogue state on initialization if no modal exists
  if (window.state.questSystem.dialogueInProgress && !document.querySelector('.quest-dialogue-modal')) {
    window.state.questSystem.dialogueInProgress = false;
    window.state.questSystem.currentDialogue = null;
  }
  
  // Keep backward compatibility reference
  window.questSystem = window.state.questSystem;
}

// Manual recovery function (you can call this in console if needed)
function forceResetQuestDialogue() {
  resetDialogueState();
}
window.forceResetQuestDialogue = forceResetQuestDialogue;

// Check if it's currently night time (22:00 to 6:00)
function isNightTime() {
  if (!window.daynight || typeof window.daynight.getTime !== 'function') {
    return false; // Default to day time if day/night system not available
  }
  
  const mins = window.daynight.getTime();
  const NIGHT_START = 22 * 60; // 22:00 = 1320 minutes
  const NIGHT_END = 6 * 60;    // 6:00 = 360 minutes
  
  // Night time spans midnight, so we need to check both conditions
  return mins >= NIGHT_START || mins < NIGHT_END;
}

// Check if a character is sleeping (and thus unavailable for quests)
function isCharacterSleeping(characterName) {
  return isNightTime();
}

// Get all quests for a specific character, ordered by their sequence
function getCharacterQuests(characterName) {
  return Object.values(questDefinitions).filter(quest => quest.character === characterName);
}

// Get the next available quest for a character (if any)
function getNextQuestForCharacter(characterName) {
  const characterQuests = getCharacterQuests(characterName);
  
  // Find the first quest that's not completed and meets requirements
  return characterQuests.find(quest => {
    // Skip if already completed
    if (window.state.questSystem.completedQuests.includes(quest.id)) {
      return false;
    }
    
    // Skip if currently active
    if (window.state.questSystem.activeQuests.includes(quest.id)) {
      return false;
    }
    
    // Check if requirements are met for locked quests
    if (quest.status === 'locked' && quest.requirements && quest.requirements.completedQuests) {
      return quest.requirements.completedQuests.every(reqQuestId => 
        window.state.questSystem.completedQuests.includes(reqQuestId)
      );
    }
    
    return quest.status === 'available';
  });
}

// Function to track token collection for active quests
function trackTokenCollection(tokenValue = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return;
  
  // Convert tokenValue to number if it's a Decimal
  let tokenAmount = tokenValue;
  if (typeof tokenValue === 'object' && tokenValue.toNumber) {
    tokenAmount = tokenValue.toNumber();
  }
  
  // Increment token counter for all active quests that have token objectives
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    const progress = window.state.questSystem.questProgress[questId];
    
    if (quest && progress && quest.objectives && quest.objectives.tokens) {
      progress.tokensCollectedDuringQuest = (progress.tokensCollectedDuringQuest || 0) + tokenAmount;
    }
  });
  
  // Update quest modal if it's currently open (for immediate token progress updates)
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate token progress updates
  updatePinnedQuests();
}

// Debug function to check quest state
function debugQuestState() {
  console.log('Quest System State:');
  console.log('Active Quests:', window.state?.questSystem?.activeQuests);
  console.log('Completed Quests:', window.state?.questSystem?.completedQuests);
  console.log('Claimable Quests:', window.state?.questSystem?.claimableQuests);
  console.log('Quest Status:', window.state?.questSystem?.questStatus);
  console.log('Soap Quest Definition Status:', questDefinitions?.soap_quest_1?.status);
}
window.debugQuestState = debugQuestState;

// Force remove character glow (debug function)
function forceRemoveGlow(character) {
  removeCharacterQuestGlow(character);
}
window.forceRemoveGlow = forceRemoveGlow;

// Force cleanup all quest states and glows
function forceCleanupAllQuests() {
  
  // Remove all character glows
  document.querySelectorAll('.quest-available').forEach(el => {
    el.classList.remove('quest-available');
  });
  
  // Clean up quest states
  if (window.state?.questSystem) {
    cleanupQuestStates();
    
    // Force remove active quests from claimable
    const activeQuests = window.state.questSystem.activeQuests || [];
    activeQuests.forEach(questId => {
      const index = window.state.questSystem.claimableQuests.indexOf(questId);
      if (index > -1) {
        window.state.questSystem.claimableQuests.splice(index, 1);
      }
    });
    
    // Also immediately call the quest availability check to refresh states
    setTimeout(() => {
      checkQuestAvailability();
    }, 100);
  }
  
  setTimeout(debugQuestState, 200);
}
window.forceCleanupAllQuests = forceCleanupAllQuests;

// Clean up inconsistent quest states
function cleanupQuestStates() {
  if (!window.state?.questSystem) return;
  
  // Remove any quests from claimableQuests that are already active or completed
  const activeQuests = window.state.questSystem.activeQuests || [];
  const completedQuests = window.state.questSystem.completedQuests || [];
  const questStatus = window.state.questSystem.questStatus || {};
  
  window.state.questSystem.claimableQuests = window.state.questSystem.claimableQuests.filter(questId => {
    const isActive = activeQuests.includes(questId);
    const isCompleted = completedQuests.includes(questId);
    const statusActive = questStatus[questId] === 'active';
    const statusCompleted = questStatus[questId] === 'completed';
    
    if (isActive || isCompleted || statusActive || statusCompleted) {
      // Also remove the character glow
      const quest = questDefinitions[questId];
      if (quest) {
        removeCharacterQuestGlow(quest.character);
      }
      return false;
    }
    return true;
  });
  
}

// Get department theme colors
function getDepartmentColors(department) {
  const colors = {
    'Generator': {
      background: 'linear-gradient(135deg, #6c757d, #495057)',
      light: '#868e96',
      text: '#fff'
    },
    'Cargo': {
      background: 'linear-gradient(135deg, #28a745, #155724)',
      light: '#40c757',
      text: '#fff'
    },
    'Lab': {
      background: 'linear-gradient(135deg, #6f42c1, #4a148c)',
      light: '#8e65c7',
      text: '#fff'
    },
    'Kitchen': {
      background: 'linear-gradient(135deg, #fd7e14, #dc3545)',
      light: '#ff922b',
      text: '#fff'
    },
    'Terrarium': {
      background: 'linear-gradient(135deg, #20c997, #17a2b8)',
      light: '#38d9a9',
      text: '#fff'
    },
    'Boutique': {
      background: 'linear-gradient(135deg, #00e5feff, #1e94eeff)',
      light: '#4cfff6ff',
      text: '#fff'
    },
    'special': {
      background: 'linear-gradient(135deg, #dc143c, #8b0000)',
      light: '#ff1744',
      text: '#fff'
    }
  };
  return colors[department] || colors['Generator']; // Default to Generator colors
}

// Quest definitions
const questDefinitions = {
  'soap_quest_1': {
    id: 'soap_quest_1',
    character: 'soap',
    department: 'Generator',
    title: 'Soap\'s quest 1',
    description: 'Meet Soap, the soap loving engineer.',
    status: 'available',
    requirements: {
      // No requirements - available immediately when meeting Soap
    },
    objectives: {
      fluff: new Decimal('1e6'),
      tokens: 3
    },
    rewards: {
      berries: 5
    },
    dialogue: [
      {
        speaker: 'soap',
        text: "AAAAHHH! Who are you?! How did you get in here?!"
      },
      {
        speaker: 'swaria', 
        text: "Hello I'm Peachy! I was just getting curious about why this room smells so nice."
      },
      {
        speaker: 'soap',
        text: "But how did you opened the door? It's supposed to be locked to outsiders!"
      },
      {
        speaker: 'swaria',
        text: "I hacked the keypad lock. Don't worry, I'm not here to cause any trouble. I was just curious about the smell of soap in this room."
      },
      {
        speaker: 'soap',
        text: "Oh... well, I guess it's okay. I just get nervous around strangers. Actually I might need your help."
      },
      {
        speaker: 'swaria',
        text: "Sure, what do you need?"
      },
      {
        speaker: 'soap',
        text: "Well, when you hacked the door, this also affected the box generators, they all stopped working!!! All thanks to you! So maybe you can help me get the common box generator working again? I'll just need 1e6 fluff... and also collect 3 tokens as well."
      },
      {
        speaker: 'swaria',
        text: "Alright, I can help with that. I'll get to work on collecting the fluff, and the tokens."
      },
      {
        speaker: 'soap',
        text: "Good! And don't forget the tokens! I need those too!"
      },
      {
        speaker: 'swaria',
        text: "Of course! I'll be back soon with everything you need."
      },
      {
        speaker: 'soap',
        text: "Thank you Peachy, my name is Soap by the way. See you soon!"
      },

    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Hey Soap! I've got everything you asked for. The fluff and the tokens!"
      },
      {
        speaker: 'soap',
        text: "Wait you did?! I didn't think you would actually come back. Thank you so much! Here take these berries as a thank you. You've earned them! I was just about to finish on fixing the common box generator."
      },
      {
        speaker: 'swaria',
        text: "Berries! Yay! It wasn't too difficult once I got the hang of things. So this should fix the common generator?"
      },
      {
        speaker: 'soap',
        text: "Absolutely! With these materials, I can get the common box generator back up and running. Just throw the tokens into this hole right here!"
      },
      {
        speaker: 'swaria',
        text: "This hole? Wouldn't that be dangerous?"
      },
      {
        speaker: 'soap',
        text: "Absolutely not! It's perfectly safe, I promise. Just do it!"
      },
      {
        speaker: 'swaria',
        text: "Alright... There, I threw in the tokens. Now what? What about the fluff?"
      },
      {
        speaker: 'soap',
        text: "Perfect! Now for the fluff, just pour it into this container here and then click this button on the common box generator that says 'Unlock (1e6 Fluff)'."
      }
    ],
    status: 'available' // available, claimed, active, completed
  },
  
  'soap_quest_2': {
    id: 'soap_quest_2',
    character: 'soap',
    department: 'Generator',
    title: 'Soap\'s quest 2',
    description: 'Upgrading the common box generator.',
    requirements: {
      completedQuests: ['soap_quest_1'] // Requires first quest to be completed
    },
    objectives: {
      fluff: new Decimal('1e8'),
      swaria: new Decimal('1e6'), 
      tokens: 8,
      commonBoxes: 25 // Need to produce 25 common boxes
    },
    rewards: {
      berries: 7,
      sparks: 3
    },
    dialogue: [
      {
        speaker: 'soap',
        text: "Alright the common box generator is back online! But it's terrible..."
      },
      {
        speaker: 'swaria',
        text: "Terrible? What do you mean? We just got it working again!"
      },
      {
        speaker: 'soap',
        text: "It's not as efficient as it used to be! Look at how slowly it's producing common boxes now. And it needs to reach the quota of 10,000 common boxes per day."
      },
      {
        speaker: 'swaria',
        text: "Wow that's alot of boxes! Why don't you just fix it?"
      },
      {
        speaker: 'soap',
        text: "And you're saying that? You're the one who broke it in the first place, now help me, we can upgrade the common box generator's producing speed by feeding it more fluff."
      },
      {
        speaker: 'swaria',
        text: "I can help with that. How much fluff do you need?"
      },
      {
        speaker: 'soap',
        text: "Well, to be able to upgrade the speed, it will always cost 10 times more fluff than the previous upgrade. Alright let me tell you your task now."
      },
      {
        speaker: 'soap',
        text: "Your task this time will be getting the common box generator to produce 25 common box, collect 1e8 fluff, 1e6 swaria coins so I can get started on fixing the uncommon box generator, and also 8 tokens."
      },
      {
        speaker: 'swaria',
        text: "That's a big task, but I can manage it. I'll get started right away!"
      },
      {
        speaker: 'soap',
        text: "Perfect! I'll be here working on the common box generator. See you soon Peachy!"
      },
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Soap! I've got all the materials you asked for. And the common box generator has produced 25 common boxes too!"
      },
      {
        speaker: 'soap',
        text: "Awesome! The common box generator is starting to speed up again! this is great progress! Here's your reward, some berries and sparks."
      },
      {
        speaker: 'swaria',
        text: "Yay berries and... sparks? What are these?"
      },
      {
        speaker: 'soap',
        text: "Well you see, sparks are these little energy particles created by the power generator. Which is the main power source for the entire facility. Without power the entire facility stops working and everything goes dark."
      },
      {
        speaker: 'soap',
        text: "And that's my job to always keep it powered."
      },
      {
        speaker: 'swaria',
        text: "Oh wow, sounds important then! But why sparks? Shouldn't you be keeping them for yourself?"
      },
      {
        speaker: 'soap',
        text: "Well... Your reward was supposed to be 10 berries, but I'm missing 3 berries right now... And n-no its not because I've eaten these 3 missing berries... so uhh yeah I'm giving you 3 sparks as replacement ahah..."
      },
      {
        speaker: 'swaria',
        text: "Oh alright... I guess sparks are better than nothing. Thanks Soap!"
      },
      {
        speaker: 'soap',
        text: "Np! See you later Peachy!"
      }
    ],
    status: 'locked' // locked until requirements are met
  },
  
  'kitofox_challenge': {
    id: 'kitofox_challenge',
    character: 'hardmodeswaria',
    department: 'special',
    title: 'For KitoFox Challenge',
    description: 'A super long quest that will test your determination.',
    requirements: {
      // Available after doing a nectarize reset
    },
    objectives: {
      berryTokens: new Decimal(500),
      stardustTokens: new Decimal(300),
      berryPlates: new Decimal(50),
      mushroomSoups: new Decimal(50),
      prismClicks: new Decimal(7270),
      commonBoxesClicks: new Decimal(69420),
      flowersWatered: new Decimal(6942),
      powerRefills: new Decimal(150),
      soapPokes: new Decimal(1000),
      ingredientsCooked: new Decimal(150)
    },
    rewards: {
      berries: 1,
      sparks: 2,
      stardust: 3
    },
    dialogue: [
      {
        speaker: 'hardmodeswaria',
        text: "Don't do this, it's impossible!"
      },
      {
        speaker: 'kito',
        text: "What do you mean impossible? I've overcome challenges before."
      },
      {
        speaker: 'hardmodeswaria',
        text: "Stop! You'll never complete this! This quest is designed to be impossible!"
      },
      {
        speaker: 'kito',
        text: "That sounds like a challenge to me. What exactly do you need?"
      },
      {
        speaker: 'hardmodeswaria',
        text: "This is madness! But if you insist... I need you to collect a massive amounts of tokens! 500 berry tokens! 300 stardust tokens! Cook 50 berry plates! Cook 50 mushroom soups!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "...7,270 prism clicks! 69,420 common boxes! Water 69,420 flowers! 150 power refills! Poke soap 1,000 times! And cook 150 ingredients!"
      },
      {
        speaker: 'kito',
        text: "That... is quite a lot. But I'm determined to prove it's not impossible!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "You'll regret starting this! This will take forever! But fine, if you're that stubborn... This is only for the most determined of people. Good luck, you'll need it."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'kito',
        text: "I did it! I completed everything you asked for!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "What?! No way! You actually... you actually completed the impossible quest?!"
      },
      {
        speaker: 'kito',
        text: "I told you it wasn't impossible. It just took determination and patience."
      },
      {
        speaker: 'hardmodeswaria',
        text: "I... I can't believe it. For completing the easy part of the quest. That's right, I have a second quest ready for you. An even harder quest!"
      },
      {
        speaker: 'kito',
        text: "WHAT?! Another one? No way! That's insane!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "You're absolutely right. But here's your reward, you will need it for my second quest. Now go redeem this code 'no fun allowed'."
      }
    ],
    status: 'locked' // Will be unlocked when hard mode tab is available
  },

  'kitofox_challenge_2': {
    id: 'kitofox_challenge_2',
    character: 'hardmodeswaria',
    department: 'special',
    title: 'T̶̠͘h̵̪̋͝e̵͓͂̿̌ ̸͖̤̦͛̄Ü̷̪̗̲̓l̶̡̜̑͌ẗ̸̰̖́̄i̴̠͉̮̓m̶̬̈́a̸̫͎̟̓̋t̴̛͚̾ë̵͉ͅ ̸̰̋̇͘T̸̲͘͜͝ę̶̣͝s̵̪̻̯̏̕ţ̸̭̩̄̈͝',
    description: 'This is it, hardcore mode edition.',
    requirements: {
      completedQuests: ['kitofox_challenge']
    },
    objectives: {
      friendshipLevels: new Decimal(3), // Get 3 characters to friendship level 15
      petalTokens: new Decimal(1000),
      waterTokensNight: new Decimal(250), // Water tokens collected during night hours
      chargedPrisma: new Decimal(75),
      anomaliesFixed: new Decimal(300),
      powerRefills: new Decimal(250),
      prismClicksNight: new Decimal(7270), // Prism clicks during night hours
      flowersClicked: new Decimal(69420), // Flowers clicked using pollen collector
      fluzzerPokes: new Decimal(1000),
      leprePokes: new Decimal(1000),
      lepreShopPurchases: new Decimal(1337), // Purchase 1337 tokens from lepre's shop
      fluffCollected: new Decimal(6), // Collect 6 fluff
      ingredientsCooked: new Decimal(200)
    },
    rewards: {
      berries: 10,
      sparks: 20,
      stardust: 30,
      swabucks: 1000
    },
    dialogue: [
      {
        speaker: 'hardmodeswaria',
        text: "So you think you've mastered the first challenge? Ha! That was just the warm-up!"
      },
      {
        speaker: 'kito',
        text: "What?! There's MORE?! You've got to be kidding me!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Oh, I'm deadly serious. This second challenge will test EVERYTHING you know about this game!"
      },
      {
        speaker: 'kito',
        text: "Alright... I've come this far. What do you need this time?"
      },
      {
        speaker: 'hardmodeswaria',
        text: "First, you must prove your dedication by getting 3 different characters to friendship level 15. Build those relationships!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Then collect 1,000 petal tokens and 250 water tokens, but ONLY during night hours for the water tokens!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Cook 75 charged prisma, fix 300 anomalies, and fill the power generator 250 times!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Click prism tiles 7,270 times during night hours only, and click 69,420 flowers using the pollen collector!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Poke Fluzzer 1,000 times, poke Lepre 1,000 times, Purchase 1337 tokens from Lepre's shop, c̴̹̽ö̵̝́l̵̪̋l̴̢̓e̷̙̐c̸̦̈t̴̖͌ ̴̥̈6̵͙̆ ̷͈́f̶̜̊l̷͎̅u̵̮̚f̷͐ͅf̷͕̓, and cook 200 ingredients!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "BUT HERE'S THE C̷̳͎̽̕A̸̙̣̖̎͊Ṫ̶̤̙͍̈C̴͖̈̀́Ḥ̶̎! ALL of these objectives can ONLY progress when Hardcore Mode is active! No cheating!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Good luck!"
      },
      
    ],
    turnInDialogue: [
      {
        speaker: 'kito',
        text: "I... I actually did it. I completed your ultimate challenge!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "Wow... I can't believe it. You actually completed everything, and in Hardcore Mode no less!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "I have to admit, I underestimated you. You've proven yourself to be truly dedicated."
      },
      {
        speaker: 'hardmodeswaria',
        text: "Here's your well-deserved reward: 10 berries, 20 sparks, 30 stardust, and 1,000 swabucks!"
      },
      {
        speaker: 'hardmodeswaria',
        text: "And the true reward, I have a code for you, 'supreme dedication'. Go redeem it, you've earned it."
      },
      
    ],
    status: 'locked' // Will be unlocked when KitoFox Challenge is completed
  }
};

// Initialize quest system
function initializeQuestSystem() {
  // Initialize quest state first
  initializeQuestState();
  
  if (window.state.questSystem.initialized) return;
  
  // Clean up any inconsistent quest states on initialization
  cleanupQuestStates();
  
  // Set up quest button event listener
  const questBtn = document.getElementById('questBtn');
  const questModal = document.getElementById('questModal');
  
  if (questBtn && questModal) {
    questBtn.addEventListener('click', () => {
      if (questModal.style.display === 'none' || questModal.style.display === '') {
        questModal.style.display = 'flex';
        updateQuestModal();
      } else {
        questModal.style.display = 'none';
      }
    });
    
    // Close modal when clicking outside of it
    questModal.addEventListener('click', (e) => {
      if (e.target === questModal) {
        questModal.style.display = 'none';
      }
    });
    
    // Add drag resize functionality
    setupQuestModalResize(questModal);
  }
  
  // Start periodic quest availability checking
  setInterval(checkQuestAvailability, 2000); // Check every 2 seconds
  
  // Start periodic quest progress checking
  setInterval(checkQuestProgress, 1000); // Check every 1 second
  
  // Register day/night change callback to update character glows
  if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
    window.daynight.onTimeChange(function() {
      updateCharacterGlows();
    });
  }
  
  // Initial quest check
  setTimeout(checkQuestAvailability, 1000);
  
  // Clean up pinned quest state after page refresh
  cleanupPinnedQuestsOnLoad();
  
  window.state.questSystem.initialized = true;
}

// Check which quests should be available based on current game state
function checkQuestAvailability() {
  if (!window.state || !window.state.questSystem) return;
  
  const newlyAvailable = [];
  
  Object.values(questDefinitions).forEach(quest => {
    // Skip if quest is already active, completed, or claimable
    if (window.state.questSystem.activeQuests.includes(quest.id) || 
        window.state.questSystem.completedQuests.includes(quest.id) ||
        window.state.questSystem.claimableQuests.includes(quest.id)) {
      return;
    }
    
    // Also check persistent quest status
    const persistentStatus = window.state.questSystem.questStatus && window.state.questSystem.questStatus[quest.id];
    if (persistentStatus === 'active' || persistentStatus === 'completed') {
      return;
    }
    
    // Check if quest should be available (handle both 'available' and 'locked' status)
    if (quest.status === 'available' || quest.status === 'locked') {
      // Check if requirements are met
      let requirementsMet = true;
      
      // Check completed quest requirements
      if (quest.requirements && quest.requirements.completedQuests) {
        quest.requirements.completedQuests.forEach(requiredQuestId => {
          if (!window.state.questSystem.completedQuests.includes(requiredQuestId)) {
            requirementsMet = false;
          }
        });
      }
      
      // Check resource requirements
      if (quest.requirements) {
        if (quest.requirements.fluff && window.state.fluff) {
          if (!DecimalUtils.isDecimal(window.state.fluff) || window.state.fluff.lt(quest.requirements.fluff)) {
            requirementsMet = false;
          }
        }
        
        if (quest.requirements.swaria && window.state.swaria) {
          if (!DecimalUtils.isDecimal(window.state.swaria) || window.state.swaria.lt(quest.requirements.swaria)) {
            requirementsMet = false;
          }
        }
        
        if (quest.requirements.feathers && window.state.feathers) {
          if (!DecimalUtils.isDecimal(window.state.feathers) || window.state.feathers.lt(quest.requirements.feathers)) {
            requirementsMet = false;
          }
        }
      }
      
      // Special check for KitoFox Challenge - only available if hard mode is unlocked
      if (quest.id === 'kitofox_challenge') {
        const hardModeUnlocked = window.hardModePermanentlyUnlocked || 
                                (window.state && window.state.seenNectarizeResetStory) || 
                                state.seenNectarizeResetStory || 
                                (window.nectarizeResets && window.nectarizeResets >= 1);
        if (!hardModeUnlocked) {
          requirementsMet = false;
        }
      }
      
      if (requirementsMet) {
        // Unlock the quest if it was locked
        if (quest.status === 'locked') {
          quest.status = 'available';
        }
        
        window.state.questSystem.claimableQuests.push(quest.id);
        newlyAvailable.push(quest);
      }
    }
  });
  
  // Update character glows based on time of day
  updateCharacterGlows();
  
  // Auto-start KitoFox Challenge if hard mode is unlocked and quest is available
  autoStartKitoFoxChallenge();
}

// Auto-start KitoFox Challenge when hard mode becomes available
function autoStartKitoFoxChallenge() {
  if (!window.state || !window.state.questSystem) return;
  
  const questId = 'kitofox_challenge';
  const quest = questDefinitions[questId];
  
  if (!quest) return;
  
  // Check if quest is already active, completed, or claimable
  if (window.state.questSystem.activeQuests.includes(questId) || 
      window.state.questSystem.completedQuests.includes(questId) ||
      window.state.questSystem.claimableQuests.includes(questId)) {
    return;
  }
  
  // Check if hard mode is unlocked
  const hardModeUnlocked = window.hardModePermanentlyUnlocked || 
                          (window.state && window.state.seenNectarizeResetStory) || 
                          state.seenNectarizeResetStory || 
                          (window.nectarizeResets && window.nectarizeResets >= 1);
  
  if (hardModeUnlocked && quest.status === 'available') {
    // Make the quest claimable so dialogue can be triggered
    if (!window.state.questSystem.claimableQuests.includes(questId)) {
      window.state.questSystem.claimableQuests.push(questId);
    }
  }
}

// Update character glows based on quest status and time of day
function updateCharacterGlows() {
  // Handle claimable quests
  window.state.questSystem.claimableQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (quest) {
      if (isCharacterSleeping(quest.character)) {
        // Character is sleeping - show red glow instead of orange
        removeCharacterQuestGlow(quest.character);
        addCharacterSleepingGlow(quest.character);
      } else {
        // Character is awake - show orange glow
        removeCharacterSleepingGlow(quest.character);
        addCharacterQuestGlow(quest.character);
      }
    }
  });
  
  // Handle active quests that are ready to turn in
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    const progress = window.state.questSystem.questProgress && window.state.questSystem.questProgress[questId];
    
    if (quest && progress && progress.readyToTurnIn) {
      if (isCharacterSleeping(quest.character)) {
        // Character is sleeping - show red glow instead of green
        removeCharacterCompletionGlow(quest.character);
        addCharacterSleepingGlow(quest.character);
      } else {
        // Character is awake - show green glow
        removeCharacterSleepingGlow(quest.character);
        addCharacterCompletionGlow(quest.character);
      }
    }
  });
}

// Add orange glow effect to character
function addCharacterQuestGlow(characterName) {
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) {
    return;
  }
  
  const characterElement = document.querySelector(selector);
  if (!characterElement) {
    // Try again later if element doesn't exist yet
    setTimeout(() => addCharacterQuestGlow(characterName), 1000);
    return;
  }
  
  if (!characterElement.classList.contains('quest-available')) {
    characterElement.classList.add('quest-available');
    
    // Add click event listener for quest claiming
    if (!characterElement.dataset.questClickHandler) {
      characterElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCharacterQuestClick(characterName);
      });
      characterElement.dataset.questClickHandler = 'true';
    }
  }
}

// Add green glow effect to character for quest completion
function addCharacterCompletionGlow(characterName) {
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) {
    return;
  }
  
  const characterElement = document.querySelector(selector);
  if (!characterElement) {
    // Try again later if element doesn't exist yet
    setTimeout(() => addCharacterCompletionGlow(characterName), 1000);
    return;
  }
  
  if (!characterElement.classList.contains('quest-complete')) {
    characterElement.classList.add('quest-complete');
    
    // Create and add a real DOM element for the green circle instead of using ::after
    createQuestCompletionIndicator(characterElement);
    
    // Add click event listener for quest turn-in
    if (!characterElement.dataset.questTurnInHandler) {
      characterElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCharacterTurnInClick(characterName);
      });
      characterElement.dataset.questTurnInHandler = 'true';
    }
  }
}

// Create a real DOM element for the quest completion indicator
function createQuestCompletionIndicator(characterElement) {
  // Remove existing indicator if present
  const existingIndicator = characterElement.parentElement.querySelector('.quest-completion-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create new indicator element
  const indicator = document.createElement('div');
  indicator.className = 'quest-completion-indicator';
  indicator.innerHTML = '✓';
  indicator.style.cssText = `
    position: absolute;
    top: -12px;
    right: -12px;
    background: linear-gradient(45deg, #28a745, #20c997);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    z-index: 1000;
    animation: questBounce 1s ease-in-out infinite;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.6);
    border: 2px solid white;
    pointer-events: none;
  `;
  
  // Add to parent container (which has position: relative)
  characterElement.parentElement.appendChild(indicator);
}

// Remove orange glow effect from character
function removeCharacterQuestGlow(characterName) {
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) return;
  
  const characterElement = document.querySelector(selector);
  if (characterElement) {
    characterElement.classList.remove('quest-available');
  }
}

// Remove green glow effect from character
function removeCharacterCompletionGlow(characterName) {
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) return;
  
  const characterElement = document.querySelector(selector);
  if (characterElement) {
    characterElement.classList.remove('quest-complete');
    
    // Remove the real DOM indicator element
    const indicator = characterElement.parentElement.querySelector('.quest-completion-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// Add red sleeping glow effect to character
function addCharacterSleepingGlow(characterName) {
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) {
    return;
  }
  
  const characterElement = document.querySelector(selector);
  if (!characterElement) {
    // Try again later if element doesn't exist yet
    setTimeout(() => addCharacterSleepingGlow(characterName), 1000);
    return;
  }
  
  if (!characterElement.classList.contains('quest-sleeping')) {
    characterElement.classList.add('quest-sleeping');
    
    // Add click event listener for sleeping notification
    if (!characterElement.dataset.questSleepingHandler) {
      characterElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSleepingCharacterClick(characterName);
      });
      characterElement.dataset.questSleepingHandler = 'true';
    }
  }
}

// Remove red sleeping glow effect from character
function removeCharacterSleepingGlow(characterName) {
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) return;
  
  const characterElement = document.querySelector(selector);
  if (characterElement) {
    characterElement.classList.remove('quest-sleeping');
  }
}

// Reset dialogue state if stuck (recovery mechanism)
function resetDialogueState() {
  if (window.state && window.state.questSystem) {
    window.state.questSystem.dialogueInProgress = false;
    window.state.questSystem.currentDialogue = null;
    
    // Close any open dialogue modals
    const existingModal = document.querySelector('.quest-dialogue-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
  }
}

// Handle character click when quest is available
function handleCharacterQuestClick(characterName) {
  if (!window.state || !window.state.questSystem) return;
  
  // Check if character is sleeping
  if (isCharacterSleeping(characterName)) {
    handleSleepingCharacterClick(characterName);
    return;
  }
  
  // Recovery mechanism: if dialogue has been in progress for too long without a modal, reset it
  if (window.state.questSystem.dialogueInProgress && !document.querySelector('.quest-dialogue-modal')) {
    resetDialogueState();
  }
  
  // Don't start new dialogue if one is already in progress
  if (window.state.questSystem.dialogueInProgress) return;
  
  // Find claimable quest for this character
  const availableQuest = window.state.questSystem.claimableQuests.find(questId => {
    const quest = questDefinitions[questId];
    return quest && quest.character === characterName;
  });
  
  if (availableQuest) {
    startQuestDialogue(availableQuest);
  }
}

// Handle character click when quest is ready to turn in
function handleCharacterTurnInClick(characterName) {
  if (!window.state || !window.state.questSystem) return;
  
  // Check if character is sleeping
  if (isCharacterSleeping(characterName)) {
    handleSleepingCharacterClick(characterName);
    return;
  }
  
  // Recovery mechanism: if dialogue has been in progress for too long without a modal, reset it
  if (window.state.questSystem.dialogueInProgress && !document.querySelector('.quest-dialogue-modal')) {
    resetDialogueState();
  }
  
  // Don't start new dialogue if one is already in progress
  if (window.state.questSystem.dialogueInProgress) return;
  
  // Find completed active quest for this character
  const completedQuest = window.state.questSystem.activeQuests.find(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== characterName) return false;
    
    const progress = window.state.questSystem.questProgress && window.state.questSystem.questProgress[questId];
    if (!quest.objectives || !progress) return false;
    
    // Check if all objectives are met
    let allObjectivesMet = true;
    
    if (quest.objectives.fluff) {
      const currentFluff = window.state.fluff || new Decimal(0);
      const fluffProgress = DecimalUtils.isDecimal(currentFluff) ? currentFluff : new Decimal(0);
      if (!fluffProgress.gte(quest.objectives.fluff)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.tokens) {
      const tokenCount = getTotalTokenCount();
      if (tokenCount < quest.objectives.tokens) {
        allObjectivesMet = false;
      }
    }
    
    return allObjectivesMet;
  });
  
  if (completedQuest) {
    startQuestTurnInDialogue(completedQuest);
  }
}

// Handle sleeping character click
function handleSleepingCharacterClick(characterName) {
  // Show generic notification using the achievement notification system
  if (typeof window.showGenericRewardNotification === 'function') {
    const characterDisplayName = getQuestCharacterName(characterName);
    window.showGenericRewardNotification(
      'fluff', // Using fluff icon as generic icon
      '',
      'Character Sleeping',
      `${characterDisplayName} is sleeping. Check back during day time (6:00 - 22:00)!`
    );
  } else {
    // Fallback notification if achievement system not available
    alert(`${getQuestCharacterName(characterName)} is sleeping. Check back during day time (6:00 - 22:00)!`);
  }
}

// Start quest dialogue
function startQuestDialogue(questId) {
  const quest = questDefinitions[questId];
  if (!quest || !quest.dialogue || !window.state || !window.state.questSystem) return;
  
  window.state.questSystem.currentDialogue = {
    questId: questId,
    currentLine: 0,
    dialogue: quest.dialogue,
    type: 'start'
  };
  
  showDialogueInterface();
}

// Start quest turn-in dialogue
function startQuestTurnInDialogue(questId) {
  const quest = questDefinitions[questId];
  if (!quest || !window.state || !window.state.questSystem) return;
  
  // Use quest-specific turn-in dialogue if available, otherwise use generic dialogue
  let turnInDialogue;
  
  if (quest.turnInDialogue && quest.turnInDialogue.length > 0) {
    turnInDialogue = quest.turnInDialogue;
  } else {
    // Fallback to generic turn-in dialogue
    turnInDialogue = [
      {
        speaker: quest.character,
        text: `Amazing! You've completed everything I asked for. Thank you so much for your help!`
      },
      {
        speaker: 'swaria',
        text: `You're welcome! I'm glad I could help.`
      },
      {
        speaker: quest.character,
        text: `Here's your reward as promised. You've earned it!`
      }
    ];
  }
  
  window.state.questSystem.currentDialogue = {
    questId: questId,
    currentLine: 0,
    dialogue: turnInDialogue,
    type: 'turnin'
  };
  
  showDialogueInterface();
}

// Get character image path
function getQuestCharacterImage(character, speaking = false) {
  if (character === 'swaria' || character === 'peachy') {
    if (window.premiumState && window.premiumState.bijouEnabled) {
      return speaking ? 'assets/icons/peachy and bijou talking.png' : 'assets/icons/peachy and bijou.png';
    }
    return speaking ? 'swa talking.png' : 'swa normal.png';
  }
  
  const images = {
    soap: speaking ? 'assets/icons/soap speech.png' : 'assets/icons/soap.png',
    mystic: speaking ? 'assets/icons/chef mystic speech.png' : 'assets/icons/chef mystic.png',
    fluzzer: speaking ? 'assets/icons/fluzzer talking.png' : 'assets/icons/fluzzer.png',
    vi: speaking ? 'assets/icons/vivien talking.png' : 'assets/icons/vivien.png',
    lepre: speaking ? 'assets/icons/lepre speech.png' : 'assets/icons/lepre.png',
    tico: speaking ? 'assets/icons/tico speech.png' : 'assets/icons/tico.png',
    kito: speaking ? 'assets/icons/kito speech.png' : 'assets/icons/kito.png',
    hardmodeswaria: speaking ? 'assets/icons/kitomode speech.png' : 'assets/icons/kitomode.png'
  };
  
  return images[character] || 'assets/icons/wip.png';
}

// Get character display name
function getQuestCharacterName(character) {
  const names = {
    swaria: 'Swaria',
    peachy: 'Swaria',
    soap: 'Soap',
    mystic: 'Chef Mystic',
    fluzzer: 'Fluzzer',
    vi: 'Vivien',
    lepre: 'Lepre',
    tico: 'Tico',
    kito: 'Kito',
    hardmodeswaria: 'Swaria'
  };
  return names[character] || character;
}

// Show dialogue interface with character images
function showDialogueInterface() {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.currentDialogue) return;
  
  const dialogue = window.state.questSystem.currentDialogue;
  const currentLine = dialogue.dialogue[dialogue.currentLine];
  const quest = questDefinitions[dialogue.questId];
  
  // Create dialogue modal
  let dialogueModal = document.getElementById('questDialogueModal');
  if (!dialogueModal) {
    dialogueModal = document.createElement('div');
    dialogueModal.id = 'questDialogueModal';
    dialogueModal.style.cssText = `
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      z-index: 10000000000;
      pointer-events: auto;
      cursor: pointer;
    `;
    document.body.appendChild(dialogueModal);
    
    // Add click-to-continue functionality
    dialogueModal.addEventListener('click', continueDialogue);
    
    // Set flag only after dialogue interface is successfully created
    window.state.questSystem.dialogueInProgress = true;
  }
  
  const speakerName = getQuestCharacterName(currentLine.speaker);
  const isSpeaking = (speaker) => speaker === currentLine.speaker;
  
  // Get all unique speakers in this dialogue
  const allSpeakers = [...new Set(quest.dialogue.map(line => line.speaker))];
  
  // Determine left and right characters dynamically
  let leftCharacter, rightCharacter;
  
  if (quest.id === 'kitofox_challenge' || quest.id === 'kitofox_challenge_2') {
    // For KitoFox Challenge and KitoFox Challenge 2, put kito on left and hardmodeswaria on right
    leftCharacter = 'kito';
    rightCharacter = 'hardmodeswaria';
  } else {
    // Default behavior: swaria on left, quest character on right
    leftCharacter = allSpeakers.includes('swaria') ? 'swaria' : allSpeakers[0];
    rightCharacter = quest.character;
  }
  
  // Get character images
  const leftCharacterImage = getQuestCharacterImage(leftCharacter, isSpeaking(leftCharacter));
  const rightCharacterImage = getQuestCharacterImage(rightCharacter, isSpeaking(rightCharacter));
  
  dialogueModal.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    ">
      <!-- Character Images -->
      <div style="
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
        position: relative;
      ">
        <!-- Left Character -->
        <div id="questLeftContainer" style="
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: ${isSpeaking(leftCharacter) ? '1' : '0.6'};
          transition: opacity 0.3s ease;
          transform: scale(${isSpeaking(leftCharacter) ? '1.05' : '1'});
          position: relative;
        ">
          <img src="${leftCharacterImage}" alt="${getQuestCharacterName(leftCharacter)}" style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          ">
          ${isSpeaking(leftCharacter) ? `
            <div class="quest-speech-bubble quest-speech-right">
              ${currentLine.text}
            </div>
          ` : ''}
        </div>
        
        <!-- Right Character (Flipped) -->
        <div id="questRightContainer" style="
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: ${isSpeaking(rightCharacter) ? '1' : '0.6'};
          transition: opacity 0.3s ease;
          transform: scaleX(-1) scale(${isSpeaking(rightCharacter) ? '1.05' : '1'});
          position: relative;
        ">
          <img src="${rightCharacterImage}" alt="${getQuestCharacterName(rightCharacter)}" style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          ">
          ${isSpeaking(rightCharacter) ? `
            <div class="quest-speech-bubble quest-speech-flipped">
              ${currentLine.text}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Continue to next dialogue line
function continueDialogue(event) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.currentDialogue) return;
  
  // Prevent event bubbling if called from click event
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  window.state.questSystem.currentDialogue.currentLine++;
  
  if (window.state.questSystem.currentDialogue.currentLine >= window.state.questSystem.currentDialogue.dialogue.length) {
    // Dialogue finished, complete quest claiming
    completeQuestClaim();
  } else {
    // Show next dialogue line
    showDialogueInterface();
  }
}

// Complete quest claiming process
function completeQuestClaim() {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.currentDialogue) return;
  
  const questId = window.state.questSystem.currentDialogue.questId;
  const quest = questDefinitions[questId];
  const dialogueType = window.state.questSystem.currentDialogue.type;
  
  if (dialogueType === 'turnin') {
    // Handle quest turn-in completion
    completeQuestTurnIn(questId);
  } else {
    // Handle quest start/claiming
    // Remove from claimable quests
    window.state.questSystem.claimableQuests = window.state.questSystem.claimableQuests.filter(id => id !== questId);
    
    // Add to active quests with progress tracking
    window.state.questSystem.activeQuests.push(questId);
    
    // Initialize quest progress if it has objectives
    if (quest.objectives && !window.state.questSystem.questProgress) {
      window.state.questSystem.questProgress = {};
    }
    
    if (quest.objectives) {
      // Store starting values when quest begins
      const startingFluff = window.state.fluff ? (DecimalUtils.isDecimal(window.state.fluff) ? window.state.fluff : new Decimal(window.state.fluff)) : new Decimal(0);
      const startingSwaria = window.state.swaria ? (DecimalUtils.isDecimal(window.state.swaria) ? window.state.swaria : new Decimal(window.state.swaria)) : new Decimal(0);
      const startingCommonBoxes = getCommonBoxCount();
      
      // Special handling for KitoFox Challenge quest
      if (questId === 'kitofox_challenge') {
        window.state.questSystem.questProgress[questId] = {
          // For KitoFox Challenge, we track existing hard mode progress
          berryTokens: new Decimal(0),
          stardustTokens: new Decimal(0),
          berryPlates: new Decimal(0),
          mushroomSoups: new Decimal(0),
          prismClicks: new Decimal(0),
          flowersWatered: new Decimal(0),
          powerRefills: new Decimal(0),
          commonBoxes: new Decimal(0),
          soapPokes: new Decimal(0),
          ingredientsCooked: new Decimal(0),
          completed: false,
          readyToTurnIn: false
        };
      } else {
        window.state.questSystem.questProgress[questId] = {
          // Starting values when quest began
          startingFluff: startingFluff,
          startingSwaria: startingSwaria,
          startingCommonBoxes: startingCommonBoxes,
          
          // Progress tracking (what was gained during quest)
          fluffCollected: new Decimal(0),
          swariaCollected: new Decimal(0),
          tokensCollected: 0,
          tokensCollectedDuringQuest: 0,
          commonBoxesProduced: 0,
          completed: false
        };
      }
    }
    
    // Remove character glow
    removeCharacterQuestGlow(quest.character);
    
    // Update quest status to active (note: this might not persist after refresh)
    quest.status = 'active';
    
    // Also track quest status in persistent state
    if (!window.state.questSystem.questStatus) {
      window.state.questSystem.questStatus = {};
    }
    window.state.questSystem.questStatus[questId] = 'active';
  }
  
  // Close dialogue
  closeDialogueInterface();
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
}

// Complete quest turn-in process
function completeQuestTurnIn(questId) {
  const quest = questDefinitions[questId];
  if (!quest) return;
  
  // Move from active to completed
  window.state.questSystem.activeQuests = window.state.questSystem.activeQuests.filter(id => id !== questId);
  window.state.questSystem.completedQuests.push(questId);
  
  // Mark progress as completed
  if (window.state.questSystem.questProgress && window.state.questSystem.questProgress[questId]) {
    window.state.questSystem.questProgress[questId].completed = true;
  }
  
  // Give rewards and show notifications
  giveQuestRewardsWithNotifications(quest.rewards, quest.title);
  
  // Update quest status
  quest.status = 'completed';
  if (!window.state.questSystem.questStatus) {
    window.state.questSystem.questStatus = {};
  }
  window.state.questSystem.questStatus[questId] = 'completed';
  
  // Remove character completion glow
  removeCharacterCompletionGlow(quest.character);
  
  // Check if any new quests should be unlocked
  setTimeout(() => {
    checkQuestAvailability();
  }, 500); // Small delay to ensure state is updated
  
  // Check for secret achievement - KitoFox Challenge 2 completion
  if (questId === 'kitoFoxChallenge2') {
    if (typeof window.trackHardModeQuestCompletion === 'function') {
      window.trackHardModeQuestCompletion();
    }
  }
  
  // Remove from pinned quests if it was pinned
  if (window.state.questSystem.pinnedQuests && window.state.questSystem.pinnedQuests.includes(questId)) {
    window.state.questSystem.pinnedQuests = window.state.questSystem.pinnedQuests.filter(id => id !== questId);
    removePinnedQuestUI(questId);
  }
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
}

// Give quest rewards to player
function giveQuestRewards(rewards) {
  // Initialize state and inventory if needed
  if (!window.state) window.state = {};
  if (!window.state.inventory) {
    window.state.inventory = {
      swabucks: 0,
      batteries: 0,
      berries: 0,
      mushroom: 0,
      sparks: 0,
      petals: 0,
      water: 0,
      prisma: 0,
      stardust: 0,
      glitteringPetals: 0,
      chargedPrisma: 0,
      berryPlate: 0,
      mushroomSoup: 0
    };
  }
  
  if (rewards.swabucks) {
    window.state.inventory.swabucks = (window.state.inventory.swabucks || 0) + rewards.swabucks;
  }
  
  if (rewards.batteries) {
    window.state.inventory.batteries = (window.state.inventory.batteries || 0) + rewards.batteries;
  }
  
  if (rewards.berries) {
    window.state.inventory.berries = (window.state.inventory.berries || 0) + rewards.berries;
  }
  
  // Update inventory display if function exists
  if (typeof window.updateInventoryModal === 'function') {
    window.updateInventoryModal(true);
  }
}

// Give quest rewards with achievement-style notifications
function giveQuestRewardsWithNotifications(rewards, questTitle) {
  // Give the rewards first
  giveQuestRewards(rewards);
  
  // Show notifications for each reward type using the achievement notification system
  if (rewards.swabucks && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('swabucks', rewards.swabucks, 'Quest Complete!', `${questTitle} - +${rewards.swabucks} Swa Bucks`);
    }, 200);
  }
  
  if (rewards.batteries && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('battery', rewards.batteries, 'Quest Complete!', `${questTitle} - +${rewards.batteries} Batteries`);
    }, 400);
  }
  
  if (rewards.berries && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('berry', rewards.berries, 'Quest Complete!', `${questTitle} - +${rewards.berries} Berry Tokens`);
    }, 600);
  }
  
  if (rewards.mushroom && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('mushroom', rewards.mushroom, 'Quest Complete!', `${questTitle} - +${rewards.mushroom} Mushroom Tokens`);
    }, 800);
  }
  
  if (rewards.sparks && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('spark', rewards.sparks, 'Quest Complete!', `${questTitle} - +${rewards.sparks} Spark Tokens`);
    }, 1000);
  }
  
  if (rewards.petals && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('petal', rewards.petals, 'Quest Complete!', `${questTitle} - +${rewards.petals} Petal Tokens`);
    }, 1200);
  }
  
  if (rewards.water && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('water', rewards.water, 'Quest Complete!', `${questTitle} - +${rewards.water} Water Tokens`);
    }, 1400);
  }
  
  if (rewards.prisma && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('prismashard', rewards.prisma, 'Quest Complete!', `${questTitle} - +${rewards.prisma} Prisma Shards`);
    }, 1600);
  }
}

// Close dialogue interface
function closeDialogueInterface() {
  const dialogueModal = document.getElementById('questDialogueModal');
  if (dialogueModal) {
    dialogueModal.remove();
  }
  
  if (window.state && window.state.questSystem) {
    window.state.questSystem.dialogueInProgress = false;
    window.state.questSystem.currentDialogue = null;
  }
}

// Show quest accepted message
function showQuestAcceptedMessage(quest) {
  const acceptedModal = document.createElement('div');
  acceptedModal.style.cssText = `
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000000001;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
  `;
  
  const objectiveText = [];
  if (quest.objectives) {
    if (quest.objectives.fluff) objectiveText.push(`Collect ${DecimalUtils.formatDecimal(quest.objectives.fluff)} Fluff`);
    if (quest.objectives.swaria) objectiveText.push(`Collect ${DecimalUtils.formatDecimal(quest.objectives.swaria)} Swaria Coins`);
    if (quest.objectives.tokens) objectiveText.push(`Collect ${quest.objectives.tokens} Tokens`);
    if (quest.objectives.commonBoxes) objectiveText.push(`Produce ${quest.objectives.commonBoxes} Common Boxes`);
  }
  
  acceptedModal.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #2196F3, #1976D2);
      color: white;
      border-radius: 16px;
      padding: 2em;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      text-align: center;
    ">
      <div style="font-size: 1.5em; margin-bottom: 1em;">📋 Quest Accepted!</div>
      <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.5em;">${quest.title}</div>
      <div style="font-size: 1em; margin-bottom: 1.5em; opacity: 0.9;">${quest.description}</div>
      ${objectiveText.length > 0 ? `
        <div style="font-size: 1.1em; margin-bottom: 2em;">
          <strong>Objectives:</strong><br>
          ${objectiveText.join('<br>')}
        </div>
      ` : ''}
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid white;
        padding: 0.8em 2em;
        border-radius: 8px;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
      ">Start Quest</button>
    </div>
  `;
  
  document.body.appendChild(acceptedModal);
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    if (acceptedModal.parentElement) {
      acceptedModal.remove();
    }
  }, 5000);
}

// Check quest progress and complete if objectives are met
function checkQuestProgress() {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return;
  
  // Initialize hardModeProgress reference to avoid ReferenceError
  const hardModeProgress = window.state.hardModeQuest || {};
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    const progress = window.state.questSystem.questProgress[questId];
    
    if (!quest || !progress || progress.completed) return;
    
    let objectivesMet = true;
    
    // Check fluff objective (track progress from quest start)
    if (quest.objectives && quest.objectives.fluff) {
      const currentFluff = window.state.fluff ? (DecimalUtils.isDecimal(window.state.fluff) ? window.state.fluff : new Decimal(window.state.fluff)) : new Decimal(0);
      const startingFluff = progress.startingFluff || new Decimal(0);
      const fluffGained = currentFluff.sub(startingFluff);
      
      progress.fluffCollected = fluffGained.gte(0) ? fluffGained : new Decimal(0);
      
      if (progress.fluffCollected.lt(quest.objectives.fluff)) {
        objectivesMet = false;
      }
    }
    
    // Check swaria objective (track progress from quest start)
    if (quest.objectives && quest.objectives.swaria) {
      const currentSwaria = window.state.swaria ? (DecimalUtils.isDecimal(window.state.swaria) ? window.state.swaria : new Decimal(window.state.swaria)) : new Decimal(0);
      const startingSwaria = progress.startingSwaria || new Decimal(0);
      const swariaGained = currentSwaria.sub(startingSwaria);
      
      progress.swariaCollected = swariaGained.gte(0) ? swariaGained : new Decimal(0);
      
      if (progress.swariaCollected.lt(quest.objectives.swaria)) {
        objectivesMet = false;
      }
    }
    
    // Check token objective (count tokens collected during quest)
    if (quest.objectives && quest.objectives.tokens) {
      // Use quest-specific token collection counter
      const questTokenCount = progress.tokensCollectedDuringQuest || 0;
      progress.tokensCollected = questTokenCount; // Keep for backward compatibility
      if (questTokenCount < quest.objectives.tokens) {
        objectivesMet = false;
      }
    }
    
    // Check common box objective (track progress from quest start)
    if (quest.objectives && quest.objectives.commonBoxes) {
      const currentCommonBoxes = getCommonBoxCount();
      const startingCommonBoxes = progress.startingCommonBoxes || 0;
      const commonBoxesProduced = Math.max(0, currentCommonBoxes - startingCommonBoxes);
      
      progress.commonBoxesProduced = commonBoxesProduced;
      
      if (commonBoxesProduced < quest.objectives.commonBoxes) {
        objectivesMet = false;
      }
    }
    
    // Special handling for KitoFox Challenge quest - use quest system progress (not legacy hard mode)
    if (quest.id === 'kitofox_challenge') {
      // Use the quest system's own progress tracking, not legacy hardModeQuest
      
      // Check berry tokens collected (track collection actions, not inventory)
      if (quest.objectives.berryTokens) {
        const berryTokenCount = progress.berryTokens || new Decimal(0);
        progress.berryTokens = berryTokenCount; // Ensure it's set
        if (berryTokenCount.lt(quest.objectives.berryTokens)) {
          objectivesMet = false;
        }
      }
      
      // Check stardust tokens collected (track collection actions, not inventory)  
      if (quest.objectives.stardustTokens) {
        const stardustTokenCount = progress.stardustTokens || new Decimal(0);
        progress.stardustTokens = stardustTokenCount; // Ensure it's set
        if (stardustTokenCount.lt(quest.objectives.stardustTokens)) {
          objectivesMet = false;
        }
      }
      
      // Check prism clicks
      if (quest.objectives.prismClicks) {
        const prismClickCount = DecimalUtils.isDecimal(hardModeProgress.prismClicks) ? hardModeProgress.prismClicks : new Decimal(hardModeProgress.prismClicks || 0);
        progress.prismClicks = prismClickCount;
        if (prismClickCount.lt(quest.objectives.prismClicks)) {
          objectivesMet = false;
        }
      }
      
      // Check flowers watered
      if (quest.objectives.flowersWatered) {
        const flowersWateredCount = DecimalUtils.isDecimal(hardModeProgress.flowersWatered) ? hardModeProgress.flowersWatered : new Decimal(hardModeProgress.flowersWatered || 0);
        progress.flowersWatered = flowersWateredCount;
        if (flowersWateredCount.lt(quest.objectives.flowersWatered)) {
          objectivesMet = false;
        }
      }
      
      // Check power refills
      if (quest.objectives.powerRefills) {
        const powerRefillCount = DecimalUtils.isDecimal(hardModeProgress.powerRefills) ? hardModeProgress.powerRefills : new Decimal(hardModeProgress.powerRefills || 0);
        progress.powerRefills = powerRefillCount;
        if (powerRefillCount.lt(quest.objectives.powerRefills)) {
          objectivesMet = false;
        }
      }
      
      // Check common boxes
      if (quest.objectives.commonBoxes) {
        const commonBoxCount = DecimalUtils.isDecimal(hardModeProgress.commonBoxes) ? hardModeProgress.commonBoxes : new Decimal(hardModeProgress.commonBoxes || 0);
        progress.commonBoxes = commonBoxCount;
        if (commonBoxCount.lt(quest.objectives.commonBoxes)) {
          objectivesMet = false;
        }
      }
      
      // Check soap pokes
      if (quest.objectives.soapPokes) {
        const soapPokeCount = DecimalUtils.isDecimal(hardModeProgress.soapPokes) ? hardModeProgress.soapPokes : new Decimal(hardModeProgress.soapPokes || 0);
        progress.soapPokes = soapPokeCount;
        if (soapPokeCount.lt(quest.objectives.soapPokes)) {
          objectivesMet = false;
        }
      }
      
      // Check ingredients cooked
      if (quest.objectives.ingredientsCooked) {
        const ingredientsCookedCount = DecimalUtils.isDecimal(hardModeProgress.ingredientsCooked) ? hardModeProgress.ingredientsCooked : new Decimal(hardModeProgress.ingredientsCooked || 0);
        progress.ingredientsCooked = ingredientsCookedCount;
        if (ingredientsCookedCount.lt(quest.objectives.ingredientsCooked)) {
          objectivesMet = false;
        }
      }
      
      // Check berry plates cooked (track cooking actions, not inventory)
      if (quest.objectives.berryPlates) {
        const berryPlateCount = DecimalUtils.isDecimal(hardModeProgress.berryPlatesCookingActions) ? hardModeProgress.berryPlatesCookingActions : new Decimal(hardModeProgress.berryPlatesCookingActions || 0);
        progress.berryPlates = berryPlateCount;
        if (berryPlateCount.lt(quest.objectives.berryPlates)) {
          objectivesMet = false;
        }
      }
      
      // Check mushroom soups cooked (track cooking actions, not inventory)
      if (quest.objectives.mushroomSoups) {
        const mushroomSoupCount = DecimalUtils.isDecimal(hardModeProgress.mushroomSoupsCookingActions) ? hardModeProgress.mushroomSoupsCookingActions : new Decimal(hardModeProgress.mushroomSoupsCookingActions || 0);
        progress.mushroomSoups = mushroomSoupCount;
        if (mushroomSoupCount.lt(quest.objectives.mushroomSoups)) {
          objectivesMet = false;
        }
      }
    }

    // Special handling for KitoFox Challenge 2 quest - only progress when KitoFox mode is active
    if (quest.id === 'kitofox_challenge_2') {
      // Only progress if KitoFox mode is active
      const kitoFoxModeActive = window.state && window.state.kitoFoxModeActive;
      if (!kitoFoxModeActive) {
        // If KitoFox mode is not active, don't update any progress and mark objectives as not met
        objectivesMet = false;
      } else {
        const hardModeProgress = window.state.hardModeQuest || {};
        
        // Check friendship levels (3 characters at level 15)
        if (quest.objectives.friendshipLevels) {
          let charactersAtLevel15 = 0;
          if (window.state.friendship) {
            // Check all departments for level 15+ friendship
            const departments = ['Cargo', 'Generator', 'Lab', 'Kitchen', 'Terrarium', 'Boutique', 'FrontDesk'];
            departments.forEach(dept => {
              if (window.state.friendship[dept] && window.state.friendship[dept].level >= 15) {
                charactersAtLevel15++;
              }
            });
          }
          progress.friendshipLevels = new Decimal(charactersAtLevel15);
          if (progress.friendshipLevels.lt(quest.objectives.friendshipLevels)) {
            objectivesMet = false;
          }
        }
        
        // Check petal tokens collected
        if (quest.objectives.petalTokens) {
          const petalTokenCount = DecimalUtils.isDecimal(hardModeProgress.petalTokensCollected) ? hardModeProgress.petalTokensCollected : new Decimal(hardModeProgress.petalTokensCollected || 0);
          progress.petalTokens = petalTokenCount;
          if (petalTokenCount.lt(quest.objectives.petalTokens)) {
            objectivesMet = false;
          }
        }
        
        // Check water tokens collected during night hours only
        if (quest.objectives.waterTokensNight) {
          const waterTokensNightCount = DecimalUtils.isDecimal(hardModeProgress.waterTokensNightCollected) ? hardModeProgress.waterTokensNightCollected : new Decimal(hardModeProgress.waterTokensNightCollected || 0);
          progress.waterTokensNight = waterTokensNightCount;
          if (waterTokensNightCount.lt(quest.objectives.waterTokensNight)) {
            objectivesMet = false;
          }
        }
        
        // Check charged prisma cooked
        if (quest.objectives.chargedPrisma) {
          const chargedPrismaCount = DecimalUtils.isDecimal(hardModeProgress.chargedPrismaCooked) ? hardModeProgress.chargedPrismaCooked : new Decimal(hardModeProgress.chargedPrismaCooked || 0);
          progress.chargedPrisma = chargedPrismaCount;
          if (chargedPrismaCount.lt(quest.objectives.chargedPrisma)) {
            objectivesMet = false;
          }
        }
        
        // Check anomalies fixed
        if (quest.objectives.anomaliesFixed) {
          const anomaliesFixedCount = DecimalUtils.isDecimal(hardModeProgress.anomaliesFixed) ? hardModeProgress.anomaliesFixed : new Decimal(hardModeProgress.anomaliesFixed || 0);
          progress.anomaliesFixed = anomaliesFixedCount;
          if (anomaliesFixedCount.lt(quest.objectives.anomaliesFixed)) {
            objectivesMet = false;
          }
        }
        
        // Check power refills
        if (quest.objectives.powerRefills) {
          const powerRefillCount = DecimalUtils.isDecimal(hardModeProgress.powerRefillsKito2) ? hardModeProgress.powerRefillsKito2 : new Decimal(hardModeProgress.powerRefillsKito2 || 0);
          progress.powerRefills = powerRefillCount;
          if (powerRefillCount.lt(quest.objectives.powerRefills)) {
            objectivesMet = false;
          }
        }
        
        // Check prism clicks during night hours only
        if (quest.objectives.prismClicksNight) {
          const prismClicksNightCount = DecimalUtils.isDecimal(hardModeProgress.prismClicksNight) ? hardModeProgress.prismClicksNight : new Decimal(hardModeProgress.prismClicksNight || 0);
          progress.prismClicksNight = prismClicksNightCount;
          if (prismClicksNightCount.lt(quest.objectives.prismClicksNight)) {
            objectivesMet = false;
          }
        }
        
        // Check flowers clicked using pollen collector
        if (quest.objectives.flowersClicked) {
          const flowersClickedCount = DecimalUtils.isDecimal(hardModeProgress.flowersClickedPollen) ? hardModeProgress.flowersClickedPollen : new Decimal(hardModeProgress.flowersClickedPollen || 0);
          progress.flowersClicked = flowersClickedCount;
          if (flowersClickedCount.lt(quest.objectives.flowersClicked)) {
            objectivesMet = false;
          }
        }
        
        // Check Fluzzer pokes
        if (quest.objectives.fluzzerPokes) {
          const fluzzerPokeCount = DecimalUtils.isDecimal(hardModeProgress.fluzzerPokes) ? hardModeProgress.fluzzerPokes : new Decimal(hardModeProgress.fluzzerPokes || 0);
          progress.fluzzerPokes = fluzzerPokeCount;
          if (fluzzerPokeCount.lt(quest.objectives.fluzzerPokes)) {
            objectivesMet = false;
          }
        }
        
        // Check Lepre pokes
        if (quest.objectives.leprePokes) {
          const leprePokeCount = DecimalUtils.isDecimal(hardModeProgress.leprePokes) ? hardModeProgress.leprePokes : new Decimal(hardModeProgress.leprePokes || 0);
          progress.leprePokes = leprePokeCount;
          if (leprePokeCount.lt(quest.objectives.leprePokes)) {
            objectivesMet = false;
          }
        }
        
        // Check Lepre shop purchases
        if (quest.objectives.lepreShopPurchases) {
          const lepreShopCount = DecimalUtils.isDecimal(hardModeProgress.lepreShopPurchases) ? hardModeProgress.lepreShopPurchases : new Decimal(hardModeProgress.lepreShopPurchases || 0);
          progress.lepreShopPurchases = lepreShopCount;
          if (lepreShopCount.lt(quest.objectives.lepreShopPurchases)) {
            objectivesMet = false;
          }
        }
        
        // Check fluff collected
        if (quest.objectives.fluffCollected) {
          const fluffCollectedCount = DecimalUtils.isDecimal(hardModeProgress.fluffCollectedKito2) ? hardModeProgress.fluffCollectedKito2 : new Decimal(hardModeProgress.fluffCollectedKito2 || 0);
          progress.fluffCollected = fluffCollectedCount;
          if (fluffCollectedCount.lt(quest.objectives.fluffCollected)) {
            objectivesMet = false;
          }
        }
        
        // Check ingredients cooked
        if (quest.objectives.ingredientsCooked) {
          const ingredientsCookedCount = DecimalUtils.isDecimal(hardModeProgress.ingredientsCookedKito2) ? hardModeProgress.ingredientsCookedKito2 : new Decimal(hardModeProgress.ingredientsCookedKito2 || 0);
          progress.ingredientsCooked = ingredientsCookedCount;
          if (ingredientsCookedCount.lt(quest.objectives.ingredientsCooked)) {
            objectivesMet = false;
          }
        }
      }
    }
    
    // If objectives are met, mark as ready to turn in and update glow
    if (objectivesMet && !progress.readyToTurnIn) {
      progress.readyToTurnIn = true;
      // Update glows will be handled by the periodic updateCharacterGlows call
    }
    // If objectives are no longer met, remove ready to turn in status
    else if (!objectivesMet && progress.readyToTurnIn) {
      progress.readyToTurnIn = false;
      // Update glows will be handled by the periodic updateCharacterGlows call
    }
  });
  
  // Update character glows after checking all quest progress
  updateCharacterGlows();
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests
  updatePinnedQuests();
}

// Get total token count from tokens storage
function getTotalTokenCount() {
  if (!window.state || !window.state.tokens) return 0;
  
  const tokenTypes = ['berries', 'mushroom', 'sparks', 'petals', 'water', 'prisma', 'stardust', 'batteries'];
  let totalTokens = 0;
  
  tokenTypes.forEach(type => {
    const tokenValue = window.state.tokens[type];
    if (tokenValue) {
      // Handle both Decimal and number types
      if (DecimalUtils.isDecimal(tokenValue)) {
        totalTokens += tokenValue.toNumber();
      } else {
        totalTokens += tokenValue || 0;
      }
    }
  });
  
  return totalTokens;
}

// Get total common boxes produced
function getCommonBoxCount() {
  if (!window.state || !window.state.boxesProducedByType || !window.state.boxesProducedByType.common) return 0;
  
  // Handle both Decimal and number types
  const commonBoxes = window.state.boxesProducedByType.common;
  if (DecimalUtils.isDecimal(commonBoxes)) {
    return commonBoxes.toNumber();
  }
  return commonBoxes || 0;
}

// Setup quest modal resize functionality
function setupQuestModalResize(questModal) {
  const dragHandle = document.getElementById('questModalDragHandle');
  const modalContent = document.getElementById('questModalContent');
  
  if (!dragHandle || !modalContent) return;
  
  let isResizing = false;
  let startY = 0;
  let startHeight = 0;
  let minHeight = 200;
  let maxHeight = window.innerHeight * 0.8; // Max 80% of viewport height
  
  // Load saved height from localStorage or use default
  const savedHeight = localStorage.getItem('questModalHeight');
  if (savedHeight) {
    modalContent.style.height = savedHeight + 'px';
  }
  
  // Add hover effects
  dragHandle.addEventListener('mouseenter', () => {
    if (!isResizing) {
      dragHandle.style.background = 'rgba(0,0,0,0.08)';
      const handleBar = dragHandle.querySelector('div');
      if (handleBar) handleBar.style.background = 'rgba(0,0,0,0.5)';
    }
  });
  
  dragHandle.addEventListener('mouseleave', () => {
    if (!isResizing) {
      dragHandle.style.background = 'rgba(0,0,0,0.05)';
      const handleBar = dragHandle.querySelector('div');
      if (handleBar) handleBar.style.background = 'rgba(0,0,0,0.3)';
    }
  });
  
  function startResize(clientY) {
    isResizing = true;
    startY = clientY;
    startHeight = modalContent.offsetHeight;
    
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    dragHandle.style.background = 'rgba(0,0,0,0.1)';
  }
  
  function doResize(clientY) {
    if (!isResizing) return;
    
    // Calculate new height (negative because we're dragging from top, but modal grows from bottom)
    const deltaY = startY - clientY;
    let newHeight = startHeight + deltaY;
    
    // Clamp height between min and max
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    
    modalContent.style.height = newHeight + 'px';
  }
  
  function endResize() {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = '';
      dragHandle.style.background = 'rgba(0,0,0,0.05)';
      
      // Save the current height to localStorage
      localStorage.setItem('questModalHeight', modalContent.offsetHeight);
    }
  }
  
  // Mouse events
  dragHandle.addEventListener('mousedown', (e) => {
    startResize(e.clientY);
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    doResize(e.clientY);
    if (isResizing) e.preventDefault();
  });
  
  document.addEventListener('mouseup', endResize);
  
  // Touch events for mobile
  dragHandle.addEventListener('touchstart', (e) => {
    startResize(e.touches[0].clientY);
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    doResize(e.touches[0].clientY);
    if (isResizing) e.preventDefault();
  });
  
  document.addEventListener('touchend', endResize);
  
  // Handle window resize to adjust max height
  window.addEventListener('resize', () => {
    maxHeight = window.innerHeight * 0.8;
    if (modalContent.offsetHeight > maxHeight) {
      modalContent.style.height = maxHeight + 'px';
      localStorage.setItem('questModalHeight', maxHeight);
    }
  });
}

// Toggle quest pin status
function toggleQuestPin(questId) {
  if (!window.state.questSystem.pinnedQuests) {
    window.state.questSystem.pinnedQuests = [];
  }
  
  const pinnedIndex = window.state.questSystem.pinnedQuests.indexOf(questId);
  
  if (pinnedIndex === -1) {
    // Pin the quest
    window.state.questSystem.pinnedQuests.push(questId);
    createPinnedQuestUI(questId);
  } else {
    // Unpin the quest
    window.state.questSystem.pinnedQuests.splice(pinnedIndex, 1);
    removePinnedQuestUI(questId);
  }
  
  // Update the quest modal to reflect the pin status change
  updateQuestModal();
}

// Create a pinned quest UI element
function createPinnedQuestUI(questId) {
  const quest = questDefinitions[questId];
  if (!quest) return;
  
  const progress = window.state.questSystem.questProgress && window.state.questSystem.questProgress[questId];
  const deptColors = getDepartmentColors(quest.department);
  
  // Generate progress bars (same logic as in main modal)
  let progressBars = '';
  if (quest.objectives) {
    const progressItems = [];
    
    if (quest.objectives.fluff) {
      const fluffGained = progress.fluffCollected || new Decimal(0);
      const fluffComplete = fluffGained.gte(quest.objectives.fluff);
      const fluffPercent = fluffComplete ? 100 : Math.min(100, fluffGained.div(quest.objectives.fluff).mul(100).toNumber());
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Fluff Gained</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${fluffComplete ? '✓' : `${DecimalUtils.formatDecimal(fluffGained)}/${DecimalUtils.formatDecimal(quest.objectives.fluff)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${fluffComplete ? '#28a745' : deptColors.light};height:100%;width:${fluffPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.swaria) {
      const swariaGained = progress.swariaCollected || new Decimal(0);
      const swariaComplete = swariaGained.gte(quest.objectives.swaria);
      const swariaPercent = swariaComplete ? 100 : Math.min(100, swariaGained.div(quest.objectives.swaria).mul(100).toNumber());
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Swaria Coins</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${swariaComplete ? '✓' : `${DecimalUtils.formatDecimal(swariaGained)}/${DecimalUtils.formatDecimal(quest.objectives.swaria)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${swariaComplete ? '#28a745' : deptColors.light};height:100%;width:${swariaPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.tokens) {
      const questTokenCount = progress.tokensCollectedDuringQuest || 0;
      const tokensComplete = questTokenCount >= quest.objectives.tokens;
      const tokenPercent = Math.min(100, (questTokenCount / quest.objectives.tokens) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Tokens Collected</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${tokensComplete ? '✓' : `${questTokenCount}/${quest.objectives.tokens}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${tokensComplete ? '#28a745' : deptColors.light};height:100%;width:${tokenPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.commonBoxes) {
      const commonBoxesProduced = progress.commonBoxesProduced || 0;
      const commonBoxesComplete = commonBoxesProduced >= quest.objectives.commonBoxes;
      const commonBoxPercent = Math.min(100, (commonBoxesProduced / quest.objectives.commonBoxes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Common Boxes Produced</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${commonBoxesComplete ? '✓' : `${commonBoxesProduced}/${quest.objectives.commonBoxes}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${commonBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${commonBoxPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    // KitoFox Challenge objectives
    if (quest.objectives.berryTokens) {
      const berryTokenCount = progress.berryTokens || new Decimal(0);
      const berryTokensComplete = DecimalUtils.isDecimal(berryTokenCount) ? berryTokenCount.gte(quest.objectives.berryTokens) : berryTokenCount >= quest.objectives.berryTokens;
      const berryTokenPercent = berryTokensComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(berryTokenCount) ? berryTokenCount.div(quest.objectives.berryTokens).mul(100).toNumber() : (berryTokenCount / quest.objectives.berryTokens) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Collect Berry Tokens</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${berryTokensComplete ? '✓' : `${DecimalUtils.formatDecimal(berryTokenCount)}/${DecimalUtils.formatDecimal(quest.objectives.berryTokens)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${berryTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${berryTokenPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.stardustTokens) {
      const stardustTokenCount = progress.stardustTokens || new Decimal(0);
      const stardustTokensComplete = DecimalUtils.isDecimal(stardustTokenCount) ? stardustTokenCount.gte(quest.objectives.stardustTokens) : stardustTokenCount >= quest.objectives.stardustTokens;
      const stardustTokenPercent = stardustTokensComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(stardustTokenCount) ? stardustTokenCount.div(quest.objectives.stardustTokens).mul(100).toNumber() : (stardustTokenCount / quest.objectives.stardustTokens) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Collect Stardust Tokens</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${stardustTokensComplete ? '✓' : `${DecimalUtils.formatDecimal(stardustTokenCount)}/${DecimalUtils.formatDecimal(quest.objectives.stardustTokens)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${stardustTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${stardustTokenPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.berryPlates) {
      const berryPlateCount = progress.berryPlates || new Decimal(0);
      const berryPlatesComplete = DecimalUtils.isDecimal(berryPlateCount) ? berryPlateCount.gte(quest.objectives.berryPlates) : berryPlateCount >= quest.objectives.berryPlates;
      const berryPlatePercent = berryPlatesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(berryPlateCount) ? berryPlateCount.div(quest.objectives.berryPlates).mul(100).toNumber() : (berryPlateCount / quest.objectives.berryPlates) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Cook Berry Plates</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${berryPlatesComplete ? '✓' : `${DecimalUtils.formatDecimal(berryPlateCount)}/${DecimalUtils.formatDecimal(quest.objectives.berryPlates)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${berryPlatesComplete ? '#28a745' : deptColors.light};height:100%;width:${berryPlatePercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.mushroomSoups) {
      const mushroomSoupCount = progress.mushroomSoups || new Decimal(0);
      const mushroomSoupsComplete = DecimalUtils.isDecimal(mushroomSoupCount) ? mushroomSoupCount.gte(quest.objectives.mushroomSoups) : mushroomSoupCount >= quest.objectives.mushroomSoups;
      const mushroomSoupPercent = mushroomSoupsComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(mushroomSoupCount) ? mushroomSoupCount.div(quest.objectives.mushroomSoups).mul(100).toNumber() : (mushroomSoupCount / quest.objectives.mushroomSoups) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Cook Mushroom Soups</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${mushroomSoupsComplete ? '✓' : `${DecimalUtils.formatDecimal(mushroomSoupCount)}/${DecimalUtils.formatDecimal(quest.objectives.mushroomSoups)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${mushroomSoupsComplete ? '#28a745' : deptColors.light};height:100%;width:${mushroomSoupPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.prismClicks) {
      const prismClickCount = progress.prismClicks || new Decimal(0);
      const prismClicksComplete = DecimalUtils.isDecimal(prismClickCount) ? prismClickCount.gte(quest.objectives.prismClicks) : prismClickCount >= quest.objectives.prismClicks;
      const prismClickPercent = prismClicksComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(prismClickCount) ? prismClickCount.div(quest.objectives.prismClicks).mul(100).toNumber() : (prismClickCount / quest.objectives.prismClicks) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Click Prism Tiles</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${prismClicksComplete ? '✓' : `${DecimalUtils.formatDecimal(prismClickCount)}/${DecimalUtils.formatDecimal(quest.objectives.prismClicks)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${prismClicksComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClickPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.flowersWatered) {
      const flowersWateredCount = progress.flowersWatered || new Decimal(0);
      const flowersWateredComplete = DecimalUtils.isDecimal(flowersWateredCount) ? flowersWateredCount.gte(quest.objectives.flowersWatered) : flowersWateredCount >= quest.objectives.flowersWatered;
      const flowersWateredPercent = flowersWateredComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(flowersWateredCount) ? flowersWateredCount.div(quest.objectives.flowersWatered).mul(100).toNumber() : (flowersWateredCount / quest.objectives.flowersWatered) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Water Flowers</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${flowersWateredComplete ? '✓' : `${DecimalUtils.formatDecimal(flowersWateredCount)}/${DecimalUtils.formatDecimal(quest.objectives.flowersWatered)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${flowersWateredComplete ? '#28a745' : deptColors.light};height:100%;width:${flowersWateredPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.powerRefills) {
      const powerRefillCount = progress.powerRefills || new Decimal(0);
      const powerRefillsComplete = DecimalUtils.isDecimal(powerRefillCount) ? powerRefillCount.gte(quest.objectives.powerRefills) : powerRefillCount >= quest.objectives.powerRefills;
      const powerRefillPercent = powerRefillsComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(powerRefillCount) ? powerRefillCount.div(quest.objectives.powerRefills).mul(100).toNumber() : (powerRefillCount / quest.objectives.powerRefills) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Refill Power</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${powerRefillsComplete ? '✓' : `${DecimalUtils.formatDecimal(powerRefillCount)}/${DecimalUtils.formatDecimal(quest.objectives.powerRefills)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${powerRefillsComplete ? '#28a745' : deptColors.light};height:100%;width:${powerRefillPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.soapPokes) {
      const soapPokeCount = progress.soapPokes || new Decimal(0);
      const soapPokesComplete = DecimalUtils.isDecimal(soapPokeCount) ? soapPokeCount.gte(quest.objectives.soapPokes) : soapPokeCount >= quest.objectives.soapPokes;
      const soapPokePercent = soapPokesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(soapPokeCount) ? soapPokeCount.div(quest.objectives.soapPokes).mul(100).toNumber() : (soapPokeCount / quest.objectives.soapPokes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Poke Soap</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${soapPokesComplete ? '✓' : `${DecimalUtils.formatDecimal(soapPokeCount)}/${DecimalUtils.formatDecimal(quest.objectives.soapPokes)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${soapPokesComplete ? '#28a745' : deptColors.light};height:100%;width:${soapPokePercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.ingredientsCooked) {
      const ingredientsCookedCount = progress.ingredientsCooked || new Decimal(0);
      const ingredientsCookedComplete = DecimalUtils.isDecimal(ingredientsCookedCount) ? ingredientsCookedCount.gte(quest.objectives.ingredientsCooked) : ingredientsCookedCount >= quest.objectives.ingredientsCooked;
      const ingredientsCookedPercent = ingredientsCookedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(ingredientsCookedCount) ? ingredientsCookedCount.div(quest.objectives.ingredientsCooked).mul(100).toNumber() : (ingredientsCookedCount / quest.objectives.ingredientsCooked) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Cook Ingredients</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${ingredientsCookedComplete ? '✓' : `${DecimalUtils.formatDecimal(ingredientsCookedCount)}/${DecimalUtils.formatDecimal(quest.objectives.ingredientsCooked)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${ingredientsCookedComplete ? '#28a745' : deptColors.light};height:100%;width:${ingredientsCookedPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.commonBoxesClicks) {
      const commonBoxesClickCount = progress.commonBoxesClicks || new Decimal(0);
      const commonBoxesClicksComplete = DecimalUtils.isDecimal(commonBoxesClickCount) ? commonBoxesClickCount.gte(quest.objectives.commonBoxesClicks) : commonBoxesClickCount >= quest.objectives.commonBoxesClicks;
      const commonBoxesClickPercent = commonBoxesClicksComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(commonBoxesClickCount) ? commonBoxesClickCount.div(quest.objectives.commonBoxesClicks).mul(100).toNumber() : (commonBoxesClickCount / quest.objectives.commonBoxesClicks) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Click Common Boxes</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${commonBoxesClicksComplete ? '✓' : `${DecimalUtils.formatDecimal(commonBoxesClickCount)}/${DecimalUtils.formatDecimal(quest.objectives.commonBoxesClicks)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${commonBoxesClicksComplete ? '#28a745' : deptColors.light};height:100%;width:${commonBoxesClickPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    // KitoFox Challenge 2 specific objectives
    if (quest.objectives.friendshipLevels) {
      const friendshipCount = progress.friendshipLevels || new Decimal(0);
      const friendshipComplete = DecimalUtils.isDecimal(friendshipCount) ? friendshipCount.gte(quest.objectives.friendshipLevels) : friendshipCount >= quest.objectives.friendshipLevels;
      const friendshipPercent = friendshipComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(friendshipCount) ? friendshipCount.div(quest.objectives.friendshipLevels).mul(100).toNumber() : (friendshipCount / quest.objectives.friendshipLevels) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Characters at Friendship Lvl 15</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${friendshipComplete ? '✓' : `${DecimalUtils.formatDecimal(friendshipCount)}/${DecimalUtils.formatDecimal(quest.objectives.friendshipLevels)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${friendshipComplete ? '#28a745' : deptColors.light};height:100%;width:${friendshipPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.petalTokens) {
      const petalTokenCount = progress.petalTokens || new Decimal(0);
      const petalTokensComplete = DecimalUtils.isDecimal(petalTokenCount) ? petalTokenCount.gte(quest.objectives.petalTokens) : petalTokenCount >= quest.objectives.petalTokens;
      const petalTokenPercent = petalTokensComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(petalTokenCount) ? petalTokenCount.div(quest.objectives.petalTokens).mul(100).toNumber() : (petalTokenCount / quest.objectives.petalTokens) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Collect Petal Tokens</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${petalTokensComplete ? '✓' : `${DecimalUtils.formatDecimal(petalTokenCount)}/${DecimalUtils.formatDecimal(quest.objectives.petalTokens)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${petalTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${petalTokenPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.waterTokensNight) {
      const waterTokensNightCount = progress.waterTokensNight || new Decimal(0);
      const waterTokensNightComplete = DecimalUtils.isDecimal(waterTokensNightCount) ? waterTokensNightCount.gte(quest.objectives.waterTokensNight) : waterTokensNightCount >= quest.objectives.waterTokensNight;
      const waterTokensNightPercent = waterTokensNightComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(waterTokensNightCount) ? waterTokensNightCount.div(quest.objectives.waterTokensNight).mul(100).toNumber() : (waterTokensNightCount / quest.objectives.waterTokensNight) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Collect Water Tokens (Night)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${waterTokensNightComplete ? '✓' : `${DecimalUtils.formatDecimal(waterTokensNightCount)}/${DecimalUtils.formatDecimal(quest.objectives.waterTokensNight)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${waterTokensNightComplete ? '#28a745' : deptColors.light};height:100%;width:${waterTokensNightPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.chargedPrisma) {
      const chargedPrismaCount = progress.chargedPrisma || new Decimal(0);
      const chargedPrismaComplete = DecimalUtils.isDecimal(chargedPrismaCount) ? chargedPrismaCount.gte(quest.objectives.chargedPrisma) : chargedPrismaCount >= quest.objectives.chargedPrisma;
      const chargedPrismaPercent = chargedPrismaComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(chargedPrismaCount) ? chargedPrismaCount.div(quest.objectives.chargedPrisma).mul(100).toNumber() : (chargedPrismaCount / quest.objectives.chargedPrisma) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Cook Charged Prisma</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${chargedPrismaComplete ? '✓' : `${DecimalUtils.formatDecimal(chargedPrismaCount)}/${DecimalUtils.formatDecimal(quest.objectives.chargedPrisma)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${chargedPrismaComplete ? '#28a745' : deptColors.light};height:100%;width:${chargedPrismaPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.anomaliesFixed) {
      const anomaliesFixedCount = progress.anomaliesFixed || new Decimal(0);
      const anomaliesFixedComplete = DecimalUtils.isDecimal(anomaliesFixedCount) ? anomaliesFixedCount.gte(quest.objectives.anomaliesFixed) : anomaliesFixedCount >= quest.objectives.anomaliesFixed;
      const anomaliesFixedPercent = anomaliesFixedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(anomaliesFixedCount) ? anomaliesFixedCount.div(quest.objectives.anomaliesFixed).mul(100).toNumber() : (anomaliesFixedCount / quest.objectives.anomaliesFixed) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Fix Anomalies</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${anomaliesFixedComplete ? '✓' : `${DecimalUtils.formatDecimal(anomaliesFixedCount)}/${DecimalUtils.formatDecimal(quest.objectives.anomaliesFixed)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${anomaliesFixedComplete ? '#28a745' : deptColors.light};height:100%;width:${anomaliesFixedPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.prismClicksNight) {
      const prismClicksNightCount = progress.prismClicksNight || new Decimal(0);
      const prismClicksNightComplete = DecimalUtils.isDecimal(prismClicksNightCount) ? prismClicksNightCount.gte(quest.objectives.prismClicksNight) : prismClicksNightCount >= quest.objectives.prismClicksNight;
      const prismClicksNightPercent = prismClicksNightComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(prismClicksNightCount) ? prismClicksNightCount.div(quest.objectives.prismClicksNight).mul(100).toNumber() : (prismClicksNightCount / quest.objectives.prismClicksNight) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Click Prism Tiles (Night)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${prismClicksNightComplete ? '✓' : `${DecimalUtils.formatDecimal(prismClicksNightCount)}/${DecimalUtils.formatDecimal(quest.objectives.prismClicksNight)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${prismClicksNightComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClicksNightPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.flowersClicked) {
      const flowersClickedCount = progress.flowersClicked || new Decimal(0);
      const flowersClickedComplete = DecimalUtils.isDecimal(flowersClickedCount) ? flowersClickedCount.gte(quest.objectives.flowersClicked) : flowersClickedCount >= quest.objectives.flowersClicked;
      const flowersClickedPercent = flowersClickedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(flowersClickedCount) ? flowersClickedCount.div(quest.objectives.flowersClicked).mul(100).toNumber() : (flowersClickedCount / quest.objectives.flowersClicked) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Click Flowers (Pollen Collector)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${flowersClickedComplete ? '✓' : `${DecimalUtils.formatDecimal(flowersClickedCount)}/${DecimalUtils.formatDecimal(quest.objectives.flowersClicked)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${flowersClickedComplete ? '#28a745' : deptColors.light};height:100%;width:${flowersClickedPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.fluzzerPokes) {
      const fluzzerPokesCount = progress.fluzzerPokes || new Decimal(0);
      const fluzzerPokesComplete = DecimalUtils.isDecimal(fluzzerPokesCount) ? fluzzerPokesCount.gte(quest.objectives.fluzzerPokes) : fluzzerPokesCount >= quest.objectives.fluzzerPokes;
      const fluzzerPokesPercent = fluzzerPokesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(fluzzerPokesCount) ? fluzzerPokesCount.div(quest.objectives.fluzzerPokes).mul(100).toNumber() : (fluzzerPokesCount / quest.objectives.fluzzerPokes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Poke Fluzzer</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${fluzzerPokesComplete ? '✓' : `${DecimalUtils.formatDecimal(fluzzerPokesCount)}/${DecimalUtils.formatDecimal(quest.objectives.fluzzerPokes)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${fluzzerPokesComplete ? '#28a745' : deptColors.light};height:100%;width:${fluzzerPokesPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.leprePokes) {
      const leprePokesCount = progress.leprePokes || new Decimal(0);
      const leprePokesComplete = DecimalUtils.isDecimal(leprePokesCount) ? leprePokesCount.gte(quest.objectives.leprePokes) : leprePokesCount >= quest.objectives.leprePokes;
      const leprePokesPercent = leprePokesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(leprePokesCount) ? leprePokesCount.div(quest.objectives.leprePokes).mul(100).toNumber() : (leprePokesCount / quest.objectives.leprePokes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Poke Lepre</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${leprePokesComplete ? '✓' : `${DecimalUtils.formatDecimal(leprePokesCount)}/${DecimalUtils.formatDecimal(quest.objectives.leprePokes)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${leprePokesComplete ? '#28a745' : deptColors.light};height:100%;width:${leprePokesPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.lepreShopPurchases) {
      const lepreShopCount = progress.lepreShopPurchases || new Decimal(0);
      const lepreShopComplete = DecimalUtils.isDecimal(lepreShopCount) ? lepreShopCount.gte(quest.objectives.lepreShopPurchases) : lepreShopCount >= quest.objectives.lepreShopPurchases;
      const lepreShopPercent = lepreShopComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(lepreShopCount) ? lepreShopCount.div(quest.objectives.lepreShopPurchases).mul(100).toNumber() : (lepreShopCount / quest.objectives.lepreShopPurchases) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Purchase Tokens from Lepre</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${lepreShopComplete ? '✓' : `${DecimalUtils.formatDecimal(lepreShopCount)}/${DecimalUtils.formatDecimal(quest.objectives.lepreShopPurchases)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${lepreShopComplete ? '#28a745' : deptColors.light};height:100%;width:${lepreShopPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.fluffCollected) {
      const fluffCollectedCount = progress.fluffCollected || new Decimal(0);
      const fluffCollectedComplete = DecimalUtils.isDecimal(fluffCollectedCount) ? fluffCollectedCount.gte(quest.objectives.fluffCollected) : fluffCollectedCount >= quest.objectives.fluffCollected;
      const fluffCollectedPercent = fluffCollectedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(fluffCollectedCount) ? fluffCollectedCount.div(quest.objectives.fluffCollected).mul(100).toNumber() : (fluffCollectedCount / quest.objectives.fluffCollected) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Collect Fluff</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${fluffCollectedComplete ? '✓' : `${DecimalUtils.formatDecimal(fluffCollectedCount)}/${DecimalUtils.formatDecimal(quest.objectives.fluffCollected)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${fluffCollectedComplete ? '#28a745' : deptColors.light};height:100%;width:${fluffCollectedPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    progressBars = progressItems.join('');
  }
  
  // Check if quest is ready to turn in
  let isReadyToTurnIn = false;
  if (quest.objectives) {
    let allObjectivesMet = true;
    let hasAnyObjectives = false;
    
    if (quest.objectives.fluff) {
      hasAnyObjectives = true;
      const fluffGained = (progress && progress.fluffCollected) || new Decimal(0);
      if (!fluffGained.gte(quest.objectives.fluff)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.swaria) {
      hasAnyObjectives = true;
      const swariaGained = (progress && progress.swariaCollected) || new Decimal(0);
      if (!swariaGained.gte(quest.objectives.swaria)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.tokens) {
      hasAnyObjectives = true;
      const questTokenCount = (progress && progress.tokensCollectedDuringQuest) || 0;
      if (questTokenCount < quest.objectives.tokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.commonBoxes) {
      hasAnyObjectives = true;
      const commonBoxesProduced = (progress && progress.commonBoxesProduced) || 0;
      if (commonBoxesProduced < quest.objectives.commonBoxes) {
        allObjectivesMet = false;
      }
    }
    
    // KitoFox Challenge objective checks
    if (quest.objectives.berryTokens) {
      hasAnyObjectives = true;
      const berryTokenCount = (progress && progress.berryTokens) || new Decimal(0);
      if (!DecimalUtils.isDecimal(berryTokenCount) || !berryTokenCount.gte(quest.objectives.berryTokens)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.stardustTokens) {
      hasAnyObjectives = true;
      const stardustTokenCount = (progress && progress.stardustTokens) || new Decimal(0);
      if (!DecimalUtils.isDecimal(stardustTokenCount) || !stardustTokenCount.gte(quest.objectives.stardustTokens)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.berryPlates) {
      hasAnyObjectives = true;
      const berryPlateCount = (progress && progress.berryPlates) || new Decimal(0);
      if (!DecimalUtils.isDecimal(berryPlateCount) || !berryPlateCount.gte(quest.objectives.berryPlates)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.mushroomSoups) {
      hasAnyObjectives = true;
      const mushroomSoupCount = (progress && progress.mushroomSoups) || new Decimal(0);
      if (!DecimalUtils.isDecimal(mushroomSoupCount) || !mushroomSoupCount.gte(quest.objectives.mushroomSoups)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.prismClicks) {
      hasAnyObjectives = true;
      const prismClickCount = (progress && progress.prismClicks) || new Decimal(0);
      if (!DecimalUtils.isDecimal(prismClickCount) || !prismClickCount.gte(quest.objectives.prismClicks)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.commonBoxesClicks) {
      hasAnyObjectives = true;
      const commonBoxesClickCount = (progress && progress.commonBoxesClicks) || new Decimal(0);
      if (!DecimalUtils.isDecimal(commonBoxesClickCount) || !commonBoxesClickCount.gte(quest.objectives.commonBoxesClicks)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.flowersWatered) {
      hasAnyObjectives = true;
      const flowersWateredCount = (progress && progress.flowersWatered) || new Decimal(0);
      if (!DecimalUtils.isDecimal(flowersWateredCount) || !flowersWateredCount.gte(quest.objectives.flowersWatered)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.powerRefills) {
      hasAnyObjectives = true;
      const powerRefillCount = (progress && progress.powerRefills) || new Decimal(0);
      if (!DecimalUtils.isDecimal(powerRefillCount) || !powerRefillCount.gte(quest.objectives.powerRefills)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.soapPokes) {
      hasAnyObjectives = true;
      const soapPokeCount = (progress && progress.soapPokes) || new Decimal(0);
      if (!DecimalUtils.isDecimal(soapPokeCount) || !soapPokeCount.gte(quest.objectives.soapPokes)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.ingredientsCooked) {
      hasAnyObjectives = true;
      const ingredientsCookedCount = (progress && progress.ingredientsCooked) || new Decimal(0);
      if (!DecimalUtils.isDecimal(ingredientsCookedCount) || !ingredientsCookedCount.gte(quest.objectives.ingredientsCooked)) {
        allObjectivesMet = false;
      }
    }
    
    // KitoFox Challenge 2 specific objective checks
    if (quest.objectives.friendshipLevels) {
      hasAnyObjectives = true;
      const friendshipLevelCount = (progress && progress.friendshipLevels) || new Decimal(0);
      if (!DecimalUtils.isDecimal(friendshipLevelCount) || !friendshipLevelCount.gte(quest.objectives.friendshipLevels)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.petalTokens) {
      hasAnyObjectives = true;
      const petalTokenCount = (progress && progress.petalTokens) || new Decimal(0);
      if (!DecimalUtils.isDecimal(petalTokenCount) || !petalTokenCount.gte(quest.objectives.petalTokens)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.waterTokensNight) {
      hasAnyObjectives = true;
      const waterTokenNightCount = (progress && progress.waterTokensNight) || new Decimal(0);
      if (!DecimalUtils.isDecimal(waterTokenNightCount) || !waterTokenNightCount.gte(quest.objectives.waterTokensNight)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.chargedPrisma) {
      hasAnyObjectives = true;
      const chargedPrismaCount = (progress && progress.chargedPrisma) || new Decimal(0);
      if (!DecimalUtils.isDecimal(chargedPrismaCount) || !chargedPrismaCount.gte(quest.objectives.chargedPrisma)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.anomaliesFixed) {
      hasAnyObjectives = true;
      const anomaliesFixedCount = (progress && progress.anomaliesFixed) || new Decimal(0);
      if (!DecimalUtils.isDecimal(anomaliesFixedCount) || !anomaliesFixedCount.gte(quest.objectives.anomaliesFixed)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.prismClicksNight) {
      hasAnyObjectives = true;
      const prismClickNightCount = (progress && progress.prismClicksNight) || new Decimal(0);
      if (!DecimalUtils.isDecimal(prismClickNightCount) || !prismClickNightCount.gte(quest.objectives.prismClicksNight)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.flowersClicked) {
      hasAnyObjectives = true;
      const flowersClickedCount = (progress && progress.flowersClicked) || new Decimal(0);
      if (!DecimalUtils.isDecimal(flowersClickedCount) || !flowersClickedCount.gte(quest.objectives.flowersClicked)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.fluzzerPokes) {
      hasAnyObjectives = true;
      const fluzzerPokeCount = (progress && progress.fluzzerPokes) || new Decimal(0);
      if (!DecimalUtils.isDecimal(fluzzerPokeCount) || !fluzzerPokeCount.gte(quest.objectives.fluzzerPokes)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.leprePokes) {
      hasAnyObjectives = true;
      const leprePokeCount = (progress && progress.leprePokes) || new Decimal(0);
      if (!DecimalUtils.isDecimal(leprePokeCount) || !leprePokeCount.gte(quest.objectives.leprePokes)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.lepreShopPurchases) {
      hasAnyObjectives = true;
      const lepreShopPurchaseCount = (progress && progress.lepreShopPurchases) || new Decimal(0);
      if (!DecimalUtils.isDecimal(lepreShopPurchaseCount) || !lepreShopPurchaseCount.gte(quest.objectives.lepreShopPurchases)) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.fluffCollected) {
      hasAnyObjectives = true;
      const fluffCollectedCount = (progress && progress.fluffCollected) || new Decimal(0);
      if (!DecimalUtils.isDecimal(fluffCollectedCount) || !fluffCollectedCount.gte(quest.objectives.fluffCollected)) {
        allObjectivesMet = false;
      }
    }
    
    isReadyToTurnIn = hasAnyObjectives && allObjectivesMet;
  }
  
  const glowStyle = isReadyToTurnIn ? 'box-shadow:0 0 15px #28a745;border:2px solid #28a745;' : 'box-shadow:0 2px 8px rgba(0,0,0,0.2);';
  
  // Create the pinned quest element
  const pinnedElement = document.createElement('div');
  pinnedElement.id = `pinnedQuest_${questId}`;
  pinnedElement.className = 'pinned-quest';
  pinnedElement.innerHTML = `
    <div class="quest-drag-handle" style="background:${deptColors.background};padding:0.6em;border-radius:8px;${glowStyle}min-width:240px;max-width:300px;position:relative;user-select:none;cursor:move;">
      <button onclick="toggleQuestPin('${questId}')" style="position:absolute;top:4px;right:4px;background:rgba(255,0,0,0.8);border:none;border-radius:4px;width:20px;height:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px;color:white;font-weight:bold;z-index:10;" title="Unpin quest">
        ×
      </button>
      <div style="font-weight:bold;color:${deptColors.text};font-size:0.9em;margin-bottom:0.3em;padding-right:24px;padding-top:4px;">${quest.title}${isReadyToTurnIn ? ' ✓' : ''}</div>
      <div style="color:${deptColors.text};opacity:0.9;font-size:0.75em;margin-bottom:0.4em;">${quest.description}</div>
      ${progressBars}
      ${isReadyToTurnIn ? `<div style="color:#28a745;font-weight:bold;font-size:0.8em;margin-top:0.4em;">Ready to turn in!</div>` : ''}
    </div>
  `;
  
  // Style the pinned quest container
  pinnedElement.style.cssText = `
    position: fixed;
    top: 100px;
    left: 100px;
    z-index: 1000;
    pointer-events: auto;
  `;
  
  document.body.appendChild(pinnedElement);
  makeDraggable(pinnedElement);
}

// Remove a pinned quest UI element
function removePinnedQuestUI(questId) {
  const pinnedElement = document.getElementById(`pinnedQuest_${questId}`);
  if (pinnedElement) {
    pinnedElement.remove();
  }
}

// Make an element draggable
function makeDraggable(element) {
  const dragHandle = element.querySelector('.quest-drag-handle');
  if (!dragHandle) return;
  
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  function startDrag(clientX, clientY, target) {
    // Don't start dragging if clicking on the close button
    if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
      return false;
    }
    
    isDragging = true;
    startX = clientX;
    startY = clientY;
    initialX = element.offsetLeft;
    initialY = element.offsetTop;
    
    // Mark element as being dragged
    element.setAttribute('data-dragging', 'true');
    
    element.style.zIndex = '1001';
    dragHandle.style.opacity = '0.8';
    return true;
  }
  
  function doDrag(clientX, clientY) {
    if (!isDragging) return;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    let newX = initialX + dx;
    let newY = initialY + dy;
    
    // Keep within viewport bounds
    newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
    newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));
    
    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
  }
  
  function endDrag() {
    if (isDragging) {
      isDragging = false;
      
      // Remove dragging marker
      element.removeAttribute('data-dragging');
      
      element.style.zIndex = '1000';
      dragHandle.style.opacity = '1';
    }
  }
  
  // Mouse events
  dragHandle.addEventListener('mousedown', (e) => {
    if (startDrag(e.clientX, e.clientY, e.target)) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('mousemove', (e) => {
    doDrag(e.clientX, e.clientY);
    if (isDragging) e.preventDefault();
  });
  
  document.addEventListener('mouseup', endDrag);
  
  // Touch events
  dragHandle.addEventListener('touchstart', (e) => {
    if (startDrag(e.touches[0].clientX, e.touches[0].clientY, e.target)) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    doDrag(e.touches[0].clientX, e.touches[0].clientY);
    if (isDragging) e.preventDefault();
  });
  
  document.addEventListener('touchend', endDrag);
}

// Update all pinned quests
function updatePinnedQuests() {
  if (!window.state.questSystem.pinnedQuests) return;
  
  window.state.questSystem.pinnedQuests.forEach(questId => {
    const pinnedElement = document.getElementById(`pinnedQuest_${questId}`);
    if (pinnedElement) {
      // Skip update if quest is currently being dragged
      if (pinnedElement.hasAttribute('data-dragging')) {
        return;
      }
      
      // Remove and recreate to update progress
      const position = {
        left: pinnedElement.offsetLeft,
        top: pinnedElement.offsetTop
      };
      removePinnedQuestUI(questId);
      createPinnedQuestUI(questId);
      
      // Restore position
      const newElement = document.getElementById(`pinnedQuest_${questId}`);
      if (newElement) {
        newElement.style.left = position.left + 'px';
        newElement.style.top = position.top + 'px';
      }
    }
  });
}

// Clean up pinned quest state on page load if no pinned UI elements exist
function cleanupPinnedQuestsOnLoad() {
  if (!window.state.questSystem.pinnedQuests || window.state.questSystem.pinnedQuests.length === 0) {
    return; // No pinned quests to check
  }
  
  // Check if any pinned quest UI elements actually exist on the page
  const pinnedQuestsToRemove = [];
  
  window.state.questSystem.pinnedQuests.forEach(questId => {
    const pinnedElement = document.getElementById(`pinnedQuest_${questId}`);
    if (!pinnedElement) {
      // Pinned quest UI doesn't exist, mark for removal from state
      pinnedQuestsToRemove.push(questId);
    }
  });
  
  // Remove quests that don't have UI elements
  if (pinnedQuestsToRemove.length > 0) {
    window.state.questSystem.pinnedQuests = window.state.questSystem.pinnedQuests.filter(
      questId => !pinnedQuestsToRemove.includes(questId)
    );
  }
}




// Update quest modal content
function updateQuestModal() {
  const questContent = document.getElementById('questContent');
  if (!questContent || !window.state || !window.state.questSystem) return;
  
  const activeQuests = window.state.questSystem.activeQuests.map(id => questDefinitions[id]).filter(Boolean);
  const completedQuests = window.state.questSystem.completedQuests.map(id => questDefinitions[id]).filter(Boolean);
  const claimableCount = window.state.questSystem.claimableQuests.length;
  
  questContent.innerHTML = `
    <div style="text-align:center;color:#666;font-size:1.1em;padding:2em;">
      ${activeQuests.length === 0 && completedQuests.length === 0 && claimableCount > 0 ? `
        <div style="color:#999;font-style:italic;font-size:1.2em;padding:3em;">
          No quests yet :(
        </div>
      ` : ''}
      

      
      ${activeQuests.length > 0 ? `
        <div style="display:flex;flex-direction:row;gap:0;margin-bottom:1em;width:max-content;">
          ${activeQuests.map(quest => {
            const progress = window.state.questSystem.questProgress && window.state.questSystem.questProgress[quest.id];
            const deptColors = getDepartmentColors(quest.department);
            let progressBars = '';
            
            if (quest.objectives && progress) {
              const progressItems = [];
              
              if (quest.objectives.fluff) {
                const fluffGained = progress.fluffCollected || new Decimal(0);
                const fluffComplete = fluffGained.gte(quest.objectives.fluff);
                const fluffPercent = fluffComplete ? 100 : Math.min(100, fluffGained.div(quest.objectives.fluff).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Fluff Gained</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${fluffComplete ? '✓' : `${DecimalUtils.formatDecimal(fluffGained)}/${DecimalUtils.formatDecimal(quest.objectives.fluff)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${fluffComplete ? '#28a745' : deptColors.light};height:100%;width:${fluffPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.swaria) {
                const swariaGained = progress.swariaCollected || new Decimal(0);
                const swariaComplete = swariaGained.gte(quest.objectives.swaria);
                const swariaPercent = swariaComplete ? 100 : Math.min(100, swariaGained.div(quest.objectives.swaria).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Swaria Coins</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${swariaComplete ? '✓' : `${DecimalUtils.formatDecimal(swariaGained)}/${DecimalUtils.formatDecimal(quest.objectives.swaria)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${swariaComplete ? '#28a745' : deptColors.light};height:100%;width:${swariaPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.tokens) {
                const questTokenCount = progress.tokensCollectedDuringQuest || 0;
                const tokensComplete = questTokenCount >= quest.objectives.tokens;
                const tokenPercent = Math.min(100, (questTokenCount / quest.objectives.tokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Tokens Collected</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${tokensComplete ? '✓' : `${questTokenCount}/${quest.objectives.tokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${tokensComplete ? '#28a745' : deptColors.light};height:100%;width:${tokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.commonBoxes) {
                const commonBoxesProduced = progress.commonBoxesProduced || 0;
                const commonBoxesComplete = commonBoxesProduced >= quest.objectives.commonBoxes;
                const commonBoxPercent = Math.min(100, (commonBoxesProduced / quest.objectives.commonBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Common Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${commonBoxesComplete ? '✓' : `${commonBoxesProduced}/${quest.objectives.commonBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${commonBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${commonBoxPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              // KitoFox Challenge specific objectives
              if (quest.objectives.berryTokens) {
                const berryTokenCount = progress.berryTokens || new Decimal(0);
                const berryTokensComplete = DecimalUtils.isDecimal(berryTokenCount) ? berryTokenCount.gte(quest.objectives.berryTokens) : berryTokenCount >= quest.objectives.berryTokens;
                const berryTokenPercent = berryTokensComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(berryTokenCount) ? berryTokenCount.div(quest.objectives.berryTokens).mul(100).toNumber() : (berryTokenCount / quest.objectives.berryTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Berry Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${berryTokensComplete ? '✓' : `${DecimalUtils.formatDecimal(berryTokenCount)}/${DecimalUtils.formatDecimal(quest.objectives.berryTokens)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${berryTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${berryTokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.stardustTokens) {
                const stardustTokenCount = progress.stardustTokens || new Decimal(0);
                const stardustTokensComplete = DecimalUtils.isDecimal(stardustTokenCount) ? stardustTokenCount.gte(quest.objectives.stardustTokens) : stardustTokenCount >= quest.objectives.stardustTokens;
                const stardustTokenPercent = stardustTokensComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(stardustTokenCount) ? stardustTokenCount.div(quest.objectives.stardustTokens).mul(100).toNumber() : (stardustTokenCount / quest.objectives.stardustTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Stardust Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${stardustTokensComplete ? '✓' : `${DecimalUtils.formatDecimal(stardustTokenCount)}/${DecimalUtils.formatDecimal(quest.objectives.stardustTokens)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${stardustTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${stardustTokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.berryPlates) {
                const berryPlateCount = progress.berryPlates || new Decimal(0);
                const berryPlatesComplete = DecimalUtils.isDecimal(berryPlateCount) ? berryPlateCount.gte(quest.objectives.berryPlates) : berryPlateCount >= quest.objectives.berryPlates;
                const berryPlatePercent = berryPlatesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(berryPlateCount) ? berryPlateCount.div(quest.objectives.berryPlates).mul(100).toNumber() : (berryPlateCount / quest.objectives.berryPlates) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Berry Plates</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${berryPlatesComplete ? '✓' : `${DecimalUtils.formatDecimal(berryPlateCount)}/${DecimalUtils.formatDecimal(quest.objectives.berryPlates)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${berryPlatesComplete ? '#28a745' : deptColors.light};height:100%;width:${berryPlatePercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.mushroomSoups) {
                const mushroomSoupCount = progress.mushroomSoups || new Decimal(0);
                const mushroomSoupsComplete = DecimalUtils.isDecimal(mushroomSoupCount) ? mushroomSoupCount.gte(quest.objectives.mushroomSoups) : mushroomSoupCount >= quest.objectives.mushroomSoups;
                const mushroomSoupPercent = mushroomSoupsComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(mushroomSoupCount) ? mushroomSoupCount.div(quest.objectives.mushroomSoups).mul(100).toNumber() : (mushroomSoupCount / quest.objectives.mushroomSoups) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Mushroom Soups</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${mushroomSoupsComplete ? '✓' : `${DecimalUtils.formatDecimal(mushroomSoupCount)}/${DecimalUtils.formatDecimal(quest.objectives.mushroomSoups)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${mushroomSoupsComplete ? '#28a745' : deptColors.light};height:100%;width:${mushroomSoupPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.prismClicks) {
                const prismClickCount = progress.prismClicks || new Decimal(0);
                const prismClicksComplete = DecimalUtils.isDecimal(prismClickCount) ? prismClickCount.gte(quest.objectives.prismClicks) : prismClickCount >= quest.objectives.prismClicks;
                const prismClickPercent = prismClicksComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(prismClickCount) ? prismClickCount.div(quest.objectives.prismClicks).mul(100).toNumber() : (prismClickCount / quest.objectives.prismClicks) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Prism Tiles</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismClicksComplete ? '✓' : `${DecimalUtils.formatDecimal(prismClickCount)}/${DecimalUtils.formatDecimal(quest.objectives.prismClicks)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismClicksComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClickPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.flowersWatered) {
                const flowersWateredCount = progress.flowersWatered || new Decimal(0);
                const flowersWateredComplete = DecimalUtils.isDecimal(flowersWateredCount) ? flowersWateredCount.gte(quest.objectives.flowersWatered) : flowersWateredCount >= quest.objectives.flowersWatered;
                const flowersWateredPercent = flowersWateredComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(flowersWateredCount) ? flowersWateredCount.div(quest.objectives.flowersWatered).mul(100).toNumber() : (flowersWateredCount / quest.objectives.flowersWatered) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Water Flowers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${flowersWateredComplete ? '✓' : `${DecimalUtils.formatDecimal(flowersWateredCount)}/${DecimalUtils.formatDecimal(quest.objectives.flowersWatered)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${flowersWateredComplete ? '#28a745' : deptColors.light};height:100%;width:${flowersWateredPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.powerRefills) {
                const powerRefillCount = progress.powerRefills || new Decimal(0);
                const powerRefillsComplete = DecimalUtils.isDecimal(powerRefillCount) ? powerRefillCount.gte(quest.objectives.powerRefills) : powerRefillCount >= quest.objectives.powerRefills;
                const powerRefillPercent = powerRefillsComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(powerRefillCount) ? powerRefillCount.div(quest.objectives.powerRefills).mul(100).toNumber() : (powerRefillCount / quest.objectives.powerRefills) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Refill Power</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${powerRefillsComplete ? '✓' : `${DecimalUtils.formatDecimal(powerRefillCount)}/${DecimalUtils.formatDecimal(quest.objectives.powerRefills)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${powerRefillsComplete ? '#28a745' : deptColors.light};height:100%;width:${powerRefillPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.soapPokes) {
                const soapPokeCount = progress.soapPokes || new Decimal(0);
                const soapPokesComplete = DecimalUtils.isDecimal(soapPokeCount) ? soapPokeCount.gte(quest.objectives.soapPokes) : soapPokeCount >= quest.objectives.soapPokes;
                const soapPokePercent = soapPokesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(soapPokeCount) ? soapPokeCount.div(quest.objectives.soapPokes).mul(100).toNumber() : (soapPokeCount / quest.objectives.soapPokes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Poke Soap</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${soapPokesComplete ? '✓' : `${DecimalUtils.formatDecimal(soapPokeCount)}/${DecimalUtils.formatDecimal(quest.objectives.soapPokes)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${soapPokesComplete ? '#28a745' : deptColors.light};height:100%;width:${soapPokePercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.ingredientsCooked) {
                const ingredientsCookedCount = progress.ingredientsCooked || new Decimal(0);
                const ingredientsCookedComplete = DecimalUtils.isDecimal(ingredientsCookedCount) ? ingredientsCookedCount.gte(quest.objectives.ingredientsCooked) : ingredientsCookedCount >= quest.objectives.ingredientsCooked;
                const ingredientsCookedPercent = ingredientsCookedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(ingredientsCookedCount) ? ingredientsCookedCount.div(quest.objectives.ingredientsCooked).mul(100).toNumber() : (ingredientsCookedCount / quest.objectives.ingredientsCooked) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Ingredients</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${ingredientsCookedComplete ? '✓' : `${DecimalUtils.formatDecimal(ingredientsCookedCount)}/${DecimalUtils.formatDecimal(quest.objectives.ingredientsCooked)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${ingredientsCookedComplete ? '#28a745' : deptColors.light};height:100%;width:${ingredientsCookedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              // KitoFox Challenge 2 specific objectives
              if (quest.objectives.friendshipLevels) {
                const friendshipCount = progress.friendshipLevels || new Decimal(0);
                const friendshipComplete = DecimalUtils.isDecimal(friendshipCount) ? friendshipCount.gte(quest.objectives.friendshipLevels) : friendshipCount >= quest.objectives.friendshipLevels;
                const friendshipPercent = friendshipComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(friendshipCount) ? friendshipCount.div(quest.objectives.friendshipLevels).mul(100).toNumber() : (friendshipCount / quest.objectives.friendshipLevels) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Characters at Friendship Lvl 15</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${friendshipComplete ? '✓' : `${DecimalUtils.formatDecimal(friendshipCount)}/${DecimalUtils.formatDecimal(quest.objectives.friendshipLevels)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${friendshipComplete ? '#28a745' : deptColors.light};height:100%;width:${friendshipPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.petalTokens) {
                const petalTokenCount = progress.petalTokens || new Decimal(0);
                const petalTokensComplete = DecimalUtils.isDecimal(petalTokenCount) ? petalTokenCount.gte(quest.objectives.petalTokens) : petalTokenCount >= quest.objectives.petalTokens;
                const petalTokenPercent = petalTokensComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(petalTokenCount) ? petalTokenCount.div(quest.objectives.petalTokens).mul(100).toNumber() : (petalTokenCount / quest.objectives.petalTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Petal Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${petalTokensComplete ? '✓' : `${DecimalUtils.formatDecimal(petalTokenCount)}/${DecimalUtils.formatDecimal(quest.objectives.petalTokens)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${petalTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${petalTokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.waterTokensNight) {
                const waterTokensNightCount = progress.waterTokensNight || new Decimal(0);
                const waterTokensNightComplete = DecimalUtils.isDecimal(waterTokensNightCount) ? waterTokensNightCount.gte(quest.objectives.waterTokensNight) : waterTokensNightCount >= quest.objectives.waterTokensNight;
                const waterTokensNightPercent = waterTokensNightComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(waterTokensNightCount) ? waterTokensNightCount.div(quest.objectives.waterTokensNight).mul(100).toNumber() : (waterTokensNightCount / quest.objectives.waterTokensNight) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Water Tokens (Night)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${waterTokensNightComplete ? '✓' : `${DecimalUtils.formatDecimal(waterTokensNightCount)}/${DecimalUtils.formatDecimal(quest.objectives.waterTokensNight)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${waterTokensNightComplete ? '#28a745' : deptColors.light};height:100%;width:${waterTokensNightPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.chargedPrisma) {
                const chargedPrismaCount = progress.chargedPrisma || new Decimal(0);
                const chargedPrismaComplete = DecimalUtils.isDecimal(chargedPrismaCount) ? chargedPrismaCount.gte(quest.objectives.chargedPrisma) : chargedPrismaCount >= quest.objectives.chargedPrisma;
                const chargedPrismaPercent = chargedPrismaComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(chargedPrismaCount) ? chargedPrismaCount.div(quest.objectives.chargedPrisma).mul(100).toNumber() : (chargedPrismaCount / quest.objectives.chargedPrisma) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Charged Prisma</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${chargedPrismaComplete ? '✓' : `${DecimalUtils.formatDecimal(chargedPrismaCount)}/${DecimalUtils.formatDecimal(quest.objectives.chargedPrisma)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${chargedPrismaComplete ? '#28a745' : deptColors.light};height:100%;width:${chargedPrismaPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.anomaliesFixed) {
                const anomaliesFixedCount = progress.anomaliesFixed || new Decimal(0);
                const anomaliesFixedComplete = DecimalUtils.isDecimal(anomaliesFixedCount) ? anomaliesFixedCount.gte(quest.objectives.anomaliesFixed) : anomaliesFixedCount >= quest.objectives.anomaliesFixed;
                const anomaliesFixedPercent = anomaliesFixedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(anomaliesFixedCount) ? anomaliesFixedCount.div(quest.objectives.anomaliesFixed).mul(100).toNumber() : (anomaliesFixedCount / quest.objectives.anomaliesFixed) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Fix Anomalies</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${anomaliesFixedComplete ? '✓' : `${DecimalUtils.formatDecimal(anomaliesFixedCount)}/${DecimalUtils.formatDecimal(quest.objectives.anomaliesFixed)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${anomaliesFixedComplete ? '#28a745' : deptColors.light};height:100%;width:${anomaliesFixedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.prismClicksNight) {
                const prismClicksNightCount = progress.prismClicksNight || new Decimal(0);
                const prismClicksNightComplete = DecimalUtils.isDecimal(prismClicksNightCount) ? prismClicksNightCount.gte(quest.objectives.prismClicksNight) : prismClicksNightCount >= quest.objectives.prismClicksNight;
                const prismClicksNightPercent = prismClicksNightComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(prismClicksNightCount) ? prismClicksNightCount.div(quest.objectives.prismClicksNight).mul(100).toNumber() : (prismClicksNightCount / quest.objectives.prismClicksNight) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Prism Tiles (Night)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismClicksNightComplete ? '✓' : `${DecimalUtils.formatDecimal(prismClicksNightCount)}/${DecimalUtils.formatDecimal(quest.objectives.prismClicksNight)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismClicksNightComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClicksNightPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.flowersClicked) {
                const flowersClickedCount = progress.flowersClicked || new Decimal(0);
                const flowersClickedComplete = DecimalUtils.isDecimal(flowersClickedCount) ? flowersClickedCount.gte(quest.objectives.flowersClicked) : flowersClickedCount >= quest.objectives.flowersClicked;
                const flowersClickedPercent = flowersClickedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(flowersClickedCount) ? flowersClickedCount.div(quest.objectives.flowersClicked).mul(100).toNumber() : (flowersClickedCount / quest.objectives.flowersClicked) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Flowers (Pollen Collector)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${flowersClickedComplete ? '✓' : `${DecimalUtils.formatDecimal(flowersClickedCount)}/${DecimalUtils.formatDecimal(quest.objectives.flowersClicked)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${flowersClickedComplete ? '#28a745' : deptColors.light};height:100%;width:${flowersClickedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.fluzzerPokes) {
                const fluzzerPokesCount = progress.fluzzerPokes || new Decimal(0);
                const fluzzerPokesComplete = DecimalUtils.isDecimal(fluzzerPokesCount) ? fluzzerPokesCount.gte(quest.objectives.fluzzerPokes) : fluzzerPokesCount >= quest.objectives.fluzzerPokes;
                const fluzzerPokesPercent = fluzzerPokesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(fluzzerPokesCount) ? fluzzerPokesCount.div(quest.objectives.fluzzerPokes).mul(100).toNumber() : (fluzzerPokesCount / quest.objectives.fluzzerPokes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Poke Fluzzer</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${fluzzerPokesComplete ? '✓' : `${DecimalUtils.formatDecimal(fluzzerPokesCount)}/${DecimalUtils.formatDecimal(quest.objectives.fluzzerPokes)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${fluzzerPokesComplete ? '#28a745' : deptColors.light};height:100%;width:${fluzzerPokesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.leprePokes) {
                const leprePokesCount = progress.leprePokes || new Decimal(0);
                const leprePokesComplete = DecimalUtils.isDecimal(leprePokesCount) ? leprePokesCount.gte(quest.objectives.leprePokes) : leprePokesCount >= quest.objectives.leprePokes;
                const leprePokesPercent = leprePokesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(leprePokesCount) ? leprePokesCount.div(quest.objectives.leprePokes).mul(100).toNumber() : (leprePokesCount / quest.objectives.leprePokes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Poke Lepre</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${leprePokesComplete ? '✓' : `${DecimalUtils.formatDecimal(leprePokesCount)}/${DecimalUtils.formatDecimal(quest.objectives.leprePokes)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${leprePokesComplete ? '#28a745' : deptColors.light};height:100%;width:${leprePokesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.lepreShopPurchases) {
                const lepreShopCount = progress.lepreShopPurchases || new Decimal(0);
                const lepreShopComplete = DecimalUtils.isDecimal(lepreShopCount) ? lepreShopCount.gte(quest.objectives.lepreShopPurchases) : lepreShopCount >= quest.objectives.lepreShopPurchases;
                const lepreShopPercent = lepreShopComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(lepreShopCount) ? lepreShopCount.div(quest.objectives.lepreShopPurchases).mul(100).toNumber() : (lepreShopCount / quest.objectives.lepreShopPurchases) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Purchase Tokens from Lepre</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${lepreShopComplete ? '✓' : `${DecimalUtils.formatDecimal(lepreShopCount)}/${DecimalUtils.formatDecimal(quest.objectives.lepreShopPurchases)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${lepreShopComplete ? '#28a745' : deptColors.light};height:100%;width:${lepreShopPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.fluffCollected) {
                const fluffCollectedCount = progress.fluffCollected || new Decimal(0);
                const fluffCollectedComplete = DecimalUtils.isDecimal(fluffCollectedCount) ? fluffCollectedCount.gte(quest.objectives.fluffCollected) : fluffCollectedCount >= quest.objectives.fluffCollected;
                const fluffCollectedPercent = fluffCollectedComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(fluffCollectedCount) ? fluffCollectedCount.div(quest.objectives.fluffCollected).mul(100).toNumber() : (fluffCollectedCount / quest.objectives.fluffCollected) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Fluff</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${fluffCollectedComplete ? '✓' : `${DecimalUtils.formatDecimal(fluffCollectedCount)}/${DecimalUtils.formatDecimal(quest.objectives.fluffCollected)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${fluffCollectedComplete ? '#28a745' : deptColors.light};height:100%;width:${fluffCollectedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.commonBoxesClicks) {
                const commonBoxesClickCount = progress.commonBoxesClicks || new Decimal(0);
                const commonBoxesClicksComplete = DecimalUtils.isDecimal(commonBoxesClickCount) ? commonBoxesClickCount.gte(quest.objectives.commonBoxesClicks) : commonBoxesClickCount >= quest.objectives.commonBoxesClicks;
                const commonBoxesClickPercent = commonBoxesClicksComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(commonBoxesClickCount) ? commonBoxesClickCount.div(quest.objectives.commonBoxesClicks).mul(100).toNumber() : (commonBoxesClickCount / quest.objectives.commonBoxesClicks) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Common Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${commonBoxesClicksComplete ? '✓' : `${DecimalUtils.formatDecimal(commonBoxesClickCount)}/${DecimalUtils.formatDecimal(quest.objectives.commonBoxesClicks)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${commonBoxesClicksComplete ? '#28a745' : deptColors.light};height:100%;width:${commonBoxesClickPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              progressBars = progressItems.join('');
            }
            
            // Check if quest is ready to turn in
            let isReadyToTurnIn = false;
            if (quest.objectives && progress) {
              let allObjectivesMet = true;
              
              if (quest.objectives.fluff) {
                const fluffGained = progress.fluffCollected || new Decimal(0);
                if (!fluffGained.gte(quest.objectives.fluff)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.swaria) {
                const swariaGained = progress.swariaCollected || new Decimal(0);
                if (!swariaGained.gte(quest.objectives.swaria)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.tokens) {
                const questTokenCount = progress.tokensCollectedDuringQuest || 0;
                if (questTokenCount < quest.objectives.tokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.commonBoxes) {
                const commonBoxesProduced = progress.commonBoxesProduced || 0;
                if (commonBoxesProduced < quest.objectives.commonBoxes) {
                  allObjectivesMet = false;
                }
              }
              
              // KitoFox Challenge objective checks
              if (quest.objectives.berryTokens) {
                const berryTokenCount = progress.berryTokens || new Decimal(0);
                if (!DecimalUtils.isDecimal(berryTokenCount) || !berryTokenCount.gte(quest.objectives.berryTokens)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.stardustTokens) {
                const stardustTokenCount = progress.stardustTokens || new Decimal(0);
                if (!DecimalUtils.isDecimal(stardustTokenCount) || !stardustTokenCount.gte(quest.objectives.stardustTokens)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.berryPlates) {
                const berryPlateCount = progress.berryPlates || new Decimal(0);
                if (!DecimalUtils.isDecimal(berryPlateCount) || !berryPlateCount.gte(quest.objectives.berryPlates)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.mushroomSoups) {
                const mushroomSoupCount = progress.mushroomSoups || new Decimal(0);
                if (!DecimalUtils.isDecimal(mushroomSoupCount) || !mushroomSoupCount.gte(quest.objectives.mushroomSoups)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.prismClicks) {
                const prismClickCount = progress.prismClicks || new Decimal(0);
                if (!DecimalUtils.isDecimal(prismClickCount) || !prismClickCount.gte(quest.objectives.prismClicks)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.commonBoxesClicks) {
                const commonBoxesClickCount = progress.commonBoxesClicks || new Decimal(0);
                if (!DecimalUtils.isDecimal(commonBoxesClickCount) || !commonBoxesClickCount.gte(quest.objectives.commonBoxesClicks)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.flowersWatered) {
                const flowersWateredCount = progress.flowersWatered || new Decimal(0);
                if (!DecimalUtils.isDecimal(flowersWateredCount) || !flowersWateredCount.gte(quest.objectives.flowersWatered)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.powerRefills) {
                const powerRefillCount = progress.powerRefills || new Decimal(0);
                if (!DecimalUtils.isDecimal(powerRefillCount) || !powerRefillCount.gte(quest.objectives.powerRefills)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.soapPokes) {
                const soapPokeCount = progress.soapPokes || new Decimal(0);
                if (!DecimalUtils.isDecimal(soapPokeCount) || !soapPokeCount.gte(quest.objectives.soapPokes)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.ingredientsCooked) {
                const ingredientsCookedCount = progress.ingredientsCooked || new Decimal(0);
                if (!DecimalUtils.isDecimal(ingredientsCookedCount) || !ingredientsCookedCount.gte(quest.objectives.ingredientsCooked)) {
                  allObjectivesMet = false;
                }
              }
              
              // KitoFox Challenge 2 objective checks
              if (quest.objectives.friendshipLevels) {
                const friendshipCount = progress.friendshipLevels || new Decimal(0);
                if (!DecimalUtils.isDecimal(friendshipCount) || !friendshipCount.gte(quest.objectives.friendshipLevels)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.petalTokens) {
                const petalTokenCount = progress.petalTokens || new Decimal(0);
                if (!DecimalUtils.isDecimal(petalTokenCount) || !petalTokenCount.gte(quest.objectives.petalTokens)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.waterTokensNight) {
                const waterTokensNightCount = progress.waterTokensNight || new Decimal(0);
                if (!DecimalUtils.isDecimal(waterTokensNightCount) || !waterTokensNightCount.gte(quest.objectives.waterTokensNight)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.chargedPrisma) {
                const chargedPrismaCount = progress.chargedPrisma || new Decimal(0);
                if (!DecimalUtils.isDecimal(chargedPrismaCount) || !chargedPrismaCount.gte(quest.objectives.chargedPrisma)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.anomaliesFixed) {
                const anomaliesFixedCount = progress.anomaliesFixed || new Decimal(0);
                if (!DecimalUtils.isDecimal(anomaliesFixedCount) || !anomaliesFixedCount.gte(quest.objectives.anomaliesFixed)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.prismClicksNight) {
                const prismClicksNightCount = progress.prismClicksNight || new Decimal(0);
                if (!DecimalUtils.isDecimal(prismClicksNightCount) || !prismClicksNightCount.gte(quest.objectives.prismClicksNight)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.flowersClicked) {
                const flowersClickedCount = progress.flowersClicked || new Decimal(0);
                if (!DecimalUtils.isDecimal(flowersClickedCount) || !flowersClickedCount.gte(quest.objectives.flowersClicked)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.fluzzerPokes) {
                const fluzzerPokesCount = progress.fluzzerPokes || new Decimal(0);
                if (!DecimalUtils.isDecimal(fluzzerPokesCount) || !fluzzerPokesCount.gte(quest.objectives.fluzzerPokes)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.leprePokes) {
                const leprePokesCount = progress.leprePokes || new Decimal(0);
                if (!DecimalUtils.isDecimal(leprePokesCount) || !leprePokesCount.gte(quest.objectives.leprePokes)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.lepreShopPurchases) {
                const lepreShopCount = progress.lepreShopPurchases || new Decimal(0);
                if (!DecimalUtils.isDecimal(lepreShopCount) || !lepreShopCount.gte(quest.objectives.lepreShopPurchases)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.fluffCollected) {
                const fluffCollectedCount = progress.fluffCollected || new Decimal(0);
                if (!DecimalUtils.isDecimal(fluffCollectedCount) || !fluffCollectedCount.gte(quest.objectives.fluffCollected)) {
                  allObjectivesMet = false;
                }
              }
              
              isReadyToTurnIn = allObjectivesMet;
            }
            
            const glowStyle = isReadyToTurnIn ? 'box-shadow:0 0 20px #28a745, 0 2px 8px rgba(0,0,0,0.1);border:2px solid #28a745;' : 'box-shadow:0 2px 8px rgba(0,0,0,0.1);';
            const isPinned = window.state.questSystem.pinnedQuests && window.state.questSystem.pinnedQuests.includes(quest.id);
            const darkenStyle = isPinned ? 'filter:brightness(0.5);' : '';
            
            return `
              <div style="background:${deptColors.background};padding:0.8em;border-radius:8px;margin-right:0.5em;text-align:left;${glowStyle}min-width:280px;max-width:280px;flex-shrink:0;position:relative;${darkenStyle}">
                <button onclick="toggleQuestPin('${quest.id}')" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.1);border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:background 0.2s ease;" title="${isPinned ? 'Unpin quest' : 'Pin quest'}">
                  ${isPinned ? '📌' : '📍'}
                </button>
                <div style="font-weight:bold;color:${deptColors.text};font-size:1em;margin-bottom:0.3em;padding-right:30px;">${quest.title}${isReadyToTurnIn ? ' ✓' : ''}</div>
                <div style="color:${deptColors.text};opacity:0.9;font-size:0.85em;margin-bottom:0.5em;">${quest.description}</div>
                ${progressBars}
                ${isReadyToTurnIn ? `<div style="color:#28a745;font-weight:bold;font-size:0.9em;margin-top:0.5em;">Ready to turn in!</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
      
      ${activeQuests.length === 0 && claimableCount === 0 ? `
        <div style="color:#999;font-style:italic;font-size:1.2em;padding:3em;">
          No quests yet :(
        </div>
      ` : ''}
    </div>
  `;
}



// Debug function to manually check and apply quest glows
function debugQuestSystem() {
  console.log('=== Quest System Debug ===');
  console.log('Quest system initialized:', window.state?.questSystem?.initialized);
  console.log('Claimable quests:', window.state?.questSystem?.claimableQuests);
  console.log('Active quests:', window.state?.questSystem?.activeQuests);
  
  // Check if Soap's character element exists
  const soapElement = document.querySelector('#swariaGeneratorCharacter');
  console.log('Soap character element found:', !!soapElement);
  if (soapElement) {
    console.log('Soap element has quest-available class:', soapElement.classList.contains('quest-available'));
  }
  
  // Force check quest availability
  checkQuestAvailability();
  
  // Force apply glow to Soap if quest is available
  if (window.state?.questSystem?.claimableQuests?.includes('soap_quest_1')) {
    console.log('Forcing glow application for Soap...');
    addCharacterQuestGlow('soap');
  }
}

// Make functions globally accessible
window.initializeQuestSystem = initializeQuestSystem;
window.updateQuestModal = updateQuestModal;
window.debugQuestSystem = debugQuestSystem;
window.checkQuestAvailability = checkQuestAvailability;
window.addCharacterQuestGlow = addCharacterQuestGlow;
window.trackTokenCollection = trackTokenCollection;
window.toggleQuestPin = toggleQuestPin;
window.autoStartKitoFoxChallenge = autoStartKitoFoxChallenge;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeQuestSystem);
} else {
  initializeQuestSystem();
}
