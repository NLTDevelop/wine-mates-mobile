import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { StarIcon } from '@assets/icons/StartIcon';
import { declOfWord } from '@/utils';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { Button } from '@/UIKit/Button';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';

interface IProps {
    item: IWineListItem;
}

export const ResultHeader = ({ item }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View>
                <FasterImageView source={{ uri: item.image_url }} style={styles.image} radius={12} />
            </View>
            <View style={styles.mainContainer}>
                <Typography variant="subtitle_20_500" text={item.name} style={styles.title} />
                <Typography variant="body_400" text={item.description} style={styles.description} />
                <View style={styles.rateContainer}>
                    <StarIcon />
                    <Typography variant="subtitle_12_500" text={item.review_average} />
                    <Typography
                        variant="subtitle_12_400"
                        text={`(${declOfWord(
                            item.review_count,
                            t('scanner.reviewCount') as unknown as Array<string>,
                        )})`}
                        style={styles.text}
                    />
                </View>
                <CustomDropdown
                    data={[
                        { id: 1, label: '2023', value: '2023' },
                        { id: 2, label: '2024', value: '2024' },
                        { id: 3, label: '2025', value: '2025' },
                    ]}
                    placeholder={t('wine.vintage')}
                    onPress={() => {}}
                    selectedValue={'2023'}
                    containerStyle={styles.dropdown}
                />
                <View style={styles.row}>
                    <Button
                        text={t('wine.letsTaste')}
                        onPress={() => {}}
                        type="secondary"
                        containerStyle={styles.button}
                    />
                    <TouchableOpacity style={styles.favoriteButton} onPress={() => {}}>
                        <FavoriteIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
