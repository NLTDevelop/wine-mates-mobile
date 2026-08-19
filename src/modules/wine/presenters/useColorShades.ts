import { useMemo } from 'react';
import { IColorStatistic } from '@/entities/wine/types/IColorStatistic';
import { useUiContext } from '@/UIProvider';
import { createColorShadeItems } from '@/modules/wine/presenters/createColorShadeItems';

export const useColorShades = (topColors: IColorStatistic[] | null) => {
    const { t } = useUiContext();

    const colorShadeItems = useMemo(() => {
        return createColorShadeItems(topColors, t);
    }, [topColors, t]);

    return { colorShadeItems };
};
