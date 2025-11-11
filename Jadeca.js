// Jadeca's Hut System - Hexing and Hexomancy

// Initialize Jadeca state
if (window.state && window.state.halloweenEvent) {
  if (!window.state.halloweenEvent.jadeca) {
    window.state.halloweenEvent.jadeca = {
      currentSubTab: 'hexing',
      hexflux: new Decimal(0),
      hexionCount: 0,
      hexomancyMilestones: {},
      peachyIsHexed: false,
      dialogueState: {
        hasSeenIntro: false,
        dialogueInProgress: false,
        currentDialogue: null,
        currentLine: 0
      },
      character: {
        lastInteraction: 0,
        interactionCooldown: 10000,
        totalInteractions: 0,
        isTalking: false,
        speechTimer: null,
        currentImage: 'assets/icons/halloween jadeca.png'
      }
    };
  }

  // Ensure hexflux is a Decimal
  if (!DecimalUtils.isDecimal(window.state.halloweenEvent.jadeca.hexflux)) {
    window.state.halloweenEvent.jadeca.hexflux = new Decimal(window.state.halloweenEvent.jadeca.hexflux || 0);
  }
  
  // Ensure character object exists
  if (!window.state.halloweenEvent.jadeca.character) {
    window.state.halloweenEvent.jadeca.character = {
      lastInteraction: 0,
      interactionCooldown: 10000,
      totalInteractions: 0,
      isTalking: false,
      speechTimer: null,
      currentImage: 'assets/icons/halloween jadeca.png'
    };
  }
  
  // Ensure dialogue state exists
  if (!window.state.halloweenEvent.jadeca.dialogueState) {
    window.state.halloweenEvent.jadeca.dialogueState = {
      hasSeenIntro: false,
      hasSeenMilestone2: false,
      dialogueInProgress: false,
      currentDialogue: null,
      currentLine: 0
    };
  }
  
  // Reset dialogue in progress flag on page load if dialogue wasn't completed
  // This handles cases where the player refreshed during dialogue
  if (window.state.halloweenEvent.jadeca.dialogueState.dialogueInProgress && 
      !window.state.halloweenEvent.jadeca.dialogueState.hasSeenIntro) {
    window.state.halloweenEvent.jadeca.dialogueState.dialogueInProgress = false;
    window.state.halloweenEvent.jadeca.dialogueState.currentDialogue = null;
    window.state.halloweenEvent.jadeca.dialogueState.currentLine = 0;
  }
  
  // Also check after a delay in case save loads after initialization
  setTimeout(() => {
    if (window.state && 
        window.state.halloweenEvent && 
        window.state.halloweenEvent.jadeca && 
        window.state.halloweenEvent.jadeca.dialogueState) {
      if (window.state.halloweenEvent.jadeca.dialogueState.dialogueInProgress && 
          !window.state.halloweenEvent.jadeca.dialogueState.hasSeenIntro) {
        window.state.halloweenEvent.jadeca.dialogueState.dialogueInProgress = false;
        window.state.halloweenEvent.jadeca.dialogueState.currentDialogue = null;
        window.state.halloweenEvent.jadeca.dialogueState.currentLine = 0;
      }
    }
  }, 500);
  
  // Ensure peachy hex flag exists
  if (window.state.halloweenEvent.jadeca.peachyIsHexed === undefined) {
    window.state.halloweenEvent.jadeca.peachyIsHexed = false;
  }
}

// Threatening Jadeca dialogue
const jadecaQuotes = [
  // Mundane witch activities
  "I need to reorganize my spell components... again.",
  "Where did I put my eye of newt? I just had it here...",
  "This cauldron needs cleaning. Perhaps I'll make you do it, Peachy.",
  "My spellbooks are getting dusty. The curse makes housekeeping difficult.",
  "I should brew more hex potions today. Running low on the purple ones.",
  "These candles won't light themselves. Well, actually they could, but manual is better.",
  "My crystal ball needs polishing. Can't see visions through all this grime.",
  "I wonder if I should plant more nightshade in the garden...",
  "The moon phase is perfect for hexing tonight. How convenient.",

  "This cursed grove has been my prison for a decade. I didn't create this nightmare.",
  "The original curse binds me here just as much as it corrupts the land.",
  "I've tried to leave countless times. The barrier always pulls me back.",
  "Whoever cursed this place trapped me here too. Ironic, isn't it?",
  "The grove's magic prevents me from stepping beyond its boundaries. Infuriating.",
  "I'm not the villain who cursed this place. I'm just the villain who hexed you.",
  "The barrier burns when I try to cross it. Trust me, I've tried everything.",
  "Sometimes I wonder if I'll ever see the world beyond this cursed forest again.",
  "The original witch who cursed this grove is long dead. But their magic lingers.",
  "I've been studying this curse for years, trying to find a way to break it. The only clue I know is restoring the tree of life.",
  "Every escape attempt ends the same way. The curse drags me back to this hut.",
  "This hut is not originally mine, I actually come from the fire continent.",
  "The grove itself is alive with dark magic. It won't let me leave.",
  

  "My simulacrum works at your precious Fluff Inc facility. Amusing, isn't it?",
  "You've seen me at the facility's front desk? That's actually my magical duplicate.",
  "I created a magical clone to experience the outside world vicariously.",
  "My simulacrum reports back to me about facility gossip. Quite entertaining.",
  "The front desk workers have no idea they're talking to an enchanted duplicate.",
  "Creating that simulacrum took months of preparation. Worth every minute.",
  "My duplicate follows a basic script. Enough to fool most people.",
  "Through my clone's eyes, I see glimpses of freedom. It's bittersweet.",
  "The simulacrum can leave the grove because it's not truly alive. Unlike me.",
  "I wonder if anyone at Fluff Inc suspects the truth about their coworker...",
  "My duplicate's job performance is acceptable, I hear. Not that I care much.",
  "Maintaining the simulacrum from here requires constant magical energy.",
  
  "Zephyra... that pompous fool thinks they're so mysterious.",
  "𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒's true name holds power. They'd be furious if others knew.",
  "I knew '𝒯𝒽𝑒 𝒮𝓌𝒶 𝐸𝓁𝒾𝓉𝑒' before they got their title. They were different back then.",
  "Zephyra's magic is strong, but predictable. I've studied it extensively.",
  "One day I'll confront Zephyra about our past. When I'm finally free.",

  "That thieving chef Mystic STOLE my witch hat! The audacity!",
  "Mystic took my cauldron for their 'Halloween costume'. UNFORGIVABLE!",
  "I will have my revenge on Mystic. Nobody steals from a real witch!",
  "My hat was an heirloom! And Mystic just... took it! For aesthetics!",
  "When I'm free from this grove, Mystic will answer for their theft.",
  "Mystic thinks they're so clever with MY hat and MY cauldron!",
  "I've tried hexing Mystic three times already. But they all have no effects on them!",
  "The chef has no idea what power those stolen items actually hold.",
  "My cauldron isn't just decorative, Mystic! It's a conduit for dark magic!",
  "I hope Mystic enjoys wearing cursed artifacts. I didn't remove the enchantments.",
  

  "Your hex is quite elegant, if I say so myself. A masterwork.",
  "The binding hex on you is permanent. Unless I choose to lift it.",
  "I can feel your emotions through the hex mark. Fascinating.",
  "The hex makes you... compliant. Useful for my experiments.",
  "I didn't want to curse you initially. But trespassers must learn.",
  "The hex mark pulses when you resist. Quite entertaining to observe.",
  "Your hex serves as both punishment and leash. Efficient.",
  "I could make the hex more painful, but cooperation works better than agony.",
  "Through the hex, I can track you anywhere. Even back at that facility.",
  "The curse changes you slowly. In time, you won't remember life before it.",
  "Your hex is my finest work. Beautiful, terrible, and unbreakable.",


  "A Hex of Provenance reveals an object's history. Quite useful for research.",
  "Hexes of Purity cleanse corruption. Ironic that dark magic can purify, no?",
  "Blessings are just hexes with positive intent. The magic is fundamentally the same.",
  "Curses persist beyond death. Hexes can be broken. Know the difference.",
  "A vex is a minor curse, barely worth the mana. Child's play, really.",
  "True hexcraft requires sacrifice. Blood, time, or soul, pick your poison.",
  "The Hex of Binding is what holds you. Unbreakable without my consent.",
  "Hexes of Sight let me see through marked targets' eyes. Privacy is an illusion.",
  "I've studied seventeen different hex classifications. Each with unique properties.",
  "Blessing magic is just hex magic with better marketing. Don't be fooled.",
  "Curses corrupt permanently. Hexes can be reversed. Choose your magic wisely.",
  "The Hex of Shadows conceals presence. Useful for... observations.",
  "Vexes are what amateurs cast. Professionals use proper hexes or curses.",
  "A Hex of Resonance connects two souls. Dangerous if misused.",
  "The ancient texts describe hexes I wouldn't dare attempt. Some knowledge is forbidden.",
  "Hex magic flows through intent and sacrifice. Emotion makes it stronger.",
  "I could teach hexcraft, but most lack the conviction for dark magic.",
  "The Hex of Dreams invades sleep. I prefer my victims conscious though.",
  "Blessing someone against their will is still a violation. Remember that.",
  "Curses require hatred. Hexes only need purpose. That's why I prefer them."
];

