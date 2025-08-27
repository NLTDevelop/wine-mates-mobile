import { StyleSheet } from 'react-native';
import { IColors } from '../../../../../UIProvider/theme/IColors';
import { scaleVertical } from '../../../../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: scaleVertical(24),
        },
        linkText: {
            color: colors.text_primary,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
        },
    });
    return styles;
};
