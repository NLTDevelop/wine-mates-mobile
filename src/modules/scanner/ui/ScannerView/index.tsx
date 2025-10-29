import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

export const ScannerView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={['top']}>
            <View style={styles.container}>
                <Typography text={'Scanner Screen'} variant="h3" />
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
