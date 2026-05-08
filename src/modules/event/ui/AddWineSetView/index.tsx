import { useMemo } from 'react';
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
import { useRepeatRuleModal } from './presenters/useRepeatRuleModal';
import { useTastingTypeModal } from './presenters/useTastingTypeModal';
import { useWineSetSortableList } from './presenters/useWineSetSortableList';

export const AddWineSetView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        searchInputRef,
        searchTouchAreaRef,
        searchQuery,
        isSearchListVisible,
        isSearchingWines,
        isInitialSearchFinished,
        wineSearchResults,
        onChangeSearchQuery,
        onFocusSearchInput,
        onLoadMoreSearchResults,
        onResetSearch,
        onPressOutsideSearch,
    } = useAddWineSetSearch();

    const {
        tastingType,
        repeatRule,
        wineSetViewItems,
        wineSearchResultItems,
        shouldShowScannerButton,
        isSearchResultsScrollable,
        maxVisibleSearchResults,
        isEventCreatedAlertVisible,
        isCreating,
        isCreateEventDisabled,
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
        searchInputRef,
        searchQuery,
        isSearchListVisible,
        isSearchingWines,
        isInitialSearchFinished,
        wineSearchResults,
        onResetSearch,
    });

    const {
        isVisible: isRepeatModalVisible,
        draft: repeatRuleDraft,
        selectedText: repeatRuleLabel,
        items: repeatRuleItems,
        onOpen: onOpenRepeatModal,
        onClose: onCloseRepeatModal,
        onConfirm: onConfirmRepeatRule,
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

    const renderWineItem: SortableGridRenderItem<IWineSetViewItem> = function renderWineItem({ item }) {
        return <WineSetItemRow title={item.title} onEditPress={item.onEditPress} />;
    };

    return (
        <>
            <View style={styles.screen} onStartShouldSetResponderCapture={onPressOutsideSearch}>
                <ScreenContainer
                    edges={['top', 'bottom']}
                    scrollEnabled={false}
                    headerComponent={<HeaderWithBackButton title={t('event.listWineEvent')} isCentered />}
                >
                    <Sortable.PortalProvider>
                        <Animated.ScrollView
                            ref={scrollableRef}
                            contentContainerStyle={styles.container}
                            keyboardShouldPersistTaps="always"
                            nestedScrollEnabled
                            scrollEnabled={!isSearchListVisible || !isSearchResultsScrollable}
                            showsVerticalScrollIndicator={false}
                            style={styles.scroll}
                            onScrollBeginDrag={onDismissKeyboard}
                        >
                            <WineSetListHeader
                                searchInputRef={searchInputRef}
                                searchTouchAreaRef={searchTouchAreaRef}
                                searchQuery={searchQuery}
                                isSearchingWines={isSearchingWines}
                                onChangeSearchQuery={onChangeSearchQuery}
                                wineSearchResultItems={wineSearchResultItems}
                                shouldShowScannerButton={shouldShowScannerButton}
                                maxVisibleSearchResults={maxVisibleSearchResults}
                                tastingTypeLabel={tastingTypeLabel}
                                onOpenScannerPress={onOpenScannerPress}
                                onFocusSearchInput={onFocusSearchInput}
                                onOpenTastingTypeModal={onOpenTastingTypeModal}
                                onLoadMoreSearchResults={onLoadMoreSearchResults}
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
                                isCreating={isCreating}
                                isCreateEventDisabled={isCreateEventDisabled}
                                onAddWinePress={onAddWinePress}
                                onOpenRepeatModal={onOpenRepeatModal}
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
            {isTastingTypeModalVisible && (
                <TastingTypeModal
                    visible={isTastingTypeModalVisible}
                    onClose={onCloseTastingTypeModal}
                    items={tastingTypeItems}
                    selectedValue={tastingTypeDraft}
                    onConfirm={onConfirmTastingType}
                />
            )}
            <EventCreatedAlert
                visible={isEventCreatedAlertVisible}
                onClose={onCloseEventCreatedAlert}
                onCheckEventPress={onCheckEventPress}
                onShareQrPress={onShareQrPress}
            />
        </>
    );
};
