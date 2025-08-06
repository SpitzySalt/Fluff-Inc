// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file



























































const cafeteriaScenarios = {
  expansion2: [
    {
      id: "jammed_doors_crisis",
      title: "The Generator Room Door Problem",
      characters: ["peachy", "soap"],
      dialogue: [
        { speaker: "soap", text: "Peachy, I noticed the generator room doors never close anymore. What did you do exactly?" },
        { speaker: "peachy", text: "I discovered some hackium and used it to force open the locks." },
        { speaker: "soap", text: "Hackium? Isn't that unstable?" },
        { speaker: "peachy", text: "It gave me the brute force I needed, but now the door mechanism is permanently altered." },
        { speaker: "soap", text: "So the doors will stay open forever?" },
        { speaker: "peachy", text: "Yeah, I might have to find a way to reverse it later." },
        { speaker: "soap", text: "Well, at least we can always get in. Just be careful with that hackium residue." },
        { speaker: "peachy", text: "I’m already working on a reversible override. Next lunch, I’ll show you the prototype." },
        { speaker: "soap", text: "No you're not, you're just gonna open more boxes." },
        { speaker: "peachy", text: "Okay, you caught me. But I will get to it eventually!" },
      ]
    },
    {
      id: "bathroom_rumors",
      title: "Bathroom Rumors",
      characters: ["peachy", "soap"],
      dialogue: [
        { speaker: "soap", text: "Peachy, have you heard the rumor about the bathroom at 3:33 AM?" },
        { speaker: "peachy", text: "You mean the one where something weird happens if you go in at exactly that time?" },
        { speaker: "soap", text: "Yeah! Some say the lights flicker and you hear strange noises from the pipes." },
        { speaker: "peachy", text: "I heard someone saw their reflection wink at them. Creepy, right?" },
        { speaker: "soap", text: "I don't know if I believe it, but I kind of want to try it just to see." },
        { speaker: "peachy", text: "If you do, take a flashlight. And maybe a friend." },
        { speaker: "soap", text: "Would you come with me?" },
        { speaker: "peachy", text: "Only if we bring snacks. If we're going to get haunted, I want to be well-fed." },
        { speaker: "soap", text: "Deal! Midnight snacks and a bathroom adventure." },
        { speaker: "peachy", text: "Let's just hope we don't meet any ghostly plumbers." },
        { speaker: "soap", text: "Or haunted toilet paper!" },
        { speaker: "peachy", text: "Now that's a scary thought." },
        { speaker: "soap", text: "So, 3:33 AM tomorrow?" },
        { speaker: "peachy", text: "You’re on. This is going to be legendary." }
      ]
    },
    {
      id: "Vi_lore",
      title: "Vi",
      characters: ["peachy", "soap"],
      dialogue: [
        { speaker: "peachy", text: "Soap, you've been here longer than me. Can you tell me more about Vi?" },
        { speaker: "soap", text: "Vi? Oh, Sure what do you want to know about them?" },
        { speaker: "peachy", text: "They look strange, like they have this huge prism stuck on their tail." },
        { speaker: "soap", text: "Oh yeah, they told me they were born like that, its part of them." },
        { speaker: "peachy", text: "Really?????" },
        { speaker: "soap", text: "YES!" },
        { speaker: "peachy", text: "It must be annoying to have that all the time. I wonder if its heavy for them." },
        { speaker: "soap", text: "Maybe! But I'm sure they are used to it by now." },
        { speaker: "peachy", text: "I hope so." },
        { speaker: "soap", text: "The worst part is that they can't really take it off, you know?" },
        { speaker: "peachy", text: "That sounds tough. I wonder how they manage." },
        { speaker: "soap", text: "I think they just embrace it as part of who they are." }
      ]
    },
    {
      id: "Vi_lore",
      title: "Vi",
      characters: ["peachy", "soap"],
      dialogue: [
        { speaker: "peachy", text: "Soap, you've been here longer than me. Can you tell me more about Vi?" },
        { speaker: "soap", text: "Vi? Oh, Sure what do you want to know about them?" },
        { speaker: "peachy", text: "They look strange, like they have this huge prism stuck on their tail." },
        { speaker: "soap", text: "Oh yeah, they told me they were born like that, its part of them." },
        { speaker: "peachy", text: "Really?????" },
        { speaker: "soap", text: "YES!" },
        { speaker: "peachy", text: "It must be annoying to have that all the time. I wonder if its heavy for them." },
        { speaker: "soap", text: "Maybe! But I'm sure they are used to it by now." },
        { speaker: "peachy", text: "I hope so." },
        { speaker: "soap", text: "The worst part is that they can't really take it off, you know?" },
        { speaker: "peachy", text: "That sounds tough. I wonder how they manage." },
        { speaker: "soap", text: "I think they just embrace it as part of who they are." }
      ]
    },
    {
      id: "Water_Continent_Speech",
      title: "Water Continent Speech",
      characters: ["peachy", "soap"],
      dialogue: [
        { speaker: "peachy", text: "Soap, do you ever just stop and realize how wild it is that we're here?" },
        { speaker: "soap", text: "Honestly, yeah. I thought the water continent would be all lakes and rivers, but there’s so much land. And the mountains!" },
        { speaker: "peachy", text: "I keep staring at that giant tree. It feels like it’s watching over everything." },
        { speaker: "soap", text: "You mean the continent tree? I heard its roots go under every city. That’s kind of spooky." },
        { speaker: "peachy", text: "Spooky, but also comforting. Like, if you get lost, you just follow a root and you’ll end up somewhere interesting." },
        { speaker: "soap", text: "I wish I could climb it. Imagine the view from the top!" },
        { speaker: "peachy", text: "We’d probably see all the valleys and maybe even the moonfish in the lakes." },
        { speaker: "soap", text: "Moonfish? Are those real?" },
        { speaker: "peachy", text: "Supposedly. Only show up during a full moon. The locals say they glow blue." },
        { speaker: "soap", text: "We should go looking for them tonight. Bring snacks and a flashlight." },
        { speaker: "peachy", text: "Deal!" }
      ],  
    },
    {
      id: "soap_origin_electricity_continent",
      title: "Soap's Origin and the Electricity Continent",
      characters: ["peachy", "soap"],
      dialogue: [
        { speaker: "peachy", text: "Soap, I've never seen a yellow rikkor before. Where did you come from?" },
        { speaker: "soap", text: "Oh, I'm from the electricity continent. It's a huge, mostly deserted place with massive cities scattered around." },
        { speaker: "peachy", text: "Deserted? I thought continents were all forests and lakes." },
        { speaker: "soap", text: "Not mine! Most of it is dry desert, sand everywhere, and the cities are built with giant towers and power lines stretching for miles." },
        { speaker: "peachy", text: "That sounds intense. Why did you move here to the water continent?" },
        { speaker: "soap", text: "Honestly, the heat kept getting worse every year, and water was running out. I couldn't stand it anymore." },
        { speaker: "peachy", text: "So you came here for the water?" },
        { speaker: "soap", text: "Yeah. I heard the water continent was cooler and had plenty of lakes and rivers. It's a big change, but I like it here." },
        { speaker: "peachy", text: "Do you miss your old home?" },
        { speaker: "soap", text: "Sometimes. But I think I belong here now. It's easier to breathe, and I don't have to worry about running out of water." },
        { speaker: "peachy", text: "I'm glad you came. It's nice having you around." },
        { speaker: "soap", text: "Thanks, Peachy! I'm glad to be here too." }
      ]
    },
  ],
  expansion3: [
    {
      id: "bathroom_rumors_333_mystic_terrifying",
      title: "3:33 AM Bathroom Rumors Revisited",
      characters: ["peachy", "soap", "mystic"],
      dialogue: [
        { speaker: "peachy", text: "Mystic, we need to tell you about the bathroom rumors at 3:33 AM." },
        { speaker: "mystic", text: "The what now?" },
        { speaker: "soap", text: "Yes, the bathroom rumors! Do NOT enter the bathrooms at that time." },
        { speaker: "mystic", text: "Uhh, nothing's gonna happen." },
        { speaker: "peachy", text: "Mystic, you don't think anything weird happens at that time?" },
        { speaker: "mystic", text: "Nope. It's just a bathroom. The only thing you'll find at 3:33 AM is tired eyes and cold tiles." },
        { speaker: "soap", text: "But I swear I saw my reflection wink at me once!" },
        { speaker: "mystic", text: "Maybe you were just half asleep. Or imagining things." },
        { speaker: "soap", text: "And I also saw a hand coming out of the toilet!" },
        { speaker: "mystic", text: "WHAT!!?" },
        { speaker: "peachy", text: "Its true, at 3 AM weird things starts happening, its called the witching hour." },
        { speaker: "mystic", text: "Not at all. The witching hour is just a myth to scare people so they don't stay up the whole night." },
        { speaker: "soap", text: "Ooohh Mystic, if you were there... You would have seen it!" },
        { speaker: "mystic", text: "Stop saying such tom foolery, there's no hands coming out of the toilet at 3:33 AM." },
        { speaker: "peachy", text: "Then I dare you to go in there at 3:33 AM." },
        { speaker: "mystic", text: "Fine! I accept your challenge. I'm not scared of any fake skibidi hands." },
      ]
    },
    {
      id: "Kitchen_Hell",
      title: "Kitchen Hell",
      characters: ["peachy", "soap", "mystic"],
      dialogue: [
        { speaker: "mystic", text: "What is this? This kitchen is a disaster!" },
        { speaker: "peachy", text: "Sorry, Mystic! I tried to organize the spices but Soap spilled the flour everywhere." },
        { speaker: "soap", text: "It was an accident! The bag exploded!" },
        { speaker: "mystic", text: "An accident? This is chaos! Where’s the lamb sauce?" },
        { speaker: "peachy", text: "We don’t have lamb sauce, but we have berry plates?" },
        { speaker: "mystic", text: "Berry plates? This isn’t a dessert! Soap, why is the oven on fire?" },
        { speaker: "soap", text: "I was trying to give sparks to the petals but it turned into charcoal." },
        { speaker: "mystic", text: "Charcoal? Are you trying to poison me?" },
        { speaker: "peachy", text: "No, Mystic! We just wanted to impress you." },
        { speaker: "mystic", text: "Impress me? I’m not impressed, I’m horrified!" },
        { speaker: "soap", text: "Should we call the fire department?" },
        { speaker: "mystic", text: "We don't have a fire department here!" },
        { speaker: "peachy", text: "Next time, we’ll follow the recipe." },
        { speaker: "mystic", text: "Next time, you’ll follow my orders! This kitchen needs a miracle." },
        { speaker: "soap", text: "Yes, Chef!" },
        { speaker: "peachy", text: "Yes, Chef!" },
        { speaker: "mystic", text: "Good. Now clean up this mess before I lose my mind!" }
      ]
    },
    {
      id: "facility_philosophy",
      title: "The Philosophy of the Facility",
      characters: ["peachy", "soap", "mystic", "vi"],
      dialogue: [
        { speaker: "peachy", text: "What do you think the purpose of this facility really is?" },
        { speaker: "mystic", text: "It is a place of growth, where different paths converge and evolve." },
        { speaker: "soap", text: "I always thought it was just a place to work and learn." },
        { speaker: "mystic", text: "It is that, but also much more. It is a crucible of transformation." },
        { speaker: "peachy", text: "Transformation? How do you mean?" },
        { speaker: "mystic", text: "Each expansion brings new challenges, new knowledge, new possibilities." },
        { speaker: "soap", text: "I see what you mean! Every time we grow, we all change too." },
        { speaker: "peachy", text: "And we're not just changing individually, but as a community." },
        { speaker: "mystic", text: "Exactly. The facility reflects the collective journey of all who work here." },
        { speaker: "soap", text: "That's so beautiful! I never thought about it that way." },
        { speaker: "peachy", text: "So our work isn't just about progress, it's about evolution." },
        { speaker: "mystic", text: "And evolution requires both individual effort and collective harmony." },
        { speaker: "soap", text: "That's why teamwork is so important here!" },
        { speaker: "peachy", text: "And why everyone's role matters, no matter how small it might seem." },
        { speaker: "mystic", text: "You are beginning to understand the deeper truth of this place." },
        { speaker: "soap", text: "I feel like I understand my purpose here better now." },
        { speaker: "peachy", text: "Me too. This facility isn't just a workplace, it's a home for growth." },
        { speaker: "vi", text: "UHM actually, this place is a fluff making factory to feed off the swa elites." },
      ]
    },
    {
      id: "Mystic_past",
      title: "Mystic's past",
      characters: ["peachy", "soap", "mystic"],
      dialogue: [
        { speaker: "peachy", text: "Mystic, why did you become a chef?" },
        { speaker: "mystic", text: "Ah, a good question! Cooking is the art of transformation. I wanted to create joy and connection through food." },
        { speaker: "soap", text: "Did you always love cooking?" },
        { speaker: "mystic", text: "Not at first. I started as an apprentice in the purple archipelago's kitchens, learning the basics and fundamentals." },
        { speaker: "peachy", text: "Was it hard?" },
        { speaker: "mystic", text: "Very! Following the recipes was easy enough, but coming up with my own dishes was a challenge, I needed to appease everyone with new flavors." },
        { speaker: "soap", text: "What changed?" },
        { speaker: "mystic", text: "I realized that food is more than ingredients. It's about care, intention, sharing with others, and using the right ingredients and spices." },
        { speaker: "peachy", text: "So you cook to bring people together?" },
        { speaker: "mystic", text: "Exactly. A good meal can heal, inspire, and unite. That's why I became a chef." },
        { speaker: "soap", text: "I think your food does all that!" },
        { speaker: "mystic", text: "Thank you, Soap. And thank you both for being willing taste-testers—even when things go wrong!" },
        { speaker: "peachy", text: "We're always happy to help. Especially if dessert is involved." },
        { speaker: "mystic", text: "Dessert is the reward for brave souls!" },
        { speaker: "soap", text: "Can we help in the kitchen next time?" },
        { speaker: "mystic", text: "Uhh... Sure... Just don't be stupid and follow my lead." },
        { speaker: "peachy", text: "Then it's settled. Next lunch, we cook together!" },
        { speaker: "mystic", text: "I look forward to it (not)." }
      ]
    },
    {
      id: "mystic_moves_reason",
      title: "Why Mystic Left the Purple Archipelago",
      characters: ["peachy", "soap", "mystic", "vi"],
      dialogue: [
        { speaker: "peachy", text: "Mystic, what made you leave the purple archipelago and come to the water continent?" },
        { speaker: "mystic", text: "Two reasons, really. First, the water continent has so many different spices and ingredients. It's a paradise for anyone who loves cooking." },
        { speaker: "soap", text: "Isn't the purple archipelago famous for its palm tree grand tree?" },
        { speaker: "mystic", text: "It is! But that grand tree covers most of the sky. I could barely see the stars at night." },
        { speaker: "peachy", text: "You love star gazing, don't you?" },
        { speaker: "mystic", text: "Absolutely. Here, the nights are clear and I can watch the stars without being interrupted by a giant tree trunk and its leaves." },
        { speaker: "soap", text: "So you left home for better ingredients and a better view of the sky?" },
        { speaker: "mystic", text: "Exactly. I wanted to discover new flavors and see the universe above. The water continent is perfect for both." },
        { speaker: "peachy", text: "Did you miss your old home at first?" },
        { speaker: "mystic", text: "A little. The islands are beautiful, but I needed something new. The water continent feels like a fresh start." },
        { speaker: "soap", text: "No more beach paradise vibes, huh?" },
        { speaker: "peachy", text: "Here is mostly just forests, floras, mountains, rivers, waterfalls, caves, and a lot of lakes." },
        { speaker: "vi", text: "And snow." },
        { speaker: "mystic", text: "Each place has its own beauty, but I find the water continent's diversity inspiring." },
        { speaker: "soap", text: "And your cooking has definitely improved since you moved here!" },
        { speaker: "mystic", text: "Thank you, Soap. But I don't think you would really know if that's true." },
        { speaker: "peachy", text: "Mystic, your food is amazing! We love it." },
        { speaker: "soap", text: "Yeah, we really do. And we're glad you came here." },
        { speaker: "vi", text: "It is great indeed." },
        { speaker: "peachy", text: "We're glad you came here, Mystic. Your food is amazing!" },
        { speaker: "mystic", text: "Thank you both. I'm happy to share my passion with you." }
      ]
    },
  ],
  expansion6: [
    {
      id: "fluzzer_joins",
      title: "Fluzzer's First Lunch",
      characters: ["peachy", "soap", "mystic", "fluzzer"],
      dialogue: [
        { speaker: "soap", text: "Everyone, this is Fluzzer! They just joined our facility." },
        { speaker: "fluzzer", text: "Hello everyone! I'm so excited to be here!" },
        { speaker: "peachy", text: "Welcome, Fluzzer! We're glad to have you join us." },
        { speaker: "mystic", text: "Greetings, pink one, your energy is quite... unique." },
        { speaker: "fluzzer", text: "Is that good? I hope that's good!" },
        { speaker: "soap", text: "Of course it's good! Mystic just means you're special, I think." },
        { speaker: "peachy", text: "So, what brings you to our facility, Fluzzer?" },
        { speaker: "fluzzer", text: "The swa elites invited me to work in this terrarium. And I can't wait to get started!" },
        { speaker: "mystic", text: "Uhh? We have a terrarium now?" },
        { speaker: "peachy", text: "Yeah, the last facility expansion included a new terrarium." },
        { speaker: "soap", text: "You'll fit right in Fluzzer! But be prepared for the power outages hehe." },
        { speaker: "fluzzer", text: "I'm really excited to help out and learn more. Wait power outages?" },
        { speaker: "peachy", text: "Yeah don't worry about that, its just soap's shenanigans." },
        { speaker: "mystic", text: "More like Soap not doing their job properly." },
        { speaker: "soap", text: "HEY! Without me this entire facility would plunge in darkness!" },
        { speaker: "peachy", text: "I guess that's true." },
        { speaker: "fluzzer", text: "Thanks for the warm welcome, everyone!" },
        { speaker: "mystic", text: "Welcome to the team, Fluzzer. May your roots grow deep here." },
        { speaker: "fluzzer", text: "Thanks, Mystic! I'll do my best!" }
      ]
    },
    {
      id: "Fluzzer_background",
      title: "Fluzzer's Background",
      characters: ["peachy", "soap", "mystic", "fluzzer"],
      dialogue: [
        { speaker: "peachy", text: "Fluzzer, where did you come from before joining us?" },
        { speaker: "fluzzer", text: "Oh! I grew up in the Verdant Valley, It's a beautiful place close to the water continent's grand tree." },
        { speaker: "soap", text: "Verdant Valley? That sounds beautiful. Is that where you learned all your botany skills and knowledge?" },
        { speaker: "fluzzer", text: "Yes! I studied plants extensively, I spent most of my life studying plants and helping in the valley's gardens." },
        { speaker: "mystic", text: "No wonder the swa elites invited you. The terrarium needs someone with your background." },
        { speaker: "fluzzer", text: "I'm honored they noticed me. I hope I can help the facility grow even more." },
        { speaker: "peachy", text: "We're lucky to have you! Your knowledge will make our progress smoother." },
        { speaker: "soap", text: "And your enthusiasm is contagious. I went in the terrarium earlier and the plants seem happier too!" },
        { speaker: "fluzzer", text: "Thank you! I can't wait to share more ideas and learn from all of you." },
        { speaker: "mystic", text: "Harmony comes from blending our strengths. Welcome to the crew, Fluzzer." },
        { speaker: "fluzzer", text: "I'm excited to be part of this team. Let's make the facility thrive together!" }
      ]
    },
    {
      id: "bathroom_warning_for_fluzzer",
      title: "Bathroom Warning for Fluzzer",
      characters: ["peachy", "soap", "mystic", "fluzzer"],
      dialogue: [
        { speaker: "peachy", text: "Fluzzer, before you get too comfortable here, there's something you should know." },
        { speaker: "soap", text: "Yeah, whatever you do, do NOT enter the bathrooms at 3:33 AM." },
        { speaker: "fluzzer", text: "Why? What's so special about that time?" },
        { speaker: "mystic", text: "Omg not this again..." },
        { speaker: "peachy", text: "Fluzzer, 3 AM is the witching hour, when the barrier between worlds is weakest, strange things will happen." },
        { speaker: "fluzzer", text: "And that happens specifically in the bathrooms?" },
        { speaker: "peachy", text: "Trust us, it's not worth the risk. Even Soap got spooked once." },
        { speaker: "soap", text: "I did! I saw my reflection winked at me. Never again." },
        { speaker: "mystic", text: "Fluzzer don't worry about it, it's just a silly rumor." },
        { speaker: "fluzzer", text: "But what if it's true? I don't wanna see my reflection wink at me, that's terrifying!" },
        { speaker: "peachy", text: "Not just terrifying, it's downright horrific!" },
        { speaker: "soap", text: "Even worse, legends say you can spot a hand inside the toilet." },
        { speaker: "mystic", text: "OMG SOAP SHUSH! YOU'LL GIVE FLUZZER NIGHTMARES!" },
        { speaker: "fluzzer", text: "I think I'll just hold it until morning..." },
        { speaker: "soap", text: "hehe..." },
      ]
    },
    {
      id: "rikkor_species_lore",
      title: "Rikkor Species and Origins",
      characters: ["peachy", "soap", "mystic", "fluzzer"],
      dialogue: [
        { speaker: "peachy", text: "Have you ever thought about how diverse our crew is? We're all rikkors, but from different sub-species and continents." },
        { speaker: "soap", text: "Right! Peachy, you're a swaria, aren't you?" },
        { speaker: "peachy", text: "Yep! Us Swarias are born from the floating and the water continent's grand tree. Me specificaly I was born in the floating continent. It's way up in the clouds." },
        { speaker: "mystic", text: "The floating continent... That's a name I've not heard of in a long time..." },
        { speaker: "mystic", text: "And I'm a Rikkoru. And I come from the purple archipelago's grand tree, surrounded by endless islands." },
        { speaker: "soap", text: "I was born in the electricity continent. The grand tree... Or grand cactus there grows in the middle of the desert, surrounded by endless desert hills." },
        { speaker: "fluzzer", text: "I'm a finea! I'm from the water continent, just like vi, I think. I lived in the Verdant Valley, close to the grand tree's roots." },
        { speaker: "peachy", text: "It's amazing how the grand trees shape each continent and give rise to different rikkor sub-species." },
        { speaker: "mystic", text: "Each tree has its own traditions and ways of nurturing us. That's why we're all so unique." },
        { speaker: "soap", text: "But no matter where we're born, we all ended up here, working together." },
        { speaker: "fluzzer", text: "I love learning about everyone's origins. It makes our team feel even more special!" },
        { speaker: "peachy", text: "We're proof that rikkors from every continent can work in harmony." },
      ]
    },
  ],
  expansion8:[
    {
      id: "prism_lab_lights",
      title: "Prism lab and Lights",
      characters: ["peachy", "vi"],
      dialogue: [
        { speaker: "vi", text: "So, Peachy, how's the prism lab?" },
        { speaker: "peachy", text: "It's amazing and way too colorful!" },
        { speaker: "vi", text: "Yeah I've noticed how you act around the lights, Peachy. For once we can have a normal conversation without you acting drunk." },
        { speaker: "peachy", text: "Its crazy! How are you not affected?" },
        { speaker: "vi", text: "Simple, I'm just built different." },
        { speaker: "peachy", text: "That's not fair!" },
        { speaker: "vi", text: "Well you're not the only one who gets affected by the lights, Soap also acts drunk when they're in the lab." },
        { speaker: "peachy", text: "Really? Soap actually wanders around the facility? And they have access to the prism lab?" },
        { speaker: "vi", text: "Yeah, I let them enter. And that also causes power outages since the power can't go out without being checked every 5 minutes." },
        { speaker: "peachy", text: "Oh... So that's why the power randomly goes out... I thought they were just caught up in their soap collection and forgot to check on the power." },
        { speaker: "vi", text: "Oh that's also one of the main causes for the power outages." },
        { speaker: "peachy", text: "Damn..." },
      ]
    },
    {
      id: "vi_questions_peachy",
      title: "Why Peachy Works Here",
      characters: ["peachy", "vi"],
      dialogue: [
        { speaker: "vi", text: "Peachy, I've always wondered—why do you work here in the facility?" },
        { speaker: "peachy", text: "Oh, that's easy. The swa elites gave me this project for my university class. I have to discover everything about the swaria table of swalements." },
        { speaker: "vi", text: "A project? So you're not here by choice?" },
        { speaker: "peachy", text: "Well, I chose to accept it. It's a big opportunity, even if it's a little weird sometimes." },
        { speaker: "vi", text: "And the swaria table of swalements?" },
        { speaker: "peachy", text: "I have to study its properties, how it interacts with the environment, and its potential uses." },
        { speaker: "vi", text: "That sounds... intense. Do you regret it?" },
        { speaker: "peachy", text: "Not really! I get to meet everyone in this facility, eat snacks, and learn a lot. It's more fun than regular classes. But it is a lot to take in..." },
        { speaker: "vi", text: "Just don't let the 'swalements' fry your brain before you finish your report." },
        { speaker: "peachy", text: "No promises, but I'll try!" },
      ]
    },
    {
      id: "weird_shards",
      title: "Weird Shards",
      characters: ["peachy", "vi", "mystic"],
      dialogue: [
        { speaker: "vi", text: "Mystic, what are those weird shards you keep in your pouch? They look... kind of creepy." },
        { speaker: "mystic", text: "Uh... those? They're just... research samples. Corruption shards. From failed experiments in the upper labs." },
        { speaker: "peachy", text: "Failed experiments? Should you really be carrying those around?" },
        { speaker: "mystic", text: "I mean... they're mostly inert now. I study them to understand how corruption spreads. It's risky, but knowledge is worth it." },
        { speaker: "vi", text: "You look nervous, Mystic. Are you hiding something?" },
        { speaker: "mystic", text: "No! I mean—no, it's just... they're unpredictable sometimes. I have to be careful." },
        { speaker: "vi", text: "What do you even do with them?" },
        { speaker: "mystic", text: "At night, I go to the observatory and watch how they react to starlight. Sometimes they pulse, sometimes they just sit there." },
        { speaker: "peachy", text: "You go to the observatory every night?" },
        { speaker: "mystic", text: "Yes. It's peaceful there, and I can observe things without interruption. The facility is different at night—quiet." },
        { speaker: "vi", text: "Aren't you scared being alone with those shards?" },
        { speaker: "mystic", text: "A little. But curiosity always wins. Besides, the observatory has the best view of the stars." },
        { speaker: "peachy", text: "I'd love to see the observatory at night. Maybe you could show us sometime?" },
        { speaker: "mystic", text: "... Not now." },
        { speaker: "vi", text: "Why not?" },
        { speaker: "mystic", text: "Vi shush, you're always asleep at night." },
        { speaker: "vi", text: "WHAT!?" },
        { speaker: "peachy", text: "What about me, I never sleep!" },
        { speaker: "mystic", text: "Peachy... Maybe later, but not now." },
      ]
    },
    {
      id: "ingredient_gathering",
      title: "Peachy's Ingredient Delivery",
      characters: ["peachy", "mystic", "vi"],
      dialogue: [
        { speaker: "peachy", text: "Mystic! I brought you a fresh batch of ingredients for today's lunch." },
        { speaker: "mystic", text: "Let me see... berries, mushrooms, sparks, petals, water... Prisma stone? Stardust?" },
        { speaker: "mystic", text: "Peachy, are you sure these are all edible? Prisma stone is a mineral, and stardust is... well, cosmic dust." },
        { speaker: "vi", text: "HEY! these Prisma stones are mine!" },
        { speaker: "peachy", text: "I thought they might add something special! You always say cooking is about creativity." },
        { speaker: "vi", text: "Are you sure it's safe to eat stardust?" },
        { speaker: "mystic", text: "With the right recipe, anything can be delicious. But I might need to consult the ancient cookbooks for these." },
        { speaker: "peachy", text: "I trust you, Mystic! You always make something amazing." },
        { speaker: "mystic", text: "Thank you, Peachy. These ingredients will inspire a truly unique dish. But next time, maybe skip the rocks and space dust." },
        { speaker: "vi", text: "Just don't blow up the kitchen again." },
        { speaker: "mystic", text: "No promises! Cooking with sparks and stardust is always an adventure." },
        { speaker: "peachy", text: "I can't wait to taste it!" },
      ]
    },
  ],
};
let cafeteriaState = {
  isMealTime: false,
  currentScenario: null,
  currentDialogueIndex: 0,
  activeCharacters: [],
  scenarioStartTime: null,
  dialogueFinished: false
};
let characterLocations = {
  peachy: "main",
  soap: "main", 
  mystic: "main",
  fluzzer: "main",
  vi: "main"
};

