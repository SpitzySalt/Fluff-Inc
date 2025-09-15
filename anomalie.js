// Anomaly Detection and Removal System
// This system provides a UI for detecting and managing dimensional anomalies

// Add CSS animations for custom speech bubbles
if (!document.getElementById('anomalyCustomAnimations')) {
    const style = document.createElement('style');
    style.id = 'anomalyCustomAnimations';
    style.textContent = `
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.05);
            }
            70% {
                transform: translate(-50%, -50%) scale(0.95);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes labDarknessParticle {
            0% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0.8;
            }
            25% {
                transform: translateY(-5px) translateX(2px) scale(1.1);
                opacity: 1;
            }
            50% {
                transform: translateY(-8px) translateX(-3px) scale(1.2);
                opacity: 0.9;
            }
            75% {
                transform: translateY(-3px) translateX(1px) scale(1.1);
                opacity: 1;
            }
            100% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(style);
}

// Anomaly system state
window.anomalySystem = {
    anomalies: [], // Array of active anomalies
    nextId: 1,     // Counter for unique anomaly IDs
    isDetectorVisible: false, // Whether the detector UI is visible
    findModeActive: false, // Whether find mode is currently active
    maxAnomalies: 3, // Maximum number of anomalies on screen
    spawnCooldown: 420000, // 7 minutes in milliseconds (increased from 5 minutes)
    lastSpawnTime: 0, // Last anomaly spawn timestamp
    analyzing: false, // Whether detector is currently analyzing
    searching: false, // Whether detector is currently searching
    
    // Cursor animation variables
    cursorAnimationInterval: null,
    currentCursorFrame: 1,
    
    // Shop price anomaly variable
    anomalyAffectedItem: null, // Which item is affected by the shop price anomaly
    
    // Active anomaly types
    activeAnomalies: {
        clockAnomaly: false,        // Wild spinning clock
        backwardClockAnomaly: false, // Backward ticking clock
        boxOrderAnomaly: false,      // Randomized box button order
        soapGeneratorAnomaly: false, // Power generator becomes soap generator
        shopPriceAnomaly: false,     // All shop prices become 727 swa bucks
        darkVoidAnomaly: false,      // Dangerous: Dark void fog that consumes screen
        prismMirrorAnomaly: false,   // Mirrored light rays in prism tab
        cargoOmegaBoxAnomaly: false, // OMEGA box appears in cargo tab
        blurpleLightAnomaly: false,  // Blue Light becomes "Blurple Light"
        boxGeneratorFreezeAnomaly: false, // Box generator stops working
        labDarknessAnomaly: false,   // Dangerous: Lab triggered darkness consuming screen with Vi panic
        prismGreyAnomaly: false,     // Prism grid only spawns grey tiles that do nothing
        notationScrambleAnomaly: false, // Notation changes to random format and locks dropdown
        crabBucksAnomaly: false,     // Swa Bucks icon becomes crab emoji in boutique
        fluzzerFlipAnomaly: false,   // Fluzzer character and cursor appear upside down
        rustlingFlowersAnomaly: false, // All flower cells become rustling flowers (give no tokens)
        dramaticWindAnomaly: false   // Strong wind effects that shake UI elements with wind animations
    },
    
    // Box generator freeze anomaly variables
    frozenGeneratorId: null, // Which generator is frozen (0-4)
    
    // Initialize the anomaly system
    init: function() {
        this.setupDetectorButton();
        this.updateDetectorVisibility(); // Check initial visibility
        this.startAnomalySpawning(); // Start automatic spawning
        this.setupCurrencyDebuffs(); // Setup debuff system
        this.setupClockDetection(); // Setup clock anomaly detection
        this.setupBoxDetection(); // Setup box order anomaly detection
        this.setupShopPriceDetection(); // Setup shop price anomaly detection
        this.setupDarkVoidDetection(); // Setup dark void anomaly detection
        this.setupBlurpleLightDetection(); // Setup blurple light anomaly detection
        this.setupBoxGeneratorFreezeDetection(); // Setup box generator freeze anomaly detection
        this.setupLabDarknessDetection(); // Setup lab darkness anomaly detection
        this.setupPrismGreyDetection(); // Setup prism grey anomaly detection
        this.setupNotationScrambleDetection(); // Setup notation scramble anomaly detection
        this.loadAnomalyState(); // Restore anomalies from localStorage

    },
    
    // Setup the detector button functionality
    setupDetectorButton: function() {
        const detectorBtn = document.getElementById('anomalyDetectorBtn');
        const detectorContainer = document.getElementById('anomalyDetectorContainer');
        
        if (detectorBtn) {
            detectorBtn.addEventListener('click', () => {
                this.toggleDetectorModal();
            });
        }
        
        // Show the detector button when conditions are met
        if (detectorContainer) {
            this.updateDetectorVisibility();
        }
    },
    
    // Update detector button visibility based on game progress
    updateDetectorVisibility: function() {
        const detectorContainer = document.getElementById('anomalyDetectorContainer');
        
        if (detectorContainer) {
            // Show detector when player has at least 1 total infinity
            const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
            detectorContainer.style.display = hasInfinity ? 'block' : 'none';
            this.isDetectorVisible = hasInfinity;
            
            // Match the width of the power UI when both are visible
            if (hasInfinity) {
                // Immediate width matching
                this.matchPowerUIWidth();
                // Coordinate with boost display
                setTimeout(() => {
                    this.coordinateWithBoostDisplay();
                }, 50);
            }
        }
    },
    
    // Coordinate positioning with boost display
    coordinateWithBoostDisplay: function() {
        if (typeof window.matchAnomalyDetectorWidth === 'function') {
            window.matchAnomalyDetectorWidth();
        }
    },
    
    // Match the button width to the power UI
    matchPowerUIWidth: function() {
        const powerUI = document.getElementById('powerEnergyStatus');
        const detectorBtn = document.getElementById('anomalyDetectorBtn');
        
        if (powerUI && detectorBtn && powerUI.style.display !== 'none') {
            // Wait a bit for power UI to be fully rendered
            setTimeout(() => {
                const powerWidth = powerUI.offsetWidth;
                if (powerWidth > 0) {
                    detectorBtn.style.width = powerWidth + 'px';
                    detectorBtn.style.minWidth = 'auto';
                }
            }, 100);
        }
    },
    
    // Manually spawn a new anomaly (for external control)
    spawnAnomaly: function() {
        const anomalyId = this.nextId++;
        const anomalyTypes = ['glitch', 'static', 'distortion', 'error', 'corruption'];
        const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
        
        // Create anomaly element
        const anomaly = document.createElement('div');
        anomaly.id = `anomaly-${anomalyId}`;
        anomaly.className = `anomaly anomaly-${type}`;
        anomaly.style.cssText = this.getAnomalyStyle(type);
        
        // Position randomly on screen (avoid UI areas)
        const x = Math.random() * (window.innerWidth - 200) + 100;
        const y = Math.random() * (window.innerHeight - 200) + 100;
        anomaly.style.left = x + 'px';
        anomaly.style.top = y + 'px';
        
        // Add click handler to remove anomaly (only works in find mode)
        anomaly.addEventListener('click', () => {
            if (this.findModeActive) {
                this.removeAnomaly(anomalyId);
                this.giveAnomalyReward();

            } else {

            }
        });
        
        // Add to DOM
        document.body.appendChild(anomaly);
        
        // Track the anomaly
        this.anomalies.push({
            id: anomalyId,
            type: type,
            element: anomaly,
            spawnTime: Date.now()
        });
        
        // Add hover listeners if find mode is active
        if (this.findModeActive) {
            anomaly.addEventListener('mouseenter', this.anomalyMouseEnter);
            anomaly.addEventListener('mouseleave', this.anomalyMouseLeave);
        }
        
        // Update detector modal
        this.updateDetectorModal();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Get CSS styles for different anomaly types
    getAnomalyStyle: function(type) {
        const baseStyle = `
            position: fixed;
            width: 40px;
            height: 40px;
            z-index: 9999;
            cursor: pointer;
            border-radius: 50%;
            pointer-events: auto;
            animation: anomalyPulse 2s infinite;
        `;
        
        switch(type) {
            case 'glitch':
                return baseStyle + `
                    background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
                    box-shadow: 0 0 20px rgba(255,0,0,0.8);
                `;
            case 'static':
                return baseStyle + `
                    background: repeating-linear-gradient(45deg, #fff, #fff 2px, #000 2px, #000 4px);
                    box-shadow: 0 0 15px rgba(255,255,255,0.6);
                `;
            case 'distortion':
                return baseStyle + `
                    background: radial-gradient(circle, #ff6b6b, #4ecdc4);
                    box-shadow: 0 0 25px rgba(78,205,196,0.8);
                    filter: blur(2px);
                `;
            case 'error':
                return baseStyle + `
                    background: linear-gradient(90deg, #ff4444, #ff8888);
                    box-shadow: 0 0 20px rgba(255,68,68,0.8);
                `;
            case 'corruption':
                return baseStyle + `
                    background: linear-gradient(135deg, #8b00ff, #ff00ff);
                    box-shadow: 0 0 30px rgba(139,0,255,0.8);
                `;
            default:
                return baseStyle + `
                    background: #ff6b6b;
                    box-shadow: 0 0 15px rgba(255,107,107,0.8);
                `;
        }
    },
    
    // Remove an anomaly
    removeAnomaly: function(anomalyId) {
        const anomalyIndex = this.anomalies.findIndex(a => a.id === anomalyId);
        if (anomalyIndex === -1) return;
        
        const anomaly = this.anomalies[anomalyIndex];
        
        // Remove from DOM
        if (anomaly.element && anomaly.element.parentNode) {
            anomaly.element.parentNode.removeChild(anomaly.element);
        }
        
        // Remove from tracking array
        this.anomalies.splice(anomalyIndex, 1);
        
        // Update detector modal
        this.updateDetectorModal();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Remove all anomalies
    removeAllAnomalies: function() {
        const count = this.anomalies.length;
        this.anomalies.forEach(anomaly => {
            if (anomaly.element && anomaly.element.parentNode) {
                anomaly.element.parentNode.removeChild(anomaly.element);
            }
        });
        this.anomalies = [];
        this.updateDetectorModal();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Give reward for removing anomaly
    giveAnomalyReward: function() {
        // Show simple "anomaly fixed" notification
        this.showAnomalyFixedNotification();
    },
    
    // Show notification for anomaly fixed
    showAnomalyFixedNotification: function() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1em 2em;
            border-radius: 8px;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 99999;
            pointer-events: none;
            animation: anomalyRewardFade 3s forwards;
        `;
        notification.textContent = 'Anomaly fixed';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    },
    
    // Toggle find mode instead of modal
    toggleDetectorModal: function() {
        this.findModeActive = !this.findModeActive;
        
        if (this.findModeActive) {
            // Enable find mode
            this.enableFindMode();
        } else {
            // Disable find mode
            this.disableFindMode();
        }
    },
    
    // Enable find mode
    enableFindMode: function() {
        // Add CSS class for anomaly detector cursor (following terrarium pattern)
        document.body.classList.add('anomaly-find-mode');
        
        // Add visual feedback to the button and hide the image
        const button = document.getElementById('anomalyDetectorBtn');
        if (button) {
            button.style.background = 'linear-gradient(90deg,#ff8e8e,#ffb6b6)';
            button.style.boxShadow = '0 2px 12px rgba(255,107,107,0.6)';
            
            // Hide the icon image when find mode is active
            const buttonImg = button.querySelector('img');
            if (buttonImg) {
                buttonImg.style.display = 'none';
            }
        }
        
        // Add global click handler for anomaly detection
        this.globalClickHandler = (event) => {

            // Don't trigger if already analyzing or searching
            if (this.analyzing || this.searching) return;
            
            // Don't trigger if clicking on the anomaly detector button (allow toggling find mode off)
            if (event.target.closest('#anomalyDetectorContainer')) {
                return;
            }
            
            // Check if clicking on a soap generator overlay
            if (event.target.closest('.soap-generator-overlay')) {

                // If it's specifically the invisible clickable overlay, allow analysis
                if (event.target.classList.contains('soap-anomaly-click-overlay')) {

                    // Let the soap generator analyze function handle this directly
                    this.analyzeSoapGeneratorAnomaly(true);
                    return;
                }

                // Otherwise, let the soap generator specific handler deal with it
                return;
            }
            
            // Check if clicking on a button during find mode
            if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
                // Block the actual button functionality
                event.preventDefault();
                event.stopPropagation();

                // But still trigger analysis - don't return here!
                // Continue to the analysis section below
            }
            
            // Don't trigger if clicking on anomaly elements or wild clock overlay  
            else if (event.target.closest('.anomaly') || event.target.id === 'wildClockOverlay') {
                return;
            }
            
            // Add analyzing animation class for cursor change and start animation
            document.body.classList.add('anomaly-analyzing');
            this.startCursorAnimation();
            
            // Trigger general anomaly analysis (not targeted)
            this.analyzeAnomalies(false);
        };
        
        document.addEventListener('click', this.globalClickHandler);
        
        // Add global right-click handler for anomaly search
        this.globalRightClickHandler = (event) => {

            // Don't trigger if already analyzing or searching
            if (this.analyzing || this.searching) return;
            
            // Don't trigger if right-clicking on the anomaly detector button
            if (event.target.closest('#anomalyDetectorContainer')) {
                return;
            }
            
            // Check if search mode is unlocked by Soap's friendship level 7+
            if (!this.isSearchModeUnlocked()) {
                // Prevent context menu
                event.preventDefault();
                event.stopPropagation();
                
                // Show message that search mode is locked
                this.showPopup('Search mode locked: Increase Soap\'s friendship level to 7 or higher', '#ff9999');
                return;
            }
            
            // Prevent context menu
            event.preventDefault();
            event.stopPropagation();
            
            // Add searching animation class for cursor change and start animation
            document.body.classList.add('anomaly-analyzing'); // Reuse analyzing class for visual consistency
            this.startCursorAnimation();
            
            // Trigger anomaly search
            this.searchAnomalies();
        };
        
        document.addEventListener('contextmenu', this.globalRightClickHandler);
        
        // Apply find mode styling to existing elements including soap generator overlays
        this.updateFindModeStyles();
        
        // Optional: Add a subtle overlay or visual indicator
        const searchModeStatus = this.isSearchModeUnlocked() ? 'right click to search for nearby anomalies' : 'right click search locked (need Soap friendship level 7+)';

    },
    
    // Disable find mode
    disableFindMode: function() {
        // Stop cursor animation and remove CSS classes for cursor (following terrarium pattern)
        this.stopCursorAnimation();
        document.body.classList.remove('anomaly-find-mode');
        document.body.classList.remove('anomaly-analyzing');
        
        // Remove anomaly hover detection
        this.removeAnomalyHoverDetection();
        
        // Reset button appearance and show the image
        const button = document.getElementById('anomalyDetectorBtn');
        if (button) {
            button.style.background = 'linear-gradient(90deg,#ff6b6b,#ff8e8e)';
            button.style.boxShadow = '0 2px 8px #0004';
            
            // Show the icon image when find mode is disabled
            const buttonImg = button.querySelector('img');
            if (buttonImg) {
                buttonImg.style.display = '';
            }
        }
        
        // Remove global click handler
        if (this.globalClickHandler) {
            document.removeEventListener('click', this.globalClickHandler);
            this.globalClickHandler = null;
        }
        
        // Remove global right-click handler
        if (this.globalRightClickHandler) {
            document.removeEventListener('contextmenu', this.globalRightClickHandler);
            this.globalRightClickHandler = null;
        }

    },
    
    // Update find mode cursor styles for all relevant elements
    updateFindModeStyles: function() {
        if (!this.findModeActive) return;
        
        // Apply cursor styling to soap generator overlays if they exist
        const soapOverlays = document.querySelectorAll('.soap-generator-overlay');
        soapOverlays.forEach(overlay => {
            overlay.style.cursor = 'url("assets/icons/anomaly resolver cursor.png"), crosshair';
        });
        
        // Setup hover detection for anomalies
        this.setupAnomalyHoverDetection();
    },
    
    // Setup hover detection for anomalies to change cursor
    setupAnomalyHoverDetection: function() {
        if (!this.findModeActive) return;
        
        // Remove existing hover listeners if any
        this.removeAnomalyHoverDetection();
        
        // Enable pointer events on dangerous anomaly overlays so they can be hovered
        this.updateDangerousAnomalyPointerEvents(true);
        
        // Function to handle mouse enter on anomalies
        this.anomalyMouseEnter = (event) => {
            if (!this.findModeActive) return;
            
            const element = event.target;
            const anomalyData = this.getAnomalyDataFromElement(element);
            
            if (anomalyData) {
                if (anomalyData.isDangerous) {
                    // Dangerous anomaly - use severe cursor
                    document.body.classList.add('anomaly-hover-dangerous');
                    document.body.classList.remove('anomaly-hover-regular');
                } else {
                    // Regular anomaly - use mild cursor
                    document.body.classList.add('anomaly-hover-regular');
                    document.body.classList.remove('anomaly-hover-dangerous');
                }
            }
        };
        
        // Function to handle mouse leave on anomalies
        this.anomalyMouseLeave = (event) => {
            if (!this.findModeActive) return;
            
            // Remove both hover classes to return to default find mode cursor
            document.body.classList.remove('anomaly-hover-dangerous', 'anomaly-hover-regular');
        };
        
        // Add hover listeners to all current anomaly elements
        this.addHoverListenersToAnomalies();
        
        // Setup mutation observer to watch for new anomaly elements
        this.setupAnomalyMutationObserver();
    },
    
    // Update pointer events on dangerous anomaly overlays
    updateDangerousAnomalyPointerEvents: function(enable) {
        const darkVoidOverlay = document.getElementById('darkVoidOverlay');
        if (darkVoidOverlay) {
            darkVoidOverlay.style.pointerEvents = enable ? 'auto' : 'none';
        }
        
        const labDarknessOverlay = document.getElementById('labDarknessOverlay');
        if (labDarknessOverlay) {
            labDarknessOverlay.style.pointerEvents = enable ? 'auto' : 'none';
        }
        
        // Update dark void clouds
        const darkClouds = document.querySelectorAll('.darkVoidCloud');
        darkClouds.forEach(cloud => {
            cloud.style.pointerEvents = enable ? 'auto' : 'none';
        });
        
        // Update lab darkness particles
        const labParticles = document.querySelectorAll('.lab-darkness-particle');
        labParticles.forEach(particle => {
            particle.style.pointerEvents = enable ? 'auto' : 'none';
        });
    },
    
    // Get anomaly data from DOM element
    getAnomalyDataFromElement: function(element) {
        // Check if it's a regular anomaly with .anomaly class
        if (element.classList && element.classList.contains('anomaly')) {
            // Find the anomaly data in our anomalies array by element
            const anomaly = this.anomalies.find(a => a.element === element);
            return anomaly || { isDangerous: false }; // Default to regular if not found in array
        }
        
        // Check if it's a dangerous anomaly overlay
        if (element.id === 'darkVoidOverlay' || element.id === 'darkVoidClouds' || 
            element.classList?.contains('darkVoidCloud') ||
            element.id === 'labDarknessOverlay' || element.classList?.contains('lab-darkness-particle')) {
            return { isDangerous: true };
        }
        
        // Check if element is part of a dangerous anomaly by checking parent chain
        let current = element;
        while (current && current !== document.body) {
            if (current.id === 'darkVoidOverlay' || current.id === 'labDarknessOverlay') {
                return { isDangerous: true };
            }
            current = current.parentElement;
        }
        
        return null; // Not an anomaly
    },
    
    // Add hover listeners to all current anomaly elements
    addHoverListenersToAnomalies: function() {
        // Add listeners to regular anomalies
        const regularAnomalies = document.querySelectorAll('.anomaly');
        regularAnomalies.forEach(element => {
            element.addEventListener('mouseenter', this.anomalyMouseEnter);
            element.addEventListener('mouseleave', this.anomalyMouseLeave);
        });
        
        // Add listeners to dangerous anomaly overlays
        const darkVoidOverlay = document.getElementById('darkVoidOverlay');
        if (darkVoidOverlay) {
            darkVoidOverlay.addEventListener('mouseenter', this.anomalyMouseEnter);
            darkVoidOverlay.addEventListener('mouseleave', this.anomalyMouseLeave);
        }
        
        const labDarknessOverlay = document.getElementById('labDarknessOverlay');
        if (labDarknessOverlay) {
            labDarknessOverlay.addEventListener('mouseenter', this.anomalyMouseEnter);
            labDarknessOverlay.addEventListener('mouseleave', this.anomalyMouseLeave);
        }
        
        // Add listeners to dark void clouds
        const darkClouds = document.querySelectorAll('.darkVoidCloud');
        darkClouds.forEach(cloud => {
            cloud.addEventListener('mouseenter', this.anomalyMouseEnter);
            cloud.addEventListener('mouseleave', this.anomalyMouseLeave);
        });
        
        // Add listeners to lab darkness particles
        const labParticles = document.querySelectorAll('.lab-darkness-particle');
        labParticles.forEach(particle => {
            particle.addEventListener('mouseenter', this.anomalyMouseEnter);
            particle.addEventListener('mouseleave', this.anomalyMouseLeave);
        });
    },
    
    // Setup mutation observer to detect new anomaly elements
    setupAnomalyMutationObserver: function() {
        if (this.anomalyMutationObserver) {
            this.anomalyMutationObserver.disconnect();
        }
        
        this.anomalyMutationObserver = new MutationObserver((mutations) => {
            if (!this.findModeActive) return;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is an anomaly
                        if (node.classList?.contains('anomaly') || 
                            node.id === 'darkVoidOverlay' || 
                            node.id === 'labDarknessOverlay' ||
                            node.classList?.contains('darkVoidCloud') ||
                            node.classList?.contains('lab-darkness-particle')) {
                            
                            node.addEventListener('mouseenter', this.anomalyMouseEnter);
                            node.addEventListener('mouseleave', this.anomalyMouseLeave);
                        }
                        
                        // Also check children of added nodes
                        const childAnomalies = node.querySelectorAll?.('.anomaly, .darkVoidCloud, .lab-darkness-particle');
                        childAnomalies?.forEach(child => {
                            child.addEventListener('mouseenter', this.anomalyMouseEnter);
                            child.addEventListener('mouseleave', this.anomalyMouseLeave);
                        });
                    }
                });
            });
        });
        
        this.anomalyMutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    
    // Check if search mode is unlocked by Soap's friendship level 7+
    isSearchModeUnlocked: function() {
        const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                      (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
        return level >= 7;
    },

    // Remove anomaly hover detection
    removeAnomalyHoverDetection: function() {
        // Remove classes
        document.body.classList.remove('anomaly-hover-dangerous', 'anomaly-hover-regular');
        
        // Disable pointer events on dangerous anomaly overlays
        this.updateDangerousAnomalyPointerEvents(false);
        
        // Remove listeners from all anomaly elements
        const allAnomalyElements = document.querySelectorAll('.anomaly, .darkVoidCloud, .lab-darkness-particle');
        allAnomalyElements.forEach(element => {
            element.removeEventListener('mouseenter', this.anomalyMouseEnter);
            element.removeEventListener('mouseleave', this.anomalyMouseLeave);
        });
        
        // Remove listeners from dangerous anomaly overlays
        const darkVoidOverlay = document.getElementById('darkVoidOverlay');
        if (darkVoidOverlay) {
            darkVoidOverlay.removeEventListener('mouseenter', this.anomalyMouseEnter);
            darkVoidOverlay.removeEventListener('mouseleave', this.anomalyMouseLeave);
        }
        
        const labDarknessOverlay = document.getElementById('labDarknessOverlay');
        if (labDarknessOverlay) {
            labDarknessOverlay.removeEventListener('mouseenter', this.anomalyMouseEnter);
            labDarknessOverlay.removeEventListener('mouseleave', this.anomalyMouseLeave);
        }
        
        // Disconnect mutation observer
        if (this.anomalyMutationObserver) {
            this.anomalyMutationObserver.disconnect();
            this.anomalyMutationObserver = null;
        }
    },
    
    // Start automatic anomaly spawning
    startAnomalySpawning: function() {
        // Check for anomaly spawning every 30 seconds
        setInterval(() => {
            this.checkAnomalySpawn();
        }, 30000);
    },
    
    // Check if an anomaly should spawn
    checkAnomalySpawn: function() {
        // Only spawn anomalies if player has unlocked infinity system (same requirement as detector)
        const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
        if (!hasInfinity) {
            return; // Player hasn't unlocked infinity yet, no anomalies should spawn
        }
        
        // Check for Soap's level 10+ protection against box generator freezes
        const soapLevel = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                         (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
        
        if (soapLevel >= 10 && this.activeAnomalies.boxGeneratorFreezeAnomaly) {

            this.fixBoxGeneratorFreezeAnomaly();
        }
        
        const now = Date.now();
        const timeSinceLastSpawn = now - this.lastSpawnTime;
        
        // Only spawn if cooldown has passed and we're under max anomalies
        if (timeSinceLastSpawn >= this.spawnCooldown && this.anomalies.length < this.maxAnomalies) {
            // 5% chance to spawn an anomaly each check (every 30 seconds after cooldown)
            if (Math.random() < 0.05) {
                this.spawnRandomAnomaly();
                this.lastSpawnTime = now;
            }
        }
    },
    
    // Spawn a random anomaly
    spawnRandomAnomaly: function() {
        // First, roll for dangerous anomaly (5% chance)
        const dangerousRoll = Math.random();
        if (dangerousRoll < 0.05) { // 5% chance for dangerous anomalies
            // Choose between dangerous anomalies
            const dangerousAnomalies = [];
            if (!this.activeAnomalies.darkVoidAnomaly) {
                dangerousAnomalies.push('darkVoid');
            }
            if (!this.activeAnomalies.labDarknessAnomaly) {
                dangerousAnomalies.push('labDarkness');
            }
            
            if (dangerousAnomalies.length > 0) {
                const randomDangerous = dangerousAnomalies[Math.floor(Math.random() * dangerousAnomalies.length)];
                if (randomDangerous === 'darkVoid') {
                    this.spawnDarkVoidAnomaly();
                } else if (randomDangerous === 'labDarkness') {
                    this.spawnLabDarknessAnomaly();
                }
                return; // Early return - only spawn one anomaly at a time
            }
        }
        
        // If no dangerous anomaly spawned, spawn regular anomaly
        const regularAnomalyTypes = ['clock', 'backwardClock', 'boxOrder', 'soapGenerator', 'shopPrice', 'prismMirror', 'cargoOmegaBox', 'blurpleLight', 'boxGeneratorFreeze', 'prismGrey', 'notationScramble', 'crabBucks', 'fluzzerFlip', 'rustlingFlowers', 'dramaticWind'];
        const randomType = regularAnomalyTypes[Math.floor(Math.random() * regularAnomalyTypes.length)];
        
        switch(randomType) {
            case 'clock':
                // Only spawn if no other clock anomaly is active
                if (!this.activeAnomalies.clockAnomaly && !this.activeAnomalies.backwardClockAnomaly) {
                    this.spawnClockAnomaly();
                }
                break;
            case 'backwardClock':
                // Only spawn if no other clock anomaly is active
                if (!this.activeAnomalies.clockAnomaly && !this.activeAnomalies.backwardClockAnomaly) {
                    this.spawnBackwardClockAnomaly();
                }
                break;
            case 'boxOrder':
                // Only spawn if not already active
                if (!this.activeAnomalies.boxOrderAnomaly) {
                    this.spawnBoxOrderAnomaly();
                }
                break;
            case 'soapGenerator':
                // Only spawn if not already active
                if (!this.activeAnomalies.soapGeneratorAnomaly) {
                    this.spawnSoapGeneratorAnomaly();
                }
                break;
            case 'shopPrice':
                // Only spawn if not already active and crab anomaly is not active
                if (!this.activeAnomalies.shopPriceAnomaly && !this.activeAnomalies.crabBucksAnomaly) {
                    this.spawnShopPriceAnomaly();
                }
                break;
            case 'prismMirror':
                // Only spawn if not already active
                if (!this.activeAnomalies.prismMirrorAnomaly) {
                    this.spawnPrismMirrorAnomaly();
                }
                break;
            case 'cargoOmegaBox':
                // Only spawn if not already active
                if (!this.activeAnomalies.cargoOmegaBoxAnomaly) {
                    this.spawnCargoOmegaBoxAnomaly();
                }
                break;
            case 'blurpleLight':
                // Only spawn if not already active
                if (!this.activeAnomalies.blurpleLightAnomaly) {
                    this.spawnBlurpleLightAnomaly();
                }
                break;
            case 'boxGeneratorFreeze':
                // Only spawn if not already active
                if (!this.activeAnomalies.boxGeneratorFreezeAnomaly) {
                    this.spawnBoxGeneratorFreezeAnomaly();
                }
                break;
            case 'prismGrey':
                // Only spawn if not already active
                if (!this.activeAnomalies.prismGreyAnomaly) {
                    this.spawnPrismGreyAnomaly();
                }
                break;
            case 'notationScramble':
                // Only spawn if not already active
                if (!this.activeAnomalies.notationScrambleAnomaly) {
                    this.spawnNotationScrambleAnomaly();
                }
                break;
            case 'crabBucks':
                // Only spawn if not already active and shop price anomaly is not active
                if (!this.activeAnomalies.crabBucksAnomaly && !this.activeAnomalies.shopPriceAnomaly) {
                    this.spawnCrabBucksAnomaly();
                }
                break;
            case 'fluzzerFlip':
                // Only spawn if not already active
                if (!this.activeAnomalies.fluzzerFlipAnomaly) {
                    this.spawnFluzzerFlipAnomaly();
                }
                break;
            case 'rustlingFlowers':
                // Only spawn if not already active
                if (!this.activeAnomalies.rustlingFlowersAnomaly) {
                    this.spawnRustlingFlowersAnomaly();
                }
                break;
            case 'dramaticWind':
                // Only spawn if not already active
                if (!this.activeAnomalies.dramaticWindAnomaly) {
                    this.spawnDramaticWindAnomaly();
                }
                break;
        }
    },
    
    // Setup currency debuff system
    setupCurrencyDebuffs: function() {
        // Hook into currency gain functions to apply debuffs
        this.setupCurrencyHooks();
    },
    
    // Setup currency hooks for debuffs
    setupCurrencyHooks: function() {
        // This will need to be integrated with your existing currency systems
        // For now, we'll expose the debuff function globally
        window.getAnomalyDebuff = () => this.getCurrencyDebuff();
        
        // Hook into sleep function to block when anomalies are active
        if (typeof window.sleep === 'function') {
            const originalSleep = window.sleep;
            window.sleep = () => {
                if (!this.canPlayerSleep()) {
                    this.showPopup('Cannot sleep while anomalies are active!', '#F44336');
                    return false;
                }
                return originalSleep();
            };
        }
    },
    
    // Get current currency debuff multiplier
    getCurrencyDebuff: function() {
        const anomalyCount = this.anomalies.length;
        switch(anomalyCount) {
            case 1: return 0.98;
            case 2: return 0.95;
            case 3: return 0.9;
            default: return 1.0;
        }
    },
    
    // Check if player can sleep (blocked by anomalies)
    canPlayerSleep: function() {
        return this.anomalies.length === 0;
    },
    
    // Clock Anomaly Functions
    spawnClockAnomaly: function() {
        if (this.activeAnomalies.clockAnomaly) return; // Already active
        
        this.activeAnomalies.clockAnomaly = true;
        this.anomalies.push({
            id: this.nextId++,
            type: 'clock',
            spawnTime: Date.now()
        });
        
        // Make clock go wild (10x speed)
        this.startClockAnomaly();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Spawn backward clock anomaly
    spawnBackwardClockAnomaly: function() {
        if (this.activeAnomalies.backwardClockAnomaly) return; // Already active
        
        this.activeAnomalies.backwardClockAnomaly = true;
        this.anomalies.push({
            id: this.nextId++,
            type: 'backwardClock',
            spawnTime: Date.now()
        });
        
        // Make clock tick backwards at normal speed
        this.startBackwardClockAnomaly();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Start clock anomaly effect
    startClockAnomaly: function() {

        // Find and disable the real clock update interval
        this.disableRealClockUpdates();
        
        // Start the wild clock interval
        this.clockAnomalyInterval = setInterval(() => {
            this.wildClockUpdate();
        }, 10); // Update every 10ms for 100x wild effect

    },
    
    // Start backward clock anomaly effect
    startBackwardClockAnomaly: function() {

        // Disable real clock updates first
        this.disableRealClockUpdatesForBackward();
        
        // Store the current game time as a reference point (in minutes)
        if (window.daynight && typeof window.daynight.getTime === 'function') {
            this.backwardClockStartTime = window.daynight.getTime();
            this.backwardClockDisplayTime = this.backwardClockStartTime;
        } else {
            // Fallback to real time if daynight system not available
            this.backwardClockStartTime = Date.now();
            this.backwardClockDisplayTime = Date.now();
        }
        
        // Start the backward clock interval (normal speed - 1 second intervals)
        this.backwardClockAnomalyInterval = setInterval(() => {
            this.backwardClockUpdate();
        }, 1000); // Update every 1000ms for normal backward ticking

    },
    
    // Update backward clock display
    backwardClockUpdate: function() {
        const backwardClockElement = document.getElementById('backwardClockOverlay');
        if (backwardClockElement) {
            if (window.daynight && typeof window.daynight.getTime === 'function') {
                // Use game time system - move backward by 1 game minute per second
                this.backwardClockDisplayTime -= 1;
                
                // Keep time within 24-hour bounds (0-1439 minutes)
                if (this.backwardClockDisplayTime < 0) {
                    this.backwardClockDisplayTime = (24 * 60) - 1; // Wrap to 23:59
                }
                
                // Format time as HH:MM
                const h = Math.floor(this.backwardClockDisplayTime / 60) % 24;
                const m = this.backwardClockDisplayTime % 60;
                const timeString = h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');
                
                backwardClockElement.textContent = timeString;

            } else {
                // Fallback to real time if daynight system not available
                this.backwardClockDisplayTime -= 1000;
                
                const backwardTime = new Date(this.backwardClockDisplayTime);
                const timeString = backwardTime.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                backwardClockElement.textContent = timeString;

            }
        }
    },
    
    // Disable real clock updates for backward clock anomaly
    disableRealClockUpdatesForBackward: function() {
        // Hide the real digital clock completely
        const clockElement = document.getElementById('digitalClock');
        if (clockElement) {
            this.originalClockDisplay = clockElement.style.display;
            this.originalClockVisibility = clockElement.style.visibility;
            clockElement.style.visibility = 'hidden';

        }
        
        // Store reference to original functions and disable them
        if (typeof window.updateDigitalClock === 'function' && !window.originalUpdateDigitalClock) {
            window.originalUpdateDigitalClock = window.updateDigitalClock;
            // Completely disable the real clock update
            window.updateDigitalClock = function() {
                // Do absolutely nothing while backward anomaly is active
                return;
            };
        }
        
        // Also check for other possible clock update function names
        if (typeof window.updateClock === 'function' && !window.originalUpdateClock) {
            window.originalUpdateClock = window.updateClock;
            window.updateClock = function() {
                // Do absolutely nothing while backward anomaly is active
                return;
            };
        }
        
        // Create backward clock overlay
        this.createBackwardClockOverlay();

    },
    
    // Create overlay for backward clock display
    createBackwardClockOverlay: function() {
        // Remove existing overlay if any
        const existingOverlay = document.getElementById('backwardClockOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Get original clock position
        const originalClock = document.getElementById('digitalClock');
        if (!originalClock) return;
        
        const rect = originalClock.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(originalClock);
        
        // Create backward clock overlay
        const backwardClockOverlay = document.createElement('div');
        backwardClockOverlay.id = 'backwardClockOverlay';
        backwardClockOverlay.style.cssText = `
            position: absolute;
            left: ${rect.left + window.scrollX}px;
            top: ${rect.top + window.scrollY}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            font-weight: ${computedStyle.fontWeight};
            color: ${computedStyle.color};
            text-align: ${computedStyle.textAlign};
            line-height: ${computedStyle.lineHeight};
            background: ${computedStyle.background};
            background-color: ${computedStyle.backgroundColor};
            border-radius: ${computedStyle.borderRadius};
            border: ${computedStyle.border};
            padding: ${computedStyle.padding};
            margin: ${computedStyle.margin};
            box-shadow: ${computedStyle.boxShadow};
            text-shadow: ${computedStyle.textShadow};
            letter-spacing: ${computedStyle.letterSpacing};
            z-index: 9999;
            pointer-events: auto;
            transition: all 0.2s ease;
            box-sizing: border-box;
        `;
        
        document.body.appendChild(backwardClockOverlay);
        
        // Add click handler for anomaly detection
        backwardClockOverlay.addEventListener('click', () => {

            if (this.findModeActive && !this.analyzing && !this.searching) {
                this.analyzeClockAnomaly(true); // Pass true for targeted click on overlay
            }
        });

    },
    
    // Disable real clock updates and hide real clock
    disableRealClockUpdates: function() {
        // Hide the real digital clock completely
        const clockElement = document.getElementById('digitalClock');
        if (clockElement) {
            this.originalClockDisplay = clockElement.style.display;
            this.originalClockVisibility = clockElement.style.visibility;
            clockElement.style.visibility = 'hidden';

        }
        
        // Store reference to original functions and disable them
        if (typeof window.updateDigitalClock === 'function' && !window.originalUpdateDigitalClock) {
            window.originalUpdateDigitalClock = window.updateDigitalClock;
            // Completely disable the real clock update
            window.updateDigitalClock = function() {
                // Do absolutely nothing while anomaly is active
                return;
            };
        }
        
        // Also check for other possible clock update function names
        if (typeof window.updateClock === 'function' && !window.originalUpdateClock) {
            window.originalUpdateClock = window.updateClock;
            window.updateClock = function() {
                // Do absolutely nothing while anomaly is active
                return;
            };
        }
        
        // Create wild clock overlay
        this.createWildClockOverlay();
    },
    
    // Create overlay for wild clock display
    createWildClockOverlay: function() {
        // Remove existing overlay if any
        const existingOverlay = document.getElementById('wildClockOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Get original clock position
        const originalClock = document.getElementById('digitalClock');
        if (!originalClock) return;
        
        const rect = originalClock.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(originalClock);
        
        // Create wild clock overlay
        const wildClockOverlay = document.createElement('div');
        wildClockOverlay.id = 'wildClockOverlay';
        wildClockOverlay.style.cssText = `
            position: absolute;
            left: ${rect.left + window.scrollX}px;
            top: ${rect.top + window.scrollY}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            font-weight: ${computedStyle.fontWeight};
            color: #ffe066;
            text-align: ${computedStyle.textAlign};
            line-height: ${computedStyle.lineHeight};
            background: ${computedStyle.background};
            background-color: ${computedStyle.backgroundColor};
            border-radius: ${computedStyle.borderRadius};
            padding: ${computedStyle.padding};
            margin: ${computedStyle.margin};
            z-index: 9999;
            pointer-events: auto;
            transition: all 0.2s ease;
            box-sizing: border-box;
        `;
        
        document.body.appendChild(wildClockOverlay);
        
        // Add click handler for anomaly detection
        wildClockOverlay.addEventListener('click', () => {

            if (this.findModeActive && !this.analyzing && !this.searching) {
                this.analyzeClockAnomaly(true); // Pass true for targeted click on overlay
            }
        });

    },
    
    // Wild clock update function (100x speed)
    wildClockUpdate: function() {
        if (!this.activeAnomalies.clockAnomaly) {
            // Anomaly fixed, restore normal clock
            if (this.clockAnomalyInterval) {
                clearInterval(this.clockAnomalyInterval);
                this.clockAnomalyInterval = null;
            }
            return;
        }
        
        // Update overlay clock with wild fluctuation
        const wildClockElement = document.getElementById('wildClockOverlay');
        if (wildClockElement) {
            // Create rapidly changing time display
            const now = Date.now();
            const wildMinutes = (now / 10) % (24 * 60); // 100x faster time progression
            const hours = Math.floor(wildMinutes / 60);
            const minutes = Math.floor(wildMinutes % 60);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            wildClockElement.textContent = timeString;
            
            // Add some visual glitch effects
            if (Math.random() < 0.1) {
                wildClockElement.style.color = ['red', 'blue', 'green', 'yellow', 'magenta', 'cyan'][Math.floor(Math.random() * 6)];
            } else {
                wildClockElement.style.color = '#ffe066'; // Original clock color
            }
            
            // Occasionally add text shadow for extra wild effect
            if (Math.random() < 0.05) {
                wildClockElement.style.textShadow = '0 0 10px currentColor';
            } else {
                wildClockElement.style.textShadow = '';
            }
        }
    },
    
    // Setup clock click detection for find mode
    setupClockDetection: function() {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            const clockElement = document.getElementById('digitalClock');
            if (clockElement) {

                clockElement.addEventListener('click', () => {

                    if (this.findModeActive && !this.analyzing && !this.searching) {
                        this.analyzeClockAnomaly(true); // Pass true for targeted click
                    }
                });
                
                // Store original styles for restoration
                this.originalClockStyles = {
                    cursor: clockElement.style.cursor || '',
                    boxShadow: clockElement.style.boxShadow || '',
                    border: clockElement.style.border || '',
                    outline: clockElement.style.outline || ''
                };
                
                // Set up visual feedback updates
                this.setupClockVisualFeedback();
            } else {

            }
        }, 1000);
    },
    
    // Setup box button click detection for find mode
    setupBoxDetection: function() {
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            const boxButtons = this.getBoxButtons();
            if (boxButtons.length === 5) {

                boxButtons.forEach((btn, index) => {
                    btn.addEventListener('click', (event) => {

                        if (this.findModeActive && !this.analyzing && !this.searching && this.activeAnomalies.boxOrderAnomaly) {
                            // Prevent the actual box purchase
                            event.preventDefault();
                            event.stopPropagation();
                            
                            // Add analyzing animation class for cursor change and start animation
                            document.body.classList.add('anomaly-analyzing');
                            this.startCursorAnimation();
                            
                            // Analyze box order anomaly (targeted click)
                            this.analyzeBoxOrderAnomaly(true);
                        }
                    });
                });
            } else {

            }
        }, 1000);
    },
    
    // Setup visual feedback for clock anomaly detection
    setupClockVisualFeedback: function() {
        setInterval(() => {
            this.updateClockVisualFeedback();
        }, 100);
    },
    
    // Update visual feedback for both real clock and overlay
    updateClockVisualFeedback: function() {
        const clockElement = document.getElementById('digitalClock');
        const wildClockOverlay = document.getElementById('wildClockOverlay');
        
        // Determine what visual state we should be in
        const shouldShowAnomalyIndicator = this.findModeActive && this.activeAnomalies.clockAnomaly;
        const shouldShowFindMode = this.findModeActive;
        
        // Update real clock (when not hidden)
        if (clockElement && !this.activeAnomalies.clockAnomaly) {
            this.applyClockVisualState(clockElement, shouldShowAnomalyIndicator, shouldShowFindMode);
        }
        
        // Update wild clock overlay (when anomaly is active)
        if (wildClockOverlay && this.activeAnomalies.clockAnomaly) {
            this.applyClockVisualState(wildClockOverlay, shouldShowAnomalyIndicator, shouldShowFindMode);
        }
    },
    
    // Apply visual state to a clock element
    applyClockVisualState: function(element, showAnomalyIndicator, showFindMode) {
        // Always restore to normal state - no visual effects
        element.style.cursor = this.originalClockStyles?.cursor || '';
        element.style.boxShadow = this.originalClockStyles?.boxShadow || '';
        element.style.border = this.originalClockStyles?.border || '';
        element.style.outline = this.originalClockStyles?.outline || '';
    },
    
    // Start cursor animation during analysis
    startCursorAnimation: function() {
        if (this.cursorAnimationInterval) {
            clearInterval(this.cursorAnimationInterval);
        }
        
        this.currentCursorFrame = 1;
        this.updateCursorFrame();
        
        this.cursorAnimationInterval = setInterval(() => {
            this.currentCursorFrame = (this.currentCursorFrame % 3) + 1;
            this.updateCursorFrame();
        }, 200);
    },
    
    // Stop cursor animation
    stopCursorAnimation: function() {
        if (this.cursorAnimationInterval) {
            clearInterval(this.cursorAnimationInterval);
            this.cursorAnimationInterval = null;
        }
        
        // Remove all frame classes
        document.body.classList.remove('frame-1', 'frame-2', 'frame-3');
    },
    
    // Update cursor frame class
    updateCursorFrame: function() {
        // Remove all frame classes first
        document.body.classList.remove('frame-1', 'frame-2', 'frame-3');
        
        // Add current frame class
        document.body.classList.add(`frame-${this.currentCursorFrame}`);
    },
    
    // Spawn box order anomaly
    // NOTE: This anomaly has mutual exclusion with cargoOmegaBoxAnomaly since both affect the boxes area
    spawnBoxOrderAnomaly: function() {
        if (this.activeAnomalies.boxOrderAnomaly) return; // Already active
        
        // Prevent spawning if cargo OMEGA box anomaly is active (mutual exclusion)
        if (this.activeAnomalies.cargoOmegaBoxAnomaly) {

            return;
        }
        
        this.activeAnomalies.boxOrderAnomaly = true;
        this.anomalies.push({
            id: this.nextId++,
            type: 'boxOrder',
            spawnTime: Date.now()
        });
        
        // Randomize box order
        this.startBoxOrderAnomaly();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Start box order anomaly effect
    startBoxOrderAnomaly: function() {

        // Find the box buttons container
        const boxButtons = this.getBoxButtons();
        if (boxButtons.length === 5) {
            // Store original order for restoration
            this.originalBoxOrder = boxButtons.map(btn => ({
                element: btn,
                parent: btn.parentNode,
                nextSibling: btn.nextSibling
            }));
            
            // Create randomized order
            const randomizedButtons = [...boxButtons];
            this.shuffleArray(randomizedButtons);
            
            // Remove all buttons from DOM
            boxButtons.forEach(btn => btn.remove());
            
            // Re-add in randomized order
            const container = this.originalBoxOrder[0].parent;
            randomizedButtons.forEach(btn => {
                container.appendChild(btn);
            });

        } else {

        }
    },
    
    // Get all box buttons in order
    getBoxButtons: function() {
        // Look for buttons with onclick="buyBox(...)" 
        const allButtons = document.querySelectorAll('button[onclick*="buyBox"]');
        return Array.from(allButtons);
    },
    
    // Shuffle array in place (Fisher-Yates algorithm)
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    
    // Fix box order anomaly
    fixBoxOrderAnomaly: function() {
        if (!this.activeAnomalies.boxOrderAnomaly) return;

        // Restore original order
        if (this.originalBoxOrder && this.originalBoxOrder.length === 5) {
            // Remove all current buttons
            const currentButtons = this.getBoxButtons();
            currentButtons.forEach(btn => btn.remove());
            
            // Restore original order
            this.originalBoxOrder.forEach(btnInfo => {
                if (btnInfo.nextSibling) {
                    btnInfo.parent.insertBefore(btnInfo.element, btnInfo.nextSibling);
                } else {
                    btnInfo.parent.appendChild(btnInfo.element);
                }
            });

        }
        
        // Clean up
        this.originalBoxOrder = null;
        this.activeAnomalies.boxOrderAnomaly = false;
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'boxOrder');
        
        // Save state
        this.saveAnomalyState();
        
        // Give reward
        this.giveAnomalyReward();

    },
    
    // Analyze box order anomaly
    analyzeBoxOrderAnomaly: function(isTargetedClick = false) {
        if (this.analyzing || this.searching) return;
        
        this.analyzing = true;

        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class, return to normal find mode cursor
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if (this.activeAnomalies.boxOrderAnomaly && isTargetedClick) {
                // Box order anomaly detected and box buttons clicked directly - fix it
                this.fixBoxOrderAnomaly();
            } else {
                // Either no anomaly OR anomaly detected but not clicked directly
                // In both cases, show "No anomaly detected" to not give away the location
                this.showNoAnomaly();
            }
        }, 3000);
    },
    
    // General anomaly analysis function
    analyzeAnomalies: function(isTargetedClick = false) {
        if (this.analyzing || this.searching) return;
        
        this.analyzing = true;

        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class, return to normal find mode cursor
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            // Check for any active anomalies but don't give away location unless clicked directly
            if ((this.activeAnomalies.clockAnomaly || this.activeAnomalies.backwardClockAnomaly || this.activeAnomalies.boxOrderAnomaly || this.activeAnomalies.soapGeneratorAnomaly || this.activeAnomalies.shopPriceAnomaly || this.activeAnomalies.darkVoidAnomaly || this.activeAnomalies.labDarknessAnomaly || this.activeAnomalies.crabBucksAnomaly || this.activeAnomalies.fluzzerFlipAnomaly) && !isTargetedClick) {
                // Anomaly exists but not clicked directly - don't give away location
                this.showNoAnomaly();
            } else if (!this.activeAnomalies.clockAnomaly && !this.activeAnomalies.backwardClockAnomaly && !this.activeAnomalies.boxOrderAnomaly && !this.activeAnomalies.soapGeneratorAnomaly && !this.activeAnomalies.shopPriceAnomaly && !this.activeAnomalies.darkVoidAnomaly && !this.activeAnomalies.blurpleLightAnomaly && !this.activeAnomalies.boxGeneratorFreezeAnomaly && !this.activeAnomalies.labDarknessAnomaly && !this.activeAnomalies.crabBucksAnomaly && !this.activeAnomalies.fluzzerFlipAnomaly) {
                // No anomalies present
                this.showNoAnomaly();
            } else {
                // This shouldn't happen with the current logic, but handle it
                this.showNoAnomaly();
            }
        }, 3000);
    },
    
    // Analyze clock for anomaly
    analyzeClockAnomaly: function(isTargetedClick = false) {
        if (this.analyzing || this.searching) return;
        
        this.analyzing = true;

        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class, return to normal find mode cursor
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if ((this.activeAnomalies.clockAnomaly || this.activeAnomalies.backwardClockAnomaly) && isTargetedClick) {
                // Clock anomaly detected and clicked directly - fix it
                if (this.activeAnomalies.clockAnomaly) {
                    this.fixClockAnomaly();
                } else if (this.activeAnomalies.backwardClockAnomaly) {
                    this.fixBackwardClockAnomaly();
                }
            } else {
                // Either no anomaly OR anomaly detected but not clicked directly
                // In both cases, show "No anomaly detected" to not give away the location
                this.showNoAnomaly();
            }
        }, 3000);
    },
    
    // Fix clock anomaly
    fixClockAnomaly: function() {

        this.activeAnomalies.clockAnomaly = false;
        
        // Stop the wild clock interval
        if (this.clockAnomalyInterval) {
            clearInterval(this.clockAnomalyInterval);
            this.clockAnomalyInterval = null;
        }
        
        // Restore real clock update functions and visibility
        this.restoreRealClockUpdates();
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'clock');
        
        // Save state to persist across refreshes
        this.saveAnomalyState();
        
        // Give reward
        this.giveAnomalyReward();

    },
    
    // Fix backward clock anomaly
    fixBackwardClockAnomaly: function() {

        this.activeAnomalies.backwardClockAnomaly = false;
        
        // Stop the backward clock interval
        if (this.backwardClockAnomalyInterval) {
            clearInterval(this.backwardClockAnomalyInterval);
            this.backwardClockAnomalyInterval = null;
        }
        
        // Restore real clock updates
        this.restoreRealClockUpdatesForBackward();
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'backwardClock');
        
        // Save state to persist across refreshes
        this.saveAnomalyState();
        
        // Give reward
        this.giveAnomalyReward();

    },
    
    // Restore real clock updates for backward clock anomaly
    restoreRealClockUpdatesForBackward: function() {
        // Restore real clock visibility
        const clockElement = document.getElementById('digitalClock');
        if (clockElement) {
            clockElement.style.visibility = this.originalClockVisibility || '';
            clockElement.style.display = this.originalClockDisplay || '';

        }
        
        // Remove backward clock overlay
        const backwardClockOverlay = document.getElementById('backwardClockOverlay');
        if (backwardClockOverlay) {
            backwardClockOverlay.remove();

        }
        
        // Restore original functions
        if (window.originalUpdateDigitalClock) {
            window.updateDigitalClock = window.originalUpdateDigitalClock;
            window.originalUpdateDigitalClock = null;

        }
        
        if (window.originalUpdateClock) {
            window.updateClock = window.originalUpdateClock;
            window.originalUpdateClock = null;

        }
        
        // Force an immediate clock update to show correct time
        setTimeout(() => {
            if (window.updateDigitalClock) {
                window.updateDigitalClock();
            }
            if (window.updateClock) {
                window.updateClock();
            }
        }, 50);

    },
    
    // Restore real clock updates
    restoreRealClockUpdates: function() {
        // Restore real clock visibility
        const clockElement = document.getElementById('digitalClock');
        if (clockElement) {
            clockElement.style.visibility = this.originalClockVisibility || '';
            clockElement.style.display = this.originalClockDisplay || '';
            
            // Reset visual styles to original state
            if (this.originalClockStyles) {
                clockElement.style.cursor = this.originalClockStyles.cursor;
                clockElement.style.boxShadow = this.originalClockStyles.boxShadow;
                clockElement.style.border = this.originalClockStyles.border;
                clockElement.style.outline = this.originalClockStyles.outline;
            }

        }
        
        // Remove wild clock overlay
        const wildClockOverlay = document.getElementById('wildClockOverlay');
        if (wildClockOverlay) {
            wildClockOverlay.remove();

        }
        
        // Restore original functions
        if (window.originalUpdateDigitalClock) {
            window.updateDigitalClock = window.originalUpdateDigitalClock;
            window.originalUpdateDigitalClock = null;

        }
        
        if (window.originalUpdateClock) {
            window.updateClock = window.originalUpdateClock;
            window.originalUpdateClock = null;

        }
        
        // Force an immediate clock update to show correct time
        setTimeout(() => {
            if (window.updateDigitalClock) {
                window.updateDigitalClock();
            }
            if (window.updateClock) {
                window.updateClock();
            }
        }, 50);
    },
    
    // Soap Generator Anomaly Functions - COMPLETELY NEW IMPLEMENTATION
    spawnSoapGeneratorAnomaly: function() {
        if (this.activeAnomalies.soapGeneratorAnomaly) {
            return; // Already active
        }
        
        this.activeAnomalies.soapGeneratorAnomaly = true;
        this.anomalies.push({
            id: this.nextId++,
            type: 'soapGenerator',
            spawnTime: Date.now()
        });
        
        // Transform power generator to soap generator
        this.startSoapGeneratorAnomaly();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },
    
    // Start soap generator anomaly effect - NEW APPROACH
    startSoapGeneratorAnomaly: function() {

        // Transform existing power generators directly
        this.transformPowerGeneratorsToSoap();
        
        // Start bubble animation
        this.startBubbleAnimation();
        
        // Setup tab monitoring instead of aggressive maintenance
        this.setupGeneratorsTabMonitoring();

    },
    
    // Transform existing power generators into soap generators - SIMPLE APPROACH
    transformPowerGeneratorsToSoap: function() {
        const powerGenerators = document.querySelectorAll('.power-generator');

        // Check if already transformed
        const alreadyTransformed = document.querySelectorAll('.power-generator[data-soap-transformed="true"]');
        if (alreadyTransformed.length === powerGenerators.length && powerGenerators.length > 0) {

            return;
        }
        
        powerGenerators.forEach((generator, index) => {
            // Skip if already transformed
            if (generator.getAttribute('data-soap-transformed') === 'true') {
                return;
            }
            
            // Store original content for restoration
            if (!generator.getAttribute('data-soap-original-content')) {
                generator.setAttribute('data-soap-original-content', generator.innerHTML);
                generator.setAttribute('data-soap-original-styles', generator.style.cssText);
            }
            
            // Transform the content
            generator.innerHTML = `
                <h3>Soap Generator</h3>
                <div class="power-status-display">
                    <div class="power-status online" style="background: #4caf50; color: white;">ONLINE</div>
                    <div class="power-energy">${state.powerEnergy ? state.powerEnergy.floor() : 100}/${state.powerMaxEnergy || 100}</div>
                </div>
                <div class="power-progress-container">
                    <div class="power-progress-bar">
                        <div class="power-progress-fill" style="width: ${state.powerEnergy ? (state.powerEnergy.div(state.powerMaxEnergy || 100).mul(100).toNumber()) : 100}%; background: linear-gradient(90deg, #66bb6a 0%, #81c784 50%, #a5d6a7 100%);"></div>
                    </div>
                </div>
                <div class="soap-refill-text" style="
                    background: linear-gradient(90deg, #4caf50, #66bb6a);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    text-align: center;
                    font-weight: bold;
                    margin: 8px 0;
                    border: 2px solid #2e7d32;
                ">
                    Refill Soap
                </div>
                <div class="power-info">
                    <small>Energy depletes at 1 per 5 seconds</small><br>
                    <small>Click refill anytime to restore soap</small>
                </div>
                <div class="soap-click-detector" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    z-index: 1000;
                    cursor: pointer;
                "></div>
            `;
            
            // Apply soap styling
            generator.style.cssText = `
                background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%) !important;
                border: 2px solid #66bb6a !important;
                box-shadow: 0 0 20px rgba(102, 187, 106, 0.4) !important;
                color: #2e7d32 !important;
                position: relative;
            `;
            
            // Mark as transformed
            generator.setAttribute('data-soap-transformed', 'true');

        });
        
        // Set up global click detection using event delegation
        this.setupSoapClickDetection();
    },
    
    // Set up click detection for soap generators using event delegation
    setupSoapClickDetection: function() {
        // Remove any existing handlers
        if (this.soapGlobalClickHandler) {
            document.removeEventListener('click', this.soapGlobalClickHandler);
        }
        
        // Create new global handler for soap generators
        this.soapGlobalClickHandler = (event) => {
            // Check if click is on a soap generator or its detector
            const soapGenerator = event.target.closest('.power-generator[data-soap-transformed="true"]');
            const clickDetector = event.target.closest('.soap-click-detector');
            
            if ((soapGenerator || clickDetector) && this.findModeActive && !this.analyzing && !this.searching) {

                event.stopPropagation();
                this.analyzeSoapGeneratorAnomaly(true);
            }
        };
        
        document.addEventListener('click', this.soapGlobalClickHandler);

    },
    
    // Setup monitoring for Generators tab clicks to re-apply soap transformation
    setupGeneratorsTabMonitoring: function() {
        // Remove any existing tab handlers
        if (this.generatorsTabHandler) {
            document.removeEventListener('click', this.generatorsTabHandler);
        }
        
        // Create handler for generators tab clicks
        this.generatorsTabHandler = (event) => {
            const clickedButton = event.target.closest('button');
            let shouldReapply = false;
            
            // Check if click is on the "Generators" tab button
            if (clickedButton && clickedButton.textContent && clickedButton.textContent.trim() === 'Generators') {

                shouldReapply = true;
            }
            
            // Check if click is on the "Box Generators" sub-tab button
            if (clickedButton && (clickedButton.id === 'generatorBoxGenBtn' || 
                (clickedButton.textContent && clickedButton.textContent.trim() === 'Box Generators'))) {

                shouldReapply = true;
            }
            
            if (shouldReapply) {
                // Re-apply soap transformation after a short delay to let the UI update
                setTimeout(() => {
                    if (this.activeAnomalies.soapGeneratorAnomaly) {
                        this.transformPowerGeneratorsToSoap();
                        this.setupSoapClickDetection();
                    }
                }, 100);
            }
        };
        
        document.addEventListener('click', this.generatorsTabHandler);

    },
    
    // Analyze soap generator anomaly - SIMPLIFIED
    analyzeSoapGeneratorAnomaly: function(isTargetedClick = false) {
        if (this.analyzing || this.searching) return;
        
        this.analyzing = true;

        // Add analyzing animation class for cursor change and start animation
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if (this.activeAnomalies.soapGeneratorAnomaly && isTargetedClick) {
                // Soap generator anomaly detected and clicked directly - fix it
                this.fixSoapGeneratorAnomaly();
            } else {
                // Either no anomaly OR anomaly detected but not clicked directly
                this.showNoAnomaly();
            }
        }, 3000);
    },
    
    // Fix soap generator anomaly - SIMPLIFIED
    fixSoapGeneratorAnomaly: function() {

        this.activeAnomalies.soapGeneratorAnomaly = false;
        
        // Stop bubble animation
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        
        // Remove all soap bubbles and screen container
        const bubbleContainer = document.getElementById('soap-bubble-screen-container');
        if (bubbleContainer) {
            bubbleContainer.remove();
        }
        
        // Restore original power generators
        this.restorePowerGeneratorsFromSoap();
        
        // Remove click handlers
        if (this.soapGlobalClickHandler) {
            document.removeEventListener('click', this.soapGlobalClickHandler);
            this.soapGlobalClickHandler = null;
        }
        
        // Remove tab monitoring handler
        if (this.generatorsTabHandler) {
            document.removeEventListener('click', this.generatorsTabHandler);
            this.generatorsTabHandler = null;
        }
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'soapGenerator');
        
        // Save state to persist across refreshes
        this.saveAnomalyState();
        
        // Show Soap's disappointed reaction to the anomaly being fixed
        if (typeof window.showSoapDisappointedSpeech === 'function') {
            // Add a small delay so the restoration happens first
            setTimeout(() => {
                window.showSoapDisappointedSpeech();
            }, 1000);
        }
        
        // Give reward
        this.giveAnomalyReward();

    },
    
    // Start bubble animation
    startBubbleAnimation: function() {
        // Only start if not already running
        if (this.bubbleInterval) {

            return;
        }
        
        // Create screen-wide bubble container
        this.addBubbleContainerToScreen();
        
        // Start spawning bubbles at regular intervals
        this.bubbleInterval = setInterval(() => {
            this.spawnSoapBubble();
        }, 1000 + Math.random() * 2000); // Random interval between 1-3 seconds

    },
    
    // Add bubble container to the document body for screen-wide bubbles
    addBubbleContainerToScreen: function() {
        // Remove existing bubble container
        const existingContainer = document.getElementById('soap-bubble-screen-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const bubbleContainer = document.createElement('div');
        bubbleContainer.id = 'soap-bubble-screen-container';
        bubbleContainer.className = 'soap-bubble-screen-container';
        bubbleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            overflow: hidden;
            z-index: 999;
        `;
        
        document.body.appendChild(bubbleContainer);
    },
    
    // Spawn a single soap bubble
    spawnSoapBubble: function() {
        const bubbleContainer = document.getElementById('soap-bubble-screen-container');
        if (!bubbleContainer) return;
        
        const bubble = document.createElement('img');
        bubble.className = 'soap-bubble-screen';
        bubble.src = 'assets/icons/soap bubble.png';
        bubble.alt = 'Soap Bubble';
        
        const size = 20 + Math.random() * 30; // 20-50px diameter
        const startX = Math.random() * (window.innerWidth - size); // Random horizontal position
        const duration = 8 + Math.random() * 4; // 8-12 seconds float time
        const driftX = (Math.random() - 0.5) * 200; // Random horizontal drift
        
        bubble.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            bottom: -50px;
            left: ${startX}px;
            animation: soapBubbleScreenFloat ${duration}s ease-out forwards;
            pointer-events: none;
            opacity: 0.8;
            z-index: 1000;
            transform: translateX(0px);
        `;
        
        // Add custom animation properties
        bubble.style.setProperty('--drift-x', `${driftX}px`);
        
        bubbleContainer.appendChild(bubble);
        
        // Remove bubble after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, duration * 1000);
    },

    // Restore original power generators from soap transformation
    restorePowerGeneratorsFromSoap: function() {
        const soapGenerators = document.querySelectorAll('.power-generator[data-soap-transformed="true"]');
        
        soapGenerators.forEach((generator, index) => {
            // Restore original content
            const originalContent = generator.getAttribute('data-soap-original-content');
            const originalStyles = generator.getAttribute('data-soap-original-styles');
            
            if (originalContent) {
                generator.innerHTML = originalContent;
            }
            
            if (originalStyles) {
                generator.style.cssText = originalStyles;
            } else {
                generator.style.cssText = '';
            }
            
            // Remove soap transformation attributes
            generator.removeAttribute('data-soap-transformed');
            generator.removeAttribute('data-soap-original-content');
            generator.removeAttribute('data-soap-original-styles');

        });

    },
    
    // UI Feedback Functions
    showAnalyzing: function() {
        // Create temporary analyzing popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1em 2em;
            border-radius: 8px;
            z-index: 999999;
            font-family: 'Orbitron', monospace;
            font-size: 1.1em;
        `;
        popup.textContent = 'Analyzing... Please wait...';
        document.body.appendChild(popup);
        
        // Remove after analysis
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3500);
    },
    
    showSearching: function() {
        // Create temporary searching popup
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1em 2em;
            border-radius: 8px;
            z-index: 999999;
            font-family: 'Orbitron', monospace;
            font-size: 1.1em;
        `;
        popup.textContent = 'Searching... Please wait...';
        document.body.appendChild(popup);
        
        // Remove after search
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3000);
    },
    
    // Search for nearby anomalies
    searchAnomalies: function() {
        if (this.searching) return;
        
        this.searching = true;

        // Show searching feedback
        this.showSearching();
        
        setTimeout(() => {
            this.searching = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            // Count active anomalies
            const anomalyCount = this.countActiveAnomalies();
            
            if (anomalyCount === 0) {
                this.showSearchResult('No anomaly nearby');
            } else if (anomalyCount === 1) {
                this.showSearchResult('1 anomaly nearby');
            } else {
                this.showSearchResult(`${anomalyCount} anomalies nearby`);
            }
        }, 3000);
    },
    
    // Count all active anomalies
    countActiveAnomalies: function() {
        let count = 0;
        
        // Count regular anomalies (visual anomaly dots)
        count += this.anomalies.filter(a => a.element && a.element.parentNode).length;
        
        // Count active special anomalies
        const specialAnomalies = this.activeAnomalies;
        if (specialAnomalies.clockAnomaly) count++;
        if (specialAnomalies.backwardClockAnomaly) count++;
        if (specialAnomalies.boxOrderAnomaly) count++;
        if (specialAnomalies.soapGeneratorAnomaly) count++;
        if (specialAnomalies.shopPriceAnomaly) count++;
        if (specialAnomalies.darkVoidAnomaly) count++;
        if (specialAnomalies.prismMirrorAnomaly) count++;
        if (specialAnomalies.cargoOmegaBoxAnomaly) count++;
        if (specialAnomalies.blurpleLightAnomaly) count++;
        if (specialAnomalies.boxGeneratorFreezeAnomaly) count++;
        if (specialAnomalies.labDarknessAnomaly) count++;
        if (specialAnomalies.prismGreyAnomaly) count++;
        
        return count;
    },
    
    showSearchResult: function(message) {
        this.showPopup(message, '#000000'); // Black color to match other notifications
    },
    
    showAnomalyFixed: function(message) {
        this.showPopup(message, '#4CAF50'); // Green
    },
    
    showNoAnomaly: function() {
        this.showPopup('No anomaly detected', '#000000'); // Black
    },
    
    showAnomalyDetected: function() {
        this.showPopup('Anomaly detected - click directly on the anomaly to fix it', '#ff9800'); // Orange
    },
    
    showPopup: function(message, color) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${color};
            color: white;
            padding: 1em 2em;
            border-radius: 8px;
            z-index: 999999;
            font-family: 'Orbitron', monospace;
            font-size: 1.1em;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        `;
        popup.textContent = message;
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 3000);
    },
    
    // Update the detector modal content
    updateDetectorModal: function() {
        const listContainer = document.getElementById('anomalyDetectorList');
        
        if (!listContainer) return;
        
        // Clear existing content
        listContainer.innerHTML = '';
        
        if (this.anomalies.length === 0) {
            // Modal will be empty when no anomalies
            return;
        }
        
        // Add anomaly buttons
        this.anomalies.forEach(anomaly => {
            const anomalyBtn = document.createElement('button');
            anomalyBtn.style.cssText = `
                padding: 0.5em 1em;
                background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.9em;
                margin: 0.25em;
            `;
            anomalyBtn.textContent = `${anomaly.type.charAt(0).toUpperCase() + anomaly.type.slice(1)} #${anomaly.id}`;
            anomalyBtn.addEventListener('click', () => {
                // Highlight the anomaly on screen briefly
                if (anomaly.element) {
                    anomaly.element.style.animation = 'anomalyHighlight 1s ease-in-out';
                    setTimeout(() => {
                        if (anomaly.element) {
                            anomaly.element.style.animation = 'anomalyPulse 2s infinite';
                        }
                    }, 1000);
                }
            });
            
            listContainer.appendChild(anomalyBtn);
        });
    },
    
    // Get anomaly statistics
    getStats: function() {
        return {
            activeAnomalies: this.anomalies.length,
            totalSpawned: this.nextId - 1,
            detectorVisible: this.isDetectorVisible,
            totalInfinity: window.infinitySystem ? window.infinitySystem.totalInfinityEarned : 0
        };
    },
    
    // Save anomaly state to localStorage
    saveAnomalyState: function() {
        const state = {
            activeAnomalies: this.activeAnomalies,
            anomalies: this.anomalies.map(anomaly => ({
                id: anomaly.id,
                type: anomaly.type,
                spawnTime: anomaly.spawnTime,
                affectedItem: anomaly.affectedItem // Include affected item for shop price anomalies
            })),
            nextId: this.nextId,
            lastSpawnTime: this.lastSpawnTime,
            anomalyAffectedItem: this.anomalyAffectedItem, // Save the current affected item
            frozenGeneratorId: this.frozenGeneratorId // Save frozen generator ID
        };
        
        try {
            localStorage.setItem('anomalySystemState', JSON.stringify(state));

        } catch (error) {

        }
    },
    
    // Load anomaly state from localStorage
    loadAnomalyState: function() {
        try {
            const savedState = localStorage.getItem('anomalySystemState');
            if (!savedState) {

                return;
            }
            
            const state = JSON.parse(savedState);
            
            // Restore basic state
            this.nextId = state.nextId || 1;
            this.lastSpawnTime = state.lastSpawnTime || 0;
            this.anomalyAffectedItem = state.anomalyAffectedItem || null; // Restore affected item
            this.frozenGeneratorId = state.frozenGeneratorId || null; // Restore frozen generator ID
            this.activeAnomalies = state.activeAnomalies || { 
                clockAnomaly: false, 
                backwardClockAnomaly: false,
                boxOrderAnomaly: false,
                soapGeneratorAnomaly: false,
                shopPriceAnomaly: false,
                darkVoidAnomaly: false,
                prismMirrorAnomaly: false,
                cargoOmegaBoxAnomaly: false,
                blurpleLightAnomaly: false,
                boxGeneratorFreezeAnomaly: false,
                labDarknessAnomaly: false,
                prismGreyAnomaly: false,
                notationScrambleAnomaly: false,
                crabBucksAnomaly: false,
                fluzzerFlipAnomaly: false,
                rustlingFlowersAnomaly: false,
                dramaticWindAnomaly: false
            };
            
            // Restore active anomalies
            if (state.anomalies && state.anomalies.length > 0) {
                state.anomalies.forEach(savedAnomaly => {
                    if (savedAnomaly.type === 'clock') {
                        // Restore clock anomaly
                        this.restoreClockAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'backwardClock') {
                        // Restore backward clock anomaly
                        this.restoreBackwardClockAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'boxOrder') {
                        // Restore box order anomaly
                        this.restoreBoxOrderAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'soapGenerator') {
                        // Restore soap generator anomaly
                        this.restoreSoapGeneratorAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'shopPrice') {
                        // Restore shop price anomaly
                        this.restoreShopPriceAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'darkVoid') {
                        // Restore dark void anomaly
                        this.restoreDarkVoidAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'prismMirror') {
                        // Restore prism mirror anomaly
                        this.restorePrismMirrorAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'cargoOmegaBox') {
                        // Restore cargo OMEGA box anomaly
                        this.restoreCargoOmegaBoxAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'blurpleLight') {
                        // Restore blurple light anomaly
                        this.restoreBlurpleLightAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'boxGeneratorFreeze') {
                        // Restore box generator freeze anomaly
                        this.restoreBoxGeneratorFreezeAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'labDarkness') {
                        // Restore lab darkness anomaly
                        this.restoreLabDarknessAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'prismGrey') {
                        // Restore prism grey anomaly
                        this.restorePrismGreyAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'notationScramble') {
                        // Restore notation scramble anomaly
                        this.restoreNotationScrambleAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'crabBucks') {
                        // Restore crab bucks anomaly
                        this.restoreCrabBucksAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'fluzzerFlip') {
                        // Restore fluzzer flip anomaly
                        this.restoreFluzzerFlipAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'rustlingFlowers') {
                        // Restore rustling flowers anomaly
                        this.restoreRustlingFlowersAnomaly(savedAnomaly);
                    } else if (savedAnomaly.type === 'dramaticWind') {
                        // Restore dramatic wind anomaly
                        this.restoreDramaticWindAnomaly(savedAnomaly);
                    } else {
                        // Restore other anomaly types (for future expansion)
                        this.restoreGeneralAnomaly(savedAnomaly);
                    }
                });
            }

        } catch (error) {

            // Clear corrupted data
            localStorage.removeItem('anomalySystemState');
        }
    },
    
    // Restore a clock anomaly from saved state
    restoreClockAnomaly: function(savedAnomaly) {

        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'clock',
            spawnTime: savedAnomaly.spawnTime
        });
        
        // Set active state
        this.activeAnomalies.clockAnomaly = true;
        
        // Start the clock anomaly effect
        this.startClockAnomaly();
    },
    
    // Restore a backward clock anomaly from saved state
    restoreBackwardClockAnomaly: function(savedAnomaly) {

        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'backwardClock',
            spawnTime: savedAnomaly.spawnTime
        });
        
        // Set active state
        this.activeAnomalies.backwardClockAnomaly = true;
        
        // Start the backward clock anomaly effect
        this.startBackwardClockAnomaly();
    },
    
    // Restore a box order anomaly from saved state
    restoreBoxOrderAnomaly: function(savedAnomaly) {

        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'boxOrder',
            spawnTime: savedAnomaly.spawnTime
        });
        
        // Set active state
        this.activeAnomalies.boxOrderAnomaly = true;
        
        // Start the box order anomaly effect
        this.startBoxOrderAnomaly();
    },
    
    // Restore a soap generator anomaly from saved state
    restoreSoapGeneratorAnomaly: function(savedAnomaly) {

        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'soapGenerator',
            spawnTime: savedAnomaly.spawnTime
        });
        
        // Set active state
        this.activeAnomalies.soapGeneratorAnomaly = true;
        
        // Start the soap generator anomaly effect
        this.startSoapGeneratorAnomaly();
    },
    
    // Restore a general anomaly from saved state
    restoreGeneralAnomaly: function(savedAnomaly) {
        // Add to anomalies array (no DOM element on restore)
        this.anomalies.push({
            id: savedAnomaly.id,
            type: savedAnomaly.type,
            spawnTime: savedAnomaly.spawnTime,
            element: null // Will be recreated if needed
        });

    },
    
    // Clear anomaly state from localStorage
    clearAnomalyState: function() {
        try {
            localStorage.removeItem('anomalySystemState');

        } catch (error) {

        }
    },

    // Shop Price Anomaly Functions
    spawnShopPriceAnomaly: function() {

        if (this.activeAnomalies.shopPriceAnomaly) {

            return; // Already active
        }
        
        // If crab anomaly is active, fix it first to prevent coexistence
        if (this.activeAnomalies.crabBucksAnomaly) {
            this.fixCrabBucksAnomaly();
        }

        this.activeAnomalies.shopPriceAnomaly = true;
        
        // Select one random item from the first 6 slots to affect
        const firstSixItems = ['berries', 'mushroom', 'petals', 'water', 'stardust', 'sparks'];
        this.anomalyAffectedItem = firstSixItems[Math.floor(Math.random() * firstSixItems.length)];

        this.anomalies.push({
            id: this.nextId++,
            type: 'shopPrice',
            spawnTime: Date.now(),
            affectedItem: this.anomalyAffectedItem
        });
        
        // Apply the price anomaly effect
        this.startShopPriceAnomaly();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },

    // Start shop price anomaly effect
    startShopPriceAnomaly: function() {

        // Check if boutique system is ready
        if (!window.boutique) {

            setTimeout(() => {
                this.startShopPriceAnomaly();
            }, 500);
            return;
        }
        
        // Check if we have a valid affected item
        if (!this.anomalyAffectedItem) {

            return;
        }
        
        // Store original price calculation function (only once)
        if (!window.boutique.originalGetCurrentPrice) {

            window.boutique.originalGetCurrentPrice = window.boutique.getCurrentPrice;
        }
        
        // Always override the function (even if it was overridden before)

        window.boutique.getCurrentPrice = function(itemId) {
            // Check if shop price anomaly is active and this is the affected item
            if (window.anomalySystem && 
                window.anomalySystem.activeAnomalies.shopPriceAnomaly && 
                itemId === window.anomalySystem.anomalyAffectedItem) {

                return 727; // Only the selected item costs 727 swa bucks
            }
            // Otherwise use original function
            return window.boutique.originalGetCurrentPrice(itemId);
        };
        
        // Refresh the boutique UI if it's currently open
        this.refreshBoutiqueUI();

    },

    // Refresh boutique UI to show new prices
    refreshBoutiqueUI: function() {
        if (window.boutique && typeof window.boutique.renderBoutiqueUI === 'function') {
            // Check if boutique is currently open
            const boutiqueTab = document.getElementById('boutiqueSubTab');
            if (boutiqueTab && boutiqueTab.style.display === 'block') {
                setTimeout(() => {
                    window.boutique.renderBoutiqueUI();
                }, 100);
            }
        }
    },

    // Setup shop price anomaly detection
    setupShopPriceDetection: function() {
        // Add click handler to boutique elements for detection
        document.addEventListener('click', (event) => {
            if (!this.findModeActive || this.analyzing) return;
            
            // Check if clicked on boutique-related elements
            const target = event.target;
            const boutiqueContainer = document.getElementById('boutiqueSubTab');
            
            if (boutiqueContainer && boutiqueContainer.contains(target)) {
                // Check specifically for shop items
                const shopItem = target.closest('.boutique-item');
                
                if (shopItem && this.activeAnomalies.shopPriceAnomaly) {
                    // Find the button with onclick attribute to get the item ID
                    const buyButton = shopItem.querySelector('button[onclick*="purchaseItem"]');
                    
                    if (buyButton) {
                        // Extract item ID from onclick attribute
                        const onclickAttr = buyButton.getAttribute('onclick');
                        const itemIdMatch = onclickAttr.match(/purchaseItem\(['"]([^'"]+)['"]\)/);
                        
                        if (itemIdMatch) {
                            const clickedItemId = itemIdMatch[1];


                            // Only trigger analysis if clicked on the affected item
                            if (clickedItemId === this.anomalyAffectedItem) {

                                event.preventDefault();
                                event.stopPropagation();
                                this.analyzeShopPriceAnomaly(true);
                            } else {

                                // Optionally show a "No anomaly detected" message for wrong items
                                this.analyzeShopPriceAnomaly(false);
                            }
                        }
                    }
                }
            }
        }, true);
    },

    // Analyze shop price anomaly
    analyzeShopPriceAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return;
        
        this.analyzing = true;

        // Add cursor animation and analyzing class
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if (this.activeAnomalies.shopPriceAnomaly && isTargetedClick) {
                // Shop price anomaly detected and clicked directly - fix it
                this.fixShopPriceAnomaly();
            } else {
                // Either no anomaly OR anomaly detected but not clicked directly
                this.showNoAnomaly();
            }
        }, 3000);
    },

    // Fix shop price anomaly
    fixShopPriceAnomaly: function() {

        this.activeAnomalies.shopPriceAnomaly = false;
        
        // Restore original price calculation function
        if (window.boutique && window.boutique.originalGetCurrentPrice) {
            window.boutique.getCurrentPrice = window.boutique.originalGetCurrentPrice;
            delete window.boutique.originalGetCurrentPrice;
            
            // Refresh the boutique UI to show normal prices
            this.refreshBoutiqueUI();
        }
        
        // Clear the affected item
        this.anomalyAffectedItem = null;
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'shopPrice');
        
        // Save state to persist across refreshes
        this.saveAnomalyState();
        
        // Give reward
        this.giveAnomalyReward();

    },

    // Restore shop price anomaly from saved state
    restoreShopPriceAnomaly: function(savedAnomaly) {

        // If crab anomaly is active, fix it first to prevent coexistence
        if (this.activeAnomalies.crabBucksAnomaly) {
            this.fixCrabBucksAnomaly();
        }

        // Restore the affected item from saved data
        this.anomalyAffectedItem = savedAnomaly.affectedItem;

        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'shopPrice',
            spawnTime: savedAnomaly.spawnTime,
            affectedItem: savedAnomaly.affectedItem
        });
        
        // Set active state
        this.activeAnomalies.shopPriceAnomaly = true;

        // Start the shop price anomaly effect
        this.startShopPriceAnomaly();
    },

    // DANGEROUS ANOMALY: Dark Void Fog
    // Variables for dark void anomaly
    darkVoidProgressTimer: null,
    darkVoidStartTime: null,
    darkVoidDuration: 10000, // 10 seconds to fix it
    darkVoidProgress: 0, // 0-100% how much screen is consumed
    darkVoidPaused: false, // Whether the anomaly is paused (when not in cargo tab)
    
    // Spawn dark void anomaly
    spawnDarkVoidAnomaly: function() {

        if (this.activeAnomalies.darkVoidAnomaly) return; // Already active
        
        this.activeAnomalies.darkVoidAnomaly = true;
        
        // Add to anomalies array
        this.anomalies.push({
            id: this.nextId++,
            type: 'darkVoid',
            spawnTime: Date.now(),
            isDangerous: true
        });
        
        // Start the dark void effect
        this.startDarkVoidAnomaly();
        
        // Save state
        this.saveAnomalyState();

    },

    // Start dark void anomaly effect
    startDarkVoidAnomaly: function() {

        // Initialize timing and state
        this.darkVoidProgress = 0;
        this.darkVoidPaused = true; // Always start paused until player clicks cargo tab
        
        // Always setup cargo tab monitoring to wait for player to click cargo tab

        this.setupCargoTabMonitoring();
        
        // Setup detection for cargo tab clicks
        this.setupDarkVoidDetection();
    },

    // Create the dark void overlay element
    createDarkVoidOverlay: function() {
        // Remove existing overlay if present
        const existing = document.getElementById('darkVoidOverlay');
        if (existing) existing.remove();
        
        // Create new overlay
        const overlay = document.createElement('div');
        overlay.id = 'darkVoidOverlay';
        overlay.style.position = 'fixed';
        overlay.style.bottom = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '0%';
        overlay.style.background = 'radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.95) 0%, rgba(20, 0, 20, 0.9) 30%, rgba(40, 0, 40, 0.7) 60%, transparent 100%)';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        overlay.style.transition = 'height 0.5s ease-out';
        overlay.style.backdropFilter = 'blur(3px)';
        overlay.style.boxShadow = '0 -10px 30px rgba(128, 0, 128, 0.5)';
        
        // Create dark cloud layer at the top edge
        const cloudLayer = document.createElement('div');
        cloudLayer.id = 'darkVoidClouds';
        cloudLayer.style.position = 'absolute';
        cloudLayer.style.top = '-15px'; // Extend above the overlay
        cloudLayer.style.left = '0';
        cloudLayer.style.width = '100%';
        cloudLayer.style.height = '40px';
        cloudLayer.style.overflow = 'visible';
        cloudLayer.style.pointerEvents = 'none';
        cloudLayer.style.zIndex = '1';
        
        // Create optimized dark clouds with performance considerations
        for (let i = 0; i < 45; i++) { // Reduced from 60 to 45 groups
            const cloudGroup = document.createElement('div');
            cloudGroup.style.position = 'absolute';
            cloudGroup.style.left = (i * 2.4 + Math.random() * 2) + '%'; // Slightly wider spacing
            cloudGroup.style.top = (1 + Math.random() * 14) + 'px';
            cloudGroup.style.animation = `darkVoidCloudFloat ${4 + Math.random() * 3}s infinite ease-in-out`; // Slower animations for performance
            cloudGroup.style.animationDelay = Math.random() * 4 + 's';
            cloudGroup.style.willChange = 'transform'; // GPU acceleration hint
            
            // Reduced cloud parts per group for better performance
            for (let j = 0; j < 6; j++) { // Reduced from 9 to 6 parts
                const cloudPart = document.createElement('div');
                cloudPart.className = 'darkVoidCloud'; // Add class for easier identification
                cloudPart.style.position = 'absolute';
                cloudPart.style.width = (15 + Math.random() * 20) + 'px'; // Slightly larger to compensate
                cloudPart.style.height = (10 + Math.random() * 16) + 'px';
                cloudPart.style.background = 'radial-gradient(ellipse, rgba(0, 0, 0, 0.9) 0%, rgba(20, 0, 20, 0.8) 40%, rgba(40, 0, 40, 0.6) 70%, transparent 100%)';
                cloudPart.style.borderRadius = '50%';
                cloudPart.style.left = (j * 8 - 4 + Math.random() * 8) + 'px'; // Wider spacing
                cloudPart.style.top = (Math.random() * 5 - 2) + 'px';
                cloudPart.style.filter = 'blur(2.5px)'; // Slightly more blur to hide reduced density
                cloudPart.style.animation = `darkVoidCloudWisp ${3 + Math.random() * 2}s infinite ease-in-out`; // Slower wisp animations
                cloudPart.style.animationDelay = (j * 0.3 + Math.random()) + 's';
                cloudPart.style.willChange = 'transform'; // GPU acceleration
                cloudGroup.appendChild(cloudPart);
            }
            
            cloudLayer.appendChild(cloudGroup);
        }
        
        // Optimized left edge clouds with fewer elements but larger sizes
        for (let i = 0; i < 15; i++) { // Reduced from 25 to 15 groups
            const leftEdgeCloudGroup = document.createElement('div');
            leftEdgeCloudGroup.style.position = 'absolute';
            leftEdgeCloudGroup.style.left = (Math.random() * 18) + '%'; // Slightly wider left edge coverage
            leftEdgeCloudGroup.style.top = (-3 + Math.random() * 20) + 'px';
            leftEdgeCloudGroup.style.animation = `darkVoidCloudFloat ${3 + Math.random() * 3}s infinite ease-in-out`; // Slower animations
            leftEdgeCloudGroup.style.animationDelay = Math.random() * 3 + 's';
            leftEdgeCloudGroup.style.willChange = 'transform';
            
            // Fewer but larger cloud parts for left edge
            for (let j = 0; j < 5; j++) { // Reduced from 7 to 5 parts
                const leftCloudPart = document.createElement('div');
                leftCloudPart.className = 'darkVoidCloud'; // Add class for easier identification
                leftCloudPart.style.position = 'absolute';
                leftCloudPart.style.width = (18 + Math.random() * 24) + 'px'; // Larger to maintain visual density
                leftCloudPart.style.height = (12 + Math.random() * 18) + 'px';
                leftCloudPart.style.background = 'radial-gradient(ellipse, rgba(0, 0, 0, 0.95) 0%, rgba(25, 0, 25, 0.85) 35%, rgba(45, 0, 45, 0.7) 65%, transparent 100%)';
                leftCloudPart.style.borderRadius = '50%';
                leftCloudPart.style.left = (j * 7 - 3 + Math.random() * 6) + 'px'; // Wider spacing
                leftCloudPart.style.top = (Math.random() * 6 - 3) + 'px';
                leftCloudPart.style.filter = 'blur(2px)';
                leftCloudPart.style.animation = `darkVoidCloudWisp ${2.5 + Math.random() * 2}s infinite ease-in-out`; // Slower animations
                leftCloudPart.style.animationDelay = (j * 0.25 + Math.random() * 0.8) + 's';
                leftCloudPart.style.willChange = 'transform';
                leftEdgeCloudGroup.appendChild(leftCloudPart);
            }
            
            cloudLayer.appendChild(leftEdgeCloudGroup);
        }
        
        overlay.appendChild(cloudLayer);
        
        // Optimized particle effects with reduced count and simpler animations
        for (let i = 0; i < 12; i++) { // Reduced from 20 to 12 particles
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px'; // Slightly larger to compensate for fewer particles
            particle.style.height = '4px';
            particle.style.background = '#8800ff';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = Math.random() * 50 + '%';
            particle.style.animation = `darkVoidParticle ${3 + Math.random() * 2}s infinite ease-in-out`; // Slower animations
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.willChange = 'transform'; // GPU acceleration
            overlay.appendChild(particle);
        }
        
        document.body.appendChild(overlay);
        
        // If find mode is active, setup hover listeners
        if (this.findModeActive) {
            overlay.addEventListener('mouseenter', this.anomalyMouseEnter);
            overlay.addEventListener('mouseleave', this.anomalyMouseLeave);
            
            // Also add to all dark void clouds
            const darkClouds = overlay.querySelectorAll('.darkVoidCloud');
            darkClouds.forEach(cloud => {
                cloud.addEventListener('mouseenter', this.anomalyMouseEnter);
                cloud.addEventListener('mouseleave', this.anomalyMouseLeave);
            });
            
            // Enable pointer events for hovering
            this.updateDangerousAnomalyPointerEvents(true);
        }
        
        // Force reflow and start with small height
        setTimeout(() => {
            overlay.style.height = '10%';
        }, 100);
    },

    // Setup monitoring for when player clicks cargo tab button (to start dark void)
    setupCargoTabMonitoring: function() {
        // Remove existing monitor if present
        if (this.cargoTabMonitor) {
            document.removeEventListener('click', this.cargoTabMonitor);
        }
        
        this.cargoTabMonitor = (event) => {
            if (!this.activeAnomalies.darkVoidAnomaly || !this.darkVoidPaused) return;
            
            // Look for cargo tab button clicks with multiple selectors
            const cargoTabButton1 = document.querySelector('[onclick*="switchHomeSubTab(\'cargo\')"]');
            const cargoTabButton2 = document.querySelector('[onclick*="switchHomeSubTab(\\"cargo\\")"]');






            // More comprehensive check for cargo tab button click
            let isCargoTabButtonClick = false;
            
            // Check direct element match
            if (event.target === cargoTabButton1 || event.target === cargoTabButton2) {
                isCargoTabButtonClick = true;

            }
            
            // Check onclick attribute contains cargo switch
            if (event.target.onclick && event.target.onclick.toString().includes("switchHomeSubTab") && 
                (event.target.onclick.toString().includes("cargo") || event.target.onclick.toString().includes("Cargo"))) {
                isCargoTabButtonClick = true;

            }
            
            // Check if element contains "Cargo" text and is a button/clickable
            if ((event.target.textContent && event.target.textContent.includes('Cargo')) &&
                (event.target.tagName === 'BUTTON' || event.target.onclick || event.target.style.cursor === 'pointer')) {
                isCargoTabButtonClick = true;

            }
            
            // Check closest parent for cargo tab functionality
            const closestCargoElement = event.target.closest && event.target.closest('[onclick*="cargo"]');
            if (closestCargoElement) {
                isCargoTabButtonClick = true;

            }

            if (isCargoTabButtonClick) {

                // Small delay to ensure tab switch has completed
                setTimeout(() => {
                    if (this.darkVoidPaused && this.activeAnomalies.darkVoidAnomaly) {

                        this.darkVoidPaused = false;
                        // Set start time to now since we're starting fresh
                        this.darkVoidStartTime = Date.now();
                        // Create the overlay now that player clicked cargo tab
                        this.createDarkVoidOverlay();

                        this.startDarkVoidProgression();

                        // Remove this monitor since we're no longer paused
                        document.removeEventListener('click', this.cargoTabMonitor);
                        this.cargoTabMonitor = null;

                    } else {

                    }
                }, 100); // Small delay to ensure tab switch has completed
            }
        };
        
        document.addEventListener('click', this.cargoTabMonitor);

        // Remove the fallback timer since we want it to only start on cargo tab click
    },

    // Start the dark void progression (gradually consuming screen)
    startDarkVoidProgression: function() {

        // Clear any existing timer
        if (this.darkVoidProgressTimer) {
            clearInterval(this.darkVoidProgressTimer);
        }
        
        this.darkVoidProgressTimer = setInterval(() => {
            // Don't progress if paused or if analyzing
            if (this.darkVoidPaused || this.analyzing) {
                return;
            }
            
            const elapsed = Date.now() - this.darkVoidStartTime;
            const progress = (elapsed / this.darkVoidDuration) * 100;
            
            this.darkVoidProgress = Math.min(progress, 100);
            
            // Update overlay height
            const overlay = document.getElementById('darkVoidOverlay');
            if (overlay) {
                overlay.style.height = this.darkVoidProgress + '%';
                
                // Add intensity effects as it progresses
                if (this.darkVoidProgress > 50) {
                    overlay.style.background = 'radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.98) 0%, rgba(30, 0, 30, 0.95) 30%, rgba(60, 0, 60, 0.8) 60%, transparent 100%)';
                }
                if (this.darkVoidProgress > 75) {
                    overlay.style.backdropFilter = 'blur(5px)';
                    overlay.style.boxShadow = '0 -20px 50px rgba(128, 0, 128, 0.8)';
                }
            } else {

            }
            
            // Check if time is up
            if (this.darkVoidProgress >= 100) {
                this.triggerDarkVoidConsequences();
            }
        }, 100); // Update every 100ms for smoother progression (10 seconds total)

    },

    // Setup detection for clicking anywhere to fix the anomaly when find mode is active
    setupDarkVoidDetection: function() {
        // Create click handler for detecting dark void anomaly anywhere on screen
        this.darkVoidClickHandler = (event) => {
            if (this.findModeActive && !this.analyzing && this.activeAnomalies.darkVoidAnomaly) {
                // Check if cargo tab is currently visible (player must be in cargo tab to fix it)
                // Try multiple possible cargo tab IDs/classes
                const cargoTab1 = document.getElementById('cargoMainTab');
                const cargoTab2 = document.getElementById('cargoSubTab');
                const cargoTab3 = document.querySelector('.cargo-tab');
                const cargoTab4 = document.querySelector('[data-tab="cargo"]');
                
                // Check if any cargo tab is visible
                const isCargoTabVisible = (cargoTab1 && cargoTab1.style.display !== 'none' && cargoTab1.offsetParent !== null) ||
                                         (cargoTab2 && cargoTab2.style.display !== 'none' && cargoTab2.offsetParent !== null) ||
                                         (cargoTab3 && cargoTab3.style.display !== 'none' && cargoTab3.offsetParent !== null) ||
                                         (cargoTab4 && cargoTab4.style.display !== 'none' && cargoTab4.offsetParent !== null) ||
                                         // Also check if current URL or page state indicates cargo tab
                                         (window.location.hash && window.location.hash.includes('cargo')) ||
                                         // Check if any element with "Cargo" text is currently visible
                                         Array.from(document.querySelectorAll('*')).some(el => 
                                             el.textContent && el.textContent.includes('Cargo') && 
                                             el.offsetParent !== null && 
                                             getComputedStyle(el).display !== 'none'
                                         );

                if (isCargoTabVisible) {

                    event.preventDefault();
                    event.stopPropagation();
                    this.analyzeDarkVoidAnomaly(true);
                } else {

                    // No popup needed - player will see the dark void overlay as indication
                }
            }
        };
        
        // Add event listener with capture to ensure we get the click
        document.addEventListener('click', this.darkVoidClickHandler, true);
    },

    // Show dangerous anomaly warning
    showDangerousAnomalyWarning: function() {
        // Create warning popup
        const warning = document.createElement('div');
        warning.id = 'dangerousAnomalyWarning';
        warning.innerHTML = `
            <div style="background: linear-gradient(45deg, #ff0000, #8800ff); color: white; padding: 20px; 
                        border-radius: 10px; text-align: center; font-weight: bold; font-size: 18px;
                        box-shadow: 0 0 30px rgba(255, 0, 0, 0.8); border: 3px solid #fff;
                        animation: dangerousAnomalyPulse 0.5s infinite alternate;">
                ⚠️ DANGEROUS ANOMALY DETECTED ⚠️<br>
                <span style="font-size: 14px;">Dark void fog is consuming the cargo area!<br>
                Use anomaly detector and click in cargo tab to fix!<br>
                <span style="color: #ffff00;">You have 10 seconds or lose 25% of inventory tokens!</span></span>
            </div>
        `;
        warning.style.position = 'fixed';
        warning.style.top = '50%';
        warning.style.left = '50%';
        warning.style.transform = 'translate(-50%, -50%)';
        warning.style.zIndex = '10000';
        warning.style.pointerEvents = 'none';
        
        document.body.appendChild(warning);
        
        // Remove warning after 5 seconds
        setTimeout(() => {
            if (warning && warning.parentNode) {
                warning.remove();
            }
        }, 5000);
    },

    // Analyze dark void anomaly
    analyzeDarkVoidAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return; // Prevent multiple analyses
        
        this.analyzing = true;

        // Add cursor animation and analyzing class
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            document.body.classList.remove('anomaly-analyzing');
            this.stopCursorAnimation();
            
            if (this.activeAnomalies.darkVoidAnomaly) {
                // Direct fix without popup notification for dark void anomaly
                this.fixDarkVoidAnomaly();
            } else {
                this.showNoAnomaly();
            }
        }, 3000);
    },

    // Fix dark void anomaly
    fixDarkVoidAnomaly: function() {

        this.activeAnomalies.darkVoidAnomaly = false;
        this.darkVoidPaused = false;
        
        // Stop progression timer
        if (this.darkVoidProgressTimer) {
            clearInterval(this.darkVoidProgressTimer);
            this.darkVoidProgressTimer = null;
        }
        
        // Remove click handler
        if (this.darkVoidClickHandler) {
            document.removeEventListener('click', this.darkVoidClickHandler, true);
            this.darkVoidClickHandler = null;
        }
        
        // Remove cargo tab monitor if it exists
        if (this.cargoTabMonitor) {
            document.removeEventListener('click', this.cargoTabMonitor);
            this.cargoTabMonitor = null;
        }
        
        // Animate overlay disappearing
        const overlay = document.getElementById('darkVoidOverlay');
        if (overlay) {
            overlay.style.transition = 'height 1s ease-in, opacity 1s ease-in';
            overlay.style.height = '0%';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 1000);
        }
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'darkVoid');
        
        // Save state
        this.saveAnomalyState();
        
        // Give reward (shows the standard black "Anomaly Fixed!" popup)
        this.giveAnomalyReward();

    },

    // Trigger consequences when dark void isn't fixed in time
    triggerDarkVoidConsequences: function() {

        // Stop the progression timer
        if (this.darkVoidProgressTimer) {
            clearInterval(this.darkVoidProgressTimer);
            this.darkVoidProgressTimer = null;
        }
        
        // Apply the 25% inventory token loss
        this.applyInventoryTokenLoss();
        
        // Clear the anomaly state
        this.activeAnomalies.darkVoidAnomaly = false;
        this.darkVoidPaused = false;
        this.anomalies = this.anomalies.filter(a => a.type !== 'darkVoid');
        
        // Remove click handler
        if (this.darkVoidClickHandler) {
            document.removeEventListener('click', this.darkVoidClickHandler, true);
            this.darkVoidClickHandler = null;
        }
        
        // Remove cargo tab monitor if it exists
        if (this.cargoTabMonitor) {
            document.removeEventListener('click', this.cargoTabMonitor);
            this.cargoTabMonitor = null;
        }
        
        // Keep overlay for dramatic effect, then fade it
        const overlay = document.getElementById('darkVoidOverlay');
        if (overlay) {
            // Flash red to indicate failure
            overlay.style.background = 'radial-gradient(ellipse at center, rgba(255, 0, 0, 0.8) 0%, rgba(100, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.95) 100%)';
            
            setTimeout(() => {
                overlay.style.transition = 'opacity 2s ease-out';
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 2000);
            }, 2000);
        }
        
        // Show failure message
        this.showDarkVoidFailureMessage();
        
        // Save state
        this.saveAnomalyState();

    },

    // Apply 25% inventory token loss
    applyInventoryTokenLoss: function() {

        let tokensLost = 0;
        let tokensLostList = [];
        
        // Apply loss to kitchenIngredients (raw tokens)
        if (window.kitchenIngredients) {
            const tokenTypes = ['berries', 'mushroom', 'sparks', 'petals', 'water', 'prisma', 'stardust'];
            
            tokenTypes.forEach(tokenType => {
                if (window.kitchenIngredients[tokenType] && DecimalUtils.isDecimal(window.kitchenIngredients[tokenType])) {
                    const currentAmount = window.kitchenIngredients[tokenType];
                    const lossAmount = currentAmount.mul(0.25).floor(); // 25% loss, rounded down
                    
                    if (lossAmount.gt(0)) {
                        window.kitchenIngredients[tokenType] = currentAmount.sub(lossAmount);
                        tokensLost += lossAmount.toNumber();
                        tokensLostList.push(`${lossAmount.toString()} ${tokenType}`);

                    }
                }
            });
        }
        
        // Apply loss to processed items in window.state
        if (window.state) {
            const processedTokenTypes = ['glitteringPetals', 'chargedPrisma', 'batteries', 'mushroomSoup', 'berryPlate'];
            
            processedTokenTypes.forEach(tokenType => {
                if (window.state[tokenType]) {
                    let currentAmount;
                    if (DecimalUtils.isDecimal(window.state[tokenType])) {
                        currentAmount = window.state[tokenType];
                    } else if (typeof window.state[tokenType] === 'number') {
                        currentAmount = new Decimal(window.state[tokenType]);
                    } else {
                        return; // Skip if not a valid number
                    }
                    
                    const lossAmount = currentAmount.mul(0.25).floor(); // 25% loss, rounded down
                    
                    if (lossAmount.gt(0)) {
                        const newAmount = currentAmount.sub(lossAmount);
                        if (typeof window.state[tokenType] === 'number') {
                            window.state[tokenType] = newAmount.toNumber();
                        } else {
                            window.state[tokenType] = newAmount;
                        }
                        tokensLost += lossAmount.toNumber();
                        tokensLostList.push(`${lossAmount.toString()} ${tokenType}`);

                    }
                }
            });
        }
        
        // Update UI
        if (typeof updateKitchenUI === 'function') updateKitchenUI();
        if (typeof window.updateInventoryModal === 'function') window.updateInventoryModal(true); // Force update after anomaly token loss
        if (typeof window.updateCafeteriaUI === 'function') window.updateCafeteriaUI();
        
        // Save game
        if (typeof saveGame === 'function') saveGame();

        return { totalLost: tokensLost, itemsLost: tokensLostList };
    },

    // Show failure message when dark void isn't fixed in time
    showDarkVoidFailureMessage: function() {
        // Instead of showing a popup, make Swaria character say the speech
        this.showSwariaDarkVoidFailureSpeech();
    },

    // Show Swaria speech for dark void failure using existing speech system
    showSwariaDarkVoidFailureSpeech: function() {
        const swariaImage = document.getElementById("swariaCharacter");
        const swariaSpeech = document.getElementById("swariaSpeech");

        if (!swariaSpeech || !swariaImage) {

            this.createCustomSwariaSpeech();
            return;
        }

        // Use the existing speech system pattern
        swariaSpeech.textContent = "What just happened? OMG I lost 25% of my tokens!!!";
        swariaSpeech.style.display = "block";
        
        // Set Swaria to talking image using the existing function if available
        if (typeof window.getMainCargoCharacterImage === 'function') {
            swariaImage.src = window.getMainCargoCharacterImage(true);
        } else {
            // Fallback to manual image switching
            const originalSrc = swariaImage.src;
            if (originalSrc.includes("normal")) {
                swariaImage.src = originalSrc.replace("normal", "talking");
            } else if (originalSrc.includes(".png")) {
                swariaImage.src = originalSrc.replace(".png", " talking.png");
            } else {
                swariaImage.src = "swa talking.png";
            }
        }
        
        // Hide speech and reset image after 6 seconds
        setTimeout(() => {
            swariaSpeech.style.display = "none";
            
            // Reset to normal image using the existing function if available
            if (typeof window.getMainCargoCharacterImage === 'function') {
                swariaImage.src = window.getMainCargoCharacterImage(false);
            } else {
                // Fallback to manual image switching
                const currentSrc = swariaImage.src;
                if (currentSrc.includes("talking")) {
                    swariaImage.src = currentSrc.replace("talking", "normal").replace(" talking", "");
                }
            }
        }, 6000);

    },

    // Create custom Swaria speech if normal elements aren't found
    createCustomSwariaSpeech: function() {
        // Create a custom speech bubble that appears over the game
        const speechBubble = document.createElement('div');
        speechBubble.id = 'customSwariaSpeech';
        speechBubble.innerHTML = `
            <div style="background: linear-gradient(45deg, #4CAF50, #81C784); color: white; padding: 20px; 
                        border-radius: 20px; text-align: center; font-weight: bold; font-size: 16px;
                        box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); border: 3px solid #fff;
                        max-width: 350px; position: relative;">
                <div style="position: absolute; bottom: -10px; left: 30px; width: 0; height: 0; 
                           border-left: 15px solid transparent; border-right: 15px solid transparent; 
                           border-top: 15px solid #4CAF50;"></div>
                <img src="swa talking.png" style="width: 40px; height: 40px; border-radius: 50%; margin-bottom: 10px;" 
                     onerror="this.style.display='none';">
                <div style="font-size: 18px; margin-bottom: 5px;">Swaria says:</div>
                <div style="font-style: italic;">"What just happened? OMG I lost 25% of my tokens!!!"</div>
            </div>
        `;
        speechBubble.style.position = 'fixed';
        speechBubble.style.top = '20%';
        speechBubble.style.left = '50%';
        speechBubble.style.transform = 'translate(-50%, -50%)';
        speechBubble.style.zIndex = '10002';
        speechBubble.style.pointerEvents = 'none';
        speechBubble.style.animation = 'bounceIn 0.5s ease-out';
        
        document.body.appendChild(speechBubble);
        
        // Remove after 6 seconds with fade out
        setTimeout(() => {
            speechBubble.style.transition = 'opacity 0.5s ease-out';
            speechBubble.style.opacity = '0';
            setTimeout(() => {
                if (speechBubble && speechBubble.parentNode) {
                    speechBubble.remove();
                }
            }, 500);
        }, 6000);

    },

    // Restore dark void anomaly from saved state
    restoreDarkVoidAnomaly: function(savedAnomaly) {

        // Calculate how much time has passed
        const elapsed = Date.now() - savedAnomaly.spawnTime;
        
        // If more than 10 seconds have passed, trigger consequences immediately
        if (elapsed >= this.darkVoidDuration) {

            this.triggerDarkVoidConsequences();
            return;
        }
        
        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'darkVoid',
            spawnTime: savedAnomaly.spawnTime,
            isDangerous: true
        });
        
        // Set active state
        this.activeAnomalies.darkVoidAnomaly = true;
        
        // Restore the anomaly with remaining time
        this.darkVoidStartTime = savedAnomaly.spawnTime;
        const remainingTime = this.darkVoidDuration - elapsed;

        // Start the effect with current progress (will check if in cargo tab and pause if needed)
        this.startDarkVoidAnomaly();
    },

    // PRISM MIRROR ANOMALY: Light rays go in opposite direction
    // Spawn prism mirror anomaly
    spawnPrismMirrorAnomaly: function() {

        if (this.activeAnomalies.prismMirrorAnomaly) return; // Already active
        
        this.activeAnomalies.prismMirrorAnomaly = true;
        
        // Add to anomalies array
        this.anomalies.push({
            id: this.nextId++,
            type: 'prismMirror',
            spawnTime: Date.now()
        });
        
        // Start the prism mirror effect
        this.startPrismMirrorAnomaly();
        
        // Save state
        this.saveAnomalyState();

    },

    // Start prism mirror anomaly effect
    startPrismMirrorAnomaly: function() {

        // Apply visual changes to existing prism rays
        this.mirrorExistingPrismRays();
        
        // Setup detection for prism tab clicks
        this.setupPrismMirrorDetection();

    },

    // Mirror existing prism light rays
    mirrorExistingPrismRays: function() {
        // Find the light grid specifically
        const lightGrid = document.getElementById('lightGrid');
        
        if (lightGrid) {
            // Target any existing light beam elements within the light grid
            const lightElements = lightGrid.querySelectorAll('.light-beam, .light-ray, .beam, [class*="light-"], [class*="beam-"], [class*="ray-"]');
            
            lightElements.forEach(element => {
                // Store original transform if not already stored
                if (!element.dataset.originalTransform) {
                    const computedStyle = window.getComputedStyle(element);
                    element.dataset.originalTransform = computedStyle.transform || 'none';
                }
                
                // Apply mirroring transformation
                const currentTransform = element.dataset.originalTransform;
                if (currentTransform === 'none') {
                    element.style.transform = 'scaleX(-1)';
                } else {
                    element.style.transform = currentTransform + ' scaleX(-1)';
                }
                
                // Add anomaly indicator class
                element.classList.add('prism-mirror-anomaly-affected');
            });
        }
        
        // Create CSS overrides for the pseudo-element light beams
        this.createMirroredRayStyles();
    },

    // Create CSS styles for mirrored light rays
    createMirroredRayStyles: function() {
        const existingStyle = document.getElementById('prismMirrorAnomalyStyles');
        if (existingStyle) return; // Already created
        
        const style = document.createElement('style');
        style.id = 'prismMirrorAnomalyStyles';
        style.textContent = `
            /* Mirror the actual light beam pseudo-elements in prism tiles */
            .red-tile::after,
            .orange-tile::after,
            .white-tile::after,
            .active-tile::after {
                transform: rotate(45deg) scaleX(-1) !important;
                transform-origin: left center !important;
            }
            
            /* Also mirror the background light beams */
            .red-tile::before,
            .orange-tile::before,
            .white-tile::before,
            .active-tile::before {
                transform: rotate(10deg) scaleX(-1) !important;
                transform-origin: left center !important;
            }
            
            /* Target any light tiles with light beam effects */
            .light-tile.active-tile::after {
                transform: rotate(45deg) scaleX(-1) !important;
                transform-origin: left center !important;
            }
            
            .light-tile.active-tile::before {
                transform: rotate(10deg) scaleX(-1) !important;
                transform-origin: left center !important;
            }
            
            /* Mirror any dynamically created light ray elements */
            .light-tile .light-beam,
            .light-tile .light-ray,
            #lightGrid .light-beam,
            #lightGrid .light-ray {
                transform: scaleX(-1) !important;
            }
        `;
        document.head.appendChild(style);
    },

    // Setup detection for prism mirror anomaly
    setupPrismMirrorDetection: function() {
        // Add click handler specifically for the prism card/grid area
        document.addEventListener('click', (event) => {
            if (!this.findModeActive || this.analyzing) return;
            
            // Check if clicked directly on the prism card elements
            const target = event.target;
            const lightGrid = document.getElementById('lightGrid');
            
            // Must click directly on the light grid or a light tile
            const isInLightGrid = lightGrid && lightGrid.contains(target);
            const isLightTile = target.classList && target.classList.contains('light-tile');
            const isLightGridItself = target === lightGrid;
            
            // Only trigger if clicking directly on the prism card area (light grid or tiles)
            if (isInLightGrid || isLightTile || isLightGridItself) {
                event.preventDefault();
                event.stopPropagation();
                this.analyzePrismMirrorAnomaly(true);
            }
        }, true);
    },

    // Analyze prism mirror anomaly
    analyzePrismMirrorAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return;
        
        this.analyzing = true;

        // Add cursor animation and analyzing class
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if (this.activeAnomalies.prismMirrorAnomaly && isTargetedClick) {
                this.fixPrismMirrorAnomaly();
            } else {
                this.showNoAnomaly();
            }
        }, 3000);
    },

    // Fix prism mirror anomaly
    fixPrismMirrorAnomaly: function() {

        this.activeAnomalies.prismMirrorAnomaly = false;
        
        // Restore original light ray directions
        const affectedRays = document.querySelectorAll('.prism-mirror-anomaly-affected');
        affectedRays.forEach(ray => {
            if (ray.dataset.originalTransform) {
                ray.style.transform = ray.dataset.originalTransform === 'none' ? '' : ray.dataset.originalTransform;
                delete ray.dataset.originalTransform;
            }
            ray.classList.remove('prism-mirror-anomaly-affected');
        });
        
        // Remove mirrored ray styles
        const anomalyStyles = document.getElementById('prismMirrorAnomalyStyles');
        if (anomalyStyles) {
            anomalyStyles.remove();
        }
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'prismMirror');
        
        // Save state
        this.saveAnomalyState();
        
        // Give reward
        this.giveAnomalyReward();

    },

    // Restore prism mirror anomaly from saved state
    restorePrismMirrorAnomaly: function(savedAnomaly) {

        // Add to anomalies array
        this.anomalies.push({
            id: savedAnomaly.id,
            type: 'prismMirror',
            spawnTime: savedAnomaly.spawnTime
        });
        
        // Set active state
        this.activeAnomalies.prismMirrorAnomaly = true;
        
        // Start the prism mirror anomaly effect
        this.startPrismMirrorAnomaly();
    },

    // CARGO OMEGA BOX ANOMALY: Adds OMEGA box type to cargo tab
    // NOTE: This anomaly has mutual exclusion with boxOrderAnomaly since both affect the boxes area
    // Spawn cargo OMEGA box anomaly
    spawnCargoOmegaBoxAnomaly: function() {

        if (this.activeAnomalies.cargoOmegaBoxAnomaly) return; // Already active
        
        // Prevent spawning if box order anomaly is active (mutual exclusion)
        if (this.activeAnomalies.boxOrderAnomaly) {

            return;
        }
        
        this.activeAnomalies.cargoOmegaBoxAnomaly = true;
        
        // Add to anomalies array
        this.anomalies.push({
            id: this.nextId++,
            type: 'cargoOmegaBox',
            spawnTime: Date.now()
        });
        
        // Start the cargo OMEGA box effect
        this.startCargoOmegaBoxAnomaly();
        
        // Save state
        this.saveAnomalyState();

    },

    // Start cargo OMEGA box anomaly effect
    startCargoOmegaBoxAnomaly: function() {

        // Add OMEGA box to cargo tab
        this.addOmegaBoxToCargo();
        
        // Setup detection for cargo tab clicks
        this.setupCargoOmegaBoxDetection();

    },

    // Add OMEGA box to cargo tab
    addOmegaBoxToCargo: function(retryCount = 0) {

        // Check if OMEGA box already exists
        if (document.getElementById('omegaBox')) {

            return;
        }
        
        // Debug: Log current DOM state
        const allCards = document.querySelectorAll('.card');

        // Find the Boxes card container
        const boxesCards = document.querySelectorAll('.card');
        let boxesContainer = null;
        
        // Find the card that contains the "Boxes" heading
        for (let card of boxesCards) {
            const heading = card.querySelector('h2');
            if (heading) {

                if (heading.textContent.trim() === 'Boxes') {
                    boxesContainer = card;
                    break;
                }
            }
        }
        
        if (!boxesContainer) {

            allCards.forEach((card, i) => {
                const heading = card.querySelector('h2');

            });
            
            if (retryCount < 4) {

                setTimeout(() => {
                    this.addOmegaBoxToCargo(retryCount + 1);
                }, 2000); // Increased delay from 1s to 2s
            } else {

            }
            return;
        }
        
        // Find mythic box button to place OMEGA box after it
        const mythicButton = boxesContainer.querySelector('button[onclick*="mythic"]');
        
        if (!mythicButton) {

        }
        
        // Create OMEGA box button element (matching the existing box structure)
        const omegaBox = document.createElement('button');
        omegaBox.className = 'omega-box-button';
        omegaBox.id = 'omegaBox';
        omegaBox.onclick = () => this.tryOpenOmegaBox();
        
        // Create CSS for OMEGA box (matching other box styles exactly)
        const style = document.createElement('style');
        style.setAttribute('data-omega-box', 'true');
        style.textContent = `
            .omega-box-button {
                /* Use exact same styling as default buttons */
                display: block !important;
                width: 100% !important;
                margin-top: 0.4rem !important;
                padding: 0.6rem !important;
                font-size: 1rem !important;
                background: var(--card-border) !important;
                color: white !important;
                border: none !important;
                border-radius: var(--radius) !important;
                cursor: pointer !important;
                transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease !important;
                box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.2)) !important;
                font-family: inherit !important;
                text-align: center !important;
                line-height: normal !important;
            }
            
            .omega-box-button:hover {
                background: var(--button-hover, #00704f) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 8px var(--shadow-color, rgba(0,0,0,0.3)) !important;
            }
            
            @keyframes hue-shift {
                0% { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1); }
                25% { filter: hue-rotate(90deg) saturate(1.5) brightness(1.2); }
                50% { filter: hue-rotate(180deg) saturate(1.8) brightness(1.3); }
                75% { filter: hue-rotate(270deg) saturate(1.5) brightness(1.2); }
                100% { filter: hue-rotate(360deg) saturate(1.2) brightness(1.1); }
            }
            
            .omega-box-icon {
                width: 36px !important;
                height: 36px !important;
                vertical-align: middle !important;
                margin-right: 6px !important;
                image-rendering: auto !important;
                animation: hue-shift 4s linear infinite !important;
            }
        `;
        document.head.appendChild(style);
        
        // Add content to OMEGA box button (matching the existing button structure exactly)
        omegaBox.innerHTML = `<img src="assets/icons/common box.png" class="icon omega-box-icon"> OMEGA (1e308)`;
        
        // Insert OMEGA box after mythic box or at end
        if (mythicButton && mythicButton.parentNode) {
            mythicButton.parentNode.insertBefore(omegaBox, mythicButton.nextSibling);
        } else {
            boxesContainer.appendChild(omegaBox);
        }

        // Set up detection immediately after creating the box
        this.setupOmegaBoxClickDetection();
    },

    // Try to open OMEGA box
    tryOpenOmegaBox: function() {
        // Check if player has enough fluff (1e308)
        const requiredFluff = new Decimal('1e308');
        const currentFluff = new Decimal(localStorage.getItem('fluffCount') || '0');
        
        if (currentFluff.gte(requiredFluff)) {
            // Deduct fluff
            const newFluff = currentFluff.minus(requiredFluff);
            localStorage.setItem('fluffCount', newFluff.toString());
            
            // Give rewards (ultra rare items)
            this.giveOmegaBoxRewards();

        } else {

            // Could show a message to player here
        }
    },

    // Give OMEGA box rewards
    giveOmegaBoxRewards: function() {

        // This would integrate with the game's reward system
        // For now, just log that rewards were given

    },

    // Setup detection for cargo OMEGA box anomaly
    setupCargoOmegaBoxDetection: function() {
        // This function is called from startCargoOmegaBoxAnomaly
        // The actual detection setup happens in setupOmegaBoxClickDetection
        // which is called after the OMEGA box is created

    },
    
    // Setup click detection specifically for the OMEGA box
    setupOmegaBoxClickDetection: function() {
        const omegaBox = document.getElementById('omegaBox');
        if (omegaBox) {

            omegaBox.addEventListener('click', (event) => {

                if (this.findModeActive && !this.analyzing && this.activeAnomalies.cargoOmegaBoxAnomaly) {
                    // Prevent the actual box purchase
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Add analyzing animation class for cursor change and start animation
                    document.body.classList.add('anomaly-analyzing');
                    this.startCursorAnimation();
                    
                    // Analyze cargo OMEGA box anomaly (targeted click)
                    this.analyzeCargoOmegaBoxAnomaly(true);
                }
            });
        } else {

        }
    },

    // Analyze cargo OMEGA box anomaly
    analyzeCargoOmegaBoxAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return;
        
        this.analyzing = true;

        // Add cursor animation and analyzing class
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if (this.activeAnomalies.cargoOmegaBoxAnomaly && isTargetedClick) {
                this.fixCargoOmegaBoxAnomaly();
            } else {
                this.showNoAnomaly();
            }
        }, 3000);
    },

    // Fix cargo OMEGA box anomaly
    fixCargoOmegaBoxAnomaly: function() {

        if (!this.activeAnomalies.cargoOmegaBoxAnomaly) {

            return;
        }
        
        // Remove OMEGA box from cargo
        const omegaBox = document.getElementById('omegaBox');
        if (omegaBox) {
            omegaBox.remove();
        }
        
        // Remove rainbow styles
        const rainbowStyles = document.querySelectorAll('style[data-omega-box]');
        rainbowStyles.forEach(style => style.remove());
        
        // Set anomaly as inactive
        this.activeAnomalies.cargoOmegaBoxAnomaly = false;
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'cargoOmegaBox');
        
        // Save state
        this.saveAnomalyState();
        
        // Give reward (shows the standard black "Anomaly Fixed!" popup)
        this.giveAnomalyReward();

    },

    // Restore cargo OMEGA box anomaly from saved state
    restoreCargoOmegaBoxAnomaly: function(savedAnomaly) {

        if (this.activeAnomalies.cargoOmegaBoxAnomaly) {

            return;
        }
        
        // Add to anomalies array
        this.anomalies.push(savedAnomaly);
        
        // Set active state
        this.activeAnomalies.cargoOmegaBoxAnomaly = true;
        
        // Start the cargo OMEGA box anomaly effect with multiple retry attempts

        this.attemptOmegaBoxRestoration(0);
    },

    // Attempt OMEGA box restoration with retry logic
    attemptOmegaBoxRestoration: function(attemptCount) {

        // Check if DOM is ready by looking for essential elements
        const boxesCards = document.querySelectorAll('.card');
        let domReady = false;
        
        for (let card of boxesCards) {
            const heading = card.querySelector('h2');
            if (heading && heading.textContent.trim() === 'Boxes') {
                domReady = true;
                break;
            }
        }
        
        if (domReady) {

            this.startCargoOmegaBoxAnomaly();
        } else {

            if (attemptCount < 9) {
                // Increase delay with each attempt: 1s, 2s, 3s, etc.
                const delay = (attemptCount + 1) * 1000;
                setTimeout(() => {
                    this.attemptOmegaBoxRestoration(attemptCount + 1);
                }, delay);
            } else {

                // As a last resort, try to add the OMEGA box anyway
                this.startCargoOmegaBoxAnomaly();
            }
        }
    },

    // Blurple Light Anomaly Functions
    spawnBlurpleLightAnomaly: function() {
        if (this.activeAnomalies.blurpleLightAnomaly) return; // Already active
        
        this.activeAnomalies.blurpleLightAnomaly = true;
        this.anomalies.push({
            id: this.nextId++,
            type: 'blurpleLight',
            spawnTime: Date.now()
        });
        
        // Apply the blurple light effect
        this.startBlurpleLightAnomaly();
        
        // Save state to persist across refreshes
        this.saveAnomalyState();

    },

    // Start blurple light anomaly effect
    startBlurpleLightAnomaly: function() {

        // Find all elements that contain "Blue Light" text and replace with "Blurple Light"
        this.replaceBluelightText();

    },

    // Replace Blue Light text with Blurple Light
    replaceBluelightText: function() {
        // Clear previous text storage if it exists (in case of multiple calls)
        if (this.originalBluelightTexts) {

            this.originalBluelightTexts = [];
        } else {
            this.originalBluelightTexts = [];
        }
        
        // Find all elements containing "Blue Light" text
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('Blue Light')) {
                textNodes.push(node);
            }
        }
        
        // Replace text in found nodes
        textNodes.forEach(textNode => {
            const originalText = textNode.textContent;
            this.originalBluelightTexts.push({
                node: textNode,
                originalText: originalText
            });
            textNode.textContent = originalText.replace(/Blue Light/g, 'Blurple Light');
        });

    },

    // Setup blurple light anomaly detection
    setupBlurpleLightDetection: function() {
        // Add click handler specifically for the light energy card area
        document.addEventListener('click', (event) => {
            if (!this.findModeActive || this.analyzing || !this.activeAnomalies.blurpleLightAnomaly) return;
            
            const target = event.target;
            
            // Very specific detection - only the Light Energy card area
            let isInLightEnergyCard = false;
            
            // Check if clicked directly on the Light Energy header
            if (target.textContent === 'Light Energy') {
                isInLightEnergyCard = true;
            }
            
            // Check if clicked on a light row element
            if (target.closest('.light-row')) {
                isInLightEnergyCard = true;
            }
            
            // Check if clicked on elements within the Light Energy section
            let parent = target.parentElement;
            while (parent && !isInLightEnergyCard) {
                // Check if parent is a light row
                if (parent.classList.contains('light-row')) {
                    isInLightEnergyCard = true;
                    break;
                }
                
                // Check if parent has the Light Energy header as a sibling
                if (parent.querySelector && parent.querySelector('h3') && 
                    parent.querySelector('h3').textContent === 'Light Energy') {
                    // Make sure we're clicking on something near the light rows, not just anywhere in prism tab
                    const lightRows = parent.querySelectorAll('.light-row');
                    for (let row of lightRows) {
                        if (row.contains(target)) {
                            isInLightEnergyCard = true;
                            break;
                        }
                    }
                    if (isInLightEnergyCard) break;
                }
                
                parent = parent.parentElement;
            }
            
            // Only trigger if clicking specifically in the Light Energy card area
            if (isInLightEnergyCard) {

                this.analyzeBlurpleLightAnomaly(true);
            }
        }, true);

    },

    // Analyze blurple light anomaly (triggered by clicking anywhere)
    analyzeBlurpleLightAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return;
        
        this.analyzing = true;

        // Add cursor animation and analyzing class
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback using the standard system
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            // Blurple light anomaly detected and automatically fixed
            this.showAnomalyFixedNotification();
            this.fixBlurpleLightAnomaly();
        }, 3000);
    },

    // Fix blurple light anomaly
    fixBlurpleLightAnomaly: function() {
        if (!this.activeAnomalies.blurpleLightAnomaly) return;

        // Restore original text
        if (this.originalBluelightTexts) {
            this.originalBluelightTexts.forEach(({ node, originalText }) => {
                if (node && node.textContent) {
                    node.textContent = originalText;
                }
            });
            this.originalBluelightTexts = null;
        }
        
        // Remove from active anomalies
        this.activeAnomalies.blurpleLightAnomaly = false;
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(a => a.type !== 'blurpleLight');
        
        // Update detector modal
        this.updateDetectorModal();
        
        // Save state
        this.saveAnomalyState();
        
        // Give reward
        this.giveAnomalyReward();

    },

    // Restore blurple light anomaly from saved state
    restoreBlurpleLightAnomaly: function(savedAnomaly) {

        if (this.activeAnomalies.blurpleLightAnomaly) {

            return;
        }
        
        // Add to anomalies array
        this.anomalies.push(savedAnomaly);
        
        // Set active state
        this.activeAnomalies.blurpleLightAnomaly = true;
        
        // Start the blurple light anomaly effect with a delay to ensure DOM is ready
        setTimeout(() => {
            this.startBlurpleLightAnomaly();
        }, 1000);
    },

    // === PRISM GREY ANOMALY DETECTION ===

    // Setup detection for prism grey anomaly
    setupPrismGreyDetection: function() {
        // Add click handler for prism grid tiles
        document.addEventListener('click', (event) => {
            if (!this.findModeActive || this.analyzing || this.searching || !this.activeAnomalies.prismGreyAnomaly) return;
            
            const target = event.target;
            
            // Check if clicked on a prism tile
            let isPrismTile = false;
            
            // Direct click on light tile
            if (target.classList.contains('light-tile')) {
                isPrismTile = true;
            }
            
            // Check if clicked inside a light tile
            if (!isPrismTile && target.closest('.light-tile')) {
                isPrismTile = true;
            }
            
            // Check if clicked in the prism grid area
            if (!isPrismTile && target.closest('#lightGrid')) {
                isPrismTile = true;
            }
            
            // Only trigger if clicking on prism tiles/grid
            if (isPrismTile) {

                this.analyzePrismGreyAnomaly(true);
            }
        }, true);

    },

    // === NOTATION SCRAMBLE ANOMALY DETECTION ===

    // Setup detection for notation scramble anomaly
    setupNotationScrambleDetection: function() {
        
        // Add click handler for both settings notation dropdown and any number displays
        document.addEventListener('click', (event) => {
            
            if (!this.activeAnomalies.notationScrambleAnomaly) return;
            
            // Check if clicked on notation dropdown (whether in find mode or not)
            if (event.target.id === 'notationSelect' || event.target.closest('#notationSelect')) {
                
                // Prevent the default action
                event.preventDefault();
                event.stopPropagation();
                
                if (this.findModeActive) {
                    // In find mode - analyze the anomaly
                    this.analyzeNotationScrambleAnomaly(true);
                } else {
                    // Not in find mode - show locked message
                    this.showPopup('Notation is locked due to an anomaly! Use the Anomaly Detector to fix it.', '#ff6b6b');
                }
                return;
            }
            
            // Check if clicked on any number display while in find mode
            if (this.findModeActive && !this.analyzing && !this.searching) {
                const target = event.target;
                
                // Check if clicked element contains formatted numbers (currency displays, etc.)
                const isNumberDisplay = this.isNumberDisplay(target);

                if (isNumberDisplay) {

                    this.analyzeNotationScrambleAnomaly(true);
                }
            }
        }, true);

    },

    // Helper function to detect if an element is displaying a formatted number
    isNumberDisplay: function(element) {
        if (!element) return false;
        
        const text = element.textContent ? element.textContent.trim() : '';

        // Check specific element IDs first (most reliable)
        if (element.id && ['fluff', 'swaria', 'feathers', 'artifacts', 'kp'].includes(element.id)) {

            return true;
        }
        
        // Check if element is inside a currency wrapper
        if (element.closest && element.closest('.currency-value-wrapper')) {

            return true;
        }
        
        // Check for gain popup elements
        if (element.classList && element.classList.contains('gain-popup')) {

            return true;
        }
        
        // If we have text content, check for number patterns
        if (text && text.length > 0) {
            // Check for common number patterns that would be affected by notation changes
            const numberPatterns = [
                /^\d+(\.\d+)?[KMBTQSOD]/i,        // Numeral notation (1.23K, 456M, etc.)
                /^\d+(\.\d+)?e[+-]?\d+/i,         // Scientific notation (1.23e6, etc.)
                /^\d{1,3}(,\d{3})+(\.\d+)?$/,     // Regular large numbers with commas (1,000,000)
                /^\d+$/,                          // Simple whole numbers
                /^\d+\.\d+$/,                     // Simple decimal numbers
                /[🦀🎉🌟⭐💎]/,                   // Cancer notation (contains emojis)
                /[̀-ͯ]/                           // Zalgo notation (contains combining marks)
            ];
            
            for (let pattern of numberPatterns) {
                if (pattern.test(text)) {

                    return true;
                }
            }
            
            // Check for "+X per tick" patterns
            if (/\+\d+.*per tick/i.test(text)) {

                return true;
            }
        }

        return false;
    },

    // === BOX GENERATOR FREEZE ANOMALY FUNCTIONS ===

    // Spawn box generator freeze anomaly
    spawnBoxGeneratorFreezeAnomaly: function() {

        // Check Soap's friendship level - if 10+, automatically fix any existing anomalies and prevent new ones
        const soapLevel = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                         (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
        
        if (soapLevel >= 10) {

            // If there's already a box generator freeze anomaly, fix it immediately
            if (this.activeAnomalies.boxGeneratorFreezeAnomaly) {

                this.fixBoxGeneratorFreezeAnomaly();
            }
            
            // Don't spawn new box generator freeze anomalies when Mk.2 is active
            return;
        }
        
        this.activeAnomalies.boxGeneratorFreezeAnomaly = true;
        
        // Always target the Box Generator Mk.2 system (use special ID -1 to represent Mk.2)
        // For legacy compatibility, still choose a random generator if Mk.2 isn't available
        if (soapLevel >= 10) {
            this.frozenGeneratorId = -1; // Special ID for Mk.2 system
        } else {
            this.frozenGeneratorId = Math.floor(Math.random() * 5); // Random individual generator (0-4)
        }
        
        // Create anomaly record
        const anomaly = {
            id: this.nextId++,
            type: 'boxGeneratorFreeze',
            name: 'Box Generator Freeze',
            description: soapLevel >= 10 ? 'The Box Generator Mk.2 system has mysteriously stopped working' : 'One of the box generators has mysteriously stopped working',
            spawnTime: Date.now(),
            fixTime: null,
            reward: 50
        };
        
        this.anomalies.push(anomaly);
        this.saveAnomalyState();
        
        if (this.frozenGeneratorId === -1) {

        } else {
            const generatorNames = ['Common Box', 'Uncommon Box', 'Rare Box', 'Legendary Box', 'Mythic Box'];

        }
    },

    // Setup box generator freeze anomaly detection
    setupBoxGeneratorFreezeDetection: function() {
        // Add click handler for specific frozen generator
        document.addEventListener('click', (event) => {
            if (!this.findModeActive || this.analyzing || !this.activeAnomalies.boxGeneratorFreezeAnomaly) return;
            
            const target = event.target;
            
            // Only trigger if clicking specifically on the frozen generator
            let isClickingFrozenGenerator = false;
            
            // Handle Box Generator Mk.2 system (frozenGeneratorId === -1)
            if (this.frozenGeneratorId === -1) {
                // Look for Mk.2 related elements in the front desk
                // Check for clicks on automator elements with "Box Generator Mk.2" in the name
                const automatorRow = target.closest('.automator-row');
                if (automatorRow) {
                    const nameSpan = automatorRow.querySelector('.job-name');
                    if (nameSpan && nameSpan.textContent.includes('Box Generator Mk.2')) {
                        isClickingFrozenGenerator = true;
                    }
                }
                
                // Also check for direct clicks on Mk.2 related buttons or text
                if (target.textContent && target.textContent.includes('Box Generator Mk.2')) {
                    isClickingFrozenGenerator = true;
                }
                
            } else {
                // Handle individual generators (legacy system for Soap level < 10)
                
                // Check if clicked on the frozen generator's progress bar
                if (target.id === `progress${this.frozenGeneratorId}`) {
                    isClickingFrozenGenerator = true;
                }
                
                // Check if clicked on the frozen generator's buttons
                if (target.id === `upgradeGen${this.frozenGeneratorId}` || target.id === `buyGen${this.frozenGeneratorId}`) {
                    isClickingFrozenGenerator = true;
                }
                
                // Check if clicked inside the frozen generator's wrapper
                const generatorWrapper = target.closest('.generator');
                if (generatorWrapper) {
                    // Check if this wrapper contains the frozen generator's progress bar
                    const progressBar = generatorWrapper.querySelector(`#progress${this.frozenGeneratorId}`);
                    if (progressBar) {
                        isClickingFrozenGenerator = true;
                    }
                }
            }
            
            // Only trigger if clicking specifically on the frozen generator/system
            if (isClickingFrozenGenerator) {
                if (this.frozenGeneratorId === -1) {

                } else {
                    const generatorNames = ['Common Box', 'Uncommon Box', 'Rare Box', 'Legendary Box', 'Mythic Box'];

                }
                this.analyzeBoxGeneratorFreezeAnomaly(true);
            }
        }, true);

    },

    // Analyze box generator freeze anomaly
    analyzeBoxGeneratorFreezeAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return;
        
        this.analyzing = true;

        // Add cursor animation and analyzing class
        document.body.classList.add('anomaly-analyzing');
        this.startCursorAnimation();
        
        // Show analyzing feedback using the standard system
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            // Box generator freeze anomaly detected and automatically fixed
            this.showAnomalyFixedNotification();
            this.fixBoxGeneratorFreezeAnomaly();
        }, 3000);
    },

    // Fix box generator freeze anomaly
    fixBoxGeneratorFreezeAnomaly: function() {

        const wasMk2Frozen = this.frozenGeneratorId === -1;
        
        this.activeAnomalies.boxGeneratorFreezeAnomaly = false;
        this.frozenGeneratorId = null;
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'boxGeneratorFreeze');
        
        // Give reward
        this.giveAnomalyReward();
        
        // Save state
        this.saveAnomalyState();
        
        if (wasMk2Frozen) {

        } else {

        }
    },

    // Check if a generator should be frozen
    isGeneratorFrozen: function(generatorId) {
        return this.activeAnomalies.boxGeneratorFreezeAnomaly && this.frozenGeneratorId === generatorId;
    },

    // Check if the Box Generator Mk.2 system is frozen
    isMk2SystemFrozen: function() {
        return this.activeAnomalies.boxGeneratorFreezeAnomaly && this.frozenGeneratorId === -1;
    },

    // Restore box generator freeze anomaly from saved state
    restoreBoxGeneratorFreezeAnomaly: function(savedAnomaly) {

        if (this.activeAnomalies.boxGeneratorFreezeAnomaly) {

            return;
        }
        
        // Check Soap's friendship level - if 10+, automatically fix instead of restoring
        const soapLevel = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                         (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;
        
        if (soapLevel >= 10) {

            // Don't restore the anomaly, just give the reward since it was "automatically fixed"
            this.giveAnomalyReward();
            return;
        }
        
        // Add to anomalies array
        this.anomalies.push(savedAnomaly);
        
        // Set active state
        this.activeAnomalies.boxGeneratorFreezeAnomaly = true;
        
        // The frozenGeneratorId should already be restored from the saved state
        if (this.frozenGeneratorId === -1) {

        } else {
            const generatorNames = ['Common Box', 'Uncommon Box', 'Rare Box', 'Legendary Box', 'Mythic Box'];

        }
    },
    
    // === LAB DARKNESS ANOMALY FUNCTIONS ===
    
    // Lab darkness anomaly variables
    labDarknessStartTime: null,
    labDarknessDuration: 5000, // 5 seconds to fix it
    labDarknessProgress: 0, // 0-100% how much screen is consumed
    labDarknessPaused: true, // Whether the anomaly is paused (starts paused until lab tab clicked)
    viPanicInterval: null, // Timer for Vi's panic dialogue rotation
    viPanicMessages: [
        "WTF", "WHAT IS THIS", "STOP", "AAAHH", "WHERE IS THIS DARKNESS COMING FROM", 
        "MAKE IT STOP", "HELP", "NO NO NO", "WHAT'S HAPPENING", "GET IT AWAY", 
        "I CAN'T SEE", "SOMEONE HELP ME"
    ],
    
    // Spawn lab darkness anomaly (silently - no popup notification)
    spawnLabDarknessAnomaly: function() {

        if (this.activeAnomalies.labDarknessAnomaly) return; // Already active
        
        this.activeAnomalies.labDarknessAnomaly = true;
        
        // Add to anomalies array
        this.anomalies.push({
            id: this.nextId++,
            type: 'labDarkness',
            spawnTime: Date.now(),
            isDangerous: true
        });
        
        // Initialize state - starts paused until player clicks lab tab
        this.labDarknessProgress = 0;
        this.labDarknessPaused = true;
        
        // Setup lab tab monitoring to wait for player to click lab tab

        this.setupLabTabMonitoring();
        
        // Save state
        this.saveAnomalyState();

    },
    
    // Setup monitoring for when player clicks lab tab button (to start lab darkness)
    setupLabTabMonitoring: function() {
        // Remove existing monitor if present
        if (this.labTabMonitor) {
            document.removeEventListener('click', this.labTabMonitor);
        }
        
        this.labTabMonitor = (event) => {
            if (!this.activeAnomalies.labDarknessAnomaly || !this.labDarknessPaused) return;
            
            // Look for lab tab button clicks with multiple selectors
            const labTabButton1 = document.querySelector('[onclick*="switchHomeSubTab(\'prismSubTab\')"]');
            const labTabButton2 = document.querySelector('[onclick*="switchHomeSubTab(\\"prismSubTab\\")"]');
            const labTabButton3 = document.getElementById('prismSubTabBtn');







            // More comprehensive check for lab tab button click
            let isLabTabButtonClick = false;
            
            // Check direct element match
            if (event.target === labTabButton1 || event.target === labTabButton2 || event.target === labTabButton3) {
                isLabTabButtonClick = true;

            }
            
            // Check onclick attribute contains lab/prism switch
            if (event.target.onclick && event.target.onclick.toString().includes("switchHomeSubTab") && 
                (event.target.onclick.toString().includes("prismSubTab") || event.target.onclick.toString().includes("prism"))) {
                isLabTabButtonClick = true;

            }
            
            // Check if element contains "Lab" text and is a button/clickable
            if ((event.target.textContent && event.target.textContent.includes('Lab')) &&
                (event.target.tagName === 'BUTTON' || event.target.onclick || event.target.style.cursor === 'pointer')) {
                isLabTabButtonClick = true;

            }
            
            // Check if element has the prismSubTabBtn ID
            if (event.target.id === 'prismSubTabBtn') {
                isLabTabButtonClick = true;

            }
            
            // Check closest parent for lab tab functionality
            const closestLabElement = event.target.closest && (
                event.target.closest('[onclick*="prismSubTab"]') || 
                event.target.closest('#prismSubTabBtn')
            );
            if (closestLabElement) {
                isLabTabButtonClick = true;

            }

            if (isLabTabButtonClick) {

                // Small delay to ensure tab switch has completed
                setTimeout(() => {
                    if (this.labDarknessPaused && this.activeAnomalies.labDarknessAnomaly) {

                        this.labDarknessPaused = false;
                        // Set start time to now since we're starting fresh
                        this.labDarknessStartTime = Date.now();
                        // Create the darkness overlay now that player clicked lab tab
                        this.createLabDarknessOverlay();

                        this.startLabDarknessProgression();

                        // Start Vi's panic dialogue
                        this.startViPanicDialogue();

                        // Remove this monitor since we're no longer paused
                        document.removeEventListener('click', this.labTabMonitor);
                        this.labTabMonitor = null;

                    } else {

                    }
                }, 100); // Small delay to ensure tab switch has completed
            }
        };
        
        document.addEventListener('click', this.labTabMonitor);

    },
    
    // Create the lab darkness overlay element
    createLabDarknessOverlay: function() {
        // Remove existing overlay if present
        const existing = document.getElementById('labDarknessOverlay');
        if (existing) existing.remove();
        
        // Create new overlay that grows from all corners toward center
        const overlay = document.createElement('div');
        overlay.id = 'labDarknessOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = `
            radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.98) 0%, transparent 0%),
            radial-gradient(ellipse at top right, rgba(0, 0, 0, 0.98) 0%, transparent 0%),
            radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.98) 0%, transparent 0%),
            radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.98) 0%, transparent 0%)
        `;
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '1000'; // Lower z-index to stay below UI elements like anomaly detector
        overlay.style.transition = 'all 0.2s ease-out';
        overlay.style.backdropFilter = 'blur(1px)';
        overlay.style.opacity = '0.95';
        
        // Add some dark particles for effect with smoother animations
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'lab-darkness-particle'; // Add class for easier identification
            particle.style.position = 'absolute';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = (2 + Math.random() * 3) + 'px';
            particle.style.background = `rgba(0, 0, 0, ${0.6 + Math.random() * 0.4})`;
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `labDarknessParticle ${3 + Math.random() * 4}s infinite ease-in-out`;
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.opacity = '0.8';
            overlay.appendChild(particle);
        }
        
        document.body.appendChild(overlay);
        
        // If find mode is active, setup hover listeners
        if (this.findModeActive) {
            overlay.addEventListener('mouseenter', this.anomalyMouseEnter);
            overlay.addEventListener('mouseleave', this.anomalyMouseLeave);
            
            // Also add to all lab darkness particles
            const labParticles = overlay.querySelectorAll('.lab-darkness-particle');
            labParticles.forEach(particle => {
                particle.addEventListener('mouseenter', this.anomalyMouseEnter);
                particle.addEventListener('mouseleave', this.anomalyMouseLeave);
            });
            
            // Enable pointer events for hovering
            this.updateDangerousAnomalyPointerEvents(true);
        }
        
        // Start with smoother initial coverage
        setTimeout(() => {
            overlay.style.background = `
                radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.98) 5%, rgba(0, 0, 0, 0.3) 15%, transparent 25%),
                radial-gradient(ellipse at top right, rgba(0, 0, 0, 0.98) 5%, rgba(0, 0, 0, 0.3) 15%, transparent 25%),
                radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.98) 5%, rgba(0, 0, 0, 0.3) 15%, transparent 25%),
                radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.98) 5%, rgba(0, 0, 0, 0.3) 15%, transparent 25%)
            `;
        }, 100);
    },
    
    // Start the lab darkness progression (gradually consuming screen from corners)
    startLabDarknessProgression: function() {

        // Clear any existing timer
        if (this.labDarknessProgressTimer) {
            clearInterval(this.labDarknessProgressTimer);
        }
        
        this.labDarknessProgressTimer = setInterval(() => {
            // Don't progress if paused or if analyzing
            if (this.labDarknessPaused || this.analyzing) {
                return;
            }
            
            const elapsed = Date.now() - this.labDarknessStartTime;
            const progress = (elapsed / this.labDarknessDuration) * 100;
            
            this.labDarknessProgress = Math.min(progress, 100);
            
            // Update overlay coverage with smoother animation (darkness grows from corners toward center)
            const overlay = document.getElementById('labDarknessOverlay');
            if (overlay) {
                // Smooth easing function for more natural progression
                const easedProgress = this.labDarknessProgress / 100;
                const smoothProgress = easedProgress * easedProgress * (3 - 2 * easedProgress); // Smoothstep
                
                // Coverage grows from 5% to 60% for more dramatic effect
                const coveragePercent = 5 + (smoothProgress * 55);
                
                // Use smoother transitions with better gradients
                overlay.style.background = `
                    radial-gradient(ellipse at top left, rgba(0, 0, 0, 0.98) ${coveragePercent}%, rgba(0, 0, 0, 0.3) ${coveragePercent + 10}%, transparent ${coveragePercent + 20}%),
                    radial-gradient(ellipse at top right, rgba(0, 0, 0, 0.98) ${coveragePercent}%, rgba(0, 0, 0, 0.3) ${coveragePercent + 10}%, transparent ${coveragePercent + 20}%),
                    radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.98) ${coveragePercent}%, rgba(0, 0, 0, 0.3) ${coveragePercent + 10}%, transparent ${coveragePercent + 20}%),
                    radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.98) ${coveragePercent}%, rgba(0, 0, 0, 0.3) ${coveragePercent + 10}%, transparent ${coveragePercent + 20}%)
                `;
                
                // Smooth progressive intensity effects
                const blurAmount = Math.min(1 + (smoothProgress * 6), 7); // 1px to 7px blur
                const opacity = Math.min(0.95 + (smoothProgress * 0.05), 1); // Slight opacity increase
                
                overlay.style.backdropFilter = `blur(${blurAmount}px)`;
                overlay.style.opacity = opacity;
                
                // Add dark vignette effect as it progresses
                if (this.labDarknessProgress > 30) {
                    overlay.style.boxShadow = `inset 0 0 ${50 + smoothProgress * 100}px rgba(0, 0, 0, ${0.3 + smoothProgress * 0.4})`;
                }
            }
            
            // Check if time is up
            if (this.labDarknessProgress >= 100) {

                this.labDarknessTimeUp();
            }
        }, 25); // Update every 25ms to maintain same animation speed with 5-second duration
    },
    
    // Start Vi's panic dialogue rotation
    startViPanicDialogue: function() {
        // Stop any existing dialogue timers
        this.stopViPanicDialogue();
        
        // Disable normal Vi dialogue while panic is active
        window.viPanicMode = true;
        
        let currentMessageIndex = 0;
        
        // Show first panic message immediately
        if (window.showViResponse) {
            window.showViResponse(this.viPanicMessages[currentMessageIndex], false);
        }
        
        // Rotate panic messages every 300ms
        this.viPanicInterval = setInterval(() => {
            if (!this.activeAnomalies.labDarknessAnomaly) {
                this.stopViPanicDialogue();
                return;
            }
            
            currentMessageIndex = (currentMessageIndex + 1) % this.viPanicMessages.length;
            
            if (window.showViResponse) {
                window.showViResponse(this.viPanicMessages[currentMessageIndex], false);
            }
        }, 300);

    },
    
    // Stop Vi's panic dialogue
    stopViPanicDialogue: function() {
        if (this.viPanicInterval) {
            clearInterval(this.viPanicInterval);
            this.viPanicInterval = null;
        }
        
        // Re-enable normal Vi dialogue
        window.viPanicMode = false;

    },
    
    // Time is up for lab darkness anomaly
    labDarknessTimeUp: function() {

        // Stop progression timer
        if (this.labDarknessProgressTimer) {
            clearInterval(this.labDarknessProgressTimer);
            this.labDarknessProgressTimer = null;
        }
        
        // Stop Vi panic dialogue
        this.stopViPanicDialogue();
        
        // Apply the 25% inventory token loss
        this.applyInventoryTokenLoss();
        
        // Show Vi's failure dialogue
        setTimeout(() => {
            if (window.showViResponse) {
                window.showViResponse("I-It's gone... What the hell was that? Are you ok Peachy? You just lost 25% of your tokens...", false);
                
                // Auto-hide the failure message after 8 seconds
                setTimeout(() => {
                    const viSpeechBubble = document.getElementById('viSpeechBubble');
                    if (viSpeechBubble) {
                        viSpeechBubble.style.display = 'none';
                    }
                }, 8000);
            }
        }, 1000); // Delay to let the darkness clear first
        
        // Fix the anomaly (remove overlay and cleanup)
        this.fixLabDarknessAnomaly(false); // false = failed, not manually fixed
    },
    
    // Setup lab darkness anomaly detection (click anywhere when find mode is active)
    setupLabDarknessDetection: function() {
        // Add click listener for lab darkness anomaly detection
        document.addEventListener('click', (event) => {
            // Only detect if find mode is active and lab darkness anomaly is active and not paused
            if (this.findModeActive && !this.analyzing && this.activeAnomalies.labDarknessAnomaly && !this.labDarknessPaused) {

                // For lab darkness, any click anywhere on the screen fixes it
                this.analyzeLabDarknessAnomaly(true);
                
                event.preventDefault();
                event.stopPropagation();
            }
        });

    },
    
    // Analyze lab darkness anomaly (always succeeds if clicked during find mode)
    analyzeLabDarknessAnomaly: function(isTargetedClick = false) {
        if (this.analyzing) return;
        
        this.analyzing = true;

        // Show analyzing feedback
        this.showAnalyzing();
        
        setTimeout(() => {
            this.analyzing = false;
            
            // Stop cursor animation and remove analyzing animation class
            this.stopCursorAnimation();
            document.body.classList.remove('anomaly-analyzing');
            
            if (this.activeAnomalies.labDarknessAnomaly && isTargetedClick) {
                // Lab darkness anomaly detected and clicked during find mode - fix it
                this.fixLabDarknessAnomaly(true); // true = manually fixed
            } else {
                // Either no anomaly OR not in the right state
                this.showNoAnomaly();
            }
        }, 3000);
    },
    
    // Fix lab darkness anomaly
    fixLabDarknessAnomaly: function(wasManuallyFixed = true) {

        // Stop progression timer
        if (this.labDarknessProgressTimer) {
            clearInterval(this.labDarknessProgressTimer);
            this.labDarknessProgressTimer = null;
        }
        
        // Stop lab tab monitoring
        if (this.labTabMonitor) {
            document.removeEventListener('click', this.labTabMonitor);
            this.labTabMonitor = null;
        }
        
        // Stop Vi panic dialogue
        this.stopViPanicDialogue();
        
        // Remove overlay
        const overlay = document.getElementById('labDarknessOverlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Remove from anomalies array
        this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'labDarkness');
        
        // Set inactive
        this.activeAnomalies.labDarknessAnomaly = false;
        
        // Reset state variables
        this.labDarknessProgress = 0;
        this.labDarknessPaused = true;
        this.labDarknessStartTime = null;
        
        // Save state
        this.saveAnomalyState();
        
        if (wasManuallyFixed) {
            // Show Vi's relief dialogue
            setTimeout(() => {
                if (window.showViResponse) {
                    window.showViResponse("WHAT THE HELL WAS THAT!? WHERE DID THIS DARKNESS COME FROM!? THANK GOD ITS GONE!", false);
                    
                    // Auto-hide the relief message after 8 seconds
                    setTimeout(() => {
                        const viSpeechBubble = document.getElementById('viSpeechBubble');
                        if (viSpeechBubble) {
                            viSpeechBubble.style.display = 'none';
                        }
                    }, 8000);
                }
            }, 500);
            
            // Show only black popup notification (no green popup)
            this.showPopup("Lab Darkness Anomaly Fixed", '#000000');

        } else {

        }
    },
    
    // Restore lab darkness anomaly from saved state
    restoreLabDarknessAnomaly: function(savedAnomaly) {

        if (this.activeAnomalies.labDarknessAnomaly) {

            return;
        }
        
        // Add to anomalies array
        this.anomalies.push(savedAnomaly);
        
        // Set active state
        this.activeAnomalies.labDarknessAnomaly = true;
        
        // Reset variables
        this.labDarknessProgress = 0;
        this.labDarknessPaused = true;
        
        // Setup lab tab monitoring again (anomaly spawned but not triggered yet)
        this.setupLabTabMonitoring();

    },

    // Restore notation scramble anomaly from saved state
    restoreNotationScrambleAnomaly: function(savedAnomaly) {

        if (this.activeAnomalies.notationScrambleAnomaly) {

            return;
        }
        
        // Add to anomalies array
        this.anomalies.push(savedAnomaly);
        
        // Set active state
        this.activeAnomalies.notationScrambleAnomaly = true;
        
        // Restart the anomaly effect
        this.startNotationScrambleAnomaly();

    }
};

// Global functions for modal control
function openAnomalyDetectorModal() {
    window.anomalySystem.openDetectorModal();
}

function closeAnomalyDetectorModal() {
    window.anomalySystem.closeDetectorModal();
}

function toggleAnomalyDetectorModal() {
    window.anomalySystem.toggleDetectorModal();
}

// CSS animations for anomalies
const anomalyStyles = document.createElement('style');
anomalyStyles.textContent = `
    @keyframes anomalyPulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
    }
    
    @keyframes anomalyHighlight {
        0% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,0,0); }
        50% { transform: scale(1.5); box-shadow: 0 0 40px rgba(255,255,0,1); }
        100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,255,0,0); }
    }
    
    @keyframes anomalyRewardFade {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        70% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes darkVoidParticle {
        0% { opacity: 0.3; transform: translateY(0px) scale(0.5); }
        50% { opacity: 1; transform: translateY(-20px) scale(1); }
        100% { opacity: 0.3; transform: translateY(-40px) scale(0.5); }
    }
    
    @keyframes darkVoidCloudFloat {
        0% { 
            transform: translateX(0px) translateY(0px) scale(1); 
            opacity: 0.7;
        }
        33% { 
            transform: translateX(-8px) translateY(-3px) scale(1.05); 
            opacity: 0.9;
        }
        66% { 
            transform: translateX(5px) translateY(-2px) scale(0.95); 
            opacity: 0.8;
        }
        100% { 
            transform: translateX(0px) translateY(0px) scale(1); 
            opacity: 0.7;
        }
    }
    
    @keyframes darkVoidCloudWisp {
        0% { 
            transform: scale(1) rotate(0deg); 
            opacity: 0.6;
        }
        25% { 
            transform: scale(1.1) rotate(5deg); 
            opacity: 0.8;
        }
        50% { 
            transform: scale(1.15) rotate(-3deg); 
            opacity: 1;
        }
        75% { 
            transform: scale(1.05) rotate(2deg); 
            opacity: 0.9;
        }
        100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 0.6;
        }
    }
    
    @keyframes dangerousAnomalyPulse {
        0% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); }
        100% { box-shadow: 0 0 40px rgba(255, 0, 0, 1), 0 0 60px rgba(255, 255, 0, 0.5); }
    }
