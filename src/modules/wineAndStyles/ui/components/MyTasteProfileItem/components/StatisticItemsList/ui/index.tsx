import { useMemo } from 'react';
import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { ColorPaletteItem } from '@/UIKit/ColorPaletteItem';
import { useUiContext } from '@/UIProvider';
import { ITasteProfileStatisticItem } from '@/entities/wine/types/ITasteProfile';
import { TasteProfileSectionEnum } from '../../../enums/TasteProfileSectionEnum';
import { useColorShades } from '../presenters/useColorShades';
import { getStyles } from './styles';

interface IProps {
    sectionType: TasteProfileSectionEnum;
    items: ITasteProfileStatisticItem[];
}

export const StatisticItemsList = ({ sectionType, items }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const title = t(`wineAndStyles.${sectionType}`);
    const { processedColors } = useColorShades(items);

    const displayItems = sectionType === TasteProfileSectionEnum.COLOR_SHADES ? processedColors : items;

    return (
        <View style={styles.nestedCollapseWrapper}>
            <Collapse title={`${title} (${displayItems.length})`}>
                <View style={styles.nestedContent}>
                    {displayItems.map((item) => (
                        <View key={item.id} style={styles.listItem}>
                            <ColorPaletteItem
                                text={`${item.name} (${item.count})`}
                                colorHex={item.colorHex}
                                isFullWidthText
                            />
                        </View>
                    ))}
                </View>
            </Collapse>
        </View>
    );
};
