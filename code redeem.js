// Code Redeem System for Fluff Inc.

class CodeRedeemSystem {
  constructor() {
    this.redeemCodes = {
      'yay swa bucks!': {
        id: 'yay_swa_bucks',
        description: 'Yay Swa Bucks: 100 Swa Bucks!',
        reward: {
          type: 'swabucks',
          amount: 100
        },
        oneTimeUse: true
      },
      'yayswabucks!': {
        id: 'yay_swa_bucks',
        description: 'Yay Swa Bucks: 100 Swa Bucks!',
        reward: {
          type: 'swabucks',
          amount: 100
        },
        oneTimeUse: true
      },
      'yay swa bucks': {
        id: 'yay_swa_bucks',
        description: 'Yay Swa Bucks: 100 Swa Bucks!',
        reward: {
          type: 'swabucks',
          amount: 100
        },
        oneTimeUse: true
      },
      'yayswabucks': {
        id: 'yay_swa_bucks',
        description: 'Yay Swa Bucks: 100 Swa Bucks!',
        reward: {
          type: 'swabucks',
          amount: 100
        },
        oneTimeUse: true
      },
      'omg soap needs so much spark tokens!': {
        id: 'soap_spark_battery',
        description: 'Soap\'s quest help: 100 Spark Tokens + 1 Battery Token!',
        rewards: [
          {
            type: 'token',
            tokenType: 'sparks',
            amount: 100
          },
          {
            type: 'token',
            tokenType: 'batteries',
            amount: 1
          }
        ],
        oneTimeUse: true
      },
      'toothpaste dragon': {
        id: 'recorder_mode_unlock',
        description: 'Secret unlock: Recorder Mode!',
        reward: {
          type: 'unlock',
          unlockType: 'recorderMode'
        },
        oneTimeUse: true
      },
      'Mynta': {
        id: 'recorder_mode_unlock',
        description: 'Secret unlock: Recorder Mode!',
        reward: {
          type: 'unlock',
          unlockType: 'recorderMode'
        },
        oneTimeUse: true
      },
      'mynta': {
        id: 'recorder_mode_unlock',
        description: 'Secret unlock: Recorder Mode!',
        reward: {
          type: 'unlock',
          unlockType: 'recorderMode'
        },
        oneTimeUse: true
      },
      'no fun allowed': {
        id: 'kitofox_mode_unlock',
        description: 'Secret unlock: HARDCORE Mode!',
        reward: {
          type: 'unlock',
          unlockType: 'kitoFoxMode'
        },
        oneTimeUse: true
      },
      'give me 1 million swa bucks': {
        id: 'swa_bucks_trap',
        description: 'Trap code: You fell for it!',
        reward: {
          type: 'trap',
          trapType: 'swariaTalk'
        },
        oneTimeUse: false
      },
      'this is halloween': {
        id: 'halloween_event_unlock',
        description: 'Event unlock: Halloween Event toggle!',
        reward: {
          type: 'unlock',
          unlockType: 'halloweenEvent'
        },
        oneTimeUse: true
      }
    };
    
    // Initialize window.state.redeemedCodes if it doesn't exist
    if (!window.state) {
      window.state = {};
    }
    if (!window.state.redeemedCodes) {
      window.state.redeemedCodes = [];
    }
    
    this.redeemedCodes = new Set(window.state.redeemedCodes);
  }

  // Load previously redeemed codes from save system
  loadRedeemHistory() {
    try {
      if (window.state && window.state.redeemedCodes) {
        this.redeemedCodes = new Set(window.state.redeemedCodes);
      } else {
        this.redeemedCodes = new Set();
        if (window.state) {
          window.state.redeemedCodes = [];
        }
      }
    } catch (error) {
      this.redeemedCodes = new Set();
      if (window.state) {
        window.state.redeemedCodes = [];
      }
    }
  }

  // Save redeemed codes to the save system
  saveRedeemHistory() {
    try {
      if (!window.state) {
        window.state = {};
      }
      window.state.redeemedCodes = Array.from(this.redeemedCodes);
      
      // No need to manually trigger save - it's part of the normal save cycle
    } catch (error) {
    }
  }

  // Check if code exists and is valid
  isValidCode(code) {
    const normalizedCode = code.toLowerCase().trim();
    return this.redeemCodes.hasOwnProperty(normalizedCode);
  }

  // Check if code has already been redeemed
  isCodeRedeemed(code) {
    const normalizedCode = code.toLowerCase().trim();
    const codeData = this.redeemCodes[normalizedCode];
    if (!codeData) return false;
    
    return this.redeemedCodes.has(codeData.id);
  }

