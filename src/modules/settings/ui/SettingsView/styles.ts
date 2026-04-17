import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
            gap: scaleVertical(16),
        },
        section: {
            borderWidth: 1,
            borderColor: colors.border_light,
            borderRadius: 12,
            backgroundColor: colors.background,
            shadowColor: colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        },
    });
    return styles;
};
