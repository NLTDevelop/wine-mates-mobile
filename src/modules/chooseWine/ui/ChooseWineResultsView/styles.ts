import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        screen: {
            flex: 1,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(12),
        },
        search: {
            flex: 1,
        },
        list: {
            flex: 1,
        },
        contentContainer: {
            flexGrow: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
            gap: scaleVertical(16),
        },
    });

    return styles;
};