function initCafeteria() {
  setInterval(checkMealTime, 60000);
  checkMealTime();
  setInterval(checkMealTime, 10000);
}

function checkMealTime() {
  if (!window.daynight) {
    return;
  }
  const currentTime = window.daynight.getTime();
  const currentHour = Math.floor(currentTime / 60);
  const currentMinute = currentTime % 60;
  const timeInMinutes = currentHour * 60 + currentMinute;
  const isLunchTime = timeInMinutes >= 720 && timeInMinutes < 810;
  const isDinnerTime = timeInMinutes >= 1080 && timeInMinutes < 1170;
  const isMealTime = isLunchTime || isDinnerTime;
  const mealType = isLunchTime ? 'lunch' : isDinnerTime ? 'dinner' : 'none';
  if ((timeInMinutes >= 715 && timeInMinutes <= 815) || (timeInMinutes >= 1075 && timeInMinutes <= 1175)) {
  }
  if (isMealTime && !cafeteriaState.isMealTime) {
    startMealTime();
  } else if (!isMealTime && cafeteriaState.isMealTime) {
    endMealTime();
  } else if (isMealTime && cafeteriaState.isMealTime) {
  }
  if (((timeInMinutes >= 810 && timeInMinutes < 1080) || timeInMinutes >= 1170) && cafeteriaState.isMealTime) {
    const currentPage = document.querySelector('.page.active');
    const dialogueContainer = document.getElementById('cafeteriaDialogue');
    if ((currentPage && currentPage.id !== 'cafeteria') || (!dialogueContainer && !cafeteriaState.currentScenario)) {
      endMealTime();
    } else {
    }
  }
}

