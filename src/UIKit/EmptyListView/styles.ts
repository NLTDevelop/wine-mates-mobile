import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(32),
        },
        lottie: {
            width: scaleHorizontal(100),
            height: scaleVertical(100),
        },
        image: {
            width: scaleHorizontal(229),
            height: scaleHorizontal(240),
        },
        title: {
            marginTop: scaleVertical(16),
            marginBottom: scaleVertical(12),
            textAlign: 'center',
        },
        description: {
            textAlign: 'center',
            marginBottom: scaleVertical(32),
        },
    });
    return styles;
};
