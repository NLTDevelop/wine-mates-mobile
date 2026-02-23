import { useMemo } from 'react';
import { IColorStatistic } from '@/entities/wine/types/IWineDetails';
import { useUiContext } from '@/UIProvider';
import { declOfWord } from '@/utils';
import { wineModel } from '@/entities/wine/WineModel';

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
            const colorShade = wineModel.colorsShades?.find(shade => shade.colorId === colorItem.id);

            if (colorItem.paleCount > 0) {
                items.push({
                    id: `${colorItem.id}-pale`,
                    colorHex: colorShade?.tonePale || colorItem.colorHex || '',
                    label: `${t('wine.pale')} ${colorItem.name}`,
                    count: `(${declOfWord(
                        Number(colorItem.paleCount),
                        t('scanner.reviewCount') as unknown as Array<string>,
                    )})`,
                });
            }

            if (colorItem.mediumCount > 0) {
                items.push({
                    id: `${colorItem.id}-medium`,
                    colorHex: colorShade?.toneMedium || colorItem.colorHex || '',
                    label: `${t('wine.medium')} ${colorItem.name}`,
                    count: `(${declOfWord(
                        Number(colorItem.mediumCount),
                        t('scanner.reviewCount') as unknown as Array<string>,
                    )})`,
                });
            }

            if (colorItem.deepCount > 0) {
                items.push({
                    id: `${colorItem.id}-deep`,
                    colorHex: colorShade?.toneDeep || colorItem.colorHex || '',
                    label: `${t('wine.deep')} ${colorItem.name}`,
                    count: `(${declOfWord(
                        Number(colorItem.deepCount),
                        t('scanner.reviewCount') as unknown as Array<string>,
                    )})`,
                });
            }
        });

        return items;
    }, [topColors, t]);

    return { colorShadeItems };
};
