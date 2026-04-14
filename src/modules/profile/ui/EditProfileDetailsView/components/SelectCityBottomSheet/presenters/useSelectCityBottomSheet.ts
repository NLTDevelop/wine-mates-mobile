import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { Keyboard } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scaleVertical } from '@/utils';

interface IProps {
    modalRef: RefObject<BottomSheetModal | null>;
    bottomInset: number;
}

export const useSelectCityBottomSheet = ({ modalRef, bottomInset }: IProps) => {
    const { bottom } = useSafeAreaInsets();
    const { height: keyboardHeight } = useAnimatedKeyboard();
    const isProgrammaticSnapRef = useRef(false);
    const snapPoints = useMemo(() => {
        const HEADER_MARGIN_TOP = scaleVertical(15);
        const HEADER_HEIGHT = scaleVertical(24);
        const SEARCH_HEIGHT = scaleVertical(48);
        const SEARCH_MARGIN_BOTTOM = scaleVertical(8);
        const LIST_HEIGHT = scaleVertical(300);
        const CONTAINER_GAP = scaleVertical(16);
        const FOOTER_PADDING_BOTTOM = scaleVertical(16);
        const GAPS_COUNT = 3;
        const firstSnapPoint = Math.round(
            HEADER_MARGIN_TOP +
                HEADER_HEIGHT +
                SEARCH_HEIGHT +
                SEARCH_MARGIN_BOTTOM +
                LIST_HEIGHT +
                CONTAINER_GAP * GAPS_COUNT +
                FOOTER_PADDING_BOTTOM +
                bottomInset,
        );

        return [firstSnapPoint, '100%'];
    }, [bottomInset]);

    const onSnapToIndex = useCallback((index: number) => {
        isProgrammaticSnapRef.current = true;
        modalRef.current?.snapToIndex(index);
    }, [modalRef]);

    const onKeyboardDidShow = useCallback(() => {
        onSnapToIndex(1);
    }, [onSnapToIndex]);

    const onKeyboardDidHide = useCallback(() => {
        onSnapToIndex(0);
    }, [onSnapToIndex]);

    const onSheetAnimate = useCallback((fromIndex: number, toIndex: number) => {
        if (isProgrammaticSnapRef.current) {
            isProgrammaticSnapRef.current = false;
            return;
        }

        const isSwipeDownToFirstSnap = fromIndex > toIndex && toIndex === 0;
        if (isSwipeDownToFirstSnap) {
            modalRef.current?.snapToIndex(1);
        }
    }, [modalRef]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [onKeyboardDidHide, onKeyboardDidShow]);

    const animatedListOffsetStyle = useAnimatedStyle(() => {
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
        animatedListOffsetStyle,
        onSheetAnimate,
    };
};
