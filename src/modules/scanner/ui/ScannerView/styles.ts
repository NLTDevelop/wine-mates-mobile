import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, topInset: number, bottomInset: number) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background_inverted,
        },
        topBar: {
            position: 'absolute',
            top: scaleVertical(16) + topInset,
            left: 0,
            right: 0,
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        button: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            backgroundColor: colors.background,
            borderRadius: scaleVertical(22),
            justifyContent: 'center',
            alignItems: 'center',
        },
        bottomButtons: {
            width: scaleVertical(48),
            height: scaleVertical(48),
            backgroundColor: colors.background,
            borderRadius: scaleVertical(30),
            justifyContent: 'center',
            alignItems: 'center',
        },
        bottomBar: {
            position: 'absolute',
            bottom: scaleVertical(32) + bottomInset,
            left: 0,
            right: 0,
            paddingHorizontal: scaleHorizontal(40),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        mainShotButton: {
            width: scaleVertical(72),
            height: scaleVertical(72),
            borderRadius: scaleVertical(40),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        mainShotInner:{
            width: scaleVertical(64),
            height: scaleVertical(64),
            borderRadius: scaleVertical(40),
            backgroundColor: colors.background,
            borderWidth: 2,
            borderColor: colors.background_grey,
        },
        openCameraButton: {
            marginBottom: scaleVertical(16),
        },
        emptyContainer: {
            width: scaleVertical(48),
            height: scaleVertical(48),
        }
    });
    return styles;
};
