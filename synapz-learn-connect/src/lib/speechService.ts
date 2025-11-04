// Speech Service using Web Speech API for TTS and STT
// This is a browser-native solution that doesn't require additional dependencies

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechServiceConfig {
  onResult?: (result: SpeechRecognitionResult) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  language?: string;
}

class SpeechService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private config: SpeechServiceConfig;

  constructor(config: SpeechServiceConfig = {}) {
    this.config = {
      language: 'en-US',
      ...config,
    };
    this.synthesis = window.speechSynthesis;
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.config.language;

    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const confidence = lastResult[0].confidence;
      const isFinal = lastResult.isFinal;

      this.config.onResult?.({
        transcript,
        confidence,
        isFinal,
      });
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.config.onEnd?.();
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      
      // Handle specific error types
      if (event.error === 'no-speech') {
        // Don't treat no-speech as a critical error
        console.log('No speech detected, stopping listening');
        return; // Don't call error callback for no-speech
      }
      
      if (event.error === 'aborted') {
        // User manually stopped, not an error
        console.log('Speech recognition aborted');
        return;
      }
      
      // For other errors, notify the callback
      this.config.onError?.(event.error);
    };
  }

  // Start listening for speech
  startListening(): void {
    if (!this.recognition) {
      this.config.onError?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.config.onError?.('Failed to start listening');
    }
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Speak text using TTS
  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.config.language || 'en-US';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  // Stop speaking
  stopSpeaking(): void {
    this.synthesis.cancel();
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  // Set language
  setLanguage(language: string): void {
    this.config.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  // Update callbacks
  updateConfig(config: Partial<SpeechServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export default SpeechService;
