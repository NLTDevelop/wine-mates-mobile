import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { IOfferedWineListItem } from '@/entities/wine/types/IOfferedWineListItem';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { WineShareModal } from '@/UIKit/WineShareModal';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';
import { Button } from '@/UIKit/Button';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { useRefresh } from '@/hooks/useRefresh';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WineryWineListItem } from '@/modules/profile/ui/components/WineryWineListItem';
import { WineOfferModal } from '@/modules/profile/ui/components/WineOfferModal';
import { WineSearchBottomSheet } from '@/UIKit/WineSearchBottomSheet';
import { useWineSearch } from '@/UIKit/WineSearchBottomSheet/presenters/useWineSearch';
import { WineSearchModeEnum } from '@/UIKit/WineSearchBottomSheet/enums/WineSearchModeEnum';
import { WINE_LIST_PERFORMANCE_PROPS } from '@/UIKit/WineListItem/constants';
import { useMyWinesForSale } from './presenters/useMyWinesForSale';
import { getStyles } from './styles';

export const MyWinesForSaleView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const wineSearch = useWineSearch(WineSearchModeEnum.OFFER);
    const {
        data,
        isLoading,
        isLoadingMore,
        isError,
        isOfferModalVisible,
        selectedWine,
        selectedOffer,
        listRef,
        wineSearchResultItems,
        wineSearchEmptyText,
        onRefresh,
        onEndReached,
        onPressBack,
        onItemPress,
        onOfferPress,
        onCloseOfferModal,
        onOfferSaved,
        onOfferDeleted,
        onAddWinePress,
        onOpenScannerPress,
    } = useMyWinesForSale({
        searchQuery: wineSearch.searchQuery,
        isSearchListVisible: wineSearch.isSearchListVisible,
        wineSearchResults: wineSearch.wineSearchResults,
        onOpenSearchModal: wineSearch.onOpenSearchModal,
        onReopenSearchModal: wineSearch.onReopenSearchModal,
        onHideSearchModal: wineSearch.onHideSearchModal,
        onResetSearch: wineSearch.onResetSearch,
    });
    const { refreshControl } = useRefresh(onRefresh);
    const { isShareModalVisible, onOpenShareModal, onCloseShareModal, onShareMessengerPress, onCopyWineLinkPress } =
        useWineShareModal();

    const keyExtractor = useCallback((item: IOfferedWineListItem) => item.id.toString(), []);
    const renderItem = useCallback<ListRenderItem<IOfferedWineListItem>>(({ item }) => {
        return (
            <WineryWineListItem
                item={item}
                offer={item.offer}
                onPress={onItemPress}
                onSharePress={onOpenShareModal}
                onOfferPress={onOfferPress}
            />
        );
    }, [onItemPress, onOfferPress, onOpenShareModal]);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={onRefresh}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={
                    <HeaderWithBackButton title={t('profile.myWinesForSale')} onPressBack={onPressBack} isCentered />
                }
            >
                <FlatList
                    {...WINE_LIST_PERFORMANCE_PROPS}
                    ref={listRef}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    refreshControl={refreshControl}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.4}
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
                    ListEmptyComponent={
                        <EmptyListView
                            isLoading={isLoading}
                            image={<EmptyWineListIcon />}
                            text={t('profile.noWinesForSale')}
                        />
                    }
                />
                <View style={styles.actions}>
                    <Button
                        text={t('profile.addWineForSale')}
                        onPress={onAddWinePress}
                        LeftAccessory={
                            <View style={styles.plusIconContainer}>
                                <PlusIcon />
                            </View>
                        }
                    />
                </View>
                <WineShareModal
                    visible={isShareModalVisible}
                    onClose={onCloseShareModal}
                    onShareMessengerPress={onShareMessengerPress}
                    onCopyLinkPress={onCopyWineLinkPress}
                />
                <WineSearchBottomSheet
                    visible={wineSearch.isSearchModalVisible}
                    title={t('event.addWine')}
                    scannerButtonText={t('event.searchWineWithScanner')}
                    searchInputRef={wineSearch.searchInputRef}
                    value={wineSearch.searchQuery}
                    data={wineSearchResultItems}
                    isLoading={wineSearch.isSearchingWines}
                    emptyText={wineSearchEmptyText}
                    onChangeText={wineSearch.onChangeSearchQuery}
                    onOpenScannerPress={onOpenScannerPress}
                    onClose={wineSearch.onCloseSearchModal}
                    onLoadMore={wineSearch.onLoadMoreSearchResults}
                />
                {isOfferModalVisible ? (
                    <WineOfferModal
                        visible
                        wine={selectedWine}
                        offer={selectedOffer}
                        onClose={onCloseOfferModal}
                        onSaved={onOfferSaved}
                        onDeleted={onOfferDeleted}
                        isWinery={false}
                    />
                ) : null}
            </ScreenContainer>
        </WithErrorHandler>
    );
};
