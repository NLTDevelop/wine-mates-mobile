import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            marginHorizontal: scaleHorizontal(16),
            marginVertical: scaleVertical(12),
            justifyContent: 'space-between',
        },
        avatarWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        userNameWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        actionsWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        }
    });
    return styles;
};
