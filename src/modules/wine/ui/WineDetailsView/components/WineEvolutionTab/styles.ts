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
            justifyContent: 'flex-end',
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
        expertList: {
            gap: scaleHorizontal(12),
            paddingVertical: scaleVertical(4),
        },
        expertItem: {
            gap: scaleVertical(2),
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertMedalSlot: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertWineLoverScore: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(4),
            marginTop: scaleVertical(4),
        },
        expertScore: {
            color: colors.text,
        },
        expertRatingLabel: {
            minHeight: scaleVertical(10),
            color: colors.icon,
            textAlign: 'center',
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
        carouselHeaderText: {
            flex: 1,
            gap: scaleVertical(2),
        },
        carouselHeaderDescription: {
            color: colors.text_light,
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
        carouselList: {
            gap: scaleHorizontal(12),
            paddingRight: scaleHorizontal(16),
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
