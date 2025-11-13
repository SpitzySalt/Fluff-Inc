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
  
  // Clean up any WIP quests that shouldn't be claimable
  cleanupWipQuests();
  
  // Keep backward compatibility reference
  window.questSystem = window.state.questSystem;
}

// Clean up any incorrectly claimable WIP quests
function cleanupWipQuests() {
  if (!window.state || !window.state.questSystem) return;
  
  // Remove WIP quests from claimable lists
  window.state.questSystem.claimableQuests = window.state.questSystem.claimableQuests.filter(questId => {
    const quest = questDefinitions[questId];
    if (quest && quest.requirements && quest.requirements.wip) {
      console.log(`Removing WIP quest ${questId} from claimable quests`);
      return false;
    }
    return true;
  });
  
  // Also remove from active quests if somehow they got there
  window.state.questSystem.activeQuests = window.state.questSystem.activeQuests.filter(questId => {
    const quest = questDefinitions[questId];
    if (quest && quest.requirements && quest.requirements.wip) {
      console.log(`Removing WIP quest ${questId} from active quests`);
      return false;
    }
    return true;
  });
  
  // Specifically remove soap_quest_6 if it's anywhere it shouldn't be
  ['claimableQuests', 'activeQuests', 'availableQuests'].forEach(listName => {
    if (window.state.questSystem[listName]) {
      const index = window.state.questSystem[listName].indexOf('soap_quest_6');
      if (index !== -1) {
        console.log(`Removing soap_quest_6 from ${listName}`);
        window.state.questSystem[listName].splice(index, 1);
      }
    }
  });
}

