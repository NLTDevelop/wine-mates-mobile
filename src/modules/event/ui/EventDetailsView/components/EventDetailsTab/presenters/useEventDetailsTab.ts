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
import { EventTastingStatus } from '@/entities/events/enums/EventTastingStatus';
import { eventsModel } from '@/entities/events/EventsModel';
import { IEventDetail } from '@/entities/events/types/IEvent';
import { getUtcEventDateTime } from '@/modules/event/utils/eventDateTimeUtc';
import { getIsEventEditDisabled } from '@/modules/event/utils/getIsEventEditDisabled';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { errorCodes, isErrorWithCode, saveDocuments } from '@react-native-documents/picker';
import {
    errorCodes as viewerErrorCodes,
    isErrorWithCode as isViewerErrorWithCode,
    viewDocument,
} from '@react-native-documents/viewer';

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
const EVENT_TASTING_REPORT_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const getEventTastingStatus = (eventDetail: IEventDetail | null): EventTastingStatus => {
    const rawTastingStatus = String(eventDetail?.tastingStatus || '').toLowerCase();

    if (rawTastingStatus === EventTastingStatus.IN_PROGRESS) {
        return EventTastingStatus.IN_PROGRESS;
    }

    if (rawTastingStatus === EventTastingStatus.FINISHED) {
        return EventTastingStatus.FINISHED;
    }

    if (eventDetail?.isTastingStarted) {
        return EventTastingStatus.IN_PROGRESS;
    }

    return EventTastingStatus.NOT_STARTED;
};

const getEventTastingReportFileName = (eventId: number) => {
    return `event-${eventId}-tasting-report.xlsx`;
};

const writeEventTastingReportFile = async (eventId: number, data: ArrayBuffer) => {
    const fileName = getEventTastingReportFileName(eventId);
    const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    const base64Data = Buffer.from(data).toString('base64');

    await RNFS.writeFile(filePath, base64Data, 'base64');

    return {
        fileName,
        sourceUri: `file://${filePath}`,
    };
};

const getIsUnableToOpenReportFile = (error: unknown) => {
    return isViewerErrorWithCode(error) && error.code === viewerErrorCodes.UNABLE_TO_OPEN_FILE_TYPE;
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

    const eventDateTime = getUtcEventDateTime(date, time);

    if (!eventDateTime || Number.isNaN(eventDateTime.getTime())) {
        return null;
    }

    return eventDateTime;
};

