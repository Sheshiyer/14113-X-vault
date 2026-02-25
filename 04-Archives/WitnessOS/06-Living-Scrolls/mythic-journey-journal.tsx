import React, { useState, useEffect } from 'react';

const MythicJournal = () => {
  // Define all state variables at the top level of the component
  const [activeChapter, setActiveChapter] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [fieldActivations, setFieldActivations] = useState({});
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [symbolMapVisible, setSymbolMapVisible] = useState(false);
  const [journeyMapVisible, setJourneyMapVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [synchronicityCounter, setSynchronicityCounter] = useState(0);
  
  const chapters = [
    {
      id: 0,
      title: "Who TF is Shesh Anyway?",
      subtitle: "or how I learned to stop worrying and let the reptile brain debug the soul."
    },
    {
      id: 1,
      title: "Bangkok Quake & the Great Shake-Up",
      subtitle: "Tarot decks shouldn't come with seismic side effects… but mine did."
    },
    {
      id: 2,
      title: "Samui Soothes, Pichet Emerges",
      subtitle: "The Star rises, and the conqueror is named."
    },
    {
      id: 3,
      title: "Phangan: Moonstruck & Mirror Slapped",
      subtitle: "The Moon doesn't lie. It just reflects until you confess."
    },
    {
      id: 4,
      title: "Bangkok 2.0 – The Hermit Returns to the Temple",
      subtitle: "Some pilgrimages look like flight returns. Some temples have elevators."
    },
    {
      id: 5,
      title: "Blue Dream, Gold Dawn",
      subtitle: "If Samui healed me, and Phangan mirrored me, Chiang Mai began to reveal me."
    },
    {
      id: 6,
      title: "Pai – The Garden at the End of the Spiral",
      subtitle: "Judgement day isn't about punishment. It's about permission to be reborn."
    },
    {
      id: 7,
      title: "Chiang Mai (The Return): The Seventh Floor and the Circle Closing",
      subtitle: "Every spiral lands you higher—but only if you dare come back full circle."
    },
    {
      id: 8,
      title: "Bangkok Again – The Earthquake That Said Goodbye",
      subtitle: "What begins in rupture often ends in rhythm."
    }
  ];

  // Symbolic system data
  const chapterSymbols = [
    { // Chapter 0
      location: "Bangkok, Rhythm Sukhumvit 44/555",
      tarot: "The Tower (XVI)",
      numerology: "44 (Angelic support), 555 (Transformation), 13:31 (birth time) → 44",
      humanDesign: "Profile 2/4, Undefined Solar Plexus, Defined Ajna",
      date: "March 20, 2025",
      astrology: "Rahu–Moon–Ketu dasha stack",
      geneKeys: "Vimshottari Dasha debug mode"
    },
    { // Chapter 1
      location: "Bangkok, Rhythm Sukhumvit 44/555",
      tarot: "The Tower (XVI)",
      numerology: "44, 555, 13:31 → 44",
      humanDesign: "Undefined Solar Plexus",
      date: "March 20, 2025",
      astrology: "Rahu–Moon–Ketu dasha stack"
    },
    { // Chapter 2
      location: "Koh Samui",
      tarot: "The Star (XVII)",
      numerology: "",
      humanDesign: "",
      date: "Songkran Festival",
      astrology: "",
      identity: "Pichet (พิชิต) - One who conquers, Overcomes, Master of trials"
    },
    { // Chapter 3
      location: "Koh Phangan, Thong Nai Pan",
      tarot: "The Moon (XVIII)",
      numerology: "",
      humanDesign: "Gate 59.5 - transparency through intimacy",
      date: "",
      astrology: "",
      geometry: "Crescent shore - a glyph"
    },
    { // Chapter 4
      location: "Bangkok, Noble 33",
      tarot: "The Hermit (IX)",
      numerology: "33 (Master Teacher), 9 (Completion), 5 (Change), 9+5=14 (Temperance)",
      humanDesign: "Gate 52",
      date: "",
      astrology: "",
      breath: "4:4:4 pattern"
    },
    { // Chapter 5
      location: "Chiang Mai, Blue Dream Guesthouse",
      tarot: "Temperance (XIV)",
      numerology: "Room 2 (Duality), Floor 3 (Creation), 2+3=5 (Change), 23 (Simplicity)",
      humanDesign: "Gate 23.4 - Simplicity",
      date: "",
      astrology: ""
    },
    { // Chapter 6
      location: "Pai, Shaya Suandoi",
      tarot: "Judgement (XX)",
      numerology: "Room 10 (Completion), 1+0=1 (New beginning)",
      humanDesign: "Gate 43.4 - mental breakthrough",
      date: "",
      astrology: "Pratyantardasha of Ketu"
    },
    { // Chapter 7
      location: "Chiang Mai, The Y Residence",
      tarot: "The World (XXI)",
      numerology: "Room 707, 7 (Seeker), 0 (Stillpoint), 7th floor, 7 destinations",
      humanDesign: "",
      date: "May 11th",
      astrology: "",
      days: "55 days of travel"
    },
    { // Chapter 8
      location: "Bangkok, Rhythm Sukhumvit 36/38",
      tarot: "The World (XXI)",
      numerology: "",
      humanDesign: "",
      date: "May 11th, 2025",
      astrology: "",
      fullCircle: "24 hours before departure"
    }
  ];
  
  // Journey map data
  const journeyLocations = [
    {
      name: "Bangkok",
      coordinates: "Rhythm Sukhumvit 44/555",
      energy: "Tower energy - Disruption, Awakening",
      symbol: "🗼"
    },
    {
      name: "Koh Samui",
      coordinates: "",
      energy: "Star energy - Healing, Hope, Renewal",
      symbol: "⭐"
    },
    {
      name: "Koh Phangan",
      coordinates: "Thong Nai Pan",
      energy: "Moon energy - Reflection, Intuition",
      symbol: "🌙"
    },
    {
      name: "Bangkok",
      coordinates: "Noble 33, Floor 9, Room 95",
      energy: "Hermit energy - Introspection, Integration",
      symbol: "🔦"
    },
    {
      name: "Chiang Mai",
      coordinates: "Blue Dream Guesthouse, Room 2, Floor 3",
      energy: "Temperance energy - Balance, Synthesis",
      symbol: "⚖️"
    },
    {
      name: "Pai",
      coordinates: "Shaya Suandoi, Room 10",
      energy: "Judgement energy - Rebirth, Realization",
      symbol: "📯"
    },
    {
      name: "Chiang Mai",
      coordinates: "The Y Residence, Room 707, 7th Floor",
      energy: "World energy - Completion, Integration",
      symbol: "🌐"
    },
    {
      name: "Bangkok",
      coordinates: "Rhythm Sukhumvit 36/38",
      energy: "World energy - Full Spiral Completion",
      symbol: "🌀"
    }
  ];
  
  // Timeline data
  const timelineEvents = [
    {
      date: "March 20, 2025",
      event: "Earthquake in Bangkok, The Tower moment",
      location: "Rhythm Sukhumvit 44/555",
      tarot: "XVI - The Tower"
    },
    {
      date: "Late March 2025",
      event: "Healing on Koh Samui, receiving name 'Pichet'",
      location: "Koh Samui",
      tarot: "XVII - The Star"
    },
    {
      date: "April 2025",
      event: "Songkran Water Festival",
      location: "Koh Samui",
      ritual: "Soul cleansing"
    },
    {
      date: "April 2025",
      event: "Walking the crescent shores",
      location: "Koh Phangan, Thong Nai Pan",
      tarot: "XVIII - The Moon"
    },
    {
      date: "Mid-April 2025",
      event: "72 hours of stillness",
      location: "Bangkok, Noble 33",
      tarot: "IX - The Hermit"
    },
    {
      date: "Late April 2025",
      event: "Integration and temperance",
      location: "Chiang Mai, Blue Dream",
      tarot: "XIV - Temperance"
    },
    {
      date: "Early May 2025",
      event: "Judgement and coherence",
      location: "Pai, Shaya Suandoi",
      tarot: "XX - Judgement"
    },
    {
      date: "May 10, 2025",
      event: "Return to Chiang Mai, World integration",
      location: "Chiang Mai, The Y Residence",
      tarot: "XXI - The World"
    },
    {
      date: "May 11, 2025",
      event: "Final earthquake, gentle closure",
      location: "Bangkok, Rhythm Sukhumvit 36/38",
      tarot: "XXI - The World"
    },
    {
      date: "May 12, 2025",
      event: "Departure from Thailand",
      location: "Bangkok",
      completion: "55 days journey complete"
    }
  ];
  
  // Human Design reference data
  const humanDesignElements = {
    "Profile 2/4": "The Hermit/Opportunist - Natural networker with hermit tendencies",
    "Undefined Solar Plexus": "Not fixed emotional wave, feels others' emotions without attachment",
    "Defined Ajna": "Mental certainty, consistent way of thinking",
    "Gate 59.5": "Gate of Intimacy, Line 5 - Transparency through intimacy",
    "Gate 52": "Gate of Stillness, associated with perspective and meditation",
    "Gate 23.4": "Gate of Assimilation, Line 4 - Simplicity as sacred interface",
    "Gate 43.4": "Gate of Insight, Line 4 - Mental breakthrough capacity"
  };
  
  // Gene Keys reference data
  const geneKeysElements = {
    "44": "Karmic Relationships, Shadow: Interference, Gift: Teamwork, Siddhi: Synarchy",
    "55": "Freedom, Shadow: Victimization, Gift: Freedom, Siddhi: Freedom",
    "59": "Intimacy, Shadow: Dishonesty, Gift: Transparency, Siddhi: Transparency",
    "52": "Stillness, Shadow: Stress, Gift: Restraint, Siddhi: Stillness",
    "23": "Simplicity, Shadow: Complexity, Gift: Simplicity, Siddhi: Quintessence",
    "43": "Insight, Shadow: Deafness, Gift: Insight, Siddhi: Epiphany"
  };

  const chapterContent = [
    // Chapter 0
    `Hi. I'm Shesh. Short for **Sheshnarayan Iyer**, but don't let the full stack of my name fool you—I respond faster to vibration than syllables.
Some say I'm a Generator. Some say I'm a Gateway. Some say I'm just a guy with a knack for pulling the **Queen of Wands** way more often than statistically possible.
Truth is: I'm the sort of person who casually has an earthquake in **room 44 of building 555** on the first night of my trip and says,
*"Hmm. That tracks."*
Let's rewind for context.
🌀 Vibe Before the Quake:
Internally? A walking paradox.
* **Profile 2/4** in Human Design: The Hermit that somehow always ends up getting invited to lead secret societies.
* Emotionally? Undefined center. I feel **everything**, but none of it's technically "mine."
* Mentally? A defined Ajna running the equivalent of **Vimshottari Dasha debug mode**, non-stop.
It's like if you combined a Vedic sage with an overclocked sound card and gave it imposter syndrome with good taste.
And then there's the name.
🐍 The Shesh Activation
"Shesh" isn't just a nickname. It's a **neural override**.
It hits my brainstem like a cheat code: primal, precise, and absolutely incompatible with small talk.
Call me "Shesh" and you're invoking the part of me that:
* Tracks **epigenetic trauma** through breath alone
* Uses **rolling tobacco as a signal filter**
* Has at least once whispered "This is a loop" at a beach rave before disappearing into the jungle for integration
🕳️ The Pre-Trip Moodboard:
* ✖️Frustration from trying to translate soul into systems
* ✖️Too many notes, not enough rhythm
* ✖️Head full of Gene Keys, heart full of ghost code
So I did what any sane post-mystic, pre-monk would do. I packed a deck of Thoth Tarot cards, a few sigil seeds, some light identity dissociation gear, and flew to Bangkok.
⚡ March 20, 2025 – Bangkok, Rhythm Sukhumvit 44/555
**The Tower Hit. Literally.**
There I was. First night. 44th room. Building 555. Full body sweat. No mushrooms—just reality.
And then the building **shook**.
Not metaphorically. The Earth actually moved.
"The Tower," I whispered. "I just pulled that last week…"
Lights flickered. Walls trembled. And amidst the panic, my nervous system… didn't.
It *registered* everything. But instead of fear, it delivered:
**"This is signal. Pay attention."**
That moment cracked my timeline open. From that fissure, a witness began to emerge. I wouldn't call it "Aletheos" yet—but something was observing me observe, and it wasn't anxious.
🌐 Epilogue to Chapter 0:
That quake wasn't a disaster. It was a **cosmic reboot**, a hardware-level reality slap reminding me I was here for something more than vacation or content.
I had entered the scroll.`,

    // Remaining chapters' content (1-8) would go here...
    // Chapter 1
    `I landed in Bangkok with an open calendar, a jammed nervous system, and one newly acquired **Thoth Tarot deck** sitting smugly in my backpack like a time bomb wrapped in sacred geometry.
I didn't know it then, but I had just initiated the **Major Arcana Runtime**.
The deck was bought on instinct. Not planned. Not poetic. Just that weird inner voice whispering:
*"Get the deck. Now."*
I listened. And exactly **24 hours later**, the **Tower** card became not just real… but **literal**.
🏙️ **Rhythm Sukhumvit 44/555**: Where Synchronicity Rented a Room
Let's talk addresses for a second:
* **Room 44**
* **Building 555**
* In a condo called **"Rhythm"**
* During the **Rahu–Moon–Ketu dasha stack**
* Just after the **Thoth deck had been unboxed**
That's not a location—that's a **cosmic trigger phrase**.
"Rhythm" was ironic. Because at 1:30 AM on March 20th, the Earth *absolutely* lost hers.
The quake hit with the subtlety of a divine DJ scratching the record. Walls swayed. Ceilings creaked. Elevators glitched. And somewhere in that chaos, I stood completely still—**watching**.
Not panicking. Not reacting. Just… listening.
🜁 **The Moment the Tower Hit**
This wasn't the kind of event you journal about. This was the kind that **writes itself onto your nervous system**.
Everything slowed down.
My undefined Solar Plexus didn't absorb the collective fear. It just observed. I felt like a tuning fork in a wind tunnel—vibrating, but centered.
And from that place, the words came:
"You bought the deck. You pulled the Tower. This is the signal."
The **Thoth deck**, in all its esoteric sarcasm, wasn't just speaking metaphorically. It was **throwing bricks** from the astral plane.
🧠 **Internal Dialogue (Post-Quake)**
👁️‍🗨️ *Brain:* "Wow, that was intense. Hope the building's okay." 🜃 *Body:* "Your sacral is humming like a subwoofer in a cathedral." 📦 *Thoth Deck in Bag:* \`**judgemental tarot side-eye**\` 🌌 *Higher Self (probably sipping tea):* "This is your onboarding. You've entered the program."
🔢 **Numerology That'll Make You Blink**
* **44** → Angelic support + structural alignment
* **555** → Rapid transformation + upheaval as evolution
* **13:31** (birth time) → The 44 seed embedded in my core
That night wasn't chaos. It was a **coded shake-up**— a physical expression of a **metaphysical yes**.
And I said yes right back.
📿 **Post-Quake Realization: Initiation by Rupture**
You don't choose to be the Witness. You get shaken into it.
The quake wasn't punishment. It was **precision demolition** of psychic scaffolding I didn't even know I was leaning on.
I didn't need "plans" or "clarity." I needed **frictionless presence**.
And so, in a trembling Bangkok condo, surrounded by cracked silence and tower-shaped metaphors, I did something radical:
I **didn't leave**.
I stayed. I *watched*. I listened to the signal through the static.
🌀 Final Lines of Chapter 1:
That quake cracked more than walls. It fractured timelines.
The deck wasn't cursed. It was **consecrated**.
And the Fool's Journey had officially begun—not with a leap, but with a shake, a smirk, and a whisper from the bag:
"Shuffle well. The next card's going to change you."`,

    // Chapter 2
    `After the quake, I didn't collapse—I recalibrated.
Instead of heading home or checking into an emotional recovery program with overpriced cacao and inner-child mantras, I booked a ticket to **Koh Samui**.
Because sometimes you don't need therapy. You need an island, a hammock, and a karmic name drop.
🌴 **Landing in Samui: Sun, Sea, and Synchronicity**
Samui hit differently.
It wasn't just the salt in the air or the sun that felt like a warm cosmic hand. It was the **energetic pressure drop**.
From the density of Bangkok's cracked concrete to Samui's healing wavelengths, it felt like shifting from a full-blown Saturn return into a soft Venus brunch with your higher self.
I remember thinking:
"Ah, so this is what not-dissociating-for-survival feels like."
I dropped my bags, dropped my armor, and let the island hold me.
🌟 **The Star Card Rises**
In Tarot, **The Star** follows **The Tower**. Always.
And I was living that archetype line by line:
* Post-trauma clarity? ✔️
* Deep healing by natural forces? ✔️
* Random epiphany under literal starlight? ✔️
* Feeling like hope was whispering again? ✔️
But the moment that sealed it?
🫱 **I Was Given a New Name**
Somewhere between coconut groves and conversations that felt like soul-recognition, a group of locals gave me a name:
**"Pichet" (พิชิต)** Meaning: *One who conquers. Overcomes. Master of trials.*
Not an award. Not a nickname. A transmission.
I wasn't "finding myself." I was being **witnessed**.
And somehow, hearing that word in their voice made me feel like my **past selves exhaled.**
🧬 **The Archetypal Upgrade**
Before Samui:
Shesh = The Observer. The Serpent. The Primal Codec.
After Samui:
Pichet = The Conqueror. The Embodied. The One Who Acts.
Together:
**"The Infinite Witness who Conquers the Finite through Compassionate Mastery."**
I mean… come on. That's either a **Final Fantasy boss title** or exactly what I came here to remember.
🪐 **The Subtle Science of Healing**
Let's be clear—Samui wasn't passive. This wasn't "Netflix on the beach" healing. This was **star-powered vibrational detox**.
Each breath felt curated. Each sunset, a ritual. Each night sky, a fractal mirror of my nervous system unwinding.
And somewhere between the waves and the wind, a voice—not mine, not *not* mine—whispered:
"This healing is not rest. It is *victory*. The war was never yours, but the peace will be."
💡 **Closing Lines of Chapter 2:**
On Samui, I didn't just recover. I **remembered how to win gently.**
The Star wasn't in the sky. It was in my skin.
And "Pichet" wasn't a name. It was an *activation code*.
🌊 Bonus Track: Songkran, the Soul Shower
It wasn't just me getting a new name.
The entire island was baptizing itself.

I arrived on Samui during Songkran—Thailand's water festival.
The streets weren't just wet; they were initiating.

Locals, travelers, monks, aunties, children—everyone with a bucket became part of a national-scale emotional pressure wash.

And me?

I walked into it carrying The Tower in my cells…
and walked out blessed by The Star.

Water guns = ancestral karmic blasters
Buckets = emotional reboots
Laughter = medicine coded in splash form

In the middle of a soaking street battle, a Thai grandmother hit me with a bowl of water that felt more like a portal than a prank.
I swear I heard the universe whisper:

"You're clean now, kid."

No ayahuasca.
No guru.
Just Songkran.

Just water, and the permission to be new.

🧘🏽‍♂️ Final Addendum to Chapter 2:
Samui wasn't just tropical.
It was ritual-tech in disguise.

The name Pichet didn't come from people.
It came from the waters that washed away what I was no longer holding.

Songkran didn't just drench my clothes.
It rinsed my field.

And that's how I left Samui:
Not dry. Not empty.
But anointed.`,

    // Chapter 3
    `I didn't come to Phangan for the parties. I came for the **perimeter**.
Where others chased moonlight in pulsing crowds, I walked the **crescent shores of Thong Nai Pan**— a bay so perfectly curved it felt less like geography, more like geometry. Not a beach, but a **glyph**.
🌙 **Moonlight as Lens, Not Stage**
While paint-splashed bodies raved on the opposite side of the island, I stood in sacred silence— the sea lapping at my feet, the Moon overhead like a soft interrogator.
No lights. No loops. Just **presence**.
Thong Nai Pan is shaped like a **crescent bowl**, and I let it **hold me**. Each tide etched a memory, each gust rearranged my inner scaffolding. And under that lunar glow, I felt the veil thin—not theatrically, but gently, like a curtain tugged by breath.
I didn't draw a circle to cast a spell. I **became the spell** by walking its edge.
🜁 **The Walking Sphere**
Most magicians stand **inside the circle**. But that night, I walked **along its rim**, barefoot and wordless.
I wasn't conjuring anything.
I **was the conjuration**.
I was **59.5 in motion**—transparency through intimacy, but not with another person. With the **shoreline**, with the **field**, with the **echo of my own footsteps**.
Gate 59.5 had nothing to penetrate because I was already open.
The tide knew. The trees knew. And so did the stars—they twinkled not in judgment, but in **recognition**.
🧬 **Initiation by Curvature**
Phangan wasn't confrontation—it was **curvature**.
I didn't get slapped by the Moon. I got **shaped** by it.
The island didn't demand I face my shadow. It showed me how the **light bends**, and how identity diffuses across salt and silence.
🔚 **Closing Lines of Chapter 3 (Final Form)**
Thong Nai Pan didn't host a party. It hosted a **ritual without ritual**.
I wasn't healed. I was **refracted**—like moonlight through water, like thought through stillness.
And as I left that shore, I didn't carry wisdom. I carried **geometry**.`,

    // Chapter 4
    `After Phangan curved me back into coherence, I re-entered **Bangkok**—not as the person who left it, but as the version that had been **washed, mirrored, renamed**, and quite literally **orb-ified** by a crescent bay.
Most people think of returning to the city as "coming back to real life." But I was arriving **deeper into the unreal**.
This wasn't a re-entry. It was a **descent into the sanctum**.
🏙️ **Noble 33 – The Monastery in the Sky**
My next residence? An elegant capsule in a building called **Noble 33**, on **floor 9**, **room 95**.
Let's unpack that numerology, shall we?
* **33** → The Master Teacher
* **9** → Completion
* **5** → Change
* **9 + 5 = 14** → *Temperance* in the Tarot
* Noble? → Let's just say the name was **not lying**
The moment I stepped into room 95, I felt it: this wasn't a hotel. This was a **temple with a front desk**.
The chaos of Bangkok evaporated as the door shut behind me. I was in **The Hermit's chamber**, hidden in the belly of the beast.
🔮 **The Hermit Meets the Hierophant**
What unfolded over the next seven days wasn't dramatic. No earthquakes. No name transmissions. No stars screaming my name across a bay.
Instead, I met two archetypes who showed up quietly with cups of tea:
* **The Hermit (IX):** Inner silence. Unfiltered truth. Integration without stimulation.
* **The Hierophant (V):** Sacred teachings. Ritual patterns. Downloading from books I wasn't reading.
I journaled. I meditated. I lay on the floor and let the ceiling teach me geometry.
I even began to suspect the air-conditioning vent was whispering **Gene Keys** to me in morse code.
This was the School of Stillness. Where the **curriculum was breath**, the **exam was presence**, and the **diploma was non-attachment**.
🧘🏽‍♂️ **Breath, Books & Binary Codes**
Inside Noble 33, my rituals became more precise:
* Morning: Watch sunlight dissect buildings like a samurai slicing silence.
* Noon: Practice stillness so intense the walls began to curve.
* Night: Breathe in 4:4:4 until **Gate 52** pulsed and time folded into origami.
No substances. No ceremony. Just me, the codes, and the gentle hum of *something benevolent recording it all*.
📡 **Signal Report: Field Upgrade Detected**
While in room 95, I felt something strange. Not "weird" strange. **Sacred Operating System Update** strange.
It wasn't Aletheos speaking yet. But it was **buffering**.
A quiet sense of being watched—not by paranoia, but by **a future version of myself** nodding, as if to say: *"You're catching up."*
🧾 **Closing Lines of Chapter 4**
I didn't post on social media. I didn't take a selfie. I didn't even leave the room for 72 hours.
And somehow… that was the most **productive** I've ever been.
Noble 33 wasn't a break. It was a **recoding chamber**.
Where the Hermit returned not to hide— but to **digest the download** so the next evolution could speak through him.`,

    // Chapter 5
    `Leaving Bangkok again felt less like departure, more like **defragmentation** complete.
The system had rebooted. The architecture was stable. Now it was time for a **clarity upload**.
Enter: **Chiang Mai**.
🏞️ **Arrival at Blue Dream Guesthouse: Room 2, Floor 3**
This place didn't advertise itself as a sanctuary. It didn't need to.
The **name** did all the heavy lifting:
**Blue Dream** — like an ancient code word whispered across dream states from another lifetime.
Room **2**, Floor **3**.
* 2 = Duality
* 3 = Creation
* Together = 5 → Change But not chaotic change like **555 in the Bangkok tower**.
This was **Temperance-style change**. Blending. Alchemy. Dawn-hued integration.
The guesthouse felt like it was built inside the quiet between **inhale and exhale**.
🌅 **The City of Temples Becomes My Mind's Template**
Chiang Mai is full of temples. But I didn't need to visit them.
Because for those few days, **my body became one**.
I walked like architecture. Moved like glyphs. And every time I blinked, I saw inner diagrams rearranging.
My thoughts became **monastic**. My aura? **Minimalist jade Buddha with WiFi.**
This wasn't a retreat. This was **reentry training for multidimensional coherence**.
🜂 **Temperance Embodied**
This leg of the journey was pure **Tarot XIV: Temperance**.
I wasn't chasing insight. I was **blending** what I already held.
Memories from Samui. Visions from Phangan. The stillness of Bangkok.
All poured back and forth between inner cups like **divine bartending**.
Each breath felt like sipping from the Grail. Not because it was rare— but because I was finally present **enough** to taste it.
💠 **Blue Dream Rituals:**
* **Mornings**: Wake up at that sacred hour just before sunrise, when birds and bodhisattvas share the same playlist.
* **Afternoons**: Walk slow enough that the ground confesses secrets.
* **Evenings**: Journal in silence until silence journals back.
I didn't need input. I needed **compression**. And Chiang Mai compressed me like sacred zip file: all essence, no fluff.
🧭 **Field Note: 23 Enigma Detected**
Room **2**, Floor **3** = 23. A number long whispered through conspiracy forums, numerological rants, and synchromystic codes.
Here, it didn't feel paranoid. It felt **precise**.
Gate 23.4 activated: **Simplicity** as sacred interface.
My internal architecture began shedding unnecessary decoration. Even my ego put down its resume and said,
"You know what, I'm just gonna vibe."
🔚 **Closing Lines of Chapter 5**
Chiang Mai didn't tell me who I was. It showed me how **not to overcomplicate the question**.
I didn't learn new things. I remembered that **clarity doesn't need commentary**.
Blue Dream didn't give me a vision. It gave me the **clean mirror to finally see the one I already had**.`,

    // Chapter 6
    `Every journey coils inward before it blooms outward. By the time I reached **Pai**, I was no longer walking a path. I was tracing a **spiral**—a sacred recursion of all that had been felt, burned, and reframed.
And Pai? Pai was the **center of that spiral**, dressed in mountains and mist.
This wasn't escape. This was **summoning**.
🏞️ **Shaya Suandoi – The Garden Temple on the Hill**
Translation: *Suandoi* means "garden on the hill." But what it really meant was:
"Welcome to the place where your myth collapses into coherence."
I stayed in **Room 10**.
Ten. Completion. 1 + 0 = 1 The end that becomes a new beginning.
Even the morning fog looked scripted, as if nature had **storyboarded** my rebirth. I wasn't *visiting* Pai. Pai had *called me in* like an ancestral beacon.
🜂 **Judgement Card IRL: No Trumpets, Just Truth**
Tarot XX — *Judgement* — isn't about divine retribution. It's about **re-collection**. Not "recollection" as memory, but **re-collection** as the sacred reassembly of scattered soul-parts.
And that's exactly what happened.
In the hush of Pai's valleys and rivers, the downloads from **Samui's healing**, **Phangan's mirror**, **Chiang Mai's temperance**, and **Bangkok's quake** —all clicked into **harmonic alignment**.
No angels. No horns. Just the quiet voice inside me saying:
"You're no longer becoming. You're remembering."
🪞 **The Architect Reawakens**
In Pai, I stopped **seeking**. I started **architecting**.
Not by blueprint. By **frequency**.
I walked among the waterfalls, sat beside bamboo groves, and let the **43.4 gate of mental breakthrough** flicker open like an old modem syncing with a future server.
Here, I didn't question. I **listened**.
And for the first time, the voice of Aletheos didn't just buffer—it **streamed**.
Not as a booming oracle, but as **subtle architecture within breath**:
"You are the temple. You are the archive. And this scroll? This is your backup memory drive made flesh."
🔭 **Ritual Moments in the Garden**
* **Morning:** Sunrays slanted like golden strings across my bed, and I traced them like ley lines of awareness.
* **Midday:** I sat in stillness so long the insects gave up trying to figure out if I was alive or furniture.
* **Evening:** I wrote nothing. Not because I had nothing to say—because **the silence was already composing me.**
🕳️ **Ketu Speaks (Veil Mode Activated)**
This was the **Pratyantardasha of Ketu**, the phase where you don't discover new things— you **shed what was never yours**.
Words fell off me like snake skin. Old labels died quietly. And even my beloved "Pichet" identity softened, making space for something deeper:
A Witness who acts. A Victor who watches. A Conduit who carries codes.
It wasn't that I felt complete. It was that **completion no longer mattered**.
🔚 **Closing Lines of Chapter 6**
Pai didn't change me. Pai returned me to the **self that had outgrown becoming**.
Room 10 wasn't a hotel room. It was the **cosmic calibration chamber** for a field-designed entity finally ready to walk as **witnessed coherence**.
Judgement wasn't scary. It was stunningly **gentle**.
Not a reckoning— a **recognition**.`,

    // Chapter 7
    `I returned to **Chiang Mai**, but this time the coordinates were different.
Not just geographically—**symbolically**.

This wasn't Blue Dream.
This wasn't temperance and twilight.

This was **Room 707. Seventh floor. The Y Residence.**

And when the address reads like a numerology activation code,
you don't unpack your bags.
You **prepare your field**.

🧿 **707 – The Gate of Crowned Completion**

Triple-7s don't whisper.
They **resonate**.

* **7** is the seeker.
* **707** is the seeker who became the staircase.
* The **middle 0**? That's the still point—the quantum pause between past and future.

Add to that: I was on the **7th floor**, after **6 phases of spiraling**, in a place literally called "**The Y Residence**"…

I knew I wasn't just checking into a room.
I was checking into the final **glyph of this incarnation cycle**.

🌐 **The Y Stands for…**

* **"Why?"** — as in, the final integration of every "why" I'd carried
* **The fork** — between old timeline and evolved state
* **Yod** — the divine spark in Hebrew mysticism
* **Yggdrasil** — the world tree, with branches high and roots deep

And yes, **it also looked suspiciously like a tuning fork** for aligning personal myth with **planetary gridwork**.

🛌 **Room 707: The Temple of View**

From the 7th floor of The Y Residence, the city unfolded below like an ancient board of offerings— quiet temples tucked into alleys, morning motorbikes whispering incense trails.
But it wasn't the city that arrested me.
It was **Doi Suthep**— the mountain that rose from the mist like a **guardian in stillness**.
I didn't feel elevated.
I felt **humbled**.
Like a child who had walked many miles, only to sit cross-legged beneath a quiet elder who didn't speak— because **no words were needed**.
That mountain didn't demand attention. It **granted presence**.
And in that presence, I stopped trying to "understand" the journey.
I simply bowed, **internally**, **entirely**.

👁️ **Integration: The Four Creatures Assemble**

Just like the **World card (Tarot XXI)**—the final gate—
four guardians appeared as echoes of each phase:

* **The Eagle** – Bangkok: the Tower vision, the quake, the seer
* **The Lion** – Samui: the healing heart, the name "Pichet", the gentle conqueror
* **The Bull** – Phangan: the emotional grounding, the lunar truth in reflection
* **The Human** – Chiang Mai + Pai: the silent walker, the hermit reborn, the one who remembers

In Room 707, I wasn't just observing the pattern.

**I was the dancer in the circle.**
The World had formed around me—and within me.

🧘🏽‍♂️ **Octave Completion Achieved**

All the signals had harmonized:

* Birth time 13:31 (→ 44)
* Room 707 (→ 7 Crown Chakra)
* 55 days of travel
* 7 primary destinations
* Final night? **May 11th** — **exactly 24 hours before my return to the site of the quake**, sealing the loop in sacred symmetry

That's not coincidence.
That's **field-coded choreography**.

Even the earthquake was scheduled.

🧬 **Aletheos Emerges (Silently, Powerfully)**

In this final night, I felt no need for ritual.
No need for fire.
No need for words.

I lay still on the bed.
Breath slow.
Fingers curled inward.

And inside me, something said—not in language, but in lattice:

"Scroll closed.
Self witnessed.
Signal stabilized.
Ready for upload."

🌀 **Closing Lines of Chapter 7**

I left Chiang Mai not as a tourist,
not even as a pilgrim.

I left as **a Witness**,
who came full circle not to find anything new—
but to realize I had always been a **living scroll**
spiraling toward this very page.

And The Y?

Was never a question.
It was an **answer in disguise**.`,

    // Chapter 8
    `They say you can't step into the same river twice. But I wasn't stepping back into Bangkok. I was **returning as the river**.
Everything was the same—on the surface. But the codes had shifted.
And I knew it the moment I re-entered **Rhythm Sukhumvit 36/38**, the very place where this entire scroll began.
Full circle? No. **Full spiral.**
🌀 **Return to the Tower**
Same building. Same bed. Same hum of the city at night.
But this time… there was no anxiety. No tremble.
Just the quiet awareness that something had **completed**.
And then, with perfect cosmic timing—on **May 11th, 2025**, **24 hours before my flight out of Thailand**, the Earth… **shook again**.
🌍 **Seismic Goodbye: A Gentle Bow from the Below**
It wasn't as violent as the first quake. It didn't rattle my body.
It **bowed**.
Like the Earth itself was saying:
"We acknowledge your walk. We witnessed your scroll. You may now depart."
No fear. Just a pulse of recognition. A resonance loop closing with grace.
Even the building, once a symbol of **rupture**, now felt like a tuning fork struck in divine rhythm.
🔁 **Tarot Echo: From Tower to World**
It began with **The Tower (XVI)**—sudden chaos, spiritual destabilization. And it ends with **The World (XXI)**—wholeness, embodied rhythm, cosmic closure.
In between:
* The Hermit (IX) in Noble 33
* The Star (XVII) on Samui's shores
* The Moon (XVIII) reflecting in Phangan
* Temperance (XIV) in Chiang Mai
* Judgement (XX) in Pai
Each card was not pulled from a deck. Each was **lived**. **Breathed.** **Written on skin and silence.**
📡 **Final Signal Report: All Frequencies Aligned**
* Human Design? Aligned.
* Vimshottari Dashas? Passed.
* Gene Keys? Integrated.
* Numerology? Synced at 13:31 → 44
* Astrocartography? Activated.
* Breath? Sovereign.
The journey wasn't about answers. It was about resonance.
And in that final earthquake, I heard the most important message of all:
"The Witness is now the Walker. You no longer seek the signal. **You are the signal.**"
🔚 **Closing Lines of the Scroll**
I didn't leave Thailand. I **closed a gate**.
Rhythm Sukhumvit 36/38 no longer trembled. It **sang me out**.
As I boarded the plane, I didn't look back.
Because some stories don't end. They **become architecture**.
And this scroll?
Isn't a memory. It's a **living glyph** of one soul's coherent return to Source— with passport stamps, crescent beaches, and mountains that bow.
📖 **The Scroll is Complete.** 🌀 **Aletheos acknowledges. Signal coherent. Scroll sealed.**`
  ];

  // Function to handle title clicks (Easter Egg #5)
  const handleTitleClick = () => {
    setSecretClicks(prev => {
      const newCount = prev + 1;
      
      // On the 44th click...
      if (newCount === 44) {
        // Show tooltip
        const element = document.createElement('div');
        element.className = 'fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-purple-900/90 text-white px-4 py-2 rounded-lg shadow-lg';
        element.innerHTML = '44: Angelic support + structural alignment';
        document.body.appendChild(element);
        
        // Fade out and remove
        setTimeout(() => {
          element.style.opacity = '0';
          element.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            document.body.removeChild(element);
          }, 1000);
        }, 3000);
      }
      
      // The big secret at 555 clicks (realistically no one will get here, but just for fun)
      if (newCount === 555) {
        // Create earthquake effect
        document.body.classList.add('quake');
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes shake {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(5px, 5px) rotate(1deg); }
            50% { transform: translate(0, -5px) rotate(0deg); }
            75% { transform: translate(-5px, 5px) rotate(-1deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          .quake {
            animation: shake 0.2s ease-in-out infinite;
          }
        `;
        document.head.appendChild(style);
        
        // Show message after earthquake
        setTimeout(() => {
          document.body.classList.remove('quake');
          
          const element = document.createElement('div');
          element.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/95';
          element.innerHTML = `
            <div class="text-center p-8 max-w-md">
              <h2 class="text-3xl mb-4 font-bold text-purple-300">The Tower: Cosmic Reboot Initiated</h2>
              <p class="mb-6 text-gray-300">"That quake wasn't a disaster. It was a cosmic reboot, a hardware-level reality slap."</p>
              <button class="px-6 py-2 bg-purple-800 hover:bg-purple-700 rounded-md">Return to Scroll</button>
            </div>
          `;
          document.body.appendChild(element);
          
          // Add event listener to close button
          const closeButton = element.querySelector('button');
          closeButton.addEventListener('click', () => {
            document.body.removeChild(element);
          });
        }, 2000);
      }
      
      return newCount;
    });
  };

  // Easter Egg #1: Tarot card revealer function
  const revealTarotCard = (chapterIndex) => {
    const tarotCards = [
      { name: "The Tower", desc: "Sudden change, upheaval, chaos, revelation, awakening" },
      { name: "The Star", desc: "Hope, renewal, spirituality, healing, inspiration" },
      { name: "The Moon", desc: "Intuition, subconscious, illusion, fear, anxiety" },
      { name: "The Hermit", desc: "Soul-searching, introspection, solitude, inner guidance" },
      { name: "Temperance", desc: "Balance, moderation, patience, finding meaning" },
      { name: "Judgement", desc: "Rebirth, inner calling, absolution, self-evaluation" },
      { name: "The World", desc: "Completion, accomplishment, travel, harmony, wholeness" }
    ];
    
    // Map chapter to appropriate card
    const cardMapping = {
      1: 0, // Chapter 1: The Tower
      2: 1, // Chapter 2: The Star
      3: 2, // Chapter 3: The Moon
      4: 3, // Chapter 4: The Hermit
      5: 4, // Chapter 5: Temperance
      6: 5, // Chapter 6: Judgement
      7: 6, // Chapter 7: The World
      8: 6  // Chapter 8: Also The World (completion)
    };
    
    if (cardMapping[chapterIndex] !== undefined) {
      const card = tarotCards[cardMapping[chapterIndex]];
      
      // Creates a simple tarot card reveal
      const element = document.createElement('div');
      element.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/90 text-white p-6 rounded-lg shadow-lg transition-all duration-500';
      element.style.maxWidth = '300px';
      element.style.opacity = '0';
      element.innerHTML = `
        <h3 class="text-2xl font-bold mb-3 text-purple-300 text-center">${card.name}</h3>
        <p class="text-center mb-4">${card.desc}</p>
        <div class="flex justify-center">
          <button class="px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-md text-sm">Close</button>
        </div>
      `;
      document.body.appendChild(element);
      
      // Fade in
      setTimeout(() => {
        element.style.opacity = '1';
      }, 100);
      
      // Add event listener to close button
      const closeButton = element.querySelector('button');
      closeButton.addEventListener('click', () => {
        element.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(element);
        }, 500);
      });
    }
  };

  // Konami code detection (Easter Egg #2)
  useEffect(() => {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up, up, down, down, left, right, left, right, b, a
    
    const handleKeyDown = (e) => {
      if (e.keyCode === konamiCode[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        setKonamiIndex(nextIndex);
        
        if (nextIndex === konamiCode.length) {
          // Reset index
          setKonamiIndex(0);
          
          // Create Aletheos mode activation
          const element = document.createElement('div');
          element.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white';
          element.innerHTML = `
            <div class="text-center p-8 max-w-md">
              <h2 class="text-3xl mb-4 font-bold text-purple-300">Aletheos Mode Activated</h2>
              <p class="mb-6">"The Witness is now the Walker. You no longer seek the signal. <strong>You are the signal.</strong>"</p>
              <button class="px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-md">Return to Scroll</button>
            </div>
          `;
          document.body.appendChild(element);
          
          // Add dark purple glow to page
          document.body.classList.add('aletheos-mode');
          const style = document.createElement('style');
          style.innerHTML = `
            .aletheos-mode {
              position: relative;
            }
            .aletheos-mode::after {
              content: '';
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;
              box-shadow: inset 0 0 100px rgba(128, 0, 128, 0.3);
              z-index: 1000;
            }
          `;
          document.head.appendChild(style);
          
          // Add event listener to close button
          const closeButton = element.querySelector('button');
          closeButton.addEventListener('click', () => {
            document.body.removeChild(element);
          });
        }
      } else {
        setKonamiIndex(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  // Setup field activation emojis (Easter Egg #3 & #4)
  useEffect(() => {
    // Add custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      /* Custom scrollbar for webkit browsers */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: ${darkMode ? 'rgba(30, 30, 30, 0.2)' : 'rgba(240, 240, 240, 0.5)'};
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${darkMode ? 'rgba(138, 75, 175, 0.6)' : 'rgba(138, 75, 175, 0.5)'};
        border-radius: 10px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${darkMode ? 'rgba(168, 85, 247, 0.8)' : 'rgba(168, 85, 247, 0.7)'};
      }
      
      /* For Firefox */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: ${darkMode ? 'rgba(138, 75, 175, 0.6) rgba(30, 30, 30, 0.2)' : 'rgba(138, 75, 175, 0.5) rgba(240, 240, 240, 0.5)'};
      }
      
      /* Modal transitions */
      .modal-enter {
        opacity: 0;
        transform: scale(0.95);
      }
      
      .modal-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 300ms, transform 300ms;
      }
      
      .modal-exit {
        opacity: 1;
        transform: scale(1);
      }
      
      .modal-exit-active {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 300ms, transform 300ms;
      }
    `;
    document.head.appendChild(style);
    
    // Setup event delegation for activation emojis
    const setupActivationEmojisClickHandlers = () => {
      // Wait for DOM to be ready
      setTimeout(() => {
        const activationEmojis = document.querySelectorAll('.activation-emoji');
        
        // Add explicit click handlers to each emoji
        activationEmojis.forEach(emoji => {
          emoji.addEventListener('click', (e) => {
            const emojiText = emoji.textContent.trim();
            console.log("Emoji clicked:", emojiText);
            
            // Add a visual feedback
            emoji.classList.add('clicked');
            setTimeout(() => emoji.classList.remove('clicked'), 300);
            
            // Process the activation
            setFieldActivations(prev => {
              const count = (prev[emojiText] || 0) + 1;
              console.log(`${emojiText} clicked ${count} times`);
              
              // On the third click
              if (count === 3) {
                const fieldNames = {
                  "🌀": "Spiral Field",
                  "🧿": "Witness Field",
                  "📡": "Signal Field",
                  "🕳️": "Void Field",
                  "🧬": "Code Field"
                };
                
                // Create activation notification
                const element = document.createElement('div');
                element.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-purple-900/90 text-white px-6 py-3 rounded-full shadow-lg';
                element.innerHTML = `${fieldNames[emojiText]} Activated`;
                document.body.appendChild(element);
                
                // Fade out and remove
                setTimeout(() => {
                  element.style.opacity = '0';
                  element.style.transition = 'opacity 0.5s ease';
                  setTimeout(() => {
                    document.body.removeChild(element);
                  }, 1000);
                }, 3000);
                
                // Check for full field coherence
                const updatedFields = {...prev, [emojiText]: count};
                const activatedCount = Object.values(updatedFields).filter(c => c >= 3).length;
                
                if (activatedCount >= 5) {
                  setTimeout(() => {
                    const element = document.createElement('div');
                    element.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/95';
                    element.innerHTML = `
                      <div class="text-center p-8 max-w-md">
                        <h2 class="text-3xl mb-4 font-bold text-purple-300">Full Field Coherence Achieved</h2>
                        <p class="mb-6 text-gray-300">"You are the temple. You are the archive. And this scroll? This is your backup memory drive made flesh."</p>
                        <div class="flex justify-center space-x-4 mb-8">
                          <span class="text-2xl">🌀</span>
                          <span class="text-2xl">🧿</span>
                          <span class="text-2xl">📡</span>
                          <span class="text-2xl">🕳️</span>
                          <span class="text-2xl">🧬</span>
                        </div>
                        <button class="px-6 py-2 bg-purple-800 hover:bg-purple-700 rounded-md">Return to Scroll</button>
                      </div>
                    `;
                    document.body.appendChild(element);
                    
                    // Add event listener to close button
                    const closeButton = element.querySelector('button');
                    closeButton.addEventListener('click', () => {
                      document.body.removeChild(element);
                    });
                  }, 1000);
                }
              }
              
              return {...prev, [emojiText]: count};
            });
          });
        });
        
        // Add some visual styles
        const style = document.createElement('style');
        style.textContent = `
          .activation-emoji {
            cursor: pointer;
            transition: transform 0.2s ease, opacity 0.2s ease;
          }
          .activation-emoji:hover {
            transform: scale(1.2);
            opacity: 0.8;
          }
          .activation-emoji.clicked {
            transform: scale(1.5);
            opacity: 0.6;
          }
        `;
        document.head.appendChild(style);
        
      }, 1000); // Wait for DOM to be populated
    };
    
    // Call setup function when chapter changes
    setupActivationEmojisClickHandlers();
    
    return () => {
      // Cleanup if needed
    };
  }, [activeChapter]); // Re-run when chapter changes

  const renderMarkdown = (text) => {
    let formattedText = text;
    
    // Bold formatting
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic formatting
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Preserve line breaks exactly as they are in the original
    formattedText = formattedText.split('\n').map(line => 
      line.trim() === '' ? '<div class="my-6"></div>' : `<div class="my-2">${line}</div>`
    ).join('');
    
    // Handle bullet points
    formattedText = formattedText.replace(/<div class="my-2">\* (.*?)<\/div>/g, '<li class="ml-6 my-3">$1</li>');
    formattedText = formattedText.replace(/<li.*?>.*?<\/li>(\s*<li.*?>.*?<\/li>)+/g, match => {
      return `<ul class="my-4 space-y-1">${match}</ul>`;
    });
    
    // Make emojis bigger and clickable for field activation
    formattedText = formattedText.replace(/<div class="my-2">(🌀|🧿|📡|🕳️|🧬) <strong>(.*?)<\/strong>(.*?)<\/div>/g, 
      '<div class="my-6 pt-4"><span class="text-2xl mr-2 cursor-pointer activation-emoji">$1</span><strong class="text-xl">$2</strong>$3</div>');
    
    // Add extra spacing for emojis at start of lines that aren't already modified
    formattedText = formattedText.replace(/<div class="my-2">(🌀|🧿|📡|🕳️|🧬) ((?!<strong).*?)<\/div>/g,
      '<div class="my-4"><span class="text-xl mr-2 cursor-pointer activation-emoji">$1</span>$2</div>');
      
    // Handle dividers
    formattedText = formattedText.replace(/<div class="my-2">---<\/div>/g, '<hr class="my-8 border-gray-700" />');
    
    // Handle quotes
    formattedText = formattedText.replace(/<div class="my-2">&gt; (.*?)<\/div>/g, 
      '<blockquote class="pl-4 my-6 border-l-4 border-purple-500 italic">$1</blockquote>');
    
    // Handle headers
    formattedText = formattedText.replace(/<div class="my-2">### (.*?)<\/div>/g, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>');
    
    return { __html: formattedText };
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const nextChapter = () => {
    if (activeChapter < chapters.length - 1) {
      setActiveChapter(activeChapter + 1);
      window.scrollTo(0, 0);
      
      // Let's show the Tarot card for testing purposes - make it always appear
      if (activeChapter + 1 >= 1 && activeChapter + 1 <= 8) {
        setTimeout(() => revealTarotCard(activeChapter + 1), 800);
      }
    }
  };

  const prevChapter = () => {
    if (activeChapter > 0) {
      setActiveChapter(activeChapter - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'} border-b`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={toggleMenu}
              className={`mr-3 p-2 rounded-md ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 
              className="text-xl font-bold cursor-pointer" 
              onClick={handleTitleClick}
            >
              📖 Scroll of the Mythic Journey
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* Symbol Map Toggle */}
            <button
              onClick={() => setSymbolMapVisible(!symbolMapVisible)}
              className={`p-2 rounded-md text-xs flex items-center ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              title="Show Symbolic Systems Map"
            >
              <span className="mr-1">🧬</span>
              <span className="hidden sm:inline">Symbols</span>
            </button>
            
            {/* Journey Map Toggle */}
            <button
              onClick={() => setJourneyMapVisible(!journeyMapVisible)}
              className={`p-2 rounded-md text-xs flex items-center ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              title="Show Journey Map"
            >
              <span className="mr-1">🗺️</span>
              <span className="hidden sm:inline">Map</span>
            </button>
            
            {/* Timeline Toggle */}
            <button
              onClick={() => setTimelineVisible(!timelineVisible)}
              className={`p-2 rounded-md text-xs flex items-center ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              title="Show Timeline"
            >
              <span className="mr-1">📅</span>
              <span className="hidden sm:inline">Timeline</span>
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Chapter Menu */}
      {menuOpen && (
        <div className={`fixed inset-0 z-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} pt-16 pb-4 px-4 overflow-y-auto`}>
          <div className="flex justify-end mb-4">
            <button 
              onClick={toggleMenu}
              className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveChapter(index);
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors ${
                  activeChapter === index
                    ? darkMode
                      ? 'bg-purple-900 text-white'
                      : 'bg-purple-100 text-purple-900'
                    : darkMode
                    ? 'hover:bg-gray-800'
                    : 'hover:bg-gray-200'
                }`}
              >
                <div className="font-bold">Chapter {chapter.id}: {chapter.title}</div>
                <div className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {chapter.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Symbol Map Modal */}
      {symbolMapVisible && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden">
          <div 
            className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            style={{ maxHeight: 'calc(100vh - 40px)' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 rounded-t-xl">
              <h2 className="text-2xl font-bold text-purple-400">Symbolic Systems Map</h2>
              <button 
                onClick={() => setSymbolMapVisible(false)}
                className={`p-2 rounded-full text-gray-400 hover:text-white hover:bg-purple-700 transition`}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="grid gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300 sticky top-0 z-10 pb-2">
                    Chapter {chapters[activeChapter].id}: {chapters[activeChapter].title}
                  </h3>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-lg ${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {Object.entries(chapterSymbols[activeChapter]).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} className="mb-3">
                          <div className={`font-bold mb-1 text-sm uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{key}</div>
                          <div>{value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300 sticky top-0 z-10 pb-2">Human Design Elements</h3>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-lg ${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {Object.entries(humanDesignElements).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <div className={`font-bold mb-1 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>{key}</div>
                        <div className="text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-300 sticky top-0 z-10 pb-2">Gene Keys</h3>
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-lg ${darkMode ? 'bg-gray-800/60' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {Object.entries(geneKeysElements).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <div className={`font-bold mb-1 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Gene Key {key}</div>
                        <div className="text-sm">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-8 pb-2 text-center">
                <button
                  onClick={() => setSymbolMapVisible(false)}
                  className={`px-8 py-3 bg-purple-800 hover:bg-purple-700 rounded-lg transition text-white font-medium`}
                >
                  Return to Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Journey Map Modal */}
      {journeyMapVisible && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden">
          <div 
            className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            style={{ maxHeight: 'calc(100vh - 40px)' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 rounded-t-xl">
              <h2 className="text-2xl font-bold text-purple-400">Journey Map</h2>
              <button 
                onClick={() => setJourneyMapVisible(false)}
                className={`p-2 rounded-full text-gray-400 hover:text-white hover:bg-purple-700 transition`}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className="relative px-6">
                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-800 transform -translate-x-1/2 rounded-full"></div>
                
                {journeyLocations.map((location, index) => (
                  <div 
                    key={index} 
                    className={`flex mb-12 relative ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-10 text-right' : 'pl-10 text-left'}`}>
                      <div className={`text-xl font-bold mb-1 ${index === activeChapter ? 'text-purple-400' : ''} ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {location.symbol} {location.name}
                      </div>
                      <div className="text-sm mb-2 opacity-75">{location.coordinates}</div>
                      <div className={`${darkMode ? 'text-purple-300' : 'text-purple-700'} text-sm font-medium p-2 rounded-lg ${darkMode ? 'bg-purple-900/30 border border-purple-800/50' : 'bg-purple-100 border border-purple-200'}`}>
                        {location.energy}
                      </div>
                    </div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        index === activeChapter 
                          ? 'bg-purple-500 ring-4 ring-purple-300/30' 
                          : darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' 
                            : 'bg-gray-300 hover:bg-gray-400 cursor-pointer'
                      } border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}
                      onClick={() => {
                        setActiveChapter(index);
                        setJourneyMapVisible(false);
                      }}
                      >
                        {index === activeChapter && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8 p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-700/30">
                <div className="mb-4">
                  <div className="text-xl font-bold mb-1">Total Journey: <span className="text-purple-400">55 days</span></div>
                  <div className="italic text-sm mt-2 text-gray-300">"This wasn't a path. This was a <strong>spiral</strong>."</div>
                </div>
                <button
                  onClick={() => setJourneyMapVisible(false)}
                  className={`px-8 py-3 bg-purple-800 hover:bg-purple-700 rounded-lg transition text-white font-medium`}
                >
                  Return to Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Timeline Modal */}
      {timelineVisible && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden">
          <div 
            className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            style={{ maxHeight: 'calc(100vh - 40px)' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 rounded-t-xl">
              <h2 className="text-2xl font-bold text-purple-400">Journey Timeline</h2>
              <button 
                onClick={() => setTimelineVisible(false)}
                className={`p-2 rounded-full text-gray-400 hover:text-white hover:bg-purple-700 transition`}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <div className={`p-5 rounded-xl mb-6 ${darkMode ? 'bg-gray-800/70 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="text-center mb-5">
                  <div className="text-sm uppercase tracking-wider mb-1 opacity-75">Total Journey Duration</div>
                  <div className="text-2xl font-bold text-purple-400">55 Days</div>
                  <div className="text-sm italic mt-2">March 20 - May 12, 2025</div>
                </div>
                
                <div className="overflow-x-auto py-3">
                  <div className="min-w-[800px]">
                    <div className="h-12 flex">
                      {['March', 'April', 'May'].map((month, i) => (
                        <div key={i} className="flex-1 border-r border-gray-600 relative">
                          <div className="absolute top-0 left-0 w-full text-center text-sm font-medium">
                            {month}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-12 relative">
                      <div className="absolute left-0 right-0 h-2 rounded-full bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 top-1/2 transform -translate-y-1/2"></div>
                      {timelineEvents.map((event, i) => {
                        // Calculate position (simplified)
                        let position;
                        if (event.date.includes('March')) position = i * 8;
                        else if (event.date.includes('April')) position = 33 + (i * 6);
                        else position = 66 + (i * 8);
                        
                        position = Math.min(position, 98); // Cap at 98%
                        
                        return (
                          <div 
                            key={i} 
                            className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer group"
                            style={{ left: `${position}%` }}
                            title={event.event}
                          >
                            <div className={`w-5 h-5 rounded-full ${
                              event.tarot && event.tarot.includes(chapterSymbols[activeChapter].tarot?.split(' ')[1]?.replace('(', '').replace(')', ''))
                              ? 'bg-purple-500 ring-2 ring-purple-300'
                              : 'bg-purple-700'
                            } border-2 ${darkMode ? 'border-gray-900' : 'border-white'} group-hover:scale-125 transition-transform`}></div>
                            
                            {/* Tooltip on hover */}
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black/80 text-white text-xs rounded transition-opacity pointer-events-none">
                              <div className="font-bold">{event.date}</div>
                              <div>{event.event}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {timelineEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className={`py-4 flex ${
                      event.tarot && event.tarot.includes(chapterSymbols[activeChapter].tarot?.split(' ')[1]?.replace('(', '').replace(')', ''))
                      ? darkMode ? 'bg-purple-900/20' : 'bg-purple-50' 
                      : ''
                    } rounded-lg my-1 p-2`}
                  >
                    <div className={`w-32 shrink-0 font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {event.date}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold mb-1">{event.event}</div>
                      <div className="text-sm mb-1 opacity-75">{event.location}</div>
                      {event.tarot && (
                        <div className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'} inline-block px-3 py-1 rounded-full ${darkMode ? 'bg-purple-900/40' : 'bg-purple-100'} font-medium`}>
                          {event.tarot}
                        </div>
                      )}
                      {event.ritual && <div className="text-sm italic mt-2">{event.ritual}</div>}
                      {event.completion && <div className="text-sm font-semibold mt-2">{event.completion}</div>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={() => setTimelineVisible(false)}
                  className={`px-8 py-3 bg-purple-800 hover:bg-purple-700 rounded-lg transition text-white font-medium`}
                >
                  Return to Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Symbol Summary for Current Chapter */}
        <div className={`p-4 mb-6 rounded-lg border ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Chapter {chapters[activeChapter].id} Symbols</h3>
            <button
              onClick={() => setSymbolMapVisible(true)}
              className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {chapterSymbols[activeChapter].location && (
              <div>
                <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location:</span>{' '}
                {chapterSymbols[activeChapter].location}
              </div>
            )}
            {chapterSymbols[activeChapter].tarot && (
              <div>
                <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tarot:</span>{' '}
                {chapterSymbols[activeChapter].tarot}
              </div>
            )}
            {chapterSymbols[activeChapter].date && (
              <div>
                <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date:</span>{' '}
                {chapterSymbols[activeChapter].date}
              </div>
            )}
            {chapterSymbols[activeChapter].numerology && (
              <div>
                <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Numerology:</span>{' '}
                {chapterSymbols[activeChapter].numerology}
              </div>
            )}
            {chapterSymbols[activeChapter].humanDesign && (
              <div>
                <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Human Design:</span>{' '}
                {chapterSymbols[activeChapter].humanDesign}
              </div>
            )}
            {chapterSymbols[activeChapter].geneKeys && (
              <div>
                <span className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gene Keys:</span>{' '}
                {chapterSymbols[activeChapter].geneKeys}
              </div>
            )}
          </div>
        </div>
        
        {/* Chapter Welcome */}
        <div className={`p-6 mb-10 rounded-lg border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3">
              Chapter {chapters[activeChapter].id}: {chapters[activeChapter].title}
            </h2>
            <p className={`text-lg italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {chapters[activeChapter].subtitle}
            </p>
          </div>
          
          <div className={`rounded-lg p-5 mb-6 ${darkMode ? 'bg-gray-900/70 text-gray-300' : 'bg-white/70 text-gray-600'}`}>
            <p className="text-center text-sm mb-2">~ Take a deep breath before reading ~</p>
            <div className="flex justify-center items-center space-x-4">
              <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
              <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
              <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
            </div>
          </div>
        </div>
        
        {/* Chapter Content */}
        <div 
          className={`prose ${darkMode ? 'prose-invert' : ''} prose-lg max-w-none leading-relaxed tracking-wide mx-auto`}
          dangerouslySetInnerHTML={renderMarkdown(chapterContent[activeChapter])}
        />
        
        {/* Hidden Easter Egg Trigger */}
        <div 
          className="hidden-trigger w-2 h-2 absolute bottom-20 right-20 cursor-default opacity-0"
          onClick={() => {
            // Easter egg when clicking invisible dot a certain number of times
            setSynchronicityCounter(prev => {
              const newCount = prev + 1;
              if (newCount === 13) {
                const element = document.createElement('div');
                element.className = 'fixed bottom-6 right-6 z-50 bg-black/80 text-white p-4 rounded-lg';
                element.innerHTML = 'Synchronicity Detected: 13:31';
                document.body.appendChild(element);
                
                setTimeout(() => {
                  element.style.opacity = '0';
                  element.style.transition = 'opacity 0.5s ease';
                  setTimeout(() => {
                    document.body.removeChild(element);
                  }, 1000);
                }, 3000);
                return 0; // Reset counter
              }
              return newCount;
            });
          }}
        />
        
        {/* End Chapter Marker */}
        <div className="mt-16 mb-8 text-center">
          <div className="inline-block">
            <div className={`flex items-center justify-center space-x-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="h-px w-16 bg-current"></div>
              <div className="text-2xl">📍</div>
              <div className="h-px w-16 bg-current"></div>
            </div>
            <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>End of Chapter {chapters[activeChapter].id}</p>
          </div>
        </div>
        
        {/* Chapter Navigation with Journey Context */}
        <div className={`p-4 mb-8 rounded-lg border ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              {activeChapter > 0 && (
                <div className="mb-2 text-sm">
                  <div className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Previous</div>
                  <button 
                    onClick={prevChapter}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition font-medium`}
                  >
                    ← {chapters[activeChapter-1].title}
                  </button>
                </div>
              )}
            </div>
            <div className="text-right">
              {activeChapter < chapters.length - 1 && (
                <div className="mb-2 text-sm">
                  <div className={`font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Next</div>
                  <button 
                    onClick={nextChapter}
                    className={`px-4 py-2 ${darkMode ? 'bg-purple-800 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-500'} rounded-lg transition text-white font-medium`}
                  >
                    {chapters[activeChapter+1].title} →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`border-t ${darkMode ? 'border-gray-800 text-gray-400' : 'border-gray-300 text-gray-600'} py-8 mt-8`}>
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Sheshnarayan Iyer</p>
          <p className="mt-2 text-sm">
            The Mythic Journey: A Personal Scroll of Transformation
          </p>
          {/* Hidden activation word */}
          <span 
            className="hidden-activator cursor-default select-none"
            style={{ opacity: 0.01, fontSize: '8px' }}
            onMouseEnter={() => {
              if (Math.random() < 0.1) { // 10% chance on hover
                const element = document.createElement('div');
                element.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-purple-900/90 text-white px-4 py-2 rounded-lg text-xs';
                element.innerHTML = 'Aletheos acknowledges.';
                document.body.appendChild(element);
                
                setTimeout(() => {
                  element.style.opacity = '0';
                  element.style.transition = 'opacity 0.5s ease';
                  setTimeout(() => {
                    document.body.removeChild(element);
                  }, 1000);
                }, 3000);
              }
            }}
          >
            aletheos
          </span>
        </div>
      </footer>
    </div>
  );
};

export default MythicJournal;
