import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { StarIcon } from '@assets/icons/StartIcon';
import { declOfWord } from '@/utils';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { Button } from '@/UIKit/Button';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { useResultHeader } from '@/modules/scanner/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';

interface IProps {
    item: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
}

export const ResultHeader = ({ item, onVintageChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { vintageData, onPress, onFavoritePress } = useResultHeader(item);

    return (
        <View style={styles.container}>
            <View>
                <FasterImageView source={{ uri: item.image.originalUrl, resizeMode: 'cover' }} style={styles.image} radius={12} />
            </View>
            <View style={styles.mainContainer}>
                <Typography variant="subtitle_20_500" text={item.name} style={styles.title} />
                <Typography variant="body_400" text={`${item.type.name}, ${item.country.name}, ${item.region.name}, ${item.producer}, ${item.grapeVariety}`} style={styles.description} />
                <View style={styles.rateContainer}>
                    <StarIcon />
                    <Typography variant="subtitle_12_500" text={item.averageUserRating || 0} />
                    <Typography
                        variant="subtitle_12_400"
                        text={`(${declOfWord(
                            item.totalReviews || 0,
                            t('scanner.reviewCount') as unknown as Array<string>,
                        )})`}
                        style={styles.text}
                    />
                </View>
                <CustomDropdown
                    data={vintageData}
                    placeholder={t('wine.vintage')}
                    onPress={onVintageChange}
                    selectedValue={item.vintage.toString()}
                    containerStyle={styles.dropdown}
                />
                <View style={styles.row}>
                    <Button
                        text={item.isTasted ? t('wine.tasteAgain') : t('wine.letsTaste')}
                        onPress={onPress}
                        type="secondary"
                        containerStyle={styles.button}
                    />
                    <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
                        <FavoriteIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
