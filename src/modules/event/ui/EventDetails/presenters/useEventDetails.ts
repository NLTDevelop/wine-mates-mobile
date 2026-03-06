import { useEffect, useState } from 'react';
import { IEventDetail } from '@/entities/events/types/IEvent';
import { getEventDetailById } from '@/entities/events/mocks/eventMocks';

export const useEventDetails = (eventId: number) => {
    const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const loadEventDetails = async () => {
            setTimeout(() => {
                const detail = getEventDetailById(eventId);
                if (detail) {
                    setEventDetail(detail);
                    setIsError(false);
                } else {
                    setIsError(true);
                }
            }, 1000);
        };

        loadEventDetails();
    }, [eventId]);

    return {
        eventDetail,
        isError,
    };
};
