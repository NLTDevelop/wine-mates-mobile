import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '@/utils';

export const useWineSearchBottomSheet = () => {
    const { bottom } = useSafeAreaInsets();
    const { height: keyboardHeight } = useAnimatedKeyboard();

    const animatedListContainerStyle = useAnimatedStyle(() => {
        const androidOffset = isAndroid && keyboardHeight.value > 0 ? bottom : 0;
        const target = Math.max(keyboardHeight.value - bottom + androidOffset, 0);

        return {
            marginBottom: withTiming(target, {
                duration: 120,
                easing: Easing.out(Easing.cubic),
            }),
        };
    });

    return {
        animatedListContainerStyle,
    };
};
