import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        title: {
            marginBottom: scaleVertical(16),
        },
        sliderContainer: {
            width: '92%',
            marginHorizontal: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        starsContainer: {
            alignItems: 'center',
            marginLeft: scaleHorizontal(24),
        },
        star: {
            marginRight: scaleHorizontal(24),
        },
        starIconContainer: {
            justifyContent: 'center',
        },
        starFillOverlay: {
            position: 'absolute',
            overflow: 'hidden',
        },
        decoratorItem: {
            width: scaleHorizontal(2),
            backgroundColor: colors.background,
            height: '100%'
        }
    });
    return styles;
};
