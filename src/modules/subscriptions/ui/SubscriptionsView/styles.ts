import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleLineHeight, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        contentContainerStyle: {
            flexGrow: 1,
            paddingBottom: scaleVertical(16),
        },
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
        },
        imageTitleContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            gap: scaleVertical(16),
            marginBottom: scaleVertical(16),
        },
        iconContainer: {
            width: scaleVertical(64),
            height: scaleVertical(64),
            borderRadius: scaleVertical(12),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.stars,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        title: {
            textAlign: 'center',
            lineHeight: scaleLineHeight(22),
            paddingHorizontal: scaleHorizontal(8),
        },
        infoContainer: {
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(12),
            padding: scaleHorizontal(16),
            marginBottom: scaleVertical(18),
            backgroundColor: colors.background,
        },
        subscriptionsList: {
            flex: 1,
            justifyContent: 'space-between',
            marginBottom: scaleVertical(22),
        },
    });

    return styles;
};
