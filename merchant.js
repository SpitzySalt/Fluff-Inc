// Boutique System - Shop for tokens using Swa Bucks
class Boutique {
  constructor() {
    this.normalTokens = this.getNormalTokens();
    this.betterTokens = this.getBetterTokens();
    this.purchaseHistory = {};
    this.dailyStock = {};
    this.lastRestockTime = 0;
    this.lastRestockGameTime = 0;
    this.currentShopItems = [];
    this.hasShownGreeting = false;
    this.lastFreeBucksTime = 0;
    this.lastFreeBucksGameTime = 0;
    this.hasUsedFreeBucksToday = false;
    
    // Lepre interaction tracking
    this.leprePokeCount = 0;
    this.leprePokeStartTime = 0;
    this.lepreIsMad = false;
    this.lepreMadUntil = 0;
    this.lastRandomSpeechTime = 0;
    this.priceMultiplier = 1; // Normal = 1, Mad = 10, Very Mad = 1000
    
    // Very angry Lepre tracking
    this.lepreIsVeryMad = false;
    this.lepreVeryMadUntil = 0;
    this.lepreVeryMadPokeCount = 0;
    this.lepreVeryMadStartTime = 0;
    this.kickTimer = null;
    
    // Apologize system
    this.apologizeCount = 0;
    this.apologizeRequired = 1000; // Need 1000 apologies
    
    // Token challenge cooldown tracking
    this.tokenChallengeLastUsed = 0;
    this.tokenChallengeUsedSinceRestock = false;
    
    // Halloween shop state - sync with window.state if available
    if (window.state && window.state.halloweenShopPurchases) {
      this.halloweenShopPurchases = window.state.halloweenShopPurchases;
    } else {
      this.halloweenShopPurchases = {
        kpBoost: 0,
        prismLightBoost: 0,
        chargerBoost: 0,
        pollenFlowerBoost: 0,
        infinityPointBoost: 0,
        swandyBoost: 0,
        swandyShardBoost: 0,
        hexingBoost: 0,
        starterBundle: false,
        sparkyBundle: false,
        berryliciousBundle: false,
        naturalBundle: false,
        prismaBundle: false,
        richesBundle: false,
        premiumBundle: false,
        ultimateOmegaBundle: false,
        honeyBundle: false,
        mirrorDwellerBundle: false
      };
      // Initialize window.state if needed
      if (window.state) {
        window.state.halloweenShopPurchases = this.halloweenShopPurchases;
      }
    }
    
    // Timer management for memory leak prevention
    this.mainUpdateInterval = null;
    this.isDestroyed = false;
    
    // Boutique schedule system
    this.boutiqueOpenHour = 6; // Opens at 6:00 AM
    this.boutiqueCloseHour = 22; // Closes at 22:00 (10 PM)
    this.lepreLeaveHour = 0; // Lepre leaves at midnight
    this.wasPlayerInBoutiqueBeforeClose = false;
    this.isBoutiqueClosed = false;
    this.isLepreGone = false;
    
    // Speech system
    this.isSpeaking = false;
    this.speechQueue = [];
    this.currentSpeechTimeout = null;
    this.isIn727AnomalySequence = false; // Flag to prevent random speeches during 727 anomaly
    
    // Initialize shop
    this.normalTokens = this.getNormalTokens();
    this.betterTokens = this.getBetterTokens();
    this.premiumItems = this.getPremiumItems();
    this.checkAndRestockShop();
    
    // Set up time change monitoring for boutique schedule
    if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
      window.daynight.onTimeChange((gameMinutes) => {
        this.checkBoutiqueSchedule(gameMinutes);
      });
    }
    
    // Check initial boutique schedule state based on current time
    this.checkInitialBoutiqueState();
    
    // Initialize character display
    setTimeout(() => {
      this.updateLepreCharacterDisplay();
      this.updateHalloweenShopButtonVisibility();
    }, 100); // Small delay to ensure DOM is ready
    