// Extra menacing dialogue specifically for poke interactions
const jadecaPokeQuotes = [
  "Touch me again and you'll find out what a REAL hex feels like.",
  "Personal space, bird. Learn it, or lose your ability to fly, oh wait, you never were able to fly.",
  "That's strike one. You don't want to know what strike three entails.",
  "Did I give you permission to touch me? No? Then DON'T.",
  "How bold of you. How... regrettable for you.",
  "I'd appreciate if you kept your feathers to yourself. Final warning.",
  "You're testing my patience. It's running quite thin.",
  "Interesting choice. Most who touch me uninvited don't get a second chance.",
  "I could turn you into something decorative. A candlestick, perhaps?",
  "Your audacity is almost admirable. Almost.",
  "Do you WANT to become a toad? Because this is how you become a toad.",
  "I'm not a petting zoo attraction, birdster creature.",
  "That hex on you can always be made worse. Remember that.",
  "Touch me again and I'll show you why they call me the Hex Witch.",
  "You must have a death wish. Or you're incredibly stupid. Which is it?",
  "My patience is not infinite. Unlike the torment I can inflict.",
  "Peachy, I'm not in the mood for physical contact today.",
  "One more poke and you'll be scrubbing my cauldron for a week.",
  "I appreciate the boldness, but I don't appreciate the touching.",
  "You realize I could make your life significantly more miserable, yes?",
  "That's quite enough of that. Keep your distance.",
  "I'm starting to think that hex didn't teach you proper respect.",
  "Would you like me to demonstrate what these hands can do with hexcraft?",
  "Personal boundaries, Peachy. They exist for YOUR safety.",
  "I'm trying to be civil here. Don't make me regret it.",
  "Each poke is another ingredient I'll make you gather for my potions.",
  "You're fortunate I need you alive for my experiments.",
  "Stop that, or I'll give you something to REALLY complain about.",
  "I could make you forget your own name with a single hex. Don't tempt me."
];

// Jadeca Introduction Dialogue
const jadecaIntroDialogue = [
  {
    speaker: 'jadeca',
    text: "What in the hex...? Who are you?! How did you break into MY hut?!"
  },
  {
    speaker: 'peachy',
    text: "Trick or treat! Give me all your swandies!"
  },
  {
    speaker: 'jadeca',
    text: "TRICK OR TREAT?! This isn't some festive game, you insolent creature! You've broken into MY domain!"
  },
  {
    speaker: 'peachy',
    text: "Oh! Sorry, I didn't mean to intrude! The door was kinda... open? I'm Peachy by the way!"
  },
  {
    speaker: 'jadeca',
    text: "Open?! IMPOSSIBLE! That door is sealed with ancient magic! Unless... you crafted a key of some sort..."
  },
  {
    speaker: 'peachy',
    text: "Whoa, what are you doing? Why is the door glowing purple—wait, it's closing by itself!"
  },
  {
    speaker: 'jadeca',
    text: "There. Now we can have a proper... interview. Tell me, 'Peachy', what manner of creature are you? And WHY have you trespassed into my domain?"
  },
  {
    speaker: 'peachy',
    text: "I'm a Swaria! Well, some call me Peachy. I work at Fluff Inc! I was just exploring the Haunted Grove and got curious about this spooky hut!"
  },
  {
    speaker: 'jadeca',
    text: "Curiosity killed more than just cats, little bird. You've made a GRAVE mistake entering here. Perhaps I should demonstrate what happens to uninvited guests..."
  },
  {
    speaker: 'peachy',
    text: "Uh... you wouldn't actually hurt me, right? I mean, I said I was sorry! Haha... ha..."
  },
  {
    speaker: 'jadeca',
    text: "Hurt you? No, no... I have something FAR more useful in mind. Tell me, what are those shimmering candies you're carrying?"
  },
  {
    speaker: 'peachy',
    text: "These? They're Swandies! I've collected quite a lot of them. Why do you ask?"
  },
  {
    speaker: 'jadeca',
    text: "Swandies... PERFECT. Those contain exactly the kind of energy I need for my hexflux experiments. You're going to help me, bird creature."
  },
  {
    speaker: 'peachy',
    text: "Help you? I mean, I guess I could, but I really should get back to the facility—"
  },
  {
    speaker: 'jadeca',
    text: "You misunderstand. This isn't a REQUEST. You WILL help me, or face consequences that will make you wish you never set foot in this grove."
  },
  {
    speaker: 'peachy',
    text: "That sounds... really threatening. But like, what if I just... don't?"
  },
  {
    speaker: 'jadeca',
    text: "Then allow me to show you what happens to those who defy me."
  },
  {
    speaker: 'peachy',
    text: "Wait, what are you— WHOA! What's happening to me?! I feel weird!"
  },
  {
    speaker: 'jadeca',
    text: "Behold, the HEX OF BINDING! You are now marked with my curse, birdo. Your very essence is tethered to my will."
  },
  {
    speaker: 'peachy',
    text: "M-My feathers... they look different! What did you DO to me?!"
  },
  {
    speaker: 'jadeca',
    text: "I've placed you under my control. The hex ensures your cooperation. Fight it, and you'll only suffer. Obey, and you'll barely notice it's there."
  },
  {
    speaker: 'peachy',
    text: "This is really scary... I just wanted to explore, not get hexed by a witch!"
  },
  {
    speaker: 'jadeca',
    text: "Calm yourself. I'm not a monster. You may return to your 'facility' whenever you wish. Work your mundane job, live your life..."
  },
  {
    speaker: 'peachy',
    text: "Wait, really? So I'm not trapped here?"
  },
  {
    speaker: 'jadeca',
    text: "The hex remains with you wherever you go. When I need your assistance with my plans, you will return. Until my work is complete, you are MINE."
  },
  {
    speaker: 'peachy',
    text: "I... I guess I don't have much choice, do I?"
  },
  {
    speaker: 'jadeca',
    text: "No. You don't. Now, birdser. You will go forth and gather more Swandies for me. We will use these for my hexion experiments."
  },
  {
    speaker: 'peachy',
    text: "Okay... I'll help you. Just... please don't hurt me."
  },
  {
    speaker: 'jadeca',
    text: "Excellent. You're learning quickly. Now when you're ready, drop all your swandies into the cauldron to begin the hexion. And remember... with this hex mark placed in you, I will be always watching."
  }
];

// Jadeca Milestone 2 Dialogue - Expanding on the lore
const jadecaMilestone2Dialogue = [
  {
    speaker: 'peachy',
    text: "Jadeca! I've been helping you with these hexion rituals for a while now. Can you tell me more about what we're actually doing?"
  },
  {
    speaker: 'jadeca',
    text: "Curious, are we? Very well. You've earned some answers. Sit down, birdsitter. This will take a moment."
  },
  {
    speaker: 'peachy',
    text: "I'm listening!"
  },
  {
    speaker: 'jadeca',
    text: "This little stump we've been growing, the Tree of Horrors, it's our weapon against the TRUE threat."
  },
  {
    speaker: 'peachy',
    text: "Wait, this is just a stump? I thought it was... bigger?"
  },
  {
    speaker: 'jadeca',
    text: "It WAS just a stump when you arrived. Thanks to your efforts hexing its branches, it's now protected and growing stronger. Its age amplifies my hexcraft significantly."
  },
  {
    speaker: 'peachy',
    text: "So... what's the real problem then?"
  },
  {
    speaker: 'jadeca',
    text: "The REAL problem is out there. The massive, decaying monstrosity that looms over this entire cursed grove."
  },
  {
    speaker: 'peachy',
    text: "You mean that huge dark tree I saw when I first got here?"
  },
  {
    speaker: 'jadeca',
    text: "That 'huge dark tree' was once known as the Tree of Eternal Autumn. A beacon of life and prosperity. Now? It's the Tree of Dread."
  },
  {
    speaker: 'peachy',
    text: "Tree of Dread? That sounds... really bad."
  },
  {
    speaker: 'jadeca',
    text: "It IS bad. When the original curse took hold decades ago, it corrupted the World Tree. It withered, decayed, and began spreading its demonic aura across the land."
  },
  {
    speaker: 'peachy',
    text: "This whole place... the Haunted Grove... it wasn't always like this?"
  },
  {
    speaker: 'jadeca',
    text: "No. It was once the Grove of Eternal Autumn. Beautiful, peaceful, full of life. The curse transformed it into this nightmare. And it's getting WORSE."
  },
  {
    speaker: 'peachy',
    text: "Worse?! How much worse can it get?"
  },
  {
    speaker: 'jadeca',
    text: "The Tree of Dread continues to spread its corruption. There's an impending doom approaching, the curse will eventually consume the entire water continent if we don't stop it."
  },
  {
    speaker: 'peachy',
    text: "That's terrifying! But... how do we stop a giant cursed tree?"
  },
  {
    speaker: 'jadeca',
    text: "We accelerate its decay. The Tree of Dread is already dying, we just need to speed up the process. When it finally dies, the curse dies with it."
  },
  {
    speaker: 'peachy',
    text: "And that's what all the hexions are for? To make it die faster?"
  },
  {
    speaker: 'jadeca',
    text: "Precisely. Each hexion ritual channels energy that weakens the Tree of Dread's lifespan. The stronger our Tree of Horrors grows, the faster we can kill the Tree of Dread."
  },
  {
    speaker: 'peachy',
    text: "Wait... if this place is so dangerous, why haven't I been affected? Shouldn't I be cursed too?"
  },
  {
    speaker: 'jadeca',
    text: "Ah. About that. Remember when I placed that hex on you? The Hex of Binding?"
  },
  {
    speaker: 'peachy',
    text: "How could I forget? You made it sound super scary!"
  },
  {
    speaker: 'jadeca',
    text: "It WAS meant to sound scary. But the truth is... the Hex of Binding is actually protecting you."
  },
  {
    speaker: 'peachy',
    text: "Wait, WHAT?! You're saying you cursed me to... protect me?"
  },
  {
    speaker: 'jadeca',
    text: "The Tree of Dread's demonic aura corrupts and withers any living creature that enters this grove. Without my hex shielding you, you'd have withered away within hours."
  },
  {
    speaker: 'peachy',
    text: "So... you weren't actually being evil? You were saving my life?"
  },
  {
    speaker: 'jadeca',
    text: "Don't misunderstand. I needed you alive for my plans. But yes, the hex serves a dual purpose. It binds you to me AND protects you from the curse."
  },
  {
    speaker: 'peachy',
    text: "That's... actually kind of thoughtful? In a weird, witchy way?"
  },
  {
    speaker: 'jadeca',
    text: "Don't get sentimental on me, birdstmental. You're still my hexed assistant. Now, I've made something for you, this Hex Staff I've crafted..."
  },
  {
    speaker: 'peachy',
    text: "Oh! That purple staff thing? What's it for?"
  },
  {
    speaker: 'jadeca',
    text: "I've infused it with hexcraft specifically attuned to swandy energy. It will amplify your efforts in the Swandy Crusher significantly."
  },
  {
    speaker: 'peachy',
    text: "So it's like... a magical tool to help me gather more swandies?"
  },
  {
    speaker: 'jadeca',
    text: "Precisely. More swandies means more hexflux. More hexflux means stronger hexions. Stronger hexions means faster decay of the Tree of Dread."
  },
  {
    speaker: 'peachy',
    text: "Everything's connected! This is way more complex than I thought!"
  },
  {
    speaker: 'jadeca',
    text: "Complex, yes. But necessary. The impending doom grows closer every day. We must work faster."
  },
  {
    speaker: 'peachy',
    text: "Okay, I understand now. We're growing the Tree of Horrors to make your magic stronger, using that magic to kill the Tree of Dread, and ending the curse!"
  },
  {
    speaker: 'jadeca',
    text: "Finally, you grasp the situation. Perhaps you're not as dense as I initially thought."
  },
  {
    speaker: 'peachy',
    text: "Hey! I'm plenty smart! I just needed context!"
  },
  {
    speaker: 'jadeca',
    text: "Context you now have. Keep gathering swandies, keep performing hexions, and perhaps we'll survive this impending catastrophe."
  },
  {
    speaker: 'peachy',
    text: "We can do this! Together!"
  },
  {
    speaker: 'jadeca',
    text: "...Yes. Together. Now get back to work. Those swandies won't collect themselves."
  }
];