function startMealTime() {
  if (typeof cafeteriaScenarios !== 'undefined') {
  }
  cafeteriaState.isMealTime = true;
  cafeteriaState.scenarioStartTime = Date.now();
  const expansionLevel = state.grade || 1;
  let availableScenarios = [];
  if (expansionLevel >= 8) {
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || [],
      ...cafeteriaScenarios.expansion6 || [],
      ...cafeteriaScenarios.expansion8 || []
    ];
  } else if (expansionLevel >= 6) {
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || [],
      ...cafeteriaScenarios.expansion6 || []
    ];
  } else if (expansionLevel >= 3) {
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || []
    ];
  } else if (expansionLevel >= 2) {
    availableScenarios = cafeteriaScenarios.expansion2 || [];
  } else {
  }
  if (availableScenarios.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    cafeteriaState.currentScenario = availableScenarios[randomIndex];
    cafeteriaState.currentDialogueIndex = 0;
    cafeteriaState.activeCharacters = [...cafeteriaState.currentScenario.characters];
    cafeteriaState.dialogueFinished = false;
    cafeteriaState.activeCharacters.forEach(character => {
      characterLocations[character] = "cafeteria";
    });
  } else {
    cafeteriaState.isMealTime = false;
  }
}

function endMealTime() {
  cafeteriaState.isMealTime = false;
  cafeteriaState.currentScenario = null;
  cafeteriaState.currentDialogueIndex = 0;
  cafeteriaState.activeCharacters = [];
  cafeteriaState.dialogueFinished = false;
  Object.keys(characterLocations).forEach(character => {
    characterLocations[character] = "main";
  });
  hideCafeteriaDialogue();
}

