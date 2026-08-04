import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

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
        tabContainer: {
            flex: 1,
        },
        hiddenTabContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0,
        },
    });
    return styles;
};
