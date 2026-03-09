import { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { Marker, MapMarkerProps } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';

interface IMapMarkerProps {
    onPress?: () => void;
    customIcon?: ReactNode;
    selected?: boolean;
    markerProps: MapMarkerProps;
    eventId: number;
}

export const MapMarker = ({
    onPress,
    customIcon,
    selected = false,
    markerProps,
    eventId
}: IMapMarkerProps) => {
    const { colors } = useUiContext();

    return (
        <Marker
            onPress={onPress}
            key={`${selected}-${eventId}`}
            {...markerProps}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
            >
                {customIcon ? (
                    customIcon
                ) : (
                    <MapMarkerIcon
                        bodyColor={selected ? colors.primary : colors.background}
                    />
                )}
            </TouchableOpacity>
        </Marker>
    );
};
