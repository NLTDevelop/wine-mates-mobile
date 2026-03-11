import { useCallback, useState } from 'react';

interface IUseLocationPickerProps {
    initialLocation?: { latitude: number; longitude: number } | null;
    onSelectLocation: (latitude: number, longitude: number) => void;
    onClose: () => void;
}

export const useLocationPicker = ({ initialLocation, onSelectLocation, onClose }: IUseLocationPickerProps) => {
    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(
        initialLocation || null
    );

    const handleMapPress = useCallback((event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedLocation) {
            onSelectLocation(selectedLocation.latitude, selectedLocation.longitude);
            onClose();
        }
    }, [selectedLocation, onSelectLocation, onClose]);

    return {
        selectedLocation,
        handleMapPress,
        handleConfirm,
    };
};
