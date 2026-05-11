import { useCallback, useEffect, useState } from 'react';
import { useEventDetails } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetails';
import { useEventDetailsData } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsData';
import { eventsService } from '@/entities/events/EventsService';
import { userModel } from '@/entities/users/UserModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

interface IProps {
    eventId: number;
}

export const useEventDetailsTab = ({ eventId }: IProps) => {
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
                : !Boolean(eventDetail.isSaved);

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

    const onEditPress = useCallback(() => {}, []);
    const onDuplicatePress = useCallback(() => {}, []);
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
