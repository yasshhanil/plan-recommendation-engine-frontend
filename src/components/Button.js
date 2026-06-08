import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius } from '../theme/constants';
import { useTheme } from '../theme/useTheme';

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
  const { colors } = useTheme();

  const renderContent = () => {
    if (loading) return <ActivityIndicator color="#FFFFFF" size="small" />;
    return (
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: variant === 'primary' ? colors.mainBackground : colors.textPrimary,
        }}
      >
        {title}
      </Text>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={[colors.primaryAccent, colors.secondaryAccent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xl,
            borderRadius: radius.button,
            alignItems: 'center',
            opacity: disabled || loading ? 0.5 : 1,
          }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.button,
          backgroundColor: colors.inputSurface,
          alignItems: 'center',
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
