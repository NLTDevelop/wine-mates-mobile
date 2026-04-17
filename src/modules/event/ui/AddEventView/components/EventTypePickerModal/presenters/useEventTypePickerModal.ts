import { useCallback } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { EventType } from '@/entities/events/enums/EventType';

interface IProps {
    t: ILocalization['t'];
    onSelectType: (type: EventType) => void;
}

export const useEventTypePickerModal = ({ t, onSelectType }: IProps) => {
    const onSelectTastings = useCallback(() => {
        onSelectType(EventType.Tastings);
    }, [onSelectType]);

    const onSelectParties = useCallback(() => {
        onSelectType(EventType.Parties);
    }, [onSelectType]);

    return {
        tastingsLabel: t('event.tastings'),
        partiesLabel: t('event.parties'),
        onSelectTastings,
        onSelectParties,
    };
};
