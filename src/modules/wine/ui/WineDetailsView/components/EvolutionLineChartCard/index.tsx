import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Circle, Line, Path, Svg } from 'react-native-svg';
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
            <Typography text={chart.title} variant="h5" style={isSummary ? styles.summaryTitle : styles.metricTitle} />
            <View style={isSummary ? styles.graphPlotRow : styles.metricPlotRow}>
                <View style={isSummary ? styles.graphYLabels : styles.metricYLabels}>
                    {chart.series.length ? (
                        <>
                            <Typography
                                text={chart.yAxisLabels[0] ?? '-'}
                                variant="subtitle_12_400"
                                style={styles.graphYAxis}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.65}
                            />
                            <Typography
                                text={chart.yAxisLabels[1] ?? '-'}
                                variant="subtitle_12_400"
                                style={styles.graphYAxis}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.65}
                            />
                            <Typography
                                text={chart.yAxisLabels[2] ?? '-'}
                                variant="subtitle_12_400"
                                style={styles.graphYAxis}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.65}
                            />
                            {chart.yAxisLabels[3] ? (
                                <Typography
                                    text={chart.yAxisLabels[3]}
                                    variant="subtitle_12_400"
                                    style={styles.graphYAxis}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.65}
                                />
                            ) : null}
                            {chart.yAxisLabels[4] ? (
                                <Typography
                                    text={chart.yAxisLabels[4]}
                                    variant="subtitle_12_400"
                                    style={styles.graphYAxis}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.65}
                                />
                            ) : null}
                            {chart.yAxisLabels[5] ? (
                                <Typography
                                    text={chart.yAxisLabels[5]}
                                    variant="subtitle_12_400"
                                    style={styles.graphYAxis}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.65}
                                />
                            ) : null}
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
                            {chart.gridY[3] !== undefined ? (
                                <Line
                                    x1="0"
                                    y1={chart.gridY[3]}
                                    x2={chart.plotWidth}
                                    y2={chart.gridY[3]}
                                    stroke={colors.border_light}
                                    strokeWidth={chart.strokeWidth}
                                    strokeDasharray="1 4"
                                />
                            ) : null}
                            {chart.gridY[4] !== undefined ? (
                                <Line
                                    x1="0"
                                    y1={chart.gridY[4]}
                                    x2={chart.plotWidth}
                                    y2={chart.gridY[4]}
                                    stroke={colors.border_light}
                                    strokeWidth={chart.strokeWidth}
                                    strokeDasharray="1 4"
                                />
                            ) : null}
                            {chart.gridY[5] !== undefined ? (
                                <Line
                                    x1="0"
                                    y1={chart.gridY[5]}
                                    x2={chart.plotWidth}
                                    y2={chart.gridY[5]}
                                    stroke={colors.border_light}
                                    strokeWidth={chart.strokeWidth}
                                    strokeDasharray="1 4"
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
                            {chart.series[6] ? (
                                <Circle
                                    cx={chart.series[6].lastPoint.x}
                                    cy={chart.series[6].lastPoint.y}
                                    r="2"
                                    fill={chart.series[6].color}
                                />
                            ) : null}
                            {chart.series[7] ? (
                                <Circle
                                    cx={chart.series[7].lastPoint.x}
                                    cy={chart.series[7].lastPoint.y}
                                    r="2"
                                    fill={chart.series[7].color}
                                />
                            ) : null}
                            {chart.series[8] ? (
                                <Circle
                                    cx={chart.series[8].lastPoint.x}
                                    cy={chart.series[8].lastPoint.y}
                                    r="2"
                                    fill={chart.series[8].color}
                                />
                            ) : null}
                            {chart.series[9] ? (
                                <Circle
                                    cx={chart.series[9].lastPoint.x}
                                    cy={chart.series[9].lastPoint.y}
                                    r="2"
                                    fill={chart.series[9].color}
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
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                />
                <Typography
                    text={chart.xAxisLabels[1] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                />
                <Typography
                    text={chart.xAxisLabels[2] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                />
                <Typography
                    text={chart.xAxisLabels[3] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                />
                <Typography
                    text={chart.xAxisLabels[4] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                />
                <Typography
                    text={chart.xAxisLabels[5] ?? '-'}
                    variant="subtitle_12_400"
                    style={styles.graphXAxisLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                />
                {chart.xAxisLabels[6] ? (
                    <Typography
                        text={chart.xAxisLabels[6]}
                        variant="subtitle_12_400"
                        style={styles.graphXAxisLabel}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                    />
                ) : null}
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
