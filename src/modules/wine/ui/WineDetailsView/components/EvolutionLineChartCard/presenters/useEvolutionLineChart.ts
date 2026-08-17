import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
    GestureResponderEvent,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
} from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';
import {
    IWineEvolutionChart,
    IWineEvolutionChartPoint,
    IWineEvolutionXAxisLabel,
} from '@/modules/wine/types/IWineEvolution';
import { EVOLUTION_CHART_TOOLTIP_MAX_WIDTH, EVOLUTION_CHART_VISIBLE_YEARS } from '../constants';

const POINT_PRESS_RADIUS = scaleHorizontal(60);
const TOOLTIP_MAX_WIDTH = scaleHorizontal(EVOLUTION_CHART_TOOLTIP_MAX_WIDTH);
const TOOLTIP_FALLBACK_HEIGHT = scaleVertical(32);
const TOOLTIP_OFFSET = scaleVertical(12);
const TOOLTIP_HORIZONTAL_GUTTER = scaleHorizontal(8);

interface IProps {
    chart: IWineEvolutionChart;
    isSummary: boolean;
}

interface ISelectedPoint extends IWineEvolutionChartPoint {
    color: string;
    seriesId: string;
    valueText: string;
}

interface ISelectedPointState {
    chartId: string;
    point: ISelectedPoint;
}

interface ITooltipSize {
    width: number;
    height: number;
}

const getClosestPoint = (chart: IWineEvolutionChart, locationX: number, locationY: number): ISelectedPoint | null => {
    let closestPoint: ISelectedPoint | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    chart.series.forEach(series => {
        series.points.forEach(point => {
            const distance = Math.hypot(point.x - locationX, point.y - locationY);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = {
                    ...point,
                    color: series.color,
                    seriesId: series.id,
                    valueText: point.valueText,
                };
            }
        });
    });

    return closestDistance <= POINT_PRESS_RADIUS ? closestPoint : null;
};

const getTooltipMeasurementKey = (chartId: string, point: ISelectedPoint) =>
    `${chartId}-${point.seriesId}-${point.index}-${point.valueText}`;

