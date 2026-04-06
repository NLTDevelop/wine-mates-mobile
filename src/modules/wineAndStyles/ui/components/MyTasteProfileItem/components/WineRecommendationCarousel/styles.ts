import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginTop: scaleVertical(16),
            width: '100%',
            position: 'relative',
        },
        carouselHeight: {
            height: scaleVertical(300),
        },
        cardContainer: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(8),
        },
        arrowButton: {
            position: 'absolute',
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            borderRadius: scaleHorizontal(20),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            opacity: 0.3,
            zIndex: 10,
            top: '50%',
            marginTop: -scaleHorizontal(20),
        },
        leftArrowContainer: {
            left: -scaleHorizontal(10),
        },
        rightArrowContainer: {
            right: -scaleHorizontal(10),
        },
    });
    return styles;
};
