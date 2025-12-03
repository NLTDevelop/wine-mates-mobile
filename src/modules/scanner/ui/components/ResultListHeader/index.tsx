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

    return (
        <View>
            <ResultHeader item={data} onVintageChange={onVintageChange}/>
            {data.isTasted && <View style={styles.tasted}>
                <Typography text={t('wine.tasted')} style={styles.tastedText} />
                <GlassWithWineIcon />
            </View>}
            <Typography text={t('wine.selectedColor')} variant="h4" style={styles.title} />
            <View style={[styles.selectedColor, { backgroundColor: data.statistics.topColor?.colorHex || colors.success }]}>
                <Typography text={data.statistics.topColor?.name || '-'} variant="h5" />
            </View>
            <Typography text={t('wine.selectedSmells')} variant="h4" style={styles.title} />
            <View style={styles.mapListContainer}>
                {data.statistics.topAromas.map((item: IStatistic) => (
                    <View key={item.id} style={[styles.mapListItem, { backgroundColor: item.colorHex || colors.success }]}>
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
            <Typography text={t('wine.selectedTastes')} variant="h4" style={styles.title} />
            <View style={styles.mapListContainer}>
                {data.statistics.topFlavors.map((item: IStatistic) => (
                    <View key={item.id} style={[styles.mapListItem, { backgroundColor: item.colorHex || colors.success }]}>
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
            <Typography text={t('wine.selectedDetails')} variant="h4" style={styles.title} />
            <View style={styles.slidersListContainer}>
                {data.statistics.tasteCharacteristics.map((item: IWineTasteCharacteristic) => (
                    <TasteCharacteristicItem
                        key={item.id}
                        item={item}
                        value={item.selectedIndex || 0}
                        isPremiumUser={isPremiumUser}
                        disabled={true}
                    />
                ))}
            </View>
            <Typography text={t('wine.reviews')} variant="h4" style={styles.title} />
        </View>
    );
};