`;
document.head.appendChild(anomalyStyles);

// Initialize the anomaly system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.anomalySystem.init();
        
        // Hook into infinity system updates to check detector visibility
        const originalInfinityReset = window.infinitySystem?.performInfinityReset;
        if (originalInfinityReset) {
            window.infinitySystem.performInfinityReset = function() {
                const result = originalInfinityReset.apply(this, arguments);
                setTimeout(() => {
                    window.anomalySystem.updateDetectorVisibility();
                }, 50);
                return result;
            };
        }
        
        // Hook into power UI updates to match width
        if (typeof updatePowerEnergyStatusUI === 'function') {
            const originalUpdatePower = updatePowerEnergyStatusUI;
            updatePowerEnergyStatusUI = function() {
                originalUpdatePower.apply(this, arguments);
                setTimeout(() => {
                    window.anomalySystem.matchPowerUIWidth();
                    window.anomalySystem.coordinateWithBoostDisplay();
                }, 50);
            };
        }
        
        // Hook into power generator UI updates
        if (typeof updatePowerGeneratorUI === 'function') {
            const originalUpdatePowerGeneratorUI = updatePowerGeneratorUI;
            updatePowerGeneratorUI = function() {
                // Only call original function if soap generator anomaly is NOT active
                // This prevents trying to update button text that no longer exists in soap overlays
                if (!window.anomalySystem.activeAnomalies.soapGeneratorAnomaly) {
                    originalUpdatePowerGeneratorUI.apply(this, arguments);
                }
                // Remove aggressive soap re-application - let tab monitoring handle it
            };
        }
        
        // Hook into general generator rendering
        if (typeof renderGenerators === 'function') {
            const originalRenderGenerators = renderGenerators;
            renderGenerators = function() {
                originalRenderGenerators.apply(this, arguments);
                // Remove aggressive soap re-application - let tab monitoring handle it
            };
        }
        
        // Multiple initialization attempts with decreasing delays
        setTimeout(() => window.anomalySystem.updateDetectorVisibility(), 100);
        setTimeout(() => window.anomalySystem.updateDetectorVisibility(), 500);
        setTimeout(() => window.anomalySystem.updateDetectorVisibility(), 1000);
        
        // Also check visibility and width periodically
        setInterval(() => {
            window.anomalySystem.updateDetectorVisibility();
            if (window.anomalySystem.isDetectorVisible) {
                window.anomalySystem.matchPowerUIWidth();
            }
            
            // Check if OMEGA box anomaly is active but OMEGA box is missing
            if (window.anomalySystem.activeAnomalies.cargoOmegaBoxAnomaly && !document.getElementById('omegaBox')) {

                window.anomalySystem.addOmegaBoxToCargo();
            }
            
            // Check if blurple light anomaly is active but text has reverted
            if (window.anomalySystem.activeAnomalies.blurpleLightAnomaly) {
                const walker = document.createTreeWalker(
                    document.body,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let foundBlueLightText = false;
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent.includes('Blue Light:')) {
                        foundBlueLightText = true;
                        break;
                    }
                }
                
                // If we found "Blue Light:" text while the anomaly is active, re-apply the replacement
                if (foundBlueLightText) {

                    window.anomalySystem.replaceBluelightText();
                }
            }
        }, 2000);
        
        // Handle visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && window.anomalySystem.activeAnomalies.soapGeneratorAnomaly) {
                // Tab became visible again, re-apply soap generator theme after a delay
                setTimeout(() => {
                    window.anomalySystem.transformPowerGeneratorsToSoap();
                    window.anomalySystem.setupSoapClickDetection();
                }, 100);
            }
        });
        
    }, 1000); // Delay to ensure other systems are loaded
});

// Export for global access
window.openAnomalyDetectorModal = openAnomalyDetectorModal;
window.closeAnomalyDetectorModal = closeAnomalyDetectorModal;
window.toggleAnomalyDetectorModal = toggleAnomalyDetectorModal;

// Test functions
function testAnomalySystem() {


    // Check if player has infinity
    const totalInfinity = window.infinitySystem ? window.infinitySystem.totalInfinityEarned : 0;

    if (totalInfinity < 1) {

        return;
    }
    
    // Force show the detector button for testing
    const detectorContainer = document.getElementById('anomalyDetectorContainer');
    if (detectorContainer) {
        detectorContainer.style.display = 'block';

    }
    
    // Spawn some test anomalies manually
    window.anomalySystem.spawnAnomaly();
    window.anomalySystem.spawnAnomaly();

    // Open the detector modal
    setTimeout(() => {
        window.anomalySystem.openDetectorModal();

    }, 1000);
}

function forceShowAnomalyDetector() {
    const detectorContainer = document.getElementById('anomalyDetectorContainer');
    if (detectorContainer) {
        detectorContainer.style.display = 'block';

    }
}

function simulateInfinityEarned() {
    if (window.infinitySystem) {
        window.infinitySystem.totalInfinityEarned = 1;
        window.anomalySystem.updateDetectorVisibility();

    }
}

function clearAllAnomalies() {
    window.anomalySystem.removeAllAnomalies();
}

window.testAnomalySystem = testAnomalySystem;
window.forceShowAnomalyDetector = forceShowAnomalyDetector;
window.simulateInfinityEarned = simulateInfinityEarned;
window.clearAllAnomalies = clearAllAnomalies;

// Global test functions for anomaly system
window.testClockAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnClockAnomaly();
};

window.testBackwardClockAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnBackwardClockAnomaly();
};

window.testBoxOrderAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnBoxOrderAnomaly();
};

window.testSoapGeneratorAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnSoapGeneratorAnomaly();
};

window.testShopPriceAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnShopPriceAnomaly();
};

window.forceTestShopPriceAnomaly = function() {

    if (!window.anomalySystem) {

        return;
    }
    if (!window.boutique) {

        return;
    }
    window.anomalySystem.spawnShopPriceAnomaly();
};

window.clearShopPriceAnomaly = function() {

    if (window.anomalySystem && window.anomalySystem.activeAnomalies.shopPriceAnomaly) {
        window.anomalySystem.fixShopPriceAnomaly();

    } else {

    }
};

window.checkShopPriceAnomalyStatus = function() {





    // Test price override
    if (window.boutique && window.anomalySystem?.anomalyAffectedItem) {
        const affectedItem = window.anomalySystem.anomalyAffectedItem;
        const testPrice = window.boutique.getCurrentPrice(affectedItem);



    }
    
    // Check if original function exists

};

window.forceSoapGeneratorAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    // Clear existing soap generator anomaly first
    if (window.anomalySystem.activeAnomalies.soapGeneratorAnomaly) {
        window.anomalySystem.fixSoapGeneratorAnomaly();
    }
    // Now spawn a fresh one
    window.anomalySystem.spawnSoapGeneratorAnomaly();
};

window.forceAnomalySpawn = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnRandomAnomaly();
};

window.getAnomalyStatus = function() {
    const system = window.anomalySystem;
    return {
        activeAnomalies: system.anomalies.length,
        findModeActive: system.findModeActive,
        currencyDebuff: system.getCurrencyDebuff(),
        canSleep: system.canPlayerSleep(),
        clockAnomalyActive: system.activeAnomalies.clockAnomaly,
        soapGeneratorAnomalyActive: system.activeAnomalies.soapGeneratorAnomaly
    };
};

window.debugPowerGenerator = function() {
    const powerGens = document.querySelectorAll('.power-generator');
    const powerHeadings = document.querySelectorAll('.power-generator h3');
    
    powerHeadings.forEach((heading, i) => {

    });
    
    return {
        powerGenerators: powerGens.length,
        headings: powerHeadings.length
    };
};

window.testDarkVoidAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnDarkVoidAnomaly();
};

window.forceTestDarkVoidAnomaly = function() {

    if (!window.anomalySystem) {

        return;
    }
    window.anomalySystem.spawnDarkVoidAnomaly();
};

window.clearDarkVoidAnomaly = function() {

    if (window.anomalySystem && window.anomalySystem.activeAnomalies.darkVoidAnomaly) {
        window.anomalySystem.fixDarkVoidAnomaly();

    } else {

    }
};

window.checkDarkVoidAnomalyStatus = function() {






};

window.triggerDarkVoidConsequencesTest = function() {

    if (window.anomalySystem && window.anomalySystem.activeAnomalies.darkVoidAnomaly) {
        window.anomalySystem.triggerDarkVoidConsequences();

    } else {

        window.anomalySystem.spawnDarkVoidAnomaly();
        setTimeout(() => {
            window.anomalySystem.triggerDarkVoidConsequences();
        }, 1000);
    }
};

window.debugCargoTabButtons = function() {

    // Find all possible cargo-related elements
    const buttons = document.querySelectorAll('button');
    const clickableElements = document.querySelectorAll('[onclick]');
    const cargoTextElements = document.querySelectorAll('*');

    buttons.forEach((btn, i) => {

    });

    clickableElements.forEach((el, i) => {

    });

    Array.from(cargoTextElements).filter(el => el.textContent && el.textContent.includes('Cargo')).forEach((el, i) => {

    });





};

window.testPrismMirrorAnomaly = function() {
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;
    if (!hasInfinity) {

        return;
    }
    window.anomalySystem.spawnPrismMirrorAnomaly();
};

window.forceTestPrismMirrorAnomaly = function() {

    if (!window.anomalySystem) {

        return;
    }
    window.anomalySystem.spawnPrismMirrorAnomaly();
};

window.clearPrismMirrorAnomaly = function() {

    if (window.anomalySystem && window.anomalySystem.activeAnomalies.prismMirrorAnomaly) {
        window.anomalySystem.fixPrismMirrorAnomaly();

    } else {

    }
};

window.checkPrismMirrorAnomalyStatus = function() {




    // Check for mirrored elements
    const mirroredElements = document.querySelectorAll('.prism-mirror-anomaly-affected');

    const anomalyStyles = document.getElementById('prismMirrorAnomalyStyles');

};

// Cargo OMEGA Box Anomaly Test Functions
window.testCargoOmegaBoxAnomaly = function() {

    if (window.anomalySystem) {
        window.anomalySystem.spawnCargoOmegaBoxAnomaly();
    }
};

window.forceTestCargoOmegaBoxAnomaly = function() {

    if (window.anomalySystem) {
        // Temporarily bypass infinity requirement for testing
        const originalCheck = window.anomalySystem.canSpawnAnomalies;
        window.anomalySystem.canSpawnAnomalies = function() { return true; };
        window.anomalySystem.spawnCargoOmegaBoxAnomaly();
        window.anomalySystem.canSpawnAnomalies = originalCheck;
    }
};

window.clearCargoOmegaBoxAnomaly = function() {

    if (window.anomalySystem && window.anomalySystem.activeAnomalies.cargoOmegaBoxAnomaly) {
        window.anomalySystem.fixCargoOmegaBoxAnomaly();

    } else {

    }
};

window.checkCargoOmegaBoxAnomalyStatus = function() {




    // Check for OMEGA box element
    const omegaBox = document.getElementById('omegaBox');

    // Check for rainbow styles
    const rainbowStyles = document.querySelectorAll('style[data-omega-box]');

    // Check cargo container
    const boxesCards = document.querySelectorAll('.card');
    let boxesContainer = null;
    
    for (let card of boxesCards) {
        const heading = card.querySelector('h2');
        if (heading && heading.textContent.trim() === 'Boxes') {
            boxesContainer = card;
            break;
        }
    }

};

// Test OMEGA box restoration process
window.testOmegaBoxRestoration = function() {

    // Check if anomaly is active but box is missing
    if (window.anomalySystem.activeAnomalies.cargoOmegaBoxAnomaly) {
        const omegaBox = document.getElementById('omegaBox');
        if (!omegaBox) {

            window.anomalySystem.addOmegaBoxToCargo();
        } else {

        }
    } else {

    }
};

// Force restoration by simulating saved state load
window.simulateOmegaBoxRestoration = function() {

    const fakeAnomaly = {
        id: 999,
        type: 'cargoOmegaBox',
        spawnTime: Date.now()
    };
    
    // Clear current state first
    window.anomalySystem.activeAnomalies.cargoOmegaBoxAnomaly = false;
    window.anomalySystem.anomalies = window.anomalySystem.anomalies.filter(a => a.type !== 'cargoOmegaBox');
    
    // Remove existing OMEGA box if present
    const existingBox = document.getElementById('omegaBox');
    if (existingBox) {
        existingBox.remove();
    }
    
    // Now simulate restoration
    window.anomalySystem.restoreCargoOmegaBoxAnomaly(fakeAnomaly);
};

// Test mutual exclusion between box order and OMEGA box anomalies
window.testBoxAnomalyMutualExclusion = function() {

    // Clear any existing anomalies first
    window.anomalySystem.activeAnomalies.boxOrderAnomaly = false;
    window.anomalySystem.activeAnomalies.cargoOmegaBoxAnomaly = false;
    window.anomalySystem.anomalies = window.anomalySystem.anomalies.filter(a => 
        a.type !== 'boxOrder' && a.type !== 'cargoOmegaBox'
    );

    window.anomalySystem.spawnBoxOrderAnomaly();


    window.anomalySystem.spawnCargoOmegaBoxAnomaly();


    window.anomalySystem.fixBoxOrderAnomaly();


    window.anomalySystem.spawnCargoOmegaBoxAnomaly();


    window.anomalySystem.spawnBoxOrderAnomaly();


};

// Test function for Swaria dark void failure speech
window.testSwariaDarkVoidSpeech = function() {

    window.anomalySystem.showSwariaDarkVoidFailureSpeech();

};

// Test function for blurple light anomaly
window.testBlurpleLightAnomaly = function() {

    if (window.anomalySystem.activeAnomalies.blurpleLightAnomaly) {

        window.clearBlurpleLightAnomaly();
        setTimeout(() => {
            window.anomalySystem.spawnBlurpleLightAnomaly();
        }, 100);
    } else {
        window.anomalySystem.spawnBlurpleLightAnomaly();
    }
};

// Force test blurple light anomaly (for debugging)
window.forceTestBlurpleLightAnomaly = function() {

    // Clear any existing first
    window.clearBlurpleLightAnomaly();
    // Force spawn new one
    setTimeout(() => {
        window.anomalySystem.spawnBlurpleLightAnomaly();

    }, 100);
};

// Clear blurple light anomaly
window.clearBlurpleLightAnomaly = function() {

    window.anomalySystem.fixBlurpleLightAnomaly();

};

// Check blurple light anomaly status
window.checkBlurpleLightAnomalyStatus = function() {




};

// === BOX GENERATOR FREEZE ANOMALY FUNCTIONS ===

// Test box generator freeze anomaly
window.testBoxGeneratorFreezeAnomaly = function() {

    window.anomalySystem.spawnBoxGeneratorFreezeAnomaly();

};

// Force test box generator freeze anomaly  
window.forceTestBoxGeneratorFreezeAnomaly = function() {

    // Clear any existing first
    window.clearBoxGeneratorFreezeAnomaly();
    // Force spawn new one
    setTimeout(() => {
        window.anomalySystem.spawnBoxGeneratorFreezeAnomaly();

    }, 100);
};

// Clear box generator freeze anomaly
window.clearBoxGeneratorFreezeAnomaly = function() {

    window.anomalySystem.fixBoxGeneratorFreezeAnomaly();

};

// Check box generator freeze anomaly status
window.checkBoxGeneratorFreezeAnomalyStatus = function() {




};

// === LAB DARKNESS ANOMALY TEST FUNCTIONS ===

// Test lab darkness anomaly
window.testLabDarknessAnomaly = function() {

    window.anomalySystem.spawnLabDarknessAnomaly();

};

// Force test lab darkness anomaly  
window.forceTestLabDarknessAnomaly = function() {

    // Clear any existing first
    window.clearLabDarknessAnomaly();
    // Force spawn new one
    setTimeout(() => {
        window.anomalySystem.spawnLabDarknessAnomaly();

    }, 100);
};

// Clear lab darkness anomaly
window.clearLabDarknessAnomaly = function() {

    window.anomalySystem.fixLabDarknessAnomaly(true);

};

// Check lab darkness anomaly status
window.checkLabDarknessAnomalyStatus = function() {






};

// Force trigger lab darkness progression (for testing)
window.forceLabDarknessProgression = function() {

    if (window.anomalySystem.activeAnomalies.labDarknessAnomaly && window.anomalySystem.labDarknessPaused) {
        // Simulate lab tab click
        window.anomalySystem.labDarknessPaused = false;
        window.anomalySystem.labDarknessStartTime = Date.now();
        window.anomalySystem.createLabDarknessOverlay();
        window.anomalySystem.startLabDarknessProgression();
        window.anomalySystem.startViPanicDialogue();

    } else {

    }
};

// === PRISM GREY ANOMALY FUNCTIONS ===

// Prism Grey Anomaly - makes prism grid only spawn grey tiles that do nothing
window.anomalySystem.spawnPrismGreyAnomaly = function() {

    if (this.activeAnomalies.prismGreyAnomaly) return; // Already active
    
    this.activeAnomalies.prismGreyAnomaly = true;
    this.anomalies.push({
        id: this.nextId++,
        type: 'prismGrey',
        spawnTime: Date.now()
    });
    
    // Start the anomaly effect
    this.startPrismGreyAnomaly();
    
    // Save state to persist across refreshes
    this.saveAnomalyState();

};

window.anomalySystem.startPrismGreyAnomaly = function() {
    // Add CSS for grey tiles if it doesn't exist
    const existingStyle = document.getElementById('prismGreyAnomalyStyles');
    if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'prismGreyAnomalyStyles';
        style.textContent = `
            .grey-tile {
                background: #808080 !important;
                box-shadow: 0 0 10px 2px #808080;
                border: 2px solid #606060;
                position: relative;
                overflow: visible;
            }
            .grey-tile::before {
                content: '';
                position: absolute;
                top: 20px;
                left: 0px;
                width: 500px;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(-170deg);
                transform-origin: left center;
                pointer-events: none;
                z-index: 0.5;
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
            }
            .grey-tile::after {
                content: '';
                position: absolute;
                top: 20px;
                left: 20px;
                width: 500px;
                height: 3px;
                background: rgba(128, 128, 128, 1);
                transform: rotate(-45deg);
                transform-origin: left center;
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 0 10px rgba(128, 128, 128, 0.8);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set up prism detection if in Lab tab
    if (typeof window.currentTab !== 'undefined' && window.currentTab === 'Lab') {
        setTimeout(() => {
            this.setupPrismGreyDetection();
        }, 500);
    }
};

