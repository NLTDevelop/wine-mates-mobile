import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { useSplash } from '../../presenters/useSplash';
import { ScreenContainer } from '../../../../UIKit/ScreenContainer';
import { Typography } from '../../../../UIKit/Typography';

export const SplashView = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    useSplash();

    return (
        <ScreenContainer edges={[]} containerStyle={styles.container}>
            <View style={styles.container}>
                <Typography text={'Test'} variant="h6" />
            </View>
        </ScreenContainer>
    );
});
