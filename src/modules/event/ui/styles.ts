import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        titleContainer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
        },
        content: {
            paddingHorizontal: scaleHorizontal(16),
            gap: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
    });
    return styles;
};
