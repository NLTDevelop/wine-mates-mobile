import { useCallback } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { userService } from '@/entities/users/UserService';
import { IWinery } from '@/entities/winery/types/IWinery';
import { navigationRef } from '@/navigation/rootNavigator';

type ProfileUserId = number | string;

export const useProfileNavigation = (
    userId?: ProfileUserId | null,
    winery?: IWinery | null,
    onClose?: () => void,
) => {
    const onUserPressById = useCallback(
        async (nextUserId?: ProfileUserId | null, nextWinery?: IWinery | null, nextOnClose?: () => void) => {
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

            let hasWinery = Boolean(nextWinery);

            if (nextWinery === undefined) {
                const response = await userService.getPublicProfile(normalizedUserId);
                hasWinery = !response.isError && Boolean(response.data?.winery);
            }

            if (!navigationRef.isReady()) {
                return;
            }

            if (hasWinery) {
                navigationRef.navigate('PublicWineryProfileView', { userId: normalizedUserId });
                return;
            }

            navigationRef.navigate('PublicUserProfileView', { userId: normalizedUserId });
        },
        [onClose],
    );

    const onUserPress = useCallback(() => {
        onUserPressById(userId, winery);
    }, [onUserPressById, userId, winery]);

    return { onUserPress, onUserPressById };
};
