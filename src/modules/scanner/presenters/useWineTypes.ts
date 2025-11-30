import { wineService } from "@/entities/wine/WineService";
import { toastService } from "@/libs/toast/toastService";
import { localization } from "@/UIProvider/localization/Localization";
import { useCallback, useEffect, useState } from "react";
import { IDropdownItem } from "@/UIKit/CustomDropdown/types/IDropdownItem";
import { IWineType } from "@/entities/wine/types/IWineType";

export const useWineTypes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [typeData, setTypeData] = useState<IDropdownItem[]>([]);

    const getTypes = useCallback(async () => {
        try {
            setIsLoading(true);
    
            const response = await wineService.getTypes();
    
            if (response.isError || !response.data) {
                if (response.message) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    setIsError(true);
                }
            } else {
                setTypeData(
                    response.data.map((type: IWineType) => {
                        const label = type.name;
                        return {
                            label,
                            value: label,
                            id: type.id,
                            isSparkling: type.isSparkling,
                        };
                    }),
                );
                setIsError(false);
            }
        } catch(error) {
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getTypes();
    }, [getTypes]);

    return { typeData, getTypes, isLoading, isError };
};
