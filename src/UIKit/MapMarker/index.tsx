import { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { Marker, MapMarkerProps, LatLng } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { EventType } from '@/entities/events/enums/EventType';
import { useMapMarker } from './presenters/useMapMarker';
import { getStyles } from './styles';

interface IProps {
    onPress?: (id: number) => void;
    customIcon?: ReactNode;
    markerProps?: MapMarkerProps;
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
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { onPressHandler, isPartyEvent } = useMapMarker({ eventId, eventType, onPress });
    const markerCoordinate = coordinate || markerProps?.coordinate;

    if (!markerCoordinate) {
        return null;
    }

    return (
        <Marker {...markerProps} coordinate={markerCoordinate} onPress={onPressHandler}>
            {customIcon ? (
                customIcon
            ) : (
                <View style={styles.markerWrapper}>
                    <MapMarkerIcon bodyColor={colors.background} emoji="" />
                    <View style={styles.centerIcon}>
                        {isPartyEvent ? <PartyIcon width={23} height={23} /> : <TastingIcon width={23} height={23} />}
                    </View>
                </View>
            )}
        </Marker>
    );
};
