import { useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SearchBar } from '@/UIKit/SearchBar';
import { DropdownButton } from '@/UIKit/DropdownButton';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
// import { PlusIcon } from '@assets/icons/PlusIcon';
import { useAddWineSetView } from './presenters/useAddWineSetView';
import { getStyles } from './styles';
import { WineSetItemRow } from './components/WineSetItemRow';
import { RepeatRuleModal } from './components/RepeatRuleModal';
import { EventCreatedAlert } from './components/EventCreatedAlert';
import { IWineSetViewItem } from '@/modules/event/types/IWineSetMockItem';

export const AddWineSetView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        searchQuery,
        repeatRule,
        repeatRuleLabel,
        repeatRuleItems,
        wineSetViewItems,
        isRepeatModalVisible,
        isEventCreatedAlertVisible,
        isCreating,
        onChangeSearchQuery,
        onOpenRepeatModal,
        onCloseRepeatModal,
        onCloseEventCreatedAlert,
        onCheckEventPress,
        onShareQrPress,
        // onAddWinePress,
        onCreateEventPress,
    } = useAddWineSetView();

    const keyExtractor = (item: IWineSetViewItem) => `${item.id}`;

    const renderWineItem: ListRenderItem<IWineSetViewItem> = function renderWineItem({ item }) {
        return <WineSetItemRow title={item.title} onEditPress={item.onEditPress} />;
    };

    const renderListDivider = function renderListDivider() {
        return <View style={styles.listDivider} />;
    };

    return (
        <>
            <ScreenContainer
                edges={['top']}
                scrollEnabled
                headerComponent={<HeaderWithBackButton title={t('event.listWineEvent')} isCentered />}
            >
                <View style={styles.container}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={onChangeSearchQuery}
                        placeholder={t('common.search')}
                        containerStyle={styles.searchBar}
                    />

                    <DropdownButton title={t('event.wineSet')}>
                        <View style={styles.dropdownContent}>
                            <FlatList
                                data={wineSetViewItems}
                                keyExtractor={keyExtractor}
                                renderItem={renderWineItem}
                                scrollEnabled={false}
                                ItemSeparatorComponent={renderListDivider}
                            />
                        </View>
                    </DropdownButton>
                    {/* <Button
                        text={t('event.addWine')}
                        onPress={onAddWinePress}
                        type="secondary"
                        LeftAccessory={<PlusIcon color={colors.text} width={20} height={20} />}
                    /> */}
                    <View style={styles.divider}/>
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
                        containerStyle={styles.createButton}
                    />
                </View>
            </ScreenContainer>

            <RepeatRuleModal
                visible={isRepeatModalVisible}
                onClose={onCloseRepeatModal}
                items={repeatRuleItems}
                selectedValue={repeatRule}
            />
            <EventCreatedAlert
                visible={isEventCreatedAlertVisible}
                onClose={onCloseEventCreatedAlert}
                onCheckEventPress={onCheckEventPress}
                onShareQrPress={onShareQrPress}
            />
        </>
    );
};
