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
        firstName: string;
        lastName: string;
        image?: {
            originalUrl: string;
        } | null;
        wineExperienceLevel: WineExperienceLevelEnum;
    };
    review: string | null;
    isMyReview?: boolean;
}

export const WineReviewBlock = ({ user, review, isMyReview = false}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const isPremiumUser = userModel.user?.hasPremium || false;
    const isLocked = user.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && !isPremiumUser;

    return (

        <View style={styles.container}>
            <View style={styles.userRow}>
                <Avatar
                    avatarUrl={user.image?.originalUrl || null}
                    fullname={`${user.firstName} ${user.lastName}`}
                    size={24}
                />
                <Typography variant="body_500" text={`${user.firstName} ${user.lastName}`} numberOfLines={1} />
            </View>
            {review?.trim() ? <Typography variant="body_400" text={review?.trim() || '-'} numberOfLines={3} style={styles.reviewText} /> : null}
            {isLocked && !isMyReview && <LockContainer />}
        </View>
    );
};
