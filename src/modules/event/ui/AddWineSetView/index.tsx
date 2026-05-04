import { useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SearchBar } from '@/UIKit/SearchBar';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { useAddWineSetView } from './presenters/useAddWineSetView';
import { getStyles } from './styles';
import { WineSetItemRow } from './components/WineSetItemRow';
import { RepeatRuleModal } from './components/RepeatRuleModal';
import { TastingTypeModal } from './components/TastingTypeModal';
import { EventCreatedAlert } from './components/EventCreatedAlert';
import { WineSearchResultRow } from './components/WineSearchResultRow';
import { IWineSearchResultViewItem, IWineSetViewItem } from '@/modules/event/types/IWineSetViewItem';

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
        onCreateEventPress,
    } = useAddWineSetView();

    const keyExtractor = (item: IWineSetViewItem) => `${item.id}`;
    const searchResultKeyExtractor = (item: IWineSearchResultViewItem) => `${item.id}`;

    const renderWineItem: ListRenderItem<IWineSetViewItem> = function renderWineItem({ item }) {
        return <WineSetItemRow title={item.title} onEditPress={item.onEditPress} />;
    };

    const renderWineSearchResult: ListRenderItem<IWineSearchResultViewItem> = function renderWineSearchResult({ item }) {
        return <WineSearchResultRow title={item.title} subtitle={item.subtitle} onPress={item.onPress} />;
    };

    const renderListDivider = function renderListDivider() {
        return <View style={styles.listDivider} />;
    };

    const renderSearchResultDivider = function renderSearchResultDivider() {
        return <View style={styles.searchResultDivider} />;
    };

    return (
        <>
            <ScreenContainer
                edges={['top', 'bottom']}
                scrollEnabled
                headerComponent={<HeaderWithBackButton title={t('event.listWineEvent')} isCentered />}
            >
                <View style={styles.container}>
                    <SearchBar
                        ref={searchInputRef}
                        value={searchQuery}
                        onChangeText={onChangeSearchQuery}
                        placeholder={t('common.search')}
                        containerStyle={styles.searchBar}
                    />
                    {(wineSearchResultItems.length > 0 || shouldShowScannerButton) && (
                        <View style={styles.searchResultsContainer}>
                            {wineSearchResultItems.length > 0 ? (
                                <FlatList
                                    data={wineSearchResultItems}
                                    keyExtractor={searchResultKeyExtractor}
                                    renderItem={renderWineSearchResult}
                                    scrollEnabled={wineSearchResultItems.length > maxVisibleSearchResults}
                                    nestedScrollEnabled
                                    keyboardShouldPersistTaps="always"
                                    ItemSeparatorComponent={renderSearchResultDivider}
                                    style={styles.searchResultsList}
                                />
                            ) : (
                                <View style={styles.emptySearchContainer}>
                                    <Typography
                                        variant="body_400"
                                        text={t('common.nothingFoundTitle')}
                                        style={styles.emptySearchText}
                                    />
                                    <Button
                                        text={t('event.searchWineWithScanner')}
                                        onPress={onOpenScannerPress}
                                        type="secondary"
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    <TouchableOpacity style={styles.tastingTypeButton} onPress={onOpenTastingTypeModal}>
                        <Typography variant="h6" text={tastingTypeLabel} style={styles.tastingTypeButtonText} />
                        <ArrowDownIcon />
                    </TouchableOpacity>

                    <View style={styles.dropdownContent}>
                        <FlatList
                            data={wineSetViewItems}
                            keyExtractor={keyExtractor}
                            renderItem={renderWineItem}
                            scrollEnabled={false}
                            ItemSeparatorComponent={renderListDivider}
                        />
                    </View>

                    <Button
                        text={t('event.addWine')}
                        onPress={onAddWinePress}
                        type="secondary"
                        LeftAccessory={<PlusIcon color={colors.text} width={20} height={20} />}
                    />
                    <View style={styles.divider} />
                    <View style={styles.repeatRow}>
                        <Typography variant="h6" text={`${t('event.repeat')}:`} style={styles.repeatLabel} />
                        <TouchableOpacity style={styles.repeatButton} onPress={onOpenRepeatModal}>
                            <Typography variant="h6" text={repeatRuleLabel} style={styles.repeatButtonText} />
                            <ArrowDownIcon />
                        </TouchableOpacity>
                    </View>

                    <Button
                        text={t('event.createEvent')}
                        type="main"
                        onPress={onCreateEventPress}
                        inProgress={isCreating}
                        disabled={isCreateEventDisabled}
                        containerStyle={styles.createButton}
                    />
                </View>
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
