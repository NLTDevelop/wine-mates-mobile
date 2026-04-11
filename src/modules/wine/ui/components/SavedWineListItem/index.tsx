import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { FavoriteListDropdown } from './components/FavoriteListDropdown';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';
import { useSavedWineListItem } from '@/modules/wine/presenters/useSavedWineListItem';
import { useSavedWineListItemView } from './presenters/useSavedWineListItemView';

interface IProps {
    listId: number;
    title: string;
    onLongPress?: () => void;
}

export const SavedWineListItem = ({ listId, title, onLongPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { wines, isLoading, onWinePress, onExpand, onCollapse } = useSavedWineListItem(listId);
    const { keyExtractor, renderFooterData } = useSavedWineListItemView();

    const renderFooter = useCallback((item: IWineListItem) => {
        const lastReviewData = renderFooterData(item);
        if (!lastReviewData) return null;

        return <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} />;
    }, [renderFooterData]);

    const renderItem = useCallback(
        ({ item }: { item: IWineListItem }) => (
            <WineListItem item={item} onPress={onWinePress} showDate footer={renderFooter(item)} />
        ),
        [onWinePress, renderFooter],
    );
    const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

    return (
        <View style={styles.container}>
            <FavoriteListDropdown title={title} onExpand={onExpand} onCollapse={onCollapse} onLongPress={onLongPress}>
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
            </FavoriteListDropdown>
        </View>
    );
};
