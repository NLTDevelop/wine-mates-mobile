import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { SavedEventStatus } from '@/entities/events/enums/SavedEventStatus';
import { AppliedEventStatus } from '@/entities/events/enums/AppliedEventStatus';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventDetail } from '@/entities/events/types/IEvent';

interface IProps {
    eventDetail: IEventDetail | null;
    setEventDetail: React.Dispatch<React.SetStateAction<IEventDetail | null>>;
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

interface IEventDetailWithBookingStatus {
    appliedEventStatus?: AppliedEventStatus | string;
    bookingStatus?: AppliedEventStatus | string;
    applicationStatus?: AppliedEventStatus | string;
    status?: string;
}

const WINE_ACCESS_BEFORE_START_MS = 15 * 60 * 1000;
const TASTING_START_BEFORE_EVENT_MS = 15 * 60 * 1000;
const TASTING_STOP_AFTER_END_MS = 24 * 60 * 60 * 1000;

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
        .filter(item => item.isVisible !== false)
        .map(item => {
            return {
                id: Number(item.id || 0),
                name: item.name || '',
                paymentDetails: item.paymentDetails || '',
                description: item.description || '',
                qrCodeOriginalUrl: item.qrCode?.originalUrl || '',
            };
        })
        .filter(item => item.id > 0 && !!item.name);
};

const getEventDateTime = (date?: string | null, time?: string | null) => {
    if (!date || !time) {
        return null;
    }

    const eventDateTime = new Date(`${date}T${time}`);

    if (Number.isNaN(eventDateTime.getTime())) {
        return null;
    }

    return eventDateTime;
};

