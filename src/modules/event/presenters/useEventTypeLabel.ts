import { useMemo } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { TastingType } from '@/entities/events/enums/TastingType';

interface IProps {
    tastingType: TastingType;
    t: ILocalization['t'];
}

export const useEventTypeLabel = ({ tastingType, t }: IProps) => {
    const labelByType = useMemo(() => ({
        [TastingType.Tastings]: t('event.tastings'),
        [TastingType.Parties]: t('event.parties'),
    }), [t]);

    return labelByType[tastingType];
};
