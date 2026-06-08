import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Animated, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE } from '../config';
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { StageConnector } from '../components/StageConnector';
import { VenueCard } from '../components/VenueCard';
import { VenueDetailModal } from '../components/VenueDetailModal';
import { Button } from '../components/Button';
import { usePlanStore } from '../store/usePlanStore';

export const GeneratedPlanScreen = ({ navigation }) => {
  const { colors, commonStyles, isDark } = useTheme();
  const { currentPlan, planningState, selectedCity } = usePlanStore();
  const queryClient = useQueryClient();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savedVenueIds, setSavedVenueIds] = useState([]);
  const [selectedVenues, setSelectedVenues] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showFinalized, setShowFinalized] = useState(false);
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const finalizeAnim = useRef(new Animated.Value(0)).current;
  const prevAllSelected = useRef(false);
  const { width: screenWidth } = Dimensions.get('window');

  const userTags = [
    ...(planningState?.selectedVibeTags || []),
    ...(planningState?.selectedCategoryTags || []),
    ...(planningState?.selectedSpecialTags || []),
    ...(planningState?.selectedPriceTags ? [planningState.selectedPriceTags] : []),
  ];

  const getAllUserTags = () => {
    const tags = [];
    if (planningState?.selectedVibeTags) {
      planningState.selectedVibeTags.forEach(tag => {
        tags.push({ tag, type: 'vibe' });
      });
    }
    if (planningState?.selectedCategoryTags) {
      planningState.selectedCategoryTags.forEach(tag => {
        tags.push({ tag, type: 'category' });
      });
    }
    if (planningState?.selectedSpecialTags) {
      planningState.selectedSpecialTags.forEach(tag => {
        tags.push({ tag, type: 'special' });
      });
    }
    if (planningState?.selectedPriceTags) {
      tags.push({ tag: planningState.selectedPriceTags, type: 'price' });
    }
    if (planningState?.selectedArea) {
      tags.push({ tag: planningState.selectedArea, type: 'area' });
    }
    return tags;
  };

  if (!currentPlan) {
    return null;
  }

  const getStages = () => {
    let venueData;

    if (Array.isArray(currentPlan)) {
      venueData = currentPlan;
    } else if (currentPlan?.venue_data) {
      venueData = currentPlan.venue_data;
    } else {
      return [];
    }

    return venueData;
  };

  const getTagColor = (tag, tagType) => {
    const palette = isDark
      ? { vibe: '#6D28D9', category: '#1D4ED8', special: '#0C6888', price: '#047857', area: '#991B1B' }
      : { vibe: '#7C3AED', category: '#2563EB', special: '#0891B2', price: '#059669', area: '#DC2626' };
    return palette[tagType] ?? (isDark ? '#4B5563' : '#94A3B8');
  };

  const stages = getStages();

  const allSelected = stages.length > 0 && Object.keys(selectedVenues).length === stages.length;
  useEffect(() => {
    if (allSelected && !prevAllSelected.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.timing(finalizeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else if (!allSelected) {
      finalizeAnim.setValue(0);
    }
    prevAllSelected.current = allSelected;
  }, [allSelected]);

  const openingLine = currentPlan?.opening_line || null;
  const closingLine = currentPlan?.closing_line || null;
  const planState = currentPlan?.state || planningState?.selectedState || '';

  const OpeningClosingLine = ({ text, isOpening }) => (
    <View style={isOpening ? commonStyles.openingClosingLine : commonStyles.closingLine}>
      <Text style={commonStyles.openingClosingText}>
        {text}
      </Text>
    </View>
  );

  const AreaSwitch = ({ message }) => (
    <View style={commonStyles.areaSwitch}>
      <Text style={commonStyles.areaSwitchText}>
        {message}
      </Text>
    </View>
  );

  const handleSaveVenue = (venueId) => {
    setSavedVenueIds((prev) => [...prev, venueId]);
  };

  const handleOpenMaps = (uri) => {
    Linking.openURL(uri);
  };

  const handleOpenModal = (venue) => {
    setSelectedVenue(venue);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedVenue(null);
  };

  const handleModalMaps = () => {
    if (selectedVenue?.google_maps_uri) {
      Linking.openURL(selectedVenue.google_maps_uri);
    }
  };

  const handleRegenerate = () => {
    navigation.navigate('Loading');
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getTravelInfo = (fromVenue, toVenue) => {
    if (!fromVenue?.lat || !fromVenue?.lng || !toVenue?.lat || !toVenue?.lng) {
      return null;
    }
    const distance = calculateDistance(
      fromVenue.lat,
      fromVenue.lng,
      toVenue.lat,
      toVenue.lng
    );
    const avgSpeed = 25;
    const timeMinutes = Math.round((distance / avgSpeed) * 60);
    return {
      distance: distance.toFixed(1),
      time: timeMinutes,
    };
  };

  const handleSelectVenue = (stageIndex, venue) => {
    setSelectedVenues((prev) => {
      const currentSelected = prev[stageIndex];
      if (currentSelected?.id === venue.id) {
        const newSelected = { ...prev };
        delete newSelected[stageIndex];
        return newSelected;
      }
      return { ...prev, [stageIndex]: venue };
    });
  };

  const handleFinalize = () => {
    setShowFinalized(true);
  };

  const handleEdit = () => {
    setShowFinalized(false);
  };

  const handleSavePlan = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const selectedVenueIds = Object.values(selectedVenues).map(v =>
        typeof v === 'object' ? (v.id ?? v.venue_id ?? v.pk) : v
      ).filter(Boolean);

      const areas = planningState?.selectedArea
        ? [planningState.selectedArea]
        : selectedCity?.name ? [selectedCity.name] : [];
      const city = selectedCity?.id ?? selectedCity?.name ?? '';

      const userTags = {
        vibe_tags: planningState?.selectedVibeTags || [],
        category_tags: planningState?.selectedCategoryTags || [],
        special_tags: planningState?.selectedSpecialTags || [],
        price_tag: planningState?.selectedPriceTags || null,
      };

      console.log('save-plan payload:', JSON.stringify({ selectedVenueIds, city, areas, user_tags: userTags }));

      const response = await fetch(`${API_BASE}/save-plan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedVenueIds,
          city_id: city,
          area: areas,
          user_tags: userTags,
          state: JSON.stringify(currentPlan),
        }),
      });

      const data = await response.json();
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['saved-plans'] });
        setShowConfetti(true);
        setTimeout(() => {
          navigation.navigate('MainTabs', { screen: 'Saved' });
        }, 1200);
      } else {
        alert('Failed to save plan: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan');
    } finally {
      setIsSaving(false);
    }
  };

  if (stages.length === 0) {
    return (
      <View style={[commonStyles.container, commonStyles.justifyContentCenter, commonStyles.alignItemsCenter, commonStyles.paddingXL]}>
        <Text style={[commonStyles.body, commonStyles.textSecondary, { textAlign: 'center' }]}>
          No venues found in the plan
        </Text>
        <Text style={[commonStyles.smallLabel, commonStyles.textMuted, { textAlign: 'center' }, commonStyles.mtSM]}>
          Check console for data structure
        </Text>
      </View>
    );
  }

  return (
    <>
    <View style={commonStyles.container}>
      <View style={[commonStyles.paddingXL, { flex: 1 }]}>
        <View style={[commonStyles.row, commonStyles.justifyContentBetween, commonStyles.alignItemsCenter, commonStyles.mbMD]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.iconButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRegenerate} style={commonStyles.iconButton}>
            <RefreshCw size={24} color={colors.primaryAccent} />
          </TouchableOpacity>
        </View>

        <View style={commonStyles.mbMD}>
          <Text style={commonStyles.mainHeading}>
            Your Curated Evening
          </Text>
          <View style={[commonStyles.row, commonStyles.alignItemsCenter, commonStyles.gapSM]}>
            <View style={commonStyles.successBadge}>
              <Text style={commonStyles.successText}>
                Strong match for your vibe
              </Text>
            </View>
          </View>
        </View>

        <View style={commonStyles.mbSM}>
          <TouchableOpacity
            onPress={() => setPreferencesExpanded(!preferencesExpanded)}
            style={[commonStyles.row, commonStyles.alignItemsCenter, commonStyles.mbSM]}
          >
            <Text style={[commonStyles.cardTitle, commonStyles.marginRightSM]}>
              Your Preferences
            </Text>
            {preferencesExpanded ? (
              <ChevronUp size={20} color={colors.textSecondary} />
            ) : (
              <ChevronDown size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
          {preferencesExpanded && (
            <View style={commonStyles.preferencesTags}>
              {getAllUserTags().map(({ tag, type }, index) => (
                <View
                  key={`${tag}-${type}-${index}`}
                  style={[
                    commonStyles.tag,
                    {
                      backgroundColor: getTagColor(tag, type),
                      width: '23%',
                    },
                  ]}>
                  <Text style={commonStyles.tagText}>
                    {tag.replace('_', ' ')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={[commonStyles.sectionHeading, commonStyles.mbMD]}>
          Your ({stages.length} stage plan)
        </Text>

        <ScrollView style={commonStyles.flex1} showsVerticalScrollIndicator={false}>
          {openingLine && <OpeningClosingLine text={openingLine} isOpening={true} />}
          {stages.map((stageData, stageIndex) => {
            const [venueOptions, area, transitionMessage] = Array.isArray(stageData)
              ? stageData
              : [stageData, null, null];
            const selectedVenueForStage = selectedVenues[stageIndex];
            const prevSelectedVenue = selectedVenues[stageIndex - 1];
            const travelInfo = prevSelectedVenue && selectedVenueForStage
              ? getTravelInfo(prevSelectedVenue, selectedVenueForStage)
              : null;
            const sortedVenueOptions = [...venueOptions].sort((a, b) => (b.score || 0) - (a.score || 0));
            const bestMatchVenue = sortedVenueOptions[0];
            const experimentalVenue = sortedVenueOptions[sortedVenueOptions.length - 1];

            return (
              <View key={stageIndex} style={commonStyles.stageContainer}>
                {stageIndex > 0 && transitionMessage && (
                  <AreaSwitch message={transitionMessage} />
                )}
                <StageConnector travelInfo={travelInfo} />

                <View style={[commonStyles.row, commonStyles.alignItemsCenter, commonStyles.mbMD]}>
                  <Text style={[commonStyles.cardTitle, commonStyles.marginRightSM]}>
                    Stage {stageIndex + 1}
                  </Text>
                  <View style={commonStyles.dividerDot} />
                  <Text style={[commonStyles.smallLabel, commonStyles.textMuted, commonStyles.marginLeftSM]}>
                    {showFinalized ? 'Selected' : `${sortedVenueOptions.length} options`}
                  </Text>
                  {area && (
                    <>
                      <View style={[commonStyles.dividerDot, commonStyles.dividerDotMargin]} />
                      <Text style={[commonStyles.smallLabel, commonStyles.areaLabel]}>
                        📍 {area.replace('_', ' ')}{planState && `, ${planState}`}
                      </Text>
                    </>
                  )}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={commonStyles.gapMD}
                >
                  {sortedVenueOptions.map((venue, venueIndex) => (
                    <View
                      key={venue.id || `${stageIndex}-${venueIndex}`}
                      style={commonStyles.venueCardWidth}
                    >
                      <VenueCard
                        venue={venue}
                        isSaved={savedVenueIds.includes(venue.id)}
                        isStageSelected={selectedVenues[stageIndex]?.id === venue.id}
                        isBestMatch={bestMatchVenue?.id === venue.id}
                        isExperimental={experimentalVenue?.id === venue.id && sortedVenueOptions.length > 1}
                        onReplace={() => {}}
                        onMaps={() => handleOpenMaps(venue.google_maps_uri)}
                        onSave={() => handleSaveVenue(venue.id)}
                        onShare={() => {}}
                        userTags={userTags}
                        onPress={() => handleOpenModal(venue)}
                        onStageSelect={() => handleSelectVenue(stageIndex, venue)}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            );
          })}
          {closingLine && <OpeningClosingLine text={closingLine} isOpening={false} />}
        </ScrollView>

        <View style={[commonStyles.paddingXL, commonStyles.row, commonStyles.gapMD]}>
          {!showFinalized ? (
            allSelected ? (
              <Animated.View style={{ flex: 1, opacity: finalizeAnim }}>
                <Button
                  title="Finalize Plan"
                  onPress={handleFinalize}
                  variant="primary"
                />
              </Animated.View>
            ) : null
          ) : (
            <>
              <Button
                title="Edit Plan"
                onPress={handleEdit}
                variant="secondary"
                disabled={isSaving}
                style={commonStyles.flex1}
              />
              <Button
                title="Save"
                onPress={handleSavePlan}
                loading={isSaving}
                variant="primary"
                style={commonStyles.flex1}
              />
            </>
          )}
        </View>
      </View>
    </View>

    <VenueDetailModal
      visible={modalVisible}
      venue={selectedVenue}
      onClose={handleCloseModal}
      onMaps={handleModalMaps}
      userTags={userTags}
    />

    {showConfetti && (
      <ConfettiCannon
        count={120}
        origin={{ x: screenWidth / 2, y: 0 }}
        autoStart
        fadeOut
        fallSpeed={3000}
        colors={['#FF6B2B', '#FFD60A', '#FF9A6C', '#22C55E', '#60A5FA', '#A855F7']}
      />
    )}
    </>
  );
};