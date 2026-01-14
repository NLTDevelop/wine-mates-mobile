import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number, topInset: number) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: bottomInset + scaleVertical(16),
            backgroundColor: colors.background,
        },
        headerContainer: {
            position: 'absolute',
            top: topInset,
            left: 0,
            zIndex: 2,
        },
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: scaleVertical(8),
        },
        title: {
            textAlign: 'center',
        },
        subtitle: {
            textAlign: 'center',
            color: colors.text_light,
        },
    });
    
    return styles;
};
