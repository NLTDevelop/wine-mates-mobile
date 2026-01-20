import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            gap: scaleVertical(4),
            paddingBottom: scaleVertical(10),
            paddingHorizontal: scaleHorizontal(16),
            overflow: 'hidden',
        },
        infoContainer: {
            marginBottom: scaleVertical(6),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        valueContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: scaleVertical(6),
        },
        description: {
            color: colors.text_light,
        },
        decoratorItem: {
            width: scaleHorizontal(2),
            height: '100%',
            backgroundColor: colors.background,
        },
    });
    return styles;
};
