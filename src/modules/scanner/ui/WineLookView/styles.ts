import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { colorOpacity, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
        },
        title: {
            textAlign: 'center',
            color: colors.text_light,
            marginBottom: scaleVertical(24),
        },
        label: {
            marginBottom: scaleVertical(12),
        },
        colorsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: scaleHorizontal(7),
            rowGap: scaleVertical(12),
            marginBottom: scaleVertical(24),
        },
        resultColor: {
            borderRadius: 12,
            width: scaleHorizontal(109),
            height: scaleVertical(50),
            marginBottom: scaleVertical(24),
        },
        button: {
            marginBottom: scaleVertical(16),
        },
        bottomValues: {
            marginBottom: scaleVertical(24),
        },
        smoothSlider: {
            marginBottom: 0,
        },
        track: {
            height: scaleVertical(16),
            borderRadius: scaleVertical(8),
        },
        selected: {
            height: scaleVertical(16),
            borderRadius: scaleVertical(8),
        },
        sliderContainer: {
            gap: scaleVertical(20),
            marginBottom: scaleVertical(24),
        },
        decoratorContainerStyle: {
            width: '110%',
            zIndex: 1,
        },
        decoratorItem: {
            width: scaleHorizontal(1.2),
            height: '280%',
            transform: [{ rotate: '32deg' }],
            backgroundColor: colorOpacity(colors.background, 15),
            marginLeft: scaleHorizontal(-20),
        },
    });
    return styles;
};