  // Redeem a code and apply its rewards
  redeemCode(code) {
    const normalizedCode = code.toLowerCase().trim();
    
    if (!this.isValidCode(normalizedCode)) {
      return {
        success: false,
        message: 'Invalid code. Please check your spelling and try again.',
        type: 'error'
      };
    }

    if (this.isCodeRedeemed(normalizedCode)) {
      return {
        success: false,
        message: 'This code has already been redeemed!',
        type: 'warning'
      };
    }

    const codeData = this.redeemCodes[normalizedCode];
    
    try {
      // Apply the reward(s)
      this.applyReward(codeData);
      
      // Unlock secret achievement for redeeming a code
      if (typeof window.unlockSecretAchievement === 'function') {
        window.unlockSecretAchievement('secret19');
      }
      
      // Mark code as redeemed
      if (codeData.oneTimeUse) {
        this.redeemedCodes.add(codeData.id);
        this.saveRedeemHistory();
        
        // Trigger a game save to ensure persistence
        if (typeof window.saveGame === 'function') {
          window.saveGame();
        } else if (typeof window.SaveSystem !== 'undefined' && window.SaveSystem.saveGame) {
          window.SaveSystem.saveGame();
        }
      }

      // Update the UI
      this.updateRedeemHistoryDisplay();

      return {
        success: true,
        message: `Successfully redeemed: ${codeData.description}`,
        type: 'success',
        reward: codeData.reward
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while redeeming the code. Please try again.',
        type: 'error'
      };
    }
  }

  // Apply the reward from a redeemed code
  applyReward(codeData) {
    // Handle single reward (legacy format)
    if (codeData.reward) {
      this.applySingleReward(codeData.reward);
      return;
    }
    
    // Handle multiple rewards (new format)
    if (codeData.rewards && Array.isArray(codeData.rewards)) {
      let rewardText = '';
      codeData.rewards.forEach((reward, index) => {
        this.applySingleReward(reward);
        if (index > 0) rewardText += ', ';
        rewardText += this.getRewardText(reward);
      });
      // Show combined notification
      this.showRewardNotification(rewardText, '#FFD700');
      return;
    }
    
    throw new Error('No valid reward or rewards found');
  }

  // Apply a single reward
  applySingleReward(reward) {
    switch (reward.type) {
      case 'swabucks':
        if (typeof window.addSwaBucks === 'function') {
          window.addSwaBucks(reward.amount);
        } else {
          // Fallback method
          if (!window.state) window.state = {};
          if (!DecimalUtils.isDecimal(window.state.swabucks)) {
            window.state.swabucks = new Decimal(0);
          }
          window.state.swabucks = window.state.swabucks.add(reward.amount);
        }
        break;
      case 'fluff':
        if (typeof window.addCurrency === 'function') {
          window.addCurrency('fluff', reward.amount);
        }
        break;
      case 'swaria':
        if (typeof window.addCurrency === 'function') {
          window.addCurrency('swaria', reward.amount);
        }
        break;
      case 'token':
        // Handle token rewards
        if (!window.state) window.state = {};
        if (!window.state.tokens) window.state.tokens = {};
        
        if (reward.tokenType === 'batteries') {
          // Batteries are stored directly in window.state
          if (!DecimalUtils.isDecimal(window.state.batteries)) {
            window.state.batteries = new Decimal(0);
          }
          window.state.batteries = window.state.batteries.add(reward.amount);
        } else {
          // Other tokens are stored in window.state.tokens
          if (!DecimalUtils.isDecimal(window.state.tokens[reward.tokenType])) {
            window.state.tokens[reward.tokenType] = new Decimal(0);
          }
          window.state.tokens[reward.tokenType] = window.state.tokens[reward.tokenType].add(reward.amount);
        }
        break;
      case 'unlock':
        // Handle unlock rewards
        if (!window.state) window.state = {};
        if (!window.state.unlockedFeatures) window.state.unlockedFeatures = {};
        
        if (reward.unlockType === 'recorderMode') {
          window.state.unlockedFeatures.recorderMode = true;
          // Initialize recorder mode state
          if (!window.state.recorderModeActive) {
            window.state.recorderModeActive = false;
          }
          // Refresh settings UI to show the new toggle
          setTimeout(() => {
            if (typeof window.addRecorderModeToggleButton === 'function') {
              window.addRecorderModeToggleButton();
            }
          }, 100);
        } else if (reward.unlockType === 'kitoFoxMode') {
          window.state.unlockedFeatures.kitoFoxMode = true;
          // Initialize KitoFox mode state
          if (!window.state.kitoFoxModeActive) {
            window.state.kitoFoxModeActive = false;
          }
          // Refresh settings UI to show the new toggle
          setTimeout(() => {
            if (typeof window.addKitoFoxModeToggleButton === 'function') {
              window.addKitoFoxModeToggleButton();
            }
          }, 100);
        } else if (reward.unlockType === 'halloweenEvent') {
          window.state.unlockedFeatures.halloweenEvent = true;
          // Initialize Halloween event state
          if (!window.state.halloweenEventActive) {
            window.state.halloweenEventActive = false;
          }
          // Refresh settings UI to show the new toggle
          setTimeout(() => {
            if (typeof window.addHalloweenEventToggleButton === 'function') {
              window.addHalloweenEventToggleButton();
            }
          }, 100);
        }
        break;
      case 'trap':
        // Handle trap rewards
        if (reward.trapType === 'swariaTalk') {
          this.triggerSwariaTrap();
        }
        break;
      // Add more reward types as needed
      default:
        throw new Error(`Unknown reward type: ${reward.type}`);
    }
  }

