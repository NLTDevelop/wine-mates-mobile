import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { IEventPaymentMethod } from '@/modules/event/ui/EventDetailsView/types/IEventPaymentMethod';
import { IEventPaymentMethodOption } from '@/modules/event/ui/EventDetailsView/types/IEventPaymentMethodOption';

interface IProps {
    eventId: number;
}

interface IEventDetailWithPaymentMethods {
    paymentMethods?: Array<{
        id?: number;
        name?: string;
        paymentDetails?: string;
        description?: string;
        isVisible?: boolean;
        qrCode?: {
            originalUrl?: string;
        } | null;
    }>;
}

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

const getEventPaymentMethods = (eventDetail: IEventDetailWithPaymentMethods | null): IEventPaymentMethod[] => {
    if (!eventDetail?.paymentMethods?.length) {
        return [];
    }

    return eventDetail.paymentMethods
        .filter((item) => item.isVisible !== false)
        .map((item) => {
            return {
                id: Number(item.id || 0),
                name: item.name || '',
                paymentDetails: item.paymentDetails || '',
                description: item.description || '',
                qrCodeOriginalUrl: item.qrCode?.originalUrl || '',
            };
        })
        .filter((item) => item.id > 0 && !!item.name);
};

export const useEventDetailsTab = ({ eventId }: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const { eventDetail, setEventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems, contactItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const [isBookNowInProgress, setIsBookNowInProgress] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [isPaymentMethodsModalVisible, setIsPaymentMethodsModalVisible] = useState(false);
    const [isSelectedPaymentMethodModalVisible, setIsSelectedPaymentMethodModalVisible] = useState(false);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const isEventApplied = Boolean(eventDetail?.isApplied);
    const eventPaymentMethods = useMemo(() => {
        return getEventPaymentMethods(eventDetail as IEventDetailWithPaymentMethods | null);
    }, [eventDetail]);
    const selectedPaymentMethod = useMemo(() => {
        if (selectedPaymentMethodId === null) {
            return null;
        }

        return eventPaymentMethods.find((item) => item.id === selectedPaymentMethodId) || null;
    }, [eventPaymentMethods, selectedPaymentMethodId]);

    const onSelectPaymentMethod = useCallback((id: number) => {
        setSelectedPaymentMethodId(id);
    }, []);

    const paymentMethodOptions = useMemo<IEventPaymentMethodOption[]>(() => {
        return eventPaymentMethods.map((item) => {
            return {
                id: item.id,
                name: item.name,
                paymentDetails: item.paymentDetails,
                isSelected: selectedPaymentMethodId === item.id,
                onPress: () => onSelectPaymentMethod(item.id),
            };
        });
    }, [eventPaymentMethods, onSelectPaymentMethod, selectedPaymentMethodId]);

    const eventStartDateRaw = eventDetail?.eventStartDate || eventDetail?.eventDate || null;
    const eventStartTimeRaw = eventDetail?.eventStartTime || eventDetail?.eventTime || null;
    const eventStartDateTime = eventStartDateRaw && eventStartTimeRaw
        ? new Date(`${eventStartDateRaw}T${eventStartTimeRaw}`)
        : null;
    const hasEventStarted = eventStartDateTime && !Number.isNaN(eventStartDateTime.getTime())
        ? eventStartDateTime.getTime() <= currentTime.getTime()
        : false;
    const seatsLeft = eventDetail?.seats?.left;
    const hasNoSeatsLeft = typeof seatsLeft === 'number' && seatsLeft <= 0;
    const isEventInactive = eventDetail?.isActive === false;
    const isBookNowDisabled = isEventInactive || hasEventStarted || (!isEventApplied && hasNoSeatsLeft);
    const isCancelEventDisabled = hasEventStarted || isEventInactive;

    const onOpenPaymentMethodsModal = useCallback(() => {
        setSelectedPaymentMethodId(null);
        setIsPaymentMethodsModalVisible(true);
    }, []);

    const onClosePaymentMethodsModal = useCallback(() => {
        setIsPaymentMethodsModalVisible(false);
    }, []);

    const onCloseSelectedPaymentMethodModal = useCallback(() => {
        setIsSelectedPaymentMethodModalVisible(false);
    }, []);

    const onApplyForEvent = useCallback(async (showPaymentInfoModal: boolean) => {
        if (!eventDetail) {
            return;
        }

        setIsBookNowInProgress(true);
        try {
            const response = await eventsService.applyForEvent(eventId);
            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const nextSeatsLeft =
                typeof eventDetail.seats?.left === 'number' ? Math.max(0, eventDetail.seats.left - 1) : undefined;
            setEventDetail({
                ...eventDetail,
                isApplied: true,
                seats:
                    eventDetail.seats && typeof nextSeatsLeft === 'number'
                        ? {
                              ...eventDetail.seats,
                              left: nextSeatsLeft,
                          }
                        : eventDetail.seats,
            });
            if (showPaymentInfoModal && selectedPaymentMethodId !== null) {
                setIsSelectedPaymentMethodModalVisible(true);
            }
        } catch (error) {
            console.warn('useEventDetailsTab -> onApplyForEvent: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsBookNowInProgress(false);
        }
    }, [eventDetail, eventId, selectedPaymentMethodId, setEventDetail]);

    const onNextPaymentMethodPress = useCallback(async () => {
        if (selectedPaymentMethodId === null) {
            return;
        }

        setIsPaymentMethodsModalVisible(false);
        await onApplyForEvent(true);
    }, [onApplyForEvent, selectedPaymentMethodId]);

    const onBookNowPress = useCallback(async () => {
        if (!eventDetail || isEventApplied || isBookNowInProgress) {
            return;
        }

        if (eventPaymentMethods.length === 0) {
            await onApplyForEvent(false);
            return;
        }

        onOpenPaymentMethodsModal();
    }, [
        eventDetail,
        eventPaymentMethods.length,
        isBookNowInProgress,
        isEventApplied,
        onApplyForEvent,
        onOpenPaymentMethodsModal,
    ]);

    const onFavoritePress = useCallback(async () => {
        try {
            const response = await eventsService.toggleSave(eventId);
            if (response.isError || !eventDetail) {
                return;
            }

            const nextIsSaved =
                typeof response.data?.isSaved === 'boolean' ? response.data.isSaved : !eventDetail.isSaved;

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
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
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
        isPaymentMethodsModalVisible,
        paymentMethodOptions,
        isPaymentMethodNextDisabled: selectedPaymentMethodId === null,
        onClosePaymentMethodsModal,
        onNextPaymentMethodPress,
        isSelectedPaymentMethodModalVisible,
        selectedPaymentMethod,
        onCloseSelectedPaymentMethodModal,
    };
};
