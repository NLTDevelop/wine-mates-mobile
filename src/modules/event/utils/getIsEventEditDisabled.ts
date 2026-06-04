import { SavedEventStatus } from '@/entities/events/enums/SavedEventStatus';
import { getUtcEventDateTime } from '@/modules/event/utils/eventDateTimeUtc';

interface IEventEditAvailabilitySource {
    eventStartDate?: string | null;
    eventDate?: string | null;
    eventStartTime?: string | null;
    eventTime?: string | null;
    status?: string | null;
    isActive?: boolean | null;
}

export const getIsEventEditDisabled = (
    event: IEventEditAvailabilitySource | null | undefined,
    currentTime: Date,
) => {
    if (!event) {
        return true;
    }

    const rawStartDate = event.eventStartDate || event.eventDate || '';
    const rawStartTime = event.eventStartTime || event.eventTime || '';
    const eventStartDateTime = getUtcEventDateTime(rawStartDate, rawStartTime);
    const hasEventStarted =
        eventStartDateTime && !Number.isNaN(eventStartDateTime.getTime())
            ? eventStartDateTime.getTime() <= currentTime.getTime()
            : false;
    const status = String(event.status || '').toLowerCase();
    const isEventFinished = status === SavedEventStatus.FINISHED;
    const isEventCanceled = status === SavedEventStatus.CANCELED || status === 'cancelled';
    const isEventInactive = event.isActive === false;

    return hasEventStarted || isEventInactive || isEventFinished || isEventCanceled;
};
