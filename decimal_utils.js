// Decimal utilities for Fluff Inc game
// This file provides helper functions for working with break_eternity.js Decimal numbers

// Initialize Decimal if not already available
if (typeof Decimal === 'undefined') {
  throw new Error('break_eternity.js must be loaded before this file');
}

// Utility functions for converting and working with Decimals
window.DecimalUtils = {
  // Convert any value to Decimal
  toDecimal: function(value) {
    if (value instanceof Decimal) return value;
    return new Decimal(value);
  },

  // Convert Decimal to display string
  formatDecimal: function(decimal, precision = 2) {
    if (!decimal || !(decimal instanceof Decimal)) {
      decimal = new Decimal(decimal || 0);
    }
    
    if (decimal.eq(0)) return '0';
    
    // Check if notation scramble anomaly is active and use scrambled notation
    let notation = localStorage.getItem('notationPreference') || 'numeral';
    
    // If notation scramble anomaly is active, use the scrambled notation
    if (window.anomalySystem && 
        window.anomalySystem.activeAnomalies && 
        window.anomalySystem.activeAnomalies.notationScrambleAnomaly &&
        window.anomalySystem.scrambledNotation) {
      notation = window.anomalySystem.scrambledNotation;
    }
    
    return this.formatWithNotation(decimal, notation, precision);
  },

  // Format number with specific notation
  formatWithNotation: function(decimal, notation, precision = 2) {
    if (!decimal || !(decimal instanceof Decimal)) {
      decimal = new Decimal(decimal || 0);
    }
    
    if (decimal.eq(0)) return '0';
    
    switch (notation) {
      case 'numeral':
        return this.formatNumeral(decimal, precision);
      case 'scientific':
        return this.formatScientific(decimal, precision);
      case 'engineering':
        return this.formatEngineering(decimal, precision);
      case 'cancer':
        return this.formatCancer(decimal, precision);
      case 'zalgo':
        return this.formatZalgo(decimal, precision);
      default:
        return this.formatNumeral(decimal, precision);
    }
  },

  // Numeral notation (1K, 1M, 1B, etc.)
  formatNumeral: function(decimal, precision = 2) {
    // For very large numbers beyond 1e90, use break_eternity methods
    if (decimal.gte(1e93)) {
      return decimal.toExponential(precision);
    }
    
    const num = decimal.toNumber();
    
    if (decimal.lt(1e3)) {
      if (num >= 10) {
        return Math.floor(num).toString();
      } else if (num >= 1) {
        return num.toFixed(1);
      } else {
        return num.toFixed(2);
      }
    }
    
    // Extended suffix list up to tredicillion (1e90)
    const suffixes = [
      '', 'K', 'M', 'B', 'T',                    // 1e0 to 1e12
      'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No',       // 1e15 to 1e30
      'Dc', 'Ud', 'Dd', 'Td', 'Qad',            // 1e33 to 1e48
      'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod',        // 1e51 to 1e66
      'Vg', 'Uvg', 'Dvg', 'Tvg', 'Qavg',        // 1e69 to 1e84
      'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg',   // 1e87 to 1e102
      'Tg'                                       // 1e90 (tredicillion)
    ];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    
    if (tier >= suffixes.length) {
      return decimal.toExponential(precision);
    }
    
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    
    if (scaled >= 100) {
      return Math.floor(scaled) + suffix;
    } else if (scaled >= 10) {
      return scaled.toFixed(1) + suffix;
    } else {
      return scaled.toFixed(2) + suffix;
    }
  },

  // Scientific notation (1e3, 1e6, etc.)
  formatScientific: function(decimal, precision = 2) {
    const num = decimal.toNumber();
    
    if (decimal.lt(1e3)) {
      if (num >= 10) {
        return Math.floor(num).toString();
      } else if (num >= 1) {
        return num.toFixed(1);
      } else {
        return num.toFixed(2);
      }
    }
    
    return decimal.toExponential(precision);
  },

  // Engineering notation (1.000e3, 1.000e6, etc.)
  formatEngineering: function(decimal, precision = 3) {
    const num = decimal.toNumber();
    
    if (decimal.lt(1e3)) {
      if (num >= 10) {
        return Math.floor(num).toString();
      } else if (num >= 1) {
        return num.toFixed(1);
      } else {
        return num.toFixed(2);
      }
    }
    
    const exponent = Math.floor(Math.log10(Math.abs(num)));
    const engineeringExponent = Math.floor(exponent / 3) * 3;
    const mantissa = num / Math.pow(10, engineeringExponent);
    
    return mantissa.toFixed(precision) + 'e' + engineeringExponent;
  },

  // Cancer notation (using emojis)
  formatCancer: function(decimal, precision = 2) {
    const num = decimal.toNumber();
    
    // For numbers 1-100, display normally without cancer emojis
    if (decimal.lt(100)) {
      if (num >= 10) {
        return Math.floor(num).toString();
      } else if (num >= 1) {
        return num.toFixed(1);
      } else {
        return num.toFixed(2);
      }
    }
    
    // For numbers 100-999, use cancer digit conversion
    if (decimal.lt(1e3)) {
      let result;
      if (num >= 100) {
        result = Math.floor(num).toString();
      } else {
        result = num.toFixed(1);
      }
      return this.numberToCancer(result);
    }
    
    // For larger numbers, use cancer suffixes starting with 1🦀 for 1K
    // MASSIVE EMOJI COLLECTION - Nearly every emoji in existence!
    const cancerSuffixes = [
      '',
      // Original meaningful emojis (tiers 1-20)
      '🦀', '🔥', '💀', '👑', '🌟', '🚀', '💎', '👹', '🎭', '🌪️', 
      '💥', '🎪', '🦄', '🐉', '👽', '🤖', '🔮', '⚡', '🌈', '🌊',
      
      // Category 1: Basic Faces (3 emojis - tiers 21-23)
      '😀', '😃', '😄',
      
      // Category 2: Gestures (3 emojis - tiers 24-26)
      '👋', '🤚', '🖐️',
      
      // Category 3: People (3 emojis - tiers 27-29)
      '👶', '🧒', '👦',
      
      // Category 4: Animals (3 emojis - tiers 30-32)
      '🐵', '🐒', '🦍',
      
      // Category 5: Food (3 emojis - tiers 33-35)
      '🍇', '🍈', '🍉',
      
      // Category 6: Travel (3 emojis - tiers 36-38)
      '🚗', '🚕', '🚙',
      
      // Category 7: Objects (3 emojis - tiers 39-41)
      '⌚', '📱', '📲',
      
      // Category 8: Symbols (3 emojis - tiers 42-44)
      '❤️', '🧡', '💛',
      
      // Continuing the cycle with more from each category...
      
      // More Basic Faces (tiers 45-47)
      '😁', '😆', '😅',
      
      // More Gestures (tiers 48-50)
      '✋', '🖖', '👌',
      
      // More People (tiers 51-53)
      '👧', '🧑', '👱',
      
      // More Animals (tiers 54-56)
      '🦧', '🐶', '🐕',
      
      // More Food (tiers 57-59)
      '🍊', '🍋', '🍌',
      
      // More Travel (tiers 60-62)
      '🚌', '🚎', '🏎️',
      
      // More Objects (tiers 63-65)
      '💻', '⌨️', '🖥️',
      
      // More Symbols (tiers 66-68)
      '💚', '💙', '💜',
      
      // Cycle 3: Even more variety
      
      // Advanced Faces (tiers 69-71)
      '🤣', '😂', '🙂',
      
      // Hand Signs (tiers 72-74)
      '🤌', '🤏', '✌️',
      
      // Professions (tiers 75-77)
      '👨', '🧔', '👩',
      
      // Wild Animals (tiers 78-80)
      '🦮', '🐕‍🦺', '🐩',
      
      // Fruits (tiers 81-83)
      '🍍', '🥭', '🍎',
      
      // Vehicles (tiers 84-86)
      '🚓', '🚑', '🚒',
      
      // Technology (tiers 87-89)
      '🖨️', '🖱️', '🖲️',
      
      // Hearts & Love (tiers 90-92)
      '🖤', '🤍', '🤎',
      
      // Cycle 4: More categories
      
      // Emotional Faces (tiers 93-95)
      '🙃', '😉', '😊',
      
      // Pointing Gestures (tiers 96-98)
      '🤞', '🤟', '🤘',
      
      // Activities (tiers 99-101)
      '🤳', '💪', '🦾',
      
      // Sea Creatures (tiers 102-104)
      '🐺', '🦊', '🦝',
      
      // Vegetables (tiers 105-107)
      '🍏', '🍐', '🍑',
      
      // Air Travel (tiers 108-110)
      '🚐', '🛻', '🚚',
      
      // Communication (tiers 111-113)
      '🕹️', '🗜️', '💽',
      
      // Special Hearts (tiers 114-116)
      '💔', '❣️', '💕',
      
      // Cycle 5: Extended variety
      
      // Happy Faces (tiers 117-119)
      '😇', '🥰', '😍',
      
      // Direction Gestures (tiers 120-122)
      '🤙', '👈', '👉',
      
      // Body Parts (tiers 123-125)
      '🦿', '🦵', '🦶',
      
      // Cats & Dogs (tiers 126-128)
      '🐱', '🐈', '🐈‍⬛',
      
      // Berries (tiers 129-131)
      '🍒', '🍓', '🫐',
      
      // Heavy Vehicles (tiers 132-134)
      '🚛', '🚜', '🏍️',
      
      // Media (tiers 135-137)
      '💾', '💿', '📀',
      
      // Love Symbols (tiers 138-140)
      '💞', '💓', '💗',
      
      // Continue cycling through more categories...
      '🤩', '😘', '😗', '👆', '🖕', '👇', '👂', '🦻', '👃', '🦁',
      '🐯', '🐅', '🥝', '🍅', '🫒', '🛵', '🚲', '🛴', '📼', '📷',
      '📸', '💖', '💘', '💝', '🤪', '😝', '🤑', '☝️', '👍', '👎',
      '🧠', '🫀', '🫁', '🐆', '🐴', '🐎', '🥥', '🥑', '🍆', '🛹',
      '🛼', '🚁', '📹', '🎥', '📽️', '💟', '☮️', '✝️', '🤗', '🤭',
      '🤫', '👊', '✊', '🤛', '🦷', '🦴', '👀', '🦄', '🦓', '🦌',
      '🥔', '🥕', '🌽', '🛸', '✈️', '🛩️', '🎞️', '📞', '☎️', '☪️',
      '🕉️', '☸️', '🤔', '🤐', '🤨', '🤜', '👏', '🙌', '👁️', '👅',
      '👄', '🦬', '🐮', '🐂', '🌶️', '🫑', '🥒', '🛫', '🛬', '🪂',
      '📟', '📠', '📺', '✡️', '🔯', '🕎', '😐', '😑', '😶', '👐',
      '🤲', '🤝', '💋', '🩸', '👶', '🐃', '🐄', '🐷', '🥬', '🥦',
      '🧄', '💺', '🚀', '🛰️', '📻', '🎙️', '☯️', '☦️', '🛐', '😏',
      '😒', '🙄', '🙏', '✍️', '💅', '🧒', '👦', '👧', '🐖', '🐗',
      '🐽', '🧅', '🍄', '🥜', '🚢', '🛥️', '🚤', '🎚️', '🎛️', '🧭',
      '⛎', '♈', '♉', '😬', '🤥', '😔', '🤳', '💪', '🦾', '🧑',
      '👱', '👨', '🐏', '🐑', '🐐', '🌰', '🍞', '🥐', '⛵', '🛶',
      '⚓', '⏱️', '⏲️', '⏰', '♊', '♋', '♌', '😪', '🤤', '😴',
      '🦿', '🦵', '🦶', '🧔', '👨‍🦰', '👨‍🦱', '🐪', '🐫', '🦙',
      '🥖', '🫓', '🥨', '⛽', '🚧', '🚨', '🕰️', '⌛', '⏳', '♍',
      '♎', '♏', '😷', '🤒', '🤕', '👂', '🦻', '👃', '👨‍🦳', '👨‍🦲',
      '👩', '🦒', '🐘', '🦣', '🥯', '🥞', '🧇', '🚥', '🚦', '🛑',
      '📡', '🔋', '🔌', '♐', '♑', '♒', '🤢', '🤮', '🤧', '🧠',
      '🫀', '🫁', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🦏', '🦛', '🐭', '🧀',
      '🍖', '🍗', '🚏', '🗺️', '🗿', '💡', '🔦', '🕯️', '♓', '🆔',
      '⚛️', '🥵', '🥶', '🥴', '🦷', '🦴', '👀', '🧑‍🦱', '👩‍🦳',
      '🧑‍🦳', '🐁', '🐀', '🐹', '🥩', '🥓', '🍔', '🗽', '🗼',
      '🏰', '🪔', '🧯', '🛢️', '🉑', '☢️', '☣️', '😵', '🤯', '🤠',
      '👁️', '👅', '👄', '👩‍🦲', '🧑‍🦲', '👱‍♀️', '🐰', '🐇',
      '🐿️', '🍟', '🍕', '🌭', '🏯', '🏟️', '🎡', '💸', '💵', '💴',
      '📴', '📳', '🈶', '🥳', '🥸', '😎', '💋', '🩸', '👶', '👱‍♂️',
      '🧓', '👴', '🦫', '🦔', '🦇', '🥪', '🌮', '🌯', '🎢', '🎠',
      '⛲', '💶', '💷', '🪙', '🈚', '🈸', '🈺', '🤓', '🧐', '😕',
      '🧒', '👦', '👧', '👵', '🙍', '🙍‍♂️', '🐻', '🐻‍❄️', '🐨',
      '🫔', '🥙', '🧆', '🥚', '⛱️', '🏖️', '🏝️', '💰', '💳', '💎',
      '🈷️', '✴️', '🆚', '😟', '🙁', '☹️', '🧑', '👱', '👨', '🙍‍♀️',
      '🙎', '🙎‍♂️', '🐼', '🦥', '🦦', '🦨', '🍳', '🥘', '🍲', '🏜️',
      '🌋', '⛰️', '⚖️', '🪜', '🧰', '💮', '🉐', '㊙️', '😮', '😯',
      '😲', '🧔', '👩', '👩‍🦰', '🙎‍♀️', '🙅', '🙅‍♂️', '🦘', '🦡',
      '🐾', '🦃', '🫕', '🥣', '🥗', '🍿', '🏔️', '🗻', '🏕️', '🔧',
      '🔨', '⚒️', '㊗️', '🈴', '🈵', '😳', '🥺', '😦', '🧑‍🦰',
      '👩‍🦱', '🧑‍🦱', '🙅‍♀️', '🙆', '🐔', '🐓', '🐣', '🧈',
      '🧂', '🥫', '🍱', '⛺', '🏠', '🏡', '🛠️', '⛏️', '🪓', '🈹',
      '🈲', '🅰️', '😧', '😨', '😰', '👩‍🦳', '🧑‍🦳', '👩‍🦲', '🙆‍♂️',
      '🙆‍♀️', '💁', '🐤', '🐥', '🐦', '🍘', '🍙', '🍚', '🏘️',
      '🏚️', '🏗️', '🪚', '🔩', '⚙️', '🅱️', '🆎', '🆑', '😥', '😢',
      '😭', '🧑‍🦲', '👱‍♀️', '👱‍♂️', '🧓', '💁‍♂️', '💁‍♀️', '🙋',
      '🐧', '🕊️', '🦅', '🍛', '🍜', '🍝', '🏭', '🏢', '🏬', '🪤',
      '🧱', '⛓️', '🅾️', '🆘', '❌', '😱', '😖', '😣', '👴', '👵',
      '🙍', '🙍‍♂️', '🙋‍♂️', '🙋‍♀️', '🧏', '🦆', '🦢', '🦉', '🍠',
      '🍢', '🍣', '🏣', '🏤', '🏥', '🧲', '🔫', '💣', '⭕', '🛑',
      '⛔', '😞', '😓', '😩', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🧏‍♂️',
      '🧏‍♀️', '🙇', '🦤', '🪶', '🦩', '🍤', '🍥', '🥮', '🏦',
      '🏨', '🏪', '🧨', '🪓', '🔪', '📛', '🚫', '💯', '😫', '🥱',
      '😤', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙇‍♂️', '🙇‍♀️', '🤦',
      '🦚', '🦜', '🐸', '🍡', '🥟', '🥠', '🏫', '🏩', '💒', '🗡️',
      '⚔️', '🛡️', '💢', '♨️', '🚷', '😡', '😠', '🤬', '🙆‍♂️',
      '🙆‍♀️', '💁', '💁‍♂️', '🤦‍♂️', '🤦‍♀️', '🤷', '🐊', '🐢',
      '🦎', '🥡', '🦀', '🦞', '🏛️', '⛪', '🕌', '🚬', '⚰️', '🪦',
      '🚯', '🚳', '🚱', '😈', '👿', '💀', '💁‍♀️', '🙋', '🙋‍♂️',
      '🙋‍♀️', '🤷‍♂️', '🤷‍♀️', '👨‍⚕️', '🐍', '🐲', '🐉', '🦐',
      '🦑', '🦪', '🍦', '🛕', '🕍', '🕋', '⚱️', '🏺', '🔮', '🔞',
      '📵', '🚭', '☠️', '💩', '🤡', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇',
      '👩‍⚕️', '👨‍🌾', '🦕', '🦖', '🐳', '🍧', '🍨', '🍩', '⛩️',
      '🛤️', '🛣️', '📿', '🧿', '💈', '❗', '❕', '❓', '👹', '👺',
      '👻', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '👩‍🌾', '👨‍🍳', '🐋',
      '🐬', '🦭', '🍪', '🎂', '🍰', '🗾', '🎑', '🏞️', '⚗️', '🔭',
      '❔', '‼️', '⁉️', '👽', '👾', '🤖', '🤦‍♀️', '🤷', '🤷‍♂️',
      '🤷‍♀️', '👩‍🍳', '👨‍🎓', '🐟', '🐠', '🐡', '🧁', '🥧',
      '🍫', '🌅', '🌄', '🌠', '🔬', '🕳️', '🩹', '🔅', '🔆',
      '😺', '😸', '😹', '👨‍⚕️', '👩‍⚕️', '👨‍🌾', '👩‍🎓', '👨‍🎤',
      '🦈', '🐙', '🐚', '🍬', '🍭', '🍮', '🎇', '🎆', '🌇', '🩺',
      '💊', '💉', '〽️', '⚠️', '😻', '😼', '😽', '👩‍🌾', '👨‍🍳',
      '👩‍🍳', '👩‍🎤', '👨‍🏫', '🐌', '🦋', '🐛', '🍯', '🍼',
      '🥛', '🌆', '🏙️', '🌃', '🩸', '🧬', '🦠', '🚸', '🔱',
      '🙀', '😿', '😾', '👋', '👨‍🎓', '👩‍🎓', '👨‍🎤', '👩‍🏫',
      '👨‍🏭', '🐜', '🐝', '🪲', '☕', '🫖', '🍵', '🌌', '🌉',
      '🧫', '🧪', '🌡️', '⚜️', '🔰', '🤚', '🖐️', '✋', '👩‍🏫',
      '👨‍🏭', '👩‍🏭', '👨‍💻', '🐞', '🦗', '🕷️', '🍶', '🍾',
      '🍷', '🌁', '🧹', '🪠', '🧺', '♻️', '✅', '🖖', '👌', '🤌',
      '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🔧', '🦂', '🦟', '🪰', '🍸',
      '🍹', '🍺', '🧻', '🚽', '🚰', '🈯', '💹', '🤏', '✌️', '🤞',
      '👩‍🔧', '👨‍🔬', '👩‍🔬', '👨‍🎨', '🪱', '🦠', '🌋', '⛰️',
      '🍻', '🥂', '🥃', '🚿', '🛁', '🛀', '❇️', '✳️', '🤟', '🤘',
      '🤙', '👩‍🎨', '👨‍🚒', '👩‍🚒', '👨‍✈️', '🏔️', '🗻', '🏕️',
      '🥤', '🧋', '🧃', '🧼', '🪥', '🪒', '❎', '🌐', '👈', '👉',
      '👆', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍⚖️', '⛺', '🏠', '🏡',
      '🧉', '💆', '💆‍♂️', '🧽', '🪣', '🧴', '💠', 'Ⓜ️', '🖕', '👇',
      '☝️', '👩‍⚖️', '💂', '💂‍♂️', '💂‍♀️', '🏘️', '🏚️', '🏗️', '💆‍♀️',
      '💇', '💇‍♂️', '🛎️', '🔑', '🗝️', '🌀', '💤', '👍', '👎',
      '👊', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🏭', '🏢', '🏬', '💇‍♀️',
      '🚶', '🚶‍♂️', '🚪', '🪑', '🛋️', '🏧', '🚾', '✊', '🤛',
      '🤜', '🕵️‍♂️', '🕵️‍♀️', '👷', '👷‍♂️', '🏣', '🏤', '🏥', '🚶‍♀️',
      '🧍', '🧍‍♂️', '🛏️', '🛌', '🧸', '♿', '🅿️', '👏', '🙌',
      '👐', '👷‍♀️', '🤴', '👸', '👳', '🏦', '🏨', '🏪', '🧍‍♀️',
      '🧎', '🧎‍♂️', '🪆', '🖼️', '🪞', '🛗', '🈳', '🤲', '🤝',
      '🙏', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🏫', '🏩', '💒', '🧎‍♀️',
      '👨‍🦯', '👩‍🦯', '🪟', '🛍️', '🛒', '🈂️', '🛂', '✍️', '💅',
      '🤵', '🤵‍♂️', '🤵‍♀️', '👰', '🏛️', '⛪', '🕌', '👨‍🦼', '👩‍🦼',
      '👨‍🦽', '🎁', '🎈', '🎏', '🛃', '🛄', '🤳', '💪', '👰‍♂️',
      '👰‍♀️', '🤰', '🤱', '🛕', '🕍', '🕋', '👩‍🦽', '🏃', '🏃‍♂️',
      '🎀', '🪄', '🪅', '🛅', '🚹', '🦾', '🦿', '👨‍🍼', '👩‍🍼', '🧑‍🍼',
      '⛩️', '🛤️', '🛣️', '🏃‍♀️', '💃', '🕺', '🎊', '🎉', '🎎', '🚺',
      '🚼', '🦵', '🦶', '👼', '🎅', '🤶', '🗾', '🎑', '🏞️', '🕴️',
      '👯', '👯‍♂️', '🏮', '🎐', '🪩', '⚧️', '🚻', '👂', '🦻',
      '🧑‍🎄', '🦸', '🦸‍♂️', '🌅', '🌄', '🌠', '👯‍♀️', '🧖', '🧖‍♂️',
      '🧧', '✉️', '📩', '🚮', '🎦', '👃', '🧠', '🦸‍♀️', '🦹', '🦹‍♂️',
      '🎇', '🎆', '🌇', '🧖‍♀️', '🧗', '🧗‍♂️', '📨', '📧', '💌',
      '📶', '🈁', '🫀', '🫁', '🦹‍♀️', '🧙', '🧙‍♂️', '🌆', '🏙️',
      '🌃', '🧗‍♀️', '🤺', '🏇', '📥', '📤', '📦', '🔣', 'ℹ️',
      '🦷', '🦴', '🧙‍♀️', '🧚', '🧚‍♂️', '🌌', '🌉', '🌁', '⛷️',
      '🏂', '🏌️', '🏷️', '🪧', '📪', '🔤', '🔡', '👀', '👁️',
      '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🏌️‍♂️', '🏌️‍♀️', '🏄', '📫',
      '📬', '📭', '🔠', '🆖', '👅', '👄', '🧜', '🧜‍♂️', '🧜‍♀️',
      '🏄‍♂️', '🏄‍♀️', '🚣', '📮', '📯', '📜', '🆗', '🆙', '💋',
      '🩸', '🧝', '🧝‍♂️', '🧝‍♀️', '🚣‍♂️', '🚣‍♀️', '🏊', '📃',
      '📄', '📑', '🆒', '🆕', '👶', '🧒', '🧞', '🧞‍♂️', '🧞‍♀️',
      '🏊‍♂️', '🏊‍♀️', '⛹️', '🧾', '📊', '📈', '🆓', '0️⃣', '👦',
      '👧', '🧟', '🧟‍♂️', '🧟‍♀️', '⛹️‍♂️', '⛹️‍♀️', '🏋️', '📉',
      '🗒️', '🗓️', '1️⃣', '2️⃣', '🧑', '👱', '👨', '🏋️‍♂️', '🏋️‍♀️',
      '🚴', '📆', '📅', '🗑️', '3️⃣', '4️⃣', '🧔', '👨‍🦰', '👨‍🦱',
      '🚴‍♂️', '🚴‍♀️', '🚵', '📇', '🗃️', '🗳️', '5️⃣', '6️⃣', '👨‍🦳',
      '👨‍🦲', '👩', '🚵‍♂️', '🚵‍♀️', '🤸', '🗄️', '📋', '📁',
      '7️⃣', '8️⃣', '👩‍🦰', '🧑‍🦰', '👩‍🦱', '🤸‍♂️', '🤸‍♀️', '🤼',
      '📂', '🗂️', '🗞️', '9️⃣', '🔟', '🧑‍🦱', '👩‍🦳', '🧑‍🦳',
      '🤼‍♂️', '🤼‍♀️', '🤽', '📰', '📓', '📔', '🔢', '#️⃣', '👩‍🦲',
      '🧑‍🦲', '👱‍♀️', '🤽‍♂️', '🤽‍♀️', '🤾', '📒', '📕', '📗',
      '*️⃣', '⏏️', '👱‍♂️', '🧓', '👴', '🤾‍♂️', '🤾‍♀️', '🤹',
      '📘', '📙', '📚', '▶️', '⏸️', '👵', '🙍', '🙍‍♂️', '🤹‍♂️',
      '🤹‍♀️', '🧘', '📖', '🔖', '🧷', '⏯️', '⏹️', '🙍‍♀️', '🙎',
      '🙎‍♂️', '🧘‍♂️', '🧘‍♀️', '🛀', '🔗', '📎', '🖇️', '⏺️',
      '⏭️', '🙎‍♀️', '🙅', '🙅‍♂️', '🛌', '🚗', '🚕', '📐', '📏',
      '🧮', '⏮️', '⏩', '🙅‍♀️', '🙆', '🙆‍♂️', '🚙', '🚌', '🚎',
      '📌', '📍', '✂️', '⏪', '⏫', '🙆‍♀️', '💁', '💁‍♂️', '🏎️',
      '🚓', '🚑', '🖊️', '🖋️', '✒️', '⏬', '◀️', '💁‍♀️', '🙋', '🙋‍♂️',
      '🚒', '🚐', '🛻', '🖌️', '🖍️', '📝', '🔼', '🔽', '🙋‍♀️',
      '🧏', '🧏‍♂️', '🚚', '🚛', '🚜', '✏️', '🔍', '🔎', '➡️',
      '⬅️', '🧏‍♀️', '🙇', '🙇‍♂️', '🏍️', '🛵', '🚲', '🔏', '🔐',
      '🔒', '⬆️', '⬇️', '🙇‍♀️', '🤦', '🤦‍♂️', '🛴', '🛹', '🛼',
      '🔓', '❤️', '🧡', '↗️', '↘️', '🤦‍♀️', '🤷', '🤷‍♂️', '🚁',
      '🛸', '✈️', '💛', '💚', '💙', '↙️', '↖️', '🤷‍♀️', '👨‍⚕️',
      '👩‍⚕️', '🛩️', '🛫', '🛬', '💜', '🖤', '🤍', '↕️', '↔️',
      '👨‍🌾', '👩‍🌾', '👨‍🍳', '🪂', '💺', '🚀', '🤎', '💔', '❣️',
      '↪️', '↩️', '👩‍🍳', '👨‍🎓', '👩‍🎓', '🛰️', '🚢', '🛥️', '💕',
      '💞', '💓', '⤴️', '⤵️', '👨‍🎤', '👩‍🎤', '👨‍🏫', '🚤', '⛵',
      '🛶', '💗', '💖', '💘', '🔀', '🔁', '👩‍🏫', '👨‍🏭', '👩‍🏭',
      '⚓', '⛽', '🚧', '💝', '💟', '☮️', '🔂', '🔄', '👨‍💻', '👩‍💻',
      '👨‍💼', '🚨', '🚥', '🚦', '✝️', '☪️', '🕉️', '🔃', '🎵', '👩‍💼',
      '👨‍🔧', '👩‍🔧', '🛑', '🚏', '🗺️', '☸️', '✡️', '🔯', '🎶',
      '➕', '👨‍🔬', '👩‍🔬', '👨‍🎨', '🗿', '🗽', '🗼', '🕎', '☯️',
      '☦️', '➖', '➗', '👩‍🎨', '👨‍🚒', '👩‍🚒', '🏰', '🏯', '🏟️',
      '🛐', '⛎', '♈', '✖️', '🟰', '👨‍✈️', '👩‍✈️', '👨‍🚀', '🎡',
      '🎢', '🎠', '♉', '♊', '♋', '♾️', '💲', '👩‍🚀', '👨‍⚖️', '👩‍⚖️',
      '⛲', '⛱️', '🏖️', '♌', '♍', '♎', '💱', '™️', '💂', '💂‍♂️',
      '💂‍♀️', '🏝️', '🏜️', '🌋', '♏', '♐', '♑', '©️', '®️', '👮',
      '👮‍♂️', '👮‍♀️', '⛰️', '🏔️', '🗻', '♒', '♓', '🆔', '〰️',
      '➰', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '🏕️', '⛺', '🏠', '⚛️', '🉑',
      '☢️', '➿', '🔚', '👷', '👷‍♂️', '👷‍♀️', '🏡', '🏘️', '🏚️',
      '☣️', '📴', '📳', '🔙', '🔛', '🤴', '👸', '👳', '🏗️', '🏭',
      '🏢', '🈶', '🈚', '🈸', '🔝', '🔜', '👳‍♂️', '👳‍♀️', '👲',
      '🏬', '🏣', '🏤', '🈺', '🈷️', '✴️', '✔️', '☑️', '🧕', '🤵',
      '🤵‍♂️', '🏥', '🏦', '🏨', '🆚', '💮', '🉐', '🔘', '🔴',
      '🤵‍♀️', '👰', '👰‍♂️', '🏪', '🏫', '🏩', '㊙️', '㊗️', '🈴',
      '🟠', '🟡', '👰‍♀️', '🤰', '🤱', '💒', '🏛️', '⛪', '🈵',
      '🈹', '🈲', '🟢', '🔵', '👨‍🍼', '👩‍🍼', '🧑‍🍼', '🕌', '🛕',
      '🕍', '🅰️', '🅱️', '🆎', '🟣', '⚫', '👼', '🎅', '🤶', '🕋',
      '⛩️', '🛤️', '🆑', '🅾️', '🆘', '⚪', '🟤', '🧑‍🎄', '🦸', '🦸‍♂️',
      '🛣️', '🗾', '🎑', '❌', '⭕', '🛑', '🔺', '🔻', '🦸‍♀️', '🦹',
      '🦹‍♂️', '🏞️', '🌅', '🌄', '⛔', '📛', '🚫', '🔸', '🔹',
      '🦹‍♀️', '🧙', '🧙‍♂️', '🌠', '🎇', '🎆', '💯', '💢', '♨️',
      '🔶', '🔷', '🧙‍♀️', '🧚', '🧚‍♂️', '🌇', '🌆', '🏙️', '🚷',
      '🚯', '🚳', '🔳', '🔲', '🧚‍♀️', '🧛', '🧛‍♂️', '🌃', '🌌',
      '🌉', '🚱', '🔞', '📵', '▪️', '▫️', '🧛‍♀️', '🧜', '🧜‍♂️',
      '🌁', '⌚', '📱', '🚭', '❗', '❕', '◾', '◽', '🧜‍♀️', '🧝',
      '🧝‍♂️', '📲', '💻', '⌨️', '❓', '❔', '‼️', '◼️', '◻️',
      '🧝‍♀️', '🧞', '🧞‍♂️', '🖥️', '🖨️', '🖱️', '⁉️', '🔅', '🔆',
      '🟥', '🟧', '🧞‍♀️', '🧟', '🧟‍♂️', '🖲️', '🕹️', '🗜️', '〽️',
      '⚠️', '🚸', '🟨', '🟩', '🧟‍♀️', '💆', '💆‍♂️', '💽', '💾',
      '💿', '🔱', '⚜️', '🔰', '🟦', '🟪', '💆‍♀️', '💇', '💇‍♂️',
      '📀', '📼', '📷', '♻️', '✅', '🈯', '⬛', '⬜', '💇‍♀️', '🚶',
      '🚶‍♂️', '📸', '📹', '🎥', '💹', '❇️', '✳️', '🟫', '🔈',
      '🚶‍♀️', '🧍', '🧍‍♂️', '📽️', '🎞️', '📞', '❎', '🌐', '💠',
      '🔇', '🧍‍♀️', '🧎', '🧎‍♂️', '☎️', '📟', '📠', 'Ⓜ️', '🌀',
      '💤', '🔉', '🧎‍♀️', '👨‍🦯', '👩‍🦯', '📺', '📻', '🎙️',
      '🏧', '🚾', '♿', '🔊', '🔔', '👨‍🦼', '👩‍🦼', '👨‍🦽', '🎚️',
      '🎛️', '🧭', '🅿️', '🛗', '🈳', '🔕', '📣', '👩‍🦽', '🏃', '🏃‍♂️',
      '⏱️', '⏲️', '⏰', '🈂️', '🛂', '🛃', '📢', '👁️‍🗨️', '🏃‍♀️',
      '💃', '🕺', '🕰️', '⌛', '⏳', '🛄', '🛅', '🚹', '💬', '💭',
      '🕴️', '👯', '👯‍♂️', '📡', '🔋', '🔌', '🚺', '🚼', '⚧️',
      '🗯️', '♠️', '👯‍♀️', '🧖', '🧖‍♂️', '💡', '🔦', '🕯️', '🚻',
      '🚮', '🎦', '♣️', '♥️', '🧖‍♀️', '🧗', '🧗‍♂️', '🪔', '🧯',
      '🛢️', '📶', '🈁', '🔣', '♦️', '🃏', '🧗‍♀️', '🤺', '🏇',
      '💸', '💵', '💴', 'ℹ️', '🔤', '🔡', '🎴', '🀄', '⛷️', '🏂',
      '🏌️', '💶', '💷', '🪙', '🔠', '🆖', '🆗', '🕐', '🕑', '🏌️‍♂️',
      '🏌️‍♀️', '🏄', '💰', '💳', '💎', '🆙', '🆒', '🆕', '🕒',
      '🕓', '🏄‍♂️', '🏄‍♀️', '🚣', '⚖️', '🪜', '🧰', '🆓', '0️⃣',
      '1️⃣', '🕔', '🕕', '🚣‍♂️', '🚣‍♀️', '🏊', '🔧', '🔨', '⚒️',
      '2️⃣', '3️⃣', '4️⃣', '🕖', '🕗', '🏊‍♂️', '🏊‍♀️', '⛹️', '🛠️',
      '⛏️', '🪓', '5️⃣', '6️⃣', '7️⃣', '🕘', '🕙', '⛹️‍♂️', '⛹️‍♀️',
      '🏋️', '🪚', '🔩', '⚙️', '8️⃣', '9️⃣', '🔟', '🕚', '🕛',
      '🏋️‍♂️', '🏋️‍♀️', '🚴', '🪤', '🧱', '⛓️', '🔢', '#️⃣', '*️⃣',
      '🕜', '🕝', '🚴‍♂️', '🚴‍♀️', '🚵', '🧲', '🔫', '💣', '⏏️',
      '▶️', '⏸️', '🕞', '🕟', '🚵‍♂️', '🚵‍♀️', '🤸', '🧨', '🪓',
      '🔪', '⏯️', '⏹️', '⏺️', '🕠', '🕡', '🤸‍♂️', '🤸‍♀️', '🤼',
      '🗡️', '⚔️', '🛡️', '⏭️', '⏮️', '⏩', '🕢', '🕣', '🤼‍♂️',
      '🤼‍♀️', '🤽', '🚬', '⚰️', '🪦', '⏪', '⏫', '⏬', '🕤',
      '🕥', '🤽‍♂️', '🤽‍♀️', '🤾', '⚱️', '🏺', '🔮', '◀️', '🔼',
      '🔽', '🕦', '🕧', '🤾‍♂️', '🤾‍♀️', '🤹', '📿', '🧿', '💈',
      '➡️', '⬅️', '⬆️', '🇦🇫', '🇦🇽', '🤹‍♂️', '🤹‍♀️', '🧘', '⚗️',
      '🔭', '🔬', '⬇️', '↗️', '↘️', '🇦🇱', '🇩🇿', '🧘‍♂️', '🧘‍♀️',
      '🛀', '🕳️', '🩹', '🩺', '↙️', '↖️', '↕️', '🇦🇸', '🇦🇩',
      '🛌', '🚗', '🚕', '💊', '💉', '🩸', '↔️', '↪️', '↩️', '🇦🇴',
      '🇦🇮', '🚙', '🚌', '🚎', '🧬', '🦠', '🧫', '⤴️', '⤵️',
      '🔀', '🇦🇶', '🇦🇬', '🏎️', '🚓', '🚑', '🧪', '🌡️', '🧹',
      '🔁', '🔂', '🔄', '🇦🇷', '🇦🇲', '🚒', '🚐', '🛻', '🪠',
      '🧺', '🧻', '🔃', '🎵', '🎶', '🇦🇼', '🇦🇺', '🚚', '🚛',
      '🚜', '🚽', '🚰', '🚿', '➕', '➖', '➗', '🇦🇹', '🇦🇿',
      '🏍️', '🛵', '🚲', '🛁', '🛀', '🧼', '✖️', '🟰', '♾️', '🇧🇸',
      '🇧🇭', '🛴', '🛹', '🛼', '🪥', '🪒', '🧽', '💲', '💱',
      '™️', '🇧🇩', '🇧🇧', '🚁', '🛸', '✈️', '🪣', '🧴', '🛎️',
      '©️', '®️', '〰️', '🇧🇾', '🇧🇪', '🛩️', '🛫', '🛬', '🔑',
      '🗝️', '🚪', '➰', '➿', '🔚', '🇧🇿', '🇧🇯', '🪂', '💺',
      '🚀', '🪑', '🛋️', '🛏️', '🔙', '🔛', '🔝', '🇧🇲', '🇧🇹',
      '🛰️', '🚢', '🛥️', '🛌', '🧸', '🪆', '🔜', '✔️', '☑️', '🇧🇴',
      '🇧🇦', '🚤', '⛵', '🛶', '🖼️', '🪞', '🪟', '🔘', '🔴',
      '🟠', '🇧🇼', '🇧🇷', '⚓', '⛽', '🚧', '🛍️', '🛒', '🎁',
      '🟡', '🟢', '🔵', '🇮🇴', '🇻🇬', '🚨', '🚥', '🚦', '🎈',
      '🎏', '🎀', '🟣', '⚫', '⚪', '🇧🇳', '🇧🇬', '🛑', '🚏',
      '🗺️', '🪄', '🪅', '🎊', '🟤', '🔺', '🔻', '🇧🇫', '🇧🇮',
      '🗿', '🗽', '🗼', '🎉', '🎎', '🏮', '🔸', '🔹', '🔶', '🇰🇭',
      '🇨🇲', '🏰', '🏯', '🏟️', '🎐', '🪩', '🧧', '🔷', '🔳',
      '🔲', '🇨🇦', '🇮🇨', '🎡', '🎢', '🎠', '✉️', '📩', '📨',
      '▪️', '▫️', '◾', '🇨🇻', '🇧🇶', '⛲', '⛱️', '🏖️', '📧',
      '💌', '📥', '◽', '◼️', '◻️', '🇰🇾', '🇨🇫', '🏝️', '🏜️',
      '🌋', '📤', '📦', '🏷️', '🟥', '🟧', '🟨', '🇹🇩', '🇨🇱',
      '⛰️', '🏔️', '🗻', '🪧', '📪', '📫', '🟩', '🟦', '🟪', '🇨🇳',
      '🇨🇽', '🏕️', '⛺', '🏠', '📬', '📭', '📮', '⬛', '⬜',
      '🟫', '🇨🇨', '🇨🇴', '🏡', '🏘️', '🏚️', '📯', '📜', '📃',
      '🔈', '🔇', '🔉', '🇰🇲', '🇨🇬', '🏗️', '🏭', '🏢', '📄',
      '📑', '🧾', '🔊', '🔔', '🔕', '🇨🇩', '🇨🇰', '🏬', '🏣',
      '🏤', '📊', '📈', '📉', '📣', '📢', '👁️‍🗨️', '🇨🇷', '🇨🇮',
      '🏥', '🏦', '🏨', '🗒️', '🗓️', '📆', '💬', '💭', '🗯️',
      '🇭🇷', '🇨🇺', '🏪', '🏫', '🏩', '📅', '🗑️', '📇', '♠️',
      '♣️', '♥️', '🇨🇼', '🇨🇾', '💒', '🏛️', '⛪', '🗃️', '🗳️',
      '🗄️', '♦️', '🃏', '🎴', '🇨🇿', '🇩🇰', '🕌', '🛕', '🕍',
      '📋', '📁', '📂', '🀄', '🕐', '🕑', '🇩🇯', '🇩🇲', '🕋',
      '⛩️', '🛤️', '🗂️', '🗞️', '📰', '🕒', '🕓', '🕔', '🇩🇴',
      '🇪🇨', '🛣️', '🗾', '🎑', '📓', '📔', '📒', '🕕', '🕖',
      '🕗', '🇪🇬', '🇸🇻', '🏞️', '🌅', '🌄', '📕', '📗', '📘',
      '🕘', '🕙', '🕚', '🇬🇶', '🇪🇷', '🌠', '🎇', '🎆', '📙',
      '📚', '📖', '🕛', '🕜', '🕝', '🇪🇪', '🇪🇹', '🌇', '🌆',
      '🏙️', '🔖', '🧷', '🔗', '🕞', '🕟', '🕠', '🇪🇺', '🇫🇰',
      '🌃', '🌌', '🌉', '📎', '🖇️', '📐', '🕡', '🕢', '🕣', '🇫🇴',
      '🇫🇯', '🌁', '⌚', '📱', '📏', '🧮', '📌', '🕤', '🕥',
      '🕦', '🇫🇮', '🇫🇷', '📲', '💻', '⌨️', '📍', '✂️', '🖊️',
      '🕧', '🏴', '🏳️', '🇬🇫', '🇵🇫', '🖥️', '🖨️', '🖱️', '🖋️',
      '✒️', '🖌️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇹🇫', '🇬🇦', '🖲️',
      '🕹️', '🗜️', '🖍️', '📝', '✏️'
    ];
      
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    
    if (tier >= cancerSuffixes.length) {
      const sciResult = decimal.toExponential(precision);
      return this.numberToCancer(sciResult) + ' �';
    } 
    
    const suffix = cancerSuffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    
    let scaledStr;
    if (scaled >= 100) {
      scaledStr = Math.floor(scaled).toString();
    } else if (scaled >= 10) {
      scaledStr = scaled.toFixed(1);
    } else {
      scaledStr = scaled.toFixed(2);
    }
    
    return scaledStr + suffix;
  },

  // Zalgo notation (chaotic text corruption)
  formatZalgo: function(decimal, precision = 2) {
    const num = decimal.toNumber();
    
    // For small numbers, apply light zalgo corruption
    if (decimal.lt(1e3)) {
      let result;
      if (num >= 10) {
        result = Math.floor(num).toString();
      } else if (num >= 1) {
        result = num.toFixed(1);
      } else {
        result = num.toFixed(2);
      }
      return this.applyZalgo(result, 1); // Light corruption
    }
    
    // Use standard suffixes but with increasing zalgo corruption
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    
    if (tier >= suffixes.length) {
      return this.applyZalgo(decimal.toExponential(precision), Math.min(tier, 10));
    }
    
    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    
    let scaledStr;
    if (scaled >= 100) {
      scaledStr = Math.floor(scaled).toString();
    } else if (scaled >= 10) {
      scaledStr = scaled.toFixed(1);
    } else {
      scaledStr = scaled.toFixed(2);
    }
    
    // Apply zalgo corruption based on tier (higher tiers = more corruption)
    const corruptionLevel = Math.min(tier + 1, 8);
    return this.applyZalgo(scaledStr + suffix, corruptionLevel);
  },

  // Apply zalgo text corruption
  applyZalgo: function(text, intensity = 3) {
    // Zalgo combining characters - these appear above, below, and through text
    const zalgoUp = [
      '̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'
    ];
    
    const zalgoDown = [
      '̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣', '̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '̷'
    ];
    
    const zalgoMid = [
      '̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '̷', '̸', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '̷', '̸', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '̷', '̸', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '̷', '̸'
    ];
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      result += text[i];
      
      // Add random zalgo characters based on intensity
      const numChars = Math.floor(Math.random() * intensity) + 1;
      
      for (let j = 0; j < numChars; j++) {
        const type = Math.floor(Math.random() * 3);
        let zalgoArray;
        
        switch (type) {
          case 0:
            zalgoArray = zalgoUp;
            break;
          case 1:
            zalgoArray = zalgoDown;
            break;
          case 2:
            zalgoArray = zalgoMid;
            break;
        }
        
        const randomChar = zalgoArray[Math.floor(Math.random() * zalgoArray.length)];
        result += randomChar;
      }
    }
    
    return result;
  },

  // Convert regular digits to cancer emojis
  numberToCancer: function(str) {
    const cancerDigits = {
      '0': '0',  // zero = crying
      '1': '1',  // one = huffing
      '2': '2',  // two = clown
      '3': '3',  // three = fire
      '4': '4',  // four = skull
      '5': '5',  // five = crown
      '6': '6',  // six = star
      '7': '7',  // seven = rocket
      '8': '8',  // eight = diamond
      '9': '9',  // nine = demon
      '.': '.',  // decimal = mask
      'e': 'e',  // exponent = circus
      '+': '+',  // plus = sparkles
      '-': '-'   // minus = explosion
    };
    
    return str.split('').map(char => cancerDigits[char] || char).join('');
  },

  // Safe math operations that always return Decimals
  add: function(a, b) {
    return new Decimal(a).add(new Decimal(b));
  },

  sub: function(a, b) {
    return new Decimal(a).sub(new Decimal(b));
  },

  mul: function(a, b) {
    return new Decimal(a).mul(new Decimal(b));
  },

  // Alias for mul for compatibility
  multiply: function(a, b) {
    return new Decimal(a).mul(new Decimal(b));
  },

  div: function(a, b) {
    return new Decimal(a).div(new Decimal(b));
  },

  pow: function(a, b) {
    return new Decimal(a).pow(new Decimal(b));
  },

  max: function(a, b) {
    return Decimal.max(new Decimal(a), new Decimal(b));
  },

  min: function(a, b) {
    return Decimal.min(new Decimal(a), new Decimal(b));
  },

  floor: function(a) {
    return new Decimal(a).floor();
  },

  ceil: function(a) {
    return new Decimal(a).ceil();
  },

  round: function(a) {
    return new Decimal(a).round();
  },

  // Comparison helpers
  eq: function(a, b) {
    return new Decimal(a).eq(new Decimal(b));
  },

  lt: function(a, b) {
    return new Decimal(a).lt(new Decimal(b));
  },

  lte: function(a, b) {
    return new Decimal(a).lte(new Decimal(b));
  },

  gt: function(a, b) {
    return new Decimal(a).gt(new Decimal(b));
  },

  gte: function(a, b) {
    return new Decimal(a).gte(new Decimal(b));
  },

  // Check if a value is a Decimal
  isDecimal: function(value) {
    return value instanceof Decimal;
  },

  // Initialize game state with Decimal values
  initializeGameState: function(state) {
    // Convert all numerical properties to Decimals
    const numericProps = [
      'fluff', 'swaria', 'feathers', 'artifacts', 'grade',
      'boxesProduced', 'powerEnergy', 'powerMaxEnergy',
      'fluffInfinityCount', 'swariaInfinityCount', 'feathersInfinityCount', 'artifactsInfinityCount',
      'berryPlate', 'mushroomSoup', 'batteries',
      'glitteringPetals', 'chargedPrisma', 'mysticCookingSpeedBoost', 'soapBatteryBoost',
      'fluzzerGlitteringPetalsBoost', 'peachyHungerBoost'
    ];

    numericProps.forEach(prop => {
      if (typeof state[prop] === 'number') {
        state[prop] = new Decimal(state[prop]);
      } else if (!state[prop] || !(state[prop] instanceof Decimal)) {
        state[prop] = new Decimal(0);
      }
    });

    // Handle swariaKnowledge.kp specifically
    if (state.swariaKnowledge && typeof state.swariaKnowledge.kp === 'number') {
      state.swariaKnowledge.kp = new Decimal(state.swariaKnowledge.kp);
    } else if (!state.swariaKnowledge || !state.swariaKnowledge.kp || !(state.swariaKnowledge.kp instanceof Decimal)) {
      if (!state.swariaKnowledge) state.swariaKnowledge = {};
      state.swariaKnowledge.kp = new Decimal(0);
    }

    // Handle nested objects
    if (state.boxesProducedByType) {
      Object.keys(state.boxesProducedByType).forEach(key => {
        if (typeof state.boxesProducedByType[key] === 'number') {
          state.boxesProducedByType[key] = new Decimal(state.boxesProducedByType[key]);
        }
      });
    }

    if (state.characterHunger) {
      Object.keys(state.characterHunger).forEach(key => {
        if (typeof state.characterHunger[key] === 'number') {
          state.characterHunger[key] = new Decimal(state.characterHunger[key]);
        }
      });
    }

    if (state.characterFullStatus) {
      Object.keys(state.characterFullStatus).forEach(key => {
        if (typeof state.characterFullStatus[key] === 'number') {
          state.characterFullStatus[key] = new Decimal(state.characterFullStatus[key]);
        }
      });
    }

    if (state.hardModeQuestProgress) {
      Object.keys(state.hardModeQuestProgress).forEach(key => {
        if (typeof state.hardModeQuestProgress[key] === 'number') {
          state.hardModeQuestProgress[key] = new Decimal(state.hardModeQuestProgress[key]);
        }
      });
    }

    return state;
  },

  // Convert state back to regular numbers for saving
  serializeGameState: function(state) {
    const serialized = JSON.parse(JSON.stringify(state));
    
    // Convert Decimals to strings for serialization
    function convertDecimals(obj) {
      for (let key in obj) {
        if (obj[key] instanceof Decimal) {
          obj[key] = obj[key].toString();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertDecimals(obj[key]);
        }
      }
    }
    
    convertDecimals(serialized);
    return serialized;
  },

  // Load and convert serialized state back to Decimals
  deserializeGameState: function(data) {
    // Convert string numbers back to Decimals
    function convertToDecimals(obj) {
      for (let key in obj) {
        if (typeof obj[key] === 'string' && /^-?\d*\.?\d+([eE][+-]?\d+)?$/.test(obj[key])) {
          obj[key] = new Decimal(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          convertToDecimals(obj[key]);
        }
      }
    }
    
    convertToDecimals(data);
    
    // Initialize the main state object if it exists
    if (data.state) {
      data.state = this.initializeGameState(data.state);
    }
    
    // Handle swariaKnowledge if it exists at top level
    if (data.swariaKnowledge && typeof data.swariaKnowledge.kp === 'string') {
      data.swariaKnowledge.kp = new Decimal(data.swariaKnowledge.kp);
    }
    
    return data;
  }
};

// Backward compatibility - replace global formatNumber function
window.formatNumber = window.DecimalUtils.formatDecimal;
window.formatNumberSci = window.DecimalUtils.formatDecimal;

console.log('Decimal utilities loaded successfully');
