import { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { localization } from '@/UIProvider/localization/Localization';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';

export const ScannerFrame = () => {
    const { colors } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, top, bottom), [colors, top, bottom]);

    return (
        <View pointerEvents="none" style={styles.container}>
            <View style={[styles.corner, styles.topLeftCorner]} />
            <View style={[styles.corner, styles.topRightCorner]} />
            <View style={[styles.corner, styles.bottomLeftCorner]} />
            <View style={[styles.corner, styles.bottomRightCorner]} />
            <View style={styles.labelContainer}>
                <Typography variant="body_500" style={styles.label} numberOfLines={2}>
                    {localization.t('scanner.wineLabel')}
                </Typography>
            </View>
        </View>
    );
};
