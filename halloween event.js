// Halloween Event System for Fluff Inc.

// Initialize Halloween event state
if (!window.state.halloweenEvent) {
  window.state.halloweenEvent = {
    swandy: new Decimal(0),
    isActive: window.state.halloweenEventActive || false,
    currentSubTab: 'hub',
    candyTokensGiven: new Decimal(0), // Track candy tokens given to unlock the event
    treeOfHorrors: {
      level: 1,
      totalFed: new Decimal(0)
    },
    peachy: {
      lastInteraction: 0,
      interactionCooldown: 10000, // 10 seconds cooldown
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween peachy.png'
    }
  };
}

// Ensure candyTokensGiven exists even if halloweenEvent was already initialized
if (!window.state.halloweenEvent.candyTokensGiven) {
  window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
}

// Ensure peachy object exists even if halloweenEvent was already initialized
if (!window.state.halloweenEvent.peachy) {
  window.state.halloweenEvent.peachy = {
    lastInteraction: 0,
    interactionCooldown: 10000,
    totalInteractions: 0,
    isTalking: false,
    speechTimer: null,
    currentImage: 'assets/icons/halloween peachy.png',
    autoSpeechTimer: null,
    lastAutoSpeech: 0
  };
}

// Auto speech system for Halloween Peachy
function startHalloweenPeachyAutoSpeech() {
  // Only start if on Halloween event page and peachy exists
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.peachy) return;
  
  const peachy = window.state.halloweenEvent.peachy;
  
  // Clear any existing timer
  if (peachy.autoSpeechTimer) {
    clearTimeout(peachy.autoSpeechTimer);
  }
  
  // Schedule next auto speech in 20-30 seconds
  const delay = Math.random() * 10000 + 20000; // 20000-30000ms (20-30 seconds)
  
  peachy.autoSpeechTimer = setTimeout(() => {
    // Only speak if currently on Halloween event page and not already talking
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'halloweenEvent' && !peachy.isTalking) {
      showHalloweenPeachySpeech();
      
      // Change to talking image
      const peachyImage = document.getElementById('halloweenPeachyCharacter');
      if (peachyImage) {
        peachyImage.src = 'assets/icons/halloween peachy speech.png';
        peachy.currentImage = 'assets/icons/halloween peachy speech.png';
      }
    }
    
    // Schedule next auto speech
    startHalloweenPeachyAutoSpeech();
  }, delay);
}

function stopHalloweenPeachyAutoSpeech() {
  if (window.state.halloweenEvent && window.state.halloweenEvent.peachy) {
    const peachy = window.state.halloweenEvent.peachy;
    if (peachy.autoSpeechTimer) {
      clearTimeout(peachy.autoSpeechTimer);
      peachy.autoSpeechTimer = null;
    }
  }
}

// Function to switch to Halloween event page
function switchToHalloweenEvent() {
  // Check if Halloween event is unlocked and active
  if (!window.state.unlockedFeatures || !window.state.unlockedFeatures.halloweenEvent) {
    return;
  }
  
  if (!window.state.halloweenEventActive) {
    return;
  }
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  
  // Show Halloween event page
  const halloweenEventPage = document.getElementById('halloweenEvent');
  if (halloweenEventPage) {
    halloweenEventPage.classList.add('active');
    halloweenEventPage.style.display = 'block';
  }
  
  // Update navigation buttons
  document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
  
  // Add Halloween event cursor class
  document.body.classList.add('halloween-event-active');
  
  // Handle navigation visibility
  const subTab = document.getElementById('subTabNavBar');
  const regularBottomNav = document.getElementById('bottomNav');
  const halloweenBottomNav = document.getElementById('halloweenBottomNav');
  
  if (subTab) subTab.style.display = 'none';
  if (regularBottomNav) regularBottomNav.style.display = 'none';
  if (halloweenBottomNav) halloweenBottomNav.style.display = 'flex';
}

// Define switchPage function if it doesn't exist
if (typeof window.switchPage !== 'function') {
  window.switchPage = function(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.style.display = 'block';
    }
    
    // Update navigation buttons
    document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector(`[data-target="${pageId}"]`);
    if (navBtn) {
      navBtn.classList.add('active');
    }
    
    // Add/remove Halloween event active class for cursor system
    if (pageId === 'halloweenEvent' && window.state && window.state.halloweenEventActive) {
      document.body.classList.add('halloween-event-active');
    } else {
      document.body.classList.remove('halloween-event-active');
    }
    
    // Handle sub-tab and bottom navigation visibility
    const subTab = document.getElementById('subTabNavBar');
    const regularBottomNav = document.getElementById('bottomNav');
    const halloweenBottomNav = document.getElementById('halloweenBottomNav');
    
    if (pageId === 'home') {
      if (subTab) subTab.style.display = 'flex';
      if (regularBottomNav) regularBottomNav.style.display = 'flex';
      if (halloweenBottomNav) halloweenBottomNav.style.display = 'none';
      // Remove Halloween background classes
      document.body.classList.remove('halloween-active');
      document.documentElement.classList.remove('halloween-active');
    } else if (pageId === 'halloweenEvent') {
      if (subTab) subTab.style.display = 'none';
      if (regularBottomNav) regularBottomNav.style.display = 'none';
      if (halloweenBottomNav) halloweenBottomNav.style.display = 'flex';
      // Add Halloween background classes
      document.body.classList.add('halloween-active');
      document.documentElement.classList.add('halloween-active');
    } else {
      if (subTab) subTab.style.display = 'none';
      if (regularBottomNav) regularBottomNav.style.display = 'flex';
      if (halloweenBottomNav) halloweenBottomNav.style.display = 'none';
      // Remove Halloween background classes
      document.body.classList.remove('halloween-active');
      document.documentElement.classList.remove('halloween-active');
    }
  };
}

// Make function globally accessible
window.switchToHalloweenEvent = switchToHalloweenEvent;

// Comprehensive Halloween Event Initialization
function initializeHalloweenEventSystems() {
  
  // Initialize Halloween event state if it doesn't exist
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {
      swandy: new Decimal(0),
      isActive: window.state.halloweenEventActive || false,
      currentSubTab: 'hub',
      candyTokensGiven: new Decimal(0), // Track candy tokens given to unlock the event
      treeOfHorrors: {
        level: 1,
        totalFed: new Decimal(0)
      },
      peachy: {
        lastInteraction: 0,
        interactionCooldown: 10000,
        totalInteractions: 0,
        isTalking: false,
        speechTimer: null,
        currentImage: 'assets/icons/halloween peachy.png',
        autoSpeechTimer: null,
        lastAutoSpeech: 0
      }
    };
  }
  
  // Ensure all sub-objects exist
  if (!window.state.halloweenEvent.candyTokensGiven) {
    window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  }
  
  if (!window.state.halloweenEvent.peachy) {
    window.state.halloweenEvent.peachy = {
      lastInteraction: 0,
      interactionCooldown: 10000,
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween peachy.png',
      autoSpeechTimer: null,
      lastAutoSpeech: 0
    };
  }
  
  if (!window.state.halloweenEvent.treeOfHorrors) {
    window.state.halloweenEvent.treeOfHorrors = {
      level: 1,
      totalFed: new Decimal(0)
    };
  }
  
  // Initialize cursor monitoring
  if (typeof initializeHalloweenCursorMonitor === 'function') {
    initializeHalloweenCursorMonitor();
  }
  
  // Start Peachy auto speech
  if (typeof startHalloweenPeachyAutoSpeech === 'function') {
    startHalloweenPeachyAutoSpeech();
  }
  
  // Apply Halloween visual theming
  if (typeof updateHalloweenCargoTheme === 'function') {
    setTimeout(updateHalloweenCargoTheme, 100);
  }
  
  // Apply Halloween cargo theme immediately if on home page
  if (typeof applyHalloweenCargoTheme === 'function') {
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'home') {
      applyHalloweenCargoTheme();
    }
  }
  
  // Initialize Halloween cursors for current page
  if (typeof addHalloweenCursorEffects === 'function') {
    addHalloweenCursorEffects();
  }
  
  // Apply Halloween theming to current page if it's the Halloween event page
  const currentPage = document.querySelector('.page.active');
  if (currentPage && currentPage.id === 'halloweenEvent') {
    document.body.classList.add('halloween-event-active');
    document.documentElement.classList.add('halloween-event-active');
  }
  
  // Trigger Halloween theming for any currently visible elements
  setTimeout(() => {
    // Update any visible character images
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    }
    if (typeof updateHalloweenSoapImages === 'function') {
      updateHalloweenSoapImages();
    }
    if (typeof updateHalloweenMysticImages === 'function') {
      updateHalloweenMysticImages();
    }
    if (typeof updateHalloweenTicoImages === 'function') {
      updateHalloweenTicoImages();
    }
    if (typeof updateHalloweenLepreImages === 'function') {
      updateHalloweenLepreImages();
    }
    if (typeof updateHalloweenFluzzerImages === 'function') {
      updateHalloweenFluzzerImages();
    }
    if (typeof updateHalloweenPeachyImages === 'function') {
      updateHalloweenPeachyImages();
    }
    
    // Initialize Halloween Vi system
    if (typeof initializeHalloweenViSystem === 'function') {
      initializeHalloweenViSystem();
    }
    
    // Apply Halloween background styling
    document.body.style.setProperty('--halloween-active', '1');
    
    // Check if we need to apply Halloween time display
    if (typeof updateTimeDisplay === 'function') {
      updateTimeDisplay();
    }
  }, 200);
  
}

// Force immediate Halloween theme application
function forceHalloweenThemeUpdate() {
  if (!window.state || !window.state.halloweenEventActive) {
    return;
  }
  
  
  // Clear any existing cleanup timers
  if (window._halloweenCleanupTimer) {
    clearTimeout(window._halloweenCleanupTimer);
    window._halloweenCleanupTimer = null;
  }
  
  const currentPage = document.querySelector('.page.active');
  if (currentPage) {
    if (currentPage.id === 'home') {
      document.body.classList.add('halloween-cargo-active');
      if (typeof applyHalloweenCargoTheme === 'function') {
        applyHalloweenCargoTheme();
      }
    } else if (currentPage.id === 'halloweenEvent') {
      document.body.classList.add('halloween-event-active');
    }
  }
  
  // Initialize Halloween cursors (safe to call multiple times)
  if (typeof addHalloweenCursorEffects === 'function') {
    addHalloweenCursorEffects();
  }
  
  // Apply Halloween background styling
  document.body.style.setProperty('--halloween-active', '1');
  
  // Force immediate visual updates
  if (typeof updateMainCargoCharacterImage === 'function') {
    updateMainCargoCharacterImage();
  }
  if (typeof updateTerrariumCharacterImage === 'function') {
    updateTerrariumCharacterImage();
  }
  if (typeof updateHalloweenSoapImages === 'function') {
    updateHalloweenSoapImages();
  }
  if (typeof updateHalloweenMysticImages === 'function') {
    updateHalloweenMysticImages();
  }
  if (typeof updateHalloweenTicoImages === 'function') {
    updateHalloweenTicoImages();
  }
  if (typeof updateHalloweenLepreImages === 'function') {
    updateHalloweenLepreImages();
  }
  if (typeof updateHalloweenFluzzerImages === 'function') {
    updateHalloweenFluzzerImages();
  }
  if (typeof updateHalloweenPeachyImages === 'function') {
    updateHalloweenPeachyImages();
  }
  
  // Initialize Halloween Vi system
  if (typeof ensureHalloweenViHook === 'function') {
    ensureHalloweenViHook();
  }
  
  if (typeof updateTimeDisplay === 'function') {
    updateTimeDisplay();
  }
  
  // Additional delayed updates for any slow-loading elements
  setTimeout(() => {
    if (window.state && window.state.halloweenEventActive) {
      if (typeof updateHalloweenCargoTheme === 'function') {
        updateHalloweenCargoTheme();
      }
    }
  }, 100);
  
}

// Halloween Event Cleanup
function cleanupHalloweenEventSystems() {
  
  // Set cleanup timer to prevent conflicts
  window._halloweenCleanupTimer = setTimeout(() => {
    // Stop auto speech
    if (typeof stopHalloweenPeachyAutoSpeech === 'function') {
      stopHalloweenPeachyAutoSpeech();
    }
    
    // Remove all Halloween classes
    document.body.classList.remove('halloween-active');
    document.documentElement.classList.remove('halloween-active');
    document.body.classList.remove('halloween-event-active');
    document.body.classList.remove('halloween-cargo-active');
    document.body.classList.remove('halloween-cursor-spinning');
    
    // Remove Halloween cargo theme
    if (typeof removeHalloweenCargoTheme === 'function') {
      removeHalloweenCargoTheme();
    }
    
    // Remove Halloween background styling
    document.body.style.removeProperty('--halloween-active');
    
    // Remove all Halloween cursor styles
    const halloweenCursorStyles = document.getElementById('halloweenCursorStyles');
    if (halloweenCursorStyles) {
      halloweenCursorStyles.remove();
    }
    
    // Remove Halloween cursor elements
    const halloweenSpinningCursor = document.getElementById('halloween-spinning-cursor');
    if (halloweenSpinningCursor) {
      halloweenSpinningCursor.remove();
    }
    
    // Restore normal character images
    if (typeof updateMainCargoCharacterImage === 'function') {
      updateMainCargoCharacterImage();
    }
    if (typeof updateTerrariumCharacterImage === 'function') {
      updateTerrariumCharacterImage();
    }
    
    // Restore normal time display
    if (typeof updateTimeDisplay === 'function') {
      updateTimeDisplay();
    }
    
  }, 10);
}

