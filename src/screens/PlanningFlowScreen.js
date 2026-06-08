import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, PanResponder, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { spacing, fontSize, radius } from '../theme/constants';
import { useTheme } from '../theme/useTheme';
import { Button } from '../components/Button';
import { moodOptions, placeOptions, constraintOptions, priceOptions } from '../utils/dummyData';
import { usePlanStore } from '../store/usePlanStore';

// Light: darker/richer saturated fills, white text reads cleanly
const LIGHT_COLORS = [
  '#EF4444', '#F97316', '#CA8A04', '#16A34A', '#2563EB',
  '#9333EA', '#EC4899', '#0891B2', '#B45309', '#059669',
  '#E11D48', '#4F46E5', '#D97706', '#65A30D', '#7C3AED',
];

// Dark: bright neon-ish fills that glow against dark backgrounds, dark text
const DARK_COLORS = [
  '#FF7070', '#FF9A40', '#FFE040', '#3DFFA0', '#5BB8FF',
  '#B86BFF', '#FF70B5', '#1EEAEA', '#FFA048', '#5AE8C0',
  '#FF6090', '#7A8FFF', '#FFD040', '#7AFFD8', '#BF6FFF',
];

const ALL_TAG_IDS = [
  ...moodOptions,
  ...placeOptions,
  ...priceOptions,
  ...constraintOptions,
].map(t => t.id);

const buildColorMap = (palette) => {
  const map = {};
  ALL_TAG_IDS.forEach((id, i) => { map[id] = palette[i % palette.length]; });
  return map;
};

const LIGHT_TAG_COLOR = buildColorMap(LIGHT_COLORS);
const DARK_TAG_COLOR  = buildColorMap(DARK_COLORS);

// ─── Animated chip ────────────────────────────────────────────────────────────

const Chip = React.memo(({ option, isSelected, onPress, color, isDark }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.13 : 1,
      useNativeDriver: true,
      tension: 260,
      friction: 7,
    }).start();
  }, [isSelected]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(
      isSelected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy,
    );
    onPress(option.id, isSelected);
  }, [isSelected, onPress, option.id]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm + 2,
          borderRadius: radius.pill,
          backgroundColor: isSelected ? color : isDark ? color + '18' : 'transparent',
          borderWidth: 2,
          borderColor: color,
          marginBottom: spacing.sm,
          marginRight: spacing.sm,
          ...(isSelected && isDark && {
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: 10,
            elevation: 6,
          }),
        }}
      >
        <Text
          style={{
            fontSize: fontSize.body,
            fontWeight: isSelected ? '700' : '500',
            color: isSelected ? (isDark ? '#0D0F1A' : '#FFFFFF') : color,
          }}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── Tag section ──────────────────────────────────────────────────────────────

const Section = React.memo(({ title, options, selectedIds, onToggle, maxSelect }) => {
  const { colors, isDark } = useTheme();
  const colorMap = isDark ? DARK_TAG_COLOR : LIGHT_TAG_COLOR;

  // Keep a ref so handlePress always sees current selectedIds without recreating
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

  const handlePress = useCallback((id, wasSelected) => {
    if (!wasSelected && maxSelect && selectedIdsRef.current.length >= maxSelect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    onToggle(id, !wasSelected);
  }, [onToggle, maxSelect]);

  return (
    <View style={{ marginBottom: spacing.xl + spacing.md }}>
      {!!title && (
        <Text style={{ fontSize: fontSize.sectionHeading, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.lg }}>
          {title}
        </Text>
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map(option => (
          <Chip
            key={option.id}
            option={option}
            color={colorMap[option.id]}
            isSelected={selectedIds.includes(option.id)}
            isDark={isDark}
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export const PlanningFlowScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { planningState, toggleTag, selectedCity } = usePlanStore();

  const toggleVibe     = useCallback((id, add) => toggleTag('selectedVibeTags', id, add), [toggleTag]);
  const toggleCategory = useCallback((id, add) => toggleTag('selectedCategoryTags', id, add), [toggleTag]);
  const togglePrice    = useCallback((id, add) => toggleTag('selectedPriceTags', id, add, true), [toggleTag]);
  const toggleSpecial  = useCallback((id, add) => toggleTag('selectedSpecialTags', id, add), [toggleTag]);

  const vibeIds     = planningState.selectedVibeTags || [];
  const categoryIds = planningState.selectedCategoryTags || [];
  const specialIds  = planningState.selectedSpecialTags || [];
  const priceId     = planningState.selectedPriceTags;

  const dragPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy, dx }) =>
        dy > Math.abs(dx) && dy > 12,
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 80 || vy > 0.6) {
          navigation.goBack();
        }
      },
    }),
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      {/* Drag handle */}
      <View
        style={{ alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.xs }}
        {...dragPan.panHandlers}
      >
        <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: colors.textDisabled }} />
      </View>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.xxl + spacing.lg,
          paddingBottom: spacing.lg,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.sm }}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: fontSize.cardTitle,
            fontWeight: '700',
            color: colors.textPrimary,
          }}
        >
          Build Your Plan
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: 120,
        }}
      >
        <Section
          title="What's the vibe?"
          options={moodOptions}
          selectedIds={vibeIds}
          onToggle={toggleVibe}
          maxSelect={3}
        />
        <Section
          title="What sounds good?"
          options={placeOptions}
          selectedIds={categoryIds}
          onToggle={toggleCategory}
        />
        <Section
          title="What's your budget?"
          options={priceOptions}
          selectedIds={priceId ? [priceId] : []}
          onToggle={togglePrice}
          maxSelect={1}
        />
        <Section
          title="Anything important?"
          options={constraintOptions}
          selectedIds={specialIds}
          onToggle={toggleSpecial}
        />
      </ScrollView>

      {/* Sticky generate button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: spacing.xl,
          paddingBottom: spacing.xl + spacing.md,
          backgroundColor: colors.mainBackground,
          borderTopWidth: 1,
          borderTopColor: colors.inputSurface,
        }}
      >
        <Button
          title="Generate Plan"
          onPress={() => {
            if (!selectedCity) {
              Alert.alert('Choose a location', 'Please select a location before generating a plan.');
              navigation.navigate('Home');
              return;
            }
            navigation.navigate('Loading');
          }}
          variant="primary"
        />
      </View>
    </View>
  );
};
