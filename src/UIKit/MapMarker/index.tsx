import { ReactNode, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Marker, MapMarkerProps } from 'react-native-maps';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';

interface IMapMarkerProps {
    onPress?: () => void;
    customIcon?: ReactNode;
    selected?: boolean;
    markerProps: MapMarkerProps;
}

export const MapMarker = ({
    onPress,
    customIcon,
    selected = false,
    markerProps
}: IMapMarkerProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <Marker
            onPress={onPress}
            {...markerProps}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                style={[styles.markerContainer, selected && styles.markerSelected]}
            >
                {customIcon ? (
                    <View style={styles.iconWrapper}>{customIcon}</View>
                ) : (
                    <View style={styles.defaultMarker}>
                        <Typography text="📍" />
                    </View>
                )}
            </TouchableOpacity>
        </Marker>
    );
};
