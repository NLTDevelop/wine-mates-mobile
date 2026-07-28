import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        content: {
            gap: scaleVertical(18),
            paddingBottom: scaleVertical(8),
        },
    });

    return styles;
};
