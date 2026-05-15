import { View } from 'react-native';
import { getStyles } from './styles';
import LottieView from 'lottie-react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { useMemo } from 'react';

export const NoteLoader = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography variant="h6" text={t('wine.generationInProgress')} style={styles.text} />
            <LottieView source={require('@assets/lottie/loader.json')} style={styles.lottie} autoPlay loop />
        </View>
    );
};
