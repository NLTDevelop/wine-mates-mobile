import { useEffect, useState, useCallback } from 'react';
import { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, cancelAnimation } from 'react-native-reanimated';
import { LayoutChangeEvent } from 'react-native';

interface IUseMarqueeTextProps {
    speed: number;
    isEverlasting: boolean;
    gap: number;
}

export const useMarqueeText = ({ speed, isEverlasting, gap }: IUseMarqueeTextProps) => {
    const translateX = useSharedValue(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const onContentLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContentWidth(width);
    }, []);

    const onContainerLayout = useCallback((event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    }, []);

    useEffect(() => {
        if (isEverlasting && contentWidth > 0 && containerWidth > 0) {
            const distance = contentWidth + gap;
            const duration = (distance / speed) * 1000;

            translateX.value = 0;
            translateX.value = withRepeat(
                withTiming(-distance, {
                    duration,
                    easing: Easing.linear,
                }),
                -1,
                false
            );
        }

        return () => {
            cancelAnimation(translateX);
        };
    }, [isEverlasting, speed, translateX, contentWidth, containerWidth, gap]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return {
        animatedStyle,
        onContentLayout,
        onContainerLayout,
    };
};
