import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        profileHeader: {
            marginBottom: scaleVertical(16),
        },
        listContent: {
            flexGrow: 1,
            gap: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
        descriptionScrollContent: {
            flexGrow: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
        gallery: {
            marginBottom: scaleVertical(16),
        },
        galleryPhoto: {
            width: scaleHorizontal(320),
            height: scaleVertical(166),
            borderRadius: 12,
            backgroundColor: colors.background_grey,
        },
        description: {
            color: colors.text,
            lineHeight: scaleVertical(24),
        },
    });

    return styles;
};
