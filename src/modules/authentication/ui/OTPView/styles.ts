import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';
import { scaleHorizontal, scaleLineHeight, scaleVertical } from '../../../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        title: {
            marginBottom: scaleVertical(8),
            textAlign: 'center',
        },
        textContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: scaleVertical(16),
        },
        descriptionText: {
            color: colors.text_light,
            textAlign: 'center',
            maxWidth: scaleHorizontal(294),
            lineHeight: scaleLineHeight(22),
        
        },
        otpContainer: {
            height: scaleVertical(56),
        },
        resendContainer: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
            marginTop: scaleVertical(16),
        },
        text: {
            color: colors.text_light,
        },
        textButtonDisabled: {
            color: colors.text_light,
            borderBottomColor: colors.text_light,
            borderBottomWidth: 1,
        },
        textButtonText: {
            color: colors.text,
            borderBottomColor: colors.text,
            borderBottomWidth: 1,
        },
        footer: {
            gap: scaleVertical(24),
        },
    });
    return styles;
};
