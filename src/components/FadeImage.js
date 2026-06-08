import React, { useRef, useCallback } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

export const FadeImage = ({ source, style, resizeMode = 'cover' }) => {
  const sharpOpacity = useRef(new Animated.Value(0)).current;

  const onLoad = useCallback(() => {
    Animated.timing(sharpOpacity, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      {/* Blurred placeholder — same source rendered blurry while sharp version loads */}
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        blurRadius={22}
      />
      {/* Sharp image fades in on load */}
      <Animated.Image
        source={source}
        style={[StyleSheet.absoluteFill, { opacity: sharpOpacity }]}
        resizeMode={resizeMode}
        onLoad={onLoad}
      />
    </View>
  );
};
