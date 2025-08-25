import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const getStyles = (colors: IColors, isBottomPadding?: boolean, scrollEnabled?: boolean) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        keyboardAvoidingContainer: {
            flex: 1,
            backgroundColor: colors.background,
            paddingBottom: !scrollEnabled && isBottomPadding ? initialWindowMetrics?.insets.bottom : 0,
        },
        scroll: {
            flex: 1,
        },
        contentContainerStyle: {
            flexGrow: 1,
            paddingBottom: isBottomPadding ? initialWindowMetrics?.insets.bottom : 0,
        },
    });
    return styles;
};
