import { useCallback, useState } from 'react';

interface IUseLocationPickerProps {
    initialLocation?: { latitude: number; longitude: number } | null;
    onSelectLocation: (latitude: number, longitude: number, label: string) => void;
    onClose: () => void;
}

export const useLocationPicker = ({ initialLocation, onSelectLocation, onClose }: IUseLocationPickerProps) => {
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(
        initialLocation || null
    );

    const onMapPress = useCallback((event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    }, []);

    const onConfirm = useCallback(() => {
        if (selectedLocation) {
            const label = `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`;
            onSelectLocation(selectedLocation.latitude, selectedLocation.longitude, label);
            onClose();
        }
    }, [selectedLocation, onSelectLocation, onClose]);

    return {
        selectedLocation,
        onMapPress,
        onConfirm,
    };
};
