window.gameOptimization = {
    lastFrameTime: 0,
    accumulatedTime: 0,
    targetFPS: 60,
    gameTickRate: 10, 
    isOptimized: true,
    frameId: null,
    pendingDOMUpdates: new Set(),
    domUpdateScheduled: false,
    frameCount: 0,
    lastFPSUpdate: 0,
    currentFPS: 60
};

function optimizedGameLoop(currentTime) {
    const opt = window.gameOptimization;
    
    // Prevent multiple loops from running simultaneously
    if (!opt || !opt.isOptimized) {
        return;
    }
    
    // Check if this is a duplicate loop
    if (opt.frameId && opt.frameId !== 'running') {
        return;
    }
    
    opt.frameId = 'running'; // Mark as currently running
    
    if (opt.lastFrameTime === 0) {
        opt.lastFrameTime = currentTime;
    }
    const deltaTime = currentTime - opt.lastFrameTime;
    opt.lastFrameTime = currentTime;
    opt.accumulatedTime += deltaTime;
    const gameTickInterval = 1000 / opt.gameTickRate;
    while (opt.accumulatedTime >= gameTickInterval) {
        optimizedGameTick(gameTickInterval / 1000);
        opt.accumulatedTime -= gameTickInterval;
    }
    optimizedVisualUpdate(deltaTime / 1000);
    opt.frameCount++;
    if (currentTime - opt.lastFPSUpdate >= 1000) {
        opt.currentFPS = opt.frameCount;
        opt.frameCount = 0;
        opt.lastFPSUpdate = currentTime;
    }
    
    // Only continue if optimization is still enabled
    if (opt.isOptimized) {
        opt.frameId = requestAnimationFrame(optimizedGameLoop);
    } else {
        opt.frameId = null;
    }
}

function optimizedGameTick(deltaTime) {
    try {
        if (typeof window.gameTick === 'function') {
            const originalTick = window.gameTick;
            window.gameTick = function() {}; 
            originalTick();
            window.gameTick = originalTick;
        }
      
        if (typeof window.mainGameTick === 'function') {
            window.mainGameTick();
        }
        if (window.boughtElements && window.boughtElements[7] && typeof window.tickPowerGenerator === 'function') {
            window.tickPowerGenerator(deltaTime);
        }
        if (window.tickLightGenerators) {
            window.tickLightGenerators(deltaTime);
        }
       
        scheduleUIUpdate();
    } catch (error) {

    }
}

function optimizedVisualUpdate(deltaTime) {
    if (window.gameOptimization.domUpdateScheduled) {
        processBatchedDOMUpdates();
    }
    updateSmoothAnimations(deltaTime);
}

function scheduleUIUpdate() {
    if (!window.gameOptimization.domUpdateScheduled) {
        window.gameOptimization.domUpdateScheduled = true;
        requestAnimationFrame(() => {
            if (typeof window.updateUI === 'function') {
                window.updateUI();
            }
            window.gameOptimization.domUpdateScheduled = false;
        });
    }
}

function processBatchedDOMUpdates() {
    const updates = window.gameOptimization.pendingDOMUpdates;
    if (updates.size > 0) {
        const startTime = performance.now();
        updates.forEach(updateFn => {
            try {
                updateFn();
            } catch (error) {

            }
        });
        updates.clear();
        const endTime = performance.now();
        if (endTime - startTime > 16) { 

        }
    }
}

function updateSmoothAnimations(deltaTime) {
    if (typeof window.updateBoostDisplay === 'function') {
        throttledBoostUpdate();
    }
}

let lastBoostState = null;
let boostUpdateThrottle = 0;

function throttledBoostUpdate() {
    boostUpdateThrottle += 16; 
    if (boostUpdateThrottle < 500) return; 
    boostUpdateThrottle = 0;
    const currentBoosts = typeof window.getActiveBoosts === 'function' ? window.getActiveBoosts() : [];
    const boostStateString = JSON.stringify(currentBoosts);
    if (lastBoostState !== boostStateString) {
        lastBoostState = boostStateString;
        window.updateBoostDisplay();
    }
}

