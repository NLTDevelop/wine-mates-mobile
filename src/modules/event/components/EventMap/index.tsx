import { useMemo } from 'react';
import { View } from 'react-native';
import { Region } from 'react-native-maps';
import { MapView } from '@/UIKit/MapView';
import { MapMarker } from '@/UIKit/MapMarker';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

interface IEvent {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
}

interface IEventMapProps {
    events: IEvent[];
    initialRegion: Region;
    selectedMarkerId: number | null;
    onMarkerPress: (markerId: number) => void;
}

export const EventMap = ({
    events,
    initialRegion,
    selectedMarkerId,
    onMarkerPress,
}: IEventMapProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.mapContainer}>
            <MapView initialRegion={initialRegion}>
                {events.map((event) => (
                    <MapMarker
                        key={event.id}
                        markerProps={{
                            coordinate: { latitude: event.latitude, longitude: event.longitude }
                        }}
                        selected={selectedMarkerId === event.id}
                        onPress={() => onMarkerPress(event.id)}
                        customIcon={
                            <Typography
                                text="🍷"
                                variant="h4"
                            />
                        }
                    />
                ))}
            </MapView>
        </View>
    );
};
