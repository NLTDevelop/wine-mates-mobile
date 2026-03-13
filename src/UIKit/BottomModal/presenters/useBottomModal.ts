import { useCallback, useMemo } from 'react';
import { Animated } from 'react-native';
import { size } from '@/utils';

const ANIMATION_DURATION = 300;

interface IUseBottomModalProps {
    onClose: () => void;
}

export const useBottomModal = ({ onClose }: IUseBottomModalProps) => {
    const backdropOpacity = useMemo(() => new Animated.Value(0), []);
    const slideAnim = useMemo(() => new Animated.Value(size.height), []);

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
                toValue: size.height,
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