window.anomalySystem.setupPrismGreyDetection = function() {
    // Add click handler specifically for the prism card/grid area (like prism mirror)
    document.addEventListener('click', (event) => {
        if (!this.findModeActive || this.analyzing || !this.activeAnomalies.prismGreyAnomaly) return;
        
        // Check if clicked directly on the prism card elements
        const target = event.target;
        const lightGrid = document.getElementById('lightGrid');
        
        // Must click directly on the light grid or a light tile
        const isInLightGrid = lightGrid && lightGrid.contains(target);
        const isLightTile = target.classList && target.classList.contains('light-tile');
        const isLightGridItself = target === lightGrid;
        
        // Only trigger if clicking directly on the prism card area (light grid or tiles)
        if (isInLightGrid || isLightTile || isLightGridItself) {
            event.preventDefault();
            event.stopPropagation();
            this.analyzePrismGreyAnomaly(true);
        }
    }, true);
};

window.anomalySystem.analyzePrismGreyAnomaly = function(isTargetedClick = false) {
    if (this.analyzing || this.searching) return;
    
    this.analyzing = true;

    // Add cursor animation and analyzing class
    document.body.classList.add('anomaly-analyzing');
    this.startCursorAnimation();
    
    // Show analyzing feedback
    this.showAnalyzing();
    
    setTimeout(() => {
        this.analyzing = false;
        
        // Stop cursor animation and remove analyzing animation class, return to normal find mode cursor
        this.stopCursorAnimation();
        document.body.classList.remove('anomaly-analyzing');
        
        if (this.activeAnomalies.prismGreyAnomaly && isTargetedClick) {
            // Grey anomaly detected and clicked directly - fix it
            this.fixPrismGreyAnomaly();
        } else {
            // Either no anomaly OR anomaly detected but not clicked directly
            // In both cases, show "No anomaly detected" to not give away the location
            this.showNoAnomaly();
        }
    }, 3000);
};