// Get character image for dialogue
function getJadecaDialogueImage(character, speaking = false) {
  if (character === 'peachy') {
    // Check if we're at the part of the dialogue where the hex is applied (line 17+)
    const dialogueState = window.state?.halloweenEvent?.jadeca?.dialogueState;
    const isHexed = dialogueState && dialogueState.currentLine >= 17;
    
    if (window.state && window.state.halloweenEventActive && window.getHalloweenPeachyImage) {
      // Use hexed Halloween images if past line 17
      if (isHexed) {
        return speaking ? 'assets/icons/halloween hexed swa speech.png' : 'assets/icons/halloween hexed swa.png';
      }
      return window.getHalloweenPeachyImage(speaking ? 'speech' : 'normal');
    }
    
    // Use hexed normal images if past line 17
    if (isHexed) {
      return speaking ? 'assets/icons/hexed swa speech.png' : 'assets/icons/hexed swa.png';
    }
    
    if (window.premiumState && window.premiumState.bijouEnabled) {
      return speaking ? 'assets/icons/peachy and bijou talking.png' : 'assets/icons/peachy and bijou.png';
    }
    return speaking ? 'swa talking.png' : 'swa normal.png';
  }
  
  if (character === 'jadeca') {
    return speaking ? 'assets/icons/halloween jadeca speech.png' : 'assets/icons/halloween jadeca.png';
  }
  
  return 'assets/icons/wip.png';
}

// Get character display name for dialogue
function getJadecaDialogueName(character) {
  const names = {
    peachy: 'Peachy',
    jadeca: 'Jadeca'
  };
  return names[character] || character;
}

// Process dialogue text (same as quest system)
function processJadecaDialogueText(text) {
  let processedText = text;
  
  if (processedText.includes('𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒')) {
    processedText = processedText.replace('𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒', createJadecaWaveAnimation('𝒮𝓌𝒶𝓌𝑒𝓈𝑜𝓂𝑒'));
  }
  
  return processedText;
}

// Create wave animation for dialogue text
function createJadecaWaveAnimation(word) {
  const letters = Array.from(word);
  let animatedLetters = letters.map((letter, index) => {
    const delay = index * 0.15;
    return `<span style="
      display: inline-block;
      animation: swawesomeWave 2.5s ease-in-out infinite;
      animation-delay: ${delay}s;
      font-weight: bold;
      color: #ff4757;
      text-shadow: 0 0 8px rgba(255, 71, 87, 0.6), 0 0 15px rgba(255, 71, 87, 0.3);
      transform-origin: center bottom;
    ">${letter}</span>`;
  }).join('');
  
  return animatedLetters;
}

// Show Jadeca dialogue interface
function showJadecaDialogue() {
  if (!window.state || !window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const dialogueState = window.state.halloweenEvent.jadeca.dialogueState;
  if (!dialogueState || !dialogueState.currentDialogue) {
    return;
  }
  
  const currentLine = dialogueState.currentDialogue[dialogueState.currentLine];
  
  if (!currentLine) {
    return;
  }
  
  // Create dialogue modal
  let dialogueModal = document.getElementById('jadecaDialogueModal');
  if (!dialogueModal) {
    dialogueModal = document.createElement('div');
    dialogueModal.id = 'jadecaDialogueModal';
    dialogueModal.style.cssText = `
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      z-index: 100000;
      pointer-events: auto;
      cursor: pointer;
    `;
    document.body.appendChild(dialogueModal);
    
    // Add click-to-continue functionality
    dialogueModal.addEventListener('click', continueJadecaDialogue);
    
    // Set flag
    dialogueState.dialogueInProgress = true;
  }
  
  const isSpeaking = (speaker) => speaker === currentLine.speaker;
  
  // Peachy on left, Jadeca on right (flipped)
  const leftCharacter = 'peachy';
  const rightCharacter = 'jadeca';
  
  const leftCharacterImage = getJadecaDialogueImage(leftCharacter, isSpeaking(leftCharacter));
  const rightCharacterImage = getJadecaDialogueImage(rightCharacter, isSpeaking(rightCharacter));
  
  dialogueModal.innerHTML = `
    <style>
      @keyframes swawesomeWave {
        0% { transform: translateY(0px) scale(1); }
        25% { transform: translateY(-12px) scale(1.05); }
        50% { transform: translateY(-15px) scale(1.1); }
        75% { transform: translateY(-8px) scale(1.02); }
        100% { transform: translateY(0px) scale(1); }
      }
    </style>
    <div style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    ">
      <!-- Character Images -->
      <div style="
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 5%;
        position: relative;
      ">
        <!-- Left Character (Peachy) -->
        <div id="jadecaDialogueLeftContainer" style="
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: ${isSpeaking(leftCharacter) ? '1' : '0.6'};
          transition: opacity 0.3s ease;
          transform: scale(${isSpeaking(leftCharacter) ? '1.05' : '1'});
          position: relative;
        ">
          <img src="${leftCharacterImage}" alt="${getJadecaDialogueName(leftCharacter)}" style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          ">
          ${isSpeaking(leftCharacter) ? `
            <div class="quest-speech-bubble quest-speech-right">
              ${processJadecaDialogueText(currentLine.text)}
            </div>
          ` : ''}
        </div>
        
        <!-- Right Character (Jadeca - Flipped) -->
        <div id="jadecaDialogueRightContainer" style="
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: ${isSpeaking(rightCharacter) ? '1' : '0.6'};
          transition: opacity 0.3s ease;
          transform: scaleX(-1) scale(${isSpeaking(rightCharacter) ? '1.05' : '1'});
          position: relative;
        ">
          <img src="${rightCharacterImage}" alt="${getJadecaDialogueName(rightCharacter)}" style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
          ">
          ${isSpeaking(rightCharacter) ? `
            <div class="quest-speech-bubble quest-speech-flipped">
              ${processJadecaDialogueText(currentLine.text)}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Continue to next dialogue line
function continueJadecaDialogue(event) {
  if (!window.state || !window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) return;
  
  const dialogueState = window.state.halloweenEvent.jadeca.dialogueState;
  if (!dialogueState || !dialogueState.currentDialogue) return;
  
  // Prevent event bubbling
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  dialogueState.currentLine++;
  
  if (dialogueState.currentLine >= dialogueState.currentDialogue.length) {
    // Dialogue finished
    closeJadecaDialogue();
  } else {
    // Show next dialogue line
    showJadecaDialogue();
    
    // If we just reached line 17 (when hex is applied), add a brief visual effect
    if (dialogueState.currentLine === 17) {
      setTimeout(() => {
        const peachyImg = document.querySelector('.jadeca-dialogue-character-left img');
        if (peachyImg) {
          peachyImg.style.filter = 'drop-shadow(0 4px 12px rgba(138, 43, 226, 0.8)) brightness(0.7) hue-rotate(270deg)';
          setTimeout(() => {
            peachyImg.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))';
          }, 300);
        }
      }, 100);
    }
  }
}

