import { useMemo } from 'react';
import { Animated } from 'react-native';

interface IProps {
    isActive: boolean;
}

export const useColorButtonAnimation = ({ isActive }: IProps) => {
    const scaleAnim = useMemo(() => new Animated.Value(1), []);
    const borderOpacityAnim = useMemo(() => new Animated.Value(isActive ? 1 : 0), [isActive]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    };

    useMemo(() => {
        Animated.timing(borderOpacityAnim, {
            toValue: isActive ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isActive, borderOpacityAnim]);

    return { scaleAnim, borderOpacityAnim, handlePressIn, handlePressOut };
};
