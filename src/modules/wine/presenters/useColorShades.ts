import { useMemo } from 'react';
import { IColorStatistic } from '@/entities/wine/types/IWineDetails';
import { useUiContext } from '@/UIProvider';
import { declOfWord } from '@/utils';

export interface IColorShadeItem {
    id: string;
    colorHex: string;
    label: string;
    count: string;
}

export const useColorShades = (topColors: IColorStatistic[] | null) => {
    const { t } = useUiContext();

    const colorShadeItems = useMemo(() => {
        if (!topColors) return [];

        const items: IColorShadeItem[] = [];

        topColors.forEach((colorItem) => {
            if (colorItem.pale?.userCount && colorItem.pale.userCount > 0) {
                items.push({
                    id: `${colorItem.id}-pale`,
                    colorHex: colorItem.pale.colorHex,
                    label: `${t('wine.pale')} ${colorItem.name}`,
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
                    count: `(${declOfWord(
                        Number(colorItem.deep.userCount),
                        t('scanner.reviewCount') as unknown as Array<string>,
                    )})`,
                });
            }
        });

        return items;
    }, [topColors, t]);

    return { colorShadeItems };
};
