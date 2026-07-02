import { useCallback, useMemo, useState } from 'react';
import { locationModel } from '@/entities/location/LocationModel';
import { eventsService } from '@/entities/events/EventsService';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventsListParams } from '@/entities/events/params/IEventsListParams';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { IEventFilters } from '@/modules/event/types/IEventFilters';
import { EventType } from '@/entities/events/enums/EventType';

const DEFAULT_RADIUS_KM = 50;
const DEFAULT_LIMIT = 10;
const OFFSET = 0;

interface IProps {
    searchLocation?: IUserLocation | null;
    filters?: IEventFilters;
    selectedEventType?: EventType;
}

export const useEventsList = ({ searchLocation, filters, selectedEventType }: IProps = {}) => {
    const userLocation = locationModel.userLocation;
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const list = eventsModel.list;
    const hasMore = useMemo(() => {
        if (!list) {
            return true;
        }

        return list.count > list.rows.length;
    }, [list]);

    const getTargetLocation = useCallback((location?: IUserLocation | null) => {
        return location || searchLocation || userLocation || null;
    }, [searchLocation, userLocation]);

    const loadEvents = useCallback(async (offset: number, location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        if (!targetLocation) {
            return;
        }

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
                eventStartDate: filters?.eventStartDate,
                eventEndDate: filters?.eventEndDate,
                eventType: selectedEventType,
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
    }, [filters, getTargetLocation, selectedEventType]);

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
        if (!targetLocation) {
            return Promise.resolve();
        }
        return onRefresh(OFFSET, targetLocation);
    }, [getTargetLocation, onRefresh]);

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
