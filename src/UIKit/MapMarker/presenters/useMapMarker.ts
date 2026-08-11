import { useCallback } from 'react';
import { EventType } from '@/entities/events/enums/EventType';
import { LatLng, MapMarkerProps } from 'react-native-maps';
import { isIOS } from '@/utils';

interface IUseMapMarkerProps {
    eventId: number;
    eventType: EventType;
    onPress?: (id: number) => void;
    coordinate?: LatLng;
    markerProps?: Partial<MapMarkerProps>;
    hasCustomIcon: boolean;
}

export const useMapMarker = ({ eventId, eventType, onPress, hasCustomIcon }: IUseMapMarkerProps) => {

    const onPressHandler = useCallback(() => {
        onPress?.(eventId);
    }, [eventId, onPress]);

    const isPartyEvent = eventType === EventType.Parties;
    const usesNativeAsset = isIOS && !hasCustomIcon;
    const markerIdentifier = usesNativeAsset
        ? `asset-marker:${isPartyEvent ? 'EventPartyMarker' : 'EventTastingMarker'}:${eventId}`
        : `event-marker-${eventId}`;

    return {
        onPressHandler,
        isPartyEvent,
        markerIdentifier,
        shouldRenderMarkerContent: !usesNativeAsset,
    };
};
