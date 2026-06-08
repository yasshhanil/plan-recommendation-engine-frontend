import { useMemo } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { lightColors, darkColors } from './constants';
import { createCommonStyles } from '../styles/common';

export const useTheme = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const colors = isDark ? darkColors : lightColors;
  const commonStyles = useMemo(() => createCommonStyles(colors), [isDark]);
  return { colors, commonStyles, isDark, toggleTheme };
};
