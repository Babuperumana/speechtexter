/**
 * Rich Text Editor Controller for SpeechTexter
 * Handles formatting, auto-capitalization, punctuation rules, word counts, and localStorage autosave.
 */

export class EditorController {
  constructor(element, options = {}) {
    this.editor = element;
    this.options = {
      isAutoSaveOn: true,
      autoSaveKey: "speechtexter_autosave_content",
      pastePlainText: true,
      capitalizeFirstLetterNewSentence: true,
      capitalizeFirstLetterNewParagraph: true,
      capitalizeEveryLetter: false,
      addPeriodAtEnd: false,
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      dir: "ltr",
      onStatsUpdate: options.onStatsUpdate || (() => {}),
      onAutoSaved: options.onAutoSaved || (() => {}),
      ...options
    };

    this.undoStack = [];
    this.redoStack = [];
    this.maxStackSize = 50;
    this.autoSaveTimer = null;

    this.init();
  }

  init() {
    this.editor.setAttribute("contenteditable", "true");
    this.editor.setAttribute("spellcheck", "true");
    this.applyFontStyles();
    this.setupEventListeners();
    this.loadAutoSavedContent();
    this.updateStats();
  }

  setupEventListeners() {
    // Input & typing
    this.editor.addEventListener("input", () => {
      this.updateStats();
      this.scheduleAutoSave();
    });

    // Handle plain text paste
    this.editor.addEventListener("paste", (e) => {
      if (this.options.pastePlainText) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text/plain");
        document.execCommand("insertText", false, text);
        this.updateStats();
      }
    });

