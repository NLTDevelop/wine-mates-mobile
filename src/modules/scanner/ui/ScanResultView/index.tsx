import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ResultListHeader } from '../components/ResultListHeader';

export const ScanResultView = observer(() => {
    const { colors, t} = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

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
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            scrollEnabled
            headerComponent={<HeaderWithBackButton title={t('wine.result')} isCentered={false} />}
        >
           
        <FlatList
            data={[]}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={<ResultListHeader/>}
        />
        </ScreenContainer>
        // </WithErrorHandler>
    );
});
