import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(8),
        },
        item: {
            minHeight: scaleVertical(72),
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: scaleVertical(8),
            paddingHorizontal: scaleHorizontal(8),
            borderRadius: 16,
            backgroundColor: colors.background,
            shadowColor: colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: scaleVertical(10),
            shadowOffset: {
                width: 0,
                height: scaleVertical(4),
            },
            elevation: 2,
        },
        iconContainer: {
            width: scaleVertical(52),
            height: scaleVertical(52),
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background_middle,
        },
        textContainer: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(8),
        },
        title: {
            marginBottom: scaleVertical(2),
        },
        description: {
            color: colors.text_light,
        },
        selectedAction: {
            width: scaleVertical(36),
            height: scaleVertical(36),
            borderRadius: scaleVertical(18),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
        },
        unselectedAction: {
            width: scaleVertical(36),
            height: scaleVertical(36),
            borderRadius: scaleVertical(18),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary_secondary,
        },
        button: {
            marginTop: scaleVertical(10),
        },
    });

    return styles;
};
