import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { radius, spacing } from '../theme/constants';

const SkeletonBlock = ({ width, height, style }) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: colors.inputSurface,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCard = () => {
  const { colors } = useTheme();
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: pulse,
        backgroundColor: colors.cardSurface,
        borderRadius: radius.card,
        marginBottom: spacing.lg,
        overflow: 'hidden',
      }}
    >
      {/* Image placeholder */}
      <View style={{ width: '100%', height: 220, backgroundColor: colors.inputSurface }} />

      {/* Content placeholder */}
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <SkeletonBlock width="80%" height={16} />
        <SkeletonBlock width="55%" height={12} style={{ marginTop: 2 }} />
        <SkeletonBlock width="35%" height={12} style={{ marginTop: spacing.sm }} />
      </View>
    </Animated.View>
  );
};
