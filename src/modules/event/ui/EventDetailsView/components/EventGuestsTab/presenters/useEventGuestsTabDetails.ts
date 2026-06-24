import { GuestsBookingStatuses } from '@/entities/guests/enums/GuestsBookingStatuses';
import { guestListModel } from '@/entities/guests/GuestListModel';
import { guestListService } from '@/entities/guests/GuestListService';
import { IGetEventGuestsParams } from '@/entities/guests/params/IGetEventGuestsParams';
import { useCallback, useEffect, useState } from 'react';

const OFFSET = 0;
const LIMIT = 20;

interface IProps {
    eventId: number;
    status?: IGetEventGuestsParams['status'];
}

export const useEventGuestsTabDetails = ({ eventId, status = 'all' }: IProps) => {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [updatingGuestId, setUpdatingGuestId] = useState<number | null>(null);

    const guestList = guestListModel.guests;
    const eventGuests = guestList?.rows || [];
    const hasMoreGuests = guestList ? guestList.count > guestList.rows.length : true;

    const loadGuests = useCallback(
        async (offset: number = OFFSET) => {
            if (offset === OFFSET) {
                setIsLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setIsError(false);
            setErrorMessage('');

            try {
                const response = await guestListService.getEventGuests({ eventId, status, offset, limit: LIMIT });

                if (response.isError) {
                    setIsError(true);
                    setErrorMessage(response.message || '');
                }
            } catch (error) {
                console.warn('useEventGuestsTabDetails -> loadGuests: ', error);
                setIsError(true);
                setErrorMessage('');
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [eventId, status],
    );

    const onRefresh = useCallback(() => {
        return loadGuests(OFFSET);
    }, [loadGuests]);

    const onLoadMore = useCallback(() => {
        const currentGuestList = guestListModel.guests;
        if (!isLoading && currentGuestList && currentGuestList.count > currentGuestList.rows.length) {
            return loadGuests(currentGuestList.rows.length);
        }
    }, [isLoading, loadGuests]);

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
            loadGuests(OFFSET);
        }, 0);

        return () => {
            clearTimeout(timer);
            guestListModel.clear();
        };
    }, [loadGuests]);

    return {
        eventGuests,
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
