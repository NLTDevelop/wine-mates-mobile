import { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import type { PanGesture } from 'react-native-gesture-handler';
import { scaleVertical } from '@/utils';
import type { IEvent } from '@/entities/events/types/IEvent';
import { eventsService } from '@/entities/events/EventsService';
import { homeSectionsModel } from '@/entities/homeSections/HomeSectionsModel';
import { IHomeSectionEventData } from '@/entities/homeSections/types/IHomeSection';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { EventType } from '@/entities/events/enums/EventType';
import { TastingType } from '@/entities/events/enums/TastingType';
import { IMedia } from '@/entities/media/types/IMedia';

type NavigationProp = NativeStackNavigationProp<Record<string, object | undefined>>;

const DEFAULT_CAROUSEL_HEIGHT = scaleVertical(360);

const updateHomeEventFavoriteState = (eventId: number, isSaved: boolean) => {
    homeSectionsModel.sections = homeSectionsModel.sections.map(section => {
        if (section.key !== 'events' || !Array.isArray(section.data)) {
            return section;
        }

        return {
            ...section,
            data: section.data.map(item => {
                const eventItem = item as IHomeSectionEventData;

                if (eventItem.id !== eventId) {
                    return item;
                }

                return {
                    ...eventItem,
                    isSaved,
                };
            }),
        };
    });
};

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

export const useHomeEventSection = (events: IEvent[]) => {
    const navigation = useNavigation<NavigationProp>();
    const carouselRef = useRef<ICarouselInstance>(null);
    const eventsRef = useRef(events);
    const maxCardHeightRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselHeight, setCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
    const itemsCount = events.length;

    const onArrowPress = useCallback(() => {
        navigation.navigate('EventListView');
    }, [navigation]);

    const onReadMorePress = useCallback((eventId: number) => {
        if (eventId > 0) {
            navigation.navigate('EventDetailsView', { eventId });
        }
    }, [navigation]);

    const onFavoritePress = useCallback(async (eventId: number) => {
        const event = events.find(item => item.id === eventId);
        if (!event) {
            return;
        }

        try {
            const nextIsSaved = !event.isSaved;
            const response = event.isSaved
                ? await eventsService.removeFromFavorite(eventId)
                : await eventsService.addToFavorite(eventId);

            if (response.isError) {
                return;
            }

            const responseIsSaved = typeof response.data?.isSaved === 'boolean'
                ? response.data.isSaved
                : nextIsSaved;

            updateHomeEventFavoriteState(eventId, responseIsSaved);
        } catch (error) {
            console.warn('useHomeEventSection -> onFavoritePress: ', error);
        }
    }, [events]);

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

    const onConfigurePanGesture = useCallback((panGesture: PanGesture) => {
        panGesture.activeOffsetX([-12, 12]);
        panGesture.failOffsetY([-8, 8]);
    }, []);

    const onProgressChange = useCallback((_offsetProgress: number, absoluteProgress: number) => {
        const maxIndex = Math.max(0, itemsCount - 1);
        const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(absoluteProgress)));

        setActiveIndex((currentIndex) => {
            if (currentIndex === nextIndex) {
                return currentIndex;
            }

            return nextIndex;
        });
    }, [itemsCount]);

    const onCardLayout = useCallback((event: LayoutChangeEvent) => {
        if (eventsRef.current !== events) {
            eventsRef.current = events;
            maxCardHeightRef.current = 0;
        }

        const nextHeight = Math.ceil(event.nativeEvent.layout.height);

        if (nextHeight <= 0 || nextHeight <= maxCardHeightRef.current) {
            return;
        }

        maxCardHeightRef.current = nextHeight;
        setCarouselHeight(nextHeight);
    }, [events]);

    return {
        carouselRef,
        activeIndex,
        carouselHeight,
        onProgressChange,
        onCardLayout,
        onArrowPress,
        onReadMorePress,
        onFavoritePress,
        onEditPress,
        onConfigurePanGesture,
    };
};
