import { StyleSheet, Dimensions } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
            maxHeight: SCREEN_HEIGHT * 0.9,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
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
            flex: 1,
        },
        scrollContent: {
            padding: scaleHorizontal(16),
        },
    });
    return styles;
};
