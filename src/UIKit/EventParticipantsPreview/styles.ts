import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatarsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        overlappedAvatar: {
            marginLeft: scaleHorizontal(-4),
            borderWidth: scaleHorizontal(2),
            borderColor: colors.background,
        },
        interestingText: {
            color: colors.text,
            marginLeft: scaleHorizontal(4),
        },
    });

    return styles;
};
