import { ILocalization } from '@/UIProvider/localization/ILocalization';
import {
    IColorShadeItem,
    IColorStatisticWithShades,
} from '@/modules/wine/types/IColorShadeItem';
import { declOfWord } from '@/utils';

export const createColorShadeItems = (
    topColors: IColorStatisticWithShades[] | null,
    t: ILocalization['t'],
) => {
    if (!topColors) {
        return [];
    }

    const items: IColorShadeItem[] = [];

    topColors.forEach(colorItem => {
        if (colorItem.pale?.userCount && colorItem.pale.userCount > 0) {
            items.push({
                id: `${colorItem.id}-pale`,
                colorHex: colorItem.pale.colorHex,
                label: `${t('wine.pale')} ${colorItem.name}`,
                reviews: colorItem.pale.userCount,
                count: `(${declOfWord(
                    Number(colorItem.pale.userCount),
                    t('scanner.reviewCount') as unknown as Array<string>,
                )})`,
            });
        }

        if (colorItem.medium?.userCount && colorItem.medium.userCount > 0) {
            items.push({
                id: `${colorItem.id}-medium`,
                colorHex: colorItem.medium.colorHex,
                label: `${t('wine.medium')} ${colorItem.name}`,
                reviews: colorItem.medium.userCount,
                count: `(${declOfWord(
                    Number(colorItem.medium.userCount),
                    t('scanner.reviewCount') as unknown as Array<string>,
                )})`,
            });
        }

        if (colorItem.deep?.userCount && colorItem.deep.userCount > 0) {
            items.push({
                id: `${colorItem.id}-deep`,
                colorHex: colorItem.deep.colorHex,
                label: `${t('wine.deep')} ${colorItem.name}`,
                reviews: colorItem.deep.userCount,
                count: `(${declOfWord(
                    Number(colorItem.deep.userCount),
                    t('scanner.reviewCount') as unknown as Array<string>,
                )})`,
            });
        }
    });

    return items;
};
