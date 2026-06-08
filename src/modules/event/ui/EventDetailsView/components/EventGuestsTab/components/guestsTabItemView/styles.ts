import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, isActive: boolean) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            height: scaleVertical(33),
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: isActive ? colors.primary : colors.border,
            borderBottomWidth: scaleVertical(1),
            paddingHorizontal: scaleHorizontal(4),
        },
        tabName: {
            color: colors.text,
            textAlign: 'center',
            width: '100%',
        },
    });

    return styles;
};
