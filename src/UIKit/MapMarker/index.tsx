import { ReactNode } from 'react';
import { Marker, MapMarkerProps } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';
import { EventType } from '@/entities/events/enums/EventType';
import { useMapMarker } from './presenters/useMapMarker';

interface IMapMarkerProps {
    onPress?: (id: number) => void;
    customIcon?: ReactNode;
    markerProps: MapMarkerProps;
    eventId: number;
    eventType?: EventType;
}

export const MapMarker = ({
                              onPress,
                              customIcon,
                              markerProps,
                              eventId,
                              eventType = EventType.Tastings
                          }: IMapMarkerProps) => {
    const { colors } = useUiContext();

    const { onPressHandler, emoji } = useMapMarker({ eventId, eventType, onPress });

    return (
        <Marker
            {...markerProps}
            onPress={onPressHandler}
        >
            {customIcon ? (
                customIcon
            ) : (
                <MapMarkerIcon
                    bodyColor={colors.background}
                    emoji={emoji}
                />
            )}
        </Marker>
    );
};
