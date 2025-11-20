import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { CloseButton } from '../components/CloseButton';
import { SelectedParameters } from '../components/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@/assets/icons/NextLongArrowIcon';
import { useWineTasteCharacteristics } from '../../presenters/useWineTasteCharacteristics';
import { IWineTasteCharacteristics } from '@/entities/wine/types/IWineTasteCharacteristics';
import { TasteCharacteristicItem } from '../components/TasteCharacteristicItem';

export const WineTasteCharacteristicsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isError, getTasteCharacteristics, isLoading, handleNextPress } = useWineTasteCharacteristics();

    const keyExtractor = useCallback((item: IWineTasteCharacteristics, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IWineTasteCharacteristics }) => (
            <TasteCharacteristicItem item={item} onChange={() => {}} />
        ),
    []);

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTasteCharacteristics} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.tasteCharacteristics')} rightComponent={<CloseButton />} />}
                scrollEnabled
                isKeyboardAvoiding
            >
                {!data|| data.length === 0 || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <View>
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
                            <SelectedParameters />
                        </View>
                        <Button
                            text={t('wine.letsTaste')}
                            onPress={handleNextPress}
                            containerStyle={styles.button}
                            RightAccessory={<NextLongArrowIcon />}
                        />
                    </View>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
