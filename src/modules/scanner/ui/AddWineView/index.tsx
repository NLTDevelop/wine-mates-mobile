import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { Button } from '@/UIKit/Button';

export const AddWineView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('scanner.whatsInYourGlass')} />}
        >
            <View style={styles.container}>
                <Typography text={t('scanner.enterData')} variant="body_400" style={styles.title} />

                <Button text={t('scanner.tasteWine')} onPress={() => {}} containerStyle={styles.button} />
            </View>
        </ScreenContainer>
        // </WithErrorHandler>
    );
};
