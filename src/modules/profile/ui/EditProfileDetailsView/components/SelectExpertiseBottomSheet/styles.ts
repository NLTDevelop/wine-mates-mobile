import { Dimensions, StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

const windowHeight = Dimensions.get('window').height;

export const getStyles = (colors: IColors, bottomInset: number, topInset: number) => {
    const maxHeight = windowHeight - topInset;

    const styles = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
        container: {
            maxHeight,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: bottomInset + scaleVertical(16),
            gap: scaleVertical(24),
        },
        header: {
            marginTop: scaleVertical(15),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        headerSpacer: {
            width: scaleVertical(24),
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: scaleHorizontal(170),
        },
        selectedText: {
            color: colors.text_light,
        },
        headerIconSpacer: {
            width: scaleHorizontal(12),
        },
        closeButton: {
            width: scaleVertical(24),
            height: scaleVertical(24),
        },
        buttonsContainer: {
            gap: scaleVertical(12),
            paddingBottom: scaleVertical(8),
        },
    });

    return styles;
};
