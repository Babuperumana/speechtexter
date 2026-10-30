/**
 * Main Application Orchestrator for SpeechTexter
 * Connects speech recognition, rich editor, voice commands, TTS, UI modals, and export tools.
 */

import { LANGUAGES, getAllLocales, findLocale } from "./languages.js";
import {
  getCommandsForLocale,
  saveCommandsForLocale,
  resetCommandsForLocale,
  processVoiceCommands
} from "./commands.js";
import { SpeechManager } from "./speech.js";
import { EditorController } from "./editor.js";
import { TTSManager } from "./tts.js";

// Global App State
const state = {
  currentLocale: "en-US",
  isDarkTheme: false,
  isVoiceCommandsOn: true,
  isAutoSaveOn: true,
  usePreviewBox: true,
  capitalizeSentence: true,
  capitalizeParagraph: true,
  capitalizeEveryLetter: false,
  addPeriodAtEnd: false,
  pastePlainText: true,
  copyAllAsPlainText: false,
  useLongestAlternative: false,
  developerMode: false,
  layoutReverse: false,
  defaultFontSize: 16,
  defaultFontFamily: "Inter, sans-serif",
  micShortcut: "Escape", // or Space / Ctrl+M
  speechSessionTimer: null,
  speechSecondsElapsed: 0
};

// Load saved settings
function loadSettings() {
  try {
    const saved = localStorage.getItem("speechtexter_settings");
    if (saved) {
      Object.assign(state, JSON.parse(saved));
    }
    const savedLang = localStorage.getItem("speechtexter_selected_locale");
    if (savedLang) {
      state.currentLocale = savedLang;
    }
  } catch (e) {
    console.warn("Could not load settings:", e);
  }
}

function saveSettings() {
  try {
    localStorage.setItem("speechtexter_settings", JSON.stringify(state));
    localStorage.setItem("speechtexter_selected_locale", state.currentLocale);
  } catch (e) {
    console.warn("Could not save settings:", e);
  }
}

// DOM Elements cache
let elements = {};

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initDOMElements();
  initTheme();
  initEditor();
  initSpeech();
  initTTS();
  initLanguageSelector();
  initCommandsPanel();
  initSettingsModal();
  initToolbarActions();
  initExportMenu();
  initShortcuts();
  checkSecurityContext();
  updateLocaleDisplay();
});

function initDOMElements() {
  elements = {
    app: document.getElementById("app"),
    textEditor: document.getElementById("textEditor"),
    micBtn: document.getElementById("micBtn"),
    micPulseRing: document.getElementById("micPulseRing"),
    visualizerCanvas: document.getElementById("visualizerCanvas"),
    previewBox: document.getElementById("previewBox"),
    previewText: document.getElementById("previewText"),
    statusBadge: document.getElementById("statusBadge"),
    statusText: document.getElementById("statusText"),
    speechTimer: document.getElementById("speechTimer"),
    
    // Header
    langBtn: document.getElementById("langBtn"),
    langFlag: document.getElementById("langFlag"),
    langName: document.getElementById("langName"),
    commandsToggleBtn: document.getElementById("commandsToggleBtn"),
    ttsPlayBtn: document.getElementById("ttsPlayBtn"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    settingsBtn: document.getElementById("settingsBtn"),
    
    // Stats
    wordCountDisplay: document.getElementById("wordCountDisplay"),
    charCountDisplay: document.getElementById("charCountDisplay"),
    saveStatusDisplay: document.getElementById("saveStatusDisplay"),
    
    // Modals & Panels
    langModal: document.getElementById("langModal"),
    langSearchInput: document.getElementById("langSearchInput"),
    langListContainer: document.getElementById("langListContainer"),
    closeLangModalBtn: document.getElementById("closeLangModalBtn"),
    
    commandsDrawer: document.getElementById("commandsDrawer"),
    commandsListContainer: document.getElementById("commandsListContainer"),
    closeCommandsDrawerBtn: document.getElementById("closeCommandsDrawerBtn"),
    addCustomCommandBtn: document.getElementById("addCustomCommandBtn"),
    resetCommandsBtn: document.getElementById("resetCommandsBtn"),
    exportCommandsBtn: document.getElementById("exportCommandsBtn"),
    importCommandsBtn: document.getElementById("importCommandsBtn"),
    importFileInput: document.getElementById("importFileInput"),
    
    settingsModal: document.getElementById("settingsModal"),
    closeSettingsModalBtn: document.getElementById("closeSettingsModalBtn"),
    
    // Download menu
    downloadMenu: document.getElementById("downloadMenu"),
    downloadToggleBtn: document.getElementById("downloadToggleBtn"),
    downloadTxtBtn: document.getElementById("downloadTxtBtn"),
    downloadDocBtn: document.getElementById("downloadDocBtn"),
    downloadMdBtn: document.getElementById("downloadMdBtn"),
    downloadPdfBtn: document.getElementById("downloadPdfBtn"),
    
    // Custom Command Modal
    customCommandModal: document.getElementById("customCommandModal"),
    closeCustomCommandModalBtn: document.getElementById("closeCustomCommandModalBtn"),
    customTriggerInput: document.getElementById("customTriggerInput"),
    customReplacementInput: document.getElementById("customReplacementInput"),
    saveCustomCommandBtn: document.getElementById("saveCustomCommandBtn"),
    
    // Snackbar
    snackbar: document.getElementById("snackbar"),
    httpsBanner: document.getElementById("httpsBanner"),
    devDebugPanel: document.getElementById("devDebugPanel"),
    devDebugContent: document.getElementById("devDebugContent")
  };
}

let editor = null;
let speech = null;
let tts = null;

function initTheme() {
  if (state.isDarkTheme) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener("click", () => {
      state.isDarkTheme = !state.isDarkTheme;
      document.documentElement.classList.toggle("dark", state.isDarkTheme);
      saveSettings();
    });
  }
}

