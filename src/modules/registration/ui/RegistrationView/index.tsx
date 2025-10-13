import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';
import { HeaderWithBackButton } from '../../../../UIKit/HeaderWithBackButton';
import { SignInFooter } from '../components/SignInFooter';
import { Button } from '../../../../UIKit/Button';
import { CustomInput } from '../../../../UIKit/CustomInput';

export const RegistrationView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <ScreenContainer edges={['top', 'bottom']} headerComponent={<HeaderWithBackButton />}>
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Typography text={t('registration.getStarted')} variant="h3" style={styles.title} />
                    <Typography text={'Wine lover'} variant="body_500" style={styles.role} />
                    <View style={styles.formContainer}>
                        <CustomInput
                            autoCapitalize="none"
                            value={''}
                            onChangeText={() => {}}
                            placeholder={t('registration.email')}
                            error={false}
                        />
                    </View>
                </View>
                <View style={styles.footer}>
                    <Button text={t('common.continue')} onPress={() => {}} type="secondary" />
                    <SignInFooter />
                </View>
            </View>
        </ScreenContainer>
    );
};
