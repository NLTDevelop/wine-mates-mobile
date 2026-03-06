import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';

export const getStyles = (_colors: IColors, hasLeft: boolean, hasRight: boolean) => {
    const getTitleStyle = () => {
        if (hasLeft && hasRight) {
            return { flex: 1, textAlign: 'center' as const };
        }
        if (hasLeft) {
            return { marginLeft: scaleHorizontal(16) };
        }
        return {};
    };

    const getHeaderJustify = () => {
        if (hasLeft && hasRight) {
            return 'space-between';
        }
        return 'flex-start';
    };

    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
        },
        header: {
            flexDirection: 'row',
            justifyContent: getHeaderJustify(),
            alignItems: 'center',
        },
        title: getTitleStyle(),
        content: {
            width: '100%',
        },
    });
    return styles;
};
