import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
        },
        addButton: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        search: {
            marginTop: scaleVertical(8),
            marginBottom: scaleVertical(16),
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: scaleVertical(24),
        },
    });

    return styles;
};
