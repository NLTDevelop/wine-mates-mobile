import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { IWineEvolutionRatingRow } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from '../WineEvolutionTab/styles';

interface IProps {
    ageGroups: string[];
    rows: IWineEvolutionRatingRow[];
}

export const WineEvolutionAmateurRating = ({ ageGroups, rows }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.ratingCard}>
            <View style={styles.ratingTable}>
                <View style={styles.ratingHeader}>
                    <Typography text={t('wine.evolution.sex')} variant="body_400" style={styles.ratingLabel} numberOfLines={1} adjustsFontSizeToFit />
                    <View style={[styles.ratingCell, styles.ratingHeaderCell]}>
                        <View style={[styles.ratingHeaderAccent, styles.ratingHeaderAccentRed]} />
                        <Typography text={ageGroups[0]} variant="subtitle_12_400" style={styles.ratingHeaderText} />
                    </View>
                    <View style={[styles.ratingCell, styles.ratingHeaderCell]}>
                        <View style={[styles.ratingHeaderAccent, styles.ratingHeaderAccentGreen]} />
                        <Typography text={ageGroups[1]} variant="subtitle_12_400" style={styles.ratingHeaderText} />
                    </View>
                    <View style={[styles.ratingCell, styles.ratingHeaderCell]}>
                        <View style={[styles.ratingHeaderAccent, styles.ratingHeaderAccentBlue]} />
                        <Typography text={ageGroups[2]} variant="subtitle_12_400" style={styles.ratingHeaderText} />
                    </View>
                    <View style={[styles.ratingCell, styles.ratingHeaderCell]}>
                        <View style={[styles.ratingHeaderAccent, styles.ratingHeaderAccentYellow]} />
                        <Typography text={ageGroups[3]} variant="subtitle_12_400" style={styles.ratingHeaderText} />
                    </View>
                    <View style={[styles.ratingCell, styles.ratingHeaderCell]}>
                        <View style={[styles.ratingHeaderAccent, styles.ratingHeaderAccentPurple]} />
                        <Typography text={ageGroups[4]} variant="subtitle_12_400" style={styles.ratingHeaderText} />
                    </View>
                </View>
                <View style={styles.ratingRow}>
                    <Typography text={rows[0].label} variant="body_400" style={styles.ratingLabel} numberOfLines={1} adjustsFontSizeToFit />
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[0].ratings[0].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[0].ratings[0].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[0].ratings[0].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[0].ratings[1].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[0].ratings[1].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[0].ratings[1].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[0].ratings[2].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[0].ratings[2].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[0].ratings[2].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[0].ratings[3].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[0].ratings[3].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[0].ratings[3].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[0].ratings[4].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[0].ratings[4].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[0].ratings[4].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                </View>
                <View style={styles.ratingRow}>
                    <Typography text={rows[1].label} variant="body_400" style={styles.ratingLabel} numberOfLines={1} adjustsFontSizeToFit />
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[1].ratings[0].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[1].ratings[0].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[1].ratings[0].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[1].ratings[1].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[1].ratings[1].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[1].ratings[1].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[1].ratings[2].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[1].ratings[2].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[1].ratings[2].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[1].ratings[3].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[1].ratings[3].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[1].ratings[3].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                    <View style={styles.ratingCell}>
                        <View style={styles.ratingValueRow}>
                            <Typography
                                text={rows[1].ratings[4].scoreText}
                                variant="subtitle_12_400"
                                style={styles.ratingValue}
                            />
                            <FilledStarIcon
                                width={16}
                                height={16}
                                color={rows[1].ratings[4].score === null ? colors.background : colors.stars}
                            />
                        </View>
                        <Typography
                            text={rows[1].ratings[4].reviewsText}
                            variant="subtitle_12_400"
                            style={styles.ratingReviews}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
