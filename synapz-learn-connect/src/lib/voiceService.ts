import { Room, RoomEvent, Track, RemoteVideoTrack, RemoteParticipant, DataPacket_Kind } from 'livekit-client';

interface VoiceServiceConfig {
  serverUrl?: string;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onSpeaking?: (isSpeaking: boolean) => void;
  onVideoTrack?: (videoElement: HTMLVideoElement) => void;
  onNavigate?: (route: string) => void;
  onError?: (error: Error) => void;
}

class VoiceService {
  private room: Room | null = null;
  private config: VoiceServiceConfig;
  private isConnected: boolean = false;
  private serverUrl: string;
  private attachedElements: HTMLElement[] = [];
  private videoElement: HTMLVideoElement | null = null;
  private audioElements: HTMLAudioElement[] = [];

  constructor(config: VoiceServiceConfig = {}) {
    this.config = config;
    // Use relative path to leverage Vite proxy in development
    this.serverUrl = config.serverUrl || '';
  }

  async connect(userId: string = 'user'): Promise<void> {
    try {
      // Get token from backend using relative path (proxied by Vite)
      const response = await fetch(`/api/token?user_id=${userId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const { token, url, room: roomName } = await response.json();

      // Create room instance
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners
      this.setupEventListeners();

      // Connect to the room
      await this.room.connect(url, token);
      this.isConnected = true;

      console.log('Connected to LiveKit room:', roomName);
      this.config.onConnected?.();

    } catch (error) {
      console.error('Error connecting to voice agent:', error);
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.room) return;

    // Track subscribed - when we receive audio or video from agent
    this.room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) {
        const audioElement = track.attach() as HTMLAudioElement;
        
        // Configure audio element for proper playback
        audioElement.autoplay = true;
        audioElement.volume = 1.0;
        
        // Add to DOM
        document.body.appendChild(audioElement);
        this.audioElements.push(audioElement);
        this.attachedElements.push(audioElement);
        
        // Attempt to play explicitly (in case autoplay is blocked)
        audioElement.play().catch(err => {
          console.warn('Audio autoplay blocked, user interaction may be required:', err);
          // The audio will start playing once the user interacts with the page
        });
        
        console.log('Agent audio track subscribed and configured for playback');
      } else if (track.kind === Track.Kind.Video) {
        // Store the video element reference to prevent double-cleanup
        this.videoElement = track.attach() as HTMLVideoElement;
        this.attachedElements.push(this.videoElement);
        console.log('Agent video track subscribed - Tavus avatar');
        this.config.onVideoTrack?.(this.videoElement);
      }
    });

    // Track unsubscribed - Let React handle video removal, we just clean audio
    this.room.on(RoomEvent.TrackUnsubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) {
        // Only handle audio cleanup here
        this.audioElements.forEach((element) => {
          try {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          } catch (error) {
            console.warn('Error removing audio element:', error);
          }
        });
        this.audioElements = [];
        console.log('Audio track unsubscribed and cleaned up');
      } else if (track.kind === Track.Kind.Video) {
        // Video is managed by React, just clear our reference
        this.videoElement = null;
        console.log('Video track unsubscribed (React will handle cleanup)');
      }
    });

    // Connection state changed
    this.room.on(RoomEvent.Disconnected, () => {
      this.isConnected = false;
      console.log('Disconnected from voice agent');
      this.config.onDisconnected?.();
    });

    // Audio speaking state changed
    this.room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
      const isSpeaking = speakers.length > 0;
      this.config.onSpeaking?.(isSpeaking);
    });

    // Data received - for navigation and other control commands
    this.room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant) => {
      console.log('[VoiceService] 📨 Data received event triggered');
      console.log('[VoiceService] Payload size:', payload.length, 'bytes');
      console.log('[VoiceService] From participant:', participant?.identity || 'unknown');
      
      try {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);
        console.log('[VoiceService] 📝 Decoded message:', message);
        
        const data = JSON.parse(message);
        console.log('[VoiceService] 📦 Parsed data:', data);
        
        // Handle navigation commands
        if (data.command === 'navigate' && data.route) {
          console.log('[VoiceService] 🚀 Navigation command detected!');
          console.log('[VoiceService] Route:', data.route);
          console.log('[VoiceService] Calling onNavigate callback...');
          
          if (this.config.onNavigate) {
            this.config.onNavigate(data.route);
            console.log('[VoiceService] ✅ onNavigate callback called successfully');
          } else {
            console.error('[VoiceService] ❌ onNavigate callback is not defined!');
          }
        } else {
          console.log('[VoiceService] ⚠️ Data received but not a navigation command:', data);
        }
      } catch (error) {
        console.error('[VoiceService] ❌ Error processing data message:', error);
        console.error('[VoiceService] Raw payload:', payload);
      }
    });

    // Error handling
    this.room.on(RoomEvent.Reconnecting, () => {
      console.log('Reconnecting to voice agent...');
    });
  }

  async disconnect(): Promise<void> {
    if (this.room) {
      // Clean up audio elements only (React handles video)
      this.cleanupAudioElements();
      
      // Clear references
      this.videoElement = null;
      this.attachedElements = [];
      
      await this.room.disconnect();
      this.room = null;
      this.isConnected = false;
      console.log('Disconnected from voice agent');
    }
  }

  private cleanupAudioElements(): void {
    // Only remove audio elements from DOM
    this.audioElements.forEach((element) => {
      try {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      } catch (error) {
        console.warn('Error removing audio element:', error);
      }
    });
    this.audioElements = [];
    console.log('Cleaned up audio elements');
  }

  async enableMicrophone(): Promise<void> {
    if (!this.room) {
      throw new Error('Not connected to room');
    }

    try {
      await this.room.localParticipant.setMicrophoneEnabled(true);
      console.log('Microphone enabled');
    } catch (error) {
      console.error('Error enabling microphone:', error);
      throw error;
    }
  }

  async disableMicrophone(): Promise<void> {
    if (!this.room) {
      throw new Error('Not connected to room');
    }

    try {
      await this.room.localParticipant.setMicrophoneEnabled(false);
      console.log('Microphone disabled');
    } catch (error) {
      console.error('Error disabling microphone:', error);
      throw error;
    }
  }

  getConnectionState(): boolean {
    return this.isConnected;
  }

  async toggleMicrophone(): Promise<boolean> {
    if (!this.room) {
      throw new Error('Not connected to room');
    }

    const currentState = this.room.localParticipant.isMicrophoneEnabled;
    
    if (currentState) {
      await this.disableMicrophone();
    } else {
      await this.enableMicrophone();
    }

    return !currentState;
  }
}

export default VoiceService;
