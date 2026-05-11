import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { IList } from '@/entities/IList';
import { IEvent } from '@/entities/events/types/IEvent';
import { ISavedEvent } from '@/entities/events/types/ISavedEvent';
import { IAppliedEvent } from '@/entities/events/types/IAppliedEvent';

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

    const onReadMorePress = useCallback((eventId: number) => {
        navigation.navigate('EventDetailsView', { eventId });
    }, [navigation]);

    const onCardPress = useCallback((eventId: number) => {
        setSelectedEventId(eventId);
        setIsModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedEventId(null);
    }, []);

    const onModalReadMorePress = useCallback((eventId: number) => {
        onCloseModal();
        navigation.navigate('EventDetailsView', { eventId });
    }, [navigation, onCloseModal]);

    const selectedCreatedEvent = createdEvents?.rows.find(event => event.id === selectedEventId);
    const selectedSavedEvent = savedEvents?.rows.find(event => event.id === selectedEventId);
    const selectedAppliedEvent = appliedEvents.find(item => item.event.id === selectedEventId)?.event;
    const selectedEvent = selectedCreatedEvent || selectedSavedEvent || selectedAppliedEvent || null;

    return {
        screenIndex,
        routes,
        onIndexChange,
        onReadMorePress,
        selectedEvent,
        isModalVisible,
        onCardPress,
        onCloseModal,
        onModalReadMorePress,
    };
};
