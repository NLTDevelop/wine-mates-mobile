import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(24),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(16),
        },
        headerTitleContainer: {
            gap: scaleVertical(4),
        },
        noteContainer: {
            borderRadius: 12,
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
            minHeight: scaleVertical(212),
            backgroundColor: colors.background,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        text: {
            color: colors.primary,
        },
        loaderContainer: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: scaleVertical(212),
        },
        loaderText: {
            color: colors.text_light,
        },
        button: {
            height: scaleVertical(36),
            minWidth: scaleHorizontal(109),
        },
        noteInputContainer: {
            borderWidth: 0,
        },
        noteInput: {
            color: colors.text,
            fontSize: scaleFontSize(16),
            fontWeight: '500',
            flex: 1,
            borderWidth: 0,
        },
        buttonGroup: {
            flexDirection: 'row',
            marginTop: scaleVertical(8),
            alignSelf: 'flex-end',
            gap: scaleHorizontal(8),
        },
    });
    return styles;
};
