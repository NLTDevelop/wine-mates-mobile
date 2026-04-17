import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { FlatListIndicator } from '@fanchenbao/react-native-scroll-indicator';
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
import { WinePeakPicker } from '../components/WinePeakPicker';

type ListItemType =
    | { type: 'characteristic'; data: IWineTasteCharacteristic }
    | { type: 'winePeak' };

export const WineTasteCharacteristicsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isError, getTasteCharacteristics, handleSliderChange, isLoading, handleNextPress, sliderValues,
        isPremiumUser, winePeak, handleWinePeakChange, isExpertOrWinemaker } = useWineTasteCharacteristics();

    const listData = useMemo<ListItemType[]>(() => {
        const items: ListItemType[] = [];
        if (data) {
            data.forEach(characteristic => {
                items.push({ type: 'characteristic', data: characteristic });
            });
            if (isExpertOrWinemaker) {
                items.push({ type: 'winePeak' });
            }
        }
        return items;
    }, [data, isExpertOrWinemaker]);


    const keyExtractor = useCallback((item: ListItemType, index: number) => {
        if (item.type === 'characteristic') {
            return `characteristic-${item.data.id}-${index}`;
        }
        return 'winePeak';
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: ListItemType }) => {
            if (item.type === 'characteristic') {
                return (
                    <TasteCharacteristicItem
                        item={item.data}
                        value={sliderValues[item.data.id] ?? 0}
                        onChange={value => handleSliderChange(item.data.id, value)}
                        isPremiumUser={isPremiumUser}
                    />
                );
            }
            return <WinePeakPicker value={winePeak} onChange={handleWinePeakChange} />;
        },
        [handleSliderChange, sliderValues, isPremiumUser, winePeak, handleWinePeakChange],
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTasteCharacteristics} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.tasteCharacteristics')} rightComponent={<CloseButton />} />}
            >
                {!data || data.length === 0 || isLoading ? (
                    <Loader />
                ) : (
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <FlatListIndicator
                                containerStyle={styles.scrollArea}
                                flatListProps={{
                                    data: listData,
                                    keyExtractor,
                                    renderItem,
                                    style: styles.list,
                                    contentContainerStyle: styles.contentContainer,
                                    nestedScrollEnabled: true,
                                    keyboardShouldPersistTaps: 'handled',
                                    ListFooterComponent: <SelectedParameters containerStyle={styles.selectedParameters} />,
                                }}
                                indStyle={styles.indicator}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                text={t('wine.letsRate')}
                                onPress={handleNextPress}
                                containerStyle={styles.button}
                                RightAccessory={<NextLongArrowIcon />}
                            />
                        </View>
                    </View>
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
