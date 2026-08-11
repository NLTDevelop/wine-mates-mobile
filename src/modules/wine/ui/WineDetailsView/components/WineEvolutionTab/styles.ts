import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        root: {
            gap: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
        loaderContainer: {
            height: scaleVertical(240),
            alignItems: 'center',
            justifyContent: 'center',
        },
        section: {
            gap: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        sectionTitle: {
            color: colors.text,
        },
        yearContent: {
            gap: scaleVertical(12),
        },
        yearPickerColumn: {
            gap: scaleVertical(4),
            width: '100%',
        },
        yearPickerLabel: {
            color: colors.text_light,
        },
        yearPicker: {
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(8),
        },
        yearText: {
            color: colors.text,
            flex: 1,
        },
        yearDescription: {
            color: colors.text_light,
            lineHeight: scaleVertical(14),
        },
        proAssessment: {
            flex: 1,
            width: 0,
            minHeight: scaleVertical(78),
            paddingVertical: scaleVertical(6),
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleVertical(2),
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border_light,
            borderRadius: scaleVertical(8),
        },
        selectedRatings: {
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: scaleHorizontal(8),
            width: '100%',
        },
        proAssessmentLabel: {
            color: colors.icon,
            width: '100%',
            textAlign: 'center',
        },
        expertCarousel: {
            width: '100%',
            height: scaleVertical(100),
        },
        expertCarouselNoData: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertItem: {
            width: scaleHorizontal(96),
            gap: scaleVertical(8),
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertMedalSlot: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertStarsSlot: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertYear: {
            color: colors.icon,
            textAlign: 'center',
        },
        expertNoData: {
            color: colors.icon,
        },
        proAssessmentNoData: {
            color: colors.icon,
        },
        ratingCard: {
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(8),
            overflow: 'hidden',
        },
        ratingTable: {
            gap: 0,
        },
        ratingYearsHint: {
            height: scaleVertical(20),
            paddingLeft: scaleHorizontal(8),
            justifyContent: 'center',
            backgroundColor: colors.evolution_background_grey,
        },
        ratingYearsHintText: {
            color: colors.text_light,
        },
        ratingHeader: {
            height: scaleVertical(40),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.evolution_background_grey,
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border_light,
        },
        ratingRow: {
            height: scaleVertical(47),
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border_light,
        },
        ratingLabel: {
            width: scaleHorizontal(68),
            paddingLeft: scaleHorizontal(8),
            color: colors.text,
        },
        ratingCell: {
            width: scaleHorizontal(55),
            alignItems: 'center',
            justifyContent: 'center',
        },
        ratingHeaderCell: {
            height: scaleVertical(25),
            position: 'relative',
        },
        ratingHeaderAccent: {
            position: 'absolute',
            top: 0,
            alignSelf: 'center',
            width: scaleHorizontal(36),
            height: scaleVertical(2),
            borderRadius: scaleVertical(2),
        },
        ratingHeaderAccentRed: {
            backgroundColor: colors.evolutionChartRed,
        },
        ratingHeaderAccentGreen: {
            backgroundColor: colors.evolutionChartGreen,
        },
        ratingHeaderAccentBlue: {
            backgroundColor: colors.evolutionChartBlue,
        },
        ratingHeaderAccentYellow: {
            backgroundColor: colors.evolutionChartYellow,
        },
        ratingHeaderAccentPurple: {
            backgroundColor: colors.evolutionChartPurple,
        },
        ratingHeaderText: {
            width: '100%',
            color: colors.text,
            textAlign: 'center',
        },
        ratingValue: {
            color: colors.text,
            textAlign: 'center',
        },
        ratingReviews: {
            color: colors.text_light,
            textAlign: 'center',
        },
        ratingValueRow: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(2),
        },
        winePeakCard: {
            height: scaleVertical(48),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            borderRadius: scaleVertical(12),
        },
        winePeakYear: {
            color: colors.text_inverted,
            textAlign: 'center',
        },
        winePeakReviews: {
            color: colors.text_inverted,
            opacity: 0.7,
            textAlign: 'center',
        },
        carouselSection: {
            gap: scaleVertical(8),
        },
        carouselHeader: {
            height: scaleVertical(40),
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        carouselHeaderTitle: {
            color: colors.text,
        },
        carouselActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        carouselArrow: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scaleVertical(40),
            backgroundColor: colors.primary,
        },
        carouselArrowDisabled: {
            opacity: 0.3,
        },
        carouselViewport: {
            marginLeft: scaleHorizontal(16),
        },
        carousel: {
            overflow: 'visible',
        },
        metricSection: {
            gap: scaleVertical(8),
        },
        metricList: {
            gap: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        metricSectionHeader: {
            height: scaleVertical(40),
            paddingHorizontal: scaleHorizontal(16),
            justifyContent: 'center',
        },
        metricSectionTitle: {
            color: colors.text,
        },
    });

    return styles;
};
