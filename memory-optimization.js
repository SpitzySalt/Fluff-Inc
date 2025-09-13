const memoryStats = {
    startHeapSize: 0,
    currentHeapSize: 0,
    maxHeapSize: 0,
    lastGCTime: 0,
    gcCount: 0
};
const managedEventListeners = new WeakMap();

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
}

window.addManagedEventListener = addManagedEventListener;
window.removeManagedEventListeners = removeManagedEventListeners;
window.forceGarbageCollection = forceGarbageCollection;
window.globalThrottle = globalThrottle;
window.cleanupResources = cleanupResources;
window.initializeMemoryOptimizations = initializeMemoryOptimizations;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMemoryOptimizations);
} else {
    initializeMemoryOptimizations();
}
