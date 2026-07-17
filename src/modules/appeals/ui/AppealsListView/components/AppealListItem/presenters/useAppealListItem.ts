import { useMemo } from 'react';
import { IAppeal } from '@/entities/appeals/types/IAppeal';
import { localization } from '@/UIProvider/localization/Localization';

export const useAppealListItem = (appeal: IAppeal, locale: string) => {
    const date = useMemo(() => {
        const parsedDate = new Date(appeal.createdAt);

        if (Number.isNaN(parsedDate.getTime())) {
            return '';
        }

        return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(parsedDate);
    }, [appeal.createdAt, locale]);
    const statusLabel = localization.t(`appeals.status.${appeal.status}`, { locale });

    return { date, statusLabel };
};
