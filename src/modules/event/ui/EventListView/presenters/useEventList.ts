import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { IGetEventsParams } from '@/entities/events/params/IGetEventsParams';

const OFFSET = 0;
const LIMIT = 10;


export const useEventsList = () => {
    const isFocused = useIsFocused();

    const [isLoading, setIsLoading] = useState(true, );
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasAutoLoadedOnFocusRef = useRef(false);
    const lastLoadedFiltersKeyRef = useRef('');

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

                    if (createdResult.isError || createdResult.data !== null || savedResult.isError || savedResult.data !== null || appliedResult.isError || appliedResult.data !== null) {
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
        return loadEvents(offset, 'none');
    }, [loadEvents]);

    const onLoadMoreSaved = useCallback(() => {
        if (!isLoading && savedEvents && savedEvents.count > savedEvents.rows.length) {
            loadEvents(savedEvents.rows.length, 'saved');
        }
    }, [isLoading, savedEvents, loadEvents]);

    const onLoadMoreCreated = useCallback(() => {
        if (!isLoading && createdEvents && createdEvents.count > createdEvents.rows.length) {
            loadEvents(createdEvents.rows.length, 'created');
        }
    }, [isLoading, createdEvents, loadEvents]); 

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
            lastLoadedFiltersKeyRef.current = '';
            return;
        }
        const timer = setTimeout(() => {
            console.log('Refresh list');
            const isNeedToLoad = (appliedEvents.length == 0 && (savedEvents?.rows ?? 0) == 0 && (createdEvents?.rows ?? 0) == 0); 
            
            if(isNeedToLoad){
                onRefresh(OFFSET);
            }
        }, 150);


       return () => clearTimeout(timer);
       
    }, [ isFocused, onRefresh, createdEvents, appliedEvents, savedEvents]);


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
