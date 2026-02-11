import { View } from 'react-native';
import { Collapse } from '@/UIKit/Collapse';
import { ColorPaletteItem } from '@/UIKit/ColorPaletteItem';
import { TasteCharacteristicItem } from '@/modules/scanner/ui/components/TasteCharacteristicItem';
import { useTastesList } from './useTastesList';
import { ITasteProfileStatisticItem, ITasteProfileCharacteristic } from '@/entities/wine/types/ITasteProfile';

interface IProps {
    flavors: ITasteProfileStatisticItem[];
    characteristics: ITasteProfileCharacteristic[];
}

export const TastesList = ({ flavors, characteristics }: IProps) => {
    const { styles, title, isPremiumUser, mapCharacteristicToItem } = useTastesList();

    return (
        <View style={styles.nestedCollapseWrapper}>
            <Collapse title={`${title} (${flavors.length})`}>
                <View style={styles.contentContainer}>
                    {flavors.length > 0 && (
                        <View style={styles.nestedContent}>
                            {flavors.map((flavor) => (
                                <View key={flavor.id} style={styles.listItem}>
                                    <ColorPaletteItem
                                        text={`${flavor.name} (${flavor.count})`}
                                        colorHex={flavor.colorHex}
                                    />
                                </View>
                            ))}
                        </View>
                    )}

                    {characteristics.length > 0 && (
                        <View style={styles.slidersContainer}>
                            {characteristics.map((char) => (
                                <TasteCharacteristicItem
                                    key={char.id}
                                    item={mapCharacteristicToItem(char)}
                                    value={char.avgValue || 0}
                                    isPremiumUser={isPremiumUser}
                                    disabled
                                    hideDescription
                                    containerStyle={styles.characteristicItem}
                                    edgeAlignedLabels
                                />
                            ))}
                        </View>
                    )}
                </View>
            </Collapse>
        </View>
    );
};
