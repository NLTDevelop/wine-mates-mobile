import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import RNMapView, { MapViewProps, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';

interface IMapViewProps extends Partial<MapViewProps> {
    initialRegion?: Region;
    children?: React.ReactNode;
}

export const MapView = ({ initialRegion, children, ...props }: IMapViewProps) => {
    const { colors } = useUiContext();

    const defaultRegion: Region = useMemo(() => ({
        latitude: 50.4501,
        longitude: 30.5234,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }), []);

    const mapStyle = useMemo(() => [
        {
            elementType: 'geometry',
            stylers: [{ color: colors.background }],
        },
        {
            elementType: 'labels.text.fill',
            stylers: [{ color: colors.text }],
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [{ color: colors.background }],
        },
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: colors.border }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: colors.primary }],
        },
    ], [colors]);

    return (
        <View style={styles.container}>
            <RNMapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion || defaultRegion}
                customMapStyle={mapStyle}
                {...props}
            >
                {children}
            </RNMapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
