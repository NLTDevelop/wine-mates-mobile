import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';

export const PersonalProfileView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={['top', 'bottom']}>
            <View style={styles.container}>
                <Typography text={'Personal Profile'} variant="h3" />
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
