import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { observer } from 'mobx-react-lite';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { useRefresh } from '@/hooks/useRefresh';
import { Loader } from '@/UIKit/Loader';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';
import { useFavoriteWineListView } from '../../presenters/useFavoriteWineListView';
import { useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    FavoriteWineListView: {
        listId: number;
        listName: string;
    };
};

type FavoriteWineListViewRouteProp = RouteProp<RootStackParamList, 'FavoriteWineListView'>;

export const FavoriteWineListView = observer(() => {

    const { params } = useRoute<FavoriteWineListViewRouteProp>();
    const { listId, listName } = params;
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { wines, isLoading, isError, onWinePress, loadWines } = useFavoriteWineListView(listId);
    const { refreshControl } = useRefresh(loadWines);

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);

    const renderFooter = useCallback((item: IWineListItem) => {
        const lastReviewData = item.myReview || item.lastReview;
        if (!lastReviewData) return null;

        return <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} />;
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: IWineListItem }) => (
            <WineListItem item={item} onPress={onWinePress} showDate footer={renderFooter(item)} />
        ),
        [onWinePress, renderFooter],
    );
    const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={loadWines}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={listName} isCentered={false} />}
            >
                {isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={wines || []}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        ItemSeparatorComponent={renderSeparator}
                        refreshControl={refreshControl}
                        contentContainerStyle={styles.containerStyle}
                    />
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});

FavoriteWineListView.displayName = 'FavoriteWineListView';
