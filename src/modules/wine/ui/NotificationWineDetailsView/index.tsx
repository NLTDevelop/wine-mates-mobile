import { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { ResultListHeader } from '../components/ResultListHeader';
import { ReviewListItem } from '@/UIKit/ReviewListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { Loader } from '@/UIKit/Loader';
import { useWineDetails } from '../../presenters/useWineDetails';
import { useWineReviewsList } from '../../presenters/useWineReviewsList';
import { AddToFavoriteBottomSheet } from '../components/AddToFavoriteBottomSheet';
import { useAddToFavoriteBottomSheet } from '../../presenters/useAddToFavoriteBottomSheet';
import { Gallery } from '@/UIKit/Gallery';
import { getStyles } from '../WineDetailsView/styles';

export const NotificationWineDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        details,
        vintages,
        isError,
        getDetails,
        onVintageChange,
        hasCurrentVintageData,
        isAllVintagesSelected,
        reviewsWineId,
        fromScanner,
        onUpdateIsSaved,
        isPreloadedData,
        isResultHeaderFooterVisible,
        showTastingAuthor,
        myReview,
        hasPremiumContentAccess,
        onPressBack,
        wineImageGallery,
        onWineImagePress,
    } = useWineDetails();
    const { data, isReviewsLoading, onRefresh, onEndReached } = useWineReviewsList(
        getDetails,
        reviewsWineId,
        isAllVintagesSelected,
        isPreloadedData,
        myReview,
    );
    const { refreshControl } = useRefresh(onRefresh);
    const {
        favoriteData,
        isVisible,
        onItemPress,
        onClose,
        onOpen,
        onSave,
        isLoading,
        isSaving,
    } = useAddToFavoriteBottomSheet(details?.id, onUpdateIsSaved);

    const keyExtractor = useCallback((item: IWineReviewsListItem) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWineReviewsListItem }) => (
        <ReviewListItem item={item} showReviewWithoutPremium={hasPremiumContentAccess} />
    ), [hasPremiumContentAccess]);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getDetails}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={
                    <HeaderWithBackButton title={t('wine.result')} isCentered={false} onPressBack={onPressBack} />
                }
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
                                isResultHeaderFooterVisible={isResultHeaderFooterVisible}
                                showTastingAuthor={showTastingAuthor}
                                hasPremiumContentAccess={hasPremiumContentAccess}
                                onWineImagePress={onWineImagePress}
                            />
                        }
                        ListFooterComponent={isReviewsLoading && data.length ? <ListFooterLoader /> : null}
                    />
                )}
                {isVisible ? (
                    <AddToFavoriteBottomSheet
                        isVisible={isVisible}
                        data={favoriteData}
                        onItemPress={onItemPress}
                        onClose={onClose}
                        onSave={onSave}
                        isLoading={isLoading}
                        isSaving={isSaving}
                    />
                ) : null}
                <Gallery title="" {...wineImageGallery} hideHeader hidePreview />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
