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
        isUnlocked: () => window.premiumState && window.premiumState.bijouUnlocked
      },
      {
        id: 'vrchatMirror',
        name: 'Unlock VRChat Mirror',
  // description removed
        icon: 'assets/icons/door.png', // Using door icon as placeholder
        basePrice: 5000,
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
    } else if (tokenType === 'berryPlate') {
      if (!window.state.berryPlate) {
        window.state.berryPlate = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.berryPlate)) {
        window.state.berryPlate = new Decimal(window.state.berryPlate);
      }
      window.state.berryPlate = window.state.berryPlate.add(quantity);
    } else if (tokenType === 'mushroomSoup') {
      if (!window.state.mushroomSoup) {
        window.state.mushroomSoup = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.mushroomSoup)) {
        window.state.mushroomSoup = new Decimal(window.state.mushroomSoup);
      }
      window.state.mushroomSoup = window.state.mushroomSoup.add(quantity);
    } else if (tokenType === 'glitteringPetals') {
      if (!window.state.glitteringPetals) {
        window.state.glitteringPetals = new Decimal(0);
      } else if (!DecimalUtils.isDecimal(window.state.glitteringPetals)) {
        window.state.glitteringPetals = new Decimal(window.state.glitteringPetals);
      }
      window.state.glitteringPetals = window.state.glitteringPetals.add(quantity);
    } else if (tokenType === 'chargedPrisma') {
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
            class="boutique-buy-btn ${(!canAfford || isOutOfStock) ? 'disabled' : ''}" 
            onclick="window.boutique.purchaseItem('${item.id}')"
            ${(!canAfford || isOutOfStock) ? 'disabled' : ''}
          >
            ${isOutOfStock ? 'Sold Out' : 'Buy'}
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
      isIn727AnomalySequence: this.isIn727AnomalySequence
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
    this.dailyStock = {};
  }
}

// Initialize boutique system
window.boutique = new Boutique();

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