// Trick or Treat functionality
function trickOrTreat() {
  const now = Date.now();
  const halloweenState = window.state.halloweenEvent;
  
  if (now - halloweenState.lastTrickOrTreat < halloweenState.trickOrTreatCooldown) {
    const remainingTime = Math.ceil((halloweenState.trickOrTreatCooldown - (now - halloweenState.lastTrickOrTreat)) / 1000);
    showToast(`Wait ${remainingTime} more seconds!`, 'warning');
    return;
  }
  
  // Generate random treats (1-5)
  const treatsEarned = Math.floor(Math.random() * 5) + 1;
  halloweenState.treats = halloweenState.treats.add(treatsEarned);
  halloweenState.lastTrickOrTreat = now;
  
  // Update cooldown button
  const btn = document.getElementById('trickOrTreatBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '🎃 Wait...';
    
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '🎃 Trick or Treat!';
    }, halloweenState.trickOrTreatCooldown);
  }
  
  updateHalloweenUI();
  showToast(`Got ${treatsEarned} Halloween treats! 🍬`, 'success');
}

// Buy Halloween upgrades
function buyHalloweenUpgrade(upgradeType) {
  const halloweenState = window.state.halloweenEvent;
  let cost, maxLevel;
  
  switch (upgradeType) {
    case 'sweetMultiplier':
      cost = new Decimal(50).mul(new Decimal(2).pow(halloweenState.upgrades.sweetMultiplier));
      maxLevel = 10;
      break;
    case 'ghostlyBoost':
      cost = new Decimal(100).mul(new Decimal(3).pow(halloweenState.upgrades.ghostlyBoost));
      maxLevel = 5;
      break;
    default:
      return;
  }
  
  if (halloweenState.upgrades[upgradeType] >= maxLevel) {
    showToast('Upgrade maxed out!', 'info');
    return;
  }
  
  if (halloweenState.treats.gte(cost)) {
    halloweenState.treats = halloweenState.treats.sub(cost);
    halloweenState.upgrades[upgradeType]++;
    updateHalloweenUI();
    showToast(`Purchased ${upgradeType}!`, 'success');
  } else {
    showToast('Not enough treats!', 'warning');
  }
}

// Halloween Peachy dialogue
const halloweenPeachyQuotes = [
  "Boo! Did I scare you? Just kidding, I'm too cute to be scary!",
  "Halloween is my favorite time of year! So many treats to collect!",
  "I dressed up as... myself! Pretty convincing, right?",
  "Want some Swandy? I found these lying around the spooky corners!",
  "This Halloween outfit makes me feel extra mischievous!",
  "I've been practicing my spooky laugh... Mwahahaha! How was that?",
  "The best part about Halloween? All the orange decorations match my colors!",
  "I tried to carve a pumpkin, but it looked more like a box. Old habits!",
  "Halloween tip from me: Always check your candy for extra Swandy!",
  "Being spooky is hard work, but someone's gotta do it!",
  "I wonder if the boxes are scared of Halloween too...",
  "This Halloween magic makes the Swandy extra sweet!",
  "Trick or treat? How about I give you some Swandy instead!",
  "I've been practicing my ghost impression... WooOOOooo!",
  "Halloween makes everything more fun, even collecting Swandy!",
  "Did you hear that creaking? Oh wait, that was just me stepping on a leaf!",
  "I love how the moonlight makes everything look extra spooky tonight!",
  "My Halloween costume? I'm dressed as the cutest box generator ever!",
  "The spirits told me you're doing great! Keep up the good work!",
  "I found some cobwebs earlier, but they were just decoration... I think.",
  "Want to hear a spooky story? Once upon a time, someone ran out of Swandy!",
  "The autumn air makes my whiskers tingle with Halloween excitement!",
  "I've been collecting candy all day, but Swandy is still the sweetest!",
  "Do you think pumpkins dream of becoming jack-o'-lanterns?",
  "This foggy weather is perfect for a mysterious Halloween atmosphere!",
  "I saw a bat earlier! It reminded me of the night theme in the game.",
  "Halloween night is when all the best magical things happen!",
  "The witching hour is approaching... time for more Swandy collection!",
  "I tried to make a potion, but it just turned into more Halloween treats!",
  "Every shadow looks like it might be hiding more Halloween surprises!",
  "The Halloween spirit is strong tonight - can you feel it too?",
  "I wonder if ghosts like collecting boxes as much as we do?",
  "This spooky music in the background really sets the Halloween mood!",
  "Orange and black are such perfect Halloween colors, don't you think?",
  "I heard the Tree of Horrors is growing bigger with each treat it gets!",
  "The jack-o'-lanterns are grinning at us - they must approve of our work!",
  "Halloween candy is nice, but have you tried magical Swandy?",
  "I love how everything glows mysteriously during Halloween events!",
  "The crisp autumn air makes me want to dance with joy!",
  "Did you know Halloween Peachys have special magical powers?",
  "I can sense Halloween magic flowing through the entire realm!",
  "The stars seem extra twinkly on Halloween night, don't they?",
  "I've been practicing my spooky poses for hours - how do I look?",
  "Every rustling leaf sounds like a Halloween adventure waiting to happen!",
  "The Halloween decorations make everything look so enchanting!",
  "I wonder if the other characters are enjoying Halloween as much as we are?",
  "This mystical Halloween energy makes me feel extra playful tonight!",
  "The autumn wind carries whispers of Halloween magic and mystery!",
  "I love how the candlelight flickers and creates dancing shadows!",
  "Halloween treats taste even better when shared with friends!",
  "The spooky atmosphere makes every moment feel like an adventure!",
  "I can practically taste the Halloween magic in the air tonight!",
  "Did you see those Halloween lights twinkling in the distance?",
  "The mysterious fog makes everything look like a fairy tale!",
  "I feel like we're part of a magical Halloween story right now!",
  "The owls are hooting their Halloween songs in the trees!",
  "This enchanted Halloween evening feels absolutely perfect!",
  "I love how the autumn leaves crunch under our feet!",
  "The Halloween moon is casting such beautiful silver light tonight!",
  "Every corner seems to hide new Halloween surprises and delights!",
  "The crisp night air fills me with Halloween excitement and wonder!",
  "I can hear the distant sound of Halloween festivities echoing around us!"
];

// Character interaction with Halloween Peachy
function interactWithHalloweenPeachy() {
  // Ensure Halloween event state exists
  if (!window.state.halloweenEvent) {
    return;
  }
  
  const halloweenState = window.state.halloweenEvent;
  
  // Ensure peachy object exists
  if (!halloweenState.peachy) {
    halloweenState.peachy = {
      lastInteraction: 0,
      interactionCooldown: 10000,
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween peachy.png',
      autoSpeechTimer: null,
      lastAutoSpeech: 0
    };
  }
  
  // Ensure auto speech properties exist
  if (!halloweenState.peachy.hasOwnProperty('autoSpeechTimer')) {
    halloweenState.peachy.autoSpeechTimer = null;
  }
  if (!halloweenState.peachy.hasOwnProperty('lastAutoSpeech')) {
    halloweenState.peachy.lastAutoSpeech = 0;
  }
  
  const peachy = halloweenState.peachy;
  
  // No rewards, just speech interaction
  peachy.totalInteractions++;
  
  // Show Halloween Peachy speech
  showHalloweenPeachySpeech();
  
  // Change to talking image
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  if (peachyImage) {
    peachyImage.src = 'assets/icons/halloween peachy speech.png';
    peachy.currentImage = 'assets/icons/halloween peachy speech.png';
  }
  
  if (typeof updateHalloweenUI === 'function') {
    updateHalloweenUI();
  }
}

// Legacy function for backwards compatibility
function interactWithPeachy() {
  interactWithHalloweenPeachy();
}

// Show Halloween Peachy speech bubble
function showHalloweenPeachySpeech() {
  // Ensure Halloween event state exists
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.peachy) {
    return;
  }
  
  const halloweenState = window.state.halloweenEvent;
  const peachy = halloweenState.peachy;
  
  const speechBubble = document.getElementById('halloweenPeachySpeech');
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  
  if (!speechBubble || !peachyImage) {
    return;
  }
  
  // Clear any existing speech timer
  if (peachy.speechTimer) {
    clearTimeout(peachy.speechTimer);
    peachy.speechTimer = null;
  }
  
  // Get random Halloween quote
  const randomQuote = halloweenPeachyQuotes[Math.floor(Math.random() * halloweenPeachyQuotes.length)];
  speechBubble.textContent = randomQuote;
  
  // Show speech bubble with multiple display methods for reliability
  speechBubble.style.display = 'block';
  speechBubble.style.visibility = 'visible';
  speechBubble.style.opacity = '1';
  speechBubble.classList.add('show');
  peachy.isTalking = true;
  
  // Hide speech bubble after 4 seconds and change back to normal image
  peachy.speechTimer = setTimeout(() => {
    speechBubble.style.display = 'none';
    speechBubble.style.visibility = 'hidden';
    speechBubble.style.opacity = '0';
    speechBubble.classList.remove('show');
    peachy.isTalking = false;
    
    // Change back to normal Halloween image
    if (peachyImage) {
      peachyImage.src = 'assets/icons/halloween peachy.png';
      peachy.currentImage = 'assets/icons/halloween peachy.png';
    }
    
    peachy.speechTimer = null;
  }, 4000);
}

// Update Halloween UI
function updateHalloweenUI() {
  const halloweenState = window.state.halloweenEvent;
  
  // Update treat count (if element exists, for backward compatibility)
  const treatCountElement = document.getElementById('treatCount');
  if (treatCountElement) {
    treatCountElement.textContent = DecimalUtils.formatDecimal(halloweenState.treats);
  }
  
  // Update Swandy count
  const swandyCountElement = document.getElementById('swandyCount');
  if (swandyCountElement) {
    swandyCountElement.textContent = DecimalUtils.formatDecimal(halloweenState.swandy);
  }
  
  // Update shop buttons
  updateHalloweenShopButtons();
}

// Update Halloween shop button states and costs
function updateHalloweenShopButtons() {
  const halloweenState = window.state.halloweenEvent;
  
  // Update Sweet Multiplier button
  const sweetBtn = document.querySelector('[onclick="buyHalloweenUpgrade(\'sweetMultiplier\')"]');
  if (sweetBtn) {
    const level = halloweenState.upgrades.sweetMultiplier;
    const cost = new Decimal(50).mul(new Decimal(2).pow(level));
    const maxLevel = 10;
    
    if (level >= maxLevel) {
      sweetBtn.textContent = 'Maxed Out!';
      sweetBtn.disabled = true;
    } else {
      sweetBtn.textContent = `Buy for ${DecimalUtils.formatDecimal(cost)} treats (Lv.${level})`;
      sweetBtn.disabled = halloweenState.treats.lt(cost);
    }
  }
  
  // Update Ghostly Boost button
  const ghostBtn = document.querySelector('[onclick="buyHalloweenUpgrade(\'ghostlyBoost\')"]');
  if (ghostBtn) {
    const level = halloweenState.upgrades.ghostlyBoost;
    const cost = new Decimal(100).mul(new Decimal(3).pow(level));
    const maxLevel = 5;
    
    if (level >= maxLevel) {
      ghostBtn.textContent = 'Maxed Out!';
      ghostBtn.disabled = true;
    } else {
      ghostBtn.textContent = `Buy for ${DecimalUtils.formatDecimal(cost)} treats (Lv.${level})`;
      ghostBtn.disabled = halloweenState.treats.lt(cost);
    }
  }
}

// Get Halloween Soap character image based on state
function getHalloweenSoapImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Soap images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/soap speech.png';
      case 'sleep': return 'assets/icons/soap sleeping.png';
      case 'sleep_talk': return 'assets/icons/soap sleep talking.png';
      case 'mad': return 'assets/icons/soap mad.png';
      default: return 'assets/icons/soap.png';
    }
  }
  
  // Return Halloween Soap images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween soap speech.png';
    case 'sleep': return 'assets/icons/halloween soap sleep.png';
    case 'sleep_talk': return 'assets/icons/halloween soap sleep talk.png';
    case 'mad': return 'assets/icons/halloween soap.png'; // Use normal Halloween soap for mad state
    default: return 'assets/icons/halloween soap.png';
  }
}

// Get Halloween Mystic character image based on state
function getHalloweenMysticImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Mystic images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/chef mystic speech.png';
      default: return 'assets/icons/chef mystic.png';
    }
  }
  
  // Return Halloween Mystic images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween mystic speech.png';
    default: return 'assets/icons/halloween mystic.png';
  }
}

