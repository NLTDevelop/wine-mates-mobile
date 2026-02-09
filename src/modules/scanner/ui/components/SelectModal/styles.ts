import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            marginBottom: 0,
            marginTop: 0,
            marginHorizontal: scaleHorizontal(16),
        },
        modalContent: {
            width: '100%',
            padding: scaleVertical(16),
            borderRadius: 24,
            backgroundColor: colors.background,
        },
        list: {
            maxHeight: scaleVertical(300),
            paddingRight: scaleHorizontal(16),
        },
        contentContainer: {
            flexGrow: 1,
            rowGap: scaleVertical(7),
        },
    });

    return styles;
};
