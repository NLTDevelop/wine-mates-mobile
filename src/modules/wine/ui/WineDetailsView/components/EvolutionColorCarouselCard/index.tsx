import { useCallback, useMemo } from 'react';
import { FlatList, Image, LayoutChangeEvent, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionCarouselCard, IWineEvolutionColorStat } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from './styles';

interface IProps {
    card: IWineEvolutionCarouselCard;
    onLayout: (event: LayoutChangeEvent) => void;
}

export const EvolutionColorCarouselCard = ({ card, onLayout }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderStatItem = useCallback(
        ({ item }: { item: IWineEvolutionColorStat }) => (
            <View style={[styles.statBar, { backgroundColor: item.backgroundColor }]}>
                <Typography
                    text={item.label}
                    variant="body_500"
                    style={[styles.statLabel, { color: item.textColor }]}
                />
                <Typography
                    text={item.reviewsText}
                    variant="subtitle_12_400"
                    style={[styles.statReviews, { color: item.textColor }]}
                />
            </View>
        ),
        [styles],
    );

    const keyExtractor = useCallback((item: IWineEvolutionColorStat, index: number) => `${item.label}-${index}`, []);

    return (
        <View style={styles.carouselItem} onLayout={onLayout}>
            <View style={styles.statCard}>
                {card.isEmpty ? (
                    <View style={styles.emptyCard}>
                        <Typography text="-" variant="h5" style={styles.emptyCardText} />
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={card.colors}
                            renderItem={renderStatItem}
                            keyExtractor={keyExtractor}
                            contentContainerStyle={styles.statBars}
                            scrollEnabled={false}
                        />
                        <View style={styles.avatarContent}>
                            <View style={styles.avatarRow}>
                                {card.avatarUrls[0] ? (
                                    <Image source={{ uri: card.avatarUrls[0] }} style={styles.avatar} />
                                ) : null}
                                {card.avatarUrls[1] ? (
                                    <Image source={{ uri: card.avatarUrls[1] }} style={styles.avatar} />
                                ) : null}
                                {card.avatarUrls[2] ? (
                                    <Image source={{ uri: card.avatarUrls[2] }} style={styles.avatar} />
                                ) : null}
                                {card.additionalPeople > 0 ? (
                                    <View style={styles.additionalPeople}>
                                        <Typography
                                            text={card.additionalPeopleText}
                                            variant="subtitle_12_400"
                                            style={styles.additionalPeopleText}
                                        />
                                    </View>
                                ) : null}
                            </View>
                            <Typography
                                text={t('wine.evolution.peopleWhoChose')}
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
