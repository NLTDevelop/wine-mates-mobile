import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { DropdownButton } from '@/UIKit/DropdownButton';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { useSavedWinesListItem } from '@/modules/wine/presenters/useSavedWinesListItem';

interface IProps {
    title: string;
    data: IWineListItem[];
}

export const SavedWineListItem = ({title, data}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onPress } = useSavedWinesListItem();

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IWineListItem }) => <WineListItem item={item} onPress={onPress} />, [onPress]);
    const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

    return (
        <View style={styles.container}>
            <DropdownButton title={title}>
                <FlatList
                    data={data}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    ItemSeparatorComponent={renderSeparator}
                    style={styles.list}
                    scrollEnabled={false}
                />
            </DropdownButton>
        </View>
    );
};
