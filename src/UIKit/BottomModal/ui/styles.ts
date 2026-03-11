import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical, size } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
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
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
        },
        closeButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeIcon: {
            color: colors.text,
        },
        title: {
            flex: 1,
            textAlign: 'center',
            color: colors.text,
        },
        scrollView: {
        },
        scrollContent: {
            padding: scaleHorizontal(16),
            paddingBottom: scaleVertical(32),
        },
    });
    return styles;
};
