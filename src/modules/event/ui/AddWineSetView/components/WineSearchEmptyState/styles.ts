import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(24),
            gap: scaleVertical(16),
        },
        content: {
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            color: colors.text_light,
            textAlign: 'center',
        },
    });

    return styles;
};
