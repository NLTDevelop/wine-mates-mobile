import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        containerStyle : {
            flexGrow: 1,
            gap: scaleVertical(16),
        },
    });
    return styles;
};
