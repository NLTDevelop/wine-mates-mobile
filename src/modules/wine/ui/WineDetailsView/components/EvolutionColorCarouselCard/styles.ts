import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        carouselItem: {
            width: scaleHorizontal(247),
            padding: scaleHorizontal(12),
            backgroundColor: colors.evolution_background_grey,
            borderRadius: scaleVertical(12),
        },
        statCard: {
            width: scaleHorizontal(223),
            minHeight: scaleVertical(100),
            gap: scaleVertical(20),
            padding: scaleHorizontal(12),
            backgroundColor: colors.background,
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: scaleVertical(8),
        },
        statBars: {
            gap: scaleVertical(8),
        },
        statBar: {
            minHeight: scaleVertical(46),
            paddingVertical: scaleVertical(6),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scaleVertical(4),
        },
        statLabel: {
            textAlign: 'center',
        },
        statReviews: {
            textAlign: 'center',
            opacity: 0.7,
        },
        avatarContent: {
            gap: scaleVertical(7),
        },
        avatarRow: {
            flexDirection: 'row',
            alignItems: 'center',
            height: scaleVertical(24),
        },
        avatar: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderWidth: scaleVertical(1),
            borderColor: colors.text_inverted,
            borderRadius: scaleVertical(24),
            marginRight: scaleHorizontal(-8),
        },
        additionalPeople: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.evolutionPeopleBackground,
            borderWidth: scaleVertical(1),
            borderColor: colors.text_inverted,
            borderRadius: scaleVertical(24),
        },
        additionalPeopleText: {
            color: colors.primary,
        },
        avatarDescription: {
            color: colors.text_light,
        },
        statYear: {
            color: colors.text,
            textAlign: 'center',
        },
        emptyCard: {
            minHeight: scaleVertical(76),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.evolution_background_grey,
            borderRadius: scaleVertical(4),
        },
        emptyCardText: {
            color: colors.text,
        },
    });

    return styles;
};
