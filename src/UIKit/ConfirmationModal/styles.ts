import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: '100%',
            padding: scaleVertical(16),
            borderRadius: 24,
            backgroundColor: colors.background,
        },
        title: {
            textAlign: 'center',
            marginBottom: scaleVertical(6),
        },
        text: {
            color: colors.text_light,
            textAlign: 'center',
            marginBottom: scaleVertical(24)
        },
    });

    return styles;
};
