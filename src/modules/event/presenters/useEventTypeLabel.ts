import { useMemo } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { EventType } from '@/entities/events/enums/EventType';

interface IProps {
    eventType: EventType;
    t: ILocalization['t'];
}

export const useEventTypeLabel = ({ eventType, t }: IProps) => {
    const labelByType = useMemo(() => ({
        [EventType.Tastings]: t('event.tastings'),
        [EventType.Parties]: t('event.parties'),
    }), [t]);

    return labelByType[eventType];
};