export const useEvolutionLineChart = ({ chart, isSummary }: IProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollOffsetRef = useRef(0);
    const autoScrollKeyRef = useRef<string | null>(null);
    const tooltipMeasurementKeyRef = useRef<string | null>(null);
    const [selectedPointState, setSelectedPointState] = useState<ISelectedPointState | null>(null);
    const [tooltipSize, setTooltipSize] = useState<ITooltipSize | null>(null);
    const [viewportWidth, setViewportWidth] = useState(0);

    const onPlotPress = useCallback(
        (event: GestureResponderEvent) => {
            const { locationX, locationY } = event.nativeEvent;
            const point = getClosestPoint(chart, locationX, locationY);
            const nextTooltipMeasurementKey = point ? getTooltipMeasurementKey(chart.id, point) : null;

            if (tooltipMeasurementKeyRef.current !== nextTooltipMeasurementKey) {
                tooltipMeasurementKeyRef.current = null;
                setTooltipSize(null);
            }

            setSelectedPointState(point ? { chartId: chart.id, point } : null);
        },
        [chart],
    );

    const isSelectedSeriesVisible = chart.series.some(series => series.id === selectedPointState?.point.seriesId);
    const selectedPoint = selectedPointState?.chartId === chart.id && isSelectedSeriesVisible
        ? selectedPointState.point
        : null;
    const tooltipMeasurementKey = selectedPoint ? getTooltipMeasurementKey(chart.id, selectedPoint) : null;
    const shouldRenderPlot = isSummary || chart.series.length > 0;
    const xAxisLabelItems = useMemo<IWineEvolutionXAxisLabel[]>(() => {
        const slotsCount = Math.max(chart.xAxisLabels.length, EVOLUTION_CHART_VISIBLE_YEARS);
        const slotWidth = chart.plotWidth / slotsCount;

        return chart.xAxisLabels.map((text, index) => ({
            id: `${text}-${index}`,
            text,
            style: {
                position: 'absolute',
                bottom: 0,
                left: slotWidth * index,
                width: slotWidth,
            },
        }));
    }, [chart.plotWidth, chart.xAxisLabels]);

    const onTooltipLayout = useCallback((event: LayoutChangeEvent) => {
        if (!tooltipMeasurementKey || tooltipMeasurementKeyRef.current === tooltipMeasurementKey) {
            return;
        }

        const { width, height } = event.nativeEvent.layout;

        if (width <= 0 || height <= 0) {
            return;
        }

        tooltipMeasurementKeyRef.current = tooltipMeasurementKey;
        setTooltipSize({ width, height });
    }, [tooltipMeasurementKey]);

    const onScrollViewportLayout = useCallback((event: LayoutChangeEvent) => {
        setViewportWidth(event.nativeEvent.layout.width);
    }, []);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
    }, []);

    useEffect(() => {
        if (viewportWidth <= 0) {
            return undefined;
        }

        const autoScrollKey = `${chart.id}-${chart.xAxisLabels.join(',')}-${chart.plotWidth}-${viewportWidth}`;
        if (autoScrollKeyRef.current === autoScrollKey) {
            return undefined;
        }

        autoScrollKeyRef.current = autoScrollKey;
        const maxOffset = Math.max(0, chart.plotWidth - viewportWidth);
        scrollOffsetRef.current = maxOffset;
        const frameId = requestAnimationFrame(() => {
            scrollViewRef.current?.scrollTo({ x: maxOffset, animated: false });
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [chart.id, chart.plotWidth, chart.xAxisLabels, viewportWidth]);

    const tooltipPosition = useMemo(() => {
        if (!selectedPoint) {
            return undefined;
        }

        const tooltipWidth = tooltipSize?.width ?? TOOLTIP_MAX_WIDTH;
        const tooltipHeight = tooltipSize?.height ?? TOOLTIP_FALLBACK_HEIGHT;
        const maxLeft = Math.max(0, chart.plotWidth - tooltipWidth);
        const left = Math.min(Math.max(0, selectedPoint.x - tooltipWidth / 2), maxLeft);
        const topAbovePoint = selectedPoint.y - tooltipHeight - TOOLTIP_OFFSET;
        const maxTop = Math.max(0, chart.plotHeight - tooltipHeight);
        const top = topAbovePoint >= 0
            ? topAbovePoint
            : Math.min(selectedPoint.y + TOOLTIP_OFFSET, maxTop);

        return { left, top };
    }, [chart.plotHeight, chart.plotWidth, selectedPoint, tooltipSize]);

    useEffect(() => {
        if (!selectedPoint || viewportWidth <= 0 || chart.plotWidth <= viewportWidth) {
            return;
        }

        const tooltipWidth = Math.min(TOOLTIP_MAX_WIDTH, chart.plotWidth);
        const maxTooltipLeft = Math.max(0, chart.plotWidth - tooltipWidth);
        const tooltipLeft = Math.min(Math.max(0, selectedPoint.x - tooltipWidth / 2), maxTooltipLeft);
        const tooltipRight = tooltipLeft + tooltipWidth;
        const visibleLeft = scrollOffsetRef.current + TOOLTIP_HORIZONTAL_GUTTER;
        const visibleRight = scrollOffsetRef.current + viewportWidth - TOOLTIP_HORIZONTAL_GUTTER;
        let nextOffset = scrollOffsetRef.current;

        if (tooltipLeft < visibleLeft) {
            nextOffset = tooltipLeft - TOOLTIP_HORIZONTAL_GUTTER;
        } else if (tooltipRight > visibleRight) {
            nextOffset = tooltipRight - viewportWidth + TOOLTIP_HORIZONTAL_GUTTER;
        }

        const maxOffset = Math.max(0, chart.plotWidth - viewportWidth);
        const normalizedOffset = Math.min(Math.max(0, nextOffset), maxOffset);

        if (normalizedOffset === scrollOffsetRef.current) {
            return;
        }

        scrollOffsetRef.current = normalizedOffset;
        scrollViewRef.current?.scrollTo({ x: normalizedOffset, animated: true });
    }, [chart.plotWidth, selectedPoint, viewportWidth]);

    return {
        onPlotPress,
        onScroll,
        onScrollViewportLayout,
        onTooltipLayout,
        plotWidth: chart.plotWidth,
        scrollViewRef,
        selectedPoint,
        shouldRenderPlot,
        shouldShowYAxis: shouldRenderPlot,
        shouldUseNoDataStyle: !shouldRenderPlot,
        tooltipPosition,
        xAxisLabelItems,
    };
};
