import { useMemo } from 'react';
import { Image, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

export const EventAccessDeniedState = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Image
                source={require('@assets/images/event_access_denied.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <Typography text={t('eventDetails.accessDeniedTitle')} variant="subtitle_20_700" style={styles.title} />
            <Typography
                text={t('eventDetails.accessDeniedDescription')}
                variant="subtitle_12_400"
                style={styles.description}
            />
        </View>
    );
};
