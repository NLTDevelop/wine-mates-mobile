/* eslint-disable react-hooks/immutability */
import { useEffect } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface IProps {
    rating: number;
    maxStars: number;
    step: number;
    onChange?: (rating: number) => void;
}

const clamp = (value: number, min: number, max: number) => {
    'worklet';

    return Math.min(max, Math.max(min, value));
};

export const usePreciseStarRating = ({ rating, maxStars, step, onChange }: IProps) => {
    const containerWidth = useSharedValue(0);
    const progress = useSharedValue(clamp(rating / maxStars, 0, 1));
    const completionScale = useSharedValue(1);

    useEffect(() => {
        progress.value = clamp(rating / maxStars, 0, 1);
    }, [maxStars, progress, rating]);

    const updateProgress = (locationX: number) => {
        'worklet';

        if (containerWidth.value <= 0) return;
        progress.value = clamp(locationX / containerWidth.value, 0, 1);
    };

    const commitRating = () => {
        'worklet';

        const rawRating = progress.value * maxStars;
        const steppedRating = Math.round(rawRating / step) * step;
        const nextRating = Number(clamp(steppedRating, 0, maxStars).toFixed(10));

        progress.value = withTiming(nextRating / maxStars, { duration: 80 });
        completionScale.value = withSequence(
            withTiming(1.08, { duration: 110 }),
            withSpring(1, {
                damping: 9,
                stiffness: 180,
                mass: 0.45,
            }),
        );
        if (onChange) {
            scheduleOnRN(onChange, nextRating);
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-3, 3])
        .failOffsetY([-10, 10])
        .onBegin(event => {
            updateProgress(event.x);
        })
        .onUpdate(event => {
            updateProgress(event.x);
        })
        .onEnd(() => {
            commitRating();
        });

    const tapGesture = Gesture.Tap()
        .maxDistance(10)
        .onEnd(event => {
            updateProgress(event.x);
            commitRating();
        });

    const gesture = Gesture.Race(panGesture, tapGesture);

    const fillOverlayStyle = useAnimatedStyle(() => ({
        width: progress.value * containerWidth.value,
    }));

    const fillContentStyle = useAnimatedStyle(() => ({
        width: containerWidth.value,
    }));

    const completionStyle = useAnimatedStyle(() => ({
        transform: [{ scale: completionScale.value }],
    }));

    const onLayout = (event: LayoutChangeEvent) => {
        containerWidth.value = event.nativeEvent.layout.width;
    };

    return {
        gesture,
        fillOverlayStyle,
        fillContentStyle,
        completionStyle,
        onLayout,
    };
};
