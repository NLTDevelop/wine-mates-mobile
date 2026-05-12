import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        stateContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        itemSeparator: {
            width: '100%',
            height: scaleVertical(1),
            backgroundColor: colors.border,
        },
        flatlist: {
            marginTop: scaleVertical(16),
        },
    });

    return styles;
};
