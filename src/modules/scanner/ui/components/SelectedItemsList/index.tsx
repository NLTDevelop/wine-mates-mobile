import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View, FlatList} from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { SelectedItems } from '../SelectedItem';
import { ISelectedSmell } from '@/modules/scanner/presenters/useWineSmell';
import { useSelectedItemsList } from '@/modules/scanner/presenters/useSelectedItemsList';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';

interface IProps {
    data: ISelectedSmell[] | IWineTaste[];
    onPress: (item: ISelectedSmell | IWineTaste) => void;
}

export const SelectedItemsList = ({ data, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { listRef, onScroll, scrollLeft, scrollRight } = useSelectedItemsList();

    const keyExtractor = useCallback((item: ISelectedSmell | IWineTaste, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: ISelectedSmell | IWineTaste }) => <SelectedItems item={item} onPress={() => onPress(item)} />,
        [onPress],
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
};
