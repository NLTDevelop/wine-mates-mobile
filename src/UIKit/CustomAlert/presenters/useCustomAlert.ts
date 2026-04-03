import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler } from 'react-native';

interface IUseCustomAlertProps {
    visible: boolean;
    onClose: () => void;
}

export const useCustomAlert = ({ visible, onClose }: IUseCustomAlertProps) => {
    const [isVisible, setIsVisible] = useState(visible);
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    const handleClose = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsVisible(false);
            onClose();
        });
    }, [backdropOpacity, scaleAnim, onClose]);

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            handleClose();
        }
    }, [visible, backdropOpacity, scaleAnim, handleClose]);

    useEffect(() => {
        if (!isVisible) return;

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleClose();
            return true;
        });

        return () => backHandler.remove();
    }, [isVisible, handleClose]);

    return {
        isVisible,
        backdropOpacity,
        scaleAnim,
        handleClose,
    };
};
