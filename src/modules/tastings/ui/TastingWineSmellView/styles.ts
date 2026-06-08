import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
        },
        mainContainer:{
            flex: 1,
        },
        scrollContent: {
            flex: 1,
        },
        title: {
            textAlign: 'center',
            color: colors.text_light,
            marginBottom: scaleVertical(16),
        },
        list: {
            maxHeight: scaleVertical(300),
            marginBottom: scaleVertical(16),
            paddingRight: scaleHorizontal(16),
        },
        contentContainer: {
            flexGrow: 1,
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
        indicator: {
            width: scaleHorizontal(6),
            backgroundColor: colors.primary,
        },
    });
    return styles;
};
