import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleLineHeight, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            height: scaleVertical(24),
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: scaleVertical(16),
        },
        title: {
            flex: 1,
            color: colors.text,
            lineHeight: scaleLineHeight(20),
            textAlign: 'center',
            paddingLeft: scaleHorizontal(24),
        },
        closeButton: {
            width: scaleHorizontal(24),
            height: scaleHorizontal(24),
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return styles;
};