// Close Jadeca dialogue
function closeJadecaDialogue() {
  const dialogueModal = document.getElementById('jadecaDialogueModal');
  if (dialogueModal) {
    dialogueModal.remove();
  }
  
  if (window.state && window.state.halloweenEvent && window.state.halloweenEvent.jadeca && window.state.halloweenEvent.jadeca.dialogueState) {
    const dialogueState = window.state.halloweenEvent.jadeca.dialogueState;
    
    // Check which dialogue just finished
    const wasIntroDialogue = dialogueState.currentDialogue === jadecaIntroDialogue;
    const wasMilestone2Dialogue = dialogueState.currentDialogue === jadecaMilestone2Dialogue;
    
    dialogueState.dialogueInProgress = false;
    dialogueState.currentDialogue = null;
    dialogueState.currentLine = 0;
    
    if (wasIntroDialogue) {
      dialogueState.hasSeenIntro = true;
      
      // Set hex flag and update all Peachy images
      window.state.halloweenEvent.jadeca.peachyIsHexed = true;
      updatePeachyToHexedImages();
    }
    
    if (wasMilestone2Dialogue) {
      dialogueState.hasSeenMilestone2 = true;
    }
  }
}

// Update all Peachy/Swaria images to hexed versions
function updatePeachyToHexedImages() {
  if (!window.state || !window.state.halloweenEvent || !window.state.halloweenEvent.jadeca || !window.state.halloweenEvent.jadeca.peachyIsHexed) {
    return;
  }
  
  // Update main cargo Swaria image
  const mainSwariaImg = document.getElementById('swariaCharacter');
  if (mainSwariaImg) {
    if (window.state.halloweenEventActive) {
      mainSwariaImg.src = 'assets/icons/halloween hexed swa.png';
    } else {
      mainSwariaImg.src = 'assets/icons/hexed swa.png';
    }
  }
  
  // Update prism lab Swaria image
  const prismSwariaImg = document.querySelector('#prismLab img[src*="swa"]');
  if (prismSwariaImg) {
    prismSwariaImg.src = 'assets/icons/hexed swa prism.png';
  }
  
  // Update advanced prism Swaria image
  const advancedPrismSwariaImg = document.querySelector('#advancedPrism img[src*="swa"]');
  if (advancedPrismSwariaImg) {
    advancedPrismSwariaImg.src = 'assets/icons/hexed swa prism.png';
  }
  
  // Update hardcore mode Swaria image (KitoFox mode)
  const hardcoreSwariaImg = document.getElementById('hardModeSwariaImg');
  if (hardcoreSwariaImg) {
    hardcoreSwariaImg.src = 'assets/icons/hexed swa.png';
  }
  
  // Update Halloween event Peachy image
  const halloweenPeachyImg = document.querySelector('#halloweenEvent img[src*="peachy"]');
  if (halloweenPeachyImg && window.state.halloweenEventActive) {
    halloweenPeachyImg.src = 'assets/icons/halloween hexed swa.png';
  }
  
  // Update any other Peachy images in the document
  document.querySelectorAll('img[src*="peachy"], img[src*="swa normal"], img[src*="swa talking"]').forEach(img => {
    if (window.state.halloweenEventActive) {
      if (img.src.includes('speech') || img.src.includes('talking')) {
        img.src = 'assets/icons/halloween hexed swa speech.png';
      } else {
        img.src = 'assets/icons/halloween hexed swa.png';
      }
    } else {
      if (img.src.includes('speech') || img.src.includes('talking')) {
        img.src = 'assets/icons/hexed swa speech.png';
      } else {
        img.src = 'assets/icons/hexed swa.png';
      }
    }
  });
}

// Start Jadeca intro dialogue
function startJadecaIntroDialogue() {
  if (!window.state || !window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  // Ensure dialogue state exists
  if (!window.state.halloweenEvent.jadeca.dialogueState) {
    window.state.halloweenEvent.jadeca.dialogueState = {
      hasSeenIntro: false,
      dialogueInProgress: false,
      currentDialogue: null,
      currentLine: 0
    };
  }
  
  const dialogueState = window.state.halloweenEvent.jadeca.dialogueState;
  
  // Don't start if already seen or in progress
  if (dialogueState.hasSeenIntro || dialogueState.dialogueInProgress) {
    return;
  }
  
  // Check if dialogue modal already exists
  if (document.getElementById('jadecaDialogueModal')) {
    return;
  }
  
  dialogueState.currentDialogue = jadecaIntroDialogue;
  dialogueState.currentLine = 0;
  
  showJadecaDialogue();
}

// Start Jadeca milestone 2 dialogue
function startJadecaMilestone2Dialogue() {
  if (!window.state || !window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  // Ensure dialogue state exists
  if (!window.state.halloweenEvent.jadeca.dialogueState) {
    window.state.halloweenEvent.jadeca.dialogueState = {
      hasSeenIntro: false,
      hasSeenMilestone2: false,
      dialogueInProgress: false,
      currentDialogue: null,
      currentLine: 0
    };
  }
  
  const dialogueState = window.state.halloweenEvent.jadeca.dialogueState;
  
  // Don't start if already seen or in progress
  if (dialogueState.hasSeenMilestone2 || dialogueState.dialogueInProgress) {
    return;
  }
  
  // Check if dialogue modal already exists
  if (document.getElementById('jadecaDialogueModal')) {
    return;
  }
  
  dialogueState.currentDialogue = jadecaMilestone2Dialogue;
  dialogueState.currentLine = 0;
  
  showJadecaDialogue();
}

// Switch Jadeca sub-tab
function switchJadecaSubTab(tabId) {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  jadecaState.currentSubTab = tabId;
  
  // Hide all sub-content
  document.querySelectorAll('.jadeca-sub-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // Show target sub-content
  const targetContent = document.getElementById(`jadeca${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Content`);
  if (targetContent) {
    targetContent.style.display = 'block';
  }
  
  // Update buttons
  document.querySelectorAll('.jadeca-sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  const targetBtn = document.getElementById(`jadeca${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Btn`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
  
  // Update UI
  if (tabId === 'hexing') {
    updateHexingUI();
  }
}

// Interact with Jadeca character (poke)
function interactWithJadeca() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  // Check if hex staff is enabled
  if (window.state.halloweenEvent.swandyCrusher && 
      window.state.halloweenEvent.swandyCrusher.hexStaff && 
      window.state.halloweenEvent.swandyCrusher.hexStaff.enabled) {
    
    // Unlock secret achievement for attempting to hex Jadeca
    if (typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('halloween_secret2');
    }
    
    const speechBubble = document.getElementById('jadecaSpeech');
    const jadecaImg = document.getElementById('jadecaCharacter');
    
    if (speechBubble && jadecaImg) {
      // Clear any existing timeout
      if (window.jadecaSpeechTimeout) {
        clearTimeout(window.jadecaSpeechTimeout);
      }
      
      const hexStaffQuotes = [
        "Oh? You think MY staff gives you power over ME? How naive.",
        "That's my Hex Staff you're wielding. Did you really think you could use it against its creator?",
        "Pointing my own creation at me? Bold. Stupid, but bold.",
        "The staff recognizes its true master. It won't obey you against me.",
        "You're holding that wrong. Also, it doesn't work on me. Nice try though.",
        "That staff is merely a tool I crafted for you. I'm the one who made it.",
        "Trying to hex the Hex Witch with her own staff? I admire the audacity, if not the intelligence.",
        "The staff trembles in your hands. It knows who its real master is.",
        "Did you forget who gave you that staff in the first place? It's useless against me.",
        "Careful with that. You might accidentally hex yourself even more. Wouldn't that be ironic?"
      ];
      
      const randomQuote = hexStaffQuotes[Math.floor(Math.random() * hexStaffQuotes.length)];
      speechBubble.textContent = randomQuote;
      speechBubble.style.display = 'block';
      speechBubble.classList.add('jadeca-poke-speech');
      jadecaImg.src = 'assets/icons/sinister jadeca speech.png';
      
      // Hide after 7 seconds
      window.jadecaSpeechTimeout = setTimeout(() => {
        speechBubble.style.display = 'none';
        speechBubble.classList.remove('jadeca-poke-speech');
        jadecaImg.src = 'assets/icons/halloween jadeca.png';
      }, 7000);
    }
    return;
  }
  
  // Easter egg: Check if anomaly resolver find mode is active
  if (window.anomalySystem && window.anomalySystem.findModeActive) {
    const speechBubble = document.getElementById('jadecaSpeech');
    const jadecaImg = document.getElementById('jadecaCharacter');
    
    if (speechBubble && jadecaImg) {
      // Clear any existing timeout
      if (window.jadecaSpeechTimeout) {
        clearTimeout(window.jadecaSpeechTimeout);
      }
      
      speechBubble.textContent = "Why are you pointing this TV remote at me for?";
      speechBubble.style.display = 'block';
      jadecaImg.src = 'assets/icons/halloween jadeca speech.png';
      
      // Hide after 7 seconds
      window.jadecaSpeechTimeout = setTimeout(() => {
        speechBubble.style.display = 'none';
        jadecaImg.src = 'assets/icons/halloween jadeca.png';
      }, 7000);
    }
    return; // Don't proceed with normal interaction
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  
  // No cooldown - can be clicked anytime
  jadecaState.character.totalInteractions++;
  
  // Show extra menacing poke speech
  showJadecaPokeSpeech();
}

// Show Jadeca poke speech bubble (extra menacing)
function showJadecaPokeSpeech() {
  const speechBubble = document.getElementById('jadecaSpeech');
  if (!speechBubble) return;
  
  // Clear any existing timeout
  if (window.jadecaPokeTimeout) {
    clearTimeout(window.jadecaPokeTimeout);
  }
  
  const randomQuote = jadecaPokeQuotes[Math.floor(Math.random() * jadecaPokeQuotes.length)];
  speechBubble.textContent = randomQuote;
  speechBubble.style.display = 'block';
  
  // Apply extra sinister styling
  speechBubble.classList.add('jadeca-poke-speech');
  
  // Update character image to sinister speaking version
  const jadecaImg = document.getElementById('jadecaCharacter');
  if (jadecaImg) {
    jadecaImg.src = 'assets/icons/sinister jadeca speech.png';
  }
  
  // Hide after 7 seconds
  window.jadecaPokeTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    speechBubble.classList.remove('jadeca-poke-speech');
    if (jadecaImg) {
      jadecaImg.src = 'assets/icons/halloween jadeca.png';
    }
  }, 7000);
}

// Show Jadeca speech bubble (auto speech - regular quotes)
function showJadecaSpeech() {
  const speechBubble = document.getElementById('jadecaSpeech');
  if (!speechBubble) return;
  
  // Clear any existing speech timeout to allow interruption
  if (window.jadecaSpeechTimeout) {
    clearTimeout(window.jadecaSpeechTimeout);
  }
  
  const randomQuote = jadecaQuotes[Math.floor(Math.random() * jadecaQuotes.length)];
  speechBubble.textContent = randomQuote;
  speechBubble.style.display = 'block';
  
  // Update character image to speaking version
  const jadecaImg = document.getElementById('jadecaCharacter');
  if (jadecaImg) {
    jadecaImg.src = 'assets/icons/halloween jadeca speech.png';
  }
  
  // Hide after 7 seconds
  window.jadecaSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    if (jadecaImg) {
      jadecaImg.src = 'assets/icons/halloween jadeca.png';
    }
  }, 7000);
}

