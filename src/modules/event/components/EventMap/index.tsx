import { useMemo } from 'react';
import { View } from 'react-native';
import { Region } from 'react-native-maps';
import { MapView } from '@/UIKit/MapView';
import { MapMarker } from '@/UIKit/MapMarker';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IEventMapPin } from '@/entities/events/types/IEventMapPin';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { observer } from 'mobx-react-lite';

interface IEventMapProps {
    mapPins: IEventMapPin[];
    initialRegion: Region;
    mapRegionKey: string;
    onMarkerPress: (markerId: number) => void;
    userLocation?: IUserLocation | null;
}

export const EventMap = observer(({
                                      mapPins,
                                      initialRegion,
                                      mapRegionKey,
                                      onMarkerPress,
                                      userLocation,
                                  }: IEventMapProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.mapContainer}>
            <MapView
                key={mapRegionKey}
                initialRegion={initialRegion}
                showsUserLocation={!!userLocation}
                showsMyLocationButton={!!userLocation}
            >
                {mapPins.map((pin) => (
                    <MapMarker
                        key={pin.id}
                        markerProps={{
                            coordinate: { latitude: pin.latitude, longitude: pin.longitude }
                        }}
                        eventId={pin.id}
                        eventType={pin.eventType}
                        onPress={onMarkerPress}
                    />
                ))}
            </MapView>
        </View>
    );
});

EventMap.displayName = 'EventMap';
