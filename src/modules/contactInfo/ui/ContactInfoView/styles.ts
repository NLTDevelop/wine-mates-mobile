import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            gap: scaleVertical(16),
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
        },
        list: {
            marginBottom: scaleVertical(16),
        },
        contentContainerStyle: {
            paddingBottom: scaleVertical(16),
            flexGrow: 1,
            gap: scaleVertical(16),
        },
        addContainer: {
            height: scaleVertical(32),
            width: scaleVertical(32),
            borderRadius: scaleVertical(32),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Medium',
        }
    });
    return styles;
};
