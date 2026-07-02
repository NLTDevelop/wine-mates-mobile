import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapPressEvent } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventType } from '@/entities/events/enums/EventType';
import { locationModel } from '@/entities/location/LocationModel';
import { eventsModel } from '@/entities/events/EventsModel';
import { useEventMap } from '@/modules/event/ui/EventMapView/presenters/useEventMap';
import { useEventsList } from '@/modules/event/ui/EventMapView/presenters/useEventsList';
import { useEventMapView } from '@/modules/event/ui/EventMapView/presenters/useEventMapView';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';

type Navigation = NativeStackNavigationProp<EventStackParamList>;

export const useEventMapScreen = () => {
    const navigation = useNavigation<Navigation>();
    const [isRefetching, setIsRefetching] = useState(false);
    const [searchLocation, setSearchLocation] = useState<IUserLocation | null>(null);
    const isRefetchingRef = useRef(false);
    const hasFocusedLoadedRef = useRef(false);
    const searchLocationRef = useRef<IUserLocation | null>(null);
    const userLocationRef = useRef<IUserLocation | null>(null);
    const lastSelectedEventTypeRef = useRef<EventType | undefined>(undefined);
    const filters = eventsModel.eventFilters;

    const {
        mapPins,
        initialRegion,
        userLocation,
        isLocationLoading,
        selectedTab,
        onTabChange,
        onFavoritePress: onMapFavoritePress,
        refetch: onRefetchMapPins,
    } = useEventMap({ searchLocation, filters });

    const selectedEventType = useMemo(() => {
        if (selectedTab === 'all') {
            return undefined;
        }

        if (selectedTab === 'tastings') {
            return EventType.Tastings;
        }

        return EventType.Parties;
    }, [selectedTab]);

    const {
        events,
        refetch: onRefetchEvents,
    } = useEventsList({ searchLocation, filters, selectedEventType });
    const onRefetchMapPinsRef = useRef(onRefetchMapPins);
    const onRefetchEventsRef = useRef(onRefetchEvents);

    const {
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCardPress,
        onCloseModal,
        onModalReadMorePress,
        onModalFavoritePress,
        onReadMorePress,
        onEditPress,
        onFavoritePress,
    } = useEventMapView({
        events,
        onFavoritePress: onMapFavoritePress,
    });

    const filterCount = useMemo(() => {
        let nextCount = 0;

        if (typeof filters.radiusKm === 'number') {
            nextCount += 1;
        }

        if (filters.eventStartDate || filters.eventEndDate) {
            nextCount += 1;
        }

        if (filters.sex) {
            nextCount += 1;
        }

        if (typeof filters.minAge === 'number' || typeof filters.maxAge === 'number') {
            nextCount += 1;
        }

        if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') {
            nextCount += 1;
        }

        return nextCount;
    }, [filters.eventEndDate, filters.eventStartDate, filters.maxAge, filters.maxPrice, filters.minAge, filters.minPrice, filters.radiusKm, filters.sex]);

    const onFilterPress = useCallback(() => {
        navigation.navigate('EventFiltersView', {
            searchLocation: searchLocation || userLocation || null,
            selectedEventType,
        });
    }, [navigation, searchLocation, selectedEventType, userLocation]);

    useEffect(() => {
        onRefetchMapPinsRef.current = onRefetchMapPins;
    }, [onRefetchMapPins]);

    useEffect(() => {
        onRefetchEventsRef.current = onRefetchEvents;
    }, [onRefetchEvents]);

    useEffect(() => {
        searchLocationRef.current = searchLocation;
    }, [searchLocation]);

    useEffect(() => {
        userLocationRef.current = userLocation;
    }, [userLocation]);

    const refetchEvents = useCallback(async (location?: IUserLocation | null) => {
        if (isRefetchingRef.current) {
            return;
        }

        isRefetchingRef.current = true;
        setIsRefetching(true);
        try {
            await Promise.all([
                onRefetchMapPinsRef.current(location),
                onRefetchEventsRef.current(location),
            ]);
        } finally {
            isRefetchingRef.current = false;
            setIsRefetching(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const refreshOnFocus = async () => {
                locationModel.setIsLoading(true);
                try {
                    if (!isActive) {
                        return;
                    }

                    const currentSearchLocation = searchLocationRef.current;

                    if (currentSearchLocation) {
                        await refetchEvents(currentSearchLocation);
                        hasFocusedLoadedRef.current = true;
                        return;
                    }

                    const locationPayload = await getCurrentLocationPayload();
                    if (!isActive) {
                        return;
                    }

                    const nextLocation = locationPayload
                        ? {
                            latitude: locationPayload.latitude,
                            longitude: locationPayload.longitude,
                        }
                        : userLocationRef.current || null;

                    locationModel.setHasPermission(!!locationPayload);
                    if (locationPayload) {
                        locationModel.setUserLocation(nextLocation);
                    }

                    await refetchEvents(nextLocation);
                    hasFocusedLoadedRef.current = true;
                } finally {
                    if (isActive) {
                        locationModel.setIsLoading(false);
                    }
                }
            };

            refreshOnFocus();

            return () => {
                isActive = false;
            };
        }, [refetchEvents]),
    );

    const onUpdateEvent = useCallback(async () => {
        await refetchEvents(searchLocation);
    }, [refetchEvents, searchLocation]);

    const onMapPress = useCallback(async (event: MapPressEvent) => {
        if (isRefetchingRef.current) {
            return;
        }

        const { action, coordinate } = event.nativeEvent;
        if (action && action !== 'press') {
            return;
        }

        const nextLocation: IUserLocation = {
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
        };

        setSearchLocation(nextLocation);
        await refetchEvents(nextLocation);
    }, [refetchEvents]);

    useEffect(() => {
        if (!hasFocusedLoadedRef.current) {
            lastSelectedEventTypeRef.current = selectedEventType;
            return;
        }

        if (lastSelectedEventTypeRef.current === selectedEventType) {
            return;
        }

        lastSelectedEventTypeRef.current = selectedEventType;
        onRefetchEvents(searchLocation);
    }, [onRefetchEvents, searchLocation, selectedEventType]);

    return {
        isRefetching,
        selectedTab,
        filterCount,
        onTabChange,
        onFilterPress,
        onUpdateEvent,
        onMapPress,
        searchLocation,
        isLocationLoading,
        mapPins,
        initialRegion,
        onMarkerPress,
        onCardPress,
        userLocation,
        filteredEvents: events,
        onReadMorePress,
        onEditPress,
        onFavoritePress,
        onAddEvent,
        selectedEvent,
        isModalVisible,
        onCloseModal,
        onModalReadMorePress,
        onModalFavoritePress,
    };
};