    // Save state on keyup for undo/redo
    this.editor.addEventListener("keydown", (e) => {
      // Ctrl+Z or Cmd+Z handled naturally or custom
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        // Let native undo occur, but sync stats
        setTimeout(() => this.updateStats(), 50);
      }
    });
  }

  /**
   * Set text direction (LTR or RTL)
   */
  setDirection(dir = "ltr") {
    this.options.dir = dir;
    this.editor.setAttribute("dir", dir);
    this.editor.style.textAlign = dir === "rtl" ? "right" : "left";
  }

  /**
   * Set Font Family & Size
   */
  setFont(fontFamily, fontSizePt) {
    if (fontFamily) {
      this.options.fontFamily = fontFamily;
      this.editor.style.fontFamily = fontFamily;
    }
    if (fontSizePt) {
      this.options.fontSize = fontSizePt;
      this.editor.style.fontSize = `${fontSizePt}pt`;
    }
  }

  applyFontStyles() {
    this.setFont(this.options.fontFamily, this.options.fontSize);
    this.setDirection(this.options.dir);
  }

  /**
   * Insert dictated text with intelligent spacing, capitalization, and punctuation rules
   */
  insertDictatedText(rawText) {
    if (!rawText) return;

    let text = rawText;

    // Apply Capitalization rules
    text = this.formatCapitalization(text);

    this.editor.focus();

    // Determine if leading space is required
    const selection = window.getSelection();
    let needsLeadingSpace = false;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(this.editor);
      preRange.setEnd(range.startContainer, range.startOffset);
      const textBefore = preRange.toString();

      if (textBefore.length > 0) {
        const lastChar = textBefore[textBefore.length - 1];
        // If last char is not a whitespace, newline, or open bracket/quote, and new text doesn't start with punctuation
        const isPunctuationFirst = /^[.,?!:;)\]}”]/.test(text.trim());
        if (!/\s|\n/.test(lastChar) && !isPunctuationFirst) {
          needsLeadingSpace = true;
        }
      }
    }

    if (needsLeadingSpace && !text.startsWith(" ")) {
      text = " " + text;
    }

    // Insert formatted text at current cursor location
    document.execCommand("insertText", false, text);

    // Scroll editor to caret if necessary
    this.scrollToCaret();

    this.updateStats();
    this.scheduleAutoSave();
  }

  /**
   * Format text according to auto-capitalization preferences
   */
  formatCapitalization(text) {
    let result = text;

    if (this.options.capitalizeEveryLetter) {
      return result.toUpperCase();
    }

    const currentText = this.getText();
    const isBeginning = currentText.trim().length === 0;

    // Capitalize first letter if beginning of note or after sentence ender
    if (this.options.capitalizeFirstLetterNewSentence) {
      // If editor is currently empty, capitalize first char
      if (isBeginning) {
        result = result.replace(/^\s*\w/, (c) => c.toUpperCase());
      } else {
        // Check character right before cursor
        const textBefore = this.getTextBeforeCaret();
        const trimmedBefore = textBefore.trimEnd();
        const lastChar = trimmedBefore[trimmedBefore.length - 1];

        if (!lastChar || [".", "!", "?", "\n"].includes(lastChar)) {
          result = result.replace(/^\s*\w/, (c) => c.toUpperCase());
        }
      }

      // Also capitalize inside the incoming transcript after period / exclamation / question
      result = result.replace(/([.!?]\s+)([a-z])/g, (match, prefix, char) => {
        return prefix + char.toUpperCase();
      });
    }

    return result;
  }

  /**
   * Helper: Get text content before current caret
   */
  getTextBeforeCaret() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return "";
    const range = sel.getRangeAt(0);
    const preRange = range.cloneRange();
    preRange.selectNodeContents(this.editor);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString();
  }

  /**
   * Helper: Move caret to the very end of editor
   */
  moveCaretToEnd() {
    this.editor.focus();
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();
    range.selectNodeContents(this.editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Scroll editor container so caret is visible
   */
  scrollToCaret() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 150) {
      this.editor.scrollTop = this.editor.scrollHeight;
    }
  }

  /**
   * Execute rich formatting command (bold, italic, underline, etc.)
   */
  exec(command, value = null) {
    this.editor.focus();
    document.execCommand(command, false, value);
    this.updateStats();
    this.scheduleAutoSave();
  }

  /**
   * Delete previous word (voice command trigger)
   */
  deleteLastWord() {
    this.editor.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    // Use browser native delete previous word if available
    document.execCommand("delete", false, null);
    this.updateStats();
  }

  /**
   * Change text case of selection or entire note
   * Mode: 'sentence' | 'title' | 'upper' | 'lower'
   */
  transformCase(mode = "sentence") {
    this.editor.focus();
    const sel = window.getSelection();
    let text = sel.toString();
    const isSelection = text.length > 0;

    if (!isSelection) {
      text = this.editor.innerText;
    }

    let transformed = text;
    switch (mode) {
      case "upper":
        transformed = text.toUpperCase();
        break;
      case "lower":
        transformed = text.toLowerCase();
        break;
      case "title":
        transformed = text.replace(/\b[a-z]/g, (c) => c.toUpperCase());
        break;
      case "sentence":
      default:
        transformed = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
    }

    if (isSelection) {
      document.execCommand("insertText", false, transformed);
    } else {
      this.editor.innerText = transformed;
    }

    this.updateStats();
    this.scheduleAutoSave();
  }

  /**
   * Get raw plain text
   */
  getText() {
    return this.editor.innerText || "";
  }

  /**
   * Get HTML content
   */
  getHTML() {
    return this.editor.innerHTML || "";
  }

  /**
   * Set HTML content
   */
  setHTML(html) {
    this.editor.innerHTML = html;
    this.updateStats();
    this.scheduleAutoSave();
  }

  /**
   * Clear all text
   */
  clear() {
    this.editor.innerHTML = "";
    this.updateStats();
    this.scheduleAutoSave();
  }

  /**
   * Calculate word count, char count, and estimated reading time
   */
  updateStats() {
    const raw = this.getText();
    const words = raw
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const wordCount = words.length;
    const charCount = raw.length;
    const charCountNoSpaces = raw.replace(/\s/g, "").length;
    const readingTimeMins = Math.ceil(wordCount / 200) || 1;

    this.options.onStatsUpdate({
      words: wordCount,
      chars: charCount,
      charsNoSpaces: charCountNoSpaces,
      readingTime: wordCount === 0 ? 0 : readingTimeMins
    });
  }

  /**
   * Autosave to LocalStorage
   */
  scheduleAutoSave() {
    if (!this.options.isAutoSaveOn) return;

    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(() => {
      this.saveToStorage();
    }, 600);
  }

  saveToStorage() {
    try {
      const content = this.getHTML();
      localStorage.setItem(this.options.autoSaveKey, content);
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      this.options.onAutoSaved(timeStr);
    } catch (e) {
      console.warn("Autosave to localStorage failed:", e);
    }
  }

  loadAutoSavedContent() {
    if (!this.options.isAutoSaveOn) return;
    try {
      const saved = localStorage.getItem(this.options.autoSaveKey);
      if (saved && saved.trim() !== "") {
        this.setHTML(saved);
      }
    } catch (e) {
      console.warn("Could not load autosaved note:", e);
    }
  }
}