window.anomalySystem.fixPrismGreyAnomaly = function() {

    this.activeAnomalies.prismGreyAnomaly = false;
    
    // Remove the anomaly from tracking array
    const anomalyIndex = this.anomalies.findIndex(a => a.type === 'prismGrey');
    if (anomalyIndex !== -1) {
        this.anomalies.splice(anomalyIndex, 1);
    }
    
    // Remove grey tile CSS
    const anomalyStyles = document.getElementById('prismGreyAnomalyStyles');
    if (anomalyStyles) {
        anomalyStyles.remove();
    }
    
    // Save state to persist across refreshes
    this.saveAnomalyState();
    
    // Give reward
    this.giveAnomalyReward();
    
    // Show proper anomaly fixed notification
    this.showAnomalyFixedNotification();
    
    // Automatically switch to Lab tab to show the restored normal light tiles
    setTimeout(() => {
        if (typeof switchHomeSubTab === 'function') {
            switchHomeSubTab('prismSubTab');

        }
    }, 1000); // Small delay to let the fixed notification show first

};

window.anomalySystem.restorePrismGreyAnomaly = function(savedAnomaly) {

    // Restore the anomaly state
    this.activeAnomalies.prismGreyAnomaly = true;
    this.anomalies.push(savedAnomaly);
    
    // Restart the anomaly effect
    this.startPrismGreyAnomaly();

};

