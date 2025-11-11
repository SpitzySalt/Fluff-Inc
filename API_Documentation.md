# Fluff Inc. API Documentation

## Overview
The Fluff Inc. API provides comprehensive access to all game systems, allowing for automation, monitoring, and development tools.

## Quick Start

### Access the API
```javascript
// Full namespace
window.FluffAPI.resources.getAll()

// Shorthand
window.API.resources.getAll()
```

### Basic Examples
```javascript
// Get all resources
const resources = API.resources.getAll();

// Add resources
API.resources.add('fluff', '1000000');

// Get friendship levels
const friendships = API.friendship.getAll();

// Monitor game events
API.events.on('resourceChanged', (data) => {
  console.log('Resource changed:', data);
});
```

## API Reference

### Resources
- `API.resources.get(resourceName)` - Get specific resource value
- `API.resources.set(resourceName, value)` - Set resource value
- `API.resources.add(resourceName, amount)` - Add to resource
- `API.resources.subtract(resourceName, amount)` - Subtract from resource
- `API.resources.getAll()` - Get all resources

### Generators
- `API.generators.get()` - Get all generators
- `API.generators.getByType(type)` - Get generators by type
- `API.generators.upgrade(index, type)` - Upgrade generator
- `API.generators.getStats()` - Get generator statistics
- `API.generators.getLightGenerators()` - Get light generators

### Friendship
- `API.friendship.get(characterName)` - Get friendship data
- `API.friendship.getAll()` - Get all friendships
- `API.friendship.setLevel(character, level)` - Set friendship level
- `API.friendship.addPoints(character, points)` - Add friendship points

### Quests
- `API.quests.getActive()` - Get active quests
- `API.quests.getCompleted()` - Get completed quests
- `API.quests.getProgress(questId)` - Get quest progress
- `API.quests.complete(questId)` - Complete quest
- `API.quests.setProgress(questId, objective, value)` - Set quest progress

### Inventory
- `API.inventory.get()` - Get full inventory
- `API.inventory.getItem(itemName)` - Get specific item count
- `API.inventory.addItem(itemName, amount)` - Add items
- `API.inventory.removeItem(itemName, amount)` - Remove items

### Game State
- `API.game.getState()` - Get game state summary
- `API.game.save()` - Trigger save
- `API.game.export()` - Export save data
- `API.game.import(data)` - Import save data

### Power System
- `API.power.get()` - Get current power level
- `API.power.getMax()` - Get maximum power
- `API.power.set(value)` - Set power level

### Kitchen
- `API.kitchen.getRecipes()` - Get available recipes
- `API.kitchen.cook(recipeId, amount)` - Cook recipe
- `API.kitchen.getIngredients()` - Get cooking ingredients

### Prism System
- `API.prism.getPrisms()` - Get prism lab status and tiles
- `API.prism.clickTile(tileIndex)` - Click specific prism tile
- `API.prism.clickAllTiles()` - Click all available prism tiles
- `API.prism.getPrismTokens()` - Get prism click token count
- `API.prism.getAdvancedPrismStatus()` - Get advanced prism status
- `API.prism.chargeAdvancedPrism(amount)` - Charge advanced prism

### Terrarium System
- `API.terrarium.getFlowers()` - Get all flowers in terrarium
- `API.terrarium.getFlowerStats()` - Get detailed flower statistics
- `API.terrarium.waterFlower(flowerIndex)` - Water specific flower
- `API.terrarium.waterAllFlowers()` - Water all flowers
- `API.terrarium.plantFlower(type, position)` - Plant new flower
- `API.terrarium.harvestFlower(flowerIndex)` - Harvest flower
- `API.terrarium.extractPollen(amount)` - Extract pollen (click flowers)
- `API.terrarium.getPollenCount()` - Get current pollen count
- `API.terrarium.getPetalTokens()` - Get petal token count
- `API.terrarium.getRustlingTokens()` - Get terrarium rustling token count
- `API.terrarium.getFluzzerStatus()` - Get Fluzzer's mood and status
- `API.terrarium.interactWithFluzzer()` - Interact with Fluzzer
- `API.terrarium.getTerrarium2Status()` - Get second terrarium status