function optimizedSetInterval(callback, interval, options = {}) {
    let lastExecution = 0;
    const throttled = options.throttle || false;

    function execute() {
        const now = performance.now();
        if (now - lastExecution >= interval) {
            lastExecution = now;
            try {
                callback();
            } catch (error) {

            }
        }
    }

    return {
        execute,
        interval,
        active: true
    };
}

function clearOldIntervals() {
    // Clear unified interval instead of separate intervals
    if (window._unifiedGameTickInterval) {
        clearInterval(window._unifiedGameTickInterval);
        window._unifiedGameTickInterval = null;
    }
    // Legacy interval cleanup for compatibility
    if (window._gameTickInterval) {
        clearInterval(window._gameTickInterval);
        window._gameTickInterval = null;
    }
    if (window._mainGameTickInterval) {
        clearInterval(window._mainGameTickInterval);
        window._mainGameTickInterval = null;
    }
    if (window.boostDisplayInterval) {
        clearInterval(window.boostDisplayInterval);
        window.boostDisplayInterval = null;
    }
}

function optimizeElement(element) {
    if (element && element.style) {
        element.style.willChange = 'auto';
        element.style.containIntrinsicSize = 'layout style paint';
    }
}

function garbageCollectUnusedElements() {
    const unusedElements = document.querySelectorAll('[data-unused="true"]');
    unusedElements.forEach(el => el.remove());
}

function getPerformanceStats() {
    return {
        fps: window.gameOptimization.currentFPS,
        activeTick: window.gameOptimization.isOptimized ? 'Optimized' : 'Legacy',
        domUpdatesQueued: window.gameOptimization.pendingDOMUpdates.size
    };
}

function initializeOptimizations() {
    clearOldIntervals();
    setTimeout(() => {
        if (window.gameOptimization.frameId) {
            cancelAnimationFrame(window.gameOptimization.frameId);
        }
        window.gameOptimization.frameId = requestAnimationFrame(optimizedGameLoop);
        window.getPerformanceStats = getPerformanceStats;
    }, 100);
}

// Save/load functions removed - optimization settings now managed by main save system
// Settings are automatically saved/loaded through window.state

function exportOptimizationSettings() {
    const data = {
        version: "1.0",
        optimizationSettings: {
            isOptimized: window.gameOptimization.isOptimized,
            targetFPS: window.gameOptimization.targetFPS,
            gameTickRate: window.gameOptimization.gameTickRate
        },
        timestamp: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluff_optimization_settings_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importOptimizationSettings(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.optimizationSettings) {
                window.gameOptimization.isOptimized = data.optimizationSettings.isOptimized;
                window.gameOptimization.targetFPS = data.optimizationSettings.targetFPS || 60;
                window.gameOptimization.gameTickRate = data.optimizationSettings.gameTickRate || 10;
                saveOptimizationState();
            }
        } catch (error) {

        }
    };
    reader.readAsText(file);
}

// Slot-specific save/load functions removed - now managed by main save system
function toggleOptimizations() {
    // Toggle optimization functionality can be implemented here if needed
    console.log('Toggle optimizations called');
}

window.initializeOptimizations = initializeOptimizations;
window.getPerformanceStats = getPerformanceStats;
window.optimizedSetInterval = optimizedSetInterval;
// Save/load functions removed - now managed by main save system
window.exportOptimizationSettings = exportOptimizationSettings;
window.importOptimizationSettings = importOptimizationSettings;
window.toggleOptimizations = toggleOptimizations;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Load removed - optimization settings now managed by main save system
        initializeOptimizations();
    });
} else {
    // Load removed - optimization settings now managed by main save system
    initializeOptimizations();
}