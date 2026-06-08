import { StyleSheet } from 'react-native';
import { spacing, radius, fontSize } from '../theme/constants';

export const createCommonStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.mainBackground,
    },
    paddingXL: {
      padding: spacing.xl,
    },
    paddingXXL: {
      paddingTop: spacing.xxl,
    },
    row: {
      flexDirection: 'row',
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    justifyContentBetween: {
      justifyContent: 'space-between',
    },
    gapSM: {
      gap: spacing.sm,
    },
    gapMD: {
      gap: spacing.md,
    },
    gapLG: {
      gap: spacing.lg,
    },
    cardSurface: {
      backgroundColor: colors.cardSurface,
      borderRadius: radius.card,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    textPrimary: {
      color: colors.textPrimary,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    textMuted: {
      color: colors.textMuted,
    },
    mainHeading: {
      fontSize: fontSize.mainHeading,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sectionHeading: {
      fontSize: fontSize.sectionHeading,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    cardTitle: {
      fontSize: fontSize.cardTitle,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    body: {
      fontSize: fontSize.body,
      color: colors.textPrimary,
    },
    smallLabel: {
      fontSize: fontSize.smallLabel,
      color: colors.textSecondary,
    },
    metadata: {
      fontSize: fontSize.metadata,
      color: colors.textSecondary,
    },
    mbSM: {
      marginBottom: spacing.sm,
    },
    mbMD: {
      marginBottom: spacing.md,
    },
    mbLG: {
      marginBottom: spacing.lg,
    },
    mbXL: {
      marginBottom: spacing.xl,
    },
    mtSM: {
      marginTop: spacing.sm,
    },
    mtMD: {
      marginTop: spacing.md,
    },
    mtLG: {
      marginTop: spacing.lg,
    },
    iconButton: {
      padding: spacing.sm,
    },
    quickGenerateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardSurface,
      padding: spacing.lg,
      borderRadius: radius.card,
      marginBottom: spacing.xl,
      gap: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    quickGenerateIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryAccent + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    successBadge: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
    },
    successText: {
      fontSize: fontSize.smallLabel,
      color: colors.success,
      fontWeight: '600',
    },
    connector: {
      width: 2,
      height: 20,
      backgroundColor: colors.inputSurface,
    },
    venueCard: {
      backgroundColor: colors.cardSurface,
      borderRadius: radius.card,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    venueCardImage: {
      width: '100%',
      height: 200,
    },
    venueCardContent: {
      padding: spacing.lg,
      paddingTop: spacing.md,
    },
    venueCardTitle: {
      fontSize: fontSize.cardTitle,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    venueCardSummary: {
      fontSize: fontSize.smallLabel,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      lineHeight: 18,
    },
    tagsContainer: {
      gap: spacing.sm,
    },
    tag: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 6,
    },
    matchedTag: {},
    tagText: {
      fontSize: fontSize.metadata,
      color: '#FFFFFF',
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    matchedTagText: {
      fontSize: 14,
      fontWeight: '700',
    },
    unmatchedTag: {
      opacity: 0.6,
    },
    unmatchedTagText: {
      fontWeight: '400',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: colors.cardSurface,
      borderTopLeftRadius: radius.card,
      borderTopRightRadius: radius.card,
      maxHeight: '80%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors.inputSurface,
    },
    modalHeaderTitle: {
      fontSize: fontSize.mainHeading,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
    modalCloseButton: {
      padding: spacing.sm,
    },
    modalContent: {
      padding: spacing.xl,
    },
    modalImage: {
      width: '100%',
      height: 220,
      borderRadius: radius.card,
      marginBottom: spacing.lg,
    },
    modalTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      letterSpacing: -0.5,
    },
    modalSummary: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
    modalSection: {
      marginBottom: spacing.lg,
    },
    modalSectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: spacing.md,
      letterSpacing: -0.3,
    },
    modalAddressRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    modalAddress: {
      flex: 1,
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    modalTagsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    modalTagsGridMargin: {
      marginTop: spacing.md,
    },
    modalTagLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    modalTagLabelMargin: {
      marginTop: spacing.lg,
    },
    modalTag: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 6,
    },
    modalTagText: {
      fontSize: 13,
      color: '#FFFFFF',
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    modalMatchedTag: {},
    modalMatchedTagText: {
      fontSize: 15,
      fontWeight: '800',
    },
    modalUnmatchedTag: {
      opacity: 0.9,
    },
    modalUnmatchedTagText: {
      fontWeight: '400',
      fontSize: 12,
    },
    modalFooter: {
      padding: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.inputSurface,
    },
    modalMapsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: colors.textPrimary,
      paddingVertical: spacing.md,
      borderRadius: 8,
    },
    modalMapsButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.cardSurface,
    },
    flex1: {
      flex: 1,
    },
    dividerDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textMuted,
    },
    venueCardWidth: {
      width: 280,
    },
    areaSwitch: {
      backgroundColor: colors.primaryAccent + '15',
      padding: spacing.md,
      borderRadius: radius.card,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primaryAccent,
    },
    areaSwitchText: {
      fontSize: 14,
      color: colors.primaryAccent,
      fontWeight: '600',
    },
    openingClosingLine: {
      backgroundColor: colors.primaryAccent + '10',
      padding: spacing.lg,
      borderRadius: radius.card,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primaryAccent,
    },
    closingLine: {
      backgroundColor: colors.success + '10',
      padding: spacing.lg,
      borderRadius: radius.card,
      marginBottom: spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
    },
    openingClosingText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    preferencesTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    stageContainer: {
      marginBottom: spacing.xl,
    },
    dividerDotMargin: {
      marginLeft: spacing.sm,
    },
    marginRightSM: {
      marginRight: spacing.sm,
    },
    marginLeftSM: {
      marginLeft: spacing.sm,
    },
    areaLabel: {
      color: colors.primaryAccent,
      marginLeft: spacing.sm,
    },
    selectedVenueCard: {
      borderWidth: 3,
      borderColor: colors.primaryAccent,
    },
    selectionBadge: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      backgroundColor: colors.primaryAccent,
      borderRadius: 12,
      padding: 4,
      zIndex: 1,
    },
    bestMatchBadge: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
      backgroundColor: colors.success,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      zIndex: 1,
    },
    bestMatchText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    experimentalBadge: {
      position: 'absolute',
      top: spacing.xl,
      left: spacing.md,
      backgroundColor: colors.textSecondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      zIndex: 1,
    },
    experimentalText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    planCard: {
      backgroundColor: colors.cardSurface,
      borderRadius: radius.card,
      marginBottom: spacing.lg,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    planCardImage: {
      width: '100%',
      height: 200,
    },
    savedPlanCardImage: {
      width: '100%',
      height: 500,
    },
    planCardContent: {
      padding: spacing.lg,
    },
    planDetailImage: {
      width: 280,
      height: 400,
      borderRadius: radius.card,
    },
    travelInfoContainer: {
      backgroundColor: colors.cardSurface,
      padding: spacing.md,
      borderRadius: radius.card,
      marginBottom: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.success,
    },
    travelInfoText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '600',
    },
  });
