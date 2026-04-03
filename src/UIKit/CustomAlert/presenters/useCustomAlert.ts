import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler } from 'react-native';

interface IUseCustomAlertProps {
    visible: boolean;
    onClose: () => void;
}

export const useCustomAlert = ({ visible, onClose }: IUseCustomAlertProps) => {
    const [isVisible, setIsVisible] = useState(visible);
    const backdropOpacityRef = useRef(new Animated.Value(0));
    const scaleAnimRef = useRef(new Animated.Value(0.8));

    const handleClose = useCallback(() => {
        Animated.parallel([
            Animated.timing(backdropOpacityRef.current, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimRef.current, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsVisible(false);
            onClose();
        });
    }, [onClose]);

    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.parallel([
                Animated.timing(backdropOpacityRef.current, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnimRef.current, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            handleClose();
        }
    }, [visible, handleClose]);

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
        backdropOpacity: backdropOpacityRef.current,
        scaleAnim: scaleAnimRef.current,
        handleClose,
    };
};
