import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
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
        isError,
        onRefresh,
        onEndReached,
        onPressBack,
        onItemPress,
        onAddWinePress,
        onImportCsvPress,
        onShowCsvImportAlert,
        onHideCsvImportAlert,
        onDownloadCsvTemplatePress,
    } = useMyWineryWines();
    const { refreshControl } = useRefresh(onRefresh);
    const { isShareModalVisible, onOpenShareModal, onCloseShareModal, onShareMessengerPress, onCopyWineLinkPress } =
        useWineShareModal();

    const keyExtractor = useCallback((item: IWineListItem) => item.id.toString(), []);

    const renderItem = useCallback<ListRenderItem<IWineListItem>>(
        ({ item }) => {
            return <WineryWineListItem item={item} onPress={onItemPress} onSharePress={onOpenShareModal} />;
        },
        [onItemPress, onOpenShareModal],
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
                <FlatList
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
            </ScreenContainer>
        </WithErrorHandler>
    );
});

MyWineryWinesView.displayName = 'MyWineryWinesView';