// Manual recovery function (you can call this in console if needed)
function forceResetQuestDialogue() {
  resetDialogueState();
}
window.forceResetQuestDialogue = forceResetQuestDialogue;
window.cleanupWipQuests = cleanupWipQuests;

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
    
    // Skip if quest is work in progress
    if (quest.requirements && quest.requirements.wip) {
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
  
  // Ensure tokenValue is a proper Decimal to prevent string concatenation issues
  const tokenAmountDecimal = DecimalUtils.toDecimal(tokenValue);
  const tokenAmount = tokenAmountDecimal.toNumber();
  
  // Increment token counter for all active quests that have token objectives
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    const progress = window.state.questSystem.questProgress[questId];
    
    if (quest && progress && quest.objectives) {
      // Track legacy token objective (ensure proper numeric addition)
      if (quest.objectives.tokens) {
        const currentTokens = Number(progress.tokens || 0);
        progress.tokens = currentTokens + tokenAmount;
      }
      
      // Track collectAnyTokens objective (ensure numeric addition)
      if (quest.objectives.collectAnyTokens !== undefined) {
        const currentCollected = Number(progress.collectAnyTokens || 0);
        progress.collectAnyTokens = currentCollected + tokenAmount;
      }
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

// Function to track prism clicks for active quests
function trackPrismClick(clickValue = 1) {
  if (!window.state || !window.state.questSystem) return;
  
  // Increment global prism click counter
  if (!window.state.prismClicks) {
    window.state.prismClicks = 0;
  }
  window.state.prismClicks += clickValue;
  
  // Track prism tile clicks for active quests (ensure numeric addition)
  if (window.state.questSystem.questProgress) {
    window.state.questSystem.activeQuests.forEach(questId => {
      const progress = window.state.questSystem.questProgress[questId];
      if (!progress) return;
      
      // Track click prism tiles objectives
      if (progress.clickPrismTiles !== undefined) {
        progress.clickPrismTiles = Number(progress.clickPrismTiles || 0) + Number(clickValue);
      }
      
      // Track click prism tiles at night objectives
      if (progress.clickPrismTilesAtNight !== undefined && typeof isNightTime === 'function' && isNightTime()) {
        progress.clickPrismTilesAtNight = Number(progress.clickPrismTilesAtNight || 0) + Number(clickValue);
      }
    });
  }
  
  // Update quest modal if it's currently open (for immediate progress updates)
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track cooking actions for active quests
function trackCookingAction(recipeId, amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track specific cooking objectives (ensure numeric addition)
    if (recipeId === 'batteries' && progress.cookBatteries !== undefined) {
      progress.cookBatteries = Number(progress.cookBatteries || 0) + Number(amount);
    }
    
    // Track battery crafting for lepre quest 4 (batteries recipe)
    if (recipeId === 'batteries' && progress.batteriesCrafted !== undefined) {
      // Use Decimal arithmetic to prevent concatenation issues
      progress.batteriesCrafted = DecimalUtils.isDecimal(progress.batteriesCrafted)
        ? progress.batteriesCrafted.plus(DecimalUtils.toDecimal(amount))
        : DecimalUtils.toDecimal(progress.batteriesCrafted || 0).plus(DecimalUtils.toDecimal(amount));
    }
    
    if (recipeId === 'berryPlate' && progress.cookBerryPlates !== undefined) {
      progress.cookBerryPlates = Number(progress.cookBerryPlates || 0) + Number(amount);
    } else if (recipeId === 'mushroomSoup' && progress.cookMushroomSoup !== undefined) {
      progress.cookMushroomSoup = Number(progress.cookMushroomSoup || 0) + Number(amount);
    } else if (recipeId === 'glitteringPetals' && progress.cookGlitteringPetals !== undefined) {
      progress.cookGlitteringPetals = Number(progress.cookGlitteringPetals || 0) + Number(amount);
    } else if (recipeId === 'chargedPrisma' && progress.cookChargedPrisma !== undefined) {
      progress.cookChargedPrisma = Number(progress.cookChargedPrisma || 0) + Number(amount);
    }
    
    // Track general cooking objectives (ensure numeric addition)
    if (progress.cookAnyIngredients !== undefined) {
      progress.cookAnyIngredients = Number(progress.cookAnyIngredients || 0) + Number(amount);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track box generation for active quests  
function trackBoxGeneration(amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    if (progress.generateBoxes !== undefined) {
      progress.generateBoxes = Number(progress.generateBoxes || 0) + Number(amount);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Box purchase tracking function (with decimal refactoring)
function trackBoxPurchase(boxType) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Check day/night state for night-specific objectives using same logic as nighttime token detection
  const isNightTime = window.daynight && typeof window.daynight.getTime === 'function' && 
                     (() => {
                       const gameMinutes = window.daynight.getTime();
                       const NIGHT_START = 22 * 60; // 22:00 = 1320 minutes
                       const DAY_START = 6 * 60;    // 6:00 = 360 minutes
                       return gameMinutes >= NIGHT_START || gameMinutes < DAY_START;
                     })();
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    const progress = window.state.questSystem.questProgress[questId];
    
    if (quest && progress && quest.objectives) {
      // Track buyBoxes objective (ensure numeric addition)
      if (progress.buyBoxes !== undefined) {
        progress.buyBoxes = Number(progress.buyBoxes || 0) + 1;
      }
      
      // Track buyBoxesAtNight objective (ensure numeric addition)
      if (progress.buyBoxesAtNight !== undefined && isNightTime) {
        progress.buyBoxesAtNight = Number(progress.buyBoxesAtNight || 0) + 1;
      }
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Flower watering tracking function (with decimal refactoring)
function trackFlowerWatering(flowersWatered) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const progress = window.state.questSystem.questProgress[questId];
    
    if (progress && progress.waterFlowers !== undefined) {
      progress.waterFlowers = Number(progress.waterFlowers || 0) + Number(flowersWatered);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Pollen extraction tracking function (with decimal refactoring)
// Flower click tracking function (with decimal refactoring)
function trackFlowerClick() {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const progress = window.state.questSystem.questProgress[questId];
    
    if (progress) {
      // Track general flower clicks
      if (progress.clickFlowersTotal !== undefined) {
        progress.clickFlowersTotal = Number(progress.clickFlowersTotal || 0) + 1;
      }
      
      // Track flower clicks for extractPollen objective (ensure numeric addition)
      if (progress.extractPollen !== undefined) {
        progress.extractPollen = Number(progress.extractPollen || 0) + 1;
      }
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track token collection by type for active quests
function trackSpecificTokenCollection(tokenType, amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track specific token types (ensure numeric addition)
    if (tokenType === 'sparks' && progress.sparksTokens !== undefined) {
      progress.sparksTokens = Number(progress.sparksTokens || 0) + Number(amount);
    } else if (tokenType === 'berries' && progress.berryTokens !== undefined) {
      progress.berryTokens = Number(progress.berryTokens || 0) + Number(amount);
    } else if (tokenType === 'petals' && progress.petalTokens !== undefined) {
      progress.petalTokens = Number(progress.petalTokens || 0) + Number(amount);
    } else if (tokenType === 'prisma' && progress.prismaTokens !== undefined) {
      progress.prismaTokens = Number(progress.prismaTokens || 0) + Number(amount);
    } else if (tokenType === 'stardust' && progress.stardustTokens !== undefined) {
      progress.stardustTokens = Number(progress.stardustTokens || 0) + Number(amount);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track tokens from specific sources for active quests
function trackTokensFromSource(source, amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track tokens from specific sources (ensure numeric addition)
    if (source === 'boxes' && progress.generatorTokensFromBoxes !== undefined) {
      progress.generatorTokensFromBoxes = Number(progress.generatorTokensFromBoxes || 0) + Number(amount);
    } else if (source === 'cargoBoxes' && progress.cargoTokensFromBoxes !== undefined) {
      progress.cargoTokensFromBoxes = Number(progress.cargoTokensFromBoxes || 0) + Number(amount);
    } else if (source === 'prism' && progress.prismClickTokens !== undefined) {
      progress.prismClickTokens = Number(progress.prismClickTokens || 0) + Number(amount);
    } else if (source === 'terrarium' && progress.terrariumRustlingTokens !== undefined) {
      progress.terrariumRustlingTokens = Number(progress.terrariumRustlingTokens || 0) + Number(amount);
    } else if (source === 'night' && progress.nightTimeTokens !== undefined) {
      progress.nightTimeTokens = Number(progress.nightTimeTokens || 0) + Number(amount);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track Lepre shop token purchases for quests
function trackLepreShopPurchase(itemId, amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  // Define premium token IDs (better category tokens)
  const premiumTokenIds = ['berryPlate', 'mushroomSoup', 'glitteringPetals', 'batteries', 'chargedPrisma'];
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track general token purchases (all tokens except unlockable premium items)
    if (quest.objectives.tokensPurchased && progress.tokensPurchased !== undefined && itemId !== 'bijou' && itemId !== 'vrchatMirror') {
      progress.tokensPurchased = DecimalUtils.isDecimal(progress.tokensPurchased) 
        ? progress.tokensPurchased.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.tokensPurchased || 0).plus(amountDecimal);
    }
    
    // Track specific berry token purchases
    if (itemId === 'berries' && quest.objectives.berryTokensPurchased && progress.berryTokensPurchased !== undefined) {
      progress.berryTokensPurchased = DecimalUtils.isDecimal(progress.berryTokensPurchased)
        ? progress.berryTokensPurchased.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.berryTokensPurchased || 0).plus(amountDecimal);
    }
    
    // Track specific water token purchases
    if (itemId === 'water' && quest.objectives.waterTokensPurchased && progress.waterTokensPurchased !== undefined) {
      progress.waterTokensPurchased = DecimalUtils.isDecimal(progress.waterTokensPurchased)
        ? progress.waterTokensPurchased.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.waterTokensPurchased || 0).plus(amountDecimal);
    }
    
    // Track specific premium token purchases (better category tokens)
    if (premiumTokenIds.includes(itemId) && quest.objectives.premiumTokensPurchased && progress.premiumTokensPurchased !== undefined) {
      progress.premiumTokensPurchased = DecimalUtils.isDecimal(progress.premiumTokensPurchased)
        ? progress.premiumTokensPurchased.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.premiumTokensPurchased || 0).plus(amountDecimal);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track free Swa Bucks claims for Lepre quests
function trackLepreFreeBucksClaim() {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track free bucks claims
    if (quest.objectives.freeBucksClaimed && progress.freeBucksClaimed !== undefined) {
      progress.freeBucksClaimed = DecimalUtils.isDecimal(progress.freeBucksClaimed)
        ? progress.freeBucksClaimed.plus(1)
        : DecimalUtils.toDecimal(progress.freeBucksClaimed || 0).plus(1);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track tokens given to workers for Lepre quest 3
function trackTokenGivenToWorker(tokenType, amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track specific token types given to workers
    // Note: tokenType comes from type.name in the inventory system (singular forms)
    if (tokenType === 'berry' && quest.objectives.berriesGiven && progress.berriesGiven !== undefined) {
      progress.berriesGiven = DecimalUtils.isDecimal(progress.berriesGiven)
        ? progress.berriesGiven.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.berriesGiven || 0).plus(amountDecimal);
    }
    
    if (tokenType === 'petal' && quest.objectives.petalsGiven && progress.petalsGiven !== undefined) {
      progress.petalsGiven = DecimalUtils.isDecimal(progress.petalsGiven)
        ? progress.petalsGiven.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.petalsGiven || 0).plus(amountDecimal);
    }
    
    if (tokenType === 'water' && quest.objectives.waterGiven && progress.waterGiven !== undefined) {
      progress.waterGiven = DecimalUtils.isDecimal(progress.waterGiven)
        ? progress.waterGiven.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.waterGiven || 0).plus(amountDecimal);
    }
    
    if (tokenType === 'prisma' && quest.objectives.prismaGiven && progress.prismaGiven !== undefined) {
      progress.prismaGiven = DecimalUtils.isDecimal(progress.prismaGiven)
        ? progress.prismaGiven.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.prismaGiven || 0).plus(amountDecimal);
    }
  });
  
  // Also track total tokens given for lepre_quest_4
  trackTotalTokensGiven(amountDecimal);
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track tokens collected from any department (lepre_quest_4)
function trackTokenCollection(amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track general token collection
    if (quest.objectives.tokensCollected && progress.tokensCollected !== undefined) {
      progress.tokensCollected = DecimalUtils.isDecimal(progress.tokensCollected)
        ? progress.tokensCollected.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.tokensCollected || 0).plus(amountDecimal);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Function to track battery crafting in kitchen (lepre_quest_4)
function trackBatteryCrafted(amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track battery crafting
    if (quest.objectives.batteriesCrafted && progress.batteriesCrafted !== undefined) {
      progress.batteriesCrafted = DecimalUtils.isDecimal(progress.batteriesCrafted)
        ? progress.batteriesCrafted.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.batteriesCrafted || 0).plus(amountDecimal);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Enhanced function to track total tokens given to characters (lepre_quest_4)
function trackTotalTokensGiven(amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track total tokens given (for lepre_quest_4)
    if (quest.objectives.tokensGiven && progress.tokensGiven !== undefined) {
      progress.tokensGiven = DecimalUtils.isDecimal(progress.tokensGiven)
        ? progress.tokensGiven.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.tokensGiven || 0).plus(amountDecimal);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Enhanced function to track premium token purchases from better category (lepre_quest_5)
function trackPremiumTokenPurchase(category, amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track premium token purchases from better category (for lepre_quest_5)
    if (quest.objectives.premiumTokensPurchased && progress.premiumTokensPurchased !== undefined && category === 'better') {
      progress.premiumTokensPurchased = DecimalUtils.isDecimal(progress.premiumTokensPurchased)
        ? progress.premiumTokensPurchased.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.premiumTokensPurchased || 0).plus(amountDecimal);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Enhanced function to track free swa bucks collection (lepre_quest_5)
function trackFreeSwaCollection(amount = 1) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure amount is a proper Decimal to prevent string concatenation issues
  const amountDecimal = DecimalUtils.toDecimal(amount);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track free swa bucks collection (for lepre_quest_5)
    if (quest.objectives.freeSwaCollected && progress.freeSwaCollected !== undefined) {
      progress.freeSwaCollected = DecimalUtils.isDecimal(progress.freeSwaCollected)
        ? progress.freeSwaCollected.plus(amountDecimal)
        : DecimalUtils.toDecimal(progress.freeSwaCollected || 0).plus(amountDecimal);
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
  updatePinnedQuests();
}

// Enhanced function to track power generator challenge personal best (lepre_quest_5)
function trackPowerChallengeRecord(survivalTime) {
  if (!window.state || !window.state.questSystem || !window.state.questSystem.activeQuests) return;
  
  // Ensure survivalTime is a proper Decimal
  const timeDecimal = DecimalUtils.toDecimal(survivalTime);
  
  window.state.questSystem.activeQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (!quest || quest.character !== 'lepre' || !quest.objectives) return;
    
    const progress = window.state.questSystem.questProgress[questId];
    if (!progress) return;
    
    // Track power challenge record (for lepre_quest_5) - only update if new record is better
    if (quest.objectives.powerChallengeRecord && progress.powerChallengeRecord !== undefined) {
      const currentRecord = DecimalUtils.isDecimal(progress.powerChallengeRecord) 
        ? progress.powerChallengeRecord 
        : DecimalUtils.toDecimal(progress.powerChallengeRecord || 0);
      
      // Update if this is a new personal best (higher survival time)
      if (timeDecimal.gt(currentRecord)) {
        progress.powerChallengeRecord = timeDecimal;
      }
    }
  });
  
  // Update quest modal if it's currently open
  const questModal = document.getElementById('questModal');
  if (questModal && questModal.style.display === 'flex') {
    updateQuestModal();
  }
  
  // Update pinned quests for immediate progress updates
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

// Debug function specifically for lepre quest 3 token tracking
function debugLepreQuest3() {
  console.log('=== LEPRE QUEST 3 DEBUG ===');
  console.log('Active Quests:', window.state?.questSystem?.activeQuests);
  console.log('lepre_quest_3 is active:', window.state?.questSystem?.activeQuests?.includes('lepre_quest_3'));
  
  if (window.state?.questSystem?.questProgress?.lepre_quest_3) {
    const progress = window.state.questSystem.questProgress.lepre_quest_3;
    console.log('lepre_quest_3 Progress:');
    console.log('  berriesGiven:', progress.berriesGiven?.toString() || progress.berriesGiven);
    console.log('  petalsGiven:', progress.petalsGiven?.toString() || progress.petalsGiven);
    console.log('  waterGiven:', progress.waterGiven?.toString() || progress.waterGiven);
    console.log('  prismaGiven:', progress.prismaGiven?.toString() || progress.prismaGiven);
    console.log('  tokensPurchased:', progress.tokensPurchased?.toString() || progress.tokensPurchased);
    console.log('  readyToTurnIn:', progress.readyToTurnIn);
  } else {
    console.log('lepre_quest_3 progress not found');
  }
  
  if (questDefinitions.lepre_quest_3) {
    const objectives = questDefinitions.lepre_quest_3.objectives;
    console.log('lepre_quest_3 Objectives:');
    console.log('  berriesGiven required:', objectives.berriesGiven?.toString());
    console.log('  petalsGiven required:', objectives.petalsGiven?.toString());
    console.log('  waterGiven required:', objectives.waterGiven?.toString());
    console.log('  prismaGiven required:', objectives.prismaGiven?.toString());
    console.log('  tokensPurchased required:', objectives.tokensPurchased?.toString());
  }
}
window.debugQuestState = debugQuestState;
window.debugLepreQuest3 = debugLepreQuest3;

// Test tracking function for debugging lepre quest 3
function testTrackTokenGiving() {
  console.log('=== TESTING TOKEN TRACKING ===');
  console.log('Calling trackTokenGivenToWorker with berries, 1');
  trackTokenGivenToWorker('berries', 1);
  console.log('After tracking berries:');
  debugLepreQuest3();
  
  console.log('Calling trackTokenGivenToWorker with petals, 1');
  trackTokenGivenToWorker('petals', 1);
  console.log('After tracking petals:');
  debugLepreQuest3();
}
window.testTrackTokenGiving = testTrackTokenGiving;

// Fix function for lepre quest 3 to ensure proper initialization and tracking
function fixLepreQuest3() {
  console.log('=== FIXING LEPRE QUEST 3 ===');
  
  // Initialize quest system if needed
  if (!window.state.questSystem) {
    window.state.questSystem = {
      activeQuests: [],
      completedQuests: [],
      claimableQuests: [],
      questProgress: {},
      initialized: true
    };
  }
  
  // Make sure lepre_quest_3 is active
  if (!window.state.questSystem.activeQuests.includes('lepre_quest_3')) {
    window.state.questSystem.activeQuests.push('lepre_quest_3');
    console.log('Added lepre_quest_3 to active quests');
  }
  
  // Initialize/reset progress for lepre_quest_3
  window.state.questSystem.questProgress.lepre_quest_3 = {
    berriesGiven: new Decimal(0),
    petalsGiven: new Decimal(0),
    waterGiven: new Decimal(0),
    prismaGiven: new Decimal(0),
    tokensPurchased: new Decimal(0),
    completed: false,
    readyToTurnIn: false
  };
  console.log('Initialized lepre_quest_3 progress');
  
  // Update UI
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  
  console.log('lepre_quest_3 fix complete');
  debugLepreQuest3();
}
window.fixLepreQuest3 = fixLepreQuest3;

// Complete fix for lepre quest 3 objectives and completion logic
function completeFixLepreQuest3() {
  console.log('=== COMPLETE FIX FOR LEPRE QUEST 3 ===');
  
  // First, fix the quest state
  fixLepreQuest3();
  
  // Force refresh quest progress checking
  checkQuestProgress();
  
  // Now test each objective type
  console.log('\n--- Testing berries tracking ---');
  trackTokenGivenToWorker('berries', 1);
  console.log('After giving 1 berry:', window.state.questSystem.questProgress.lepre_quest_3.berriesGiven.toString());
  
  console.log('\n--- Testing petals tracking ---');
  trackTokenGivenToWorker('petals', 1);
  console.log('After giving 1 petal:', window.state.questSystem.questProgress.lepre_quest_3.petalsGiven.toString());
  
  console.log('\n--- Testing water tracking ---');
  trackTokenGivenToWorker('water', 1);  
  console.log('After giving 1 water:', window.state.questSystem.questProgress.lepre_quest_3.waterGiven.toString());
  
  console.log('\n--- Testing prisma tracking ---');
  trackTokenGivenToWorker('prisma', 1);
  console.log('After giving 1 prisma:', window.state.questSystem.questProgress.lepre_quest_3.prismaGiven.toString());
  
  // Test token purchase tracking
  console.log('\n--- Testing token purchase tracking ---');
  trackLepreShopPurchase('berries', 5);
  console.log('After purchasing 5 tokens:', window.state.questSystem.questProgress.lepre_quest_3.tokensPurchased.toString());
  
  // Force re-check quest completion
  checkQuestProgress();
  
  console.log('\n--- Final state after all tests ---');
  debugLepreQuest3();
  
  // Update UI
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
}
window.completeFixLepreQuest3 = completeFixLepreQuest3;

// Simple test function to verify token tracking
function testTokenGiving() {
  console.log('=== Testing Token Giving ===');
  
  // Check if lepre quest 3 is active
  const isActive = window.state?.questSystem?.activeQuests?.includes('lepre_quest_3');
  console.log('lepre_quest_3 is active:', isActive);
  
  if (isActive && window.state?.questSystem?.questProgress?.lepre_quest_3) {
    const progress = window.state.questSystem.questProgress.lepre_quest_3;
    console.log('Current berries given:', progress.berriesGiven?.toString() || 0);
    console.log('Current petals given:', progress.petalsGiven?.toString() || 0);
    console.log('Current water given:', progress.waterGiven?.toString() || 0);
    console.log('Current prisma given:', progress.prismaGiven?.toString() || 0);
    
    // Test calling trackTokenGivenToWorker directly
    console.log('Testing direct call to trackTokenGivenToWorker...');
    window.trackTokenGivenToWorker('berry', 1);
    console.log('After giving 1 berry:', progress.berriesGiven?.toString() || 0);
  }
  
  console.log('=== Test Complete ===');
}

window.testTokenGiving = testTokenGiving;

// Quick debug function to check lepre quest 3 state
function checkLepreQuest3State() {
  console.log('=== LEPRE QUEST 3 STATE CHECK ===');
  
  const isActive = window.state?.questSystem?.activeQuests?.includes('lepre_quest_3');
  console.log('lepre_quest_3 is active:', isActive);
  
  if (window.state?.questSystem?.questProgress?.lepre_quest_3) {
    const progress = window.state.questSystem.questProgress.lepre_quest_3;
    console.log('Progress object:', progress);
    console.log('berriesGiven:', progress.berriesGiven?.toString() || 'undefined');
  } else {
    console.log('No progress found for lepre_quest_3');
  }
  
  if (questDefinitions?.lepre_quest_3?.objectives) {
    console.log('Quest objectives:', questDefinitions.lepre_quest_3.objectives);
  }
  
  console.log('trackTokenGivenToWorker function exists:', typeof window.trackTokenGivenToWorker);
}

window.checkLepreQuest3State = checkLepreQuest3State;

// Fix corrupted Decimal values in lepre quest 3 progress
function fixLepreQuest3Decimals() {
  console.log('=== FIXING LEPRE QUEST 3 DECIMALS ===');
  
  if (!window.state?.questSystem?.questProgress?.lepre_quest_3) {
    console.log('No lepre_quest_3 progress found');
    return;
  }
  
  const progress = window.state.questSystem.questProgress.lepre_quest_3;
  
  // Convert all progress values to proper Decimals
  ['berriesGiven', 'petalsGiven', 'waterGiven', 'prismaGiven', 'tokensPurchased'].forEach(key => {
    if (progress[key] !== undefined) {
      const oldValue = progress[key];
      progress[key] = DecimalUtils.toDecimal(progress[key] || 0);
      console.log(`Fixed ${key}: ${JSON.stringify(oldValue)} -> ${progress[key].toString()}`);
    }
  });
  
  // Update UI
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updatePinnedQuests === 'function') {
    updatePinnedQuests();
  }
  
  console.log('=== FIX COMPLETE ===');
}

window.fixLepreQuest3Decimals = fixLepreQuest3Decimals;

// Test function to simulate giving a berry token to any worker
function testBerryGiving() {
  console.log('=== TESTING BERRY GIVING ===');
  
  // Check current state
  if (window.state?.questSystem?.questProgress?.lepre_quest_3) {
    const progress = window.state.questSystem.questProgress.lepre_quest_3;
    console.log('Before: berriesGiven =', progress.berriesGiven?.toString() || 0);
    
    // Simulate giving 1 berry token
    if (typeof window.trackTokenGivenToWorker === 'function') {
      window.trackTokenGivenToWorker('berry', 1);
      console.log('After: berriesGiven =', progress.berriesGiven?.toString() || 0);
    } else {
      console.log('trackTokenGivenToWorker function not found!');
    }
  } else {
    console.log('No lepre_quest_3 progress found');
  }
  
  console.log('=== TEST COMPLETE ===');
}

window.testBerryGiving = testBerryGiving;

// Debug function to check lepre quest 3 completion logic
function debugLepreQuest3Completion() {
  console.log('=== LEPRE QUEST 3 COMPLETION DEBUG ===');
  
  if (!window.state?.questSystem?.questProgress?.lepre_quest_3) {
    console.log('No lepre_quest_3 progress found');
    return;
  }
  
  const progress = window.state.questSystem.questProgress.lepre_quest_3;
  const quest = questDefinitions.lepre_quest_3;
  
  console.log('Quest objectives:', quest.objectives);
  console.log('Current progress:');
  console.log('  berriesGiven:', progress.berriesGiven?.toString() || 0, '/', quest.objectives.berriesGiven?.toString());
  console.log('  petalsGiven:', progress.petalsGiven?.toString() || 0, '/', quest.objectives.petalsGiven?.toString());
  console.log('  waterGiven:', progress.waterGiven?.toString() || 0, '/', quest.objectives.waterGiven?.toString());
  console.log('  prismaGiven:', progress.prismaGiven?.toString() || 0, '/', quest.objectives.prismaGiven?.toString());
  console.log('  tokensPurchased:', progress.tokensPurchased?.toString() || 0, '/', quest.objectives.tokensPurchased?.toString());
  
  // Check each objective manually
  let allObjectivesMet = true;
  
  if (quest.objectives.berriesGiven) {
    const berriesProgress = DecimalUtils.toDecimal(progress.berriesGiven || 0);
    const berriesMet = berriesProgress.gte(quest.objectives.berriesGiven);
    console.log('  Berries objective met:', berriesMet, `(${berriesProgress.toString()} >= ${quest.objectives.berriesGiven.toString()})`);
    if (!berriesMet) allObjectivesMet = false;
  }
  
  if (quest.objectives.petalsGiven) {
    const petalsProgress = DecimalUtils.toDecimal(progress.petalsGiven || 0);
    const petalsMet = petalsProgress.gte(quest.objectives.petalsGiven);
    console.log('  Petals objective met:', petalsMet, `(${petalsProgress.toString()} >= ${quest.objectives.petalsGiven.toString()})`);
    if (!petalsMet) allObjectivesMet = false;
  }
  
  if (quest.objectives.waterGiven) {
    const waterProgress = DecimalUtils.toDecimal(progress.waterGiven || 0);
    const waterMet = waterProgress.gte(quest.objectives.waterGiven);
    console.log('  Water objective met:', waterMet, `(${waterProgress.toString()} >= ${quest.objectives.waterGiven.toString()})`);
    if (!waterMet) allObjectivesMet = false;
  }
  
  if (quest.objectives.prismaGiven) {
    const prismaProgress = DecimalUtils.toDecimal(progress.prismaGiven || 0);
    const prismaMet = prismaProgress.gte(quest.objectives.prismaGiven);
    console.log('  Prisma objective met:', prismaMet, `(${prismaProgress.toString()} >= ${quest.objectives.prismaGiven.toString()})`);
    if (!prismaMet) allObjectivesMet = false;
  }
  
  if (quest.objectives.tokensPurchased) {
    const tokensProgress = DecimalUtils.toDecimal(progress.tokensPurchased || 0);
    const tokensMet = tokensProgress.gte(quest.objectives.tokensPurchased);
    console.log('  Tokens purchased objective met:', tokensMet, `(${tokensProgress.toString()} >= ${quest.objectives.tokensPurchased.toString()})`);
    if (!tokensMet) allObjectivesMet = false;
  }
  
  console.log('All objectives met:', allObjectivesMet);
  console.log('Quest readyToTurnIn flag:', progress.readyToTurnIn);
  console.log('=== DEBUG COMPLETE ===');
}

window.debugLepreQuest3Completion = debugLepreQuest3Completion;

// Debug function specifically for mystic_quest_2
function debugMysticQuest2() {
  const questId = 'mystic_quest_2';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  console.log('=== MYSTIC QUEST 2 DEBUG ===');
  console.log('Quest Definition:', quest);
  console.log('Quest Progress:', progress);
  console.log('Is Active:', window.state?.questSystem?.activeQuests?.includes(questId));
  console.log('Is Claimable:', window.state?.questSystem?.claimableQuests?.includes(questId));
  console.log('Is Completed:', window.state?.questSystem?.completedQuests?.includes(questId));
  
  if (progress) {
    console.log('Objective Progress:');
    console.log('- cookBatteries:', progress.cookBatteries, '/ 2 required');
    console.log('- sparksTokens:', progress.sparksTokens, '/ 50 required');
    console.log('- generatorTokensFromBoxes:', progress.generatorTokensFromBoxes, '/ 75 required');
    console.log('- generateBoxes:', progress.generateBoxes, '/ 10000 required');
    console.log('Ready to turn in:', progress.readyToTurnIn);
  }
  
  // Check actual inventory values for context
  console.log('Current Inventory:');
  console.log('- batteries:', window.state?.batteries?.toString() || 'undefined');
  console.log('- sparks tokens:', window.state?.tokens?.sparks?.toString() || 'undefined');
  console.log('=== END DEBUG ===');
}
window.debugMysticQuest2 = debugMysticQuest2;

// Fix function for mystic_quest_2 progress issues
function fixMysticQuest2() {
  const questId = 'mystic_quest_2';
  
  if (!window.state?.questSystem?.questProgress?.[questId]) {
    console.log('Mystic Quest 2 is not active, no fix needed');
    return;
  }
  
  const progress = window.state.questSystem.questProgress[questId];
  
  // Reset all objective progress to 0 (ensure they are numbers, not strings)
  progress.cookBatteries = 0;
  progress.sparksTokens = 0;
  progress.generatorTokensFromBoxes = 0;
  progress.generateBoxes = 0;
  progress.readyToTurnIn = false;
  
  console.log('Mystic Quest 2 progress has been reset. All objectives are now at 0.');
  console.log('Start collecting tokens and cooking batteries to make progress!');
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') updateQuestModal();
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
}
window.fixMysticQuest2 = fixMysticQuest2;

// Enhanced fix function that also fixes string concatenation issues
function fixMysticQuest2Enhanced() {
  const questId = 'mystic_quest_2';
  
  if (!window.state?.questSystem?.questProgress?.[questId]) {
    console.log('Mystic Quest 2 is not active, no fix needed');
    return;
  }
  
  const progress = window.state.questSystem.questProgress[questId];
  
  console.log('=== FIXING MYSTIC QUEST 2 ENHANCED ===');
  console.log('Before fix:', {
    cookBatteries: progress.cookBatteries,
    sparksTokens: progress.sparksTokens,
    generatorTokensFromBoxes: progress.generatorTokensFromBoxes,
    generateBoxes: progress.generateBoxes,
    readyToTurnIn: progress.readyToTurnIn
  });
  
  // Convert any string values to proper numbers and reset to 0
  progress.cookBatteries = 0;
  progress.sparksTokens = 0;
  progress.generatorTokensFromBoxes = 0;
  progress.generateBoxes = 0;
  progress.readyToTurnIn = false;
  
  // Also make sure the quest isn't incorrectly marked as complete
  if (window.state.questSystem.completedQuests.includes(questId)) {
    window.state.questSystem.completedQuests = window.state.questSystem.completedQuests.filter(id => id !== questId);
    console.log('Removed from completed quests');
  }
  
  console.log('After fix:', {
    cookBatteries: progress.cookBatteries,
    sparksTokens: progress.sparksTokens,
    generatorTokensFromBoxes: progress.generatorTokensFromBoxes,
    generateBoxes: progress.generateBoxes,
    readyToTurnIn: progress.readyToTurnIn
  });
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') updateQuestModal();
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  
  console.log('=== FIX COMPLETE ===');
  console.log('Quest should now track progress correctly!');
}
window.fixMysticQuest2Enhanced = fixMysticQuest2Enhanced;

// Complete all objectives for mystic_quest_2 instantly
function completeMysticQuest2Objectives() {
  const questId = 'mystic_quest_2';
  
  if (!window.state?.questSystem?.questProgress?.[questId]) {
    console.log('Mystic Quest 2 is not active. Please start the quest first!');
    return;
  }
  
  const progress = window.state.questSystem.questProgress[questId];
  const quest = questDefinitions[questId];
  
  console.log('=== COMPLETING MYSTIC QUEST 2 OBJECTIVES ===');
  console.log('Before completion:', {
    cookBatteries: progress.cookBatteries,
    sparksTokens: progress.sparksTokens,
    generatorTokensFromBoxes: progress.generatorTokensFromBoxes,
    generateBoxes: progress.generateBoxes
  });
  
  // Complete all objectives to their required amounts
  if (quest.objectives.cookBatteries) {
    progress.cookBatteries = quest.objectives.cookBatteries;
    console.log(`✅ Cook Batteries: ${progress.cookBatteries}/${quest.objectives.cookBatteries}`);
  }
  
  if (quest.objectives.sparksTokens) {
    progress.sparksTokens = quest.objectives.sparksTokens;
    console.log(`✅ Spark Tokens: ${progress.sparksTokens}/${quest.objectives.sparksTokens}`);
  }
  
  if (quest.objectives.generatorTokensFromBoxes) {
    progress.generatorTokensFromBoxes = quest.objectives.generatorTokensFromBoxes;
    console.log(`✅ Generator Tokens: ${progress.generatorTokensFromBoxes}/${quest.objectives.generatorTokensFromBoxes}`);
  }
  
  if (quest.objectives.generateBoxes) {
    progress.generateBoxes = quest.objectives.generateBoxes;
    console.log(`✅ Generate Boxes: ${progress.generateBoxes}/${quest.objectives.generateBoxes}`);
  }
  
  console.log('After completion:', {
    cookBatteries: progress.cookBatteries,
    sparksTokens: progress.sparksTokens,
    generatorTokensFromBoxes: progress.generatorTokensFromBoxes,
    generateBoxes: progress.generateBoxes
  });
  
  // Force update quest progress check
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') updateQuestModal();
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  if (typeof updatePinnedQuests === 'function') updatePinnedQuests();
  
  console.log('=== QUEST COMPLETION SUCCESSFUL ===');
  console.log('🎉 All objectives completed! The quest should now be ready to turn in.');
  console.log('🏃‍♂️ Go talk to Mystic to turn in the quest!');
}
window.completeMysticQuest2Objectives = completeMysticQuest2Objectives;

// Complete reset function for mystic_quest_2 - removes from all lists and makes it available again
function resetMysticQuest2Completely() {
  const questId = 'mystic_quest_2';
  
  console.log('=== RESETTING MYSTIC QUEST 2 COMPLETELY ===');
  
  // Remove from active quests
  if (window.state?.questSystem?.activeQuests) {
    window.state.questSystem.activeQuests = window.state.questSystem.activeQuests.filter(id => id !== questId);
    console.log('✓ Removed from active quests');
  }
  
  // Remove from completed quests
  if (window.state?.questSystem?.completedQuests) {
    window.state.questSystem.completedQuests = window.state.questSystem.completedQuests.filter(id => id !== questId);
    console.log('✓ Removed from completed quests');
  }
  
  // Remove from claimable quests
  if (window.state?.questSystem?.claimableQuests) {
    window.state.questSystem.claimableQuests = window.state.questSystem.claimableQuests.filter(id => id !== questId);
    console.log('✓ Removed from claimable quests');
  }
  
  // Clear quest progress
  if (window.state?.questSystem?.questProgress?.[questId]) {
    delete window.state.questSystem.questProgress[questId];
    console.log('✓ Cleared quest progress');
  }
  
  // Reset quest status
  if (window.state?.questSystem?.questStatus?.[questId]) {
    delete window.state.questSystem.questStatus[questId];
    console.log('✓ Reset quest status');
  }
  
  // Reset the quest definition status to available (so it can be claimed again)
  if (questDefinitions[questId]) {
    questDefinitions[questId].status = 'available';
    console.log('✓ Reset quest definition status to available');
  }
  
  // Remove any character glows
  if (typeof removeCharacterQuestGlow === 'function') {
    removeCharacterQuestGlow('mystic');
  }
  if (typeof removeCharacterCompletionGlow === 'function') {
    removeCharacterCompletionGlow('mystic');
  }
  
  // Force check quest availability to make it available again
  if (typeof checkQuestAvailability === 'function') {
    checkQuestAvailability();
  }
  
  // Update character glows
  if (typeof updateCharacterGlows === 'function') {
    updateCharacterGlows();
  }
  
  // Update quest modal if open
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  
  console.log('=== RESET COMPLETE ===');
  console.log('Mystic Quest 2 has been completely reset.');
  console.log('You should now be able to talk to Mystic to start Quest 2 again.');
  console.log('Make sure mystic_quest_1 is completed first!');
}
window.resetMysticQuest2Completely = resetMysticQuest2Completely;

// Debug function specifically for mystic_quest_3
function debugMysticQuest3() {
  const questId = 'mystic_quest_3';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  console.log('=== MYSTIC QUEST 3 DEBUG ===');
  console.log('Quest Definition:', quest);
  console.log('Quest Progress:', progress);
  console.log('Is Active:', window.state?.questSystem?.activeQuests?.includes(questId));
  console.log('Is Claimable:', window.state?.questSystem?.claimableQuests?.includes(questId));
  console.log('Is Completed:', window.state?.questSystem?.completedQuests?.includes(questId));
  
  if (progress) {
    console.log('Objective Progress:');
    console.log('- cookChargedPrisma:', progress.cookChargedPrisma, '/ 3 required');
    console.log('- prismaTokens:', progress.prismaTokens, '/ 80 required');
    console.log('- prismClickTokens:', progress.prismClickTokens, '/ 115 required');
    console.log('- clickPrismTiles:', progress.clickPrismTiles, '/ 500 required');
    console.log('Ready to turn in:', progress.readyToTurnIn);
  }
  
  // Check actual inventory values for context
  console.log('Current Inventory:');
  console.log('- Prisma Tokens:', window.state?.tokens?.prisma?.toString() || 0);
  console.log('- Stardust:', window.state?.stardust?.toString() || 0);
  console.log('- Global Prism Clicks:', window.state?.prismClicks || 0);
}
window.debugMysticQuest3 = debugMysticQuest3;

// Fix function for mystic_quest_3 progress issues
function fixMysticQuest3() {
  const questId = 'mystic_quest_3';
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Mystic Quest 3 not found in progress');
    return;
  }
  
  console.log('=== FIXING MYSTIC QUEST 3 ===');
  console.log('Before fix:', progress);
  
  // Reset progress values to 0 (ensure they're numbers, not strings)
  progress.cookChargedPrisma = 0;
  progress.prismaTokens = 0;
  progress.prismClickTokens = 0;
  progress.clickPrismTiles = 0;
  progress.readyToTurnIn = false;
  
  console.log('After fix:', progress);
  
  // Force update quest progress check
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
}
window.fixMysticQuest3 = fixMysticQuest3;

// Enhanced fix function that also fixes string concatenation issues for Quest 3
function fixMysticQuest3Enhanced() {
  const questId = 'mystic_quest_3';
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Mystic Quest 3 not found in progress');
    return;
  }
  
  console.log('=== ENHANCED FIXING MYSTIC QUEST 3 ===');
  console.log('Before fix:', {
    cookChargedPrisma: progress.cookChargedPrisma,
    prismaTokens: progress.prismaTokens,
    prismClickTokens: progress.prismClickTokens,
    clickPrismTiles: progress.clickPrismTiles,
    readyToTurnIn: progress.readyToTurnIn
  });
  
  // Reset and ensure proper number types (fix string concatenation bugs)
  progress.cookChargedPrisma = 0;
  progress.prismaTokens = 0;
  progress.prismClickTokens = 0;
  progress.clickPrismTiles = 0;
  progress.readyToTurnIn = false;
  
  console.log('After fix:', {
    cookChargedPrisma: progress.cookChargedPrisma,
    prismaTokens: progress.prismaTokens,
    prismClickTokens: progress.prismClickTokens,
    clickPrismTiles: progress.clickPrismTiles,
    readyToTurnIn: progress.readyToTurnIn
  });
  
  // Force quest progress check
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
}
window.fixMysticQuest3Enhanced = fixMysticQuest3Enhanced;

// Complete all objectives for mystic_quest_3 instantly
function completeMysticQuest3Objectives() {
  const questId = 'mystic_quest_3';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Mystic Quest 3 not found in progress');
    return;
  }
  
  if (!quest || !quest.objectives) {
    console.log('Mystic Quest 3 definition or objectives not found');
    return;
  }
  
  console.log('=== COMPLETING MYSTIC QUEST 3 OBJECTIVES ===');
  console.log('Before completion:', progress);
  
  // Set all objectives to their completion values
  if (quest.objectives.cookChargedPrisma) {
    progress.cookChargedPrisma = quest.objectives.cookChargedPrisma;
  }
  if (quest.objectives.prismaTokens) {
    progress.prismaTokens = quest.objectives.prismaTokens;
  }
  if (quest.objectives.prismClickTokens) {
    progress.prismClickTokens = quest.objectives.prismClickTokens;
  }
  if (quest.objectives.clickPrismTiles) {
    progress.clickPrismTiles = quest.objectives.clickPrismTiles;
  }
  
  console.log('After completion:', progress);
  
  // Force quest progress check to update readyToTurnIn status
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  
  console.log('All Mystic Quest 3 objectives completed!');
}
window.completeMysticQuest3Objectives = completeMysticQuest3Objectives;

function completeMysticQuest4Objectives() {
  const questId = 'mystic_quest_4';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Mystic Quest 4 not found in progress');
    return;
  }
  
  if (!quest || !quest.objectives) {
    console.log('Mystic Quest 4 definition or objectives not found');
    return;
  }
  
  console.log('=== COMPLETING MYSTIC QUEST 4 OBJECTIVES ===');
  console.log('Before completion:', progress);
  
  // Set all objectives to their completion values
  if (quest.objectives.cookBerryPlates) {
    progress.cookBerryPlates = quest.objectives.cookBerryPlates;
  }
  if (quest.objectives.cookBatteries) {
    progress.cookBatteries = quest.objectives.cookBatteries;
  }
  if (quest.objectives.cookMushroomSoup) {
    progress.cookMushroomSoup = quest.objectives.cookMushroomSoup;
  }
  if (quest.objectives.cookChargedPrisma) {
    progress.cookChargedPrisma = quest.objectives.cookChargedPrisma;
  }
  if (quest.objectives.cookAnyIngredients) {
    progress.cookAnyIngredients = quest.objectives.cookAnyIngredients;
  }
  if (quest.objectives.collectAnyTokens) {
    progress.collectAnyTokens = quest.objectives.collectAnyTokens;
  }
  
  console.log('After completion:', progress);
  
  // Force quest progress check to update readyToTurnIn status
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  
  console.log('All Mystic Quest 4 objectives completed!');
}
window.completeMysticQuest4Objectives = completeMysticQuest4Objectives;

function completeMysticQuest5Objectives() {
  const questId = 'mystic_quest_5';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Mystic Quest 5 not found in progress');
    return;
  }
  
  if (!quest || !quest.objectives) {
    console.log('Mystic Quest 5 definition or objectives not found');
    return;
  }
  
  console.log('=== COMPLETING MYSTIC QUEST 5 OBJECTIVES ===');
  console.log('Before completion:', progress);
  
  // Set all objectives to their completion values
  if (quest.objectives.stardustTokens) {
    progress.stardustTokens = quest.objectives.stardustTokens;
  }
  if (quest.objectives.nightTimeTokens) {
    progress.nightTimeTokens = quest.objectives.nightTimeTokens;
  }
  if (quest.objectives.buyBoxesAtNight) {
    progress.buyBoxesAtNight = quest.objectives.buyBoxesAtNight;
  }
  if (quest.objectives.clickPrismTilesAtNight) {
    progress.clickPrismTilesAtNight = quest.objectives.clickPrismTilesAtNight;
  }
  
  console.log('After completion:', progress);
  
  // Force quest progress check to update readyToTurnIn status
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  
  console.log('All Mystic Quest 5 objectives completed!');
}
window.completeMysticQuest5Objectives = completeMysticQuest5Objectives;

function completeMysticQuest6Objectives() {
  const questId = 'mystic_quest_6';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Mystic Quest 6 not found in progress');
    return;
  }
  
  if (!quest || !quest.objectives) {
    console.log('Mystic Quest 6 definition or objectives not found');
    return;
  }
  
  console.log('=== COMPLETING MYSTIC QUEST 6 OBJECTIVES ===');
  console.log('Before completion:', progress);
  
  // Set all objectives to their completion values
  if (quest.objectives.cookGlitteringPetals) {
    progress.cookGlitteringPetals = quest.objectives.cookGlitteringPetals;
  }
  if (quest.objectives.petalTokens) {
    progress.petalTokens = quest.objectives.petalTokens;
  }
  if (quest.objectives.terrariumRustlingTokens) {
    progress.terrariumRustlingTokens = quest.objectives.terrariumRustlingTokens;
  }
  if (quest.objectives.waterFlowers) {
    progress.waterFlowers = quest.objectives.waterFlowers;
  }
  if (quest.objectives.extractPollen) {
    progress.extractPollen = quest.objectives.extractPollen;
  }
  
  console.log('After completion:', progress);
  
  // Force quest progress check to update readyToTurnIn status
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  
  console.log('All Mystic Quest 6 objectives completed!');
}
window.completeMysticQuest6Objectives = completeMysticQuest6Objectives;

function completeLepreQuest5Objectives() {
  const questId = 'lepre_quest_5';
  const quest = questDefinitions[questId];
  const progress = window.state?.questSystem?.questProgress?.[questId];
  
  if (!progress) {
    console.log('Lepre Quest 5 not found in progress');
    return;
  }
  
  if (!quest || !quest.objectives) {
    console.log('Lepre Quest 5 definition or objectives not found');
    return;
  }
  
  console.log('=== COMPLETING LEPRE QUEST 5 OBJECTIVES ===');
  console.log('Before completion:', progress);
  
  // Set all objectives to their completion values
  if (quest.objectives.tokensCollected) {
    progress.tokensCollected = quest.objectives.tokensCollected; // 30 tokens
  }
  if (quest.objectives.batteriesCrafted) {
    progress.batteriesCrafted = quest.objectives.batteriesCrafted; // 2 batteries
  }
  if (quest.objectives.tokensGiven) {
    progress.tokensGiven = quest.objectives.tokensGiven; // 50 tokens given
  }
  if (quest.objectives.tokensPurchased) {
    progress.tokensPurchased = quest.objectives.tokensPurchased; // 50 tokens purchased
  }
  if (quest.objectives.premiumTokensPurchased) {
    progress.premiumTokensPurchased = quest.objectives.premiumTokensPurchased; // 5 premium tokens
  }
  if (quest.objectives.freeSwaCollected) {
    progress.freeSwaCollected = quest.objectives.freeSwaCollected; // 5 free swa bucks
  }
  if (quest.objectives.powerChallengeRecord) {
    progress.powerChallengeRecord = quest.objectives.powerChallengeRecord; // 30 seconds
  }
  
  console.log('After completion:', progress);
  
  // Force quest progress check to update readyToTurnIn status
  if (typeof checkQuestProgress === 'function') {
    checkQuestProgress();
  }
  
  // Force update quest modal and character glows
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  if (typeof updateCharacterGlows === 'function') updateCharacterGlows();
  
  console.log('All Lepre Quest 5 objectives completed!');
}
window.completeLepreQuest5Objectives = completeLepreQuest5Objectives;

// Complete reset function for mystic_quest_3 - removes from all lists and makes it available again
function resetMysticQuest3Completely() {
  const questId = 'mystic_quest_3';
  
  console.log('=== COMPLETE RESET MYSTIC QUEST 3 ===');
  
  // Remove from all quest lists
  if (window.state?.questSystem?.activeQuests) {
    const activeIndex = window.state.questSystem.activeQuests.indexOf(questId);
    if (activeIndex !== -1) {
      window.state.questSystem.activeQuests.splice(activeIndex, 1);
      console.log('Removed from active quests');
    }
  }
  
  if (window.state?.questSystem?.claimableQuests) {
    const claimableIndex = window.state.questSystem.claimableQuests.indexOf(questId);
    if (claimableIndex !== -1) {
      window.state.questSystem.claimableQuests.splice(claimableIndex, 1);
      console.log('Removed from claimable quests');
    }
  }
  
  if (window.state?.questSystem?.completedQuests) {
    const completedIndex = window.state.questSystem.completedQuests.indexOf(questId);
    if (completedIndex !== -1) {
      window.state.questSystem.completedQuests.splice(completedIndex, 1);
      console.log('Removed from completed quests');
    }
  }
  
  // Clear progress data
  if (window.state?.questSystem?.questProgress?.[questId]) {
    delete window.state.questSystem.questProgress[questId];
    console.log('Cleared quest progress data');
  }
  
  // Reset any dialogue state
  if (window.state?.questSystem) {
    window.state.questSystem.dialogueInProgress = false;
  }
  
  // Remove any character glows
  if (typeof removeCharacterQuestGlow === 'function') {
    removeCharacterQuestGlow('mystic');
  }
  if (typeof removeCharacterCompletionGlow === 'function') {
    removeCharacterCompletionGlow('mystic');
  }
  
  // Force check quest availability to make it available again
  if (typeof checkQuestAvailability === 'function') {
    checkQuestAvailability();
  }
  
  // Update character glows
  if (typeof updateCharacterGlows === 'function') {
    updateCharacterGlows();
  }
  
  // Update quest modal if open
  if (typeof updateQuestModal === 'function') {
    updateQuestModal();
  }
  
  console.log('=== RESET COMPLETE ===');
  console.log('Mystic Quest 3 has been completely reset.');
  console.log('You should now be able to talk to Mystic to start Quest 3 again.');
  console.log('Make sure mystic_quest_2 is completed first!');
}
window.resetMysticQuest3Completely = resetMysticQuest3Completely;

// Debug function to reset quest starting values
function resetQuestStartingValues(questId = 'soap_quest_4') {
  if (!window.state?.questSystem?.questProgress?.[questId]) {
    console.log(`Quest ${questId} not found`);
    return;
  }
  
  const progress = window.state.questSystem.questProgress[questId];
  const quest = questDefinitions[questId];
  
  if (quest.objectives.feathers) {
    progress.startingFeathers = window.state.feathers ? (DecimalUtils.isDecimal(window.state.feathers) ? window.state.feathers : new Decimal(window.state.feathers)) : new Decimal(0);
    progress.feathersCollected = new Decimal(0); // Reset collected amount
    console.log(`Reset startingFeathers to:`, progress.startingFeathers.toString());
  }
  if (quest.objectives.artifacts) {
    progress.startingArtifacts = window.state.artifacts ? (DecimalUtils.isDecimal(window.state.artifacts) ? window.state.artifacts : new Decimal(window.state.artifacts)) : new Decimal(0);
    progress.artifactsCollected = new Decimal(0); // Reset collected amount
    console.log(`Reset startingArtifacts to:`, progress.startingArtifacts.toString());
  }
  if (quest.objectives.prismClicks) {
    progress.startingPrismClicks = window.state.prismClicks || 0;
    progress.prismClicksGained = 0; // Reset gained amount
    console.log(`Reset startingPrismClicks to:`, progress.startingPrismClicks);
  }
  
  console.log('Starting values reset for', questId);
  console.log('Current progress state:', progress);
}
window.resetQuestStartingValues = resetQuestStartingValues;

// Force fix function specifically for feathers and artifacts
function forceFixResourceTracking(questId = 'soap_quest_4') {
  if (!window.state?.questSystem?.questProgress?.[questId]) {
    console.log(`Quest ${questId} not found`);
    return;
  }
  
  const progress = window.state.questSystem.questProgress[questId];
  const currentFeathers = window.state.feathers ? (DecimalUtils.isDecimal(window.state.feathers) ? window.state.feathers : new Decimal(window.state.feathers)) : new Decimal(0);
  const currentArtifacts = window.state.artifacts ? (DecimalUtils.isDecimal(window.state.artifacts) ? window.state.artifacts : new Decimal(window.state.artifacts)) : new Decimal(0);
  
  console.log('Before fix:');
  console.log('Current feathers:', currentFeathers.toString());
  console.log('Starting feathers:', progress.startingFeathers?.toString());
  console.log('Current artifacts:', currentArtifacts.toString());
  console.log('Starting artifacts:', progress.startingArtifacts?.toString());
  
  // Force reset to current values
  progress.startingFeathers = currentFeathers;
  progress.startingArtifacts = currentArtifacts;
  progress.feathersCollected = new Decimal(0);
  progress.artifactsCollected = new Decimal(0);
  
  console.log('After fix - starting values set to current amounts. Progress will now track from 0.');
}
window.forceFixResourceTracking = forceFixResourceTracking;

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
function getDepartmentColors(department, character) {
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
  
  // Override with purple colors for Mystic quests
  if (character === 'mystic') {
    return {
      background: 'linear-gradient(135deg, #8e44ad, #663399)',
      light: '#9b59b6',
      text: '#fff'
    };
  }
  
  return colors[department] || colors['Generator']; // Default to Generator colors
}

// Helper functions for Swaria grudge images
const getSwariaGrudgeImage = () => {
  const isHalloween = (window.state && window.state.halloweenEventActive) || 
                     (window.premiumState && window.premiumState.halloweenEventActive) ||
                     document.body.classList.contains('halloween-cargo-active') ||
                     document.body.classList.contains('halloween-event-active');
  return isHalloween ? 'assets/icons/halloween swa grudge.png' : 'assets/icons/swa grudge.png';
};

const getSwariaGrudgeSpeakingImage = () => {
  const isHalloween = (window.state && window.state.halloweenEventActive) || 
                     (window.premiumState && window.premiumState.halloweenEventActive) ||
                     document.body.classList.contains('halloween-cargo-active') ||
                     document.body.classList.contains('halloween-event-active');
  return isHalloween ? 'assets/icons/halloween swa grudge speech.png' : 'assets/icons/swa grudge speech.png';
};

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

  'soap_quest_3': {
    id: 'soap_quest_3',
    character: 'soap',
    department: 'Generator',
    title: 'Soap\'s quest 3',
    description: 'The power generator crisis.',
    requirements: {
      completedQuests: ['soap_quest_2'] // Requires second quest to be completed
    },
    objectives: {
      fluff: new Decimal('1e12'),
      swaria: new Decimal('5e9'), 
      feathers: new Decimal('1e8'),
      commonBoxes: 150, // Need to produce 150 common boxes
      uncommonBoxes: 40, // Need to produce 40 uncommon boxes
      tokens: 12,
      powerRefills: 5, // Need to refill power generator 5 times
    },
    rewards: {
      berries: 12,
      sparks: 8,
      stardust: 2
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Hey Soap! How's the common box generator doing?"
      },
      {
        speaker: 'soap',
        text: "Oh hey Peachy! It's doing great actually, much better than before. But... we have a bigger problem now."
      },
      {
        speaker: 'swaria',
        text: "Oh no, what happened this time?"
      },
      {
        speaker: 'soap',
        text: "Well, you remember how I mentioned the power generator earlier? It's... it's been acting up for weeks now and I've been too embarrassed to tell anyone."
      },
      {
        speaker: 'swaria',
        text: "Wait, isn't maintaining the power generator literally your main job?"
      },
      {
        speaker: 'soap',
        text: "Y-yes... that's exactly the problem. You see, the power generator needs to be refilled regularly with a special energy mixture, but every time I try to do it..."
      },
      {
        speaker: 'soap',
        text: "Something always goes wrong! Either I spill the mixture, or I forget the correct proportions, or I accidentally break something while trying to fix it!"
      },
      {
        speaker: 'swaria',
        text: "That... sounds like a pretty serious problem for the entire facility."
      },
      {
        speaker: 'soap',
        text: "I KNOW! And the worst part is, I've been secretly asking the other department beside yours to help me, but they told me they're trapped in their lab."
      },
      {
        speaker: 'soap',
        text: "The power level keeps dropping, and if it hits zero... well, everything shuts down. The box generators, the lights, the cooling systems, everything!"
      },
      {
        speaker: 'swaria',
        text: "Wow, no wonder you've been so stressed lately. How can I help?"
      },
      {
        speaker: 'soap',
        text: "Well, I've been thinking... maybe if we work together, we can figure out a better system. I need help gathering the right materials and actually refilling the generator properly."
      },
      {
        speaker: 'soap',
        text: "The recipe calls for a MASSIVE amount of fluff - about 1e12 worth - plus 5e9 swaria coins for the stabilizing crystals, 1e8 feathers for the conductors, and 12 energy tokens to prime the system."
      },
      {
        speaker: 'soap',
        text: "But most importantly, I need you to refill the power generator at least 5 times so that you learn how to refill it properly."
      },
      {
        speaker: 'soap',
        text: "Oh, and we'll also need to keep the box generators running - produce 150 common boxes and 40 uncommon boxes to maintain the facility's operations during the repair work."
      },
      {
        speaker: 'swaria',
        text: "That's a big task, but I can definitely help! We can't let the whole facility shut down."
      },
      {
        speaker: 'soap',
        text: "Really?! Thank you so much Peachy! With your help, maybe I won't mess this up for once. The power refill station is right there next to the power generator - just click all the red buttons to refill the power generator!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Soap! I've gathered all the materials and helped refill the power generator 5 times. I think I got the hang of it!"
      },
      {
        speaker: 'soap',
        text: "Perfect, now you should be able to refill the power generator on your own!"
      },
      {
        speaker: 'swaria',
        text: "Sweet, but also refilling the power generator is kinda easy, you just click all the red buttons, right?"
      },
      {
        speaker: 'soap',
        text: "Yeah I made it that way so anyone can do it. But I still need to make sure refilling the power stays this simple and does not break, which happens oftens..."
      },
      {
        speaker: 'swaria',
        text: "Mmhh... Alright, but it also takes 5 seconds to go press some red buttons, you sure you can't handle that yourself?"
      },
      {
        speaker: 'soap',
        text: "Yeah I could but I also like staring at my soap collection and organizing them by scent and color... So I'll let you handle the power refills from now on, okay?"
      },
      {
        speaker: 'swaria',
        text: "..."
      },
      {
        speaker: 'soap',
        text: "Oh! Right! Here, take these rewards - I managed to save up some extra berries this time, plus some sparks and even some stardust!"
      },
      {
        speaker: 'swaria',
        text: "Ooohh shiny! Thanks Soap! Wait, stardust? What's that?"
      },
      {
        speaker: 'soap',
        text: "Stardust is this rare material that once fell from the sky during a massive meteor shower that happened in the past, that meteor destroyed many stars in its path before crashing into Tetrania, which caused some stardust to fall everywhere in Tetrania. These stardust can only be seen and collected at night. "
      },
      {
        speaker: 'soap',
        text: "They are super valuable and can be used for all sorts of advanced technology. But we don't currently have the technology to use stardust so we just like to gift them to other departments. But maybe in the future we'll be able to use them."
      },
      {
        speaker: 'swaria',
        text: "Wow, that's fascinating! Thanks for the info, Soap. I'll make sure to keep an eye out for stardust during the night."
      },
    ],
    status: 'locked' // locked until requirements are met
  },

  'soap_quest_4': {
    id: 'soap_quest_4',
    character: 'soap',
    department: 'Generator',
    title: 'Soap\'s quest 4',
    description: 'Box production and light collection.',
    requirements: {
      completedQuests: ['soap_quest_3'] // Requires third quest to be completed
    },
    objectives: {
      feathers: new Decimal('5e14'),
      artifacts: new Decimal('1e10'), // New objective: collect 1e10 artifacts
      commonBoxes: 750,
      uncommonBoxes: 500,
      rareBoxes: 200, // New objective: produce 200 rare boxes
      tokens: 20,
      powerRefills: 8,
      prismClicks: 100 // New objective: click 100 prism tiles
    },
    rewards: {
      berries: 18,
      sparks: 15,
      water: 10,
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Hey Soap! The power generator is running smoothly now. What's our next project?"
      },
      {
        speaker: 'soap',
        text: "Actually Peachy, I've been talking to Vi from the Lab department, and they need our help to go collect light for them."
      },
      {
        speaker: 'swaria',
        text: "Light? What do they need light for?"
      },
      {
        speaker: 'soap',
        text: "Vi explained that they discovered some... cutting-edge quantum light research thingy? That... well its mostly to help you with your element discovery, but the issue is they can't exactly collect that light themselves."
      },
      {
        speaker: 'swaria',
        text: "Why not? can't they just use their lab equipment?"
      },
      {
        speaker: 'soap',
        text: "Well, they said they need someone else to help with the collection."
      },
      {
        speaker: 'swaria',
        text: "Alright, I'm intrigued. What exactly do I need to do?"
      },
      {
        speaker: 'soap',
        text: "Ah yes, your task, you will need A LOT of everything! Lets skip on the fluff and swaria coins, but I will need 5e14 feathers for speeding up the rare box generator"
      },
      {
        speaker: 'soap',
        text: "1e10 wing artifacts so I can get started on repairing the legendary box generator, This will also make 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 happy."
      },
      {
        speaker: 'swaria',
        text: "Ugh, 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒... "
      },
      {
        speaker: 'soap',
        text: "We also need to produce at least: 750 common boxes, 500 uncommon boxes, and 200 rare boxes from the box generators."
      },
      {
        speaker: 'soap',
        text: "I'll also ask you to refill the power generator at least 8 times so that I have more time to organize my soap collection."
      },
      {
        speaker: 'swaria',
        text: "WHAT?!"
      },
      {
        speaker: 'soap',
        text: "Hehe... And for the last objective, Vi wants you to go in the prism lab and click 100 light tiles to start collecting pure light for them."
      },
      {
        speaker: 'swaria',
        text: "Wow, okay, I can handle it."
      },
      {
        speaker: 'soap',
        text: "Thanks Peachy! Good luck!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Soap! I've gathered everything for your task - all the materials, every power refills, the box production, and I've manually clicked 100 light tiles!"
      },
      {
        speaker: 'soap',
        text: "Incredible! You actually did it all! I just got word from Vi that they appreciate your help, even if they don't sound that enthusiastic."
      },
      {
        speaker: 'swaria',
        text: "But I have a question, is Vi okay? They sounded quite pessimistic and a bit... off? They were watching me through the lab's window the entire time while I was clicking the light tiles."
      },
      {
        speaker: 'soap',
        text: "Well, thats probably because Vi has not left the lab for weeks now, its not because they are always hyper focused on their research, but its because they are trapped in there and has been wanting to get out for some time now."
      },
      {
        speaker: 'swaria',
        text: "Wait, they are trapped in there?"
      },
      {
        speaker: 'soap',
        text: "Seems like it, they said that when they asked 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 to install another room with a window for their prism experiment, 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 got the second room built with the tiniest door connecting both rooms."
      },
      {
        speaker: 'soap',
        text: "And they can't fit through that tiny door all because of the prism attached to their tail, its quite big. They tried to ask 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 to make the door bigger but they refused unless Vi manages to create every light colour with their equipments."
      },
      {
        speaker: 'swaria',
        text: "Wow thats brutal... Poor Vi..."
      },
      {
        speaker: 'soap',
        text: "Yeah, be sure to pay them a visit sometime, they could use some company."
      },
      {
        speaker: 'swaria',
        text: "Absolutely, I will. But back to the task, Where's my reward?"
      },
      {
        speaker: 'soap',
        text: "Oh right, Here's your reward, some berries, sparks, and some water you can give to Vi."
      },
      {
        speaker: 'swaria',
        text: "Thank you, Soap! This has been quite the collaboration between the Cargo, Generator and Lab departments!"
      },
      {
        speaker: 'soap',
        text: "Yeah! Different departments can support each other. That's how we innovate!"
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
      prismClicksNight: new Decimal(72727), // Prism clicks during night hours
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
        text: "Click prism tiles 72,727 times during night hours only, and click 69,420 flowers using the pollen collector!"
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
  },
  
  'soap_quest_5': {
    id: 'soap_quest_5',
    character: 'soap',
    department: 'Generator',
    title: 'Soap\'s quest 5',
    description: 'The saga of every box generator.',
    requirements: {
      completedQuests: ['soap_quest_4'] // Requires fourth quest to be completed
    },
    objectives: {
      artifacts: new Decimal('1e20'), // 1e20 wing artifacts - massive requirement!
      commonBoxes: 5000, // Produce 5000 common boxes
      uncommonBoxes: 3000, // Produce 3000 uncommon boxes
      rareBoxes: 1000, // Produce 1000 rare boxes
      legendaryBoxes: 500, // Produce 500 legendary boxes
      mythicBoxes: 100, // Produce 100 mythic boxes
      powerRefills: 20, // Last time Soap asks for power refills
      tokens: 50 // Collect 50 tokens
    },
    rewards: {
      berries: 30, // Berry tokens
      sparks: 25, // Spark tokens
      stardust: 10, // Stardust tokens
      batteryTokens: 1 // New battery token reward
    },
    dialogue: [
      {
        speaker: 'soap',
        text: "Peachy! Great work on the previous tasks. Now it's time for the big finale of our box generator restoration project!"
      },
      {
        speaker: 'swaria',
        text: "The finale? What do you mean?"
      },
      {
        speaker: 'soap',
        text: "Well, we've been working on individual generators, but I want to see ALL the box generators running at full capacity again!"
      },
      {
        speaker: 'swaria',
        text: "All of them? That sounds like a lot of work..."
      },
      {
        speaker: 'soap',
        text: "It is! But think about it, when was the last time you saw all five box generators humming in perfect harmony?"
      },
      {
        speaker: 'swaria',
        text: "Actually... Never."
      },
      {
        speaker: 'soap',
        text: "Exactly! That's what made this place special. The synchronized production, the efficient workflow, the beautiful sound of all generators working as one! That got all ruined all because of you who decided to hack the doors system which broke everything."
      },
      {
        speaker: 'swaria',
        text: "Right... Sorry about that. I didn't mean to cause so much trouble. I was just curious as to why this room smells so much like soap."
      },
      {
        speaker: 'soap',
        text: "I forgive you Peachy, you've been helping me ever since the incident you caused. Alright here's your task now. The finale."
      },
      {
        speaker: 'soap',
        text: "This is it, Peachy! This is where small swarias become big swarias! You will need 1e15 knowledge points to repair the mythic box generator to even have a chance of completing this task!"
      },
      {
        speaker: 'soap',
        text: "You will also need to collect 1e20 wing artifacts! That's right! 100 QUINTILLION WING ARTIFACTS!!!"
      },
      {
        speaker: 'soap',
        text: "Here's the breakdown for today's box produced quota: 5000 common, 3000 uncommon, 1000 rare, 500 legendary, and 100 mythic boxes. Yes, you hear that right, we need every single box generator running again!"
      },
      {
        speaker: 'swaria',
        text: "Those are huge production numbers... this really is the finale!"
      },
      {
        speaker: 'soap',
        text: "And this is the last time I'll ask you to refill the power generator, do it 20 times. After this task, I will stop asking you for refills, I promise."
      },
      {
        speaker: 'soap',
        text: "I've been working on something special... but you'll see when you complete my task! Oh, and collect 50 tokens along the way."
      },
      {
        speaker: 'swaria',
        text: "Alright Soap, this sounds like the ultimate challenge. Let's get all those box generators running again!"
      },
      {
        speaker: 'soap',
        text: "That's the spirit! This will be the perfect conclusion to our restoration project. Good luck, Peachy!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Soap! I did it! All the box generators are running perfectly, and they've produced thousands of boxes!"
      },
      {
        speaker: 'soap',
        text: "Peachy! Listen... can you hear that?"
      },
      {
        speaker: 'swaria',
        text: "Hear what?"
      },
      {
        speaker: 'soap',
        text: "The beautiful symphony of all our generators working in perfect harmony! That rhythmic humming, the synchronized production cycles..."
      },
      {
        speaker: 'swaria',
        text: "Yes I can, its annoying."
      },
      {
        speaker: 'soap',
        text: "WHAT DID YOU SAY?!"
      },
      {
        speaker: 'swaria',
        text: "Uhh... I mean its 𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒."
      },
      {
        speaker: 'soap',
        text: "Exactly! This is what the Generator department is all about, not just individual machines, but a coordinated system working as one!"
      },
      {
        speaker: 'swaria',
        text: "Soorry Soap, I didn't mean to offend you. But at least the generators are working now."
      },
      {
        speaker: 'soap',
        text: "Don't worry Peachy, I'm probably too used to this generator noises, but for now, let's celebrate! Here's your reward! Berries, sparks, stardust, and something very special..."
      },
      {
        speaker: 'swaria',
        text: "Something special?"
      },
      {
        speaker: 'soap',
        text: "That's right! A battery token! This is a new innovation I've been working on. You can give battery tokens directly to the power generator to permanently increase its power capacity by 5!"
      },
      {
        speaker: 'soap',
        text: "Or if you give it to me, I can use this battery's powers to keep the power generator from losing power for 10 minutes!"
      },
      {
        speaker: 'swaria',
        text: "Wow! I can just expand the capacity itself? Or make it not lose power for 10 minutes? That's amazing!"
      },
      {
        speaker: 'soap',
        text: "Exactly! No more constant power refills. This battery token technology will revolutionize how we manage power in the Generator department!"
      },
      {
        speaker: 'soap',
        text: "Thank you so much for all your help Peachy, I couldn't have done this without you."
      },
      {
        speaker: 'swaria',
        text: "No problem, Soap! I'm proud of what we've accomplished together. The Generator department is stronger than ever!"
      },
      {
        speaker: 'soap',
        text: "Oh and one more thing, I've been working on a secret challenge minigame for everyone, and with the materials you collected, I finally finished it!"
      },
      {
        speaker: 'swaria',
        text: "A secret challenge minigame? That sounds fun!"
      },
      {
        speaker: 'soap',
        text: "I call it the 'Power generator challenge'! The goal is to survive the longest time possible while recharging the power, but be careful, the power drains faster and faster over time!"
      },
      {
        speaker: 'swaria',
        text: "Oohh that sounds exciting! I can't wait to try it out!"
      },
      {
        speaker: 'soap',
        text: "Great! It's located right next to the power generator. Just click the start challenge button to start the challenge! But be warned, it might be unstable..."
      },
      {
        speaker: 'swaria',
        text: "unstable? How so?"
      },
      {
        speaker: 'soap',
        text: "Well I tested it earlier to see if it works, and... some of the inner mechanisms overheated and I had to wait 10 minutes after my attempt for it to cool down. But its totally safe! Trust me!"
      },
      {
        speaker: 'swaria',
        text: "Haha, alright Soap, I'll give it a try. Thanks for everything!"
      },

    ],
    status: 'locked' // locked until requirements are met
  },
  
  'soap_quest_6': {
    id: 'soap_quest_6',
    character: 'soap',
    department: 'Generator',
    title: 'Soap\'s quest 6 - Exponential Growth',
    description: 'Start of the second quest line - unlocking battery token crafting recipe.',
    requirements: {
      completedQuests: ['soap_quest_5'], // Requires fifth quest to be completed
      wip: true // Work in progress - quest not available yet
    },
    objectives: {
      commonBoxesExponential: 11111111, // New exponential tracking - counts actual boxes produced
      uncommonBoxesExponential: 2222222, // New exponential tracking - counts actual boxes produced
      rareBoxesExponential: 333333, // New exponential tracking - counts actual boxes produced
      legendaryBoxesExponential: 44444, // New exponential tracking - counts actual boxes produced
      mythicBoxesExponential: 5555, // New exponential tracking - counts actual boxes produced
      tokens: 75
    },
    rewards: {
      berries: 20,
      sparks: 15,
      batteryTokens: 2 // Give 2 battery tokens as reward
    },
    dialogue: [
      {
        speaker: 'soap',
        text: "Peachy! Congratulations on completing the first part of our box generator restoration! But now, it's time for something even bigger."
      },
      {
        speaker: 'swaria',
        text: "Even bigger? What do you have in mind now, Soap?"
      },
      {
        speaker: 'soap',
        text: "Welcome to the second phase: Exponential Growth! We're going to push these generators beyond their limits and unlock their true potential!"
      },
      {
        speaker: 'swaria',
        text: "Exponential growth? That sounds intense!"
      },
      {
        speaker: 'soap',
        text: "It is! And to help you with this phase, I have something very special for you. I've been working on a secret recipe!"
      },
      {
        speaker: 'swaria',
        text: "A secret recipe? For what?"
      },
      {
        speaker: 'soap',
        text: "Battery tokens! Remember those battery tokens I gave you? Well, I've figured out how to craft them! But there's a catch..."
      },
      {
        speaker: 'swaria',
        text: "What's the catch?"
      },
      {
        speaker: 'soap',
        text: "I can't cook. Like, at all. I tried once and nearly set the entire Generator department on fire. So I need you to take this recipe to Chef Mystic!"
      },
      {
        speaker: 'swaria',
        text: "Chef Mystic? That sounds like a great idea! They know all about cooking recipes."
      },
      {
        speaker: 'soap',
        text: "Exactly! Give them this recipe, and they'll unlock battery token crafting for you. But first, I need you to prove you're ready for exponential growth."
      },
      {
        speaker: 'soap',
        text: "I need 5e20 fluff, 1e20 swaria coins, and here's where it gets interesting - produce 1000 common boxes and 500 uncommon boxes."
      },
      {
        speaker: 'swaria',
        text: "That doesn't sound too different from before..."
      },
      {
        speaker: 'soap',
        text: "Ah, but it is! This time, we're counting actual production volume! If your generator produces 2 boxes at once, that counts as 2 towards your goal, not just 1!"
      },
      {
        speaker: 'swaria',
        text: "Oh wow! So the more efficient my generators become, the faster I'll complete the objectives?"
      },
      {
        speaker: 'soap',
        text: "Exactly! That's the beauty of exponential growth. Also collect 25 tokens along the way. Are you ready for this new challenge?"
      },
      {
        speaker: 'swaria',
        text: "Absolutely! Let's unlock the true potential of these generators!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Soap! I've gathered all the resources and produced those boxes using the exponential counting method!"
      },
      {
        speaker: 'soap',
        text: "Excellent! I can see the difference already. Your generators are becoming more efficient, and you're thinking in terms of actual output volume!"
      },
      {
        speaker: 'swaria',
        text: "It's amazing how much faster the objectives completed once I optimized my generators!"
      },
      {
        speaker: 'soap',
        text: "That's the power of exponential thinking! Now, here's your reward - more battery tokens and the secret recipe!"
      },
      {
        speaker: 'swaria',
        text: "The secret recipe! I can't wait to show this to Chef Mystic!"
      },
      {
        speaker: 'soap',
        text: "The recipe contains instructions for crafting battery tokens using rare materials. Chef Mystic will know exactly what to do with it!"
      },
      {
        speaker: 'soap',
        text: "Once you give them the recipe, you'll be able to craft battery tokens whenever you need them, instead of relying on quest rewards!"
      },
      {
        speaker: 'swaria',
        text: "This is going to revolutionize how I manage power! Thank you, Soap!"
      },
      {
        speaker: 'soap',
        text: "My pleasure! Now go find Chef Mystic and unlock that recipe. The exponential growth phase is just beginning!"
      }
    ],
    status: 'locked' // locked until requirements are met
  },

  'mystic_quest_1': {
    id: 'mystic_quest_1',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Quest 1: Cargo\'s Gathering',
    description: 'Help Mystic gather essential ingredients tokens from the Cargo department.',
    status: 'available',
    requirements: {
      // No requirements - available immediately
    },
    objectives: {
      cookBerryPlates: 1,
      berryTokens: 10,
      cargoTokensFromBoxes: 15,
      buyBoxes: 1000
    },
    rewards: {
      berries: 50
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Hey Mystic! I keep seeing all these swawesome tokens flying around everywhere. Are they... like, good for cooking?"
      },
      {
        speaker: 'mystic',
        text: "Berry tokens? OF COURSE they're good for cooking! They're essential ingredients, not decorations. I need them for my recipes."
      },
      {
        speaker: 'swaria',
        text: "Ohhh, so that's why you always seem interested when I collect them! Want me to gather some for you?"
      },
      {
        speaker: 'mystic',
        text: "Finally, someone who gets it! Listen carefully - I need quality ingredients, not just random tokens. Start with berry tokens from the Cargo department."
      },
      {
        speaker: 'swaria',
        text: "Swawesome! What exactly do you need me to collect?"
      },
      {
        speaker: 'mystic',
        text: "Cook 1 Berry Plate first so I know you're not completely hopeless. Then gather 10 berry tokens, 15 tokens from cargo boxes, and buy 1000 boxes to understand supply flow."
      },
      {
        speaker: 'swaria',
        text: "You got it! Time to become your swofficial token collector!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Mystic! I collected all the berry tokens and cargo tokens you wanted! Plus I made that Berry Plate!"
      },
      {
        speaker: 'mystic',
        text: "Not terrible. The Berry Plate is actually edible, and you managed to collect decent quality tokens. I suppose you can be my token supplier."
      },
      {
        speaker: 'swaria',
        text: "Swawesome! Does this mean I get some kind of bonus for helping you?"
      },
      {
        speaker: 'mystic',
        text: "Since you're bringing me proper ingredients now, The mixer can make better meals. Did you know that giving a specific cooked token ingredient to a specific character gives them a boost, well that boost will last 5% longer with each task you complete for me, I call them, chef's blessing."
      }
    ],
    status: 'available'
  },

  'mystic_quest_2': {
    id: 'mystic_quest_2',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Quest 2: Call of the Generator\'s sparks',
    description: '',
    requirements: {
      completedQuests: ['mystic_quest_1']
    },
    objectives: {
      cookBatteries: 2,
      sparksTokens: 15,
      generatorTokensFromBoxes: 20,
      generateBoxes: 10000
    },
    rewards: {
      berries: 100,
      sparks: 50
    },
    dialogue: [
      {
        speaker: 'mystic',
        text: "You're back. Good. Now I need spark tokens from the Generator department. Those sparks are crucial for a certain recipe Soap asked about... a Batteries recipe."
      },
      {
        speaker: 'swaria',
        text: "Spark tokens? From the generators? That sounds swelectrifying! Also what do you mean cooking a Battery?"
      },
      {
        speaker: 'mystic',
        text: "Don't ask me why, ask Soap. And don't get too excited. Generators are loud, messy, and full of Soap's cleaning obsession. But they produce essential electrical tokens called sparks."
      },
      {
        speaker: 'swaria',
        text: "So you want me to collect sparks for your... cooking? Alright... But how are we supposed to cook batteries?"
      },
      {
        speaker: 'mystic',
        text: "... Cook 2 Batteries. Then collect 15 spark tokens, 20 tokens from generator drops, and this last one is only to help Soap, but its really to convince Soap why they need ME to COOK BATTERIES! So generate 10,000 boxes total."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "I collected all those spark tokens! The Generator department is so swenergetic! And we cooked batteries!"
      },
      {
        speaker: 'mystic',
        text: "The Batteries are not for eating, but thank you for the help. You're getting better at following recipes. Keep bringing me quality tokens and I'll keep cooking better meals."
      }
    ],
    status: 'available'
  },

  'mystic_quest_3': {
    id: 'mystic_quest_3',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Quest 3: Prismatic gathering',
    description: 'Collect prismatic ingredients from the Prism Lab.',
    requirements: {
      completedQuests: ['mystic_quest_2']
    },
    objectives: {
      cookChargedPrisma: 3,
      prismaTokens: 20,
      prismClickTokens: 25,
      clickPrismTiles: 500
    },
    rewards: {
      stardust: 25,
      prisma: 100
    },
    dialogue: [
      {
        speaker: 'mystic',
        text: "Now I need prisma shards. The Prism Lab has them, but it's... too flashy for my taste. That's where you come in."
      },
      {
        speaker: 'swaria',
        text: "The Prism Lab! Vi works there, right? It's so colorful and beautiful!"
      },
      {
        speaker: 'mystic',
        text: "Exactly why I avoid it. All those flashing lights give me a headache. But prisma shards are essential for Vi's... Charged Prisma recipe."
      },
      {
        speaker: 'swaria',
        text: "... Another crazy recipe? I assume this recipe won't be swedible. So you want me to collect prisma shards for you?"
      },
      {
        speaker: 'mystic',
        text: "Yes. Lets cook 3 Charged Prisma first. Then collect 20 prisma tokens, 25 tokens from the prism, and click 500 prism tiles yourself."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Swystic! I collected all the prisma shards you needed! Those Charged Prismas are done and I clicked the prism 500 times!"
      },
      {
        speaker: 'mystic',
        text: "Impressive. And don't call me by that name... Anyway, the Charged Prismas actually have proper charged crystalline structure. They will be handful later. You're becoming a decent ingredient collector."
      }
    ],
    status: 'available'
  },

  'mystic_quest_4': {
    id: 'mystic_quest_4',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Quest 4: Culinary Expertise',
    description: 'Cook various dishes and non dishes.',
    requirements: {
      completedQuests: ['mystic_quest_3']
    },
    objectives: {
      cookBerryPlates: 1,
      cookBatteries: 1,
      cookMushroomSoup: 2,
      cookChargedPrisma: 1,
      cookAnyIngredients: 10,
      collectAnyTokens: 50
    },
    rewards: {
      berries: 200,
      mushroom: 150,
      water: 100
    },
    dialogue: [
      {
        speaker: 'mystic',
        text: "Time to test your complete cooking skills. You've been collecting tokens from different departments, now prove you understand my kitchen."
      },
      {
        speaker: 'swaria',
        text: "A cooking test! I've been watching you work and learning from all the swingredients I've collected!"
      },
      {
        speaker: 'mystic',
        text: "Good. No more single-recipe tasks. I want variety - Berry Plates, Batteries, Mushroom Soup, Charged Prisma. Show me range."
      },
      {
        speaker: 'swaria',
        text: "Swawesome! I'll prove I'm not just a token collector but a real chef-in-training!"
      },
      {
        speaker: 'mystic',
        text: "Cook everything: 1 Berry Plate, 1 Battery, 2 Mushroom Soups, 1 Charged Prisma. Plus cook 10 from any ingredients and collect 50 tokens from any departments."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Mystic! I cooked everything you asked for! Look at all this variety, I cooked from every recipe!"
      },
      {
        speaker: 'mystic',
        text: "Finally! You've proven you're not just a token collector but someone who understands my kitchen. These recipes are actually well-prepared, let me tell you a secret about myself."
      },
      {
        speaker: 'mystic',
        text: "I actually really like mushroom soups, they are really tasty, but what if you gave a mushroom soup to the mixer? I'll let you find out what happens."
      },
    ],
    status: 'available'
  },

  'mystic_quest_5': {
    id: 'mystic_quest_5',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Quest 5: Nocturnal Harvest',
    description: 'Stay awake and collect those stardust tokens.',
    requirements: {
      completedQuests: ['mystic_quest_4']
    },
    objectives: {
      stardustTokens: 15,
      nightTimeTokens: 30,
      buyBoxesAtNight: 1000,
      clickPrismTilesAtNight: 750
    },
    rewards: {
      stardust: 200,
      water: 150, 
    },
    dialogue: [
      {
        speaker: 'mystic',
        text: "I need stardust tokens, but they only appear properly at night. You'll have to work the night shift for me."
      },
      {
        speaker: 'swaria',
        text: "Night shift? That sounds spooky but cool! What makes night time so special?"
      },
      {
        speaker: 'mystic',
        text: "Different token types appear more frequently when it's dark. Stardust especially. I can't stay here at night, I have other stuff to do during night time."
      },
      {
        speaker: 'swaria',
        text: "I love the night vibes! But where are you even during the night?"
      },
      {
        speaker: 'mystic',
        text: "I spend the night working on the second floor of the facility, specifically this one vacant room that I've turned into an observatory, where I can observe the stars."
      },
      {
        speaker: 'swaria',
        text: "Wow, that sounds swamazing! Can I visit sometime?"
      },
      {
        speaker: 'mystic',
        text: "You'd need a special key card to access that area. It is also not ready yet. For now, just focus on collecting stardust tokens at night. So here's your task."
      },
      {
        speaker: 'mystic',
        text: "15 stardust tokens, 30 tokens during night hours, buy 1000 boxes at night, and click 750 prism tiles in darkness. Night work only."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Swys- Mystic! Night shift complete! I collected so all the stardust and other tokens!"
      },
      {
        speaker: 'mystic',
        text: "Good work on the night shift. Stardust quality is excellent. You're proving to be a reliable supplier for my advanced recipes."
      }
    ],
    status: 'available'
  },

  'mystic_quest_6': {
    id: 'mystic_quest_6',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Quest 6: Terrarium Token Trek',
    description: 'Collect various tokens from the Terrarium department, do not upset Fluzzer.',
    requirements: {
      completedQuests: ['mystic_quest_5']
    },
    objectives: {
      cookGlitteringPetals: 5,
      petalTokens: 25,
      terrariumRustlingTokens: 30,
      waterFlowers: 2000,
      extractPollen: 10000
    },
    rewards: {
      petals: 300,
      stardust: 250
    },
    dialogue: [
      {
        speaker: 'mystic',
        text: "Last department. The Terrarium has petal tokens I need for the Glittering Petal recipe. But Fluzzer is there, and they really like collecting hoards of petals for themselves."
      },
      {
        speaker: 'swaria',
        text: "Fluzzer! They're so cute and charming! I love watching them work in the terrarium!"
      },
      {
        speaker: 'mystic',
        text: "They may be charming, but if they see you collecting petals, they might get jealous."
      },
      {
        speaker: 'swaria',
        text: "Yeah I did notice their stare when I collected petals in their presence..."
      },
      {
        speaker: 'mystic',
        text: "But its for the better good, because Fluzzer told me about the Glittering Petal recipe. And they will need Glittering Petals for a project of theirs."
      },
      {
        speaker: 'swaria',
        text: "I'll collect all the petal tokens you need! And I'll be careful not to let Fluzzer get jealous!"
      },
      {
        speaker: 'mystic',
        text: "Good, lets cook 5 Glittering Petals. Collect 25 petal tokens, 30 tokens from flower rustling, water 2000 flowers, and click 10000 flowers with the pollen wand."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Mystic! I collected all the terrarium tokens and made those beautiful Glittering Petals! Fluzzer helped by knocking tokens loose!"
      },
      {
        speaker: 'mystic',
        text: "Hmph. At least Fluzzer understood your assignment. The Glittering Petals are perfectly crafted. They might be edible but DO NOT LET FLUZZER EAT THEM, they contain stardust and... consuming stardust is illegal."
      },
      {
        speaker: 'swaria',
        text: "ILLEGAL?! But why is stardust illegal to consume?"
      },
      {
        speaker: 'mystic',
        text: "Because stardust has properties that can alter cognitive functions. Consuming it can lead to unpredictable side effects. It's strictly regulated."
      },
    ],
    status: 'available'
  },

  'mystic_quest_7': {
    id: 'mystic_quest_7',
    character: 'mystic',
    department: 'Kitchen',
    title: 'Mystic\'s Ultimate Challenge',
    description: 'Everything comes together in this final test.',
    requirements: {
      completedQuests: ['mystic_quest_6']
    },
    objectives: {
      cookAnyIngredients: 15,
      cookBerryPlates: 2,
      cookMushroomSoup: 2,
      cookBatteries: 2,
      cookChargedPrisma: 2,
      cookGlitteringPetals: 2,
      collectAnyTokens: 100,
      cargoTokensFromBoxes: 20,
      generatorTokensFromBoxes: 20,
      prismClickTokens: 20,
      terrariumRustlingTokens: 20,
      nightTimeTokens: 20,
      buyBoxes: 3000,
      generateBoxes: 50000,
      clickPrismTiles: 500,
      clickFlowersTotal: 4000
    },
    rewards: {
      berries: 200,
      stardust: 50,
    },
    dialogue: [
      {
        speaker: 'mystic',
        text: "You've proven yourself as my token supplier across all departments. Now for the ultimate test, a massive cooking and ingredient collection task awaits."
      },
      {
        speaker: 'swaria',
        text: "The ultimate test?! I'm so ready! I've learned so much about collecting tokens for these swawesome recipes!"
      },
      {
        speaker: 'mystic',
        text: "This will push your skills to the limit. Tokens from every department, interactions with all department systems. No shortcuts, no cheating, and at the end of this you'll be better than Gordon Ramsay himself. Maybe not."
      },
      {
        speaker: 'swaria',
        text: "Swawesome! The ultimate challenge for the ultimate token collector and chef-in-training!"
      },
      {
        speaker: 'mystic',
        text: "Alright, I'll tell your task, just don't faint on me... Cook 15 ingredients total, cook 2 of each Berry/Soup/Battery, cook 2 of each Prisma/Petal, collect 100 tokens, 20 tokens from each department, plus the rest."
      },
      {
        speaker: 'swaria',
        text: "Sweeehhh... I have a department to maintain you know... Boxes to open..."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "MYSTIC! I'M DONE!"
      },
      {
        speaker: 'mystic',
        text: "Incredible. You've exceeded my expectations completely. These recipes are professional-quality, and your token collection skills are unmatched."
      },
      {
        speaker: 'swaria',
        text: "This journey has been so swawesome! But this last task was not fun."
      },
      {
        speaker: 'mystic',
        text: "I'm glad you've noticed. You've earned this special recognition code: 'no fun allowed'. Use it wisely. And continue being my premium token supplier."
      },
      {
        speaker: 'swaria',
        text: "A secret code?! Swawesome! Maybe this was worth it. So what's next in our cooking partnership?"
      },
      {
        speaker: 'mystic',
        text: "Keep collecting tokens for me. I'll have more tasks for you. Just come back and I'll tell you what I need."
      }
    ],
    status: 'available'
  },

  'lepre_quest_1': {
    id: 'lepre_quest_1',
    character: 'lepre',
    department: 'Boutique',
    title: 'Employee Wellness Program',
    description: 'Test out 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒\'s new employee benefit program managed by their official merchant, Lepre.',
    status: 'available',
    requirements: {
      // Available when boutique is unlocked
    },
    objectives: {
      tokensPurchased: new Decimal(10), // Buy 10 tokens from lepre's shop
      berryTokensPurchased: new Decimal(2), // Buy 2 berry tokens specifically
      freeBucksClaimed: new Decimal(2) // Claim free swa bucks 2 times
    },
    rewards: {
      swabucks: 15, // Reward some swa bucks
      berries: 3, // Berry tokens
      petals: 2   // Petal tokens
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Wait... is that a gift shop? Inside a research facility? How does that even work?"
      },
      {
        speaker: 'lepre',
        text: "Well, well! Welcome to my officially authorized boutique! I'm Lepre, former court jester turned into a professional merchant!"
      },
      {
        speaker: 'swaria',
        text: "Authorized? Who gave you permission to set up shop in here?"
      },
      {
        speaker: 'lepre',
        text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 themselves, of course! They were absolutely delighted when I proposed bringing premium retail services to the facility. Said it would boost morale tremendously!"
      },
      {
        speaker: 'swaria',
        text: "Ugh Really? 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 approved this? That's... actually pretty progressive of them.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Oh yes! They're very forward-thinking when it comes to employee amenities. In fact, they specifically requested I focus on token commerce, said the workers here needed better access to quality tokens!"
      },
      {
        speaker: 'swaria',
        text: "Wow, I had no idea they... cared about that kind of thing. So you're like... officially part of the facility now?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Absolutely! I have full merchant credentials and everything! They even gave me this prime location because they said my jester background would make shopping more entertaining for everyone!"
      },
      {
        speaker: 'swaria',
        text: "That's actually brilliant! A entertainer-merchant combo. What exactly do you sell here?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Tokens! All the finest tokens you could want! I deal exclusively in Swa Bucks, 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's preferred currency for all internal transactions. Much more sophisticated than those crude royal coins!"
      },
      {
        speaker: 'swaria',
        text: "Swa Bucks? I've heard of these before, 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 actually started distributing them? How do I get some?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Yes! And its part of my official mandate to distribute complimentary starter Swa Bucks to new customers! It's all part of 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's employee wellness program!"
      },
      {
        speaker: 'swaria',
        text: "Free money from 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒? That's generous of them I guess...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Precisely! They're very invested in ensuring everyone has access to premium tokens. Now, to properly demonstrate the system they've authorized, I need you to experience the full boutique service!"
      },
      {
        speaker: 'lepre',
        text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 gave me specific testing protocols to follow with new customers. Purchase 10 tokens from my stocked inventory, also specifically buy 2 berry tokens as 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 requested for their data collection, and claim your complimentary Swa Bucks twice to test their distribution system!"
      },
      {
        speaker: 'swaria',
        text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 want specific data on berry token purchases? Ugh really? And I bet you want me to buy them from you...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Oh yes! They're very methodical about their employee wellness research. Every task I give you comes directly from their official testing protocols! They want to ensure the program works perfectly before expanding it facility-wide."
      },
      {
        speaker: 'lepre',
        text: "So come back when all of this is done."
      },
      {
        speaker: 'swaria',
        text: "Alright Lepre, I'll play along with 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's little experiment. But this better be worth it...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Lepre. I've completed the test program, bought 10 tokens, got the berry tokens, and claimed the complimentary Swa Bucks twice!",
      },
      {
        speaker: 'lepre',
        text: "Perfect! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 will be absolutely thrilled with these results! You've completed their official testing protocols perfectly!"
      },
      {
        speaker: 'swaria',
        text: "Well I sure am glad I could help with their research... I guess.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Exactly as 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 predicted! They specifically designed these tasks to test both the commerce system and employee engagement. Your performance exceeded their expectations!"
      },
      {
        speaker: 'swaria',
        text: "They really thought of everything huh! You're perfect for implementing their program.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Why thank you! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 said the same thing during my official merchant certification process. They were very specific about which tasks to assign to test subjects, I mean, valued employees like yourself!"
      },
      {
        speaker: 'swaria',
        text: "Test subjects? That's an interesting way to put it...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Research participants! Yes, that's the official term they use. All very scientific and professional, you understand!"
      },
      {
        speaker: 'swaria',
        text: "Well, their employee program is definitely... working! This has been... okay.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Perfect! As authorized by 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒, here are your official test completion rewards from the premium token reserve they provided me!"
      },
      {
        speaker: 'lepre',
        text: "Extra Swa Bucks as a program participation bonus, plus some berry and petal tokens from 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒, all as specified in their reward protocols!"
      },
      {
        speaker: 'swaria',
        text: "Hurray... tokens from 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒... just what I always wanted...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 spare no expense when it comes to worker satisfaction! They've authorized me to expand the program and assign additional tasks based on these successful test results."
      },
      {
        speaker: 'swaria',
        text: "Additional tasks? Great... more work for me...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Absolutely! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 have a whole series of employee engagement protocols they want me to implement. Keep checking back, they've authorized me to roll out even more exciting tasks and benefits in the future!"
      }
    ],
    status: 'available'
  },

  'lepre_quest_2': {
    id: 'lepre_quest_2',
    character: 'lepre',
    department: 'Boutique',
    title: 'Advanced Employee Benefits',
    description: 'Experience 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒\'s expanded employee benefit program with premium token access.',
    status: 'available',
    requirements: {
      completedQuests: ['lepre_quest_1'] // Must complete first quest
    },
    objectives: {
      tokensPurchased: new Decimal(15), // Buy 15 tokens from lepre's shop
      berryTokensPurchased: new Decimal(5), // Buy 5 berry tokens specifically
      waterTokensPurchased: new Decimal(3), // Buy 3 water tokens specifically
      premiumTokensPurchased: new Decimal(1), // Buy 1 premium token (any from premium category)
      freeBucksClaimed: new Decimal(3) // Claim free swa bucks 3 times
    },
    rewards: {
      swabucks: 25, // More swa bucks than quest 1
      berries: 5, // More berry tokens
      petals: 3,   // More petal tokens
      water: 2,    // Water tokens as reward
      prisma: 1    // Premium prisma token
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I'm back. What are these additional tasks you mentioned?",
      },
      {
        speaker: 'lepre',
        text: "Ah! Perfect timing! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 have been absolutely thrilled with your initial performance results. They've authorized me to offer you their advanced employee benefits program!"
      },
      {
        speaker: 'swaria',
        text: "Advanced benefits? ...what exactly does that involve?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Only the finest premium token access 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 can provide! They've specifically requested expanded testing of their token distribution systems and want to evaluate your eligibility for premium tier access."
      },
      {
        speaker: 'swaria',
        text: "Premium tier access? I didn't know there were tiers...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Oh yes! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 has implemented a sophisticated tier system! Some tokens are worth more than others, depending on their rarity and demand. Your excellent performance has caught their attention, and they want to see if you qualify for enhanced privileges!"
      },
      {
        speaker: 'swaria',
        text: "Enhanced privileges from 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒? I thought these rarer tokens were gained from crafting them, or cooking them.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "..."
      },
      {
        speaker: 'lepre',
        text: "Oh no no no, this mentality of crafting or cooking these tokens is what Mystic wants you to think. Look, I know 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 might seem demanding, but trust me, stick with their program. I've heard whispers about something truly spectacular planned for the 10th assignment."
      },
      {
        speaker: 'swaria',
        text: "The 10th assignment? What kind of spectacular?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Can't say too much yet, but... let's just say 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 have something very special reserved for their most dedicated employees. Worth pushing through any frustrations you might have."
      },
      {
        speaker: 'swaria',
        text: "I see. Well then, what do they need for this evaluation?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "For this evaluation, they need comprehensive data on premium token interactions. Purchase 15 tokens total, including 5 berry tokens and 3 water tokens specifically for their hydration initiative research."
      },
      {
        speaker: 'swaria',
        text: "Hydration initiative? They really do think of everything, don't they... absurd.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "And here's the exciting part, they've authorized me to offer you access to premium tier tokens! Purchase any single premium token to demonstrate your readiness for elevated access levels."
      },
      {
        speaker: 'swaria',
        text: "Premium tokens... how much do those cost exactly?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "That's the beauty of 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's program, they're subsidizing the cost! Normally premium tier token will cost 200 Swa Bucks! But for you, they will only cost between 20-50 Swa Bucks! Plus, claim your complimentary Swa Bucks three times to fully test their enhanced distribution protocol."
      },
      {
        speaker: 'swaria',
        text: "Well I suppose if 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 are paying for it... I'll participate in their 'evaluation'.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Excellent! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 will be very pleased. Return when you've completed all the premium access requirements!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I've completed your premium evaluation. 15 tokens purchased, including the berry and water tokens, plus I bought a premium token and claimed the free bucks three times.",
      },
      {
        speaker: 'lepre',
        text: "Outstanding! The data you've provided will be invaluable for 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's premium access algorithms. Your performance metrics are truly impressive!"
      },
      {
        speaker: 'swaria',
        text: "So... do I get this 'premium tier access' they mentioned?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Even better! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 are so pleased with your results that they've authorized immediate premium rewards from their executive token reserve!"
      },
      {
        speaker: 'swaria',
        text: "Executive token reserve? Right, very official.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "The most official! Enhanced Swa Bucks, premium berry plates, batteries! All as specified in 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's advanced reward protocols!"
      },
      {
        speaker: 'swaria',
        text: "I have to admit, these rewards are actually pretty good, shocking.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "See? Keep up this performance and that special 10th assignment I mentioned? You'll definitely qualify for whatever extraordinary reward they have planned."
      },
      {
        speaker: 'swaria',
        text: "More programs? Well if they keep giving rewards like this... I might not mind participating."
      },
      {
        speaker: 'lepre',
        text: "Perfect attitude! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's employee development pipeline has many more opportunities ahead. Keep checking back, your premium access journey is just beginning!"
      }
    ],
    status: 'available'
  },

  'lepre_quest_3': {
    id: 'lepre_quest_3',
    character: 'lepre',
    department: 'Boutique',
    title: 'Employee Token Distribution Research',
    description: 'Research the token preference for the workers by distributing specific tokens to facility staff and continuing token purchases from 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒\'s boutique program.',
    status: 'available',
    requirements: {
      completedQuests: ['lepre_quest_2'] // Must complete second quest
    },
    objectives: {
      berriesGiven: new Decimal(5), // Give 5 berries to any worker
      petalsGiven: new Decimal(3), // Give 3 petals to any workers
      waterGiven: new Decimal(2), // Give 2 water to any workers
      prismaGiven: new Decimal(1), // Give 1 prisma shard to any worker
      tokensPurchased: new Decimal(20) // Buy 20 tokens from lepre's shop
    },
    rewards: {
      swabucks: 35, // Even more swa bucks
      berries: 8, // More berry tokens
      petals: 5,   // More petal tokens
      water: 3,    // More water tokens
      prisma: 2    // More premium prisma tokens
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I'm back again. What does 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 want now?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Wah, back already! Alright let me think... Ah yes!"
      },
      {
        speaker: 'lepre',
        text: "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 have been analyzing your performance data and they're impressed! So impressed, in fact, that they want to expand their research scope."
      },
      {
        speaker: 'swaria',
        text: "Research scope? What kind of research?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Token distribution research! 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 want to understand worker token preferences across the entire facility. They want you to conduct this research personally since you know the facility's staff the most."
      },
      {
        speaker: 'swaria',
        text: "Uhh no... I think that would be Tico. They are the one who interacts with everyone else since they are the manager.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Oh uh, right..."
      },
      {
        speaker: 'lepre',
        text: "Well, what matters is they want you to expand into behavioral research! Specifically studying how different workers respond to token gifts."
      },
      {
        speaker: 'swaria',
        text: "They want me to study the other workers? That feels... invasive. But I guess Tico would say the same thing.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Exactly! And no no no, its not disturbing! It's innovative! Think of the insights we'll gain into optimal worker satisfaction protocols. Plus, 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 are providing premium tokens from their executive reserve as compensation!"
      },
      {
        speaker: 'swaria',
        text: "So what exactly do they want me to do?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Simple! Distribute tokens to workers around the facility to test their preferences. Give 5 berries, 3 petals, 2 water tokens, and 1 prisma shard to any workers. Mix and match however you like!"
      },
      {
        speaker: 'swaria',
        text: "And I assume I need to keep buying tokens from your shop too?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Naturally! Purchase 20 more tokens to maintain your standing in their program. 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 need consistent data on purchasing patterns alongside the distribution research... ^And I need the money to keep restocking the shop ahah..."
      },
      {
        speaker: 'swaria',
        text: "Fine. But I want to know more about how they've been collecting data on me and the other workers. This whole thing feels orchestrated.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Uhh! Complete this research phase and 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 might authorize me to share more about their long-term initiatives. For now, focus on the token distribution!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I've completed the token distribution research.",
      },
      {
        speaker: 'lepre',
        text: "Outstanding work! Your preliminary analysis is already showing fascinating patterns in worker token preferences. 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 is thrilled with the data quality!"
      },
      {
        speaker: 'swaria',
        text: "Oh I'm sure they are super thrilled... even '𝑒𝒸𝓈𝓉𝒶𝓉𝒾𝒸'.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'swaria',
        text: "And what exactly are you reporting back to them about me and the other workers?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Well, I can tell you that certain workers show strong preferences for specific token types, while others are more flexible. But the detailed analysis is classified above my clearance level!"
      },
      {
        speaker: 'swaria',
        text: "Clearance level? Lepre, this is starting to sound less like employee benefits and more like surveillance.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Surveillance? No no no! Just... comprehensive employee optimization research! Look, I promise the rewards are legitimate. Premium tokens directly from their executive vault!"
      },
      {
        speaker: 'swaria',
        text: "The rewards are good, I'll give you that I guess... But I want answers about how they've been monitoring me and this 'research' before I do any more assignments.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "I understand your concerns! But... I'm afraid I can't diclose too much since 𝒯𝒽𝑒 𝒮𝓌-"
      },
      {
        speaker: 'swaria',
        text: "Lepre, I've noticed you snooping around the prism lab while I was working there. What were you looking for?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "...Uh, nothing! Just... gathering these prisma shards for restocking! Y-yes, that's it!"
      },
      {
        speaker: 'swaria',
        text: "Mhh, sure Lepre. Just make sure 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 know I'm serious about getting answers before I do any more of their assignments.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "U-Understood! I'll relay your concerns to 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 right away. For now, please accept these tokens as their appreciation for your research!"
      },
    ],
    status: 'available'
  },

  'lepre_quest_4': {
    id: 'lepre_quest_4',
    character: 'lepre',
    department: 'Boutique',
    title: 'Tokens Discovery & Special Preparations',
    description: 'Help Lepre gather resources from across facility departments while they prepare a special surprise activity for all workers.',
    status: 'available',
    requirements: {
      completedQuests: ['lepre_quest_3'] // Must complete third quest
    },
    objectives: {
      tokensCollected: new Decimal(20), // Collect 20 tokens from any department
      batteriesCrafted: new Decimal(1), // Cook a battery from the kitchen
      tokensGiven: new Decimal(30), // Give 30 tokens to any characters
      tokensPurchased: new Decimal(30) // Buy 30 tokens from lepre's shop
    },
    rewards: {
      swabucks: 50, // Substantial reward
      berries: 12, // More berry tokens
      petals: 8,   // More petal tokens
      water: 5,    // More water tokens
      prisma: 3,   // More premium prisma tokens
      batteries: 1  // Special battery reward
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I'm here for another assignment. What is it this time?",
      },
      {
        speaker: 'lepre',
        text: "Ah, perfect timing! I've been exploring the facility lately, chatting with the other department staff, and I've discovered something fascinating!"
      },
      {
        speaker: 'swaria',
        text: "Exploring? You mean gathering more data for your... employers?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Well, yes, but also- Actually, let me focus on the exciting part! I've found that tokens can be discovered in so many creative ways throughout our facility!"
      },
      {
        speaker: 'swaria',
        text: "Oh really... I already know this.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "The kitchen can craft amazing things like batteries! The generators produce tokens naturally! It's like a whole ecosystem of resource generation!"
      },
      {
        speaker: 'swaria',
        text: "That's the whole point of this facility, to produce materials. But why are you telling me this now? I bet you've made this 𝓈𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒 discovery while snooping around.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'swaria',
        text: "I saw you lurking near the control center. Got any explanation for that?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "..."
      },
      {
        speaker: 'lepre',
        text: "I-"
      },
      {
        speaker: 'lepre',
        text: "I was..."
      },
      {
        speaker: 'lepre',
        text: "I was just passing by! Yes, that's it! Just happened to bee passing by the control center ahah..."
      },
      {
        speaker: 'lepre',
        text: "Anyway, Besides I'm planning something special! A facility-wide activity that all the workers will enjoy. But I need resources to make it happen, a lot of tokens!"
      },
      {
        speaker: 'swaria',
        text: "A special activity? What kind of activity?",
      },
      {
        speaker: 'lepre',
        text: "It's a surprise! But think... tokens, friendship, maybe some friendly competition between departments? Everyone deserves something fun after all their hard work!"
      },
      {
        speaker: 'swaria',
        text: "That actually sounds nice. So what do you need from me?",
      },
      {
        speaker: 'lepre',
        text: "Help me gather resources! Collect 20 tokens from any departments! Plus, I will need a battery for this, so craft a battery for me!"
      },
      {
        speaker: 'swaria',
        text: "A battery? Alright, I can cook that up in Mystic's kitchen.",
      },
      {
        speaker: 'lepre',
        text: "WHAT!? YOU COOK BATTERIES??? FASCINATING! I had no idea! This facility never ceases to amaze me!"
      },
      {
        speaker: 'swaria',
        text: "And let me guess, more token purchases from your shop? To satisfy 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 employee wellness program or whatever.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "30 tokens, yes! But also give 30 tokens to other workers, spread some joy around! This is about community building, not just... well, you know... data collection."
      },
      {
        speaker: 'swaria',
        text: "Alright, I'm intrigued by this 'special activity' idea. But Lepre, I hope you're being genuine about this community focus. I'm trusting you here.",
      },
      {
        speaker: 'lepre',
        text: "I promise! This one is really about making everyone happy. The other... assignments... can wait. Sometimes the best research is just seeing people smile!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I've completed everything. Is this special activity ready now?",
      },
      {
        speaker: 'lepre',
        text: "Fantastic! But not quite yet, I may need a second battery for my activity to work, and more tokens, but I will appreciate your help."
      },
      {
        speaker: 'swaria',
        text: "Understandable...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'swaria',
        text: "So what's this special activity you've been planning? Can you tell me now?",
      },
      {
        speaker: 'lepre',
        text: "Well... I'm still putting the finishing touches on it! And I wanna keep it a surprise for everyone else too!"
      },
      {
        speaker: 'swaria',
        text: "Alright, fair enough. When will it be ready?",
      },
      {
        speaker: 'lepre',
        text: "Soon! I'm aiming to launch it within the next few days. I'll make sure to personally invite you to be one of the first participants!"
      },
      {
        speaker: 'swaria',
        text: "I have to admit, this is the first time one of your quests has felt genuinely positive. I hope you keep this community focus going.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Thank you! Sometimes it's good to step back from all the... corporate requirements... and remember why we're here. To make this place better for everyone!"
      },
      {
        speaker: 'swaria',
        text: "Exactly. Though I still want those answers about the surveillance eventually.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Of course! But for now, please enjoy these tokens as a thank you for helping with the expo preparations. You've earned every one!"
      }
    ],
    status: 'available'
  },

  'lepre_quest_5': {
    id: 'lepre_quest_5',
    character: 'lepre',
    department: 'Boutique',
    title: 'Final Preparations',
    description: 'Complete the final preparations for Lepre\'s special activity.',
    status: 'available',
    requirements: {
      completedQuests: ['lepre_quest_4'] // Must complete fourth quest
    },
    objectives: {
      tokensCollected: new Decimal(30), // Collect 30 tokens from any department
      batteriesCrafted: new Decimal(2), // Cook 2 batteries from the kitchen
      tokensGiven: new Decimal(50), // Give 50 tokens to any characters
      tokensPurchased: new Decimal(50), // Buy 50 tokens from lepre's shop
      premiumTokensPurchased: new Decimal(5), // Buy 5 premium tokens from "better" category
      freeSwaCollected: new Decimal(5), // Collect free swa bucks 5 times
      powerChallengeRecord: new Decimal(30) // Get a personal best of 30 seconds in power generator challenge
    },
    rewards: {
      swabucks: 75, // Increased reward
      berries: 18, // More berry tokens
      petals: 12,   // More petal tokens
      water: 8,    // More water tokens
      prisma: 5,   // More premium prisma tokens
      batteries: 2  // Double battery reward
    },
    dialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, I'm back! How are the preparations for your special activity going?",
      },
      {
        speaker: 'lepre',
        text: "Perfect timing! Unfortunately, I need a bit more help to get everything ready!"
      },
      {
        speaker: 'swaria',
        text: "Still need help? What do you need this time?",
      },
      {
        speaker: 'lepre',
        text: "Well, I need to finish up everything I've been making... I'll need another battery."
      },
      {
        speaker: 'lepre',
        text: "Actually, make 2 batteries this time!"
      },
      {
        speaker: 'swaria',
        text: "Two batteries? Alright, I can do that. What else?",
      },
      {
        speaker: 'lepre',
        text: "And I'll need more tokens too, collect 30 more tokens from any departments, does not matter which one, and give out 50 tokens to any of the facility's staff! And make sure to get them excited for what I have planned!"
      },
      {
        speaker: 'swaria',
        text: "That's a lot of token sharing! The staff are going to love that. What else?",
      },
      {
        speaker: 'lepre',
        text: "I also need you to buy 50 more tokens from my shop, and this time, also buy 5 of my premium tokens!"
      },
      {
        speaker: 'swaria',
        text: "Premium tokens? Those are quite expensive! This must be really important for the 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 data collecting...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Oh trust me, this is not a part of the task 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 told me! The task 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 wants me to give you is to collect those free swa bucks 5 times."
      },
      {
        speaker: 'lepre',
        text: "The reason for the many token purchases is because I need to have enough Swa bucks to purchase the rest of the materials myself."
      },
      {
        speaker: 'swaria',
        text: "Alright... But why would the 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 only need data from the free Swa bucks? That does not sound right... 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 would surely want more than just that.",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "..."
      },
      {
        speaker: 'lepre',
        text: "Well, um, maybe this time it's a bit different... That's all they ordered me to give you this time."
      },
      {
        speaker: 'swaria',
        text: "Hmph. Fine. What else do you need?",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Well, I need you to test something for me. There's this power generator challenge Soap has created, and I need you to collect data about how it works, so try to survive for at least 30 seconds and tell me how it felt!"
      },
      {
        speaker: 'swaria',
        text: "Soap's challenge game? Why do you need me to test that?",
      },
      {
        speaker: 'lepre',
        text: "It's part of my special activity! I want to make sure it's balanced, challenging but not impossible. You're one of our most capable workers!"
      },
      {
        speaker: 'swaria',
        text: "But can't you just play it yourself again? You're at the top of the Soap challenge leaderboard after all.",
      },
      {
        speaker: 'lepre',
        text: "Well yes but I can't very well test it myself and get unbiased data! I need someone else to try it out and give me feedback! And Soap already sees my skills as suspicious."
      },
      {
        speaker: 'swaria',
        text: "They're not wrong for thinking that, your score is suspiciously high...",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Yeah, But I promise its all skills coming from my jester career! No cheating involved! Please help me out here!"
      },
      {
        speaker: 'swaria',
        text: "Alright Lepre, I'll get all of this done. Your mysterious activity better live up to all this preparation!",
        image: getSwariaGrudgeImage,
        speakingImage: getSwariaGrudgeSpeakingImage
      },
      {
        speaker: 'lepre',
        text: "Oh, it will! I promise this will be something special that brings the whole facility together!"
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Lepre, everything is complete!",
      },
      {
        speaker: 'lepre',
        text: "Wonderful! My special activity is also functional and ready!"
      },
      {
        speaker: 'swaria',
        text: "Swawesome! So what is this special activity?",
      },
      {
        speaker: 'lepre',
        text: "let me introduce you to the token challenge!"
      },
      {
        speaker: 'swaria',
        text: "Token challenge! Sounds exciting!",
      },
      {
        speaker: 'lepre',
        text: "Yes! Its a token sorting memory challenge! Workers from all departments can participate!"
      },
      {
        speaker: 'lepre',
        text: "It may be similar to Soap's power generator challenge, but this one focuses more on memory and quick thinking! Plus, everyone gets to keep a third of the tokens they sort correctly!"
      },
      {
        speaker: 'lepre',
        text: "And I want you to try it out now! Show me how well you do!",
      },
      {
        speaker: 'swaria',
        text: "Swawesome! I'll give it my best shot! But also, is this the special reward you teased me about the 10th task?",
      },
      {
        speaker: 'lepre',
        text: "Oh no its not, But I can give you a hint for helping me out with all of 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 tasks they want me to give you."
      },
      {
        speaker: 'lepre',
        text: "So let's just say... you might not have to work alone anymore. A helpful companion might join you on your adventures around the facility!"
      },
      {
        speaker: 'swaria',
        text: "A companion? That sounds intriguing! Now I'm even more motivated to keep helping you with these quests.",
      },
      {
        speaker: 'lepre',
        text: "Excellent! For now though, please accept these rewards for all your hard work. And enjoy my token sorting challenge!"
      }
    ],
    status: 'available'
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
  
  // Initialize power cap bonuses from completed Soap quests
  initializeSoapQuestPowerBonuses();
  
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
      
      // Check if quest is work in progress
      if (quest.requirements && quest.requirements.wip) {
        requirementsMet = false;
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
  // First clean up any WIP quests that shouldn't be claimable
  cleanupWipQuests();
  
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
  if (characterName === 'lepre') {
    addLepreQuestGlow();
    return;
  }
  
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg',
    'mystic': '#kitchenCharacterImg'
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
  if (characterName === 'lepre') {
    addLepreCompletionGlow();
    return;
  }
  
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg',
    'mystic': '#kitchenCharacterImg'
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
  if (characterName === 'lepre') {
    removeLepreQuestGlow();
    return;
  }
  
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg',
    'mystic': '#kitchenCharacterImg'
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
  if (characterName === 'lepre') {
    removeLepreCompletionGlow();
    return;
  }
  
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg',
    'mystic': '#kitchenCharacterImg'
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
  if (characterName === 'lepre') {
    addLepreSleepingGlow();
    return;
  }
  
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg',
    'mystic': '#kitchenCharacterImg'
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
  if (characterName === 'lepre') {
    removeLepreSleepingGlow();
    return;
  }
  
  const characterSelectors = {
    'soap': '#swariaGeneratorCharacter',
    'hardmodeswaria': '#hardModeSwariaImg',
    'mystic': '#kitchenCharacterImg'
  };
  
  const selector = characterSelectors[characterName];
  if (!selector) return;
  
  const characterElement = document.querySelector(selector);
  if (characterElement) {
    characterElement.classList.remove('quest-sleeping');
  }
}

