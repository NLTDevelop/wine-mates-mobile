import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(32),
            paddingBottom: scaleVertical(48),
        },
        image: {
            width: scaleHorizontal(216),
            height: scaleHorizontal(216),
        },
        title: {
            color: colors.text,
            marginTop: scaleVertical(20),
            textAlign: 'center',
        },
        description: {
            color: colors.text_light,
            marginTop: scaleVertical(12),
            maxWidth: scaleHorizontal(300),
            textAlign: 'center',
        },
    });

    return styles;
};
