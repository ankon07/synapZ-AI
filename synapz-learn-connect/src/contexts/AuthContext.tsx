import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  auth,
  onAuthStateChanged,
  logoutUser,
  getUserProfile,
  updateLastLogin,
  type User,
  type UserData,
} from "@/lib/firebase";

type UserRole = "learner" | "parent" | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  userProfile: UserData | null;
  loading: boolean;
  selectedPlan: string | null;
  setSelectedPlan: (plan: string | null) => void;
  login: (
    role: UserRole,
    profile: {
      id: string;
      name: string;
      avatar?: string;
      preferredName?: string;
    },
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    return localStorage.getItem("selectedPlan");
  });

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
            setUserRole(profile.role);
            await updateLastLogin(firebaseUser.uid);
          } else {
            // User exists in auth but not in DB yet (edge case)
            setUserRole("learner");
            setUserProfile({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "User",
              photoURL: firebaseUser.photoURL,
              role: "learner",
              selectedPlan: null,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserRole("learner");
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Persist selected plan to localStorage
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem("selectedPlan", selectedPlan);
    } else {
      localStorage.removeItem("selectedPlan");
    }
  }, [selectedPlan]);

  // Legacy login function (for backward compatibility with existing components)
  const login = (
    role: UserRole,
    profile: {
      id: string;
      name: string;
      avatar?: string;
      preferredName?: string;
    },
  ) => {
    setUserRole(role);
    setUserProfile({
      uid: profile.id,
      email: null,
      displayName: profile.name,
      photoURL: profile.avatar || null,
      role: role || "learner",
      selectedPlan: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // If Firebase logout fails, still clear local state
    }
    setUser(null);
    setUserRole(null);
    setUserProfile(null);
    setSelectedPlan(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        userProfile,
        loading,
        selectedPlan,
        setSelectedPlan,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
