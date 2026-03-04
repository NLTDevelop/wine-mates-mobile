import { useCallback, useMemo, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 300;

interface IUseBottomModalProps {
    onClose: () => void;
}

export const useBottomModal = ({ onClose }: IUseBottomModalProps) => {
    const backdropOpacity = useMemo(() => new Animated.Value(0), []);
    const slideAnim = useMemo(() => new Animated.Value(SCREEN_HEIGHT), []);

    const handleOpen = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0.5,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
                speed: 14,
            }),
        ]).start();
    }, [backdropOpacity, slideAnim]);

    const handleClose = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    }, [backdropOpacity, slideAnim, onClose]);

    return {
        backdropOpacity,
        slideAnim,
        handleOpen,
        handleClose,
    };
};
