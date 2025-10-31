import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        mainContainer: {
            flex: 1,
        },
        title: {
            textAlign: 'center',
            marginBottom: scaleVertical(8),
        },
        role: {
            color: colors.primary,
            textAlign: 'center',
            marginBottom: scaleVertical(24),
        },
        formContainer: {
            gap: scaleVertical(16),
            marginBottom: scaleVertical(16),
        },
        exampleText: {
            marginLeft: scaleHorizontal(16),
            marginTop: scaleVertical(6),
            color: colors.text_light,
        },
        input: {
            marginBottom: 0,
        },
        footer: {
            gap: scaleVertical(24),
        },
        backdrop: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0)',
            zIndex: 20,
        },
        pickerWrapper: {
            width: '100%',
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: bottomInset,
            zIndex: 21,
        },
    });

    return styles;
};
