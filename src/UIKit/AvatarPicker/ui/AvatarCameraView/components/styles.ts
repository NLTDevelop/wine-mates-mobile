import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors, circleSize: number, screenWidth: number, screenHeight: number) => {
    const styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFill,
        },
        svgContainer: {
            ...StyleSheet.absoluteFill,
        },
        circleBorder: {
            position: 'absolute',
            top: (screenHeight - circleSize) / 2,
            left: (screenWidth - circleSize) / 2,
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth: 2,
            borderColor: colors.primary,
        },
    });

    return styles;
};
