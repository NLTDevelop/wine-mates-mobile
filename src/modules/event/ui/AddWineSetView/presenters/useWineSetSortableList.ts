import { Keyboard, ScrollView } from 'react-native';
import { useCallback, useMemo } from 'react';
import { useAnimatedRef } from 'react-native-reanimated';
import { scaleVertical } from '@/utils';

const WINE_SET_ITEMS_GAP = 8;
const AUTO_SCROLL_ACTIVATION_OFFSET = 180;
const AUTO_SCROLL_MAX_VELOCITY = 900;
const DRAG_ACTIVATION_DELAY = 120;

export const useWineSetSortableList = () => {
    const scrollableRef = useAnimatedRef<ScrollView>();
    const rowGap = scaleVertical(WINE_SET_ITEMS_GAP);
    const autoScrollActivationOffset = useMemo<[number, number]>(() => {
        const offset = scaleVertical(AUTO_SCROLL_ACTIVATION_OFFSET);

        return [offset, offset];
    }, []);
    const autoScrollMaxVelocity = scaleVertical(AUTO_SCROLL_MAX_VELOCITY);
    const onDismissKeyboard = useCallback(() => {
        Keyboard.dismiss();
    }, []);

    return {
        autoScrollActivationOffset,
        autoScrollMaxVelocity,
        dragActivationDelay: DRAG_ACTIVATION_DELAY,
        onDismissKeyboard,
        rowGap,
        scrollableRef,
    };
};
