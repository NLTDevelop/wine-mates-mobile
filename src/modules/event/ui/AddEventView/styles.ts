import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        contentContainerStyle: {
            paddingBottom: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            flexGrow: 1,
            gap: scaleVertical(16),
        },
        inputContainerStyle: {
          marginBottom: 0,
        },
        descriptionInputContainerStyle: {
            minHeight: scaleVertical(115),
            alignItems: 'stretch',
        },
        locationButton: {
            minHeight: scaleVertical(48),
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(13),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        locationText: {
            color: colors.text,
        },
        submitButton: {
            marginTop: scaleVertical(8),
        },
        pickerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(16),
        },
        placeholderText: {
            color: colors.text_light,
        },
    });
    return styles;
};