function showCafeteriaDialogue() {
  if (!cafeteriaState.isMealTime || !cafeteriaState.currentScenario) {
    return;
  }
  const cafeteriaMain = document.getElementById('cafeteriaMainSubTab');
  if (!cafeteriaMain) return;
  const oldDlg = document.getElementById('cafeteriaDialogue');
  if (oldDlg) {
    oldDlg.remove();
  }
  const mainContainer = document.createElement('div');
  mainContainer.id = 'cafeteriaDialogue';
  mainContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    pointer-events: none;
  `;
  const dialogueArea = document.createElement('div');
  dialogueArea.id = 'dialogueArea';
  dialogueArea.style.cssText = `
    position: absolute;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: 10px;
    padding: 1rem;
    min-width: 200px;
    z-index: 1002;
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  `;
  const continueBtn = document.createElement('button');
  continueBtn.id = 'continueDialogueBtn';
  if (cafeteriaState.dialogueFinished) {
    continueBtn.textContent = 'Close';
  } else {
    continueBtn.textContent = 'Continue';
  }
  continueBtn.style.cssText = `
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  continueBtn.onclick = advanceDialogue;
  dialogueArea.appendChild(continueBtn);
  mainContainer.appendChild(dialogueArea);
  cafeteriaMain.appendChild(mainContainer);
  createCharacterCards();
  if (cafeteriaState.dialogueFinished) {
    showDialogueFinishedMessage();
  } else {
    showCurrentDialogue();
  }
}

