import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { ColorPaletteItem } from '@/UIKit/ColorPaletteItem';
import { useStatisticItemsList } from './useStatisticItemsList';
import { ITasteProfileStatisticItem } from '@/entities/wine/types/ITasteProfile';
import { TasteProfileSectionType } from '../../types/TasteProfileSectionType';

interface IProps {
    sectionType: TasteProfileSectionType;
    items: ITasteProfileStatisticItem[];
}

export const StatisticItemsList = ({ sectionType, items }: IProps) => {
    const { styles, title } = useStatisticItemsList({ sectionType });

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