    // Update timer every second for real-time countdown - store interval ID for cleanup
    this.mainUpdateInterval = setInterval(() => {
      // Don't update if destroyed or game is paused
      if (this.isDestroyed || window.isGamePaused) {
        return;
      }
      
      this.updateRestockTimer();
      // Check for restock and update UI if needed
      const wasRestocked = this.checkAndRestockShop();
      if (wasRestocked) {
        this.updateUIIfBoutiqueIsOpen();
      }
      // Random speeches for Lepre
      this.handleRandomSpeeches();
      
      // Check boutique schedule every second to update button availability
      if (window.daynight && typeof window.daynight.getTime === 'function') {
        const gameMinutes = window.daynight.getTime();
        this.checkBoutiqueSchedule(gameMinutes);
      }
    }, 1000); // Update every second for smooth countdown
  }

  checkInitialBoutiqueState() {
    // Check current time and set appropriate boutique state
    if (window.daynight && typeof window.daynight.getTime === 'function') {
      const gameMinutes = window.daynight.getTime();
      const currentHour = Math.floor(gameMinutes / 60) % 24;

      if (currentHour >= 0 && currentHour < 6) {
        // It's 0:00-6:00 - Lepre is gone during these hours
        this.isBoutiqueClosed = true;
        this.isLepreGone = true;
        
        // Hide the Lepre character card but show boutique button (grayed)
        const characterCard = document.getElementById('lepreCharacterCard');
        if (characterCard) {
          characterCard.style.display = 'none';
        }

      } else if (currentHour >= this.boutiqueOpenHour && currentHour < this.boutiqueCloseHour) {
        // It's daytime (6:00-22:00) - boutique should be open and Lepre present
        this.isBoutiqueClosed = false;
        this.isLepreGone = false;
        
        // Show the Lepre character card and boutique button
        const characterCard = document.getElementById('lepreCharacterCard');
        if (characterCard) {
          characterCard.style.display = 'block';
        }

      } else if (currentHour >= this.boutiqueCloseHour && currentHour < 24) {
        // It's after 22:00 but before midnight - boutique closed but Lepre still there
        this.isBoutiqueClosed = true;
        this.isLepreGone = false;
        
        // Show the Lepre character card and boutique button (but grayed)
        const characterCard = document.getElementById('lepreCharacterCard');
        if (characterCard) {
          characterCard.style.display = 'block';
        }

      }
      
      // Update UI accessibility based on current state
      this.updateBoutiqueAccessibility();
    } else {

      // Default to open if day/night system isn't available
      this.isBoutiqueClosed = false;
      this.isLepreGone = false;
    }
  }

  getNormalTokens() {
    return [
      {
        id: 'berries',
        name: 'Berry Tokens',
  // description removed
        icon: 'assets/icons/berry token.png',
        basePrice: 1,
        category: 'normal'
      },
      {
        id: 'mushroom',
        name: 'Mushroom Tokens',
  // description removed
        icon: 'assets/icons/mushroom token.png',
        basePrice: 1,
        category: 'normal'
      },
      {
        id: 'petals',
        name: 'Petal Tokens',
  // description removed
        icon: 'assets/icons/petal token.png',
        basePrice: 2,
        category: 'normal'
      },
      {
        id: 'water',
        name: 'Water Tokens',
  // description removed
        icon: 'assets/icons/water token.png',
        basePrice: 1,
        category: 'normal'
      },
      {
        id: 'stardust',
        name: 'Stardust Tokens',
  // description removed
        icon: 'assets/icons/stardust token.png',
        basePrice: 3,
        category: 'normal'
      },
      {
        id: 'sparks',
        name: 'Spark Tokens',
  // description removed
        icon: 'assets/icons/spark token.png',
        basePrice: 1,
        category: 'normal'
      },
      {
        id: 'prisma',
        name: 'Prisma Shard Tokens',
  // description removed
        icon: 'assets/icons/prisma token.png',
        basePrice: 2,
        category: 'normal'
      }
    ];
  }

  getBetterTokens() {
    return [
      {
        id: 'berryPlate',
        name: 'Berry Plate Tokens',
  // description removed
        icon: 'assets/icons/berry plate token.png',
        basePrice: 25,
        category: 'better'
      },
      {
        id: 'mushroomSoup',
        name: 'Mushroom Soup Tokens',
  // description removed
        icon: 'assets/icons/mushroom soup token.png',
        basePrice: 30,
        category: 'better'
      },
      {
        id: 'glitteringPetals',
        name: 'Glittering Petal Tokens',
  // description removed
        icon: 'assets/icons/glittering petal token.png',
        basePrice: 35,
        category: 'better'
      },
      {
        id: 'batteries',
        name: 'Battery Tokens',
  // description removed
        icon: 'assets/icons/battery token.png',
        basePrice: 35,
        category: 'better'
      },
      {
        id: 'chargedPrisma',
        name: 'Charged Prism Tokens',
  // description removed
        icon: 'assets/icons/charged prism token.png',
        basePrice: 40,
        category: 'better'
      }
    ];
  }

  getPremiumItems() {
    return [
      {
        id: 'bijou',
        name: 'Unlock Bijou',
  // description removed
        icon: 'assets/icons/bijou.png',
        basePrice: 500,
        category: 'premium',
        unlockable: true,
        isUnlocked: () => {
          // Use the compatibility function which handles both old and new state systems
          if (typeof window.isBijouUnlocked === 'function') {
            return window.isBijouUnlocked();
          }
          // Fallback: Check new state system first
          if (window.state && window.state.unlockedFeatures && window.state.unlockedFeatures.bijou) {
            return true;
          }
          // Fallback: Check old premium state system
          if (window.premiumState && window.premiumState.bijouUnlocked) {
            return true;
          }
          return false;
        }
      },
      {
        id: 'vrchatMirror',
        name: 'Unlock VRChat Mirror',
  // description removed
        icon: 'assets/icons/door.png', // Using door icon as placeholder
        basePrice: 1000000,
        category: 'premium',
        unlockable: true,
        isUnlocked: () => window.premiumState && window.premiumState.vrchatMirrorUnlocked
      }
    ];
  }

  getLepreRandomSpeeches() {
    // Check for crab bucks anomaly first - this takes priority over other states
    if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.crabBucksAnomaly) {
      return this.getLepreCrabAnomalySpeeches();
    }
    
    // Check if Halloween mode is active
    const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                             (window.premiumState && window.premiumState.halloweenEventActive) ||
                             document.body.classList.contains('halloween-cargo-active') ||
                             document.body.classList.contains('halloween-event-active');
    
    // Return different speeches based on Lepre's anger level and time of day
    if (this.isLepreGone) {
      return []; // No speeches when Lepre is gone
    } else if (this.isBoutiqueClosed && !this.lepreIsMad && !this.lepreIsVeryMad) {
      return this.getNightTimeSpeeches(); // Night-time speeches when closed but Lepre is still here
    } else if (this.lepreIsVeryMad) {
      return this.getLepreVeryMadRandomSpeeches();
    } else if (this.lepreIsMad) {
      return this.getLepreMadRandomSpeeches();
    } else {
      // For normal speeches, 50% chance to use Halloween speeches when Halloween mode is active
      if (isHalloweenActive && Math.random() < 0.5) {
        return this.getLepreHalloweenRandomSpeeches();
      } else {
        return this.getLepreNormalRandomSpeeches();
      }
    }
  }

  // Challenge speech quotes - Lepre comparing their PB with player's PB (magical nonsensical explanations)
  getLepreChallengeQuotes() {
    return [
      // When Lepre's PB is better than player's (Lepre survived longer) - showing off with ridiculous explanations
      { text: () => `My Power Generator Challenge time of ${(window.state.characterChallengePBs?.lepre || 0)} seconds beats your ${window.state.powerChallengePersonalBest || 0} seconds! I used my secret jester magic to get this time!`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.lepre) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `${(window.state.characterChallengePBs?.lepre || 0)} seconds versus your ${window.state.powerChallengePersonalBest || 0} seconds! You'll get to my level one day.`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.lepre) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `I survived ${(parseFloat(window.state.characterChallengePBs?.lepre || 0) - parseFloat(window.state.powerChallengePersonalBest || 0)).toFixed(2)} seconds longer than you! The power generator is actually ticklish, so I kept it laughing and thats how I get my time!`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.lepre) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `Power Generator Challenge results: Me ${(window.state.characterChallengePBs?.lepre || 0)} seconds, you ${window.state.powerChallengePersonalBest || 0} seconds! I performed interpretive dance to confuse the power drainage to get this time!`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.lepre) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `Your ${window.state.powerChallengePersonalBest || 0} seconds is good, but my ${(window.state.characterChallengePBs?.lepre || 0)} seconds is better! I told the generator knock-knock jokes to keep it distracted while I quickly click the red tiles!`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.lepre) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      
      
      { text: () => `Your ${window.state.powerChallengePersonalBest || 0} seconds is suspiciously good! I bet you used illegal ways of getting such time!`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.lepre);
      }},
      
      // When PBs are very close (within 3 seconds) - Lepre gets technical with nonsense
      { text: () => `Less than 3 seconds difference! How the hell did you manage that?`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.lepre)) <= 3.0;
      }},
      { text: () => `Our Power Generator Challenge times are practically identical! That should not be possible, I thought I was the best at that challenge!`, condition: () => {
        return window.state.characterChallengePBs?.lepre && window.state.powerChallengePersonalBest && 
               Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.lepre)) <= 3.0;
      }},
      
      // General magical nonsense banter about the challenge
      { text: "The Power Generator Challenge is easy when you know the ancient jester secret of... I'm not telling.", condition: () => window.state.characterChallengePBs?.lepre || window.state.powerChallengePersonalBest },
      { text: "I've trained for the Power Generator Challenge with my magic! Look at how effective my strategy is!", condition: () => window.state.characterChallengePBs?.lepre || window.state.powerChallengePersonalBest },
      { text: "The secret to Power Generator Challenge mastery? Sing lullabies to the power generator until it power drainage falls asleep!", condition: () => window.state.characterChallengePBs?.lepre || window.state.powerChallengePersonalBest },
      { text: "My Power Generator Challenge technique involves bribing the electrons with tiny Swa Bucks. They love capitalism!", condition: () => window.state.characterChallengePBs?.lepre || window.state.powerChallengePersonalBest },
      { text: "The power generator and I have a mutual understanding: It pretends to be dangerous, and I pretend to be scared!", condition: () => window.state.characterChallengePBs?.lepre || window.state.powerChallengePersonalBest },
      { text: "The trick to surviving the Power Generator Challenge? Tell it you're made of the finest insulating materials! Like premium fabric and then the inner workings of the challenge will stop draining the power!", condition: () => window.state.characterChallengePBs?.lepre || window.state.powerChallengePersonalBest },
      
      // Token Challenge specific quotes (only appear if player has done token challenge at least once)
      { text: () => `You scored ${window.state.tokenChallengePersonalBest || 0} points in my Token Challenge? Not bad! I taught those tokens how to dance to confuse you, but you still did well!`, condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
      { text: () => `Your Token Challenge personal best of ${window.state.tokenChallengePersonalBest || 0} points is impressive! I whispered secrets to each token about where they belong, but you figured it out anyway!`, condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
      { text: "The Token Challenge gets trickier as you progress! I programmed the tokens to have personalities, some are shy, some are rebellious, and some just want to go home!", condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
      { text: "My Token Challenge is a masterpiece of controlled chaos! The slots rearrange themselves because I taught them interpretive dance!", condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
      { text: () => `I've seen you attempt my Token Challenge! ${window.state.tokenChallengePersonalBest || 0} points is your record? The tokens told me they enjoyed meeting you!`, condition: () => window.state.tokenChallengePersonalBest && window.state.tokenChallengePersonalBest > 0 },
    ];
  }

  getLepreNormalRandomSpeeches() {
  return [
    "Welcome to my humble shop! Vi invited me here... officially, of course!",
    "I used to perform for crowds, now I perform transactions! *jingles coins*",
    "The jester life led me here... and what a profitable detour it's been!",
    "Vi said I could set up shop here. I think they were joking, but here I am! Just don't tell 𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒.",
    "From entertaining nobles to selling tokens... quite the career change!",
    "My juggling skills translate well to inventory management!",
    "The facility's much quieter than the royal court.",
    "Between you and me, Vi's invitation was more of a dare than permission.",
    "I've performed in circuses, now I perform commerce! Progress!",
    "These tokens are like props, but they actually do something useful!",
    "From court jester to token merchant... what a tale to tell!",
    "Vi thought I was joking when I said I'd set up a shop here. Joke's on them!",
    "Trading jokes for tokens, quite literally!",
    "I may look silly, but my prices are seriously good!",
    "Just because I'm a jester doesn't mean I don't know good value!",
    "Watch me juggle these tokens all at once!",
    "These tokens are like my jokes - they always land!",
    "I used to entertain crowds, now I entertain customers!",
    "Who knew juggling tokens would be my next act?",
    "I may be a jester, but I take my business seriously!",
    "Maybe I should perform a show here in this facility.",
    "Do not touch my chest zipper! That is off limit!",
    "I am a jester, not a leprechaun!",
    "Let me tell you a secret, the code 'Give me 1 million swa bucks' is a trap!",
    "You wanna know what's behind the zipper? A jester's secrets!",
    "Mushrooms, Stardusts, Batteries, its all yours my friend! As long as you have enough Swa bucks~",
    "I look like a living plushy? That's because I am one.",
    "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒 has no idea about this little boutique I added here. Just don't tell them, okay?",
    "It is I, the amazing Lepre!",
    "I've walked around the facility and one of the rooms smells alot like soap. And no it's not the bathrooms.",
    "Soap is always cleaning something. I once caught them polishing the power generator!",
    "Soap tried to sell me a soap bar once. So I gave them 10 swa bucks for it!",
    "Vi is so quiet in the prism lab, sometimes I forget they're there until I see a flash of light.",
    "Vi once explained how prisms work. I nodded, but I was thinking about my next magic trick.",
    "I don't even dare to enter the kitchen, I won't be eating anything there and I'll just get my stuffing dirty!",
    "Mystic's food always looks magical, but I can't eat it. Fabric diet, you know?",
    // Fluzzer-related speeches (only if expansion/grade >= 6)
    ...(window.state && window.state.grade && (typeof window.state.grade === 'number' ? window.state.grade >= 6 : (window.state.grade.gte && window.state.grade.gte(6))) ? [
      "The funniest thing happened while I was juggling petal tokens in front of Fluzzer! They started juggling with me!",
      "Fluzzer gave me a flower once. I traded it for a petal token. Business is business!"
    ] : []),
    // Bijou-related speeches (only if Bijou is active)
    ...(window.premiumState && window.premiumState.bijouUnlocked && window.premiumState.bijouEnabled ? [
      "Aww look at that little Bijou nestling on your head.",
      "Hey can you tell Bijou to hide their magnet? I'm scared they will steal all my tokens!",
      "I offered Bijou a special deal on magnets. They said they already have the best one.",
      "I bet Bijou is jealous of my energy.",
      "I hope Bijou is being a great help with your token collecting!"
    ] : []),
    // Anomaly-related speeches (only appear after doing an infinity reset at least once)
    ...(window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 ? [
      "Ever since that infinity business, reality's been acting like a bad magic trick! At least my tokens are still real!",
      "Peachy I swear these anomalies are not my acts! These are real!",
      "What? You used the anomaly resolver on me and it says I'm 60% fabric and 40% mechanical? N-no! I-I'm 100% fabric! Trust me!",
      "The anomalies seem fascinated by my token collection. I guess even cosmic chaos appreciates good merchandise!",
      "I've started including 'anomaly insurance' in my prices. You never know when reality might glitch mid-transaction!",
      "Between you and me, these reality tears make for interesting storage space. Just don't ask what's in the back room, because that back door was not there before!",
      "I tried juggling an anomaly once. Big mistake! It juggled ME instead!",
      "The facility's gotten stranger since the fluff has gone infinity. Hopefully that does not affect my tokens!",
      "These dimensional distortions remind me of hecklers at royal performances. Annoying but part of the show!",
      "I've seen anomalies try to steal my tokens! Cosmic thieves have no respect for honest merchants!",
      "Reality's more unstable than a house of cards in a windstorm. At least my prices are still stable!",
      "These reality fluctuations make my magic tricks look mundane! Who needs illusions when reality's already broken?",
      "Between dimensional tears and angry customers, I don't know which is more unpredictable!",
      "I tried selling 'anomaly repellent' but turns out it was just glitter. Still sold well though!",
      "These cosmic disturbances are like the ultimate magic show - reality disappearing and reappearing at will!"
    ] : []),
    
    // Hexed Peachy concern dialogues - only appear when Peachy is hexed
    ...(window.state?.halloweenEvent?.jadeca?.peachyIsHexed ? [
      "Peachy... that mark on you! That's no ordinary stage makeup! What happened?",
      "I've seen cursed props in my jester days, but that mark on you is the real deal. This is concerning.",
      "That purple glow around you... it's not part of any trick I know. Are you cursed?",
      "In all my years performing magic tricks, I've never seen a mark like that. What did you get yourself into?",
      "I tried to juggle a token near you and it started glowing purple! That mark has real power!",
      "That's not stage magic, that's a genuine curse! Who did this to you, Peachy?",
      "I've worked with illusionists and magicians, but whatever marked you is beyond parlor tricks!",
      "I'd offer to sell you a curse removal token, but I don't think any of my wares can help with that mark.",
      "That mark is making my fabric stuffing feel uncomfortable. Whatever cursed you has serious magical weight.",
      "I've performed for cursed nobles before, but your mark is on another level entirely!",
      "The tokens in my shop are reacting to your presence now. That mark is radiating dark magic.",
      "I wish I could juggle that curse away for you, but this is beyond my jester abilities.",
      "That mark looks like it was put there by someone with real magical knowledge. Not good.",
      "My trained eye can spot illusions easily, and that mark on you is definitely not an illusion!",
      "I've seen plenty of fake curses in theater shows, but yours is terrifyingly genuine.",
      "The cosmic energy from that mark is stronger than any anomaly I've felt. You need help, Peachy!",
      "I tried doing a magic trick to cheer you up, but the cards turned purple near you. That mark is powerful.",
      "That mark has a darkness I can feel even through my plushy fabric. Please be careful, Peachy."
    ] : [])
  ];
  }

  getLepreMadRandomSpeeches() {
    return [
      "Oh, you're STILL here? How wonderful for me...",
      "These prices reflect my current mood. Hint: it's not good.",
      "Maybe if people had better manners, my prices would be reasonable.",
      "I'm a PROFESSIONAL merchant, not your personal stress toy!",
      "Every token costs extra now. Call it an 'attitude adjustment fee.'",
      "Some customers think they can just poke me all day. Well, here's the consequence.",
      "I've dealt with spoiled nobles, but THIS takes the cake.",
      "My patience has been thoroughly tested today. Congratulations.",
      "Yes, everything is expensive now. Actions have consequences.",
      "I used to enjoy running this shop. Used to.",
      "Perhaps next time you'll think twice before being so... enthusiastic.",
      "The prices will stay high until I feel properly respected.",
      "I'm normally quite reasonable. This is NOT normal circumstances.",
      "Court jesters deal with hecklers better than I'm dealing with pokers.",
      "My mood affects my business model. Simple economics.",
      "These are 'premium irritation prices' - you've earned them!"
    ];
  }

  getLepreVeryMadRandomSpeeches() {
    return [
      "I'M GOING TO LOSE MY MIND! GET OUT OF MY SHOP!",
      "YOU HAVE EXACTLY 10 SECONDS TO LEAVE BEFORE I THROW YOU OUT!",
      "I'VE COMPLETELY SNAPPED! EVERYTHING IS 1000X MORE EXPENSIVE!",
      "GET OUT GET OUT GET OUT! I'M DONE WITH YOU!",
      "YOU'VE PUSHED ME BEYOND MY BREAKING POINT!",
      "I'M CALLING SECURITY! YOU'RE BANNED! LEAVE NOW!",
      "THIS IS YOUR FINAL WARNING! GET OUT IMMEDIATELY!",
      "I'VE HAD ENOUGH! YOU'RE THE WORST CUSTOMER EVER!",
      "LEAVE MY SHOP THIS INSTANT OR I'LL MAKE YOU LEAVE!",
      "YOU'VE BROKEN MY SPIRIT AND MY SHOP! GET OUT!",
      "I'M LITERALLY SEEING RED! LEAVE BEFORE I EXPLODE!",
      "GET OUT OR I'LL DRAG YOU OUT MYSELF!",
      "YOU'RE TRESPASSING NOW! I DON'T WANT YOUR BUSINESS!",
      "THIS IS HARASSMENT! SECURITY! SECURITY!",
      "I'M DONE BEING NICE! GET OUT OF MY SIGHT!",
      "YOU'VE MADE AN ENEMY FOR LIFE! LEAVE NOW!"
    ];
  }

  getLepreCrabAnomalySpeeches() {
    return [
      "What in the name of juggling... why are all my Swa Bucks CRABS?!",
      "I've seen many strange things as a court jester, but crab money is a new one!",
      "Are these... are these ACTUAL crabs instead of coins? What kind of sorcery is this?",
      "I demand an explanation! My beautiful coins have turned into... CRUSTACEANS!",
      "From jester to merchant to... crab wrangler? This wasn't in my career plan!",
      "These crabs better not start walking away with my profits!",
      "I've dealt with difficult audiences, but crab currency is beyond my expertise!",
      "Should I be calling an exterminator or an accountant at this point?",
      "This facility gets stranger by the day. First mysterious tokens, now CRAB MONEY!",
      "I suppose 'crab bucks' has a nice ring to it... but I prefer regular currency!",
      "Well, at least they're not trying to pinch me... yet.",
      "I wonder if these crab coins appreciate in value like real estate crabs do?",
      "This is definitely the weirdest gig I've ever had, and I once performed for sentient vegetables!",
      "Maybe I should start a crab circus instead of running this shop?",
      "I've juggled many things, but never live crustaceans disguised as money!",
      "Someone better fix this before these crabs start reproducing in my cash register!",
      "From court jester to crab merchant... what a plot twist!",
      "I hope these crabs don't eat my actual inventory...",
      "This is either brilliant marketing or the most elaborate prank ever!",
      "At least crabs are better than the time someone paid me in cheese wheels.",
      "🦀 *nervous crab sounds* - wait, am I speaking crab now too?!",
      "I've performed in front of royalty, but I've never been paid in seafood before!",
      "These crabs better not start forming their own little crab society in my shop!"
    ];
  }

  getLeprePokeSpeeches() {
    // Check for crab bucks anomaly first - special poke responses during crab chaos
    if (window.anomalySystem && window.anomalySystem.activeAnomalies && window.anomalySystem.activeAnomalies.crabBucksAnomaly) {
      return this.getLepreCrabPokeSpeeches();
    }
    
    // Check if Halloween mode is active
    const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                             (window.premiumState && window.premiumState.halloweenEventActive) ||
                             document.body.classList.contains('halloween-cargo-active') ||
                             document.body.classList.contains('halloween-event-active');
    
    // Return different speeches based on Lepre's anger level
    if (this.lepreIsVeryMad) {
      return this.getLepreVeryMadPokeSpeeches();
    } else if (this.lepreIsMad) {
      return this.getLepreMadPokeSpeeches();
    } else {
      // For normal poke speeches, 50% chance to use Halloween speeches when Halloween mode is active
      if (isHalloweenActive && Math.random() < 0.5) {
        return this.getLepreHalloweenPokeSpeeches();
      } else {
        return this.getLepreNormalPokeSpeeches();
      }
    }
  }

  getLepreCrabPokeSpeeches() {
    return [
      // Early pokes during crab anomaly (1-5)
      { min: 1, max: 5, speeches: [
        "Don't poke me! I'm already dealing with CRAB MONEY!",
        "Seriously? I have crab currency to figure out and you're POKING me?",
        "Stop that! I'm trying to understand why my coins are crustaceans!",
        "Not now! These crabs might think poking means feeding time!",
        "Do you see what's happening to my money?! And you're POKING me?!"
      ]},
      // Getting more frustrated with crabs AND pokes (6-15)
      { min: 6, max: 15, speeches: [
        "I'M DEALING WITH A CRAB INVASION AND YOU'RE MAKING IT WORSE!",
        "STOP POKING! The crabs might think it's some kind of signal!",
        "I have SEAFOOD for currency and you're adding to my stress!",
        "Between the crab money and your poking, I'm losing my mind!",
        "Can't you see I'm having a crustacean crisis here?!",
        "These crabs + your poking = one very unhappy jester!",
        "I'm trying to run a shop, not a seafood restaurant with aggressive customers!"
      ]},
      // Completely overwhelmed (16+)
      { min: 16, max: 999, speeches: [
        "CRABS EVERYWHERE AND YOU WON'T STOP POKING! I'M DONE!",
        "BETWEEN THE CRAB MONEY AND YOUR CONSTANT POKING, I'M LOSING IT!",
        "STOP! JUST STOP! I CAN'T HANDLE CRABS *AND* BEING POKED!",
        "I'M SURROUNDED BY CRUSTACEANS AND HARASSED BY CUSTOMERS!",
        "THIS IS MY WORST NIGHTMARE! CRAB MONEY AND POKE ATTACKS!",
        "GET OUT! TAKE YOUR POKING AND LEAVE ME WITH MY CRAB PROBLEMS!",
        "I'M CALLING BOTH SECURITY AND AN EXTERMINATOR!"
      ]}
    ];
  }

  getLepreNormalPokeSpeeches() {
    return [
      // Early pokes (1-5)
      { min: 1, max: 5, speeches: [
        "Oh! A curious visitor!",
        "Hehe, that tickles!",
        "Careful now, I'm delicate!",
        "Poking the merchant, are we?",
      ]},
      // Getting annoyed (6-15)
      { min: 6, max: 15, speeches: [
        "Alright, alright, I get it!",
        "Easy there, I'm not a punching bag!",
        "I'm trying to run a business here!",
        "That's enough poking, thank you!",
        "I'm a jester, not a pincushion!"
      ]},
      // More annoyed (16-30)
      { min: 16, max: 30, speeches: [
        "This is getting old really fast...",
        "Do you mind? I have tokens to sell!",
        "I'm losing my patience here...",
        "Stop that this instant!",
        "You're worse than the royal brats!",
        "This isn't part of my performance!"
      ]},
      // Very annoyed (36-49)
      { min: 36, max: 49, speeches: [
        "ENOUGH! You're really testing my limits!",
        "One more poke and there will be consequences!",
        "I'm WARNING you - stop this nonsense!",
        "My jester training didn't prepare me for THIS!",
        "You're about to see a very angry merchant!",
        "STOP OR I'LL MAKE YOU REGRET IT!"
      ]}
    ];
  }

  getLepreMadPokeSpeeches() {
    return [
      // All pokes when mad result in even angrier responses
      { min: 1, max: 5, speeches: [
        "Oh, you think this is FUNNY?!",
        "Really? You're going to poke me while I'm ALREADY angry?",
        "Perfect. Just perfect. More poking.",
        "I'm charging you double just for that poke!",
        "Do you ENJOY making bad situations worse?"
      ]},
      { min: 6, max: 15, speeches: [
        "I'M ALREADY MAD AND YOU'RE STILL POKING ME?!",
        "This is exactly why my prices are so high right now!",
        "You have some serious audacity, I'll give you that.",
        "Keep poking. See how much MORE expensive things get.",
        "My patience ran out HOURS ago, and yet here you are!",
        "Congratulations! You've found new ways to irritate me!"
      ]},
      { min: 16, max: 30, speeches: [
        "ARE YOU COMPLETELY INSANE?! STOP POKING ME!",
        "I'm angrier than a wet cat and you're STILL doing this?!",
        "You're lucky I don't ban you from my shop entirely!",
        "THIS IS WHY WE CAN'T HAVE NICE THINGS!",
        "I've met circus animals with better manners than you!",
        "You're making my bad day exponentially worse!"
      ]},
      { min: 36, max: 100, speeches: [
        "I'M GOING TO LOSE MY MIND! STOP! POKING! ME!",
        "You're absolutely relentless! I'm ALREADY furious!",
        "I QUIT! I'M DONE! NO MORE POKES!",
        "THIS IS HARASSMENT! MERCHANT HARASSMENT!",
        "I'm calling the facility security if you don't STOP!",
        "YOU'VE BROKEN MY SPIRIT! ARE YOU HAPPY NOW?!"
      ]}
    ];
  }

  getLepreVeryMadPokeSpeeches() {
    return [
      // All pokes when very mad result in extreme rage
      { min: 1, max: 100, speeches: [
        "STOP! STOP! STOP! I'M LITERALLY GOING INSANE!",
        "GET YOUR HANDS OFF ME! I'M CALLING THE ELITES!",
        "THAT'S IT! YOU'RE BANNED! SECURITY! SECURITY!",
        "I'M GOING TO HAVE A HEART ATTACK! STOP POKING ME!",
        "YOU'RE DEAD TO ME! GET OUT OF MY SHOP!",
        "I'M HAVING A COMPLETE BREAKDOWN! LEAVE ME ALONE!",
        "HELP! HELP! SOMEONE MAKE THEM STOP!",
        "I'M LITERALLY SHAKING WITH RAGE! GET AWAY!",
        "YOU'VE DESTROYED MY LIFE! ARE YOU HAPPY NOW?!",
        "STOP OR I'LL CLOSE THE SHOP FOREVER!",
        "GET OUT! GET OUT! I NEVER WANT TO SEE YOU AGAIN!",
        "YOU'RE THE WORST THING THAT'S EVER HAPPENED TO ME!",
        "I'M DONE! FINISHED! YOU'VE RUINED EVERYTHING!",
        "SECURITY! SOMEONE ARREST THIS PERSON!",
        "I'M HAVING A NERVOUS BREAKDOWN! STOP POKING!"
      ]}
    ];
  }

  // Halloween-specific dialogue for Lepre (only appears when Halloween mode is active)
  getLepreHalloweenRandomSpeeches() {
    return [
      "*BEEP BEEP* Oops! My costume's sound effects are malfunctioning! Totally normal for a Frankenstein outfit!",
      "*MECHANICAL HUMMING* Don't mind that noise, it's the battery pack for my costume's sound effects!",
      "It's ALIVE! And it's selling tokens at discounted prices! Mwahahaha!",
      "Call me Leprestein! I've been assembled from the finest merchant parts!",
      "RAAAHHH! Fear me, for I am... actually quite friendly and have excellent customer service!",
      "Behold! I have been brought to life by the power of magic and electronics!",
      "The villagers flee from my monstrous charm and irresistible token deals!",
      "I was created in the most dark of laboratories! Fear me as I am ALIVE!",
      "My creator stitched me together from fabric scraps and magic!",
      "FIRE BAD! WATER BAD! But token sales GOOD! Leprestein approve of capitalism!",
      "The lightning that brought me to life was 100% magical! And maybe some electricity involved!",
      "I may look scary, but I only terrorize bad prices and poor customer service!",
      "Graaahhh! I hunger... for successful business transactions and friendship!",
      "They said I couldn't be both dead AND a successful entrepreneur! I proved them wrong!",
      "Welcome to my castle... I mean, boutique! Same dark atmosphere, better merchandise!",
      "The other monsters are jealous of my token collection! Even the werewolves want my deals!",
      "With this Leprestein persona aside, I wish you to have a good Halloween, Peachy!",
    ];
  }

  getLepreHalloweenPokeSpeeches() {
    return [
      // Early pokes (1-5) - Halloween themed
      { min: 1, max: 5, speeches: [
        "Grahhh! You dare disturb Leprestein!? ...Oh wait, that actually felt nice!",
        "*MECHANICAL WHIRR* Agh! My costume's motion sensors are going off!",
        "RAAAHHH! ...Hehe, sorry, had to stay in character there!",
        "Leprestein does not appreciate the poking! But Lepre kinda does!",
        "You've awakened the beast! The very friendly, token-selling beast!"
      ]},
      // Getting annoyed (6-15) - Halloween themed
      { min: 6, max: 15, speeches: [
        "Even monsters need personal space, you know!",
        "*BEEP BEEP* Costume malfunction! I mean... GRAAAHHH, stop that!",
        "Leprestein is trying to conduct business here!",
        "The villagers usually run away by now! Why are you still poking?",
        "My creator didn't program me for this much social interaction!"
      ]},
      // More annoyed (16-30) - Halloween themed
      { min: 16, max: 30, speeches: [
        "Even Frankenstein's monster had better boundaries than this!",
        "*ELECTRONIC WHINING* My costume's getting overheated from annoyance!",
        "I'm about to go into scary merchant mode!",
        "The lightning that animated me is starting to get angry too!",
        "STOP! You're making my stitches come undone!",
        "I was reanimated to sell tokens, not to be a pincushion!"
      ]},
      // Very annoyed (36-49) - Halloween themed
      { min: 36, max: 49, speeches: [
        "LEPRESTEIN SMASH... your expectations with these great deals! But seriously, STOP POKING!",
        "*LOUD MECHANICAL GRINDING* My costume is about to explode from frustration!",
        "Even the mad scientist who created me wasn't this annoying!",
        "You're about to see what a REALLY angry reanimated merchant looks like!",
        "RAAAHHHHH! That's not character acting anymore, that's genuine rage!",
        "ONE MORE POKE AND I'LL TERRORIZE YOUR WALLET WITH INFLATED PRICES!"
      ]}
    ];
  }

  // Handle random Lepre speeches
  handleRandomSpeeches() {
    // Don't speak if Lepre is gone or during 727 anomaly sequence
    if (this.isLepreGone || this.isIn727AnomalySequence) return;
    
    const now = Date.now();
    const SPEECH_INTERVAL = 20000; // 20 seconds between random speeches
    
    if (now - this.lastRandomSpeechTime > SPEECH_INTERVAL) {
      // Only speak if boutique is open and Lepre isn't already talking
      const isInBoutique = document.querySelector('.sub-tab[style*="display: block"]')?.id === 'boutiqueSubTab';
      
      // Allow speeches when mad (with different content) or when not mad, or during night time
      if (isInBoutique && !this.isSpeaking) {
        if (Math.random() < 0.3) { // 30% chance every 20 seconds
          let speechText;
          
          // 15% chance for challenge speech (only when not mad or very mad)
          if (!this.lepreIsMad && !this.lepreIsVeryMad && Math.random() < 0.15) {
            // Ensure character PBs exist
            if (typeof window.ensureCharacterPBsExist === 'function') {
              window.ensureCharacterPBsExist();
            }
            
            // Filter challenge speeches by their conditions
            const challengeQuotes = this.getLepreChallengeQuotes();
            const availableChallengeSpeeches = challengeQuotes.filter(speech => {
              return speech.condition ? speech.condition() : true;
            });
            
            if (availableChallengeSpeeches.length > 0) {
              const randomChallengeSpeech = availableChallengeSpeeches[Math.floor(Math.random() * availableChallengeSpeeches.length)];
              speechText = typeof randomChallengeSpeech.text === 'function' ? randomChallengeSpeech.text() : randomChallengeSpeech.text;
            }
          }
          
          // If no challenge speech was selected, use regular speeches
          if (!speechText) {
            const speeches = this.getLepreRandomSpeeches(); // This will return appropriate speeches based on mad state and time
            if (speeches.length > 0) {
              const randomSpeech = speeches[Math.floor(Math.random() * speeches.length)];
              speechText = randomSpeech;
            }
          }
          
          if (speechText) {
            this.queueSpeech(speechText, 5000); // Show for 5 seconds
            this.lastRandomSpeechTime = now;
          }
        }
      }
    }
  }

  // Handle Lepre being poked
  pokeLepre() {
    const now = Date.now();
    
    // Reset poke count if more than 30 seconds have passed
    if (now - this.leprePokeStartTime > 30000) {
      this.leprePokeCount = 0;
      this.leprePokeStartTime = now;
    }
    
    this.leprePokeCount++;
    
    // Track for KitoFox Challenge 2 quest
    if (typeof window.trackKitoFox2LeprePoke === 'function') {
      window.trackKitoFox2LeprePoke();
    }
    
    // Check if Lepre should get mad (50 pokes in 30 seconds)
    if (this.leprePokeCount >= 50 && !this.lepreIsMad) {
      this.lepreGetsMad();
      return;
    }
    
    // Check if Lepre should get VERY mad (50 more pokes while already mad)
    if (this.lepreIsMad && !this.lepreIsVeryMad) {
      // Track pokes while mad separately
      if (now - this.lepreVeryMadStartTime > 30000) {
        this.lepreVeryMadPokeCount = 0;
        this.lepreVeryMadStartTime = now;
      }
      
      this.lepreVeryMadPokeCount++;
      
      if (this.lepreVeryMadPokeCount >= 50) {
        this.lepreGetsVeryMad();
        return;
      }
    }
    
    // Find appropriate speech based on poke count
    const pokeSpeeches = this.getLeprePokeSpeeches();
    let appropriateSpeeches = [];
    
    for (const category of pokeSpeeches) {
      if (this.leprePokeCount >= category.min && this.leprePokeCount <= category.max) {
        appropriateSpeeches = category.speeches;
        break;
      }
    }
    
    if (appropriateSpeeches.length > 0) {
      const randomSpeech = appropriateSpeeches[Math.floor(Math.random() * appropriateSpeeches.length)];
      // Always show poke speech immediately, interrupting any current speech
      this.forceSpeech(randomSpeech, 5000); // Always 5 seconds for poke speeches
    }
  }

  // Handle clicking on Lepre's chest zipper
  clickChestZipper(event) {
    // Prevent the click from triggering the regular pokeLepre function
    event.stopPropagation();

    // Unlock secret achievement 18
    if (typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('secret18');
    }
    
    // Force Lepre to get very angry and say the warning message
    this.clearSpeechQueue();
    this.forceSpeech("DO NOT TOUCH MY CHEST ZIPPER! THAT IS OFF LIMIT! GET OUT OF MY SHOP RIGHT NOW!", 3000);
    
    // Update Halloween images immediately after triggering angry state
    if (typeof window.updateHalloweenLepreImages === 'function') {
      window.updateHalloweenLepreImages();
    }
    
    // Kick the player out after a short delay to let them see the message
    setTimeout(() => {
      this.kickPlayerFromBoutique();
    }, 3000);
  }

  // Lepre gets mad and raises prices + delays restock
  lepreGetsMad() {
    this.lepreIsMad = true;
    this.lepreMadUntil = Date.now() + (24 * 60 * 60 * 1000); // Mad for 24 hours
    this.priceMultiplier = 10; // Prices x10
    
    // Reset apologize count when Lepre gets mad
    this.apologizeCount = 0;
    
    // Delay next restock to 24 hours from now
    this.lastRestockTime = Date.now() - (60 * 60 * 1000) + (24 * 60 * 60 * 1000); // Make it so next restock is in 24 hours
    
    // Update character display to show mad state
    this.updateLepreCharacterDisplay();
    
    // Clear any queued speeches and force this important message
    this.clearSpeechQueue();
    this.forceSpeech("THAT'S IT! I'VE HAD ENOUGH! MY PRICES ARE NOW 10X HIGHER AND NO RESTOCK FOR 24 HOURS! MAYBE THAT'LL TEACH YOU SOME MANNERS!", 8000);
    
    // Update UI to reflect new prices
    this.updateUIIfBoutiqueIsOpen();
    
    // Save the angry state
    if (typeof saveGame === 'function') {
      saveGame();
    }

  }

  // Lepre gets VERY mad and raises prices even more + kicks player out
  lepreGetsVeryMad() {

    this.lepreIsVeryMad = true;
    this.lepreVeryMadUntil = Date.now() + (48 * 60 * 60 * 1000); // Very mad for 48 hours
    this.priceMultiplier = 1000; // Prices x1000
    
    // Reset apologize count when Lepre gets very mad (don't let previous apologies carry over)
    this.apologizeCount = 0;
    
    // Note: We don't change restock time as requested
    
    // Update character display to show very mad state
    this.updateLepreCharacterDisplay();
    
    // Clear any queued speeches and force this VERY important message
    this.clearSpeechQueue();
    this.forceSpeech("I'VE COMPLETELY LOST IT! PRICES ARE NOW 1000X HIGHER! YOU HAVE 10 SECONDS TO LEAVE MY SHOP BEFORE I KICK YOU OUT!", 10000);
    
    // Start kick timer

    this.startKickTimer();
    
    // Update UI to reflect new prices
    this.updateUIIfBoutiqueIsOpen();
    
    // Save the very angry state
    if (typeof saveGame === 'function') {
      saveGame();
    }

  }

  // Start the 10-second kick timer
  startKickTimer() {

    // Clear any existing timer
    if (this.kickTimer) {

      clearTimeout(this.kickTimer);
    }
    
    // Set 10-second timer to kick player out of boutique
    this.kickTimer = setTimeout(() => {

      this.kickPlayerFromBoutique();
    }, 10000);

  }

  // Debug function to test kicking manually
  testKick() {

    this.kickPlayerFromBoutique();
  }

  // Kick player out of boutique
  // Add this method to check when boutique is opened
  onBoutiqueOpened() {


    // If Lepre is very mad, always restart kick timer when boutique is opened
    if (this.lepreIsVeryMad) {

      // Clear any existing timer first
      if (this.kickTimer) {

        clearTimeout(this.kickTimer);
        this.kickTimer = null;
      }
      
      // Start new kick timer
      this.startKickTimer();
      
      // Also show a warning message
      this.forceSpeech("YOU'RE BACK?! YOU HAVE 10 SECONDS TO LEAVE BEFORE I KICK YOU OUT AGAIN!", 5000);
    }
  }

  kickPlayerFromBoutique() {

    // Check if player is still in boutique using better detection
    const boutiqueTab = document.getElementById('boutiqueSubTab');
    const computedStyle = boutiqueTab ? window.getComputedStyle(boutiqueTab) : null;
    const isInBoutique = boutiqueTab && computedStyle && 
                        (computedStyle.display === 'block' || boutiqueTab.style.display === 'block');




    if (isInBoutique) {
      // Force switch to generators sub-tab (most likely to be available)

      // Use the proper switching function
      if (typeof switchHomeSubTab === 'function') {

        switchHomeSubTab('generatorMainTab');

      } else {
        // Fallback manual switching

        const generatorBtn = document.getElementById('generatorSubTabBtn');
        const generatorTab = document.getElementById('generatorSubTab');
        
        if (generatorBtn && generatorTab) {
          // Hide boutique
          boutiqueTab.style.display = 'none';
          
          // Show generators
          generatorTab.style.display = 'block';
          generatorBtn.classList.add('active');
        }
      }
      
      // Show kick message
      this.forceSpeech("GET OUT! GET OUT! GET OUT! I'M DONE WITH YOU!", 8000);
      
      // Show notification
      this.showMessage('Lepre has kicked you out of the boutique!', 'error');

    } else {

    }
    
    // Clear the timer
    this.kickTimer = null;
  }

  // Apologize to Lepre - requires 1000 apologies to calm down
  apologizeToLepre() {
    // Only allow apologies when Lepre is mad or very mad
    if (!this.lepreIsMad && !this.lepreIsVeryMad) {
      this.showMessage("Lepre isn't mad right now. No need to apologize!", 'info');
      return;
    }
    
    this.apologizeCount++;

    // Update the UI immediately
    this.updateLepreAngryWarning();
    
    // Show different messages based on apologize count
    let speechMessage;
    if (this.apologizeCount < 100) {
      const speeches = [
        "I don't believe you're really sorry yet...",
        "That's not enough! Keep apologizing!",
        "You need to do better than that!",
        "I'm still furious with you!",
        "Words are cheap! Show me you mean it!"
      ];
      speechMessage = speeches[Math.floor(Math.random() * speeches.length)];
    } else if (this.apologizeCount < 500) {
      const speeches = [
        "Well... at least you're trying...",
        "I'm starting to think you might be serious...",
        "Keep going, I'm listening...",
        "That's... that's a lot of apologies...",
        "Maybe you do feel bad about what you did..."
      ];
      speechMessage = speeches[Math.floor(Math.random() * speeches.length)];
    } else if (this.apologizeCount < 900) {
      const speeches = [
        "Alright, alright... I can see you're really trying...",
        "You've been at this for a while now...",
        "I'm starting to feel a little better...",
        "Your persistence is... admirable, I suppose...",
        "Maybe I was a bit harsh on you..."
      ];
      speechMessage = speeches[Math.floor(Math.random() * speeches.length)];
    } else if (this.apologizeCount < 1000) {
      const speeches = [
        "Almost there... I can feel my anger fading...",
        "Just a few more and I might forgive you...",
        "You're so close to earning my forgiveness...",
        "I'm impressed by your dedication...",
        "My heart is starting to soften..."
      ];
      speechMessage = speeches[Math.floor(Math.random() * speeches.length)];
    }
    
    // Check if they've apologized enough
    if (this.apologizeCount >= this.apologizeRequired) {
      this.calmLepreDown();
      return;
    }
    
    // Show speech if we have one
    if (speechMessage) {
      this.queueSpeech(speechMessage, 3000);
    }
    
    // Save the state
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }

  // Calm Lepre down after enough apologies
  calmLepreDown() {

    // Reset all mad states
    this.lepreIsMad = false;
    this.lepreIsVeryMad = false;
    this.priceMultiplier = 1;
    
    // Clear timers
    if (this.kickTimer) {
      clearTimeout(this.kickTimer);
      this.kickTimer = null;
    }
    
    // Reset restock time to normal (next hour)
    this.lastRestockTime = Date.now() - (60 * 60 * 1000) + (60 * 60 * 1000); // Next restock in 1 hour
    
    // Update character display to show normal state
    this.updateLepreCharacterDisplay();
    
    // Show forgiveness message
    this.clearSpeechQueue();
    this.forceSpeech("*sniff* You... you really mean it, don't you? I... I forgive you. Thank you for being so patient with me. Everything is back to normal now!", 8000);
    
    // Update UI
    this.updateUIIfBoutiqueIsOpen();
    
    // Save the calm state
    if (typeof saveGame === 'function') {
      saveGame();
    }
    
    this.showMessage('Lepre has forgiven you! Prices and restock are back to normal!', 'success');
  }

  // Check if Lepre is still mad and reset if time has passed
  checkLepreMadStatus() {
    // Check if very mad state should end
    if (this.lepreIsVeryMad && Date.now() > this.lepreVeryMadUntil) {
      this.lepreIsVeryMad = false;
      this.lepreVeryMadPokeCount = 0;
      // Clear kick timer if active
      if (this.kickTimer) {
        clearTimeout(this.kickTimer);
        this.kickTimer = null;
      }

      // Fall back to regular mad state with original timer
      this.priceMultiplier = 10;
      
      // Update character display to show mad (not very mad) state
      this.updateLepreCharacterDisplay();
      
      this.queueSpeech("I'm... I'm still angry, but I won't kick you out anymore. But prices are still high!", 5000);
      this.updateUIIfBoutiqueIsOpen();
      
      // Save the state change
      if (typeof saveGame === 'function') {
        saveGame();
      }
    }
    
    // Check if regular mad state should end
    if (this.lepreIsMad && !this.lepreIsVeryMad && Date.now() > this.lepreMadUntil) {
      this.lepreIsMad = false;
      this.priceMultiplier = 1;
      this.leprePokeCount = 0;
      this.lepreVeryMadPokeCount = 0;

      // Update character display to show normal state
      this.updateLepreCharacterDisplay();
      
      this.queueSpeech("*sigh* Alright, I've calmed down. Prices are back to normal. Please don't poke me so much!", 5000);
      this.updateUIIfBoutiqueIsOpen();
      
      // Save the calmed down state
      if (typeof saveGame === 'function') {
        saveGame();
      }
    }
  }

  // Boutique schedule system
  checkBoutiqueSchedule(gameMinutes) {
    const currentHour = Math.floor(gameMinutes / 60) % 24;
    const isCurrentlyInBoutique = this.isPlayerInBoutique();
    
    // Check if boutique should be closed (22:00 to 6:00)
    const shouldBeClosed = currentHour >= this.boutiqueCloseHour || currentHour < this.boutiqueOpenHour;
    
    // Check if Lepre should be gone (0:00 to 6:00) - Updated logic for clearer time handling
    const shouldLepreBeGone = currentHour >= 0 && currentHour < 6;
    
    // ALWAYS ensure Lepre is in the correct state based on current time
    if (shouldLepreBeGone && !this.isLepreGone) {
      // Lepre should be gone but is currently present - make him leave
      this.lepreLeaves();

    } else if (!shouldLepreBeGone && this.isLepreGone) {
      // Lepre should be present but is currently gone - bring him back
      this.openBoutique();
      if (isCurrentlyInBoutique) {
        if (currentHour >= this.boutiqueOpenHour && currentHour < this.boutiqueCloseHour) {
          this.queueSpeech("I'm back! The boutique is open for business!", 5000);
        } else {
          this.queueSpeech("I'm back! Though it's past closing time, so no trading until tomorrow!", 5000);
        }
      }

    }
    
    // Handle boutique opening/closing separately from Lepre presence
    if (currentHour >= this.boutiqueOpenHour && currentHour < this.boutiqueCloseHour && this.isBoutiqueClosed && !this.isLepreGone) {
      // Boutique should be open and Lepre is present
      this.isBoutiqueClosed = false;
      this.wasPlayerInBoutiqueBeforeClose = false;

    } else if ((currentHour >= this.boutiqueCloseHour || currentHour < this.boutiqueOpenHour) && !this.isBoutiqueClosed && !this.isLepreGone) {
      // Boutique should be closed but Lepre is still present (22:00-24:00)
      this.isBoutiqueClosed = true;
      if (isCurrentlyInBoutique && currentHour === this.boutiqueCloseHour) {
        this.wasPlayerInBoutiqueBeforeClose = true;
        this.queueSpeech("It's closing time! You can stay, but I can't sell anything after 22:00. Shop rules!", 6000);
      }

    }
    
    // Update UI if needed
    this.updateBoutiqueAccessibility();
  }
  
  isPlayerInBoutique() {
    const boutiqueTab = document.getElementById('boutiqueSubTab');
    return boutiqueTab && window.getComputedStyle(boutiqueTab).display === 'block';
  }
  
  closeBoutique() {
    this.isBoutiqueClosed = true;

  }
  
  lepreLeaves() {
    // Say goodbye before leaving
    this.queueSpeech("Well its midnight now, I need to go out and scavenge more tokens to sell, see ya later", 6000, () => {
      // Hide the Lepre character card after the speech ends
      const characterCard = document.getElementById('lepreCharacterCard');
      if (characterCard) {
        characterCard.style.display = 'none';
      }

    });
    
    this.isLepreGone = true;
    this.isBoutiqueClosed = true;

  }
  
  openBoutique() {
    this.isBoutiqueClosed = false;
    this.isLepreGone = false;
    this.wasPlayerInBoutiqueBeforeClose = false;
    
    // Show the Lepre character card again
    const characterCard = document.getElementById('lepreCharacterCard');
    if (characterCard) {
      characterCard.style.display = 'block';
    }
    
    // Update Lepre character display to show the image
    this.updateLepreCharacterDisplay();

  }
  
  updateBoutiqueAccessibility() {
    // Use the centralized boutique button visibility function
    if (typeof updateBoutiqueButtonVisibility === 'function') {
      updateBoutiqueButtonVisibility();
    } else if (typeof window.updateBoutiqueButtonVisibility === 'function') {
      window.updateBoutiqueButtonVisibility();
    }
  }
  
  getNightTimeSpeeches() {
    if (this.isLepreGone) {
      return []; // No speeches when Lepre is gone
    }
    
    return [
      "It's getting late... I should be heading home soon.",
      "Night shift isn't really my thing, you know.",
      "The shop feels different at night, doesn't it?",
      "*yawn* I'm getting pretty tired...",
      "Most folks are asleep by now. What keeps you up?",
      "The stars look beautiful tonight through the window.",
      "I prefer the daytime hustle and bustle, to be honest.",
      "After 22:00, I can't process any sales. Shop policy!",
      "Sometimes I wonder what the other characters do at night...",
      "The night brings out different customers, that's for sure."
    ];
  }

  // Speech queue system to prevent interruptions
  queueSpeech(message, duration = 5000, callback = null) {
    // Ensure minimum 5 seconds
    duration = Math.max(5000, duration);
    
    this.speechQueue.push({ message, duration, callback });
    this.processNextSpeech();
  }

  // Force a speech (for important messages like getting mad)
  forceSpeech(message, duration = 5000) {
    // Clear queue and any current speech
    this.clearSpeechQueue();
    this.clearCurrentSpeech();
    
    duration = Math.max(5000, duration); // Ensure minimum 5 seconds
    this.showLepreSpeech(message, duration, true); // Force parameter to bypass isSpeaking check
  }

  // Process the next speech in queue
  processNextSpeech() {
    if (this.isSpeaking || this.speechQueue.length === 0) {
      return;
    }

    let { message, duration, callback } = this.speechQueue.shift();
    // If message is an object (from old code), use .text property
    if (typeof message === 'object' && message !== null && 'text' in message) {
      message = message.text;
    }
    this.showLepreSpeech(message, duration, false, callback);
  }

  // Clear speech queue
  clearSpeechQueue() {
    this.speechQueue = [];
  }

  // Get the appropriate character images based on Lepre's emotional state
  getLepreImages() {
    if (this.lepreIsVeryMad) {
      return {
        normal: document.getElementById('lepreCharacterAngry'),
        speaking: document.getElementById('lepreCharacterAngrySpeaking')
      };
    } else if (this.lepreIsMad) {
      return {
        normal: document.getElementById('lepreCharacterMad'),
        speaking: document.getElementById('lepreCharacterMadSpeaking')
      };
    } else {
      return {
        normal: document.getElementById('lepreCharacterImage'),
        speaking: document.getElementById('lepreCharacterSpeaking')
      };
    }
  }

  // Get the appropriate speaking image based on message content and emotional state
  getLepreSpeakingImageForMessage(message) {
    // Special case: chest zipper messages should use specific speech images
    if (message === "Do not touch my chest zipper! That is off limit!") {
      return document.getElementById('lepreCharacterMadSpeaking');
    }
    if (message === "DO NOT TOUCH MY CHEST ZIPPER! THAT IS OFF LIMIT! GET OUT OF MY SHOP RIGHT NOW!") {
      return document.getElementById('lepreCharacterAngrySpeaking');
    }
    // Special case: jester correction should use mad speech image
    if (message === "I am a jester, not a leprechaun!") {
      return document.getElementById('lepreCharacterMadSpeaking');
    }
    
    // Otherwise use the normal emotional state logic
    const images = this.getLepreImages();
    return images.speaking;
  }

  // Get the appropriate speaking image based on token type and message content
  getLepreSpeakingImageForToken(message, tokenType) {
    // Special case: water tokens make Lepre angry
    if (tokenType === 'water') {
      return document.getElementById('lepreCharacterAngrySpeaking');
    }
    
    // For other tokens, use the regular message-based logic
    return this.getLepreSpeakingImageForMessage(message);
  }

  // Hide all Lepre character images
  hideAllLepreImages() {
    const imageIds = [
      'lepreCharacterImage',
      'lepreCharacterSpeaking', 
      'lepreCharacterThanks',
      'lepreCharacterMad',
      'lepreCharacterMadSpeaking',
      'lepreCharacterAngry',
      'lepreCharacterAngrySpeaking'
    ];
    
    imageIds.forEach(id => {
      const img = document.getElementById(id);
      if (img) {
        img.style.display = 'none';
      }
    });
  }

  // Update Lepre's character display based on current emotional state
  updateLepreCharacterDisplay() {
    // Don't show Lepre if he's gone (0:00-6:00)
    if (this.isLepreGone) {
      const characterCard = document.getElementById('lepreCharacterCard');
      if (characterCard) {
        characterCard.style.display = 'none';
      }
      return;
    }
    
    if (this.isSpeaking) {
      return; // Don't update if currently speaking
    }
    
    // Make sure character card is visible when Lepre should be present
    const characterCard = document.getElementById('lepreCharacterCard');
    if (characterCard) {
      characterCard.style.display = 'block';
    }
    
    const images = this.getLepreImages();
    this.hideAllLepreImages();
    
    if (images.normal) {
      images.normal.style.display = 'block';
    }
    
    // Notify quest system about character display update
    if (typeof window.onLepreCharacterDisplayUpdate === 'function') {
      window.onLepreCharacterDisplayUpdate();
    }
  }

  // Clear current speech and reset state
  clearCurrentSpeech() {
    if (this.currentSpeechTimeout) {
      clearTimeout(this.currentSpeechTimeout);
      this.currentSpeechTimeout = null;
    }

    // Hide speech bubble and reset images
    const images = this.getLepreImages();
    const speechBubble = document.getElementById('lepreSpeechBubble');
    
    // Also clean up any old .boutique-speech bubbles (for backwards compatibility)
    const characterCard = document.getElementById('lepreCharacterCard');
    if (characterCard) {
      const oldSpeechBubbles = characterCard.querySelectorAll('.boutique-speech');
      oldSpeechBubbles.forEach(bubble => bubble.remove());
    }
    
    // Hide all images first, then show the appropriate normal image
    this.hideAllLepreImages();
    if (images.normal) {
      images.normal.style.display = 'block';
    }
    
    if (speechBubble) {
      speechBubble.style.display = 'none';
    }
    
    this.isSpeaking = false;
    
    // Notify quest system about character display update
    if (typeof window.onLepreCharacterDisplayUpdate === 'function') {
      window.onLepreCharacterDisplayUpdate();
    }
  }

  // Generic function to show Lepre speech (now properly handles interruption)
  showLepreSpeech(message, duration = 5000, force = false, callback = null) {
    // If not forcing and already speaking, don't interrupt
    if (!force && this.isSpeaking) {
      return;
    }

    // If forcing or not currently speaking, clear any existing speech first
    if (force || this.isSpeaking) {
      this.clearCurrentSpeech();
    }

    duration = Math.max(5000, duration); // Ensure minimum 5 seconds
    this.isSpeaking = true;

    const images = this.getLepreImages();
    const speakingImage = this.getLepreSpeakingImageForMessage(message);
    
    if (images.normal && speakingImage) {
      // Hide all images first, then show the appropriate speaking image
      this.hideAllLepreImages();
      speakingImage.style.display = 'block';
      
      // Notify quest system about character display update
      if (typeof window.onLepreCharacterDisplayUpdate === 'function') {
        window.onLepreCharacterDisplayUpdate();
      }
      
      // Create or update speech bubble using the same style as other characters
      let speechBubble = document.getElementById('lepreSpeechBubble');
      if (!speechBubble) {
        speechBubble = document.createElement('div');
        speechBubble.id = 'lepreSpeechBubble';
        speechBubble.className = 'swaria-speech'; // Use the same class as other characters
        document.getElementById('lepreCharacterCard').appendChild(speechBubble);
      }
      
      speechBubble.textContent = message;
      speechBubble.style.display = 'block';
      
      // Set timeout to hide speech after duration
      this.currentSpeechTimeout = setTimeout(() => {
        this.clearCurrentSpeech();
        
        // Execute callback if provided
        if (callback && typeof callback === 'function') {
          callback();
        }
        
        // Process next speech in queue if any
        setTimeout(() => this.processNextSpeech(), 500); // Small delay between speeches
      }, duration);
    }
  }

  // Special function to show Lepre speech with token context for special reactions
  showLepreSpeechWithToken(message, duration = 5000, tokenType = null, force = false, callback = null) {
    // If not forcing and already speaking, don't interrupt
    if (!force && this.isSpeaking) {
      return;
    }

    // If forcing or not currently speaking, clear any existing speech first
    if (force || this.isSpeaking) {
      this.clearCurrentSpeech();
    }

    duration = Math.max(5000, duration); // Ensure minimum 5 seconds
    this.isSpeaking = true;

    const images = this.getLepreImages();
    const speakingImage = this.getLepreSpeakingImageForToken(message, tokenType);
    
    if (images.normal && speakingImage) {
      // Hide all images first, then show the appropriate speaking image
      this.hideAllLepreImages();
      
      // For water tokens, set the angry image source based on Halloween mode
      if (tokenType === 'water') {
        const isHalloweenActive = window.state && window.state.halloweenEventActive;
        const angryImageSrc = isHalloweenActive ? 
          'assets/icons/halloween lepre angry speech.png' : 
          'assets/icons/lepre angry speech.png';
        speakingImage.src = angryImageSrc;
      }
      
      speakingImage.style.display = 'block';
      
      // Create or update speech bubble using the same style as other characters
      let speechBubble = document.getElementById('lepreSpeechBubble');
      if (!speechBubble) {
        speechBubble = document.createElement('div');
        speechBubble.id = 'lepreSpeechBubble';
        speechBubble.className = 'swaria-speech'; // Use the same class as other characters
        document.getElementById('lepreCharacterCard').appendChild(speechBubble);
      }
      
      speechBubble.textContent = message;
      speechBubble.style.display = 'block';
      
      // Set timeout to hide speech after duration
      this.currentSpeechTimeout = setTimeout(() => {
        this.clearCurrentSpeech();
        
        // Execute callback if provided
        if (callback && typeof callback === 'function') {
          callback();
        }
        
        // Process next speech in queue if any
        setTimeout(() => this.processNextSpeech(), 500); // Small delay between speeches
      }, duration);
    }
  }

  debugRestock() {

    const now = Date.now();
  const RESTOCK_INTERVAL = 60 * 60 * 1000; // 1 hour
    const timeSinceLastRestock = this.lastRestockTime ? now - this.lastRestockTime : 0;
    const timeUntilNextRestock = RESTOCK_INTERVAL - timeSinceLastRestock;






  }

  forceRestock() {

    this.restockShop();
    this.updateUIIfBoutiqueIsOpen();

  }

  // Check if it's time to restock (every 24 real minutes)
  checkAndRestockShop() {
    const now = Date.now();
  const RESTOCK_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // If no previous restock time, or 24 minutes have passed, restock
    if (!this.lastRestockTime || (now - this.lastRestockTime) >= RESTOCK_INTERVAL) {

      this.restockShop();
      return true;
    }
    
    return false;
  }

  // Helper method to calculate game time passed since last restock
  getGameTimeSinceLastRestock(currentGameMinutes) {
    if (!this.lastRestockGameTime) {
      return 24 * 60; // Force restock if no previous time
    }
    
    // Handle day wrap-around
    if (currentGameMinutes >= this.lastRestockGameTime) {
      return currentGameMinutes - this.lastRestockGameTime;
    } else {
      // Day wrapped around (e.g., from 23:59 to 00:01)
      return (24 * 60 - this.lastRestockGameTime) + currentGameMinutes;
    }
  }

  restockShop() {

    // Reset daily stock
    this.dailyStock = {};
    
    // Reset free Swa Bucks availability (tied to restock cycle)
    // Note: We don't reset lastFreeBucksTime here, just make it available again

    // Reset Lepre's anger if he was mad
    const wasMAd = this.lepreIsMad;
    this.lepreIsMad = false;
    this.priceMultiplier = 1;
    this.leprePokeCount = 0;
    
    // Randomly select 4 normal tokens and 2 better tokens
    const selectedNormal = this.getRandomItems(this.normalTokens, 4);
    let selectedBetter = this.getRandomItems(this.betterTokens, 2);
    
    // 25% chance to replace the 6th item (2nd better item) with a premium item
    const shouldShowPremium = Math.random() < 0.25;
    let selectedPremium = null;
    
    if (shouldShowPremium) {
      // Filter premium items to only show ones that aren't already unlocked
      const availablePremiumItems = this.premiumItems.filter(item => !item.isUnlocked());
      
      if (availablePremiumItems.length > 0) {
        selectedPremium = this.getRandomItems(availablePremiumItems, 1)[0];
        // Replace the second better item with premium item
        selectedBetter = selectedBetter.slice(0, 1); // Keep only first better item

      }
    }
    
    // Combine selections
    this.currentShopItems = [...selectedNormal, ...selectedBetter];
    if (selectedPremium) {
      this.currentShopItems.push(selectedPremium);
    }
    
    // Set stock amounts
    this.currentShopItems.forEach(item => {
      if (item.category === 'normal') {
        // Random stock between 5-15 for normal items
        let baseStock = Math.floor(Math.random() * 11) + 5; // 5-15
        
        // Apply Lepre's friendship buff for extra stock (level 4+)
        let bonusStock = 0;
        if (window.friendship && window.friendship.Boutique && window.friendship.Boutique.level >= 4) {
          bonusStock = (window.friendship.Boutique.level - 3) * 2; // Level 4 = +2, Level 5 = +4, etc.
        }
        
        this.dailyStock[item.id] = baseStock + bonusStock;
        
        if (bonusStock > 0) {

        }
      } else if (item.category === 'premium') {
        // Always 1 for premium items (unlockable items)
        this.dailyStock[item.id] = 1;
      } else {
        // Always 1 for better items
        let baseStock = 1;
        
        // Apply Lepre's level 15 friendship buff for premium token stock (+4)
        if (item.category === 'better' && window.friendship && window.friendship.Boutique && window.friendship.Boutique.level >= 15) {
          baseStock += 4;

        }
        
        this.dailyStock[item.id] = baseStock;
      }
    });
    
    // Update restock time to current real time
    this.lastRestockTime = Date.now();



    // Show Lepre speech if he was mad
    if (wasMAd) {
      this.queueSpeech("Ah, the shop restocked! I've cooled down and my prices are back to normal. Let's start fresh!", 5000);
    } else {
      // Random restock speech
      const restockSpeeches = [
        "Fresh stock has arrived! Come see what's new!",
        "New tokens, new possibilities! Step right up!",
        "The inventory has been refreshed! What catches your eye?",
        "Restocked and ready for business!",
        "New day, new tokens! What will it be today?"
      ];
      const randomSpeech = restockSpeeches[Math.floor(Math.random() * restockSpeeches.length)];
      
      // Only show if player is in boutique
      const isInBoutique = document.querySelector('.sub-tab[style*="display: block"]')?.id === 'boutiqueSubTab';
      if (isInBoutique) {
        this.queueSpeech(randomSpeech, 5000);
      }
    }

    // Reset token challenge cooldown on restock
    this.tokenChallengeUsedSinceRestock = false;
    this.updateTokenChallengeButtonVisibility();
  }

  getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Helper method to update UI if boutique is currently open
  updateUIIfBoutiqueIsOpen() {
    // Check if the boutique tab is currently active by looking for the active class or display style
    const boutiqueTab = document.getElementById('boutiqueSubTab');

    // Check if boutique is currently visible and active
    const isBoutiqueActive = boutiqueTab && 
      (boutiqueTab.style.display !== 'none' || 
       boutiqueTab.classList.contains('active'));

    if (isBoutiqueActive) {
      // Boutique is currently open, update the UI
      this.updateBoutiqueUI();

    }
  }

  getTimeUntilRestock() {
    const now = Date.now();
  const RESTOCK_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
    
    if (!this.lastRestockTime) {
      return 'Restocking now...';
    }
    
    const timeSinceLastRestock = now - this.lastRestockTime;
    const timeUntilNextRestock = RESTOCK_INTERVAL - timeSinceLastRestock;
    
    if (timeUntilNextRestock <= 0) {
      return 'Restocking now...';
    }
    
    const minutes = Math.floor(timeUntilNextRestock / (1000 * 60));
    const seconds = Math.floor((timeUntilNextRestock % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }

  getCurrentPrice(itemId) {
    const item = this.currentShopItems.find(i => i.id === itemId);
    if (!item) return 0;
    
    // Check if Lepre is mad and apply price multiplier
    this.checkLepreMadStatus(); // Check if Lepre should calm down
    
    let basePrice = item.basePrice;
    
    // Apply Lepre's level 15 friendship buff for premium token price reduction (50% off)
    if (item.category === 'better' && window.friendship && window.friendship.Boutique && window.friendship.Boutique.level >= 15) {
      basePrice = Math.floor(basePrice * 0.5); // 50% price reduction

    }
    
    return Math.floor(basePrice * this.priceMultiplier);
  }

  canAfford(itemId) {
    const price = this.getCurrentPrice(itemId);
    const swabucks = window.state && window.state.swabucks ? window.state.swabucks : new Decimal(0);
    const stock = this.dailyStock[itemId] || 0;
    
    // Must have enough money AND stock available
    if (stock <= 0) return false;
    
    if (typeof swabucks.gte === 'function') {
      return swabucks.gte(price);
    }
    return swabucks >= price;
  }

  getStockRemaining(itemId) {
    return this.dailyStock[itemId] || 0;
  }

  purchaseItem(itemId) {
    // Check if boutique is closed for purchases
    if (this.isBoutiqueClosed) {
      if (this.isLepreGone) {
        this.showMessage("Lepre isn't here right now! Come back after 6:00 AM.", 'error');
      } else {
        this.showMessage("The register is locked during the night", 'error');
        this.queueSpeech("I'd love to help, but the register is locked for the night!", 4000);
      }
      return false;
    }
    
    // Check if 727 anomaly sequence is active - prevent purchases during this time
    if (this.isIn727AnomalySequence) {
      this.showMessage("Lepre is dealing with an anomaly right now! Please wait...", 'error');
      return false;
    }
    
    const stock = this.getStockRemaining(itemId);
    
    if (stock <= 0) {
      this.showMessage('Out of stock!', 'error');
      return false;
    }

    if (!this.canAfford(itemId)) {
      this.showMessage('Not enough Swa Bucks!', 'error');
      return false;
    }

    const item = this.currentShopItems.find(i => i.id === itemId);
    if (!item) {
      this.showMessage('Item not available!', 'error');
      return false;
    }

    const price = this.getCurrentPrice(itemId);
    const swabucks = window.state.swabucks;

    // Deduct cost
    if (typeof swabucks.sub === 'function') {
      window.state.swabucks = swabucks.sub(price);
    } else {
      window.state.swabucks = new Decimal(swabucks - price);
    }

    // Handle different item types
    if (item.category === 'premium') {
      // Handle premium unlockable items
      this.handlePremiumPurchase(item);
    } else {
      // Add token to inventory for normal/better items
      let tokenQuantity = 1;
      
      // Apply Lepre's friendship buff (level 10+): 2x tokens
      if (window.friendship && window.friendship.Boutique && window.friendship.Boutique.level >= 10) {
        tokenQuantity = 2;
      }
      
      this.addTokenToInventory(itemId, tokenQuantity);
    }

    // Check if this purchase will deplete the stock completely
    const stockBeforePurchase = this.dailyStock[itemId];
    const willDepletStock = stockBeforePurchase === 1;
    
    // Reduce stock
    this.dailyStock[itemId]--;

    // Award Lepre friendship points if stock was depleted
    if (willDepletStock) {
      this.awardLepreFriendshipForStockDepletion();
    }

    // Award Lepre friendship for any token purchase
    this.awardLepreFriendshipForTokenPurchase();

    // Track purchase
    this.purchaseHistory[itemId] = (this.purchaseHistory[itemId] || 0) + 1;
    
    // Track for KitoFox Challenge 2 quest
    if (typeof window.trackKitoFox2LepreShopPurchase === 'function') {
      window.trackKitoFox2LepreShopPurchase();
    }
    
    // Track for Lepre quests
    if (typeof window.trackLepreShopPurchase === 'function') {
      window.trackLepreShopPurchase(itemId, 1);
    }

    // Check for secret achievement - buying while Lepre is very mad
    if (this.lepreIsVeryMad && typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('secret16');
    }

    // Check for 727 shop item anomaly - Lepre notices something wrong and refunds
    if (this.detect727Anomaly(price)) {
      // Refund the Swa Bucks
      if (typeof window.state.swabucks.add === 'function') {
        window.state.swabucks = window.state.swabucks.add(price);
      } else {
        window.state.swabucks = new Decimal(window.state.swabucks + price);
      }
      
      // Restore the stock since the purchase is being refunded
      this.dailyStock[itemId]++;
      
      // Undo the purchase tracking
      if (this.purchaseHistory[itemId] > 0) {
        this.purchaseHistory[itemId]--;
      }
      
      // Remove the token from inventory if it was added
      if (item.category !== 'premium') {
        // Calculate how many tokens were added (considering friendship buff)
        let tokensToRemove = 1;
        if (window.friendship && window.friendship.Boutique && window.friendship.Boutique.level >= 10) {
          tokensToRemove = 2;
        }
        this.removeTokenFromInventory(itemId, tokensToRemove);
      }
      
      // Show Lepre's anomaly detection speech and refund message
      this.handleLepreAnomalyRefund(item, price);
      
      // Update UI with refunded amounts
      this.updateBoutiqueUI();
      this.updateCurrencyDisplay();
      
      // Save game with refunded state
      if (typeof saveGame === 'function') {
        saveGame();
      }
      
      return true; // Still return true since the transaction was handled
    }

    // Update UI
    this.updateBoutiqueUI();
    this.updateCurrencyDisplay();

    // Show purchase message with friendship bonus if applicable
    let purchaseMessage = `Purchased ${item.name}!`;
    if (window.friendship && window.friendship.Boutique && window.friendship.Boutique.level >= 10 && item.category !== 'premium') {
      purchaseMessage += ` (2x bonus from friendship!)`;
    }
    this.showMessage(purchaseMessage, 'success');
    
    // Show Lepre's thank you animation
    this.showLepreThanks();
    
    // Save game
    if (typeof saveGame === 'function') {
      saveGame();
    }

    return true;
  }

  // Detect if the purchase price indicates a 727 shop item anomaly
  detect727Anomaly(price) {
    // Check if the price is exactly 727 or contains 727 in some way
    const priceStr = price.toString();
    return priceStr === '727' || priceStr.includes('727');
  }

  // Handle Lepre's response to detecting a 727 anomaly and issue refund
  handleLepreAnomalyRefund(item, refundAmount) {
    // Disable random speeches during the anomaly sequence
    this.isIn727AnomalySequence = true;
    
    // Change Lepre to mad images for the anomaly detection
    this.setLepreToMadImages();
    
    // Show immediate shock/confusion reaction
    this.forceSpeech("Wait... something's not right here...", 3000);
    
    // Queue follow-up speeches explaining the anomaly detection
    setTimeout(() => {
      this.queueSpeech("That price... 727? That's not one of MY prices!", 4000);
    }, 3000);
    
    setTimeout(() => {
      this.queueSpeech("This has anomaly written all over it! I'm giving you a full refund!", 4000);
    }, 7000);
    
    // Show refund notification when the refund speech actually starts
    // The speech queue timing: forceSpeech (3s) + first queueSpeech (4s) = 7s before refund speech starts
    setTimeout(() => {
      this.showMessage(`Lepre refunded the ${refundAmount} Swa Bucks!`, 'success');
    }, 20000); // 7s + 500ms buffer to ensure the refund speech has started
    
    setTimeout(() => {
      const refundMessages = [
        "I may be a jester, but I know when reality is playing tricks!",
        "My prices don't work like that - here's your money back!",
        "Something's messing with my shop! Take your Swa Bucks back!",
        "That's definitely not a legitimate transaction!",
        "I've seen enough anomalies to recognize one when I see it!"
      ];
      const randomRefundMessage = refundMessages[Math.floor(Math.random() * refundMessages.length)];
      this.queueSpeech(randomRefundMessage, 4000);
    }, 11000);
    
    // Return to normal images and re-enable random speeches after the anomaly detection sequence
    setTimeout(() => {
      this.restoreLepreToNormalImages();
      // Lepre manually fixes the 727 anomaly after the dialogue sequence
      if (window.anomalySystem && typeof window.anomalySystem.fixShopPriceAnomaly === 'function') {
        window.anomalySystem.fixShopPriceAnomaly();
      }
      this.isIn727AnomalySequence = false; // Re-enable random speeches
    }, 22000);
  }

  // Set Lepre to use mad images during anomaly detection
  setLepreToMadImages() {
    const normalImg = document.getElementById('lepreCharacterImage');
    const speakingImg = document.getElementById('lepreCharacterSpeaking');
    
    if (normalImg) {
      normalImg.src = window.getHalloweenLepreImage ? window.getHalloweenLepreImage('mad') : 'assets/icons/lepre mad.png';
    }
    
    if (speakingImg) {
      speakingImg.src = window.getHalloweenLepreImage ? window.getHalloweenLepreImage('mad_speech') : 'assets/icons/lepre mad speech.png';
    }
  }

  // Restore Lepre to normal images after anomaly detection
  restoreLepreToNormalImages() {
    const normalImg = document.getElementById('lepreCharacterImage');
    const speakingImg = document.getElementById('lepreCharacterSpeaking');
    
    if (normalImg) {
      normalImg.src = window.getHalloweenLepreImage ? window.getHalloweenLepreImage('normal') : 'assets/icons/lepre.png';
    }
    
    if (speakingImg) {
      speakingImg.src = window.getHalloweenLepreImage ? window.getHalloweenLepreImage('speech') : 'assets/icons/lepre speech.png';
    }
  }

  // Remove tokens from inventory (helper method for refunds)
  removeTokenFromInventory(tokenType, quantity) {
    // Map token IDs to inventory token types
    const tokenMapping = {
      berries: 'berryTokens',
      mushroom: 'mushroomTokens', 
      petals: 'petalTokens',
      water: 'waterTokens',
      stardust: 'stardustTokens',
      sparks: 'sparkTokens',
      prisma: 'prismaTokens',
      berryPlate: 'berryPlateTokens',
      mushroomSoup: 'mushroomSoupTokens',
      glitteringPetals: 'glitteringPetalTokens',
      batteries: 'batteryTokens',
      chargedPrisma: 'chargedPrismaTokens'
    };
    
    const inventoryTokenType = tokenMapping[tokenType];
    if (!inventoryTokenType) return;
    
    // Initialize token inventory if it doesn't exist
    if (!window.state.tokens) {
      window.state.tokens = {};
    }
    
    if (!window.state.tokens[inventoryTokenType]) {
      window.state.tokens[inventoryTokenType] = new Decimal(0);
    }
    
    // Ensure it's a Decimal
    if (!DecimalUtils.isDecimal(window.state.tokens[inventoryTokenType])) {
      window.state.tokens[inventoryTokenType] = new Decimal(window.state.tokens[inventoryTokenType] || 0);
    }
    
    // Remove tokens (but don't go below 0)
    const currentAmount = window.state.tokens[inventoryTokenType];
    const newAmount = currentAmount.sub(quantity);
    window.state.tokens[inventoryTokenType] = newAmount.max(0);
  }

  awardLepreFriendshipForStockDepletion() {
    // Award Lepre 2% friendship points based on their current amount when player buys out entire stock
    if (window.friendship && typeof window.friendship.addPoints === 'function') {
      // Initialize Boutique friendship if it doesn't exist
      if (!window.friendship.Boutique) {
        window.friendship.Boutique = { level: 0, points: new Decimal(0) };
      }
      
      const currentPoints = window.friendship.Boutique.points || new Decimal(0);
      
      // Calculate 2% of current points (minimum 1 point)
      let friendshipGain = currentPoints.mul(0.02);
      if (friendshipGain.lt(1)) {
        friendshipGain = new Decimal(1);
      }
      
      // Add the friendship points using Lepre's character name
      window.friendship.addPoints('lepre', friendshipGain);
      
      // Show a special message
      this.showMessage(`Lepre appreciates you buying out the entire stock! (+${friendshipGain.toFixed(1)} friendship)`, 'success');
      
      // Queue a special speech from Lepre
      this.queueSpeech("Wow, you bought everything! I really appreciate loyal customers like you!", 4000);
    }
  }

  awardLepreFriendshipForTokenPurchase() {
    if (!window.friendship || typeof window.friendship.addPoints !== 'function') {
      return;
    }

    const currentFriendship = window.friendship.getFriendshipLevel('lepre');
    if (!currentFriendship || !DecimalUtils.isDecimal(currentFriendship.points)) {
      return;
    }

    const friendshipIncrease = currentFriendship.points.mul(0.002);
    const minIncrease = new Decimal(0.1);
    const finalIncrease = Decimal.max(friendshipIncrease, minIncrease);

    window.friendship.addPoints('lepre', finalIncrease);
  }

  handlePremiumPurchase(item) {
    // Handle premium item purchases by calling the appropriate unlock function
    if (item.id === 'bijou') {
      // Unlock Bijou
      window.premiumState.bijouUnlocked = true;
      window.premiumState.bijouEnabled = true;
      
      // Call all the same functions as the original premium system
      if (typeof window.savePremiumState === 'function') {
        window.savePremiumState();
      }
      if (typeof window.updatePremiumUI === 'function') {
        window.updatePremiumUI();
      }
      if (typeof window.updateUI === 'function') {
        window.updateUI();
      }
      if (typeof window.updateBijouUIVisibility === 'function') {
        window.updateBijouUIVisibility();
      }
      if (window.cafeteria && typeof window.cafeteria.refreshCharacterCards === 'function') {
        window.cafeteria.refreshCharacterCards();
      }
      if (typeof updateMainCargoCharacterImage === 'function') {
        updateMainCargoCharacterImage();
      }
      if (typeof updatePrismLabCharacterImage === 'function') {
        updatePrismLabCharacterImage();
      }
      if (typeof updateHardModeQuestCharacterImage === 'function') {
        updateHardModeQuestCharacterImage();
      }
      if (typeof updateTerrariumCharacterImage === 'function') {
        updateTerrariumCharacterImage();
      }
      if (typeof window.triggerBijouUnlockStory === 'function') {
        window.triggerBijouUnlockStory();
      }
      
      this.queueSpeech("Congratulations on unlocking Bijou! They'll be a great help collecting tokens!", 6000);
      
    } else if (item.id === 'vrchatMirror') {
      // Unlock VRChat Mirror
      window.premiumState.vrchatMirrorUnlocked = true;
      
      if (typeof window.savePremiumState === 'function') {
        window.savePremiumState();
      }
      if (typeof window.updatePremiumUI === 'function') {
        window.updatePremiumUI();
      }
      if (typeof window.updateUI === 'function') {
        window.updateUI();
      }
      
      this.queueSpeech("You've unlocked the VRChat Mirror! The mirror world awaits you!", 6000);
    }
  }

  showLepreThanks() {
    // Change Lepre's image to the thank you image
    const normalImg = document.getElementById('lepreCharacterImage');
    const speakingImg = document.getElementById('lepreCharacterSpeaking');
    const thanksImg = document.getElementById('lepreCharacterThanks');
    
    if (normalImg && thanksImg) {
      // Hide other images and show thanks image
      normalImg.style.display = 'none';
      if (speakingImg) speakingImg.style.display = 'none';
      thanksImg.style.display = 'block';
      
      // Set the thanks image source
      thanksImg.src = 'assets/icons/Lepre thx.png';
      
      // Reset back to normal image after 3 seconds
      setTimeout(() => {
        thanksImg.style.display = 'none';
        normalImg.style.display = 'block';
      }, 3000);
    }
    
    // Use the unified speech system for the message
    const thankYouMessages = [
      "Thank you for your purchase!",
      "Pleasure doing business with you!",
      "Come back anytime!",
      "Excellent choice!",
      "Much appreciated!"
    ];
    
    const randomMessage = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
    this.forceSpeech(randomMessage, 3000); // Force immediate speech to interrupt current speech
  }

  showLepreGreeting() {
    // Only show greeting once per session
    if (this.hasShownGreeting) return;
    this.hasShownGreeting = true;
    
    // Use the unified speech system instead of separate greeting display
    const greetings = [
      "Welcome to my boutique!",
      "Fresh tokens daily!",
      "Something special for you today!",
      "Quality tokens at fair prices!",
      "Step right up! Best deals in the facility!",
      "Good to see you again!",
      "What can I interest you in today?"
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    // Use a small delay to ensure the boutique UI is ready, then queue the greeting
    setTimeout(() => {
      this.queueSpeech(randomGreeting, 4000); // Use queue system with 4 second duration
    }, 500);
  }

  addTokenToInventory(tokenType, quantity) {
    // Ensure kitchenIngredients exists
    if (!window.kitchenIngredients) {
      window.kitchenIngredients = {};
    }

    // Map token types to storage keys
    const tokenMapping = {
      'berries': 'berries',
      'berry': 'berries',
      'mushroom': 'mushroom',
      'petals': 'petals',
      'petal': 'petals',
      'water': 'water',
      'stardust': 'stardust',
      'sparks': 'sparks',
      'spark': 'sparks',
      'prisma': 'prisma'
    };

    const storageKey = tokenMapping[tokenType] || tokenType;

    // Special handling for tokens stored in window.state
    if (tokenType === 'batteries' || tokenType === 'battery') {
      if (!window.state.batteries) {
        window.state.batteries = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.batteries)) {
        window.state.batteries = new Decimal(window.state.batteries);
      }
      window.state.batteries = window.state.batteries.add(quantity);
    } else if (tokenType === 'swabucks') {
      if (!window.state.swabucks) {
        window.state.swabucks = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.swabucks)) {
        window.state.swabucks = new Decimal(window.state.swabucks);
      }
      window.state.swabucks = window.state.swabucks.add(quantity);
    } else if (tokenType === 'berryPlate' || tokenType === 'berryplate') {
      if (!window.state.berryPlate) {
        window.state.berryPlate = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.berryPlate)) {
        window.state.berryPlate = new Decimal(window.state.berryPlate);
      }
      window.state.berryPlate = window.state.berryPlate.add(quantity);
    } else if (tokenType === 'mushroomSoup' || tokenType === 'mushroomsoup') {
      if (!window.state.mushroomSoup) {
        window.state.mushroomSoup = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.mushroomSoup)) {
        window.state.mushroomSoup = new Decimal(window.state.mushroomSoup);
      }
      window.state.mushroomSoup = window.state.mushroomSoup.add(quantity);
    } else if (tokenType === 'glitteringPetals' || tokenType === 'glitteringpetals') {
      if (!window.state.glitteringPetals) {
        window.state.glitteringPetals = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.glitteringPetals)) {
        window.state.glitteringPetals = new Decimal(window.state.glitteringPetals);
      }
      window.state.glitteringPetals = window.state.glitteringPetals.add(quantity);
    } else if (tokenType === 'chargedPrisma' || tokenType === 'chargedprisma') {
      if (!window.state.chargedPrisma) {
        window.state.chargedPrisma = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.chargedPrisma)) {
        window.state.chargedPrisma = new Decimal(window.state.chargedPrisma);
      }
      window.state.chargedPrisma = window.state.chargedPrisma.add(quantity);
    } else {
      // Regular tokens stored in window.state.tokens
      if (!window.state.tokens) {
        window.state.tokens = {};
      }
      
      if (!window.state.tokens[storageKey]) {
        window.state.tokens[storageKey] = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.tokens[storageKey])) {
        window.state.tokens[storageKey] = new Decimal(window.state.tokens[storageKey]);
      }
      window.state.tokens[storageKey] = window.state.tokens[storageKey].add(quantity);
      
      // Also update the legacy kitchenIngredients for backward compatibility
      if (!window.kitchenIngredients[storageKey]) {
        window.kitchenIngredients[storageKey] = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.kitchenIngredients[storageKey])) {
        window.kitchenIngredients[storageKey] = new Decimal(window.kitchenIngredients[storageKey]);
      }
      window.kitchenIngredients[storageKey] = window.kitchenIngredients[storageKey].add(quantity);
    }

    // Update UI
    if (typeof window.updateInventoryModal === 'function') {
      window.updateInventoryModal(true); // Force update after merchant purchase
    }
    if (typeof window.updateKitchenUI === 'function') {
      window.updateKitchenUI();
    }
  }

  showMessage(message, type = 'info') {
    // Create or update notification element
    let notification = document.getElementById('boutiqueNotification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'boutiqueNotification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(notification);
    }

    // Set style based on type
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.opacity = '1';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (notification) {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  }

  updateCurrencyDisplay() {
    // Update swabucks display
    const swabucksElement = document.getElementById('inventoryCount-swabucks');
    if (swabucksElement && window.state && window.state.swabucks) {
      const swabucks = window.state.swabucks;
      if (typeof swabucks.toString === 'function') {
        swabucksElement.textContent = swabucks.toString();
      } else {
        swabucksElement.textContent = swabucks.toString();
      }
    }
  }

  renderBoutiqueUI() {
    const container = document.getElementById('boutiqueItemsContainer');
    if (!container) return;

    // Check if shop needs restocking (no need to handle return value here since we're already updating UI)
    this.checkAndRestockShop();
    
    // Update the restock timer in the separate card
    this.updateRestockTimer();
    
    // Update the free daily bucks button
    this.updateFreeBucksButton();
    
    // Update the Lepre angry warning card
    this.updateLepreAngryWarning();
    
    // Update Halloween character images if function is available
    if (typeof window.updateHalloweenLepreImages === 'function') {
      window.updateHalloweenLepreImages();
    }
    
    // Update token challenge button visibility
    this.updateTokenChallengeButtonVisibility();
    
    // Show Lepre greeting on first visit
    this.showLepreGreeting();

    container.innerHTML = '';

    // Sort items: normal category first, then better category, then premium category
    const sortedItems = [...this.currentShopItems].sort((a, b) => {
      const categoryOrder = { 'normal': 1, 'better': 2, 'premium': 3 };
      return categoryOrder[a.category] - categoryOrder[b.category];
    });

    sortedItems.forEach(item => {
      const price = this.getCurrentPrice(item.id);
      const canAfford = this.canAfford(item.id);
      const stockRemaining = this.getStockRemaining(item.id);
      const isOutOfStock = stockRemaining <= 0;
      const isAlreadyUnlocked = item.unlockable && item.isUnlocked && item.isUnlocked();

      const itemElement = document.createElement('div');
      itemElement.className = `boutique-item ${item.category}`;
      if (isOutOfStock) {
        itemElement.classList.add('out-of-stock');
      }
      
      itemElement.innerHTML = `
        <div class="boutique-item-header">
          <img src="${item.icon}" alt="${item.name}" class="boutique-item-icon">
          <div class="boutique-item-title">
            <h3 class="boutique-item-name">${item.name}</h3>
            <span class="boutique-item-category ${item.category}">
              ${item.category === 'normal' ? '✦ Regular' : 
                item.category === 'better' ? '★ Premium' : 
                'Special Unlock'}
            </span>
          </div>
        </div>
  <!-- description removed -->
        <div class="boutique-item-stock">
          <span class="stock-text ${isOutOfStock ? 'out-of-stock' : ''}">
            Stock: ${stockRemaining}
          </span>
        </div>
        <div class="boutique-item-footer">
          <span class="boutique-item-price">
            <img src="assets/icons/swa buck.png" alt="Swa Bucks" class="currency-icon"> ${price}
          </span>
          <button 
            class="boutique-buy-btn ${(!canAfford || isOutOfStock || isAlreadyUnlocked) ? 'disabled' : ''}" 
            onclick="window.boutique.purchaseItem('${item.id}')"
            ${(!canAfford || isOutOfStock || isAlreadyUnlocked) ? 'disabled' : ''}
            ${isAlreadyUnlocked ? 'style="background-color: #4CAF50; color: white;"' : ''}
          >
            ${isOutOfStock ? 'Sold Out' : isAlreadyUnlocked ? 'Bought' : 'Buy'}
          </button>
        </div>
      `;

      container.appendChild(itemElement);
    });
  }

  updateRestockTimer() {
    const timerElement = document.getElementById('restockTimer');
    if (timerElement) {
      timerElement.innerHTML = ` ${this.getTimeUntilRestock()}`;
    }
  }

  updateFreeBucksButton() {
    const button = document.getElementById('dailyFreeBucksBtn');
    const buttonText = document.getElementById('freeBucksButtonText');
    const amountText = document.getElementById('freeBucksAmount');
    
    if (!button || !buttonText || !amountText) return;
    
    const canClaim = this.canClaimFreeBucks();
    const amount = this.getFreeBucksAmount();
    
    if (canClaim) {
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
      button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      button.style.color = 'white';
      button.style.border = '2px solid #4CAF50';
      button.style.fontWeight = 'bold';
      button.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
      button.style.boxShadow = '0 3px 6px rgba(76, 175, 80, 0.3)';
      buttonText.textContent = `+${amount} Swa Bucks`;
      amountText.textContent = ``;
      amountText.style.color = '#555';
    } else {
      button.disabled = true;
      button.style.opacity = '0.6';
      button.style.cursor = 'not-allowed';
      button.style.background = 'linear-gradient(135deg, #757575, #616161)';
      button.style.color = '#e0e0e0';
      button.style.border = '2px solid #9e9e9e';
      button.style.fontWeight = 'normal';
      button.style.textShadow = 'none';
      button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      buttonText.textContent = 'Already Claimed';
      amountText.textContent = '(Available after restock)';
      amountText.style.color = '#bbb';
    }
  }

  updateLepreAngryWarning() {
    const warningCard = document.getElementById('lepreAngryWarning');
    const angryContent = document.getElementById('lepreAngryContent');
    const apologizeCount = document.getElementById('apologizeCount');
    
    if (!warningCard || !angryContent || !apologizeCount) return;

    if (this.lepreIsVeryMad || this.lepreIsMad) {
      // Check if Lepre should calm down first
      this.checkLepreMadStatus();
      
      if (this.lepreIsVeryMad) {
        // Very mad state - more dramatic warning
        const timeLeft = Math.ceil((this.lepreVeryMadUntil - Date.now()) / (1000 * 60 * 60));
        warningCard.style.display = 'block';
        warningCard.style.cssText = `
          flex: 0 0 280px;
          display: block;
          background: #1a0000;
          border: 3px solid #ff0000;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          color: #ff3333;
          font-weight: bold;
          box-shadow: 0 6px 12px rgba(255, 0, 0, 0.5);
          animation: pulse 1s infinite;
        `;
        angryContent.innerHTML = `
          <h3 style="margin: 0 0 10px 0; color: #ff3333; font-size: 18px;"> LEPRE IS FURIOUS! </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px;">Prices are 1000X HIGHER!</p>
          <p style="margin: 0 0 8px 0; font-size: 12px;">You will be KICKED OUT if you stay more than 10 seconds!</p>
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">Time until they calm down: ${timeLeft} hours</p>
        `;
      } else if (this.lepreIsMad) {
        // Regular mad state
        const timeLeft = Math.ceil((this.lepreMadUntil - Date.now()) / (1000 * 60 * 60));
        warningCard.style.display = 'block';
        warningCard.style.cssText = `
          flex: 0 0 280px;
          display: block;
          background: #ffebee;
          border: 2px solid #f44336;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          color: #c62828;
          font-weight: bold;
          box-shadow: 0 4px 8px rgba(244, 67, 54, 0.2);
        `;
        angryContent.innerHTML = `
          <h3 style="margin: 0 0 10px 0; color: #c62828; font-size: 18px;"> LEPRE IS ANGRY! </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px;">Prices are 10x higher and restock is delayed!</p>
          <p style="margin: 0; font-size: 12px; opacity: 0.8;">Time until they calm down: ${timeLeft} hours</p>
        `;
      }
      
      // Update apologize count display for both mad states
      const remaining = this.apologizeRequired - this.apologizeCount;
      apologizeCount.innerHTML = `
        Apologies: ${this.apologizeCount}/${this.apologizeRequired}<br>
        <small style="color: #888;">${remaining} more needed to calm Lepre down</small>
      `;
      
    } else {
      // Not mad, hide the warning
      warningCard.style.display = 'none';
    }
  }

  updateBoutiqueUI() {
    // Update the entire boutique display
    this.renderBoutiqueUI();
    // Update the free daily bucks button
    this.updateFreeBucksButton();
    // Update the Lepre angry warning
    this.updateLepreAngryWarning();
    // Update token challenge button visibility
    this.updateTokenChallengeButtonVisibility();
    // Update token challenge PB display
    this.updateTokenChallengePBDisplay();
    // Update Halloween shop button visibility
    this.updateHalloweenShopButtonVisibility();
  }

  // Check if lepre quest 5 is completed to show token challenge button
  isLepreQuest5Completed() {
    if (!window.state || !window.state.questSystem || !window.state.questSystem.completedQuests) {
      return false;
    }
    return window.state.questSystem.completedQuests.includes('lepre_quest_5');
  }

  // Update token challenge button visibility based on lepre quest 5 completion
  updateTokenChallengeButtonVisibility() {
    const tokenChallengeBtn = document.getElementById('boutiqueMinigameBtn');
    if (!tokenChallengeBtn) return;

    if (this.isLepreQuest5Completed()) {
      tokenChallengeBtn.style.display = 'block';
      
      // Check if challenge is on cooldown
      if (this.tokenChallengeUsedSinceRestock) {
        tokenChallengeBtn.disabled = true;
        tokenChallengeBtn.textContent = 'On cooldown (Resets on Restock)';
        tokenChallengeBtn.style.backgroundColor = '#666';
        tokenChallengeBtn.style.cursor = 'not-allowed';
      } else {
        tokenChallengeBtn.disabled = false;
        tokenChallengeBtn.textContent = 'Token Sorting Challenge';
        tokenChallengeBtn.style.backgroundColor = '';
        tokenChallengeBtn.style.cursor = 'pointer';
      }
      
      // Update PB display when button becomes visible
      this.updateTokenChallengePBDisplay();
    } else {
      tokenChallengeBtn.style.display = 'none';
      // Hide PB display when button is hidden
      const pbDisplay = document.getElementById('tokenChallengePBDisplay');
      if (pbDisplay) {
        pbDisplay.style.display = 'none';
      }
    }
  }

  // Initialize boutique button visibility based on all requirements
  initializeBoutiqueButton() {
    // Use the centralized boutique button visibility function
    if (typeof updateBoutiqueButtonVisibility === 'function') {
      updateBoutiqueButtonVisibility();
    } else if (typeof window.updateBoutiqueButtonVisibility === 'function') {
      window.updateBoutiqueButtonVisibility();
    }
  }

  unlockBoutique() {
    // Check expansion level and floor before showing boutique
    if (typeof updateBoutiqueButtonVisibility === 'function') {
      updateBoutiqueButtonVisibility();
    } else if (typeof window.updateBoutiqueButtonVisibility === 'function') {
      window.updateBoutiqueButtonVisibility();
    }
  }

  // Free daily Swa Bucks functionality
  canClaimFreeBucks() {
    // Check if it's been claimed since the last restock
    // If never claimed before, allow claim
    if (this.lastFreeBucksTime === 0) {
      return true;
    }
    
    // If no restock time recorded, allow claim
    if (this.lastRestockTime === 0) {
      return true;
    }
    
    // Allow claim if the last restock happened after the last free bucks claim
    return this.lastRestockTime > this.lastFreeBucksTime;
  }

  getFreeBucksAmount() {
    // Base amount is 1, plus Lepre's friendship level
    let amount = 1;
    
    // Use window.friendship instead of window.state.friendship
    if (window.friendship && window.friendship.Boutique) {
      const boutiqueLevel = window.friendship.Boutique.level || 0;
      amount += boutiqueLevel;
    }
    
    return amount;
  }

  claimFreeBucks() {
    if (!this.canClaimFreeBucks()) {
      this.showMessage('You can only claim free Swa Bucks once per restock!', 'error');
      return false;
    }

    const amount = this.getFreeBucksAmount();
    
    // Add Swa Bucks to player's currency
    if (!window.state.swabucks) {
      window.state.swabucks = new Decimal(0);
    } else if (!DecimalUtils.isDecimal(window.state.swabucks)) {
      window.state.swabucks = new Decimal(window.state.swabucks);
    }
    
    window.state.swabucks = window.state.swabucks.add(amount);
    
    // Update tracking variables
    this.lastFreeBucksTime = Date.now();
    
    if (window.daynight && typeof window.daynight.getTime === 'function') {
      this.lastFreeBucksGameTime = window.daynight.getTime();
    }
    
    // Show Lepre's special response
    this.showLepreFreeBucksResponse(amount);
    
    // Update UI - this will disable the button
    this.updateFreeBucksButton();
    this.updateCurrencyDisplay();
    
    // Track for Lepre quests
    if (typeof window.trackLepreFreeBucksClaim === 'function') {
      window.trackLepreFreeBucksClaim();
    }
    
    // Also track for Lepre Quest 5 (uses different objective name)
    if (typeof window.trackFreeSwaCollection === 'function') {
      window.trackFreeSwaCollection(1);
    }
    
    // Save game
    if (typeof saveGame === 'function') {
      saveGame();
    }
    
    this.showMessage(`Received ${amount} free Swa Bucks!`, 'success');
    return true;
  }

  showLepreFreeBucksResponse(amount) {
    const responses = [
      `Here's ${amount} Swa Bucks for you!`,
      `Your friendship means a lot! Take ${amount} Swa Bucks!`,
      `A little gift from me - ${amount} Swa Bucks!`,
      `Thanks for being such a good friend! Here's ${amount} Swa Bucks!`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    this.queueSpeech(randomResponse, 5000); // 5 seconds for free bucks response
  }

  // Save/Load functions for purchase history and shop state
  saveData() {
    return {
      purchaseHistory: this.purchaseHistory,
      dailyStock: this.dailyStock,
      lastRestockTime: this.lastRestockTime,
      lastRestockGameTime: this.lastRestockGameTime,
      currentShopItems: this.currentShopItems,
      lastFreeBucksTime: this.lastFreeBucksTime,
      lastFreeBucksGameTime: this.lastFreeBucksGameTime,
      hasUsedFreeBucksToday: this.hasUsedFreeBucksToday,
      // Save Lepre angry state
      lepreIsMad: this.lepreIsMad,
      lepreMadUntil: this.lepreMadUntil,
      priceMultiplier: this.priceMultiplier,
      leprePokeCount: this.leprePokeCount,
      leprePokeStartTime: this.leprePokeStartTime,
      // Save Lepre very angry state
      lepreIsVeryMad: this.lepreIsVeryMad,
      lepreVeryMadUntil: this.lepreVeryMadUntil,
      lepreVeryMadPokeCount: this.lepreVeryMadPokeCount,
      lepreVeryMadStartTime: this.lepreVeryMadStartTime,
      // Save apologize count
      apologizeCount: this.apologizeCount,
      // Save boutique schedule state
      wasPlayerInBoutiqueBeforeClose: this.wasPlayerInBoutiqueBeforeClose,
      isBoutiqueClosed: this.isBoutiqueClosed,
      isLepreGone: this.isLepreGone,
      // Save anomaly sequence state
      isIn727AnomalySequence: this.isIn727AnomalySequence,
      // Save token challenge cooldown state
      tokenChallengeLastUsed: this.tokenChallengeLastUsed,
      tokenChallengeUsedSinceRestock: this.tokenChallengeUsedSinceRestock,
      // Save Halloween shop purchases
      halloweenShopPurchases: this.halloweenShopPurchases
    };
  }

  loadData(data) {
    if (data) {
      if (data.purchaseHistory) this.purchaseHistory = data.purchaseHistory;
      if (data.dailyStock) this.dailyStock = data.dailyStock;
      if (data.lastRestockTime) this.lastRestockTime = data.lastRestockTime;
      if (data.lastRestockGameTime) this.lastRestockGameTime = data.lastRestockGameTime;
      if (data.currentShopItems) this.currentShopItems = data.currentShopItems;
      if (data.lastFreeBucksTime !== undefined) this.lastFreeBucksTime = data.lastFreeBucksTime;
      if (data.lastFreeBucksGameTime !== undefined) this.lastFreeBucksGameTime = data.lastFreeBucksGameTime;
      if (data.halloweenShopPurchases) {
        this.halloweenShopPurchases = data.halloweenShopPurchases;
        // Sync with window.state
        if (window.state) {
          window.state.halloweenShopPurchases = this.halloweenShopPurchases;
        }
      }
      if (data.hasUsedFreeBucksToday !== undefined) this.hasUsedFreeBucksToday = data.hasUsedFreeBucksToday;
      
      // Load Lepre angry state
      if (data.lepreIsMad !== undefined) this.lepreIsMad = data.lepreIsMad;
      if (data.lepreMadUntil !== undefined) this.lepreMadUntil = data.lepreMadUntil;
      if (data.priceMultiplier !== undefined) this.priceMultiplier = data.priceMultiplier;
      if (data.leprePokeCount !== undefined) this.leprePokeCount = data.leprePokeCount;
      if (data.leprePokeStartTime !== undefined) this.leprePokeStartTime = data.leprePokeStartTime;
      
      // Load Lepre very angry state
      if (data.lepreIsVeryMad !== undefined) this.lepreIsVeryMad = data.lepreIsVeryMad;
      if (data.lepreVeryMadUntil !== undefined) this.lepreVeryMadUntil = data.lepreVeryMadUntil;
      if (data.lepreVeryMadPokeCount !== undefined) this.lepreVeryMadPokeCount = data.lepreVeryMadPokeCount;
      if (data.lepreVeryMadStartTime !== undefined) this.lepreVeryMadStartTime = data.lepreVeryMadStartTime;
      
      // Load apologize count
      if (data.apologizeCount !== undefined) this.apologizeCount = data.apologizeCount;
      
      // Load boutique schedule state
      if (data.wasPlayerInBoutiqueBeforeClose !== undefined) this.wasPlayerInBoutiqueBeforeClose = data.wasPlayerInBoutiqueBeforeClose;
      if (data.isBoutiqueClosed !== undefined) this.isBoutiqueClosed = data.isBoutiqueClosed;
      if (data.isLepreGone !== undefined) this.isLepreGone = data.isLepreGone;
      
      // Load anomaly sequence state (should usually be false when loading)
      if (data.isIn727AnomalySequence !== undefined) this.isIn727AnomalySequence = data.isIn727AnomalySequence;
      
      // Load token challenge cooldown state
      if (data.tokenChallengeLastUsed !== undefined) this.tokenChallengeLastUsed = data.tokenChallengeLastUsed;
      if (data.tokenChallengeUsedSinceRestock !== undefined) this.tokenChallengeUsedSinceRestock = data.tokenChallengeUsedSinceRestock;
      
      // Check schedule after loading to update state based on current time
      this.checkBoutiqueSchedule();
      
      // Update character card visibility based on current state
      const characterCard = document.getElementById('lepreCharacterCard');
      if (characterCard) {
        characterCard.style.display = this.isLepreGone ? 'none' : 'block';
      }
      
      // Update Lepre character display based on emotional state
      this.updateLepreCharacterDisplay();
      
      // Update boutique accessibility
      this.updateBoutiqueAccessibility();
      
      // Restart kick timer if very mad and loaded
      if (this.lepreIsVeryMad && Date.now() < this.lepreVeryMadUntil) {
        this.startKickTimer();
      }
      
      // Check if shop needs restocking after loading
      this.checkAndRestockShop();
    }
  }

  // Force Lepre character card to appear when clicking boutique sub tab during hours 6:00-23:59
  forceLepareAppearance() {
    if (window.daynight && typeof window.daynight.getTime === 'function') {
      const gameMinutes = window.daynight.getTime();
      const currentHour = Math.floor(gameMinutes / 60) % 24;
      
      // Check if current time is between 6:00-23:59 (Lepre should be available)
      if (currentHour >= 6 && currentHour <= 23) {

        // Force Lepre to be present
        this.isLepreGone = false;
        this.isBoutiqueClosed = false;
        
        // Update character display to show Lepre
        this.updateLepreCharacterDisplay();
        
        // Update boutique accessibility
        this.updateBoutiqueAccessibility();

      } else {

      }
    }
  }

  // Token Challenge Modal System - drag and drop token sorting minigame
  openTokenMinigame() {
    // Check if challenge is on cooldown
    if (this.tokenChallengeUsedSinceRestock) {
      this.showMessage('Token Challenge is on cooldown until the next shop restock!', 'info');
      return;
    }
    
    // Remove any existing modal first
    const existingModal = document.getElementById('tokenMinigameModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Create modal dynamically like power generator challenge
    const modal = document.createElement('div');
    modal.id = 'tokenMinigameModal';
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: #BBDEFB; border: 3px solid #00bcd4; border-radius: 15px; padding: 25px; max-width: 450px; width: 90%; color: #333; text-align: center;">
          <h2 style="color: #FF6B35; margin: 0 0 15px 0;">Token Challenge</h2>
          <div style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
            <p style="margin: 0 0 10px 0;"><strong>Goal:</strong> Drag the token into the respective slot to earn a point, each 10 points gives an extra 10 seconds.</p>
            <p style="margin: 0;"><strong>Rewards:</strong> Earn tokens based on your performance. Higher scores give better rewards!</p>
          </div>
          <button onclick="window.boutique.startTokenChallenge();" style="background: #27ae60; border: none; color: white; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Start</button>
          <button onclick="document.getElementById('tokenMinigameModal').remove();" style="background: #e74c3c; border: none; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  // Start the token challenge minigame
  startTokenChallenge() {
    // Set cooldown flag - once started, cannot be used again until restock
    this.tokenChallengeUsedSinceRestock = true;
    this.tokenChallengeLastUsed = Date.now();
    
    // Remove the intro modal
    const introModal = document.getElementById('tokenMinigameModal');
    if (introModal) {
      introModal.remove();
    }

    // Roll new scores for all characters when player starts a challenge
    this.rollCharacterTokenChallengeScores();

    // Initialize game state
    this.tokenChallenge = {
      isActive: true,
      score: 0,
      timeLeft: 60,
      countdownPhase: 3,
      gameTimer: null,
      countdownTimer: null,
      currentToken: null,
      tokenTypes: ['berries', 'sparks', 'petals', 'mushroom', 'water', 'prisma', 'stardust', 'swabucks'],
      availableSlots: ['sparks', 'petals', 'prisma', 'stardust'], // Available slots in positions 2,3,6,7
      allSlots: ['berries', 'sparks', 'petals', 'mushroom', 'water', 'prisma', 'stardust', 'swabucks'], // Positions 1,2,3,4,5,6,7,8
      slotsUnlocked: false,
      intermissionShown: false,
      tokenQueue: []
    };

    // Create the game modal
    const gameModal = document.createElement('div');
    gameModal.id = 'tokenChallengeGameModal';
    gameModal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center;">
        <div style="background: linear-gradient(135deg, #f0f8ff, #e6f3ff); border: 4px solid #1e90ff; border-radius: 20px; padding: 30px; width: 90%; max-width: 1000px; height: 80%; max-height: 700px; color: #333; display: flex; flex-direction: column;">
          
          <!-- Header with score and timer -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 10px 20px; background: rgba(255,255,255,0.8); border-radius: 10px;">
            <div style="font-size: 20px; font-weight: bold; color: #1e90ff;">Score: <span id="challengeScore">0</span></div>
            <div id="challengeCountdown" style="font-size: 48px; font-weight: bold; color: #ff4444;">3</div>
            <div style="font-size: 20px; font-weight: bold; color: #ff6600;">Time: <span id="challengeTimer">60</span>s</div>
          </div>

          <!-- Token slots area -->
          <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: 20px;">
            <div id="tokenSlots" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; padding: 20px; background: rgba(255,255,255,0.6); border-radius: 15px; flex: 1; justify-items: center; align-items: center;">
              <!-- Token slots will be generated here -->
            </div>
          </div>

          <!-- Draggable token area -->
          <div style="background: rgba(255,255,255,0.6); border-radius: 15px; padding: 20px;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #1e90ff; text-align: center;">Drag This Token</div>
            <div style="display: flex; align-items: center; min-height: 80px; position: relative;">
              <!-- Token lineup positioned to the left of center -->
              <div style="position: absolute; left: 15%; display: flex; flex-direction: column; align-items: center;">
                <div id="nextTokensLabel" style="font-size: 14px; margin-bottom: 10px; color: #666; display: none;">Next Tokens</div>
                <div id="tokenLineup" style="display: flex; gap: 15px;">
                  <!-- Upcoming tokens will appear here -->
                </div>
              </div>
              <!-- Current token perfectly centered in the container -->
              <div id="draggableTokenArea" style="display: flex; justify-content: center; align-items: center; width: 100%;">
                <!-- Current token to drag will appear here -->
              </div>
            </div>
          </div>

          <!-- End challenge early button -->
          <div style="text-align: center; margin-top: 15px;">
            <button onclick="window.boutique.endTokenChallengeEarly();" style="background: #e74c3c; border: none; color: white; padding: 10px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; transition: background 0.2s; width: 100%;" onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">End Challenge Early</button>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(gameModal);

    // Create token slots
    this.createTokenSlots();
    
    // Start countdown
    this.startCountdown();
    
    // Update button to show disabled state immediately
    this.updateTokenChallengeButtonVisibility();
  }

  // Create the token slots (4 center slots initially, all 8 after 20 points)
  createTokenSlots() {
    const slotsContainer = document.getElementById('tokenSlots');
    const allSlots = this.tokenChallenge.allSlots;
    const availableSlots = this.tokenChallenge.availableSlots;
    
    slotsContainer.innerHTML = '';
    
    // Always maintain 4x2 grid layout
    slotsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    slotsContainer.style.gridTemplateRows = 'repeat(2, 1fr)';
    
    allSlots.forEach(tokenType => {
      const isAvailable = availableSlots.includes(tokenType);
      const slot = document.createElement('div');
      slot.className = 'token-slot';
      slot.dataset.tokenType = tokenType;
      
      const getTokenImageName = (type) => {
        switch(type) {
          case 'prisma': return 'prisma token';
          case 'mushroom': return 'mushroom token';
          case 'sparks': return 'spark token';
          case 'petals': return 'petal token';
          case 'water': return 'water token';
          case 'stardust': return 'stardust token';
          case 'swabucks': return 'Swa buck';
          default: return 'berry token';
        }
      };
      
      const slotInner = document.createElement('div');
      
      if (isAvailable) {
        // Available slot styling
        slotInner.style.cssText = 'width: 100px; height: 100px; border: 3px dashed #1e90ff; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.8); transition: all 0.3s ease;';
        slotInner.innerHTML = `
          <img src="assets/icons/${getTokenImageName(tokenType)}.png" style="width: 40px; height: 40px; margin-bottom: 5px; opacity: 0.6;">
          <div style="font-size: 11px; font-weight: bold; text-transform: capitalize; color: #666;">${tokenType === 'swabucks' ? 'Swa Bucks' : tokenType}</div>
        `;
        
        // Add drag over and drop event listeners to available slots
        slot.addEventListener('dragover', (e) => {
          e.preventDefault();
          slotInner.style.background = 'rgba(30, 144, 255, 0.2)';
          slotInner.style.transform = 'scale(1.05)';
        });
        
        slot.addEventListener('dragleave', (e) => {
          slotInner.style.background = 'rgba(255,255,255,0.8)';
          slotInner.style.transform = 'scale(1)';
        });
        
        slot.addEventListener('drop', (e) => {
          e.preventDefault();
          slotInner.style.background = 'rgba(255,255,255,0.8)';
          slotInner.style.transform = 'scale(1)';
          
          const draggedTokenType = e.dataTransfer.getData('text/plain');
          // Use the original slot position (before scrambling) until after intermission
          this.handleTokenDrop(draggedTokenType, tokenType);
        });
      } else {
        // Locked slot styling
        slotInner.style.cssText = 'width: 100px; height: 100px; border: 3px dashed #ccc; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(200,200,200,0.4); transition: all 0.3s ease; opacity: 0.5;';
        slotInner.innerHTML = ``;
      }
      
      slot.appendChild(slotInner);
      slot.style.cssText = 'width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;';
      
      slotsContainer.appendChild(slot);
    });
  }

  // Start the 3-second countdown
  startCountdown() {
    const countdownElement = document.getElementById('challengeCountdown');
    
    this.tokenChallenge.countdownTimer = setInterval(() => {
      countdownElement.textContent = this.tokenChallenge.countdownPhase;
      countdownElement.style.color = '#ff4444';
      countdownElement.style.fontSize = '48px';
      
      this.tokenChallenge.countdownPhase--;
      
      if (this.tokenChallenge.countdownPhase < 0) {
        clearInterval(this.tokenChallenge.countdownTimer);
        countdownElement.style.display = 'none';
        this.startGame();
      }
    }, 1000);
  }

  // Start the actual game after countdown
  startGame() {
    // Show the "Next Tokens" text now that the game is starting
    const nextTokensLabel = document.getElementById('nextTokensLabel');
    if (nextTokensLabel) {
      nextTokensLabel.style.display = 'block';
    }
    
    // Start the main game timer
    this.tokenChallenge.gameTimer = setInterval(() => {
      this.tokenChallenge.timeLeft--;
      document.getElementById('challengeTimer').textContent = this.tokenChallenge.timeLeft;
      
      if (this.tokenChallenge.timeLeft <= 0) {
        this.endTokenChallenge();
      }
    }, 1000);
    
    // Spawn first token
    this.spawnNewToken();
  }

  // Spawn a new random token to drag
  spawnNewToken() {
    // Initialize token queue if empty
    if (this.tokenChallenge.tokenQueue.length === 0) {
      this.generateTokenQueue();
    }
    
    // Get next token from queue
    const nextToken = this.tokenChallenge.tokenQueue.shift();
    this.tokenChallenge.currentToken = nextToken;
    
    // Refill queue if getting low
    if (this.tokenChallenge.tokenQueue.length < 3) {
      this.generateTokenQueue();
    }
    
    // Update current token display
    this.updateCurrentTokenDisplay();
    
    // Update lineup display
    this.updateTokenLineup();
  }

  // Generate a batch of random tokens for the queue
  generateTokenQueue() {
    for (let i = 0; i < 5; i++) {
      // Use available slots before 20 points, all token types after
      const tokenPool = this.tokenChallenge.score < 20 ? this.tokenChallenge.availableSlots : this.tokenChallenge.tokenTypes;
      const randomTokenType = tokenPool[Math.floor(Math.random() * tokenPool.length)];
      this.tokenChallenge.tokenQueue.push(randomTokenType);
    }
  }

  // Update the current draggable token display
  updateCurrentTokenDisplay() {
    const tokenArea = document.getElementById('draggableTokenArea');
    const currentToken = this.tokenChallenge.currentToken;
    
    // Check if score is 50 or higher for mystery mode
    if (this.tokenChallenge.score >= 50) {
      // Show black circle with white question mark
      tokenArea.innerHTML = `
        <div draggable="true" style="width: 80px; height: 80px; background: #000000; border: 3px solid #1e90ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: grab; transition: transform 0.2s; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" 
             onmousedown="this.style.cursor='grabbing'; this.style.transform='scale(0.95)'" 
             onmouseup="this.style.cursor='grab'; this.style.transform='scale(1)'"
             ondragstart="
               event.dataTransfer.setData('text/plain', '${currentToken}');
               // Center the drag image with the cursor
               const rect = this.getBoundingClientRect();
               const offsetX = rect.width / 2;
               const offsetY = rect.height / 2;
               event.dataTransfer.setDragImage(this, offsetX, offsetY);
             ">
          <span style="color: white; font-size: 40px; font-weight: bold; font-family: Arial, sans-serif;">?</span>
        </div>
      `;
    } else {
      // Normal token display for scores below 50
      const getTokenImageName = (type) => {
        switch(type) {
          case 'prisma': return 'prisma token';
          case 'mushroom': return 'mushroom token';
          case 'sparks': return 'spark token';
          case 'petals': return 'petal token';
          case 'water': return 'water token';
          case 'stardust': return 'stardust token';
          case 'swabucks': return 'Swa buck';
          default: return 'berry token';
        }
      };
      
      const tokenImageName = getTokenImageName(currentToken);
      
      tokenArea.innerHTML = `
        <div draggable="true" style="width: 80px; height: 80px; background: rgba(255,255,255,0.9); border: 3px solid #1e90ff; border-radius: 15px; display: flex; align-items: center; justify-content: center; cursor: grab; transition: transform 0.2s; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" 
             onmousedown="this.style.cursor='grabbing'; this.style.transform='scale(0.95)'" 
             onmouseup="this.style.cursor='grab'; this.style.transform='scale(1)'"
             ondragstart="
               event.dataTransfer.setData('text/plain', '${currentToken}');
               // Center the drag image with the cursor
               const rect = this.getBoundingClientRect();
               const offsetX = rect.width / 2;
               const offsetY = rect.height / 2;
               event.dataTransfer.setDragImage(this, offsetX, offsetY);
             ">
          <img src="assets/icons/${tokenImageName}.png" style="width: 55px; height: 55px;">
        </div>
      `;
    }
  }

  // Update the token lineup display
  updateTokenLineup() {
    const lineupArea = document.getElementById('tokenLineup');
    const upcomingTokens = this.tokenChallenge.tokenQueue.slice(0, 3).reverse(); // Show next 3 tokens in reverse order
    
    const getTokenImageName = (type) => {
      switch(type) {
        case 'prisma': return 'prisma token';
        case 'mushroom': return 'mushroom token';
        case 'sparks': return 'spark token';
        case 'petals': return 'petal token';
        case 'water': return 'water token';
        case 'stardust': return 'stardust token';
        case 'swabucks': return 'Swa buck';
        default: return 'berry token';
      }
    };
    
    lineupArea.innerHTML = '';
    
    upcomingTokens.forEach((tokenType, index) => {
      const tokenElement = document.createElement('div');
      
      // Check for mystery mode based on score and token position (array is now reversed)
      // index 0 = 3rd future token, index 1 = 2nd future token, index 2 = next token
      const shouldShowMystery = (index === 2 && this.tokenChallenge.score >= 100) || 
                               (index === 1 && this.tokenChallenge.score >= 150);
      
      if (shouldShowMystery) {
        // Show black mystery circle for tokens that should be hidden
        tokenElement.innerHTML = `
          <div style="width: 60px; height: 60px; background: #000000; border: 3px solid #ccc; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: ${0.5 + index * 0.25};">
            <span style="color: white; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">?</span>
          </div>
        `;
      } else {
        // Normal token display
        const tokenImageName = getTokenImageName(tokenType);
        tokenElement.innerHTML = `
          <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.7); border: 3px solid #ccc; border-radius: 12px; display: flex; align-items: center; justify-content: center; opacity: ${0.5 + index * 0.25};">
            <img src="assets/icons/${tokenImageName}.png" style="width: 45px; height: 45px;">
          </div>
        `;
      }
      
      lineupArea.appendChild(tokenElement);
    });
  }

  // Handle when a token is dropped on a slot
  handleTokenDrop(draggedTokenType, slotTokenType) {
    if (!this.tokenChallenge.isActive) return;
    
    if (draggedTokenType === slotTokenType) {
      // Correct match!
      this.tokenChallenge.score++;
      document.getElementById('challengeScore').textContent = this.tokenChallenge.score;
      
      // Check for style changes based on score milestones
      this.updateChallengeStyle();
      
      // Check if we need to unlock all slots at 20 points
      if (this.tokenChallenge.score === 20 && !this.tokenChallenge.slotsUnlocked) {
        this.unlockAllSlots();
      }
      
      // Check for intermission at 80 points
      if (this.tokenChallenge.score === 80 && !this.tokenChallenge.intermissionShown) {
        // Add slight delay to ensure any previous scramble animations are complete
        setTimeout(() => {
          this.startIntermission();
        }, 100);
        return; // Don't continue with other score checks during intermission
      }
      
      // Check for bonus time (every 10 points = 10 extra seconds)
      if (this.tokenChallenge.score % 10 === 0) {
        this.tokenChallenge.timeLeft += 10;
        document.getElementById('challengeTimer').textContent = this.tokenChallenge.timeLeft;
        
        // Show bonus time visual feedback
        this.showBonusTimeEffect();
        
        // Scramble 3 random slots after 30 points (every 10 points)
        if (this.tokenChallenge.score >= 30) {
          this.scrambleRandomSlots();
        }
      }
      
      // Show success visual feedback
      this.showSuccessEffect(slotTokenType);
      
    } else {
      // Wrong match - lose 3 seconds
      this.tokenChallenge.timeLeft = Math.max(0, this.tokenChallenge.timeLeft - 3);
      document.getElementById('challengeTimer').textContent = this.tokenChallenge.timeLeft;
      
      // Show penalty visual feedback
      this.showPenaltyEffect(slotTokenType);
      
      // Show time penalty popup
      this.showTimePenaltyEffect();
    }
    
    // Spawn new token regardless of correct/incorrect
    this.spawnNewToken();
    
    // Check if time ran out due to penalty
    if (this.tokenChallenge.timeLeft <= 0) {
      this.endTokenChallenge();
    }
  }

  // Unlock all 8 slots when reaching 20 points
  unlockAllSlots() {
    this.tokenChallenge.slotsUnlocked = true;
    this.tokenChallenge.availableSlots = this.tokenChallenge.allSlots;
    
    // Recreate slots with all 8 available
    this.createTokenSlots();
  }

  // Scramble 3 random token slots (after 30 points, every 10 points)
  scrambleRandomSlots() {
    // Read current slot positions from DOM
    const allSlotElements = document.querySelectorAll('#tokenSlots .token-slot');
    const currentSlots = [];
    
    allSlotElements.forEach(slotElement => {
      const tokenType = slotElement.dataset.tokenType;
      if (tokenType) {
        currentSlots.push(tokenType);
      }
    });
    
    if (currentSlots.length !== 8) return; // Safety check
    
    // Select 3 random positions to scramble
    const positionsToScramble = [];
    const availablePositions = [...Array(8).keys()]; // [0,1,2,3,4,5,6,7]
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const selectedPosition = availablePositions.splice(randomIndex, 1)[0];
      positionsToScramble.push(selectedPosition);
    }
    
    // Get the token types at these positions
    const tokensToScramble = positionsToScramble.map(pos => currentSlots[pos]);
    
    // Ensure tokens actually change positions (no token stays in same place)
    const shuffledTokens = this.guaranteedScramble(tokensToScramble);
    
    // Apply visual scramble effect
    this.showScrambleEffect(tokensToScramble);
    
    // Wait for animation then apply the actual scramble
    setTimeout(() => {
      this.applyPositionScramble(positionsToScramble, shuffledTokens);
    }, 1000);
  }

  // Show visual feedback for slot scrambling
  showScrambleEffect(scrambledSlots) {
    // Show text notification in score section
    this.showScrambleNotification();
    
    // Apply scramble visual effect to slots
    scrambledSlots.forEach(slotType => {
      const slot = document.querySelector(`[data-token-type="${slotType}"]`);
      if (slot) {
        const slotInner = slot.firstChild;
        // Add spinning animation
        slotInner.style.transition = 'transform 1s ease-in-out';
        slotInner.style.transform = 'rotate(720deg) scale(1.1)';
        
        // Reset after animation
        setTimeout(() => {
          slotInner.style.transform = 'rotate(0deg) scale(1)';
          slotInner.style.transition = 'all 0.3s ease';
        }, 1000);
      }
    });
  }

  // Show scramble notification text in the score section
  showScrambleNotification() {
    // Target the header section that contains score and timer
    const headerSection = document.querySelector('#tokenChallengeGameModal div[style*="justify-content: space-between"]');
    
    if (headerSection) {
      // Create notification text element
      const notification = document.createElement('div');
      notification.innerHTML = 'Lepre scrambled the token slots';
      notification.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; font-weight: bold; color: #e74c3c; background: rgba(255,255,255,0.9); padding: 5px 15px; border-radius: 8px; z-index: 10; opacity: 0; transition: opacity 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.2);';
      
      headerSection.style.position = 'relative';
      headerSection.appendChild(notification);
      
      // Fade in
      setTimeout(() => {
        notification.style.opacity = '1';
      }, 10);
      
      // Fade out and remove
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 2000);
    }
  }

  // Apply the actual slot scrambling by updating specific positions
  applyPositionScramble(positions, newTokenTypes) {
    const allSlotElements = document.querySelectorAll('#tokenSlots .token-slot');
    
    const getTokenImageName = (type) => {
      switch(type) {
        case 'prisma': return 'prisma token';
        case 'mushroom': return 'mushroom token';
        case 'sparks': return 'spark token';
        case 'petals': return 'petal token';
        case 'water': return 'water token';
        case 'stardust': return 'stardust token';
        case 'swabucks': return 'Swa buck';
        default: return 'berry token';
      }
    };
    
    positions.forEach((position, index) => {
      const slot = allSlotElements[position];
      const newTokenType = newTokenTypes[index];
      
      if (slot && newTokenType) {
        // Update the slot's token type
        slot.dataset.tokenType = newTokenType;
        
        // Update the visual content
        const slotInner = slot.firstChild;
        if (slotInner) {
          slotInner.innerHTML = `
            <img src="assets/icons/${getTokenImageName(newTokenType)}.png" style="width: 40px; height: 40px; margin-bottom: 5px; opacity: 0.6;">
            <div style="font-size: 11px; font-weight: bold; text-transform: capitalize; color: #666;">${newTokenType === 'swabucks' ? 'Swa Bucks' : newTokenType}</div>
          `;
        }
      }
    });
    
    // Update the stored allSlots array to match the new DOM state
    this.syncAllSlotsFromDOM();
  }

  // Synchronize the allSlots array with the current DOM state
  syncAllSlotsFromDOM() {
    const allSlotElements = document.querySelectorAll('#tokenSlots .token-slot');
    const newSlotOrder = [];
    
    for (let i = 0; i < allSlotElements.length && i < 8; i++) {
      const tokenType = allSlotElements[i].dataset.tokenType;
      if (tokenType) {
        newSlotOrder.push(tokenType);
      }
    }
    
    if (newSlotOrder.length === 8) {
      this.tokenChallenge.allSlots = newSlotOrder;
    }
  }

  // Update challenge styling based on score milestones
  updateChallengeStyle() {
    const modal = document.getElementById('tokenChallengeGameModal');
    const mainContainer = modal?.querySelector('div[style*="background: linear-gradient"]');
    
    if (!mainContainer) return;
    
    if (this.tokenChallenge.score >= 80) {
      // Special unlock shop token style (80+ points) - solid purple theme
      mainContainer.style.background = 'linear-gradient(135deg, #2a1a3e, #1a0f2a)';
      mainContainer.style.border = '4px solid #9C27B0';
      mainContainer.style.boxShadow = '0 2px 8px rgba(156, 39, 176, 0.15)';
    } else if (this.tokenChallenge.score >= 30) {
      // Premium shop token style (30+ points) - solid orange theme
      mainContainer.style.background = 'linear-gradient(135deg, #3d2a1a, #2a1a10)';
      mainContainer.style.border = '4px solid #FF9800';
      mainContainer.style.boxShadow = '';
    } else {
      // Default style (0-29 points)
      mainContainer.style.background = 'linear-gradient(135deg, #f0f8ff, #e6f3ff)';
      mainContainer.style.border = '4px solid #1e90ff';
      mainContainer.style.boxShadow = '';
    }
  }

  // Guaranteed scramble that ensures no token stays in the same position
  guaranteedScramble(originalTokens) {
    if (originalTokens.length <= 1) return [...originalTokens];
    
    let shuffled = [...originalTokens];
    let attempts = 0;
    const maxAttempts = 100; // Safety limit
    
    do {
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      attempts++;
    } while (this.hasTokenInOriginalPosition(originalTokens, shuffled) && attempts < maxAttempts);
    
    // If we couldn't find a valid shuffle after many attempts, force at least one change
    if (attempts >= maxAttempts) {
      shuffled = this.forceTokenMovement(originalTokens);
    }
    
    return shuffled;
  }

  // Check if any token is still in its original position
  hasTokenInOriginalPosition(original, shuffled) {
    for (let i = 0; i < original.length; i++) {
      if (original[i] === shuffled[i]) {
        return true;
      }
    }
    return false;
  }

  // Force at least some tokens to move by swapping pairs
  forceTokenMovement(originalTokens) {
    const result = [...originalTokens];
    
    // Simple approach: swap first two tokens, then rotate others if needed
    if (result.length >= 2) {
      [result[0], result[1]] = [result[1], result[0]];
    }
    
    // If there are more than 2 tokens, do additional swaps to ensure more movement
    if (result.length >= 4) {
      [result[2], result[3]] = [result[3], result[2]];
    }
    
    return result;
  }

  // Start intermission at 80 points
  startIntermission() {
    this.tokenChallenge.intermissionShown = true;
    
    // Pause the game timer
    if (this.tokenChallenge.gameTimer) {
      clearInterval(this.tokenChallenge.gameTimer);
      this.tokenChallenge.gameTimer = null;
    }
    
    // Create intermission overlay
    const intermissionOverlay = document.createElement('div');
    intermissionOverlay.id = 'intermissionOverlay';
    intermissionOverlay.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10003; display: flex; align-items: center; justify-content: center;">
        <div style="background: linear-gradient(135deg, #f0f8ff, #e6f3ff); border: 4px solid #1e90ff; border-radius: 20px; padding: 40px; max-width: 600px; text-align: center; color: #333;">
          <h2 style="color: #1e90ff; margin-bottom: 20px; font-size: 24px;">Intermission</h2>
          <p style="font-size: 18px; margin-bottom: 15px;">The slots have been scrambled multiple times!</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Memorize the current slot positions:</p>
          
          <div id="intermissionSlotLayout" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; justify-items: center;">
            <!-- Slot layout will be shown here -->
          </div>
          
          <div style="font-size: 20px; font-weight: bold; color: #e74c3c; margin-top: 20px;">
            Continuing in: <span id="intermissionCountdown" style="font-size: 24px;">5</span>s
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(intermissionOverlay);
    
    // Show current slot layout
    this.showIntermissionSlotLayout();
    
    // Start 5-second countdown
    let countdown = 5;
    const countdownElement = document.getElementById('intermissionCountdown');
    
    const countdownTimer = setInterval(() => {
      countdown--;
      if (countdownElement) {
        countdownElement.textContent = countdown;
      }
      
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        this.endIntermission();
      }
    }, 1000);
  }

  // Show the current slot layout during intermission
  showIntermissionSlotLayout() {
    const layoutContainer = document.getElementById('intermissionSlotLayout');
    if (!layoutContainer) return;
    
    // Sync the allSlots array with current DOM state before showing
    this.syncAllSlotsFromDOM();
    
    // Read the current slot layout - should now be accurate
    const currentSlots = [...this.tokenChallenge.allSlots];
    
    
    // Use the synchronized slot order
    const slotsToShow = currentSlots;
    
    
    slotsToShow.forEach(tokenType => {
      const slotDisplay = document.createElement('div');
      
      const getTokenImageName = (type) => {
        switch(type) {
          case 'prisma': return 'prisma token';
          case 'mushroom': return 'mushroom token';
          case 'sparks': return 'spark token';
          case 'petals': return 'petal token';
          case 'water': return 'water token';
          case 'stardust': return 'stardust token';
          case 'swabucks': return 'Swa buck';
          default: return 'berry token';
        }
      };
      
      slotDisplay.innerHTML = `
        <div style="width: 80px; height: 80px; border: 2px solid #1e90ff; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.9);">
          <img src="assets/icons/${getTokenImageName(tokenType)}.png" style="width: 35px; height: 35px; margin-bottom: 3px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: capitalize; color: #666;">${tokenType === 'swabucks' ? 'Swa Bucks' : tokenType}</div>
        </div>
      `;
      
      layoutContainer.appendChild(slotDisplay);
    });
  }

  // End intermission and resume game
  endIntermission() {
    const intermissionOverlay = document.getElementById('intermissionOverlay');
    if (intermissionOverlay) {
      intermissionOverlay.remove();
    }
    
    // Update the base slot order to match current scrambled positions
    this.updateBaseSlotOrder();
    
    // Recreate slots with the new scrambled layout as the correct positions
    this.createTokenSlots();
    
    // Resume the game timer
    this.tokenChallenge.gameTimer = setInterval(() => {
      this.tokenChallenge.timeLeft--;
      document.getElementById('challengeTimer').textContent = this.tokenChallenge.timeLeft;
      
      if (this.tokenChallenge.timeLeft <= 0) {
        this.endTokenChallenge();
      }
    }, 1000);
  }

  // Update the base slot order to current positions (called after intermission)
  updateBaseSlotOrder() {
    // Read the current scrambled slot positions from the DOM in exact same way as intermission display
    const allSlotElements = document.querySelectorAll('#tokenSlots .token-slot');
    const currentSlots = [];
    
    // Read in visual order (left to right, top to bottom) - same as intermission display
    for (let i = 0; i < allSlotElements.length && i < 8; i++) {
      const slotElement = allSlotElements[i];
      const tokenType = slotElement.dataset.tokenType;
      if (tokenType && tokenType !== 'unknown') {
        currentSlots.push(tokenType);
      }
    }
    
    // Update the base slot order if we successfully read 8 slots
    if (currentSlots.length === 8) {
      this.tokenChallenge.allSlots = [...currentSlots];
      this.tokenChallenge.availableSlots = [...currentSlots];
    }
  }

  // Show visual feedback for correct matches
  showSuccessEffect(slotType) {
    const slot = document.querySelector(`[data-token-type="${slotType}"]`);
    if (slot) {
      const originalBg = slot.style.background;
      slot.style.background = 'rgba(40, 180, 40, 0.7)';
      slot.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        slot.style.background = originalBg;
        slot.style.transform = 'scale(1)';
      }, 500);
    }
  }

  // Show visual feedback for wrong matches
  showPenaltyEffect(slotType) {
    const slot = document.querySelector(`[data-token-type="${slotType}"]`);
    if (slot) {
      const originalBg = slot.style.background;
      slot.style.background = 'rgba(255, 70, 70, 0.7)';
      slot.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        slot.style.background = originalBg;
        slot.style.transform = 'scale(1)';
      }, 500);
    }
  }

  // Show bonus time visual effect
  showBonusTimeEffect() {
    const timerElement = document.getElementById('challengeTimer');
    const originalColor = timerElement.style.color;
    timerElement.style.color = '#00ff00';
    timerElement.style.fontSize = '28px';
    timerElement.style.fontWeight = 'bold';
    
    // Create +10 seconds popup
    this.showTimePopup('+10s', '#00ff00', timerElement);
    
    setTimeout(() => {
      timerElement.style.color = originalColor;
      timerElement.style.fontSize = '20px';
    }, 1000);
  }

  // Show time penalty visual effect
  showTimePenaltyEffect() {
    const timerElement = document.getElementById('challengeTimer');
    const originalColor = timerElement.style.color;
    timerElement.style.color = '#ff0000';
    timerElement.style.fontSize = '28px';
    timerElement.style.fontWeight = 'bold';
    
    // Create -3 seconds popup
    this.showTimePopup('-3s', '#ff0000', timerElement);
    
    setTimeout(() => {
      timerElement.style.color = originalColor;
      timerElement.style.fontSize = '20px';
    }, 1000);
  }

  // Show animated time popup above timer
  showTimePopup(text, color, timerElement) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      color: ${color};
      font-size: 24px;
      font-weight: bold;
      pointer-events: none;
      z-index: 10003;
      animation: timePopupFloat 2s ease-out forwards;
    `;
    
    // Add CSS animation if not already added
    if (!document.getElementById('timePopupStyle')) {
      const style = document.createElement('style');
      style.id = 'timePopupStyle';
      style.textContent = `
        @keyframes timePopupFloat {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0px) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-40px) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Position relative to timer element
    timerElement.parentElement.style.position = 'relative';
    timerElement.parentElement.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 2000);
  }

  // End the token challenge early (triggered by button)
  endTokenChallengeEarly() {
    if (!this.tokenChallenge.isActive) return;
    
    // End the challenge immediately without confirmation
    this.endTokenChallenge();
  }

  // End the token challenge and show results
  endTokenChallenge() {
    if (!this.tokenChallenge.isActive) return;
    
    this.tokenChallenge.isActive = false;
    
    // Clear timers
    if (this.tokenChallenge.gameTimer) {
      clearInterval(this.tokenChallenge.gameTimer);
    }
    if (this.tokenChallenge.countdownTimer) {
      clearInterval(this.tokenChallenge.countdownTimer);
    }
    
    // Calculate rewards based on score
    const score = this.tokenChallenge.score;
    const rewards = this.calculateTokenChallengeRewards(score);
    
    // Check if this is a new personal best
    const currentPB = this.getTokenChallengePB();
    if (score > currentPB) {
      this.setTokenChallengePB(score);
      
      // Store in window.state for trophy system
      if (!window.state) window.state = {};
      window.state.tokenChallengePersonalBest = score;
    } else if (!window.state.tokenChallengePersonalBest) {
      // Ensure the PB is stored in window.state for trophy system
      window.state.tokenChallengePersonalBest = currentPB;
    }
    
    // Check for token challenge trophies
    if (typeof window.checkChallengeTrophy === 'function') {
      window.checkChallengeTrophy('tokenChallenge');
    }
    
    // Remove game modal
    const gameModal = document.getElementById('tokenChallengeGameModal');
    if (gameModal) {
      gameModal.remove();
    }
    
    // Show results modal
    this.showTokenChallengeResults(score, rewards);
  }

  // Calculate token rewards based on score
  calculateTokenChallengeRewards(score) {
    const rewards = {};
    const tokenTypes = ['berries', 'sparks', 'petals', 'mushroom', 'water', 'prisma', 'stardust', 'swabucks'];
    const premiumTokens = ['berryplate', 'batteries', 'mushroomsoup', 'chargedprisma', 'glitteringpetals'];
    
    // Give 1 random token per 2 points scored
    const numRewards = Math.floor(score / 2);
    
    if (numRewards > 0) {
      // Initialize reward counters for regular tokens
      for (const tokenType of tokenTypes) {
        rewards[tokenType] = 0;
      }
      
      // Initialize reward counters for premium tokens
      for (const premiumToken of premiumTokens) {
        rewards[premiumToken] = 0;
      }
      
      // Award random tokens
      for (let i = 0; i < numRewards; i++) {
        // 3% chance for premium token, 97% chance for regular token
        if (Math.random() < 0.03) {
          // Award premium token
          const randomPremiumToken = premiumTokens[Math.floor(Math.random() * premiumTokens.length)];
          rewards[randomPremiumToken]++;
        } else {
          // Award regular token
          const randomTokenType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
          rewards[randomTokenType]++;
        }
      }
      
      // Remove token types with 0 rewards for cleaner display
      const allTokenTypes = [...tokenTypes, ...premiumTokens];
      for (const tokenType of allTokenTypes) {
        if (rewards[tokenType] === 0) {
          delete rewards[tokenType];
        }
      }
    }
    
    return rewards;
  }

  // Show the results modal with rewards
  showTokenChallengeResults(score, rewards) {
    const resultsModal = document.createElement('div');
    resultsModal.id = 'tokenChallengeResultsModal';
    
    // Update personal best if this score is higher
    const currentPB = this.getTokenChallengePB();
    if (score > currentPB) {
      this.setTokenChallengePB(score);
    }
    
    // Map token types to display names
    const tokenDisplayNames = {
      'berries': 'Berries',
      'sparks': 'Sparks',
      'petals': 'Petals',
      'mushroom': 'Mushroom',
      'water': 'Water',
      'prisma': 'Prisma',
      'stardust': 'Stardust',
      'swabucks': 'Swa Bucks',
      'berryplate': 'Berry Plates',
      'batteries': 'Batteries',
      'mushroomsoup': 'Mushroom Soup',
      'chargedprisma': 'Charged Prisma',
      'glitteringpetals': 'Glittering Petals'
    };

    let rewardText = '';
    if (Object.keys(rewards).length > 0) {
      rewardText = '<div style="margin-top: 15px;"><strong>Rewards Earned:</strong><br>';
      for (const [tokenType, amount] of Object.entries(rewards)) {
        const displayName = tokenDisplayNames[tokenType] || tokenType.charAt(0).toUpperCase() + tokenType.slice(1);
        const isPremium = ['berryplate', 'batteries', 'mushroomsoup', 'chargedprisma', 'glitteringpetals'].includes(tokenType);
        const style = isPremium ? 'color: #ff6b35; font-weight: bold;' : '';
        rewardText += `<div style="margin: 5px 0; ${style}">${amount} ${displayName}${isPremium ? ' ⭐' : ''}</div>`;
      }
      rewardText += '</div>';
    } else {
      rewardText = '<div style="margin-top: 15px; color: #888;">No rewards earned. Try again to get a better score!</div>';
    }
    
    resultsModal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center;">
        <div style="background: #BBDEFB; border: 3px solid #00bcd4; border-radius: 15px; padding: 30px; max-width: 600px; width: 90%; color: #333; text-align: center;">
          
          <!-- Sub-tabs -->
          <div style="display: flex; margin-bottom: 20px; border-radius: 8px; overflow: hidden;">
            <button id="tokenResultsTab" onclick="window.boutique.showTokenChallengeTab('results')" style="flex: 1; padding: 12px; background: #FFA500; border: none; color: white; font-weight: bold; cursor: pointer;">Results</button>
            <button id="tokenLeaderboardTab" onclick="window.boutique.showTokenChallengeTab('leaderboard')" style="flex: 1; padding: 12px; background: #4a90e2; border: none; color: white; font-weight: bold; cursor: pointer;">Leaderboard</button>
          </div>

          <h2 style="color: #FF6B35; margin: 0 0 20px 0;">Challenge Complete!</h2>
          
          <!-- Results Content -->
          <div id="tokenResultsContent">
            <div style="background: rgba(255,255,255,0.7); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <div style="font-size: 24px; font-weight: bold; color: #1e90ff; margin-bottom: 10px;">Final Score: ${score}</div>
              ${rewardText}
            </div>
          </div>
          
          <!-- Leaderboard Content -->
          <div id="tokenLeaderboardContent" style="display: none;">
            <div style="background: rgba(255,255,255,0.7); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h3 style="color: #FF6B35; margin-bottom: 15px;">Leaderboard:</h3>
              <div id="tokenLeaderboardList" style="text-align: left; max-height: 300px; overflow-y: auto;">
                <!-- Leaderboard will be populated here -->
              </div>
            </div>
          </div>
          
          <button onclick="window.boutique.claimTokenChallengeRewards(${JSON.stringify(rewards).replace(/"/g, '&quot;')}); document.getElementById('tokenChallengeResultsModal').remove();" style="background: #27ae60; border: none; color: white; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-size: 16px; width: 100%;">Claim Rewards</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(resultsModal);
    
    // Initialize the results tab and populate leaderboard
    this.showTokenChallengeTab('results');
    this.populateTokenChallengeLeaderboard();
  }

  // Switch between tabs in token challenge results modal
  showTokenChallengeTab(tab) {
    const resultsTab = document.getElementById('tokenResultsTab');
    const leaderboardTab = document.getElementById('tokenLeaderboardTab');
    const resultsContent = document.getElementById('tokenResultsContent');
    const leaderboardContent = document.getElementById('tokenLeaderboardContent');
    
    if (tab === 'results') {
      resultsTab.style.background = '#FFA500';
      leaderboardTab.style.background = '#4a90e2';
      resultsContent.style.display = 'block';
      leaderboardContent.style.display = 'none';
    } else if (tab === 'leaderboard') {
      resultsTab.style.background = '#4a90e2';
      leaderboardTab.style.background = '#FFA500';
      resultsContent.style.display = 'none';
      leaderboardContent.style.display = 'block';
    }
  }

  // Roll new scores for all characters (called when player starts a challenge)
  rollCharacterTokenChallengeScores() {
    // Get current character PBs
    const characterPBs = this.getCharacterTokenChallengePBs();

    // Check if Fluzzer is currently boosted by glittering petals
    const isFluzzerCurrentlyBoosted = window.state && window.state.fluzzerGlitteringPetalsBoost && window.state.fluzzerGlitteringPetalsBoost > 0;
    
    // Check if Fluzzer has ever achieved a boosted score (has a PB as "Fluzzer (Boosted)")
    const hasFluzzerBoostedPB = characterPBs['Fluzzer (Boosted)'] && characterPBs['Fluzzer (Boosted)'] > 0;

    // Generate new scores and update PBs if higher
    const newScores = {
      'Mystic': Math.floor(Math.random() * 21) + 130, // 130-150 pts
      'Lepre': Math.floor(Math.random() * 21) + 80, // 80-100 pts
      'Vivien': Math.floor(Math.random() * 21) + 70, // 70-90 pts
      'Tico': Math.floor(Math.random() * 21) + 60, // 60-80 pts
      'Soap': Math.floor(Math.random() * 21) + 50, // 50-70 pts
      'Bijou': Math.floor(Math.random() * 21) + 65, // 65-85 pts
    };

    // Add Fluzzer based on boost status - once boosted score is achieved, permanently use boosted name
    if (isFluzzerCurrentlyBoosted || hasFluzzerBoostedPB) {
      newScores['Fluzzer (Boosted)'] = Math.floor(Math.random() * 41) + 80; // 80-120 pts
    } else {
      newScores['Fluzzer'] = Math.floor(Math.random() * 11) + 40; // 40-50 pts
    }

    // Add front desk workers with star-based performance ranges
    if (window.frontDesk && window.frontDesk.assignedWorkers) {
      Object.keys(window.frontDesk.assignedWorkers).forEach(slotId => {
        const worker = window.frontDesk.assignedWorkers[slotId];
        if (worker && worker.stars) {
          // Use custom name if available, otherwise use default name
          const workerName = worker.customName || worker.name || `Worker ${slotId}`;
          
          // Initialize worker PB tracking if not exists
          const workerKey = `worker_${worker.id}`;
          if (!window.state.characterChallengePBs[workerKey]) {
            window.state.characterChallengePBs[workerKey] = 0;
          }
          
          // Calculate performance based on star rating for Token Challenge
          // 1 star = 20-45 pts, 2 star = 30-60 pts, 3 star = 40-70 pts, 4 star = 55-90 pts, 5 star = 70-100 pts
          let baseTimeRange;
          switch (worker.stars) {
            case 1: baseTimeRange = { min: 20, max: 45 }; break;
            case 2: baseTimeRange = { min: 30, max: 60 }; break;
            case 3: baseTimeRange = { min: 40, max: 70 }; break;
            case 4: baseTimeRange = { min: 55, max: 90 }; break;
            case 5: baseTimeRange = { min: 70, max: 100 }; break;
            default: baseTimeRange = { min: 20, max: 45 }; break;
          }
          
          // Generate performance with scaling factor
          const baseTime = baseTimeRange.min + Math.random() * (baseTimeRange.max - baseTimeRange.min);
          const scaledTime = Math.floor(baseTime * 1);
          
          // Update worker PB if this is better
          if (scaledTime > window.state.characterChallengePBs[workerKey]) {
            window.state.characterChallengePBs[workerKey] = scaledTime;
          }
          
          newScores[workerName] = scaledTime;
        }
      });
    }

    // Update PBs only if new scores are higher
    const updatedPBs = {};
    Object.entries(newScores).forEach(([name, newScore]) => {
      const currentPB = characterPBs[name] || 0;
      updatedPBs[name] = Math.max(currentPB, newScore);
    });

    // Save updated PBs
    this.setCharacterTokenChallengePBs(updatedPBs);
  }

  // Populate the token challenge leaderboard
  populateTokenChallengeLeaderboard() {
    const leaderboardList = document.getElementById('tokenLeaderboardList');
    if (!leaderboardList) return;

    // Get stored character PBs (don't generate new scores here)
    const characterPBs = this.getCharacterTokenChallengePBs();

    // Create leaderboard array with stored PBs
    const leaderboard = [
      { name: 'Peachy (You)', score: this.getTokenChallengePB() }
    ];

    // Add all characters with their stored PB scores
    Object.entries(characterPBs).forEach(([name, score]) => {
      // Clean up display name (remove "(Boosted)" text)
      const displayName = name.replace(/\s*\(Boosted\)/i, '');
      leaderboard.push({ name: displayName, score });
    });

    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);

    let leaderboardHTML = '';
    leaderboard.forEach((entry, index) => {
      const isPlayer = entry.name.includes('You');
      const rowStyle = isPlayer ? 'background: rgba(255, 165, 0, 0.3); border: 2px solid #FFA500; border-radius: 8px;' : '';
      const position = index + 1;
      
      leaderboardHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin: 4px 0; ${rowStyle}">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: bold; color: #666; min-width: 30px;">#${position}</span>
            <span style="font-weight: ${isPlayer ? 'bold' : 'normal'};">${entry.name}</span>
          </div>
          <span style="font-weight: bold; color: #1e90ff;">${entry.score}pts</span>
        </div>
      `;
    });

    leaderboardList.innerHTML = leaderboardHTML;
  }

  // Get token challenge personal best
  getTokenChallengePB() {
    return parseInt(localStorage.getItem('tokenChallengePB') || '0');
  }

  // Set token challenge personal best
  setTokenChallengePB(score) {
    localStorage.setItem('tokenChallengePB', score.toString());
    this.updateTokenChallengePBDisplay();
  }

  // Get character token challenge personal bests
  getCharacterTokenChallengePBs() {
    try {
      const stored = localStorage.getItem('characterTokenChallengePBs');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Error loading character PBs:', error);
      return {};
    }
  }

  // Set character token challenge personal bests
  setCharacterTokenChallengePBs(characterScores) {
    try {
      localStorage.setItem('characterTokenChallengePBs', JSON.stringify(characterScores));
    } catch (error) {
      console.warn('Error saving character PBs:', error);
    }
  }

  // Update the PB display under the token challenge button
  updateTokenChallengePBDisplay() {
    const pbDisplay = document.getElementById('tokenChallengePBDisplay');
    const pbText = document.getElementById('tokenChallengePBText');
    
    if (pbDisplay && pbText) {
      const pb = this.getTokenChallengePB();
      
      if (pb > 0) {
        pbText.textContent = `Personal Best: ${pb} points`;
        pbDisplay.style.display = 'block';
      } else {
        pbDisplay.style.display = 'none';
      }
    }
  }

  // Claim the rewards from token challenge
  claimTokenChallengeRewards(rewards) {
    for (const [tokenType, amount] of Object.entries(rewards)) {
      this.addTokenToInventory(tokenType, amount);
    }
    
    // Show a thank you message
    this.showMessage(`Token challenge completed! Rewards have been added to your inventory.`, 'success');
    
    // Update PB display in case it changed
    this.updateTokenChallengePBDisplay();
  }

  // Add PB display to token challenge button (called when boutique UI is updated)
  addTokenChallengePBDisplay() {
    // This function is now deprecated since we use a static HTML element
    // Just update the static PB display instead
    this.updateTokenChallengePBDisplay();
  }

  // Initialize token challenge system (call this when boutique loads)
  initializeTokenChallenge() {
    setTimeout(() => {
      // Set initial button visibility based on quest completion
      this.updateTokenChallengeButtonVisibility();
      // Update PB display when boutique is shown
      this.updateTokenChallengePBDisplay();
    }, 100);
  }

  // Memory leak prevention: cleanup method to properly destroy the boutique instance
  destroy() {
    this.isDestroyed = true;
    
    // Clear all timers to prevent memory leaks
    if (this.mainUpdateInterval) {
      clearInterval(this.mainUpdateInterval);
      this.mainUpdateInterval = null;
    }
    
    if (this.kickTimer) {
      clearTimeout(this.kickTimer);
      this.kickTimer = null;
    }
    
    if (this.currentSpeechTimeout) {
      clearTimeout(this.currentSpeechTimeout);
      this.currentSpeechTimeout = null;
    }

    // Clear speech queue
    this.speechQueue = [];
    this.isSpeaking = false;
    
    // Reset all state
    this.currentShopItems = [];
    this.purchaseHistory = {};
  }

  // Halloween Shop Methods
  openHalloweenShop() {
    const modal = document.getElementById('halloweenShopModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    this.updateHalloweenShopUI();
    this.renderHalloweenShopItems();
  }
  
  closeHalloweenShop() {
    const modal = document.getElementById('halloweenShopModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  switchHalloweenShopTab(tabName) {
    const progressionTab = document.getElementById('halloweenShopProgressionTab');
    const bundlesTab = document.getElementById('halloweenShopBundlesTab');
    const progressionContent = document.getElementById('halloweenShopProgressionContent');
    const bundlesContent = document.getElementById('halloweenShopBundlesContent');
    
    if (tabName === 'progression') {
      progressionTab.style.background = '#FF8C00';
      bundlesTab.style.background = '#555';
      progressionContent.style.display = 'block';
      bundlesContent.style.display = 'none';
    } else {
      progressionTab.style.background = '#555';
      bundlesTab.style.background = '#FF8C00';
      progressionContent.style.display = 'none';
      bundlesContent.style.display = 'block';
    }
  }
  
  updateHalloweenShopUI() {
    const candyDisplay = document.getElementById('halloweenShopCandyDisplay');
    if (candyDisplay && window.state && window.state.tokens) {
      const candyAmount = DecimalUtils.isDecimal(window.state.tokens.candy) 
        ? window.state.tokens.candy.toNumber() 
        : (window.state.tokens.candy || 0);
      candyDisplay.textContent = Math.floor(candyAmount);
    }
  }
  
  renderHalloweenShopItems() {
    this.renderProgressionItems();
    this.renderBundleItems();
  }
  
  renderProgressionItems() {
    const container = document.getElementById('halloweenShopProgressionItems');
    if (!container) return;
    
    const kpBoostPurchased = this.halloweenShopPurchases.kpBoost || 0;
    const kpBoostMax = 100;
    const kpBoostCost = 2 + (2 * kpBoostPurchased);
    const canAffordKP = this.getCandyAmount() >= kpBoostCost;
    const kpBoostMaxed = kpBoostPurchased >= kpBoostMax;
    
    const prismLightBoostPurchased = this.halloweenShopPurchases.prismLightBoost || 0;
    const prismLightBoostMax = 100;
    const prismLightBoostCost = 5 + (5 * prismLightBoostPurchased);
    const canAffordPrismLight = this.getCandyAmount() >= prismLightBoostCost;
    const prismLightBoostMaxed = prismLightBoostPurchased >= prismLightBoostMax;
    
    const chargerBoostPurchased = this.halloweenShopPurchases.chargerBoost || 0;
    const chargerBoostMax = 100;
    const chargerBoostCost = 10 + (10 * chargerBoostPurchased);
    const canAffordCharger = this.getCandyAmount() >= chargerBoostCost;
    const chargerBoostMaxed = chargerBoostPurchased >= chargerBoostMax;
    
    const pollenFlowerBoostPurchased = this.halloweenShopPurchases.pollenFlowerBoost || 0;
    const pollenFlowerBoostMax = 100;
    const pollenFlowerBoostCost = 5 + (5 * pollenFlowerBoostPurchased);
    const canAffordPollenFlower = this.getCandyAmount() >= pollenFlowerBoostCost;
    const pollenFlowerBoostMaxed = pollenFlowerBoostPurchased >= pollenFlowerBoostMax;
    
    const infinityPointBoostPurchased = this.halloweenShopPurchases.infinityPointBoost || 0;
    const infinityPointBoostMax = 100;
    const infinityPointBoostCost = 100 + (100 * infinityPointBoostPurchased);
    const canAffordInfinityPoint = this.getCandyAmount() >= infinityPointBoostCost;
    const infinityPointBoostMaxed = infinityPointBoostPurchased >= infinityPointBoostMax;
    
    const swandyBoostPurchased = this.halloweenShopPurchases.swandyBoost || 0;
    const swandyBoostMax = 100;
    const swandyBoostCost = 20 + (20 * swandyBoostPurchased);
    const canAffordSwandy = this.getCandyAmount() >= swandyBoostCost;
    const swandyBoostMaxed = swandyBoostPurchased >= swandyBoostMax;
    
    const swandyShardBoostPurchased = this.halloweenShopPurchases.swandyShardBoost || 0;
    const swandyShardBoostMax = 100;
    const swandyShardBoostCost = 25 + (25 * swandyShardBoostPurchased);
    const canAffordSwandyShard = this.getCandyAmount() >= swandyShardBoostCost;
    const swandyShardBoostMaxed = swandyShardBoostPurchased >= swandyShardBoostMax;
    
    const hexingBoostPurchased = this.halloweenShopPurchases.hexingBoost || 0;
    const hexingBoostMax = 100;
    const hexingBoostCost = 200 + (200 * hexingBoostPurchased);
    const canAffordHexing = this.getCandyAmount() >= hexingBoostCost;
    const hexingBoostMaxed = hexingBoostPurchased >= hexingBoostMax;
    
    const currentGrade = window.state && window.state.grade ? (DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : window.state.grade) : 0;
    const showChargerBoost = currentGrade >= 5;
    const showPollenFlowerBoost = currentGrade >= 6;
    const totalInfinity = window.infinitySystem ? window.infinitySystem.totalInfinityEarned : 0;
    const showInfinityPointBoost = totalInfinity >= 1;
    const hasS10 = window.state?.halloweenEvent?.treeUpgrades?.purchased?.crush_swandies || false;
    const showSwandyShardBoost = hasS10;
    const hexomancyMilestone = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1 || false;
    const showHexingBoost = hexomancyMilestone;
    
    let chargerBoostHTML = '';
    if (showChargerBoost) {
      chargerBoostHTML = `
        <div style="background: rgba(51, 204, 255, 0.1); border: 2px solid #3cf; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <h4 style="color: #5dddff; margin: 0 0 5px 0;">Charger Boost</h4>
              <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases Charge gain by +0.1x per purchase</p>
            </div>
            <div style="text-align: right;">
              <div style="color: #3cf; font-size: 18px; font-weight: bold;">${chargerBoostPurchased} / ${chargerBoostMax}</div>
              <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.1 * chargerBoostPurchased).toFixed(2)}x</div>
            </div>
          </div>
          <button 
            onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('chargerBoost')"
            style="
              width: 100%; 
              padding: 10px; 
              background: ${chargerBoostMaxed ? '#444' : (canAffordCharger ? '#28a745' : '#666')}; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-weight: bold; 
              cursor: ${chargerBoostMaxed ? 'not-allowed' : (canAffordCharger ? 'pointer' : 'not-allowed')};
              opacity: ${chargerBoostMaxed ? '0.5' : '1'};
            "
            ${chargerBoostMaxed || !canAffordCharger ? 'disabled' : ''}
          >
            ${chargerBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${chargerBoostCost} Candy`}
          </button>
        </div>
      `;
    }
    
    let pollenFlowerBoostHTML = '';
    if (showPollenFlowerBoost) {
      pollenFlowerBoostHTML = `
        <div style="background: rgba(144, 238, 144, 0.1); border: 2px solid #90EE90; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <h4 style="color: #98FB98; margin: 0 0 5px 0;">Pollen & Flower Boost</h4>
              <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases Pollen and Flower gain by +0.1x per purchase</p>
            </div>
            <div style="text-align: right;">
              <div style="color: #90EE90; font-size: 18px; font-weight: bold;">${pollenFlowerBoostPurchased} / ${pollenFlowerBoostMax}</div>
              <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.1 * pollenFlowerBoostPurchased).toFixed(2)}x</div>
            </div>
          </div>
          <button 
            onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('pollenFlowerBoost')"
            style="
              width: 100%; 
              padding: 10px; 
              background: ${pollenFlowerBoostMaxed ? '#444' : (canAffordPollenFlower ? '#28a745' : '#666')}; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-weight: bold; 
              cursor: ${pollenFlowerBoostMaxed ? 'not-allowed' : (canAffordPollenFlower ? 'pointer' : 'not-allowed')};
              opacity: ${pollenFlowerBoostMaxed ? '0.5' : '1'};
            "
            ${pollenFlowerBoostMaxed || !canAffordPollenFlower ? 'disabled' : ''}
          >
            ${pollenFlowerBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${pollenFlowerBoostCost} Candy`}
          </button>
        </div>
      `;
    }
    
    let infinityPointBoostHTML = '';
    if (showInfinityPointBoost) {
      infinityPointBoostHTML = `
        <div style="background: rgba(138, 43, 226, 0.1); border: 2px solid #8B2BE2; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <h4 style="color: #9370DB; margin: 0 0 5px 0;">Infinity Point Boost</h4>
              <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases Infinity Point gain by +0.1x per purchase</p>
            </div>
            <div style="text-align: right;">
              <div style="color: #8B2BE2; font-size: 18px; font-weight: bold;">${infinityPointBoostPurchased} / ${infinityPointBoostMax}</div>
              <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.1 * infinityPointBoostPurchased).toFixed(2)}x</div>
            </div>
          </div>
          <button 
            onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('infinityPointBoost')"
            style="
              width: 100%; 
              padding: 10px; 
              background: ${infinityPointBoostMaxed ? '#444' : (canAffordInfinityPoint ? '#28a745' : '#666')}; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-weight: bold; 
              cursor: ${infinityPointBoostMaxed ? 'not-allowed' : (canAffordInfinityPoint ? 'pointer' : 'not-allowed')};
              opacity: ${infinityPointBoostMaxed ? '0.5' : '1'};
            "
            ${infinityPointBoostMaxed || !canAffordInfinityPoint ? 'disabled' : ''}
          >
            ${infinityPointBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${infinityPointBoostCost} Candy`}
          </button>
        </div>
      `;
    }
    
    let swandyBoostHTML = '';
    const isHalloweenEventActive = window.state && window.state.halloweenEventActive;
    if (isHalloweenEventActive) {
      swandyBoostHTML = `
        <div style="background: rgba(255, 165, 0, 0.1); border: 2px solid #FFA500; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <h4 style="color: #FFB347; margin: 0 0 5px 0;">Swandy Boost</h4>
              <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases Swandy gain and cap by +0.05x per purchase</p>
            </div>
            <div style="text-align: right;">
              <div style="color: #FFA500; font-size: 18px; font-weight: bold;">${swandyBoostPurchased} / ${swandyBoostMax}</div>
              <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.05 * swandyBoostPurchased).toFixed(2)}x</div>
            </div>
          </div>
          <button 
            onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('swandyBoost')"
            style="
              width: 100%; 
              padding: 10px; 
              background: ${swandyBoostMaxed ? '#444' : (canAffordSwandy ? '#28a745' : '#666')}; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-weight: bold; 
              cursor: ${swandyBoostMaxed ? 'not-allowed' : (canAffordSwandy ? 'pointer' : 'not-allowed')};
              opacity: ${swandyBoostMaxed ? '0.5' : '1'};
            "
            ${swandyBoostMaxed || !canAffordSwandy ? 'disabled' : ''}
          >
            ${swandyBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${swandyBoostCost} Candy`}
          </button>
        </div>
      `;
    }
    
    let swandyShardBoostHTML = '';
    if (showSwandyShardBoost) {
      swandyShardBoostHTML = `
        <div style="background: rgba(138, 43, 226, 0.1); border: 2px solid #8A2BE2; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <h4 style="color: #9370DB; margin: 0 0 5px 0;">Swandy Shard Boost</h4>
              <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases Hexed Swandy Shard gain by +0.5x per purchase</p>
            </div>
            <div style="text-align: right;">
              <div style="color: #8A2BE2; font-size: 18px; font-weight: bold;">${swandyShardBoostPurchased} / ${swandyShardBoostMax}</div>
              <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.5 * swandyShardBoostPurchased).toFixed(2)}x</div>
            </div>
          </div>
          <button 
            onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('swandyShardBoost')"
            style="
              width: 100%; 
              padding: 10px; 
              background: ${swandyShardBoostMaxed ? '#444' : (canAffordSwandyShard ? '#28a745' : '#666')}; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-weight: bold; 
              cursor: ${swandyShardBoostMaxed ? 'not-allowed' : (canAffordSwandyShard ? 'pointer' : 'not-allowed')};
              opacity: ${swandyShardBoostMaxed ? '0.5' : '1'};
            "
            ${swandyShardBoostMaxed || !canAffordSwandyShard ? 'disabled' : ''}
          >
            ${swandyShardBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${swandyShardBoostCost} Candy`}
          </button>
        </div>
      `;
    }
    
    let hexingBoostHTML = '';
    if (showHexingBoost) {
      hexingBoostHTML = `
        <div style="background: rgba(128, 0, 128, 0.1); border: 2px solid #800080; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <h4 style="color: #BA55D3; margin: 0 0 5px 0;">Hexing Boost</h4>
              <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases Hexflux and Hex gain by +0.02x per purchase</p>
            </div>
            <div style="text-align: right;">
              <div style="color: #800080; font-size: 18px; font-weight: bold;">${hexingBoostPurchased} / ${hexingBoostMax}</div>
              <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.02 * hexingBoostPurchased).toFixed(2)}x</div>
            </div>
          </div>
          <button 
            onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('hexingBoost')"
            style="
              width: 100%; 
              padding: 10px; 
              background: ${hexingBoostMaxed ? '#444' : (canAffordHexing ? '#28a745' : '#666')}; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-weight: bold; 
              cursor: ${hexingBoostMaxed ? 'not-allowed' : (canAffordHexing ? 'pointer' : 'not-allowed')};
              opacity: ${hexingBoostMaxed ? '0.5' : '1'};
            "
            ${hexingBoostMaxed || !canAffordHexing ? 'disabled' : ''}
          >
            ${hexingBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${hexingBoostCost} Candy`}
          </button>
        </div>
      `;
    }
    
    container.innerHTML = `
      <div style="background: rgba(255, 140, 0, 0.1); border: 2px solid #FF8C00; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <h4 style="color: #FFD700; margin: 0 0 5px 0;">Knowledge Point Boost</h4>
            <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases KP gain by +0.1x per purchase</p>
          </div>
          <div style="text-align: right;">
            <div style="color: #FFA500; font-size: 18px; font-weight: bold;">${kpBoostPurchased} / ${kpBoostMax}</div>
            <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.1 * kpBoostPurchased).toFixed(2)}x</div>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('kpBoost')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${kpBoostMaxed ? '#444' : (canAffordKP ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${kpBoostMaxed ? 'not-allowed' : (canAffordKP ? 'pointer' : 'not-allowed')};
            opacity: ${kpBoostMaxed ? '0.5' : '1'};
          "
          ${kpBoostMaxed || !canAffordKP ? 'disabled' : ''}
        >
          ${kpBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${kpBoostCost} Candy`}
        </button>
      </div>
      <div style="background: rgba(200, 150, 255, 0.1); border: 2px solid #C896FF; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <h4 style="color: #DCC4FF; margin: 0 0 5px 0;">Prism Light Boost</h4>
            <p style="color: #CCC; margin: 0; font-size: 14px;">Permanently increases all Light gain by +0.1x per purchase</p>
          </div>
          <div style="text-align: right;">
            <div style="color: #C896FF; font-size: 18px; font-weight: bold;">${prismLightBoostPurchased} / ${prismLightBoostMax}</div>
            <div style="color: #888; font-size: 12px;">Current Boost: ${(1 + 0.1 * prismLightBoostPurchased).toFixed(2)}x</div>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('prismLightBoost')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${prismLightBoostMaxed ? '#444' : (canAffordPrismLight ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${prismLightBoostMaxed ? 'not-allowed' : (canAffordPrismLight ? 'pointer' : 'not-allowed')};
            opacity: ${prismLightBoostMaxed ? '0.5' : '1'};
          "
          ${prismLightBoostMaxed || !canAffordPrismLight ? 'disabled' : ''}
        >
          ${prismLightBoostMaxed ? 'MAX PURCHASED' : `Purchase for ${prismLightBoostCost} Candy`}
        </button>
      </div>
      ${chargerBoostHTML}
      ${pollenFlowerBoostHTML}
      ${infinityPointBoostHTML}
      ${swandyBoostHTML}
      ${swandyShardBoostHTML}
      ${hexingBoostHTML}
    `;
  }
  
  renderBundleItems() {
    const container = document.getElementById('halloweenShopBundleItems');
    if (!container) return;
    
    const starterBundlePurchased = this.halloweenShopPurchases.starterBundle || false;
    const starterBundleCost = 20;
    const canAffordStarter = this.getCandyAmount() >= starterBundleCost;
    
    const sparkyBundlePurchased = this.halloweenShopPurchases.sparkyBundle || false;
    const sparkyBundleCost = 100;
    const canAffordSparky = this.getCandyAmount() >= sparkyBundleCost;
    
    const berryliciousBundlePurchased = this.halloweenShopPurchases.berryliciousBundle || false;
    const berryliciousBundleCost = 125;
    const canAffordBerrylicious = this.getCandyAmount() >= berryliciousBundleCost;
    
    const naturalBundlePurchased = this.halloweenShopPurchases.naturalBundle || false;
    const naturalBundleCost = 350;
    const canAffordNatural = this.getCandyAmount() >= naturalBundleCost;
    
    const prismaBundlePurchased = this.halloweenShopPurchases.prismaBundle || false;
    const prismaBundleCost = 500;
    const canAffordPrisma = this.getCandyAmount() >= prismaBundleCost;
    
    const richesBundlePurchased = this.halloweenShopPurchases.richesBundle || false;
    const richesBundleCost = 2000;
    const canAffordRiches = this.getCandyAmount() >= richesBundleCost;
    
    const premiumBundlePurchased = this.halloweenShopPurchases.premiumBundle || false;
    const premiumBundleCost = 5000;
    const canAffordPremium = this.getCandyAmount() >= premiumBundleCost;
    
    const ultimateOmegaBundlePurchased = this.halloweenShopPurchases.ultimateOmegaBundle || false;
    const ultimateOmegaBundleCost = 25000;
    const canAffordUltimateOmega = this.getCandyAmount() >= ultimateOmegaBundleCost;

    const honeyBundlePurchased = this.halloweenShopPurchases.honeyBundle || false;
    const honeyBundleCost = 50000;
    const canAffordHoney = this.getCandyAmount() >= honeyBundleCost;

    const mirrorDwellerBundlePurchased = this.halloweenShopPurchases.mirrorDwellerBundle || false;
    const mirrorDwellerBundleCost = 727000000;
    const canAffordMirrorDweller = this.getCandyAmount() >= mirrorDwellerBundleCost;

    container.innerHTML = `
      <div style="background: rgba(46, 204, 113, 0.1); border: 2px solid #2ecc71; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #2ecc71; margin: 0 0 5px 0;">Starter Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A good starting bundle of 30 berries, 25 sparks, 20 prisma shards, 15 water and 10 petals</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry token.png" style="width: 24px; height: 24px;">
            <span style="color: #2ecc71;">x30</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/spark token.png" style="width: 24px; height: 24px;">
            <span style="color: #2ecc71;">x25</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/prisma token.png" style="width: 24px; height: 24px;">
            <span style="color: #2ecc71;">x20</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/water token.png" style="width: 24px; height: 24px;">
            <span style="color: #2ecc71;">x15</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/petal token.png" style="width: 24px; height: 24px;">
            <span style="color: #2ecc71;">x10</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('starterBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${starterBundlePurchased ? '#444' : (canAffordStarter ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${starterBundlePurchased ? 'not-allowed' : (canAffordStarter ? 'pointer' : 'not-allowed')};
            opacity: ${starterBundlePurchased ? '0.5' : '1'};
          "
          ${starterBundlePurchased || !canAffordStarter ? 'disabled' : ''}
        >
          ${starterBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${starterBundleCost} Candy`}
        </button>
      </div>
      <div style="background: rgba(255, 140, 0, 0.1); border: 2px solid #FF8C00; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #FFD700; margin: 0 0 5px 0;">Sparky Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A sparkifying bundle of 100 sparks and 2 batteries!</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/spark token.png" style="width: 24px; height: 24px;">
            <span style="color: #FFD700;">x100</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/battery token.png" style="width: 24px; height: 24px;">
            <span style="color: #FFD700;">x2</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('sparkyBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${sparkyBundlePurchased ? '#444' : (canAffordSparky ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${sparkyBundlePurchased ? 'not-allowed' : (canAffordSparky ? 'pointer' : 'not-allowed')};
            opacity: ${sparkyBundlePurchased ? '0.5' : '1'};
          "
          ${sparkyBundlePurchased || !canAffordSparky ? 'disabled' : ''}
        >
          ${sparkyBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${sparkyBundleCost} Candy`}
        </button>
      </div>
      <div style="background: rgba(220, 20, 60, 0.1); border: 2px solid #DC143C; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #FF6B6B; margin: 0 0 5px 0;">Berrylicious Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A delicious bundle of 150 berries and 3 berry plates</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry token.png" style="width: 24px; height: 24px;">
            <span style="color: #FF6B6B;">x150</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry plate token.png" style="width: 24px; height: 24px;">
            <span style="color: #FF6B6B;">x3</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('berryliciousBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${berryliciousBundlePurchased ? '#444' : (canAffordBerrylicious ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${berryliciousBundlePurchased ? 'not-allowed' : (canAffordBerrylicious ? 'pointer' : 'not-allowed')};
            opacity: ${berryliciousBundlePurchased ? '0.5' : '1'};
          "
          ${berryliciousBundlePurchased || !canAffordBerrylicious ? 'disabled' : ''}
        >
          ${berryliciousBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${berryliciousBundleCost} Candy`}
        </button>
      </div>
      <div style="background: rgba(107, 142, 35, 0.1); border: 2px solid #6B8E23; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #9ACD32; margin: 0 0 5px 0;">Natural Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A naturally delicate bundle of 100 berries, 75 mushroom, 75 petal, 50 water, 3 berry plates, 2 mushroom soups and 1 glittering petal</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x100</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/mushroom token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x75</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/petal token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x75</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/water token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x50</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry plate token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x3</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/mushroom soup token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x2</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/glittering petal token.png" style="width: 24px; height: 24px;">
            <span style="color: #9ACD32;">x1</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('naturalBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${naturalBundlePurchased ? '#444' : (canAffordNatural ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${naturalBundlePurchased ? 'not-allowed' : (canAffordNatural ? 'pointer' : 'not-allowed')};
            opacity: ${naturalBundlePurchased ? '0.5' : '1'};
          "
          ${naturalBundlePurchased || !canAffordNatural ? 'disabled' : ''}
        >
          ${naturalBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${naturalBundleCost} Candy`}
        </button>
      </div>
      
      <div style="background: rgba(0, 206, 209, 0.1); border: 2px solid #00CED1; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #00CED1; margin: 0 0 5px 0;">Prisma Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A shiny refracted bundle of 200 prisma shards, 200 sparks, 150 water, 150 stardust, 5 charged prisma, 5 batteries</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/prisma token.png" style="width: 24px; height: 24px;">
            <span style="color: #00CED1;">x200</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/spark token.png" style="width: 24px; height: 24px;">
            <span style="color: #00CED1;">x200</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/water token.png" style="width: 24px; height: 24px;">
            <span style="color: #00CED1;">x150</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/stardust token.png" style="width: 24px; height: 24px;">
            <span style="color: #00CED1;">x150</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/charged prism token.png" style="width: 24px; height: 24px;">
            <span style="color: #00CED1;">x5</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/battery token.png" style="width: 24px; height: 24px;">
            <span style="color: #00CED1;">x5</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('prismaBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${prismaBundlePurchased ? '#444' : (canAffordPrisma ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${prismaBundlePurchased ? 'not-allowed' : (canAffordPrisma ? 'pointer' : 'not-allowed')};
            opacity: ${prismaBundlePurchased ? '0.5' : '1'};
          "
          ${prismaBundlePurchased || !canAffordPrisma ? 'disabled' : ''}
        >
          ${prismaBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${prismaBundleCost} Candy`}
        </button>
      </div>
      
      <div style="background: rgba(255, 215, 0, 0.1); border: 2px solid #FFD700; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #FFD700; margin: 0 0 5px 0;">Riches Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A regal bundle that contains 500 swa bucks, ka-ching ka-ching!</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/Swa Buck.png" style="width: 24px; height: 24px;">
            <span style="color: #FFD700;">x500</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('richesBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${richesBundlePurchased ? '#444' : (canAffordRiches ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${richesBundlePurchased ? 'not-allowed' : (canAffordRiches ? 'pointer' : 'not-allowed')};
            opacity: ${richesBundlePurchased ? '0.5' : '1'};
          "
          ${richesBundlePurchased || !canAffordRiches ? 'disabled' : ''}
        >
          ${richesBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${richesBundleCost} Candy`}
        </button>
      </div>
      
      <div style="background: rgba(147, 112, 219, 0.1); border: 2px solid #9370DB; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #9370DB; margin: 0 0 5px 0;">Premium Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">An exquisite bundle of 15 berry plates, 15 mushroom soups, 15 batteries, 10 charged prisma, and 10 glittering petals</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry plate token.png" style="width: 24px; height: 24px;">
            <span style="color: #9370DB;">x15</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/mushroom soup token.png" style="width: 24px; height: 24px;">
            <span style="color: #9370DB;">x15</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/battery token.png" style="width: 24px; height: 24px;">
            <span style="color: #9370DB;">x15</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/charged prism token.png" style="width: 24px; height: 24px;">
            <span style="color: #9370DB;">x10</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/glittering petal token.png" style="width: 24px; height: 24px;">
            <span style="color: #9370DB;">x10</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('premiumBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${premiumBundlePurchased ? '#444' : (canAffordPremium ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${premiumBundlePurchased ? 'not-allowed' : (canAffordPremium ? 'pointer' : 'not-allowed')};
            opacity: ${premiumBundlePurchased ? '0.5' : '1'};
          "
          ${premiumBundlePurchased || !canAffordPremium ? 'disabled' : ''}
        >
          ${premiumBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${premiumBundleCost} Candy`}
        </button>
      </div>
      
      <div style="background: rgba(220, 20, 60, 0.1); border: 2px solid #DC143C; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #FF1744; margin: 0 0 5px 0;">ULTIMATE OMEGA BUNDLE</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">THE ULTIMATE OMEGA bundle! only for the most dedicated of players! 15000 berries, 1500 mushrooms, 1500 sparks, 1000 prisma shards, 1000 water, 1000 petals, 750 stardust, 200 swa bucks, 50 berry plates, 150 mushroom soups, 50 batteries, 30 charged prismas and 30 glittering petals!</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x15000</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/mushroom token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x1500</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/spark token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x1500</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/prisma token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x1000</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/water token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x1000</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/petal token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x1000</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/stardust token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x750</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/Swa Buck.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x200</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/berry plate token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x50</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/mushroom soup token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x150</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/battery token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x50</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/charged prism token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x30</span>
          </div>
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/glittering petal token.png" style="width: 24px; height: 24px;">
            <span style="color: #DC143C;">x30</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('ultimateOmegaBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${ultimateOmegaBundlePurchased ? '#444' : (canAffordUltimateOmega ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${ultimateOmegaBundlePurchased ? 'not-allowed' : (canAffordUltimateOmega ? 'pointer' : 'not-allowed')};
            opacity: ${ultimateOmegaBundlePurchased ? '0.5' : '1'};
          "
          ${ultimateOmegaBundlePurchased || !canAffordUltimateOmega ? 'disabled' : ''}
        >
          ${ultimateOmegaBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${ultimateOmegaBundleCost} Candy`}
        </button>
      </div>
      
      <div style="background: rgba(255, 215, 0, 0.1); border: 2px solid #FFD700; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #FFD700; margin: 0 0 5px 0;">Hon̶̤͂ė̷̡̨̤̞̰͔̩͓̹͇̞̙͐͛̀͊̇́̓͆̌͆̒͜͝ Bundle</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">ḥ̵̢̢̡̘͎̥̬̙̠͍̙̞͚̊̉ͅo̸͈̅̆͆͐n̴̠͈̞̜̬̺̂͊̂͊̐e̶̝͗́̔̀̿̇̃y̶̧̨͈̜̹͈͛̽̀́̉͛̕͘͜͝</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/honey token.png" style="width: 24px; height: 24px;">
            <span style="color: #FFD700;">x1</span>
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('honeyBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${honeyBundlePurchased ? '#444' : (canAffordHoney ? '#FFD700' : '#666')}; 
            color: ${honeyBundlePurchased || !canAffordHoney ? '#CCC' : '#000'}; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${honeyBundlePurchased ? 'not-allowed' : (canAffordHoney ? 'pointer' : 'not-allowed')};
            opacity: ${honeyBundlePurchased ? '0.5' : '1'};
          "
          ${honeyBundlePurchased || !canAffordHoney ? 'disabled' : ''}
        >
          ${honeyBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${honeyBundleCost} Candy`}
        </button>
      </div>
      
      <div style="background: rgba(139, 0, 139, 0.1); border: 2px solid #8B008B; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <h4 style="color: #FF00FF; margin: 0 0 5px 0;">MIRROR DWELLER BUNDLE</h4>
          <p style="color: #CCC; margin: 0; font-size: 14px;">A good bundle that unlocks the elusive facial vrchat mirror</p>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 5px;">
            <img src="assets/icons/door.png" style="width: 40px; height: 40px;">
          </div>
        </div>
        <button 
          onclick="if(window.boutique) window.boutique.purchaseHalloweenItem('mirrorDwellerBundle')"
          style="
            width: 100%; 
            padding: 10px; 
            background: ${mirrorDwellerBundlePurchased ? '#444' : (canAffordMirrorDweller ? '#28a745' : '#666')}; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            font-weight: bold; 
            cursor: ${mirrorDwellerBundlePurchased ? 'not-allowed' : (canAffordMirrorDweller ? 'pointer' : 'not-allowed')};
            opacity: ${mirrorDwellerBundlePurchased ? '0.5' : '1'};
          "
          ${mirrorDwellerBundlePurchased || !canAffordMirrorDweller ? 'disabled' : ''}
        >
          ${mirrorDwellerBundlePurchased ? 'ALREADY PURCHASED' : `Purchase for ${mirrorDwellerBundleCost.toLocaleString()} Candy`}
        </button>
      </div>
    `;

  }
  
  getCandyAmount() {
    if (!window.state || !window.state.tokens) return 0;
    const candyAmount = DecimalUtils.isDecimal(window.state.tokens.candy) 
      ? window.state.tokens.candy.toNumber() 
      : (window.state.tokens.candy || 0);
    return Math.floor(candyAmount);
  }
  
  // Sync halloweenShopPurchases to window.state
  syncHalloweenShopToState() {
    if (window.state) {
      window.state.halloweenShopPurchases = this.halloweenShopPurchases;
    }
  }
  
  purchaseHalloweenItem(itemId) {
    if (itemId === 'kpBoost') {
      const currentPurchases = this.halloweenShopPurchases.kpBoost || 0;
      const maxPurchases = 100;
      const cost = 2 + (2 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of KP boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.kpBoost = currentPurchases + 1;
      this.syncHalloweenShopToState();
      
      this.showMessage('KP Boost purchased! Your KP gain is now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'prismLightBoost') {
      const currentPurchases = this.halloweenShopPurchases.prismLightBoost || 0;
      const maxPurchases = 100;
      const cost = 5 + (5 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Prism Light boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.prismLightBoost = currentPurchases + 1;
      this.syncHalloweenShopToState();
      
      this.showMessage('Prism Light Boost purchased! All light gain is now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'chargerBoost') {
      const currentPurchases = this.halloweenShopPurchases.chargerBoost || 0;
      const maxPurchases = 100;
      const cost = 10 + (10 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Charger boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.chargerBoost = currentPurchases + 1;
      
      this.showMessage('Charger Boost purchased! Your charge gain is now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'pollenFlowerBoost') {
      const currentPurchases = this.halloweenShopPurchases.pollenFlowerBoost || 0;
      const maxPurchases = 100;
      const cost = 5 + (5 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Pollen & Flower boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.pollenFlowerBoost = currentPurchases + 1;
      
      this.showMessage('Pollen & Flower Boost purchased! Your pollen and flower gain is now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'infinityPointBoost') {
      const currentPurchases = this.halloweenShopPurchases.infinityPointBoost || 0;
      const maxPurchases = 100;
      const cost = 100 + (100 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Infinity Point boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.infinityPointBoost = currentPurchases + 1;
      
      this.showMessage('Infinity Point Boost purchased! Your infinity point gain is now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'swandyBoost') {
      const currentPurchases = this.halloweenShopPurchases.swandyBoost || 0;
      const maxPurchases = 100;
      const cost = 20 + (20 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Swandy boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.swandyBoost = currentPurchases + 1;
      
      this.showMessage('Swandy Boost purchased! Your swandy gain and cap are now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'swandyShardBoost') {
      const currentPurchases = this.halloweenShopPurchases.swandyShardBoost || 0;
      const maxPurchases = 100;
      const cost = 25 + (25 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Swandy Shard boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.swandyShardBoost = currentPurchases + 1;
      
      this.showMessage('Swandy Shard Boost purchased! Your hexed swandy shard gain is now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'hexingBoost') {
      const currentPurchases = this.halloweenShopPurchases.hexingBoost || 0;
      const maxPurchases = 100;
      const cost = 200 + (200 * currentPurchases);
      
      if (currentPurchases >= maxPurchases) {
        this.showMessage('You have already purchased the maximum amount of Hexing boosts!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.hexingBoost = currentPurchases + 1;
      
      this.showMessage('Hexing Boost purchased! Your hexflux and hex gain are now permanently increased!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
    } else if (itemId === 'sparkyBundle') {
      const cost = 100;
      
      if (this.halloweenShopPurchases.sparkyBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.tokens.spark) {
        window.state.tokens.spark = new Decimal(0);
      }
      window.state.tokens.spark = DecimalUtils.toDecimal(window.state.tokens.spark).plus(100);
      
      if (!window.state.batteries) {
        window.state.batteries = new Decimal(0);
      }
      window.state.batteries = DecimalUtils.toDecimal(window.state.batteries).plus(2);
      
      this.halloweenShopPurchases.sparkyBundle = true;
      
      this.showMessage('Electrifying Bundle purchased! You received 100 sparks and 2 batteries!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
    } else if (itemId === 'berryliciousBundle') {
      const cost = 125;
      
      if (this.halloweenShopPurchases.berryliciousBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.tokens.berry) {
        window.state.tokens.berry = new Decimal(0);
      }
      window.state.tokens.berry = DecimalUtils.toDecimal(window.state.tokens.berry).plus(150);
      
      if (!window.state.berryPlate) {
        window.state.berryPlate = new Decimal(0);
      }
      window.state.berryPlate = DecimalUtils.toDecimal(window.state.berryPlate).plus(3);
      
      this.halloweenShopPurchases.berryliciousBundle = true;
      
      this.showMessage('Berrylicious Bundle purchased! You received 150 berries and 3 berry plates!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
      
    } else if (itemId === 'naturalBundle') {
      const cost = 350;
      
      if (this.halloweenShopPurchases.naturalBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.tokens.berry) {
        window.state.tokens.berry = new Decimal(0);
      }
      window.state.tokens.berry = DecimalUtils.toDecimal(window.state.tokens.berry).plus(100);
      
      if (!window.state.tokens.mushroom) {
        window.state.tokens.mushroom = new Decimal(0);
      }
      window.state.tokens.mushroom = DecimalUtils.toDecimal(window.state.tokens.mushroom).plus(75);
      
      if (!window.state.tokens.petal) {
        window.state.tokens.petal = new Decimal(0);
      }
      window.state.tokens.petal = DecimalUtils.toDecimal(window.state.tokens.petal).plus(75);
      
      if (!window.state.tokens.water) {
        window.state.tokens.water = new Decimal(0);
      }
      window.state.tokens.water = DecimalUtils.toDecimal(window.state.tokens.water).plus(50);
      
      if (!window.state.berryPlate) {
        window.state.berryPlate = new Decimal(0);
      }
      window.state.berryPlate = DecimalUtils.toDecimal(window.state.berryPlate).plus(3);
      
      if (!window.state.mushroomSoup) {
        window.state.mushroomSoup = new Decimal(0);
      }
      window.state.mushroomSoup = DecimalUtils.toDecimal(window.state.mushroomSoup).plus(2);
      
      if (!window.state.glitteringPetals) {
        window.state.glitteringPetals = new Decimal(0);
      }
      window.state.glitteringPetals = DecimalUtils.toDecimal(window.state.glitteringPetals).plus(1);
      
      this.halloweenShopPurchases.naturalBundle = true;
      
      this.showMessage('Natural Bundle purchased! You received 100 berries, 75 mushroom, 75 petal, 50 water, 3 berry plates, 2 mushroom soups and 1 glittering petal!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
      
    } else if (itemId === 'prismaBundle') {
      const cost = 500;
      
      if (this.halloweenShopPurchases.prismaBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.tokens.prisma) {
        window.state.tokens.prisma = new Decimal(0);
      }
      window.state.tokens.prisma = DecimalUtils.toDecimal(window.state.tokens.prisma).plus(200);
      
      if (!window.state.tokens.spark) {
        window.state.tokens.spark = new Decimal(0);
      }
      window.state.tokens.spark = DecimalUtils.toDecimal(window.state.tokens.spark).plus(200);
      
      if (!window.state.tokens.water) {
        window.state.tokens.water = new Decimal(0);
      }
      window.state.tokens.water = DecimalUtils.toDecimal(window.state.tokens.water).plus(150);
      
      if (!window.state.tokens.stardust) {
        window.state.tokens.stardust = new Decimal(0);
      }
      window.state.tokens.stardust = DecimalUtils.toDecimal(window.state.tokens.stardust).plus(150);
      
      if (!window.state.chargedPrisma) {
        window.state.chargedPrisma = new Decimal(0);
      }
      window.state.chargedPrisma = DecimalUtils.toDecimal(window.state.chargedPrisma).plus(5);
      
      if (!window.state.batteries) {
        window.state.batteries = new Decimal(0);
      }
      window.state.batteries = DecimalUtils.toDecimal(window.state.batteries).plus(5);
      
      this.halloweenShopPurchases.prismaBundle = true;
      
      this.showMessage('Prisma Bundle purchased! You received 200 prisma shards, 200 sparks, 150 water, 150 stardust, 5 charged prisma and 5 batteries!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
      
    } else if (itemId === 'richesBundle') {
      const cost = 2000;
      
      if (this.halloweenShopPurchases.richesBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.swabucks) {
        window.state.swabucks = new Decimal(0);
      }
      window.state.swabucks = DecimalUtils.toDecimal(window.state.swabucks).plus(500);
      
      this.halloweenShopPurchases.richesBundle = true;
      
      this.showMessage('Riches Bundle purchased! You received 500 swa bucks, ka-ching ka-ching!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
      
    } else if (itemId === 'premiumBundle') {
      const cost = 5000;
      
      if (this.halloweenShopPurchases.premiumBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.berryPlate) {
        window.state.berryPlate = new Decimal(0);
      }
      window.state.berryPlate = DecimalUtils.toDecimal(window.state.berryPlate).plus(15);
      
      if (!window.state.mushroomSoup) {
        window.state.mushroomSoup = new Decimal(0);
      }
      window.state.mushroomSoup = DecimalUtils.toDecimal(window.state.mushroomSoup).plus(15);
      
      if (!window.state.batteries) {
        window.state.batteries = new Decimal(0);
      }
      window.state.batteries = DecimalUtils.toDecimal(window.state.batteries).plus(15);
      
      if (!window.state.chargedPrisma) {
        window.state.chargedPrisma = new Decimal(0);
      }
      window.state.chargedPrisma = DecimalUtils.toDecimal(window.state.chargedPrisma).plus(10);
      
      if (!window.state.glitteringPetals) {
        window.state.glitteringPetals = new Decimal(0);
      }
      window.state.glitteringPetals = DecimalUtils.toDecimal(window.state.glitteringPetals).plus(10);
      
      this.halloweenShopPurchases.premiumBundle = true;
      
      this.showMessage('Premium Bundle purchased! You received 15 berry plates, 15 mushroom soups, 15 batteries, 10 charged prisma and 10 glittering petals!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
      
    } else if (itemId === 'ultimateOmegaBundle') {
      const cost = 25000;
      
      if (this.halloweenShopPurchases.ultimateOmegaBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.tokens.berry) {
        window.state.tokens.berry = new Decimal(0);
      }
      window.state.tokens.berry = DecimalUtils.toDecimal(window.state.tokens.berry).plus(15000);
      
      if (!window.state.tokens.mushroom) {
        window.state.tokens.mushroom = new Decimal(0);
      }
      window.state.tokens.mushroom = DecimalUtils.toDecimal(window.state.tokens.mushroom).plus(1500);
      
      if (!window.state.tokens.spark) {
        window.state.tokens.spark = new Decimal(0);
      }
      window.state.tokens.spark = DecimalUtils.toDecimal(window.state.tokens.spark).plus(1500);
      
      if (!window.state.tokens.prisma) {
        window.state.tokens.prisma = new Decimal(0);
      }
      window.state.tokens.prisma = DecimalUtils.toDecimal(window.state.tokens.prisma).plus(1000);
      
      if (!window.state.tokens.water) {
        window.state.tokens.water = new Decimal(0);
      }
      window.state.tokens.water = DecimalUtils.toDecimal(window.state.tokens.water).plus(1000);
      
      if (!window.state.tokens.petal) {
        window.state.tokens.petal = new Decimal(0);
      }
      window.state.tokens.petal = DecimalUtils.toDecimal(window.state.tokens.petal).plus(1000);
      
      if (!window.state.tokens.stardust) {
        window.state.tokens.stardust = new Decimal(0);
      }
      window.state.tokens.stardust = DecimalUtils.toDecimal(window.state.tokens.stardust).plus(750);
      
      if (!window.state.tokens.swaBucks) {
        window.state.tokens.swaBucks = new Decimal(0);
      }
      window.state.tokens.swaBucks = DecimalUtils.toDecimal(window.state.tokens.swaBucks).plus(200);
      
      if (!window.state.berryPlate) {
        window.state.berryPlate = new Decimal(0);
      }
      window.state.berryPlate = DecimalUtils.toDecimal(window.state.berryPlate).plus(50);
      
      if (!window.state.mushroomSoup) {
        window.state.mushroomSoup = new Decimal(0);
      }
      window.state.mushroomSoup = DecimalUtils.toDecimal(window.state.mushroomSoup).plus(150);
      
      if (!window.state.batteries) {
        window.state.batteries = new Decimal(0);
      }
      window.state.batteries = DecimalUtils.toDecimal(window.state.batteries).plus(50);
      
      if (!window.state.chargedPrisma) {
        window.state.chargedPrisma = new Decimal(0);
      }
      window.state.chargedPrisma = DecimalUtils.toDecimal(window.state.chargedPrisma).plus(30);
      
      if (!window.state.glitteringPetals) {
        window.state.glitteringPetals = new Decimal(0);
      }
      window.state.glitteringPetals = DecimalUtils.toDecimal(window.state.glitteringPetals).plus(30);
      
      this.halloweenShopPurchases.ultimateOmegaBundle = true;
      
      this.showMessage('ULTIMATE OMEGA BUNDLE PURCHASED! You received 15000 berries, 1500 mushroom, 1500 sparks, 1000 prisma shards, 1000 water, 1000 petals, 750 stardust, 200 swa bucks, 50 berry plates, 150 mushroom soups, 50 batteries, 30 charged prisma and 30 glittering petals!', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
      
    } else if (itemId === 'honeyBundle') {
      const cost = 50000;
      
      if (this.halloweenShopPurchases.honeyBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy!', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      if (!window.state.tokens.honey) {
        window.state.tokens.honey = new Decimal(0);
      }
      window.state.tokens.honey = DecimalUtils.toDecimal(window.state.tokens.honey).plus(1);
      
      this.halloweenShopPurchases.honeyBundle = true;
      
      // Trigger the game crash effect
      this.triggerGameCrashEffect();
      
    } else if (itemId === 'mirrorDwellerBundle') {
      const cost = 727000000;
      
      if (this.halloweenShopPurchases.mirrorDwellerBundle) {
        this.showMessage('You have already purchased this bundle!', 'error');
        return;
      }
      
      if (this.getCandyAmount() < cost) {
        this.showMessage('Not enough candy! You need 727,000,000 candy to unlock the forbidden mirror...', 'error');
        return;
      }
      
      if (!window.state.tokens.candy) {
        window.state.tokens.candy = new Decimal(0);
      }
      window.state.tokens.candy = DecimalUtils.toDecimal(window.state.tokens.candy).minus(cost);
      
      this.halloweenShopPurchases.mirrorDwellerBundle = true;
      
      this.showMessage('🔮 THE MIRROR HAS AWAKENED 🔮 You have unlocked the elusive facial vrchat mirror! You can now see your true reflection...', 'success');
      this.updateHalloweenShopUI();
      this.renderHalloweenShopItems();
      
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
    }
    
    // Sync all purchases to window.state
    this.syncHalloweenShopToState();

  }
  
  updateHalloweenShopButtonVisibility() {
    const halloweenShopBtn = document.getElementById('halloweenShopBtn');
    if (!halloweenShopBtn) return;
    
    if (window.state && window.state.halloweenEventActive) {
      halloweenShopBtn.style.display = 'block';
    } else {
      halloweenShopBtn.style.display = 'none';
    }
  }
  
  getHalloweenKPBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.kpBoost || 0;
    return 1 + (0.1 * purchases);
  }
  
  getHalloweenPrismLightBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.prismLightBoost || 0;
    return 1 + (0.1 * purchases);
  }
  
  getHalloweenChargerBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.chargerBoost || 0;
    return 1 + (0.1 * purchases);
  }
  
  getHalloweenPollenFlowerBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.pollenFlowerBoost || 0;
    return 1 + (0.1 * purchases);
  }
  
  getHalloweenInfinityPointBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.infinityPointBoost || 0;
    return 1 + (0.1 * purchases);
  }
  
  getHalloweenSwandyBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.swandyBoost || 0;
    return 1 + (0.05 * purchases);
  }
  
  getHalloweenSwandyShardBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.swandyShardBoost || 0;
    return 1 + (0.5 * purchases);
  }
  
  getHalloweenHexingBoostMultiplier() {
    const purchases = this.halloweenShopPurchases.hexingBoost || 0;
    return 1 + (0.02 * purchases);
  }
  
  triggerGameCrashEffect() {
    // Create crash screen overlay
    const crashOverlay = document.createElement('div');
    crashOverlay.id = 'gameCrashOverlay';
    crashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #0a0e27 25%, #1a2438 25%, #1a2438 50%, #0a0e27 50%, #0a0e27 75%, #1a2438 75%, #1a2438);
      background-size: 20px 20px;
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Courier New', monospace;
      overflow: hidden;
    `;
    
    // Create crash message content
    const crashContent = document.createElement('div');
    crashContent.style.cssText = `
      text-align: center;
      color: #0f0;
      text-shadow: 0 0 10px #0f0;
      font-size: 24px;
      font-weight: bold;
      animation: flicker 0.15s infinite;
      z-index: 1000000;
    `;
    crashContent.innerHTML = `
      <div style="font-size: 32px; margin-bottom: 20px;">CRITICAL SYSTEM ERROR</div>
      <div style="font-size: 18px; line-height: 1.8;">
        Fluff Inc has encountered a serious issue<br>
        and needs to restart.<br>
        <br>
        ERROR_HONEY_OVERFLOW<br>
        CODE: 0x7273D700<br>
        <br>
        Please stand by...<br>
      </div>
    `;
    
    // Add flicker animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flicker {
        0%, 18%, 22%, 25%, 53%, 57%, 100% {
          opacity: 1;
        }
        20%, 24%, 55% {
          opacity: 0.2;
        }
      }
    `;
    document.head.appendChild(style);
    
    crashOverlay.appendChild(crashContent);
    document.body.appendChild(crashOverlay);
    
    // After 2 seconds (while crash screen is still showing), close shop and switch to cargo tab
    setTimeout(() => {
      // Close the Halloween shop modal
      this.closeHalloweenShop();
      
      // Switch to Cargo tab
      if (typeof switchHomeSubTab === 'function') {
        switchHomeSubTab('gamblingMain');
      }
      
      // Update inventory to show the honey token
      if (typeof renderInventoryTokens === 'function') {
        renderInventoryTokens();
      }
    }, 2000);
    
    // After 7 seconds, recover from crash (remove the crash screen)
    setTimeout(() => {
      // Remove crash overlay
      if (crashOverlay.parentNode) {
        crashOverlay.remove();
      }
    }, 7000);
  }
}

// Initialize boutique system
window.boutique = new Boutique();

// Initialize token challenge PB display when boutique loads
if (typeof window.onBoutiqueOpen !== 'function') {
  window.onBoutiqueOpen = function() {
    setTimeout(() => {
      window.boutique.initializeTokenChallenge();
    }, 200);
  };
}



// Hook into boutique sub tab button to force Lepre appearance
function hookBoutiqueSubTabButton() {
  const boutiqueBtn = document.getElementById('boutiqueSubTabBtn');
  if (boutiqueBtn && !boutiqueBtn.hasAttribute('data-lepre-hook')) {
    const originalOnClick = boutiqueBtn.onclick;
    boutiqueBtn.onclick = function() {
      // Call original function first
      if (originalOnClick) originalOnClick.call(this);
      
      // Force Lepre to appear if it's during boutique hours
      if (window.boutique && typeof window.boutique.forceLepareAppearance === 'function') {
        window.boutique.forceLepareAppearance();
      }
    };
    boutiqueBtn.setAttribute('data-lepre-hook', 'true');

  }
}

// Hook the button when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    hookBoutiqueSubTabButton();
    
    // Initialize boutique button properly based on all requirements
    if (window.boutique && typeof window.boutique.initializeBoutiqueButton === 'function') {
      window.boutique.initializeBoutiqueButton();
    }
  }, 1500); // Increased delay to ensure state is fully loaded
});

// Make boutique available globally for debugging
window.Boutique = Boutique;

// Debug function to add swa bucks for testing
window.addSwaBucksForTesting = function(amount = 1000) {
  if (!window.state) {
    window.state = {};
  }
  if (!window.state.swabucks) {
    window.state.swabucks = new Decimal(0);
  }
  window.state.swabucks = window.state.swabucks.add(amount);
  
  // Update boutique UI if it's open
  if (window.boutique) {
    window.boutique.updateBoutiqueUI();
    const swabucksDisplay = document.getElementById('boutique-swabucks-display');
    if (swabucksDisplay) {
      swabucksDisplay.textContent = window.state.swabucks.toString();
    }
  }
  
  // Update inventory display
  if (typeof window.updateInventoryModal === 'function') {
    window.updateInventoryModal();
  }

  return window.state.swabucks.toString();
};

// Debug function to force shop restock
window.forceRestockBoutique = function() {
  if (window.boutique) {
    window.boutique.restockShop();
    // Update UI if boutique is currently open
    window.boutique.updateUIIfBoutiqueIsOpen();



  } else {

  }
};

// Debug function to test daily free bucks
window.testDailyFreeBucks = function() {
  if (!window.boutique) {

    return;
  }





  // Try to claim
  const result = window.boutique.claimFreeBucks();

  return {
    canClaim: window.boutique.canClaimFreeBucks(),
    amount: window.boutique.getFreeBucksAmount(),
    lastClaimTime: window.boutique.lastFreeBucksTime,
    claimResult: result
  };
};

// Debug function to reset daily free bucks (for testing)
window.resetDailyFreeBucks = function() {
  if (window.boutique) {
    window.boutique.lastFreeBucksTime = 0;
    window.boutique.lastFreeBucksGameTime = 0;
    window.boutique.updateFreeBucksButton();
  }
};

// Debug function to test premium token persistence
window.testPremiumTokenPersistence = function() {
  console.log('Current premium state:', window.premiumState);
  if (window.premiumState.bijouUnlocked) {
    console.log('✓ Bijou is unlocked');
  } else {
    console.log('✗ Bijou is locked');
  }
  if (window.premiumState.vrchatMirrorUnlocked) {
    console.log('✓ VRChat Mirror is unlocked');
  } else {
    console.log('✗ VRChat Mirror is locked');
  }
  
  // Test save/load cycle
  if (typeof saveGame === 'function') {
    saveGame();
    console.log('✓ Game saved successfully');
  } else {
    console.log('✗ saveGame function not available');
  }
  
  return window.premiumState;
};



// Debug function to test Lepre token giving
window.testLepreTokens = function() {

  // Check if Lepre is in character preferences
  if (window.characterTokenPreferences && window.characterTokenPreferences.Lepre) {

  } else {

  }
  
  // Check if Lepre is in charToDept mapping
  if (window.charToDept && window.charToDept.Lepre) {

  } else {

  }
  
  // Check current Lepre friendship
  if (window.friendship && window.friendship.Boutique) {

  } else {

  }
  
  // Test if token drop targets include Lepre




};

// Debug function to test Lepre speech and stats modal
window.testLepreFeatures = function() {

  // Test speech system
  if (window.characterTokenSpeech && window.characterTokenSpeech.Lepre) {

  } else {

  }
  
  // Test if showCharacterSpeech function exists
  if (typeof window.showCharacterSpeech === 'function') {

  } else {

  }
  
  // Test current friendship status
  if (window.friendship && window.friendship.Boutique) {

  } else {

  }
  
  // Test friendship system
  if (window.friendship && typeof window.friendship.addPoints === 'function') {

  } else {

  }
  
  // Test character to department mapping
  if (window.charToDept && window.charToDept.lepre) {

  } else {

  }
  
  // Provide testing instructions





  return {
    speechSystemReady: !!(window.characterTokenSpeech && window.characterTokenSpeech.Lepre),
    functionExists: typeof window.showCharacterSpeech === 'function',
    currentFriendship: window.friendship?.Boutique || null,
    addPointsFunction: typeof window.friendship?.addPoints === 'function',
    charToDeptMapping: !!window.charToDept?.lepre
  };
};

// Debug function to manually test Lepre friendship
window.testLepreFriendship = function(amount = 20) {

  // Initialize friendship system if not ready
  if (!window.friendship || typeof window.friendship.addPoints !== 'function') {

    if (typeof initFriendshipFunctions === 'function') {
      initFriendshipFunctions();
    } else {

      return false;
    }
  }
  
  // Get current friendship before
  const before = window.friendship.Boutique ? JSON.parse(JSON.stringify(window.friendship.Boutique)) : null;

  // Add points
  try {
    window.friendship.addPoints('Lepre', new Decimal(amount));

  } catch (error) {

    return false;
  }
  
  // Get current friendship after
  const after = window.friendship.Boutique ? JSON.parse(JSON.stringify(window.friendship.Boutique)) : null;

  // Update the stats modal if it's open
  const statsModal = document.getElementById('departmentStatsModal');
  if (statsModal && statsModal.style.display === 'flex') {
    const title = document.getElementById('departmentStatsModalTitle');
    if (title && title.textContent && title.textContent.includes('Boutique')) {
      if (typeof showDepartmentStatsModal === 'function') {
        showDepartmentStatsModal('Boutique');

      }
    }
  }
  
  // Test free bucks amount
  if (window.boutique) {
    const freeBucksAmount = window.boutique.getFreeBucksAmount();

  }

  return true;
}

// Debug functions for testing Lepre interactions
window.debugLepre = function() {











};

window.testPokeSpam = function() {

  for (let i = 0; i < 50; i++) {
    window.boutique.pokeLepre();
  }
};

window.testVeryMadSpam = function() {

  window.boutique.lepreIsMad = true;
  window.boutique.lepreMadUntil = Date.now() + (24 * 60 * 60 * 1000);
  window.boutique.priceMultiplier = 10;

  for (let i = 0; i < 50; i++) {
    window.boutique.pokeLepre();
  }
};

window.calmLepre = function() {

  window.boutique.lepreIsMad = false;
  window.boutique.lepreIsVeryMad = false;
  window.boutique.priceMultiplier = 1;
  window.boutique.leprePokeCount = 0;
  window.boutique.lepreVeryMadPokeCount = 0;
  
  // Clear kick timer
  if (window.boutique.kickTimer) {
    clearTimeout(window.boutique.kickTimer);
    window.boutique.kickTimer = null;
  }
  
  window.boutique.updateUIIfBoutiqueIsOpen();

};

window.forceVeryMad = function() {

  window.boutique.lepreIsVeryMad = true;
  window.boutique.lepreVeryMadUntil = Date.now() + (48 * 60 * 60 * 1000);
  window.boutique.priceMultiplier = 1000;
  window.boutique.startKickTimer();
  window.boutique.updateUIIfBoutiqueIsOpen();

};

window.testSpeechQueue = function() {

  window.boutique.queueSpeech("First speech in queue!", 3000);
  window.boutique.queueSpeech("Second speech should wait!", 3000);
  window.boutique.queueSpeech("Third speech comes last!", 3000);

};;

// Test function to verify the restock UI update works while inside boutique
window.testBoutiqueRestock = function() {

  // Check if boutique is currently open
  const boutiqueTab = document.getElementById('boutiqueSubTab');
  if (!boutiqueTab || boutiqueTab.style.display === 'none') {

    return;
  }

  window.forceRestockBoutique();

};

// Debug function to test Lepre's crab anomaly dialogue
window.testLepreCrabDialogue = function() {

    if (!window.boutique) {

        return;
    }
    
    // Test normal speeches

    // Spawn crab anomaly
    if (window.anomalySystem) {
        window.anomalySystem.spawnCrabBucksAnomaly();

        // Test crab speeches

        // Test crab poke speeches

    } else {

    }

};

// Debug function to test all Lepre crab dialogues
window.testAllLepreCrabDialogues = function() {

    if (!window.boutique) {

        return;
    }
    
    // Make sure crab anomaly is active
    if (window.anomalySystem) {
        window.anomalySystem.spawnCrabBucksAnomaly();
    }

    const crabSpeeches = window.boutique.getLepreCrabAnomalySpeeches();
    crabSpeeches.forEach((speech, i) => {

    });

    const crabPokeSpeeches = window.boutique.getLepreCrabPokeSpeeches();
    crabPokeSpeeches.forEach((tier, i) => {

        tier.speeches.forEach((speech, j) => {

        });
    });
};


// Debug function to test Lepre's friendship buff for token stock
window.testLepreStockBuff = function(friendshipLevel = 4) {

  if (!window.boutique) {

    return;
  }
  
  // Set friendship level
  window.boutique.lepreFriendshipLevel = friendshipLevel;

  // Clear current stock first
  window.boutique.clearCurrentStock();

  // Count normal tokens before buff
  const normalTokenTypes = ['stardustTokens', 'petalTokens', 'mushroomTokens', 'berryTokens'];
  
  // Generate new stock
  const newStock = window.boutique.generateRandomStock();

  // Count normal tokens
  let foundNormalTokens = 0;
  normalTokenTypes.forEach(tokenType => {
    if (newStock[tokenType] && newStock[tokenType].stock > 0) {
      foundNormalTokens++;
    }
  });
  
  // Calculate expected bonus (friendship level 4+ gets +1, level 6+ gets +2, level 8+ gets +3)
  let expectedBonus = 0;
  if (friendshipLevel >= 8) expectedBonus = 3;
  else if (friendshipLevel >= 6) expectedBonus = 2;
  else if (friendshipLevel >= 4) expectedBonus = 1;



  // Apply the stock to boutique
  window.boutique.currentStock = newStock;
  window.boutique.lastRestockTime = Date.now();
  
  // Check final stock amounts
  let afterStock = 0;
  normalTokenTypes.forEach(tokenType => {
    if (newStock[tokenType] && newStock[tokenType].stock > 0) {
      afterStock += newStock[tokenType].stock;

    }
  });

  return {
    friendshipLevel,
    expectedBonus,
    normalTokensFound: foundNormalTokens,
    currentStock: afterStock
  };
};

// Debug function to test multiple friendship levels
window.testAllLepreStockBuffs = function() {

  const testLevels = [1, 3, 4, 5, 6, 8, 10];
  const results = [];
  
  testLevels.forEach(level => {

    const result = window.testLepreStockBuff(level);
    results.push(result);
  });

  results.forEach(result => {
    const hasBonus = result.expectedBonus > 0;
    const status = hasBonus ? '✅' : '⭕';

  });
  
  return results;
};

// Debug function to reset token challenge cooldown
window.resetTokenChallengeCooldown = function() {
  if (window.boutique) {
    window.boutique.tokenChallengeUsedSinceRestock = false;
    window.boutique.tokenChallengeLastUsed = 0;
    window.boutique.updateTokenChallengeButtonVisibility();
    return 'Token challenge cooldown reset! Challenge is now available.';
  } else {
    return 'Boutique not initialized.';
  }
};
