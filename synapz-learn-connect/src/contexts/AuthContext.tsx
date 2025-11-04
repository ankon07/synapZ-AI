import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'learner' | 'parent' | null;

interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  preferredName?: string;
}

interface AuthContextType {
  userRole: UserRole;
  userProfile: UserProfile | null;
  login: (role: UserRole, profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const login = (role: UserRole, profile: UserProfile) => {
    setUserRole(role);
    setUserProfile(profile);
  };

  const logout = () => {
    setUserRole(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