// Test functions for prism grey anomaly
window.testPrismGreyAnomaly = function() {

    window.anomalySystem.spawnPrismGreyAnomaly();

};

window.clearPrismGreyAnomaly = function() {

    window.anomalySystem.fixPrismGreyAnomaly();

};

window.checkPrismGreyAnomalyStatus = function() {



};

// === NOTATION SCRAMBLE ANOMALY FUNCTIONS ===

// Notation Scramble Anomaly - changes the game's notation to a random one and disables manual changes
window.anomalySystem.spawnNotationScrambleAnomaly = function() {

    if (this.activeAnomalies.notationScrambleAnomaly) return; // Already active
    
    this.activeAnomalies.notationScrambleAnomaly = true;
    this.anomalies.push({
        id: this.nextId++,
        type: 'notationScramble',
        spawnTime: Date.now()
    });
    
    // Start the anomaly effect
    this.startNotationScrambleAnomaly();
    
    // Save state to persist across refreshes
    this.saveAnomalyState();

};

window.anomalySystem.startNotationScrambleAnomaly = function() {
    // Store the current notation setting
    const currentNotation = localStorage.getItem('notationPreference') || 'numeral';
    this.originalNotation = currentNotation;
    
    // Available notations to scramble to
    const availableNotations = ['numeral', 'scientific', 'engineering', 'cancer', 'zalgo'];
    
    // Remove the current notation from the available options
    const scrambleOptions = availableNotations.filter(notation => notation !== currentNotation);
    
    // Pick a random notation from the remaining options
    const scrambledNotation = scrambleOptions[Math.floor(Math.random() * scrambleOptions.length)];
    this.scrambledNotation = scrambledNotation;
    
    // Apply the scrambled notation
    localStorage.setItem('notationPreference', scrambledNotation);
    if (window.settings) {
        window.settings.notation = scrambledNotation;
    }
    
    // Update the dropdown to show "Anomalous (Nuh uh)" and disable it
    const notationSelect = document.getElementById('notationSelect');
    if (notationSelect) {
        // Store the original options
        this.originalNotationOptions = notationSelect.innerHTML;
        
        // Replace with anomalous option
        notationSelect.innerHTML = '<option value="anomalous">Anomalous (Nuh uh)</option>';
        notationSelect.value = 'anomalous';
        notationSelect.disabled = true;
        
        // Add visual styling to indicate it's locked
        notationSelect.style.backgroundColor = '#ffcccc';
        notationSelect.style.color = '#cc0000';
        notationSelect.style.cursor = 'not-allowed';
    }
    
    // Set up detection for both notation dropdown and number displays
    this.setupNotationScrambleDetection();
    
    // Update the UI to show the new notation
    if (typeof window.updateUI === 'function') {
        window.updateUI();
    }
};

