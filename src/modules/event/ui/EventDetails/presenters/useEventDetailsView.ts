import { useCallback, useState } from 'react';

export const useEventDetailsView = () => {
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

    const onBookNowPress = useCallback(() => {
        setIsBookingModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsBookingModalVisible(false);
    }, []);

    return {
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
    };
};
