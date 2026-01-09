import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { TouchableOpacity, View, FlatList} from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { SelectedItems } from '../SelectedItem';
import { useSelectedItemsList } from '@/modules/scanner/presenters/useSelectedItemsList';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { SelectedItemsListRef } from './types';

interface IProps {
    data: IWineSelectedSmell[] | IWineTaste[];
    onPress: (item: IWineSelectedSmell | IWineTaste) => void;
}

export const SelectedItemsList = forwardRef<SelectedItemsListRef, IProps>(({ data, onPress }, ref) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { listRef, onScroll, scrollLeft, scrollRight, scrollToStart, handleSetNewItemId, keyExtractor, renderItem } = useSelectedItemsList(onPress);

    useImperativeHandle(ref, () => ({
        scrollToStart,
        setNewItemId: handleSetNewItemId,
    }), [scrollToStart, handleSetNewItemId]);

    const renderListItem = ({ item }: { item: IWineSelectedSmell | IWineTaste }) => {
        const itemProps = renderItem(item);
        return <SelectedItems {...itemProps} />;
    };

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
                renderItem={renderListItem}
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
