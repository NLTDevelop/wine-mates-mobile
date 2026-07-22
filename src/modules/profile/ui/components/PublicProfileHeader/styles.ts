import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            paddingBottom: scaleVertical(12),
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(16),
        },
        textContainer: {
            flex: 1,
        },
        avatarContainer: {
            position: 'relative',
        },
        galleryBadge: {
            position: 'absolute',
            right: -scaleHorizontal(3),
            bottom: -scaleVertical(3),
            minWidth: scaleHorizontal(22),
            height: scaleVertical(22),
            paddingHorizontal: scaleHorizontal(4),
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
        },
        galleryBadgeText: {
            color: colors.text_inverted,
        },
        name: {
            color: colors.text,
        },
        verifiedStatus: {
            alignSelf: 'flex-start',
            paddingHorizontal: scaleHorizontal(6),
            paddingVertical: scaleVertical(3),
            marginBottom: scaleVertical(4),
            borderRadius: 6,
            backgroundColor: `${colors.success}1A`,
        },
        notVerifiedStatus: {
            alignSelf: 'flex-start',
            paddingHorizontal: scaleHorizontal(6),
            paddingVertical: scaleVertical(3),
            marginBottom: scaleVertical(4),
            borderRadius: 6,
            backgroundColor: `${colors.error}1A`,
        },
        verifiedStatusText: {
            color: colors.success,
        },
        notVerifiedStatusText: {
            color: colors.error,
        },
        details: {
            color: colors.text_light,
            marginTop: scaleVertical(4),
        },
        linksButton: {
            alignSelf: 'flex-end',
            marginTop: scaleVertical(12),
            paddingVertical: scaleVertical(4),
        },
        linksText: {
            color: colors.text_light,
            textDecorationLine: 'underline',
        },
    });

    return styles;
};
