import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(6),
        },
        pickerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            minHeight: scaleVertical(48),
            padding: scaleHorizontal(12),
        },
        input: {
            flex: 1,
            marginBottom: 0,
            backgroundColor: colors.background,
        },
        flag: {
            width: scaleVertical(20),
            height: scaleVertical(20),
            borderRadius: scaleVertical(20),
        },
        placeholderText: {
            textAlignVertical: 'center',
            color: colors.text,
        },
        codeText: {
            marginLeft: scaleHorizontal(8),
            marginRight: scaleHorizontal(2),
        },
        loaderContainer: {
            height: scaleVertical(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: scaleHorizontal(12),
            backgroundColor: colors.background,
        },
    });

    return styles;
};
