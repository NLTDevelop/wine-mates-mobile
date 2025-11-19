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
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { useWineSmell } from '../../presenters/useWineSmell';
import { SearchBar } from '@/UIKit/SearchBar';
import { SelectedItemsList } from '../components/SelectedItemsList';
import { SmellGroupSelector } from '../components/SmellGroupSelector';
import { ISmellSubgroup } from '@/entities/wine/types/IWineSmell';
import { SmellListItem } from '../components/SmellListItem';
import { CustomInput } from '@/UIKit/CustomInput';
import { useAddItem } from '../../presenters/useAddItem';
import { AddButton } from '../components/AddButton';

export const WineSmellView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, selected, isError, getSmells, isLoading, search, setSearch, isOpened, onItemPress, toggleList,
        selectedIndex, handleLeftPress, handleRightPress, handleAddCustomSmell } = useWineSmell();
    const { text, setText, handleAddPress } = useAddItem(handleAddCustomSmell);

    const keyExtractor = useCallback((item: ISmellSubgroup, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: ISmellSubgroup }) => <SmellListItem item={item} onPress={() => onItemPress(item)} />,
    [onItemPress]);

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
                                onChangeText={setSearch}
                                placeholder={t('common.search')}
                                containerStyle={styles.searchContainer}
                            />
                            <SmellGroupSelector
                                data={selected}
                                isOpened={isOpened}
                                onPress={toggleList}
                                handleLeftPress={handleLeftPress}
                                handleRightPress={handleRightPress}
                            />
                            {isOpened && (
                                <FlatList
                                    data={data[selectedIndex].subgroups}
                                    keyExtractor={keyExtractor}
                                    renderItem={renderItem}
                                    style={styles.list}
                                    contentContainerStyle={styles.contentContainer}
                                />
                            )}
                            <CustomInput
                                value={text}
                                onChangeText={setText}
                                maxLength={40}
                                placeholder={t('authentication.confirmNewPassword')}
                                RightAccessory={<AddButton onPress={handleAddPress}/>}
                                containerStyle={styles.input}
                            />
                            <SelectedItemsList data={selected} onPress={() => {}} />
                            <SelectedParameters />
                        </View>
                        <Button
                            text={t('wine.letsSmell')}
                            onPress={() => {}}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                        />
                    </View>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
