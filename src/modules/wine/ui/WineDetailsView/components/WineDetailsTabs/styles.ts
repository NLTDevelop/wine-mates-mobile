import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border_light,
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        compactBottomSpacing: {
            marginBottom: 0,
        },
        item: {
            flex: 1,
            minHeight: scaleVertical(33),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(2),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(2),
        },
        text: {
            color: colors.text,
            textAlign: 'center',
        },
        activeText: {
            color: colors.primary,
            textAlign: 'center',
        },
        indicator: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: scaleVertical(2),
            backgroundColor: colors.primary,
        },
    });

    return styles;
};
