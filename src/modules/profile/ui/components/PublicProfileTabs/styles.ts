import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border,
        },
        contentContainer: {
            flexDirection: 'row',
            flexGrow: 1,
        },
    });

    return styles;
};
