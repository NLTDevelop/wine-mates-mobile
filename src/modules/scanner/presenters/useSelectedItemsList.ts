import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { scaleHorizontal } from '@/utils';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';

const SCROLL_STEP = scaleHorizontal(100);
type SelectedItemType = IWineSelectedSmell | IWineTaste;

export const useSelectedItemsList = <T extends SelectedItemType>(onPress: (item: T) => void) => {
    const listRef = useRef<FlatList<T>>(null);
    const currentOffsetRef = useRef(0);
    const [newItemId, setNewItemId] = useState<number | null>(null);

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

    const scrollToStart = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    const onSetNewItemId = useCallback((id: number) => {
        setNewItemId(id);
        setTimeout(() => setNewItemId(null), 600);
    }, []);

    const renderItem = useCallback(
        (item: T) => ({
            item,
            onPress: () => onPress(item),
            isNew: item.id === newItemId,
        }),
        [onPress, newItemId]
    );

    return { 
        listRef, 
        onScroll, 
        scrollLeft, 
        scrollRight, 
        scrollToStart, 
        onSetNewItemId,
        renderItem 
    };
};
