// Infinity Mechanics System
// When currencies reach 1.8e308, they reset to 1 and gain infinity count

const INFINITY_THRESHOLD = new Decimal('1.8e308');

// Throttling for infinity tree UI updates to prevent performance issues
const INFINITY_TREE_UPDATE_THROTTLE = 100; // ms (10 FPS)
let lastInfinityTreeUpdateTime = 0;

// Initialize infinity system in window.state if it doesn't exist
function initializeInfinitySystem() {
    if (!window.state) {
        window.state = {};
    }
    
    if (!window.state.infinitySystem) {
        window.state.infinitySystem = {
            counts: {
                fluff: 0,
                swaria: 0,
                feathers: 0,
                artifacts: 0,
                light: 0,
                redlight: 0,
                orangelight: 0,
                yellowlight: 0,
                greenlight: 0,
                bluelight: 0,
                terrariumPollen: 0,
                terrariumFlowers: 0,
                terrariumNectar: 0,
                charge: 0
            },
            
            // Track which currencies have ever reached infinity (for discovery)
            everReached: {
                fluff: false,
                swaria: false,
                feathers: false,
                artifacts: false,
                light: false,
                redlight: false,
                orangelight: false,
                yellowlight: false,
                greenlight: false,
                bluelight: false,
                terrariumPollen: false,
                terrariumFlowers: false,
                terrariumNectar: false,
                charge: false
            },
            
            // Infinity Tree Currencies
            infinityPoints: new Decimal(0),
            infinityTheorems: 0,
            totalInfinityTheorems: 0,
            theoremProgress: new Decimal(0),
            totalInfinityEarned: 0,
            lastInfinityPointsUpdate: Date.now()
        };
    }
    
    // Ensure Decimal properties are properly initialized
    if (!DecimalUtils.isDecimal(window.state.infinitySystem.infinityPoints)) {
        window.state.infinitySystem.infinityPoints = new Decimal(window.state.infinitySystem.infinityPoints || 0);
    }
    if (!DecimalUtils.isDecimal(window.state.infinitySystem.theoremProgress)) {
        window.state.infinitySystem.theoremProgress = new Decimal(window.state.infinitySystem.theoremProgress || 0);
    }
}

// Call initialization
initializeInfinitySystem();

// Migration function to move existing infinity data to window.state
function migrateInfinitySystemToState() {
    // Check if there's existing infinity data outside of window.state that needs migration
    const legacyKeys = ['infinityPoints', 'infinityTheorems', 'totalInfinityTheorems', 'theoremProgress', 'totalInfinityEarned', 'lastInfinityPointsUpdate'];
    
    legacyKeys.forEach(key => {
        if (window.infinitySystem[key] !== undefined && window.state.infinitySystem[key] !== window.infinitySystem[key]) {
            window.state.infinitySystem[key] = window.infinitySystem[key];
        }
    });
    
    // Also check for any legacy counts or everReached data
    if (window.infinitySystem.counts && typeof window.infinitySystem.counts === 'object') {
        Object.assign(window.state.infinitySystem.counts, window.infinitySystem.counts);
    }
    
    if (window.infinitySystem.everReached && typeof window.infinitySystem.everReached === 'object') {
        Object.assign(window.state.infinitySystem.everReached, window.infinitySystem.everReached);
    }
}

