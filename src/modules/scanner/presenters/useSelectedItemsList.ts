import { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';
import { scaleHorizontal } from '@/utils';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';

const SCROLL_STEP = scaleHorizontal(100);

export const useSelectedItemsList = () => {
    const listRef = useRef<FlatList<IWineSelectedSmell>>(null);
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
