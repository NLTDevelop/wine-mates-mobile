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
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { useWineTasteCharacteristics } from '../../presenters/useWineTasteCharacteristics';
import { TasteCharacteristicItem } from '../components/TasteCharacteristicItem';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';

export const WineTasteCharacteristicsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isError, getTasteCharacteristics, handleSliderChange, isLoading, handleNextPress, sliderValues,
        isPremiumUser } = useWineTasteCharacteristics();

    const keyExtractor = useCallback((item: IWineTasteCharacteristic, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: IWineTasteCharacteristic }) => (
            <TasteCharacteristicItem
                item={item}
                value={sliderValues[item.id] ?? 1}
                onChange={value => handleSliderChange(item.id, value)}
                isPremiumUser={isPremiumUser}
            />
        ),
        [handleSliderChange, sliderValues, isPremiumUser],
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTasteCharacteristics} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.tasteCharacteristics')} rightComponent={<CloseButton />} />}
                scrollEnabled
            >
                {!data || data.length === 0 || isLoading ? (
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
                            <SelectedParameters containerStyle={styles.selectedParameters}/>
                        </View>
                        <Button
                            text={t('wine.letsRate')}
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
