import { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';
import { ISelectedSmell } from './useWineSmell';
import { scaleHorizontal } from '@/utils';

const SCROLL_STEP = scaleHorizontal(100);

export const useSelectedItemsList = () => {
    const listRef = useRef<FlatList<ISelectedSmell>>(null);
    const currentOffsetRef = useRef(0);

    const onScroll = useCallback(e => {
        currentOffsetRef.current = e.nativeEvent.contentOffset.x;
    }, []);

    const scrollLeft = () => {
        listRef.current?.scrollToOffset({
            offset: Math.max(0, currentOffsetRef.current - SCROLL_STEP),
            animated: true,
        });
    };

    const scrollRight = () => {
        listRef.current?.scrollToOffset({
            offset: currentOffsetRef.current + SCROLL_STEP,
            animated: true,
        });
    };
    return { listRef, onScroll, scrollLeft, scrollRight };
};
