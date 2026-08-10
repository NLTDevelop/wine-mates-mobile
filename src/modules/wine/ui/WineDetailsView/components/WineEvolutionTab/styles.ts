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
            height: scaleVertical(100),
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertMedalSlot: {
            width: scaleHorizontal(54),
            height: scaleVertical(54),
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertStarsSlot: {
            height: scaleVertical(16),
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
        summaryCard: {
            gap: scaleVertical(12),
            marginHorizontal: scaleHorizontal(16),
            padding: scaleHorizontal(16),
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(12),
        },
        summaryTitle: {
            color: colors.text,
            flexShrink: 1,
            lineHeight: scaleVertical(18),
        },
        graphArea: {
            gap: scaleVertical(4),
            width: '100%',
        },
        graphPlotRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            height: scaleVertical(306),
        },
        graphYLabels: {
            width: scaleHorizontal(35),
            height: scaleVertical(282),
            justifyContent: 'space-between',
        },
        graphYAxis: {
            color: colors.icon,
            lineHeight: scaleVertical(14),
        },
        graphPlot: {
            flex: 0,
            width: '100%',
            height: scaleVertical(282),
        },
        chartZoomLayer: {
            width: '100%',
            height: '100%',
        },
        graphTooltip: {
            position: 'absolute',
            width: scaleHorizontal(112),
            minHeight: scaleVertical(44),
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(8),
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: scaleVertical(2),
            },
            shadowOpacity: 0.15,
            shadowRadius: scaleVertical(4),
            elevation: 4,
        },
        graphTooltipYear: {
            color: colors.icon,
        },
        graphTooltipValue: {
            color: colors.text,
        },
        graphScrollViewport: {
            flex: 1,
        },
        graphScrollContent: {
            gap: scaleVertical(4),
        },
        graphPlotNoData: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        graphNoDataText: {
            color: colors.icon,
        },
        graphXAxis: {
            height: scaleVertical(20),
            marginLeft: 0,
            paddingLeft: 0,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
        graphXAxisLabel: {
            color: colors.icon,
            textAlign: 'center',
            flex: 1,
            lineHeight: scaleVertical(14),
        },
        graphXAxisLabelHidden: {
            flex: 0,
            width: 0,
        },
        audienceSection: {
            gap: scaleVertical(8),
        },
        audienceHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        audienceTitle: {
            color: colors.text,
        },
        toggle: {
            width: scaleHorizontal(32),
            height: scaleVertical(19),
            padding: scaleVertical(2),
            alignItems: 'flex-end',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            borderRadius: scaleVertical(20),
        },
        toggleInactive: {
            alignItems: 'flex-start',
            backgroundColor: colors.border,
        },
        toggleThumb: {
            width: scaleVertical(15),
            height: scaleVertical(15),
            backgroundColor: colors.text_inverted,
            borderRadius: scaleVertical(15),
        },
        toggleThumbInactive: {
            backgroundColor: colors.background,
        },
        chips: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleVertical(8),
        },
        chip: {
            height: scaleVertical(20),
            paddingHorizontal: scaleHorizontal(8),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
            borderWidth: scaleVertical(1),
            borderRadius: scaleVertical(20),
        },
        chipDot: {
            width: scaleVertical(8),
            height: scaleVertical(8),
            borderRadius: scaleVertical(8),
        },
        chipText: {
            color: colors.text,
        },
        redChip: {
            borderColor: colors.evolutionChartRed,
            backgroundColor: colors.evolutionChartRedBackground,
        },
        greenChip: {
            borderColor: colors.evolutionChartGreen,
            backgroundColor: colors.evolutionChartGreenBackground,
        },
        blueChip: {
            borderColor: colors.evolutionChartBlue,
            backgroundColor: colors.evolutionChartBlueBackground,
        },
        yellowChip: {
            borderColor: colors.evolutionChartYellow,
            backgroundColor: colors.evolutionChartYellowBackground,
        },
        purpleChip: {
            borderColor: colors.evolutionChartPurple,
            backgroundColor: colors.evolutionChartPurpleBackground,
            opacity: 0.4,
        },
        redChipDot: {
            backgroundColor: colors.evolutionChartRed,
        },
        greenChipDot: {
            backgroundColor: colors.evolutionChartGreen,
        },
        blueChipDot: {
            backgroundColor: colors.evolutionChartBlue,
        },
        yellowChipDot: {
            backgroundColor: colors.evolutionChartYellow,
        },
        purpleChipDot: {
            backgroundColor: colors.evolutionChartPurple,
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
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(12),
            paddingLeft: scaleHorizontal(12),
            backgroundColor: colors.evolution_background_grey,
            borderRadius: scaleVertical(12),
        },
        carousel: {
            overflow: 'visible',
        },
        carouselItem: {
            width: scaleHorizontal(233),
        },
        statCard: {
            width: scaleHorizontal(223),
            minHeight: scaleVertical(100),
            gap: scaleVertical(20),
            padding: scaleHorizontal(12),
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(8),
        },
        statBars: {
            gap: scaleVertical(8),
        },
        statBar: {
            minHeight: scaleVertical(46),
            paddingVertical: scaleVertical(6),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scaleVertical(4),
        },
        statLabel: {
            textAlign: 'center',
        },
        statReviews: {
            textAlign: 'center',
            opacity: 0.7,
        },
        avatarContent: {
            gap: scaleVertical(7),
        },
        avatarRow: {
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleVertical(24),
        },
        avatar: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderWidth: scaleVertical(1),
            borderColor: colors.text_inverted,
            borderRadius: scaleVertical(24),
            marginRight: scaleHorizontal(-8),
        },
        additionalPeople: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.evolutionPeopleBackground,
            borderWidth: scaleVertical(1),
            borderColor: colors.text_inverted,
            borderRadius: scaleVertical(24),
        },
        additionalPeopleText: {
            color: colors.primary,
        },
        avatarDescription: {
            color: colors.text_light,
        },
        statYear: {
            color: colors.text,
            textAlign: 'center',
        },
        emptyCard: {
            minHeight: scaleVertical(76),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.evolution_background_grey,
            borderRadius: scaleVertical(4),
        },
        emptyCardText: {
            color: colors.text,
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
        metricCard: {
            gap: scaleVertical(12),
            padding: scaleHorizontal(16),
            backgroundColor: colors.evolution_chart_background,
            borderRadius: scaleVertical(12),
        },
        metricTitle: {
            color: colors.text,
            flexShrink: 1,
            lineHeight: scaleVertical(20),
        },
        metricGraphPlot: {
            height: scaleVertical(193),
            flex: 0,
            width: '100%',
        },
        metricGraphPlotNoData: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        metricPlotRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            height: scaleVertical(217),
        },
        metricYLabels: {
            width: scaleHorizontal(80),
            height: scaleVertical(193),
            justifyContent: 'space-between',
        },
        metricXAxis: {
            height: scaleVertical(20),
            marginLeft: 0,
            paddingLeft: 0,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
    });

    return styles;
};
