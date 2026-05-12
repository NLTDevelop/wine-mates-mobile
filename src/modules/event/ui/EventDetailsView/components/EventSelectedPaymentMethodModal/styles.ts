import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerSide: {
            width: scaleHorizontal(32),
            height: scaleHorizontal(32),
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            flex: 1,
            color: colors.text,
            textAlign: 'center',
        },
        contentContainer: {
            alignItems: 'center',
            gap: scaleVertical(16),
        },
        qrImage: {
            width: scaleVertical(186),
            height: scaleVertical(186),
        },
        paymentDetails: {
            color: colors.text,
            textAlign: 'center',
        },
        description: {
            color: colors.text_light,
            textAlign: 'center',
        },
        closeButton: {
            width: '100%',
        },
        footerContainer: {
            width: '100%',
        },
    });

    return styles;
};
