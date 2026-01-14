import { wineService } from "@/entities/wine/WineService";
import { toastService } from "@/libs/toast/toastService";
import { localization } from "@/UIProvider/localization/Localization";
import { useCallback, useEffect, useState } from "react";
import { IDropdownItem } from "@/UIKit/CustomDropdown/types/IDropdownItem";
import { IWineType } from "@/entities/wine/types/IWineType";
import { ICountry } from "@/entities/wine/types/ICountry";

export const useWineInitialData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [typeData, setTypeData] = useState<IDropdownItem[]>([]);
    const [countries, setCountries] = useState<IDropdownItem[]>([]);

    const getInitialData = useCallback(async () => {
        try {
            setIsLoading(true);

            const [typesResponse, countriesResponse] = await Promise.all([
                wineService.getTypes(),
                wineService.getCountries(),
            ]);

            const hasTypesError = typesResponse.isError || !typesResponse.data;
            const hasCountriesError = countriesResponse.isError || !countriesResponse.data;

            if (hasTypesError || !typesResponse.data) {
                if (typesResponse.message) {
                    toastService.showError(localization.t('common.errorHappened'), typesResponse.message);
                }
            } else {
                setTypeData(
                    typesResponse.data.map((type: IWineType) => {
                        const label = type.name;
                        return {
                            label,
                            value: label,
                            id: type.id,
                            isSparkling: type.isSparkling,
                        };
                    }),
                );
            }

            if (hasCountriesError || !countriesResponse.data) {
                if (countriesResponse.message) {
                    toastService.showError(localization.t('common.errorHappened'), countriesResponse.message);
                }
            } else {
                setCountries(
                    countriesResponse.data.map((country: ICountry) => {
                        const label = country.name;
                        return {
                            label,
                            value: label,
                            id: country.id,
                        };
                    }),
                );
            }

            setIsError(hasTypesError || hasCountriesError);
        } catch(error) {
            console.error(JSON.stringify(error, null, 2));
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getInitialData();
    }, [getInitialData]);

    return { countries, typeData, getTypes: getInitialData, isLoading, isError };
};