// Lepre-specific glow functions that handle all character variants
function getAllLepreCharacterElements() {
  return [
    document.getElementById('lepreCharacterImage'),
    document.getElementById('lepreCharacterSpeaking'),
    document.getElementById('lepreCharacterThanks'),
    document.getElementById('lepreCharacterMad'),
    document.getElementById('lepreCharacterMadSpeaking'),
    document.getElementById('lepreCharacterAngry'),
    document.getElementById('lepreCharacterAngrySpeaking')
  ].filter(element => element !== null);
}

function getCurrentlyVisibleLepreElement() {
  const allElements = getAllLepreCharacterElements();
  return allElements.find(element => element.style.display !== 'none') || allElements[0];
}

function addLepreQuestGlow() {
  const allElements = getAllLepreCharacterElements();
  if (allElements.length === 0) {
    setTimeout(() => addLepreQuestGlow(), 1000);
    return;
  }
  
  allElements.forEach(element => {
    if (!element.classList.contains('quest-available')) {
      element.classList.add('quest-available');
      
      // Add click event listener for quest claiming
      if (!element.dataset.questClickHandler) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCharacterQuestClick('lepre');
        });
        element.dataset.questClickHandler = 'true';
      }
    }
  });
}

function addLepreCompletionGlow() {
  const allElements = getAllLepreCharacterElements();
  if (allElements.length === 0) {
    setTimeout(() => addLepreCompletionGlow(), 1000);
    return;
  }
  
  allElements.forEach(element => {
    if (!element.classList.contains('quest-complete')) {
      element.classList.add('quest-complete');
      
      // Create completion indicator for each element (but only show on visible one)
      createQuestCompletionIndicator(element);
      
      // Add click event listener for quest turn-in
      if (!element.dataset.questTurnInHandler) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCharacterTurnInClick('lepre');
        });
        element.dataset.questTurnInHandler = 'true';
      }
    }
  });
}

