import { useState, useMemo } from 'react';
import { wineModel } from '@/entities/wine/WineModel';
import { useUiContext } from '@/UIProvider';

export const useSelectedParameters = () => {
    const { t } = useUiContext();
    const [isOpened, setIsOpened] = useState(false);
    const [maxLabelWidth, setMaxLabelWidth] = useState(0);

    const onPress = () => {
        setIsOpened(prevState => !prevState);
    };

    const parameters = useMemo(() => [
        { key: 'typeOfWine', label: t('wine.typeOfWine'), value: wineModel.base?.typeOfWine?.value || t('wine.typeOfWine') },
        { key: 'colorOfWine', label: t('wine.colorOfWine'), value: wineModel.base?.colorOfWine?.value || t('wine.colorOfWine') },
        { key: 'country', label: t('wine.country'), value: wineModel.base?.country?.value || t('wine.country') },
        { key: 'region', label: t('wine.region'), value: wineModel.base?.region?.value || '–' },
        { key: 'wineryName', label: t('wine.wineryName'), value: wineModel.base?.producer?.value || t('wine.wineryName') },
        { key: 'grapeVariety', label: t('wine.grapeVariety'), value: wineModel.base?.grapeVariety?.value || t('wine.grapeVariety') },
        { key: 'vintage', label: t('wine.vintage'), value: wineModel.base?.vintageYear?.value || '–' },
        { key: 'wineName', label: t('wine.wineName'), value: wineModel.base?.wineName?.value || '–', isBold: true },
    ], [t]);

    const handleLabelLayout = (width: number) => {
        setMaxLabelWidth(prev => Math.max(prev, width));
    };

    return { isOpened, onPress, parameters, maxLabelWidth, handleLabelLayout };
};
