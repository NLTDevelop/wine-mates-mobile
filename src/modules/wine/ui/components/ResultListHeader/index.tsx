import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord } from '@/utils';
import { ResultHeader } from '../ResultHeader';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { TasteCharacteristicItem } from '@/modules/scanner/ui/components/TasteCharacteristicItem';
import { IStatistic, IWineDetails, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { userModel } from '@/entities/users/UserModel';
import { useColorShades } from '@/modules/wine/presenters/useColorShades';
import { StatisticCard } from '../StatisticCard';
import { WinePeaksGrid } from '@/UIKit/WinePeaksGrid';
import { FoodPairing } from '@/UIKit/FoodPairing';
import { TastingNote } from '../TastingNote';

interface IProps {
    data: IWineDetails;
    vintages: IVintagesItem[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    isAllVintagesSelected: boolean;
}

export const ResultListHeader = ({ data, vintages, onVintageChange, onFavoritePress, hasCurrentVintageData, isAllVintagesSelected }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { colorShadeItems } = useColorShades(data.statistics.topColors);

    const isPremiumUser = userModel.user?.hasPremium || false;
    const tasteCharacteristics = useMemo(
        () => data?.statistics?.tasteCharacteristics?.filter(item => item?.levels && item?.selectedIndex != null) ?? [],
        [data.statistics.tasteCharacteristics],
    );
    const isVintageTasted = useMemo(() => {
        if (!data.isTasted) return false;
        if (data.vintage === null) return true;

        const isInVintages = vintages.some(v => {
            if (typeof v === 'number') return v === data.vintage;
            if (typeof v === 'string') {
                const parsedValue = Number(v);
                return !Number.isNaN(parsedValue) && parsedValue === data.vintage;
            }

            return v.vintage === data.vintage;
        });
        const isCurrentVintage = typeof data.currentVintage === 'object'
            && data.currentVintage !== null
            && data.currentVintage.vintage === data.vintage;

        return isInVintages || isCurrentVintage;
    }, [data.isTasted, data.vintage, data.currentVintage, vintages]);

    return (
        <View>
            <ResultHeader
                item={data}
                vintages={vintages}
                onVintageChange={onVintageChange}
                onFavoritePress={onFavoritePress}
                hasCurrentVintageData={hasCurrentVintageData}
                isAllVintagesSelected={isAllVintagesSelected}
            />

            {isVintageTasted && (
                <>
                    <View style={styles.tasted}>
                        <Typography text={t('wine.tasted')} style={styles.tastedText} />
                        <GlassWithWineIcon />
                    </View>
                </>
            )}
            
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
                                key={item.id}
                                item={item}
                                value={item.selectedIndex || 0}
                                isPremiumUser={isPremiumUser}
                                disabled={true}
                            />
                        ))}
                    </View>
                </>
            )}

            {data.aiTastingNote ? <TastingNote note={data.aiTastingNote}/> : null}

            {data.aiSnacks?.length ? <FoodPairing generatedSnacks={data.aiSnacks} hideGenerateButton/> : null}

            {wineReviewsListModel.list && wineReviewsListModel.list.rows.length > 0 && (
                <Typography text={t('wine.reviews')} variant="h3" style={styles.title} />
            )}
        </View>
    );
};
