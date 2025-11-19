import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
        },
        title: {
            textAlign: 'center',
            color: colors.text_light,
            marginBottom: scaleVertical(16),
        },
        list: {
            flexGrow: 1,
        },
        contentContainer: {
            rowGap: scaleVertical(7),
        },
        searchContainer: {
            marginBottom: scaleVertical(12),
        },
        input: {
            marginBottom: scaleVertical(16),
        },
        button: {
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
