import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Avatar } from '@/UIKit/Avatar';
import { StarIcon } from '@assets/icons/StartIcon';
import { LockContainer } from '@/UIKit/LockContainer';
import { IWineReviewsListItem } from '@/entities/wine/types/IWineReviewsListItem';
import { useReviewListItem } from './presenters/useReviewListItem';

interface IProps {
    item: IWineReviewsListItem;
}

export const ReviewListItem = ({ item }: IProps) => {
    const { colors, locale, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { isJustNow, formattedDate, isLocked, isLoverLevel, formattedUserRating, formattedExpertRating } = useReviewListItem({
        item,
        locale,
    });

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Avatar
                    avatarUrl={item.user.avatar?.smallUrl || item.user.image?.smallUrl || null}
                    fullname={`${item.user.firstName} ${item.user.lastName}`}
                    size={40}
                />
                <View style={styles.mainContainer}>
                    <Typography text={`${item.user.firstName} ${item.user.lastName}`} variant="h5" />
                    <View style={styles.rateContainer}>
                        {isLoverLevel ? (
                            <>
                                <StarIcon />
                                <Typography text={formattedUserRating} variant="subtitle_12_500" />
                                <View style={styles.expertRateContainer}>
                                    <Typography text={t(`wineLevel.${item.user?.wineExperienceLevel}`)} variant="subtitle_12_500" />
                                </View>
                            </>
                        ) : (
                            <View style={styles.row}>
                                <View style={styles.expertRateContainer}>
                                    <Typography text={formattedExpertRating} variant="subtitle_12_500" />
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
