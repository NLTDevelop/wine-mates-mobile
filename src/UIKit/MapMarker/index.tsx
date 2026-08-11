import { ReactNode } from 'react';
import { Marker, MapMarkerProps, LatLng } from 'react-native-maps';
import { EventType } from '@/entities/events/enums/EventType';
import { useMapMarker } from './presenters/useMapMarker';
import { MapMarkerContent } from './components/MapMarkerContent';

interface IProps {
    onPress?: (id: number) => void;
    customIcon?: ReactNode;
    markerProps?: Partial<MapMarkerProps>;
    coordinate?: LatLng;
    cluster?: boolean;
    eventId: number;
    eventType?: EventType;
}

export const MapMarker = ({
    onPress,
    customIcon,
    markerProps,
    coordinate,
    eventId,
    eventType = EventType.Tastings,
}: IProps) => {
    const markerCoordinate = coordinate || markerProps?.coordinate;
    const { onPressHandler, isPartyEvent, markerIdentifier, shouldRenderMarkerContent } = useMapMarker({
        eventId,
        eventType,
        onPress,
        hasCustomIcon: !!customIcon,
        coordinate: markerCoordinate,
        markerProps,
    });

    if (!markerCoordinate) {
        return null;
    }

    return (
        <Marker
            {...markerProps}
            coordinate={markerCoordinate}
            onPress={onPressHandler}
            tracksViewChanges={markerProps?.tracksViewChanges}
            identifier={markerIdentifier}
        >
            {shouldRenderMarkerContent && (customIcon || <MapMarkerContent isPartyEvent={isPartyEvent} />)}
        </Marker>
    );
};
