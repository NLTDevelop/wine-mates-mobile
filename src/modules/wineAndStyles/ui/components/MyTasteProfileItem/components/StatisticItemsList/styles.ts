import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        nestedCollapseWrapper: {
            marginTop: scaleVertical(8),
        },
        nestedContent: {
            gap: scaleVertical(4),
        },
        listItem: {
            paddingVertical: scaleVertical(2),
        },
    });
    return styles;
};
