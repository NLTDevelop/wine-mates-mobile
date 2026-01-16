import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        tabBarContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.background_light + 66,
            padding: scaleVertical(2),
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
            borderRadius: 8,
        },
        tabItem: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: scaleVertical(6),
            backgroundColor: 'transparent',
            borderRadius: 8,
        },
        activeTabItem: {
            backgroundColor: colors.background,
        },
        tabLabel: {
            color: colors.text,
        },
        tabLabelRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        crownIcon: {
            marginRight: scaleHorizontal(4),
        },
    });

    return styles;
};
