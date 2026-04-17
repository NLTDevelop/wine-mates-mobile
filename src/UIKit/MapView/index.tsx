import { useMemo, forwardRef } from 'react';
import { View } from 'react-native';
import RNMapView, { MapViewProps, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';

interface IMapViewProps extends Partial<MapViewProps> {
    initialRegion?: Region;
    children?: React.ReactNode;
}

export const MapView = observer(forwardRef<RNMapView, IMapViewProps>(({ initialRegion, children, ...props }, ref) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const defaultRegion: Region = useMemo(() => ({
        latitude: 50.4501,
        longitude: 30.5234,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }), []);

    //TODO: will need at future
    // const mapStyle = useMemo(() => [
    //     {
    //         elementType: 'geometry',
    //         stylers: [{ color: colors.background }],
    //     },
    //     {
    //         elementType: 'labels.text.fill',
    //         stylers: [{ color: colors.text }],
    //     },
    //     {
    //         elementType: 'labels.text.stroke',
    //         stylers: [{ color: colors.background }],
    //     },
    //     {
    //         featureType: 'poi',
    //         elementType: 'labels',
    //         stylers: [{ visibility: 'off' }],
    //     },
    //     {
    //         featureType: 'road',
    //         elementType: 'geometry',
    //         stylers: [{ color: colors.border }],
    //     },
    //     {
    //         featureType: 'water',
    //         elementType: 'geometry',
    //         stylers: [{ color: colors.primary }],
    //     },
    // ], [colors]);

    return (
        <View style={styles.container}>
            <RNMapView
                ref={ref}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion || defaultRegion}
                zoomControlEnabled={false}
                toolbarEnabled={false}
                {...props}
            >
                {children}
            </RNMapView>
        </View>
    );
}));

MapView.displayName = 'MapView';

