import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { StarIcon } from '@assets/icons/StartIcon';
import { declOfWord } from '@/utils';
import { Button } from '@/UIKit/Button';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { useResultHeader } from '@/modules/wine/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { userModel } from '@/entities/users/UserModel';
import { BlurContainer } from '@/UIKit/BlurContainer';
import { RateMedal } from '@/modules/scanner/ui/components/RateMedal/ui';
import { useResultHeaderLogic } from './useResultHeaderLogic';
import { VintageDropdown } from '../VintageDropdown';

interface IProps {
    item: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
}

export const ResultHeader = ({ item, onVintageChange, onFavoritePress, hasCurrentVintageData }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, isCreating } = useResultHeader(item);
    const { description, medalData } = useResultHeaderLogic({ item, styles });

    return (
        <>
            <View style={styles.container}>
                <View>
                    {item.image?.originalUrl && (
                        <FasterImageView
                            source={{ uri: item.image?.originalUrl, resizeMode: 'cover' }}
                            style={styles.image}
                            radius={12}
                        />
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
                        <VintageDropdown
                            vintages={item.vintages}
                            currentVintage={item.currentVintage}
                            selectedVintage={item.vintage}
                            onVintageChange={onVintageChange}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.medalContainer}>
                    {medalData && (
                        <View style={styles.medal}>
                            {item.averageExpertRating > 0 && (
                                <>
                                    <RateMedal sliderValue={item.averageExpertRating} size={24} />
                                    <Typography variant="subtitle_12_400" text={medalData.label} />
                                </>
                            )}

                            {!userModel.user?.hasPremium && <BlurContainer isLockIconCentered={true} />}
                        </View>
                    )}
                </View>
                <View style={styles.buttonTasteContainer}>
                    <Button
                        text={hasCurrentVintageData && item.isTasted ? t('wine.tasteAgain') : t('wine.letsTaste')}
                        onPress={onPress}
                        type="secondary"
                        containerStyle={styles.button}
                        isLoading={isCreating}
                        disabled={isCreating}
                    />
                    <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
                        <FavoriteIcon />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};
