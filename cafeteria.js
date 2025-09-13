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
        { speaker: "peachy", text: "I'm already working on a reversible override. Next lunch, I'll show you the prototype." },
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
        { speaker: "peachy", text: "You're on. This is going to be legendary." }
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
        { speaker: "soap", text: "Honestly, yeah. I thought the water continent would be all lakes and rivers, but there's so much land. And the mountains!" },
        { speaker: "peachy", text: "I keep staring at that giant tree. It feels like it's watching over everything." },
        { speaker: "soap", text: "You mean the continent tree? I heard its roots go under every city. That's kind of spooky." },
        { speaker: "peachy", text: "Spooky, but also comforting. Like, if you get lost, you just follow a root and you'll end up somewhere interesting." },
        { speaker: "soap", text: "I wish I could climb it. Imagine the view from the top!" },
        { speaker: "peachy", text: "We'd probably see all the valleys and maybe even the moonfish in the lakes." },
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
    {
      id: "tico_introduction",
      title: "Meet Tico",
      characters: ["peachy", "soap", "tico"],
      dialogue: [
        { speaker: "peachy", text: "Everyone, I'd like you to meet Tico! They're our new front desk manager." },
        { speaker: "tico", text: "Hello everyone! I'm so excited to be working with such a professional team!" },
        { speaker: "soap", text: "Welcome, Tico! What exactly does a front desk manager do?" },
        { speaker: "tico", text: "I help coordinate worker arrivals and departures, manage job assignments, and keep everything organized!" },
        { speaker: "peachy", text: "Tico is really good at their job. They've already improved our worker efficiency!" },
        { speaker: "tico", text: "Thank you, Peachy! I love helping workers find the right positions for their skills." },
        { speaker: "soap", text: "That sounds really useful. Our facility keeps growing, so we need better organization." },
        { speaker: "tico", text: "Exactly! Every worker deserves to be in a role where they can thrive and contribute their best." },
        { speaker: "peachy", text: "Tico also has this amazing ability to spot talented workers from far away!" },
        { speaker: "tico", text: "It's all about understanding what makes each worker special. Experience teaches you to see potential!" },
        { speaker: "soap", text: "I'm looking forward to working with you, Tico. Welcome to the team!" },
        { speaker: "tico", text: "Thank you! I can't wait to help make this facility even better!" }
      ]
    },
    {
      id: "tico_military_background",
      title: "Tico's Military Past",
      characters: ["peachy", "soap", "tico"],
      dialogue: [
        { speaker: "peachy", text: "Tico, you're incredibly good at organizing things. Did you always work in management?" },
        { speaker: "tico", text: "Actually, no! Before this, I was a military scout in the Continental Defense Force." },
        { speaker: "soap", text: "Wait, you were in the military? That explains your perfect posture!" },
        { speaker: "tico", text: "Haha, old habits die hard! I spent years scouting different continents for threats and resource opportunities." },
        { speaker: "peachy", text: "That sounds dangerous! Why did you switch to front desk management?" },
        { speaker: "tico", text: "Well, after scouting for so long, I realized I loved helping people find their perfect fit—whether it's a safe route or the right job!" },
        { speaker: "soap", text: "So you went from scouting enemies to scouting talent?" },
        { speaker: "tico", text: "Exactly! Instead of identifying threats, I identify potential. Much more rewarding!" },
        { speaker: "peachy", text: "Do you miss the adventure of scouting?" },
        { speaker: "tico", text: "Sometimes, but every day here brings new challenges. Like figuring out why Soap keeps causing power outages!" },
        { speaker: "soap", text: "Hey! That's not my fault... most of the time." },
        { speaker: "tico", text: "Don't worry, Soap. In the military, we had a saying: 'Chaos is just order we haven't figured out yet.'" },
        { speaker: "peachy", text: "I like that philosophy!" }
      ]
    },
    {
      id: "tico_lunch_organization",
      title: "Lunch Organization",
      characters: ["peachy", "soap", "tico"],
      dialogue: [
        { speaker: "tico", text: "I've been observing our lunch patterns and noticed we could improve efficiency." },
        { speaker: "soap", text: "Tico, it's just lunch. Why do you have notes?" },
        { speaker: "tico", text: "Well, I like to keep track of things! I noticed Peachy tends to arrive a few minutes late each day." },
        { speaker: "peachy", text: "How did you even notice that?" },
        { speaker: "tico", text: "I pay attention to details! I also noticed Soap takes quite a while to decide what to eat." },
        { speaker: "soap", text: "I like to consider my options!" },
        { speaker: "tico", text: "And that's perfectly fine! I just thought if we organized things a bit better, we could all enjoy longer lunch breaks." },
        { speaker: "peachy", text: "That's actually thoughtful of you." },
        { speaker: "tico", text: "I made some simple suggestions - maybe designated seating so we don't waste time finding spots?" },
        { speaker: "soap", text: "What if we just... eat when we're hungry?" },
        { speaker: "tico", text: "That works too! I just remember at my old job, poor organization led to really long lunch lines." },
        { speaker: "peachy", text: "How long?" },
        { speaker: "tico", text: "Sometimes people waited an hour just to get food. I'd rather prevent that here!" },
        { speaker: "soap", text: "I appreciate you looking out for us." },
        { speaker: "tico", text: "Thanks! I just want everyone to have pleasant meal times." }
      ]
    },
    {
      id: "tico_safety_concerns",
      title: "Safety Concerns",
      characters: ["peachy", "soap", "tico"],
      dialogue: [
        { speaker: "tico", text: "Everyone, I wanted to discuss some safety procedures for the cafeteria." },
        { speaker: "peachy", text: "Safety procedures? What's wrong?" },
        { speaker: "tico", text: "Nothing's wrong! I just think we should know what to do in case of emergencies." },
        { speaker: "soap", text: "What kind of emergencies?" },
        { speaker: "tico", text: "Well, kitchen fires, equipment malfunctions, things like that. Basic workplace safety." },
        { speaker: "peachy", text: "That makes sense. What should we do?" },
        { speaker: "tico", text: "I've mapped out the nearest exits from each seating area. Nothing fancy, just good to know." },
        { speaker: "soap", text: "You mapped out exits?" },
        { speaker: "tico", text: "Old habit from my scouting days. I like knowing where the exits are." },
        { speaker: "peachy", text: "Actually, that's pretty smart." },
        { speaker: "tico", text: "I also noticed the fire extinguisher locations. We should all know where they are." },
        { speaker: "soap", text: "You're really thorough about this stuff." },
        { speaker: "tico", text: "Better to be prepared and not need it than the other way around!" },
        { speaker: "peachy", text: "Thanks for looking out for everyone's safety, Tico." },
        { speaker: "tico", text: "Of course! I want everyone to feel secure while they eat." }
      ]
    },
    {
      id: "tico_bathroom_curiosity",
      title: "Bathroom Curiosity",
      characters: ["peachy", "soap", "tico"],
      dialogue: [
        { speaker: "tico", text: "I've been hearing those rumors about the bathroom at 3:33 AM." },
        { speaker: "peachy", text: "Oh no, not you too! Don't tell me you want to investigate!" },
        { speaker: "soap", text: "Tico, trust us, you don't want to go there at that time." },
        { speaker: "tico", text: "I'm curious about it, honestly. My scouting background makes me want to check things out." },
        { speaker: "peachy", text: "Tico, it's just scary bathroom rumors!" },
        { speaker: "tico", text: "But what if there's actually something going on? Maybe a plumbing issue or something?" },
        { speaker: "soap", text: "You really think it's just plumbing?" },
        { speaker: "tico", text: "Well, strange noises could be pipes, flickering lights could be electrical issues..." },
        { speaker: "peachy", text: "That's... actually a reasonable explanation." },
        { speaker: "tico", text: "I've dealt with facility maintenance before. Sometimes what seems supernatural is just poor upkeep." },
        { speaker: "soap", text: "So you'd investigate as a maintenance check?" },
        { speaker: "tico", text: "Exactly! If there are real issues, we should report them to facilities management." },
        { speaker: "peachy", text: "Just... be careful if you actually go through with this." },
        { speaker: "tico", text: "Don't worry! I'll just take a quick look and bring a flashlight." },
        { speaker: "soap", text: "That's much more reasonable than I expected from you." }
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
        { speaker: "mystic", text: "An accident? This is chaos! Where's the lamb sauce?" },
        { speaker: "peachy", text: "We don't have lamb sauce, but we have berry plates?" },
        { speaker: "mystic", text: "Berry plates? This isn't a dessert! Soap, why is the oven on fire?" },
        { speaker: "soap", text: "I was trying to give sparks to the petals but it turned into charcoal." },
        { speaker: "mystic", text: "Charcoal? Are you trying to poison me?" },
        { speaker: "peachy", text: "No, Mystic! We just wanted to impress you." },
        { speaker: "mystic", text: "Impress me? I'm not impressed, I'm horrified!" },
        { speaker: "soap", text: "Should we call the fire department?" },
        { speaker: "mystic", text: "We don't have a fire department here!" },
        { speaker: "peachy", text: "Next time, we'll follow the recipe." },
        { speaker: "mystic", text: "Next time, you'll follow my orders! This kitchen needs a miracle." },
        { speaker: "soap", text: "Yes, Chef!" },
        { speaker: "peachy", text: "Yes, Chef!" },
        { speaker: "mystic", text: "Good. Now clean up this mess before I lose my mind!" }
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
        { speaker: "mystic", text: "Thank you, Soap. And thank you both for being willing taste-testers even when things go wrong!" },
        { speaker: "peachy", text: "We're always happy to help. Especially if dessert is involved." },
        { speaker: "mystic", text: "Dessert is the reward for brave souls!" },
        { speaker: "soap", text: "Can we help in the kitchen next time?" },
        { speaker: "mystic", text: "Uhh... Sure... Just don't be stupid and follow my lead." },
        { speaker: "peachy", text: "Then it's settled. Next lunch, we cook together!" },
        { speaker: "mystic", text: "I look forward to it (not)." }
      ]
    },
    {
      id: "tico_questions_ingredients",
      title: "Tico Questions Mystic's Ingredients",
      characters: ["peachy", "mystic", "tico"],
      dialogue: [
        { speaker: "tico", text: "Mystic, I've been observing your cooking process and I have some concerns about your ingredient choices." },
        { speaker: "mystic", text: "Here we go..." },
        { speaker: "peachy", text: "Oh no, Tico's in full inspection mode again." },
        { speaker: "tico", text: "Are those... batteries in your cooking pot? And sparks? Isn't that a safety hazard?" },
        { speaker: "mystic", text: "They're not regular batteries, they're battery tokens. And the sparks add flavor!" },
        { speaker: "tico", text: "But according to standard kitchen safety protocols, metal objects shouldn't be!" },
        { speaker: "mystic", text: "Look, Peachy told me to use these ingredients, okay? I'm just following their suggestions!" },
        { speaker: "peachy", text: "Hey! Don't blame me! I thought they might make the food more... interesting!" },
        { speaker: "tico", text: "Wait, so you're cooking with unregulated materials because Peachy suggested it?" },
        { speaker: "mystic", text: "They said it would be 'experimental cuisine'! How was I supposed to know Tico would turn it into a safety inspection!" },
        { speaker: "peachy", text: "Tico, maybe you should trust Mystic on this one... they know what they're doing!" },
        { speaker: "tico", text: "But what about cross-contamination? Mixing electrical components with organic materials, wait! Is that a PRISM SHA-" },
        { speaker: "mystic", text: "TICO! For the love of all that's holy, it's MAGIC cooking! The rules are different!" },
        { speaker: "tico", text: "I'm just trying to ensure workplace safety standards!" },
        { speaker: "mystic", text: "The only thing unsafe here is my patience level!" },
        { speaker: "peachy", text: "Maybe we should let Mystic cook in peace?" },
        { speaker: "tico", text: "Fine... but I'm making a note in my safety report." },
        { speaker: "mystic", text: "Of course you are..." }
      ]
    }
    
  ],
  expansion4: [
    {
      id: "lepre_introduction",
      title: "Meet Lepre",
      characters: ["peachy", "soap", "mystic", "lepre"],
      dialogue: [
        { speaker: "peachy", text: "Hey sweveryone, have you met the new shopkeeper yet?" },
        { speaker: "soap", text: "You mean Lepre? They seem... interesting." },
        { speaker: "mystic", text: "Huh? You meant that large living plush toy?" },
        { speaker: "lepre", text: "Hello everyone! Nice to meet you all!" },
        { speaker: "peachy", text: "Welcome Lepre!" },
        { speaker: "lepre", text: "Thx to Vivien, I've opened a boutique here!" },
        { speaker: "soap", text: "Vivien? You meant Vi?" },
        { speaker: "lepre", text: "Yes!" },
        { speaker: "mystic", text: "So that is Vi's full name huh..." },
        { speaker: "peachy", text: "But the Swa elites never mentioned about adding a boutique to the facility?" },
        { speaker: "lepre", text: "... Oh don't worry about it." },
        { speaker: "soap", text: "What do you mean?" },
        { speaker: "mystic", text: "I have a feeling you're not supposed to be here Lepre...Chaun." },
        { speaker: "lepre", text: "MY NAME'S NOT LEPRECHAUN!" },
        { speaker: "peachy", text: "Okay, okay! Calm down, Lepre." },
        { speaker: "soap", text: "Yeah, let's not call the plush toy by that name." },
        { speaker: "lepre", text: "I AM NOT JUST A PLUSH TOY!" },
        { speaker: "mystic", text: "Says the large plush toy." },
        { speaker: "peachy", text: "Come on, guys. Let's not make fun of Lepre." },
        { speaker: "soap", text: "Yeah, we should be nice to the new shopkeeper." },
        { speaker: "mystic", text: "Fine." },
        { speaker: "lepre", text: "Thank you purple friend!" },
        { speaker: "mystic", text: "^At least the plush toy didn't called me as mythic..." },
      ]
    },
    {
      id: "Vi_Unfortunate_Circumstances",
      title: "Vi Unfortunate Circumstances",
      characters: ["peachy", "soap", "mystic", "lepre"],
      dialogue: [
        { speaker: "lepre", text: "Why does Vivien never comes to the cafeteria?" },
        { speaker: "soap", text: "Now that you mention it, I don't think I've ever seen them here." },
        { speaker: "mystic", text: "Maybe they're just extremely antisocial." },
        { speaker: "peachy", text: "I know why Vi can't come here, it is quite an unfortunate but funny reason." },
        { speaker: "lepre", text: "Well do tell us Peachy, I'm curious!" },
        { speaker: "peachy", text: "Well, you see, Vi has a very special tail. They have a large prism attached to it, and it gets stuck in the laboratory doors." },
        { speaker: "soap", text: "Wait, really? That's why they never come here? They are stuck in their department???" },
        { speaker: "peachy", text: "Yeah! They told me that every time they try to enter, the prism gets jammed. And they are quite embarrassed about it." },
        { speaker: "lepre", text: "That's hilarious! Poor Vi!" },
        { speaker: "mystic", text: "I guess that explains why they always send us to get their food." },
        { speaker: "peachy", text: "Exactly! But the worst part of it is that it is only the door inside the laboratory they get stuck on because the Swa elites designed it to be extra narrow." },
        { speaker: "soap", text: "Maybe we should blow that door up, just like how you force hacked my generator room's doors." },
        { speaker: "lepre", text: "Wait what??? Peachy is a pro hacker???" },
        { speaker: "peachy", text: "Yep! I'm a pro hacker now! But seriously I think we should blow that door up so that Vi can leave the laboratory." },
        { speaker: "soap", text: "I have an idea! Let's get Mystic to cook a dynamite to blow the laboratory doors!" },
        { speaker: "mystic", text: "No! That is out of the question! I'm not gonna commit arson! We can find another way!" },
        { speaker: "lepre", text: "Maybe we could just... I don't know, ask the Swa elites to widen the door?" },
        { speaker: "peachy", text: "I already tried that but they said no." },
        { speaker: "soap", text: "Mhh... Maybe there might be a further swalement that could blow the door up. Just like the hackium swalement but for blowing stuff." },
        { speaker: "mystic", text: "I might be against the idea, but it could work if we purposely make it be an accident." },
        { speaker: "peachy", text: "GENIUS! The Swa elites will only think of us blowing the laboratory doors up as an accident!" },
      ]
    },
    {
      id: "lepre_jester_past",
      title: "Lepre's Jester Days",
      characters: ["peachy", "soap", "lepre"],
      dialogue: [
        { speaker: "soap", text: "Lepre, were you always a shopkeeper?" },
        { speaker: "lepre", text: "Oh no, my friend! I used to be a performer!" },
        { speaker: "peachy", text: "A performer? That explains your jester look!" },
        { speaker: "lepre", text: "I performed in courts across the many continents, bringing laughter to nobles and commoners alike!" },
        { speaker: "soap", text: "What made you switch to shopkeeping?" },
        { speaker: "lepre", text: "I never actually switched, I'm still a performer! I'm just here to help you guys out with tokens." },
        { speaker: "peachy", text: "So you opened a boutique here to help us?" },
        { speaker: "lepre", text: "Exactly! Vivien told me... to bring a little more joy to the facility." },
        { speaker: "soap", text: "Bringing Joy to the facility by opening a shop?" },
        { speaker: "lepre", text: "Uhh y-yeah!" },
        { speaker: "soap", text: "... Ah! I see!" },
        { speaker: "peachy", text: "I'm confused..." },
        { speaker: "lepre", text: "Don't worry Peachy, you'll get it!" }
      ]
    },
    {
      id: "lepre_meeting_Vi",
      title: "Lepre's Meeting with Vi",
      characters: ["peachy", "soap", "lepre"],
      dialogue: [
        { speaker: "soap", text: "Lepre, how did you first meet Vi?" },
        { speaker: "lepre", text: "Oh, well we met after a festival." },
        { speaker: "soap", text: "A festival? That sounds fun!" },
        { speaker: "lepre", text: "It was! I was performing in the floating continent." },
        { speaker: "peachy", text: "The floating continent!? Vi went up there!?" },
        { speaker: "lepre", text: "Well not exactly... We met in the water continent. I just don't really remember much about it." },
        { speaker: "lepre", text: "All I remember is that I was performing in the floating continent festival when suddenly the ground opened up..." },
        { speaker: "soap", text: "WHAT!?" },
        { speaker: "lepre", text: "And I later woke up in the water continent, in a forest, I couldn't move at all as some of my body was ripped apart." },
        { speaker: "lepre", text: "All I could see around me was my stuffing out on the dirt..." },
        { speaker: "peachy", text: "OMG..." },
        { speaker: "soap", text: "That's horrifying!" },
        { speaker: "lepre", text: "It was a traumatic experience, to say the least." },
        { speaker: "peachy", text: "The ground opened up..." },
        { speaker: "lepre", text: "And I fell into the depths below, landing in a world I didn't recognize." },
        { speaker: "lepre", text: "A while later of helplessly laying on the ground, I was found by Vivien." },
        { speaker: "lepre", text: "They helped me piece myself back together, both literally and figuratively." },
        { speaker: "soap", text: "So Vi saved you?" },
        { speaker: "lepre", text: "Yes, they did. And I owe them everything." },
        { speaker: "peachy", text: "That's a touching story, Lepre." },
        { speaker: "lepre", text: "Thank you, Peachy. Now I just want to bring joy to others, like Vi did for me." },
        { speaker: "soap", text: "And you're doing a great job at it!" },
        { speaker: "lepre", text: "Thank you! I'm glad to be here with all of you." }
      ]
    },
    {
      id: "lepre_token_selling",
      title: "Lepre's Way of Token Selling",
      characters: ["peachy", "mystic", "lepre"],
      dialogue: [
        { speaker: "mystic", text: "Lepre, how do you choose which tokens to sell each day?" },
        { speaker: "lepre", text: "Ah, excellent question! It's not just business, it's an art form!" },
        { speaker: "peachy", text: "An art form?" },
        { speaker: "lepre", text: "The art form of randomness!" },
        { speaker: "peachy", text: "Ah gambling. Got it." },
        { speaker: "mystic", text: "I guess that's one way to look at it." },
        { speaker: "lepre", text: "Yeah its like a game of chance! You never know what you'll get!" },
        { speaker: "peachy", text: "But what if there's a specific type of tokens we need?" },
        { speaker: "lepre", text: "Then you just have to hope the RNG gods smile upon you!" },
        { speaker: "mystic", text: "RNG gods?" },
        { speaker: "lepre", text: "Yes! The Random Number Generator gods! They control the fate of all token selections!" },
        { speaker: "peachy", text: "So you're saying we should just trust in luck?" },
        { speaker: "lepre", text: "Exactly! Embrace the chaos and let the tokens flow!" },
        { speaker: "mystic", text: "I think I prefer a more structured approach to my purchases." },
        { speaker: "lepre", text: "Structure is for those who fear the unknown! Live a little, Mystic!" },
        { speaker: "mystic", text: "Perhaps, but a little planning would not hurt anyone." },
        { speaker: "lepre", text: "Nahh that's boring! Let's embrace the chaos!" },
        { speaker: "peachy", text: "I like gambling!" },
        { speaker: "lepre", text: "YES! That's the spirit!" },
        { speaker: "mystic", text: "..." },
      ]
    },
    {
      id: "3:33_AM_Bathroom_Nightmares",
      title: "3:33 AM Bathroom Nightmares",
      characters: ["peachy", "soap", "lepre"],
      dialogue: [
        { speaker: "peachy", text: "Lepre, we must warn you about something" },
        { speaker: "soap", text: "Yeah, it's about the 3:33 AM bathroom experience." },
        { speaker: "lepre", text: "3:33 AM bathroom experience? What are you talking about?" },
        { speaker: "peachy", text: "Lepre, do not enter the bathroom at 3:33 AM." },
        { speaker: "lepre", text: "Why not?" },
        { speaker: "soap", text: "Trust us, you don't want to know." },
        { speaker: "peachy", text: "It gets scary in there." },
        { speaker: "lepre", text: "Now I'm intrigued. Plz do tell!" },
        { speaker: "soap", text: "Well, let's just say you might encounter some... unexpected surprises." },
        { speaker: "peachy", text: "And not the good kind." },
        { speaker: "lepre", text: "Now I'm even more curious!" },
        { speaker: "soap", text: "Lepre, me and Peachy once saw our reflection wink at us... IN THE BATHROOM!" },
        { speaker: "lepre", text: "WHAT?!" },
        { speaker: "peachy", text: "Yes!! Even worst we started HEARING SOMETHING MOVING INSIDE THE PIPES!!!" },
        { speaker: "soap", text: "SOMETHING IS LIVING IN THE BATHROOM PIPES!!" },
        { speaker: "lepre", text: "AAAAAAAAAHHH!!" },
        { speaker: "peachy", text: "THIS IS WHY IT IS FORBIDDEN TO ENTER THE BATHROOM AT 3:33 AM!" },
        { speaker: "soap", text: "Seriously, just don't do it." },
        { speaker: "lepre", text: "Pfft you really think I'm scared? I'm the amazing Lepre! The best performer in the continent! I'm not scared of a little bathroom adventure!" },
        { speaker: "peachy", text: "L-lepre... nooo, its dangerous..." },
        { speaker: "soap", text: "Yeah, we really mean it." },
        { speaker: "lepre", text: "Pfft, don't worry about me! I've encountered worse things! Even if there is something living in the pipes, I can just use a little bit of magic to defend myself!" },
        { speaker: "lepre", text: "Just you wait! I'll will explore the bathroom at 3:33 AM this night!" },
        { speaker: "peachy", text: "We'll be here to support you... from a distance." },
        { speaker: "soap", text: "Yeah, good luck with that!" },
      ]
    },
    {
      id: "lepre_acrobatic_showcase",
      title: "Lepre's Acrobatic Show",
      characters: ["peachy", "lepre", "soap", "tico"],
      dialogue: [
        { speaker: "lepre", text: "Hey everyone! Want to see something cool from my performer days?" },
        { speaker: "peachy", text: "Ooh, yes! Show us your tricks!" },
        { speaker: "lepre", text: "Watch this!" },
        { speaker: "soap", text: "Whoa! Did Lepre just do a triple backflip?!" },
        { speaker: "tico", text: "That was... actually quite impressive. How did you manage that landing?" },
        { speaker: "lepre", text: "Years of practice! Now watch this juggling routine!" },
        { speaker: "peachy", text: "HOW ARE YOU JUGGLING USING YOUR WINGS?!" },
        { speaker: "soap", text: "HOW ARE YOU DOING THAT?!" },
        { speaker: "tico", text: "I have to admit, even with my military training, I couldn't do those moves." },
        { speaker: "lepre", text: "Aww, don't be jealous! I could teach you some basic moves if you want!" },
        { speaker: "peachy", text: "Really? You'd teach us?" },
        { speaker: "lepre", text: "Of course! Though... maybe we should start with something simple. Like standing on one foot." },
        { speaker: "soap", text: "I can do that! Watch me! OH NO!" },
        { speaker: "tico", text: "Soap just fell into the table..." },
        { speaker: "lepre", text: "Soap how did you manage to fall while standing on one foot, that's embarrassing." },
        { speaker: "soap", text: "I... I don't know! Don't look at me!" },
        { speaker: "peachy", text: "I'm starting to think being a plush toy gives you an unfair advantage!" },
        { speaker: "lepre", text: "Hey! Being stuffed with cotton doesn't make acrobatics easier!" },
        { speaker: "tico", text: "Though it probably makes falling less painful..." },
        { speaker: "lepre", text: "Well... that part is true." }
      ]
    }
    
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
    {
      id: "wild_datura_warning",
      title: "Wild Datura Discovery",
      characters: ["peachy", "lepre", "tico", "fluzzer"],
      dialogue: [
        { speaker: "fluzzer", text: "Everyone, I need to warn you about something I discovered during my forest survey today." },
        { speaker: "tico", text: "Forest survey? What did you find?" },
        { speaker: "fluzzer", text: "I found wild Datura growing in the forest just outside our facility grounds. Lots of it." },
        { speaker: "peachy", text: "Datura? What's that?" },
        { speaker: "fluzzer", text: "It's a highly toxic plant! Beautiful white trumpet-shaped flowers, but the entire plant is poisonous." },
        { speaker: "lepre", text: "Poisonous? How dangerous are we talking here?" },
        { speaker: "fluzzer", text: "The pollen can cause severe hallucinations, and eating any part of it can be deadly!" },
        { speaker: "tico", text: "This is a serious safety concern! How close to the facility is this growth?" },
        { speaker: "fluzzer", text: "About a few kilometers from the east entrance, in that dense part of the forest where I sometimes take walks." },
        { speaker: "peachy", text: "Oh no! That area should be off limits now!" },
        { speaker: "fluzzer", text: "That's exactly why I'm warning everyone! The flowers are blooming right now, so they're extra potent." },
        { speaker: "lepre", text: "What should we do if we accidentally encounter it?" },
        { speaker: "fluzzer", text: "Don't touch it, don't smell it, and definitely don't eat it! And if you see the white trumpet flowers, turn around immediately!" },
        { speaker: "tico", text: "I need to put up warning signs and rope off that area. This is a facility-wide safety issue!" },
        { speaker: "fluzzer", text: "Good idea! I've already marked the locations on my botanical survey map." },
        { speaker: "peachy", text: "So no more forest adventures until it's cleared?" },
        { speaker: "lepre", text: "Am I affected by this flower?" },
        { speaker: "fluzzer", text: "Lepre, you're probably fine. But just avoid that area for now." },
        { speaker: "peachy", text: "Yeah I don't think living plushies would be affected by it." },
        { speaker: "lepre", text: "Phew! That's a relief!" },
        { speaker: "tico", text: "Alright everyone, stay safe and avoid the wild Datura!" },
        { speaker: "fluzzer", text: "Will do! Thanks for listening, everyone!" }

      ]
    }
  ],
  expansion8:[
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
      id: "vi_free_from_door",
      title: "Vi is free from the door",
      characters: ["peachy", "soap", "vi", "lepre"],
      dialogue: [
        { speaker: "vi", text: "I'm finally able to leave the laboratory! And its all thx to you guys!" },
        { speaker: "peachy", text: "We did it! We blew up the door thx to the Blowium swalement!" },
        { speaker: "lepre", text: "These swalement really did come in handy twice. And it is so good to see you again Vivien." },
        { speaker: "soap", text: "Handy twice? Maybe more like once, do I need to remind you of what the hackium swalement DID to my generator room doors." },
        { speaker: "peachy", text: "Yeah your doors are permanently stuck opened now hehe." },
        { speaker: "vi", text: "It is good to be free! I no longer am stuck in color purgatory." },
        { speaker: "lepre", text: "Just don't go wandering off too far, we still need you around here." },
        { speaker: "soap", text: "Yeah, we can't have you getting lost in the facility as it is getting bigger and bigger." },
        { speaker: "vi", text: "How big is it now?" },
        { speaker: "lepre", text: "Last I checked, there is a second floor now." },
        { speaker: "peachy", text: "Yeah, this is where Fluzzer hangs out most of the time." },
        { speaker: "vi", text: "Oh so this is where Fluzzer's department is, I should go visit them some time." },
        { speaker: "lepre", text: "Just be careful, Fluzzer can be a bit... sweet with their nectar." },
        { speaker: "soap", text: "Yeah, you don't wanna be covered in nectar. It's hard to remove from our fur." },
        { speaker: "peachy", text: "Trust me on that one, me and Fluzzer learned the hard way after using the nectarize machine for the first time... " },
        { speaker: "vi", text: "Did you got blasted by nectar?" },
        { speaker: "peachy", text: "You could say that. We were both covered head to toe in the stuff!" },
        { speaker: "lepre", text: "That does not sound pleasant at all. Which is the reason why I do not use the nectarize machine, I stay far away from that temu machine." },
        { speaker: "soap", text: "Smart move. The last thing we need is more sticky situations." }
      ]
    },
    {
      id: "vi_questions_peachy",
      title: "Why Peachy Works Here",
      characters: ["peachy", "vi"],
      dialogue: [
        { speaker: "vi", text: "Peachy, I've always wondered, why do you work here in the facility?" },
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
        { speaker: "mystic", text: "Uh... those? They're just... research samples. Corruption shards. From failed experiments in the observatory." },
        { speaker: "peachy", text: "Failed experiments? Should you really be carrying those around?" },
        { speaker: "mystic", text: "I mean... they're mostly inert now. I study them to understand how corruption spreads. It's risky, but knowledge is worth it." },
        { speaker: "vi", text: "You look nervous, Mystic. Are you hiding something?" },
        { speaker: "mystic", text: "No! I mean, no, it's just... they're unpredictable sometimes. I have to be careful." },
        { speaker: "vi", text: "What do you even do with them?" },
        { speaker: "mystic", text: "At night, I go to the observatory and watch how they react to starlight. Sometimes they pulse, sometimes they just sit there." },
        { speaker: "peachy", text: "You go to the observatory every night?" },
        { speaker: "mystic", text: "Yes. It's peaceful there, and I can observe things without interruption. The facility is different at night, quiet." },
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
  vi: "main",
  lepre: "main",
  tico: "main"
};

function initCafeteria() {
  window.cafeteriaMealInterval1 = setInterval(checkMealTime, 60000);
  checkMealTime();
  window.cafeteriaMealInterval2 = setInterval(checkMealTime, 10000);
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
  
  // Check if player has infinity progress
  const hasInfinityProgress = window.infinitySystem && window.infinitySystem.totalInfinityEarned > 0;
  
  let availableScenarios = [];
  
  // If player has infinity progress, unlock all dialogues regardless of expansion level
  if (hasInfinityProgress) {
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || [],
      ...cafeteriaScenarios.expansion4 || [],
      ...cafeteriaScenarios.expansion6 || [],
      ...cafeteriaScenarios.expansion8 || []
    ];

  } else if (window.prismAdvancedLabUnlocked) {
    // Expansion 8 scenarios unlocked by advanced prism lab instead of expansion level
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || [],
      ...cafeteriaScenarios.expansion4 || [],
      ...cafeteriaScenarios.expansion6 || [],
      ...cafeteriaScenarios.expansion8 || []
    ];

  } else if (expansionLevel >= 6) {
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || [],
      ...cafeteriaScenarios.expansion4 || [],
      ...cafeteriaScenarios.expansion6 || []
    ];
  } else if (expansionLevel >= 4) {
    availableScenarios = [
      ...cafeteriaScenarios.expansion2 || [],
      ...cafeteriaScenarios.expansion3 || [],
      ...cafeteriaScenarios.expansion4 || []
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
        const currentPoints = window.friendship.getPoints(friendshipCharacter) || new Decimal(0);
        const bonus = new Decimal(currentPoints).mul(0.05).ceil(); 
        if (bonus.gt(0)) {
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
    fluzzer: 'Fluzzer',
    lepre: 'Lepre',
    tico: 'Tico',
    vi: 'Vivien'
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
    vi: 'assets/icons/vivien.png',
    lepre: 'assets/icons/lepre.png',
    tico: 'assets/icons/tico.png'
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
    vi: 'assets/icons/vivien talking.png',
    lepre: 'assets/icons/lepre speech.png',
    tico: 'assets/icons/tico speech.png'
  };
  const imagePath = speakingImages[character] || getCharacterImage(character);
  return imagePath;
}

function getCharacterColor(character) {
  const colors = {
    peachy: '#FF6B6B',
    soap: '#4ECDC4',
    mystic: '#9B59B6',
    fluzzer: '#F39C12',
    lepre: '#FFD700',
    tico: '#1ABC9C',
    vi: '#3498DB'
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
