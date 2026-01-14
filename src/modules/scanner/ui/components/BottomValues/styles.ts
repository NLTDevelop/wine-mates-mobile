import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: scaleVertical(6),
        },
        valueItem: {
            flex: 1,
        },
        left: {
            alignItems: 'flex-start',
        },
        center: {
            alignItems: 'center',
        },
        right: {
            alignItems: 'flex-end',
        },
        text: {
            maxWidth: scaleHorizontal(105),
            width: '100%',
            flexShrink: 1,
        },
        textLeft: {
            textAlign: 'left',
        },
        textCenter: {
            textAlign: 'center',
        },
        textRight: {
            textAlign: 'right',
        },
    });
    return styles;
};
