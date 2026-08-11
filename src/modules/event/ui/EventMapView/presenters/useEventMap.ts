import { useMemo, useState, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { locationModel } from '@/entities/location/LocationModel';
import { eventsModel } from '@/entities/events/EventsModel';
import { eventsService } from '@/entities/events/EventsService';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { IEventFilters } from '@/modules/event/types/IEventFilters';
import { EventType } from '@/entities/events/enums/EventType';
import { IEventMapPin } from '@/entities/events/types/IEventMapPin';

const KYIV_COORDINATES = {
    latitude: 50.4501,
    longitude: 30.5234,
};

const MAP_DELTA = {
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

const DEFAULT_RADIUS_KM = 50;

interface IProps {
    searchLocation?: IUserLocation | null;
    filters?: IEventFilters;
}

export const useEventMap = ({ searchLocation, filters }: IProps = {}) => {
    const userLocation = locationModel.userLocation;
    const hasPermission = locationModel.hasPermission;
    const isLocationLoading = locationModel.isLoading;
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'all' | 'tastings' | 'parties'>('all');
    const selectedEventType = useMemo(() => {
        if (selectedTab === 'tastings') {
            return EventType.Tastings;
        }

        if (selectedTab === 'parties') {
            return EventType.Parties;
        }

        return undefined;
    }, [selectedTab]);

    const getTargetLocation = useCallback((location?: IUserLocation | null) => {
        return location || searchLocation || userLocation || null;
    }, [searchLocation, userLocation]);

    const loadEvents = useCallback(async (location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        if (!targetLocation) {
            return;
        }

        setIsLoadingEvents(true);
        try {
            await eventsService.getMapPins({
                latitude: targetLocation.latitude,
                longitude: targetLocation.longitude,
                radiusKm: filters?.radiusKm ?? DEFAULT_RADIUS_KM,
                eventType: selectedEventType,
                eventStartDate: filters?.eventStartDate,
                eventEndDate: filters?.eventEndDate,
                minPrice: filters?.minPrice,
                maxPrice: filters?.maxPrice,
                sex: filters?.sex,
                minAge: filters?.minAge,
                maxAge: filters?.maxAge,
            });
        } catch (error) {
            console.warn('useEventMap -> loadEvents: ', error);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [filters, getTargetLocation, selectedEventType]);

    const initialRegion: Region = useMemo(() => {
        if (searchLocation) {
            return {
                latitude: searchLocation.latitude,
                longitude: searchLocation.longitude,
                ...MAP_DELTA,
            };
        }

        if (userLocation) {
            return {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                ...MAP_DELTA,
            };
        }

        if (hasPermission) {
            return {
                latitude: KYIV_COORDINATES.latitude,
                longitude: KYIV_COORDINATES.longitude,
                ...MAP_DELTA,
            };
        }

        return {
            ...KYIV_COORDINATES,
            ...MAP_DELTA,
        };
    }, [hasPermission, searchLocation, userLocation]);

    const onFavoritePress = useCallback(async (eventId: number) => {
        try {
            await eventsService.toggleSave(eventId);
        } catch (error) {
            console.warn('useEventMap -> onFavoritePress: ', error);
        }
    }, []);

    const onTabChange = useCallback((tab: 'all' | 'tastings' | 'parties') => {
        setSelectedTab(tab);
    }, []);

    const mapPins = eventsModel.mapPins.reduce<IEventMapPin[]>((result, pin) => {
        const latitude = Number(pin.latitude);
        const longitude = Number(pin.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return result;
        }

        result.push({
            ...pin,
            latitude,
            longitude,
        });

        return result;
    }, []);

    const refetch = useCallback((location?: IUserLocation | null) => {
        const targetLocation = getTargetLocation(location);
        if (!targetLocation) {
            return Promise.resolve();
        }
        return loadEvents(targetLocation);
    }, [getTargetLocation, loadEvents]);

    return {
        mapPins,
        initialRegion,
        userLocation,
        isLocationLoading,
        isLoadingEvents,
        onFavoritePress,
        selectedTab,
        onTabChange,
        refetch,
    };
};
