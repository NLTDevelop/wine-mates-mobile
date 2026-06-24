import { SavedEventStatus } from '@/entities/events/enums/SavedEventStatus';
import { EventTastingStatus } from '@/entities/events/enums/EventTastingStatus';
import { getUtcEventDateTime } from '@/modules/event/utils/eventDateTimeUtc';

interface IEventEditAvailabilitySource {
    eventStartDate?: string | null;
    eventDate?: string | null;
    eventStartTime?: string | null;
    eventTime?: string | null;
    status?: string | null;
    tastingStatus?: string | null;
    isTastingStarted?: boolean | null;
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
    const tastingStatus = String(event.tastingStatus || '').toLowerCase();
    const isTastingStarted =
        event.isTastingStarted ||
        tastingStatus === EventTastingStatus.IN_PROGRESS || tastingStatus === EventTastingStatus.FINISHED;

    return hasEventStarted || isTastingStarted || isEventInactive || isEventFinished || isEventCanceled;
};
