const memoryStats = {
    startHeapSize: 0,
    currentHeapSize: 0,
    maxHeapSize: 0,
    lastGCTime: 0,
    gcCount: 0
};
const managedEventListeners = new WeakMap();

// Global save throttling to prevent localStorage quota exceeded errors
let lastSaveTime = 0;
let pendingSave = false;
const SAVE_THROTTLE_MS = 3000; // 3 second minimum between saves

// localStorage monitoring system
const localStorageMonitor = {
    baselineSize: 0,
    currentSize: 0,
    lastCheckTime: 0,
    sizeHistory: [],
    maxHistoryLength: 50,
    warningThreshold: 5 * 1024 * 1024, // 5MB increase warning
    criticalThreshold: 8 * 1024 * 1024, // 8MB increase critical
    
    calculateCurrentSize() {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        return totalSize;
    },
    
    detectMajorAdditions() {
        const now = Date.now();
        const currentSize = this.calculateCurrentSize();
        const sizeDiff = currentSize - this.currentSize;
        
        // Update current size
        this.currentSize = currentSize;
        
        // Add to history
        this.sizeHistory.push({
            timestamp: now,
            size: currentSize,
            diff: sizeDiff
        });
        
        // Keep history manageable
        if (this.sizeHistory.length > this.maxHistoryLength) {
            this.sizeHistory.shift();
        }
        
        // Check for major additions (only log significant issues)
        if (sizeDiff > this.warningThreshold) {
            console.warn(`🚨 MAJOR localStorage addition detected: +${(sizeDiff / 1024 / 1024).toFixed(2)}MB`);
            console.warn(`Total localStorage size: ${(currentSize / 1024 / 1024).toFixed(2)}MB`);
            
            if (sizeDiff > this.criticalThreshold) {
                console.error(`🔥 CRITICAL localStorage growth: +${(sizeDiff / 1024 / 1024).toFixed(2)}MB - Running cleanup...`);
                cleanupLocalStorage();
                return true; // Indicates cleanup was triggered
            }
        }
        
        return false;
    },
    
    getStorageReport() {
        const currentSize = this.calculateCurrentSize();
        const totalGrowth = currentSize - this.baselineSize;
        
        return {
            currentSizeMB: (currentSize / 1024 / 1024).toFixed(2),
            baselineSizeMB: (this.baselineSize / 1024 / 1024).toFixed(2),
            totalGrowthMB: (totalGrowth / 1024 / 1024).toFixed(2),
            keyCount: Object.keys(localStorage).length,
            recentHistory: this.sizeHistory.slice(-5)
        };
    },
    
    startMonitoring() {
        // Set baseline
        this.baselineSize = this.calculateCurrentSize();
        this.currentSize = this.baselineSize;
        
        
        // Check every 30 seconds for major additions
        setInterval(() => {
            this.detectMajorAdditions();
        }, 30000);
    }
};

// Safe localStorage operations with quota handling and monitoring
function safeLocalStorageSetItem(key, value) {
    const sizeBefore = localStorageMonitor.calculateCurrentSize();
    
    try {
        localStorage.setItem(key, value);
        
        // Check for major addition after successful write
        const sizeAfter = localStorageMonitor.calculateCurrentSize();
        const sizeIncrease = sizeAfter - sizeBefore;
        
        if (sizeIncrease > 1024 * 1024) { // 1MB+ addition
            console.warn(`📈 Large localStorage write detected: "${key}" added ${(sizeIncrease / 1024 / 1024).toFixed(2)}MB`);
            localStorageMonitor.detectMajorAdditions();
        }
        
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn(`🚨 localStorage quota exceeded writing "${key}" (${(value.length / 1024).toFixed(1)}KB), attempting cleanup...`);
            cleanupLocalStorage();
            try {
                localStorage.setItem(key, value);
                localStorageMonitor.detectMajorAdditions();
                return true;
            } catch (retryError) {
                console.error('localStorage operation failed even after cleanup:', retryError);
                return false;
            }
        }
        console.error('localStorage setItem failed:', error);
        return false;
    }
}

function safeLocalStorageGetItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('localStorage getItem failed:', error);
        return null;
    }
}

function addManagedEventListener(element, event, handler, options) {
    if (!managedEventListeners.has(element)) {
        managedEventListeners.set(element, []);
    }
    const listeners = managedEventListeners.get(element);
    listeners.push({ event, handler, options });
    element.addEventListener(event, handler, options);
}

function removeManagedEventListeners(element) {
    if (managedEventListeners.has(element)) {
        const listeners = managedEventListeners.get(element);
        listeners.forEach(({ event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        managedEventListeners.delete(element);
    }
}

function forceGarbageCollection() {
    if (window.gc && typeof window.gc === 'function') {
        window.gc();
        memoryStats.gcCount++;
        memoryStats.lastGCTime = Date.now();
    }
}

function updateMemoryStats() {
    if (performance.memory) {
        memoryStats.currentHeapSize = performance.memory.usedJSHeapSize;
        memoryStats.maxHeapSize = Math.max(memoryStats.maxHeapSize, memoryStats.currentHeapSize);
        if (memoryStats.startHeapSize === 0) {
            memoryStats.startHeapSize = memoryStats.currentHeapSize;
        }
    }
}

function detectMemoryLeaks() {
    updateMemoryStats();
    const memoryGrowth = memoryStats.currentHeapSize - memoryStats.startHeapSize;
    const memoryGrowthMB = memoryGrowth / 1048576;
    if (memoryGrowthMB > 100) { 

        forceGarbageCollection();
        if (window.clearDOMCache) window.clearDOMCache();
        if (window.gameOptimization) {
            window.gameOptimization.pendingDOMUpdates.clear();
        }
    }
}

class AdvancedThrottle {
    constructor() {
        this.timers = new Map();
        this.queues = new Map();
    }
    throttle(key, func, limit = 100, options = {}) {
        const now = Date.now();
        const { 
            leading = true, 
            trailing = true,
            maxWait = null 
        } = options;
        if (!this.timers.has(key)) {
            if (leading) {
                func();
            }
            this.timers.set(key, {
                lastCall: now,
                firstCall: now,
                timeoutId: null
            });
            const timeoutId = setTimeout(() => {
                this.timers.delete(key);
                if (trailing && this.queues.has(key)) {
                    const queuedFunc = this.queues.get(key);
                    this.queues.delete(key);
                    queuedFunc();
                }
            }, limit);
            this.timers.get(key).timeoutId = timeoutId;
            return;
        }
        const timer = this.timers.get(key);
        if (maxWait && (now - timer.firstCall) >= maxWait) {
            clearTimeout(timer.timeoutId);
            this.timers.delete(key);
            this.queues.delete(key);
            func();
            return;
        }
        if (trailing) {
            this.queues.set(key, func);
        }
    }
    debounce(key, func, delay = 100) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key).timeoutId);
        }
        const timeoutId = setTimeout(() => {
            this.timers.delete(key);
            func();
        }, delay);
        this.timers.set(key, {
            timeoutId,
            lastCall: Date.now()
        });
    }
    clear(key) {
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key).timeoutId);
            this.timers.delete(key);
        }
        this.queues.delete(key);
    }
    clearAll() {
        this.timers.forEach(timer => clearTimeout(timer.timeoutId));
        this.timers.clear();
        this.queues.clear();
    }
}
const globalThrottle = new AdvancedThrottle();

