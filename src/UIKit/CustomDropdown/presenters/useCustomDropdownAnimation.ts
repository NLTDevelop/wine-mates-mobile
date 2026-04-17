import { useEffect, useMemo, useState } from 'react';
import { Animated, Easing } from 'react-native';

interface IProps {
    isOpen: boolean;
    dropdownLiftOffset: number;
}

export const useCustomDropdownAnimation = ({ isOpen, dropdownLiftOffset }: IProps) => {
    const [arrowProgress] = useState(() => new Animated.Value(isOpen ? 1 : 0));
    const [liftProgress] = useState(() => new Animated.Value(dropdownLiftOffset));
    const [animatedLiftOffset, setAnimatedLiftOffset] = useState(dropdownLiftOffset);

    useEffect(() => {
        const subscriptionId = liftProgress.addListener(({ value }) => {
            setAnimatedLiftOffset(value);
        });

        return () => {
            liftProgress.removeListener(subscriptionId);
        };
    }, [liftProgress]);

    useEffect(() => {
        Animated.timing(arrowProgress, {
            toValue: isOpen ? 1 : 0,
            duration: 180,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [arrowProgress, isOpen]);

    useEffect(() => {
        Animated.timing(liftProgress, {
            toValue: dropdownLiftOffset,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [dropdownLiftOffset, liftProgress]);

    const animatedArrowStyle = useMemo(() => {
        return {
            transform: [
                {
                    rotate: arrowProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                    }),
                },
            ],
        };
    }, [arrowProgress]);

    return {
        animatedArrowStyle,
        animatedLiftOffset,
    };
};
