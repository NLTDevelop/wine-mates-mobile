import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';

interface UseResultHeaderLogicParams {
    item: IWineDetails;
    styles: any;
}

export const useResultHeaderLogic = ({ item, styles }: UseResultHeaderLogicParams) => {
    const { t } = useUiContext();

    const description = useMemo(() => {
        return [
            item.type?.name,
            item.color?.name,
            item.country?.name,
            item.region?.name,
            item.producer,
            item.grapeVariety,
        ]
            .filter(Boolean)
            .join(', ');
    }, [item.type?.name, item.color?.name, item.country?.name, item.region?.name, item.producer, item.grapeVariety]);

    const medalData = useMemo(() => {
        const rating = item.averageExpertRating;

        if (rating >= 97) {
            return {
                label: t('medal.platinum'),
            };
        }

        if (rating >= 94) {
            return {
                label: t('medal.gold'),
            };
        }

        if (rating >= 90) {
            return {
                label: t('medal.silver'),
            };
        }

        if (rating >= 86) {
            return {
                label: t('medal.bronze'),
            };
        }

        return {
            label: t('medal.nice'),
        };
    }, [item.averageExpertRating, t]);

    return {
        description,
        medalData,
    };
};
