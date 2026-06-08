import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Share2 } from 'lucide-react-native';
import { spacing, fontSize } from '../theme/constants';
import { useTheme } from '../theme/useTheme';
import { Button } from '../components/Button';
import { SkeletonCard } from '../components/SkeletonCard';
import { getPlans } from '../services/api';

const SHARE_BASE = 'https://plan-recommendation-engine-production.up.railway.app/api/plan';

const fetchPlans = async () => {
  const response = await getPlans();
  if (!response.success) throw new Error('Failed to load plans');
  return response.plans;
};

const handleShare = async (plan) => {
  if (!plan.share_token) return;
  const url = `${SHARE_BASE}/${plan.share_token}`;
  try {
    await Share.share(
      Platform.OS === 'ios'
        ? { message: 'Check out my night plan!', url }
        : { message: `Check out my night plan!\n${url}` },
    );
  } catch (_) {}
};

export const SavedPlansScreen = ({ navigation }) => {
  const { colors, commonStyles } = useTheme();
  const { data: plans = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['saved-plans'],
    queryFn: fetchPlans,
  });

  const handlePlanPress = (plan) => {
    navigation.navigate('PlanDetail', { plan });
  };

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <View style={[commonStyles.paddingXL, { paddingTop: 64 }]}>
          <Text style={[commonStyles.mainHeading, commonStyles.mbLG]}>Saved Plans</Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[commonStyles.paddingXL, { paddingTop: 0, paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[commonStyles.container, commonStyles.justifyContentCenter, commonStyles.alignItemsCenter, commonStyles.paddingXL]}>
        <Text style={[commonStyles.body, commonStyles.textSecondary, { textAlign: 'center' }]}>
          {error.message}
        </Text>
        <Button title="Retry" onPress={refetch} variant="primary" style={commonStyles.mtLG} />
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View style={[commonStyles.container, commonStyles.justifyContentCenter, commonStyles.alignItemsCenter, commonStyles.paddingXL]}>
        <Text style={[commonStyles.body, commonStyles.textSecondary, { textAlign: 'center' }]}>
          No saved plans yet
        </Text>
        <Text style={[commonStyles.smallLabel, commonStyles.textMuted, { textAlign: 'center' }, commonStyles.mtSM]}>
          Generate and save your first plan to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.paddingXL, { paddingTop: 64 }]}>
        <Text style={[commonStyles.mainHeading, commonStyles.mbLG]}>Saved Plans</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[commonStyles.paddingXL, { paddingTop: 0, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={commonStyles.planCard}
            onPress={() => handlePlanPress(plan)}
            activeOpacity={0.85}
          >
            {plan.share_image_url && (
              <Image
                source={{ uri: plan.share_image_url }}
                style={commonStyles.savedPlanCardImage}
                resizeMode="cover"
              />
            )}
            <View style={commonStyles.planCardContent}>
              {plan.description && (
                <Text style={[commonStyles.body, commonStyles.mtSM]} numberOfLines={2}>
                  {plan.description}
                </Text>
              )}
              <Text style={[commonStyles.smallLabel, commonStyles.textMuted, commonStyles.mtSM]}>
                {plan.area && Array.isArray(plan.area) ? plan.area.join(', ') : plan.area || 'No area'}
              </Text>

              {/* Footer row: date + share */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: spacing.sm,
              }}>
                <Text style={[commonStyles.smallLabel, commonStyles.textMuted]}>
                  {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : 'No date'}
                </Text>

                {plan.share_token && (
                  <TouchableOpacity
                    onPress={() => handleShare(plan)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.xs,
                      padding: spacing.xs,
                    }}
                  >
                    <Share2 size={16} color={colors.primaryAccent} />
                    <Text style={{ fontSize: fontSize.smallLabel, color: colors.primaryAccent, fontWeight: '600' }}>
                      Share
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
