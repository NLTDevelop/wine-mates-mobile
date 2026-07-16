import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(8),
            paddingBottom: scaleVertical(16),
        },
        mainPhotoSection: {
            alignItems: 'center',
            marginBottom: scaleVertical(16),
        },
        mainPhotoTitle: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        descriptionInput: {
            minHeight: scaleVertical(120),
        },
        inputContainer: {
            marginBottom: 0,
        },
        button: {
            marginTop: scaleVertical(8),
        },
        alertMessage: {
            color: colors.text_light,
            textAlign: 'center',
        },
        alertFooter: {
            gap: scaleVertical(12),
        },
        alertButton: {
            width: '100%',
        },
    });

    return styles;
};
