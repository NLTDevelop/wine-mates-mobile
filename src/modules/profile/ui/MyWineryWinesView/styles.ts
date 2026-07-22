import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        list: {
            flex: 1,
            marginBottom: scaleVertical(16),
        },
        contentContainer: {
            flexGrow: 1,
            gap: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
        },
        actions: {
            gap: scaleVertical(8),
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
        },
        plusIconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return styles;
};
