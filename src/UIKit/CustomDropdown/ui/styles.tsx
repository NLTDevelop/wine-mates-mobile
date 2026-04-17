import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        dropdown: {
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border_light,
            paddingHorizontal: scaleHorizontal(16),
            minHeight: scaleVertical(48),
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        dropdownContainer: {
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border_light,
            maxHeight: scaleVertical(250),
            overflow: 'hidden',
        },
        footerContainer: {
            marginTop: scaleVertical(4),
        },
        placeholder: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Regular',
            color: colors.text,
        },
        selectedText: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Regular',
            color: colors.text,
        },
        selectedTextHidden: {
            color: 'transparent',
            opacity: 0,
        },
        selectedOverlay: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: scaleHorizontal(16),
            right: scaleHorizontal(16),
            justifyContent: 'center',
        },
        dropdownDisabled: {
            opacity: 0.5,
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(14),
        },
        itemText: {
            color: colors.text_middle,
        },
        searchContainer: {
            marginHorizontal: scaleHorizontal(12),
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(12),
        },
    });
    return styles;
};