function initEditor() {
  const currentLocaleInfo = findLocale(state.currentLocale);
  editor = new EditorController(elements.textEditor, {
    isAutoSaveOn: state.isAutoSaveOn,
    pastePlainText: state.pastePlainText,
    capitalizeFirstLetterNewSentence: state.capitalizeSentence,
    capitalizeFirstLetterNewParagraph: state.capitalizeParagraph,
    capitalizeEveryLetter: state.capitalizeEveryLetter,
    fontSize: state.defaultFontSize,
    fontFamily: state.defaultFontFamily,
    dir: currentLocaleInfo.dir || "ltr",
    onStatsUpdate: (stats) => {
      if (elements.wordCountDisplay) elements.wordCountDisplay.textContent = `${stats.words} words`;
      if (elements.charCountDisplay) elements.charCountDisplay.textContent = `${stats.chars} characters`;
    },
    onAutoSaved: (timeStr) => {
      if (elements.saveStatusDisplay) {
        elements.saveStatusDisplay.textContent = `Autosaved ${timeStr}`;
      }
    }
  });

  if (state.layoutReverse) {
    elements.app.classList.add("layout-reverse");
  }
}

function initSpeech() {
  speech = new SpeechManager({
    lang: state.currentLocale,
    useLongestAlternative: state.useLongestAlternative,
    onStatusChange: (status, message) => {
      updateStatusBadge(status, message);
      if (status === "listening") {
        elements.micBtn.classList.add("recording");
        elements.micPulseRing.classList.add("active");
        startSpeechTimer();
      } else if (status === "idle") {
        elements.micBtn.classList.remove("recording");
        elements.micPulseRing.classList.remove("active");
        stopSpeechTimer();
        hidePreview();
      }
    },
    onInterim: (text) => {
      if (state.usePreviewBox) {
        showPreview(text);
      }
    },
    onFinal: (text, confidence, alternatives) => {
      hidePreview();

      // Run through Voice Commands Engine
      const { processedText, actionsTriggered } = processVoiceCommands(
        text,
        state.currentLocale,
        state.isVoiceCommandsOn
      );

      // Handle triggered actions (e.g. undo, redo, clear, delete word)
      actionsTriggered.forEach((action) => {
        if (action === "__ACTION_DELETE_WORD__") editor.deleteLastWord();
        if (action === "__ACTION_CLEAR__") editor.clear();
        if (action === "__ACTION_UNDO__") document.execCommand("undo");
        if (action === "__ACTION_REDO__") document.execCommand("redo");
      });

      // Insert remaining processed text
      if (processedText && processedText.trim()) {
        editor.insertDictatedText(processedText);
      }

      // If developer debug mode is on
      if (state.developerMode && elements.devDebugPanel) {
        updateDeveloperDebug(confidence, processedText, alternatives);
      }
    },
    onAudioLevel: (level, freqArray) => {
      renderVisualizer(level, freqArray);
    },
    onError: (type, message) => {
      showToast(message, type === "not_supported" || type === "permission_denied" ? "error" : "warning");
    }
  });

  if (elements.micBtn) {
    elements.micBtn.addEventListener("click", () => {
      speech.toggle();
    });
  }
}

