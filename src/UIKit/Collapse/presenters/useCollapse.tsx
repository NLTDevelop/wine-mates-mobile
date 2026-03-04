import { useCallback, useMemo, useRef, useState } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface IUseCollapseProps {
    defaultExpanded?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

export const useCollapse = ({ defaultExpanded = false, onToggle }: IUseCollapseProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const opacityRef = useRef(useSharedValue(defaultExpanded ? 1 : 0));
    const rotationRef = useRef(useSharedValue(defaultExpanded ? 180 : 0));

    const handlePress = useCallback(() => {
        const newValue = !isExpanded;
        setIsExpanded(newValue);

        opacityRef.current.value = withTiming(newValue ? 1 : 0, {
            duration: 250,
            easing: Easing.ease,
        });

        rotationRef.current.value = withTiming(newValue ? 180 : 0, {
            duration: 300,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });

        onToggle?.(newValue);
    }, [isExpanded, onToggle]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacityRef.current.value,
    }));

    const animatedArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotationRef.current.value}deg` }],
    }));

    return useMemo(
        () => ({
            isExpanded,
            animatedStyle,
            animatedArrowStyle,
            handlePress,
        }),
        [isExpanded, animatedStyle, animatedArrowStyle, handlePress],
    );
};