window.anomalySystem.analyzeNotationScrambleAnomaly = function(isTargetedClick = false) {
    if (this.analyzing || this.searching) return;
    
    this.analyzing = true;

    // Add cursor animation and analyzing class
    document.body.classList.add('anomaly-analyzing');
    this.startCursorAnimation();
    
    // Show analyzing feedback
    this.showAnalyzing();
    
    setTimeout(() => {
        this.analyzing = false;
        document.body.classList.remove('anomaly-analyzing');
        this.stopCursorAnimation();
        
        // Higher chance of detection if it was a targeted click on the notation dropdown
        const detectionChance = isTargetedClick ? 0.9 : 0.7;
        
        if (Math.random() < detectionChance) {

            this.fixNotationScrambleAnomaly();
        } else {

            this.showNoAnomaly();
        }
    }, 3000);
};

window.anomalySystem.fixNotationScrambleAnomaly = function() {

    this.activeAnomalies.notationScrambleAnomaly = false;
    
    // Remove the anomaly from tracking array
    const anomalyIndex = this.anomalies.findIndex(a => a.type === 'notationScramble');
    if (anomalyIndex !== -1) {
        this.anomalies.splice(anomalyIndex, 1);
    }
    
    // Restore the original notation
    if (this.originalNotation) {
        localStorage.setItem('notationPreference', this.originalNotation);
        if (window.settings) {
            window.settings.notation = this.originalNotation;
        }
    }
    
    // Restore the notation dropdown
    const notationSelect = document.getElementById('notationSelect');
    if (notationSelect && this.originalNotationOptions) {
        // Restore original options
        notationSelect.innerHTML = this.originalNotationOptions;
        notationSelect.value = this.originalNotation || 'numeral';
        notationSelect.disabled = false;
        
        // Remove visual styling
        notationSelect.style.backgroundColor = '';
        notationSelect.style.color = '';
        notationSelect.style.cursor = '';
    }
    
    // Clean up stored values
    this.originalNotation = null;
    this.scrambledNotation = null;
    this.originalNotationOptions = null;
    
    // Save state to persist across refreshes
    this.saveAnomalyState();
    
    // Give reward
    this.giveAnomalyReward();
    
    // Show proper anomaly fixed notification
    this.showAnomalyFixedNotification();
    
    // Update the UI to show the restored notation
    if (typeof window.updateUI === 'function') {
        setTimeout(() => {
            window.updateUI();
        }, 100);
    }

};

window.anomalySystem.restoreNotationScrambleAnomaly = function(savedAnomaly) {

    // Restore the anomaly state
    this.activeAnomalies.notationScrambleAnomaly = true;
    this.anomalies.push(savedAnomaly);
    
    // Restart the anomaly effect
    this.startNotationScrambleAnomaly();

};

// Test functions for notation scramble anomaly
window.testNotationScrambleAnomaly = function() {

    window.anomalySystem.spawnNotationScrambleAnomaly();

};

window.clearNotationScrambleAnomaly = function() {

    window.anomalySystem.fixNotationScrambleAnomaly();

};

window.checkNotationScrambleAnomalyStatus = function() {





};

// === CRAB BUCKS ANOMALY FUNCTIONS ===

// Crab Bucks Anomaly - changes Swa Bucks icon to crab emoji in boutique
window.anomalySystem.spawnCrabBucksAnomaly = function() {

    // Check if another crab bucks anomaly is already active
    if (this.activeAnomalies.crabBucksAnomaly) {

        return;
    }
    
    // If shop price anomaly is active, fix it first to prevent coexistence
    if (this.activeAnomalies.shopPriceAnomaly) {
        this.fixShopPriceAnomaly();
    }
    
    // Create anomaly data
    const anomaly = {
        id: this.nextId++,
        type: 'crabBucks',
        spawnTime: Date.now()
    };
    
    // Add to anomalies list and mark as active
    this.anomalies.push(anomaly);
    this.activeAnomalies.crabBucksAnomaly = true;
    
    // Start the anomaly effect
    this.startCrabBucksAnomaly();
    
    // Save state
    this.saveAnomalyState();

};

window.anomalySystem.startCrabBucksAnomaly = function() {

    // Store original icon source if not already stored
    if (!this.originalSwaBucksIcon) {
        this.originalSwaBucksIcon = 'assets/icons/swa buck.png';
    }
    
    // Replace all Swa Bucks icons with crab emoji
    this.replaceSwaIconsWithCrab();
    
    // Set up detection for boutique UI updates
    this.setupCrabBucksDetection();

};

window.anomalySystem.replaceSwaIconsWithCrab = function() {
    // Find all Swa Bucks icons in the boutique and replace them
    const swaBucksIcons = document.querySelectorAll('img[src*="swa buck.png"], img[alt="Swa Bucks"]');
    
    swaBucksIcons.forEach(icon => {
        // Store original src if not already marked
        if (!icon.hasAttribute('data-crab-anomaly-original')) {
            icon.setAttribute('data-crab-anomaly-original', icon.src);
        }
        
        // Replace with crab emoji using a data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 24;
        canvas.height = 24;
        
        // Set font and draw crab emoji
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦀', 12, 12);
        
        // Convert to data URL and set as src
        icon.src = canvas.toDataURL();
        icon.setAttribute('data-crab-anomaly-active', 'true');
    });

};

window.anomalySystem.setupCrabBucksDetection = function() {
    // Set up mutation observer to catch new boutique UI updates
    if (this.crabBucksMutationObserver) {
        this.crabBucksMutationObserver.disconnect();
    }
    
    this.crabBucksMutationObserver = new MutationObserver((mutations) => {
        if (!this.activeAnomalies.crabBucksAnomaly) return;
        
        let shouldReplace = false;
        mutations.forEach(mutation => {
            // Check if new nodes were added that might contain Swa Bucks icons
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if this node or its children contain Swa Bucks icons
                        const hasSwaBucksIcons = node.querySelector && (
                            node.querySelector('img[src*="swa buck.png"]') ||
                            node.querySelector('img[alt="Swa Bucks"]') ||
                            (node.tagName === 'IMG' && (node.src.includes('swa buck.png') || node.alt === 'Swa Bucks'))
                        );
                        
                        if (hasSwaBucksIcons) {
                            shouldReplace = true;
                        }
                    }
                });
            }
        });
        
        if (shouldReplace) {
            // Small delay to let the DOM settle
            setTimeout(() => {
                this.replaceSwaIconsWithCrab();
            }, 50);
        }
    });
    
    // Observe the entire document for changes
    this.crabBucksMutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also set up click detection for boutique-related elements
    document.addEventListener('click', this.crabBucksClickHandler = (event) => {
        if (!this.activeAnomalies.crabBucksAnomaly || !this.findModeActive) return;
        
        const target = event.target;

        // Check if clicked element is a crab emoji (our anomaly indicator)
        if (target.textContent === '🦀' || target.dataset.crabAnomalyActive === 'true') {

            event.preventDefault();
            event.stopPropagation();
            this.analyzeCrabBucksAnomaly(true);
            return;
        }
        
        // Check if clicked on a shop card (token card in boutique)
        const shopCard = target.closest('.shop-item-card, .token-card, .boutique-item');
        if (shopCard) {

            // Verify we're in the boutique by checking for boutique-specific elements
            const boutiqueContainer = target.closest('#boutiqueContent, .boutique-container, [data-tab="boutique"]');
            if (boutiqueContainer) {

                event.preventDefault();
                event.stopPropagation();
                this.analyzeCrabBucksAnomaly(true);
                return;
            }
        }
        
        // Also check for cards with cyan background (based on the image showing shop cards)
        const cardElement = target.closest('div[style*="background"], .card, [class*="card"]');
        if (cardElement) {

            const computedStyle = window.getComputedStyle(cardElement);
            const backgroundColor = computedStyle.backgroundColor;
            
            // Check if it's a cyan/turquoise colored card (typical of shop items)
            if (backgroundColor.includes('rgb(0, 191, 243)') || 
                backgroundColor.includes('cyan') || 
                backgroundColor.includes('turquoise') ||
                cardElement.style.backgroundColor.includes('rgb(0, 191, 243)')) {

                // Double-check we're in boutique context
                const boutiqueContext = target.closest('#boutiqueContent, .boutique-container, [data-tab="boutique"]') ||
                                      document.querySelector('#boutiqueContent:not([style*="display: none"])');
                
                if (boutiqueContext) {

                    event.preventDefault();
                    event.stopPropagation();
                    this.analyzeCrabBucksAnomaly(true);
                    return;
                }
            }
        }
        
        // Check if we clicked anywhere in the boutique area
        const boutiqueArea = target.closest('#boutiqueContent, .boutique-container, [data-tab="boutique"]');
        if (boutiqueArea) {

            event.preventDefault();
            event.stopPropagation();
            this.analyzeCrabBucksAnomaly(true);
            return;
        }
    }, true);

};

window.anomalySystem.analyzeCrabBucksAnomaly = function(isTargetedClick = false) {
    if (this.analyzing || this.searching) return;
    
    this.analyzing = true;

    // Add cursor animation and analyzing class
    document.body.classList.add('anomaly-analyzing');
    this.startCursorAnimation();
    
    // Show analyzing feedback
    this.showAnalyzing();
    
    setTimeout(() => {
        this.analyzing = false;
        
        // Stop cursor animation and remove analyzing animation class
        this.stopCursorAnimation();
        document.body.classList.remove('anomaly-analyzing');
        
        if (this.activeAnomalies.crabBucksAnomaly && isTargetedClick) {
            // Anomaly detected and clicked directly - fix it
            this.fixCrabBucksAnomaly();
        } else {
            // Either no anomaly OR anomaly detected but not clicked directly
            this.showNoAnomaly();
        }
    }, 3000);
};

window.anomalySystem.fixCrabBucksAnomaly = function() {

    // Restore original Swa Bucks icons
    this.restoreOriginalSwaIcons();
    
    // Clean up detection
    if (this.crabBucksMutationObserver) {
        this.crabBucksMutationObserver.disconnect();
        this.crabBucksMutationObserver = null;
    }
    
    if (this.crabBucksClickHandler) {
        document.removeEventListener('click', this.crabBucksClickHandler, true);
        this.crabBucksClickHandler = null;
    }
    
    // Remove from anomalies list
    this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'crabBucks');
    this.activeAnomalies.crabBucksAnomaly = false;
    
    // Clear stored original icon
    this.originalSwaBucksIcon = null;
    
    // Save state
    this.saveAnomalyState();
    
    // Give reward
    this.giveAnomalyReward();
    
    // Show proper anomaly fixed notification
    this.showAnomalyFixedNotification();

};

window.anomalySystem.restoreOriginalSwaIcons = function() {
    // Find all icons marked as crab anomaly and restore them
    const crabIcons = document.querySelectorAll('img[data-crab-anomaly-active="true"]');
    
    crabIcons.forEach(icon => {
        const originalSrc = icon.getAttribute('data-crab-anomaly-original');
        if (originalSrc) {
            icon.src = originalSrc;
        } else {
            // Fallback to default Swa Bucks icon
            icon.src = 'assets/icons/swa buck.png';
        }
        
        // Remove anomaly attributes
        icon.removeAttribute('data-crab-anomaly-active');
        icon.removeAttribute('data-crab-anomaly-original');
    });

};

window.anomalySystem.restoreCrabBucksAnomaly = function(savedAnomaly) {

    // If shop price anomaly is active, fix it first to prevent coexistence
    if (this.activeAnomalies.shopPriceAnomaly) {
        this.fixShopPriceAnomaly();
    }

    // Restore the anomaly state
    this.activeAnomalies.crabBucksAnomaly = true;
    this.anomalies.push(savedAnomaly);
    
    // Restart the anomaly effect
    this.startCrabBucksAnomaly();

};

// === RUSTLING FLOWERS ANOMALY FUNCTIONS ===

// Rustling Flowers Anomaly - makes all flower cells become rustling flowers that give no tokens
window.anomalySystem.spawnRustlingFlowersAnomaly = function() {

    // Check if another rustling flowers anomaly is already active
    if (this.activeAnomalies.rustlingFlowersAnomaly) {

        return;
    }
    
    // Mutual exclusion: Clear fluzzer flip anomaly if active
    if (this.activeAnomalies.fluzzerFlipAnomaly) {

        this.fixFluzzerFlipAnomaly();
    }
    
    // Create anomaly data
    const anomaly = {
        id: this.nextId++,
        type: 'rustlingFlowers',
        spawnTime: Date.now()
    };
    
    // Add to anomalies list and mark as active
    this.anomalies.push(anomaly);
    this.activeAnomalies.rustlingFlowersAnomaly = true;
    
    // Start the anomaly effect
    this.startRustlingFlowersAnomaly();
    
    // Save state
    this.saveAnomalyState();

};

window.anomalySystem.startRustlingFlowersAnomaly = function() {

    // Store original flower grid state if not already stored
    this.storeOriginalFlowerGrid();
    
    // Store and disable the normal rustling flower timer to bypass the 5-flower limit
    this.disableNormalRustlingSystem();
    
    // Convert all flower cells to rustling flowers
    this.convertAllFlowersToRustling();
    
    // Set up detection for terrarium interactions
    this.setupRustlingFlowersDetection();
    
    // Hook the fluzzerSay function for special rustling flowers dialogue
    this.hookFluzzerSayFunction();

};

window.anomalySystem.storeOriginalFlowerGrid = function() {
    if (this.originalFlowerGrid) return; // Already stored
    
    // Store the current flower grid state
    if (window.terrariumFlowerGrid && Array.isArray(window.terrariumFlowerGrid)) {
        this.originalFlowerGrid = [...window.terrariumFlowerGrid];

    }
    
    // Also store the original rustling flower indices
    if (window.rustlingFlowerIndices && Array.isArray(window.rustlingFlowerIndices)) {
        this.originalRustlingFlowerIndices = [...window.rustlingFlowerIndices];

    }
};

window.anomalySystem.disableNormalRustlingSystem = function() {

    // Store the original rustling timer and clear it
    if (window.rustlingFlowerTimer) {
        this.originalRustlingFlowerTimer = window.rustlingFlowerTimer;
        clearInterval(window.rustlingFlowerTimer);
        window.rustlingFlowerTimer = null;

    }
    
    // Store original startRustlingFlowerTimer function and replace it with a no-op during anomaly
    if (typeof window.startRustlingFlowerTimer === 'function') {
        this.originalStartRustlingFlowerTimer = window.startRustlingFlowerTimer;
        window.startRustlingFlowerTimer = function() {
            // Do nothing during rustling flowers anomaly

        };

    }
};

window.anomalySystem.startContinuousRustlingAnimation = function() {

    // Clear any existing anomaly rustling timer
    if (this.anomalyRustlingTimer) {
        clearInterval(this.anomalyRustlingTimer);
    }
    
    // Create a timer that continuously reapplies rustling CSS classes
    this.anomalyRustlingTimer = setInterval(() => {
        if (!this.activeAnomalies.rustlingFlowersAnomaly) {
            // Anomaly no longer active, stop the timer
            clearInterval(this.anomalyRustlingTimer);
            this.anomalyRustlingTimer = null;
            return;
        }
        
        // Ensure all flowers in rustlingFlowerIndices have the rustling CSS class
        if (window.rustlingFlowerIndices && Array.isArray(window.rustlingFlowerIndices)) {
            let reappliedCount = 0;
            window.rustlingFlowerIndices.forEach(idx => {
                const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
                if (cell && !cell.classList.contains('terrarium-flower-rustle')) {
                    cell.classList.add('terrarium-flower-rustle');
                    reappliedCount++;
                }
            });
            
            // Also check for general flower cells without data-idx
            const allFlowerCells = document.querySelectorAll('.terrarium-flower-cell');
            allFlowerCells.forEach(cell => {
                if (!cell.classList.contains('terrarium-flower-rustle')) {
                    cell.classList.add('terrarium-flower-rustle');
                    reappliedCount++;
                }
            });
            
            if (reappliedCount > 0) {

            }
        }
    }, 500); // Check every 500ms to maintain animation

};

window.anomalySystem.convertAllFlowersToRustling = function() {

    // Ensure the required arrays exist and are accessible
    if (!window.terrariumFlowerGrid) {

        // Initialize with a basic grid if it doesn't exist
        const gridSize = 100; // Default size
        window.terrariumFlowerGrid = new Array(gridSize).fill(null);
        
        // Fill with some flowers for testing
        for (let i = 0; i < gridSize; i++) {
            if (Math.random() < 0.6) { // 60% chance of having a flower
                window.terrariumFlowerGrid[i] = { health: 100 }; // Basic flower object
            }
        }

    }
    
    if (!window.rustlingFlowerIndices) {

        window.rustlingFlowerIndices = [];
    }
    
    // Make all flower cells rustling by using the rustlingFlowerIndices system
    if (window.terrariumFlowerGrid && Array.isArray(window.terrariumFlowerGrid) && 
        window.rustlingFlowerIndices && Array.isArray(window.rustlingFlowerIndices)) {



        // Clear existing rustling flowers first
        window.rustlingFlowerIndices.length = 0;
        
        // Add all non-null flower indices to rustling list
        for (let i = 0; i < window.terrariumFlowerGrid.length; i++) {
            if (window.terrariumFlowerGrid[i] !== null) {
                window.rustlingFlowerIndices.push(i);
            }
        }

        // Force update the terrarium UI to show the rustling flowers
        if (typeof window.updateFlowerGridOnly === 'function') {

            window.updateFlowerGridOnly();
        } else if (typeof window.renderTerrariumUI === 'function') {

            window.renderTerrariumUI();
        }
        
        // Also manually apply the rustling CSS classes to ensure they show up
        setTimeout(() => {

            let appliedCount = 0;
            window.rustlingFlowerIndices.forEach(idx => {
                const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
                if (cell) {
                    cell.classList.add('terrarium-flower-rustle');
                    appliedCount++;
                } else {

                }
            });

            // Also check for any flower cells without the data-idx attribute
            const allFlowerCells = document.querySelectorAll('.terrarium-flower-cell');

            // If no flower cells with data-idx, try a more general approach
            if (appliedCount === 0 && allFlowerCells.length > 0) {

                allFlowerCells.forEach(cell => {
                    cell.classList.add('terrarium-flower-rustle');
                });

            }
        }, 100); // Small delay to ensure DOM is updated
        
        // Set up continuous rustling animation management for anomaly
        this.startContinuousRustlingAnimation();

    } else {



    }
};

