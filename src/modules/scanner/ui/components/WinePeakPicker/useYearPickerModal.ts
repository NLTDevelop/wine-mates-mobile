import { useRef, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';

interface IUseYearPickerModalParams {
    visible: boolean;
    onClose: () => void;
}

export const useYearPickerModal = ({ visible, onClose }: IUseYearPickerModalParams) => {
    
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;

    const animateIn = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 65,
                friction: 11,
                useNativeDriver: true,
            }),
        ]).start();
    }, [backdropOpacity, slideAnim]);

    const animateOut = useCallback((callback: () => void) => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            callback();
        });
    }, [backdropOpacity, slideAnim]);

    useEffect(() => {
        if (visible) {
            animateIn();
        }
    }, [visible, animateIn]);

    const handleClose = useCallback(() => {
        animateOut(() => {
            onClose();
        });
    }, [animateOut, onClose]);

    return {
        backdropOpacity,
        slideAnim,
        handleClose,
    };
};
