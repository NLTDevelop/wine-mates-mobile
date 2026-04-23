import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { getShadows } from '@/UIProvider/theme/constants';

export const getStyles = (colors: IColors) => {
    const shadows = getShadows(colors);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
        },
        content: {
            paddingHorizontal: scaleHorizontal(16),
            gap: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
        mapContainer: {
            position: 'relative',
        },
        addButton: {
            position: 'absolute',
            bottom: scaleVertical(16),
            left: scaleHorizontal(16),
            width: scaleHorizontal(48),
            height: scaleHorizontal(48),
            borderRadius: scaleHorizontal(24),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows.medium,
        },
    });
    return styles;
};
