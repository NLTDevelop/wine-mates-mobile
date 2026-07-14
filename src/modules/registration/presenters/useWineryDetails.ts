import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { wineService } from '@/entities/wine/services/WineService';
import { ICountry } from '@/entities/wine/types/ICountry';
import { ICountry as ICountryPicker } from '@/libs/countryCodePicker/types/ICountry';
import { registerUserModel } from '@/entities/users/RegisterUserModel';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { localization } from '@/UIProvider/localization/Localization';
import countriesData from 'world-countries';
import { CountryCode } from 'libphonenumber-js';
import { useWineRegion } from '@/modules/scanner/presenters/useWineRegion';

const MIN_FOUNDED_YEAR = 1000;

const getPickerCountry = (country: ICountry): ICountryPicker | null => {
    const worldCountry = countriesData.find(item => item.cca2 === country.code.toUpperCase());

    if (!worldCountry) {
        return null;
    }

    const callingCode =
        worldCountry.idd.root && worldCountry.idd.suffixes?.[0]
            ? `${worldCountry.idd.root}${worldCountry.idd.suffixes[0]}`
            : '';

    return {
        id: country.id,
        name: country.name,
        cca2: worldCountry.cca2 as CountryCode,
        callingCode,
    };
};

export const useWineryDetails = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [countries, setCountries] = useState<ICountryPicker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCountriesLoadingError, setIsCountriesLoadingError] = useState(false);
    const [isError, setIsError] = useState({ status: false, errorText: '' });
    const [form, setForm] = useState({
        name: registerUserModel.user?.winery?.name || '',
        foundedYear: registerUserModel.user?.winery?.foundedYear?.toString() || '',
        description: registerUserModel.user?.winery?.description || '',
        country: null as ICountryPicker | null,
        regionId: registerUserModel.user?.winery?.regionId || null,
        links: registerUserModel.user?.winery?.links.join('\n') || '',
    });
    const { regions } = useWineRegion(form.country?.id);

    const isDisabled = useMemo(() => {
        return (
            !form.name.trim() ||
            !form.foundedYear.trim() ||
            !form.description.trim() ||
            !form.country ||
            isError.status ||
            isCountriesLoadingError
        );
    }, [form, isCountriesLoadingError, isError.status]);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const response = await wineService.getCountries();

                if (response.isError || !response.data) {
                    setIsCountriesLoadingError(true);
                    return;
                }

                setCountries(
                    response.data.map(getPickerCountry).filter((country): country is ICountryPicker => !!country),
                );
            } catch {
                setIsCountriesLoadingError(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadCountries();
    }, []);

    const onChangeName = useCallback((name: string) => {
        setForm(previous => ({ ...previous, name }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeFoundedYear = useCallback((foundedYear: string) => {
        setForm(previous => ({ ...previous, foundedYear }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeDescription = useCallback((description: string) => {
        setForm(previous => ({ ...previous, description }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeLinks = useCallback((links: string) => {
        setForm(previous => ({ ...previous, links }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeCountry = useCallback((country: ICountryPicker) => {
        setForm(previous => ({ ...previous, country, regionId: null }));
        setIsError({ status: false, errorText: '' });
    }, []);

    const onChangeRegion = useCallback((region: IDropdownItem) => {
        setForm(previous => ({ ...previous, regionId: region.id as number }));
    }, []);

    const onNextPress = useCallback(() => {
        if (!registerUserModel.user || !form.country?.id) {
            return;
        }

        const foundedYear = Number(form.foundedYear);
        const currentYear = new Date().getFullYear();

        if (!Number.isInteger(foundedYear) || foundedYear < MIN_FOUNDED_YEAR || foundedYear > currentYear) {
            setIsError({ status: true, errorText: localization.t('registration.foundedYearError') });
            return;
        }

        registerUserModel.user = {
            ...registerUserModel.user,
            winery: {
                name: form.name.trim(),
                foundedYear,
                description: form.description.trim(),
                countryId: form.country.id,
                regionId: form.regionId,
                links: form.links
                    .split(/[\n,]/)
                    .map(link => link.trim())
                    .filter(Boolean),
            },
        };
        navigation.navigate('CreatePasswordView');
    }, [form, navigation]);

    return {
        form,
        countries,
        regions,
        isLoading,
        isError,
        isDisabled,
        onChangeName,
        onChangeFoundedYear,
        onChangeDescription,
        onChangeLinks,
        onChangeCountry,
        onChangeRegion,
        onNextPress,
    };
};
