import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, insetBottom: number) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        header: {
            paddingVertical: scaleVertical(16),
            justifyContent: 'center',
        },
        closeContainer: {
            position: 'absolute',
            right: scaleHorizontal(16),
            top: scaleVertical(16),
            zIndex: 2,
        },
        title: {
            textAlign: 'center',
        },
        searchContainer: {
            marginHorizontal: scaleHorizontal(16),
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        listContentContainer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: insetBottom + scaleVertical(24),
            rowGap: scaleVertical(24),
        },
    });
    
    return styles;
};
