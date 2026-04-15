import { useCallback, useState, useMemo } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IEvent } from '@/entities/events/types/IEvent';
import { TastingType } from '@/entities/events/enums/TastingType';

interface IUseEventMapViewProps {
    events: IEvent[];
    loadEvents: (isRefresh: boolean) => Promise<void>;
}

type NavigationProp = NativeStackNavigationProp<EventStackParamList>;

export const useEventMapView = ({ events, loadEvents }: IUseEventMapViewProps) => {
    const navigation = useNavigation<NavigationProp>();
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const mapPins = useMemo(() => {
        return events.map(event => ({
            id: event.id,
            latitude: event.latitude,
            longitude: event.longitude,
            tastingType: event.tastingType || TastingType.Parties,
        }));
    }, [events]);

    const selectedEvent = useMemo(() => {
        return events.find(event => event.id === selectedEventId);
    }, [events, selectedEventId]);

    const onAddEvent = useCallback(() => {
        navigation.navigate('AddEventView');
    }, [navigation]);

    const onMarkerPress = useCallback((eventId: number) => {
        setSelectedEventId(eventId);
        setIsModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedEventId(null);
    }, []);

    const onBookingPress = useCallback(() => {
        if (selectedEventId) {
            setIsModalVisible(false);
            navigation.navigate('EventDetails', { eventId: selectedEventId });
        }
    }, [selectedEventId, navigation]);

    const onModalFavoritePress = useCallback(() => {
        if (selectedEventId) {
            console.log('Favorite pressed:', selectedEventId);
            // TODO: Implement favorite functionality
        }
    }, [selectedEventId]);

    const onReadMorePress = useCallback((eventId: number) => {
        navigation.navigate('EventDetails', { eventId });
    }, [navigation]);

    const onFavoritePress = useCallback((eventId: number) => {
        console.log('Favorite pressed:', eventId);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadEvents(true);
        }, [loadEvents])
    );

    return {
        mapPins,
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCloseModal,
        onBookingPress,
        onModalFavoritePress,
        onReadMorePress,
        onFavoritePress,
    };
};
