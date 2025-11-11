// Fluff Inc. Game API System
// Provides external access to game state and functionality

// Core Game API Object
window.FluffAPI = {
  version: '1.0.0',
  
  // Resource Management
  resources: {
    get: function(resourceName) {
      if (!window.state || !window.state.hasOwnProperty(resourceName)) return null;
      const resource = window.state[resourceName];
      return DecimalUtils.isDecimal(resource) ? resource.toString() : resource;
    },
    
    set: function(resourceName, value) {
      if (!window.state || !window.state.hasOwnProperty(resourceName)) return false;
      window.state[resourceName] = DecimalUtils.toDecimal(value);
      if (typeof updateUI === 'function') updateUI();
      window.FluffAPI.events.emit('resourceChanged', { resource: resourceName, value: value });
      return true;
    },
    
    add: function(resourceName, amount) {
      if (!window.state || !window.state.hasOwnProperty(resourceName)) return null;
      const current = DecimalUtils.toDecimal(window.state[resourceName] || 0);
      window.state[resourceName] = current.add(DecimalUtils.toDecimal(amount));
      if (typeof updateUI === 'function') updateUI();
      window.FluffAPI.events.emit('resourceChanged', { resource: resourceName, value: window.state[resourceName].toString() });
      return window.state[resourceName].toString();
    },
    
    subtract: function(resourceName, amount) {
      if (!window.state || !window.state.hasOwnProperty(resourceName)) return null;
      const current = DecimalUtils.toDecimal(window.state[resourceName] || 0);
      const newValue = current.sub(DecimalUtils.toDecimal(amount));
      window.state[resourceName] = newValue.max(0); // Don't go below 0
      if (typeof updateUI === 'function') updateUI();
      window.FluffAPI.events.emit('resourceChanged', { resource: resourceName, value: window.state[resourceName].toString() });
      return window.state[resourceName].toString();
    },
    
    getAll: function() {
      if (!window.state) return {};
      const resources = {};
      ['fluff', 'swaria', 'feathers', 'artifacts', 'stardust', 'prisms', 'berries', 'mushrooms', 'batteries', 'swabucks', 'kp'].forEach(key => {
        if (window.state.hasOwnProperty(key)) {
          const value = window.state[key];
          resources[key] = DecimalUtils.isDecimal(value) ? value.toString() : value;
        }
      });
      return resources;
    },
    
    // Additional resource getters
    getFluff: function() { return this.get('fluff') || '0'; },
    getSwaria: function() { return this.get('swaria') || '0'; },
    getFeathers: function() { return this.get('feathers') || '0'; },
    getArtifacts: function() { return this.get('artifacts') || '0'; },
    getStardust: function() { return this.get('stardust') || '0'; },
    getPrisms: function() { return this.get('prisms') || '0'; },
    getBerries: function() { return this.get('berries') || '0'; },
    getMushrooms: function() { return this.get('mushrooms') || '0'; },
    getBatteries: function() { return this.get('batteries') || '0'; },
    getSwaBucks: function() { return this.get('swabucks') || '0'; },
    getKnowledgePoints: function() { return this.get('kp') || '0'; }
  },

  // Generator Management
  generators: {
    get: function() {
      return window.state && window.state.generators || [];
    },
    
    getByType: function(type) {
      const generators = window.state && window.state.generators || [];
      return generators.filter(gen => gen.type === type);
    },
    
    upgrade: function(generatorIndex, upgradeType) {
      if (typeof upgradeGenerator === 'function') {
        const result = upgradeGenerator(generatorIndex, upgradeType);
        window.FluffAPI.events.emit('generatorUpgraded', { index: generatorIndex, type: upgradeType });
        return result;
      }
      return false;
    },
    
    getStats: function() {
      const generators = window.state && window.state.generators || [];
      return generators.map((gen, index) => ({
        index: index,
        type: gen.type,
        upgrades: gen.upgrades || 0,
        multiplier: DecimalUtils.isDecimal(gen.multiplier) ? gen.multiplier.toString() : (gen.multiplier || 1),
        cost: DecimalUtils.isDecimal(gen.cost) ? gen.cost.toString() : (gen.cost || 0),
        lastGenerated: gen.lastGenerated || 0
      }));
    },
    
    // Light Generators
    getLightGenerators: function() {
      return window.state && window.state.lightGenerators || [];
    },
    
    getLightStats: function() {
      const lightGens = window.state && window.state.lightGenerators || [];
      return lightGens.map((gen, index) => ({
        index: index,
        type: gen.type,
        upgrades: gen.upgrades || 0,
        multiplier: DecimalUtils.isDecimal(gen.multiplier) ? gen.multiplier.toString() : (gen.multiplier || 1)
      }));
    }
  },

  // Friendship System
  friendship: {
    get: function(characterName) {
      if (!window.state || !window.state.friendship) return null;
      const friendship = window.state.friendship[characterName];
      if (!friendship) return null;
      
      return {
        level: friendship.level || 0,
        points: DecimalUtils.isDecimal(friendship.points) ? friendship.points.toString() : (friendship.points || 0),
        department: friendship.department || 'Unknown',
        maxPoints: friendship.maxPoints || 100
      };
    },
    
    getAll: function() {
      if (!window.state || !window.state.friendship) return {};
      const friendships = {};
      Object.keys(window.state.friendship).forEach(char => {
        friendships[char] = this.get(char);
      });
      return friendships;
    },
    
    setLevel: function(characterName, level) {
      if (!window.state || !window.state.friendship || !window.state.friendship[characterName]) return false;
      const clampedLevel = Math.max(0, Math.min(level, 20));
      window.state.friendship[characterName].level = clampedLevel;
      window.FluffAPI.events.emit('friendshipChanged', { character: characterName, level: clampedLevel });
      return true;
    },
    
    addPoints: function(characterName, points) {
      if (!window.state || !window.state.friendship || !window.state.friendship[characterName]) return false;
      const friendship = window.state.friendship[characterName];
      const currentPoints = DecimalUtils.toDecimal(friendship.points || 0);
      friendship.points = currentPoints.add(DecimalUtils.toDecimal(points));
      window.FluffAPI.events.emit('friendshipChanged', { character: characterName, points: friendship.points.toString() });
      return true;
    }
  },

  // Quest System
  quests: {
    getActive: function() {
      return window.state && window.state.questSystem && window.state.questSystem.activeQuests || [];
    },
    
    getCompleted: function() {
      return window.state && window.state.questSystem && window.state.questSystem.completedQuests || [];
    },
    
    getClaimable: function() {
      return window.state && window.state.questSystem && window.state.questSystem.claimableQuests || [];
    },
    
    getProgress: function(questId) {
      if (!window.state || !window.state.questSystem || !window.state.questSystem.questProgress) return null;
      
      const progress = window.state.questSystem.questProgress[questId];
      if (!progress) return null;
      
      const formattedProgress = {};
      Object.keys(progress).forEach(key => {
        const value = progress[key];
        formattedProgress[key] = DecimalUtils.isDecimal(value) ? value.toString() : value;
      });
      return formattedProgress;
    },
    
    complete: function(questId) {
      if (typeof completeQuest === 'function') {
        const result = completeQuest(questId);
        window.FluffAPI.events.emit('questCompleted', { questId: questId });
        return result;
      }
      return false;
    },
    
    getAvailable: function(characterName) {
      if (typeof getCharacterQuests === 'function') {
        return getCharacterQuests(characterName);
      }
      return [];
    },
    
    // Force complete quest objectives (for debugging)
    setProgress: function(questId, objective, value) {
      if (!window.state || !window.state.questSystem) return false;
      if (!window.state.questSystem.questProgress) {
        window.state.questSystem.questProgress = {};
      }
      if (!window.state.questSystem.questProgress[questId]) {
        window.state.questSystem.questProgress[questId] = {};
      }
      
      window.state.questSystem.questProgress[questId][objective] = DecimalUtils.toDecimal(value);
      if (typeof window.forceUpdateQuestModal === 'function') {
        window.forceUpdateQuestModal();
      }
      return true;
    }
  },

  // Inventory System
  inventory: {
    get: function() {
      return window.state && window.state.inventory || {};
    },
    
    getItem: function(itemName) {
      if (!window.state || !window.state.inventory) return 0;
      const item = window.state.inventory[itemName];
      return DecimalUtils.isDecimal(item) ? item.toString() : (item || 0);
    },
    
    addItem: function(itemName, amount) {
      if (!window.state) return false;
      if (!window.state.inventory) window.state.inventory = {};
      
      const current = DecimalUtils.toDecimal(window.state.inventory[itemName] || 0);
      window.state.inventory[itemName] = current.add(DecimalUtils.toDecimal(amount));
      window.FluffAPI.events.emit('inventoryChanged', { item: itemName, amount: amount });
      return true;
    },
    
    removeItem: function(itemName, amount) {
      if (!window.state || !window.state.inventory) return false;
      
      const current = DecimalUtils.toDecimal(window.state.inventory[itemName] || 0);
      const newAmount = current.sub(DecimalUtils.toDecimal(amount));
      window.state.inventory[itemName] = newAmount.max(0);
      window.FluffAPI.events.emit('inventoryChanged', { item: itemName, amount: -amount });
      return true;
    }
  },

  // Prism System
  prism: {
    getPrisms: function() {
      if (window.state && window.state.prismLab) {
        return {
          tiles: window.state.prismLab.tiles || [],
          energy: window.state.prismLab.energy || 0,
          upgrades: window.state.prismLab.upgrades || {}
        };
      }
      return { tiles: [], energy: 0, upgrades: {} };
    },
    
    clickTile: function(tileIndex) {
      if (typeof clickPrismTile === 'function') {
        const result = clickPrismTile(tileIndex);
        window.FluffAPI.events.emit('prismTileClicked', { tileIndex: tileIndex });
        return result;
      }
      return false;
    },
    
    clickAllTiles: function() {
      const prisms = this.getPrisms();
      let clicked = 0;
      prisms.tiles.forEach((tile, index) => {
        if (this.clickTile(index)) {
          clicked++;
        }
      });
      return { total: prisms.tiles.length, clicked: clicked };
    },
    
    getPrismTokens: function() {
      if (window.state && window.state.inventory && window.state.inventory.prismClickTokens) {
        const tokens = window.state.inventory.prismClickTokens;
        return DecimalUtils.isDecimal(tokens) ? tokens.toString() : tokens;
      }
      return '0';
    },
    
    getAdvancedPrismStatus: function() {
      if (window.state && window.state.advancedPrism) {
        return {
          unlocked: window.state.advancedPrism.unlocked || false,
          level: window.state.advancedPrism.level || 0,
          energy: window.state.advancedPrism.energy || 0
        };
      }
      return { unlocked: false, level: 0, energy: 0 };
    },
    
    chargeAdvancedPrism: function(amount) {
      if (typeof chargeAdvancedPrism === 'function') {
        const result = chargeAdvancedPrism(amount);
        window.FluffAPI.events.emit('advancedPrismCharged', { amount: amount });
        return result;
      }
      return false;
    }
  },

  // Terrarium System
  terrarium: {
    getFlowers: function() {
      return window.state && window.state.terrarium && window.state.terrarium.flowers || [];
    },
    
    getFlowerStats: function() {
      const flowers = this.getFlowers();
      return flowers.map((flower, index) => ({
        index: index,
        type: flower.type || 'unknown',
        stage: flower.stage || 0,
        health: flower.health || 100,
        lastWatered: flower.lastWatered || 0,
        position: flower.position || { x: 0, y: 0 }
      }));
    },
    
    waterFlower: function(flowerIndex) {
      if (typeof waterFlower === 'function') {
        const result = waterFlower(flowerIndex);
        window.FluffAPI.events.emit('flowerWatered', { flowerIndex: flowerIndex });
        return result;
      }
      return false;
    },
    
    waterAllFlowers: function() {
      const flowers = this.getFlowers();
      let watered = 0;
      flowers.forEach((flower, index) => {
        if (this.waterFlower(index)) {
          watered++;
        }
      });
      return { total: flowers.length, watered: watered };
    },
    
    plantFlower: function(flowerType, position) {
      if (typeof plantFlower === 'function') {
        const result = plantFlower(flowerType, position);
        window.FluffAPI.events.emit('flowerPlanted', { type: flowerType, position: position });
        return result;
      }
      return false;
    },
    
    harvestFlower: function(flowerIndex) {
      if (typeof harvestFlower === 'function') {
        const result = harvestFlower(flowerIndex);
        window.FluffAPI.events.emit('flowerHarvested', { flowerIndex: flowerIndex });
        return result;
      }
      return false;
    },
    
    extractPollen: function(amount) {
      if (typeof extractPollen === 'function') {
        const result = extractPollen(amount);
        window.FluffAPI.events.emit('pollenExtracted', { amount: amount });
        return result;
      }
      // Fallback - trigger flower click tracking
      if (typeof trackFlowerClick === 'function') {
        for (let i = 0; i < amount; i++) {
          trackFlowerClick();
        }
        return true;
      }
      return false;
    },
    
    getPollenCount: function() {
      if (window.state && window.state.inventory && window.state.inventory.pollen) {
        const pollen = window.state.inventory.pollen;
        return DecimalUtils.isDecimal(pollen) ? pollen.toString() : pollen;
      }
      return '0';
    },
    
    getPetalTokens: function() {
      if (window.state && window.state.inventory && window.state.inventory.petalTokens) {
        const tokens = window.state.inventory.petalTokens;
        return DecimalUtils.isDecimal(tokens) ? tokens.toString() : tokens;
      }
      return '0';
    },
    
    getRustlingTokens: function() {
      if (window.state && window.state.inventory && window.state.inventory.terrariumRustlingTokens) {
        const tokens = window.state.inventory.terrariumRustlingTokens;
        return DecimalUtils.isDecimal(tokens) ? tokens.toString() : tokens;
      }
      return '0';
    },
    
    getFluzzerStatus: function() {
      if (window.state && window.state.terrarium && window.state.terrarium.fluzzer) {
        return {
          mood: window.state.terrarium.fluzzer.mood || 'neutral',
          lastInteraction: window.state.terrarium.fluzzer.lastInteraction || 0,
          happiness: window.state.terrarium.fluzzer.happiness || 50
        };
      }
      return { mood: 'unknown', lastInteraction: 0, happiness: 50 };
    },
    
    interactWithFluzzer: function() {
      if (typeof interactWithFluzzer === 'function') {
        const result = interactWithFluzzer();
        window.FluffAPI.events.emit('fluzzerInteraction', { timestamp: Date.now() });
        return result;
      }
      return false;
    },
    
    getTerrarium2Status: function() {
      if (window.state && window.state.terrarium2) {
        return {
          unlocked: window.state.terrarium2.unlocked || false,
          flowers: window.state.terrarium2.flowers || [],
          upgrades: window.state.terrarium2.upgrades || {}
        };
      }
      return { unlocked: false, flowers: [], upgrades: {} };
    }
  },

  // Front Desk System
  frontDesk: {
    getReceptionists: function() {
      return window.state && window.state.frontDesk && window.state.frontDesk.receptionists || [];
    },
    
    getVisitors: function() {
      return window.state && window.state.frontDesk && window.state.frontDesk.visitors || [];
    },
    
    getUpgrades: function() {
      return window.state && window.state.frontDesk && window.state.frontDesk.upgrades || {};
    },
    
    processVisitor: function(visitorIndex) {
      if (typeof processVisitor === 'function') {
        const result = processVisitor(visitorIndex);
        window.FluffAPI.events.emit('visitorProcessed', { visitorIndex: visitorIndex });
        return result;
      }
      return false;
    },
    
    hireReceptionist: function(receptionistType) {
      if (typeof hireReceptionist === 'function') {
        const result = hireReceptionist(receptionistType);
        window.FluffAPI.events.emit('receptionistHired', { type: receptionistType });
        return result;
      }
      return false;
    },
    
    upgradeReceptionist: function(receptionistIndex) {
      if (typeof upgradeReceptionist === 'function') {
        const result = upgradeReceptionist(receptionistIndex);
        window.FluffAPI.events.emit('receptionistUpgraded', { receptionistIndex: receptionistIndex });
        return result;
      }
      return false;
    },
    
    getStats: function() {
      const receptionists = this.getReceptionists();
      const visitors = this.getVisitors();
      return {
        totalReceptionists: receptionists.length,
        totalVisitors: visitors.length,
        processingRate: window.state && window.state.frontDesk && window.state.frontDesk.processingRate || 0,
        revenue: window.state && window.state.frontDesk && window.state.frontDesk.revenue || 0
      };
    }
  },

  // Infinity System
  infinity: {
    getStatus: function() {
      if (window.infinitySystem) {
        return {
          totalInfinityEarned: DecimalUtils.isDecimal(window.infinitySystem.totalInfinityEarned) ? 
            window.infinitySystem.totalInfinityEarned.toString() : (window.infinitySystem.totalInfinityEarned || 0),
          currentInfinity: DecimalUtils.isDecimal(window.infinitySystem.currentInfinity) ? 
            window.infinitySystem.currentInfinity.toString() : (window.infinitySystem.currentInfinity || 0),
          infinityUpgrades: window.infinitySystem.upgrades || {},
          canInfinity: window.infinitySystem.canInfinity || false,
          infinityCount: window.infinitySystem.infinityCount || 0
        };
      }
      return { totalInfinityEarned: '0', currentInfinity: '0', infinityUpgrades: {}, canInfinity: false, infinityCount: 0 };
    },
    
    performInfinity: function() {
      if (typeof performInfinity === 'function') {
        const result = performInfinity();
        window.FluffAPI.events.emit('infinityPerformed', { timestamp: Date.now() });
        return result;
      }
      return false;
    },
    
    buyInfinityUpgrade: function(upgradeId) {
      if (typeof buyInfinityUpgrade === 'function') {
        const result = buyInfinityUpgrade(upgradeId);
        window.FluffAPI.events.emit('infinityUpgradeBought', { upgradeId: upgradeId });
        return result;
      }
      return false;
    },
    
    getUpgradeCost: function(upgradeId) {
      if (window.infinitySystem && window.infinitySystem.upgradeCosts && window.infinitySystem.upgradeCosts[upgradeId]) {
        const cost = window.infinitySystem.upgradeCosts[upgradeId];
        return DecimalUtils.isDecimal(cost) ? cost.toString() : cost;
      }
      return '0';
    },
    
    getMultipliers: function() {
      return {
        fluffMultiplier: window.infinitySystem && window.infinitySystem.fluffMultiplier || 1,
        generatorMultiplier: window.infinitySystem && window.infinitySystem.generatorMultiplier || 1,
        friendshipMultiplier: window.infinitySystem && window.infinitySystem.friendshipMultiplier || 1
      };
    }
  },

  // Expansion System
  expansion: {
    getStatus: function() {
      return window.state && window.state.expansion || {
        currentGrade: 1,
        expansionsPerformed: 0,
        nextExpansionCost: '1000000',
        unlockedFeatures: []
      };
    },
    
    getCurrentGrade: function() {
      return window.state && window.state.grade || 1;
    },
    
    getExpansionCost: function() {
      if (window.state && window.state.expansion && window.state.expansion.nextExpansionCost) {
        const cost = window.state.expansion.nextExpansionCost;
        return DecimalUtils.isDecimal(cost) ? cost.toString() : cost;
      }
      return '1000000';
    },
    
    canExpand: function() {
      if (typeof canPerformExpansion === 'function') {
        return canPerformExpansion();
      }
      const cost = DecimalUtils.toDecimal(this.getExpansionCost());
      const fluff = DecimalUtils.toDecimal(window.state && window.state.fluff || 0);
      return fluff.gte(cost);
    },
    
    performExpansion: function() {
      if (typeof performExpansion === 'function') {
        const oldGrade = this.getCurrentGrade();
        const result = performExpansion();
        if (result) {
          const newGrade = this.getCurrentGrade();
          window.FluffAPI.events.emit('expansionPerformed', { 
            oldGrade: oldGrade, 
            newGrade: newGrade,
            timestamp: Date.now()
          });
        }
        return result;
      }
      return false;
    },
    
    getUnlockedFeatures: function() {
      return window.state && window.state.expansion && window.state.expansion.unlockedFeatures || [];
    },
    
    isFeatureUnlocked: function(featureName) {
      const unlockedFeatures = this.getUnlockedFeatures();
      return unlockedFeatures.includes(featureName);
    },
    
    getGradeMultipliers: function() {
      const grade = this.getCurrentGrade();
      return {
        fluffMultiplier: Math.pow(2, grade - 1),
        generatorMultiplier: Math.pow(1.5, grade - 1),
        friendshipMultiplier: Math.pow(1.2, grade - 1)
      };
    }
  },

  // Boutique System (Lepre's Shop)
  boutique: {
    isUnlocked: function() {
      return window.boutique && typeof window.boutique.unlockBoutique !== 'undefined';
    },
    
    getStatus: function() {
      if (!window.boutique) return { unlocked: false, open: false, leprePresent: false };
      
      return {
        unlocked: this.isUnlocked(),
        open: !window.boutique.isBoutiqueClosed,
        leprePresent: !window.boutique.isLepreGone,
        lepreMood: window.boutique.lepreIsMad ? (window.boutique.lepreIsVeryMad ? 'very_mad' : 'mad') : 'normal',
        priceMultiplier: window.boutique.priceMultiplier || 1,
        nextRestockTime: window.boutique.lastRestockTime + (24 * 60 * 1000) // 24 minutes
      };
    },
    
    getSwaBucks: function() {
      if (window.state && window.state.swabucks) {
        return DecimalUtils.isDecimal(window.state.swabucks) ? window.state.swabucks.toString() : window.state.swabucks;
      }
      return '0';
    },
    
    addSwaBucks: function(amount) {
      if (!window.state) return false;
      if (!window.state.swabucks) window.state.swabucks = new Decimal(0);
      
      window.state.swabucks = DecimalUtils.toDecimal(window.state.swabucks).add(DecimalUtils.toDecimal(amount));
      window.FluffAPI.events.emit('swaBucksChanged', { amount: amount, total: window.state.swabucks.toString() });
      return true;
    },
    
    getCurrentStock: function() {
      if (!window.boutique || !window.boutique.currentShopItems) return [];
      
      return window.boutique.currentShopItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        basePrice: item.basePrice,
        currentPrice: window.boutique.getCurrentPrice(item.id),
        stock: window.boutique.getStockRemaining(item.id),
        canAfford: window.boutique.canAfford(item.id)
      }));
    },
    
    purchaseItem: function(itemId, quantity = 1) {
      if (!window.boutique || typeof window.boutique.purchaseItem !== 'function') return false;
      
      let success = false;
      for (let i = 0; i < quantity; i++) {
        const result = window.boutique.purchaseItem(itemId);
        if (result) {
          success = true;
          window.FluffAPI.events.emit('boutiquePurchase', { itemId: itemId, quantity: 1 });
        } else {
          break; // Stop if purchase fails (out of stock or insufficient funds)
        }
      }
      return success;
    },
    
    restockShop: function() {
      if (window.boutique && typeof window.boutique.forceRestock === 'function') {
        window.boutique.forceRestock();
        window.FluffAPI.events.emit('boutiqueRestocked', { timestamp: Date.now() });
        return true;
      }
      return false;
    },
    
    getTimeUntilRestock: function() {
      if (window.boutique && typeof window.boutique.getTimeUntilRestock === 'function') {
        return window.boutique.getTimeUntilRestock();
      }
      return 0;
    },
    
    // Lepre Interaction System
    lepre: {
      getStatus: function() {
        if (!window.boutique) return { present: false, mood: 'unknown' };
        
        return {
          present: !window.boutique.isLepreGone,
          mood: window.boutique.lepreIsMad ? (window.boutique.lepreIsVeryMad ? 'very_mad' : 'mad') : 'normal',
          pokeCount: window.boutique.leprePokeCount || 0,
          apologizeCount: window.boutique.apologizeCount || 0,
          apologizeRequired: window.boutique.apologizeRequired || 1000,
          priceMultiplier: window.boutique.priceMultiplier || 1,
          madUntil: window.boutique.lepreMadUntil || 0,
          veryMadUntil: window.boutique.lepreVeryMadUntil || 0
        };
      },
      
      poke: function() {
        if (window.boutique && typeof window.boutique.pokeLepre === 'function') {
          window.boutique.pokeLepre();
          window.FluffAPI.events.emit('leprePoked', { pokeCount: window.boutique.leprePokeCount });
          return true;
        }
        return false;
      },
      
      apologize: function() {
        if (window.boutique && typeof window.boutique.apologizeToLepre === 'function') {
          window.boutique.apologizeToLepre();
          window.FluffAPI.events.emit('lepreApology', { 
            apologizeCount: window.boutique.apologizeCount,
            required: window.boutique.apologizeRequired 
          });
          return true;
        }
        return false;
      },
      
      calmDown: function() {
        if (window.boutique && typeof window.boutique.calmLepreDown === 'function') {
          window.boutique.calmLepreDown();
          window.FluffAPI.events.emit('lepreCalmDown', { timestamp: Date.now() });
          return true;
        }
        return false;
      },
      
      speak: function(message, duration = 5000) {
        if (window.boutique && typeof window.boutique.showLepreSpeech === 'function') {
          window.boutique.showLepreSpeech(message, duration);
          return true;
        }
        return false;
      }
    },
    
    // Free Daily Swa Bucks
    freeBucks: {
      canClaim: function() {
        return window.boutique && typeof window.boutique.canClaimFreeBucks === 'function' ? 
          window.boutique.canClaimFreeBucks() : false;
      },
      
      getAmount: function() {
        return window.boutique && typeof window.boutique.getFreeBucksAmount === 'function' ? 
          window.boutique.getFreeBucksAmount() : 0;
      },
      
      claim: function() {
        if (window.boutique && typeof window.boutique.claimFreeBucks === 'function') {
          const result = window.boutique.claimFreeBucks();
          if (result) {
            window.FluffAPI.events.emit('freeBucksClaimed', { 
              amount: window.boutique.getFreeBucksAmount(),
              timestamp: Date.now()
            });
          }
          return result;
        }
        return false;
      }
    },
    
    // Token Challenge Minigame
    tokenChallenge: {
      getPersonalBest: function() {
        return window.boutique && typeof window.boutique.getTokenChallengePB === 'function' ? 
          window.boutique.getTokenChallengePB() : 0;
      },
      
      setPersonalBest: function(score) {
        if (window.boutique && typeof window.boutique.setTokenChallengePB === 'function') {
          window.boutique.setTokenChallengePB(score);
          return true;
        }
        return false;
      },
      
      getLeaderboard: function() {
        return window.boutique && typeof window.boutique.getCharacterTokenChallengePBs === 'function' ? 
          window.boutique.getCharacterTokenChallengePBs() : {};
      },
      
      startChallenge: function() {
        if (window.boutique && typeof window.boutique.openTokenMinigame === 'function') {
          window.boutique.openTokenMinigame();
          window.FluffAPI.events.emit('tokenChallengeStarted', { timestamp: Date.now() });
          return true;
        }
        return false;
      }
    },
    
    // Premium Items
    premium: {
      isBijouUnlocked: function() {
        return window.premiumState && window.premiumState.bijouUnlocked || false;
      },
      
      isVRChatMirrorUnlocked: function() {
        return window.premiumState && window.premiumState.vrchatMirrorUnlocked || false;
      },
      
      unlockBijou: function() {
        return this.purchasePremiumItem('bijou');
      },
      
      unlockVRChatMirror: function() {
        return this.purchasePremiumItem('vrchatMirror');
      },
      
      purchasePremiumItem: function(itemId) {
        if (window.boutique && typeof window.boutique.purchaseItem === 'function') {
          const result = window.boutique.purchaseItem(itemId);
          if (result) {
            window.FluffAPI.events.emit('premiumItemUnlocked', { itemId: itemId });
          }
          return result;
        }
        return false;
      }
    }
  },

  // Game State Management
  game: {
    getState: function() {
      if (!window.state) return {};
      return {
        gameVersion: window.gameVersion || 'unknown',
        totalPlayTime: window.state.totalPlayTime || 0,
        grade: window.state.grade || 1,
        powerLevel: window.state.powerLevel || 0,
        infinityCount: window.infinitySystem && window.infinitySystem.totalInfinityEarned || 0,
        currentTime: window.daynight && typeof window.daynight.getTime === 'function' ? window.daynight.getTime() : 0,
        isNightTime: typeof isNightTime === 'function' ? isNightTime() : false
      };
    },
    
    save: function() {
      if (typeof saveGame === 'function') {
        saveGame();
        window.FluffAPI.events.emit('gameSaved', { timestamp: Date.now() });
        return true;
      }
      return false;
    },
    
    export: function() {
      if (!window.state) return null;
      
      const exportData = {
        timestamp: Date.now(),
        gameState: window.state,
        version: window.gameVersion || 'unknown'
      };
      
      const processedData = JSON.stringify(exportData, function(key, value) {
        return DecimalUtils.isDecimal(value) ? { _decimal: value.toString() } : value;
      });
      
      return btoa(processedData);
    },
    
    import: function(encodedData) {
      try {
        const decodedData = atob(encodedData);
        const importData = JSON.parse(decodedData, function(key, value) {
          if (value && typeof value === 'object' && value._decimal) {
            return new Decimal(value._decimal);
          }
          return value;
        });
        
        if (importData.gameState) {
          window.state = importData.gameState;
          if (typeof updateUI === 'function') updateUI();
          window.FluffAPI.events.emit('gameImported', { timestamp: Date.now() });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }
  },

  // Power System
  power: {
    get: function() {
      if (!window.state || typeof window.state.powerLevel === 'undefined') return 0;
      return DecimalUtils.isDecimal(window.state.powerLevel) ? window.state.powerLevel.toString() : window.state.powerLevel;
    },
    
    getMax: function() {
      if (!window.state || !window.state.power) return 100;
      return DecimalUtils.isDecimal(window.state.power.maxPower) ? window.state.power.maxPower.toString() : (window.state.power.maxPower || 100);
    },
    
    set: function(value) {
      if (!window.state) return false;
      window.state.powerLevel = DecimalUtils.toDecimal(value);
      if (typeof updateUI === 'function') updateUI();
      return true;
    }
  },

  // Kitchen System
  kitchen: {
    getRecipes: function() {
      return window.kitchenRecipes || {};
    },
    
    cook: function(recipeId, amount) {
      if (typeof cookRecipe === 'function') {
        const result = cookRecipe(recipeId, amount);
        window.FluffAPI.events.emit('recipeCook', { recipe: recipeId, amount: amount });
        return result;
      }
      return false;
    },
    
    getIngredients: function() {
      if (!window.state || !window.state.inventory) return {};
      const ingredients = {};
      ['berries', 'mushrooms', 'batteries', 'petals', 'prisma'].forEach(ingredient => {
        if (window.state.inventory[ingredient]) {
          ingredients[ingredient] = DecimalUtils.isDecimal(window.state.inventory[ingredient]) ? 
            window.state.inventory[ingredient].toString() : window.state.inventory[ingredient];
        }
      });
      return ingredients;
    }
  },

  // Utility Functions
  utils: {
    formatNumber: function(value) {
      const decimal = DecimalUtils.toDecimal(value);
      return DecimalUtils.formatDecimal(decimal);
    },
    
    parseDecimal: function(value) {
      return DecimalUtils.toDecimal(value).toString();
    },
    
    getGameTime: function() {
      if (typeof window.daynight !== 'undefined' && typeof window.daynight.getTime === 'function') {
        const minutes = window.daynight.getTime();
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0');
      }
      return 'Unknown';
    },
    
    isNightTime: function() {
      if (typeof isNightTime === 'function') {
        return isNightTime();
      }
      return false;
    },
    
    // Performance monitoring
    getPerformanceStats: function() {
      return {
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
        } : 'Not available',
        timing: performance.timing ? {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        } : 'Not available'
      };
    }
  },

  // Events and Hooks System
  events: {
    listeners: {},
    
    on: function(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    },
    
    emit: function(eventName, data) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach(function(callback) {
          try {
            callback(data);
          } catch (error) {
            console.warn('API Event error:', error);
          }
        });
      }
    },
    
    off: function(eventName, callback) {
      if (this.listeners[eventName]) {
        const index = this.listeners[eventName].indexOf(callback);
        if (index > -1) {
          this.listeners[eventName].splice(index, 1);
        }
      }
    },
    
    listEvents: function() {
      return Object.keys(this.listeners);
    }
  },

  // Complete State Management
  state: {
    // Core game state access
    getFullState: function() {
      return window.state || {};
    },
    
    // System-specific state getters
    getTokens: function() {
      return window.state && window.state.tokens || {};
    },
    
    getBoughtElements: function() {
      return window.state && window.state.boughtElements || {};
    },
    
    getCurrentKnowledgeSubTab: function() {
      return window.state && window.state.currentKnowledgeSubTab || 'elementsMain';
    },
    
    getTickSpeedMultiplier: function() {
      const multiplier = window.state && window.state.tickSpeedMultiplier;
      return DecimalUtils.isDecimal(multiplier) ? multiplier.toString() : (multiplier || 1);
    },
    
    getGeneratorUpgrades: function() {
      return window.state && window.state.generatorUpgrades || {};
    },
    
    getDeliverySystem: function() {
      return window.state && window.state.deliverySystem || {};
    },
    
    getPrismCoreSystem: function() {
      return window.state && window.state.prismCoreSystem || {};
    },
    
    getBoxGenerators: function() {
      return window.state && window.state.boxGenerators || {};
    },
    
    getBoxGeneratorMk2: function() {
      return window.state && window.state.boxGeneratorMk2 || {};
    },
    
    getAchievements: function() {
      return window.state && window.state.achievements || {};
    },
    
    getAchievementStats: function() {
      return window.state && window.state.achievementStats || {};
    },
    
    getSecretAchievements: function() {
      return window.state && window.state.secretAchievements || {};
    },
    
    getTrophies: function() {
      return window.state && window.state.trophies || {};
    },
    
    getPermanentTabUnlocks: function() {
      return window.state && window.state.permanentTabUnlocks || {};
    },
    
    getInfinityUpgrades: function() {
      return window.state && window.state.infinityUpgrades || {};
    },
    
    // Power System
    getPowerEnergy: function() {
      const energy = window.state && window.state.powerEnergy;
      return DecimalUtils.isDecimal(energy) ? energy.toString() : (energy || '0');
    },
    
    getPowerMaxEnergy: function() {
      const maxEnergy = window.state && window.state.powerMaxEnergy;
      return DecimalUtils.isDecimal(maxEnergy) ? maxEnergy.toString() : (maxEnergy || '100');
    },
    
    getPowerGeneratorBatteryUpgrades: function() {
      const upgrades = window.state && window.state.powerGeneratorBatteryUpgrades;
      return DecimalUtils.isDecimal(upgrades) ? upgrades.toString() : (upgrades || '0');
    },
    
    getPowerStatus: function() {
      return window.state && window.state.powerStatus || 'online';
    },
    
    // Grade and progression
    getGrade: function() {
      const grade = window.state && window.state.grade;
      return DecimalUtils.isDecimal(grade) ? grade.toString() : (grade || '1');
    },
    
    // Prism tracking
    getPrismClicks: function() {
      return window.state && window.state.prismClicks || 0;
    },
    
    getStableLight: function() {
      return window.state && window.state.stableLight || {};
    },
    
    // Fluzzer boost
    getFluzzerGlitteringPetalsBoost: function() {
      const boost = window.state && window.state.fluzzerGlitteringPetalsBoost;
      return DecimalUtils.isDecimal(boost) ? boost.toString() : (boost || '0');
    },
    
    // Challenge records
    getPowerChallengePersonalBest: function() {
      return window.state && window.state.powerChallengePersonalBest || 0;
    },
    
    // Challenge power cap (hard capped at 500)
    getChallengePowerCap: function() {
      if (typeof window.calculateChallengePowerCap === 'function') {
        return window.calculateChallengePowerCap();
      }
      const baseCap = typeof window.calculatePowerGeneratorCap === 'function' ? window.calculatePowerGeneratorCap() : 100;
      return Math.min(baseCap, 500);
    },
    
    // Set state values (with validation)
    setProperty: function(property, value) {
      if (!window.state) return false;
      if (typeof property !== 'string') return false;
      
      // Convert numeric strings to Decimals for known numeric properties
      const numericProperties = ['fluff', 'swaria', 'feathers', 'artifacts', 'stardust', 'prisms', 'berries', 'mushrooms', 'batteries', 'swabucks', 'kp', 'powerEnergy', 'powerMaxEnergy', 'powerGeneratorBatteryUpgrades', 'grade', 'fluzzerGlitteringPetalsBoost'];
      
      if (numericProperties.includes(property)) {
        window.state[property] = DecimalUtils.toDecimal(value);
      } else {
        window.state[property] = value;
      }
      
      if (typeof updateUI === 'function') updateUI();
      window.FluffAPI.events.emit('stateChanged', { property: property, value: value });
      return true;
    },
    
    // Get all state properties (for debugging)
    getAllProperties: function() {
      if (!window.state) return [];
      return Object.keys(window.state).sort();
    },
    
    // Check if property exists
    hasProperty: function(property) {
      return window.state && window.state.hasOwnProperty(property);
    }
  },

  // Debug and Development Tools
  debug: {
    completeAllQuests: function() {
      const activeQuests = window.FluffAPI.quests.getActive();
      let completed = 0;
      
      activeQuests.forEach(questId => {
        if (window.FluffAPI.quests.complete(questId)) {
          completed++;
        }
      });
      
      return { attempted: activeQuests.length, completed: completed };
    },
    
    maxAllResources: function() {
      const resources = ['fluff', 'swaria', 'feathers', 'artifacts', 'stardust', 'prisms', 'berries', 'mushrooms', 'batteries'];
      resources.forEach(resource => {
        window.FluffAPI.resources.set(resource, '999999999');
      });
      return 'All resources set to 999999999';
    },
    
    maxAllFriendship: function() {
      const friendships = window.FluffAPI.friendship.getAll();
      Object.keys(friendships).forEach(character => {
        window.FluffAPI.friendship.setLevel(character, 20);
      });
      return 'All friendship levels set to 20';
    },
    
    resetGame: function() {
      if (confirm('Are you sure you want to reset the game? This cannot be undone!')) {
        localStorage.clear();
        location.reload();
        return true;
      }
      return false;
    }
  }
};

