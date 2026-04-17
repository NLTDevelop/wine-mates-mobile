import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        markerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            borderRadius: 20,
            padding: 8,
            borderWidth: 2,
            borderColor: colors.primary,
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        markerSelected: {
            backgroundColor: colors.primary,
            borderColor: colors.border,
            transform: [{ scale: 1.2 }],
        },
        iconWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        defaultMarker: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return styles;
};
