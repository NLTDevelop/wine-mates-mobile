import { useCallback } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { navigationRef } from '@/navigation/rootNavigator';

type ProfileUserId = number | string;

export const useProfileNavigation = (
    userId?: ProfileUserId | null,
    wineExperienceLevel?: WineExperienceLevelEnum | null,
    onClose?: () => void,
) => {
    const onUserPressById = useCallback(
        (nextUserId: ProfileUserId, nextWineExperienceLevel: WineExperienceLevelEnum, nextOnClose?: () => void) => {
            if (!nextUserId || !navigationRef.isReady()) {
                return;
            }

            (nextOnClose || onClose)?.();
            const normalizedUserId = Number(nextUserId);

            if (!Number.isFinite(normalizedUserId)) {
                return;
            }

            if (normalizedUserId === userModel.user?.id) {
                if (userModel.winery) {
                    navigationRef.navigate('WineryProfileDetailsView');
                } else {
                    navigationRef.navigate('ProfileDetailsView');
                }
                return;
            }

            if (nextWineExperienceLevel === WineExperienceLevelEnum.CREATOR) {
                navigationRef.navigate('PublicWineryProfileView', { userId: normalizedUserId });
                return;
            }

            navigationRef.navigate('PublicUserProfileView', { userId: normalizedUserId });
        },
        [onClose],
    );

    const onUserPress = useCallback(() => {
        if (!userId || !wineExperienceLevel) {
            return;
        }

        onUserPressById(userId, wineExperienceLevel);
    }, [onUserPressById, userId, wineExperienceLevel]);

    return { onUserPress, onUserPressById };
};
