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
import { userModel } from '@/entities/users/UserModel';
import { BlurContainer } from '@/UIKit/BlurContainer';
import { RateMedal } from '@/modules/scanner/ui/components/RateMedal/ui';
import { TickIcon } from '@assets/icons/TickIcon';

interface IProps {
    item: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
}

type VintageDropdownItem = IDropdownItem & {
    averageUserRating?: number;
    totalReviews?: number;
};

export const ResultHeader = ({ item, onVintageChange, onFavoritePress }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, vintageData, selectedVintageValue, vintagePlaceholder } = useResultHeader(item);

    const renderVintageValue = (dropdownItem: VintageDropdownItem) => {
        const rating = dropdownItem.averageUserRating ?? 0;
        const reviewsText = declOfWord(
            dropdownItem.totalReviews ?? 0,
            t('scanner.reviewCount') as unknown as Array<string>,
        );

        return (
            <View style={styles.rateContainer}>
                <Typography variant="subtitle_12_500" text={dropdownItem.label} />
                <StarIcon />
                <Typography variant="subtitle_12_500" text={rating} />
                <Typography variant="subtitle_12_400" text={`(${reviewsText})`} style={styles.text} />
            </View>
        );
    };
    
    const renderVintageItem = (dropdownItem: VintageDropdownItem, selected?: boolean) => (
        <View style={styles.dropdownItem}>
            {renderVintageValue(dropdownItem)}
            {selected ? <TickIcon /> : null}
        </View>
    );
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

        if (rating >= 97) {
            return {
                label: t('medal.platinum'),
            };
        }

        if (rating >= 95) {
            return {
                label: t('medal.gold'),
            };
        }

        if (rating >= 90) {
            return {
                label: t('medal.silver'),
            };
        }

        if (!rating || rating < 86) {
            return {
                label: t('medal.nice'),
            };
        }

        return {
            label: t('medal.bronze'),
        };
    }, [item.averageExpertRating, t]);

    return (
        <View style={styles.container}>
            <View>
                {item.image?.originalUrl && (
                    <FasterImageView
                        source={{ uri: item.image?.originalUrl, resizeMode: 'cover' }}
                        style={styles.image}
                        radius={12}
                    />
                )}

                {medalData && (
                    <View style={styles.medal}>
                        <RateMedal sliderValue={item.averageExpertRating} size={24} />
                        <Typography variant="subtitle_12_400" text={medalData.label} />

                        {!userModel.user?.hasPremium && <BlurContainer isLockIconCentered={true} />}
                    </View>
                )}
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.mainContainer}>
                    <Typography variant="subtitle_20_500" text={item.name} style={styles.title} selectable />
                    <Typography variant="body_400" text={description} style={styles.description} selectable />
                    <View style={styles.rateContainer}>
                        <StarIcon />
                        <Typography variant="subtitle_12_500" text={item.averageUserRating || 0} />
                        <Typography variant="subtitle_12_400" text={t('wine.overallScore')} />

                        <Typography
                            variant="subtitle_12_400"
                            text={`(${declOfWord(
                                item.countUserRating || 0,
                                t('scanner.reviewCount') as unknown as Array<string>,
                            )})`}
                            style={styles.text}
                        />
                    </View>
                    <CustomDropdown
                        data={vintageData}
                        placeholder={vintagePlaceholder}
                        onPress={onVintageChange}
                        selectedValue={selectedVintageValue}
                        containerStyle={styles.dropdown}
                        disabled={vintageData.length === 0}
                        renderItem={renderVintageItem}
                        renderSelectedValue={renderVintageValue}
                    />
                </View>
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
