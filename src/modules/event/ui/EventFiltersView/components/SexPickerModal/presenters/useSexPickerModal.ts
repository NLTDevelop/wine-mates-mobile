import { useCallback } from 'react';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { Sex } from '@/entities/events/enums/Sex';

interface IProps {
    t: ILocalization['t'];
    onSelectSex: (sex: Sex) => void;
}

export const useSexPickerModal = ({ t, onSelectSex }: IProps) => {
    const onSelectMen = useCallback(() => {
        onSelectSex(Sex.Men);
    }, [onSelectSex]);

    const onSelectWomen = useCallback(() => {
        onSelectSex(Sex.Women);
    }, [onSelectSex]);

    const onSelectAll = useCallback(() => {
        onSelectSex(Sex.All);
    }, [onSelectSex]);

    return {
        menLabel: t('eventFilters.men'),
        womenLabel: t('eventFilters.women'),
        allLabel: t('eventFilters.all'),
        onSelectMen,
        onSelectWomen,
        onSelectAll,
    };
};
