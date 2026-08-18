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
    starWidth: number;
    spreadStars: boolean;
    onChange?: (rating: number) => void;
    onPreviewChange?: (rating: number) => void;
}

const clamp = (value: number, min: number, max: number) => {
    'worklet';

    return Math.min(max, Math.max(min, value));
};

export const usePreciseStarRating = ({
    rating,
    maxStars,
    step,
    starWidth,
    spreadStars,
    onChange,
    onPreviewChange,
}: IProps) => {
    const containerWidth = useSharedValue(0);
    const progress = useSharedValue(clamp(rating / maxStars, 0, 1));
    const completionScale = useSharedValue(1);
    const lastPreviewRating = useSharedValue(rating);

    useEffect(() => {
        progress.value = clamp(rating / maxStars, 0, 1);
        lastPreviewRating.value = rating;
    }, [lastPreviewRating, maxStars, progress, rating]);

    const getSteppedRating = (progressValue: number) => {
        'worklet';

        const rawRating = progressValue * maxStars;
        const steppedRating = Math.round(rawRating / step) * step;

        return Number(clamp(steppedRating, 0, maxStars).toFixed(10));
    };

    const getRatingForLocation = (locationX: number) => {
        'worklet';

        if (starWidth <= 0 || maxStars <= 0) {
            return 0;
        }

        const starSlotWidth = spreadStars && maxStars > 1
            ? (containerWidth.value - starWidth) / (maxStars - 1)
            : containerWidth.value / maxStars;
        if (starSlotWidth <= 0) {
            return 0;
        }

        const activeWidth = Math.max(maxStars - 1, 0) * starSlotWidth + starWidth;
        const clampedLocation = clamp(locationX, 0, activeWidth);
        const starIndex = Math.min(Math.floor(clampedLocation / starSlotWidth), maxStars - 1);
        const locationWithinSlot = clampedLocation - starIndex * starSlotWidth;

        if (locationWithinSlot >= starWidth) {
            return starIndex + 1;
        }

        return starIndex + locationWithinSlot / starWidth;
    };

    const getFillWidth = (ratingValue: number) => {
        'worklet';

        const clampedRating = clamp(ratingValue, 0, maxStars);
        const starSlotWidth = spreadStars && maxStars > 1
            ? (containerWidth.value - starWidth) / (maxStars - 1)
            : containerWidth.value / maxStars;
        if (starSlotWidth <= 0) {
            return 0;
        }

        const activeWidth = Math.max(maxStars - 1, 0) * starSlotWidth + starWidth;

        if (clampedRating >= maxStars) {
            return activeWidth;
        }

        const fullStars = Math.floor(clampedRating);
        const partialStar = clampedRating - fullStars;

        return fullStars * starSlotWidth + partialStar * starWidth;
    };

    const updateProgress = (locationX: number) => {
        'worklet';

        progress.value = getRatingForLocation(locationX) / maxStars;

        const nextRating = getSteppedRating(progress.value);
        if (onPreviewChange && nextRating !== lastPreviewRating.value) {
            lastPreviewRating.value = nextRating;
            scheduleOnRN(onPreviewChange, nextRating);
        }
    };

    const commitRating = () => {
        'worklet';

        const nextRating = getSteppedRating(progress.value);

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

    const fillOverlayStyle = useAnimatedStyle(() => {
        return {
            width: getFillWidth(progress.value * maxStars),
        };
    });

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
