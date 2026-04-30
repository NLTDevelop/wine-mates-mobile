import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
        },
        containerStyle: {
                    flexGrow: 1,
                    gap: scaleVertical(12),
                    paddingBottom: scaleVertical(16),
                },

        emptyImage: {
            width: scaleVertical(230),
            height: scaleVertical(230),
            resizeMode: 'cover',
        },
    });

    return styles;
};