// Update all Soap character images to use Halloween versions when active
function updateHalloweenSoapImages() {
  // Update generator tab Soap image
  const generatorSoapImg = document.getElementById('swariaGeneratorCharacter');
  if (generatorSoapImg) {
    // Determine current state
    let imageType = 'normal';
    if (window.isSoapSleeping) {
      imageType = generatorSoapImg.src.includes('sleep talking') ? 'sleep_talk' : 'sleep';
    } else if (generatorSoapImg.src.includes('speech')) {
      imageType = 'speech';
    } else if (generatorSoapImg.src.includes('mad')) {
      imageType = 'mad';
    }
    generatorSoapImg.src = getHalloweenSoapImage(imageType);
  }
  
  // Update charger tab Soap image
  const chargerSoapImg = document.getElementById('soapChargerCharacter');
  if (chargerSoapImg) {
    let imageType = 'normal';
    if (chargerSoapImg.src.includes('speech')) {
      imageType = 'speech';
    }
    chargerSoapImg.src = getHalloweenSoapImage(imageType);
  }
}

// Update all Mystic character images to use Halloween versions when active
function updateHalloweenMysticImages() {
  // Update kitchen tab Mystic image
  const kitchenMysticImg = document.getElementById('kitchenCharacterImg');
  if (kitchenMysticImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (kitchenMysticImg.src.includes('speech')) {
      imageType = 'speech';
    }
    kitchenMysticImg.src = getHalloweenMysticImage(imageType);
  }
}

// Get Halloween Tico character image based on state
function getHalloweenTicoImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Tico images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/tico speech.png';
      case 'sleep': return 'assets/icons/tico sleep.png';
      case 'sleep_talk': return 'assets/icons/tico sleep talk.png';
      default: return 'assets/icons/tico.png';
    }
  }
  
  // Return Halloween Tico images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween tico speech.png';
    case 'sleep': return 'assets/icons/halloween tico sleep.png';
    case 'sleep_talk': return 'assets/icons/halloween tico sleep talk.png';
    default: return 'assets/icons/halloween tico.png';
  }
}

// Update all Tico character images to use Halloween versions when active
function updateHalloweenTicoImages() {
  // Update front desk tab Tico image
  const frontDeskTicoImg = document.getElementById('ticoCharacterImg');
  if (frontDeskTicoImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (frontDeskTicoImg.src.includes('speech')) {
      imageType = 'speech';
    } else if (frontDeskTicoImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    } else if (frontDeskTicoImg.src.includes('sleeping')) {
      imageType = 'sleep';
    }
    frontDeskTicoImg.src = getHalloweenTicoImage(imageType);
  }
}

// Get Halloween Lepre character image based on state
function getHalloweenLepreImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Lepre images when Halloween is not active
    switch (imageType) {
      case 'speech': return 'assets/icons/lepre speech.png';
      case 'mad': return 'assets/icons/lepre mad.png';
      case 'mad_speech': return 'assets/icons/lepre mad speech.png';
      case 'angry': return 'assets/icons/lepre angry.png';
      case 'angry_speech': return 'assets/icons/lepre angry speech.png';
      default: return 'assets/icons/lepre.png';
    }
  }
  
  // Return Halloween Lepre images when Halloween is active
  switch (imageType) {
    case 'speech': return 'assets/icons/halloween lepre speech.png';
    case 'mad': return 'assets/icons/halloween lepre mad.png';
    case 'mad_speech': return 'assets/icons/halloween lepre mad speech.png';
    case 'angry': return 'assets/icons/halloween lepre angry.png';
    case 'angry_speech': return 'assets/icons/halloween lepre angry speech.png';
    default: return 'assets/icons/halloween lepre.png';
  }
}

// Update all Lepre character images to use Halloween versions when active
function updateHalloweenLepreImages() {
  // Update merchant tab Lepre image (normal image)
  const merchantLepreImg = document.getElementById('lepreCharacterImage');
  if (merchantLepreImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (merchantLepreImg.src.includes('angry speech')) {
      imageType = 'angry_speech';
    } else if (merchantLepreImg.src.includes('angry')) {
      imageType = 'angry';
    } else if (merchantLepreImg.src.includes('mad speech')) {
      imageType = 'mad_speech';
    } else if (merchantLepreImg.src.includes('mad')) {
      imageType = 'mad';
    } else if (merchantLepreImg.src.includes('speech')) {
      imageType = 'speech';
    }
    merchantLepreImg.src = getHalloweenLepreImage(imageType);
  }
  
  // Update merchant tab Lepre speaking image
  const merchantLepreSpeakingImg = document.getElementById('lepreCharacterSpeaking');
  if (merchantLepreSpeakingImg) {
    // Determine current state based on current image
    let imageType = 'speech';
    if (merchantLepreSpeakingImg.src.includes('angry speech')) {
      imageType = 'angry_speech';
    } else if (merchantLepreSpeakingImg.src.includes('mad speech')) {
      imageType = 'mad_speech';
    }
    merchantLepreSpeakingImg.src = getHalloweenLepreImage(imageType);
  }
  
  // Update merchant tab Lepre mad image
  const merchantLepreMadImg = document.getElementById('lepreCharacterMad');
  if (merchantLepreMadImg) {
    merchantLepreMadImg.src = getHalloweenLepreImage('mad');
  }
  
  // Update merchant tab Lepre mad speaking image
  const merchantLepreMadSpeakingImg = document.getElementById('lepreCharacterMadSpeaking');
  if (merchantLepreMadSpeakingImg) {
    merchantLepreMadSpeakingImg.src = getHalloweenLepreImage('mad_speech');
  }
  
  // Update merchant tab Lepre angry image
  const merchantLepreAngryImg = document.getElementById('lepreCharacterAngry');
  if (merchantLepreAngryImg) {
    merchantLepreAngryImg.src = getHalloweenLepreImage('angry');
  }
  
  // Update merchant tab Lepre angry speaking image
  const merchantLepreAngrySpeakingImg = document.getElementById('lepreCharacterAngrySpeaking');
  if (merchantLepreAngrySpeakingImg) {
    merchantLepreAngrySpeakingImg.src = getHalloweenLepreImage('angry_speech');
  }
}

// Get Halloween multipliers for game mechanics
function getHalloweenFluffMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const sweetLevel = window.state.halloweenEvent.upgrades.sweetMultiplier;
  return new Decimal(1).add(new Decimal(0.1).mul(sweetLevel));
}

function getHalloweenGeneratorSpeedMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const ghostLevel = window.state.halloweenEvent.upgrades.ghostlyBoost;
  return new Decimal(1).add(new Decimal(0.05).mul(ghostLevel));
}

// Halloween Sub-Tab Navigation
function switchHalloweenSubTab(tabId) {
  const halloweenState = window.state.halloweenEvent;
  halloweenState.currentSubTab = tabId;
  
  // Hide all sub-content
  document.querySelectorAll('.halloween-sub-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });
  
  // Show target sub-content
  const targetContent = document.getElementById(`halloween${tabId === 'hub' ? 'Hub' : 'Tree'}Content`);
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.style.display = 'block';
  }
  
  // Update bottom navigation buttons
  document.querySelectorAll('.halloween-nav-btn').forEach(btn => btn.classList.remove('active'));
  const targetBtn = document.getElementById(`halloween${tabId === 'hub' ? 'Hub' : 'Tree'}NavBtn`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
  
  // Show/hide header card based on tab
  const headerCard = document.querySelector('#halloweenEvent .header-card');
  if (headerCard) {
    if (tabId === 'treeOfHorrors') {
      headerCard.style.display = 'none';
    } else {
      headerCard.style.display = 'block';
    }
  }
  
  // Update UI for specific tabs
  if (tabId === 'treeOfHorrors') {
    updateTreeOfHorrorsUI();
  }
}

// Tree of Horrors functionality
function upgradeTree() {
  const halloweenState = window.state.halloweenEvent;
  const tree = halloweenState.treeOfHorrors;
  const cost = getTreeUpgradeCost(tree.level);
  
  if (halloweenState.treats.gte(cost)) {
    halloweenState.treats = halloweenState.treats.sub(cost);
    tree.totalFed = tree.totalFed.add(cost);
    tree.level++;
    
    updateTreeOfHorrorsUI();
    updateHalloweenUI(); // Update treat count
    showToast(`Tree upgraded to level ${tree.level}! 🌲`, 'success');
  } else {
    showToast('Not enough treats to feed the tree!', 'warning');
  }
}

function getTreeUpgradeCost(level) {
  return new Decimal(100).mul(new Decimal(2).pow(level - 1));
}

function updateTreeOfHorrorsUI() {
  const halloweenState = window.state.halloweenEvent;
  const tree = halloweenState.treeOfHorrors;
  
  // Update tree level display
  const treeLevelElement = document.getElementById('treeLevel');
  if (treeLevelElement) {
    treeLevelElement.textContent = tree.level;
  }
  
  // Update next cost display
  const treeNextCostElement = document.getElementById('treeNextCost');
  if (treeNextCostElement) {
    if (tree.level >= 5) {
      treeNextCostElement.textContent = 'MAX';
    } else {
      const nextCost = getTreeUpgradeCost(tree.level);
      treeNextCostElement.textContent = DecimalUtils.formatDecimal(nextCost);
    }
  }
  
  // Update upgrade button
  const upgradeBtn = document.getElementById('upgradeTreeBtn');
  if (upgradeBtn) {
    if (tree.level >= 5) {
      upgradeBtn.textContent = '🌲 Tree Maxed!';
      upgradeBtn.disabled = true;
    } else {
      const cost = getTreeUpgradeCost(tree.level);
      upgradeBtn.textContent = `🎃 Feed the Tree (${DecimalUtils.formatDecimal(cost)} treats)`;
      upgradeBtn.disabled = halloweenState.treats.lt(cost);
    }
  }
}

// Get tree bonuses for game mechanics
function getTreeTreatMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const level = window.state.halloweenEvent.treeOfHorrors.level;
  if (level >= 2) return new Decimal(1.25);
  return new Decimal(1);
}

function getTreeHalloweenBonusMultiplier() {
  if (!window.state.halloweenEvent) return new Decimal(1);
  const level = window.state.halloweenEvent.treeOfHorrors.level;
  if (level >= 4) return new Decimal(1.5);
  return new Decimal(1);
}

// Make functions globally accessible
window.switchHalloweenSubTab = switchHalloweenSubTab;
window.upgradeTree = upgradeTree;
window.updateTreeOfHorrorsUI = updateTreeOfHorrorsUI;
window.getTreeTreatMultiplier = getTreeTreatMultiplier;
window.getTreeHalloweenBonusMultiplier = getTreeHalloweenBonusMultiplier;
window.interactWithHalloweenPeachy = interactWithHalloweenPeachy;
window.interactWithPeachy = interactWithPeachy;
window.showHalloweenPeachySpeech = showHalloweenPeachySpeech;
window.startHalloweenPeachyAutoSpeech = startHalloweenPeachyAutoSpeech;
window.stopHalloweenPeachyAutoSpeech = stopHalloweenPeachyAutoSpeech;
window.halloweenPeachyQuotes = halloweenPeachyQuotes;
window.trickOrTreat = trickOrTreat;
window.buyHalloweenUpgrade = buyHalloweenUpgrade;
window.updateHalloweenUI = updateHalloweenUI;
window.getHalloweenSoapImage = getHalloweenSoapImage;
window.updateHalloweenSoapImages = updateHalloweenSoapImages;
window.getHalloweenMysticImage = getHalloweenMysticImage;
window.updateHalloweenMysticImages = updateHalloweenMysticImages;
window.getHalloweenTicoImage = getHalloweenTicoImage;
window.updateHalloweenTicoImages = updateHalloweenTicoImages;
window.getHalloweenLepreImage = getHalloweenLepreImage;
window.updateHalloweenLepreImages = updateHalloweenLepreImages;

// Debug function to reset Halloween event unlock status
function resetHalloweenEventUnlock() {
  if (!window.state.unlockedFeatures) {
    window.state.unlockedFeatures = {};
  }
  
  // Keep Halloween event unlocked but reset the candy tokens given counter
  // This allows you to keep the toggle while testing the unlock mechanism
  window.state.unlockedFeatures.halloweenEvent = true;
  
  // Reset candy tokens given counter only
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  
  // Update button display
  if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
    window.updateHalloweenEventButtonDisplay();
  }
  
  // Ensure Halloween event toggle is available in settings
  if (typeof window.addHalloweenEventToggleButton === 'function') {
    setTimeout(() => {
      window.addHalloweenEventToggleButton();
    }, 100);
  }
  
  
  if (typeof window.showNotification === 'function') {
    window.showNotification('🎃 Candy token counter reset for testing! Halloween toggle preserved.', 'info');
  }
}

// Alternative function to completely reset Halloween event (if needed)
function completelyResetHalloweenEvent() {
  if (!window.state.unlockedFeatures) {
    window.state.unlockedFeatures = {};
  }
  
  // Completely reset Halloween event unlock
  window.state.unlockedFeatures.halloweenEvent = false;
  
  // Reset Halloween event state
  window.state.halloweenEventActive = false;
  
  // Reset candy tokens given counter
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  window.state.halloweenEvent.candyTokensGiven = new Decimal(0);
  
  // Update button display
  if (typeof window.updateHalloweenEventButtonDisplay === 'function') {
    window.updateHalloweenEventButtonDisplay();
  }
  
  // Remove Halloween event toggle from settings if present
  const existingToggle = document.getElementById('halloweenEventToggleCheckbox');
  if (existingToggle && existingToggle.parentNode && existingToggle.parentNode.parentNode) {
    existingToggle.parentNode.parentNode.remove();
  }
  
  console.log('🎃 Halloween event completely reset! You will need to redeem a code to unlock it again.');
  
  if (typeof window.showNotification === 'function') {
    window.showNotification('🎃 Halloween event completely reset! Redeem code to unlock again.', 'warning');
  }
}