// Integration hooks with existing game systems
function setupAPIIntegration() {
  // Hook into UI updates
  const originalUpdateUI = window.updateUI;
  if (originalUpdateUI) {
    window.updateUI = function() {
      originalUpdateUI.apply(this, arguments);
      
      // Emit API events
      window.FluffAPI.events.emit('uiUpdate', {
        timestamp: Date.now(),
        resources: window.FluffAPI.resources.getAll()
      });
    };
  }

  // Hook into generator ticks
  const originalTickGenerators = window.tickGenerators;
  if (originalTickGenerators) {
    window.tickGenerators = function(diff) {
      originalTickGenerators.call(this, diff);
      
      window.FluffAPI.events.emit('generatorTick', {
        delta: diff,
        generators: window.FluffAPI.generators.getStats()
      });
    };
  }

  // Hook into save system
  const originalSaveGame = window.saveGame;
  if (originalSaveGame) {
    window.saveGame = function() {
      window.FluffAPI.events.emit('beforeSave', { timestamp: Date.now() });
      const result = originalSaveGame.apply(this, arguments);
      window.FluffAPI.events.emit('afterSave', { timestamp: Date.now() });
      return result;
    };
  }
}

// Initialize API when ready
function initializeFluffAPI() {
  setupAPIIntegration();
  
  // Emit initialization event
  window.FluffAPI.events.emit('apiInitialized', {
    version: window.FluffAPI.version,
    timestamp: Date.now()
  });
  

}

// Wait for game systems to be ready
if (typeof window.state !== 'undefined') {
  initializeFluffAPI();
} else {
  // Wait for state to be available
  const checkState = setInterval(function() {
    if (typeof window.state !== 'undefined') {
      clearInterval(checkState);
      initializeFluffAPI();
    }
  }, 100);
}

// Make API easily accessible via shorthand
window.API = window.FluffAPI;

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.FluffAPI;
}
