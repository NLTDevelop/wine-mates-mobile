import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '../../../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        title: {
            marginBottom: scaleVertical(24),
            textAlign: 'center',
        },
        passwordInput: {
            marginBottom: 0,
        },
        text: {
            color: colors.text,
            borderBottomWidth: 1,
            borderBottomColor: colors.text,
        },
        forgotButton: {
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(16),
            alignSelf: 'flex-start',
        },
        separator: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: scaleVertical(40),
        },
        line: {
            height: 1,
            width: scaleHorizontal(131),
            backgroundColor: colors.background_light,
        },
        googleButton: {
            marginBottom: scaleVertical(12),
        },
        empty: {
            height: scaleVertical(24),
            width: scaleVertical(24),
        },
    });
    return styles;
};
