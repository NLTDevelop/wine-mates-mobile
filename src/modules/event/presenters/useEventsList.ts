import { useCallback, useState } from 'react';
import { eventService } from '@/entities/events/EventService';
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
    const { userLocation } = useLocationPermission();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState<IFilters>({});

    const loadEvents = useCallback(async (isRefresh = false) => {
        const location = userLocation || KYIV_COORDINATES;
        const currentOffset = isRefresh ? 0 : offset;

        if (isRefresh) {
            setIsRefreshing(true);
            setOffset(0);
        } else {
            setIsLoading(true);
        }

        try {
            const params: IEventsListParams = {
                latitude: location.latitude,
                longitude: location.longitude,
                radiusKm: DEFAULT_RADIUS_KM,
                offset: currentOffset,
                limit: DEFAULT_LIMIT,
                ...filters,
            };

            const response = await eventService.getList(params);

            if (!response.isError && response.data) {
                setHasMore(response.data.rows.length === DEFAULT_LIMIT);
                if (!isRefresh) {
                    setOffset(currentOffset + DEFAULT_LIMIT);
                } else {
                    setOffset(DEFAULT_LIMIT);
                }
            }
        } catch (error) {
            console.warn('useEventsList -> loadEvents: ', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [userLocation, offset, filters]);

    const onRefresh = useCallback(() => {
        loadEvents(true);
    }, [loadEvents]);

    const onLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            loadEvents(false);
        }
    }, [isLoading, hasMore, loadEvents]);

    const onApplyFilters = useCallback((newFilters: IFilters) => {
        setFilters(newFilters);
        setOffset(0);
        setHasMore(true);
    }, []);

    const onClearFilters = useCallback(() => {
        setFilters({});
        setOffset(0);
        setHasMore(true);
    }, []);

    const refetch = useCallback(() => {
        loadEvents(true);
    }, [loadEvents]);

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
