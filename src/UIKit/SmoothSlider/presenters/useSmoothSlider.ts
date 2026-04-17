import { useCallback, useMemo, useRef } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { useSliderGesture, UseSliderGestureReturn } from './useSliderGesture.tsx';
import { getStyles } from '../styles.ts';
import {
    UseSmoothSliderProps,
    NormalizedLabel,
    DecoratorItem,
} from '../types.ts';

interface UseSmoothSliderReturn extends UseSliderGestureReturn {
    styles: ReturnType<typeof getStyles>;
    actualMax: number;
    normalizedLabels: NormalizedLabel[] | undefined;
    hasLabels: boolean;
    decoratorItems: DecoratorItem[];
    trackContainerRef: React.RefObject<View | null>;
    onTrackLayout: (event: LayoutChangeEvent) => void;
    onTrackPress: (event: GestureResponderEvent) => void;
    handleLabelClick: (targetIndex: number) => void;
}

export const useSmoothSlider = ({
    min = 0,
    max,
    values,
    onValuesChange,
    step = 1,
    snapped = true,
    sliderLength,
    data,
    labels: labelsProp,
    onLabelPress,
    value,
    onChange,
    initialValue,
    decorator,
    edgeAlignedLabels = false,
}: UseSmoothSliderProps): UseSmoothSliderReturn => {
    const { colors } = useUiContext();
    const trackContainerRef = useRef<View | null>(null);
    const trackPageXRef = useRef(0);

    const actualMax = max ?? (data ? data.length - 1 : 100);
    const actualValue = value ?? values?.[0] ?? initialValue ?? min;

    const handleValueChange = (newValue: number) => {
        onChange?.(newValue);
        onValuesChange?.([newValue]);
    };

    const {
        panGesture,
        thumbStyle,
        activeTrackStyle,
        handleLabelPress: handleLabelPressInternal,
        handleLayout,
        handleTrackPress,
    } = useSliderGesture({
        min,
        max: actualMax,
        initialValue: actualValue,
        onChange: handleValueChange,
        step,
        snapped,
    });

    const handleLabelClick = (targetIndex: number) => {
        handleLabelPressInternal(targetIndex);
        onLabelPress?.(targetIndex);
    };

    const onTrackLayout = useCallback((event: LayoutChangeEvent) => {
        handleLayout(event.nativeEvent.layout.width);

        requestAnimationFrame(() => {
            trackContainerRef.current?.measureInWindow((x) => {
                trackPageXRef.current = x;
            });
        });
    }, [handleLayout]);

    const onTrackPress = useCallback((event: GestureResponderEvent) => {
        const pageX = event.nativeEvent.pageX;
        const locationX = pageX - trackPageXRef.current;
        handleTrackPress(locationX);
    }, [handleTrackPress]);

    const normalizedLabels = useMemo(() => {
        if (labelsProp && labelsProp.length > 0) {
            return labelsProp.map((labelItem, defaultIndex) => {
                if (typeof labelItem === 'string') {
                    return {
                        label: labelItem,
                        index: defaultIndex,
                    };
                }

                return {
                    label: labelItem.label,
                    index: labelItem.index ?? defaultIndex,
                };
            });
        }

        if (data && data.length > 0) {
            return data.map((dataPoint, defaultIndex) => ({
                label: dataPoint.title,
                index: defaultIndex,
            }));
        }

        return undefined;
    }, [labelsProp, data]);

    const hasLabels = Boolean(normalizedLabels && normalizedLabels.length > 0);
    const shouldStretch = !snapped && !hasLabels && !sliderLength;

    const styles = useMemo(
        () => getStyles(colors, sliderLength, shouldStretch, edgeAlignedLabels),
        [colors, sliderLength, shouldStretch, edgeAlignedLabels],
    );

    const decoratorItems = useMemo(() => {
        if (!decorator || decorator.count <= 0) return [];

        return Array.from({ length: decorator.count }).map((_, index) => {
            const position = ((index + 1) / (decorator.count + 1)) * 100;
            return {
                key: index,
                leftPercent: position,
                item: decorator.item,
            };
        });
    }, [decorator]);

    return {
        panGesture,
        thumbStyle,
        activeTrackStyle,
        handleLabelPress: handleLabelPressInternal,
        handleLayout,
        handleTrackPress,
        styles,
        actualMax,
        normalizedLabels,
        hasLabels,
        decoratorItems,
        trackContainerRef,
        onTrackLayout,
        onTrackPress,
        handleLabelClick,
    };
};
