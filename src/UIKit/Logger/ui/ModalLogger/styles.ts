import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const INSET_TOP = initialWindowMetrics?.insets.top || 0;
const INSET_BOTTOM = initialWindowMetrics?.insets.bottom || 0;

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background_grey,
            paddingTop: INSET_TOP,
            paddingBottom: INSET_BOTTOM,
        },
        header: {
            height: 50,
            width: '100%',
            backgroundColor: colors.background_grey,
            paddingRight: 20,
            shadowColor: colors.border_strong,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            elevation: 3,
            zIndex: 2,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        button: {
            height: 50,
            paddingHorizontal: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontSize: 18,
            color: colors.primary,
        },
        list: {
            flex: 1,
            paddingVertical: 16,
        }
    });
    return styles;
};
