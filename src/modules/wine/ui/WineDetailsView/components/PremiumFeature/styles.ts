import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(24),
            paddingVertical: scaleVertical(40),
        },
        title: {
            marginTop: scaleVertical(16),
        },
        description: {
            color: colors.text_middle,
            textAlign: 'center',
            marginTop: scaleVertical(8),
        },
        button: {
            width: '100%',
            marginTop: scaleVertical(20),
        },
    });

    return styles;
};
