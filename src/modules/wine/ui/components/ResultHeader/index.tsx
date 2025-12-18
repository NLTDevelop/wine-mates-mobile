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
import { useResultHeader } from '@/modules/wine/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { SilverMedalIcon } from '@assets/icons/SilverMedalIcon';
import { userModel } from '@/entities/users/UserModel';
import { BlurContainer } from '@/UIKit/BlurContainer';
import { BronzeMedalIcon } from '@assets/icons/BronzeMedalIcon';
import { GoldMedalIcon } from '@assets/icons/GoldMedalIcon';
import { PlatinumMedalIcon } from '@assets/icons/PlatinumMedalIcon';

interface IProps {
    item: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
}

export const ResultHeader = ({ item, onVintageChange, onFavoritePress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { vintageData, onPress } = useResultHeader(item);
    const description = useMemo(() => {
        return [
            item.type?.name,
            item.color?.name,
            item.country?.name,
            item.region?.name,
            item.producer,
            item.grapeVariety,
        ]
            .filter(Boolean)
            .join(', ');
    }, [item.type?.name, item.color?.name, item.country?.name, item.region?.name, item.producer, item.grapeVariety]);

    const medalData = useMemo(() => {
        const rating = item.averageExpertRating;

        if (!rating || rating < 86) {
            return null;
        }

        const roundedRating = Math.round(rating);

        if (rating >= 97) {
            return {
                Icon: PlatinumMedalIcon,
                label: t('medal.platinum'),
                rating: roundedRating,
            };
        }

        if (rating >= 95) {
            return {
                Icon: GoldMedalIcon,
                label: t('medal.gold'),
                rating: roundedRating,
            };
        }

        if (rating >= 90) {
            return {
                Icon: SilverMedalIcon,
                label: t('medal.silver'),
                rating: roundedRating,
            };
        }

        return {
            Icon: BronzeMedalIcon,
            label: t('medal.bronze'),
            rating: roundedRating,
        };
    }, [item.averageExpertRating, t]);

    return (
        <View style={styles.container}>
            <View>
                <FasterImageView
                    source={{ uri: item.image?.originalUrl, resizeMode: 'cover' }}
                    style={styles.image}
                    radius={12}
                />

                {medalData && (
                    <View style={styles.medal}>
                        <medalData.Icon text={medalData.rating.toString()} />
                        <Typography variant="subtitle_12_400" text={medalData.label} />

                        {!userModel.user?.hasPremium && <BlurContainer isLockIconCentered={true} />}
                    </View>
                )}
            </View>
            <View style={styles.mainContainer}>
                <Typography variant="subtitle_20_500" text={item.name} style={styles.title} selectable />
                <Typography variant="body_400" text={description} style={styles.description} selectable />
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
