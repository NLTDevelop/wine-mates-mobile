import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord } from '@/utils';
import { ResultHeader } from '../ResultHeader';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { TasteCharacteristicItem } from '@/modules/scanner/ui/components/TasteCharacteristicItem';
import { IStatistic, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { userModel } from '@/entities/users/UserModel';
import { useColorShades } from '@/modules/wine/presenters/useColorShades';
import { StatisticCard } from '../StatisticCard';
import { WinePeaksGrid } from '@/modules/wineAndStyles/ui/components/MyTasteProfileItem/components/WinePeaksGrid';

interface IProps {
    data: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
}

export const ResultListHeader = ({ data, onVintageChange, onFavoritePress, hasCurrentVintageData }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isPremiumUser = userModel.user?.hasPremium || false;

    const tasteCharacteristics = useMemo(
        () => data?.statistics?.tasteCharacteristics?.filter(item => item?.levels && item?.selectedIndex != null) ?? [],
        [data.statistics.tasteCharacteristics],
    );

    const { colorShadeItems } = useColorShades(data.statistics.topColors);

    return (
        <View>
            <ResultHeader item={data} onVintageChange={onVintageChange} onFavoritePress={onFavoritePress} hasCurrentVintageData={hasCurrentVintageData}/>

            {data.isTasted && (
                <View style={styles.tasted}>
                    <Typography text={t('wine.tasted')} style={styles.tastedText} />
                    <GlassWithWineIcon />
                </View>
            )}

            {colorShadeItems.length > 0 && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.colors')} variant="h4" />
                        <Typography text={t('wine.mostSelectedColor')} variant="body_400" style={styles.text} />
                    </View>
                    <View style={styles.mapListContainer}>
                        {colorShadeItems.map((item) => (
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

            {wineReviewsListModel.list && wineReviewsListModel.list.rows.length > 0 && (
                <Typography text={t('wine.reviews')} variant="h4" style={styles.title} />
            )}
        </View>
    );
};
