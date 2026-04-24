import { useCallback, useState } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';

interface IRoute {
    key: 'eventDetails' | 'guests';
    title: string;
}

interface IProps {
    t: ILocalization['t'];
}

export const useEventDetailsView = ({ t }: IProps) => {
    const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
    const [screenIndex, setScreenIndex] = useState(0);

    const routes: IRoute[] = [
        { key: 'eventDetails', title: t('eventDetails.eventDetailsTab') },
        { key: 'guests', title: t('eventDetails.guestsTab') },
    ];

    const onBookNowPress = useCallback(() => {
        setIsBookingModalVisible(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsBookingModalVisible(false);
    }, []);

    const onFavoritePress = useCallback(() => {}, []);

    const onCallToReservePress = useCallback(() => {}, []);
    const onIndexChange = useCallback((index: number) => {
        setScreenIndex(index);
    }, []);
    const isEventDetailsTab = routes[screenIndex]?.key === 'eventDetails';
    const isGuestsTab = routes[screenIndex]?.key === 'guests';

    return {
        screenIndex,
        routes,
        isEventDetailsTab,
        isGuestsTab,
        isBookingModalVisible,
        onBookNowPress,
        onCloseModal,
        onFavoritePress,
        onCallToReservePress,
        onIndexChange,
    };
};
