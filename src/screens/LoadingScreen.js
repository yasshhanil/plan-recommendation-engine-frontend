import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { spacing, fontSize } from '../theme/constants';
import { useTheme } from '../theme/useTheme';
import { usePlanStore } from '../store/usePlanStore';
import { generatePlan } from '../services/api';
import { dummyPlanData } from '../utils/dummyData';

const loadingMessages = [
  'Finding places with the right energy',
  'Building a smooth route',
  'Avoiding tourist traps',
  'Curating your evening',
];

export const LoadingScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [messageIndex, setMessageIndex] = useState(0);
  const [status, setStatus] = useState('Connecting...');
  const { planningState, selectedCity, selectedArea, setCurrentPlan } = usePlanStore();

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    const fetchPlan = async () => {
      try {
        setStatus('Fetching from API...');
        const planData = await generatePlan(planningState, selectedCity?.id ?? null, selectedArea?.id ?? null);
        setCurrentPlan(planData);
        setStatus('Success!');
        setTimeout(() => navigation.replace('GeneratedPlan'), 500);
      } catch (err) {
        setStatus('Using sample data...');
        setTimeout(() => {
          setCurrentPlan(dummyPlanData);
          navigation.replace('GeneratedPlan');
        }, 1000);
      }
    };

    fetchPlan();
    return () => clearInterval(messageInterval);
  }, [navigation, planningState]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      <ActivityIndicator size="large" color={colors.primaryAccent} style={{ marginBottom: spacing.lg }} />
      <Text
        style={{
          fontSize: fontSize.mainHeading,
          fontWeight: '700',
          color: colors.textPrimary,
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        {loadingMessages[messageIndex]}
      </Text>
      <Text style={{ fontSize: fontSize.body, color: colors.textSecondary, textAlign: 'center' }}>
        {status}
      </Text>
    </View>
  );
};
