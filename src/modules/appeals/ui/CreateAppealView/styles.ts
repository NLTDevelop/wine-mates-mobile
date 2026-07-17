import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        scrollContent: {
            flexGrow: 1,
        },
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
        field: {
            marginBottom: scaleVertical(16),
        },
        descriptionInput: {
            minHeight: scaleVertical(140),
            alignItems: 'flex-start',
        },
        photoHint: {
            marginTop: scaleVertical(4),
            marginBottom: scaleVertical(16),
            color: colors.text_light,
        },
        submitButton: {
            marginTop: 'auto',
        },
        gallery: {
            marginBottom: 0,
        }
    });

    return styles;
};
