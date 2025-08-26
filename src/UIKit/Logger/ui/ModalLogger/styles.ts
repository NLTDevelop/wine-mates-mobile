import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.info,
        },
        header: {
            height: 50,
            width: '100%',
            backgroundColor: colors.info,
            paddingRight: 20,
            shadowColor: colors.background,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            elevation: 4,
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
            fontWeight: '500',
            color: colors.primary,
        },
    });
    return styles;
};
