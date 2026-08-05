import { GuestsBookingStatuses } from '@/entities/guests/enums/GuestsBookingStatuses';
import { guestListModel } from '@/entities/guests/GuestListModel';
import { guestListService } from '@/entities/guests/GuestListService';
import { IGetEventGuestsParams } from '@/entities/guests/params/IGetEventGuestsParams';
import { useCallback, useEffect, useState } from 'react';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';
import { IGuestUser } from '@/entities/guests/types/IGuestUser';
import { IGuestBooking } from '@/entities/guests/types/IGuestBooking';

const OFFSET = 0;
const LIMIT = 20;

interface IProps {
    eventId: number;
    status?: IGetEventGuestsParams['status'];
    isEventOwner: boolean;
}

const getPublicEventGuests = (organizer: IGuestUser | null, guests: IGuestUser[]): IGuestBooking[] => {
    if (!organizer) {
        return [];
    }

    return [organizer, ...guests.filter(guest => guest.id !== organizer.id)].map(user => ({
        id: user.id,
        status: GuestsBookingStatuses.ACCEPTED,
        createdAt: '',
        user,
    }));
};

export const useEventGuestsTabDetails = ({ eventId, status = 'all', isEventOwner }: IProps) => {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [updatingGuestId, setUpdatingGuestId] = useState<number | null>(null);
    const [organizer, setOrganizer] = useState<IGuestUser | null>(null);
    const [guestUsers, setGuestUsers] = useState<IGuestUser[]>([]);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const guestList = guestListModel.guests;
    const eventGuests = isEventOwner ? guestList?.rows || [] : getPublicEventGuests(organizer, guestUsers);
    const hasMoreGuests = isEventOwner && guestList ? guestList.count > guestList.rows.length : false;

    const loadGuests = useCallback(
        async (offset: number = OFFSET, showRefreshIndicator: boolean = false) => {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else if (offset === OFFSET) {
                setIsLoading(true);
            }

            setIsError(false);
            setErrorMessage('');

            try {
                if (isEventOwner) {
                    const response = await guestListService.getEventGuests({ eventId, status, offset, limit: LIMIT });

                    if (response.isError) {
                        setIsError(true);
                        setErrorMessage(response.message || '');
                    }

                    return;
                }

                const response = await guestListService.getEventGuestUsers(eventId);
                if (response.isError || !response.data) {
                    setIsError(true);
                    setErrorMessage(response.message || '');
                    return;
                }

                setOrganizer(response.data.organizer);
                setGuestUsers(response.data.guests || []);
            } catch (error) {
                console.warn('useEventGuestsTabDetails -> loadGuests: ', error);
                setIsError(true);
                setErrorMessage('');
            } finally {
                setIsLoading(false);
                if (showRefreshIndicator) {
                    setIsRefreshing(false);
                }
            }
        },
        [eventId, isEventOwner, status],
    );

    const onRefresh = useCallback(() => {
        onResetPaginationRequests();
        return loadGuests(OFFSET, true);
    }, [loadGuests, onResetPaginationRequests]);

    const onLoadMore = useCallback(() => {
        if (!isEventOwner) {
            return;
        }

        const currentGuestList = guestListModel.guests;
        const offset = currentGuestList?.rows.length || 0;
        if (
            !isLoading &&
            currentGuestList &&
            currentGuestList.count > offset &&
            onTryStartPaginationRequest(offset)
        ) {
            return loadGuests(offset);
        }
    }, [isEventOwner, isLoading, loadGuests, onTryStartPaginationRequest]);

    const onAcceptGuest = useCallback(
        async (id: number) => {
            try {
                setUpdatingGuestId(id);
                const response = await guestListService.updateGuestStatus(id, {
                    status: GuestsBookingStatuses.ACCEPTED,
                });
                if (!response.isError) {
                    await loadGuests(OFFSET);
                }
            } catch (error) {
                console.warn('useEventGuestsTabDetails -> onAcceptGuest: ', error);
            } finally {
                setUpdatingGuestId(null);
            }
        },
        [loadGuests],
    );

    const onRejectGuest = useCallback(
        async (id: number) => {
            try {
                setUpdatingGuestId(id);
                const response = await guestListService.updateGuestStatus(id, {
                    status: GuestsBookingStatuses.REJECTED,
                });
                if (!response.isError) {
                    await loadGuests(OFFSET);
                }
            } catch (error) {
                console.warn('useEventGuestsTabDetails -> onRejectGuest: ', error);
            } finally {
                setUpdatingGuestId(null);
            }
        },
        [loadGuests],
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            onResetPaginationRequests();
            loadGuests(OFFSET);
        }, 0);

        return () => {
            clearTimeout(timer);
            guestListModel.clear();
        };
    }, [loadGuests, onResetPaginationRequests]);

    return {
        eventGuests,
        organizerId: organizer?.id || null,
        isError,
        errorMessage,
        isLoading,
        isRefreshing,
        hasMoreGuests,
        updatingGuestId,
        loadGuests,
        onRefresh,
        onLoadMore,
        onAcceptGuest,
        onRejectGuest,
    };
};
