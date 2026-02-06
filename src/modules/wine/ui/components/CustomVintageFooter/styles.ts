import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const CONTAINER_HEIGHT = scaleVertical(48);
    
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border_light,
            height: CONTAINER_HEIGHT,
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(14),
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(8),
            height: CONTAINER_HEIGHT,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            height: CONTAINER_HEIGHT,
        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border_light,
            borderRadius: 8,
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(8),
            fontSize: 16,
            color: colors.text,
        },
        inputError: {
            borderColor: colors.error,
        },
        iconButton: {
            width: scaleHorizontal(40),
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border_light,
        },
        errorText: {
            color: colors.error,
            fontSize: 12,
            marginTop: scaleVertical(4),
        },
    });
    return styles;
};
