import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/useTheme';
import { getTagColor } from '../utils/tagColors';
import { FadeImage } from './FadeImage';

export const VenueCard = ({
  venue,
  onReplace,
  onMaps,
  onSave,
  onShare,
  isSaved,
  isStageSelected = false,
  isBestMatch = false,
  isExperimental = false,
  onStageSelect,
  userTags = [],
  onPress,
}) => {
  const { colors, commonStyles, isDark } = useTheme();

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onStageSelect?.();
  };

  const tagCategories = [
    ...(venue.tags?.category_tags?.map(tag => ({ tag, category: 'category' })) || []),
    ...(venue.tags?.vibe_tags?.map(tag => ({ tag, category: 'vibe' })) || []),
    ...(venue.tags?.special_tags?.map(tag => ({ tag, category: 'special' })) || []),
    ...(venue.tags?.price_tags?.map(tag => ({ tag, category: 'price' })) || []),
  ];

  const isUserTag = (tag) => userTags.includes(tag);
  const sortedTags = [...tagCategories].sort((a, b) => {
    const aIsUser = isUserTag(a.tag);
    const bIsUser = isUserTag(b.tag);
    if (aIsUser && !bIsUser) return -1;
    if (!aIsUser && bIsUser) return 1;
    return 0;
  });

  return (
    <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} activeOpacity={0.9}>
      <View style={[commonStyles.venueCard, isStageSelected && commonStyles.selectedVenueCard]}>
        {isStageSelected && (
          <View style={commonStyles.selectionBadge}>
            <Check size={14} color={colors.mainBackground} />
          </View>
        )}
        {isBestMatch && (
          <View style={commonStyles.bestMatchBadge}>
            <Text style={commonStyles.bestMatchText}>Best Match</Text>
          </View>
        )}
        {isExperimental && (
          <View style={commonStyles.experimentalBadge}>
            <Text style={commonStyles.experimentalText}>Experimental</Text>
          </View>
        )}

        <FadeImage
          source={{ uri: venue.image_url }}
          style={commonStyles.venueCardImage}
          resizeMode="cover"
        />

        <View style={commonStyles.venueCardContent}>
          <Text style={commonStyles.venueCardTitle} numberOfLines={2}>{venue.title}</Text>
          <Text style={commonStyles.venueCardSummary} numberOfLines={3}>{venue.summary}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={commonStyles.tagsContainer}
          >
            {sortedTags.map(({ tag, category }, index) => {
              const isMatched = isUserTag(tag);
              return (
                <View
                  key={`${tag}-${category}-${index}`}
                  style={[
                    commonStyles.tag,
                    { backgroundColor: getTagColor(category, isMatched, isDark) },
                    isMatched && commonStyles.matchedTag,
                    !isMatched && commonStyles.unmatchedTag,
                  ]}
                >
                  <Text style={[commonStyles.tagText, isMatched && commonStyles.matchedTagText, !isMatched && commonStyles.unmatchedTagText]}>
                    {tag.replace('_', ' ')}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </TouchableOpacity>
  );
};
