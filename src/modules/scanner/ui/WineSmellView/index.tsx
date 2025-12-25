import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { CloseButton } from '../components/CloseButton';
import { SelectedParameters } from '../components/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { useWineSmell } from '../../presenters/useWineSmell';
import { SearchBar } from '@/UIKit/SearchBar';
import { SelectedItemsList } from '../components/SelectedItemsList';
import { SmellGroupSelector } from '../components/SmellGroupSelector';
import { ISmellSubgroup, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { SmellListItem } from '../components/SmellListItem';
import { CustomInput } from '@/UIKit/CustomInput';
import { useAddItem } from '../../presenters/useAddItem';
import { AddButton } from '../components/AddButton';
import { useSelectModal } from '../../presenters/useSelectModal';
import { SelectModal } from '../components/SelectModal';
import { IWineAroma } from '@/entities/wine/types/IWineAroma';
import { useWineSmellSearch } from '../../presenters/useWineSmellSearch';
import { EmptyListView } from '@/UIKit/EmptyListView';

export const WineSmellView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isVisible, onShowModal, onHide, selectData, selectedSubgroup, groupId } = useSelectModal();
    const { data, selected, isError, getSmells, isLoading, isOpened, onItemPress, toggleList, onSelectedItemPress, visibleSubgroups,
        selectedIndex, handleLeftPress, handleRightPress, handleAddCustomSmell, handleNextPress, handleGroupPress } = useWineSmell(onHide);
    const { text, setText, handleAddPress } = useAddItem(handleAddCustomSmell);
    const { isSearching, searchedAromas, search, onSearchTextChange, onSearchItemPress } = useWineSmellSearch({
        data, selected, onItemPress, onSelectedItemPress });
    
    const visibleGroups = useMemo(
        () => data.filter(group => group.subgroups.some(subgroup => subgroup.aromas.length > 0)),
        [data],
    );
    const keyExtractor = useCallback((item: ISmellSubgroup | IWineAroma | IWineSmell) => item.id.toString(), []);
    const renderItem = useCallback(({ item }: { item: ISmellSubgroup }) => (
        <SmellListItem item={item} onPress={() => onShowModal(data[selectedIndex].id, item)} />
    ), [data, onShowModal, selectedIndex]);
    const renderGroupItem = useCallback(({ item }: { item: IWineSmell }) => (
        <SmellListItem item={item} onPress={() => handleGroupPress(item.id)} />
    ), [handleGroupPress]);

    const renderSearchItem = useCallback(({ item }: { item: IWineAroma }) => {
        const isSelected = selected.some(smell => smell.id === item.id);
        return <SmellListItem item={item} onPress={() => onSearchItemPress(item)} isSelected={isSelected} />;
    }, [onSearchItemPress, selected]);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getSmells} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.smell')} rightComponent={<CloseButton />} />}
                scrollEnabled
                isKeyboardAvoiding
            >
                {!data || data.length === 0 || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <View>
                            <Typography text={t('wine.smellDescription')} variant="body_400" style={styles.title} />
                            <SearchBar
                                value={search}
                                onChangeText={onSearchTextChange}
                                placeholder={t('common.search')}
                                containerStyle={styles.searchContainer}
                            />
                            {search ? (
                                <FlatList
                                    data={searchedAromas}
                                    keyExtractor={keyExtractor}
                                    renderItem={renderSearchItem}
                                    style={styles.list}
                                    contentContainerStyle={styles.contentContainer}
                                    nestedScrollEnabled={true}
                                    ListEmptyComponent={
                                        <EmptyListView
                                            isLoading={isSearching}
                                            isNothingFound={!searchedAromas?.length}
                                        />
                                    }
                                />
                            ) : (
                                <>
                                    {isOpened ? (
                                        <>
                                            <SmellGroupSelector
                                                data={data}
                                                isOpened={isOpened}
                                                selectedIndex={selectedIndex}
                                                onPress={toggleList}
                                                handleLeftPress={handleLeftPress}
                                                handleRightPress={handleRightPress}
                                            />
                                            {visibleSubgroups.length > 0 && (
                                                <FlatList
                                                    data={visibleSubgroups}
                                                    keyExtractor={keyExtractor}
                                                    renderItem={renderItem}
                                                    style={styles.list}
                                                    contentContainerStyle={styles.contentContainer}
                                                    nestedScrollEnabled
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <FlatList
                                            data={visibleGroups}
                                            keyExtractor={keyExtractor}
                                            renderItem={renderGroupItem}
                                            style={styles.list}
                                            contentContainerStyle={styles.contentContainer}
                                            nestedScrollEnabled
                                        />
                                    )}
                                </>
                            )}
                            <CustomInput
                                value={text}
                                onChangeText={setText}
                                maxLength={40}
                                placeholder={t('wine.addCustomSmell')}
                                RightAccessory={<AddButton onPress={handleAddPress} disabled={!text}/>}
                                containerStyle={styles.input}
                            />
                            {selected.length > 0 && <SelectedItemsList data={selected} onPress={onSelectedItemPress} />}
                            <SelectedParameters />
                        </View>
                        <Button
                            text={t('wine.letsTaste')}
                            onPress={handleNextPress}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                            disabled={!selected.length}
                        />
                    </View>
                )}
                <SelectModal
                    isVisible={isVisible}
                    onHide={onHide}
                    onItemPress={onItemPress}
                    data={selectData}
                    subgroupId={selectedSubgroup?.id ?? null}
                    groupId={groupId}
                />
            </ScreenContainer>
        </WithErrorHandler>
    );
});
