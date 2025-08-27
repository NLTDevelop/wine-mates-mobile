import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { useSplash } from '../../presenters/useSplash';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';
import { Gradient } from '../../../../UIKit/Gradient';

export const SplashView = () => {
    const { t, colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    useSplash();

    return (
        <ScreenContainer edges={[]}>
            <Gradient/>
            <View style={styles.container}>
                <Typography text={t('common.logo')} variant="h2" style={styles.text} />
            </View>
        </ScreenContainer>
    );
};