function optimizeEventHandlers() {
    const expensiveEvents = ['scroll', 'resize', 'mousemove', 'touchmove'];
    expensiveEvents.forEach(eventType => {
        if (!document[`_${eventType}Optimized`]) {
            const originalAddEventListener = Element.prototype.addEventListener;
            Element.prototype.addEventListener = function(type, listener, options) {
                if (type === eventType) {
                    const throttledListener = (...args) => {
                        globalThrottle.throttle(`${eventType}_${this.id || 'element'}`, 
                            () => listener.apply(this, args), 16); 
                    };
                    return originalAddEventListener.call(this, type, throttledListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
            document[`_${eventType}Optimized`] = true;
        }
    });
}

function cleanupResources() {
    const orphanedElements = document.querySelectorAll('[data-cleanup="true"]');
    orphanedElements.forEach(el => {
        removeManagedEventListeners(el);
        el.remove();
    });
    globalThrottle.clearAll();
    if (window.numberFormatCache && window.numberFormatCache.size > 1000) {
        window.numberFormatCache.clear();
    }
    if (window.domCache && window.domCache.size > 200) {
        window.domCache.clear();
    }
}

function setupAutomaticCleanup() {
    setInterval(() => {
        updateMemoryStats();
        detectMemoryLeaks();
    }, 30000);
    setInterval(cleanupResources, 120000);
    setInterval(() => {
        if (window.gc) {
            forceGarbageCollection();
        }
    }, 300000);
}

function optimizeSaveOperations() {
    if (typeof window.saveToLocalStorage === 'function' && !window._saveOptimized) {
        const originalSave = window.saveToLocalStorage;
        window.saveToLocalStorage = function() {
            globalThrottle.debounce('localStorage_save', originalSave, 1000);
        };
        window._saveOptimized = true;
    }
    
    // Add aggressive save throttling for saveGame function
    if (typeof window.saveGame === 'function' && !window._saveGameOptimized) {
        const originalSaveGame = window.saveGame;
        let lastSaveTime = 0;
        const SAVE_THROTTLE_MS = 5000; // Only allow saves every 5 seconds
        
        window.saveGame = function() {
            const now = Date.now();
            if (now - lastSaveTime < SAVE_THROTTLE_MS) {
                return; // Skip save if too recent
            }
            
            try {
                lastSaveTime = now;
                originalSaveGame();
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    console.warn('localStorage quota exceeded, cleaning up old data');
                    cleanupLocalStorage();
                    // Try save again after cleanup
                    try {
                        originalSaveGame();
                    } catch (secondError) {
                        console.error('Save failed even after cleanup:', secondError);
                    }
                } else {
                    console.error('Save error:', error);
                }
            }
        };
        window._saveGameOptimized = true;
    }
}

// Enhanced localStorage cleanup function for quota management
function cleanupLocalStorage() {
    try {
        const keys = Object.keys(localStorage);
        let cleanedCount = 0;
        
        // Priority 1: Remove obvious temporary/backup data
        const backupKeys = keys.filter(key => 
            key.includes('backup') || 
            key.includes('Backup') ||
            key.includes('_old') ||
            key.includes('temp') ||
            key.includes('_temp') ||
            key.includes('cache') ||
            key.includes('Cache')
        );
        
        backupKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                cleanedCount++;
            } catch (e) {
                // Ignore individual removal errors
            }
        });
        
        // Priority 2: Clean up old save slot data (keep only recent saves)
        const saveKeys = keys.filter(key => key.includes('SaveSlot') || key.includes('saveSlot'));
        if (saveKeys.length > 10) { // Keep only 10 most recent save slots
            saveKeys.sort().slice(0, -10).forEach(key => {
                try {
                    localStorage.removeItem(key);
                    cleanedCount++;
                } catch (e) {
                    // Ignore errors
                }
            });
        }
        
        // Priority 3: Remove old achievement flags and unlock keys
        const flagKeys = keys.filter(key => 
            key.includes('flag') || 
            key.includes('Flag') ||
            (key.includes('unlock') && key.length > 50) // Remove very long unlock keys
        );
        
        flagKeys.forEach(key => {
            try {
                localStorage.removeItem(key);
                cleanedCount++;
            } catch (e) {
                // Ignore individual removal errors
            }
        });
        
        // Priority 4: If still over quota, remove less critical data
        const nonEssentialKeys = keys.filter(key =>
            key.includes('stats') ||
            key.includes('optimization') ||
            key.includes('water') ||
            key.includes('observatory') ||
            key.includes('debug') ||
            key.includes('Debug')
        );
        
        nonEssentialKeys.slice(0, 5).forEach(key => {
            try {
                localStorage.removeItem(key);
                cleanedCount++;
            } catch (e) {
                // Ignore individual removal errors
            }
        });
        
        
        // Report current usage if possible
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
            });
        }
        
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

function createPerformanceMonitor() {
    const monitor = {
        getMemoryStats: () => ({
            ...memoryStats,
            currentMB: (memoryStats.currentHeapSize / 1048576).toFixed(1),
            maxMB: (memoryStats.maxHeapSize / 1048576).toFixed(1),
            growthMB: ((memoryStats.currentHeapSize - memoryStats.startHeapSize) / 1048576).toFixed(1)
        }),
        getThrottleStats: () => ({
            activeThrottles: globalThrottle.timers.size,
            queuedOperations: globalThrottle.queues.size
        }),
        getOverallStats: () => {
            updateMemoryStats();
            return {
                memory: monitor.getMemoryStats(),
                throttling: monitor.getThrottleStats(),
                optimizations: {
                    domOptimized: !!window._terrariumUIPatched,
                    loopsOptimized: !!window._mathPowOptimized,
                    gameLoopOptimized: window.gameOptimization?.isOptimized || false,
                    saveOptimized: !!window._saveOptimized
                }
            };
        }
    };
    window.performanceMonitor = monitor;
    return monitor;
}

function patchMemoryLeakSources() {
    if (!window._intervalTrackingPatched) {
        const activeIntervals = new Set();
        const originalSetInterval = window.setInterval;
        const originalClearInterval = window.clearInterval;
        window.setInterval = function(callback, delay) {
            const id = originalSetInterval(callback, delay);
            activeIntervals.add(id);
            return id;
        };
        window.clearInterval = function(id) {
            activeIntervals.delete(id);
            return originalClearInterval(id);
        };
        window.getActiveIntervals = () => activeIntervals.size;
        window.clearAllIntervals = () => {
            activeIntervals.forEach(id => clearInterval(id));
            activeIntervals.clear();
        };
        window._intervalTrackingPatched = true;
    }
}

