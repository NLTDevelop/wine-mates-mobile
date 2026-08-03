import { useMemo } from 'react';
import { Image, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionCarouselCard } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from '../WineEvolutionTab/styles';

interface IProps {
    card: IWineEvolutionCarouselCard;
}

export const EvolutionColorCarouselCard = ({ card }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.carouselItem}>
            <View style={styles.statCard}>
                {card.isEmpty ? (
                    <View style={styles.emptyCard}>
                        <Typography text="-" variant="h5" style={styles.emptyCardText} />
                    </View>
                ) : (
                    <>
                        <View style={styles.statBars}>
                            {card.colors[0] ? (
                                <View style={[styles.statBar, { backgroundColor: card.colors[0].backgroundColor }]}>
                                    <Typography
                                        text={card.colors[0].label}
                                        variant="body_500"
                                        style={[styles.statLabel, { color: card.colors[0].textColor }]}
                                    />
                                    <Typography
                                        text={card.colors[0].reviewsText}
                                        variant="subtitle_12_400"
                                        style={[styles.statReviews, { color: card.colors[0].textColor }]}
                                    />
                                </View>
                            ) : null}
                            {card.colors[1] ? (
                                <View style={[styles.statBar, { backgroundColor: card.colors[1].backgroundColor }]}>
                                    <Typography
                                        text={card.colors[1].label}
                                        variant="body_500"
                                        style={[styles.statLabel, { color: card.colors[1].textColor }]}
                                    />
                                    <Typography
                                        text={card.colors[1].reviewsText}
                                        variant="subtitle_12_400"
                                        style={[styles.statReviews, { color: card.colors[1].textColor }]}
                                    />
                                </View>
                            ) : null}
                            {card.colors[2] ? (
                                <View style={[styles.statBar, { backgroundColor: card.colors[2].backgroundColor }]}>
                                    <Typography
                                        text={card.colors[2].label}
                                        variant="body_500"
                                        style={[styles.statLabel, { color: card.colors[2].textColor }]}
                                    />
                                    <Typography
                                        text={card.colors[2].reviewsText}
                                        variant="subtitle_12_400"
                                        style={[styles.statReviews, { color: card.colors[2].textColor }]}
                                    />
                                </View>
                            ) : null}
                            {card.colors[3] ? (
                                <View style={[styles.statBar, { backgroundColor: card.colors[3].backgroundColor }]}>
                                    <Typography
                                        text={card.colors[3].label}
                                        variant="body_500"
                                        style={[styles.statLabel, { color: card.colors[3].textColor }]}
                                    />
                                    <Typography
                                        text={card.colors[3].reviewsText}
                                        variant="subtitle_12_400"
                                        style={[styles.statReviews, { color: card.colors[3].textColor }]}
                                    />
                                </View>
                            ) : null}
                            {card.colors[4] ? (
                                <View style={[styles.statBar, { backgroundColor: card.colors[4].backgroundColor }]}>
                                    <Typography
                                        text={card.colors[4].label}
                                        variant="body_500"
                                        style={[styles.statLabel, { color: card.colors[4].textColor }]}
                                    />
                                    <Typography
                                        text={card.colors[4].reviewsText}
                                        variant="subtitle_12_400"
                                        style={[styles.statReviews, { color: card.colors[4].textColor }]}
                                    />
                                </View>
                            ) : null}
                        </View>
                        <View style={styles.avatarContent}>
                            <View style={styles.avatarRow}>
                                {card.avatarSources[0] ? (
                                    <Image source={card.avatarSources[0]} style={styles.avatar} />
                                ) : null}
                                {card.avatarSources[1] ? (
                                    <Image source={card.avatarSources[1]} style={styles.avatar} />
                                ) : null}
                                {card.avatarSources[2] ? (
                                    <Image source={card.avatarSources[2]} style={styles.avatar} />
                                ) : null}
                                <View style={styles.additionalPeople}>
                                    <Typography
                                        text={card.additionalPeopleText || '-'}
                                        variant="subtitle_12_400"
                                        style={styles.additionalPeopleText}
                                    />
                                </View>
                            </View>
                            <Typography
                                text="Number of people who chose these colors"
                                variant="subtitle_12_400"
                                style={styles.avatarDescription}
                            />
                        </View>
                    </>
                )}
                {card.isEmpty && card.year === '-' ? null : (
                    <Typography text={card.year} variant="h5" style={styles.statYear} />
                )}
            </View>
        </View>
    );
};
