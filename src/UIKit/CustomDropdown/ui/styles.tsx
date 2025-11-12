import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) =>
    StyleSheet.create({
        container: {
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border_light,
            height: scaleVertical(48),
            backgroundColor: colors.background,
        },
        dropdown: {
            // borderWidth: 1,
            // borderRadius: 12,
            // borderColor: colors.border_light,
            paddingHorizontal: scaleHorizontal(12),
            height: scaleVertical(48),
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        dropdownContainer: {
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border_light,
            maxHeight: scaleVertical(300),
            overflow: 'hidden',
        },
        placeholder: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Regular',
            fontWeight: '400',
            color: colors.text,
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
