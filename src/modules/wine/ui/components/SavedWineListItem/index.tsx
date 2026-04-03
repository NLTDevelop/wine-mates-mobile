import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { DropdownButton } from '@/UIKit/DropdownButton';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { useSavedWineListItem } from '@/modules/wine/presenters/useSavedWineListItem';

interface IProps {
    listId: number;
    title: string;
    onLongPress?: () => void;
}

export const SavedWineListItem = ({ listId, title, onLongPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { wines, isLoading, onWinePress, onExpand, onCollapse } = useSavedWineListItem(listId);

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IWineListItem }) => <WineListItem item={item} onPress={onWinePress} />,
        [onWinePress],
    );
    const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

    return (
        <View style={styles.container}>
            <DropdownButton title={title} onExpand={onExpand} onCollapse={onCollapse} onLongPress={onLongPress}>
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={wines}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        ItemSeparatorComponent={renderSeparator}
                        style={styles.list}
                        scrollEnabled={false}
                    />
                )}
            </DropdownButton>
        </View>
    );
};
