import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
        },
        containerStyle: {
            flexGrow: 1,
            gap: scaleVertical(12),
            paddingBottom: scaleVertical(16),
        },
        button: {
            borderColor: colors.border_light,
            alignSelf: 'center',
            gap: scaleHorizontal(12),
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(8),
            marginBottom: scaleVertical(16),
        },
        plusIconContainer: {
            width: scaleVertical(32),
            height: scaleVertical(32),
            borderRadius: scaleVertical(32),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
