import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

const BUTTON_SIZE = scaleVertical(40);

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        footerContainer: {
            gap: scaleVertical(8),
        },
        buttonTasteContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        button: {
            height: BUTTON_SIZE,
            flex: 1,
        },
    });
    return styles;
};