### Front Desk System
- `API.frontDesk.getReceptionists()` - Get all receptionists
- `API.frontDesk.getVisitors()` - Get current visitors
- `API.frontDesk.getUpgrades()` - Get front desk upgrades
- `API.frontDesk.processVisitor(visitorIndex)` - Process specific visitor
- `API.frontDesk.hireReceptionist(type)` - Hire new receptionist
- `API.frontDesk.upgradeReceptionist(index)` - Upgrade receptionist
- `API.frontDesk.getStats()` - Get front desk statistics

### Infinity System
- `API.infinity.getStatus()` - Get infinity system status
- `API.infinity.performInfinity()` - Perform infinity reset
- `API.infinity.buyInfinityUpgrade(upgradeId)` - Buy infinity upgrade
- `API.infinity.getUpgradeCost(upgradeId)` - Get upgrade cost
- `API.infinity.getMultipliers()` - Get infinity multipliers

### Expansion System
- `API.expansion.getStatus()` - Get expansion system status
- `API.expansion.getCurrentGrade()` - Get current grade level
- `API.expansion.getExpansionCost()` - Get next expansion cost
- `API.expansion.canExpand()` - Check if expansion is possible
- `API.expansion.performExpansion()` - Perform grade expansion
- `API.expansion.getUnlockedFeatures()` - Get unlocked features list
- `API.expansion.isFeatureUnlocked(feature)` - Check if feature is unlocked
- `API.expansion.getGradeMultipliers()` - Get grade-based multipliers

### Boutique System (Lepre's Shop)
- `API.boutique.isUnlocked()` - Check if boutique is unlocked
- `API.boutique.getStatus()` - Get boutique status (open, Lepre mood, etc.)
- `API.boutique.getSwaBucks()` - Get current Swa Bucks balance
- `API.boutique.addSwaBucks(amount)` - Add Swa Bucks to balance
- `API.boutique.getCurrentStock()` - Get current shop inventory
- `API.boutique.purchaseItem(itemId, quantity)` - Purchase items from shop
- `API.boutique.restockShop()` - Force shop restock
- `API.boutique.getTimeUntilRestock()` - Get time until next restock

#### Lepre Interactions
- `API.boutique.lepre.getStatus()` - Get Lepre's mood and status
- `API.boutique.lepre.poke()` - Poke Lepre (may anger them)
- `API.boutique.lepre.apologize()` - Apologize to angry Lepre
- `API.boutique.lepre.calmDown()` - Force calm Lepre (debug)
- `API.boutique.lepre.speak(message, duration)` - Make Lepre speak

#### Free Daily Swa Bucks
- `API.boutique.freeBucks.canClaim()` - Check if free bucks available
- `API.boutique.freeBucks.getAmount()` - Get free bucks amount
- `API.boutique.freeBucks.claim()` - Claim daily free bucks

#### Token Challenge Minigame
- `API.boutique.tokenChallenge.getPersonalBest()` - Get token challenge PB
- `API.boutique.tokenChallenge.setPersonalBest(score)` - Set token challenge PB
- `API.boutique.tokenChallenge.getLeaderboard()` - Get character leaderboard
- `API.boutique.tokenChallenge.startChallenge()` - Start token challenge

#### Premium Items
- `API.boutique.premium.isBijouUnlocked()` - Check if Bijou is unlocked
- `API.boutique.premium.isVRChatMirrorUnlocked()` - Check if VRChat Mirror unlocked
- `API.boutique.premium.unlockBijou()` - Purchase and unlock Bijou
- `API.boutique.premium.unlockVRChatMirror()` - Purchase VRChat Mirror

### Complete State Management
- `API.state.getFullState()` - Get entire game state object
- `API.state.getAllProperties()` - Get list of all state property names
- `API.state.hasProperty(property)` - Check if state property exists
- `API.state.setProperty(property, value)` - Set any state property value

#### System-Specific State Access
- `API.state.getTokens()` - Get token system state
- `API.state.getBoughtElements()` - Get purchased elements
- `API.state.getCurrentKnowledgeSubTab()` - Get current knowledge tab
- `API.state.getTickSpeedMultiplier()` - Get game tick speed multiplier
- `API.state.getGeneratorUpgrades()` - Get generator upgrade states
- `API.state.getDeliverySystem()` - Get delivery system state
- `API.state.getPrismCoreSystem()` - Get prism core system state
- `API.state.getBoxGenerators()` - Get box generator states
- `API.state.getBoxGeneratorMk2()` - Get Mk.2 generator states

