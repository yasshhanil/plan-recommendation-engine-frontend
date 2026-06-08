import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { FadeImage } from './FadeImage';
import { MapPin, X } from 'lucide-react-native';
import { useTheme } from '../theme/useTheme';
import { getTagColor } from '../utils/tagColors';

export const VenueDetailModal = ({ visible, venue, onClose, onMaps, userTags = [] }) => {
  const { colors, commonStyles, isDark } = useTheme();
  if (!venue) return null;

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
  const matchedTags = sortedTags.filter(({ tag }) => isUserTag(tag));
  const unmatchedTags = sortedTags.filter(({ tag }) => !isUserTag(tag));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContainer}>
          <View style={commonStyles.modalHeader}>
            <Text style={commonStyles.modalHeaderTitle}>Venue Details</Text>
            <TouchableOpacity onPress={onClose} style={commonStyles.modalCloseButton}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={commonStyles.modalContent} showsVerticalScrollIndicator={false}>
            <FadeImage source={{ uri: venue.image_url }} style={commonStyles.modalImage} resizeMode="cover" />
            <Text style={commonStyles.modalTitle}>{venue.title}</Text>
            <Text style={commonStyles.modalSummary}>{venue.summary}</Text>

            <View style={commonStyles.modalSection}>
              <View style={commonStyles.modalAddressRow}>
                <MapPin size={18} color={colors.primaryAccent} />
                <Text style={commonStyles.modalAddress}>{venue.address}</Text>
              </View>
            </View>

            <View style={commonStyles.modalSection}>
              <Text style={commonStyles.modalSectionTitle}>✨ What makes this place special</Text>

              {matchedTags.length > 0 && (
                <>
                  <Text style={commonStyles.modalTagLabel}>Matched with your preferences</Text>
                  <View style={commonStyles.modalTagsGrid}>
                    {matchedTags.map(({ tag, category }, index) => (
                      <View
                        key={`${tag}-${category}-${index}`}
                        style={[commonStyles.modalTag, { backgroundColor: getTagColor(category, true, isDark) }, commonStyles.modalMatchedTag]}
                      >
                        <Text style={[commonStyles.modalTagText, commonStyles.modalMatchedTagText]}>
                          {tag.replace('_', ' ')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {unmatchedTags.length > 0 && (
                <>
                  <Text style={[commonStyles.modalTagLabel, matchedTags.length > 0 && commonStyles.modalTagLabelMargin]}>
                    Other features
                  </Text>
                  <View style={commonStyles.modalTagsGrid}>
                    {unmatchedTags.map(({ tag, category }, index) => (
                      <View
                        key={`${tag}-${category}-${index}`}
                        style={[commonStyles.modalTag, { backgroundColor: getTagColor(category, false, isDark) }, commonStyles.modalUnmatchedTag]}
                      >
                        <Text style={[commonStyles.modalTagText, commonStyles.modalUnmatchedTagText]}>
                          {tag.replace('_', ' ')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          <View style={commonStyles.modalFooter}>
            <TouchableOpacity style={commonStyles.modalMapsButton} onPress={onMaps}>
              <MapPin size={20} color={colors.cardSurface} />
              <Text style={commonStyles.modalMapsButtonText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
