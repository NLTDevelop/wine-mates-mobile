import { ReactNode } from 'react';
import { Marker, MapMarkerProps } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';
import { TastingType } from '@/entities/events/enums/TastingType';
import { useMapMarker } from './presenters/useMapMarker';

interface IMapMarkerProps {
    onPress?: (id: number) => void;
    customIcon?: ReactNode;
    markerProps: MapMarkerProps;
    eventId: number;
    tastingType?: TastingType;
}

export const MapMarker = ({
                              onPress,
                              customIcon,
                              markerProps,
                              eventId,
                              tastingType = TastingType.Tastings
                          }: IMapMarkerProps) => {
    const { colors } = useUiContext();

    const { onPressHandler, emoji } = useMapMarker({ eventId, tastingType, onPress });

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
