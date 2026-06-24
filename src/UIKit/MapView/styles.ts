import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (_colors: IColors) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            overflow: 'hidden',
        },
        map: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        clusterContainer: {
            width: scaleHorizontal(50),
            height: scaleHorizontal(50),
            borderRadius: scaleHorizontal(25),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return styles;
};
