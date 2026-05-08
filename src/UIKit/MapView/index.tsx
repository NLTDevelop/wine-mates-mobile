import { useMemo, forwardRef, useCallback } from 'react';
import { View } from 'react-native';
import RNMapView, { MapViewProps, Region, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ClusteredMapView from 'react-native-map-clustering';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';
import { Typography } from '../Typography';
import { isAndroid } from '@/utils';

interface IMapViewProps extends Partial<MapViewProps> {
    initialRegion?: Region;
    children?: React.ReactNode;
    clusteringEnabled?: boolean;
    clusterColor?: string;
    clusterTextColor?: string;
    clusterRadius?: number;
}

interface IMapCluster {
    id: string | number;
    geometry: {
        coordinates: number[];
    };
    properties: {
        point_count: number;
    };
    onPress: () => void;
}

const MapViewComponent = forwardRef<RNMapView, IMapViewProps>(
    (
        { initialRegion, children, clusteringEnabled = false, clusterColor, clusterTextColor, clusterRadius, ...props },
        ref,
    ) => {
        const { colors } = useUiContext();
        const styles = useMemo(() => getStyles(colors), [colors]);

        const defaultRegion: Region = useMemo(
            () => ({
                latitude: 50.4501,
                longitude: 30.5234,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }),
            [],
        );

        const onRenderCluster = useCallback(
            (cluster: IMapCluster) => {
                return (
                    <Marker
                        key={`cluster-${cluster.id}`}
                        identifier={`cluster-${cluster.id}`}
                        coordinate={{
                            latitude: cluster.geometry.coordinates[1],
                            longitude: cluster.geometry.coordinates[0],
                        }}
                        onPress={cluster.onPress}
                        tracksViewChanges={isAndroid}
                        zIndex={4}
                    >
                        <View style={[styles.clusterContainer, { backgroundColor: clusterColor || colors.primary }]}>
                            <Typography
                                variant="h6"
                                style={[{ color: clusterTextColor || colors.background }]}
                                text={cluster.properties.point_count}
                            />
                        </View>
                    </Marker>
                );
            },
            [clusterColor, clusterTextColor, colors, styles],
        );

        return (
            <View style={styles.container}>
                <ClusteredMapView
                    ref={ref}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion || defaultRegion}
                    clusteringEnabled={clusteringEnabled}
                    radius={clusterRadius}
                    renderCluster={onRenderCluster}
                    animationEnabled={false}
                    zoomControlEnabled={false}
                    toolbarEnabled={false}
                    {...props}
                >
                    {children}
                </ClusteredMapView>
            </View>
        );
    },
);

MapViewComponent.displayName = 'MapViewComponent';

export const MapView = observer(MapViewComponent);