  // Get reward text for display
  getRewardText(reward) {
    switch (reward.type) {
      case 'swabucks':
        return `+${reward.amount} Swa Bucks`;
      case 'fluff':
        return `+${reward.amount} Fluff`;
      case 'swaria':
        return `+${reward.amount} Swaria Coins`;
      case 'token':
        if (reward.tokenType === 'batteries') {
          return `+${reward.amount} Battery Token${reward.amount > 1 ? 's' : ''}`;
        } else if (reward.tokenType === 'sparks') {
          return `+${reward.amount} Spark Token${reward.amount > 1 ? 's' : ''}`;
        } else {
          return `+${reward.amount} ${reward.tokenType} Token${reward.amount > 1 ? 's' : ''}`;
        }
      case 'unlock':
        if (reward.unlockType === 'recorderMode') {
          return 'Unlocked Recorder Mode!';
        } else if (reward.unlockType === 'kitoFoxMode') {
          return 'Unlocked KitoFox Mode!';
        } else if (reward.unlockType === 'halloweenEvent') {
          return 'Unlocked Halloween Event!';
        }
        return `Unlocked ${reward.unlockType}!`;
      default:
        return `+${reward.amount || ''} ${reward.type}`;
    }
  }

  // Get list of redeemed codes for display
  getRedeemedCodesList() {
    const redeemed = [];
    const seenIds = new Set();
    
    for (const [code, data] of Object.entries(this.redeemCodes)) {
      if (this.redeemedCodes.has(data.id) && !seenIds.has(data.id)) {
        seenIds.add(data.id);
        redeemed.push({
          code: code, // This will be the first variant encountered
          description: data.description,
          redeemedAt: new Date().toLocaleDateString() // Could be enhanced to store actual redeem time
        });
      }
    }
    return redeemed;
  }

  // Update the redeem history display in the UI
  updateRedeemHistoryDisplay() {
    const historyElement = document.getElementById('redeemCodeHistoryList');
    if (!historyElement) return;

    const redeemed = this.getRedeemedCodesList();
    
    if (redeemed.length === 0) {
      historyElement.innerHTML = '<p style="color: #666; font-style: italic;">No codes redeemed yet.</p>';
    } else {
      historyElement.innerHTML = redeemed.map(item => 
        `<div style="margin-bottom: 0.5em; padding: 0.5em; background: #e8f5e8; border-radius: 4px;">
          <strong>${item.code}</strong><br>
          <small style="color: #666;">${item.description}</small>
        </div>`
      ).join('');
    }
  }

