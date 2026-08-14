import { IWineDetails } from '@/entities/wine/types/IWineDetails';

export const getHasDetailedTasting = (data: IWineDetails) => {
    const { statistics } = data;

    return Boolean(
        statistics.topColors?.length ||
            statistics.topAromas?.length ||
            statistics.topFlavors?.length ||
            statistics.tasteCharacteristics?.some(
                item => item.selectedIndex !== null && item.selectedIndex !== undefined,
            ) ||
            data.aiTastingNote ||
            data.aiSnacks?.length,
    );
};
