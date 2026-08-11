import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { EVOLUTION_CHART_TOOLTIP_WIDTH } from './constants';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
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
            width: scaleHorizontal(EVOLUTION_CHART_TOOLTIP_WIDTH),
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
            paddingHorizontal: scaleHorizontal(6),
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
