import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            marginBottom: scaleVertical(16),
        },
        mainContainer: {
            flex: 1,
            minHeight: scaleVertical(48),
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        button: {
            width: scaleVertical(48),
            height: scaleVertical(48),
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
    });
    return styles;
};
