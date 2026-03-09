import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { ITasteProfileStatistics, ITasteProfileColor, ITasteProfileType } from '@/entities/wine/types/ITasteProfile';
import { StatisticItemsList } from './components/StatisticItemsList/ui';
import { TastesList } from './components/TastesList/ui';
import { TasteProfileSectionEnum } from './enums/TasteProfileSectionEnum';
import { WinePeaksGrid } from '../../../../../UIKit/WinePeaksGrid';
import { WineRecommendationCarousel } from './components/WineRecommendationCarousel/ui';

interface IProps {
    title: string;
    statistics: ITasteProfileStatistics;
    color: ITasteProfileColor;
    type: ITasteProfileType;
}

export const MyTasteProfileItem = ({ title, statistics, color, type }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <Collapse title={title}>
            <View style={styles.contentContainer}>
                {statistics.colors.length > 0 && (
                    <StatisticItemsList sectionType={TasteProfileSectionEnum.COLOR_SHADES} items={statistics.colors} />
                )}

                {statistics.aromas.length > 0 && (
                    <StatisticItemsList sectionType={TasteProfileSectionEnum.AROMA} items={statistics.aromas} />
                )}

                {(statistics.flavors.length > 0 || statistics.tasteCharacteristics.length > 0) && (
                    <TastesList flavors={statistics.flavors} characteristics={statistics.tasteCharacteristics} />
                )}

                {statistics.topWinePeaks && statistics.topWinePeaks.length > 0 && (
                    <WinePeaksGrid peaks={statistics.topWinePeaks} />
                )}

                <WineRecommendationCarousel typeId={type.id} colorId={color.id} />
            </View>
        </Collapse>
    );
};
