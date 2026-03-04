import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        mapContainer: {
            height: scaleVertical(474),
            borderRadius: 12,
            overflow: 'hidden',
        }
    });
    return styles;
};