// Auto speech system for Jadeca
function startJadecaAutoSpeech() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  
  // Clear any existing timer
  if (jadecaState.character.speechTimer) {
    clearInterval(jadecaState.character.speechTimer);
  }
  
  // Function to schedule next speech
  const scheduleNextSpeech = () => {
    const randomDelay = 15000 + Math.random() * 15000; // 15-30 seconds
    jadecaState.character.speechTimer = setTimeout(() => {
      if (window.state.halloweenEvent.currentSubTab === 'jadecasHut' && 
          window.state.halloweenEvent.jadeca.currentSubTab === 'hexing') {
        showJadecaSpeech();
      }
      scheduleNextSpeech(); // Schedule the next one
    }, randomDelay);
  };
  
  // Start the cycle
  scheduleNextSpeech();
}

function stopJadecaAutoSpeech() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  if (jadecaState.character.speechTimer) {
    clearTimeout(jadecaState.character.speechTimer);
    jadecaState.character.speechTimer = null;
  }
}

// Calculate Hexflux gain from current state
function calculateHexfluxGain() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const swandy = window.state.halloweenEvent.swandy;
  
  // Must have at least 1 billion swandy
  if (!swandy || swandy.lt(1e9)) {
    return new Decimal(0);
  }
  
  const S = swandy;
  const L = crusherState.level;
  
  // Global tuning constant C (default 1.0)
  const C = 1.0;
  
  // Curvature k (reduced to 1.3 for more linear scaling)
  const k = 1.3;
  
  // Calculate base: max(0, log10(S / 10^9))
  const base = Math.max(0, S.log10() - 9);
  
  // Calculate M: 1.3^max(1, L - 21)
  // This ensures at level 22, M = 1.3^1 = 1.3
  const M = Math.pow(1.3, Math.max(1, L - 21));
  
  // Calculate Hexflux: 1 + C * M * base^k (no flooring, keep as Decimal)
  // The +1 ensures you always get at least 1 hexflux when requirements are met
  const baseToK = Math.pow(base, k);
  const bonusHexflux = C * M * baseToK;
  const hexfluxRaw = 1 + bonusHexflux;
  
  return new Decimal(hexfluxRaw);
}

// Check if player can perform Hexion reset
function canPerformHexion() {
  const gain = calculateHexfluxGain();
  return gain.gt(0);
}

