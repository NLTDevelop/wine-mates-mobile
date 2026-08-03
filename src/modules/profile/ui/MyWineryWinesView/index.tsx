import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { IWineryLinkedWine } from '@/entities/winery/types/IWineryLinkedWine';
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
import { AddFileIcon } from '@assets/icons/AddFileIcon';
import { CsvImportAlert } from './components/CsvImportAlert';
import { WineryWineListItem } from '@/modules/profile/ui/components/WineryWineListItem';
import { useMyWineryWines } from './presenters/useMyWineryWines';
import { getStyles } from './styles';
import { WineListSearchBar } from '@/modules/profile/ui/components/WineListSearchBar';
import { WINE_LIST_PERFORMANCE_PROPS } from '@/UIKit/WineListItem/constants';
import { WineOfferModal } from '../components/WineOfferModal';

export const MyWineryWinesView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        data,
        isLoading,
        isLoadingMore,
        isImporting,
        isTemplateDownloading,
        isCsvImportAlertVisible,
        isOfferModalVisible,
        isError,
        selectedWine,
        selectedOffer,
        listRef,
        onRefresh,
        onEndReached,
        onSearch,
        scrollToTop,
        onPressBack,
        onItemPress,
        onAddWinePress,
        onOfferPress,
        onCloseOfferModal,
        onOfferSaved,
        onOfferDeleted,
        onImportCsvPress,
        onShowCsvImportAlert,
        onHideCsvImportAlert,
        onDownloadCsvTemplatePress,
    } = useMyWineryWines();
    const { refreshControl } = useRefresh(onRefresh);
    const { isShareModalVisible, onOpenShareModal, onCloseShareModal, onShareMessengerPress, onCopyWineLinkPress } =
        useWineShareModal();

    const keyExtractor = useCallback((item: IWineryLinkedWine) => item.id.toString(), []);

    const renderItem = useCallback<ListRenderItem<IWineryLinkedWine>>(
        ({ item }) => {
            return (
                <WineryWineListItem
                    item={item}
                    offer={item.offer}
                    onPress={onItemPress}
                    onSharePress={onOpenShareModal}
                    onOfferPress={onOfferPress}
                />
            );
        },
        [onItemPress, onOfferPress, onOpenShareModal],
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={onRefresh}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={
                    <HeaderWithBackButton
                        title={t('profile.myWineryWines')}
                        onPressBack={onPressBack}
                        isCentered
                    />
                }
            >
                <View style={styles.searchContainer}>
                    <WineListSearchBar onSearch={onSearch} scrollToTop={scrollToTop} />
                </View>
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
                            text={t('profile.noWineryWines')}
                        />
                    }
                />
                <View style={styles.actions}>
                    <Button
                        text={t('profile.importWinesCsv')}
                        onPress={onShowCsvImportAlert}
                        type="secondary"
                        inProgress={isImporting}
                        LeftAccessory={<AddFileIcon color={colors.primary} />}
                    />
                    <Button
                        text={t('profile.addWineToWinery')}
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
                <CsvImportAlert
                    visible={isCsvImportAlertVisible}
                    isImporting={isImporting}
                    isTemplateDownloading={isTemplateDownloading}
                    onClose={onHideCsvImportAlert}
                    onUploadPress={onImportCsvPress}
                    onDownloadTemplatePress={onDownloadCsvTemplatePress}
                />
                {isOfferModalVisible ? (
                    <WineOfferModal
                        visible
                        wine={selectedWine}
                        offer={selectedOffer}
                        onClose={onCloseOfferModal}
                        onSaved={onOfferSaved}
                        onDeleted={onOfferDeleted}
                        isWinery={true}
                    />
                ) : null}
            </ScreenContainer>
        </WithErrorHandler>
    );
});

MyWineryWinesView.displayName = 'MyWineryWinesView';
