import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const wantsLight = savedTheme === 'light';
    setIsLightMode(wantsLight);
    if (wantsLight) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      }
      return newMode;
    });
  };

  return { isLightMode, toggleTheme };
};
