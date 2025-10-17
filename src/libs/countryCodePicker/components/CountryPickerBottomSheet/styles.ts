import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, insetBottom: number) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
        },
        headerContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        header: {
            padding: scaleVertical(16),
        },
        closeContainer: {
            position: 'absolute',
            top: scaleVertical(16),
            left: scaleVertical(16),
            zIndex: 2,
        },
        title: {
            textAlign: 'center',
        },
        searchContainer: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(24),
        },
        scrollContentContainer: {
            flexGrow: 1,
        },
        listContentContainer: {
            rowGap: scaleVertical(24),
            paddingBottom: insetBottom + scaleVertical(16),
        },
    });

    return styles;
};
