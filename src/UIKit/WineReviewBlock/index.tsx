import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Avatar } from '@/UIKit/Avatar';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { userModel } from '@/entities/users/UserModel';
import { LockContainer } from '../LockContainer';

interface IProps {
    user: {
        id?: number;
        firstName: string;
        lastName: string;
        image?: {
            smallUrl: string;
            mediumUrl: string;
            originalUrl: string;
        } | null;
        wineExperienceLevel: WineExperienceLevelEnum;
    };
    review: string | null;
}

export const WineReviewBlock = ({ user, review }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const isPremiumUser = userModel.user?.hasPremium || false;
    const isLocked = user.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && !isPremiumUser;
    const isMyReview = userModel.user?.id === user?.id;

    return (
        <>
            {review?.trim() ? (
                <View style={styles.container}>
                    <View style={styles.userRow}>
                        <Avatar
                            avatarUrl={user.image?.mediumUrl ?? null}
                            fullname={`${user.firstName} ${user.lastName}`}
                            size={24}
                        />
                        <Typography variant="body_500" text={`${user.firstName} ${user.lastName}`} numberOfLines={1} />
                    </View>
                    <Typography
                        variant="body_400"
                        text={review?.trim() || '-'}
                        numberOfLines={3}
                        style={styles.reviewText}
                    />
                    {isLocked && !isMyReview && <LockContainer />}
                </View>
            ) : null}
        </>
    );
};
