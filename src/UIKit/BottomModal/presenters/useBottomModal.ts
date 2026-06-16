import { useCallback, useMemo } from 'react';
import { Animated, PanResponder, useWindowDimensions, ViewStyle } from 'react-native';
import { useBottomModalInsets } from './useBottomModalInsets';

interface IUseBottomModalProps {
    onClose: () => void;
    isFullScreen?: boolean;
}

const CLOSE_DISTANCE = 120;
const CLOSE_VELOCITY = 1;
const ANIMATION_DURATION = 250;

const isDragDownGesture = (gestureState: { dx: number; dy: number }) => {
    return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
};

export const useBottomModal = ({ onClose, isFullScreen = false }: IUseBottomModalProps) => {
    const { height } = useWindowDimensions();
    const { topInset, bottomInset } = useBottomModalInsets();
    const translateY = useMemo(() => new Animated.Value(height), [height]);
    const backdropOpacity = useMemo(() => new Animated.Value(0), []);

    const maxHeight = height - topInset;

    const modalContentStyle = useMemo<ViewStyle>(() => {
        const baseStyle = {
            maxHeight,
            transform: [{ translateY }],
        };

        if (isFullScreen) {
            return {
                ...baseStyle,
                height: maxHeight,
            };
        }

        return baseStyle;
    }, [isFullScreen, maxHeight, translateY]);

    const onCloseAnimated = useCallback((shouldNotify = true) => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: height,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (shouldNotify) {
                onClose();
            }
        });
    }, [height, onClose, translateY, backdropOpacity]);

    const onClosePress = useCallback(() => {
        onCloseAnimated();
    }, [onCloseAnimated]);

    const onShow = useCallback(() => {
        translateY.setValue(height);
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
        ]).start();
    }, [height, translateY, backdropOpacity]);

    const panResponder = useMemo(() => PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
            return isDragDownGesture(gestureState);
        },
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return isDragDownGesture(gestureState);
        },
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy > 0) {
                translateY.setValue(gestureState.dy);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > CLOSE_DISTANCE || gestureState.vy > CLOSE_VELOCITY) {
                onCloseAnimated();
                return;
            }

            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
                speed: 16,
            }).start();
        },
    }), [onCloseAnimated, translateY]);

    return {
        bottomInset,
        modalContentStyle,
        backdropOpacity,
        onClosePress,
        onShow,
        panHandlers: panResponder.panHandlers,
    };
};
