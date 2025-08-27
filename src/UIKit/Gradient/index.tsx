import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '../../UIProvider';
import LinearGradient from 'react-native-linear-gradient';

export const Gradient = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <LinearGradient colors={[colors.background_light, colors.background]} style={styles.gradient}/>
    );
};