function hideCafeteriaDialogue() {
  const dialogueContainer = document.getElementById('cafeteriaDialogue');
  if (dialogueContainer) {
    dialogueContainer.remove();
  }
}

function createCharacterCards() {
  const mainContainer = document.getElementById('cafeteriaDialogue');
  if (!mainContainer || !cafeteriaState.currentScenario) {
    return;
  }
  const existingCards = mainContainer.querySelectorAll('[id^="character-"]');
  existingCards.forEach(card => {
    card.remove();
  });
  const positions = [
    { top: '80px',  left: '250px' },   
    { top: '-140px',  left: 'calc(100% - 470px)' }, 
    { bottom: '150px', left: '250px' },  
    { bottom: '370px', left: 'calc(100% - 470px)' } 
  ];
  cafeteriaState.activeCharacters.forEach((character, index) => {
    if (index >= positions.length) {
      return;
    }
    const characterCard = document.createElement('div');
    characterCard.id = `character-${character}`;
    characterCard.className = 'card swaria-character-box';
    characterCard.style.cssText = `
      position: absolute !important;
      ${positions[index].top ? `top: ${positions[index].top} !important;` : ''}
      ${positions[index].bottom ? `bottom: ${positions[index].bottom} !important;` : ''}
      ${positions[index].left ? `left: ${positions[index].left} !important;` : ''}
      ${positions[index].right ? `right: ${positions[index].right} !important;` : ''}
      width: 220px !important;
      height: 220px !important;
      padding: 0.75rem !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 1001 !important;
      pointer-events: auto !important; 
      background: var(--card-bg) !important;
      border: 2px solid var(--card-border) !important;
      border-radius: var(--radius) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
      aspect-ratio: 1 / 1 !important;
      min-width: 220px !important;
      max-width: 220px !important;
      min-height: 220px !important;
      max-height: 220px !important;
    `;
    const characterImg = document.createElement('img');
    characterImg.src = getCharacterImage(character);
    characterImg.alt = getCharacterDisplayName(character);
    characterImg.className = 'character-image';
    characterImg.style.cssText = `
      width: 160px;
      height: 160px;
      object-fit: cover;
      border-radius: 12px;
    `;
    const speakingImg = document.createElement('img');
    speakingImg.src = getCharacterSpeakingImage(character);
    speakingImg.alt = getCharacterDisplayName(character) + ' speaking';
    speakingImg.className = 'character-image speaking';
    speakingImg.style.cssText = `
      width: 160px;
      height: 160px;
      object-fit: cover;
      border-radius: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none; 
    `;
    if (character === 'soap' || character === 'fluzzer' || character === 'vi') {
      characterImg.style.transform = 'scaleX(-1)';
      speakingImg.style.transform = 'translate(-50%, -50%) scaleX(-1)';
    }
    speakingImg.onerror = function() {
      this.style.display = 'none';
    };
    characterImg.onerror = function() {
      this.style.display = 'none';
    };
    characterImg.onload = function() {
    };
    speakingImg.onload = function() {
    };
    characterCard.style.position = 'relative'; 
    characterCard.appendChild(characterImg);
    characterCard.appendChild(speakingImg);
    mainContainer.appendChild(characterCard);
  });
}

