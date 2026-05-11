import { useCallback, useState } from 'react';
import { useEventDetails } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetails';
import { useEventDetailsData } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsData';
import { eventsService } from '@/entities/events/EventsService';
import { userModel } from '@/entities/users/UserModel';

interface IProps {
    eventId: number;
}

export const useEventDetailsTab = ({ eventId }: IProps) => {
    const { eventDetail, setEventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems, contactItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

    const onBookNowPress = useCallback(() => {
        setIsBookingModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsBookingModalVisible(false);
    }, []);

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

    const onCallToReservePress = useCallback(() => {}, []);
    const onEditPress = useCallback(() => {}, []);
    const isOwner = Boolean(eventDetail?.ownerId) && eventDetail?.ownerId === userModel.user?.id;

    return {
        isLoading,
        isError,
        eventDetail,
        detailsData,
        wineSetItems,
        contactItems,
        cardPreviewData,
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
        onEditPress,
        isOwner,
    };
};
