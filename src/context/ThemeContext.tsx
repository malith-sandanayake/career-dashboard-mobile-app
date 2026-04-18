import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  text: string;
  textSub: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  warning: string;
  danger: string;
  navBg: string;
  navBorder: string;
  inputBg: string;
}

const DARK: ThemeColors = {
  background: '#000000',
  surface: '#0D1117',
  surfaceAlt: '#060B11',
  border: '#1A1A1A',
  borderStrong: '#2A2A2A',
  text: '#FFFFFF',
  textSub: '#AAAAAA',
  textMuted: '#555555',
  accent: '#00FFFF',
  accentBg: '#00FFFF18',
  accentBorder: '#00FFFF44',
  warning: '#FF6B35',
  danger: '#FF003C',
  navBg: '#0A0A0A',
  navBorder: '#1A1A1A',
  inputBg: '#060B11',
};

const LIGHT: ThemeColors = {
  background: '#F0F4F8',
  surface: '#FFFFFF',
  surfaceAlt: '#E8EFF7',
  border: '#D1DCE8',
  borderStrong: '#B0C0D4',
  text: '#0D1117',
  textSub: '#4A5568',
  textMuted: '#9AA5B4',
  accent: '#0086A3',
  accentBg: '#0086A318',
  accentBorder: '#0086A344',
  warning: '#D45B1A',
  danger: '#C80030',
  navBg: '#FFFFFF',
  navBorder: '#D1DCE8',
  inputBg: '#EEF3F8',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('app-theme');
        if (saved === 'dark' || saved === 'light') setTheme(saved);
      } catch (e) {}
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('app-theme', theme);
      } catch (e) {}
    };
    saveTheme();
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const colors = theme === 'dark' ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
