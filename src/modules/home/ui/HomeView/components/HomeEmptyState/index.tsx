import { useMemo } from 'react';
import { View } from 'react-native';
import { HomeEmptyIcon } from '@assets/icons/HomeEmptyIcon';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

export const HomeEmptyState = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <HomeEmptyIcon />
                <Typography
                    variant="body_400"
                    text={t('home.emptyDescription')}
                    style={styles.description}
                />
            </View>
        </View>
    );
};
