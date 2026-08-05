import { GuestsBookingStatuses } from '@/entities/guests/enums/GuestsBookingStatuses';
import { IGetEventGuestsParams } from '@/entities/guests/params/IGetEventGuestsParams';
import { GuestTabs } from '@/modules/event/ui/EventDetailsView/enums/GuestTabs';
import { IGuestAction } from '@/modules/event/ui/EventDetailsView/types/IGuestAction';
import { IGuestTabItem } from '@/modules/event/ui/EventDetailsView/types/IGuestRoute';
import { IPreparedEventGuest } from '@/modules/event/ui/EventDetailsView/types/IPreparedEventGuest';
import { useCallback, useMemo, useState } from 'react';
import { useEventGuestsTabDetails } from './useEventGuestsTabDetails';
import { useUiContext } from '@/UIProvider';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

interface IProps {
    eventId: number;
    requiresConfirmation?: boolean;
    isEventOwner: boolean;
}

const getSelectedStatus = (selectedTab: GuestTabs): IGetEventGuestsParams['status'] => {
    if (selectedTab === GuestTabs.CONFIRM) {
        return GuestsBookingStatuses.ACCEPTED;
    }

    if (selectedTab === GuestTabs.NOT_CONFIRM) {
        return GuestsBookingStatuses.REJECTED;
    }

    return 'all';
};

const getAge = (birthday?: string) => {
    if (!birthday) {
        return null;
    }

    const birthdayDate = new Date(birthday);
    if (Number.isNaN(birthdayDate.getTime())) {
        return null;
    }

    const today = new Date();
    const age = today.getFullYear() - birthdayDate.getFullYear();
    const monthDiff = today.getMonth() - birthdayDate.getMonth();
    const dayDiff = today.getDate() - birthdayDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        return age - 1;
    }

    return age;
};

export const useEventGuestsTab = ({ eventId, requiresConfirmation, isEventOwner }: IProps) => {
    const { t } = useUiContext();
    const { onUserPressById } = useProfileNavigation();
    const [selectedTab, setSelectedTab] = useState<GuestTabs>(GuestTabs.ALL);

    const onPressAllTab = useCallback(() => {
        setSelectedTab(GuestTabs.ALL);
    }, []);

    const onPressConfirmTab = useCallback(() => {
        setSelectedTab(GuestTabs.CONFIRM);
    }, []);

    const onPressNotConfirmTab = useCallback(() => {
        setSelectedTab(GuestTabs.NOT_CONFIRM);
    }, []);

    const tabs: IGuestTabItem[] = useMemo(
        () => [
            {
                value: GuestTabs.ALL,
                label: t('eventGuests.all'),
                isActive: selectedTab === GuestTabs.ALL,
                onPress: onPressAllTab,
            },
            {
                value: GuestTabs.CONFIRM,
                label: t('eventGuests.confirmed'),
                isActive: selectedTab === GuestTabs.CONFIRM,
                onPress: onPressConfirmTab,
            },
            {
                value: GuestTabs.NOT_CONFIRM,
                label: t('eventGuests.notConfirmed'),
                isActive: selectedTab === GuestTabs.NOT_CONFIRM,
                onPress: onPressNotConfirmTab,
            },
        ],
        [onPressAllTab, onPressConfirmTab, onPressNotConfirmTab, selectedTab, t],
    );

    const guestsTabDetails = useEventGuestsTabDetails({
        eventId,
        status: getSelectedStatus(selectedTab),
        isEventOwner,
    });
    const { onAcceptGuest, onRejectGuest, updatingGuestId } = guestsTabDetails;

    const eventGuests: IPreparedEventGuest[] = useMemo(() => {
        return guestsTabDetails.eventGuests.map(guest => {
            const userFullName = `${guest.user?.firstName ?? '-'} ${guest.user?.lastName ?? '-'}`.trim();
            const isOrganizer = guest.user.id === guestsTabDetails.organizerId;
            const fullName = isOrganizer
                ? `${userFullName} (${t('eventGuests.organizer')})`
                : userFullName;
            const age = getAge(guest.user?.birthday);
            const ageText = age === null ? '' : `${age} ${t('eventGuests.age')}`;
            const showAge = age !== null && guest.user.wineExperienceLevel !== WineExperienceLevelEnum.CREATOR;
            const isUpdating = updatingGuestId === guest.id;
            const preparedGuest = {
                id: guest.id,
                fullName,
                ageText,
                showAge,
                avatarUrl: guest.user?.avatar?.smallUrl || null,
                onUserPress: () => onUserPressById(guest.user.id, guest.user.wineExperienceLevel),
            };

            const confirmAction: IGuestAction = {
                title: t('eventGuests.confirmAction'),
                type: 'main',
                onPress: () => onAcceptGuest(guest.id),
                inProgress: isUpdating,
            };

            const notConfirmAction: IGuestAction = {
                title: t('eventGuests.notConfirmAction'),
                type: 'secondary',
                onPress: () => onRejectGuest(guest.id),
                inProgress: isUpdating,
            };

            const cancelConfirmationAction: IGuestAction = {
                title: t('eventGuests.cancelConfirmation'),
                type: 'main',
                onPress: () => onRejectGuest(guest.id),
                inProgress: isUpdating,
            };

            const provideConfirmationAction: IGuestAction = {
                title: t('eventGuests.provideConfirmation'),
                type: 'main',
                onPress: () => onAcceptGuest(guest.id),
                inProgress: isUpdating,
            };

            if (!isEventOwner || !requiresConfirmation) {
                return preparedGuest;
            }

            if (selectedTab === GuestTabs.CONFIRM) {
                return {
                    ...preparedGuest,
                    primaryAction: cancelConfirmationAction,
                };
            }

            if (selectedTab === GuestTabs.NOT_CONFIRM) {
                return {
                    ...preparedGuest,
                    primaryAction: provideConfirmationAction,
                };
            }

            if (guest.status !== GuestsBookingStatuses.PENDING) {
                return preparedGuest;
            }

            return {
                ...preparedGuest,
                primaryAction: confirmAction,
                secondaryAction: notConfirmAction,
            };
        });
    }, [
        guestsTabDetails.eventGuests,
        onAcceptGuest,
        onRejectGuest,
        onUserPressById,
        selectedTab,
        t,
        updatingGuestId,
        requiresConfirmation,
        isEventOwner,
        guestsTabDetails.organizerId,
    ]);

    return {
        eventGuests,
        tabs,
        areStatusTabsVisible: Boolean(requiresConfirmation && isEventOwner),
        isLoading: guestsTabDetails.isLoading,
        isRefreshing: guestsTabDetails.isRefreshing,
        isError: guestsTabDetails.isError,
        errorMessage: guestsTabDetails.errorMessage,
        onRefresh: guestsTabDetails.onRefresh,
        onLoadMore: guestsTabDetails.onLoadMore,
    };
};
