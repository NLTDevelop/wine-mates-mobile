import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            padding: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
            borderRadius: 12,
            shadowColor: colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
            position: 'relative',

        },
        content: {
          flexDirection: 'row',
            position: 'relative',
            gap: scaleHorizontal(12),
        },
        similarityContainer: {
            position: 'absolute',
            top: scaleVertical(8),
            left: scaleHorizontal(8),
            padding: scaleHorizontal(4),
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: scaleHorizontal(40),
            zIndex: 20,
        },
        similarityText: {
            color: colors.background,
        },
        image: {
            width: scaleHorizontal(116),
            height: scaleVertical(170),
        },
        imagePlaceholder: {
            borderRadius: 12,
        },
        mainContainer: {
            maxWidth: scaleHorizontal(160),
            justifyContent: 'space-between',
        },
        subContainer: {
            gap: scaleVertical(4),
        },
        rateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
            marginBottom: scaleVertical(11),
        },
        text: {
            color: colors.text_light,
        },
        userRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        pressed: {
            opacity: 0.6,
        },
        dateText: {
            color: colors.text,
            opacity: 0.5,
            textAlign: 'center',
            marginTop: scaleVertical(12),
        },
    });
    return styles;
};
