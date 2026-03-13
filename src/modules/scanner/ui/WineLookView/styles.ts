import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingLeft: scaleHorizontal(16),
            paddingRight: scaleHorizontal(5),
        },
        scrollArea: {
            flex: 1,
            width: '100%',
            paddingRight: scaleHorizontal(10),
            overflow: 'visible',
        },
        scrollView: {
            width: '100%',
        },
        scrollContent: {
            paddingBottom: scaleVertical(16),
        },
        indicator: {
            width: scaleHorizontal(6),
            backgroundColor: colors.primary,
        },
        title: {
            textAlign: 'center',
            color: colors.text_light,
            marginBottom: scaleVertical(16),
        },
        label: {
            marginBottom: scaleVertical(12),
        },
        colorsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: scaleHorizontal(7),
            rowGap: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        button: {
            marginBottom: scaleVertical(16),
            marginRight: scaleHorizontal(10),
        },
        bottomValues: {
            marginBottom: scaleVertical(16),
        },
        resultContainer: {
            height: scaleVertical(48),
            borderRadius: 12,
            marginBottom: scaleVertical(16),
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
            marginBottom: scaleVertical(16),
        },
        decoratorContainerStyle: {
            width: '110%',
            zIndex: 1,
        },
        decoratorItem: {
            width: scaleHorizontal(2),
            height: '100%',
            backgroundColor: colors.background,
        },
    });
    return styles;
};

export * from '@/entities/wine/enums/WineSliderColorsEnum';
