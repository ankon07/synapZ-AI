import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getDatabase, ref, set, get, update } from 'firebase/database';

// Firebase configuration — replace with your project's config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: '615790237644-lde14re3ltg6a8ra6re9btf5etfku1sr.apps.googleusercontent.com',
});

// ─── Auth Functions ──────────────────────────────────────

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  // Save user profile to Realtime Database
  await saveUserProfile(result.user, { displayName, role: 'learner' });
  return result.user;
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Save/update user profile on Google login
    const snapshot = await get(ref(db, `users/${result.user.uid}`));
    if (!snapshot.exists()) {
      await saveUserProfile(result.user, {
        displayName: result.user.displayName || 'User',
        role: 'learner',
      });
    }
    return result.user;
  } catch (error: any) {
    // If popup is blocked or COOP prevents it, fall back to redirect
    if (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request' ||
      error.message?.includes('Cross-Origin-Opener-Policy')
    ) {
      await signInWithRedirect(auth, googleProvider);
      return null; // Page will redirect, result handled on return
    }
    throw error;
  }
}

// Call this on app initialization to handle redirect results
export async function handleGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const snapshot = await get(ref(db, `users/${result.user.uid}`));
      if (!snapshot.exists()) {
        await saveUserProfile(result.user, {
          displayName: result.user.displayName || 'User',
          role: 'learner',
        });
      }
      return result.user;
    }
    return null;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

// ─── Database Functions ──────────────────────────────────

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
  role: 'learner' | 'parent';
  selectedPlan: string | null;
  createdAt: string;
  lastLogin: string;
}

async function saveUserProfile(
  user: User,
  extra: { displayName: string; role: string }
) {
  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: extra.displayName,
    photoURL: user.photoURL,
    role: extra.role as 'learner' | 'parent',
    selectedPlan: null,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  await set(ref(db, `users/${user.uid}`), userData);
  return userData;
}

export async function getUserProfile(uid: string): Promise<UserData | null> {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.exists() ? (snapshot.val() as UserData) : null;
}

export async function updateUserPlan(uid: string, plan: string) {
  await update(ref(db, `users/${uid}`), {
    selectedPlan: plan,
    lastLogin: new Date().toISOString(),
  });
}

export async function updateLastLogin(uid: string) {
  await update(ref(db, `users/${uid}`), {
    lastLogin: new Date().toISOString(),
  });
}
