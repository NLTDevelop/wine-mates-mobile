import { useMemo } from 'react';
import { View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
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

    const keyExtractor = (item: IWineSetViewItem) => `${item.id}`;

    const renderWineItem = function renderWineItem({ item, drag, isActive }: RenderItemParams<IWineSetViewItem>) {
        return (
            <ScaleDecorator activeScale={1.02}>
                <WineSetItemRow title={item.title} onEditPress={item.onEditPress} onDragPress={drag} isActive={isActive} />
            </ScaleDecorator>
        );
    };

    const renderListDivider = function renderListDivider() {
        return <View style={styles.listDivider} />;
    };

    return (
        <>
            <View style={styles.screen} onStartShouldSetResponderCapture={onPressOutsideSearch}>
                <ScreenContainer
                    edges={['top', 'bottom']}
                    scrollEnabled={false}
                    headerComponent={<HeaderWithBackButton title={t('event.listWineEvent')} isCentered />}
                >
                    <DraggableFlatList
                        data={wineSetViewItems}
                        keyExtractor={keyExtractor}
                        renderItem={renderWineItem}
                        ListHeaderComponent={
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
                        }
                        ListFooterComponent={
                            <WineSetListFooter
                                repeatRuleLabel={repeatRuleLabel}
                                isCreating={isCreating}
                                isCreateEventDisabled={isCreateEventDisabled}
                                onAddWinePress={onAddWinePress}
                                onOpenRepeatModal={onOpenRepeatModal}
                                onCreateEventPress={onCreateEventPress}
                            />
                        }
                        contentContainerStyle={styles.container}
                        scrollEnabled={!isSearchListVisible || !isSearchResultsScrollable}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="always"
                        ItemSeparatorComponent={renderListDivider}
                        onDragEnd={onReorderWineSet}
                        autoscrollThreshold={180}
                        autoscrollSpeed={200}
                        dragItemOverflow
                        activationDistance={20}
                        animationConfig={{ damping: 20, mass: 0.2, stiffness: 220 }}
                    />
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
