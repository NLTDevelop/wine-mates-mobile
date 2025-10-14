import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: scaleHorizontal(16),
        },
        mainContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        flag: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderRadius: scaleVertical(20),
        },
        name: {
            maxWidth: scaleVertical(200),
            flexShrink: 1,
        },
        text: {
            color: colors.text_light,
        },
    });

    return styles;
};
