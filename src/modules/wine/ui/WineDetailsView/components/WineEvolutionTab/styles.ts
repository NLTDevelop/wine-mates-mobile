import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        root: {
            gap: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
        section: {
            gap: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        sectionTitle: {
            color: colors.text,
        },
        yearContent: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
        yearPickerColumn: {
            gap: scaleVertical(4),
            width: scaleHorizontal(153),
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
        },
        proAssessment: {
            alignItems: 'center',
            gap: scaleVertical(2),
            width: scaleHorizontal(70),
        },
        proAssessmentLabel: {
            color: colors.icon,
            textAlign: 'center',
        },
        expertCarousel: {
            width: '100%',
            height: scaleVertical(68),
        },
        expertCarouselNoData: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        expertItem: {
            width: scaleHorizontal(66),
            height: scaleVertical(68),
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
            width: scaleHorizontal(67),
            paddingLeft: scaleHorizontal(12),
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
            width: scaleHorizontal(24),
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
            flexShrink: 0,
            lineHeight: scaleVertical(18),
        },
        graphArea: {
            gap: scaleVertical(4),
            width: '100%',
        },
        graphPlotRow: {
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleVertical(282),
        },
        graphYLabels: {
            width: scaleHorizontal(35),
            height: scaleVertical(282),
            justifyContent: 'space-between',
        },
        graphYAxis: {
            color: colors.icon,
        },
        graphPlot: {
            flex: 1,
            height: scaleVertical(282),
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
            marginLeft: scaleHorizontal(35),
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
        graphXAxisLabel: {
            color: colors.icon,
            textAlign: 'center',
            flex: 1,
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
        toggleThumb: {
            width: scaleVertical(15),
            height: scaleVertical(15),
            backgroundColor: colors.text_inverted,
            borderRadius: scaleVertical(15),
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
            height: scaleVertical(444),
            marginLeft: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingLeft: scaleHorizontal(12),
            gap: scaleVertical(6),
            backgroundColor: colors.evolution_background_grey,
            borderRadius: scaleVertical(12),
        },
        carousel: {
            height: scaleVertical(420),
            overflow: 'visible',
        },
        carouselItem: {
            width: scaleHorizontal(233),
            height: scaleVertical(420),
        },
        statCard: {
            width: scaleHorizontal(223),
            height: scaleVertical(404),
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
            height: scaleVertical(46),
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
            flex: 1,
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
            height: scaleVertical(280),
            gap: scaleVertical(12),
            padding: scaleHorizontal(16),
            backgroundColor: colors.evolution_background_grey,
            borderRadius: scaleVertical(12),
        },
        metricTitle: {
            color: colors.text,
            flexShrink: 0,
            lineHeight: scaleVertical(20),
        },
        metricGraphPlot: {
            height: scaleVertical(193),
            flex: 1,
        },
        metricGraphPlotNoData: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        metricPlotRow: {
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleVertical(193),
        },
        metricYLabels: {
            width: scaleHorizontal(35),
            height: scaleVertical(193),
            justifyContent: 'space-between',
        },
        metricXAxis: {
            height: scaleVertical(20),
            marginLeft: scaleHorizontal(35),
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
    });

    return styles;
};
