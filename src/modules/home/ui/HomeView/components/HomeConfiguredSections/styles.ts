import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        contentContainer: {
            flexGrow: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(16),
            gap: scaleVertical(16),
        },
        placementContentContainer: {
            flexGrow: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(16),
        },
        placementListContainer: {
            flexGrow: 1,
        },
        listFooterContainer: {
            paddingTop: scaleVertical(16),
        },
        placementFooter: {
            paddingTop: scaleVertical(24),
        },
        footer: {
            gap: scaleVertical(8),
        },
    });

    return styles;
};