function initializeMemoryOptimizations() {
    updateMemoryStats();
    optimizeEventHandlers();
    setupAutomaticCleanup();
    optimizeSaveOperations();
    patchMemoryLeakSources();
    createPerformanceMonitor();
    patchSaveGameForThrottling();
    patchLocalStorageOperations();
    
    // Start localStorage monitoring (quiet mode)
    localStorageMonitor.baselineSize = localStorageMonitor.calculateCurrentSize();
    localStorageMonitor.currentSize = localStorageMonitor.baselineSize;
    
    // Run initial cleanup if localStorage is near quota
    try {
        const testKey = 'quotaTest_' + Date.now();
        const testData = new Array(1000).join('x'); // 1KB test
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('localStorage quota detected as full, running immediate cleanup...');
            cleanupLocalStorage();
        }
    }
    
    // Add console command for manual storage report
    window.getStorageReport = () => {
        const report = localStorageMonitor.getStorageReport();
        return report;
    };
    
    // Add save operation tracking
    window.traceSaveOperations = () => {
        
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error
        };
        
        // Track stack traces for save calls
        if (!window.saveCallTracker) {
            window.saveCallTracker = [];
            
            // Wrap console methods to capture save-related logs
            console.log = function(...args) {
                if (args.some(arg => typeof arg === 'string' && (arg.includes('save') || arg.includes('Save')))) {
                    const stack = new Error().stack;
                    window.saveCallTracker.push({
                        timestamp: Date.now(),
                        type: 'log',
                        args: args,
                        stack: stack
                    });
                }
                originalConsole.log.apply(console, args);
            };
            
            console.error = function(...args) {
                if (args.some(arg => typeof arg === 'string' && (arg.includes('save') || arg.includes('Save') || arg.includes('quota') || arg.includes('QuotaExceeded')))) {
                    const stack = new Error().stack;
                    window.saveCallTracker.push({
                        timestamp: Date.now(),
                        type: 'error',
                        args: args,
                        stack: stack
                    });
                }
                originalConsole.error.apply(console, args);
            };
        }
        
        return 'Save operation tracing enabled. Use getSaveTrace() to view results.';
    };
    
    window.getSaveTrace = () => {
        if (window.saveCallTracker) {
            console.log('📋 Save operation trace:', window.saveCallTracker.slice(-10)); // Last 10 operations
            return window.saveCallTracker;
        }
        return 'No save trace available. Run traceSaveOperations() first.';
    };
    
    // Add enhanced game loop control
    window.stopConflictingLoops = () => {
        console.log('🔄 Stopping potentially conflicting game loops...');
        let stoppedCount = 0;
        
        // First, disable game optimization to prevent new loops
        if (window.gameOptimization) {
            window.gameOptimization.isOptimized = false;
            console.log('🛑 Disabled game optimization to stop new loops');
        }
        
        // Cancel animation frames more aggressively
        for (let i = 1; i < 100000; i++) {
            try {
                cancelAnimationFrame(i);
                stoppedCount++;
            } catch (e) {
                // Ignore errors
            }
        }
        
        console.log(`🛑 Cancelled ${stoppedCount} potential animation frames`);
        
        // Reset game optimization state
        if (window.gameOptimization) {
            window.gameOptimization.frameId = null;
            window.gameOptimization.lastFrameTime = 0;
            console.log('🎮 Reset game optimization state');
        }
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
            console.log('�️ Forced garbage collection');
        }
        
        return `Stopped ${stoppedCount} animation frames and reset game state`;
    };
    
    window.restartGameLoop = () => {
        console.log('🔄 Restarting game loop safely...');
        
        // Stop existing loops first
        window.stopConflictingLoops();
        
        // Wait a bit for cleanup
        setTimeout(() => {
            if (window.gameOptimization) {
                window.gameOptimization.isOptimized = true;
                window.gameOptimization.frameId = requestAnimationFrame(window.optimizedGameLoop || function() {
                    console.warn('optimizedGameLoop not available');
                });
                console.log('✅ Game loop restarted');
            }
        }, 1000);
    };
    
    // Add enhanced diagnostic tools
    window.diagnoseLocalStorage = () => {
        console.log('🔍 Running localStorage diagnostics...');
        
        // Test actual quota limits
        let testSize = 0;
        try {
            const testKey = 'quotaDiagnostic_' + Date.now();
            const largeData = new Array(1024 * 1024).join('x'); // 1MB chunks
            
            for (let i = 0; i < 10; i++) {
                localStorage.setItem(testKey + '_' + i, largeData);
                testSize += largeData.length;
                console.log(`✅ Successfully wrote ${i + 1}MB`);
            }
            
            // Clean up test data
            for (let i = 0; i < 10; i++) {
                localStorage.removeItem(testKey + '_' + i);
            }
            
        } catch (error) {
            console.log(`❌ Real quota limit reached at ${(testSize / 1024 / 1024).toFixed(2)}MB`);
            console.log('Error:', error);
        }
        
        // Check for corrupted keys
        const keys = Object.keys(localStorage);
        console.log(`📋 Total localStorage keys: ${keys.length}`);
        
        const largeSizes = [];
        keys.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                const size = (key.length + (value ? value.length : 0));
                if (size > 100 * 1024) { // > 100KB
                    largeSizes.push({ key, sizeMB: (size / 1024 / 1024).toFixed(3) });
                }
            } catch (e) {
                console.warn(`⚠️ Corrupted key detected: "${key}" - ${e.message}`);
            }
        });
        
        if (largeSizes.length > 0) {
            console.log('📦 Large localStorage items:', largeSizes);
        }
        
        return {
            totalKeys: keys.length,
            largeItems: largeSizes,
            actualQuotaWorking: testSize > 0
        };
    };
    
    // Add localStorage content inspection
    window.inspectLocalStorage = () => {
        console.log('🔍 Inspecting localStorage contents...');
        
        const keys = Object.keys(localStorage);
        const analysis = {
            totalKeys: keys.length,
            totalSize: 0,
            keysBySize: [],
            keysByType: {},
            suspiciousKeys: []
        };
        
        keys.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                const size = key.length + (value ? value.length : 0);
                analysis.totalSize += size;
                
                analysis.keysBySize.push({
                    key: key,
                    sizeMB: (size / 1024 / 1024).toFixed(3),
                    valuePreview: value ? value.substring(0, 100) + (value.length > 100 ? '...' : '') : 'null'
                });
                
                // Categorize by type
                const keyType = key.split(/[0-9]|_|-/)[0];
                if (!analysis.keysByType[keyType]) {
                    analysis.keysByType[keyType] = { count: 0, totalSize: 0 };
                }
                analysis.keysByType[keyType].count++;
                analysis.keysByType[keyType].totalSize += size;
                
                // Flag suspicious keys
                if (size > 1024 * 1024 || key.length > 200 || (value && value.includes('QuotaExceeded'))) {
                    analysis.suspiciousKeys.push({ key, reason: 'Large size or suspicious content', sizeMB: (size/1024/1024).toFixed(3) });
                }
                
            } catch (error) {
                analysis.suspiciousKeys.push({ key, reason: 'Error reading key: ' + error.message });
            }
        });
        
        // Sort by size
        analysis.keysBySize.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));
        
        console.log('📊 localStorage Analysis:', {
            summary: {
                totalKeys: analysis.totalKeys,
                totalSizeMB: (analysis.totalSize / 1024 / 1024).toFixed(2),
                averageKeySizeKB: (analysis.totalSize / analysis.totalKeys / 1024).toFixed(1)
            },
            largestKeys: analysis.keysBySize.slice(0, 10),
            keyTypes: analysis.keysByType,
            suspiciousKeys: analysis.suspiciousKeys
        });
        
        // Clean up our own diagnostic keys
        const diagnosticKeys = keys.filter(key => key.startsWith('quotaDiagnostic_') || key.startsWith('quotaTest_'));
        if (diagnosticKeys.length > 0) {
            console.log(`🧹 Cleaning up ${diagnosticKeys.length} diagnostic keys...`);
            diagnosticKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    console.warn('Failed to remove diagnostic key:', key);
                }
            });
        }
        
        return analysis;
    };
    
    // Add function to clean up large saves
    window.cleanupLargeSaves = () => {
        console.log('🧹 Cleaning up large save files...');
        const keys = Object.keys(localStorage);
        let cleanedSpace = 0;
        
        keys.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                const size = key.length + (value ? value.length : 0);
                
                // Remove saves larger than 2MB or diagnostic keys
                if (size > 2 * 1024 * 1024 || key.includes('diagnostic') || key.includes('quotaTest')) {
                    localStorage.removeItem(key);
                    cleanedSpace += size;
                    console.log(`🗑️ Removed "${key}" (${(size/1024/1024).toFixed(2)}MB)`);
                }
            } catch (e) {
                console.warn('Error cleaning key:', key, e);
            }
        });
        
        console.log(`✅ Cleaned up ${(cleanedSpace/1024/1024).toFixed(2)}MB of localStorage space`);
        return cleanedSpace;
    };
    
    // Add localStorage corruption recovery
    window.repairLocalStorage = () => {
        console.log('🔧 Attempting localStorage corruption repair...');
        
        // Test basic localStorage functionality
        const testResults = {
            canRead: false,
            canWrite: false,
            canDelete: false,
            corruption: [],
            recovered: []
        };
        
        try {
            // Test read capability
            const keys = Object.keys(localStorage);
            testResults.canRead = true;
            console.log(`✅ Can read localStorage (${keys.length} keys)`);
            
            // Test write capability with small data
            const testKey = 'repairTest_' + Date.now();
            localStorage.setItem(testKey, 'test');
            testResults.canWrite = true;
            console.log('✅ Can write to localStorage');
            
            // Test delete capability
            localStorage.removeItem(testKey);
            testResults.canDelete = true;
            console.log('✅ Can delete from localStorage');
            
        } catch (error) {
            console.error('❌ Basic localStorage test failed:', error);
            if (error.name === 'QuotaExceededError') {
                console.log('🔍 Quota error on tiny write - localStorage is corrupted');
                
                // Try nuclear option - clear everything and restore essential data
                const essentialData = {};
                try {
                    // Save current save slot info
                    const currentSlot = localStorage.getItem('currentSaveSlot');
                    if (currentSlot) essentialData.currentSaveSlot = currentSlot;
                    
                    // Save settings
                    const settings = localStorage.getItem('swariaSettings');
                    if (settings) essentialData.swariaSettings = settings;
                    
                    console.log('💾 Backed up essential data:', Object.keys(essentialData));
                } catch (backupError) {
                    console.warn('⚠️ Could not backup data:', backupError);
                }
                
                // Nuclear option - clear everything
                try {
                    localStorage.clear();
                    console.log('🧨 localStorage cleared completely');
                    
                    // Restore essential data
                    Object.entries(essentialData).forEach(([key, value]) => {
                        try {
                            localStorage.setItem(key, value);
                            testResults.recovered.push(key);
                        } catch (restoreError) {
                            console.warn(`Failed to restore ${key}:`, restoreError);
                        }
                    });
                    
                    console.log(`✅ Restored ${testResults.recovered.length} essential items`);
                    return { success: true, message: 'localStorage repaired by clearing', recovered: testResults.recovered };
                    
                } catch (clearError) {
                    console.error('❌ Could not clear localStorage:', clearError);
                    return { success: false, message: 'localStorage repair failed - browser issue' };
                }
            }
        }
        
        // If basic tests pass, check for corrupted keys
        if (testResults.canRead) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                try {
                    const value = localStorage.getItem(key);
                    if (value === null && localStorage.hasOwnProperty(key)) {
                        testResults.corruption.push(key);
                        localStorage.removeItem(key);
                        console.log(`🗑️ Removed corrupted key: ${key}`);
                    }
                } catch (keyError) {
                    testResults.corruption.push(key);
                    console.warn(`⚠️ Corrupted key detected: ${key} - ${keyError.message}`);
                    try {
                        localStorage.removeItem(key);
                        console.log(`🗑️ Removed corrupted key: ${key}`);
                    } catch (removeError) {
                        console.error(`❌ Could not remove corrupted key: ${key}`);
                    }
                }
            });
        }
        
        return testResults;
    };
    
    // Add minimal save testing
    window.testMinimalSave = () => {
        console.log('🧪 Testing minimal save operation...');
        
        const testData = {
            timestamp: Date.now(),
            fluff: '1000',
            test: true
        };
        
        try {
            // Try to save minimal data
            const testKey = 'minimalSaveTest_' + Date.now();
            const testValue = JSON.stringify(testData);
            
            console.log(`📝 Attempting to save ${testValue.length} bytes...`);
            localStorage.setItem(testKey, testValue);
            
            // Verify it was saved
            const retrieved = localStorage.getItem(testKey);
            if (retrieved === testValue) {
                console.log('✅ Minimal save test successful');
                localStorage.removeItem(testKey);
                
                // Now test if the actual save function works
                if (typeof window.originalSaveGame === 'function') {
                    console.log('🎮 Testing actual saveGame function...');
                    try {
                        window.originalSaveGame();
                        console.log('✅ Actual saveGame successful');
                        return { success: true, message: 'Both minimal and actual saves work' };
                    } catch (saveError) {
                        console.error('❌ Actual saveGame failed:', saveError);
                        return { success: false, message: 'Minimal save works but saveGame fails', error: saveError };
                    }
                } else {
                    console.warn('⚠️ originalSaveGame function not available');
                    return { success: true, message: 'Minimal save works, saveGame not available' };
                }
            } else {
                console.error('❌ Saved data does not match retrieved data');
                return { success: false, message: 'Data corruption on save/retrieve' };
            }
            
        } catch (error) {
            console.error('❌ Minimal save test failed:', error);
            return { success: false, message: 'Minimal save failed', error: error };
        }
    };
    
    // Add emergency localStorage reset
    window.emergencyReset = () => {
        console.log('🚨 EMERGENCY: Performing complete localStorage reset...');
        
        const confirmed = confirm('This will DELETE ALL saved game data. Are you sure?');
        if (!confirmed) {
            console.log('❌ Emergency reset cancelled by user');
            return { success: false, message: 'Cancelled by user' };
        }
        
        try {
            const keyCount = Object.keys(localStorage).length;
            localStorage.clear();
            console.log(`🧨 Cleared ${keyCount} localStorage keys`);
            
            // Test if localStorage works now
            const testResult = window.testMinimalSave();
            if (testResult.success) {
                console.log('✅ localStorage is working after reset');
                return { success: true, message: 'Emergency reset successful - localStorage working' };
            } else {
                console.error('❌ localStorage still broken after reset - browser issue');
                return { success: false, message: 'Browser localStorage permanently broken' };
            }
            
        } catch (error) {
            console.error('❌ Emergency reset failed:', error);
            return { success: false, message: 'Could not clear localStorage', error: error };
        }
    };
    
    // Add comprehensive localStorage monitoring to find quota causes
    window.enableQuotaDebugging = () => {
        console.log('🔍 Enabling comprehensive localStorage quota debugging...');
        
        const quotaDebugger = {
            writes: [],
            totalWrites: 0,
            totalBytes: 0,
            largestWrites: [],
            frequentKeys: {},
            startTime: Date.now(),
            
            logWrite: function(key, value, stackTrace) {
                const size = (key.length + (value ? value.length : 0));
                const timestamp = Date.now();
                
                this.writes.push({
                    timestamp,
                    key,
                    size,
                    stackTrace: stackTrace.split('\n').slice(0, 5).join('\n') // First 5 stack lines
                });
                
                this.totalWrites++;
                this.totalBytes += size;
                
                // Track frequent keys
                if (!this.frequentKeys[key]) {
                    this.frequentKeys[key] = { count: 0, totalSize: 0 };
                }
                this.frequentKeys[key].count++;
                this.frequentKeys[key].totalSize += size;
                
                // Track largest writes
                if (size > 10000) { // > 10KB
                    this.largestWrites.push({ timestamp, key, size, stackTrace });
                    this.largestWrites.sort((a, b) => b.size - a.size);
                    if (this.largestWrites.length > 20) this.largestWrites.pop();
                }
                
                // Log large writes immediately
                if (size > 100000) { // > 100KB
                    console.warn(`📈 LARGE WRITE: "${key}" (${(size/1024).toFixed(1)}KB)`);
                    console.log('📍 Stack trace:', stackTrace.split('\n').slice(1, 4).join('\n'));
                }
                
                // Check if we're approaching quota with frequent small writes
                if (this.totalBytes > 5 * 1024 * 1024) { // > 5MB total
                    console.warn(`⚠️ localStorage quota warning: ${(this.totalBytes/1024/1024).toFixed(2)}MB written so far`);
                }
            },
            
            getReport: function() {
                const runtime = Date.now() - this.startTime;
                const frequentKeysList = Object.entries(this.frequentKeys)
                    .sort(([,a], [,b]) => b.totalSize - a.totalSize)
                    .slice(0, 10);
                
                return {
                    summary: {
                        totalWrites: this.totalWrites,
                        totalMB: (this.totalBytes / 1024 / 1024).toFixed(2),
                        averageWriteKB: (this.totalBytes / this.totalWrites / 1024).toFixed(1),
                        runtimeMinutes: (runtime / 60000).toFixed(1),
                        writesPerMinute: (this.totalWrites / (runtime / 60000)).toFixed(1)
                    },
                    largestWrites: this.largestWrites.slice(0, 10),
                    frequentKeys: frequentKeysList.map(([key, data]) => ({
                        key,
                        count: data.count,
                        totalMB: (data.totalSize / 1024 / 1024).toFixed(3),
                        avgKB: (data.totalSize / data.count / 1024).toFixed(1)
                    })),
                    recentWrites: this.writes.slice(-10)
                };
            }
        };
        
        // Store the debugger globally
        window.quotaDebugger = quotaDebugger;
        
        // Intercept localStorage.setItem with detailed tracking
        if (!window.originalLocalStorageSetItem) {
            window.originalLocalStorageSetItem = localStorage.setItem;
            
            localStorage.setItem = function(key, value) {
                const stackTrace = new Error().stack;
                quotaDebugger.logWrite(key, value, stackTrace);
                
                try {
                    return window.originalLocalStorageSetItem.call(this, key, value);
                } catch (error) {
                    if (error.name === 'QuotaExceededError') {
                        console.error('🚨 QUOTA EXCEEDED ERROR DETECTED!');
                        console.error(`📊 Key: "${key}" (${(value?.length || 0 / 1024).toFixed(1)}KB)`);
                        console.error('📈 Write that caused quota error:', {
                            key,
                            sizeKB: (value?.length || 0) / 1024,
                            totalStorageBeforeWrite: quotaDebugger.totalBytes
                        });
                        console.error('📋 Recent activity:', quotaDebugger.getReport());
                        console.error('📍 Stack trace:', stackTrace.split('\n').slice(0, 8).join('\n'));
                    }
                    throw error;
                }
            };
        }
        
        console.log('✅ Quota debugging enabled. Use getQuotaReport() to see analysis.');
        return quotaDebugger;
    };
    
    window.getQuotaReport = () => {
        if (!window.quotaDebugger) {
            return 'Quota debugging not enabled. Run enableQuotaDebugging() first.';
        }
        
        const report = window.quotaDebugger.getReport();
        console.log('📊 localStorage Quota Analysis Report:');
        console.log('───────────────────────────────────────');
        console.log('📈 Summary:', report.summary);
        console.log('🔥 Largest Writes:', report.largestWrites);
        console.log('🔄 Most Frequent Keys:', report.frequentKeys);
        console.log('⏰ Recent Writes:', report.recentWrites);
        
        return report;
    };
    
    window.findQuotaCulprits = () => {
        if (!window.quotaDebugger) {
            return 'Enable quota debugging first with enableQuotaDebugging()';
        }
        
        const report = window.quotaDebugger.getReport();
        const culprits = [];
        
        // Find keys that write frequently AND large amounts
        report.frequentKeys.forEach(item => {
            const score = item.count * parseFloat(item.totalMB);
            if (score > 1 || item.count > 50) { // High frequency or large total
                culprits.push({
                    key: item.key,
                    reason: `${item.count} writes totaling ${item.totalMB}MB`,
                    severity: score > 10 ? 'CRITICAL' : score > 5 ? 'HIGH' : 'MEDIUM'
                });
            }
        });
        
        console.log('🎯 localStorage Quota Culprits:');
        culprits.forEach(culprit => {
            console.log(`${culprit.severity === 'CRITICAL' ? '🔥' : culprit.severity === 'HIGH' ? '⚠️' : '📝'} ${culprit.key}: ${culprit.reason}`);
        });
        
        return culprits;
    };
    
    // Add predictive quota monitoring
    window.enablePredictiveMonitoring = () => {
        console.log('🔮 Enabling predictive quota monitoring...');
        
        const predictor = {
            saveCallFrequency: [],
            animationFrameCount: 0,
            intervalCallbacks: 0,
            lastSaveTime: 0,
            suspiciousPatterns: [],
            
            logSaveCall: function() {
                const now = Date.now();
                if (this.lastSaveTime > 0) {
                    const timeSinceLastSave = now - this.lastSaveTime;
                    this.saveCallFrequency.push(timeSinceLastSave);
                    
                    // Keep only recent data
                    if (this.saveCallFrequency.length > 50) {
                        this.saveCallFrequency.shift();
                    }
                    
                    // Detect problematic patterns
                    if (timeSinceLastSave < 100) { // Less than 100ms between saves
                        this.suspiciousPatterns.push({
                            type: 'RAPID_SAVES',
                            timestamp: now,
                            interval: timeSinceLastSave,
                            message: `Save called ${timeSinceLastSave}ms after previous save`
                        });
                        console.warn(`⚡ RAPID SAVE DETECTED: ${timeSinceLastSave}ms interval`);
                    }
                }
                this.lastSaveTime = now;
            },
            
            getPattern: function() {
                if (this.saveCallFrequency.length < 2) return null;
                
                const avgInterval = this.saveCallFrequency.reduce((a, b) => a + b, 0) / this.saveCallFrequency.length;
                const rapidSaves = this.saveCallFrequency.filter(interval => interval < 1000).length;
                const savesPerMinute = this.saveCallFrequency.length > 0 ? 60000 / avgInterval : 0;
                
                return {
                    averageIntervalMs: avgInterval.toFixed(0),
                    rapidSaves: rapidSaves,
                    estimatedSavesPerMinute: savesPerMinute.toFixed(1),
                    suspiciousPatterns: this.suspiciousPatterns.slice(-10)
                };
            }
        };
        
        window.quotaPredictor = predictor;
        
        // Monitor save function calls
        if (typeof window.originalSaveGame === 'function' && !window.saveGameMonitored) {
            const originalSave = window.originalSaveGame;
            window.originalSaveGame = function() {
                predictor.logSaveCall();
                return originalSave.apply(this, arguments);
            };
            window.saveGameMonitored = true;
            console.log('🎯 Save function monitoring enabled');
        }
        
        // Monitor for animation frame spam with emergency controls (quiet mode)
        const originalRAF = window.requestAnimationFrame;
        let recentFrameRequests = [];
        
        window.requestAnimationFrame = function(callback) {
            const now = Date.now();
            predictor.animationFrameCount++;
            
            // Track recent requests for burst detection
            recentFrameRequests.push(now);
            recentFrameRequests = recentFrameRequests.filter(time => now - time < 1000); // Keep only last 1 second
            
            // Detect dangerous bursts (>120 FPS = >120 requests per second)
            if (recentFrameRequests.length > 120) {
                console.error(`🚨 ANIMATION FRAME BURST DETECTED: ${recentFrameRequests.length} requests in 1 second!`);
                console.error('🛑 EMERGENCY: Stopping game loops to prevent crash...');
                
                // Emergency stop
                if (window.gameOptimization) {
                    window.gameOptimization.isOptimized = false;
                }
                
                // Cancel recent frames
                for (let i = Math.max(1, predictor.animationFrameCount - 1000); i < predictor.animationFrameCount + 100; i++) {
                    try { cancelAnimationFrame(i); } catch (e) {}
                }
                
                predictor.suspiciousPatterns.push({
                    type: 'EMERGENCY_STOP',
                    timestamp: now,
                    burstSize: recentFrameRequests.length,
                    message: `Emergency stop triggered - ${recentFrameRequests.length} frames in 1 second`
                });
                
                return null; // Don't actually request the frame
            }
            
            // Silent monitoring - only warn on critical issues
            if (predictor.animationFrameCount > 50000) {
                console.error('🔥 CRITICAL: Auto-stopping loops at 50k frames');
                window.stopConflictingLoops();
                return null;
            }
            
            return originalRAF.call(this, callback);
        };
        
        console.log('✅ Predictive monitoring enabled. Use getPredictiveReport() for analysis.');
        return predictor;
    };
    
    window.getPredictiveReport = () => {
        if (!window.quotaPredictor) {
            return 'Predictive monitoring not enabled. Run enablePredictiveMonitoring() first.';
        }
        
        const pattern = window.quotaPredictor.getPattern();
        const report = {
            savePatterns: pattern,
            animationFrames: window.quotaPredictor.animationFrameCount,
            suspiciousActivity: window.quotaPredictor.suspiciousPatterns,
            riskAssessment: 'LOW'
        };
        
        // Assess risk level
        if (pattern && (pattern.rapidSaves > 10 || pattern.estimatedSavesPerMinute > 60)) {
            report.riskAssessment = 'HIGH';
        } else if (window.quotaPredictor.animationFrameCount > 50000) {
            report.riskAssessment = 'MEDIUM';
        }
        
        console.log('🔮 Predictive Quota Risk Analysis:');
        console.log('─────────────────────────────────────');
        console.log('💾 Save Patterns:', pattern);
        console.log('🎬 Animation Frames:', report.animationFrames);
        console.log('⚠️ Suspicious Activity:', report.suspiciousActivity);
        console.log('🎯 Risk Level:', report.riskAssessment);
        
        return report;
    };
    
    // Quick animation frame health check
    window.checkAnimationHealth = () => {
        if (!window.quotaPredictor) {
            return 'Monitoring not enabled';
        }
        
        const frameCount = window.quotaPredictor.animationFrameCount;
        const runtimeMinutes = (Date.now() - (window.localStorageMonitor?.baselineSize ? window.localStorageMonitor.startTime || Date.now() : Date.now())) / 60000;
        const framesPerMinute = frameCount / Math.max(runtimeMinutes, 0.1);
        
        let status = 'HEALTHY';
        let recommendation = 'Continue normal operation';
        
        if (framesPerMinute > 7200) { // >120 FPS average
            status = 'CRITICAL';
            recommendation = 'STOP IMMEDIATELY - Loop multiplication detected';
        } else if (framesPerMinute > 5400) { // >90 FPS average  
            status = 'WARNING';
            recommendation = 'Monitor closely - High frame rate detected';
        } else if (framesPerMinute > 3800) { // >63 FPS average
            status = 'CAUTION';
            recommendation = 'Slightly high but acceptable for active gameplay';
        }
        
        const result = {
            totalFrames: frameCount,
            runtimeMinutes: runtimeMinutes.toFixed(1),
            averageFPS: (framesPerMinute / 60).toFixed(1),
            status: status,
            recommendation: recommendation
        };
        
        console.log('🏥 Animation Frame Health Check:');
        console.log(`📊 Total Frames: ${result.totalFrames}`);
        console.log(`⏱️ Runtime: ${result.runtimeMinutes} minutes`);
        console.log(`🎬 Average FPS: ${result.averageFPS}`);
        console.log(`${status === 'CRITICAL' ? '🚨' : status === 'WARNING' ? '⚠️' : status === 'CAUTION' ? '🟡' : '✅'} Status: ${result.status}`);
        console.log(`💡 Recommendation: ${result.recommendation}`);
        
        return result;
    };
    
    // Emergency localStorage diagnostic for recurring quota issues
    window.emergencyDiagnostic = () => {
        console.log('🚨 EMERGENCY DIAGNOSTIC: Investigating recurring quota issues...');
        
        const diagnostic = {
            browserInfo: {
                userAgent: navigator.userAgent,
                localStorage: typeof localStorage,
                storageQuota: null
            },
            currentState: {
                totalKeys: 0,
                totalSize: 0,
                suspiciousKeys: [],
                corruptedKeys: []
            },
            tests: {
                canRead: false,
                canWrite: false,
                canDelete: false,
                quotaTest: null
            }
        };
        
        // Test 1: Check storage quota if available
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(quota => {
                diagnostic.browserInfo.storageQuota = {
                    quota: (quota.quota / 1024 / 1024).toFixed(2) + 'MB',
                    usage: (quota.usage / 1024 / 1024).toFixed(2) + 'MB',
                    available: ((quota.quota - quota.usage) / 1024 / 1024).toFixed(2) + 'MB'
                };
                console.log('💾 Storage Quota:', diagnostic.browserInfo.storageQuota);
            });
        }
        
        // Test 2: Analyze current localStorage state
        try {
            const keys = Object.keys(localStorage);
            diagnostic.currentState.totalKeys = keys.length;
            
            keys.forEach(key => {
                try {
                    const value = localStorage.getItem(key);
                    const size = key.length + (value ? value.length : 0);
                    diagnostic.currentState.totalSize += size;
                    
                    // Flag suspicious patterns
                    if (key.length > 200 || size > 2 * 1024 * 1024) {
                        diagnostic.currentState.suspiciousKeys.push({ key, sizeMB: (size/1024/1024).toFixed(3) });
                    }
                    
                } catch (keyError) {
                    diagnostic.currentState.corruptedKeys.push({ key, error: keyError.message });
                }
            });
            
            diagnostic.tests.canRead = true;
        } catch (readError) {
            console.error('❌ Cannot read localStorage:', readError);
        }
        
        // Test 3: Write capability
        try {
            const testKey = 'emergencyTest_' + Date.now();
            localStorage.setItem(testKey, 'test');
            diagnostic.tests.canWrite = true;
            
            // Test 4: Delete capability
            localStorage.removeItem(testKey);
            diagnostic.tests.canDelete = true;
        } catch (writeError) {
            diagnostic.tests.quotaTest = writeError.name;
            console.error('❌ Cannot write to localStorage:', writeError);
        }
        
        // Test 5: Check for external localStorage usage
        const knownGameKeys = ['swariaSave', 'currentSaveSlot', 'swariaSettings', 'permanentTabUnlocks'];
        const unknownKeys = Object.keys(localStorage).filter(key => 
            !knownGameKeys.some(gameKey => key.includes(gameKey))
        );
        
        if (unknownKeys.length > 0) {
            console.warn('🔍 Unknown localStorage keys detected (possible external apps):', unknownKeys.slice(0, 10));
        }
        
        console.log('📊 Emergency Diagnostic Results:');
        console.log('─────────────────────────────────────');
        console.log('🖥️ Browser Info:', diagnostic.browserInfo);
        console.log('📂 Current State:', diagnostic.currentState);
        console.log('🧪 Tests:', diagnostic.tests);
        console.log('🔍 Suspicious Keys:', diagnostic.currentState.suspiciousKeys);
        console.log('💥 Corrupted Keys:', diagnostic.currentState.corruptedKeys);
        console.log('❓ Unknown Keys:', unknownKeys.length);
        
        return diagnostic;
    };
    
    // Clean up unknown/external localStorage keys
    window.cleanupUnknownKeys = () => {
        console.log('🧹 Cleaning up unknown localStorage keys...');
        
        // Essential game keys to preserve
        const essentialKeys = [
            'swariaSave', 'swariaSaveSlot', 'currentSaveSlot', 'swariaSettings',
            'permanentTabUnlocks', 'notationPreference', 'deliverCooldownEnd',
            'freeGiftClaimed', 'highestGradeReached', 'swariaGameMinutes'
        ];
        
        const allKeys = Object.keys(localStorage);
        let removedCount = 0;
        let freedSpace = 0;
        
        console.log(`📊 Found ${allKeys.length} total localStorage keys`);
        
        allKeys.forEach(key => {
            // Check if key should be preserved
            const isEssential = essentialKeys.some(essential => key.includes(essential));
            
            if (!isEssential) {
                try {
                    const value = localStorage.getItem(key);
                    const size = key.length + (value ? value.length : 0);
                    
                    localStorage.removeItem(key);
                    removedCount++;
                    freedSpace += size;
                    
                    console.log(`🗑️ Removed: "${key}" (${(size/1024).toFixed(1)}KB)`);
                } catch (error) {
                    console.warn(`⚠️ Could not remove key: "${key}" - ${error.message}`);
                }
            }
        });
        
        const result = {
            removedCount,
            freedSpaceKB: (freedSpace / 1024).toFixed(1),
            remainingKeys: Object.keys(localStorage).length
        };
        
        console.log(`✅ Cleanup complete: Removed ${removedCount} keys, freed ${result.freedSpaceKB}KB`);
        console.log(`📊 Remaining keys: ${result.remainingKeys}`);
        
        // Test if localStorage works now
        try {
            const testKey = 'cleanupTest_' + Date.now();
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            console.log('✅ localStorage is working after cleanup');
        } catch (error) {
            console.error('❌ localStorage still broken after cleanup:', error);
        }
        
        return result;
    };
    
    // Deep diagnostic to find loop multiplication triggers
    window.enableLoopMultiplicationTracking = () => {
        console.log('🔍 Enabling deep loop multiplication tracking...');
        
        const loopTracker = {
            gameLoopStarts: [],
            animationFrameStacks: [],
            intervalCreations: [],
            suspiciousEvents: [],
            
            trackGameLoopStart: function(source, stackTrace) {
                const entry = {
                    timestamp: Date.now(),
                    source: source,
                    stackTrace: stackTrace.split('\n').slice(1, 6).join('\n')
                };
                this.gameLoopStarts.push(entry);
                
                if (this.gameLoopStarts.length > 1) {
                    console.warn(`🚨 MULTIPLE GAME LOOP STARTS DETECTED! Count: ${this.gameLoopStarts.length}`);
                    console.warn('Latest start:', entry);
                    
                    // Check for rapid starts (within 5 seconds)
                    const recentStarts = this.gameLoopStarts.filter(start => 
                        Date.now() - start.timestamp < 5000
                    );
                    
                    if (recentStarts.length > 1) {
                        console.error('🔥 RAPID LOOP STARTS - LOOP MULTIPLICATION TRIGGER FOUND!');
                        this.suspiciousEvents.push({
                            type: 'RAPID_LOOP_STARTS',
                            count: recentStarts.length,
                            timestamp: Date.now(),
                            details: recentStarts
                        });
                    }
                }
            },
            
            getReport: function() {
                return {
                    gameLoopStarts: this.gameLoopStarts,
                    totalLoopStarts: this.gameLoopStarts.length,
                    suspiciousEvents: this.suspiciousEvents,
                    analysis: this.gameLoopStarts.length > 1 ? 'MULTIPLE LOOPS DETECTED' : 'SINGLE LOOP'
                };
            }
        };
        
        window.loopMultiplicationTracker = loopTracker;
        
        // Hook into common game loop starting points
        
        // 1. Monitor requestAnimationFrame calls with stack traces
        if (!window.rafCallTracker) {
            const originalRAF = window.requestAnimationFrame;
            let rafCallCount = 0;
            
            window.requestAnimationFrame = function(callback) {
                rafCallCount++;
                const stackTrace = new Error().stack;
                
                // Look for suspicious patterns in the stack
                if (stackTrace.includes('optimizedGameLoop')) {
                    loopTracker.trackGameLoopStart('requestAnimationFrame->optimizedGameLoop', stackTrace);
                }
                
                return originalRAF.call(this, function(timestamp) {
                    return callback.call(this, timestamp);
                });
            };
            
            window.rafCallTracker = true;
        }
        
        // 2. Monitor setTimeout/setInterval that might start loops
        if (!window.timerTracker) {
            const originalSetTimeout = window.setTimeout;
            const originalSetInterval = window.setInterval;
            
            window.setTimeout = function(callback, delay) {
                const stackTrace = new Error().stack;
                if (stackTrace.includes('gameLoop') || stackTrace.includes('optimized')) {
                    loopTracker.suspiciousEvents.push({
                        type: 'TIMEOUT_GAME_LOOP',
                        timestamp: Date.now(),
                        delay: delay,
                        stack: stackTrace.split('\n').slice(1, 4).join('\n')
                    });
                }
                return originalSetTimeout.call(this, callback, delay);
            };
            
            window.setInterval = function(callback, delay) {
                const stackTrace = new Error().stack;
                if (stackTrace.includes('gameLoop') || stackTrace.includes('optimized')) {
                    loopTracker.suspiciousEvents.push({
                        type: 'INTERVAL_GAME_LOOP',
                        timestamp: Date.now(),
                        delay: delay,
                        stack: stackTrace.split('\n').slice(1, 4).join('\n')
                    });
                }
                return originalSetInterval.call(this, callback, delay);
            };
            
            window.timerTracker = true;
        }
        
        // 3. Monitor game optimization state changes
        if (window.gameOptimization && !window.gameOptimizationTracker) {
            const originalIsOptimized = window.gameOptimization.isOptimized;
            
            Object.defineProperty(window.gameOptimization, 'isOptimized', {
                get: function() { return originalIsOptimized; },
                set: function(value) {
                    const stackTrace = new Error().stack;
                    loopTracker.suspiciousEvents.push({
                        type: 'GAME_OPTIMIZATION_CHANGE',
                        timestamp: Date.now(),
                        newValue: value,
                        oldValue: originalIsOptimized,
                        stack: stackTrace.split('\n').slice(1, 4).join('\n')
                    });
                    
                    if (value === true && originalIsOptimized === false) {
                        console.log('🎮 Game optimization being enabled:', stackTrace.split('\n')[1]);
                        loopTracker.trackGameLoopStart('gameOptimization.isOptimized=true', stackTrace);
                    }
                    
                    originalIsOptimized = value;
                }
            });
            
            window.gameOptimizationTracker = true;
        }
        
        console.log('✅ Loop multiplication tracking enabled. Use getLoopMultiplicationReport() for analysis.');
        return loopTracker;
    };
    
    window.getLoopMultiplicationReport = () => {
        if (!window.loopMultiplicationTracker) {
            return 'Loop multiplication tracking not enabled. Run enableLoopMultiplicationTracking() first.';
        }
        
        const report = window.loopMultiplicationTracker.getReport();
        console.log('🔍 Loop Multiplication Analysis:');
        console.log('═══════════════════════════════════');
        console.log(`🎮 Total Game Loop Starts: ${report.totalLoopStarts}`);
        console.log(`📊 Analysis: ${report.analysis}`);
        console.log('🚨 Suspicious Events:', report.suspiciousEvents);
        console.log('🔄 Game Loop Start History:', report.gameLoopStarts);
        
        return report;
    };
}