export const useEventDetailsTab = ({ eventDetail, setEventDetail }: IProps) => {
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const { detailsData, wineSetItems, contactItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const [isBookNowInProgress, setIsBookNowInProgress] = useState(false);
    const [isCancelEventInProgress, setIsCancelEventInProgress] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [isPaymentMethodsModalVisible, setIsPaymentMethodsModalVisible] = useState(false);
    const [isSelectedPaymentMethodModalVisible, setIsSelectedPaymentMethodModalVisible] = useState(false);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
    const [isReportDownloading, setIsReportDownloading] = useState(false);
    const [pendingBookingSuccessToastRequiresConfirmation, setPendingBookingSuccessToastRequiresConfirmation] = useState<
        boolean | null
    >(null);

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
    const eventStartDateTime = getEventDateTime(eventStartDateRaw, eventStartTimeRaw);
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
    const eventTastingStatus = getEventTastingStatus(eventDetail);
    const isTastingNotStarted = eventTastingStatus === EventTastingStatus.NOT_STARTED;
    const isTastingInProgress = eventTastingStatus === EventTastingStatus.IN_PROGRESS;
    const isTastingFinished = eventTastingStatus === EventTastingStatus.FINISHED;
    const isBookNowDisabled =
        isEventInactive || isEventFinished || isEventCanceled || isEventApplied || hasNoSeatsLeft || isTastingFinished;
    const isCancelEventDisabled = hasEventStarted || isEventInactive || isEventFinished || isEventCanceled || !isTastingNotStarted;
    const isEditEventDisabled = getIsEventEditDisabled(eventDetail, currentTime);
    const appliedEventStatus =
        eventsModel.appliedEvents.find(item => item.event.id === eventDetail?.id)?.status ||
        (eventDetail as IEventDetailWithBookingStatus | null)?.appliedEventStatus ||
        (eventDetail as IEventDetailWithBookingStatus | null)?.bookingStatus ||
        (eventDetail as IEventDetailWithBookingStatus | null)?.applicationStatus ||
        (eventDetail as IEventDetailWithBookingStatus | null)?.status;
    const isBookingAccepted = eventDetail?.requiresConfirmation
        ? appliedEventStatus === AppliedEventStatus.ACCEPTED
        : isEventApplied;
    const isWineAccessTimeAvailable =
        eventStartDateTime && eventEndDateTime
            ? currentTime.getTime() >= eventStartDateTime.getTime() - WINE_ACCESS_BEFORE_START_MS &&
              currentTime.getTime() <= eventEndDateTime.getTime()
            : false;
    const isBeforeStartWindow = eventStartDateTime
        ? currentTime.getTime() <= eventStartDateTime.getTime() - TASTING_START_BEFORE_EVENT_MS
        : false;
    const isStopWindowAvailable = eventEndDateTime
        ? currentTime.getTime() <= eventEndDateTime.getTime() + TASTING_STOP_AFTER_END_MS
        : false;
    const isTastingToggleVisible =
        isOwner && ((isTastingNotStarted && isBeforeStartWindow) || (isTastingInProgress && isStopWindowAvailable));
    const isTastingToggleDisabled =
        isBookNowInProgress || isEventInactive || isEventCanceled || isEventFinished || isTastingFinished;
    const isReportDownloadVisible = isOwner && isTastingFinished && !isEventCanceled;
    const isWineSetAccessAvailable = (isTastingInProgress || isWineAccessTimeAvailable) && !isTastingFinished;
    const isWineSetStatusAvailable = isWineSetAccessAvailable || isTastingFinished;
    const isWineSetStatusVisible = Boolean(
        eventDetail && isWineSetStatusAvailable && (isOwner || (isEventApplied && isBookingAccepted)),
    );
    const isWineSetItemPressEnabled = Boolean(
        eventDetail &&
        isWineSetAccessAvailable &&
        (isOwner || (isEventApplied && isBookingAccepted)) &&
        !isEventInactive &&
        !isEventCanceled,
    );

    const onOpenPaymentMethodsModal = useCallback(() => {
        setSelectedPaymentMethodId(null);
        setIsPaymentMethodsModalVisible(true);
    }, []);

    const onClosePaymentMethodsModal = useCallback(() => {
        setIsPaymentMethodsModalVisible(false);
    }, []);

    const showBookingSuccessToast = useCallback((requiresConfirmation: boolean) => {
        const bookingSuccessMessage = requiresConfirmation
            ? localization.t('eventDetails.bookingPendingConfirmation')
            : localization.t('eventDetails.bookingSuccess');
        toastService.showSuccess(bookingSuccessMessage);
    }, []);

    const onCloseSelectedPaymentMethodModal = useCallback(() => {
        setIsSelectedPaymentMethodModalVisible(false);
        if (pendingBookingSuccessToastRequiresConfirmation !== null) {
            showBookingSuccessToast(pendingBookingSuccessToastRequiresConfirmation);
            setPendingBookingSuccessToastRequiresConfirmation(null);
        }
    }, [pendingBookingSuccessToastRequiresConfirmation, showBookingSuccessToast]);

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

                const shouldDecreaseSeats = !eventDetail.requiresConfirmation;
                const nextSeatsLeft =
                    shouldDecreaseSeats && typeof eventDetail.seats?.left === 'number'
                        ? Math.max(0, eventDetail.seats.left - 1)
                        : undefined;
                setEventDetail({
                    ...eventDetail,
                    isApplied: true,
                    seats:
                        eventDetail.seats && shouldDecreaseSeats && typeof nextSeatsLeft === 'number'
                            ? {
                                  ...eventDetail.seats,
                                  left: nextSeatsLeft,
                              }
                            : eventDetail.seats,
                });
                const shouldShowPaymentInfoModal = showPaymentInfoModal && selectedPaymentMethodId !== null;
                if (shouldShowPaymentInfoModal) {
                    setPendingBookingSuccessToastRequiresConfirmation(Boolean(eventDetail.requiresConfirmation));
                    setIsSelectedPaymentMethodModalVisible(true);
                    return;
                }
                showBookingSuccessToast(Boolean(eventDetail.requiresConfirmation));
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
        [eventDetail, selectedPaymentMethodId, setEventDetail, showBookingSuccessToast],
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
        if (!eventDetail || isCancelEventDisabled || isCancelEventInProgress) {
            return;
        }

        setIsCancelEventInProgress(true);
        try {
            const response = await eventsService.updateEvent(eventDetail.id, { isActive: false });
            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            if (response.data) {
                setEventDetail(response.data);
            }
        } catch (error) {
            console.warn('useEventDetailsTab -> onCancelEventPress: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsCancelEventInProgress(false);
        }
    }, [eventDetail, isCancelEventDisabled, isCancelEventInProgress, setEventDetail]);

    const onToggleTastingPress = useCallback(async () => {
        if (!eventDetail || !isTastingToggleVisible || isTastingToggleDisabled) {
            return;
        }

        const nextTastingStatus = isTastingInProgress
            ? EventTastingStatus.FINISHED
            : EventTastingStatus.IN_PROGRESS;

        setIsBookNowInProgress(true);
        try {
            const response = await eventsService.updateEvent(eventDetail.id, {
                tastingStatus: nextTastingStatus,
            });

            if (response.isError) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            if (response.data) {
                setEventDetail(response.data);
            }
        } catch (error) {
            console.warn('useEventDetailsTab -> onToggleTastingPress: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsBookNowInProgress(false);
        }
    }, [eventDetail, isTastingInProgress, isTastingToggleDisabled, isTastingToggleVisible, setEventDetail]);

    const onDownloadReportPress = useCallback(async () => {
        if (!eventDetail || !isReportDownloadVisible || isReportDownloading) {
            return;
        }

        setIsReportDownloading(true);
        try {
            const response = await eventsService.exportTastingReport(eventDetail.id);
            if (response.isError || !response.data) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong'),
                );
                return;
            }

            const { fileName, sourceUri } = await writeEventTastingReportFile(eventDetail.id, response.data);
            const saveResponse = await saveDocuments({
                sourceUris: [sourceUri],
                mimeType: EVENT_TASTING_REPORT_MIME_TYPE,
                fileName,
                copy: true,
            });
            const saveError = saveResponse.find(item => item.error)?.error;

            if (saveError) {
                toastService.showError(localization.t('common.errorHappened'), saveError);
                return;
            }

            await viewDocument({
                uri: sourceUri,
                mimeType: EVENT_TASTING_REPORT_MIME_TYPE,
                headerTitle: fileName,
            });

            toastService.showSuccess(localization.t('common.success'), localization.t('eventDetails.reportSaved'));
        } catch (error) {
            if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
                return;
            }

            if (getIsUnableToOpenReportFile(error)) {
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('eventDetails.noReportViewerApp'),
                );
                return;
            }

            console.warn('useEventDetailsTab -> onDownloadReportPress: ', error);
            toastService.showError(localization.t('common.errorHappened'), localization.t('common.somethingWentWrong'));
        } finally {
            setIsReportDownloading(false);
        }
    }, [eventDetail, isReportDownloading, isReportDownloadVisible]);

    const onEditPress = useCallback(() => {
        if (!eventDetail || isEditEventDisabled) {
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
    }, [eventDetail, isEditEventDisabled, navigation]);
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
            isDuplicateEvent: true,
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
        onDownloadReportPress,
        isOwner,
        isBookNowDisabled,
        isEditEventDisabled,
        isCancelEventDisabled,
        isBookNowInProgress,
        isCancelEventInProgress,
        isReportDownloading,
        isEventApplied,
        isBlindTasting,
        isWineSetItemPressEnabled,
        isWineSetStatusVisible,
        isTastingToggleVisible,
        isTastingToggleDisabled,
        isReportDownloadVisible,
        tastingToggleButtonText: isTastingInProgress
            ? localization.t('eventDetails.stopEvent')
            : localization.t('eventDetails.startEvent'),
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
