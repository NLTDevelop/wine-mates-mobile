import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) => {
    const styles = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
        container: {
            gap: scaleVertical(24),
        },
        inputContainer: {
            marginBottom: 0,
        },
        button: {
            marginBottom: bottomInset,
        },
    });
    return styles;
};
