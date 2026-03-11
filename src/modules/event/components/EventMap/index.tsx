import { useMemo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { Region } from 'react-native-maps';
import { MapView } from '@/UIKit/MapView';
import { MapMarker } from '@/UIKit/MapMarker';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IEvent } from '@/entities/events/types/IEvent';
import { IUserLocation } from '@/entities/location/types/IUserLocation';
import { observer } from 'mobx-react-lite';

interface IEventMapProps {
    events: IEvent[];
    initialRegion: Region;
    selectedMarkerId: number | null;
    onMarkerPress: (markerId: number) => void;
    userLocation?: IUserLocation | null;
}

export const EventMap = observer(({
                                      events,
                                      initialRegion,
                                      selectedMarkerId,
                                      onMarkerPress,
                                      userLocation,
                                  }: IEventMapProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.mapContainer}>
            <MapView
                initialRegion={initialRegion}
                showsUserLocation={!!userLocation}
                showsMyLocationButton={!!userLocation}
            >
                {events.map((event) => (
                    <MapMarker
                        key={event.id}
                        markerProps={{
                            coordinate: { latitude: event.latitude, longitude: event.longitude }
                        }}
                        eventId={event.id}
                        onPress={onMarkerPress}
                    />
                ))}
            </MapView>
        </View>
    );
});

EventMap.displayName = 'EventMap';
