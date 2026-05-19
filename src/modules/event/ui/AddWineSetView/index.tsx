import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Sortable, { SortableGridRenderItem } from 'react-native-sortables';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { useAddWineSetView } from './presenters/useAddWineSetView';
import { useAddWineSetSearch } from './presenters/useAddWineSetSearch';
import { getStyles } from './styles';
import { WineSetItemRow } from './components/WineSetItemRow';
import { RepeatRuleModal } from './components/RepeatRuleModal';
import { TastingTypeModal } from './components/TastingTypeModal';
import { EventCreatedAlert } from './components/EventCreatedAlert';
import { IWineSetViewItem } from '@/modules/event/types/IWineSetViewItem';
import { WineSetListHeader } from './components/WineSetListHeader';
import { WineSetListFooter } from './components/WineSetListFooter';
import { WineSearchBottomSheet } from './components/WineSearchBottomSheet';
import { useRepeatRuleModal } from './presenters/useRepeatRuleModal';
import { useTastingTypeModal } from './presenters/useTastingTypeModal';
import { useWineSetSortableList } from './presenters/useWineSetSortableList';
import { CustomRepeatEventModal } from './components/CustomRepeatEventModal';

export const AddWineSetView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        searchInputRef,
        searchModalRef,
        searchQuery,
        isSearchListVisible,
        isSearchingWines,
        isInitialSearchFinished,
        hasMoreSearchResults,
        wineSearchResults,
        onChangeSearchQuery,
        onOpenSearchModal,
        onCloseSearchModal,
        onDismissSearchModal,
        onLoadMoreSearchResults,
        onResetSearch,
    } = useAddWineSetSearch();

    const {
        tastingType,
        repeatRule,
        wineSetViewItems,
        wineSearchResultItems,
        shouldShowScannerButton,
        wineSearchEmptyText,
        isEventCreatedAlertVisible,
        eventDeepLink,
        isCreating,
        isCreateEventDisabled,
        isEditMode,
        headerTitleKey,
        onChangeRepeatRule,
        onChangeTastingType,
        onCloseEventCreatedAlert,
        onCheckEventPress,
        onShareQrPress,
        onAddWinePress,
        onOpenScannerPress,
        onReorderWineSet,
        onCreateEventPress,
    } = useAddWineSetView({
        searchQuery,
        isSearchListVisible,
        isSearchingWines,
        isInitialSearchFinished,
        hasMoreSearchResults,
        wineSearchResults,
        onResetSearch,
        onOpenSearchModal,
        onLoadMoreSearchResults,
    });

    const {
        isVisible: isRepeatModalVisible,
        draft: repeatRuleDraft,
        selectedText: repeatRuleLabel,
        items: repeatRuleItems,
        isRepeatEnabled,
        onOpen: onOpenRepeatModal,
        onClose: onCloseRepeatModal,
        onConfirm: onConfirmRepeatRule,
        onChangeSwitch: onChangeRepeatSwitch,
        isCustomRepeatVisible,
        onCloseCustomRepeat,
        onConfirmCustomRepeat,
    } = useRepeatRuleModal({
        value: repeatRule,
        onChange: onChangeRepeatRule,
    });

    const {
        isVisible: isTastingTypeModalVisible,
        draft: tastingTypeDraft,
        selectedText: tastingTypeLabel,
        items: tastingTypeItems,
        onOpen: onOpenTastingTypeModal,
        onClose: onCloseTastingTypeModal,
        onConfirm: onConfirmTastingType,
    } = useTastingTypeModal({
        value: tastingType,
        onChange: onChangeTastingType,
    });
    const {
        autoScrollActivationOffset,
        autoScrollMaxVelocity,
        dragActivationDelay,
        onDismissKeyboard,
        rowGap,
        scrollableRef,
    } = useWineSetSortableList();
    const keyExtractor = (item: IWineSetViewItem) => `${item.id}`;

    const renderWineItem: SortableGridRenderItem<IWineSetViewItem> = useCallback(({ item }) => {
        return <WineSetItemRow title={item.title} onEditPress={item.onEditPress} onDeletePress={item.onDeletePress} />;
    }, []);

    return (
        <>
            <View style={styles.screen}>
                <ScreenContainer
                    edges={['top', 'bottom']}
                    scrollEnabled={false}
                    headerComponent={<HeaderWithBackButton title={t(headerTitleKey)} isCentered />}
                >
                    <Sortable.PortalProvider>
                        <Animated.ScrollView
                            ref={scrollableRef}
                            contentContainerStyle={styles.container}
                            keyboardShouldPersistTaps="always"
                            nestedScrollEnabled
                            showsVerticalScrollIndicator={false}
                            style={styles.scroll}
                            onScrollBeginDrag={onDismissKeyboard}
                        >
                            <WineSetListHeader
                                tastingTypeLabel={tastingTypeLabel}
                                onOpenSearchModal={onOpenSearchModal}
                                onOpenTastingTypeModal={onOpenTastingTypeModal}
                            />
                            <View onTouchStart={onDismissKeyboard}>
                                <Sortable.Grid
                                    activeItemOpacity={0.96}
                                    activeItemScale={1.02}
                                    activeItemShadowOpacity={0.28}
                                    autoScrollActivationOffset={autoScrollActivationOffset}
                                    autoScrollMaxVelocity={autoScrollMaxVelocity}
                                    columns={1}
                                    data={wineSetViewItems}
                                    dimensionsAnimationType="none"
                                    dragActivationDelay={dragActivationDelay}
                                    inactiveItemOpacity={0.78}
                                    inactiveItemScale={1}
                                    itemEntering={null}
                                    itemExiting={null}
                                    itemsLayoutTransitionMode="reorder"
                                    keyExtractor={keyExtractor}
                                    overDrag="vertical"
                                    renderItem={renderWineItem}
                                    reorderTriggerOrigin="touch"
                                    rowGap={rowGap}
                                    scrollableRef={scrollableRef}
                                    onDragStart={onDismissKeyboard}
                                    onDragEnd={onReorderWineSet}
                                />
                            </View>
                            <WineSetListFooter
                                repeatRuleLabel={repeatRuleLabel}
                                isRepeatEnabled={isRepeatEnabled}
                                isCreating={isCreating}
                                isCreateEventDisabled={isCreateEventDisabled}
                                isEditMode={isEditMode}
                                onAddWinePress={onAddWinePress}
                                onOpenRepeatModal={onOpenRepeatModal}
                                onChangeRepeatSwitch={onChangeRepeatSwitch}
                                onCreateEventPress={onCreateEventPress}
                            />
                        </Animated.ScrollView>
                    </Sortable.PortalProvider>
                </ScreenContainer>
            </View>

            {isRepeatModalVisible && (
                <RepeatRuleModal
                    visible={isRepeatModalVisible}
                    onClose={onCloseRepeatModal}
                    items={repeatRuleItems}
                    selectedValue={repeatRuleDraft}
                    onConfirm={onConfirmRepeatRule}
                />
            )}
            {isCustomRepeatVisible && (
                <CustomRepeatEventModal
                    visible={isCustomRepeatVisible}
                    onClose={onCloseCustomRepeat}
                    onConfirm={onConfirmCustomRepeat}
                />
            )}
            {isTastingTypeModalVisible && (
                <TastingTypeModal
                    visible={isTastingTypeModalVisible}
                    onClose={onCloseTastingTypeModal}
                    items={tastingTypeItems}
                    selectedValue={tastingTypeDraft}
                    onConfirm={onConfirmTastingType}
                />
            )}
            <WineSearchBottomSheet
                modalRef={searchModalRef}
                searchInputRef={searchInputRef}
                value={searchQuery}
                data={wineSearchResultItems}
                isLoading={isSearchingWines}
                emptyText={wineSearchEmptyText}
                shouldShowScannerButton={shouldShowScannerButton}
                onChangeText={onChangeSearchQuery}
                onClose={onCloseSearchModal}
                onDismiss={onDismissSearchModal}
                onLoadMore={onLoadMoreSearchResults}
                onOpenScannerPress={onOpenScannerPress}
            />
            <EventCreatedAlert
                visible={isEventCreatedAlertVisible}
                qrCodeValue={eventDeepLink}
                onClose={onCloseEventCreatedAlert}
                onCheckEventPress={onCheckEventPress}
                onShareQrPress={onShareQrPress}
            />
        </>
    );
};
