/**
 * Text-to-Speech (TTS) Engine for SpeechTexter
 * Allows users to read aloud their dictated notes in the target language.
 */

export class TTSManager {
  constructor(options = {}) {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentUtterance = null;
    this.isPlaying = false;
    this.options = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: "en-US",
      onStart: options.onStart || (() => {}),
      onEnd: options.onEnd || (() => {}),
      onError: options.onError || (() => {}),
      onVoicesChanged: options.onVoicesChanged || (() => {}),
      ...options
    };

    this.initVoices();
  }

  static isSupported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  initVoices() {
    if (!TTSManager.isSupported()) return;

    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      this.options.onVoicesChanged(this.voices);
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Find best matching voice for a locale code (e.g., 'es-ES', 'ml-IN', 'fr-FR')
   */
  getBestVoice(langCode) {
    if (!this.voices || this.voices.length === 0) return null;

    const normalized = (langCode || "en-US").toLowerCase();
    const baseLang = normalized.split("-")[0];

    // 1. Exact match (e.g. en-US)
    let match = this.voices.find(v => v.lang.toLowerCase() === normalized);
    if (match) return match;

    // 2. Base match (e.g. en-*)
    match = this.voices.find(v => v.lang.toLowerCase().startsWith(baseLang));
    if (match) return match;

    // 3. Fallback
    return this.voices[0] || null;
  }

  /**
   * Speak given text
   */
  speak(text, langCode = this.options.lang) {
    if (!TTSManager.isSupported() || !text || text.trim() === "") return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = this.options.rate;
    utterance.pitch = this.options.pitch;
    utterance.volume = this.options.volume;

    const voice = this.getBestVoice(langCode);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.options.onStart();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      this.options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      this.currentUtterance = null;
      this.options.onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Stop speaking
   */
  stop() {
    if (!TTSManager.isSupported()) return;
    this.isPlaying = false;
    this.synth.cancel();
    this.currentUtterance = null;
    this.options.onEnd();
  }

  /**
   * Toggle speaking state
   */
  toggle(text, langCode) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.speak(text, langCode);
    }
  }
}
