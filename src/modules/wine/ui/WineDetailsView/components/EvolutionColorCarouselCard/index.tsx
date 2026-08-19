import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { Typography } from '@/UIKit/Typography';
import { IWineEvolutionCarouselCard, IWineEvolutionColorStat } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from './styles';

interface IProps {
    card: IWineEvolutionCarouselCard;
}

export const EvolutionColorCarouselCard = ({ card }: IProps) => {
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
        <View style={styles.carouselItem}>
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
                                {card.avatarItems[0] ? (
                                    <Avatar
                                        size={24}
                                        avatarUrl={card.avatarItems[0].avatarUrl}
                                        fullname={card.avatarItems[0].fullName}
                                        containerStyle={styles.avatar}
                                    />
                                ) : null}
                                {card.avatarItems[1] ? (
                                    <Avatar
                                        size={24}
                                        avatarUrl={card.avatarItems[1].avatarUrl}
                                        fullname={card.avatarItems[1].fullName}
                                        containerStyle={styles.avatar}
                                    />
                                ) : null}
                                {card.avatarItems[2] ? (
                                    <Avatar
                                        size={24}
                                        avatarUrl={card.avatarItems[2].avatarUrl}
                                        fullname={card.avatarItems[2].fullName}
                                        containerStyle={styles.avatar}
                                    />
                                ) : null}
                                {card.avatarItems[3] ? (
                                    <Avatar
                                        size={24}
                                        avatarUrl={card.avatarItems[3].avatarUrl}
                                        fullname={card.avatarItems[3].fullName}
                                        containerStyle={styles.avatar}
                                    />
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
