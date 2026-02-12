import { useMemo } from 'react';
import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { ColorPaletteItem } from '@/UIKit/ColorPaletteItem';
import { useUiContext } from '@/UIProvider';
import { useStatisticItemsList } from '../presenters/useStatisticItemsList';
import { ITasteProfileStatisticItem } from '@/entities/wine/types/ITasteProfile';
import { TasteProfileSectionType } from '../../../types/TasteProfileSectionType';
import { getStyles } from './styles';

interface IProps {
    sectionType: TasteProfileSectionType;
    items: ITasteProfileStatisticItem[];
}

export const StatisticItemsList = ({ sectionType, items }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { title } = useStatisticItemsList({ sectionType });

    return (
        <View style={styles.nestedCollapseWrapper}>
            <Collapse title={`${title} (${items.length})`}>
                <View style={styles.nestedContent}>
                    {items.map((item) => (
                        <View key={item.id} style={styles.listItem}>
                            <ColorPaletteItem
                                text={`${item.name} (${item.count})`}
                                colorHex={item.colorHex}
                            />
                        </View>
                    ))}
                </View>
            </Collapse>
        </View>
    );
};
