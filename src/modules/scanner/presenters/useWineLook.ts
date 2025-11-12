import { IWineColorShade } from "@/entities/wine/types/IWineColorShade";
import { wineModel } from "@/entities/wine/WineModel";
import { wineService } from "@/entities/wine/WineService";
import { toastService } from "@/libs/toast/toastService";
import { localization } from "@/UIProvider/localization/Localization";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useWineLook = () => {
    const data = wineModel.colorsShades;
    const [isLoading, setIsLoading] = useState(true);
    const [perlage, setPerlage] = useState(0);
    const [mousse, setMousse] = useState(0);
    const [shade, setShade] = useState(1);
    const [selectedColor, setSelectedColor] = useState(data ? data[0] : null);
    const [isError, setIsError] = useState(false);
    const currentColor = useMemo(() =>
        shade === 1 ? selectedColor?.tonePale : shade === 2 ? selectedColor?.toneMedium : selectedColor?.toneDeep,
    [shade, selectedColor]);

    const getColorsWithShades = useCallback(async () => {
        try {
            if (!wineModel.base?.colorOfWine) return;

            setIsLoading(true);

            const payload = {
                colorId: wineModel.base?.colorOfWine,
            };
    
            const response = await wineService.getColorsWithShades(payload);
    
            if (response.isError) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                } else {
                }
            } else {
                setIsError(false);
            }
        } catch(error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getColorsWithShades();
    }, [getColorsWithShades]);

    const onSelectColor = useCallback((color: IWineColorShade) => {
        setSelectedColor(color);
        setShade(1);
    }, []);
    
    return { 
        data, selectedColor, perlage, setPerlage, mousse, setMousse, shade, setShade, isError, getColorsWithShades, currentColor,
        isLoading, onSelectColor
    };
};
