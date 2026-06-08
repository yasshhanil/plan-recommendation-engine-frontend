import React, { useState, useRef, useCallback } from 'react';
import { View, Animated, PanResponder, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Home, Bookmark, User } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { spacing } from '../theme/constants';
import { HomeScreen } from '../screens/HomeScreen';
import { SavedPlansScreen } from '../screens/SavedPlansScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const { width } = Dimensions.get('window');

const TABS = [
  { name: 'Home',    label: 'Home',    Icon: Home,     Screen: HomeScreen },
  { name: 'Saved',   label: 'Saved',   Icon: Bookmark, Screen: SavedPlansScreen },
  { name: 'Profile', label: 'Profile', Icon: User,     Screen: ProfileScreen },
];

export const SwipeableTabView = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const activeTabRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const handledParam = useRef(null);

  const goToTab = useCallback((index, animated = true) => {
    if (index !== activeTabRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    activeTabRef.current = index;
    setActiveTab(index);
    if (animated) {
      Animated.spring(translateX, {
        toValue: -index * width,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      translateX.setValue(-index * width);
    }
  }, []);

  // Handle navigation.navigate('MainTabs', { screen: 'Saved' }) from other stack screens
  useFocusEffect(
    useCallback(() => {
      const screenParam = route?.params?.screen;
      if (screenParam && screenParam !== handledParam.current) {
        handledParam.current = screenParam;
        const idx = TABS.findIndex(t => t.name === screenParam);
        if (idx >= 0) {
          goToTab(idx, false);
          navigation.setParams({ screen: undefined });
        }
      }
    }, [route?.params?.screen, goToTab]),
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderGrant: () => {
        translateX.stopAnimation();
      },
      onPanResponderMove: (_, { dx }) => {
        const base = -activeTabRef.current * width;
        const raw = base + dx;
        const min = -(TABS.length - 1) * width;
        const clamped = Math.max(min, Math.min(0, raw));
        // Rubber-band resistance at edges
        translateX.setValue(clamped + (raw - clamped) * 0.2);
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        const cur = activeTabRef.current;
        const isLeft  = dx < -width * 0.25 || vx < -0.4;
        const isRight = dx >  width * 0.25 || vx >  0.4;
        let next = cur;
        if (isLeft  && cur < TABS.length - 1) next = cur + 1;
        else if (isRight && cur > 0)           next = cur - 1;
        goToTab(next);
      },
      onPanResponderTerminate: () => {
        goToTab(activeTabRef.current);
      },
    }),
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      {/* Pager */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Animated.View
          style={{
            flexDirection: 'row',
            height: '100%',
            width: width * TABS.length,
            transform: [{ translateX }],
          }}
          {...panResponder.panHandlers}
        >
          {TABS.map(({ Screen }, index) => (
            <View key={index} style={{ width, height: '100%' }}>
              <Screen navigation={navigation} route={{ params: {} }} />
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Tab bar */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.elevatedSurface,
          borderTopWidth: 1,
          borderTopColor: colors.inputSurface,
          height: 80,
          paddingBottom: spacing.xl,
          paddingTop: spacing.lg,
        }}
      >
        {TABS.map(({ name, label, Icon }, index) => {
          const isActive = activeTab === index;
          const color = isActive ? colors.primaryAccent : colors.textDisabled;
          return (
            <TouchableOpacity
              key={name}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
              onPress={() => goToTab(index)}
              activeOpacity={0.7}
            >
              <Icon size={24} color={color} />
              <Text style={{ fontSize: 12, color, fontWeight: isActive ? '600' : '400' }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
