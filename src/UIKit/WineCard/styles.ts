import { IColors } from '@/UIProvider/theme/IColors';
import { colorOpacity, scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            width: '100%',
        },
        imageContainer: {
            width: scaleHorizontal(76),
            height: scaleVertical(175),
        },
        image: {
            width: scaleHorizontal(76),
            height: scaleVertical(175),
        },
        rightColumn: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        header: {
            height: scaleVertical(70),
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        headerLeft: {
            flex: 1,
            gap: scaleVertical(4),
            justifyContent: 'flex-start',
        },
        headerRight: {
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        medalContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            gap: scaleHorizontal(4),
        },
        lockedMedalContainer: {
            width: scaleHorizontal(32),
            height: scaleHorizontal(32),
            borderRadius: scaleHorizontal(16),
            backgroundColor: colors.text_light,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
        },
        rateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        rateWrapper: {
            flexDirection: 'row',
            backgroundColor: colorOpacity(colors.stars, 32),
            paddingHorizontal: scaleHorizontal(4),
            paddingVertical: scaleVertical(2),
            borderRadius: 8,
            alignItems: 'center',
            gap: scaleHorizontal(2),
        },
        reviewSection: {
            gap: scaleVertical(4),
        },
        userRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        text: {
            color: colors.text_light,
        },
        medalText: {
            textAlign: 'center',
        },
    });
    return styles;
};