#### Achievement System State
- `API.state.getAchievements()` - Get achievement unlock states
- `API.state.getAchievementStats()` - Get achievement statistics
- `API.state.getSecretAchievements()` - Get secret achievement states
- `API.state.getTrophies()` - Get trophy collection state

#### Power System State
- `API.state.getPowerEnergy()` - Get current power energy
- `API.state.getPowerMaxEnergy()` - Get maximum power capacity
- `API.state.getPowerGeneratorBatteryUpgrades()` - Get battery upgrade count
- `API.state.getPowerStatus()` - Get power system status (online/offline)

#### Progression State
- `API.state.getGrade()` - Get current expansion grade
- `API.state.getPrismClicks()` - Get total prism clicks
- `API.state.getStableLight()` - Get stable light calibration data
- `API.state.getFluzzerGlitteringPetalsBoost()` - Get Fluzzer petal boost
- `API.state.getPowerChallengePersonalBest()` - Get power challenge record
- `API.state.getChallengePowerCap()` - Get effective challenge power cap (max 500)

### Utilities
- `API.utils.formatNumber(value)` - Format numbers for display
- `API.utils.getGameTime()` - Get in-game time
- `API.utils.isNightTime()` - Check if it's night time
- `API.utils.getPerformanceStats()` - Get performance metrics

### Events
- `API.events.on(eventName, callback)` - Listen for events
- `API.events.emit(eventName, data)` - Emit custom events
- `API.events.off(eventName, callback)` - Remove event listener
- `API.events.listEvents()` - List all event types

### Debug Tools
- `API.debug.completeAllQuests()` - Complete all active quests
- `API.debug.maxAllResources()` - Set all resources to maximum
- `API.debug.maxAllFriendship()` - Max all friendship levels
- `API.debug.resetGame()` - Reset entire game (with confirmation)

## Event Types
- `uiUpdate` - UI refreshed
- `resourceChanged` - Resource value changed
- `generatorTick` - Generator tick occurred
- `generatorUpgraded` - Generator upgraded
- `friendshipChanged` - Friendship level/points changed
- `questCompleted` - Quest completed
- `inventoryChanged` - Inventory changed
- `recipeCook` - Recipe cooked
- `prismTileClicked` - Prism tile clicked
- `advancedPrismCharged` - Advanced prism charged
- `flowerWatered` - Flower watered in terrarium
- `flowerPlanted` - New flower planted
- `flowerHarvested` - Flower harvested
- `pollenExtracted` - Pollen extracted from flowers
- `fluzzerInteraction` - Interacted with Fluzzer
- `visitorProcessed` - Visitor processed at front desk
- `receptionistHired` - New receptionist hired
- `receptionistUpgraded` - Receptionist upgraded
- `infinityPerformed` - Infinity reset performed
- `infinityUpgradeBought` - Infinity upgrade purchased
- `expansionPerformed` - Grade expansion performed
- `beforeSave` - Before game save
- `afterSave` - After game save
- `gameSaved` - Game saved
- `gameImported` - Game data imported
- `stateChanged` - Game state property changed
- `swaBucksChanged` - Swa Bucks balance changed
- `apiInitialized` - API initialization complete

## Usage Examples

### Complete Quest 7 Objectives
```javascript
// Complete all Mystic Quest 7 objectives
const questId = 'mystic_quest_7';
API.quests.setProgress(questId, 'cookAnyIngredients', 100);
API.quests.setProgress(questId, 'cookBerryPlates', 15);
API.quests.setProgress(questId, 'cookMushroomSoup', 15);
API.quests.setProgress(questId, 'cookBatteries', 15);
API.quests.setProgress(questId, 'cookChargedPrisma', 10);
API.quests.setProgress(questId, 'cookGlitteringPetals', 10);
API.quests.setProgress(questId, 'collectAnyTokens', 1000);
API.quests.setProgress(questId, 'cargoTokensFromBoxes', 200);
API.quests.setProgress(questId, 'generatorTokensFromBoxes', 200);
API.quests.setProgress(questId, 'prismClickTokens', 200);
API.quests.setProgress(questId, 'terrariumRustlingTokens', 200);
API.quests.setProgress(questId, 'nightTimeTokens', 200);
API.quests.setProgress(questId, 'buyBoxes', 30000);
API.quests.setProgress(questId, 'generateBoxes', 50000);
API.quests.setProgress(questId, 'clickPrismTiles', 5000);
API.quests.setProgress(questId, 'clickFlowersTotal', 40000);
```

