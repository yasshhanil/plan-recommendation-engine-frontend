import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { spacing, radius } from '../theme/constants';
import { useTheme } from '../theme/useTheme';

export const PillSelector = ({ options, selected, onSelect, maxSelect }) => {
  const { colors } = useTheme();

  const handleSelect = (option) => {
    if (maxSelect && selected.length >= maxSelect && !selected.includes(option.id)) return;
    onSelect(option.id);
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, minHeight: 50 }}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleSelect(option)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: radius.pill,
              backgroundColor: isSelected ? colors.primaryAccent : colors.inputSurface,
              borderWidth: isSelected ? 0 : 1,
              borderColor: colors.textDisabled,
              marginBottom: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '500',
                color: isSelected ? colors.mainBackground : colors.textSecondary,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
