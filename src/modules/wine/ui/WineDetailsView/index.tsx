import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ResultListHeader } from '../components/ResultListHeader';
import { ReviewListItem } from '../components/ReviewListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { Loader } from '@/UIKit/Loader';
import { useWineDetails } from '@/modules/wine/presenters/useWineDetails';
import { useWineReviewsList } from '@/modules/wine/presenters/useWineReviewsList';
import { AddToFavoriteBottomSheet } from '../components/AddToFavoriteBottomSheet';
import { useAddToFavoriteBottomSheet } from '../../presenters/useAddToFavoriteBottomSheet';

export const WineDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { details, vintages, isError, getDetails, onVintageChange, hasCurrentVintageData, isAllVintagesSelected, wineId,
        selectedWineId, fromScanner, onUpdateIsSaved, isPreloadedData, myReview } = useWineDetails();
    const { data, isReviewsLoading, onRefresh, onEndReached } = useWineReviewsList(
        getDetails,
        selectedWineId ?? wineId,
        isAllVintagesSelected,
        isPreloadedData,
        myReview,
    );
    const { refreshControl } = useRefresh(onRefresh);
    const { favoriteData, addToFavoriteModalRef, onItemPress, onClose, onOpen, onSave, isLoading, isSaving } = useAddToFavoriteBottomSheet(wineId, onUpdateIsSaved);

    const keyExtractor = useCallback((item: IWineReviewsListItem) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWineReviewsListItem }) => <ReviewListItem item={item} />, []);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getDetails}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.result')} isCentered={false} />}
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
                            <ResultListHeader
                                data={details}
                                vintages={vintages}
                                onVintageChange={onVintageChange}
                                onFavoritePress={onOpen}
                                hasCurrentVintageData={hasCurrentVintageData}
                                isAllVintagesSelected={isAllVintagesSelected}
                                fromScanner={fromScanner}
                                hasReviews={data.length > 0}
                            />
                        }
                        ListFooterComponent={isReviewsLoading && data?.length ? <ListFooterLoader /> : null}
                    />
                )}
                <AddToFavoriteBottomSheet
                    modalRef={addToFavoriteModalRef}
                    data={favoriteData}
                    onItemPress={onItemPress}
                    onClose={onClose}
                    onSave={onSave}
                    isLoading={isLoading}
                    isSaving={isSaving}
                />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
