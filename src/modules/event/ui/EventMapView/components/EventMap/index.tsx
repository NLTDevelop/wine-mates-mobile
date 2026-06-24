import { ComponentType, memo, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import RNMapView, { Region, MapPressEvent, Marker, MapMarkerProps } from 'react-native-maps';
import { MapView } from '@/UIKit/MapView';
import { MapMarker } from '@/UIKit/MapMarker';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IEventMapPin } from '@/entities/events/types/IEventMapPin';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { SearchLocationMarkerIcon } from '@assets/icons/SearchLocationMarkerIcon';

interface IEventMapProps {
    mapPins: IEventMapPin[];
    selectedTab: 'all' | 'tastings' | 'parties';
    initialRegion: Region;
    onMarkerPress: (markerId: number) => void;
    onMapPress: (event: MapPressEvent) => void;
    userLocation?: IUserLocation | null;
    searchLocation?: IUserLocation | null;
}

type ClusterMarkerProps = MapMarkerProps & {
    cluster?: boolean;
};

const ClusterMarker = Marker as ComponentType<ClusterMarkerProps>;

export const EventMap = memo(
    ({
        mapPins,
        selectedTab,
        initialRegion,
        onMarkerPress,
        onMapPress,
        userLocation,
        searchLocation,
    }: IEventMapProps) => {
        const mapRef = useRef<RNMapView | null>(null);
        const isFirstRegionSyncRef = useRef(true);
        const { colors } = useUiContext();
        const styles = useMemo(() => getStyles(colors), [colors]);
        const isTastingsTab = selectedTab === 'tastings';
        const isPartiesTab = selectedTab === 'parties';

        const visibleMapPins = useMemo(() => {
            return mapPins.filter((pin) => {
                return selectedTab === 'all'
                    || (isTastingsTab && pin.eventType === 'tastings')
                    || (isPartiesTab && pin.eventType === 'parties');
            });
        }, [isPartiesTab, isTastingsTab, mapPins, selectedTab]);
        useEffect(() => {
            if (isFirstRegionSyncRef.current) {
                isFirstRegionSyncRef.current = false;
                return;
            }

            mapRef.current?.animateToRegion(initialRegion, 250);
        }, [initialRegion]);

        return (
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    initialRegion={initialRegion}
                    showsUserLocation={!!userLocation}
                    showsMyLocationButton={!!userLocation}
                    userInterfaceStyle="light"
                    onPress={onMapPress}
                    clusteringEnabled
                    clusterColor={colors.primary}
                    clusterTextColor={colors.background}
                    clusterRadius={28}
                >
                    {searchLocation && (
                        <ClusterMarker
                            key="search-location-marker"
                            identifier="search-location-marker"
                            coordinate={{
                                latitude: searchLocation.latitude,
                                longitude: searchLocation.longitude,
                            }}
                            cluster={false}
                            tappable={false}
                            tracksViewChanges={false}
                            zIndex={1}
                            anchor={{ x: 0.5, y: 0.5 }}
                            centerOffset={{ x: 0, y: 0 }}
                        >
                            <SearchLocationMarkerIcon color={colors.primary} borderColor={colors.background} />
                        </ClusterMarker>
                    )}
                    {visibleMapPins.map(pin => (
                        <MapMarker
                            key={pin.id}
                            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                            eventId={pin.id}
                            eventType={pin.eventType}
                            markerProps={{ zIndex: 2 }}
                            onPress={onMarkerPress}
                        />
                    ))}
                </MapView>
            </View>
        );
    },
);

EventMap.displayName = 'EventMap';
