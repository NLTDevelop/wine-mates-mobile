import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        content: {
            flex: 1,
            paddingTop: scaleVertical(8),
        },
        avatar: {
            alignSelf: 'center',
            marginBottom: scaleVertical(16),
        },
        expertiseContainer: {
            marginBottom: scaleVertical(12),
        },
        expertiseTitle: {
            marginBottom: scaleVertical(8),
            color: colors.text,
        },
        expertiseRow: {
            minHeight: scaleVertical(48),
            borderRadius: scaleVertical(12),
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(12),
        },
        expertiseValue: {
            flex: 1,
            marginLeft: scaleHorizontal(10),
            color: colors.text,
        },
        input: {
            marginBottom: scaleVertical(16),
        },
        instagramAccessory: {
            marginLeft: scaleHorizontal(16),
        },
        buttonContainer: {
            paddingBottom: scaleVertical(24),
        },
        editButton: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: scaleVertical(22),
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
        },
        pickerWrapper: {
            width: '100%',
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
