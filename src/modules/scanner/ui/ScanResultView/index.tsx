import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { FlatList, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { ResultListHeader } from '../components/ResultListHeader';

export const ScanResultView = observer(() => {
    const { colors, t} = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: any, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(
        ({ item }: { item: any }) => (<View></View>),
        [],
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
            contentContainerStyle={styles.containerStyle}
            ListHeaderComponent={<ResultListHeader/>}
        />
        </ScreenContainer>
        // </WithErrorHandler>
    );
});
