import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { eventsService } from '@/entities/events/EventsService';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventsListParams } from '@/entities/events/params/IEventsListParams';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { Sex } from '@/entities/events/enums/Sex';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const DEFAULT_RADIUS_KM = 100;
const DEFAULT_LIMIT = 10;
const OFFSET = 0;

interface IFilters {
    eventDate?: string;
    language?: string;
    minPrice?: number;
    maxPrice?: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}

export const useEventsList = () => {
    const isFocused = useIsFocused();
    const { userLocation, isLoading: isLocationLoading } = useLocationPermission();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filters, setFilters] = useState<IFilters>({});
    const hasAutoLoadedOnFocusRef = useRef(false);
    const list = eventsModel.list;
    const hasMore = useMemo(() => {
        if (!list) {
            return true;
        }

        return list.count > list.rows.length;
    }, [list]);

    const loadEvents = useCallback(async (offset: number) => {
        const location = userLocation || KYIV_COORDINATES;

        if (offset === OFFSET) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const params: IEventsListParams = {
                latitude: location.latitude,
                longitude: location.longitude,
                radiusKm: DEFAULT_RADIUS_KM,
                offset,
                limit: DEFAULT_LIMIT,
                ...filters,
            };

            const response = await eventsService.getList(params);

            if (response.isError || !response.data) {
                return;
            }
        } catch (error) {
            console.warn('useEventsList -> loadEvents: ', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [filters, userLocation]);

    const onRefresh = useCallback((offset: number = OFFSET) => {
        loadEvents(offset);
    }, [loadEvents]);

    const onLoadMore = useCallback(() => {
        if (!isLoading && list && list.count > list.rows.length) {
            loadEvents(list.rows.length);
        }
    }, [isLoading, list, loadEvents]);

    const onApplyFilters = useCallback((newFilters: IFilters) => {
        setFilters(newFilters);
    }, []);

    const onClearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const refetch = useCallback(() => {
        onRefresh();
    }, [onRefresh]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            return;
        }

        if (isLocationLoading || hasAutoLoadedOnFocusRef.current) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        if (isFocused) {
            onRefresh();
        }
    }, [isFocused, isLocationLoading, onRefresh]);

    return {
        events: eventsModel.events,
        isLoading,
        isRefreshing,
        hasMore,
        filters,
        loadEvents,
        onRefresh,
        onLoadMore,
        onApplyFilters,
        onClearFilters,
        refetch,
    };
};
