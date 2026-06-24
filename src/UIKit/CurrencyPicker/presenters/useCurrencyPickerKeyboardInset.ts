import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '@/utils';

const ANIMATION_DURATION = 200;

export const useCurrencyPickerKeyboardInset = () => {
    const { bottom } = useSafeAreaInsets();
    const { height: keyboardHeight } = useAnimatedKeyboard();

    const keyboardSpacerStyle = useAnimatedStyle(() => {
        const androidOffset = isAndroid && keyboardHeight.value > 0 ? bottom : 0;
        const target = Math.max(keyboardHeight.value - bottom + androidOffset, 0);

        return {
            height: withTiming(target, {
                duration: ANIMATION_DURATION,
                easing: Easing.out(Easing.cubic),
            }),
        };
    });

    return {
        keyboardSpacerStyle,
    };
};
