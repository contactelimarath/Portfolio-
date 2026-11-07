import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'aura-light' | 'nova-crimson';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'aura-light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('aura-light');

  useEffect(() => {
    if (theme === 'aura-light') {
      document.body.classList.add('theme-aura-light');
      document.body.classList.remove('theme-nova');
      document.body.style.backgroundColor = '#F5F7FC';
      document.body.style.color = '#0F172A';
    } else {
      document.body.classList.add('theme-nova');
      document.body.classList.remove('theme-aura-light');
      document.body.style.backgroundColor = '#07080B';
      document.body.style.color = '#F8FAFC';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'aura-light' ? 'nova-crimson' : 'aura-light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
