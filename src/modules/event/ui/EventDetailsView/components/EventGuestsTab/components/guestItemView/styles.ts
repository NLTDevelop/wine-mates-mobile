import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, hasActions: boolean) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            height: hasActions ? scaleVertical(104) : scaleVertical(70),
            justifyContent: hasActions ? 'space-between' : 'center',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(16),
        },
        userAvatarInfoContainer: {
            flexDirection: 'row',
            height: scaleVertical(40),
        },
        userInfoContainer: {
            marginLeft: scaleHorizontal(8),
            justifyContent: 'center',
        },
        fullname: {
            fontSize: scaleFontSize(14),
        },
        age: {
            fontSize: scaleFontSize(12),
            marginTop: scaleVertical(2),
        },
        actionsContainer: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        buttonStyle: {
            flex: 1,
            height: scaleVertical(32),
        },
        secondaryText: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Medium',
        },
    });

    return styles;
};
