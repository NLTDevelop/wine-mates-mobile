import { useSharedValue, useAnimatedStyle, withSpring, useAnimatedReaction } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

interface UseSmoothSliderProps {
    min: number;
    max: number;
    initialValue?: number;
    onChange?: (value: number) => void;
    step?: number;
    snapped?: boolean;
}

type AnimatedStyleReturn = ReturnType<typeof useAnimatedStyle>;
type PanGestureType = ReturnType<typeof Gesture.Pan>;

export interface UseSmoothSliderReturn {
    panGesture: PanGestureType;
    thumbStyle: AnimatedStyleReturn;
    activeTrackStyle: AnimatedStyleReturn;
    handleLabelPress: (index: number) => void;
    handleLayout: (width: number) => void;
}

export const useSmoothSlider = ({
    min,
    max,
    initialValue = 0,
    onChange,
    step = 1,
    snapped = true,
}: UseSmoothSliderProps): UseSmoothSliderReturn => {
    const minValue = min;
    const maxValue = max;
    const initialIndex = Math.max(minValue, Math.min(initialValue, maxValue));

    const position = useSharedValue(initialIndex);
    const startPosition = useSharedValue(0);
    const sliderWidth = useSharedValue(0);

    useAnimatedReaction(
        () => Math.round(position.value),
        (currentValue, previousValue) => {
            if (currentValue !== previousValue && onChange) {
                scheduleOnRN(onChange, currentValue);
            }
        }
    );

    const snapToNearest = (value: number) => {
        'worklet';
        let targetValue = Math.max(minValue, Math.min(maxValue, value));

        if (snapped && step) {
            const steppedValue = Math.round((targetValue - minValue) / step) * step + minValue;
            targetValue = Math.max(minValue, Math.min(maxValue, steppedValue));
        }

        position.value = withSpring(targetValue, {
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        }, (finished) => {
            'worklet';
            if (finished && onChange) {
                scheduleOnRN(onChange, Math.round(targetValue));
            }
        });
    };

    const handleLabelPress = (index: number) => {
        position.value = withSpring(index, {
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        }, (finished) => {
            'worklet';
            if (finished && onChange) {
                scheduleOnRN(onChange, Math.round(index));
            }
        });
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startPosition.value = position.value;
        })
        .onUpdate((event) => {
            const range = maxValue - minValue;
            const stepSize = range > 0 ? sliderWidth.value / range : 1;
            const delta = event.translationX / stepSize;
            const newPosition = startPosition.value + delta;
            position.value = Math.max(minValue, Math.min(maxValue, newPosition));
        })
        .onEnd((event) => {
            snapToNearest(position.value);
        });

    const thumbStyle = useAnimatedStyle(() => {
        const range = maxValue - minValue;
        const stepSize = range > 0 ? sliderWidth.value / range : 0;
        const translateX = (position.value - minValue) * stepSize;
        return {
            transform: [{ translateX }],
        };
    });

    const activeTrackStyle = useAnimatedStyle(() => {
        const range = maxValue - minValue;
        const stepSize = range > 0 ? sliderWidth.value / range : 0;
        const width = (position.value - minValue) * stepSize;
        return { width };
    });

    const handleLayout = (width: number) => {
        sliderWidth.value = width;
    };

    return {
        panGesture,
        thumbStyle,
        activeTrackStyle,
        handleLabelPress,
        handleLayout,
    };
};