### Monitor Resource Changes
```javascript
// Monitor all resource changes
API.events.on('resourceChanged', (data) => {
  console.log(`${data.resource} changed to ${API.utils.formatNumber(data.value)}`);
});
```

### Automated Resource Management
```javascript
// Auto-maintain minimum resource levels
function maintainResources() {
  const minimums = {
    fluff: '10000000',
    swaria: '1000000',
    feathers: '100000'
  };
  
  Object.entries(minimums).forEach(([resource, minimum]) => {
    const current = API.resources.get(resource);
    if (API.utils.parseDecimal(current) < API.utils.parseDecimal(minimum)) {
      API.resources.set(resource, minimum);
      console.log(`Restored ${resource} to ${minimum}`);
    }
  });
}

// Run every 30 seconds
setInterval(maintainResources, 30000);
```

### Terrarium Automation
```javascript
// Auto-water all flowers
function autoWaterFlowers() {
  const result = API.terrarium.waterAllFlowers();
  console.log(`Watered ${result.watered}/${result.total} flowers`);
}

// Auto-extract pollen for quests
function autoExtractPollen(amount) {
  API.terrarium.extractPollen(amount);
  console.log(`Extracted ${amount} pollen`);
}

// Monitor Fluzzer mood
API.events.on('fluzzerInteraction', () => {
  const status = API.terrarium.getFluzzerStatus();
  console.log('Fluzzer mood:', status.mood, 'Happiness:', status.happiness);
});
```

### Prism Lab Automation
```javascript
// Auto-click all prism tiles
function autoClickPrismTiles() {
  const result = API.prism.clickAllTiles();
  console.log(`Clicked ${result.clicked}/${result.total} prism tiles`);
}

// Monitor prism tokens
API.events.on('prismTileClicked', () => {
  const tokens = API.prism.getPrismTokens();
  console.log('Prism tokens:', API.utils.formatNumber(tokens));
});
```

### Front Desk Management
```javascript
// Auto-process all visitors
function autoProcessVisitors() {
  const visitors = API.frontDesk.getVisitors();
  visitors.forEach((visitor, index) => {
    API.frontDesk.processVisitor(index);
  });
  console.log(`Processed ${visitors.length} visitors`);
}

// Monitor front desk stats
const stats = API.frontDesk.getStats();
console.log('Front desk stats:', stats);
```

### Infinity System Management
```javascript
// Check if infinity is available
if (API.infinity.getStatus().canInfinity) {
  console.log('Infinity available! Current multipliers:', API.infinity.getMultipliers());
}

// Monitor infinity resets
API.events.on('infinityPerformed', (data) => {
  console.log('Infinity performed at:', new Date(data.timestamp));
  console.log('New status:', API.infinity.getStatus());
});
```

### Expansion System Management
```javascript
// Auto-expand when possible
function autoExpand() {
  if (API.expansion.canExpand()) {
    const oldGrade = API.expansion.getCurrentGrade();
    API.expansion.performExpansion();
    console.log(`Expanded from grade ${oldGrade} to ${API.expansion.getCurrentGrade()}`);
  }
}

// Monitor expansions
API.events.on('expansionPerformed', (data) => {
  console.log(`Grade expanded from ${data.oldGrade} to ${data.newGrade}`);
  console.log('New multipliers:', API.expansion.getGradeMultipliers());
});
```