function showCurrentDialogue() {
  if (!cafeteriaState.currentScenario) {
    return;
  }
  const currentDialogue = cafeteriaState.currentScenario.dialogue[cafeteriaState.currentDialogueIndex];
  if (!currentDialogue) {
    return;
  }
  updateCharacterForDialogue(currentDialogue.speaker);
  highlightTalkingCharacter(currentDialogue.speaker);
}

function showDialogueFinishedMessage() {
  const dialogueArea = document.getElementById('dialogueArea');
  if (dialogueArea) {
    const continueBtn = dialogueArea.querySelector('#continueDialogueBtn');
    dialogueArea.innerHTML = '';
    const finishedMessage = document.createElement('div');
    finishedMessage.textContent = "The characters continue their conversation...";
    finishedMessage.style.cssText = `
      text-align: center;
      color: var(--text-color);
      font-style: italic;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    `;
    dialogueArea.appendChild(finishedMessage);
    if (continueBtn) {
      continueBtn.textContent = 'Close';
      dialogueArea.appendChild(continueBtn);
    }
  }
  cafeteriaState.activeCharacters.forEach(character => {
    const characterCard = document.getElementById(`character-${character}`);
    if (characterCard) {
      const speechBubble = characterCard.querySelector('.cafeteria-speech');
      if (speechBubble) speechBubble.remove();
      const normalImg = characterCard.querySelector('img.character-image:not(.speaking)');
      const speakingImg = characterCard.querySelector('img.character-image.speaking');
      if (normalImg) normalImg.style.display = 'block';
      if (speakingImg) speakingImg.style.display = 'none';
    }
  });
  document.querySelectorAll('.swaria-character-box').forEach(card => {
    card.style.border = '2px solid var(--card-border)';
    card.style.transform = 'scale(1)';
    card.style.boxShadow = 'none';
  });
}

