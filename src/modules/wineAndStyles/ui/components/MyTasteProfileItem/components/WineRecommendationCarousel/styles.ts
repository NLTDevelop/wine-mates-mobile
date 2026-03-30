import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginTop: scaleVertical(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        arrowContainer: {
            position: 'absolute',
            flexDirection: 'row',
            width: '100%',
            height: scaleHorizontal(40),
            justifyContent: 'space-between',
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
        },
        leftArrowContainer: {
            left: -scaleHorizontal(10),
        },
        rightArrowContainer: {
            right: -scaleHorizontal(10),
        },
        cardContainer: {
            flex: 1,
            marginHorizontal: scaleHorizontal(8),
        },
    });
    return styles;
};
