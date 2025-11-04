import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Volume2, X, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import VoiceService from '@/lib/voiceService';

const FloatingAIAvatar = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVideo, setHasVideo] = useState(false);
  
  const voiceServiceRef = useRef<VoiceService | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Initialize voice service
  useEffect(() => {
    console.log('[FloatingAIAvatar] Initializing voice service with navigate function');
    
    voiceServiceRef.current = new VoiceService({
      onConnected: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        console.log('[FloatingAIAvatar] Voice agent connected');
      },
      onDisconnected: () => {
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
        // Clear video element ref first
        videoElementRef.current = null;
        setHasVideo(false);
        console.log('[FloatingAIAvatar] Voice agent disconnected');
      },
      onSpeaking: (speaking) => {
        setIsSpeaking(speaking);
      },
      onVideoTrack: (videoElement) => {
        // Store video element reference
        videoElementRef.current = videoElement;
        videoElement.className = 'w-full h-full object-cover rounded-lg';
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = false;
        setHasVideo(true);
        console.log('[FloatingAIAvatar] Tavus video avatar received');
      },
      onNavigate: (route) => {
        console.log('[FloatingAIAvatar] ✅ Navigation command received:', route);
        console.log('[FloatingAIAvatar] Calling navigate function...');
        navigate(route);
        console.log('[FloatingAIAvatar] Navigate called successfully');
        toast({
          title: "Navigation",
          description: `Sara is taking you to ${route}`,
        });
      },
      onError: (err) => {
        setError(err.message);
        setIsConnecting(false);
        console.error('[FloatingAIAvatar] Voice agent error:', err);
      }
    });

    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.disconnect();
      }
    };
  }, [navigate, toast]);

  const connectToVoiceAgent = async () => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await voiceServiceRef.current?.connect('user_' + Date.now());
      // Enable microphone automatically after connection
      await voiceServiceRef.current?.enableMicrophone();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to connect:', err);
      setError('Failed to connect to voice agent. Make sure the backend is running.');
      setIsConnecting(false);
    }
  };

  const disconnectFromVoiceAgent = async () => {
    try {
      // Clear state first
      setHasVideo(false);
      videoElementRef.current = null;
      
      await voiceServiceRef.current?.disconnect();
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const toggleListening = async () => {
    if (!isConnected) {
      await connectToVoiceAgent();
      return;
    }

    try {
      const newState = await voiceServiceRef.current?.toggleMicrophone();
      setIsListening(newState || false);
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
    }
  };

  const handleAvatarClick = () => {
    setIsExpanded(true);
    if (!isConnected && !isConnecting) {
      connectToVoiceAgent();
    }
  };

  if (isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
        <Card className="w-96 p-4 shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                  AI
                </div>
                {(isListening || isSpeaking) && (
                  <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">AI Video Assistant</p>
                <p className="text-xs text-muted-foreground">
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Container */}
          <div className="mb-4 relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '320px' }}>
            <div ref={videoContainerRef} className="w-full h-full">
              {hasVideo && videoElementRef.current && (
                <VideoDisplay videoElement={videoElementRef.current} />
              )}
              {!hasVideo && isConnected && (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Loading video avatar...</p>
                  </div>
                </div>
              )}
              {!hasVideo && !isConnected && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold mx-auto mb-2 shadow-lg">
                      AI
                    </div>
                    <p className="text-sm">Connect to see Sara</p>
                  </div>
                </div>
              )}
            </div>
            {/* Video overlay indicators */}
            {hasVideo && (
              <>
                {isListening && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse">
                    <Mic className="w-3 h-3" />
                    Listening
                  </div>
                )}
                {isSpeaking && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pulse">
                    <Volume2 className="w-3 h-3" />
                    Speaking
                  </div>
                )}
              </>
            )}
          </div>

          {/* Status Indicator */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : isListening ? (
                <Mic className="w-4 h-4 text-red-500 animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-4 h-4 text-primary animate-pulse" />
              ) : isConnected ? (
                <Mic className="w-4 h-4 text-green-500" />
              ) : (
                <Mic className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {isConnecting ? 'Connecting...' : 
                 !isConnected ? 'Click to connect' :
                 isListening ? 'Listening to you...' : 
                 isSpeaking ? 'Sara is speaking...' : 
                 'Connected - Ready to help'}
              </span>
            </div>
            
            {error && (
              <div className="mb-2 p-2 bg-destructive/10 text-destructive text-xs rounded">
                {error}
              </div>
            )}
            
            {/* Audio Wave Visualization */}
            {(isListening || isSpeaking) && (
              <div className="flex items-center justify-center gap-1 h-12">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 30}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            {!isConnected ? (
              <Button
                size="sm"
                className="w-full"
                onClick={connectToVoiceAgent}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Connect to Sara
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={toggleListening}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isListening ? 'Mute Mic' : 'Unmute Mic'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-destructive"
                  onClick={disconnectFromVoiceAgent}
                >
                  <X className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </>
            )}
          </div>

          {/* Suggestions */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Try saying:</p>
            <div className="space-y-1">
              {['Next lesson', 'Repeat that', 'Go to dashboard', 'Show my progress'].map((suggestion) => (
                <button
                  key={suggestion}
                  className="text-xs text-primary hover:underline block"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <div className="relative group">
        {/* Main Avatar */}
        <button
          onClick={handleAvatarClick}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
          disabled={isConnecting}
          type="button"
        >
          {isConnecting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <span className="text-xl">AI</span>
          )}
          
          {/* Pulse Effect */}
          {(isListening || isSpeaking) && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
            </>
          )}

          {/* Connection Status Indicator */}
          {isConnected && (
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}

          {/* Listening Indicator */}
          {isListening && isConnected && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse">
              <Mic className="w-2 h-2 text-white mx-auto mt-0.5" />
            </div>
          )}

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse">
              <Volume2 className="w-2 h-2 text-white mx-auto mt-0.5" />
            </div>
          )}
        </button>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Click to open AI Assistant
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>

        {/* Micro Animation Circles */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse pointer-events-none" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
};

// Separate component to handle video element mounting
const VideoDisplay = ({ videoElement }: { videoElement: HTMLVideoElement }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && videoElement) {
      // Only append if not already a child
      if (videoElement.parentNode !== container) {
        container.appendChild(videoElement);
        console.log('Video element mounted to container');
      }
    }

    // Cleanup function - safely remove if it's still a child
    return () => {
      if (container && videoElement && videoElement.parentNode === container) {
        try {
          container.removeChild(videoElement);
          console.log('Video element safely removed from container');
        } catch (error) {
          // Element was already removed, ignore
          console.log('Video element already removed');
        }
      }
    };
  }, [videoElement]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default FloatingAIAvatar;
