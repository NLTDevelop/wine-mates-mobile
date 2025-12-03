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
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            shadowColor: colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        },
        image: {
            width: scaleHorizontal(116),
            height: scaleVertical(170),
        },
        mainContainer: {
            maxWidth: scaleHorizontal(191),
            justifyContent: 'space-between',
        },
        subContainer: {
            gap: scaleVertical(4),
        },
        title: {
            flexShrink: 1,
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
    });
    return styles;
};
