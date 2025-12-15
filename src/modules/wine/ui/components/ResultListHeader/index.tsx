import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord, getContrastColor } from '@/utils';
import { ResultHeader } from '../ResultHeader';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { TasteCharacteristicItem } from '../../../../scanner/ui/components/TasteCharacteristicItem';
import { IStatistic, IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWineTasteCharacteristic } from '@/entities/wine/types/IWineTasteCharacteristic';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineReviewsListModel } from '@/entities/wine/WineReviewsListModel';
import { userModel } from '@/entities/users/UserModel';

interface IProps {
    data: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
}

export const ResultListHeader = ({ data, onVintageChange, onFavoritePress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isPremiumUser = userModel.user?.hasPremium || false;

    const tasteCharacteristics = useMemo(
        () => data?.statistics?.tasteCharacteristics?.filter(item => item?.levels && item?.selectedIndex != null) ?? [],
        [data.statistics.tasteCharacteristics],
    );
    const selectedColorTextColor = useMemo(
        () => getContrastColor(data.statistics.topColor?.colorHex || colors.background_grey),
    [data, colors]);

    return (
        <View>
            <ResultHeader item={data} onVintageChange={onVintageChange} onFavoritePress={onFavoritePress}/>

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
                            { backgroundColor: data.statistics.topColor?.colorHex || colors.background_grey },
                        ]}
                    >
                        <Typography
                            text={data.statistics.topColor?.name || '-'}
                            variant="h5"
                            style={{ color: selectedColorTextColor }}
                        />
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
                        {data.statistics.topAromas.map((item: IStatistic) => {
                            const textColor = getContrastColor(item.colorHex || colors.background_grey);
                            return (
                                <View
                                    key={item.id}
                                    style={[styles.mapListItem, { backgroundColor: item.colorHex || colors.background_grey }]}
                                >
                                    <Typography text={item.name} style={{ color: textColor }} />
                                    <Typography
                                        text={`(${declOfWord(
                                            Number(item.userCount),
                                            t('scanner.reviewCount') as unknown as Array<string>,
                                        )})`}
                                        variant="subtitle_12_500"
                                        style={styles.countText}
                                    />
                                </View>
                            );
                        })}
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
                        {data.statistics.topFlavors.map((item: IStatistic) => {
                            const textColor = getContrastColor(item.colorHex || colors.background_grey);

                            return (
                                <View
                                    key={item.id}
                                    style={[styles.mapListItem, { backgroundColor: item.colorHex || colors.background_grey }]}
                                >
                                    <Typography text={item.name} style={{ color: textColor }} />
                                    <Typography
                                        text={`(${declOfWord(
                                            Number(item.userCount),
                                            t('scanner.reviewCount') as unknown as Array<string>,
                                        )})`}
                                        variant="subtitle_12_500"
                                        style={styles.countText}
                                    />
                                </View>
                            );
                        })}
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
