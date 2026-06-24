import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
        },
        scroll: {
            flex: 1,
        },
        contentContainer: {
            paddingTop: scaleVertical(8),
            paddingBottom: scaleVertical(0),
        },
        content: {
            flexGrow: 1,
        },
        roleContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background_light,
            borderRadius: 99,
            marginTop: scaleVertical(7),
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(2),
            gap: scaleHorizontal(2),
        },
        avatarContainer: {
            alignSelf: 'center',
            marginBottom: scaleVertical(16),
            alignItems: 'center',
        },
        roleText: {
            color: colors.text,
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
            borderWidth: scaleHorizontal(1),
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
        bigInput: {
            marginBottom: scaleVertical(16),
            minHeight: scaleVertical(120),
        },
        instagramAccessory: {
            marginLeft: scaleHorizontal(16),
        },
        buttonContainer: {
            paddingBottom: scaleVertical(12),
            paddingTop: scaleVertical(8),
        },
        editButton: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: scaleVertical(22),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
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
