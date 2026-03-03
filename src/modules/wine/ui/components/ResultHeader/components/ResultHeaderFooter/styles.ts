import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

const BUTTON_SIZE = scaleVertical(40);

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        footerContainer: {
            gap: scaleVertical(4),
        },
        buttonTasteContainer: {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        button: {
            height: BUTTON_SIZE,
            minWidth: scaleHorizontal(162),
        },
    });
    return styles;
};
