import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginBottom: 0,
            marginTop: 0,
            marginHorizontal: scaleHorizontal(40),
        },
        modalContent: {
            width: '100%',
            padding: scaleVertical(16),
            borderRadius: 12,
            backgroundColor: colors.background,
        },
        title: {
            textAlign: 'center',
            marginBottom: scaleVertical(4),
        },
        text: {
            color: colors.text_light,
            textAlign: 'center',
            marginBottom: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
    });

    return styles;
};