// Create reference to infinity system for backwards compatibility
window.infinitySystem = {
    get counts() { return window.state.infinitySystem.counts; },
    set counts(value) { window.state.infinitySystem.counts = value; },
    get everReached() { return window.state.infinitySystem.everReached; },
    set everReached(value) { window.state.infinitySystem.everReached = value; },
    get infinityPoints() { return window.state.infinitySystem.infinityPoints; },
    set infinityPoints(value) { window.state.infinitySystem.infinityPoints = value; },
    get infinityTheorems() { return window.state.infinitySystem.infinityTheorems; },
    set infinityTheorems(value) { window.state.infinitySystem.infinityTheorems = value; },
    get totalInfinityTheorems() { return window.state.infinitySystem.totalInfinityTheorems; },
    set totalInfinityTheorems(value) { window.state.infinitySystem.totalInfinityTheorems = value; },
    get theoremProgress() { return window.state.infinitySystem.theoremProgress; },
    set theoremProgress(value) { window.state.infinitySystem.theoremProgress = value; },
    get totalInfinityEarned() { return window.state.infinitySystem.totalInfinityEarned; },
    set totalInfinityEarned(value) { window.state.infinitySystem.totalInfinityEarned = value; },
    get lastInfinityPointsUpdate() { return window.state.infinitySystem.lastInfinityPointsUpdate; },
    set lastInfinityPointsUpdate(value) { window.state.infinitySystem.lastInfinityPointsUpdate = value; },
    
    // Check if a currency should go infinity
    checkInfinity: function(currencyName, currentValue) {
        if (!DecimalUtils.isDecimal(currentValue)) {
            currentValue = new Decimal(currentValue);
        }
        
        // Check if currency is capped
        if (typeof window.infinityCaps !== 'undefined' && window.infinityCaps[currencyName]) {
            const cap = new Decimal('1.79e308');
            if (currentValue.gt(cap)) {
                // Apply the cap but don't trigger infinity
                this.applyCap(currencyName, cap);
                return false;
            }
        }
        
        if (currentValue.gte(INFINITY_THRESHOLD)) {
            this.triggerInfinity(currencyName, currentValue);
            return true;
        }
        return false;
    },
    
    // Apply cap to a currency
    applyCap: function(currencyName, capValue) {
        switch(currencyName) {
            case 'fluff':
                if (typeof window.state !== 'undefined') window.state.fluff = capValue;
                break;
            case 'swariaCoins':
                if (typeof window.state !== 'undefined') window.state.swariaCoins = capValue;
                break;
            case 'feathers':
                if (typeof window.state !== 'undefined') window.state.feathers = capValue;
                break;
            case 'artifacts':
                if (typeof window.state !== 'undefined') window.state.artifacts = capValue;
                break;
            case 'terrariumPollen':
                if (typeof window.terrariumPollen !== 'undefined') window.terrariumPollen = capValue;
                break;
            case 'terrariumFlowers':
                if (typeof window.terrariumFlowers !== 'undefined') window.terrariumFlowers = capValue;
                break;
            case 'terrariumNectar':
                if (typeof window.terrariumNectar !== 'undefined') window.terrariumNectar = capValue;
                break;
        }
    },
    
    // Trigger infinity for a currency
    triggerInfinity: function(currencyName, currentValue) {
        this.counts[currencyName] = (this.counts[currencyName] || 0) + 1;
        const infinityCount = this.counts[currencyName];
        
        // Mark currency as discovered
        this.everReached[currencyName] = true;
        
        // No saving - infinity counts are not persistent
        
        // Update currency image to infinity version
        this.updateCurrencyImage(currencyName);
        
        // Reset currency to 1
        this.resetCurrency(currencyName);
        
        // Special case: If fluff goes infinity, reset the other 3 cargo currencies to 1
        if (currencyName === 'fluff') {
            this.resetCurrency('swaria');
            this.resetCurrency('feathers');
            this.resetCurrency('artifacts');
        }
        
        // Show infinity notification (including story modal for first fluff infinity)
        this.showInfinityNotification(currencyName, infinityCount);
        
        // Update UI to show infinity symbol immediately
        if (typeof updateUI === 'function') {
            updateUI();
        }
    },
    
    // Reset currency to 1 after infinity
    resetCurrency: function(currencyName) {
        const one = new Decimal(1);
        
        switch(currencyName) {
            case 'fluff':
                if (typeof window.state !== 'undefined') window.state.fluff = one;
                break;
            case 'swaria':
            case 'swariaCoins':
                if (typeof window.state !== 'undefined') window.state.swaria = one;
                break;
            case 'feathers':
                if (typeof window.state !== 'undefined') window.state.feathers = one;
                break;
            case 'artifacts':
                if (typeof window.state !== 'undefined') window.state.artifacts = one;
                break;
            case 'light':
                if (typeof window.state !== 'undefined' && window.state.prismState) window.state.prismState.light = one;
                if (typeof window.prismState !== 'undefined') window.prismState.light = one;
                break;
            case 'redlight':
                if (typeof window.state !== 'undefined' && window.state.prismState) window.state.prismState.redlight = one;
                if (typeof window.prismState !== 'undefined') window.prismState.redlight = one;
                break;
            case 'orangelight':
                if (typeof window.state !== 'undefined' && window.state.prismState) window.state.prismState.orangelight = one;
                if (typeof window.prismState !== 'undefined') window.prismState.orangelight = one;
                break;
            case 'yellowlight':
                if (typeof window.state !== 'undefined' && window.state.prismState) window.state.prismState.yellowlight = one;
                if (typeof window.prismState !== 'undefined') window.prismState.yellowlight = one;
                break;
            case 'greenlight':
                if (typeof window.state !== 'undefined' && window.state.prismState) window.state.prismState.greenlight = one;
                if (typeof window.prismState !== 'undefined') window.prismState.greenlight = one;
                break;
            case 'bluelight':
                if (typeof window.state !== 'undefined' && window.state.prismState) window.state.prismState.bluelight = one;
                if (typeof window.prismState !== 'undefined') window.prismState.bluelight = one;
                break;
            case 'terrariumPollen':
                if (typeof window.state !== 'undefined' && window.state.terrarium) window.state.terrarium.pollen = one;
                if (typeof window.terrariumPollen !== 'undefined') window.terrariumPollen = one;
                break;
            case 'terrariumFlowers':
                if (typeof window.state !== 'undefined' && window.state.terrarium) window.state.terrarium.flowers = one;
                if (typeof window.terrariumFlowers !== 'undefined') window.terrariumFlowers = one;
                break;
            case 'terrariumNectar':
                if (typeof window.state !== 'undefined' && window.state.terrarium) window.state.terrarium.nectar = one;
                if (typeof window.terrariumNectar !== 'undefined') window.terrariumNectar = one;
                break;
            case 'charge':
                if (typeof window.charger !== 'undefined' && window.charger.charge) window.charger.charge = one;
                break;
        }
    },
    
    // Get the effective multiplier for a currency based on infinity count
    getInfinityMultiplier: function(currencyName) {
        const count = this.counts[currencyName] || 0;
        if (count === 0) return new Decimal(1);
        
        // Each infinity divides gains by 1.8e308, but we want meaningful progression
        // So we use a more reasonable scaling: each infinity divides by 1000
        return new Decimal(1000).pow(count);
    },
    
    // Show infinity notification
    showInfinityNotification: function(currencyName, infinityCount) {
        // Special story modal for first fluff infinity
        if (currencyName === 'fluff' && infinityCount === 1) {
            // Check if we've already shown the story modal
            if (!window.state.seenInfinityFluffStory && typeof window.showInfinityFluffStoryModal === 'function') {
                window.state.seenInfinityFluffStory = true;
                window.showInfinityFluffStoryModal();
                return;
            }
        }
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffecd2);
            background-size: 300% 300%;
            animation: infinityGlow 2s ease-in-out;
            color: white;
            font-size: 2em;
            font-weight: bold;
            padding: 2em;
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(255, 255, 255, 0.5);
            z-index: 10000;
            text-align: center;
            font-family: 'Orbitron', monospace;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;
        
        notification.innerHTML = `
            <div style="font-size: 1.5em; margin-bottom: 0.2em;">∞</div>
            <div>${currencyName.toUpperCase()}</div>
            <div style="font-size: 0.7em; margin-top: 0.2em;">INFINITY ${infinityCount}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    },
    
    // Update currency image to infinity version
    updateCurrencyImage: function(currencyName) {
        const imageMap = {
            'fluff': 'assets/icons/infinity fluff.png',
            'swaria': 'assets/icons/infinity swaria coins.png',
            'feathers': 'assets/icons/infinity feather.png',
            'artifacts': 'assets/icons/infinity wing artifact.png',
            'light': 'assets/icons/light-infinity.png',
            'redlight': 'assets/icons/red-light-infinity.png',
            'orangelight': 'assets/icons/orange-light-infinity.png',
            'yellowlight': 'assets/icons/yellow-light-infinity.png',
            'greenlight': 'assets/icons/green-light-infinity.png',
            'bluelight': 'assets/icons/blue-light-infinity.png',
            'terrariumPollen': 'assets/icons/pollen-infinity.png',
            'terrariumFlowers': 'assets/icons/flower-infinity.png',
            'terrariumNectar': 'assets/icons/nectar-infinity.png',
            'charge': 'assets/icons/charge-infinity.png'
        };
        
        const infinityImageSrc = imageMap[currencyName];
        if (!infinityImageSrc) return;
        
        // Update all images of this currency type
        const originalImageName = this.getOriginalImageName(currencyName);
        const currencyImages = document.querySelectorAll(`img[src*="${originalImageName}"]`);
        
        currencyImages.forEach(img => {
            // Try to load infinity image, fallback to original if it doesn't exist
            const testImg = new Image();
            testImg.onload = () => {
                // Just change the image, no glow or effects as requested
                img.src = infinityImageSrc;
            };
            testImg.onerror = () => {
                // If infinity image doesn't exist, keep original image
            };
            testImg.src = infinityImageSrc;
        });
    },
    
    // Get original image name for currency
    getOriginalImageName: function(currencyName) {
        const originalImageMap = {
            'fluff': 'fluff.png', 
            'swaria': 'swaria-coin.png',
            'feathers': 'feather.png',
            'artifacts': 'artifact.png',
            'light': 'light.png',
            'redlight': 'red light.png',
            'orangelight': 'orange light.png',
            'yellowlight': 'yellow light.png',
            'greenlight': 'green light.png',
            'bluelight': 'blue light.png',
            'terrariumPollen': 'pollen.png',
            'terrariumFlowers': 'flower.png',
            'terrariumNectar': 'nectar.png',
            'charge': 'charge.png'
        };
        return originalImageMap[currencyName] || '';
    },
    
    // Check all currencies for infinity
    checkAllCurrencies: function() {
        if (typeof window.state !== 'undefined') {
            this.checkInfinity('fluff', window.state.fluff);
            this.checkInfinity('swaria', window.state.swaria);
            this.checkInfinity('feathers', window.state.feathers);
            this.checkInfinity('artifacts', window.state.artifacts);
        }
        
        if (typeof window.prismState !== 'undefined') {
            this.checkInfinity('light', window.prismState.light);
            this.checkInfinity('redlight', window.prismState.redlight);
            this.checkInfinity('orangelight', window.prismState.orangelight);
            this.checkInfinity('yellowlight', window.prismState.yellowlight);
            this.checkInfinity('greenlight', window.prismState.greenlight);
            this.checkInfinity('bluelight', window.prismState.bluelight);
        }
        
        // Check terrarium currencies in window.state.terrarium
        if (typeof window.state !== 'undefined' && typeof window.state.terrarium !== 'undefined') {
            this.checkInfinity('terrariumPollen', window.state.terrarium.pollen);
            this.checkInfinity('terrariumFlowers', window.state.terrarium.flowers);
            this.checkInfinity('terrariumNectar', window.state.terrarium.nectar);
        }
        
        // Check charger currency in window.charger
        if (typeof window.charger !== 'undefined' && window.charger.charge) {
            this.checkInfinity('charge', window.charger.charge);
        }
    },
    
    // Apply infinity scaling to currency gains
    applyInfinityScaling: function(currencyName, baseGain) {
        if (!DecimalUtils.isDecimal(baseGain)) {
            baseGain = new Decimal(baseGain);
        }
        
        const multiplier = this.getInfinityMultiplier(currencyName);
        return baseGain.div(multiplier);
    },
    
    // Calculate total amount of currency that has gone to infinity
    getTotalInfinityCurrency: function() {
        // Return the total infinity currency earned from actual infinity resets only
        // Not the sum of individual currency infinity counts
        return this.totalInfinityEarned;
    },
    
    // Calculate infinity currency boost (3x per infinity count for any currency)
    getInfinityCurrencyBoost: function() {
        let totalInfinityCount = 0;
        
        // Sum up all individual currency infinity counts
        for (const currency in this.counts) {
            totalInfinityCount += this.counts[currency];
        }
        
        // Each infinity count provides 3x boost
        if (totalInfinityCount === 0) return new Decimal(1);
        return new Decimal(3).pow(totalInfinityCount);
    },
    
    // Calculate total infinity reached boost (3x per total infinity reached)
    getTotalInfinityReachedBoost: function() {
        // Use totalInfinityEarned which tracks how many times player has done infinity resets
        const totalInfinityReached = this.totalInfinityEarned || 0;
        
        // Each total infinity reached provides 3x boost to all pre-infinity currencies
        if (totalInfinityReached === 0) return new Decimal(1);
        return new Decimal(3).pow(totalInfinityReached);
    },
    
    // Apply total infinity reached boost to currency gain
    applyTotalInfinityReachedBoost: function(baseCurrencyGain) {
        if (!DecimalUtils.isDecimal(baseCurrencyGain)) {
            baseCurrencyGain = new Decimal(baseCurrencyGain);
        }
        
        const boost = this.getTotalInfinityReachedBoost();
        return baseCurrencyGain.mul(boost);
    },
    
    // Get 2∞ benefit boost (3x per total infinity for terrarium XP and box generation)
    getTwoInfinityBenefitBoost: function() {
        const totalInfinityReached = this.totalInfinityEarned || 0;
        
        // Only active if player has 2+ total infinity
        if (totalInfinityReached < 2) return new Decimal(1);
        
        // 3x boost per total infinity reached
        return new Decimal(3).pow(totalInfinityReached);
    },
    
    // Apply 2∞ benefit boost to terrarium XP and box generation
    applyTwoInfinityBenefitBoost: function(baseGain) {
        if (!DecimalUtils.isDecimal(baseGain)) {
            baseGain = new Decimal(baseGain);
        }
        
        const boost = this.getTwoInfinityBenefitBoost();
        return baseGain.mul(boost);
    },
    
    // Calculate infinity points per second
    getInfinityPointsPerSecond: function() {
        const totalInfinity = this.getTotalInfinityCurrency();
        if (totalInfinity === 0) return new Decimal(0);
        
        // 1 total infinity = 1 IP/s
        // Each additional infinity multiplies by 3x
        let rate = new Decimal(1);
        for (let i = 2; i <= totalInfinity; i++) {
            rate = rate.mul(3);
        }
        
        // Apply nectar upgrade 5 effect (Nectar Infinity Points)
        if (typeof window.getNectarInfinityUpgradeEffect === 'function' && 
            typeof window.terrariumNectarInfinityUpgradeLevel === 'number') {
            const nectarInfinityEffect = window.getNectarInfinityUpgradeEffect(window.terrariumNectarInfinityUpgradeLevel);
            if (nectarInfinityEffect && typeof nectarInfinityEffect.toNumber === 'function') {
                rate = rate.mul(nectarInfinityEffect);
            } else if (typeof nectarInfinityEffect === 'number') {
                rate = rate.mul(nectarInfinityEffect);
            }
        }
        
        // Apply nectarize milestone infinity points exponent boost
        if (typeof window.getNectarizeMilestoneBonus === 'function') {
            const milestoneBonus = window.getNectarizeMilestoneBonus();
            if (milestoneBonus.infinityExponent && milestoneBonus.infinityExponent.gt(0)) {
                const exponent = new Decimal(1).add(milestoneBonus.infinityExponent);
                rate = rate.pow(exponent);
            }
        }
        
        return rate;
    },
    
    // Get effective infinity points per second including all buffs
    getEffectiveInfinityPointsPerSecond: function() {
        const baseRate = this.getInfinityPointsPerSecond();
        if (baseRate.lte(0)) return new Decimal(0);
        
        let effectiveRate = baseRate;
        
        // Apply prism core multiplier to infinity points gain
        if (typeof window.getPrismCoreMultiplier === 'function') {
            effectiveRate = effectiveRate.mul(window.getPrismCoreMultiplier());
        }
        
        // Apply infinity currency boost (3x per infinity count)
        const infinityCurrencyBoost = this.getInfinityCurrencyBoost();
        effectiveRate = effectiveRate.mul(infinityCurrencyBoost);
        
        // Apply white stable light buff (exponential)
        if (typeof window.applyWhiteStableLightBuff === 'function') {
            effectiveRate = window.applyWhiteStableLightBuff(effectiveRate);
        }
        
        // Apply anomaly debuff to infinity points gain
        if (typeof window.getAnomalyDebuff === 'function') {
            const anomalyDebuff = window.getAnomalyDebuff();
            effectiveRate = effectiveRate.mul(anomalyDebuff);
        }
        
        return effectiveRate;
    },
    
    // Get current theorem cost
    getCurrentTheoremCost: function() {
        // First theorem costs 10 IP, each subsequent costs 3x more
        // Use totalInfinityTheorems for cost scaling so it doesn't reset when spending theorems
        return Math.pow(3, this.totalInfinityTheorems) * 10;
    },
    
    // Update infinity tree currencies - simplified to use the exact same calculation as display
    updateInfinityTree: function(deltaTime) {
        // Ensure infinityPoints and theoremProgress are Decimal objects
        if (!DecimalUtils.isDecimal(this.infinityPoints)) {
            this.infinityPoints = new Decimal(this.infinityPoints || 0);
        }
        if (!DecimalUtils.isDecimal(this.theoremProgress)) {
            this.theoremProgress = new Decimal(this.theoremProgress || 0);
        }
        
        const effectiveRatePerSecond = this.getEffectiveInfinityPointsPerSecond();
        
        if (effectiveRatePerSecond.gt(0)) {
            const gain = effectiveRatePerSecond.mul(deltaTime);
            
            this.infinityPoints = this.infinityPoints.add(gain);
            this.theoremProgress = this.theoremProgress.add(gain);
        }
        
        // Check for theorem unlock
        const theoremCost = this.getCurrentTheoremCost();
        if (this.theoremProgress.gte(theoremCost)) {
            this.infinityTheorems++;
            this.totalInfinityTheorems++; // Track total earned
            this.theoremProgress = this.theoremProgress.sub(theoremCost);
            
            // Show notification
            if (typeof showNotification === 'function') {
                showNotification('Infinity Theorem Earned!', `You now have ${this.infinityTheorems} Infinity Theorems.`, 'success');
            }
        }
    },
    
    // Get detailed breakdown of infinity counts
    getInfinityBreakdown: function() {
        const breakdown = {};
        let total = 0;
        
        for (const currencyName in this.counts) {
            if (this.counts.hasOwnProperty(currencyName)) {
                const count = this.counts[currencyName] || 0;
                if (count > 0) {
                    breakdown[currencyName] = count;
                }
                total += count;
            }
        }
        
        return {
            total: total,
            currencies: breakdown
        };
    },
    
    // Get the currency with the most infinities
    getMostInfinityCurrency: function() {
        let maxCount = 0;
        let maxCurrency = null;
        
        for (const currencyName in this.counts) {
            if (this.counts.hasOwnProperty(currencyName)) {
                const count = this.counts[currencyName] || 0;
                if (count > maxCount) {
                    maxCount = count;
                    maxCurrency = currencyName;
                }
            }
        }
        
        return maxCurrency ? { currency: maxCurrency, count: maxCount } : null;
    },
    
    // Get KP (swabucks) gain multiplier based on total infinity currency
    getKpInfinityMultiplier: function() {
        // During infinity challenges, don't apply infinity multipliers
        if (typeof window.activeChallenge !== 'undefined' && window.activeChallenge > 0) {
            return new Decimal(1); // No multiplier during challenges
        }
        
        const totalInfinities = this.getTotalInfinityCurrency();
        if (totalInfinities === 0) {
            return new Decimal(1); // No multiplier if no infinities
        }
        
        // Each currency that went infinity multiplies KP gain by 1e8
        const multiplier = new Decimal('1e8').pow(totalInfinities);
        return multiplier;
    },
    
    // Apply infinity KP multiplier to swabucks gain
    applyKpInfinityBuff: function(baseKpGain) {
        if (!DecimalUtils.isDecimal(baseKpGain)) {
            baseKpGain = new Decimal(baseKpGain);
        }
        
        const multiplier = this.getKpInfinityMultiplier();
        return baseKpGain.mul(multiplier);
    },
    
    // === INFINITY RESET SYSTEM ===
    
    // Check how many currencies have reached infinity (available for reset)
    getCurrenciesWithInfinity: function() {
        const currenciesWithInfinity = [];
        
        for (const currencyName in this.counts) {
            if (this.counts.hasOwnProperty(currencyName)) {
                const count = this.counts[currencyName] || 0;
                if (count > 0) {
                    currenciesWithInfinity.push({
                        name: currencyName,
                        count: count
                    });
                }
            }
        }
        
        return currenciesWithInfinity;
    },
    
    // Check if infinity reset is available (at least 1 currency with infinity)
    canInfinityReset: function() {
        const currenciesWithInfinity = this.getCurrenciesWithInfinity();
        return currenciesWithInfinity.length > 0;
    },
    
    // Calculate how much total infinity currency will be gained from reset
    calculateInfinityGain: function() {
        const currenciesWithInfinity = this.getCurrenciesWithInfinity();
        let totalGain = 0;
        
        // Each currency that has reached infinity contributes its count to the total
        for (const currency of currenciesWithInfinity) {
            totalGain += currency.count;
        }
        
        return totalGain;
    },
    
    // Reset challenge state to default
    resetChallengeState: function() {
        if (typeof window.infinityChallenges !== 'undefined') {
            for (const challengeId in window.infinityChallenges) {
                const challenge = window.infinityChallenges[challengeId];
                challenge.currentDifficulty = 1;
                
                // Reset all difficulties except the first one
                for (const diffId in challenge.difficulties) {
                    const diff = challenge.difficulties[diffId];
                    diff.unlocked = (diffId === '1'); // Only first difficulty unlocked
                    diff.completed = false;
                }
            }
        }
    },
    
    // Perform infinity reset
    performInfinityReset: function() {
        if (!this.canInfinityReset()) {
            return false;
        }
        
        // Save infinity reset backup before reset
        if (typeof window.saveInfinityResetBackup === 'function') {
            window.saveInfinityResetBackup();
        }
        
        const infinityGain = this.calculateInfinityGain();
        
        // Set total infinity to the maximum between current total and gain from this reset
        // This means total only increases if this reset gives more than you already have
        const newTotal = Math.max(this.totalInfinityEarned, infinityGain);
        this.totalInfinityEarned = newTotal;
        
        // Reset all currencies and progression
        this.resetAllCurrencies();
        
        // Reset all infinity counts
        this.resetInfinityCounts();
        
        // Force immediate UI updates before showing notification
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof updateInfinityDisplay === 'function') updateInfinityDisplay();
        if (typeof updateUI === 'function') updateUI();
        
        // Show reset notification
        this.showInfinityResetNotification(infinityGain, this.totalInfinityEarned);
        
        // Track the reset if tracking function exists
        if (typeof window.trackInfinityReset === 'function') {
            window.trackInfinityReset(infinityGain, this.totalInfinityEarned);
        }
        
        // Check if this is the first infinity reset and show story modal
        const isFirstInfinityReset = !window.state.seenInfinityResetStory;
        if (isFirstInfinityReset) {
            window.state.pendingInfinityResetStory = true;
            // Save system disabled
        }

        // Check for pending story modals after reset
        setTimeout(() => {
            if (typeof window.checkForPendingStoryModals === 'function') {
                window.checkForPendingStoryModals();
            }
        }, 1000);
        
        return true;
    },
    
    // Reset all currencies to starting values
    resetAllCurrencies: function() {

        
        // === CURRENCY RESET ===
        const one = new Decimal(1);
        const zero = new Decimal(0);
        
        // Elements to keep (7 and 8 like expansion reset)
        const keep = [7, 8];
        
        // Reset main currencies
        if (typeof fluff !== 'undefined') window.fluff = zero;
        if (typeof swariaCoins !== 'undefined') window.swariaCoins = zero;
        if (typeof feathers !== 'undefined') window.feathers = zero;
        if (typeof artifacts !== 'undefined') window.artifacts = zero;
        
        // Reset state currencies
        if (typeof state !== 'undefined') {
            state.fluff = zero;
            state.swaria = zero;
            state.feathers = zero;
            state.artifacts = zero;
            state.fluffInfinityCount = zero;
            state.swariaInfinityCount = zero;
            state.feathersInfinityCount = zero;
            state.artifactsInfinityCount = zero;
        }
        
        // Reset light currencies
        if (typeof light !== 'undefined') window.light = zero;
        if (typeof redLight !== 'undefined') window.redLight = zero;
        if (typeof orangeLight !== 'undefined') window.orangeLight = zero;
        if (typeof yellowLight !== 'undefined') window.yellowLight = zero;
        if (typeof greenLight !== 'undefined') window.greenLight = zero;
        if (typeof blueLight !== 'undefined') window.blueLight = zero;
        
        // Reset prism state
        if (typeof window.prismState !== 'undefined') {
            [
                'light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight',
                'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                'greenlightparticle', 'bluelightparticle'
            ].forEach(key => window.prismState[key] = zero);
            
            window.prismState.generatorUpgrades = {
                light: 0, redlight: 0, orangelight: 0, yellowlight: 0, greenlight: 0, bluelight: 0
            };
            window.prismState.generatorUnlocked = {
                light: false, redlight: false, orangelight: false, yellowlight: false, greenlight: false, bluelight: false
            };
        }
        
        // Reset centralized prism state
        if (typeof window.state !== 'undefined' && window.state.prismState) {
            [
                'light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight',
                'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                'greenlightparticle', 'bluelightparticle'
            ].forEach(key => {
                if (window.state.prismState[key]) {
                    window.state.prismState[key] = zero;
                }
            });
            
            if (window.state.prismState.generatorUpgrades) {
                window.state.prismState.generatorUpgrades = {
                    light: zero, redlight: zero, orangelight: zero, yellowlight: zero, greenlight: zero, bluelight: zero
                };
            }
            if (window.state.prismState.generatorUnlocked) {
                window.state.prismState.generatorUnlocked = {
                    light: false, redlight: false, orangelight: false, yellowlight: false, greenlight: false, bluelight: false
                };
            }
        }
        
        // Reset stable light calibration progress (but preserve prism core level)
        if (typeof window.advancedPrismState !== 'undefined' && window.advancedPrismState.calibration) {
            const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
            
            // Reset all stable light values to 0
            lightTypes.forEach(lightType => {
                window.advancedPrismState.calibration.stable[lightType] = new Decimal(0);
            });
            
            // Initialize nerfs object if it doesn't exist
            if (!window.advancedPrismState.calibration.nerfs) {
                window.advancedPrismState.calibration.nerfs = {};
            }
            
            // Reset all light nerfs back to 1 (no nerf)
            lightTypes.forEach(lightType => {
                window.advancedPrismState.calibration.nerfs[lightType] = new Decimal(1);
            });
            
            // Initialize totalTimeAccumulated object if it doesn't exist
            if (!window.advancedPrismState.calibration.totalTimeAccumulated) {
                window.advancedPrismState.calibration.totalTimeAccumulated = {};
            }
            
            // Reset total time accumulated in minigames
            lightTypes.forEach(lightType => {
                window.advancedPrismState.calibration.totalTimeAccumulated[lightType] = 0;
            });
            
            // Stop any active minigame
            window.advancedPrismState.calibration.activeMinigame = null;
            window.advancedPrismState.calibration.minigameStartTime = 0;

        }
        
        // Reset terrarium currencies
        if (typeof window.terrariumPollen !== 'undefined') window.terrariumPollen = zero;
        if (typeof window.terrariumFlowers !== 'undefined') window.terrariumFlowers = zero;
        if (typeof window.terrariumNectar !== 'undefined') window.terrariumNectar = zero;
        
        // Reset charge
        if (typeof window.charger !== 'undefined' && window.charger.charge) window.charger.charge = zero;
        
        // Reset KP to 1 (not 0 since it's the main progression currency)
        if (typeof window.state !== 'undefined' && window.state.kp) {
            window.state.kp = one;
        }
        // Legacy fallback for old save system
        if (typeof swariaKnowledge !== 'undefined' && swariaKnowledge.kp) {
            swariaKnowledge.kp = one;
        }
        
        // === EXPANSION LEVEL RESET ===
        // Preserve element discovery progress for persistent element visibility
        const preservedElementDiscovery = (typeof state !== 'undefined' && state.elementDiscoveryProgress) 
            ? state.elementDiscoveryProgress 
            : 0;
            
        // Reset expansion grade to 1
        if (typeof state !== 'undefined') {
            state.grade = one;
            // Note: We preserve state.highestGradeReached to maintain nectarize unlock status
            
            // Restore element discovery progress to maintain element visibility across resets
            state.elementDiscoveryProgress = preservedElementDiscovery;
        }
        
        // Update nectarize button visibility (will remain visible if previously unlocked)
        if (typeof window.updateNectarizeButtonVisibility === 'function') {
            window.updateNectarizeButtonVisibility();
        }
        
        // === GENERATOR RESET ===
        // Reset generator upgrades (window.generatorUpgrades is for the box generator upgrades)
        if (typeof window.generatorUpgrades !== 'undefined') {
            window.generatorUpgrades = {
                common: 0, uncommon: 0, rare: 0, legendary: 0, mythic: 0
            };
        }
        
        // Reset generators array (box generators)
        if (typeof window.generators !== 'undefined') {
            window.generators.forEach(gen => {
                gen.progress = 0;
                gen.speedUpgrades = 0;
                gen.speedMultiplier = 1;
                gen.speed = gen.baseSpeed;
                gen.upgrades = 0;
                gen.unlocked = false; // Reset unlock status
            });
        }
        
        // Reset generatorUpgrades global variable if it exists separately
        if (typeof generatorUpgrades !== 'undefined') {
            generatorUpgrades = {
                common: 0, uncommon: 0, rare: 0, legendary: 0, mythic: 0
            };
        }
        
        // === BOX PRODUCTION RESET ===
        if (typeof state !== 'undefined') {
            state.boxesProduced = zero;
            state.boxesProducedByType = {
                common: zero, uncommon: zero, rare: zero, legendary: zero, mythic: zero
            };
        }
        
        // === ELEMENTS RESET (keep only 7 and 8 like expansion reset) ===
        if (typeof boughtElements !== 'undefined') {
            const newBoughtElements = {};
            // Only keep elements 7 and 8
            if (boughtElements[7]) newBoughtElements[7] = true;
            if (boughtElements[8]) newBoughtElements[8] = true;
            
            // Clear all other elements
            for (let key in boughtElements) {
                delete boughtElements[key];
            }
            
            // Restore kept elements
            Object.assign(boughtElements, newBoughtElements);
            
            // Update global reference
            window.boughtElements = boughtElements;
        }
        
        // Also reset global window.boughtElements if it exists separately
        if (typeof window.boughtElements !== 'undefined') {
            const newWindowBoughtElements = {};
            // Only keep elements 7 and 8
            if (window.boughtElements[7]) newWindowBoughtElements[7] = true;
            if (window.boughtElements[8]) newWindowBoughtElements[8] = true;
            
            // Clear all other elements
            for (let key in window.boughtElements) {
                delete window.boughtElements[key];
            }
            
            // Restore kept elements
            Object.assign(window.boughtElements, newWindowBoughtElements);
        }
        
        // === POWER ENERGY RESET ===
        if (typeof state !== 'undefined') {
            // Reset power energy to maximum (like expansion reset)
            if (typeof window.calculatePowerGeneratorCap === 'function') {
                state.powerMaxEnergy = window.calculatePowerGeneratorCap();
                state.powerEnergy = state.powerMaxEnergy;
            }
        }
        
        // === TERRARIUM FULL RESET ===
        this.resetTerrariumForInfinity();
        
        // === CHARGER RESET ===
        this.resetChargerForInfinity();
        
        // === UI UPDATES ===
        // Update various UIs to reflect the reset
        if (typeof updateUI === 'function') updateUI();
        if (typeof updateKnowledgeUI === 'function') updateKnowledgeUI();
        if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
        if (typeof updateDisplay === 'function') updateDisplay();
        if (typeof updateInfinityDisplay === 'function') updateInfinityDisplay();
        

    },
    
    // Reset terrarium content (similar to expansion reset)
    resetTerrariumForInfinity: function() {
        const zero = new Decimal(0);
        
        // Reset terrarium currencies in centralized state
        if (window.state && window.state.terrarium) {
            window.state.terrarium.pollen = zero;
            window.state.terrarium.flowers = zero;
            window.state.terrarium.xp = zero;
            window.state.terrarium.nectar = zero;
            window.state.terrarium.level = 1;
            
            // Reset upgrade levels in centralized state
            window.state.terrarium.flowerFieldExpansionUpgradeLevel = 0;
            window.state.terrarium.pollenValueUpgradeLevel = 0;
            window.state.terrarium.pollenValueUpgrade2Level = 0;
            window.state.terrarium.flowerValueUpgradeLevel = 0;
            window.state.terrarium.xpMultiplierUpgradeLevel = 0;
            window.state.terrarium.pollenFlowerNectarUpgradeLevel = 0;
            window.state.terrarium.terrariumFlowerUpgrade1Level = 0;
            window.state.terrarium.terrariumFlowerUpgrade2Level = 0;
            window.state.terrarium.terrariumFlowerUpgrade3Level = 0;
            window.state.terrarium.terrariumFlowerUpgrade4Level = 0;
            window.state.terrarium.terrariumFlowerUpgrade5Level = 0;
            
            // Reset nectar upgrades in centralized state
            window.state.terrarium.kpNectarUpgradeLevel = 0;
            window.state.terrarium.nectarXpUpgradeLevel = 0;
            window.state.terrarium.nectarValueUpgradeLevel = 0;
            window.state.terrarium.nectarInfinityUpgradeLevel = 0;
            
            // Reset nectarize system in centralized state
            window.state.terrarium.nectarizeTier = 0;
            window.state.terrarium.nectarizeMachineLevel = 1;
            window.state.terrarium.nectarizeResets = 0;
            window.state.terrarium.nectarizeMachineRepaired = true;
            window.state.terrarium.nectarizeQuestActive = false;
            window.state.terrarium.nectarizeQuestProgress = 0;
            window.state.terrarium.nectarizeQuestGivenBattery = 0;
            window.state.terrarium.nectarizeQuestGivenSparks = 0;
            window.state.terrarium.nectarizeQuestGivenPetals = 0;
            window.state.terrarium.nectarizePostResetTokenRequirement = 0;
            window.state.terrarium.nectarizePostResetTokensGiven = 0;
            window.state.terrarium.nectarizePostResetTokenType = 'petals';
            
            // Reset tool states in centralized state
            window.state.terrarium.pollenWandActive = false;
            window.state.terrarium.wateringCanActive = false;
            window.state.terrarium.pollenWandCooldown = false;
            window.state.terrarium.wateringCanCooldown = false;
            window.state.terrarium.fluzzerClickCount = 0;
            
            // Reset flower grid health
            if (window.state.terrarium.flowerGrid) {
                window.state.terrarium.flowerGrid.forEach(flower => {
                    flower.health = 5;
                });
            }
        }
        
        // Reset legacy global variables for backwards compatibility
        if (typeof window.terrariumPollen !== 'undefined') window.terrariumPollen = zero;
        if (typeof window.terrariumFlowers !== 'undefined') window.terrariumFlowers = zero;
        if (typeof window.terrariumXP !== 'undefined') window.terrariumXP = zero;
        if (typeof window.terrariumLevel !== 'undefined') window.terrariumLevel = 1;
        if (typeof window.terrariumNectar !== 'undefined') window.terrariumNectar = 0;
        
        // Reset legacy terrarium upgrades
        if (typeof window.terrariumPollenValueUpgradeLevel !== 'undefined') window.terrariumPollenValueUpgradeLevel = 0;
        if (typeof window.terrariumPollenValueUpgrade2Level !== 'undefined') window.terrariumPollenValueUpgrade2Level = 0;
        if (typeof window.terrariumFlowerValueUpgradeLevel !== 'undefined') window.terrariumFlowerValueUpgradeLevel = 0;
        if (typeof window.terrariumPollenToolSpeedUpgradeLevel !== 'undefined') window.terrariumPollenToolSpeedUpgradeLevel = 0;
        if (typeof window.terrariumFlowerXPUpgradeLevel !== 'undefined') window.terrariumFlowerXPUpgradeLevel = 0;
        if (typeof window.terrariumExtraChargeUpgradeLevel !== 'undefined') window.terrariumExtraChargeUpgradeLevel = 0;
        if (typeof window.terrariumXpMultiplierUpgradeLevel !== 'undefined') window.terrariumXpMultiplierUpgradeLevel = 0;
        if (typeof window.terrariumFlowerFieldExpansionUpgradeLevel !== 'undefined') window.terrariumFlowerFieldExpansionUpgradeLevel = 0;
        if (typeof window.terrariumKpNectarUpgradeLevel !== 'undefined') window.terrariumKpNectarUpgradeLevel = 0;
        if (typeof window.terrariumPollenFlowerNectarUpgradeLevel !== 'undefined') window.terrariumPollenFlowerNectarUpgradeLevel = 0;
        if (typeof window.terrariumNectarXpUpgradeLevel !== 'undefined') window.terrariumNectarXpUpgradeLevel = 0;
        if (typeof window.terrariumNectarValueUpgradeLevel !== 'undefined') window.terrariumNectarValueUpgradeLevel = 0;
        if (typeof window.terrariumFlowerUpgrade4Level !== 'undefined') window.terrariumFlowerUpgrade4Level = 0;
        if (typeof window.terrariumFlowerUpgrade5Level !== 'undefined') window.terrariumFlowerUpgrade5Level = 0;
        if (typeof window.terrariumNectarInfinityUpgradeLevel !== 'undefined') window.terrariumNectarInfinityUpgradeLevel = 0;
        
        // Reset legacy flower grid health
        if (window.terrariumFlowerGrid) {
            window.terrariumFlowerGrid.forEach(flower => {
                flower.health = 5;
            });
        }
        
        // Reset legacy nectarize system
        if (typeof window.nectarizeTier !== 'undefined') window.nectarizeTier = 0;
        if (typeof window.nectarizeResets !== 'undefined') window.nectarizeResets = 0;
        if (typeof window.nectarizeMachineLevel !== 'undefined') window.nectarizeMachineLevel = 1;
        if (typeof window.nectarizeMachineRepaired !== 'undefined') window.nectarizeMachineRepaired = true;
        if (typeof window.nectarizePostResetTokenRequirement !== 'undefined') window.nectarizePostResetTokenRequirement = 0;
        if (typeof window.nectarizePostResetTokensGiven !== 'undefined') window.nectarizePostResetTokensGiven = 0;
        if (typeof window.nectarizePostResetTokenType !== 'undefined') window.nectarizePostResetTokenType = 'petals';
        
        // Reset legacy terrarium tools and states
        if (typeof window.pollenWandActive !== 'undefined') window.pollenWandActive = false;
        if (typeof window.wateringCanActive !== 'undefined') window.wateringCanActive = false;
        if (typeof window.pollenWandCooldown !== 'undefined') window.pollenWandCooldown = false;
        if (typeof window.wateringCanCooldown !== 'undefined') window.wateringCanCooldown = false;
        if (typeof window.fluzzerClickCount !== 'undefined') window.fluzzerClickCount = 0;
        if (typeof window.rustlingFlowerIndices !== 'undefined') window.rustlingFlowerIndices = [];
        if (typeof window.fluzzerHasWelcomed !== 'undefined') window.fluzzerHasWelcomed = false;
        
        // Remove terrarium classes
        document.body.classList.remove('pollen-wand-mode', 'watering-can-mode');
        
        // Stop terrarium functions
        if (typeof window.stopFluzzerAI === 'function') window.stopFluzzerAI();
        if (typeof window.stopFluzzerRandomSpeechTimer === 'function') window.stopFluzzerRandomSpeechTimer();
        if (typeof window.stopFlowerRegrowthTimer === 'function') window.stopFlowerRegrowthTimer();
        
        // Sync global references to centralized state
        if (typeof window.syncGlobalReferencesToState === 'function') {
            window.syncGlobalReferencesToState();
        }
        
        // Update terrarium UI if function exists
        if (typeof window.updateTerrariumDisplay === 'function') {
            window.updateTerrariumDisplay();
        }
        if (typeof window.updateTerrariumUI === 'function') {
            window.updateTerrariumUI();
        }

    },
    
    // Reset charger for infinity
    resetChargerForInfinity: function() {
        if (window.charger) {
            window.charger.charge = new Decimal(0);
            if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
        }

    },
    
    // Reset all infinity counts
    resetInfinityCounts: function() {
        for (const currencyName in this.counts) {
            if (this.counts.hasOwnProperty(currencyName)) {
                this.counts[currencyName] = 0;
            }
        }
        
        // No saving - infinity counts are not persistent
        
        // Reset currency images to normal
        this.resetAllCurrencyImages();
        

    },
    
    // Reset all currency images to normal (non-infinity versions)
    resetAllCurrencyImages: function() {
        const currencyImageMap = {
            'fluff': 'fluff.png',
            'swariaCoins': 'swaria coins.png',
            'feathers': 'feather.png',
            'artifacts': 'wing artifact.png',
            'light': 'light.png',
            'redLight': 'red light.png',
            'orangeLight': 'orange light.png',
            'yellowLight': 'yellow light.png',
            'greenLight': 'green light.png',
            'blueLight': 'blue light.png',
            'terrariumPollen': 'pollen.png',
            'terrariumFlowers': 'flower.png',
            'terrariumNectar': 'nectar.png',
            'charge': 'charge.png'
        };
        
        for (const currencyName in currencyImageMap) {
            const imgElement = document.querySelector(`img[data-currency="${currencyName}"]`);
            if (imgElement) {
                imgElement.src = `assets/icons/${currencyImageMap[currencyName]}`;

            }
        }
    },
    
    // Restore infinity images for currencies that have ever reached infinity
    restoreInfinityImages: function() {
        // Check everReached flags and update images accordingly
        for (const currencyName in this.everReached) {
            if (this.everReached[currencyName]) {
                this.updateCurrencyImage(currencyName);
            }
        }
        
        // Force UI update to ensure images are displayed immediately
        if (typeof updateUI === 'function') {
            updateUI();
        }
    },
    
    // Show infinity reset notification
    showInfinityResetNotification: function(gained, total) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffecd2);
            background-size: 300% 300%;
            animation: infinityGlow 3s ease-in-out;
            color: white;
            font-size: 1.8em;
            font-weight: bold;
            padding: 2em;
            border-radius: 20px;
            box-shadow: 0 0 50px rgba(255, 255, 255, 0.8);
            z-index: 10000;
            text-align: center;
            font-family: 'Orbitron', monospace;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            border: 3px solid rgba(255,255,255,0.8);
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 1em;">∞ INFINITY RESET ∞</div>
            <div style="font-size: 0.8em; margin-bottom: 0.5em;">Gained: +${gained} ∞</div>
            <div style="font-size: 0.7em; color: rgba(255,255,255,0.9);">Total ∞: ${total}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    },

    // === INFINITY NERF SYSTEM ===
    // 
    // FLUFF INFINITY NERF: Applied ONLY to fluff currency
    // - Each fluff infinity divides fluff currency gains by 1.8e308
    // - This creates a massive reduction only for fluff, not other currencies
    // 
    // INDIVIDUAL INFINITY NERFS: Applied only to the specific currency that went to infinity
    // - These are applied independently for each currency type
    // - Creates separate nerf effects for currencies that went to infinity
    //
    
    // Get fluff infinity nerf multiplier (affects fluff currency gains only)
    getFluffInfinityNerf: function() {
        const fluffInfinityCount = this.counts.fluff || 0;
        if (fluffInfinityCount === 0) {
            return new Decimal(1); // No nerf if no fluff infinities
        }
        
        // Each fluff infinity divides main currency gains by 1.8e308
        // This creates a massive reduction that matches the infinity threshold
        const nerfDivisor = new Decimal('1.8e308').pow(fluffInfinityCount);
        const nerfMultiplier = new Decimal(1).div(nerfDivisor);
        return nerfMultiplier;
    },
    
    // Apply fluff infinity nerf to fluff currency gains only
    applyFluffInfinityNerf: function(baseCurrencyGain, currencyType = 'main') {
        if (!DecimalUtils.isDecimal(baseCurrencyGain)) {
            baseCurrencyGain = new Decimal(baseCurrencyGain);
        }
        
        // Only apply fluff infinity nerf to fluff currency
        // EXCLUDE premium currencies like swabucks and other main currencies
        const premiumCurrencies = ['swabucks']; 
        if (premiumCurrencies.includes(currencyType)) {
            // No nerf for premium currencies
            return baseCurrencyGain;
        }
        
        if (currencyType === 'fluff') {
            const nerfMultiplier = this.getFluffInfinityNerf();
            return baseCurrencyGain.mul(nerfMultiplier);
        }
        
        // No fluff infinity nerf for other currency types
        return baseCurrencyGain;
    },
    
    // Get all infinity nerfs for a specific currency type
    getAllInfinityNerfs: function(currencyType) {
        let totalNerf = new Decimal(1);
        
        // EXCLUDE premium currencies from all nerfs
        const premiumCurrencies = ['swabucks'];
        if (premiumCurrencies.includes(currencyType)) {
            return totalNerf; // No nerfs for premium currencies
        }
        
        // Apply fluff infinity nerf ONLY to fluff currency
        if (currencyType === 'fluff') {
            // Fluff infinity nerf only affects fluff currency gains
            totalNerf = totalNerf.mul(this.getFluffInfinityNerf());
        }
        
        // Apply additional individual infinity nerfs on top of the fluff infinity nerf
        if (currencyType === 'swaria') {
            // Apply swaria coin infinity nerf when swaria coins went to infinity
            const swariaInfinityCount = this.counts.swaria || 0;
            if (swariaInfinityCount > 0) {
                const nerfDivisor = new Decimal('1.8e308').pow(swariaInfinityCount);
                const nerfMultiplier = new Decimal(1).div(nerfDivisor);
                totalNerf = totalNerf.mul(nerfMultiplier);
            }
        }
        
        if (currencyType === 'feathers') {
            // Apply feather infinity nerf when feathers went to infinity
            const featherInfinityCount = this.counts.feathers || 0;
            if (featherInfinityCount > 0) {
                const nerfDivisor = new Decimal('1.8e308').pow(featherInfinityCount);
                const nerfMultiplier = new Decimal(1).div(nerfDivisor);
                totalNerf = totalNerf.mul(nerfMultiplier);
            }
        }
        
        if (currencyType === 'artifacts') {
            // Apply artifact infinity nerf when artifacts went to infinity
            const artifactInfinityCount = this.counts.artifacts || 0;
            if (artifactInfinityCount > 0) {
                const nerfDivisor = new Decimal('1.8e308').pow(artifactInfinityCount);
                const nerfMultiplier = new Decimal(1).div(nerfDivisor);
                totalNerf = totalNerf.mul(nerfMultiplier);
            }
        }
        
        // Future nerfs can be added here for other infinity types
        
        return totalNerf;
    },
    
    // Apply all relevant infinity nerfs to currency gain
    applyInfinityNerfs: function(baseCurrencyGain, currencyType) {
        if (!DecimalUtils.isDecimal(baseCurrencyGain)) {
            baseCurrencyGain = new Decimal(baseCurrencyGain);
        }
        
        let finalGain = baseCurrencyGain;
        
        // Apply infinity nerfs (massive /1e308 style nerf)
        const nerfMultiplier = this.getAllInfinityNerfs(currencyType);
        finalGain = finalGain.mul(nerfMultiplier);
        
        // Apply infinity challenge effects
        if (typeof window.infinityChallenges !== 'undefined') {
            // Apply IC:1 effect - cargo currency boost based on KP (use highest completed difficulty)
            const ic1 = window.infinityChallenges[1];
            if (ic1 && ic1.difficulties && (currencyType === 'swabucks' || currencyType === 'main')) {
                let highestCompletedDiff = 0;
                let bestEffect = 0;
                
                // Find highest completed difficulty
                for (let i = 1; i <= ic1.maxDifficulty; i++) {
                    if (ic1.difficulties[i] && ic1.difficulties[i].completed) {
                        highestCompletedDiff = i;
                    }
                }
                
                // Apply effect based on highest completed difficulty
                if (highestCompletedDiff > 0) {
                    if (window.state && window.state.swabucks) {
                        const kpAmount = window.state.swabucks;
                        if (kpAmount.gt(0)) {
                            let challengeBoost = kpAmount; // IC:1-1 base: direct KP multiplier
                            
                            // Apply difficulty multipliers
                            if (highestCompletedDiff >= 2) {
                                // IC:1-2: 500% better = 6x multiplier
                                challengeBoost = challengeBoost.mul(6);
                            }
                            if (highestCompletedDiff >= 3) {
                                // IC:1-3: 10000% better = 101x multiplier
                                challengeBoost = challengeBoost.mul(101);
                            }
                            if (highestCompletedDiff >= 4) {
                                // IC:1-4: 1e8% better = 1e6+1 multiplier
                                challengeBoost = challengeBoost.mul(new Decimal(1e6).add(1));
                            }
                            if (highestCompletedDiff >= 5) {
                                // IC:1-5: 1e30% better = 1e28+1 multiplier
                                challengeBoost = challengeBoost.mul(new Decimal('1e28').add(1));
                            }
                            
                            finalGain = finalGain.mul(challengeBoost);

                        }
                    }
                }
            }
        }
        
        return finalGain;
    }
};

// Expose convenience functions to window for easier access
window.getTotalInfinityReachedBoost = function() {
    return window.infinitySystem.getTotalInfinityReachedBoost();
};

window.applyTotalInfinityReachedBoost = function(baseCurrencyGain) {
    return window.infinitySystem.applyTotalInfinityReachedBoost(baseCurrencyGain);
};

// Global functions for 2∞ benefit (terrarium XP and box generation boost)
window.getTwoInfinityBenefitBoost = function() {
    return window.infinitySystem.getTwoInfinityBenefitBoost();
};

window.applyTwoInfinityBenefitBoost = function(baseGain) {
    return window.infinitySystem.applyTwoInfinityBenefitBoost(baseGain);
};

// Debug function to test 2∞ benefit
window.testTwoInfinityBenefit = function() {
    const totalInfinity = window.infinitySystem.totalInfinityEarned || 0;
    const boost = window.getTwoInfinityBenefitBoost();
    
    console.log(`Total Infinity: ${totalInfinity}`);
    console.log(`2∞ Benefit Active: ${totalInfinity >= 2 ? 'Yes' : 'No'}`);
    console.log(`Boost Multiplier: ${boost.toString()}x`);
    
    // Test with sample values
    const sampleXP = new Decimal(100);
    const sampleBoxes = new Decimal(5);
    
    const boostedXP = window.applyTwoInfinityBenefitBoost(sampleXP);
    const boostedBoxes = window.applyTwoInfinityBenefitBoost(sampleBoxes);
    
    console.log(`Sample: 100 XP → ${boostedXP.toString()} XP`);
    console.log(`Sample: 5 boxes → ${boostedBoxes.toString()} boxes`);
    
    return { totalInfinity, boost: boost.toString(), active: totalInfinity >= 2 };
};

// Add CSS animation for infinity notification
const infinityStyle = document.createElement('style');
infinityStyle.textContent = `
@keyframes infinityGlow {
    0% { 
        background-position: 0% 50%; 
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
    50% { 
        background-position: 100% 50%; 
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 1;
    }
    100% { 
        background-position: 0% 50%; 
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.9;
    }
}
`;
document.head.appendChild(infinityStyle);

// Hook into the main game tick to check for infinity
if (typeof window._originalMainGameTick === 'undefined' && typeof mainGameTick !== 'undefined') {
    window._originalMainGameTick = mainGameTick;
    window.mainGameTick = function() {
        window._originalMainGameTick();
        window.infinitySystem.checkAllCurrencies();
    };
}

// Hook into currency update functions to apply infinity scaling
window.infinitySystem.hookCurrencyUpdates = function() {
    // This will be called when currencies are updated to apply scaling
    // Integration points will be added to specific currency generation functions
};

// Function to test infinity system (for debugging)
function testInfinity(currencyName = 'fluff') {
  if (infinitySystem) {
    infinitySystem.triggerInfinity(currencyName);
  } else {
  }
}

// Test function to set currency to infinity threshold for testing
function testInfinityThreshold(currencyName = 'fluff') {
  const threshold = new Decimal('1.8e308');
  if (currencyName === 'fluff' || currencyName === 'swaria' || currencyName === 'feathers' || currencyName === 'artifacts') {
    window.state[currencyName] = threshold;
  } else if (currencyName === 'light' || currencyName === 'redlight' || currencyName === 'orangelight' || 
             currencyName === 'yellowlight' || currencyName === 'greenlight' || currencyName === 'bluelight') {
    window.state.prismState[currencyName] = threshold;
  } else if (currencyName === 'charge' && window.charger) {
    window.charger.charge = threshold;
  } else if (currencyName === 'terrariumPollen' && window.state.terrarium) {
    window.state.terrarium.pollen = threshold;
  } else if (currencyName === 'terrariumFlowers' && window.state.terrarium) {
    window.state.terrarium.flowers = threshold;
  } else if (currencyName === 'terrariumNectar' && window.state.terrarium) {
    window.state.terrarium.nectar = threshold;
  }
  
  // Force an infinity check
  if (window.infinitySystem && typeof window.infinitySystem.checkAllCurrencies === 'function') {
    window.infinitySystem.checkAllCurrencies();
  }
}

// Make test functions globally accessible
window.testInfinity = testInfinity;
window.testInfinityThreshold = testInfinityThreshold;

// Debug function to check and restore infinity images
window.testInfinityImageRestore = function() {
  
  if (typeof window.infinitySystem.restoreInfinityImages === 'function') {
    window.infinitySystem.restoreInfinityImages();
  } else {
  }
};




// Global function to get total infinity currency (easy access)
function getTotalInfinities() {
  return infinitySystem.getTotalInfinityCurrency();
}

// Global function to get infinity statistics
function getInfinityStats() {
  return infinitySystem.getInfinityBreakdown();
}

// Global function to get current KP infinity multiplier
function getKpInfinityMultiplier() {
  return infinitySystem.getKpInfinityMultiplier();
}

// Global function to apply KP infinity buff to a gain amount
function applyKpInfinityBuff(baseGain) {
  return infinitySystem.applyKpInfinityBuff(baseGain);
}

// Global function to get fluff infinity nerf multiplier
function getFluffInfinityNerf() {
  return infinitySystem.getFluffInfinityNerf();
}

// Global function to apply fluff infinity nerf to currency gain
function applyFluffInfinityNerf(baseGain, currencyType = 'main') {
  return infinitySystem.applyFluffInfinityNerf(baseGain, currencyType);
}

// Global function to apply all infinity nerfs to currency gain
function applyInfinityNerfs(baseGain, currencyType) {
  return infinitySystem.applyInfinityNerfs(baseGain, currencyType);
}

// Global function to get infinity currency boost (3x per infinity count)
function getInfinityCurrencyBoost() {
  return window.infinitySystem.getInfinityCurrencyBoost();
}

// Get Cargo Boost multiplier from infinity upgrades
function getCargoBoostMultiplier() {
  if (!window.infinityUpgrades || typeof window.infinityUpgrades.currency === 'undefined') {
    return 1;
  }
  const level = window.infinityUpgrades.currency || 0;
  if (level === 0) return 1;
  
  // ^0.05 per level
  const boost = level * 0.05;
  return Math.pow(1, boost); // This will be applied as an exponent later
}

// Get Lab Boost multiplier from infinity upgrades  
function getLabBoostMultiplier() {
  if (!window.infinityUpgrades || typeof window.infinityUpgrades.generator === 'undefined') {
    return 1;
  }
  const level = window.infinityUpgrades.generator || 0;
  if (level === 0) return 1;
  
  // ^0.05 per level
  const boost = level * 0.05;
  return Math.pow(1, boost); // This will be applied as an exponent later
}

// Get Cargo Boost exponent from infinity upgrades
function getCargoBoostExponent() {
  let exponent = 0;
  
  // Add infinity upgrade boost
  if (window.infinityUpgrades && typeof window.infinityUpgrades.currency !== 'undefined') {
    const level = window.infinityUpgrades.currency || 0;
    exponent += level * 0.05; // ^0.05 per level
  }
  
  // Add nectarize milestone boost
  if (typeof window.getNectarizeMilestoneBonus === 'function') {
    const milestoneBonus = window.getNectarizeMilestoneBonus();
    if (milestoneBonus.cargoExponent) {
      exponent += milestoneBonus.cargoExponent.toNumber();
    }
  }
  
  return exponent;
}

// Get Lab Boost exponent from infinity upgrades
function getLabBoostExponent() {
  let exponent = 0;
  
  // Add infinity upgrade boost
  if (window.infinityUpgrades && typeof window.infinityUpgrades.generator !== 'undefined') {
    const level = window.infinityUpgrades.generator || 0;
    exponent += level * 0.05; // ^0.05 per level
  }
  
  // Add nectarize milestone boost
  if (typeof window.getNectarizeMilestoneBonus === 'function') {
    const milestoneBonus = window.getNectarizeMilestoneBonus();
    if (milestoneBonus.labExponent) {
      exponent += milestoneBonus.labExponent.toNumber();
    }
  }
  
  return exponent;
}

// Apply Cargo Boost to currency amount
function applyCargoBoost(amount, currencyName) {
  const cargoCurrencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
  if (!cargoCurrencies.includes(currencyName)) {
    return amount;
  }
  
  if (!DecimalUtils.isDecimal(amount)) {
    amount = new Decimal(amount);
  }
  
  const exponent = getCargoBoostExponent();
  if (exponent > 0) {
    // Apply as ^(1 + exponent) boost
    return amount.pow(1 + exponent);
  }
  
  return amount;
}

// Apply Lab Boost to currency amount
function applyLabBoost(amount, currencyName) {
  const labCurrencies = ['light', 'redLight', 'orangeLight', 'yellowLight', 'greenLight', 'blueLight'];
  if (!labCurrencies.includes(currencyName)) {
    return amount;
  }
  
  if (!DecimalUtils.isDecimal(amount)) {
    amount = new Decimal(amount);
  }
  
  const exponent = getLabBoostExponent();
  if (exponent > 0) {
    // For light currencies, use multiplicative boost instead of power boost
    // This makes the boost more meaningful for small amounts like individual tile clicks
    const multiplier = 1 + exponent;
    return amount.mul(multiplier);
  }
  
  return amount;
}

// Test function to demonstrate fluff infinity nerf
function testFluffInfinityNerf() {

  
  const originalGain = new Decimal(1000);

  
  // Show current fluff infinity count
  const fluffCount = infinitySystem.counts.fluff || 0;

  
  if (fluffCount === 0) {

    infinitySystem.triggerInfinity('fluff');
  }
  
  // Show nerf effect
  const nerfedGain = infinitySystem.applyInfinityNerfs(originalGain, 'main');
  const nerfMultiplier = infinitySystem.getFluffInfinityNerf();
  



}

// Test function specifically for swabucks protection
function testSwabucksProtection() {

  
  const testAmount = new Decimal(1000);

  
  // Test different currency types
  const fluffResult = infinitySystem.applyInfinityNerfs(testAmount, 'fluff');
  const swabucksResult = infinitySystem.applyInfinityNerfs(testAmount, 'swabucks');
  const feathersResult = infinitySystem.applyInfinityNerfs(testAmount, 'feathers');
  



  
  if (swabucksResult.eq(testAmount)) {

  } else {

  }
}

// === INFINITY UPGRADE SYSTEM ===

// Track infinity upgrade levels
window.infinityUpgrades = {
    // Tier 1
    multiplier: 0,
    
    // Tier 2
    currency: 0,
    generator: 0,
    
    // Tier 3
    infinity: 0,
    automation: 0,
    expansion: 0,
    
    // Tier 4
    ultimate: 0,
    transcendent: 0,
    
    // Tier 5 - New specialist upgrades
    dimensional: 0,
    temporal: 0,
    quantum: 0,
    
    // Tier 6 - New master upgrades
    singularity: 0,
    omnipotent: 0,
    
    // Tier 7 - New legendary upgrades
    cosmic: 0,
    eternal: 0,
    beyond: 0,
    
    // Tier 8 - Primordial upgrades
    genesis: 0,
    void: 0,
    multiverse: 0,
    nexus: 0,
    
    // Tier 9 - Omniversal upgrades
    alpha: 0,
    omega: 0,
    delta: 0,
    sigma: 0,
    theta: 0,
    lambda: 0,
    phi: 0,
    psi: 0,
    
    // Tier 10 - The Ultimate
    godhood: 0
};

// Tier mapping for unlock requirements
window.infinityTierMapping = {
    1: ['swalementDiscovery'],
    2: ['currency', 'generator'], 
    3: ['infinity', 'automation', 'expansion'],
    4: ['ultimate', 'transcendent'],
    5: ['dimensional', 'temporal', 'quantum'],
    6: ['singularity', 'omnipotent'],
    7: ['cosmic', 'eternal', 'beyond'],
    8: ['genesis', 'void', 'multiverse', 'nexus'],
    9: ['alpha', 'omega', 'delta', 'sigma', 'theta', 'lambda', 'phi', 'psi'],
    10: ['godhood']
};

// Check if tier is unlocked (1 upgrade for tier 2, 75% for other tiers)
window.isInfinityTierUnlocked = function(tier) {
    if (tier <= 1) return true; // Tier 1 is always unlocked
    
    const previousTier = tier - 1;
    const previousTierUpgrades = window.infinityTierMapping[previousTier];
    
    if (!previousTierUpgrades) return false;
    
    // Special case for tier 2: only requires 1 upgrade from tier 1
    if (tier === 2) {
        // Check if any upgrade from tier 1 has at least 1 level
        for (const upgradeName of previousTierUpgrades) {
            const currentLevel = window.infinityUpgrades[upgradeName] || 0;
            if (currentLevel >= 1) {
                return true;
            }
        }
        return false;
    }
    
    // For other tiers, use the original 75% requirement
    // Calculate total possible levels and required levels for the entire tier
    let totalPossibleLevels = 0;
    let currentTotalLevels = 0;
    
    for (const upgradeName of previousTierUpgrades) {
        const maxLevel = window.infinityUpgradeData[upgradeName]?.maxLevel || 0;
        const currentLevel = window.infinityUpgrades[upgradeName] || 0;
        
        totalPossibleLevels += maxLevel;
        currentTotalLevels += currentLevel;
    }
    
    if (totalPossibleLevels === 0) return false;
    
    const progressPercentage = currentTotalLevels / totalPossibleLevels;
    return progressPercentage >= 0.75; // 75% requirement for tiers 3+
};

// Get tier of an upgrade
window.getUpgradeTier = function(upgradeName) {
    for (const [tier, upgrades] of Object.entries(window.infinityTierMapping)) {
        if (upgrades.includes(upgradeName)) {
            return parseInt(tier);
        }
    }
    return 1; // Default to tier 1 if not found
};

// Upgrade definitions with costs, max levels, and effects
window.infinityUpgradeData = {
    // Tier 1
    swalementDiscovery: {
        maxLevel: 94,
        baseCost: 1,
        costMultiplier: 10,
        description: "Reveals the next swalement in the table",
        effect: (level) => {
            // This upgrade reveals elements beyond the normal expansion limit
            // Each level unlocks 1 additional element beyond what's normally available
            return level;
        }
    },
    
    // Tier 2
    currency: {
        maxLevel: 5,
        baseCost: 2,
        costMultiplier: 3,
        description: "Boosts all cargo currencies (fluff, swaria, feathers, artifacts)",
        effect: (level) => level * 0.05 // ^0.05 per level
    },
    generator: {
        maxLevel: 5,
        baseCost: 2,
        costMultiplier: 3,
        description: "Boosts all lab currencies (light, redLight, orangeLight, etc.)",
        effect: (level) => level * 0.05 // ^0.05 per level
    },
    
    // Tier 3
    infinity: {
        maxLevel: 5,
        baseCost: 4,
        costMultiplier: 4,
        description: "Reduces infinity nerf penalties",
        effect: (level) => new Decimal(0.5).pow(level)
    },
    automation: {
        maxLevel: 5,
        baseCost: 4,
        costMultiplier: 4,
        description: "Automates various game functions",
        effect: (level) => level
    },
    expansion: {
        maxLevel: 5,
        baseCost: 4,
        costMultiplier: 4,
        description: "Boosts expansion-related mechanics",
        effect: (level) => new Decimal(10).pow(level)
    },
    
    // Tier 4
    ultimate: {
        maxLevel: 10,
        baseCost: 8,
        costMultiplier: 5,
        description: "Ultimate power boost to everything",
        effect: (level) => new Decimal(25).pow(level)
    },
    transcendent: {
        maxLevel: 10,
        baseCost: 8,
        costMultiplier: 5,
        description: "Transcends normal limits",
        effect: (level) => new Decimal(100).pow(level)
    },
    
    // Tier 5 - Specialist upgrades
    dimensional: {
        maxLevel: 5,
        baseCost: 15,
        costMultiplier: 8,
        description: "Shifts currencies into higher dimensions, multiplying their effectiveness exponentially",
        effect: (level) => new Decimal('1e10').pow(level)
    },
    temporal: {
        maxLevel: 5,
        baseCost: 15,
        costMultiplier: 8,
        description: "Dilates time to accelerate all production rates dramatically",
        effect: (level) => new Decimal('1e8').pow(level)
    },
    quantum: {
        maxLevel: 5,
        baseCost: 15,
        costMultiplier: 8,
        description: "Quantum tunneling allows resources to bypass normal production limits",
        effect: (level) => new Decimal('1e12').pow(level)
    },
    
    // Tier 6 - Master upgrades
    singularity: {
        maxLevel: 3,
        baseCost: 30,
        costMultiplier: 15,
        description: "Creates a singularity that warps space-time, massively amplifying all gains",
        effect: (level) => new Decimal('1e25').pow(level)
    },
    omnipotent: {
        maxLevel: 3,
        baseCost: 30,
        costMultiplier: 15,
        description: "Omnipotent force multiplies all effects by astronomical amounts",
        effect: (level) => new Decimal('1e50').pow(level)
    },
    
    // Tier 7 - Legendary upgrades
    cosmic: {
        maxLevel: 3,
        baseCost: 50,
        costMultiplier: 1,
        description: "Ascend to cosmic levels, multiplying everything by universal constants",
        effect: (level) => level > 0 ? new Decimal('1e100').pow(level) : new Decimal(1)
    },
    eternal: {
        maxLevel: 3,
        baseCost: 100,
        costMultiplier: 1,
        description: "Eternal infinity breaks the boundaries of mathematical limits",
        effect: (level) => level > 0 ? new Decimal('1e308').pow(level) : new Decimal(1)
    },
    beyond: {
        maxLevel: 3,
        baseCost: 250,
        costMultiplier: 1,
        description: "Beyond existence itself - transcends all known reality",
        effect: (level) => level > 0 ? new Decimal('1e1000').pow(level) : new Decimal(1)
    },
    
    // Tier 8 - Primordial upgrades
    genesis: {
        maxLevel: 5,
        baseCost: 500,
        costMultiplier: 1,
        description: "Genesis power creates reality from nothingness, multiplying all gains by conceptual infinity",
        effect: (level) => level > 0 ? new Decimal('1e3000').pow(level) : new Decimal(1)
    },
    void: {
        maxLevel: 5,
        baseCost: 500,
        costMultiplier: 1,
        description: "Void mastery harnesses the power of absolute nothingness to amplify everything",
        effect: (level) => level > 0 ? new Decimal('1e2500').pow(level) : new Decimal(1)
    },
    multiverse: {
        maxLevel: 5,
        baseCost: 500,
        costMultiplier: 1,
        description: "Multiverse dominion spans infinite parallel realities, each contributing to your power",
        effect: (level) => level > 0 ? new Decimal('1e4000').pow(level) : new Decimal(1)
    },
    nexus: {
        maxLevel: 5,
        baseCost: 500,
        costMultiplier: 1,
        description: "Reality Nexus connects all possible existences into a single point of infinite power",
        effect: (level) => level > 0 ? new Decimal('1e3500').pow(level) : new Decimal(1)
    },
    
    // Tier 9 - Omniversal upgrades (Greek letters representing fundamental forces)
    alpha: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Alpha Force - The beginning of all mathematics, infinite potential unleashed",
        effect: (level) => level > 0 ? new Decimal('1e10000') : new Decimal(1)
    },
    omega: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Omega Force - The end of all limitations, final mathematical transcendence",
        effect: (level) => level > 0 ? new Decimal('1e12000') : new Decimal(1)
    },
    delta: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Delta Force - Change incarnate, transformation beyond comprehension",
        effect: (level) => level > 0 ? new Decimal('1e8000') : new Decimal(1)
    },
    sigma: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Sigma Force - Summation of all possibilities across infinite dimensions",
        effect: (level) => level > 0 ? new Decimal('1e9000') : new Decimal(1)
    },
    theta: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Theta Force - Angular perfection, geometric harmony of existence",
        effect: (level) => level > 0 ? new Decimal('1e7500') : new Decimal(1)
    },
    lambda: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Lambda Force - Wavelength of existence, resonance with all realities",
        effect: (level) => level > 0 ? new Decimal('1e8500') : new Decimal(1)
    },
    phi: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Phi Force - Golden ratio perfection, divine proportion manifest",
        effect: (level) => level > 0 ? new Decimal('1e11000') : new Decimal(1)
    },
    psi: {
        maxLevel: 1,
        baseCost: 1000,
        costMultiplier: 1,
        description: "Psi Force - Quantum consciousness, awareness beyond physical limits",
        effect: (level) => level > 0 ? new Decimal('1e9500') : new Decimal(1)
    },
    
    // Tier 10 - The Ultimate
    godhood: {
        maxLevel: 1,
        baseCost: 10000,
        costMultiplier: 1,
        description: "GODHOOD - Transcend beyond all mathematical and conceptual limitations. The final ascension beyond infinity itself.",
        effect: (level) => level > 0 ? new Decimal('1e100000') : new Decimal(1)
    }
};

// Get upgrade cost
window.getInfinityUpgradeCost = function(upgradeName) {
    const upgradeData = window.infinityUpgradeData[upgradeName];
    const currentLevel = window.infinityUpgrades[upgradeName] || 0;
    
    if (!upgradeData || currentLevel >= upgradeData.maxLevel) {
        return Infinity; // Max level reached
    }
    
    return Math.floor(upgradeData.baseCost * Math.pow(upgradeData.costMultiplier, currentLevel));
};

// Check if upgrade is affordable
window.canBuyInfinityUpgrade = function(upgradeName) {
    const cost = window.getInfinityUpgradeCost(upgradeName);
    const currentLevel = window.infinityUpgrades[upgradeName] || 0;
    const maxLevel = window.infinityUpgradeData[upgradeName]?.maxLevel || 0;
    const upgradeTier = window.getUpgradeTier(upgradeName);
    
    return (
        cost !== Infinity && 
        window.infinitySystem.infinityTheorems >= cost && 
        currentLevel < maxLevel &&
        window.isInfinityTierUnlocked(upgradeTier)
    );
};

// Buy infinity upgrade
window.buyInfinityUpgrade = function(upgradeName) {
    if (!window.canBuyInfinityUpgrade(upgradeName)) {
        return false;
    }
    
    const cost = window.getInfinityUpgradeCost(upgradeName);
    
    // Deduct cost
    window.infinitySystem.infinityTheorems -= cost;
    
    // Increase upgrade level
    window.infinityUpgrades[upgradeName] = (window.infinityUpgrades[upgradeName] || 0) + 1;
    
    // Show notification
    const upgradeData = window.infinityUpgradeData[upgradeName];
    const newLevel = window.infinityUpgrades[upgradeName];
    
    // No notifications - user requested them disabled
    
    // Special handling for swalement discovery upgrade
    if (upgradeName === 'swalementDiscovery') {
        applySwalementDiscoveryEffect();
    }

    // Save the game after purchasing upgrade
    if (typeof saveGame === 'function') {
        saveGame();
    }

    return true;
};

// Apply swalement discovery effect - unlocks additional elements
function applySwalementDiscoveryEffect() {
    // Update permanent element discovery when infinity upgrade changes
    if (typeof window.updatePermanentElementDiscovery === 'function') {
        window.updatePermanentElementDiscovery();
    }
    
    if (typeof window.applyElementVisibilityFilter === 'function') {
        // Refresh element visibility to show newly unlocked elements
        window.applyElementVisibilityFilter();
    }
    
    // Update UI to show newly available elements
    if (typeof window.updateUI === 'function') {
        window.updateUI();
    }
}

// Get maximum elements available including infinity upgrade bonus
function getMaxElementsWithInfinityBonus() {
    // Use the new permanent element discovery system
    if (typeof window.getPermanentlyAvailableElements === 'function') {
        return window.getPermanentlyAvailableElements();
    }
    
    // Fallback to old system if permanent system not available
    let baseMax = 0;
    
    // Get base maximum from expansion level
    if (typeof window.getMaxUnlockedElements === 'function') {
        baseMax = window.getMaxUnlockedElements();
    } else if (window.state && window.state.grade) {
        // Fallback calculation if function doesn't exist
        const grade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : window.state.grade;
        if (grade >= 8) {
            baseMax = 118; // All elements unlocked at grade 8+
        } else if (grade >= 7) {
            baseMax = 24;
        } else if (grade >= 6) {
            baseMax = 23;
        } else if (grade >= 5) {
            baseMax = 19;
        } else if (grade >= 4) {
            baseMax = 16;
        } else if (grade >= 3) {
            baseMax = 14;
        } else if (grade >= 2) {
            baseMax = 10;
        } else {
            baseMax = 8;
        }
    }
    
    // Add bonus from infinity upgrade
    const swalementLevel = window.infinityUpgrades.swalementDiscovery || 0;
    const maxWithBonus = Math.min(118, baseMax + swalementLevel);
    
    return maxWithBonus;
}

// Make functions available globally
window.applySwalementDiscoveryEffect = applySwalementDiscoveryEffect;
window.getMaxElementsWithInfinityBonus = getMaxElementsWithInfinityBonus;

// Get upgrade effect multiplier
window.getInfinityUpgradeEffect = function(upgradeName) {
    const upgradeData = window.infinityUpgradeData[upgradeName];
    const level = window.infinityUpgrades[upgradeName] || 0;
    
    if (!upgradeData || level === 0) {
        return new Decimal(1);
    }
    
    return upgradeData.effect(level);
};

// Apply all relevant infinity upgrades to a value
window.applyInfinityUpgrades = function(baseValue, upgradeTypes = ['all']) {
    if (!DecimalUtils.isDecimal(baseValue)) {
        baseValue = new Decimal(baseValue);
    }
    
    let result = baseValue;
    
    // Apply upgrades based on types
    if (upgradeTypes.includes('all') || upgradeTypes.includes('multiplier')) {
        result = result.mul(window.getInfinityUpgradeEffect('multiplier'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('currency')) {
        result = result.mul(window.getInfinityUpgradeEffect('currency'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('generator')) {
        result = result.mul(window.getInfinityUpgradeEffect('generator'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('ultimate')) {
        result = result.mul(window.getInfinityUpgradeEffect('ultimate'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('transcendent')) {
        result = result.mul(window.getInfinityUpgradeEffect('transcendent'));
    }
    
    // Apply tier 5 upgrades
    if (upgradeTypes.includes('all') || upgradeTypes.includes('dimensional')) {
        result = result.mul(window.getInfinityUpgradeEffect('dimensional'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('temporal')) {
        result = result.mul(window.getInfinityUpgradeEffect('temporal'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('quantum')) {
        result = result.mul(window.getInfinityUpgradeEffect('quantum'));
    }
    
    // Apply tier 6 upgrades
    if (upgradeTypes.includes('all') || upgradeTypes.includes('singularity')) {
        result = result.mul(window.getInfinityUpgradeEffect('singularity'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('omnipotent')) {
        result = result.mul(window.getInfinityUpgradeEffect('omnipotent'));
    }
    
    // Apply tier 7 upgrades
    if (upgradeTypes.includes('all') || upgradeTypes.includes('cosmic')) {
        result = result.mul(window.getInfinityUpgradeEffect('cosmic'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('eternal')) {
        result = result.mul(window.getInfinityUpgradeEffect('eternal'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('beyond')) {
        result = result.mul(window.getInfinityUpgradeEffect('beyond'));
    }
    
    // Apply tier 8 upgrades
    if (upgradeTypes.includes('all') || upgradeTypes.includes('genesis')) {
        result = result.mul(window.getInfinityUpgradeEffect('genesis'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('void')) {
        result = result.mul(window.getInfinityUpgradeEffect('void'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('multiverse')) {
        result = result.mul(window.getInfinityUpgradeEffect('multiverse'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('nexus')) {
        result = result.mul(window.getInfinityUpgradeEffect('nexus'));
    }
    
    // Apply tier 9 upgrades
    if (upgradeTypes.includes('all') || upgradeTypes.includes('alpha')) {
        result = result.mul(window.getInfinityUpgradeEffect('alpha'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('omega')) {
        result = result.mul(window.getInfinityUpgradeEffect('omega'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('delta')) {
        result = result.mul(window.getInfinityUpgradeEffect('delta'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('sigma')) {
        result = result.mul(window.getInfinityUpgradeEffect('sigma'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('theta')) {
        result = result.mul(window.getInfinityUpgradeEffect('theta'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('lambda')) {
        result = result.mul(window.getInfinityUpgradeEffect('lambda'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('phi')) {
        result = result.mul(window.getInfinityUpgradeEffect('phi'));
    }
    
    if (upgradeTypes.includes('all') || upgradeTypes.includes('psi')) {
        result = result.mul(window.getInfinityUpgradeEffect('psi'));
    }
    
    // Apply tier 10 upgrade - THE ULTIMATE
    if (upgradeTypes.includes('all') || upgradeTypes.includes('godhood')) {
        result = result.mul(window.getInfinityUpgradeEffect('godhood'));
    }
    
    return result;
};

// Update infinity upgrade tree UI
window.updateInfinityUpgradeTree = function(force = false) {
    // Throttle updates to prevent performance issues
    const now = Date.now();
    if (!force && now - lastInfinityTreeUpdateTime < INFINITY_TREE_UPDATE_THROTTLE) {
        return;
    }
    lastInfinityTreeUpdateTime = now;
    
    const upgradeNames = Object.keys(window.infinityUpgradeData);
    
    // Update tier separators first
    for (let tier = 2; tier <= 10; tier++) {
        const separatorElement = document.querySelector(`.tier-separator[data-tier="${tier}"]`);
        if (separatorElement) {
            const previousTier = tier - 1;
            const prevTierUpgrades = window.infinityTierMapping[previousTier];
            const isUnlocked = window.isInfinityTierUnlocked(tier);
            
            if (prevTierUpgrades) {
                let totalPossibleLevels = 0;
                let currentTotalLevels = 0;
                
                for (const upgradeName of prevTierUpgrades) {
                    const maxLevel = window.infinityUpgradeData[upgradeName]?.maxLevel || 0;
                    const currentLevel = window.infinityUpgrades[upgradeName] || 0;
                    totalPossibleLevels += maxLevel;
                    currentTotalLevels += currentLevel;
                }
                
                // Special case for tier 2: only requires 1 level from tier 1
                let requiredLevels;
                if (tier === 2) {
                    requiredLevels = 1;
                } else {
                    requiredLevels = Math.ceil(totalPossibleLevels * 0.75);
                }
                
                // Update progress display
                const progressElement = separatorElement.querySelector('.requirement-progress');
                if (progressElement) {
                    progressElement.textContent = `${currentTotalLevels}/${requiredLevels}`;
                }
                
                // Update status
                const statusElement = separatorElement.querySelector('.tier-status');
                if (statusElement) {
                    statusElement.textContent = isUnlocked ? 'UNLOCKED' : 'LOCKED';
                }
                
                // Update visual state
                separatorElement.setAttribute('data-unlocked', isUnlocked.toString());
            }
        }
    }
    
    // Update individual upgrades
    upgradeNames.forEach(upgradeName => {
        const upgradeElement = document.getElementById(`upgrade-${upgradeName}`);
        if (!upgradeElement) return;
        
        const upgradeData = window.infinityUpgradeData[upgradeName];
        const currentLevel = window.infinityUpgrades[upgradeName] || 0;
        const cost = window.getInfinityUpgradeCost(upgradeName);
        const upgradeTier = window.getUpgradeTier(upgradeName);
        const isTierUnlocked = window.isInfinityTierUnlocked(upgradeTier);
        const isAffordable = window.canBuyInfinityUpgrade(upgradeName);
        const isMaxed = currentLevel >= upgradeData.maxLevel;
        
        // Update level display
        const levelElement = upgradeElement.querySelector('.level-value');
        if (levelElement) {
            levelElement.textContent = currentLevel;
        }
        
        // Update cost display (no more locked text here)
        const costElement = upgradeElement.querySelector('.cost-value');
        if (costElement) {
            if (isMaxed) {
                costElement.textContent = 'MAXED';
            } else {
                costElement.textContent = cost;
            }
        }
        
        // Update classes for styling
        upgradeElement.classList.remove('affordable', 'maxed', 'locked');
        if (!isTierUnlocked) {
            upgradeElement.classList.add('locked');
        } else if (isMaxed) {
            upgradeElement.classList.add('maxed');
        } else if (isAffordable) {
            upgradeElement.classList.add('affordable');
        }
        
        // Add click handler only if not already added
        if (!upgradeElement.hasAttribute('data-click-handler-added')) {
            upgradeElement.onclick = () => {
                if (window.buyInfinityUpgrade(upgradeName)) {
                    window.updateInfinityUpgradeTree(true); // Force immediate update
                    window.updateInfinityShopInfo(true); // Force immediate update
                }
            };
            upgradeElement.setAttribute('data-click-handler-added', 'true');
        }
    });
};

// Get total infinity upgrade multiplier for display
window.getTotalInfinityUpgradeMultiplier = function() {
    return window.applyInfinityUpgrades(new Decimal(1));
};

// Debug function to show upgrade effects
function debugInfinityUpgrades() {

    
    const totalMultiplier = window.getTotalInfinityUpgradeMultiplier();

    
    Object.keys(window.infinityUpgradeData).forEach(upgradeName => {
        const level = window.infinityUpgrades[upgradeName] || 0;
        const effect = window.getInfinityUpgradeEffect(upgradeName);
        const cost = window.getInfinityUpgradeCost(upgradeName);
        

    });
}

// Test function to give infinity theorems for testing
function giveInfinityTheorems(amount = 1000) {
    window.infinitySystem.infinityTheorems += amount;

    
    // Update UI if function exists - force immediate update for test function
    if (typeof window.updateInfinityShopInfo === 'function') {
        window.updateInfinityShopInfo(true);
    }
    if (typeof window.updateInfinityUpgradeTree === 'function') {
        window.updateInfinityUpgradeTree(true);
    }
}

// Force infinity reset for testing (bypasses all requirements)
function forceInfinityReset() {


    // Debug window.state



    // Calculate what the gain would be if we had proper infinities
    let mockInfinityGain = 1; // Minimum gain for testing
    
    // If we actually have some infinities, calculate normally
    const totalInfinities = window.infinitySystem.getTotalInfinityCurrency();
    if (totalInfinities > 0) {
        mockInfinityGain = window.infinitySystem.calculateInfinityGain();
    }


    // Store the gain
    const currentTotal = window.infinitySystem.totalInfinityEarned;
    const newTotal = Math.max(currentTotal, mockInfinityGain);
    window.infinitySystem.totalInfinityEarned = newTotal;
    
    // Check if this is the first infinity reset and show story modal
    if (!window.state) {

        return false;
    }
    
    const isFirstInfinityReset = !window.state.seenInfinityResetStory;

    if (isFirstInfinityReset) {
        window.state.pendingInfinityResetStory = true;


        if (typeof saveGame === 'function') {
            saveGame();

        }

    }
    
    // Reset challenge state if any
    window.infinitySystem.resetChallengeState();
    
    // Reset all currencies
    window.infinitySystem.resetAllCurrencies();
    
    // Reset terrarium
    window.infinitySystem.resetTerrariumForInfinity();
    
    // Reset charger
    window.infinitySystem.resetChargerForInfinity();
    
    // Reset infinity counts
    window.infinitySystem.resetInfinityCounts();
    
    // Reset currency images
    window.infinitySystem.resetAllCurrencyImages();
    
    // Show notification
    window.infinitySystem.showInfinityResetNotification(mockInfinityGain, newTotal);



    // Reload page after 4 seconds like normal reset
    setTimeout(() => {
        location.reload();
    }, 4000);
    
    return true;
}

// Quick force reset with custom infinity gain
function forceInfinityResetWithGain(infinityGain = 1) {

    // Store the gain
    const currentTotal = window.infinitySystem.totalInfinityEarned;
    const newTotal = currentTotal + infinityGain;
    window.infinitySystem.totalInfinityEarned = newTotal;
    
    // Check if this is the first infinity reset and show story modal
    const isFirstInfinityReset = !window.state.seenInfinityResetStory;
    if (isFirstInfinityReset) {
        window.state.pendingInfinityResetStory = true;
        // Save system disabled

    }
    
    // Reset everything
    window.infinitySystem.resetChallengeState();
    window.infinitySystem.resetAllCurrencies();
    window.infinitySystem.resetTerrariumForInfinity();
    window.infinitySystem.resetChargerForInfinity();
    window.infinitySystem.resetInfinityCounts();
    window.infinitySystem.resetAllCurrencyImages();
    
    // Show notification
    window.infinitySystem.showInfinityResetNotification(infinityGain, newTotal);




    setTimeout(() => {
        location.reload();
    }, 4000);
    
    return true;
}

// Debug function to check infinity reset story status
function debugInfinityResetStory() {






    // Test the story modal function directly
    if (typeof window.showInfinityResetStoryModal === 'function') {

        window.showInfinityResetStoryModal();
    } else {

    }
}

// Force set pending story for testing
function forceSetPendingInfinityStory() {
    if (!window.state) {

        return;
    }
    
    window.state.seenInfinityResetStory = false;
    window.state.pendingInfinityResetStory = true;

    if (typeof saveGame === 'function') {
        saveGame();

    }
    
    // Try to trigger the check manually
    if (typeof checkForPendingStoryModals === 'function') {

        checkForPendingStoryModals();
    } else {

    }
}

// Reset infinity story flags for testing first infinity reset
function resetInfinityStoryFlags() {




    if (!window.state) {

        return;
    }
    
    // Reset both flags
    window.state.seenInfinityResetStory = false;
    window.state.pendingInfinityResetStory = false;
    
    // Also reset total infinity earned to simulate true first reset
    if (window.infinitySystem) {
        window.infinitySystem.totalInfinityEarned = 0;
    }




    if (typeof saveGame === 'function') {
        saveGame();

    }

}

// Debug what happens during page load and story modal checking
function debugPageLoadStoryCheck() {




    // Check if the function exists and manually call it
    if (typeof checkForPendingStoryModals === 'function') {

        checkForPendingStoryModals();
    } else {

    }
    
    // Also check the story modal function
    if (typeof window.showInfinityResetStoryModal === 'function') {

    } else {

    }
}

// Force trigger the story modal check (simulate what should happen after reload)
function forceTriggerStoryModalCheck() {

    // First set up the conditions manually
    if (window.state) {
        window.state.pendingInfinityResetStory = true;
        window.state.seenInfinityResetStory = false;
    }



    // Now manually call the check function
    if (typeof checkForPendingStoryModals === 'function') {

        checkForPendingStoryModals();
    } else if (window.state && window.state.pendingInfinityResetStory) {

        // Manual implementation of what checkForPendingStoryModals should do
        window.state.pendingInfinityResetStory = false;
        window.state.seenInfinityResetStory = true;

        setTimeout(() => {
            if (typeof window.showInfinityResetStoryModal === 'function') {

                window.showInfinityResetStoryModal();
            } else {

            }
        }, 1000);
    }
}

// Special notification functions for high-tier upgrades
window.showGodhoodNotification = function() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
            rgba(255, 215, 0, 0.95), 
            rgba(255, 255, 255, 0.95),
            rgba(255, 215, 0, 0.95),
            rgba(255, 255, 255, 0.95));
        background-size: 400% 400%;
        animation: godhoodNotification 8s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        font-family: 'Orbitron', monospace;
        text-align: center;
    `;
    
    notification.innerHTML = `
        <div style="font-size: 8rem; color: #fff; text-shadow: 0 0 50px rgba(255, 215, 0, 1); margin-bottom: 2rem; animation: godhoodCrownNotification 2s ease-in-out infinite;">GOD</div>
        <div style="font-size: 4rem; color: #fff; text-shadow: 0 0 30px rgba(255, 215, 0, 1); font-weight: 900; letter-spacing: 5px; margin-bottom: 1rem;">GODHOOD</div>
        <div style="font-size: 2rem; color: #fff; text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); margin-bottom: 1rem;">ACHIEVED</div>
        <div style="font-size: 1.5rem; color: #fff; text-shadow: 0 0 15px rgba(255, 215, 0, 0.6); max-width: 800px; line-height: 1.4;">You have transcended beyond all mathematical and conceptual limitations.<br>You are now a GOD among numbers.</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 8000);
};

window.showOmniversalUpgradeNotification = function(upgradeName) {
    const upgradeNames = {
        alpha: 'Alpha Force',
        omega: 'Omega Force',
        delta: 'Delta Force',
        sigma: 'Sigma Force',
        theta: 'Theta Force',
        lambda: 'Lambda Force',
        phi: 'Phi Force',
        psi: 'Psi Force'
    };
    
    const upgradeIcons = {
        alpha: 'Α', omega: 'Ω', delta: 'Δ', sigma: 'Σ',
        theta: 'Θ', lambda: 'Λ', phi: 'Φ', psi: 'Ψ'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff8c00, #ff6347, #ffd700, #ff4500);
        background-size: 300% 300%;
        animation: omniversalNotification 5s ease-in-out;
        color: white;
        font-size: 2.5em;
        font-weight: bold;
        padding: 3em;
        border-radius: 25px;
        box-shadow: 0 0 100px rgba(255, 140, 0, 0.8);
        z-index: 50000;
        text-align: center;
        font-family: 'Orbitron', monospace;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        border: 5px solid rgba(255, 255, 255, 0.8);
    `;
    
    notification.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 0.5em; animation: omniversalIconNotification 2s ease-in-out infinite;">${upgradeIcons[upgradeName]}</div>
        <div style="margin-bottom: 0.3em;">OMNIVERSAL FORCE</div>
        <div style="font-size: 0.8em; color: #fff0a0;">${upgradeNames[upgradeName]} Acquired</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
};

window.showPrimordialUpgradeNotification = function(upgradeName) {
    const upgradeNames = {
        genesis: 'Genesis Force',
        void: 'Void Mastery',
        multiverse: 'Multiverse Dominion',
        nexus: 'Reality Nexus'
    };
    
    const upgradeIcons = {
        genesis: 'GEN', void: 'VOID', multiverse: 'MULT', nexus: 'NEX'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(159, 80, 255, 0.95), rgba(100, 0, 200, 0.9));
        background-size: 300% 300%;
        animation: primordialNotification 4s ease-in-out;
        color: white;
        font-size: 2.2em;
        font-weight: bold;
        padding: 2.5em;
        border-radius: 20px;
        box-shadow: 0 0 80px rgba(159, 80, 255, 0.7);
        z-index: 40000;
        text-align: center;
        font-family: 'Orbitron', monospace;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        border: 4px solid rgba(200, 100, 255, 0.6);
    `;
    
    notification.innerHTML = `
        <div style="font-size: 1.8em; margin-bottom: 0.5em; animation: primordialIconNotification 3s ease-in-out infinite;">${upgradeIcons[upgradeName]}</div>
        <div style="margin-bottom: 0.3em;">PRIMORDIAL POWER</div>
        <div style="font-size: 0.7em; color: #e0c0ff;">${upgradeNames[upgradeName]} Unlocked</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
};

// Add CSS animations for the special notifications
const specialNotificationStyle = document.createElement('style');
specialNotificationStyle.textContent = `
@keyframes godhoodNotification {
    0% { 
        background-position: 0% 0%;
        opacity: 0;
        transform: scale(0);
    }
    20% { 
        background-position: 100% 100%;
        opacity: 1;
        transform: scale(1.1);
    }
    80% { 
        background-position: 0% 100%;
        opacity: 1;
        transform: scale(1);
    }
    100% { 
        background-position: 100% 0%;
        opacity: 0;
        transform: scale(1.05);
    }
}

@keyframes godhoodCrownNotification {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
}

@keyframes omniversalNotification {
    0% { 
        background-position: 0% 0%;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    25% { 
        background-position: 100% 100%;
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 1;
    }
    75% { 
        background-position: 0% 100%;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% { 
        background-position: 100% 0%;
        transform: translate(-50%, -50%) scale(0.9);
        opacity: 0;
    }
}

@keyframes omniversalIconNotification {
    0% { transform: scale(1) rotate(0deg); }
    33% { transform: scale(1.3) rotate(120deg); }
    66% { transform: scale(0.9) rotate(240deg); }
    100% { transform: scale(1) rotate(360deg); }
}

@keyframes primordialNotification {
    0% { 
        background-position: 0% 0%;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0;
    }
    30% { 
        background-position: 100% 100%;
        transform: translate(-50%, -50%) scale(1.05);
        opacity: 1;
    }
    70% { 
        background-position: 50% 50%;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% { 
        background-position: 0% 100%;
        transform: translate(-50%, -50%) scale(0.95);
        opacity: 0;
    }
}

@keyframes primordialIconNotification {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
}
`;
document.head.appendChild(specialNotificationStyle);

// Respec function for infinity theorems
window.respecInfinityTheorems = function() {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to respec your Infinity Theorems? This will reset all infinity upgrades and reset your currencies/progress (but preserve your expansion level).')) {
        return;
    }
    

    
    // Calculate total spent IT to refund
    let totalSpent = 0;
    for (const upgradeName in window.infinityUpgrades) {
        const upgradeLevel = window.infinityUpgrades[upgradeName];
        const upgradeData = window.infinityUpgradeData[upgradeName];
        if (upgradeData && upgradeLevel > 0) {
            // Calculate total cost for this upgrade
            let upgradeCost = 0;
            for (let level = 1; level <= upgradeLevel; level++) {
                const cost = upgradeData.baseCost * Math.pow(upgradeData.costMultiplier, level - 1);
                upgradeCost += cost;
            }
            totalSpent += upgradeCost;
        }
    }
    
    // Refund all spent IT to the available infinity theorems
    if (window.infinitySystem && totalSpent > 0) {
        window.infinitySystem.infinityTheorems += totalSpent;

    }
    
    // Reset all infinity upgrade levels to 0
    for (const upgradeName in window.infinityUpgrades) {
        window.infinityUpgrades[upgradeName] = 0;
    }

    
    // Reset currencies and progress like expansion reset does (but preserve expansion level)

    
    // Reset currencies like expansion reset does
    const zero = new Decimal(0);
    const currentGrade = state.grade; // Preserve current expansion level
    
    if (typeof state !== 'undefined') {
        state.fluff = zero;
        state.swaria = zero;
        state.feathers = zero;
        state.artifacts = zero;
        state.boxesProduced = zero;
        state.boxesProducedByType = {
            common: zero,
            uncommon: zero,
            rare: zero,
            legendary: zero,
            mythic: zero
        };
        // Explicitly preserve the expansion level
        state.grade = currentGrade;
    }
    
    // Reset global currencies
    if (typeof window.fluff !== 'undefined') window.fluff = zero;
    if (typeof window.swariaCoins !== 'undefined') window.swariaCoins = zero;
    if (typeof window.feathers !== 'undefined') window.feathers = zero;
    if (typeof window.artifacts !== 'undefined') window.artifacts = zero;
    
    // Reset light currencies
    if (typeof window.light !== 'undefined') window.light = zero;
    if (typeof window.redLight !== 'undefined') window.redLight = zero;
    if (typeof window.orangeLight !== 'undefined') window.orangeLight = zero;
    if (typeof window.yellowLight !== 'undefined') window.yellowLight = zero;
    if (typeof window.greenLight !== 'undefined') window.greenLight = zero;
    if (typeof window.blueLight !== 'undefined') window.blueLight = zero;
    
    // Reset generator upgrades
    if (typeof window.generatorUpgrades !== 'undefined') {
        window.generatorUpgrades = {
            common: 0, uncommon: 0, rare: 0, legendary: 0, mythic: 0
        };
    }
    
    // Reset generators
    if (typeof window.generators !== 'undefined') {
        window.generators.forEach(gen => {
            gen.speedUpgrades = 0;
            gen.speed = gen.baseSpeed;
            gen.upgrades = 0;
        });
    }
    
    // Reset bought elements (keep only 7 and 8)
    if (typeof window.boughtElements !== 'undefined') {
        const keep = [7, 8];
        for (let key in window.boughtElements) {
            if (!keep.includes(parseInt(key))) {
                delete window.boughtElements[key];
            }
        }
    }
    
    // Reset prism state
    if (typeof window.prismState !== 'undefined') {
        window.prismState.generatorLevel = {
            light: 0, redlight: 0, orangelight: 0, yellowlight: 0, greenlight: 0, bluelight: 0
        };
        window.prismState.generatorUnlocked = {
            light: false, redlight: false, orangelight: false, yellowlight: false, greenlight: false, bluelight: false
        };
    }
    
    // Reset power energy to maximum
    if (typeof state !== 'undefined' && typeof window.calculatePowerGeneratorCap === 'function') {
        state.powerMaxEnergy = window.calculatePowerGeneratorCap();
        state.powerEnergy = state.powerMaxEnergy;
    }
    
    // Reset charger if available
    if (typeof window.charger !== 'undefined' && window.charger.charge) {
        window.charger.charge = zero;
    }
    

    
    // Save and reload like expansion reset does
    if (typeof saveGame === 'function') {
        saveGame();
    }
};

