import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { FlatListIndicator } from '@fanchenbao/react-native-scroll-indicator';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';
import { SelectedParameters } from '../../../../UIKit/SelectedParameters';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { Loader } from '@/UIKit/Loader';
import { observer } from 'mobx-react-lite';
import { NextLongArrowIcon } from '@assets/icons/NextLongArrowIcon';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { TasteCharacteristicItem } from '@/UIKit/TasteCharacteristicItem';
import { WinePeakPicker } from '@/UIKit/WinePeakPicker';
import { useTastingWineTasteCharacteristics } from './presenters/useTastingWineTasteCharacteristics';

type ListItemType =
    | { type: 'characteristic'; data: IWineTasteCharacteristic }
    | { type: 'winePeak' };

export const TastingWineTasteCharacteristicsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, isError, getTasteCharacteristics, createOnSliderChange, isLoading, onPressNext, sliderValues,
        isPremiumUser, winePeak, onWinePeakChange, isExpertOrWinemaker, isSaving, isSelectedParametersVisible } =
        useTastingWineTasteCharacteristics();

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
                            onChange={createOnSliderChange(item.data.id)}
                            isPremiumUser={isPremiumUser}
                        />
                );
            }
            return <WinePeakPicker value={winePeak} onChange={onWinePeakChange} />;
        },
        [createOnSliderChange, sliderValues, isPremiumUser, winePeak, onWinePeakChange],
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={getTasteCharacteristics} isLoading={isLoading}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={<HeaderWithBackButton title={t('wine.tasteCharacteristics')} />}
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
                                    ListFooterComponent: isSelectedParametersVisible ? (
                                        <SelectedParameters containerStyle={styles.selectedParameters} />
                                    ) : null,
                                }}
                                indStyle={styles.indicator}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                text={t('wine.letsRate')}
                                onPress={onPressNext}
                                inProgress={isSaving}
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
