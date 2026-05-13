/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { IEventDetail } from '@/entities/events/types/IEvent';
import { eventsService } from '@/entities/events/EventsService';

export const useEventDetails = (eventId: number, isEventDetailsTabFocused: boolean) => {
    const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasLoadedRef = useRef(false);
    const isRefreshInProgressRef = useRef(false);

    const loadEventDetails = useCallback(async (showLoader: boolean) => {
        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const response = await eventsService.getById(eventId);
            if (!response.isError && response.data) {
                setEventDetail(response.data);
                setIsError(false);
            } else {
                setIsError(true);
            }
        } catch (error) {
            console.warn('useEventDetails -> loadEventDetails: ', error);
            setIsError(true);
        } finally {
            hasLoadedRef.current = true;
            if (showLoader) {
                setIsLoading(false);
            }
        }
    }, [eventId]);

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
        setEventDetail,
        isError,
        isLoading,
        isRefreshing,
        onRefresh,
    };
};
