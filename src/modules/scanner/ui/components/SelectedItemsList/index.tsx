import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { TouchableOpacity, View, FlatList} from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { SelectedItems } from '../SelectedItem';
import { useSelectedItemsList } from '@/modules/scanner/presenters/useSelectedItemsList';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';

interface IProps {
    data: IWineSelectedSmell[] | IWineTaste[];
    onPress: (item: IWineSelectedSmell | IWineTaste) => void;
}

export interface SelectedItemsListRef {
    scrollToStart: () => void;
    setNewItemId: (id: number) => void;
}

export const SelectedItemsList = forwardRef<SelectedItemsListRef, IProps>(({ data, onPress }, ref) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { listRef, onScroll, scrollLeft, scrollRight } = useSelectedItemsList();
    const [newItemId, setNewItemId] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
        scrollToStart: () => {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        },
        setNewItemId: (id: number) => {
            setNewItemId(id);
            setTimeout(() => setNewItemId(null), 600);
        },
    }), []);

    const keyExtractor = useCallback((item: IWineSelectedSmell | IWineTaste, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IWineSelectedSmell | IWineTaste }) => (
            <SelectedItems item={item} onPress={() => onPress(item)} isNew={item.id === newItemId} />
        ),
        [onPress, newItemId],
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={scrollLeft}>
                <ArrowIcon width={16} height={16} />
            </TouchableOpacity>

            <FlatList
                ref={listRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                style={styles.list}
                contentContainerStyle={styles.contentContainer}
                onScroll={onScroll}
                scrollEventThrottle={16}
            />

            <TouchableOpacity style={styles.button} onPress={scrollRight}>
                <NextLongArrowIcon width={16} height={16} color={colors.icon} />
            </TouchableOpacity>
        </View>
    );
});

SelectedItemsList.displayName = 'SelectedItemsList';
