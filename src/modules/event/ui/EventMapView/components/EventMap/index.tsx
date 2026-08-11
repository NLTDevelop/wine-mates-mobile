import { ComponentType, memo, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import RNMapView, { Region, MapPressEvent, Marker, MapMarkerProps } from 'react-native-maps';
import { MapView } from '@/UIKit/MapView';
import { MapMarkerContent } from '@/UIKit/MapMarker/components/MapMarkerContent';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IEventMapPin } from '@/entities/events/types/IEventMapPin';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { SearchLocationMarkerIcon } from '@assets/icons/SearchLocationMarkerIcon';
import { isIOS } from '@/utils';
import { useEventMapMarkers } from '../../presenters/useEventMapMarkers';

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
        const { markerItems } = useEventMapMarkers({ mapPins, selectedTab, onMarkerPress });
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
                    {searchLocation && isIOS && (
                        <ClusterMarker
                            key="search-location-marker-ios"
                            identifier="asset-marker:SearchLocationMarker:search-location"
                            coordinate={{
                                latitude: searchLocation.latitude,
                                longitude: searchLocation.longitude,
                            }}
                            cluster={false}
                            tappable={false}
                            zIndex={3}
                            anchor={{ x: 0.5, y: 0.5 }}
                        />
                    )}
                    {searchLocation && !isIOS && (
                        <ClusterMarker
                            key="search-location-marker"
                            identifier="search-location-marker"
                            coordinate={{
                                latitude: searchLocation.latitude,
                                longitude: searchLocation.longitude,
                            }}
                            cluster={false}
                            tappable={false}
                            tracksViewChanges
                            zIndex={3}
                            anchor={{ x: 0.5, y: 0.5 }}
                            centerOffset={{ x: 0, y: 0 }}
                        >
                            <SearchLocationMarkerIcon color={colors.primary} borderColor={colors.background} />
                        </ClusterMarker>
                    )}
                    {isIOS && markerItems.map(item => (
                        <Marker
                            key={`event-marker-ios-${item.id}`}
                            identifier={`asset-marker:${item.isPartyEvent ? 'EventPartyMarker' : 'EventTastingMarker'}:${item.id}`}
                            coordinate={item.coordinate}
                            onPress={item.onPress}
                            zIndex={2}
                        />
                    ))}
                    {!isIOS && markerItems.map(item => (
                        <ClusterMarker
                            key={item.id}
                            identifier={`event-marker-${item.id}`}
                            coordinate={item.coordinate}
                            onPress={item.onPress}
                            tracksViewChanges
                            zIndex={2}
                        >
                            <MapMarkerContent isPartyEvent={item.isPartyEvent} />
                        </ClusterMarker>
                    ))}
                </MapView>
            </View>
        );
    },
);

EventMap.displayName = 'EventMap';
