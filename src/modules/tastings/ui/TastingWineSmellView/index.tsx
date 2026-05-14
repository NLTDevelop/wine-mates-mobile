import { useMemo } from 'react';
import { getStyles } from './styles';
import { Keyboard, Pressable, View } from 'react-native';
import { FlatListIndicator } from '@fanchenbao/react-native-scroll-indicator';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { SelectedParameters } from '../../../../UIKit/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { SearchBar } from '@/UIKit/SearchBar';
import { ISmellSubgroup, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { CustomInput } from '@/UIKit/CustomInput';
import { AddButton } from '../components/AddButton';
import { IWineAroma } from '@/entities/wine/types/IWineAroma';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { scaleVertical } from '@/utils';
import { useWineSmellViewPressHandlers } from './presenters/useWineSmellViewPressHandlers';
import { useWineSmellViewContentState } from './presenters/useWineSmellViewContentState';
import { useTastingWineSmell } from './presenters/useTastingWineSmell';
import { SmellGroupSelector } from '@/UIKit/SmellGroupSelector';
import { SmellListItem } from '@/UIKit/SmellListItem';
import { SelectModal } from '@/UIKit/SelectModal';
import { SelectedItemsList } from '@/UIKit/SelectedItemsList';
import { useSelectModal } from '../../presenters/useSelectModal';
import { useAddItem } from '../../presenters/useAddItem';
import { useAnimatedItemAdd } from '../../presenters/useAnimatedItemAdd';
import { useWineSmellSearch } from './presenters/useWineSmellSearch';

export const TastingWineSmellView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isVisible, onShowModal, onHide, selectData, selectedSubgroup, groupId } = useSelectModal();
    const {
        data,
        selected,
        isError,
        getSmells,
        isLoading,
        isOpened,
        onItemPress: originalOnItemPress,
        toggleList,
        onSelectedItemPress,
        visibleSubgroups,
        selectedIndex,
        onLeftPress,
        onRightPress,
        onAddCustomSmell: originalOnAddCustomSmell,
        onNextPress,
        isSaving,
        isSelectedParametersVisible,
        onGroupPress,
        onSubgroupPress,
    } = useTastingWineSmell(onHide);
    const [onItemPress, selectedListRef] = useAnimatedItemAdd(originalOnItemPress);
    const [onAddCustomSmell] = useAnimatedItemAdd(originalOnAddCustomSmell);
    const { text, setText, onAddPress } = useAddItem(onAddCustomSmell);
    const { isSearching, isDebouncing, searchedAromas, search, onSearchTextChange, onSearchItemPress, searchInputRef } =
        useWineSmellSearch({ data, selected, onItemPress, onSelectedItemPress });

    const { shouldShowLoader, shouldShowEmptyState, shouldShowContent } = useWineSmellViewContentState({
        isLoading,
        groupsCount: data.length,
    });

    const { onSubgroupListItemPress, onGroupListItemPress, onSearchListItemPress } = useWineSmellViewPressHandlers({
        data,
        selectedIndex,
        onSubgroupPress,
        onShowModal,
        onGroupPress,
        onSearchItemPress,
    });

    function keyExtractor(item: ISmellSubgroup | IWineAroma | IWineSmell) {
        return item.id.toString();
    }

    function renderItem({ item }: { item: ISmellSubgroup }) {
        return <SmellListItem item={item} onPress={onSubgroupListItemPress(item)} />;
    }

    function renderGroupItem({ item }: { item: IWineSmell }) {
        return <SmellListItem item={item} onPress={onGroupListItemPress(item)} />;
    }

    function renderSearchItem({ item }: { item: IWineAroma }) {
        const isSelected = selected.some(smell => smell.id === item.id);
        return <SmellListItem item={item} onPress={onSearchListItemPress(item)} isSelected={isSelected} />;
    }

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getSmells} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.smell')} />}
            >
                {shouldShowLoader ? (
                    <Loader />
                ) : null}
                {shouldShowEmptyState ? (
                    <View style={styles.container}>
                        <View>
                            <Typography text={t('wine.smellDescription')} variant="body_400" style={styles.title} />
                            <EmptyListView isNothingFound={true} />
                        </View>
                    </View>
                ) : null}
                {shouldShowContent ? (
                    <View style={styles.container}>
                        <KeyboardAwareScrollView
                            style={styles.mainContainer}
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled
                            bottomOffset={scaleVertical(24)}
                            showsVerticalScrollIndicator={false}
                        >
                            <Pressable style={styles.scrollContent} onPress={Keyboard.dismiss}>
                                <Typography text={t('wine.smellDescription')} variant="body_400" style={styles.title} />
                                <SearchBar
                                    ref={searchInputRef}
                                    value={search}
                                    onChangeText={onSearchTextChange}
                                    placeholder={t('common.search')}
                                    containerStyle={styles.searchContainer}
                                />
                                {search ? (
                                    <FlatListIndicator
                                        flatListProps={{
                                            data: searchedAromas,
                                            keyExtractor,
                                            renderItem: renderSearchItem,
                                            style: styles.list,
                                            contentContainerStyle: styles.contentContainer,
                                            nestedScrollEnabled: true,
                                            showsVerticalScrollIndicator: true,
                                            keyboardShouldPersistTaps: 'handled',
                                            keyboardDismissMode: 'interactive',
                                            ListEmptyComponent: (
                                                <EmptyListView
                                                    isLoading={isSearching || isDebouncing}
                                                    isNothingFound={!searchedAromas?.length && !isSearching && !isDebouncing}
                                                />
                                            )
                                        }}
                                        indStyle={styles.indicator}
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
                                                    onLeftPress={onLeftPress}
                                                    onRightPress={onRightPress}
                                                />
                                                {visibleSubgroups.length > 0 && (
                                                    <FlatListIndicator
                                                        flatListProps={{
                                                            data: visibleSubgroups,
                                                            keyExtractor,
                                                            renderItem,
                                                            style: styles.list,
                                                            contentContainerStyle: styles.contentContainer,
                                                            nestedScrollEnabled: true,
                                                            keyboardShouldPersistTaps: 'handled',
                                                            keyboardDismissMode: 'interactive'
                                                        }}
                                                        indStyle={styles.indicator}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <FlatListIndicator
                                                flatListProps={{
                                                    data,
                                                    keyExtractor,
                                                    renderItem: renderGroupItem,
                                                    style: styles.list,
                                                    contentContainerStyle: styles.contentContainer,
                                                    nestedScrollEnabled: true,
                                                    keyboardShouldPersistTaps: 'handled',
                                                    keyboardDismissMode: 'interactive'
                                                }}
                                                indStyle={styles.indicator}
                                            />
                                        )}
                                    </>
                                )}
                                <CustomInput
                                    value={text}
                                    onChangeText={setText}
                                    maxLength={40}
                                    placeholder={t('wine.addCustomSmell')}
                                    RightAccessory={<AddButton onPress={onAddPress} disabled={!text}/>}
                                    containerStyle={styles.input}
                                />
                                {selected.length > 0 && <SelectedItemsList ref={selectedListRef} data={selected} onPress={onSelectedItemPress} />}
                                {isSelectedParametersVisible ? <SelectedParameters /> : null}
                            </Pressable>
                        </KeyboardAwareScrollView>
                        <Button
                            text={t('wine.letsTaste')}
                            onPress={onNextPress}
                            inProgress={isSaving}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                            disabled={!selected.length}
                        />
                    </View>
                ) : null}
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
