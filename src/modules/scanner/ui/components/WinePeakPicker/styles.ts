import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(4),
            paddingBottom: scaleVertical(10),
            paddingHorizontal: scaleHorizontal(16),
        },
        infoContainer: {
            marginBottom: scaleVertical(6),
        },
        description: {
            color: colors.text_light,
        },
        pickerButton: {
            backgroundColor: colors.background_grey,
            borderRadius: 12,
            paddingVertical: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
        },
        pickerText: {
            color: colors.text,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
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
        pickerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return styles;
};
