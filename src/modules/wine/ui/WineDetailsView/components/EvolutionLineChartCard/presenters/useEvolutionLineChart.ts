/* eslint-disable react-hooks/immutability */
import { useCallback, useMemo, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { IWineEvolutionChart, IWineEvolutionChartPoint } from '@/modules/wine/types/IWineEvolution';
import { EVOLUTION_CHART_TOOLTIP_WIDTH } from '../constants';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const POINT_PRESS_RADIUS = scaleHorizontal(60);
const TOOLTIP_WIDTH = scaleHorizontal(EVOLUTION_CHART_TOOLTIP_WIDTH);
const TOOLTIP_OFFSET = scaleVertical(12);

interface IProps {
    chart: IWineEvolutionChart;
    isSummary: boolean;
}

interface ISelectedPoint extends IWineEvolutionChartPoint {
    color: string;
    seriesId: string;
    year: string;
    valueText: string;
}

interface ISelectedPointState {
    chartId: string;
    point: ISelectedPoint;
}

const clampZoom = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

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
                    year: chart.xAxisLabels[point.index] ?? '-',
                    valueText: point.valueText,
                };
            }
        });
    });

    return closestDistance <= POINT_PRESS_RADIUS ? closestPoint : null;
};

export const useEvolutionLineChart = ({ chart, isSummary }: IProps) => {
    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [selectedPointState, setSelectedPointState] = useState<ISelectedPointState | null>(null);
    const pinchScale = useSharedValue(1);

    const onZoomEnd = useCallback((nextZoom: number) => {
        setZoom(clampZoom(nextZoom));
    }, []);

    const pinchGesture = useMemo(
        () =>
            Gesture.Pinch()
                .onUpdate(event => {
                    pinchScale.value = Math.min(MAX_ZOOM / zoom, Math.max(MIN_ZOOM / zoom, event.scale));
                })
                .onEnd(event => {
                    const nextZoom = clampZoom(zoom * event.scale);

                    pinchScale.value = withSpring(1);
                    runOnJS(onZoomEnd)(nextZoom);
                }),
        [onZoomEnd, pinchScale, zoom],
    );

    const animatedChartStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pinchScale.value }],
    }));

    const onPlotPress = useCallback(
        (event: GestureResponderEvent) => {
            const { locationX, locationY } = event.nativeEvent;
            const point = getClosestPoint(chart, locationX / zoom, locationY);

            setSelectedPointState(point ? { chartId: chart.id, point } : null);
        },
        [chart, zoom],
    );

    const isSelectedSeriesVisible = chart.series.some(series => series.id === selectedPointState?.point.seriesId);
    const selectedPoint = selectedPointState?.chartId === chart.id && isSelectedSeriesVisible
        ? selectedPointState.point
        : null;
    const shouldRenderPlot = isSummary || chart.series.length > 0;

    const tooltipPosition = useMemo(() => {
        if (!selectedPoint) {
            return undefined;
        }

        const scaledX = selectedPoint.x * zoom;
        const left = Math.min(Math.max(0, scaledX - TOOLTIP_WIDTH / 2), chart.plotWidth * zoom - TOOLTIP_WIDTH);
        const top = Math.max(0, selectedPoint.y - scaleVertical(54) - TOOLTIP_OFFSET);

        return { left, top };
    }, [chart.plotWidth, selectedPoint, zoom]);

    return {
        animatedChartStyle,
        onPlotPress,
        pinchGesture,
        plotWidth: chart.plotWidth * zoom,
        selectedPoint,
        shouldRenderPlot,
        shouldShowYAxis: shouldRenderPlot,
        shouldUseNoDataStyle: !shouldRenderPlot,
        tooltipPosition,
    };
};
