import * as THREE from 'three';

export interface AnimationRef {
  flag: boolean;
  pending: boolean;
  animations: (Animation[] | string[])[];
  characters: string[];
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  avatar: any;
  animate: () => void;
  speed: number;
  pause: number;
}

export type Animation = [string, string, string, number, string];

export interface SignLanguageAvatarProps {
  text?: string;
  speed?: number;
  pause?: number;
  onTextUpdate?: (text: string) => void;
  className?: string;
}
