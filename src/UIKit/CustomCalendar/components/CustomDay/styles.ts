import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

interface IProps {
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isOutsideMonth: boolean;
    isToday: boolean;
    isDisabled: boolean;
}

export const getStyles = (colors: IColors, styleDetails: IProps) => {
    const isMiddle = styleDetails.isSelected && !styleDetails.isRangeStart && !styleDetails.isRangeEnd;
    const backgroundColor =
        styleDetails.isRangeStart || styleDetails.isRangeEnd ? colors.primary : isMiddle ? colors.card : 'transparent';

    const styles = StyleSheet.create({
        wrapper: {
            alignSelf: 'stretch',
            alignItems: 'center',
        },
        fillers: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: scaleVertical(43),
            flexDirection: 'row',
        },
        filler: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        container: {
            width: scaleVertical(43),
            height: scaleVertical(43),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
            borderTopLeftRadius: styleDetails.isRangeStart ? 8 : 0,
            borderBottomLeftRadius: styleDetails.isRangeStart ? 8 : 0,
            borderTopRightRadius: styleDetails.isRangeEnd ? 8 : 0,
            borderBottomRightRadius: styleDetails.isRangeEnd ? 8 : 0,
        },
        text: {
            color: styleDetails.isToday && !styleDetails.isSelected
                ? colors.primary
                : styleDetails.isOutsideMonth || styleDetails.isDisabled
                  ? colors.text_light
                  : colors.text_strong,
        },
        status: {
            width: scaleVertical(4),
            height: scaleVertical(4),
            borderRadius: scaleVertical(4),
            backgroundColor: 'transparent',
        },
    });

    return styles;
};
