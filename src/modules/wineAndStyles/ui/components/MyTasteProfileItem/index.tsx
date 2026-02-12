import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { ITasteProfileStatistics, ITasteProfileColor } from '@/entities/wine/types/ITasteProfile';
import { StatisticItemsList } from './components/StatisticItemsList/ui';
import { TastesList } from './components/TastesList/ui';
import { TasteProfileSectionType } from './types/TasteProfileSectionType';
import { WineRecommendationCarousel } from './components/WineRecommendationCarousel/ui';

interface IProps {
    title: string;
    statistics: ITasteProfileStatistics;
    color: ITasteProfileColor;
}

export const MyTasteProfileItem = ({ title, statistics, color }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <Collapse title={title}>
            <View style={styles.contentContainer}>
                {statistics.colors.length > 0 && (
                    <StatisticItemsList 
                        sectionType={TasteProfileSectionType.COLOR_SHADES} 
                        items={statistics.colors} 
                    />
                )}

                {statistics.aromas.length > 0 && (
                    <StatisticItemsList 
                        sectionType={TasteProfileSectionType.AROMA} 
                        items={statistics.aromas} 
                    />
                )}

                {(statistics.flavors.length > 0 || statistics.tasteCharacteristics.length > 0) && (
                    <TastesList 
                        flavors={statistics.flavors} 
                        characteristics={statistics.tasteCharacteristics} 
                    />
                )}

                <WineRecommendationCarousel />
            </View>
        </Collapse>
    );
};
