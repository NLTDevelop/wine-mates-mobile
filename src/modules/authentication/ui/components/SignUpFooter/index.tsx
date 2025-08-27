import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '../../../../../UIProvider';
import { Typography } from '../../../../../UIKit/Typography';

export const SignUpFooter = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography variant="body_500" text={t('authentication.haveAnAccount')} />
            <TouchableOpacity onPress={() => {}}>
                <Typography variant="body_500" style={styles.linkText} text={t('authentication.signUp')} />
            </TouchableOpacity>
        </View>
    );
};