window.anomalySystem.setupRustlingFlowersDetection = function() {
    // Set up click detection for flower cells and terrarium elements
    const self = this;
    document.addEventListener('click', this.rustlingFlowersClickHandler = function(event) {
        // Check if find mode is active
        if (!self.findModeActive) return;
        
        // Check if clicked on a flower cell or terrarium area
        const target = event.target;
        const isFlowerCell = target.classList.contains('flower-cell') || 
                           target.closest('.flower-cell') ||
                           target.classList.contains('terrarium-flower-grid') ||
                           target.closest('.terrarium-flower-grid') ||
                           target.classList.contains('terrarium-flower-cell') ||
                           target.closest('.terrarium-flower-cell') ||
                           target.id === 'terrariumFlowerGrid' ||
                           target.closest('#terrariumFlowerGrid');
        
        if (isFlowerCell) {

            self.analyzeRustlingFlowersAnomaly(true);
        }
    }, true);

};

window.anomalySystem.analyzeRustlingFlowersAnomaly = function(isTargetedClick = false) {
    if (this.analyzing || this.searching) return;
    
    this.analyzing = true;

    // Add cursor animation and analyzing class
    document.body.classList.add('anomaly-analyzing');
    this.startCursorAnimation();
    
    // Show analyzing feedback
    this.showAnalyzing();
    
    setTimeout(() => {
        this.analyzing = false;
        
        // Stop cursor animation and remove analyzing animation class
        this.stopCursorAnimation();
        document.body.classList.remove('anomaly-analyzing');
        
        if (this.activeAnomalies.rustlingFlowersAnomaly && isTargetedClick) {

            this.fixRustlingFlowersAnomaly();
        } else {

        }
    }, 3000);
};

window.anomalySystem.fixRustlingFlowersAnomaly = function() {

    // Stop the continuous rustling animation timer
    if (this.anomalyRustlingTimer) {
        clearInterval(this.anomalyRustlingTimer);
        this.anomalyRustlingTimer = null;

    }
    
    // Restore the original flower grid
    this.restoreOriginalFlowerGrid();
    
    // Restore the normal rustling system
    this.restoreNormalRustlingSystem();
    
    // Clean up detection
    if (this.rustlingFlowersClickHandler) {
        document.removeEventListener('click', this.rustlingFlowersClickHandler, true);
        this.rustlingFlowersClickHandler = null;
    }
    
    // Remove from anomalies list
    this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'rustlingFlowers');
    this.activeAnomalies.rustlingFlowersAnomaly = false;
    
    // Clear stored original data
    this.originalFlowerGrid = null;
    this.originalRustlingFlowerIndices = null;
    this.originalRustlingFlowerTimer = null;
    this.originalStartRustlingFlowerTimer = null;
    
    // Save state
    this.saveAnomalyState();
    
    // Give reward
    this.giveAnomalyReward();
    
    // Show proper anomaly fixed notification
    this.showAnomalyFixedNotification();
    
    // Trigger special "anomaly fixed" dialogue from Fluzzer
    this.triggerRustlingFlowersAnomalyFixedDialogue();

};

window.anomalySystem.restoreOriginalFlowerGrid = function() {
    if (window.rustlingFlowerIndices && Array.isArray(window.rustlingFlowerIndices)) {
        // First, remove rustling CSS classes from all current rustling flowers
        window.rustlingFlowerIndices.forEach(idx => {
            const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
            if (cell) {
                cell.classList.remove('terrarium-flower-rustle');
            }
        });
        
        // Restore the original rustling flower indices
        if (this.originalRustlingFlowerIndices && Array.isArray(this.originalRustlingFlowerIndices)) {
            window.rustlingFlowerIndices.length = 0;
            window.rustlingFlowerIndices.push(...this.originalRustlingFlowerIndices);
            
            // Apply rustling classes to the original rustling flowers
            this.originalRustlingFlowerIndices.forEach(idx => {
                const cell = document.querySelector(`.terrarium-flower-cell[data-idx='${idx}']`);
                if (cell) {
                    cell.classList.add('terrarium-flower-rustle');
                }
            });

        } else {
            // If no original rustling indices were stored, clear all rustling flowers
            window.rustlingFlowerIndices.length = 0;

        }
        
        // Force update the terrarium UI to show the restored flowers
        if (typeof window.updateFlowerGridOnly === 'function') {
            window.updateFlowerGridOnly();
        } else if (typeof window.renderTerrariumUI === 'function') {
            window.renderTerrariumUI();
        }

    }
};

window.anomalySystem.restoreNormalRustlingSystem = function() {

    // Restore the original startRustlingFlowerTimer function
    if (this.originalStartRustlingFlowerTimer) {
        window.startRustlingFlowerTimer = this.originalStartRustlingFlowerTimer;

    }
    
    // Restart the normal rustling flower timer
    if (typeof window.startRustlingFlowerTimer === 'function') {
        window.startRustlingFlowerTimer();

    }
};

window.anomalySystem.restoreRustlingFlowersAnomaly = function(savedAnomaly) {

    // Restore the anomaly state
    this.activeAnomalies.rustlingFlowersAnomaly = true;
    this.anomalies.push(savedAnomaly);
    
    // Restart the anomaly effect
    this.startRustlingFlowersAnomaly();

};

// === FLUZZER FLIP ANOMALY FUNCTIONS ===

// Fluzzer Flip Anomaly - flips Fluzzer character and cursor images upside down
window.anomalySystem.spawnFluzzerFlipAnomaly = function() {

    // Check if another fluzzer flip anomaly is already active
    if (this.activeAnomalies.fluzzerFlipAnomaly) {

        return;
    }
    
    // Mutual exclusion: Clear rustling flowers anomaly if active
    if (this.activeAnomalies.rustlingFlowersAnomaly) {

        this.fixRustlingFlowersAnomaly();
    }
    
    // Create anomaly data
    const anomaly = {
        id: this.nextId++,
        type: 'fluzzerFlip',
        spawnTime: Date.now()
    };
    
    // Add to anomalies list and mark as active
    this.anomalies.push(anomaly);
    this.activeAnomalies.fluzzerFlipAnomaly = true;
    
    // Start the anomaly effect
    this.startFluzzerFlipAnomaly();
    
    // Save state
    this.saveAnomalyState();

};

window.anomalySystem.startFluzzerFlipAnomaly = function() {

    // Add CSS to flip all Fluzzer-related images
    this.addFluzzerFlipStyles();
    
    // Apply the flip effect to existing Fluzzer images
    this.flipExistingFluzzerImages();
    
    // Set up detection for new Fluzzer elements
    this.setupFluzzerFlipDetection();
    
    // Hook the fluzzerSay function to flip dialogue text
    this.hookFluzzerSayFunction();

};

window.anomalySystem.addFluzzerFlipStyles = function() {
    // Add CSS to flip Fluzzer images
    if (!document.getElementById('fluzzerFlipAnomalyStyles')) {
        const style = document.createElement('style');
        style.id = 'fluzzerFlipAnomalyStyles';
        style.textContent = `
            /* Flip all Fluzzer character images vertically only - be very specific */
            img[src*="fluzzer.png"], 
            img[src*="fluzzer talking.png"],
            img[src*="fluzzer sleeping.png"],
            img[src*="fluzzer sleep talking.png"],
            img[alt*="Fluzzer"],
            img[alt*="fluzzer"] {
                transform: scaleY(-1) !important;
                transition: transform 0.3s ease !important;
            }
            
            /* Flip the Fluzzer AI cursor vertically only */
            #fluzzerAICursor {
                transform: scaleY(-1) !important;
                transition: transform 0.3s ease !important;
            }
            
            /* Flip any character portraits/images that might be Fluzzer */
            .character-portrait img[src*="fluzzer"],
            .character-image img[src*="fluzzer"],
            .fluzzer-character,
            .character-fluzzer {
                transform: scaleY(-1) !important;
                transition: transform 0.3s ease !important;
            }
            
            /* Flip any elements with fluzzer in their class or data attributes */
            [class*="fluzzer"] img,
            [data-character="fluzzer"] img {
                transform: scaleY(-1) !important;
                transition: transform 0.3s ease !important;
            }
            
            /* Flip dialogue text upside down when Fluzzer flip anomaly is active */
            .fluzzer-flip-dialogue {
                transform: scaleY(-1) !important;
                display: inline-block !important;
                transition: transform 0.3s ease !important;
            }
            
            /* Add a subtle glow effect to indicate the anomaly */
            img[src*="fluzzer"]:not([data-fluzzer-flip-processed]) {
                box-shadow: 0 0 10px rgba(255, 100, 255, 0.5) !important;
            }
            
            /* Make sure the cursor maintains its functionality while flipped */
            #fluzzerAICursor {
                transform-origin: center center !important;
            }
        `;
        document.head.appendChild(style);
    }
};

window.anomalySystem.flipExistingFluzzerImages = function() {
    // Find all existing Fluzzer images and mark them as processed
    const fluzzerImages = document.querySelectorAll(`
        img[src*="fluzzer.png"], 
        img[src*="fluzzer talking.png"],
        img[src*="fluzzer sleeping.png"], 
        img[src*="fluzzer sleep talking.png"],
        img[alt*="Fluzzer"], 
        img[alt*="fluzzer"]
    `);
    
    fluzzerImages.forEach(img => {
        img.setAttribute('data-fluzzer-flip-processed', 'true');
        img.setAttribute('data-fluzzer-flip-anomaly', 'true');
    });
    
    // Also flip the Fluzzer AI cursor if it exists
    const fluzzerCursor = document.getElementById('fluzzerAICursor');
    if (fluzzerCursor) {
        fluzzerCursor.setAttribute('data-fluzzer-flip-anomaly', 'true');

    }

};

window.anomalySystem.setupFluzzerFlipDetection = function() {
    // Set up mutation observer to catch new Fluzzer images
    if (this.fluzzerFlipMutationObserver) {
        this.fluzzerFlipMutationObserver.disconnect();
    }
    
    this.fluzzerFlipMutationObserver = new MutationObserver((mutations) => {
        if (!this.activeAnomalies.fluzzerFlipAnomaly) return;
        
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the new node is the Fluzzer AI cursor
                    if (node.id === 'fluzzerAICursor') {
                        node.setAttribute('data-fluzzer-flip-anomaly', 'true');

                    }
                    
                    // Check if the new node is a Fluzzer image
                    const fluzzerImages = node.querySelectorAll ? 
                        node.querySelectorAll(`
                            img[src*="fluzzer.png"], 
                            img[src*="fluzzer talking.png"],
                            img[src*="fluzzer sleeping.png"], 
                            img[src*="fluzzer sleep talking.png"],
                            img[alt*="Fluzzer"], 
                            img[alt*="fluzzer"]
                        `) : [];
                    
                    // Also check if the node itself is a Fluzzer image
                    if (node.tagName === 'IMG' && 
                        (node.src.includes('fluzzer') || node.alt.includes('Fluzzer') || node.alt.includes('fluzzer'))) {
                        node.setAttribute('data-fluzzer-flip-processed', 'true');
                        node.setAttribute('data-fluzzer-flip-anomaly', 'true');
                    }
                    
                    // Process found Fluzzer images
                    fluzzerImages.forEach(img => {
                        img.setAttribute('data-fluzzer-flip-processed', 'true');
                        img.setAttribute('data-fluzzer-flip-anomaly', 'true');
                    });
                    
                    // Check for Fluzzer AI cursor inside the new node
                    const cursor = node.querySelector ? node.querySelector('#fluzzerAICursor') : null;
                    if (cursor) {
                        cursor.setAttribute('data-fluzzer-flip-anomaly', 'true');

                    }
                }
            });
        });
    });
    
    // Observe the entire document for changes
    this.fluzzerFlipMutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Set up click detection for Fluzzer elements
    document.addEventListener('click', this.fluzzerFlipClickHandler = (event) => {
        if (!this.activeAnomalies.fluzzerFlipAnomaly || !this.findModeActive) return;
        
        const target = event.target;
        
        // Check if clicked on the Fluzzer AI cursor
        if (target.id === 'fluzzerAICursor' || target.closest('#fluzzerAICursor')) {

            event.preventDefault();
            event.stopPropagation();
            this.analyzeFluzzerFlipAnomaly(true);
            return;
        }
        
        // Check if clicked on a flipped Fluzzer image
        if (target.tagName === 'IMG' && 
            (target.src.includes('fluzzer') || target.alt.includes('Fluzzer') || target.alt.includes('fluzzer')) &&
            target.hasAttribute('data-fluzzer-flip-anomaly')) {

            event.preventDefault();
            event.stopPropagation();
            this.analyzeFluzzerFlipAnomaly(true);
            return;
        }
        
        // Check if clicked on any element with Fluzzer-related classes
        const fluzzerElement = target.closest('[class*="fluzzer"], [data-character="fluzzer"]');
        if (fluzzerElement) {

            event.preventDefault();
            event.stopPropagation();
            this.analyzeFluzzerFlipAnomaly(true);
            return;
        }
    }, true);

};

window.anomalySystem.hookAllCharacterDialogue = function() {

    // Store original fluzzerSay function
    if (!this.originalFluzzerSay && typeof window.fluzzerSay === 'function') {
        this.originalFluzzerSay = window.fluzzerSay;

    }
    
    // Store original getRandomFluzzerSpeech function
    if (!this.originalGetRandomFluzzerSpeech && typeof window.getRandomFluzzerSpeech === 'function') {
        this.originalGetRandomFluzzerSpeech = window.getRandomFluzzerSpeech;

        // Override getRandomFluzzerSpeech for anomaly dialogue
        window.getRandomFluzzerSpeech = () => {
            if (this.activeAnomalies.fluzzerFlipAnomaly) {
                return this.getFluzzerFlipAnomalyDialogue();
            } else if (this.activeAnomalies.rustlingFlowersAnomaly) {
                return this.getRustlingFlowersAnomalyDialogue();
            } else if (this.activeAnomalies.dramaticWindAnomaly) {
                return this.getDramaticWindAnomalyDialogue();
            } else {
                return this.originalGetRandomFluzzerSpeech();
            }
        };
    }
    
    // Store original showSwariaSpeech function
    if (!this.originalShowSwariaSpeech && typeof window.showSwariaSpeech === 'function') {
        this.originalShowSwariaSpeech = window.showSwariaSpeech;

        window.showSwariaSpeech = () => {
            if (this.activeAnomalies.dramaticWindAnomaly) {
                const windDialogue = this.getDramaticWindAnomalyDialogue();
                const swariaEl = document.getElementById('swariaSpeech');
                const swariaImg = document.getElementById('swariaCharacter');
                if (swariaEl) {
                    swariaEl.textContent = windDialogue;
                    swariaEl.style.display = 'block';
                    
                    // Change to talking image
                    if (swariaImg) {
                        if (typeof window.getMainCargoCharacterImage === 'function') {
                            swariaImg.src = window.getMainCargoCharacterImage(true);
                        } else {
                            swariaImg.src = "swa talking.png";
                        }
                    }
                    
                    setTimeout(() => {
                        swariaEl.style.display = 'none';
                        
                        // Change back to normal image
                        if (swariaImg) {
                            if (typeof window.getMainCargoCharacterImage === 'function') {
                                swariaImg.src = window.getMainCargoCharacterImage(false);
                            } else {
                                swariaImg.src = "swa normal.png";
                            }
                        }
                    }, 5000);
                }
            } else {
                this.originalShowSwariaSpeech();
            }
        };
    }
    
    // Store original showSoapSpeech function
    if (!this.originalShowSoapSpeech && typeof window.showSoapSpeech === 'function') {
        this.originalShowSoapSpeech = window.showSoapSpeech;

        window.showSoapSpeech = () => {
            if (this.activeAnomalies.dramaticWindAnomaly) {
                const windDialogue = this.getDramaticWindAnomalyDialogue();
                const soapEl = document.getElementById('swariaGeneratorSpeech');
                if (soapEl) {
                    soapEl.textContent = windDialogue;
                    soapEl.style.display = 'block';
                    const soapImg = document.getElementById('swariaGeneratorCharacter');
                    if (soapImg) soapImg.src = 'assets/icons/soap speech.png';
                    setTimeout(() => {
                        soapEl.style.display = 'none';
                        if (soapImg) soapImg.src = 'assets/icons/soap.png';
                    }, 5000);
                }
            } else {
                this.originalShowSoapSpeech();
            }
        };
    }
    
    // Store original showCharacterSpeech function
    if (!this.originalShowCharacterSpeech && typeof window.showCharacterSpeech === 'function') {
        this.originalShowCharacterSpeech = window.showCharacterSpeech;

        window.showCharacterSpeech = (characterName, tokenType) => {
            if (this.activeAnomalies.dramaticWindAnomaly) {
                let windDialogue;
                
                // Use character-specific wind dialogue
                if (characterName === 'Vi') {
                    windDialogue = this.getViWindAnomalyDialogue();
                } else if (characterName === 'Mystic') {
                    windDialogue = this.getMysticWindAnomalyDialogue();
                } else if (characterName === 'Lepre') {
                    windDialogue = this.getLepreWindAnomalyDialogue();
                } else {
                    windDialogue = this.getDramaticWindAnomalyDialogue();
                }
                
                // Handle different characters with dramatic wind dialogue
                if (characterName === 'Vi') {
                    const viEl = document.getElementById('viSpeechBubble');
                    if (viEl) {
                        let viText = viEl.querySelector('#viSpeechText');
                        if (!viText) {
                            viText = document.createElement('div');
                            viText.id = 'viSpeechText';
                            viEl.appendChild(viText);
                        }
                        viText.textContent = windDialogue;
                        viEl.style.display = 'block';
                        setTimeout(() => {
                            viEl.style.display = 'none';
                        }, 3500);
                    }
                } else if (characterName === 'Mystic') {
                    const mysticEl = document.getElementById('kitchenSpeechBubble');
                    const mysticImg = document.getElementById('kitchenCharacterImg');
                    if (mysticEl) {
                        mysticEl.textContent = windDialogue;
                        mysticEl.style.display = 'block';
                        if (mysticImg) mysticImg.src = 'assets/icons/chef mystic speech.png';
                        setTimeout(() => {
                            mysticEl.style.display = 'none';
                            if (mysticImg) mysticImg.src = 'assets/icons/chef mystic.png';
                        }, 3500);
                    }
                } else if (characterName === 'Lepre') {
                    // Use boutique's speech system with wind dialogue
                    if (window.boutique && typeof window.boutique.showLepreSpeechBubble === 'function') {
                        const normalImg = document.getElementById('lepreCharacterImage');
                        const speakingImg = document.getElementById('lepreCharacterSpeaking');
                        
                        if (normalImg && speakingImg) {
                            normalImg.style.display = 'none';
                            speakingImg.style.display = 'block';
                        }
                        
                        window.boutique.showLepreSpeechBubble(windDialogue);
                        
                        setTimeout(() => {
                            if (normalImg && speakingImg) {
                                speakingImg.style.display = 'none';
                                normalImg.style.display = 'block';
                            }
                            if (window.boutique && typeof window.boutique.hideLepreSpeechBubble === 'function') {
                                window.boutique.hideLepreSpeechBubble();
                            }
                        }, 3500);
                    }
                } else if (characterName === 'Tico') {
                    // Use front desk's speech system with Tico-specific wind dialogue
                    if (window.frontDesk && typeof window.frontDesk.showTicoSpeech === 'function') {
                        const ticoWindDialogue = this.getTicoWindAnomalyDialogue();
                        window.frontDesk.showTicoSpeech(ticoWindDialogue, 3500);
                    }
                } else {
                    // Fall back to original function for other characters
                    this.originalShowCharacterSpeech(characterName, tokenType);
                }
            } else {
                this.originalShowCharacterSpeech(characterName, tokenType);
            }
        };
    }
    
    // Hook Boutique Lepre speech if available
    if (window.boutique && typeof window.boutique.showLepreSpeechBubble === 'function' && !this.originalShowLepreSpeechBubble) {
        this.originalShowLepreSpeechBubble = window.boutique.showLepreSpeechBubble;

        window.boutique.showLepreSpeechBubble = (message) => {
            if (this.activeAnomalies.dramaticWindAnomaly && !message.includes('wind') && !message.includes('Wind')) {
                const lepreWindDialogue = this.getLepreWindAnomalyDialogue();
                this.originalShowLepreSpeechBubble(lepreWindDialogue);
            } else {
                this.originalShowLepreSpeechBubble(message);
            }
        };
    }
    
    // Hook Front Desk Tico speech if available
    if (window.frontDesk && typeof window.frontDesk.showTicoSpeech === 'function' && !this.originalShowTicoSpeech) {
        this.originalShowTicoSpeech = window.frontDesk.showTicoSpeech;

        window.frontDesk.showTicoSpeech = (message, duration = 3500) => {
            if (this.activeAnomalies.dramaticWindAnomaly && !message.includes('wind') && !message.includes('Wind')) {
                const ticoWindDialogue = this.getTicoWindAnomalyDialogue();
                this.originalShowTicoSpeech(ticoWindDialogue, duration);
            } else {
                this.originalShowTicoSpeech(message, duration);
            }
        };
    }
    
    // Create our modified fluzzerSay function
    window.fluzzerSay = (message, upset = false, duration = 5000) => {
        let finalMessage = message;
        
        // Override with wind dialogue if dramatic wind anomaly is active and it's not already wind-related
        if (this.activeAnomalies.dramaticWindAnomaly && !message.includes('wind') && !message.includes('Wind')) {
            finalMessage = this.getDramaticWindAnomalyDialogue();
        }
        
        // Call the original function
        if (this.originalFluzzerSay) {
            this.originalFluzzerSay(finalMessage, upset, duration);
        }
        
        // If fluzzer flip anomaly is active, flip the speech bubble text
        if (this.activeAnomalies.fluzzerFlipAnomaly) {
            setTimeout(() => {
                const speechBubble = document.getElementById('fluzzerSpeech');
                if (speechBubble && !speechBubble.classList.contains('fluzzer-flip-dialogue')) {
                    speechBubble.classList.add('fluzzer-flip-dialogue');

                }
            }, 100);
        }
    };
    
    // Hook Vi speech function if available
    if (typeof window.showViSpeech === 'function' && !this.originalShowViSpeech) {
        this.originalShowViSpeech = window.showViSpeech;

        window.showViSpeech = (message, duration = 8000) => {
            if (this.activeAnomalies.dramaticWindAnomaly && !message.includes('wind') && !message.includes('Wind')) {
                const viWindDialogue = this.getViWindAnomalyDialogue();
                this.originalShowViSpeech(viWindDialogue, duration);
            } else {
                this.originalShowViSpeech(message, duration);
            }
        };
    }

};

// Keep the old function name for backward compatibility but make it call the new comprehensive function
window.anomalySystem.hookFluzzerSayFunction = function() {
    this.hookAllCharacterDialogue();
};

window.anomalySystem.getFluzzerFlipAnomalyDialogue = function() {
    const fluzzerFlipDialogues = [
        "Why is everything upside down?! This is so confusing!",
        "I feel like I'm doing a headstand while working... is this normal?",
        "The world looks different from this angle! Everything's backwards!",
        "I'm getting dizzy... why am I upside down?",
        "This is the strangest dimensional distortion I've ever experienced!",
        "My perspective on gardening has literally been flipped!",
        "I think I need to adjust my orientation... this feels wrong!",
        "The flowers look weird from upside down... wait, am I upside down?!",
        "Something's definitely not right here! The gravity feels funny!",
        "I'm seeing the terrarium from a whole new angle... literally!",
        "This must be some kind of anomaly affecting my visual perception!",
        "Help! I can't tell which way is up anymore!",
        "Is it me or is the entire universe rotated 180 degrees?",
        "Working upside down is surprisingly challenging!",
        "I feel like I'm in an alternate dimension where everything is flipped!",
        "This flip is making me reconsider my understanding of spatial relationships!",
        "I wonder if the flowers are getting confused by my upside-down care...",
        "Note to self: being upside down makes flower watering very complicated!",
        "Is this what bats feel like all the time?",
        "Maybe this new perspective will give me creative gardening ideas?"
    ];
    
    return fluzzerFlipDialogues[Math.floor(Math.random() * fluzzerFlipDialogues.length)];
};

window.anomalySystem.getRustlingFlowersAnomalyDialogue = function() {
    const rustlingFlowersDialogues = [
        "All the flowers are rustling but... they're not giving any tokens! This is concerning!",
        "I keep hearing rustling sounds everywhere, but the flowers aren't producing anything!",
        "This is so strange... every flower is rustling, but they're all empty! What's happening?",
        "The rustling is so loud! But why aren't any of the flowers dropping tokens?",
        "I've never seen all the flowers rustle at once like this! It's beautiful but... unproductive.",
        "The entire terrarium sounds like it's whispering secrets, but the flowers won't share their tokens!",
        "All this rustling is making me dizzy! And not a single token to show for it!",
        "It's like the flowers are all trying to tell me something, but they're keeping their tokens to themselves!",
        "The rustling symphony is amazing, but my token collection is suffering!",
        "Every flower is moving, but none are giving! This dimensional anomaly is quite puzzling!",
        "I feel like I'm in a rustling flower concert, but the admission fee is my token income!",
        "The flowers are putting on quite a show with all this rustling, but where are my rewards?",
        "All this movement and sound, yet the flowers remain stubbornly tokenless!",
        "I've never experienced such widespread rustling! It's mesmerizing but economically concerning!",
        "The rustling is hypnotic... almost like the flowers are dancing, but empty-handed!",
        "This anomaly has turned my productive garden into a rustling orchestra with no profit!",
        "Every flower cell is alive with movement, but dead when it comes to token generation!",
        "The rustling sounds are so soothing, but my token anxiety is through the roof!",
        "It's like the flowers are all having a party, but they forgot to bring the tokens!",
        "All this rustling energy and not a single token drop! The irony is overwhelming!"
    ];
    
    return rustlingFlowersDialogues[Math.floor(Math.random() * rustlingFlowersDialogues.length)];
};

window.anomalySystem.triggerRustlingFlowersAnomalyFixedDialogue = function() {
    // Wait a bit for the anomaly notification to show, then trigger Fluzzer's relief dialogue
    setTimeout(() => {
        if (typeof window.fluzzerSay === 'function') {
            const reliefMessage = this.getRustlingFlowersAnomalyFixedDialogue();
            window.fluzzerSay(reliefMessage, false, 6000);
        }
    }, 2000); // 2 second delay to let the notification show first
};

window.anomalySystem.getRustlingFlowersAnomalyFixedDialogue = function() {
    const reliefDialogues = [
        "Thank goodness! The flowers are finally giving tokens again! My productivity is restored!",
        "What a relief! The rustling has calmed down and the flowers are back to being generous!",
        "Perfect! The endless rustling symphony is over and my token income is flowing again!",
        "Wonderful! The flowers have stopped their mysterious rustling dance and remembered their purpose!",
        "Ahh, much better! No more empty rustling - the flowers are sharing their tokens once more!",
        "Excellent work! The rustling anomaly is gone and my terrarium is profitable again!",
        "Finally! The flowers have ended their token strike and are back to normal production!",
        "Such a relief! The hypnotic rustling has stopped and my garden is economically viable again!",
        "Great! The rustling flower concert is over and the token rewards are flowing as they should!",
        "Thank you for fixing that! The flowers have returned to their token-giving ways!",
        "Perfect timing! The rustling anomaly was driving me crazy with all that sound but no profit!",
        "Much appreciated! My ears can rest and my token collection can grow again!",
        "Wonderful! The flowers have remembered that rustling should come with rewards!",
        "Brilliant! The mysterious rustling behavior is over and normalcy has returned!",
        "Fantastic! My terrarium is back to being both beautiful AND productive!"
    ];
    
    return reliefDialogues[Math.floor(Math.random() * reliefDialogues.length)];
};

window.anomalySystem.analyzeFluzzerFlipAnomaly = function(isTargetedClick = false) {
    if (this.analyzing || this.searching) return;
    
    this.analyzing = true;

    // Add cursor animation and analyzing class
    document.body.classList.add('anomaly-analyzing');
    this.startCursorAnimation();
    
    // Show analyzing feedback
    this.showAnalyzing();
    
    setTimeout(() => {
        this.analyzing = false;
        
        // Stop cursor animation and remove analyzing animation class
        this.stopCursorAnimation();
        document.body.classList.remove('anomaly-analyzing');
        
        if (this.activeAnomalies.fluzzerFlipAnomaly && isTargetedClick) {
            // Anomaly detected and clicked directly - fix it
            this.fixFluzzerFlipAnomaly();
        } else {
            // Either no anomaly OR anomaly detected but not clicked directly
            this.showNoAnomaly();
        }
    }, 3000);
};

window.anomalySystem.fixFluzzerFlipAnomaly = function() {

    // Remove the flip styles
    const anomalyStyles = document.getElementById('fluzzerFlipAnomalyStyles');
    if (anomalyStyles) {
        anomalyStyles.remove();
    }
    
    // Restore all Fluzzer images
    this.restoreFluzzerImages();
    
    // Clean up detection
    if (this.fluzzerFlipMutationObserver) {
        this.fluzzerFlipMutationObserver.disconnect();
        this.fluzzerFlipMutationObserver = null;
    }
    
    if (this.fluzzerFlipClickHandler) {
        document.removeEventListener('click', this.fluzzerFlipClickHandler, true);
        this.fluzzerFlipClickHandler = null;
    }
    
    // Restore the original fluzzerSay function
    if (this.originalFluzzerSay) {
        window.fluzzerSay = this.originalFluzzerSay;
        this.originalFluzzerSay = null;

    }
    
    // Restore the original getRandomFluzzerSpeech function
    if (this.originalGetRandomFluzzerSpeech) {
        window.getRandomFluzzerSpeech = this.originalGetRandomFluzzerSpeech;
        this.originalGetRandomFluzzerSpeech = null;

    }
    
    // Remove flip class from any existing speech bubbles
    const speechBubble = document.getElementById('fluzzerSpeech');
    if (speechBubble) {
        speechBubble.classList.remove('fluzzer-flip-dialogue');
    }
    
    // Remove from anomalies list
    this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'fluzzerFlip');
    this.activeAnomalies.fluzzerFlipAnomaly = false;
    
    // Save state
    this.saveAnomalyState();
    
    // Give reward
    this.giveAnomalyReward();
    
    // Show proper anomaly fixed notification
    this.showAnomalyFixedNotification();
    
    // Trigger special "anomaly fixed" dialogue from Fluzzer
    this.triggerFluzzerAnomalyFixedDialogue();

};

window.anomalySystem.triggerFluzzerAnomalyFixedDialogue = function() {
    // Wait a bit for the anomaly notification to show, then trigger Fluzzer's relief dialogue
    setTimeout(() => {
        if (typeof window.fluzzerSay === 'function') {
            const reliefDialogue = this.getFluzzerAnomalyFixedDialogue();
            window.fluzzerSay(reliefDialogue, false, 6000); // Longer duration for the special message

        }
    }, 2000); // 2 second delay to let the notification show first
};

window.anomalySystem.getFluzzerAnomalyFixedDialogue = function() {
    const reliefDialogues = [
        "Oh thank goodness! Everything is right-side up again! I was getting so dizzy!",
        "Phew! The world makes sense again! No more upside-down gardening for me!",
        "Ahh, that's much better! I can finally tell which way is up! Thank you for fixing that!",
        "What a relief! I thought I was going to be stuck upside down forever!",
        "Normal orientation restored! I can go back to proper flower care now!",
        "That dimensional distortion was really messing with my spatial awareness! Glad it's over!",
        "Much better! Now I can water the flowers without getting confused about gravity!",
        "Finally! I was starting to think being upside down was the new normal!",
        "Thank you for fixing that anomaly! My neck was getting sore from all that head tilting!",
        "Wonderful! The terrarium feels like home again! No more topsy-turvy gardening!",
        "I feel so much more stable now! That flip was really throwing off my balance!",
        "Back to normal! I can focus on the flowers instead of trying to figure out which way is up!",
        "That was the strangest experience! Everything looks so much clearer now!",
        "Perfect! Now I can get back to my regular gardening routine without getting dizzy!",
        "What a weird adventure that was! Glad to have my proper perspective back!"
    ];
    
    return reliefDialogues[Math.floor(Math.random() * reliefDialogues.length)];
};

window.anomalySystem.restoreFluzzerImages = function() {
    // Find all Fluzzer images and remove anomaly attributes
    const fluzzerImages = document.querySelectorAll('img[data-fluzzer-flip-anomaly="true"]');
    
    fluzzerImages.forEach(img => {
        img.removeAttribute('data-fluzzer-flip-processed');
        img.removeAttribute('data-fluzzer-flip-anomaly');
        // Remove any inline transform styles that might have been added
        img.style.transform = '';
    });
    
    // Also restore the Fluzzer AI cursor
    const fluzzerCursor = document.getElementById('fluzzerAICursor');
    if (fluzzerCursor) {
        fluzzerCursor.removeAttribute('data-fluzzer-flip-anomaly');
        // Remove any inline transform styles
        fluzzerCursor.style.transform = '';

    }

};

