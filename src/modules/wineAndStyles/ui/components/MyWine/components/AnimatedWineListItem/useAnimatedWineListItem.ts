import { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { isIOS } from '@/utils';

interface UseAnimatedWineListItemParams {
    index: number;
}

export const useAnimatedWineListItem = ({ index }: UseAnimatedWineListItemParams) => {
    const [fadeAnim] = useState(() => new Animated.Value(0));
    const [translateYAnim] = useState(() => new Animated.Value(20));

    useEffect(() => {
        if (isIOS) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 50,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 400,
                    delay: index * 50,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(1);
            translateYAnim.setValue(0);
        }
    }, [fadeAnim, translateYAnim, index]);

    return {
        fadeAnim,
        translateYAnim,
    };
};
