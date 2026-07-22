import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: 12,
            paddingHorizontal: scaleVertical(12),
            flexDirection: 'row',
            minHeight: scaleVertical(48),
            alignItems: 'center',
            gap: scaleHorizontal(8),
            borderWidth: scaleVertical(1),
            borderColor: colors.border_light,
        },
        button: {
            height: scaleVertical(24),
            width: scaleVertical(24),
            borderRadius: scaleVertical(24),
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
        filterButton: {
            position: 'relative',
        },
        filterBadge: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: scaleVertical(8),
            height: scaleVertical(8),
            borderRadius: 4,
            backgroundColor: colors.primary,
        },
        input: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            height: "100%",
            flex: 1,
            color: colors.text,
            fontFamily: 'VisueltPro-Regular',
            fontSize: scaleFontSize(16),
        },
    });
    return styles;
};
