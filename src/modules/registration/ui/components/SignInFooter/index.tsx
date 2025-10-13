import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '../../../../../UIProvider';
import { Typography } from '../../../../../UIKit/Typography';
import { useSignInFooter } from '../../../presenters/useSignInFooter';

export const SignInFooter = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { handleSgnInNavigation } = useSignInFooter();

    return (
        <View style={styles.container}>
            <Typography variant="body_500" text={`${t('registration.haveAnAccount')} `} />
            <TouchableOpacity onPress={ handleSgnInNavigation }>
                <Typography variant="body_500" style={styles.linkText} text={t('authentication.signIn')} />
            </TouchableOpacity>
        </View>
    );
};
