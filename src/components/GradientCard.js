import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius, fontSize } from '../theme/constants';
import { useTheme } from '../theme/useTheme';

export const GradientCard = ({ title, subtitle, buttonText, onPress, image, height = 260 }) => {
  const { colors } = useTheme();

  const content = (
    <View style={{ flex: 1, justifyContent: 'flex-end', padding: spacing.xl }}>
      <Text
        style={{
          fontSize: fontSize.mainHeading,
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: spacing.sm,
          letterSpacing: -0.5,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: fontSize.body,
          color: 'rgba(255, 255, 255, 0.82)',
          marginBottom: spacing.lg,
          lineHeight: 21,
        }}
      >
        {subtitle}
      </Text>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          alignSelf: 'flex-start',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          borderRadius: radius.button,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primaryAccent }}>
          {buttonText}
        </Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={{
        height,
        borderRadius: radius.card,
        overflow: 'hidden',
        marginBottom: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      {image ? (
        <ImageBackground source={{ uri: image }} style={{ flex: 1 }} resizeMode="cover">
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.72)']}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          >
            {content}
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={[colors.primaryAccent, '#C44B1E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {content}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};