  // Show a floating notification for rewards using the same style as achievements
  showRewardNotification(text, color = '#FFD700') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: -350px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 300px;
      animation: slideInRight 0.5s ease-out;
      transform: translateX(0);
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    notification.innerHTML = `
      <img src="assets/icons/Swa Buck.png" alt="Swa Bucks" style="width: 32px; height: 32px;">
      <div>
        <div style="font-weight: bold; font-size: 1.1em;">Code Redeemed!</div>
        <div style="font-size: 0.9em; opacity: 0.9;">${text}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Slide in
    setTimeout(() => {
      notification.style.transform = 'translateX(-370px)';
    }, 100);

    // Slide out after delay
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.5s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }

  // Trigger the Swaria trap dialogue system
  triggerSwariaTrap() {
    // Mark that the player is in the trap (for refresh detection)
    localStorage.setItem('swariaTrapActive', 'true');
    localStorage.setItem('swariaTrapStartTime', Date.now().toString());
    
    // Pause power drain during the trap
    this.pauseGameSystems();
    
    this.createDialogueOverlay();
  }

  // Create the dimmer overlay with Swaria card
  createDialogueOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'swariaTrapOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      z-index: 50000;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;

    // Create Swaria card
    const swariaCard = document.createElement('div');
    swariaCard.id = 'swariaCard';
    swariaCard.style.cssText = `
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      text-align: center;
      min-width: 600px;
      max-width: 800px;
      width: 80vw;
      max-height: 80vh;
      overflow-y: auto;
      transform: scale(0.8);
      transition: transform 0.5s ease;
      cursor: pointer;
    `;

    // Create Swaria image
    const swariaImage = document.createElement('img');
    swariaImage.id = 'swariaTrapImage';
    swariaImage.src = (window.state && window.state.halloweenEventActive) ? 'assets/icons/halloween peachy.png' : 'swa normal.png';
    swariaImage.style.cssText = `
      width: 200px;
      height: 200px;
      object-fit: contain;
      margin-bottom: 20px;
      border-radius: 10px;
    `;

    // Create dialogue text area
    const dialogueText = document.createElement('div');
    dialogueText.id = 'swariaDialogueText';
    dialogueText.style.cssText = `
      font-size: 1.1em;
      color: #333;
      margin: 20px 0;
      min-height: 120px;
      max-height: 300px;
      padding: 20px;
      background: #f8f8f8;
      border-radius: 8px;
      border-left: 4px solid #4CAF50;
      display: none;
      line-height: 1.6;
      word-wrap: break-word;
      overflow-wrap: break-word;
      text-align: left;
      overflow-y: auto;
    `;

    // Create click instruction
    const clickInstruction = document.createElement('div');
    clickInstruction.id = 'clickInstruction';
    clickInstruction.style.cssText = `
      font-size: 0.9em;
      color: #666;
      margin-top: 15px;
      font-style: italic;
      display: none;
    `;
    clickInstruction.textContent = 'Click to continue...';

    // Assemble the card
    swariaCard.appendChild(swariaImage);
    swariaCard.appendChild(dialogueText);
    swariaCard.appendChild(clickInstruction);
    overlay.appendChild(swariaCard);
    
    // Add to document
    document.body.appendChild(overlay);

    // Initialize dialogue system
    this.currentDialogueIndex = 0;
    this.currentWordIndex = 0;
    this.lastClickTime = 0;
    this.isWordByWord = false;
    this.isRestartDialogue = false;
    this.clicksBlocked = false;
    
    // Track dialogue experience for secret achievement
    this.totalWordsExperienced = parseInt(localStorage.getItem('swariaTotalWordsExperienced') || '0');
    
    // Rhythm detection system
    this.clickIntervals = [];
    this.perfectClickCount = 0;
    this.rhythmTolerance = 10; // 10ms tolerance for "perfect" timing
    this.dialogueTexts = [
      "Did you really think you'd get 1 million Swa Bucks that sweasily?",
      "Foolish mortal, you have fallen swinto my trap!",
      "Now you must listen to the WORST dialogue in the swentire game!",
      "WORD_BY_WORD_START"
    ];
    
  
    this.terribleReview = [
      "Swelcome", "swo", "swy", "swamazing", "sweview", "swof", "swuff", "swInc",
      "Swis", "swame", "swis", "swabsolutely", "swawful", "swin", "swevery", "swway",
      "Swirst", "swe", "swameplay", "swis", "swincredibly", "sworing", "swand", "swepetitive",
      "Swou", "swust", "swick", "swuttons", "swand", "swait", "swor", "swhours",
      "Swe", "swimewalls", "sware", "swabsolutely", "swridiculously", "swlong", "swand", "swustrating",
      "Swugs", "sweverywhere", "swou", "swook", "swothing", "sworks", "swoperly",
      "Swore", "swugs", "swappear", "swen", "swou", "swink", "swings", "swant", "swet", "sworse",
      "Swe", "swtory", "swis", "swcompletely", "swonsensical", "swand", "swpointless",
      "SwI", "swean", "swI", "switteraly", "swive", "swa", "swattery", "swo", "swe", "swaria", "swand", "swey", "switteraly", "swead", "'nom'", "swike", "swhat", "swe", "swhell!",
      "Swe", "swUI", "swis", "switteraly", "swome", "swa", "swowerpoint", "swide", "show", "swis", "swmore", "swonfusing", "swan", "swa", "swmaze",
      "Swave", "swystem", "swarely", "sworks", "swI", "swlost", "swy", "swogress", "swoo", "swany", "swimes!",
      "Swemium", "sweatures", "sware", "swoverpriced", "swand", "swunnecessary",
      "Swe", "sweveloper", "swearly", "swoesnt", "sware", "swabout", "swality",
      "Swthis", "swis", "swust", "swanother", "swash", "swab", "swidle", "swgame", "swust", "swike", "swevery", "swother", "swidle", "swgame", "swugh...",
      "Swon't", "swet", "swe", "swarted", "swith", "swa", "swerrible", "swoap", "swquest!", "sweating", "swall", "swy", "swarks", "swokens...",
      "Swevery", "swechanic", "swis", "swtolen", "swome", "swother", "swidle", "swgames...", "Swo", "swunoriginal.",
      "Swe", "swaphics", "sware", "swediocre", "swat", "swest", "swand", "swoutdated.",
      "Swe", "swentire", "swexperience", "sweels", "swike", "swa", "swaste", "swof", "swime",
      "Swoverall", "swuff", "swInc", "swis", "swa", "swisaster", "swof", "swa", "swgame",
      "SwI", "swgive", "swit", "swa", "swone", "swout", "swof", "swten", "swtars",
      "Swavoid", "swis", "swgame", "swat", "swall", "swosts", "swunless", "swou", "swenjoy", "swuffering",
      "Swanyway", "Swave", "swa", "swawesome", "swtime.", "Swanta", "swas", "swnever", "swreal", "swand", "swesus", "swnever", "swappened."
    ];

    // Anti-cheat restart dialogue
    this.restartDialogue = "Oh, what's that? Are you using an autoclicker or clicking too fast to skip this dialogue? How cute, but that is not allowed... You will listen to my terrible rambling again.";
    
    // Rhythm cheater punishment dialogue
    this.rhythmCheaterDialogue = "OH MY! Did you really think I wouldn't notice your PERFECTLY TIMED clicking pattern? 50 clicks with identical timing intervals? That's either a bot, an autoclicker, or you're some kind of clicking machine! Either way, that's CHEATING and now you get to start ALL OVER AGAIN! Nice try, cheater!";
    
    // Refresh cheater punishment dialogue
    this.refreshCheaterDialogue = "Oh my, oh my... Did you just try to refresh the page to escape my dialogue? How absolutely foolish of you, you sneaky little cheater. Since you tried to escape...";

    // Animate in
    setTimeout(() => {
      overlay.style.opacity = '1';
      swariaCard.style.transform = 'scale(1)';
    }, 100);

    // Start dialogue after 2 seconds
    setTimeout(() => {
      this.startDialogue();
    }, 2000);

    // Add click listener for dialogue progression
    overlay.addEventListener('click', () => this.advanceDialogue());
    
    // Add keyboard listener to catch refresh attempts
    this.keyboardListener = (e) => {
      // Detect refresh attempts (F5, Ctrl+R, Ctrl+Shift+R)
      if (e.key === 'F5' || 
          (e.ctrlKey && e.key === 'r') || 
          (e.ctrlKey && e.shiftKey && e.key === 'R') ||
          (e.ctrlKey && e.key === 'w') ||
          (e.ctrlKey && e.key === 'W')) {
        e.preventDefault();
        this.showCustomWarning();
        return false;
      }
    };
    window.addEventListener('keydown', this.keyboardListener);
  }

  // Start the dialogue sequence
  startDialogue() {
    const dialogueText = document.getElementById('swariaDialogueText');
    const clickInstruction = document.getElementById('clickInstruction');
    const swariaImage = document.getElementById('swariaTrapImage');
    
    if (dialogueText && clickInstruction && swariaImage) {
      dialogueText.style.display = 'block';
      clickInstruction.style.display = 'block';
      swariaImage.src = (window.state && window.state.halloweenEventActive) ? 'assets/icons/halloween peachy speech.png' : 'swa talking.png';
      this.showCurrentDialogue();
      this.updateClickInstruction();
    }
  }

  // Update click instruction based on current state
  updateClickInstruction() {
    const clickInstruction = document.getElementById('clickInstruction');
    if (clickInstruction) {
      if (this.isRestartDialogue) {
        clickInstruction.textContent = 'Nice try! Wait 8 seconds...';
      } else if (this.isWordByWord) {
        clickInstruction.textContent = 'Click to reveal next word...';
      } else {
        clickInstruction.textContent = 'Click to continue...';
      }
    }
  }

  // Show current dialogue text
  showCurrentDialogue() {
    const dialogueText = document.getElementById('swariaDialogueText');
    if (dialogueText && this.currentDialogueIndex < this.dialogueTexts.length) {
      const currentText = this.dialogueTexts[this.currentDialogueIndex];
      
      // Check if we've reached the word-by-word section
      if (currentText === "WORD_BY_WORD_START") {
        this.isWordByWord = true;
        this.currentWordIndex = 0;
        this.showWordByWord();
      } else {
        dialogueText.textContent = currentText;
      }
    }
  }

  // Show words one by one for the terrible review
  showWordByWord() {
    const dialogueText = document.getElementById('swariaDialogueText');
    if (dialogueText && this.currentWordIndex < this.terribleReview.length) {
      const wordsToShow = this.terribleReview.slice(0, this.currentWordIndex + 1);
      dialogueText.textContent = wordsToShow.join(' ');
    }
  }

  // Advance to next dialogue or close
  advanceDialogue() {
    const currentTime = Date.now();
    
    // Block clicks during restart dialogue
    if (this.clicksBlocked) {
      return;
    }
    
    // Detect fast clicking (under 200ms) during word-by-word phase
    if (this.isWordByWord && currentTime - this.lastClickTime < 200 && this.lastClickTime > 0) {
      this.triggerRestartDialogue();
      return;
    }
    
    // Rhythm detection during word-by-word phase
    if (this.isWordByWord && this.lastClickTime > 0) {
      const interval = currentTime - this.lastClickTime;
      this.clickIntervals.push(interval);
      
      // Keep only the last 50 intervals
      if (this.clickIntervals.length > 50) {
        this.clickIntervals.shift();
      }
      
      // Check for perfect rhythm (50+ clicks with similar timing)
      if (this.clickIntervals.length >= 50) {
        this.checkForPerfectRhythm();
      }
    }
    
    this.lastClickTime = currentTime;

    if (this.isRestartDialogue) {
      // During restart dialogue, clicks are blocked
      return;
    } else if (this.isWordByWord) {
      // Handle word-by-word progression
      if (this.currentWordIndex < this.terribleReview.length - 1) {
        this.currentWordIndex++;
        
        // Track words experienced for secret achievement
        this.totalWordsExperienced = Math.max(this.totalWordsExperienced, this.currentWordIndex + 1);
        localStorage.setItem('swariaTotalWordsExperienced', this.totalWordsExperienced.toString());
        
        // Check if they've experienced enough words to deserve the achievement (75% of total)
        const wordsNeeded = Math.floor(this.terribleReview.length * 0.75);
        if (this.totalWordsExperienced >= wordsNeeded) {
          // They've suffered enough, give them the achievement
          if (typeof window.unlockSecretAchievement === 'function') {
            const achievement = window.secretAchievements && window.secretAchievements['secret20'];
            if (achievement && !achievement.unlocked) {
              window.unlockSecretAchievement('secret20');
              // Clear the tracking since they got the reward
              localStorage.removeItem('swariaTotalWordsExperienced');
            }
          }
        }
        
        this.showWordByWord();
        this.updateClickInstruction();
      } else {
        // Finished the terrible review, close dialogue
        // Unlock secret achievement for listening to entire peachy dialogue
        if (typeof window.unlockSecretAchievement === 'function') {
          window.unlockSecretAchievement('secret20');
        }
        // Clear the tracking since they completed it properly
        localStorage.removeItem('swariaTotalWordsExperienced');
        this.closeDialogue();
      }
    } else {
      // Handle normal dialogue progression
      if (this.currentDialogueIndex < this.dialogueTexts.length - 1) {
        this.currentDialogueIndex++;
        this.showCurrentDialogue();
        this.updateClickInstruction();
      } else {
        this.closeDialogue();
      }
    }
  }

  // Trigger the restart dialogue when fast clicking is detected
  triggerRestartDialogue() {
    const dialogueText = document.getElementById('swariaDialogueText');
    const clickInstruction = document.getElementById('clickInstruction');
    const swariaImage = document.getElementById('swariaTrapImage');
    
    // Set restart state
    this.isRestartDialogue = true;
    this.clicksBlocked = true;
    
    // Show restart dialogue
    if (dialogueText && clickInstruction && swariaImage) {
      dialogueText.textContent = this.restartDialogue;
      clickInstruction.textContent = 'Nice try! Wait 8 seconds...';
      swariaImage.src = (window.state && window.state.halloweenEventActive) ? 'assets/icons/halloween peachy speech.png' : 'swa talking.png';
    }
    
    // Block clicks for 8 seconds, then restart from beginning
    setTimeout(() => {
      this.restartFromBeginning();
    }, 8000);
  }

  // Restart the entire dialogue from the beginning
  restartFromBeginning() {
    // Reset all state
    this.currentDialogueIndex = 0;
    this.currentWordIndex = 0;
    this.isWordByWord = false;
    this.isRestartDialogue = false;
    this.clicksBlocked = false;
    this.lastClickTime = 0;
    
    // Preserve their dialogue experience progress for achievement
    // (they don't lose credit for words they've already suffered through)
    
    // Reset rhythm detection
    this.clickIntervals = [];
    this.perfectClickCount = 0;
    
    // Show first dialogue again
    this.showCurrentDialogue();
    this.updateClickInstruction();
    
    const swariaImage = document.getElementById('swariaTrapImage');
    if (swariaImage) {
      swariaImage.src = (window.state && window.state.halloweenEventActive) ? 'assets/icons/halloween peachy speech.png' : 'swa talking.png';
    }
  }

  // Check for perfect rhythm (automated clicking detection)
  checkForPerfectRhythm() {
    if (this.clickIntervals.length < 50) return;
    
    // Calculate average interval
    const sum = this.clickIntervals.reduce((a, b) => a + b, 0);
    const average = sum / this.clickIntervals.length;
    
    // Count how many intervals are within tolerance of the average
    let perfectCount = 0;
    for (let interval of this.clickIntervals) {
      if (Math.abs(interval - average) <= this.rhythmTolerance) {
        perfectCount++;
      }
    }
    
    // If 48+ out of 50 clicks are "perfect", trigger rhythm cheater punishment
    if (perfectCount >= 48) {
      this.triggerRhythmCheaterPunishment();
    }
  }

  // Trigger punishment for rhythm cheating
  triggerRhythmCheaterPunishment() {
    const dialogueText = document.getElementById('swariaDialogueText');
    const clickInstruction = document.getElementById('clickInstruction');
    const swariaImage = document.getElementById('swariaTrapImage');
    
    // Set rhythm cheater state
    this.isRestartDialogue = true;
    this.clicksBlocked = true;
    
    // Reset rhythm detection
    this.clickIntervals = [];
    this.perfectClickCount = 0;
    
    // Show rhythm cheater dialogue
    if (dialogueText && clickInstruction && swariaImage) {
      dialogueText.textContent = this.rhythmCheaterDialogue;
      clickInstruction.textContent = 'bot detected! Wait 10 seconds...';
      swariaImage.src = (window.state && window.state.halloweenEventActive) ? 'assets/icons/halloween peachy speech.png' : 'swa talking.png';
    }
    
    // Block clicks for 10 seconds (longer punishment), then restart
    setTimeout(() => {
      this.restartFromBeginning();
    }, 10000);
  }

  // Close the dialogue overlay
  closeDialogue() {
    const overlay = document.getElementById('swariaTrapOverlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        // Clear trap state when properly closed
        localStorage.removeItem('swariaTrapActive');
        localStorage.removeItem('swariaTrapStartTime');
        localStorage.removeItem('swariaTrapRefreshCount');
        
        // Resume game systems
        this.resumeGameSystems();
        
        // Remove event listeners
        if (this.keyboardListener) {
          window.removeEventListener('keydown', this.keyboardListener);
          this.keyboardListener = null;
        }
      }, 500);
    }
  }

  // Check if player tried to escape by refreshing
  checkForRefreshCheating() {
    const trapActive = localStorage.getItem('swariaTrapActive');
    const trapStartTime = localStorage.getItem('swariaTrapStartTime');
    
    if (trapActive === 'true' && trapStartTime) {
      const timeSinceStart = Date.now() - parseInt(trapStartTime);
      
      // If trap was active and it's been less than 10 minutes, they're cheating
      if (timeSinceStart < 600000) { // 10 minutes
        this.punishRefreshCheater();
        return true;
      } else {
        // Clear old trap state if too much time has passed
        localStorage.removeItem('swariaTrapActive');
        localStorage.removeItem('swariaTrapStartTime');
        localStorage.removeItem('swariaTrapRefreshCount');
      }
    }
    return false;
  }

  // Punish the refresh cheater with extended dialogue
  punishRefreshCheater() {
    // Increase refresh count
    let refreshCount = parseInt(localStorage.getItem('swariaTrapRefreshCount') || '0');
    refreshCount++;
    localStorage.setItem('swariaTrapRefreshCount', refreshCount.toString());
    
    // Create the punishment trap with doubled terrible review
    this.createRefreshCheaterTrap(refreshCount);
  }

  // Create special punishment trap for refresh cheaters
  createRefreshCheaterTrap(refreshCount) {
    // Clear any existing power protection interval first
    if (this.powerProtectionInterval) {
      clearInterval(this.powerProtectionInterval);
      this.powerProtectionInterval = null;
    }
    
    // Pause game systems for refresh cheaters too
    this.pauseGameSystems();
    
    // Double the terrible review for each refresh attempt
    this.terribleReviewExtended = [];
    for (let i = 0; i < Math.pow(2, refreshCount); i++) {
      this.terribleReviewExtended = this.terribleReviewExtended.concat(this.terribleReview);
    }
    
    // Override the normal terrible review
    const originalReview = this.terribleReview;
    this.terribleReview = this.terribleReviewExtended;
    
    // Create overlay with special punishment message
    this.createDialogueOverlay();
    
    // Override the initial dialogue to show punishment message
    this.dialogueTexts = [
      this.refreshCheaterDialogue,
      "Let's restart from the beginning, shall we?",
      "WORD_BY_WORD_START"
      
    ];
    
    // Reset to first dialogue
    this.currentDialogueIndex = 0;
    this.currentWordIndex = 0;
    this.isWordByWord = false;
  }

  // Pause game systems during trap dialogue
  pauseGameSystems() {
    // Store original power drain state
    if (typeof window.isPowerDrainPaused !== 'undefined') {
      this.originalPowerDrainState = window.isPowerDrainPaused;
    } else {
      this.originalPowerDrainState = false;
    }
    
    // Pause power drain
    if (typeof window.pausePowerDrain === 'function') {
      window.pausePowerDrain();
    } else {
      // Fallback: set global pause flag
      window.isPowerDrainPaused = true;
    }
    
    // Store original day/night cycle state if it exists
    if (typeof window.isDayNightPaused !== 'undefined') {
      this.originalDayNightState = window.isDayNightPaused;
    } else {
      this.originalDayNightState = false;
    }
    
    // Pause day/night cycle if available
    if (typeof window.pauseDayNightCycle === 'function') {
      window.pauseDayNightCycle();
    } else {
      // Fallback: set global pause flag
      window.isDayNightPaused = true;
    }
    
    // Mark that systems are paused by trap
    window.isSwariaTrapActive = true;
    
    // Use the game's main pause system
    window.isGamePaused = true;
    
    // Store original power level and restore to max
    if (window.state && window.state.powerEnergy && window.state.powerMaxEnergy) {
      this.originalPowerLevel = window.state.powerEnergy.toString();
      window.state.powerEnergy = new Decimal(window.state.powerMaxEnergy);
    }
    
    // Create power protection interval - forcefully maintain max power
    this.powerProtectionInterval = setInterval(() => {
      if (window.state && window.state.powerEnergy && window.state.powerMaxEnergy) {
        const currentPower = window.state.powerEnergy;
        const maxPower = window.state.powerMaxEnergy;
        if (currentPower.lt(maxPower)) {
          window.state.powerEnergy = new Decimal(maxPower);
          // Update UI to show restored power
          if (typeof updateUI === 'function') {
            updateUI();
          }
        }
      }
    }, 100); // Check every 100ms
    
    // Update UI to reflect power restoration
    if (typeof updateUI === 'function') {
      updateUI();
    }
    
  }

  // Resume game systems after trap dialogue
  resumeGameSystems() {
    // Resume power drain to original state
    if (typeof window.resumePowerDrain === 'function') {
      if (!this.originalPowerDrainState) {
        window.resumePowerDrain();
      }
    } else {
      // Fallback: restore original state
      window.isPowerDrainPaused = this.originalPowerDrainState;
    }
    
    // Resume day/night cycle to original state
    if (typeof window.resumeDayNightCycle === 'function') {
      if (!this.originalDayNightState) {
        window.resumeDayNightCycle();
      }
    } else {
      // Fallback: restore original state
      window.isDayNightPaused = this.originalDayNightState;
    }
    
    // Clear trap active flag
    window.isSwariaTrapActive = false;
    
    // Resume the game's main pause system
    window.isGamePaused = false;
    
    // Clear power protection interval
    if (this.powerProtectionInterval) {
      clearInterval(this.powerProtectionInterval);
      this.powerProtectionInterval = null;
    }
    
  }

  // Show custom warning when escape attempts are detected
  showCustomWarning() {
    // Create warning overlay
    const warningOverlay = document.createElement('div');
    warningOverlay.id = 'swariaCustomWarning';
    warningOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 60000;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease;
    `;

