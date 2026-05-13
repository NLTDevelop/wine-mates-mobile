import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { TouchableOpacity, View, FlatList} from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { useSelectedItemsList } from '@/modules/scanner/presenters/useSelectedItemsList';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import { SelectedItemsListRef } from './types';
import { SelectedItems } from './components/SelectedItem';

type SelectedItemType = IWineSelectedSmell | IWineTaste;
type SelectedItemsListType = (<T extends SelectedItemType>(
    props: IProps<T> & React.RefAttributes<SelectedItemsListRef>,
) => React.ReactElement) & { displayName?: string };

interface IProps<T extends SelectedItemType> {
    data: T[];
    onPress: (item: T) => void;
}

const SelectedItemsListComponent = <T extends SelectedItemType>({ data, onPress }: IProps<T>, ref: React.ForwardedRef<SelectedItemsListRef>) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { listRef, onScroll, scrollLeft, scrollRight, scrollToStart, onSetNewItemId, renderItem } =
        useSelectedItemsList<T>(onPress);

    useImperativeHandle(ref, () => ({
        scrollToStart,
        setNewItemId: onSetNewItemId,
    }), [scrollToStart, onSetNewItemId]);

    const keyExtractor = useCallback((item: T, index: number) => {
        return `${item.id}-${index}`;
    }, []);

    const renderListItem = useCallback(({ item }: { item: T }) => {
        const itemProps = renderItem(item);
        return <SelectedItems {...itemProps} />;
    }, [renderItem]);

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
};

export const SelectedItemsList = forwardRef(SelectedItemsListComponent) as SelectedItemsListType;

SelectedItemsList.displayName = 'SelectedItemsList';
