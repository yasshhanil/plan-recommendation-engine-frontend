import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { User, LogOut, Moon, Sun } from 'lucide-react-native';
import { spacing, radius, fontSize } from '../theme/constants';
import { useTheme } from '../theme/useTheme';
import { useAuthStore } from '../store/useAuthStore';
import { removePersistedAuth } from '../services/authService';

export const ProfileScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, clearAuth } = useAuthStore();

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await removePersistedAuth();
          clearAuth();
        },
      },
    ]);
  };

  const menuItems = [
    { icon: LogOut, label: 'Log Out', color: colors.error, onPress: handleLogOut },
  ];

  const cardStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSurface,
    padding: spacing.lg,
    borderRadius: radius.card,
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: spacing.xl, paddingTop: 64 }}>

          {/* Avatar */}
          <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.cardSurface,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.lg,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <User size={40} color={colors.textSecondary} />
            </View>
            <Text
              style={{
                fontSize: fontSize.mainHeading,
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: spacing.xs,
              }}
            >
              {user?.name ?? 'Welcome'}
            </Text>
            <Text style={{ fontSize: fontSize.body, color: colors.textSecondary }}>
              {user?.email ?? 'Free Plan'}
            </Text>
          </View>

          {/* Dark Mode Toggle */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: fontSize.smallLabel,
                fontWeight: '600',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: spacing.sm,
              }}
            >
              Appearance
            </Text>
            <TouchableOpacity
              style={cardStyle}
              onPress={toggleTheme}
              activeOpacity={0.8}
            >
              {isDark
                ? <Moon size={22} color={colors.primaryAccent} />
                : <Sun size={22} color={colors.primaryAccent} />
              }
              <Text style={{ flex: 1, fontSize: fontSize.body, color: colors.textPrimary, fontWeight: '500' }}>
                Dark Mode
              </Text>
              <View pointerEvents="none">
                <Switch
                  value={isDark}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.textDisabled, true: colors.primaryAccent + '55' }}
                  thumbColor={isDark ? colors.primaryAccent : colors.elevatedSurface}
                  ios_backgroundColor={colors.inputSurface}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={{ marginBottom: spacing.xl }}>
            <Text
              style={{
                fontSize: fontSize.smallLabel,
                fontWeight: '600',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: spacing.sm,
              }}
            >
              Account
            </Text>
            <View style={{ gap: spacing.sm }}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={cardStyle}
                  activeOpacity={0.8}
                  onPress={item.onPress}
                >
                  <item.icon size={22} color={item.color} />
                  <Text style={{ flex: 1, fontSize: fontSize.body, color: colors.textPrimary, fontWeight: '500' }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};
