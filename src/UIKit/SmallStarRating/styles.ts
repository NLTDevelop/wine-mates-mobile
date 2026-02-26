import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (_colors: IColors) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        star: {
            marginHorizontal: scaleHorizontal(1),
        },
        starIconContainer: {
            justifyContent: 'center',
        },
        starFillOverlay: {
            position: 'absolute',
            overflow: 'hidden',
        },
    });