window.resetHalloweenEventUnlock = resetHalloweenEventUnlock;
window.completelyResetHalloweenEvent = completelyResetHalloweenEvent;

// Get Halloween Fluzzer character image based on state and phase
function getHalloweenFluzzerImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Fluzzer images when Halloween is not active
    // Check if enhanced state (3+ total infinity)
    const totalInfinity = window.infinitySystem?.totalInfinityEarned || 0;
    const isEnhanced = totalInfinity >= 3;
    
    switch (imageType) {
      case 'speech': return isEnhanced ? 'assets/icons/fluzzer talking 1.png' : 'assets/icons/fluzzer talking.png';
      case 'sleep': return isEnhanced ? 'assets/icons/fluzzer sleeping 1.png' : 'assets/icons/fluzzer sleeping.png';
      case 'sleep_talk': return isEnhanced ? 'assets/icons/fluzzer sleep talking 1.png' : 'assets/icons/fluzzer sleep talking.png';
      default: return isEnhanced ? 'assets/icons/fluzzer 1.png' : 'assets/icons/fluzzer.png';
    }
  }
  
  // Return Halloween Fluzzer images when Halloween is active
  // Check if enhanced state (3+ total infinity)
  const totalInfinity = window.infinitySystem?.totalInfinityEarned || 0;
  const isEnhanced = totalInfinity >= 3;
  
  switch (imageType) {
    case 'speech': return isEnhanced ? 'assets/icons/halloween fluzzer speech1.png' : 'assets/icons/halloween fluzzer speech.png';
    case 'sleep': return isEnhanced ? 'assets/icons/halloween fluzzer sleep1.png' : 'assets/icons/halloween fluzzer sleep.png';
    case 'sleep_talk': return isEnhanced ? 'assets/icons/halloween fluzzer sleep talk1.png' : 'assets/icons/halloween fluzzer sleep talk.png';
    default: return isEnhanced ? 'assets/icons/halloween fluzzer1.png' : 'assets/icons/halloween fluzzer.png';
  }
}

// Update all Fluzzer character images to use Halloween versions when active
function updateHalloweenFluzzerImages() {
  // Update terrarium tab Fluzzer image
  const terrariumFluzzerImg = document.getElementById('fluzzerCharacterImage');
  if (terrariumFluzzerImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (terrariumFluzzerImg.src.includes('talking')) {
      imageType = 'speech';
    } else if (terrariumFluzzerImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    } else if (terrariumFluzzerImg.src.includes('sleeping')) {
      imageType = 'sleep';
    }
    terrariumFluzzerImg.src = getHalloweenFluzzerImage(imageType);
  }
  
  // Update terrarium tab Fluzzer speaking image
  const terrariumFluzzerSpeakingImg = document.getElementById('fluzzerCharacterSpeaking');
  if (terrariumFluzzerSpeakingImg) {
    // Determine current state based on current image
    let imageType = 'speech';
    if (terrariumFluzzerSpeakingImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    }
    terrariumFluzzerSpeakingImg.src = getHalloweenFluzzerImage(imageType);
  }
  
  // Update nectarize tab Fluzzer image
  const nectarizeFluzzerImg = document.getElementById('nectarizeFluzzerImage');
  if (nectarizeFluzzerImg) {
    // Determine current state based on current image
    let imageType = 'normal';
    if (nectarizeFluzzerImg.src.includes('talking')) {
      imageType = 'speech';
    } else if (nectarizeFluzzerImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    } else if (nectarizeFluzzerImg.src.includes('sleeping')) {
      imageType = 'sleep';
    }
    nectarizeFluzzerImg.src = getHalloweenFluzzerImage(imageType);
  }
  
  // Update nectarize tab Fluzzer speaking image
  const nectarizeFluzzerSpeakingImg = document.getElementById('nectarizeFluzzerSpeaking');
  if (nectarizeFluzzerSpeakingImg) {
    // Determine current state based on current image
    let imageType = 'speech';
    if (nectarizeFluzzerSpeakingImg.src.includes('sleep talking')) {
      imageType = 'sleep_talk';
    }
    nectarizeFluzzerSpeakingImg.src = getHalloweenFluzzerImage(imageType);
  }
}

window.getHalloweenFluzzerImage = getHalloweenFluzzerImage;
window.updateHalloweenFluzzerImages = updateHalloweenFluzzerImages;

// Halloween Peachy/Swaria Image Functions
function getHalloweenPeachyImage(imageType = 'normal') {
  if (!window.state || !window.state.halloweenEventActive) {
    // Return regular Swaria images when Halloween is not active
    switch (imageType) {
      case 'speech':
      case 'talking':
        return 'swa talking.png';
      default:
        return 'swa normal.png';
    }
  }
  
  // Return Halloween Peachy images when Halloween is active
  switch (imageType) {
    case 'speech':
    case 'talking':
      return 'assets/icons/halloween peachy speech.png';
    default:
      return 'assets/icons/halloween peachy.png';
  }
}

function updateHalloweenPeachyImages() {
  // Update cafeteria dialogue Peachy images
  const cafeteriaPeachyImages = document.querySelectorAll('.character-image');
  cafeteriaPeachyImages.forEach(img => {
    if (img.src && (img.src.includes('swa') || img.src.includes('peachy'))) {
      const isHalloweenActive = window.state && window.state.halloweenEventActive;
      if (img.classList.contains('speaking') || img.src.includes('talking') || img.src.includes('speech')) {
        img.src = getHalloweenPeachyImage('speech');
      } else {
        img.src = getHalloweenPeachyImage('normal');
      }
    }
  });
}

window.getHalloweenPeachyImage = getHalloweenPeachyImage;
window.updateHalloweenPeachyImages = updateHalloweenPeachyImages;

// Helper function to update all Halloween character images at once
function updateAllHalloweenCharacterImages() {
  if (typeof updateHalloweenSoapImages === 'function') {
    updateHalloweenSoapImages();
  }
  if (typeof updateHalloweenMysticImages === 'function') {
    updateHalloweenMysticImages();
  }
  if (typeof updateHalloweenTicoImages === 'function') {
    updateHalloweenTicoImages();
  }
  if (typeof updateHalloweenLepreImages === 'function') {
    updateHalloweenLepreImages();
  }
  if (typeof updateHalloweenFluzzerImages === 'function') {
    updateHalloweenFluzzerImages();
  }
  if (typeof updateHalloweenPeachyImages === 'function') {
    updateHalloweenPeachyImages();
  }
}

window.updateAllHalloweenCharacterImages = updateAllHalloweenCharacterImages;
window.getHalloweenFluffMultiplier = getHalloweenFluffMultiplier;
window.getHalloweenGeneratorSpeedMultiplier = getHalloweenGeneratorSpeedMultiplier;

// Update Halloween UI when page becomes visible
function onHalloweenPageVisible() {
  updateHalloweenUI();
  
  // Restore the current sub-tab
  const halloweenState = window.state.halloweenEvent;
  if (halloweenState.currentSubTab) {
    switchHalloweenSubTab(halloweenState.currentSubTab);
  }
  
  // Restore Halloween Peachy image state
  const peachyImage = document.getElementById('halloweenPeachyCharacter');
  if (peachyImage && halloweenState.peachy) {
    peachyImage.src = halloweenState.peachy.currentImage || 'assets/icons/halloween peachy.png';
  }
  
  // Show Halloween bottom navigation
  const regularBottomNav = document.getElementById('bottomNav');
  const halloweenBottomNav = document.getElementById('halloweenBottomNav');
  if (regularBottomNav) regularBottomNav.style.display = 'none';
  if (halloweenBottomNav) halloweenBottomNav.style.display = 'flex';
  
  // Ensure Halloween background classes are applied
  document.body.classList.add('halloween-active');
  document.documentElement.classList.add('halloween-active');
  
  // Start auto speech system for Halloween Peachy
  startHalloweenPeachyAutoSpeech();
  
  // Update Halloween character images
  if (typeof updateHalloweenSoapImages === 'function') {
    updateHalloweenSoapImages();
  }
  if (typeof updateHalloweenMysticImages === 'function') {
    updateHalloweenMysticImages();
  }
  if (typeof updateHalloweenTicoImages === 'function') {
    updateHalloweenTicoImages();
  }
  if (typeof updateHalloweenLepreImages === 'function') {
    updateHalloweenLepreImages();
  }
  if (typeof updateHalloweenFluzzerImages === 'function') {
    updateHalloweenFluzzerImages();
  }
  if (typeof updateHalloweenPeachyImages === 'function') {
    updateHalloweenPeachyImages();
  }
  
  // Force update digital clock to show Halloween time
  if (typeof window.updateDigitalClock === 'function') {
    window.updateDigitalClock();
  }
}

// Hook into page switch system to update UI when Halloween page becomes visible
const originalSwitchPage = window.switchPage;
window.switchPage = function(pageId) {
  // Stop auto speech when leaving Halloween page
  if (pageId !== 'halloweenEvent') {
    stopHalloweenPeachyAutoSpeech();
    
    // Force update digital clock when leaving Halloween to restore normal time
    if (typeof window.updateDigitalClock === 'function') {
      window.updateDigitalClock();
    }
  }
  
  originalSwitchPage(pageId);
  
  if (pageId === 'halloweenEvent') {
    onHalloweenPageVisible();
  }
  
  // Update Halloween cargo theme when switching pages
  if (typeof updateHalloweenCargoTheme === 'function') {
    updateHalloweenCargoTheme();
  }
};

// Simple toast notification system for Halloween events
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `halloween-toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Add CSS animations for toasts
const toastStyles = document.createElement('style');
toastStyles.textContent = `
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(toastStyles);

// Halloween Cargo Theme Functions
function applyHalloweenCargoTheme() {
  // Apply Halloween theme to both html and body for full coverage
  document.documentElement.classList.add('halloween-cargo-active');
  document.body.classList.add('halloween-cargo-active');
  
  // Add Halloween decoration elements
  addHalloweenDecorations();
  
  // Apply theme to specific time backgrounds
  applyHalloweenTimeBackgrounds();
}

function removeHalloweenCargoTheme() {
  // Remove Halloween theme from both html and body
  document.documentElement.classList.remove('halloween-cargo-active');
  document.body.classList.remove('halloween-cargo-active');
  
  // Remove Halloween decorations
  removeHalloweenDecorations();
  
  // Restore normal time backgrounds
  restoreNormalTimeBackgrounds();
}

function addHalloweenDecorations() {
  // Only add Halloween themed cursor effects (no floating particles)
  addHalloweenCursorEffects();
}

function removeHalloweenDecorations() {
  // Remove Halloween sparkles
  const sparkles = document.querySelectorAll('.halloween-sparkles');
  sparkles.forEach(sparkle => sparkle.remove());
  
  // Remove cursor effects
  removeHalloweenCursorEffects();
}

