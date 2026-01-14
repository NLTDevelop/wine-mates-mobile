import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        title: {
            textAlign: 'center',
            color: colors.text_light,
            paddingHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        list: {
            marginBottom: scaleVertical(24),
        },
        contentContainerStyle: {
            paddingBottom: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            flexGrow: 1,
            gap: scaleVertical(16),
        },
        button: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
