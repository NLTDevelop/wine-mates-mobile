import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { localization } from '@/UIProvider/localization/Localization';
import { getStyles } from './styles';

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
                <Text style={styles.label}>{localization.t('scanner.wineLabel')}</Text>
            </View>
        </View>
    );
};
