import { useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const useThemeToggler = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const initialThemeMode = prefersDarkMode ? 'dark' : 'light';
  const [themeMode, setThemeMode] = useState(initialThemeMode);

  const toggleThemeMode = () => {
    if (themeMode === 'light') {
      window.localStorage.setItem('themeMode', 'dark');
      setThemeMode('dark');
    } else {
      window.localStorage.setItem('themeMode', 'light');
      setThemeMode('light');
    }
  };

  useEffect(() => {
    const localThemeMode = window.localStorage.getItem('themeMode');
    localThemeMode && setThemeMode(localThemeMode);
  }, []);

  return [themeMode, toggleThemeMode];
};
