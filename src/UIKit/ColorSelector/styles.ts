import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        colorsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            columnGap: scaleHorizontal(8),
            rowGap: scaleVertical(8),
            marginBottom: scaleVertical(8),
        },
        colorButton: {},
    });

    return styles;
};
