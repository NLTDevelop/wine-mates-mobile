import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            gap: scaleVertical(4),
            paddingBottom: scaleVertical(10),
            paddingHorizontal: scaleHorizontal(16),
            overflow: 'hidden',
        },
        description: {
            color: colors.text_light,
            marginBottom: scaleVertical(16),
        },
        lockLayer: {
            position: 'absolute',
            top: 0,
            right: scaleHorizontal(16),
            zIndex: 10,
        },
        blur: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 5,
        },
        fakeBlur: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: `${colors.background}A6`,
        },
    });
    return styles;
};
