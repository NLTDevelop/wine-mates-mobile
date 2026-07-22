import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { useSignUpFooter } from '@/modules/authentication/presenters/useSignUpFooter';
import { ConfirmationAlert } from '@/UIKit/ConfirmationAlert';
import { useConfirmationAlert } from '@/UIKit/ConfirmationAlert/presenters/useConfirmationAlert';

export const SignUpFooter = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isVisible, onShowAlert, onCloseAlert } = useConfirmationAlert();
    const { onSignUpPress } = useSignUpFooter(onCloseAlert);

    return (
        <>
            <View style={styles.container}>
                <Typography variant="body_500" text={t('authentication.haveAnAccount')} />
                <TouchableOpacity onPress={onShowAlert}>
                    <Typography variant="body_500" style={styles.linkText} text={t('authentication.signUp')} />
                </TouchableOpacity>
            </View>
            <ConfirmationAlert
                visible={isVisible}
                onClose={onCloseAlert}
                onConfirm={onSignUpPress}
                title={t('registration.birthdayTitle')}
                description={t('registration.birthdayDescription')}
            />
        </>
    );
};
