import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { IList } from '@/entities/IList';
import { IEvent } from '@/entities/events/types/IEvent';
import { ISavedEvent } from '@/entities/events/types/ISavedEvent';
import { IAppliedEvent } from '@/entities/events/types/IAppliedEvent';
import { eventsService } from '@/entities/events/EventsService';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { IMedia } from '@/entities/media/types/IMedia';

interface IRoute {
    key: 'created' | 'saved' | 'applied';
    title: string;
}

interface IProps {
    t: ILocalization['t'];
    createdEvents: IList<IEvent> | null;
    savedEvents: IList<ISavedEvent> | null;
    appliedEvents: IAppliedEvent[];
}

type Navigation = NativeStackNavigationProp<Record<string, object | undefined>>;

const mapWineImageToMedia = (
    image?: { smallUrl?: string; mediumUrl?: string; originalUrl?: string } | null,
): IMedia | null => {
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

export const useEventListView = ({ t, createdEvents, savedEvents, appliedEvents }: IProps) => {
    const navigation = useNavigation<Navigation>();
    const [screenIndex, setScreenIndex] = useState(0);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const routes: IRoute[] = [
        { key: 'created', title: t('event.created') },
        { key: 'saved', title: t('event.saved') },
        { key: 'applied', title: t('event.applied') },
    ];

    const onIndexChange = useCallback((index: number) => {
        setScreenIndex(index);
    }, []);

    const onReadMorePress = useCallback(
        (eventId: number) => {
            navigation.navigate('EventDetailsView', { eventId });
        },
        [navigation],
    );

    const onAddEventPress = useCallback(() => {
        navigation.navigate('AddEventView');
    }, [navigation]);

    const onCardPress = useCallback((eventId: number) => {
        setSelectedEventId(eventId);
        setIsModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedEventId(null);
    }, []);

    const onModalReadMorePress = useCallback(
        (eventId: number) => {
            onCloseModal();
            navigation.navigate('EventDetailsView', { eventId });
        },
        [navigation, onCloseModal],
    );

    const onEditPress = useCallback(
        async (eventId: number) => {
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
                phoneNumber: eventDetail.phoneNumber || '',
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
                repeatRule: eventDetail.repeatRule || null,
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
        },
        [navigation],
    );

    const selectedCreatedEvent = createdEvents?.rows.find(event => event.id === selectedEventId);
    const selectedSavedEvent = savedEvents?.rows.find(event => event.id === selectedEventId);
    const selectedAppliedEvent = appliedEvents.find(item => item.event.id === selectedEventId)?.event;
    const selectedEvent = selectedCreatedEvent || selectedSavedEvent || selectedAppliedEvent || null;

    return {
        screenIndex,
        routes,
        onIndexChange,
        onAddEventPress,
        onReadMorePress,
        selectedEvent,
        isModalVisible,
        onCardPress,
        onCloseModal,
        onModalReadMorePress,
        onEditPress,
    };
};
