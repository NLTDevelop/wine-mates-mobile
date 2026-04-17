import { useMemo } from 'react';
import { ITasteProfileStatisticItem } from '@/entities/wine/types/ITasteProfile';
import { useUiContext } from '@/UIProvider';

interface ColorShadeItem {
    id: string;
    name: string;
    colorHex: string;
    count: number;
}

export const useColorShades = (colors: ITasteProfileStatisticItem[]) => {
    const { t } = useUiContext();

    const processedColors = useMemo(() => {
        const result: ColorShadeItem[] = [];

        colors.forEach((color) => {
            const shades: Array<{ type: 'deep' | 'medium' | 'pale'; data: { colorHex: string; count: number } }> = [];

            if (color.deep && color.deep.count > 0) {
                shades.push({ type: 'deep', data: color.deep });
            }
            if (color.medium && color.medium.count > 0) {
                shades.push({ type: 'medium', data: color.medium });
            }
            if (color.pale && color.pale.count > 0) {
                shades.push({ type: 'pale', data: color.pale });
            }

            if (shades.length > 0) {
                shades.forEach((shade) => {
                    const shadeName = t(`wineAndStyles.shades.${shade.type}`);
                    result.push({
                        id: `${color.id}-${shade.type}`,
                        name: `${shadeName} ${color.name}`,
                        colorHex: shade.data.colorHex,
                        count: shade.data.count,
                    });
                });
            } else if (color.count > 0) {
                result.push({
                    id: `${color.id}`,
                    name: color.name,
                    colorHex: color.colorHex,
                    count: color.count,
                });
            }
        });

        return result;
    }, [colors, t]);

    return { processedColors };
};
