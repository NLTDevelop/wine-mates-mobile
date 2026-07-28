import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        containerStyle: {
            flexGrow: 1,
            gap: scaleVertical(12),
            paddingBottom: scaleVertical(16),
        },
        evolutionContent: {
            flexGrow: 1,
        },
        evolutionText: {
            textAlign: 'center',
            marginTop: scaleVertical(40),
            marginHorizontal: scaleHorizontal(16),
        },
    });
    return styles;
};
