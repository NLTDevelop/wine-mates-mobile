import { useCallback } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { TastingType } from '@/entities/events/enums/TastingType';

interface IProps {
    t: ILocalization['t'];
    onSelectType: (type: TastingType) => void;
}

export const useEventTypePickerModal = ({ t, onSelectType }: IProps) => {
    const onSelectTastings = useCallback(() => {
        onSelectType(TastingType.Tastings);
    }, [onSelectType]);

    const onSelectParties = useCallback(() => {
        onSelectType(TastingType.Parties);
    }, [onSelectType]);

    return {
        tastingsLabel: t('event.tastings'),
        partiesLabel: t('event.parties'),
        onSelectTastings,
        onSelectParties,
    };
};
