import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Avatar } from '@/UIKit/Avatar';
import { StarIcon } from '@assets/icons/StartIcon';
import { formatRelativeDate } from '@/utils';
import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { BlurContainer } from '@/UIKit/BlurContainer';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';

interface IProps {
    item: IWineReviewsListItem;
}

export const ReviewListItem = ({ item }: IProps) => {
    const { colors, locale, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const formattedDate = formatRelativeDate(item.createdAt, locale);
    const isPremiumUser = useMemo(() =>
        featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
    [],);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Avatar avatarUrl={item.user.avatar?.smallUrl || null} fullname={`${item.user.firstName} ${item.user.lastName}`} size={40} />
                <View style={styles.mainContainer}>
                    <Typography text={`${item.user.firstName} ${item.user.lastName}`} variant="h5" />
                    <View style={styles.rateContainer}>
                        <StarIcon />
                        <Typography text={item.userRating} variant="subtitle_12_500" />
                        {item.user.wineExperienceLevel === WineExperienceLevelEnum.LOVER && (
                            <View style={styles.experienceContainer}>
                                <Typography text={t('registration.wineLover')} variant="subtitle_12_500" />
                                    <WineLoverIcon width={16} height={16}/>
                            </View>
                        )}
                    </View>
                </View>
                <Typography text={formattedDate} variant="body_400" style={styles.date} />
            </View>
            <Typography text={item.review || '-'} variant="body_400" />
            {item.user.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && !isPremiumUser && (
                <BlurContainer isLockIconCentered={true} />
            )}
        </View>
    );
};
