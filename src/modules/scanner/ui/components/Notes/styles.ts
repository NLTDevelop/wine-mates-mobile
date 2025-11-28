import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        title: {
            marginBottom: scaleVertical(16),
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
        },
        mainContainer: {
            marginTop: scaleVertical(9),
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: scaleVertical(24),
            paddingVertical: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
        },
        lastRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
        },
        characteristicTitle: {
            color: colors.text_light,
        },
        characteristic: {
            maxWidth: scaleHorizontal(196),
            flexShrink: 1,
        }
    });
    return styles;
};
