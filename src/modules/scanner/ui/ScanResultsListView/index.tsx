import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { useRefresh } from '@/hooks/useRefresh';
import { useScannerResultsList } from '../../presenters/useScannerResultsList';
import { useScanResultsListBackButton } from '../../presenters/useScanResultsListBackButton';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { observer } from 'mobx-react-lite';
import { WineListItem } from '@/UIKit/WineListItem';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';

export const ScanResultsListView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isLoading, onRefresh, handleItemPress, handleAddWinePress } = useScannerResultsList();
    const { refreshControl } = useRefresh(onRefresh);
    const { onPressBack } = useScanResultsListBackButton();

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);

    const renderFooter = useCallback((item: IWineListItem) => {
        const lastReviewData = item.myReview || item.lastReview;
        if (!lastReviewData) return null;

        return <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} />;
    }, []);

    const renderItem = useCallback(({ item }: { item: IWineListItem }) => {
        return <WineListItem item={item} onPress={handleItemPress} showSimilarity footer={renderFooter(item)} />;
    }, [handleItemPress, renderFooter]);


    return (
        // <WithErrorHandler error={null} onRetry={() => {}}>
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('scanner.results')} onPressBack={onPressBack} />}
        >
            <Typography text={t('scanner.resultsTitle')} variant="body_400" style={styles.title} />
            <View style={styles.container}>
                <FlatList
                    refreshControl={refreshControl}
                    data={data || []}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={styles.list}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.contentContainerStyle}
                    ListFooterComponent={isLoading && data?.length ? <ListFooterLoader /> : null}
                    ListEmptyComponent={
                        <EmptyListView
                            isLoading={isLoading}
                            image={<EmptyWineListIcon />}
                            text={t('common.nothingFoundTitle')}
                        />
                    }
                />
                <Button text={t('scanner.addWine')} onPress={handleAddWinePress} containerStyle={styles.button} />
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
});
