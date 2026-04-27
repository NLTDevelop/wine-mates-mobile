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
    const [screenIndex, setScreenIndex] = useState(0);

    const routes: IRoute[] = [
        { key: 'eventDetails', title: t('eventDetails.eventDetailsTab') },
        { key: 'guests', title: t('eventDetails.guestsTab') },
    ];

    const onIndexChange = useCallback((index: number) => {
        setScreenIndex(index);
    }, []);

    return {
        screenIndex,
        routes,
        onIndexChange,
    };
};
