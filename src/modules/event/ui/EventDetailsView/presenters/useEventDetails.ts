import { useEffect, useState } from 'react';
import { IEventDetail } from '@/entities/events/types/IEvent';
import { eventService } from '@/entities/events/EventService';

export const useEventDetails = (eventId: number) => {
    const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEventDetails = async () => {
            setIsLoading(true);
            try {
                const response = await eventService.getById(eventId);
                if (!response.isError && response.data) {
                    setEventDetail(response.data);
                    setIsError(false);
                } else {
                    setIsError(true);
                }
            } catch (error) {
                console.warn('useEventDetails -> loadEventDetails: ', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadEventDetails();
    }, [eventId]);

    return {
        eventDetail,
        isError,
        isLoading,
    };
};
