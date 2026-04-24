import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
        },
        scroll: {
            flex: 1,
        },
        contentContainerStyle: {
            paddingTop: scaleVertical(8),
            paddingBottom: scaleVertical(16),
        },
        content: {
            gap: scaleVertical(16),
            flexGrow: 1,
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
            borderWidth: scaleHorizontal(1),
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
        buttonContainer: {
            paddingBottom: scaleVertical(12),
            paddingTop: scaleVertical(8),
        },
        pickerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(16),
        },
        disabledPickerButton: {
            opacity: 0.5,
        },
        placeholderText: {
            color: colors.text_light,
        },
    });
    return styles;
};