// Perform Hexion Ritual Animation
function performHexionRitualAnimation(onComplete) {
  // Create ritual overlay
  const ritualOverlay = document.createElement('div');
  ritualOverlay.id = 'hexionRitualOverlay';
  ritualOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.5s ease-out;
  `;
  
  // Create cauldron (green circular plate with purple rim)
  const cauldron = document.createElement('div');
  cauldron.style.cssText = `
    position: relative;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, #2d5016 0%, #1a3d0f 70%, #4a1570 100%);
    border-radius: 50%;
    border: 8px solid #6a1bb9;
    box-shadow: 0 0 40px rgba(106, 27, 185, 0.6), inset 0 0 30px rgba(45, 80, 22, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  // Create swandy image in center with orange border
  const swandyImg = document.createElement('img');
  swandyImg.src = 'assets/icons/swandy.png';
  swandyImg.style.cssText = `
    width: 120px;
    height: 120px;
    z-index: 10;
    border-radius: 12px;
    border: 4px solid #ff8c1a;
    box-shadow: 0 0 20px rgba(255, 140, 26, 0.8), 0 0 10px rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.3);
    padding: 5px;
  `;
  
  cauldron.appendChild(swandyImg);
  
  // Create container for hex signs (separate from cauldron)
  const signsContainer = document.createElement('div');
  signsContainer.style.cssText = `
    position: absolute;
    width: 700px;
    height: 700px;
    pointer-events: none;
  `;
  
  ritualOverlay.appendChild(signsContainer);
  ritualOverlay.appendChild(cauldron);
  document.body.appendChild(ritualOverlay);
  
  // Greek symbols for the hex signs
  const greekSymbols = ['ε', 'α', 'λ', 'ψ', 'η', 'ζ'];
  const hexSigns = [];
  const hexagonRadius = 280; // Increased from 200 to space signs further out
  
  // Create 6 hex signs in hexagon formation
  function createHexSign(index) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const angle = (Math.PI / 3) * index - Math.PI / 2; // Start from top
        const x = Math.cos(angle) * hexagonRadius;
        const y = Math.sin(angle) * hexagonRadius;
        
        // Create sign container
        const sign = document.createElement('div');
        sign.className = 'hex-sign';
        sign.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0);
          z-index: 10;
        `;
        
        // Animate the sign appearance
        setTimeout(() => {
          sign.style.transition = 'transform 0.5s ease-out';
          sign.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(360deg)`;
        }, 50);
        
        // Create circle background
        const circle = document.createElement('div');
        circle.style.cssText = `
          position: absolute;
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 50%;
          border: 4px solid #8b2bea;
          box-shadow: 0 0 25px rgba(139, 43, 234, 0.9);
        `;
        
        // Create symbol
        const symbol = document.createElement('div');
        symbol.textContent = greekSymbols[index];
        symbol.style.cssText = `
          position: relative;
          font-size: 42px;
          font-weight: bold;
          color: white;
          text-shadow: 
            -2px -2px 0 #8b2bea,
            2px -2px 0 #8b2bea,
            -2px 2px 0 #8b2bea,
            2px 2px 0 #8b2bea,
            0 0 15px #b967ff;
          z-index: 1;
        `;
        
        sign.appendChild(circle);
        sign.appendChild(symbol);
        signsContainer.appendChild(sign);
        hexSigns.push({ element: sign, x, y, angle });
        
        resolve();
      }, index * 500); // Changed from 300ms to 500ms for consistent delay
    });
  }
  
  // Create all signs sequentially
  async function createAllSigns() {
    // Create all sign promises at once, they'll execute based on their individual timeouts
    const signPromises = [];
    for (let i = 0; i < 6; i++) {
      signPromises.push(createHexSign(i));
    }
    // Wait for all signs to be created
    await Promise.all(signPromises);
  }
  
  // Draw lines connecting the signs in hexagon shape
  function drawHexagonLines() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      top: 0;
      left: 0;
      z-index: 5;
    `;
    
    // Calculate center position
    const centerX = 350; // Half of signsContainer width (700px)
    const centerY = 350; // Half of signsContainer height (700px)
    
    for (let i = 0; i < 6; i++) {
      const start = hexSigns[i];
      const end = hexSigns[(i + 1) % 6];
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      
      line.setAttribute('x1', centerX + start.x);
      line.setAttribute('y1', centerY + start.y);
      line.setAttribute('x2', centerX + end.x);
      line.setAttribute('y2', centerY + end.y);
      line.setAttribute('stroke', 'white');
      line.setAttribute('stroke-width', '3');
      line.style.cssText = `
        filter: drop-shadow(0 0 5px #8b2bea);
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: drawLine 1s ease-out forwards;
      `;
      
      svg.appendChild(line);
    }
    
    signsContainer.appendChild(svg);
  }
  
  // Make signs glow
  function glowSigns() {
    hexSigns.forEach((sign, index) => {
      setTimeout(() => {
        sign.element.style.animation = 'hexSignGlow 0.5s ease-in-out infinite alternate';
      }, index * 100);
    });
  }
  
  // Create spinning hexagons around swandy (3 layers)
  function createSpinningHexagon() {
    // First hexagon (medium size, full opacity, clockwise)
    const spinningHex1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spinningHex1.style.cssText = `
      position: absolute;
      width: 280px;
      height: 280px;
      animation: spinHexagon 2s linear infinite;
      opacity: 0;
      transition: opacity 0.5s ease-in;
      z-index: 20;
    `;
    
    const hexagon1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const points1 = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = 140 + Math.cos(angle) * 120;
      const y = 140 + Math.sin(angle) * 120;
      points1.push(`${x},${y}`);
    }
    hexagon1.setAttribute('points', points1.join(' '));
    hexagon1.setAttribute('fill', 'none');
    hexagon1.setAttribute('stroke', 'white');
    hexagon1.setAttribute('stroke-width', '5');
    hexagon1.style.cssText = 'filter: drop-shadow(0 0 20px #8b2bea);';
    
    spinningHex1.appendChild(hexagon1);
    cauldron.appendChild(spinningHex1);
    
    // Fade in first hexagon
    setTimeout(() => {
      spinningHex1.style.opacity = '1';
    }, 50);
    
    // Second hexagon (larger, dimmed, counter-clockwise) - appears 1 second later
    setTimeout(() => {
      const spinningHex2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      spinningHex2.style.cssText = `
        position: absolute;
        width: 340px;
        height: 340px;
        animation: spinHexagonReverse 3s linear infinite;
        opacity: 0;
        transition: opacity 0.5s ease-in;
        z-index: 20;
      `;
      
      const hexagon2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points2 = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = 170 + Math.cos(angle) * 150;
        const y = 170 + Math.sin(angle) * 150;
        points2.push(`${x},${y}`);
      }
      hexagon2.setAttribute('points', points2.join(' '));
      hexagon2.setAttribute('fill', 'none');
      hexagon2.setAttribute('stroke', 'white');
      hexagon2.setAttribute('stroke-width', '4');
      hexagon2.style.cssText = 'filter: drop-shadow(0 0 15px #8b2bea);';
      
      spinningHex2.appendChild(hexagon2);
      cauldron.appendChild(spinningHex2);
      
      // Fade in second hexagon
      setTimeout(() => {
        spinningHex2.style.opacity = '0.6';
      }, 50);
    }, 1000);
    
    // Third hexagon (smaller, most dimmed, clockwise) - appears 2 seconds after first
    setTimeout(() => {
      const spinningHex3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      spinningHex3.style.cssText = `
        position: absolute;
        width: 220px;
        height: 220px;
        animation: spinHexagon 2.5s linear infinite;
        opacity: 0;
        transition: opacity 0.5s ease-in;
        z-index: 20;
      `;
      
      const hexagon3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points3 = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = 110 + Math.cos(angle) * 90;
        const y = 110 + Math.sin(angle) * 90;
        points3.push(`${x},${y}`);
      }
      hexagon3.setAttribute('points', points3.join(' '));
      hexagon3.setAttribute('fill', 'none');
      hexagon3.setAttribute('stroke', 'white');
      hexagon3.setAttribute('stroke-width', '3');
      hexagon3.style.cssText = 'filter: drop-shadow(0 0 10px #8b2bea);';
      
      spinningHex3.appendChild(hexagon3);
      cauldron.appendChild(spinningHex3);
      
      // Fade in third hexagon
      setTimeout(() => {
        spinningHex3.style.opacity = '0.4';
      }, 50);
    }, 2000);
  }
  
  // Hex the swandy (transform to hexflux)
  function hexSwandy() {
    swandyImg.style.animation = 'hexTransform 2s ease-in-out';
    swandyImg.style.filter = 'drop-shadow(0 0 30px #b967ff) brightness(1.5)';
    
    setTimeout(() => {
      // Transform to hexflux
      swandyImg.src = 'assets/icons/hexflux.png';
      swandyImg.style.animation = 'hexfluxReveal 1s ease-out';
    }, 2000);
  }
  
  // Run the ritual sequence
  async function runRitualSequence() {
    // Step 1: Create all signs (3 seconds - 6 signs with 500ms delay each)
    await createAllSigns();
    
    // Step 2: Wait 1 second after sixth sign appears, then draw connecting lines
    await new Promise(resolve => setTimeout(resolve, 1000));
    drawHexagonLines();
    
    // Step 3: Wait for lines to finish drawing, then glow signs
    await new Promise(resolve => setTimeout(resolve, 1000));
    glowSigns();
    
    // Step 4: Create spinning hexagons (starts immediately, 3 hexagons appear over 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 500));
    createSpinningHexagon();
    
    // Step 5: Wait for all 3 hexagons to appear, then hex the swandy
    // Third hexagon appears at 2 seconds, wait another 2 seconds before transformation
    await new Promise(resolve => setTimeout(resolve, 4000));
    hexSwandy();
    
    // Step 6: Wait for transformation to complete, then fade out
    await new Promise(resolve => setTimeout(resolve, 3500));
    ritualOverlay.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    // Step 7: Remove overlay and call completion callback
    setTimeout(() => {
      document.body.removeChild(ritualOverlay);
      if (onComplete) onComplete();
    }, 500);
  }
  
  // Add required CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes hexSignAppear {
      0% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0) rotate(0deg); }
      100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1) rotate(360deg); }
    }
    
    @keyframes hexSignGlow {
      0% { filter: drop-shadow(0 0 10px rgba(185, 103, 255, 0.6)); }
      100% { filter: drop-shadow(0 0 30px rgba(185, 103, 255, 1)); }
    }
    
    @keyframes drawLine {
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes spinHexagon {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes spinHexagonReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    
    @keyframes hexTransform {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)); }
      50% { transform: scale(1.3); filter: drop-shadow(0 0 40px #b967ff) brightness(2); }
    }
    
    @keyframes hexfluxReveal {
      0% { transform: scale(0) rotate(0deg); opacity: 0; }
      50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
      100% { transform: scale(1) rotate(360deg); opacity: 1; }
    }
  `;
  
  if (!document.getElementById('hexionRitualStyles')) {
    style.id = 'hexionRitualStyles';
    document.head.appendChild(style);
  }
  
  // Start the sequence
  runRitualSequence();
}

// Perform Hexion reset
function performHexionReset() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const jadecaState = window.state.halloweenEvent.jadeca;
  const swandy = window.state.halloweenEvent.swandy;
  const crusherLevel = crusherState.level || 0;
  
  // Check requirements
  if (!swandy || swandy.lt(1e9) || crusherLevel < 22) {
    if (typeof showToast === 'function') {
      showToast('You need at least 1 billion Swandy and crusher level 22 to perform a Hexion reset!', 'error');
    }
    return;
  }
  
  // Close the modal first
  closeHexionModal();
  
  // Start the ritual animation
  performHexionRitualAnimation(() => {
    // This callback runs after the animation completes
    const hexfluxGain = calculateHexfluxGain();
    
    // Add hexflux (even if it's 0)
    jadecaState.hexflux = jadecaState.hexflux.add(hexfluxGain);
    jadecaState.hexionCount++;
  
  // Check and unlock hexomancy milestones based on crusher level at time of reset
  const currentLevel = crusherState.level;
  if (currentLevel >= 22 && !jadecaState.hexomancyMilestones.milestone1) {
    jadecaState.hexomancyMilestones.milestone1 = true;
  }
  if (currentLevel >= 35 && !jadecaState.hexomancyMilestones.milestone2) {
    jadecaState.hexomancyMilestones.milestone2 = true;
    
    // Trigger milestone 2 dialogue after a short delay
    setTimeout(() => {
      if (typeof startJadecaMilestone2Dialogue === 'function') {
        startJadecaMilestone2Dialogue();
      }
    }, 1000);
  }
  if (currentLevel >= 68 && !jadecaState.hexomancyMilestones.milestone3) {
    jadecaState.hexomancyMilestones.milestone3 = true;
  }
  
  // Reset Swandy
  window.state.halloweenEvent.swandy = new Decimal(0);
  
  // Reset Swandy Shards
  if (crusherState.score) {
    crusherState.score = new Decimal(0);
  }
  
  // Reset Crusher
  crusherState.level = 1;
  crusherState.combo = 0;
  crusherState.isComboActive = false;
  
  // Reset Crusher multipliers explicitly
  crusherState.multipliers.swandyProduction = new Decimal(1.3); // Level 1 base (1.3^1)
  crusherState.multipliers.scoreMultiplier = new Decimal(1.5);  // Level 1 base (1.5^1)
  
  // Reset Shattery buffs
  crusherState.resety.capMultiplier = new Decimal(1);
  crusherState.resety.productionMultiplier = new Decimal(1);
  crusherState.resety.shardsMultiplier = new Decimal(1);
  crusherState.resety.count = 0;
  crusherState.resety.highestLevelReached = 0;
  
  // Reset tree upgrades (all S upgrades except S20, all SH upgrades except SH13, all HSS upgrades persist)
  const treePurchasedUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
  if (treePurchasedUpgrades && typeof treePurchasedUpgrades === 'object') {
    const upgradesToKeep = ['break_in', 'second_half_key']; // S20 and SH13
    
    // Add all HSS upgrades to keep list (they persist through Hexion resets)
    Object.keys(treePurchasedUpgrades).forEach(upgradeId => {
      if (upgradeId.startsWith('hexed_shard_multi_')) {
        upgradesToKeep.push(upgradeId);
      }
    });
    
    // IMPORTANT: Hex progress persists through Hexion resets too!
    // Hex data in window.state.halloweenEvent.treeUpgrades.hexData is NOT cleared
    
    Object.keys(treePurchasedUpgrades).forEach(upgradeId => {
      if (!upgradesToKeep.includes(upgradeId)) {
        delete treePurchasedUpgrades[upgradeId];
      }
    });
  }
  
  // Hide Swandy Crusher tab (will reappear when S10 is purchased)
  window.state.halloweenEvent.swandyCrusherUnlocked = false;
  const crusherTab = document.getElementById('swandyCrusherTab');
  if (crusherTab) {
    crusherTab.style.display = 'none';
  }
  
  // Hide Swandy Shattery (will reappear when S11 is purchased)
  window.state.halloweenEvent.swandyResetyUnlocked = false;
  const resetyButton = document.getElementById('swandyResetyButton');
  if (resetyButton) {
    resetyButton.style.display = 'none';
  }
  
  // Switch to Tree of Horrors tab if currently on Swandy Crusher
  if (window.state.halloweenEvent.currentSubTab === 'swandyCrusher') {
    if (typeof switchHalloweenSubTab === 'function') {
      switchHalloweenSubTab('treeOfHorrors');
    }
  }
  
  // Re-initialize grid
  if (typeof initializeSwandyCrusherGrid === 'function') {
    initializeSwandyCrusherGrid();
  }
  if (typeof renderSwandyCrusherGrid === 'function') {
    renderSwandyCrusherGrid(true);
  }
  
  // Update all UIs
  if (typeof updateSwandyCrusherUI === 'function') {
    updateSwandyCrusherUI();
  }
  if (typeof updateHalloweenUI === 'function') {
    updateHalloweenUI();
  }
  if (typeof updateTreeOfHorrorsUI === 'function') {
    updateTreeOfHorrorsUI();
  }
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
  
  updateHexingUI();
  
  // Force update the UI one more time after a short delay to ensure all values are refreshed
  setTimeout(() => {
    if (typeof updateHalloweenUI === 'function') {
      updateHalloweenUI();
    }
  }, 100);
  
  }); // End of animation callback
}

