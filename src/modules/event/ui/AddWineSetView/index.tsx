import { useMemo } from 'react';
import { View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { useAddWineSetView } from './presenters/useAddWineSetView';
import { getStyles } from './styles';
import { WineSetItemRow } from './components/WineSetItemRow';
import { RepeatRuleModal } from './components/RepeatRuleModal';
import { TastingTypeModal } from './components/TastingTypeModal';
import { EventCreatedAlert } from './components/EventCreatedAlert';
import { IWineSetViewItem } from '@/modules/event/types/IWineSetViewItem';
import { WineSetListHeader } from './components/WineSetListHeader';
import { WineSetListFooter } from './components/WineSetListFooter';

export const AddWineSetView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        searchQuery,
        tastingType,
        tastingTypeLabel,
        tastingTypeItems,
        repeatRule,
        repeatRuleLabel,
        repeatRuleItems,
        isTastingTypeModalVisible,
        wineSetViewItems,
        wineSearchResultItems,
        shouldShowScannerButton,
        isSearchListVisible,
        isSearchResultsScrollable,
        maxVisibleSearchResults,
        isRepeatModalVisible,
        isEventCreatedAlertVisible,
        isCreating,
        isCreateEventDisabled,
        searchInputRef,
        onChangeSearchQuery,
        onOpenTastingTypeModal,
        onOpenRepeatModal,
        onCloseTastingTypeModal,
        onCloseRepeatModal,
        onConfirmRepeatRule,
        onConfirmTastingType,
        onCloseEventCreatedAlert,
        onCheckEventPress,
        onShareQrPress,
        onAddWinePress,
        onOpenScannerPress,
        onFocusSearchInput,
        onCloseSearchList,
        onReorderWineSet,
        onCreateEventPress,
    } = useAddWineSetView();

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
                            searchQuery={searchQuery}
                            onChangeSearchQuery={onChangeSearchQuery}
                            wineSearchResultItems={wineSearchResultItems}
                            shouldShowScannerButton={shouldShowScannerButton}
                            maxVisibleSearchResults={maxVisibleSearchResults}
                            tastingTypeLabel={tastingTypeLabel}
                            onOpenScannerPress={onOpenScannerPress}
                            onFocusSearchInput={onFocusSearchInput}
                            onOpenTastingTypeModal={onOpenTastingTypeModal}
                            onCloseSearchList={onCloseSearchList}
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
                    keyboardShouldPersistTaps="handled"
                    ItemSeparatorComponent={renderListDivider}
                    onDragEnd={onReorderWineSet}
                    autoscrollThreshold={180}
                    autoscrollSpeed={200}
                    dragItemOverflow
                    activationDistance={20}
                    animationConfig={{ damping: 20, mass: 0.2, stiffness: 220 }}
                />
            </ScreenContainer>

            {isRepeatModalVisible && (
                <RepeatRuleModal
                    visible={isRepeatModalVisible}
                    onClose={onCloseRepeatModal}
                    items={repeatRuleItems}
                    selectedValue={repeatRule}
                    onConfirm={onConfirmRepeatRule}
                />
            )}
            {isTastingTypeModalVisible && (
                <TastingTypeModal
                    visible={isTastingTypeModalVisible}
                    onClose={onCloseTastingTypeModal}
                    items={tastingTypeItems}
                    selectedValue={tastingType}
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
