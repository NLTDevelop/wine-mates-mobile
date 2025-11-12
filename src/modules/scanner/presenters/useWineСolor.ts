import { wineModel } from "@/entities/wine/WineModel";
import { wineService } from "@/entities/wine/WineService";
import { toastService } from "@/libs/toast/toastService";
import { localization } from "@/UIProvider/localization/Localization";
import { useCallback, useEffect, useState } from "react";

export const useWineColor = (typeName: string) => {
    const [colorsData, setColorsData] = useState<{label:string, value:string}[]>([]);
    const [isLoadingColors, setIsLoadingColors] = useState(false);
    const [isErrorColors, setIsErrorColors] = useState(false);

    const getColors = useCallback(async (typeId: string): Promise<boolean> => {
        try {
            setIsLoadingColors(true);
            setIsErrorColors(false);
    
            const response = await wineService.getColors({ typeId });
    
            if (response.isError || !response.data) {
                setIsErrorColors(true);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    response.message || localization.t('common.somethingWentWrong')
                );
                return false;
            }
    
            setColorsData(
                response.data.map((color: any) => ({
                    label: color.name,
                    value: color.name,
                }))
            );
    
            return true;
        } catch {
            setIsErrorColors(true);
            return false;
        } finally {
            setIsLoadingColors(false);
        }
    }, []);

    const retryGetColors = useCallback(async () => {
        const typeObj = wineModel.wineTypes?.find(type => type.name === typeName);
        if (!typeObj) return false;
    
        return await getColors(String(typeObj.id));
    }, [typeName, getColors]);

    useEffect(() => {
        const typeObj = wineModel.wineTypes?.find(type => type.name === typeName);
        if (typeObj) {
            getColors(String(typeObj.id));
        } else {
            setColorsData([]);
        }
    }, [typeName, getColors]);


    return { colorsData, isErrorColors, isLoadingColors, retryGetColors };
};