### Boutique Automation
```javascript
// Automated boutique shopping and Lepre management
class BoutiqueManager {
    constructor() {
        this.autoBuyItems = true;
        this.priorities = [
            'fluff_booster',
            'time_crystal', 
            'rare_element',
            'generator_upgrade'
        ];
        
        // Listen for shop restocks
        API.addEventListener('shopRestock', () => {
            this.checkAndBuyItems();
        });
        
        // Claim daily free bucks
        setInterval(() => {
            if (API.boutique.freeBucks.canClaim()) {
                const amount = API.boutique.freeBucks.getAmount();
                API.boutique.freeBucks.claim();
                console.log(`Claimed ${amount} free Swa Bucks`);
            }
        }, 60000); // Check every minute
    }
    
    checkAndBuyItems() {
        if (!API.boutique.isUnlocked()) return;
        
        const stock = API.boutique.getCurrentStock();
        const swaBucks = API.boutique.getSwaBucks();
        
        // Buy priority items first
        this.priorities.forEach(itemType => {
            const item = stock.find(item => item.type === itemType);
            if (item && swaBucks.gte(item.cost)) {
                API.boutique.purchaseItem(item.id, 1);
                console.log(`Bought ${item.name} for ${item.cost} Swa Bucks`);
            }
        });
    }
    
    manageLepre() {
        const lepreStatus = API.boutique.lepre.getStatus();
        
        if (lepreStatus.mood === 'angry') {
            API.boutique.lepre.apologize();
            console.log('Apologized to angry Lepre');
        }
    }
    
    farmTokens() {
        // Play token challenge to earn more Swa Bucks
        const pb = API.boutique.tokenChallenge.getPersonalBest();
        console.log(`Current token challenge PB: ${pb}`);
        
        // Could implement auto-play logic here
        API.boutique.tokenChallenge.startChallenge();
    }
}

// Usage
const boutiqueManager = new BoutiqueManager();
```

