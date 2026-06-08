import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { spacing, fontSize } from '../theme/constants';
import { useTheme } from '../theme/useTheme';

const ICON_SIZE = 28;
const WALK_THRESHOLD_KM = 1.5;

export const StageConnector = ({ travelInfo }) => {
  const { colors, isDark } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const distance = parseFloat(travelInfo?.distance ?? '0');
  const isWalking = distance < WALK_THRESHOLD_KM;
  const timeMinutes =
    travelInfo?.time ?? Math.round((distance / (isWalking ? 5 : 25)) * 60);

  useEffect(() => {
    if (!travelInfo || trackWidth === 0) return;
    const range = trackWidth - ICON_SIZE - spacing.md * 2;
    translateX.setValue(range);
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 0,
        duration: isWalking ? 2800 : 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [trackWidth, isWalking, travelInfo]);

  if (!travelInfo) return null;

  const roadBg = isDark ? '#22232C' : '#E8E9EF';
  const dashBg = isDark ? '#3A3B4A' : '#C8CAD4';

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <View
        style={{
          height: 50,
          backgroundColor: roadBg,
          borderRadius: 25,
          overflow: 'hidden',
          justifyContent: 'center',
          paddingHorizontal: spacing.md,
        }}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <View
              key={i}
              style={{ width: 14, height: 2.5, backgroundColor: dashBg, borderRadius: 2 }}
            />
          ))}
        </View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              left: spacing.md,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
            },
            { transform: [{ translateX }, { scaleX: 1 }] },
          ]}
        >
          <Text style={{ fontSize: ICON_SIZE - 4, lineHeight: ICON_SIZE }}>
            {isWalking ? '🚶' : '🚗'}
          </Text>
        </Animated.View>
      </View>

      <Text
        style={{
          textAlign: 'center',
          fontSize: fontSize.metadata,
          color: colors.textMuted,
          fontWeight: '500',
          marginTop: spacing.sm,
          letterSpacing: 0.3,
        }}
      >
        {travelInfo.distance} km · ~{timeMinutes} min {isWalking ? 'walk' : 'drive'}
      </Text>
    </View>
  );
};