function setCharacterCardImage(characterCard, src) {
  if (!characterCard) return;
  const imgEl = characterCard.querySelector('.character-image') || characterCard.querySelector('img');
  if (imgEl) {
    const cacheBustedSrc = `${src}?v=${Date.now()}`;
    imgEl.src = cacheBustedSrc;
  }
}

function updateCharacterForDialogue(speaker) {
  cafeteriaState.activeCharacters.forEach(character => {
    const characterCard = document.getElementById(`character-${character}`);
    if (characterCard) {
      const existingSpeech = characterCard.querySelector('.cafeteria-speech');
      if (existingSpeech) existingSpeech.remove();
      const normalImg = characterCard.querySelector('img.character-image:not(.speaking)');
      const speakingImg = characterCard.querySelector('img.character-image.speaking');
      if (normalImg) normalImg.style.display = 'block';
      if (speakingImg) speakingImg.style.display = 'none';
    }
  });
  const speakerCard = document.getElementById(`character-${speaker}`);
  if (speakerCard) {
    const normalImg = speakerCard.querySelector('img.character-image:not(.speaking)');
    const speakingImg = speakerCard.querySelector('img.character-image.speaking');
    if (normalImg) normalImg.style.display = 'none';
    if (speakingImg) speakingImg.style.display = 'block';
    const speechBubble = document.createElement('div');
    speechBubble.className = 'cafeteria-speech';
    const isLeftSide = speaker === 'soap' || speaker === 'fluzzer' || speaker === 'vi';
    speechBubble.style.cssText = `
      position: absolute;
      ${isLeftSide ? 'right: 100%;' : 'left: 100%;'}
      top: 50%;
      transform: translateY(-50%) ${isLeftSide ? 'translateX(-18px)' : 'translateX(18px)'};
      background: white;
      color: #111;
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-size: 1.2rem;
      max-width: 260px;
      z-index: 2000;
      font-weight: bold;
    `;
    speechBubble.textContent = cafeteriaState.currentScenario.dialogue[cafeteriaState.currentDialogueIndex].text;
    speakerCard.appendChild(speechBubble);
  } else {
  }
}