// Add event listener for respec button
document.addEventListener('DOMContentLoaded', function() {
    const respecBtn = document.getElementById('respecInfinityBtn');
    if (respecBtn) {
        respecBtn.addEventListener('click', window.respecInfinityTheorems);

    }
});



// ========== INFINITY RESEARCH SYSTEM ==========

// Infinity caps system
window.infinityCaps = {
    fluff: false,
    swariaCoins: false, 
    feathers: false,
    artifacts: false,
    terrariumPollen: false,
    terrariumFlowers: false,
    terrariumNectar: false
};

// Current active research tab
let currentInfinityResearchTab = 'cargo';

// Switch infinity research tabs
window.switchInfinityResearchTab = function(tabName) {
    // Hide all content divs
    document.querySelectorAll('.infinity-research-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.research-nav-buttons .infinity-sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected content
    const contentDiv = document.getElementById(`infinityResearch${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (contentDiv) {
        contentDiv.classList.add('active');
    }
    
    // Activate selected button
    const buttons = document.querySelectorAll('.research-nav-buttons .infinity-sub-tab-btn');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase() === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update displays for the selected tab
    if (tabName === 'cargo') {
        updateCargoResearchDisplay();
    } else if (tabName === 'terrarium') {
        updateTerrariumResearchDisplay();
    } else if (tabName === 'lab') {
        updateLabResearchDisplay();
    }
    
    currentInfinityResearchTab = tabName;

};

// Toggle infinity cap for a currency
window.toggleInfinityCap = function(currencyName) {
    // Check if currency has been discovered
    const hasDiscovered = window.infinitySystem.counts[currencyName] > 0 || 
                        (typeof window.infinitySystem.everReached !== 'undefined' && 
                         window.infinitySystem.everReached[currencyName]);
    
    if (!hasDiscovered) {
        // Show a message that the currency needs to be discovered first
        alert('This currency must be discovered first by reaching infinity!');
        return;
    }
    
    // Show confirmation warning
    const confirmMessage = `Warning: Changing the infinity cap will force reset ALL currencies back to 0!\n\nThis includes: fluff, swaria coins, feather, wing artifact, light, red light, orange light, yellow light, green light, blue light, pollen, flower, nectar\n\nAre you sure you want to continue?`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Toggle the cap
    window.infinityCaps[currencyName] = !window.infinityCaps[currencyName];
    
    // Update button appearance
    const capBtn = document.getElementById(`${currencyName}CapBtn`);
    const capText = document.getElementById(`${currencyName}CapText`);
    
    if (capBtn && capText) {
        if (window.infinityCaps[currencyName]) {
            capBtn.classList.add('capped');
            capText.textContent = 'Cap: ON';
        } else {
            capBtn.classList.remove('capped');
            capText.textContent = 'Cap: OFF';
        }
    }
    
    // Force reset all currencies
    resetAllCurrencies();
    

};

// Reset all currencies to 0
function resetAllCurrencies() {
    const zero = new Decimal(0);
    
    // Reset main currencies
    if (typeof window.state !== 'undefined') {
        window.state.fluff = zero;
        window.state.swaria = zero;
        window.state.swariaCoins = zero;
        window.state.feathers = zero;
        window.state.artifacts = zero;
    }
    
    // Reset prism currencies
    if (typeof window.prismState !== 'undefined') {
        window.prismState.light = zero;
        window.prismState.redLight = zero;
        window.prismState.orangeLight = zero;
        window.prismState.yellowLight = zero;
        window.prismState.greenLight = zero;
        window.prismState.blueLight = zero;
    }
    
    // Reset terrarium currencies
    if (typeof window.terrariumPollen !== 'undefined') window.terrariumPollen = zero;
    if (typeof window.terrariumFlowers !== 'undefined') window.terrariumFlowers = zero;
    if (typeof window.terrariumNectar !== 'undefined') window.terrariumNectar = zero;
    
    // Update UI if available
    if (typeof updateUI === 'function') {
        updateUI();
    }
    

}

// Calculate nerf multiplier for a currency
function getInfinityNerf(currencyName) {
    const infinityCount = window.infinitySystem.counts[currencyName] || 0;
    if (infinityCount === 0) return 1.0;
    
    // Apply massive /1.8e308 nerf for each infinity
    // This means the currency gain gets divided by 1.8e308 for each infinity
    const massiveNerf = new Decimal('1.8e308');
    const totalNerf = massiveNerf.pow(infinityCount); // Compound the nerf for multiple infinities
    return new Decimal(1).div(totalNerf).toNumber();
}

// Fluff infinity penalty - affects ALL cargo currencies based on fluff infinity count
function getFluffInfinityPenalty() {
    if (!window.infinitySystem || !window.infinitySystem.counts) {
        return 1.0;
    }
    
    const fluffInfinityCount = window.infinitySystem.counts.fluff || 0;
    if (fluffInfinityCount === 0) return 1.0;
    
    // Start at ^0.9 for first infinity, then multiply by 0.75 (25% stronger) for each additional infinity
    // 1st infinity: ^0.9, 2nd: ^0.675, 3rd: ^0.506, etc.
    // Minimum penalty is ^0.01 (99% reduction)
    const penaltyExponent = Math.max(0.01, 0.9 * Math.pow(0.75, fluffInfinityCount - 1));
    return penaltyExponent;
}

// Apply fluff infinity penalty to cargo currencies
function applyFluffInfinityPenalty(amount, currencyType) {
    if (!DecimalUtils.isDecimal(amount)) {
        amount = new Decimal(amount);
    }
    
    // Only apply to cargo currencies
    const cargoCurrencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
    if (!cargoCurrencies.includes(currencyType)) {
        return amount;
    }
    
    const penaltyExponent = getFluffInfinityPenalty();
    if (penaltyExponent !== 1.0) {
        return amount.pow(penaltyExponent);
    }
    
    return amount;
}

// Make fluff infinity penalty functions available globally
window.getFluffInfinityPenalty = getFluffInfinityPenalty;
window.applyFluffInfinityPenalty = applyFluffInfinityPenalty;

// Individual currency infinity penalties
// Swaria infinity penalty affects box generation count (how many boxes generators produce per action)
// ^1 at 0 infinity, ^0.9 at 1 infinity, etc.
function getSwariaInfinityPenalty() {
    const swariaInfinityCount = infinitySystem.counts.swaria || 0;
    if (swariaInfinityCount === 0) return 1.0;
    return Math.max(0.01, 0.9 * Math.pow(0.9, swariaInfinityCount - 1));
}

// Apply swaria infinity penalty to box generation count (not currency gains)
function applySwariaInfinityPenalty(amount) {
    if (!DecimalUtils.isDecimal(amount)) amount = new Decimal(amount);
    if (amount.lte(0)) return amount;
    
    const penaltyExponent = getSwariaInfinityPenalty();
    return amount.pow(penaltyExponent);
}

// Make individual infinity penalty functions available globally
window.getSwariaInfinityPenalty = getSwariaInfinityPenalty;
window.applySwariaInfinityPenalty = applySwariaInfinityPenalty;

// Update infinity research displays
window.updateInfinityResearchDisplay = function() {
    // Check which tab is currently active
    const cargoTab = document.getElementById('infinityResearchCargo');
    const terrariumTab = document.getElementById('infinityResearchTerrarium');
    const labTab = document.getElementById('infinityResearchLab');
    
    if (cargoTab && cargoTab.classList.contains('active')) {
        updateCargoResearchDisplay();
    }
    
    if (terrariumTab && terrariumTab.classList.contains('active')) {
        updateTerrariumResearchDisplay();
    }
    
    if (labTab && labTab.classList.contains('active')) {
        updateLabResearchDisplay();
    }
};

// Update cargo tab research displays
function updateCargoResearchDisplay() {
    const currencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
    
    currencies.forEach(currency => {
        // Check if currency has been discovered (reached infinity at least once)
        const hasDiscovered = window.infinitySystem.counts[currency] > 0 || 
                            (typeof window.infinitySystem.everReached !== 'undefined' && 
                             window.infinitySystem.everReached[currency]);
        
        const discoveryOverlay = document.getElementById(`${currency}DiscoveryOverlay`);
        const capBtn = document.getElementById(`${currency}CapBtn`);
        
        if (hasDiscovered) {
            // Currency discovered - show normal display
            if (discoveryOverlay) {
                discoveryOverlay.classList.add('hidden');
            }
            
            // Enable cap button
            if (capBtn) {
                capBtn.disabled = false;
                capBtn.style.opacity = '1';
                capBtn.style.cursor = 'pointer';
            }
            
            // Update infinity count display
            const infinityCount = window.infinitySystem.counts[currency] || 0;
            const countElement = document.getElementById(`${currency}InfinityCount`);
            if (countElement) {
                countElement.textContent = `${infinityCount}∞`;
            }
            
            // Update nerf value display
            // Show different penalties based on what each currency affects
            let nerfValue;
            if (currency === 'swaria') {
                // For swaria, show the swaria infinity penalty (affects box generation)
                nerfValue = getSwariaInfinityPenalty();
            } else if (['fluff', 'feathers', 'artifacts'].includes(currency)) {
                // For other cargo currencies, show the fluff infinity penalty
                nerfValue = getFluffInfinityPenalty();
                
                // If this specific currency has gone infinity, multiply by its individual nerf
                const individualInfinityCount = window.infinitySystem.counts[currency] || 0;
                if (individualInfinityCount > 0 && currency !== 'fluff') {
                    const individualNerf = getInfinityNerf(currency);
                    nerfValue = nerfValue * individualNerf;
                }
            } else {
                // For non-cargo currencies, use their individual infinity nerf
                nerfValue = getInfinityNerf(currency);
            }
            
            const nerfElement = document.getElementById(`${currency}NerfValue`);
            if (nerfElement) {
                nerfElement.textContent = `^${nerfValue.toFixed(2)}`;
                
                // Color coding: green for no nerf, yellow for moderate, red for heavy
                if (nerfValue >= 0.9) {
                    nerfElement.style.color = '#4CAF50'; // Green
                } else if (nerfValue >= 0.7) {
                    nerfElement.style.color = '#FFC107'; // Yellow
                } else {
                    nerfElement.style.color = '#F44336'; // Red
                }
            }
        } else {
            // Currency not discovered - show overlay and disable cap button
            if (discoveryOverlay) {
                discoveryOverlay.classList.remove('hidden');
            }
            
            // Disable cap button
            if (capBtn) {
                capBtn.disabled = true;
                capBtn.style.opacity = '0.3';
                capBtn.style.cursor = 'not-allowed';
            }
        }
    });
    
    // Update cap button states only for discovered currencies
    currencies.forEach(currency => {
        const hasDiscovered = window.infinitySystem.counts[currency] > 0 || 
                            (typeof window.infinitySystem.everReached !== 'undefined' && 
                             window.infinitySystem.everReached[currency]);
        
        if (hasDiscovered) {
            const capBtn = document.getElementById(`${currency}CapBtn`);
            const capText = document.getElementById(`${currency}CapText`);
            
            if (capBtn && capText) {
                if (window.infinityCaps[currency]) {
                    capBtn.classList.add('capped');
                    capText.textContent = 'Cap: ON';
                } else {
                    capBtn.classList.remove('capped');
                    capText.textContent = 'Cap: OFF';
                }
            }
        }
    });
}

// Update terrarium tab research displays
function updateTerrariumResearchDisplay() {
    const currencies = ['terrariumPollen', 'terrariumFlowers', 'terrariumNectar'];
    
    currencies.forEach(currency => {
        // Check if currency has been discovered (reached infinity at least once)
        const hasDiscovered = window.infinitySystem.counts[currency] > 0 || 
                            (typeof window.infinitySystem.everReached !== 'undefined' && 
                             window.infinitySystem.everReached[currency]);
        
        const discoveryOverlay = document.getElementById(`${currency}DiscoveryOverlay`);
        const capBtn = document.getElementById(`${currency}CapBtn`);
        
        if (hasDiscovered) {
            // Currency discovered - show normal display
            if (discoveryOverlay) {
                discoveryOverlay.classList.add('hidden');
            }
            
            // Enable cap button
            if (capBtn) {
                capBtn.disabled = false;
                capBtn.style.opacity = '1';
                capBtn.style.cursor = 'pointer';
            }
            
            // Update infinity count display
            const infinityCount = window.infinitySystem.counts[currency] || 0;
            const countElement = document.getElementById(`${currency}InfinityCount`);
            if (countElement) {
                countElement.textContent = `${infinityCount}∞`;
            }
            
            // Update nerf value display
            const nerfValue = getInfinityNerf(currency);
            const nerfElement = document.getElementById(`${currency}NerfValue`);
            if (nerfElement) {
                nerfElement.textContent = `^${nerfValue.toFixed(2)}`;
                
                // Color coding: green for no nerf, yellow for moderate, red for heavy
                if (nerfValue >= 0.6) {
                    nerfElement.style.color = '#4CAF50'; // Green
                } else if (nerfValue >= 0.3) {
                    nerfElement.style.color = '#FFC107'; // Yellow
                } else {
                    nerfElement.style.color = '#F44336'; // Red
                }
            }
        } else {
            // Currency not discovered - show overlay and disable cap button
            if (discoveryOverlay) {
                discoveryOverlay.classList.remove('hidden');
            }
            
            // Disable cap button
            if (capBtn) {
                capBtn.disabled = true;
                capBtn.style.opacity = '0.3';
                capBtn.style.cursor = 'not-allowed';
            }
        }
    });
    
    // Update cap button states only for discovered currencies
    currencies.forEach(currency => {
        const hasDiscovered = window.infinitySystem.counts[currency] > 0 || 
                            (typeof window.infinitySystem.everReached !== 'undefined' && 
                             window.infinitySystem.everReached[currency]);
        
        if (hasDiscovered) {
            const capBtn = document.getElementById(`${currency}CapBtn`);
            const capText = document.getElementById(`${currency}CapText`);
            
            if (capBtn && capText) {
                if (window.infinityCaps[currency]) {
                    capBtn.classList.add('capped');
                    capText.textContent = 'Cap: ON';
                } else {
                    capBtn.classList.remove('capped');
                    capText.textContent = 'Cap: OFF';
                }
            }
        }
    });
}

// Update lab tab research displays
function updateLabResearchDisplay() {
    const currencies = ['light', 'redLight', 'orangeLight', 'yellowLight', 'greenLight', 'blueLight'];
    
    currencies.forEach(currency => {
        // Check if currency has been discovered (reached infinity at least once)
        const hasDiscovered = window.infinitySystem.counts[currency] > 0 || 
                            (typeof window.infinitySystem.everReached !== 'undefined' && 
                             window.infinitySystem.everReached[currency]);
        
        const discoveryOverlay = document.getElementById(`${currency}DiscoveryOverlay`);
        const capBtn = document.getElementById(`${currency}CapBtn`);
        
        if (hasDiscovered) {
            // Currency discovered - show normal display
            if (discoveryOverlay) {
                discoveryOverlay.classList.add('hidden');
            }
            
            // Enable cap button
            if (capBtn) {
                capBtn.disabled = false;
                capBtn.style.opacity = '1';
                capBtn.style.cursor = 'pointer';
            }
            
            // Update infinity count display
            const infinityCount = window.infinitySystem.counts[currency] || 0;
            const countElement = document.getElementById(`${currency}InfinityCount`);
            if (countElement) {
                countElement.textContent = `${infinityCount}∞`;
            }
            
            // Update nerf value display
            const nerfValue = getInfinityNerf(currency);
            const nerfElement = document.getElementById(`${currency}NerfValue`);
            if (nerfElement) {
                nerfElement.textContent = `^${nerfValue.toFixed(2)}`;
                
                // Color coding: green for no nerf, yellow for moderate, red for heavy
                if (nerfValue >= 0.6) {
                    nerfElement.style.color = '#4CAF50'; // Green
                } else if (nerfValue >= 0.3) {
                    nerfElement.style.color = '#FFC107'; // Yellow
                } else {
                    nerfElement.style.color = '#F44336'; // Red
                }
            }
        } else {
            // Currency not discovered - show overlay and disable cap button
            if (discoveryOverlay) {
                discoveryOverlay.classList.remove('hidden');
            }
            
            // Disable cap button
            if (capBtn) {
                capBtn.disabled = true;
                capBtn.style.opacity = '0.3';
                capBtn.style.cursor = 'not-allowed';
            }
        }
    });
    
    // Update cap button states only for discovered currencies
    currencies.forEach(currency => {
        const hasDiscovered = window.infinitySystem.counts[currency] > 0 || 
                            (typeof window.infinitySystem.everReached !== 'undefined' && 
                             window.infinitySystem.everReached[currency]);
        
        if (hasDiscovered) {
            const capBtn = document.getElementById(`${currency}CapBtn`);
            const capText = document.getElementById(`${currency}CapText`);
            
            if (capBtn && capText) {
                if (window.infinityCaps[currency]) {
                    capBtn.classList.add('capped');
                    capText.textContent = 'Cap: ON';
                } else {
                    capBtn.classList.remove('capped');
                    capText.textContent = 'Cap: OFF';
                }
            }
        }
    });
}

// Check if currency should be capped
window.checkInfinityCap = function(currencyName, currentValue) {
    if (window.infinityCaps[currencyName]) {
        const cap = new Decimal('1.79e308');
        if (currentValue.gt(cap)) {
            return cap;
        }
    }
    return currentValue;
};

// Initialize infinity research system
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial display
    if (typeof window.updateInfinityResearchDisplay === 'function') {
        window.updateInfinityResearchDisplay();
    }
    

});



// === INFINITY CHALLENGE SYSTEM ===

// Challenge data structure
const infinityChallenges = {
    1: {
        name: "Infinity Challenge 1",
        description: "Reach infinity with your cargo currency square rooted",
        difficulties: {
            1: {
                name: "IC:1-1",
                requirement: "Reach 1 Total ∞",
                infinityTarget: 1,
                reward: "Boost all cargo currency gain based on KP amount",
                effect: "Cargo currency gains are multiplied by KP amount",
                unlocked: true,
                completed: false
            },
            2: {
                name: "IC:1-2", 
                requirement: "Reach 4 Total ∞",
                infinityTarget: 4,
                reward: "Make IC:1 boost 500% better (6x multiplier)",
                effect: "Cargo currency gains are multiplied by (KP × 6)",
                unlocked: false,
                completed: false
            },
            3: {
                name: "IC:1-3",
                requirement: "Reach 10 Total ∞", 
                infinityTarget: 10,
                reward: "Make IC:1 boost 10000% better (101x multiplier)",
                effect: "Cargo currency gains are multiplied by (KP × 6 × 101)",
                unlocked: false,
                completed: false
            },
            4: {
                name: "IC:1-4",
                requirement: "Reach 15 Total ∞",
                infinityTarget: 15, 
                reward: "Make IC:1 boost 1e8% better (1e6+1 multiplier)",
                effect: "Cargo currency gains are multiplied by (KP × 6 × 101 × 1e6)",
                unlocked: false,
                completed: false
            },
            5: {
                name: "IC:1-5",
                requirement: "Reach 30 Total ∞",
                infinityTarget: 30,
                reward: "Make IC:1 boost 1e30% better (1e28+1 multiplier)", 
                effect: "Cargo currency gains are multiplied by (KP × 6 × 101 × 1e6 × 1e28)",
                unlocked: false,
                completed: false
            }
        },
        currentDifficulty: 1,
        maxDifficulty: 5,
        visible: true
    },
    2: {
        name: "Infinity Challenge 2",
        description: "Coming soon...",
        difficulties: {
            1: {
                name: "IC:2-1",
                requirement: "Complete IC:1-1 first",
                infinityTarget: 1,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            2: {
                name: "IC:2-2",
                requirement: "Complete IC:2-1 first",
                infinityTarget: 5,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            3: {
                name: "IC:2-3",
                requirement: "Complete IC:2-2 first",
                infinityTarget: 12,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            4: {
                name: "IC:2-4",
                requirement: "Complete IC:2-3 first",
                infinityTarget: 20,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            5: {
                name: "IC:2-5",
                requirement: "Complete IC:2-4 first",
                infinityTarget: 35,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            }
        },
        currentDifficulty: 1,
        maxDifficulty: 5,
        visible: false
    },
    3: {
        name: "Infinity Challenge 3",
        description: "Coming soon...", 
        difficulties: {
            1: {
                name: "IC:3-1",
                requirement: "Complete IC:2-1 first",
                infinityTarget: 1,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            2: {
                name: "IC:3-2",
                requirement: "Complete IC:3-1 first",
                infinityTarget: 6,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            3: {
                name: "IC:3-3",
                requirement: "Complete IC:3-2 first",
                infinityTarget: 14,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            4: {
                name: "IC:3-4",
                requirement: "Complete IC:3-3 first",
                infinityTarget: 25,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            5: {
                name: "IC:3-5",
                requirement: "Complete IC:3-4 first",
                infinityTarget: 40,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            }
        },
        currentDifficulty: 1,
        maxDifficulty: 5,
        visible: false
    },
    4: {
        name: "Infinity Challenge 4",
        description: "Coming soon...", 
        difficulties: {
            1: {
                name: "IC:4-1",
                requirement: "Complete IC:3-1 first",
                infinityTarget: 1,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            2: {
                name: "IC:4-2",
                requirement: "Complete IC:4-1 first",
                infinityTarget: 7,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            3: {
                name: "IC:4-3",
                requirement: "Complete IC:4-2 first",
                infinityTarget: 16,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            4: {
                name: "IC:4-4",
                requirement: "Complete IC:4-3 first",
                infinityTarget: 28,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            },
            5: {
                name: "IC:4-5",
                requirement: "Complete IC:4-4 first",
                infinityTarget: 45,
                reward: "Coming soon...",
                effect: "TBD",
                unlocked: false,
                completed: false
            }
        },
        currentDifficulty: 1,
        maxDifficulty: 5,
        visible: false
    }
};

// Current selected challenge
let selectedChallenge = 1;
let activeChallenge = 0; // 0 means no active challenge
let activeDifficulty = 0; // Current difficulty level of active challenge

// Make challenge state globally accessible for save/load system
window.infinityChallenges = infinityChallenges;
window.activeChallenge = activeChallenge;
window.activeDifficulty = activeDifficulty;

// Select a challenge (doesn't start it, just shows description)
window.selectInfinityChallenge = function(challengeId) {
    const challenge = infinityChallenges[challengeId];
    if (!challenge) {
        return;
    }
    
    // Get current difficulty for this challenge
    const currentDiff = challenge.currentDifficulty;
    const difficulty = challenge.difficulties[currentDiff];
    
    if (!difficulty || !difficulty.unlocked) {
        return;
    }
    
    selectedChallenge = challengeId;
    
    // Update button appearances
    document.querySelectorAll('.infinity-challenge-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`ic${challengeId}Btn`).classList.add('active');
    
    // Update description panel with current difficulty info
    document.getElementById('challengeTitle').textContent = difficulty.name;
    document.getElementById('challengeDescription').textContent = `${challenge.description} (Difficulty ${currentDiff}/${challenge.maxDifficulty})`;
    document.getElementById('challengeRequirement').textContent = difficulty.requirement;
    document.getElementById('challengeReward').textContent = `Reward: ${difficulty.reward}`;
    
    // Update challenge button state
    updateChallengeButton();
    
    // Update challenge effect display
    updateChallengeEffectDisplay();
    

};

// Start the selected infinity challenge
window.startInfinityChallenge = function() {
    // Check current state and act accordingly
    if (window.activeChallenge === 0 || typeof window.activeChallenge === 'undefined') {
        // Not in a challenge - start one
        startChallenge();
    } else if (canCompleteCurrentChallenge()) {
        // In a challenge and can complete it
        completeCurrentChallenge();
    } else {
        // In a challenge but can't complete it - exit
        exitCurrentChallenge();
    }
};

// Perform comprehensive infinity challenge reset
function performInfinityChallengeReset() {

    
    // Preserve expansion level (grade)
    const currentExpansionLevel = window.state ? window.state.grade : new Decimal(1);
    
    // Reset main currencies
    if (window.state) {
        state.fluff = new Decimal(0);
        state.swaria = new Decimal(0);
        state.feathers = new Decimal(0);
        state.artifacts = new Decimal(0);
        state.grade = currentExpansionLevel; // Preserve expansion level
        state.boxesProduced = new Decimal(0);
        state.boxesProducedByType = {
            common: new Decimal(0),
            uncommon: new Decimal(0),
            rare: new Decimal(0),
            legendary: new Decimal(0),
            mythic: new Decimal(0)
        };
        
        // Reset infinity counts to 0 for challenge
        state.fluffInfinityCount = new Decimal(0);
        state.swariaInfinityCount = new Decimal(0);
        state.feathersInfinityCount = new Decimal(0);
        state.artifactsInfinityCount = new Decimal(0);
        
        // Reset power system
        state.powerEnergy = new Decimal(100);
        state.powerMaxEnergy = new Decimal(100);
        state.powerStatus = 'online';
    }
    
    // Reset Knowledge Points (ensure it's reset properly)
    if (window.state && typeof window.state.kp !== 'undefined') {
        window.state.kp = new Decimal(0);
    }
    if (typeof swariaKnowledge !== 'undefined' && swariaKnowledge) {
        swariaKnowledge.kp = new Decimal(0);
    }
    
    // Reset all element upgrades except 7 and 8
    const preservedElements = {};
    if (window.boughtElements && (window.boughtElements[7] || window.boughtElements["7"])) {
        preservedElements[7] = true;
        preservedElements["7"] = true;
    }
    if (window.boughtElements && (window.boughtElements[8] || window.boughtElements["8"])) {
        preservedElements[8] = true;
        preservedElements["8"] = true;
    }
    
    // Reset window.boughtElements
    window.boughtElements = preservedElements;
    
    // Reset state.boughtElements if it exists
    if (window.state && window.state.boughtElements) {
        window.state.boughtElements = preservedElements;
    }
    
    // Reset global boughtElements if it exists
    if (typeof boughtElements !== 'undefined') {
        boughtElements = preservedElements;
    }
    
    // Reset generator upgrades
    if (typeof window.generatorUpgrades !== 'undefined') {
        window.generatorUpgrades.common = new Decimal(0);
        window.generatorUpgrades.uncommon = new Decimal(0);
        window.generatorUpgrades.rare = new Decimal(0);
        window.generatorUpgrades.legendary = new Decimal(0);
        window.generatorUpgrades.mythic = new Decimal(0);
    }
    
    if (window.generators && Array.isArray(window.generators)) {
        generators.forEach(gen => {
            gen.speedUpgrades = 0;
            gen.speedMultiplier = 1;
            gen.upgrades = 0;
            gen.speed = gen.baseSpeed;
            gen.unlocked = false;
        });
    }
    
    // Reset prism state
    if (window.prismState) {
        const prismProps = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight', 
                           'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                           'greenlightparticle', 'bluelightparticle'];
        
        prismProps.forEach(prop => {
            if (window.prismState[prop]) {
                window.prismState[prop] = new Decimal(0);
            }
        });
        
        // Also reset fractional accumulators
        prismProps.forEach(prop => {
            const fractionalKey = prop + 'Fractional';
            if (window.prismState[fractionalKey]) {
                window.prismState[fractionalKey] = new Decimal(0);
            }
        });
        
        // Reset prism generator unlocks
        if (window.prismState.generatorUnlocked) {
            for (let key in window.prismState.generatorUnlocked) {
                window.prismState.generatorUnlocked[key] = false;
            }
        }
        
        // Reset prism generator upgrades (light generator upgrades)
        if (window.prismState.generatorUpgrades) {
            window.prismState.generatorUpgrades = {
                light: 0,
                redlight: 0,
                orangelight: 0,
                yellowlight: 0,
                greenlight: 0,
                bluelight: 0
            };
        }
    }
    
    // CRITICAL: Also reset state.prismState (this is where addCurrency operates!)
    if (window.state && window.state.prismState) {
        const prismProps = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight', 
                           'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                           'greenlightparticle', 'bluelightparticle'];
        
        prismProps.forEach(prop => {
            if (typeof window.state.prismState[prop] !== 'undefined') {
                window.state.prismState[prop] = new Decimal(0);
            }
        });
        
        // Also reset fractional accumulators in state.prismState
        prismProps.forEach(prop => {
            const fractionalKey = prop + 'Fractional';
            if (typeof window.state.prismState[fractionalKey] !== 'undefined') {
                window.state.prismState[fractionalKey] = new Decimal(0);
            }
        });
        
        // Reset prism generator unlocks in state
        if (window.state.prismState.generatorUnlocked) {
            for (let key in window.state.prismState.generatorUnlocked) {
                window.state.prismState.generatorUnlocked[key] = false;
            }
        }
        
        // Reset prism generator upgrades in state
        if (window.state.prismState.generatorUpgrades) {
            window.state.prismState.generatorUpgrades = {
                light: 0,
                redlight: 0,
                orangelight: 0,
                yellowlight: 0,
                greenlight: 0,
                bluelight: 0
            };
        }
    }
    
    // Ensure prism state synchronization after reset
    if (window.prismState && window.state && window.state.prismState) {
        // Sync window.prismState to match window.state.prismState (which addCurrency uses)
        const prismProps = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight', 
                           'lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 
                           'greenlightparticle', 'bluelightparticle'];
        
        prismProps.forEach(prop => {
            if (typeof window.state.prismState[prop] !== 'undefined') {
                window.prismState[prop] = window.state.prismState[prop];
            }
            
            const fractionalKey = prop + 'Fractional';
            if (typeof window.state.prismState[fractionalKey] !== 'undefined') {
                window.prismState[fractionalKey] = window.state.prismState[fractionalKey];
            }
        });
        
        // Sync generator states
        if (window.state.prismState.generatorUnlocked) {
            window.prismState.generatorUnlocked = window.state.prismState.generatorUnlocked;
        }
        if (window.state.prismState.generatorUpgrades) {
            window.prismState.generatorUpgrades = window.state.prismState.generatorUpgrades;
        }
    }
    
    // Reset global light currency variables (for backward compatibility)
    const zero = new Decimal(0);
    if (typeof window.light !== 'undefined') window.light = zero;
    if (typeof window.redLight !== 'undefined') window.redLight = zero;
    if (typeof window.orangeLight !== 'undefined') window.orangeLight = zero;
    if (typeof window.yellowLight !== 'undefined') window.yellowLight = zero;
    if (typeof window.greenLight !== 'undefined') window.greenLight = zero;
    if (typeof window.blueLight !== 'undefined') window.blueLight = zero;
    
    // Reset charger state
    if (window.charger) {
        window.charger.charge = new Decimal(0);
        
        // Reset charger milestones (keep structure but reset unlocked status)
        if (window.charger.milestones) {
            window.charger.milestones.forEach(milestone => {
                milestone.unlocked = false;
                milestone.elementUnlocked = false;
            });
        }
    }
    
    // Reset terrarium
    if (window.terrariumPollen !== undefined) window.terrariumPollen = new Decimal(0);
    if (window.terrariumFlowers !== undefined) window.terrariumFlowers = new Decimal(0);
    if (window.terrariumXP !== undefined) window.terrariumXP = new Decimal(0);
    if (window.terrariumLevel !== undefined) window.terrariumLevel = 1;
    if (window.terrariumNectar !== undefined) window.terrariumNectar = 0;
    
    // Reset terrarium upgrades
    if (window.terrariumPollenValueUpgradeLevel !== undefined) window.terrariumPollenValueUpgradeLevel = 0;
    if (window.terrariumPollenValueUpgrade2Level !== undefined) window.terrariumPollenValueUpgrade2Level = 0;
    if (window.terrariumFlowerValueUpgradeLevel !== undefined) window.terrariumFlowerValueUpgradeLevel = 0;
    if (window.terrariumPollenToolSpeedUpgradeLevel !== undefined) window.terrariumPollenToolSpeedUpgradeLevel = 0;
    if (window.terrariumFlowerXPUpgradeLevel !== undefined) window.terrariumFlowerXPUpgradeLevel = 0;
    if (window.terrariumExtraChargeUpgradeLevel !== undefined) window.terrariumExtraChargeUpgradeLevel = 0;
    if (window.terrariumXpMultiplierUpgradeLevel !== undefined) window.terrariumXpMultiplierUpgradeLevel = 0;
    if (window.terrariumFlowerFieldExpansionUpgradeLevel !== undefined) window.terrariumFlowerFieldExpansionUpgradeLevel = 0;
    if (window.terrariumFlowerUpgrade4Level !== undefined) window.terrariumFlowerUpgrade4Level = 0;
    if (window.terrariumKpNectarUpgradeLevel !== undefined) window.terrariumKpNectarUpgradeLevel = 0;
    if (window.terrariumPollenFlowerNectarUpgradeLevel !== undefined) window.terrariumPollenFlowerNectarUpgradeLevel = 0;
    if (window.terrariumNectarXpUpgradeLevel !== undefined) window.terrariumNectarXpUpgradeLevel = 0;
    if (window.terrariumNectarValueUpgradeLevel !== undefined) window.terrariumNectarValueUpgradeLevel = 0;
    
    // Reset nectarize system
    if (window.nectarUpgradeLevel !== undefined) window.nectarUpgradeLevel = 0;
    if (window.nectarUpgradeCost !== undefined) window.nectarUpgradeCost = 100;
    if (window.nectarizeMilestones !== undefined) window.nectarizeMilestones = [];
    if (window.nectarizeMilestoneLevel !== undefined) window.nectarizeMilestoneLevel = 0;
    if (window.nectarizeResets !== undefined) window.nectarizeResets = 0;
    if (window.nectarizeResetBonus !== undefined) window.nectarizeResetBonus = 0;
    if (window.nectarizeTier !== undefined) window.nectarizeTier = 0;
    if (window.nectarizePostResetTokenRequirement !== undefined) window.nectarizePostResetTokenRequirement = 0;
    if (window.nectarizePostResetTokensGiven !== undefined) window.nectarizePostResetTokensGiven = 0;
    if (window.nectarizePostResetTokenType !== undefined) window.nectarizePostResetTokenType = 'petals';
    
    
    // Update all UIs after reset
    if (typeof updateUI === 'function') updateUI();
    if (typeof updateKnowledgeUI === 'function') updateKnowledgeUI();
    if (typeof updateGradeUI === 'function') updateGradeUI();
    if (typeof updateGeneratorUpgradesUI === 'function') updateGeneratorUpgradesUI();
    if (typeof renderGenerators === 'function') renderGenerators();
    if (typeof window.updateChargerUI === 'function') window.updateChargerUI();
    if (typeof window.renderTerrariumUI === 'function') window.renderTerrariumUI();
    if (typeof window.updateLightGeneratorButtons === 'function') window.updateLightGeneratorButtons();
    
    // Recalculate element effects with only preserved elements
    if (typeof recalculateAllElementEffects === 'function') recalculateAllElementEffects();
    
    // Force element synchronization
    if (typeof window.syncElementsToState === 'function') window.syncElementsToState();
    if (typeof window.updateElementVisibility === 'function') window.updateElementVisibility();
    
    // Save the game state after reset
    // Save system disabled
    
}

// Challenge-specific nerf system
function applyChallengeNerfs(amount, currencyType) {
    if (window.activeChallenge === 0 || typeof window.activeChallenge === 'undefined') {
        return amount; // No challenge active, no nerfs
    }
    
    // IC:1 nerfs - square root for main currencies
    if (window.activeChallenge === 1) {
        const nerfedCurrencies = ['fluff', 'swaria', 'feathers', 'artifacts'];
        if (nerfedCurrencies.includes(currencyType)) {
            // Apply square root nerf
            if (typeof amount === 'object' && amount.sqrt) {
                // Handle Decimal objects
                return amount.sqrt();
            } else if (typeof amount === 'number' && amount > 0) {
                // Handle regular numbers
                return Math.sqrt(amount);
            }
        }
    }
    
    // Add more challenge nerfs here for IC:2, IC:3, IC:4 when implemented
    
    return amount; // Return original amount if no nerf applies
}

// Helper function to check if challenge nerf should apply to a currency
function shouldApplyChallengeNerf(currencyType) {
    if (activeChallenge === 0) return false;
    
    if (activeChallenge === 1) {
        return ['fluff', 'swaria', 'feathers', 'artifacts'].includes(currencyType);
    }
    
    // Add more challenge conditions here
    return false;
}

// Make nerf functions globally available
window.applyChallengeNerfs = applyChallengeNerfs;
window.shouldApplyChallengeNerf = shouldApplyChallengeNerf;

// Get current challenge effect description
function getCurrentChallengeEffectText() {
    if (activeChallenge === 0) {
        return "No challenge active";
    }
    
    const challenge = infinityChallenges[activeChallenge];
    if (!challenge) return "Unknown challenge";
    
    const difficulty = challenge.difficulties[activeDifficulty];
    if (!difficulty) return "Unknown difficulty";
    
    let effectText = difficulty.effect;
    
    // Add specific nerf descriptions for active challenges
    if (activeChallenge === 1) {
        effectText += " | ACTIVE NERF: √(Fluff/Swaria/Feathers/Artifacts gain)";
    }
    
    return effectText;
}

// Update challenge effect display in UI
function updateChallengeEffectDisplay() {
    const effectElement = document.getElementById('challengeEffect');
    if (effectElement) {
        effectElement.textContent = getCurrentChallengeEffectText();
        
        // Add visual styling for active challenge
        if (activeChallenge > 0) {
            effectElement.style.color = '#ff6600';
            effectElement.style.fontWeight = 'bold';
        } else {
            effectElement.style.color = '';
            effectElement.style.fontWeight = '';
        }
    }
}

// Make effect functions globally available
window.getCurrentChallengeEffectText = getCurrentChallengeEffectText;
window.updateChallengeEffectDisplay = updateChallengeEffectDisplay;

// Start a new infinity challenge
function startChallenge() {
    const challenge = infinityChallenges[selectedChallenge];
    if (!challenge) {
        alert('Challenge not found!');
        return;
    }
    
    const currentDiff = challenge.currentDifficulty;
    const difficulty = challenge.difficulties[currentDiff];
    
    if (!difficulty || !difficulty.unlocked) {
        alert('This challenge difficulty is not unlocked yet!');
        return;
    }
    
    // Confirmation dialog
    const confirmMessage = `Are you sure you want to start ${difficulty.name}?\n\nThis will reset ALL progress (currencies, upgrades, elements except 7&8)!\n\nChallenge Goal: ${difficulty.requirement}\nEffect: ${difficulty.effect}`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Perform comprehensive reset before starting challenge
    performInfinityChallengeReset();
    
    // Set active challenge
    activeChallenge = selectedChallenge;
    activeDifficulty = currentDiff;
    
    // Update global references for save system
    window.activeChallenge = activeChallenge;
    window.activeDifficulty = activeDifficulty;
    
    // Force infinity reset without affecting expansion levels
    forceInfinityResetForChallenge();
    
    // Update UI to show challenge is active
    updateChallengeUI();
    updateChallengeButton();
    updateInfinityChallengeFilter();
    updateChallengeEffectDisplay();
    

}

// Exit current challenge without completion
function exitCurrentChallenge() {
    if (activeChallenge === 0) return;
    
    const challenge = infinityChallenges[activeChallenge];
    const difficulty = challenge.difficulties[activeDifficulty];
    
    const confirmMessage = `Are you sure you want to exit ${difficulty.name}?\n\nYou will lose all progress and not get any rewards.`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Clear active challenge
    activeChallenge = 0;
    activeDifficulty = 0;
    
    // Update global references for save system
    window.activeChallenge = activeChallenge;
    window.activeDifficulty = activeDifficulty;
    
    // Update UI
    updateChallengeUI();
    updateChallengeButton();
    updateInfinityChallengeFilter();
    updateChallengeEffectDisplay();
    

}

// Complete the current challenge
function completeCurrentChallenge() {
    if (activeChallenge === 0) return;
    
    completeChallenge(activeChallenge, activeDifficulty);
    updateChallengeButton();
}

// Check if current challenge can be completed
function canCompleteCurrentChallenge() {
    if (activeChallenge === 0 || activeDifficulty === 0) return false;
    
    const challenge = infinityChallenges[activeChallenge];
    if (!challenge || !challenge.difficulties) return false;
    
    const difficulty = challenge.difficulties[activeDifficulty];
    if (!difficulty) return false;
    
    // Check if any currency has actually reached infinity in this challenge run
    // We need to check the actual current infinity counts, not total earned from previous resets
    let currentInfinityCount = 0;
    if (window.state && window.state.fluffInfinityCount) {
        currentInfinityCount += window.state.fluffInfinityCount.toNumber();
    }
    if (window.state && window.state.swariaInfinityCount) {
        currentInfinityCount += window.state.swariaInfinityCount.toNumber();
    }
    if (window.state && window.state.feathersInfinityCount) {
        currentInfinityCount += window.state.feathersInfinityCount.toNumber();
    }
    if (window.state && window.state.artifactsInfinityCount) {
        currentInfinityCount += window.state.artifactsInfinityCount.toNumber();
    }
    
    // For challenge IC:1-1, we need at least 1 total infinity from current run
    return currentInfinityCount >= difficulty.infinityTarget;
}

// Update the challenge button text based on current state
function updateChallengeButton() {
    const buttonEl = document.getElementById('startChallengeBtn');
    if (!buttonEl) return;
    
    if (activeChallenge === 0) {
        // Not in a challenge
        buttonEl.textContent = 'Start Infinity Challenge';
        buttonEl.style.background = 'linear-gradient(135deg, #ff6600, #ff8800)';
        buttonEl.style.borderColor = '#ff6600';
    } else if (canCompleteCurrentChallenge()) {
        // Can complete the challenge
        buttonEl.textContent = 'Complete Infinity Challenge';
        buttonEl.style.background = 'linear-gradient(135deg, #00cc00, #00aa00)';
        buttonEl.style.borderColor = '#00cc00';
    } else {
        // In a challenge but can't complete yet
        buttonEl.textContent = 'Exit Infinity Challenge';
        buttonEl.style.background = 'linear-gradient(135deg, #cc0000, #aa0000)';
        buttonEl.style.borderColor = '#cc0000';
    }
    
    // Update the visual filter based on challenge state
    updateInfinityChallengeFilter();
}

// Update the infinity challenge visual filter
function updateInfinityChallengeFilter() {
    const filterEl = document.getElementById('infinityChallengeFilter');
    if (!filterEl) return;
    
    if (activeChallenge > 0) {
        // Challenge is active - show filter
        filterEl.classList.add('active');
        
        // Add individual floating symbols if not already present
        if (!filterEl.querySelector('.infinity-symbol-1')) {
            addFloatingSymbols(filterEl);
        }
        

    } else {
        // No challenge active - hide filter
        filterEl.classList.remove('active');
        
        // Remove individual floating symbols
        removeFloatingSymbols(filterEl);
        

    }
}

// Add individual floating symbols to the filter - optimized with fewer symbols
function addFloatingSymbols(filterEl) {
    const symbols = ['∧', '∞', '∧', '∞']; // Reduced from 8 to 4 symbols
    
    for (let i = 1; i <= 4; i++) {
        const symbol = document.createElement('div');
        symbol.className = `infinity-symbol-${i}`;
        symbol.textContent = symbols[i - 1];
        
        // Make infinity symbols slightly larger
        if (symbols[i - 1] === '∞') {
            symbol.style.fontSize = '22px';
            symbol.style.color = 'rgba(123, 104, 238, 0.45)';
        }
        
        // Add performance optimizations
        symbol.style.willChange = 'transform';
        symbol.style.transform = 'translate3d(0, 0, 0)';
        
        filterEl.appendChild(symbol);
    }
}

// Remove individual floating symbols from the filter
function removeFloatingSymbols(filterEl) {
    const symbols = filterEl.querySelectorAll('[class^="infinity-symbol-"]');
    symbols.forEach(symbol => symbol.remove());
}

// Force infinity reset for challenge (preserves expansion levels)
function forceInfinityResetForChallenge() {
    // Reset all currencies but preserve expansion level
    const currentExpansion = window.state.grade;
    
    // Call the regular infinity reset
    if (typeof window.infinitySystem.performInfinityReset === 'function') {
        window.infinitySystem.performInfinityReset();
    }
    
    // Restore expansion level
    if (currentExpansion) {
        window.state.grade = currentExpansion;
    }
    
    // Re-enforce challenge-specific resets that may have been overridden
    // Reset KP to 0 (instead of 1 from regular infinity reset)
    if (window.state && typeof window.state.kp !== 'undefined') {
        window.state.kp = new Decimal(0);
    }
    if (typeof swariaKnowledge !== 'undefined' && swariaKnowledge) {
        swariaKnowledge.kp = new Decimal(0);
    }
    
    // Re-enforce element reset (keep only 7 and 8)
    const preservedElements = {};
    if (window.boughtElements && (window.boughtElements[7] || window.boughtElements["7"])) {
        preservedElements[7] = true;
        preservedElements["7"] = true;
    }
    if (window.boughtElements && (window.boughtElements[8] || window.boughtElements["8"])) {
        preservedElements[8] = true;
        preservedElements["8"] = true;
    }
    
    // Reset all element references again
    window.boughtElements = preservedElements;
    if (window.state && window.state.boughtElements) {
        window.state.boughtElements = preservedElements;
    }
    if (typeof boughtElements !== 'undefined') {
        boughtElements = preservedElements;
    }
    
}

// Update challenge UI
function updateChallengeUI() {
    // Update challenge visibility first
    updateChallengeVisibility();
    
    // Update challenge buttons with difficulty completion info
    Object.keys(infinityChallenges).forEach(id => {
        const challenge = infinityChallenges[id];
        const completionEl = document.getElementById(`ic${id}Completion`);
        const buttonEl = document.getElementById(`ic${id}Btn`);
        const containerEl = document.getElementById(`ic${id}Container`);
        
        // Handle visibility
        if (containerEl) {
            if (challenge.visible) {
                containerEl.style.display = 'flex';
            } else {
                containerEl.style.display = 'none';
            }
        }
        
        if (completionEl && challenge.difficulties) {
            // Show current difficulty and completed difficulties
            const currentDiff = challenge.currentDifficulty;
            const maxDiff = challenge.maxDifficulty;
            let completedCount = 0;
            
            // Count completed difficulties
            for (let i = 1; i <= maxDiff; i++) {
                if (challenge.difficulties[i] && challenge.difficulties[i].completed) {
                    completedCount++;
                }
            }
            
            completionEl.textContent = `${completedCount}/${maxDiff}`;
        }
        
        if (buttonEl && challenge.difficulties) {
            const currentDiff = challenge.currentDifficulty;
            const difficulty = challenge.difficulties[currentDiff];
            
            if (difficulty && difficulty.unlocked) {
                buttonEl.classList.remove('locked');
                buttonEl.setAttribute('data-unlocked', 'true');
            } else {
                buttonEl.classList.add('locked');
                buttonEl.setAttribute('data-unlocked', 'false');
            }
            
            // Highlight active challenge
            if (activeChallenge == id) {
                buttonEl.style.border = '3px solid #ff6600';
                buttonEl.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.8)';
            } else {
                buttonEl.style.border = '';
                buttonEl.style.boxShadow = '';
            }
        }
    });
}

// Update challenge visibility based on unlock conditions
function updateChallengeVisibility() {
    const ic2 = infinityChallenges[2];
    const ic3 = infinityChallenges[3]; 
    const ic4 = infinityChallenges[4];
    
    // IC:3 becomes visible (greyed out) when IC:2 is unlocked
    if (ic2 && ic2.difficulties[1] && ic2.difficulties[1].unlocked && ic3) {
        ic3.visible = true;
    }
    
    // IC:4 becomes visible (greyed out) when IC:3 is unlocked
    if (ic3 && ic3.difficulties[1] && ic3.difficulties[1].unlocked && ic4) {
        ic4.visible = true;
    }
}

// Check challenge completion
function checkChallengeCompletion() {
    if (activeChallenge === 0 || activeDifficulty === 0) return;
    
    const challenge = infinityChallenges[activeChallenge];
    if (!challenge || !challenge.difficulties) return;
    
    const difficulty = challenge.difficulties[activeDifficulty];
    if (!difficulty) return;
    
    // Update button state based on current progress
    updateChallengeButton();
    
    // Auto-complete is disabled - let player click the button to complete
    // This gives them control over when to complete the challenge
}

// Complete a challenge
function completeChallenge(challengeId, difficultyLevel) {
    const challenge = infinityChallenges[challengeId];
    if (!challenge || !challenge.difficulties) return;
    
    const difficulty = challenge.difficulties[difficultyLevel];
    if (!difficulty) return;
    
    // Mark this difficulty as completed
    difficulty.completed = true;
    
    // Clear active challenge
    activeChallenge = 0;
    activeDifficulty = 0;
    
    // Update global references for save system
    window.activeChallenge = activeChallenge;
    window.activeDifficulty = activeDifficulty;
    
    // Show completion message
    alert(`Congratulations! You completed ${difficulty.name}!\n\nReward: ${difficulty.reward}\n\nEffect: ${difficulty.effect}`);
    
    // Unlock next difficulty in same challenge if available
    const nextDiff = difficultyLevel + 1;
    if (challenge.difficulties[nextDiff]) {
        challenge.difficulties[nextDiff].unlocked = true;
        challenge.currentDifficulty = nextDiff;

    }
    
    // Unlock next challenge based on completion
    if (challengeId === 1 && difficultyLevel === 1) {
        // IC:1-1 completion unlocks IC:2-1
        if (infinityChallenges[2] && infinityChallenges[2].difficulties[1]) {
            infinityChallenges[2].difficulties[1].unlocked = true;
            infinityChallenges[2].visible = true;

        }
    } else if (challengeId === 2 && difficultyLevel === 1) {
        // IC:2-1 completion unlocks IC:3-1 and makes IC:3 visible
        if (infinityChallenges[3] && infinityChallenges[3].difficulties[1]) {
            infinityChallenges[3].difficulties[1].unlocked = true;
            infinityChallenges[3].visible = true;

        }
    } else if (challengeId === 3 && difficultyLevel === 1) {
        // IC:3-1 completion unlocks IC:4-1 and makes IC:4 visible
        if (infinityChallenges[4] && infinityChallenges[4].difficulties[1]) {
            infinityChallenges[4].difficulties[1].unlocked = true;
            infinityChallenges[4].visible = true;

        }
    }
    
    // Update UI
    updateChallengeUI();
    updateChallengeButton();
    updateInfinityChallengeFilter();
    updateChallengeEffectDisplay();
    
}

// Initialize challenge system
window.initializeInfinityChallenges = function() {
    // Restore global references after loading
    if (typeof window.activeChallenge !== 'undefined') {
        activeChallenge = window.activeChallenge;
    }
    if (typeof window.activeDifficulty !== 'undefined') {
        activeDifficulty = window.activeDifficulty;
    }
    
    // Set up initial UI
    updateChallengeUI();
    
    // If there's an active challenge, select it and update the UI
    if (activeChallenge > 0) {
        selectInfinityChallenge(activeChallenge);
        updateChallengeButton();
        updateInfinityChallengeFilter();

    } else {
        // Select first challenge by default if none active
        selectInfinityChallenge(1);
    }
    
    // Start the boost display updater
    startBoostDisplayUpdater();
    

};

// Update the current boost display every second
function startBoostDisplayUpdater() {
    setInterval(() => {
        updateChallengeBoostDisplay();
        updateChallengeButton(); // Also update button state every second
    }, 1000);
}

// Calculate and display current cargo boost from completed challenges
function updateChallengeBoostDisplay() {
    const boostElement = document.getElementById('challengeCurrentBoost');
    if (!boostElement) return;
    
    let currentBoost = 1; // Default multiplier
    
    // Check IC:1 completions for cargo boost
    const ic1 = infinityChallenges[1];
    if (ic1 && ic1.difficulties) {
        let highestCompletedDiff = 0;
        
        // Find highest completed difficulty
        for (let i = 1; i <= ic1.maxDifficulty; i++) {
            if (ic1.difficulties[i] && ic1.difficulties[i].completed) {
                highestCompletedDiff = i;
            }
        }
        
        // Calculate boost based on highest completed difficulty and current KP
        if (highestCompletedDiff > 0 && window.state && window.state.swabucks) {
            const kpAmount = window.state.swabucks;
            if (kpAmount.gt(0)) {
                let baseBoost = kpAmount; // IC:1-1 base: direct KP multiplier
                
                // Apply difficulty multipliers
                if (highestCompletedDiff >= 2) {
                    // IC:1-2: 500% better = 6x multiplier
                    baseBoost = baseBoost.mul(6);
                }
                if (highestCompletedDiff >= 3) {
                    // IC:1-3: 10000% better = 101x multiplier (total: 6 * 101 = 606x)
                    baseBoost = baseBoost.mul(101);
                }
                if (highestCompletedDiff >= 4) {
                    // IC:1-4: 1e8% better = 1e6+1 multiplier
                    baseBoost = baseBoost.mul(new Decimal(1e6).add(1));
                }
                if (highestCompletedDiff >= 5) {
                    // IC:1-5: 1e30% better = 1e28+1 multiplier
                    baseBoost = baseBoost.mul(new Decimal('1e28').add(1));
                }
                
                currentBoost = baseBoost.toNumber();
                
                // Handle extremely large numbers with Decimal
                if (baseBoost.gte(1e308) || !isFinite(currentBoost)) {
                    currentBoost = baseBoost; // Keep as Decimal for display
                }
            }
        }
    }
    
    // Format the boost display
    let boostText;
    
    // Handle Decimal objects (very large numbers)
    if (typeof currentBoost === 'object' && currentBoost.toString) {
        const boostStr = currentBoost.toString();
        if (boostStr.includes('e') || currentBoost.gte('1e6')) {
            // Scientific notation for numbers >= 1e6
            boostText = `x${currentBoost.toExponential(2)}`;
        } else if (currentBoost.gte('1e3')) {
            boostText = `x${(currentBoost.div('1e3')).toFixed(2)}K`;
        } else {
            boostText = `x${currentBoost.toFixed(2)}`;
        }
    } else {
        // Handle regular numbers
        if (currentBoost >= 1e6) {
            boostText = `x${currentBoost.toExponential(2)}`;
        } else if (currentBoost >= 1000) {
            boostText = `x${(currentBoost / 1000).toFixed(2)}K`;
        } else if (currentBoost >= 100) {
            boostText = `x${Math.floor(currentBoost)}`;
        } else if (currentBoost >= 10) {
            boostText = `x${currentBoost.toFixed(1)}`;
        } else {
            boostText = `x${currentBoost.toFixed(2)}`;
        }
    }
    
    boostElement.textContent = `Current Boost: ${boostText} to all cargo currencies`;
}

// Fix for tilted/moving infinity counters - prevent unwanted animations
const infinityCounterStyle = document.createElement('style');
infinityCounterStyle.textContent = `
/* Prevent any unwanted animations or transforms on infinity counters */
.infinity-count,
.nerf-value,
span[id*="InfinityCount"],
span[id*="NerfValue"] {
    animation: none !important;
    transform: none !important;
    will-change: auto !important;
}

/* Override the shimmer animation that might be causing issues */
.infinity-count {
    animation: shimmer 3s ease-in-out infinite !important;
    /* Keep the shimmer but ensure no transform is applied */
    transform: none !important;
}
`;
document.head.appendChild(infinityCounterStyle);

// Run migration when file loads
migrateInfinitySystemToState();

// Console command to verify the integration
window.testInfinityIntegration = function() {
  console.log('✓ Infinity system initialized in window.state');
  console.log('window.state.infinitySystem:', window.state.infinitySystem);
  console.log('window.infinitySystem (reference):', {
    counts: window.infinitySystem.counts,
    everReached: window.infinitySystem.everReached,
    infinityPoints: window.infinitySystem.infinityPoints?.toString() || '0',
    totalInfinityEarned: window.infinitySystem.totalInfinityEarned
  });
  
  // Test that modifications work through the reference
  const oldFluffCount = window.infinitySystem.counts.fluff;
  window.infinitySystem.counts.fluff = 999;
  const newStateValue = window.state.infinitySystem.counts.fluff;
  window.infinitySystem.counts.fluff = oldFluffCount; // restore
  
  if (newStateValue === 999) {
    console.log('✓ Reference system working correctly');
    return { success: true, message: 'Infinity system successfully integrated with window.state' };
  } else {
    console.log('✗ Reference system failed');
    return { success: false, message: 'Integration failed' };
  }
};
