import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { isIOS, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            minHeight: 0,
            gap: scaleVertical(16),
        },
        searchContainer: {
            marginBottom: scaleVertical(8),
        },
        listContainer: {
            flex: 1,
            minHeight: 0,
        },
        list: {
            flex: 1,
            minHeight: 0,
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: isIOS ? scaleVertical(32) : scaleVertical(16),
        },
        divider: {
            height: scaleVertical(1),
            backgroundColor: colors.border_light,
        },
    });

    return styles;
};