export const useEventDetailsTab = ({ eventDetail, setEventDetail }: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
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
    const isBlindTasting = eventDetail?.tastingType === TastingType.Blind;
    const isOwner = !!eventDetail?.ownerId && eventDetail.ownerId === userModel.user?.id;
    const eventPaymentMethods = useMemo(() => {
        return getEventPaymentMethods(eventDetail as IEventDetailWithPaymentMethods | null);
    }, [eventDetail]);
    const selectedPaymentMethod = useMemo(() => {
        if (selectedPaymentMethodId === null) {
            return null;
        }

        return eventPaymentMethods.find(item => item.id === selectedPaymentMethodId) || null;
    }, [eventPaymentMethods, selectedPaymentMethodId]);

    const onSelectPaymentMethod = useCallback((id: number) => {
        setSelectedPaymentMethodId(id);
    }, []);

    const paymentMethodOptions = useMemo<IEventPaymentMethodOption[]>(() => {
        return eventPaymentMethods.map(item => {
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
    const eventEndDateRaw = eventDetail?.eventEndDate || eventDetail?.eventDate || null;
    const eventEndTimeRaw = eventDetail?.eventEndTime || eventDetail?.endTime || null;
    const eventEndDateTime = getEventDateTime(eventEndDateRaw, eventEndTimeRaw);
    const eventStartDateTime =
        eventStartDateRaw && eventStartTimeRaw ? new Date(`${eventStartDateRaw}T${eventStartTimeRaw}`) : null;
    const hasEventStarted =
        eventStartDateTime && !Number.isNaN(eventStartDateTime.getTime())
            ? eventStartDateTime.getTime() <= currentTime.getTime()
            : false;
    const seatsLeft = eventDetail?.seats?.left;
    const hasNoSeatsLeft = typeof seatsLeft === 'number' && seatsLeft <= 0;
    const isEventInactive = eventDetail?.isActive === false;
    const eventStatus = String((eventDetail as { status?: string } | null)?.status || '').toLowerCase();
    const isEventFinished = eventStatus === SavedEventStatus.FINISHED;
    const isEventCanceled = eventStatus === SavedEventStatus.CANCELED || eventStatus === 'cancelled';
    const isBookNowDisabled = isEventInactive || isEventFinished || isEventCanceled || isEventApplied || hasNoSeatsLeft;
    const isCancelEventDisabled = hasEventStarted || isEventInactive;
    const appliedEventStatus = eventsModel.appliedEvents.find(item => item.event.id === eventDetail?.id)?.status
        || (eventDetail as IEventDetailWithBookingStatus | null)?.appliedEventStatus
        || (eventDetail as IEventDetailWithBookingStatus | null)?.bookingStatus
        || (eventDetail as IEventDetailWithBookingStatus | null)?.applicationStatus
        || (eventDetail as IEventDetailWithBookingStatus | null)?.status;
    const isBookingAccepted = eventDetail?.requiresConfirmation
        ? appliedEventStatus === AppliedEventStatus.ACCEPTED
        : isEventApplied;
    const isWineAccessTimeAvailable = eventStartDateTime && eventEndDateTime
        ? currentTime.getTime() >= eventStartDateTime.getTime() - WINE_ACCESS_BEFORE_START_MS
            && currentTime.getTime() <= eventEndDateTime.getTime()
        : false;
    const hasEventEnded = eventEndDateTime
        ? currentTime.getTime() > eventEndDateTime.getTime()
        : false;
    const isTastingStarted = Boolean(eventDetail?.isTastingStarted);
    const isBeforeStartWindow = eventStartDateTime
        ? currentTime.getTime() <= eventStartDateTime.getTime() - TASTING_START_BEFORE_EVENT_MS
        : false;
    const isStopWindowAvailable = eventEndDateTime
        ? currentTime.getTime() <= eventEndDateTime.getTime() + TASTING_STOP_AFTER_END_MS
        : false;
    const isTastingToggleVisible = isOwner
        && (isTastingStarted ? isStopWindowAvailable : isBeforeStartWindow);
    const isTastingToggleDisabled = isBookNowInProgress || isEventInactive || isEventCanceled || isEventFinished;
    const isWineSetAccessAvailable = isTastingStarted || isWineAccessTimeAvailable;
    const isWineSetStatusVisible = Boolean(
        eventDetail
        && !isOwner
        && isEventApplied
        && isBookingAccepted
        && isWineSetAccessAvailable
    );
    const isWineSetItemPressEnabled = Boolean(
        eventDetail
        && !isOwner
        && isEventApplied
        && isBookingAccepted
        && isWineSetAccessAvailable
        && !isEventInactive
        && !isEventCanceled,
    );

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

    const onApplyForEvent = useCallback(
        async (showPaymentInfoModal: boolean) => {
            if (!eventDetail) {
                return;
            }

            setIsBookNowInProgress(true);
            try {
                const response = await eventsService.applyForEvent(eventDetail.id);
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
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsBookNowInProgress(false);
            }
        },
        [eventDetail, selectedPaymentMethodId, setEventDetail],
    );

    const onNextPaymentMethodPress = useCallback(async () => {
        if (selectedPaymentMethodId === null) {
            return;
        }

        setIsPaymentMethodsModalVisible(false);
        await onApplyForEvent(true);
    }, [onApplyForEvent, selectedPaymentMethodId]);

    const onBookNowPress = useCallback(async () => {
        if (!eventDetail || isBookNowDisabled || isBookNowInProgress) {
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
        isBookNowDisabled,
        isBookNowInProgress,
        onApplyForEvent,
        onOpenPaymentMethodsModal,
    ]);

    const onFavoritePress = useCallback(async () => {
        try {
            if (eventDetail?.id) {
                const response = await eventsService.toggleSave(eventDetail.id);
                if (response.isError || !eventDetail) {
                    return;
                }

                const nextIsSaved =
                    typeof response.data?.isSaved === 'boolean' ? response.data.isSaved : !eventDetail.isSaved;

                setEventDetail({
                    ...eventDetail,
                    isSaved: nextIsSaved,
                });
            }
        } catch (error) {
            console.warn('useEventDetailsTab -> onFavoritePress: ', error);
        }
    }, [eventDetail, setEventDetail]);

    const onCancelEventPress = useCallback(async () => {
        if (!eventDetail || isCancelEventDisabled || isBookNowInProgress) {
            return;
        }

        setIsBookNowInProgress(true);
        try {
            const response = await eventsService.updateEvent(eventDetail.id, { isActive: false });
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
    }, [eventDetail, isBookNowInProgress, isCancelEventDisabled, setEventDetail]);

    const onToggleTastingPress = useCallback(async () => {
        if (!eventDetail || !isTastingToggleVisible || isTastingToggleDisabled) {
            return;
        }

        const nextIsTastingStarted = !isTastingStarted;

        setIsBookNowInProgress(true);
        try {
            const response = await eventsService.updateEvent(eventDetail.id, {
                isTastingStarted: nextIsTastingStarted,
            });

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            setEventDetail({
                ...eventDetail,
                isTastingStarted: nextIsTastingStarted,
            });
        } catch (error) {
            console.warn('useEventDetailsTab -> onToggleTastingPress: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsBookNowInProgress(false);
        }
    }, [
        eventDetail,
        isTastingStarted,
        isTastingToggleDisabled,
        isTastingToggleVisible,
        setEventDetail,
    ]);

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
    return {
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
        onToggleTastingPress,
        isOwner,
        isBookNowDisabled,
        isCancelEventDisabled,
        isBookNowInProgress,
        isEventApplied,
        isBlindTasting,
        isWineSetItemPressEnabled,
        isWineSetStatusVisible,
        hasEventEnded,
        isTastingToggleVisible,
        isTastingToggleDisabled,
        tastingToggleButtonText: isTastingStarted ? localization.t('eventDetails.stopEvent') : localization.t('eventDetails.startEvent'),
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
