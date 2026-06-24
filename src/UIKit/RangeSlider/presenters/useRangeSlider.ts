import { useCallback, useEffect, useRef } from 'react';
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
    onValuesLive?: (minValue: number, maxValue: number) => void;
}

export const useRangeSlider = ({
    min,
    max,
    minValue,
    maxValue,
    onChange,
    step,
    onValuesLive,
}: IProps) => {
    const LOW_THUMB_Z_INDEX = 3;
    const HIGH_THUMB_Z_INDEX = 4;
    const normalizedStep = step > 0 ? step : 1;
    const rangeSize = max - min;
    const minGap = Math.min(Math.max(1, normalizedStep), Math.max(0, rangeSize));
    const minPosition = useSharedValue(minValue);
    const maxPosition = useSharedValue(maxValue);
    const minStartPosition = useSharedValue(minValue);
    const maxStartPosition = useSharedValue(maxValue);
    const sliderWidth = useSharedValue(0);
    const isMinThumbOnTop = useSharedValue(false);
    const trackRef = useRef<View | null>(null);
    const trackPageX = useRef(0);

    const clampAndSnap = useCallback((value: number) => {
        'worklet';
        const clamped = Math.max(min, Math.min(max, value));
        const snapped = Math.round((clamped - min) / normalizedStep) * normalizedStep + min;
        return Math.max(min, Math.min(max, snapped));
    }, [max, min, normalizedStep]);

    useEffect(() => {
        let nextMin = clampAndSnap(minValue);
        let nextMax = clampAndSnap(maxValue);

        if (nextMax - nextMin < minGap) {
            if (nextMin + minGap <= max) {
                nextMax = nextMin + minGap;
            } else if (nextMax - minGap >= min) {
                nextMin = nextMax - minGap;
            }
        }

        minPosition.value = nextMin;
        maxPosition.value = nextMax;
    }, [clampAndSnap, max, maxValue, maxPosition, min, minGap, minPosition, minValue]);

    const minPanGesture = Gesture.Pan()
        .onStart(() => {
            isMinThumbOnTop.value = true;
            minStartPosition.value = minPosition.value;
        })
        .onUpdate((event) => {
            const range = max - min;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const updatedPosition = minStartPosition.value + delta;
            const clampedPosition = Math.max(min, Math.min(maxPosition.value - minGap, updatedPosition));
            minPosition.value = clampedPosition;
            if (onValuesLive) {
                scheduleOnRN(onValuesLive, clampAndSnap(clampedPosition), clampAndSnap(maxPosition.value));
            }
        })
        .onEnd(() => {
            const snapped = clampAndSnap(minPosition.value);
            const constrained = Math.min(snapped, maxPosition.value - minGap);
            minPosition.value = withSpring(constrained, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onChange) {
                scheduleOnRN(onChange, clampAndSnap(constrained), clampAndSnap(maxPosition.value));
            }
        });

    const maxPanGesture = Gesture.Pan()
        .onStart(() => {
            isMinThumbOnTop.value = false;
            maxStartPosition.value = maxPosition.value;
        })
        .onUpdate((event) => {
            const range = max - min;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const updatedPosition = maxStartPosition.value + delta;
            const clampedPosition = Math.min(max, Math.max(minPosition.value + minGap, updatedPosition));
            maxPosition.value = clampedPosition;
            if (onValuesLive) {
                scheduleOnRN(onValuesLive, clampAndSnap(minPosition.value), clampAndSnap(clampedPosition));
            }
        })
        .onEnd(() => {
            const snapped = clampAndSnap(maxPosition.value);
            const constrained = Math.max(snapped, minPosition.value + minGap);
            maxPosition.value = withSpring(constrained, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onChange) {
                scheduleOnRN(onChange, clampAndSnap(minPosition.value), clampAndSnap(constrained));
            }
        });

    const minThumbStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const translateX = (minPosition.value - min) * stepSize;
        return {
            zIndex: isMinThumbOnTop.value ? HIGH_THUMB_Z_INDEX : LOW_THUMB_Z_INDEX,
            transform: [{ translateX }],
        };
    });

    const maxThumbStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const translateX = (maxPosition.value - min) * stepSize;
        return {
            zIndex: isMinThumbOnTop.value ? LOW_THUMB_Z_INDEX : HIGH_THUMB_Z_INDEX,
            transform: [{ translateX }],
        };
    });

    const activeTrackStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const left = (minPosition.value - min) * stepSize;
        const width = (maxPosition.value - minPosition.value) * stepSize;
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
        const currentMin = clampAndSnap(minPosition.value);
        const currentMax = clampAndSnap(maxPosition.value);

        const minDistance = Math.abs(snappedPressedValue - currentMin);
        const maxDistance = Math.abs(snappedPressedValue - currentMax);

        if (minDistance <= maxDistance) {
            isMinThumbOnTop.value = true;
            const nextMin = Math.max(min, Math.min(snappedPressedValue, currentMax - minGap));
            minPosition.value = withSpring(nextMin, {
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
        const nextMax = Math.min(max, Math.max(snappedPressedValue, currentMin + minGap));
        maxPosition.value = withSpring(nextMax, {
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
