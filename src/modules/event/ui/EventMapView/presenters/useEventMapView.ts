import { useCallback, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventType } from '@/entities/events/enums/EventType';
import { eventsService } from '@/entities/events/EventsService';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { TastingType } from '@/entities/events/enums/TastingType';
import { IMedia } from '@/entities/media/types/IMedia';

interface IUseEventMapViewProps {
    events: IEvent[];
    onFavoritePress: (eventId: number) => void;
}

type NavigationProp = NativeStackNavigationProp<Record<string, object | undefined>>;

const mapWineImageToMedia = (image?: { smallUrl?: string; mediumUrl?: string; originalUrl?: string } | null): IMedia | null => {
    if (!image) {
        return null;
    }

    return {
        name: '',
        originalName: '',
        mimetype: '',
        size: 0,
        smallUrl: image.smallUrl || '',
        mediumUrl: image.mediumUrl || '',
        originalUrl: image.originalUrl || '',
    };
};

export const useEventMapView = ({ events, onFavoritePress }: IUseEventMapViewProps) => {
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

    const onCardPress = useCallback((eventId: number) => {
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
        onFavoritePress(eventId);
    }, [onFavoritePress]);

    const onReadMorePress = useCallback((eventId: number) => {
        navigation.navigate('EventDetailsView', { eventId });
    }, [navigation]);

    const onEditPress = useCallback(async (eventId: number) => {
        setIsModalVisible(false);
        setSelectedEventId(null);

        const response = await eventsService.getById(eventId);
        if (response.isError || !response.data) {
            return;
        }

        const eventDetail = response.data;
        const draft: IAddEventDraft = {
            theme: eventDetail.theme || '',
            description: eventDetail.description || '',
            restaurantName: eventDetail.restaurantName || eventDetail.restaurant || '',
            locationLabel: eventDetail.locationLabel || eventDetail.location || '',
            locationCountry: '',
            location: {
                latitude: eventDetail.latitude,
                longitude: eventDetail.longitude,
            },
            eventStartDate: eventDetail.eventStartDate || eventDetail.eventDate || '',
            eventEndDate: eventDetail.eventEndDate || eventDetail.eventDate || '',
            eventStartTime: eventDetail.eventStartTime || eventDetail.eventTime || eventDetail.startTime || '',
            eventEndTime: eventDetail.eventEndTime || eventDetail.endTime || '',
            paymentMethodIds: [],
            contactIds: [],
            price: String(eventDetail.price || ''),
            currency: eventDetail.currency ? String(eventDetail.currency) : '',
            speakerName: eventDetail.speakerName || eventDetail.speaker || '',
            language: eventDetail.language || 'ua',
            seats: String(eventDetail.seats?.total || ''),
            minAge: typeof eventDetail.minAge === 'number' ? eventDetail.minAge : 18,
            maxAge: typeof eventDetail.maxAge === 'number' ? eventDetail.maxAge : 100,
            sex: eventDetail.sex,
            eventType: eventDetail.eventType || EventType.Tastings,
            tastingType: eventDetail.tastingType || TastingType.Regular,
            participationCondition: eventDetail.participationCondition,
            requiresConfirmation: !!eventDetail.requiresConfirmation,
        };

        const initialSelectedWines: IWineSetSearchItem[] = (eventDetail.wineSet || []).map(item => ({
            id: item.wineId || item.wine.id,
            name: item.wine.name,
            producer: item.wine.producer || '',
            vintage: item.wine.vintage || null,
            image: mapWineImageToMedia(item.wine.image),
            grapeVariety: null,
            country: null,
            region: null,
        }));

        navigation.navigate('AddEventView', {
            draft,
            initialSelectedWines,
            editEventId: eventDetail.id,
        });
    }, [navigation]);

    return {
        mapPins,
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCardPress,
        onCloseModal,
        onModalReadMorePress,
        onModalFavoritePress,
        onReadMorePress,
        onEditPress,
        onFavoritePress,
    };
};
