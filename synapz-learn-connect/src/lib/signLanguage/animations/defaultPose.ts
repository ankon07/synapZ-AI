import { AnimationRef } from '../types';

export const defaultPose = (ref: AnimationRef): void => {
  if (!ref.avatar) return;

  // Reset all rotations to default pose
  const resetBone = (boneName: string) => {
    const bone = ref.avatar?.getObjectByName(boneName);
    if (bone && 'rotation' in bone) {
      bone.rotation.x = 0;
      bone.rotation.y = 0;
      bone.rotation.z = 0;
    }
  };

  // Reset left hand
  resetBone('mixamorigLeftHandIndex1');
  resetBone('mixamorigLeftHandMiddle1');
  resetBone('mixamorigLeftHandRing1');
  resetBone('mixamorigLeftHandPinky1');
  resetBone('mixamorigLeftHand');
  resetBone('mixamorigLeftForeArm');
  resetBone('mixamorigLeftArm');

  // Reset right hand
  resetBone('mixamorigRightHandIndex1');
  resetBone('mixamorigRightHandMiddle1');
  resetBone('mixamorigRightHandMiddle2');
  resetBone('mixamorigRightHandMiddle3');
  resetBone('mixamorigRightHandRing1');
  resetBone('mixamorigRightHandRing2');
  resetBone('mixamorigRightHandRing3');
  resetBone('mixamorigRightHandPinky1');
  resetBone('mixamorigRightHandPinky2');
  resetBone('mixamorigRightHandPinky3');
  resetBone('mixamorigRightHandThumb2');
  resetBone('mixamorigRightHandThumb3');
  resetBone('mixamorigRightHand');
  resetBone('mixamorigRightForeArm');
  resetBone('mixamorigRightArm');
};