function initTTS() {
  tts = new TTSManager({
    lang: state.currentLocale,
    onStart: () => {
      if (elements.ttsPlayBtn) {
        elements.ttsPlayBtn.classList.add("playing");
        elements.ttsPlayBtn.setAttribute("title", "Stop reading aloud");
      }
    },
    onEnd: () => {
      if (elements.ttsPlayBtn) {
        elements.ttsPlayBtn.classList.remove("playing");
        elements.ttsPlayBtn.setAttribute("title", "Read aloud note");
      }
    },
    onError: (e) => {
      showToast("Speech synthesis error", "warning");
    }
  });

  if (elements.ttsPlayBtn) {
    elements.ttsPlayBtn.addEventListener("click", () => {
      const text = editor.getText();
      if (!text || text.trim() === "") {
        showToast("Note is empty. Nothing to read aloud.", "info");
        return;
      }
      tts.toggle(text, state.currentLocale);
    });
  }
}

// Audio Visualizer Canvas Renderer
function renderVisualizer(level, freqArray) {
  const canvas = elements.visualizerCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!speech || !speech.isListening) return;

  // Draw frequency wave bars
  const barCount = 18;
  const barWidth = 3;
  const gap = 3;
  const startX = (width - (barCount * (barWidth + gap))) / 2;

  ctx.fillStyle = state.isDarkTheme ? "#60a5fa" : "#2563eb";

  for (let i = 0; i < barCount; i++) {
    const val = freqArray ? freqArray[i % freqArray.length] / 255 : level;
    const barHeight = Math.max(3, val * height * 0.85);
    const x = startX + i * (barWidth + gap);
    const y = (height - barHeight) / 2;
    
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 2);
    ctx.fill();
  }
}

// Preview Box
function showPreview(text) {
  if (!elements.previewBox || !elements.previewText) return;
  elements.previewText.textContent = text;
  elements.previewBox.classList.remove("hidden");
}

function hidePreview() {
  if (!elements.previewBox) return;
  elements.previewBox.classList.add("hidden");
  if (elements.previewText) elements.previewText.textContent = "";
}