function addHalloweenCursorEffects() {
  // Add Halloween cursors for full page
  if (!document.querySelector('#halloween-cursor-trail')) {
    const trailStyle = document.createElement('style');
    trailStyle.id = 'halloween-cursor-trail';
    trailStyle.textContent = `
      @keyframes halloweenSparkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 0.8; transform: scale(1.2); }
      }
      
      @keyframes halloweenCursorSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Halloween cursor for entire page including edges */
      body.halloween-cargo-active:not(.halloween-cursor-spinning),
      body.halloween-cargo-active:not(.halloween-cursor-spinning) *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      html.halloween-cargo-active:not(.halloween-cursor-spinning),
      html.halloween-cargo-active:not(.halloween-cursor-spinning) *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active:not(.halloween-cursor-spinning),
      body.halloween-event-active:not(.halloween-cursor-spinning) *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      html.halloween-event-active:not(.halloween-cursor-spinning),
      html.halloween-event-active:not(.halloween-cursor-spinning) *:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *) {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='%23ff9500' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
      }
      
      /* Ensure normal cursor for Halloween Peachy character */
      .halloween-peachy-container,
      .halloween-peachy-container *,
      #halloweenPeachyCharacter,
      #halloweenPeachy,
      #halloweenPeachy * {
        cursor: none !important;
      }
      
      /* Hide Halloween base cursor when spinning cursor is active */
      body.halloween-cursor-spinning,
      body.halloween-cursor-spinning * {
        cursor: none !important;
      }
      
      /* Ensure full viewport coverage */
      body.halloween-cargo-active:not(.halloween-cursor-spinning)::before,
      body.halloween-event-active:not(.halloween-cursor-spinning)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='%23ff9500' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
        pointer-events: none;
        z-index: -1;
      }
      
      /* Hide default cursor on interactive elements when hovering */
      body.halloween-cargo-active button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active a:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active [onclick]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active .clickable:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active input[type="button"]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active input[type="submit"]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active select:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active .navBtn:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active .floor-btn:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active .halloween-event-btn:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active #subTabNav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active #subTabNavBar button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active .sub-tab-nav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active nav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active #bottomNav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active [data-target]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-cargo-active [role="button"]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active a:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active [onclick]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active .clickable:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active input[type="button"]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active input[type="submit"]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active select:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active .navBtn:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active .floor-btn:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active .halloween-event-btn:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active #subTabNav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active #subTabNavBar button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active .sub-tab-nav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active nav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active #bottomNav button:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active [data-target]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *),
      body.halloween-event-active [role="button"]:hover:not(.halloween-peachy-container):not(.halloween-peachy-container *):not(#halloweenPeachyCharacter):not(#halloweenPeachy):not(#halloweenPeachy *) {
        cursor: none !important;
      }
      
      /* Force normal cursor for Halloween Peachy with highest specificity */
      body.halloween-cargo-active .halloween-peachy-container,
      body.halloween-cargo-active .halloween-peachy-container *,
      body.halloween-cargo-active #halloweenPeachyCharacter,
      body.halloween-cargo-active #halloweenPeachy,
      body.halloween-cargo-active #halloweenPeachy *,
      body.halloween-event-active .halloween-peachy-container,
      body.halloween-event-active .halloween-peachy-container *,
      body.halloween-event-active #halloweenPeachyCharacter,
      body.halloween-event-active #halloweenPeachy,
      body.halloween-event-active #halloweenPeachy *,
      html.halloween-cargo-active .halloween-peachy-container,
      html.halloween-cargo-active .halloween-peachy-container *,
      html.halloween-cargo-active #halloweenPeachyCharacter,
      html.halloween-cargo-active #halloweenPeachy,
      html.halloween-cargo-active #halloweenPeachy *,
      html.halloween-event-active .halloween-peachy-container,
      html.halloween-event-active .halloween-peachy-container *,
      html.halloween-event-active #halloweenPeachyCharacter,
      html.halloween-event-active #halloweenPeachy,
      html.halloween-event-active #halloweenPeachy * {
        cursor: pointer !important;
      }
      
      /* Spinning cursor follower element */
      #halloween-spinning-cursor {
        position: fixed;
        width: 22px;
        height: 22px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Cpath d='M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z' fill='%23ff6b35' opacity='0.9'/%3E%3Cpath d='M11 3 L12.5 8.5 L18 11 L12.5 13.5 L11 19 L9.5 13.5 L4 11 L9.5 8.5 Z' fill='%23ffaa33' opacity='0.7'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        pointer-events: none;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.2s ease;
        animation: halloweenCursorSpin 2s linear infinite;
        transform-origin: 11px 11px;
        margin-left: -11px;
        margin-top: -11px;
      }
      
      /* Special cursor for character interactions */
      body.halloween-cargo-active #swariaCharacter,
      body.halloween-cargo-active .character-image:not(#halloweenPeachyCharacter),
      body.halloween-event-active #swariaCharacter,
      body.halloween-event-active .character-image:not(#halloweenPeachyCharacter) {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z' fill='%23ff9500' opacity='1'/%3E%3Cpath d='M12 3 L14 9 L20 12 L14 15 L12 21 L10 15 L4 12 L10 9 Z' fill='%23ffcc66' opacity='0.8'/%3E%3Ccircle cx='12' cy='12' r='2' fill='%23fff' opacity='0.9'/%3E%3C/svg%3E") 12 12, pointer !important;
      }
      
      /* Override for Halloween Peachy - always use normal pointer */
      body.halloween-cargo-active #halloweenPeachyCharacter,
      body.halloween-cargo-active .halloween-peachy-container,
      body.halloween-cargo-active .halloween-peachy-container *,
      body.halloween-event-active #halloweenPeachyCharacter,
      body.halloween-event-active .halloween-peachy-container,
      body.halloween-event-active .halloween-peachy-container *,
      html.halloween-cargo-active #halloweenPeachyCharacter,
      html.halloween-cargo-active .halloween-peachy-container,
      html.halloween-cargo-active .halloween-peachy-container *,
      html.halloween-event-active #halloweenPeachyCharacter,
      html.halloween-event-active .halloween-peachy-container,
      html.halloween-event-active .halloween-peachy-container * {
        cursor: none !important;
        pointer-events: auto !important;
        z-index: 1000 !important;
      }
      
      /* Text input cursor */
      body.halloween-cargo-active input[type="text"],
      body.halloween-cargo-active input[type="number"],
      body.halloween-cargo-active textarea,
      body.halloween-event-active input[type="text"],
      body.halloween-event-active input[type="number"],
      body.halloween-event-active textarea {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='%23ff9500' opacity='0.6'/%3E%3Cline x1='10' y1='4' x2='10' y2='16' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 10 10, text !important;
      }
    `;
    document.head.appendChild(trailStyle);
    
    // Create spinning cursor element
    const spinningCursor = document.createElement('div');
    spinningCursor.id = 'halloween-spinning-cursor';
    spinningCursor.style.display = 'none';
    document.body.appendChild(spinningCursor);
    
    // Track mouse position and show spinning cursor on hover
    let mouseX = 0;
    let mouseY = 0;
    let isHoveringInteractive = false;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Only update Halloween spinning cursor if no special cursors are active
      if (isHoveringInteractive && !isAnySpecialCursorActive()) {
        spinningCursor.style.left = mouseX + 'px';
        spinningCursor.style.top = mouseY + 'px';
      }
    });
    
    // Interactive elements selector - make it more comprehensive
    const interactiveSelector = 'button, a, [onclick], .clickable, input[type="button"], input[type="submit"], select, .navBtn, .floor-btn, .halloween-event-btn, #subTabNav button, #subTabNavBar button, .sub-tab-nav button, nav button, #bottomNav button, [data-target], [role="button"]';
    
    // Add event listeners for interactive elements
    document.addEventListener('mouseover', (e) => {
      // Only activate Halloween spinning cursor if Halloween is active AND no special cursors are active
      if ((document.body.classList.contains('halloween-cargo-active') || 
          document.body.classList.contains('halloween-event-active')) &&
          !isAnySpecialCursorActive()) {
        // Check if target or any parent matches the selector
        let element = e.target;
        let matchFound = false;
        
        while (element && element !== document) {
          if (element.matches && element.matches(interactiveSelector)) {
            matchFound = true;
            break;
          }
          element = element.parentElement;
        }
        
        if (matchFound) {
          isHoveringInteractive = true;
          spinningCursor.style.opacity = '1';
          spinningCursor.style.left = mouseX + 'px';
          spinningCursor.style.top = mouseY + 'px';
          spinningCursor.style.display = 'block';
          
          // Add class to hide Halloween base cursor while spinning cursor is active
          document.body.classList.add('halloween-cursor-spinning');
          document.documentElement.classList.add('halloween-cursor-spinning');
          
        }
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      // Check if leaving an interactive element
      let element = e.target;
      let matchFound = false;
      
      while (element && element !== document) {
        if (element.matches && element.matches(interactiveSelector)) {
          matchFound = true;
          break;
        }
        element = element.parentElement;
      }
      
      if (matchFound && !isAnySpecialCursorActive()) {
        isHoveringInteractive = false;
        spinningCursor.style.opacity = '0';
        
        // Remove Halloween spinning cursor class to restore base Halloween cursor
        document.body.classList.remove('halloween-cursor-spinning');
        document.documentElement.classList.remove('halloween-cursor-spinning');
        
        setTimeout(() => {
          if (!isHoveringInteractive) {
            spinningCursor.style.display = 'none';
          }
        }, 200);
      }
    });
  }
}

function removeHalloweenCursorEffects() {
  const trailStyle = document.querySelector('#halloween-cursor-trail');
  if (trailStyle) {
    trailStyle.remove();
  }
}

function applyHalloweenTimeBackgrounds() {
  // Halloween backgrounds are now handled by CSS only
}

function getCurrentThemeTime() {
  // Try to get current time theme from existing system
  if (window.state && window.state.theme) {
    return window.state.theme;
  }
  
  // Fallback to checking HTML data attributes or CSS classes
  const html = document.documentElement;
  if (html.dataset.theme === 'dusk') return 'dusk';
  if (html.dataset.theme === 'night') return 'night';
  return 'day';
}

