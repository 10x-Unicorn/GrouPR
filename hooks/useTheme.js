import { useColorScheme } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../lib/theme';

/**
 * Custom hook for accessing theme values that automatically 
 * respond to dark/light mode changes
 */
export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get the appropriate color palette based on current theme
  const currentColors = isDark ? colors.dark : colors.light;
  
  return {
    // Theme detection
    isDark,
    colorScheme,
    
    // Colors that automatically switch based on theme
    colors: currentColors,
    
    // Design system tokens
    spacing,
    borderRadius,
    typography,
    shadows,
    
    // Helper functions for common patterns
    getTextColor: (variant = 'primary') => {
      switch (variant) {
        case 'primary':
          return currentColors.text;
        case 'secondary':
          return currentColors.textSecondary;
        case 'tertiary':
          return currentColors.textTertiary;
        default:
          return currentColors.text;
      }
    },
    
    getBackgroundColor: (variant = 'primary') => {
      switch (variant) {
        case 'primary':
          return currentColors.background;
        case 'secondary':
          return currentColors.backgroundSecondary;
        case 'tertiary':
          return currentColors.backgroundTertiary;
        case 'surface':
          return currentColors.surface;
        case 'surfaceSecondary':
          return currentColors.surfaceSecondary;
        default:
          return currentColors.background;
      }
    },
    
    getIconColor: (variant = 'primary') => {
      switch (variant) {
        case 'primary':
          return currentColors.icon;
        case 'secondary':
          return currentColors.iconSecondary;
        default:
          return currentColors.icon;
      }
    },
    
    getBorderColor: (variant = 'primary') => {
      switch (variant) {
        case 'primary':
          return currentColors.border;
        case 'secondary':
          return currentColors.borderSecondary;
        default:
          return currentColors.border;
      }
    },
    
    // Utility for creating dynamic styles
    createStyle: (lightStyle, darkStyle) => {
      return isDark ? darkStyle : lightStyle;
    },
  };
};