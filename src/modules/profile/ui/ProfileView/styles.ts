import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
        },
        header: {
            marginTop: scaleVertical(32),
            marginBottom: scaleVertical(24),
            alignItems: 'center',
        },
        name: {
            marginTop: scaleVertical(8),
            marginBottom: scaleVertical(4),
        },
        expertLevel: {
            color: colors.text_primary,
        },
        list: {
            flexGrow: 1,
        }
    });
    return styles;
};
