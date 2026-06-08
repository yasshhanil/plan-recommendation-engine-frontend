import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { StageConnector } from '../components/StageConnector';
import { getVenuesByIds } from '../services/api';
import { VenueCard } from '../components/VenueCard';
import { VenueDetailModal } from '../components/VenueDetailModal';

export const PlanDetailScreen = ({ navigation, route }) => {
  const { colors, commonStyles, isDark } = useTheme();
  const { plan } = route.params;
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, [plan.venue_ids]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      if (plan.venue_ids && plan.venue_ids.length > 0) {
        const response = await getVenuesByIds(plan.venue_ids);
        if (response.success) {
          setVenues(response.venues);
        }
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (venue) => {
    setSelectedVenue(venue);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedVenue(null);
  };

  const handleOpenMaps = (uri) => {
    if (uri) {
      Linking.openURL(uri);
    }
  };

  const handleModalMaps = () => {
    if (selectedVenue?.google_maps_uri) {
      handleOpenMaps(selectedVenue.google_maps_uri);
    }
  };

  const getTravelInfo = (venue1, venue2) => {
    if (!venue1?.lat || !venue1?.lng || !venue2?.lat || !venue2?.lng) {
      return null;
    }

    const R = 6371;
    const dLat = (venue2.lat - venue1.lat) * (Math.PI / 180);
    const dLon = (venue2.lng - venue1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(venue1.lat * (Math.PI / 180)) *
      Math.cos(venue2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const isWalking = distance < 1.5;
    const time = Math.round((distance / (isWalking ? 5 : 25)) * 60);

    return {
      distance: distance.toFixed(1),
      time,
    };
  };

  const userTags = plan.user_tags || {};
  const userTagsList = [
    ...(userTags.vibe_tags || []),
    ...(userTags.category_tags || []),
    ...(userTags.special_tags || []),
    ...(userTags.price_tag ? [userTags.price_tag] : []),
  ];

  const getTagColor = (tag, tagType) => {
    const palette = isDark
      ? { vibe: '#6D28D9', category: '#1D4ED8', special: '#0C6888', price: '#047857', area: '#991B1B' }
      : { vibe: '#7C3AED', category: '#2563EB', special: '#0891B2', price: '#059669', area: '#DC2626' };
    return palette[tagType] ?? (isDark ? '#4B5563' : '#94A3B8');
  };

  const getAllUserTags = () => {
    const tags = [];
    if (userTags.vibe_tags) {
      userTags.vibe_tags.forEach(tag => tags.push({ tag, type: 'vibe' }));
    }
    if (userTags.category_tags) {
      userTags.category_tags.forEach(tag => tags.push({ tag, type: 'category' }));
    }
    if (userTags.special_tags) {
      userTags.special_tags.forEach(tag => tags.push({ tag, type: 'special' }));
    }
    if (userTags.price_tag) {
      tags.push({ tag: userTags.price_tag, type: 'price' });
    }
    return tags;
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.justifyContentCenter, commonStyles.alignItemsCenter]}>
        <ActivityIndicator size="large" color={colors.primaryAccent} />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={[commonStyles.container, commonStyles.justifyContentCenter, commonStyles.alignItemsCenter, commonStyles.paddingXL]}>
        <Text style={[commonStyles.body, commonStyles.textSecondary, { textAlign: 'center' }]}>
          Plan not found
        </Text>
      </View>
    );
  }

  const areas = plan.area || [];
  const stageCount = venues.length;

  return (
    <>
    <View style={commonStyles.container}>
      <View style={[commonStyles.paddingXL, { flex: 1 }]}>
        <View style={[commonStyles.row, commonStyles.justifyContentBetween, commonStyles.alignItemsCenter, commonStyles.mbMD]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.iconButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={commonStyles.mbLG}>
          <TouchableOpacity
            style={[commonStyles.row, commonStyles.alignItemsCenter, commonStyles.justifyContentBetween]}
            onPress={() => setPreferencesExpanded(!preferencesExpanded)}
          >
            <Text style={commonStyles.sectionHeading}>Your Preferences</Text>
            <Text style={commonStyles.textMuted}>
              {preferencesExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {preferencesExpanded && (
            <View style={[commonStyles.preferencesTags, commonStyles.mtMD]}>
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
          Your ({stageCount} stage plan)
        </Text>

        <ScrollView style={commonStyles.flex1} showsVerticalScrollIndicator={false}>
          {venues.map((venue, stageIndex) => {
            const area = areas[stageIndex] || null;
            const prevVenue = venues[stageIndex - 1];
            const travelInfo = prevVenue ? getTravelInfo(prevVenue, venue) : null;
            return (
              <View key={venue.id} style={commonStyles.stageContainer}>
                <StageConnector travelInfo={travelInfo} />
                {stageIndex > 0 && (
                  <View style={commonStyles.areaSwitch}>
                    <Text style={commonStyles.areaSwitchText}>
                      Next stop
                    </Text>
                  </View>
                )}

                <View style={[commonStyles.row, commonStyles.alignItemsCenter, commonStyles.mbMD]}>
                  <Text style={[commonStyles.cardTitle, commonStyles.marginRightSM]}>
                    Stage {stageIndex + 1}
                  </Text>
                  {area && (
                    <>
                      <View style={commonStyles.dividerDot} />
                      <Text style={[commonStyles.smallLabel, commonStyles.areaLabel, commonStyles.marginLeftSM]}>
                        📍 {area.replace('_', ' ')}
                      </Text>
                    </>
                  )}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={commonStyles.gapMD}
                >
                  <View style={{ width: 320 }}>
                    <VenueCard
                      venue={venue}
                      isSaved={false}
                      onReplace={() => {}}
                      onMaps={() => handleOpenMaps(venue.google_maps_uri)}
                      onSave={() => {}}
                      onShare={() => {}}
                      userTags={userTagsList}
                      onPress={() => handleOpenModal(venue)}
                      onStageSelect={() => {}}
                    />
                  </View>
                </ScrollView>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>

    <VenueDetailModal
      visible={modalVisible}
      venue={selectedVenue}
      onClose={handleCloseModal}
      onMaps={handleModalMaps}
      userTags={userTagsList}
    />
    </>
  );
};
