/**
 * Voice Commands Engine & Dictionaries for SpeechTexter
 * Replaces spoken keywords with punctuation, symbols, structural formatting or triggers editor actions.
 */

export const DEFAULT_COMMANDS = {
  // English Defaults
  en: {
    "period": ".",
    "full stop": ".",
    "comma": ",",
    "question mark": "?",
    "exclamation mark": "!",
    "exclamation point": "!",
    "colon": ":",
    "semicolon": ";",
    "hyphen": "-",
    "dash": "—",
    "underscore": "_",
    "ellipsis": "...",
    "dot dot dot": "...",
    "new line": "\n",
    "next line": "\n",
    "new paragraph": "\n\n",
    "open quote": "“",
    "close quote": "”",
    "open parenthesis": "(",
    "close parenthesis": ")",
    "open bracket": "[",
    "close bracket": "]",
    "open brace": "{",
    "close brace": "}",
    "dollar sign": "$",
    "euro sign": "€",
    "pound sign": "£",
    "percent sign": "%",
    "at sign": "@",
    "hashtag": "#",
    "hash sign": "#",
    "ampersand": "&",
    "and sign": "&",
    "asterisk": "*",
    "star sign": "*",
    "plus sign": "+",
    "equals sign": "=",
    "forward slash": "/",
    "backslash": "\\",
    "degree sign": "°",
    "bullet point": "•",
    "delete last word": "__ACTION_DELETE_WORD__",
    "scratch that": "__ACTION_DELETE_WORD__",
    "clear note": "__ACTION_CLEAR__",
    "clear all": "__ACTION_CLEAR__",
    "undo": "__ACTION_UNDO__",
    "redo": "__ACTION_REDO__"
  },

  // Spanish Defaults
  es: {
    "punto": ".",
    "punto y seguido": ".",
    "punto y aparte": "\n",
    "coma": ",",
    "signo de interrogación": "?",
    "abrir interrogación": "¿",
    "cerrar interrogación": "?",
    "signo de exclamación": "!",
    "abrir exclamación": "¡",
    "cerrar exclamación": "!",
    "dos puntos": ":",
    "punto y coma": ";",
    "guion": "-",
    "nueva línea": "\n",
    "nuevo párrafo": "\n\n",
    "comillas": "\"",
    "abrir paréntesis": "(",
    "cerrar paréntesis": ")",
    "signo de porcentaje": "%",
    "arroba": "@",
    "borrar última palabra": "__ACTION_DELETE_WORD__",
    "deshacer": "__ACTION_UNDO__",
    "rehacer": "__ACTION_REDO__"
  },

  // French Defaults
  fr: {
    "point": ".",
    "virgule": ",",
    "point d'interrogation": "?",
    "point d'exclamation": "!",
    "deux points": ":",
    "point-virgule": ";",
    "tiret": "-",
    "à la ligne": "\n",
    "nouveau paragraphe": "\n\n",
    "ouvrir la parenthèse": "(",
    "fermer la parenthèse": ")",
    "guillemet": "\"",
    "pour cent": "%",
    "arobase": "@",
    "annuler": "__ACTION_UNDO__",
    "rétablir": "__ACTION_REDO__"
  },

  // German Defaults
  de: {
    "punkt": ".",
    "komma": ",",
    "fragezeichen": "?",
    "ausrufezeichen": "!",
    "doppelpunkt": ":",
    "semikolon": ";",
    "bindestrich": "-",
    "neue zeile": "\n",
    "neuer absatz": "\n\n",
    "klammer auf": "(",
    "klammer zu": ")",
    "anführungszeichen": "\"",
    "prozent": "%",
    "rückgängig": "__ACTION_UNDO__",
    "wiederholen": "__ACTION_REDO__"
  },

  // Malayalam Defaults
  ml: {
    "പൂർണ്ണവിരാമം": ".",
    "അല്പവിരാമം": ",",
    "ചോദ്യചിഹ്നം": "?",
    "ആശ്ചര്യചിഹ്നം": "!",
    "പുതിയ വരി": "\n",
    "പുതിയ ഖണ്ഡിക": "\n\n",
    "ബ്രാക്കറ്റ് തുടങ്ങുക": "(",
    "ബ്രാക്കറ്റ് അവസാനിപ്പിക്കുക": ")",
    "ശതമാനം": "%"
  },

  // Hindi Defaults
  hi: {
    "पूर्ण विराम": "।",
    "अल्पविराम": ",",
    "प्रश्न चिन्ह": "?",
    "विस्मयादिबोधक": "!",
    "नई पंक्ति": "\n",
    "नया पैराग्राफ": "\n\n",
    "प्रतिशत": "%"
  },

  // Arabic Defaults
  ar: {
    "نقطة": ".",
    "فاصلة": "،",
    "علامة استفهام": "؟",
    "علامة تعجب": "!",
    "نقطتان": ":",
    "فاصلة منقوطة": "؛",
    "سطر جديد": "\n",
    "فقرة جديدة": "\n\n",
    "فتح قوس": "(",
    "إغلاق قوس": ")",
    "علامة بالمائة": "٪"
  },

  // Russian Defaults
  ru: {
    "точка": ".",
    "запятая": ",",
    "вопросительный знак": "?",
    "восклицательный знак": "!",
    "двоеточие": ":",
    "точка с запятой": ";",
    "дефис": "-",
    "тире": "—",
    "новая строка": "\n",
    "новый абзац": "\n\n",
    "открыть скобку": "(",
    "закрыть скобку": ")",
    "знак процента": "%",
    "собака": "@",
    "отменить": "__ACTION_UNDO__"
  }
};

