import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'calm' | 'high-contrast';

interface SettingsContextType {
  theme: Theme;
  fontSize: number;
  isLowMotion: boolean;
  ttsSpeed: number;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  setLowMotion: (enabled: boolean) => void;
  setTtsSpeed: (speed: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('calm');
  const [fontSize, setFontSize] = useState(16);
  const [isLowMotion, setIsLowMotion] = useState(true);
  const [ttsSpeed, setTtsSpeed] = useState(1);

  const setLowMotion = (enabled: boolean) => {
    setIsLowMotion(enabled);
    if (enabled) {
      document.body.style.setProperty('--transition-speed', '0.01ms');
    } else {
      document.body.style.setProperty('--transition-speed', '0.3s');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        fontSize,
        isLowMotion,
        ttsSpeed,
        setTheme,
        setFontSize,
        setLowMotion,
        setTtsSpeed,
      }}
    >
      <div className={theme === 'high-contrast' ? 'high-contrast' : ''}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
