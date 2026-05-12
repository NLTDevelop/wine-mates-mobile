import { useCallback, useState } from 'react';
import { useEventDetailsData } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsData';
import { IEventDetail } from '@/entities/events/types/IEvent';

interface IProps {
    eventDetail: IEventDetail | null;
}

export const useEventDetailsTab = ({ eventDetail }: IProps) => {
    const { detailsData, wineSetItems, contactItems, cardPreviewData } = useEventDetailsData(eventDetail);
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
        detailsData,
        wineSetItems,
        contactItems,
        cardPreviewData,
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
    };
};
