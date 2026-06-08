import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.text,
            opacity: 0.35,
        },
        card: {
            width: '100%',
            maxWidth: scaleHorizontal(360),
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(16),
            backgroundColor: colors.background,
            borderRadius: 12,
            alignItems: 'center',
        },
        header: {
            width: '100%',
            minHeight: scaleVertical(32),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            textAlign: 'center',
            color: colors.text,
        },
        closeButton: {
            width: scaleHorizontal(32),
            height: scaleVertical(32),
            alignItems: 'center',
            justifyContent: 'center',
        },
        description: {
            color: colors.text_light,
            textAlign: 'center',
            marginTop: scaleVertical(8),
            marginBottom: scaleVertical(20),
        },
        actionButton: {
            width: '100%',
        },
        copyButton: {
            width: '100%',
            marginTop: scaleVertical(8),
            backgroundColor: colors.background,
            borderColor: colors.primary,
        },
        copyButtonText: {
            color: colors.primary,
        },
    });

    return styles;
};
