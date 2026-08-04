import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList, ScrollView, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ResultListHeader } from '../components/ResultListHeader';
import { ReviewListItem } from '../../../../UIKit/ReviewListItem';
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
import { Gallery } from '@/UIKit/Gallery';
import { WineMarketplaceTab } from './components/WineMarketplaceTab';
import { useWineDetailsTabs } from '../../presenters/useWineDetailsTabs';
import { WineDetailsScrollableHeader } from './components/WineDetailsScrollableHeader';
import { WineEvolutionTab } from './components/WineEvolutionTab';
import { PremiumFeature } from './components/PremiumFeature';

export const WineDetailsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        details,
        vintages,
        isError,
        getDetails,
        onVintageChange,
        hasCurrentVintageData,
        hasSelectedVintageData,
        isVintageChanging,
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
        isVintageChanging,
    );
    const { refreshControl } = useRefresh(onRefresh);
    const {
        favoriteData,
        isVisible: isAddToFavoriteModalVisible,
        onItemPress,
        onClose,
        onOpen,
        onSave,
        isLoading,
        isSaving,
    } = useAddToFavoriteBottomSheet(details?.id, onUpdateIsSaved);
    const {
        isProfileActive,
        isEvolutionActive,
        isPurchaseActive,
        onProfilePress,
        onEvolutionPress,
        onPurchasePress,
        onGetPremiumPress,
    } = useWineDetailsTabs();

    const keyExtractor = useCallback((item: IWineReviewsListItem) => `${item.id}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IWineReviewsListItem }) => (
            <ReviewListItem item={item} showReviewWithoutPremium={hasPremiumContentAccess} />
        ),
        [hasPremiumContentAccess],
    );

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
                    <>
                        <View
                            collapsable={false}
                            pointerEvents={isProfileActive ? 'auto' : 'none'}
                            style={[styles.tabContainer, isProfileActive ? null : styles.hiddenTabContainer]}
                        >
                            <FlatList
                                data={data}
                                keyExtractor={keyExtractor}
                                renderItem={renderItem}
                                refreshControl={refreshControl}
                                onEndReached={onEndReached}
                                contentContainerStyle={styles.containerStyle}
                                ListHeaderComponent={
                                    <>
                                        <WineDetailsScrollableHeader
                                            details={details}
                                            vintages={vintages}
                                            onVintageChange={onVintageChange}
                                            onFavoritePress={onOpen}
                                            hasCurrentVintageData={hasCurrentVintageData}
                                            isAllVintagesSelected={isAllVintagesSelected}
                                            fromScanner={fromScanner}
                                            isResultHeaderFooterVisible={isResultHeaderFooterVisible}
                                            showTastingAuthor={showTastingAuthor}
                                            hasPremiumContentAccess={hasPremiumContentAccess}
                                            onWineImagePress={onWineImagePress}
                                            isProfileActive={isProfileActive}
                                            isEvolutionActive={isEvolutionActive}
                                            isPurchaseActive={isPurchaseActive}
                                            onProfilePress={onProfilePress}
                                            onEvolutionPress={onEvolutionPress}
                                            onPurchasePress={onPurchasePress}
                                        />
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
                                            hideResultHeader
                                        />
                                    </>
                                }
                                ListFooterComponent={isReviewsLoading && data?.length ? <ListFooterLoader /> : null}
                            />
                        </View>
                        <View
                            collapsable={false}
                            pointerEvents={isEvolutionActive ? 'auto' : 'none'}
                            style={[styles.tabContainer, isEvolutionActive ? null : styles.hiddenTabContainer]}
                        >
                            <ScrollView contentContainerStyle={styles.evolutionContent}>
                                <WineDetailsScrollableHeader
                                    details={details}
                                    vintages={vintages}
                                    onVintageChange={onVintageChange}
                                    onFavoritePress={onOpen}
                                    hasCurrentVintageData={hasCurrentVintageData}
                                    isAllVintagesSelected={isAllVintagesSelected}
                                    fromScanner={fromScanner}
                                    isResultHeaderFooterVisible={isResultHeaderFooterVisible}
                                    showTastingAuthor={showTastingAuthor}
                                    hasPremiumContentAccess={hasPremiumContentAccess}
                                    onWineImagePress={onWineImagePress}
                                    isProfileActive={isProfileActive}
                                    isEvolutionActive={isEvolutionActive}
                                    isPurchaseActive={isPurchaseActive}
                                    onProfilePress={onProfilePress}
                                    onEvolutionPress={onEvolutionPress}
                                    onPurchasePress={onPurchasePress}
                                />
                                {isEvolutionActive ? (
                                    hasPremiumContentAccess ? (
                                        <WineEvolutionTab wineId={details.id} />
                                    ) : (
                                        <PremiumFeature onGetPremiumPress={onGetPremiumPress} />
                                    )
                                ) : null}
                            </ScrollView>
                        </View>
                        <View
                            collapsable={false}
                            pointerEvents={isPurchaseActive ? 'auto' : 'none'}
                            style={[styles.tabContainer, isPurchaseActive ? null : styles.hiddenTabContainer]}
                        >
                            <WineMarketplaceTab
                                wineDetails={details}
                                isAllVintagesSelected={isAllVintagesSelected}
                                hasSelectedVintageData={hasSelectedVintageData}
                                isVintageChanging={isVintageChanging}
                                isActive={isPurchaseActive}
                                headerComponent={
                                    <WineDetailsScrollableHeader
                                        details={details}
                                        vintages={vintages}
                                        onVintageChange={onVintageChange}
                                        onFavoritePress={onOpen}
                                        hasCurrentVintageData={hasCurrentVintageData}
                                        isAllVintagesSelected={isAllVintagesSelected}
                                        fromScanner={fromScanner}
                                        isResultHeaderFooterVisible={isResultHeaderFooterVisible}
                                        showTastingAuthor={showTastingAuthor}
                                        hasPremiumContentAccess={hasPremiumContentAccess}
                                        onWineImagePress={onWineImagePress}
                                        isProfileActive={isProfileActive}
                                        isEvolutionActive={isEvolutionActive}
                                        isPurchaseActive={isPurchaseActive}
                                        onProfilePress={onProfilePress}
                                        onEvolutionPress={onEvolutionPress}
                                        onPurchasePress={onPurchasePress}
                                        compactTabsBottomSpacing
                                    />
                                }
                            />
                        </View>
                    </>
                )}
                {isAddToFavoriteModalVisible && (
                    <AddToFavoriteBottomSheet
                        isVisible={isAddToFavoriteModalVisible}
                        data={favoriteData}
                        onItemPress={onItemPress}
                        onClose={onClose}
                        onSave={onSave}
                        isLoading={isLoading}
                        isSaving={isSaving}
                    />
                )}
                <Gallery title="" {...wineImageGallery} hideHeader hidePreview />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
