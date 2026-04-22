import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { eventsService } from '@/entities/events/EventsService';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventsListParams } from '@/entities/events/params/IEventsListParams';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { Sex } from '@/entities/events/enums/Sex';
import { IUserLocation } from '@/entities/location/types/IUserLocation';

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

interface IProps {
    searchLocation?: IUserLocation | null;
}

export const useEventsList = ({ searchLocation }: IProps = {}) => {
    const isFocused = useIsFocused();
    const { userLocation, isLoading: isLocationLoading } = useLocationPermission();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filters, setFilters] = useState<IFilters>({});
    const hasAutoLoadedOnFocusRef = useRef(false);
    const lastLoadedLocationKeyRef = useRef('');
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
    }, [filters, getTargetLocation]);

    const onRefresh = useCallback((offset: number = OFFSET, location?: IUserLocation | null) => {
        return loadEvents(offset, location);
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

    const refetch = useCallback((location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedLocationKeyRef.current = `${targetLocation.latitude}:${targetLocation.longitude}`;
        return onRefresh(OFFSET, targetLocation);
    }, [getTargetLocation, onRefresh]);

    useEffect(() => {
        if (!isFocused) {
            hasAutoLoadedOnFocusRef.current = false;
            return;
        }

        if (isLocationLoading) {
            return;
        }

        const targetLocation = getTargetLocation();
        const currentLocationKey = `${targetLocation.latitude}:${targetLocation.longitude}`;
        const isSameLocation = lastLoadedLocationKeyRef.current === currentLocationKey;
        if (hasAutoLoadedOnFocusRef.current && isSameLocation) {
            return;
        }

        hasAutoLoadedOnFocusRef.current = true;
        lastLoadedLocationKeyRef.current = currentLocationKey;
        if (isFocused) {
            onRefresh(OFFSET, targetLocation);
        }
    }, [getTargetLocation, isFocused, isLocationLoading, onRefresh]);

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
