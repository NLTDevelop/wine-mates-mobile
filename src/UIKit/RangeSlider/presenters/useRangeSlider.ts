/* eslint-disable react-hooks/immutability */
import { useCallback, useLayoutEffect, useRef } from 'react';
import { LayoutChangeEvent, GestureResponderEvent, View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface IProps {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: (minValue: number, maxValue: number) => void;
    step: number;
    allowedMin?: number;
    allowedMax?: number;
    thumbOffset: number;
    initialSliderWidth: number;
    onValuesLive?: (minValue: number, maxValue: number) => void;
}

interface IRangePosition {
    min: number;
    max: number;
}

export const useRangeSlider = ({
    min,
    max,
    minValue,
    maxValue,
    onChange,
    step,
    allowedMin,
    allowedMax,
    thumbOffset,
    initialSliderWidth,
    onValuesLive,
}: IProps) => {
    const LOW_THUMB_Z_INDEX = 3;
    const HIGH_THUMB_Z_INDEX = 4;
    const normalizedStep = step > 0 ? step : 1;
    const lowerLimit = Math.max(min, Math.min(max, allowedMin ?? min));
    const upperLimit = Math.max(lowerLimit, Math.min(max, allowedMax ?? max));
    const minGap = Math.min(Math.max(1, normalizedStep), Math.max(0, upperLimit - lowerLimit));
    const rangePosition = useSharedValue<IRangePosition>({
        min: minValue,
        max: maxValue,
    });
    const minStartPosition = useSharedValue(minValue);
    const maxStartPosition = useSharedValue(maxValue);
    const sliderWidth = useSharedValue(initialSliderWidth);
    const isMinThumbOnTop = useSharedValue(false);
    const trackRef = useRef<View | null>(null);
    const trackPageX = useRef(0);

    const clampAndSnap = useCallback((value: number) => {
        'worklet';
        const clamped = Math.max(lowerLimit, Math.min(upperLimit, value));
        const snapped = Math.round((clamped - min) / normalizedStep) * normalizedStep + min;
        return Math.max(lowerLimit, Math.min(upperLimit, snapped));
    }, [lowerLimit, min, normalizedStep, upperLimit]);

    useLayoutEffect(() => {
        sliderWidth.value = initialSliderWidth;

        let nextMin = clampAndSnap(minValue);
        let nextMax = clampAndSnap(maxValue);

        if (nextMax - nextMin < minGap) {
            if (nextMin + minGap <= upperLimit) {
                nextMax = nextMin + minGap;
            } else if (nextMax - minGap >= lowerLimit) {
                nextMin = nextMax - minGap;
            }
        }

        rangePosition.value = {
            min: nextMin,
            max: nextMax,
        };
    }, [
        clampAndSnap,
        initialSliderWidth,
        lowerLimit,
        maxValue,
        minGap,
        minValue,
        rangePosition,
        sliderWidth,
        upperLimit,
    ]);

    const minPanGesture = Gesture.Pan()
        .onStart(() => {
            isMinThumbOnTop.value = true;
            minStartPosition.value = rangePosition.value.min;
        })
        .onUpdate((event) => {
            const range = max - min;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const updatedPosition = minStartPosition.value + delta;
            const currentMax = rangePosition.value.max;
            const clampedPosition = Math.max(lowerLimit, Math.min(currentMax - minGap, updatedPosition));
            rangePosition.value = {
                min: clampedPosition,
                max: currentMax,
            };
            if (onValuesLive) {
                scheduleOnRN(onValuesLive, clampAndSnap(clampedPosition), clampAndSnap(currentMax));
            }
        })
        .onEnd(() => {
            const currentPosition = rangePosition.value;
            const snapped = clampAndSnap(currentPosition.min);
            const constrained = Math.min(snapped, currentPosition.max - minGap);
            rangePosition.value = withSpring({ min: constrained, max: currentPosition.max }, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onChange) {
                scheduleOnRN(onChange, clampAndSnap(constrained), clampAndSnap(currentPosition.max));
            }
        });

    const maxPanGesture = Gesture.Pan()
        .onStart(() => {
            isMinThumbOnTop.value = false;
            maxStartPosition.value = rangePosition.value.max;
        })
        .onUpdate((event) => {
            const range = max - min;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const updatedPosition = maxStartPosition.value + delta;
            const currentMin = rangePosition.value.min;
            const clampedPosition = Math.min(upperLimit, Math.max(currentMin + minGap, updatedPosition));
            rangePosition.value = {
                min: currentMin,
                max: clampedPosition,
            };
            if (onValuesLive) {
                scheduleOnRN(onValuesLive, clampAndSnap(currentMin), clampAndSnap(clampedPosition));
            }
        })
        .onEnd(() => {
            const currentPosition = rangePosition.value;
            const snapped = clampAndSnap(currentPosition.max);
            const constrained = Math.max(snapped, currentPosition.min + minGap);
            rangePosition.value = withSpring({ min: currentPosition.min, max: constrained }, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onChange) {
                scheduleOnRN(onChange, clampAndSnap(currentPosition.min), clampAndSnap(constrained));
            }
        });

    const minThumbStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const left = (rangePosition.value.min - min) * stepSize - thumbOffset;
        return {
            left,
            zIndex: isMinThumbOnTop.value ? HIGH_THUMB_Z_INDEX : LOW_THUMB_Z_INDEX,
        };
    });

    const maxThumbStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const left = (rangePosition.value.max - min) * stepSize - thumbOffset;
        return {
            left,
            zIndex: isMinThumbOnTop.value ? LOW_THUMB_Z_INDEX : HIGH_THUMB_Z_INDEX,
        };
    });

    const activeTrackStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const currentPosition = rangePosition.value;
        const left = (currentPosition.min - min) * stepSize;
        const width = (currentPosition.max - currentPosition.min) * stepSize;
        return {
            left,
            width,
        };
    });

    const onTrackLayout = (event: LayoutChangeEvent) => {
        sliderWidth.value = event.nativeEvent.layout.width;
        trackRef.current?.measureInWindow((x) => {
            trackPageX.current = x;
        });
    };

    const onTrackPress = (event: GestureResponderEvent) => {
        if (sliderWidth.value <= 0) {
            return;
        }

        const localPositionByPageX = event.nativeEvent.pageX - trackPageX.current;
        const localPosition = Number.isFinite(localPositionByPageX)
            ? localPositionByPageX
            : event.nativeEvent.locationX;
        const pressedPosition = Math.max(0, Math.min(sliderWidth.value, localPosition));
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const pressedValue = min + pressedPosition / stepSize;
        const snappedPressedValue = clampAndSnap(pressedValue);
        const currentPosition = rangePosition.value;
        const currentMin = clampAndSnap(currentPosition.min);
        const currentMax = clampAndSnap(currentPosition.max);

        const minDistance = Math.abs(snappedPressedValue - currentMin);
        const maxDistance = Math.abs(snappedPressedValue - currentMax);

        if (minDistance <= maxDistance) {
            isMinThumbOnTop.value = true;
            const nextMin = Math.max(lowerLimit, Math.min(snappedPressedValue, currentMax - minGap));
            rangePosition.value = withSpring({ min: nextMin, max: currentMax }, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onValuesLive) {
                onValuesLive(clampAndSnap(nextMin), currentMax);
            }
            onChange(clampAndSnap(nextMin), currentMax);
            return;
        }

        isMinThumbOnTop.value = false;
        const nextMax = Math.min(upperLimit, Math.max(snappedPressedValue, currentMin + minGap));
        rangePosition.value = withSpring({ min: currentMin, max: nextMax }, {
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        });
        if (onValuesLive) {
            onValuesLive(currentMin, clampAndSnap(nextMax));
        }
        onChange(currentMin, clampAndSnap(nextMax));
    };

    return {
        minPanGesture,
        maxPanGesture,
        minThumbStyle,
        maxThumbStyle,
        activeTrackStyle,
        trackRef,
        onTrackLayout,
        onTrackPress,
    };
};