/**
 * Get active command map for a given language code
 * Checks localStorage for user-customized commands, falling back to built-in presets
 */
export function getCommandsForLocale(localeCode) {
  const baseLang = (localeCode || "en").split("-")[0].toLowerCase();
  const storageKey = `speechtexter_commands_${baseLang}`;
  
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse custom commands from storage, using defaults", e);
    }
  }

  // Fallback to built-in presets, or English if language has no presets
  return { ...(DEFAULT_COMMANDS[baseLang] || DEFAULT_COMMANDS.en) };
}

/**
 * Save custom commands for a language
 */
export function saveCommandsForLocale(localeCode, commandsObj) {
  const baseLang = (localeCode || "en").split("-")[0].toLowerCase();
  const storageKey = `speechtexter_commands_${baseLang}`;
  localStorage.setItem(storageKey, JSON.stringify(commandsObj));
}

/**
 * Reset commands to default for a language
 */
export function resetCommandsForLocale(localeCode) {
  const baseLang = (localeCode || "en").split("-")[0].toLowerCase();
  const storageKey = `speechtexter_commands_${baseLang}`;
  localStorage.removeItem(storageKey);
  return getCommandsForLocale(localeCode);
}

/**
 * Process text through voice commands
 * Returns: { processedText: string, actionsTriggered: string[] }
 */
export function processVoiceCommands(transcript, localeCode, isEnabled = true) {
  if (!isEnabled || !transcript) {
    return { processedText: transcript, actionsTriggered: [] };
  }

  const commands = getCommandsForLocale(localeCode);
  const actionsTriggered = [];
  let result = transcript;

  // Sort commands by trigger length descending to match longest phrases first (e.g., "exclamation mark" before "mark")
  const triggers = Object.keys(commands).sort((a, b) => b.length - a.length);

  for (const trigger of triggers) {
    const replacement = commands[trigger];
    if (!trigger) continue;

    // Build regex with safe escaping
    const escapedTrigger = trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // Check if it's an action command
    if (typeof replacement === "string" && replacement.startsWith("__ACTION_")) {
      const actionRegex = new RegExp(`(^|\\s)${escapedTrigger}(\\s|$)`, "gi");
      if (actionRegex.test(result)) {
        actionsTriggered.push(replacement);
        result = result.replace(actionRegex, " ").trim();
      }
      continue;
    }

    // Punctuation & symbols replacement:
    // If replacement is punctuation (e.g. '.', ',', '?', '!', ':', ';'), remove leading space
    const isPunctuation = /^[.,?!:;]/.test(replacement);
    
    if (isPunctuation) {
      const punctRegex = new RegExp(`\\s*${escapedTrigger}\\s*`, "gi");
      result = result.replace(punctRegex, replacement + " ");
    } else if (replacement === "\n" || replacement === "\n\n") {
      const lineRegex = new RegExp(`\\s*${escapedTrigger}\\s*`, "gi");
      result = result.replace(lineRegex, replacement);
    } else {
      const wordRegex = new RegExp(`(^|\\s)${escapedTrigger}(\\s|$)`, "gi");
      result = result.replace(wordRegex, `$1${replacement}$2`);
    }
  }

  return {
    processedText: result,
    actionsTriggered
  };
}
