import { useCallback, useMemo } from 'react';
import { EventType } from '@/entities/events/enums/EventType';
import { IEventMapPin } from '@/entities/events/types/IEventMapPin';
import { IEventMapMarkerItem } from '../types/IEventMapMarkerItem';

interface IProps {
    mapPins: IEventMapPin[];
    selectedTab: 'all' | 'tastings' | 'parties';
    onMarkerPress: (markerId: number) => void;
}

export const useEventMapMarkers = ({ mapPins, selectedTab, onMarkerPress }: IProps) => {
    const createOnMarkerPress = useCallback(
        (markerId: number) => {
            return () => {
                onMarkerPress(markerId);
            };
        },
        [onMarkerPress],
    );

    const markerItems = useMemo<IEventMapMarkerItem[]>(() => {
        return mapPins.reduce<IEventMapMarkerItem[]>((result, pin) => {
            const isVisible =
                selectedTab === 'all' ||
                (selectedTab === 'tastings' && pin.eventType === EventType.Tastings) ||
                (selectedTab === 'parties' && pin.eventType === EventType.Parties);

            if (!isVisible) {
                return result;
            }

            result.push({
                id: pin.id,
                coordinate: {
                    latitude: pin.latitude,
                    longitude: pin.longitude,
                },
                isPartyEvent: pin.eventType === EventType.Parties,
                onPress: createOnMarkerPress(pin.id),
            });

            return result;
        }, []);
    }, [createOnMarkerPress, mapPins, selectedTab]);

    return { markerItems };
};
