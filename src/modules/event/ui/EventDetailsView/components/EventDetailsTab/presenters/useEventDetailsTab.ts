import { useCallback, useState } from 'react';
import { useEventDetails } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetails';
import { useEventDetailsData } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsData';

interface IProps {
    eventId: number;
}

export const useEventDetailsTab = ({ eventId }: IProps) => {
    const { eventDetail, isError, isLoading } = useEventDetails(eventId);
    const { detailsData, wineSetItems, cardPreviewData } = useEventDetailsData(eventDetail);
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

    const onBookNowPress = useCallback(() => {
        setIsBookingModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsBookingModalVisible(false);
    }, []);

    const onFavoritePress = useCallback(() => {}, []);

    const onCallToReservePress = useCallback(() => {}, []);

    return {
        isLoading,
        isError,
        eventDetail,
        detailsData,
        wineSetItems,
        cardPreviewData,
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
    };
};
