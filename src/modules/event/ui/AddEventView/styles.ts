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
            backgroundColor: colors.background,
        },
        descriptionInputContainerStyle: {
            minHeight: scaleVertical(115),
            alignItems: 'stretch',
        },
        priceInputHelperText: {
            color: colors.text_light,
            marginTop: scaleVertical(4),
        },
        buttonContainer: {
            paddingBottom: scaleVertical(12),
            paddingTop: scaleVertical(8),
        },
        row: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        inlinePickerContainer: {
            flex: 1,
        },
    });
    return styles;
};
