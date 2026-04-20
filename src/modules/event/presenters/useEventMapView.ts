import { useCallback, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';

interface IUseEventMapViewProps {
    events: IEvent[];
}

type NavigationProp = NativeStackNavigationProp<EventStackParamList>;

export const useEventMapView = ({ events }: IUseEventMapViewProps) => {
    const navigation = useNavigation<NavigationProp>();
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const mapPins = useMemo(() => {
        return events.map(event => ({
            id: event.id,
            latitude: event.latitude,
            longitude: event.longitude,
            eventType: event.eventType || EventType.Parties,
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

    const onModalReadMorePress = useCallback((eventId: number) => {
        setIsModalVisible(false);
        navigation.navigate('EventDetailsView', { eventId });
    }, [navigation]);

    const onModalFavoritePress = useCallback((eventId: number) => {
        console.log('Favorite pressed:', eventId);
        // TODO: Implement favorite functionality
    }, []);

    const onReadMorePress = useCallback((eventId: number) => {
        navigation.navigate('EventDetailsView', { eventId });
    }, [navigation]);

    const onFavoritePress = useCallback((eventId: number) => {
        console.log('Favorite pressed:', eventId);
    }, []);

    return {
        mapPins,
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCloseModal,
        onModalReadMorePress,
        onModalFavoritePress,
        onReadMorePress,
        onFavoritePress,
    };
};
