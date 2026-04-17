import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, hasIndicatorOffset: boolean) => {
    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginBottom: 0,
            marginTop: 0,
            marginHorizontal: scaleHorizontal(16),
        },
        modalContent: {
            width: '100%',
            padding: scaleVertical(16),
            borderRadius: 24,
            backgroundColor: colors.background,
        },
        list: {
            maxHeight: scaleVertical(300),
            marginRight: hasIndicatorOffset ? scaleHorizontal(12) : 0,
        },
        contentContainer: {
            flexGrow: 1,
            rowGap: scaleVertical(7),
        },
        indicator: {
            width: scaleHorizontal(6),
            backgroundColor: colors.primary,
        },
    });

    return styles;
};
