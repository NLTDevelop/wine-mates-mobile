import { useCallback, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface IUseCollapseProps {
    defaultExpanded?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

export const useCollapse = ({ defaultExpanded = false, onToggle }: IUseCollapseProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const opacity = useSharedValue(defaultExpanded ? 1 : 0);
    const rotation = useSharedValue(defaultExpanded ? 180 : 0);

    const handlePress = useCallback(() => {
        const newValue = !isExpanded;
        setIsExpanded(newValue);
        
        opacity.value = withTiming(newValue ? 1 : 0, {
            duration: 250,
            easing: Easing.ease,
        });
        
        rotation.value = withTiming(newValue ? 180 : 0, {
            duration: 300,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        });

        if (onToggle) {
            onToggle(newValue);
        }
    }, [isExpanded, opacity, rotation, onToggle]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedArrowStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return {
        isExpanded,
        animatedStyle,
        animatedArrowStyle,
        handlePress,
    };
};
