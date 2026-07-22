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

interface IProps {
    eventId: number;
    requiresConfirmation?: boolean;
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

const getAge = (birthday: string) => {
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

export const useEventGuestsTab = ({ eventId, requiresConfirmation }: IProps) => {
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
    });
    const { onAcceptGuest, onRejectGuest, updatingGuestId } = guestsTabDetails;

    const eventGuests: IPreparedEventGuest[] = useMemo(() => {
        return guestsTabDetails.eventGuests.map(guest => {
            const fullName = `${guest.user?.firstName ?? '-'} ${guest.user?.lastName ?? '-'}`.trim();
            const age = getAge(guest.user?.birthday);
            const ageText = age === null ? '' : `${age} ${t('eventGuests.age')}`;
            const isUpdating = updatingGuestId === guest.id;
            const preparedGuest = {
                id: guest.id,
                fullName,
                ageText,
                avatarUrl: guest.user?.avatar?.smallUrl || null,
                onUserPress: () => onUserPressById(guest.user.id),
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

            if (!requiresConfirmation) {
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
    ]);

    return {
        eventGuests,
        tabs,
        isLoading: guestsTabDetails.isLoading,
        isError: guestsTabDetails.isError,
        errorMessage: guestsTabDetails.errorMessage,
        onLoadMore: guestsTabDetails.onLoadMore,
    };
};
