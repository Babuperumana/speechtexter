/**
 * Speech Recognition & Audio Visualizer Module for SpeechTexter
 * Handles Web Speech API, Chrome keep-alive, and Web Audio API live microphone visualizer.
 */

export class SpeechManager {
  constructor(options = {}) {
    this.options = {
      lang: "en-US",
      continuous: true,
      interimResults: true,
      maxAlternatives: 5,
      useLongestAlternative: false,
      pauseDelayMs: 1500,
      ...options
    };

    this.recognition = null;
    this.isListening = false;
    this.isExplicitlyStopped = true;
    this.audioContext = null;
    this.audioStream = null;
    this.analyser = null;
    this.visualizerAnimationId = null;

    // Callbacks
    this.onInterim = options.onInterim || (() => {});
    this.onFinal = options.onFinal || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onAudioLevel = options.onAudioLevel || (() => {});
    this.onError = options.onError || (() => {});

    this.initRecognition();
  }

  /**
   * Check if Web Speech API is supported
   */
  static isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Check if current origin supports microphone access (HTTPS or localhost)
   */
  static isSecureContext() {
    return (
      window.isSecureContext ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }

  /**
   * Initialize SpeechRecognition instance
   */
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.onError("not_supported", "Web Speech API is not supported in this browser. Please use Chrome, Edge, or Brave.");
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = this.options.continuous;
      this.recognition.interimResults = this.options.interimResults;
      this.recognition.maxAlternatives = this.options.maxAlternatives;
      this.recognition.lang = this.options.lang;

      this.setupListeners();
    } catch (e) {
      console.error("Failed to initialize SpeechRecognition:", e);
      this.onError("init_failed", e.message);
    }
  }

  /**
   * Configure SpeechRecognition event listeners
   */
  setupListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStatusChange("listening", "Listening... Speak clearly into your microphone");
    };

    this.recognition.onspeechstart = () => {
      this.onStatusChange("speech_detected", "Speech detected...");
    };

    this.recognition.onspeechend = () => {
      this.onStatusChange("processing", "Processing speech...");
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      let confidence = 0;
      let alternativesList = [];

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];

        if (result.isFinal) {
          // If option to choose longest alternative is enabled
          if (this.options.useLongestAlternative && result.length > 1) {
            let longest = result[0].transcript;
            let bestConfidence = result[0].confidence;
            for (let j = 1; j < result.length; j++) {
              if (result[j].transcript.length > longest.length) {
                longest = result[j].transcript;
                bestConfidence = result[j].confidence;
              }
            }
            finalTranscript += longest;
            confidence = bestConfidence;
          } else {
            finalTranscript += result[0].transcript;
            confidence = result[0].confidence;
          }

          // Collect alternatives for developer / debug mode
          for (let j = 0; j < result.length; j++) {
            alternativesList.push({
              transcript: result[j].transcript,
              confidence: result[j].confidence
            });
          }
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (interimTranscript) {
        this.onInterim(interimTranscript);
      }

      if (finalTranscript) {
        this.onFinal(finalTranscript, confidence, alternativesList);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error, event.message);

      if (event.error === "no-speech") {
        // User paused speaking; perfectly normal in continuous dictation
        return;
      }

      if (event.error === "not-allowed") {
        this.isExplicitlyStopped = true;
        this.onError("permission_denied", "Microphone access was denied. Please allow microphone permissions in your browser.");
        this.stop();
        return;
      }

      if (event.error === "audio-capture") {
        this.isExplicitlyStopped = true;
        this.onError("no_microphone", "No microphone detected. Please plug in or enable a microphone.");
        this.stop();
        return;
      }

      if (event.error === "network") {
        this.onError("network", "Network error during speech recognition. Ensure your internet connection is active.");
        return;
      }

      this.onError(event.error, event.message || `Error: ${event.error}`);
    };

    this.recognition.onend = () => {
      // Chrome automatically stops recognition after a pause.
      // If user did not explicitly click Stop, auto-restart to keep continuous dictation alive!
      if (!this.isExplicitlyStopped && this.isListening) {
        try {
          this.recognition.start();
          this.onStatusChange("reconnecting", "Reconnecting listener...");
        } catch (e) {
          console.warn("Failed to auto-restart recognition:", e);
          setTimeout(() => {
            if (!this.isExplicitlyStopped) {
              try {
                this.recognition.start();
              } catch (err) {
                this.isListening = false;
                this.onStatusChange("idle", "Ready to dictate");
              }
            }
          }, 200);
        }
      } else {
        this.isListening = false;
        this.onStatusChange("idle", "Ready to dictate");
        this.stopVisualizer();
      }
    };
  }

  /**
   * Set language
   */
  setLanguage(langCode) {
    this.options.lang = langCode;
    if (this.recognition) {
      const wasListening = this.isListening;
      this.recognition.lang = langCode;
      if (wasListening) {
        this.restart();
      }
    }
  }

  /**
   * Set options
   */
  setOptions(newOpts) {
    this.options = { ...this.options, ...newOpts };
    if (this.recognition) {
      if (newOpts.lang) this.recognition.lang = newOpts.lang;
    }
  }

  /**
   * Start listening
   */
  async start() {
    if (!SpeechManager.isSupported()) {
      this.onError("not_supported", "Web Speech API is not supported in this browser.");
      return;
    }

    if (!SpeechManager.isSecureContext()) {
      this.onError("insecure_context", "Microphone dictation requires HTTPS or localhost. If hosting via Coolify, please configure an SSL certificate for your domain.");
    }

    this.isExplicitlyStopped = false;

    // Start audio visualizer first (requests mic stream & initializes Web Audio)
    try {
      await this.startVisualizer();
    } catch (e) {
      console.warn("Microphone stream for visualizer failed:", e);
    }

    try {
      this.recognition.start();
    } catch (e) {
      if (e.name !== "InvalidStateError") {
        console.error("Recognition start error:", e);
        this.onError("start_error", e.message);
      }
    }
  }

  /**
   * Stop listening
   */
  stop() {
    this.isExplicitlyStopped = true;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("Recognition stop error:", e);
      }
    }
    this.stopVisualizer();
    this.onStatusChange("idle", "Ready to dictate");
  }

  /**
   * Toggle listening state
   */
  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Restart recognition
   */
  restart() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      setTimeout(() => {
        if (!this.isExplicitlyStopped) {
          try {
            this.recognition.start();
          } catch (e) {}
        }
      }, 150);
    }
  }

  /**
   * Audio Visualizer: Connect Web Audio API to analyze microphone input volume
   */
  async startVisualizer() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioContext = new AudioContextClass();
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const analyzeAudio = () => {
        if (!this.isListening || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);

        // Compute average volume level (0 to 1)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(1, average / 128);

        this.onAudioLevel(normalizedLevel, dataArray);
        this.visualizerAnimationId = requestAnimationFrame(analyzeAudio);
      };

      analyzeAudio();
    } catch (e) {
      console.warn("Could not start audio visualizer:", e);
    }
  }

  /**
   * Stop visualizer and release audio tracks
   */
  stopVisualizer() {
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
      this.visualizerAnimationId = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.onAudioLevel(0, new Uint8Array(32));
  }
}
