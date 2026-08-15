/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { IEventDetail } from '@/entities/events/types/IEvent';
import { eventsService } from '@/entities/events/EventsService';
import { userModel } from '@/entities/users/UserModel';

const FORBIDDEN_STATUS = 403;

export const useEventDetails = (eventId: number, isEventDetailsTabFocused: boolean) => {
    const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);
    const [isError, setIsError] = useState(false);
    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasLoadedRef = useRef(false);
    const isRefreshInProgressRef = useRef(false);

    const loadEventDetails = useCallback(
        async (showLoader: boolean) => {
            if (showLoader) {
                setIsLoading(true);
            }

            try {
                const [response] = await Promise.all([
                    eventsService.getById(eventId),
                    eventsService.getAppliedEvents(),
                ]);

                if (!response.isError && response.data) {
                    setEventDetail(response.data);
                    setIsError(false);
                    setIsAccessDenied(false);
                } else {
                    setIsError(true);
                    setIsAccessDenied(response.status === FORBIDDEN_STATUS);
                }
            } catch (error) {
                console.warn('useEventDetails -> loadEventDetails: ', error);
                setIsError(true);
                setIsAccessDenied(false);
            } finally {
                hasLoadedRef.current = true;
                if (showLoader) {
                    setIsLoading(false);
                }
            }
        },
        [eventId],
    );

    const onRefresh = useCallback(async () => {
        if (isRefreshInProgressRef.current) {
            return;
        }

        isRefreshInProgressRef.current = true;
        setIsRefreshing(true);
        await loadEventDetails(false);
        isRefreshInProgressRef.current = false;
        setIsRefreshing(false);
    }, [loadEventDetails]);

    useEffect(() => {
        loadEventDetails(true);
    }, [loadEventDetails]);

    useEffect(() => {
        if (!isEventDetailsTabFocused || !hasLoadedRef.current) {
            return;
        }

        onRefresh();
    }, [isEventDetailsTabFocused, onRefresh]);

    useFocusEffect(
        useCallback(() => {
            if (!isEventDetailsTabFocused || !hasLoadedRef.current) {
                return undefined;
            }

            onRefresh();

            return undefined;
        }, [isEventDetailsTabFocused, onRefresh]),
    );

    return {
        eventDetail,
        isEventOwner: Boolean(eventDetail?.ownerId && eventDetail.ownerId === userModel.user?.id),
        setEventDetail,
        isError,
        shouldShowAccessDenied: !isLoading && isAccessDenied,
        isLoading,
        isRefreshing,
        onRefresh,
    };
};
