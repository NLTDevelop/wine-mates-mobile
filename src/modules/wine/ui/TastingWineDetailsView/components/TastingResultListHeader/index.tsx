import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord } from '@/utils';
import { TasteCharacteristicItem } from '@/UIKit/TasteCharacteristicItem';
import { IStatistic, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { userModel } from '@/entities/users/UserModel';
import { useColorShades } from '@/modules/wine/presenters/useColorShades';
import { WinePeaksGrid } from '@/UIKit/WinePeaksGrid';
import { FoodPairing } from '@/UIKit/FoodPairing';
import { StatisticCard } from '../../../components/StatisticCard';
import { TastingNote } from '../../../components/TastingNote';
import { TastingResultHeader } from '../TastingResultHeader';

interface IProps {
    data: IWineDetails;
    hasReviews?: boolean;
}

export const TastingResultListHeader = ({ data, hasReviews }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { colorShadeItems } = useColorShades(data.statistics.topColors);

    const isPremiumUser = userModel.user?.hasPremium || false;
    const tasteCharacteristics = useMemo(
        () => data?.statistics?.tasteCharacteristics?.filter(item => item?.levels && item?.selectedIndex != null) ?? [],
        [data.statistics.tasteCharacteristics],
    );

    return (
        <View>
            <TastingResultHeader
                item={data}
            />

            {colorShadeItems.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.colors')} variant="h4" />
                        <Typography text={t('wine.mostSelectedColor')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {colorShadeItems.map(item => (
                            <StatisticCard
                                key={item.id}
                                backgroundColor={item.colorHex}
                                label={item.label}
                                count={item.count}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.statistics.topAromas?.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.aromas')} variant="h4" />
                        <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {data.statistics.topAromas.map((item: IStatistic) => (
                            <StatisticCard
                                key={item.id}
                                backgroundColor={item.colorHex || colors.background_grey}
                                label={item.name}
                                count={`(${declOfWord(
                                    Number(item.userCount),
                                    t('scanner.reviewCount') as unknown as Array<string>,
                                )})`}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.statistics.topFlavors.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.tastes')} variant="h4" />
                        <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {data.statistics.topFlavors.map((item: IStatistic) => (
                            <StatisticCard
                                key={item.id}
                                backgroundColor={item.colorHex || colors.background_grey}
                                label={item.name}
                                count={`(${declOfWord(
                                    Number(item.userCount),
                                    t('scanner.reviewCount') as unknown as Array<string>,
                                )})`}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.statistics.topWinePeaks && data.statistics.topWinePeaks.length > 0 && (
                <WinePeaksGrid peaks={data.statistics.topWinePeaks} />
            )}

            {tasteCharacteristics.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.details')} variant="h4" />
                        <Typography text={t('wine.mostSelected')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.slidersListContainer}>
                        {tasteCharacteristics.map((item: IWineTasteCharacteristic) => (
                            <TasteCharacteristicItem
                                key={`${item.id}-${item.selectedIndex ?? 0}-${data.vintage ?? 'none'}`}
                                item={item}
                                value={Math.max((item.selectedIndex ?? 0) - 1, 0)}
                                isPremiumUser={isPremiumUser}
                                disabled={true}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.aiTastingNote ? <TastingNote note={data.aiTastingNote}/> : null}

            {data.aiSnacks?.length ? (
                <FoodPairing generatedSnacks={data.aiSnacks} hideGenerateButton isLocked={!isPremiumUser} />
            ) : null}

            {(hasReviews || (wineReviewsListModel.list && wineReviewsListModel.list.rows.length > 0)) && (
                <Typography text={t('wine.reviews')} variant="h3" style={styles.title} />
            )}
        </View>
    );
};
