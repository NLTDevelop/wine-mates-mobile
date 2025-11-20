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
        button: {
            width: scaleVertical(32),
            height: scaleVertical(32),
            borderRadius: scaleVertical(32),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        list: {
            flexGrow: 1,
        },
        contentContainer: {
            columnGap: scaleHorizontal(8),
        },
    });
    return styles;
};
