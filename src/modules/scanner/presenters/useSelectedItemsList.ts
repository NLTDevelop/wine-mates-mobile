import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { scaleHorizontal } from '@/utils';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';

const SCROLL_STEP = scaleHorizontal(100);

export const useSelectedItemsList = (onPress: (item: IWineSelectedSmell | IWineTaste) => void) => {
    const listRef = useRef<FlatList<IWineSelectedSmell>>(null);
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

    const handleSetNewItemId = useCallback((id: number) => {
        setNewItemId(id);
        setTimeout(() => setNewItemId(null), 600);
    }, []);

    const keyExtractor = useCallback(
        (item: IWineSelectedSmell | IWineTaste, index: number) => `${item.id}-${index}`,
        []
    );

    const renderItem = useCallback(
        (item: IWineSelectedSmell | IWineTaste) => ({
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
        handleSetNewItemId, 
        keyExtractor, 
        renderItem 
    };
};
