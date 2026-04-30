import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
// import { eventsService } from '@/entities/events/EventsService';
import { eventsModel } from '@/entities/events/EventsModel';
// import { IEventsListParams } from '@/entities/events/params/IEventsListParams';
// import { useLocationPermission } from '@/hooks/useLocationPermission';
// import { IEventFilters } from '@/modules/event/types/IEventFilters';
// import { EventType } from '@/entities/events/enums/EventType';

const OFFSET = 0;





export const useEventsList = () => {
    const isFocused = useIsFocused();

    const [isLoading, setIsLoading] = useState(false, );
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
    // const getTargetLocation = useCallback((location?: IUserLocation | null) => {
    //     return location || searchLocation || userLocation || KYIV_COORDINATES;
    // }, [searchLocation, userLocation]);

    const loadEvents = useCallback(async (offset: number, _type: 'saved' | 'created' | 'none') => {
        

        if (offset === OFFSET) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            // switch (type) {
            //     case 'saved':
            //         await eventsService.getSavedEvents(params);
            //         break;
            //     case 'created':
            //         await eventsService.getCreatedEvents(params);
            //         break;
            //     default:
            //         const [createdResult, savedResult, appliedResult] =await Promise.all([
            //             eventsService.getCreatedEvents(params),
            //             eventsService.getSavedEvents(params),
            //             eventsService.getAppliedEvents(),
            //         ]);

            //         if (createdResult.isError || !createdResult.data || savedResult.isError || !savedResult.data || appliedResult.isError || !appliedResult.data) {
            //             return;
            //         }
            // }

            
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

    // const refetch = useCallback((location?: IUserLocation | null) => {
    //     const targetLocation = getTargetLocation(location);
    //     hasAutoLoadedOnFocusRef.current = true;
    //     lastLoadedLocationKeyRef.current = `${targetLocation.latitude}:${targetLocation.longitude}`;
    //     lastLoadedFiltersKeyRef.current = filtersKey;
    //     return onRefresh(OFFSET);
    // }, [ onRefresh]);

    useEffect(() => {

        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            lastLoadedFiltersKeyRef.current = '';
            return;
        }
        const timer = setTimeout(() => {
            onRefresh(OFFSET);
        }, 150);

        // const targetLocation = getTargetLocation();
        // const currentLocationKey = `${targetLocation.latitude}:${targetLocation.longitude}`;
        // const isSameLocation = lastLoadedLocationKeyRef.current === currentLocationKey;
        // const isSameFilters = lastLoadedFiltersKeyRef.current === filtersKey;

        // hasAutoLoadedOnFocusRef.current = true;
        // lastLoadedLocationKeyRef.current = currentLocationKey;
        // lastLoadedFiltersKeyRef.current = filtersKey;
       return () => clearTimeout(timer);
       
    }, [ isFocused, onRefresh]);

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
        //refetch,
    };
};
