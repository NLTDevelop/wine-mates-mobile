import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { IGetEventsParams } from '@/entities/events/params/IGetEventsParams';
import { usePaginationRequestGuard } from '@/hooks/usePaginationRequestGuard';

const OFFSET = 0;
const LIMIT = 10;


export const useEventsList = () => {
    const isFocused = useIsFocused();

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasAutoLoadedOnFocusRef = useRef(false);
    const { onTryStartPaginationRequest, onResetPaginationRequests } = usePaginationRequestGuard();

    const savedEvents = eventsModel.savedEvents;
    const createdEvents = eventsModel.createdEvents;
    const appliedEvents = eventsModel.appliedEvents;

    const hasMoreSavedEvents = useMemo(() => {
        if (!savedEvents) {
            return true;
        }

        return savedEvents.count > savedEvents.rows.length;
    }, [savedEvents]);


    const hasMoreCreatedEvents = useMemo(() => {
        if (!createdEvents) {
            return true;
        }

        return createdEvents.count > createdEvents.rows.length;
    }, [createdEvents]);

    const loadEvents = useCallback(async (offset: number, _type: 'saved' | 'created' | 'none') => {
        if (offset === OFFSET) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        try {
            const params:IGetEventsParams = {
                offset,
                limit: LIMIT,
            };
            if(_type === 'saved') {
                const savedResult = await eventsService.getSavedEvents(params);
                if (savedResult.isError || !savedResult.data) {
                        return;
                    }
            } else if (_type === 'created') {
                const createdResult = await eventsService.getCreatedEvents(params);
                if (createdResult.isError || !createdResult.data) {
                        return;
                    }
            } else {
                const [createdResult, savedResult, appliedResult] = await Promise.all([
                        eventsService.getCreatedEvents(params),
                        eventsService.getSavedEvents(params),
                        eventsService.getAppliedEvents(),
                    ]);

                    if (createdResult.isError || !createdResult.data || savedResult.isError || !savedResult.data || appliedResult.isError || !appliedResult.data) {
                        return;
                    }
            }
            
        } catch (error) {
            console.warn('useEventsList -> loadEvents: ', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [ ]);

    const onRefresh = useCallback((offset: number = OFFSET,) => {
        onResetPaginationRequests();
        return loadEvents(offset, 'none');
    }, [loadEvents, onResetPaginationRequests]);

    const onLoadMoreSaved = useCallback(() => {
        const offset = savedEvents?.rows.length || 0;
        if (
            !isLoading &&
            savedEvents &&
            savedEvents.count > offset &&
            onTryStartPaginationRequest(`saved:${offset}`)
        ) {
            loadEvents(offset, 'saved');
        }
    }, [isLoading, savedEvents, loadEvents, onTryStartPaginationRequest]);

    const onLoadMoreCreated = useCallback(() => {
        const offset = createdEvents?.rows.length || 0;
        if (
            !isLoading &&
            createdEvents &&
            createdEvents.count > offset &&
            onTryStartPaginationRequest(`created:${offset}`)
        ) {
            loadEvents(offset, 'created');
        }
    }, [isLoading, createdEvents, loadEvents, onTryStartPaginationRequest]);

    const onFavoritePress = useCallback(async (eventId: number) => {
        try {
            await eventsService.toggleSave(eventId);
        } catch (error) {
            console.warn('useEventsList -> onFavoritePress: ', error);
        }
    }, []);


    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            return;
        }

        if (hasAutoLoadedOnFocusRef.current) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        onRefresh(OFFSET);
    }, [ isFocused, onRefresh]);


    useEffect(() => {
        return () => eventsModel.clear();
    }, []);

    return {
        savedEvents,
        createdEvents,
        appliedEvents,
        isLoading,
        isRefreshing,
        hasMoreSavedEvents,
        hasMoreCreatedEvents,
        loadEvents,
        onRefresh,
        onLoadMoreSaved,
        onLoadMoreCreated,
        onFavoritePress,
    };
};
