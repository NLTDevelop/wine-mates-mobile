import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { eventsService } from '@/entities/events/EventsService';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventsListParams } from '@/entities/events/params/IEventsListParams';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { IEventFilters } from '@/modules/event/types/IEventFilters';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const DEFAULT_RADIUS_KM = 100;
const DEFAULT_LIMIT = 10;
const OFFSET = 0;

interface IProps {
    searchLocation?: IUserLocation | null;
    filters?: IEventFilters;
}

export const useEventsList = ({ searchLocation, filters }: IProps = {}) => {
    const isFocused = useIsFocused();
    const { userLocation, isLoading: isLocationLoading } = useLocationPermission();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const hasAutoLoadedOnFocusRef = useRef(false);
    const lastLoadedLocationKeyRef = useRef('');
    const lastLoadedFiltersKeyRef = useRef('');
    const filtersKey = useMemo(() => {
        return `${filters?.radiusKm ?? ''}:${filters?.eventDate ?? ''}:${filters?.language ?? ''}:${filters?.sex ?? ''}:${filters?.minAge ?? ''}:${filters?.maxAge ?? ''}:${filters?.minPrice ?? ''}:${filters?.maxPrice ?? ''}`;
    }, [filters?.eventDate, filters?.language, filters?.maxAge, filters?.maxPrice, filters?.minAge, filters?.minPrice, filters?.radiusKm, filters?.sex]);
    const list = eventsModel.list;
    const hasMore = useMemo(() => {
        if (!list) {
            return true;
        }

        return list.count > list.rows.length;
    }, [list]);

    const getTargetLocation = useCallback((location?: IUserLocation | null) => {
        return location || searchLocation || userLocation || KYIV_COORDINATES;
    }, [searchLocation, userLocation]);

    const loadEvents = useCallback(async (offset: number, location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);

        if (offset === OFFSET) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const params: IEventsListParams = {
                latitude: targetLocation.latitude,
                longitude: targetLocation.longitude,
                radiusKm: filters?.radiusKm ?? DEFAULT_RADIUS_KM,
                offset,
                limit: DEFAULT_LIMIT,
                eventDate: filters?.eventDate,
                language: filters?.language,
                minPrice: filters?.minPrice,
                maxPrice: filters?.maxPrice,
                sex: filters?.sex,
                minAge: filters?.minAge,
                maxAge: filters?.maxAge,
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
    }, [filters?.eventDate, filters?.language, filters?.maxAge, filters?.maxPrice, filters?.minAge, filters?.minPrice, filters?.radiusKm, filters?.sex, getTargetLocation]);

    const onRefresh = useCallback((offset: number = OFFSET, location?: IUserLocation | null) => {
        return loadEvents(offset, location);
    }, [loadEvents]);

    const onLoadMore = useCallback(() => {
        if (!isLoading && list && list.count > list.rows.length) {
            loadEvents(list.rows.length);
        }
    }, [isLoading, list, loadEvents]);

    const refetch = useCallback((location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedLocationKeyRef.current = `${targetLocation.latitude}:${targetLocation.longitude}`;
        lastLoadedFiltersKeyRef.current = filtersKey;
        return onRefresh(OFFSET, targetLocation);
    }, [filtersKey, getTargetLocation, onRefresh]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            lastLoadedFiltersKeyRef.current = '';
            return;
        }

        if (isLocationLoading) {
            return;
        }

        const targetLocation = getTargetLocation();
        const currentLocationKey = `${targetLocation.latitude}:${targetLocation.longitude}`;
        const isSameLocation = lastLoadedLocationKeyRef.current === currentLocationKey;
        const isSameFilters = lastLoadedFiltersKeyRef.current === filtersKey;
        if (hasAutoLoadedOnFocusRef.current && isSameLocation && isSameFilters) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedLocationKeyRef.current = currentLocationKey;
        lastLoadedFiltersKeyRef.current = filtersKey;
        if (isFocused) {
            onRefresh(OFFSET, targetLocation);
        }
    }, [filtersKey, getTargetLocation, isFocused, isLocationLoading, onRefresh]);

    return {
        events: eventsModel.events,
        isLoading,
        isRefreshing,
        hasMore,
        loadEvents,
        onRefresh,
        onLoadMore,
        refetch,
    };
};
