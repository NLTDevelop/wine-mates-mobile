import { IColors } from '@/UIProvider/theme/IColors';
import { StyleSheet } from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottom: number, top: number) => {
    const styles = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: scaleHorizontal(24),
            borderTopRightRadius: scaleHorizontal(24),
        },
        header: {
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: scaleVertical(16),
        },
        title: {
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
        },
        headerAction: {
            zIndex: 1,
        },
        scrollContent: {
            paddingHorizontal: scaleHorizontal(16),
        },
        buttonContainer: {
            paddingTop: scaleVertical(16),
            paddingBottom: bottom + scaleVertical(16),
        },
        clearButton: {
            color: colors.text,
        },
        clearButtonDisabled: {
            color: colors.text_light,
        },
    });

    return styles;
};
