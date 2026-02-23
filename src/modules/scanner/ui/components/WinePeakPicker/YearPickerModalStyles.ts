import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';
import { StyleSheet } from 'react-native';

export const getYearPickerModalStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        backdropPressable: {
            flex: 1,
        },
        modalWrapper: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(20),
            gap: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(16),
        },
        headerSpacer: {
            width: scaleHorizontal(24),
        },
        resetText: {
            color: colors.primary,
        },
    });
    return styles;
};
