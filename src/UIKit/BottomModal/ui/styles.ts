import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
        keyboardBackground: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
        },
        container: {
            overflow: 'hidden',
        },
        fullScreenContainer: {
            flex: 1,
            minHeight: 0,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            position: 'relative',
        },
        titleContainer: {
            position: 'absolute',
            left: scaleHorizontal(16),
            right: scaleHorizontal(16),
            top: scaleVertical(16),
            height: scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeButton: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            textAlign: 'center',
            color: colors.text,
        },
        contentContainer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: bottomInset + scaleVertical(16),
        },
        fullScreenContentContainer: {
            flex: 1,
            minHeight: 0,
        },
    });

    return styles;
};
