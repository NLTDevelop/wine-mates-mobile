import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(8),
            paddingBottom: scaleVertical(24),
        },
        avatarContainer: {
            alignSelf: 'center',
            marginBottom: scaleVertical(20),
            alignItems: 'center',
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
        roleText: {
            color: colors.text,
        },
        fieldsContainer: {
            gap: scaleVertical(10),
        },
        field: {
            minHeight: scaleVertical(48),
            borderRadius: scaleVertical(12),
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(13)
        },
        fieldRow: {
            minHeight: scaleVertical(56),
            borderRadius: scaleVertical(12),
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
            gap: scaleHorizontal(10),
        },
        fieldText: {
            color: colors.text,
        },
        placeholderText: {
            color: colors.text_light,
        },
        instagramAccessory: {
            marginLeft: scaleHorizontal(2),
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
    });

    return styles;
};
