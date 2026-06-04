import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(56),
        },
        description: {
            marginTop: scaleVertical(18),
            textAlign: 'center',
            color: '#757575',
            lineHeight: scaleVertical(22),
        },
    });

    return styles;
};