// Open Hexion confirmation modal
function openHexionModal() {
  const modal = document.getElementById('hexionResetModal');
  if (modal) {
    updateHexionModalPreview();
    modal.style.display = 'flex';
  }
}

// Close Hexion confirmation modal
function closeHexionModal() {
  const modal = document.getElementById('hexionResetModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Update Hexion modal preview
function updateHexionModalPreview() {
  const hexfluxGain = calculateHexfluxGain();
  const previewElement = document.getElementById('hexionPreview');
  if (previewElement) {
    previewElement.textContent = DecimalUtils.formatDecimal(hexfluxGain);
  }
}

// Update Hexing UI
function updateHexingUI() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Calculate hexflux gain if hexion were performed now
  const hexfluxGain = calculateHexfluxGain();
  
  // Update Hexflux display with current amount and potential gain
  const hexfluxElement = document.getElementById('hexfluxCount');
  if (hexfluxElement) {
    const currentHexflux = DecimalUtils.formatDecimal(jadecaState.hexflux);
    const swandy = window.state.halloweenEvent.swandy;
    const crusherLevel = crusherState.level || 0;
    const meetsRequirements = swandy && swandy.gte(1e9) && crusherLevel >= 22;
    
    if (meetsRequirements && hexfluxGain.gte(0)) {
      const gainAmount = DecimalUtils.formatDecimal(hexfluxGain);
      hexfluxElement.textContent = `${currentHexflux} (+${gainAmount})`;
    } else {
      hexfluxElement.textContent = currentHexflux;
    }
  }
  
  // Update Reset Details display (formerly Next Milestone)
  const nextMilestoneLevelElement = document.getElementById('nextMilestoneLevel');
  const nextMilestoneProgressElement = document.getElementById('nextMilestoneProgress');
  const nextMilestoneSwandyElement = document.getElementById('nextMilestoneSwandy');
  
  if (nextMilestoneLevelElement && nextMilestoneProgressElement) {
    const currentLevel = crusherState.level || 0;
    
    // Define milestones (matching the ones in updateHexomancyMilestones)
    const milestones = [
      { level: 22, id: 'milestone1' },
      { level: 35, id: 'milestone2' },
      { level: 68, id: 'milestone3' }
    ];
    
    // Find next milestone - only show next milestone if previous ones are unlocked
    let nextMilestone = null;
    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];
      const isUnlocked = jadecaState.hexomancyMilestones[milestone.id];
      
      // If this milestone is not unlocked, it's the next one to work towards
      if (!isUnlocked) {
        nextMilestone = milestone.level;
        break;
      }
    }
    
    if (nextMilestone) {
      nextMilestoneLevelElement.textContent = `Next hexomancy milestone unlocks at crusher level ${nextMilestone}`;
      nextMilestoneProgressElement.textContent = `Crusher lvl ${currentLevel}/${nextMilestone}`;
    } else {
      nextMilestoneLevelElement.textContent = 'All hexomancy milestones unlocked!';
      nextMilestoneProgressElement.textContent = `Crusher lvl ${currentLevel}`;
    }
  }
  
  // Update Swandy display in Reset Details card
  if (nextMilestoneSwandyElement) {
    const swandy = window.state.halloweenEvent.swandy || new Decimal(0);
    nextMilestoneSwandyElement.textContent = DecimalUtils.formatDecimal(swandy);
  }
  
  // Update Hexion reset button
  const hexionBtn = document.getElementById('hexionResetBtn');
  const hexionGainElement = document.getElementById('hexionGain');
  
  const swandy = window.state.halloweenEvent.swandy;
  const crusherLevel = crusherState.level || 0;
  const hasEnoughSwandy = swandy && swandy.gte(1e9);
  const hasEnoughLevel = crusherLevel >= 22;
  const canReset = hasEnoughSwandy && hasEnoughLevel;
  
  if (hexionBtn) {
    hexionBtn.disabled = !canReset;
    hexionBtn.style.opacity = canReset ? '1' : '0.5';
    hexionBtn.style.cursor = canReset ? 'pointer' : 'not-allowed';
  }
  
  if (hexionGainElement) {
    if (canReset) {
      hexionGainElement.textContent = `Ready!`;
      hexionGainElement.style.color = '#66ff66';
    } else {
      hexionGainElement.textContent = 'You need 1 billion Swandy and a crusher lvl of 22 to be able to reset';
      hexionGainElement.style.color = '#ff6666';
    }
  }
  
  // Update hexomancy milestones display (placeholder for now)
  updateHexomancyMilestones();
}

// Calculate Hex generation rate per second
// Formula: G = 0.01 × F × (1 + log10(F + 1))^p
// where F = Hexflux, p = 1.25 (exponential curvature)
function calculateHexGenerationRate() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return new Decimal(0);
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  
  // Ensure hexflux is a Decimal
  if (!DecimalUtils.isDecimal(jadecaState.hexflux)) {
    jadecaState.hexflux = new Decimal(jadecaState.hexflux || 0);
  }
  
  const F = jadecaState.hexflux;
  
  if (F.lte(0)) {
    return new Decimal(0);
  }
  
  const baseRate = 0.01;
  const p = 1.25;
  
  // Calculate (1 + log10(F + 1))
  const logTerm = F.add(1).log10().add(1);
  
  // Calculate logTerm^p
  const exponentialTerm = logTerm.pow(p);
  
  // G = baseRate × F × exponentialTerm
  const generationRate = F.mul(baseRate).mul(exponentialTerm);
  
  return generationRate;
}

// Generate Hex currency over time (called from game tick)
function generateHex(deltaTime) {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  
  // Ensure hexflux is a Decimal
  if (!DecimalUtils.isDecimal(jadecaState.hexflux)) {
    jadecaState.hexflux = new Decimal(jadecaState.hexflux || 0);
  }
  
  if (jadecaState.hexflux.lte(0)) {
    return;
  }
  
  const genRate = calculateHexGenerationRate();
  const hexGained = genRate.mul(deltaTime);
  
  // Add to Hex currency
  if (!window.state.halloweenEvent.hex) {
    window.state.halloweenEvent.hex = new Decimal(0);
  }
  
  if (!DecimalUtils.isDecimal(window.state.halloweenEvent.hex)) {
    window.state.halloweenEvent.hex = new Decimal(window.state.halloweenEvent.hex || 0);
  }
  
  window.state.halloweenEvent.hex = window.state.halloweenEvent.hex.add(hexGained);
}

