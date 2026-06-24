import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
        },
        inputContainer: {
            marginBottom: scaleVertical(16),
            backgroundColor: colors.background,
        },
        descriptionInputContainer: {
            minHeight: scaleVertical(116),
            backgroundColor: colors.background,
            alignItems: 'flex-start',
        },
        imageContainer: {
            width: scaleVertical(75),
            height: scaleVertical(75),
            marginTop: scaleVertical(8),
            marginBottom: scaleVertical(8),
        },
        image: {
            width: scaleVertical(75),
            height: scaleVertical(75),
            borderRadius: scaleVertical(4),
        },
        removeImageButton: {
            position: 'absolute',
            right: scaleHorizontal(-8),
            top: scaleVertical(-8),
            width: scaleVertical(20),
            height: scaleVertical(20),
            borderRadius: scaleVertical(4),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        uploadContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(6),
        },
        uploadTitle: {
            color: colors.primary,
        },
        uploadSubtitle: {
            marginTop: scaleVertical(4),
            color: colors.text_light,
            marginBottom: scaleVertical(16),
        },
        saveButton: {
            marginTop: 'auto',
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
