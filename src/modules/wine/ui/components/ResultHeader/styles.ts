import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

const IMAGE_WIDTH = scaleHorizontal(117);
const IMAGE_HEIGHT = scaleVertical(172);
const DETAILS_WIDTH = scaleHorizontal(214);
const BUTTON_SIZE = scaleVertical(40);
const MARGIN_HORIZONTAL = scaleHorizontal(16);
const MARGIN_VERTICAL = scaleVertical(16);

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginHorizontal: MARGIN_HORIZONTAL,
            gap: scaleHorizontal(12),
            marginBottom: MARGIN_VERTICAL,
            width: '100%',
        },
        image: {
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
        },
        medal: {
            marginTop: scaleVertical(8),
            alignItems: 'center',
            width: '100%',
        },
        detailsContainer: {
            width: DETAILS_WIDTH,
            justifyContent: 'space-between',
        },
        mainContainer: {
            width: DETAILS_WIDTH,
            height: IMAGE_HEIGHT,
            justifyContent: 'space-between',
        },
        title: {
            flexShrink: 1,
        },
        description: {
            flexShrink: 1,
        },
        rateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        text: {
            color: colors.text_light,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        button: {
            height: BUTTON_SIZE,
            minWidth: scaleHorizontal(162),
        },
        favoriteButton: {
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: BUTTON_SIZE,
            borderWidth: 1,
            borderColor: colors.primary,
        },
        medalContainer: {
            flexDirection: 'row',
            width: IMAGE_WIDTH,
            alignItems: 'center',
            marginBottom: scaleVertical(6),
        },
        buttonTasteContainer: {
            flexDirection: 'row',
            flex: 1,
            marginRight: scaleHorizontal(32),
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    });
    return styles;
};