### Complete State Access Example
```javascript
// Comprehensive game state monitoring and modification
class StateManager {
    constructor() {
        this.monitoring = false;
        this.stateSnapshot = null;
        
        // Listen for all state changes
        API.addEventListener('stateChanged', (data) => {
            console.log(`State property '${data.property}' changed to:`, data.value);
        });
        
        API.addEventListener('swaBucksChanged', (data) => {
            console.log(`Swa Bucks: +${data.amount} (Total: ${data.total})`);
        });
    }
    
    // Take a complete snapshot of current state
    takeSnapshot() {
        this.stateSnapshot = {
            timestamp: Date.now(),
            resources: API.resources.getAll(),
            friendship: API.friendship.getAll(),
            quests: {
                active: API.quests.getActive(),
                completed: API.quests.getCompleted(),
                claimable: API.quests.getClaimable()
            },
            inventory: API.inventory.get(),
            achievements: API.state.getAchievements(),
            grade: API.state.getGrade(),
            powerEnergy: API.state.getPowerEnergy(),
            tokens: API.state.getTokens(),
            boxGenerators: API.state.getBoxGenerators(),
            prismClicks: API.state.getPrismClicks()
        };
        
        console.log('State snapshot taken at', new Date(this.stateSnapshot.timestamp));
        return this.stateSnapshot;
    }
    
    // Compare current state to snapshot
    compareToSnapshot() {
        if (!this.stateSnapshot) {
            console.log('No snapshot available. Take a snapshot first.');
            return null;
        }
        
        const current = this.takeSnapshot();
        const changes = {};
        
        // Compare resources
        Object.keys(current.resources).forEach(resource => {
            const oldValue = this.stateSnapshot.resources[resource] || '0';
            const newValue = current.resources[resource] || '0';
            if (oldValue !== newValue) {
                changes[`resources.${resource}`] = {
                    old: oldValue,
                    new: newValue,
                    diff: new Decimal(newValue).sub(new Decimal(oldValue)).toString()
                };
            }
        });
        
        // Compare other systems similarly
        if (current.grade !== this.stateSnapshot.grade) {
            changes['grade'] = {
                old: this.stateSnapshot.grade,
                new: current.grade
            };
        }
        
        if (current.prismClicks !== this.stateSnapshot.prismClicks) {
            changes['prismClicks'] = {
                old: this.stateSnapshot.prismClicks,
                new: current.prismClicks,
                diff: current.prismClicks - this.stateSnapshot.prismClicks
            };
        }
        
        return changes;
    }
    
    // Get comprehensive game statistics
    getGameStats() {
        return {
            totalResources: Object.values(API.resources.getAll()).reduce((sum, val) => {
                return sum.add(new Decimal(val || 0));
            }, new Decimal(0)).toString(),
            
            totalFriendshipLevels: Object.values(API.friendship.getAll()).reduce((sum, char) => {
                return sum + (char ? char.level : 0);
            }, 0),
            
            totalQuestsCompleted: API.quests.getCompleted().length,
            
            totalAchievements: Object.values(API.state.getAchievements()).filter(ach => ach.unlocked).length,
            
            currentGrade: API.state.getGrade(),
            
            powerEfficiency: {
                current: API.state.getPowerEnergy(),
                max: API.state.getPowerMaxEnergy(),
                percentage: (parseFloat(API.state.getPowerEnergy()) / parseFloat(API.state.getPowerMaxEnergy()) * 100).toFixed(1) + '%'
            },
            
            prismActivity: {
                totalClicks: API.state.getPrismClicks(),
                terrariumTokens: API.terrarium.getRustlingTokens(),
                prismTokens: API.terrarium.getPetalTokens()
            }
        };
    }
    
    // Backup and restore state
    backupState() {
        const backup = {
            timestamp: Date.now(),
            version: API.version,
            state: API.state.getFullState()
        };
        
        const encoded = btoa(JSON.stringify(backup));
        console.log('State backup created:', encoded.substring(0, 50) + '...');
        return encoded;
    }
    
    // Set multiple state properties safely
    bulkSetState(properties) {
        let successful = 0;
        let failed = 0;
        
        Object.keys(properties).forEach(prop => {
            if (API.state.setProperty(prop, properties[prop])) {
                successful++;
            } else {
                failed++;
                console.warn(`Failed to set property: ${prop}`);
            }
        });
        
        return { successful, failed, total: successful + failed };
    }
    
    // Debug: List all available state properties
    listAllStateProperties() {
        const properties = API.state.getAllProperties();
        console.log(`Total state properties: ${properties.length}`);
        
        const categorized = {
            resources: properties.filter(p => ['fluff', 'swaria', 'feathers', 'artifacts', 'stardust', 'prisms', 'berries', 'mushrooms', 'batteries', 'swabucks', 'kp'].includes(p)),
            systems: properties.filter(p => p.includes('System') || p.includes('Generator') || p.includes('Upgrade')),
            achievements: properties.filter(p => p.includes('achievement') || p.includes('Achievement') || p.includes('trophy') || p.includes('Trophy')),
            power: properties.filter(p => p.includes('power') || p.includes('Power')),
            other: properties.filter(p => !['fluff', 'swaria', 'feathers', 'artifacts', 'stardust', 'prisms', 'berries', 'mushrooms', 'batteries', 'swabucks', 'kp'].includes(p) && !p.includes('System') && !p.includes('Generator') && !p.includes('Upgrade') && !p.includes('achievement') && !p.includes('Achievement') && !p.includes('trophy') && !p.includes('Trophy') && !p.includes('power') && !p.includes('Power'))
        };
        
        return categorized;
    }
}

// Usage
const stateManager = new StateManager();

// Take initial snapshot
stateManager.takeSnapshot();

// Check stats
console.log(stateManager.getGameStats());

// List all state properties
console.log(stateManager.listAllStateProperties());

// Set multiple properties
stateManager.bulkSetState({
    'fluff': '1000000',
    'swaria': '50000',
    'tickSpeedMultiplier': 2
});

// Compare changes after some gameplay
setTimeout(() => {
    const changes = stateManager.compareToSnapshot();
    console.log('Changes detected:', changes);
}, 30000);
```

### Performance Monitoring
```javascript
// Monitor game performance
API.events.on('uiUpdate', () => {
  const stats = API.utils.getPerformanceStats();
  if (stats.memory !== 'Not available') {
    console.log('Memory usage:', stats.memory.used);
  }
});
```

## Integration Notes
- API is loaded after all core game systems
- Maintains compatibility with existing save system
- Events are emitted for all major game state changes
- Debug functions include safety confirmations
- All decimal values are properly handled for large numbers

## Browser Console Usage
Open browser console (F12) and start using:
```javascript
// Quick resource boost
API.resources.add('fluff', '1000000');

// Check current state
console.log(API.game.getState());

// Complete current quests
API.debug.completeAllQuests();
```