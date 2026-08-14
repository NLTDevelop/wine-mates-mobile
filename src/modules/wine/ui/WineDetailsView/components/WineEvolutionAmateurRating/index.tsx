import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionRatingRow } from '@/modules/wine/types/IWineEvolution';
import { WineEvolutionRatingCell } from '../WineEvolutionTab/components/WineEvolutionRatingCell';
import { getStyles } from './styles';

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
                    <Typography
                        text={t('wine.evolution.sex')}
                        variant="body_400"
                        style={styles.ratingLabel}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    />
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
                    <Typography
                        text={rows[0].label}
                        variant="body_400"
                        style={styles.ratingLabel}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    />
                    <WineEvolutionRatingCell rating={rows[0].ratings[0]} />
                    <WineEvolutionRatingCell rating={rows[0].ratings[1]} />
                    <WineEvolutionRatingCell rating={rows[0].ratings[2]} />
                    <WineEvolutionRatingCell rating={rows[0].ratings[3]} />
                    <WineEvolutionRatingCell rating={rows[0].ratings[4]} />
                </View>
                <View style={styles.ratingRow}>
                    <Typography
                        text={rows[1].label}
                        variant="body_400"
                        style={styles.ratingLabel}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    />
                    <WineEvolutionRatingCell rating={rows[1].ratings[0]} />
                    <WineEvolutionRatingCell rating={rows[1].ratings[1]} />
                    <WineEvolutionRatingCell rating={rows[1].ratings[2]} />
                    <WineEvolutionRatingCell rating={rows[1].ratings[3]} />
                    <WineEvolutionRatingCell rating={rows[1].ratings[4]} />
                </View>
            </View>
        </View>
    );
};
