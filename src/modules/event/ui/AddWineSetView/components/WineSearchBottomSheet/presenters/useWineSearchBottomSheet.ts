import { RefObject, useMemo } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
}

export const useWineSearchBottomSheet = (_props: IProps) => {
    const { bottom } = useSafeAreaInsets();
    const { height: keyboardHeight } = useAnimatedKeyboard();
    const snapPoints = useMemo(() => {
        return ['100%'];
    }, []);

    const animatedListContainerStyle = useAnimatedStyle(() => {
        const target = Math.max(keyboardHeight.value - bottom, 0);

        return {
            marginBottom: withTiming(target, {
                duration: 120,
                easing: Easing.out(Easing.cubic),
            }),
        };
    });

    return {
        snapPoints,
        animatedListContainerStyle,
    };
};
