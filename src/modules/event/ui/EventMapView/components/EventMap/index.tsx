import { useMemo } from 'react';
import { View } from 'react-native';
import { Region, MapPressEvent, Marker } from 'react-native-maps';
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
    onMarkerPress: (markerId: number) => void;
    onMapPress: (event: MapPressEvent) => void;
    onRegionChangeComplete: (region: Region) => void;
    userLocation?: IUserLocation | null;
    searchLocation?: IUserLocation | null;
}

export const EventMap = observer(
    ({
        mapPins,
        initialRegion,
        onMarkerPress,
        onMapPress,
        onRegionChangeComplete,
        userLocation,
        searchLocation,
    }: IEventMapProps) => {
        const { colors } = useUiContext();
        const styles = useMemo(() => getStyles(colors), [colors]);

        return (
            <View style={styles.mapContainer}>
                <MapView
                    initialRegion={initialRegion}
                    showsUserLocation={!!userLocation}
                    showsMyLocationButton={!!userLocation}
                    onPress={onMapPress}
                    onRegionChangeComplete={onRegionChangeComplete}
                    clusteringEnabled
                    clusterColor={colors.primary}
                    clusterTextColor={colors.background}
                >
                    {searchLocation && (
                        <Marker
                            key="search-location-marker"
                            coordinate={{
                                latitude: searchLocation.latitude,
                                longitude: searchLocation.longitude,
                            }}
                            pinColor="#1A73E8"
                        />
                    )}
                    {mapPins.map(pin => (
                        <MapMarker
                            key={pin.id}
                            coordinate={{
                                latitude: pin.latitude,
                                longitude: pin.longitude,
                            }}
                            eventId={pin.id}
                            eventType={pin.eventType}
                            onPress={onMarkerPress}
                        />
                    ))}
                </MapView>
            </View>
        );
    },
);

EventMap.displayName = 'EventMap';
