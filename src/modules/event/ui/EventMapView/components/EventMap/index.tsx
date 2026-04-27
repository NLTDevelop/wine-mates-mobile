import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { Region, MapPressEvent, Marker } from 'react-native-maps';
import { MapView } from '@/UIKit/MapView';
import { MapMarker } from '@/UIKit/MapMarker';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IEventMapPin } from '@/entities/events/types/IEventMapPin';
import { IUserLocation } from '@/entities/location/types/IUserLocation';

interface IEventMapProps {
    mapPins: IEventMapPin[];
    selectedTab: 'all' | 'tastings' | 'parties';
    initialRegion: Region;
    onMarkerPress: (markerId: number) => void;
    onMapPress: (event: MapPressEvent) => void;
    onRegionChangeComplete: (region: Region) => void;
    userLocation?: IUserLocation | null;
    searchLocation?: IUserLocation | null;
}

const HIDDEN_PIN_COORDINATE = {
    latitude: -85,
    longitude: 0,
};

export const EventMap = memo(
    ({
        mapPins,
        selectedTab,
        initialRegion,
        onMarkerPress,
        onMapPress,
        onRegionChangeComplete,
        userLocation,
        searchLocation,
    }: IEventMapProps) => {
        const { colors } = useUiContext();
        const styles = useMemo(() => getStyles(colors), [colors]);
        const isTastingsTab = selectedTab === 'tastings';
        const isPartiesTab = selectedTab === 'parties';

        const isPinVisible = (pin: IEventMapPin) => {
            return selectedTab === 'all'
                || (isTastingsTab && pin.eventType === 'tastings')
                || (isPartiesTab && pin.eventType === 'parties');
        };

        return (
            <View style={styles.mapContainer}>
                <MapView
                    initialRegion={initialRegion}
                    showsUserLocation={!!userLocation}
                    showsMyLocationButton={!!userLocation}
                    userInterfaceStyle="light"
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
                            cluster={false}
                            pinColor="#1A73E8"
                        />
                    )}
                    {mapPins.map(pin => (
                        <MapMarker
                            key={pin.id}
                            coordinate={isPinVisible(pin) ? { latitude: pin.latitude, longitude: pin.longitude } : HIDDEN_PIN_COORDINATE}
                            eventId={pin.id}
                            eventType={pin.eventType}
                            markerProps={{ opacity: isPinVisible(pin) ? 1 : 0 }}
                            onPress={isPinVisible(pin) ? onMarkerPress : undefined}
                        />
                    ))}
                </MapView>
            </View>
        );
    },
);

EventMap.displayName = 'EventMap';