window.anomalySystem.restoreFluzzerFlipAnomaly = function(savedAnomaly) {

    // Restore the anomaly state
    this.activeAnomalies.fluzzerFlipAnomaly = true;
    this.anomalies.push(savedAnomaly);
    
    // Restart the anomaly effect
    this.startFluzzerFlipAnomaly();

};

// === DRAMATIC WIND ANOMALY FUNCTIONS ===

// Dramatic Wind Anomaly - creates strong wind effects that shake UI cards and add wind animations
window.anomalySystem.spawnDramaticWindAnomaly = function() {

    // Check if any conflicting anomalies are active
    if (this.activeAnomalies.rustlingFlowersAnomaly) {

        this.fixRustlingFlowersAnomaly();
    }
    
    if (this.activeAnomalies.fluzzerFlipAnomaly) {

        this.fixFluzzerFlipAnomaly();
    }
    
    // Create the anomaly data
    const anomaly = {
        type: 'dramaticWind',
        id: 'wind-' + Date.now(),
        spawnTime: Date.now(),
        intensity: Math.random() * 0.5 + 0.5, // Random intensity between 0.5 and 1.0
        direction: Math.random() * 360 // Random wind direction
    };
    
    this.anomalies.push(anomaly);
    this.activeAnomalies.dramaticWindAnomaly = true;
    
    // Start the wind effect
    this.startDramaticWindAnomaly(anomaly);
    
    // Set up detection
    this.setupDramaticWindDetection();
    
    // Save state
    this.saveAnomalyState();

    return anomaly;
};

window.anomalySystem.startDramaticWindAnomaly = function(anomaly) {

    // Add wind styles to the page
    this.addDramaticWindStyles(anomaly);
    
    // Apply wind effects to existing elements
    this.applyWindEffectsToUI();
    
    // Start background wind animation
    this.startWindBackgroundAnimation();
    
    // Hook into ALL character speech for wind-related dialogue
    this.hookAllCharacterDialogue();

};

window.anomalySystem.addDramaticWindStyles = function(anomaly) {
    // Remove any existing wind styles
    const existingStyles = document.getElementById('dramaticWindAnomalyStyles');
    if (existingStyles) {
        existingStyles.remove();
    }
    
    const intensity = anomaly.intensity || 0.7;
    const direction = anomaly.direction || 45;
    
    const windStyles = document.createElement('style');
    windStyles.id = 'dramaticWindAnomalyStyles';
    windStyles.textContent = `
        /* Wind background animation */
        .wind-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: -1;
            background: linear-gradient(${direction}deg, 
                rgba(200, 220, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 25%, 
                rgba(200, 220, 255, 0.1) 50%, 
                rgba(255, 255, 255, 0.05) 75%, 
                rgba(200, 220, 255, 0.1) 100%);
            background-size: 200% 200%;
            animation: windSweep ${2 / intensity}s ease-in-out infinite;
        }
        
        @keyframes windSweep {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
        }
        
        /* Card wind shake effects */
        .card.wind-affected {
            animation: windShake ${0.8 / intensity}s ease-in-out infinite;
            transform-origin: bottom center;
        }
        
        @keyframes windShake {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            10% { transform: translateX(${intensity * 3}px) rotate(${intensity * 1.5}deg); }
            20% { transform: translateX(-${intensity * 2}px) rotate(-${intensity * 1}deg); }
            30% { transform: translateX(${intensity * 4}px) rotate(${intensity * 2}deg); }
            40% { transform: translateX(-${intensity * 1}px) rotate(-${intensity * 0.5}deg); }
            50% { transform: translateX(${intensity * 2}px) rotate(${intensity * 1}deg); }
            60% { transform: translateX(-${intensity * 3}px) rotate(-${intensity * 1.5}deg); }
            70% { transform: translateX(${intensity * 1}px) rotate(${intensity * 0.5}deg); }
            80% { transform: translateX(-${intensity * 2}px) rotate(-${intensity * 1}deg); }
            90% { transform: translateX(${intensity * 1}px) rotate(${intensity * 0.5}deg); }
        }
        
        /* Button wind effects */
        button.wind-affected {
            animation: windButtonShake ${1 / intensity}s ease-in-out infinite;
        }
        
        @keyframes windButtonShake {
            0%, 100% { transform: translateX(0px); }
            25% { transform: translateX(${intensity * 2}px); }
            75% { transform: translateX(-${intensity * 2}px); }
        }
        
        /* Flower grid wind effects */
        .flower-cell.wind-affected {
            animation: windFlowerSway ${1.2 / intensity}s ease-in-out infinite;
        }
        
        @keyframes windFlowerSway {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(${intensity * 8}deg) scale(${1 + intensity * 0.1}); }
            75% { transform: rotate(-${intensity * 8}deg) scale(${1 + intensity * 0.1}); }
        }
        
        /* Wind particles - enhanced for drama */
        .wind-particle {
            position: fixed;
            width: 4px;
            height: 25px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: windParticle ${2 / intensity}s linear infinite;
            box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }
        
        /* Wind feathers - dramatic floating feathers */
        .wind-feather {
            position: fixed;
            width: 12px;
            height: 30px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 40% 10% 40% 10%;
            pointer-events: none;
            z-index: 999;
            animation: windFeather ${2.5 / intensity}s ease-in-out infinite;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
            transform-origin: center bottom;
        }
        
        /* Wind leaves - swirling leaves */
        .wind-leaf {
            position: fixed;
            width: 15px;
            height: 20px;
            background: rgba(100, 200, 100, 0.8);
            border-radius: 0 100% 0 100%;
            pointer-events: none;
            z-index: 998;
            animation: windLeaf ${3.5 / intensity}s ease-in-out infinite;
            box-shadow: 0 0 4px rgba(100, 200, 100, 0.4);
        }
        
        @keyframes windParticle {
            0% {
                transform: translateX(-100px) translateY(100vh) rotate(${direction}deg);
                opacity: 0;
            }
            5% {
                opacity: 1;
            }
            95% {
                opacity: 1;
            }
            100% {
                transform: translateX(calc(100vw + 150px)) translateY(-150px) rotate(${direction + 180}deg);
                opacity: 0;
            }
        }
        
        @keyframes windFeather {
            0% {
                transform: translateX(-120px) translateY(100vh) rotate(0deg) scale(0.8);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: translateX(-80px) translateY(90vh) rotate(15deg) scale(1);
            }
            25% {
                transform: translateX(20vw) translateY(70vh) rotate(-10deg) scale(1.1);
            }
            50% {
                transform: translateX(50vw) translateY(40vh) rotate(25deg) scale(0.9);
            }
            75% {
                transform: translateX(80vw) translateY(20vh) rotate(-15deg) scale(1.2);
            }
            90% {
                opacity: 1;
                transform: translateX(95vw) translateY(5vh) rotate(30deg) scale(0.8);
            }
            100% {
                transform: translateX(calc(100vw + 120px)) translateY(-100px) rotate(45deg) scale(0.5);
                opacity: 0;
            }
        }
        
        @keyframes windLeaf {
            0% {
                transform: translateX(-100px) translateY(90vh) rotate(0deg) scale(1);
                opacity: 0;
            }
            15% {
                opacity: 1;
                transform: translateX(15vw) translateY(75vh) rotate(45deg) scale(1.1);
            }
            30% {
                transform: translateX(30vw) translateY(55vh) rotate(-30deg) scale(0.9);
            }
            45% {
                transform: translateX(45vw) translateY(40vh) rotate(60deg) scale(1.3);
            }
            60% {
                transform: translateX(60vw) translateY(30vh) rotate(-45deg) scale(0.8);
            }
            75% {
                transform: translateX(75vw) translateY(25vh) rotate(90deg) scale(1.1);
            }
            90% {
                opacity: 1;
                transform: translateX(90vw) translateY(15vh) rotate(-60deg) scale(0.9);
            }
            100% {
                transform: translateX(calc(100vw + 100px)) translateY(-50px) rotate(120deg) scale(0.6);
                opacity: 0;
            }
        }
        
        /* Terrarium specific wind effects */
        #terrarium.wind-affected .terrarium-flower-grid {
            animation: windGridSway ${1.5 / intensity}s ease-in-out infinite;
        }
        
        @keyframes windGridSway {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(${intensity * 5}px); }
        }
        
        /* Fluzzer wind effects */
        #fluzzerCharacterContainer.wind-affected {
            animation: windFluzzerBlow ${0.6 / intensity}s ease-in-out infinite;
        }
        
        @keyframes windFluzzerBlow {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            25% { transform: translateX(${intensity * 6}px) rotate(${intensity * 3}deg); }
            75% { transform: translateX(-${intensity * 4}px) rotate(-${intensity * 2}deg); }
        }
    `;
    
    document.head.appendChild(windStyles);

};

window.anomalySystem.applyWindEffectsToUI = function() {
    // Add wind background
    let windBackground = document.getElementById('windBackground');
    if (!windBackground) {
        windBackground = document.createElement('div');
        windBackground.id = 'windBackground';
        windBackground.className = 'wind-background';
        document.body.appendChild(windBackground);
    }
    
    // Apply wind effects to all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('wind-affected');
        card.setAttribute('data-wind-anomaly', 'true');
    });
    
    // Apply wind effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('wind-affected');
        button.setAttribute('data-wind-anomaly', 'true');
    });
    
    // Apply wind effects to flower cells
    const flowerCells = document.querySelectorAll('.flower-cell');
    flowerCells.forEach(cell => {
        cell.classList.add('wind-affected');
        cell.setAttribute('data-wind-anomaly', 'true');
    });
    
    // Apply wind effects to terrarium
    const terrarium = document.getElementById('terrarium');
    if (terrarium) {
        terrarium.classList.add('wind-affected');
        terrarium.setAttribute('data-wind-anomaly', 'true');
    }
    
    // Apply wind effects to Fluzzer
    const fluzzerContainer = document.getElementById('fluzzerCharacterContainer');
    if (fluzzerContainer) {
        fluzzerContainer.classList.add('wind-affected');
        fluzzerContainer.setAttribute('data-wind-anomaly', 'true');
    }

};

window.anomalySystem.startWindBackgroundAnimation = function() {
    // Create wind particles much more frequently for dramatic effect
    this.windParticleInterval = setInterval(() => {
        if (this.activeAnomalies.dramaticWindAnomaly) {
            // Create multiple particles at once for more dramatic effect
            for (let i = 0; i < 3; i++) {
                this.createWindParticle();
            }
            // Also create feathers occasionally
            if (Math.random() < 0.4) {
                this.createWindFeather();
            }
            // Create leaves sometimes too
            if (Math.random() < 0.3) {
                this.createWindLeaf();
            }
        }
    }, 100); // Much faster spawn rate (was 200ms, now 100ms)
    
    // Store interval for cleanup
    this.windAnimationIntervals = [this.windParticleInterval];
};

window.anomalySystem.createWindParticle = function() {
    const particle = document.createElement('div');
    particle.className = 'wind-particle';
    particle.style.left = '-50px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
};

window.anomalySystem.createWindFeather = function() {
    const feather = document.createElement('div');
    feather.className = 'wind-feather';
    feather.style.left = '-80px';
    feather.style.top = Math.random() * window.innerHeight + 'px';
    feather.style.animationDelay = Math.random() * 1 + 's';
    
    // Random feather color
    const featherColors = ['rgba(255, 255, 255, 0.8)', 'rgba(200, 220, 255, 0.9)', 'rgba(255, 240, 200, 0.8)', 'rgba(220, 255, 220, 0.7)'];
    feather.style.background = featherColors[Math.floor(Math.random() * featherColors.length)];
    
    document.body.appendChild(feather);
    
    // Remove feather after animation
    setTimeout(() => {
        if (feather.parentNode) {
            feather.parentNode.removeChild(feather);
        }
    }, 4000);
};

window.anomalySystem.createWindLeaf = function() {
    const leaf = document.createElement('div');
    leaf.className = 'wind-leaf';
    
    // Vary the starting horizontal position to spread leaves across different entry points
    const startX = -100 + (Math.random() * 50); // Start between -100px and -50px
    leaf.style.left = startX + 'px';
    
    // Vary the starting vertical position to create more variety
    const startY = window.innerHeight * (0.6 + Math.random() * 0.3); // Start in bottom 30-40% of screen
    leaf.style.top = startY + 'px';
    
    leaf.style.animationDelay = Math.random() * 2 + 's';
    
    // Random leaf color
    const leafColors = ['rgba(100, 200, 100, 0.8)', 'rgba(150, 255, 150, 0.7)', 'rgba(200, 255, 100, 0.8)', 'rgba(80, 180, 80, 0.9)'];
    leaf.style.background = leafColors[Math.floor(Math.random() * leafColors.length)];
    
    document.body.appendChild(leaf);
    
    // Remove leaf after animation
    setTimeout(() => {
        if (leaf.parentNode) {
            leaf.parentNode.removeChild(leaf);
        }
    }, 5500); // Slightly longer timeout to match new animation
};

window.anomalySystem.setupDramaticWindDetection = function() {

    // Create mutation observer to handle new elements
    this.windMutationObserver = new MutationObserver((mutations) => {
        if (this.activeAnomalies.dramaticWindAnomaly) {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList.contains('card')) {
                            node.classList.add('wind-affected');
                            node.setAttribute('data-wind-anomaly', 'true');
                        }
                        if (node.tagName === 'BUTTON') {
                            node.classList.add('wind-affected');
                            node.setAttribute('data-wind-anomaly', 'true');
                        }
                        if (node.classList.contains('flower-cell')) {
                            node.classList.add('wind-affected');
                            node.setAttribute('data-wind-anomaly', 'true');
                        }
                        
                        // Apply to children as well
                        const childCards = node.querySelectorAll('.card');
                        const childButtons = node.querySelectorAll('button');
                        const childFlowers = node.querySelectorAll('.flower-cell');
                        
                        childCards.forEach(card => {
                            card.classList.add('wind-affected');
                            card.setAttribute('data-wind-anomaly', 'true');
                        });
                        childButtons.forEach(button => {
                            button.classList.add('wind-affected');
                            button.setAttribute('data-wind-anomaly', 'true');
                        });
                        childFlowers.forEach(flower => {
                            flower.classList.add('wind-affected');
                            flower.setAttribute('data-wind-anomaly', 'true');
                        });
                    }
                });
            });
        }
    });
    
    this.windMutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Set up click detection for ANYWHERE on the screen when find mode is active
    this.windClickHandler = (event) => {
        if (this.findModeActive && this.activeAnomalies.dramaticWindAnomaly) {
            // Any click anywhere on the screen will trigger the anomaly detection
            event.preventDefault();
            event.stopPropagation();
            this.analyzeDramaticWindAnomaly(true);
            return false;
        }
    };
    
    document.addEventListener('click', this.windClickHandler, true);

};

// Test functions for rustling flowers anomaly
window.testRustlingFlowersAnomaly = function() {

    window.anomalySystem.spawnRustlingFlowersAnomaly();

};

window.anomalySystem.getDramaticWindAnomalyDialogue = function() {
    const windDialogues = [
        "Whoa! This is a nice sudden breeze.",
        "Hold on tight! Everything is shaking from this peaceful wind!",
        "The whole terrarium feels like its dancing.",
        "This nice breeze is making everything sway and shake!",
        "The wind is the main character right now, and we're all supporting cast!",
        "This breeze feels magical... like it's charged with mysterious energy!",
    ];
    
    return windDialogues[Math.floor(Math.random() * windDialogues.length)];
};

window.anomalySystem.getViWindAnomalyDialogue = function() {
    const viWindDialogues = [
        "My antlers are catching the wind perfectly! I feel like I could fly with this breeze!",
        "This wind is blowing away all my research stress! I feel so refreshed and energized!",
        "The way the wind makes my tail prism chime is like natural music! I could listen to this forever!",
        "I usually prefer controlled environments, but this chaotic wind energy is invigorating!",
        "The wind is messing up my calculations, but honestly? I don't even care! This is too fun!",
        "My fur is getting all windswept, but the way it affects my light experiments is worth it!",
        "This powerful wind makes me feel alive! Usually I'm cooped up in the lab all day!",
        "The wind is blowing through my work space and I've never felt so inspired!",
        "This atmospheric chaos is exactly the kind of unpredictability my research needed!",
        "I should probably secure my equipment, but I'm too busy enjoying these wind effects!",
    ];
    
    return viWindDialogues[Math.floor(Math.random() * viWindDialogues.length)];
};

window.anomalySystem.getTicoWindAnomalyDialogue = function() {
    const ticoWindDialogues = [
        // Front desk management challenges
        "Oh my! This wind is making all the paperwork fly everywhere! I can't keep track of anything!",
        "The wind keeps blowing the worker applications off my desk! How am I supposed to organize interviews?",
        "This wind is highly irregular, but I suppose we must adapt to unusual circumstances.",
        "My tie keeps getting blown around by this wind! It's quite undignified!",
        "I feel like I'm working in a tornado! How do the other departments handle this?",
        "Despite the wind chaos, I'm still here to help anyone who needs assistance!",

    ];
    
    return ticoWindDialogues[Math.floor(Math.random() * ticoWindDialogues.length)];
};

window.anomalySystem.getLepreWindAnomalyDialogue = function() {
    const lepreWindDialogues = [
        // Business concerns with characteristic speech pattern
        "This wind is terrible for business! My beautiful token displays keep getting messed up!",
        "The wind keeps blowing my price tags around! How are customers supposed to know what costs what?",
        "My carefully arranged boutique is turning into a disaster zone because of this wind!",
        "The wind is making my premium tokens fly everywhere! This is a nightmare for inventory!",
        "I can't maintain proper retail presentation when everything keeps getting blown around!",
        "The wind is scaring away potential customers! This is bad for the boutique's reputation!",
        "My cash register receipts are flying all over the place thanks to this chaotic wind!",
        "The wind is making it impossible to keep my shop organized and welcoming!",
        "How am I supposed to run a respectable business when the wind won't stop causing havoc?",
        "The wind is turning my boutique into a mess! This is so unprofessional!",
        "My ears are getting blown around so much I'm getting dizzy! This wind is torture!",
        "The wind is making me look completely unpresentable! What will the customers think?",
        "I can barely keep my balance in this wind! How am I supposed to maintain my dignity?",
        "Despite this terrible wind, I'm still open for business! Come buy something to cheer me up!",
        "This wind is like a hurricane! I feel like I'm in the eye of a retail storm!",
        "The wind is so powerful it's like nature itself is shopping for chaos!",
    ];
    
    return lepreWindDialogues[Math.floor(Math.random() * lepreWindDialogues.length)];
};

window.anomalySystem.getMysticWindAnomalyDialogue = function() {
    const mysticWindDialogues = [
        // Kitchen management challenges  
        "This wind is a disaster for kitchen operations! My ingredients are flying everywhere!",
        "The wind keeps blowing out my stovetop flames! How am I supposed to cook anything?",
        "My perfectly measured ingredients are getting scattered by this chaotic wind!",
        "The wind is turning my organized kitchen into complete culinary chaos!",
        "A professional chef adapts to any conditions, but this wind is testing my limits!",
        "The wind is making it dangerous to work with hot oil! Safety first in the kitchen!",
        "My seasoning spices are getting blown away before I can add them to dishes!",
        "The wind is messing up my chef's hat! Do you know how hard it is to keep this thing looking professional?",
        "My apron is flapping around like crazy - I look ridiculous instead of authoritative!",
        "The wind won't defeat me! I'll find a way to cook amazing meals despite the chaos!",

    ];
    
    return mysticWindDialogues[Math.floor(Math.random() * mysticWindDialogues.length)];
};

window.anomalySystem.analyzeDramaticWindAnomaly = function(isTargetedClick = false) {
    if (this.analyzing || this.searching) return;
    
    this.analyzing = true;

    // Add cursor animation and analyzing class
    document.body.classList.add('anomaly-analyzing');
    this.startCursorAnimation();
    
    // Show analyzing feedback
    this.showAnalyzing();
    
    setTimeout(() => {
        this.analyzing = false;
        
        // Stop cursor animation and remove analyzing animation class
        this.stopCursorAnimation();
        document.body.classList.remove('anomaly-analyzing');
        
        if (this.activeAnomalies.dramaticWindAnomaly && isTargetedClick) {
            // Anomaly detected and clicked directly - fix it
            this.fixDramaticWindAnomaly();
        } else {
            // Either no anomaly OR anomaly detected but not clicked directly
            this.showNoAnomaly();
        }
    }, 3000);
};

window.anomalySystem.fixDramaticWindAnomaly = function() {

    // Remove wind styles
    const windStyles = document.getElementById('dramaticWindAnomalyStyles');
    if (windStyles) {
        windStyles.remove();
    }
    
    // Remove wind background
    const windBackground = document.getElementById('windBackground');
    if (windBackground) {
        windBackground.remove();
    }
    
    // Remove wind effects from all elements
    this.removeWindEffectsFromUI();
    
    // Stop wind animations
    this.stopWindBackgroundAnimation();
    
    // Clean up detection
    if (this.windMutationObserver) {
        this.windMutationObserver.disconnect();
        this.windMutationObserver = null;
    }
    
    if (this.windClickHandler) {
        document.removeEventListener('click', this.windClickHandler, true);
        this.windClickHandler = null;
    }
    
    // Restore ALL original character dialogue functions
    if (this.originalFluzzerSay) {
        window.fluzzerSay = this.originalFluzzerSay;
        this.originalFluzzerSay = null;

    }
    
    if (this.originalGetRandomFluzzerSpeech) {
        window.getRandomFluzzerSpeech = this.originalGetRandomFluzzerSpeech;
        this.originalGetRandomFluzzerSpeech = null;

    }
    
    if (this.originalShowSwariaSpeech) {
        window.showSwariaSpeech = this.originalShowSwariaSpeech;
        this.originalShowSwariaSpeech = null;

    }
    
    if (this.originalShowSoapSpeech) {
        window.showSoapSpeech = this.originalShowSoapSpeech;
        this.originalShowSoapSpeech = null;

    }
    
    if (this.originalShowCharacterSpeech) {
        window.showCharacterSpeech = this.originalShowCharacterSpeech;
        this.originalShowCharacterSpeech = null;

    }
    
    if (this.originalShowLepreSpeechBubble && window.boutique) {
        window.boutique.showLepreSpeechBubble = this.originalShowLepreSpeechBubble;
        this.originalShowLepreSpeechBubble = null;

    }
    
    if (this.originalShowTicoSpeech && window.frontDesk) {
        window.frontDesk.showTicoSpeech = this.originalShowTicoSpeech;
        this.originalShowTicoSpeech = null;

    }
    
    if (this.originalShowViSpeech) {
        window.showViSpeech = this.originalShowViSpeech;
        this.originalShowViSpeech = null;

    }
    
    // Remove from anomalies list
    this.anomalies = this.anomalies.filter(anomaly => anomaly.type !== 'dramaticWind');
    this.activeAnomalies.dramaticWindAnomaly = false;
    
    // Save state
    this.saveAnomalyState();
    
    // Give reward
    this.giveAnomalyReward();
    
    // Show proper anomaly fixed notification
    this.showAnomalyFixedNotification();
    
    // Trigger special "anomaly fixed" dialogue from Fluzzer
    this.triggerDramaticWindAnomalyFixedDialogue();

};

window.anomalySystem.removeWindEffectsFromUI = function() {
    // Remove wind effects from all elements with wind anomaly attributes
    const windElements = document.querySelectorAll('[data-wind-anomaly="true"]');
    windElements.forEach(element => {
        element.classList.remove('wind-affected');
        element.removeAttribute('data-wind-anomaly');
    });
    
    // Remove any remaining wind particles, feathers, and leaves
    const particles = document.querySelectorAll('.wind-particle');
    particles.forEach(particle => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    });
    
    const feathers = document.querySelectorAll('.wind-feather');
    feathers.forEach(feather => {
        if (feather.parentNode) {
            feather.parentNode.removeChild(feather);
        }
    });
    
    const leaves = document.querySelectorAll('.wind-leaf');
    leaves.forEach(leaf => {
        if (leaf.parentNode) {
            leaf.parentNode.removeChild(leaf);
        }
    });

};

window.anomalySystem.stopWindBackgroundAnimation = function() {
    // Clear all wind animation intervals
    if (this.windAnimationIntervals) {
        this.windAnimationIntervals.forEach(interval => clearInterval(interval));
        this.windAnimationIntervals = [];
    }
    
    if (this.windParticleInterval) {
        clearInterval(this.windParticleInterval);
        this.windParticleInterval = null;
    }

};

window.anomalySystem.triggerDramaticWindAnomalyFixedDialogue = function() {
    // Wait a bit for the anomaly notification to show, then trigger Fluzzer's relief dialogue
    setTimeout(() => {
        if (window.fluzzerSay && typeof window.fluzzerSay === 'function') {
            const reliefDialogue = this.getDramaticWindAnomalyFixedDialogue();
            window.fluzzerSay(reliefDialogue);
        }
    }, 2000); // 2 second delay to let the notification show first
};

window.anomalySystem.getDramaticWindAnomalyFixedDialogue = function() {
    const reliefDialogues = [
        "Ahh, finally! The wind has calmed down! I can stand still again!",
        "What a relief! No more shaking and swaying everywhere!",
        "Thank goodness! The terrarium feels peaceful again without that crazy wind!",
        "Perfect! Everything stopped moving around! That was quite the windstorm!",
        "Much better! I can finally tend to the flowers without being blown around!",
        "The wind has stopped! The terrarium feels so much more serene now!",
        "Wonderful! No more dramatic shaking! Everything is stable again!",
        "That was incredible! But I'm glad the supernatural wind is gone now!",
        "Finally some peace and quiet! That wind was making me dizzy!",
        "The calm after the storm! Thank you for fixing that windy chaos!",
        "I can hear myself think again! That wind was so loud and chaotic!",
        "Everything feels solid again! No more wobbling cards and buttons!",
        "The flowers can grow peacefully now without being constantly blown around!",
        "What a dramatic experience! But normal terrarium weather is much better!",
        "I'm so relieved! That mysterious wind force was really intense!"
    ];
    
    return reliefDialogues[Math.floor(Math.random() * reliefDialogues.length)];
};

window.anomalySystem.restoreDramaticWindAnomaly = function(savedAnomaly) {

    // Restore the anomaly state
    this.activeAnomalies.dramaticWindAnomaly = true;
    this.anomalies.push(savedAnomaly);
    
    // Restart the anomaly effect (which will hook all dialogue functions)
    this.startDramaticWindAnomaly(savedAnomaly);
    
    // Set up detection (this might not be called in startDramaticWindAnomaly for restored anomalies)
    this.setupDramaticWindDetection();

};

// Test functions for dramatic wind anomaly
window.testDramaticWindAnomaly = function() {

    window.anomalySystem.spawnDramaticWindAnomaly();

};

// Debug function to check dramatic wind anomaly state
window.debugDramaticWindAnomaly = function() {






    // Check if wind elements exist
    const windBackground = document.getElementById('windBackground');
    const windStyles = document.getElementById('dramaticWindAnomalyStyles');
    const windElements = document.querySelectorAll('[data-wind-anomaly="true"]');
    const windParticles = document.querySelectorAll('.wind-particle');
    const windFeathers = document.querySelectorAll('.wind-feather');
    const windLeaves = document.querySelectorAll('.wind-leaf');







    // Check anomalies array
    const windAnomalies = window.anomalySystem.anomalies.filter(a => a.type === 'dramaticWind');

    if (windAnomalies.length > 0) {

    }

};

// Test function to verify restoration works
window.testDramaticWindAnomalyRestore = function() {

    // First spawn the anomaly

    window.anomalySystem.spawnDramaticWindAnomaly();
    
    // Wait a moment, then save state
    setTimeout(() => {

        window.anomalySystem.saveAnomalyState();
        
        // Clear the anomaly (but don't fix it - just remove it temporarily)

        window.anomalySystem.fixDramaticWindAnomaly();
        
        // Wait a moment, then restore from save
        setTimeout(() => {

            window.anomalySystem.loadAnomalyState();
            
            // Check if restoration worked
            setTimeout(() => {

                window.debugDramaticWindAnomaly();
                
                if (window.anomalySystem.activeAnomalies.dramaticWindAnomaly) {

                } else {

                }
            }, 1000);
        }, 1000);
    }, 2000);
};

window.clearDramaticWindAnomaly = function() {

    window.anomalySystem.fixDramaticWindAnomaly();

};

window.checkDramaticWindAnomalyStatus = function() {







    // Show wind-affected elements count
    const windElements = document.querySelectorAll('[data-wind-anomaly="true"]');

    // Show all wind particle counts
    const windParticles = document.querySelectorAll('.wind-particle');
    const windFeathers = document.querySelectorAll('.wind-feather');
    const windLeaves = document.querySelectorAll('.wind-leaf');




};

// Test mutual exclusion with other anomalies
window.testWindMutualExclusion = function() {

    // Test with rustling flowers

    window.anomalySystem.spawnRustlingFlowersAnomaly();


    window.anomalySystem.spawnDramaticWindAnomaly();


    // Clear for second test
    window.anomalySystem.fixDramaticWindAnomaly();
    
    // Test with fluzzer flip

    window.anomalySystem.spawnFluzzerFlipAnomaly();


    window.anomalySystem.spawnDramaticWindAnomaly();



};

window.clearRustlingFlowersAnomaly = function() {

    window.anomalySystem.fixRustlingFlowersAnomaly();

};

window.checkRustlingFlowersAnomalyStatus = function() {






    // Show current rustling flower indices
    if (window.rustlingFlowerIndices) {


        // Count how many flower cells actually have the rustling CSS class
        const rustlingCells = document.querySelectorAll('.terrarium-flower-cell.terrarium-flower-rustle');

    }
    
    // Show total flower grid info
    if (window.terrariumFlowerGrid) {
        const nonNullCells = window.terrariumFlowerGrid.filter(cell => cell !== null).length;
        const totalCells = window.terrariumFlowerGrid.length;

    }
};

// Test functions for fluzzer flip anomaly
window.testFluzzerFlipAnomaly = function() {

    window.anomalySystem.spawnFluzzerFlipAnomaly();

};

window.clearFluzzerFlipAnomaly = function() {

    window.anomalySystem.fixFluzzerFlipAnomaly();

};

window.checkFluzzerFlipAnomalyStatus = function() {





    // Count current flipped Fluzzer images
    const flippedImages = document.querySelectorAll('img[data-fluzzer-flip-anomaly="true"]');

    // List all Fluzzer images found
    const allFluzzerImages = document.querySelectorAll('img[src*="fluzzer"], img[alt*="Fluzzer"], img[alt*="fluzzer"]');

    allFluzzerImages.forEach((img, i) => {

    });
};

// Test functions for crab bucks anomaly
window.testCrabBucksAnomaly = function() {

    window.anomalySystem.spawnCrabBucksAnomaly();

};

window.clearCrabBucksAnomaly = function() {

    window.anomalySystem.fixCrabBucksAnomaly();

};

window.checkCrabBucksAnomalyStatus = function() {






    // Count current crab icons
    const crabIcons = document.querySelectorAll('img[data-crab-anomaly-active="true"]');

};

// Test mutual exclusion between rustling flowers and fluzzer flip anomalies
window.testFlowerFluzzerMutualExclusion = function() {

    // First spawn rustling flowers anomaly

    window.anomalySystem.spawnRustlingFlowersAnomaly();


    setTimeout(() => {
        // Then spawn fluzzer flip anomaly (should clear rustling flowers)

        window.anomalySystem.spawnFluzzerFlipAnomaly();


        setTimeout(() => {
            // Then spawn rustling flowers again (should clear fluzzer flip)

            window.anomalySystem.spawnRustlingFlowersAnomaly();



        }, 2000);
    }, 2000);
};

// Test function for Soap's search mode functionality
window.testSoapSearchMode = function() {

    // Check current friendship level
    const level = (window.friendship && window.friendship.Generator && window.friendship.Generator.level) || 
                  (typeof friendship !== 'undefined' && friendship.Generator && friendship.Generator.level) || 0;

    // Check if search mode is unlocked
    const isUnlocked = window.anomalySystem.isSearchModeUnlocked();

    // Test the buff description
    if (typeof getFriendshipBuffs === 'function') {
        const buffs = getFriendshipBuffs('Generator', level);

    }
    
    // Test anomaly system visibility
    const hasInfinity = window.infinitySystem && window.infinitySystem.totalInfinityEarned >= 1;

    if (hasInfinity) {

    } else {

    }
    
    // Enable find mode to test search functionality
    if (window.anomalySystem.isDetectorVisible) {

        window.anomalySystem.enableFindMode();

    }
};

// Force set Soap friendship level for testing
window.forceSoapFriendshipLevel = function(targetLevel) {
    if (!window.friendship) {

        return;
    }
    
    const oldLevel = window.friendship.Generator.level || 0;
    window.friendship.Generator.level = targetLevel;

    // Test the search mode unlock status
    const isUnlocked = window.anomalySystem.isSearchModeUnlocked();

    // Test buff description
    if (typeof getFriendshipBuffs === 'function') {
        const buffs = getFriendshipBuffs('Generator', targetLevel);

    }
};