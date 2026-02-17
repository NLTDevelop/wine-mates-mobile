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
            item.grapeVariety,
            item.name,
            item.type?.name,
            item.color?.name,
            item.country?.name,
            item.region?.name,
        ]
            .filter(Boolean)
            .join(', ');
    }, [item.type?.name, item.color?.name, item.country?.name, item.region?.name, item.grapeVariety, item.name]);

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

        if (rating >= 80) {
            return {
                label: t('medal.nice'),
            };
        }

        if (rating >= 75) {
            return {
                label: t('medal.simple'),
            };
        }

        return {
            label: t('medal.weak'),
        };
    }, [item.averageExpertRating, t]);

    return {
        description,
        medalData,
    };
};
