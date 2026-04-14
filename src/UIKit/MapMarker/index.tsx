import { ReactNode, useCallback } from 'react';
import { Marker, MapMarkerProps } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';
import { TastingType } from '@/entities/events/enums/TastingType';

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
                              tastingType
                          }: IMapMarkerProps) => {
    const { colors } = useUiContext();

    const onPressHandler = useCallback(() => {
        onPress?.(eventId);
    }, [eventId, onPress]);

    // TODO: Use different icons based on tastingType (parties vs tastings)
    // const markerIcon = tastingType === TastingType.Tastings ? <TastingsIcon /> : <PartiesIcon />;

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
                />
            )}
        </Marker>
    );
};
