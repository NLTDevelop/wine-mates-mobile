import { ReactNode, useCallback } from 'react';
import { Marker, MapMarkerProps } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';

interface IMapMarkerProps {
    onPress?: (id: number) => void;
    customIcon?: ReactNode;
    markerProps: MapMarkerProps;
    eventId: number;
}

export const MapMarker = ({
                              onPress,
                              customIcon,
                              markerProps,
                              eventId
                          }: IMapMarkerProps) => {
    const { colors } = useUiContext();

    const onPressHandler = useCallback(() => {
        onPress?.(eventId);
    }, [eventId, onPress]);

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
