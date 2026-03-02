import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, isPremiumUser: boolean = true) => {
    const styles = StyleSheet.create({
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        text: {
            color: colors.text_light,
        },
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleVertical(8),
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
            position: 'relative',
        },
        gridItem: {
            width: `${(100 - 5) / 3}%`,
            backgroundColor: isPremiumUser ? colors.primary : colors.background_grey,
            borderRadius: 12,
            paddingVertical: scaleVertical(12),
            alignItems: 'center',
            justifyContent: 'center',
        },
        blurOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
            zIndex: 5,
        },
        androidOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background_grey,
            borderRadius: 12,
            zIndex: 5,
        },
        lockIconContainer: {
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: [{ translateX: -12 }, { translateY: -12 }],
            zIndex: 10,
        },
    });
    return styles;
};
