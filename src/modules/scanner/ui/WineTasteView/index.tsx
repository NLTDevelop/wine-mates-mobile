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
import { SelectedItemsList } from '../components/SelectedItemsList';
import { SmellListItem } from '../components/SmellListItem';
import { CustomInput } from '@/UIKit/CustomInput';
import { useAddItem } from '../../presenters/useAddItem';
import { AddButton } from '../components/AddButton';
import { useWineTaste } from '../../presenters/useWineTaste';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { wineModel } from '@/entities/wine/WineModel';

export const WineTasteView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, selected, isError, getTastes, isLoading, onItemPress, onSelectedItemPress, handleAddCustomTaste,
        handleNextPress } = useWineTaste();
    const { text, setText, handleAddPress } = useAddItem(handleAddCustomTaste);

    const keyExtractor = useCallback((item: IWineTaste, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IWineTaste }) => (
        <SmellListItem item={item} onPress={() => onItemPress(item)} />
    ), [onItemPress]);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTastes} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.taste')} rightComponent={<CloseButton />} />}
                scrollEnabled
                isKeyboardAvoiding
            >
                {!wineModel.tastes || wineModel.tastes.length === 0 || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <View>
                            <Typography text={t('wine.tasteDescription')} variant="body_400" style={styles.title} />
                            
                            {data.length > 0 && (
                                <FlatList
                                    data={data}  
                                    keyExtractor={keyExtractor}
                                    renderItem={renderItem}
                                    style={styles.list}
                                    contentContainerStyle={styles.contentContainer}
                                    nestedScrollEnabled={true}
                                />
                            )}
                            <CustomInput
                                value={text}
                                onChangeText={setText}
                                maxLength={40}
                                placeholder={t('wine.addCustomTaste')}
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
            </ScreenContainer>
        </WithErrorHandler>
    );
});
