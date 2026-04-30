import { IColors } from '@/UIProvider/theme/IColors';
import { StyleSheet } from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            maxHeight: scaleVertical(620),
        },
        header: {
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: scaleVertical(16),
        },
        title: {
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
        },
        headerAction: {
            zIndex: 1,
        },
        scrollContent: {
            paddingHorizontal: scaleHorizontal(16),
        },
        buttonContainer: {
            paddingTop: scaleVertical(16),
        },
        clearButton: {
            color: colors.text,
        },
        clearButtonDisabled: {
            color: colors.text_light,
        },
    });

    return styles;
};
