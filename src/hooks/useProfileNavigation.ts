import { useCallback } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { IPublicProfileRouteParams } from '@/modules/profile/types/IPublicProfileRouteParams';
import { navigationRef } from '@/navigation/rootNavigator';
import { userService } from '@/entities/users/UserService';

type ProfileUserId = number | string;
export type PublicProfileNavigationOptions = Pick<IPublicProfileRouteParams, 'initialTab' | 'wineId' | 'vintages'>;

export const useProfileNavigation = (
    userId?: ProfileUserId | null,
    wineExperienceLevel?: WineExperienceLevelEnum | null,
    onClose?: () => void,
    navigationOptions?: PublicProfileNavigationOptions,
) => {
    const onUserPressById = useCallback(
        async (
            nextUserId: ProfileUserId,
            nextWineExperienceLevel: WineExperienceLevelEnum,
            nextOnClose?: () => void,
            options: PublicProfileNavigationOptions = navigationOptions || {},
        ) => {
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
                const response = await userService.getPublicProfile(normalizedUserId);
                if (!response.isError && response.data && !response.data.winery) {
                    navigationRef.navigate('PublicUserProfileView', {
                        userId: normalizedUserId,
                        initialProfile: response.data,
                        ...options,
                    });
                    return;
                }

                navigationRef.navigate('PublicWineryProfileView', {
                    userId: normalizedUserId,
                    initialProfile: response.data,
                    ...options,
                });
                return;
            }

            navigationRef.navigate('PublicUserProfileView', { userId: normalizedUserId, ...options });
        },
        [navigationOptions, onClose],
    );

    const onUserPress = useCallback(() => {
        if (!userId || !wineExperienceLevel) {
            return;
        }

        onUserPressById(userId, wineExperienceLevel, undefined, navigationOptions);
    }, [navigationOptions, onUserPressById, userId, wineExperienceLevel]);

    return { onUserPress, onUserPressById };
};