function advanceDialogue() {
  if (!cafeteriaState.currentScenario) {
    return;
  }
  if (cafeteriaState.dialogueFinished) {
    hideCafeteriaDialogue();
    return;
  }
  cafeteriaState.currentDialogueIndex++;
  if (cafeteriaState.currentDialogueIndex >= cafeteriaState.currentScenario.dialogue.length) {
    cafeteriaState.dialogueFinished = true;
    showDialogueFinishedMessage();
    cafeteriaState.activeCharacters.forEach(character => {
      const friendshipCharacter = character.toLowerCase() === 'peachy' ? 'swaria' : character.toLowerCase();
      if (window.friendship && typeof window.friendship.getPoints === 'function' && typeof window.friendship.addPoints === 'function') {
        const currentPoints = window.friendship.getPoints(friendshipCharacter) || 0;
        const bonus = Math.ceil(currentPoints * 0.05); 
        if (bonus > 0) {
          window.friendship.addPoints(friendshipCharacter, bonus);
        }
      } else {
      }
    });
  } else {
    showCurrentDialogue();
  }
}

function getCharacterDisplayName(character) {
  const names = {
    peachy: 'Peachy',
    soap: 'Soap',
    mystic: 'Mystic',
    fluzzer: 'Fluzzer'
  };
  return names[character] || character;
}

function getCharacterImage(character) {
  if (character === 'peachy' && window.premiumState && window.premiumState.bijouEnabled) {
    return 'assets/icons/peachy and bijou.png';
  }
  const images = {
    peachy: 'swa normal.png',
    soap: 'assets/icons/soap.png',
    mystic: 'assets/icons/chef mystic.png',
    fluzzer: 'assets/icons/fluzzer.png',
    vi: 'assets/icons/light.png'
  };
  const imagePath = images[character] || 'assets/icons/wip.png';
  return imagePath;
}

function getCharacterSpeakingImage(character) {
  if (character === 'peachy' && window.premiumState && window.premiumState.bijouEnabled) {
    return 'assets/icons/peachy and bijou talking.png';
  }
  const speakingImages = {
    peachy: 'swa talking.png',
    soap: 'assets/icons/soap speech.png',
    mystic: 'assets/icons/chef mystic speech.png',
    fluzzer: 'assets/icons/fluzzer talking.png',
    vi: 'assets/icons/light.png'
  };
  const imagePath = speakingImages[character] || getCharacterImage(character);
  return imagePath;
}

function getCharacterColor(character) {
  const colors = {
    peachy: '#FF6B6B',
    soap: '#4ECDC4',
    mystic: '#9B59B6',
    fluzzer: '#F39C12'
  };
  return colors[character] || '#666';
}

function highlightTalkingCharacter(speaker) {
  document.querySelectorAll('.swaria-character-box').forEach(card => {
    card.style.border = '2px solid var(--card-border)';
    card.style.transform = 'scale(1)';
    card.style.boxShadow = 'none';
  });
  const talkingCard = document.getElementById(`character-${speaker}`);
  if (talkingCard) {
    talkingCard.style.border = `3px solid ${getCharacterColor(speaker)}`;
    talkingCard.style.transform = 'scale(1.05)';
    talkingCard.style.boxShadow = `0 4px 8px rgba(0,0,0,0.2)`;
  }
}

function getCharacterLocation(character) {
  return characterLocations[character] || "main";
}

function isCharacterInCafeteria(character) {
  return characterLocations[character] === "cafeteria";
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCafeteria);
} else {
  initCafeteria();
}
window.cafeteria = {

  showDialogue: function() {
    showCafeteriaDialogue();
  },

  hideDialogue: hideCafeteriaDialogue,
  getCharacterLocation: getCharacterLocation,
  isCharacterInCafeteria: isCharacterInCafeteria,

  isLunchTime: function() {
    return cafeteriaState.isMealTime;
  },

  onTabLeave: () => {
    hideCafeteriaDialogue();
  },

  refreshCharacterCards: function() {
    if (cafeteriaState.currentScenario) {
      createCharacterCards();
    }
  }

};
window.testCafeteriaTime = function(timeString) {
  if (!window.daynight || typeof window.daynight.setTime !== 'function') {
    return;
  }
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;
  window.daynight.setTime(timeInMinutes);
  setTimeout(() => {
    checkMealTime();
  }, 100);
};
