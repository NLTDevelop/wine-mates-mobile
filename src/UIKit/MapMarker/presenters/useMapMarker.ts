import { useCallback } from 'react';
import { EventType } from '@/entities/events/enums/EventType';
import { LatLng, MapMarkerProps } from 'react-native-maps';

interface IUseMapMarkerProps {
    eventId: number;
    eventType: EventType;
    onPress?: (id: number) => void;
    coordinate?: LatLng;
    markerProps?: Partial<MapMarkerProps>;
}

export const useMapMarker = ({ eventId, eventType, onPress }: IUseMapMarkerProps) => {

    const onPressHandler = useCallback(() => {
        onPress?.(eventId);
    }, [eventId, onPress]);

    const isPartyEvent = eventType === EventType.Parties;

    return {
        onPressHandler,
        isPartyEvent,
    };
};
