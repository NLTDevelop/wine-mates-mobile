import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { IColorStatistic } from '@/entities/wine/types/IColorStatistic';
import { IColorShadeItem } from '@/modules/wine/types/IColorShadeItem';
import { declOfWord } from '@/utils';

export const createColorShadeItems = (
    topColors: IColorStatistic[] | null,
    t: ILocalization['t'],
) => {
    if (!topColors) {
        return [];
    }

    return topColors.map<IColorShadeItem>(colorItem => {
        const toneLabel = colorItem.tone ? t(`wine.${colorItem.tone}`) : null;

        return {
            id: `${colorItem.id}-${colorItem.tone ?? colorItem.colorHex}`,
            colorHex: colorItem.colorHex,
            label: toneLabel ? `${toneLabel} ${colorItem.name}` : colorItem.name,
            reviews: colorItem.userCount,
            count: `(${declOfWord(
                colorItem.userCount,
                t('scanner.reviewCount') as unknown as Array<string>,
            )})`,
        };
    });
};
