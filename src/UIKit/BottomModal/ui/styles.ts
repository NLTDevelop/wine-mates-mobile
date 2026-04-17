import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical, size } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.text,
        },
        contentContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: size.height * 0.9,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            minHeight: scaleVertical(56),
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
        closeIcon: {
            color: colors.text,
        },
        title: {
            textAlign: 'center',
            color: colors.text,
        },
        scrollView: {
        },
        scrollContent: {
            padding: scaleHorizontal(16),
            paddingBottom: bottomInset + scaleVertical(16),
        },
    });
    return styles;
};
