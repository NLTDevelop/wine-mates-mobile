import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (_colors: IColors, gap: number) => {
    const styles = StyleSheet.create({
        container: {
            overflow: 'hidden',
            width: '100%',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: scaleHorizontal(gap),
        },
        contentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(gap),
        },
        divider: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
