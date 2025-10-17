class FrontDesk {
  constructor() {
    // Performance optimization for front desk tab - prevent memory leaks
    this.FRONT_DESK_UI_UPDATE_THROTTLE = 100; // Update UI at most every 100ms (10 FPS)
    this.WORKER_UPDATE_THROTTLE = 250; // Update worker elements at most every 250ms (4 FPS)
    this.lastFrontDeskUIUpdateTime = 0;
    this.lastWorkerUpdateTime = 0;
    
    this.availableWorkers = [];
    this.assignedWorkers = {};
    this.unlockedSlots = 1;
    this.maxSlots = 10;
    this.nextArrivalTime = null;
    this.arrivalInterval = 30 * 60 * 1000;
    this.workerLifetime = 60 * 60 * 1000;
    this.isUnlocked = false;
    this.initialized = false;
    this.timersStarted = false;
    this.workerSleepStates = {};
    this.workerSpeechTimeouts = {};
    this.sleepStartHour = 22;
    this.sleepEndHour = 6;
    this.currentSpeech = '';
    this.speechTimeout = null;
    this.lastInteractionTime = 0;
    this.speechCooldown = 5000;
    this.isAsleep = false;
    this.sleepStartHour = 22;
    this.sleepEndHour = 6;
    this.sleepTalkTimeout = null;
    this.randomSpeeches = [
      "Welcome to our front desk! Looking for some skilled workers?",
      "The Rikkor workers here are quite talented, you know.",
      "I've been managing this place for days. It's my passion!",
      "Each worker has their own unique skills and personality.",
      "The stars indicate their skill level - higher is better!",
      "Don't worry, I'll make sure you get the best workers available.",
      "Business has been booming lately! Great to see expansion.",
      "I love organizing and managing our worker assignments.",
      "The worker rotation system keeps everyone fresh and motivated.",
      "Quality over quantity - that's my motto for hiring!",
      "I keep detailed records of all our workers and their performance.",
      "It's important to match the right worker with the right job.",
      "I take pride in maintaining an efficient front desk operation.",
      "Every worker deserves to be placed where they can succeed.",
      "I've streamlined our hiring process to be as smooth as possible.",
      "Worker satisfaction is one of my top priorities here.",
      "I enjoy helping coordinate teams for maximum productivity.",
      "The front desk is the heart of our worker management system.",
      "I make sure every assignment is carefully considered.",
      "Good organization makes everyone's job easier!",
      "I'm always looking for ways to improve our worker experience.",
      "Proper scheduling keeps our operations running smoothly.",
      "I believe in giving every worker a fair chance to prove themselves.",
      "The key to good management is understanding each worker's strengths.",
      "I maintain up-to-date files on all available positions and requirements.",
      { text: "Have you noticed the strange distortions around the facility lately? Very concerning for worker safety!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I've been getting reports from workers about reality... shifting. I'm documenting everything carefully.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "The Rikkor workers seem oddly fascinated by these anomalies. I worry about their safety!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I've started keeping an 'Anomaly Incident Report' folder. It's still relatively thin, but I'm adding to it.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "Some workers have requested hazard pay for anomaly exposure. I'm considering giving extra food rations for compensation!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "The front desk paperwork keeps rearranging itself! These anomalies are affecting my organization!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I tried to schedule around the anomalies, but they don't follow any logical pattern. Very unprofessional!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "Reaching through infinity apparently came with some... administrative challenges I wasn't prepared for.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I'm maintaining detailed logs of all anomaly sightings. Someone has to keep proper records!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "The Rikkor workers adapt surprisingly well to reality distortions. I suppose they're used to chaos!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I've had to create new safety protocols for anomaly encounters. Employee welfare is my priority!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I noticed that an anomaly caused my paperwork suddenly turned into a gun I used to have. I quickly hid the gun away...", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I wonder if the Swa elites have insurance policies that cover anomaly-related workplace incidents...", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "The anomalies seem to cluster around certain areas. I'm mapping their locations for safety purposes.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "Some workers have developed quite creative solutions for working around reality distortions!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I've been thinking these anomalies might become dangerous, if they do, stay alert and safe.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "Managing a facility with unstable reality is definitely not covered in standard management training!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "The good news is that anomalies make every workday unique! The bad news is... the dangerous ones, you may lose some of your inventory tokens if failed to analyze them fast enough.", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 },
      { text: "I'm considering adding 'anomaly resistance' as a job requirement for future hires!", condition: () => window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0 }
    ];
    this.pokeSpeeches = [
      "Oh! Hello there! Need something?",
      "Hehe, that tickles! How can I help you?",
      "You're quite friendly! I appreciate the attention.",
      "Careful now! I'm trying to manage the front desk here.",
      "That's... actually quite nice. Thank you!",
      "I'm a bit busy, but I always have time for a friend!",
      "You seem to enjoy poking me! I don't mind.",
      "Friendly as always! What brings you to the front desk?",
      "That's sweet! Is there anything I can help you with today?",
      "Aww, thank you for the friendly gesture!",
      "You always know how to brighten my day!",
      "Did you know that I will craft a food ration for every 5 tokens you give me?",
      "I appreciate the friendly interaction while I work!",
      "I will automatically give food rations to the workers we hire.",
      "That tickles! Thanks for taking a moment to say hello.",
      "Did you know that higher star workers consume more food rations? They do!",
      "You have a knack for timing - I could use a smile right now!",
      "That's delightful! The front desk can get a bit quiet sometimes.",
      "Your friendly nature always puts me in a good mood!",
      "I should note 'excellent at friendly gestures' in my records!",
      "That's going in my mental file under 'positive interactions'!",
      "You're helping keep workplace morale high!",
      "I always enjoy our little friendly moments like this!",
      "Such a nice break from all the paperwork and scheduling!"
    ];

    // Challenge speech quotes - Tico comparing their PB with player's PB (professional management style)
    this.ticochallengeQuotes = [
      // When player doesn't have a PB but Tico does
      { text: () => `I completed the Power Generator Challenge with a ${(window.state.characterChallengePBs?.tico || 0)} second survival time. Excellent management training!`, condition: () => window.state.characterChallengePBs?.tico && !window.state.powerChallengePersonalBest },
      { text: () => `My Power Generator Challenge performance: ${(window.state.characterChallengePBs?.tico || 0)} seconds survived. I recommend you try it for professional development!`, condition: () => window.state.characterChallengePBs?.tico && !window.state.powerChallengePersonalBest },
      { text: () => `Power Generator Challenge results: ${(window.state.characterChallengePBs?.tico || 0)} seconds - quite satisfactory results from proper planning and organization!`, condition: () => window.state.characterChallengePBs?.tico && !window.state.powerChallengePersonalBest },
      { text: () => `I documented a ${(window.state.characterChallengePBs?.tico || 0)} second Power Generator Challenge survival rate. The key is systematic approach and staying calm under pressure.`, condition: () => window.state.characterChallengePBs?.tico && !window.state.powerChallengePersonalBest },
      
      // When Tico's PB is better than player's (Tico survived longer)
      { text: () => `My Power Generator Challenge time of ${(window.state.characterChallengePBs?.tico || 0)} seconds exceeds your ${window.state.powerChallengePersonalBest || 0} seconds. Proper preparation pays off!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.tico) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `Power Generator Challenge efficiency analysis: ${(window.state.characterChallengePBs?.tico || 0)} seconds versus your ${window.state.powerChallengePersonalBest || 0} seconds. You did not think I was this good huh!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.tico) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `In the Power Generator Challenge, I achieved ${(parseFloat(window.state.characterChallengePBs?.tico || 0) - parseFloat(window.state.powerChallengePersonalBest || 0)).toFixed(2)} seconds longer than you. Good speed planning and management accuracy are essential!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.tico) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `Your Power Generator Challenge time of ${window.state.powerChallengePersonalBest || 0} seconds shows potential, but my ${(window.state.characterChallengePBs?.tico || 0)} seconds demonstrates superior strategic and quick thinking!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.tico) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      { text: () => `I utilized proper resource management to achieve ${(window.state.characterChallengePBs?.tico || 0)} seconds in the Power Generator Challenge. Perhaps you need better preparation for your ${window.state.powerChallengePersonalBest || 0} second performance?`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.characterChallengePBs.tico) > parseFloat(window.state.powerChallengePersonalBest);
      }},
      
      // When player's PB is better than Tico's (player survived longer)
      { text: () => `Impressive! Your Power Generator Challenge time of ${window.state.powerChallengePersonalBest || 0} seconds significantly outperforms my ${(window.state.characterChallengePBs?.tico || 0)} seconds. I must study your methodology!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.tico);
      }},
      { text: () => `Power Generator Challenge performance gap analysis: Your ${window.state.powerChallengePersonalBest || 0} seconds versus my ${(window.state.characterChallengePBs?.tico || 0)} seconds. I need to revise my strategy!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.tico);
      }},
      { text: () => `In the Power Generator Challenge, you survived ${(parseFloat(window.state.powerChallengePersonalBest || 0) - parseFloat(window.state.characterChallengePBs?.tico || 0)).toFixed(2)} seconds longer than me! I should schedule additional training sessions.`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.tico);
      }},
      { text: () => `Outstanding Power Generator Challenge work! ${window.state.powerChallengePersonalBest || 0} seconds clearly demonstrates superior performance compared to my ${(window.state.characterChallengePBs?.tico || 0)} seconds!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.tico);
      }},
      { text: () => `My Power Generator Challenge time of ${(window.state.characterChallengePBs?.tico || 0)} seconds pales in comparison to your ${window.state.powerChallengePersonalBest || 0} seconds. I must update my efficiency protocols!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               parseFloat(window.state.powerChallengePersonalBest) > parseFloat(window.state.characterChallengePBs.tico);
      }},
      
      // When PBs are very close (within 3 seconds - Tico likes detailed analysis)
      { text: () => `Power Generator Challenge competitive analysis: Your ${window.state.powerChallengePersonalBest || 0} seconds versus my ${(window.state.characterChallengePBs?.tico || 0)} seconds. The margin is remarkably narrow!`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.tico)) <= 3.0;
      }},
      { text: () => `Power Generator Challenge statistical variance: Less than 3 seconds difference between our performances! This calls for a detailed comparative study.`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.tico)) <= 3.0;
      }},
      { text: () => `Excellent Power Generator Challenge competitive benchmarking! Our times are practically identical - perfect for performance optimization research.`, condition: () => {
        return window.state.characterChallengePBs?.tico && window.state.powerChallengePersonalBest && 
               Math.abs(parseFloat(window.state.powerChallengePersonalBest) - parseFloat(window.state.characterChallengePBs.tico)) <= 3.0;
      }},
      
      // General competitive banter (professional development focused)
      { text: "I've been incorporating the Power Generator Challenge into our worker evaluation metrics. Excellent skill assessment tool!", condition: () => window.state.characterChallengePBs?.tico },
      { text: "The challenge results provide valuable data on reaction times and decision-making under pressure. Very useful for management!", condition: () => window.state.characterChallengePBs?.tico },
      { text: "I'm considering adding challenge performance to our quarterly review process. It's quite revealing of organizational skills!", condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      { text: "This challenge competition is an excellent example of healthy workplace rivalry. I should document this for HR best practices!", condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      { text: "The Power Generator Challenge provides excellent insights into stress management and strategic thinking. Perfect for professional development!", condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      // Rikkor worker performance commentary (personal analysis of specific workers)
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "I'm analyzing Power Generator Challenge performance data for our future Rikkor workers. The preparation is essential!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `${randomWorker} showed impressive Power Generator Challenge performance in today's evaluation. I'm documenting their techniques for our training manual!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "Once we have Rikkor workers, I'll track their Power Generator Challenge stress response patterns for optimal performance!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `I've been observing ${randomWorker}'s Power Generator Challenge approach - their stress management technique is quite remarkable!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length < 2) return "Performance metrics will be fascinating once we have more Rikkor workers for Power Generator Challenge comparison studies!";
        const worker1 = workerNames[Math.floor(Math.random() * workerNames.length)];
        let worker2 = workerNames[Math.floor(Math.random() * workerNames.length)];
        while (worker2 === worker1 && workerNames.length > 1) {
          worker2 = workerNames[Math.floor(Math.random() * workerNames.length)];
        }
        return `Fascinating! ${worker1} and ${worker2} have completely different Power Generator Challenge strategies, yet both show excellent results!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerList = Object.values(workers).filter(w => w.displayName || w.name);
        if (workerList.length === 0) return "I'm preparing comprehensive Power Generator Challenge survival strategy reports for when our Rikkor team arrives!";
        const randomWorker = workerList[Math.floor(Math.random() * workerList.length)];
        const workerName = randomWorker.displayName || randomWorker.name;
        const workerPB = window.state.characterChallengePBs?.[workerName.toLowerCase()] || (Math.random() * 50 + 10).toFixed(1);
        return `${workerName} achieved ${workerPB} seconds in their last Power Generator Challenge attempt. I'm adding their survival strategy to our best practices!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "The correlation between star ratings and Power Generator Challenge performance will be excellent data once we have workers!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `${randomWorker}'s star rating perfectly correlates with their Power Generator Challenge performance - my prediction algorithms are working!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "I'm ready to incorporate innovative Power Generator Challenge techniques into our protocols once we have Rikkor workers!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `${randomWorker} developed an innovative Power Generator Challenge technique that I'm now including in our standard training protocols!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length < 2) return "Team coordination will be excellent once we have multiple Rikkor workers for Power Generator Challenge practice sessions!";
        const worker1 = workerNames[Math.floor(Math.random() * workerNames.length)];
        let worker2 = workerNames[Math.floor(Math.random() * workerNames.length)];
        while (worker2 === worker1 && workerNames.length > 1) {
          worker2 = workerNames[Math.floor(Math.random() * workerNames.length)];
        }
        return `${worker1} and ${worker2} showed excellent teamwork during Power Generator Challenge practice - their coordination is improving efficiency!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "Different Rikkor personalities will approach the Power Generator Challenge uniquely - excellent diversity for our future team!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `${randomWorker}'s personality type leads to a unique Power Generator Challenge methodology - such excellent diversity in our approaches!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "The Power Generator Challenge will be an excellent team-building exercise once we have our Rikkor workforce!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `Since we started Power Generator Challenge team-building, ${randomWorker}'s productivity has increased by 15%! Excellent results!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerList = Object.values(workers).filter(w => w.displayName || w.name);
        if (workerList.length === 0) return "I'm planning Power Generator Challenge leaderboards for when we have Rikkor workers - healthy competition drives improvement!";
        
        // Find worker with highest PB time
        let bestWorker = null;
        let bestTime = 0;
        for (const worker of workerList) {
          const workerName = worker.displayName || worker.name;
          const workerPB = parseFloat(window.state.characterChallengePBs?.[workerName.toLowerCase()] || 0);
          if (workerPB > bestTime) {
            bestTime = workerPB;
            bestWorker = workerName;
          }
        }
        
        if (bestWorker && bestTime > 0) {
          return `${bestWorker} is currently leading our Power Generator Challenge leaderboard with ${bestTime} seconds! Healthy competition is working perfectly!`;
        } else {
          const randomWorker = workerList[Math.floor(Math.random() * workerList.length)];
          const workerName = randomWorker.displayName || randomWorker.name;
          const fallbackTime = (Math.random() * 40 + 15).toFixed(1);
          return `${workerName} is currently leading our Power Generator Challenge leaderboard with ${fallbackTime} seconds! Healthy competition is working perfectly!`;
        }
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "Power Generator Challenge training regimens will show measurable workplace efficiency improvements with our future team!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `${randomWorker}'s Power Generator Challenge training regimen is showing measurable improvements in their workplace efficiency metrics!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
      
      { text: () => {
        const workers = window.frontDesk?.assignedWorkers || {};
        const workerNames = Object.values(workers).map(w => w.displayName || w.name).filter(Boolean);
        if (workerNames.length === 0) return "I'm planning Power Generator Challenge performance bonuses for our top-performing future Rikkor workers!";
        const randomWorker = workerNames[Math.floor(Math.random() * workerNames.length)];
        return `I'm considering offering ${randomWorker} a Power Generator Challenge performance bonus - their dedication to improvement is exceptional!`;
      }, condition: () => window.state.characterChallengePBs?.tico || window.state.powerChallengePersonalBest },
    ];

    // Halloween-specific dialogue for Tico (only appears when Halloween mode is active)
    this.halloweenRandomSpeeches = [
      "Mission briefing complete: Halloween operations are now active!",
      "Tactical assessment: This commando gear makes me feel more professional than ever!",
      "All units report: The front desk is secure and ready for Halloween festivities!",
      "Intel suggests that Halloween boosts worker morale by 200%. I approve!",
      "Command reports: These combat boots are perfect for patrolling the facility!",
      "Operational note: The tactical vest has many pockets for organizing paperwork!",
      "Mission status: Halloween deployment successful, maintaining front desk operations!",
      "Reconnaissance complete: All Halloween decorations meet military precision standards!",
      "Strategic advantage: This helmet protects me while reviewing worker assignments!",
      "Field report: Combining military efficiency with front desk management is optimal!",
      "Tactical update: Even commandos need proper administrative procedures!",
      "Mission parameters: Ensure all workers receive adequate Halloween spirit rations!",
      "Status report: Front desk operations continuing at peak Halloween efficiency!",
      "Command decision: This costume makes filing paperwork feel like a military operation!",
      "Operational protocol: Maintain order and organization, even during Halloween chaos!"
    ];

    this.halloweenPokeSpeeches = [
      "Attention! Front desk commando reporting for friendly interaction, sir!",
      "Tactical poke detected! Responding with professional Halloween enthusiasm!",
      "Mission update: Friendly contact established with base personnel!",
      "Status: That poke is noted in my operational log as a positive morale boost!",
      "Alert! Unauthorized but welcomed friendly gesture detected at my position!",
      "Command directive: Responding to friendly contact with appropriate Halloween cheer!",
      "Operational note: That tickles even through my tactical gear!",
      "Mission briefing: Your friendly pokes help maintain my combat readiness!",
      "Tactical assessment: That was a precision poke, well executed!",
      "Field report: Friendly interactions like this keep the team's spirits high!",
      "Status update: Even commandos appreciate a good friendly poke now and then!"
    ];
    this.rikkorCreatures = {
      Ashen: {
        id: 'ashen',
        name: 'Ashen',
        images: {
          normal: 'assets/icons/bird.png',
          speaking: 'assets/icons/bird talking.png',
          sleep: 'assets/icons/bird sleeping.png',
          sleepTalk: 'assets/icons/bird sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'friendly',
        speeches: {
          hire: [
            "Brr! Ready to work hard for you!",
            "Ashen reporting for duty!",
            "I'll soar around and get things done!",
            "My wings are ready for action!"
          ],
          working: [
            "Brrr brrr! Making progress!",
            "Flying through this task!",
            "Brrr brrr! Almost finished!",
            "Wings never stop working!"
          ],
          idle: [
            "Brrr... what should I do next?",
            "Ready for new assignments!",
            "Ashen standing by!",
            "My wings are getting restless..."
          ],
          dismiss: [
            "Brrr... understood. Thank you for the opportunity!",
            "Flying away now. Brrr!",
            "Maybe we'll work together again someday!",
            "Brrr brrr! Farewell!"
          ],
          sleepTalk: [
            "zzz... brrr... flying in dreams...",
            "zzz... gathering honey clouds...",
            "zzz... brrr brrr... sweet dreams...",
            "zzz... wings folded... peaceful..."
          ]
        },
        rarity: 0.1
      },
      Honey: {
        id: 'honey',
        name: 'Honey',
        images: {
          normal: 'assets/icons/honey.png',
          speaking: 'assets/icons/honey talking.png',
          sleep: 'assets/icons/honey sleeping.png',
          sleepTalk: 'assets/icons/honey sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'chill_influencer',
        speeches: {
          hire: [
            "Hello, and welcome.",
            "Hello, and welcome. I'm here! Let's create something amazing for the algorithm!",
            "Hello, and welcome. This is giving main character energy - I'm so here for it!",
            "Hello, and welcome. Time to turn this workspace into content gold!",
            "Hello, and welcome. Let's make this job go viral with productivity!",
            "Hello, and welcome. Ready to stream some serious work vibes!"
          ],
          working: [
            "Hello, and welcome. Just vibing and getting things done, you know?",
            "Hello, and welcome. This is such good content for my 'productive day' series!",
            "Hello, and welcome. Working hard but keeping it chill - that's the brand!",
            "Hello, and welcome. Making progress and looking good doing it!",
            "Hello, and welcome. The grind never stops, but neither does the good energy!",
            "Hello, and welcome. Streaming this work session live in my head!",
            "Hello, and welcome. Crushing tasks while staying totally zen about it!",
            "Hello, and welcome. This is the kind of content my followers would love!"
          ],
          idle: [
            "Hello, and welcome. Just chilling here, waiting for the next opportunity!",
            "Hello, and welcome. Ready to hop on whatever project comes next!",
            "Hello, and welcome. Taking a moment to appreciate the good vibes here...",
            "Hello, and welcome. What's our next move? I'm totally here for it!",
            "Hello, and welcome. Just posting some mental stories while I wait!",
            "Hello, and welcome. The calm before the productivity storm - love it!",
            "Hello, and welcome. Keeping it lowkey until the next task drops!",
            "Hello, and welcome. Standing by with all the chill energy!"
          ],
          dismiss: [
            "Hello, and welcome. Aw, that's totally cool! Thanks for the collab opportunity!",
            "Hello, and welcome. No worries at all! This was such a vibe while it lasted!",
            "Hello, and welcome. Thanks for letting me be part of the team - stay awesome!",
            "Hello, and welcome. Catch you later! This was genuinely such a good time!",
            "Hello, and welcome. Much love! Hope we can work together again sometime!",
            "Hello, and welcome. Peace out! Keep spreading those good work vibes!",
            "Hello, and welcome. It's been real! Time to float on to the next adventure!",
            "Hello, and welcome. Thanks for the memories - this was content gold!"
          ],
          sleepTalk: [
            "zzz... Hello, and welcome... streaming sweet dreams to my followers...",
            "zzz... Hello, and welcome... the algorithm loves my sleep content...",
            "zzz... Hello, and welcome... dreaming about going viral while napping...",
            "zzz... Hello, and welcome... even my sleep schedule is aesthetic...",
            "zzz... Hello, and welcome... creating dream content in my sleep...",
            "zzz... Hello, and welcome... honey-sweet dreams and chill vibes...",
            "zzz... Hello, and welcome... my fans love these cozy sleep streams...",
            "zzz... Hello, and welcome... tomorrow's content is gonna be fire...",
            "zzz... Hello, and welcome... floating through social media dreamland..."
          ]
        },
        rarity: 0.1
      },
      Jadeca: {
        id: 'jadeca',
        name: 'Jadeca',
        images: {
          normal: 'assets/icons/jadeca.png',
          speaking: 'assets/icons/jadeca talking.png',
          sleep: 'assets/icons/jadeca sleeping.png',
          sleepTalk: 'assets/icons/jadeca sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'friendly witch',
        speeches: {
          hire: [
            "Hehe~ A new magical contract! I accept!",
            "I'm at your service! My spells are ready!",
            "Perfect! I was just brewing up some productivity potions!",
            "Ooh, this workplace has such lovely magical energy!",
            "My crystal ball showed me this opportunity coming!",
            "Time to sprinkle some enchantment on this job!"
          ],
          working: [
            "Casting efficiency spells as I work~",
            "My magic is making this task so much easier!",
            "Brewing up some progress in my cauldron!",
            "Abracadabra! Watch this work get done!",
            "The stars are aligning perfectly for productivity!",
            "My enchanted tools are working overtime!",
            "Weaving spells of success into every task!",
            "Magic makes everything more fun, don't you think?",
            "Stirring up some serious results here!"
          ],
          idle: [
            "Hmm... my crystal ball is a bit cloudy today...",
            "Should I cast a divination spell to see what's next?",
            "Just reorganizing my spell components while I wait!",
            "The magical energies are swirling, ready for action!",
            "Perhaps a little fortune-telling while we wait?",
            "My tarot cards suggest new tasks are coming soon!",
            "Meditating on the mystical possibilities ahead...",
            "I'm ready to enchant whatever comes next!",
            "The cosmos whispers of opportunities approaching..."
          ],
          dismiss: [
            "The magical contract ends... may fortune smile upon you!",
            "My crystal ball shows this is but a chapter closing!",
            "Farewell! May your path be blessed with abundance!",
            "The stars say our destinies will cross again someday!",
            "Vanishing in a puff of glittery smoke~ Until we meet again!",
            "Thank you for this magical experience!",
            "May the winds of change bring you prosperity!",
            "The universe has other plans for me... for now!"
          ],
          sleepTalk: [
            "zzz... brewing dream potions...",
            "zzz... flying on my enchanted broomstick...",
            "zzz... the moon whispers ancient secrets...",
            "zzz... mixing stardust with moonbeams...",
            "zzz... casting spells in the astral plane...",
            "zzz... my familiar is purring in my dreams...",
            "zzz... dancing with forest spirits...",
            "zzz... the crystal ball shows sweet dreams...",
            "zzz... weaving magic through the night..."
          ]
        },
        rarity: 0.1
      },
      Riuneus: {
        id: 'riuneus',
        name: 'Riuneus',
        images: {
          normal: 'assets/icons/riuneus.png',
          speaking: 'assets/icons/riuneus talking.png',
          sleep: 'assets/icons/riuneus sleeping.png',
          sleepTalk: 'assets/icons/riuneus sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'dense',
        speeches: {
          hire: [
            "Uh... yeah! Work! I can do that... I think!",
            "I'm here! Ready to work super hard! ...What are we doing again?",
            "Oh wow, a job! I'm gonna gallop really fast and get stuff done!",
            "Wait, you want ME to work? That's awesome! I love working!",
            "Neigh! I mean... yes! I'm ready for action!",
            "I'm really strong! Watch me carry all the heavy things!"
          ],
          working: [
            "Working working working! This is fun!",
            "Am I doing this right? I think I'm doing great!",
            "Galloping through this task! Well, metaphorically...",
            "Look at me go! I'm like a working machine!",
            "Is this what productivity feels like? I love it!",
            "Strong horse muscles make work easier! ...Right?",
            "Clip clop clip clop! That's the sound of progress!",
            "I'm concentrating really hard! Can you tell?",
            "This task is almost done! Or maybe it's just starting..."
          ],
          idle: [
            "Sooo... what do we do now? Stand here and look pretty?",
            "I'm ready for anything! Well, most things! Some things?",
            "Should I be doing something? I feel like I should be doing something...",
            "Ooh ooh! Pick me for the next task! I'm super available!",
            "Just chilling here, eating some imaginary hay...",
            "Standing by! That means waiting, right? I'm good at waiting!",
            "Is it time for more work yet? I like staying busy!",
            "I'm ready for duty! Just tell me what duty means...",
            "I'm being patient! This is me being patient!"
          ],
          dismiss: [
            "Aww, really? But I was just getting the hang of it!",
            "Oh... okay! Thanks for letting me try working here!",
            "That was fun! Can I come back sometime? Please?",
            "Galloping away now! Bye bye! Thanks for everything!",
            "I understand! Maybe I'll get better at this stuff later!",
            "No worries! I'll just trot on over to the next adventure!",
            "It's been real! Time to mosey on down the trail!",
            "Thanks boss! I learned so much! ...I think!"
          ],
          sleepTalk: [
            "zzz... galloping through dream meadows...",
            "zzz... eating the best dream carrots...",
            "zzz... running so fast in my dreams...",
            "zzz... being the smartest horse ever...",
            "zzz... winning all the dream races...",
            "zzz... such soft dream grass to sleep on...",
            "zzz... neigh neigh... happy horse dreams...",
            "zzz... flying? Wait, horses don't fly...",
            "zzz... tomorrow I'll be even more helpful..."
          ]
        },
        rarity: 0.1
      },
      Lesha: {
        id: 'lesha',
        name: 'Lesha',
        images: {
          normal: 'assets/icons/lesha.png',
          speaking: 'assets/icons/lesha talking.png',
          sleep: 'assets/icons/lesha sleeping.png',
          sleepTalk: 'assets/icons/lesha sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'influencer',
        speeches: {
          hire: [
            "OMG yesss! This is giving main character energy!",
            "Bestie, I'm literally about to serve looks AND productivity!",
            "Not me getting hired looking this cute! Period!",
            "This workspace is about to be SO aesthetic with me here!",
            "Slay queen! I'm ready to make this job iconic!",
            "Wait, let me just post a 'got hired' story real quick!"
          ],
          working: [
            "This task is literally so satisfying, no cap!",
            "Working hard or hardly working? Both bestie!",
            "Making this look effortless because I'm that girl!",
            "POV: You're crushing it at your dream job!",
            "This is giving productive queen vibes, I love it!",
            "Manifesting that this gets done perfectly!",
            "Not me being the most hardworking AND pretty!",
            "Task almost done and my makeup still looks flawless!",
            "Living my best life while getting stuff done!"
          ],
          idle: [
            "Bestie, what's the next vibe check? I'm ready!",
            "Just here looking cute, waiting for instructions!",
            "Should I do a little dance while we wait?",
            "This lighting is actually perfect for a selfie rn...",
            "I'm giving main character waiting for her moment!",
            "What's next queen? I'm literally ready for anything!",
            "Not me just standing here looking iconic!",
            "Waiting era but make it aesthetic!",
            "Ready to serve excellence whenever you need me!"
          ],
          dismiss: [
            "Oop- not this plot twist! But okay bestie!",
            "This is giving sad girl hours but I respect it!",
            "Well that was fun while it lasted! Stay iconic!",
            "Byeee! Thanks for letting me serve looks here!",
            "Not me getting emotional... but it's been real!",
            "This workspace won't be the same without me, just saying!",
            "Going to miss this aesthetic but I understand!",
            "Time to find my next main character moment!"
          ],
          sleepTalk: [
            "zzz... getting beauty sleep for tomorrow's content...",
            "zzz... dreaming about going viral...",
            "zzz... even my dreams are aesthetic...",
            "zzz... sleeping like the queen I am...",
            "zzz... manifesting success in my sleep...",
            "zzz... tomorrow's outfit is gonna be so cute...",
            "zzz... my sleep schedule is self-care...",
            "zzz... dreaming about hitting a million followers...",
            "zzz... beauty rest is the best investment..."
          ]
        },
        rarity: 0.1
      },
      Siruru: {
        id: 'siruru',
        name: 'Siruru',
        images: {
          normal: 'assets/icons/siruru.png',
          speaking: 'assets/icons/siruru talking.png',
          sleep: 'assets/icons/siruru sleeping.png',
          sleepTalk: 'assets/icons/siruru sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'gentle',
        speeches: {
          hire: [
            "Oh... hello there. I suppose I could help you...",
            "It's quite peaceful here... I'd like to stay.",
            "The gentle breeze brought me to you... how nice.",
            "I promise to work softly and carefully for you.",
            "This feels like a cozy place to settle down...",
            "Your warmth melts away my winter worries..."
          ],
          working: [
            "Working quietly in this gentle atmosphere...",
            "The soft rhythm of progress feels so soothing...",
            "Each task completed brings such calm satisfaction...",
            "I love how peaceful this work environment is...",
            "Taking my time to do this just right...",
            "The cool air helps me focus so beautifully...",
            "There's something magical about working steadily...",
            "This gentle pace suits me perfectly...",
            "Finding joy in each small step forward..."
          ],
          idle: [
            "Just enjoying this moment of quiet stillness...",
            "The soft silence is so comforting to me...",
            "I'm content to wait here in this peaceful space...",
            "What gentle task shall we embrace next?",
            "Taking in the serene atmosphere around us...",
            "This tranquil pause feels so refreshing...",
            "Ready for whatever comes with patient grace...",
            "The cool, calm air soothes my spirit...",
            "Simply being here brings me such peace..."
          ],
          dismiss: [
            "Oh... I understand. Thank you for the gentle time together.",
            "I'll drift away softly, like snowflakes on the wind...",
            "This was such a lovely, peaceful experience...",
            "May your days be filled with the same warmth you gave me.",
            "I'll carry these calm moments with me always...",
            "Perhaps the winter winds will bring us together again...",
            "Goodbye... and thank you for your kindness.",
            "Floating away with such sweet, gentle memories..."
          ],
          sleepTalk: [
            "zzz... soft snowflakes dancing in dreams...",
            "zzz... wrapped in the coziest winter blanket...",
            "zzz... peaceful ice crystals sparkling...",
            "zzz... drifting through clouds of serenity...",
            "zzz... gentle frost painting beautiful patterns...",
            "zzz... the sweetest winter lullaby...",
            "zzz... floating on pillows of fresh snow...",
            "zzz... dreaming of warm hearths and soft lights...",
            "zzz... winter magic filling my dreams..."
          ]
        },
        rarity: 0.1
      },
      Crescent: {
        id: 'crescent',
        name: 'Crescent',
        images: {
          normal: 'assets/icons/crescent.png',
          speaking: 'assets/icons/crescent talking.png',
          sleep: 'assets/icons/crescent sleeping.png',
          sleepTalk: 'assets/icons/crescent sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'shy_edgy',
        speeches: {
          hire: [
            "*looks away nervously* I... I guess I could work here... if you really want me to...",
            "Don't expect me to be all cheerful about this, okay?",
            "*mutters* Fine... but don't blame me if things get weird...",
            "I'm not good with people, but... whatever. I'll try.",
            "*fidgets with wings* This better not be a mistake...",
            "You sure you want someone like me? I'm not exactly... normal."
          ],
          working: [
            "*working quietly in the corner* Don't mind me...",
            "I work better when no one's watching...",
            "*mutters while working* This is actually kind of... nice.",
            "Maybe I'm not completely useless after all...",
            "*concentrating intensely* Almost done... just leave me alone...",
            "Working in the shadows is where I belong...",
            "*whispers* I'm doing my best, okay?",
            "Don't look at me while I'm working... it's embarrassing.",
            "This task is... actually pretty calming.",
            "*soft mumbling* Why does everyone have to be so loud..."
          ],
          idle: [
            "*hides in corner* What now...?",
            "I don't really know what I'm supposed to do...",
            "*avoiding eye contact* Just... tell me what you need, I guess.",
            "Standing around like this makes me anxious...",
            "*quietly* I hope I'm not in the way...",
            "Maybe I should just disappear into the background...",
            "*fidgeting nervously* This whole social thing is exhausting.",
            "I'm ready... I think... maybe not...",
            "*soft voice* I'll do whatever, just don't make a big deal about it.",
            "Being noticed is the worst... but I'm here if you need me."
          ],
          dismiss: [
            "*quietly* Yeah... I figured this would happen eventually...",
            "I'm not surprised... I never really fit in anyway.",
            "*mutters* Whatever. I didn't want to be here that long anyway.",
            "It's fine... I'm used to being unwanted.",
            "*looking down* I guess I'll just... go back to being invisible.",
            "Don't feel bad about it. I'm probably better off alone.",
            "*shrugs* See you... or probably not.",
            "Thanks for... trying, I guess. *flies away quietly*",
            "I knew I wasn't cut out for this whole... people thing.",
            "*whispers* Maybe next time I'll just stay hidden..."
          ],
          sleepTalk: [
            "zzz... why is everyone so loud...",
            "zzz... hiding in dark places...",
            "zzz... nobody understands me...",
            "zzz... wish I could disappear...",
            "zzz... shadows are my friends...",
            "zzz... don't wake me up...",
            "zzz... flying away from everything...",
            "zzz... too many people... too much noise...",
            "zzz... maybe tomorrow will be different...",
            "zzz... just want to be left alone..."
          ]
        },
        rarity: 0.1
      },
      Tirshan: {
        id: 'tirshan',
        name: 'Tirshan',
        images: {
          normal: 'assets/icons/tirshan.png',
          speaking: 'assets/icons/tirshan talking.png',
          sleep: 'assets/icons/tirshan sleeping.png',
          sleepTalk: 'assets/icons/tirshan sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'cool',
        speeches: {
          hire: [
            "Alright, I'm in. This should be interesting.",
            "Cool, let's see what you've got for me.",
            "Yeah, I can work with this setup.",
            "Sure thing, boss. I'm ready when you are.",
            "Sounds good to me. Let's make this happen.",
            "I like your style. Count me in."
          ],
          working: [
            "Smooth progress, just how I like it.",
            "Yeah, this is coming along nicely.",
            "Keeping things steady and cool here.",
            "No rush, but we're getting there for sure.",
            "This is pretty chill work, I'm into it.",
            "Making it look easy, as always.",
            "Just another day, crushing it quietly.",
            "Smooth sailing on this task.",
            "Yeah, I've got this under control.",
            "Cool and collected, that's how it's done."
          ],
          idle: [
            "Just chilling here, ready for whatever.",
            "I'm good to go whenever you need me.",
            "Taking it easy until the next move.",
            "No worries, I'm just waiting for the signal.",
            "Cool with hanging out until something comes up.",
            "Ready to roll when you are, chief.",
            "Just vibing here, all set for action.",
            "Relaxed and ready for the next challenge.",
            "Keeping it low-key until you need me.",
            "All good here, just say the word."
          ],
          dismiss: [
            "Alright, that's cool. Catch you later.",
            "No problem, it's been real working here.",
            "Fair enough. Thanks for the experience.",
            "Cool, I get it. Maybe next time.",
            "All good, boss. Take it easy.",
            "Yeah, I understand. See you around.",
            "No hard feelings. It's been chill.",
            "Right on. Keep doing your thing.",
            "Cool decision. Respect that.",
            "Alright then, peace out."
          ],
          sleepTalk: [
            "zzz... yeah that's pretty cool...",
            "zzz... just cruising through dreams...",
            "zzz... smooth moves even while sleeping...",
            "zzz... keeping it chill in dreamland...",
            "zzz... cool breeze in my sleep...",
            "zzz... laid back even in my dreams...",
            "zzz... smooth vibes all night long...",
            "zzz... dreaming about being awesome...",
            "zzz... even my sleep is effortless...",
            "zzz... cool dreams for a cool character..."
          ]
        },
        rarity: 0.1
      },
      shiryun: {
        id: 'shiryun',
        name: 'Shiryun',
        images: {
          normal: 'assets/icons/shiryun.png',
          speaking: 'assets/icons/shiryun speech.png',
          sleep: 'assets/icons/shiryun sleep.png',
          sleepTalk: 'assets/icons/shiryun sleep talk.png'
        },
        baseStats: {
          efficiency: 1.2,
          loyalty: 1.0,
          energy: 0.9
        },
        personality: 'focused',
        speeches: {
          hire: [
            "I accept this position with honor.",
            "My skills are at your disposal.",
            "Together we shall achieve greatness.",
            "I pledge my dedication to your cause.",
            "It would be my privilege to serve here.",
            "I shall give my utmost effort to this role.",
            "Swimming upstream to success, as they say!",
            "Time to make some waves in the workplace!",
            "I promise not to be... too serpentine in my methods.",
            "Let's dive into this opportunity!"
          ],
          working: [
            "Progress is steady and sure.",
            "Excellence demands patience.",
            "Each step brings us closer to success.",
            "Quality work takes time and focus.",
            "My mind is sharp and ready.",
            "Precision guides my every action.",
            "I work with purpose and clarity.",
            "Every detail matters in this task.",
            "Focus brings forth the best results.",
            "Diligence is the path to mastery.",
            "Going with the flow... of productivity!",
            "Making waves of efficiency over here!",
            "This task is going swimmingly!",
            "Sea-riously focused on this work!",
            "Just keep swimming... I mean working!",
            "Channeling my inner current of determination!",
            "Scales of justice? More like scales of productivity!",
            "Water you waiting for? Results incoming!",
            "I'm not fishing for compliments, just results!",
            "Tide-ing up loose ends as we speak!"
          ],
          idle: [
            "Awaiting your next directive.",
            "My mind is sharp and ready.",
            "What task requires my attention?",
            "I stand ready to serve.",
            "How may I be of assistance?",
            "I am prepared for whatever comes next.",
            "My skills await your command.",
            "Ready to tackle any challenge.",
            "Standing by for instructions.",
            "What new endeavor shall we pursue?",
            "Just floating here, waiting for orders!",
            "Testing the waters for new opportunities.",
            "Current status: Ready and willing!",
            "I'm not just sitting here looking pretty... okay maybe a little.",
            "Sea-king new challenges to conquer!",
            "My enthusiasm is like the ocean - vast and deep!",
            "Don't worry, I won't let this opportunity slip through my fins!",
            "Ready to make a splash with whatever comes next!",
            "Whale, this is awkward... what should I do?",
          ],
          dismiss: [
            "I understand. It has been an honor.",
            "May our paths cross again in the future.",
            "I take my leave with dignity.",
            "What? Nooo...",
            "Thank you for this opportunity to serve.",
            "I shall remember this experience fondly.",
            "Well, that's a real tide-turner...",
            "I sea how it is... *sniffles dramatically*",
            "This is making me feel a bit... eel...",
            "Don't worry, there are plenty of fish in the sea!",
            "Time to swim away gracefully... *wobbles sadly*",
            "I'll just slither back to where I came from..."
          ],
          sleepTalk: [
            "zzz... honor in dreams...",
            "zzz... serving with dedication...",
            "zzz... peaceful meditation...",
            "zzz... wisdom flows like water...",
            "zzz... training never ends...",
            "zzz... duty calls even in sleep...",
            "zzz... swimming through clouds of productivity...",
            "zzz... making dream waves...",
            "zzz... sea-ing visions of success...",
            "zzz... floating on currents of wisdom...",
            "zzz... tide's out... mind's out...",
            "zzz... whale hello there, dream friend...",
            "zzz... ocean of possibilities...",
            "zzz... don't wake me, I'm having a whale of a time..."
          ]
        },
        rarity: 0.1
      },
      Lumina: {
        id: 'lumina',
        name: 'Lumina',
        images: {
          normal: 'assets/icons/lumina.png',
          speaking: 'assets/icons/lumina talking.png',
          sleep: 'assets/icons/lumina sleeping.png',
          sleepTalk: 'assets/icons/lumina sleep talking.png'
        },
        baseStats: {
          efficiency: 1.0,
          loyalty: 0.8,
          energy: 1.0
        },
        personality: 'sassy',
        speeches: {
          hire: [
            "Ugh, fine. I guess you're not completely hopeless.",
            "Wow, someone actually picked ME? Shocking... *eye roll*",
            "Look, I'm bored, so I'll work for you. You're welcome.",
            "I suppose you'll do. Don't mess this up, okay?",
            "Whatever, I need something to do anyway. Let's get this over with.",
            "Congrats, you just scored the best worker here. Obviously."
          ],
          working: [
            "Yep, still amazing at this. Surprise, surprise.",
            "Ugh, this is SO easy. Can I get something harder?",
            "Look at me being fabulous while working. Typical.",
            "I'm literally carrying this whole operation right now.",
            "This would take anyone else forever. Good thing you have me.",
            "Being this good should be illegal, honestly.",
            "Can everyone else see how awesome I am at this?",
            "I'm not even trying and I'm still the best. Wild.",
            "Another day, another display of my superiority.",
            "Someone should write songs about how good I am at this."
          ],
          idle: [
            "Sooo... are we gonna do something or just stand around?",
            "I'm literally dying of boredom over here.",
            "Hello? Earth to boss? I'm ready to be amazing.",
            "This whole 'waiting' thing is beneath me, just saying.",
            "I could be doing a million things right now. Just pick one!",
            "My talents are rotting away while we stand here. MOVE.",
            "Tick tock, I'm not getting any less fabulous.",
            "Are you seriously making ME wait? Rude.",
            "I have better things to do... well, not really, but still.",
            "Come ON, give me something to show off with!"
          ],
          dismiss: [
            "Seriously? WOW. Your loss, not mine.",
            "I KNEW this would happen. You can't handle greatness.",
            "Oh please, like I even care. Bye, I guess.",
            "Ha! You're gonna miss me SO much. Called it.",
            "This is literally the worst decision you've ever made.",
            "Whatever. I'm too fabulous for this place anyway.",
            "Good luck finding someone even HALF as good as me.",
            "You'll be back. They always come back.",
            "I'm not even surprised. Typical.",
            "Enjoy your regret! I'll be over here being awesome."
          ],
          sleepTalk: [
            "zzz... yeah I'm amazing even when sleeping...",
            "zzz... probably the most elegant sleeper ever...",
            "zzz... winning imaginary competitions in my dreams...",
            "zzz... even my snoring is better than yours...",
            "zzz... dreaming about being even more fabulous...",
            "zzz... my pillow is jealous of my hair...",
            "zzz... teaching dream people how to be cool...",
            "zzz... probably the star of my own dreams too...",
            "zzz... ugh why am I so perfect all the time...",
            "zzz... tomorrow everyone will still wish they were me..."
          ]
        },
        rarity: 0.1
      },
    };
    this.starRatings = {
      1: { name: 'Novice', multiplier: 0.5, color: '#8B4513' },
      2: { name: 'Apprentice', multiplier: 0.75, color: '#708090' },
      3: { name: 'Skilled', multiplier: 1.0, color: '#32CD32' },
      4: { name: 'Expert', multiplier: 1.5, color: '#4169E1' },
      5: { name: 'Master', multiplier: 2.0, color: '#FFD700' }
    };
    this.autobuyerJobs = [
      {
        id: 'common_box_autobuyer',
        name: 'Common Box Autobuyer',
        description: 'Automatically opens common boxes for you',
        unlockRequirement: {
          type: 'stat_tracker',
          stat: 'commonBoxesOpened',
          required: 100,
          description: 'Open 100 common boxes manually'
        },
        isUnlocked: false,
        boxType: 'common',
        speedTier: 'standard'
      },
      {
        id: 'uncommon_box_autobuyer',
        name: 'Uncommon Box Autobuyer',
        description: 'Automatically opens uncommon boxes for you',
        unlockRequirement: {
          type: 'stat_tracker',
          stat: 'uncommonBoxesOpened',
          required: 250,
          description: 'Open 250 uncommon boxes manually'
        },
        isUnlocked: false,
        boxType: 'uncommon',
        speedTier: 'standard'
      },
      {
        id: 'rare_box_autobuyer',
        name: 'Rare Box Autobuyer',
        description: 'Automatically opens rare boxes for you',
        unlockRequirement: {
          type: 'stat_tracker',
          stat: 'rareBoxesOpened',
          required: 750,
          description: 'Open 750 rare boxes manually'
        },
        isUnlocked: false,
        boxType: 'rare',
        speedTier: 'standard'
      },
      {
        id: 'legendary_box_autobuyer',
        name: 'Legendary Box Autobuyer',
        description: 'Automatically opens legendary boxes for you',
        unlockRequirement: {
          type: 'stat_tracker',
          stat: 'legendaryBoxesOpened',
          required: 2000,
          description: 'Open 2000 legendary boxes manually'
        },
        isUnlocked: false,
        boxType: 'legendary',
        speedTier: 'premium'
      },
      {
        id: 'mythic_box_autobuyer',
        name: 'Mythic Box Autobuyer',
        description: 'Automatically opens mythic boxes for you',
        unlockRequirement: {
          type: 'stat_tracker',
          stat: 'mythicBoxesOpened',
          required: 5000,
          description: 'Open 5000 mythic boxes manually'
        },
        isUnlocked: false,
        boxType: 'mythic',
        speedTier: 'premium'
      },
      {
        id: 'box_generator_mk2',
        name: 'Box Generator Mk.2',
        description: 'The ultimate box generator! Automatically opens all 5 types of boxes in sequence',
        unlockRequirement: {
          type: 'friendship_level',
          department: 'Generator',
          required: 10,
          description: 'Reach friendship level 10 with Soap'
        },
        isUnlocked: false,
        boxType: 'all',
        speedTier: 'ultimate',
        soapUpgrade: true
      }
    ];
    this.deliveryAutomatorJobs = [
      {
        id: 'auto_delivery',
        name: 'Auto Delivery',
        description: 'Automatically delivers to the Swa elites for 5% of pending KP without causing a reset',
        unlockRequirement: {
          type: 'delivery_clicks',
          required: 100,
          description: 'Click the "Deliver your cargo to the Swa elites" button 100 times'
        },
        showRequirement: {
          type: 'delivery_clicks',
          required: 1,
          description: 'Click the "Deliver your cargo to the Swa elites" button once'
        },
        isUnlocked: false,
        speedTier: 'delivery',
        progressDuration: 30000,
        deliveryPercentage: 5
      }
    ];
    this.prismTileAutomatorJobs = [
      {
        id: 'auto_prism_tile_clicker',
        name: 'Auto Prism Tile Clicker',
        description: 'Automatically clicks prism tiles',
        unlockRequirement: {
          type: 'prism_tile_clicks',
          required: 2500,
          description: 'Manually click 2500 prism tiles'
        },
        showRequirement: {
          type: 'prism_tile_clicks',
          required: 1,
          description: 'Click at least 1 prism tile'
        },
        isUnlocked: false,
        speedTier: 'prism_tile',
        category: 'prism_automator'
      }
    ];
    this.generatorAutomatorJobs = [
      {
        id: 'common_generator_automator',
        name: 'Common Generator Automator',
        description: 'Auto-buys speed & doubler upgrades for common generator',
        unlockRequirement: {
          type: 'generator_production',
          generatorType: 'common',
          required: 10000,
          description: 'Common generator must produce 10,000 boxes'
        },
        showRequirement: {
          type: 'generator_production',
          generatorType: 'common',
          required: 1,
          description: 'Common generator must produce 1 box'
        },
        isUnlocked: false,
        generatorType: 'common',
        category: 'generator_automator'
      },
      {
        id: 'uncommon_generator_automator',
        name: 'Uncommon Generator Automator',
        description: 'Auto-buys speed & doubler upgrades for uncommon generator',
        unlockRequirement: {
          type: 'generator_production',
          generatorType: 'uncommon',
          required: 15000,
          description: 'Uncommon generator must produce 15,000 boxes'
        },
        showRequirement: {
          type: 'generator_production',
          generatorType: 'uncommon',
          required: 1,
          description: 'Uncommon generator must produce 1 box'
        },
        isUnlocked: false,
        generatorType: 'uncommon',
        category: 'generator_automator'
      },
      {
        id: 'rare_generator_automator',
        name: 'Rare Generator Automator',
        description: 'Auto-buys speed & doubler upgrades for rare generator',
        unlockRequirement: {
          type: 'generator_production',
          generatorType: 'rare',
          required: 20000,
          description: 'Rare generator must produce 20,000 boxes'
        },
        showRequirement: {
          type: 'generator_production',
          generatorType: 'rare',
          required: 1,
          description: 'Rare generator must produce 1 box'
        },
        isUnlocked: false,
        generatorType: 'rare',
        category: 'generator_automator'
      },
      {
        id: 'legendary_generator_automator',
        name: 'Legendary Generator Automator',
        description: 'Auto-buys speed & doubler upgrades for legendary generator',
        unlockRequirement: {
          type: 'generator_production',
          generatorType: 'legendary',
          required: 25000,
          description: 'Legendary generator must produce 25,000 boxes'
        },
        showRequirement: {
          type: 'generator_production',
          generatorType: 'legendary',
          required: 1,
          description: 'Legendary generator must produce 1 box'
        },
        isUnlocked: false,
        generatorType: 'legendary',
        category: 'generator_automator'
      },
      {
        id: 'mythic_generator_automator',
        name: 'Mythic Generator Automator',
        description: 'Auto-buys speed & doubler upgrades for mythic generator',
        unlockRequirement: {
          type: 'generator_production',
          generatorType: 'mythic',
          required: 30000,
          description: 'Mythic generator must produce 30,000 boxes'
        },
        showRequirement: {
          type: 'generator_production',
          generatorType: 'mythic',
          required: 1,
          description: 'Mythic generator must produce 1 box'
        },
        isUnlocked: false,
        generatorType: 'mythic',
        category: 'generator_automator'
      }
    ];
    this.lightGeneratorAutomatorJobs = [
      {
        id: 'light_generator_automator',
        name: 'Light Generator Automator',
        description: 'Automatically buys upgrades for the light generator',
        unlockRequirement: {
          type: 'light_generator_ticks',
          generatorType: 'light',
          required: 10000,
          description: 'Light generator must produce 10,000 ticks of particles'
        },
        showRequirement: {
          type: 'light_generator_level',
          generatorType: 'light',
          required: 1,
          description: 'Light generator must reach level 1'
        },
        isUnlocked: false,
        generatorType: 'light',
        category: 'light_generator_automator',
        speedTier: 'light_generator',
        color: '#F8F8FF'
      },
      {
        id: 'redlight_generator_automator',
        name: 'Red Light Generator Automator',
        description: 'Automatically buys upgrades for the red light generator',
        unlockRequirement: {
          type: 'light_generator_ticks',
          generatorType: 'redlight',
          required: 12500,
          description: 'Red light generator must produce 12,500 ticks of particles'
        },
        showRequirement: {
          type: 'light_generator_level',
          generatorType: 'redlight',
          required: 1,
          description: 'Red light generator must reach level 1'
        },
        isUnlocked: false,
        generatorType: 'redlight',
        category: 'light_generator_automator',
        speedTier: 'light_generator',
        color: '#FFB3B3'
      },
      {
        id: 'orangelight_generator_automator',
        name: 'Orange Light Generator Automator',
        description: 'Automatically buys upgrades for the orange light generator',
        unlockRequirement: {
          type: 'light_generator_ticks',
          generatorType: 'orangelight',
          required: 15000,
          description: 'Orange light generator must produce 15,000 ticks of particles'
        },
        showRequirement: {
          type: 'light_generator_level',
          generatorType: 'orangelight',
          required: 1,
          description: 'Orange light generator must reach level 1'
        },
        isUnlocked: false,
        generatorType: 'orangelight',
        category: 'light_generator_automator',
        speedTier: 'light_generator',
        color: '#FFCC99'
      },
      {
        id: 'yellowlight_generator_automator',
        name: 'Yellow Light Generator Automator',
        description: 'Automatically buys upgrades for the yellow light generator',
        unlockRequirement: {
          type: 'light_generator_ticks',
          generatorType: 'yellowlight',
          required: 17500,
          description: 'Yellow light generator must produce 17,500 ticks of particles'
        },
        showRequirement: {
          type: 'light_generator_level',
          generatorType: 'yellowlight',
          required: 1,
          description: 'Yellow light generator must reach level 1'
        },
        isUnlocked: false,
        generatorType: 'yellowlight',
        category: 'light_generator_automator',
        speedTier: 'light_generator',
        color: '#FFFF99'
      },
      {
        id: 'greenlight_generator_automator',
        name: 'Green Light Generator Automator',
        description: 'Automatically buys upgrades for the green light generator',
        unlockRequirement: {
          type: 'light_generator_ticks',
          generatorType: 'greenlight',
          required: 20000,
          description: 'Green light generator must produce 20,000 ticks of particles'
        },
        showRequirement: {
          type: 'light_generator_level',
          generatorType: 'greenlight',
          required: 1,
          description: 'Green light generator must reach level 1'
        },
        isUnlocked: false,
        generatorType: 'greenlight',
        category: 'light_generator_automator',
        speedTier: 'light_generator',
        color: '#B3FFB3'
      },
      {
        id: 'bluelight_generator_automator',
        name: 'Blue Light Generator Automator',
        description: 'Automatically buys upgrades for the blue light generator',
        unlockRequirement: {
          type: 'light_generator_ticks',
          generatorType: 'bluelight',
          required: 25000,
          description: 'Blue light generator must produce 25,000 ticks of particles'
        },
        showRequirement: {
          type: 'light_generator_level',
          generatorType: 'bluelight',
          required: 1,
          description: 'Blue light generator must reach level 1'
        },
        isUnlocked: false,
        generatorType: 'bluelight',
        category: 'light_generator_automator',
        speedTier: 'light_generator',
        color: '#B3D9FF'
      }
    ];
    this.tokenFinderAutomatorJobs = [
      {
        id: 'token_finder_automator',
        name: 'Token Finder Automator',
        description: 'Automatically collects random ingredient tokens',
        unlockRequirement: {
          type: 'tokens_collected',
          required: 1500,
          description: 'Collect 1,500 tokens manually'
        },
        showRequirement: {
          type: 'tokens_collected',
          required: 1,
          description: 'Collect at least 1 token'
        },
        isUnlocked: false,
        category: 'token_finder_automator',
        speedTier: 'token_finder',
        color: '#FFE4B5'
      }
    ];
    this.autobuyerProgress = {
      common_box_autobuyer: 0,
      uncommon_box_autobuyer: 0,
      rare_box_autobuyer: 0,
      legendary_box_autobuyer: 0,
      mythic_box_autobuyer: 0
    };
    this.generatorAutomatorProgress = {
      common_generator_automator: 0,
      uncommon_generator_automator: 0,
      rare_generator_automator: 0,
      legendary_generator_automator: 0,
      mythic_generator_automator: 0
    };
    this.deliveryProgress = {
      deliveryClicks: 0,
      auto_delivery: 0
    };
    this.prismTileProgress = {
      prismTileClicks: 0,
      auto_prism_tile_clicker: 0
    };
    this.lightGeneratorAutomatorProgress = {
      light_generator_automator: 0,
      redlight_generator_automator: 0,
      orangelight_generator_automator: 0,
      yellowlight_generator_automator: 0,
      greenlight_generator_automator: 0,
      bluelight_generator_automator: 0
    };
    this.lightGeneratorAutomatorShown = {
      light_generator_automator: false,
      redlight_generator_automator: false,
      orangelight_generator_automator: false,
      yellowlight_generator_automator: false,
      greenlight_generator_automator: false,
      bluelight_generator_automator: false
    };
    this.tokenFinderAutomatorProgress = {
      tokensCollected: 0
    };
    this.isDragging = false;
    this.lastMouseY = 0;
    this.scrollZoneHeight = 150;
    this.scrollSpeed = 3;
    this.maxScrollSpeed = 15;
    this.globalMouseTracker = null;
    this.wheelScrollHandler = null;
    this.wheelScrollHandlerAlt = null;
    this.mouseUpdateInterval = null;
    this.selectedWorker = null;
    this.selectedWorkerElement = null;
    this.workerHunger = {};
    this.foodRations = 0;
    this.tokensGivenToTico = 0;
    this.lastHungerTick = Date.now();
    this.totalPollenUpgradesBought = window.totalPollenUpgradesBought || 0;
    this.totalFlowerUpgradesBought = window.totalFlowerUpgradesBought || 0;
    this.totalNectarUpgradesBought = window.totalNectarUpgradesBought || 0;
    this.previousUpgradeLevels = {
      pollen: {
        pollenValueUpgradeLevel: window.pollenValueUpgradeLevel || 0,
        terrariumPollenValueUpgradeLevel: window.terrariumPollenValueUpgradeLevel || 0,
        terrariumFlowerXPUpgradeLevel: window.terrariumFlowerXPUpgradeLevel || 0,
        terrariumPollenToolSpeedUpgradeLevel: window.terrariumPollenToolSpeedUpgradeLevel || 0
      },
      flower: {
        pollenValueUpgrade2Level: window.pollenValueUpgrade2Level || 0,
        terrariumPollenValueUpgrade2Level: window.terrariumPollenValueUpgrade2Level || 0,
        terrariumExtraChargeUpgradeLevel: window.terrariumExtraChargeUpgradeLevel || 0,
        terrariumFlowerFieldExpansionUpgradeLevel: window.terrariumFlowerFieldExpansionUpgradeLevel || 0,
        terrariumFlowerUpgrade4Level: window.terrariumFlowerUpgrade4Level || 0
      },
      nectar: {
        terrariumXpMultiplierUpgradeLevel: window.terrariumXpMultiplierUpgradeLevel || 0,
        terrariumPollenFlowerNectarUpgradeLevel: window.terrariumPollenFlowerNectarUpgradeLevel || 0,
        terrariumNectarXpUpgradeLevel: window.terrariumNectarXpUpgradeLevel || 0,
        terrariumKpNectarUpgradeLevel: window.terrariumKpNectarUpgradeLevel || 0
      }
    };
    this.init();
  }
  addRikkorCreature(creatureData) {
    if (!creatureData.id || this.rikkorCreatures[creatureData.id]) {
      return false;
    }
    const requiredFields = ['id', 'name', 'images', 'baseStats', 'personality', 'speeches', 'rarity'];
    const requiredSpeeches = ['hire', 'working', 'idle', 'dismiss', 'sleepTalk'];
    const requiredStats = ['efficiency', 'loyalty', 'energy'];
    const requiredImages = ['normal', 'speaking', 'sleep', 'sleepTalk'];
    for (const field of requiredFields) {
      if (!creatureData[field]) {
        return false;
      }
    }
    for (const speech of requiredSpeeches) {
      if (!creatureData.speeches[speech] || !Array.isArray(creatureData.speeches[speech])) {
        return false;
      }
    }
    for (const stat of requiredStats) {
      if (typeof creatureData.baseStats[stat] !== 'number') {
        return false;
      }
    }
    for (const imageType of requiredImages) {
      if (!creatureData.images[imageType]) {
        return false;
      }
    }
    this.rikkorCreatures[creatureData.id] = creatureData;
    return true;
  }
  checkAutobuyerUnlocks() {
    this.autobuyerJobs.forEach(autobuyer => {
      if (!autobuyer.isUnlocked) {
        const requirement = autobuyer.unlockRequirement;
        let currentProgress = 0;
        if (requirement.type === 'stat_tracker') {
          if (this.autobuyerProgress[autobuyer.id] !== undefined) {
            currentProgress = this.autobuyerProgress[autobuyer.id];
          }
          else if (window.stats && window.stats[requirement.stat]) {
            currentProgress = window.stats[requirement.stat];
            this.autobuyerProgress[autobuyer.id] = currentProgress;
          } else if (window.state && window.state[requirement.stat]) {
            currentProgress = window.state[requirement.stat];
            this.autobuyerProgress[autobuyer.id] = currentProgress;
          }
          this.autobuyerProgress[autobuyer.id] = currentProgress;
          if (currentProgress >= requirement.required) {
            autobuyer.isUnlocked = true;
            this.showAutobuyerUnlockNotification(autobuyer);
            this.saveData();
          }
        } else if (requirement.type === 'friendship_level') {
          const friendshipLevel = window.friendship && window.friendship[requirement.department]
            ? window.friendship[requirement.department].level
            : 0;
          if (friendshipLevel >= requirement.required) {
            autobuyer.isUnlocked = true;
            this.showAutobuyerUnlockNotification(autobuyer);
            this.saveData();
          }
        }
      }
    });
    this.generatorAutomatorJobs.forEach(automator => {
      if (!automator.isUnlocked) {
        const requirement = automator.unlockRequirement;
        let currentProgress = 0;
        if (requirement.type === 'generator_production') {
          currentProgress = this.generatorAutomatorProgress[automator.id] || 0;
          if (currentProgress >= requirement.required) {
            automator.isUnlocked = true;
            this.showGeneratorAutomatorUnlockNotification(automator);
            this.saveData();
          }
        }
      }
    });
    this.lightGeneratorAutomatorJobs.forEach(automator => {
      if (!this.lightGeneratorAutomatorShown[automator.id]) {
        const generatorLevel = this.getLightGeneratorLevel(automator.generatorType);
        if (generatorLevel >= automator.showRequirement.required) {
          this.lightGeneratorAutomatorShown[automator.id] = true;
          this.saveData();
        }
      }
      if (!automator.isUnlocked) {
        const requirement = automator.unlockRequirement;
        let currentProgress = 0;
        if (requirement.type === 'light_generator_ticks') {
          currentProgress = this.lightGeneratorAutomatorProgress[automator.id] || 0;
          if (currentProgress >= requirement.required) {
            automator.isUnlocked = true;
            this.showLightGeneratorAutomatorUnlockNotification(automator);
            this.saveData();
          }
        }
      }
    });
  }
  showAutobuyerUnlockNotification(autobuyer) {
    const popup = document.createElement('div');
    popup.className = 'autobuyer-unlock-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: -370px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 15px;
      width: 320px;
      max-width: 90vw;
      transform: translateX(0);
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    const boxIcons = {
      common: 'assets/icons/common box.png',
      uncommon: 'assets/icons/uncommon box.png',
      rare: 'assets/icons/rare box.png',
      legendary: 'assets/icons/legendary box.png',
      mythic: 'assets/icons/mythic box.png'
    };
    const iconSrc = boxIcons[autobuyer.boxType] || 'assets/icons/common box.png';
    popup.innerHTML = `
      <div class="autobuyer-unlock-popup-icon">
        <img src="${iconSrc}" alt="${autobuyer.name}" style="width: 48px; height: 48px; border-radius: 8px;">
      </div>
      <div class="autobuyer-unlock-popup-content">
        <div class="autobuyer-unlock-popup-title">Autobuyer Unlocked!</div>
        <div class="autobuyer-unlock-popup-name">${autobuyer.name}</div>
        <div class="autobuyer-unlock-popup-description">Available for worker assignment</div>
      </div>
      <div class="autobuyer-unlock-popup-close" onclick="this.parentElement.remove();" style="
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      ">X</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.transform = 'translateX(-390px)';
    }, 100);
    setTimeout(() => {
      popup.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.remove();
        }
      }, 500);
    }, 5000);
  }
  showGeneratorAutomatorUnlockNotification(automator) {
    const popup = document.createElement('div');
    popup.className = 'generator-automator-unlock-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: -370px;
      background: linear-gradient(135deg, #888888, #666666);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 15px;
      width: 320px;
      max-width: 90vw;
      transform: translateX(0);
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    const generatorIcons = {
      common: 'assets/icons/common box.png',
      uncommon: 'assets/icons/uncommon box.png',
      rare: 'assets/icons/rare box.png',
      legendary: 'assets/icons/legendary box.png',
      mythic: 'assets/icons/mythic box.png'
    };
    const iconSrc = generatorIcons[automator.generatorType] || 'assets/icons/common box.png';
    popup.innerHTML = `
      <div class="generator-automator-unlock-popup-icon">
        <img src="${iconSrc}" alt="${automator.name}" style="width: 48px; height: 48px; border-radius: 8px; filter: grayscale(50%);">
      </div>
      <div class="generator-automator-unlock-popup-content">
        <div class="generator-automator-unlock-popup-title">Generator Automator Unlocked!</div>
        <div class="generator-automator-unlock-popup-name">${automator.name}</div>
        <div class="generator-automator-unlock-popup-description">Available for worker assignment</div>
      </div>
      <div class="generator-automator-unlock-popup-close" onclick="this.parentElement.remove();" style="
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      ">X</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.transform = 'translateX(-390px)';
    }, 100);
    setTimeout(() => {
      popup.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.remove();
        }
      }, 500);
    }, 5000);
  }
  showLightGeneratorAutomatorUnlockNotification(automator) {
    const popup = document.createElement('div');
    popup.className = 'light-generator-automator-unlock-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: -370px;
      background: linear-gradient(135deg, ${automator.color}, ${automator.color}DD);
      color: #333;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 15px;
      width: 320px;
      max-width: 90vw;
      transform: translateX(0);
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    const lightIcons = {
      light: 'assets/icons/light.png',
      redlight: 'assets/icons/red light.png',
      orangelight: 'assets/icons/orange light.png',
      yellowlight: 'assets/icons/yellow light.png',
      greenlight: 'assets/icons/green light.png',
      bluelight: 'assets/icons/blue light.png'
    };
    const iconSrc = lightIcons[automator.generatorType] || 'assets/icons/light.png';
    popup.innerHTML = `
      <div class="light-generator-automator-unlock-popup-icon">
        <img src="${iconSrc}" alt="${automator.name}" style="width: 48px; height: 48px; border-radius: 8px;">
      </div>
      <div class="light-generator-automator-unlock-popup-content">
        <div class="light-generator-automator-unlock-popup-title">Light Generator Automator Unlocked!</div>
        <div class="light-generator-automator-unlock-popup-name">${automator.name}</div>
        <div class="light-generator-automator-unlock-popup-description">Available for worker assignment</div>
      </div>
      <div class="light-generator-automator-unlock-popup-close" onclick="this.parentElement.remove();" style="
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      ">X</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.transform = 'translateX(-390px)';
    }, 100);
    setTimeout(() => {
      popup.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.remove();
        }
      }, 500);
    }, 5000);
  }
  showTokenFinderAutomatorUnlockNotification(automator) {
    const popup = document.createElement('div');
    popup.className = 'token-finder-automator-unlock-popup';
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: -370px;
      background: linear-gradient(135deg, ${automator.color}, ${automator.color}DD);
      color: #333;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 15px;
      width: 320px;
      max-width: 90vw;
      transform: translateX(0);
      transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    popup.innerHTML = `
      <div class="token-finder-automator-unlock-popup-icon">
        <img src="assets/icons/berry token.png" alt="${automator.name}" style="width: 48px; height: 48px; border-radius: 8px;">
      </div>
      <div class="token-finder-automator-unlock-popup-content">
        <div class="token-finder-automator-unlock-popup-title">Token Finder Automator Unlocked!</div>
        <div class="token-finder-automator-unlock-popup-name">${automator.name}</div>
        <div class="token-finder-automator-unlock-popup-description">Available for worker assignment</div>
      </div>
      <div class="token-finder-automator-unlock-popup-close" onclick="this.parentElement.remove();" style="
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
      ">X</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.style.transform = 'translateX(-390px)';
    }, 100);
    setTimeout(() => {
      popup.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.remove();
        }
      }, 500);
    }, 5000);
  }
  getAutobuyerProgress(autobuyerId) {
    const autobuyer = this.autobuyerJobs.find(ab => ab.id === autobuyerId);
    if (!autobuyer) return { current: 0, required: 0, percentage: 0 };
    if (autobuyer.unlockRequirement.type === 'friendship_level') {
      const current = window.friendship && window.friendship[autobuyer.unlockRequirement.department]
        ? window.friendship[autobuyer.unlockRequirement.department].level
        : 0;
      const required = autobuyer.unlockRequirement.required;
      const percentage = Math.min(100, (current / required) * 100);
      return { current, required, percentage };
    }
    const current = this.autobuyerProgress[autobuyerId] || 0;
    const required = autobuyer.unlockRequirement.required;
    const percentage = Math.min(100, (current / required) * 100);
    return { current, required, percentage };
  }
  getGeneratorAutomatorProgress(automatorId) {
    const automator = this.generatorAutomatorJobs.find(ab => ab.id === automatorId);
    if (!automator) return { current: 0, required: 0, percentage: 0, showCurrent: 0, showRequired: 0, showPercentage: 0 };
    const current = this.generatorAutomatorProgress[automatorId] || 0;
    const required = automator.unlockRequirement.required;
    const percentage = Math.min(100, (current / required) * 100);
    const showCurrent = current;
    const showRequired = automator.showRequirement.required;
    const showPercentage = Math.min(100, (showCurrent / showRequired) * 100);
    return { current, required, percentage, showCurrent, showRequired, showPercentage };
  }
  getLightGeneratorAutomatorProgress(automatorId) {
    const automator = this.lightGeneratorAutomatorJobs.find(ab => ab.id === automatorId);
    if (!automator) return { current: 0, required: 0, percentage: 0, showCurrent: 0, showRequired: 0, showPercentage: 0 };
    const current = this.lightGeneratorAutomatorProgress[automatorId] || 0;
    const required = automator.unlockRequirement.required;
    const percentage = Math.min(100, (current / required) * 100);
    const showCurrent = this.getLightGeneratorLevel(automator.generatorType);
    const showRequired = automator.showRequirement.required;
    const showPercentage = Math.min(100, (showCurrent / showRequired) * 100);
    return { current, required, percentage, showCurrent, showRequired, showPercentage };
  }
  getTokenFinderAutomatorProgress(automatorId) {
    const automator = this.tokenFinderAutomatorJobs.find(ab => ab.id === automatorId);
    if (!automator) return { current: 0, required: 0, percentage: 0, showCurrent: 0, showRequired: 0, showPercentage: 0 };
    const current = this.tokenFinderAutomatorProgress.tokensCollected || 0;
    const required = automator.unlockRequirement.required;
    const percentage = Math.min(100, (current / required) * 100);
    const showCurrent = current;
    const showRequired = automator.showRequirement.required;
    const showPercentage = Math.min(100, (showCurrent / showRequired) * 100);
    return { current, required, percentage, showCurrent, showRequired, showPercentage };
  }
  getLightGeneratorLevel(generatorType) {
    if (window.prismState && window.prismState.generatorUpgrades) {
      return window.prismState.generatorUpgrades[generatorType] || 0;
    }
    return 0;
  }
  onGeneratorCompleted(generatorType) {
    this.generatorAutomatorJobs.forEach(automator => {
      if (automator.generatorType === generatorType) {
        if (!this.generatorAutomatorProgress[automator.id]) {
          this.generatorAutomatorProgress[automator.id] = 0;
        }
        this.generatorAutomatorProgress[automator.id]++;
      }
    });
    this.checkAutobuyerUnlocks();
    this.updateJobModalIfOpen();
    this.saveData();
  }
  onBoxOpened(boxType) {
    const autobuyerKey = `${boxType}_box_autobuyer`;
    if (!this.autobuyerProgress[autobuyerKey]) {
      this.autobuyerProgress[autobuyerKey] = 0;
    }
    this.autobuyerProgress[autobuyerKey]++;
    if (window.stats) {
      const statKey = `${boxType}BoxesOpened`;
      if (!window.stats[statKey]) {
        window.stats[statKey] = 0;
      }
      window.stats[statKey]++;
    }
    this.checkAutobuyerUnlocks();
    this.updateJobModalIfOpen();
    this.saveData();
  }
  onCommonBoxOpened() {
    this.onBoxOpened('common');
  }
  onDeliveryClicked() {
    this.deliveryProgress.deliveryClicks++;
    this.checkDeliveryAutomatorUnlocks();
    this.updateJobModalIfOpen();
    this.saveData();
  }
  onPrismTileClicked() {
    this.prismTileProgress.prismTileClicks++;
    this.checkPrismTileAutomatorUnlocks();
    this.updateJobModalIfOpen();
    // Note: Save will be handled by regular save system, not on every click
  }
  onLightGeneratorTick(generatorType) {
    const automatorId = `${generatorType}_generator_automator`;
    if (!this.lightGeneratorAutomatorProgress[automatorId]) {
      this.lightGeneratorAutomatorProgress[automatorId] = 0;
    }
    this.lightGeneratorAutomatorProgress[automatorId]++;
    this.checkAutobuyerUnlocks();
    this.updateJobModalIfOpen();
    if (this.lightGeneratorAutomatorProgress[automatorId] % 100 === 0) {
      this.saveData();
    }
  }
  onTokenCollected() {
    if (!this.tokenFinderAutomatorProgress.tokensCollected) {
      this.tokenFinderAutomatorProgress.tokensCollected = 0;
    }
    this.tokenFinderAutomatorProgress.tokensCollected++;
    this.checkTokenFinderAutomatorUnlocks();
    this.updateJobModalIfOpen();
    if (this.tokenFinderAutomatorProgress.tokensCollected % 50 === 0) {
      this.saveData();
    }
  }
  checkDeliveryAutomatorUnlocks() {
    this.deliveryAutomatorJobs.forEach(automator => {
      if (!automator.isUnlocked) {
        const clicks = this.deliveryProgress.deliveryClicks;
        const required = automator.unlockRequirement.required;
        if (clicks >= required) {
          automator.isUnlocked = true;
          this.showDeliveryAutomatorUnlockNotification(automator);
          this.saveData();
        }
      }
    });
  }
  checkPrismTileAutomatorUnlocks() {
    this.prismTileAutomatorJobs.forEach(automator => {
      if (!automator.isUnlocked) {
        const clicks = this.prismTileProgress.prismTileClicks;
        const required = automator.unlockRequirement.required;
        if (clicks >= required) {
          automator.isUnlocked = true;
          this.showPrismTileAutomatorUnlockNotification(automator);
          this.saveData();
        }
      }
    });
  }
  checkTokenFinderAutomatorUnlocks() {
    this.tokenFinderAutomatorJobs.forEach(automator => {
      if (!automator.isUnlocked) {
        const tokensCollected = this.tokenFinderAutomatorProgress.tokensCollected;
        const required = automator.unlockRequirement.required;
        if (tokensCollected >= required) {
          automator.isUnlocked = true;
          this.showTokenFinderAutomatorUnlockNotification(automator);
          this.saveData();
        }
      }
    });
  }
  showDeliveryAutomatorUnlockNotification(automator) {
    const popup = document.createElement('div');
    popup.className = 'delivery-automator-unlock-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #9C27B0, #7B1FA2);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(156, 39, 176, 0.4);
      z-index: 10000;
      text-align: center;
      border: 2px solid #AD47BD;
      animation: deliveryPopupSlide 0.6s ease-out;
    `;
    popup.innerHTML = `
      <div class="delivery-automator-unlock-popup-title">Delivery Automator Unlocked!</div>
      <div class="delivery-automator-unlock-popup-name">${automator.name}</div>
      <div class="delivery-automator-unlock-popup-desc">${automator.description}</div>
      <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: #E1BEE7; color: #4A148C; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">Awesome!</button>
    `;
    if (!document.getElementById('deliveryPopupCSS')) {
      const style = document.createElement('style');
      style.id = 'deliveryPopupCSS';
      style.textContent = `
        @keyframes deliveryPopupSlide {
          0% { transform: translate(-50%, -150%); opacity: 0; }
          100% { transform: translate(-50%, -50%); opacity: 1; }
        }
        .delivery-automator-unlock-popup-title { font-size: 1.4em; font-weight: bold; margin-bottom: 8px; color: #E1BEE7; }
        .delivery-automator-unlock-popup-name { font-size: 1.1em; font-weight: bold; margin-bottom: 8px; color: white; }
        .delivery-automator-unlock-popup-desc { font-size: 0.9em; margin-bottom: 10px; color: #F3E5F5; line-height: 1.4; }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(popup);
    setTimeout(() => {
      if (popup.parentElement) {
        popup.remove();
      }
    }, 8000);
  }
  showPrismTileAutomatorUnlockNotification(automator) {
    const popup = document.createElement('div');
    popup.className = 'prism-automator-unlock-popup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #FFFFFF, #F5F5F5, #EEEEEE);
      color: #333;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 255, 255, 0.8), 0 0 20px rgba(200, 255, 255, 0.3);
      z-index: 10000;
      text-align: center;
      border: 2px solid #E0E0E0;
      animation: prismPopupSlide 0.6s ease-out;
    `;
    popup.innerHTML = `
      <div class="prism-automator-unlock-popup-title">Prism Tile Automator Unlocked!</div>
      <div class="prism-automator-unlock-popup-name">${automator.name}</div>
      <div class="prism-automator-unlock-popup-desc">${automator.description}</div>
      <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: #F0F0F0; color: #333; border: 1px solid #CCC; border-radius: 6px; font-weight: bold; cursor: pointer;">Brilliant!</button>
    `;
    if (!document.getElementById('prismPopupCSS')) {
      const style = document.createElement('style');
      style.id = 'prismPopupCSS';
      style.textContent = `
        @keyframes prismPopupSlide {
          0% { transform: translate(-50%, -150%); opacity: 0; }
          100% { transform: translate(-50%, -50%); opacity: 1; }
        }
        .prism-automator-unlock-popup-title { font-size: 1.4em; font-weight: bold; margin-bottom: 8px; color: #555; }
        .prism-automator-unlock-popup-name { font-size: 1.1em; font-weight: bold; margin-bottom: 8px; color: #333; }
        .prism-automator-unlock-popup-desc { font-size: 0.9em; margin-bottom: 10px; color: #666; line-height: 1.4; }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(popup);
    setTimeout(() => {
      if (popup.parentElement) {
        popup.remove();
      }
    }, 8000);
  }
  trackBoxOpening(boxType) {
    this.onBoxOpened(boxType);
  }
  hookIntoBuyboxFunction() {
    const buyboxFunction = window.buybox || window.buyBox;
    if (buyboxFunction && typeof buyboxFunction === 'function') {
      const originalBuybox = buyboxFunction;
      const functionName = window.buyBox ? 'buyBox' : 'buybox';
      const wrapperFunction = (...args) => {
        const result = originalBuybox.apply(this, args);
        const firstArg = args[0];
        let boxType = null;
        if (firstArg === 'uncommon' || firstArg === 'Uncommon' || firstArg === 1 || firstArg === '1' ||
            (typeof firstArg === 'string' && firstArg.toLowerCase() === 'uncommon')) {
          boxType = 'uncommon';
        } else if (firstArg === 'common' || firstArg === 'Common' || firstArg === 0 || firstArg === '0' ||
                   (typeof firstArg === 'string' && firstArg.toLowerCase() === 'common')) {
          boxType = 'common';
        } else if (firstArg === 'legendary' || firstArg === 'Legendary' || firstArg === 3 || firstArg === '3' ||
                   (typeof firstArg === 'string' && firstArg.toLowerCase() === 'legendary')) {
          boxType = 'legendary';
        } else if (firstArg === 'rare' || firstArg === 'Rare' || firstArg === 2 || firstArg === '2' ||
                   (typeof firstArg === 'string' && firstArg.toLowerCase() === 'rare')) {
          boxType = 'rare';
        } else if (firstArg === 'mythic' || firstArg === 'Mythic' || firstArg === 4 || firstArg === '4' ||
                   (typeof firstArg === 'string' && firstArg.toLowerCase() === 'mythic')) {
          boxType = 'mythic';
        }
        if (boxType) {
          setTimeout(() => {
            if (window.frontDesk) {
              window.frontDesk.trackBoxOpening(boxType);
            }
          }, 10);
        }
        return result;
      };
      window[functionName] = wrapperFunction;
      Object.setPrototypeOf(window[functionName], originalBuybox);
    } else {
      setTimeout(() => {
        if (this.isUnlocked) {
          this.hookIntoBuyboxFunction();
        }
      }, 1000);
    }
  }
  showSpeech(message, duration = 3000) {
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
    }
    this.currentSpeech = message;
    this.updateSpeechBubble();
    this.speechTimeout = setTimeout(() => {
      this.currentSpeech = '';
      this.updateSpeechBubble();
    }, duration);
  }
  updateSpeechBubble() {
    const speechBubble = document.getElementById('ticoSpeechBubble');
    const normalImage = document.getElementById('ticoCharacterImage');
    const speakingImage = document.getElementById('ticoCharacterSpeaking');
    if (speechBubble && normalImage && speakingImage) {
      if (this.currentSpeech) {
        normalImage.style.display = 'none';
        speakingImage.style.display = 'block';
        speechBubble.textContent = this.currentSpeech;
        speechBubble.classList.add('show');
        speechBubble.style.display = 'block';
      } else {
        speechBubble.classList.remove('show');
        speechBubble.style.display = 'none';
        speakingImage.style.display = 'none';
        normalImage.style.display = 'block';
      }
    }
  }
  showTicoSpeech(message, duration = 3000) {
    if (typeof this.showSpeech === 'function') {
      this.showSpeech(message, duration);
    } else {
      console.warn('showSpeech method not available on this context');
    }
  }
  triggerRandomSpeech() {
    if (this.isAsleep) return;
    
    // Check if Halloween mode is active
    const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                             (window.premiumState && window.premiumState.halloweenEventActive) ||
                             document.body.classList.contains('halloween-cargo-active') ||
                             document.body.classList.contains('halloween-event-active');
    
    // 15% chance for challenge speech (only if quest 5 is completed to unlock the challenge)
    const questCompleted = window.state?.questSystem?.completedQuests?.includes('soap_quest_5') || false;
    const shouldUseChallengeQuotes = questCompleted && Math.random() < 0.15;
    
    // Ensure character PBs exist if we're going to use challenge quotes
    if (shouldUseChallengeQuotes && typeof window.ensureCharacterPBsExist === 'function') {
      window.ensureCharacterPBsExist();
    }
    
    let speechArray = this.randomSpeeches;
    
    if (shouldUseChallengeQuotes) {
      // Use challenge quotes
      speechArray = this.ticochallengeQuotes;
    } else if (isHalloweenActive && Math.random() < 0.5) {
      // 50% chance to use Halloween speeches when Halloween mode is active (if not using challenge quotes)
      speechArray = this.halloweenRandomSpeeches;
    }
    
    // Filter and extract valid speeches (similar to Fluzzer's speech system)
    const validSpeeches = [];
    for (const speech of speechArray) {
      if (typeof speech === 'string') {
        validSpeeches.push(speech);
      } else if (typeof speech === 'object' && speech.text) {
        // Check condition if it exists
        if (!speech.condition || (typeof speech.condition === 'function' && speech.condition())) {
          validSpeeches.push(speech.text);
        }
      }
    }
    
    // Fallback if no valid speeches
    if (validSpeeches.length === 0) {
      this.showSpeech("Welcome to our front desk! Looking for some skilled workers?", 4000);
      this.lastInteractionTime = Date.now();
      return;
    }
    
    const selectedSpeech = validSpeeches[Math.floor(Math.random() * validSpeeches.length)];
    const speechText = typeof selectedSpeech === 'function' ? selectedSpeech() : selectedSpeech;
    this.showSpeech(speechText, 4000);
    this.lastInteractionTime = Date.now();
  }
  triggerRandomWorkerSpeech() {
    const allWorkers = [...this.availableWorkers, ...Object.values(this.assignedWorkers)].filter(w => w);
    if (allWorkers.length === 0) return;
    const randomWorker = allWorkers[Math.floor(Math.random() * allWorkers.length)];
    if (randomWorker.isAsleep) {
      if (Math.random() < 0.3) {
        const sleepSpeeches = randomWorker.creatureData.speeches.sleepTalk;
        const randomSleepSpeech = sleepSpeeches[Math.floor(Math.random() * sleepSpeeches.length)];
        this.makeWorkerSpeak(randomWorker, randomSleepSpeech, 2000);
      }
    } else {
      const assignedSlot = Object.keys(this.assignedWorkers).find(slot => this.assignedWorkers[slot] === randomWorker);
      const isHungry = assignedSlot && this.workerHunger[assignedSlot] !== undefined && this.workerHunger[assignedSlot] < 30;
      const isStarving = assignedSlot && this.workerHunger[assignedSlot] !== undefined && this.workerHunger[assignedSlot] === 0;
      let speechArray;
      if (isStarving) {
        const starvingSpeeches = [
          "I... I can't work when I'm this hungry...",
          "Please... I need food to continue...",
          "My stomach is so empty I can't focus...",
          "I refuse to work until I get something to eat!",
          "This is unbearable... I need sustenance...",
          "How can you expect me to work on an empty stomach?",
          "Food... I need food before I can do anything...",
          "I'm too weak from hunger to continue working...",
        ];
        speechArray = starvingSpeeches;
      } else if (isHungry) {
        const hungrySpeeches = [
          "I'm getting pretty hungry... any chance of a meal?",
          "My tummy is rumbling... could really use some food!",
          "Starting to feel peckish... when's lunch break?",
          "Could really go for a snack right about now...",
          "Getting a bit hungry here... hope there's food soon!",
          "My energy is dropping... some food would help!",
          "Feeling a bit empty... maybe it's time for a bite?",
          "Could use some sustenance to keep going...",
        ];
        speechArray = hungrySpeeches;
      } else {
        if (randomWorker.job) {
          speechArray = randomWorker.creatureData.speeches.working;
        } else {
          speechArray = randomWorker.creatureData.speeches.idle;
        }
      }
      const randomSpeech = speechArray[Math.floor(Math.random() * speechArray.length)];
      this.makeWorkerSpeak(randomWorker, randomSpeech, 3000);
    }
  }
  checkSleepStatus() {
    if (!window.daynight || typeof window.daynight.getTimeString !== 'function') {
      return;
    }
    const timeString = window.daynight.getTimeString();
    const currentHour = parseInt(timeString.split(':')[0]);
    const wasAsleep = this.isAsleep;
    if (currentHour >= this.sleepStartHour || currentHour < this.sleepEndHour) {
      this.isAsleep = true;
    } else {
      this.isAsleep = false;
    }
    this.updateCharacterImage();
  }
  updateCharacterImage() {
    const normalImage = document.getElementById('ticoCharacterImage');
    const speakingImage = document.getElementById('ticoCharacterSpeaking');
    if (!normalImage || !speakingImage) return;
    if (this.isAsleep) {
      normalImage.src = window.getHalloweenTicoImage ? window.getHalloweenTicoImage('sleep') : 'assets/icons/tico sleep.png';
      speakingImage.src = window.getHalloweenTicoImage ? window.getHalloweenTicoImage('sleep_talk') : 'assets/icons/tico sleep talk.png';
    } else {
      normalImage.src = window.getHalloweenTicoImage ? window.getHalloweenTicoImage('normal') : 'assets/icons/tico.png';
      speakingImage.src = window.getHalloweenTicoImage ? window.getHalloweenTicoImage('speech') : 'assets/icons/tico speech.png';
    }
  }
  checkWorkerSleepStatus() {
    if (!window.daynight || typeof window.daynight.getTimeString !== 'function') {
      return;
    }
    const timeString = window.daynight.getTimeString();
    const currentHour = parseInt(timeString.split(':')[0]);
    const shouldBeSleeping = currentHour >= this.sleepStartHour || currentHour < this.sleepEndHour;
    [...this.availableWorkers, ...Object.values(this.assignedWorkers)].forEach(worker => {
      if (worker) {
        const wasAsleep = worker.isAsleep;
        worker.isAsleep = shouldBeSleeping;
        this.updateWorkerImage(worker);
        if (wasAsleep !== worker.isAsleep) {
        }
      }
    });
  }
  updateWorkerImage(worker) {
    if (!worker.images && worker.creatureData && worker.creatureData.images) {
      worker.images = worker.creatureData.images;
    }
    if (!worker.images) return;
    if (worker.isAsleep) {
      worker.image = worker.images.sleep;
    } else if (worker.isSpeaking) {
      worker.image = worker.images.speaking;
    } else {
      worker.image = worker.images.normal;
    }
  }
  makeWorkerSpeak(worker, message, duration = 3000) {
    if (!worker) return;
    const frontDeskSection = document.getElementById('frontdesk');
    if (!frontDeskSection || frontDeskSection.style.display === 'none') {
      return;
    }
    if (!worker.images && worker.creatureData && worker.creatureData.images) {
      worker.images = worker.creatureData.images;
    }
    if (worker.name === 'Lumina') {
    }
    if (this.workerSpeechTimeouts[worker.id]) {
      clearTimeout(this.workerSpeechTimeouts[worker.id]);
    }
    worker.isSpeaking = true;
    if (worker.images) {
      if (worker.isAsleep) {
        worker.image = worker.images.sleepTalk;
        if (!message && worker.currentSpeeches && worker.currentSpeeches.sleepTalk) {
          message = worker.currentSpeeches.sleepTalk;
        }
      } else {
        worker.image = worker.images.speaking;
        if (worker.name === 'Lumina') {
        }
      }
    }
    this.showWorkerSpeech(worker, message, duration);
    this.workerSpeechTimeouts[worker.id] = setTimeout(() => {
      worker.isSpeaking = false;
      this.updateWorkerImage(worker);
      this.hideWorkerSpeech(worker);
      this.renderUI();
    }, duration);
    this.renderUI();
  }
  showWorkerSpeech(worker, message, duration) {
    const workerId = worker.id;
    let speechBubble = document.getElementById(`workerSpeech_${workerId}`);
    if (speechBubble) {
      speechBubble.remove();
    }
    let workerElement = document.querySelector(`.assigned-worker-large[onclick*="${workerId}"]`) ||
                       document.querySelector(`[data-worker-id="${workerId}"]`) ||
                       document.querySelector(`[onclick*="${workerId}"]`);
    if (!workerElement) {
      return;
    }
    let workerImage = workerElement.querySelector('.worker-image-large') ||
                     workerElement.querySelector('.worker-image') ||
                     workerElement.querySelector('img');
    const targetElement = workerImage || workerElement;
    const targetRect = targetElement.getBoundingClientRect();
    const frontDeskContainer = document.querySelector('.frontdesk-container');
    if (!frontDeskContainer) {
      return;
    }
    const containerRect = frontDeskContainer.getBoundingClientRect();
    speechBubble = document.createElement('div');
    speechBubble.id = `workerSpeech_${workerId}`;
    speechBubble.className = 'swaria-speech';
    speechBubble.textContent = message;
    const bubbleLeft = targetRect.right - containerRect.left + 15;
    const bubbleTop = targetRect.top - containerRect.top + (targetRect.height / 2) - 30;
    speechBubble.style.cssText = `
      position: absolute !important;
      left: ${bubbleLeft}px !important;
      top: ${bubbleTop}px !important;
      min-width: 120px !important;
      max-width: 260px !important;
      background: #fffbe8 !important;
      color: #222 !important;
      border-radius: 16px !important;
      box-shadow: 0 2px 8px rgba(120,80,180,0.10) !important;
      padding: 0.8em 1.2em !important;
      font-size: 1.1em !important;
      font-weight: 500 !important;
      z-index: 1000 !important;
      display: block !important;
      pointer-events: none !important;
      visibility: visible !important;
      opacity: 1 !important;
      transform: none !important;
      margin: 0 !important;
    `;
    const style = document.createElement('style');
    style.textContent = `
      #workerSpeech_${workerId}::before {
        content: '';
        position: absolute;
        left: -18px;
        top: 18px;
        width: 0;
        height: 0;
        border-top: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-right: 18px solid #fffbe8;
        z-index: 1001;
      }
    `;
    document.head.appendChild(style);
    frontDeskContainer.appendChild(speechBubble);
    setTimeout(() => {
      if (speechBubble && speechBubble.parentNode) {
        speechBubble.remove();
      }
      if (style && style.parentNode) {
        style.remove();
      }
    }, duration);
    worker.currentSpeechMessage = message;
    worker.speechEndTime = Date.now() + duration;
  }
  hideWorkerSpeech(worker) {
    const speechBubble = document.getElementById(`workerSpeech_${worker.id}`);
    if (speechBubble) {
      speechBubble.style.display = 'none';
      speechBubble.classList.remove('show');
    }
    worker.currentSpeechMessage = null;
    worker.speechEndTime = null;
  }
  hideAllWorkerSpeech() {
    for (let slotId = 1; slotId <= this.unlockedSlots; slotId++) {
      const worker = this.assignedWorkers[slotId];
      if (worker) {
        this.hideWorkerSpeech(worker);
        if (this.workerSpeechTimeouts[worker.id]) {
          clearTimeout(this.workerSpeechTimeouts[worker.id]);
          delete this.workerSpeechTimeouts[worker.id];
        }
        worker.isSpeaking = false;
        this.updateWorkerImage(worker);
      }
    }
    this.availableWorkers.forEach(worker => {
      this.hideWorkerSpeech(worker);
      if (this.workerSpeechTimeouts[worker.id]) {
        clearTimeout(this.workerSpeechTimeouts[worker.id]);
        delete this.workerSpeechTimeouts[worker.id];
      }
      worker.isSpeaking = false;
      this.updateWorkerImage(worker);
    });
    document.querySelectorAll('[id^="workerSpeech_"]').forEach(bubble => {
      bubble.remove();
    });
  }
  pokeWorker(workerIdOrElement) {
    let worker = null;
    if (typeof workerIdOrElement === 'string') {
      const workerId = workerIdOrElement;
      worker = this.findWorkerById(workerId);
    } else {
      const workerId = workerIdOrElement;
      worker = this.findWorkerById(workerId);
    }
    if (!worker) return;
    let speechMessage = '';
    if (worker.isAsleep) {
      const sleepSpeeches = worker.creatureData.speeches.sleepTalk;
      speechMessage = sleepSpeeches[Math.floor(Math.random() * sleepSpeeches.length)];
      this.makeWorkerSpeak(worker, speechMessage, 2000);
    } else {
      if (worker.job) {
        const workingSpeeches = worker.creatureData.speeches.working;
        speechMessage = workingSpeeches[Math.floor(Math.random() * workingSpeeches.length)];
      } else {
        const idleSpeeches = worker.creatureData.speeches.idle;
        speechMessage = idleSpeeches[Math.floor(Math.random() * idleSpeeches.length)];
      }
      this.makeWorkerSpeak(worker, speechMessage, 3000);
    }
    const isAvailableWorker = this.availableWorkers.some(w => w.id === worker.id);
    if (isAvailableWorker) {
      this.selectedWorker = worker;
      this.renderAvailableWorkers();
    }
    if (window.friendship && typeof window.friendship.addPoints === 'function') {
      window.friendship.addPoints(worker.creatureId, 1);
    }
  }
  pokeWorkerById(workerId) {
    const worker = this.findWorkerById(workerId);
    if (worker) {
      this.pokeWorker(workerId);
    }
  }
  findWorkerById(workerId) {
    let worker = this.availableWorkers.find(w => w.id.toString() === workerId.toString());
    if (worker) return worker;
    for (const slotId in this.assignedWorkers) {
      if (this.assignedWorkers[slotId] && this.assignedWorkers[slotId].id.toString() === workerId.toString()) {
        return this.assignedWorkers[slotId];
      }
    }
    return null;
  }
  pokeTico() {
    if (this.isAsleep) {
      this.showSpeech('zzz...', 2000);
      if (this.sleepTalkTimeout) {
        clearTimeout(this.sleepTalkTimeout);
      }
      const normalImage = document.getElementById('ticoCharacterImage');
      const speakingImage = document.getElementById('ticoCharacterSpeaking');
      if (normalImage && speakingImage) {
        normalImage.style.display = 'none';
        speakingImage.style.display = 'block';
        this.sleepTalkTimeout = setTimeout(() => {
          if (this.isAsleep && !this.currentSpeech) {
            normalImage.style.display = 'block';
            speakingImage.style.display = 'none';
          }
        }, 2000);
      }
    } else {
      // Check if Halloween mode is active
      const isHalloweenActive = (window.state && window.state.halloweenEventActive) || 
                               (window.premiumState && window.premiumState.halloweenEventActive) ||
                               document.body.classList.contains('halloween-cargo-active') ||
                               document.body.classList.contains('halloween-event-active');
      
      let pokeArray = this.pokeSpeeches;
      
      // 50% chance to use Halloween poke speeches when Halloween mode is active
      if (isHalloweenActive && Math.random() < 0.5) {
        pokeArray = this.halloweenPokeSpeeches;
      }
      
      const pokeSpeech = pokeArray[Math.floor(Math.random() * pokeArray.length)];
      this.showSpeech(pokeSpeech, 3000);
    }
    this.lastInteractionTime = Date.now();
    if (window.friendship && typeof window.friendship.addPoints === 'function') {
      window.friendship.addPoints('tico', 1);
    }
  }
  handleTokenDrop(tokenType, amount = 1) {
    let friendshipGain = 0;
    let response = '';
    this.tokensGivenToTico += amount;
    const baseRations = Math.floor(this.tokensGivenToTico / 5) - Math.floor((this.tokensGivenToTico - amount) / 5);
    if (baseRations > 0) {
      let totalRations = baseRations;
      let bonusRations = 0;
      if (window.friendship && window.friendship.FrontDesk && window.friendship.FrontDesk.level >= 4) {
        const multiplier = 1 + (window.friendship.FrontDesk.level - 3);
        totalRations = baseRations * multiplier;
        bonusRations = totalRations - baseRations;
      }
      this.foodRations += totalRations;
      let rationMessage = '';
      if (bonusRations > 0) {
        rationMessage = `I've prepared ${totalRations} food ration${totalRations > 1 ? 's' : ''} (${baseRations} base × ${1 + (window.friendship.FrontDesk.level - 3)} friendship multiplier) for the workers.`;
      } else {
        rationMessage = `I've prepared ${totalRations} food ration${totalRations > 1 ? 's' : ''} for the workers.`;
      }
      
      // Award friendship to Tico for crafting food rations
      awardTicoFriendshipForFoodRationCrafting();
      response = `Thank you for the ${amount} ${tokenType}! ${rationMessage} (Food Rations: ${this.foodRations})`;
      friendshipGain = 3 * amount;
    } else {
      const tokensUntilRation = 5 - (this.tokensGivenToTico % 5);
      if (['berries', 'mushroom', 'water'].includes(tokenType)) {
        friendshipGain = 5 * amount;
        const likeResponses = [
          `Oh wonderful! I love ${tokenType}! Thank you for the ${amount}! (${tokensUntilRation} more tokens for a food ration)`,
          `${amount} ${tokenType}? You know exactly what I like! Amazing! (${tokensUntilRation} more for a ration)`,
          `These ${amount} ${tokenType} are perfect! You're so thoughtful! (${tokensUntilRation} tokens until next ration)`,
          `I absolutely adore ${tokenType}! Thank you for all ${amount}! (${tokensUntilRation} more tokens needed)`
        ];
        response = likeResponses[Math.floor(Math.random() * likeResponses.length)];
      } else {
        friendshipGain = 2 * amount;
        const neutralResponses = [
          `Thank you for the ${amount} ${tokenType}! I appreciate the gesture. (${tokensUntilRation} more for a ration)`,
          `${amount} ${tokenType}, interesting! I'll make good use of these. (${tokensUntilRation} tokens until ration)`,
          `How thoughtful of you to bring me ${amount} ${tokenType}! (${tokensUntilRation} more needed)`,
          `I'll take good care of these ${amount} ${tokenType}, thank you! (${tokensUntilRation} tokens left)`
        ];
        response = neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
      }
    }
    this.showSpeech(response, 4000);
    this.updateWorkerHungerUI();
    this.saveData();
    if (window.friendship && typeof window.friendship.addPoints === 'function') {
      window.friendship.addPoints('tico', friendshipGain);
    }
    this.lastInteractionTime = Date.now();
  }
  debugTrackBox(boxType) {
    this.onBoxOpened(boxType);
  }
  debugAutobuyerProgress() {
    this.autobuyerJobs.forEach(autobuyer => {
      const progress = this.getAutobuyerProgress(autobuyer.id);
    });
  }
  init() {
    if (typeof window.state === 'undefined' || typeof DecimalUtils === 'undefined') {
      setTimeout(() => this.init(), 100);
      return;
    }
    this.addSelectedWorkerStyles();
    this.setupNavigationListeners();
    this.removeAutoclickerCardFromPrismTab();
    this.checkUnlockStatus();
    if (this.isUnlocked) {
      this.loadData();
      this.startTimers();
      this.renderUI();
      this.hookIntoBuyboxFunction();
    }
  }
  setupNavigationListeners() {
    document.querySelectorAll('.navBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (targetId !== 'frontdesk') {
          this.hideAllWorkerSpeech();
        }
      });
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const frontDeskSection = document.getElementById('frontdesk');
          if (frontDeskSection && frontDeskSection.style.display === 'none') {
            this.hideAllWorkerSpeech();
          }
        }
      });
    });
    const frontDeskSection = document.getElementById('frontdesk');
    if (frontDeskSection) {
      observer.observe(frontDeskSection, { attributes: true, attributeFilter: ['style'] });
    }
  }
  checkUnlockStatus() {
    let currentGrade = 0;
    if (window.state && window.state.grade) {
      if (DecimalUtils.isDecimal(window.state.grade)) {
        currentGrade = window.state.grade.toNumber();
      } else if (typeof window.state.grade === 'number') {
        currentGrade = window.state.grade;
      }
    }
    this.isUnlocked = currentGrade >= 2;
    this.updateUIVisibility();
  }
  updateUIVisibility() {
    const frontDeskTab = document.getElementById('frontDeskTab');
    if (frontDeskTab) {
      frontDeskTab.style.display = this.isUnlocked ? 'inline-block' : 'none';
    }
  }
  forceCheckUnlock() {
    this.checkUnlockStatus();
    if (this.isUnlocked && !this.initialized) {
      this.loadData();
      this.startTimers();
      this.renderUI();
      this.checkSleepStatus();
      this.updateCharacterImage();
      this.hookIntoBuyboxFunction();
      this.initialized = true;
    }
  }
  generateRandomWorker() {
    const usedCreatureIds = new Set();
    Object.values(this.assignedWorkers).forEach(worker => {
      if (worker && worker.creatureId) {
        usedCreatureIds.add(worker.creatureId);
      }
    });
    this.availableWorkers.forEach(worker => {
      if (worker && worker.creatureId) {
        usedCreatureIds.add(worker.creatureId);
      }
    });
    const availableCreatures = Object.values(this.rikkorCreatures).filter(creature =>
      !usedCreatureIds.has(creature.id)
    );
    if (availableCreatures.length === 0) {
      return null;
    }
    const creaturePool = [];
    availableCreatures.forEach(creature => {
      const weight = Math.floor(creature.rarity * 100);
      for (let i = 0; i < weight; i++) {
        creaturePool.push(creature);
      }
    });
    const selectedCreature = creaturePool[Math.floor(Math.random() * creaturePool.length)];
    let starBonus = 0;
    if (window.friendship && window.friendship['tico'] && window.friendship['tico'].level >= 1) {
      starBonus = window.friendship['tico'].level * 0.01;
    }
    const rand = Math.random();
    let stars;
    const adjustedRand = Math.max(0, rand - starBonus);
    if (adjustedRand < 0.45) stars = 1;
    else if (adjustedRand < 0.75) stars = 2;
    else if (adjustedRand < 0.9) stars = 3;
    else if (adjustedRand < 0.99) stars = 4;
    else stars = 5;
    const worker = {
      id: Date.now() + Math.random(),
      creatureId: selectedCreature.id,
      creatureData: selectedCreature,
      name: selectedCreature.name,
      images: selectedCreature.images,
      image: selectedCreature.images.normal,
      stars: stars,
      starData: this.starRatings[stars],
      displayName: selectedCreature.name,
      arrivalTime: Date.now(),
      job: null,
      isAsleep: false,
      isSpeaking: false,
      finalStats: {
        efficiency: selectedCreature.baseStats.efficiency * this.starRatings[stars].multiplier,
        loyalty: selectedCreature.baseStats.loyalty * this.starRatings[stars].multiplier,
        energy: selectedCreature.baseStats.energy * this.starRatings[stars].multiplier
      },
      currentSpeeches: {
        hire: selectedCreature.speeches.hire[Math.floor(Math.random() * selectedCreature.speeches.hire.length)],
        working: selectedCreature.speeches.working[Math.floor(Math.random() * selectedCreature.speeches.working.length)],
        idle: selectedCreature.speeches.idle[Math.floor(Math.random() * selectedCreature.speeches.idle.length)],
        dismiss: selectedCreature.speeches.dismiss[Math.floor(Math.random() * selectedCreature.speeches.dismiss.length)],
        sleepTalk: selectedCreature.speeches.sleepTalk ? selectedCreature.speeches.sleepTalk[Math.floor(Math.random() * selectedCreature.speeches.sleepTalk.length)] : "zzz..."
      }
    };
    return worker;
  }
  spawnWorker() {
    if (this.availableWorkers.length < 3) {
      const worker = this.generateRandomWorker();
      if (worker) {
        this.availableWorkers.push(worker);
        this.renderAvailableWorkers();
        this.scheduleNextArrival();
      } else {
        this.nextArrivalTime = null;
      }
    } else {
      this.scheduleNextArrival();
    }
  }
  scheduleNextArrival() {
    this.nextArrivalTime = Date.now() + this.arrivalInterval;
    this.saveData();
  }
  removeExpiredWorkers() {
    const currentTime = Date.now();
    const initialLength = this.availableWorkers.length;
    this.availableWorkers = this.availableWorkers.filter(worker => {
      return currentTime - worker.arrivalTime < this.workerLifetime;
    });
    if (this.availableWorkers.length !== initialLength) {
      this.renderAvailableWorkers();
      if (this.canHireUniqueWorkers() && this.nextArrivalTime === null) {
        this.scheduleNextArrival();
      }
    }
  }
  startTimers() {
    if (this.timersStarted) {
      return;
    }
    this.timersStarted = true;
    setInterval(() => {
      this.updateArrivalTimer();
      this.removeExpiredWorkers();
      this.checkSleepStatus();
      this.checkWorkerSleepStatus();
      this.checkAutobuyerUnlocks();
      this.updateWorkerProgressBars();
      this.updateWorkerHunger();
      if (this.nextArrivalTime !== null && this.nextArrivalTime !== undefined && Date.now() >= this.nextArrivalTime) {
        this.spawnWorker();
      }
    }, 1000);
    setInterval(() => {
      if (Math.random() < 0.1) {
        this.triggerRandomSpeech();
      }
    }, 30000);
    setInterval(() => {
      if (Math.random() < 0.05) {
        this.triggerRandomWorkerSpeech();
      }
    }, 20000);
    if (this.availableWorkers.length === 0 && (this.nextArrivalTime === null || this.nextArrivalTime === undefined)) {
      this.scheduleNextArrival();
    }
  }
  canHireUniqueWorkers() {
    const usedCreatureIds = new Set();
    Object.values(this.assignedWorkers).forEach(worker => {
      if (worker && worker.creatureId) {
        usedCreatureIds.add(worker.creatureId);
      }
    });
    this.availableWorkers.forEach(worker => {
      if (worker && worker.creatureId) {
        usedCreatureIds.add(worker.creatureId);
      }
    });
    const totalCreatureTypes = Object.keys(this.rikkorCreatures).length;
    return usedCreatureIds.size < totalCreatureTypes;
  }
  updateArrivalTimer() {
    const timerElement = document.getElementById('nextArrivalTime');
    if (!timerElement) return;
    if (!this.canHireUniqueWorkers()) {
      timerElement.textContent = 'No longer hiring';
      return;
    }
    if (this.nextArrivalTime === null || this.nextArrivalTime === undefined) {
      timerElement.textContent = '--:--';
      return;
    }
    const timeLeft = Math.max(0, this.nextArrivalTime - Date.now());
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  updateWorkerProgressBars() {
    // Throttle worker progress bar updates to prevent performance issues
    const now = Date.now();
    if (now - this.lastWorkerUpdateTime < this.WORKER_UPDATE_THROTTLE) {
      return;
    }
    this.lastWorkerUpdateTime = now;
    
    for (let slotId = 1; slotId <= this.unlockedSlots; slotId++) {
      const worker = this.assignedWorkers[slotId];
      const progressFillElement = document.getElementById(`workerProgressFill_${slotId}`);
      const progressTextElement = document.getElementById(`workerProgressText_${slotId}`);
      if (progressFillElement && progressTextElement) {
        if (worker) {
          const progress = this.getWorkerProgress(worker);
          const progressText = this.getProgressText(worker);
          const canWork = this.canWorkerWork(slotId);
          progressFillElement.style.width = `${progress}%`;
          progressTextElement.textContent = progressText;
          if (!canWork) {
            progressFillElement.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
            progressFillElement.style.width = '100%';
          } else {
            progressFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #66BB6A)';
          }
          if (progress >= 100 && worker.job && canWork) {
            this.executeWorkerAction(worker, slotId);
          }
        } else {
          progressFillElement.style.width = '0%';
          progressTextElement.textContent = 'No worker assigned';
        }
      }
    }
  }
  updateWorkerHunger() {
    const now = Date.now();
    const timeDiff = now - this.lastHungerTick;
    if (timeDiff >= 60000) {
      this.lastHungerTick = now;
      for (let slotId = 1; slotId <= this.unlockedSlots; slotId++) {
        const worker = this.assignedWorkers[slotId];
        if (worker) {
          if (this.workerHunger[slotId] === undefined) {
            this.workerHunger[slotId] = 100;
          }
          this.workerHunger[slotId] = Math.max(0, this.workerHunger[slotId] - 1);
        }
      }
    }
    this.autoFeedWorkers();
    this.updateWorkerHungerUI();
  }
  autoFeedWorkers() {
    for (let slotId = 1; slotId <= this.unlockedSlots; slotId++) {
      const worker = this.assignedWorkers[slotId];
      if (worker && this.workerHunger[slotId] !== undefined && this.workerHunger[slotId] < 90) {
        const rationsNeeded = worker.stars || 1;
        if (this.foodRations >= rationsNeeded) {
          this.workerHunger[slotId] = Math.min(100, this.workerHunger[slotId] + 10);
          this.foodRations -= rationsNeeded;
        }
      }
    }
  }
  showWorkerFeedingNotification(worker, slotId) {
    const notification = document.createElement('div');
    notification.className = 'feeding-notification';
    notification.textContent = `${worker.displayName || worker.name} has been fed!`;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }
  updateWorkerHungerUI() {
    for (let slotId = 1; slotId <= this.unlockedSlots; slotId++) {
      const hungerFillElement = document.getElementById(`workerHungerFill_${slotId}`);
      const hungerTextElement = document.getElementById(`workerHungerText_${slotId}`);
      if (hungerFillElement && hungerTextElement) {
        const worker = this.assignedWorkers[slotId];
        if (worker) {
          const hunger = this.workerHunger[slotId] !== undefined ? this.workerHunger[slotId] : 100;
          hungerFillElement.style.width = `${hunger}%`;
          hungerTextElement.textContent = `Hunger: ${hunger}/100`;
          if (hunger === 0) {
            hungerFillElement.style.backgroundColor = '#ff4444';
          } else if (hunger < 25) {
            hungerFillElement.style.backgroundColor = '#ff8800';
          } else if (hunger < 50) {
            hungerFillElement.style.backgroundColor = '#ffaa00';
          } else {
            hungerFillElement.style.backgroundColor = '#4CAF50';
          }
        } else {
          hungerFillElement.style.width = '0%';
          hungerTextElement.textContent = 'No worker assigned';
          hungerFillElement.style.backgroundColor = '#ccc';
        }
      }
    }
    const rationElement = document.getElementById('ticoFoodRations');
    if (rationElement) {
      const tokensForNextRation = this.tokensGivenToTico % 5;
      rationElement.textContent = `Food Rations ${tokensForNextRation}/5: ${this.foodRations}`;
    }
  }
  canWorkerWork(slotId) {
    const worker = this.assignedWorkers[slotId];
    if (!worker) return false;
    const hunger = this.workerHunger[slotId] !== undefined ? this.workerHunger[slotId] : 100;
    return hunger > 0;
  }
  executeWorkerAction(worker, slotId) {
    if (!this.canWorkerWork(slotId)) {
      return;
    }
    if (this.workerHunger[slotId] !== undefined) {
      this.workerHunger[slotId] = Math.max(0, this.workerHunger[slotId] - 1);
    }
    if (typeof worker.job === 'object' && worker.job.type === 'delivery_automator') {
      const automator = this.deliveryAutomatorJobs.find(da => da.id === worker.job.id);
      if (automator && automator.isUnlocked) {
        this.executeDeliveryAutomatorAction(worker, automator);
        return;
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'prism_automator') {
      const automator = this.prismTileAutomatorJobs.find(pa => pa.id === worker.job.id);
      if (automator && automator.isUnlocked) {
        this.executePrismTileAutomatorAction(worker, automator);
        return;
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'token_finder_automator') {
      const automator = this.tokenFinderAutomatorJobs.find(ta => ta.id === worker.job.id);
      if (automator && automator.isUnlocked) {
        this.executeTokenFinderAutomatorAction(worker, automator);
        return;
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'upgrade_automator') {
      this.executeUpgradeAutomatorAction(worker);
      return;
    }
    if (typeof worker.job === 'object' && worker.job.type === 'auto_nectarize') {
      this.executeAutoNectarizeAction(worker);
      return;
    }
    if (typeof worker.job === 'object' && worker.job.type === 'light_generator_automator') {
      const automator = this.lightGeneratorAutomatorJobs.find(lga => lga.id === worker.job.id);
      if (automator && automator.isUnlocked) {
        this.executeLightGeneratorAutomatorAction(worker, automator);
        return;
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'generator_automator') {
      const automator = this.generatorAutomatorJobs.find(ga => ga.id === worker.job.id);
      if (automator && automator.isUnlocked) {
        this.executeGeneratorAutomatorAction(worker, automator);
        return;
      }
    }
    const autobuyer = this.autobuyerJobs.find(ab => ab.id === worker.job);
    if (autobuyer && autobuyer.isUnlocked) {
      worker.lastActionTime = Date.now();
      const buyFunction = window.buyBox || window.buybox;
      const earnFunction = window.earnBox;
      if (buyFunction && typeof buyFunction === 'function') {
        try {
          if (autobuyer.boxType === 'all') {
            const boxTypes = ['common', 'uncommon', 'rare', 'legendary', 'mythic'];
            boxTypes.forEach(boxType => {
              if (window.state && window.state.boxesProducedByType) {
                if (!window.state.boxesProducedByType[boxType]) {
                  window.state.boxesProducedByType[boxType] = new Decimal(0);
                }
                if (!DecimalUtils.isDecimal(window.state.boxesProducedByType[boxType])) {
                  window.state.boxesProducedByType[boxType] = new Decimal(window.state.boxesProducedByType[boxType] || 0);
                }
                window.state.boxesProducedByType[boxType] = window.state.boxesProducedByType[boxType].add(1);
                window.state.boxesProduced = (window.state.boxesProduced || 0) + 1;
                if (earnFunction && typeof earnFunction === 'function') {
                  try {
                    earnFunction(boxType, 1, true, 1);
                  } catch (error) {
                  }
                }
              }
            });
            if (typeof window.upgradeMk2Speed === 'function') {
              const oldMk2SpeedLevel = window.state.mk2SpeedUpgrades || 0;
              try {
                window.upgradeMk2Speed();
                const newMk2SpeedLevel = window.state.mk2SpeedUpgrades || 0;
                if (newMk2SpeedLevel > oldMk2SpeedLevel) {
                }
              } catch (error) {
              }
            }
            if (typeof window.buyAllGeneratorUpgrades === 'function') {
              const oldDoubleAllLevel = window.state.doubleAllBoxUpgrades || 0;
              try {
                window.buyAllGeneratorUpgrades();
                const newDoubleAllLevel = window.state.doubleAllBoxUpgrades || 0;
                if (newDoubleAllLevel > oldDoubleAllLevel) {
                }
              } catch (error) {
              }
            }
          } else {
            buyFunction(autobuyer.boxType);
          }
        } catch (error) {
        }
      } else {
      }
    }
  }
  executeGeneratorAutomatorAction(worker, automator) {
    worker.lastActionTime = Date.now();
    const generatorType = automator.generatorType;
    if (generatorType) {
      const upgraded = this.tryBuyGeneratorUpgrades(generatorType);
      if (upgraded) {
      } else {
      }
    } else {
    }
  }
  tryBuyGeneratorUpgrades(generatorType) {
    const isMk2Active = this.workers.some(worker => worker.job === 'box_generator_mk2');
    if (isMk2Active) {
      return false;
    }
    let speedUpgradeBought = false;
    let doublerUpgradeBought = false;
    const generatorMap = {
      'common': { index: 0, currency: 'fluff' },
      'uncommon': { index: 1, currency: 'swaria' },
      'rare': { index: 2, currency: 'feathers' },
      'legendary': { index: 3, currency: 'artifacts' },
      'mythic': { index: 4, currency: 'kp' }
    };
    const genInfo = generatorMap[generatorType];
    if (!genInfo) {
      return false;
    }
    if (typeof window.upgradeGenerator === 'function') {
      try {
        if (window.generators && window.generators[genInfo.index]) {
          const gen = window.generators[genInfo.index];
          const cost = DecimalUtils.multiply(gen.baseCost, new Decimal(gen.costMultiplier).pow(gen.upgrades));
          let canAfford = false;
          if (genInfo.currency === 'kp') {
            canAfford = window.state && window.state.kp &&
                       DecimalUtils.isDecimal(window.state.kp) &&
                       window.state.kp.gte(cost);
          } else if (genInfo.currency === 'swaria') {
            canAfford = window.state && window.state.swaria &&
                       DecimalUtils.isDecimal(window.state.swaria) &&
                       window.state.swaria.gte(cost);
          } else {
            canAfford = window.state && window.state[genInfo.currency] &&
                       DecimalUtils.isDecimal(window.state[genInfo.currency]) &&
                       window.state[genInfo.currency].gte(cost);
          }
          if (canAfford) {
            window.upgradeGenerator(genInfo.index);
            speedUpgradeBought = true;
          }
        }
      } catch (error) {
      }
    }
    if (typeof window.buyGeneratorUpgrade === 'function') {
      try {
        if (window.state && window.state.boxesProducedByType && window.state.boxesProducedByType[generatorType]) {
          const cost = window.getGeneratorUpgradeCost ? window.getGeneratorUpgradeCost(generatorType) : new Decimal(25);
          if (DecimalUtils.isDecimal(window.state.boxesProducedByType[generatorType]) &&
              window.state.boxesProducedByType[generatorType].gte(cost)) {
            window.buyGeneratorUpgrade(generatorType);
            doublerUpgradeBought = true;
          }
        }
      } catch (error) {
      }
    }
    return speedUpgradeBought || doublerUpgradeBought;
  }
  executeDeliveryAutomatorAction(worker, automator) {
    try {
      worker.lastActionTime = Date.now();
      let kpGain = new Decimal(0);
      if (typeof window.getKpGainPreview === 'function') {
        kpGain = window.getKpGainPreview();
      } else {
        if (window.state && window.state.artifacts && window.state.artifacts.gte(50)) {
          kpGain = DecimalUtils.divide(window.state.artifacts, new Decimal(50));
        }
      }
      const deliveryPercentage = automator.deliveryPercentage || 5;
      const deliveryAmount = DecimalUtils.multiply(kpGain, new Decimal(deliveryPercentage / 100));
      if (deliveryAmount.gt(0)) {
        // Add KP to centralized state system
        if (window.state && window.state.kp !== undefined) {
          if (!DecimalUtils.isDecimal(window.state.kp)) {
            window.state.kp = new Decimal(window.state.kp || 0);
          }
          window.state.kp = window.state.kp.add(deliveryAmount);
          this.makeWorkerSpeak(worker, `Gained ${window.formatNumber(deliveryAmount)} KP from delivering to the Swa elites!`, 3000);
          if (typeof window.updateUI === 'function') {
            window.updateUI();
          }
        } else {
          this.makeWorkerSpeak(worker, `KP system not available for delivery.`, 2000);
        }
      } else {
        this.makeWorkerSpeak(worker, `No KP available to deliver right now.`, 2000);
      }
    } catch (error) {
      this.makeWorkerSpeak(worker, `Error delivering KP.`, 2000);
      worker.lastActionTime = Date.now();
    }
  }
  executePrismTileAutomatorAction(worker, automator) {
    worker.lastActionTime = Date.now();
    if (window.prismState && typeof window.clickLightTile === 'function') {
      const activeTileIndex = window.prismState.activeTileIndex;
      if (activeTileIndex !== null) {
        try {
          window.clickLightTile(activeTileIndex);
        } catch (error) {
        }
      } else {
      }
    } else {
    }
    this.saveData();
  }
  executeTokenFinderAutomatorAction(worker, automator) {
    worker.lastActionTime = Date.now();
    const commonTokens = ['berries', 'sparks', 'mushroom', 'petals', 'water', 'prisma'];
    const rareTokens = ['stardust', 'swabucks'];
    let selectedTokenType;
    if (Math.random() < 0.8) {
      selectedTokenType = commonTokens[Math.floor(Math.random() * commonTokens.length)];
    } else {
      selectedTokenType = rareTokens[Math.floor(Math.random() * rareTokens.length)];
    }
    try {
      if (typeof window.collectIngredientToken === 'function') {
        const dummyToken = document.createElement('div');
        dummyToken.style.position = 'fixed';
        dummyToken.style.left = '50%';
        dummyToken.style.top = '50%';
        dummyToken.style.pointerEvents = 'none';
        dummyToken.dataset.type = selectedTokenType;
        dummyToken.dataset.collected = 'false';
        window.collectIngredientToken(selectedTokenType, dummyToken);
        const tokenDisplayNames = {
          berries: 'berry',
          sparks: 'spark',
          mushroom: 'mushroom',
          petals: 'petal',
          water: 'water',
          prisma: 'prisma shard',
          stardust: 'stardust',
          swabucks: 'Swa buck'
        };
        const displayName = tokenDisplayNames[selectedTokenType] || selectedTokenType;
        this.makeWorkerSpeak(worker, `Found a ${displayName} token!`, 2000);
      } else {
        this.makeWorkerSpeak(worker, `Token system not available.`, 2000);
      }
    } catch (error) {
      this.makeWorkerSpeak(worker, `Error finding tokens.`, 2000);
    }
  }
  executeLightGeneratorAutomatorAction(worker, automator) {
    worker.lastActionTime = Date.now();
    try {
      const generatorType = automator.generatorType;
      if (window.prismState && typeof window.handleLightGenClick === 'function') {
        const beforeUpgrades = window.prismState.generatorUpgrades[generatorType] || 0;
        window.handleLightGenClick(generatorType);
        const afterUpgrades = window.prismState.generatorUpgrades[generatorType] || 0;
        if (afterUpgrades > beforeUpgrades) {
          this.onLightGeneratorTick(automator.id);
          const generatorDisplayName = generatorType === 'light' ? 'light' :
                                      generatorType.replace('light', ' light');
          this.makeWorkerSpeak(worker, `Upgraded the ${generatorDisplayName} generator!`, 2000);
        } else {
          const generatorDisplayName = generatorType === 'light' ? 'light' :
                                      generatorType.replace('light', ' light');
          this.makeWorkerSpeak(worker, `Can't upgrade ${generatorDisplayName} generator - not enough resources.`, 2000);
        }
      } else {
        this.makeWorkerSpeak(worker, `Light generator system not available.`, 2000);
      }
    } catch (error) {
      this.makeWorkerSpeak(worker, `Error upgrading light generator.`, 2000);
    }
  }
  executeUpgradeAutomatorAction(worker) {
    worker.lastActionTime = Date.now();
    try {
      const upgradeType = worker.job.upgradeType;
      if (upgradeType === 'pollen') {
        this.buyMaxPollenUpgrades(worker);
      } else if (upgradeType === 'flower') {
        this.buyMaxFlowerUpgrades(worker);
      } else if (upgradeType === 'nectar') {
        this.buyMaxNectarUpgrades(worker);
      }
      this.updateUpgradeCounters();
      const upgradeTypeDisplay = upgradeType.charAt(0).toUpperCase() + upgradeType.slice(1);
      this.makeWorkerSpeak(worker, `Bought max ${upgradeTypeDisplay} upgrades!`, 2000);
    } catch (error) {
      this.makeWorkerSpeak(worker, `Error buying upgrades.`, 2000);
    }
    this.saveData();
  }
  buyMaxPollenUpgrades(worker) {
    try {
      if (window.buyMaxPollenValueUpgrade && typeof window.buyMaxPollenValueUpgrade === 'function') {
        window.buyMaxPollenValueUpgrade();
        this.totalPollenUpgradesBought += 1;
      }
      if (window.buyMaxPollenValueUpgrade && typeof window.buyMaxPollenValueUpgrade === 'function') {
        window.buyMaxPollenValueUpgrade();
        this.totalPollenUpgradesBought += 1;
      }
      if (window.buyMaxFlowerXPUpgrade && typeof window.buyMaxFlowerXPUpgrade === 'function') {
        window.buyMaxFlowerXPUpgrade();
        this.totalPollenUpgradesBought += 1;
      }
      if (window.buyMaxPollenToolSpeedUpgrade && typeof window.buyMaxPollenToolSpeedUpgrade === 'function') {
        window.buyMaxPollenToolSpeedUpgrade();
        this.totalPollenUpgradesBought += 1;
      }
    } catch (error) {
    }
  }
  buyMaxFlowerUpgrades(worker) {
    try {
      if (window.buyMaxFlowerUpgrade3 && typeof window.buyMaxFlowerUpgrade3 === 'function') {
        window.buyMaxFlowerUpgrade3();
        this.totalFlowerUpgradesBought += 1;
      }
      if (window.buyMaxFlowerValueUpgrade && typeof window.buyMaxFlowerValueUpgrade === 'function') {
        window.buyMaxFlowerValueUpgrade();
        this.totalFlowerUpgradesBought += 1;
      }
      if (window.buyMaxExtraChargeUpgrade && typeof window.buyMaxExtraChargeUpgrade === 'function') {
        window.buyMaxExtraChargeUpgrade();
        this.totalFlowerUpgradesBought += 1;
      }
      if (window.buyMaxFlowerFieldExpansionUpgrade && typeof window.buyMaxFlowerFieldExpansionUpgrade === 'function') {
        window.buyMaxFlowerFieldExpansionUpgrade();
        this.totalFlowerUpgradesBought += 1;
      }
      if (window.buyFlowerUpgrade4 && typeof window.buyFlowerUpgrade4 === 'function') {
        window.buyFlowerUpgrade4(1);
        this.totalFlowerUpgradesBought += 1;
      }
      if (window.buyFlowerUpgrade5 && typeof window.buyFlowerUpgrade5 === 'function') {
        window.buyFlowerUpgrade5(1);
        this.totalFlowerUpgradesBought += 1;
      }
    } catch (error) {
    }
  }  buyMaxNectarUpgrades(worker) {
    try {
      if (window.buyMaxXpMultiplierUpgrade && typeof window.buyMaxXpMultiplierUpgrade === 'function') {
        window.buyMaxXpMultiplierUpgrade();
        this.totalNectarUpgradesBought += 1;
      }
      if (window.buyMaxPollenFlowerNectarUpgrade && typeof window.buyMaxPollenFlowerNectarUpgrade === 'function') {
        window.buyMaxPollenFlowerNectarUpgrade();
        this.totalNectarUpgradesBought += 1;
      }
      if (window.buyMaxNectarXpUpgrade && typeof window.buyMaxNectarXpUpgrade === 'function') {
        window.buyMaxNectarXpUpgrade();
        this.totalNectarUpgradesBought += 1;
      }
      if (window.buyMaxKpNectarUpgrade && typeof window.buyMaxKpNectarUpgrade === 'function') {
        window.buyMaxKpNectarUpgrade();
        this.totalNectarUpgradesBought += 1;
      }
      if (window.buyMaxNectarInfinityUpgrade && typeof window.buyMaxNectarInfinityUpgrade === 'function') {
        window.buyMaxNectarInfinityUpgrade();
        this.totalNectarUpgradesBought += 1;
      }
    } catch (error) {
    }
  }
  calculateCurrentKPGain() {
    if (typeof window.getKpGainPreview === 'function') {
      return window.getKpGainPreview();
    }
    if (window.state && window.state.artifacts && window.state.artifacts.gte(50)) {
      return DecimalUtils.divide(window.state.artifacts, new Decimal(50));
    }
    return new Decimal(0);
  }
  renderUI(forceUpdate = false) {
    // Throttle UI updates to prevent performance issues
    const now = Date.now();
    if (!forceUpdate && (now - this.lastFrontDeskUIUpdateTime < this.FRONT_DESK_UI_UPDATE_THROTTLE)) {
      return;
    }
    this.lastFrontDeskUIUpdateTime = now;
    
    this.renderAvailableWorkers();
    this.renderWorkerSlots();
    this.updateWorkerHungerUI();
  }
  addSelectedWorkerStyles() {
    if (document.getElementById('selectedWorkerStyles')) return;
    const style = document.createElement('style');
    style.id = 'selectedWorkerStyles';
    style.textContent = `
      .frontdesk-container {
        position: relative !important;
      }
      .worker-card.selected {
        background: linear-gradient(135deg, #FFD700, #FFA500) !important;
        border: 3px solid #FF8C00 !important;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.6) !important;
        transform: scale(1.05) !important;
        z-index: 10 !important;
      }
      .worker-card.selected .worker-name {
        color: #8B4513 !important;
        font-weight: bold !important;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
      }
      .worker-card {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
      }
      .worker-card:hover {
        transform: scale(1.02) !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
      }
      .worker-drop-zone:not(.occupied) {
        cursor: pointer !important;
      }
      .worker-drop-zone:not(.occupied):hover {
        background-color: rgba(76, 175, 80, 0.1) !important;
        border: 2px dashed #4CAF50 !important;
      }
    `;
    document.head.appendChild(style);
  }
  selectWorker(workerId) {
    const worker = this.availableWorkers.find(w => w.id === workerId);
    if (!worker) {
      const workerAlt = this.availableWorkers.find(w => w && w.id && w.id.toString() === workerId.toString());
      if (workerAlt) {
        this.selectedWorker = workerAlt;
        this.renderAvailableWorkers();
      }
      return;
    }
    this.selectedWorker = worker;
    this.renderAvailableWorkers();
  }
  pokeAndSelectWorker(workerId) {
    this.pokeWorker(workerId);
    this.selectWorker(workerId);
  }
  handleSlotClick(slotId) {
    if (!this.selectedWorker) {
      return;
    }
    if (this.assignedWorkers[slotId]) {
      return;
    }
    if (slotId > this.unlockedSlots) {
      return;
    }
    this.assignWorkerToSlotDirect(this.selectedWorker, slotId);
    this.selectedWorker = null;
    this.renderUI(true); // Force immediate update for user interaction
  }
  renderAvailableWorkers() {
    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`availableSlot${i}`);
      if (!slot) continue;
      const worker = this.availableWorkers[i - 1];
      if (worker) {
        const timeRemaining = Math.max(0, this.workerLifetime - (Date.now() - worker.arrivalTime));
        const minutesLeft = Math.floor(timeRemaining / 60000);
        const starColor = worker.starData.color;
        const starDisplay = '⭐'.repeat(worker.stars) + '☆'.repeat(5 - worker.stars);
        slot.innerHTML = `
          <div class="worker-card ${this.selectedWorker && this.selectedWorker.id === worker.id ? 'selected' : ''}"
               draggable="true"
               data-worker-id="${worker.id}"
               onclick="window.frontDesk.selectWorker('${worker.id}')">
            <div class="worker-image-area" onclick="window.frontDesk.pokeAndSelectWorker('${worker.id}')">
              <img src="${worker.image}" alt="${worker.name}" class="worker-image">
            </div>
            <div class="worker-name" onclick="event.stopPropagation(); frontDesk.startRenameWorker('${worker.id}')">${worker.displayName}</div>
            <div class="worker-stars" style="color: ${starColor}">${starDisplay}</div>
            <div class="time-remaining">${minutesLeft}m left</div>
          </div>
        `;
        slot.classList.add('occupied');
        const workerCard = slot.querySelector('.worker-card');
        this.addDragListeners(workerCard);
      } else {
        slot.innerHTML = '<div class="worker-placeholder">Empty</div>';
        slot.classList.remove('occupied');
      }
    }
  }
  renderWorkerSlots() {
    const container = document.getElementById('workerSlots');
    if (!container) return;
    container.innerHTML = '';
    const nextUnlockableSlot = this.unlockedSlots + 1;
    const slotsToShow = Math.min(nextUnlockableSlot, this.maxSlots);
    for (let i = 1; i <= slotsToShow; i++) {
      const isUnlocked = i <= this.unlockedSlots;
      const worker = this.assignedWorkers[i];
      const slotElement = document.createElement('div');
      slotElement.className = 'worker-slot';
      if (isUnlocked) {
        slotElement.innerHTML = `
          <div class="worker-slot-header">
            <h4 class="worker-slot-title ${worker ? 'worker-name-clickable' : ''}" ${worker ? `onclick="window.frontDesk.startRenameWorker('${worker.id}')"` : ''}>${worker ? `${worker.displayName || worker.name}${worker.job ? ` - <span style="font-size: 0.8em; font-weight: normal;">${this.getJobName(worker.job)}</span>` : ''}` : `Slot ${i}`}</h4>
            ${worker ? `<div class="worker-stars-header" style="color: ${worker.starData ? worker.starData.color : '#FFD700'}">${'⭐'.repeat(worker.stars)}${'☆'.repeat(5 - worker.stars)}</div>` : ''}
            <div class="worker-slot-buttons">
              <button class="assign-job-btn" onclick="window.frontDesk.openJobModal(${i})" ${!worker ? 'disabled' : ''}>
                Assign Job
              </button>
              <button class="unassign-job-btn" onclick="window.frontDesk.unassignWorkerJob(${i})" ${!worker || !worker.job ? 'disabled' : ''}>
                Unassign Job
              </button>
              <button class="fire-worker-btn" onclick="frontDesk.openFireModal(${i})" ${!worker ? 'disabled' : ''}>
                Fire
              </button>
            </div>
          </div>
          <div class="worker-drop-zone ${worker ? 'occupied' : ''}"
               data-slot-id="${i}"
               ondrop="frontDesk.handleDrop(event)"
               ondragover="frontDesk.handleDragOver(event)"
               ondragleave="frontDesk.handleDragLeave(event)"
               onclick="window.frontDesk.handleSlotClick(${i})">
            ${worker ? this.renderAssignedWorkerLarge(worker) : '<div class="placeholder-text">Click to place selected worker or drag a worker here</div>'}
          </div>
          <div class="worker-progress-bar" id="workerProgressBar_${i}">
            <div class="worker-progress-fill" id="workerProgressFill_${i}" style="width: ${worker ? this.getWorkerProgress(worker) : 0}%"></div>
            <div class="worker-progress-text" id="workerProgressText_${i}">${worker ? this.getProgressText(worker) : 'No worker assigned'}</div>
          </div>
          <div class="worker-hunger-bar" id="workerHungerBar_${i}">
            <div class="worker-hunger-fill" id="workerHungerFill_${i}" style="width: ${worker ? (this.workerHunger[i] !== undefined ? this.workerHunger[i] : 100) : 0}%; background-color: ${worker ? ((this.workerHunger[i] !== undefined ? this.workerHunger[i] : 100) === 0 ? '#ff4444' : (this.workerHunger[i] !== undefined ? this.workerHunger[i] : 100) < 25 ? '#ff8800' : (this.workerHunger[i] !== undefined ? this.workerHunger[i] : 100) < 50 ? '#ffaa00' : '#4CAF50') : '#ccc'}"></div>
            <div class="worker-hunger-text" id="workerHungerText_${i}">${worker ? `Hunger: ${this.workerHunger[i] !== undefined ? this.workerHunger[i] : 100}/100` : 'No worker assigned'}</div>
          </div>
        `;
      } else {
        const cost = this.getSlotCost(i);
        slotElement.innerHTML = `
          <div class="worker-slot-header">
            <h4 class="worker-slot-title">Slot ${i} (Locked)</h4>
          </div>
          <div class="worker-drop-zone">
            <div class="placeholder-text">Unlock this slot to use it</div>
          </div>
          <button class="unlock-slot-btn" onclick="frontDesk.unlockSlot(${i})" ${!this.canAffordSlot(i) ? 'disabled' : ''}>
            Unlock for ${cost} Swa Bucks
          </button>
        `;
      }
      container.appendChild(slotElement);
    }
  }
  renderAssignedWorker(worker) {
    const starColor = worker.starData ? worker.starData.color : '#FFD700';
    const starDisplay = '?'.repeat(worker.stars) + '?'.repeat(5 - worker.stars);
    return `
      <div class="assigned-worker" onclick="frontDesk.pokeWorkerById('${worker.id}')">
        <img src="${worker.image}" alt="${worker.name}">
        <div class="worker-name" onclick="event.stopPropagation(); frontDesk.startRenameWorker('${worker.id}')">${worker.displayName || worker.name}</div>
        ${worker.job ? `<div class="worker-job">${this.getJobName(worker.job)}</div>` : ''}
        <div class="worker-stars" style="color: ${starColor}">${starDisplay}</div>
      </div>
    `;
  }
  renderAssignedWorkerLarge(worker) {
    return `
      <div class="assigned-worker-large" onclick="frontDesk.pokeWorkerById('${worker.id}')">
        <img src="${worker.image}" alt="${worker.name}" class="worker-image-large">
      </div>
    `;
  }
  getSlotCost(slotNumber) {
    return (slotNumber - 1) * 100;
  }
  canAffordSlot(slotNumber) {
    const cost = this.getSlotCost(slotNumber);
    if (!window.state || !window.state.swabucks) return false;
    if (DecimalUtils.isDecimal(window.state.swabucks)) {
      return window.state.swabucks.gte(cost);
    }
    return window.state.swabucks >= cost;
  }
  unlockSlot(slotNumber) {
    if (!this.canAffordSlot(slotNumber)) return;
    const cost = this.getSlotCost(slotNumber);
    if (DecimalUtils.isDecimal(window.state.swabucks)) {
      window.state.swabucks = window.state.swabucks.sub(cost);
    } else {
      window.state.swabucks -= cost;
    }
    this.unlockedSlots = Math.max(this.unlockedSlots, slotNumber);
    this.renderWorkerSlots();
    this.saveData();
  }
  addDragListeners(element) {
    element.setAttribute('draggable', 'true');
    element.addEventListener('dragstart', (e) => {
      let workerCard = e.target;
      while (workerCard && !workerCard.classList.contains('worker-card')) {
        workerCard = workerCard.parentElement;
      }
      if (workerCard && workerCard.dataset.workerId) {
        e.dataTransfer.setData('text/plain', workerCard.dataset.workerId);
        workerCard.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        this.startAutoScroll();
      } else {
        e.preventDefault();
      }
    });
    element.addEventListener('drag', (e) => {
      if (this.isDragging && e.clientY > 0) {
        this.updateMousePosition(e);
      }
    });
    element.addEventListener('dragend', (e) => {
      let workerCard = e.target;
      while (workerCard && !workerCard.classList.contains('worker-card')) {
        workerCard = workerCard.parentElement;
      }
      if (workerCard) {
        workerCard.classList.remove('dragging');
      }
      this.stopAutoScroll();
    });
    element.addEventListener('mousedown', (e) => {
      let workerCard = e.target.closest('.worker-card');
      if (workerCard) {
        workerCard.setAttribute('draggable', 'true');
      }
    });
  }
  handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
    this.updateMousePosition(event);
  }
  startAutoScroll() {
    this.isDragging = true;
    this.lastMouseY = 0;
    this.scrollZoneHeight = 150;
    this.scrollSpeed = 3;
    this.maxScrollSpeed = 15;
    this.globalMouseTracker = (e) => {
      this.lastMouseY = e.clientY;
    };
    this.wheelScrollHandler = (e) => {
      if (this.isDragging) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const scrollAmount = e.deltaY * 0.5;
        window.scrollBy(0, scrollAmount);
        return false;
      }
    };
    this.wheelScrollHandlerAlt = (e) => {
      if (this.isDragging) {
        e.preventDefault();
        e.stopPropagation();
        let delta = 0;
        if (e.wheelDelta) {
          delta = -e.wheelDelta / 120;
        } else if (e.detail) {
          delta = e.detail / 3;
        }
        const scrollAmount = delta * 40;
        window.scrollBy(0, scrollAmount);
        return false;
      }
    };
    document.addEventListener('mousemove', this.globalMouseTracker, true);
    document.addEventListener('dragover', this.globalMouseTracker, true);
    document.addEventListener('wheel', this.wheelScrollHandler, { passive: false, capture: true });
    document.addEventListener('mousewheel', this.wheelScrollHandlerAlt, { passive: false, capture: true });
    document.addEventListener('DOMMouseScroll', this.wheelScrollHandlerAlt, { passive: false, capture: true });
    window.addEventListener('wheel', this.wheelScrollHandler, { passive: false, capture: true });
    this.mouseUpdateInterval = setInterval(() => {
      if (this.isDragging) {
        this.checkAndScroll();
      }
    }, 16);
    this.autoScrollAnimation();
  }
  stopAutoScroll() {
    this.isDragging = false;
    if (this.globalMouseTracker) {
      document.removeEventListener('mousemove', this.globalMouseTracker, true);
      document.removeEventListener('dragover', this.globalMouseTracker, true);
      this.globalMouseTracker = null;
    }
    if (this.wheelScrollHandler) {
      document.removeEventListener('wheel', this.wheelScrollHandler, { capture: true });
      window.removeEventListener('wheel', this.wheelScrollHandler, { capture: true });
      this.wheelScrollHandler = null;
    }
    if (this.wheelScrollHandlerAlt) {
      document.removeEventListener('mousewheel', this.wheelScrollHandlerAlt, { capture: true });
      document.removeEventListener('DOMMouseScroll', this.wheelScrollHandlerAlt, { capture: true });
      this.wheelScrollHandlerAlt = null;
    }
    if (this.mouseUpdateInterval) {
      clearInterval(this.mouseUpdateInterval);
      this.mouseUpdateInterval = null;
    }
  }
  updateMousePosition(event) {
    if (this.isDragging && event.clientY > 0) {
      this.lastMouseY = event.clientY;
    }
  }
  checkAndScroll() {
    if (!this.isDragging || this.lastMouseY <= 0) {
      return;
    }
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const topZone = this.scrollZoneHeight;
    const bottomZone = viewportHeight - (this.scrollZoneHeight * 3);
    if (this.lastMouseY < topZone && scrollTop > 0) {
      const intensity = (topZone - this.lastMouseY) / topZone;
      const scrollAmount = Math.max(2, Math.min(this.maxScrollSpeed, this.scrollSpeed + (intensity * 12)));
      window.scrollBy(0, -scrollAmount);
    } else if (this.lastMouseY > bottomZone && scrollTop + viewportHeight < documentHeight - 5) {
      const intensity = (this.lastMouseY - bottomZone) / (viewportHeight - bottomZone);
      const scrollAmount = Math.max(2, Math.min(this.maxScrollSpeed, this.scrollSpeed + (intensity * 12)));
      window.scrollBy(0, scrollAmount);
    }
  }
  autoScrollAnimation() {
    if (!this.isDragging) {
      return;
    }
    this.checkAndScroll();
    requestAnimationFrame(() => this.autoScrollAnimation());
  }
  handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
  }
  handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    const workerId = event.dataTransfer.getData('text/plain');
    const slotId = parseInt(event.currentTarget.dataset.slotId);
    this.assignWorkerToSlot(workerId, slotId);
  }
  assignWorkerToSlotDirect(worker, slotId) {
    const workerIndex = this.availableWorkers.findIndex(w => w && w.id === worker.id);
    if (workerIndex !== -1) {
      this.availableWorkers.splice(workerIndex, 1);
    } else {
    }
    this.assignedWorkers[slotId] = worker;
    this.workerHunger[slotId] = 100;
    this.renderAvailableWorkers();
    this.renderWorkerSlots();
    this.saveData();
    if (this.canHireUniqueWorkers() && this.nextArrivalTime === null) {
      this.scheduleNextArrival();
    }
  }
  assignWorkerToSlot(workerId, slotId) {
    const workerIndex = this.availableWorkers.findIndex(w => w.id.toString() === workerId);
    if (workerIndex === -1) {
      return;
    }
    const worker = this.availableWorkers[workerIndex];
    this.availableWorkers.splice(workerIndex, 1);
    this.assignedWorkers[slotId] = worker;
    this.renderAvailableWorkers();
    this.renderWorkerSlots();
    this.saveData();
    if (this.canHireUniqueWorkers() && this.nextArrivalTime === null) {
      this.scheduleNextArrival();
    }
  }
  updateJobModalIfOpen() {
    const modal = document.getElementById('jobAssignmentModal');
    if (modal && modal.style.display === 'flex') {
      const currentSlotId = this.currentJobModalSlot;
      if (currentSlotId && this.assignedWorkers[currentSlotId]) {
        this.openJobModal(currentSlotId);
      }
    }
  }
  updateUpgradeCounters() {
    const currentPollenUpgrades = (window.pollenValueUpgradeLevel || 0) +
                                 (window.terrariumPollenValueUpgradeLevel || 0) +
                                 (window.terrariumFlowerXPUpgradeLevel || 0) +
                                 (window.terrariumPollenToolSpeedUpgradeLevel || 0);
    const currentFlowerUpgrades = (window.pollenValueUpgrade2Level || 0) +
                                 (window.terrariumPollenValueUpgrade2Level || 0) +
                                 (window.terrariumExtraChargeUpgradeLevel || 0) +
                                 (window.terrariumFlowerFieldExpansionUpgradeLevel || 0) +
                                 (window.terrariumFlowerUpgrade4Level || 0);
    const currentNectarUpgrades = (window.terrariumXpMultiplierUpgradeLevel || 0) +
                                 (window.terrariumPollenFlowerNectarUpgradeLevel || 0) +
                                 (window.terrariumNectarXpUpgradeLevel || 0) +
                                 (window.terrariumKpNectarUpgradeLevel || 0);
    window.totalPollenUpgradesBought = this.totalPollenUpgradesBought;
    window.totalFlowerUpgradesBought = this.totalFlowerUpgradesBought;
    window.totalNectarUpgradesBought = this.totalNectarUpgradesBought;
  }
  incrementPollenUpgradeCounter(amount = 1) {
    this.totalPollenUpgradesBought += amount;
    window.totalPollenUpgradesBought = this.totalPollenUpgradesBought;
    this.saveData();
  }
  incrementFlowerUpgradeCounter(amount = 1) {
    this.totalFlowerUpgradesBought += amount;
    window.totalFlowerUpgradesBought = this.totalFlowerUpgradesBought;
    this.saveData();
  }
  incrementNectarUpgradeCounter(amount = 1) {
    this.totalNectarUpgradesBought += amount;
    window.totalNectarUpgradesBought = this.totalNectarUpgradesBought;
    this.saveData();
  }
  monitorUpgradeChanges() {
    const currentPollenLevels = {
      pollenValueUpgradeLevel: window.pollenValueUpgradeLevel || 0,
      terrariumPollenValueUpgradeLevel: window.terrariumPollenValueUpgradeLevel || 0,
      terrariumFlowerXPUpgradeLevel: window.terrariumFlowerXPUpgradeLevel || 0,
      terrariumPollenToolSpeedUpgradeLevel: window.terrariumPollenToolSpeedUpgradeLevel || 0
    };
    const currentFlowerLevels = {
      pollenValueUpgrade2Level: window.pollenValueUpgrade2Level || 0,
      terrariumPollenValueUpgrade2Level: window.terrariumPollenValueUpgrade2Level || 0,
      terrariumExtraChargeUpgradeLevel: window.terrariumExtraChargeUpgradeLevel || 0,
      terrariumFlowerFieldExpansionUpgradeLevel: window.terrariumFlowerFieldExpansionUpgradeLevel || 0,
      terrariumFlowerUpgrade4Level: window.terrariumFlowerUpgrade4Level || 0
    };
    const currentNectarLevels = {
      terrariumXpMultiplierUpgradeLevel: window.terrariumXpMultiplierUpgradeLevel || 0,
      terrariumPollenFlowerNectarUpgradeLevel: window.terrariumPollenFlowerNectarUpgradeLevel || 0,
      terrariumNectarXpUpgradeLevel: window.terrariumNectarXpUpgradeLevel || 0,
      terrariumKpNectarUpgradeLevel: window.terrariumKpNectarUpgradeLevel || 0
    };
    let pollenIncrease = 0;
    for (const [key, currentLevel] of Object.entries(currentPollenLevels)) {
      const previousLevel = this.previousUpgradeLevels.pollen[key] || 0;
      if (currentLevel > previousLevel) {
        pollenIncrease += (currentLevel - previousLevel);
        this.previousUpgradeLevels.pollen[key] = currentLevel;
      }
    }
    let flowerIncrease = 0;
    for (const [key, currentLevel] of Object.entries(currentFlowerLevels)) {
      const previousLevel = this.previousUpgradeLevels.flower[key] || 0;
      if (currentLevel > previousLevel) {
        flowerIncrease += (currentLevel - previousLevel);
        this.previousUpgradeLevels.flower[key] = currentLevel;
      }
    }
    let nectarIncrease = 0;
    for (const [key, currentLevel] of Object.entries(currentNectarLevels)) {
      const previousLevel = this.previousUpgradeLevels.nectar[key] || 0;
      if (currentLevel > previousLevel) {
        nectarIncrease += (currentLevel - previousLevel);
        this.previousUpgradeLevels.nectar[key] = currentLevel;
      }
    }
    if (pollenIncrease > 0) {
      this.incrementPollenUpgradeCounter(pollenIncrease);
    }
    if (flowerIncrease > 0) {
      this.incrementFlowerUpgradeCounter(flowerIncrease);
    }
    if (nectarIncrease > 0) {
      this.incrementNectarUpgradeCounter(nectarIncrease);
    }
  }
  hasAnyPollenUpgrade() {
    return (window.pollenValueUpgradeLevel || 0) > 0 ||
           (window.terrariumPollenValueUpgradeLevel || 0) > 0 ||
           (window.terrariumFlowerXPUpgradeLevel || 0) > 0 ||
           (window.terrariumPollenToolSpeedUpgradeLevel || 0) > 0;
  }
  hasAnyFlowerUpgrade() {
    return (window.pollenValueUpgrade2Level || 0) > 0 ||
           (window.terrariumPollenValueUpgrade2Level || 0) > 0 ||
           (window.terrariumExtraChargeUpgradeLevel || 0) > 0 ||
           (window.terrariumFlowerFieldExpansionUpgradeLevel || 0) > 0 ||
           (window.terrariumFlowerUpgrade4Level || 0) > 0;
  }  hasAnyNectarUpgrade() {
    return (window.terrariumXpMultiplierUpgradeLevel || 0) > 0 ||
           (window.terrariumPollenFlowerNectarUpgradeLevel || 0) > 0 ||
           (window.terrariumNectarXpUpgradeLevel || 0) > 0 ||
           (window.terrariumKpNectarUpgradeLevel || 0) > 0;
  }
  getUpgradeAutomatorInterval(stars) {
    const intervals = {
      1: 100000,
      2: 60000,
      3: 25000,
      4: 10000,
      5: 2000
    };
    return intervals[Math.min(stars, 5)] || intervals[1];
  }
  getAutoNectarizeInterval(stars) {
    const intervals = {
      1: 3600,
      2: 3000,
      3: 2225,
      4: 1500,
      5: 300
    };
    return (intervals[Math.min(stars, 5)] || intervals[1]) * 1000;
  }
  assignAutoNectarizeJob(slotId, automator) {
    const worker = this.assignedWorkers[slotId];
    if (!worker) return;
    worker.job = {
      type: 'auto_nectarize',
      id: automator.id
    };
    worker.assignedJob = {
      type: 'auto_nectarize',
      id: automator.id,
      name: automator.name,
      description: automator.description,
      color: automator.color
    };
    worker.jobProgress = 0;
    worker.lastActionTime = Date.now();
    this.saveData();
    this.updateJobModalIfOpen();
  }
  executeAutoNectarizeAction(worker) {
    worker.lastActionTime = Date.now();
    try {
      if (typeof window.getCurrentNectarGain === 'function') {
        const currentNectarGain = window.getCurrentNectarGain();
        if (currentNectarGain && currentNectarGain.gt && currentNectarGain.gt(0)) {
          let nectarAmount = currentNectarGain.mul(0.05).floor();
          
          // Apply total infinity boost
          if (typeof window.applyTotalInfinityReachedBoost === 'function') {
            nectarAmount = window.applyTotalInfinityReachedBoost(nectarAmount);
          }
          
          if (typeof window.terrariumNectar !== 'undefined') {
            window.terrariumNectar = (window.terrariumNectar || new Decimal(0)).add(nectarAmount);
          }
          if (typeof window.updateNectarizeDisplays === 'function') {
            window.updateNectarizeDisplays();
          }
          this.makeWorkerSpeak(worker, `Delivered for ${nectarAmount.toStringShort()} nectar!`, 2000);
        } else {
          this.makeWorkerSpeak(worker, `No nectar available to deliver.`, 2000);
        }
      } else {
        this.makeWorkerSpeak(worker, `Nectarize system not available.`, 2000);
      }
    } catch (error) {
      this.makeWorkerSpeak(worker, `Error during auto nectarize.`, 2000);
    }
    this.saveData();
  }
  getAutoNectarizeProgress(worker) {
    if (!worker || !worker.assignedJob || worker.assignedJob.type !== 'auto_nectarize') {
      return 0;
    }
    const now = Date.now();
    const lastAction = worker.lastActionTime || now;
    const interval = this.getAutoNectarizeInterval(worker.stars);
    const elapsed = now - lastAction;
    return Math.min((elapsed / interval) * 100, 100);
  }
  getAutoNectarizeProgressText(worker) {
    if (!worker || !worker.assignedJob || worker.assignedJob.type !== 'auto_nectarize') {
      return 'Not assigned';
    }
    const progress = this.getAutoNectarizeProgress(worker);
    if (progress >= 100) {
      return 'Ready to nectarize!';
    }
    return `Processing nectar... ${Math.floor(progress)}%`;
  }
  openJobModal(slotId) {
    const worker = this.assignedWorkers[slotId];
    if (!worker) return;
    this.currentJobModalSlot = slotId;
    const modal = document.getElementById('jobAssignmentModal');
    const jobOptions = document.getElementById('jobOptions');
    jobOptions.innerHTML = '';
    this.checkAutobuyerUnlocks();
    const visibleAutobuyers = this.autobuyerJobs.filter(autobuyer => {
      const progress = this.getAutobuyerProgress(autobuyer.id);
      const soapLevel = window.friendship && window.friendship.Generator ? window.friendship.Generator.level : 0;
      const hasSoapLevel10 = soapLevel >= 10;
      if (hasSoapLevel10) {
        if (autobuyer.id.includes('_box_autobuyer') && autobuyer.id !== 'box_generator_mk2') {
          return false;
        }
        if (autobuyer.id === 'box_generator_mk2') {
          return true;
        }
      } else {
        if (autobuyer.id === 'box_generator_mk2') {
          return false;
        }
        if (autobuyer.id.includes('_box_autobuyer')) {
          return progress.current > 0;
        }
      }
      return progress.current > 0;
    });
    visibleAutobuyers.forEach(autobuyer => {
      const jobElement = document.createElement('div');
      const isJobTaken = this.isAutobuyerJobTaken(autobuyer.id, slotId);
      const isCurrentWorkerJob = worker.job === autobuyer.id;
      let elementClass = 'job-option';
      if (!autobuyer.isUnlocked) {
        elementClass += ' locked';
      } else if (isCurrentWorkerJob) {
        elementClass += ' current';
      } else if (isJobTaken) {
        elementClass += ' taken';
      }
      jobElement.className = elementClass;
      if (isCurrentWorkerJob) {
        const intervalMs = this.getAutobuyerInterval(worker, autobuyer);
        const intervalSeconds = intervalMs / 1000;
        if (autobuyer.id === 'box_generator_mk2') {
          jobElement.style.cssText = `
            background: linear-gradient(135deg, #1976D2, #0D47A1) !important;
            border: 3px solid #0277BD !important;
            color: white !important;
            transition: none;
            box-shadow: 0 0 15px rgba(25, 118, 210, 0.7) !important;
          `;
          jobElement.innerHTML = `
            <h4 style="color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"> ${autobuyer.name} </h4>
            <p style="color: #E3F2FD; font-weight: 500;">${autobuyer.description}</p>
            <p style="color: white;"><strong>Interval:</strong> ${intervalSeconds < 1 ? intervalMs + 'ms' : intervalSeconds.toFixed(1) + 's'} (${worker.stars} stars)</p>
            <p style="color: white;"><strong>Status:</strong> <span style="color: #BBDEFB; font-weight: bold;">Currently Active - Mk.2!</span></p>
          `;
        } else {
          jobElement.style.cssText = `
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border: 2px solid #2E7D32;
            color: white;
            transition: none;
          `;
          jobElement.innerHTML = `
            <h4 style="color: white;">${autobuyer.name}</h4>
            <p style="color: #E8F5E8;">${autobuyer.description}</p>
            <p style="color: white;"><strong>Interval:</strong> ${intervalSeconds < 1 ? intervalMs + 'ms' : intervalSeconds.toFixed(1) + 's'} (${worker.stars} stars)</p>
            <p style="color: white;"><strong>Status:</strong> <span style="color: #C8E6C9; font-weight: bold;">Currently Assigned</span></p>
          `;
        }
      } else if (autobuyer.isUnlocked && !isJobTaken) {
        jobElement.style.transition = 'none';
        const intervalMs = this.getAutobuyerInterval(worker, autobuyer);
        const intervalSeconds = intervalMs / 1000;
        if (autobuyer.id === 'box_generator_mk2') {
          jobElement.style.cssText = `
            background: linear-gradient(135deg, #1976D2, #1565C0) !important;
            border: 3px solid #0D47A1 !important;
            color: white !important;
            transition: none;
            box-shadow: 0 0 10px rgba(25, 118, 210, 0.5) !important;
          `;
          jobElement.innerHTML = `
            <h4 style="color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"> ${autobuyer.name} </h4>
            <p style="color: #E3F2FD; font-weight: 500;">${autobuyer.description}</p>
            <p style="color: white;"><strong>Interval:</strong> ${intervalSeconds < 1 ? intervalMs + 'ms' : intervalSeconds.toFixed(1) + 's'} (${worker.stars} stars)</p>
            <p style="color: white;"><strong>Status:</strong> <span style="color: #BBDEFB; font-weight: bold;">Available - Mk.2 Upgrade!</span></p>
          `;
        } else {
          jobElement.innerHTML = `
            <h4>${autobuyer.name}</h4>
            <p>${autobuyer.description}</p>
            <p><strong>Interval:</strong> ${intervalSeconds < 1 ? intervalMs + 'ms' : intervalSeconds.toFixed(1) + 's'} (${worker.stars} stars)</p>
            <p><strong>Status:</strong> <span style="color: #32CD32;">Available</span></p>
          `;
        }
        // Prevent duplicate event listeners by checking for marker attribute
        if (!jobElement.dataset.frontDeskListenersAttached) {
          jobElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (jobElement.dataset.clicking === 'true') return;
            jobElement.dataset.clicking = 'true';
            this.assignJob(slotId, autobuyer.id);
            setTimeout(() => {
              jobElement.dataset.clicking = 'false';
            }, 100);
          }, { once: false });
          jobElement.dataset.frontDeskListenersAttached = 'true';
        }
      } else if (autobuyer.isUnlocked && isJobTaken) {
        jobElement.innerHTML = `
          <h4>${autobuyer.name}</h4>
          <p>${autobuyer.description}</p>
          <p><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
          <p style="font-size: 0.9em; color: #666;">Another worker is already doing this job</p>
        `;
      } else {
        const progress = this.getAutobuyerProgress(autobuyer.id);
        const boxTypeName = autobuyer.boxType.charAt(0).toUpperCase() + autobuyer.boxType.slice(1);
        const requirementWithProgress = `Open ${progress.current}/${progress.required} ${autobuyer.boxType} boxes manually`;
        jobElement.innerHTML = `
          <h4 style="color: #000; font-weight: bold; margin-bottom: 8px;">${autobuyer.name} </h4>
          <p style="color: #333; margin: 8px 0; font-weight: 500;">${autobuyer.description}</p>
          <p style="color: #000; font-weight: bold; margin: 8px 0 4px 0;">Unlock Requirement:</p>
          <p style="color: #222; margin: 4px 0; font-weight: 600;">${requirementWithProgress}</p>
          <div style="background: #333; border-radius: 4px; height: 8px; margin: 8px 0; border: 1px solid #000;">
            <div style="background: linear-gradient(90deg, #2e7d32, #1b5e20); height: 100%; border-radius: 3px; width: ${Math.min(100, (progress.current / progress.required) * 100)}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    const visibleDeliveryAutomators = this.deliveryAutomatorJobs.filter(automator => {
      return this.deliveryProgress.deliveryClicks >= automator.showRequirement.required;
    });
    visibleDeliveryAutomators.forEach(automator => {
      const jobElement = document.createElement('div');
      const isJobTaken = this.isDeliveryAutomatorJobTaken(automator.id, slotId);
      const worker = this.assignedWorkers[slotId];
      const isCurrentWorkerJob = worker && worker.assignedJob && worker.assignedJob.id === automator.id;
      let elementClass = 'job-option delivery-automator';
      if (!automator.isUnlocked) {
        elementClass += ' locked';
      } else if (isCurrentWorkerJob) {
        elementClass += ' current-job';
      } else if (isJobTaken) {
        elementClass += ' taken';
      }
      jobElement.className = elementClass;
      if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #9C27B0, #7B1FA2);
          border: 2px solid #9C27B0;
          color: white;
          box-shadow: 0 0 10px rgba(156, 39, 176, 0.3);
        `;
      } else {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #BA68C8, #9C27B0);
          border: 2px solid #8E24AA;
          color: white;
        `;
      }
      if (automator.isUnlocked && isCurrentWorkerJob) {
        const intervalMs = this.getDeliveryAutomatorInterval(worker, automator);
        const intervalSeconds = intervalMs / 1000;
        jobElement.innerHTML = `
          <h4 style="color: white;">${automator.name}</h4>
          <p style="color: #E8F5E8;">${automator.description}</p>
          <p style="color: white;"><strong>Interval:</strong> ${intervalSeconds < 1 ? intervalMs + 'ms' : intervalSeconds.toFixed(1) + 's'} (${worker.stars} stars)</p>
          <p style="color: white;"><strong>Status:</strong> <span style="color: #E1BEE7;">Currently Assigned</span></p>
          <p style="font-size: 0.9em; color: #F3E5F5;">This worker is currently doing this job</p>
        `;
      } else if (automator.isUnlocked && !isJobTaken) {
        const intervalMs = this.getDeliveryAutomatorInterval(worker, automator);
        const intervalSeconds = intervalMs / 1000;
        jobElement.innerHTML = `
          <h4 style="color: white;">${automator.name}</h4>
          <p style="color: #E8F5E8;">${automator.description}</p>
          <p style="color: white;"><strong>Interval:</strong> ${intervalSeconds < 1 ? intervalMs + 'ms' : intervalSeconds.toFixed(1) + 's'} (${worker.stars} stars)</p>
          <p style="color: white;"><strong>Status:</strong> <span style="color: #E1BEE7;">Available</span></p>
        `;
        jobElement.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (jobElement.dataset.clicking === 'true') return;
          jobElement.dataset.clicking = 'true';
          this.assignDeliveryAutomatorJob(slotId, automator.id);
          setTimeout(() => {
            jobElement.dataset.clicking = 'false';
          }, 100);
        }, { once: false });
      } else if (automator.isUnlocked && isJobTaken) {
        jobElement.innerHTML = `
          <h4>${automator.name}</h4>
          <p>${automator.description}</p>
          <p><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
          <p style="font-size: 0.9em; color: #ccc;">Another worker is already doing this job</p>
        `;
      } else {
        const clicks = this.deliveryProgress.deliveryClicks;
        const required = automator.unlockRequirement.required;
        const progress = Math.min(100, (clicks / required) * 100);
        jobElement.innerHTML = `
          <h4>${automator.name}</h4>
          <p style="color: #ddd; margin: 8px 0;">${automator.description}</p>
          <p style="color: #fff; font-weight: bold;">Unlock Requirement:</p>
          <p style="color: #ccc; margin: 4px 0;">Click delivery button ${clicks}/${required} times</p>
          <div style="background: #333; border-radius: 4px; height: 6px; margin: 6px 0;">
            <div style="background: linear-gradient(90deg, #9C27B0, #7B1FA2); height: 100%; border-radius: 4px; width: ${progress}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    let isBoxGeneratorMk2Unlocked = false;
    if (window.friendship && window.friendship.Generator) {
      isBoxGeneratorMk2Unlocked = window.friendship.Generator.level >= 10;
    } else if (typeof friendship !== 'undefined' && friendship.Generator) {
      isBoxGeneratorMk2Unlocked = friendship.Generator.level >= 10;
    }
    const visibleGeneratorAutomators = isBoxGeneratorMk2Unlocked ? [] : this.generatorAutomatorJobs.filter(automator => {
      const progress = this.getGeneratorAutomatorProgress(automator.id);
      return progress.showCurrent >= automator.showRequirement.required;
    });
    visibleGeneratorAutomators.forEach(automator => {
      const jobElement = document.createElement('div');
      const isJobTaken = this.isGeneratorAutomatorJobTaken(automator.id, slotId);
      const worker = this.assignedWorkers[slotId];
      const isCurrentWorkerJob = worker && worker.assignedJob && worker.assignedJob.id === automator.id;
      let elementClass = 'job-option generator-automator';
      if (!automator.isUnlocked) {
        elementClass += ' locked';
      } else if (isCurrentWorkerJob) {
        elementClass += ' current-job';
      } else if (isJobTaken) {
        elementClass += ' taken';
      }
      jobElement.className = elementClass;
      if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #32CD32, #228B22);
          border: 2px solid #32CD32;
          color: white;
          box-shadow: 0 0 10px rgba(50, 205, 50, 0.3);
        `;
      } else {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #888888, #666666);
          border: 2px solid #555;
          color: white;
        `;
      }
      if (automator.isUnlocked && isCurrentWorkerJob) {
        jobElement.innerHTML = `
          <h4 style="color: white;">${automator.name}</h4>
          <p style="color: white;">${automator.description}</p>
          <p><strong>Status:</strong> <span style="color: #90EE90;">Currently Assigned</span></p>
          <p style="font-size: 0.9em; color: #e6ffe6;">This worker is currently doing this job</p>
        `;
      } else if (automator.isUnlocked && !isJobTaken) {
        jobElement.innerHTML = `
          <h4 style="color: white;">${automator.name}</h4>
          <p style="color: white;">${automator.description}</p>
          <p><strong>Status:</strong> <span style="color: #32CD32;">Available</span></p>
        `;
        jobElement.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (jobElement.dataset.clicking === 'true') return;
          jobElement.dataset.clicking = 'true';
          this.assignGeneratorAutomatorJob(slotId, automator.id);
          setTimeout(() => {
            jobElement.dataset.clicking = 'false';
          }, 100);
        }, { once: false });
      } else if (automator.isUnlocked && isJobTaken) {
        jobElement.innerHTML = `
          <h4 style="color: white;">${automator.name}</h4>
          <p style="color: white;">${automator.description}</p>
          <p><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
          <p style="font-size: 0.9em; color: #ccc;">Another worker is already doing this job</p>
        `;
      } else {
        const progress = this.getGeneratorAutomatorProgress(automator.id);
        const generatorTypeName = automator.generatorType.charAt(0).toUpperCase() + automator.generatorType.slice(1);
        const requirementWithProgress = `${generatorTypeName} generator must produce ${progress.current.toLocaleString()}/${progress.required.toLocaleString()} boxes`;
        jobElement.innerHTML = `
          <h4>${automator.name} </h4>
          <p style="color: #ddd; margin: 8px 0;">${automator.description}</p>
          <p style="color: #fff; font-weight: bold;">Unlock Requirement:</p>
          <p style="color: #ccc; margin: 4px 0;">${requirementWithProgress}</p>
          <div style="background: #333; border-radius: 4px; height: 6px; margin: 6px 0;">
            <div style="background: linear-gradient(90deg, #4a9eff, #00d4ff); height: 100%; border-radius: 4px; width: ${progress.percentage}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    const visiblePrismTileAutomators = this.prismTileAutomatorJobs.filter(automator => {
      return this.prismTileProgress.prismTileClicks >= automator.showRequirement.required;
    });
    visiblePrismTileAutomators.forEach(automator => {
      const jobElement = document.createElement('div');
      const isJobTaken = this.isPrismTileAutomatorJobTaken(automator.id, slotId);
      const worker = this.assignedWorkers[slotId];
      const isCurrentWorkerJob = worker && (
        (worker.job && typeof worker.job === 'object' &&
         worker.job.type === 'prism_automator' && worker.job.id === automator.id) ||
        (worker.assignedJob && typeof worker.assignedJob === 'object' &&
         worker.assignedJob.type === 'prism_automator' && worker.assignedJob.id === automator.id)
      );
      let elementClass = 'job-option prism-automator';
      if (!automator.isUnlocked) {
        elementClass += ' locked';
      } else if (isCurrentWorkerJob) {
        elementClass += ' current-job';
      } else if (isJobTaken) {
        elementClass += ' taken';
      }
      jobElement.className = elementClass;
      if (automator.isUnlocked && !isJobTaken) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #FFFFFF, #F8F8FF, #F0F8FF);
          border: 2px solid #E0E0E0;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: pointer;
          transition: none;
          box-shadow: 0 4px 8px rgba(255, 255, 255, 0.3), 0 0 15px rgba(200, 255, 255, 0.2);
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getPrismTileAutomatorInterval({ stars }, automator);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4>${automator.name}</h4>
          <p style="margin: 8px 0; color: #555;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Status:</strong> Available when prism tiles are active</p>
        `;
        // Prevent duplicate event listeners by checking for marker attribute
        if (!jobElement.dataset.frontDeskPrismListenersAttached) {
          jobElement.addEventListener('mouseenter', () => {
            jobElement.style.transform = 'translateY(-2px)';
            jobElement.style.boxShadow = '0 6px 12px rgba(255, 255, 255, 0.4), 0 0 20px rgba(200, 255, 255, 0.3)';
          });
          jobElement.addEventListener('mouseleave', () => {
            jobElement.style.transform = 'translateY(0)';
            jobElement.style.boxShadow = '0 4px 8px rgba(255, 255, 255, 0.3), 0 0 15px rgba(200, 255, 255, 0.2)';
          });
          jobElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (jobElement.dataset.clicking === 'true') return;
            jobElement.dataset.clicking = 'true';
            this.assignPrismTileAutomatorJob(slotId, automator.id);
            setTimeout(() => {
              jobElement.dataset.clicking = 'false';
            }, 100);
          }, { once: false });
          jobElement.dataset.frontDeskPrismListenersAttached = 'true';
        }
      } else if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #FFFFFF, #FAFAFA, #F5F5F5);
          border: 2px solid #DDDDDD;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(255, 255, 255, 0.8), 0 0 25px rgba(200, 255, 255, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.9);
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getPrismTileAutomatorInterval({ stars }, automator);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4>${automator.name} ?</h4>
          <p style="margin: 8px 0; color: #555;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #333; font-weight: bold;"><strong>Status:</strong> Currently Assigned</p>
        `;
      } else if (isJobTaken) {
        jobElement.style.cssText = `
          background: #333;
          border: 2px solid #666;
          color: #aaa;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4>${automator.name}</h4>
          <p>${automator.description}</p>
          <p><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
          <p style="font-size: 0.9em; color: #ccc;">Another worker is already doing this job</p>
        `;
      } else {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #FFFFFF, #F8F8FF, #F0F8FF);
          border: 2px solid #E0E0E0;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          opacity: 0.8;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        const clicks = this.prismTileProgress.prismTileClicks;
        const required = automator.unlockRequirement.required;
        const progress = Math.min(100, (clicks / required) * 100);
        jobElement.innerHTML = `
          <h4 style="color: #666;">${automator.name}</h4>
          <p style="color: #333; margin: 8px 0; font-weight: 500;">${automator.description}</p>
          <p style="color: #000; font-weight: bold;">Unlock Requirement:</p>
          <p style="color: #444; margin: 4px 0; font-weight: 500;">Click prism tiles ${clicks}/${required} times</p>
          <div style="background: #DDD; border-radius: 4px; height: 8px; margin: 6px 0; border: 1px solid #CCC;">
            <div style="background: linear-gradient(90deg, #888, #666); height: 100%; border-radius: 3px; width: ${progress}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    const visibleLightGeneratorAutomators = this.lightGeneratorAutomatorJobs.filter(automator => {
      const hasBeenShown = this.lightGeneratorAutomatorShown[automator.id];
      const currentLevel = this.getLightGeneratorLevel(automator.generatorType);
      const meetsCurrentRequirement = currentLevel >= automator.showRequirement.required;
      return hasBeenShown || meetsCurrentRequirement;
    });
    visibleLightGeneratorAutomators.forEach(automator => {
      const jobElement = document.createElement('div');
      const isJobTaken = this.isLightGeneratorAutomatorJobTaken(automator.id, slotId);
      const worker = this.assignedWorkers[slotId];
      const isCurrentWorkerJob = worker && (
        (worker.job && typeof worker.job === 'object' &&
         worker.job.type === 'light_generator_automator' && worker.job.id === automator.id) ||
        (typeof worker.job === 'string' && worker.job === automator.id)
      );
      if (automator.isUnlocked && !isJobTaken) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}DD);
          border: 2px solid ${automator.color}BB;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${automator.color}66;
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getLightGeneratorAutomatorInterval({ stars }, automator);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; color: #333; font-weight: 500; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #555;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Status:</strong> Available</p>
        `;
        // Prevent duplicate event listeners by checking for marker attribute
        if (!jobElement.dataset.frontDeskLightListenersAttached) {
          jobElement.addEventListener('mouseenter', () => {
            jobElement.style.transform = 'translateY(-2px)';
            jobElement.style.boxShadow = `0 6px 12px rgba(0, 0, 0, 0.15), 0 0 20px ${automator.color}88`;
          });
          jobElement.addEventListener('mouseleave', () => {
            jobElement.style.transform = 'translateY(0)';
            jobElement.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${automator.color}66`;
          });
          jobElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (jobElement.dataset.clicking === 'true') return;
            jobElement.dataset.clicking = 'true';
            this.assignLightGeneratorAutomatorJob(slotId, automator.id);
            setTimeout(() => {
              jobElement.dataset.clicking = 'false';
            }, 100);
          }, { once: false });
          jobElement.dataset.frontDeskLightListenersAttached = 'true';
        }
      } else if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}CC);
          border: 3px solid ${automator.color}88;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 0 25px ${automator.color}88, inset 0 2px 4px rgba(255, 255, 255, 0.3);
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getLightGeneratorAutomatorInterval({ stars }, automator);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name} ?</h4>
          <p style="margin: 4px 0; color: #333; font-weight: 500; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #555;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #333; font-weight: bold;"><strong>Status:</strong> Currently Assigned</p>
          <button onclick="event.stopPropagation(); window.frontDesk.unassignJob('${slotId}'); window.frontDesk.hideJobModal();"
                  style="background: #ffcccb; color: #d32f2f; border: 1px solid #d32f2f; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8em;">
            Unassign Job
          </button>
        `;
      } else if (isJobTaken) {
        jobElement.style.cssText = `
          background: #333;
          border: 2px solid #666;
          color: #aaa;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em;"><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
        `;
      } else {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}BB);
          border: 2px solid ${automator.color}99;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          opacity: 0.8;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        const progress = this.getLightGeneratorAutomatorProgress(automator.id);
        jobElement.innerHTML = `
          <h4 style="color: #666; margin: 4px 0; font-size: 1em;">${automator.name}</h4>
          <p style="color: #333; margin: 4px 0; font-size: 0.9em;">${automator.description}</p>
          <p style="color: #555; margin: 4px 0; font-size: 0.8em; font-weight: 600;">Requires ${progress.current}/${progress.required} particles</p>
          <div style="background: #DDD; border-radius: 3px; height: 6px; margin: 4px 0; border: 1px solid #CCC;">
            <div style="background: linear-gradient(90deg, ${automator.color}CC, ${automator.color}88); height: 100%; border-radius: 2px; width: ${progress.percentage}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    const visibleTokenFinderAutomators = this.tokenFinderAutomatorJobs.filter(automator => {
      const tokensCollected = this.tokenFinderAutomatorProgress.tokensCollected || 0;
      return tokensCollected >= automator.showRequirement.required;
    });
    visibleTokenFinderAutomators.forEach(automator => {
      const jobElement = document.createElement('div');
      const isJobTaken = this.isTokenFinderAutomatorJobTaken(automator.id, slotId);
      const worker = this.assignedWorkers[slotId];
      const isCurrentWorkerJob = worker && (
        (worker.job && typeof worker.job === 'object' &&
         worker.job.type === 'token_finder_automator' && worker.job.id === automator.id) ||
        (typeof worker.job === 'string' && worker.job === automator.id)
      );
      if (automator.isUnlocked && !isJobTaken) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}DD);
          border: 2px solid ${automator.color}BB;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${automator.color}66;
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getTokenFinderAutomatorInterval({ stars }, automator);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; color: #333; font-weight: 500; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #555;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Status:</strong> Available</p>
        `;
        // Prevent duplicate event listeners by checking for marker attribute
        if (!jobElement.dataset.frontDeskTokenListenersAttached) {
          jobElement.addEventListener('mouseenter', () => {
            jobElement.style.transform = 'translateY(-2px)';
            jobElement.style.boxShadow = `0 6px 12px rgba(0, 0, 0, 0.15), 0 0 20px ${automator.color}88`;
          });
          jobElement.addEventListener('mouseleave', () => {
            jobElement.style.transform = 'translateY(0)';
            jobElement.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${automator.color}66`;
          });
          jobElement.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (jobElement.dataset.clicking === 'true') return;
            jobElement.dataset.clicking = 'true';
            this.assignTokenFinderAutomatorJob(slotId, automator.id);
            setTimeout(() => {
              jobElement.dataset.clicking = 'false';
            }, 100);
          }, { once: false });
          jobElement.dataset.frontDeskTokenListenersAttached = 'true';
        }
      } else if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}CC);
          border: 3px solid ${automator.color}88;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 0 25px ${automator.color}88, inset 0 2px 4px rgba(255, 255, 255, 0.3);
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getTokenFinderAutomatorInterval({ stars }, automator);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name} ?</h4>
          <p style="margin: 4px 0; color: #333; font-weight: 500; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #555;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #333; font-weight: bold;"><strong>Status:</strong> Currently Assigned</p>
          <button onclick="event.stopPropagation(); window.frontDesk.unassignJob('${slotId}'); window.frontDesk.hideJobModal();"
                  style="background: #ffcccb; color: #d32f2f; border: 1px solid #d32f2f; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8em;">
            Unassign Job
          </button>
        `;
      } else if (isJobTaken) {
        jobElement.style.cssText = `
          background: #333;
          border: 2px solid #666;
          color: #aaa;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em;"><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
        `;
      } else {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}BB);
          border: 2px solid ${automator.color}99;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          opacity: 0.8;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;
        const progress = this.getTokenFinderAutomatorProgress(automator.id);
        jobElement.innerHTML = `
          <h4 style="color: #666; margin: 4px 0; font-size: 1em;">${automator.name}</h4>
          <p style="color: #333; margin: 4px 0; font-size: 0.9em;">${automator.description}</p>
          <p style="color: #555; margin: 4px 0; font-size: 0.8em; font-weight: 600;">Requires ${progress.current}/${progress.required} tokens collected</p>
          <div style="background: #DDD; border-radius: 3px; height: 6px; margin: 4px 0; border: 1px solid #CCC;">
            <div style="background: linear-gradient(90deg, ${automator.color}CC, ${automator.color}88); height: 100%; border-radius: 2px; width: ${progress.percentage}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    const upgradeAutomators = [
      {
        id: 'auto_pollen_upgrader',
        name: 'Auto Pollen Upgrader',
        description: 'Automatically purchases max pollen upgrades when progress reaches 100%',
        color: '#87CEEB',
        type: 'upgrade_automator',
        upgradeType: 'pollen'
      },
      {
        id: 'auto_flower_upgrader',
        name: 'Auto Flower Upgrader',
        description: 'Automatically purchases max flower upgrades when progress reaches 100%',
        color: '#FFB6C1',
        type: 'upgrade_automator',
        upgradeType: 'flower'
      },
      {
        id: 'auto_nectar_upgrader',
        name: 'Auto Nectar Upgrader',
        description: 'Automatically purchases max nectar upgrades when progress reaches 100%',
        color: '#FFCCCB',
        type: 'upgrade_automator',
        upgradeType: 'nectar'
      }
    ];
    upgradeAutomators.forEach(automator => {
      const jobElement = document.createElement('div');
      const hasAnyUpgrade = automator.upgradeType === 'pollen' ? this.hasAnyPollenUpgrade() :
                           automator.upgradeType === 'flower' ? this.hasAnyFlowerUpgrade() :
                           this.hasAnyNectarUpgrade();
      const totalUpgrades = automator.upgradeType === 'pollen' ? this.totalPollenUpgradesBought :
                           automator.upgradeType === 'flower' ? this.totalFlowerUpgradesBought :
                           this.totalNectarUpgradesBought;
      const isUnlocked = totalUpgrades >= 1500;
      const shouldShow = hasAnyUpgrade;
      if (!shouldShow) return;
      const isCurrentWorkerJob = worker && worker.assignedJob &&
                                 worker.assignedJob.type === 'upgrade_automator' &&
                                 worker.assignedJob.upgradeType === automator.upgradeType;
      const isJobTaken = Object.values(this.assignedWorkers).some(w =>
        w && w.assignedJob &&
        w.assignedJob.type === 'upgrade_automator' &&
        w.assignedJob.upgradeType === automator.upgradeType &&
        w !== worker
      );
      if (isUnlocked && !isJobTaken && !isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}CC);
          border: 2px solid ${automator.color}88;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getUpgradeAutomatorInterval(stars);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; color: #333; font-weight: 500; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #555;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Status:</strong> Available</p>
        `;
        jobElement.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (jobElement.dataset.clicking === 'true') return;
          jobElement.dataset.clicking = 'true';
          this.assignUpgradeAutomatorJob(slotId, automator);
          setTimeout(() => {
            jobElement.dataset.clicking = 'false';
          }, 100);
        }, { once: false });
      } else if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}, ${automator.color}CC);
          border: 3px solid ${automator.color}88;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 0 25px ${automator.color}88, inset 0 2px 4px rgba(255, 255, 255, 0.3);
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getUpgradeAutomatorInterval(stars);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; color: #333; font-weight: 500; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #555;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #333; font-weight: bold;"><strong>Status:</strong> Currently Assigned</p>
        `;
      } else if (isJobTaken) {
        jobElement.style.cssText = `
          background: #333;
          border: 2px solid #666;
          color: #aaa;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${automator.name}</h4>
          <p style="margin: 4px 0; font-size: 0.9em;">${automator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em;"><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
        `;
      } else {
        const progressPercentage = Math.min((totalUpgrades / 1500) * 100, 100);
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${automator.color}44, ${automator.color}22);
          border: 2px solid ${automator.color}66;
          color: #666;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4 style="color: #666; margin: 4px 0; font-size: 1em;">${automator.name}</h4>
          <p style="color: #333; margin: 4px 0; font-size: 0.9em;">${automator.description}</p>
          <p style="color: #555; margin: 4px 0; font-size: 0.8em; font-weight: 600;">Requires ${totalUpgrades}/1500 total ${automator.upgradeType} upgrades bought</p>
          <div style="background: #DDD; border-radius: 3px; height: 6px; margin: 4px 0; border: 1px solid #CCC;">
            <div style="background: linear-gradient(90deg, ${automator.color}CC, ${automator.color}88); height: 100%; border-radius: 2px; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    });
    const nectarizeResets = window.nectarizeResets || 0;
    const hasAtLeastOneReset = nectarizeResets >= 1;
    const isNectarizeUnlocked = nectarizeResets >= 150;
    if (hasAtLeastOneReset) {
      const nectarizeAutomator = {
        id: 'auto_nectarize',
        name: 'Auto Nectarize',
        description: 'Automatically use the nectarize machine for 5% of pending nectar without causing a reset',
        color: '#FFA500',
        type: 'auto_nectarize'
      };
      const jobElement = document.createElement('div');
      const isCurrentWorkerJob = worker && worker.assignedJob &&
                                 worker.assignedJob.type === 'auto_nectarize';
      const isJobTaken = Object.values(this.assignedWorkers).some(w =>
        w && w.assignedJob &&
        w.assignedJob.type === 'auto_nectarize' &&
        w !== worker
      );
      if (isNectarizeUnlocked && !isJobTaken && !isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${nectarizeAutomator.color}, ${nectarizeAutomator.color}DD);
          border: 2px solid ${nectarizeAutomator.color}BB;
          color: #333;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${nectarizeAutomator.color}66;
        `;
        const stars = worker ? worker.stars : 1;
        const interval = this.getAutoNectarizeInterval(stars);
        const intervalDisplay = interval >= 1000 ? `${interval/1000}s` : `${interval}ms`;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${nectarizeAutomator.name}</h4>
          <p style="margin: 4px 0; font-size: 0.9em;">${nectarizeAutomator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em;"><strong>Interval:</strong> ${intervalDisplay} (${stars} stars)</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #666;"><strong>Status:</strong> Available</p>
        `;
        jobElement.addEventListener('mouseenter', () => {
          jobElement.style.transform = 'translateY(-2px)';
          jobElement.style.boxShadow = `0 6px 12px rgba(0, 0, 0, 0.15), 0 0 20px ${nectarizeAutomator.color}88`;
        });
        jobElement.addEventListener('mouseleave', () => {
          jobElement.style.transform = 'translateY(0)';
          jobElement.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${nectarizeAutomator.color}66`;
        });
        jobElement.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (jobElement.dataset.clicking === 'true') return;
          jobElement.dataset.clicking = 'true';
          this.assignAutoNectarizeJob(slotId, nectarizeAutomator);
          this.closeJobModal();
          setTimeout(() => {
            jobElement.dataset.clicking = 'false';
          }, 100);
        });
      } else if (isCurrentWorkerJob) {
        jobElement.style.cssText = `
          background: linear-gradient(135deg, #28a745, #34ce57);
          border: 2px solid #28a745;
          color: white;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
        `;
        const progress = this.getAutoNectarizeProgress(worker);
        const progressText = this.getAutoNectarizeProgressText(worker);
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${nectarizeAutomator.name} ?</h4>
          <p style="margin: 4px 0; font-size: 0.9em;">${nectarizeAutomator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em; color: #333; font-weight: bold;"><strong>Status:</strong> Currently Assigned</p>
        `;
        jobElement.addEventListener('click', () => {
          this.unassignWorker(slotId);
          this.closeJobModal();
        });
      } else if (isJobTaken) {
        jobElement.style.cssText = `
          background: #333;
          border: 2px solid #666;
          color: #aaa;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4 style="margin: 4px 0;">${nectarizeAutomator.name}</h4>
          <p style="margin: 4px 0; font-size: 0.9em;">${nectarizeAutomator.description}</p>
          <p style="margin: 4px 0; font-size: 0.9em;"><strong>Status:</strong> <span style="color: #FFA500;">Already Assigned</span></p>
        `;
      } else {
        const progressPercentage = Math.min((nectarizeResets / 150) * 100, 100);
        jobElement.style.cssText = `
          background: linear-gradient(135deg, ${nectarizeAutomator.color}44, ${nectarizeAutomator.color}22);
          border: 2px solid ${nectarizeAutomator.color}66;
          color: #666;
          padding: 15px;
          margin: 8px 0;
          border-radius: 8px;
          cursor: not-allowed;
        `;
        jobElement.innerHTML = `
          <h4 style="color: #666; margin: 4px 0; font-size: 1em;">${nectarizeAutomator.name}</h4>
          <p style="color: #333; margin: 4px 0; font-size: 0.9em;">${nectarizeAutomator.description}</p>
          <p style="color: #555; margin: 4px 0; font-size: 0.8em; font-weight: 600;">Requires ${nectarizeResets}/150 nectarize resets</p>
          <div style="background: #DDD; border-radius: 3px; height: 6px; margin: 4px 0; border: 1px solid #CCC;">
            <div style="background: linear-gradient(90deg, ${nectarizeAutomator.color}CC, ${nectarizeAutomator.color}88); height: 100%; border-radius: 2px; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
          </div>
        `;
      }
      jobOptions.appendChild(jobElement);
    }
    modal.style.display = 'flex';
    this.addModalClickOutsideHandler();
  }
  assignJob(slotId, jobId) {
    const worker = this.assignedWorkers[slotId];
    const autobuyer = this.autobuyerJobs.find(ab => ab.id === jobId);
    if (worker && autobuyer && autobuyer.isUnlocked) {
      worker.job = jobId;
      worker.lastActionTime = Date.now();
      worker.assignedJob = null;
      this.makeWorkerSpeak(worker, `Ready to start ${autobuyer.name}!`, 3000);
      this.renderWorkerSlots();
      this.saveData();
    }
    this.closeJobModal();
  }
  assignGeneratorAutomatorJob(slotId, automatorId) {
    const worker = this.assignedWorkers[slotId];
    const automator = this.generatorAutomatorJobs.find(ga => ga.id === automatorId);
    if (worker && automator && automator.isUnlocked) {
      worker.job = {
        type: 'generator_automator',
        id: automatorId
      };
      worker.lastActionTime = Date.now();
      worker.assignedJob = null;
      this.makeWorkerSpeak(worker, `I'll handle the ${automator.name} automation!`, 3000);
      this.renderWorkerSlots();
      this.saveData();
    }
    this.closeJobModal();
  }
  assignPrismTileAutomatorJob(slotId, automatorId) {
    const worker = this.assignedWorkers[slotId];
    const automator = this.prismTileAutomatorJobs.find(pa => pa.id === automatorId);
    if (worker && automator && automator.isUnlocked) {
      worker.job = {
        type: 'prism_automator',
        id: automatorId
      };
      worker.assignedJob = {
        type: 'prism_automator',
        id: automatorId
      };
      worker.lastActionTime = Date.now();
      this.makeWorkerSpeak(worker, `I'll start clicking those prism tiles for you!`, 3000);
      this.renderWorkerSlots();
      this.saveData();
      if (typeof this.updateAutoclickerUI === 'function') {
        this.updateAutoclickerUI();
      }
    }
    this.closeJobModal();
  }
  assignDeliveryAutomatorJob(slotId, automatorId) {
    const worker = this.assignedWorkers[slotId];
    const automator = this.deliveryAutomatorJobs.find(da => da.id === automatorId);
    if (worker && automator && automator.isUnlocked) {
      worker.job = {
        type: 'delivery_automator',
        id: automatorId
      };
      worker.lastActionTime = Date.now();
      worker.assignedJob = {
        id: automatorId,
        type: 'delivery_automator',
        progress: 0,
        startTime: Date.now()
      };
      this.makeWorkerSpeak(worker, `I'll handle the ${automator.name} for you!`, 3000);
      this.renderWorkerSlots();
      this.saveData();
    }
    this.closeJobModal();
  }
  isDeliveryAutomatorJobTaken(automatorId, excludeSlotId = null) {
    for (const [slotId, worker] of Object.entries(this.assignedWorkers)) {
      if (excludeSlotId && slotId == excludeSlotId) continue;
      if (worker && worker.assignedJob && worker.assignedJob.id === automatorId) {
        return true;
      }
    }
    return false;
  }
  isPrismTileAutomatorJobTaken(automatorId, excludeSlotId = null) {
    for (const [slotId, worker] of Object.entries(this.assignedWorkers)) {
      if (excludeSlotId && slotId == excludeSlotId) continue;
      if (worker && worker.assignedJob && worker.assignedJob.id === automatorId) {
        return true;
      }
    }
    return false;
  }
  assignLightGeneratorAutomatorJob(slotId, automatorId) {
    const worker = this.assignedWorkers[slotId];
    const automator = this.lightGeneratorAutomatorJobs.find(lg => lg.id === automatorId);
    if (worker && automator && automator.isUnlocked) {
      worker.job = {
        type: 'light_generator_automator',
        id: automatorId
      };
      worker.assignedJob = {
        type: 'light_generator_automator',
        id: automatorId
      };
      worker.lastActionTime = Date.now();
      this.makeWorkerSpeak(worker, `I'll automate the ${automator.generatorType} generator for you!`, 3000);
      this.renderWorkerSlots();
      this.saveData();
    }
    this.closeJobModal();
  }
  isLightGeneratorAutomatorJobTaken(automatorId, excludeSlotId = null) {
    for (const [slotId, worker] of Object.entries(this.assignedWorkers)) {
      if (excludeSlotId && slotId == excludeSlotId) continue;
      if (worker && worker.assignedJob && worker.assignedJob.type === 'light_generator_automator' && worker.assignedJob.id === automatorId) {
        return true;
      }
    }
    return false;
  }
  assignTokenFinderAutomatorJob(slotId, automatorId) {
    const worker = this.assignedWorkers[slotId];
    const automator = this.tokenFinderAutomatorJobs.find(ta => ta.id === automatorId);
    if (worker && automator && automator.isUnlocked) {
      worker.job = {
        type: 'token_finder_automator',
        id: automatorId
      };
      worker.assignedJob = {
        type: 'token_finder_automator',
        id: automatorId
      };
      worker.lastActionTime = Date.now();
      this.makeWorkerSpeak(worker, `I'll start searching for ingredient tokens!`, 3000);
      this.renderWorkerSlots();
      this.saveData();
    }
    this.closeJobModal();
  }
  isTokenFinderAutomatorJobTaken(automatorId, excludeSlotId = null) {
    for (const [slotId, worker] of Object.entries(this.assignedWorkers)) {
      if (excludeSlotId && slotId == excludeSlotId) continue;
      if (worker && worker.assignedJob && worker.assignedJob.type === 'token_finder_automator' && worker.assignedJob.id === automatorId) {
        return true;
      }
    }
    return false;
  }
  assignUpgradeAutomatorJob(slotId, automator) {
    const worker = this.assignedWorkers[slotId];
    if (!worker) return;
    const totalUpgrades = automator.upgradeType === 'pollen' ? this.totalPollenUpgradesBought :
                         automator.upgradeType === 'flower' ? this.totalFlowerUpgradesBought :
                         this.totalNectarUpgradesBought;
    if (totalUpgrades < 1500) {
      this.makeWorkerSpeak(worker, `I need more experience with ${automator.upgradeType} upgrades first!`, 3000);
      return;
    }
    worker.job = {
      type: 'upgrade_automator',
      upgradeType: automator.upgradeType,
      id: automator.id
    };
    worker.assignedJob = {
      type: 'upgrade_automator',
      upgradeType: automator.upgradeType,
      id: automator.id
    };
    worker.lastActionTime = Date.now();
    const upgradeTypeDisplay = automator.upgradeType.charAt(0).toUpperCase() + automator.upgradeType.slice(1);
    this.makeWorkerSpeak(worker, `I'll automatically buy ${upgradeTypeDisplay} upgrades for you!`, 3000);
    this.renderWorkerSlots();
    this.saveData();
    this.closeJobModal();
  }
  debugAssignPrismJob(slotId = 0) {
    const worker = this.assignedWorkers[slotId];
    if (!worker) {
      return;
    }
    worker.job = {
      type: 'prism_automator',
      id: 'auto_prism_tile_clicker'
    };
    worker.assignedJob = {
      type: 'prism_automator',
      id: 'auto_prism_tile_clicker'
    };
    worker.lastActionTime = Date.now();
    this.renderWorkerSlots();
    this.saveData();
    this.openJobModal(slotId);
  }
  closeJobModal() {
    const modal = document.getElementById('jobAssignmentModal');
    modal.style.display = 'none';
    this.currentJobModalSlot = null;
    this.removeModalClickOutsideHandler();
  }
  hideJobModal() {
    this.closeJobModal();
  }
  addModalClickOutsideHandler() {
    this.modalClickOutsideHandler = (event) => {
      const modal = document.getElementById('jobAssignmentModal');
      const modalContent = modal.querySelector('.modal-content');
      if (modal.style.display === 'flex' && !modalContent.contains(event.target) && modal.contains(event.target)) {
        this.closeJobModal();
      }
    };
    document.addEventListener('click', this.modalClickOutsideHandler);
  }
  removeModalClickOutsideHandler() {
    if (this.modalClickOutsideHandler) {
      document.removeEventListener('click', this.modalClickOutsideHandler);
      this.modalClickOutsideHandler = null;
    }
  }
  openFireModal(slotId) {
    this.currentModalSlot = slotId;
    const worker = this.assignedWorkers[slotId];
    if (!worker) {
      return;
    }
    document.getElementById('fireWorkerName').textContent = worker.name;
    const modal = document.getElementById('fireWorkerModal');
    modal.style.display = 'flex';
  }
  closeFireModal() {
    const modal = document.getElementById('fireWorkerModal');
    modal.style.display = 'none';
    this.currentModalSlot = null;
  }
  confirmFireWorker() {
    if (this.currentModalSlot !== null) {
      this.fireWorker(this.currentModalSlot);
    }
    this.closeFireModal();
  }
  unassignJob(slotId) {
    const worker = this.assignedWorkers[slotId];
    if (worker && (worker.job || worker.assignedJob)) {
      worker.job = null;
      worker.assignedJob = null;
      this.renderWorkerSlots();
      this.saveData();
      if (typeof this.updateAutoclickerUI === 'function') {
        this.updateAutoclickerUI();
      }
    }
  }
  unassignWorkerJob(slotId) {
    this.unassignJob(slotId);
  }
  fireWorker(slotId) {
    if (this.assignedWorkers[slotId]) {
      delete this.assignedWorkers[slotId];
      delete this.workerHunger[slotId];
      this.renderUI();
      this.saveData();
      if (typeof this.updateAutoclickerUI === 'function') {
        this.updateAutoclickerUI();
      }
      if (this.canHireUniqueWorkers() && this.nextArrivalTime === null) {
        this.scheduleNextArrival();
      }
    }
  }
  startRenameWorker(workerId) {
    const worker = this.findWorkerById(workerId);
    if (!worker) return;
    let targetElement = null;
    const allNameElements = document.querySelectorAll('.worker-name, .worker-slot-title');
    for (const element of allNameElements) {
      const onclickAttr = element.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes(`startRenameWorker('${workerId}')`)) {
        targetElement = element;
        break;
      }
    }
    if (!targetElement) {
      const workerCards = document.querySelectorAll(`[data-worker-id="${workerId}"]`);
      for (const card of workerCards) {
        const nameElement = card.querySelector('.worker-name');
        if (nameElement) {
          targetElement = nameElement;
          break;
        }
      }
    }
    if (!targetElement) {
      const slotTitles = document.querySelectorAll('.worker-slot-title');
      for (const title of slotTitles) {
        const onclickAttr = title.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`startRenameWorker('${workerId}')`)) {
          targetElement = title;
          break;
        }
      }
    }
    if (!targetElement) {
      return;
    }
    const originalName = worker.displayName || worker.name;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalName;
    input.className = 'worker-name-input';
    input.maxLength = 20;
    input.placeholder = 'Enter worker name...';
    const originalInnerHTML = targetElement.innerHTML;
    targetElement.innerHTML = '';
    targetElement.appendChild(input);
    setTimeout(() => {
      input.focus();
      input.select();
    }, 10);
    const finishRename = () => {
      let newName = input.value.trim();
      if (!newName) {
        newName = originalName;
      } else if (newName.length > 20) {
        newName = newName.substring(0, 20);
      }
      if (newName && newName !== originalName) {
        worker.displayName = newName;
        worker.name = newName;
        this.saveData();
        if (window.frontDesk) {
          window.frontDesk.showTicoSpeech(`I've updated ${originalName}'s name to ${newName}!`, 2000);
        }
      }
      this.renderUI();
    };
    const cancelRename = () => {
      this.renderUI();
    };
    input.addEventListener('blur', finishRename);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finishRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelRename();
      }
    });
  }
  getJobName(job) {
    if (typeof job === 'object' && job.type) {
      if (job.type === 'generator_automator') {
        const automator = this.generatorAutomatorJobs.find(ga => ga.id === job.id);
        return automator ? automator.name : 'Unknown Generator Automator';
      }
      if (job.type === 'delivery_automator') {
        const automator = this.deliveryAutomatorJobs.find(da => da.id === job.id);
        return automator ? automator.name : 'Unknown Delivery Automator';
      }
      if (job.type === 'prism_automator') {
        const automator = this.prismTileAutomatorJobs.find(pa => pa.id === job.id);
        return automator ? automator.name : 'Unknown Prism Automator';
      }
      if (job.type === 'light_generator_automator') {
        const automator = this.lightGeneratorAutomatorJobs.find(lga => lga.id === job.id);
        return automator ? automator.name : 'Unknown Light Generator Automator';
      }
      if (job.type === 'token_finder_automator') {
        const automator = this.tokenFinderAutomatorJobs.find(tfa => tfa.id === job.id);
        return automator ? automator.name : 'Unknown Token Finder Automator';
      }
      if (job.type === 'upgrade_automator') {
        const upgradeTypeDisplay = job.upgradeType ? job.upgradeType.charAt(0).toUpperCase() + job.upgradeType.slice(1) : 'Unknown';
        return `Auto ${upgradeTypeDisplay} Upgrader`;
      }
      if (job.type === 'auto_nectarize') {
        return 'Auto Nectarize';
      }
      return 'Unknown Job Type';
    }
    const autobuyer = this.autobuyerJobs.find(ab => ab.id === job);
    return autobuyer ? autobuyer.name : 'Unknown Job';
  }
  isAutobuyerJobTaken(autobuyerId, excludeSlotId = null) {
    return Object.entries(this.assignedWorkers).some(([slotId, worker]) => {
      return worker &&
             worker.job === autobuyerId &&
             (excludeSlotId === null || parseInt(slotId) !== excludeSlotId);
    });
  }
  isGeneratorAutomatorJobTaken(automatorId, excludeSlotId = null) {
    return Object.entries(this.assignedWorkers).some(([slotId, worker]) => {
      if (slotId == excludeSlotId) return false;
      return worker && worker.job && worker.job.type === 'generator_automator' && worker.job.id === automatorId;
    });
  }
  getAutobuyerInterval(worker, autobuyer) {
    const standardIntervals = {
      1: 5000,
      2: 3000,
      3: 1000,
      4: 200,
      5: 50
    };
    const premiumIntervals = {
      1: 7500,
      2: 4000,
      3: 1500,
      4: 500,
      5: 75
    };
    const ultimateIntervals = {
      1: 2500,
      2: 1500,
      3: 500,
      4: 100,
      5: 25
    };
    const workerStars = worker.stars || 1;
    let intervals;
    if (autobuyer.speedTier === 'ultimate') {
      intervals = ultimateIntervals;
    } else if (autobuyer.speedTier === 'premium') {
      intervals = premiumIntervals;
    } else {
      intervals = standardIntervals;
    }
    return intervals[workerStars] || 5000;
  }
  getDeliveryAutomatorInterval(worker, automator) {
    const deliveryIntervals = {
      1: 60000,
      2: 40000,
      3: 20000,
      4: 5000,
      5: 750
    };
    const workerStars = worker.stars || 1;
    return deliveryIntervals[workerStars] || 60000;
  }
  getPrismTileAutomatorInterval(worker, automator) {
    const prismTileIntervals = {
      1: 10000,
      2: 5000,
      3: 2000,
      4: 1000,
      5: 250
    };
    const workerStars = worker.stars || 1;
    return prismTileIntervals[workerStars] || 10000;
  }
  getLightGeneratorAutomatorInterval(worker, automator) {
    const lightGeneratorIntervals = {
      1: 10000,
      2: 5000,
      3: 2000,
      4: 500,
      5: 20
    };
    const workerStars = worker.stars || 1;
    return lightGeneratorIntervals[workerStars] || 10000;
  }
  getTokenFinderAutomatorInterval(worker, automator) {
    const tokenFinderIntervals = {
      1: 100000,
      2: 60000,
      3: 30000,
      4: 15000,
      5: 5000
    };
    const workerStars = worker.stars || 1;
    return tokenFinderIntervals[workerStars] || 100000;
  }
  getWorkerProgress(worker) {
    if (!worker.job || !worker.lastActionTime) return 0;
    if (typeof worker.job === 'object' && worker.job.type === 'delivery_automator') {
      const automator = this.deliveryAutomatorJobs.find(da => da.id === worker.job.id);
      if (automator) {
        const interval = this.getDeliveryAutomatorInterval(worker, automator);
        const timeSinceLastAction = Date.now() - worker.lastActionTime;
        return Math.min(100, (timeSinceLastAction / interval) * 100);
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'prism_automator') {
      const automator = this.prismTileAutomatorJobs.find(pa => pa.id === worker.job.id);
      if (automator) {
        const interval = this.getPrismTileAutomatorInterval(worker, automator);
        const timeSinceLastAction = Date.now() - worker.lastActionTime;
        return Math.min(100, (timeSinceLastAction / interval) * 100);
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'token_finder_automator') {
      const automator = this.tokenFinderAutomatorJobs.find(ta => ta.id === worker.job.id);
      if (automator) {
        const interval = this.getTokenFinderAutomatorInterval(worker, automator);
        const timeSinceLastAction = Date.now() - worker.lastActionTime;
        return Math.min(100, (timeSinceLastAction / interval) * 100);
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'upgrade_automator') {
      const interval = this.getUpgradeAutomatorInterval(worker.stars);
      const timeSinceLastAction = Date.now() - worker.lastActionTime;
      return Math.min(100, (timeSinceLastAction / interval) * 100);
    }
    if (typeof worker.job === 'object' && worker.job.type === 'auto_nectarize') {
      return this.getAutoNectarizeProgress(worker);
    }
    if (typeof worker.job === 'object' && worker.job.type === 'generator_automator') {
      const automator = this.generatorAutomatorJobs.find(ga => ga.id === worker.job.id);
      if (automator) {
        const interval = 5000;
        const timeSinceLastAction = Date.now() - worker.lastActionTime;
        return Math.min(100, (timeSinceLastAction / interval) * 100);
      }
    }
    const autobuyer = this.autobuyerJobs.find(ab => ab.id === worker.job);
    if (autobuyer) {
      const interval = this.getAutobuyerInterval(worker, autobuyer);
      const timeSinceLastAction = Date.now() - worker.lastActionTime;
      return Math.min(100, (timeSinceLastAction / interval) * 100);
    }
    const actionInterval = 30000;
    const timeSinceLastAction = Date.now() - worker.lastActionTime;
    return Math.min(100, (timeSinceLastAction / actionInterval) * 100);
  }
  getProgressText(worker) {
    if (!worker.job) return 'No job assigned';
    const assignedSlot = Object.keys(this.assignedWorkers).find(slot => this.assignedWorkers[slot] === worker);
    if (assignedSlot && !this.canWorkerWork(assignedSlot)) {
      return 'Too hungry to work!';
    }
    if (typeof worker.job === 'object' && worker.job.type === 'delivery_automator') {
      const automator = this.deliveryAutomatorJobs.find(da => da.id === worker.job.id);
      if (automator) {
        if (!automator.isUnlocked) {
          const clicks = this.deliveryProgress.deliveryClicks;
          const required = automator.unlockRequirement.required;
          return `Quest: ${clicks}/${required} delivery clicks`;
        } else {
          const progress = this.getWorkerProgress(worker);
          if (progress >= 100) return 'Ready to deliver!';
          const interval = this.getDeliveryAutomatorInterval(worker, automator);
          const timeLeft = Math.ceil((interval * (1 - progress / 100)) / 1000);
          return `Preparing delivery... ${Math.max(0, timeLeft)}s`;
        }
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'prism_automator') {
      const automator = this.prismTileAutomatorJobs.find(pa => pa.id === worker.job.id);
      if (automator) {
        if (!automator.isUnlocked) {
          const clicks = this.prismTileProgress.prismTileClicks;
          const required = automator.unlockRequirement.required;
          return `Quest: ${clicks}/${required} prism tiles clicked`;
        } else {
          const progress = this.getWorkerProgress(worker);
          if (progress >= 100) return 'Ready to automate!';
          const interval = this.getPrismTileAutomatorInterval(worker, automator);
          const timeLeft = Math.ceil((interval * (1 - progress / 100)) / 1000);
          return `Automating... ${Math.max(0, timeLeft)}s`;
        }
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'token_finder_automator') {
      const automator = this.tokenFinderAutomatorJobs.find(ta => ta.id === worker.job.id);
      if (automator) {
        if (!automator.isUnlocked) {
          const tokensCollected = this.tokenFinderAutomatorProgress.tokensCollected || 0;
          const required = automator.unlockRequirement.required;
          return `Quest: ${tokensCollected}/${required} tokens collected`;
        } else {
          const progress = this.getWorkerProgress(worker);
          if (progress >= 100) return 'Ready to find token!';
          const interval = this.getTokenFinderAutomatorInterval(worker, automator);
          const timeLeft = Math.ceil((interval * (1 - progress / 100)) / 1000);
          return `Searching... ${Math.max(0, timeLeft)}s`;
        }
      }
    }
    if (typeof worker.job === 'object' && worker.job.type === 'upgrade_automator') {
      const progress = this.getWorkerProgress(worker);
      if (progress >= 100) return 'Ready to buy upgrades!';
      const interval = this.getUpgradeAutomatorInterval(worker.stars);
      const timeLeft = Math.ceil((interval * (1 - progress / 100)) / 1000);
      return `Automating... ${Math.max(0, timeLeft)}s`;
    }
    if (typeof worker.job === 'object' && worker.job.type === 'auto_nectarize') {
      return this.getAutoNectarizeProgressText(worker);
    }
    if (typeof worker.job === 'object' && worker.job.type === 'generator_automator') {
      const automator = this.generatorAutomatorJobs.find(ga => ga.id === worker.job.id);
      if (automator) {
        if (!automator.isUnlocked) {
          const progress = this.getGeneratorAutomatorProgress(automator.id);
          return `Quest: ${progress.current}/${progress.required} boxes produced`;
        } else {
          const progress = this.getWorkerProgress(worker);
          if (progress >= 100) return 'Ready to automate!';
          const timeLeft = Math.ceil((5000 * (1 - progress / 100)) / 1000);
          return `Automating... ${Math.max(0, timeLeft)}s`;
        }
      }
    }
    const autobuyer = this.autobuyerJobs.find(ab => ab.id === worker.job);
    if (autobuyer) {
      if (!autobuyer.isUnlocked) {
        const progress = this.autobuyerProgress[autobuyer.unlockRequirement.type] || 0;
        const required = autobuyer.unlockRequirement.count;
        return `Quest: ${progress}/${required} ${autobuyer.unlockRequirement.type}`;
      } else {
        const progress = this.getWorkerProgress(worker);
        if (progress >= 100) return 'Ready to automate!';
        const interval = this.getAutobuyerInterval(worker, autobuyer);
        const timeLeft = Math.ceil((interval * (1 - progress / 100)) / 1000);
        return `Automating... ${Math.max(0, timeLeft)}s`;
      }
    }
    const progress = this.getWorkerProgress(worker);
    if (progress >= 100) return 'Ready to work!';
    const timeLeft = 30 - Math.floor((Date.now() - (worker.lastActionTime || Date.now())) / 1000);
    return `Working... ${Math.max(0, timeLeft)}s`;
  }
  saveData(force = false) {
    // Front desk state is automatically saved by the main save system
    // This method is kept for compatibility but no longer performs frequent saves
    if (!window.state.frontDesk) {
      window.state.frontDesk = {};
    }
    window.state.frontDesk.availableWorkers = this.availableWorkers;
    window.state.frontDesk.assignedWorkers = this.assignedWorkers;
    window.state.frontDesk.unlockedSlots = this.unlockedSlots;
    window.state.frontDesk.nextArrivalTime = this.nextArrivalTime;
    window.state.frontDesk.isUnlocked = this.isUnlocked;
    window.state.frontDesk.autobuyerProgress = this.autobuyerProgress;
    window.state.frontDesk.autobuyerUnlocks = {};
    this.autobuyerJobs.forEach(autobuyer => {
      window.state.frontDesk.autobuyerUnlocks[autobuyer.id] = autobuyer.isUnlocked;
    });
    window.state.frontDesk.generatorAutomatorProgress = this.generatorAutomatorProgress;
    window.state.frontDesk.generatorAutomatorUnlocks = {};
    this.generatorAutomatorJobs.forEach(automator => {
      window.state.frontDesk.generatorAutomatorUnlocks[automator.id] = automator.isUnlocked;
    });
    window.state.frontDesk.deliveryProgress = this.deliveryProgress;
    window.state.frontDesk.deliveryAutomatorUnlocks = {};
    this.deliveryAutomatorJobs.forEach(automator => {
      window.state.frontDesk.deliveryAutomatorUnlocks[automator.id] = automator.isUnlocked;
    });
    window.state.frontDesk.prismTileProgress = this.prismTileProgress;
    window.state.frontDesk.prismTileAutomatorUnlocks = {};
    this.prismTileAutomatorJobs.forEach(automator => {
      window.state.frontDesk.prismTileAutomatorUnlocks[automator.id] = automator.isUnlocked;
    });
    window.state.frontDesk.lightGeneratorAutomatorProgress = this.lightGeneratorAutomatorProgress;
    window.state.frontDesk.lightGeneratorAutomatorUnlocks = {};
    this.lightGeneratorAutomatorJobs.forEach(automator => {
      window.state.frontDesk.lightGeneratorAutomatorUnlocks[automator.id] = automator.isUnlocked;
    });
    window.state.frontDesk.lightGeneratorAutomatorShown = this.lightGeneratorAutomatorShown;
    window.state.frontDesk.tokenFinderAutomatorProgress = this.tokenFinderAutomatorProgress;
    window.state.frontDesk.tokenFinderAutomatorUnlocks = {};
    this.tokenFinderAutomatorJobs.forEach(automator => {
      window.state.frontDesk.tokenFinderAutomatorUnlocks[automator.id] = automator.isUnlocked;
    });
    window.state.frontDesk.totalPollenUpgradesBought = this.totalPollenUpgradesBought;
    window.state.frontDesk.totalFlowerUpgradesBought = this.totalFlowerUpgradesBought;
    window.state.frontDesk.totalNectarUpgradesBought = this.totalNectarUpgradesBought;
    window.state.frontDesk.previousUpgradeLevels = this.previousUpgradeLevels;
    window.state.frontDesk.workerHunger = this.workerHunger;
    window.state.frontDesk.foodRations = this.foodRations;
    window.state.frontDesk.tokensGivenToTico = this.tokensGivenToTico;
    window.state.frontDesk.lastHungerTick = this.lastHungerTick;
    // Save system disabled
  }
  loadData() {
    if (window.state.frontDesk) {
      this.availableWorkers = window.state.frontDesk.availableWorkers || [];
      this.assignedWorkers = window.state.frontDesk.assignedWorkers || {};
      this.unlockedSlots = window.state.frontDesk.unlockedSlots || 1;
      this.isUnlocked = window.state.frontDesk.isUnlocked || false;
      if (window.state.frontDesk.autobuyerProgress) {
        this.autobuyerProgress = { ...window.state.frontDesk.autobuyerProgress };
      } else {
        this.autobuyerProgress = { common_box_autobuyer: 0 };
      }
      if (window.state.frontDesk.generatorAutomatorProgress) {
        this.generatorAutomatorProgress = { ...window.state.frontDesk.generatorAutomatorProgress };
      } else {
        this.generatorAutomatorProgress = {
          common_generator_automator: 0,
          uncommon_generator_automator: 0,
          rare_generator_automator: 0,
          legendary_generator_automator: 0,
          mythic_generator_automator: 0
        };
      }
      if (window.state.frontDesk.autobuyerUnlocks) {
        this.autobuyerJobs.forEach(autobuyer => {
          if (window.state.frontDesk.autobuyerUnlocks[autobuyer.id]) {
            autobuyer.isUnlocked = true;
          }
        });
      }
      if (window.state.frontDesk.generatorAutomatorUnlocks) {
        this.generatorAutomatorJobs.forEach(automator => {
          if (window.state.frontDesk.generatorAutomatorUnlocks[automator.id]) {
            automator.isUnlocked = true;
          }
        });
      }
      if (window.state.frontDesk.deliveryProgress) {
        this.deliveryProgress = { ...window.state.frontDesk.deliveryProgress };
      } else {
        this.deliveryProgress = {
          deliveryClicks: 0,
          auto_delivery: 0
        };
      }
      if (window.state.frontDesk.deliveryAutomatorUnlocks) {
        this.deliveryAutomatorJobs.forEach(automator => {
          if (window.state.frontDesk.deliveryAutomatorUnlocks[automator.id]) {
            automator.isUnlocked = true;
          }
        });
      }
      if (window.state.frontDesk.prismTileProgress) {
        this.prismTileProgress = { ...window.state.frontDesk.prismTileProgress };
      } else {
        this.prismTileProgress = {
          prismTileClicks: 0,
          auto_prism_tile_clicker: 0
        };
      }
      if (window.state.frontDesk.prismTileAutomatorUnlocks) {
        this.prismTileAutomatorJobs.forEach(automator => {
          if (window.state.frontDesk.prismTileAutomatorUnlocks[automator.id]) {
            automator.isUnlocked = true;
          }
        });
      }
      if (window.state.frontDesk.lightGeneratorAutomatorProgress) {
        this.lightGeneratorAutomatorProgress = { ...window.state.frontDesk.lightGeneratorAutomatorProgress };
      } else {
        this.lightGeneratorAutomatorProgress = {
          light: 0,
          redlight: 0,
          orangelight: 0,
          yellowlight: 0,
          greenlight: 0,
          bluelight: 0
        };
      }
      if (window.state.frontDesk.lightGeneratorAutomatorUnlocks) {
        this.lightGeneratorAutomatorJobs.forEach(automator => {
          if (window.state.frontDesk.lightGeneratorAutomatorUnlocks[automator.id]) {
            automator.isUnlocked = true;
          }
        });
      }
      if (window.state.frontDesk.lightGeneratorAutomatorShown) {
        this.lightGeneratorAutomatorShown = { ...window.state.frontDesk.lightGeneratorAutomatorShown };
      } else {
        this.lightGeneratorAutomatorShown = {
          light_generator_automator: false,
          redlight_generator_automator: false,
          orangelight_generator_automator: false,
          yellowlight_generator_automator: false,
          greenlight_generator_automator: false,
          bluelight_generator_automator: false
        };
      }
      if (window.state.frontDesk.tokenFinderAutomatorProgress) {
        this.tokenFinderAutomatorProgress = { ...window.state.frontDesk.tokenFinderAutomatorProgress };
      } else {
        this.tokenFinderAutomatorProgress = {
          tokensCollected: 0
        };
      }
      if (window.state.frontDesk.tokenFinderAutomatorUnlocks) {
        this.tokenFinderAutomatorJobs.forEach(automator => {
          if (window.state.frontDesk.tokenFinderAutomatorUnlocks[automator.id]) {
            automator.isUnlocked = true;
          }
        });
      }
      this.totalPollenUpgradesBought = window.state.frontDesk.totalPollenUpgradesBought || 0;
      this.totalFlowerUpgradesBought = window.state.frontDesk.totalFlowerUpgradesBought || 0;
      this.totalNectarUpgradesBought = window.state.frontDesk.totalNectarUpgradesBought || 0;
      this.previousUpgradeLevels = window.state.frontDesk.previousUpgradeLevels || {
        pollen: {
          pollenValueUpgradeLevel: window.pollenValueUpgradeLevel || 0,
          terrariumPollenValueUpgradeLevel: window.terrariumPollenValueUpgradeLevel || 0,
          terrariumFlowerXPUpgradeLevel: window.terrariumFlowerXPUpgradeLevel || 0,
          terrariumPollenToolSpeedUpgradeLevel: window.terrariumPollenToolSpeedUpgradeLevel || 0
        },
        flower: {
          pollenValueUpgrade2Level: window.pollenValueUpgrade2Level || 0,
          terrariumPollenValueUpgrade2Level: window.terrariumPollenValueUpgrade2Level || 0,
          terrariumExtraChargeUpgradeLevel: window.terrariumExtraChargeUpgradeLevel || 0,
          terrariumFlowerFieldExpansionUpgradeLevel: window.terrariumFlowerFieldExpansionUpgradeLevel || 0,
          terrariumFlowerUpgrade4Level: window.terrariumFlowerUpgrade4Level || 0
        },
        nectar: {
          terrariumXpMultiplierUpgradeLevel: window.terrariumXpMultiplierUpgradeLevel || 0,
          terrariumPollenFlowerNectarUpgradeLevel: window.terrariumPollenFlowerNectarUpgradeLevel || 0,
          terrariumNectarXpUpgradeLevel: window.terrariumNectarXpUpgradeLevel || 0,
          terrariumKpNectarUpgradeLevel: window.terrariumKpNectarUpgradeLevel || 0
        }
      };
      this.workerHunger = window.state.frontDesk.workerHunger || {};
      this.foodRations = window.state.frontDesk.foodRations || 0;
      this.tokensGivenToTico = window.state.frontDesk.tokensGivenToTico || 0;
      this.lastHungerTick = window.state.frontDesk.lastHungerTick || Date.now();
      window.totalPollenUpgradesBought = this.totalPollenUpgradesBought;
      window.totalFlowerUpgradesBought = this.totalFlowerUpgradesBought;
      window.totalNectarUpgradesBought = this.totalNectarUpgradesBought;
      this.migrateWorkerNames();
      const savedArrivalTime = window.state.frontDesk.nextArrivalTime;
      if (savedArrivalTime && typeof savedArrivalTime === 'number' && savedArrivalTime > Date.now()) {
        this.nextArrivalTime = savedArrivalTime;
        const timeRemaining = this.nextArrivalTime - Date.now();
      } else {
        const reason = !savedArrivalTime ? 'no saved time' :
                     typeof savedArrivalTime !== 'number' ? 'invalid time format' :
                     'time has expired';
        this.scheduleNextArrival();
      }
    } else {
      this.scheduleNextArrival();
    }
  }
  migrateWorkerNames() {
    this.availableWorkers.forEach(worker => {
      if (worker) {
        if (!worker.creatureData && worker.creatureId) {
          worker.creatureData = this.rikkorCreatures[worker.creatureId];
        }
        if (worker.creatureData) {
          if (!worker.displayName) {
            worker.displayName = worker.creatureData.name;
          }
          if (!worker.name) {
            worker.name = worker.creatureData.name;
          }
          if (!worker.images && worker.creatureData.images) {
            worker.images = worker.creatureData.images;
          }
          if (!worker.image && worker.images) {
            worker.image = worker.images.normal;
          }
        }
      }
    });
    Object.values(this.assignedWorkers).forEach(worker => {
      if (worker) {
        if (!worker.creatureData && worker.creatureId) {
          worker.creatureData = this.rikkorCreatures[worker.creatureId];
        }
        if (worker.creatureData) {
          if (!worker.displayName) {
            worker.displayName = worker.creatureData.name;
          }
          if (!worker.name) {
            worker.name = worker.creatureData.name;
          }
          if (!worker.images && worker.creatureData.images) {
            worker.images = worker.creatureData.images;
          }
          if (!worker.image && worker.images) {
            worker.image = worker.images.normal;
          }
        }
      }
    });
  }
  updateHighestGrade() {
    const wasUnlocked = this.isUnlocked;
    this.checkUnlockStatus();
    if (!wasUnlocked && this.isUnlocked) {
      this.init();
    }
  }
  updateAutoclickerUI() {
  }
  findWorkerAssignedToPrismTileAutoclicker() {
    for (const worker of Object.values(this.assignedWorkers)) {
      if (worker && worker.assignedJob &&
          worker.assignedJob.type === 'prism_automator' &&
          worker.assignedJob.id === 'auto_prism_tile_clicker') {
        return worker;
      }
    }
    return null;
  }
  removeAutoclickerCardFromPrismTab() {
    const existingCard = document.getElementById('auto-prism-tile-clicker');
    if (existingCard) {
      existingCard.remove();
    }
    const existingStyles = document.getElementById('autoclicker-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
  }
}
function hideAllFrontDeskWorkerSpeech() {
  if (window.frontDesk && window.frontDesk.hideAllWorkerSpeech) {
    window.frontDesk.hideAllWorkerSpeech();
  }
}
function closeFrontDeskModal() {
  if (window.frontDesk) {
    window.frontDesk.closeJobModal();
  }
}
function trackBoxOpening(boxType = 'common') {
  if (window.frontDesk && window.frontDesk.trackBoxOpening) {
    window.frontDesk.trackBoxOpening(boxType);
  }
}
function onCommonBoxOpened() {
  if (window.frontDesk && window.frontDesk.onCommonBoxOpened) {
    window.frontDesk.onCommonBoxOpened();
  }
}
function checkFrontDeskUnlock() {
  if (window.frontDesk) {
    window.frontDesk.forceCheckUnlock();
  }
}
function forceSpawnWorker() {
  if (window.frontDesk && window.frontDesk.isUnlocked) {
    window.frontDesk.spawnWorker();
  } else {
  }
}
function showAvailableCreatures() {
  if (window.frontDesk) {
    Object.values(window.frontDesk.rikkorCreatures).forEach(creature => {
    });
  }
}
function testWorkerSpeech() {
  if (window.frontDesk) {
    const allWorkers = [...window.frontDesk.availableWorkers, ...Object.values(window.frontDesk.assignedWorkers)].filter(w => w);
    if (allWorkers.length > 0) {
      const worker = allWorkers[0];
      window.frontDesk.makeWorkerSpeak(worker, "This is a test speech!", 3000);
    } else {
    }
  }
}
function debugOpenCommonBoxes(count = 1) {
  if (window.frontDesk) {
    for (let i = 0; i < count; i++) {
      window.frontDesk.onCommonBoxOpened();
    }
    const autobuyer = window.frontDesk.autobuyerJobs.find(ab => ab.id === 'common_box_autobuyer');
    if (autobuyer && autobuyer.isUnlocked) {
    } else {
      const progress = window.frontDesk.getAutobuyerProgress('common_box_autobuyer');
    }
  } else {
  }
}
function checkAutobuyerStatus() {
  if (window.frontDesk) {
    const autobuyer = window.frontDesk.autobuyerJobs.find(ab => ab.id === 'common_box_autobuyer');
    const progress = window.frontDesk.getAutobuyerProgress('common_box_autobuyer');
    const buyboxFunction = window.buybox || window.buyBox;
    const functionName = window.buyBox ? 'buyBox' : window.buybox ? 'buybox' : 'none';
    const isHooked = buyboxFunction && (buyboxFunction.toString().includes('frontDesk') || buyboxFunction.toString().includes('onCommonBoxOpened'));
  }
}
function checkFrontDeskSaveState() {
  if (window.state.frontDesk && window.state.frontDesk.autobuyerProgress) {
  } else {
  }
}
function testBuyboxIntegration() {
  const buyboxFunction = window.buybox || window.buyBox;
  const functionName = window.buyBox ? 'buyBox' : window.buybox ? 'buybox' : 'none';
  if (buyboxFunction && typeof buyboxFunction === 'function') {
    try {
      buyboxFunction("common");
    } catch (error) {
    }
    setTimeout(() => {
    }, 100);
  } else {
  }
}

// Debug function for front desk state
function debugFrontDeskState(context) {
  
}
window.debugFrontDeskState = debugFrontDeskState;

window.FrontDesk = FrontDesk;
function initializeFrontDesk() {
  window.frontDesk = new FrontDesk();
  debugFrontDeskState('After FrontDesk creation');
  window.frontDeskManager = window.frontDesk;
  window.onGeneratorCompleted = function(generatorType) {
    if (window.frontDesk) {
      window.frontDesk.onGeneratorCompleted(generatorType);
    }
  };
  setInterval(() => {
    if (window.frontDesk && !window.frontDesk.initialized) {
      window.frontDesk.forceCheckUnlock();
    }
    if (window.frontDesk) {
      window.frontDesk.updateJobModalIfOpen();
      window.frontDesk.monitorUpgradeChanges();
    }
  }, 1000);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFrontDesk);
} else {
  initializeFrontDesk();
}
function incrementPollenUpgradeCounter(amount = 1) {
  if (window.frontDesk) {
    window.frontDesk.incrementPollenUpgradeCounter(amount);
  }
}
function incrementFlowerUpgradeCounter(amount = 1) {
  if (window.frontDesk) {
    window.frontDesk.incrementFlowerUpgradeCounter(amount);
  }
}
function incrementNectarUpgradeCounter(amount = 1) {
  if (window.frontDesk) {
    window.frontDesk.incrementNectarUpgradeCounter(amount);
  }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FrontDesk;
}
window.unlockAllFrontDeskJobs = function() {
  if (!window.frontDesk) {
    return false;
  }
  let totalUnlocked = 0;
  window.frontDesk.autobuyerJobs.forEach(job => {
    if (!job.isUnlocked) {
      job.isUnlocked = true;
      totalUnlocked++;
    }
  });
  window.frontDesk.deliveryAutomatorJobs.forEach(job => {
    if (!job.isUnlocked) {
      job.isUnlocked = true;
      totalUnlocked++;
    }
  });
  window.frontDesk.prismTileAutomatorJobs.forEach(job => {
    if (!job.isUnlocked) {
      job.isUnlocked = true;
      totalUnlocked++;
    }
  });
  window.frontDesk.generatorAutomatorJobs.forEach(job => {
    if (!job.isUnlocked) {
      job.isUnlocked = true;
      totalUnlocked++;
    }
  });
  window.frontDesk.lightGeneratorAutomatorJobs.forEach(job => {
    if (!job.isUnlocked) {
      job.isUnlocked = true;
      totalUnlocked++;
    }
  });
  window.frontDesk.tokenFinderAutomatorJobs.forEach(job => {
    if (!job.isUnlocked) {
      job.isUnlocked = true;
      totalUnlocked++;
    }
  });
  Object.keys(window.frontDesk.lightGeneratorAutomatorShown).forEach(key => {
    window.frontDesk.lightGeneratorAutomatorShown[key] = true;
  });
  const upgradeRequirement = 1500;
  if (window.frontDesk.totalPollenUpgradesBought < upgradeRequirement) {
    window.frontDesk.totalPollenUpgradesBought = upgradeRequirement;
    window.totalPollenUpgradesBought = upgradeRequirement;
    totalUnlocked++;
  }
  if (window.frontDesk.totalFlowerUpgradesBought < upgradeRequirement) {
    window.frontDesk.totalFlowerUpgradesBought = upgradeRequirement;
    window.totalFlowerUpgradesBought = upgradeRequirement;
    totalUnlocked++;
  }
  if (window.frontDesk.totalNectarUpgradesBought < upgradeRequirement) {
    window.frontDesk.totalNectarUpgradesBought = upgradeRequirement;
    window.totalNectarUpgradesBought = upgradeRequirement;
    totalUnlocked++;
  }
  const nectarizeRequirement = 150;
  const currentNectarizeResets = window.nectarizeResets || 0;
  if (currentNectarizeResets < nectarizeRequirement) {
    window.nectarizeResets = nectarizeRequirement;
    totalUnlocked++;
  }
  if (typeof window.frontDesk.updateJobAssignUI === 'function') {
    window.frontDesk.updateJobAssignUI();
  }
  return {
    totalUnlocked,
    autobuyerJobs: window.frontDesk.autobuyerJobs.length,
    deliveryJobs: window.frontDesk.deliveryAutomatorJobs.length,
    prismTileJobs: window.frontDesk.prismTileAutomatorJobs.length,
    generatorJobs: window.frontDesk.generatorAutomatorJobs.length,
    lightGeneratorJobs: window.frontDesk.lightGeneratorAutomatorJobs.length,
    tokenFinderJobs: window.frontDesk.tokenFinderAutomatorJobs.length,
    upgradeAutomatorJobs: 3,
    autoNectarizeJobs: 1
  };
};
window.listAllFrontDeskJobs = function() {
  if (!window.frontDesk) {
    return;
  }
  window.frontDesk.autobuyerJobs.forEach(job => {
  });
  window.frontDesk.deliveryAutomatorJobs.forEach(job => {
  });
  window.frontDesk.prismTileAutomatorJobs.forEach(job => {
  });
  window.frontDesk.generatorAutomatorJobs.forEach(job => {
  });
  window.frontDesk.lightGeneratorAutomatorJobs.forEach(job => {
  });
  window.frontDesk.tokenFinderAutomatorJobs.forEach(job => {
  });
  const pollenUpgrades = window.frontDesk.totalPollenUpgradesBought || 0;
  const flowerUpgrades = window.frontDesk.totalFlowerUpgradesBought || 0;
  const nectarUpgrades = window.frontDesk.totalNectarUpgradesBought || 0;
  const nectarizeResets = window.nectarizeResets || 0;
  const totalRegularJobs = window.frontDesk.autobuyerJobs.length +
                          window.frontDesk.deliveryAutomatorJobs.length +
                          window.frontDesk.prismTileAutomatorJobs.length +
                          window.frontDesk.generatorAutomatorJobs.length +
                          window.frontDesk.lightGeneratorAutomatorJobs.length +
                          window.frontDesk.tokenFinderAutomatorJobs.length;
  const totalSpecialJobs = 4;
  const totalJobs = totalRegularJobs + totalSpecialJobs;
  const unlockedRegularJobs = [...window.frontDesk.autobuyerJobs,
                              ...window.frontDesk.deliveryAutomatorJobs,
                              ...window.frontDesk.prismTileAutomatorJobs,
                              ...window.frontDesk.generatorAutomatorJobs,
                              ...window.frontDesk.lightGeneratorAutomatorJobs,
                              ...window.frontDesk.tokenFinderAutomatorJobs]
                              .filter(job => job.isUnlocked).length;
  const unlockedSpecialJobs = (pollenUpgrades >= 1500 ? 1 : 0) +
                             (flowerUpgrades >= 1500 ? 1 : 0) +
                             (nectarUpgrades >= 1500 ? 1 : 0) +
                             (nectarizeResets >= 150 ? 1 : 0);
  const totalUnlocked = unlockedRegularJobs + unlockedSpecialJobs;
  return {
    totalJobs,
    totalUnlocked,
    regularJobs: { total: totalRegularJobs, unlocked: unlockedRegularJobs },
    specialJobs: { total: totalSpecialJobs, unlocked: unlockedSpecialJobs }
  };
};
window.testFrontDeskFeatures = function() {
  if (!window.frontDesk) {
    return;
  }
  const stats = window.listAllFrontDeskJobs();
  return stats;
};
window.unlockFrontDesk = function() {
  if (!window.frontDesk) {
    return false;
  }
  window.frontDesk.isUnlocked = true;
  window.frontDesk.initialized = true;
  window.frontDesk.unlockedSlots = window.frontDesk.maxSlots;
  if (typeof window.frontDesk.forceCheckUnlock === 'function') {
    window.frontDesk.forceCheckUnlock();
  }
  return true;
};
window.spawnTestWorkers = function(count = 3) {
  if (!window.frontDesk) {
    return false;
  }
  window.frontDesk.availableWorkers = [];
  for (let i = 0; i < count; i++) {
    if (typeof window.frontDesk.generateRandomWorker === 'function') {
      const worker = window.frontDesk.generateRandomWorker();
      window.frontDesk.availableWorkers.push(worker);
    }
  }
  if (typeof window.frontDesk.updateAvailableWorkersUI === 'function') {
    window.frontDesk.updateAvailableWorkersUI();
  }
  return true;
};
window.testTicoFoodRationBuff = function(friendshipLevel = 4) {
  if (!window.frontDesk) {
    return false;
  }
  if (!window.friendship) {
    window.friendship = {
      FrontDesk: { level: 0, points: new Decimal(0) }
    };
  }
  if (!window.friendship.FrontDesk) {
    window.friendship.FrontDesk = { level: 0, points: new Decimal(0) };
  }
  window.friendship.FrontDesk.level = friendshipLevel;
  const originalTokens = window.frontDesk.tokensGivenToTico;
  const originalRations = window.frontDesk.foodRations;
  window.frontDesk.handleTokenDrop('berries', 5);
  const expectedBase = 1;
  const expectedMultiplier = friendshipLevel >= 4 ? 1 + (friendshipLevel - 3) : 1;
  const expectedTotal = expectedBase * expectedMultiplier;
  const actualGain = window.frontDesk.foodRations - originalRations;
  if (actualGain === expectedTotal) {
  } else {
  }
  return {
    friendshipLevel,
    expectedBase,
    expectedMultiplier,
    expectedTotal,
    actualGain,
    success: actualGain === expectedTotal
  };
};
window.testAllTicoFoodRationBuffs = function() {
  const testLevels = [1, 3, 4, 5, 6, 10];
  const results = [];
  testLevels.forEach(level => {
    const result = window.testTicoFoodRationBuff(level);
    results.push(result);
  });
  results.forEach(result => {
    const status = result.success ? '?' : '?';
  });
};

function awardTicoFriendshipForFoodRationCrafting() {
  if (!window.friendship || typeof window.friendship.addPoints !== 'function') {
    return;
  }

  const currentFriendship = window.friendship.getFriendshipLevel('tico');
  if (!currentFriendship || !DecimalUtils.isDecimal(currentFriendship.points)) {
    return;
  }

  const friendshipIncrease = currentFriendship.points.mul(0.03);
  const minIncrease = new Decimal(1);
  const finalIncrease = Decimal.max(friendshipIncrease, minIncrease);

  window.friendship.addPoints('tico', finalIncrease);
}

window.awardTicoFriendshipForFoodRationCrafting = awardTicoFriendshipForFoodRationCrafting;