// Update hexomancy milestones display
function updateHexomancyMilestones() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const milestonesContainer = document.getElementById('hexomancyMilestones');
  
  if (!milestonesContainer) return;
  
  // Initialize milestones object if needed
  if (!jadecaState.hexomancyMilestones) {
    jadecaState.hexomancyMilestones = {};
  }
  
  // Define milestones with their requirements and effects
  const milestones = [
    {
      id: 'milestone1',
      tier: 1,
      requiredLevel: 22,
      effect: 'Unlock the ability to cast hexes to the tree of horrors upgrades, also place a hex on the swandy hardcap so it becomes a softcap, produce 2X more swandy and increase the swandy cap by X2 per milestone'
    },
    {
      id: 'milestone2',
      tier: 2,
      requiredLevel: 35,
      effect: 'Unlock the Hexflux (H) upgrade branch in the tree of horrors (wip), unlock the swandy breaker hex staff, and earn X2 more swandy shards per milestones starting at milestone 2 (also the end of halloween event part 2)'
    },
    {
      id: 'milestone3',
      tier: 3,
      requiredLevel: 68,
      effect: 'Unlock the hex of amplification (wip)'
    }
  ];
  
  const currentLevel = crusherState.level || 0;
  
  // IMPORTANT: Milestones should NOT be auto-unlocked here
  // They are only unlocked during performHexionReset()
  // This function only DISPLAYS the current milestone status
  
  // Count unlocked milestones
  let unlockedCount = 0;
  milestones.forEach(milestone => {
    if (jadecaState.hexomancyMilestones[milestone.id]) {
      unlockedCount++;
    }
  });
  
  // Build milestone display HTML
  let milestonesHTML = '';
  
  // Create table structure
  milestonesHTML += `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: rgba(185,103,255,0.2); border-bottom: 2px solid #8b2bea;">
          <th style="color: #ffcc66; padding: 10px; text-align: left; width: 20%;">Milestone</th>
          <th style="color: #ffcc66; padding: 10px; text-align: left; width: 60%;">Effect</th>
          <th style="color: #ffcc66; padding: 10px; text-align: center; width: 20%;">Status</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  milestones.forEach((milestone, index) => {
    const isUnlocked = jadecaState.hexomancyMilestones[milestone.id];
    const showMilestone = index === 0 || jadecaState.hexomancyMilestones[milestones[index - 1].id];
    
    if (showMilestone) {
      const statusColor = isUnlocked ? '#66ff66' : '#ff6666';
      const statusText = isUnlocked ? 'Unlocked' : 'Locked';
      const rowColor = isUnlocked ? 'rgba(102,255,102,0.1)' : 'rgba(255,102,102,0.1)';
      
      milestonesHTML += `
        <tr style="background: ${rowColor}; border-bottom: 1px solid rgba(139,43,234,0.3);">
          <td style="color: #ffaa77; padding: 12px; font-weight: bold;">Tier ${milestone.tier}</td>
          <td style="color: #d9b3ff; padding: 12px; font-style: italic;">${milestone.effect}</td>
          <td style="color: ${statusColor}; padding: 12px; text-align: center; font-weight: bold;">${statusText}</td>
        </tr>
      `;
    }
  });
  
  milestonesHTML += `
      </tbody>
    </table>
  `;
  
  // If no milestones are visible yet, show a placeholder
  if (unlockedCount === 0 && milestones.length > 0) {
    // First milestone is always visible
  }
  
  milestonesContainer.innerHTML = milestonesHTML;
}

// Initialize drag-and-drop for Jadeca to accept tokens
function initializeJadecaTokenDropZone() {
  const jadecaImg = document.getElementById('jadecaCharacter');
  if (!jadecaImg) return;
  
  // Make Jadeca's image a valid drop zone with visual feedback
  jadecaImg.addEventListener('mouseenter', (e) => {
    if (window._draggingToken && window._draggingTokenType) {
      // Visual feedback - add glow effect
      jadecaImg.style.filter = 'drop-shadow(0 0 20px rgba(138, 43, 226, 0.8)) brightness(1.2)';
    }
  });
  
  jadecaImg.addEventListener('mouseleave', (e) => {
    // Remove glow effect
    jadecaImg.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))';
  });
}

// Handle when a token is given to Jadeca
function handleTokenGivenToJadeca(tokenType, tokenElement) {
  if (!window.state || !window.state.halloweenEvent || !window.state.halloweenEvent.jadeca) {
    return;
  }
  // Jadeca's responses when shown tokens (she doesn't actually take them)
  const jadecaTokenResponses = {
    mushroom: "A mushroom? I suppose I could use this for a potion. Acceptable.",
    spark: "Sparks? Interesting. May I ask why you have these?",
    berry: "Berries. How... mundane. So you're a berry lover, birdyfrutigo.",
    petal: "Flower petals. These have some enchantment potential, I suppose.",
    water: "Mhh water.",
    prisma: "A prisma shard! Now THIS is useful for my experiments!",
    stardust: "Stardust?! This is EXCELLENT for hexcraft! You're learning, birdsterino.",
    swabucks: "Money? I have no use for your facility's currency. Keep it.",
    candy: "Candy? Really? I'm a HEX WITCH, not a child.",
    mushroomSoup: "Mushroom soup? Did you actually COOK something? Color me impressed, birdstedine.",
    battery: "A BATTERY?! What am I supposed to do with this, power a microwave?! I use MAGIC, you feathered fool!",
    chargedPrisma: "Ooh, a charged prisma! Someone's been learning about energy manipulation. Very nice.",
    glitteringPetal: "Glittering petals... These feels illegal.",
    berryPlate: "A berry plate? Fascinating. Kitchen magic meets hex witchcraft.",
    default: "What is this? I suppose it might be useful for something..."
  };
  
  // Get the appropriate response
  const response = jadecaTokenResponses[tokenType] || jadecaTokenResponses.default;

  
  // Make Jadeca speak the response
  const speechBubble = document.getElementById('jadecaSpeech');
  const jadecaImg = document.getElementById('jadecaCharacter');
  

  
  if (speechBubble && jadecaImg) {
    // Clear any existing timeout
    if (window.jadecaSpeechTimeout) {
      clearTimeout(window.jadecaSpeechTimeout);
    }
    
    speechBubble.textContent = response;
    speechBubble.style.display = 'block';
    jadecaImg.src = 'assets/icons/halloween jadeca speech.png';
    
    // Hide after 7 seconds
    window.jadecaSpeechTimeout = setTimeout(() => {
      speechBubble.style.display = 'none';
      jadecaImg.src = 'assets/icons/halloween jadeca.png';
    }, 7000);
  }
  
  // Don't actually collect tokens - just show them to Jadeca for her reaction
  // No tokens are consumed, Jadeca just comments on what she sees
  
  // Visual effect - sparkles around Jadeca (just for visual feedback, not collection)
  createJadecaCollectionEffect(jadecaImg);
}

// Create visual effect when Jadeca receives a token
function createJadecaCollectionEffect(jadecaImg) {
  if (!jadecaImg) return;
  
  const rect = jadecaImg.getBoundingClientRect();
  
  // Create multiple sparkle particles
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, #b967ff, #8b2bea);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      box-shadow: 0 0 10px #b967ff;
    `;
    
    document.body.appendChild(sparkle);
    
    // Animate sparkle
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const targetX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
    const targetY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
    
    sparkle.animate([
      { 
        transform: 'translate(0, 0) scale(1)', 
        opacity: 1 
      },
      { 
        transform: `translate(${targetX - (rect.left + rect.width / 2)}px, ${targetY - (rect.top + rect.height / 2)}px) scale(0)`, 
        opacity: 0 
      }
    ], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    };
  }
}

// Make functions globally accessible
window.switchJadecaSubTab = switchJadecaSubTab;
window.interactWithJadeca = interactWithJadeca;
window.showJadecaSpeech = showJadecaSpeech;
window.showJadecaPokeSpeech = showJadecaPokeSpeech;
window.jadecaPokeQuotes = jadecaPokeQuotes;
window.startJadecaAutoSpeech = startJadecaAutoSpeech;
window.stopJadecaAutoSpeech = stopJadecaAutoSpeech;
window.calculateHexfluxGain = calculateHexfluxGain;
window.canPerformHexion = canPerformHexion;
window.performHexionRitualAnimation = performHexionRitualAnimation;
window.performHexionReset = performHexionReset;
window.openHexionModal = openHexionModal;
window.closeHexionModal = closeHexionModal;
window.updateHexionModalPreview = updateHexionModalPreview;
window.updateHexingUI = updateHexingUI;
window.updateHexomancyMilestones = updateHexomancyMilestones;
window.initializeJadecaTokenDropZone = initializeJadecaTokenDropZone;
window.handleTokenGivenToJadeca = handleTokenGivenToJadeca;
window.calculateHexGenerationRate = calculateHexGenerationRate;
window.generateHex = generateHex;
window.startJadecaIntroDialogue = startJadecaIntroDialogue;
window.startJadecaMilestone2Dialogue = startJadecaMilestone2Dialogue;
window.showJadecaDialogue = showJadecaDialogue;
window.continueJadecaDialogue = continueJadecaDialogue;
window.closeJadecaDialogue = closeJadecaDialogue;

// Auto-start Jadeca speech on page load if already on the tab
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure state is loaded
  setTimeout(() => {
    if (window.state && 
        window.state.halloweenEvent && 
        window.state.halloweenEvent.currentSubTab === 'jadecasHut' &&
        window.state.halloweenEvent.jadeca &&
        window.state.halloweenEvent.jadeca.currentSubTab === 'hexing') {
      startJadecaAutoSpeech();
    }
  }, 1000);
});
