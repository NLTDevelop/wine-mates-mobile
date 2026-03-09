import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    return StyleSheet.create({
        container: {
            marginTop: scaleVertical(12),
        },
        contentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    });
};
