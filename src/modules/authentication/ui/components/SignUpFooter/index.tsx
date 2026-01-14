import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { useSignUpFooter } from '@/modules/authentication/presenters/useSignUpFooter';
import { ConfirmationModal } from '@/UIKit/ConfirmationModal';
import { useConfirmationModal } from '@/UIKit/ConfirmationModal/presenters/useConfirmationModal';

export const SignUpFooter = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isVisible, onShowModal, onHide } = useConfirmationModal();
    const { handleSgnUpNavigation } = useSignUpFooter(onHide);

    return (
        <>
            <View style={styles.container}>
                <Typography variant="body_500" text={t('authentication.haveAnAccount')} />
                <TouchableOpacity onPress={onShowModal}>
                    <Typography variant="body_500" style={styles.linkText} text={t('authentication.signUp')} />
                </TouchableOpacity>
            </View>
            <ConfirmationModal
                isVisible={isVisible}
                onHide={onHide}
                onConfirm={handleSgnUpNavigation}
                title={t('registration.birthdayTitle')}
                description={t('registration.birthdayDescription')}
            />
        </>
    );
};