function addLepreSleepingGlow() {
  const allElements = getAllLepreCharacterElements();
  if (allElements.length === 0) {
    setTimeout(() => addLepreSleepingGlow(), 1000);
    return;
  }
  
  allElements.forEach(element => {
    element.classList.add('quest-sleeping');
  });
}

function removeLepreQuestGlow() {
  const allElements = getAllLepreCharacterElements();
  allElements.forEach(element => {
    element.classList.remove('quest-available');
  });
}

function removeLepreCompletionGlow() {
  const allElements = getAllLepreCharacterElements();
  allElements.forEach(element => {
    element.classList.remove('quest-complete');
    
    // Remove completion indicators
    const indicator = element.parentElement.querySelector('.quest-completion-indicator');
    if (indicator) {
      indicator.remove();
    }
  });
}

function removeLepreSleepingGlow() {
  const allElements = getAllLepreCharacterElements();
  allElements.forEach(element => {
    element.classList.remove('quest-sleeping');
  });
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
    // Check if we're in a lepre quest and should use grudge images
    if (window.state && window.state.questSystem && window.state.questSystem.currentDialogue) {
      const currentQuestId = window.state.questSystem.currentDialogue.questId;
      if (currentQuestId === 'lepre_quest_1' || currentQuestId === 'lepre_quest_2' || currentQuestId === 'lepre_quest_3' || currentQuestId === 'lepre_quest_4' || currentQuestId === 'lepre_quest_5') {
        return speaking ? getSwariaGrudgeSpeakingImage() : getSwariaGrudgeImage();
      }
    }
    
    // Check for Halloween mode first
    if (window.state && window.state.halloweenEventActive && window.getHalloweenPeachyImage) {
      return window.getHalloweenPeachyImage(speaking ? 'speech' : 'normal');
    }
    
    if (window.premiumState && window.premiumState.bijouEnabled) {
      return speaking ? 'assets/icons/peachy and bijou talking.png' : 'assets/icons/peachy and bijou.png';
    }
    return speaking ? 'swa talking.png' : 'swa normal.png';
  }
  
  const images = {
    soap: speaking ? (window.getHalloweenSoapImage ? window.getHalloweenSoapImage('speech') : 'assets/icons/soap speech.png') : (window.getHalloweenSoapImage ? window.getHalloweenSoapImage('normal') : 'assets/icons/soap.png'),
    mystic: speaking ? (window.getHalloweenMysticImage ? window.getHalloweenMysticImage('speech') : 'assets/icons/chef mystic speech.png') : (window.getHalloweenMysticImage ? window.getHalloweenMysticImage('normal') : 'assets/icons/chef mystic.png'),
    fluzzer: speaking ? 'assets/icons/fluzzer talking.png' : 'assets/icons/fluzzer.png',
    vi: speaking ? 'assets/icons/vivien talking.png' : 'assets/icons/vivien.png',
    lepre: speaking ? (window.getHalloweenLepreImage ? window.getHalloweenLepreImage('speech') : 'assets/icons/lepre speech.png') : (window.getHalloweenLepreImage ? window.getHalloweenLepreImage('normal') : 'assets/icons/lepre.png'),
    tico: speaking ? (window.getHalloweenTicoImage ? window.getHalloweenTicoImage('speech') : 'assets/icons/tico speech.png') : (window.getHalloweenTicoImage ? window.getHalloweenTicoImage('normal') : 'assets/icons/tico.png'),
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

// Process dialogue text to add animations for special words
function processDialogueText(text) {
  let processedText = text;
  
  // Check if text contains the special "swawesome" word in fancy Unicode
  if (processedText.includes('𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒')) {
    // Replace the fancy Unicode word with animated version
    processedText = processedText.replace('𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒', createWaveAnimation('𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒'));
  }
  
  // Check if text contains "ecstatic" word in fancy Unicode
  if (processedText.includes('𝑒𝒸𝓈𝓉𝒶𝓉𝒾𝒸')) {
    // Replace the fancy Unicode word with animated version
    processedText = processedText.replace('𝑒𝒸𝓈𝓉𝒶𝓉𝒾𝒸', createWaveAnimation('𝑒𝒸𝓈𝓉𝒶𝓉𝒾𝒸'));
  }
  
  // Check if text contains "1%" and add animation
  if (processedText.includes('1%')) {
    processedText = processedText.replace('1%', createWaveAnimation('1%'));
  }
  
  return processedText;
}

// Create wave animation for text
function createWaveAnimation(word) {
  const letters = Array.from(word);
  let animatedLetters = letters.map((letter, index) => {
    const delay = index * 0.15; // Stagger the animation with more delay for smoother wave
    return `<span style="
      display: inline-block;
      animation: swawesomeWave 2.5s ease-in-out infinite;
      animation-delay: ${delay}s;
      font-weight: bold;
      color: #ff4757;
      text-shadow: 0 0 8px rgba(255, 71, 87, 0.6), 0 0 15px rgba(255, 71, 87, 0.3);
      transform-origin: center bottom;
    ">${letter}</span>`;
  }).join('');
  
  return animatedLetters;
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
    <style>
      @keyframes swawesomeWave {
        0% { transform: translateY(0px) scale(1); }
        25% { transform: translateY(-12px) scale(1.05); }
        50% { transform: translateY(-15px) scale(1.1); }
        75% { transform: translateY(-8px) scale(1.02); }
        100% { transform: translateY(0px) scale(1); }
      }
    </style>
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
              ${processDialogueText(currentLine.text)}
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
              ${processDialogueText(currentLine.text)}
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
      const startingFeathers = window.state.feathers ? (DecimalUtils.isDecimal(window.state.feathers) ? window.state.feathers : new Decimal(window.state.feathers)) : new Decimal(0);
      const startingArtifacts = window.state.artifacts ? (DecimalUtils.isDecimal(window.state.artifacts) ? window.state.artifacts : new Decimal(window.state.artifacts)) : new Decimal(0);
      const startingCommonBoxes = getCommonBoxCount();
      const startingUncommonBoxes = getUncommonBoxCount();
      const startingRareBoxes = getRareBoxCount();
      const startingMythicBoxes = getMythicBoxCount();
      const startingLegendaryBoxes = getLegendaryBoxCount();
      const startingPrismClicks = window.state.prismClicks || 0;
      const startingPowerRefills = window.state.powerRefillCount || 0;
      
      // Exponential tracking starting values (for quests that track actual box volume)
      const startingCommonBoxesExponential = getCommonBoxTotalProduced();
      const startingUncommonBoxesExponential = getUncommonBoxTotalProduced();
      const startingRareBoxesExponential = getRareBoxTotalProduced();
      const startingLegendaryBoxesExponential = getLegendaryBoxTotalProduced();
      const startingMythicBoxesExponential = getMythicBoxTotalProduced();
      
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
      } else if (questId === 'lepre_quest_1') {
        // Special handling for Lepre boutique quest
        window.state.questSystem.questProgress[questId] = {
          tokensPurchased: new Decimal(0),
          berryTokensPurchased: new Decimal(0),
          freeBucksClaimed: new Decimal(0),
          completed: false,
          readyToTurnIn: false
        };
      } else if (questId === 'lepre_quest_2') {
        // Special handling for Lepre boutique quest 2 with expanded objectives
        window.state.questSystem.questProgress[questId] = {
          tokensPurchased: new Decimal(0),
          berryTokensPurchased: new Decimal(0),
          waterTokensPurchased: new Decimal(0),
          premiumTokensPurchased: new Decimal(0),
          freeBucksClaimed: new Decimal(0),
          completed: false,
          readyToTurnIn: false
        };
      } else if (questId === 'lepre_quest_3') {
        // Special handling for Lepre boutique quest 3 with token giving objectives
        window.state.questSystem.questProgress[questId] = {
          berriesGiven: new Decimal(0),
          petalsGiven: new Decimal(0),
          waterGiven: new Decimal(0),
          prismaGiven: new Decimal(0),
          tokensPurchased: new Decimal(0),
          completed: false,
          readyToTurnIn: false
        };
      } else if (questId === 'lepre_quest_4') {
        // Special handling for Lepre boutique quest 4 with facility-wide objectives
        window.state.questSystem.questProgress[questId] = {
          tokensCollected: new Decimal(0),
          batteriesCrafted: new Decimal(0),
          tokensGiven: new Decimal(0),
          tokensPurchased: new Decimal(0),
          completed: false,
          readyToTurnIn: false
        };
      } else if (questId === 'lepre_quest_5') {
        // Special handling for Lepre boutique quest 5 with final preparations and challenge
        window.state.questSystem.questProgress[questId] = {
          tokensCollected: new Decimal(0),
          batteriesCrafted: new Decimal(0),
          tokensGiven: new Decimal(0),
          tokensPurchased: new Decimal(0),
          premiumTokensPurchased: new Decimal(0),
          freeSwaCollected: new Decimal(0),
          powerChallengeRecord: new Decimal(0),
          completed: false,
          readyToTurnIn: false
        };
      } else {
        window.state.questSystem.questProgress[questId] = {
          // Starting values when quest began
          startingFluff: startingFluff,
          startingSwaria: startingSwaria,
          startingFeathers: startingFeathers,
          startingArtifacts: startingArtifacts,
          startingCommonBoxes: startingCommonBoxes,
          startingUncommonBoxes: startingUncommonBoxes,
          startingRareBoxes: startingRareBoxes,
          startingMythicBoxes: startingMythicBoxes,
          startingLegendaryBoxes: startingLegendaryBoxes,
          startingPrismClicks: startingPrismClicks,
          startingPowerRefills: startingPowerRefills,
          startingCommonBoxesExponential: startingCommonBoxesExponential,
          startingUncommonBoxesExponential: startingUncommonBoxesExponential,
          startingRareBoxesExponential: startingRareBoxesExponential,
          startingLegendaryBoxesExponential: startingLegendaryBoxesExponential,
          startingMythicBoxesExponential: startingMythicBoxesExponential,
          
          // Progress tracking (what was gained during quest)
          fluffCollected: new Decimal(0),
          swariaCollected: new Decimal(0),
          feathersCollected: new Decimal(0),
          artifactsCollected: new Decimal(0),
          tokensCollected: 0,
          tokensCollectedDuringQuest: 0,
          commonBoxesProduced: 0,
          uncommonBoxesProduced: 0,
          rareBoxesProduced: 0,
          mythicBoxesProduced: 0,
          legendaryBoxesProduced: 0,
          commonBoxesProducedExponential: 0,
          uncommonBoxesProducedExponential: 0,
          prismClicksGained: 0,
          powerRefillsGained: 0,
          allBoxGeneratorsRunning: false,
          
          // Cooking objective tracking
          cookBerryPlates: 0,
          cookMushroomSoup: 0,
          cookBatteries: 0,
          cookGlitteringPetals: 0,
          cookChargedPrisma: 0,
          cookAnyIngredients: 0,
          
          // Token type tracking  
          berryTokens: 0,
          sparksTokens: 0,
          prismaTokens: 0,
          petalTokens: 0,
          stardustTokens: 0,
          
          // Source-specific token tracking
          cargoTokensFromBoxes: 0,
          generatorTokensFromBoxes: 0,
          prismClickTokens: 0,
          terrariumRustlingTokens: 0,
          nightTimeTokens: 0,
          collectAnyTokens: 0,
          
          // Action tracking
          generateBoxes: 0,
          buyBoxes: 0,
          buyBoxesAtNight: 0,
          clickPrismTiles: 0,
          clickPrismTilesAtNight: 0,
          waterFlowers: 0,
          extractPollen: 0,
          clickFlowersTotal: 0,
          
          completed: false,
          readyToTurnIn: false
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
  
  // Check if quest is actually ready to turn in (objectives are met)
  const progress = window.state.questSystem.questProgress[questId];
  if (!progress || !progress.readyToTurnIn) {
    console.warn(`Quest ${questId} is not ready to turn in - objectives not completed`);
    return;
  }
  
  // Move from active to completed
  window.state.questSystem.activeQuests = window.state.questSystem.activeQuests.filter(id => id !== questId);
  window.state.questSystem.completedQuests.push(questId);
  
  // Mark progress as completed
  if (window.state.questSystem.questProgress && window.state.questSystem.questProgress[questId]) {
    window.state.questSystem.questProgress[questId].completed = true;
  }
  
  // Give rewards and show notifications
  giveQuestRewardsWithNotifications(quest.rewards, quest.title);
  
  // Special bonus for Soap quests completed after quest 3: +10 permanent power cap
  if (quest.character === 'soap' && isSoapQuestAfterThird(questId)) {
    giveSoapQuestPowerCapBonus(questId);
  }
  
  // Special feature unlock for Lepre quest 5: Token Challenge
  if (questId === 'lepre_quest_5' && window.boutique && typeof window.boutique.updateTokenChallengeButtonVisibility === 'function') {
    window.boutique.updateTokenChallengeButtonVisibility();
  }
  
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
  
  // Handle infinite quest completion for Mystic quests
  if (quest.character === 'mystic') {
    handleInfiniteQuestCompletion(questId);
    
    // Check if infinite mode should be unlocked (when completing quest 7)
    if (questId === 'mystic_quest_7') {
      setTimeout(checkInfiniteModeUnlock, 1000);
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
      mushroomSoup: 0,
      batteryTokens: 0
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
  
  if (rewards.water) {
    window.state.inventory.water = (window.state.inventory.water || 0) + rewards.water;
  }
  
  if (rewards.sparks) {
    window.state.inventory.sparks = (window.state.inventory.sparks || 0) + rewards.sparks;
  }
  
  if (rewards.petals) {
    window.state.inventory.petals = (window.state.inventory.petals || 0) + rewards.petals;
  }
  
  if (rewards.stardust) {
    window.state.inventory.stardust = (window.state.inventory.stardust || 0) + rewards.stardust;
  }
  
  if (rewards.artifacts) {
    window.state.inventory.artifacts = (window.state.inventory.artifacts || 0) + rewards.artifacts;
  }
  
  if (rewards.batteryTokens) {
    window.state.inventory.batteryTokens = (window.state.inventory.batteryTokens || 0) + rewards.batteryTokens;
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
  
  if (rewards.stardust && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('stardust', rewards.stardust, 'Quest Complete!', `${questTitle} - +${rewards.stardust} Stardust`);
    }, 1800);
  }
  
  if (rewards.artifacts && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('feather', rewards.artifacts, 'Quest Complete!', `${questTitle} - +${rewards.artifacts} Artifacts`);
    }, 2000);
  }
  
  if (rewards.batteryTokens && typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification('battery', rewards.batteryTokens, 'Quest Complete!', `${questTitle} - +${rewards.batteryTokens} Battery Token${rewards.batteryTokens > 1 ? 's' : ''}`);
    }, 2200);
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
    
    // Fix missing starting values for existing quests
    if (quest.objectives) {
      // Force reset for feathers and artifacts if they seem incorrect
      if (quest.objectives.feathers) {
        const currentFeathers = window.state.feathers ? (DecimalUtils.isDecimal(window.state.feathers) ? window.state.feathers : new Decimal(window.state.feathers)) : new Decimal(0);
        if (progress.startingFeathers === undefined || !DecimalUtils.isDecimal(progress.startingFeathers)) {
          progress.startingFeathers = currentFeathers;
          console.log(`Initialized startingFeathers for ${questId}:`, progress.startingFeathers.toString());
        } else {
          // Check if starting value is way higher than current (indicating a previous bug)
          if (progress.startingFeathers.gt(currentFeathers)) {
            progress.startingFeathers = currentFeathers;
            console.log(`Reset startingFeathers for ${questId} (was too high):`, progress.startingFeathers.toString());
          }
        }
      }
      if (quest.objectives.artifacts) {
        const currentArtifacts = window.state.artifacts ? (DecimalUtils.isDecimal(window.state.artifacts) ? window.state.artifacts : new Decimal(window.state.artifacts)) : new Decimal(0);
        if (progress.startingArtifacts === undefined || !DecimalUtils.isDecimal(progress.startingArtifacts)) {
          progress.startingArtifacts = currentArtifacts;
          console.log(`Initialized startingArtifacts for ${questId}:`, progress.startingArtifacts.toString());
        } else {
          // Check if starting value is way higher than current (indicating a previous bug)
          if (progress.startingArtifacts.gt(currentArtifacts)) {
            progress.startingArtifacts = currentArtifacts;
            console.log(`Reset startingArtifacts for ${questId} (was too high):`, progress.startingArtifacts.toString());
          }
        }
      }
      if (quest.objectives.prismClicks && progress.startingPrismClicks === undefined) {
        progress.startingPrismClicks = window.state.prismClicks || 0;
        console.log(`Initialized startingPrismClicks for ${questId}:`, progress.startingPrismClicks);
      }
    }
    
    // Start with objectives met as true, then set to false if any fail
    let objectivesMet = true;
    
    // Handle quests with no objectives (auto-complete)
    if (!quest.objectives || Object.keys(quest.objectives).length === 0) {
      objectivesMet = true;
    }
    
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

    // Check exponential common box objective (track actual boxes produced, not production cycles)
    if (quest.objectives && quest.objectives.commonBoxesExponential) {
      // For exponential objectives, we track the actual difference in box totals
      // This means if a generator produces 2 boxes at once, it counts as 2
      const currentCommonBoxes = getCommonBoxTotalProduced(); // Total boxes ever produced
      const startingCommonBoxesExp = progress.startingCommonBoxesExponential || 0;
      const commonBoxesProducedExp = Math.max(0, currentCommonBoxes - startingCommonBoxesExp);
      
      progress.commonBoxesProducedExponential = commonBoxesProducedExp;
      
      if (commonBoxesProducedExp < quest.objectives.commonBoxesExponential) {
        objectivesMet = false;
      }
    }

    // Check feathers objective (track progress from quest start)
    if (quest.objectives && quest.objectives.feathers) {
      const currentFeathers = window.state.feathers ? (DecimalUtils.isDecimal(window.state.feathers) ? window.state.feathers : new Decimal(window.state.feathers)) : new Decimal(0);
      const startingFeathers = progress.startingFeathers || new Decimal(0);
      const feathersGained = currentFeathers.sub(startingFeathers);
      
      progress.feathersCollected = feathersGained.gte(0) ? feathersGained : new Decimal(0);
      
      if (progress.feathersCollected.lt(quest.objectives.feathers)) {
        objectivesMet = false;
      }
    }

    // Check uncommon box objective (track progress from quest start)
    if (quest.objectives && quest.objectives.uncommonBoxes) {
      const currentUncommonBoxes = getUncommonBoxCount();
      const startingUncommonBoxes = progress.startingUncommonBoxes || 0;
      const uncommonBoxesProduced = Math.max(0, currentUncommonBoxes - startingUncommonBoxes);
      
      progress.uncommonBoxesProduced = uncommonBoxesProduced;
      
      if (uncommonBoxesProduced < quest.objectives.uncommonBoxes) {
        objectivesMet = false;
      }
    }

    // Check exponential uncommon box objective (track actual boxes produced, not production cycles)
    if (quest.objectives && quest.objectives.uncommonBoxesExponential) {
      const currentUncommonBoxes = getUncommonBoxTotalProduced(); // Total boxes ever produced
      const startingUncommonBoxesExp = progress.startingUncommonBoxesExponential || 0;
      const uncommonBoxesProducedExp = Math.max(0, currentUncommonBoxes - startingUncommonBoxesExp);
      
      progress.uncommonBoxesProducedExponential = uncommonBoxesProducedExp;
      
      if (uncommonBoxesProducedExp < quest.objectives.uncommonBoxesExponential) {
        objectivesMet = false;
      }
    }

    // Check exponential rare box objective (track actual boxes produced, not production cycles)
    if (quest.objectives && quest.objectives.rareBoxesExponential) {
      const currentRareBoxes = getRareBoxTotalProduced(); // Total boxes ever produced
      const startingRareBoxesExp = progress.startingRareBoxesExponential || 0;
      const rareBoxesProducedExp = Math.max(0, currentRareBoxes - startingRareBoxesExp);
      
      progress.rareBoxesProducedExponential = rareBoxesProducedExp;
      
      if (rareBoxesProducedExp < quest.objectives.rareBoxesExponential) {
        objectivesMet = false;
      }
    }

    // Check exponential legendary box objective (track actual boxes produced, not production cycles)
    if (quest.objectives && quest.objectives.legendaryBoxesExponential) {
      const currentLegendaryBoxes = getLegendaryBoxTotalProduced(); // Total boxes ever produced
      const startingLegendaryBoxesExp = progress.startingLegendaryBoxesExponential || 0;
      const legendaryBoxesProducedExp = Math.max(0, currentLegendaryBoxes - startingLegendaryBoxesExp);
      
      progress.legendaryBoxesProducedExponential = legendaryBoxesProducedExp;
      
      if (legendaryBoxesProducedExp < quest.objectives.legendaryBoxesExponential) {
        objectivesMet = false;
      }
    }

    // Check exponential mythic box objective (track actual boxes produced, not production cycles)
    if (quest.objectives && quest.objectives.mythicBoxesExponential) {
      const currentMythicBoxes = getMythicBoxTotalProduced(); // Total boxes ever produced
      const startingMythicBoxesExp = progress.startingMythicBoxesExponential || 0;
      const mythicBoxesProducedExp = Math.max(0, currentMythicBoxes - startingMythicBoxesExp);
      
      progress.mythicBoxesProducedExponential = mythicBoxesProducedExp;
      
      if (mythicBoxesProducedExp < quest.objectives.mythicBoxesExponential) {
        objectivesMet = false;
      }
    }

    // Check artifacts objective (track progress from quest start)
    if (quest.objectives && quest.objectives.artifacts) {
      const currentArtifacts = window.state.artifacts ? (DecimalUtils.isDecimal(window.state.artifacts) ? window.state.artifacts : new Decimal(window.state.artifacts)) : new Decimal(0);
      const startingArtifacts = progress.startingArtifacts || new Decimal(0);
      const artifactsGained = currentArtifacts.sub(startingArtifacts);
      
      progress.artifactsCollected = artifactsGained.gte(0) ? artifactsGained : new Decimal(0);
      
      if (progress.artifactsCollected.lt(quest.objectives.artifacts)) {
        objectivesMet = false;
      }
    }

    // Check rare box objective (track progress from quest start)
    if (quest.objectives && quest.objectives.rareBoxes) {
      const currentRareBoxes = getRareBoxCount();
      const startingRareBoxes = progress.startingRareBoxes || 0;
      const rareBoxesProduced = Math.max(0, currentRareBoxes - startingRareBoxes);
      
      progress.rareBoxesProduced = rareBoxesProduced;
      
      if (rareBoxesProduced < quest.objectives.rareBoxes) {
        objectivesMet = false;
      }
    }

    // Check prism clicks objective (track progress from quest start)
    if (quest.objectives && quest.objectives.prismClicks) {
      const currentPrismClicks = window.state.prismClicks || 0;
      const startingPrismClicks = progress.startingPrismClicks || 0;
      const prismClicksGained = Math.max(0, currentPrismClicks - startingPrismClicks);
      
      progress.prismClicksGained = prismClicksGained;
      
      if (prismClicksGained < quest.objectives.prismClicks) {
        objectivesMet = false;
      }
    }

    // Check mythic boxes objective (track progress from quest start)
    if (quest.objectives && quest.objectives.mythicBoxes) {
      const currentMythicBoxes = getMythicBoxCount();
      const startingMythicBoxes = progress.startingMythicBoxes || 0;
      const mythicBoxesProduced = Math.max(0, currentMythicBoxes - startingMythicBoxes);
      
      progress.mythicBoxesProduced = mythicBoxesProduced;
      
      if (mythicBoxesProduced < quest.objectives.mythicBoxes) {
        objectivesMet = false;
      }
    }

    // Check legendary boxes objective (track progress from quest start)
    if (quest.objectives && quest.objectives.legendaryBoxes) {
      const currentLegendaryBoxes = getLegendaryBoxCount();
      const startingLegendaryBoxes = progress.startingLegendaryBoxes || 0;
      const legendaryBoxesProduced = Math.max(0, currentLegendaryBoxes - startingLegendaryBoxes);
      
      progress.legendaryBoxesProduced = legendaryBoxesProduced;
      
      if (legendaryBoxesProduced < quest.objectives.legendaryBoxes) {
        objectivesMet = false;
      }
    }

    // Check power refills objective (track progress from quest start)
    if (quest.objectives && quest.objectives.powerRefills) {
      const currentPowerRefills = window.state.powerRefillCount || 0;
      const startingPowerRefills = progress.startingPowerRefills || 0;
      const powerRefillsGained = Math.max(0, currentPowerRefills - startingPowerRefills);
      
      progress.powerRefillsGained = powerRefillsGained;
      
      if (powerRefillsGained < quest.objectives.powerRefills) {
        objectivesMet = false;
      }
    }

    // Check all box generators running objective
    if (quest.objectives && quest.objectives.allBoxGeneratorsRunning) {
      const allGeneratorsRunning = checkAllBoxGeneratorsRunning();
      progress.allBoxGeneratorsRunning = allGeneratorsRunning;
      
      if (!allGeneratorsRunning) {
        objectivesMet = false;
      }
    }

    // Check cooking objectives (specific recipes cooked)
    if (quest.objectives && quest.objectives.cookBerryPlates) {
      const cookBerryPlates = progress.cookBerryPlates || 0;
      if (cookBerryPlates < quest.objectives.cookBerryPlates) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cookMushroomSoup) {
      const cookMushroomSoup = progress.cookMushroomSoup || 0;
      if (cookMushroomSoup < quest.objectives.cookMushroomSoup) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cookBatteries) {
      const cookBatteries = progress.cookBatteries || 0;
      if (cookBatteries < quest.objectives.cookBatteries) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cookGlitteringPetals) {
      const cookGlitteringPetals = progress.cookGlitteringPetals || 0;
      if (cookGlitteringPetals < quest.objectives.cookGlitteringPetals) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cookChargedPrisma) {
      const cookChargedPrisma = progress.cookChargedPrisma || 0;
      if (cookChargedPrisma < quest.objectives.cookChargedPrisma) {
        objectivesMet = false;
      }
    }

    // Check basic ingredient objectives (track current inventory)
    if (quest.objectives && quest.objectives.berries) {
      const currentBerries = window.state.berries ? (DecimalUtils.isDecimal(window.state.berries) ? window.state.berries : new Decimal(window.state.berries)) : new Decimal(0);
      progress.berriesCollected = currentBerries;
      if (currentBerries.lt(quest.objectives.berries)) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.water) {
      const currentWater = window.state.water ? (DecimalUtils.isDecimal(window.state.water) ? window.state.water : new Decimal(window.state.water)) : new Decimal(0);
      progress.waterCollected = currentWater;
      if (currentWater.lt(quest.objectives.water)) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.mushroom) {
      const currentMushroom = window.state.mushroom ? (DecimalUtils.isDecimal(window.state.mushroom) ? window.state.mushroom : new Decimal(window.state.mushroom)) : new Decimal(0);
      progress.mushroomCollected = currentMushroom;
      if (currentMushroom.lt(quest.objectives.mushroom)) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.sparks) {
      const currentSparks = window.state.sparks ? (DecimalUtils.isDecimal(window.state.sparks) ? window.state.sparks : new Decimal(window.state.sparks)) : new Decimal(0);
      progress.sparksCollected = currentSparks;
      if (currentSparks.lt(quest.objectives.sparks)) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.prisma) {
      const currentPrisma = window.state.prisma ? (DecimalUtils.isDecimal(window.state.prisma) ? window.state.prisma : new Decimal(window.state.prisma)) : new Decimal(0);
      progress.prismaCollected = currentPrisma;
      if (currentPrisma.lt(quest.objectives.prisma)) {
        objectivesMet = false;
      }
    }

    // Check Mystic quest specific objectives
    if (quest.objectives && quest.objectives.berryTokens) {
      const berryTokenCount = progress.berryTokens || 0;
      if (berryTokenCount < quest.objectives.berryTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.sparksTokens) {
      const sparksTokenCount = progress.sparksTokens || 0;
      if (sparksTokenCount < quest.objectives.sparksTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.prismaTokens) {
      const prismaTokenCount = progress.prismaTokens || 0;
      if (prismaTokenCount < quest.objectives.prismaTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.petalTokens) {
      const petalTokenCount = progress.petalTokens || 0;
      if (petalTokenCount < quest.objectives.petalTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.stardustTokens) {
      const stardustTokenCount = progress.stardustTokens || 0;
      if (stardustTokenCount < quest.objectives.stardustTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cargoTokensFromBoxes) {
      const cargoTokensFromBoxes = progress.cargoTokensFromBoxes || 0;
      if (cargoTokensFromBoxes < quest.objectives.cargoTokensFromBoxes) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.generatorTokensFromBoxes) {
      const generatorTokensFromBoxes = progress.generatorTokensFromBoxes || 0;
      if (generatorTokensFromBoxes < quest.objectives.generatorTokensFromBoxes) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.prismClickTokens) {
      const prismClickTokens = progress.prismClickTokens || 0;
      if (prismClickTokens < quest.objectives.prismClickTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.terrariumRustlingTokens) {
      const terrariumRustlingTokens = progress.terrariumRustlingTokens || 0;
      if (terrariumRustlingTokens < quest.objectives.terrariumRustlingTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.nightTimeTokens) {
      const nightTimeTokens = progress.nightTimeTokens || 0;
      if (nightTimeTokens < quest.objectives.nightTimeTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.collectAnyTokens) {
      const collectAnyTokens = progress.collectAnyTokens || 0;
      if (collectAnyTokens < quest.objectives.collectAnyTokens) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.buyBoxes) {
      const buyBoxes = progress.buyBoxes || 0;
      if (buyBoxes < quest.objectives.buyBoxes) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.buyBoxesAtNight) {
      const buyBoxesAtNight = progress.buyBoxesAtNight || 0;
      if (buyBoxesAtNight < quest.objectives.buyBoxesAtNight) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.generateBoxes) {
      const generateBoxes = progress.generateBoxes || 0;
      if (generateBoxes < quest.objectives.generateBoxes) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.clickPrismTiles) {
      const clickPrismTiles = progress.clickPrismTiles || 0;
      if (clickPrismTiles < quest.objectives.clickPrismTiles) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.clickPrismTilesAtNight) {
      const clickPrismTilesAtNight = progress.clickPrismTilesAtNight || 0;
      if (clickPrismTilesAtNight < quest.objectives.clickPrismTilesAtNight) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.waterFlowers) {
      const waterFlowers = progress.waterFlowers || 0;
      if (waterFlowers < quest.objectives.waterFlowers) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.extractPollen) {
      const extractPollen = progress.extractPollen || 0;
      if (extractPollen < quest.objectives.extractPollen) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.clickFlowersTotal) {
      const clickFlowersTotal = progress.clickFlowersTotal || 0;
      if (clickFlowersTotal < quest.objectives.clickFlowersTotal) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cookAnyIngredients) {
      const cookAnyIngredients = progress.cookAnyIngredients || 0;
      if (cookAnyIngredients < quest.objectives.cookAnyIngredients) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.cookBatteries) {
      const cookBatteries = progress.cookBatteries || 0;
      if (cookBatteries < quest.objectives.cookBatteries) {
        objectivesMet = false;
      }
    }

    if (quest.objectives && quest.objectives.sparksTokens) {
      const sparksTokens = progress.sparksTokens || 0;
      if (sparksTokens < quest.objectives.sparksTokens) {
        objectivesMet = false;
      }
    }

    // Special handling for KitoFox Challenge quest - use quest system progress (not legacy hard mode)
    if (quest.id === 'kitofox_challenge') {
      // Use the quest system's own progress tracking, not legacy hardModeQuest
      
      // Check berry tokens collected (track collection actions, not inventory)
      if (quest.objectives.berryTokens) {
        let berryTokenCount = progress.berryTokens || new Decimal(0);
        // Ensure berryTokenCount is a Decimal
        if (!DecimalUtils.isDecimal(berryTokenCount)) {
          berryTokenCount = new Decimal(berryTokenCount || 0);
        }
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.berryTokens === undefined || progress.berryTokens === null) {
          progress.berryTokens = berryTokenCount;
        }
        if (berryTokenCount.lt(quest.objectives.berryTokens)) {
          objectivesMet = false;
        }
      }
      
      // Check stardust tokens collected (track collection actions, not inventory)  
      if (quest.objectives.stardustTokens) {
        let stardustTokenCount = progress.stardustTokens || new Decimal(0);
        // Ensure stardustTokenCount is a Decimal
        if (!DecimalUtils.isDecimal(stardustTokenCount)) {
          stardustTokenCount = new Decimal(stardustTokenCount || 0);
        }
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.stardustTokens === undefined || progress.stardustTokens === null) {
          progress.stardustTokens = stardustTokenCount;
        }
        if (stardustTokenCount.lt(quest.objectives.stardustTokens)) {
          objectivesMet = false;
        }
      }
      
      // Check prism clicks
      if (quest.objectives.prismClicks) {
        const prismClickCount = DecimalUtils.isDecimal(hardModeProgress.prismClicks) ? hardModeProgress.prismClicks : new Decimal(hardModeProgress.prismClicks || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.prismClicks === undefined || progress.prismClicks === null) {
          progress.prismClicks = prismClickCount;
        }
        if (prismClickCount.lt(quest.objectives.prismClicks)) {
          objectivesMet = false;
        }
      }
      
      // Check flowers watered
      if (quest.objectives.flowersWatered) {
        const flowersWateredCount = DecimalUtils.isDecimal(hardModeProgress.flowersWatered) ? hardModeProgress.flowersWatered : new Decimal(hardModeProgress.flowersWatered || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.flowersWatered === undefined || progress.flowersWatered === null) {
          progress.flowersWatered = flowersWateredCount;
        }
        if (flowersWateredCount.lt(quest.objectives.flowersWatered)) {
          objectivesMet = false;
        }
      }
      
      // Check power refills
      if (quest.objectives.powerRefills) {
        const powerRefillCount = DecimalUtils.isDecimal(hardModeProgress.powerRefills) ? hardModeProgress.powerRefills : new Decimal(hardModeProgress.powerRefills || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.powerRefills === undefined || progress.powerRefills === null) {
          progress.powerRefills = powerRefillCount;
        }
        if (powerRefillCount.lt(quest.objectives.powerRefills)) {
          objectivesMet = false;
        }
      }
      
      // Check common boxes
      if (quest.objectives.commonBoxes) {
        const commonBoxCount = DecimalUtils.isDecimal(hardModeProgress.commonBoxes) ? hardModeProgress.commonBoxes : new Decimal(hardModeProgress.commonBoxes || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.commonBoxes === undefined || progress.commonBoxes === null) {
          progress.commonBoxes = commonBoxCount;
        }
        if (commonBoxCount.lt(quest.objectives.commonBoxes)) {
          objectivesMet = false;
        }
      }
      
      // Check soap pokes
      if (quest.objectives.soapPokes) {
        const soapPokeCount = DecimalUtils.isDecimal(hardModeProgress.soapPokes) ? hardModeProgress.soapPokes : new Decimal(hardModeProgress.soapPokes || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.soapPokes === undefined || progress.soapPokes === null) {
          progress.soapPokes = soapPokeCount;
        }
        if (soapPokeCount.lt(quest.objectives.soapPokes)) {
          objectivesMet = false;
        }
      }
      
      // Check ingredients cooked
      if (quest.objectives.ingredientsCooked) {
        const ingredientsCookedCount = DecimalUtils.isDecimal(hardModeProgress.ingredientsCooked) ? hardModeProgress.ingredientsCooked : new Decimal(hardModeProgress.ingredientsCooked || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.ingredientsCooked === undefined || progress.ingredientsCooked === null) {
          progress.ingredientsCooked = ingredientsCookedCount;
        }
        if (ingredientsCookedCount.lt(quest.objectives.ingredientsCooked)) {
          objectivesMet = false;
        }
      }
      
      // Check berry plates cooked (track cooking actions, not inventory)
      if (quest.objectives.berryPlates) {
        const berryPlateCount = DecimalUtils.isDecimal(hardModeProgress.berryPlatesCookingActions) ? hardModeProgress.berryPlatesCookingActions : new Decimal(hardModeProgress.berryPlatesCookingActions || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.berryPlates === undefined || progress.berryPlates === null) {
          progress.berryPlates = berryPlateCount;
        }
        if (berryPlateCount.lt(quest.objectives.berryPlates)) {
          objectivesMet = false;
        }
      }
      
      // Check mushroom soups cooked (track cooking actions, not inventory)
      if (quest.objectives.mushroomSoups) {
        const mushroomSoupCount = DecimalUtils.isDecimal(hardModeProgress.mushroomSoupsCookingActions) ? hardModeProgress.mushroomSoupsCookingActions : new Decimal(hardModeProgress.mushroomSoupsCookingActions || 0);
        // Only initialize if truly unset, don't overwrite existing progress
        if (progress.mushroomSoups === undefined || progress.mushroomSoups === null) {
          progress.mushroomSoups = mushroomSoupCount;
        }
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
    
    // Check Lepre quest specific objectives
    if (questId === 'lepre_quest_1' || questId === 'lepre_quest_2' || questId === 'lepre_quest_3' || questId === 'lepre_quest_4' || questId === 'lepre_quest_5') {
      // Check tokens purchased from Lepre's shop
      if (quest.objectives.tokensPurchased) {
        const tokensProgress = DecimalUtils.isDecimal(progress.tokensPurchased) ? progress.tokensPurchased : DecimalUtils.toDecimal(progress.tokensPurchased || 0);
        if (tokensProgress.lt(quest.objectives.tokensPurchased)) {
          objectivesMet = false;
        }
      }
      
      // Check berry tokens purchased specifically
      if (quest.objectives.berryTokensPurchased) {
        const berryProgress = DecimalUtils.isDecimal(progress.berryTokensPurchased) ? progress.berryTokensPurchased : DecimalUtils.toDecimal(progress.berryTokensPurchased || 0);
        if (berryProgress.lt(quest.objectives.berryTokensPurchased)) {
          objectivesMet = false;
        }
      }
      
      // Check water tokens purchased specifically
      if (quest.objectives.waterTokensPurchased) {
        const waterProgress = DecimalUtils.isDecimal(progress.waterTokensPurchased) ? progress.waterTokensPurchased : DecimalUtils.toDecimal(progress.waterTokensPurchased || 0);
        if (waterProgress.lt(quest.objectives.waterTokensPurchased)) {
          objectivesMet = false;
        }
      }
      
      // Check premium tokens purchased specifically
      if (quest.objectives.premiumTokensPurchased) {
        const premiumProgress = DecimalUtils.isDecimal(progress.premiumTokensPurchased) ? progress.premiumTokensPurchased : DecimalUtils.toDecimal(progress.premiumTokensPurchased || 0);
        if (premiumProgress.lt(quest.objectives.premiumTokensPurchased)) {
          objectivesMet = false;
        }
      }
      
      // Check free Swa Bucks claims
      if (quest.objectives.freeBucksClaimed) {
        const bucksProgress = DecimalUtils.isDecimal(progress.freeBucksClaimed) ? progress.freeBucksClaimed : DecimalUtils.toDecimal(progress.freeBucksClaimed || 0);
        if (bucksProgress.lt(quest.objectives.freeBucksClaimed)) {
          objectivesMet = false;
        }
      }
      
      // Check tokens given to workers (lepre_quest_3 specific)
      if (quest.objectives.berriesGiven) {
        const berriesGivenProgress = DecimalUtils.isDecimal(progress.berriesGiven) ? progress.berriesGiven : DecimalUtils.toDecimal(progress.berriesGiven || 0);
        if (berriesGivenProgress.lt(quest.objectives.berriesGiven)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.petalsGiven) {
        const petalsGivenProgress = DecimalUtils.isDecimal(progress.petalsGiven) ? progress.petalsGiven : DecimalUtils.toDecimal(progress.petalsGiven || 0);
        if (petalsGivenProgress.lt(quest.objectives.petalsGiven)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.waterGiven) {
        const waterGivenProgress = DecimalUtils.isDecimal(progress.waterGiven) ? progress.waterGiven : DecimalUtils.toDecimal(progress.waterGiven || 0);
        if (waterGivenProgress.lt(quest.objectives.waterGiven)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.prismaGiven) {
        const prismaGivenProgress = DecimalUtils.isDecimal(progress.prismaGiven) ? progress.prismaGiven : DecimalUtils.toDecimal(progress.prismaGiven || 0);
        if (prismaGivenProgress.lt(quest.objectives.prismaGiven)) {
          objectivesMet = false;
        }
      }
      
      // Check lepre_quest_4 specific objectives
      if (quest.objectives.tokensCollected) {
        const tokensCollectedProgress = DecimalUtils.isDecimal(progress.tokensCollected) ? progress.tokensCollected : DecimalUtils.toDecimal(progress.tokensCollected || 0);
        if (tokensCollectedProgress.lt(quest.objectives.tokensCollected)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.batteriesCrafted) {
        const batteriesCraftedProgress = DecimalUtils.isDecimal(progress.batteriesCrafted) ? progress.batteriesCrafted : DecimalUtils.toDecimal(progress.batteriesCrafted || 0);
        if (batteriesCraftedProgress.lt(quest.objectives.batteriesCrafted)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.tokensGiven) {
        const tokensGivenProgress = DecimalUtils.isDecimal(progress.tokensGiven) ? progress.tokensGiven : DecimalUtils.toDecimal(progress.tokensGiven || 0);
        if (tokensGivenProgress.lt(quest.objectives.tokensGiven)) {
          objectivesMet = false;
        }
      }
      
      // Lepre Quest 5 specific objective checks
      if (quest.objectives.premiumTokensPurchased) {
        const premiumTokensProgress = DecimalUtils.isDecimal(progress.premiumTokensPurchased) ? progress.premiumTokensPurchased : DecimalUtils.toDecimal(progress.premiumTokensPurchased || 0);
        if (premiumTokensProgress.lt(quest.objectives.premiumTokensPurchased)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.freeSwaCollected) {
        const freeSwaProgress = DecimalUtils.isDecimal(progress.freeSwaCollected) ? progress.freeSwaCollected : DecimalUtils.toDecimal(progress.freeSwaCollected || 0);
        if (freeSwaProgress.lt(quest.objectives.freeSwaCollected)) {
          objectivesMet = false;
        }
      }
      
      if (quest.objectives.powerChallengeRecord) {
        const recordProgress = DecimalUtils.isDecimal(progress.powerChallengeRecord) ? progress.powerChallengeRecord : DecimalUtils.toDecimal(progress.powerChallengeRecord || 0);
        if (recordProgress.lt(quest.objectives.powerChallengeRecord)) {
          objectivesMet = false;
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

// Get total uncommon boxes produced
function getUncommonBoxCount() {
  if (!window.state || !window.state.boxesProducedByType || !window.state.boxesProducedByType.uncommon) return 0;
  
  // Handle both Decimal and number types
  const uncommonBoxes = window.state.boxesProducedByType.uncommon;
  if (DecimalUtils.isDecimal(uncommonBoxes)) {
    return uncommonBoxes.toNumber();
  }
  return uncommonBoxes || 0;
}

// Get total rare boxes produced
function getRareBoxCount() {
  if (!window.state || !window.state.boxesProducedByType || !window.state.boxesProducedByType.rare) return 0;
  
  // Handle both Decimal and number types
  const rareBoxes = window.state.boxesProducedByType.rare;
  if (DecimalUtils.isDecimal(rareBoxes)) {
    return rareBoxes.toNumber();
  }
  return rareBoxes || 0;
}

// Get total mythic boxes produced
function getMythicBoxCount() {
  if (!window.state || !window.state.boxesProducedByType || !window.state.boxesProducedByType.mythic) return 0;
  
  // Handle both Decimal and number types
  const mythicBoxes = window.state.boxesProducedByType.mythic;
  if (DecimalUtils.isDecimal(mythicBoxes)) {
    return mythicBoxes.toNumber();
  }
  return mythicBoxes || 0;
}

// Get total legendary boxes produced
function getLegendaryBoxCount() {
  if (!window.state || !window.state.boxesProducedByType || !window.state.boxesProducedByType.legendary) return 0;
  
  // Handle both Decimal and number types
  const legendaryBoxes = window.state.boxesProducedByType.legendary;
  if (DecimalUtils.isDecimal(legendaryBoxes)) {
    return legendaryBoxes.toNumber();
  }
  return legendaryBoxes || 0;
}

// Get total common boxes actually produced (for exponential objectives)
// This tracks the total volume of boxes produced, not just production cycles
function getCommonBoxTotalProduced() {
  if (!window.state || !window.state.boxesTotalProduced || !window.state.boxesTotalProduced.common) return 0;
  
  // Handle both Decimal and number types
  const commonBoxes = window.state.boxesTotalProduced.common;
  if (DecimalUtils.isDecimal(commonBoxes)) {
    return commonBoxes.toNumber();
  }
  return commonBoxes || 0;
}

// Get total uncommon boxes actually produced (for exponential objectives)
// This tracks the total volume of boxes produced, not just production cycles
function getUncommonBoxTotalProduced() {
  if (!window.state || !window.state.boxesTotalProduced || !window.state.boxesTotalProduced.uncommon) return 0;
  
  // Handle both Decimal and number types
  const uncommonBoxes = window.state.boxesTotalProduced.uncommon;
  if (DecimalUtils.isDecimal(uncommonBoxes)) {
    return uncommonBoxes.toNumber();
  }
  return uncommonBoxes || 0;
}

// Get total rare boxes actually produced (for exponential objectives)
// This tracks the total volume of boxes produced, not just production cycles
function getRareBoxTotalProduced() {
  if (!window.state || !window.state.boxesTotalProduced || !window.state.boxesTotalProduced.rare) return 0;
  
  // Handle both Decimal and number types
  const rareBoxes = window.state.boxesTotalProduced.rare;
  if (DecimalUtils.isDecimal(rareBoxes)) {
    return rareBoxes.toNumber();
  }
  return rareBoxes || 0;
}

// Get total legendary boxes actually produced (for exponential objectives)
// This tracks the total volume of boxes produced, not just production cycles
function getLegendaryBoxTotalProduced() {
  if (!window.state || !window.state.boxesTotalProduced || !window.state.boxesTotalProduced.legendary) return 0;
  
  // Handle both Decimal and number types
  const legendaryBoxes = window.state.boxesTotalProduced.legendary;
  if (DecimalUtils.isDecimal(legendaryBoxes)) {
    return legendaryBoxes.toNumber();
  }
  return legendaryBoxes || 0;
}

// Get total mythic boxes actually produced (for exponential objectives)
// This tracks the total volume of boxes produced, not just production cycles
function getMythicBoxTotalProduced() {
  if (!window.state || !window.state.boxesTotalProduced || !window.state.boxesTotalProduced.mythic) return 0;
  
  // Handle both Decimal and number types
  const mythicBoxes = window.state.boxesTotalProduced.mythic;
  if (DecimalUtils.isDecimal(mythicBoxes)) {
    return mythicBoxes.toNumber();
  }
  return mythicBoxes || 0;
}

// Check if all box generators are running (or if Mk.2 mode, check if the unified generator is running)
function checkAllBoxGeneratorsRunning() {
  if (!window.state || !window.state.generators) return false;
  
  // Check if Mk.2 unified generator system is active
  const mk2Active = window.state.friendship && 
                   Object.values(window.state.friendship).some(dept => 
                     dept && dept.level >= 10);
  
  if (mk2Active) {
    // In Mk.2 mode, just check if the unified generator is running
    return window.state.generators.boxGenerator && window.state.generators.boxGenerator.running;
  } else {
    // In regular mode, check all 5 box generators
    const generatorNames = ['commonGenerator', 'uncommonGenerator', 'rareGenerator', 'legendaryGenerator', 'mythicGenerator'];
    
    return generatorNames.every(genName => {
      const generator = window.state.generators[genName];
      return generator && generator.running;
    });
  }
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
  const deptColors = getDepartmentColors(quest.department, quest.character);
  
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
    
    if (quest.objectives.uncommonBoxes) {
      const uncommonBoxesProduced = progress.uncommonBoxesProduced || 0;
      const uncommonBoxesComplete = uncommonBoxesProduced >= quest.objectives.uncommonBoxes;
      const uncommonBoxPercent = Math.min(100, (uncommonBoxesProduced / quest.objectives.uncommonBoxes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Uncommon Boxes Produced</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${uncommonBoxesComplete ? '✓' : `${uncommonBoxesProduced}/${quest.objectives.uncommonBoxes}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${uncommonBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${uncommonBoxPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.rareBoxes) {
      const rareBoxesProduced = progress.rareBoxesProduced || 0;
      const rareBoxesComplete = rareBoxesProduced >= quest.objectives.rareBoxes;
      const rareBoxPercent = Math.min(100, (rareBoxesProduced / quest.objectives.rareBoxes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Rare Boxes Produced</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${rareBoxesComplete ? '✓' : `${rareBoxesProduced}/${quest.objectives.rareBoxes}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${rareBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${rareBoxPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.mythicBoxes) {
      const mythicBoxesProduced = progress.mythicBoxesProduced || 0;
      const mythicBoxesComplete = mythicBoxesProduced >= quest.objectives.mythicBoxes;
      const mythicBoxPercent = Math.min(100, (mythicBoxesProduced / quest.objectives.mythicBoxes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Mythic Boxes Produced</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${mythicBoxesComplete ? '✓' : `${mythicBoxesProduced}/${quest.objectives.mythicBoxes}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${mythicBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${mythicBoxPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.legendaryBoxes) {
      const legendaryBoxesProduced = progress.legendaryBoxesProduced || 0;
      const legendaryBoxesComplete = legendaryBoxesProduced >= quest.objectives.legendaryBoxes;
      const legendaryBoxPercent = Math.min(100, (legendaryBoxesProduced / quest.objectives.legendaryBoxes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Legendary Boxes Produced</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${legendaryBoxesComplete ? '✓' : `${legendaryBoxesProduced}/${quest.objectives.legendaryBoxes}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${legendaryBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${legendaryBoxPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.feathers) {
      const feathersGained = progress.feathersCollected || new Decimal(0);
      const feathersComplete = feathersGained.gte(quest.objectives.feathers);
      const feathersPercent = feathersComplete ? 100 : Math.min(100, feathersGained.div(quest.objectives.feathers).mul(100).toNumber());
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Feathers Gained</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${feathersComplete ? '✓' : `${DecimalUtils.formatDecimal(feathersGained)}/${DecimalUtils.formatDecimal(quest.objectives.feathers)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${feathersComplete ? '#28a745' : deptColors.light};height:100%;width:${feathersPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.artifacts) {
      const artifactsGained = progress.artifactsCollected || new Decimal(0);
      const artifactsComplete = artifactsGained.gte(quest.objectives.artifacts);
      const artifactsPercent = artifactsComplete ? 100 : Math.min(100, artifactsGained.div(quest.objectives.artifacts).mul(100).toNumber());
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Artifacts Gained</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${artifactsComplete ? '✓' : `${DecimalUtils.formatDecimal(artifactsGained)}/${DecimalUtils.formatDecimal(quest.objectives.artifacts)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${artifactsComplete ? '#28a745' : deptColors.light};height:100%;width:${artifactsPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.allBoxGeneratorsRunning) {
      const allGeneratorsRunning = progress.allBoxGeneratorsRunning || false;
      const generatorsPercent = allGeneratorsRunning ? 100 : 0;
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">All Box Generators Running</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${allGeneratorsRunning ? '✓' : 'Not Running'}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${allGeneratorsRunning ? '#28a745' : deptColors.light};height:100%;width:${generatorsPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    // Exponential objectives for pinned display
    if (quest.objectives.commonBoxesExponential) {
      const commonBoxesProducedExp = progress.commonBoxesProducedExponential || 0;
      const commonBoxesCompleteExp = commonBoxesProducedExp >= quest.objectives.commonBoxesExponential;
      const commonBoxPercentExp = Math.min(100, (commonBoxesProducedExp / quest.objectives.commonBoxesExponential) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Common Boxes (Volume)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${commonBoxesCompleteExp ? '✓' : `${commonBoxesProducedExp}/${quest.objectives.commonBoxesExponential}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${commonBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${commonBoxPercentExp}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.uncommonBoxesExponential) {
      const uncommonBoxesProducedExp = progress.uncommonBoxesProducedExponential || 0;
      const uncommonBoxesCompleteExp = uncommonBoxesProducedExp >= quest.objectives.uncommonBoxesExponential;
      const uncommonBoxPercentExp = Math.min(100, (uncommonBoxesProducedExp / quest.objectives.uncommonBoxesExponential) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Uncommon Boxes (Volume)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${uncommonBoxesCompleteExp ? '✓' : `${uncommonBoxesProducedExp}/${quest.objectives.uncommonBoxesExponential}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${uncommonBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${uncommonBoxPercentExp}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }

    if (quest.objectives.rareBoxesExponential) {
      const rareBoxesProducedExp = progress.rareBoxesProducedExponential || 0;
      const rareBoxesCompleteExp = rareBoxesProducedExp >= quest.objectives.rareBoxesExponential;
      const rareBoxPercentExp = Math.min(100, (rareBoxesProducedExp / quest.objectives.rareBoxesExponential) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Rare Boxes (Volume)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${rareBoxesCompleteExp ? '✓' : `${rareBoxesProducedExp}/${quest.objectives.rareBoxesExponential}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${rareBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${rareBoxPercentExp}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }

    if (quest.objectives.legendaryBoxesExponential) {
      const legendaryBoxesProducedExp = progress.legendaryBoxesProducedExponential || 0;
      const legendaryBoxesCompleteExp = legendaryBoxesProducedExp >= quest.objectives.legendaryBoxesExponential;
      const legendaryBoxPercentExp = Math.min(100, (legendaryBoxesProducedExp / quest.objectives.legendaryBoxesExponential) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Legendary Boxes (Volume)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${legendaryBoxesCompleteExp ? '✓' : `${legendaryBoxesProducedExp}/${quest.objectives.legendaryBoxesExponential}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${legendaryBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${legendaryBoxPercentExp}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }

    if (quest.objectives.mythicBoxesExponential) {
      const mythicBoxesProducedExp = progress.mythicBoxesProducedExponential || 0;
      const mythicBoxesCompleteExp = mythicBoxesProducedExp >= quest.objectives.mythicBoxesExponential;
      const mythicBoxPercentExp = Math.min(100, (mythicBoxesProducedExp / quest.objectives.mythicBoxesExponential) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Mythic Boxes (Volume)</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${mythicBoxesCompleteExp ? '✓' : `${mythicBoxesProducedExp}/${quest.objectives.mythicBoxesExponential}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${mythicBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${mythicBoxPercentExp}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    // Regular quest objectives for pinned display
    if (quest.objectives.powerRefills && !quest.objectives.berryTokens && !progress.powerRefills) {
      const powerRefillsGained = progress.powerRefillsGained || 0;
      const powerRefillsComplete = powerRefillsGained >= quest.objectives.powerRefills;
      const powerRefillPercent = Math.min(100, (powerRefillsGained / quest.objectives.powerRefills) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Refill Power</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${powerRefillsComplete ? '✓' : `${powerRefillsGained}/${quest.objectives.powerRefills}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${powerRefillsComplete ? '#28a745' : deptColors.light};height:100%;width:${powerRefillPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
          </div>
        </div>
      `);
    }
    
    if (quest.objectives.prismClicks && !quest.objectives.berryTokens) {
      const prismClicksGained = progress.prismClicksGained || 0;
      const prismClicksComplete = prismClicksGained >= quest.objectives.prismClicks;
      const prismClickPercent = Math.min(100, (prismClicksGained / quest.objectives.prismClicks) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Click Prism Tiles</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${prismClicksComplete ? '✓' : `${prismClicksGained}/${quest.objectives.prismClicks}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${prismClicksComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClickPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
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

    if (quest.objectives.commonBoxes) {
      const commonBoxesCount = progress.commonBoxes || new Decimal(0);
      const commonBoxesComplete = DecimalUtils.isDecimal(commonBoxesCount) ? commonBoxesCount.gte(quest.objectives.commonBoxes) : commonBoxesCount >= quest.objectives.commonBoxes;
      const commonBoxesPercent = commonBoxesComplete ? 100 : Math.min(100, DecimalUtils.isDecimal(commonBoxesCount) ? commonBoxesCount.div(quest.objectives.commonBoxes).mul(100).toNumber() : (commonBoxesCount / quest.objectives.commonBoxes) * 100);
      
      progressItems.push(`
        <div style="margin-bottom:0.5em;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
            <span style="font-size:0.75em;color:${deptColors.text};">Produce Common Boxes</span>
            <span style="font-size:0.7em;color:${deptColors.text};opacity:0.9;">${commonBoxesComplete ? '✓' : `${DecimalUtils.formatDecimal(commonBoxesCount)}/${DecimalUtils.formatDecimal(quest.objectives.commonBoxes)}`}</span>
          </div>
          <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:4px;overflow:hidden;">
            <div style="background:${commonBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${commonBoxesPercent}%;transition:width 0.3s ease;border-radius:4px;"></div>
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
    
    // Mystic quest specific objectives
    if (quest.objectives.cookBatteries) {
      hasAnyObjectives = true;
      const cookBatteries = (progress && progress.cookBatteries) || 0;
      if (cookBatteries < quest.objectives.cookBatteries) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.sparksTokens) {
      hasAnyObjectives = true;
      const sparksTokens = (progress && progress.sparksTokens) || 0;
      if (sparksTokens < quest.objectives.sparksTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.generatorTokensFromBoxes) {
      hasAnyObjectives = true;
      const generatorTokensFromBoxes = (progress && progress.generatorTokensFromBoxes) || 0;
      if (generatorTokensFromBoxes < quest.objectives.generatorTokensFromBoxes) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.generateBoxes) {
      hasAnyObjectives = true;
      const generateBoxes = (progress && progress.generateBoxes) || 0;
      if (generateBoxes < quest.objectives.generateBoxes) {
        allObjectivesMet = false;
      }
    }
    
    // Mystic Quest 3 specific objectives
    if (quest.objectives.cookChargedPrisma) {
      hasAnyObjectives = true;
      const cookChargedPrisma = (progress && progress.cookChargedPrisma) || 0;
      if (cookChargedPrisma < quest.objectives.cookChargedPrisma) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.prismaTokens) {
      hasAnyObjectives = true;
      const prismaTokens = (progress && progress.prismaTokens) || 0;
      if (prismaTokens < quest.objectives.prismaTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.prismClickTokens) {
      hasAnyObjectives = true;
      const prismClickTokens = (progress && progress.prismClickTokens) || 0;
      if (prismClickTokens < quest.objectives.prismClickTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.clickPrismTiles) {
      hasAnyObjectives = true;
      const clickPrismTiles = (progress && progress.clickPrismTiles) || 0;
      if (clickPrismTiles < quest.objectives.clickPrismTiles) {
        allObjectivesMet = false;
      }
    }
    
    // Additional cooking objectives (Quest 4, 6, 7)
    if (quest.objectives.cookBerryPlates) {
      hasAnyObjectives = true;
      const cookBerryPlates = (progress && progress.cookBerryPlates) || 0;
      if (cookBerryPlates < quest.objectives.cookBerryPlates) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.cookMushroomSoup) {
      hasAnyObjectives = true;
      const cookMushroomSoup = (progress && progress.cookMushroomSoup) || 0;
      if (cookMushroomSoup < quest.objectives.cookMushroomSoup) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.cookGlitteringPetals) {
      hasAnyObjectives = true;
      const cookGlitteringPetals = (progress && progress.cookGlitteringPetals) || 0;
      if (cookGlitteringPetals < quest.objectives.cookGlitteringPetals) {
        allObjectivesMet = false;
      }
    }
    
    // Token collection objectives (Quest 4, 5, 6, 7)
    if (quest.objectives.collectAnyTokens) {
      hasAnyObjectives = true;
      const collectAnyTokens = (progress && progress.collectAnyTokens) || 0;
      if (collectAnyTokens < quest.objectives.collectAnyTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.stardustTokens) {
      hasAnyObjectives = true;
      const stardustTokens = (progress && progress.stardustTokens) || 0;
      if (stardustTokens < quest.objectives.stardustTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.nightTimeTokens) {
      hasAnyObjectives = true;
      const nightTimeTokens = (progress && progress.nightTimeTokens) || 0;
      if (nightTimeTokens < quest.objectives.nightTimeTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.petalTokens) {
      hasAnyObjectives = true;
      const petalTokens = (progress && progress.petalTokens) || 0;
      if (petalTokens < quest.objectives.petalTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.terrariumRustlingTokens) {
      hasAnyObjectives = true;
      const terrariumRustlingTokens = (progress && progress.terrariumRustlingTokens) || 0;
      if (terrariumRustlingTokens < quest.objectives.terrariumRustlingTokens) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.cargoTokensFromBoxes) {
      hasAnyObjectives = true;
      const cargoTokensFromBoxes = (progress && progress.cargoTokensFromBoxes) || 0;
      if (cargoTokensFromBoxes < quest.objectives.cargoTokensFromBoxes) {
        allObjectivesMet = false;
      }
    }
    
    // Night-time specific objectives (Quest 5)
    if (quest.objectives.buyBoxesAtNight) {
      hasAnyObjectives = true;
      const buyBoxesAtNight = (progress && progress.buyBoxesAtNight) || 0;
      if (buyBoxesAtNight < quest.objectives.buyBoxesAtNight) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.clickPrismTilesAtNight) {
      hasAnyObjectives = true;
      const clickPrismTilesAtNight = (progress && progress.clickPrismTilesAtNight) || 0;
      if (clickPrismTilesAtNight < quest.objectives.clickPrismTilesAtNight) {
        allObjectivesMet = false;
      }
    }
    
    // Terrarium action objectives (Quest 6, 7)
    if (quest.objectives.waterFlowers) {
      hasAnyObjectives = true;
      const waterFlowers = (progress && progress.waterFlowers) || 0;
      if (waterFlowers < quest.objectives.waterFlowers) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.extractPollen) {
      hasAnyObjectives = true;
      const extractPollen = (progress && progress.extractPollen) || 0;
      if (extractPollen < quest.objectives.extractPollen) {
        allObjectivesMet = false;
      }
    }
    
    if (quest.objectives.clickFlowersTotal) {
      hasAnyObjectives = true;
      const clickFlowersTotal = (progress && progress.clickFlowersTotal) || 0;
      if (clickFlowersTotal < quest.objectives.clickFlowersTotal) {
        allObjectivesMet = false;
      }
    }
    
    // General box objectives (Quest 7)
    if (quest.objectives.buyBoxes) {
      hasAnyObjectives = true;
      const buyBoxes = (progress && progress.buyBoxes) || 0;
      if (buyBoxes < quest.objectives.buyBoxes) {
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
      <div style="font-weight:bold;color:${deptColors.text};font-size:0.9em;margin-bottom:0.3em;padding-top:4px;">${quest.title}${isReadyToTurnIn ? ' ✓' : ''}</div>
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
// Throttling and caching for quest modal updates
let questModalLastUpdate = 0;
let questModalCache = null;
let userScrollingData = {}; // Track which quest scrolls the user is actively using
const QUEST_MODAL_UPDATE_INTERVAL = 1000; // Update at most every 1 second
const USER_SCROLL_PROTECTION_TIME = 2000; // Protect user scrolling for 2 seconds

// Track user scroll activity
function trackUserScrollActivity(questId) {
  userScrollingData[questId] = Date.now();
}

// Check if user is currently scrolling any quest
function isUserCurrentlyScrolling() {
  const now = Date.now();
  return Object.values(userScrollingData).some(lastScroll => 
    now - lastScroll < USER_SCROLL_PROTECTION_TIME
  );
}

function updateQuestModal() {
  const questContent = document.getElementById('questContent');
  if (!questContent || !window.state || !window.state.questSystem) return;
  
  // Don't update if user is actively scrolling
  if (isUserCurrentlyScrolling()) {
    return;
  }
  
  // Throttle updates to prevent excessive refreshing
  const now = Date.now();
  if (now - questModalLastUpdate < QUEST_MODAL_UPDATE_INTERVAL) {
    return;
  }
  questModalLastUpdate = now;
  
  const activeQuests = window.state.questSystem.activeQuests.map(id => questDefinitions[id]).filter(Boolean);
  const completedQuests = window.state.questSystem.completedQuests.map(id => questDefinitions[id]).filter(Boolean);
  const claimableCount = window.state.questSystem.claimableQuests.length;
  
  // Create content signature to detect changes
  const contentSignature = JSON.stringify({
    activeQuests: activeQuests.map(q => q.id),
    completedQuests: completedQuests.map(q => q.id),
    claimableCount,
    questProgress: window.state.questSystem.questProgress
  });
  
  // Only update if content actually changed
  if (questModalCache === contentSignature) {
    return;
  }
  questModalCache = contentSignature;
  
  // Store scroll positions before updating
  const scrollPositions = {};
  activeQuests.forEach(quest => {
    const scrollContainer = document.getElementById(`quest-scroll-${quest.id}`);
    if (scrollContainer) {
      scrollPositions[quest.id] = scrollContainer.scrollTop;
    }
  });
  
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
            const deptColors = getDepartmentColors(quest.department, quest.character);
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
                      <span style="font-size:0.85em;color:${deptColors.text};">Produce Common Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${commonBoxesComplete ? '✓' : `${commonBoxesProduced}/${quest.objectives.commonBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${commonBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${commonBoxPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.uncommonBoxes) {
                const uncommonBoxesProduced = progress.uncommonBoxesProduced || 0;
                const uncommonBoxesComplete = uncommonBoxesProduced >= quest.objectives.uncommonBoxes;
                const uncommonBoxPercent = Math.min(100, (uncommonBoxesProduced / quest.objectives.uncommonBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Produce Uncommon Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${uncommonBoxesComplete ? '✓' : `${uncommonBoxesProduced}/${quest.objectives.uncommonBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${uncommonBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${uncommonBoxPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.rareBoxes) {
                const rareBoxesProduced = progress.rareBoxesProduced || 0;
                const rareBoxesComplete = rareBoxesProduced >= quest.objectives.rareBoxes;
                const rareBoxPercent = Math.min(100, (rareBoxesProduced / quest.objectives.rareBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Produce Rare Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${rareBoxesComplete ? '✓' : `${rareBoxesProduced}/${quest.objectives.rareBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${rareBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${rareBoxPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.mythicBoxes) {
                const mythicBoxesProduced = progress.mythicBoxesProduced || 0;
                const mythicBoxesComplete = mythicBoxesProduced >= quest.objectives.mythicBoxes;
                const mythicBoxPercent = Math.min(100, (mythicBoxesProduced / quest.objectives.mythicBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Produce Mythic Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${mythicBoxesComplete ? '✓' : `${mythicBoxesProduced}/${quest.objectives.mythicBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${mythicBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${mythicBoxPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.legendaryBoxes) {
                const legendaryBoxesProduced = progress.legendaryBoxesProduced || 0;
                const legendaryBoxesComplete = legendaryBoxesProduced >= quest.objectives.legendaryBoxes;
                const legendaryBoxPercent = Math.min(100, (legendaryBoxesProduced / quest.objectives.legendaryBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Produce Legendary Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${legendaryBoxesComplete ? '✓' : `${legendaryBoxesProduced}/${quest.objectives.legendaryBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${legendaryBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${legendaryBoxPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.feathers) {
                const feathersGained = progress.feathersCollected || new Decimal(0);
                const feathersComplete = feathersGained.gte(quest.objectives.feathers);
                const feathersPercent = feathersComplete ? 100 : Math.min(100, feathersGained.div(quest.objectives.feathers).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Feathers Gained</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${feathersComplete ? '✓' : `${DecimalUtils.formatDecimal(feathersGained)}/${DecimalUtils.formatDecimal(quest.objectives.feathers)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${feathersComplete ? '#28a745' : deptColors.light};height:100%;width:${feathersPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.artifacts) {
                const artifactsGained = progress.artifactsCollected || new Decimal(0);
                const artifactsComplete = artifactsGained.gte(quest.objectives.artifacts);
                const artifactsPercent = artifactsComplete ? 100 : Math.min(100, artifactsGained.div(quest.objectives.artifacts).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Artifacts Gained</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${artifactsComplete ? '✓' : `${DecimalUtils.formatDecimal(artifactsGained)}/${DecimalUtils.formatDecimal(quest.objectives.artifacts)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${artifactsComplete ? '#28a745' : deptColors.light};height:100%;width:${artifactsPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.allBoxGeneratorsRunning) {
                const allGeneratorsRunning = progress.allBoxGeneratorsRunning || false;
                const generatorsPercent = allGeneratorsRunning ? 100 : 0;
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">All Box Generators Running</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${allGeneratorsRunning ? '✓' : 'Not Running'}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${allGeneratorsRunning ? '#28a745' : deptColors.light};height:100%;width:${generatorsPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              // Exponential objectives (track actual box volume produced)
              if (quest.objectives.commonBoxesExponential) {
                const commonBoxesProducedExp = progress.commonBoxesProducedExponential || 0;
                const commonBoxesCompleteExp = commonBoxesProducedExp >= quest.objectives.commonBoxesExponential;
                const commonBoxPercentExp = Math.min(100, (commonBoxesProducedExp / quest.objectives.commonBoxesExponential) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Common Boxes (Volume)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${commonBoxesCompleteExp ? '✓' : `${commonBoxesProducedExp}/${quest.objectives.commonBoxesExponential}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${commonBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${commonBoxPercentExp}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              if (quest.objectives.uncommonBoxesExponential) {
                const uncommonBoxesProducedExp = progress.uncommonBoxesProducedExponential || 0;
                const uncommonBoxesCompleteExp = uncommonBoxesProducedExp >= quest.objectives.uncommonBoxesExponential;
                const uncommonBoxPercentExp = Math.min(100, (uncommonBoxesProducedExp / quest.objectives.uncommonBoxesExponential) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Uncommon Boxes (Volume)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${uncommonBoxesCompleteExp ? '✓' : `${uncommonBoxesProducedExp}/${quest.objectives.uncommonBoxesExponential}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${uncommonBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${uncommonBoxPercentExp}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.rareBoxesExponential) {
                const rareBoxesProducedExp = progress.rareBoxesProducedExponential || 0;
                const rareBoxesCompleteExp = rareBoxesProducedExp >= quest.objectives.rareBoxesExponential;
                const rareBoxPercentExp = Math.min(100, (rareBoxesProducedExp / quest.objectives.rareBoxesExponential) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Rare Boxes (Volume)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${rareBoxesCompleteExp ? '✓' : `${rareBoxesProducedExp}/${quest.objectives.rareBoxesExponential}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${rareBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${rareBoxPercentExp}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.legendaryBoxesExponential) {
                const legendaryBoxesProducedExp = progress.legendaryBoxesProducedExponential || 0;
                const legendaryBoxesCompleteExp = legendaryBoxesProducedExp >= quest.objectives.legendaryBoxesExponential;
                const legendaryBoxPercentExp = Math.min(100, (legendaryBoxesProducedExp / quest.objectives.legendaryBoxesExponential) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Legendary Boxes (Volume)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${legendaryBoxesCompleteExp ? '✓' : `${legendaryBoxesProducedExp}/${quest.objectives.legendaryBoxesExponential}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${legendaryBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${legendaryBoxPercentExp}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.mythicBoxesExponential) {
                const mythicBoxesProducedExp = progress.mythicBoxesProducedExponential || 0;
                const mythicBoxesCompleteExp = mythicBoxesProducedExp >= quest.objectives.mythicBoxesExponential;
                const mythicBoxPercentExp = Math.min(100, (mythicBoxesProducedExp / quest.objectives.mythicBoxesExponential) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Mythic Boxes (Volume)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${mythicBoxesCompleteExp ? '✓' : `${mythicBoxesProducedExp}/${quest.objectives.mythicBoxesExponential}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${mythicBoxesCompleteExp ? '#28a745' : deptColors.light};height:100%;width:${mythicBoxPercentExp}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              // Power refill objective
              if (quest.objectives.powerRefills) {
                const powerRefillsGained = progress.powerRefillsGained || 0;
                const powerRefillsComplete = powerRefillsGained >= quest.objectives.powerRefills;
                const powerRefillPercent = Math.min(100, (powerRefillsGained / quest.objectives.powerRefills) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Refill Power</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${powerRefillsComplete ? '✓' : `${powerRefillsGained}/${quest.objectives.powerRefills}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${powerRefillsComplete ? '#28a745' : deptColors.light};height:100%;width:${powerRefillPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }
              
              // KitoFox Challenge specific objectives (legacy tracking for berry challenges only)
              
              // KitoFox Challenge specific objectives
              if (quest.objectives.berryTokens && quest.id === 'kitofox_challenge') {
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
                const prismClickCount = progress.prismClicksGained || 0;
                const prismClicksComplete = prismClickCount >= quest.objectives.prismClicks;
                const prismClickPercent = Math.min(100, (prismClickCount / quest.objectives.prismClicks) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Prism Tiles</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismClicksComplete ? '✓' : `${prismClickCount}/${quest.objectives.prismClicks}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismClicksComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClickPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
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

              // Cooking objectives
              if (quest.objectives.cookBerryPlates) {
                const cookBerryPlates = progress.cookBerryPlates || 0;
                const cookBerryPlatesComplete = cookBerryPlates >= quest.objectives.cookBerryPlates;
                const cookBerryPlatesPercent = Math.min(100, (cookBerryPlates / quest.objectives.cookBerryPlates) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Berry Plates</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cookBerryPlatesComplete ? '✓' : `${cookBerryPlates}/${quest.objectives.cookBerryPlates}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cookBerryPlatesComplete ? '#28a745' : deptColors.light};height:100%;width:${cookBerryPlatesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.cookMushroomSoup) {
                const cookMushroomSoup = progress.cookMushroomSoup || 0;
                const cookMushroomSoupComplete = cookMushroomSoup >= quest.objectives.cookMushroomSoup;
                const cookMushroomSoupPercent = Math.min(100, (cookMushroomSoup / quest.objectives.cookMushroomSoup) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Mushroom Soup</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cookMushroomSoupComplete ? '✓' : `${cookMushroomSoup}/${quest.objectives.cookMushroomSoup}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cookMushroomSoupComplete ? '#28a745' : deptColors.light};height:100%;width:${cookMushroomSoupPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.cookBatteries) {
                const cookBatteries = progress.cookBatteries || 0;
                const cookBatteriesComplete = cookBatteries >= quest.objectives.cookBatteries;
                const cookBatteriesPercent = Math.min(100, (cookBatteries / quest.objectives.cookBatteries) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Batteries</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cookBatteriesComplete ? '✓' : `${cookBatteries}/${quest.objectives.cookBatteries}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cookBatteriesComplete ? '#28a745' : deptColors.light};height:100%;width:${cookBatteriesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.cookGlitteringPetals) {
                const cookGlitteringPetals = progress.cookGlitteringPetals || 0;
                const cookGlitteringPetalsComplete = cookGlitteringPetals >= quest.objectives.cookGlitteringPetals;
                const cookGlitteringPetalsPercent = Math.min(100, (cookGlitteringPetals / quest.objectives.cookGlitteringPetals) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Glittering Petals</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cookGlitteringPetalsComplete ? '✓' : `${cookGlitteringPetals}/${quest.objectives.cookGlitteringPetals}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cookGlitteringPetalsComplete ? '#28a745' : deptColors.light};height:100%;width:${cookGlitteringPetalsPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.cookChargedPrisma) {
                const cookChargedPrisma = progress.cookChargedPrisma || 0;
                const cookChargedPrismaComplete = cookChargedPrisma >= quest.objectives.cookChargedPrisma;
                const cookChargedPrismaPercent = Math.min(100, (cookChargedPrisma / quest.objectives.cookChargedPrisma) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Charged Prisma</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cookChargedPrismaComplete ? '✓' : `${cookChargedPrisma}/${quest.objectives.cookChargedPrisma}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cookChargedPrismaComplete ? '#28a745' : deptColors.light};height:100%;width:${cookChargedPrismaPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              // Basic ingredient objectives (skip for Mystic quests which use token variants)
              if (quest.objectives.berries && quest.character !== 'mystic') {
                const berriesCollected = progress.berriesCollected || new Decimal(0);
                const berriesComplete = berriesCollected.gte(quest.objectives.berries);
                const berriesPercent = berriesComplete ? 100 : Math.min(100, berriesCollected.div(quest.objectives.berries).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Berries</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${berriesComplete ? '✓' : `${DecimalUtils.formatDecimal(berriesCollected)}/${DecimalUtils.formatDecimal(quest.objectives.berries)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${berriesComplete ? '#28a745' : deptColors.light};height:100%;width:${berriesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.water) {
                const waterCollected = progress.waterCollected || new Decimal(0);
                const waterComplete = waterCollected.gte(quest.objectives.water);
                const waterPercent = waterComplete ? 100 : Math.min(100, waterCollected.div(quest.objectives.water).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Water</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${waterComplete ? '✓' : `${DecimalUtils.formatDecimal(waterCollected)}/${DecimalUtils.formatDecimal(quest.objectives.water)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${waterComplete ? '#28a745' : deptColors.light};height:100%;width:${waterPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.mushroom) {
                const mushroomCollected = progress.mushroomCollected || new Decimal(0);
                const mushroomComplete = mushroomCollected.gte(quest.objectives.mushroom);
                const mushroomPercent = mushroomComplete ? 100 : Math.min(100, mushroomCollected.div(quest.objectives.mushroom).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Mushrooms</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${mushroomComplete ? '✓' : `${DecimalUtils.formatDecimal(mushroomCollected)}/${DecimalUtils.formatDecimal(quest.objectives.mushroom)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${mushroomComplete ? '#28a745' : deptColors.light};height:100%;width:${mushroomPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.sparks) {
                const sparksCollected = progress.sparksCollected || new Decimal(0);
                const sparksComplete = sparksCollected.gte(quest.objectives.sparks);
                const sparksPercent = sparksComplete ? 100 : Math.min(100, sparksCollected.div(quest.objectives.sparks).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Sparks</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${sparksComplete ? '✓' : `${DecimalUtils.formatDecimal(sparksCollected)}/${DecimalUtils.formatDecimal(quest.objectives.sparks)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${sparksComplete ? '#28a745' : deptColors.light};height:100%;width:${sparksPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.prisma) {
                const prismaCollected = progress.prismaCollected || new Decimal(0);
                const prismaComplete = prismaCollected.gte(quest.objectives.prisma);
                const prismaPercent = prismaComplete ? 100 : Math.min(100, prismaCollected.div(quest.objectives.prisma).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Prisma</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismaComplete ? '✓' : `${DecimalUtils.formatDecimal(prismaCollected)}/${DecimalUtils.formatDecimal(quest.objectives.prisma)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismaComplete ? '#28a745' : deptColors.light};height:100%;width:${prismaPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              // Mystic quest specific objectives
              if (quest.objectives.berryTokens && quest.character === 'mystic') {
                const berryTokenCount = progress.berryTokens || 0;
                const berryTokenComplete = berryTokenCount >= quest.objectives.berryTokens;
                const berryTokenPercent = Math.min(100, (berryTokenCount / quest.objectives.berryTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Berry Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${berryTokenComplete ? '✓' : `${berryTokenCount}/${quest.objectives.berryTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${berryTokenComplete ? '#28a745' : deptColors.light};height:100%;width:${berryTokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.sparksTokens && quest.character === 'mystic') {
                const sparksTokenCount = progress.sparksTokens || 0;
                const sparksTokenComplete = sparksTokenCount >= quest.objectives.sparksTokens;
                const sparksTokenPercent = Math.min(100, (sparksTokenCount / quest.objectives.sparksTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Spark Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${sparksTokenComplete ? '✓' : `${sparksTokenCount}/${quest.objectives.sparksTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${sparksTokenComplete ? '#28a745' : deptColors.light};height:100%;width:${sparksTokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.prismaTokens && quest.character === 'mystic') {
                const prismaTokenCount = progress.prismaTokens || 0;
                const prismaTokenComplete = prismaTokenCount >= quest.objectives.prismaTokens;
                const prismaTokenPercent = Math.min(100, (prismaTokenCount / quest.objectives.prismaTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Prisma Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismaTokenComplete ? '✓' : `${prismaTokenCount}/${quest.objectives.prismaTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismaTokenComplete ? '#28a745' : deptColors.light};height:100%;width:${prismaTokenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }



              if (quest.objectives.cargoTokensFromBoxes && quest.character === 'mystic') {
                const cargoTokensFromBoxes = progress.cargoTokensFromBoxes || 0;
                const cargoTokensComplete = cargoTokensFromBoxes >= quest.objectives.cargoTokensFromBoxes;
                const cargoTokensPercent = Math.min(100, (cargoTokensFromBoxes / quest.objectives.cargoTokensFromBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cargo Box Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cargoTokensComplete ? '✓' : `${cargoTokensFromBoxes}/${quest.objectives.cargoTokensFromBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cargoTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${cargoTokensPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.generatorTokensFromBoxes && quest.character === 'mystic') {
                const generatorTokensFromBoxes = progress.generatorTokensFromBoxes || 0;
                const generatorTokensComplete = generatorTokensFromBoxes >= quest.objectives.generatorTokensFromBoxes;
                const generatorTokensPercent = Math.min(100, (generatorTokensFromBoxes / quest.objectives.generatorTokensFromBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Generator Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${generatorTokensComplete ? '✓' : `${generatorTokensFromBoxes}/${quest.objectives.generatorTokensFromBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${generatorTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${generatorTokensPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.prismClickTokens && quest.character === 'mystic') {
                const prismClickTokens = progress.prismClickTokens || 0;
                const prismClickTokensComplete = prismClickTokens >= quest.objectives.prismClickTokens;
                const prismClickTokensPercent = Math.min(100, (prismClickTokens / quest.objectives.prismClickTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Prism Click Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismClickTokensComplete ? '✓' : `${prismClickTokens}/${quest.objectives.prismClickTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismClickTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${prismClickTokensPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.terrariumRustlingTokens && quest.character === 'mystic') {
                const terrariumRustlingTokens = progress.terrariumRustlingTokens || 0;
                const terrariumRustlingTokensComplete = terrariumRustlingTokens >= quest.objectives.terrariumRustlingTokens;
                const terrariumRustlingTokensPercent = Math.min(100, (terrariumRustlingTokens / quest.objectives.terrariumRustlingTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Terrarium Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${terrariumRustlingTokensComplete ? '✓' : `${terrariumRustlingTokens}/${quest.objectives.terrariumRustlingTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${terrariumRustlingTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${terrariumRustlingTokensPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.nightTimeTokens && quest.character === 'mystic') {
                const nightTimeTokens = progress.nightTimeTokens || 0;
                const nightTimeTokensComplete = nightTimeTokens >= quest.objectives.nightTimeTokens;
                const nightTimeTokensPercent = Math.min(100, (nightTimeTokens / quest.objectives.nightTimeTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Night Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${nightTimeTokensComplete ? '✓' : `${nightTimeTokens}/${quest.objectives.nightTimeTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${nightTimeTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${nightTimeTokensPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.collectAnyTokens && quest.character === 'mystic') {
                const collectAnyTokens = progress.collectAnyTokens || 0;
                const collectAnyTokensComplete = collectAnyTokens >= quest.objectives.collectAnyTokens;
                const collectAnyTokensPercent = Math.min(100, (collectAnyTokens / quest.objectives.collectAnyTokens) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Any Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${collectAnyTokensComplete ? '✓' : `${collectAnyTokens}/${quest.objectives.collectAnyTokens}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${collectAnyTokensComplete ? '#28a745' : deptColors.light};height:100%;width:${collectAnyTokensPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.buyBoxes) {
                const buyBoxes = progress.buyBoxes || 0;
                const buyBoxesComplete = buyBoxes >= quest.objectives.buyBoxes;
                const buyBoxesPercent = Math.min(100, (buyBoxes / quest.objectives.buyBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Buy Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${buyBoxesComplete ? '✓' : `${buyBoxes}/${quest.objectives.buyBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${buyBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${buyBoxesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.buyBoxesAtNight) {
                const buyBoxesAtNight = progress.buyBoxesAtNight || 0;
                const buyBoxesAtNightComplete = buyBoxesAtNight >= quest.objectives.buyBoxesAtNight;
                const buyBoxesAtNightPercent = Math.min(100, (buyBoxesAtNight / quest.objectives.buyBoxesAtNight) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Buy Boxes at Night</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${buyBoxesAtNightComplete ? '✓' : `${buyBoxesAtNight}/${quest.objectives.buyBoxesAtNight}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${buyBoxesAtNightComplete ? '#28a745' : deptColors.light};height:100%;width:${buyBoxesAtNightPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.generateBoxes) {
                const generateBoxes = progress.generateBoxes || 0;
                const generateBoxesComplete = generateBoxes >= quest.objectives.generateBoxes;
                const generateBoxesPercent = Math.min(100, (generateBoxes / quest.objectives.generateBoxes) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Generate Boxes</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${generateBoxesComplete ? '✓' : `${generateBoxes}/${quest.objectives.generateBoxes}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${generateBoxesComplete ? '#28a745' : deptColors.light};height:100%;width:${generateBoxesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.clickPrismTiles) {
                const clickPrismTiles = progress.clickPrismTiles || 0;
                const clickPrismTilesComplete = clickPrismTiles >= quest.objectives.clickPrismTiles;
                const clickPrismTilesPercent = Math.min(100, (clickPrismTiles / quest.objectives.clickPrismTiles) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Prism Tiles</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${clickPrismTilesComplete ? '✓' : `${clickPrismTiles}/${quest.objectives.clickPrismTiles}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${clickPrismTilesComplete ? '#28a745' : deptColors.light};height:100%;width:${clickPrismTilesPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.clickPrismTilesAtNight) {
                const clickPrismTilesAtNight = progress.clickPrismTilesAtNight || 0;
                const clickPrismTilesAtNightComplete = clickPrismTilesAtNight >= quest.objectives.clickPrismTilesAtNight;
                const clickPrismTilesAtNightPercent = Math.min(100, (clickPrismTilesAtNight / quest.objectives.clickPrismTilesAtNight) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Prisms at Night</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${clickPrismTilesAtNightComplete ? '✓' : `${clickPrismTilesAtNight}/${quest.objectives.clickPrismTilesAtNight}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${clickPrismTilesAtNightComplete ? '#28a745' : deptColors.light};height:100%;width:${clickPrismTilesAtNightPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.waterFlowers) {
                const waterFlowers = progress.waterFlowers || 0;
                const waterFlowersComplete = waterFlowers >= quest.objectives.waterFlowers;
                const waterFlowersPercent = Math.min(100, (waterFlowers / quest.objectives.waterFlowers) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Water Flowers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${waterFlowersComplete ? '✓' : `${waterFlowers}/${quest.objectives.waterFlowers}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${waterFlowersComplete ? '#28a745' : deptColors.light};height:100%;width:${waterFlowersPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.extractPollen) {
                const extractPollen = progress.extractPollen || 0;
                const extractPollenComplete = extractPollen >= quest.objectives.extractPollen;
                const extractPollenPercent = Math.min(100, (extractPollen / quest.objectives.extractPollen) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Flowers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${extractPollenComplete ? '✓' : `${extractPollen}/${quest.objectives.extractPollen}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${extractPollenComplete ? '#28a745' : deptColors.light};height:100%;width:${extractPollenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.clickFlowersTotal) {
                const clickFlowersTotal = progress.clickFlowersTotal || 0;
                const clickFlowersTotalComplete = clickFlowersTotal >= quest.objectives.clickFlowersTotal;
                const clickFlowersTotalPercent = Math.min(100, (clickFlowersTotal / quest.objectives.clickFlowersTotal) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Click Flowers Total</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${clickFlowersTotalComplete ? '✓' : `${clickFlowersTotal}/${quest.objectives.clickFlowersTotal}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${clickFlowersTotalComplete ? '#28a745' : deptColors.light};height:100%;width:${clickFlowersTotalPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.cookAnyIngredients) {
                const cookAnyIngredients = progress.cookAnyIngredients || 0;
                const cookAnyIngredientsComplete = cookAnyIngredients >= quest.objectives.cookAnyIngredients;
                const cookAnyIngredientsPercent = Math.min(100, (cookAnyIngredients / quest.objectives.cookAnyIngredients) * 100);
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Cook Any Ingredients</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${cookAnyIngredientsComplete ? '✓' : `${cookAnyIngredients}/${quest.objectives.cookAnyIngredients}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${cookAnyIngredientsComplete ? '#28a745' : deptColors.light};height:100%;width:${cookAnyIngredientsPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              // Lepre Quest specific objectives
              if (quest.objectives.tokensPurchased) {
                const tokensPurchasedCount = DecimalUtils.isDecimal(progress.tokensPurchased) ? progress.tokensPurchased : new Decimal(progress.tokensPurchased || 0);
                const tokensPurchasedComplete = tokensPurchasedCount.gte(quest.objectives.tokensPurchased);
                const tokensPurchasedPercent = tokensPurchasedComplete ? 100 : Math.min(100, tokensPurchasedCount.div(quest.objectives.tokensPurchased).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Purchase Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${tokensPurchasedComplete ? '✓' : `${DecimalUtils.formatDecimal(tokensPurchasedCount)}/${DecimalUtils.formatDecimal(quest.objectives.tokensPurchased)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${tokensPurchasedComplete ? '#28a745' : deptColors.light};height:100%;width:${tokensPurchasedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.berryTokensPurchased) {
                const berryTokensPurchasedCount = DecimalUtils.isDecimal(progress.berryTokensPurchased) ? progress.berryTokensPurchased : new Decimal(progress.berryTokensPurchased || 0);
                const berryTokensPurchasedComplete = berryTokensPurchasedCount.gte(quest.objectives.berryTokensPurchased);
                const berryTokensPurchasedPercent = berryTokensPurchasedComplete ? 100 : Math.min(100, berryTokensPurchasedCount.div(quest.objectives.berryTokensPurchased).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Purchase Berry Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${berryTokensPurchasedComplete ? '✓' : `${DecimalUtils.formatDecimal(berryTokensPurchasedCount)}/${DecimalUtils.formatDecimal(quest.objectives.berryTokensPurchased)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${berryTokensPurchasedComplete ? '#28a745' : deptColors.light};height:100%;width:${berryTokensPurchasedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.waterTokensPurchased) {
                const waterTokensPurchasedCount = DecimalUtils.isDecimal(progress.waterTokensPurchased) ? progress.waterTokensPurchased : new Decimal(progress.waterTokensPurchased || 0);
                const waterTokensPurchasedComplete = waterTokensPurchasedCount.gte(quest.objectives.waterTokensPurchased);
                const waterTokensPurchasedPercent = waterTokensPurchasedComplete ? 100 : Math.min(100, waterTokensPurchasedCount.div(quest.objectives.waterTokensPurchased).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Purchase Water Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${waterTokensPurchasedComplete ? '✓' : `${DecimalUtils.formatDecimal(waterTokensPurchasedCount)}/${DecimalUtils.formatDecimal(quest.objectives.waterTokensPurchased)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${waterTokensPurchasedComplete ? '#28a745' : deptColors.light};height:100%;width:${waterTokensPurchasedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.premiumTokensPurchased) {
                const premiumTokensPurchasedCount = DecimalUtils.isDecimal(progress.premiumTokensPurchased) ? progress.premiumTokensPurchased : DecimalUtils.toDecimal(progress.premiumTokensPurchased || 0);
                const premiumTokensPurchasedComplete = premiumTokensPurchasedCount.gte(quest.objectives.premiumTokensPurchased);
                const premiumTokensPurchasedPercent = premiumTokensPurchasedComplete ? 100 : Math.min(100, premiumTokensPurchasedCount.div(quest.objectives.premiumTokensPurchased).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Purchase Premium Tokens</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${premiumTokensPurchasedComplete ? '✓' : `${DecimalUtils.formatDecimal(premiumTokensPurchasedCount)}/${DecimalUtils.formatDecimal(quest.objectives.premiumTokensPurchased)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${premiumTokensPurchasedComplete ? '#28a745' : deptColors.light};height:100%;width:${premiumTokensPurchasedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.freeBucksClaimed) {
                const freeBucksClaimedCount = DecimalUtils.isDecimal(progress.freeBucksClaimed) ? progress.freeBucksClaimed : new Decimal(progress.freeBucksClaimed || 0);
                const freeBucksClaimedComplete = freeBucksClaimedCount.gte(quest.objectives.freeBucksClaimed);
                const freeBucksClaimedPercent = freeBucksClaimedComplete ? 100 : Math.min(100, freeBucksClaimedCount.div(quest.objectives.freeBucksClaimed).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Claim Free Swa Bucks</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${freeBucksClaimedComplete ? '✓' : `${DecimalUtils.formatDecimal(freeBucksClaimedCount)}/${DecimalUtils.formatDecimal(quest.objectives.freeBucksClaimed)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${freeBucksClaimedComplete ? '#28a745' : deptColors.light};height:100%;width:${freeBucksClaimedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              // Token giving objectives (lepre_quest_3)
              if (quest.objectives.berriesGiven) {
                const berriesGivenCount = DecimalUtils.isDecimal(progress.berriesGiven) ? progress.berriesGiven : DecimalUtils.toDecimal(progress.berriesGiven || 0);
                const berriesGivenComplete = berriesGivenCount.gte(quest.objectives.berriesGiven);
                const berriesGivenPercent = berriesGivenComplete ? 100 : Math.min(100, berriesGivenCount.div(quest.objectives.berriesGiven).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Give Berries to Workers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${berriesGivenComplete ? '✓' : `${DecimalUtils.formatDecimal(berriesGivenCount)}/${DecimalUtils.formatDecimal(quest.objectives.berriesGiven)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${berriesGivenComplete ? '#28a745' : deptColors.light};height:100%;width:${berriesGivenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.petalsGiven) {
                const petalsGivenCount = DecimalUtils.isDecimal(progress.petalsGiven) ? progress.petalsGiven : DecimalUtils.toDecimal(progress.petalsGiven || 0);
                const petalsGivenComplete = petalsGivenCount.gte(quest.objectives.petalsGiven);
                const petalsGivenPercent = petalsGivenComplete ? 100 : Math.min(100, petalsGivenCount.div(quest.objectives.petalsGiven).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Give Petals to Workers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${petalsGivenComplete ? '✓' : `${DecimalUtils.formatDecimal(petalsGivenCount)}/${DecimalUtils.formatDecimal(quest.objectives.petalsGiven)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${petalsGivenComplete ? '#28a745' : deptColors.light};height:100%;width:${petalsGivenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.waterGiven) {
                const waterGivenCount = DecimalUtils.isDecimal(progress.waterGiven) ? progress.waterGiven : DecimalUtils.toDecimal(progress.waterGiven || 0);
                const waterGivenComplete = waterGivenCount.gte(quest.objectives.waterGiven);
                const waterGivenPercent = waterGivenComplete ? 100 : Math.min(100, waterGivenCount.div(quest.objectives.waterGiven).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Give Water to Workers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${waterGivenComplete ? '✓' : `${DecimalUtils.formatDecimal(waterGivenCount)}/${DecimalUtils.formatDecimal(quest.objectives.waterGiven)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${waterGivenComplete ? '#28a745' : deptColors.light};height:100%;width:${waterGivenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.prismaGiven) {
                const prismaGivenCount = DecimalUtils.isDecimal(progress.prismaGiven) ? progress.prismaGiven : DecimalUtils.toDecimal(progress.prismaGiven || 0);
                const prismaGivenComplete = prismaGivenCount.gte(quest.objectives.prismaGiven);
                const prismaGivenPercent = prismaGivenComplete ? 100 : Math.min(100, prismaGivenCount.div(quest.objectives.prismaGiven).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Give Prisma to Workers</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${prismaGivenComplete ? '✓' : `${DecimalUtils.formatDecimal(prismaGivenCount)}/${DecimalUtils.formatDecimal(quest.objectives.prismaGiven)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${prismaGivenComplete ? '#28a745' : deptColors.light};height:100%;width:${prismaGivenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              // Lepre Quest 4 specific objectives
              if (quest.objectives.tokensCollected) {
                const tokensCollectedCount = DecimalUtils.isDecimal(progress.tokensCollected) ? progress.tokensCollected : DecimalUtils.toDecimal(progress.tokensCollected || 0);
                const tokensCollectedComplete = tokensCollectedCount.gte(quest.objectives.tokensCollected);
                const tokensCollectedPercent = tokensCollectedComplete ? 100 : Math.min(100, tokensCollectedCount.div(quest.objectives.tokensCollected).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Tokens from Departments</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${tokensCollectedComplete ? '✓' : `${DecimalUtils.formatDecimal(tokensCollectedCount)}/${DecimalUtils.formatDecimal(quest.objectives.tokensCollected)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${tokensCollectedComplete ? '#28a745' : deptColors.light};height:100%;width:${tokensCollectedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.batteriesCrafted) {
                const batteriesCraftedCount = DecimalUtils.isDecimal(progress.batteriesCrafted) ? progress.batteriesCrafted : DecimalUtils.toDecimal(progress.batteriesCrafted || 0);
                const batteriesCraftedComplete = batteriesCraftedCount.gte(quest.objectives.batteriesCrafted);
                const batteriesCraftedPercent = batteriesCraftedComplete ? 100 : Math.min(100, batteriesCraftedCount.div(quest.objectives.batteriesCrafted).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Craft Batteries in Kitchen</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${batteriesCraftedComplete ? '✓' : `${DecimalUtils.formatDecimal(batteriesCraftedCount)}/${DecimalUtils.formatDecimal(quest.objectives.batteriesCrafted)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${batteriesCraftedComplete ? '#28a745' : deptColors.light};height:100%;width:${batteriesCraftedPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.tokensGiven) {
                const tokensGivenCount = DecimalUtils.isDecimal(progress.tokensGiven) ? progress.tokensGiven : DecimalUtils.toDecimal(progress.tokensGiven || 0);
                const tokensGivenComplete = tokensGivenCount.gte(quest.objectives.tokensGiven);
                const tokensGivenPercent = tokensGivenComplete ? 100 : Math.min(100, tokensGivenCount.div(quest.objectives.tokensGiven).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Give Tokens to Characters</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${tokensGivenComplete ? '✓' : `${DecimalUtils.formatDecimal(tokensGivenCount)}/${DecimalUtils.formatDecimal(quest.objectives.tokensGiven)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${tokensGivenComplete ? '#28a745' : deptColors.light};height:100%;width:${tokensGivenPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              // Lepre Quest 5 specific objectives

              if (quest.objectives.freeSwaCollected) {
                const freeSwaCount = DecimalUtils.isDecimal(progress.freeSwaCollected) ? progress.freeSwaCollected : DecimalUtils.toDecimal(progress.freeSwaCollected || 0);
                const freeSwaComplete = freeSwaCount.gte(quest.objectives.freeSwaCollected);
                const freeSwaPercent = freeSwaComplete ? 100 : Math.min(100, freeSwaCount.div(quest.objectives.freeSwaCollected).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Collect Free Swa Bucks</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${freeSwaComplete ? '✓' : `${DecimalUtils.formatDecimal(freeSwaCount)}/${DecimalUtils.formatDecimal(quest.objectives.freeSwaCollected)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${freeSwaComplete ? '#28a745' : deptColors.light};height:100%;width:${freeSwaPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
                    </div>
                  </div>
                `);
              }

              if (quest.objectives.powerChallengeRecord) {
                const currentRecord = DecimalUtils.isDecimal(progress.powerChallengeRecord) ? progress.powerChallengeRecord : DecimalUtils.toDecimal(progress.powerChallengeRecord || 0);
                const recordComplete = currentRecord.gte(quest.objectives.powerChallengeRecord);
                const recordPercent = recordComplete ? 100 : Math.min(100, currentRecord.div(quest.objectives.powerChallengeRecord).mul(100).toNumber());
                
                progressItems.push(`
                  <div style="margin-bottom:0.5em;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.2em;">
                      <span style="font-size:0.85em;color:${deptColors.text};">Power Generator Challenge Survival (seconds)</span>
                      <span style="font-size:0.75em;color:${deptColors.text};opacity:0.9;">${recordComplete ? '✓' : `${DecimalUtils.formatDecimal(currentRecord)}/${DecimalUtils.formatDecimal(quest.objectives.powerChallengeRecord)}`}</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.2);border-radius:6px;height:6px;overflow:hidden;">
                      <div style="background:${recordComplete ? '#28a745' : deptColors.light};height:100%;width:${recordPercent}%;transition:width 0.3s ease;border-radius:6px;"></div>
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
              
              // Lepre Quest specific objectives
              if (quest.objectives.tokensPurchased) {
                const tokensPurchasedCount = DecimalUtils.isDecimal(progress.tokensPurchased) ? progress.tokensPurchased : new Decimal(progress.tokensPurchased || 0);
                if (!tokensPurchasedCount.gte(quest.objectives.tokensPurchased)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.berryTokensPurchased) {
                const berryTokensPurchasedCount = DecimalUtils.isDecimal(progress.berryTokensPurchased) ? progress.berryTokensPurchased : new Decimal(progress.berryTokensPurchased || 0);
                if (!berryTokensPurchasedCount.gte(quest.objectives.berryTokensPurchased)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.freeBucksClaimed) {
                const freeBucksClaimedCount = DecimalUtils.isDecimal(progress.freeBucksClaimed) ? progress.freeBucksClaimed : new Decimal(progress.freeBucksClaimed || 0);
                if (!freeBucksClaimedCount.gte(quest.objectives.freeBucksClaimed)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.fluffCollected) {
                const fluffCollectedCount = progress.fluffCollected || new Decimal(0);
                if (!DecimalUtils.isDecimal(fluffCollectedCount) || !fluffCollectedCount.gte(quest.objectives.fluffCollected)) {
                  allObjectivesMet = false;
                }
              }
              
              // Lepre Quest 3 token giving objectives
              if (quest.objectives.berriesGiven) {
                const berriesGivenCount = DecimalUtils.isDecimal(progress.berriesGiven) ? progress.berriesGiven : DecimalUtils.toDecimal(progress.berriesGiven || 0);
                if (!berriesGivenCount.gte(quest.objectives.berriesGiven)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.petalsGiven) {
                const petalsGivenCount = DecimalUtils.isDecimal(progress.petalsGiven) ? progress.petalsGiven : DecimalUtils.toDecimal(progress.petalsGiven || 0);
                if (!petalsGivenCount.gte(quest.objectives.petalsGiven)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.waterGiven) {
                const waterGivenCount = DecimalUtils.isDecimal(progress.waterGiven) ? progress.waterGiven : DecimalUtils.toDecimal(progress.waterGiven || 0);
                if (!waterGivenCount.gte(quest.objectives.waterGiven)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.prismaGiven) {
                const prismaGivenCount = DecimalUtils.isDecimal(progress.prismaGiven) ? progress.prismaGiven : DecimalUtils.toDecimal(progress.prismaGiven || 0);
                if (!prismaGivenCount.gte(quest.objectives.prismaGiven)) {
                  allObjectivesMet = false;
                }
              }
              
              // Lepre Quest 4 specific objectives
              if (quest.objectives.tokensCollected) {
                const tokensCollectedCount = DecimalUtils.isDecimal(progress.tokensCollected) ? progress.tokensCollected : DecimalUtils.toDecimal(progress.tokensCollected || 0);
                if (!tokensCollectedCount.gte(quest.objectives.tokensCollected)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.batteriesCrafted) {
                const batteriesCraftedCount = DecimalUtils.isDecimal(progress.batteriesCrafted) ? progress.batteriesCrafted : DecimalUtils.toDecimal(progress.batteriesCrafted || 0);
                if (!batteriesCraftedCount.gte(quest.objectives.batteriesCrafted)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.tokensGiven) {
                const tokensGivenCount = DecimalUtils.isDecimal(progress.tokensGiven) ? progress.tokensGiven : DecimalUtils.toDecimal(progress.tokensGiven || 0);
                if (!tokensGivenCount.gte(quest.objectives.tokensGiven)) {
                  allObjectivesMet = false;
                }
              }
              
              // Lepre Quest 5 specific objectives
              if (quest.objectives.premiumTokensPurchased) {
                const premiumTokensCount = DecimalUtils.isDecimal(progress.premiumTokensPurchased) ? progress.premiumTokensPurchased : DecimalUtils.toDecimal(progress.premiumTokensPurchased || 0);
                if (!premiumTokensCount.gte(quest.objectives.premiumTokensPurchased)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.freeSwaCollected) {
                const freeSwaCount = DecimalUtils.isDecimal(progress.freeSwaCollected) ? progress.freeSwaCollected : DecimalUtils.toDecimal(progress.freeSwaCollected || 0);
                if (!freeSwaCount.gte(quest.objectives.freeSwaCollected)) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.powerChallengeRecord) {
                const recordCount = DecimalUtils.isDecimal(progress.powerChallengeRecord) ? progress.powerChallengeRecord : DecimalUtils.toDecimal(progress.powerChallengeRecord || 0);
                if (!recordCount.gte(quest.objectives.powerChallengeRecord)) {
                  allObjectivesMet = false;
                }
              }
              
              // Mystic quest specific objectives
              if (quest.objectives.cookBatteries) {
                const cookBatteries = progress.cookBatteries || 0;
                if (cookBatteries < quest.objectives.cookBatteries) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.sparksTokens) {
                const sparksTokens = progress.sparksTokens || 0;
                if (sparksTokens < quest.objectives.sparksTokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.generatorTokensFromBoxes) {
                const generatorTokensFromBoxes = progress.generatorTokensFromBoxes || 0;
                if (generatorTokensFromBoxes < quest.objectives.generatorTokensFromBoxes) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.generateBoxes) {
                const generateBoxes = progress.generateBoxes || 0;
                if (generateBoxes < quest.objectives.generateBoxes) {
                  allObjectivesMet = false;
                }
              }
              
              // Mystic Quest 3 specific objectives
              if (quest.objectives.cookChargedPrisma) {
                const cookChargedPrisma = progress.cookChargedPrisma || 0;
                if (cookChargedPrisma < quest.objectives.cookChargedPrisma) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.prismaTokens) {
                const prismaTokens = progress.prismaTokens || 0;
                if (prismaTokens < quest.objectives.prismaTokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.prismClickTokens) {
                const prismClickTokens = progress.prismClickTokens || 0;
                if (prismClickTokens < quest.objectives.prismClickTokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.clickPrismTiles) {
                const clickPrismTiles = progress.clickPrismTiles || 0;
                if (clickPrismTiles < quest.objectives.clickPrismTiles) {
                  allObjectivesMet = false;
                }
              }
              
              // Additional cooking objectives (Quest 4, 6, 7)
              if (quest.objectives.cookBerryPlates) {
                const cookBerryPlates = progress.cookBerryPlates || 0;
                if (cookBerryPlates < quest.objectives.cookBerryPlates) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.cookMushroomSoup) {
                const cookMushroomSoup = progress.cookMushroomSoup || 0;
                if (cookMushroomSoup < quest.objectives.cookMushroomSoup) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.cookGlitteringPetals) {
                const cookGlitteringPetals = progress.cookGlitteringPetals || new Decimal(0);
                const cookingComplete = DecimalUtils.isDecimal(cookGlitteringPetals) ? cookGlitteringPetals.gte(quest.objectives.cookGlitteringPetals) : cookGlitteringPetals >= quest.objectives.cookGlitteringPetals;
                if (!cookingComplete) {
                  allObjectivesMet = false;
                }
              }
              
              // Token collection objectives (Quest 4, 5, 6, 7)
              if (quest.objectives.collectAnyTokens) {
                const collectAnyTokens = progress.collectAnyTokens || 0;
                if (collectAnyTokens < quest.objectives.collectAnyTokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.stardustTokens) {
                const stardustTokens = progress.stardustTokens || 0;
                if (stardustTokens < quest.objectives.stardustTokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.nightTimeTokens) {
                const nightTimeTokens = progress.nightTimeTokens || 0;
                if (nightTimeTokens < quest.objectives.nightTimeTokens) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.petalTokens) {
                const petalTokens = progress.petalTokens || new Decimal(0);
                const petalTokensComplete = DecimalUtils.isDecimal(petalTokens) ? petalTokens.gte(quest.objectives.petalTokens) : petalTokens >= quest.objectives.petalTokens;
                if (!petalTokensComplete) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.terrariumRustlingTokens) {
                const terrariumRustlingTokens = progress.terrariumRustlingTokens || new Decimal(0);
                const rustlingTokensComplete = DecimalUtils.isDecimal(terrariumRustlingTokens) ? terrariumRustlingTokens.gte(quest.objectives.terrariumRustlingTokens) : terrariumRustlingTokens >= quest.objectives.terrariumRustlingTokens;
                if (!rustlingTokensComplete) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.cargoTokensFromBoxes) {
                const cargoTokensFromBoxes = progress.cargoTokensFromBoxes || 0;
                if (cargoTokensFromBoxes < quest.objectives.cargoTokensFromBoxes) {
                  allObjectivesMet = false;
                }
              }
              
              // Night-time specific objectives (Quest 5)
              if (quest.objectives.buyBoxesAtNight) {
                const buyBoxesAtNight = progress.buyBoxesAtNight || 0;
                if (buyBoxesAtNight < quest.objectives.buyBoxesAtNight) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.clickPrismTilesAtNight) {
                const clickPrismTilesAtNight = progress.clickPrismTilesAtNight || 0;
                if (clickPrismTilesAtNight < quest.objectives.clickPrismTilesAtNight) {
                  allObjectivesMet = false;
                }
              }
              
              // Terrarium action objectives (Quest 6, 7)
              if (quest.objectives.waterFlowers) {
                const waterFlowers = progress.waterFlowers || new Decimal(0);
                const waterFlowersComplete = DecimalUtils.isDecimal(waterFlowers) ? waterFlowers.gte(quest.objectives.waterFlowers) : waterFlowers >= quest.objectives.waterFlowers;
                if (!waterFlowersComplete) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.extractPollen) {
                const extractPollen = progress.extractPollen || new Decimal(0);
                const extractPollenComplete = DecimalUtils.isDecimal(extractPollen) ? extractPollen.gte(quest.objectives.extractPollen) : extractPollen >= quest.objectives.extractPollen;
                if (!extractPollenComplete) {
                  allObjectivesMet = false;
                }
              }
              
              if (quest.objectives.clickFlowersTotal) {
                const clickFlowersTotal = progress.clickFlowersTotal || 0;
                if (clickFlowersTotal < quest.objectives.clickFlowersTotal) {
                  allObjectivesMet = false;
                }
              }
              
              // General box objectives (Quest 7)
              if (quest.objectives.buyBoxes) {
                const buyBoxes = progress.buyBoxes || 0;
                if (buyBoxes < quest.objectives.buyBoxes) {
                  allObjectivesMet = false;
                }
              }
              
              // Only set as ready if we have objectives and they're all met
              isReadyToTurnIn = quest.objectives && Object.keys(quest.objectives).length > 0 && allObjectivesMet;
            }
            
            const glowStyle = isReadyToTurnIn ? 'box-shadow:0 0 20px #28a745, 0 2px 8px rgba(0,0,0,0.1);border:2px solid #28a745;' : 'box-shadow:0 2px 8px rgba(0,0,0,0.1);';
            const isPinned = window.state.questSystem.pinnedQuests && window.state.questSystem.pinnedQuests.includes(quest.id);
            const darkenStyle = isPinned ? 'filter:brightness(0.5);' : '';
            
            return `
              <div style="background:${deptColors.background};padding:0.8em;border-radius:8px;margin-right:0.5em;text-align:left;${glowStyle}min-width:280px;max-width:280px;flex-shrink:0;position:relative;">
                <div style="font-weight:bold;color:${deptColors.text};font-size:1em;margin-bottom:0.3em;">${quest.title}${isReadyToTurnIn ? ' ✓' : ''}</div>
                <div style="color:${deptColors.text};opacity:0.9;font-size:0.85em;margin-bottom:0.5em;">${quest.description}</div>
                <div id="quest-scroll-${quest.id}" style="max-height:300px;overflow-y:auto;padding-right:0.3em;margin-right:-0.3em;" onscroll="if(typeof trackUserScrollActivity === 'function') trackUserScrollActivity('${quest.id}')">
                  ${progressBars}
                </div>
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
  
  // Restore scroll positions after DOM update with multiple attempts
  const restoreScrollPositions = (attempts = 0) => {
    // Don't restore if user is currently scrolling
    if (isUserCurrentlyScrolling()) {
      return;
    }
    
    const maxAttempts = 3;
    const now = Date.now();
    
    Object.keys(scrollPositions).forEach(questId => {
      // Skip this quest if user is actively scrolling it
      if (userScrollingData[questId] && now - userScrollingData[questId] < USER_SCROLL_PROTECTION_TIME) {
        return;
      }
      
      const scrollContainer = document.getElementById(`quest-scroll-${questId}`);
      if (scrollContainer && scrollPositions[questId] !== undefined) {
        scrollContainer.scrollTop = scrollPositions[questId];
      }
    });
    
    // Try again if some containers might not be ready, but don't if user is scrolling
    if (attempts < maxAttempts && !isUserCurrentlyScrolling()) {
      requestAnimationFrame(() => restoreScrollPositions(attempts + 1));
    }
  };
  
  requestAnimationFrame(() => restoreScrollPositions());
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

// Initialize power cap bonuses from previously completed Soap quests
function initializeSoapQuestPowerBonuses() {
  if (!window.state?.questSystem?.completedQuests) return;
  
  // Check all completed quests for Soap quests after quest 3
  window.state.questSystem.completedQuests.forEach(questId => {
    const quest = questDefinitions[questId];
    if (quest && quest.character === 'soap' && isSoapQuestAfterThird(questId)) {
      // Check if we've already applied the bonus for this quest
      if (!window.state.power) window.state.power = {};
      if (!window.state.power.questBonuses) window.state.power.questBonuses = {};
      
      // If bonus not already applied, apply it silently (no notification on load)
      if (!window.state.power.questBonuses[questId]) {
        const powerBonus = 10;
        window.state.power.questBonuses[questId] = powerBonus;
        
        // Apply to current power cap
        if (typeof window.state.power.maxPower !== 'undefined') {
          if (DecimalUtils.isDecimal(window.state.power.maxPower)) {
            window.state.power.maxPower = window.state.power.maxPower.add(powerBonus);
          } else {
            window.state.power.maxPower = new Decimal(window.state.power.maxPower || 0).add(powerBonus);
          }
        } else {
          window.state.power.maxPower = new Decimal(powerBonus);
        }
      }
    }
  });
}

// Check if a Soap quest is after the third quest (quest 4+)
function isSoapQuestAfterThird(questId) {
  // Extract quest number from questId (e.g., 'soap_quest_4' -> 4)
  const match = questId.match(/soap_quest_(\d+)/);
  if (match) {
    const questNumber = parseInt(match[1]);
    return questNumber > 3;
  }
  return false;
}

// Give permanent power cap bonus for Soap quests after quest 3
function giveSoapQuestPowerCapBonus(questId) {
  // Initialize power system state if it doesn't exist
  if (!window.state) window.state = {};
  if (!window.state.power) window.state.power = {};
  if (!window.state.power.questBonuses) window.state.power.questBonuses = {};
  
  // Track the power cap bonus from this specific quest
  const powerBonus = 10;
  window.state.power.questBonuses[questId] = powerBonus;
  
  // Apply the bonus to current power cap (use the actual powerMaxEnergy property)
  if (!DecimalUtils.isDecimal(window.state.powerMaxEnergy)) {
    window.state.powerMaxEnergy = new Decimal(window.state.powerMaxEnergy || 100);
  }
  window.state.powerMaxEnergy = window.state.powerMaxEnergy.add(powerBonus);
  
  console.log(`Applied +${powerBonus} power cap bonus from ${questId}. New max power: ${window.state.powerMaxEnergy.toString()}`);
  
  // Show notification for the power cap increase
  if (typeof window.showGenericRewardNotification === 'function') {
    setTimeout(() => {
      window.showGenericRewardNotification(
        'charge',
        '',
        'Power Cap Increased!',
        `+${powerBonus} permanent power capacity from completing ${questDefinitions[questId]?.title || questId}!`
      );
    }, 1800); // Show after other reward notifications
  }
  
  // Update power UI if it exists
  if (typeof window.updatePowerGeneratorUI === 'function') {
    setTimeout(() => {
      window.updatePowerGeneratorUI();
    }, 100);
  }
}

// Get total power cap bonus from completed Soap quests
function getSoapQuestPowerCapBonus() {
  if (!window.state?.power?.questBonuses) return 0;
  
  let totalBonus = 0;
  Object.values(window.state.power.questBonuses).forEach(bonus => {
    if (typeof bonus === 'number') {
      totalBonus += bonus;
    } else if (DecimalUtils.isDecimal(bonus)) {
      totalBonus += bonus.toNumber();
    }
  });
  
  return totalBonus;
}

// Debug function to test power cap bonus system
function debugSoapQuestPowerSystem() {
  console.log('=== Soap Quest Power Cap Bonus System Debug ===');
  console.log('Quest Bonuses:', window.state?.power?.questBonuses);
  console.log('Total Bonus:', getSoapQuestPowerCapBonus());
  console.log('Current Max Power:', window.state?.power?.maxPower);
  console.log('Completed Quests:', window.state?.questSystem?.completedQuests);
  
  // Test with a fake soap quest 4
  const fakeQuestId = 'soap_quest_4';
  console.log(`Testing with ${fakeQuestId}:`);
  console.log('Is after third?', isSoapQuestAfterThird(fakeQuestId));
}

// Force update quest modal (bypasses throttling)
function forceUpdateQuestModal() {
  questModalLastUpdate = 0;
  questModalCache = null;
  updateQuestModal();
}

// Hook function to be called when Lepre's character display updates
function onLepreCharacterDisplayUpdate() {
  // Reapply quest glows after character display changes
  if (window.state && window.state.questSystem) {
    // Check if Lepre has any active quest states and reapply glows
    updateCharacterGlows();
  }
}

// Make functions globally accessible
window.initializeQuestSystem = initializeQuestSystem;
window.updateQuestModal = updateQuestModal;
window.forceUpdateQuestModal = forceUpdateQuestModal;
window.trackUserScrollActivity = trackUserScrollActivity;
window.debugQuestSystem = debugQuestSystem;
window.checkQuestAvailability = checkQuestAvailability;
window.updateCharacterGlows = updateCharacterGlows;
window.addCharacterQuestGlow = addCharacterQuestGlow;
window.onLepreCharacterDisplayUpdate = onLepreCharacterDisplayUpdate;
window.trackTokenCollection = trackTokenCollection;
window.trackPrismClick = trackPrismClick;
window.trackCookingAction = trackCookingAction;
window.trackBoxGeneration = trackBoxGeneration;
window.trackSpecificTokenCollection = trackSpecificTokenCollection;
window.trackBoxPurchase = trackBoxPurchase;
window.trackFlowerWatering = trackFlowerWatering;
window.trackFlowerClick = trackFlowerClick;
window.trackTokensFromSource = trackTokensFromSource;
window.toggleQuestPin = toggleQuestPin;
window.autoStartKitoFoxChallenge = autoStartKitoFoxChallenge;
window.getCommonBoxCount = getCommonBoxCount;
window.getUncommonBoxCount = getUncommonBoxCount;
window.getRareBoxCount = getRareBoxCount;
window.initializeSoapQuestPowerBonuses = initializeSoapQuestPowerBonuses;
window.isSoapQuestAfterThird = isSoapQuestAfterThird;
window.giveSoapQuestPowerCapBonus = giveSoapQuestPowerCapBonus;
window.getSoapQuestPowerCapBonus = getSoapQuestPowerCapBonus;
window.debugSoapQuestPowerSystem = debugSoapQuestPowerSystem;

// Function to retroactively apply missing power cap bonuses
function applyMissingSoapPowerBonuses() {
  console.log('Checking for missing Soap quest power cap bonuses...');
  
  if (!window.state?.questSystem?.completedQuests) {
    console.log('No completed quests found');
    return;
  }
  
  // First, let's check current power state
  console.log('Current powerMaxEnergy:', window.state.powerMaxEnergy?.toString() || 'undefined');
  console.log('Current power bonuses:', window.state.power?.questBonuses || 'none');
  
  let bonusesApplied = 0;
  const completedSoapQuests = window.state.questSystem.completedQuests.filter(questId => 
    questId.startsWith('soap_quest_') && isSoapQuestAfterThird(questId)
  );
  
  console.log('Completed Soap quests (after quest 3):', completedSoapQuests);
  
  // Calculate total bonus that should be applied
  let totalBonusNeeded = completedSoapQuests.length * 10;
  console.log('Total bonus needed:', totalBonusNeeded);
  
  // Check if powerMaxEnergy reflects the correct total
  const basePower = 100; // Base power cap
  const batteriesGiven = (window.state.soapBatteries || 0) * 5; // Battery tokens give +5 each
  const expectedPowerCap = basePower + batteriesGiven + totalBonusNeeded;
  console.log('Expected power cap:', expectedPowerCap, '(base:', basePower, '+ batteries:', batteriesGiven, '+ quest bonuses:', totalBonusNeeded, ')');
  
  // Force apply the correct power cap
  if (!DecimalUtils.isDecimal(window.state.powerMaxEnergy)) {
    window.state.powerMaxEnergy = new Decimal(window.state.powerMaxEnergy || 100);
  }
  
  const currentPowerCap = window.state.powerMaxEnergy.toNumber();
  console.log('Current power cap:', currentPowerCap);
  
  if (currentPowerCap < expectedPowerCap) {
    const difference = expectedPowerCap - currentPowerCap;
    console.log('Applying missing power cap bonus of +' + difference);
    window.state.powerMaxEnergy = window.state.powerMaxEnergy.add(difference);
    
    // Make sure bonuses are tracked
    if (!window.state.power) window.state.power = {};
    if (!window.state.power.questBonuses) window.state.power.questBonuses = {};
    
    completedSoapQuests.forEach(questId => {
      window.state.power.questBonuses[questId] = 10;
    });
    
    bonusesApplied = difference;
  }
  
  if (bonusesApplied > 0) {
    console.log(`Applied ${bonusesApplied} missing power cap bonuses! New power cap: ${window.state.powerMaxEnergy.toString()}`);
    if (typeof window.updatePowerGeneratorUI === 'function') {
      window.updatePowerGeneratorUI();
    }
  } else {
    console.log('Power cap is already correct');
  }
}
window.applyMissingSoapPowerBonuses = applyMissingSoapPowerBonuses;

// Force fix power cap to correct value
function forceFixPowerCap() {
  console.log('Force fixing power cap...');
  console.log('Current power cap:', window.state.powerMaxEnergy?.toString() || 'undefined');
  console.log('All completed quests:', window.state?.questSystem?.completedQuests || []);
  
  const completedSoapQuests = window.state?.questSystem?.completedQuests?.filter(questId => 
    questId.startsWith('soap_quest_')
  ) || [];
  
  console.log('All completed Soap quests:', completedSoapQuests);
  
  // Check which quests should give power bonuses (quest 3 and higher)
  const questsNeedingBonuses = completedSoapQuests.filter(questId => isSoapQuestAfterThird(questId));
  console.log('Quests that should give power bonuses:', questsNeedingBonuses);
  
  // Based on your report, you should have 280 total
  // Current is 270, so you need +10 more
  const targetPowerCap = 280;
  const currentPowerCap = window.state.powerMaxEnergy?.toNumber() || 270;
  const bonusNeeded = targetPowerCap - currentPowerCap;
  
  console.log(`Target power cap: ${targetPowerCap}`);
  console.log(`Current power cap: ${currentPowerCap}`);
  console.log(`Bonus needed: ${bonusNeeded}`);
  
  if (bonusNeeded > 0) {
    // Add the missing bonus to current power cap
    if (!DecimalUtils.isDecimal(window.state.powerMaxEnergy)) {
      window.state.powerMaxEnergy = new Decimal(window.state.powerMaxEnergy || 100);
    }
    
    const oldPowerCap = window.state.powerMaxEnergy.toNumber();
    window.state.powerMaxEnergy = window.state.powerMaxEnergy.add(bonusNeeded);
    const newPowerCap = window.state.powerMaxEnergy.toNumber();
    
    console.log(`Power cap increased from ${oldPowerCap} to ${newPowerCap} (+${bonusNeeded})`);
    
    // Track bonuses properly
    if (!window.state.power) window.state.power = {};
    if (!window.state.power.questBonuses) window.state.power.questBonuses = {};
    questsNeedingBonuses.forEach(questId => {
      window.state.power.questBonuses[questId] = 10;
    });
    
    if (typeof window.updatePowerGeneratorUI === 'function') {
      window.updatePowerGeneratorUI();
    }
    
    console.log('Power cap fix complete!');
  } else {
    console.log('Power cap is already at target value');
  }
}
window.forceFixPowerCap = forceFixPowerCap;

// Mystic quest premium token buff system
function getMysticQuestCompletionCount() {
  if (!window.state?.questSystem?.completedQuests) return 0;
  
  const mysticQuestIds = [
    'mystic_quest_1', 'mystic_quest_2', 'mystic_quest_3', 'mystic_quest_4', 
    'mystic_quest_5', 'mystic_quest_6', 'mystic_quest_7'
  ];
  
  let completedCount = 0;
  mysticQuestIds.forEach(questId => {
    if (window.state.questSystem.completedQuests.includes(questId)) {
      completedCount++;
    }
  });
  
  // Add infinite quest completions (stored separately)
  if (window.state.questSystem.mysticInfiniteQuestCompletions) {
    completedCount += window.state.questSystem.mysticInfiniteQuestCompletions;
  }
  
  return completedCount;
}

function getMysticPremiumTokenBuffMultiplier() {
  const completedCount = getMysticQuestCompletionCount();
  // Each completed quest gives +5% duration (x1.05 multiplier)
  return 1 + (completedCount * 0.05);
}

function getMysticBuffDisplayText() {
  const completedCount = getMysticQuestCompletionCount();
  const buffPercent = completedCount * 5; // 5% per quest
  
  if (completedCount === 0) {
    return "No premium token duration bonus yet.";
  }
  
  return `Premium token duration: +${buffPercent}% (${completedCount} quests completed)`;
}

// Apply Mystic's premium token buff to duration calculations
function applyMysticPremiumTokenBuff(baseDuration) {
  const multiplier = getMysticPremiumTokenBuffMultiplier();
  return Math.floor(baseDuration * multiplier);
}

// Export Mystic buff functions
window.getMysticQuestCompletionCount = getMysticQuestCompletionCount;
window.getMysticPremiumTokenBuffMultiplier = getMysticPremiumTokenBuffMultiplier;
window.getMysticBuffDisplayText = getMysticBuffDisplayText;
window.applyMysticPremiumTokenBuff = applyMysticPremiumTokenBuff;

// Character Card Display System
function createCharacterCardDisplay() {
  // Find the Mystic character image element
  const mysticCharacter = document.getElementById('mysticCharacter');
  if (!mysticCharacter) {
    console.warn('Mystic character image not found');
    return;
  }
  
  // Use the parent container of the Mystic character for positioning
  const characterCard = mysticCharacter.parentElement;
  if (!characterCard) {
    console.warn('Mystic character parent container not found');
    return;
  }
  
  // Check if display already exists
  let existingDisplay = characterCard.querySelector('#mysticBuffDisplay');
  if (!existingDisplay) {
    // Create the buff display element
    existingDisplay = document.createElement('div');
    existingDisplay.id = 'mysticBuffDisplay';
    existingDisplay.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: transparent;
      color: #000000;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 0.8em;
      font-weight: bold;
      text-align: center;
      text-shadow: 
        -1px -1px 0 #ffffff,
        1px -1px 0 #ffffff,
        -1px 1px 0 #ffffff,
        1px 1px 0 #ffffff,
        0px -1px 0 #ffffff,
        0px 1px 0 #ffffff,
        -1px 0px 0 #ffffff,
        1px 0px 0 #ffffff;
      max-width: 200px;
      z-index: 100;
      pointer-events: none;
    `;
    characterCard.appendChild(existingDisplay);
  }
  
  // Update the display text
  const buffText = getMysticBuffDisplayText();
  existingDisplay.textContent = buffText;
  
  // Hide if no buff
  const completedCount = getMysticQuestCompletionCount();
  if (completedCount === 0) {
    existingDisplay.style.display = 'none';
  } else {
    existingDisplay.style.display = 'block';
  }
}

// Update character card display when Kitchen tab is opened
function updateCharacterCardDisplay() {
  // Only update if Kitchen tab is visible
  const kitchenSubTab = document.getElementById('kitchenSubTab');
  if (kitchenSubTab && kitchenSubTab.style.display !== 'none') {
    createCharacterCardDisplay();
  }
}

// Hook into kitchen UI updates
function initializeCharacterCardSystem() {
  // Create initial display
  createCharacterCardDisplay();
  
  // Update when switching to Kitchen tab
  const originalSwitchHomeSubTab = window.switchHomeSubTab;
  if (originalSwitchHomeSubTab) {
    window.switchHomeSubTab = function(subTabId) {
      const result = originalSwitchHomeSubTab.call(this, subTabId);
      if (subTabId === 'kitchenSubTab') {
        setTimeout(updateCharacterCardDisplay, 100);
      }
      return result;
    };
  }
  
  // Update when quests are completed
  const originalCompleteQuestTurnIn = window.completeQuestTurnIn;
  if (originalCompleteQuestTurnIn && typeof originalCompleteQuestTurnIn === 'function') {
    window.completeQuestTurnIn = function(questId) {
      const result = originalCompleteQuestTurnIn.call(this, questId);
      // If it's a Mystic quest, update displays
      if (questId && questId.startsWith('mystic_quest_')) {
        setTimeout(createCharacterCardDisplay, 100);
        setTimeout(createCharacterCardDisplay, 500); // Extra delay to ensure it appears
        // Update kitchen buff display to show the premium token duration boost
        setTimeout(() => {
          if (typeof window.updateCookingSpeedBoostDisplay === 'function') {
            window.updateCookingSpeedBoostDisplay();
          }
        }, 100);
        setTimeout(() => {
          if (typeof window.updateCookingSpeedBoostDisplay === 'function') {
            window.updateCookingSpeedBoostDisplay();
          }
        }, 500);
      }
      setTimeout(updateCharacterCardDisplay, 100);
      return result;
    };
  }
}

// Export character card functions
window.createCharacterCardDisplay = createCharacterCardDisplay;
window.updateCharacterCardDisplay = updateCharacterCardDisplay;
window.initializeCharacterCardSystem = initializeCharacterCardSystem;

// Initialize Mystic buff display in kitchen when page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (typeof window.updateCookingSpeedBoostDisplay === 'function') {
      window.updateCookingSpeedBoostDisplay();
    }
  }, 1000);
  
  // Also update when switching to kitchen tab
  setTimeout(() => {
    const originalSwitchHomeSubTab = window.switchHomeSubTab;
    if (originalSwitchHomeSubTab) {
      const newSwitchHomeSubTab = function(subTabId) {
        const result = originalSwitchHomeSubTab.call(this, subTabId);
        if (subTabId === 'kitchenSubTab') {
          setTimeout(() => {
            if (typeof window.updateCookingSpeedBoostDisplay === 'function') {
              window.updateCookingSpeedBoostDisplay();
            }
          }, 100);
        }
        return result;
      };
      
      // Only override if we haven't already
      if (window.switchHomeSubTab.toString() === originalSwitchHomeSubTab.toString()) {
        window.switchHomeSubTab = newSwitchHomeSubTab;
      }
    }
  }, 1500);
});

// Manual function to show Mystic buff display
window.showMysticBuffDisplay = function() {
  console.log('Manually showing Mystic buff display');
  createCharacterCardDisplay();
};

// Infinite Quest System for Mystic
function getInfiniteQuestObjectives(baseQuestId, timesCompleted = 0) {
  const baseQuest = questDefinitions[baseQuestId];
  if (!baseQuest || !baseQuest.objectives) return {};
  
  const scalingFactor = Math.pow(1.1, timesCompleted);
  const scaledObjectives = {};
  
  for (const [key, value] of Object.entries(baseQuest.objectives)) {
    if (typeof value === 'number') {
      scaledObjectives[key] = Math.ceil(value * scalingFactor);
    } else if (DecimalUtils && DecimalUtils.isDecimal(value)) {
      scaledObjectives[key] = value.mul(scalingFactor).ceil();
    } else {
      scaledObjectives[key] = value; // Keep as-is if not a number
    }
  }
  
  return scaledObjectives;
}

function getInfiniteQuestRewards(baseQuestId, timesCompleted = 0) {
  const baseQuest = questDefinitions[baseQuestId];
  if (!baseQuest || !baseQuest.rewards) return {};
  
  const scalingFactor = Math.pow(1.1, timesCompleted);
  const scaledRewards = {};
  
  for (const [key, value] of Object.entries(baseQuest.rewards)) {
    if (typeof value === 'number') {
      scaledRewards[key] = Math.ceil(value * scalingFactor);
    } else if (DecimalUtils && DecimalUtils.isDecimal(value)) {
      scaledRewards[key] = value.mul(scalingFactor).ceil();
    } else {
      scaledRewards[key] = value; // Keep as-is if not a number
    }
  }
  
  return scaledRewards;
}

function generateInfiniteQuest() {
  // Initialize infinite quest tracking if it doesn't exist
  if (!window.state.questSystem.infiniteQuestData) {
    window.state.questSystem.infiniteQuestData = {
      questCompletionCounts: {}, // Track how many times each base quest has been completed
      totalInfiniteQuestsCompleted: 0, // Track total infinite quests completed for quest numbering
      isInfiniteMode: false
    };
  }
  
  // Check if we've completed mystic_quest_7 to unlock infinite mode
  if (!window.state.questSystem.completedQuests.includes('mystic_quest_7')) {
    return null; // Infinite mode not unlocked yet
  }
  
  // Mark infinite mode as unlocked
  window.state.questSystem.infiniteQuestData.isInfiniteMode = true;
  
  // Select quest: 3% chance for ultimate quest (quest 7), 97% for quests 1-6
  let selectedBaseQuestId;
  if (Math.random() < 0.03) {
    selectedBaseQuestId = 'mystic_quest_7';
  } else {
    const regularQuests = ['mystic_quest_1', 'mystic_quest_2', 'mystic_quest_3', 'mystic_quest_4', 'mystic_quest_5', 'mystic_quest_6'];
    selectedBaseQuestId = regularQuests[Math.floor(Math.random() * regularQuests.length)];
  }
  
  // Get completion count for this base quest
  const timesCompleted = window.state.questSystem.infiniteQuestData.questCompletionCounts[selectedBaseQuestId] || 0;
  
  // Calculate the quest number (8 + total infinite quests completed)
  const questNumber = 8 + window.state.questSystem.infiniteQuestData.totalInfiniteQuestsCompleted;
  
  // Generate scaled quest
  const baseQuest = questDefinitions[selectedBaseQuestId];
  const infiniteQuestId = `infinite_${selectedBaseQuestId}_${Date.now()}`;
  
  // Extract the quest name part after the colon (e.g., "Cargo Mastery" from "Mystic's Quest 1: Cargo Mastery")
  const baseQuestName = baseQuest.title.includes(': ') ? baseQuest.title.split(': ')[1] : baseQuest.title;
  
  const infiniteQuest = {
    id: infiniteQuestId,
    character: baseQuest.character,
    department: baseQuest.department,
    title: `Mystic Quest ${questNumber}: ${baseQuestName}`,
    description: `${baseQuest.description} - Just a lil bit harder.`,
    requirements: {
      infiniteMode: true // Special requirement for infinite quests
    },
    objectives: getInfiniteQuestObjectives(selectedBaseQuestId, timesCompleted),
    rewards: getInfiniteQuestRewards(selectedBaseQuestId, timesCompleted),
    dialogue: [
      {
        speaker: 'mystic',
        text: "Ready for another challenge? I'm raising the stakes this time."
      },
      {
        speaker: 'swaria',
        text: "More challenges?! Swawesome! I'll show you my improved token collecting and cooking skills!"
      },
      {
        speaker: 'mystic',
        text: "Good. Standards increase with experience. Don't disappoint me."
      }
    ],
    turnInDialogue: [
      {
        speaker: 'swaria',
        text: "Mystic! I completed your task! It was harder but I did it!"
      },
      {
        speaker: 'mystic',
        text: "Acceptable. Your skills are improving. Keep pushing your limits, there's always room for more perfection, come back anytime for another task."
      }
    ],
    status: 'available',
    isInfinite: true,
    baseQuestId: selectedBaseQuestId,
    scalingLevel: timesCompleted + 1
  };
  
  return infiniteQuest;
}

function handleInfiniteQuestCompletion(questId) {
  const quest = questDefinitions[questId];
  if (!quest || !quest.isInfinite) return;
  
  // Track completion of the base quest
  const baseQuestId = quest.baseQuestId;
  if (!window.state.questSystem.infiniteQuestData.questCompletionCounts[baseQuestId]) {
    window.state.questSystem.infiniteQuestData.questCompletionCounts[baseQuestId] = 0;
  }
  window.state.questSystem.infiniteQuestData.questCompletionCounts[baseQuestId]++;
  
  // Increment total infinite quests completed for quest numbering
  if (!window.state.questSystem.infiniteQuestData.totalInfiniteQuestsCompleted) {
    window.state.questSystem.infiniteQuestData.totalInfiniteQuestsCompleted = 0;
  }
  window.state.questSystem.infiniteQuestData.totalInfiniteQuestsCompleted++;
  
  // Generate and offer next infinite quest
  setTimeout(() => {
    const nextInfiniteQuest = generateInfiniteQuest();
    if (nextInfiniteQuest) {
      questDefinitions[nextInfiniteQuest.id] = nextInfiniteQuest;
      window.state.questSystem.availableQuests.push(nextInfiniteQuest.id);
      
      // Show notification about new infinite quest
      if (typeof showNotification === 'function') {
        showNotification('New infinite quest available from Mystic!', 'info');
      }
    }
  }, 1000);
}

// Check if infinite mode should start (when mystic_quest_7 is completed)
function checkInfiniteModeUnlock() {
  if (!window.state.questSystem.infiniteQuestData) {
    window.state.questSystem.infiniteQuestData = {
      questCompletionCounts: {},
      totalInfiniteQuestsCompleted: 0,
      isInfiniteMode: false
    };
  }
  
  if (window.state.questSystem.completedQuests.includes('mystic_quest_7') && 
      !window.state.questSystem.infiniteQuestData.isInfiniteMode) {
    
    // Generate first infinite quest
    const firstInfiniteQuest = generateInfiniteQuest();
    if (firstInfiniteQuest) {
      questDefinitions[firstInfiniteQuest.id] = firstInfiniteQuest;
      window.state.questSystem.availableQuests.push(firstInfiniteQuest.id);
      
      if (typeof showNotification === 'function') {
        showNotification('Infinite quest mode unlocked! Mystic has endless challenges for you.', 'success');
      }
    }
  }
}

// Export quest functions
window.completeQuestTurnIn = completeQuestTurnIn;
window.generateInfiniteQuest = generateInfiniteQuest;
window.handleInfiniteQuestCompletion = handleInfiniteQuestCompletion;
window.checkInfiniteModeUnlock = checkInfiniteModeUnlock;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeQuestSystem();
    initializeCharacterCardSystem();
    // Check for infinite mode unlock on load
    setTimeout(checkInfiniteModeUnlock, 500);
  });
} else {
  initializeQuestSystem();
  initializeCharacterCardSystem();
  // Check for infinite mode unlock on load
  setTimeout(checkInfiniteModeUnlock, 500);
}

// Make Lepre quest tracking functions globally accessible
window.trackLepreShopPurchase = trackLepreShopPurchase;
window.trackLepreFreeBucksClaim = trackLepreFreeBucksClaim;
window.trackTokenGivenToWorker = trackTokenGivenToWorker;
window.trackTokenCollection = trackTokenCollection;
window.trackBatteryCrafted = trackBatteryCrafted;
window.trackTotalTokensGiven = trackTotalTokensGiven;
window.trackPremiumTokenPurchase = trackPremiumTokenPurchase;
window.trackFreeSwaCollection = trackFreeSwaCollection;
window.trackPowerChallengeRecord = trackPowerChallengeRecord;

// Export Lepre-specific glow functions for debugging
window.addLepreQuestGlow = addLepreQuestGlow;
window.removeLepreQuestGlow = removeLepreQuestGlow;
window.getAllLepreCharacterElements = getAllLepreCharacterElements;
window.getCurrentlyVisibleLepreElement = getCurrentlyVisibleLepreElement;
