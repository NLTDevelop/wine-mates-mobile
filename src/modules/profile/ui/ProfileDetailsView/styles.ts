import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(8),
            paddingBottom: scaleVertical(24),
        },
        roleText: {
            color: colors.text,
        },
        fieldsContainer: {
            gap: scaleVertical(10),
        },
        editButton: {
            minWidth: scaleHorizontal(72),
            height: scaleVertical(40),
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        editButtonText: {
            color: colors.text,
        },
    });

    return styles;
};
