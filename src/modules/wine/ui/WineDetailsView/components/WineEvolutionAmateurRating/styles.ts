import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        ratingCard: {
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: 8,
            overflow: 'hidden',
        },
        ratingTable: {
            gap: 0,
        },
        ratingHeader: {
            height: scaleVertical(40),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.evolution_background_grey,
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border_light,
        },
        ratingRow: {
            height: scaleVertical(47),
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border_light,
        },
        ratingLabel: {
            width: scaleHorizontal(68),
            paddingLeft: scaleHorizontal(8),
            color: colors.text,
        },
        ratingCell: {
            width: scaleHorizontal(55),
            alignItems: 'center',
            justifyContent: 'center',
        },
        ratingHeaderCell: {
            height: scaleVertical(25),
            position: 'relative',
        },
        ratingHeaderAccent: {
            position: 'absolute',
            top: 0,
            alignSelf: 'center',
            width: scaleHorizontal(36),
            height: scaleVertical(2),
            borderRadius: 2,
        },
        ratingHeaderAccentRed: {
            backgroundColor: colors.evolutionChartRed,
        },
        ratingHeaderAccentGreen: {
            backgroundColor: colors.evolutionChartGreen,
        },
        ratingHeaderAccentBlue: {
            backgroundColor: colors.evolutionChartBlue,
        },
        ratingHeaderAccentYellow: {
            backgroundColor: colors.evolutionChartYellow,
        },
        ratingHeaderAccentPurple: {
            backgroundColor: colors.evolutionChartPurple,
        },
        ratingHeaderText: {
            width: '100%',
            color: colors.text,
            textAlign: 'center',
        },
    });

    return styles;
};
