import { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scaleVertical } from '@/utils';

const KEYBOARD_SCROLL_GAP = scaleVertical(16);

export const useKeyboardStickyLayout = () => {
    const { bottom } = useSafeAreaInsets();
    const [stickyHeight, setStickyHeight] = useState(0);

    const onStickyLayout = useCallback((event: LayoutChangeEvent) => {
        setStickyHeight(event.nativeEvent.layout.height);
    }, []);

    const scrollBottomOffset = useMemo(() => {
        return stickyHeight + KEYBOARD_SCROLL_GAP;
    }, [stickyHeight]);

    const extraKeyboardSpace = scrollBottomOffset;
    const stickyOpenedOffset = bottom;

    return {
        scrollBottomOffset,
        extraKeyboardSpace,
        stickyOpenedOffset,
        onStickyLayout,
    };
};
