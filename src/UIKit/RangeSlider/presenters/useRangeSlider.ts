import { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, GestureResponderEvent } from 'react-native';
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
    const minPosition = useSharedValue(minValue);
    const maxPosition = useSharedValue(maxValue);
    const minStartPosition = useSharedValue(minValue);
    const maxStartPosition = useSharedValue(maxValue);
    const sliderWidth = useSharedValue(0);

    const clampAndSnap = useCallback((value: number) => {
        'worklet';
        const clamped = Math.max(min, Math.min(max, value));
        const snapped = Math.round((clamped - min) / step) * step + min;
        return Math.max(min, Math.min(max, snapped));
    }, [max, min, step]);

    useEffect(() => {
        minPosition.value = clampAndSnap(minValue);
        maxPosition.value = clampAndSnap(maxValue);
    }, [clampAndSnap, maxValue, maxPosition, minPosition, minValue]);

    const minPanGesture = Gesture.Pan()
        .onStart(() => {
            minStartPosition.value = minPosition.value;
        })
        .onUpdate((event) => {
            const range = max - min;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const updatedPosition = minStartPosition.value + delta;
            const clampedPosition = Math.max(min, Math.min(maxPosition.value, updatedPosition));
            minPosition.value = clampedPosition;
            if (onValuesLive) {
                scheduleOnRN(onValuesLive, Math.round(clampedPosition), Math.round(maxPosition.value));
            }
        })
        .onEnd(() => {
            const snapped = clampAndSnap(minPosition.value);
            const constrained = Math.min(snapped, maxPosition.value);
            minPosition.value = withSpring(constrained, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onChange) {
                scheduleOnRN(onChange, Math.round(constrained), Math.round(maxPosition.value));
            }
        });

    const maxPanGesture = Gesture.Pan()
        .onStart(() => {
            maxStartPosition.value = maxPosition.value;
        })
        .onUpdate((event) => {
            const range = max - min;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const updatedPosition = maxStartPosition.value + delta;
            const clampedPosition = Math.min(max, Math.max(minPosition.value, updatedPosition));
            maxPosition.value = clampedPosition;
            if (onValuesLive) {
                scheduleOnRN(onValuesLive, Math.round(minPosition.value), Math.round(clampedPosition));
            }
        })
        .onEnd(() => {
            const snapped = clampAndSnap(maxPosition.value);
            const constrained = Math.max(snapped, minPosition.value);
            maxPosition.value = withSpring(constrained, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onChange) {
                scheduleOnRN(onChange, Math.round(minPosition.value), Math.round(constrained));
            }
        });

    const minThumbStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const translateX = (minPosition.value - min) * stepSize;
        return {
            transform: [{ translateX }],
        };
    });

    const maxThumbStyle = useAnimatedStyle(() => {
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const translateX = (maxPosition.value - min) * stepSize;
        return {
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
    };

    const onTrackPress = (event: GestureResponderEvent) => {
        const pressedPosition = event.nativeEvent.locationX;
        const range = max - min;
        const stepSize = range > 0 ? sliderWidth.value / range : 1;
        const pressedValue = min + pressedPosition / stepSize;
        const snappedPressedValue = clampAndSnap(pressedValue);

        const minDistance = Math.abs(snappedPressedValue - minPosition.value);
        const maxDistance = Math.abs(snappedPressedValue - maxPosition.value);

        if (minDistance <= maxDistance) {
            const nextMin = Math.min(snappedPressedValue, maxPosition.value);
            minPosition.value = withSpring(nextMin, {
                damping: 10,
                stiffness: 100,
                mass: 0.5,
            });
            if (onValuesLive) {
                onValuesLive(Math.round(nextMin), Math.round(maxPosition.value));
            }
            onChange(Math.round(nextMin), Math.round(maxPosition.value));
            return;
        }

        const nextMax = Math.max(snappedPressedValue, minPosition.value);
        maxPosition.value = withSpring(nextMax, {
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        });
        if (onValuesLive) {
            onValuesLive(Math.round(minPosition.value), Math.round(nextMax));
        }
        onChange(Math.round(minPosition.value), Math.round(nextMax));
    };

    return {
        minPanGesture,
        maxPanGesture,
        minThumbStyle,
        maxThumbStyle,
        activeTrackStyle,
        onTrackLayout,
        onTrackPress,
    };
};
