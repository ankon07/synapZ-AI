import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-input-slider';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Trash2, Video, Upload, Loader2, MessageSquare, Settings } from 'lucide-react';
import * as words from '../lib/signLanguage/animations/words';
import * as alphabets from '../lib/signLanguage/animations/alphabets';
import { defaultPose } from '../lib/signLanguage/animations/defaultPose';
import type { AnimationRef } from '../lib/signLanguage/types';

const xbot = '/Models/xbot/xbot.glb';
const ybot = '/Models/ybot/ybot.glb';
const xbotPic = '/Models/xbot/xbot.png';
const ybotPic = '/Models/ybot/ybot.png';

const SignLanguageConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [bot, setBot] = useState(ybot);
  const [speed, setSpeed] = useState(0.1);
  const [pause, setPause] = useState(800);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoProcessing, setVideoProcessing] = useState(false);
  const [videoText, setVideoText] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<AnimationRef>({
    flag: false,
    pending: false,
    animations: [],
    characters: [],
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer(),
    camera: new THREE.PerspectiveCamera(),
    avatar: null,
    animate: () => {},
    speed: 0.1,
    pause: 800,
  });

  const textFromAudioRef = useRef<HTMLTextAreaElement>(null);
  const textFromInputRef = useRef<HTMLTextAreaElement>(null);
  const videoTextRef = useRef<HTMLTextAreaElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const ref = componentRef.current;
    ref.flag = false;
    ref.pending = false;
    ref.animations = [];
    ref.characters = [];
    ref.speed = speed;
    ref.pause = pause;

    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xdddddd);

    // Add ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    ref.scene.add(ambientLight);

    // Add directional light for better visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    ref.scene.add(directionalLight);

    // Add spot light
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 5, 5);
    ref.scene.add(spotLight);

    ref.renderer = new THREE.WebGLRenderer({ antialias: true });

    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const width = canvasElement.clientWidth;
      const height = canvasElement.clientHeight || 500;

      ref.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
      ref.renderer.setSize(width, height);

      canvasElement.innerHTML = '';
      canvasElement.appendChild(ref.renderer.domElement);

      ref.camera.position.z = 1.6;
      ref.camera.position.y = 1.4;

      const loader = new GLTFLoader();
      loader.load(
        bot,
        (gltf) => {
          gltf.scene.traverse((child) => {
            if (child.type === 'SkinnedMesh') {
              (child as any).frustumCulled = false;
            }
          });
          ref.avatar = gltf.scene;
          ref.scene.add(ref.avatar);
          defaultPose(ref);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    }

    ref.animate = () => {
      if (ref.animations.length === 0) {
        ref.pending = false;
        return;
      }
      requestAnimationFrame(ref.animate);
      
      const currentAnimation = ref.animations[0];
      
      if (currentAnimation && currentAnimation.length > 0) {
        if (!ref.flag) {
          const firstElement = currentAnimation[0];
          
          if (Array.isArray(currentAnimation) && 
              currentAnimation.length === 2 && 
              typeof firstElement === 'string' && 
              firstElement === 'add-text' &&
              typeof currentAnimation[1] === 'string') {
            setText((prev) => prev + currentAnimation[1]);
            ref.animations.shift();
          } 
          else if (Array.isArray(firstElement)) {
            for (let i = 0; i < currentAnimation.length; ) {
              const animFrame = currentAnimation[i] as any;
              if (!animFrame || !Array.isArray(animFrame) || animFrame.length !== 5) {
                currentAnimation.splice(i, 1);
                continue;
              }
              const [boneName, action, axis, limit, sign] = animFrame;
              
              try {
                const bone = ref.avatar?.getObjectByName(boneName);
                if (!bone || !bone[action]) {
                  currentAnimation.splice(i, 1);
                  continue;
                }
                
                if (sign === '+' && bone[action][axis] < (limit as number)) {
                  bone[action][axis] += speed;
                  bone[action][axis] = Math.min(bone[action][axis], limit as number);
                  i++;
                } else if (sign === '-' && bone[action][axis] > (limit as number)) {
                  bone[action][axis] -= speed;
                  bone[action][axis] = Math.max(bone[action][axis], limit as number);
                  i++;
                } else {
                  currentAnimation.splice(i, 1);
                }
              } catch (e) {
                currentAnimation.splice(i, 1);
              }
            }
          } else {
            ref.animations.shift();
          }
        }
      } else {
        ref.flag = true;
        setTimeout(() => {
          ref.flag = false;
        }, pause);
        ref.animations.shift();
      }
      ref.renderer.render(ref.scene, ref.camera);
    };

    return () => {
      if (ref.renderer) {
        ref.renderer.dispose();
      }
    };
  }, [bot, speed, pause]);

  const sign = (inputRef: React.RefObject<HTMLTextAreaElement>) => {
    if (!inputRef.current?.value) return;

    const str = inputRef.current.value.toUpperCase();
    const strWords = str.split(' ');
    setText('');

    const ref = componentRef.current;

    for (const word of strWords) {
      if ((words as any)[word]) {
        ref.animations.push(['add-text', word + ' ']);
        (words as any)[word](ref);
      } else {
        const wordChars = word.split('');
        for (let index = 0; index < wordChars.length; index++) {
          const ch = wordChars[index];
          if (index === wordChars.length - 1) {
            ref.animations.push(['add-text', ch + ' ']);
          } else {
            ref.animations.push(['add-text', ch]);
          }
          if ((alphabets as any)[ch]) {
            (alphabets as any)[ch](ref);
          }
        }
      }
    }

    if (ref.pending === false) {
      ref.pending = true;
      ref.animate();
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const processVideoFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const videoElement = videoElementRef.current;
      if (!videoElement) {
        reject(new Error('Video element not available'));
        return;
      }

      const url = URL.createObjectURL(file);
      videoElement.src = url;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(videoElement);
      source.connect(audioContext.destination);

      videoElement.onloadedmetadata = () => {
        videoElement.muted = true;
        videoElement.play();

        const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = false;

        let fullTranscript = '';

        recognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              fullTranscript += event.results[i][0].transcript + ' ';
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          videoElement.pause();
          URL.revokeObjectURL(url);
          reject(new Error(`Speech recognition failed: ${event.error}`));
        };

        recognition.onend = () => {
          videoElement.pause();
          URL.revokeObjectURL(url);
          resolve(fullTranscript.trim());
        };

        recognition.start();

        videoElement.onended = () => {
          recognition.stop();
        };
      };

      videoElement.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video file'));
      };
    });
  };

  const handleProcessYouTube = async () => {
    if (!videoUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    setVideoProcessing(true);
    try {
      const videoId = extractYouTubeId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      }

      // Call backend API to fetch transcript
      const response = await fetch('http://localhost:8000/api/youtube/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: videoUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch transcript');
      }

      const data = await response.json();
      
      if (data.success && data.transcript) {
        setVideoText(data.transcript);
        if (videoTextRef.current) {
          videoTextRef.current.value = data.transcript;
        }
        alert(`Successfully extracted transcript in ${data.language || 'default language'}!`);
      } else {
        throw new Error('Failed to extract transcript from video');
      }
    } catch (error) {
      console.error('Error processing YouTube video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process YouTube video';
      alert(errorMessage);
    } finally {
      setVideoProcessing(false);
    }
  };

  const handleProcessVideoFile = async () => {
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    setVideoProcessing(true);
    try {
      const transcript = await processVideoFile(videoFile);
      setVideoText(transcript);
      if (videoTextRef.current) {
        videoTextRef.current.value = transcript;
      }
    } catch (error) {
      console.error('Error processing video file:', error);
      alert(
        'Failed to process video file.\n\n' +
        'Note: This feature requires:\n' +
        '1. Browser support for Web Speech API\n' +
        '2. Clear audio in the video\n' +
        '3. Chrome or Edge browser (recommended)\n\n' +
        'Alternatively, you can:\n' +
        '- Type the text manually\n' +
        '- Use the speech recognition feature'
      );
    } finally {
      setVideoProcessing(false);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      setVideoFile(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden video element for processing */}
      <video ref={videoElementRef} style={{ display: 'none' }} />
      
      {/* Video Player Section */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Player */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Video Input</h3>
            </div>
            
            {/* Video Display Area */}
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
              {videoFile ? (
                <video
                  src={URL.createObjectURL(videoFile)}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : videoUrl ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl) || ''}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center text-gray-400 p-8">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Upload a video or enter a YouTube URL</p>
                  <p className="text-xs mt-2">The avatar will demonstrate sign language from the video content</p>
                </div>
              )}
            </div>

            {/* Video URL Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">YouTube URL</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={videoProcessing}
                  className="flex-1"
                />
                <Button
                  onClick={handleProcessYouTube}
                  disabled={videoProcessing || !videoUrl.trim()}
                  variant="secondary"
                >
                  {videoProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Or Upload Video File</Label>
              <div className="flex gap-2">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  disabled={videoProcessing}
                  className="flex-1"
                />
                <Button
                  onClick={handleProcessVideoFile}
                  disabled={videoProcessing || !videoFile}
                  variant="secondary"
                >
                  {videoProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {videoFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>

            {/* Extracted Text from Video */}
            {videoText && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Extracted Text</Label>
                <Textarea
                  ref={videoTextRef}
                  rows={3}
                  value={videoText}
                  onChange={(e) => setVideoText(e.target.value)}
                  className="w-full resize-none"
                />
                <Button
                  onClick={() => sign(videoTextRef)}
                  className="w-full"
                >
                  Animate from Video Text
                </Button>
              </div>
            )}
          </div>

          {/* Avatar Display */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-lg font-semibold">Sign Language Avatar</h3>
            </div>
            <Card className="p-4 bg-gray-50">
              <div
                ref={canvasRef}
                className="w-full bg-gray-100 rounded-lg"
                style={{ minHeight: '400px', maxHeight: '500px' }}
              />
              <div className="mt-4 p-3 bg-white rounded border">
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                  PROCESSED OUTPUT
                </Label>
                <div className="text-sm font-mono bg-gray-50 p-2 rounded min-h-[60px] max-h-[100px] overflow-y-auto">
                  {text || <span className="text-gray-400">Avatar will show sign language here...</span>}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speech Recognition */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Speech Recognition</h3>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2">
              Status: {listening ? <span className="text-green-600">ON</span> : <span className="text-gray-500">OFF</span>}
            </Label>
            <div className="flex gap-2">
              <Button
                onClick={startListening}
                size="sm"
                className="flex-1"
                variant={listening ? 'default' : 'outline'}
              >
                <Mic className="w-4 h-4 mr-1" />
                Start
              </Button>
              <Button
                onClick={stopListening}
                size="sm"
                className="flex-1"
                variant="outline"
              >
                <MicOff className="w-4 h-4 mr-1" />
                Stop
              </Button>
              <Button
                onClick={resetTranscript}
                size="sm"
                variant="outline"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              ref={textFromAudioRef}
              rows={3}
              value={transcript}
              placeholder="Speak and your words will appear here..."
              className="w-full resize-none mt-2"
              readOnly
            />
            <Button
              onClick={() => sign(textFromAudioRef)}
              className="w-full mt-2"
            >
              Animate from Speech
            </Button>
          </div>
        </Card>

        {/* Text Input */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Text Input</h3>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2">Type Your Message</Label>
            <Textarea
              ref={textFromInputRef}
              rows={5}
              placeholder="Type text to convert to sign language..."
              className="w-full resize-none"
            />
            <Button
              onClick={() => sign(textFromInputRef)}
              className="w-full mt-2"
            >
              Animate from Text
            </Button>
          </div>
        </Card>

        {/* Avatar Settings */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Avatar Settings</h3>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2">Select Avatar</Label>
            <div className="space-y-2">
              <img
                src={xbotPic}
                className="w-full cursor-pointer rounded border-2 hover:border-primary transition-colors"
                onClick={() => setBot(xbot)}
                alt="Avatar 1: XBOT"
              />
              <img
                src={ybotPic}
                className="w-full cursor-pointer rounded border-2 hover:border-primary transition-colors"
                onClick={() => setBot(ybot)}
                alt="Avatar 2: YBOT"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">
              Animation Speed: {Math.round(speed * 100) / 100}
            </Label>
            <Slider
              axis="x"
              xmin={0.05}
              xmax={0.5}
              xstep={0.01}
              x={speed}
              onChange={({ x }: { x: number }) => setSpeed(x)}
              styles={{
                track: {
                  backgroundColor: '#e2e8f0',
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                },
                active: {
                  backgroundColor: '#3b82f6',
                },
                thumb: {
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#3b82f6',
                },
              }}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">
              Pause Time: {pause} ms
            </Label>
            <Slider
              axis="x"
              xmin={0}
              xmax={2000}
              xstep={100}
              x={pause}
              onChange={({ x }: { x: number }) => setPause(x)}
              styles={{
                track: {
                  backgroundColor: '#e2e8f0',
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                },
                active: {
                  backgroundColor: '#3b82f6',
                },
                thumb: {
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#3b82f6',
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignLanguageConverter;
