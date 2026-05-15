import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginHorizontal: scaleHorizontal(16),
        },
        modalContent: {
            width: '100%',
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            borderRadius: 12,
            backgroundColor: colors.background,
        },
        saveButton: {
            marginTop: scaleVertical(16),
        },
    });

    return styles;
};
