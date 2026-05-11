import { useCallback, useEffect, useState } from 'react';
import { useEventDetails } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetails';
import { useEventDetailsData } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsData';
import { eventsService } from '@/entities/events/EventsService';
import { userModel } from '@/entities/users/UserModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { IAddEventDraft } from '@/modules/event/types/IAddEventDraft';
import { IWineSetSearchItem } from '@/entities/wine/types/IWineSetSearchItem';
import { TastingType } from '@/entities/events/enums/TastingType';
import { EventType } from '@/entities/events/enums/EventType';
import { IMedia } from '@/entities/media/types/IMedia';

interface IProps {
    eventId: number;
}

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

export const useEventDetailsTab = ({ eventId }: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const { eventDetail, setEventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems, contactItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const [isBookNowInProgress, setIsBookNowInProgress] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const isEventApplied = Boolean(eventDetail?.isApplied);

    const eventStartDateRaw = eventDetail?.eventStartDate || eventDetail?.eventDate;
    const eventStartTimeRaw = eventDetail?.eventStartTime || eventDetail?.eventTime || '00:00';
    const eventStartDateTime = eventStartDateRaw ? new Date(`${eventStartDateRaw}T${eventStartTimeRaw}`) : null;
    const hasEventStarted = eventStartDateTime ? eventStartDateTime.getTime() <= currentTime.getTime() : false;
    const seatsLeft = eventDetail?.seats?.left;
    const hasNoSeatsLeft = typeof seatsLeft === 'number' && seatsLeft <= 0;
    const isEventInactive = eventDetail?.isActive === false;
    const isBookNowDisabled = isEventInactive || hasEventStarted || (!isEventApplied && hasNoSeatsLeft);
    const isCancelEventDisabled = hasEventStarted || isEventInactive;

    const onBookNowPress = useCallback(async () => {
        if (!eventDetail || isBookNowDisabled || isBookNowInProgress) {
            return;
        }

        setIsBookNowInProgress(true);
        try {
            if (isEventApplied) {
                const response = await eventsService.cancelApplyForEvent(eventId);
                if (response.isError) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                    return;
                }

                if (!response.isError) {
                    const nextSeatsLeft = typeof eventDetail.seats?.left === 'number'
                        ? eventDetail.seats.left + 1
                        : undefined;
                    setEventDetail({
                        ...eventDetail,
                        isApplied: false,
                        seats: eventDetail.seats && typeof nextSeatsLeft === 'number'
                            ? {
                                ...eventDetail.seats,
                                left: nextSeatsLeft,
                            }
                            : eventDetail.seats,
                    });
                }

                return;
            }

            const response = await eventsService.applyForEvent(eventId);
            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            if (!response.isError) {
                const nextSeatsLeft = typeof eventDetail.seats?.left === 'number'
                    ? Math.max(0, eventDetail.seats.left - 1)
                    : undefined;
                setEventDetail({
                    ...eventDetail,
                    isApplied: true,
                    seats: eventDetail.seats && typeof nextSeatsLeft === 'number'
                        ? {
                            ...eventDetail.seats,
                            left: nextSeatsLeft,
                        }
                        : eventDetail.seats,
                });
            }
        } catch (error) {
            console.warn('useEventDetailsTab -> onBookNowPress: ', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsBookNowInProgress(false);
        }
    }, [eventDetail, eventId, isBookNowDisabled, isBookNowInProgress, isEventApplied, setEventDetail]);

    const onFavoritePress = useCallback(async () => {
        try {
            const response = await eventsService.toggleSave(eventId);
            if (response.isError || !eventDetail) {
                return;
            }

            const nextIsSaved = typeof response.data?.isSaved === 'boolean'
                ? response.data.isSaved
                : !eventDetail.isSaved;

            setEventDetail({
                ...eventDetail,
                isSaved: nextIsSaved,
            });
        } catch (error) {
            console.warn('useEventDetailsTab -> onFavoritePress: ', error);
        }
    }, [eventDetail, eventId, setEventDetail]);

    const onCancelEventPress = useCallback(async () => {
        if (!eventDetail || isCancelEventDisabled || isBookNowInProgress) {
            return;
        }

        setIsBookNowInProgress(true);
        try {
            const response = await eventsService.updateEvent(eventId, { isActive: false });
            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            setEventDetail({
                ...eventDetail,
                isActive: false,
            });
        } catch (error) {
            console.warn('useEventDetailsTab -> onCancelEventPress: ', error);
            toastService.showError(
                localization.t('common.errorHappened'),
                localization.t('common.somethingWentWrong'),
            );
        } finally {
            setIsBookNowInProgress(false);
        }
    }, [eventDetail, eventId, isBookNowInProgress, isCancelEventDisabled, setEventDetail]);

    const onEditPress = useCallback(() => {
        if (!eventDetail) {
            return;
        }

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
    }, [eventDetail, navigation]);
    const onDuplicatePress = useCallback(() => {
        if (!eventDetail) {
            return;
        }

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
            eventStartDate: '',
            eventEndDate: '',
            eventStartTime: '',
            eventEndTime: '',
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
        });
    }, [eventDetail, navigation]);
    const isOwner = !!eventDetail?.ownerId && eventDetail.ownerId === userModel.user?.id;

    return {
        isLoading,
        isError,
        eventDetail,
        detailsData,
        wineSetItems,
        contactItems,
        cardPreviewData,
        onBookNowPress,
        onCancelEventPress,
        onFavoritePress,
        onEditPress,
        onDuplicatePress,
        isOwner,
        isBookNowDisabled,
        isCancelEventDisabled,
        isBookNowInProgress,
        isEventApplied,
    };
};
