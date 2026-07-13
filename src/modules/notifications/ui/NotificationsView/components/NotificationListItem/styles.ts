import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, isRead: boolean) => {
    const styles = StyleSheet.create({
        swipeContainer: {
            backgroundColor: colors.background_middle,
        },
        container: {
            minHeight: scaleVertical(92),
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(14),
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            backgroundColor: isRead ? colors.background : colors.primary_secondary,
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border_light,
        },
        appIcon: {
            width: scaleHorizontal(48),
            height: scaleVertical(48),
            borderRadius: 12,
        },
        content: {
            flex: 1,
            gap: scaleVertical(3),
        },
        title: {
            color: colors.text,
        },
        body: {
            color: colors.text_light,
        },
        time: {
            color: colors.text_light,
            alignSelf: 'flex-start',
            marginTop: scaleVertical(2),
        },
        rightActionContainer: {
            width: scaleHorizontal(88),
            backgroundColor: isRead ? colors.background : colors.primary_secondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        deleteButton: {
            width: scaleHorizontal(67),
            height: scaleVertical(48),
            backgroundColor: colors.primary,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return styles;
};