function patchSaveGameForThrottling() {
    // Only patch if saveGame exists and hasn't been patched yet
    if (typeof window.saveGame === 'function' && !window.originalSaveGame) {
        window.originalSaveGame = window.saveGame;
        window.saveGame = throttledSaveGame;
        // Silently patched - monitoring functions still available for debugging
    }
}

function patchLocalStorageOperations() {
    // Create global wrappers for safer localStorage operations
    if (!window.originalLocalStorage) {
        window.originalLocalStorage = {
            setItem: localStorage.setItem.bind(localStorage),
            getItem: localStorage.getItem.bind(localStorage),
            removeItem: localStorage.removeItem.bind(localStorage)
        };
        
        // Patch localStorage.setItem to monitor all writes
        localStorage.setItem = function(key, value) {
            const sizeBefore = localStorageMonitor.calculateCurrentSize();
            const valueSize = (value || '').length;
            
            try {
                window.originalLocalStorage.setItem(key, value);
                
                // Monitor very large writes only
                if (valueSize > 1024 * 1024) { // 1MB+ writes
                    console.warn(`📝 Large localStorage write: "${key}" (${(valueSize / 1024).toFixed(1)}KB)`);
                }
                
                // Check for major additions periodically
                const now = Date.now();
                if (now - localStorageMonitor.lastCheckTime > 30000) { // Check every 30 seconds
                    localStorageMonitor.lastCheckTime = now;
                    localStorageMonitor.detectMajorAdditions();
                }
                
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    const totalSize = localStorageMonitor.calculateCurrentSize();
                    console.error(`🚨 QuotaExceededError for "${key}" (${(valueSize / 1024).toFixed(1)}KB)`);
                    console.error(`📊 Current total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
                    
                    // Check if this is a phantom quota error
                    if (totalSize < 5 * 1024 * 1024) { // Less than 5MB
                        console.warn('🤔 Phantom quota error detected - trying localStorage reset...');
                        
                        // Try clearing and restoring a small test
                        try {
                            const testKey = 'phantomTest_' + Date.now();
                            window.originalLocalStorage.setItem(testKey, 'test');
                            window.originalLocalStorage.removeItem(testKey);
                            
                            // If test works, try original operation again
                            window.originalLocalStorage.setItem(key, value);
                            console.log('✅ Phantom quota error resolved');
                            return;
                        } catch (phantomError) {
                            console.error('❌ Phantom quota error persists:', phantomError);
                        }
                    }
                    
                    // Standard cleanup approach
                    cleanupLocalStorage();
                    // Retry after cleanup
                    try {
                        window.originalLocalStorage.setItem(key, value);
                    } catch (retryError) {
                        console.error('localStorage write failed even after cleanup:', retryError);
                        throw retryError;
                    }
                } else {
                    throw error;
                }
            }
        };
        
        // Patch localStorage.removeItem to track deletions
        localStorage.removeItem = function(key) {
            const sizeBefore = localStorageMonitor.calculateCurrentSize();
            window.originalLocalStorage.removeItem(key);
            const sizeAfter = localStorageMonitor.calculateCurrentSize();
            const sizeReduction = sizeBefore - sizeAfter;
            
            if (sizeReduction > 100 * 1024) { // 100KB+ deletions
                console.log(`🗑️ Large localStorage deletion: "${key}" freed ${(sizeReduction / 1024).toFixed(1)}KB`);
            }
        };
        
        // Add safe methods
        Storage.prototype.safeSetItem = function(key, value) {
            return safeLocalStorageSetItem(key, value);
        };
        
        Storage.prototype.safeGetItem = function(key) {
            return safeLocalStorageGetItem(key);
        };
    }
}

// Enhanced save wrapper with Firefox workarounds and recursion protection
let saveInProgress = false;
let saveFailureCount = 0;
const MAX_SAVE_FAILURES = 3;

function throttledSaveGame() {
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTime;
    
    // Prevent recursive save calls
    if (saveInProgress) {
        console.warn('🔒 Save already in progress, blocking recursive call');
        return;
    }
    
    // Skip saves if too many recent failures (Firefox bug protection)
    if (saveFailureCount >= MAX_SAVE_FAILURES) {
        const timeSinceLastFailure = now - (window.lastSaveFailureTime || 0);
        if (timeSinceLastFailure < 30000) { // Wait 30 seconds after repeated failures
            return;
        } else {
            saveFailureCount = 0; // Reset after cooldown
        }
    }
    
    if (timeSinceLastSave < SAVE_THROTTLE_MS) {
        // If a save is already pending, don't queue another
        if (!pendingSave) {
            pendingSave = true;
            setTimeout(() => {
                executeActualSave();
                pendingSave = false;
            }, SAVE_THROTTLE_MS - timeSinceLastSave);
        }
        return;
    }
    
    // Execute save immediately
    executeActualSave();
}

function executeActualSave() {
    if (saveInProgress || !window.originalSaveGame) return;
    
    saveInProgress = true;
    
    try {
        // Firefox-specific localStorage workaround
        if (navigator.userAgent.includes('Firefox')) {
            // Force localStorage sync before save
            try {
                const syncTest = localStorage.getItem('currentSaveSlot');
                localStorage.setItem('firefoxSyncTest', Date.now().toString());
                localStorage.removeItem('firefoxSyncTest');
            } catch (syncError) {
                console.warn('Firefox localStorage sync failed:', syncError);
            }
        }
        
        window.originalSaveGame();
        lastSaveTime = Date.now();
        saveFailureCount = 0; // Reset failure count on success
        
    } catch (error) {
        saveFailureCount++;
        window.lastSaveFailureTime = Date.now();
        
        if (error.name === 'QuotaExceededError') {
            console.warn(`localStorage quota exceeded (attempt ${saveFailureCount}/${MAX_SAVE_FAILURES})`);
            
            // Try progressive fixes
            if (saveFailureCount === 1) {
                // First failure: Try basic cleanup
                cleanupLocalStorage();
            } else if (saveFailureCount === 2) {
                // Second failure: Try Firefox-specific fix
                console.log('Trying Firefox-specific localStorage reset...');
                try {
                    // Clear and restore essential data only
                    const essential = {
                        currentSaveSlot: localStorage.getItem('currentSaveSlot'),
                        swariaSettings: localStorage.getItem('swariaSettings')
                    };
                    
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (!key.includes('swariaSave') && !essential.hasOwnProperty(key)) {
                            localStorage.removeItem(key);
                        }
                    });
                    
                    // Restore essential data
                    Object.entries(essential).forEach(([key, value]) => {
                        if (value) localStorage.setItem(key, value);
                    });
                    
                } catch (resetError) {
                    console.error('Firefox reset failed:', resetError);
                }
            } else {
                // Third failure: Stop trying and suggest browser fix
                console.error('🚨 PERSISTENT SAVE FAILURE - Firefox localStorage bug detected');
                console.error('💡 Suggested fixes:');
                console.error('   1. Restart Firefox');
                console.error('   2. Clear Firefox localStorage for this site');
                console.error('   3. Use Chrome/Edge instead');
                console.error('   4. Use Private/Incognito mode');
            }
            
            // Try save one more time after fix attempt
            if (saveFailureCount < MAX_SAVE_FAILURES) {
                try {
                    window.originalSaveGame();
                    lastSaveTime = Date.now();
                    saveFailureCount = 0;
                } catch (retryError) {
                    console.error('Save retry failed:', retryError);
                }
            }
        } else {
            console.error('Non-quota save error:', error);
        }
    } finally {
        saveInProgress = false;
    }
}

window.addManagedEventListener = addManagedEventListener;
window.removeManagedEventListeners = removeManagedEventListeners;
window.forceGarbageCollection = forceGarbageCollection;
window.globalThrottle = globalThrottle;
window.cleanupResources = cleanupResources;
window.initializeMemoryOptimizations = initializeMemoryOptimizations;
window.throttledSaveGame = throttledSaveGame;
window.safeLocalStorageSetItem = safeLocalStorageSetItem;
window.safeLocalStorageGetItem = safeLocalStorageGetItem;
window.localStorageMonitor = localStorageMonitor;
window.cleanupLocalStorage = cleanupLocalStorage;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMemoryOptimizations);
} else {
    initializeMemoryOptimizations();
}
