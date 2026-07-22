import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        headerContent: {
            marginBottom: scaleVertical(16),
        },
        followButton: {
            marginBottom: scaleVertical(12),
        },
        listContent: {
            flexGrow: 1,
            gap: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
    });

    return styles;
};