    // Create warning card
    const warningCard = document.createElement('div');
    warningCard.style.cssText = `
      background: #ff4444;
      color: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      text-align: center;
      max-width: 500px;
      border: 3px solid #ff0000;
      animation: scaleIn 0.3s ease;
    `;

    // Create Swaria angry image
    const angrySwaria = document.createElement('img');
    angrySwaria.src = (window.state && window.state.halloweenEventActive) ? 'assets/icons/halloween peachy speech.png' : 'swa talking.png';
    angrySwaria.style.cssText = `
      width: 120px;
      height: 120px;
      object-fit: contain;
      margin-bottom: 20px;
      filter: hue-rotate(0deg) saturate(1.5);
    `;

    // Create warning text
    const warningText = document.createElement('div');
    warningText.style.cssText = `
      font-size: 1.4em;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `;
    warningText.innerHTML = `
      Trying to refresh or close the game to escape my dialogue?<br>
      If you leave now, you'll be caught when you return<br>
    `;

    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 30px;
    `;

    const stayButton = document.createElement('button');
    stayButton.textContent = 'Stay and Continue';
    stayButton.style.cssText = `
      background: #00aa00;
      color: white;
      border: none;
      padding: 15px 25px;
      border-radius: 10px;
      font-size: 1.1em;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    `;
    stayButton.onmouseover = () => stayButton.style.background = '#00cc00';
    stayButton.onmouseout = () => stayButton.style.background = '#00aa00';

    const leaveButton = document.createElement('button');
    leaveButton.textContent = 'Leave Anyway (Risky!)';
    leaveButton.style.cssText = `
      background: #aa0000;
      color: white;
      border: none;
      padding: 15px 25px;
      border-radius: 10px;
      font-size: 1.1em;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    `;
    leaveButton.onmouseover = () => leaveButton.style.background = '#cc0000';
    leaveButton.onmouseout = () => leaveButton.style.background = '#aa0000';

    // Add event listeners
    stayButton.onclick = () => {
      warningOverlay.remove();
    };

    leaveButton.onclick = () => {
      // Let them leave, but they'll be caught on return
      warningOverlay.remove();
      window.location.reload();
    };

    // Assemble warning
    warningCard.appendChild(angrySwaria);
    warningCard.appendChild(warningText);
    buttonContainer.appendChild(stayButton);
    buttonContainer.appendChild(leaveButton);
    warningCard.appendChild(buttonContainer);
    warningOverlay.appendChild(warningCard);

    // Add to page
    document.body.appendChild(warningOverlay);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.7); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize the redeem system
window.codeRedeemSystem = new CodeRedeemSystem();

// Global function for the redeem button
function attemptRedeemCode() {
  const input = document.getElementById('redeemCodeInput');
  const messageElement = document.getElementById('redeemCodeMessage');
  
  if (!input || !messageElement) {
    return;
  }

  const code = input.value.trim();
  
  if (!code) {
    messageElement.innerHTML = '<span style="color: #ff6666;">Please enter a code.</span>';
    return;
  }

  const result = window.codeRedeemSystem.redeemCode(code);
  
  // Display result message
  const colors = {
    success: '#66ff66',
    error: '#ff6666',
    warning: '#ffaa00'
  };
  
  messageElement.innerHTML = `<span style="color: ${colors[result.type]};">${result.message}</span>`;
  
  // Clear input on success
  if (result.success) {
    input.value = '';
    
    // Update currency displays if functions exist
    if (typeof updateUI === 'function') {
      updateUI();
    }
  }
  
  // Clear message after 5 seconds
  setTimeout(() => {
    messageElement.innerHTML = '';
  }, 5000);
}

// Make the function globally available
window.attemptRedeemCode = attemptRedeemCode;

// Initialize display when page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    if (window.codeRedeemSystem) {
      window.codeRedeemSystem.loadRedeemHistory();
      window.codeRedeemSystem.updateRedeemHistoryDisplay();
      
      // Check for refresh cheating
      window.codeRedeemSystem.checkForRefreshCheating();
    }
    
    // Initialize mode images if any mode is active
    if (window.state && typeof window.updateAllModeImages === 'function') {
      if (window.state.recorderModeActive || window.state.kitoFoxModeActive) {
        window.updateAllModeImages();
      }
    }
  }, 1000);
});

// Also update display when switching to the redeem code tab
function updateRedeemCodeDisplay() {
  if (window.codeRedeemSystem) {
    window.codeRedeemSystem.loadRedeemHistory();
    window.codeRedeemSystem.updateRedeemHistoryDisplay();
  }
}

// Make function globally available
window.updateRedeemCodeDisplay = updateRedeemCodeDisplay;

// Debug function to check redeem code persistence
window.debugRedeemCodes = function() {
  console.log('=== REDEEM CODE DEBUG ===');
  console.log('window.state.redeemedCodes:', window.state ? window.state.redeemedCodes : 'window.state not found');
  console.log('codeRedeemSystem.redeemedCodes:', window.codeRedeemSystem ? Array.from(window.codeRedeemSystem.redeemedCodes) : 'codeRedeemSystem not found');
  if (window.codeRedeemSystem) {
    console.log('Available codes:', Object.keys(window.codeRedeemSystem.redeemCodes));
    console.log('Redeemed codes list:', window.codeRedeemSystem.getRedeemedCodesList());
  }
};

// The redeem codes are now automatically saved as part of window.state
// No need to hook into the save system since redeemedCodes is part of window.state