function addHalloweenBackgroundOverlay() {
  // Remove existing overlay
  const existingOverlay = document.querySelector('#halloween-bg-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Create Halloween atmosphere overlay
  const overlay = document.createElement('div');
  overlay.id = 'halloween-bg-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(255, 149, 0, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(139, 69, 19, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: halloweenAtmosphere 15s ease-in-out infinite;
  `;
  
  const homeSection = document.getElementById('home');
  if (homeSection) {
    homeSection.style.position = 'relative';
    homeSection.insertBefore(overlay, homeSection.firstChild);
  }
}

function removeHalloweenBackgroundOverlay() {
  const overlay = document.querySelector('#halloween-bg-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function restoreNormalTimeBackgrounds() {
  // Remove Halloween background overlay
  removeHalloweenBackgroundOverlay();
}

// Update Halloween cargo theme based on toggle state
function updateHalloweenCargoTheme() {
  const isActive = window.state && window.state.halloweenEventActive;
  
  if (isActive) {
    applyHalloweenCargoTheme();
  } else {
    removeHalloweenCargoTheme();
  }
  
  // Update mixing/cauldron interface when Halloween mode changes
  if (typeof window.updateMixingTitles === 'function') {
    window.updateMixingTitles();
  }
}

// Hook into sub-tab switching to update Halloween theme
if (typeof window.switchHomeSubTab !== 'undefined' && !window._halloweenSwitchHomeSubTabOverridden) {
  const originalSwitchHomeSubTab = window.switchHomeSubTab;
  window.switchHomeSubTab = function(subTabId) {
    originalSwitchHomeSubTab.call(this, subTabId);
    
    // Update Halloween cargo theme when switching to cargo sub-tab
    if (typeof updateHalloweenCargoTheme === 'function') {
      // Small delay to ensure tab switch completes
      setTimeout(updateHalloweenCargoTheme, 50);
    }
  };
  window._halloweenSwitchHomeSubTabOverridden = true;
}

// Initialize Halloween cargo theme on page load
document.addEventListener('DOMContentLoaded', function() {
  if (typeof updateHalloweenCargoTheme === 'function') {
    updateHalloweenCargoTheme();
  }
});

// Hook into Halloween toggle function to ensure immediate theme updates
function hookHalloweenToggle() {
  // Hook updateHalloweenEventState if it exists
  if (typeof window.updateHalloweenEventState === 'function' && !window._halloweenUpdateStateHooked) {
    const originalUpdateHalloweenEventState = window.updateHalloweenEventState;
    window.updateHalloweenEventState = function() {
      
      // Call original function first
      originalUpdateHalloweenEventState.call(this);
      
      // Force immediate visual updates when Halloween state changes
      setTimeout(() => {
        if (window.state && window.state.halloweenEventActive) {
          // Halloween is being enabled
          if (typeof forceHalloweenThemeUpdate === 'function') {
            forceHalloweenThemeUpdate();
          } else {
            // Fallback direct application
            const currentPage = document.querySelector('.page.active');
            if (currentPage && currentPage.id === 'home') {
              document.body.classList.add('halloween-cargo-active');
              if (typeof applyHalloweenCargoTheme === 'function') {
                applyHalloweenCargoTheme();
              }
            } else if (currentPage && currentPage.id === 'halloweenEvent') {
              document.body.classList.add('halloween-event-active');
            }
            
            // Initialize Halloween cursors
            if (typeof addHalloweenCursorEffects === 'function') {
              addHalloweenCursorEffects();
            }
            
            // Apply Halloween background styling
            document.body.style.setProperty('--halloween-active', '1');
          }
        } else {
          // Halloween is being disabled
          if (typeof cleanupHalloweenEventSystems === 'function') {
            cleanupHalloweenEventSystems();
          }
        }
        
        if (typeof updateHalloweenCargoTheme === 'function') {
          updateHalloweenCargoTheme();
        }
      }, 10); // Reduced delay for immediate response
    };
    window._halloweenUpdateStateHooked = true;
  }
  
  // Also hook toggleHalloweenEvent directly if it exists
  if (typeof window.toggleHalloweenEvent === 'function' && !window._halloweenToggleHooked) {
    const originalToggleHalloweenEvent = window.toggleHalloweenEvent;
    window.toggleHalloweenEvent = function() {
      
      // Call original function
      originalToggleHalloweenEvent.call(this);
      
      // Additional immediate updates
      setTimeout(() => {
        if (window.state && window.state.halloweenEventActive) {
          if (typeof forceHalloweenThemeUpdate === 'function') {
            forceHalloweenThemeUpdate();
          }
        }
      }, 20);
    };
    window._halloweenToggleHooked = true;
  }
}

// Direct checkbox event listener as additional backup
function addHalloweenCheckboxListener() {
  const checkbox = document.getElementById('halloweenEventToggleCheckbox');
  if (checkbox && !checkbox._halloweenListenerAdded) {
    checkbox.addEventListener('change', function(e) {
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        if (window.state && window.state.halloweenEventActive) {
          if (typeof forceHalloweenThemeUpdate === 'function') {
            forceHalloweenThemeUpdate();
          }
        } else {
          if (typeof cleanupHalloweenEventSystems === 'function') {
            cleanupHalloweenEventSystems();
          }
        }
      }, 50);
    });
    checkbox._halloweenListenerAdded = true;
  }
}

// Try to hook immediately, then retry periodically until successful
hookHalloweenToggle();
addHalloweenCheckboxListener();

// Retry hooks periodically until successful
const hookRetryInterval = setInterval(() => {
  hookHalloweenToggle();
  addHalloweenCheckboxListener();
  
  // Stop retrying after both hooks are established and checkbox listener is added
  if (window._halloweenUpdateStateHooked && window._halloweenToggleHooked) {
    const checkbox = document.getElementById('halloweenEventToggleCheckbox');
    if (!checkbox || checkbox._halloweenListenerAdded) {
      clearInterval(hookRetryInterval);
    }
  }
}, 1000);

// Hook into existing switchPage function to add Halloween cursor support
if (typeof window.switchPage === 'function' && !window._halloweenSwitchPageOverridden) {
  const originalSwitchPage = window.switchPage;
  window.switchPage = function(pageId) {
    // Call original function
    originalSwitchPage.call(this, pageId);
    
    // Add/remove Halloween event active class for cursor system
    if (pageId === 'halloweenEvent' && window.state && window.state.halloweenEventActive) {
      document.body.classList.add('halloween-event-active');
    } else {
      document.body.classList.remove('halloween-event-active');
    }
  };
  window._halloweenSwitchPageOverridden = true;
}

// Monitor for Halloween event page becoming active using MutationObserver
function initializeHalloweenCursorMonitor() {
  // Check immediately on load
  function checkHalloweenEventPage() {
    const halloweenEventPage = document.getElementById('halloweenEvent');
    if (halloweenEventPage && 
        halloweenEventPage.classList.contains('active') && 
        window.state && 
        window.state.halloweenEventActive) {
      document.body.classList.add('halloween-event-active');
    } else {
      document.body.classList.remove('halloween-event-active');
    }
  }

  // Set up observer to watch for page changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
        checkHalloweenEventPage();
      }
    });
  });

  // Observe all page elements for class/style changes
  document.querySelectorAll('.page').forEach(page => {
    observer.observe(page, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });
  });

  // Hook into the main navigation system from script.js
  function hookMainNavigation() {
    document.querySelectorAll('.navBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Small delay to let the main navigation complete
        setTimeout(checkHalloweenEventPage, 100);
      });
    });
  }

  // Also check periodically as a backup
  setInterval(checkHalloweenEventPage, 1000);
  
  // Check immediately
  checkHalloweenEventPage();
  
  // Hook into navigation after a small delay to ensure main script loads first
  setTimeout(hookMainNavigation, 2000);
}

// Initialize the monitor when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHalloweenCursorMonitor);
} else {
  initializeHalloweenCursorMonitor();
}

// Helper function to check if any special cursors are active
function isAnySpecialCursorActive() {
  // Check for anomaly resolver
  if (window.anomalySystem && window.anomalySystem.findModeActive) {
    return true;
  }
  
  // Check for terrarium tools
  if (window.pollenWandActive || window.wateringCanActive) {
    return true;
  }
  
  // Check for any CSS classes that indicate special cursors
  if (document.body.classList.contains('anomaly-resolver-cursor') ||
      document.body.classList.contains('pollen-wand-cursor') ||
      document.body.classList.contains('watering-can-cursor') ||
      document.body.classList.contains('pollen-wand-mode') ||
      document.body.classList.contains('watering-can-mode') ||
      document.body.classList.contains('special-cursor-active')) {
    return true;
  }
  
  return false;
}

// Function to hide all spinning cursors when special cursors become active
function hideAllSpinningCursors() {
  // Hide Halloween spinning cursor
  const halloweenSpinningCursor = document.getElementById('halloween-spinning-cursor');
  if (halloweenSpinningCursor) {
    halloweenSpinningCursor.style.opacity = '0';
    halloweenSpinningCursor.style.display = 'none';
  }
  
  // Hide base game spinning cursor
  const baseSpinningCursor = document.getElementById('base-game-spinning-cursor');
  if (baseSpinningCursor) {
    baseSpinningCursor.style.opacity = '0';
    baseSpinningCursor.style.display = 'none';
  }
  
  // Remove spinning cursor classes
  document.body.classList.remove('halloween-cursor-spinning');
  document.documentElement.classList.remove('halloween-cursor-spinning');
  document.body.classList.remove('base-cursor-spinning');
  document.documentElement.classList.remove('base-cursor-spinning');
}

// Base Game Cursor System (using dynamic color based on settings)
function getColorPalette(colorSetting) {
  switch(colorSetting) {
    case 'green':
      return {
        primary: '%2327ae60',    // #27ae60
        secondary: '%2316a085',  // #16a085
        accent: '%235dde85'      // #5dde85
      };
    case 'blue':
      return {
        primary: '%233498db',    // #3498db
        secondary: '%232980b9',  // #2980b9
        accent: '%235dade2'      // #5dade2
      };
    case 'pink':
      return {
        primary: '%23e91e63',    // #e91e63
        secondary: '%23c2185b',  // #c2185b
        accent: '%23f48fb1'      // #f48fb1
      };
    default:
      return {
        primary: '%2327ae60',    // Default to green
        secondary: '%2316a085',
        accent: '%235dde85'
      };
  }
}

function addBaseGameCursorEffects() {
  // Remove any existing base game cursor styles
  const existingBaseStyles = document.getElementById('baseGameCursorStyles');
  if (existingBaseStyles) {
    existingBaseStyles.remove();
  }

  // Get current color setting
  const currentColor = (window.settings && window.settings.colour) || 'green';
  const colors = getColorPalette(currentColor);

  // Create style element for base game cursors
  const baseStyle = document.createElement('style');
  baseStyle.id = 'baseGameCursorStyles';
  baseStyle.textContent = `
    @keyframes baseGameCursorSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Base game cursor for entire page - only when no special cursors are active */
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active),
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) *:not([style*="cursor"]):not(.custom-cursor),
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active),
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) *:not([style*="cursor"]):not(.custom-cursor) {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto;
    }
    
    /* Hide base cursor when spinning cursor is active */
    body.base-cursor-spinning,
    body.base-cursor-spinning *,
    html.base-cursor-spinning,
    html.base-cursor-spinning * {
      cursor: none !important;
    }
    
    /* Base game cursor - using body element directly when no darkness effect */
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active):not(.global-darkness),
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active):not(.global-darkness) * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
    }
    
    /* Base game cursor during darkness effect - apply to html to avoid interfering with darkness overlay */
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) body.global-darkness,
    html:not(.halloween-cargo-active):not(.halloween-event-active):not(.base-cursor-spinning):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) body.global-darkness * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.8'/%3E%3C/svg%3E") 10 10, auto !important;
    }
    
    /* Hide default cursor on interactive elements when hovering (base game) - but only when no special cursors active */
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) button:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) a:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) [onclick]:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) .clickable:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) input[type="button"]:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) input[type="submit"]:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) select:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) .navBtn:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) .floor-btn:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) #subTabNav button:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) #subTabNavBar button:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) .sub-tab-nav button:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) nav button:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) #bottomNav button:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) [data-target]:hover,
    body:not(.halloween-cargo-active):not(.halloween-event-active):not(.anomaly-resolver-cursor):not(.pollen-wand-cursor):not(.watering-can-cursor):not(.special-cursor-active) [role="button"]:hover {
      cursor: none;
    }
    
    /* Spinning cursor follower element for base game */
    #base-game-spinning-cursor {
      position: fixed;
      width: 22px;
      height: 22px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'%3E%3Cpath d='M11 1 L13.5 8 L21 11 L13.5 14 L11 21 L8.5 14 L1 11 L8.5 8 Z' fill='${colors.secondary}' opacity='0.9'/%3E%3Cpath d='M11 3 L12.5 8.5 L18 11 L12.5 13.5 L11 19 L9.5 13.5 L4 11 L9.5 8.5 Z' fill='${colors.accent}' opacity='0.7'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      pointer-events: none;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.2s ease;
      animation: baseGameCursorSpin 2s linear infinite;
      transform-origin: 11px 11px;
      margin-left: -11px;
      margin-top: -11px;
      display: none;
    }
    
    /* Special cursor for character interactions (base game) */
    body:not(.halloween-cargo-active):not(.halloween-event-active) #swariaCharacter,
    body:not(.halloween-cargo-active):not(.halloween-event-active) .character-image {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z' fill='${colors.primary}' opacity='1'/%3E%3Cpath d='M12 3 L14 9 L20 12 L14 15 L12 21 L10 15 L4 12 L10 9 Z' fill='${colors.accent}' opacity='0.8'/%3E%3Ccircle cx='12' cy='12' r='2' fill='%23fff' opacity='0.9'/%3E%3C/svg%3E") 12 12, pointer !important;
    }
    
    /* Text input cursor (base game) */
    body:not(.halloween-cargo-active):not(.halloween-event-active) input[type="text"],
    body:not(.halloween-cargo-active):not(.halloween-event-active) input[type="number"],
    body:not(.halloween-cargo-active):not(.halloween-event-active) textarea {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z' fill='${colors.primary}' opacity='0.6'/%3E%3Cline x1='10' y1='4' x2='10' y2='16' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E") 10 10, text !important;
    }
  `;
  document.head.appendChild(baseStyle);

  // Create base game spinning cursor element
  const existingBaseSpinning = document.getElementById('base-game-spinning-cursor');
  if (existingBaseSpinning) {
    existingBaseSpinning.remove();
  }

  const baseSpinningCursor = document.createElement('div');
  baseSpinningCursor.id = 'base-game-spinning-cursor';
  document.body.appendChild(baseSpinningCursor);

  // Mouse tracking variables for base game
  let baseMouseX = 0;
  let baseMouseY = 0;
  let baseIsHoveringInteractive = false;

  // Mouse movement tracking for base game
  document.addEventListener('mousemove', (e) => {
    baseMouseX = e.clientX;
    baseMouseY = e.clientY;
    
    // Only update base game cursor if not in Halloween mode AND no special cursors active
    if (!document.body.classList.contains('halloween-cargo-active') && 
        !document.body.classList.contains('halloween-event-active') &&
        !isAnySpecialCursorActive()) {
      baseSpinningCursor.style.left = baseMouseX + 'px';
      baseSpinningCursor.style.top = baseMouseY + 'px';
    }
  });

  // Interactive elements selector for base game
  const baseInteractiveSelector = 'button, a, [onclick], .clickable, input[type="button"], input[type="submit"], select, .navBtn, .floor-btn, #subTabNav button, #subTabNavBar button, .sub-tab-nav button, nav button, #bottomNav button, [data-target], [role="button"]';

  // Add event listeners for interactive elements (base game)
  document.addEventListener('mouseover', (e) => {
    // Only activate for base game (not Halloween modes) AND no special cursors active
    if (!document.body.classList.contains('halloween-cargo-active') && 
        !document.body.classList.contains('halloween-event-active') &&
        !isAnySpecialCursorActive()) {
      // Check if target or any parent matches the selector
      let element = e.target;
      let matchFound = false;
      
      while (element && element !== document) {
        if (element.matches && element.matches(baseInteractiveSelector)) {
          matchFound = true;
          break;
        }
        element = element.parentElement;
      }
      
      if (matchFound) {
        baseIsHoveringInteractive = true;
        baseSpinningCursor.style.opacity = '1';
        baseSpinningCursor.style.left = baseMouseX + 'px';
        baseSpinningCursor.style.top = baseMouseY + 'px';
        baseSpinningCursor.style.display = 'block';
        
        // Add class to hide base cursor while spinning cursor is active
        document.body.classList.add('base-cursor-spinning');
        document.documentElement.classList.add('base-cursor-spinning');
        
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    // Check if leaving an interactive element
    let element = e.target;
    let matchFound = false;
    
    while (element && element !== document) {
      if (element.matches && element.matches(baseInteractiveSelector)) {
        matchFound = true;
        break;
      }
      element = element.parentElement;
    }
    
    if (matchFound && !document.body.classList.contains('halloween-cargo-active') && 
        !document.body.classList.contains('halloween-event-active') &&
        !isAnySpecialCursorActive()) {
      baseIsHoveringInteractive = false;
      baseSpinningCursor.style.opacity = '0';
      
      // Remove spinning cursor class to restore base cursor
      document.body.classList.remove('base-cursor-spinning');
      document.documentElement.classList.remove('base-cursor-spinning');
      
      setTimeout(() => {
        if (!baseIsHoveringInteractive) {
          baseSpinningCursor.style.display = 'none';
        }
      }, 200);
    }
  });
}

// Initialize base game cursor system
function initializeBaseGameCursors() {
  addBaseGameCursorEffects();
}

// Update cursor colors when settings change
function updateBaseGameCursorColors() {
  // Regenerate cursor effects with new colors
  addBaseGameCursorEffects();
}

// Hook into color setting changes
function hookColorSettingChanges() {
  const colorSelect = document.getElementById('colorSelect');
  if (colorSelect) {
    // Store original onchange handler
    const originalOnChange = colorSelect.onchange;
    
    // Create new handler that includes cursor update
    colorSelect.onchange = function(e) {
      // Call original handler first
      if (originalOnChange) {
        originalOnChange.call(this, e);
      }
      
      // Update cursor colors with new setting
      setTimeout(updateBaseGameCursorColors, 100);
    };
  }
}

// Initialize base game cursors when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeBaseGameCursors();
    // Delay hooking to ensure main script loads first
    setTimeout(hookColorSettingChanges, 2000);
  });
} else {
  initializeBaseGameCursors();
  setTimeout(hookColorSettingChanges, 2000);
}

// Global functions
window.applyHalloweenCargoTheme = applyHalloweenCargoTheme;
window.removeHalloweenCargoTheme = removeHalloweenCargoTheme;
window.updateHalloweenCargoTheme = updateHalloweenCargoTheme;
window.initializeBaseGameCursors = initializeBaseGameCursors;
window.initializeHalloweenCursorMonitor = initializeHalloweenCursorMonitor;
window.startHalloweenPeachyAutoSpeech = startHalloweenPeachyAutoSpeech;
window.stopHalloweenPeachyAutoSpeech = stopHalloweenPeachyAutoSpeech;
window.interactWithHalloweenPeachy = interactWithHalloweenPeachy;
window.switchToHalloweenEvent = switchToHalloweenEvent;
window.initializeHalloweenEventSystems = initializeHalloweenEventSystems;
window.cleanupHalloweenEventSystems = cleanupHalloweenEventSystems;
window.addHalloweenCursorEffects = addHalloweenCursorEffects;
window.forceHalloweenThemeUpdate = forceHalloweenThemeUpdate;
window.isAnySpecialCursorActive = isAnySpecialCursorActive;
window.hideAllSpinningCursors = hideAllSpinningCursors;

// Halloween Vi Costume System
// Initialize Halloween Vi state
if (!window.state.halloweenEvent) {
  window.state.halloweenEvent = {};
}

if (!window.state.halloweenEvent.vi) {
  window.state.halloweenEvent.vi = {
    pokeCount: 0,
    isWearingCostume: false,
    costumeStartTime: 0,
    costumeDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    lastPokeTime: 0,
    speechTimer: null
  };
}

// Halloween Vi costume denial dialogue (progressive stages)
const halloweenViCostumeDialogue = {
  // 0-10 pokes: Denial and scientist costume claims
  denial: [
    "Costume? What costume? I'm already wearing my scientist costume.",
    "This lab coat IS my costume. I'm dressed as a brilliant researcher.",
    "I don't need a costume. My natural scientific aura is costume enough.",
    "These safety goggles are part of my sophisticated scientist ensemble.",
    "My prism tail IS the costume. Very avant-garde, wouldn't you say?",
    "I'm going as 'overworked researcher' this Halloween. Very authentic.",
    "This is my costume - professional, practical, and perfectly scientific.",
    "Why would I need another costume when I already look this academic?",
    "My light stick is a costume prop. I'm obviously a wizard... of science.",
    "The lab equipment around me completes my 'mad scientist' look perfectly."
  ],
  
  // 11-25 pokes: Getting slightly defensive
  defensive: [
    "Fine, maybe my 'costume' could use some work, but I'm busy with research.",
    "I suppose a real costume might be... scientifically interesting to analyze.",
    "Stop poking me about costumes. I have important calculations to finish.",
    "Maybe I could modify my lab coat with some... decorative elements.",
    "A costume would just interfere with my precision optical measurements.",
    "I don't have time to think about costumes when I'm solving light equations.",
    "Perhaps a themed lab coat would be... marginally acceptable.",
    "The other researchers might appreciate a more... festive appearance.",
    "I guess Halloween costumes do have some cultural significance to study.",
    "Fine, I'll consider it, but it has to be scientifically accurate."
  ],
  
  // 26-40 pokes: Warming up to the idea
  warming: [
    "Alright, maybe a proper Halloween costume would be... interesting to try.",
    "I've been researching costume optics. Some designs are surprisingly complex.",
    "A well-designed costume could actually enhance my professional image.",
    "I suppose dressing up is just another form of experimental methodology.",
    "The prismatic effects of costume materials might be worth investigating.",
    "Maybe something that complements my prism tail's natural beauty?",
    "I've seen some costumes with fascinating light-refracting properties.",
    "A costume could be a good way to test public reaction variables.",
    "I'm starting to see the scientific merit in Halloween fashion research.",
    "Perhaps I could design a costume that enhances my research capabilities."
  ],
  
  // 41-49 pokes: Almost convinced
  almostConvinced: [
    "You know what? A costume might actually be a good idea.",
    "I've been thinking about it, and Halloween attire could be... fun.",
    "Maybe I should embrace the seasonal traditions for once.",
    "A proper costume would show I can be social when I want to be.",
    "I could design something that's both festive and scientifically sound.",
    "The other department workers would probably appreciate the effort.",
    "Fine, fine! I'll consider getting a real Halloween costume.",
    "Maybe something that makes my prism tail look even more impressive?",
    "You've almost convinced me. A costume could be... acceptable."
  ],
  
  // 50th poke: Gives in
  convinced: [
    "FINE! You win! I'll put on a proper Halloween costume right now!",
    "Alright, alright! You've worn me down. One Halloween costume, coming up!",
    "You're incredibly persistent. Fine, I'll embrace the Halloween spirit!",
    "I can't believe I'm saying this, but... let me go get my costume.",
    "Your dedication to this costume campaign is actually impressive. You win!"
  ],
  
  // While wearing costume
  costumeActive: [
    "There, happy now? I'm wearing a proper Halloween costume.",
    "I have to admit, this costume is more comfortable than I expected.",
    "The Halloween spirit is... surprisingly enjoyable once you embrace it.",
    "I feel oddly festive in this outfit. Is this what fun feels like?",
    "My prism tail looks even more spectacular with this costume design.",
    "I might actually keep this costume for future Halloween celebrations.",
    "You know, dressing up isn't as unscientific as I thought it would be.",
    "Do you like my costume?",
    "The costume's material has interesting light-scattering properties.",
    "What do you mean painting my fur is not wearing a costume? Look at me! I'm more blue!",
    "I feel more social wearing this. Halloween psychology is fascinating.",
    "You probably won't get my costume, but for those who do, :3",
    "This costume makes me want to participate in more facility festivities.",
    "I should probably thank you for encouraging me to try this.",
    "You wanna know what this costume is supposed to be? It's Vivien Denmark edition.",
    "You wanna know what this costume is supposed to be? Yes.",
    "I should be drinking beer in this costume, But I don't like beer, nor do I have any.",
    "The other researchers seem more approachable when we're all in costume."
  ],
  
  // Costume expired
  costumeExpired: [
    "Well, that was... actually quite enjoyable. But back to work now.",
    "Costume time is over. Back to serious scientific business.",
    "That was a nice break from research, but I have work to finish.",
    "I might consider wearing costumes more often... for scientific purposes.",
    "Halloween is over for now, but I'll remember this experience."
  ]
};

// Halloween Vi poke function that replaces the normal one during Halloween
function pokeHalloweenVi() {
  if (!window.state || !window.state.halloweenEventActive) {
    // Fall back to normal poke function if Halloween isn't active
    if (typeof window.pokeAdvancedPrismCharacter === 'function') {
      window.pokeAdvancedPrismCharacter();
    }
    return;
  }

  const now = Date.now();
  const vi = window.state.halloweenEvent.vi;
  
  // Clear any existing speech timer
  if (vi.speechTimer) {
    clearTimeout(vi.speechTimer);
    vi.speechTimer = null;
  }
  
  // Check if costume is active and if it should expire
  if (vi.isWearingCostume && (now - vi.costumeStartTime) > vi.costumeDuration) {
    // Costume expired
    vi.isWearingCostume = false;
    vi.pokeCount = 0; // Reset poke count after costume expires
    updateHalloweenViImages();
    
    // Show costume expired message
    const expiredMessage = halloweenViCostumeDialogue.costumeExpired[Math.floor(Math.random() * halloweenViCostumeDialogue.costumeExpired.length)];
    showHalloweenViSpeech(expiredMessage);
    return;
  }
  
  // If already wearing costume, show costume dialogue
  if (vi.isWearingCostume) {
    // Check if Vi is sleeping
    const isSleepTime = typeof window.isViSleepTime === 'function' ? window.isViSleepTime() : false;
    
    if (isSleepTime) {
      // Use sleep dialogue from the existing system
      if (typeof window.viSpeechPatterns !== 'undefined' && window.viSpeechPatterns.sleeping) {
        const sleepMessage = window.viSpeechPatterns.sleeping[Math.floor(Math.random() * window.viSpeechPatterns.sleeping.length)];
        showHalloweenViSpeech(sleepMessage);
      } else {
        // Fallback sleep message
        showHalloweenViSpeech("zzz... Halloween dreams... zzz...");
      }
    } else {
      const costumeMessage = halloweenViCostumeDialogue.costumeActive[Math.floor(Math.random() * halloweenViCostumeDialogue.costumeActive.length)];
      showHalloweenViSpeech(costumeMessage);
    }
    return;
  }
  
  // Increment poke count
  vi.pokeCount++;
  vi.lastPokeTime = now;
  
  let message;
  
  if (vi.pokeCount >= 50) {
    // 50th poke - Vi gives in and puts on costume
    message = halloweenViCostumeDialogue.convinced[Math.floor(Math.random() * halloweenViCostumeDialogue.convinced.length)];
    
    // Activate costume
    vi.isWearingCostume = true;
    vi.costumeStartTime = now;
    
    // Update Vi's images to Halloween versions
    updateHalloweenViImages();
    
  } else if (vi.pokeCount >= 41) {
    // 41-49 pokes: Almost convinced
    message = halloweenViCostumeDialogue.almostConvinced[Math.floor(Math.random() * halloweenViCostumeDialogue.almostConvinced.length)];
  } else if (vi.pokeCount >= 26) {
    // 26-40 pokes: Warming up
    message = halloweenViCostumeDialogue.warming[Math.floor(Math.random() * halloweenViCostumeDialogue.warming.length)];
  } else if (vi.pokeCount >= 11) {
    // 11-25 pokes: Defensive
    message = halloweenViCostumeDialogue.defensive[Math.floor(Math.random() * halloweenViCostumeDialogue.defensive.length)];
  } else {
    // 0-10 pokes: Denial
    message = halloweenViCostumeDialogue.denial[Math.floor(Math.random() * halloweenViCostumeDialogue.denial.length)];
  }
  
  showHalloweenViSpeech(message);
}

// Function to show Vi's Halloween speech bubble
function showHalloweenViSpeech(message, duration = 8000) {
  const speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
  const speechText = document.getElementById('viAdvancedPrismSpeechText');
  
  if (!speechBubble || !speechText) {
    return;
  }
  
  // Clear any existing timer
  const vi = window.state.halloweenEvent.vi;
  if (vi.speechTimer) {
    clearTimeout(vi.speechTimer);
  }
  
  // Update to speaking image
  updateHalloweenViSpeechImage(true);
  
  // Show speech
  speechText.textContent = message;
  speechBubble.style.display = 'block';
  
  // Hide speech after duration
  vi.speechTimer = setTimeout(() => {
    speechBubble.style.display = 'none';
    updateHalloweenViSpeechImage(false);
    vi.speechTimer = null;
  }, duration);
}

// Function to update Vi's images for Halloween mode
function updateHalloweenViImages() {
  const vi = window.state.halloweenEvent.vi;
  
  // Get all Vi image elements in Advanced Prism tab
  const viNormal = document.getElementById('viCharacterNormal');
  const viTalking = document.getElementById('viCharacterTalking');
  const viSleeping = document.getElementById('viCharacterSleeping');
  const viSleepTalking = document.getElementById('viCharacterSleepTalking');
  
  if (vi.isWearingCostume) {
    // Use Halloween costume images
    if (viNormal) {
      viNormal.src = 'assets/icons/halloween vivien.png';
    }
    if (viTalking) {
      viTalking.src = 'assets/icons/halloween vivien speech.png';
    }
    if (viSleeping) {
      viSleeping.src = 'assets/icons/halloween vivien sleep.png';
    }
    if (viSleepTalking) {
      viSleepTalking.src = 'assets/icons/halloween vivien sleep talk.png';
    }
    
    // Handle sleep state display when wearing costume
    updateHalloweenViSleepDisplay();
  } else {
    // Use normal Vi images (handled by existing functions)
    if (typeof window.updateViCharacterImage === 'function') {
      window.updateViCharacterImage();
    }
  }
}

// Function to handle Vi's sleep display when wearing Halloween costume
function updateHalloweenViSleepDisplay() {
  const viNormal = document.getElementById('viCharacterNormal');
  const viTalking = document.getElementById('viCharacterTalking');
  const viSleeping = document.getElementById('viCharacterSleeping');
  const viSleepTalking = document.getElementById('viCharacterSleepTalking');
  
  // Check if it's sleep time using existing function
  const isSleepTime = typeof window.isViSleepTime === 'function' ? window.isViSleepTime() : false;
  
  if (isSleepTime) {
    // Show sleeping image, hide others
    if (viNormal) viNormal.style.display = 'none';
    if (viTalking) viTalking.style.display = 'none';
    if (viSleeping) viSleeping.style.display = 'block';
    if (viSleepTalking) viSleepTalking.style.display = 'none';
  } else {
    // Show normal image, hide others
    if (viNormal) viNormal.style.display = 'block';
    if (viTalking) viTalking.style.display = 'none';
    if (viSleeping) viSleeping.style.display = 'none';
    if (viSleepTalking) viSleepTalking.style.display = 'none';
  }
}

// Function to update Vi's speech image state
function updateHalloweenViSpeechImage(isSpeaking) {
  const vi = window.state.halloweenEvent.vi;
  
  // Get Vi image elements
  const viNormal = document.getElementById('viCharacterNormal');
  const viTalking = document.getElementById('viCharacterTalking');
  const viSleeping = document.getElementById('viCharacterSleeping');
  const viSleepTalking = document.getElementById('viCharacterSleepTalking');
  
  if (!viNormal || !viTalking) {
    return;
  }
  
  // Check if it's sleep time
  const isSleepTime = typeof window.isViSleepTime === 'function' ? window.isViSleepTime() : false;
  
  if (vi.isWearingCostume) {
    // Use Halloween images and show/hide appropriately
    if (isSleepTime) {
      // Handle sleep speech
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        viSleeping.style.display = 'none';
        if (viSleepTalking) {
          viSleepTalking.style.display = 'block';
          viSleepTalking.src = 'assets/icons/halloween vivien sleep talk.png';
        }
      } else {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        if (viSleeping) {
          viSleeping.style.display = 'block';
          viSleeping.src = 'assets/icons/halloween vivien sleep.png';
        }
      }
    } else {
      // Handle normal speech
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viTalking.src = 'assets/icons/halloween vivien speech.png';
      } else {
        viTalking.style.display = 'none';
        viNormal.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viNormal.src = 'assets/icons/halloween vivien.png';
      }
    }
  } else {
    // Use normal images and show/hide appropriately
    if (isSleepTime) {
      // Handle sleep speech with normal images
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        viSleeping.style.display = 'none';
        if (viSleepTalking) {
          viSleepTalking.style.display = 'block';
          viSleepTalking.src = 'assets/icons/vivien sleep talking.png';
        }
      } else {
        viNormal.style.display = 'none';
        viTalking.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        if (viSleeping) {
          viSleeping.style.display = 'block';
          viSleeping.src = 'assets/icons/vivien sleeping.png';
        }
      }
    } else {
      // Handle normal speech with normal images
      if (isSpeaking) {
        viNormal.style.display = 'none';
        viTalking.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viTalking.src = 'assets/icons/vivien talking.png';
      } else {
        viTalking.style.display = 'none';
        viNormal.style.display = 'block';
        if (viSleeping) viSleeping.style.display = 'none';
        if (viSleepTalking) viSleepTalking.style.display = 'none';
        viNormal.src = 'assets/icons/vivien.png';
      }
    }
  }
}

// Function to check if Vi should use Halloween images for sleeping
function getHalloweenViSleepImage() {
  const vi = window.state.halloweenEvent.vi;
  if (vi && vi.isWearingCostume) {
    return {
      normal: 'assets/icons/halloween vivien sleep.png',
      talking: 'assets/icons/halloween vivien sleep talk.png'
    };
  }
  return null;
}

// Function to determine which character is currently displayed in Advanced Prism area
function getCurrentAdvancedPrismCharacter() {
  // Check if characters are swapped
  if (window.advancedPrismState && window.advancedPrismState.imagesSwapped) {
    // When swapped, Swaria (Peachy) is in the Advanced Prism area
    return 'peachy';
  } else {
    // When not swapped, Vi is in the Advanced Prism area
    return 'vivien';
  }
}

// Function to handle Halloween poke for any character in Advanced Prism
function pokeHalloweenAdvancedPrismCharacter() {
  const currentCharacter = getCurrentAdvancedPrismCharacter();
  
  if (currentCharacter === 'vivien') {
    // Use Vi's Halloween costume system
    pokeHalloweenVi();
  } else if (currentCharacter === 'peachy') {
    // Use Peachy's regular Halloween dialogue
    pokeHalloweenPeachy();
  }
}

// Function to handle Halloween poke for Peachy when she's in Advanced Prism
function pokeHalloweenPeachy() {
  const currentTime = Date.now();
  const peachy = window.state.halloweenEvent.peachy;
  
  // Check cooldown (reuse Peachy's existing cooldown system)
  if (currentTime - peachy.lastInteraction < peachy.interactionCooldown) {
    return;
  }
  
  // Update interaction tracking
  peachy.lastInteraction = currentTime;
  peachy.totalInteractions++;
  
  // Get random Halloween Peachy dialogue
  const randomQuote = halloweenPeachyQuotes[Math.floor(Math.random() * halloweenPeachyQuotes.length)];
  
  // Switch to speaking image when in Advanced Prism area
  updateHalloweenPeachySpeechImage();
  
  // Show speech bubble in Advanced Prism area (using Vi's speech bubble elements)
  showHalloweenViSpeech(randomQuote);
  
  // Add friendship points if system exists
  if (window.friendship && window.friendship.addPoints) {
    window.friendship.addPoints('swaria', new Decimal(0.5));
  }
}

// Function to update Peachy's image to speaking version when in Advanced Prism
function updateHalloweenPeachySpeechImage() {
  // When characters are swapped, Peachy is in the 'swariaInAdvanced' element
  const swariaInAdvanced = document.getElementById('swariaInAdvanced');
  
  if (swariaInAdvanced) {
    // Switch to speaking image
    swariaInAdvanced.src = 'assets/icons/halloween peachy speech.png';
  }
}

// Function to update Peachy's image back to normal version
function updateHalloweenPeachyNormalImage() {
  // When characters are swapped, Peachy is in the 'swariaInAdvanced' element
  const swariaInAdvanced = document.getElementById('swariaInAdvanced');
  
  if (swariaInAdvanced) {
    // Switch back to normal Halloween image
    swariaInAdvanced.src = 'assets/icons/halloween peachy.png';
  }
}

// Function to show Peachy's Halloween speech in Advanced Prism area
function showHalloweenViSpeech(message) {
  const speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
  const speechText = document.getElementById('viAdvancedPrismSpeechText');
  
  if (speechBubble && speechText) {
    speechText.textContent = message;
    speechBubble.style.display = 'block';
    
    // Hide speech bubble and switch back to normal image after 8 seconds
    setTimeout(() => {
      if (speechBubble) {
        speechBubble.style.display = 'none';
      }
      // Switch back to normal image
      updateHalloweenPeachyNormalImage();
    }, 8000);
  }
}

// Hook into the existing poke function to override during Halloween
function hookHalloweenViPoke() {
  // Store original poke functions
  if (typeof window.pokeAdvancedPrismCharacter === 'function' && !window._originalPokeAdvancedPrismCharacter) {
    window._originalPokeAdvancedPrismCharacter = window.pokeAdvancedPrismCharacter;
  }
  
  if (typeof window.pokeVi === 'function' && !window._originalPokeVi) {
    window._originalPokeVi = window.pokeVi;
  }
  
  // Override pokeAdvancedPrismCharacter with Halloween version
  window.pokeAdvancedPrismCharacter = function() {
    if (window.state && window.state.halloweenEventActive) {
      pokeHalloweenAdvancedPrismCharacter();
    } else {
      // Call original function if Halloween isn't active
      if (window._originalPokeAdvancedPrismCharacter) {
        window._originalPokeAdvancedPrismCharacter();
      }
    }
  };
  
  // Also override pokeVi directly for safety
  window.pokeVi = function() {
    if (window.state && window.state.halloweenEventActive) {
      pokeHalloweenAdvancedPrismCharacter();
    } else {
      // Call original function if Halloween isn't active
      if (window._originalPokeVi) {
        window._originalPokeVi();
      } else if (window._originalPokeAdvancedPrismCharacter) {
        window._originalPokeAdvancedPrismCharacter();
      }
    }
  };
}

// Hook into Vi image update system to preserve Halloween costume
function hookHalloweenViImageUpdates() {
  // Store original updateViCharacterImage function
  if (typeof window.updateViCharacterImage === 'function' && !window._originalUpdateViCharacterImage) {
    window._originalUpdateViCharacterImage = window.updateViCharacterImage;
  }
  
  // Override updateViCharacterImage to check for Halloween costume
  window.updateViCharacterImage = function() {
    const currentCharacter = getCurrentAdvancedPrismCharacter();
    
    // Only apply Halloween Vi costume system if Vi is actually displayed
    if (currentCharacter === 'vivien' && 
        window.state && window.state.halloweenEventActive && 
        window.state.halloweenEvent && window.state.halloweenEvent.vi && 
        window.state.halloweenEvent.vi.isWearingCostume) {
      
      // Check if costume should expire
      const now = Date.now();
      const vi = window.state.halloweenEvent.vi;
      if ((now - vi.costumeStartTime) > vi.costumeDuration) {
        // Costume expired, remove it
        vi.isWearingCostume = false;
        vi.pokeCount = 0;
        // Fall through to normal update
      } else {
        // Costume is still active, maintain Halloween images
        updateHalloweenViImages();
        return;
      }
    }
    
    // For Peachy or when Vi isn't wearing costume, use normal behavior
    // Call original function for normal behavior
    if (window._originalUpdateViCharacterImage) {
      window._originalUpdateViCharacterImage();
    }
  };
}

// Initialize Halloween Vi system
function initializeHalloweenViSystem() {
  // Ensure base state exists
  if (!window.state) {
    window.state = {};
  }
  
  // Ensure prismCoreSystem is properly initialized with Decimal objects
  if (!window.state.prismCoreSystem) {
    window.state.prismCoreSystem = {
      chargedPrismaInCore: new Decimal(0),
      totalChargedPrismaGiven: new Decimal(0),
      lightBoostFromChargedPrisma: new Decimal(1)
    };
  }
  
  // Ensure all prismCoreSystem properties are Decimal objects
  if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.totalChargedPrismaGiven)) {
    window.state.prismCoreSystem.totalChargedPrismaGiven = new Decimal(window.state.prismCoreSystem.totalChargedPrismaGiven || 0);
  }
  
  if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.chargedPrismaInCore)) {
    window.state.prismCoreSystem.chargedPrismaInCore = new Decimal(window.state.prismCoreSystem.chargedPrismaInCore || 0);
  }
  
  if (!DecimalUtils.isDecimal(window.state.prismCoreSystem.lightBoostFromChargedPrisma)) {
    window.state.prismCoreSystem.lightBoostFromChargedPrisma = new Decimal(window.state.prismCoreSystem.lightBoostFromChargedPrisma || 1);
  }
  
  // Ensure Vi state exists
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  
  if (!window.state.halloweenEvent.vi) {
    window.state.halloweenEvent.vi = {
      pokeCount: 0,
      isWearingCostume: false,
      costumeStartTime: 0,
      costumeDuration: 30 * 60 * 1000,
      lastPokeTime: 0,
      speechTimer: null
    };
  }
  
  // Hook the poke function
  hookHalloweenViPoke();
  
  // Hook into the Vi image update system
  hookHalloweenViImageUpdates();
  
  // Try hooking again after a delay to ensure advanced prism functions are loaded
  setTimeout(() => {
    hookHalloweenViPoke();
    hookHalloweenViImageUpdates();
  }, 2000);
  
  // Update images if needed
  updateHalloweenViImages();
}

// Aggressive hook function that tries multiple times
function ensureHalloweenViHook() {
  let attempts = 0;
  const maxAttempts = 10;
  
  const tryHook = () => {
    attempts++;
    
    if (typeof window.pokeVi === 'function' || typeof window.pokeAdvancedPrismCharacter === 'function') {
      hookHalloweenViPoke();
    }
    
    if (typeof window.updateViCharacterImage === 'function') {
      hookHalloweenViImageUpdates();
    }
    
    if (attempts < maxAttempts && 
        (typeof window.pokeVi !== 'function' || typeof window.updateViCharacterImage !== 'function')) {
      setTimeout(tryHook, 1000);
    }
  };
  
  tryHook();
}

// Cleanup function for when Halloween mode is disabled
function cleanupHalloweenViSystem() {
  // Restore original poke functions
  if (window._originalPokeAdvancedPrismCharacter) {
    window.pokeAdvancedPrismCharacter = window._originalPokeAdvancedPrismCharacter;
  }
  
  if (window._originalPokeVi) {
    window.pokeVi = window._originalPokeVi;
  }
  
  // Restore original image update function
  if (window._originalUpdateViCharacterImage) {
    window.updateViCharacterImage = window._originalUpdateViCharacterImage;
  }
  
  // Clear any active timers
  const vi = window.state.halloweenEvent?.vi;
  if (vi && vi.speechTimer) {
    clearTimeout(vi.speechTimer);
    vi.speechTimer = null;
  }
  
  // Reset costume state
  if (vi) {
    vi.isWearingCostume = false;
  }
  
  // Update images back to normal
  if (typeof window.updateViCharacterImage === 'function') {
    window.updateViCharacterImage();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeHalloweenViSystem, 1000);
  setTimeout(ensureHalloweenViHook, 2000);
});

// Also initialize if DOM is already ready
if (document.readyState !== 'loading') {
  setTimeout(initializeHalloweenViSystem, 1000);
  setTimeout(ensureHalloweenViHook, 2000);
}

// Make functions globally accessible
window.pokeHalloweenVi = pokeHalloweenVi;
window.showHalloweenViSpeech = showHalloweenViSpeech;
window.updateHalloweenViImages = updateHalloweenViImages;
window.getHalloweenViSleepImage = getHalloweenViSleepImage;
window.initializeHalloweenViSystem = initializeHalloweenViSystem;
window.cleanupHalloweenViSystem = cleanupHalloweenViSystem;
window.hookHalloweenViPoke = hookHalloweenViPoke;
window.hookHalloweenViImageUpdates = hookHalloweenViImageUpdates;
window.ensureHalloweenViHook = ensureHalloweenViHook;
