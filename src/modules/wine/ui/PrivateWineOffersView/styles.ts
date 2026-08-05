import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        list: {
            flexGrow: 1,
            paddingBottom: scaleVertical(20),
            gap: scaleVertical(4),
        },
    });

    return styles;
};
