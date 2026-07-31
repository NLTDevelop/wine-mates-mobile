import { useMemo } from 'react';
import { View } from 'react-native';
import { Circle, Line, Polyline, Svg } from 'react-native-svg';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionChart } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from '../WineEvolutionTab/styles';

interface IProps {
    chart: IWineEvolutionChart;
    isSummary?: boolean;
}

export const EvolutionLineChartCard = ({ chart, isSummary = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={isSummary ? styles.summaryCard : styles.metricCard}>
            <Typography
                text={chart.title}
                variant={isSummary ? 'body_500' : 'h5'}
                style={isSummary ? styles.summaryTitle : styles.metricTitle}
            />
            <View style={isSummary ? styles.graphPlotRow : styles.metricPlotRow}>
                <View style={isSummary ? styles.graphYLabels : styles.metricYLabels}>
                    <Typography text={chart.yAxisLabels[0]} variant="subtitle_12_400" style={styles.graphYAxis} />
                    <Typography text={chart.yAxisLabels[1]} variant="subtitle_12_400" style={styles.graphYAxis} />
                    <Typography text={chart.yAxisLabels[2]} variant="subtitle_12_400" style={styles.graphYAxis} />
                    {isSummary ? (
                        <>
                            <Typography
                                text={chart.yAxisLabels[3]}
                                variant="subtitle_12_400"
                                style={styles.graphYAxis}
                            />
                            <Typography
                                text={chart.yAxisLabels[4]}
                                variant="subtitle_12_400"
                                style={styles.graphYAxis}
                            />
                            <Typography
                                text={chart.yAxisLabels[5]}
                                variant="subtitle_12_400"
                                style={styles.graphYAxis}
                            />
                        </>
                    ) : null}
                </View>
                <View
                    style={[
                        isSummary ? styles.graphPlot : styles.metricGraphPlot,
                        chart.series.length === 0
                            ? isSummary
                                ? styles.graphPlotNoData
                                : styles.metricGraphPlotNoData
                            : undefined,
                    ]}
                >
                    {chart.series.length === 0 ? (
                        <Typography text="-" variant="h5" style={styles.graphNoDataText} />
                    ) : (
                        <Svg width="100%" height="100%" viewBox={`0 0 ${chart.plotWidth} ${chart.plotHeight}`}>
                            <Line
                                x1="0"
                                y1={chart.gridY[0]}
                                x2={chart.plotWidth}
                                y2={chart.gridY[0]}
                                stroke={colors.border_light}
                                strokeWidth={chart.strokeWidth}
                                strokeDasharray="1 4"
                            />
                            <Line
                                x1="0"
                                y1={chart.gridY[1]}
                                x2={chart.plotWidth}
                                y2={chart.gridY[1]}
                                stroke={colors.border_light}
                                strokeWidth={chart.strokeWidth}
                                strokeDasharray="1 4"
                            />
                            <Line
                                x1="0"
                                y1={chart.gridY[2]}
                                x2={chart.plotWidth}
                                y2={chart.gridY[2]}
                                stroke={colors.border_light}
                                strokeWidth={chart.strokeWidth}
                                strokeDasharray="1 4"
                            />
                            {isSummary ? (
                                <>
                                    <Line
                                        x1="0"
                                        y1={chart.gridY[3]}
                                        x2={chart.plotWidth}
                                        y2={chart.gridY[3]}
                                        stroke={colors.border_light}
                                        strokeWidth={chart.strokeWidth}
                                        strokeDasharray="1 4"
                                    />
                                    <Line
                                        x1="0"
                                        y1={chart.gridY[4]}
                                        x2={chart.plotWidth}
                                        y2={chart.gridY[4]}
                                        stroke={colors.border_light}
                                        strokeWidth={chart.strokeWidth}
                                        strokeDasharray="1 4"
                                    />
                                    <Line
                                        x1="0"
                                        y1={chart.gridY[5]}
                                        x2={chart.plotWidth}
                                        y2={chart.gridY[5]}
                                        stroke={colors.border_light}
                                        strokeWidth={chart.strokeWidth}
                                        strokeDasharray="1 4"
                                    />
                                </>
                            ) : null}
                            {chart.series[0] ? (
                                <Polyline
                                    points={chart.series[0].points}
                                    fill="none"
                                    stroke={chart.series[0].color}
                                    strokeWidth={chart.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : null}
                            {chart.series[1] ? (
                                <Polyline
                                    points={chart.series[1].points}
                                    fill="none"
                                    stroke={chart.series[1].color}
                                    strokeWidth={chart.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : null}
                            {chart.series[2] ? (
                                <Polyline
                                    points={chart.series[2].points}
                                    fill="none"
                                    stroke={chart.series[2].color}
                                    strokeWidth={chart.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : null}
                            {chart.series[3] ? (
                                <Polyline
                                    points={chart.series[3].points}
                                    fill="none"
                                    stroke={chart.series[3].color}
                                    strokeWidth={chart.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : null}
                            {chart.series[4] ? (
                                <Polyline
                                    points={chart.series[4].points}
                                    fill="none"
                                    stroke={chart.series[4].color}
                                    strokeWidth={chart.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : null}
                            {chart.series[5] ? (
                                <Polyline
                                    points={chart.series[5].points}
                                    fill="none"
                                    stroke={chart.series[5].color}
                                    strokeWidth={chart.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ) : null}
                            {chart.series[0] ? (
                                <Circle
                                    cx={chart.series[0].lastPoint.x}
                                    cy={chart.series[0].lastPoint.y}
                                    r="2"
                                    fill={chart.series[0].color}
                                />
                            ) : null}
                            {chart.series[1] ? (
                                <Circle
                                    cx={chart.series[1].lastPoint.x}
                                    cy={chart.series[1].lastPoint.y}
                                    r="2"
                                    fill={chart.series[1].color}
                                />
                            ) : null}
                            {chart.series[2] ? (
                                <Circle
                                    cx={chart.series[2].lastPoint.x}
                                    cy={chart.series[2].lastPoint.y}
                                    r="2"
                                    fill={chart.series[2].color}
                                />
                            ) : null}
                            {chart.series[3] ? (
                                <Circle
                                    cx={chart.series[3].lastPoint.x}
                                    cy={chart.series[3].lastPoint.y}
                                    r="2"
                                    fill={chart.series[3].color}
                                />
                            ) : null}
                            {chart.series[4] ? (
                                <Circle
                                    cx={chart.series[4].lastPoint.x}
                                    cy={chart.series[4].lastPoint.y}
                                    r="2"
                                    fill={chart.series[4].color}
                                />
                            ) : null}
                            {chart.series[5] ? (
                                <Circle
                                    cx={chart.series[5].lastPoint.x}
                                    cy={chart.series[5].lastPoint.y}
                                    r="2"
                                    fill={chart.series[5].color}
                                />
                            ) : null}
                        </Svg>
                    )}
                </View>
            </View>
            <View style={isSummary ? styles.graphXAxis : styles.metricXAxis}>
                <Typography
                    text={chart.xAxisLabels[0] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                />
                <Typography
                    text={chart.xAxisLabels[1] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                />
                <Typography
                    text={chart.xAxisLabels[2] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                />
                <Typography
                    text={chart.xAxisLabels[3] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                />
                <Typography
                    text={chart.xAxisLabels[4] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                />
                <Typography
                    text={chart.xAxisLabels[5] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                />
                {chart.xAxisLabels[6] ? (
                    <Typography text={chart.xAxisLabels[6]} variant="subtitle_12_400" style={styles.graphXAxisLabel} />
                ) : null}
            </View>
            {isSummary ? (
                <View style={styles.audienceSection}>
                    <View style={styles.audienceHeader}>
                        <Typography text="Men" variant="subtitle_12_500" style={styles.audienceTitle} />
                        <View style={styles.toggle}>
                            <View style={styles.toggleThumb} />
                        </View>
                    </View>
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
                    <View style={styles.audienceHeader}>
                        <Typography text="Women" variant="subtitle_12_500" style={styles.audienceTitle} />
                        <View style={styles.toggle}>
                            <View style={styles.toggleThumb} />
                        </View>
                    </View>
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
