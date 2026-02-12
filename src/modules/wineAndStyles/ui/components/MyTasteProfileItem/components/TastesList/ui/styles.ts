import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        nestedCollapseWrapper: {
            marginTop: scaleVertical(8),
        },
        contentContainer: {
            gap: scaleVertical(12),
        },
        nestedContent: {
            gap: scaleVertical(4),
        },
        listItem: {
            paddingVertical: scaleVertical(2),
        },
        slidersContainer: {
            gap: scaleVertical(16),
        },
        characteristicItem: {
            paddingHorizontal: 0,
        },
    });
    return styles;
};
