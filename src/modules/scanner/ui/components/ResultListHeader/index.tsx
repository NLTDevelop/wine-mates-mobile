import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord } from '@/utils';
import { ResultHeader } from '../ResultHeader';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { TasteCharacteristicItem } from '../TasteCharacteristicItem';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { IStatistic, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';

interface IProps {
   data: IWineDetails;
   onVintageChange: (item: IDropdownItem) => void;
}

export const ResultListHeader = ({ data, onVintageChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isPremiumUser = useMemo(() =>
        featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
    []);
    const tasteCharacteristics = useMemo(() => data.statistics.tasteCharacteristics.filter(item => item.levels), [data.statistics.tasteCharacteristics]);


    return (
        <View>
            <ResultHeader item={data} onVintageChange={onVintageChange} />

            {data.isTasted && (
                <View style={styles.tasted}>
                    <Typography text={t('wine.tasted')} style={styles.tastedText} />
                    <GlassWithWineIcon />
                </View>
            )}

            {data.statistics.topColor && (
                <>
                    <View style={styles.titleContainer}>
                        <Typography text={t('wine.color')} variant="h4" />
                        <Typography text={t('wine.mostSelectedColor')} variant="body_400" style={styles.text} />
                    </View>
                    <View
                        style={[
                            styles.selectedColor,
                            { backgroundColor: data.statistics.topColor?.colorHex || colors.success },
                        ]}
                    >
                        <Typography text={data.statistics.topColor?.name || '-'} variant="h5" />
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
                            <View
                                key={item.id}
                                style={[styles.mapListItem, { backgroundColor: item.colorHex || colors.success }]}
                            >
                                <Typography text={item.name} />
                                <Typography
                                    text={`(${declOfWord(
                                        Number(item.userCount),
                                        t('scanner.reviewCount') as unknown as Array<string>,
                                    )})`}
                                    variant="subtitle_12_500"
                                    style={styles.countText}
                                />
                            </View>
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
                            <View
                                key={item.id}
                                style={[styles.mapListItem, { backgroundColor: item.colorHex || colors.success }]}
                            >
                                <Typography text={item.name} />
                                <Typography
                                    text={`(${declOfWord(
                                        Number(item.userCount),
                                        t('scanner.reviewCount') as unknown as Array<string>,
                                    )})`}
                                    variant="subtitle_12_500"
                                    style={styles.countText}
                                />
                            </View>
                        ))}
                    </View>
                </>
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
