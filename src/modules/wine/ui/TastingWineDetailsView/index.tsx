import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRefresh } from '@/hooks/useRefresh';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { Loader } from '@/UIKit/Loader';
import { useTastingWineDetails } from './presenters/useTastingWineDetails';
import { useTastingWineReviewsList } from './presenters/useTastingWineReviewsList';
import { ReviewListItem } from '@/UIKit/ReviewListItem';
import { TastingResultListHeader } from './components/TastingResultListHeader';

export const TastingWineDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { details, isError, getDetails, isAllVintagesSelected, wineId, selectedWineId, isPreloadedData, myReview, eventId } =
        useTastingWineDetails();
    const { data, isReviewsLoading, onRefresh, onEndReached } = useTastingWineReviewsList(
        getDetails,
        selectedWineId ?? wineId,
        eventId,
        isAllVintagesSelected,
        isPreloadedData,
        myReview,
    );
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IWineReviewsListItem) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWineReviewsListItem }) => <ReviewListItem item={item} />, []);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getDetails}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.result')} isCentered={true} />}
            >
                {!details ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        refreshControl={refreshControl}
                        onEndReached={onEndReached}
                        contentContainerStyle={styles.containerStyle}
                        ListHeaderComponent={
                            <TastingResultListHeader
                                data={details}
                                hasReviews={data.length > 0}
                            />
                        }
                        ListFooterComponent={isReviewsLoading && data?.length ? <ListFooterLoader /> : null}
                    />
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
