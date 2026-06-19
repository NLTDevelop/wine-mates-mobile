import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Animated,
    Keyboard,
    PanResponder,
    useWindowDimensions,
    ViewStyle,
} from 'react-native';
import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import { useBottomModalInsets } from './useBottomModalInsets';
import { isAndroid } from '@/utils';

interface IUseBottomModalProps {
    onClose: () => void;
    isFullScreen?: boolean;
    shouldAvoidKeyboard?: boolean;
}

const CLOSE_DISTANCE = 120;
const CLOSE_VELOCITY = 1;
const ANIMATION_DURATION = 230;

const isDragDownGesture = (gestureState: { dx: number; dy: number }) => {
    return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
};

export const useBottomModal = ({ onClose, isFullScreen = false, shouldAvoidKeyboard = true }: IUseBottomModalProps) => {
    const { height } = useWindowDimensions();
    const { topInset, bottomInset } = useBottomModalInsets();
    const translateY = useMemo(() => new Animated.Value(height), [height]);
    const backdropOpacity = useMemo(() => new Animated.Value(0), []);
    const { height: keyboardHeight } = useAnimatedKeyboard();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [pendingCloseNotify, setPendingCloseNotify] = useState<boolean | null>(null);

    const maxHeight = height - topInset;

    const animatedKeyboardContainerStyle = useAnimatedStyle(() => {
        if (!shouldAvoidKeyboard) {
            return {
                marginBottom: 0,
            };
        }

        const androidOffset = isAndroid && keyboardHeight.value > 0 ? bottomInset : 0;
        const target = Math.max(keyboardHeight.value - bottomInset + androidOffset, 0);

        return {
            marginBottom: withTiming(target, {
                duration: ANIMATION_DURATION,
                easing: Easing.out(Easing.cubic),
            }),
        };
    });

    const animatedKeyboardBackgroundStyle = useAnimatedStyle(() => {
        if (!shouldAvoidKeyboard) {
            return {
                height: 0,
            };
        }

        const androidOffset = isAndroid && keyboardHeight.value > 0 ? bottomInset : 0;
        const target = Math.max(keyboardHeight.value - bottomInset + androidOffset, 0);

        return {
            height: withTiming(target, {
                duration: ANIMATION_DURATION,
                easing: Easing.out(Easing.cubic),
            }),
        };
    });

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

    const onRunCloseAnimation = useCallback((shouldNotify = true) => {
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

    const onCloseAnimated = useCallback((shouldNotify = true) => {
        if (isKeyboardVisible) {
            setPendingCloseNotify(shouldNotify);
            Keyboard.dismiss();
            return;
        }

        onRunCloseAnimation(shouldNotify);
    }, [isKeyboardVisible, onRunCloseAnimation]);

    const onClosePress = useCallback(() => {
        onCloseAnimated();
    }, [onCloseAnimated]);

    const onKeyboardShow = useCallback(() => {
        setIsKeyboardVisible(true);
    }, []);

    const onKeyboardHide = useCallback(() => {
        setIsKeyboardVisible(false);

        if (pendingCloseNotify === null) {
            return;
        }

        const shouldNotify = pendingCloseNotify;
        setPendingCloseNotify(null);
        onRunCloseAnimation(shouldNotify);
    }, [onRunCloseAnimation, pendingCloseNotify]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [onKeyboardHide, onKeyboardShow]);

    const onShow = useCallback(() => {
        setPendingCloseNotify(null);
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
        animatedKeyboardContainerStyle,
        animatedKeyboardBackgroundStyle,
    };
};
