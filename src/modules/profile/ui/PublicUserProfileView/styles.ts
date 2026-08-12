import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        followButton: {
            marginBottom: scaleVertical(12),
        },
        tastingsSearch: {
            marginTop: scaleVertical(16),
        },
        listContent: {
            flexGrow: 1,
            gap: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
        wineListContent: {
            flexGrow: 1,
            gap: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
    });

    return styles;
};
