import { useCallback, useMemo } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Circle, Line, Path, Rect, Svg } from 'react-native-svg';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionChart } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from '../WineEvolutionTab/styles';
import { useEvolutionLineChart } from './presenters/useEvolutionLineChart';

interface IProps {
    chart: IWineEvolutionChart;
    isSummary?: boolean;
}

const CHART_TEXT_VARIANT = 'subtitle_12_500' as const;

export const EvolutionLineChartCard = ({ chart, isSummary = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { animatedChartStyle, onPlotPress, pinchGesture, plotWidth, selectedPoint, tooltipPosition } =
        useEvolutionLineChart({ chart });
    const renderXAxisLabel = useCallback(
        (label: string, index: number) => (
            <Typography
                key={`${label}-${index}`}
                text={label}
                variant={CHART_TEXT_VARIANT}
                style={styles.graphXAxisLabel}
                numberOfLines={1}
            />
        ),
        [styles.graphXAxisLabel],
    );

    return (
        <View style={isSummary ? styles.summaryCard : styles.metricCard}>
            <Typography
                text={chart.title}
                variant="h5"
                style={isSummary ? styles.summaryTitle : styles.metricTitle}
                numberOfLines={2}
            />
            <View style={styles.graphArea}>
                <View style={isSummary ? styles.graphPlotRow : styles.metricPlotRow}>
                    <View style={isSummary ? styles.graphYLabels : styles.metricYLabels}>
                        {chart.series.length ? (
                            <>
                                <Typography
                                    text={chart.yAxisLabels[0] ?? '-'}
                                    variant={CHART_TEXT_VARIANT}
                                    style={styles.graphYAxis}
                                    numberOfLines={2}
                                />
                                <Typography
                                    text={chart.yAxisLabels[1] ?? '-'}
                                    variant={CHART_TEXT_VARIANT}
                                    style={styles.graphYAxis}
                                    numberOfLines={2}
                                />
                                <Typography
                                    text={chart.yAxisLabels[2] ?? '-'}
                                    variant={CHART_TEXT_VARIANT}
                                    style={styles.graphYAxis}
                                    numberOfLines={2}
                                />
                            </>
                        ) : null}
                    </View>
                    <ScrollView
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        style={styles.graphScrollViewport}
                    >
                        <View style={[styles.graphScrollContent, { width: plotWidth }]}>
                            <View
                                style={[
                                    isSummary ? styles.graphPlot : styles.metricGraphPlot,
                                    { width: plotWidth },
                                    chart.series.length === 0
                                        ? isSummary
                                            ? styles.graphPlotNoData
                                            : styles.metricGraphPlotNoData
                                        : undefined,
                                ]}
                            >
                                {chart.series.length === 0 ? (
                                    <Typography text="-" variant={CHART_TEXT_VARIANT} style={styles.graphNoDataText} />
                                ) : (
                                    <GestureDetector gesture={pinchGesture}>
                                        <Animated.View style={[styles.chartZoomLayer, animatedChartStyle]}>
                                            <Svg
                                                width={plotWidth}
                                                height="100%"
                                                viewBox={`0 0 ${chart.plotWidth} ${chart.plotHeight}`}
                                            >
                                                <Rect
                                                    x="0"
                                                    y="0"
                                                    width={chart.plotWidth}
                                                    height={chart.plotHeight}
                                                    fill={colors.background}
                                                    opacity={0.01}
                                                    onPress={onPlotPress}
                                                />
                                                <Line
                                                    x1="0"
                                                    y1={chart.gridY[0]}
                                                    x2={chart.plotWidth}
                                                    y2={chart.gridY[0]}
                                                    stroke={colors.evolution_background_grey}
                                                    strokeWidth={1}
                                                    strokeDasharray="2 5"
                                                />
                                                <Line
                                                    x1="0"
                                                    y1={chart.gridY[1]}
                                                    x2={chart.plotWidth}
                                                    y2={chart.gridY[1]}
                                                    stroke={colors.evolution_background_grey}
                                                    strokeWidth={1}
                                                    strokeDasharray="2 5"
                                                />
                                                <Line
                                                    x1="0"
                                                    y1={chart.gridY[2]}
                                                    x2={chart.plotWidth}
                                                    y2={chart.gridY[2]}
                                                    stroke={colors.evolution_background_grey}
                                                    strokeWidth={1}
                                                    strokeDasharray="2 5"
                                                />
                                                {chart.gridY[3] !== undefined ? (
                                                    <Line
                                                        x1="0"
                                                        y1={chart.gridY[3]}
                                                        x2={chart.plotWidth}
                                                        y2={chart.gridY[3]}
                                                        stroke={colors.evolution_background_grey}
                                                        strokeWidth={1}
                                                        strokeDasharray="2 5"
                                                    />
                                                ) : null}
                                                {chart.gridY[4] !== undefined ? (
                                                    <Line
                                                        x1="0"
                                                        y1={chart.gridY[4]}
                                                        x2={chart.plotWidth}
                                                        y2={chart.gridY[4]}
                                                        stroke={colors.evolution_background_grey}
                                                        strokeWidth={1}
                                                        strokeDasharray="2 5"
                                                    />
                                                ) : null}
                                                {chart.gridY[5] !== undefined ? (
                                                    <Line
                                                        x1="0"
                                                        y1={chart.gridY[5]}
                                                        x2={chart.plotWidth}
                                                        y2={chart.gridY[5]}
                                                        stroke={colors.evolution_background_grey}
                                                        strokeWidth={1}
                                                        strokeDasharray="2 5"
                                                    />
                                                ) : null}
                                                {chart.series[0] ? (
                                                    <Path
                                                        d={chart.series[0].path}
                                                        fill="none"
                                                        stroke={chart.series[0].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[1] ? (
                                                    <Path
                                                        d={chart.series[1].path}
                                                        fill="none"
                                                        stroke={chart.series[1].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[2] ? (
                                                    <Path
                                                        d={chart.series[2].path}
                                                        fill="none"
                                                        stroke={chart.series[2].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[3] ? (
                                                    <Path
                                                        d={chart.series[3].path}
                                                        fill="none"
                                                        stroke={chart.series[3].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[4] ? (
                                                    <Path
                                                        d={chart.series[4].path}
                                                        fill="none"
                                                        stroke={chart.series[4].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[5] ? (
                                                    <Path
                                                        d={chart.series[5].path}
                                                        fill="none"
                                                        stroke={chart.series[5].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[6] ? (
                                                    <Path
                                                        d={chart.series[6].path}
                                                        fill="none"
                                                        stroke={chart.series[6].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[7] ? (
                                                    <Path
                                                        d={chart.series[7].path}
                                                        fill="none"
                                                        stroke={chart.series[7].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[8] ? (
                                                    <Path
                                                        d={chart.series[8].path}
                                                        fill="none"
                                                        stroke={chart.series[8].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[9] ? (
                                                    <Path
                                                        d={chart.series[9].path}
                                                        fill="none"
                                                        stroke={chart.series[9].color}
                                                        strokeWidth={chart.strokeWidth}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                ) : null}
                                                {chart.series[0] ? (
                                                    <Path
                                                        d={chart.series[0].markersPath}
                                                        fill={chart.series[0].color}
                                                    />
                                                ) : null}
                                                {chart.series[1] ? (
                                                    <Path
                                                        d={chart.series[1].markersPath}
                                                        fill={chart.series[1].color}
                                                    />
                                                ) : null}
                                                {chart.series[2] ? (
                                                    <Path
                                                        d={chart.series[2].markersPath}
                                                        fill={chart.series[2].color}
                                                    />
                                                ) : null}
                                                {chart.series[3] ? (
                                                    <Path
                                                        d={chart.series[3].markersPath}
                                                        fill={chart.series[3].color}
                                                    />
                                                ) : null}
                                                {chart.series[4] ? (
                                                    <Path
                                                        d={chart.series[4].markersPath}
                                                        fill={chart.series[4].color}
                                                    />
                                                ) : null}
                                                {chart.series[5] ? (
                                                    <Path
                                                        d={chart.series[5].markersPath}
                                                        fill={chart.series[5].color}
                                                    />
                                                ) : null}
                                                {chart.series[6] ? (
                                                    <Path
                                                        d={chart.series[6].markersPath}
                                                        fill={chart.series[6].color}
                                                    />
                                                ) : null}
                                                {chart.series[7] ? (
                                                    <Path
                                                        d={chart.series[7].markersPath}
                                                        fill={chart.series[7].color}
                                                    />
                                                ) : null}
                                                {chart.series[8] ? (
                                                    <Path
                                                        d={chart.series[8].markersPath}
                                                        fill={chart.series[8].color}
                                                    />
                                                ) : null}
                                                {chart.series[9] ? (
                                                    <Path
                                                        d={chart.series[9].markersPath}
                                                        fill={chart.series[9].color}
                                                    />
                                                ) : null}
                                                {selectedPoint ? (
                                                    <Circle
                                                        cx={selectedPoint.x}
                                                        cy={selectedPoint.y}
                                                        r={5}
                                                        fill={selectedPoint.color}
                                                        stroke={colors.background}
                                                        strokeWidth={2}
                                                        onPress={onPlotPress}
                                                    />
                                                ) : null}
                                            </Svg>
                                            {selectedPoint ? (
                                                <View
                                                    pointerEvents="none"
                                                    style={[styles.graphTooltip, tooltipPosition]}
                                                >
                                                    <Typography
                                                        text={selectedPoint.year}
                                                        variant="subtitle_10_400"
                                                        style={styles.graphTooltipYear}
                                                    />
                                                    <Typography
                                                        text={selectedPoint.valueText}
                                                        variant="subtitle_12_500"
                                                        style={styles.graphTooltipValue}
                                                    />
                                                </View>
                                            ) : null}
                                        </Animated.View>
                                    </GestureDetector>
                                )}
                            </View>
                            <View style={[isSummary ? styles.graphXAxis : styles.metricXAxis, { width: plotWidth }]}>
                                {chart.xAxisLabels.map(renderXAxisLabel)}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            {isSummary ? (
                <View style={styles.audienceSection}>
                    {chart.audienceControls?.[0] ? (
                        <TouchableOpacity onPress={chart.audienceControls[0].onPress} style={styles.audienceHeader}>
                            <Typography
                                text={chart.audienceControls[0].title}
                                variant="subtitle_12_500"
                                style={styles.audienceTitle}
                            />
                            <View
                                style={[
                                    styles.toggle,
                                    chart.audienceControls[0].isActive ? undefined : styles.toggleInactive,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.toggleThumb,
                                        chart.audienceControls[0].isActive ? undefined : styles.toggleThumbInactive,
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    <View style={styles.chips}>
                        <View style={[styles.chip, styles.redChip]}>
                            <View style={[styles.chipDot, styles.redChipDot]} />
                            <Typography text="18-25" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.greenChip]}>
                            <View style={[styles.chipDot, styles.greenChipDot]} />
                            <Typography text="26-35" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.blueChip]}>
                            <View style={[styles.chipDot, styles.blueChipDot]} />
                            <Typography text="36-45" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.yellowChip]}>
                            <View style={[styles.chipDot, styles.yellowChipDot]} />
                            <Typography text="46-60" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.purpleChip]}>
                            <View style={[styles.chipDot, styles.purpleChipDot]} />
                            <Typography text="60+" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                    </View>
                    {chart.audienceControls?.[1] ? (
                        <TouchableOpacity onPress={chart.audienceControls[1].onPress} style={styles.audienceHeader}>
                            <Typography
                                text={chart.audienceControls[1].title}
                                variant="subtitle_12_500"
                                style={styles.audienceTitle}
                            />
                            <View
                                style={[
                                    styles.toggle,
                                    chart.audienceControls[1].isActive ? undefined : styles.toggleInactive,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.toggleThumb,
                                        chart.audienceControls[1].isActive ? undefined : styles.toggleThumbInactive,
                                    ]}
                                />
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    <View style={styles.chips}>
                        <View style={[styles.chip, styles.redChip]}>
                            <View style={[styles.chipDot, styles.redChipDot]} />
                            <Typography text="18-25" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.greenChip]}>
                            <View style={[styles.chipDot, styles.greenChipDot]} />
                            <Typography text="26-35" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.blueChip]}>
                            <View style={[styles.chipDot, styles.blueChipDot]} />
                            <Typography text="36-45" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.yellowChip]}>
                            <View style={[styles.chipDot, styles.yellowChipDot]} />
                            <Typography text="46-60" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                        <View style={[styles.chip, styles.purpleChip]}>
                            <View style={[styles.chipDot, styles.purpleChipDot]} />
                            <Typography text="60+" variant="subtitle_10_400" style={styles.chipText} />
                        </View>
                    </View>
                </View>
            ) : null}
        </View>
    );
};
