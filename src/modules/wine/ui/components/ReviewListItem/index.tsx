import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Avatar } from '@/UIKit/Avatar';
import { StarIcon } from '@assets/icons/StartIcon';
import { formatRelativeDate, isLessThanMinuteFromNow } from '@/utils';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { LockContainer } from '@/UIKit/LockContainer';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { userModel } from '@/entities/users/UserModel';

interface IProps {
    item: IWineReviewsListItem;
}

export const ReviewListItem = ({ item }: IProps) => {
    const { colors, locale, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const isJustNow = isLessThanMinuteFromNow(item.createdAt);
    const formattedDate = formatRelativeDate(item.createdAt, locale);
    const isPremiumUser = userModel.user?.hasPremium || false;
    const isLocked = item.user.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && !isPremiumUser;

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Avatar
                    avatarUrl={item.user.avatar?.smallUrl || null}
                    fullname={`${item.user.firstName} ${item.user.lastName}`}
                    size={40}
                />
                <View style={styles.mainContainer}>
                    <Typography text={`${item.user.firstName} ${item.user.lastName}`} variant="h5" />
                    <View style={styles.rateContainer}>
                        {item.user.wineExperienceLevel === WineExperienceLevelEnum.LOVER ? (
                            <>
                                <StarIcon />
                                <Typography text={item.userRating || 0} variant="subtitle_12_500" />
                                <View style={styles.expertRateContainer}>
                                    <Typography text={t(`wineLevel.${item.user?.wineExperienceLevel}`)} variant="subtitle_12_500" />
                                </View>
                            </>
                        ) : (
                            <View style={styles.row}>
                                <View style={styles.expertRateContainer}>
                                    <Typography text={item.expertRating || 0} variant="subtitle_12_500" />
                                </View>
                                <View style={styles.expertRateContainer}>
                                    <Typography text={t(`wineLevel.${item.user?.wineExperienceLevel}`)} variant="subtitle_12_500" />
                                </View>
                            </View>
                        )}
                    </View>
                </View>
                <Typography text={isJustNow ? t('common.now') : formattedDate} variant="body_400" style={styles.date} />
            </View>
            {item.review ? <Typography text={item.review} variant="body_400" /> : null}
            {isLocked && <LockContainer/>}
        </View>
    );
};
