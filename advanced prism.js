let advancedPrismState = {
  unlocked: false,
  viSpeechActive: false,
  viSpeechTimeout: null,
  swariaSpechTimeout: null,
  viCurrentState: 'normal',
  viLastInteractionTime: 0,
  imagesSwapped: false,
  advancedTabClicks: 0,
  labTabClicks: 0,
  hasCompletedLabClicks: false,
  hasShownLabDialogue: false,
  resetLayer: {
    points: new Decimal(0),
    timesReset: new Decimal(0),
    canReset: false
  },
  calibration: {
    stable: {
      light: new Decimal(0),
      redlight: new Decimal(0),
      orangelight: new Decimal(0),
      yellowlight: new Decimal(0),
      greenlight: new Decimal(0),
      bluelight: new Decimal(0)
    },
    nerfs: {
      light: new Decimal(1),
      redlight: new Decimal(1),
      orangelight: new Decimal(1),
      yellowlight: new Decimal(1),
      greenlight: new Decimal(1),
      bluelight: new Decimal(1)
    },
    activeMinigame: null,
    minigameStartTime: 0,
    lastSaveTime: 0,
    lastSessionEfficiency: 1.0,
    sessionPenalty: {
      light: new Decimal(1.0),
      redlight: new Decimal(1.0),
      orangelight: new Decimal(1.0),
      yellowlight: new Decimal(1.0),
      greenlight: new Decimal(1.0),
      bluelight: new Decimal(1.0)
    },
    totalTimeAccumulated: {
      light: 0,
      redlight: 0,
      orangelight: 0,
      yellowlight: 0,
      greenlight: 0,
      bluelight: 0
    },
    waveFrequency: 1,
    optimalFrequency: 1,
    wavePhase: 0,
    lastAnimationTime: 0,
    minigameInterval: null,
    drainInterval: null
  }
};
window.advancedPrismState = advancedPrismState;
const viTokenPreferences = {
  likes: ['prisma', 'water'],
  dislikes: ['sparks'],
  neutral: ['berries', 'petals', 'mushroom', 'stardust']
};
const viSpeechPatterns = {
  greeting: [
    "Oh, it's you again... I suppose you want to mess with the advanced prism systems.",
    "Back to tinker with more complex light configurations? How... predictable.",
    "Another day, another researcher who thinks they can improve my work.",
    "You're here for the advanced lab, aren't you? *sigh* Fine.",
    "Welcome to the advanced section. Try not to break anything... again."
  ],
  tokenGive: {
    likes: [
      "Finally, something useful. I suppose this might actually help with my research.",
      "These prisma tokens and water are... adequate for my experiments.",
      "At least you brought something I can work with this time.",
      "Not terrible. I can use these for the advanced configurations."
    ],
    neutral: [
      "I guess these could be useful... maybe. We'll see.",
      "Another random token. I'll find some use for it, probably.",
      "Sure, just add it to the pile with everything else.",
      "These tokens are... fine, I suppose."
    ],
    dislikes: [
      "Sparks? Really? Do you even understand what I do here?",
      "This is completely useless for advanced prism research.",
      "Why would you even think I'd want this?",
      "*sigh* I'll take it, but don't expect miracles."
    ]
  },
  poke: [
    "Was that really necessary? I'm trying to work here. But I'll allow it...",
    "Please don't poke the researcher. I am not an exhibit.",
    "Do you mind? I have important calculations to finish.",
    "That's... annoying. Could you not?",
    "I'm not a pet. Please respect my personal space."
  ],
  sleeping: [
    "zzz... calculating light refraction patterns... zzz...",
    "zzz... why do they keep poking me... zzz...",
    "zzz... advanced prism theory... zzz...",
    "zzz... if I pretend to sleep maybe they'll leave me alone... zzz..."
  ],
  randomSpeech: [
    "The light spectrum calculations are getting more complex by the day...",
    "Sometimes I wonder if anyone actually understands my research.",
    "These prism calibrations need constant adjustment. It's exhausting.",
    "The refraction patterns today are... mildly interesting, I suppose.",
    "Another day, another light frequency to analyze.",
    "I should probably clean these prisms... eventually.",
    "The prisma resonance is off by 0.03%. Close enough.",
    "Working with light isn't as glamorous as people think.",
    "My tail makes sitting in lab chairs incredibly uncomfortable.",
    "These advanced configurations require more precision than most can handle.",
    "The light amplification is functioning within acceptable parameters.",
    "I miss when experiments didn't explode randomly.",
    "Sometimes I consider switching to a less volatile research field, but these anomalies sure are entertaining.",
    "The crystalline structure of this prism tail is both a blessing and a curse.",
    "You wanna know why I carry this light stick around? Its for safety, I need constant light shining against my tail's prism to survive.",
    "The night is terrifying without proper light sources.",
    "I hate the dark. I hate the dark. I hate the dark.",
    "Peaches, peaches, peaches-peaches-peaches! Peaches~",
    "I need to find a way to create the dark prism... But not now.",
    "To start creating the dark prism, the light spectrum must be perfectly balanced. Or else it might explode or something.",
    "I can also use this light stick as a distanceray tool. To keep you from constantly poking me.",
    "Yes I sleep with the lights on... It's a necessity for me.",
    "I wonder why I'm banned from doing sleep overs? Last time I remembered I forced the light switch to stay on for the night. I got kicked out of the sleepover lol.",
    "I really don't like the dark. It's scary.",
    "I prefer working alone. People are... unpredictable.",
    "If you hear screaming when the power goes out, it's probably me.",
    "the dark prism... I need it... I need it...",
    "Ever heard of the dark prism? It's a myth, but I'm trying to find a way to craft it, for my own good. But where do I even start...",
    "The dark prism would make me survive the darkness without needing constant light sources.",
    "I envy your ability to sleep in the dark. I can't.",
    "I have to wear these stupid sleeping masks to be able to sleep. So annoying.",
    "Sleeping is so hard if you have a prism on your tail like me.",
    "Am I sleep deprived? Yes. Do I care? Yes, Yes.",
    "I need constant light to survive. It's a curse being born with this prism on my tail.",
    "I have about 5 hours of time being in the darkness before I pass out from lack of light.",
    "Soap keeps asking me about my work. I don't think they'd understand.",
    "At least the lab is quieter than the cafeteria.",
    "These mathematical models never account for real-world chaos.",
    "I've been working on the same problem for weeks. Progress is... slow.",
    "The other workers think I'm antisocial. They're not wrong.",
    "This tail may look impressive, but try carrying it around all day.",
    "The light absorption rates are fluctuating again. Typical.",
    "Why does everyone assume I know everything about prisms?",
    "Working alone has its advantages. No one interrupts my calculations.",
    "The facility's power grid affects my equipment more than I'd like.",
    "I wonder what Lepre meant about 'bringing joy' to the facility...",
    "The prismatic frequencies are harmonizing nicely today. Rare.",
    "Sometimes I think about what life was like before this job.",
    "The crystalline formations in my tail respond to certain wavelengths.",
    "Research is 90% tedious calculations and 10% hoping nothing explodes.",
    "I should probably be more social, but honestly, why bother?",
    "The light filtration system needs recalibration. Again.",
    "Working with advanced optics requires patience most people lack.",
    "These prisms aren't just pretty crystals. They're sophisticated instruments.",
    "I've memorized every frequency in the visible spectrum. And several invisible ones.",
    "The lab temperature affects the precision of my measurements.",
    "Sometimes I catch my reflection in the prisms. It's... unsettling.",
    "The other researchers always want to collaborate. I prefer working solo.",
    "This prism tail isn't decorative. It's a highly sensitive optical instrument.",
    "The mathematical beauty of light refraction is lost on most people.",
    "I should probably document my findings better, but who would read them?",
    "The facility's expansion means more complex light management systems.",
    "These calibration procedures are mind-numbing, but necessary.",
    "I wonder if the others realize how complicated my work actually is.",
    "The prismatic resonance patterns are almost hypnotic sometimes.",
    "Research funding would be nice, but I make do with what I have.",
    "The light amplification chambers need constant monitoring.",
    "The crystalline structure of prisms is more complex than most people realize.",
    "I've lost count of how many experiments I've run this month.",
    "Yeah that's right, I've got antlers, you don't.",
    "The advanced prism systems require constant fine-tuning.",
    "I wonder if Swaria appreciates the complexity of my work...",
    "These light wavelengths behave differently than theoretical models predict.",
    "The prism array efficiency is improving, but slowly.",
    "Sometimes I wish I could just work without interruptions.",
    "The facility's other departments don't understand optical physics.",
    "My research could revolutionize light manipulation... if anyone cared.",
    "The crystalline matrix in my tail aches when the weather changes.",
    "Working with prismatic energy requires absolute precision.",
    "I should probably take more breaks, but the work is never finished.",
    "The light refraction coefficients are within margin of error... barely.",
    ...(window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 ? [
      "These dimensional anomalies are interfering with my light spectrum readings. Fascinating... and annoying.",
      "Great, now I have to recalibrate all my equipment because reality decided to have a breakdown.",
      "The anomalies seem to bend light in ways that shouldn't be physically possible. I need to study this.",
      "The cosmic instability is making my calculations completely unreliable. *sigh* Lets stabilize the light spectrum quicker.",
      "I've detected anomalous wavelengths that don't exist in any spectrum chart. I'm actually interested.",
      "The reality tears are creating prismatic effects I've never seen before. Science is so inconvenient sometimes.",
      "These dimensional fluctuations better not cause any darkness around here. I can't handle to have that.",
      "I've had a dream where my light stick turned into a wooden stick, I stayed up the entire night thinking about it.",
      "My research equipment keeps malfunctioning whenever an anomaly passes through. Typical.",
      "I've been documenting the anomalous light patterns. The data is... unexpectedly beautiful.",
      "I wonder if I could harness anomalous energy for my dark prism research... Worth investigating.",
      "These reality distortions are like broken prisms - refracting everything incorrectly. Annoying but educational.",
      "The dimensional instability is affecting my tail's prism. I saw it start refracting ultraviolet.",
      "My light stick seems to destabilize nearby anomalies. I guess I could help getting rid of anomalies.",
      "I tried to measure an anomaly with my equipment. It just... disappeared. Rude.",
      "These cosmic disruptions are making me reconsider everything I know about optical physics."
    ] : [])
  ],
  swappedToMainPrism: [
    "So this is your usual standing spot huh. Don't mind me borrowing it. You can go munch on MY PRISM SHARD all you want in the other room.",
    "The equipements here seems to be working just fine in my absence, thx for taking care of it Peachy.",
    "Yeah that's right, I'm in your spot now. How do you like it?",
    "Why am I here instead of in my advanced lab? Cuz i feel like it. It's been a while since I was stuck in the other room. Thx to the Swa elite for trapping me in there by installing this mini door while I was asleep.",
    "I'm glad the prism projections is still functioning. if it wasn't you would not be able to collect any lights.",
    "You wanna know how you've been able to collect all this light? It's simple really, I've been monitoring the light wavelengths and adjusting the prism's rays to go through this window, which creates the lights you've been collecting.",
    "Hello there Peachy, don't worry this is not an anomaly, I'm simply checking out the equipements in this room to make sure everything works fine",
    "I see you've been busy collecting light while I've been away. Good job.",
    "Peachy... You left some crumbs on the console here. Typical. At least you keep the equipment functional.",
    "Peachy, are these boxes yours? How did these get here?",
    "At least from this position I can monitor the entire light collection system more effectively.",
    "Your workspace organization is... surprisingly not terrible. I expected worse from you tbh.",
    "I could get used to this spot. The lighting is the same as in my lab.",
    "Thx to you, I can finally explore the facility without being stuck in that advanced prism lab all day.",
    "I'll make sure to explore more of the facility's departments on my break time, you've expanded the facility quite a lot with what I've seen.",
    "I've finally been able to meet some of the other department workers. Soap was ecstatic to see me again. Tico was really friendly, a bit too friendly... Lepre was glad to see me again as they gave me many tokens. Fluzzer actually scares me despite their soft demeanor, they just grinned at me for a minute straight. I've not met the tired one yet, I don't really know how to get to Lethargy's department, all I know is it's underground. And that Mystic one seems a bit... off.",
  ]
};
function isViSleepTime() {
  if (!window.daynight || typeof window.daynight.getTime !== 'function') {
    return false;
  }
  const gameMinutes = window.daynight.getTime();
  const hours = Math.floor(gameMinutes / 60) % 24;
  return hours >= 22 || hours < 6;
}
function updateViCharacterImage() {
  let normalImg, talkingImg, sleepingImg, sleepTalkingImg;
  if (advancedPrismState.imagesSwapped) {
    normalImg = document.getElementById('viCharacterNormalInMain');
    talkingImg = document.getElementById('viCharacterTalkingInMain');
    sleepingImg = document.getElementById('viCharacterSleepingInMain');
    sleepTalkingImg = document.getElementById('viCharacterSleepTalkingInMain');
  } else {
    normalImg = document.getElementById('viCharacterNormal');
    talkingImg = document.getElementById('viCharacterTalking');
    sleepingImg = document.getElementById('viCharacterSleeping');
    sleepTalkingImg = document.getElementById('viCharacterSleepTalking');
  }
  if (!normalImg || !talkingImg || !sleepingImg || !sleepTalkingImg) {
    return;
  }
  normalImg.style.display = 'none';
  talkingImg.style.display = 'none';
  sleepingImg.style.display = 'none';
  sleepTalkingImg.style.display = 'none';
  const isNightTime = isViSleepTime();
  const isSpeaking = advancedPrismState.viSpeechActive;
  if (isNightTime) {
    if (isSpeaking) {
      sleepTalkingImg.style.display = 'block';
      advancedPrismState.viCurrentState = 'sleepTalking';
    } else {
      sleepingImg.style.display = 'block';
      advancedPrismState.viCurrentState = 'sleeping';
    }
  } else {
    if (isSpeaking) {
      talkingImg.style.display = 'block';
      advancedPrismState.viCurrentState = 'talking';
    } else {
      normalImg.style.display = 'block';
      advancedPrismState.viCurrentState = 'normal';
    }
  }
}
function showViSpeech(message, duration = 8000) {
  let speechBubble, speechText;
  if (advancedPrismState.imagesSwapped) {
    speechBubble = document.getElementById('speechBubble');
    speechText = speechBubble ? speechBubble.querySelector('.speech-text') : null;
  } else {
    speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
    speechText = document.getElementById('viAdvancedPrismSpeechText');
  }
  if (!speechBubble || !speechText) {
    return;
  }
  if (advancedPrismState.viSpeechTimeout) {
    clearTimeout(advancedPrismState.viSpeechTimeout);
  }
  speechText.textContent = message;
  speechBubble.style.display = 'block';
  advancedPrismState.viSpeechActive = true;
  updateViCharacterImage();
  advancedPrismState.viSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    advancedPrismState.viSpeechActive = false;
    updateViCharacterImage();
  }, duration);
}
function pokeMainPrismCharacter() {
  if (!advancedPrismState.imagesSwapped) {
    pokeSwariaCharacter();
  } else {
    pokeViWithMainSpeechBubble();
  }
}
function pokeViWithMainSpeechBubble() {
  const now = Date.now();
  if (window.friendship && window.friendship.addPoints) {
    window.friendship.addPoints('vi', new Decimal(0.5));
  }
  const isNightTime = isViSleepTime();
  if (advancedPrismState.imagesSwapped) {
    if (isNightTime) {
      const sleepMessage = viSpeechPatterns.sleeping[Math.floor(Math.random() * viSpeechPatterns.sleeping.length)];
      showViInMainPrismSpeech(sleepMessage, 5000);
    } else {
      const swapMessage = viSpeechPatterns.swappedToMainPrism[Math.floor(Math.random() * viSpeechPatterns.swappedToMainPrism.length)];
      showViInMainPrismSpeech(swapMessage, 5000);
    }
    advancedPrismState.viLastInteractionTime = now;
    return;
  }
  if (!isNightTime && Math.random() < 0.3) {
    const randomMessage = viSpeechPatterns.randomSpeech[Math.floor(Math.random() * viSpeechPatterns.randomSpeech.length)];
    showViInMainPrismSpeech(randomMessage, 5000);
    advancedPrismState.viLastInteractionTime = now;
    return;
  }
  if (!isNightTime && Math.random() < 0.2) {
    const prismPotentialExplanations = [
      "Prism Potential is the product of all your light types multiplied together! The more balanced your collection, the higher it grows.",
      "Did you know? Prism Potential is calculated by multiplying all light amounts: White X Red X Orange X Yellow X Green X Blue. Even having zero of one type makes it work!",
      "The secret to massive Prism Potential is balance. You need some of every light type, not just focusing on one color.",
      "Prism Potential grows exponentially when you develop all light types equally. It's the key to upgrading the Prism Core!",
      "Think of Prism Potential like a crystal's harmony - all wavelengths must resonate together to achieve true power."
    ];
    const explanation = prismPotentialExplanations[Math.floor(Math.random() * prismPotentialExplanations.length)];
    showViInMainPrismSpeech(explanation, 6000);
    advancedPrismState.viLastInteractionTime = now;
    return;
  }
  let messages;
  if (isNightTime) {
    messages = viSpeechPatterns.sleeping;
  } else {
    messages = viSpeechPatterns.poke;
  }
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  showViInMainPrismSpeech(randomMessage, 5000);
  advancedPrismState.viLastInteractionTime = now;
}
function pokeAdvancedPrismCharacter() {
  if (!advancedPrismState.imagesSwapped) {
    const now = Date.now();
    const timeSinceLastInteraction = now - advancedPrismState.viLastInteractionTime;
    if (window.friendship && window.friendship.addPoints) {
      window.friendship.addPoints('vi', new Decimal(0.5));
    }
    const isNightTime = isViSleepTime();
    if (!isNightTime && Math.random() < 0.3) {
      const randomMessage = viSpeechPatterns.randomSpeech[Math.floor(Math.random() * viSpeechPatterns.randomSpeech.length)];
      showViSpeech(randomMessage, 4000);
      advancedPrismState.viLastInteractionTime = now;
      return;
    }
    if (!isNightTime && Math.random() < 0.2) {
      const prismPotentialExplanations = [
        "Prism Potential is the product of all your light types multiplied together! The more balanced your collection, the higher it grows.",
        "Did you know? Prism Potential is calculated by multiplying all light amounts: White X Red X Orange X Yellow X Green X Blue. Even having zero of one type makes it work!",
        "The secret to massive Prism Potential is balance. You need some of every light type, not just focusing on one color.",
        "Prism Potential grows exponentially when you develop all light types equally. It's the key to upgrading the Prism Core!",
        "Think of Prism Potential like a crystal's harmony - all wavelengths must resonate together to achieve true power."
      ];
      const explanation = prismPotentialExplanations[Math.floor(Math.random() * prismPotentialExplanations.length)];
      showViSpeech(explanation, 6000);
      advancedPrismState.viLastInteractionTime = now;
      return;
    }
    let messages;
    if (isNightTime) {
      messages = viSpeechPatterns.sleeping;
    } else {
      messages = viSpeechPatterns.poke;
    }
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showViSpeech(randomMessage, 3000);
    advancedPrismState.viLastInteractionTime = now;
  } else {
    pokeSwariaWithAdvancedSpeechBubble();
  }
}
function pokeSwariaWithAdvancedSpeechBubble() {
  if (window.friendship && window.friendship.addPoints) {
    window.friendship.addPoints('swaria', new Decimal(0.5));
  }
  const randomResponse = swariaAdvancedPrismResponses[Math.floor(Math.random() * swariaAdvancedPrismResponses.length)];
  showSwariaCharacterSpeech(randomResponse, 5000);
}
function showSwariaCharacterSpeech(message, duration = 4000) {
  let speechBubble, speechText;
  if (advancedPrismState.imagesSwapped) {
    speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
    speechText = document.getElementById('viAdvancedPrismSpeechText');
  } else {
    speechBubble = document.getElementById('speechBubble');
    speechText = speechBubble ? speechBubble.querySelector('.speech-text') : null;
  }
  if (!speechBubble || !speechText) {
    return;
  }
  if (advancedPrismState.swariaSpechTimeout) {
    clearTimeout(advancedPrismState.swariaSpechTimeout);
  }
  speechText.textContent = message;
  speechBubble.style.display = 'block';
  advancedPrismState.swariaSpechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
  }, duration);
}
function showViInMainPrismSpeech(message, duration = 4000) {
  const speechBubble = document.getElementById('prismSpeech');
  if (!speechBubble) {
    return;
  }
  if (message.includes("I've finally been able to meet some of the other department workers")) {
    duration = 20000;
  }
  if (advancedPrismState.viSpeechTimeout) {
    clearTimeout(advancedPrismState.viSpeechTimeout);
  }
  advancedPrismState.viSpeechActive = true;
  updateViCharacterImage();
  speechBubble.textContent = message;
  speechBubble.style.display = 'block';
  speechBubble.classList.add('show');
  advancedPrismState.viSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
    speechBubble.classList.remove('show');
    advancedPrismState.viSpeechActive = false;
    updateViCharacterImage();
  }, duration);
}
const swariaCharacterResponses = [
  "Swaria",
];
const swariaAdvancedPrismResponses = [
  "Vhi took mhy ushual shpot in the prishm lab, sho I'll take their shpot here!",
  "I should probably take thish prishm shard out of mhy mouth at thish point... Nah, itsh a tradition at thish point hehe.",
  "Sho thish ish what Vhi hash been doing all thish time... intereshting.",
  "Theresh a lot of compleksh equipment here. Vhi musht be really shmart.",
  "Sho the prishm ish that powerful? I never knew Vhi had to keep calibrating it. I wonder what happenshs we don't calibrate it?",
  "I hope Vhi doeshnt mind me borrowing their workshpace for a bit.",
  "Thish lab shetup ish way more advanshd than what I'm ushd to.",
  "Sho calibrating the light shpektrum alsho hash negative effektsh? At leasht the poshitive effektsh are really good.",
  "The fluff fashility ish ekspanding nishly.",
  "Why did I poke myshelf? Thatsh... weird!",
  "Thish advanshd lab shetup ish aktually pretty cool! Vhi hash good tashte.",
  "I'm learning sho mush about advanshd prishm theory jusht by being here!",
  "Hmm, Vhish workshpace ish more organishd than I ekspekted.",
  "I wonder if I kan help improve theshe advanshd kalibrationsh?",
  "The view from the advanshd lab ish really nishe!",
  "I should ashk Vhi about theshe kompleksh equationsh when they get bak.",
  "Being in the advanshd shekshion makesh me feel sho shientifik!",
  "Theshe advanshd prishms are even more beautiful up kloshe!",
  "I feel like I'm getting shmarter jusht shtanding here!",
  "Theresh shome dokumentsh here about the dark prishm...? What ish that about?",
  "Maybe I should leave a thank you note for Vhi?"
];
function pokeSwariaCharacter() {
  const randomResponse = swariaCharacterResponses[Math.floor(Math.random() * swariaCharacterResponses.length)];
  showSwariaCharacterSpeech(randomResponse, 5000);
  if (window.friendship && window.friendship.addPoints) {
    window.friendship.addPoints('swaria', new Decimal(0.5));
  }
}
function resetImageSwapState() {
  if (advancedPrismState.imagesSwapped) {
    advancedPrismState.imagesSwapped = false;
    moveImagesToOriginalPositions();
    updateViCharacterImage();
    setupSwariaCharacterOverrides();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}
function pokeVi() {
  pokeAdvancedPrismCharacter();
}
function showSwariaInAdvancedSpeech(message, duration = 4000) {
  const speechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
  const speechText = document.getElementById('viAdvancedPrismSpeechText');
  if (!speechBubble || !speechText) {
    return;
  }
  if (advancedPrismState.viSpeechTimeout) {
    clearTimeout(advancedPrismState.viSpeechTimeout);
  }
  speechText.textContent = message;
  speechBubble.style.display = 'block';
  advancedPrismState.viSpeechTimeout = setTimeout(() => {
    speechBubble.style.display = 'none';
  }, duration);
}
function showAdvancedPrismViResponse(responseText) {
  showViSpeech(responseText, 4000);
}
function showAdvancedPrismViSpeech(tokenType) {
  let customResponse = 'Thanks for the token.';
  if (viTokenPreferences.likes.includes(tokenType)) {
    const responses = viSpeechPatterns.tokenGive.likes;
    customResponse = responses[Math.floor(Math.random() * responses.length)];
  } else if (viTokenPreferences.dislikes.includes(tokenType)) {
    const responses = viSpeechPatterns.tokenGive.dislikes;
    customResponse = responses[Math.floor(Math.random() * responses.length)];
  } else if (viTokenPreferences.neutral.includes(tokenType)) {
    const responses = viSpeechPatterns.tokenGive.neutral;
    customResponse = responses[Math.floor(Math.random() * responses.length)];
  }
  showViSpeech(customResponse, 4000);
}
window.showAdvancedPrismViResponse = showAdvancedPrismViResponse;
window.showAdvancedPrismViSpeech = showAdvancedPrismViSpeech;
window.pokeSwariaCharacter = pokeSwariaCharacter;
window.showSwariaCharacterSpeech = showSwariaCharacterSpeech;
window.pokeMainPrismCharacter = pokeMainPrismCharacter;
window.pokeAdvancedPrismCharacter = pokeAdvancedPrismCharacter;
window.pokeViWithMainSpeechBubble = pokeViWithMainSpeechBubble;
window.pokeSwariaWithAdvancedSpeechBubble = pokeSwariaWithAdvancedSpeechBubble;
window.respondCharacter = pokeSwariaCharacter;
let viRandomSpeechTimer = null;
function startViRandomSpeechTimer() {
  if (viRandomSpeechTimer) {
    clearTimeout(viRandomSpeechTimer);
  }
  if (isViSleepTime()) {
    return;
  }
  if (advancedPrismState.imagesSwapped) {
    return;
  }
  if (!boughtElements || !boughtElements[25]) {
    return;
  }
  const randomDelay = Math.random() * 25000 + 20000;
  viRandomSpeechTimer = setTimeout(() => {
    if (!isViSleepTime() && !advancedPrismState.imagesSwapped && boughtElements && boughtElements[25]) {
      showViRandomSpeech();
    } else {
    }
    startViRandomSpeechTimer();
  }, randomDelay);
}
function stopViRandomSpeechTimer() {
  if (viRandomSpeechTimer) {
    clearTimeout(viRandomSpeechTimer);
    viRandomSpeechTimer = null;
  } else {
  }
}
function showViRandomSpeech() {
  if (advancedPrismState.viSpeechActive) {
    return;
  }
  let speechArray;
  if (isViSleepTime()) {
    speechArray = viSpeechPatterns.sleeping;
  } else {
    speechArray = viSpeechPatterns.randomSpeech;
  }
  const randomMessage = speechArray[Math.floor(Math.random() * speechArray.length)];
  if (advancedPrismState.imagesSwapped) {
    showSwariaCharacterSpeech(randomMessage, 5000);
  } else {
    showViSpeech(randomMessage, 5000);
  }
}
function showViLabDialogue() {
  if (advancedPrismState.hasShownLabDialogue) {
    return;
  }
  if (!boughtElements || !boughtElements[25]) {
    return;
  }
  const labDialogueMessage = "You seriously blown up the door? That was your epic solution? I must say, that was really epic! I'm finally free from this room thanks to you! I owe you eternal gratitude peachy!";
  advancedPrismState.hasShownLabDialogue = true;
  if (typeof saveGame === 'function') {
    saveGame();
  }
  showViSpeech(labDialogueMessage, 20000);
}
window.startViRandomSpeechTimer = startViRandomSpeechTimer;
window.stopViRandomSpeechTimer = stopViRandomSpeechTimer;
window.showViRandomSpeech = showViRandomSpeech;
window.showViLabDialogue = showViLabDialogue;
function setupViRandomSpeechTabHooks() {
  if (typeof window.switchHomeSubTab === 'function' && !window._origSwitchHomeSubTabForVi) {
    window._origSwitchHomeSubTabForVi = window.switchHomeSubTab;
    window.switchHomeSubTab = function(subTabId) {
      window._origSwitchHomeSubTabForVi.apply(this, arguments);
      if (boughtElements && boughtElements[25] && !isViSleepTime()) {
        setTimeout(() => {
          if (!viRandomSpeechTimer) {
            startViRandomSpeechTimer();
          }
        }, 100);
      }
    };
  }
}
setupViRandomSpeechTabHooks();
function initializeViRandomSpeech() {
  if (boughtElements && boughtElements[25] && !isViSleepTime() && !viRandomSpeechTimer) {
    startViRandomSpeechTimer();
  }
}
setTimeout(initializeViRandomSpeech, 2000);
let hookAttempts = 0;
const maxHookAttempts = 20;
function attemptButtonHook() {
  hookAttempts++;
  const success = addClickCounterToAdvancedButton();
  if (success) {
    return true;
  } else if (hookAttempts < maxHookAttempts) {
    setTimeout(attemptButtonHook, 500);
  } else {
  }
  return false;
}
setTimeout(attemptButtonHook, 100);
window.testViRandomSpeech = function() {
  showViRandomSpeech();
};
window.testViSpeechTimer = function() {
  startViRandomSpeechTimer();
};
window.testViLabDialogue = function() {
  showViLabDialogue();
};
window.resetViLabDialogue = function() {
  advancedPrismState.hasShownLabDialogue = false;
  if (typeof saveGame === 'function') {
    saveGame();
  }
};
window.checkViLabDialogueStatus = function() {
  return {
    hasShown: advancedPrismState.hasShownLabDialogue,
    element25Bought: !!(boughtElements && boughtElements[25]),
    canShow: !!(boughtElements && boughtElements[25] && !advancedPrismState.hasShownLabDialogue)
  };
};
window.forceSaveViLabDialogueFlag = function() {
  if (typeof saveGame === 'function') {
    saveGame();
  } else {
  }
};
window.testAdvancedPrismButtonClick = function() {
  const prismAdvancedBtn = document.getElementById('prismAdvancedBtn');
  if (prismAdvancedBtn) {
    prismAdvancedBtn.click();
  } else {
  }
};
window.manualStartViTimer = function() {
  advancedPrismState.unlocked = true;
  startViRandomSpeechTimer();
  setTimeout(() => {
    checkViRandomSpeechTimer();
  }, 1000);
};
window.forceSetupAdvancedButtonHook = function() {
  const result = addClickCounterToAdvancedButton();
  const btn = document.getElementById('prismAdvancedBtn');
  if (btn) {
  }
  return result;
};
window.directStartTimer = function() {
  advancedPrismState.unlocked = true;
  const prismTab = document.getElementById('prismSubTab');
  const isOnPrismTab = prismTab && prismTab.style.display !== 'none';
  const advancedBtn = document.getElementById('prismAdvancedBtn');
  if (advancedBtn) {
    advancedBtn.classList.add('active');
    window.currentPrismSubTab = 'advanced';
    const mainBtn = document.getElementById('prismMainBtn');
    if (mainBtn) {
      mainBtn.classList.remove('active');
    }
    const advancedArea = document.getElementById('prismAdvancedArea');
    const mainArea = document.getElementById('prismMainArea');
    if (advancedArea) advancedArea.style.display = 'block';
    if (mainArea) mainArea.style.display = 'none';
  }
  startViRandomSpeechTimer();
  setTimeout(() => {
    checkViRandomSpeechTimer();
  }, 1000);
};
window.checkViRandomSpeechTimer = function() {
  return {
    timerActive: !!viRandomSpeechTimer,
    isSleepTime: isViSleepTime(),
    element25Bought: !!(boughtElements && boughtElements[25]),
    shouldRun: !!(boughtElements && boughtElements[25] && !isViSleepTime())
  };
};
window.testSimpleViTimer = function() {
  const status = checkViRandomSpeechTimer();
  if (status.shouldRun && !status.timerActive) {
    startViRandomSpeechTimer();
  } else if (status.timerActive) {
  } else {
    if (!status.element25Bought) {
    }
    if (status.isSleepTime) {
    }
  }
};
function setupSwariaCharacterOverrides() {
  if (window.showSwariaPrismSpeech && !window._originalShowSwariaPrismSpeech) {
    window._originalShowSwariaPrismSpeech = window.showSwariaPrismSpeech;
    window.showSwariaPrismSpeech = function() {
      if (!advancedPrismState.imagesSwapped) {
        window._originalShowSwariaPrismSpeech();
      }
    };
  }
  const prismCharacter = document.getElementById('prismCharacter');
  if (prismCharacter && !prismCharacter.hasAttribute('data-click-setup')) {
    prismCharacter.setAttribute('data-click-setup', 'true');
    prismCharacter.style.cursor = 'pointer';
    prismCharacter.addEventListener('click', function() {
      pokeMainPrismCharacter();
    });
  }
}
function setupSubTabResetHooks() {
  const subTabButtons = [
    { id: 'cargoSubTabBtn', name: 'Cargo' },
    { id: 'generatorsSubTabBtn', name: 'Generators' },
    { id: 'boutiqueSubTabBtn', name: 'Boutique' }
  ];
  subTabButtons.forEach(({ id, name }) => {
    const button = document.getElementById(id);
    if (button && !button.hasAttribute('data-swap-reset-hooked')) {
      const originalOnClick = button.onclick;
      button.onclick = function() {
        resetImageSwapState();
        if (originalOnClick) {
          originalOnClick.call(this);
        }
      };
      button.setAttribute('data-swap-reset-hooked', 'true');
    } else if (!button) {
    }
  });
}
function hookIntoTokenSystem() {
  if (window.showGiveTokenModal && !window._originalShowGiveTokenModal) {
    window._originalShowGiveTokenModal = window.showGiveTokenModal;
    window.showGiveTokenModal = function(tokenType, characterName) {
      if (characterName === 'Vi') {
        window._lastGivenTokenType = tokenType;
      }
      return window._originalShowGiveTokenModal(tokenType, characterName);
    };
  }
}
function ensureModalInBody() {
  const modal = document.getElementById('calibrationModal');
  if (modal && modal.parentNode !== document.body) {
    document.body.appendChild(modal);
  }
}
function openCalibrationMinigame(lightType) {
  const cardEl = document.querySelector(`[data-light-type="${lightType}"]`);
  if (cardEl && cardEl.classList.contains('disabled')) {
    if (window.showViSpeech) {
      const lightTypeNames = {
        light: 'pure light',
        redlight: 'red light',
        orangelight: 'orange light',
        yellowlight: 'yellow light',
        greenlight: 'green light',
        bluelight: 'blue light'
      };
      showViSpeech(`You need some ${lightTypeNames[lightType] || lightType} to calibrate the spectrum!`, 3000);
    }
    return;
  }
  ensureModalInBody();
  const modal = document.getElementById('calibrationModal');
  const title = document.getElementById('calibrationTitle');
  if (!modal || !title) return;
  if (!window.prismState || !window.prismState[lightType] || window.prismState[lightType].lte(0)) {
    if (window.showViSpeech) {
      const lightTypeNames = {
        light: 'pure light',
        redlight: 'red light',
        orangelight: 'orange light',
        yellowlight: 'yellow light',
        greenlight: 'green light',
        bluelight: 'blue light'
      };
      showViSpeech(`You need some ${lightTypeNames[lightType] || lightType} to calibrate the spectrum!`, 3000);
    }
    return;
  }
  advancedPrismState.calibration.activeMinigame = lightType;
  const lightTypeNames = {
    light: 'Stable Light',
    redlight: 'Red Stable Light',
    orangelight: 'Orange Stable Light',
    yellowlight: 'Yellow Stable Light',
    greenlight: 'Green Stable Light',
    bluelight: 'Blue Stable Light'
  };
  title.textContent = `${lightTypeNames[lightType]} Spectrum Calibration`;
  document.getElementById('calibrationStableLightLabel').textContent = lightTypeNames[lightType];
  advancedPrismState.calibration.waveFrequency = 1;
  advancedPrismState.calibration.optimalFrequency = Math.random() * 0.99 + 0.01;
  document.getElementById('frequencyDisplay').textContent = '1.00';
  const currentStableLight = advancedPrismState.calibration.stable[lightType];
  let stableDisplayText;
  if (currentStableLight.gte(1000)) {
    stableDisplayText = formatNumber(currentStableLight);
  } else {
    stableDisplayText = currentStableLight.toFixed(1);
  }
  document.getElementById('calibrationStableLight').textContent = stableDisplayText;
  const accumulatedTime = advancedPrismState.calibration.totalTimeAccumulated[lightType] || 0;
  document.getElementById('calibrationTime').textContent = accumulatedTime.toFixed(1);
  const timeMultiplier = Math.pow(1.2, accumulatedTime / 1);
  document.getElementById('calibrationTimeMultiplier').textContent = `x${timeMultiplier.toFixed(1)}`;
  const diminishingReturnsEl = document.getElementById('calibrationDiminishingReturns');
  if (diminishingReturnsEl) {
    const accumulatedTime = advancedPrismState.calibration.totalTimeAccumulated[lightType] || 0;
    let calculatedPenalty;
    if (accumulatedTime > 20) {
      calculatedPenalty = Math.pow(1.05, accumulatedTime - 20);
    } else {
      calculatedPenalty = 1.0;
    }
    advancedPrismState.calibration.sessionPenalty[lightType] = new Decimal(calculatedPenalty);
    diminishingReturnsEl.textContent = `/${calculatedPenalty.toFixed(3)}`;
    if (calculatedPenalty <= 1.2) {
      diminishingReturnsEl.style.color = '#44ff44';
    } else if (calculatedPenalty <= 1.5) {
      diminishingReturnsEl.style.color = '#ffdd44';
    } else if (calculatedPenalty <= 2.0) {
      diminishingReturnsEl.style.color = '#ff8844';
    } else {
      diminishingReturnsEl.style.color = '#ff4444';
    }
  }
  const currentNerf = getCalibrationNerf(lightType);
  const nerfText = formatNumber(currentNerf);
  document.getElementById('calibrationCurrentNerf').textContent = nerfText;
  const currentLightAmount = window.prismState[lightType];
  const lightDisplayText = currentLightAmount ? formatNumber(currentLightAmount) : '0';
  document.getElementById('calibrationCurrentLight').textContent = lightDisplayText;
  document.getElementById('activateCalibrationBtn').style.display = 'inline-block';
  document.getElementById('stopCalibrationBtn').style.display = 'none';
  modal.style.display = 'block';
  drawWave();
  const scrollArea = document.getElementById('frequencyScrollArea');
  const handleScroll = function(event) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.01 : 0.01;
    let newFreq = advancedPrismState.calibration.waveFrequency + delta;
    newFreq = Math.max(0.01, Math.min(1.00, newFreq));
    newFreq = Math.round(newFreq * 100) / 100;
    advancedPrismState.calibration.waveFrequency = newFreq;
    document.getElementById('frequencyDisplay').textContent = newFreq.toFixed(2);
    drawWave();
  };
  scrollArea.addEventListener('wheel', handleScroll);
  modal._scrollHandler = handleScroll;
  modal._scrollArea = scrollArea;
}
function startCalibration() {
  const lightType = advancedPrismState.calibration.activeMinigame;
  if (!lightType) {
    return;
  }
  if (!window.prismState || !window.prismState[lightType] || window.prismState[lightType].lte(0)) {
    stopCalibration();
    return;
  }
  advancedPrismState.calibration.optimalFrequency = Math.random() * 0.99 + 0.01;
  advancedPrismState.calibration.minigameStartTime = Date.now();
  advancedPrismState.calibration.lastSaveTime = Date.now();
  advancedPrismState.calibration.lastSessionEfficiency = 1.0;
  document.getElementById('activateCalibrationBtn').style.display = 'none';
  document.getElementById('stopCalibrationBtn').style.display = 'inline-block';
  if (advancedPrismState.calibration.drainInterval) {
    clearInterval(advancedPrismState.calibration.drainInterval);
    advancedPrismState.calibration.drainInterval = null;
  }
  if (advancedPrismState.calibration.minigameInterval) {
    clearInterval(advancedPrismState.calibration.minigameInterval);
  }
  let lastDrainTime = Date.now();
  try {
    advancedPrismState.calibration.minigameInterval = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastDrainTime >= 100) {
        drainLightCurrency(lightType);
        lastDrainTime = currentTime;
      }
      updateCalibrationMinigame(lightType);
    }, 50);
  } catch (error) {
  }
}
function stopCalibration() {
  if (advancedPrismState.calibration.minigameInterval) {
    clearInterval(advancedPrismState.calibration.minigameInterval);
    advancedPrismState.calibration.minigameInterval = null;
  }
  if (advancedPrismState.calibration.drainInterval) {
    clearInterval(advancedPrismState.calibration.drainInterval);
    advancedPrismState.calibration.drainInterval = null;
  }
  const lightType = advancedPrismState.calibration.activeMinigame;
  if (lightType && advancedPrismState.calibration.minigameStartTime > 0) {
    const sessionTimeSeconds = (Date.now() - advancedPrismState.calibration.minigameStartTime) / 1000;
    if (!advancedPrismState.calibration.totalTimeAccumulated[lightType]) {
      advancedPrismState.calibration.totalTimeAccumulated[lightType] = 0;
    }
    advancedPrismState.calibration.totalTimeAccumulated[lightType] += sessionTimeSeconds;
    const totalTimeSeconds = advancedPrismState.calibration.totalTimeAccumulated[lightType];
    const exponentialGrowth = new Decimal(5).pow(totalTimeSeconds);
    advancedPrismState.calibration.nerfs[lightType] = new Decimal(1).mul(exponentialGrowth);
  }
  advancedPrismState.calibration.minigameStartTime = 0;
  const activeLightType = advancedPrismState.calibration.activeMinigame;
  if (activeLightType) {
    const diminishingReturnsEl = document.getElementById('calibrationDiminishingReturns');
    if (diminishingReturnsEl) {
      const persistentPenalty = advancedPrismState.calibration.sessionPenalty[activeLightType] || new Decimal(1.0);
      const penaltyValue = DecimalUtils.isDecimal(persistentPenalty) ? persistentPenalty.toNumber() : persistentPenalty;
      diminishingReturnsEl.textContent = `/${penaltyValue.toFixed(3)}`;
      if (penaltyValue <= 1.2) {
        diminishingReturnsEl.style.color = '#44ff44';
      } else if (penaltyValue <= 1.5) {
        diminishingReturnsEl.style.color = '#ffdd44';
      } else if (penaltyValue <= 2.0) {
        diminishingReturnsEl.style.color = '#ff8844';
      } else {
        diminishingReturnsEl.style.color = '#ff4444';
      }
    }
  }
  if (typeof saveGame === 'function') {
    saveGame();
  }
  document.getElementById('activateCalibrationBtn').style.display = 'inline-block';
  document.getElementById('stopCalibrationBtn').style.display = 'none';
}
function closeCalibrationModal() {
  stopCalibration();
  advancedPrismState.calibration.activeMinigame = null;
  const modal = document.getElementById('calibrationModal');
  if (modal._scrollHandler && modal._scrollArea) {
    modal._scrollArea.removeEventListener('wheel', modal._scrollHandler);
    modal._scrollHandler = null;
    modal._scrollArea = null;
  }
  modal.style.display = 'none';
}
document.addEventListener('click', function(event) {
  const modal = document.getElementById('calibrationModal');
  if (event.target === modal) {
    closeCalibrationModal();
  }
});
function drainLightCurrency(lightType) {
  let prismState = window.prismState;
  if (!prismState && typeof window.prism !== 'undefined') {
    prismState = window.prism.prismState;
  }
  if (!prismState || !prismState[lightType]) {
    return;
  }
  if (typeof Decimal === 'undefined' && typeof window.Decimal === 'undefined') {
    return;
  }
  const DecimalConstructor = typeof Decimal !== 'undefined' ? Decimal : window.Decimal;
  const currentAmount = prismState[lightType];
  const drainPercentage = new DecimalConstructor(0.30);
  const drainAmount = currentAmount.mul(drainPercentage);
  const oldAmount = prismState[lightType];
  if (typeof oldAmount.sub === 'function') {
    prismState[lightType] = oldAmount.sub(drainAmount);
  } else {
    return;
  }
  if (prismState[lightType].lte(1)) {
    prismState[lightType] = new DecimalConstructor(0);
    stopCalibration();
    const diminishingReturnsEl = document.getElementById('calibrationDiminishingReturns');
    if (diminishingReturnsEl) {
      const persistentPenalty = advancedPrismState.calibration.sessionPenalty[lightType] || new Decimal(1.0);
      const penaltyValue = DecimalUtils.isDecimal(persistentPenalty) ? persistentPenalty.toNumber() : persistentPenalty;
      diminishingReturnsEl.textContent = `/${penaltyValue.toFixed(3)}`;
      if (penaltyValue <= 1.2) {
        diminishingReturnsEl.style.color = '#44ff44';
      } else if (penaltyValue <= 1.5) {
        diminishingReturnsEl.style.color = '#ffdd44';
      } else if (penaltyValue <= 2.0) {
        diminishingReturnsEl.style.color = '#ff8844';
      } else {
        diminishingReturnsEl.style.color = '#ff4444';
      }
    }
    if (window.showViSpeech) {
      showViSpeech('Light depleted! Calibration stopped.', 3000);
    }
  }
  if (window.updateAllLightCounters) {
    window.updateAllLightCounters();
  } else if (window.forceUpdateAllLightCounters) {
    window.forceUpdateAllLightCounters();
  }
}
function updateCalibrationMinigame(lightType) {
  if (advancedPrismState.calibration.minigameStartTime === 0) return;
  const sessionTimeSeconds = (Date.now() - advancedPrismState.calibration.minigameStartTime) / 1000;
  const accumulatedTime = advancedPrismState.calibration.totalTimeAccumulated[lightType] || 0;
  const totalTimeSeconds = accumulatedTime + sessionTimeSeconds;
  document.getElementById('calibrationTime').textContent = totalTimeSeconds.toFixed(1);
  const exponentialGrowth = new Decimal(5).pow(totalTimeSeconds);
  const currentNerf = new Decimal(1).mul(exponentialGrowth);
  const nerfText = formatNumber(currentNerf);
  document.getElementById('calibrationCurrentNerf').textContent = nerfText;
  const efficiency = calculateCalibrationEfficiency();
  const baseGeneration = 1;
  const timeMultiplier = Math.pow(1.2, totalTimeSeconds / 1);
  let sessionPenalty;
  if (totalTimeSeconds > 20) {
    sessionPenalty = Math.pow(1.05, totalTimeSeconds - 20);
  } else {
    sessionPenalty = 1;
  }
  if (isNaN(sessionPenalty) || sessionPenalty <= 0) {
    sessionPenalty = 1.0;
  }
  advancedPrismState.calibration.sessionPenalty[lightType] = new Decimal(sessionPenalty);
  const efficiencyMultiplier = (efficiency / 100) * (1 + (efficiency / 100));
  const generationBeforePenalty = baseGeneration * efficiencyMultiplier * timeMultiplier / 20;
  const generation = generationBeforePenalty / sessionPenalty;
  if (totalTimeSeconds > 20) {
  }
  if (generation > 0) {
    const generationDecimal = new Decimal(generation);
    advancedPrismState.calibration.stable[lightType] =
      advancedPrismState.calibration.stable[lightType].add(generationDecimal);
    const stableAmount = advancedPrismState.calibration.stable[lightType];
    let displayText;
    if (stableAmount.gte(1000)) {
      displayText = formatNumber(stableAmount);
    } else {
      displayText = stableAmount.toFixed(1);
    }
    document.getElementById('calibrationStableLight').textContent = displayText;
  }
  const timeMultiplierEl = document.getElementById('calibrationTimeMultiplier');
  if (timeMultiplierEl) {
    timeMultiplierEl.textContent = `x${timeMultiplier.toFixed(1)}`;
  }
  const diminishingReturnsEl = document.getElementById('calibrationDiminishingReturns');
  if (diminishingReturnsEl) {
    if (advancedPrismState.calibration.minigameStartTime > 0) {
      let sessionPenalty;
      if (totalTimeSeconds > 20) {
        sessionPenalty = Math.pow(1.05, totalTimeSeconds - 20);
      } else {
        sessionPenalty = 1;
      }
      if (isNaN(sessionPenalty) || sessionPenalty <= 0) {
        sessionPenalty = 1.0;
      }
      advancedPrismState.calibration.lastSessionEfficiency = sessionPenalty;
      advancedPrismState.calibration.sessionPenalty[lightType] = new Decimal(sessionPenalty);
      diminishingReturnsEl.textContent = `/${sessionPenalty.toFixed(3)}`;
      if (sessionPenalty <= 1.2) {
        diminishingReturnsEl.style.color = '#44ff44';
      } else if (sessionPenalty <= 1.5) {
        diminishingReturnsEl.style.color = '#ffdd44';
      } else if (sessionPenalty <= 2.0) {
        diminishingReturnsEl.style.color = '#ff8844';
      } else {
        diminishingReturnsEl.style.color = '#ff4444';
      }
    } else {
      const persistentPenalty = advancedPrismState.calibration.sessionPenalty[lightType] || new Decimal(1.0);
      const penaltyValue = DecimalUtils.isDecimal(persistentPenalty) ? persistentPenalty.toNumber() : persistentPenalty;
      diminishingReturnsEl.textContent = `/${penaltyValue.toFixed(3)}`;
      if (penaltyValue <= 1.2) {
        diminishingReturnsEl.style.color = '#44ff44';
      } else if (penaltyValue <= 1.5) {
        diminishingReturnsEl.style.color = '#ffdd44';
      } else if (penaltyValue <= 2.0) {
        diminishingReturnsEl.style.color = '#ff8844';
      } else {
        diminishingReturnsEl.style.color = '#ff4444';
      }
    }
  }
  const currentLightEl = document.getElementById('calibrationCurrentLight');
  if (currentLightEl && window.prismState && window.prismState[lightType]) {
    const currentLightAmount = window.prismState[lightType];
    const lightDisplayText = formatNumber(currentLightAmount);
    currentLightEl.textContent = lightDisplayText;
  }
  const currentTime = Date.now();
  if (currentTime - advancedPrismState.calibration.lastSaveTime >= 5000) {
    if (typeof saveGame === 'function') {
      saveGame();
      advancedPrismState.calibration.lastSaveTime = currentTime;
    }
  }
  drawWave();
}
function calculateCalibrationEfficiency() {
  const current = advancedPrismState.calibration.waveFrequency;
  const optimal = advancedPrismState.calibration.optimalFrequency;
  const difference = Math.abs(current - optimal);
  const maxDifference = 0.99;
  const efficiency = Math.max(0, 100 - (difference / maxDifference) * 100);
  return efficiency;
}
function updateCalibrationEfficiency() {
  const efficiency = calculateCalibrationEfficiency();
  const efficiencyEl = document.getElementById('calibrationEfficiency');
  const isMinigameActive = advancedPrismState.calibration.minigameStartTime > 0;
  if (isMinigameActive) {
    efficiencyEl.textContent = efficiency.toFixed(1);
  } else {
    efficiencyEl.textContent = '???';
  }
}
function drawWave() {
  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');
  if (!canvas || !ctx) return;
  const currentTime = Date.now() / 1000;
  if (advancedPrismState.calibration.lastAnimationTime === 0) {
    advancedPrismState.calibration.lastAnimationTime = currentTime;
  }
  const deltaTime = currentTime - advancedPrismState.calibration.lastAnimationTime;
  const frequency = advancedPrismState.calibration.waveFrequency;
  const waveSpeed = frequency * 3;
  advancedPrismState.calibration.wavePhase += deltaTime * waveSpeed * 2 * Math.PI;
  if (advancedPrismState.calibration.wavePhase > 1000) {
    advancedPrismState.calibration.wavePhase = advancedPrismState.calibration.wavePhase % (2 * Math.PI);
  }
  advancedPrismState.calibration.lastAnimationTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const lightType = advancedPrismState.calibration.activeMinigame;
  const colors = {
    light: '#ffffff',
    redlight: '#ff4444',
    orangelight: '#ff8844',
    yellowlight: '#ffdd44',
    greenlight: '#44ff44',
    bluelight: '#4444ff'
  };
  const waveColor = colors[lightType] || '#ffffff';
  const amplitude = 50;
  const centerY = canvas.height / 2;
  const isMinigameActive = advancedPrismState.calibration.minigameStartTime > 0;
  if (isMinigameActive) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = centerY + amplitude * Math.sin((x / 80) * advancedPrismState.calibration.optimalFrequency * 2 * Math.PI);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = waveColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x < canvas.width; x++) {
    const y = centerY + amplitude * Math.sin((x / 80) * frequency * 2 * Math.PI + advancedPrismState.calibration.wavePhase);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
}
function respecStableLight() {
  if (!confirm('This will perform a Prism Core reset without rewards and remove all stable light and nerfs. Continue?')) {
    return;
  }
  Object.keys(advancedPrismState.calibration.stable).forEach(lightType => {
    advancedPrismState.calibration.stable[lightType] = new Decimal(0);
  });
  Object.keys(advancedPrismState.calibration.nerfs).forEach(lightType => {
    advancedPrismState.calibration.nerfs[lightType] = new Decimal(1);
  });
  Object.keys(advancedPrismState.calibration.totalTimeAccumulated).forEach(lightType => {
    advancedPrismState.calibration.totalTimeAccumulated[lightType] = 0;
  });
  Object.keys(advancedPrismState.calibration.sessionPenalty).forEach(lightType => {
    advancedPrismState.calibration.sessionPenalty[lightType] = new Decimal(1.0);
  });
  advancedPrismState.calibration.activeMinigame = null;
  advancedPrismState.calibration.minigameStartTime = 0;
  advancedPrismState.calibration.lastSaveTime = 0;
  if (advancedPrismState.calibration.minigameInterval) {
    clearInterval(advancedPrismState.calibration.minigameInterval);
    advancedPrismState.calibration.minigameInterval = null;
  }
  if (advancedPrismState.calibration.drainInterval) {
    clearInterval(advancedPrismState.calibration.drainInterval);
    advancedPrismState.calibration.drainInterval = null;
  }
  advancedPrismState.calibration.waveFrequency = 1;
  advancedPrismState.calibration.optimalFrequency = 1;
  advancedPrismState.calibration.wavePhase = 0;
  advancedPrismState.calibration.lastAnimationTime = 0;
  performPrismCoreResetWithoutRewards();
  if (window.showViSpeech) {
    showViSpeech('Stable light calibration data wiped. All spectrum distortions removed.', 4000);
  }
}
function performPrismCoreResetWithoutRewards() {
  if (window.prismState) {
    Object.keys(window.prismState).forEach(key => {
      if (key.includes('light') && window.DecimalUtils && window.DecimalUtils.isDecimal(window.prismState[key])) {
        window.prismState[key] = new Decimal(0);
      }
    });
  }
  if (window.prismState && window.prismState.generatorUpgrades) {
    Object.keys(window.prismState.generatorUpgrades).forEach(lightType => {
      window.prismState.generatorUpgrades[lightType] = new Decimal(0);
    });
  }
  if (window.forceUpdateAllLightCounters) {
    window.forceUpdateAllLightCounters();
  }
  if (window.updateLightGeneratorButtons) {
    window.updateLightGeneratorButtons();
  }
  updateAdvancedPrismUI();
}
function applyCalibrationNerfs() {
  if (!window.prismState || !advancedPrismState.calibration) return;
  Object.keys(advancedPrismState.calibration.nerfs).forEach(lightType => {
    const nerf = advancedPrismState.calibration.nerfs[lightType];
    if (nerf.gt(1) && window.prismState[lightType]) {
    }
  });
}
function getCalibrationNerf(lightType) {
  if (!advancedPrismState.calibration || !advancedPrismState.calibration.nerfs[lightType]) {
    return new Decimal(1);
  }
  return advancedPrismState.calibration.nerfs[lightType];
}
function decayCalibrationNerfs(deltaTime) {
  if (!advancedPrismState.calibration || !advancedPrismState.calibration.nerfs) return;
  let decayPercentage = 1;
  if (window.friendship && window.friendship.Lab && window.friendship.Lab.level >= 10) {
    const viLevel = window.friendship.Lab.level;
    decayPercentage = 1 + (viLevel - 9);
  }
  Object.keys(advancedPrismState.calibration.nerfs).forEach(lightType => {
    const currentNerf = advancedPrismState.calibration.nerfs[lightType];
    if (currentNerf.gt(1)) {
      const keepPercentage = (100 - decayPercentage) / 100;
      const decayRate = new Decimal(keepPercentage).pow(deltaTime);
      const newNerf = currentNerf.mul(decayRate);
      if (newNerf.lte(1.001)) {
        advancedPrismState.calibration.nerfs[lightType] = new Decimal(1);
      } else {
        advancedPrismState.calibration.nerfs[lightType] = newNerf;
      }
    }
  });
}
let nerfDecayInterval = null;
let lastNerfDecayTime = Date.now();
function startEnhancedNerfDecaySystem() {
  if (nerfDecayInterval) {
    clearInterval(nerfDecayInterval);
    nerfDecayInterval = null;
  }
  if (!window.friendship || !window.friendship.Lab || window.friendship.Lab.level < 15) {
    return;
  }
  lastNerfDecayTime = Date.now();
  updateNerfDisplayInterval(500);
  nerfDecayInterval = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastNerfDecayTime) / 1000;
    if (advancedPrismState.calibration && advancedPrismState.calibration.nerfs) {
      const hasNerfs = Object.keys(advancedPrismState.calibration.nerfs).some(lightType => {
        return advancedPrismState.calibration.nerfs[lightType].gt(1);
      });
      if (hasNerfs) {
        originalDecayCalibrationNerfs(deltaTime);
      }
    }
    lastNerfDecayTime = currentTime;
  }, 500);
}
function stopEnhancedNerfDecaySystem() {
  if (nerfDecayInterval) {
    clearInterval(nerfDecayInterval);
    nerfDecayInterval = null;
    updateNerfDisplayInterval(1000);
  }
}
function checkAndUpdateNerfDecaySystem() {
  const shouldUseEnhanced = window.friendship && window.friendship.Lab && window.friendship.Lab.level >= 15;
  const isCurrentlyRunning = !!nerfDecayInterval;
  if (shouldUseEnhanced && !isCurrentlyRunning) {
    startEnhancedNerfDecaySystem();
  } else if (!shouldUseEnhanced && isCurrentlyRunning) {
    stopEnhancedNerfDecaySystem();
  }
}
const originalDecayCalibrationNerfs = decayCalibrationNerfs;
function enhancedDecayCalibrationNerfs(deltaTime) {
  if (nerfDecayInterval) {
    return;
  }
  originalDecayCalibrationNerfs(deltaTime);
}
window.openCalibrationMinigame = openCalibrationMinigame;
window.startCalibration = startCalibration;
window.stopCalibration = stopCalibration;
window.closeCalibrationModal = closeCalibrationModal;
window.respecStableLight = respecStableLight;
window.getCalibrationNerf = getCalibrationNerf;
window.decayCalibrationNerfs = enhancedDecayCalibrationNerfs;
window.startEnhancedNerfDecaySystem = startEnhancedNerfDecaySystem;
window.stopEnhancedNerfDecaySystem = stopEnhancedNerfDecaySystem;
window.checkAndUpdateNerfDecaySystem = checkAndUpdateNerfDecaySystem;
window.updateNerfDisplayInterval = updateNerfDisplayInterval;
function hookLightGainFunctions() {
  const originalGetLightGain = window.getLightGain;
  const originalGetRedlightGain = window.getRedlightGain;
  const originalGetOrangelightGain = window.getOrangelightGain;
  const originalGetYellowlightGain = window.getYellowlightGain;
  const originalGetGreenlightGain = window.getGreenlightGain;
  const originalGetBluelightGain = window.getBluelightGain;
  const originalAddCurrency = window.addCurrency;
  if (originalGetLightGain) {
    window.getLightGain = function(amount) {
      let result = originalGetLightGain(amount);
      const nerf = getCalibrationNerf('light');
      if (nerf.gt(1)) {
        result = result.div(nerf);
      }
      return result;
    };
  }
  if (originalGetRedlightGain) {
    window.getRedlightGain = function(amount) {
      let result = originalGetRedlightGain(amount);
      const nerf = getCalibrationNerf('redlight');
      if (nerf.gt(1)) {
        result = result.div(nerf);
      }
      return result;
    };
  }
  if (originalGetOrangelightGain) {
    window.getOrangelightGain = function(amount) {
      let result = originalGetOrangelightGain(amount);
      const nerf = getCalibrationNerf('orangelight');
      if (nerf.gt(1)) {
        result = result.div(nerf);
      }
      return result;
    };
  }
  if (originalGetYellowlightGain) {
    window.getYellowlightGain = function(amount) {
      let result = originalGetYellowlightGain(amount);
      const nerf = getCalibrationNerf('yellowlight');
      if (nerf.gt(1)) {
        result = result.div(nerf);
      }
      return result;
    };
  }
  if (originalGetGreenlightGain) {
    window.getGreenlightGain = function(amount) {
      let result = originalGetGreenlightGain(amount);
      const nerf = getCalibrationNerf('greenlight');
      if (nerf.gt(1)) {
        result = result.div(nerf);
      }
      return result;
    };
  }
  if (originalGetBluelightGain) {
    window.getBluelightGain = function(amount) {
      let result = originalGetBluelightGain(amount);
      const nerf = getCalibrationNerf('bluelight');
      if (nerf.gt(1)) {
        result = result.div(nerf);
      }
      return result;
    };
  }
  if (originalAddCurrency) {
    window.addCurrency = function(currencyName, amount) {
      const lightTypeMap = {
        'light': 'light',
        'redLight': 'redlight',
        'orangeLight': 'orangelight',
        'yellowLight': 'yellowlight',
        'greenLight': 'greenlight',
        'blueLight': 'bluelight'
      };
      const lightType = lightTypeMap[currencyName];
      if (lightType) {
        const nerf = getCalibrationNerf(lightType);
        if (nerf.gt(1)) {
          amount = amount.div(nerf);
        }
      }
      return originalAddCurrency(currencyName, amount);
    };
  }
}
setTimeout(() => {
  hookLightGainFunctions();
}, 1000);
function initializeViTokenDrops() {
}
const lightTypes = [
  {
    id: 'light',
    name: 'Stable Light',
    color: '#ffffff',
    description: 'The fundamental building block of all light-based research.'
  },
  {
    id: 'redlight',
    name: 'Red Stable Light',
    color: '#ff4444',
    description: 'Energetic red wavelengths, useful for heating applications.'
  },
  {
    id: 'orangelight',
    name: 'Orange Stable Light',
    color: '#ff8844',
    description: 'Warm orange wavelengths, promotes growth and vitality.'
  },
  {
    id: 'yellowlight',
    name: 'Yellow Stable Light',
    color: '#ffdd44',
    description: 'Bright yellow wavelengths, enhances mental clarity.'
  },
  {
    id: 'greenlight',
    name: 'Green Stable Light',
    color: '#44ff44',
    description: 'Balanced green wavelengths, stabilizes other light types.'
  },
  {
    id: 'bluelight',
    name: 'Blue Stable Light',
    color: '#4444ff',
    description: 'Cool blue wavelengths, improves processing efficiency.'
  }
];
const stableLightBuffs = {
  light: {
    name: 'Infinity Points',
    color: '#6495ed',
    calculate: function(stableAmount) {
      if (!stableAmount || stableAmount.lte(0)) return new Decimal(1);
      const x = stableAmount.log10().toNumber();
      let exponent;
      if (x < 2) {
        exponent = 1.0;
      } else if (x < 3) {
        exponent = 0.4 * x + 0.3;
      } else if (x < 6) {
        exponent = (11/30) * x + 0.4;
      } else if (x < 10) {
        exponent = 0.35 * x + 0.5;
      } else if (x <= 100) {
        exponent = (1/15) * x + (10/3);
      } else {
        exponent = 10;
      }
      return new Decimal(exponent);
    },
    format: function(value) {
      return `^${value.toFixed(3)}`;
    }
  },
  redlight: {
    name: 'Pollen & Flowers',
    color: '#ff69b4',
    calculate: function(stableAmount) {
      if (!stableAmount || stableAmount.lte(0)) return new Decimal(1);
      const x = stableAmount.log10().toNumber();
      let multiplier;
      if (x < 2) {
        multiplier = 1.0;
      } else if (x >= 2 && x < 3) {
        multiplier = 1.01 + 0.09 * (x - 2);
      } else if (x >= 3 && x < 6) {
        multiplier = 1.10 + (0.20/3) * (x - 3);
      } else if (x >= 6 && x <= 10) {
        multiplier = 1.30 + (0.70/4) * (x - 6);
      } else if (x > 10 && x <= 100) {
        multiplier = 2.00 + (3/90) * (x - 10);
      } else {
        multiplier = 5.0;
      }
      return new Decimal(multiplier);
    },
    format: function(value) {
      return `^${value.toFixed(3)}`;
    }
  },
  orangelight: {
    name: 'Nectar Gain',
    color: '#ff6600',
    calculate: function(stableAmount) {
      if (!stableAmount || stableAmount.lte(0)) return new Decimal(1);
      const x = stableAmount.log10().toNumber();
      let multiplier;
      if (x < 2) {
        multiplier = 1.0;
      } else if (x >= 2 && x < 3) {
        multiplier = 1.01 + 0.09 * (x - 2);
      } else if (x >= 3 && x < 6) {
        multiplier = 1.10 + (0.20/3) * (x - 3);
      } else if (x >= 6 && x <= 10) {
        multiplier = 1.30 + (0.70/4) * (x - 6);
      } else if (x > 10 && x <= 100) {
        multiplier = 2.00 + (3/90) * (x - 10);
      } else {
        multiplier = 5.0;
      }
      return new Decimal(multiplier);
    },
    format: function(value) {
      return `^${value.toFixed(3)}`;
    }
  },
  yellowlight: {
    name: 'Box Generated',
    color: '#ffdd44',
    calculate: function(stableAmount) {
      if (!stableAmount || stableAmount.lte(0)) return new Decimal(1);
      const x = stableAmount.log10().toNumber();
      let multiplier;
      if (x < 2) {
        multiplier = 1.0;
      } else if (x >= 2 && x <= 3) {
        multiplier = 1.01 + 0.09 * (x - 2);
      } else if (x > 3 && x <= 6) {
        multiplier = 1.10 + (0.20/3) * (x - 3);
      } else if (x > 6 && x <= 10) {
        multiplier = 1.30 + (0.70/4) * (x - 6);
      } else if (x > 10 && x <= 100) {
        multiplier = 2.00 + (3/90) * (x - 10);
      } else {
        multiplier = 5.0;
      }
      return new Decimal(multiplier);
    },
    format: function(value) {
      return `^${value.toFixed(3)}`;
    }
  },
  greenlight: {
    name: 'Token gain',
    color: '#44ff44',
    calculate: function(stableAmount) {
      if (!stableAmount || stableAmount.lte(0)) return new Decimal(1);
      const x = stableAmount.log10().toNumber();
      let multiplier;
      if (x < 2) {
        multiplier = 1.0;
      } else if (x < 3) {
        multiplier = 0.4 * x + 0.3;
      } else if (x < 6) {
        multiplier = (11/30) * x + 0.4;
      } else if (x < 10) {
        multiplier = 0.35 * x + 0.5;
      } else if (x <= 100) {
        multiplier = (1/15) * x + (10/3);
      } else {
        multiplier = 10;
      }
      return new Decimal(multiplier);
    },
    format: function(value) {
      return `+${value.toFixed(1)}`;
    }
  },
  bluelight: {
    name: 'Cargo currencies',
    color: '#4444ff',
    calculate: function(stableAmount) {
      if (!stableAmount || stableAmount.lte(0)) return new Decimal(1);
      const x = stableAmount.log10().toNumber();
      let multiplier;
      if (x < 2) {
        multiplier = 1.0;
      } else if (x >= 2 && x < 3) {
        multiplier = 1.01 + 0.09 * (x - 2);
      } else if (x >= 3 && x < 6) {
        multiplier = 1.10 + (0.20/3) * (x - 3);
      } else if (x >= 6 && x <= 10) {
        multiplier = 1.30 + (0.70/4) * (x - 6);
      } else if (x > 10 && x <= 100) {
        multiplier = 2.00 + (3/90) * (x - 10);
      } else {
        multiplier = 5.0;
      }
      return new Decimal(multiplier);
    },
    format: function(value) {
      return `^${value.toFixed(3)}`;
    }
  }
};
function getStableLightBuff(lightType) {
  const buff = stableLightBuffs[lightType];
  if (!buff) return new Decimal(1);
  const stableAmount = advancedPrismState.calibration.stable[lightType];
  return buff.calculate(stableAmount);
}
function getStableLightBuffDisplay(lightType) {
  const buff = stableLightBuffs[lightType];
  if (!buff) return '';
  const stableAmount = advancedPrismState.calibration.stable[lightType];
  if (!stableAmount || stableAmount.lte(0)) return '';
  const buffValue = buff.calculate(stableAmount);
  const formattedValue = buff.format(buffValue);
  return `<div style="color: ${buff.color}; font-size: 0.65rem; font-weight: bold; text-shadow: 0 0 3px ${buff.color}; -webkit-text-stroke: 0.5px rgba(0,0,0,0.8); text-stroke: 0.5px rgba(0,0,0,0.8); margin-top: 1px; text-align: center;">${buff.name}: ${formattedValue}</div>`;
}
function applyWhiteStableLightBuff(baseInfinityPoints) {
  const whiteBuff = getStableLightBuff('light');
  if (whiteBuff.lte(1)) {
    return baseInfinityPoints;
  }
  let effectiveBase = baseInfinityPoints;
  if (effectiveBase.lt(1)) {
    effectiveBase = effectiveBase.add(1);
  }
  const result = effectiveBase.pow(whiteBuff);
  return result;
}
function applyRedStableLightBuff(baseGain) {
  const redBuff = getStableLightBuff('redlight');
  if (redBuff.lte(1)) {
    return baseGain;
  }
  return baseGain.mul(redBuff);
}
function applyOrangeStableLightBuff(baseNectarGain) {
  const orangeBuff = getStableLightBuff('orangelight');
  if (orangeBuff.lte(1)) {
    return baseNectarGain;
  }
  return baseNectarGain.mul(orangeBuff);
}
function applyYellowStableLightBuff(baseBoxGeneration) {
  const yellowBuff = getStableLightBuff('yellowlight');
  if (yellowBuff.lte(1)) {
    return baseBoxGeneration;
  }
  let effectiveBase = baseBoxGeneration;
  if (effectiveBase.lt(1)) {
    effectiveBase = effectiveBase.add(1);
  }
  const result = effectiveBase.pow(yellowBuff);
  return result;
}
function applyGreenStableLightBuff(baseTokenGain) {
  const greenBuff = getStableLightBuff('greenlight');
  if (greenBuff.lte(1)) {
    return baseTokenGain;
  }
  return baseTokenGain.mul(greenBuff);
}
function applyBlueStableLightBuff(baseCargoCurrency) {
  const blueBuff = getStableLightBuff('bluelight');
  if (blueBuff.lte(1)) {
    return baseCargoCurrency;
  }
  let effectiveBase = baseCargoCurrency;
  if (effectiveBase.lt(1)) {
    effectiveBase = effectiveBase.add(1);
  }
  const result = effectiveBase.pow(blueBuff);
  return result;
}
window.getStableLightBuff = getStableLightBuff;
window.getStableLightBuffDisplay = getStableLightBuffDisplay;
window.applyWhiteStableLightBuff = applyWhiteStableLightBuff;
window.applyRedStableLightBuff = applyRedStableLightBuff;
window.applyOrangeStableLightBuff = applyOrangeStableLightBuff;
window.applyYellowStableLightBuff = applyYellowStableLightBuff;
window.applyGreenStableLightBuff = applyGreenStableLightBuff;
window.applyBlueStableLightBuff = applyBlueStableLightBuff;
function testStableLightBuff() {
  advancedPrismState.calibration.stable.light = new Decimal(200000);
  updateAdvancedPrismUI();
  const testRate = new Decimal(100);
  const buffedRate = applyWhiteStableLightBuff(testRate);
}
window.testStableLightBuff = testStableLightBuff;
window.testVivienNerfDecayBuff = function(level = 10) {
  if (!window.friendship) {
    window.friendship = {};
  }
  if (!window.friendship.Lab) {
    window.friendship.Lab = { level: 0, points: new Decimal(0) };
  }
  window.friendship.Lab.level = level;
  const expectedDecayPercentage = level >= 10 ? 1 + (level - 9) : 1;
  if (level < 10) {
  }
  if (!window.advancedPrismState) {
    window.advancedPrismState = { calibration: { nerfs: {} } };
  }
  if (!window.advancedPrismState.calibration) {
    window.advancedPrismState.calibration = { nerfs: {} };
  }
  if (!window.advancedPrismState.calibration.nerfs) {
    window.advancedPrismState.calibration.nerfs = {};
  }
  window.advancedPrismState.calibration.nerfs.light = new Decimal(2);
  window.advancedPrismState.calibration.nerfs.redlight = new Decimal(5);
  const beforeLight = window.advancedPrismState.calibration.nerfs.light.toNumber();
  const beforeRed = window.advancedPrismState.calibration.nerfs.redlight.toNumber();
  window.decayCalibrationNerfs(1);
  const afterLight = window.advancedPrismState.calibration.nerfs.light.toNumber();
  const afterRed = window.advancedPrismState.calibration.nerfs.redlight.toNumber();
  const keepPercentage = (100 - expectedDecayPercentage) / 100;
  const expectedDecayRate = keepPercentage;
  const expectedAfterLight = beforeLight * expectedDecayRate;
  const expectedAfterRed = beforeRed * expectedDecayRate;
  const lightMatch = Math.abs(afterLight - expectedAfterLight) < 0.001;
  const redMatch = Math.abs(afterRed - expectedAfterRed) < 0.001;
  if (lightMatch && redMatch) {
  } else {
  }
  return {
    level: level,
    decayPercentage: expectedDecayPercentage,
    beforeLight: beforeLight,
    afterLight: afterLight,
    beforeRed: beforeRed,
    afterRed: afterRed,
    working: lightMatch && redMatch
  };
};
window.testVivienEnhancedDecayTicks = function(level = 15) {
  if (!window.friendship) {
    window.friendship = {};
  }
  if (!window.friendship.Lab) {
    window.friendship.Lab = { level: 0, points: new Decimal(0) };
  }
  window.friendship.Lab.level = level;
  if (level < 15) {
    return false;
  }
  if (!window.advancedPrismState) {
    window.advancedPrismState = { calibration: { nerfs: {} } };
  }
  if (!window.advancedPrismState.calibration) {
    window.advancedPrismState.calibration = { nerfs: {} };
  }
  if (!window.advancedPrismState.calibration.nerfs) {
    window.advancedPrismState.calibration.nerfs = {};
  }
  window.advancedPrismState.calibration.nerfs.light = new Decimal(3);
  window.checkAndUpdateNerfDecaySystem();
  let tickCount = 0;
  const startValue = window.advancedPrismState.calibration.nerfs.light.toNumber();
  const monitorInterval = setInterval(() => {
    const currentValue = window.advancedPrismState.calibration.nerfs.light.toNumber();
    const decayAmount = startValue - currentValue;
    const decayPercent = (decayAmount / startValue * 100);
    tickCount++;
    if (tickCount >= 10 || currentValue <= 1.01) {
      clearInterval(monitorInterval);
      if (currentValue <= 1.01) {
      }
      const isRunning = !!window.nerfDecayInterval;
    }
  }, 500);
  return true;
};
window.checkNerfDecaySystemStatus = function() {
  const viLevel = window.friendship?.Lab?.level || 0;
  const shouldRun = viLevel >= 15;
  const isRunning = !!nerfDecayInterval;
  const nerfs = window.advancedPrismState?.calibration?.nerfs || {};
  const activeNerfs = Object.keys(nerfs).filter(lightType => nerfs[lightType].gt(1));
  return {
    level: viLevel,
    shouldRun: shouldRun,
    isRunning: isRunning,
    activeNerfs: activeNerfs
  };
};
function renderAdvancedPrismUI() {
  const container = document.getElementById('prismAdvancedArea');
  if (!container) return;
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 2rem; padding: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem;">
        <div class="card" style="flex: 0 0 300px; height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
          <img id="viCharacterNormal" src="assets/icons/vivien.png" alt="Vi"
               style="width: 250px; height: 250px; border-radius: 12px; cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: block;"
               onclick="pokeVi()">
          <img id="viCharacterTalking" src="assets/icons/vivien talking.png" alt="Vi Talking"
               style="width: 250px; height: 250px; border-radius: 12px; cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;"
               onclick="pokeVi()">
          <img id="viCharacterSleeping" src="assets/icons/vivien sleeping.png" alt="Vi Sleeping"
               style="width: 250px; height: 250px; border-radius: 12px; cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;"
               onclick="pokeVi()">
          <img id="viCharacterSleepTalking" src="assets/icons/vivien sleep talking.png" alt="Vi Sleep Talking"
               style="width: 250px; height: 250px; border-radius: 12px; cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;"
               onclick="pokeVi()">
          <div id="viAdvancedPrismSpeechBubble" class="swaria-speech" style="display: none; position: absolute; left: 100%; top: 50%; transform: translateY(-50%); margin-left: 18px; min-width: 120px; max-width: 260px; background: #fffbe8; color: #222; border-radius: 16px; box-shadow: 0 2px 8px rgba(120,80,180,0.10); padding: 0.8em 1.2em; font-size: 1.1em; font-weight: 500; z-index: 10; pointer-events: none;">
            <div id="viAdvancedPrismSpeechText"></div>
          </div>
        </div>
        <div class="card" style="flex: 0 0 400px; height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: #000000; border: 2px solid #333;">
          <div style="text-align: center;">
            <h3 style="margin: 0 0 1rem 0; color: #B6E6ED;">Prism Core</h3>
            <div style="width: 150px; height: 150px; margin: 0 auto 1rem auto; position: relative; cursor: pointer; perspective: 900px;" onclick="attemptPrismCoreUpgrade()">
              <div id="pyramid" style="width: 120px; height: 120px; position: relative; transform-style: preserve-3d; animation: spin 8s linear infinite; margin: 15px auto;">
                <div style="position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; transform-origin: 50% 90%; transform: translate(-50%, -50%) rotateY(0deg) rotateX(29deg) translateZ(60px);">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                    <polygon points="50,2 2,98 98,98" fill="#B6E6ED99" stroke="#B6E6ED" stroke-width="3" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(182,230,237,0.25));"/>
                  </svg>
                </div>
                <div style="position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; transform-origin: 50% 90%; transform: translate(-50%, -50%) rotateY(90deg) rotateX(29deg) translateZ(60px);">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                    <polygon points="50,2 2,98 98,98" fill="#B6E6ED99" stroke="#B6E6ED" stroke-width="3" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(182,230,237,0.25));"/>
                  </svg>
                </div>
                <div style="position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; transform-origin: 50% 90%; transform: translate(-50%, -50%) rotateY(180deg) rotateX(29deg) translateZ(60px);">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                    <polygon points="50,2 2,98 98,98" fill="#B6E6ED99" stroke="#B6E6ED" stroke-width="3" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(182,230,237,0.25));"/>
                  </svg>
                </div>
                <div style="position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; transform-origin: 50% 90%; transform: translate(-50%, -50%) rotateY(270deg) rotateX(29deg) translateZ(60px);">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
                    <polygon points="50,2 2,98 98,98" fill="#B6E6ED99" stroke="#B6E6ED" stroke-width="3" stroke-linejoin="round" style="filter: drop-shadow(0 0 2px rgba(182,230,237,0.25));"/>
                  </svg>
                </div>
              </div>
              <span id="prismCoreLevel" style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; font-weight: bold; color: #E6F8FB; text-shadow: 0 0 8px #E6F8FB, 0 0 16px #E6F8FB, 1px 1px 2px rgba(0,0,0,0.8); z-index: 15;">1</span>
            </div>
            <style>
              @keyframes spin {
                0% { transform: rotateX(-8deg) rotateY(0deg); }
                100% { transform: rotateX(-8deg) rotateY(360deg); }
              }
              @keyframes upgradeSpinFast {
                0% { transform: rotateX(-8deg) rotateY(0deg); }
                100% { transform: rotateX(-8deg) rotateY(1080deg); }
              }
              @keyframes upgradeSlowToStop {
                0% { transform: rotateX(-8deg) rotateY(0deg); }
                100% { transform: rotateX(-8deg) rotateY(360deg); }
              }
              @keyframes numberFadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
              }
              @keyframes numberFadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
              }
              @keyframes lightBurst {
                0% {
                  opacity: 0;
                  transform: translate(-50%, -50%) scale(0);
                  filter: blur(0px);
                }
                25% {
                  opacity: 0.8;
                  transform: translate(-50%, -50%) scale(1);
                  filter: blur(2px);
                }
                50% {
                  opacity: 1;
                  transform: translate(-50%, -50%) scale(1.8);
                  filter: blur(1px);
                }
                100% {
                  opacity: 0;
                  transform: translate(-50%, -50%) scale(3);
                  filter: blur(4px);
                }
              }
              .prism-light-burst {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle,
                  rgba(255,255,255,1) 0%,
                  rgba(255,150,150,0.9) 15%,
                  rgba(255,200,100,0.8) 30%,
                  rgba(150,255,150,0.8) 45%,
                  rgba(100,200,255,0.8) 60%,
                  rgba(200,150,255,0.8) 75%,
                  rgba(255,100,200,0.6) 90%,
                  transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 25;
                animation: lightBurst 2.5s ease-out forwards;
              }
            </style>
            <div style="text-align: center; margin-bottom: 1rem;">
              <div style="font-size: 1.2rem; color: #B6E6ED; font-weight: bold; margin-bottom: 0.5rem;">Prism Potential: <span id="prismPotential" style="color: #4CAF50;">0</span></div>
              <div style="font-size: 0.8rem; color: #888;">Core Level: <span id="prismCoreLevelDisplay">1</span></div>
            </div>
            <button id="prismCoreUpgradeBtn" onclick="attemptPrismCoreUpgrade()"
                    style="padding: 8px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: not-allowed;"
                    disabled>
              Upgrade Prism Core
            </button>
          </div>
        </div>
        <div class="card" style="flex: 0 0 300px; height: 350px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; position: relative; padding: 1rem;">
          <div style="text-align: center; width: 100%;">
            <h3 style="margin: 0 0 2.5rem 0; color: #4a9eff; font-size: 1.2rem;">Prism Core Boosts</h3>
            <div id="coreBoostsList" style="text-align: left; font-size: 1rem; color: #ffffff; line-height: 1.8; font-weight: 500;">
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333;">
              <div id="nextUnlockInfo" style="text-align: center; font-size: 0.85rem; color: #ffa500; font-weight: bold;">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; gap: 0.75rem; margin: 2rem auto; max-width: 1000px; flex-wrap: wrap;">
        <button id="respecStableLightBtn"
                onclick="respecStableLight()"
                style="height: 50px; width: 120px; background: linear-gradient(135deg, #ff4444, #ff6666); color: white; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s; font-size: 0.7rem; font-weight: bold; box-shadow: 0 4px 8px rgba(255, 68, 68, 0.3), inset 0 1px 2px rgba(255,255,255,0.2); text-shadow: 0 1px 2px rgba(0,0,0,0.3);"
                onmouseover="this.style.background='linear-gradient(135deg, #ff6666, #ff8888)'; this.style.transform='translateY(-2px) scale(1.05)'; this.style.boxShadow='0 6px 12px rgba(255, 68, 68, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='linear-gradient(135deg, #ff4444, #ff6666)'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 8px rgba(255, 68, 68, 0.3), inset 0 1px 2px rgba(255,255,255,0.2)'">
          Respec Stable Light
        </button>
        ${lightTypes.map(light => {
          const lightStyles = {
            'light': {
              background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
              shadowColor: 'rgba(255, 255, 255, 0.4)',
              glowColor: 'rgba(255, 255, 255, 0.6)',
              textColor: '#333',
              textShadow: 'none'
            },
            'redlight': {
              background: 'linear-gradient(135deg, #ff4444, #ff6666)',
              shadowColor: 'rgba(255, 68, 68, 0.4)',
              glowColor: 'rgba(255, 68, 68, 0.6)',
              textColor: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            },
            'orangelight': {
              background: 'linear-gradient(135deg, #ff8844, #ffaa66)',
              shadowColor: 'rgba(255, 136, 68, 0.4)',
              glowColor: 'rgba(255, 136, 68, 0.6)',
              textColor: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            },
            'yellowlight': {
              background: 'linear-gradient(135deg, #ffdd44, #ffee66)',
              shadowColor: 'rgba(255, 221, 68, 0.4)',
              glowColor: 'rgba(255, 221, 68, 0.6)',
              textColor: '#333',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            },
            'greenlight': {
              background: 'linear-gradient(135deg, #44ff44, #66ff66)',
              shadowColor: 'rgba(68, 255, 68, 0.4)',
              glowColor: 'rgba(68, 255, 68, 0.6)',
              textColor: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            },
            'bluelight': {
              background: 'linear-gradient(135deg, #4444ff, #6666ff)',
              shadowColor: 'rgba(68, 68, 255, 0.4)',
              glowColor: 'rgba(68, 68, 255, 0.6)',
              textColor: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }
          };
          const style = lightStyles[light.id] || lightStyles['light'];
          return `
          <div class="card light-type-card spectrum-button" data-light-type="${light.id}"
               onclick="openCalibrationMinigame('${light.id}')"
               style="height: 65px; width: 120px; background: ${style.background}; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; border: none; box-shadow: 0 4px 8px ${style.shadowColor}, inset 0 1px 2px rgba(255,255,255,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.25rem; position: relative; overflow: hidden; --shadow-color: ${style.shadowColor}; --glow-color: ${style.glowColor};"
               onmouseover="this.style.transform='translateY(-2px) scale(1.05)'; this.style.boxShadow='0 6px 12px ${style.shadowColor}, 0 0 20px ${style.glowColor}, inset 0 1px 2px rgba(255,255,255,0.3)'"
               onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 8px ${style.shadowColor}, inset 0 1px 2px rgba(255,255,255,0.2)'">
            <span style="color: ${style.textColor}; font-size: 0.6rem; font-weight: bold; text-shadow: ${style.textShadow}; margin-bottom: 1px; z-index: 2;">${light.name}</span>
            <div style="color: ${style.textColor}; font-size: 0.7rem; font-weight: bold; text-shadow: ${style.textShadow}; text-align: center; line-height: 1.1; z-index: 2;" id="${light.id}Amount">0</div>
            <div id="${light.id}Buff" style="z-index: 2;"></div>
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%); pointer-events: none; z-index: 1;"></div>
          </div>
        `;
        }).join('')}
      </div>
    </div>
    <div id="calibrationModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; margin: 0; padding: 0; background: rgba(0,0,0,0.8); z-index: 10000; box-sizing: border-box;">
      <div style="background: #1a1a2e; border-radius: 15px; padding: 1.5rem; width: 500px; max-width: 75vw; max-height: 85vh; overflow-y: auto; text-align: center; border: 2px solid #4a9eff; box-shadow: 0 0 30px rgba(74, 158, 255, 0.3); position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; line-height: 1.4;">
        <h2 id="calibrationTitle" style="color: #4a9eff; margin-bottom: 1rem;">Light Spectrum Calibration</h2>
        <canvas id="waveCanvas" width="420" height="180" style="border: 2px solid #333; border-radius: 8px; background: #000; margin: 0.8rem 0; max-width: 100%;"></canvas>
        <div style="margin: 1rem 0;">
          <label style="color: #fff; display: block; margin-bottom: 0.5rem;">Wave Frequency: <span id="frequencyDisplay">1.00</span> Hz</label>
          <div id="frequencyScrollArea" style="width: 80%; height: 60px; margin: 0 auto; border: 2px solid #4a9eff; border-radius: 8px; background: linear-gradient(135deg, #2a2a4e, #3a3a5e); display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);"
               onmouseover="this.style.background='linear-gradient(135deg, #3a3a5e, #4a4a6e)'; this.style.borderColor='#6ab7ff'"
               onmouseout="this.style.background='linear-gradient(135deg, #2a2a4e, #3a3a5e)'; this.style.borderColor='#4a9eff'">
            <span style="color: #fff; font-size: 0.9rem; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">??? Scroll to adjust frequency</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 1rem 0; color: #fff;">
          <div><span id="calibrationStableLightLabel">Stable Light</span>: <span id="calibrationStableLight">0</span></div>
          <div>Time: <span id="calibrationTime">0</span>s</div>
        </div>
        <div style="margin: 0.5rem 0; color: #ffffff; font-weight: bold; text-align: center;">
          Current Light: <span id="calibrationCurrentLight">0</span>
        </div>
        <div style="margin: 0.5rem 0; color: #4CAF50; font-weight: bold; text-align: center;">
          Stable Light Rate: <span id="calibrationTimeMultiplier">x1.0</span>
        </div>
        <div style="margin: 0.5rem 0; color: #44ff44; font-weight: bold; text-align: center;">
          Session Efficiency: <span id="calibrationDiminishingReturns">/1.000</span>
        </div>
        <div style="margin: 0.5rem 0; color: #ff6666; font-weight: bold; text-align: center;">
          Current Nerf: /<span id="calibrationCurrentNerf">1</span> to light gain
        </div>
        <div style="margin-top: 1.5rem;">
          <button id="activateCalibrationBtn" onclick="startCalibration()"
                  style="background: #4CAF50; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; margin: 0 0.5rem; cursor: pointer; font-weight: bold;">
            Activate
          </button>
          <button id="stopCalibrationBtn" onclick="stopCalibration()"
                  style="background: #f44336; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; margin: 0 0.5rem; cursor: pointer; font-weight: bold; display: none;">
            Stop
          </button>
          <button onclick="closeCalibrationModal()"
                  style="background: #666; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; margin: 0 0.5rem; cursor: pointer; font-weight: bold;">
            Close
          </button>
        </div>
      </div>
    </div>
    <style>
      #viAdvancedPrismSpeechBubble::after {
        content: '';
        position: absolute;
        left: -18px;
        top: 18px;
        width: 0;
        height: 0;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-right: 18px solid #fffbe8;
      }
      .spectrum-button {
        position: relative;
        overflow: hidden;
      }
      .spectrum-button::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
        transform: rotate(-45deg);
        transition: all 0.6s ease;
        opacity: 0;
        z-index: 1;
      }
      .spectrum-button:hover::before {
        animation: shimmer 1.5s ease-in-out infinite;
        opacity: 1;
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%) translateY(-100%) rotate(-45deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(-45deg); }
      }
      .spectrum-button.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        filter: grayscale(0.7);
        transform: scale(0.95) !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      }
      .spectrum-button.disabled:hover {
        transform: scale(0.95) !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      }
      .spectrum-button.disabled::before {
        display: none;
      }
      .spectrum-button.active {
        animation: spectrumPulse 2s ease-in-out infinite;
      }
      @keyframes spectrumPulse {
        0%, 100% {
          box-shadow: 0 4px 8px var(--shadow-color), inset 0 1px 2px rgba(255,255,255,0.2);
        }
        50% {
          box-shadow: 0 6px 12px var(--shadow-color), 0 0 20px var(--glow-color), inset 0 1px 2px rgba(255,255,255,0.3);
        }
      }
    </style>
  `;
  setTimeout(() => {
    initializeViTokenDrops();
    updateAdvancedPrismUI();
    initializeImageSwap();
    const lightCards = document.querySelectorAll('.light-type-card');
    lightCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
      });
    });
  }, 100);
}
function playPrismCoreUpgradeAnimation(callback) {
  const pyramid = document.getElementById('pyramid');
  const levelText = document.getElementById('prismCoreLevel');
  const potentialText = document.getElementById('prismPotential');
  const upgradeBtn = document.getElementById('prismCoreUpgradeBtn');
  if (!pyramid) {
    if (callback) callback();
    return;
  }
  if (upgradeBtn) {
    upgradeBtn.disabled = true;
    upgradeBtn.style.opacity = '0.6';
  }
  const originalAnimation = pyramid.style.animation;
  pyramid.style.animation = 'upgradeSpinFast 0.15s linear infinite';
  if (levelText) {
    levelText.style.animation = 'numberFadeOut 2.5s ease-out forwards';
  }
  if (potentialText) {
    potentialText.style.animation = 'numberFadeOut 2.5s ease-out forwards';
  }
  setTimeout(() => {
    pyramid.style.animation = 'upgradeSlowToStop 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    setTimeout(() => {
      const lightBurst = document.createElement('div');
      lightBurst.className = 'prism-light-burst';
      pyramid.appendChild(lightBurst);
      setTimeout(() => {
        if (lightBurst.parentNode) {
          lightBurst.parentNode.removeChild(lightBurst);
        }
      }, 2500);
      setTimeout(() => {
        updateAdvancedPrismUI();
        if (levelText) {
          levelText.style.animation = 'numberFadeIn 1.5s ease-in forwards';
        }
        if (potentialText) {
          potentialText.style.animation = 'numberFadeIn 1.5s ease-in forwards';
        }
      }, 1000);
      setTimeout(() => {
        pyramid.style.animation = originalAnimation || 'spin 8s linear infinite';
        if (upgradeBtn) {
          upgradeBtn.disabled = false;
          upgradeBtn.style.opacity = '1';
        }
        if (levelText) levelText.style.animation = '';
        if (potentialText) potentialText.style.animation = '';
        if (callback) callback();
      }, 3000);
    }, 3000);
  }, 3000);
}
let prismCoreState = {
  level: new Decimal(1),
  potential: new Decimal(0),
  upgradeCosts: [
    new Decimal("1e100"),
    new Decimal("1e200"),
    new Decimal("1e360"),
    new Decimal("1e727")
  ]
};
if (typeof window.prismState === 'undefined') {
  window.prismState = {};
}
window.prismState.prismcore = prismCoreState;
function calculatePrismPotential() {
  let potential = new Decimal(1);
  lightTypes.forEach(light => {
    let amount = new Decimal(1);
    if (window.prismState && typeof window.prismState[light.id] !== 'undefined') {
      const stateAmount = new Decimal(window.prismState[light.id]);
      if (stateAmount.gt(0)) {
        amount = stateAmount;
      }
    }
    potential = potential.mul(amount);
  });
  prismCoreState.potential = potential;
  return potential;
}
function getPrismCoreUpgradeCost() {
  const level = prismCoreState.level.toNumber();
  if (level <= prismCoreState.upgradeCosts.length) {
    return prismCoreState.upgradeCosts[level - 1] || new Decimal(Math.pow(10, level * 2));
  }
  return new Decimal(Math.pow(10, level * 2));
}
function getPrismCoreMultiplier() {
  const level = prismCoreState.level.toNumber();
  if (level <= 1) return new Decimal(1);
  return new Decimal(5).pow(level - 1);
}
window.getPrismCoreMultiplier = getPrismCoreMultiplier;
function performPrismCoreReset() {
  if (!window.prismState) return;
  const lightTypes = ['light', 'redlight', 'orangelight', 'yellowlight', 'greenlight', 'bluelight'];
  lightTypes.forEach(lightType => {
    window.prismState[lightType] = new Decimal(0);
  });
  const particleTypes = ['lightparticle', 'redlightparticle', 'orangelightparticle', 'yellowlightparticle', 'greenlightparticle', 'bluelightparticle'];
  particleTypes.forEach(particleType => {
    window.prismState[particleType] = new Decimal(0);
  });
  if (window.prismState.generatorUpgrades) {
    lightTypes.forEach(lightType => {
      window.prismState.generatorUpgrades[lightType] = 0;
    });
  }
  if (window.prismState.generatorUnlocked) {
    lightTypes.forEach(lightType => {
      if (lightType === 'light') {
        window.prismState.generatorUnlocked[lightType] = true;
      } else {
        window.prismState.generatorUnlocked[lightType] = false;
      }
    });
  }
  lightTypes.forEach(lightType => {
    const accKey = `${lightType}Accumulator`;
    if (window.prismState[accKey]) {
      window.prismState[accKey] = new Decimal(0);
    }
  });
  if (advancedPrismState.calibration) {
    lightTypes.forEach(lightType => {
      advancedPrismState.calibration.stable[lightType] = new Decimal(0);
    });
    lightTypes.forEach(lightType => {
      advancedPrismState.calibration.nerfs[lightType] = new Decimal(1);
    });
    lightTypes.forEach(lightType => {
      advancedPrismState.calibration.totalTimeAccumulated[lightType] = 0;
    });
    advancedPrismState.calibration.activeMinigame = null;
    advancedPrismState.calibration.minigameStartTime = 0;
  }
  if (window.clearPrismDOMCache) {
    window.clearPrismDOMCache();
  }
}
function attemptPrismCoreUpgrade() {
  const cost = getPrismCoreUpgradeCost();
  const potential = calculatePrismPotential();
  if (potential.gte(cost)) {
    const previousLevel = prismCoreState.level.toNumber();
    prismCoreState.level = prismCoreState.level.add(1);
    const newLevel = prismCoreState.level.toNumber();
    window.prismState.prismcore = prismCoreState;
    playPrismCoreUpgradeAnimation(() => {
      performPrismCoreReset();
      if (typeof saveGame === 'function') {
        saveGame();
      }
      if (previousLevel === 1 && newLevel === 2) {
        if (window.prismState) {
          if (!window.prismState.yellowlight || window.prismState.yellowlight.eq(0)) {
            window.prismState.yellowlight = new Decimal(1);
          }
          if (!window.prismState.yellowlightunlocked) {
            window.prismState.yellowlightunlocked = true;
          }
        }
        if (window.updatePrismUI) {
          window.updatePrismUI();
        }
        showViSpeech(`Prism Core upgraded to level ${prismCoreState.level}! The enhanced crystal resonance has unlocked Yellow Light production! All previous progress has been reset to harness the new energy.`, 6000);
      } else {
        showViSpeech(`Prism Core upgraded to level ${prismCoreState.level}! The crystalline structure grows more complex. All previous progress has been reset to stabilize the new configuration.`, 5000);
      }
      updateAdvancedPrismUI();
      if (window.forceUpdateAllLightCounters) {
        window.forceUpdateAllLightCounters();
      }
      if (window.updateLightGeneratorButtons) {
        window.updateLightGeneratorButtons();
      }
    });
  } else {
    const needed = cost.sub(potential);
    showViSpeech(`You need ${formatNumber(needed)} more prism potential to upgrade the core. Try gathering more light types!`, 4000);
  }
}
function updateAdvancedPrismUI() {
  const potential = calculatePrismPotential();
  const potentialEl = document.getElementById('prismPotential');
  if (potentialEl) potentialEl.textContent = formatNumber(potential);
  const coreLevelEl = document.getElementById('prismCoreLevel');
  const coreLevelDisplayEl = document.getElementById('prismCoreLevelDisplay');
  if (coreLevelEl) coreLevelEl.textContent = prismCoreState.level.toString();
  if (coreLevelDisplayEl) coreLevelDisplayEl.textContent = prismCoreState.level.toString();
  const upgradeBtn = document.getElementById('prismCoreUpgradeBtn');
  if (upgradeBtn) {
    const cost = getPrismCoreUpgradeCost();
    const canUpgrade = potential.gte(cost);
    if (canUpgrade) {
      upgradeBtn.disabled = false;
      upgradeBtn.style.background = '#4CAF50';
      upgradeBtn.style.cursor = 'pointer';
      upgradeBtn.textContent = `Upgrade Core (${formatNumber(cost)})`;
    } else {
      upgradeBtn.disabled = true;
      upgradeBtn.style.background = '#666';
      upgradeBtn.style.cursor = 'not-allowed';
      upgradeBtn.textContent = `Upgrade Core (${formatNumber(cost)})`;
    }
  }
  updateViCharacterImage();
  updateCoreBoostCard();
  lightTypes.forEach(light => {
    const amountEl = document.getElementById(`${light.id}Amount`);
    const cardEl = document.querySelector(`[data-light-type="${light.id}"]`);
    if (amountEl && cardEl) {
      const stableAmount = advancedPrismState.calibration.stable[light.id];
      let displayText = '0';
      const regularLightAmount = window.prismState && window.prismState[light.id] ? window.prismState[light.id] : new Decimal(0);
      if (regularLightAmount.lte(0)) {
        cardEl.classList.add('disabled');
      } else {
        cardEl.classList.remove('disabled');
      }
      if (stableAmount && stableAmount.gt(0)) {
        if (stableAmount.gte(1000)) {
          displayText = formatNumber(stableAmount);
        } else {
          displayText = stableAmount.toFixed(1);
        }
      } else {
        displayText = '0';
      }
      amountEl.innerHTML = displayText;
      const buffEl = document.getElementById(`${light.id}Buff`);
      if (buffEl) {
        buffEl.innerHTML = getStableLightBuffDisplay(light.id);
      }
    }
  });
}
function updateCoreBoostCard() {
  try {
    const boostsList = document.getElementById('coreBoostsList');
    const nextUnlockInfo = document.getElementById('nextUnlockInfo');
    if (!boostsList || !nextUnlockInfo) return;
    const currentLevel = prismCoreState.level.toNumber();
    const currentMultiplier = getPrismCoreMultiplier();
    const multiplierText = (typeof window.formatNumber === 'function') ?
      window.formatNumber(currentMultiplier) :
      (currentMultiplier.gt(1000000) ? currentMultiplier.toExponential(2) : currentMultiplier.toString());
    let boostsHTML = `
      <div style="margin-bottom: 0.5rem;"><span style="color: #7289DA; text-shadow: 0 0 3px #7289DA, 1px 1px 2px rgba(0,0,0,0.8);">Infinity Points:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>
      <div style="margin-bottom: 0.5rem;"><span style="color: #ffffff; text-shadow: 0 0 3px #ffffff, 1px 1px 2px rgba(0,0,0,0.8);">Light:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>
      <div style="margin-bottom: 0.5rem;"><span style="color: #ff6b6b; text-shadow: 0 0 3px #ff6b6b, 1px 1px 2px rgba(0,0,0,0.8);">Red Light:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>
      <div style="margin-bottom: 0.5rem;"><span style="color: #ff9500; text-shadow: 0 0 3px #ff9500, 1px 1px 2px rgba(0,0,0,0.8);">Orange Light:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>
    `;
    if (currentLevel >= 2) {
      boostsHTML += `<div style="margin-bottom: 0.5rem;"><span style="color: #ffeb3b; text-shadow: 0 0 3px #ffeb3b, 1px 1px 2px rgba(0,0,0,0.8);">Yellow Light:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>`;
    }
    if (currentLevel >= 3) {
      boostsHTML += `<div style="margin-bottom: 0.5rem;"><span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">Green Light:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>`;
    }
    if (currentLevel >= 4) {
      boostsHTML += `<div style="margin-bottom: 0.5rem;"><span style="color: #2196F3; text-shadow: 0 0 3px #2196F3, 1px 1px 2px rgba(0,0,0,0.8);">Blue Light:</span> <span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">x${multiplierText}</span></div>`;
    }
    boostsList.innerHTML = boostsHTML;
    let nextUnlockHTML = '';
    if (currentLevel === 1) {
      nextUnlockHTML = '<span style="color: #ffeb3b; text-shadow: 0 0 3px #ffeb3b, 1px 1px 2px rgba(0,0,0,0.8);">Yellow Light Discovery:</span><br><span style="color: #ffa500; text-shadow: 0 0 3px #ffa500, 1px 1px 2px rgba(0,0,0,0.8);">Core Level 2</span>';
    } else if (currentLevel === 2) {
      nextUnlockHTML = '<span style="color: #4CAF50; text-shadow: 0 0 3px #4CAF50, 1px 1px 2px rgba(0,0,0,0.8);">Green Light Discovery:</span><br><span style="color: #ffa500; text-shadow: 0 0 3px #ffa500, 1px 1px 2px rgba(0,0,0,0.8);">Core Level 3</span>';
    } else if (currentLevel === 3) {
      nextUnlockHTML = '<span style="color: #2196F3; text-shadow: 0 0 3px #2196F3, 1px 1px 2px rgba(0,0,0,0.8);">Blue Light Discovery:</span><br><span style="color: #ffa500; text-shadow: 0 0 3px #ffa500, 1px 1px 2px rgba(0,0,0,0.8);">Core Level 4</span>';
    } else if (currentLevel === 4) {
      nextUnlockHTML = '<span style="color: #9C27B0; text-shadow: 0 0 3px #9C27B0, 1px 1px 2px rgba(0,0,0,0.8);">Purple Light Discovery:</span><br><span style="color: #ffa500; text-shadow: 0 0 3px #ffa500, 1px 1px 2px rgba(0,0,0,0.8);">Core Level 5</span>';
    } else {
      nextUnlockHTML = '<span style="color: #FFD700; text-shadow: 0 0 3px #FFD700, 1px 1px 2px rgba(0,0,0,0.8);">Maximum Level Reached!</span>';
    }
    nextUnlockInfo.innerHTML = nextUnlockHTML;
  } catch (error) {
    const boostsList = document.getElementById('coreBoostsList');
    const nextUnlockInfo = document.getElementById('nextUnlockInfo');
    if (boostsList) {
      boostsList.innerHTML = '<div style="color: #ff6b6b;">Error loading boosts</div>';
    }
    if (nextUnlockInfo) {
      nextUnlockInfo.innerHTML = '<div style="color: #ff6b6b;">Error loading unlock info</div>';
    }
  }
}
function attemptAdvancedPrismReset() {
  if (!advancedPrismState.resetLayer.canReset) {
    showViSpeech("You don't have enough progress to reset yet. Keep working on the regular prism features first.", 4000);
    return;
  }
  const confirmReset = confirm("Are you sure you want to reset all light progress? This will set all light counts, particles, and generator upgrades back to 0, but you'll keep your prism core level and any unlocked features.");
  if (confirmReset) {
    performPrismCoreReset();
    showViSpeech("Prism reset complete! All light progress has been cleared to make way for new discoveries.", 4000);
    if (window.forceUpdateAllLightCounters) {
      window.forceUpdateAllLightCounters();
    }
    if (window.updateLightGeneratorButtons) {
      window.updateLightGeneratorButtons();
    }
    updateAdvancedPrismUI();
  }
}
function checkAdvancedPrismUnlock() {
  if (window.state && window.state.seenElement25StoryModal) {
    advancedPrismState.unlocked = true;
    const advancedBtn = document.getElementById('prismAdvancedBtn');
    if (advancedBtn) {
      advancedBtn.style.display = 'block';
    } else {
    }
    const advancedTab = document.getElementById('prismAdvancedTab');
    if (advancedTab && advancedTab.style.display !== 'none') {
      renderAdvancedPrismUI();
    }
  } else {
  }
}
function formatNumber(num) {
  if (!num || (!num.toString && typeof num !== 'number')) return '0';
  if (typeof num === 'number' || typeof num === 'string') {
    num = new Decimal(num);
  }
  return DecimalUtils.formatDecimal(num);
}
function initAdvancedPrism() {
  if (window.prismState && window.prismState.prismcore) {
    try {
      const savedCore = window.prismState.prismcore;
      if (savedCore.level) {
        prismCoreState.level = new Decimal(savedCore.level);
      }
      if (savedCore.potential) {
        prismCoreState.potential = new Decimal(savedCore.potential);
      }
      window.prismState.prismcore = prismCoreState;
    } catch (error) {
    }
  }
  if (window.prismState && window.prismState.advancedPrismState) {
    try {
      const savedAdvanced = window.prismState.advancedPrismState;
      if (savedAdvanced.calibration && savedAdvanced.calibration.stable) {
        Object.keys(savedAdvanced.calibration.stable).forEach(lightType => {
          if (savedAdvanced.calibration.stable[lightType] !== undefined) {
            advancedPrismState.calibration.stable[lightType] = new Decimal(savedAdvanced.calibration.stable[lightType]);
          }
        });
      }
      if (savedAdvanced.calibration && savedAdvanced.calibration.nerfs) {
        Object.keys(savedAdvanced.calibration.nerfs).forEach(lightType => {
          if (savedAdvanced.calibration.nerfs[lightType] !== undefined) {
            advancedPrismState.calibration.nerfs[lightType] = new Decimal(savedAdvanced.calibration.nerfs[lightType]);
          }
        });
      }
      if (savedAdvanced.calibration) {
        if (savedAdvanced.calibration.sessionPenalty) {
          Object.keys(savedAdvanced.calibration.sessionPenalty).forEach(lightType => {
            if (savedAdvanced.calibration.sessionPenalty[lightType] !== undefined) {
              advancedPrismState.calibration.sessionPenalty[lightType] = new Decimal(savedAdvanced.calibration.sessionPenalty[lightType]);
            }
          });
        }
        if (savedAdvanced.calibration.totalTimeAccumulated) {
          Object.assign(advancedPrismState.calibration.totalTimeAccumulated, savedAdvanced.calibration.totalTimeAccumulated);
        }
      }
      if (savedAdvanced.unlocked !== undefined) {
        advancedPrismState.unlocked = savedAdvanced.unlocked;
      }
      if (savedAdvanced.imagesSwapped !== undefined) {
        advancedPrismState.imagesSwapped = savedAdvanced.imagesSwapped;
      }
      if (savedAdvanced.hasCompletedLabClicks !== undefined) {
        advancedPrismState.hasCompletedLabClicks = savedAdvanced.hasCompletedLabClicks;
      }
    } catch (error) {
    }
  }
  if (window.prismState) {
    window.prismState.advancedPrismState = advancedPrismState;
  }
  Object.keys(advancedPrismState.calibration.stable).forEach(lightType => {
    if (!DecimalUtils.isDecimal(advancedPrismState.calibration.stable[lightType])) {
      advancedPrismState.calibration.stable[lightType] = new Decimal(advancedPrismState.calibration.stable[lightType] || 0);
    }
  });
  Object.keys(advancedPrismState.calibration.nerfs).forEach(lightType => {
    if (!DecimalUtils.isDecimal(advancedPrismState.calibration.nerfs[lightType])) {
      advancedPrismState.calibration.nerfs[lightType] = new Decimal(advancedPrismState.calibration.nerfs[lightType] || 1);
    }
  });
  Object.keys(advancedPrismState.calibration.sessionPenalty).forEach(lightType => {
    if (!DecimalUtils.isDecimal(advancedPrismState.calibration.sessionPenalty[lightType])) {
      advancedPrismState.calibration.sessionPenalty[lightType] = new Decimal(advancedPrismState.calibration.sessionPenalty[lightType] || 1.0);
    }
  });
  checkAdvancedPrismUnlock();
  window.showAdvancedPrismViResponse = showAdvancedPrismViResponse;
  window.showAdvancedPrismViSpeech = showAdvancedPrismViSpeech;
  hookIntoTokenSystem();
  resetImageSwapState();
  setupSubTabResetHooks();
  if (advancedPrismState.unlocked) {
    renderAdvancedPrismUI();
  }
  if (window.daynight && typeof window.daynight.onTimeChange === 'function') {
    const originalOnTimeChange = window.daynight.onTimeChange;
    window.daynight.onTimeChange = function(newPhase) {
      if (originalOnTimeChange) originalOnTimeChange(newPhase);
      updateViCharacterImage();
    };
  }
}
window.pokeVi = pokeVi;
window.attemptAdvancedPrismReset = attemptAdvancedPrismReset;
window.updateAdvancedPrismUI = updateAdvancedPrismUI;
window.initAdvancedPrism = initAdvancedPrism;
window.renderAdvancedPrismUI = renderAdvancedPrismUI;
window.checkAdvancedPrismUnlock = checkAdvancedPrismUnlock;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdvancedPrism);
} else {
  setTimeout(initAdvancedPrism, 100);
}
setTimeout(() => {
  checkAndUpdateNerfDecaySystem();
  setInterval(checkAndUpdateNerfDecaySystem, 5000);
}, 2000);
if (window.gameTick && !window._advancedPrismGameTickPatched) {
  const originalGameTick = window.gameTick;
  window.gameTick = function() {
    if (originalGameTick) originalGameTick();
    const advancedArea = document.getElementById('prismAdvancedArea');
    if (advancedArea && advancedArea.style.display !== 'none') {
      updateAdvancedPrismUI();
    }
  };
  window._advancedPrismGameTickPatched = true;
}
function hookIntoAdvancedPrismTab() {
  const advancedBtn = document.getElementById('prismAdvancedBtn');
  if (advancedBtn && !advancedBtn._advancedPrismHooked) {
    const originalOnClick = advancedBtn.onclick;
    advancedBtn.onclick = function() {
      if (originalOnClick) originalOnClick();
      const advancedArea = document.getElementById('prismAdvancedArea');
      if (advancedArea && !advancedArea._advancedPrismInitialized) {
        renderAdvancedPrismUI();
        advancedArea._advancedPrismInitialized = true;
      }
      setTimeout(() => {
        const greetingMessages = viSpeechPatterns.greeting;
        const randomGreeting = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
        showViSpeech(randomGreeting, 4000);
      }, 500);
    };
    advancedBtn._advancedPrismHooked = true;
  }
}
hookIntoAdvancedPrismTab();
setTimeout(hookIntoAdvancedPrismTab, 1000);
setTimeout(setupSwariaCharacterOverrides, 1500);
setTimeout(() => {
  advancedPrismState.imagesSwapped = false;
}, 500);
setTimeout(setupSubTabResetHooks, 2000);
window.testViTokenDrop = function(tokenType = 'prisma') {
  if (window.showGiveTokenModal) {
    const result = window.showGiveTokenModal(tokenType, 'Vivien');
  } else {
  }
};
window.testViSpeech = function(message = 'Test speech message') {
  showViSpeech(message, 3000);
};
window.testViResponse = function(message = 'Test token response') {
  if (window.showViResponse) {
    window.showViResponse(message, false);
  } else {
  }
};
window.testManualModal = function() {
  const modal = document.getElementById('giveTokenModal');
  if (modal) {
    modal.style.display = 'flex';
    const title = document.getElementById('giveTokenModalTitle');
    const img = document.getElementById('giveTokenModalImg');
    if (title) title.textContent = 'Test Token Modal';
    if (img) img.src = 'assets/icons/prisma token.png';
  } else {
  }
};
window.checkAdvancedPrismState = function() {
};
function attemptImageSwap() {
  const seenElement25Story = window.state && window.state.seenElement25StoryModal;
  if (!seenElement25Story) {
    return;
  }
  if (!advancedPrismState.hasCompletedLabClicks) {
    return;
  }
  const roll = Math.random();
  if (roll < 0.1) {
    advancedPrismState.imagesSwapped = !advancedPrismState.imagesSwapped;
    performImageSwap();
    if (typeof saveGame === 'function') {
      saveGame();
    }
  } else {
  }
}
function performImageSwap() {
  const prismCharacterImg = document.getElementById('prismCharacter');
  const viCharacterNormal = document.getElementById('viCharacterNormal');
  const viCharacterTalking = document.getElementById('viCharacterTalking');
  const viCharacterSleeping = document.getElementById('viCharacterSleeping');
  const viCharacterSleepTalking = document.getElementById('viCharacterSleepTalking');
  const prismSpeechBubble = document.getElementById('speechBubble');
  const viSpeechBubble = document.getElementById('viAdvancedPrismSpeechBubble');
  if (!prismCharacterImg || !viCharacterNormal) {
    return;
  }
  if (advancedPrismState.imagesSwapped) {
    moveImagesToSwappedPositions();
  } else {
    moveImagesToOriginalPositions();
  }
  updateViCharacterImage();
  setupSwariaCharacterOverrides();
}
function moveImagesToSwappedPositions() {
  const prismCharacterImg = document.getElementById('prismCharacter');
  const viCharacterContainer = document.querySelector('#prismAdvancedArea .card');
  const prismCharacterContainer = document.querySelector('#prismMainArea .card.swaria-character-box');
  const viCharacters = [
    document.getElementById('viCharacterNormal'),
    document.getElementById('viCharacterTalking'),
    document.getElementById('viCharacterSleeping'),
    document.getElementById('viCharacterSleepTalking')
  ];
  if (prismCharacterImg && viCharacterContainer && prismCharacterContainer) {
    const swariaClone = prismCharacterImg.cloneNode(true);
    swariaClone.id = 'swariaInAdvanced';
    swariaClone.style.width = '250px';
    swariaClone.style.height = '250px';
    swariaClone.style.borderRadius = '12px';
    swariaClone.style.cursor = 'pointer';
    swariaClone.style.position = 'absolute';
    swariaClone.style.top = '50%';
    swariaClone.style.left = '50%';
    swariaClone.style.transform = 'translate(-50%, -50%)';
    swariaClone.onclick = function() {
      pokeAdvancedPrismCharacter();
    };
    prismCharacterImg.style.display = 'none';
    viCharacterContainer.appendChild(swariaClone);
    const currentViState = advancedPrismState.viCurrentState || 'normal';
    viCharacters.forEach((img, index) => {
      if (img) {
        const shouldBeVisible = (
          (currentViState === 'normal' && img.id === 'viCharacterNormal') ||
          (currentViState === 'talking' && img.id === 'viCharacterTalking') ||
          (currentViState === 'sleeping' && img.id === 'viCharacterSleeping') ||
          (currentViState === 'sleepTalking' && img.id === 'viCharacterSleepTalking')
        );
        img.style.display = 'none';
        const viClone = img.cloneNode(true);
        viClone.id = img.id + 'InMain';
        viClone.style.display = shouldBeVisible ? 'block' : 'none';
        viClone.style.cursor = 'pointer';
        viClone.onclick = function() {
          pokeMainPrismCharacter();
        };
        prismCharacterContainer.appendChild(viClone);
      }
    });
  } else {
  }
}
function moveImagesToOriginalPositions() {
  const swariaClone = document.getElementById('swariaInAdvanced');
  const viClones = [
    document.getElementById('viCharacterNormalInMain'),
    document.getElementById('viCharacterTalkingInMain'),
    document.getElementById('viCharacterSleepingInMain'),
    document.getElementById('viCharacterSleepTalkingInMain')
  ];
  if (swariaClone) {
    swariaClone.remove();
  }
  const originalSwaria = document.getElementById('prismCharacter');
  if (originalSwaria) {
    originalSwaria.style.display = 'block';
  }
  viClones.forEach(clone => {
    if (clone) clone.remove();
  });
  const originalViImages = [
    document.getElementById('viCharacterNormal'),
    document.getElementById('viCharacterTalking'),
    document.getElementById('viCharacterSleeping'),
    document.getElementById('viCharacterSleepTalking')
  ];
  originalViImages.forEach(img => {
    if (img) {
      img.style.display = 'none';
    }
  });
  updateViCharacterImage();
}
function addImageSwapToLabButton() {
  const labBtn = document.getElementById('prismSubTabBtn');
  if (labBtn && !labBtn.hasAttribute('data-swap-hooked')) {
    const originalOnClick = labBtn.onclick;
    labBtn.onclick = function() {
      if (originalOnClick) originalOnClick.call(this);
      if (!advancedPrismState.hasCompletedLabClicks) {
        advancedPrismState.labTabClicks++;
        if (advancedPrismState.labTabClicks >= 10) {
          advancedPrismState.hasCompletedLabClicks = true;
          if (typeof saveGame === 'function') {
            saveGame();
          }
        }
      } else {
      }
      attemptImageSwap();
      if (boughtElements && boughtElements[25] && !advancedPrismState.hasShownLabDialogue) {
        if (!advancedPrismState.hasShownLabDialogue) {
          setTimeout(() => {
            if (!advancedPrismState.hasShownLabDialogue) {
              showViLabDialogue();
            } else {
            }
          }, 300);
        } else {
        }
      } else {
        if (advancedPrismState.hasShownLabDialogue) {
        } else if (!boughtElements || !boughtElements[25]) {
        }
      }
      setTimeout(() => {
        const prismMainTabBtn = document.getElementById('prismTabBtn');
        if (prismMainTabBtn && typeof prismMainTabBtn.click === 'function') {
          prismMainTabBtn.click();
        } else if (typeof window.switchHomeSubTab === 'function') {
          window.switchHomeSubTab('prismSubTab');
        }
        setTimeout(() => {
          const mainArea = document.getElementById('prismMainArea');
          const advancedArea = document.getElementById('prismAdvancedArea');
          const mainBtn = document.getElementById('prismMainBtn');
          const advancedBtn = document.getElementById('prismAdvancedBtn');
          if (mainArea && advancedArea && mainBtn && advancedBtn) {
            mainArea.style.display = 'block';
            advancedArea.style.display = 'none';
            mainBtn.classList.add('active');
            advancedBtn.classList.remove('active');
            window.currentPrismSubTab = 'main';
          }
        }, 50);
      }, 100);
    };
    labBtn.setAttribute('data-swap-hooked', 'true');
  }
}
function addClickCounterToAdvancedButton() {
  const prismAdvancedBtn = document.getElementById('prismAdvancedBtn');
  if (!prismAdvancedBtn) {
    return false;
  }
  prismAdvancedBtn.removeAttribute('data-counter-hooked');
  const currentOnClick = prismAdvancedBtn.onclick;
  if (currentOnClick) {
    prismAdvancedBtn.onclick = function() {
      const result = currentOnClick.call(this);
      advancedPrismState.advancedTabClicks++;
      if (advancedPrismState.unlocked) {
        renderAdvancedPrismUI();
      }
      attemptImageSwap();
      if (advancedPrismState.unlocked) {
        setTimeout(() => {
          startViRandomSpeechTimer();
        }, 100);
      } else {
      }
      return result;
    };
    prismAdvancedBtn.setAttribute('data-counter-hooked', 'true');
    return true;
  } else {
    return false;
  }
}
function initializeImageSwap() {
  addClickCounterToAdvancedButton();
  addImageSwapToLabButton();
}
function updateNerfDisplayInterval(intervalMs) {
  if (window.prismNerfDisplayInterval) {
    clearInterval(window.prismNerfDisplayInterval);
  }
  window.prismNerfDisplayInterval = setInterval(() => {
    if (window.updateNerfDisplay) {
      window.updateNerfDisplay();
    }
  }, intervalMs);
}
window.testVivienEnhancedDecayTicks = function() {
  if (!window.friendship || !window.friendship.Lab || window.friendship.Lab.level < 15) {
    return;
  }
  if (!nerfDecayInterval) {
    startEnhancedNerfDecaySystem();
  } else {
  }
  const hasNerfs = Object.keys(advancedPrismState.calibration.nerfs).some(lightType => {
    return advancedPrismState.calibration.nerfs[lightType].gt(1);
  });
};
window.checkNerfDecaySystemStatus = function() {
  if (advancedPrismState.calibration?.nerfs) {
    Object.keys(advancedPrismState.calibration.nerfs).forEach(lightType => {
      const nerf = advancedPrismState.calibration.nerfs[lightType];
      if (nerf.gt(1)) {
      }
    });
  }
};
let nerfDisplayUpdateTimes = [];
let nerfDisplayTrackingEnabled = false;
window.startTrackingNerfDisplayUpdates = function() {
  nerfDisplayUpdateTimes = [];
  nerfDisplayTrackingEnabled = true;
  if (window.updateNerfDisplay && !window.updateNerfDisplay._tracked) {
    const originalUpdateNerfDisplay = window.updateNerfDisplay;
    window.updateNerfDisplay = function() {
      if (nerfDisplayTrackingEnabled) {
        const now = Date.now();
        nerfDisplayUpdateTimes.push(now);
        if (nerfDisplayUpdateTimes.length > 1) {
          const lastTime = nerfDisplayUpdateTimes[nerfDisplayUpdateTimes.length - 2];
          const timeDiff = now - lastTime;
        } else {
        }
      }
      return originalUpdateNerfDisplay.apply(this, arguments);
    };
    window.updateNerfDisplay._tracked = true;
  }
};
window.stopTrackingNerfDisplayUpdates = function() {
  nerfDisplayTrackingEnabled = false;
  if (nerfDisplayUpdateTimes.length > 1) {
    const intervals = [];
    for (let i = 1; i < nerfDisplayUpdateTimes.length; i++) {
      intervals.push(nerfDisplayUpdateTimes[i] - nerfDisplayUpdateTimes[i - 1]);
    }
    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const minInterval = Math.min(...intervals);
      const maxInterval = Math.max(...intervals);
    }
  } else {
  }
  nerfDisplayUpdateTimes = [];
};