// Speech Timer
function startSpeechTimer() {
  state.speechSecondsElapsed = 0;
  updateTimerDisplay();
  if (state.speechSessionTimer) clearInterval(state.speechSessionTimer);
  state.speechSessionTimer = setInterval(() => {
    state.speechSecondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopSpeechTimer() {
  if (state.speechSessionTimer) {
    clearInterval(state.speechSessionTimer);
    state.speechSessionTimer = null;
  }
}

function updateTimerDisplay() {
  if (!elements.speechTimer) return;
  const mins = Math.floor(state.speechSecondsElapsed / 60);
  const secs = state.speechSecondsElapsed % 60;
  elements.speechTimer.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Status Badge
function updateStatusBadge(status, message) {
  if (!elements.statusBadge || !elements.statusText) return;
  elements.statusBadge.className = `status-badge ${status}`;
  elements.statusText.textContent = message;
}

// Check Secure Context / HTTPS Requirement
function checkSecurityContext() {
  const isSecure = SpeechManager.isSecureContext();
  if (!isSecure && elements.httpsBanner) {
    elements.httpsBanner.classList.remove("hidden");
  }
}

// Language Selector Modal
function initLanguageSelector() {
  const locales = getAllLocales();

  const renderList = (filterText = "") => {
    elements.langListContainer.innerHTML = "";
    const filter = filterText.toLowerCase().trim();

    const filtered = locales.filter((loc) => {
      return (
        loc.name.toLowerCase().includes(filter) ||
        loc.country.toLowerCase().includes(filter) ||
        loc.groupName.toLowerCase().includes(filter) ||
        loc.code.toLowerCase().includes(filter)
      );
    });

    if (filtered.length === 0) {
      elements.langListContainer.innerHTML = `<div class="p-6 text-center text-gray-500">No matching languages found</div>`;
      return;
    }

    filtered.forEach((loc) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `lang-item ${loc.code === state.currentLocale ? "active" : ""}`;
      item.innerHTML = `
        <span class="lang-flag">${loc.flag}</span>
        <div class="lang-info">
          <span class="lang-title">${loc.name}</span>
          <span class="lang-code">${loc.code} • ${loc.country}</span>
        </div>
      `;

      item.addEventListener("click", () => {
        selectLocale(loc.code);
        closeLanguageModal();
      });

      elements.langListContainer.appendChild(item);
    });
  };

  if (elements.langBtn) {
    elements.langBtn.addEventListener("click", () => {
      renderList(elements.langSearchInput.value);
      elements.langModal.classList.remove("hidden");
      elements.langSearchInput.focus();
    });
  }

  if (elements.closeLangModalBtn) {
    elements.closeLangModalBtn.addEventListener("click", closeLanguageModal);
  }

  if (elements.langSearchInput) {
    elements.langSearchInput.addEventListener("input", (e) => {
      renderList(e.target.value);
    });
  }

  // Click outside to close
  elements.langModal.addEventListener("click", (e) => {
    if (e.target === elements.langModal) closeLanguageModal();
  });
}

function closeLanguageModal() {
  if (elements.langModal) elements.langModal.classList.add("hidden");
}

function selectLocale(code) {
  state.currentLocale = code;
  saveSettings();
  updateLocaleDisplay();

  const locInfo = findLocale(code);
  if (speech) speech.setLanguage(code);
  if (editor) editor.setDirection(locInfo.dir || "ltr");
  if (tts) tts.options.lang = code;

  // Refresh voice commands list if drawer is open
  renderCommandsList();
  showToast(`Language set to ${locInfo.name}`);
}

function updateLocaleDisplay() {
  const loc = findLocale(state.currentLocale);
  if (elements.langFlag) elements.langFlag.textContent = loc.flag;
  if (elements.langName) elements.langName.textContent = loc.name;
}

// Commands Drawer & Custom Commands
function initCommandsPanel() {
  if (elements.commandsToggleBtn) {
    elements.commandsToggleBtn.addEventListener("click", () => {
      renderCommandsList();
      elements.commandsDrawer.classList.toggle("open");
    });
  }

  if (elements.closeCommandsDrawerBtn) {
    elements.closeCommandsDrawerBtn.addEventListener("click", () => {
      elements.commandsDrawer.classList.remove("open");
    });
  }

  if (elements.addCustomCommandBtn) {
    elements.addCustomCommandBtn.addEventListener("click", openCustomCommandModal);
  }

  if (elements.closeCustomCommandModalBtn) {
    elements.closeCustomCommandModalBtn.addEventListener("click", closeCustomCommandModal);
  }

  if (elements.saveCustomCommandBtn) {
    elements.saveCustomCommandBtn.addEventListener("click", saveCustomCommand);
  }

  if (elements.resetCommandsBtn) {
    elements.resetCommandsBtn.addEventListener("click", () => {
      if (confirm(`Reset voice commands for ${state.currentLocale} to defaults?`)) {
        resetCommandsForLocale(state.currentLocale);
        renderCommandsList();
        showToast("Voice commands reset to defaults");
      }
    });
  }

  if (elements.exportCommandsBtn) {
    elements.exportCommandsBtn.addEventListener("click", exportCommandsJSON);
  }

  if (elements.importCommandsBtn) {
    elements.importCommandsBtn.addEventListener("click", () => {
      elements.importFileInput.click();
    });
  }

  if (elements.importFileInput) {
    elements.importFileInput.addEventListener("change", importCommandsJSON);
  }
}

function renderCommandsList() {
  if (!elements.commandsListContainer) return;
  elements.commandsListContainer.innerHTML = "";

  const commands = getCommandsForLocale(state.currentLocale);
  const entries = Object.entries(commands);

  if (entries.length === 0) {
    elements.commandsListContainer.innerHTML = `<div class="p-4 text-center text-gray-500">No voice commands found. Add one above!</div>`;
    return;
  }

  entries.forEach(([trigger, replacement]) => {
    const row = document.createElement("div");
    row.className = "command-row";

    let displayReplacement = replacement;
    if (replacement === "\n") displayReplacement = "New Line [↵]";
    if (replacement === "\n\n") displayReplacement = "New Paragraph [↵↵]";
    if (replacement.startsWith("__ACTION_")) {
      displayReplacement = replacement.replace("__ACTION_", "").replace(/_/g, " ");
    }

    row.innerHTML = `
      <div class="command-trigger">"${trigger}"</div>
      <div class="command-arrow">➔</div>
      <div class="command-replacement">${escapeHtml(displayReplacement)}</div>
      <button type="button" class="command-del-btn" title="Delete command">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;

    row.querySelector(".command-del-btn").addEventListener("click", () => {
      delete commands[trigger];
      saveCommandsForLocale(state.currentLocale, commands);
      renderCommandsList();
      showToast(`Removed command: "${trigger}"`);
    });

    elements.commandsListContainer.appendChild(row);
  });
}

function openCustomCommandModal() {
  elements.customTriggerInput.value = "";
  elements.customReplacementInput.value = "";
  elements.customCommandModal.classList.remove("hidden");
  elements.customTriggerInput.focus();
}

function closeCustomCommandModal() {
  elements.customCommandModal.classList.add("hidden");
}

function saveCustomCommand() {
  const trigger = elements.customTriggerInput.value.trim().toLowerCase();
  const replacement = elements.customReplacementInput.value;

  if (!trigger) {
    showToast("Please enter a spoken trigger word or phrase", "warning");
    return;
  }

  const commands = getCommandsForLocale(state.currentLocale);
  commands[trigger] = replacement;
  saveCommandsForLocale(state.currentLocale, commands);

  closeCustomCommandModal();
  renderCommandsList();
  showToast(`Added command: "${trigger}" ➔ "${replacement}"`);
}

function exportCommandsJSON() {
  const commands = getCommandsForLocale(state.currentLocale);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(commands, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `speechtexter_commands_${state.currentLocale}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast("Commands exported as JSON");
}

function importCommandsJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (typeof parsed === "object" && parsed !== null) {
        saveCommandsForLocale(state.currentLocale, parsed);
        renderCommandsList();
        showToast("Custom commands imported successfully");
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      showToast("Invalid JSON file format", "error");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
}

// Settings Modal
function initSettingsModal() {
  if (elements.settingsBtn) {
    elements.settingsBtn.addEventListener("click", openSettingsModal);
  }

  if (elements.closeSettingsModalBtn) {
    elements.closeSettingsModalBtn.addEventListener("click", closeSettingsModal);
  }

  elements.settingsModal.addEventListener("click", (e) => {
    if (e.target === elements.settingsModal) closeSettingsModal();
  });

  // Wire settings inputs
  setupSettingSwitch("isAutoSaveOn", (val) => {
    state.isAutoSaveOn = val;
    editor.options.isAutoSaveOn = val;
  });

  setupSettingSwitch("usePreviewBox", (val) => {
    state.usePreviewBox = val;
  });

  setupSettingSwitch("isVoiceCommandsOn", (val) => {
    state.isVoiceCommandsOn = val;
  });

  setupSettingSwitch("capitalizeSentence", (val) => {
    state.capitalizeSentence = val;
    editor.options.capitalizeFirstLetterNewSentence = val;
  });

  setupSettingSwitch("capitalizeParagraph", (val) => {
    state.capitalizeParagraph = val;
    editor.options.capitalizeFirstLetterNewParagraph = val;
  });

  setupSettingSwitch("capitalizeEveryLetter", (val) => {
    state.capitalizeEveryLetter = val;
    editor.options.capitalizeEveryLetter = val;
  });

  setupSettingSwitch("pastePlainText", (val) => {
    state.pastePlainText = val;
    editor.options.pastePlainText = val;
  });

  setupSettingSwitch("copyAllAsPlainText", (val) => {
    state.copyAllAsPlainText = val;
  });

  setupSettingSwitch("useLongestAlternative", (val) => {
    state.useLongestAlternative = val;
    if (speech) speech.options.useLongestAlternative = val;
  });

  setupSettingSwitch("developerMode", (val) => {
    state.developerMode = val;
    if (elements.devDebugPanel) {
      elements.devDebugPanel.classList.toggle("hidden", !val);
    }
  });

  setupSettingSwitch("layoutReverse", (val) => {
    state.layoutReverse = val;
    elements.app.classList.toggle("layout-reverse", val);
  });

  // Font Size Buttons in Settings
  const fontMinusBtn = document.getElementById("fontSizeMinusBtn");
  const fontPlusBtn = document.getElementById("fontSizePlusBtn");
  const fontSizeVal = document.getElementById("fontSizeValue");

  if (fontSizeVal) fontSizeVal.textContent = state.defaultFontSize;

  if (fontMinusBtn) {
    fontMinusBtn.addEventListener("click", () => {
      if (state.defaultFontSize > 10) {
        state.defaultFontSize -= 2;
        if (fontSizeVal) fontSizeVal.textContent = state.defaultFontSize;
        editor.setFont(state.defaultFontFamily, state.defaultFontSize);
        saveSettings();
      }
    });
  }

  if (fontPlusBtn) {
    fontPlusBtn.addEventListener("click", () => {
      if (state.defaultFontSize < 36) {
        state.defaultFontSize += 2;
        if (fontSizeVal) fontSizeVal.textContent = state.defaultFontSize;
        editor.setFont(state.defaultFontFamily, state.defaultFontSize);
        saveSettings();
      }
    });
  }

  // Font Type Select
  const fontSelect = document.getElementById("fontSelect");
  if (fontSelect) {
    fontSelect.value = state.defaultFontFamily;
    fontSelect.addEventListener("change", (e) => {
      state.defaultFontFamily = e.target.value;
      editor.setFont(state.defaultFontFamily, state.defaultFontSize);
      saveSettings();
    });
  }
}

function setupSettingSwitch(id, onChange) {
  const el = document.getElementById(id);
  if (!el) return;
  el.checked = !!state[id];
  el.addEventListener("change", (e) => {
    state[id] = e.target.checked;
    onChange(e.target.checked);
    saveSettings();
  });
}

function openSettingsModal() {
  elements.settingsModal.classList.remove("hidden");
}

function closeSettingsModal() {
  elements.settingsModal.classList.add("hidden");
}

// Developer Debug
function updateDeveloperDebug(confidence, transcript, alternatives) {
  if (!elements.devDebugContent) return;
  const confidencePercent = (confidence * 100).toFixed(1);
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.className = "p-2 border-b border-gray-200 dark:border-gray-700 text-xs font-mono";
  entry.innerHTML = `
    <div class="text-blue-500 font-bold">[${time}] Confidence: ${confidencePercent}%</div>
    <div>${escapeHtml(transcript)}</div>
  `;
  elements.devDebugContent.prepend(entry);
}

// Rich Text Toolbar Actions
function initToolbarActions() {
  // Bold, Italic, Underline, Strikethrough
  document.getElementById("btnBold")?.addEventListener("click", () => editor.exec("bold"));
  document.getElementById("btnItalic")?.addEventListener("click", () => editor.exec("italic"));
  document.getElementById("btnUnderline")?.addEventListener("click", () => editor.exec("underline"));
  document.getElementById("btnStrikethrough")?.addEventListener("click", () => editor.exec("strikeThrough"));

  // Headings & Lists
  document.getElementById("btnH1")?.addEventListener("click", () => editor.exec("formatBlock", "<h1>"));
  document.getElementById("btnH2")?.addEventListener("click", () => editor.exec("formatBlock", "<h2>"));
  document.getElementById("btnBulletList")?.addEventListener("click", () => editor.exec("insertUnorderedList"));
  document.getElementById("btnNumberList")?.addEventListener("click", () => editor.exec("insertOrderedList"));

  // Alignment
  document.getElementById("btnAlignLeft")?.addEventListener("click", () => editor.exec("justifyLeft"));
  document.getElementById("btnAlignCenter")?.addEventListener("click", () => editor.exec("justifyCenter"));
  document.getElementById("btnAlignRight")?.addEventListener("click", () => editor.exec("justifyRight"));

  // Text Case toggles
  document.getElementById("btnCaseToggle")?.addEventListener("click", () => {
    editor.transformCase("sentence");
    showToast("Transformed to Sentence Case");
  });

  // Clear format
  document.getElementById("btnClearFormat")?.addEventListener("click", () => {
    editor.exec("removeFormat");
    showToast("Formatting cleared");
  });

  // Undo / Redo
  document.getElementById("btnUndo")?.addEventListener("click", () => document.execCommand("undo"));
  document.getElementById("btnRedo")?.addEventListener("click", () => document.execCommand("redo"));

  // New Note
  document.getElementById("btnNewNote")?.addEventListener("click", () => {
    const text = editor.getText();
    if (text && text.trim().length > 0) {
      if (confirm("Create a new note? Current content will be cleared.")) {
        editor.clear();
        showToast("Created new note");
      }
    } else {
      editor.clear();
    }
  });

  // Print Note
  document.getElementById("btnPrintNote")?.addEventListener("click", () => {
    window.print();
  });

  // Copy All Text
  document.getElementById("btnCopyAll")?.addEventListener("click", copyAllText);

  // Fullscreen
  if (elements.fullscreenBtn) {
    elements.fullscreenBtn.addEventListener("click", toggleFullscreen);
  }
}

// Copy All Text
function copyAllText() {
  const plain = editor.getText().trim();
  if (!plain) {
    showToast("There is nothing to copy", "info");
    return;
  }

  if (state.copyAllAsPlainText) {
    navigator.clipboard.writeText(plain)
      .then(() => showToast("Copied all as plain text"))
      .catch(() => showToast("Failed to copy", "error"));
  } else {
    // Copy HTML with fallback
    const html = editor.getHTML();
    const blobHtml = new Blob([html], { type: "text/html" });
    const blobText = new Blob([plain], { type: "text/plain" });
    const data = [new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText })];

    navigator.clipboard.write(data)
      .then(() => showToast("Copied formatted text"))
      .catch(() => {
        navigator.clipboard.writeText(plain)
          .then(() => showToast("Copied plain text"))
          .catch(() => showToast("Failed to copy", "error"));
      });
  }
}

// Export Menu
function initExportMenu() {
  if (elements.downloadToggleBtn) {
    elements.downloadToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.downloadMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      elements.downloadMenu.classList.add("hidden");
    });
  }

  elements.downloadTxtBtn?.addEventListener("click", () => exportNote("txt"));
  elements.downloadDocBtn?.addEventListener("click", () => exportNote("doc"));
  elements.downloadMdBtn?.addEventListener("click", () => exportNote("md"));
  elements.downloadPdfBtn?.addEventListener("click", () => window.print());
}

function exportNote(format) {
  const plain = editor.getText();
  const html = editor.getHTML();
  const title = `SpeechTexter_Note_${new Date().toISOString().slice(0, 10)}`;

  if (!plain.trim()) {
    showToast("Note is empty. Nothing to export.", "info");
    return;
  }

  let blob;
  let filename;

  if (format === "txt") {
    blob = new Blob([plain], { type: "text/plain;charset=utf-8" });
    filename = `${title}.txt`;
  } else if (format === "doc") {
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title></head>
      <body>${html}</body></html>
    `;
    blob = new Blob(["\ufeff", docHtml], { type: "application/msword;charset=utf-8" });
    filename = `${title}.doc`;
  } else if (format === "md") {
    blob = new Blob([plain], { type: "text/markdown;charset=utf-8" });
    filename = `${title}.md`;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      showToast(`Error enabling full-screen: ${err.message}`, "warning");
    });
  } else {
    document.exitFullscreen();
  }
}

// Keyboard Shortcuts
function initShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Escape or custom shortcut toggles microphone
    if (e.key === "Escape" && !elements.langModal.classList.contains("hidden")) {
      closeLanguageModal();
      return;
    }
    if (e.key === "Escape" && !elements.settingsModal.classList.contains("hidden")) {
      closeSettingsModal();
      return;
    }
    if (e.key === "Escape" && elements.commandsDrawer.classList.contains("open")) {
      elements.commandsDrawer.classList.remove("open");
      return;
    }

    if (e.key === "Escape") {
      speech.toggle();
      return;
    }

    // Ctrl+Q or Cmd+Q: Quick switch language
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "q") {
      e.preventDefault();
      elements.langBtn?.click();
      return;
    }

    // Ctrl+B: Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      editor.exec("bold");
      return;
    }

    // Ctrl+I: Italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      editor.exec("italic");
      return;
    }

    // Ctrl+U: Underline
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
      e.preventDefault();
      editor.exec("underline");
      return;
    }
  });
}

// Toast / Snackbar Notification
let toastTimer = null;
function showToast(message, type = "info") {
  const sb = elements.snackbar;
  if (!sb) return;

  sb.textContent = message;
  sb.className = `snackbar show ${type}`;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    sb.classList.remove("show");
  }, 3200);
}

// HTML escape helper
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
