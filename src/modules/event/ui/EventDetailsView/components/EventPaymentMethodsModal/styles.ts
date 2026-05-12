import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
            maxHeight: scaleVertical(520),
        },
        subtitle: {
            color: colors.text_light,
            textAlign: 'center',
            marginBottom: scaleVertical(8),
        },
        list: {
            gap: scaleVertical(12),
        },
        option: {
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            minHeight: scaleVertical(64),
            paddingVertical: scaleVertical(10),
            paddingHorizontal: scaleHorizontal(12),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        optionTextWrap: {
            flex: 1,
            gap: scaleVertical(4),
            marginRight: scaleHorizontal(12),
        },
        optionName: {
            color: colors.text,
        },
        optionDetails: {
            color: colors.text,
        },
        emptyText: {
            textAlign: 'center',
            color: colors.text_light,
            marginVertical: scaleVertical(24),
        },
        nextButton: {
            marginTop: scaleVertical(8),
        },
    });

    return styles;
};
